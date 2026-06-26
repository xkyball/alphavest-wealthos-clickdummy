import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  ComplianceStatus,
  DecisionStatus,
  InternalDraftStatus,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
} from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

const advisorApprovalInternalDraftKey = "typed-advisor-approval-release-spine";
const demoTargets = {
  northbridge: {
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

test.describe("PP-003 advisor candidate no-release boundary", () => {
  let prisma: PrismaClient;

  test.beforeEach(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for PP003 advisor candidate boundary tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterEach(async () => {
    await prisma?.$disconnect();
  });

  test("IMPL-1.7 blocks advisor approval from creating ADVISOR_READY without canonical rebuilt evidence", async ({
    request,
  }) => {
    const response = await advisorCommand(request, {
      action: "advisor_approve",
      actorRole: "senior_wealth_advisor",
      reason: "PP003 advisor approval without canonical rebuilt evidence is not release proof.",
      targetId: demoTargets.northbridge.recommendationId,
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.result.clientProjection).toBeNull();
    expect(body.result.decisionLinkage).toEqual({ decisionRows: 0, mode: "metadata_only" });
    expect(body.result.reloadedState.advisorApproval.status).toBe(ReviewStatus.APPROVED);
    expect(body.result.reloadedState.recommendation.status).toBe(RecommendationStatus.COMPLIANCE_PENDING);
    expect(body.result.reloadedState.recommendation.clientVisible).toBe(false);

    const [recommendation, complianceReview, internalDraft, decision] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.northbridge.recommendationId },
      }),
      prisma.complianceReview.findFirstOrThrow({
        where: {
          targetId: demoTargets.northbridge.recommendationId,
          targetType: ObjectType.RECOMMENDATION,
        },
      }),
      prisma.internalDraft.findFirst({
        where: {
          draftKey: advisorApprovalInternalDraftKey,
          recommendationId: demoTargets.northbridge.recommendationId,
        },
      }),
      prisma.decision.findFirst({
        where: { recommendationId: demoTargets.northbridge.recommendationId },
      }),
    ]);

    expect(recommendation.clientVisible).toBe(false);
    expect(recommendation.status).toBe(RecommendationStatus.COMPLIANCE_PENDING);
    expect(complianceReview.status).toBe(ComplianceStatus.PENDING);
    expect(complianceReview.releasedAt).toBeNull();
    expect(internalDraft?.status).not.toBe(InternalDraftStatus.ADVISOR_READY);
    expect(decision?.releasedToClientAt).toBeNull();
    expect(decision?.status).not.toBe("RELEASED_TO_CLIENT");
  });

  test("IMPL-1.7 allows advisor candidate after canonical rebuild but still prevents release implication", async ({
    request,
  }) => {
    await prisma.decision.updateMany({
      data: {
        evidenceRecordId: null,
        releasedToClientAt: null,
        status: DecisionStatus.DRAFT,
      },
      where: { recommendationId: demoTargets.summit.recommendationId },
    });

    for (const command of [
      {
        action: "submit_review",
        actorRole: "analyst",
        reason: "PP003 submit internal draft for advisor candidate boundary proof.",
      },
      {
        action: "rebuild_with_evidence",
        actorRole: "analyst",
        evidenceIds: [demoTargets.summit.evidenceId],
        reason: "PP003 rebuild with canonical evidence for advisor candidate boundary proof.",
      },
      {
        action: "advisor_approve",
        actorRole: "senior_wealth_advisor",
        reason: "PP003 advisor candidate remains compliance-pending and not released.",
      },
    ] as const) {
      const response = await advisorCommand(request, {
        ...command,
        targetId: demoTargets.summit.recommendationId,
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.noClientRelease).toBe(true);
    }

    const [recommendation, complianceReview, internalDraft, decision] = await Promise.all([
      prisma.recommendation.findUniqueOrThrow({
        where: { id: demoTargets.summit.recommendationId },
      }),
      prisma.complianceReview.findFirstOrThrow({
        where: {
          targetId: demoTargets.summit.recommendationId,
          targetType: ObjectType.RECOMMENDATION,
        },
      }),
      prisma.internalDraft.findFirstOrThrow({
        where: {
          draftKey: advisorApprovalInternalDraftKey,
          recommendationId: demoTargets.summit.recommendationId,
        },
      }),
      prisma.decision.findFirst({
        where: { recommendationId: demoTargets.summit.recommendationId },
      }),
    ]);

    expect(internalDraft.status).toBe(InternalDraftStatus.ADVISOR_READY);
    expect(recommendation.status).toBe(RecommendationStatus.COMPLIANCE_PENDING);
    expect(recommendation.clientVisible).toBe(false);
    expect(complianceReview.status).toBe(ComplianceStatus.PENDING);
    expect(complianceReview.releasedAt).toBeNull();
    expect(decision?.releasedToClientAt).toBeNull();
    expect(decision?.status).not.toBe("RELEASED_TO_CLIENT");
  });
});
