"""FastAPI application entry point for TTE AI Engine."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import router
from .config import get_settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    settings = get_settings()
    logger.info("=" * 50)
    logger.info("TTE AI Engine starting...")
    
    # Initialize Redis
    from .core.redis_client import get_redis_client
    redis = get_redis_client(settings)
    await redis.connect()
    
    # Initialize Semantic Cache with persistence
    from .core.semantic_cache import get_semantic_cache
    semantic_cache = get_semantic_cache()
    if redis.is_connected():
        await semantic_cache.load_from_redis()
    
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"LLM Model: {settings.llm_model}")
    logger.info(f"Embedding Model: {settings.embedding_model}")
    logger.info(f"Qdrant Collection: {settings.qdrant_collection}")
    logger.info(f"Google Drive configured: {bool(settings.google_drive_folder_id)}")
    logger.info("=" * 50)

    yield

    # Shutdown
    logger.info("TTE AI Engine shutting down...")
    await redis.close()


# Create FastAPI application
app = FastAPI(
    title="TTE AI Engine",
    description="""
    RAG-powered AI Engine for Technical Consulting.

    ## Features
    - 🔍 **Technical Q&A**: Query knowledge base about Oil & Gas equipment
    - 📄 **PDF Ingestion**: Upload and process technical documents
    - 📁 **Google Drive Sync**: Auto-sync from configured folder
    - 🌐 **Bilingual**: Vietnamese and English support

    ## Usage
    1. Upload PDF documents via `/api/ingest`
    2. Or sync from Google Drive via `/api/gdrive/sync`
    3. Ask questions via `/api/chat`
    """,
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Get settings for CORS
settings = get_settings()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "service": "TTE AI Engine",
        "version": "0.1.0",
        "description": "RAG-powered Technical Consulting AI",
        "docs": "/docs",
        "health": "/api/health",
    }


# Simple health check at root level
@app.get("/health", tags=["Health"])
async def health():
    """Simple health check endpoint."""
    return {"status": "ok", "service": "ai-engine"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=4003,
        reload=settings.debug,
    )
