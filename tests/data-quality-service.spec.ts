import "dotenv/config";

import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuditResult, ObjectType, PrismaClient, WorkflowStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { dataQualityService } from "../lib/data-quality-service";
import { createDemoSession, demoPlatformTenantId, demoTenants, type DemoTenantSlug } from "../lib/demo-session";
import { evidenceService } from "../lib/evidence-service";
import { exportService } from "../lib/export-service";
import { workflowGate } from "../lib/workflow-gate";

function tenantId(slug: DemoTenantSlug) {
  const tenant = demoTenants.find((candidate) => candidate.slug === slug);
  if (!tenant) throw new Error(`Unknown demo tenant: ${slug}`);
  return tenant.id;
}

function auditInput(reason: string) {
  const session = createDemoSession({ roleKey: "analyst", tenantSlug: "summit" });

  return {
    actorRoleKey: session.role.key,
    actorUserId: session.actor.id,
    platformTenantId: demoPlatformTenantId,
    reason,
  };
}

test.describe("Phase 17 data quality service", () => {
  let prisma: PrismaClient | undefined;

  test.beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Phase 17 data quality tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("blocks readiness when a tenant has open high-severity issues", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const snapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("northbridge"),
    });
    const gate = dataQualityService.evaluateDataQualityGate(snapshot);

    expect(snapshot.openIssueCount).toBeGreaterThan(0);
    expect(snapshot.highSeverityOpenCount).toBeGreaterThan(0);
    expect(snapshot.blocking).toBe(true);
    expect(gate.passed).toBe(false);
    expect(gate.missing).toContain("high_severity_data_quality_issues");
  });

  test("passes readiness when only completed issues remain open-filtered out", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const snapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("bennett"),
    });
    const gate = dataQualityService.evaluateDataQualityGate(snapshot);

    expect(snapshot.openIssueCount).toBe(0);
    expect(snapshot.highSeverityOpenCount).toBe(0);
    expect(snapshot.blocking).toBe(false);
    expect(gate.passed).toBe(true);
    expect(gate.missing).toEqual([]);
  });

  test("allows conditional release support when only non-high issues are open", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const snapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("summit"),
    });
    const gate = dataQualityService.evaluateDataQualityReleaseGate(snapshot);

    expect(snapshot.openIssueCount).toBeGreaterThan(0);
    expect(snapshot.highSeverityOpenCount).toBe(0);
    expect(gate.gateName).toBe("DATA_QUALITY_RELEASE_READY");
    expect(gate.passed).toBe(true);
    expect(gate.missing).toEqual([]);
  });

  test("creates an object-linked evidence gap that blocks only the configured tenant and object", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const targetId = randomUUID();
    const otherTargetId = randomUUID();
    const created = await dataQualityService.createDataQualityIssue(prisma, {
      audit: auditInput("Analyst found a missing evidence gap during D-008 review."),
      clientTenantId: tenantId("summit"),
      description: "Missing beneficial-owner evidence blocks readiness for this review object.",
      issueType: "missing_evidence",
      severity: "high",
      status: WorkflowStatus.IN_REVIEW,
      targetId,
      targetType: ObjectType.RECOMMENDATION,
    });

    const configuredObjectSnapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("summit"),
      targetId,
      targetType: ObjectType.RECOMMENDATION,
    });
    const unrelatedObjectSnapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("summit"),
      targetId: otherTargetId,
      targetType: ObjectType.RECOMMENDATION,
    });
    const unrelatedTenantSnapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: tenantId("morgan"),
      targetId,
      targetType: ObjectType.RECOMMENDATION,
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: created.auditEventId },
    });

    expect(configuredObjectSnapshot.blocking).toBe(true);
    expect(configuredObjectSnapshot.highSeverityOpenCount).toBe(1);
    expect(configuredObjectSnapshot.issues[0]?.id).toBe(created.issueId);
    expect(unrelatedObjectSnapshot.blocking).toBe(false);
    expect(unrelatedObjectSnapshot.openIssueCount).toBe(0);
    expect(unrelatedTenantSnapshot.blocking).toBe(false);
    expect(unrelatedTenantSnapshot.openIssueCount).toBe(0);
    expect(audit.eventType).toBe("data_quality.issue.created");
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.targetId).toBe(targetId);
  });

  test("blocks release/export while high-severity data quality is active and unblocks after audited resolution", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const session = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "summit" });
    const targetId = randomUUID();
    const created = await dataQualityService.createDataQualityIssue(prisma, {
      audit: auditInput("Compliance selected this data-quality blocker for release/export gating."),
      clientTenantId: session.tenant.id,
      description: "Conflicting entity owner data must be resolved before release or export.",
      issueType: "ownership_conflict",
      severity: "critical",
      targetId,
      targetType: ObjectType.EXPORT_REQUEST,
    });
    const activeSnapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: session.tenant.id,
      targetId,
      targetType: ObjectType.EXPORT_REQUEST,
    });
    const activeGate = dataQualityService.evaluateDataQualityReleaseGate(activeSnapshot);
    const sufficientEvidence = evidenceService.evaluateEvidenceSufficiency({
      accepted: true,
      current: true,
      relatedObjectId: targetId,
      relatedObjectType: "EXPORT_REQUEST",
      requiredObjectId: targetId,
      requiredObjectType: "EXPORT_REQUEST",
      reviewed: true,
      status: "RELEASED",
      visibilityStatus: "CLIENT_VISIBLE",
    });
    const blockedRelease = workflowGate.canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: true,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      dataQualityGate: activeGate,
      evidenceDecision: sufficientEvidence,
      payloadReady: true,
    });
    const blockedExport = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      clientTenantId: session.tenant.id,
      dataQualityGate: activeGate,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "client-safe-redacted",
      role: session.role,
      targetId: session.tenant.id,
      targetType: "EXPORT_REQUEST",
    });

    const resolved = await dataQualityService.resolveDataQualityIssue(prisma, {
      audit: {
        ...auditInput("Reviewed source evidence and resolved the selected data-quality blocker."),
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
      },
      issueId: created.issueId,
    });
    const resolvedSnapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
      clientTenantId: session.tenant.id,
      targetId,
      targetType: ObjectType.EXPORT_REQUEST,
    });
    const resolvedGate = dataQualityService.evaluateDataQualityReleaseGate(resolvedSnapshot);
    const allowedRelease = workflowGate.canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: true,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      dataQualityGate: resolvedGate,
      evidenceDecision: sufficientEvidence,
      payloadReady: true,
    });
    const allowedExport = exportService.canGenerateExport({
      actor: session.actor,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      clientTenantId: session.tenant.id,
      dataQualityGate: resolvedGate,
      externalShare: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      platformTenantId: demoPlatformTenantId,
      redactionProfile: "client-safe-redacted",
      role: session.role,
      targetId: session.tenant.id,
      targetType: "EXPORT_REQUEST",
    });
    const resolvedAudit = await prisma.auditEvent.findUniqueOrThrow({
      where: { id: resolved.auditEventId },
    });

    expect(activeGate.passed).toBe(false);
    expect(activeGate.missing).toContain("high_severity_data_quality_issues");
    expect(blockedRelease.passed).toBe(false);
    expect(blockedRelease.missing).toContain("data_quality_release_ready");
    expect(blockedRelease.missing).toContain("high_severity_data_quality_issues");
    expect(blockedExport.allowedToGenerate).toBe(false);
    expect(blockedExport.missing).toContain("data_quality_release_ready");
    expect(blockedExport.missing).toContain("high_severity_data_quality_issues");
    expect(resolvedSnapshot.openIssueCount).toBe(0);
    expect(resolvedGate.passed).toBe(true);
    expect(allowedRelease.passed).toBe(true);
    expect(allowedRelease.missing).toEqual([]);
    expect(allowedExport.allowedToGenerate).toBe(true);
    expect(allowedExport.missing).toEqual([]);
    expect(resolvedAudit.eventType).toBe("data_quality.issue.resolved");
    expect(resolvedAudit.previousState).toBe("DATA_QUALITY_BLOCKED");
    expect(resolvedAudit.nextState).toBe("DATA_QUALITY_RESOLVED");
  });

  test("does not silently unblock when required data-quality audit persistence is unavailable", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const targetId = randomUUID();
    const created = await dataQualityService.createDataQualityIssue(prisma, {
      audit: auditInput("Analyst opened blocker that must not resolve without audit."),
      clientTenantId: tenantId("summit"),
      description: "Audit persistence must be available before this blocker can resolve.",
      issueType: "audit_required_blocker",
      severity: "high",
      targetId,
      targetType: ObjectType.RECOMMENDATION,
    });

    await expect(
      dataQualityService.resolveDataQualityIssue(prisma, {
        audit: {
          ...auditInput("Attempted unblock while audit persistence was unavailable."),
          auditPersistenceAvailable: false,
        },
        issueId: created.issueId,
      }),
    ).rejects.toThrow("Required audit persistence is unavailable");

    const issue = await prisma.dataQualityIssue.findUniqueOrThrow({
      where: { id: created.issueId },
    });
    const unblockAuditCount = await prisma.auditEvent.count({
      where: {
        eventType: "data_quality.issue.resolved",
        targetId,
      },
    });

    expect(issue.status).toBe(WorkflowStatus.IN_REVIEW);
    expect(unblockAuditCount).toBe(0);
  });
});
