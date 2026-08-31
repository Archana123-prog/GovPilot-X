"""Startup profile and eligibility evaluation services."""
from typing import Dict, Any


class StartupService:
    @staticmethod
    def assess_waiver_eligibility(startup_data: Dict[str, Any], pilot_budget_lakhs: float) -> Dict[str, Any]:
        """
        Evaluate if startup qualifies for pilot-level turnover waiver.
        Standard procurement requires 3 years & 5x turnover; pilot mechanism relaxes this.
        """
        turnover = float(startup_data.get("annual_turnover_lakhs") or 0)
        has_dpiit = bool(startup_data.get("dpiit_id"))

        if has_dpiit and turnover >= (pilot_budget_lakhs * 0.5):
            return {"eligible": True, "waiver_needed": False, "reason": "Meets pilot threshold"}
        elif has_dpiit:
            return {"eligible": True, "waiver_needed": True, "reason": "DPIIT recognized, eligible for pilot turnover waiver"}
        return {"eligible": False, "waiver_needed": True, "reason": "Requires DPIIT recognition or manual review"}
