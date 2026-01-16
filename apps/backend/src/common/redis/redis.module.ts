import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
    providers: [
        {
            provide: REDIS_CLIENT,
            useFactory: (configService: ConfigService) => {
                const host = configService.get<string>('REDIS_HOST', 'localhost');
                const port = configService.get<number>('REDIS_PORT', 6379);
                const password = configService.get<string>('REDIS_PASSWORD');

                const redis = new Redis({
                    host,
                    port,
                    password: password || undefined,
                    lazyConnect: true,
                    maxRetriesPerRequest: 3,
                    retryStrategy: (times) => {
                        if (times > 3) return null;
                        return Math.min(times * 100, 3000);
                    },
                });

                redis.on('connect', () => {
                    console.log(`[Redis] Connected to ${host}:${port}`);
                });

                redis.on('error', (err) => {
                    console.error('[Redis] Connection error:', err.message);
                });

                return redis;
            },
            inject: [ConfigService],
        },
    ],
    exports: [REDIS_CLIENT],
})
export class RedisModule { }
