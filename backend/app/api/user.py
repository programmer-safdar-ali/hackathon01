"""
User profile API endpoints.

This module provides endpoints for managing user profiles
and preferences.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/user", tags=["User"])
