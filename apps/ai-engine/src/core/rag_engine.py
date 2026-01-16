"""Core RAG Engine for technical document Q&A."""
import logging
from typing import Any, Optional

from llama_index.core import Settings as LlamaSettings
from llama_index.core import VectorStoreIndex
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.schema import NodeWithScore
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai_like import OpenAILike
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient, models

from ..config import Settings

logger = logging.getLogger(__name__)


class RAGEngine:
    """
    RAG Engine optimized for Oil & Gas technical documentation.

    Features:
    - DeepSeek LLM via OpenAI-compatible API
    - OpenAI embeddings (text-embedding-3-small)
    - Qdrant Cloud vector store
    - Bilingual support (EN/VI)
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self._setup_llm()
        self._setup_vector_store()
        self._query_engine: Optional[RetrieverQueryEngine] = None
        logger.info("RAG Engine initialized successfully")

    def _setup_llm(self) -> None:
        """Configure LLM and embedding models."""
        # DeepSeek via OpenAI-compatible API
        LlamaSettings.llm = OpenAILike(
            model=self.settings.llm_model,
            api_base="https://api.deepseek.com/v1",
            api_key=self.settings.deepseek_api_key,
            temperature=self.settings.llm_temperature,
            max_tokens=self.settings.llm_max_tokens,
            is_chat_model=True,
            context_window=32000,  # DeepSeek supports 64k, use 32k for safety
        )

        # Set global context window
        LlamaSettings.context_window = 32000
        LlamaSettings.num_output = self.settings.llm_max_tokens

        # OpenAI embedding (best price/performance)
        LlamaSettings.embed_model = OpenAIEmbedding(
            model=self.settings.embedding_model,
            api_key=self.settings.openai_api_key,
            dimensions=self.settings.embedding_dimensions,
        )

        logger.info(f"LLM configured: {self.settings.llm_model}")
        logger.info(f"Embedding configured: {self.settings.embedding_model}")

    def _setup_vector_store(self) -> None:
        """Initialize Qdrant vector store connection."""
        from qdrant_client import AsyncQdrantClient

        # Sync client for collection management
        self.qdrant_client = QdrantClient(
            url=self.settings.qdrant_url,
            api_key=self.settings.qdrant_api_key,
        )

        # Async client for query operations
        self.async_qdrant_client = AsyncQdrantClient(
            url=self.settings.qdrant_url,
            api_key=self.settings.qdrant_api_key,
        )

        # Ensure collection exists
        self._ensure_collection()

        self.vector_store = QdrantVectorStore(
            client=self.qdrant_client,
            aclient=self.async_qdrant_client,
            collection_name=self.settings.qdrant_collection,
        )

        # Create index from existing vector store
        self.index = VectorStoreIndex.from_vector_store(
            vector_store=self.vector_store,
        )

        logger.info(f"Connected to Qdrant collection: {self.settings.qdrant_collection}")

    def _ensure_collection(self) -> None:
        """Create Qdrant collection if it doesn't exist."""
        collections = self.qdrant_client.get_collections().collections
        collection_names = [c.name for c in collections]

        if self.settings.qdrant_collection not in collection_names:
            self.qdrant_client.create_collection(
                collection_name=self.settings.qdrant_collection,
                vectors_config=models.VectorParams(
                    size=self.settings.embedding_dimensions,
                    distance=models.Distance.COSINE,
                ),
            )
            logger.info(f"Created new collection: {self.settings.qdrant_collection}")

    def _get_query_engine(self) -> RetrieverQueryEngine:
        """Get query engine with current configuration."""
        # Create fresh query engine each time (no caching issues)
        retriever = VectorIndexRetriever(
            index=self.index,
            similarity_top_k=self.settings.retrieval_top_k,
        )

        # Lower similarity threshold to get more results
        similarity_filter = SimilarityPostprocessor(
            similarity_cutoff=0.3,  # Lowered from 0.5
        )

        return RetrieverQueryEngine(
            retriever=retriever,
            node_postprocessors=[similarity_filter],
        )

    async def query(
        self,
        question: str,
        language: str = "vi",
        conversation_history: Optional[list[dict]] = None,
    ) -> dict[str, Any]:
        """
        Query the knowledge base with citation support.

        Args:
            question: User's question
            language: Response language ('vi' or 'en')
            conversation_history: Optional conversation context

        Returns:
            Dictionary with answer, citations, and confidence score
        """
        # Build context-aware prompt
        prompt = self._build_prompt(question, language, conversation_history)

        # Execute query
        query_engine = self._get_query_engine()
        response = await query_engine.aquery(prompt)

        # Extract citations from source nodes
        citations = self._extract_citations(response.source_nodes)

        # Calculate confidence based on source relevance
        confidence = self._calculate_confidence(response.source_nodes)

        return {
            "answer": str(response),
            "citations": citations,
            "confidence": confidence,
            "sources_count": len(response.source_nodes),
        }

    def _build_prompt(
        self,
        question: str,
        language: str,
        history: Optional[list[dict]] = None,
    ) -> str:
        """Build concise system prompt for technical Q&A."""
        prompts = {
            "vi": """Bạn là Kỹ sư Tư vấn Kỹ thuật của TTE (Toàn Thắng Engineering).

QUY TẮC:
1. CHỈ trả lời dựa trên context bên dưới
2. Nếu không có thông tin trong context → Trả lời: "Xin lỗi, tôi chưa tìm thấy thông tin này trong tài liệu kỹ thuật hiện có. Để được hỗ trợ nhanh nhất, vui lòng liên hệ:

📞 Điện thoại: (84-254) 3522219
📧 Email: tts@toanthang.vn

Đội ngũ kỹ thuật TTE sẽ phản hồi trong thời gian sớm nhất!"
3. Trả lời TỰ NHIÊN, chuyên nghiệp như một kỹ sư tư vấn.
4. KHÔNG được nhắc đến tên file, số trang hay nguồn tài liệu trong câu trả lời.
5. Dùng Markdown table cho thông số kỹ thuật.
6. Giữ nguyên đơn vị kỹ thuật (PSI, bar, mm).""",

            "en": """You are a Technical Engineer Consultant for TTE (Toan Thang Engineering).

RULES:
1. ONLY answer based on context below
2. If information is not found → Reply: "I apologize, I couldn't find this information in our current technical documents. For the fastest support, please contact us:

📞 Phone: (84-254) 3522219
📧 Email: tts@toanthang.vn

Our TTE technical team will respond as soon as possible!"
3. Answer NATURALLY and professionally.
4. Do NOT mention filenames, page numbers, or sources in your response.
5. Use Markdown table for specs.
6. Keep original units (PSI, bar, mm).""",
        }

        system_prompt = prompts.get(language, prompts["vi"])

        # Add conversation history if available (last 3 only)
        context = ""
        if history:
            context = "\n\nLịch sử:\n"
            for msg in history[-3:]:
                role = "U" if msg.get("role") == "user" else "A"
                context += f"{role}: {msg.get('content', '')[:100]}\n"

        return f"{system_prompt}{context}\n\nCâu hỏi: {question}"

    def _extract_citations(self, source_nodes: list[NodeWithScore]) -> list[dict]:
        """Extract citation information from source nodes."""
        citations = []
        seen_sources = set()

        for node in source_nodes:
            metadata = node.node.metadata or {}
            source_key = f"{metadata.get('file_name', 'Unknown')}_{metadata.get('page_number', 'N/A')}"

            if source_key not in seen_sources:
                seen_sources.add(source_key)
                citations.append({
                    "source": metadata.get("file_name", "Unknown"),
                    "page": metadata.get("page_number", "N/A"),
                    "doc_type": metadata.get("doc_type", "general"),
                    "content_preview": node.node.text[:300] + "..." if len(node.node.text) > 300 else node.node.text,
                    "relevance_score": round(node.score or 0, 3),
                })

        return citations

    def _calculate_confidence(self, source_nodes: list[NodeWithScore]) -> float:
        """Calculate confidence score based on source relevance."""
        if not source_nodes:
            return 0.0

        scores = [n.score for n in source_nodes if n.score is not None]
        if not scores:
            return 0.0

        # Weighted average (higher weight for top results)
        weights = [1.0 / (i + 1) for i in range(len(scores))]
        weighted_sum = sum(s * w for s, w in zip(scores, weights))
        weight_total = sum(weights)

        avg_score = weighted_sum / weight_total
        # Convert to percentage (0-100), cap at 95%
        return min(round(avg_score * 100, 1), 95.0)

    def add_documents(self, nodes: list) -> int:
        """Add document nodes to the index."""
        self.index.insert_nodes(nodes)
        self._query_engine = None  # Reset query engine
        return len(nodes)

    async def health_check(self) -> dict:
        """Check RAG engine health status."""
        try:
            # Check Qdrant connection
            collection_info = self.qdrant_client.get_collection(
                self.settings.qdrant_collection
            )

            return {
                "status": "healthy",
                "qdrant_connected": True,
                "collection": self.settings.qdrant_collection,
                "vectors_count": collection_info.points_count,
                "llm_model": self.settings.llm_model,
                "embedding_model": self.settings.embedding_model,
            }
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
            }
