import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../common/redis/redis.module';

/**
 * Chat message structure for session history.
 */
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

/**
 * Session data structure stored in Redis.
 */
interface ChatSession {
    sessionId: string;
    history: ChatMessage[];
    createdAt: number;
    lastActiveAt: number;
}

/**
 * Service for managing chatbot session data in Redis.
 * 
 * Features:
 * - Stores chat history per session
 * - Auto-expires sessions after TTL (default 30 min)
 * - Limits context to recent turns only
 */
@Injectable()
export class ChatbotSessionService {
    private readonly logger = new Logger(ChatbotSessionService.name);
    private readonly sessionTtl: number;
    private readonly maxHistoryTurns: number;

    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis,
        private readonly configService: ConfigService,
    ) {
        // Session TTL in seconds (default 30 minutes)
        this.sessionTtl = this.configService.get<number>('CHATBOT_SESSION_TTL', 1800);
        // Max conversation turns to keep (default 3)
        this.maxHistoryTurns = this.configService.get<number>('CHATBOT_MAX_HISTORY_TURNS', 3);
    }

    /**
     * Get session key for Redis.
     */
    private getKey(sessionId: string): string {
        return `chat:session:${sessionId}`;
    }

    /**
     * Get existing session or create new one.
     */
    async getSession(sessionId: string): Promise<ChatSession | null> {
        try {
            const data = await this.redis.get(this.getKey(sessionId));
            if (!data) return null;

            const session: ChatSession = JSON.parse(data);
            return session;
        } catch (error) {
            this.logger.error(`Failed to get session ${sessionId}: ${error.message}`);
            return null;
        }
    }

    /**
     * Save a message to session history.
     * Automatically truncates to max turns and refreshes TTL.
     */
    async saveMessage(sessionId: string, message: ChatMessage): Promise<void> {
        try {
            const key = this.getKey(sessionId);
            let session = await this.getSession(sessionId);
            const now = Date.now();

            if (!session) {
                session = {
                    sessionId,
                    history: [],
                    createdAt: now,
                    lastActiveAt: now,
                };
            }

            // Add new message
            session.history.push({
                ...message,
                timestamp: now,
            });

            // Truncate to max turns (each turn = user + assistant)
            const maxMessages = this.maxHistoryTurns * 2;
            if (session.history.length > maxMessages) {
                session.history = session.history.slice(-maxMessages);
            }

            session.lastActiveAt = now;

            // Save with TTL refresh
            await this.redis.setex(key, this.sessionTtl, JSON.stringify(session));
        } catch (error) {
            this.logger.error(`Failed to save message for ${sessionId}: ${error.message}`);
        }
    }

    /**
     * Get recent conversation history for context.
     * Returns last N turns for LLM context.
     */
    async getRecentHistory(sessionId: string, maxTurns: number = 3): Promise<ChatMessage[]> {
        try {
            const session = await this.getSession(sessionId);
            if (!session || session.history.length === 0) {
                return [];
            }

            // Get last N turns (turn = pair of user + assistant messages)
            const maxMessages = maxTurns * 2;
            return session.history.slice(-maxMessages);
        } catch (error) {
            this.logger.error(`Failed to get history for ${sessionId}: ${error.message}`);
            return [];
        }
    }

    /**
     * Clear session data.
     */
    async clearSession(sessionId: string): Promise<void> {
        try {
            await this.redis.del(this.getKey(sessionId));
        } catch (error) {
            this.logger.error(`Failed to clear session ${sessionId}: ${error.message}`);
        }
    }
}
