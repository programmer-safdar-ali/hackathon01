"""
API router registration.

This module aggregates and registers all API route modules
under a common /api prefix.
"""

from fastapi import APIRouter
from app.api.health import router as health_router

router = APIRouter(prefix="/api")
router.include_router(health_router)
