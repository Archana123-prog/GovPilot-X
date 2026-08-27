-- GovPilot-X Database Migration 001 — Initial Schema
-- Run against your Supabase / PostgreSQL instance

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ─── challenge_statements ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS challenge_statements (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL,
    title         VARCHAR(255) NOT NULL,
    description   TEXT NOT NULL,
    pilot_budget  NUMERIC(12, 2) NOT NULL,
    tags          JSONB DEFAULT '[]',
    kpi_criteria  JSONB DEFAULT '{}',
    embedding     VECTOR(1536),
    status        VARCHAR(50) DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'REVIEW', 'COMPLETED', 'CANCELLED')),
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector index for fast ANN search
CREATE INDEX IF NOT EXISTS idx_challenge_embedding
    ON challenge_statements USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- ─── startup_profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS startup_profiles (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name         VARCHAR(255) NOT NULL,
    dpiit_id             VARCHAR(100) UNIQUE NOT NULL,
    tech_stack           JSONB NOT NULL DEFAULT '[]',
    capability_statement TEXT NOT NULL,
    website              VARCHAR(500),
    founded_year         SMALLINT,
    team_size            SMALLINT,
    embedding            VECTOR(1536),
    verified_status      BOOLEAN DEFAULT FALSE,
    verification_doc_url VARCHAR(500),
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector index
CREATE INDEX IF NOT EXISTS idx_startup_embedding
    ON startup_profiles USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- ─── pilot_milestones ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pilot_milestones (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id    UUID REFERENCES challenge_statements(id) ON DELETE CASCADE,
    startup_id      UUID REFERENCES startup_profiles(id) ON DELETE CASCADE,
    milestone_title VARCHAR(255) NOT NULL,
    payout_amount   NUMERIC(12, 2) NOT NULL,
    kpi_criteria    JSONB NOT NULL DEFAULT '{}',
    evidence_url    VARCHAR(500),
    status          VARCHAR(50) DEFAULT 'PENDING'
                      CHECK (status IN ('PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'REJECTED')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at    TIMESTAMP WITH TIME ZONE
);

-- ─── match_results (cache AI results) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS match_results (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id    UUID REFERENCES challenge_statements(id) ON DELETE CASCADE,
    startup_id      UUID REFERENCES startup_profiles(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,
    match_rationale TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (challenge_id, startup_id)
);

-- ─── Updated-at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_challenge_updated_at BEFORE UPDATE ON challenge_statements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_startup_updated_at   BEFORE UPDATE ON startup_profiles     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
