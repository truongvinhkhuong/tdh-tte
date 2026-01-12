import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIProvider {
    private readonly client: OpenAI;

    constructor(private readonly config: ConfigService) {
        this.client = new OpenAI({
            apiKey: this.config.get<string>('OPENAI_API_KEY') || '',
        });
    }

    async complete(prompt: string): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a professional content writer and editor for TTE (Toàn Thắng Engineering), an industrial equipment company. Your task is to polish and enhance content to be publication-ready with excellent grammar, flow, and SEO optimization.',
                },
                { role: 'user', content: prompt },
            ],
            max_tokens: 4000,
            temperature: 0.6,
        });

        return response.choices[0]?.message?.content || '';
    }

    async *stream(prompt: string): AsyncGenerator<string> {
        const stream = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a professional content writer and editor for TTE (Toàn Thắng Engineering).',
                },
                { role: 'user', content: prompt },
            ],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }
}
