import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  createProcessForCurrentUser,
  listProcessesForCurrentUser,
  normalizeProcessRuntimeError,
  ProcessRuntimeError,
} from "@/lib/process-runtime/process-runtime-service";
import { prismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ProcessRuntimeError("Process request body must be valid JSON.", 400, "INVALID_REQUEST", [
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

export async function GET(request: Request) {
  try {
    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request);
    const payload = await listProcessesForCurrentUser(prisma, currentUser);

    return NextResponse.json({
      ...payload,
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

export async function POST(request: Request) {
  try {
    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request);
    const body = await parseJson(request);
    const processId = typeof body.processId === "string" ? body.processId : undefined;

    if (!processId) {
      throw new ProcessRuntimeError("Process creation requires a processId.", 400, "INVALID_REQUEST", [
        "process_id_required",
      ]);
    }

    const detail = await createProcessForCurrentUser(prisma, currentUser, {
      clientTenantId: typeof body.clientTenantId === "string" ? body.clientTenantId : undefined,
      processId,
    });

    return NextResponse.json({
      detail,
      mutated: true,
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
