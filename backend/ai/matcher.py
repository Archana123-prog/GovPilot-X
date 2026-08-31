"""Matching orchestration boundary linking vector retrieval and LLM evaluation."""
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from .embeddings import embed_text
from .vector_store import find_matching_startups
from .rag_pipeline import run_rag_pipeline


async def match_challenge_with_startups(
    db: AsyncSession,
    challenge_data: Dict[str, Any],
    top_k: int = 10,
) -> List[Dict[str, Any]]:
    """Execute end-to-end matching workflow: embed query -> pgvector search -> GPT-4o RAG ranking."""
    query_text = f"{challenge_data.get('title', '')}\n{challenge_data.get('problem_context', '')}\n{challenge_data.get('desired_outcome', '')}"
    embedding = await embed_text(query_text)

    candidates = await find_matching_startups(db, embedding, top_k=top_k)
    if not candidates:
        return []

    ranked = await run_rag_pipeline(challenge_data, candidates)
    return ranked
