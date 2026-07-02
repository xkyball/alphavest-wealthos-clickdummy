import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  dataMaintenanceCanonicalApiRoute,
  dataMaintenanceCommandForAction,
  type DataMaintenanceWorkflowAction,
} from "../lib/data-maintenance-workflow-actions";
import { stableId } from "../lib/stable-id";
import { issueTestAuthJwt } from "./helpers/auth-jwt";

const dataMaintenanceActions: DataMaintenanceWorkflowAction[] = [
  "j04.portalUpload",
  "j04.openUploadDocument",
  "j04.uploadDocument",
  "j04.confirmFinalize",
  "j04.viewDetails",
  "j04.refreshReviewQueue",
  "j04.requestClarification",
  "j05.createEntity",
  "j05.continueEntity",
  "j05.editEntity",
  "j05.viewDetails",
  "j05.markReady",
  "j05.requestInfo",
  "j09.portalUpload",
  "j09.startClientIntake",
  "j09.submitProfile",
  "j09.addMember",
  "j09.saveFamilyChanges",
  "j09.openFamilyMap",
  "j09.addRelationship",
];

function scopeForAction(actionId: DataMaintenanceWorkflowAction) {
  if (actionId.startsWith("j04.")) return { roleKey: "family_cfo", tenantSlug: "morgan" };
  if (actionId === "j05.createEntity" || actionId === "j05.continueEntity" || actionId === "j05.editEntity") {
    return { roleKey: "principal", tenantSlug: "summit" };
  }
  if (actionId.startsWith("j05.")) return { roleKey: "principal", tenantSlug: "summit" };
  if (actionId === "j09.startClientIntake") return { roleKey: "principal", tenantSlug: "morgan" };

  return { roleKey: "principal", tenantSlug: "bennett" };
}

function spoofedRoleForAction(actionId: DataMaintenanceWorkflowAction) {
  const scope = scopeForAction(actionId);
  return scope.roleKey === "principal" ? "compliance_officer" : "principal";
}

