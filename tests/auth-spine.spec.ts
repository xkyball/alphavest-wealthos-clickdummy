import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { authJwtCookieName, decodeAuthJwtPayload } from "../lib/auth/auth-jwt";
import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import {
  createActorSession,
  actorPlatformTenantId,
  tryCreateActorSession,
} from "../lib/actor-session";
import { permissionEngine } from "../lib/permission-engine";

function cookieHeader(setCookie: string) {
  return setCookie.split(";")[0];
}

test.describe("Wave 0-2 auth spine", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for auth spine tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("lists the DB-user JWT provider without production IdP claims", async ({ request }) => {
    const response = await request.get("/api/auth/providers");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.providers).toEqual([
      expect.objectContaining({
        id: "db-user-jwt",
        mfa: "stub-123456",
        productionIdp: false,
      }),
    ]);
    expect(body.safety.productionAuthClaim).toBe(false);
  });

  test("denies unknown DB users with safe failure metadata", async ({ request }) => {
    const email = "wave02.unknown@example.invalid";
    const password = email.split("@")[0] ?? "";
    const response = await request.post("/api/auth/provider-login", {
      data: {
        email,
        password,
        providerId: "db-user-jwt",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.apiState).toBe("DENIED");
    expect(body.mutated).toBe(false);
    expect(body.ok).toBe(false);
    expect(body.safeMessage).toBe("If this account is eligible, the next sign-in step will be shown.");
    expect(body.noAdviceExecution).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.safety.failClosed).toBe(true);
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.safety.productionAuthClaim).toBe(false);
    expect(body.safety.silentStateAdvance).toBe(false);
  });

  test("issues a safe JWT only after MFA 123456 and resolves current-user context", async ({ request }) => {
    const email = "cfo.bennett@example.demo";
    const password = email.split("@")[0] ?? "";
    const startResponse = await request.post("/api/auth/provider-login", {
      data: {
        email,
        password,
        providerId: "db-user-jwt",
      },
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.provider).toBe("db-user-jwt");
    expect(startBody.nextStep).toBe("mfa_required");
    expect(startBody.user.roleKey).toBe("family_cfo");

    const deniedResponse = await request.post("/api/auth/mfa/verify", {
      data: {
        code: "000000",
        email,
        providerId: "db-user-jwt",
      },
    });
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.apiState).toBe("DENIED");
    expect(deniedBody.mutated).toBe(false);
    expect(deniedBody.noAdviceExecution).toBe(true);
    expect(deniedBody.noClientRelease).toBe(true);
    expect(deniedBody.reasonCode).toBe("LOCAL_AUTH_MFA_INVALID_CODE");
    expect(deniedBody.safety.failClosed).toBe(true);
    expect(deniedBody.safety.silentStateAdvance).toBe(false);

    const successResponse = await request.post("/api/auth/mfa/verify", {
      data: {
        code: "123456",
        email,
        providerId: "db-user-jwt",
      },
    });
    const successBody = await successResponse.json();
    const setCookie = successResponse.headers()["set-cookie"] ?? "";

    expect(successResponse.ok(), JSON.stringify(successBody)).toBe(true);
    expect(setCookie).toContain(authJwtCookieName);
    expect(successBody.jwt.split(".")).toHaveLength(3);

    const claims = decodeAuthJwtPayload(successBody.jwt);
    expect(claims).toMatchObject({
      email,
      provider: "db-user-jwt",
      roleKey: "family_cfo",
    });
    expect(Object.keys(claims).sort()).toEqual([
      "email",
      "exp",
      "iat",
      "iss",
      "name",
      "provider",
      "roleKey",
      "sid",
      "sub",
      "tenantId",
      "tenantSlug",
      "userRoleId",
    ]);

    const currentResponse = await request.get("/api/current-user", {
      headers: {
        cookie: cookieHeader(setCookie),
      },
    });
    const currentBody = await currentResponse.json();

    expect(currentResponse.ok(), JSON.stringify(currentBody)).toBe(true);
    expect(currentBody.currentUser).toMatchObject({
      actor: {
        email,
        status: "ACTIVE",
      },
      auth: {
        provider: "db-user-jwt",
      },
      role: {
        key: "family_cfo",
      },
      tenant: {
        displayName: "Bennett Family Office",
      },
    });
    expect(currentBody.currentUser.memberships).toEqual([
      expect.objectContaining({
        role: expect.objectContaining({ key: "family_cfo" }),
        status: "active",
        tenant: expect.objectContaining({ displayName: "Bennett Family Office" }),
      }),
    ]);
    expect(currentBody.currentUser.objectScopes).toEqual([]);
    expect(JSON.stringify(currentBody)).not.toMatch(/recommendation|evidenceRecord|complianceNote|clientPayload/i);

    const bridgeSession = tryCreateActorSession({
      roleKey: currentBody.currentUser.role.key,
      tenantSlug: claims.tenantSlug,
    });

    expect(bridgeSession.ok).toBe(true);
    if (!bridgeSession.ok) throw new Error(`Current-user bridge failed: ${bridgeSession.issues.join(", ")}`);

    expect(bridgeSession.session.actor.id).toBe(currentBody.currentUser.actor.id);
    expect(bridgeSession.session.actor.email).toBe(email);
    expect(bridgeSession.session.tenant.id).toBe(currentBody.currentUser.tenant.id);
    expect(bridgeSession.session.tenantMembership).toMatchObject({
      actorId: currentBody.currentUser.actor.id,
      roleKey: "family_cfo",
      tenantId: currentBody.currentUser.tenant.id,
      tenantSlug: "bennett",
    });

    const bridgePermission = permissionEngine.can(
      bridgeSession.session.actor,
      "VIEW",
      {
        clientTenantId: bridgeSession.session.tenant.id,
        objectType: "DOCUMENT",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      {
        clientTenantId: bridgeSession.session.tenant.id,
        platformTenantId: actorPlatformTenantId,
      },
      bridgeSession.session.role,
    );

    expect(bridgePermission.allowed).toBe(true);
    expect(bridgePermission.reasonCode).toBe("DEMO_ROLE_AWARE_ALLOW");

    const foreignTenant = createActorSession({ roleKey: "principal", tenantSlug: "morgan" }).tenant;
    const crossTenantPermission = permissionEngine.can(
      bridgeSession.session.actor,
      "VIEW",
      {
        clientTenantId: foreignTenant.id,
        objectType: "DOCUMENT",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      {
        clientTenantId: foreignTenant.id,
        platformTenantId: actorPlatformTenantId,
      },
      bridgeSession.session.role,
    );

    expect(crossTenantPermission.allowed).toBe(false);
    expect(crossTenantPermission.reasonCode).toBe("DEMO_DENY_ACTOR_TENANT_CONTEXT_MISMATCH");
    expect(crossTenantPermission.requiresAudit).toBe(true);

    const audit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "auth.local.mfa.verified",
        targetId: claims.sub,
      },
    });
    expect(audit.result).toBe(AuditResult.SUCCESS);
  });

  test("selects an onboarding tenant context for Client Success login without explicit tenant", async ({ request }) => {
    const email = "lina.success@alphavest.demo";
    const password = email.split("@")[0] ?? "";
    const startResponse = await request.post("/api/auth/provider-login", {
      data: {
        email,
        password,
        providerId: "db-user-jwt",
      },
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.nextStep).toBe("mfa_required");
    expect(startBody.user).toMatchObject({
      roleKey: "client_success",
      tenantName: "Morgan Family Office",
      tenantSlug: "morgan",
    });

    const successResponse = await request.post("/api/auth/mfa/verify", {
      data: {
        code: "123456",
        email,
        providerId: "db-user-jwt",
      },
    });
    const successBody = await successResponse.json();
    const setCookie = successResponse.headers()["set-cookie"] ?? "";

    expect(successResponse.ok(), JSON.stringify(successBody)).toBe(true);
    expect(successBody.result.currentUser).toMatchObject({
      roleKey: "client_success",
      tenantName: "Morgan Family Office",
      tenantSlug: "morgan",
    });

    const currentResponse = await request.get("/api/current-user", {
      headers: {
        cookie: cookieHeader(setCookie),
      },
    });
    const currentBody = await currentResponse.json();

    expect(currentResponse.ok(), JSON.stringify(currentBody)).toBe(true);
    expect(currentBody.currentUser).toMatchObject({
      actor: {
        email,
      },
      role: {
        key: "client_success",
      },
      tenant: {
        displayName: "Morgan Family Office",
        slug: "morgan",
      },
    });

    const adminTenantsResponse = await request.get("/api/admin-tenants?surface=tenants&pageSize=10", {
      headers: {
        cookie: cookieHeader(setCookie),
      },
    });
    const adminTenantsBody = await adminTenantsResponse.json();

    expect(adminTenantsResponse.ok(), JSON.stringify(adminTenantsBody)).toBe(true);
    expect(adminTenantsBody.safety).toMatchObject({
      roleKey: "client_success",
      scoped: true,
      tenantSlug: "morgan",
    });
    expect(adminTenantsBody.tenantRows).toHaveLength(1);
    expect(adminTenantsBody.tenantRows[0].name).toBe("Morgan Family Office");
  });

  test("opens admin tenants UI after Client Success login without explicit tenant", async ({ baseURL, context, page, request }) => {
    const email = "lina.success@alphavest.demo";
    const password = email.split("@")[0] ?? "";
    const startResponse = await request.post("/api/auth/provider-login", {
      data: {
        email,
        password,
        providerId: "db-user-jwt",
      },
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.user).toMatchObject({
      roleKey: "client_success",
      tenantSlug: "morgan",
    });

    const successResponse = await request.post("/api/auth/mfa/verify", {
      data: {
        code: "123456",
        email,
        providerId: "db-user-jwt",
      },
    });
    const successBody = await successResponse.json();

    expect(successResponse.ok(), JSON.stringify(successBody)).toBe(true);
    expect(successBody.result.currentUser).toMatchObject({
      roleKey: "client_success",
      tenantSlug: "morgan",
    });

    await context.addCookies([
      {
        name: authJwtCookieName,
        value: successBody.jwt,
        url: new URL(baseURL ?? "http://127.0.0.1:3020").origin,
      },
    ]);

    await page.goto("/admin/tenants");
    await expect(page.getByText("Sign in required")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Tenant Directory" })).toBeVisible();
    await expect(page.getByTestId("ux-data-table").getByText("Morgan Family Office", { exact: true })).toBeVisible();
  });

  test("fails closed for missing or invalid current-user JWT", async ({ request }) => {
    const missingResponse = await request.get("/api/current-user");
    const missingBody = await missingResponse.json();

    expect(missingResponse.status(), JSON.stringify(missingBody)).toBe(401);
    expect(missingBody.apiState).toBe("DENIED");
    expect(missingBody.mutated).toBe(false);
    expect(missingBody.reasonCode).toBe("PERMISSION_DENIED");
    expect(missingBody.safety.failClosed).toBe(true);
    expect(missingBody.safety.hiddenRowsDisclosed).toBe(false);
    expect(missingBody.safety.silentStateAdvance).toBe(false);

    const invalidResponse = await request.get("/api/current-user", {
      headers: {
        authorization: "Bearer not.a.jwt",
      },
    });
    const invalidBody = await invalidResponse.json();

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(401);
    expect(invalidBody.apiState).toBe("DENIED");
    expect(invalidBody.mutated).toBe(false);
    expect(invalidBody.reasonCode).toBe("PERMISSION_DENIED");
    expect(invalidBody.safety.internalPayloadReturned).toBe(false);
    expect(invalidBody.safety.silentStateAdvance).toBe(false);
  });

  test("does not treat the legacy local session cookie as app-route authority", async ({ page }) => {
    await page.context().addCookies([
      {
        httpOnly: true,
        name: localAuthSessionCookieName,
        sameSite: "Lax",
        url: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100",
        value: "av-session-playwright-authenticated",
      },
    ]);

    await page.goto("/client/home");
    await expect(page).toHaveURL(/\/login\?returnTo=%2Fclient%2Fhome/);
  });

  test("does not treat a shaped but unsigned JWT as app-route authority", async ({ page }) => {
    await page.context().addCookies([
      {
        httpOnly: true,
        name: authJwtCookieName,
        sameSite: "Lax",
        url: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100",
        value: "aaa.bbb.ccc",
      },
    ]);

    await page.goto("/client/home");
    await expect(page).toHaveURL(/\/login\?returnTo=%2Fclient%2Fhome/);
  });
});
