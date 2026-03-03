#!/bin/sh
set -e

echo "[entrypoint] Waiting for database to be ready..."

# Apply committed migration files to the database.
# 'migrate deploy' is safe for staging and production: it never resets data,
# only applies unapplied migrations in order.
# For local dev / first-time setup without migration history, run:
#   npx prisma migrate dev --name init
# to generate the initial migration, then commit it before deploying.
echo "[entrypoint] Running prisma migrate deploy..."
# If the DB schema already exists but has no migration history (e.g. was
# bootstrapped via 'prisma db push'), baseline the initial migration so that
# 'migrate deploy' does not fail with P3005.
npx -y prisma@7 migrate resolve --applied "0_init" 2>&1 || true
npx -y prisma@7 migrate deploy 2>&1

echo "[entrypoint] Starting Core Gateway..."
exec node dist/core-gateway/index.js
