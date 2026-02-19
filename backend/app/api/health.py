"""
Health check endpoints.

This module provides system health monitoring endpoints
that verify connectivity to external services.
"""

from fastapi import APIRouter
from sqlalchemy import text
from app.services.qdrant_client import get_qdrant_client
from app.models.database import _get_engine

router = APIRouter(tags=["System"])


@router.get("/health")
async def health_check():
    """
    Check system health and external service connectivity.

    Returns:
        dict: Status of the API, Qdrant, and database connections.
    """
    qdrant_status = "disconnected"
    db_status = "disconnected"

    # Check Qdrant connectivity
    try:
        client = get_qdrant_client()
        client.get_collections()
        qdrant_status = "connected"
    except Exception:
        pass

    # Check database connectivity
    try:
        async with _get_engine().connect() as conn:
            await conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        pass

    return {
        "status": "ok",
        "qdrant": qdrant_status,
        "database": db_status
    }
