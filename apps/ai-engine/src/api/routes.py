"""FastAPI routes for AI Engine."""
import logging
import uuid
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..config import Settings, get_settings
from ..core import RAGEngine
from ..ingestion import GoogleDriveSync, MetadataExtractor, PDFProcessor
from .models import (
    ChatRequest,
    ChatResponse,
    Citation,
    HealthResponse,
    IngestionResponse,
    SuggestionRequest,
    SuggestionResponse,
    SyncFileInfo,
    SyncRequest,
    SyncResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# ===========================================
# Dependency Injection
# ===========================================

# Singleton instance for RAGEngine (avoid reinit on each request)
_rag_engine_instance: RAGEngine | None = None


def get_rag_engine(
    settings: Annotated[Settings, Depends(get_settings)],
) -> RAGEngine:
    """Get RAG engine singleton instance for better performance."""
    global _rag_engine_instance
    if _rag_engine_instance is None:
        logger.info("Creating RAGEngine singleton instance")
        _rag_engine_instance = RAGEngine(settings)
    return _rag_engine_instance


def get_pdf_processor(
    settings: Annotated[Settings, Depends(get_settings)],
) -> PDFProcessor:
    """Get PDF processor instance."""
    return PDFProcessor(settings)


def get_metadata_extractor(
    settings: Annotated[Settings, Depends(get_settings)],
) -> MetadataExtractor:
    """Get metadata extractor instance."""
    return MetadataExtractor(settings)


def get_gdrive_sync(
    settings: Annotated[Settings, Depends(get_settings)],
) -> GoogleDriveSync:
    """Get Google Drive sync instance."""
    return GoogleDriveSync(settings)


# ===========================================
# Chat Endpoints
# ===========================================


@router.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(
    request: ChatRequest,
    rag_engine: Annotated[RAGEngine, Depends(get_rag_engine)],
):
    """
    Chat with the technical knowledge base.

    Send a question and receive an answer with citations from technical documents.
    Supports Vietnamese (vi) and English (en) responses.
    """
    try:
        # Generate conversation ID if not provided
        conversation_id = request.conversation_id or str(uuid.uuid4())

        # Query RAG engine
        result = await rag_engine.query(
            question=request.question,
            language=request.language,
            conversation_history=None,  # TODO: Implement history retrieval
        )

        # Convert citations to response model
        citations = [
            Citation(
                source=c["source"],
                page=str(c["page"]),
                doc_type=c.get("doc_type", "general"),
                content_preview=c["content_preview"],
                relevance_score=c["relevance_score"],
            )
            for c in result["citations"]
        ]

        return ChatResponse(
            answer=result["answer"],
            citations=citations,
            confidence=result["confidence"],
            conversation_id=conversation_id,
            sources_count=result["sources_count"],
        )

    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")


@router.post("/chat/stream", tags=["Chat"])
async def chat_stream(
    request: ChatRequest,
    rag_engine: Annotated[RAGEngine, Depends(get_rag_engine)],
):
    """
    Stream chat responses using Server-Sent Events (SSE).
    
    Returns real-time response chunks for better UX.
    Each chunk is a JSON object with 'type' and 'data' fields:
    - type: 'chunk' | 'done' | 'error'
    - data: The content or metadata
    """
    from fastapi.responses import StreamingResponse
    import json
    import asyncio
    
    async def generate_stream():
        try:
            conversation_id = request.conversation_id or str(uuid.uuid4())

            async for event_type, data in rag_engine.stream_query(
                question=request.question,
                language=request.language,
                conversation_history=None,
            ):
                if event_type == "token":
                    yield f"data: {json.dumps({'type': 'chunk', 'data': data})}\n\n"
                elif event_type == "done":
                    done_data = {**data, 'conversation_id': conversation_id}
                    yield f"data: {json.dumps({'type': 'done', 'data': done_data})}\n\n"

        except Exception as e:
            logger.error(f"Stream error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'data': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        }
    )


@router.post("/chat/suggestions", response_model=SuggestionResponse, tags=["Chat"])
async def chat_suggestions(
    request: SuggestionRequest,
    settings: Annotated[Settings, Depends(get_settings)],
):
    """
    Generate follow-up question suggestions after a chat response.

    Returns 0-3 contextual suggestions. Never raises — returns empty list on failure.
    """
    try:
        from ..core.suggestion_generator import get_suggestion_generator

        generator = get_suggestion_generator(settings)
        suggestions = await generator.generate(
            question=request.question,
            answer=request.answer,
            language=request.language,
        )
        return SuggestionResponse(suggestions=suggestions)
    except Exception as e:
        logger.error(f"Suggestion error: {e}")
        return SuggestionResponse(suggestions=[])


# ===========================================
# Ingestion Endpoints
# ===========================================


@router.post("/ingest", response_model=IngestionResponse, tags=["Ingestion"])
async def ingest_document(
    file: UploadFile = File(..., description="PDF file to ingest"),
    rag_engine: RAGEngine = Depends(get_rag_engine),
    processor: PDFProcessor = Depends(get_pdf_processor),
    extractor: MetadataExtractor = Depends(get_metadata_extractor),
):
    """
    Ingest a PDF document into the knowledge base.

    The document will be:
    1. Parsed using LlamaParse (table-aware)
    2. Chunked into nodes
    3. Embedded and stored in Qdrant
    """
    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported. Please upload a .pdf file.",
        )

    try:
        # Read file content
        file_bytes = await file.read()

        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        # Process PDF
        nodes = await processor.process_bytes(
            file_bytes=file_bytes,
            filename=file.filename,
        )

        if not nodes:
            raise HTTPException(
                status_code=400,
                detail="No content could be extracted from the PDF",
            )

        # Enrich nodes with LLM-extracted metadata (brand, product_type, etc.)
        nodes = await extractor.enrich_nodes(nodes)

        # Add to vector store
        chunks_added = rag_engine.add_documents(nodes)

        # Detect document type from first node
        doc_type = nodes[0].metadata.get("doc_type", "general") if nodes else "general"

        return IngestionResponse(
            success=True,
            document_id=str(uuid.uuid4()),
            filename=file.filename,
            chunks_created=chunks_added,
            doc_type=doc_type,
            message=f"Successfully ingested '{file.filename}' with {chunks_added} chunks",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ingestion error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Document ingestion failed: {str(e)}",
        )


