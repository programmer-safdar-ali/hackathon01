"""
Tiered rate limiting service.

Implements sliding window rate limiting:
- Anonymous users (by IP hash): 10 queries per hour
- Authenticated users (by user_id): 60 queries per hour
"""

from datetime import datetime, timedelta, timezone
from hashlib import sha256

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import RateLimit

ANONYMOUS_LIMIT = 10
AUTHENTICATED_LIMIT = 60
WINDOW_DURATION = timedelta(hours=1)


def hash_ip(ip_address: str) -> str:
    """Hash an IP address for anonymous rate limiting."""
    return sha256(ip_address.encode()).hexdigest()[:32]


async def check_rate_limit(
    db: AsyncSession,
    identifier: str,
    identifier_type: str,
) -> dict:
    """
    Check and update rate limit for the given identifier.

    Args:
        db: Database session.
        identifier: User ID or hashed IP.
        identifier_type: "user" or "ip".

    Returns:
        dict with keys: allowed (bool), remaining (int), limit (int), reset_at (datetime).
    """
    now = datetime.now(timezone.utc)
    limit = AUTHENTICATED_LIMIT if identifier_type == "user" else ANONYMOUS_LIMIT

    result = await db.execute(
        select(RateLimit).where(
            RateLimit.identifier == identifier,
            RateLimit.identifier_type == identifier_type,
        )
    )
    rate_limit = result.scalar_one_or_none()

    if rate_limit is None:
        rate_limit = RateLimit(
            identifier=identifier,
            identifier_type=identifier_type,
            query_count=1,
            window_start=now,
        )
        db.add(rate_limit)
        await db.commit()
        return {
            "allowed": True,
            "remaining": limit - 1,
            "limit": limit,
            "reset_at": now + WINDOW_DURATION,
        }

    # Check if window has expired
    window_end = rate_limit.window_start + WINDOW_DURATION
    if now >= window_end:
        rate_limit.query_count = 1
        rate_limit.window_start = now
        await db.commit()
        return {
            "allowed": True,
            "remaining": limit - 1,
            "limit": limit,
            "reset_at": now + WINDOW_DURATION,
        }

    # Within current window
    if rate_limit.query_count >= limit:
        return {
            "allowed": False,
            "remaining": 0,
            "limit": limit,
            "reset_at": window_end,
        }

    rate_limit.query_count += 1
    await db.commit()
    return {
        "allowed": True,
        "remaining": limit - rate_limit.query_count,
        "limit": limit,
        "reset_at": window_end,
    }
