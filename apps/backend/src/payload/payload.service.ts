import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PayloadService {
    private readonly logger = new Logger(PayloadService.name);
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor(
        private readonly config: ConfigService,
        private readonly http: HttpService,
    ) {
        this.baseUrl = this.config.get<string>('PAYLOAD_API_URL') || 'http://localhost:3001/api';
        this.apiKey = this.config.get<string>('PAYLOAD_API_KEY') || '';
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        };
    }

    /**
     * Create a new article in Payload CMS
     */
    async createArticle(data: {
        title: string;
        slug: string;
        content: string;
        summary: string;
        type: string;
        seo?: {
            metaTitle?: string;
            metaDescription?: string;
        };
    }) {
        try {
            const response = await firstValueFrom(
                this.http.post(`${this.baseUrl}/articles`, data, {
                    headers: this.getHeaders(),
                }),
            );
            this.logger.log(`Created article: ${data.title}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to create article: ${error.message}`);
            throw error;
        }
    }

    /**
     * Update an existing article
     */
    async updateArticle(id: string, data: Partial<{
        title: string;
        content: string;
        summary: string;
    }>) {
        try {
            const response = await firstValueFrom(
                this.http.patch(`${this.baseUrl}/articles/${id}`, data, {
                    headers: this.getHeaders(),
                }),
            );
            this.logger.log(`Updated article: ${id}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to update article ${id}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get all articles (paginated)
     */
    async getArticles(params?: { page?: number; limit?: number; type?: string }) {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.baseUrl}/articles`, {
                    headers: this.getHeaders(),
                    params,
                }),
            );
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to get articles: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get article by ID
     */
    async getArticle(id: string) {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.baseUrl}/articles/${id}`, {
                    headers: this.getHeaders(),
                }),
            );
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to get article ${id}: ${error.message}`);
            throw error;
        }
    }
}
