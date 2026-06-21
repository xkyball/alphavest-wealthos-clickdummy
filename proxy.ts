import { NextResponse, type NextRequest } from "next/server";

import { dummyAuthSessionCookieName, isDummyAuthSessionToken } from "@/lib/dummy-auth-session";

const authPathPrefixes = ["/login", "/mfa", "/onboarding"];

function isAuthPath(pathname: string) {
  return authPathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionToken = request.cookies.get(dummyAuthSessionCookieName)?.value;
  const isAuthenticated = isDummyAuthSessionToken(sessionToken);

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
