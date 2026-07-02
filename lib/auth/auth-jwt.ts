import { createHmac, timingSafeEqual } from "node:crypto";

import {
  authJwtCookieName,
  authJwtIssuer,
  authJwtProviderId,
  authJwtMaxAgeSeconds,
} from "@/lib/auth/auth-jwt-constants";

export {
  authJwtCookieName,
  authJwtIssuer,
  authJwtProviderId,
  authJwtMaxAgeSeconds,
} from "@/lib/auth/auth-jwt-constants";

export type AuthJwtClaims = {
  email: string;
  exp: number;
  iat: number;
  iss: typeof authJwtIssuer;
  name: string;
  provider: typeof authJwtProviderId;
  roleKey?: string;
  sid?: string;
  sub: string;
  tenantId?: string;
  tenantSlug?: string;
  userRoleId?: string;
};

const textEncoder = new TextEncoder();

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlJson(value: unknown) {
  return base64UrlEncode(JSON.stringify(value));
}

function signingSecret() {
  return process.env.ALPHAVEST_AUTH_JWT_SECRET ?? "alphavest-wave-0-2-local-db-user-jwt-secret";
}

function signature(input: string) {
  return createHmac("sha256", signingSecret()).update(input).digest("base64url");
}

export function issueAuthJwt(input: Omit<AuthJwtClaims, "exp" | "iat" | "iss" | "provider">) {
  const iat = Math.floor(Date.now() / 1000);
  const claims: AuthJwtClaims = {
    ...input,
    exp: iat + authJwtMaxAgeSeconds,
    iat,
    iss: authJwtIssuer,
    provider: authJwtProviderId,
  };
  const header = base64UrlJson({ alg: "HS256", typ: "JWT" });
  const payload = base64UrlJson(claims);
  const unsigned = `${header}.${payload}`;

  return `${unsigned}.${signature(unsigned)}`;
}

export function decodeAuthJwtPayload(token: string): AuthJwtClaims {
  const [, payload] = token.split(".");
  if (!payload) {
    throw new Error("Auth JWT payload is missing.");
  }

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthJwtClaims;
}

export function verifyAuthJwt(token?: string | null): AuthJwtClaims {
  if (!token) {
    throw new Error("Auth JWT is missing.");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Auth JWT must contain header, payload and signature.");
  }

  const [header, payload, receivedSignature] = parts;
  const unsigned = `${header}.${payload}`;
  const expectedSignature = signature(unsigned);
  const received = textEncoder.encode(receivedSignature);
  const expected = textEncoder.encode(expectedSignature);

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new Error("Auth JWT signature is invalid.");
  }

  const claims = decodeAuthJwtPayload(token);
  const now = Math.floor(Date.now() / 1000);

  if (claims.iss !== authJwtIssuer || claims.provider !== authJwtProviderId) {
    throw new Error("Auth JWT issuer or provider is invalid.");
  }

  if (claims.exp <= now) {
    throw new Error("Auth JWT is expired.");
  }

  return claims;
}

export function authJwtFromRequest(request: Request) {
  const authorization = request.headers.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("bearer ".length).trim();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const authCookie = cookies.find((cookie) => cookie.startsWith(`${authJwtCookieName}=`));

  return authCookie ? decodeURIComponent(authCookie.slice(authJwtCookieName.length + 1)) : undefined;
}
