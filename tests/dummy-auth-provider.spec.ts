import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, PrismaClient, UserStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { demoAuthMfaCode } from "../lib/demo/demo-auth-provider-service";

test.describe("Dummy DB auth provider, MFA and invitations", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for dummy auth provider tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("requires a dummy auth session cookie before app routes render", async ({ page }) => {
    await page.goto("/client/home");
    await expect(page).toHaveURL(/\/login\?returnTo=%2Fclient%2Fhome/);

    await page.context().addCookies([
      {
        httpOnly: true,
        name: demoAuthSessionCookieName,
        sameSite: "Lax",
        url: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100",
        value: "av-session-playwright-authenticated",
      },
    ]);

    await page.goto("/client/home");
    await expect(page).toHaveURL(/\/client\/home$/);
    await expect(
      page.getByTestId("workflow02-worksurface-shell").getByRole("heading", { name: "Client Web Dashboard" }),
    ).toBeVisible();
  });

  test("denies unknown email without disclosing hidden rows", async ({ request }) => {
    const response = await request.post("/api/auth/dummy", {
      data: {
        action: "start_login",
        email: "unknown.person@example.invalid",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.nextStep).toBe("denied");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.safety.productionAuthClaim).toBe(false);
  });

  test("creates a DB-backed invitation and activates it through invite acceptance", async ({ request }) => {
    const email = `dummy.invited.${Date.now()}@example.demo`;
    const inviteResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "invite_user",
        actorRoleKey: "admin",
        displayName: "Dummy Invited User",
        email,
        roleKey: "analyst",
        tenantSlug: "summit",
      },
    });
    const inviteBody = await inviteResponse.json();

    expect(inviteResponse.ok(), JSON.stringify(inviteBody)).toBe(true);
    expect(inviteBody.ok).toBe(true);
    expect(inviteBody.result.inviteToken).toContain("av-invite-");
    expect(inviteBody.result.user.status).toBe(UserStatus.INVITED);
    expect(inviteBody.safety.productionAuthClaim).toBe(false);

    const invitedUser = await prisma.user.findUniqueOrThrow({
      include: { userRoles: true },
      where: { email },
    });
    expect(invitedUser.status).toBe(UserStatus.INVITED);
    expect(invitedUser.mfaEnabled).toBe(false);
    expect(invitedUser.userRoles.some((assignment) => assignment.status === "pending")).toBe(true);

    const startResponse = await request.post("/api/auth/dummy", {
      data: { action: "start_login", email },
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.nextStep).toBe("invite_acceptance_required");
    expect(startBody.user.inviteToken).toBe(inviteBody.result.inviteToken);

    const blockedResponse = await request.post("/api/auth/dummy", {
      data: {
        action: "accept_invite",
        consentAccepted: false,
        email,
        token: inviteBody.result.inviteToken,
      },
    });
    const blockedBody = await blockedResponse.json();

    expect(blockedResponse.status(), JSON.stringify(blockedBody)).toBe(409);
    expect(blockedBody.reasonCode).toBe("DUMMY_INVITE_CONSENT_REQUIRED");

    const acceptResponse = await request.post("/api/auth/dummy", {
      data: {
        action: "accept_invite",
        consentAccepted: true,
        email,
        token: inviteBody.result.inviteToken,
      },
    });
    const acceptBody = await acceptResponse.json();
    const acceptCookie = acceptResponse.headers()["set-cookie"] ?? "";

    expect(acceptResponse.ok(), JSON.stringify(acceptBody)).toBe(true);
    expect(acceptCookie).toContain(demoAuthSessionCookieName);
    expect(acceptBody.result.accepted).toBe(true);
    expect(acceptBody.result.session.status).toBe(UserStatus.ACTIVE);

    const activatedUser = await prisma.user.findUniqueOrThrow({
      include: { consentRecords: true, userRoles: true },
      where: { email },
    });
    expect(activatedUser.status).toBe(UserStatus.ACTIVE);
    expect(activatedUser.mfaEnabled).toBe(true);
    expect(activatedUser.userRoles.every((assignment) => assignment.status === "active")).toBe(true);
    expect(activatedUser.consentRecords.some((record) => record.consentType === "dummy_provider_onboarding")).toBe(true);

    const audits = await prisma.auditEvent.findMany({
      where: {
        eventType: { in: ["auth.dummy.invitation.created", "auth.dummy.invitation.accepted"] },
        targetId: activatedUser.id,
      },
    });
    expect(audits.map((audit) => audit.result)).toContain(AuditResult.SUCCESS);

    const replayResponse = await request.post("/api/auth/dummy", {
      data: {
        action: "accept_invite",
        consentAccepted: true,
        email,
        token: inviteBody.result.inviteToken,
      },
    });
    const replayBody = await replayResponse.json();

    expect(replayResponse.status(), JSON.stringify(replayBody)).toBe(409);
    expect(replayBody.ok).toBe(false);
    expect(replayBody.reasonCode).toBe("DUMMY_INVITE_ALREADY_ACCEPTED");

    const replayAudit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "auth.dummy.invitation.blocked",
        result: AuditResult.BLOCKED,
        targetId: activatedUser.id,
      },
    });
    expect(replayAudit.reason).toContain("replay blocked");
  });

  test("verifies MFA only for a known DB user with the accepted dummy code", async ({ request }) => {
    const email = "cfo.bennett@example.demo";
    const startResponse = await request.post("/api/auth/dummy", {
      data: { action: "start_login", email },
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.nextStep).toBe("mfa_required");
    expect(startBody.user.roleKey).toBe("family_cfo");

    const failedResponse = await request.post("/api/auth/dummy", {
      data: { action: "verify_mfa", code: "000000", email },
    });
    const failedBody = await failedResponse.json();

    expect(failedResponse.status(), JSON.stringify(failedBody)).toBe(403);
    expect(failedBody.reasonCode).toBe("DUMMY_AUTH_MFA_INVALID_CODE");

    const successResponse = await request.post("/api/auth/dummy", {
      data: { action: "verify_mfa", code: demoAuthMfaCode, email },
    });
    const successBody = await successResponse.json();
    const successCookie = successResponse.headers()["set-cookie"] ?? "";

    expect(successResponse.ok(), JSON.stringify(successBody)).toBe(true);
    expect(successCookie).toContain(demoAuthSessionCookieName);
    expect(successBody.result.sessionToken).toContain("av-session-");
    expect(successBody.result.session.email).toBe(email);

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.lastLoginAt).not.toBeNull();

    const audit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "auth.dummy.mfa.verified",
        targetId: user.id,
      },
    });
    expect(audit.result).toBe(AuditResult.SUCCESS);
  });

  test("denies invitation creation for non-admin actors", async ({ request }) => {
    const response = await request.post("/api/admin-tenants", {
      data: {
        action: "invite_user",
        actorRoleKey: "next_gen",
        displayName: "Denied Invite",
        email: `dummy.denied.${Date.now()}@example.demo`,
        roleKey: "analyst",
        tenantSlug: "summit",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.reasonCode).toBe("DUMMY_INVITE_ACTOR_DENIED");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
  });
});
