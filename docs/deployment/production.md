# Production Deployment

## Overview

This guide covers deploying the TTE platform to a production VPS server using Docker Compose and Nginx.

---

## Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Storage | 40 GB SSD | 100 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

---

## Deployment Architecture

```
Internet
    |
[Cloudflare / CDN]
    |
[VPS Server]
    |
+---+---+---+---+---+---+---+---+
|                               |
|   Nginx (Port 80, 443)        |
|   SSL Termination             |
|   Reverse Proxy               |
|                               |
+---+---+---+---+---+---+---+---+
    |       |       |
    v       v       v
  :4000   :4001   :4002
   Web     CMS    Backend
    |       |       |
    +---+---+---+---+
        |       |
      :5434   :6381
    PostgreSQL Redis
```

---

## Pre-Deployment Checklist

- [ ] DNS records configured (A records for domains)
- [ ] Server provisioned with required resources
- [ ] SSH access configured
- [ ] Docker and Docker Compose installed
- [ ] Git installed
- [ ] Firewall configured (ports 80, 443 open)

---

## Step-by-Step Deployment

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install pnpm
npm install -g pnpm@9

# Install Nginx
sudo apt install nginx -y
```

### 2. Clone Repository

```bash
cd /var/www
git clone https://github.com/your-org/toanthang.git
cd toanthang
```

### 3. Configure Environment

```bash
cp .env.production.example .env
```

Edit `.env` with production values:

```bash
# Database
DB_NAME=tte_cms
DB_USER=tte_prod
DB_PASSWORD=<strong-password>

# Redis
REDIS_PASSWORD=<redis-password>

# Payload CMS
PAYLOAD_SECRET=<openssl rand -base64 32>
PAYLOAD_PUBLIC_SERVER_URL=https://cms.toanthang.vn

# Application URLs
FRONTEND_URL=https://toanthang.vn
CMS_URL=https://cms.toanthang.vn
BACKEND_URL=https://api.toanthang.vn

# AI (Optional)
DEEPSEEK_API_KEY=<key>
OPENAI_API_KEY=<key>
```

### 4. Setup SSL Certificates

```bash
sudo ./scripts/ssl-setup.sh
```

This script:
- Installs Certbot
- Obtains certificates for all domains
- Configures auto-renewal

### 5. Configure Nginx

```bash
sudo cp nginx/toanthang.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/toanthang.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Deploy Application

```bash
./scripts/deploy.sh
```

The deploy script:
- Pulls latest code
- Installs dependencies
- Builds applications
- Starts Docker containers
- Runs database migrations
- Reloads Nginx

---

## Docker Containers

After deployment, verify containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

Expected output:

| Container | Image | Status |
|-----------|-------|--------|
| tte_postgres | postgres:16-alpine | Up (healthy) |
| tte_redis | redis:7-alpine | Up (healthy) |
| tte_cms | tte/cms | Up (healthy) |
| tte_backend | tte/backend | Up (healthy) |
| tte_web | tte/web | Up (healthy) |

---

## Domain Configuration

### DNS Records

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | <server-ip> | 3600 |
| A | www | <server-ip> | 3600 |
| A | cms | <server-ip> | 3600 |
| A | api | <server-ip> | 3600 |

### SSL Certificates

Certificates are stored at:
- `/etc/letsencrypt/live/toanthang.vn/`
- `/etc/letsencrypt/live/cms.toanthang.vn/`
- `/etc/letsencrypt/live/api.toanthang.vn/`

Auto-renewal runs twice daily via Certbot timer.

---

## Backup Strategy

### Database Backup

```bash
# Manual backup
docker exec tte_postgres pg_dump -U $DB_USER $DB_NAME > backup.sql

# Restore
docker exec -i tte_postgres psql -U $DB_USER $DB_NAME < backup.sql
```

### Automated Backups

Backups are stored in `/var/www/toanthang/backups/postgres/`

Configure cron for daily backups:

```bash
0 2 * * * /var/www/toanthang/scripts/backup.sh
```

### Media Backup

If using local storage:
```bash
rsync -avz /var/www/toanthang/apps/cms/media/ /backup/media/
```

If using Cloudinary:
Media is automatically stored in cloud.

---

## Monitoring

### Health Checks

| Service | Endpoint | Expected |
|---------|----------|----------|
| Web | http://localhost:4000 | 200 OK |
| CMS | http://localhost:4001/api/health | 200 OK |
| Backend | http://localhost:4002/api/health | 200 OK |

### Docker Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f cms
```

### Nginx Logs

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Updates and Maintenance

### Deploying Updates

```bash
cd /var/www/toanthang
./scripts/deploy.sh
```

### Rollback

```bash
# Revert to previous version
git checkout <previous-commit>
./scripts/deploy.sh
```

### Scaling

Increase memory limits in `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 2G
```

---

## Security Considerations

### Firewall Rules

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### Internal Services

PostgreSQL and Redis only listen on localhost (127.0.0.1).

### Regular Updates

```bash
apt update && apt upgrade -y
docker pull postgres:16-alpine
docker pull redis:7-alpine
```
