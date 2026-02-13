FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build sponsor-panel

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/sponsor-panel/public ./apps/sponsor-panel/public
COPY --from=builder /app/apps/sponsor-panel/.next/standalone ./
COPY --from=builder /app/apps/sponsor-panel/.next/static ./apps/sponsor-panel/.next/static
EXPOSE 3003
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/sponsor-panel/server.js"]
