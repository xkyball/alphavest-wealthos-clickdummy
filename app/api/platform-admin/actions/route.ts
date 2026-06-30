import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import {
  isPlatformAdminWorkflowAction,
  platformAdminCanonicalApiRoute,
  runPlatformAdminWorkflowAction,
} from "@/lib/platform-admin-workflow-actions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PlatformAdminActionsPrismaGlobal = typeof globalThis & {
  alphaVestPlatformAdminActionsPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as PlatformAdminActionsPrismaGlobal;
  globalForPrisma.alphaVestPlatformAdminActionsPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestPlatformAdminActionsPrisma;
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for platform admin actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => undefined)) as { actionId?: unknown } | undefined;
  if (!body || !isPlatformAdminWorkflowAction(body.actionId)) {
    return failClosedJson(
      {
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        error: "Platform admin actions only support J10 platform, audit, permission and security commands.",
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
    const result = await runPlatformAdminWorkflowAction(prisma, body.actionId);
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, `platform-admin:${body.actionId}`);

    return NextResponse.json({
      actionId: body.actionId,
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      clientVisible: false,
      command: result.command,
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
  } catch {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        error: "Platform admin action failed.",
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
