"""
API router registration.

This module aggregates and registers all API route modules
under a common /api prefix.
"""

from fastapi import APIRouter
from app.api.health import router as health_router
from app.api.chat import router as chat_router
from app.api.user import router as user_router

router = APIRouter(prefix="/api")
router.include_router(health_router)
router.include_router(chat_router)
router.include_router(user_router)
