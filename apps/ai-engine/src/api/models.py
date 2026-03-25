"""API request/response models."""
from typing import Optional

from pydantic import BaseModel, Field


# ===========================================
# Chat Models
# ===========================================


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""

    question: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User's question about technical documents",
    )
    conversation_id: Optional[str] = Field(
        None,
        description="Optional conversation ID for context continuity",
    )
    language: str = Field(
        default="vi",
        pattern="^(vi|en)$",
        description="Response language: 'vi' for Vietnamese, 'en' for English",
    )


class Citation(BaseModel):
    """Citation information from source documents."""

    source: str = Field(..., description="Source document name")
    page: str = Field(..., description="Page number or 'N/A'")
    doc_type: str = Field(default="general", description="Document type")
    content_preview: str = Field(..., description="Preview of relevant content")
    relevance_score: float = Field(..., ge=0, le=1, description="Relevance score")


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""

    answer: str = Field(..., description="Generated answer")
    citations: list[Citation] = Field(
        default_factory=list,
        description="Source citations",
    )
    confidence: float = Field(
        ...,
        ge=0,
        le=100,
        description="Confidence score (0-100)",
    )
    conversation_id: str = Field(..., description="Conversation ID")
    sources_count: int = Field(default=0, description="Number of source documents used")


# ===========================================
# Suggestion Models
# ===========================================


class SuggestionRequest(BaseModel):
    """Request model for follow-up suggestions endpoint."""

    question: str = Field(..., min_length=1, max_length=2000)
    answer: str = Field(..., min_length=1, max_length=5000)
    language: str = Field(default="vi", pattern="^(vi|en)$")


class SuggestionResponse(BaseModel):
    """Response model for follow-up suggestions endpoint."""

    suggestions: list[str] = Field(default_factory=list)


# ===========================================
# Ingestion Models
# ===========================================


class IngestionRequest(BaseModel):
    """Request model for document ingestion."""

    source: str = Field(
        default="upload",
        description="Ingestion source: 'upload', 'gdrive', 'url'",
    )
    metadata: Optional[dict] = Field(
        None,
        description="Additional metadata to attach to documents",
    )


class IngestionResponse(BaseModel):
    """Response model for document ingestion."""

    success: bool = Field(..., description="Whether ingestion was successful")
    document_id: str = Field(..., description="Identifier for the ingested document")
    filename: str = Field(..., description="Original filename")
    chunks_created: int = Field(..., description="Number of chunks created")
    doc_type: str = Field(default="general", description="Detected document type")
    message: str = Field(..., description="Status message")


# ===========================================
# Sync Models
# ===========================================


class SyncRequest(BaseModel):
    """Request model for Google Drive sync."""

    force_full_sync: bool = Field(
        default=False,
        description="Force full sync regardless of timestamps",
    )


class SyncFileInfo(BaseModel):
    """Information about a synced file."""

    id: str
    name: str
    modified_time: Optional[str] = None
    size: int = 0
    status: str = Field(default="pending", description="Processing status")
    chunks_created: int = 0


class SyncResponse(BaseModel):
    """Response model for sync operation."""

    success: bool
    files_found: int = 0
    files_processed: int = 0
    files_failed: int = 0
    total_chunks: int = 0
    files: list[SyncFileInfo] = Field(default_factory=list)
    message: str = ""


# ===========================================
# Health Models
# ===========================================


class HealthResponse(BaseModel):
    """Response model for health check."""

    status: str = Field(..., description="Service status")
    service: str = Field(default="ai-engine", description="Service name")
    version: str = Field(default="0.1.0", description="Service version")
    qdrant_connected: bool = Field(default=False)
    collection: Optional[str] = None
    vectors_count: int = 0
    llm_model: Optional[str] = None
    embedding_model: Optional[str] = None
    gdrive_configured: bool = Field(default=False)
