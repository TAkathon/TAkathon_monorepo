#!/bin/sh
set -e

echo "[entrypoint] Waiting for database to be ready..."

# Apply pending migrations (safe, never drops data)
# Never use 'prisma db push --accept-data-loss' — that flag can silently delete
# production data. We always go through proper migration files.
echo "[entrypoint] Running prisma migrate deploy..."
npx -y prisma@7 migrate deploy 2>&1

echo "[entrypoint] Starting Core Gateway..."
exec node dist/core-gateway/index.js
