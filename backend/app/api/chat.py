"""
Chat API endpoints.

Provides POST /api/chat for RAG chatbot, POST /api/chat/stream for SSE,
and GET /api/chat/history for conversation retrieval.
"""

import json
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.database import get_db
from app.services.rag import generate_answer, generate_answer_stream
from app.services.rate_limiter import check_rate_limit, hash_ip

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str = Field(..., max_length=2000)
    conversation_id: Optional[UUID] = None
    module_filter: Optional[str] = None
    difficulty_filter: Optional[str] = None


class Citation(BaseModel):
    module: str
    chapter: str
    section: str
    url: str


class RateLimitInfo(BaseModel):
    remaining: int
    limit: int
    reset_at: str


class ChatResponse(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None
    citations: list[Citation] = []
    rate_limit: Optional[RateLimitInfo] = None


def _get_identifier(request: Request) -> tuple[str, str]:
    """Extract rate limit identifier from request."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer ") and hasattr(request.state, "user_id"):
        return request.state.user_id, "user"
    client_ip = request.client.host if request.client else "unknown"
    return hash_ip(client_ip), "ip"


@router.post("", response_model=ChatResponse)
async def send_chat_message(
    body: ChatRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Send a chat message and receive a RAG-powered response."""
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    identifier, id_type = _get_identifier(request)
    rate_info = await check_rate_limit(db, identifier, id_type)

    if not rate_info["allowed"]:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Rate limit exceeded",
                "message": "Query limit reached. Sign in for more questions or try again later.",
                "reset_at": rate_info["reset_at"].isoformat(),
            },
        )

    try:
        result = await generate_answer(
            question=body.message,
            module_filter=body.module_filter,
            difficulty_filter=body.difficulty_filter,
        )
    except Exception:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Service unavailable",
                "message": "Chatbot is temporarily unavailable. Please try again later.",
            },
        )

    return ChatResponse(
        message=result["message"],
        conversation_id=body.conversation_id,
        citations=[Citation(**c) for c in result["citations"]],
        rate_limit=RateLimitInfo(
            remaining=rate_info["remaining"],
            limit=rate_info["limit"],
            reset_at=rate_info["reset_at"].isoformat(),
        ),
    )


@router.post("/stream")
async def stream_chat_message(
    body: ChatRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Send a chat message and receive a streaming SSE response."""
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    identifier, id_type = _get_identifier(request)
    rate_info = await check_rate_limit(db, identifier, id_type)

    if not rate_info["allowed"]:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Rate limit exceeded",
                "message": "Query limit reached. Sign in for more questions or try again later.",
                "reset_at": rate_info["reset_at"].isoformat(),
            },
        )

    async def event_generator():
        try:
            async for chunk in generate_answer_stream(
                question=body.message,
                module_filter=body.module_filter,
                difficulty_filter=body.difficulty_filter,
            ):
                data = json.dumps(chunk)
                yield f"data: {data}\n\n"
            yield "data: [DONE]\n\n"
        except Exception:
            error = json.dumps({
                "error": "Service unavailable",
                "message": "Chatbot is temporarily unavailable.",
            })
            yield f"data: {error}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )
