import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, PrismaClient, UserStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { authJwtCookieName, decodeAuthJwtPayload } from "../lib/auth/auth-jwt";
import { localAuthMfaCode } from "../lib/auth/local-auth-provider-service";
import { issueTestAuthJwt } from "./helpers/auth-jwt";

test.describe("Local DB auth provider, MFA and invitations", () => {
  let prisma: PrismaClient;

  function passwordForEmail(email: string) {
    return email.split("@")[0] ?? "";
  }

  function usernameForEmail(email: string) {
    return passwordForEmail(email);
  }

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for local auth provider tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("requires a DB-user JWT before app routes render", async ({ page, request }) => {
    await page.goto("/client/home");
    await expect(page).toHaveURL(/\/login\?returnTo=%2Fclient%2Fhome/);

    const startResponse = await request.post("/api/auth/provider-login", {
      data: { email: "cfo.bennett@example.demo", password: passwordForEmail("cfo.bennett@example.demo"), providerId: "db-user-jwt" },
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);

    const mfaResponse = await request.post("/api/auth/mfa/verify", {
      data: { code: localAuthMfaCode, email: "cfo.bennett@example.demo", providerId: "db-user-jwt" },
    });
    const mfaBody = await mfaResponse.json();

    expect(mfaResponse.ok(), JSON.stringify(mfaBody)).toBe(true);
    expect(mfaBody.jwt).toBeTruthy();
    const jwtClaims = decodeAuthJwtPayload(mfaBody.jwt as string);
    expect(jwtClaims.sid).toBeTruthy();

    const activeSession = await prisma.userSession.findFirst({
      where: {
        id: jwtClaims.sid,
        status: "ACTIVE",
        user: { email: "cfo.bennett@example.demo" },
      },
    });
    expect(activeSession).toBeTruthy();
    expect(activeSession?.providerId).toBe("db-user-jwt");

    await page.context().addCookies([
      {
        httpOnly: true,
        name: authJwtCookieName,
        sameSite: "Lax",
        url: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100",
        value: mfaBody.jwt as string,
      },
    ]);

    await page.goto("/client/home");
    await expect(page).toHaveURL(/\/client\/home$/);
    await expect(page.getByRole("heading", { name: "Client Web Dashboard" })).toBeVisible();
  });

  test("denies unknown email without disclosing hidden rows", async ({ request }) => {
    const response = await request.post("/api/auth/local", {
      data: {
        action: "start_login",
        email: "unknown.person@example.invalid",
        password: "any-password",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.nextStep).toBe("denied");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.safety.productionAuthClaim).toBe(false);
  });

  test("requires password for local provider login requests", async ({ request }) => {
    const response = await request.post("/api/auth/provider-login", {
      data: {
        email: "cfo.bennett@example.demo",
        providerId: "db-user-jwt",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.reasonCode).toBe("LOCAL_AUTH_PASSWORD_REQUIRED");
  });

  test("accepts username and matching password for local provider login", async ({ request }) => {
    const email = "cfo.bennett@example.demo";
    const username = usernameForEmail(email);
    const response = await request.post("/api/auth/provider-login", {
      data: {
        password: username,
        providerId: "db-user-jwt",
        username,
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.nextStep).toBe("mfa_required");
    expect(body.user.email).toBe(email);
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("rejects an incorrect local provider password without disclosing account detail", async ({ request }) => {
    const response = await request.post("/api/auth/provider-login", {
      data: {
        email: "cfo.bennett@example.demo",
        password: "wrong-password",
        providerId: "db-user-jwt",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.reasonCode).toBe("LOCAL_AUTH_INVALID_PASSWORD");
    expect(body.safeMessage).toBe("If this account is eligible, the next sign-in step will be shown.");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("blocks locked users before issuing a local provider challenge", async ({ request }) => {
    const email = "cfo.summit@example.demo";
    await prisma.user.update({
      data: { status: UserStatus.LOCKED },
      where: { email },
    });

    try {
      const response = await request.post("/api/auth/provider-login", {
        data: {
          email,
          password: passwordForEmail(email),
          providerId: "db-user-jwt",
        },
      });
      const body = await response.json();

      expect(response.status(), JSON.stringify(body)).toBe(403);
      expect(body.ok).toBe(false);
      expect(body.reasonCode).toBe("LOCAL_AUTH_USER_NOT_ACTIVE");
      expect(body.safeMessage).toBe("If this account is eligible, the next sign-in step will be shown.");
      expect(body.safety.hiddenRowsDisclosed).toBe(false);
    } finally {
      await prisma.user.update({
        data: { status: UserStatus.ACTIVE },
        where: { email },
      });
    }
  });

  test("creates a DB-backed invitation and activates it through invite acceptance", async ({ request }) => {
    const email = `local.invited.${Date.now()}@example.demo`;
    const adminJwt = await issueTestAuthJwt(request, {
      email: "ava.admin@alphavest.demo",
      roleKey: "admin",
    });
    const inviteResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "invite_user",
        actorRoleKey: "next_gen",
        displayName: "Local Invited User",
        email,
        roleKey: "analyst",
        tenantSlug: "summit",
        validForDays: 3,
      },
      headers: { Authorization: `Bearer ${adminJwt}` },
    });
    const inviteBody = await inviteResponse.json();

    expect(inviteResponse.ok(), JSON.stringify(inviteBody)).toBe(true);
    expect(inviteBody.ok).toBe(true);
    expect(inviteBody.result.inviteToken).toContain("av-invite-");
    expect(inviteBody.result.user.status).toBe(UserStatus.INVITED);
    expect(inviteBody.safety.authority).toBe("db-user-jwt");
    expect(inviteBody.safety.roleKey).toBe("admin");
    expect(inviteBody.safety.productionAuthClaim).toBe(false);

    const invitedUser = await prisma.user.findUniqueOrThrow({
      include: { userRoles: true },
      where: { email },
    });
    expect(invitedUser.status).toBe(UserStatus.INVITED);
    expect(invitedUser.mfaEnabled).toBe(false);
    const pendingInviteAssignment = invitedUser.userRoles.find((assignment) => assignment.status === "pending");
    expect(pendingInviteAssignment?.validUntil).toBeTruthy();
    expect(pendingInviteAssignment?.validUntil).toBeInstanceOf(Date);
    expect(pendingInviteAssignment?.validUntil?.getTime() ?? 0).toBeGreaterThan(Date.now() + 2 * 24 * 60 * 60 * 1000);
    expect(pendingInviteAssignment?.validUntil?.getTime() ?? 0).toBeLessThan(Date.now() + 4 * 24 * 60 * 60 * 1000);
    expect(pendingInviteAssignment).toBeTruthy();

    const startResponse = await request.post("/api/auth/local", {
      data: { action: "start_login", email, password: passwordForEmail(email) },
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.nextStep).toBe("invite_acceptance_required");
    expect(startBody.user.inviteToken).toBe(inviteBody.result.inviteToken);

    const blockedResponse = await request.post("/api/auth/local", {
      data: {
        action: "accept_invite",
        consentAccepted: false,
        email,
        token: inviteBody.result.inviteToken,
      },
    });
    const blockedBody = await blockedResponse.json();

    expect(blockedResponse.status(), JSON.stringify(blockedBody)).toBe(409);
    expect(blockedBody.reasonCode).toBe("LOCAL_INVITE_CONSENT_REQUIRED");

    const acceptResponse = await request.post("/api/auth/local", {
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
    expect(acceptCookie).toContain(authJwtCookieName);
    expect(acceptBody.jwt.split(".")).toHaveLength(3);
    expect(acceptBody.result.accepted).toBe(true);
    expect(acceptBody.result.currentUser.status).toBe(UserStatus.ACTIVE);
    expect(acceptBody.result.currentUser.email).toBe(email);
    expect(acceptBody.result.tokenType).toBe("Bearer");

    const activatedUser = await prisma.user.findUniqueOrThrow({
      include: { consentRecords: true, userRoles: true },
      where: { email },
    });
    expect(activatedUser.status).toBe(UserStatus.ACTIVE);
    expect(activatedUser.mfaEnabled).toBe(true);
    expect(activatedUser.userRoles.every((assignment) => assignment.status === "active")).toBe(true);
    expect(activatedUser.consentRecords.some((record) => record.consentType === "local_provider_onboarding")).toBe(true);

    const nextPassword = `${passwordForEmail(email)}-next1`;
    const passwordChangeResponse = await request.patch("/api/profile", {
      data: {
        action: "change_password",
        confirmPassword: nextPassword,
        currentPassword: passwordForEmail(email),
        nextPassword,
      },
      headers: { cookie: `${authJwtCookieName}=${acceptBody.jwt as string}` },
    });
    const passwordChangeBody = await passwordChangeResponse.json();

    expect(passwordChangeResponse.ok(), JSON.stringify(passwordChangeBody)).toBe(true);
    expect(passwordChangeBody.result.passwordChanged).toBe(true);

    const passwordUpdatedUser = await prisma.user.findUniqueOrThrow({
      where: { email },
    });
    expect(passwordUpdatedUser.localPasswordHash).toBeTruthy();
    expect(passwordUpdatedUser.localPasswordUpdatedAt).toBeInstanceOf(Date);

    const passwordAudit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "auth.local.password.changed",
        targetId: activatedUser.id,
      },
    });
    expect(JSON.stringify(passwordAudit.metadataJson)).not.toContain("passwordHash");

    const oldPasswordResponse = await request.post("/api/auth/local", {
      data: { action: "start_login", email, password: passwordForEmail(email) },
    });
    const oldPasswordBody = await oldPasswordResponse.json();
    expect(oldPasswordResponse.status(), JSON.stringify(oldPasswordBody)).toBe(403);
    expect(oldPasswordBody.reasonCode).toBe("LOCAL_AUTH_INVALID_PASSWORD");

    const newPasswordResponse = await request.post("/api/auth/local", {
      data: { action: "start_login", email, password: nextPassword },
    });
    const newPasswordBody = await newPasswordResponse.json();
    expect(newPasswordResponse.ok(), JSON.stringify(newPasswordBody)).toBe(true);
    expect(newPasswordBody.nextStep).toBe("mfa_required");

    const audits = await prisma.auditEvent.findMany({
      where: {
        eventType: { in: ["auth.local.invitation.created", "auth.local.invitation.accepted"] },
        targetId: activatedUser.id,
      },
    });
    expect(audits.map((audit) => audit.result)).toContain(AuditResult.SUCCESS);

    const replayResponse = await request.post("/api/auth/local", {
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
    expect(replayBody.reasonCode).toBe("LOCAL_INVITE_ALREADY_ACCEPTED");

    const replayAudit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "auth.local.invitation.blocked",
        result: AuditResult.BLOCKED,
        targetId: activatedUser.id,
      },
    });
    expect(replayAudit.reason).toContain("replay blocked");
  });

  test("rejects invitation acceptance when invite window expired", async ({ request }) => {
    const email = `local.invited.expired.${Date.now()}@example.demo`;
    const adminJwt = await issueTestAuthJwt(request, {
      email: "ava.admin@alphavest.demo",
      roleKey: "admin",
    });
    const inviteResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "invite_user",
        actorRoleKey: "next_gen",
        displayName: "Local Expired User",
        email,
        roleKey: "analyst",
        tenantSlug: "summit",
      },
      headers: { Authorization: `Bearer ${adminJwt}` },
    });
    const inviteBody = await inviteResponse.json();

    expect(inviteResponse.ok(), JSON.stringify(inviteBody)).toBe(true);
    const invitedUser = await prisma.user.findUniqueOrThrow({
      select: { id: true },
      where: { email },
    });

    await prisma.userRole.updateMany({
      data: { validUntil: new Date(Date.now() - 60 * 1000) },
      where: {
        userId: invitedUser.id,
        status: "pending",
      },
    });

    const expiredResponse = await request.post("/api/auth/local", {
      data: {
        action: "accept_invite",
        consentAccepted: true,
        email,
        token: inviteBody.result.inviteToken,
      },
    });
    const expiredBody = await expiredResponse.json();

    expect(expiredResponse.status(), JSON.stringify(expiredBody)).toBe(410);
    expect(expiredBody.reasonCode).toBe("LOCAL_INVITE_EXPIRED");
  });

  test("lets admin manage user status, role assignment and invite lifecycle through scoped API actions", async ({ request }) => {
    const email = `local.lifecycle.${Date.now()}@example.demo`;
    const adminJwt = await issueTestAuthJwt(request, {
      email: "ava.admin@alphavest.demo",
      roleKey: "admin",
    });
    const headers = { Authorization: `Bearer ${adminJwt}` };
    const inviteResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "invite_user",
        displayName: "Local Lifecycle User",
        email,
        roleKey: "analyst",
        tenantSlug: "summit",
        validForDays: 5,
      },
      headers,
    });
    const inviteBody = await inviteResponse.json();
    expect(inviteResponse.ok(), JSON.stringify(inviteBody)).toBe(true);

    const invited = await prisma.user.findUniqueOrThrow({
      include: { userRoles: true },
      where: { email },
    });
    const assignment = invited.userRoles.find((role) => role.status === "pending");
    expect(assignment?.id).toBeTruthy();

    const activateResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "set_user_status",
        status: UserStatus.ACTIVE,
        tenantSlug: "summit",
        userId: invited.id,
      },
      headers,
    });
    const activateBody = await activateResponse.json();
    expect(activateResponse.ok(), JSON.stringify(activateBody)).toBe(true);
    expect(activateBody.result.userStatus).toBe(UserStatus.ACTIVE);

    const lockResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "set_user_status",
        status: UserStatus.LOCKED,
        tenantSlug: "summit",
        userId: invited.id,
      },
      headers,
    });
    const lockBody = await lockResponse.json();
    expect(lockResponse.ok(), JSON.stringify(lockBody)).toBe(true);
    expect(lockBody.result.userStatus).toBe(UserStatus.LOCKED);

    const lockedLoginResponse = await request.post("/api/auth/local", {
      data: { action: "start_login", email, password: passwordForEmail(email) },
    });
    const lockedLoginBody = await lockedLoginResponse.json();
    expect(lockedLoginResponse.status(), JSON.stringify(lockedLoginBody)).toBe(403);
    expect(lockedLoginBody.reasonCode).toBe("LOCAL_AUTH_USER_NOT_ACTIVE");
    expect(lockedLoginBody.safety.hiddenRowsDisclosed).toBe(false);

    const restoreResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "set_user_status",
        status: UserStatus.ACTIVE,
        tenantSlug: "summit",
        userId: invited.id,
      },
      headers,
    });
    const restoreBody = await restoreResponse.json();
    expect(restoreResponse.ok(), JSON.stringify(restoreBody)).toBe(true);
    expect(restoreBody.result.userStatus).toBe(UserStatus.ACTIVE);

    const roleResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "update_user_assignment",
        roleKey: "family_cfo",
        tenantSlug: "summit",
        userId: invited.id,
        userRoleId: assignment!.id,
      },
      headers,
    });
    const roleBody = await roleResponse.json();
    expect(roleResponse.ok(), JSON.stringify(roleBody)).toBe(true);
    expect(roleBody.result.nextRole).toBe("family_cfo");

    const refreshResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "refresh_user_invite",
        tenantSlug: "summit",
        userId: invited.id,
        validForDays: 14,
      },
      headers,
    });
    const refreshBody = await refreshResponse.json();
    expect(refreshResponse.ok(), JSON.stringify(refreshBody)).toBe(true);
    expect(refreshBody.result.status).toBe(UserStatus.INVITED);
    expect(refreshBody.result.inviteToken).toContain("av-invite-");

    const refreshedInvite = await prisma.userRole.findUniqueOrThrow({
      where: { id: assignment!.id },
    });
    expect(refreshedInvite.validUntil?.getTime() ?? 0).toBeGreaterThan(Date.now() + 13 * 24 * 60 * 60 * 1000);
    expect(refreshedInvite.validUntil?.getTime() ?? 0).toBeLessThan(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const refreshedStartResponse = await request.post("/api/auth/local", {
      data: { action: "start_login", email, password: passwordForEmail(email) },
    });
    const refreshedStartBody = await refreshedStartResponse.json();
    expect(refreshedStartResponse.ok(), JSON.stringify(refreshedStartBody)).toBe(true);
    expect(refreshedStartBody.nextStep).toBe("invite_acceptance_required");
    expect(refreshedStartBody.user.inviteToken).toBe(refreshBody.result.inviteToken);

    const revokeResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "revoke_user_invite",
        tenantSlug: "summit",
        userId: invited.id,
      },
      headers,
    });
    const revokeBody = await revokeResponse.json();
    expect(revokeResponse.ok(), JSON.stringify(revokeBody)).toBe(true);
    expect(revokeBody.result.status).toBe(UserStatus.ARCHIVED);
    expect(revokeBody.result.revokedAssignments).toBeGreaterThan(0);
  });

  test("verifies MFA only for a known DB user with the accepted local code", async ({ request }) => {
    const email = "cfo.bennett@example.demo";
    const startResponse = await request.post("/api/auth/local", {
      data: { action: "start_login", email, password: passwordForEmail(email) },
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.nextStep).toBe("mfa_required");
    expect(startBody.user.roleKey).toBe("family_cfo");

    const failedResponse = await request.post("/api/auth/local", {
      data: { action: "verify_mfa", code: "000000", email },
    });
    const failedBody = await failedResponse.json();

    expect(failedResponse.status(), JSON.stringify(failedBody)).toBe(403);
    expect(failedBody.reasonCode).toBe("LOCAL_AUTH_MFA_INVALID_CODE");

    const successResponse = await request.post("/api/auth/local", {
      data: { action: "verify_mfa", code: localAuthMfaCode, email },
    });
    const successBody = await successResponse.json();
    const successCookie = successResponse.headers()["set-cookie"] ?? "";

    expect(successResponse.ok(), JSON.stringify(successBody)).toBe(true);
    expect(successCookie).toContain(authJwtCookieName);
    expect(successBody.jwt.split(".")).toHaveLength(3);
    expect(successBody.result.currentUser.email).toBe(email);
    expect(successBody.result.tokenType).toBe("Bearer");

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.lastLoginAt).not.toBeNull();

    const audit = await prisma.auditEvent.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: {
        eventType: "auth.local.mfa.verified",
        targetId: user.id,
      },
    });
    expect(audit.result).toBe(AuditResult.SUCCESS);
  });

  test("denies invitation creation for non-admin JWT even when body spoofs admin", async ({ request }) => {
    const analystJwt = await issueTestAuthJwt(request, {
      email: "mira.analyst@alphavest.demo",
      roleKey: "analyst",
      tenantSlug: "morgan",
    });
    const response = await request.post("/api/admin-tenants", {
      data: {
        action: "invite_user",
        actorRoleKey: "admin",
        displayName: "Denied Invite",
        email: `local.denied.${Date.now()}@example.demo`,
        roleKey: "analyst",
        tenantSlug: "morgan",
      },
      headers: { Authorization: `Bearer ${analystJwt}` },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.reasonCode).toBe("LOCAL_INVITE_ACTOR_DENIED");
    expect(body.safety.authority).toBe("db-user-jwt");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("denies invitation creation without DB-user JWT before body validation", async ({ request }) => {
    const response = await request.post("/api/admin-tenants", {
      data: {
        action: "invite_user",
        displayName: "Missing Actor Invite",
        email: `local.missing.actor.${Date.now()}@example.demo`,
        roleKey: "analyst",
        tenantSlug: "summit",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety.authority).toBe("db-user-jwt");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("denies tenant-scoped admin actions outside the authenticated tenant", async ({ request }) => {
    const clientSuccessJwt = await issueTestAuthJwt(request, {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
      tenantSlug: "morgan",
    });
    const response = await request.post("/api/admin-tenants", {
      data: {
        action: "invite_user",
        displayName: "Wrong Tenant Invite",
        email: `local.cross.scope.${Date.now()}@example.demo`,
        roleKey: "analyst",
        tenantSlug: "summit",
      },
      headers: { Authorization: `Bearer ${clientSuccessJwt}` },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.reasonCode).toBe("SCOPE_DENIED");
    expect(body.issues).toContain("actor_tenant_scope_mismatch");
    expect(body.safety.roleKey).toBe("client_success");
    expect(body.safety.tenantSlug).toBe("summit");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.safety.scoped).toBe(false);
  });

  test("requires admin JWT and tenant scope for admin tenant readmodels", async ({ request }) => {
    const missingResponse = await request.get("/api/admin-tenants?surface=users&pageSize=1");
    const missingBody = await missingResponse.json();

    expect(missingResponse.status(), JSON.stringify(missingBody)).toBe(401);
    expect(missingBody.ok).toBe(false);
    expect(missingBody.safety.hiddenRowsDisclosed).toBe(false);

    const analystJwt = await issueTestAuthJwt(request, {
      email: "mira.analyst@alphavest.demo",
      roleKey: "analyst",
      tenantSlug: "morgan",
    });
    const analystResponse = await request.get("/api/admin-tenants?surface=users&pageSize=1&tenantSlug=morgan", {
      headers: { Authorization: `Bearer ${analystJwt}` },
    });
    const analystBody = await analystResponse.json();

    expect(analystResponse.status(), JSON.stringify(analystBody)).toBe(403);
    expect(analystBody.ok).toBe(false);
    expect(analystBody.reasonCode).toBe("PERMISSION_DENIED");
    expect(analystBody.safety.hiddenRowsDisclosed).toBe(false);

    const adminJwt = await issueTestAuthJwt(request, {
      email: "ava.admin@alphavest.demo",
      roleKey: "admin",
    });
    const adminResponse = await request.get("/api/admin-tenants?surface=users&pageSize=1", {
      headers: { Authorization: `Bearer ${adminJwt}` },
    });
    const adminBody = await adminResponse.json();

    expect(adminResponse.ok(), JSON.stringify(adminBody)).toBe(true);
    expect(adminBody.meta.sourceTruth).toBe("backend_query_backed");
    expect(adminBody.safety.authority).toBe("db-user-jwt");
    expect(adminBody.safety.roleKey).toBe("admin");
    expect(adminBody.safety.hiddenRowsDisclosed).toBe(false);

    const clientSuccessJwt = await issueTestAuthJwt(request, {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
      tenantSlug: "morgan",
    });
    const clientSuccessResponse = await request.get("/api/admin-tenants?surface=tenants&pageSize=10", {
      headers: { Authorization: `Bearer ${clientSuccessJwt}` },
    });
    const clientSuccessBody = await clientSuccessResponse.json();

    expect(clientSuccessResponse.ok(), JSON.stringify(clientSuccessBody)).toBe(true);
    expect(clientSuccessBody.safety.roleKey).toBe("client_success");
    expect(clientSuccessBody.safety.tenantSlug).toBe("morgan");
    expect(clientSuccessBody.tenantRows).toHaveLength(1);
    expect(clientSuccessBody.tenantRows[0].name).toContain("Morgan");
  });
});
