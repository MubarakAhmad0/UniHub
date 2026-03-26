FROM node:22-alpine AS base

# Set timezone to Asia/Singapore
RUN apk add --no-cache tzdata
ENV TZ=Asia/Singapore

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

# Cache pnpm store between builds
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry configuration
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_ENVIRONMENT=dev
ENV APP_ENV="staging"
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Mount secrets securely during build
RUN --mount=type=secret,id=bt_aws_access_key \
    --mount=type=secret,id=bt_aws_secret_key \
    --mount=type=secret,id=google_maps_key \
    export BT_AWS_ACCESS_KEY=$(cat /run/secrets/bt_aws_access_key) && \
    export BT_AWS_SECRET_KEY=$(cat /run/secrets/bt_aws_secret_key) && \
    export NEXT_PUBLIC_GOOGLE_MAPS_PLACES_KEY=$(cat /run/secrets/google_maps_key) && \
    pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
