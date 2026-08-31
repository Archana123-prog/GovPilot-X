"""Expert evaluations router — scoring rubric, COI, weighted scoring + audit."""
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..db.connection import get_db
from ..db.models import (
    EvaluationCriteria, EvaluationScore, Application, Challenge,
    User, UserRole, AuditLog
)
from ..auth import get_current_user, require_role

router = APIRouter()


class CriteriaItem(BaseModel):
    name: str
    weight: float   # 0-1, all weights must sum to 1
    max_score: int = 10


class CriteriaCreate(BaseModel):
    challenge_id: UUID
    criteria: List[CriteriaItem]


class CriteriaOut(BaseModel):
    id: str
    challenge_id: str
    criteria: list
    created_at: datetime


class ScoreCreate(BaseModel):
    application_id: UUID
    scores: dict          # {criteria_name: score_value}
    conflict_of_interest: bool = False
    coi_reason: Optional[str] = None
    comments: Optional[str] = None


class ScoreOut(BaseModel):
    id: str
    application_id: str
    evaluator_id: Optional[str]
    scores: dict
    weighted_total: Optional[float]
    conflict_of_interest: bool
    coi_reason: Optional[str]
    comments: Optional[str]
    created_at: datetime


# ─── Criteria ─────────────────────────────────────────────────────────────────

@router.post("/criteria", response_model=CriteriaOut, status_code=201)
async def set_evaluation_criteria(
    data: CriteriaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    # Validate weights sum to ~1
    total_weight = sum(c.weight for c in data.criteria)
    if not (0.99 <= total_weight <= 1.01):
        raise HTTPException(400, f"Criteria weights must sum to 1.0 (got {total_weight:.2f})")

    # Remove existing
    existing = await db.execute(
        select(EvaluationCriteria).where(EvaluationCriteria.challenge_id == data.challenge_id)
    )
    existing = existing.scalar_one_or_none()
    if existing:
        await db.delete(existing)

    ec = EvaluationCriteria(
        challenge_id=data.challenge_id,
        criteria=[c.model_dump() for c in data.criteria],
    )
    db.add(ec)
    await db.commit()
    await db.refresh(ec)
    return CriteriaOut(id=str(ec.id), challenge_id=str(ec.challenge_id), criteria=ec.criteria, created_at=ec.created_at)


@router.get("/criteria/{challenge_id}", response_model=CriteriaOut)
async def get_criteria(challenge_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EvaluationCriteria).where(EvaluationCriteria.challenge_id == challenge_id))
    ec = result.scalar_one_or_none()
    if not ec:
        raise HTTPException(404, "Evaluation criteria not set for this challenge")
    return CriteriaOut(id=str(ec.id), challenge_id=str(ec.challenge_id), criteria=ec.criteria, created_at=ec.created_at)


# ─── Scores ───────────────────────────────────────────────────────────────────

@router.post("/score", response_model=ScoreOut, status_code=201)
async def submit_score(
    data: ScoreCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.evaluator, UserRole.admin)),
):
    # Get application
    app_result = await db.execute(select(Application).where(Application.id == data.application_id))
    app = app_result.scalar_one_or_none()
    if not app:
        raise HTTPException(404, "Application not found")

    # Prevent COI evaluators from scoring
    if data.conflict_of_interest:
        score = EvaluationScore(
            application_id=data.application_id,
            evaluator_id=current_user.id,
            scores={},
            weighted_total=None,
            conflict_of_interest=True,
            coi_reason=data.coi_reason,
        )
        db.add(score)
        await db.commit()
        await db.refresh(score)
        return _score_out(score)

    # Load criteria for weighted scoring
    challenge_result = await db.execute(select(Application).where(Application.id == data.application_id))
    criteria_result = await db.execute(
        select(EvaluationCriteria).where(EvaluationCriteria.challenge_id == app.challenge_id)
    )
    criteria_obj = criteria_result.scalar_one_or_none()

    weighted_total = None
    if criteria_obj:
        weighted_total = 0.0
        for item in criteria_obj.criteria:
            score_val = data.scores.get(item["name"], 0)
            weighted_total += (score_val / item["max_score"]) * item["weight"] * 100

    score = EvaluationScore(
        application_id=data.application_id,
        evaluator_id=current_user.id,
        scores=data.scores,
        weighted_total=weighted_total,
        conflict_of_interest=False,
        coi_reason=None,
        comments=data.comments,
    )
    db.add(score)
    db.add(AuditLog(
        actor_id=current_user.id, action="SUBMIT_EVALUATION_SCORE",
        entity_type="EvaluationScore", entity_id=str(data.application_id),
        details={"weighted_total": weighted_total}
    ))
    await db.commit()
    await db.refresh(score)
    return _score_out(score)


@router.get("/{application_id}/scores", response_model=List[ScoreOut])
async def get_scores(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin, UserRole.evaluator)),
):
    result = await db.execute(
        select(EvaluationScore).where(EvaluationScore.application_id == application_id)
    )
    return [_score_out(s) for s in result.scalars().all()]


@router.get("/{application_id}/average")
async def average_score(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    result = await db.execute(
        select(func.avg(EvaluationScore.weighted_total))
        .where(
            EvaluationScore.application_id == application_id,
            EvaluationScore.conflict_of_interest == False,
            EvaluationScore.weighted_total != None,
        )
    )
    avg = result.scalar()
    return {"application_id": str(application_id), "average_score": round(avg, 2) if avg else None}


def _score_out(s: EvaluationScore) -> ScoreOut:
    return ScoreOut(
        id=str(s.id),
        application_id=str(s.application_id),
        evaluator_id=str(s.evaluator_id) if s.evaluator_id else None,
        scores=s.scores or {},
        weighted_total=s.weighted_total,
        conflict_of_interest=s.conflict_of_interest,
        coi_reason=s.coi_reason,
        comments=s.comments,
        created_at=s.created_at,
    )
