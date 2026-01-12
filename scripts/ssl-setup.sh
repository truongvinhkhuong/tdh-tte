#!/bin/bash
# ============================================
# TTE - SSL Certificate Setup with Let's Encrypt
# Run on VPS: sudo ./scripts/ssl-setup.sh
# ============================================

set -e

# Install certbot if not exists
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

echo "🔐 Setting up SSL certificates..."

# Main domain
certbot certonly --nginx \
    -d toanthang.vn \
    -d www.toanthang.vn \
    --non-interactive \
    --agree-tos \
    --email admin@toanthang.vn

# CMS subdomain
certbot certonly --nginx \
    -d cms.toanthang.vn \
    --non-interactive \
    --agree-tos \
    --email admin@toanthang.vn

# API subdomain (optional)
certbot certonly --nginx \
    -d api.toanthang.vn \
    --non-interactive \
    --agree-tos \
    --email admin@toanthang.vn

echo ""
echo "✅ SSL certificates installed!"
echo ""
echo "Certificates location:"
echo "  - /etc/letsencrypt/live/toanthang.vn/"
echo "  - /etc/letsencrypt/live/cms.toanthang.vn/"
echo "  - /etc/letsencrypt/live/api.toanthang.vn/"
echo ""
echo "Auto-renewal is configured. Test with: certbot renew --dry-run"
