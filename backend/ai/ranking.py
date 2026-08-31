"""Ranking and scoring utilities for evaluated candidate startups."""
from typing import List, Dict, Any


def rank_candidates(candidates: List[Dict[str, Any]], sort_key: str = "composite_score") -> List[Dict[str, Any]]:
    """Sort candidates in descending order by specified score field."""
    return sorted(candidates, key=lambda c: float(c.get(sort_key, 0)), reverse=True)


def calculate_percentile_rank(scores: List[float], target_score: float) -> float:
    """Calculate percentile rank of a candidate score relative to cohort."""
    if not scores:
        return 100.0
    lower_count = sum(1 for s in scores if s < target_score)
    return round((lower_count / len(scores)) * 100, 1)
