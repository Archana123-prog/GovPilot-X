"""Payments router — milestone-triggered payment state machine."""
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db.connection import get_db
from ..db.models import Payment, PaymentStatus, User, UserRole, AuditLog
from ..auth import get_current_user, require_role

router = APIRouter()


class PaymentOut(BaseModel):
    id: str
    pilot_id: str
    milestone_id: Optional[str]
    amount_lakhs: float
    status: str
    reference: Optional[str]
    approved_at: Optional[datetime]
    processed_at: Optional[datetime]
    paid_at: Optional[datetime]
    created_at: datetime


class PaymentAdvance(BaseModel):
    reference: Optional[str] = None


STATE_TRANSITIONS = {
    PaymentStatus.due: PaymentStatus.approved,
    PaymentStatus.approved: PaymentStatus.processed,
    PaymentStatus.processed: PaymentStatus.paid,
}


@router.get("/pilot/{pilot_id}", response_model=List[PaymentOut])
async def list_by_pilot(
    pilot_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Payment).where(Payment.pilot_id == pilot_id).order_by(Payment.created_at))
    return [_to_out(p) for p in result.scalars().all()]


@router.post("/{payment_id}/advance", response_model=PaymentOut)
async def advance_payment(
    payment_id: UUID,
    body: PaymentAdvance,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.department, UserRole.admin)),
):
    """Advance payment status: DUE → APPROVED → PROCESSED → PAID."""
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(404, "Payment not found")
    if p.status == PaymentStatus.paid:
        raise HTTPException(400, "Payment already completed")

    next_status = STATE_TRANSITIONS.get(p.status)
    if not next_status:
        raise HTTPException(400, f"Cannot advance from status {p.status.value}")

    now = datetime.utcnow()
    p.status = next_status
    if body.reference:
        p.reference = body.reference
    if next_status == PaymentStatus.approved:
        p.approved_at = now
    elif next_status == PaymentStatus.processed:
        p.processed_at = now
    elif next_status == PaymentStatus.paid:
        p.paid_at = now

    db.add(AuditLog(
        actor_id=current_user.id, action="PAYMENT_STATUS_ADVANCE",
        entity_type="Payment", entity_id=str(payment_id),
        details={"to": next_status.value, "reference": body.reference}
    ))
    await db.commit()
    await db.refresh(p)
    return _to_out(p)


def _to_out(p: Payment) -> PaymentOut:
    return PaymentOut(
        id=str(p.id), pilot_id=str(p.pilot_id),
        milestone_id=str(p.milestone_id) if p.milestone_id else None,
        amount_lakhs=float(p.amount_lakhs), status=p.status.value,
        reference=p.reference, approved_at=p.approved_at,
        processed_at=p.processed_at, paid_at=p.paid_at, created_at=p.created_at,
    )
