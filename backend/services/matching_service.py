"""Matching orchestration service bridging embedding generation, vector search, and RAG."""
from typing import List, Dict, Any


class MatchingService:
    @staticmethod
    def calculate_weighted_score(vector_similarity: float, domain_fit: float, readiness_score: float) -> float:
        """
        Calculate composite matching score:
        - 50% semantic vector similarity
        - 30% domain keyword/tag alignment
        - 20% team/tech readiness score
        """
        composite = (vector_similarity * 0.5) + (domain_fit * 0.3) + (readiness_score * 0.2)
        return round(composite, 4)
