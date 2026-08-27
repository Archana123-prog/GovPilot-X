"""SQLAlchemy ORM models for GovPilot-X."""
import uuid
from datetime import datetime
from typing import Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Numeric, SmallInteger, String, Text, func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class ChallengeStatement(Base):
    __tablename__ = "challenge_statements"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    department_id = Column(UUID(as_uuid=True), nullable=False)
    title         = Column(String(255), nullable=False)
    description   = Column(Text, nullable=False)
    pilot_budget  = Column(Numeric(12, 2), nullable=False)
    tags          = Column(JSONB, default=list)
    kpi_criteria  = Column(JSONB, default=dict)
    embedding     = Column(Vector(1536))
    status        = Column(String(50), default="ACTIVE")
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    milestones    = relationship("PilotMilestone", back_populates="challenge", cascade="all, delete")
    match_results = relationship("MatchResult",   back_populates="challenge", cascade="all, delete")


class StartupProfile(Base):
    __tablename__ = "startup_profiles"

    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name         = Column(String(255), nullable=False)
    dpiit_id             = Column(String(100), unique=True, nullable=False)
    tech_stack           = Column(JSONB, nullable=False, default=list)
    capability_statement = Column(Text, nullable=False)
    website              = Column(String(500))
    founded_year         = Column(SmallInteger)
    team_size            = Column(SmallInteger)
    embedding            = Column(Vector(1536))
    verified_status      = Column(Boolean, default=False)
    verification_doc_url = Column(String(500))
    created_at           = Column(DateTime(timezone=True), server_default=func.now())
    updated_at           = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    milestones    = relationship("PilotMilestone", back_populates="startup", cascade="all, delete")
    match_results = relationship("MatchResult",   back_populates="startup", cascade="all, delete")


class PilotMilestone(Base):
    __tablename__ = "pilot_milestones"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id    = Column(UUID(as_uuid=True), ForeignKey("challenge_statements.id", ondelete="CASCADE"))
    startup_id      = Column(UUID(as_uuid=True), ForeignKey("startup_profiles.id", ondelete="CASCADE"))
    milestone_title = Column(String(255), nullable=False)
    payout_amount   = Column(Numeric(12, 2), nullable=False)
    kpi_criteria    = Column(JSONB, nullable=False, default=dict)
    evidence_url    = Column(String(500))
    status          = Column(String(50), default="PENDING")
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    completed_at    = Column(DateTime(timezone=True))

    challenge = relationship("ChallengeStatement", back_populates="milestones")
    startup   = relationship("StartupProfile",     back_populates="milestones")


class MatchResult(Base):
    __tablename__ = "match_results"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id     = Column(UUID(as_uuid=True), ForeignKey("challenge_statements.id", ondelete="CASCADE"))
    startup_id       = Column(UUID(as_uuid=True), ForeignKey("startup_profiles.id",     ondelete="CASCADE"))
    similarity_score = Column(Float, nullable=False)
    match_rationale  = Column(Text)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    challenge = relationship("ChallengeStatement", back_populates="match_results")
    startup   = relationship("StartupProfile",     back_populates="match_results")
