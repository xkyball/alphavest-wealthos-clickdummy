import { NextResponse } from "next/server";

import { authJwtCookieName } from "@/lib/auth/auth-jwt";
import { demoAuthSessionCookieName } from "@/lib/demo/demo-auth-session";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    safety: {
      productionAuthClaim: false,
    },
  });

  response.cookies.set(authJwtCookieName, "", { maxAge: 0, path: "/" });
  response.cookies.set(demoAuthSessionCookieName, "", { maxAge: 0, path: "/" });

  return response;
}
