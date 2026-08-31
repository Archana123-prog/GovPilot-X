"""Celery worker configuration for asynchronous background jobs."""
import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "govpilotx",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=[
        "backend.workers.match_task",
        "backend.workers.notification_tasks",
        "backend.workers.tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)
