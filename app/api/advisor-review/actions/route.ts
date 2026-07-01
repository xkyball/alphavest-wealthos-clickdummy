import { PrismaPg } from "@prisma/adapter-pg";
import { ObjectType, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  advisorReviewCanonicalApiRoute,
  advisorReviewCommandForAction,
  AdvisorReviewWorkflowActionError,
  isAdvisorReviewWorkflowAction,
  runAdvisorReviewWorkflowAction,
  type AdvisorReviewCommandTargetType,
} from "@/lib/advisor-review-workflow-actions";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { AuditPersistenceUnavailableError } from "@/lib/typed-workflow-command-bus";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AdvisorReviewActionsPrismaGlobal = typeof globalThis & {
  alphaVestAdvisorReviewActionsPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as AdvisorReviewActionsPrismaGlobal;
  globalForPrisma.alphaVestAdvisorReviewActionsPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestAdvisorReviewActionsPrisma;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isAdvisorReviewTargetType(value: unknown): value is AdvisorReviewCommandTargetType {
  return value === ObjectType.TRIGGER || value === ObjectType.RECOMMENDATION;
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for advisor-review actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => undefined)) as
      | { actionId?: unknown; targetId?: unknown; targetType?: unknown }
    | undefined;
  if (
    !body ||
    !isAdvisorReviewWorkflowAction(body.actionId) ||
    typeof body.targetId !== "string" ||
    !uuidPattern.test(body.targetId) ||
    !isAdvisorReviewTargetType(body.targetType)
  ) {
    return failClosedJson(
      {
        canonicalApiRoute: advisorReviewCanonicalApiRoute,
        error: "Advisor-review actions require a supported J01 command, UUID targetId and supported targetType.",
        reasonCode: "INVALID_REQUEST",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: false,
        },
      },
      { status: 400 },
    );
  }

  try {
    const outcome = await runAdvisorReviewWorkflowAction(prisma, {
      actionId: body.actionId,
      targetId: body.targetId,
      targetType: body.targetType,
    });
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(
      prisma,
      `advisor-review:${body.actionId}:${body.targetId}`,
    );

    return NextResponse.json({
      actionId: body.actionId,
      canonicalApiRoute: advisorReviewCanonicalApiRoute,
      clientVisible: false,
      command: advisorReviewCommandForAction(body.actionId),
      noClientRelease: true,
      noAdviceExecution: true,
      ok: true,
      result: outcome,
      searchIndex,
      targetId: body.targetId,
      targetType: body.targetType,
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
    });
  } catch (error) {
    if (error instanceof AdvisorReviewWorkflowActionError) {
      return failClosedJson(
        {
          actionId: body.actionId,
          canonicalApiRoute: advisorReviewCanonicalApiRoute,
          error: error.message,
          reasonCode: error.status === 404 ? "SCOPE_DENIED" : "INVALID_REQUEST",
          safety: {
            commandExecuted: false,
            hiddenRowsDisclosed: false,
            noAdviceExecution: true,
            noClientRelease: true,
            scoped: false,
          },
          targetReasonCode: error.reasonCode,
          targetId: body.targetId,
          targetType: body.targetType,
        },
        { status: error.status },
      );
    }

    if (error instanceof AuditPersistenceUnavailableError) {
      return failClosedJson(
        {
          actionId: body.actionId,
          auditPersistenceRequired: true,
          canonicalApiRoute: advisorReviewCanonicalApiRoute,
          error: error.message,
          reasonCode: "AUDIT_PERSISTENCE_UNAVAILABLE",
          safety: {
            commandExecuted: false,
            hiddenRowsDisclosed: false,
            noAdviceExecution: true,
            noClientRelease: true,
            scoped: true,
          },
        },
        { status: 409 },
      );
    }

    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: advisorReviewCanonicalApiRoute,
        error: "Advisor-review action failed.",
        reasonCode: "SAFE_ERROR",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: true,
        },
      },
      { status: 409 },
    );
  }
}
