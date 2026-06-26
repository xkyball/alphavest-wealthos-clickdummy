import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  platformAdminCanonicalApiRoute,
  platformAdminCommandForAction,
  type PlatformAdminWorkflowAction,
} from "../lib/platform-admin-workflow-actions";

const platformAdminActions: PlatformAdminWorkflowAction[] = [
  "j10.savePlatform",
  "j10.viewAudit",
  "j10.reviewPermission",
  "j10.saveSecurity",
];

test.describe("platform admin typed actions API", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for platform admin action tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("executes J10 platform and security commands through the typed surface", async ({ request }) => {
    for (const actionId of platformAdminActions) {
      const response = await request.post(platformAdminCanonicalApiRoute, {
        data: { actionId },
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
});
