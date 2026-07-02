import { expect, type APIRequestContext, type BrowserContext, type Page } from "@playwright/test";

import { authJwtCookieName } from "../../lib/auth/auth-jwt";

type AuthenticatedTestUser = {
  email?: string;
  roleKey?: string;
  tenantSlug?: string;
};

export async function issueTestAuthJwt(
  request: APIRequestContext,
  user: AuthenticatedTestUser = {},
) {
  const email = user.email ?? "cfo.bennett@example.demo";
  const password = email.split("@")[0] ?? "";
  const startResponse = await request.post("/api/auth/provider-login", {
    data: { email, password, providerId: "db-user-jwt", roleKey: user.roleKey, tenantSlug: user.tenantSlug },
  });
  const startBody = await startResponse.json();

  expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);

  const mfaResponse = await request.post("/api/auth/mfa/verify", {
    data: { code: "123456", email, providerId: "db-user-jwt", roleKey: user.roleKey, tenantSlug: user.tenantSlug },
  });
  const mfaBody = await mfaResponse.json();

  expect(mfaResponse.ok(), JSON.stringify(mfaBody)).toBe(true);
  expect(mfaBody.jwt).toBeTruthy();

  return mfaBody.jwt as string;
}

export async function authenticateBrowserWithJwt(
  context: BrowserContext,
  request: APIRequestContext,
  user: AuthenticatedTestUser = {},
) {
  const jwt = await issueTestAuthJwt(request, user);

  await context.addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: authJwtCookieName,
      path: "/",
      sameSite: "Lax",
      value: jwt,
    },
  ]);

  return jwt;
}

export async function authenticatePageWithJwt(
  page: Page,
  request: APIRequestContext,
  user: AuthenticatedTestUser = {},
) {
  return authenticateBrowserWithJwt(page.context(), request, user);
}

export async function authenticatePageWithContextJwt(
  page: Page,
  user: AuthenticatedTestUser = {},
) {
  return authenticateBrowserWithJwt(page.context(), page.context().request, user);
}
