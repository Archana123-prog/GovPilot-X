# GovPilot-X — Developer Handoff & Project Summary

> **Status as of August 2026** · Phase 1 (Frontend) ✅ Complete · Phase 3 Skeleton (Backend) ✅ Complete · Phase 2 (Policy Sandbox) ⏳ Pending  
> **Purpose of this document**: Everything a new developer needs to understand, run, and continue building this project from day one.

---

## 1. What Is GovPilot-X?

**GovPilot-X** is India's first AI-powered government-startup procurement platform. It digitizes and streamlines the process by which Indian government departments post public-sector challenges and get matched with verified DPIIT-registered startups to run pilot programs.

### The Problem It Solves

India's government procurement system is plagued with:
- High entry barriers for startups (EMD deposits, turnover requirements)
- Manual, slow, relationship-driven vendor discovery
- Zero transparency in pilot program progress
- Repetitive paperwork for every department tender

### The Solution

GovPilot-X provides:
| Feature | What it does |
|---|---|
| **Challenge Posting** | Government departments post civic problems with budgets and KPI criteria |
| **AI Matching Engine** | Semantic vector search matches the right startup to each challenge (≥78% cosine similarity) |
| **Policy Sandbox** | Automatic tender waiver logic for DPIIT-verified startups (bypasses EMD & turnover rules) |
| **Pilot Tracker** | Kanban-style milestone dashboard with KPI-gated payout tracking |
| **Procurement Passport** | One-time verified startup profile that works across all government departments |
| **RAG Evaluation** | GPT-4o evaluates pitch decks against challenge KPIs with cited rationale |

### Who Uses It

| Role | Portal | What they do |
|---|---|---|
| **Government Departments** | `/department/*` | Post challenges, review AI match results, track pilot milestones |
| **Startups** | `/startup/*` | Set up Procurement Passport, browse challenges, submit pitches |
| **Both** | `/tracker` | View and update pilot milestone progress (Kanban board) |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              USER BROWSER                        │
│   React 18 + Vite + Tailwind CSS + GSAP          │
│   Port: 5173                                     │
└──────────────────┬──────────────────────────────┘
                   │  HTTP / REST (proxied via Vite → /api)
┌──────────────────▼──────────────────────────────┐
│              FASTAPI BACKEND                     │
│   Python 3.11+ · Uvicorn · Pydantic v2           │
│   Port: 8000                                     │
│   Routers: /challenges /startups /match          │
│             /milestones                          │
└──────┬──────────────────────────┬───────────────┘
       │                          │
┌──────▼──────┐         ┌────────▼────────────────┐
│   REDIS      │         │   PostgreSQL (Supabase)  │
│   Port: 6379 │         │   + pgvector extension  │
│   Celery     │         │   3 core tables          │
│   Task Queue │         │   Vector embeddings      │
└──────┬──────┘         └────────▲────────────────┘
       │                          │