test.describe("data maintenance typed actions API", () => {
  let prisma: PrismaClient;
  let bennettPrincipalJwt = "";
  let morganFamilyCfoJwt = "";
  let morganClientSuccessJwt = "";
  let morganPrincipalJwt = "";
  let summitPrincipalJwt = "";
  let bennettComplianceJwt = "";

  test.beforeAll(async ({ request }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for data maintenance action tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
    bennettPrincipalJwt = await issueTestAuthJwt(request, {
      email: "principal.bennett@example.demo",
      roleKey: "principal",
      tenantSlug: "bennett",
    });
    morganFamilyCfoJwt = await issueTestAuthJwt(request, {
      email: "cfo.morgan@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "morgan",
    });
    morganClientSuccessJwt = await issueTestAuthJwt(request, {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
      tenantSlug: "morgan",
    });
    morganPrincipalJwt = await issueTestAuthJwt(request, {
      email: "principal.morgan@example.demo",
      roleKey: "principal",
      tenantSlug: "morgan",
    });
    summitPrincipalJwt = await issueTestAuthJwt(request, {
      email: "principal.summit@example.demo",
      roleKey: "principal",
      tenantSlug: "summit",
    });
    bennettComplianceJwt = await issueTestAuthJwt(request, {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("executes J04/J05/J09 data maintenance commands through the typed surface", async ({ request }) => {
    for (const actionId of dataMaintenanceActions) {
      const scope = scopeForAction(actionId);
      const jwt =
        actionId === "j04.clientSafeEvidenceSummary"
          ? morganClientSuccessJwt
          : scope.roleKey === "family_cfo"
            ? morganFamilyCfoJwt
            : actionId === "j09.startClientIntake"
              ? morganPrincipalJwt
            : scope.tenantSlug === "summit"
              ? summitPrincipalJwt
              : bennettPrincipalJwt;
      const response = await request.post(dataMaintenanceCanonicalApiRoute, {
        data: { actionId, roleKey: spoofedRoleForAction(actionId), tenantSlug: scope.tenantSlug },
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body).toMatchObject({
        actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        clientVisible: false,
        command: dataMaintenanceCommandForAction(actionId),
        noAdviceExecution: true,
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
      expect(body.result.noAdviceExecution).toBe(true);
      expect(body.result.noClientRelease).toBe(true);

      const audit = await prisma.auditEvent.findUniqueOrThrow({
        where: { id: body.result.auditEventId },
      });
      const metadata = audit.metadataJson as { actionId?: string; canonicalApiRoute?: string; command?: string } | null;

      expect(audit.eventType).toMatch(/^data_maintenance\./);
      expect(metadata).toMatchObject({
        actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
      });
    }
  });

  test("rejects unsupported actions without command execution", async ({ request }) => {
    const response = await request.post(dataMaintenanceCanonicalApiRoute, {
      data: { actionId: "j02.requestEvidence" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body).toMatchObject({
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
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

  test("requires DB-user JWT before data maintenance mutation", async ({ request }) => {
    const relationshipId = stableId("relationship:bennett:principal-olivia-nextgen");
    const auditCountBefore = await prisma.auditEvent.count({
      where: {
        eventType: "data_maintenance.relationship.created",
        targetId: relationshipId,
      },
    });
    const response = await request.post(dataMaintenanceCanonicalApiRoute, {
      data: { actionId: "j09.addRelationship", tenantSlug: "bennett" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body).toMatchObject({
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      ok: false,
      reasonCode: "PERMISSION_DENIED",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: false,
      },
    });
    await expect(prisma.auditEvent.count({
      where: {
        eventType: "data_maintenance.relationship.created",
        targetId: relationshipId,
      },
    })).resolves.toBe(auditCountBefore);
  });

  test("rejects seeded object commands when DB-user JWT scope does not match the workflow object", async ({ request }) => {
    const relationshipId = stableId("relationship:bennett:principal-olivia-nextgen");
    const auditCountBefore = await prisma.auditEvent.count({
      where: {
        eventType: "data_maintenance.relationship.created",
        targetId: relationshipId,
      },
    });
    const response = await request.post(dataMaintenanceCanonicalApiRoute, {
      data: {
        actionId: "j09.addRelationship",
        roleKey: "principal",
        tenantSlug: "bennett",
      },
      headers: { Authorization: `Bearer ${summitPrincipalJwt}` },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body).toMatchObject({
      actionId: "j09.addRelationship",
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      issues: ["actor_tenant_scope_mismatch"],
      ok: false,
      reasonCode: "SCOPE_DENIED",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        roleKey: "principal",
        scoped: false,
        tenantSlug: "bennett",
      },
    });
    await expect(prisma.auditEvent.count({
      where: {
        eventType: "data_maintenance.relationship.created",
        targetId: relationshipId,
      },
    })).resolves.toBe(auditCountBefore);
  });

  test("executes J05 action commands against the selected workflow action item", async ({ request }) => {
    const actionItemId = stableId("action:bennett:tax-cert");
    const response = await request.post(dataMaintenanceCanonicalApiRoute, {
      data: {
        actionId: "j05.requestInfo",
        actionItemId,
        tenantSlug: "bennett",
      },
      headers: { Authorization: `Bearer ${bennettComplianceJwt}` },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.actionItemRows).toBe(1);
    expect(body.result.evidenceItemId).toBeTruthy();

    const actionItem = await prisma.actionItem.findUniqueOrThrow({
      where: { id: actionItemId },
    });

    expect(actionItem.status).toBe("AWAITING_INFO");
    expect(actionItem.blockedReason).toContain("Requested missing client consent evidence");
  });

  test("fails closed when a selected J05 action item is outside the tenant scope", async ({ request }) => {
    const missingActionItemId = stableId("action:morgan:not-in-bennett-scope");
    const auditCountBefore = await prisma.auditEvent.count({
      where: {
        targetId: missingActionItemId,
      },
    });
    const response = await request.post(dataMaintenanceCanonicalApiRoute, {
      data: {
        actionId: "j05.requestInfo",
        actionItemId: missingActionItemId,
        tenantSlug: "bennett",
      },
      headers: { Authorization: `Bearer ${bennettComplianceJwt}` },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body).toMatchObject({
      actionId: "j05.requestInfo",
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      ok: false,
      reasonCode: "SAFE_ERROR",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        roleKey: "compliance_officer",
        scoped: true,
        tenantSlug: "bennett",
      },
    });

    await expect(prisma.actionItem.findUnique({ where: { id: missingActionItemId } })).resolves.toBeNull();
    await expect(prisma.auditEvent.count({ where: { targetId: missingActionItemId } })).resolves.toBe(auditCountBefore);
  });
});
