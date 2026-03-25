"""Keyword-based retrieval using Qdrant full-text search.

Complements vector (semantic) search by finding exact keyword matches,
which is critical for technical queries with model numbers (e.g., "DVC6200")
or specific terms that semantic search may miss.
"""
import logging
from typing import Optional

from llama_index.core.schema import NodeWithScore, TextNode
from qdrant_client import AsyncQdrantClient, models

logger = logging.getLogger(__name__)

# Common stop words to filter from keyword queries (EN + VI)
STOP_WORDS = {
    # English
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "about", "what",
    "which", "who", "when", "where", "how", "that", "this", "it", "not",
    "and", "or", "but", "if", "than", "so", "no", "all", "any", "each",
    # Vietnamese
    "la", "cua", "va", "cho", "trong", "voi", "cac", "mot", "nhung",
    "duoc", "den", "tu", "tai", "ve", "thi", "da", "se", "dang",
    "khong", "co", "nhu", "gi", "nao", "bao", "nhieu",
}


class QdrantKeywordRetriever:
    """
    Retrieve documents from Qdrant using full-text (keyword) search.

    Requires a text payload index on the '_node_content' field in Qdrant.
    This is created automatically by RAGEngine._ensure_text_index().
    """

    def __init__(
        self,
        client: AsyncQdrantClient,
        collection_name: str,
    ):
        self.client = client
        self.collection_name = collection_name

    def _extract_keywords(self, query: str) -> list[str]:
        """Extract meaningful keywords from a query string."""
        # Split on whitespace and punctuation-like boundaries
        words = query.lower().split()
        # Filter stop words and very short terms
        keywords = [w.strip(".,;:!?()[]{}\"'") for w in words]
        keywords = [w for w in keywords if w and len(w) >= 2 and w not in STOP_WORDS]
        return keywords

    async def retrieve(
        self,
        query: str,
        top_k: int = 15,
    ) -> list[NodeWithScore]:
        """
        Retrieve documents matching keywords in the query.

        Args:
            query: User's search query
            top_k: Maximum number of results to return

        Returns:
            List of NodeWithScore objects with keyword match scores
        """
        keywords = self._extract_keywords(query)
        if not keywords:
            return []

        try:
            # Build OR filter: match any keyword in text content
            keyword_conditions = [
                models.FieldCondition(
                    key="_node_content",
                    match=models.MatchText(text=keyword),
                )
                for keyword in keywords
            ]

            # Search with keyword filter (no vector — pure text match)
            results = await self.client.scroll(
                collection_name=self.collection_name,
                scroll_filter=models.Filter(
                    should=keyword_conditions,  # OR logic: match any keyword
                ),
                limit=top_k,
                with_payload=True,
                with_vectors=False,
            )

            points, _next_offset = results

            # Convert Qdrant points to NodeWithScore
            nodes = []
            for i, point in enumerate(points):
                payload = point.payload or {}
                text = payload.get("_node_content", payload.get("text", ""))
                metadata = {
                    k: v for k, v in payload.items()
                    if k not in ("_node_content", "text")
                }

                node = TextNode(
                    text=text,
                    id_=str(point.id),
                    metadata=metadata,
                )

                # Score based on keyword hit count (normalized)
                text_lower = text.lower()
                hit_count = sum(1 for kw in keywords if kw in text_lower)
                score = hit_count / len(keywords) if keywords else 0.0

                nodes.append(NodeWithScore(node=node, score=score))

            # Sort by score descending
            nodes.sort(key=lambda n: n.score or 0, reverse=True)

            logger.info(
                f"Keyword search: {len(keywords)} keywords → {len(nodes)} results"
            )
            return nodes

        except Exception as e:
            logger.warning(f"Keyword retrieval failed: {e}")
            return []


def fuse_results(
    vector_nodes: list[NodeWithScore],
    keyword_nodes: list[NodeWithScore],
    vector_weight: float = 0.7,
    top_k: int = 15,
    rrf_k: int = 60,
) -> list[NodeWithScore]:
    """
    Combine vector and keyword search results using Reciprocal Rank Fusion.

    RRF score = sum(weight / (k + rank)) for each retriever.
    This balances semantic relevance with exact keyword matching.

    Args:
        vector_nodes: Results from vector (semantic) search
        keyword_nodes: Results from keyword (BM25-like) search
        vector_weight: Weight for vector results (keyword_weight = 1 - vector_weight)
        top_k: Maximum results to return after fusion
        rrf_k: RRF constant (higher = more equal weighting across ranks)

    Returns:
        Fused and deduplicated list of NodeWithScore
    """
    keyword_weight = 1.0 - vector_weight

    # Build score map: node_id → (fused_score, node)
    score_map: dict[str, tuple[float, NodeWithScore]] = {}

    # Score vector results
    for rank, node_with_score in enumerate(vector_nodes):
        node_id = node_with_score.node.node_id
        rrf_score = vector_weight / (rrf_k + rank + 1)
        if node_id in score_map:
            existing_score, existing_node = score_map[node_id]
            score_map[node_id] = (existing_score + rrf_score, existing_node)
        else:
            score_map[node_id] = (rrf_score, node_with_score)

    # Score keyword results
    for rank, node_with_score in enumerate(keyword_nodes):
        node_id = node_with_score.node.node_id
        rrf_score = keyword_weight / (rrf_k + rank + 1)
        if node_id in score_map:
            existing_score, existing_node = score_map[node_id]
            score_map[node_id] = (existing_score + rrf_score, existing_node)
        else:
            score_map[node_id] = (rrf_score, node_with_score)

    # Sort by fused score and return top_k
    fused = sorted(score_map.values(), key=lambda x: x[0], reverse=True)[:top_k]

    # Update scores to fused scores
    result = []
    for fused_score, node_with_score in fused:
        result.append(NodeWithScore(node=node_with_score.node, score=fused_score))

    return result
