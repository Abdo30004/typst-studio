# Multi-stage Dockerfile for Next.js Typst Drag & Drop Builder
FROM node:20-bookworm-slim AS base

# Install system dependencies, OpenSSL for Prisma, and fonts for Typst PDF rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    tar \
    xz-utils \
    openssl \
    fonts-liberation \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

# Download and install native Typst CLI v0.12.0
RUN curl -fsSL https://github.com/typst/typst/releases/download/v0.12.0/typst-x86_64-unknown-linux-musl.tar.xz \
    | tar -xJ --strip-components=1 -C /usr/local/bin typst-x86_64-unknown-linux-musl/typst \
    && chmod +x /usr/local/bin/typst \
    && typst --version

WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# Test stage - runs Vitest tests inside Docker
FROM deps AS test
COPY . .
ENV DATABASE_URL="file:./test.db"
RUN npx prisma generate
RUN npm test

# Builder stage
FROM test AS builder
ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/typst-builder.db"
RUN npm run build

# Production runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/data/typst-builder.db"

# Create persistent data and uploads directory
RUN mkdir -p /data /app/public/uploads

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules

# Startup script to ensure database schema is synchronized before starting Next.js
RUN printf '#!/bin/sh\n./node_modules/.bin/prisma db push --schema=/app/prisma/schema.prisma\nexec node server.js\n' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

EXPOSE 3000

CMD ["/app/entrypoint.sh"]
