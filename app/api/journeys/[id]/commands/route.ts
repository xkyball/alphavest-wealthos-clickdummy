import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { parseJourneyCommandRequest } from "@/lib/journeys/journey-command-registry";
import { executeJourneyCommandForCurrentUser, normalizeJourneyRouteError } from "@/lib/journeys/journey-api-service";
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

async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function errorResponse(error: unknown) {
  const normalized = normalizeJourneyRouteError(error, "Journey command failed closed before state advance.");
  return failClosedJson(
    {
      error: normalized.message,
      issues: normalized.issues,
      reasonCode: normalized.reasonCode,
      safety: {
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        scoped: normalized.reasonCode !== "SCOPE_DENIED",
      },
    },
    { status: normalized.status },
  );
}

export async function POST(request: Request, context: RouteContext) {
  const parsed = parseJourneyCommandRequest(await parseJson(request));

  if (!parsed.ok) {
    return failClosedJson(
      {
        error: "Journey command request is invalid.",
        issues: parsed.issues,
        reasonCode: "INVALID_REQUEST",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          scoped: false,
        },
      },
      { status: 400 },
    );
  }

  try {
    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request);
    const result = await executeJourneyCommandForCurrentUser(prisma, currentUser, await journeyId(context), parsed.request);

    return NextResponse.json({
      ...result,
      ok: true,
      safety: {
        commandExecuted: true,
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
