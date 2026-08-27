"""Milestones CRUD router."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

router = APIRouter()

VALID_STATUSES = {"PENDING", "IN_PROGRESS", "REVIEW", "COMPLETED", "REJECTED"}


class MilestoneCreate(BaseModel):
    challenge_id: UUID
    startup_id: UUID
    milestone_title: str = Field(..., max_length=255)
    payout_amount: float = Field(..., gt=0)
    kpi_criteria: dict


class MilestoneOut(MilestoneCreate):
    id: UUID
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None


class StatusUpdate(BaseModel):
    status: str
    evidence_url: Optional[str] = None


@router.post("/", response_model=MilestoneOut, status_code=201)
async def create_milestone(data: MilestoneCreate):
    return MilestoneOut(
        id=uuid4(), **data.model_dump(),
        status="PENDING", created_at=datetime.utcnow()
    )


@router.get("/challenge/{challenge_id}", response_model=List[MilestoneOut])
async def get_milestones_by_challenge(challenge_id: UUID):
    return []


@router.get("/", response_model=List[MilestoneOut])
async def list_milestones(startup_id: Optional[UUID] = None, status: Optional[str] = None):
    return []


@router.patch("/{milestone_id}/status")
async def update_status(milestone_id: UUID, body: StatusUpdate):
    if body.status not in VALID_STATUSES:
        raise HTTPException(400, f"Invalid status. Must be one of {VALID_STATUSES}")
    completed_at = datetime.utcnow() if body.status == "COMPLETED" else None
    return {"id": milestone_id, "status": body.status, "completed_at": completed_at}
