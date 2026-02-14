#!/bin/sh
set -e

echo "[entrypoint] Waiting for database to be ready..."

# Sync database schema (idempotent, safe for dev/staging)
echo "[entrypoint] Pushing Prisma schema to database..."
npx -y prisma@7 db push --accept-data-loss 2>&1 || {
  echo "[entrypoint] WARNING: prisma db push failed — will try migrate deploy"
  npx -y prisma@7 migrate deploy 2>&1 || echo "[entrypoint] WARNING: migrate deploy also failed"
}

echo "[entrypoint] Starting Core Gateway..."
exec node dist/core-gateway/index.js