# ===========================================
# Google Drive Sync Endpoints
# ===========================================


@router.post("/gdrive/sync", response_model=SyncResponse, tags=["Google Drive"])
async def sync_google_drive(
    request: SyncRequest = SyncRequest(),
    gdrive: GoogleDriveSync = Depends(get_gdrive_sync),
    processor: PDFProcessor = Depends(get_pdf_processor),
    rag_engine: RAGEngine = Depends(get_rag_engine),
    extractor: MetadataExtractor = Depends(get_metadata_extractor),
):
    """
    Sync documents from configured Google Drive folder.

    Downloads new/modified PDF files and ingests them into the knowledge base.
    """
    if not gdrive.is_configured():
        raise HTTPException(
            status_code=400,
            detail="Google Drive is not configured. Please set GOOGLE_DRIVE_FOLDER_ID and credentials.",
        )

    try:
        # Get file list
        since = None if request.force_full_sync else None  # TODO: Track last sync
        files = await gdrive.list_files(since_timestamp=since)

        response = SyncResponse(
            success=True,
            files_found=len(files),
            files=[],
            message="",
        )

        total_chunks = 0

        for file_info in files:
            file_status = SyncFileInfo(
                id=file_info["id"],
                name=file_info["name"],
                modified_time=file_info.get("modified_time"),
                size=file_info.get("size", 0),
                status="processing",
            )

            try:
                # Download file
                file_bytes, filename = await gdrive.download_file(file_info["id"])

                # Process and ingest
                nodes = await processor.process_bytes(file_bytes, filename)

                if nodes:
                    # Enrich with LLM-extracted metadata
                    nodes = await extractor.enrich_nodes(nodes)
                    rag_engine.add_documents(nodes)
                    file_status.status = "completed"
                    file_status.chunks_created = len(nodes)
                    total_chunks += len(nodes)
                    response.files_processed += 1
                else:
                    file_status.status = "no_content"

            except Exception as e:
                logger.error(f"Failed to sync {file_info['name']}: {e}")
                file_status.status = f"failed: {str(e)}"
                response.files_failed += 1

            response.files.append(file_status)

        response.total_chunks = total_chunks
        response.message = (
            f"Synced {response.files_processed}/{response.files_found} files, "
            f"created {total_chunks} chunks"
        )

        return response

    except Exception as e:
        logger.error(f"Google Drive sync error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Google Drive sync failed: {str(e)}",
        )


@router.get("/gdrive/status", tags=["Google Drive"])
async def gdrive_status(
    gdrive: GoogleDriveSync = Depends(get_gdrive_sync),
):
    """Check Google Drive configuration status."""
    return {
        "configured": gdrive.is_configured(),
        "folder_id": gdrive.folder_id if gdrive.folder_id else None,
    }


# ===========================================
# Health Endpoints
# ===========================================


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check(
    settings: Settings = Depends(get_settings),
):
    """
    Check AI Engine health status.

    Returns service status and connection information.
    """
    try:
        # Check RAG engine
        rag_engine = RAGEngine(settings)
        rag_health = await rag_engine.health_check()

        # Check Google Drive
        gdrive = GoogleDriveSync(settings)

        return HealthResponse(
            status=rag_health.get("status", "unknown"),
            service="ai-engine",
            version="0.1.0",
            qdrant_connected=rag_health.get("qdrant_connected", False),
            collection=rag_health.get("collection"),
            vectors_count=rag_health.get("vectors_count", 0),
            llm_model=rag_health.get("llm_model"),
            embedding_model=rag_health.get("embedding_model"),
            gdrive_configured=gdrive.is_configured(),
        )

    except Exception as e:
        logger.error(f"Health check error: {e}")
        return HealthResponse(
            status="unhealthy",
            service="ai-engine",
        )
