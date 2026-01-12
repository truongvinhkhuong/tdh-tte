import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeepSeekProvider {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://api.deepseek.com/v1';

    constructor(
        private readonly config: ConfigService,
        private readonly http: HttpService,
    ) {
        this.apiKey = this.config.get<string>('DEEPSEEK_API_KEY') || '';
    }

    async complete(prompt: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error('DEEPSEEK_API_KEY is not configured');
        }

        const response = await firstValueFrom(
            this.http.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content:
                                'You are a professional content writer for TTE (Toàn Thắng Engineering), an industrial equipment company specializing in oil & gas, petrochemical, and power generation sectors.',
                        },
                        { role: 'user', content: prompt },
                    ],
                    max_tokens: 4000,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            ),
        );

        return response.data.choices[0]?.message?.content || '';
    }

    async *stream(prompt: string): AsyncGenerator<string> {
        // Simplified streaming implementation
        const response = await this.complete(prompt);
        yield response;
    }
}
