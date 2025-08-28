import { PrismaClient } from "../app/models/client";
import { env } from "../env";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
