import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7: connection URL is passed via adapter, not via schema datasource block
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("[prisma] DATABASE_URL environment variable is not set!");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });

// Global singleton to prevent multiple PrismaClient instances in dev (hot-reload)
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
