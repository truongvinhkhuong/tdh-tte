import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

interface ContentGenerationJob {
    topic: string;
    keywords: string[];
    type: string;
    language: string;
}

@Processor('content-generation')
export class ContentGenerationProcessor {
    private readonly logger = new Logger(ContentGenerationProcessor.name);

    @Process('generate-article')
    async handleGenerateArticle(job: Job<ContentGenerationJob>) {
        this.logger.log(`Processing job ${job.id}: Generate article for "${job.data.topic}"`);

        try {
            // TODO: Inject ContentGeneratorService and generate article
            // const article = await this.contentGenerator.generateArticle(job.data);

            // TODO: Save to Payload CMS via PayloadService
            // await this.payloadService.createArticle(article);

            this.logger.log(`Job ${job.id} completed successfully`);
            return { success: true };
        } catch (error) {
            this.logger.error(`Job ${job.id} failed:`, error);
            throw error;
        }
    }

    @Process('refresh-content')
    async handleRefreshContent(job: Job<{ articleId: string }>) {
        this.logger.log(`Processing job ${job.id}: Refresh article ${job.data.articleId}`);

        // TODO: Implement content refresh logic

        return { success: true };
    }
}