┌──────▼──────────────────────────┴───────────────┐
│              AI PIPELINE                         │
│   OpenAI text-embedding-3-small (1536 dims)      │
│   pgvector cosine similarity (threshold ≥ 0.78)  │
│   GPT-4o RAG evaluation (structured JSON output) │
└─────────────────────────────────────────────────┘
```

---

## 3. Full Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI component framework |
| **Vite** | 8.x | Build tool & dev server (port 5173) |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **GSAP** | 3.x | Scroll-triggered animations, entrance timelines |
| **React Router DOM** | 7.x | Client-side routing |
| **Zustand** | 5.x | Global state management (auth, role, sidebar) |
| **Axios** | 1.x | HTTP client for API calls |
| **Recharts** | 3.x | Budget donut charts |
| **@dnd-kit** | 6/10.x | Drag-and-drop Kanban board |
| **react-hot-toast** | 2.x | Toast notifications |
| **lucide-react** | latest | Icon library |
| **clsx** | 2.x | Conditional className utility |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.111 | REST API framework |
| **Uvicorn** | 0.29 | ASGI server |
| **SQLAlchemy** | 2.x (async) | ORM with async support |
| **asyncpg** | 0.29 | Async PostgreSQL driver |
| **pgvector** | 0.3 | Vector similarity extension for PostgreSQL |
| **OpenAI SDK** | 1.30 | Embeddings + GPT-4o API |
| **Celery** | 5.4 | Async task queue |
| **Redis** | 5.x | Celery message broker + result backend |
| **Pydantic** | 2.x | Data validation & schema |
| **python-multipart** | 0.0.9 | File upload handling |
| **python-jose** | 3.x | JWT token handling (ready, not wired) |

### Database
| Service | Purpose |
|---|---|
| **PostgreSQL (Supabase)** | Primary relational database |
| **pgvector extension** | Stores 1536-dim embeddings, runs ANN search |
| **IVFFlat index** | Approximate nearest-neighbor for fast vector queries |

### Infrastructure (Required for Production)
| Service | Purpose |
|---|---|
| **Redis** | Celery broker |
| **Supabase / any PostgreSQL** | Database (with pgvector enabled) |
| **OpenAI API** | Embeddings + GPT-4o |

---

## 4. Project File Structure

```
d:/New folder/newpro/
│
├── index.html                    # Root HTML (Google Fonts: Inter, Space Grotesk)
├── vite.config.js                # Vite config with path aliases + backend proxy
├── tailwind.config.js            # Custom palette (gov-*, cyber-*), animations
├── postcss.config.js
├── package.json
│
├── src/
│   ├── main.jsx                  # App entry point (BrowserRouter + Toaster)
│   ├── App.jsx                   # Route definitions (protected + public)
│   ├── index.css                 # Global CSS: glassmorphism, buttons, badges, animations
│   │
│   ├── store/
│   │   └── useAppStore.js        # Zustand: auth state, role, sidebar, notifications
│   │
│   ├── api/
│   │   ├── client.js             # Axios base instance (/api prefix proxy)
│   │   ├── mockData.js           # ⚠️ All mock data (replace with real API calls)
│   │   ├── challenges.js         # Challenge API wrappers (mock delay)
│   │   ├── startups.js           # Startup API wrappers (mock delay)
│   │   ├── matching.js           # AI matching API wrapper (mock)
│   │   └── milestones.js         # Milestones API (mutable in-memory mock)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx        # Sticky top nav (role-aware, logout, notifications)
│   │   │   ├── Sidebar.jsx       # Collapsible sidebar (role-aware nav items)
│   │   │   └── AppShell.jsx      # Authenticated layout wrapper (sidebar + Outlet)
│   │   │
│   │   ├── landing/
│   │   │   ├── HeroSection.jsx   # GSAP entrance animation + floating orbs
│   │   │   ├── StatsCounter.jsx  # ScrollTrigger animated number counters
│   │   │   └── FeatureGrid.jsx   # 6-card feature grid with scroll animation
│   │   │
│   │   ├── tracker/
│   │   │   ├── KanbanColumn.jsx  # Droppable column (@dnd-kit/core)
│   │   │   ├── MilestoneCard.jsx # Draggable card with grip handle
│   │   │   └── MilestoneModal.jsx# Status advancement modal
│   │   │
│   │   ├── charts/
│   │   │   └── BudgetDonut.jsx   # Recharts donut with center total
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx        # Variants: primary/secondary/ghost/danger/cyber
│   │       ├── Badge.jsx         # Status badges with color auto-mapping
│   │       ├── Card.jsx          # Glassmorphism card (hover-lift option)
│   │       ├── Input.jsx         # Input/Textarea with icon, label, error
│   │       ├── Modal.jsx         # Accessible modal (ESC + backdrop close)
│   │       ├── FileUpload.jsx    # Drag-drop zone with progress bar animation
│   │       └── SimilarityGauge.jsx # SVG radial gauge (AI match score 0–100%)
│   │
│   └── pages/
│       ├── Landing.jsx           # Public landing (Hero + Stats + Features + CTA)
│       │
│       ├── auth/
│       │   ├── DepartmentLogin.jsx  # Dept login (indigo theme, mock auth)
│       │   └── StartupLogin.jsx     # Startup login (cyan theme, mock auth)
│       │
│       ├── department/
│       │   ├── DepartmentDashboard.jsx  # Stats + recent challenges + budget donut
│       │   ├── ChallengeCreate.jsx      # Form: title, description, budget slider, KPI builder
│       │   ├── ChallengeList.jsx        # Searchable table + status filter tabs
│       │   └── MatchResults.jsx         # AI match results with SimilarityGauge cards
│       │
│       ├── startup/
│       │   ├── StartupDashboard.jsx     # Profile completeness + top AI matches
│       │   ├── ProfileSetup.jsx         # 4-step wizard (Procurement Passport)
│       │   ├── ChallengeExplore.jsx     # Browse + AI-ranked challenge cards
│       │   └── PitchUpload.jsx          # Drag-drop deck upload + past submissions
│       │
│       └── tracker/
│           └── PilotTracker.jsx         # Full Kanban board (drag-drop across columns)
│
└── backend/
    ├── main.py                   # FastAPI app factory (CORS, routers, lifespan)
    ├── requirements.txt
    ├── .env.example              # ← COPY THIS TO .env AND FILL IN VALUES
    │
    ├── db/
    │   ├── connection.py         # Async SQLAlchemy engine + get_db() dependency
    │   ├── models.py             # ORM models (ChallengeStatement, StartupProfile,
    │   │                         #   PilotMilestone, MatchResult) with Vector columns
    │   └── migrations/
    │       └── 001_init.sql      # ← RUN THIS on your PostgreSQL DB first
    │
    ├── routers/
    │   ├── challenges.py         # POST /challenges/create, GET /challenges/
    │   ├── startups.py           # POST /startups/register, PATCH /verify
    │   ├── matching.py           # POST /match/startups → Celery task_id
    │   └── milestones.py         # CRUD + PATCH /{id}/status
    │
    ├── ai/
    │   ├── embeddings.py         # embed_text() + embed_batch() + mock_embed()
    │   ├── vector_store.py       # find_matching_startups() pgvector cosine query
    │   └── rag_pipeline.py       # evaluate_match() + run_rag_pipeline() GPT-4o
    │
    └── workers/
        ├── celery_app.py         # Celery factory (Redis broker, IST timezone)
        └── match_task.py         # @celery.task: full 5-step async match pipeline
