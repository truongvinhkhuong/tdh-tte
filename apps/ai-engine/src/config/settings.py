"""Configuration settings for AI Engine."""
from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ===========================================
    # API Keys
    # ===========================================
    deepseek_api_key: str
    openai_api_key: str
    llama_cloud_api_key: str
    voyageai_api_key: Optional[str] = None  # For Voyage AI embeddings

    # ===========================================
    # Qdrant Cloud
    # ===========================================
    qdrant_url: str
    qdrant_api_key: str
    qdrant_collection: str = "tte_knowledge_base"

    # ===========================================
    # Redis
    # ===========================================
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""
    redis_db: int = 0

    # ===========================================
    # Google Drive (Optional)
    # ===========================================
    google_drive_folder_id: Optional[str] = None
    google_credentials_path: str = "credentials/service-account.json"

    # ===========================================
    # Service Configuration
    # ===========================================
    debug: bool = False
    log_level: str = "INFO"
    cors_origins: list[str] = [
        # Development
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:4001",
        "http://localhost:4002",
        # Production - toanthang.vn and subdomains
        "https://toanthang.vn",
        "https://www.toanthang.vn",
        "https://cms.toanthang.vn",
        "https://api.toanthang.vn",
        "https://admin.toanthang.vn",
    ]

    # ===========================================
    # RAG Configuration
    # ===========================================
    # LLM Settings
    llm_model: str = "deepseek-chat"
    llm_temperature: float = 0.1  # Low for factual responses
    llm_max_tokens: int = 4096

    # Embedding Settings (Voyage AI for 60% cost savings)
    embedding_provider: str = "voyageai"  # 'openai' or 'voyageai'
    embedding_model: str = "voyage-3.5-lite"  # or text-embedding-3-small for OpenAI
    embedding_dimensions: int = 1024  # voyage-3.5-lite default

    # Retrieval Settings
    retrieval_top_k: int = 5  # Keep low for DeepSeek context limits
    rerank_top_n: int = 3  # After reranking

    # Chunking Settings
    chunk_size: int = 1024
    chunk_overlap: int = 200

    @property
    def redis_url(self) -> str:
        """Get Redis connection URL."""
        if self.redis_password:
            return f"redis://:{self.redis_password}@{self.redis_host}:{self.redis_port}/{self.redis_db}"
        return f"redis://{self.redis_host}:{self.redis_port}/{self.redis_db}"


def get_settings() -> Settings:
    """Get settings instance (reloads on each call in debug mode)."""
    return Settings()
