import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { authJwtCookieName, decodeAuthJwtPayload } from "../lib/auth/auth-jwt";

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
    const response = await request.post("/api/auth/provider-login", {
      data: {
        email: "wave02.unknown@example.invalid",
        providerId: "db-user-jwt",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.safeMessage).toBe("If this email is eligible, the next sign-in step will be shown.");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.safety.productionAuthClaim).toBe(false);
  });

  test("issues a safe JWT only after MFA 123456 and resolves current-user context", async ({ request }) => {
    const email = "cfo.bennett@example.demo";
    const startResponse = await request.post("/api/auth/provider-login", {
      data: {
        email,
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
    expect(deniedBody.reasonCode).toBe("DUMMY_AUTH_MFA_INVALID_CODE");

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
    expect(JSON.stringify(currentBody)).not.toMatch(/recommendation|evidenceRecord|complianceNote|clientPayload/i);

    const audit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "auth.dummy.mfa.verified",
        targetId: claims.sub,
      },
    });
    expect(audit.result).toBe(AuditResult.SUCCESS);
  });

  test("fails closed for missing or invalid current-user JWT", async ({ request }) => {
    const missingResponse = await request.get("/api/current-user");
    const missingBody = await missingResponse.json();

    expect(missingResponse.status(), JSON.stringify(missingBody)).toBe(401);
    expect(missingBody.safety.hiddenRowsDisclosed).toBe(false);

    const invalidResponse = await request.get("/api/current-user", {
      headers: {
        authorization: "Bearer not.a.jwt",
      },
    });
    const invalidBody = await invalidResponse.json();

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(401);
    expect(invalidBody.safety.internalPayloadReturned).toBe(false);
  });
});
