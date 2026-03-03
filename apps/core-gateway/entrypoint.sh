#!/bin/sh
set -e

echo "[entrypoint] Waiting for database to be ready..."

# Sync the database schema with prisma/schema.prisma.
# 'db push' is idempotent: if the schema already matches, it's a no-op.
# In production, replace this with 'prisma migrate deploy' after
# baselining (see: https://pris.ly/d/migrate-baseline).
echo "[entrypoint] Running prisma db push..."
npx -y prisma@7 db push 2>&1

echo "[entrypoint] Starting Core Gateway..."
exec node dist/core-gateway/index.js
