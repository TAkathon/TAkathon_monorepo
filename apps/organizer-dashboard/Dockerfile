FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build organizer-dashboard

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist/apps/organizer-dashboard/public ./public
COPY --from=builder /app/dist/apps/organizer-dashboard/.next/standalone ./
COPY --from=builder /app/dist/apps/organizer-dashboard/.next/static ./.next/static
EXPOSE 3002
CMD ["node", "server.js"]
