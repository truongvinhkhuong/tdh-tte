"""Google Drive synchronization for knowledge base."""
import io
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

from ..config import Settings

logger = logging.getLogger(__name__)


class GoogleDriveSync:
    """
    Sync PDF documents from Google Drive folder.

    Features:
    - List new/modified files
    - Download files for processing
    - Track sync timestamps
    """

    SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
    PDF_MIMETYPE = "application/pdf"

    def __init__(self, settings: Settings):
        self.settings = settings
        self.folder_id = settings.google_drive_folder_id
        self._service = None

        if not self.folder_id:
            logger.warning("Google Drive folder ID not configured")

    @property
    def service(self):
        """Lazy initialization of Google Drive service."""
        if self._service is None:
            credentials_path = Path(self.settings.google_credentials_path)

            if not credentials_path.exists():
                raise FileNotFoundError(
                    f"Google credentials not found: {credentials_path}"
                )

            creds = service_account.Credentials.from_service_account_file(
                str(credentials_path),
                scopes=self.SCOPES,
            )
            self._service = build("drive", "v3", credentials=creds)
            logger.info("Google Drive service initialized")

        return self._service

    async def list_files(
        self,
        since_timestamp: Optional[datetime] = None,
        page_size: int = 100,
    ) -> list[dict]:
        """
        List PDF files in the configured folder.

        Args:
            since_timestamp: Only return files modified after this time
            page_size: Number of results per page

        Returns:
            List of file metadata dictionaries
        """
        if not self.folder_id:
            logger.warning("No folder ID configured, skipping sync")
            return []

        # Build query
        query_parts = [
            f"'{self.folder_id}' in parents",
            f"mimeType='{self.PDF_MIMETYPE}'",
            "trashed=false",
        ]

        if since_timestamp:
            timestamp_str = since_timestamp.strftime("%Y-%m-%dT%H:%M:%S")
            query_parts.append(f"modifiedTime > '{timestamp_str}'")

        query = " and ".join(query_parts)

        try:
            results = (
                self.service.files()
                .list(
                    q=query,
                    pageSize=page_size,
                    fields="files(id, name, modifiedTime, size, mimeType)",
                    orderBy="modifiedTime desc",
                )
                .execute()
            )

            files = results.get("files", [])
            logger.info(f"Found {len(files)} PDF files in Google Drive")

            return [
                {
                    "id": f["id"],
                    "name": f["name"],
                    "modified_time": f.get("modifiedTime"),
                    "size": int(f.get("size", 0)),
                }
                for f in files
            ]

        except Exception as e:
            logger.error(f"Failed to list Google Drive files: {e}")
            raise

    async def download_file(self, file_id: str) -> tuple[bytes, str]:
        """
        Download a file by its ID.

        Args:
            file_id: Google Drive file ID

        Returns:
            Tuple of (file_bytes, filename)
        """
        try:
            # Get file metadata
            file_metadata = (
                self.service.files()
                .get(fileId=file_id, fields="name")
                .execute()
            )
            filename = file_metadata["name"]

            # Download file content
            request = self.service.files().get_media(fileId=file_id)
            buffer = io.BytesIO()
            downloader = MediaIoBaseDownload(buffer, request)

            done = False
            while not done:
                status, done = downloader.next_chunk()
                if status:
                    logger.debug(f"Download {int(status.progress() * 100)}%")

            logger.info(f"Downloaded: {filename}")
            return buffer.getvalue(), filename

        except Exception as e:
            logger.error(f"Failed to download file {file_id}: {e}")
            raise

    async def sync_new_files(
        self,
        since_timestamp: Optional[datetime] = None,
    ) -> list[dict]:
        """
        Sync new/modified files from Google Drive.

        Args:
            since_timestamp: Only sync files modified after this time

        Returns:
            List of downloaded file info with bytes
        """
        files = await self.list_files(since_timestamp)

        downloaded = []
        for file_info in files:
            try:
                file_bytes, filename = await self.download_file(file_info["id"])
                downloaded.append({
                    **file_info,
                    "bytes": file_bytes,
                    "filename": filename,
                })
            except Exception as e:
                logger.error(f"Failed to sync {file_info['name']}: {e}")

        logger.info(f"Synced {len(downloaded)} files from Google Drive")
        return downloaded

    def is_configured(self) -> bool:
        """Check if Google Drive is properly configured."""
        if not self.folder_id:
            return False

        credentials_path = Path(self.settings.google_credentials_path)
        return credentials_path.exists()
