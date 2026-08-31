# GovPilot-X
### Startup-Friendly Public Procurement & Innovation Pilot Mechanism

GovPilot-X connects government department challenges with verified startup capabilities and structured milestone-based pilots.

---

## 🏛️ Architecture Overview

- **Frontend (`frontend/`)**: React + Vite single page application with role-based views (Department Officer, Startup Founder, Evaluator, Independent Validator, Admin).
- **Backend (`backend/`)**: FastAPI (Python) asynchronous REST API — single source of truth for all workflows, authentication, audit logs, and data models (PostgreSQL + SQLAlchemy).
- **AI Engine (`backend/ai/`)**: Google Gemini embeddings (`text-embedding-004`) + pgvector cosine similarity matching and Gemini Flash RAG pipeline for candidate ranking.
- **Workers (`backend/workers/`)**: Celery background tasks for AI matching, deadline reminders, and registry synchronization.
- **Document Storage**: Firebase Storage connected seamlessly via `.env` for file uploads (signed agreements, milestone evidence, validation reports).

---

## 📁 Clean Repository Structure

```
GovPilot-X/
├── frontend/               React + Vite SPA
│   ├── src/
│   │   ├── App.jsx         Route definitions & role guards
│   │   ├── pages/          Home, Challenges, Dashboards, Auth
│   │   ├── components/     Shared UI components (Navbar, Cards, etc.)
│   │   ├── services/       API client for backend endpoints
│   │   ├── firebase/       Firebase Storage client & upload utilities
│   │   └── styles.css      Global design system styles
│   ├── .env.example        Frontend environment template (Firebase & API)
│   ├── package.json
│   └── vite.config.js
├── backend/                FastAPI System of Record
│   ├── main.py             App factory, CORS, and complete router registration
│   ├── auth.py             JWT authentication & role-based access control
│   ├── db/
│   │   ├── connection.py   Async SQLAlchemy engine (PostgreSQL / Supabase)
│   │   ├── models.py       Complete workflow ORM models & AuditLog
│   │   └── migrations/     Database migration scripts
│   ├── routers/            REST API endpoints (challenges, pilots, payments, etc.)
│   ├── services/           Core business & document management logic
│   ├── ai/                 pgvector similarity search & RAG pipeline
│   ├── workers/            Celery task definitions
│   ├── requirements.txt    Python dependencies
│   └── .env.example        Backend environment template
├── 404.html                SPA routing fallback for GitHub Pages
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend (FastAPI + PostgreSQL)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # Configure DATABASE_URL, OPENAI_API_KEY, and Firebase Storage
uvicorn main:app --reload
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)

```powershell
cd frontend
npm install
cp .env.example .env   # Configure VITE_FIREBASE_* keys and VITE_API_BASE
npm run dev
```
Frontend dev server will start at: `http://localhost:5173`

---

## 🔒 Environment Configuration (.env)

### Backend (`backend/.env`):
- `DATABASE_URL`: PostgreSQL connection string (with asyncpg driver)
- `GEMINI_API_KEY`: API key from Google AI Studio for embeddings and evaluation
- `REDIS_URL`: Redis broker URL for Celery workers
- `SECRET_KEY`: JWT signing secret
- `FIREBASE_STORAGE_BUCKET`: Firebase Storage bucket name for server-side documents

### Frontend (`frontend/.env`):
- `VITE_API_BASE`: Backend API base URL (`http://localhost:8000`)
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase Storage bucket for client file uploads
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`: Firebase project identifiers
