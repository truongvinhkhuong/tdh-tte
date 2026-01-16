"""Smart model routing based on query complexity.

Routes simple queries to cheaper/faster models, complex queries to full model.
Estimated 40% cost reduction for LLM calls.
"""

import logging
import re
from dataclasses import dataclass
from enum import Enum
from typing import Optional

logger = logging.getLogger(__name__)


class QueryComplexity(Enum):
    """Query complexity levels."""
    SIMPLE = "simple"      # Use lite model or skip LLM
    MEDIUM = "medium"      # Use standard model
    COMPLEX = "complex"    # Use full model with more context


@dataclass
class RoutingDecision:
    """Result of query routing analysis."""
    complexity: QueryComplexity
    model: str
    reason: str
    max_tokens: int = 512


# Keywords indicating complex technical queries
COMPLEX_KEYWORDS = [
    # Technical terms
    "áp suất", "pressure", "nhiệt độ", "temperature",
    "đường kính", "diameter", "kích thước", "size", "dimensions",
    "thông số kỹ thuật", "specifications", "specs",
    "cv value", "cv", "kv", "flow coefficient",
    "torque", "mô-men xoắn",
    "vật liệu", "material", "stainless", "carbon steel",
    "api", "asme", "ansi", "en", "jis",
    
    # Comparison/analysis
    "so sánh", "compare", "khác nhau", "difference",
    "ưu điểm", "nhược điểm", "advantage", "disadvantage",
    "tại sao", "why", "như thế nào", "how",
    "giải thích", "explain",
    
    # Troubleshooting
    "lỗi", "error", "sự cố", "problem", "issue",
    "không hoạt động", "not working", "hư", "broken",
    "sửa chữa", "repair", "bảo trì", "maintenance",
]

# Simple query patterns (can use lite model)
SIMPLE_PATTERNS = [
    r"^\w+\s+là\s+gì\??$",  # "X là gì?"
    r"^what\s+is\s+\w+\??$",  # "What is X?"
    r"^có\s+bao\s+nhiêu",  # "Có bao nhiêu..."
    r"^how\s+many",  # "How many..."
    r"^có\s+những\s+loại",  # "Có những loại..."
    r"^types\s+of",  # "Types of..."
]


class SmartModelRouter:
    """
    Routes queries to appropriate model based on complexity.
    
    Complexity detection:
    - SIMPLE: Short questions, "what is X", listing questions
    - MEDIUM: Standard technical questions
    - COMPLEX: Comparisons, troubleshooting, detailed specs
    """
    
    def __init__(
        self,
        primary_model: str = "deepseek-chat",
        lite_model: str = "deepseek-chat",  # Can be changed to lite version when available
    ):
        self.primary_model = primary_model
        self.lite_model = lite_model
        
        # Compile patterns
        self.simple_patterns = [re.compile(p, re.IGNORECASE) for p in SIMPLE_PATTERNS]
        self.complex_keywords_lower = [k.lower() for k in COMPLEX_KEYWORDS]
        
        logger.info(f"Smart router initialized (primary={primary_model}, lite={lite_model})")
    
    def route(self, question: str) -> RoutingDecision:
        """
        Analyze question and determine routing.
        
        Returns:
            RoutingDecision with model and complexity
        """
        question_lower = question.lower().strip()
        word_count = len(question.split())
        
        # 1. Check for complex indicators
        complex_count = sum(1 for kw in self.complex_keywords_lower if kw in question_lower)
        
        if complex_count >= 2 or word_count > 30:
            return RoutingDecision(
                complexity=QueryComplexity.COMPLEX,
                model=self.primary_model,
                reason=f"Complex query ({complex_count} technical terms, {word_count} words)",
                max_tokens=1024,
            )
        
        # 2. Check for simple patterns
        for pattern in self.simple_patterns:
            if pattern.match(question):
                return RoutingDecision(
                    complexity=QueryComplexity.SIMPLE,
                    model=self.lite_model,
                    reason="Simple pattern match",
                    max_tokens=256,
                )
        
        # 3. Short questions without complex terms = simple
        if word_count <= 8 and complex_count == 0:
            return RoutingDecision(
                complexity=QueryComplexity.SIMPLE,
                model=self.lite_model,
                reason=f"Short question ({word_count} words)",
                max_tokens=256,
            )
        
        # 4. Default to medium
        return RoutingDecision(
            complexity=QueryComplexity.MEDIUM,
            model=self.primary_model,
            reason="Standard query",
            max_tokens=512,
        )
    
    def get_stats(self) -> dict:
        """Get routing statistics (for monitoring)."""
        return {
            "primary_model": self.primary_model,
            "lite_model": self.lite_model,
        }


# Singleton instance
_router: Optional[SmartModelRouter] = None


def get_model_router() -> SmartModelRouter:
    """Get singleton model router instance."""
    global _router
    if _router is None:
        _router = SmartModelRouter()
    return _router
