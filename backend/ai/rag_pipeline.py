"""RAG evaluation pipeline: GPT-4o synthesis of startup-challenge match."""
import os
import json
from typing import List, Dict, Any
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL  = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o")


SYSTEM_PROMPT = """You are a government procurement evaluation AI for the GovPilot-X platform.
Your task is to evaluate startup suitability for a government pilot challenge.
Return a structured JSON response. Be concise, specific, and cite evidence from the startup profile."""


async def evaluate_match(
    challenge: Dict[str, Any],
    startup: Dict[str, Any],
    similarity_score: float,
) -> Dict[str, Any]:
    """
    Use GPT-4o to generate a structured match evaluation.
    
    Input: challenge description + KPIs + startup profile
    Output: { overall_score, rationale, kpi_analysis, risk_flags, recommendation }
    """
    user_prompt = f"""
## Government Challenge
Title: {challenge['title']}
Description: {challenge['description']}
Budget: ₹{challenge['pilot_budget']:,.0f}
KPI Criteria: {json.dumps(challenge.get('kpi_criteria', {}), indent=2)}

## Startup Profile
Company: {startup['company_name']} (DPIIT: {startup['dpiit_id']})
Verified: {startup['verified_status']}
Tech Stack: {', '.join(startup.get('tech_stack', []))}
Capability: {startup['capability_statement']}
Vector Similarity: {similarity_score:.2%}

## Task
Evaluate this startup for the challenge. Return JSON with:
- overall_score (0-100)
- match_rationale (2-3 sentences)
- kpi_analysis (dict: each KPI → "can_meet" bool + reasoning)
- risk_flags (list of strings, max 3)
- recommendation ("SHORTLIST" | "CONSIDER" | "DECLINE")
"""
    
    response = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    
    return json.loads(response.choices[0].message.content)


async def run_rag_pipeline(
    challenge: Dict[str, Any],
    candidates: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Run RAG evaluation for all candidate startups in parallel."""
    import asyncio
    tasks = [
        evaluate_match(challenge, startup, startup["similarity_score"])
        for startup in candidates
    ]
    evaluations = await asyncio.gather(*tasks, return_exceptions=True)
    
    results = []
    for startup, evaluation in zip(candidates, evaluations):
        if isinstance(evaluation, Exception):
            evaluation = {"match_rationale": "Evaluation failed", "overall_score": 0}
        results.append({**startup, **evaluation})
    
    return sorted(results, key=lambda x: x.get("overall_score", 0), reverse=True)
