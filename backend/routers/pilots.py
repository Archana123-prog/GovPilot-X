"""Pilots router — sandbox/pilot design and lifecycle."""
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db.connection import get_db
from ..db.models import Pilot, PilotStatus, User, UserRole, AuditLog
from ..auth import get_current_user, require_role

router = APIRouter()


class PilotCreate(BaseModel):
    challenge_id: UUID
    startup_id: UUID
    application_id: Optional[UUID] = None
    scope: str
    duration_months: int
    budget_lakhs: float
    data_ip_terms: Optional[str] = None
    exit_clauses: Optional[str] = None
    success_criteria: dict = {}
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class PilotOut(BaseModel):
    id: str
    challenge_id: str
    startup_id: str
    application_id: Optional[str]
    scope: str
    duration_months: int
    budget_lakhs: float
    data_ip_terms: Optional[str]
    exit_clauses: Optional[str]
    success_criteria: dict
    agreement_url: Optional[str]
    status: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    created_at: datetime


class PilotStatusUpdate(BaseModel):
    status: PilotStatus


@router.post("/", response_model=PilotOut, status_code=201)
async def create_pilot(
    data: PilotCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    pilot = Pilot(**data.model_dump(exclude_unset=True))
    db.add(pilot)
    db.add(AuditLog(
        actor_id=current_user.id, action="CREATE_PILOT",
        entity_type="Pilot", details={"challenge_id": str(data.challenge_id)}
    ))
    await db.commit()
    await db.refresh(pilot)
    return _to_out(pilot)


@router.get("/", response_model=List[PilotOut])
async def list_pilots(
    status: Optional[str] = None,
    challenge_id: Optional[UUID] = None,
    startup_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = select(Pilot)
    if status:
        q = q.where(Pilot.status == status)
    if challenge_id:
        q = q.where(Pilot.challenge_id == challenge_id)
    if startup_id:
        q = q.where(Pilot.startup_id == startup_id)
    result = await db.execute(q.order_by(Pilot.created_at.desc()))
    return [_to_out(p) for p in result.scalars().all()]


@router.get("/{pilot_id}", response_model=PilotOut)
async def get_pilot(pilot_id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return _to_out(await _get_or_404(db, pilot_id))


@router.patch("/{pilot_id}/status", response_model=PilotOut)
async def update_status(
    pilot_id: UUID,
    body: PilotStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    pilot = await _get_or_404(db, pilot_id)
    pilot.status = body.status
    db.add(AuditLog(actor_id=current_user.id, action="PILOT_STATUS_CHANGE", entity_type="Pilot", entity_id=str(pilot_id), details={"status": body.status.value}))
    await db.commit()
    await db.refresh(pilot)
    return _to_out(pilot)


async def _get_or_404(db, pilot_id):
    result = await db.execute(select(Pilot).where(Pilot.id == pilot_id))
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(404, "Pilot not found")
    return p


def _to_out(p: Pilot) -> PilotOut:
    return PilotOut(
        id=str(p.id), challenge_id=str(p.challenge_id), startup_id=str(p.startup_id),
        application_id=str(p.application_id) if p.application_id else None,
        scope=p.scope, duration_months=p.duration_months, budget_lakhs=float(p.budget_lakhs),
        data_ip_terms=p.data_ip_terms, exit_clauses=p.exit_clauses,
        success_criteria=p.success_criteria or {}, agreement_url=p.agreement_url,
        status=p.status.value if p.status else "DESIGN",
        start_date=p.start_date, end_date=p.end_date, created_at=p.created_at,
    )
