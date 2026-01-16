"""FAQ Pre-filter to skip LLM calls for common questions.

This module provides static responses for frequently asked questions,
reducing LLM costs by ~50% for common queries.
"""

import logging
import re
from dataclasses import dataclass
from typing import Optional

logger = logging.getLogger(__name__)


@dataclass
class FAQMatch:
    """Result of FAQ matching."""
    question_key: str
    response_vi: str
    response_en: str
    confidence: float = 100.0


# Normalize text for matching
def normalize_text(text: str) -> str:
    """Normalize Vietnamese text for matching (remove diacritics, lowercase)."""
    # Common Vietnamese diacritic mappings
    replacements = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    }
    
    text = text.lower().strip()
    for vn, ascii_char in replacements.items():
        text = text.replace(vn, ascii_char)
    
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text


# FAQ Database - Common questions with static responses
FAQ_DATABASE: dict[str, dict[str, str]] = {
    # Company Info
    "tte la gi": {
        "vi": """**TTE (Toàn Thắng Engineering)** là công ty chuyên cung cấp thiết bị và giải pháp kỹ thuật cho ngành Dầu khí, Năng lượng và Công nghiệp tại Việt Nam.

**Lĩnh vực hoạt động:**
- Van công nghiệp (Fisher, Emerson)
- Thiết bị đo lường & điều khiển
- Bơm công nghiệp
- Giải pháp tự động hóa

📞 Liên hệ: (84-254) 3522219
📧 Email: tts@toanthang.vn
🌐 Website: toanthang.vn""",
        "en": """**TTE (Toan Thang Engineering)** is a company specializing in equipment and technical solutions for Oil & Gas, Energy and Industrial sectors in Vietnam.

**Business areas:**
- Industrial valves (Fisher, Emerson)
- Instrumentation & Control
- Industrial pumps
- Automation solutions

📞 Contact: (84-254) 3522219
📧 Email: tts@toanthang.vn
🌐 Website: toanthang.vn"""
    },
    
    "so dien thoai": {
        "vi": "📞 Số điện thoại TTE: **(84-254) 3522219**\n📧 Email: tts@toanthang.vn",
        "en": "📞 TTE Phone: **(84-254) 3522219**\n📧 Email: tts@toanthang.vn"
    },
    
    "email lien he": {
        "vi": "📧 Email TTE: **tts@toanthang.vn**\n📞 Điện thoại: (84-254) 3522219",
        "en": "📧 TTE Email: **tts@toanthang.vn**\n📞 Phone: (84-254) 3522219"
    },
    
    "dia chi": {
        "vi": """📍 **Địa chỉ TTE:**
Số 68 Ngô Quyền, Phường Thắng Nhất, TP. Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam

📞 Điện thoại: (84-254) 3522219
📧 Email: tts@toanthang.vn""",
        "en": """📍 **TTE Address:**
68 Ngo Quyen Street, Thang Nhat Ward, Vung Tau City, Ba Ria - Vung Tau, Vietnam

📞 Phone: (84-254) 3522219
📧 Email: tts@toanthang.vn"""
    },
    
    # Products
    "san pham tte": {
        "vi": """**Danh mục sản phẩm TTE:**

| Danh mục | Thương hiệu |
|----------|-------------|
| Van điều khiển | Fisher, Emerson |
| Van cầu, van bướm | Fisher |
| Thiết bị đo lường | Emerson, Rosemount |
| Bơm công nghiệp | Flowserve, Sulzer |
| Van an toàn | Crosby, Anderson Greenwood |

📞 Liên hệ tư vấn: (84-254) 3522219""",
        "en": """**TTE Product Categories:**

| Category | Brands |
|----------|--------|
| Control Valves | Fisher, Emerson |
| Globe/Butterfly Valves | Fisher |
| Instrumentation | Emerson, Rosemount |
| Industrial Pumps | Flowserve, Sulzer |
| Safety Valves | Crosby, Anderson Greenwood |

📞 Contact for consultation: (84-254) 3522219"""
    },
    
    "fisher la gi": {
        "vi": """**Fisher** là thương hiệu van điều khiển hàng đầu thế giới, thuộc tập đoàn Emerson.

**Các dòng sản phẩm Fisher phổ biến:**
- Van điều khiển (Control Valves)
- Van cầu (Globe Valves) 
- Van bướm (Butterfly Valves)
- Actuators & Positioners

TTE là đại lý chính thức của Fisher tại Việt Nam.
📞 Liên hệ: (84-254) 3522219""",
        "en": """**Fisher** is a world-leading control valve brand, part of Emerson corporation.

**Popular Fisher product lines:**
- Control Valves
- Globe Valves
- Butterfly Valves
- Actuators & Positioners

TTE is an authorized Fisher distributor in Vietnam.
📞 Contact: (84-254) 3522219"""
    },
    
    "gio lam viec": {
        "vi": """⏰ **Giờ làm việc TTE:**
- Thứ 2 - Thứ 6: 8:00 - 17:00
- Thứ 7: 8:00 - 12:00
- Chủ nhật: Nghỉ

📞 Hotline 24/7: (84-254) 3522219""",
        "en": """⏰ **TTE Working Hours:**
- Monday - Friday: 8:00 AM - 5:00 PM
- Saturday: 8:00 AM - 12:00 PM
- Sunday: Closed

📞 24/7 Hotline: (84-254) 3522219"""
    },
}

