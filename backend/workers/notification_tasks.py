"""Asynchronous notification tasks: challenge deadlines, milestone reviews, and payment alerts."""
from .celery_app import celery_app


@celery_app.task(name="send_deadline_reminder")
def send_deadline_reminder(challenge_id: str, days_remaining: int):
    """Send reminder notifications to registered startups before challenge deadline."""
    print(f"[GovPilot-X Notification] Sending {days_remaining}-day deadline reminder for Challenge {challenge_id}")
    return {"status": "sent", "challenge_id": challenge_id, "days_remaining": days_remaining}


@celery_app.task(name="send_milestone_review_alert")
def send_milestone_review_alert(milestone_id: str, pilot_id: str):
    """Notify department officers when a startup submits milestone evidence."""
    print(f"[GovPilot-X Notification] Alerting officer for Milestone {milestone_id} in Pilot {pilot_id}")
    return {"status": "sent", "milestone_id": milestone_id, "pilot_id": pilot_id}


@celery_app.task(name="send_payment_status_alert")
def send_payment_status_alert(payment_id: str, status: str, recipient_email: str):
    """Notify startup/department when payment status advances (Approved/Processed/Paid)."""
    print(f"[GovPilot-X Notification] Payment {payment_id} updated to {status}. Notifying {recipient_email}")
    return {"status": "sent", "payment_id": payment_id, "new_status": status, "recipient": recipient_email}
