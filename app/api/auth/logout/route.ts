import { NextResponse } from "next/server";

import { authJwtCookieName } from "@/lib/auth/auth-jwt";
import { localAuthSessionCookieName } from "@/lib/auth/local-auth-session";

function isLocalAuthRequest(request: Request) {
  const hostname = new URL(request.url).hostname;

  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function clearAuthCookie(response: NextResponse, request: Request, name: string) {
  response.cookies.set(name, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && !isLocalAuthRequest(request),
  });
}

export async function POST(request: Request) {
  const response = NextResponse.json({
    nextRoute: "/login",
    ok: true,
    safety: {
      failClosed: true,
      noClientRelease: true,
      productionAuthClaim: false,
      sessionCleared: true,
    },
  });

  clearAuthCookie(response, request, authJwtCookieName);
  clearAuthCookie(response, request, localAuthSessionCookieName);

  return response;
}
