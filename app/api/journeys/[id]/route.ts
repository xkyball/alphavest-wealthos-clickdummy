import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { getJourneyDetailForCurrentUser, normalizeJourneyRouteError } from "@/lib/journeys/journey-api-service";
import { prismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function journeyId(context: RouteContext) {
  const params = await context.params;

  return params.id;
}

function errorResponse(error: unknown) {
  const normalized = normalizeJourneyRouteError(error, "Work detail is not available for this request.");
  return failClosedJson(
    {
      error: normalized.message,
      issues: normalized.issues,
      reasonCode: normalized.reasonCode,
      safety: {
        hiddenRowsDisclosed: false,
        journeyMutated: false,
        scoped: normalized.reasonCode !== "SCOPE_DENIED",
      },
    },
    { status: normalized.status },
  );
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request);
    const detail = await getJourneyDetailForCurrentUser(prisma, currentUser, await journeyId(context));

    return NextResponse.json({
      detail,
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
