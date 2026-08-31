"""Pilot sandbox tracking and milestone workflow service."""
from typing import Dict, Any, List


class PilotService:
    @staticmethod
    def calculate_completion_percentage(milestones: List[Dict[str, Any]]) -> float:
        """Calculate percentage of approved milestones."""
        if not milestones:
            return 0.0
        approved = sum(1 for m in milestones if m.get("status") == "APPROVED")
        return round((approved / len(milestones)) * 100, 1)

    @staticmethod
    def validate_milestone_percentages(milestones: List[Dict[str, Any]]) -> bool:
        """Ensure sum of payment percentages across milestones equals 100%."""
        total = sum(float(m.get("payment_percentage", 0)) for m in milestones)
        return abs(total - 100.0) < 0.01
