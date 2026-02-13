FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build student-portal

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist/apps/student-portal/public ./public
COPY --from=builder /app/dist/apps/student-portal/.next/standalone ./
COPY --from=builder /app/dist/apps/student-portal/.next/static ./.next/static
EXPOSE 3001
CMD ["node", "server.js"]
