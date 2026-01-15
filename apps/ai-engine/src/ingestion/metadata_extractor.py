"""Metadata extraction from technical documents using LLM."""
import json
import logging
from typing import Any, Optional

from llama_index.core.schema import TextNode
from llama_index.llms.openai_like import OpenAILike

from ..config import Settings

logger = logging.getLogger(__name__)


# ===========================================
# Metadata Schema for Industrial Equipment
# ===========================================

PRODUCT_METADATA_SCHEMA = {
    "brand": {
        "type": "str",
        "description": "Brand name (e.g., Fisher, Bettis, Keystone, Masoneilan)",
        "examples": ["Fisher", "Bettis", "Keystone", "Emerson", "Flowserve"],
    },
    "product_series": {
        "type": "str",
        "description": "Product series or line (e.g., HP Series, EZ Series)",
        "examples": ["HP Series", "E Series", "GX", "easy-e"],
    },
    "product_type": {
        "type": "str",
        "description": "Type of product",
        "examples": [
            "Control Valve",
            "Ball Valve",
            "Gate Valve",
            "Globe Valve",
            "Actuator",
            "Positioner",
        ],
    },
    "pressure_class": {
        "type": "list",
        "description": "ANSI/API pressure classes supported",
        "examples": ["CL150", "CL300", "CL600", "CL900", "CL1500", "CL2500"],
    },
    "size_range": {
        "type": "str",
        "description": "Size range in inches or mm",
        "examples": ["1\" - 24\"", "DN25 - DN600", "2\" - 48\""],
    },
    "connection_type": {
        "type": "list",
        "description": "Connection types",
        "examples": ["Flanged", "Threaded", "Welded", "Wafer", "Lug"],
    },
    "body_material": {
        "type": "list",
        "description": "Body materials",
        "examples": ["Carbon Steel", "Stainless Steel 316", "Alloy 20", "Hastelloy"],
    },
    "temperature_range": {
        "type": "str",
        "description": "Operating temperature range",
        "examples": ["-46°C to 593°C", "-20°F to 800°F"],
    },
    "application": {
        "type": "list",
        "description": "Industry applications",
        "examples": ["Oil & Gas", "Refining", "Petrochemical", "Power", "Chemical"],
    },
    "certification": {
        "type": "list",
        "description": "Certifications and standards",
        "examples": ["API 6D", "API 607", "ISO 9001", "ATEX", "SIL 3"],
    },
}


class MetadataExtractor:
    """
    Extract structured metadata from technical document chunks using LLM.

    Uses DeepSeek to analyze text and extract product specifications
    into a structured format for metadata filtering in Qdrant.
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self.llm = OpenAILike(
            model=settings.llm_model,
            api_base="https://api.deepseek.com/v1",
            api_key=settings.deepseek_api_key,
            temperature=0.0,  # Zero for consistent extraction
            max_tokens=1024,
        )
        logger.info("MetadataExtractor initialized")

    def _build_extraction_prompt(self, text: str) -> str:
        """Build prompt for metadata extraction."""
        schema_desc = "\n".join(
            f"- **{key}** ({info['type']}): {info['description']}. Examples: {', '.join(info['examples'][:3])}"
            for key, info in PRODUCT_METADATA_SCHEMA.items()
        )

        return f"""You are a technical document analyzer for industrial equipment.

## Task
Extract product metadata from the following technical document text.
Return a JSON object with the extracted information.

## Schema
{schema_desc}

## Rules
1. Only extract information explicitly stated in the text
2. Use null for fields not found in the text
3. For list fields, return arrays even if only one value
4. Normalize values to match the examples format
5. Return valid JSON only, no markdown formatting

## Text to analyze:
{text[:3000]}

## Response (JSON only):"""

    async def extract_metadata(
        self,
        text: str,
        existing_metadata: Optional[dict] = None,
    ) -> dict[str, Any]:
        """
        Extract metadata from text using LLM.

        Args:
            text: Document text to analyze
            existing_metadata: Existing metadata to merge with

        Returns:
            Dictionary of extracted metadata
        """
        if not text or len(text.strip()) < 50:
            return existing_metadata or {}

        try:
            prompt = self._build_extraction_prompt(text)
            response = await self.llm.acomplete(prompt)
            response_text = str(response).strip()

            # Clean up response (remove markdown code blocks if present)
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            # Parse JSON
            extracted = json.loads(response_text.strip())

            # Filter out null values
            extracted = {k: v for k, v in extracted.items() if v is not None}

            # Merge with existing metadata
            if existing_metadata:
                merged = {**existing_metadata, **extracted}
                return merged

            return extracted

        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse extraction response as JSON: {e}")
            return existing_metadata or {}
        except Exception as e:
            logger.error(f"Metadata extraction failed: {e}")
            return existing_metadata or {}

    async def enrich_nodes(
        self,
        nodes: list[TextNode],
        batch_size: int = 5,
    ) -> list[TextNode]:
        """
        Enrich a list of nodes with extracted metadata.

        Args:
            nodes: List of TextNode objects
            batch_size: Number of nodes to process per batch

        Returns:
            Nodes with enriched metadata
        """
        logger.info(f"Enriching {len(nodes)} nodes with metadata")

        enriched_nodes = []
        for i, node in enumerate(nodes):
            try:
                # Extract metadata from node text
                extracted = await self.extract_metadata(
                    node.text,
                    node.metadata,
                )

                # Update node metadata
                node.metadata = extracted

                # Log progress
                if (i + 1) % batch_size == 0:
                    logger.info(f"Processed {i + 1}/{len(nodes)} nodes")

            except Exception as e:
                logger.warning(f"Failed to enrich node {i}: {e}")

            enriched_nodes.append(node)

        logger.info(f"Metadata enrichment complete: {len(enriched_nodes)} nodes")
        return enriched_nodes

    def get_schema(self) -> dict:
        """Get the metadata schema for documentation."""
        return PRODUCT_METADATA_SCHEMA


def create_qdrant_payload_indexes() -> list[dict]:
    """
    Generate Qdrant payload index configurations for metadata filtering.

    Returns:
        List of index configurations for Qdrant
    """
    indexes = []

    for field_name, field_info in PRODUCT_METADATA_SCHEMA.items():
        field_type = field_info["type"]

        if field_type == "str":
            indexes.append({
                "field_name": field_name,
                "field_schema": "keyword",
            })
        elif field_type == "list":
            indexes.append({
                "field_name": field_name,
                "field_schema": "keyword",  # Array of keywords
            })

    return indexes
