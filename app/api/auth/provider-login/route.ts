import { NextResponse } from "next/server";

import { isAuthProviderId } from "@/lib/auth/provider-registry";
import type { FailClosedApiState } from "@/lib/control-layer/error-envelope";
import { LocalAuthProviderError, startLocalProviderLogin } from "@/lib/auth/local-auth-provider-service";
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
  if (error instanceof LocalAuthProviderError) {
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

  const normalizedPassword =
    typeof payload.password === "string" ? payload.password.trim().slice(0, 80) : "";
  const loginPayload: Record<string, unknown> = { ...payload };
  if (typeof payload.password !== "undefined") {
    loginPayload.password = normalizedPassword;
  }

  try {
    const result = await startLocalProviderLogin(prismaClient(), loginPayload);
    const failureStatus =
      !result.ok && (result.reasonCode === "LOCAL_AUTH_USERNAME_REQUIRED" || result.reasonCode === "LOCAL_AUTH_PASSWORD_REQUIRED")
        ? 400
        : 403;

    return NextResponse.json(
      {
        ...result,
        provider: payload.providerId,
        ...(result.ok ? {} : authFailureContract(failureStatus, result.reasonCode)),
        safety: result.ok
          ? {
              hiddenRowsDisclosed: false,
              productionAuthClaim: false,
            }
          : authFailureSafety(),
      },
      { status: result.ok ? 200 : failureStatus },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
