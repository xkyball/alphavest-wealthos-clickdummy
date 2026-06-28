import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { getProcessDetailForCurrentUser, normalizeProcessRuntimeError } from "@/lib/process-runtime/process-runtime-service";
import { prismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function processInstanceId(context: RouteContext) {
  const params = await context.params;

  return params.id;
}

function errorResponse(error: unknown) {
  const normalized = normalizeProcessRuntimeError(error);
  return failClosedJson(
    {
      ...normalized.body,
      reasonCode: normalized.body.error,
      safety: {
        hiddenRowsDisclosed: false,
        processMutated: false,
        scoped: normalized.body.error !== "PERMISSION_DENIED",
      },
    },
    { status: normalized.status },
  );
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request);
    const detail = await getProcessDetailForCurrentUser(prisma, currentUser, await processInstanceId(context));

    return NextResponse.json({
      detail,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        processRuntimeBackbone: true,
        scoped: true,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
