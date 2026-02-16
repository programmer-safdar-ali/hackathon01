"""
Qdrant Cloud client initialization and management.

This module provides a singleton Qdrant client instance
for vector database operations.
"""

from qdrant_client import QdrantClient
from app.config import settings

# Global client instance
_client: QdrantClient | None = None


def get_qdrant_client() -> QdrantClient:
    """
    Get or create the Qdrant client singleton.

    Returns:
        QdrantClient: Initialized Qdrant client instance.
    """
    global _client
    if _client is None:
        _client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key
        )
    return _client
