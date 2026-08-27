"""Async Celery task: full RAG matching pipeline."""
import asyncio
from .celery_app import celery_app


@celery_app.task(bind=True, name="match_pipeline", max_retries=3)
def run_match_pipeline(self, challenge_id: str, top_k: int = 10):
    """
    Full matching pipeline (runs async code in sync Celery worker):
    
    1. Load challenge from DB + get its embedding
    2. If embedding missing, generate via text-embedding-3-small
    3. Run pgvector cosine similarity search (threshold=0.78)
    4. Run GPT-4o RAG evaluation on top-K candidates in parallel
    5. Save MatchResult records to DB
    6. Return ranked evaluations
    """
    try:
        return asyncio.run(_pipeline(challenge_id, top_k))
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)


async def _pipeline(challenge_id: str, top_k: int):
    from backend.db.connection import AsyncSessionLocal
    from backend.db.models import ChallengeStatement
    from backend.ai.embeddings import embed_text
    from backend.ai.vector_store import find_matching_startups
    from backend.ai.rag_pipeline import run_rag_pipeline
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        # Load challenge
        result = await db.execute(
            select(ChallengeStatement).where(ChallengeStatement.id == challenge_id)
        )
        challenge = result.scalar_one_or_none()
        if not challenge:
            raise ValueError(f"Challenge {challenge_id} not found")

        # Embed challenge if needed
        if challenge.embedding is None:
            challenge.embedding = await embed_text(
                f"{challenge.title}\n{challenge.description}"
            )
            await db.commit()

        # Vector search
        candidates = await find_matching_startups(db, challenge.embedding, top_k)

        if not candidates:
            return {"challenge_id": challenge_id, "matches": []}

        # RAG evaluation
        challenge_dict = {
            "title": challenge.title,
            "description": challenge.description,
            "pilot_budget": float(challenge.pilot_budget),
            "kpi_criteria": challenge.kpi_criteria or {},
        }
        ranked = await run_rag_pipeline(challenge_dict, candidates)

        return {"challenge_id": challenge_id, "matches": ranked}
