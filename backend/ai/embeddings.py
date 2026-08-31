"""Google Gemini text embedding wrapper (text-embedding-004)."""
import os
import random
from typing import List
import httpx

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
MODEL = os.getenv("GEMINI_EMBEDDING_MODEL", "text-embedding-004")
EMBEDDING_DIM = 768


async def embed_text(text: str) -> List[float]:
    """Embed a text string using Google Gemini text-embedding-004 (768 dims)."""
    if not text or not text.strip():
        raise ValueError("Cannot embed empty text")

    clean_text = text.strip()

    if not GEMINI_API_KEY or GEMINI_API_KEY.startswith("sk-") or "your-" in GEMINI_API_KEY:
        return mock_embed(clean_text)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:embedContent?key={GEMINI_API_KEY}"
    payload = {
        "model": f"models/{MODEL}",
        "content": {
            "parts": [{"text": clean_text}]
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data["embedding"]["values"]
            else:
                print(f"[Gemini Embeddings Warning] API error {resp.status_code}: {resp.text}, using mock embedding")
                return mock_embed(clean_text)
    except Exception as exc:
        print(f"[Gemini Embeddings Warning] Connection error: {exc}, using mock embedding")
        return mock_embed(clean_text)


async def embed_batch(texts: List[str]) -> List[List[float]]:
    """Batch embed multiple texts."""
    results = []
    for t in texts:
        if t.strip():
            emb = await embed_text(t)
            results.append(emb)
    return results


def mock_embed(text: str) -> List[float]:
    """Deterministic mock embedding for offline development (768 dims)."""
    random.seed(hash(text) % (2**32))
    return [round(random.gauss(0, 0.1), 6) for _ in range(EMBEDDING_DIM)]
