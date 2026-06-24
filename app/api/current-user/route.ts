import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import type { FailClosedApiState } from "@/lib/control-layer/error-envelope";
import { prismaClient } from "@/lib/prisma";

function currentUserFailure(input: {
  apiState: FailClosedApiState;
  error: string;
  reasonCode: string;
  retryAllowed?: boolean;
}) {
  return {
    apiState: input.apiState,
    error: input.error,
    mutated: false,
    noAdviceExecution: true,
    noClientRelease: true,
    ok: false,
    reasonCode: input.reasonCode,
    retryAllowed: input.retryAllowed ?? false,
    safety: {
      failClosed: true,
      hiddenRowsDisclosed: false,
      internalPayloadReturned: false,
      productionAuthClaim: false,
      silentStateAdvance: false,
    },
  };
}

export async function GET(request: Request) {
  try {
    const currentUser = await resolveCurrentUserFromRequest(prismaClient(), request);

    return NextResponse.json({
      currentUser,
      ok: true,
      safety: {
        internalPayloadReturned: false,
        productionAuthClaim: false,
      },
    });
  } catch {
    return NextResponse.json(
      currentUserFailure({
        apiState: "DENIED",
        error: "Current user is not authenticated.",
        reasonCode: "PERMISSION_DENIED",
      }),
      { status: 401 },
    );
  }
}
