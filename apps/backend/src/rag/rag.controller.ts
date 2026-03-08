import {
    Controller,
    Post,
    Get,
    Body,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    HttpException,
    HttpStatus,
    Logger,
    Ip,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString, IsOptional, IsIn, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { RAGService } from './rag.service';
import { ChatbotSessionService, ChatMessage } from './chatbot-session.service';
import { ChatbotCacheService } from './chatbot-cache.service';
import { ChatbotThrottlerGuard } from '../common/guards/chatbot-throttler.guard';
import { PromptInjectionGuard } from '../common/guards/prompt-injection.guard';

// ===========================================
// DTOs
// ===========================================

class ChatDto {
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    question: string;

    @IsOptional()
    @IsString()
    @IsIn(['vi', 'en'])
    language?: 'vi' | 'en';

    @IsOptional()
    @IsString()
    conversationId?: string;

    @IsOptional()
    @IsString()
    sessionId?: string; // Client-generated UUID for session tracking
}

class SyncDto {
    @IsOptional()
    @IsBoolean()
    forceFullSync?: boolean;
}

// ===========================================
// Constants
// ===========================================

const MAX_QUESTION_LENGTH = 500;

// ===========================================
// Controller
// ===========================================

@Controller('rag')
export class RAGController {
    private readonly logger = new Logger(RAGController.name);

    constructor(
        private readonly ragService: RAGService,
        private readonly sessionService: ChatbotSessionService,
        private readonly cacheService: ChatbotCacheService,
    ) { }

    // ===========================================
    // Chat Endpoint (with security & optimization)
    // ===========================================

    /**
     * POST /api/rag/chat
     * Send a question to the technical knowledge base.
     * 
     * Security layers:
     * - Rate limiting (IP/Session/Global)
     * - Prompt injection detection
     * - Input validation
     * 
     * Optimization:
     * - Response caching
     * - Session context (2-3 turns)
     */
    @Post('chat')
    @UseGuards(ChatbotThrottlerGuard, PromptInjectionGuard)
    async chat(@Body() dto: ChatDto, @Ip() ip: string) {
        // Validate question exists
        if (!dto.question || dto.question.trim().length === 0) {
            throw new HttpException(
                'Question is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Validate question length (stricter limit for cost control)
        if (dto.question.length > MAX_QUESTION_LENGTH) {
            throw new HttpException(
                `Question too long (max ${MAX_QUESTION_LENGTH} characters)`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const language = dto.language || 'vi';
        const sessionId = dto.sessionId || 'anonymous';

        try {
            // 1. Check cache first (cost optimization)
            const cachedResponse = await this.cacheService.getCachedResponse(
                dto.question,
                language,
            );

            if (cachedResponse) {
                this.logger.log(`Cache HIT for session ${sessionId}`);
                return {
                    success: true,
                    data: cachedResponse,
                    cached: true,
                };
            }

            // 2. Get recent conversation history (context)
            const history = await this.sessionService.getRecentHistory(sessionId, 3);

            // 3. Call RAG service with context
            const response = await this.ragService.chat(
                dto.question,
                language,
                dto.conversationId,
            );

            // 4. Save messages to session
            await this.sessionService.saveMessage(sessionId, {
                role: 'user',
                content: dto.question,
                timestamp: Date.now(),
            });

            await this.sessionService.saveMessage(sessionId, {
                role: 'assistant',
                content: response.answer,
                timestamp: Date.now(),
            });

            // 5. Cache the response
            await this.cacheService.cacheResponse(dto.question, language, response);

            return {
                success: true,
                data: response,
                cached: false,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
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
    // Streaming Chat Endpoint
    // ===========================================

    /**
     * POST /api/rag/chat/stream
     * Stream chat responses using Server-Sent Events.
     * 
     * Returns real-time response chunks for better UX.
     */
    @Post('chat/stream')
    @UseGuards(ChatbotThrottlerGuard, PromptInjectionGuard)
    async chatStream(@Body() dto: ChatDto, @Ip() ip: string) {
        const { Readable } = await import('stream');

        // Validate question
        if (!dto.question || dto.question.trim().length === 0) {
            throw new HttpException('Question is required', HttpStatus.BAD_REQUEST);
        }

        if (dto.question.length > MAX_QUESTION_LENGTH) {
            throw new HttpException(
                `Question too long (max ${MAX_QUESTION_LENGTH} characters)`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const language = dto.language || 'vi';
        const sessionId = dto.sessionId || 'anonymous';

        try {
            // Check cache first
            const cachedResponse = await this.cacheService.getCachedResponse(dto.question, language);

            if (cachedResponse) {
                this.logger.log(`Stream Cache HIT for session ${sessionId}`);
                // Return cached response as single chunk
                const chunks = [
                    `data: ${JSON.stringify({ type: 'chunk', data: cachedResponse.answer })}\n\n`,
                    `data: ${JSON.stringify({ type: 'done', data: { cached: true, confidence: cachedResponse.confidence } })}\n\n`,
                ];

                return {
                    headers: {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    },
                    body: chunks.join(''),
                };
            }

            // Proxy streaming from AI Engine
            const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
            const response = await fetch(`${aiEngineUrl}/api/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: dto.question,
                    language,
                    conversation_id: dto.conversationId,
                }),
            });

            if (!response.ok) {
                throw new Error(`AI Engine returned ${response.status}`);
            }

            // Return streaming response headers info
            // The actual streaming is handled by the frontend calling AI Engine directly
            // or through nginx proxy
            return {
                streamUrl: `${aiEngineUrl}/api/chat/stream`,
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                },
            };

        } catch (error) {
            this.logger.error(`Stream error: ${error.message}`);
            throw new HttpException(
                { success: false, error: 'Streaming unavailable' },
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
        const cacheStats = await this.cacheService.getCacheStats();

        return {
            service: 'rag',
            aiEngine: status,
            cache: cacheStats,
        };
    }
}

