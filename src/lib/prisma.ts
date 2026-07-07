import { PrismaClient } from "@prisma/client";

// Standard Next.js singleton pattern. Without this, hot-reload in `next dev`
// creates a new PrismaClient (and a new DB connection pool) on every file
// save, which quickly exhausts Postgres connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
