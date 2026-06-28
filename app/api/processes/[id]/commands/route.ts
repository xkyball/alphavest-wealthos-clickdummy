import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  blockProcessForCurrentUser,
  normalizeProcessRuntimeError,
  ProcessRuntimeError,
} from "@/lib/process-runtime/process-runtime-service";
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

async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ProcessRuntimeError("Process command body must be valid JSON.", 400, "INVALID_REQUEST", [
      "valid_json_required",
    ]);
  }
}

function errorResponse(error: unknown) {
  const normalized = normalizeProcessRuntimeError(error);
  return failClosedJson(
    {
      ...normalized.body,
      reasonCode: normalized.body.error,
      safety: {
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        processMutated: false,
        scoped: normalized.body.error !== "PERMISSION_DENIED",
      },
    },
    { status: normalized.status },
  );
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const body = await parseJson(request);
    const command = typeof body.command === "string" ? body.command : undefined;
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";

    if (command !== "BLOCK") {
      throw new ProcessRuntimeError("Process command handler is not implemented.", 400, "INVALID_REQUEST", [
        "process_command_handler_missing",
      ]);
    }

    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request);
    const result = await blockProcessForCurrentUser(prisma, currentUser, {
      auditPersistenceAvailable: body.auditPersistenceAvailable !== false,
      processInstanceId: await processInstanceId(context),
      reason,
    });

    return NextResponse.json({
      ...result,
      ok: true,
      safety: {
        commandExecuted: true,
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
