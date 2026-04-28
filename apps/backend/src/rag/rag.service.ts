import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { AxiosError } from 'axios';

// ===========================================
// Types
// ===========================================

export interface Citation {
    source: string;
    page: string;
    doc_type: string;
    content_preview: string;
    relevance_score: number;
}

export interface ChatResponse {
    answer: string;
    citations: Citation[];
    confidence: number;
    conversationId: string;
    sourcesCount: number;
}

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface IngestionResponse {
    success: boolean;
    documentId: string;
    filename: string;
    chunksCreated: number;
    docType: string;
    message: string;
}

export interface SyncResponse {
    success: boolean;
    filesFound: number;
    filesProcessed: number;
    filesFailed: number;
    totalChunks: number;
    message: string;
}

export interface HealthStatus {
    status: string;
    qdrantConnected: boolean;
    collection?: string;
    vectorsCount: number;
    llmModel?: string;
    gdriveConfigured: boolean;
}

// ===========================================
// Service
// ===========================================

@Injectable()
export class RAGService implements OnModuleInit {
    private readonly logger = new Logger(RAGService.name);
    private readonly aiEngineUrl: string;
    private readonly requestTimeout = 120000; // 2 minutes

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
    ) {
        this.aiEngineUrl =
            this.config.get<string>('AI_ENGINE_URL') || 'http://ai-engine:4003';
    }

    async onModuleInit() {
        // Check AI Engine connection on startup
        const isHealthy = await this.healthCheck();
        if (isHealthy) {
            this.logger.log(`Connected to AI Engine at ${this.aiEngineUrl}`);
        } else {
            this.logger.warn(
                `AI Engine not available at ${this.aiEngineUrl}. RAG features will be limited.`,
            );
        }
    }

    // ===========================================
    // Chat
    // ===========================================

    /**
     * Send a chat query to the RAG engine.
     *
     * @param question - User's question
     * @param language - Response language ('vi' or 'en')
     * @param conversationId - Optional conversation ID for context
     * @returns ChatResponse with answer and citations
     */
    async chat(
        question: string,
        language: 'vi' | 'en' = 'vi',
        conversationId?: string,
        conversationHistory?: ConversationMessage[],
    ): Promise<ChatResponse> {
        try {
            const response = await firstValueFrom(
                this.http
                    .post(`${this.aiEngineUrl}/api/chat`, {
                        question,
                        language,
                        conversation_id: conversationId,
                        conversation_history: conversationHistory,
                    })
                    .pipe(
                        timeout(this.requestTimeout),
                        catchError((error: AxiosError) => {
                            this.logger.error(
                                `Chat request failed: ${error.message}`,
                            );
                            throw error;
                        }),
                    ),
            );

            const data = response.data;

            return {
                answer: data.answer,
                citations: data.citations || [],
                confidence: data.confidence,
                conversationId: data.conversation_id,
                sourcesCount: data.sources_count || 0,
            };
        } catch (error) {
            this.logger.error(`RAG chat failed: ${error.message}`);
            throw new Error(`RAG chat failed: ${error.message}`);
        }
    }

    /**
     * Open a streaming chat request to the AI Engine.
     */
    async streamChat(
        question: string,
        language: 'vi' | 'en' = 'vi',
        conversationId?: string,
        conversationHistory?: ConversationMessage[],
    ): Promise<Response> {
        const response = await fetch(`${this.aiEngineUrl}/api/chat/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question,
                language,
                conversation_id: conversationId,
                conversation_history: conversationHistory,
            }),
        });

        if (!response.ok || !response.body) {
            throw new Error(`AI Engine returned ${response.status}`);
        }

        return response;
    }

    /**
     * Generate follow-up suggestions for the latest chat exchange.
     */
    async getSuggestions(
        question: string,
        answer: string,
        language: 'vi' | 'en' = 'vi',
    ): Promise<string[]> {
        try {
            const response = await firstValueFrom(
                this.http
                    .post(`${this.aiEngineUrl}/api/chat/suggestions`, {
                        question,
                        answer,
                        language,
                    })
                    .pipe(timeout(30000)),
            );

            return response.data?.suggestions || [];
        } catch (error) {
            this.logger.warn(`Suggestion request failed: ${error.message}`);
            return [];
        }
    }

    // ===========================================
    // Document Ingestion
    // ===========================================

    /**
     * Ingest a PDF document into the knowledge base.
     *
     * @param file - File buffer
     * @param filename - Original filename
     * @returns IngestionResponse with status
     */
    async ingestDocument(
        file: Buffer,
        filename: string,
    ): Promise<IngestionResponse> {
        try {
            const FormData = (await import('form-data')).default;
            const formData = new FormData();
            formData.append('file', file, {
                filename,
                contentType: 'application/pdf',
            });

            const response = await firstValueFrom(
                this.http
                    .post(`${this.aiEngineUrl}/api/ingest`, formData, {
                        headers: formData.getHeaders(),
                    })
                    .pipe(
                        timeout(this.requestTimeout),
                        catchError((error: AxiosError) => {
                            this.logger.error(
                                `Ingestion request failed: ${error.message}`,
                            );
                            throw error;
                        }),
                    ),
            );

            const data = response.data;

            return {
                success: data.success,
                documentId: data.document_id,
                filename: data.filename,
                chunksCreated: data.chunks_created,
                docType: data.doc_type,
                message: data.message,
            };
        } catch (error) {
            this.logger.error(`Document ingestion failed: ${error.message}`);
            throw new Error(`Document ingestion failed: ${error.message}`);
        }
    }

    // ===========================================
    // Google Drive Sync
    // ===========================================

    /**
     * Trigger Google Drive sync.
     *
     * @param forceFullSync - Whether to force a full sync
     * @returns SyncResponse with status
     */
    async syncGoogleDrive(forceFullSync = false): Promise<SyncResponse> {
        try {
            const response = await firstValueFrom(
                this.http
                    .post(`${this.aiEngineUrl}/api/gdrive/sync`, {
                        force_full_sync: forceFullSync,
                    })
                    .pipe(
                        timeout(300000), // 5 minutes for sync
                        catchError((error: AxiosError) => {
                            this.logger.error(
                                `Sync request failed: ${error.message}`,
                            );
                            throw error;
                        }),
                    ),
            );

            const data = response.data;

            return {
                success: data.success,
                filesFound: data.files_found,
                filesProcessed: data.files_processed,
                filesFailed: data.files_failed,
                totalChunks: data.total_chunks,
                message: data.message,
            };
        } catch (error) {
            this.logger.error(`Google Drive sync failed: ${error.message}`);
            throw new Error(`Google Drive sync failed: ${error.message}`);
        }
    }

    /**
     * Check if Google Drive is configured.
     */
    async isGoogleDriveConfigured(): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.aiEngineUrl}/api/gdrive/status`).pipe(
                    timeout(5000),
                    catchError(() => {
                        throw new Error('Failed to check GDrive status');
                    }),
                ),
            );
            return response.data.configured || false;
        } catch {
            return false;
        }
    }

    // ===========================================
    // Health Check
    // ===========================================

    /**
     * Check AI Engine health.
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.aiEngineUrl}/health`).pipe(
                    timeout(5000),
                    catchError(() => {
                        throw new Error('Health check failed');
                    }),
                ),
            );
            return response.data?.status === 'ok';
        } catch {
            return false;
        }
    }

    /**
     * Get detailed health status.
     */
    async getHealthStatus(): Promise<HealthStatus> {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.aiEngineUrl}/api/health`).pipe(
                    timeout(5000),
                    catchError((error) => {
                        throw new Error(`Health check failed: ${error.message}`);
                    }),
                ),
            );

            const data = response.data;

            return {
                status: data.status,
                qdrantConnected: data.qdrant_connected || false,
                collection: data.collection,
                vectorsCount: data.vectors_count || 0,
                llmModel: data.llm_model,
                gdriveConfigured: data.gdrive_configured || false,
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                qdrantConnected: false,
                vectorsCount: 0,
                gdriveConfigured: false,
            };
        }
    }
}
