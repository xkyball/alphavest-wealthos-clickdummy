import { expect, test } from "@playwright/test";

import { evaluateMonitoringGuard } from "../lib/control-layer/monitoring-guard";
import { seedDemoDatabase } from "./helpers/seed-demo-db";

test.describe("Stage D review calendar and rebalance monitoring", () => {
  test.beforeAll(() => {
    seedDemoDatabase();
  });

  test("GET /api/review-monitoring returns due, overdue and trigger state proof", async ({ request }) => {
    const response = await request.get("/api/review-monitoring?asOf=2026-06-17T12:00:00.000Z");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.noAdviceExecution).toBe(true);
    expect(body.mutated).toBe(false);
    expect(body.reviews.total).toBeGreaterThan(0);
    expect(body.reviews.rows.some((row: { dueState: string }) => row.dueState === "scheduled" || row.dueState === "upcoming")).toBe(true);
    expect(body.rebalance.total).toBeGreaterThan(0);
    expect(body.rebalance.overdue).toBeGreaterThan(0);
    expect(body.rebalance.clientVisible).toBe(0);
    expect(body.rebalance.rows.every((row: { clientVisible: boolean }) => row.clientVisible === false)).toBe(true);
    expect(body.monitoringGuard.status).toBe("MONITORING_ONLY");
    expect(body.monitoringGuard.noAutomaticAdvice).toBe(true);
    expect(body.monitoringGuard.clientVisible).toBe(false);
  });

  test("GET /api/review-monitoring exposes paginated review and rebalance rows", async ({ request }) => {
    const reviewsResponse = await request.get("/api/review-monitoring?surface=reviews&pageSize=1&sortKey=nextReviewDate&sortDirection=asc");
    const reviews = await reviewsResponse.json();

    expect(reviewsResponse.ok(), JSON.stringify(reviews)).toBe(true);
    expect(reviews.meta.sourceTruth).toBe("backend_query_backed");
    expect(reviews.meta.pageSize).toBe(1);
    expect(reviews.meta.returnedRows).toBeLessThanOrEqual(1);
    expect(reviews.meta.totalRows).toBeGreaterThanOrEqual(reviews.meta.returnedRows);
    expect(reviews.noAdviceExecution).toBe(true);
    expect(reviews.noClientRelease).toBe(true);

    const rebalanceResponse = await request.get("/api/review-monitoring?surface=rebalance&pageSize=1&sortKey=slaDueAt&sortDirection=desc&triggerState=blocked");
    const rebalance = await rebalanceResponse.json();

    expect(rebalanceResponse.ok(), JSON.stringify(rebalance)).toBe(true);
    expect(rebalance.meta.sourceTruth).toBe("backend_query_backed");
    expect(rebalance.meta.pageSize).toBe(1);
    expect(rebalance.meta.returnedRows).toBeLessThanOrEqual(1);
    expect(rebalance.meta.totalRows).toBeGreaterThanOrEqual(rebalance.meta.returnedRows);
    expect(rebalance.noAdviceExecution).toBe(true);
    expect(rebalance.noClientRelease).toBe(true);
    expect(rebalance.rebalanceRows.every((row: { clientVisible: boolean; state: string }) => row.clientVisible === false && row.state === "blocked")).toBe(true);
  });

  test("WS-08 monitoring guard creates internal triggers without automatic advice or release", () => {
    const guard = evaluateMonitoringGuard({
      dataQualityGate: {
        gateName: "DATA_QUALITY_READY",
        missing: ["missing_source_evidence", "risk_profile"],
        passed: false,
      },
      reviewDue: true,
      triggerCreated: true,
    });

    expect(guard.clientVisible).toBe(false);
    expect(guard.internalTriggerOnly).toBe(true);
    expect(guard.noAdviceExecution).toBe(true);
    expect(guard.noAutomaticAdvice).toBe(true);
    expect(guard.noClientRelease).toBe(true);
    expect(guard.status).toBe("BLOCKED_FOR_REVIEW");
    expect(guard.blockingIssues).toContain("missing_source_evidence");
    expect(guard.proofLabels).toContain("WCL-DATA-QUALITY-BLOCK");
    expect(guard.proofLabels).toContain("WCL-REVIEW-DUE");
    expect(guard.proofLabels).toContain("WCL-INTERNAL-TRIGGER-CREATED");
  });

  test("GET /api/review-monitoring rejects invalid asOf values without advice execution", async ({ request }) => {
    const response = await request.get("/api/review-monitoring?asOf=not-a-date");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.issues).toContain("valid_as_of_required");
  });

  test("J16 review calendar actions persist internal audit state without client release", async ({ request }) => {
    for (const actionId of ["j16.scheduleReview", "j16.escalateOverdueReview"]) {
      const response = await request.post("/api/review-monitoring/actions", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.noAdviceExecution).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.clientVisible).toBe(false);
      expect(body.result.auditRows).toBe(1);
      expect(body.result.reviewRows).toBeGreaterThan(0);
      expect(body.result.clientVisible).toBe(false);
    }

    const snapshotResponse = await request.get("/api/review-monitoring?asOf=2026-06-17T12:00:00.000Z");
    const snapshot = await snapshotResponse.json();
    expect(snapshot.auditProof.latestEventTypes).toContain("stage_d.review_calendar.escalate_overdue");
    expect(snapshot.reviews.rows.some((row: { dueState: string; escalated: boolean }) => row.dueState === "overdue" && row.escalated)).toBe(true);
  });

  test("J17 rebalance monitoring actions persist trigger state without advice execution", async ({ request }) => {
    const blockResponse = await request.post("/api/review-monitoring/actions", {
      data: { actionId: "j17.blockRebalanceTrigger" },
    });
    const blockBody = await blockResponse.json();

    expect(blockResponse.ok(), JSON.stringify(blockBody)).toBe(true);
    expect(blockBody.noAdviceExecution).toBe(true);
    expect(blockBody.noClientRelease).toBe(true);
    expect(blockBody.clientVisible).toBe(false);
    expect(blockBody.result.auditRows).toBe(1);
    expect(blockBody.result.triggerRows).toBeGreaterThan(0);
    expect(blockBody.result.actionItemRows).toBeGreaterThan(0);
    expect(blockBody.result.clientVisible).toBe(false);

    const snapshotAfterBlockResponse = await request.get("/api/review-monitoring?asOf=2026-06-17T12:00:00.000Z");
    const snapshotAfterBlock = await snapshotAfterBlockResponse.json();
    expect(snapshotAfterBlock.rebalance.blocked).toBeGreaterThan(0);
    expect(snapshotAfterBlock.auditProof.latestEventTypes).toContain("stage_d.rebalance_monitoring.block_trigger");

    const routeResponse = await request.post("/api/review-monitoring/actions", {
      data: { actionId: "j17.routeRebalanceReview" },
    });
    const routeBody = await routeResponse.json();

    expect(routeResponse.ok(), JSON.stringify(routeBody)).toBe(true);
    expect(routeBody.noAdviceExecution).toBe(true);
    expect(routeBody.noClientRelease).toBe(true);
    expect(routeBody.clientVisible).toBe(false);
    expect(routeBody.result.recommendationRows).toBeGreaterThan(0);
    expect(routeBody.result.clientVisible).toBe(false);
  });
});
