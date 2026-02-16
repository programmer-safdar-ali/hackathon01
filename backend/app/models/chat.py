"""
Chat-related database models.

This module defines SQLAlchemy models for chat conversations
and messages with proper relationships and indexes.
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    Text,
    DateTime,
    ForeignKey,
    CheckConstraint,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.database import Base


class ChatConversation(Base):
    """
    Chat conversation metadata.
    Uses UUID for id, TEXT for user_id reference.
    """
    __tablename__ = "chat_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(Text, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(Text, nullable=True)
    current_module = Column(Text, nullable=True)
    current_chapter = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_chat_conversations_user_id", "user_id"),
    )


class ChatMessage(Base):
    """
    Individual chat messages within conversations.
    Uses UUID for id and conversation_id.
    """
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("chat_conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    citations = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "role IN ('user', 'assistant')",
            name="check_role_valid"
        ),
        Index("idx_chat_messages_conversation_id", "conversation_id"),
    )

    # Relationships
    conversation = relationship("ChatConversation", back_populates="messages")
