import "dotenv/config";

import { execFileSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { ObjectType, PrismaClient, WorkflowStatus } from "@prisma/client";
import { expect, test } from "@playwright/test";

import { demoTenants } from "../lib/demo-session";
import { stableId } from "../lib/stable-id";

const summitTenantId = demoTenants.find((tenant) => tenant.slug === "summit")?.id;
const summitRecommendationId = stableId("recommendation:summit:liquidity-review");
const summitExportRequestId = stableId("export:summit:evidence-pack");

async function createSummitHighSeverityIssue(prisma: PrismaClient) {
  if (!summitTenantId) throw new Error("Summit demo tenant is missing.");

  await prisma.dataQualityIssue.upsert({
    where: { id: stableId("data-quality:summit:phase9-release-blocker") },
    create: {
      id: stableId("data-quality:summit:phase9-release-blocker"),
      clientTenantId: summitTenantId,
      description: "Phase 9 release/export blocker: conflicting beneficial ownership data needs review.",
      issueType: "ownership_conflict",
      ownerUserId: stableId("user:analyst"),
      severity: "high",
      status: WorkflowStatus.IN_REVIEW,
      targetId: summitRecommendationId,
      targetType: ObjectType.RECOMMENDATION,
    },
    update: {
      severity: "high",
      status: WorkflowStatus.IN_REVIEW,
      targetId: summitRecommendationId,
      targetType: ObjectType.RECOMMENDATION,
    },
  });
}

test.describe.serial("Phase 9 support hardening", () => {
  let prisma: PrismaClient | undefined;

  test.beforeEach(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Phase 9 support hardening tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterEach(async () => {
    await prisma?.$disconnect();
    prisma = undefined;
  });

  test("blocks compliance client release when active high-severity data quality exists", async ({ request }) => {
    if (!prisma) throw new Error("Prisma client was not initialized.");
    await createSummitHighSeverityIssue(prisma);

    const response = await request.post("/api/demo-workflow", {
      data: { actionId: "j02.releaseClient" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.noClientRelease).toBe(true);
    expect(body.mutated).toBe(false);

    const recommendation = await prisma.recommendation.findUnique({
      where: { id: summitRecommendationId },
    });
    expect(recommendation?.clientVisible).toBe(false);
  });

  test("permits release when only non-high data quality issues are open", async ({ request }) => {
    const response = await request.post("/api/demo-workflow", {
      data: { actionId: "j02.releaseClient" },
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.highSeverityDataQualityBlockers).toBe(0);
    expect(body.result.clientVisible).toBe(true);
  });

  test("blocks export approval while high-severity data quality is active", async ({ request }) => {
    if (!prisma) throw new Error("Prisma client was not initialized.");
    await createSummitHighSeverityIssue(prisma);

    const response = await request.post("/api/demo-workflow", {
      data: { actionId: "j08.confirmApproval" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.noClientRelease).toBe(true);
    expect(body.mutated).toBe(false);

    const exportRequest = await prisma.exportRequest.findUnique({
      where: { id: summitExportRequestId },
    });
    expect(exportRequest?.generatedFileDocumentId).toBeNull();
  });

  test("keeps review monitoring internal and non-mutating", async ({ request }) => {
    const response = await request.get("/api/review-monitoring?asOf=2026-06-17T12:00:00.000Z");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.mutated).toBe(false);
    expect(body.noAdviceExecution).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.rebalance.rows.every((row: { clientVisible: boolean }) => row.clientVisible === false)).toBe(true);
  });
});
