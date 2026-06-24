import { NextResponse } from "next/server";

import { isAuthProviderId } from "@/lib/auth/provider-registry";
import type { FailClosedApiState } from "@/lib/control-layer/error-envelope";
import { DemoAuthProviderError, startDemoProviderLogin } from "@/lib/demo/demo-auth-provider-service";
import { prismaClient } from "@/lib/prisma";

function authApiStateForStatus(status: number): FailClosedApiState {
  if (status === 400 || status === 409) return "VALIDATION_ERROR";
  if (status === 401 || status === 403 || status === 404) return "DENIED";

  return "ERROR";
}

function authFailureContract(status: number, reasonCode: string) {
  return {
    apiState: authApiStateForStatus(status),
    mutated: false,
    noAdviceExecution: true,
    noClientRelease: true,
    reasonCode,
    retryAllowed: false,
  };
}

function authFailureSafety() {
  return {
    failClosed: true,
    hiddenRowsDisclosed: false,
    productionAuthClaim: false,
    silentStateAdvance: false,
  };
}

function errorResponse(error: unknown) {
  if (error instanceof DemoAuthProviderError) {
    return NextResponse.json(
      {
        ...authFailureContract(error.status, error.reasonCode),
        error: error.message,
        ok: false,
        safety: authFailureSafety(),
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      ...authFailureContract(500, "SAFE_ERROR"),
      error: "Provider login failed.",
      ok: false,
      safety: authFailureSafety(),
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
        ...authFailureContract(400, "AUTH_PROVIDER_UNSUPPORTED"),
        error: "Unsupported auth provider.",
        ok: false,
        safety: authFailureSafety(),
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
        ...(result.ok ? {} : authFailureContract(403, result.reasonCode)),
        safety: result.ok
          ? {
              hiddenRowsDisclosed: false,
              productionAuthClaim: false,
            }
          : authFailureSafety(),
      },
      { status: result.ok ? 200 : 403 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
