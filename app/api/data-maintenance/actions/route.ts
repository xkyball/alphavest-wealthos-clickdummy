import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  dataMaintenanceCanonicalApiRoute,
  dataMaintenanceCommandForAction,
  isDataMaintenanceWorkflowAction,
  runDataMaintenanceWorkflowAction,
} from "@/lib/data-maintenance-workflow-actions";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { AuditPersistenceUnavailableError } from "@/lib/typed-workflow-command-bus";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DataMaintenanceActionsPrismaGlobal = typeof globalThis & {
  alphaVestDataMaintenanceActionsPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as DataMaintenanceActionsPrismaGlobal;
  globalForPrisma.alphaVestDataMaintenanceActionsPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestDataMaintenanceActionsPrisma;
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for data maintenance actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => undefined)) as {
    actionId?: unknown;
    simulateAuditPersistenceFailure?: unknown;
  } | undefined;
  if (!body || !isDataMaintenanceWorkflowAction(body.actionId)) {
    return failClosedJson(
      {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance actions only support J04 document, J05 entity/action and J09 profile/family/relationship commands.",
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
  if (
    body.simulateAuditPersistenceFailure !== undefined &&
    typeof body.simulateAuditPersistenceFailure !== "boolean"
  ) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "simulateAuditPersistenceFailure must be boolean when provided.",
        reasonCode: "INVALID_REQUEST",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: true,
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await runDataMaintenanceWorkflowAction(prisma, body.actionId, {
      simulateAuditPersistenceFailure: body.simulateAuditPersistenceFailure === true,
    });
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, `data-maintenance:${body.actionId}`);

    return NextResponse.json({
      actionId: body.actionId,
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      clientVisible: false,
      command: dataMaintenanceCommandForAction(body.actionId),
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      result,
      searchIndex,
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
          canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
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
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance action failed.",
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
