import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  isReviewMonitoringWorkflowAction,
  runReviewMonitoringWorkflowAction,
} from "@/lib/review-monitoring-workflow-actions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReviewMonitoringActionsPrismaGlobal = typeof globalThis & {
  alphaVestReviewMonitoringActionsPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as ReviewMonitoringActionsPrismaGlobal;
  globalForPrisma.alphaVestReviewMonitoringActionsPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestReviewMonitoringActionsPrisma;
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for review monitoring actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => undefined)) as { actionId?: unknown } | undefined;
  if (!body || !isReviewMonitoringWorkflowAction(body.actionId)) {
    return failClosedJson(
      {
        canonicalApiRoute: "/api/review-monitoring/actions",
        error: "Review monitoring actions only support J16/J17 monitoring commands.",
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const result = await runReviewMonitoringWorkflowAction(prisma, body.actionId);
  return NextResponse.json({
    actionId: body.actionId,
    noClientRelease: true,
    ok: true,
    result,
  });
}
