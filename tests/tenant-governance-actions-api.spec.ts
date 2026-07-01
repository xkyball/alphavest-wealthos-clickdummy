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
import { stableId } from "../lib/stable-id";

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

test.describe("tenant governance typed actions API", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for tenant governance action tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("executes J06/J07 tenant, user, role and governance commands through the typed surface", async ({ request }) => {
    for (const actionId of tenantGovernanceActions) {
      const response = await request.post(tenantGovernanceCanonicalApiRoute, {
        data: { actionId, ...tenantGovernanceScopeForAction(actionId) },
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

  test("requires explicit actor scope and denies mismatched governance authority", async ({ request }) => {
    const missingScopeResponse = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: { actionId: "j07.approveAccess" },
    });
    const missingScopeBody = await missingScopeResponse.json();

    expect(missingScopeResponse.status(), JSON.stringify(missingScopeBody)).toBe(400);
    expect(missingScopeBody).toMatchObject({
      actionId: "j07.approveAccess",
      canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
      ok: false,
      reasonCode: "INVALID_REQUEST",
      safety: {
        commandExecuted: false,
        scoped: false,
      },
    });

    const mismatchedScopeResponse = await request.post(tenantGovernanceCanonicalApiRoute, {
      data: {
        actionId: "j07.saveRoleChanges",
        roleKey: "admin",
        tenantSlug: "morgan",
      },
    });
    const mismatchedScopeBody = await mismatchedScopeResponse.json();

    expect(mismatchedScopeResponse.status(), JSON.stringify(mismatchedScopeBody)).toBe(403);
    expect(mismatchedScopeBody).toMatchObject({
      actionId: "j07.saveRoleChanges",
      canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
      ok: false,
      reasonCode: "SCOPE_DENIED",
      safety: {
        commandExecuted: false,
        scoped: false,
      },
    });
  });
});
