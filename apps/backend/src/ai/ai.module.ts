import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { AIRouterProvider } from './providers/ai-router.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { OpenAIProvider } from './providers/openai.provider';
import { ContentGeneratorService } from './services/content-generator.service';
import { SEOOptimizerService } from './services/seo-optimizer.service';

@Module({
    imports: [HttpModule],
    controllers: [AIController],
    providers: [
        AIService,
        AIRouterProvider,
        DeepSeekProvider,
        OpenAIProvider,
        ContentGeneratorService,
        SEOOptimizerService,
    ],
    exports: [AIService, ContentGeneratorService, SEOOptimizerService],
})
export class AIModule { }
