# ============================================
# TTE Monorepo - Makefile
# Usage: make <command>
# ============================================

.PHONY: help install dev dev-web dev-cms dev-backend dev-logs tail-web tail-cms tail-backend tail-ai clear-logs build start stop logs clean db-up db-down db-migrate db-reset deploy ssl-setup logs-web logs-cms logs-backend logs-ai logs-all status

# Default target
help:
	@echo ""
	@echo "TTE Monorepo Commands"
	@echo "====================="
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev (d)      - Start all apps in development"
	@echo "  make dev-web      - Start web frontend only (port 4000)"
	@echo "  make dev-cms      - Start CMS only (port 4001)"
	@echo "  make dev-backend  - Start backend only (port 4002)"
	@echo "  make dev-ai       - Start AI engine only (port 4003)"
	@echo "  make dev-logs     - Start all with separate log files"
	@echo ""
	@echo "Tail Logs (after dev-logs):"
	@echo "  make tail-web (tw)     - Tail web logs"
	@echo "  make tail-cms (tc)     - Tail CMS logs"
	@echo "  make tail-backend (tb) - Tail backend logs"
	@echo "  make tail-ai (ta)      - Tail AI engine logs"
	@echo "  make clear-logs        - Clear all log files"
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
	@echo "Logs (Development):"
	@echo "  make logs-web     - Show web frontend logs (port 4000)"
	@echo "  make logs-cms     - Show CMS logs (port 4001)"
	@echo "  make logs-backend - Show backend logs (port 4002)"
	@echo "  make logs-ai      - Show AI engine logs"
	@echo "  make logs-all     - Show all dev logs (tmux split)"
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

dev-ai:
	pnpm dev:ai

# Dev with separate log files (easier to tail)
LOGS_DIR := .logs
dev-logs:
	@mkdir -p $(LOGS_DIR)
	@echo "Starting all services with logs in $(LOGS_DIR)/"
	@echo "Use 'make tail-web', 'make tail-cms', 'make tail-backend' to view logs"
	@(pnpm --filter @tte/web dev 2>&1 | tee $(LOGS_DIR)/web.log) & \
	 (pnpm --filter @tte/cms dev 2>&1 | tee $(LOGS_DIR)/cms.log) & \
	 (pnpm --filter @tte/backend dev 2>&1 | tee $(LOGS_DIR)/backend.log) & \
	 (pnpm --filter @tte/ai-engine dev 2>&1 | tee $(LOGS_DIR)/ai-engine.log) & \
	 wait

# Tail individual log files
tail-web:
	@tail -f .logs/web.log 2>/dev/null || echo "No logs yet. Run 'make dev-logs' first."

tail-cms:
	@tail -f .logs/cms.log 2>/dev/null || echo "No logs yet. Run 'make dev-logs' first."

tail-backend:
	@tail -f .logs/backend.log 2>/dev/null || echo "No logs yet. Run 'make dev-logs' first."

tail-ai:
	@tail -f .logs/ai-engine.log 2>/dev/null || echo "No logs yet. Start AI engine with logging."

# Clear log files
clear-logs:
	@rm -rf $(LOGS_DIR)/*.log 2>/dev/null || true
	@echo "Logs cleared"

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
a: dev-ai
l: logs
k: kill-ports

# Log shortcuts
lw: logs-web
lc: logs-cms
lb: logs-backend
la: logs-ai

# Tail shortcuts
tw: tail-web
tc: tail-cms
tb: tail-backend
ta: tail-ai

# ============================================
# Development Logs (Check status of running services)
# ============================================

# Show status and process info for each service
logs-web:
	@echo "=== Web Frontend (port 4000) ==="
	@lsof -i:4000 2>/dev/null || echo "Not running"
	@echo ""
	@echo "Tip: Logs are shown in the terminal running 'make d'"

logs-cms:
	@echo "=== CMS (port 4001) ==="
	@lsof -i:4001 2>/dev/null || echo "Not running"
	@echo ""
	@echo "Tip: Logs are shown in the terminal running 'make d'"

logs-backend:
	@echo "=== Backend (port 4002) ==="
	@lsof -i:4002 2>/dev/null || echo "Not running"
	@echo ""
	@echo "Tip: Logs are shown in the terminal running 'make d'"

logs-ai:
	@echo "=== AI Engine (port 4003) ==="
	@lsof -i:4003 2>/dev/null || echo "Not running"
	@echo ""
	@if [ -d "apps/ai-engine/logs" ]; then \
		echo "Recent logs:"; \
		tail -50 apps/ai-engine/logs/*.log 2>/dev/null || echo "No log files yet"; \
	else \
		echo "Tip: Logs are shown in the terminal running AI engine"; \
	fi

logs-all:
	@echo "=== Development Services Status ==="
	@echo ""
	@echo "Web (4000):     $$(lsof -i:4000 -t 2>/dev/null && echo 'Running' || echo 'Not running')"
	@echo "CMS (4001):     $$(lsof -i:4001 -t 2>/dev/null && echo 'Running' || echo 'Not running')"
	@echo "Backend (4002): $$(lsof -i:4002 -t 2>/dev/null && echo 'Running' || echo 'Not running')"
	@echo "AI Engine (4003): $$(lsof -i:4003 -t 2>/dev/null && echo 'Running' || echo 'Not running')"
	@echo ""
	@echo "Database containers:"
	@docker compose -f docker-compose.dev.yml ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null || echo "Docker not running"

# Quick status check
status: logs-all
