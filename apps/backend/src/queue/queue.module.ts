import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ContentGenerationProcessor } from './processors/content-generation.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'content-generation',
        }),
        BullModule.registerQueue({
            name: 'seo-optimization',
        }),
    ],
    providers: [ContentGenerationProcessor],
    exports: [BullModule],
})
export class QueueModule { }
