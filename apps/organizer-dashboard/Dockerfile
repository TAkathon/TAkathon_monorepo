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
COPY apps/organizer-dashboard ./apps/organizer-dashboard

# Build the Next.js app via Nx (produces .next/standalone)
RUN npx nx build organizer-dashboard

# ===========================================================
# Stage 3: Production
# ===========================================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Copy public assets and standalone server + static assets
COPY --from=builder /app/apps/organizer-dashboard/public ./apps/organizer-dashboard/public
COPY --from=builder /app/apps/organizer-dashboard/.next/standalone ./
COPY --from=builder /app/apps/organizer-dashboard/.next/static ./apps/organizer-dashboard/.next/static

EXPOSE 3002
CMD ["node", "apps/organizer-dashboard/server.js"]
