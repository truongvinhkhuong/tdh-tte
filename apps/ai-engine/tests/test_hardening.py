"""Regression tests for production-hardening behavior."""
import inspect

import pytest
from fastapi import HTTPException
from qdrant_client.http.exceptions import ResponseHandlingException

from src.api.models import ChatRequest
from src.api import routes
from src.core.semantic_cache import SemanticCache


class FakeRedis:
    def __init__(self):
        self.calls = []

    async def scan(self, cursor=0, match=None, count=None):
        self.calls.append((cursor, match, count))
        if cursor == 0:
            return 7, ["semantic:cache:a", "semantic:cache:b"]
        return 0, ["semantic:cache:c"]


@pytest.mark.asyncio
async def test_semantic_cache_scans_keys_in_batches():
    cache = SemanticCache()
    redis = FakeRedis()

    batches = [
        batch
        async for batch in cache._scan_redis_keys(redis, "semantic:cache:*", count=2)
    ]

    assert batches == [
        ["semantic:cache:a", "semantic:cache:b"],
        ["semantic:cache:c"],
    ]
    assert redis.calls == [
        (0, "semantic:cache:*", 2),
        (7, "semantic:cache:*", 2),
    ]


def test_chat_request_accepts_conversation_history():
    request = ChatRequest(
        question="What is the pressure rating?",
        language="en",
        conversation_history=[
            {"role": "user", "content": "Tell me about Fisher valves"},
            {"role": "assistant", "content": "Which model are you checking?"},
        ],
    )

    assert request.conversation_history[0]["role"] == "user"
    assert request.conversation_history[1]["content"].startswith("Which model")


def test_health_check_uses_rag_singleton():
    source = inspect.getsource(routes.health_check)

    assert "get_rag_engine(settings)" in source
    assert "RAGEngine(settings)" not in source


def test_rag_singleton_returns_503_when_qdrant_is_unreachable(monkeypatch):
    class BrokenRAGEngine:
        def __init__(self, _settings):
            raise ResponseHandlingException(RuntimeError("qdrant unavailable"))

    monkeypatch.setattr(routes, "_rag_engine_instance", None)
    monkeypatch.setattr(routes, "RAGEngine", BrokenRAGEngine)

    with pytest.raises(HTTPException) as exc_info:
        routes.get_rag_engine(object())

    assert exc_info.value.status_code == 503
    assert "Qdrant is unreachable or misconfigured" in exc_info.value.detail
    assert routes._rag_engine_instance is None
