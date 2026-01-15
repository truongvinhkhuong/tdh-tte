import {
    Controller,
    Post,
    Get,
    Body,
    UploadedFile,
    UseInterceptors,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RAGService } from './rag.service';

// ===========================================
// DTOs
// ===========================================

class ChatDto {
    question: string;
    language?: 'vi' | 'en';
    conversationId?: string;
}

class SyncDto {
    forceFullSync?: boolean;
}

// ===========================================
// Controller
// ===========================================

@Controller('rag')
export class RAGController {
    private readonly logger = new Logger(RAGController.name);

    constructor(private readonly ragService: RAGService) { }

    // ===========================================
    // Chat Endpoint
    // ===========================================

    /**
     * POST /api/rag/chat
     * Send a question to the technical knowledge base.
     */
    @Post('chat')
    async chat(@Body() dto: ChatDto) {
        if (!dto.question || dto.question.trim().length === 0) {
            throw new HttpException(
                'Question is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (dto.question.length > 2000) {
            throw new HttpException(
                'Question too long (max 2000 characters)',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const response = await this.ragService.chat(
                dto.question,
                dto.language || 'vi',
                dto.conversationId,
            );

            return {
                success: true,
                data: response,
            };
        } catch (error) {
            this.logger.error(`Chat error: ${error.message}`);
            throw new HttpException(
                {
                    success: false,
                    error: 'Chat service temporarily unavailable',
                    message: error.message,
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    // ===========================================
    // Ingestion Endpoints
    // ===========================================

    /**
     * POST /api/rag/ingest
     * Upload and ingest a PDF document.
     */
    @Post('ingest')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 50 * 1024 * 1024, // 50MB max
            },
            fileFilter: (req, file, callback) => {
                if (file.mimetype !== 'application/pdf') {
                    callback(
                        new HttpException(
                            'Only PDF files are allowed',
                            HttpStatus.BAD_REQUEST,
                        ),
                        false,
                    );
                    return;
                }
                callback(null, true);
            },
        }),
    )
    async ingestDocument(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException(
                'No file uploaded',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const response = await this.ragService.ingestDocument(
                file.buffer,
                file.originalname,
            );

            return {
                success: true,
                data: response,
            };
        } catch (error) {
            this.logger.error(`Ingestion error: ${error.message}`);
            throw new HttpException(
                {
                    success: false,
                    error: 'Document ingestion failed',
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // ===========================================
    // Google Drive Sync Endpoints
    // ===========================================

    /**
     * POST /api/rag/gdrive/sync
     * Trigger Google Drive synchronization.
     */
    @Post('gdrive/sync')
    async syncGoogleDrive(@Body() dto: SyncDto) {
        try {
            const isConfigured = await this.ragService.isGoogleDriveConfigured();
            if (!isConfigured) {
                throw new HttpException(
                    'Google Drive is not configured',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const response = await this.ragService.syncGoogleDrive(
                dto.forceFullSync || false,
            );

            return {
                success: true,
                data: response,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            this.logger.error(`Sync error: ${error.message}`);
            throw new HttpException(
                {
                    success: false,
                    error: 'Google Drive sync failed',
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * GET /api/rag/gdrive/status
     * Check Google Drive configuration status.
     */
    @Get('gdrive/status')
    async getGoogleDriveStatus() {
        const isConfigured = await this.ragService.isGoogleDriveConfigured();
        return {
            configured: isConfigured,
        };
    }

    // ===========================================
    // Health Endpoints
    // ===========================================

    /**
     * GET /api/rag/health
     * Check RAG service health.
     */
    @Get('health')
    async health() {
        const status = await this.ragService.getHealthStatus();
        return {
            service: 'rag',
            aiEngine: status,
        };
    }
}
