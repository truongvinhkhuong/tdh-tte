"""Auto-Retriever with metadata filtering for technical documents."""
import logging
from typing import Optional

from llama_index.core import VectorStoreIndex
from llama_index.core.retrievers import VectorIndexAutoRetriever
from llama_index.core.vector_stores import MetadataInfo, VectorStoreInfo

from ..config import Settings
from ..ingestion import PRODUCT_METADATA_SCHEMA

logger = logging.getLogger(__name__)


def create_vector_store_info() -> VectorStoreInfo:
    """
    Create VectorStoreInfo for Auto-Retriever.

    Defines metadata fields that the LLM can use to filter search results.
    """
    metadata_infos = []

    # Map schema to MetadataInfo
    schema_to_type = {
        "str": "string",
        "list": "list[string]",
    }

    for field_name, field_info in PRODUCT_METADATA_SCHEMA.items():
        metadata_infos.append(
            MetadataInfo(
                name=field_name,
                type=schema_to_type.get(field_info["type"], "string"),
                description=field_info["description"],
            )
        )

    return VectorStoreInfo(
        content_info="Technical specifications and documentation for industrial "
                     "equipment including valves, actuators, and control systems "
                     "for oil & gas, petrochemical, and power generation.",
        metadata_info=metadata_infos,
    )


class AutoRetriever:
    """
    Metadata-aware retriever that automatically filters based on query analysis.

    Uses LLM to:
    1. Analyze user question
    2. Extract filter conditions (brand, pressure_class, etc.)
    3. Apply metadata filters to vector search
    4. Return more precise results
    """

    def __init__(
        self,
        index: VectorStoreIndex,
        settings: Settings,
        similarity_top_k: int = 10,
    ):
        self.settings = settings
        self.vector_store_info = create_vector_store_info()

        self.retriever = VectorIndexAutoRetriever(
            index=index,
            vector_store_info=self.vector_store_info,
            similarity_top_k=similarity_top_k,
            verbose=settings.debug,
        )

        logger.info("AutoRetriever initialized with metadata filtering")

    async def retrieve(self, query: str) -> list:
        """
        Retrieve relevant documents with automatic metadata filtering.

        Args:
            query: User's question

        Returns:
            List of relevant document nodes
        """
        try:
            nodes = await self.retriever.aretrieve(query)
            logger.info(f"Retrieved {len(nodes)} nodes with auto-filtering")
            return nodes
        except Exception as e:
            logger.error(f"Auto-retrieval failed: {e}")
            raise

    def get_filter_info(self) -> dict:
        """Get information about available filters."""
        return {
            "content_info": self.vector_store_info.content_info,
            "available_filters": [
                {
                    "name": m.name,
                    "type": m.type,
                    "description": m.description,
                }
                for m in self.vector_store_info.metadata_info
            ],
        }


class HybridRetriever:
    """
    Retriever that combines vector search with keyword/filter capabilities.

    Supports:
    1. Pure vector search (similarity)
    2. Metadata-filtered search
    3. Combined hybrid search
    """

    def __init__(
        self,
        index: VectorStoreIndex,
        settings: Settings,
    ):
        self.index = index
        self.settings = settings

        # Standard retriever for fallback
        self.vector_retriever = index.as_retriever(
            similarity_top_k=settings.retrieval_top_k,
        )

        # Auto-retriever for metadata filtering
        self.auto_retriever = AutoRetriever(
            index=index,
            settings=settings,
            similarity_top_k=settings.retrieval_top_k,
        )

        logger.info("HybridRetriever initialized")

    async def retrieve(
        self,
        query: str,
        use_filters: bool = True,
        metadata_filters: Optional[dict] = None,
    ) -> list:
        """
        Retrieve documents using appropriate strategy.

        Args:
            query: User's question
            use_filters: Whether to use auto-filtering
            metadata_filters: Optional explicit filters to apply

        Returns:
            List of relevant document nodes
        """
        try:
            if use_filters:
                # Use auto-retriever for smart filtering
                return await self.auto_retriever.retrieve(query)
            else:
                # Use standard vector search
                return await self.vector_retriever.aretrieve(query)
        except Exception as e:
            logger.warning(f"Auto-retrieval failed, falling back to vector: {e}")
            return await self.vector_retriever.aretrieve(query)
