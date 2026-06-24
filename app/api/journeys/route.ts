import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  createJourneyForCurrentUser,
  JourneyApiError,
  listJourneysForCurrentUser,
  normalizeJourneyRouteError,
} from "@/lib/journeys/journey-api-service";
import { prismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new JourneyApiError("Journey request body must be valid JSON.", 400, "INVALID_REQUEST", [
      "valid_json_required",
    ]);
  }
}

function errorResponse(error: unknown) {
  const normalized = normalizeJourneyRouteError(error, "Journey API is not available for this request.");
  return failClosedJson(
    {
      error: normalized.message,
      issues: normalized.issues,
      reasonCode: normalized.reasonCode,
      safety: {
        journeyMutated: false,
        scoped: normalized.reasonCode !== "SCOPE_DENIED",
      },
    },
    { status: normalized.status },
  );
}

export async function GET(request: Request) {
  try {
    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request);
    const payload = await listJourneysForCurrentUser(prisma, currentUser);

    return NextResponse.json({
      ...payload,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
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
    const detail = await createJourneyForCurrentUser(prisma, currentUser, {
      clientTenantId: typeof body.clientTenantId === "string" ? body.clientTenantId : undefined,
      journeyKey: typeof body.journeyKey === "string" ? body.journeyKey : undefined,
    });

    return NextResponse.json({
      detail,
      mutated: true,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
