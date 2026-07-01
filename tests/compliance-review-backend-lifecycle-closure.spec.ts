import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AdviceClassification,
  AuditResult,
  ComplianceStatus,
  ObjectType,
  PrismaClient,
  ProcessInstanceStatus,
  ProcessStepStatus,
  RecommendationStatus,
} from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  closeComplianceReviewBackendLifecycle,
  complianceReviewBackendLifecycleGapStepIds,
  complianceReviewBackendLifecycleProcessIds,
  complianceReviewBackendLifecycleTicketId,
} from "../lib/compliance-review-backend-lifecycle-closure";
import { complianceReviewReleaseContractId } from "../lib/compliance-review-release-contract";
import { requireActorSession } from "../lib/actor-session";
import { stableId } from "../lib/stable-id";

test.describe.configure({ mode: "serial" });

test.describe("DOMAIN-G backend lifecycle closure", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for compliance review backend lifecycle tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  async function upsertLifecycleComplianceReview(runKey: string) {
    const session = requireActorSession({ roleKey: "compliance_officer", tenantSlug: "morgan" });
    const recommendationId = stableId(`compliance-review-backend-lifecycle:${runKey}:recommendation`);
    const complianceReviewId = stableId(`compliance-review-backend-lifecycle:${runKey}:compliance-review`);

    await prisma.recommendation.upsert({
      create: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        clientTenantId: session.tenant.id,
        clientVisible: false,
        complianceReviewId,
        createdByUserId: session.actor.id,
        id: recommendationId,
        riskSummary: "Backend lifecycle proof target; compliance release is not client acceptance.",
        status: RecommendationStatus.COMPLIANCE_PENDING,
        summaryInternal: "Internal-only recommendation used to prove DOMAIN-G backend lifecycle closure.",
        title: "DOMAIN-G backend lifecycle closure target",
      },
      update: {
        clientVisible: false,
        complianceReviewId,
        riskSummary: "Backend lifecycle proof target; compliance release is not client acceptance.",
        status: RecommendationStatus.COMPLIANCE_PENDING,
        summaryInternal: "Internal-only recommendation used to prove DOMAIN-G backend lifecycle closure.",
        title: "DOMAIN-G backend lifecycle closure target",
      },
      where: { id: recommendationId },
    });

    await prisma.complianceReview.upsert({
      create: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        clientTenantId: session.tenant.id,
        evidenceComplete: true,
        id: complianceReviewId,
        kycFicaStatus: "clear",
        popiaConsentStatus: "clear",
        recordOfAdviceRequired: true,
        releaseNotes: "Lifecycle proof keeps release state pending; no client visibility is granted.",
        reviewerUserId: session.actor.id,
        status: ComplianceStatus.PENDING,
        targetId: recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        blockedAt: null,
        evidenceComplete: true,
        kycFicaStatus: "clear",
        popiaConsentStatus: "clear",
        releasedAt: null,
        releaseNotes: "Lifecycle proof keeps release state pending; no client visibility is granted.",
        reviewerUserId: session.actor.id,
        status: ComplianceStatus.PENDING,
      },
      where: { id: complianceReviewId },
    });

    return { complianceReviewId, recommendationId };
  }

  test("closes all DOMAIN-G compliance release process steps with persisted audit and command runs", async () => {
    const runKey = "positive-domain-g-lifecycle";
    const { complianceReviewId, recommendationId } = await upsertLifecycleComplianceReview(runKey);

    const result = await closeComplianceReviewBackendLifecycle(prisma, {
      actorRoleKey: "compliance_officer",
      complianceReviewId,
      reason: "Close DOMAIN-G compliance release backend lifecycle with persisted step audit proof.",
      runKey,
      tenantSlug: "morgan",
    });

    expect(result.ticketId).toBe(complianceReviewBackendLifecycleTicketId);
    expect(result.contractId).toBe(complianceReviewReleaseContractId);
    expect(result.completedProcessIds).toEqual([...complianceReviewBackendLifecycleProcessIds]);
    expect(result.completedStepIds).toHaveLength(40);
    expect(result.closedGapStepIds.sort()).toEqual([...complianceReviewBackendLifecycleGapStepIds].sort());
    expect(result.auditEventIds).toHaveLength(40);
    expect(result.commandRunCount).toBe(40);
    expect(result.complianceReviewStatus).toBe(ComplianceStatus.PENDING);
    expect(result.recommendationClientVisible).toBe(false);
    expect(Object.values(result.processStatusById)).toEqual(
      Array.from({ length: complianceReviewBackendLifecycleProcessIds.length }, () => ProcessInstanceStatus.COMPLETED),
    );

    const [instances, audits, commandRuns, recommendation, complianceReview] = await Promise.all([
      prisma.processInstance.findMany({
        include: {
          commandRuns: true,
          processDefinition: true,
          steps: true,
        },
        where: { id: { in: result.processInstanceIds } },
      }),
      prisma.auditEvent.findMany({ where: { id: { in: result.auditEventIds } } }),
      prisma.processCommandRun.findMany({
        where: { processInstanceId: { in: result.processInstanceIds } },
      }),
      prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } }),
      prisma.complianceReview.findUniqueOrThrow({ where: { id: complianceReviewId } }),
    ]);

    expect(instances).toHaveLength(8);
    expect(instances.every((instance) => instance.status === ProcessInstanceStatus.COMPLETED)).toBe(true);
    expect(instances.every((instance) => instance.steps.every((step) => step.status === ProcessStepStatus.COMPLETED))).toBe(true);
    expect(instances.every((instance) => instance.commandRuns.length === 5)).toBe(true);
    expect(audits.every((audit) => audit.eventType === "compliance_review.backend_lifecycle.step.completed")).toBe(true);
    expect(audits.every((audit) => audit.result === AuditResult.SUCCESS)).toBe(true);
    expect(audits.every((audit) => audit.targetType === ObjectType.PROCESS)).toBe(true);
    expect(commandRuns.map((run) => run.fromStepId).sort()).toEqual(result.completedStepIds.sort());
    expect(commandRuns.every((run) => run.auditEventId !== null)).toBe(true);
    expect(recommendation.clientVisible).toBe(false);
    expect(recommendation.status).toBe(RecommendationStatus.COMPLIANCE_PENDING);
    expect(complianceReview.status).toBe(ComplianceStatus.PENDING);
    expect(complianceReview.releasedAt).toBeNull();
  });

  test("fails closed before mutation when audit persistence is unavailable", async () => {
    const runKey = "negative-domain-g-audit-unavailable";
    const { complianceReviewId, recommendationId } = await upsertLifecycleComplianceReview(runKey);
    const before = await Promise.all([
      prisma.processInstance.count(),
      prisma.processCommandRun.count(),
      prisma.auditEvent.count(),
    ]);

    await expect(
      closeComplianceReviewBackendLifecycle(prisma, {
        actorRoleKey: "compliance_officer",
        auditPersistenceAvailable: false,
        complianceReviewId,
        reason: "Attempt DOMAIN-G lifecycle closure while audit persistence is unavailable.",
        runKey,
        tenantSlug: "morgan",
      }),
    ).rejects.toMatchObject({
      reasonCode: "compliance_review_backend_lifecycle_audit_failed_closed",
    });

    const after = await Promise.all([
      prisma.processInstance.count(),
      prisma.processCommandRun.count(),
      prisma.auditEvent.count(),
    ]);
    const links = await prisma.processObjectLink.findMany({
      where: {
        objectId: recommendationId,
        objectType: ObjectType.RECOMMENDATION,
        processInstance: {
          processDefinition: {
            processId: { in: [...complianceReviewBackendLifecycleProcessIds] },
          },
        },
      },
    });
    const complianceReview = await prisma.complianceReview.findUniqueOrThrow({ where: { id: complianceReviewId } });

    expect(after).toEqual(before);
    expect(links).toEqual([]);
    expect(complianceReview.status).toBe(ComplianceStatus.PENDING);
    expect(complianceReview.releasedAt).toBeNull();
  });
});
