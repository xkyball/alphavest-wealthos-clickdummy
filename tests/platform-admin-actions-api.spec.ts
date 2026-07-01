import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  platformAdminCanonicalApiRoute,
  platformAdminCommandForAction,
  platformAdminScopeForAction,
  type PlatformAdminWorkflowAction,
} from "../lib/platform-admin-workflow-actions";
import { issueTestAuthJwt } from "./helpers/auth-jwt";

const platformAdminActions: PlatformAdminWorkflowAction[] = [
  "j10.savePlatform",
  "j10.viewAudit",
  "j10.reviewPermission",
  "j10.saveSecurity",
];
let adminJwt = "";
let securityJwt = "";
let analystJwt = "";

function jwtForAction(actionId: PlatformAdminWorkflowAction) {
  return platformAdminScopeForAction(actionId).roleKey === "security_officer" ? securityJwt : adminJwt;
}

function spoofedRoleForAction(actionId: PlatformAdminWorkflowAction) {
  return platformAdminScopeForAction(actionId).roleKey === "security_officer" ? "admin" : "security_officer";
}

test.describe("platform admin typed actions API", () => {
  let prisma: PrismaClient;

  test.beforeAll(async ({ request }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for platform admin action tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
    adminJwt = await issueTestAuthJwt(request, {
      email: "ava.admin@alphavest.demo",
      roleKey: "admin",
    });
    securityJwt = await issueTestAuthJwt(request, {
      email: "sam.security@alphavest.demo",
      roleKey: "security_officer",
    });
    analystJwt = await issueTestAuthJwt(request, {
      email: "mira.analyst@alphavest.demo",
      roleKey: "analyst",
      tenantSlug: "morgan",
    });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("executes J10 platform and security commands through the typed surface", async ({ request }) => {
    for (const actionId of platformAdminActions) {
      const response = await request.post(platformAdminCanonicalApiRoute, {
        data: { actionId, roleKey: spoofedRoleForAction(actionId), tenantSlug: "summit" },
        headers: { Authorization: `Bearer ${jwtForAction(actionId)}` },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body).toMatchObject({
        actionId,
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        clientVisible: false,
        command: platformAdminCommandForAction(actionId),
        noClientRelease: true,
        ok: true,
        safety: {
          authority: "db-user-jwt",
          commandExecuted: true,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          roleKey: platformAdminScopeForAction(actionId).roleKey,
          scoped: true,
          tenantSlug: "summit",
        },
      });
      expect(body.result.auditEventId).toBeTruthy();
      expect(body.result.auditRows).toBe(1);
      expect(body.result.clientVisible).toBe(false);

      const audit = await prisma.auditEvent.findUniqueOrThrow({
        where: { id: body.result.auditEventId },
      });
      const metadata = audit.metadataJson as { canonicalApiRoute?: string; command?: string; noAdviceExecution?: boolean } | null;

      expect(audit.eventType).toMatch(/^platform_admin\./);
      expect(metadata).toMatchObject({
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        command: platformAdminCommandForAction(actionId),
        noAdviceExecution: true,
      });
    }
  });

  test("rejects unsupported actions without command execution", async ({ request }) => {
    const response = await request.post(platformAdminCanonicalApiRoute, {
      data: { actionId: "j01.requestData" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body).toMatchObject({
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      noClientRelease: true,
      ok: false,
      reasonCode: "INVALID_REQUEST",
      safety: {
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: false,
      },
    });
  });

  test("requires DB-user JWT and denies body role spoofing", async ({ request }) => {
    const missingJwtResponse = await request.post(platformAdminCanonicalApiRoute, {
      data: { actionId: "j10.saveSecurity" },
    });
    const missingJwtBody = await missingJwtResponse.json();

    expect(missingJwtResponse.status(), JSON.stringify(missingJwtBody)).toBe(401);
    expect(missingJwtBody).toMatchObject({
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      ok: false,
      reasonCode: "PERMISSION_DENIED",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        scoped: false,
      },
    });

    const auditCountBefore = await prisma.auditEvent.count({
      where: { eventType: "platform_admin.security.configuration_saved" },
    });
    const spoofedBodyResponse = await request.post(platformAdminCanonicalApiRoute, {
      data: {
        actionId: "j10.saveSecurity",
        roleKey: "security_officer",
        tenantSlug: "morgan",
      },
      headers: { Authorization: `Bearer ${adminJwt}` },
    });
    const spoofedBody = await spoofedBodyResponse.json();

    expect(spoofedBodyResponse.status(), JSON.stringify(spoofedBody)).toBe(403);
    expect(spoofedBody).toMatchObject({
      actionId: "j10.saveSecurity",
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      ok: false,
      reasonCode: "SCOPE_DENIED",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        roleKey: "admin",
        scoped: false,
        tenantSlug: "morgan",
      },
    });
    await expect(
      prisma.auditEvent.count({ where: { eventType: "platform_admin.security.configuration_saved" } }),
    ).resolves.toBe(auditCountBefore);

    const analystSpoofResponse = await request.post(platformAdminCanonicalApiRoute, {
      data: {
        actionId: "j10.savePlatform",
        roleKey: "admin",
        tenantSlug: "morgan",
      },
      headers: { Authorization: `Bearer ${analystJwt}` },
    });
    const analystSpoofBody = await analystSpoofResponse.json();

    expect(analystSpoofResponse.status(), JSON.stringify(analystSpoofBody)).toBe(403);
    expect(analystSpoofBody.safety).toMatchObject({
      authority: "db-user-jwt",
      commandExecuted: false,
      roleKey: "analyst",
      scoped: false,
      tenantSlug: "morgan",
    });
  });
});
