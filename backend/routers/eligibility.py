"""Eligibility screening router — DPIIT check (mocked) + turnover waiver logic."""
from typing import Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db.connection import get_db
from ..db.models import (
    EligibilityCheck, EligibilityStatus, Application, StartupProfile,
    User, UserRole, AuditLog
)
from ..auth import get_current_user, require_role

router = APIRouter()

# Mock DPIIT database — in production would call DPIIT/Startup India API
DPIIT_MOCK_DB = {
    "DIPP12345": {"verified": True, "name": "TechStartup Pvt Ltd", "founded": 2021},
    "DIPP67890": {"verified": True, "name": "InnovateSolve Ltd",   "founded": 2020},
    "DIPP11111": {"verified": False, "name": "NewVenture Co",      "founded": 2024},
}
MIN_PILOT_TURNOVER_LAKHS = 50   # Relaxed eligibility for pilots (vs 500L for full procurement)


class EligibilityOut(BaseModel):
    id: str
    application_id: str
    dpiit_verified: bool
    incorporation_years: Optional[int]
    turnover_waiver: bool
    waiver_reason: Optional[str]
    status: str
    notes: Optional[str]
    checked_at: datetime


class WaiverRequest(BaseModel):
    grant_waiver: bool
    reason: str


@router.post("/{application_id}/check", response_model=EligibilityOut, status_code=201)
async def run_eligibility_check(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    """Run automated eligibility check for an application."""
    # Ensure application exists
    app_result = await db.execute(select(Application).where(Application.id == application_id))
    app = app_result.scalar_one_or_none()
    if not app:
        raise HTTPException(404, "Application not found")

    # Prevent duplicate
    existing = await db.execute(select(EligibilityCheck).where(EligibilityCheck.application_id == application_id))
    if existing.scalar_one_or_none():
        raise HTTPException(409, "Eligibility check already exists for this application")

    # Load startup profile
    startup_result = await db.execute(select(StartupProfile).where(StartupProfile.id == app.startup_id))
    startup = startup_result.scalar_one_or_none()

    # DPIIT mock check
    dpiit_data = DPIIT_MOCK_DB.get(startup.dpiit_id, {"verified": False})
    dpiit_verified = dpiit_data.get("verified", False)

    # Incorporation years
    from datetime import date
    founded_year = startup.founded_year or dpiit_data.get("founded")
    inc_years = (date.today().year - founded_year) if founded_year else None

    # Turnover check (relaxed for pilots)
    turnover = float(startup.annual_turnover_lakhs or 0)
    turnover_ok = turnover >= MIN_PILOT_TURNOVER_LAKHS or turnover == 0  # 0 = not declared → allow for now

    # Determine overall eligibility
    if dpiit_verified and (turnover_ok or turnover == 0):
        status = EligibilityStatus.eligible
    elif dpiit_verified and not turnover_ok:
        status = EligibilityStatus.eligible  # pilot waiver — relaxed threshold
    else:
        status = EligibilityStatus.ineligible

    notes = []
    if not dpiit_verified:
        notes.append("DPIIT recognition not verified")
    if turnover == 0:
        notes.append("Turnover not declared — pending verification")

    ec = EligibilityCheck(
        application_id=application_id,
        dpiit_verified=dpiit_verified,
        incorporation_years=inc_years,
        turnover_waiver=False,
        status=status,
        notes=". ".join(notes) if notes else "Auto-check passed",
    )
    db.add(ec)
    db.add(AuditLog(
        actor_id=current_user.id, action="ELIGIBILITY_CHECK",
        entity_type="EligibilityCheck", entity_id=str(application_id),
        details={"status": status.value}
    ))
    await db.commit()
    await db.refresh(ec)
    return _to_out(ec)


@router.get("/{application_id}", response_model=EligibilityOut)
async def get_eligibility(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(EligibilityCheck).where(EligibilityCheck.application_id == application_id))
    ec = result.scalar_one_or_none()
    if not ec:
        raise HTTPException(404, "Eligibility check not found — run POST /{application_id}/check first")
    return _to_out(ec)


@router.patch("/{application_id}/waiver", response_model=EligibilityOut)
async def grant_or_revoke_waiver(
    application_id: UUID,
    body: WaiverRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    """Admin can manually grant a turnover/experience waiver."""
    result = await db.execute(select(EligibilityCheck).where(EligibilityCheck.application_id == application_id))
    ec = result.scalar_one_or_none()
    if not ec:
        raise HTTPException(404, "Eligibility check not found")

    ec.turnover_waiver = body.grant_waiver
    ec.waiver_reason = body.reason
    if body.grant_waiver:
        ec.status = EligibilityStatus.waiver_granted
    db.add(AuditLog(
        actor_id=current_user.id, action="ELIGIBILITY_WAIVER",
        entity_type="EligibilityCheck", entity_id=str(ec.id),
        details={"granted": body.grant_waiver, "reason": body.reason}
    ))
    await db.commit()
    await db.refresh(ec)
    return _to_out(ec)


def _to_out(ec: EligibilityCheck) -> EligibilityOut:
    return EligibilityOut(
        id=str(ec.id),
        application_id=str(ec.application_id),
        dpiit_verified=ec.dpiit_verified,
        incorporation_years=ec.incorporation_years,
        turnover_waiver=ec.turnover_waiver,
        waiver_reason=ec.waiver_reason,
        status=ec.status.value,
        notes=ec.notes,
        checked_at=ec.checked_at,
    )
