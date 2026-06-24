import { NextResponse } from "next/server";

import {
  DemoAuthProviderError,
  acceptDemoInvite,
  startDemoProviderLogin,
  verifyDemoMfa,
} from "@/lib/demo/demo-auth-provider-service";
import { demoAuthSessionCookieName, demoAuthSessionMaxAgeSeconds } from "@/lib/demo/demo-auth-session";
import { prismaClient } from "@/lib/prisma";

function isLocalAuthRequest(request: Request) {
  const hostname = new URL(request.url).hostname;

  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function setDemoSessionCookie(response: NextResponse, request: Request, sessionToken: string) {
  response.cookies.set(demoAuthSessionCookieName, sessionToken, {
    httpOnly: true,
    maxAge: demoAuthSessionMaxAgeSeconds,
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
      const result = await startDemoProviderLogin(prisma, payload);

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
      const result = await verifyDemoMfa(prisma, payload);

      return setDemoSessionCookie(NextResponse.json({
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
      const result = await acceptDemoInvite(prisma, payload);
      const sessionToken = `av-session-${result.session.userId}`;

      return setDemoSessionCookie(NextResponse.json({
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
