import { Controller, Post, Body, Get } from '@nestjs/common';
import { AIService } from './ai.service';
import { GenerateArticleDto } from './dto/generate-article.dto';

@Controller('ai')
export class AIController {
    constructor(private readonly aiService: AIService) { }

    @Get('status')
    getStatus() {
        return {
            service: 'ai',
            status: 'ready',
            providers: ['deepseek', 'openai'],
        };
    }

    @Post('generate/article')
    async generateArticle(@Body() dto: GenerateArticleDto) {
        return this.aiService.generateArticle(dto);
    }

    @Post('optimize/seo')
    async optimizeSEO(@Body() body: { content: string; keywords: string[] }) {
        return this.aiService.optimizeSEO(body.content, body.keywords);
    }
}
