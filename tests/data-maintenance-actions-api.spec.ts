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

test.describe("data maintenance typed actions API", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for data maintenance action tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("executes J04/J05/J09 data maintenance commands through the typed surface", async ({ request }) => {
    for (const actionId of dataMaintenanceActions) {
      const response = await request.post(dataMaintenanceCanonicalApiRoute, {
        data: { actionId, ...scopeForAction(actionId) },
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
          commandExecuted: true,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: true,
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

  test("rejects data maintenance commands without explicit actor and tenant scope", async ({ request }) => {
    const relationshipId = stableId("relationship:bennett:principal-olivia-nextgen");
    const auditCountBefore = await prisma.auditEvent.count({
      where: {
        eventType: "data_maintenance.relationship.created",
        targetId: relationshipId,
      },
    });
    const response = await request.post(dataMaintenanceCanonicalApiRoute, {
      data: { actionId: "j09.addRelationship" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body).toMatchObject({
      actionId: "j09.addRelationship",
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      issues: ["valid_actor_role_required", "valid_tenant_scope_required"],
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
    await expect(prisma.auditEvent.count({
      where: {
        eventType: "data_maintenance.relationship.created",
        targetId: relationshipId,
      },
    })).resolves.toBe(auditCountBefore);
  });

  test("rejects seeded object commands when actor scope does not match the workflow object", async ({ request }) => {
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
        tenantSlug: "summit",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body).toMatchObject({
      actionId: "j09.addRelationship",
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      issues: ["actor_scope_mismatch"],
      ok: false,
      reasonCode: "SCOPE_DENIED",
      safety: {
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

  test("executes J05 action commands against the selected workflow action item", async ({ request }) => {
    const actionItemId = stableId("action:bennett:tax-cert");
    const response = await request.post(dataMaintenanceCanonicalApiRoute, {
      data: {
        actionId: "j05.requestInfo",
        actionItemId,
        roleKey: "compliance_officer",
        tenantSlug: "bennett",
      },
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
        roleKey: "compliance_officer",
        tenantSlug: "bennett",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body).toMatchObject({
      actionId: "j05.requestInfo",
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      ok: false,
      reasonCode: "SAFE_ERROR",
      safety: {
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
    });

    await expect(prisma.actionItem.findUnique({ where: { id: missingActionItemId } })).resolves.toBeNull();
    await expect(prisma.auditEvent.count({ where: { targetId: missingActionItemId } })).resolves.toBe(auditCountBefore);
  });
});