# Keyword patterns for fuzzy matching
KEYWORD_PATTERNS: dict[str, list[str]] = {
    "tte la gi": ["tte", "toan thang", "cong ty", "gioi thieu"],
    "so dien thoai": ["dien thoai", "phone", "goi", "hotline", "sdt"],
    "email lien he": ["email", "mail", "lien he"],
    "dia chi": ["dia chi", "o dau", "van phong", "address", "location"],
    "san pham tte": ["san pham", "danh muc", "ban gi", "products", "catalog"],
    "fisher la gi": ["fisher", "emerson"],
    "gio lam viec": ["gio", "lam viec", "mo cua", "working hours", "open"],
}


class FAQPreFilter:
    """FAQ pre-filter to skip LLM calls for common questions."""
    
    def __init__(self):
        self.faq_database = FAQ_DATABASE
        self.keyword_patterns = KEYWORD_PATTERNS
        logger.info(f"FAQ Pre-filter initialized with {len(self.faq_database)} entries")
    
    def check(self, question: str, language: str = "vi") -> Optional[FAQMatch]:
        """
        Check if question matches any FAQ entry.
        
        Args:
            question: User's question
            language: Response language ('vi' or 'en')
            
        Returns:
            FAQMatch if found, None otherwise
        """
        normalized = normalize_text(question)
        
        # 1. Exact match check
        for faq_key in self.faq_database:
            if faq_key in normalized:
                logger.info(f"FAQ exact match: '{question}' -> '{faq_key}'")
                return self._create_match(faq_key, language)
        
        # 2. Keyword pattern matching
        for faq_key, patterns in self.keyword_patterns.items():
            match_count = sum(1 for p in patterns if p in normalized)
            if match_count >= 2 or (match_count == 1 and len(normalized.split()) <= 5):
                logger.info(f"FAQ keyword match: '{question}' -> '{faq_key}' (patterns: {match_count})")
                return self._create_match(faq_key, language)
        
        logger.debug(f"No FAQ match for: '{question}'")
        return None
    
    def _create_match(self, faq_key: str, language: str) -> FAQMatch:
        """Create FAQMatch from database entry."""
        entry = self.faq_database[faq_key]
        return FAQMatch(
            question_key=faq_key,
            response_vi=entry["vi"],
            response_en=entry["en"],
        )
    
    def get_response(self, match: FAQMatch, language: str = "vi") -> dict:
        """Convert FAQ match to response format matching RAG engine output."""
        response_text = match.response_vi if language == "vi" else match.response_en
        
        return {
            "answer": response_text,
            "citations": [],
            "confidence": match.confidence,
            "sources_count": 0,
            "is_faq": True,  # Flag to indicate FAQ response
        }


# Singleton instance
_faq_filter: Optional[FAQPreFilter] = None


def get_faq_filter() -> FAQPreFilter:
    """Get singleton FAQ filter instance."""
    global _faq_filter
    if _faq_filter is None:
        _faq_filter = FAQPreFilter()
    return _faq_filter
