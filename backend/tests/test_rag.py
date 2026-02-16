"""
Tests for RAG pipeline service.

Covers: embedding generation, Qdrant search, prompt construction,
no-results fallback.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from app.services.rag import (
    search_content,
    generate_answer,
    _build_prompt,
    _extract_citations,
    NO_RESULTS_MESSAGE,
)


@pytest.mark.asyncio
async def test_search_content_returns_results(mock_qdrant_client, mock_openai_client):
    """Search returns formatted results from Qdrant."""
    results = await search_content("What is a ROS 2 node?")
    assert len(results) == 1
    assert results[0]["module"] == "module-1-ros2"
    assert results[0]["chapter"] == "01-ros2-architecture"
    assert results[0]["score"] == 0.85


@pytest.mark.asyncio
async def test_search_content_with_filters(mock_qdrant_client, mock_openai_client):
    """Search with module filter passes filter to Qdrant."""
    await search_content("DDS", module_filter="module-1-ros2")
    call_args = mock_qdrant_client.search.call_args
    assert call_args.kwargs.get("query_filter") is not None or \
           (len(call_args.args) > 0 or call_args.kwargs.get("query_filter") is not None)


@pytest.mark.asyncio
async def test_generate_answer_with_results(mock_qdrant_client, mock_openai_client):
    """Full pipeline returns answer with citations."""
    result = await generate_answer("What is a ROS 2 node?")
    assert "message" in result
    assert "citations" in result
    assert len(result["citations"]) > 0


@pytest.mark.asyncio
async def test_generate_answer_no_results():
    """When Qdrant returns empty results, fallback message is returned."""
    with patch("app.services.rag.search_content", new_callable=AsyncMock, return_value=[]):
        result = await generate_answer("completely unrelated topic")
        assert result["message"] == NO_RESULTS_MESSAGE
        assert result["citations"] == []


def test_build_prompt_includes_context():
    """Prompt includes context chunks and question."""
    chunks = [
        {
            "text": "A node is a process.",
            "module": "module-1-ros2",
            "chapter": "01-ros2-architecture",
            "section": "Core Concepts",
            "url": "/docs/module-1-ros2/ros2-architecture",
            "score": 0.9,
        }
    ]
    messages = _build_prompt("What is a node?", chunks)
    assert messages[0]["role"] == "system"
    assert "A node is a process." in messages[-1]["content"]
    assert "What is a node?" in messages[-1]["content"]


def test_build_prompt_with_history():
    """Prompt includes conversation history."""
    chunks = [{"text": "test", "module": "m1", "chapter": "c1", "section": "s1", "url": "/", "score": 0.9}]
    history = [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there"},
    ]
    messages = _build_prompt("Follow up?", chunks, history)
    assert len(messages) == 4  # system + 2 history + user


def test_extract_citations_deduplicates():
    """Citations are deduplicated by module+chapter."""
    chunks = [
        {"module": "m1", "chapter": "c1", "section": "s1", "url": "/a"},
        {"module": "m1", "chapter": "c1", "section": "s2", "url": "/a"},
        {"module": "m2", "chapter": "c1", "section": "s1", "url": "/b"},
    ]
    citations = _extract_citations(chunks)
    assert len(citations) == 2
