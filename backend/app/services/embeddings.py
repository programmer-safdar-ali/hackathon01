"""
Embedding generation service using OpenAI.

This module provides async functions to generate text embeddings
using OpenAI's text-embedding-3-small model (1536 dimensions).
"""

from openai import AsyncOpenAI
from app.config import settings

# Global OpenAI client instance
_client: AsyncOpenAI | None = None


def _get_openai_client() -> AsyncOpenAI:
    """
    Get or create the OpenAI client singleton.

    Returns:
        AsyncOpenAI: Initialized async OpenAI client instance.
    """
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


async def generate_embedding(text: str) -> list[float]:
    """
    Generate an embedding vector for the given text.

    Args:
        text: Input text to embed.

    Returns:
        list[float]: 1536-dimensional embedding vector.

    Raises:
        OpenAI API exceptions on failure.
    """
    client = _get_openai_client()
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return response.data[0].embedding
