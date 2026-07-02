import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  tenantGovernanceScopeForAction,
  tenantGovernanceCanonicalApiRoute,
  tenantGovernanceCommandForAction,
  type TenantGovernanceWorkflowAction,
} from "../lib/tenant-governance-workflow-actions";
import { actorTenantSlugFromDisplayName } from "../lib/actor-session";
import { stableId } from "../lib/stable-id";
import { issueTestAuthJwt } from "./helpers/auth-jwt";

const tenantGovernanceActions: TenantGovernanceWorkflowAction[] = [
  "j06.newTenant",
  "j06.continueTenant",
  "j06.assignTeam",
  "j06.openInvitation",
  "j06.sendInvitation",
  "j07.inviteUser",
  "j07.sendInvitation",
  "j07.saveRoleChanges",
  "j07.approveAccess",
  "j07.exportAudit",
];
let adminJwt = "";
let securityJwt = "";
let complianceJwt = "";
let analystJwt = "";
let clientSuccessJwt = "";

function jwtForAction(actionId: TenantGovernanceWorkflowAction) {
  const scope = tenantGovernanceScopeForAction(actionId);
  if (scope.roleKey === "security_officer") return securityJwt;
  if (scope.roleKey === "compliance_officer") return complianceJwt;

  return adminJwt;
}

function spoofedRoleForAction(actionId: TenantGovernanceWorkflowAction) {
  const scope = tenantGovernanceScopeForAction(actionId);
  if (scope.roleKey === "admin") return "security_officer";
  if (scope.roleKey === "security_officer") return "admin";

  return "analyst";
}

