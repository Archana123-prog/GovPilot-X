"""FastAPI app factory with CORS, router registration, and lifespan events."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .routers import (
    admin,
    applications,
    auth,
    challenges,
    departments,
    evaluations,
    matching,
    milestones,
    notifications,
    pilots,
    startups,
    users,
)
from .db.connection import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: warm up DB pool etc.
    print("[GovPilot-X] Starting up...")
    print("[GovPilot-X] Connected to Supabase PostgreSQL database")
    yield
    # Shutdown
    print("[GovPilot-X] Shutting down...")
    await engine.dispose()


app = FastAPI(
    title="GovPilot-X API",
    version="1.0.0",
    description="AI-powered government-startup procurement platform with Supabase",
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
import os
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(challenges.router, prefix="/challenges", tags=["Challenges"])
app.include_router(startups.router,   prefix="/startups",   tags=["Startups"])
app.include_router(matching.router,   prefix="/match",      tags=["AI Matching"])
app.include_router(milestones.router, prefix="/milestones", tags=["Milestones"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(departments.router, prefix="/departments", tags=["Departments"])
app.include_router(applications.router, prefix="/applications", tags=["Applications"])
app.include_router(evaluations.router, prefix="/evaluations", tags=["Evaluations"])
app.include_router(pilots.router, prefix="/pilots", tags=["Pilots"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "GovPilot-X API"}


app.mount("/", StaticFiles(directory=Path(__file__).resolve().parent.parent, html=True), name="frontend")
