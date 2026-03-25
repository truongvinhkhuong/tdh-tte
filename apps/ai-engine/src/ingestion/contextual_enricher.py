"""Contextual chunk enrichment for improved RAG retrieval.

Implements Anthropic's Contextual Retrieval technique:
prepend document-level context to each chunk before embedding,
so the embedding captures both the chunk content and its broader context.
"""
import asyncio
import logging
from typing import Optional

from llama_index.core.schema import TextNode
from llama_index.llms.openai_like import OpenAILike

from ..config import Settings

logger = logging.getLogger(__name__)


class ContextualEnricher:
    """
    Enrich document chunks with contextual information before embedding.

    For each chunk, uses LLM to generate a short context description
    based on the full document, then prepends it to the chunk text.
    This helps the embedding model understand what the chunk is about
    even when the chunk alone lacks sufficient context.
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self.llm = OpenAILike(
            model=settings.llm_model,
            api_base="https://api.deepseek.com/v1",
            api_key=settings.deepseek_api_key,
            temperature=0.0,  # Deterministic for consistent context
            max_tokens=256,  # Context should be short (1-2 sentences)
        )
        self.max_doc_length = settings.contextual_enrichment_max_doc_length
        self.batch_size = settings.contextual_enrichment_batch_size
        logger.info("ContextualEnricher initialized")

    def _build_context_prompt(
        self,
        chunk_text: str,
        full_document_text: str,
        doc_metadata: dict,
    ) -> str:
        """Build prompt for generating chunk context."""
        file_name = doc_metadata.get("file_name", "Unknown")
        doc_type = doc_metadata.get("doc_type", "general")

        # Truncate document to overview length
        doc_overview = full_document_text[: self.max_doc_length]
        if len(full_document_text) > self.max_doc_length:
            doc_overview += "\n[... truncated ...]"

        return f"""<document>
File: {file_name} | Type: {doc_type}
{doc_overview}
</document>

<chunk>
{chunk_text[:2000]}
</chunk>

Write 1-2 concise sentences describing the context of this chunk within the source document.
Include: product name/model (if any), document type, and which section of the document this belongs to.
Return ONLY the context, no explanation."""

    async def _generate_context(
        self,
        chunk_text: str,
        full_document_text: str,
        doc_metadata: dict,
    ) -> Optional[str]:
        """Generate context for a single chunk using LLM."""
        try:
            prompt = self._build_context_prompt(chunk_text, full_document_text, doc_metadata)
            response = await self.llm.acomplete(prompt)
            context = str(response).strip()

            # Validate: context should be short and meaningful
            if not context or len(context) < 10 or len(context) > 500:
                logger.warning(f"Context generation returned unexpected length: {len(context)}")
                return None

            return context
        except Exception as e:
            logger.warning(f"Context generation failed for chunk: {e}")
            return None

    async def enrich_chunks(
        self,
        chunks: list[TextNode],
        full_document_text: str,
        doc_metadata: dict,
    ) -> list[TextNode]:
        """
        Enrich chunks with document-level context.

        For each chunk:
        1. Saves original text in metadata["original_text"]
        2. Generates context using LLM
        3. Prepends context to chunk text (for better embedding)
        4. Sets metadata["has_context"] = True

        Args:
            chunks: List of TextNode chunks from document parsing
            full_document_text: Full text of the source document
            doc_metadata: Document-level metadata (file_name, doc_type, etc.)

        Returns:
            Enriched chunks with context prepended to text
        """
        if not chunks:
            return chunks

        logger.info(f"Enriching {len(chunks)} chunks with contextual information")

        enriched = []
        for i in range(0, len(chunks), self.batch_size):
            batch = chunks[i : i + self.batch_size]

            # Process batch concurrently
            tasks = [
                self._generate_context(chunk.text, full_document_text, doc_metadata)
                for chunk in batch
            ]
            contexts = await asyncio.gather(*tasks)

            for chunk, context in zip(batch, contexts):
                # Always save original text for citation display
                chunk.metadata["original_text"] = chunk.text

                if context:
                    # Prepend context to chunk text for embedding
                    chunk.text = f"[Context: {context}]\n\n{chunk.text}"
                    chunk.metadata["has_context"] = True
                else:
                    chunk.metadata["has_context"] = False

                enriched.append(chunk)

            logger.info(f"Enriched batch {i // self.batch_size + 1}: {len(batch)} chunks")

        success_count = sum(1 for c in enriched if c.metadata.get("has_context"))
        logger.info(
            f"Contextual enrichment complete: {success_count}/{len(enriched)} chunks enriched"
        )

        return enriched
