# Production Deployment & Hosting Guide

RevenueAI is optimized for zero-configuration serverless deployment on Vercel.

## Vercel Architecture Notes

### SQLite on Serverless Functions
Vercel serverless environments provide read-only file systems except for the ephemeral `/tmp` directory. In [app/lib/prisma.ts](file:///c:/Users/Ujjwal/Documents/ai-revenue-recovery/app/lib/prisma.ts), the application automatically detects `process.env.VERCEL`:
- It mirrors the bundled `dev.db` into `/tmp/dev.db` upon initial container spin-up.
- BetterSQLite3 queries run against `/tmp/dev.db` with negligible latency.

### Build Command
The repository configured build script in `package.json` executes:
```bash
prisma generate && next build
```
This ensures Prisma Client is regenerated for the targeted Vercel Linux architecture before Next.js bundles static assets.
