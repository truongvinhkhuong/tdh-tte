"""Redis client wrapper."""
import logging
from typing import Optional

import redis.asyncio as redis

from ..config import Settings

logger = logging.getLogger(__name__)


class RedisClient:
    """Async Redis client wrapper."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.client: Optional[redis.Redis] = None

    async def connect(self) -> None:
        """Connect to Redis."""
        try:
            kwargs = {
                "host": self.settings.redis_host,
                "port": self.settings.redis_port,
                "db": self.settings.redis_db,
                "encoding": "utf-8",
                "decode_responses": True,
            }
            if self.settings.redis_password:
                kwargs["password"] = self.settings.redis_password

            self.client = redis.Redis(**kwargs)
            await self.client.ping()
            logger.info("Connected to Redis")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.client = None

    async def close(self) -> None:
        """Close Redis connection."""
        if self.client:
            await self.client.close()
            logger.info("Closed Redis connection")

    def is_connected(self) -> bool:
        """Check if connected to Redis."""
        return self.client is not None

    async def get(self, key: str) -> Optional[str]:
        """Get value from Redis."""
        if not self.client:
            return None
        return await self.client.get(key)

    async def set(self, key: str, value: str, ttl: Optional[int] = None) -> bool:
        """Set value in Redis."""
        if not self.client:
            return False
        return await self.client.set(key, value, ex=ttl)

    async def delete(self, key: str) -> bool:
        """Delete value from Redis."""
        if not self.client:
            return False
        return await self.client.delete(key) > 0


# Singleton instance
_redis_client: Optional[RedisClient] = None


def get_redis_client(settings: Optional[Settings] = None) -> RedisClient:
    """Get singleton Redis client."""
    global _redis_client
    if _redis_client is None:
        if settings is None:
            from ..config import get_settings
            settings = get_settings()
        _redis_client = RedisClient(settings)
    return _redis_client
