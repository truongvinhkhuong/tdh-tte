import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { RAGService } from '../rag.service';

interface IngestionJobData {
    filename: string;
    fileBuffer: string; // Base64 encoded
    source: 'upload' | 'gdrive';
    metadata?: Record<string, any>;
}

@Processor('document-ingestion')
export class DocumentIngestionProcessor {
    private readonly logger = new Logger(DocumentIngestionProcessor.name);

    constructor(private readonly ragService: RAGService) { }

    @Process('ingest-document')
    async handleIngestion(job: Job<IngestionJobData>) {
        this.logger.log(`Processing ingestion job ${job.id}: ${job.data.filename}`);

        try {
            // Decode base64 file buffer
            const fileBuffer = Buffer.from(job.data.fileBuffer, 'base64');

            // Call RAG service to ingest
            const result = await this.ragService.ingestDocument(
                fileBuffer,
                job.data.filename,
            );

            this.logger.log(
                `Completed ingestion job ${job.id}: ${result.chunksCreated} chunks created`,
            );

            return result;
        } catch (error) {
            this.logger.error(
                `Failed ingestion job ${job.id}: ${error.message}`,
            );
            throw error;
        }
    }

    @Process('sync-gdrive')
    async handleGDriveSync(job: Job<{ forceFullSync: boolean }>) {
        this.logger.log(`Processing Google Drive sync job ${job.id}`);

        try {
            const result = await this.ragService.syncGoogleDrive(
                job.data.forceFullSync,
            );

            this.logger.log(
                `Completed sync job ${job.id}: ${result.filesProcessed} files processed`,
            );

            return result;
        } catch (error) {
            this.logger.error(`Failed sync job ${job.id}: ${error.message}`);
            throw error;
        }
    }
}
