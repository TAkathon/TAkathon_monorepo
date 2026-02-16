# ===========================================================
# Stage 1: Install dependencies
# ===========================================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ===========================================================
# Stage 2: Build
# ===========================================================
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NX_DAEMON=false
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY nx.json ./
COPY libs ./libs
COPY apps/landing-page ./apps/landing-page

# Build the Next.js app via Nx (produces .next/standalone)
RUN npx nx build landing-page

# ===========================================================
# Stage 3: Production
# ===========================================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# sharp for image optimization
RUN npm install --no-save sharp 2>/dev/null || true

# Copy public assets (if any)
COPY --from=builder /app/apps/landing-page/public ./apps/landing-page/public

# Copy standalone server + static assets
COPY --from=builder /app/apps/landing-page/.next/standalone ./
COPY --from=builder /app/apps/landing-page/.next/static ./apps/landing-page/.next/static

EXPOSE 3000
CMD ["node", "apps/landing-page/server.js"]
