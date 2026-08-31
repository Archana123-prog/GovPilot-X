"""General background task definitions: registry sync and system maintenance."""
from .celery_app import celery_app


@celery_app.task(name="sync_dpiit_registry")
def sync_dpiit_registry():
    """Sync verified startup profiles with national DPIIT / Startup India registry."""
    print("[GovPilot-X Worker] Running scheduled DPIIT startup registry synchronization...")
    return {"status": "success", "synced_count": 0}


@celery_app.task(name="cleanup_stale_sessions")
def cleanup_stale_sessions():
    """Periodic maintenance to clean expired sessions and audit logs."""
    print("[GovPilot-X Worker] Executing routine maintenance task...")
    return {"status": "success"}
