import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { RAGController } from './rag.controller';
import { RAGService } from './rag.service';
import { ChatbotSessionService } from './chatbot-session.service';
import { ChatbotCacheService } from './chatbot-cache.service';
import { DocumentIngestionProcessor } from './processors/document-ingestion.processor';

@Module({
    imports: [
        HttpModule.register({
            timeout: 120000, // 2 minutes for long RAG queries
            maxRedirects: 5,
        }),
        BullModule.registerQueue({
            name: 'document-ingestion',
        }),
    ],
    controllers: [RAGController],
    providers: [
        RAGService,
        ChatbotSessionService,
        ChatbotCacheService,
        DocumentIngestionProcessor,
    ],
    exports: [RAGService],
})
export class RAGModule { }

