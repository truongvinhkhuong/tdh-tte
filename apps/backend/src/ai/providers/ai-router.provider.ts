import { Injectable } from '@nestjs/common';
import { DeepSeekProvider } from './deepseek.provider';
import { OpenAIProvider } from './openai.provider';

export type AIStage = 'draft' | 'polish' | 'seo' | 'critical';

@Injectable()
export class AIRouterProvider {
    constructor(
        private readonly deepseek: DeepSeekProvider,
        private readonly openai: OpenAIProvider,
    ) { }

    /**
     * Route AI requests to appropriate provider based on stage
     * - Draft & SEO → DeepSeek (cost-effective)
     * - Polish & Critical → OpenAI (higher quality)
     */
    async generate(prompt: string, stage: AIStage): Promise<string> {
        switch (stage) {
            case 'draft':
            case 'seo':
                return this.deepseek.complete(prompt);

            case 'polish':
            case 'critical':
                return this.openai.complete(prompt);

            default:
                // Fallback with retry
                try {
                    return await this.deepseek.complete(prompt);
                } catch (error) {
                    console.warn('DeepSeek failed, falling back to OpenAI');
                    return await this.openai.complete(prompt);
                }
        }
    }

    /**
     * Stream response from AI provider
     */
    async *stream(prompt: string, stage: AIStage): AsyncGenerator<string> {
        if (stage === 'polish' || stage === 'critical') {
            yield* this.openai.stream(prompt);
        } else {
            yield* this.deepseek.stream(prompt);
        }
    }
}
