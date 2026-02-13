FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build landing-page

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN npm install sharp
COPY --from=builder /app/apps/landing-page/public ./apps/landing-page/public
COPY --from=builder /app/apps/landing-page/.next/standalone ./
COPY --from=builder /app/apps/landing-page/.next/static ./apps/landing-page/.next/static
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/landing-page/server.js"]
