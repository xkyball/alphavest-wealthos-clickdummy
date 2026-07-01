import { NextResponse, type NextRequest } from "next/server";

import { authJwtCookieName, authJwtIssuer, authJwtProviderId } from "@/lib/auth/auth-jwt-constants";

const authPathPrefixes = ["/login", "/mfa", "/onboarding"];

const textEncoder = new TextEncoder();

function isAuthPath(pathname: string) {
  return authPathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function signingSecret() {
  return process.env.ALPHAVEST_AUTH_JWT_SECRET ?? "alphavest-wave-0-2-local-db-user-jwt-secret";
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

async function hmacSha256(input: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(signingSecret()),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(input));

  return base64UrlEncode(new Uint8Array(signature));
}

function decodeJwtPayload(payload: string) {
  const normalized = payload.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  return JSON.parse(atob(padded)) as {
    exp?: number;
    iss?: string;
    provider?: string;
  };
}

async function isVerifiedAuthJwt(token?: string) {
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [header, payload, receivedSignature] = parts;
    const unsigned = `${header}.${payload}`;
    const expectedSignature = await hmacSha256(unsigned);
    if (receivedSignature !== expectedSignature) return false;

    const claims = decodeJwtPayload(payload);
    const now = Math.floor(Date.now() / 1000);

    return claims.iss === authJwtIssuer && claims.provider === authJwtProviderId && Boolean(claims.exp && claims.exp > now);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authJwt = request.cookies.get(authJwtCookieName)?.value;
  const isAuthenticated = await isVerifiedAuthJwt(authJwt);

  if (isAuthenticated && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  if (isAuthPath(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
