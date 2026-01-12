import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';

import { AIModule } from './ai/ai.module';
import { AutomationModule } from './automation/automation.module';
import { QueueModule } from './queue/queue.module';
import { PayloadModule } from './payload/payload.module';
import { HealthController } from './health.controller';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),

        // HTTP Client
        HttpModule,

        // Scheduling (Cron jobs)
        ScheduleModule.forRoot(),

        // Queue (BullMQ with Redis)
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD,
            },
        }),

        // Feature Modules
        AIModule,
        AutomationModule,
        QueueModule,
        PayloadModule,
    ],
    controllers: [HealthController],
})
export class AppModule { }
