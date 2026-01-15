"""PDF document processor using LlamaParse."""
import logging
from pathlib import Path
from typing import Optional

from llama_index.core.node_parser import MarkdownNodeParser, SentenceSplitter
from llama_index.core.schema import Document, TextNode
from llama_parse import LlamaParse

from ..config import Settings

logger = logging.getLogger(__name__)


class PDFProcessor:
    """
    Process technical PDFs with LlamaParse.

    Optimized for:
    - Datasheets with complex tables
    - Technical manuals
    - ISO/ASTM standards
    - Product catalogs
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self.parser = LlamaParse(
            api_key=settings.llama_cloud_api_key,
            result_type="markdown",  # Best for preserving tables
            parsing_instruction=self._get_parsing_instructions(),
            language="en",  # Primary language for technical docs
            verbose=settings.debug,
        )

        # Markdown-aware node parser for structured content
        self.markdown_parser = MarkdownNodeParser()

        # Fallback sentence splitter for plain text
        self.sentence_splitter = SentenceSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
        )

        logger.info("PDF Processor initialized with LlamaParse")

    def _get_parsing_instructions(self) -> str:
        """Get specialized parsing instructions for technical documents."""
        return """
This is a technical document for industrial equipment (Oil & Gas, Petrochemical, Power Generation).

CRITICAL INSTRUCTIONS:
1. PRESERVE ALL TABLE STRUCTURES exactly as they appear
   - Keep all column headers
   - Maintain row/column alignment
   - Do not merge or split cells
   
2. EXTRACT ALL TECHNICAL SPECIFICATIONS:
   - Model numbers, part numbers
   - Pressure ratings (PSI, bar)
   - Temperature ratings (°C, °F)
   - Dimensions (mm, inch)
   - Material specifications
   - Flow rates, capacities
   
3. MAINTAIN DOCUMENT STRUCTURE:
   - Keep section headings
   - Preserve bullet lists
   - Retain numbered lists
   - Keep footnotes and notes

4. SPECIAL ELEMENTS:
   - Convert diagrams to text descriptions
   - Extract text from technical drawings
   - Preserve any certification marks (API, ISO, CE)
   
5. LANGUAGE:
   - Keep original language (usually English)
   - Preserve technical abbreviations
   - Maintain unit formats
"""

    async def process_file(
        self,
        file_path: Path,
        metadata: Optional[dict] = None,
    ) -> list[TextNode]:
        """
        Process a single PDF file and return nodes.

        Args:
            file_path: Path to the PDF file
            metadata: Optional additional metadata

        Returns:
            List of TextNode objects ready for indexing
        """
        logger.info(f"Processing file: {file_path.name}")

        try:
            # Parse PDF to Markdown using LlamaParse
            documents = await self.parser.aload_data(str(file_path))

            if not documents:
                logger.warning(f"No content extracted from {file_path.name}")
                return []

            # Enrich metadata
            base_metadata = {
                "file_name": file_path.name,
                "file_path": str(file_path),
                "doc_type": self._detect_doc_type(file_path.name),
            }
            if metadata:
                base_metadata.update(metadata)

            # Add metadata to all documents
            for i, doc in enumerate(documents):
                doc.metadata = {
                    **base_metadata,
                    "page_number": i + 1,
                    "total_pages": len(documents),
                }

            # Parse documents into nodes
            nodes = self._parse_to_nodes(documents)

            logger.info(f"Extracted {len(nodes)} chunks from {file_path.name}")
            return nodes

        except Exception as e:
            logger.error(f"Failed to process {file_path.name}: {e}")
            raise

    async def process_bytes(
        self,
        file_bytes: bytes,
        filename: str,
        metadata: Optional[dict] = None,
    ) -> list[TextNode]:
        """
        Process PDF from bytes (for uploaded files).

        Args:
            file_bytes: PDF file content as bytes
            filename: Original filename
            metadata: Optional additional metadata

        Returns:
            List of TextNode objects
        """
        # Save to temp file for processing
        import tempfile

        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = Path(tmp.name)

        try:
            nodes = await self.process_file(tmp_path, metadata)
            # Update filenames in metadata
            for node in nodes:
                node.metadata["file_name"] = filename
            return nodes
        finally:
            # Cleanup temp file
            tmp_path.unlink(missing_ok=True)

    def _parse_to_nodes(self, documents: list[Document]) -> list[TextNode]:
        """Parse documents into nodes using appropriate parser."""
        all_nodes = []

        for doc in documents:
            content = doc.text

            # Check if content looks like Markdown (has tables, headers)
            if self._is_markdown_content(content):
                nodes = self.markdown_parser.get_nodes_from_documents([doc])
            else:
                nodes = self.sentence_splitter.get_nodes_from_documents([doc])

            # Convert to TextNode if needed and add metadata
            for node in nodes:
                if isinstance(node, TextNode):
                    node.metadata = {**doc.metadata, **node.metadata}
                    all_nodes.append(node)

        return all_nodes

    def _is_markdown_content(self, content: str) -> bool:
        """Check if content appears to be Markdown formatted."""
        markdown_indicators = [
            "|",  # Tables
            "##",  # Headers
            "**",  # Bold
            "- ",  # Lists
            "1. ",  # Numbered lists
        ]
        return any(indicator in content for indicator in markdown_indicators)

    def _detect_doc_type(self, filename: str) -> str:
        """Detect document type from filename."""
        filename_lower = filename.lower()

        type_keywords = {
            "datasheet": ["datasheet", "data sheet", "data-sheet", "spec"],
            "manual": ["manual", "guide", "instruction", "operation"],
            "catalog": ["catalog", "catalogue", "brochure"],
            "standard": ["iso", "astm", "api", "asme", "ansi", "din"],
            "certificate": ["certificate", "cert", "approval"],
            "drawing": ["drawing", "dwg", "diagram"],
        }

        for doc_type, keywords in type_keywords.items():
            if any(kw in filename_lower for kw in keywords):
                return doc_type

        return "general"


class BatchProcessor:
    """Process multiple PDF files in batch."""

    def __init__(self, pdf_processor: PDFProcessor):
        self.processor = pdf_processor

    async def process_directory(
        self,
        directory: Path,
        recursive: bool = True,
    ) -> dict:
        """
        Process all PDFs in a directory.

        Returns:
            Summary of processing results
        """
        pattern = "**/*.pdf" if recursive else "*.pdf"
        pdf_files = list(directory.glob(pattern))

        logger.info(f"Found {len(pdf_files)} PDF files to process")

        results = {
            "total_files": len(pdf_files),
            "successful": 0,
            "failed": 0,
            "total_chunks": 0,
            "errors": [],
        }

        all_nodes = []
        for pdf_file in pdf_files:
            try:
                nodes = await self.processor.process_file(pdf_file)
                all_nodes.extend(nodes)
                results["successful"] += 1
                results["total_chunks"] += len(nodes)
            except Exception as e:
                results["failed"] += 1
                results["errors"].append({
                    "file": str(pdf_file),
                    "error": str(e),
                })

        return results, all_nodes