test.describe("tenant governance typed actions API", () => {
  let prisma: PrismaClient;

  test.beforeAll(async ({ request }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for tenant governance action tests.");
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
    complianceJwt = await issueTestAuthJwt(request, {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "northbridge",
    });
    analystJwt = await issueTestAuthJwt(request, {
      email: "mira.analyst@alphavest.demo",
      roleKey: "analyst",
      tenantSlug: "northbridge",
    });
    clientSuccessJwt = await issueTestAuthJwt(request, {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
      tenantSlug: "morgan",
    });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("executes J06/J07 tenant, user, role and governance commands through the typed surface", async ({ request }) => {
    for (const actionId of tenantGovernanceActions) {
      const scope = tenantGovernanceScopeForAction(actionId);
      const response = await request.post(tenantGovernanceCanonicalApiRoute, {
        data: { actionId, roleKey: spoofedRoleForAction(actionId), tenantSlug: scope.tenantSlug },
        headers: { Authorization: `Bearer ${jwtForAction(actionId)}` },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body).toMatchObject({
        actionId,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        clientVisible: false,
        command: tenantGovernanceCommandForAction(actionId),
        noClientRelease: true,
        ok: true,
        safety: {
          authority: "db-user-jwt",
          commandExecuted: true,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          roleKey: scope.roleKey,
          scoped: true,
          tenantSlug: scope.tenantSlug,
        },
      });
      expect(body.result.auditEventId).toBeTruthy();
      expect(body.result.auditRows).toBe(1);
      expect(body.result.clientVisible).toBe(false);

      const audit = await prisma.auditEvent.findUniqueOrThrow({
        where: { id: body.result.auditEventId },
      });
      const metadata = audit.metadataJson as {
        actionId?: string;
        canonicalApiRoute?: string;
        command?: string;
        inviteEmail?: string;
      } | null;

      expect(audit.eventType).toMatch(/^tenant_governance\./);
      expect(metadata).toMatchObject({
        actionId,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
      });

      if (actionId === "j06.openInvitation" || actionId === "j06.sendInvitation") {
        expect(audit.reason).not.toMatch(/\bdemo\b/i);
        expect(metadata?.inviteEmail).toBe("principal.morgan@morganfamilyoffice.example");
        expect(metadata?.inviteEmail).not.toContain(".demo");
      }

      if (actionId === "j06.sendInvitation") {
        const consent = await prisma.consentRecord.findUniqueOrThrow({
          where: { id: stableId("consent:morgan:principal:onboarding-invite:2026.06") },
        });

        expect(consent.source).toBe("onboarding_invite");
      }
    }
  });

  test("allows Client Success to start the J06 tenant onboarding command without admin escalation", async ({ request }) => {
    const response = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: { actionId: "j06.newTenant", tenantSlug: "morgan" },
      headers: { Authorization: `Bearer ${clientSuccessJwt}` },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body).toMatchObject({
      actionId: "j06.newTenant",
      command: tenantGovernanceCommandForAction("j06.newTenant"),
      ok: true,
      safety: {
        authority: "db-user-jwt",
        commandExecuted: true,
        noAdviceExecution: true,
        noClientRelease: true,
        roleKey: "client_success",
        scoped: true,
        tenantSlug: "morgan",
      },
    });
  });

  test("scopes J06 and J07 invitation commands to a newly created tenant draft", async ({ request }) => {
    const displayName = `Van der Merwe Governance ${Date.now()}`;
    const tenantSlug = actorTenantSlugFromDisplayName(displayName);
    const createResponse = await request.post("/api/admin-tenants", {
      data: {
        action: "create_tenant",
        displayName,
        jurisdiction: "South Africa",
        relationshipTier: "Signature",
      },
      headers: { Authorization: `Bearer ${adminJwt}` },
    });
    const createBody = await createResponse.json();

    expect(createResponse.ok(), JSON.stringify(createBody)).toBe(true);
    expect(createBody.result.tenant).toMatchObject({
      displayName,
      slug: tenantSlug,
      status: "DRAFT",
    });

    const j06Response = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: { actionId: "j06.sendInvitation", tenantSlug },
      headers: { Authorization: `Bearer ${clientSuccessJwt}` },
    });
    const j06Body = await j06Response.json();

    expect(j06Response.ok(), JSON.stringify(j06Body)).toBe(true);
    expect(j06Body).toMatchObject({
      actionId: "j06.sendInvitation",
      command: tenantGovernanceCommandForAction("j06.sendInvitation"),
      ok: true,
      safety: {
        authority: "db-user-jwt",
        commandExecuted: true,
        roleKey: "client_success",
        scoped: true,
        tenantSlug,
      },
    });

    const j06Audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: j06Body.result.auditEventId },
    });
    const j06Metadata = j06Audit.metadataJson as { inviteEmail?: string; tenantSlug?: string } | null;

    expect(j06Audit.clientTenantId).toBe(createBody.result.tenant.id);
    expect(j06Metadata).toMatchObject({
      inviteEmail: `principal.${tenantSlug}@example.demo`,
      tenantSlug,
    });
    expect(j06Metadata?.inviteEmail).not.toContain("morgan");
    expect(j06Metadata?.inviteEmail).not.toContain("northbridge");

    const consent = await prisma.consentRecord.findUniqueOrThrow({
      where: { id: stableId(`consent:${tenantSlug}:principal:onboarding-invite:2026.06`) },
    });
    expect(consent.clientTenantId).toBe(createBody.result.tenant.id);

    const j07Response = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: { actionId: "j07.sendInvitation", tenantSlug },
      headers: { Authorization: `Bearer ${adminJwt}` },
    });
    const j07Body = await j07Response.json();

    expect(j07Response.ok(), JSON.stringify(j07Body)).toBe(true);
    expect(j07Body.safety).toMatchObject({
      authority: "db-user-jwt",
      commandExecuted: true,
      roleKey: "admin",
      scoped: true,
      tenantSlug,
    });

    const j07Audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: j07Body.result.auditEventId },
    });
    const j07Metadata = j07Audit.metadataJson as { inviteEmail?: string; tenantSlug?: string } | null;

    expect(j07Audit.clientTenantId).toBe(createBody.result.tenant.id);
    expect(j07Metadata).toMatchObject({
      inviteEmail: `delegate.${tenantSlug}@example.demo`,
      tenantSlug,
    });
    expect(j07Metadata?.inviteEmail).not.toContain("morgan");
    expect(j07Metadata?.inviteEmail).not.toContain("northbridge");
  });

  test("rejects unsupported actions without command execution", async ({ request }) => {
    const response = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: { actionId: "j01.requestData" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body).toMatchObject({
      canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
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

  test("requires DB-user JWT, target tenant and denies body role spoofing", async ({ request }) => {
    const missingJwtResponse = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: { actionId: "j07.approveAccess", tenantSlug: "northbridge" },
    });
    const missingJwtBody = await missingJwtResponse.json();

    expect(missingJwtResponse.status(), JSON.stringify(missingJwtBody)).toBe(401);
    expect(missingJwtBody).toMatchObject({
      canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
      ok: false,
      reasonCode: "PERMISSION_DENIED",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        scoped: false,
      },
    });

    const missingTenantResponse = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: { actionId: "j07.approveAccess" },
      headers: { Authorization: `Bearer ${complianceJwt}` },
    });
    const missingTenantBody = await missingTenantResponse.json();

    expect(missingTenantResponse.status(), JSON.stringify(missingTenantBody)).toBe(400);
    expect(missingTenantBody).toMatchObject({
      actionId: "j07.approveAccess",
      canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
      ok: false,
      reasonCode: "INVALID_REQUEST",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        roleKey: "compliance_officer",
        scoped: false,
      },
    });

    const auditCountBefore = await prisma.auditEvent.count({
      where: { eventType: "tenant_governance.governance.role_sensitive_change_confirmed" },
    });
    const spoofedBodyResponse = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: {
        actionId: "j07.saveRoleChanges",
        roleKey: "security_officer",
        tenantSlug: "northbridge",
      },
      headers: { Authorization: `Bearer ${adminJwt}` },
    });
    const spoofedBody = await spoofedBodyResponse.json();

    expect(spoofedBodyResponse.status(), JSON.stringify(spoofedBody)).toBe(403);
    expect(spoofedBody).toMatchObject({
      actionId: "j07.saveRoleChanges",
      canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
      ok: false,
      reasonCode: "SCOPE_DENIED",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        roleKey: "admin",
        scoped: false,
        tenantSlug: "northbridge",
      },
    });
    await expect(
      prisma.auditEvent.count({
        where: { eventType: "tenant_governance.governance.role_sensitive_change_confirmed" },
      }),
    ).resolves.toBe(auditCountBefore);

    const analystSpoofResponse = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: {
        actionId: "j07.approveAccess",
        roleKey: "compliance_officer",
        tenantSlug: "northbridge",
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
      tenantSlug: "northbridge",
    });
  });
});
