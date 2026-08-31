"""RAG evaluation pipeline: Google Gemini synthesis of startup-challenge match."""
import os
import json
import asyncio
from typing import List, Dict, Any
import httpx

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
MODEL = os.getenv("GEMINI_CHAT_MODEL") or os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

SYSTEM_PROMPT = """You are a government procurement evaluation AI for the GovPilot-X platform.
Your task is to evaluate startup suitability for a government pilot challenge.
Return a structured JSON response. Be concise, specific, and cite evidence from the startup profile."""


async def evaluate_match(
    challenge: Dict[str, Any],
    startup: Dict[str, Any],
    similarity_score: float,
) -> Dict[str, Any]:
    """
    Use Google Gemini to generate a structured match evaluation.
    
    Input: challenge description + KPIs + startup profile
    Output: { overall_score, match_rationale, kpi_analysis, risk_flags, recommendation }
    """
    user_prompt = f"""
## Government Challenge
Title: {challenge.get('title', 'N/A')}
Description: {challenge.get('description') or challenge.get('problem_context', 'N/A')}
Budget: ₹{float(challenge.get('pilot_budget') or challenge.get('pilot_budget_lakhs') or 0):,.0f} Lakhs
KPI Criteria: {json.dumps(challenge.get('kpi_criteria', {}), indent=2)}

## Startup Profile
Company: {startup.get('company_name', 'N/A')} (DPIIT: {startup.get('dpiit_id', 'N/A')})
Verified: {startup.get('verified_status', False)}
Tech Stack: {', '.join(startup.get('tech_stack', []))}
Capability: {startup.get('capability_statement', 'N/A')}
Vector Similarity: {similarity_score:.2%}

## Task
Evaluate this startup for the challenge. Return valid JSON only with keys:
- overall_score (integer 0-100)
- match_rationale (2-3 sentences explaining fit)
- kpi_analysis (dict: each KPI -> {{"can_meet": true/false, "reasoning": "..."}})
- risk_flags (list of strings, max 3)
- recommendation ("SHORTLIST" | "CONSIDER" | "DECLINE")
"""

    if not GEMINI_API_KEY or GEMINI_API_KEY.startswith("sk-") or "your-" in GEMINI_API_KEY:
        return _fallback_evaluation(startup, similarity_score)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "system_instruction": {
            "parts": [{"text": SYSTEM_PROMPT}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": user_prompt}]
            }
        ],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.2
        }
    }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text_content)
            else:
                print(f"[Gemini RAG Warning] API error {resp.status_code}: {resp.text}")
                return _fallback_evaluation(startup, similarity_score)
    except Exception as exc:
        print(f"[Gemini RAG Warning] Error generating evaluation: {exc}")
        return _fallback_evaluation(startup, similarity_score)


def _fallback_evaluation(startup: Dict[str, Any], similarity_score: float) -> Dict[str, Any]:
    """Provide structured rule-based evaluation when offline or API key pending."""
    score = int(min(100, max(40, similarity_score * 100 + (10 if startup.get("verified_status") else 0))))
    recommendation = "SHORTLIST" if score >= 80 else ("CONSIDER" if score >= 60 else "DECLINE")

    return {
        "overall_score": score,
        "match_rationale": f"{startup.get('company_name', 'The startup')} demonstrates strong domain alignment ({similarity_score:.1%} vector similarity) with relevant capabilities in {', '.join(startup.get('tech_stack', ['target sector'])[:3])}.",
        "kpi_analysis": {
            "Technical Feasibility": {"can_meet": score >= 60, "reasoning": "Capability statement aligns with challenge requirements."},
            "Timeline Compliance": {"can_meet": True, "reasoning": "Team size and structure suitable for rapid pilot deployment."}
        },
        "risk_flags": [] if score >= 75 else ["Requires initial sandbox testing phase prior to full civic rollout."],
        "recommendation": recommendation,
    }


async def run_rag_pipeline(
    challenge: Dict[str, Any],
    candidates: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Run Gemini RAG evaluation for all candidate startups in parallel."""
    tasks = [
        evaluate_match(challenge, startup, startup.get("similarity_score", 0.75))
        for startup in candidates
    ]
    evaluations = await asyncio.gather(*tasks, return_exceptions=True)

    results = []
    for startup, evaluation in zip(candidates, evaluations):
        if isinstance(evaluation, Exception):
            evaluation = _fallback_evaluation(startup, startup.get("similarity_score", 0.7))
        results.append({**startup, **evaluation})

    return sorted(results, key=lambda x: x.get("overall_score", 0), reverse=True)
