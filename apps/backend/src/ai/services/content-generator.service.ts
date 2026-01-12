import { Injectable } from '@nestjs/common';
import { AIRouterProvider } from '../providers/ai-router.provider';
import { SEOOptimizerService } from './seo-optimizer.service';
import { GenerateArticleDto } from '../dto/generate-article.dto';

export interface GeneratedArticle {
    title: string;
    content: string;
    summary: string;
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
    readingTime: number;
}

@Injectable()
export class ContentGeneratorService {
    constructor(
        private readonly aiRouter: AIRouterProvider,
        private readonly seoOptimizer: SEOOptimizerService,
    ) { }

    async generateArticle(dto: GenerateArticleDto): Promise<GeneratedArticle> {
        // Step 1: Generate draft (DeepSeek - cost-effective)
        const draft = await this.aiRouter.generate(
            this.buildDraftPrompt(dto),
            'draft',
        );

        // Step 2: Polish content (OpenAI - high quality)
        const polished = await this.aiRouter.generate(
            this.buildPolishPrompt(draft, dto.tone || 'professional'),
            'polish',
        );

        // Step 3: Optimize SEO (DeepSeek - cost-effective)
        const seoResult = await this.seoOptimizer.optimize({
            content: polished,
            targetKeywords: dto.keywords,
        });

        // Extract title from polished content (first line)
        const lines = polished.split('\n').filter((l) => l.trim());
        const title = lines[0]?.replace(/^#+\s*/, '') || dto.topic;
        const content = lines.slice(1).join('\n');

        return {
            title,
            content,
            summary: seoResult.excerpt,
            seo: {
                metaTitle: seoResult.metaTitle,
                metaDescription: seoResult.metaDescription,
                keywords: seoResult.keywords,
            },
            readingTime: this.calculateReadingTime(polished),
        };
    }

    private buildDraftPrompt(dto: GenerateArticleDto): string {
        const typeDescriptions = {
            Technical_Solution: 'bài viết giải pháp kỹ thuật chuyên sâu',
            TTE_Event: 'bài viết tin tức sự kiện công ty',
            Industry_News: 'bài viết tin tức ngành công nghiệp',
        };

        return `
      Viết ${typeDescriptions[dto.type]} về chủ đề: ${dto.topic}
      
      Yêu cầu:
      - Ngôn ngữ: ${dto.language === 'vi' ? 'Tiếng Việt' : 'English'}
      - Từ khóa cần đưa vào tự nhiên: ${dto.keywords.join(', ')}
      - Độ dài mục tiêu: ${dto.targetLength} từ
      - Lĩnh vực: Thiết bị công nghiệp (dầu khí, hóa dầu, điện lực)
      - Công ty: TTE - Toàn Thắng Engineering
      
      Cấu trúc bài viết:
      1. Tiêu đề hấp dẫn
      2. Mở bài giới thiệu vấn đề
      3. Nội dung chính (chia thành các mục nhỏ)
      4. Kết luận và call-to-action
    `;
    }

    private buildPolishPrompt(draft: string, tone: string): string {
        return `
      Polish and enhance the following article for publication.
      
      Requirements:
      - Tone: ${tone}
      - Fix any grammar or spelling errors
      - Improve flow and readability
      - Ensure professional quality
      - Keep the original structure and key points
      - Maintain all keywords naturally
      
      Original draft:
      ${draft}
    `;
    }

    private calculateReadingTime(content: string): number {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
}
