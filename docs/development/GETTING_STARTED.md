# Getting Started

## Prerequisites

Before setting up the project, ensure you have the following installed:

| Software | Version | Check Command |
|----------|---------|---------------|
| Node.js | 20.x or higher | `node --version` |
| pnpm | 9.15 or higher | `pnpm --version` |
| Docker | 24.x or higher | `docker --version` |
| Docker Compose | 2.x or higher | `docker compose version` |

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/toanthang.git
cd toanthang
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Database Services

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:
- PostgreSQL on port 5434
- Redis on port 6381

### 4. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/tte_cms

# Payload CMS
PAYLOAD_SECRET=<generate-with-openssl-rand-base64-32>
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:4001

# Optional: AI Providers
DEEPSEEK_API_KEY=<your-key>
OPENAI_API_KEY=<your-key>
```

### 5. Start Development Servers

**Option A: Start all services:**

```bash
pnpm dev
```

**Option B: Start individually:**

```bash
# Terminal 1: CMS
pnpm dev:cms

# Terminal 2: Backend
pnpm dev:backend

# Terminal 3: Web
pnpm dev:web
```

### 6. Access Applications

| Application | URL |
|-------------|-----|
| Website | http://localhost:4000 |
| CMS Admin | http://localhost:4001/admin |
| Backend API | http://localhost:4002/api |

### 7. Create Admin User

1. Open http://localhost:4001/admin
2. Create your first admin account
3. Log in to access the CMS

---

## Project Commands

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:web` | Start web frontend only |
| `pnpm dev:cms` | Start CMS only |
| `pnpm dev:backend` | Start backend only |

### Building

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all apps |
| `pnpm build:web` | Build web frontend |
| `pnpm build:cms` | Build CMS |
| `pnpm build:backend` | Build backend |

### Database

| Command | Description |
|---------|-------------|
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:migrate:create` | Create new migration |

### Code Quality

| Command | Description |
|---------|-------------|
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type check all packages |

### Docker

| Command | Description |
|---------|-------------|
| `pnpm docker:dev` | Start development containers |
| `pnpm docker:prod` | Start production containers |

### Clean

| Command | Description |
|---------|-------------|
| `pnpm clean` | Clean all build artifacts and node_modules |

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://... |
| PAYLOAD_SECRET | CMS encryption key | 32+ character string |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| PAYLOAD_PUBLIC_SERVER_URL | CMS public URL | http://localhost:4001 |
| FRONTEND_URL | Web frontend URL | http://localhost:4000 |
| DEEPSEEK_API_KEY | DeepSeek API key | - |
| OPENAI_API_KEY | OpenAI API key | - |

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -ti:4000

# Kill process
lsof -ti:4000 | xargs kill -9
```

### Database Connection Failed

1. Ensure Docker containers are running:
   ```bash
   docker compose -f docker-compose.dev.yml ps
   ```

2. Check DATABASE_URL in .env.local

3. Restart containers:
   ```bash
   docker compose -f docker-compose.dev.yml down
   docker compose -f docker-compose.dev.yml up -d
   ```

### CMS Admin Not Loading

1. Clear Next.js cache:
   ```bash
   cd apps/cms && rm -rf .next
   ```

2. Regenerate types:
   ```bash
   cd apps/cms && pnpm generate:types
   ```

3. Restart CMS:
   ```bash
   pnpm dev:cms
   ```

### Missing Translations

Ensure locale is specified in API calls:
```
GET /api/products?locale=vi
```
