import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as crypto from 'crypto';
import { REDIS_CLIENT } from '../common/redis/redis.module';
import { ChatResponse } from './rag.service';

/**
 * Service for caching chatbot responses to save LLM costs.
 * 
 * Features:
 * - Hash-based cache key (question + language)
 * - Configurable TTL (default 24 hours)
 * - Normalization for better cache hit rate
 */
@Injectable()
export class ChatbotCacheService {
    private readonly logger = new Logger(ChatbotCacheService.name);
    private readonly cacheTtl: number;
    private readonly cacheEnabled: boolean;

    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis,
        private readonly configService: ConfigService,
    ) {
        // Cache TTL in seconds (default 24 hours)
        this.cacheTtl = this.configService.get<number>('CHATBOT_CACHE_TTL', 86400);
        this.cacheEnabled = this.configService.get<boolean>('CHATBOT_CACHE_ENABLED', true);
    }

    /**
     * Generate cache key from question and language.
     */
    private getCacheKey(question: string, language: string): string {
        const normalized = this.normalizeQuestion(question);
        const hash = crypto
            .createHash('sha256')
            .update(`${normalized}:${language}`)
            .digest('hex')
            .substring(0, 16); // Use first 16 chars for shorter key

        return `chat:cache:${hash}`;
    }

    /**
     * Normalize question for better cache hit rate.
     * - Lowercase
     * - Remove extra whitespace
     * - Remove punctuation
     */
    private normalizeQuestion(question: string): string {
        return question
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[?!.,;:'"]/g, '')
            .trim();
    }

    /**
     * Try to get cached response.
     */
    async getCachedResponse(
        question: string,
        language: string,
    ): Promise<ChatResponse | null> {
        if (!this.cacheEnabled) return null;

        try {
            const key = this.getCacheKey(question, language);
            const cached = await this.redis.get(key);

            if (cached) {
                this.logger.debug(`Cache HIT for: "${question.substring(0, 50)}..."`);
                return JSON.parse(cached);
            }

            return null;
        } catch (error) {
            this.logger.error(`Cache get error: ${error.message}`);
            return null;
        }
    }

    /**
     * Cache a response.
     */
    async cacheResponse(
        question: string,
        language: string,
        response: ChatResponse,
    ): Promise<void> {
        if (!this.cacheEnabled) return;

        try {
            const key = this.getCacheKey(question, language);
            await this.redis.setex(key, this.cacheTtl, JSON.stringify(response));
            this.logger.debug(`Cached response for: "${question.substring(0, 50)}..."`);
        } catch (error) {
            this.logger.error(`Cache set error: ${error.message}`);
        }
    }

    /**
     * Invalidate cache for a specific question.
     */
    async invalidateCache(question: string, language: string): Promise<void> {
        try {
            const key = this.getCacheKey(question, language);
            await this.redis.del(key);
        } catch (error) {
            this.logger.error(`Cache invalidation error: ${error.message}`);
        }
    }

    /**
     * Get cache statistics (for monitoring).
     */
    async getCacheStats(): Promise<{ keyCount: number }> {
        try {
            const keys = await this.redis.keys('chat:cache:*');
            return { keyCount: keys.length };
        } catch (error) {
            return { keyCount: 0 };
        }
    }
}
