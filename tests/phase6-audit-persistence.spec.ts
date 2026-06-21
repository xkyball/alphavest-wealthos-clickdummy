import "dotenv/config";

import { execFileSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, ObjectType, PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  AuditMinimumFieldsError,
  auditService,
  firstBuildAuditContract,
} from "../lib/audit-service";
import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import {
  AuditPersistenceUnavailableError,
  runDemoWorkflowMutation,
} from "../lib/demo-workflow-mutation";

test.describe("First Build Phase 6 audit persistence", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Phase 6 audit persistence tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("enforces minimum audit fields for critical gate actions", () => {
    expect(() =>
      auditService.assertCriticalAuditWritable({
        action: "RELEASE",
        actorRoleKey: "compliance_officer",
        actorUserId: "20c160f7-6025-5000-b5ac-5777fb260c35",
        clientTenantId: "5db13e8a-61f5-5bb9-8576-7c81d4ac0044",
        eventType: "phase6.release.missing_fields",
        nextState: "CLIENT_VISIBLE",
        platformTenantId: demoPlatformTenantId,
        previousState: "COMPLIANCE_PENDING",
        reason: "Compliance release requires an audit row.",
        result: "SUCCESS",
        targetType: "RECOMMENDATION",
      }),
    ).toThrow(AuditMinimumFieldsError);
  });

  test("writes Phase 6 audit metadata for critical successful mutations", async () => {
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });

    const result = await runDemoWorkflowMutation(
      prisma,
      {
        actionId: "phase06.complianceReleaseAuditMetadata",
        actorRoleKey: "compliance_officer",
        clientTenantId: compliance.tenant.id,
        eventType: "phase06.audit.release_metadata",
        metadataJson: {
          proof: "critical_action_metadata",
        },
        nextState: "CLIENT_VISIBLE",
        permissionAction: "RELEASE",
        previousState: "COMPLIANCE_PENDING",
        reason: "Compliance released after gate proof.",
        sensitivity: "RESTRICTED",
        targetId: demoPlatformTenantId,
        targetType: ObjectType.RECOMMENDATION,
        tenantSlug: "summit",
        visibilityStatus: "COMPLIANCE_VISIBLE",
        workflowState: "COMPLIANCE_PENDING",
      },
      async () => ({ mutated: true }),
    );

    const audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: result.auditEventId },
    });
    const metadata = audit.metadataJson as {
      auditContract?: string;
      auditMinimumFields?: string[];
      criticalActionFamily?: string;
      failClosedOnAuditPersistence?: boolean;
    } | null;

    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.actorRoleKey).toBe("compliance_officer");
    expect(audit.previousState).toBe("COMPLIANCE_PENDING");
    expect(audit.nextState).toBe("CLIENT_VISIBLE");
    expect(metadata?.auditContract).toBe(firstBuildAuditContract);
    expect(metadata?.criticalActionFamily).toBe("release");
    expect(metadata?.failClosedOnAuditPersistence).toBe(true);
    expect(metadata?.auditMinimumFields).toEqual(
      expect.arrayContaining(["actorUserId", "actorRoleKey", "targetId", "previousState", "nextState", "result", "reason"]),
    );
  });

  test("fails closed before mutation when audit persistence is unavailable", async () => {
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    let mutateCalled = false;

    await expect(
      runDemoWorkflowMutation(
        prisma,
        {
          actionId: "phase06.auditUnavailableCriticalAction",
          actorRoleKey: "compliance_officer",
          auditPersistenceAvailable: false,
          clientTenantId: compliance.tenant.id,
          eventType: "phase06.audit.unavailable_critical_action",
          nextState: "CLIENT_VISIBLE",
          permissionAction: "RELEASE",
          previousState: "COMPLIANCE_PENDING",
          reason: "Compliance release requires audit persistence.",
          sensitivity: "RESTRICTED",
          targetId: demoPlatformTenantId,
          targetType: ObjectType.RECOMMENDATION,
          tenantSlug: "summit",
          visibilityStatus: "COMPLIANCE_VISIBLE",
          workflowState: "COMPLIANCE_PENDING",
        },
        async () => {
          mutateCalled = true;
          return { mutated: true };
        },
      ),
    ).rejects.toThrow(AuditPersistenceUnavailableError);

    expect(mutateCalled).toBe(false);
  });

  test("API reports audit outage as fail-closed without client release", async ({ request }) => {
    const beforeCount = await prisma.auditEvent.count({
      where: { eventType: "screencast.compliance.release_client" },
    });

    const response = await request.post("/api/demo-workflow", {
      data: {
        actionId: "j02.releaseClient",
        simulateAuditPersistenceFailure: true,
      },
    });
    const body = await response.json();

    const afterCount = await prisma.auditEvent.count({
      where: { eventType: "screencast.compliance.release_client" },
    });

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(body.auditPersistenceRequired).toBe(true);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(afterCount).toBe(beforeCount);
  });
});
