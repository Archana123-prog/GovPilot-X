"""FastAPI app factory with CORS, router registration, and lifespan events."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .routers import challenges, startups, matching, milestones
from .db.connection import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: warm up DB pool etc.
    print("[GovPilot-X] Starting up...")
    yield
    # Shutdown
    print("[GovPilot-X] Shutting down...")
    await engine.dispose()


app = FastAPI(
    title="GovPilot-X API",
    version="1.0.0",
    description="AI-powered government-startup procurement platform",
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


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "GovPilot-X API"}


app.mount("/", StaticFiles(directory=Path(__file__).resolve().parent.parent, html=True), name="frontend")
