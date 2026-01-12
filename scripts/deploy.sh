#!/bin/bash
# ============================================
# TTE Monorepo - Deployment Script
# Run on VPS: ./scripts/deploy.sh
# ============================================

set -e

echo "🚀 TTE Deployment Script"
echo "========================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Copy .env.production.example to .env and configure it first."
    exit 1
fi

# Load environment
source .env

echo -e "${YELLOW}Step 1: Pulling latest code...${NC}"
git pull origin main

echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
pnpm install --frozen-lockfile

echo -e "${YELLOW}Step 3: Building applications...${NC}"
pnpm build

echo -e "${YELLOW}Step 4: Starting Docker services...${NC}"
docker compose -f docker-compose.prod.yml up -d --build

echo -e "${YELLOW}Step 5: Running database migrations...${NC}"
# Wait for database to be ready
sleep 10
docker compose -f docker-compose.prod.yml exec cms pnpm db:migrate

echo -e "${YELLOW}Step 6: Reloading Nginx...${NC}"
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Services:"
echo "  - Web:     https://toanthang.vn"
echo "  - CMS:     https://cms.toanthang.vn"
echo "  - Backend: https://api.toanthang.vn"
echo ""
echo "Check status: docker compose -f docker-compose.prod.yml ps"
