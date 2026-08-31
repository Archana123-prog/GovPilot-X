"""Applications router — startup applies to a challenge; CRUD + status flow."""
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
        Application, ApplicationStatus, Challenge, StartupProfile,
        User, UserRole, AuditLog
    )
    from ..auth import get_current_user, require_role
except (ImportError, ValueError):
    from db.connection import get_db
    from db.models import (
        Application, ApplicationStatus, Challenge, StartupProfile,
        User, UserRole, AuditLog
    )
    from auth import get_current_user, require_role

router = APIRouter()


class ApplicationCreate(BaseModel):
    challenge_id: UUID
    proposal: str
    proposed_budget_lakhs: Optional[float] = None
    proposed_timeline_months: Optional[int] = None


class ApplicationOut(BaseModel):
    id: str
    challenge_id: str
    startup_id: str
    proposal: str
    proposed_budget_lakhs: Optional[float]
    proposed_timeline_months: Optional[int]
    status: str
    created_at: datetime


class StatusUpdate(BaseModel):
    status: ApplicationStatus


@router.post("/", response_model=ApplicationOut, status_code=201)
async def apply(
    data: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.startup)),
):
    startup = await db.execute(select(StartupProfile).where(StartupProfile.user_id == current_user.id))
    startup = startup.scalar_one_or_none()
    if not startup:
        raise HTTPException(400, "Startup profile not found")

    # Prevent duplicate applications
    dup = await db.execute(
        select(Application).where(
            Application.challenge_id == data.challenge_id,
            Application.startup_id == startup.id,
        )
    )
    if dup.scalar_one_or_none():
        raise HTTPException(409, "Already applied to this challenge")

    # Check challenge is ACTIVE
    ch = await db.execute(select(Challenge).where(Challenge.id == data.challenge_id))
    ch = ch.scalar_one_or_none()
    if not ch or ch.status.value != "ACTIVE":
        raise HTTPException(400, "Challenge is not open for applications")

    app = Application(
        challenge_id=data.challenge_id,
        startup_id=startup.id,
        proposal=data.proposal,
        proposed_budget_lakhs=data.proposed_budget_lakhs,
        proposed_timeline_months=data.proposed_timeline_months,
    )
    db.add(app)
    db.add(AuditLog(actor_id=current_user.id, action="SUBMIT_APPLICATION", entity_type="Application"))
    await db.commit()
    await db.refresh(app)
    return _to_out(app)


@router.get("/challenge/{challenge_id}", response_model=List[ApplicationOut])
async def list_by_challenge(
    challenge_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin, UserRole.evaluator)),
):
    result = await db.execute(
        select(Application).where(Application.challenge_id == challenge_id)
        .order_by(Application.created_at.desc())
    )
    return [_to_out(a) for a in result.scalars().all()]


@router.get("/my", response_model=List[ApplicationOut])
async def my_applications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.startup)),
):
    startup = await db.execute(select(StartupProfile).where(StartupProfile.user_id == current_user.id))
    startup = startup.scalar_one_or_none()
    if not startup:
        return []
    result = await db.execute(
        select(Application).where(Application.startup_id == startup.id)
        .order_by(Application.created_at.desc())
    )
    return [_to_out(a) for a in result.scalars().all()]


@router.get("/{application_id}", response_model=ApplicationOut)
async def get_application(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    a = await _get_or_404(db, application_id)
    return _to_out(a)


@router.patch("/{application_id}/status", response_model=ApplicationOut)
async def update_status(
    application_id: UUID,
    body: StatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    a = await _get_or_404(db, application_id)
    old_status = a.status
    a.status = body.status
    db.add(AuditLog(
        actor_id=current_user.id, action="APPLICATION_STATUS_CHANGE",
        entity_type="Application", entity_id=str(application_id),
        details={"from": old_status.value, "to": body.status.value}
    ))
    await db.commit()
    await db.refresh(a)
    return _to_out(a)


async def _get_or_404(db: AsyncSession, application_id: UUID) -> Application:
    result = await db.execute(select(Application).where(Application.id == application_id))
    a = result.scalar_one_or_none()
    if not a:
        raise HTTPException(404, "Application not found")
    return a


def _to_out(a: Application) -> ApplicationOut:
    return ApplicationOut(
        id=str(a.id),
        challenge_id=str(a.challenge_id),
        startup_id=str(a.startup_id),
        proposal=a.proposal,
        proposed_budget_lakhs=float(a.proposed_budget_lakhs) if a.proposed_budget_lakhs else None,
        proposed_timeline_months=a.proposed_timeline_months,
        status=a.status.value,
        created_at=a.created_at,
    )
