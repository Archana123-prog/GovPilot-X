"""Validation reports router — independent validator submits structured report."""
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
        ValidationReport, ValidationStatus, User, UserRole, AuditLog
    )
    from ..auth import get_current_user, require_role
except (ImportError, ValueError):
    from db.connection import get_db
    from db.models import (
        ValidationReport, ValidationStatus, User, UserRole, AuditLog
    )
    from auth import get_current_user, require_role

router = APIRouter()

VALID_RECOMMENDATIONS = {"SCALE_UP", "CONTINUE", "TERMINATE"}


class ValidationCreate(BaseModel):
    pilot_id: UUID
    findings: str
    kpi_achieved: dict = {}
    recommendation: str     # SCALE_UP | CONTINUE | TERMINATE
    report_url: Optional[str] = None


class ValidationOut(BaseModel):
    id: str
    pilot_id: str
    validator_id: Optional[str]
    findings: str
    kpi_achieved: dict
    recommendation: str
    report_url: Optional[str]
    status: str
    submitted_at: Optional[datetime]
    created_at: datetime


@router.post("/", response_model=ValidationOut, status_code=201)
async def submit_report(
    data: ValidationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.validator, UserRole.admin)),
):
    if data.recommendation not in VALID_RECOMMENDATIONS:
        raise HTTPException(400, f"recommendation must be one of {VALID_RECOMMENDATIONS}")

    report = ValidationReport(
        pilot_id=data.pilot_id,
        validator_id=current_user.id,
        findings=data.findings,
        kpi_achieved=data.kpi_achieved,
        recommendation=data.recommendation,
        report_url=data.report_url,
        status=ValidationStatus.in_review,
        submitted_at=datetime.utcnow(),
    )
    db.add(report)
    db.add(AuditLog(
        actor_id=current_user.id, action="SUBMIT_VALIDATION_REPORT",
        entity_type="ValidationReport", details={"pilot_id": str(data.pilot_id), "recommendation": data.recommendation}
    ))
    await db.commit()
    await db.refresh(report)
    return _to_out(report)


@router.get("/pilot/{pilot_id}", response_model=List[ValidationOut])
async def list_by_pilot(
    pilot_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(ValidationReport).where(ValidationReport.pilot_id == pilot_id))
    return [_to_out(r) for r in result.scalars().all()]


@router.patch("/{report_id}/approve", response_model=ValidationOut)
async def approve_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin)),
):
    result = await db.execute(select(ValidationReport).where(ValidationReport.id == report_id))
    r = result.scalar_one_or_none()
    if not r:
        raise HTTPException(404, "Validation report not found")
    r.status = ValidationStatus.validated
    db.add(AuditLog(actor_id=current_user.id, action="APPROVE_VALIDATION_REPORT", entity_type="ValidationReport", entity_id=str(report_id)))
    await db.commit()
    await db.refresh(r)
    return _to_out(r)


def _to_out(r: ValidationReport) -> ValidationOut:
    return ValidationOut(
        id=str(r.id), pilot_id=str(r.pilot_id),
        validator_id=str(r.validator_id) if r.validator_id else None,
        findings=r.findings, kpi_achieved=r.kpi_achieved or {},
        recommendation=r.recommendation, report_url=r.report_url,
        status=r.status.value if r.status else "PENDING",
        submitted_at=r.submitted_at, created_at=r.created_at,
    )