```

---

## 5. What Is Working Right Now

### ✅ Fully Functional (Frontend — Mock Data)
Everything in the frontend works end-to-end with realistic mock data. A developer or demo user can:

- [x] View the animated landing page with GSAP scroll effects and stat counters
- [x] Log into the **Department Portal** (any password works in demo mode)
- [x] View the Department Dashboard with stats, challenge list, budget donut chart
- [x] Create a new challenge (budget slider, dynamic KPI builder, tech tag chips)
- [x] Browse and filter challenges by status (ACTIVE / REVIEW / COMPLETED)
- [x] Run AI match simulation → see ranked startups with similarity gauges + rationale
- [x] Log into the **Startup Portal** (separate login flow, any password)
- [x] View Startup Dashboard with profile completeness tracker and AI match cards
- [x] Complete the 4-step Procurement Passport (company info, DPIIT upload, tech stack, capability statement)
- [x] Browse challenges ranked by AI similarity score, express interest
- [x] Upload a pitch deck (with animated progress bar) and see past submissions
- [x] Use the **Pilot Tracker Kanban** — drag milestone cards between PENDING → IN_PROGRESS → REVIEW → COMPLETED
- [x] Open milestone detail modal and advance its status
- [x] Both roles (department + startup) can access the Pilot Tracker

### ✅ Backend Skeleton (Not Yet Wired to Frontend)
The FastAPI backend compiles and runs but uses stub/placeholder DB logic:

- [x] All 4 routers defined and documented (`/challenges`, `/startups`, `/match`, `/milestones`)
- [x] Database schema SQL ready (`001_init.sql`) — just needs to be run against Supabase
- [x] ORM models defined with pgvector `Vector(1536)` columns
- [x] AI embeddings module: `embed_text()` using `text-embedding-3-small`
- [x] Vector store: `find_matching_startups()` using `<=>` cosine operator (≥ 0.78)
- [x] RAG pipeline: `evaluate_match()` + `run_rag_pipeline()` using GPT-4o JSON mode
- [x] Celery task: `run_match_pipeline.delay()` with retry logic

---

## 6. What Still Needs to Be Done

### 🔴 Phase 2 — Policy Sandbox (Not Started)
This is the most legally/compliance-sensitive feature area.

| Task | Description | Effort |
|---|---|---|
| **Tender Waiver Logic** | Rules engine that auto-bypasses EMD deposit and turnover requirements for DPIIT-verified startups. Should check `verified_status = true` and `dpiit_id` validity before applying waivers | Medium |
| **Micro-Contract Generator** | PDF generator that creates a legal pilot agreement from a template when a startup is shortlisted. Use `reportlab` or `pdfkit` (Python). Template needs legal review | High |
| **Procurement Passport Badge** | QR code + certification badge image generated upon DPIIT verification, downloadable by startup | Low |
| **GFR Compliance Checks** | Validation against General Financial Rules (GFR 2017) for procurement amount thresholds | High |

### 🟡 Backend Wiring (Medium Priority)
The frontend currently uses mock data (`src/api/mockData.js`). To connect to a real backend:

| Task | File to Change | Description |
|---|---|---|
| **Replace mock API calls** | `src/api/challenges.js`, `startups.js`, `matching.js`, `milestones.js` | Remove delay/mock, call real FastAPI endpoints |
| **Wire DB queries in routers** | `backend/routers/*.py` | Replace placeholder `return []` with actual SQLAlchemy queries |
| **Implement auto-embedding** | `backend/routers/challenges.py`, `startups.py` | After insert, queue Celery task to generate and store vector embedding |
| **Connect Celery task to router** | `backend/routers/matching.py` | Uncomment `run_match_pipeline.delay()` call, return real task_id |
| **Result polling endpoint** | `backend/routers/matching.py` | `GET /match/results/{task_id}` → real Celery `AsyncResult` |

### 🟡 Authentication (Medium Priority)
Login is mocked. For production:

| Task | Description |
|---|---|
| **Supabase Auth** | Replace mock `login()` in `useAppStore.js` with Supabase `signInWithPassword()`. Row-Level Security (RLS) on DB tables per role |
| **JWT Middleware** | Wire `python-jose` (already in requirements) into FastAPI dependency injection |
| **User → Department/Startup link** | After Supabase auth, fetch the user's associated `department_id` or `startup_id` and store in Zustand |

### 🟢 Nice-to-Have / Polish (Lower Priority)
| Task | Description |
|---|---|
| **Email notifications** | Notify startups when matched, departments when pitch submitted |
| **Real DPIIT API** | Hit the actual DPIIT/Startup India API for live verification status |
| **Pitch deck parser** | Extract text from uploaded PDF/PPTX before sending to RAG pipeline |
| **Department admin panel** | Super-admin view to manage all departments and verify startups |
| **Mobile responsiveness audit** | Sidebar collapses on mobile, Kanban scrolls horizontally — needs QA |
| **Production deployment** | Dockerfile + nginx config + environment-specific configs |

---

## 7. Database Schema

Three core tables + one cache table. Run `backend/db/migrations/001_init.sql` on your PostgreSQL instance first.

```
challenge_statements
├── id (UUID PK)
├── department_id (UUID)
├── title (VARCHAR 255)
├── description (TEXT)
├── pilot_budget (NUMERIC 12,2)
├── tags (JSONB)          -- e.g. ["AI/ML", "IoT"]
├── kpi_criteria (JSONB)  -- e.g. {"coverage": "5 wards", "uptime": "99%"}
├── embedding (VECTOR 1536)  ← pgvector
├── status (ACTIVE | REVIEW | COMPLETED | CANCELLED)
└── created_at / updated_at

startup_profiles
├── id (UUID PK)
├── company_name (VARCHAR 255)
├── dpiit_id (VARCHAR 100, UNIQUE)
├── tech_stack (JSONB)       -- e.g. ["Python", "TensorFlow"]
├── capability_statement (TEXT)
├── embedding (VECTOR 1536)  ← pgvector
├── verified_status (BOOLEAN)
└── created_at / updated_at

pilot_milestones
├── id (UUID PK)
├── challenge_id (FK → challenge_statements)
├── startup_id (FK → startup_profiles)
├── milestone_title (VARCHAR 255)
├── payout_amount (NUMERIC 12,2)
├── kpi_criteria (JSONB)
├── status (PENDING | IN_PROGRESS | REVIEW | COMPLETED | REJECTED)
└── completed_at (TIMESTAMP)

match_results  ← cache table for AI results
├── id (UUID PK)
├── challenge_id (FK)
├── startup_id (FK)
├── similarity_score (FLOAT)
├── match_rationale (TEXT)
└── created_at
```

---

## 8. How to Run the Project

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL instance with pgvector enabled (Supabase free tier works)
- Redis (local install or Upstash free tier)
- OpenAI API key

### Step 1 — Frontend
```bash
cd "D:/New folder/newpro"
npm install          # already done — node_modules exists
npm run dev          # → http://localhost:5173
```

### Step 2 — Backend
```bash
cd "D:/New folder/newpro/backend"

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

# Set up environment variables
copy .env.example .env
# Edit .env — fill in DATABASE_URL, OPENAI_API_KEY, REDIS_URL

# Run DB migration
# Go to your Supabase SQL editor and paste/run: db/migrations/001_init.sql

# Start API server
uvicorn main:app --reload --port 8000
```

### Step 3 — Celery Worker (for AI matching)
```bash
# In a separate terminal, with venv activated:
celery -A backend.workers.celery_app worker --loglevel=info
```

### Step 4 — Environment Variables (`.env`)
```env
DATABASE_URL=postgresql+asyncpg://postgres:PASSWORD@db.SUPABASE_ID.supabase.co:5432/postgres
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4o
SIMILARITY_THRESHOLD=0.78
TOP_K_RESULTS=10
CORS_ORIGINS=http://localhost:5173
SECRET_KEY=your-long-random-secret
```

---

## 9. Recommended Phase Sequence for Next Developer

Follow this order to go from current state to a fully production-ready platform:

```
Phase A — Backend Wiring (2–3 weeks)
  1. Set up Supabase project, run 001_init.sql
  2. Fill .env, confirm FastAPI connects to DB
  3. Wire real DB queries into all 4 routers
  4. Replace frontend mockData.js with real axios calls
  5. Test end-to-end: create challenge → fetch from DB → display in UI

Phase B — AI Pipeline Activation (1–2 weeks)
  6. Test embed_text() with your OpenAI key
  7. Embed a few challenges and startups manually → confirm vectors stored
  8. Test find_matching_startups() cosine query → confirm results ≥ 0.78
  9. Run the Celery match task end-to-end
  10. Wire match results into MatchResults.jsx (replace mock)

Phase C — Authentication (1–2 weeks)
  11. Create Supabase Auth project
  12. Replace mock login() in useAppStore.js with Supabase signInWithPassword()
  13. Add JWT middleware to FastAPI (python-jose already in requirements)
  14. Implement Supabase Row-Level Security per role

Phase D — Policy Sandbox (2–4 weeks)  ← Most complex phase
  15. Implement tender waiver rules engine
  16. Build micro-contract PDF generator
  17. Procurement Passport QR badge
  18. GFR compliance validation

Phase E — Polish & Deploy (1–2 weeks)
  19. Mobile QA + responsive fixes
  20. Error boundaries, loading states, empty states audit
  21. Dockerfile + deployment config
  22. Production environment setup
```

---

## 10. Key Design Decisions & Notes

| Decision | Rationale |
|---|---|
| **Separate login flows** for department vs startup | Cleaner UX, avoids role-switching confusion in government context |
| **Mock data in `src/api/`** | Allows full frontend development and demo without a live backend |
| **pgvector `<=>` operator** | Cosine distance (not dot product) is better for comparing normalized embedding vectors |
| **IVFFlat index** | Better than HNSW for batch inserts; switch to HNSW if read performance matters more |
| **0.78 similarity threshold** | Tunable via `SIMILARITY_THRESHOLD` env var — lower it to get more results |
| **GPT-4o `json_object` mode** | Forces structured output from RAG — never returns malformed JSON |
| **Celery async for matching** | AI pipeline takes 3–8 seconds; must not block HTTP request |
| **Tailwind v3 (not v4)** | v4 is CSS-first and breaks many existing patterns; v3 is stable and well-documented |
| **Zustand over Redux** | Minimal boilerplate, no providers, sufficient for this scale |

---

## 11. Contact & Handoff Notes

- **Project name**: GovPilot-X
- **Created**: August 2026
- **Frontend entry**: `src/App.jsx` — all routes are here
- **Backend entry**: `backend/main.py` — all routers registered here
- **First file to read**: `src/api/mockData.js` — all fake data is here; replace with real API calls to go live
- **First file to run**: `backend/db/migrations/001_init.sql` — must be run before backend can store anything
- **Demo login**: Any email/password works (mock auth) — no real credentials needed to explore the UI

> [!IMPORTANT]
> The frontend is **100% demeable** without any backend running. All data is mocked.
> The backend currently **does not persist data** — routers return stub responses.
> Wiring the two together is **Phase A** above.

> [!WARNING]
> Never commit `.env` to git. It contains your `OPENAI_API_KEY` and `DATABASE_URL`.
> The `.env.example` file is safe to commit (it has no real values).
