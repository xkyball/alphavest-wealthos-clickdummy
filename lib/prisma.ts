import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

type AlphaVestPrismaGlobal = typeof globalThis & {
  alphaVestPrisma?: PrismaClient;
};

export function prismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for AlphaVest persistence.");
  }

  const globalForPrisma = globalThis as AlphaVestPrismaGlobal;
  globalForPrisma.alphaVestPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestPrisma;
}
