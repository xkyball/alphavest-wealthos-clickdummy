import { NextResponse } from "next/server";

import {
  LocalAuthProviderError,
  acceptLocalInvite,
  startLocalProviderLogin,
  verifyLocalMfa,
} from "@/lib/auth/local-auth-provider-service";
import { localAuthSessionCookieName, localAuthSessionMaxAgeSeconds } from "@/lib/auth/local-auth-session";
import { prismaClient } from "@/lib/prisma";

function isLocalAuthRequest(request: Request) {
  const hostname = new URL(request.url).hostname;

  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function setLocalSessionCookie(response: NextResponse, request: Request, sessionToken: string) {
  response.cookies.set(localAuthSessionCookieName, sessionToken, {
    httpOnly: true,
    maxAge: localAuthSessionMaxAgeSeconds,
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
      const result = await verifyLocalMfa(prisma, payload);

      return setLocalSessionCookie(NextResponse.json({
        ok: true,
        result,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      }), request, result.sessionToken);
    }

    if (action === "accept_invite") {
      const result = await acceptLocalInvite(prisma, payload);
      const sessionToken = `av-session-${result.session.userId}`;

      return setLocalSessionCookie(NextResponse.json({
        ok: true,
        result,
        safety: {
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
        },
      }), request, sessionToken);
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
