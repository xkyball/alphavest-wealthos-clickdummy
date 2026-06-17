import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

test.describe("Phase D review calendar and rebalance monitoring", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("GET /api/review-monitoring returns due, overdue and trigger state proof", async ({ request }) => {
    const response = await request.get("/api/review-monitoring?asOf=2026-06-17T12:00:00.000Z");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.reviews.total).toBeGreaterThan(0);
    expect(body.reviews.rows.some((row: { dueState: string }) => row.dueState === "scheduled" || row.dueState === "upcoming")).toBe(true);
    expect(body.rebalance.total).toBeGreaterThan(0);
    expect(body.rebalance.overdue).toBeGreaterThan(0);
    expect(body.rebalance.clientVisible).toBe(0);
    expect(body.rebalance.rows.every((row: { clientVisible: boolean }) => row.clientVisible === false)).toBe(true);
  });

  test("J16 review calendar actions persist internal audit state without client release", async ({ request }) => {
    for (const actionId of ["j16.scheduleReview", "j16.escalateOverdueReview"]) {
      const response = await request.post("/api/demo-workflow", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.result.auditRows).toBe(1);
      expect(body.result.reviewRows).toBeGreaterThan(0);
      expect(body.result.clientVisible).toBe(false);
    }

    const snapshotResponse = await request.get("/api/review-monitoring?asOf=2026-06-17T12:00:00.000Z");
    const snapshot = await snapshotResponse.json();
    expect(snapshot.auditProof.latestEventTypes).toContain("phase_d.review_calendar.escalate_overdue");
    expect(snapshot.reviews.rows.some((row: { dueState: string; escalated: boolean }) => row.dueState === "overdue" && row.escalated)).toBe(true);
  });

  test("J17 rebalance monitoring actions persist trigger state without advice execution", async ({ request }) => {
    const blockResponse = await request.post("/api/demo-workflow", {
      data: { actionId: "j17.blockRebalanceTrigger" },
    });
    const blockBody = await blockResponse.json();

    expect(blockResponse.ok(), JSON.stringify(blockBody)).toBe(true);
    expect(blockBody.noClientRelease).toBe(true);
    expect(blockBody.result.auditRows).toBe(1);
    expect(blockBody.result.triggerRows).toBeGreaterThan(0);
    expect(blockBody.result.actionItemRows).toBeGreaterThan(0);
    expect(blockBody.result.clientVisible).toBe(false);

    const snapshotAfterBlockResponse = await request.get("/api/review-monitoring?asOf=2026-06-17T12:00:00.000Z");
    const snapshotAfterBlock = await snapshotAfterBlockResponse.json();
    expect(snapshotAfterBlock.rebalance.blocked).toBeGreaterThan(0);
    expect(snapshotAfterBlock.auditProof.latestEventTypes).toContain("phase_d.rebalance_monitoring.block_trigger");

    const routeResponse = await request.post("/api/demo-workflow", {
      data: { actionId: "j17.routeRebalanceReview" },
    });
    const routeBody = await routeResponse.json();

    expect(routeResponse.ok(), JSON.stringify(routeBody)).toBe(true);
    expect(routeBody.noClientRelease).toBe(true);
    expect(routeBody.result.recommendationRows).toBeGreaterThan(0);
    expect(routeBody.result.clientVisible).toBe(false);
  });
});

