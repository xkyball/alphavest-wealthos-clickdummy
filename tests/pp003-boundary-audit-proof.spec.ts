import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  EvidenceStatus,
  InternalDraftStatus,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  VisibilityStatus,
} from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

const advisorApprovalInternalDraftKey = "typed-advisor-approval-release-spine";
const demoTargets = {
  northbridge: {
    evidenceId: "de155b08-f7f4-5c92-ba52-93a646658d53",
    recommendationId: "3f164151-0bc4-54ff-a5a4-b7521c41826b",
  },
  summit: {
    evidenceId: "cd681455-89ef-5ebb-96c7-8464f0dcb721",
    recommendationId: "b0b09a4b-8067-530d-a45a-2ad04d9c4b1d",
  },
} as const;

async function advisorCommand(request: APIRequestContext, data: Record<string, unknown>) {
  return request.post("/api/recommendation-review-workflow", {
    data: {
      ...data,
      workflowType: "advisor-approval",
    },
  });
}

function metadataJson(value: unknown) {
  return value as Record<string, unknown>;
}

test.describe("PP-003 boundary audit proof", () => {
  let prisma: PrismaClient;

  test.beforeEach(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for PP003 boundary audit tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterEach(async () => {
    await prisma?.$disconnect();
  });

  test("IMPL-1.8 persists audit proof for unsupported-claim rejection boundary", async ({ request }) => {
    const reason = "PP003 rejected unsupported claim pending canonical evidence rebuild.";
    const response = await advisorCommand(request, {
      action: "reject_unsupported_claim",
      actorRole: "analyst",
      evidenceIds: [demoTargets.northbridge.evidenceId],
      reason,
      targetId: demoTargets.northbridge.recommendationId,
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);

    const [audit, recommendation, evidence] = await Promise.all([
      prisma.auditEvent.findUniqueOrThrow({ where: { id: body.result.auditEventId } }),
      prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.northbridge.recommendationId },
      }),
      prisma.evidenceRecord.findUniqueOrThrow({ where: { id: demoTargets.northbridge.evidenceId } }),
    ]);
    const metadata = metadataJson(audit.metadataJson);

    expect(audit.eventType).toBe("advisor_approval.reject_unsupported_claim");
    expect(audit.result).toBe(AuditResult.BLOCKED);
    expect(audit.actorRoleKey).toBe("analyst");
    expect(audit.targetId).toBe(demoTargets.northbridge.recommendationId);
    expect(audit.targetType).toBe(ObjectType.RECOMMENDATION);
    expect(audit.reason).toBe(reason);
    expect(audit.nextState).toBe(RecommendationStatus.REVISION_REQUESTED);
    expect(metadata.action).toBe("reject_unsupported_claim");
    expect(metadata.canonicalCommand).toBe("AI_DRAFT_INTERNAL");
    expect(metadata.canonicalState).toBe("UNSUPPORTED_CLAIM_BLOCKED");
    expect(metadata.evidenceIds).toEqual([demoTargets.northbridge.evidenceId]);
    expect(metadata.noRealAuth).toBe(true);
    expect(recommendation.clientVisible).toBe(false);
    expect(recommendation.summaryInternal).toContain(reason);
    expect(evidence.status).toBe(EvidenceStatus.PLACEHOLDER);
    expect(evidence.visibilityStatus).toBe(VisibilityStatus.COMPLIANCE_VISIBLE);
  });

  test("IMPL-1.8 persists audit and draft trace proof for evidence-backed rebuild", async ({ request }) => {
    const reason = "PP003 rebuilt internal draft after accepted scoped evidence.";
    const response = await advisorCommand(request, {
      action: "rebuild_with_evidence",
      actorRole: "analyst",
      evidenceIds: [demoTargets.summit.evidenceId],
      reason,
      targetId: demoTargets.summit.recommendationId,
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.noClientRelease).toBe(true);

    const internalDraft = await prisma.internalDraft.findFirstOrThrow({
      where: {
        draftKey: advisorApprovalInternalDraftKey,
        recommendationId: demoTargets.summit.recommendationId,
      },
    });
    const [audit, trace, evidenceItem] = await Promise.all([
      prisma.auditEvent.findUniqueOrThrow({ where: { id: body.result.auditEventId } }),
      prisma.draftTrace.findFirstOrThrow({
        where: {
          internalDraftId: internalDraft.id,
          traceType: "advisor_approval.internal_draft_rebuilt_with_evidence",
        },
      }),
      prisma.evidenceItem.findFirstOrThrow({
        where: {
          evidenceRecordId: demoTargets.summit.evidenceId,
          itemType: "internal_draft_rebuild",
          sourceObjectId: demoTargets.summit.recommendationId,
          sourceObjectType: ObjectType.RECOMMENDATION,
        },
      }),
    ]);
    const auditMetadata = metadataJson(audit.metadataJson);
    const traceMetadata = metadataJson(trace.metadataJson);

    expect(audit.eventType).toBe("advisor_approval.rebuild_with_evidence");
    expect(audit.result).toBe(AuditResult.SUCCESS);
    expect(audit.actorRoleKey).toBe("analyst");
    expect(audit.targetId).toBe(demoTargets.summit.recommendationId);
    expect(audit.reason).toBe(reason);
    expect(auditMetadata.action).toBe("rebuild_with_evidence");
    expect(auditMetadata.canonicalCommand).toBe("AI_DRAFT_INTERNAL");
    expect(auditMetadata.canonicalState).toBe("ANALYST_REBUILT_WITH_EVIDENCE");
    expect(auditMetadata.evidenceIds).toEqual([demoTargets.summit.evidenceId]);
    expect(internalDraft.status).toBe(InternalDraftStatus.REBUILT_WITH_EVIDENCE);
    expect(trace.actorRoleKey).toBe("analyst");
    expect(trace.reason).toBe(reason);
    expect(traceMetadata.releaseSpine).toBe(true);
    expect(traceMetadata.storage).toBe("internal_drafts");
    expect(evidenceItem.visibilityStatus).toBe(VisibilityStatus.COMPLIANCE_VISIBLE);
  });

  test("IMPL-1.8 persists denied audit proof for unauthorized boundary mutation", async ({ request }) => {
    const response = await advisorCommand(request, {
      action: "advisor_approve",
      actorRole: "analyst",
      reason: "PP003 analyst must not approve advisor boundary.",
      targetId: demoTargets.northbridge.recommendationId,
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.result.mutated).toBe(false);
    expect(body.result.permission.allowed).toBe(false);
    expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);

    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: body.result.auditEventId } });
    const metadata = metadataJson(audit.metadataJson);
    const permission = metadataJson(metadata.permission);

    expect(audit.eventType).toBe("advisor_approval.advisor_approve");
    expect(audit.result).toBe(AuditResult.DENIED);
    expect(audit.actorRoleKey).toBe("analyst");
    expect(audit.targetId).toBe(demoTargets.northbridge.recommendationId);
    expect(audit.targetType).toBe(ObjectType.RECOMMENDATION);
    expect(audit.reason).toContain("senior_wealth_advisor is required");
    expect(audit.previousState).toBe(audit.nextState);
    expect(metadata.action).toBe("advisor_approve");
    expect(metadata.canonicalCommand).toBe("ADVISOR_APPROVE");
    expect(metadata.canonicalState).toBe("COMPLIANCE_PENDING");
    expect(permission.allowed).toBe(false);
  });
});
