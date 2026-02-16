"""
FastAPI main application entry point.

This module initializes the FastAPI application with CORS middleware
and registers all API routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import router as api_router

app = FastAPI(
    title="Physical AI Textbook API",
    description="Backend API for the Physical AI & Humanoid Robotics textbook",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
