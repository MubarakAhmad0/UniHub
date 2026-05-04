# Lesson 4: Dockerfile Verification

In this lesson, we'll verify your Dockerfile is compatible with Render's build environment. Good news - your Dockerfile is already well-configured for production!

---

## Understanding Your Dockerfile

Let's analyze the Dockerfile line by line:

```dockerfile
# Stage 1: Base image with timezone
FROM node:22-alpine AS base
RUN apk add --no-cache tzdata
ENV TZ=Asia/Singapore

# Stage 2: Dependencies (optimized for caching)
FROM base AS deps
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# Stage 3: Build the application
FROM base AS builder
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_ENVIRONMENT=dev
ENV APP_ENV="staging"
ENV NODE_OPTIONS="--max_old_space_size=4096"
RUN pnpm run build

# Stage 4: Production runner
FROM base AS runner
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Why This Works on Render

### Multi-Stage Build Benefits

| Stage | Benefit |
|-------|---------|
| **Base** | Sets timezone to Asia/Singapore |
| **Deps** | Installs only dependencies - cached between builds |
| **Builder** | Compiles Next.js with all optimizations |
| **Runner** | Minimal final image with only runtime files |

### Key Configurations for Render

| Setting | Value | Why |
|---------|-------|-----|
| **Node.js version** | 22 | Latest LTS - supported by Render |
| **Output** | `standalone` | Next.js produces minimal deployable app |
| **Package manager** | pnpm | Fast, efficient, used by UniHub |
| **User** | `nextjs` (non-root) | Security best practice |
| **Start command** | `node server.js` | Runs the standalone output |

---

## Step 1: Verify Dependencies

Your `package.json` should have these key dependencies:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

**Check**: Ensure `pnpm run build` works locally before deploying.

---

## Step 2: Verify Next.js Config

Your `next.config.mjs` should have:

```javascript
{
  output: "standalone",
  // This produces a minimal Node.js server
}
```

This is already set up in your config (line 17).

---

## Step 3: Test Build Locally

Before deploying to Render, verify the build works locally:

```bash
# In your local project directory
pnpm run build
```

You should see:
```
✓ Collected 8476 modules.
✓ Compiled successfully.
✓ Build completed in 45.2s
```

The output should include a `standalone/` directory with `server.js`.

---

## Step 4: Configure Build Command in Render

In your Render dashboard, the Build Command should be:

```
pnpm install && pnpm run build
```

Or simplified (since dependencies are pre-installed in Dockerfile):

```
pnpm run build
```

---

## Step 5: Configure Start Command

The Start Command should be:

```
node server.js
```

This runs the standalone Next.js server that was built in the Dockerfile.

---

## Understanding the Build Output

After `pnpm run build`, your project produces:

```
.next/
├── standalone/           ← Production server
│   ├── server.js        ← Main entry point
│   ├── static/          ← Static assets
│   └── package.json
├── static/              ← Static files for CDN
└── trace.json           ← Build traces
```

The Dockerfile copies `standalone/` to the final image, making deployment fast and efficient.

---

## Troubleshooting

### "pnpm: command not found"

**Error**: pnpm not installed in the build environment
**Solution**: The Dockerfile already installs pnpm globally with `npm install -g pnpm`. This should work.

### "Build timeout"

**Error**: Build takes too long and times out
**Solution**: Render has a 30-minute build timeout. Your build should complete in 3-5 minutes. If it takes longer, check:
- Node modules aren't being cached properly
- Too many dependencies being installed

### "Module not found" after deploy

**Error**: App starts but certain modules are missing
**Solution**: This usually means the standalone build didn't include all required files. Add to `next.config.mjs`:

```javascript
output: "standalone",
experimental: {
  outputFileTracingIncludes: {
    // Add any paths that aren't being included
    "/api/**": true,
  },
}
```

---

## What You've Learned

✅ Analyzed your multi-stage Dockerfile
✅ Understood why it works for production
✅ Verified the build configuration
✅ Know how to test locally before deploying

---

## What's Next

In **Lesson 5**, we'll deploy your application to Render - connecting everything and getting it live!

---

## Related Files

- `Dockerfile` - Multi-stage build configuration
- `next.config.mjs` - Next.js standalone output config
- `package.json` - Build scripts