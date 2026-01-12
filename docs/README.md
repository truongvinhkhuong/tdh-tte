# TTE Monorepo - Technical Documentation

## Overview

This documentation covers the technical implementation of the TTE (Toan Thang Engineering) monorepo, a comprehensive content management and AI-powered backend system for an industrial equipment company.

---

## Table of Contents

### Architecture
- [System Architecture](./architecture/SYSTEM_ARCHITECTURE.md)
- [Monorepo Structure](./architecture/MONOREPO_STRUCTURE.md)
- [Data Flow](./architecture/DATA_FLOW.md)

### API Documentation
- [CMS API Reference](./api/CMS_API.md)
- [Backend API Reference](./api/BACKEND_API.md)
- [Authentication](./api/AUTHENTICATION.md)

### Database
- [Database Schema](./database/SCHEMA.md)
- [Collections Reference](./database/COLLECTIONS.md)
- [Migrations](./database/MIGRATIONS.md)

### Deployment
- [Environment Setup](./deployment/ENVIRONMENT.md)
- [Docker Configuration](./deployment/DOCKER.md)
- [Production Deployment](./deployment/PRODUCTION.md)

### Development
- [Getting Started](./development/GETTING_STARTED.md)
- [Development Workflow](./development/WORKFLOW.md)
- [Code Standards](./development/CODE_STANDARDS.md)

---

## Quick Reference

| Service | Development | Production |
|---------|-------------|------------|
| Web (Next.js) | localhost:4000 | toanthang.vn |
| CMS (Payload) | localhost:4001 | cms.toanthang.vn |
| Backend (NestJS) | localhost:4002 | api.toanthang.vn |
| PostgreSQL | localhost:5434 | Internal |
| Redis | localhost:6381 | Internal |

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 16.0.0 |
| CMS | Payload CMS | 3.70.0 |
| Backend | NestJS | 10.4.x |
| Database | PostgreSQL | 16 |
| Cache | Redis | 7 |
| Build | Turborepo | 2.5+ |
| Package Manager | pnpm | 9.15+ |

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-01-12 | Initial monorepo setup with Payload CMS, NestJS backend |
