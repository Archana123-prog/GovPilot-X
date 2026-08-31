"""Notification dispatch and routing service."""
from typing import Dict, Any, List


class NotificationService:
    @staticmethod
    def format_notification(event_type: str, recipient_role: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Create structured notification payload for web push / dashboard."""
        titles = {
            "CHALLENGE_CREATED": "New Challenge Statement Published",
            "APPLICATION_SUBMITTED": "New Startup Application Received",
            "MILESTONE_SUBMITTED": "Milestone Deliverable Submitted for Review",
            "PAYMENT_APPROVED": "Milestone Payment Approved",
            "VALIDATION_COMPLETED": "Independent Validation Report Filed",
        }
        return {
            "title": titles.get(event_type, "System Notification"),
            "event_type": event_type,
            "target_role": recipient_role,
            "data": payload,
        }
