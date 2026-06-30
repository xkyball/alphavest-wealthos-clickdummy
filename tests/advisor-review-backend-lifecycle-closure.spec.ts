import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AdviceClassification,
  AuditResult,
  ObjectType,
  PrismaClient,
  ProcessInstanceStatus,
  ProcessStepStatus,
  RecommendationStatus,
} from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  advisorReviewBackendLifecycleGapStepIds,
  advisorReviewBackendLifecycleProcessIds,
  advisorReviewBackendLifecycleTicketId,
  closeAdvisorReviewBackendLifecycle,
} from "../lib/advisor-review-backend-lifecycle-closure";
import { advisorReviewApprovalContractId } from "../lib/advisor-review-approval-contract";
import { requireActorSession } from "../lib/actor-session";
import { stableId } from "../lib/stable-id";

test.describe.configure({ mode: "serial" });

test.describe("DOMAIN-10 backend lifecycle closure", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for advisor review backend lifecycle tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  async function upsertLifecycleRecommendation(runKey: string) {
    const session = requireActorSession({ roleKey: "senior_wealth_advisor", tenantSlug: "morgan" });
    const recommendationId = stableId(`advisor-review-backend-lifecycle:${runKey}:recommendation`);

    await prisma.recommendation.upsert({
      create: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        clientTenantId: session.tenant.id,
        clientVisible: false,
        createdByUserId: session.actor.id,
        id: recommendationId,
        riskSummary: "Backend lifecycle proof target; advisor review is not release.",
        status: RecommendationStatus.ADVISOR_PENDING,
        summaryInternal: "Internal-only recommendation used to prove DOMAIN-F backend lifecycle closure.",
        title: "DOMAIN-10 backend lifecycle closure target",
      },
      update: {
        clientVisible: false,
        riskSummary: "Backend lifecycle proof target; advisor review is not release.",
        status: RecommendationStatus.ADVISOR_PENDING,
        summaryInternal: "Internal-only recommendation used to prove DOMAIN-F backend lifecycle closure.",
        title: "DOMAIN-10 backend lifecycle closure target",
      },
      where: { id: recommendationId },
    });

    return recommendationId;
  }

  test("closes all DOMAIN-F advisor review process steps with persisted audit and command runs", async () => {
    const runKey = "positive-domain-f-lifecycle";
    const recommendationId = await upsertLifecycleRecommendation(runKey);

    const result = await closeAdvisorReviewBackendLifecycle(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      reason: "Close DOMAIN-F advisor review backend lifecycle with persisted step audit proof.",
      recommendationId,
      runKey,
      tenantSlug: "morgan",
    });

    expect(result.ticketId).toBe(advisorReviewBackendLifecycleTicketId);
    expect(result.contractId).toBe(advisorReviewApprovalContractId);
    expect(result.completedProcessIds).toEqual([...advisorReviewBackendLifecycleProcessIds]);
    expect(result.completedStepIds).toHaveLength(24);
    expect(result.closedGapStepIds.sort()).toEqual([...advisorReviewBackendLifecycleGapStepIds].sort());
    expect(result.auditEventIds).toHaveLength(24);
    expect(result.commandRunCount).toBe(24);
    expect(result.recommendationClientVisible).toBe(false);
    expect(Object.values(result.processStatusById)).toEqual(
      Array.from({ length: advisorReviewBackendLifecycleProcessIds.length }, () => ProcessInstanceStatus.COMPLETED),
    );

    const [instances, audits, commandRuns] = await Promise.all([
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
    ]);

    expect(instances).toHaveLength(6);
    expect(instances.every((instance) => instance.status === ProcessInstanceStatus.COMPLETED)).toBe(true);
    expect(instances.every((instance) => instance.steps.every((step) => step.status === ProcessStepStatus.COMPLETED))).toBe(true);
    expect(instances.every((instance) => instance.commandRuns.length === 4)).toBe(true);
    expect(audits.every((audit) => audit.eventType === "advisor_review.backend_lifecycle.step.completed")).toBe(true);
    expect(audits.every((audit) => audit.result === AuditResult.SUCCESS)).toBe(true);
    expect(audits.every((audit) => audit.targetType === ObjectType.PROCESS)).toBe(true);
    expect(commandRuns.map((run) => run.fromStepId).sort()).toEqual(result.completedStepIds.sort());
    expect(commandRuns.every((run) => run.auditEventId !== null)).toBe(true);
  });

  test("fails closed before mutation when audit persistence is unavailable", async () => {
    const runKey = "negative-audit-unavailable";
    const recommendationId = await upsertLifecycleRecommendation(runKey);
    const before = await Promise.all([
      prisma.processInstance.count(),
      prisma.processCommandRun.count(),
      prisma.auditEvent.count(),
    ]);

    await expect(
      closeAdvisorReviewBackendLifecycle(prisma, {
        actorRoleKey: "senior_wealth_advisor",
        auditPersistenceAvailable: false,
        reason: "Attempt DOMAIN-F lifecycle closure while audit persistence is unavailable.",
        recommendationId,
        runKey,
        tenantSlug: "morgan",
      }),
    ).rejects.toMatchObject({
      reasonCode: "advisor_review_backend_lifecycle_audit_failed_closed",
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
            processId: { in: [...advisorReviewBackendLifecycleProcessIds] },
          },
        },
      },
    });

    expect(after).toEqual(before);
    expect(links).toEqual([]);
  });
});
