"""AI matching router — triggers Celery task and returns task_id."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import UUID
import asyncio

router = APIRouter()


class MatchRequest(BaseModel):
    challenge_id: UUID
    top_k: int = 10


class MatchResponse(BaseModel):
    task_id: str
    message: str


@router.post("/startups", response_model=MatchResponse)
async def match_startups(req: MatchRequest):
    """
    Trigger async AI matching pipeline.
    
    1. Retrieve challenge embedding from DB
    2. Run pgvector cosine similarity query (similarity > 0.78)
    3. Feed top-K startups + challenge to GPT-4o RAG pipeline
    4. Return structured match report

    Returns a Celery task_id for polling results.
    """
    try:
        # In production: from workers.match_task import run_match_pipeline
        # task = run_match_pipeline.delay(str(req.challenge_id), req.top_k)
        # Mock task ID for now
        import uuid
        task_id = str(uuid.uuid4())
        return MatchResponse(
            task_id=task_id,
            message=f"Matching pipeline started for challenge {req.challenge_id}. Poll /match/results/{task_id}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/results/{task_id}")
async def get_match_results(task_id: str):
    """Poll Celery task result. Returns mock data for now."""
    return {
        "task_id": task_id,
        "status": "SUCCESS",
        "results": [
            {"startup_id": "st-001", "similarity_score": 0.94, "rationale": "Strong tech stack alignment"},
            {"startup_id": "st-002", "similarity_score": 0.89, "rationale": "Proven civic deployment experience"},
        ]
    }
