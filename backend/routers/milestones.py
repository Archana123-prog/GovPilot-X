"""Milestones router — KPI tracking, RAG status, evidence submission, payment auto-creation."""
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

try:
    from ..db.connection import get_db
    from ..db.models import (
        Milestone, MilestoneStatus, RAGStatus, Payment, PaymentStatus,
        Pilot, User, UserRole, AuditLog
    )
    from ..auth import get_current_user, require_role
except (ImportError, ValueError):
    from db.connection import get_db
    from db.models import (
        Milestone, MilestoneStatus, RAGStatus, Payment, PaymentStatus,
        Pilot, User, UserRole, AuditLog
    )
    from auth import get_current_user, require_role

router = APIRouter()


class MilestoneCreate(BaseModel):
    pilot_id: UUID
    title: str
    description: Optional[str] = None
    payout_percent: float       # % of total pilot budget
    kpi_criteria: dict = {}
    due_date: Optional[datetime] = None


class MilestoneOut(BaseModel):
    id: str
    pilot_id: str
    title: str
    description: Optional[str]
    payout_percent: float
    kpi_criteria: dict
    rag_status: str
    evidence_url: Optional[str]
    status: str
    due_date: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime


class StatusUpdate(BaseModel):
    status: MilestoneStatus
    evidence_url: Optional[str] = None
    rag_status: Optional[RAGStatus] = None


@router.post("/", response_model=MilestoneOut, status_code=201)
async def create_milestone(
    data: MilestoneCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    # Validate pilot exists
    pilot_result = await db.execute(select(Pilot).where(Pilot.id == data.pilot_id))
    if not pilot_result.scalar_one_or_none():
        raise HTTPException(404, "Pilot not found")

    m = Milestone(**data.model_dump(exclude_unset=True))
    db.add(m)
    db.add(AuditLog(actor_id=current_user.id, action="CREATE_MILESTONE", entity_type="Milestone"))
    await db.commit()
    await db.refresh(m)
    return _to_out(m)


@router.get("/pilot/{pilot_id}", response_model=List[MilestoneOut])
async def list_by_pilot(
    pilot_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Milestone).where(Milestone.pilot_id == pilot_id).order_by(Milestone.due_date))
    return [_to_out(m) for m in result.scalars().all()]


@router.get("/{milestone_id}", response_model=MilestoneOut)
async def get_milestone(milestone_id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return _to_out(await _get_or_404(db, milestone_id))


@router.patch("/{milestone_id}/status", response_model=MilestoneOut)
async def update_status(
    milestone_id: UUID,
    body: StatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.startup, UserRole.admin)),
):
    m = await _get_or_404(db, milestone_id)
    m.status = body.status
    if body.evidence_url:
        m.evidence_url = body.evidence_url
    if body.rag_status:
        m.rag_status = body.rag_status

    # Auto-mark completed_at
    if body.status == MilestoneStatus.approved:
        m.completed_at = datetime.utcnow()
        # Auto-create payment record
        pilot_result = await db.execute(select(Pilot).where(Pilot.id == m.pilot_id))
        pilot = pilot_result.scalar_one_or_none()
        if pilot:
            payment_amount = float(pilot.budget_lakhs) * float(m.payout_percent) / 100
            payment = Payment(
                pilot_id=m.pilot_id,
                milestone_id=m.id,
                amount_lakhs=payment_amount,
                status=PaymentStatus.due,
            )
            db.add(payment)

    db.add(AuditLog(
        actor_id=current_user.id, action="MILESTONE_STATUS_CHANGE",
        entity_type="Milestone", entity_id=str(milestone_id),
        details={"status": body.status.value}
    ))
    await db.commit()
    await db.refresh(m)
    return _to_out(m)


async def _get_or_404(db, milestone_id):
    result = await db.execute(select(Milestone).where(Milestone.id == milestone_id))
    m = result.scalar_one_or_none()
    if not m:
        raise HTTPException(404, "Milestone not found")
    return m


def _to_out(m: Milestone) -> MilestoneOut:
    return MilestoneOut(
        id=str(m.id), pilot_id=str(m.pilot_id), title=m.title,
        description=m.description,
        payout_percent=float(m.payout_percent),
        kpi_criteria=m.kpi_criteria or {},
        rag_status=m.rag_status.value if m.rag_status else "AMBER",
        evidence_url=m.evidence_url, status=m.status.value if m.status else "PENDING",
        due_date=m.due_date, completed_at=m.completed_at, created_at=m.created_at,
    )
