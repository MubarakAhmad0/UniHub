# UniHub Deployment Guide

A complete step-by-step guide to deploying UniHub to production using **Render**.

---

## Overview

This guide teaches you how to deploy a production-ready Next.js application with:
- PostgreSQL database
- Automated CI/CD with GitHub Actions
- Custom domain with HTTPS
- Monitoring and health checks

---

## Lessons

| Lesson | Topic | Description |
|--------|-------|-------------|
| **01** | [Render Account Setup](./01-render-account.md) | Sign up, connect GitHub, create web service |
| **02** | [PostgreSQL Setup](./02-postgresql-setup.md) | Create managed database, get connection string |
| **03** | [Environment Variables](./03-environment-variables.md) | Complete reference for all env vars needed |
| **04** | [Dockerfile Verification](./04-dockerfile-verification.md) | Verify Dockerfile works for production |
| **05** | [Deploying to Render](./05-deploying-to-render.md) | Connect everything and deploy |
| **06** | [Domain & HTTPS](./06-domain-https.md) | Set up custom domain with automatic SSL |
| **07** | [GitHub Actions CI/CD](./07-github-actions-ci-cd.md) | Automate lint, typecheck, and deploy |
| **08** | [Health Checks & Monitoring](./08-health-checks.md) | Monitor app health and debug issues |
| **09** | [Go-Live Checklist](./09-go-live-checklist.md) | Final verification before launch |

---

## Quick Start

1. Create a [Render](https://render.com) account
2. Create a PostgreSQL database
3. Add all environment variables
4. Connect your GitHub repo
5. Deploy!

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Your Production Setup            │
│                                                      │
│   GitHub ──push──▶ GitHub Actions ──trigger──▶     │
│                          │                          │
│                          ▼                          │
│                    Render                           │
│                    ┌──────────┐                    │
│                    │ Web      │                    │
│                    │ Service  │◀── Unihub App     │
│                    └────┬─────┘                    │
│                         │                           │
│                    ┌────┴─────┐                    │
│                    │ PostgreSQL│                   │
│                    └──────────┘                    │
│                         │                           │
│                    ┌────┴─────┐                    │
│                    │ Custom   │                    │
│                    │ Domain   │                    │
│                    └──────────┘                    │
└─────────────────────────────────────────────────────┘
```

---

## Prerequisites

- GitHub account
- Domain name (optional but recommended)
- Basic understanding of terminal/command line

---

## Cost

| Service | Free Tier | Paid Tier |
|---------|-----------|------------|
| Render Web Service | 750 hrs/month | $7+/month |
| Render PostgreSQL | 256MB RAM | $7+/month |
| Custom Domain | ~$10/year | ~$10/year |
| **Total** | **$0-10/mo** | **$15-25/mo** |

---

## Troubleshooting

If you encounter issues:

1. Check **Lesson-specific troubleshooting** sections
2. View **Render logs** in your dashboard
3. Verify **environment variables** are set correctly
4. Check **GitHub Actions** for CI/CD issues

---

## Related Docs

- [Routes Documentation](../routes.md)
- [Database Schema](../database.md)
- [Authentication Guide](../lib.md)