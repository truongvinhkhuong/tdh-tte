import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Inject,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';

/**
 * Custom Rate Limiting Guard for Chatbot endpoints.
 * 
 * Implements 3-tier rate limiting:
 * - Per IP: 5 requests per minute (against DDOS)
 * - Per Session: 20 requests per hour (against token abuse)
 * - Global: 100 requests per minute (protect AI Engine)
 */
@Injectable()
export class ChatbotThrottlerGuard implements CanActivate {
    private readonly logger = new Logger(ChatbotThrottlerGuard.name);

    // Rate limit configuration (defaults can be overridden via env)
    private readonly ipLimit: number;
    private readonly ipTtl: number;
    private readonly sessionLimit: number;
    private readonly sessionTtl: number;
    private readonly globalLimit: number;
    private readonly globalTtl: number;

    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis,
        private readonly configService: ConfigService,
    ) {
        this.ipLimit = this.configService.get<number>('CHATBOT_RATE_LIMIT_IP', 5);
        this.ipTtl = 60; // 1 minute
        this.sessionLimit = this.configService.get<number>('CHATBOT_RATE_LIMIT_SESSION', 20);
        this.sessionTtl = 3600; // 1 hour
        this.globalLimit = this.configService.get<number>('CHATBOT_RATE_LIMIT_GLOBAL', 100);
        this.globalTtl = 60; // 1 minute
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Extract identifiers
        const ip = this.getClientIp(request);
        const sessionId = request.body?.sessionId || 'anonymous';

        try {
            // Check all rate limits
            await this.checkRateLimit(`throttle:ip:${ip}`, this.ipLimit, this.ipTtl, 'IP');
            await this.checkRateLimit(`throttle:session:${sessionId}`, this.sessionLimit, this.sessionTtl, 'Session');
            await this.checkRateLimit('throttle:global:chat', this.globalLimit, this.globalTtl, 'Global');

            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            // On Redis error, allow request but log warning
            this.logger.warn(`Rate limiting error (allowing request): ${error.message}`);
            return true;
        }
    }

    private async checkRateLimit(
        key: string,
        limit: number,
        ttl: number,
        type: string,
    ): Promise<void> {
        const current = await this.redis.incr(key);

        // Set TTL on first request
        if (current === 1) {
            await this.redis.expire(key, ttl);
        }

        if (current > limit) {
            const retryAfter = await this.redis.ttl(key);
            this.logger.warn(`Rate limit exceeded: ${type} - ${key}`);

            throw new HttpException(
                {
                    success: false,
                    error: 'Too many requests',
                    message: `Rate limit exceeded (${type}). Please try again later.`,
                    retryAfter,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }
    }

    private getClientIp(request: any): string {
        // Handle proxied requests
        const forwarded = request.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        return request.ip || request.connection?.remoteAddress || 'unknown';
    }
}
