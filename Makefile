# ============================================
# TTE Monorepo - Makefile
# Usage: make <command>
# ============================================

.PHONY: help install dev dev-web dev-cms dev-backend build start stop logs clean db-up db-down db-migrate db-reset deploy ssl-setup

# Default target
help:
	@echo ""
	@echo "TTE Monorepo Commands"
	@echo "====================="
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start all apps in development"
	@echo "  make dev-web      - Start web frontend only (port 4000)"
	@echo "  make dev-cms      - Start CMS only (port 4001)"
	@echo "  make dev-backend  - Start backend only (port 4002)"
	@echo ""
	@echo "Database:"
	@echo "  make db-up        - Start PostgreSQL and Redis containers"
	@echo "  make db-down      - Stop database containers"
	@echo "  make db-logs      - Show database container logs"
	@echo "  make db-migrate   - Run database migrations"
	@echo "  make db-reset     - Reset database (WARNING: deletes all data)"
	@echo ""
	@echo "Building:"
	@echo "  make build        - Build all apps"
	@echo "  make build-web    - Build web frontend"
	@echo "  make build-cms    - Build CMS"
	@echo "  make build-backend - Build backend"
	@echo ""
	@echo "Production:"
	@echo "  make prod-up      - Start production containers"
	@echo "  make prod-down    - Stop production containers"
	@echo "  make prod-logs    - Show production logs"
	@echo "  make deploy       - Run deployment script"
	@echo "  make ssl-setup    - Setup SSL certificates"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean        - Clean all build artifacts"
	@echo "  make lint         - Run linting"
	@echo "  make typecheck    - Run type checking"
	@echo "  make kill-ports   - Kill processes on ports 4000-4002"
	@echo ""

# ============================================
# Installation
# ============================================

install:
	pnpm install

# ============================================
# Development
# ============================================

dev:
	pnpm dev

dev-web:
	pnpm dev:web

dev-cms:
	pnpm dev:cms

dev-backend:
	pnpm dev:backend

# ============================================
# Database
# ============================================

db-up:
	docker compose -f docker-compose.dev.yml up -d

db-down:
	docker compose -f docker-compose.dev.yml down

db-logs:
	docker compose -f docker-compose.dev.yml logs -f

db-migrate:
	pnpm db:migrate

db-reset:
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose -f docker-compose.dev.yml down -v
	docker compose -f docker-compose.dev.yml up -d
	@echo "Waiting for database to be ready..."
	@sleep 5
	pnpm db:migrate

# ============================================
# Building
# ============================================

build:
	pnpm build

build-web:
	pnpm build:web

build-cms:
	pnpm build:cms

build-backend:
	pnpm build:backend

# ============================================
# Production
# ============================================

prod-up:
	docker compose -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

prod-restart:
	docker compose -f docker-compose.prod.yml restart

deploy:
	./scripts/deploy.sh

ssl-setup:
	sudo ./scripts/ssl-setup.sh

# ============================================
# Utilities
# ============================================

clean:
	pnpm clean
	rm -rf apps/web/.next
	rm -rf apps/cms/.next
	rm -rf apps/backend/dist

lint:
	pnpm lint

typecheck:
	pnpm typecheck

kill-ports:
	@echo "Killing processes on ports 4000, 4001, 4002..."
	-lsof -ti:4000,4001,4002 | xargs kill -9 2>/dev/null || true
	@echo "Done"

# ============================================
# Quick Start
# ============================================

setup: install db-up
	@echo ""
	@echo "Setup complete! Run 'make dev' to start development."
	@echo ""

# ============================================
# Shortcuts
# ============================================

i: install
d: dev
w: dev-web
c: dev-cms
b: dev-backend
l: logs
k: kill-ports
