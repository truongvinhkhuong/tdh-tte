"""Smart Suggestions Generator for follow-up questions."""
import hashlib
import json
import logging
import re
from typing import Optional

from llama_index.llms.openai_like import OpenAILike

from ..config import Settings, get_settings
from .redis_client import get_redis_client

logger = logging.getLogger(__name__)

# Fallback markers from rag_engine._get_fallback_response()
FALLBACK_MARKERS = {
    "vi": ["xin lỗi, tôi chưa tìm thấy thông tin này"],
    "en": ["i apologize, i couldn't find this information"],
}

PROMPTS = {
    "vi": """Bạn là trợ lý AI của TTE (Toàn Thắng Engineering), chuyên thiết bị công nghiệp dầu khí/năng lượng.

Dựa trên câu hỏi và câu trả lời bên dưới, gợi ý 3 câu hỏi tiếp theo mà khách hàng có thể quan tâm.

QUY TẮC:
1. Liên quan đến chủ đề đã trả lời
2. Ngắn gọn (dưới 60 ký tự)
3. Đa dạng: 1 câu đi sâu hơn, 1 câu so sánh/mở rộng, 1 câu ứng dụng thực tế
4. Trả về JSON array duy nhất, KHÔNG có text khác

VÍ DỤ:
Câu hỏi: "Van Fisher GX có thông số áp suất bao nhiêu?"
Trả lời: "Van Fisher GX có áp suất làm việc tối đa 4150 PSI..."
→ ["Fisher GX phù hợp ứng dụng nào?", "So sánh Fisher GX với DVC6200?", "Cách bảo trì van Fisher GX?"]

Câu hỏi: "{question}"
Trả lời: "{answer}"
→""",
    "en": """You are an AI assistant for TTE (Toan Thang Engineering), specializing in industrial Oil & Gas/Energy equipment.

Based on the question and answer below, suggest 3 follow-up questions the customer might be interested in.

RULES:
1. Related to the answered topic
2. Concise (under 60 characters each)
3. Diverse: 1 deeper question, 1 comparison/expansion, 1 practical application
4. Return ONLY a JSON array, NO other text

EXAMPLE:
Question: "What is the pressure rating of Fisher GX valve?"
Answer: "Fisher GX valve has a maximum working pressure of 4150 PSI..."
→ ["What applications suit Fisher GX?", "Compare Fisher GX vs DVC6200?", "Fisher GX maintenance guide?"]

Question: "{question}"
Answer: "{answer}"
→""",
}

CACHE_PREFIX = "suggestions:"


class SuggestionGenerator:
    """Generates follow-up question suggestions after a chat response."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self._llm: Optional[OpenAILike] = None

    def _get_llm(self) -> OpenAILike:
        """Lazy-init a lightweight DeepSeek LLM for suggestion generation."""
        if self._llm is None:
            self._llm = OpenAILike(
                model=self.settings.llm_model,
                api_base="https://api.deepseek.com/v1",
                api_key=self.settings.deepseek_api_key,
                temperature=self.settings.suggestions_temperature,
                max_tokens=self.settings.suggestions_max_tokens,
                is_chat_model=True,
            )
            logger.info("Suggestion LLM initialized")
        return self._llm

    def _is_fallback_answer(self, answer: str, language: str) -> bool:
        """Detect fallback responses that should not trigger suggestions."""
        markers = FALLBACK_MARKERS.get(language, FALLBACK_MARKERS["vi"])
        answer_lower = answer.lower()
        return any(marker in answer_lower for marker in markers)

    def _get_cache_key(self, question: str, language: str) -> str:
        """Generate cache key from normalized question + language."""
        normalized = question.strip().lower()
        raw = f"{normalized}:{language}"
        return f"{CACHE_PREFIX}{hashlib.md5(raw.encode()).hexdigest()}"

    def _build_prompt(self, question: str, answer: str, language: str) -> str:
        """Build few-shot prompt for suggestion generation."""
        template = PROMPTS.get(language, PROMPTS["vi"])
        truncated_answer = answer[:500]
        return template.format(question=question, answer=truncated_answer)

    def _parse_suggestions(self, text: str, question: str) -> list[str]:
        """Parse LLM output into a list of suggestion strings."""
        # Try JSON parse first
        try:
            parsed = json.loads(text.strip())
            if isinstance(parsed, list):
                return self._validate(parsed, question)
        except json.JSONDecodeError:
            pass

        # Regex fallback: find JSON array in text
        match = re.search(r'\[.*?\]', text, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group())
                if isinstance(parsed, list):
                    return self._validate(parsed, question)
            except json.JSONDecodeError:
                pass

        return []

    def _validate(self, suggestions: list, question: str) -> list[str]:
        """Validate and filter suggestions."""
        result = []
        question_lower = question.strip().lower()
        for s in suggestions:
            if not isinstance(s, str) or not s.strip():
                continue
            s = s.strip()
            # Skip if identical to original question
            if s.lower() == question_lower:
                continue
            # Skip if too long
            if len(s) > 80:
                continue
            result.append(s)
            if len(result) >= 3:
                break
        return result

    async def generate(
        self,
        question: str,
        answer: str,
        language: str = "vi",
    ) -> list[str]:
        """
        Generate follow-up suggestions.

        Returns 0-3 suggestion strings. Never raises — returns [] on any failure.
        """
        if not self.settings.suggestions_enabled:
            return []

        # Skip fallback answers
        if self._is_fallback_answer(answer, language):
            return []

        # Check cache
        cache_key = self._get_cache_key(question, language)
        try:
            redis = get_redis_client()
            cached = await redis.get(cache_key)
            if cached:
                logger.debug(f"Suggestions cache hit: {cache_key}")
                return json.loads(cached)
        except Exception:
            pass  # Redis unavailable, continue without cache

        # Generate via LLM
        try:
            llm = self._get_llm()
            prompt = self._build_prompt(question, answer, language)
            response = await llm.acomplete(prompt)
            suggestions = self._parse_suggestions(response.text, question)

            if not suggestions:
                logger.warning("Failed to parse suggestions from LLM output")
                return []

            # Cache result
            try:
                redis = get_redis_client()
                await redis.set(
                    cache_key,
                    json.dumps(suggestions, ensure_ascii=False),
                    ttl=self.settings.suggestions_cache_ttl,
                )
            except Exception:
                pass  # Cache write failure is non-critical

            logger.info(f"Generated {len(suggestions)} suggestions for: {question[:50]}...")
            return suggestions

        except Exception as e:
            logger.error(f"Suggestion generation failed: {e}")
            return []


# Singleton
_suggestion_generator: Optional[SuggestionGenerator] = None


def get_suggestion_generator(settings: Optional[Settings] = None) -> SuggestionGenerator:
    """Get singleton SuggestionGenerator instance."""
    global _suggestion_generator
    if _suggestion_generator is None:
        if settings is None:
            settings = get_settings()
        _suggestion_generator = SuggestionGenerator(settings)
    return _suggestion_generator
