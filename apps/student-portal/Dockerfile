FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build student-portal

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/student-portal/public ./apps/student-portal/public
COPY --from=builder /app/apps/student-portal/.next/standalone ./
COPY --from=builder /app/apps/student-portal/.next/static ./apps/student-portal/.next/static
EXPOSE 3001
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/student-portal/server.js"]
