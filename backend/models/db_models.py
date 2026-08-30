"""Database models for GovPilot-X with Supabase."""
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Float, ForeignKey, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid


Base = declarative_base()


class User(Base):
    """User model for authentication and roles."""
    
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))
    role = Column(String(50), default="startup")  # startup, government, evaluator, admin
    avatar_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Challenge(Base):
    """Government challenges/RFPs."""
    
    __tablename__ = "challenges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    status = Column(String(50), default="open")  # open, closed, awarded
    budget = Column(Float)
    budget_currency = Column(String(10), default="USD")
    deadline = Column(DateTime)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Startup(Base):
    """Startup profile."""
    
    __tablename__ = "startups"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    company_name = Column(String(255), nullable=False)
    website = Column(String(255))
    description = Column(Text)
    industry = Column(String(100))
    founded_year = Column(Integer)
    team_size = Column(Integer)
    location = Column(String(255))
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Application(Base):
    """Startup application to challenge."""
    
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id"))
    startup_id = Column(UUID(as_uuid=True), ForeignKey("startups.id"))
    status = Column(String(50), default="pending")  # pending, reviewing, shortlisted, rejected, awarded
    proposal_url = Column(String(500))
    match_score = Column(Float)  # AI matching score
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Department(Base):
    """Government department/agency."""
    
    __tablename__ = "departments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    website = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)


class Evaluation(Base):
    """Evaluation/scoring of applications."""
    
    __tablename__ = "evaluations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"))
    evaluator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    score = Column(Float)
    comments = Column(Text)
    criteria = Column(String(255))  # technical, financial, team, etc.
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    """Notifications for users."""
    
    __tablename__ = "notifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String(255))
    message = Column(Text)
    type = Column(String(50))  # info, warning, success, error
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Pilot(Base):
    """Pilot program/project."""
    
    __tablename__ = "pilots"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id"))
    startup_id = Column(UUID(as_uuid=True), ForeignKey("startups.id"))
    status = Column(String(50), default="planning")  # planning, in_progress, completed, failed
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


# SQLAlchemy migration example:
# alembic revision --autogenerate -m "Create initial schema"
# alembic upgrade head
