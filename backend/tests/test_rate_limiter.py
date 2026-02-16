"""
Tests for rate limiter service.

Covers: anonymous blocking after 10 queries, window reset,
authenticated user with 60-query limit.
"""

import pytest
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock, AsyncMock, patch

from app.services.rate_limiter import (
    check_rate_limit,
    hash_ip,
    ANONYMOUS_LIMIT,
    AUTHENTICATED_LIMIT,
    WINDOW_DURATION,
)
from app.models.user import RateLimit


def test_hash_ip_consistent():
    """Same IP always produces the same hash."""
    assert hash_ip("192.168.1.1") == hash_ip("192.168.1.1")


def test_hash_ip_different():
    """Different IPs produce different hashes."""
    assert hash_ip("192.168.1.1") != hash_ip("10.0.0.1")


@pytest.mark.asyncio
async def test_first_query_allowed():
    """First query from a new identifier is always allowed."""
    db = AsyncMock()
    result_mock = MagicMock()
    result_mock.scalar_one_or_none.return_value = None
    db.execute.return_value = result_mock

    result = await check_rate_limit(db, "test-user", "user")
    assert result["allowed"] is True
    assert result["remaining"] == AUTHENTICATED_LIMIT - 1
    assert result["limit"] == AUTHENTICATED_LIMIT


@pytest.mark.asyncio
async def test_anonymous_limit_10():
    """Anonymous user limit is 10."""
    db = AsyncMock()
    rate_limit = MagicMock(spec=RateLimit)
    rate_limit.query_count = 10
    rate_limit.window_start = datetime.now(timezone.utc) - timedelta(minutes=30)
    result_mock = MagicMock()
    result_mock.scalar_one_or_none.return_value = rate_limit
    db.execute.return_value = result_mock

    result = await check_rate_limit(db, hash_ip("1.2.3.4"), "ip")
    assert result["allowed"] is False
    assert result["remaining"] == 0
    assert result["limit"] == ANONYMOUS_LIMIT


@pytest.mark.asyncio
async def test_window_reset_after_one_hour():
    """Query count resets after the 1-hour window expires."""
    db = AsyncMock()
    rate_limit = MagicMock(spec=RateLimit)
    rate_limit.query_count = 10
    rate_limit.window_start = datetime.now(timezone.utc) - timedelta(hours=2)
    result_mock = MagicMock()
    result_mock.scalar_one_or_none.return_value = rate_limit
    db.execute.return_value = result_mock

    result = await check_rate_limit(db, hash_ip("1.2.3.4"), "ip")
    assert result["allowed"] is True
    assert result["remaining"] == ANONYMOUS_LIMIT - 1


@pytest.mark.asyncio
async def test_authenticated_limit_60():
    """Authenticated user has a higher limit of 60."""
    db = AsyncMock()
    rate_limit = MagicMock(spec=RateLimit)
    rate_limit.query_count = 59
    rate_limit.window_start = datetime.now(timezone.utc) - timedelta(minutes=30)
    result_mock = MagicMock()
    result_mock.scalar_one_or_none.return_value = rate_limit
    db.execute.return_value = result_mock

    result = await check_rate_limit(db, "user-123", "user")
    assert result["allowed"] is True
    assert result["remaining"] == 0
    assert result["limit"] == AUTHENTICATED_LIMIT
