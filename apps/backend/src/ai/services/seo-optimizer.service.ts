import { Injectable } from '@nestjs/common';
import { AIRouterProvider } from '../providers/ai-router.provider';

interface SEOOptimizeInput {
    content: string;
    targetKeywords: string[];
}

export interface SEOOptimizeResult {
    metaTitle: string;
    metaDescription: string;
    excerpt: string;
    keywords: string[];
    suggestions: string[];
}

@Injectable()
export class SEOOptimizerService {
    constructor(private readonly aiRouter: AIRouterProvider) { }

    async optimize(input: SEOOptimizeInput): Promise<SEOOptimizeResult> {
        const prompt = this.buildSEOPrompt(input);
        const response = await this.aiRouter.generate(prompt, 'seo');

        return this.parseSEOResponse(response, input.targetKeywords);
    }

    private buildSEOPrompt(input: SEOOptimizeInput): string {
        return `
      Analyze the following content and generate SEO optimization data.
      
      Content:
      ${input.content.substring(0, 2000)}...
      
      Target keywords: ${input.targetKeywords.join(', ')}
      
      Respond in JSON format:
      {
        "metaTitle": "SEO-optimized title (max 60 chars)",
        "metaDescription": "Compelling meta description (max 160 chars)",
        "excerpt": "Article excerpt for preview (max 200 chars)",
        "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
        "suggestions": ["improvement suggestion 1", "improvement suggestion 2"]
      }
      
      Only respond with valid JSON, no markdown or explanation.
    `;
    }

    private parseSEOResponse(
        response: string,
        fallbackKeywords: string[],
    ): SEOOptimizeResult {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    metaTitle: parsed.metaTitle || '',
                    metaDescription: parsed.metaDescription || '',
                    excerpt: parsed.excerpt || '',
                    keywords: parsed.keywords || fallbackKeywords,
                    suggestions: parsed.suggestions || [],
                };
            }
        } catch (error) {
            console.warn('Failed to parse SEO response:', error);
        }

        // Return defaults if parsing fails
        return {
            metaTitle: '',
            metaDescription: '',
            excerpt: '',
            keywords: fallbackKeywords,
            suggestions: [],
        };
    }
}
