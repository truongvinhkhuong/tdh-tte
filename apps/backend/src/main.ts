import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:4000',
            process.env.CMS_URL || 'http://localhost:4001',
        ],
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // API prefix
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 4002;
    await app.listen(port);

    console.log(`🚀 Backend Server running on port ${port}`);
    console.log(`📊 Health: http://localhost:${port}/api/health`);
    console.log(`🤖 AI API: http://localhost:${port}/api/ai`);
}

bootstrap();
