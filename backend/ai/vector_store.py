"""pgvector cosine similarity search against startup_profiles."""
import os
from typing import List
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.78"))
TOP_K = int(os.getenv("TOP_K_RESULTS", "10"))


async def find_matching_startups(
    db: AsyncSession,
    challenge_embedding: List[float],
    top_k: int = TOP_K,
    threshold: float = SIMILARITY_THRESHOLD,
) -> List[dict]:
    """
    Run pgvector cosine similarity search.
    
    Returns startups with similarity score >= threshold, sorted by score DESC.
    Uses IVFFlat index for approximate nearest-neighbor search at scale.
    """
    query = text("""
        SELECT
            sp.id,
            sp.company_name,
            sp.dpiit_id,
            sp.tech_stack,
            sp.capability_statement,
            sp.verified_status,
            sp.team_size,
            1 - (sp.embedding <=> :embedding::vector) AS similarity_score
        FROM startup_profiles sp
        WHERE sp.embedding IS NOT NULL
          AND 1 - (sp.embedding <=> :embedding::vector) >= :threshold
        ORDER BY sp.embedding <=> :embedding::vector
        LIMIT :top_k
    """)

    result = await db.execute(query, {
        "embedding": str(challenge_embedding),
        "threshold": threshold,
        "top_k": top_k,
    })
    
    rows = result.fetchall()
    return [
        {
            "id": str(row.id),
            "company_name": row.company_name,
            "dpiit_id": row.dpiit_id,
            "tech_stack": row.tech_stack,
            "capability_statement": row.capability_statement,
            "verified_status": row.verified_status,
            "team_size": row.team_size,
            "similarity_score": float(row.similarity_score),
        }
        for row in rows
    ]
