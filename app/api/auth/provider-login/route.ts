import { NextResponse } from "next/server";

import { isAuthProviderId } from "@/lib/auth/provider-registry";
import { DemoAuthProviderError, startDemoProviderLogin } from "@/lib/demo/demo-auth-provider-service";
import { prismaClient } from "@/lib/prisma";

function errorResponse(error: unknown) {
  if (error instanceof DemoAuthProviderError) {
    return NextResponse.json(
      {
        error: error.message,
        ok: false,
        reasonCode: error.reasonCode,
        safety: {
          hiddenRowsDisclosed: false,
          productionAuthClaim: false,
        },
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      error: "Provider login failed.",
      ok: false,
      safety: {
        hiddenRowsDisclosed: false,
        productionAuthClaim: false,
      },
    },
    { status: 500 },
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  if (!isAuthProviderId(payload.providerId)) {
    return NextResponse.json(
      {
        error: "Unsupported auth provider.",
        ok: false,
        reasonCode: "AUTH_PROVIDER_UNSUPPORTED",
        safety: {
          hiddenRowsDisclosed: false,
          productionAuthClaim: false,
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await startDemoProviderLogin(prismaClient(), payload);

    return NextResponse.json(
      {
        ...result,
        provider: payload.providerId,
        safety: {
          hiddenRowsDisclosed: false,
          productionAuthClaim: false,
        },
      },
      { status: result.ok ? 200 : 403 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
