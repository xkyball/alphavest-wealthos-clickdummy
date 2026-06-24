import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { getJourneyAuditForCurrentUser, normalizeJourneyRouteError } from "@/lib/journeys/journey-api-service";
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
  const normalized = normalizeJourneyRouteError(error, "Journey audit failed closed.");

  return failClosedJson(
    { error: normalized.message, issues: normalized.issues, reasonCode: normalized.reasonCode },
    { status: normalized.status },
  );
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request);
    const payload = await getJourneyAuditForCurrentUser(prisma, currentUser, await journeyId(context));

    return NextResponse.json({
      ...payload,
      ok: true,
      safety: {
        noAdviceExecution: true,
        noClientRelease: true,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
