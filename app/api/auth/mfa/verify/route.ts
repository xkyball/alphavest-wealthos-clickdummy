import { NextResponse } from "next/server";

import { authJwtCookieName, authJwtMaxAgeSeconds, issueAuthJwt } from "@/lib/auth/auth-jwt";
import { isAuthProviderId, safeUserClaimsFromDemoContext } from "@/lib/auth/provider-registry";
import { DemoAuthProviderError, verifyDemoMfa } from "@/lib/demo/demo-auth-provider-service";
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
      error: "MFA verification failed.",
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
    const result = await verifyDemoMfa(prismaClient(), payload);
    const jwt = issueAuthJwt(safeUserClaimsFromDemoContext(result.session));

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
