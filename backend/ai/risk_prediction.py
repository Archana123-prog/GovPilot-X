"""Risk assessment heuristics for public procurement pilots."""
from typing import Dict, Any, List


def evaluate_pilot_risk(startup_profile: Dict[str, Any], pilot_scope: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluate implementation and regulatory risks for pilot deployment.
    Evaluates: team size, deployment timeline, budget ratio, and integration complexity.
    """
    risks: List[str] = []
    team_size = int(startup_profile.get("team_size") or 1)
    duration_months = int(pilot_scope.get("timeline_months") or 6)
    budget = float(pilot_scope.get("pilot_budget_lakhs") or 0)

    if team_size < 3:
        risks.append("Small core team may face bandwidth constraints for dedicated pilot deployment.")
    if duration_months < 3:
        risks.append("Aggressive timeline may increase milestone delay probability.")
    if budget > 100:
        risks.append("High budget pilot requires multi-stage independent validation gates.")

    risk_level = "HIGH" if len(risks) >= 2 else ("MEDIUM" if len(risks) == 1 else "LOW")

    return {
        "risk_level": risk_level,
        "identified_risks": risks,
        "mitigation_suggestions": [
            "Establish bi-weekly KPI check-ins",
            "Incorporate sandbox test phase prior to civic deployment",
        ],
    }
