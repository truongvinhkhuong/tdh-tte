# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

TTE (Toan Thang Engineering) monorepo — a full-stack application for an industrial equipment consulting company. Comprises four apps and one shared package, orchestrated by Turborepo.

## Commands

**Package manager:** pnpm 9.15.0 (required). Node >= 20.

```bash
# Setup
make install          # pnpm install
make db-up            # Start PostgreSQL (5434) + Redis (6381) via Docker

# Development (all apps)
make dev              # or: pnpm dev

# Individual apps
make dev-web          # Next.js frontend — port 4000
make dev-cms          # Payload CMS — port 4001
make dev-backend      # NestJS backend — port 4002
make dev-ai           # FastAPI AI engine — port 4003

# Build
make build            # All apps
make build-web        # Web only
make build-cms        # CMS only
make build-backend    # Backend only

# Quality
make lint             # pnpm lint (Turborepo)
make typecheck        # pnpm typecheck (Turborepo)

# Database
make db-migrate       # Run Payload CMS migrations
make db-reset         # Drop and recreate (interactive confirmation)

# Testing
cd apps/cms && pnpm vitest        # CMS unit tests (Vitest)
cd apps/cms && pnpm playwright    # CMS E2E tests (Playwright)
cd apps/backend && pnpm jest      # Backend unit tests (Jest)
```

## Architecture

```
Internet → Nginx (SSL) → ┬─ Web    (Next.js 16 / React 19)   :4000
                          ├─ CMS    (Payload CMS 3.70)         :4001
                          ├─ Backend(NestJS 10)                 :4002
                          └─ AI     (FastAPI / Python 3.11+)    :4003
                               ↕
                         PostgreSQL :5434  ·  Redis :6381
```

### apps/web
Next.js 16 + React 19 + Tailwind 4 + Shadcn UI. Locale-based routing via `app/[lang]/`. Supports `en` and `vi`. Hybrid data fetching: CMS when `NEXT_PUBLIC_USE_CMS=true`, otherwise static fallback data. ISR with 60s revalidation.

### apps/cms
Payload CMS 3.70 with Drizzle ORM on PostgreSQL. Lexical rich text editor. Localization (vi primary, en). Collections: Users, Media, Products, Projects, Services, Articles, Vacancies, Brands, SubBrands, ProductCategories, Industries. Globals: Homepage, AboutPage, ContactPage. Auto-generated types in `payload-types.ts` — run `generate:types` after schema changes. Cursor rules in `.cursor/rules/` document Payload patterns. Cloudinary for media storage.

### apps/backend
NestJS 10 with modules: AI (DeepSeek/OpenAI provider routing), RAG, Automation (cron), Queue (BullMQ + Redis), Payload (CMS client), Redis (cache/rate-limiting). API prefix: `/api`. Uses ValidationPipe for DTOs.

### apps/ai-engine
Python FastAPI with LlamaIndex RAG pipeline, Qdrant vector store, LlamaParse for PDF ingestion. Bilingual EN/VI. Endpoints: `/api/chat`, `/api/ingest`, `/api/gdrive/sync`, `/health`.

### packages/shared-types
TypeScript type definitions (Brand, Product, Project, Service, Article, etc.) consumed by web, cms, and backend as `@tte/shared-types`.

## Key Conventions

- **Path aliases:** `@/*` maps to `src/` in web, cms, and backend
- **Workspace packages:** `@tte/web`, `@tte/cms`, `@tte/backend`, `@tte/ai-engine`, `@tte/shared-types`
- **Filter syntax:** `pnpm --filter @tte/web <command>` or `turbo <task> --filter=@tte/web`
- **Payload Local API:** Bypasses access control by default. Use `overrideAccess: false` when passing user context
- **AI providers:** DeepSeek is primary (cost), OpenAI is fallback
- **Environment:** Copy `.env.example` to `.env.local`. See `.env.example` for all variables
- **CMS types:** After changing collections/globals, regenerate types — the generated `payload-types.ts` is checked in

## Documentation

Detailed docs live in `/docs/`:
- `architecture/system-architecture.md` — system design
- `architecture/data-flow.md` — data flow between services
- `architecture/monorepo-structure.md` — folder layout
- `ai-engine/` — RAG pipeline, chatbot architecture
- `seo/` — SEO guidelines
- `database/` — schema and migrations

CMS development patterns are in `apps/cms/.cursor/rules/` (access control, collections, fields, hooks, components, security).
