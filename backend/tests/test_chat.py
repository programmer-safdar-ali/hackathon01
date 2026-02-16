"""
Tests for POST /api/chat endpoint.

Covers: valid question, off-topic response, rate limiting, empty message.
"""

import pytest
from unittest.mock import AsyncMock, patch


@pytest.mark.asyncio
async def test_chat_valid_question(client, override_db, mock_rag_service, mock_rate_limiter, sample_chat_request):
    """Valid question returns answer with citations."""
    response = await client.post("/api/chat", json=sample_chat_request)
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "citations" in data
    assert len(data["citations"]) > 0
    assert data["citations"][0]["module"] == "module-1-ros2"


@pytest.mark.asyncio
async def test_chat_rate_limit_exceeded(client, override_db, mock_rate_limiter_exceeded, sample_chat_request):
    """Rate limit exceeded returns 429."""
    response = await client.post("/api/chat", json=sample_chat_request)
    assert response.status_code == 429
    data = response.json()
    assert "Rate limit exceeded" in str(data)


@pytest.mark.asyncio
async def test_chat_empty_message(client, override_db, mock_rate_limiter, sample_empty_message):
    """Empty message returns 400."""
    response = await client.post("/api/chat", json=sample_empty_message)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_chat_service_unavailable(client, override_db, mock_rate_limiter, sample_chat_request):
    """When RAG service fails, returns 503."""
    with patch("app.api.chat.generate_answer", new_callable=AsyncMock, side_effect=Exception("Connection failed")):
        response = await client.post("/api/chat", json=sample_chat_request)
        assert response.status_code == 503
        data = response.json()
        assert "Service unavailable" in str(data) or "unavailable" in str(data).lower()


@pytest.mark.asyncio
async def test_chat_rate_limit_info_in_response(client, override_db, mock_rag_service, mock_rate_limiter, sample_chat_request):
    """Response includes rate limit information."""
    response = await client.post("/api/chat", json=sample_chat_request)
    assert response.status_code == 200
    data = response.json()
    assert data["rate_limit"]["remaining"] == 9
    assert data["rate_limit"]["limit"] == 10
