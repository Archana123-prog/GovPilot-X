"""SQLAlchemy ORM models for GovPilot-X — full workflow."""
import uuid
import enum
from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, Float, ForeignKey,
    Integer, Numeric, String, Text, func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


# ─── Enums ────────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    department = "department"
    startup = "startup"
    evaluator = "evaluator"
    validator = "validator"
    admin = "admin"


class ChallengeStatus(str, enum.Enum):
    draft = "DRAFT"
    review = "REVIEW"
    active = "ACTIVE"
    closed = "CLOSED"
    completed = "COMPLETED"


class ApplicationStatus(str, enum.Enum):
    pending = "PENDING"
    shortlisted = "SHORTLISTED"
    rejected = "REJECTED"
    selected = "SELECTED"


class EligibilityStatus(str, enum.Enum):
    pending = "PENDING"
    eligible = "ELIGIBLE"
    ineligible = "INELIGIBLE"
    waiver_granted = "WAIVER_GRANTED"


class PilotStatus(str, enum.Enum):
    design = "DESIGN"
    active = "ACTIVE"
    completed = "COMPLETED"
    cancelled = "CANCELLED"


class MilestoneStatus(str, enum.Enum):
    pending = "PENDING"
    in_progress = "IN_PROGRESS"
    submitted = "SUBMITTED"
    approved = "APPROVED"
    rejected = "REJECTED"


class PaymentStatus(str, enum.Enum):
    due = "DUE"
    approved = "APPROVED"
    processed = "PROCESSED"
    paid = "PAID"


class ValidationStatus(str, enum.Enum):
    pending = "PENDING"
    in_review = "IN_REVIEW"
    validated = "VALIDATED"
    failed = "FAILED"


class RAGStatus(str, enum.Enum):
    red = "RED"
    amber = "AMBER"
    green = "GREEN"


# ─── Core Entities ────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name     = Column(String(255), nullable=False)
    role          = Column(Enum(UserRole), nullable=False)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    department_profile = relationship("Department", back_populates="officer", uselist=False, cascade="all, delete")
    startup_profile    = relationship("StartupProfile", back_populates="user", uselist=False, cascade="all, delete")
    evaluations        = relationship("EvaluationScore", back_populates="evaluator")
    validations        = relationship("ValidationReport", back_populates="validator")
    audit_logs         = relationship("AuditLog", back_populates="actor")


class Department(Base):
    __tablename__ = "departments"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    name        = Column(String(255), nullable=False)
    ministry    = Column(String(255))
    state       = Column(String(100))
    contact     = Column(String(255))
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    officer     = relationship("User", back_populates="department_profile")
    challenges  = relationship("Challenge", back_populates="department", cascade="all, delete")


class StartupProfile(Base):
    __tablename__ = "startup_profiles"

    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id              = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    company_name         = Column(String(255), nullable=False)
    dpiit_id             = Column(String(100), unique=True, nullable=False)
    tech_stack           = Column(JSONB, nullable=False, default=list)
    capability_statement = Column(Text, nullable=False)
    website              = Column(String(500))
    founded_year         = Column(Integer)
    team_size            = Column(Integer)
    annual_turnover_lakhs = Column(Numeric(12, 2))
    verified_status      = Column(Boolean, default=False)
    verification_doc_url = Column(String(500))
    sector               = Column(String(100))
    created_at           = Column(DateTime(timezone=True), server_default=func.now())
    updated_at           = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user         = relationship("User", back_populates="startup_profile")
    applications = relationship("Application", back_populates="startup", cascade="all, delete")
    match_results = relationship("MatchResult", back_populates="startup", cascade="all, delete")


# ─── Challenge Workflow ────────────────────────────────────────────────────────

class Challenge(Base):
    __tablename__ = "challenges"

    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    department_id     = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"))
    title             = Column(String(255), nullable=False)
    problem_context   = Column(Text, nullable=False)
    current_pain      = Column(Text, nullable=False)
    desired_outcome   = Column(Text, nullable=False)
    constraints       = Column(Text)
    pilot_budget_lakhs = Column(Numeric(12, 2), nullable=False)
    timeline_months   = Column(Integer, nullable=False, default=6)
    tags              = Column(JSONB, default=list)
    sector            = Column(String(100))
    kpi_criteria      = Column(JSONB, default=dict)
    status            = Column(Enum(ChallengeStatus), default=ChallengeStatus.draft)
    application_deadline = Column(DateTime(timezone=True))
    created_at        = Column(DateTime(timezone=True), server_default=func.now())
    updated_at        = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    department    = relationship("Department", back_populates="challenges")
    applications  = relationship("Application", back_populates="challenge", cascade="all, delete")
    match_results = relationship("MatchResult", back_populates="challenge", cascade="all, delete")
    pilots        = relationship("Pilot", back_populates="challenge", cascade="all, delete")
    evaluation_criteria = relationship("EvaluationCriteria", back_populates="challenge", uselist=False, cascade="all, delete")


class Application(Base):
    __tablename__ = "applications"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id    = Column(UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"))
    startup_id      = Column(UUID(as_uuid=True), ForeignKey("startup_profiles.id", ondelete="CASCADE"))
    proposal        = Column(Text, nullable=False)
    proposed_budget_lakhs = Column(Numeric(12, 2))
    proposed_timeline_months = Column(Integer)
    status          = Column(Enum(ApplicationStatus), default=ApplicationStatus.pending)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    challenge        = relationship("Challenge", back_populates="applications")
    startup          = relationship("StartupProfile", back_populates="applications")
    eligibility_check = relationship("EligibilityCheck", back_populates="application", uselist=False, cascade="all, delete")
    evaluation_scores = relationship("EvaluationScore", back_populates="application", cascade="all, delete")


class EligibilityCheck(Base):
    __tablename__ = "eligibility_checks"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id  = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), unique=True)
    dpiit_verified  = Column(Boolean, default=False)
    incorporation_years = Column(Integer)
    turnover_waiver = Column(Boolean, default=False)
    waiver_reason   = Column(Text)
    status          = Column(Enum(EligibilityStatus), default=EligibilityStatus.pending)
    checked_at      = Column(DateTime(timezone=True), server_default=func.now())
    notes           = Column(Text)

    application = relationship("Application", back_populates="eligibility_check")


# ─── Evaluation ───────────────────────────────────────────────────────────────

