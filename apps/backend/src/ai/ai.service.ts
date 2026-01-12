import { Injectable } from '@nestjs/common';
import { ContentGeneratorService } from './services/content-generator.service';
import { SEOOptimizerService } from './services/seo-optimizer.service';
import { GenerateArticleDto } from './dto/generate-article.dto';

@Injectable()
export class AIService {
    constructor(
        private readonly contentGenerator: ContentGeneratorService,
        private readonly seoOptimizer: SEOOptimizerService,
    ) { }

    async generateArticle(dto: GenerateArticleDto) {
        return this.contentGenerator.generateArticle(dto);
    }

    async optimizeSEO(content: string, keywords: string[]) {
        return this.seoOptimizer.optimize({ content, targetKeywords: keywords });
    }
}
