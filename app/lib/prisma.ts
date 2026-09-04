import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

/**
 * Resolves the active database connection URI.
 * Handles local development, platform specific path normalization,
 * and Vercel Serverless environment filesystem constraints.
 */
let connectionString = process.env.DATABASE_URL || "file:./dev.db";

// In Vercel serverless environments, the root directory is read-only.
// We replicate the bundled SQLite database to the writable /tmp filesystem.
if (process.env.VERCEL) {
  const tmpDbPath = "/tmp/dev.db";
  const bundledDbPath = path.join(process.cwd(), "dev.db");

  try {
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
      }
    }
  } catch (e) {
    console.error("Vercel /tmp db copy error:", e);
  }

  connectionString = `file:${tmpDbPath}`;
} else if (process.platform !== "win32" && connectionString.includes("C:/")) {
  // Normalize Windows path overrides when running in containerized Linux
  connectionString = "file:./dev.db";
}

/**
 * Initialize Prisma BetterSqlite3 adapter with driver connection options
 */
const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

/**
 * Global singleton pattern to prevent multiple PrismaClient instances
 * during Next.js Hot Module Replacement (HMR) in development.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}