class EvaluationCriteria(Base):
    __tablename__ = "evaluation_criteria"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id    = Column(UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"), unique=True)
    criteria        = Column(JSONB, nullable=False)  # [{name, weight, max_score}]
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    challenge = relationship("Challenge", back_populates="evaluation_criteria")


class EvaluationScore(Base):
    __tablename__ = "evaluation_scores"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id  = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"))
    evaluator_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    scores          = Column(JSONB, nullable=False)  # {criteria_name: score}
    weighted_total  = Column(Float)
    conflict_of_interest = Column(Boolean, default=False)
    coi_reason      = Column(Text)
    comments        = Column(Text)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    application = relationship("Application", back_populates="evaluation_scores")
    evaluator   = relationship("User", back_populates="evaluations")


class MatchResult(Base):
    __tablename__ = "match_results"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id     = Column(UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"))
    startup_id       = Column(UUID(as_uuid=True), ForeignKey("startup_profiles.id", ondelete="CASCADE"))
    similarity_score = Column(Float, nullable=False)
    match_rationale  = Column(Text)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    challenge = relationship("Challenge", back_populates="match_results")
    startup   = relationship("StartupProfile", back_populates="match_results")


# ─── Pilot Workflow ───────────────────────────────────────────────────────────

class Pilot(Base):
    __tablename__ = "pilots"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id        = Column(UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"))
    startup_id          = Column(UUID(as_uuid=True), ForeignKey("startup_profiles.id", ondelete="CASCADE"))
    application_id      = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="SET NULL"), nullable=True)
    scope               = Column(Text, nullable=False)
    duration_months     = Column(Integer, nullable=False)
    budget_lakhs        = Column(Numeric(12, 2), nullable=False)
    data_ip_terms       = Column(Text)
    exit_clauses        = Column(Text)
    success_criteria    = Column(JSONB, default=dict)
    agreement_url       = Column(String(500))
    status              = Column(Enum(PilotStatus), default=PilotStatus.design)
    start_date          = Column(DateTime(timezone=True))
    end_date            = Column(DateTime(timezone=True))
    created_at          = Column(DateTime(timezone=True), server_default=func.now())
    updated_at          = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    challenge   = relationship("Challenge", back_populates="pilots")
    milestones  = relationship("Milestone", back_populates="pilot", cascade="all, delete")
    payments    = relationship("Payment", back_populates="pilot", cascade="all, delete")
    validations = relationship("ValidationReport", back_populates="pilot", cascade="all, delete")
    scale_up    = relationship("ScaleUpRecord", back_populates="pilot", uselist=False, cascade="all, delete")


class Milestone(Base):
    __tablename__ = "milestones"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pilot_id        = Column(UUID(as_uuid=True), ForeignKey("pilots.id", ondelete="CASCADE"))
    title           = Column(String(255), nullable=False)
    description     = Column(Text)
    payout_percent  = Column(Numeric(5, 2), nullable=False)   # % of total pilot budget
    kpi_criteria    = Column(JSONB, default=dict)
    rag_status      = Column(Enum(RAGStatus), default=RAGStatus.amber)
    evidence_url    = Column(String(500))
    status          = Column(Enum(MilestoneStatus), default=MilestoneStatus.pending)
    due_date        = Column(DateTime(timezone=True))
    completed_at    = Column(DateTime(timezone=True))
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    pilot   = relationship("Pilot", back_populates="milestones")
    payment = relationship("Payment", back_populates="milestone", uselist=False)


class Payment(Base):
    __tablename__ = "payments"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pilot_id        = Column(UUID(as_uuid=True), ForeignKey("pilots.id", ondelete="CASCADE"))
    milestone_id    = Column(UUID(as_uuid=True), ForeignKey("milestones.id", ondelete="SET NULL"), nullable=True, unique=True)
    amount_lakhs    = Column(Numeric(12, 2), nullable=False)
    status          = Column(Enum(PaymentStatus), default=PaymentStatus.due)
    reference       = Column(String(255))
    approved_at     = Column(DateTime(timezone=True))
    processed_at    = Column(DateTime(timezone=True))
    paid_at         = Column(DateTime(timezone=True))
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    pilot     = relationship("Pilot", back_populates="payments")
    milestone = relationship("Milestone", back_populates="payment")


class ValidationReport(Base):
    __tablename__ = "validation_reports"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pilot_id        = Column(UUID(as_uuid=True), ForeignKey("pilots.id", ondelete="CASCADE"))
    validator_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    findings        = Column(Text, nullable=False)
    kpi_achieved    = Column(JSONB, default=dict)
    recommendation  = Column(String(50))   # "SCALE_UP" | "CONTINUE" | "TERMINATE"
    report_url      = Column(String(500))
    status          = Column(Enum(ValidationStatus), default=ValidationStatus.pending)
    submitted_at    = Column(DateTime(timezone=True))
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    pilot     = relationship("Pilot", back_populates="validations")
    validator = relationship("User", back_populates="validations")
    scale_ups = relationship("ScaleUpRecord", back_populates="validation_report")


class ScaleUpRecord(Base):
    __tablename__ = "scale_up_records"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pilot_id            = Column(UUID(as_uuid=True), ForeignKey("pilots.id", ondelete="CASCADE"), unique=True)
    validation_report_id = Column(UUID(as_uuid=True), ForeignKey("validation_reports.id", ondelete="SET NULL"), nullable=True)
    recommended_by      = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    procurement_pathway = Column(Text)
    gem_category_code   = Column(String(100))
    adopting_departments = Column(JSONB, default=list)
    status              = Column(String(50), default="RECOMMENDED")
    created_at          = Column(DateTime(timezone=True), server_default=func.now())

    pilot             = relationship("Pilot", back_populates="scale_up")
    validation_report = relationship("ValidationReport", back_populates="scale_ups")


class TemplateDocument(Base):
    __tablename__ = "template_documents"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(255), nullable=False)
    type        = Column(String(100), nullable=False)  # problem_statement, evaluation_criteria, pilot_agreement, etc.
    version     = Column(String(20), default="1.0")
    content     = Column(Text, nullable=False)          # Markdown template with {{placeholders}}
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action      = Column(String(255), nullable=False)
    entity_type = Column(String(100))
    entity_id   = Column(String(255))
    details     = Column(JSONB, default=dict)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    actor = relationship("User", back_populates="audit_logs")
