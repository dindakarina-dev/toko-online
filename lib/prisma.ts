import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (process.env.VERCEL && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const enginePath = path.join(
    process.cwd(),
    "lib/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node"
  );
  if (fs.existsSync(enginePath)) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
  }
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}