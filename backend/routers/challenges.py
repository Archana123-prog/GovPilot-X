"""Challenges router — full CRUD with DB persistence."""
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..db.connection import get_db
from ..db.models import (
    Challenge, ChallengeStatus, Department, User, UserRole, AuditLog
)
from ..auth import get_current_user, require_role

router = APIRouter()


# ─── Schemas ──────────────────────────────────────────────────────────────────

class ChallengeCreate(BaseModel):
    title: str
    problem_context: str
    current_pain: str
    desired_outcome: str
    constraints: Optional[str] = None
    pilot_budget_lakhs: float
    timeline_months: int = 6
    tags: List[str] = []
    sector: Optional[str] = None
    kpi_criteria: dict = {}
    application_deadline: Optional[datetime] = None


class ChallengeOut(BaseModel):
    id: str
    department_id: str
    title: str
    problem_context: str
    current_pain: str
    desired_outcome: str
    constraints: Optional[str]
    pilot_budget_lakhs: float
    timeline_months: int
    tags: List[str]
    sector: Optional[str]
    kpi_criteria: dict
    status: str
    application_deadline: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class ChallengeStatusUpdate(BaseModel):
    status: ChallengeStatus


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/", response_model=ChallengeOut, status_code=201)
async def create_challenge(
    data: ChallengeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    dept = await db.execute(select(Department).where(Department.user_id == current_user.id))
    dept = dept.scalar_one_or_none()
    if not dept:
        raise HTTPException(400, "Department profile not found")

    challenge = Challenge(
        department_id=dept.id,
        **data.model_dump(exclude_unset=True),
    )
    db.add(challenge)
    db.add(AuditLog(actor_id=current_user.id, action="CREATE_CHALLENGE", entity_type="Challenge", details={"title": data.title}))
    await db.commit()
    await db.refresh(challenge)
    return _to_out(challenge)


@router.get("/", response_model=List[ChallengeOut])
async def list_challenges(
    status: Optional[str] = None,
    sector: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    q = select(Challenge)
    if status:
        q = q.where(Challenge.status == status)
    if sector:
        q = q.where(Challenge.sector == sector)
    q = q.order_by(Challenge.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(q)
    return [_to_out(c) for c in result.scalars().all()]


@router.get("/{challenge_id}", response_model=ChallengeOut)
async def get_challenge(challenge_id: UUID, db: AsyncSession = Depends(get_db)):
    c = await _get_or_404(db, challenge_id)
    return _to_out(c)


@router.patch("/{challenge_id}", response_model=ChallengeOut)
async def update_challenge(
    challenge_id: UUID,
    data: ChallengeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    c = await _get_or_404(db, challenge_id)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    db.add(AuditLog(actor_id=current_user.id, action="UPDATE_CHALLENGE", entity_type="Challenge", entity_id=str(challenge_id)))
    await db.commit()
    await db.refresh(c)
    return _to_out(c)


@router.patch("/{challenge_id}/status", response_model=ChallengeOut)
async def update_status(
    challenge_id: UUID,
    body: ChallengeStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    c = await _get_or_404(db, challenge_id)
    c.status = body.status
    db.add(AuditLog(actor_id=current_user.id, action="CHALLENGE_STATUS_CHANGE", entity_type="Challenge", entity_id=str(challenge_id), details={"status": body.status.value}))
    await db.commit()
    await db.refresh(c)
    return _to_out(c)


@router.delete("/{challenge_id}", status_code=204)
async def delete_challenge(
    challenge_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    c = await _get_or_404(db, challenge_id)
    await db.delete(c)
    await db.commit()


# ─── Helpers ──────────────────────────────────────────────────────────────────

async def _get_or_404(db: AsyncSession, challenge_id: UUID) -> Challenge:
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(404, "Challenge not found")
    return c


def _to_out(c: Challenge) -> ChallengeOut:
    return ChallengeOut(
        id=str(c.id),
        department_id=str(c.department_id),
        title=c.title,
        problem_context=c.problem_context,
        current_pain=c.current_pain,
        desired_outcome=c.desired_outcome,
        constraints=c.constraints,
        pilot_budget_lakhs=float(c.pilot_budget_lakhs),
        timeline_months=c.timeline_months,
        tags=c.tags or [],
        sector=c.sector,
        kpi_criteria=c.kpi_criteria or {},
        status=c.status.value if c.status else "DRAFT",
        application_deadline=c.application_deadline,
        created_at=c.created_at,
    )
