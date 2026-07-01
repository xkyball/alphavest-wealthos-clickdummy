import { NextResponse } from "next/server";

import { authJwtCookieName, authJwtMaxAgeSeconds, issueAuthJwt } from "@/lib/auth/auth-jwt";
import { isAuthProviderId, safeUserClaimsFromLocalContext } from "@/lib/auth/provider-registry";
import type { FailClosedApiState } from "@/lib/control-layer/error-envelope";
import { LocalAuthProviderError, verifyLocalMfa } from "@/lib/auth/local-auth-provider-service";
import { prismaClient } from "@/lib/prisma";

function isLocalAuthRequest(request: Request) {
  const hostname = new URL(request.url).hostname;

  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function setAuthJwtCookie(response: NextResponse, request: Request, token: string) {
  response.cookies.set(authJwtCookieName, token, {
    httpOnly: true,
    maxAge: authJwtMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && !isLocalAuthRequest(request),
  });

  return response;
}

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
      error: "MFA verification failed.",
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
    const result = await verifyLocalMfa(prismaClient(), payload);
    const jwt = issueAuthJwt(safeUserClaimsFromLocalContext(result.session));

    return setAuthJwtCookie(
      NextResponse.json({
        jwt,
        ok: true,
        result: {
          currentUser: result.session,
          tokenType: "Bearer",
        },
        safety: {
          jwtContainsInternalPayload: false,
          productionAuthClaim: false,
        },
      }),
      request,
      jwt,
    );
  } catch (error) {
    return errorResponse(error);
  }
}
