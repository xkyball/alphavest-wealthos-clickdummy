import { NextResponse } from "next/server";

import { resolveCurrentUserFromRequest } from "@/lib/auth/current-user";
import { prismaClient } from "@/lib/prisma";

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
      {
        error: "Current user is not authenticated.",
        ok: false,
        safety: {
          hiddenRowsDisclosed: false,
          internalPayloadReturned: false,
          productionAuthClaim: false,
        },
      },
      { status: 401 },
    );
  }
}
