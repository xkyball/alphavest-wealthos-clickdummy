import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  advisorReviewCanonicalApiRoute,
  advisorReviewCommandForAction,
  isAdvisorReviewWorkflowAction,
  runAdvisorReviewWorkflowAction,
} from "@/lib/advisor-review-workflow-actions";
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
      | { actionId?: unknown }
    | undefined;
  if (!body || !isAdvisorReviewWorkflowAction(body.actionId)) {
    return failClosedJson(
      {
        canonicalApiRoute: advisorReviewCanonicalApiRoute,
        error: "Advisor-review actions only support J01 route and escalation commands.",
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
    const outcome = await runAdvisorReviewWorkflowAction(
      prisma,
      body.actionId,
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
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
    });
  } catch (error) {
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
