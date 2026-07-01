import { PrismaPg } from "@prisma/adapter-pg";
import { ObjectType, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  isReviewMonitoringWorkflowAction,
  ReviewMonitoringWorkflowTargetError,
  runReviewMonitoringWorkflowAction,
} from "@/lib/review-monitoring-workflow-actions";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";

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

  const body = (await request.json().catch(() => undefined)) as {
    actionId?: unknown;
    targetId?: unknown;
    targetType?: unknown;
  } | undefined;
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

  const targetType = body.targetType === ObjectType.REVIEW_SCHEDULE || body.targetType === ObjectType.TRIGGER
    ? body.targetType
    : undefined;
  if (body.targetType !== undefined && !targetType) {
    return failClosedJson(
      {
        canonicalApiRoute: "/api/review-monitoring/actions",
        error: "Review monitoring target type is not supported.",
        noAdviceExecution: true,
        noClientRelease: true,
        reasonCode: "INVALID_REQUEST",
        targetReasonCode: "INVALID_TARGET_TYPE",
      },
      { status: 400 },
    );
  }

  const targetId = typeof body.targetId === "string" && body.targetId.trim() ? body.targetId.trim() : undefined;
  let result;
  try {
    result = await runReviewMonitoringWorkflowAction(prisma, body.actionId, { targetId, targetType });
  } catch (error) {
    if (error instanceof ReviewMonitoringWorkflowTargetError) {
      return failClosedJson(
        {
          canonicalApiRoute: "/api/review-monitoring/actions",
          error: error.message,
          noAdviceExecution: true,
          noClientRelease: true,
          reasonCode: "INVALID_REQUEST",
          targetReasonCode: error.reasonCode,
        },
        { status: error.reasonCode === "TARGET_NOT_FOUND" ? 404 : 400 },
      );
    }

    throw error;
  }
  const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, `review-monitoring:${body.actionId}`);
  return NextResponse.json({
    actionId: body.actionId,
    clientVisible: false,
    noAdviceExecution: true,
    noClientRelease: true,
    ok: true,
    result,
    searchIndex,
  });
}
