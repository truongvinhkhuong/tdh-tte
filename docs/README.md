# TTE Monorepo — Technical Documentation

## Overview

Tài liệu kỹ thuật cho hệ thống TTE (Toan Thang Engineering) monorepo — nền tảng quản lý nội dung, AI-powered services, và website công ty thiết bị công nghiệp.

---

## Table of Contents

### Architecture
- [System Architecture](./architecture/SYSTEM_ARCHITECTURE.md) — Kiến trúc hệ thống, components, communication patterns
- [Monorepo Structure](./architecture/MONOREPO_STRUCTURE.md) — Cấu trúc thư mục, workspace commands
- [Data Flow](./architecture/DATA_FLOW.md) — Luồng dữ liệu giữa các services

### CMS (PayloadCMS)
- [CMS Documentation Index](./cms/README.md) — Tổng quan và quick reference
- [Current State](./cms/CURRENT_STATE.md) — Hiện trạng chính xác — ER diagrams, field tables
- [Data Model](./cms/DATA_MODEL.md) — Class diagrams, fields, relationships chi tiết
- [Issues & Gaps](./cms/ISSUES_AND_GAPS.md) — 16 issues phát hiện, phân loại severity
- [Standardization Proposal](./cms/STANDARDIZATION_PROPOSAL.md) — Lộ trình chuẩn hoá 5 phase

### API
- [CMS API Reference](./api/CMS_API.md) — Payload CMS REST API endpoints
- [Backend API Reference](./api/BACKEND_API.md) — NestJS Backend API (AI, RAG, health)

### AI Engine
- [AI Engine Overview](./ai-engine/README.md) — FastAPI RAG pipeline
- [Architecture](./ai-engine/ARCHITECTURE.md) — LlamaIndex, Qdrant, LlamaParse
- [Chatbot Architecture](./ai-engine/CHATBOT_ARCHITECTURE.md) — Chat system design
- [Chatbot Security](./ai-engine/CHATBOT_SECURITY.md) — Rate limiting, prompt injection
- [API Reference](./ai-engine/API_REFERENCE.md) — FastAPI endpoints
- [Deployment](./ai-engine/DEPLOYMENT.md) — AI Engine deployment guide
- [Operations](./ai-engine/OPERATIONS.md) — Monitoring, maintenance

### SEO
- [SEO Guide](./seo/SEO_GUIDE.md) — Hướng dẫn SEO cho Next.js
- [SEO Checklist](./seo/SEO_CHECKLIST.md) — Checklist kiểm tra SEO
- [Content Guidelines](./seo/CONTENT_GUIDELINES.md) — Quy chuẩn nội dung

### Development
- [Getting Started](./development/GETTING_STARTED.md) — Cài đặt và chạy dự án

### Deployment
- [Production Deployment](./deployment/PRODUCTION.md) — Docker + Nginx production setup

### Database
- [Schema](./database/SCHEMA.md) — *(deprecated — xem [CMS Current State](./cms/CURRENT_STATE.md))*

---

## Quick Reference

| Service | Port (dev) | Port (prod) | URL (prod) |
|---------|------------|-------------|------------|
| Web (Next.js 16) | 4000 | 4000 | toanthang.vn |
| CMS (Payload 3.70) | 4001 | 4001 | cms.toanthang.vn |
| Backend (NestJS 10) | 4002 | 4002 | api.toanthang.vn |
| AI Engine (FastAPI) | 4003 | 4003 | - (internal) |
| PostgreSQL 16 | 5434 | 5432 (internal) | - |
| Redis 7 | 6381 | 6379 (internal) | - |

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js + React | 16.0.0 + 19.2.0 |
| CMS | Payload CMS (Next.js 15.4.10) | 3.70.0 |
| Backend | NestJS | 10.4.x |
| AI Engine | FastAPI + LlamaIndex | Python 3.11+ |
| Database | PostgreSQL (Drizzle ORM) | 16 |
| Cache/Queue | Redis + BullMQ | 7 |
| Build | Turborepo + pnpm | 2.5+ / 9.15+ |

---

> **Cập nhật lần cuối:** 2026-03-24
