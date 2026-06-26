import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  tenantGovernanceCanonicalApiRoute,
  tenantGovernanceCommandForAction,
  type TenantGovernanceWorkflowAction,
} from "../lib/tenant-governance-workflow-actions";

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

  test("executes J06/J07 tenant, user, role and governance commands outside demo workflow", async ({ request }) => {
    for (const actionId of tenantGovernanceActions) {
      const response = await request.post(tenantGovernanceCanonicalApiRoute, {
        data: { actionId },
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
      const metadata = audit.metadataJson as { actionId?: string; canonicalApiRoute?: string; command?: string } | null;

      expect(audit.eventType).toMatch(/^tenant_governance\./);
      expect(metadata).toMatchObject({
        actionId,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
      });
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
});
