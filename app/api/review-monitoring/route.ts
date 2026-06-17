import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { getReviewMonitoringSnapshot, reviewMonitoringDefaultAsOf } from "@/lib/review-monitoring-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReviewMonitoringPrismaGlobal = typeof globalThis & {
  alphaVestReviewMonitoringPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as ReviewMonitoringPrismaGlobal;
  globalForPrisma.alphaVestReviewMonitoringPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestReviewMonitoringPrisma;
}

function parseAsOf(request: Request) {
  const value = new URL(request.url).searchParams.get("asOf");
  if (!value) return reviewMonitoringDefaultAsOf;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? reviewMonitoringDefaultAsOf : parsed;
}

export async function GET(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is required for review monitoring snapshots." },
      { status: 503 },
    );
  }

  const snapshot = await getReviewMonitoringSnapshot(prisma, parseAsOf(request));
  return NextResponse.json(snapshot);
}

