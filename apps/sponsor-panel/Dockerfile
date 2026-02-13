FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build sponsor-panel

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist/apps/sponsor-panel/public ./public
COPY --from=builder /app/dist/apps/sponsor-panel/.next/standalone ./
COPY --from=builder /app/dist/apps/sponsor-panel/.next/static ./.next/static
EXPOSE 3003
CMD ["node", "server.js"]
