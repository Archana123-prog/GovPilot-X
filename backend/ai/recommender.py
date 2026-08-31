"""Recommendation heuristics for matching government challenges to verified solutions."""
from typing import List, Dict, Any


def generate_recommendation_label(score: float, risk_level: str) -> str:
    """Generate high-level recommendation summary based on score and risk."""
    if score >= 0.85 and risk_level.upper() in ["LOW", "MEDIUM"]:
        return "HIGHLY_RECOMMENDED"
    elif score >= 0.70:
        return "RECOMMENDED_WITH_CONDITIONS"
    elif score >= 0.50:
        return "CONSIDER_WITH_MODIFICATIONS"
    return "NOT_RECOMMENDED"


def filter_top_recommendations(evaluations: List[Dict[str, Any]], min_score: float = 0.70) -> List[Dict[str, Any]]:
    """Filter evaluations above confidence threshold."""
    return [e for e in evaluations if float(e.get("overall_score", 0)) >= min_score]
