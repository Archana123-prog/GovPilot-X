"""Startups CRUD router."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

router = APIRouter()


class StartupCreate(BaseModel):
    company_name: str = Field(..., max_length=255)
    dpiit_id: str = Field(..., max_length=100)
    tech_stack: List[str]
    capability_statement: str
    website: Optional[str] = None
    founded_year: Optional[int] = None
    team_size: Optional[int] = None


class StartupOut(StartupCreate):
    id: UUID
    verified_status: bool
    created_at: datetime


@router.post("/register", response_model=StartupOut, status_code=201)
async def register_startup(data: StartupCreate):
    """Register a new startup and queue capability embedding."""
    return StartupOut(
        id=uuid4(),
        **data.model_dump(),
        verified_status=False,
        created_at=datetime.utcnow(),
    )


@router.get("/{startup_id}", response_model=StartupOut)
async def get_startup(startup_id: UUID):
    raise HTTPException(status_code=404, detail="Startup not found")


@router.patch("/{startup_id}/verify")
async def verify_startup(startup_id: UUID):
    """Admin endpoint to mark startup as DPIIT verified."""
    return {"id": startup_id, "verified_status": True}
