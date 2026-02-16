"""
User-related database models.

This module defines SQLAlchemy models for Better-Auth managed tables
(users, sessions) and application-specific user tables (user_profiles, rate_limits).
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    Integer,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.database import Base


class User(Base):
    """
    Better-Auth managed users table.
    Uses TEXT for id to match Better-Auth convention.
    """
    __tablename__ = "users"

    id = Column(Text, primary_key=True)
    email = Column(Text, unique=True, nullable=False, index=True)
    email_verified = Column(Boolean, default=False, nullable=False)
    name = Column(Text, nullable=True)
    image = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    conversations = relationship("ChatConversation", back_populates="user", cascade="all, delete-orphan")


class Session(Base):
    """
    Better-Auth managed sessions table.
    Uses TEXT for id and user_id to match Better-Auth convention.
    """
    __tablename__ = "sessions"

    id = Column(Text, primary_key=True)
    user_id = Column(Text, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(Text, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    ip_address = Column(Text, nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="sessions")


class UserProfile(Base):
    """
    Application-specific user profile data.
    Uses UUID for id, TEXT for user_id reference.
    """
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(Text, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    background = Column(
        Text,
        nullable=False,
        default="software",
    )
    skill_level = Column(
        Text,
        nullable=False,
        default="intermediate",
    )
    language_preference = Column(
        Text,
        nullable=False,
        default="en",
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "background IN ('software', 'hardware')",
            name="check_background_valid"
        ),
        CheckConstraint(
            "skill_level IN ('beginner', 'intermediate', 'advanced')",
            name="check_skill_level_valid"
        ),
        CheckConstraint(
            "language_preference IN ('en', 'ur')",
            name="check_language_preference_valid"
        ),
    )

    # Relationships
    user = relationship("User", back_populates="profile")


class RateLimit(Base):
    """
    Rate limiting tracking table.
    Uses UUID for id, tracks query counts per identifier.
    """
    __tablename__ = "rate_limits"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    identifier = Column(Text, nullable=False, index=True)
    identifier_type = Column(Text, nullable=False)
    query_count = Column(Integer, default=0, nullable=False)
    window_start = Column(DateTime(timezone=True), nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "identifier_type IN ('user', 'ip')",
            name="check_identifier_type_valid"
        ),
    )
