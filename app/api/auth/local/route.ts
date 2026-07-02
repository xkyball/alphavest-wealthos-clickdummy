import { NextResponse } from "next/server";

import {
  LocalAuthProviderError,
  acceptLocalInvite,
  startLocalProviderLogin,
  verifyLocalMfa,
} from "@/lib/auth/local-auth-provider-service";
import { authJwtCookieName, authJwtMaxAgeSeconds, issueAuthJwt } from "@/lib/auth/auth-jwt";
import { safeUserClaimsFromLocalContext } from "@/lib/auth/provider-registry";
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
  if (error instanceof LocalAuthProviderError) {
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
      error: "Local auth provider request failed.",
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
  const requestContext = {
    ...payload,
    ipAddress: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "",
    userAgent: request.headers.get("user-agent") ?? "",
  };
  const action = typeof payload.action === "string" ? payload.action : "start_login";
  const prisma = prismaClient();

  try {
    if (action === "start_login") {
      const result = await startLocalProviderLogin(prisma, payload);

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
      const result = await verifyLocalMfa(prisma, requestContext);
      const jwt = issueAuthJwt(safeUserClaimsFromLocalContext(result.session));

      return setAuthJwtCookie(NextResponse.json({
        jwt,
        ok: true,
        result: {
          currentUser: result.session,
          tokenType: "Bearer",
        },
        safety: {
          jwtContainsInternalPayload: false,
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      }), request, jwt);
    }

    if (action === "accept_invite") {
      const result = await acceptLocalInvite(prisma, requestContext);
      const jwt = issueAuthJwt(safeUserClaimsFromLocalContext(result.session));

      return setAuthJwtCookie(NextResponse.json({
        jwt,
        ok: true,
        result: {
          accepted: result.accepted,
          currentUser: result.session,
          tokenType: "Bearer",
        },
        safety: {
          jwtContainsInternalPayload: false,
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      }), request, jwt);
    }

    return NextResponse.json(
      {
        error: "Unsupported local auth action.",
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
