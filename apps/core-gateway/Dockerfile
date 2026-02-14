# ===========================================================
# Stage 1: Install dependencies
# ===========================================================
FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ===========================================================
# Stage 2: Build
# ===========================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Re-use cached node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./

# Copy only what's needed for the build
COPY tsconfig.base.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY libs ./libs
COPY apps/core-gateway ./apps/core-gateway

# Generate Prisma Client (linux-musl engine for Alpine)
RUN npx prisma generate

# Bundle with esbuild — resolves all @takathon/* path aliases at build time
RUN npx esbuild apps/core-gateway/src/index.ts \
    --bundle \
    --platform=node \
    --target=node22 \
    --outfile=dist/core-gateway/index.js \
    --external:@prisma/client \
    --external:@prisma/adapter-pg \
    --external:pg

# ===========================================================
# Stage 3: Production
# ===========================================================
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install production deps only (no devDependencies, skip lifecycle scripts)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy generated Prisma Client from builder (engine binary + generated types)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy Prisma schema + config (needed for db push / migrate deploy at startup)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Copy bundled application
COPY --from=builder /app/dist/core-gateway/index.js ./dist/core-gateway/index.js

# Copy entrypoint script
COPY apps/core-gateway/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
