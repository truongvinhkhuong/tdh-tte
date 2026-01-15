# AI Engine Documentation

Technical documentation for the TTE AI Engine RAG Chatbot.

## Quick Links

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System architecture, components, data flow |
| [API Reference](./API_REFERENCE.md) | API endpoints, request/response examples |
| [Deployment](./DEPLOYMENT.md) | Setup guide, Docker, external services |
| [Operations](./OPERATIONS.md) | Day-to-day operations, monitoring |

## Overview

AI Engine là Python service cung cấp RAG (Retrieval-Augmented Generation) cho việc tra cứu tài liệu kỹ thuật ngành Dầu khí, Năng lượng, Hóa chất.

### Features

- 📄 **PDF Processing**: LlamaParse cho bảng biểu phức tạp
- 🔍 **Semantic Search**: Qdrant Cloud với metadata filtering
- 🤖 **LLM**: DeepSeek với Chain-of-Thought prompts
- 📁 **Google Drive**: Tự động sync từ folder
- 🌐 **Bilingual**: Hỗ trợ Tiếng Việt/English

### Tech Stack

```
FastAPI + LlamaIndex + Qdrant Cloud + DeepSeek + LlamaParse
```

## Getting Started

1. [Clone and configure environment](./DEPLOYMENT.md#2-environment-configuration)
2. [Setup external services](./DEPLOYMENT.md#1-thiết-lập-external-services)
3. [Deploy with Docker](./DEPLOYMENT.md#3-deployment-options)
4. [Test the API](./API_REFERENCE.md#chat)
