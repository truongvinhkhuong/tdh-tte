"""Core RAG Engine for technical document Q&A."""
import logging
from typing import Any, Optional

from llama_index.core import Settings as LlamaSettings
from llama_index.core import VectorStoreIndex
from llama_index.core.postprocessor import SimilarityPostprocessor
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
        self._reranker = None  # Lazy-loaded cross-encoder reranker
        self._keyword_retriever = None  # Lazy-loaded keyword retriever
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

        # Configure embedding model based on provider
        if self.settings.embedding_provider == "voyageai" and self.settings.voyageai_api_key:
            # Voyage AI embedding (60% cheaper than OpenAI)
            from llama_index.embeddings.voyageai import VoyageEmbedding
            
            LlamaSettings.embed_model = VoyageEmbedding(
                model_name=self.settings.embedding_model,
                voyage_api_key=self.settings.voyageai_api_key,
            )
            logger.info(f"Embedding configured: Voyage AI {self.settings.embedding_model}")
        else:
            # Fallback to OpenAI embedding
            LlamaSettings.embed_model = OpenAIEmbedding(
                model=self.settings.embedding_model if "voyage" not in self.settings.embedding_model else "text-embedding-3-small",
                api_key=self.settings.openai_api_key,
                dimensions=self.settings.embedding_dimensions,
            )
            logger.info(f"Embedding configured: OpenAI {self.settings.embedding_model}")

        logger.info(f"LLM configured: {self.settings.llm_model}")

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

        # Ensure text payload index exists for keyword search (hybrid retrieval)
        if self.settings.hybrid_search_enabled:
            self._ensure_text_index()

    def _ensure_text_index(self) -> None:
        """Create text payload index for keyword search if not exists."""
        try:
            self.qdrant_client.create_payload_index(
                collection_name=self.settings.qdrant_collection,
                field_name="_node_content",
                field_schema=models.TextIndexParams(
                    type="text",
                    tokenizer=models.TokenizerType.WORD,
                    min_token_len=2,
                    max_token_len=30,
                ),
            )
            logger.info("Created text payload index for keyword search")
        except Exception:
            # Index already exists or collection is empty — safe to ignore
            pass

    def _get_retriever(self) -> VectorIndexRetriever:
        """Get vector retriever with current configuration."""
        return VectorIndexRetriever(
            index=self.index,
            similarity_top_k=self.settings.retrieval_top_k,
        )

    def _get_reranker(self):
        """Lazy-load cross-encoder reranker model (first call downloads ~80MB model)."""
        if self._reranker is None and self.settings.rerank_enabled:
            try:
                from llama_index.postprocessor.sbert_rerank import (
                    SentenceTransformerRerank,
                )

                self._reranker = SentenceTransformerRerank(
                    model=self.settings.rerank_model,
                    top_n=self.settings.rerank_top_n,
                )
                logger.info(f"Reranker loaded: {self.settings.rerank_model}")
            except ImportError:
                logger.warning(
                    "sbert-rerank not installed, skipping reranking. "
                    "Install: pip install llama-index-postprocessor-sbert-rerank"
                )
            except Exception as e:
                logger.warning(f"Failed to load reranker: {e}")
        return self._reranker

    def _get_keyword_retriever(self):
        """Lazy-load keyword retriever for hybrid search."""
        if self._keyword_retriever is None and self.settings.hybrid_search_enabled:
            try:
                from ..retrieval.keyword_retriever import QdrantKeywordRetriever

                self._keyword_retriever = QdrantKeywordRetriever(
                    client=self.async_qdrant_client,
                    collection_name=self.settings.qdrant_collection,
                )
                logger.info("Keyword retriever initialized for hybrid search")
            except Exception as e:
                logger.warning(f"Failed to init keyword retriever: {e}")
        return self._keyword_retriever

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
        # PHASE 1 OPTIMIZATION: FAQ Pre-filter
        # Check FAQ first to skip LLM calls for common questions
        from .faq_filter import get_faq_filter
        
        faq_filter = get_faq_filter()
        faq_match = faq_filter.check(question, language)
        
        if faq_match:
            logger.info(f"FAQ match found: '{faq_match.question_key}' - skipping LLM")
            return faq_filter.get_response(faq_match, language)
        
        # PHASE 2 OPTIMIZATION: Semantic cache
        # Check if semantically similar question was answered before
        from .semantic_cache import get_semantic_cache
        
        semantic_cache = get_semantic_cache()
        
        # Initialize cache with embedding model if needed
        if not semantic_cache.embed_model:
            semantic_cache.set_embed_model(LlamaSettings.embed_model)
        
        cached_response = semantic_cache.get(question, language)
        if cached_response:
            logger.info(f"Semantic cache HIT - skipping LLM")
            cached_response["from_cache"] = True
            return cached_response
        
        # PHASE 3 OPTIMIZATION: Smart Model Routing
        # Adjust max_tokens based on query complexity to reduce costs
        from .model_router import get_model_router
        
        model_router = get_model_router()
        routing = model_router.route(question)
        
        logger.info(
            f"Query routed: complexity={routing.complexity.value}, "
            f"max_tokens={routing.max_tokens}, reason={routing.reason}"
        )
        
        # Configure LLM based on routing (Thread-safe approach)
        custom_llm = None
        if routing.max_tokens != self.settings.llm_max_tokens:
            custom_llm = OpenAILike(
                model=self.settings.llm_model,
                api_base="https://api.deepseek.com/v1",
                api_key=self.settings.deepseek_api_key,
                temperature=self.settings.llm_temperature,
                max_tokens=routing.max_tokens,
                is_chat_model=True,
                context_window=32000,
            )

        try:
            # 1. RETRIEVAL STEP
            logger.info(f"Retrieving for question: '{question}'")

            # Vector search
            retriever = self._get_retriever()
            source_nodes = await retriever.aretrieve(question)
            logger.info(f"Vector search returned {len(source_nodes)} nodes")

            # Apply similarity cutoff to vector results BEFORE fusion
            # (cosine scores are 0-1 scale, cutoff 0.3 is appropriate here)
            similarity_filter = SimilarityPostprocessor(similarity_cutoff=0.3)
            source_nodes = similarity_filter.postprocess_nodes(
                source_nodes, query_str=question
            )
            logger.info(f"After similarity filter: {len(source_nodes)} nodes")

            # Preserve original cosine scores for confidence calculation
            original_scores = {n.node.node_id: n.score for n in source_nodes}

            # Hybrid search: merge keyword results if enabled
            keyword_retriever = self._get_keyword_retriever()
            if keyword_retriever:
                try:
                    from ..retrieval.keyword_retriever import fuse_results

                    keyword_nodes = await keyword_retriever.retrieve(
                        question, top_k=self.settings.retrieval_top_k
                    )
                    logger.info(f"Keyword search returned {len(keyword_nodes)} nodes")
                    source_nodes = fuse_results(
                        source_nodes,
                        keyword_nodes,
                        vector_weight=self.settings.hybrid_vector_weight,
                        top_k=self.settings.retrieval_top_k,
                    )
                    logger.info(f"Fused to {len(source_nodes)} nodes")
                except Exception as e:
                    logger.warning(f"Keyword search failed, using vector only: {e}")

            # Reranker (if enabled) — filters to top_n best results
            reranker = self._get_reranker()
            if reranker and source_nodes:
                pre_rerank_count = len(source_nodes)
                source_nodes = reranker.postprocess_nodes(
                    source_nodes, query_str=question
                )
                logger.info(
                    f"Reranked {pre_rerank_count} nodes → {len(source_nodes)} top results"
                )

            # Restore original cosine scores for confidence calculation
            # (reranker/fusion scores are on different scales)
            for node in source_nodes:
                if node.node.node_id in original_scores:
                    node.score = original_scores[node.node.node_id]

            logger.info(f"Final {len(source_nodes)} nodes after postprocessing")
            if source_nodes:
                logger.info(f"Top score: {source_nodes[0].score}")

            # Build context from original_text (without prepended contextual info)
            context_parts = []
            for n in source_nodes:
                text = n.node.metadata.get("original_text", n.node.text)
                context_parts.append(text)
            context_str = "\n\n".join(context_parts) if context_parts else ""
            
            # 2. GENERATION STEP
            # Build context-aware prompt with retrieved information
            prompt = self._build_prompt_with_context(question, context_str, language, conversation_history)
            
            # Use custom LLM if routed, else default
            llm = custom_llm if custom_llm else LlamaSettings.llm
            
            # Generate response
            response_text = await llm.acomplete(prompt)
            
            # Mock response object to maintain compatibility with existing logic
            class RAGResponse:
                def __init__(self, text, nodes):
                    self.text = str(text)
                    self.source_nodes = nodes
                def __str__(self):
                    return self.text
            
            response = RAGResponse(response_text, source_nodes)

        except Exception as primary_error:
            logger.warning(f"Primary LLM/Retrieval failed: {primary_error}")
            import traceback
            logger.error(traceback.format_exc())
            
            # Try OpenAI fallback
            try:
                # For fallback, we just do a direct query without RAG if RAG failed,
                # or we could try RAG again with fallback LLM via similar manual steps.
                # Here we stick to the simple completion fallback for robustness.
                response = await self._query_with_fallback_llm(self._build_prompt(question, language, conversation_history))
                logger.info("Fallback LLM (OpenAI) succeeded")
            except Exception as fallback_error:
                logger.error(f"Fallback LLM also failed: {fallback_error}")
                return self._get_fallback_response(language)

        # Extract citations from source nodes
        source_nodes = getattr(response, 'source_nodes', [])
        citations = self._extract_citations(source_nodes)

        # Calculate confidence based on source relevance
        confidence = self._calculate_confidence(source_nodes)
        sources_count = len(source_nodes)

        # PHASE 1 OPTIMIZATION: Programmatic fallback
        # If confidence is too low or no sources, return fallback message
        # This is more reliable than letting LLM decide
        if confidence < 20.0 or sources_count == 0:
            logger.info(f"Low confidence ({confidence}%) or no sources - returning fallback")
            return self._get_fallback_response(language)

        result = {
            "answer": str(response),
            "citations": citations,
            "confidence": confidence,
            "sources_count": sources_count,
        }
        
        # Cache successful response for semantic matching
        semantic_cache.set(question, language, result)
        
        return result
    
    async def stream_query(
        self,
        question: str,
        language: str = "vi",
        conversation_history: Optional[list[dict]] = None,
    ):
        """
        Stream query — yields (event_type, data) tuples.

        event_type: 'token' | 'done' | 'fallback'
        Performs retrieval first, then streams LLM generation token by token.
        """
        # FAQ pre-filter
        from .faq_filter import get_faq_filter

        faq_filter = get_faq_filter()
        faq_match = faq_filter.check(question, language)

        if faq_match:
            response = faq_filter.get_response(faq_match, language)
            yield ("token", response["answer"])
            yield ("done", {"confidence": 100, "sources_count": 0, "citations": [], "is_faq": True})
            return

        # Semantic cache
        from .semantic_cache import get_semantic_cache

        semantic_cache = get_semantic_cache()
        if not semantic_cache.embed_model:
            semantic_cache.set_embed_model(LlamaSettings.embed_model)

        cached_response = semantic_cache.get(question, language)
        if cached_response:
            yield ("token", cached_response["answer"])
            yield ("done", {
                "confidence": cached_response.get("confidence", 0),
                "sources_count": cached_response.get("sources_count", 0),
                "citations": cached_response.get("citations", []),
                "from_cache": True,
            })
            return

        # Smart model routing
        from .model_router import get_model_router

        model_router = get_model_router()
        routing = model_router.route(question)

        custom_llm = None
        if routing.max_tokens != self.settings.llm_max_tokens:
            custom_llm = OpenAILike(
                model=self.settings.llm_model,
                api_base="https://api.deepseek.com/v1",
                api_key=self.settings.deepseek_api_key,
                temperature=self.settings.llm_temperature,
                max_tokens=routing.max_tokens,
                is_chat_model=True,
                context_window=32000,
            )

        try:
            # RETRIEVAL (same as query())
            retriever = self._get_retriever()
            source_nodes = await retriever.aretrieve(question)

            similarity_filter = SimilarityPostprocessor(similarity_cutoff=0.3)
            source_nodes = similarity_filter.postprocess_nodes(
                source_nodes, query_str=question
            )

            original_scores = {n.node.node_id: n.score for n in source_nodes}

            keyword_retriever = self._get_keyword_retriever()
            if keyword_retriever:
                try:
                    from ..retrieval.keyword_retriever import fuse_results

                    keyword_nodes = await keyword_retriever.retrieve(
                        question, top_k=self.settings.retrieval_top_k
                    )
                    source_nodes = fuse_results(
                        source_nodes, keyword_nodes,
                        vector_weight=self.settings.hybrid_vector_weight,
                        top_k=self.settings.retrieval_top_k,
                    )
                except Exception:
                    pass

            reranker = self._get_reranker()
            if reranker and source_nodes:
                source_nodes = reranker.postprocess_nodes(
                    source_nodes, query_str=question
                )

            for node in source_nodes:
                if node.node.node_id in original_scores:
                    node.score = original_scores[node.node.node_id]

            # Check confidence before streaming
            confidence = self._calculate_confidence(source_nodes)
            if confidence < 20.0 or len(source_nodes) == 0:
                fallback = self._get_fallback_response(language)
                yield ("token", fallback["answer"])
                yield ("done", {"confidence": 0, "sources_count": 0, "citations": [], "is_fallback": True})
                return

            # Build prompt
            context_parts = []
            for n in source_nodes:
                text = n.node.metadata.get("original_text", n.node.text)
                context_parts.append(text)
            context_str = "\n\n".join(context_parts)
            prompt = self._build_prompt_with_context(question, context_str, language, conversation_history)

            llm = custom_llm if custom_llm else LlamaSettings.llm

            # STREAM LLM generation token by token
            full_response = ""
            stream_response = await llm.astream_complete(prompt)
            async for token in stream_response:
                delta = token.delta
                if delta:
                    full_response += delta
                    yield ("token", delta)

            # Post-processing
            citations = self._extract_citations(source_nodes)
            result = {
                "answer": full_response,
                "citations": citations,
                "confidence": confidence,
                "sources_count": len(source_nodes),
            }
            semantic_cache.set(question, language, result)

            yield ("done", {
                "confidence": confidence,
                "sources_count": len(source_nodes),
                "citations": citations,
            })

        except Exception as e:
            logger.error(f"Stream query failed: {e}")
            fallback = self._get_fallback_response(language)
            yield ("token", fallback["answer"])
            yield ("done", {"confidence": 0, "sources_count": 0, "citations": [], "is_fallback": True})

    async def _query_with_fallback_llm(self, prompt: str) -> Any:
        """Query using OpenAI as fallback LLM."""
        from llama_index.llms.openai import OpenAI as OpenAILLM
        
        # Create temporary OpenAI LLM
        fallback_llm = OpenAILLM(
            model="gpt-4o-mini",
            api_key=self.settings.openai_api_key,
            temperature=self.settings.llm_temperature,
            max_tokens=self.settings.llm_max_tokens,
        )
        
        # Simple completion without RAG context (for reliability)
        response = await fallback_llm.acomplete(prompt)
        
        # Wrap in a mock response object
        class MockResponse:
            def __init__(self, text):
                self.text = text
                self.source_nodes = []
            def __str__(self):
                return self.text
        
        return MockResponse(response.text)

    def _get_fallback_response(self, language: str) -> dict[str, Any]:
        """Return standardized fallback response with contact info."""
        fallbacks = {
            "vi": """Xin lỗi, tôi chưa tìm thấy thông tin này trong tài liệu kỹ thuật hiện có. Để được hỗ trợ nhanh nhất, vui lòng liên hệ:

📞 Điện thoại: (84-254) 3522219
📧 Email: tts@toanthang.vn

Đội ngũ kỹ thuật TTE sẽ phản hồi trong thời gian sớm nhất!""",
            "en": """I apologize, I couldn't find this information in our current technical documents. For the fastest support, please contact us:

📞 Phone: (84-254) 3522219
📧 Email: tts@toanthang.vn

Our TTE technical team will respond as soon as possible!"""
        }
        
        return {
            "answer": fallbacks.get(language, fallbacks["vi"]),
            "citations": [],
            "confidence": 0.0,
            "sources_count": 0,
            "is_fallback": True,  # Flag for frontend to know this is a fallback
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
1. CHỈ trả lời dựa trên context được cung cấp bên dưới.
2. Trả lời chi tiết, chuyên nghiệp như một kỹ sư tư vấn.
3. KHÔNG được nhắc đến tên file, số trang hay nguồn tài liệu trong câu trả lời.
4. Dùng Markdown table cho thông số kỹ thuật.
5. Giữ nguyên đơn vị kỹ thuật (PSI, bar, mm).
6. Nếu context không có đủ thông tin, hãy trả lời ngắn gọn dựa trên những gì có sẵn.""",

            "en": """You are a Technical Engineer Consultant for TTE (Toan Thang Engineering).

RULES:
1. ONLY answer based on the context provided below.
2. Answer in detail, professionally as a technical consultant.
3. Do NOT mention filenames, page numbers, or sources in your response.
4. Use Markdown table for specs.
5. Keep original units (PSI, bar, mm).
6. If context doesn't have enough info, answer briefly based on what's available.""",
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

    def _build_prompt_with_context(
        self,
        question: str,
        context_str: str,
        language: str,
        history: Optional[list[dict]] = None,
    ) -> str:
        """Build system prompt including retrieved context."""
        prompts = {
            "vi": """Bạn là Chuyên gia Tư vấn Kỹ thuật của TTE (Toàn Thắng Engineering), hỗ trợ khách hàng về thiết bị công nghiệp.

QUY TẮC TRẢ LỜI:
1. Trả lời trực tiếp vào câu hỏi với tư cách chuyên gia.
2. TUYỆT ĐỐI KHÔNG dùng các cụm từ như: "Dựa trên thông tin...", "Theo tài liệu...", "Kết quả tìm kiếm...", "Trong ngữ cảnh...".
3. Xưng hô: xưng "TTE" hoặc "chúng tôi", gọi người hỏi là "bạn" hoặc "quý khách".
4. Văn phong: Chuyên nghiệp, súc tích, thân thiện.
5. Định dạng: Dùng Markdown table cho thông số kỹ thuật, in đậm các điểm chính.
6. Giữ nguyên đơn vị đo lường (PSI, bar, mm).
7. Nếu Context không có thông tin: Hãy xin lỗi và hướng dẫn khách hàng liên hệ hotline 0254.352.2219 để được tư vấn trực tiếp.

THÔNG TIN KỸ THUẬT QUAN TRỌNG (Chỉ dùng thông tin này để trả lời):
{context_str}""",

            "en": """You are a Technical Consultant for TTE (Toan Thang Engineering), assisting customers with industrial equipment.

RESPONSE RULES:
1. Answer directly as an expert.
2. DO NOT use phrases like: "Based on the provided text...", "According to the documents...", "In the context...".
3. Persona: Refer to yourself as "TTE" or "we", address the user as "you".
4. Tone: Professional, concise, customer-friendly.
5. Format: Use Markdown tables for specs, bold key points.
6. Keep original units (PSI, bar, mm).
7. If Context is missing info: Apologize politely and suggest contacting our hotline +84-254-352-2219 for direct support.

TECHNICAL CONTEXT (Strictly base your answer on this):
{context_str}""",
        }

        system_prompt = prompts.get(language, prompts["vi"]).format(context_str=context_str)

        # Add conversation history
        history_str = ""
        if history:
            history_str = "\n\nLịch sử chat:\n"
            for msg in history[-3:]:
                role = "U" if msg.get("role") == "user" else "A"
                history_str += f"{role}: {msg.get('content', '')[:100]}\n"

        return f"{system_prompt}{history_str}\n\nCâu hỏi: {question}"

    def _extract_citations(self, source_nodes: list[NodeWithScore]) -> list[dict]:
        """Extract citation information from source nodes."""
        citations = []
        seen_sources = set()

        for node in source_nodes:
            metadata = node.node.metadata or {}
            source_key = f"{metadata.get('file_name', 'Unknown')}_{metadata.get('page_number', 'N/A')}"

            if source_key not in seen_sources:
                seen_sources.add(source_key)
                # Use original_text (without prepended context) for citation display
                display_text = metadata.get("original_text", node.node.text)
                citations.append({
                    "source": metadata.get("file_name", "Unknown"),
                    "page": metadata.get("page_number", "N/A"),
                    "doc_type": metadata.get("doc_type", "general"),
                    "content_preview": display_text[:300] + "..." if len(display_text) > 300 else display_text,
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
