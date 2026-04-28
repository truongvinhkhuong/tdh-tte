# Backend Dockerfile (NestJS)
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN pnpm install --frozen-lockfile

# Build shared-types
FROM base AS shared-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared-types ./packages/shared-types
RUN cd packages/shared-types && npm run build

# Build Backend
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY apps/backend ./apps/backend
COPY packages/shared-types/package.json ./packages/shared-types/

WORKDIR /app/apps/backend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./

USER nestjs

EXPOSE 4002

CMD ["node", "dist/main.js"]
