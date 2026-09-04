import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

let connectionString = process.env.DATABASE_URL || "file:./dev.db";

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
  connectionString = "file:./dev.db";
}

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}