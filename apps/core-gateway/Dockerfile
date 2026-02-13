FROM node:22-alpine

WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire monorepo
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npx nx build core-gateway

# Expose the port
EXPOSE 8000

# Start the application
CMD ["node", "dist/apps/core-gateway/main.js"]
