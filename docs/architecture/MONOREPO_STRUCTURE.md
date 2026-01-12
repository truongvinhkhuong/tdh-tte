# Monorepo Structure

## Overview

This project uses Turborepo for monorepo management with pnpm workspaces. The structure separates applications from shared packages.

---

## Directory Layout

```
toanthang/
|
+-- apps/
|   +-- web/                    # Next.js Frontend
|   +-- cms/                    # Payload CMS
|   +-- backend/                # NestJS Backend
|
+-- packages/
|   +-- shared-types/           # Shared TypeScript definitions
|
+-- docs/                       # Documentation
|
+-- nginx/                      # Nginx configuration
|
+-- scripts/                    # Deployment scripts
|
+-- docker-compose.dev.yml      # Development containers
+-- docker-compose.prod.yml     # Production containers
+-- turbo.json                  # Turborepo configuration
+-- pnpm-workspace.yaml         # Workspace definition
+-- package.json                # Root package
```

---

## Applications

### apps/web

```
apps/web/
|
+-- app/                        # Next.js App Router
|   +-- (routes)/               # Page routes
|   +-- layout.tsx              # Root layout
|
+-- components/                 # React components
|   +-- ui/                     # Shadcn UI components
|   +-- shared/                 # Shared components
|
+-- lib/                        # Utilities
|   +-- payload/                # CMS API client
|   +-- data.ts                 # Static data fallback
|   +-- utils.ts                # Helper functions
|
+-- public/                     # Static assets
+-- types/                      # TypeScript definitions
+-- package.json
+-- next.config.mjs
+-- tailwind.config.ts
```

### apps/cms

```
apps/cms/
|
+-- src/
|   +-- app/                    # Next.js App (Payload Admin)
|   +-- collections/            # Payload collections
|   |   +-- Users.ts
|   |   +-- Media.ts
|   |   +-- Products.ts
|   |   +-- Projects.ts
|   |   +-- Services.ts
|   |   +-- Articles.ts
|   |   +-- Vacancies.ts
|   |   +-- Taxonomies/
|   |       +-- Brands.ts
|   |       +-- ProductCategories.ts
|   |       +-- Industries.ts
|   |
|   +-- globals/                # Payload globals
|   |   +-- Homepage.ts
|   |   +-- AboutPage.ts
|   |   +-- ContactPage.ts
|   |
|   +-- access/                 # Access control
|   +-- utils/                  # Utilities
|   +-- payload.config.ts       # Main configuration
|
+-- package.json
```

### apps/backend

```
apps/backend/
|
+-- src/
|   +-- ai/                     # AI module
|   |   +-- providers/          # AI providers (DeepSeek, OpenAI)
|   |   +-- services/           # Generation services
|   |   +-- dto/                # Data transfer objects
|   |   +-- ai.module.ts
|   |   +-- ai.controller.ts
|   |   +-- ai.service.ts
|   |
|   +-- automation/             # Scheduled tasks
|   |   +-- scheduler.service.ts
|   |   +-- automation.module.ts
|   |
|   +-- queue/                  # Background jobs
|   |   +-- processors/
|   |   +-- queue.module.ts
|   |
|   +-- payload/                # CMS integration
|   |   +-- payload.service.ts
|   |   +-- payload.module.ts
|   |
|   +-- common/                 # Shared utilities
|   +-- config/                 # Configuration
|   +-- app.module.ts           # Root module
|   +-- main.ts                 # Entry point
|
+-- package.json
+-- nest-cli.json
+-- tsconfig.json
```

---

## Packages

### packages/shared-types

Shared TypeScript definitions used across applications.

```
packages/shared-types/
|
+-- src/
|   +-- index.ts                # All type exports
|
+-- package.json
+-- tsconfig.json
```

**Exported Types:**

| Category | Types |
|----------|-------|
| Taxonomies | Brand, ProductCategory, Industry |
| Content | Product, Project, Service, Article, Vacancy |
| Globals | Homepage, AboutPage, ContactPage |
| API | PaginatedResponse, APIResponse |
| Users | User, UserRole |

---

## Configuration Files

### turbo.json

Defines task pipelines for Turborepo.

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {}
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## Workspace Commands

| Command | Description |
|---------|-------------|
| pnpm dev | Run all apps in development |
| pnpm dev:web | Run web frontend only |
| pnpm dev:cms | Run CMS only |
| pnpm dev:backend | Run backend only |
| pnpm build | Build all apps |
| pnpm lint | Lint all packages |
| pnpm clean | Clean all build artifacts |

---

## Dependencies Graph

```
@tte/web
    |
    +-- @tte/shared-types
    +-- next
    +-- react
    +-- tailwindcss

@tte/cms
    |
    +-- @tte/shared-types
    +-- payload
    +-- @payloadcms/db-postgres
    +-- @payloadcms/richtext-lexical

@tte/backend
    |
    +-- @tte/shared-types
    +-- @nestjs/core
    +-- @nestjs/bull
    +-- openai
```
