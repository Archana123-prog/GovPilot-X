"""FastAPI app factory with CORS, complete router registration, and lifespan events."""
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routers import (
    admin,
    applications,
    auth,
    challenges,
    departments,
    eligibility,
    evaluations,
    matching,
    milestones,
    notifications,
    payments,
    pilots,
    startups,
    users,
    validations,
)
from .db.connection import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[GovPilot-X] Starting up API service...")
    yield
    # Shutdown
    print("[GovPilot-X] Shutting down API service...")
    await engine.dispose()


app = FastAPI(
    title="GovPilot-X API",
    version="1.0.0",
    description="Startup-Friendly Public Procurement & Innovation Pilot Platform API",
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router,          prefix="/auth",          tags=["Auth"])
app.include_router(users.router,         prefix="/users",         tags=["Users"])
app.include_router(departments.router,   prefix="/departments",   tags=["Departments"])
app.include_router(startups.router,      prefix="/startups",      tags=["Startups"])
app.include_router(challenges.router,    prefix="/challenges",    tags=["Challenges"])
app.include_router(applications.router,  prefix="/applications",  tags=["Applications"])
app.include_router(eligibility.router,   prefix="/eligibility",   tags=["Eligibility Screening"])
app.include_router(evaluations.router,   prefix="/evaluations",   tags=["Evaluations"])
app.include_router(matching.router,      prefix="/match",         tags=["AI Matching"])
app.include_router(pilots.router,        prefix="/pilots",        tags=["Pilots"])
app.include_router(milestones.router,    prefix="/milestones",    tags=["Milestones"])
app.include_router(payments.router,      prefix="/payments",      tags=["Payments"])
app.include_router(validations.router,   prefix="/validations",   tags=["Independent Validation"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(admin.router,         prefix="/admin",         tags=["Admin"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "GovPilot-X API"}


# Serve frontend build if dist exists
dist_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if dist_dir.exists() and (dist_dir / "index.html").exists():
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")
