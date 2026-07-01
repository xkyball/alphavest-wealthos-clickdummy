import "dotenv/config";

import { execFileSync } from "node:child_process";

import { PrismaPg } from "@prisma/adapter-pg";
import { ObjectType, PrismaClient, RecommendationStatus, ReviewStatus, WorkflowStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { stableId } from "../lib/stable-id";

const targets = {
  morgan: {
    recommendationId: stableId("recommendation:morgan:liquidity-review"),
    triggerId: stableId("trigger:morgan:liquidity"),
  },
  northbridge: {
    recommendationId: stableId("recommendation:northbridge:liquidity-review"),
    triggerId: stableId("trigger:northbridge:liquidity"),
  },
  summit: {
    recommendationId: stableId("recommendation:summit:liquidity-review"),
    triggerId: stableId("trigger:summit:liquidity"),
  },
};

test.describe("advisor-review command API", () => {
  let prisma: PrismaClient | undefined;

  test.beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for advisor-review command tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("routes the selected trigger to its recommendation without mutating the default Northbridge target", async ({ request }) => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const northbridgeBefore = await prisma.recommendation.findUniqueOrThrow({
      where: { id: targets.northbridge.recommendationId },
    });

    const response = await request.post("/api/advisor-review/actions", {
      data: {
        actionId: "j01.routeToAdvisor",
        targetId: targets.morgan.triggerId,
        targetType: ObjectType.TRIGGER,
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body).toMatchObject({
      actionId: "j01.routeToAdvisor",
      canonicalApiRoute: "/api/advisor-review/actions",
      clientVisible: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      targetId: targets.morgan.triggerId,
      targetType: ObjectType.TRIGGER,
    });
    expect(body.result.targetId).toBe(targets.morgan.recommendationId);
    expect(body.safety).toMatchObject({
      commandExecuted: true,
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scoped: true,
    });

    const morganRecommendation = await prisma.recommendation.findUniqueOrThrow({
      where: { id: targets.morgan.recommendationId },
    });
    const morganApproval = await prisma.approval.findFirstOrThrow({
      where: {
        targetId: targets.morgan.recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    const northbridgeAfter = await prisma.recommendation.findUniqueOrThrow({
      where: { id: targets.northbridge.recommendationId },
    });

    expect(morganRecommendation.status).toBe(RecommendationStatus.ADVISOR_PENDING);
    expect(morganRecommendation.clientVisible).toBe(false);
    expect(morganApproval.status).toBe(ReviewStatus.IN_REVIEW);
    expect(northbridgeAfter.status).toBe(northbridgeBefore.status);
  });

  test("requests data against the selected trigger and linked action item", async ({ request }) => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const response = await request.post("/api/advisor-review/actions", {
      data: {
        actionId: "j01.requestData",
        targetId: targets.summit.triggerId,
        targetType: ObjectType.TRIGGER,
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result).toMatchObject({
      clientVisible: false,
      targetId: targets.summit.triggerId,
      targetType: ObjectType.TRIGGER,
      triggerRows: 1,
    });

    const summitTrigger = await prisma.trigger.findUniqueOrThrow({
      where: { id: targets.summit.triggerId },
    });
    const summitActionItem = await prisma.actionItem.findFirstOrThrow({
      where: { triggerId: targets.summit.triggerId, clientVisible: false },
    });

    expect(summitTrigger.status).toBe(WorkflowStatus.AWAITING_INFO);
    expect(summitTrigger.clientVisible).toBe(false);
    expect(summitActionItem.status).toBe(WorkflowStatus.AWAITING_INFO);
    expect(summitActionItem.blockedReason).toContain("J01 advisor-review command requested ownership");
  });

  test("escalates only the selected recommendation", async ({ request }) => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    const response = await request.post("/api/advisor-review/actions", {
      data: {
        actionId: "j01.escalateAdvisor",
        targetId: targets.northbridge.recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result).toMatchObject({
      clientVisible: false,
      targetId: targets.northbridge.recommendationId,
      targetType: ObjectType.RECOMMENDATION,
    });

    const recommendation = await prisma.recommendation.findUniqueOrThrow({
      where: { id: targets.northbridge.recommendationId },
    });
    const approval = await prisma.approval.findFirstOrThrow({
      where: {
        targetId: targets.northbridge.recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    expect(recommendation.status).toBe(RecommendationStatus.BLOCKED);
    expect(recommendation.clientVisible).toBe(false);
    expect(approval.status).toBe(ReviewStatus.ESCALATED_TO_CALL);
  });

  test("rejects missing target payloads", async ({ request }) => {
    const response = await request.post("/api/advisor-review/actions", {
      data: { actionId: "j01.routeToAdvisor" },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.error).toBe("Advisor-review actions require a supported J01 command, UUID targetId and supported targetType.");
    expect(body.safety).toMatchObject({
      commandExecuted: false,
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scoped: false,
    });
  });

  test("rejects non advisor-review actions and unknown targets without mutation", async ({ request }) => {
    const unsupported = await request.post("/api/advisor-review/actions", {
      data: {
        actionId: "j02.requestEvidence",
        targetId: targets.morgan.triggerId,
        targetType: ObjectType.TRIGGER,
      },
    });
    const unsupportedBody = await unsupported.json();

    expect(unsupported.status()).toBe(400);
    expect(unsupportedBody.error).toBe("Advisor-review actions require a supported J01 command, UUID targetId and supported targetType.");

    const unknown = await request.post("/api/advisor-review/actions", {
      data: {
        actionId: "j01.requestData",
        targetId: "11111111-1111-5111-9111-111111111111",
        targetType: ObjectType.TRIGGER,
      },
    });
    const unknownBody = await unknown.json();

    expect(unknown.status()).toBe(404);
    expect(unknownBody.reasonCode).toBe("SCOPE_DENIED");
    expect(unknownBody.targetReasonCode).toBe("ADVISOR_REVIEW_TRIGGER_NOT_FOUND");
    expect(unknownBody.safety).toMatchObject({
      commandExecuted: false,
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scoped: false,
    });
  });
});
