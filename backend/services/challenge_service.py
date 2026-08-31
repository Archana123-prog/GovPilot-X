"""Challenge lifecycle management and validation services."""
from typing import Dict, Any, List


class ChallengeService:
    @staticmethod
    def validate_outcome_statement(data: Dict[str, Any]) -> List[str]:
        """Verify that outcome-based problem statements have measurable KPIs."""
        errors = []
        if not data.get("title") or len(data["title"]) < 5:
            errors.append("Title must be at least 5 characters")
        if not data.get("desired_outcome"):
            errors.append("Desired measurable outcome is required")
        if float(data.get("pilot_budget_lakhs") or 0) <= 0:
            errors.append("Pilot budget must be greater than zero")
        return errors
