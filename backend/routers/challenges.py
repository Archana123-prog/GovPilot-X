"""Challenges CRUD router."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime

router = APIRouter()


class ChallengeCreate(BaseModel):
    department_id: UUID
    title: str = Field(..., max_length=255)
    description: str
    pilot_budget: float = Field(..., gt=0)
    tags: List[str] = []
    kpi_criteria: dict = {}


class ChallengeOut(ChallengeCreate):
    id: UUID
    status: str
    created_at: datetime


@router.post("/create", response_model=ChallengeOut, status_code=201)
async def create_challenge(data: ChallengeCreate):
    """Create a new challenge statement and queue embedding generation."""
    # In production: save to DB + queue embedding task
    return ChallengeOut(
        id=uuid4(),
        **data.model_dump(),
        status="ACTIVE",
        created_at=datetime.utcnow(),
    )


@router.get("/", response_model=List[ChallengeOut])
async def list_challenges(status: Optional[str] = None, skip: int = 0, limit: int = 50):
    """List all challenges with optional status filter."""
    return []


@router.get("/{challenge_id}", response_model=ChallengeOut)
async def get_challenge(challenge_id: UUID):
    raise HTTPException(status_code=404, detail="Challenge not found")


@router.patch("/{challenge_id}/status")
async def update_challenge_status(challenge_id: UUID, status: str):
    """Update challenge status (ACTIVE → REVIEW → COMPLETED)."""
    return {"id": challenge_id, "status": status}
