"""
Pytest fixtures for backend tests.

Provides async test client, mock services, and sample payloads.
"""

from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.models.database import get_db


class FakeAsyncSession:
    """Minimal async session mock for testing."""

    def __init__(self):
        self._store = {}

    async def commit(self):
        pass

    async def rollback(self):
        pass

    async def close(self):
        pass

    def add(self, obj):
        pass

    async def execute(self, stmt):
        return MagicMock(scalar_one_or_none=MagicMock(return_value=None))


@pytest.fixture
def fake_db():
    return FakeAsyncSession()


@pytest.fixture
def override_db(fake_db):
    async def _override():
        yield fake_db

    app.dependency_overrides[get_db] = _override
    yield fake_db
    app.dependency_overrides.clear()


@pytest.fixture
def mock_rag_service():
    with patch("app.api.chat.generate_answer", new_callable=AsyncMock) as mock_gen, \
         patch("app.api.chat.generate_answer_stream") as mock_stream:
        mock_gen.return_value = {
            "message": "A ROS 2 node is a single-purpose process in the ROS 2 computation graph.",
            "citations": [
                {
                    "module": "module-1-ros2",
                    "chapter": "01-ros2-architecture",
                    "section": "Core Concepts",
                    "url": "/docs/module-1-ros2/ros2-architecture#core-concepts",
                }
            ],
        }
        yield mock_gen, mock_stream


@pytest.fixture
def mock_rate_limiter():
    with patch("app.api.chat.check_rate_limit", new_callable=AsyncMock) as mock_rl:
        mock_rl.return_value = {
            "allowed": True,
            "remaining": 9,
            "limit": 10,
            "reset_at": datetime(2026, 2, 16, 12, 0, 0, tzinfo=timezone.utc),
        }
        yield mock_rl


@pytest.fixture
def mock_rate_limiter_exceeded():
    with patch("app.api.chat.check_rate_limit", new_callable=AsyncMock) as mock_rl:
        mock_rl.return_value = {
            "allowed": False,
            "remaining": 0,
            "limit": 10,
            "reset_at": datetime(2026, 2, 16, 12, 0, 0, tzinfo=timezone.utc),
        }
        yield mock_rl


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def sample_chat_request():
    return {
        "message": "What is a ROS 2 node?",
        "conversation_id": None,
        "module_filter": None,
        "difficulty_filter": None,
    }


@pytest.fixture
def sample_chat_request_with_filter():
    return {
        "message": "Explain DDS middleware",
        "conversation_id": None,
        "module_filter": "module-1-ros2",
        "difficulty_filter": "beginner",
    }


@pytest.fixture
def sample_empty_message():
    return {"message": "", "conversation_id": None}


@pytest.fixture
def sample_long_message():
    return {"message": "a" * 2001, "conversation_id": None}


@pytest.fixture
def mock_qdrant_client():
    with patch("app.services.qdrant_client.get_qdrant_client") as mock:
        client = MagicMock()
        mock.return_value = client

        hit = MagicMock()
        hit.payload = {
            "text": "A ROS 2 node is a single-purpose process.",
            "module": "module-1-ros2",
            "chapter": "01-ros2-architecture",
            "section": "Core Concepts",
            "url": "/docs/module-1-ros2/ros2-architecture#core-concepts",
        }
        hit.score = 0.85
        client.search.return_value = [hit]

        yield client


@pytest.fixture
def mock_openai_client():
    with patch("app.services.embeddings._get_openai_client") as mock_embed, \
         patch("app.services.rag._get_openai_client") as mock_rag:
        embed_client = AsyncMock()
        embed_response = MagicMock()
        embed_response.data = [MagicMock(embedding=[0.1] * 1536)]
        embed_client.embeddings.create.return_value = embed_response
        mock_embed.return_value = embed_client

        rag_client = AsyncMock()
        chat_response = MagicMock()
        choice = MagicMock()
        choice.message.content = "A ROS 2 node is a single-purpose process in the computation graph."
        chat_response.choices = [choice]
        rag_client.chat.completions.create.return_value = chat_response
        mock_rag.return_value = rag_client

        yield embed_client, rag_client
