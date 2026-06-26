import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  adviceReleaseHistoryCanonicalApiRoute,
  adviceReleaseHistoryCommandForAction,
  isAdviceReleaseHistoryWorkflowAction,
  runAdviceReleaseHistoryWorkflowAction,
} from "@/lib/advice-release-history-workflow-actions";
import { AuditPersistenceUnavailableError } from "@/lib/typed-workflow-command-bus";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AdviceReleaseHistoryActionsPrismaGlobal = typeof globalThis & {
  alphaVestAdviceReleaseHistoryActionsPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as AdviceReleaseHistoryActionsPrismaGlobal;
  globalForPrisma.alphaVestAdviceReleaseHistoryActionsPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestAdviceReleaseHistoryActionsPrisma;
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for advice and release-history actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => undefined)) as
    | { actionId?: unknown; simulateAuditPersistenceFailure?: unknown }
    | undefined;
  if (!body || !isAdviceReleaseHistoryWorkflowAction(body.actionId)) {
    return failClosedJson(
      {
        canonicalApiRoute: adviceReleaseHistoryCanonicalApiRoute,
        error:
          "Advice and release-history actions only support J02 compliance release and J03 released decision/evidence commands.",
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
    const result = await runAdviceReleaseHistoryWorkflowAction(prisma, body.actionId, {
      auditPersistenceAvailable:
        body.simulateAuditPersistenceFailure === true ? false : undefined,
    });
    const releasedToClient =
      typeof result === "object" &&
      result !== null &&
      "clientVisible" in result &&
      result.clientVisible === true;

    return NextResponse.json({
      actionId: body.actionId,
      canonicalApiRoute: adviceReleaseHistoryCanonicalApiRoute,
      clientVisible: releasedToClient,
      command: adviceReleaseHistoryCommandForAction(body.actionId),
      noAdviceExecution: true,
      noClientRelease: !releasedToClient,
      ok: true,
      result,
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: !releasedToClient,
        scoped: true,
      },
    });
  } catch (error) {
    if (error instanceof AuditPersistenceUnavailableError) {
      return failClosedJson(
        {
          actionId: body.actionId,
          auditPersistenceRequired: true,
          canonicalApiRoute: adviceReleaseHistoryCanonicalApiRoute,
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
        canonicalApiRoute: adviceReleaseHistoryCanonicalApiRoute,
        error: "Advice and release-history action failed.",
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
