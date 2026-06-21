import { NextResponse } from "next/server";

import {
  DummyAuthError,
  acceptDummyInvite,
  startDummyProviderLogin,
  verifyDummyMfa,
} from "@/lib/dummy-auth-service";
import { prismaClient } from "@/lib/prisma";

function errorResponse(error: unknown) {
  if (error instanceof DummyAuthError) {
    return NextResponse.json(
      {
        error: error.message,
        ok: false,
        reasonCode: error.reasonCode,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      error: "Dummy auth provider request failed.",
      ok: false,
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        productionAuthClaim: false,
      },
    },
    { status: 500 },
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const action = typeof payload.action === "string" ? payload.action : "start_login";
  const prisma = prismaClient();

  try {
    if (action === "start_login") {
      const result = await startDummyProviderLogin(prisma, payload);

      return NextResponse.json({
        ...result,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      }, { status: result.ok ? 200 : 403 });
    }

    if (action === "verify_mfa") {
      const result = await verifyDummyMfa(prisma, payload);

      return NextResponse.json({
        ok: true,
        result,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      });
    }

    if (action === "accept_invite") {
      const result = await acceptDummyInvite(prisma, payload);

      return NextResponse.json({
        ok: true,
        result,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      });
    }

    return NextResponse.json(
      {
        error: "Unsupported dummy auth action.",
        ok: false,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      },
      { status: 400 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
