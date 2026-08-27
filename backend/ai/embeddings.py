"""OpenAI text-embedding-3-small wrapper."""
import os
from typing import List
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL  = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")


async def embed_text(text: str) -> List[float]:
    """Embed a text string using OpenAI text-embedding-3-small (1536 dims)."""
    if not text.strip():
        raise ValueError("Cannot embed empty text")
    
    response = await client.embeddings.create(
        model=MODEL,
        input=text.strip(),
        encoding_format="float",
    )
    return response.data[0].embedding


async def embed_batch(texts: List[str]) -> List[List[float]]:
    """Batch embed multiple texts in a single API call."""
    response = await client.embeddings.create(
        model=MODEL,
        input=[t.strip() for t in texts if t.strip()],
        encoding_format="float",
    )
    return [d.embedding for d in response.data]


def mock_embed(text: str) -> List[float]:
    """Mock embedding for development (returns zero vector)."""
    import random
    random.seed(hash(text) % (2**32))
    return [random.gauss(0, 0.1) for _ in range(1536)]
