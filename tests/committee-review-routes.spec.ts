import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import { seedDemoDatabase } from "./helpers/seed-demo-db";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: localAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.beforeEach(async ({ page }) => {
  await authenticate(page);
});

test.describe("Stage E committee review routes", () => {
  test.beforeAll(() => {
    seedDemoDatabase();
  });

  test("queue renders as internal committee review surface without client release", async ({ page }) => {
    await page.goto("/committee/reviews");

    await expect(page.getByRole("heading", { name: "Committee Review Queue" }).first()).toBeVisible();
    await expect(page.getByTestId("ux-stage5-detail-split")).toHaveCount(0);
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    await expect(page.getByText("Client-safe visible")).toBeVisible();
    await expect(page.getByText("No packages released to clients.")).toBeVisible();
  });

  test("committee queue actions persist workflow command history without client release", async ({ request }) => {
    const listResponse = await request.get("/api/committee-reviews?pageSize=1&sortKey=due&sortDirection=asc");
    const list = await listResponse.json();

    expect(listResponse.ok(), JSON.stringify(list)).toBe(true);
    expect(list.ok).toBe(true);
    expect(list.noAdviceExecution).toBe(true);
    expect(list.noClientRelease).toBe(true);
    expect(list.meta.sourceTruth).toBe("backend_query_backed");
    expect(list.rows[0].clientVisible).toBe(false);
    expect(list.rows[0].processInstanceId).toEqual(expect.any(String));

    const actionResponse = await request.post("/api/committee-reviews/actions", {
      data: {
        actionId: "j18.openPeerReview",
        targetId: list.rows[0].recommendationId,
      },
    });
    const action = await actionResponse.json();

    expect(actionResponse.ok(), JSON.stringify(action)).toBe(true);
    expect(action.ok).toBe(true);
    expect(action.noAdviceExecution).toBe(true);
    expect(action.noClientRelease).toBe(true);
    expect(action.clientVisible).toBe(false);
    expect(action.result.processCommandRows).toBe(1);
    expect(action.result.queueStatus).toBe("IN_REVIEW");

    const refreshedResponse = await request.get(`/api/committee-reviews?q=${encodeURIComponent(list.rows[0].client)}&pageSize=5`);
    const refreshed = await refreshedResponse.json();
    expect(refreshed.rows.some((row: { processCommandCount: number }) => row.processCommandCount > 0)).toBe(true);
    expect(refreshed.auditProof.latestEventTypes).toContain("stage_e.committee_review.open_peer_review");
  });

  test("committee queue fails closed for unsupported actions", async ({ request }) => {
    const response = await request.post("/api/committee-reviews/actions", {
      data: {
        actionId: "j18.releaseToClient",
        targetId: "not-a-uuid",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.safety.commandExecuted).toBe(false);
    expect(body.safety.noClientRelease).toBe(true);
  });

  test("detail renders workflow-backed decision room without client release", async ({ page }) => {
    await page.goto("/committee/reviews/rebalance-review/decision-room");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" }).first()).toBeVisible();
    await expect(page.getByText("Committee decision context is loading")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Committee votes" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Record peer vote" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Resolve dissent" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Request evidence" })).toBeVisible();
    await expect(page.getByText("Internal review")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Review history" })).toBeVisible();
    await expect(page.locator('[data-ux-route-scope="HOLD_PENDING_DECISION"]')).toHaveCount(0);
  });

  test("detail actions require typed confirmation and then persist command history", async ({ request }) => {
    const detailResponse = await request.get("/api/committee-reviews?targetId=investment-committee");
    const detail = await detailResponse.json();

    expect(detailResponse.ok(), JSON.stringify(detail)).toBe(true);
    expect(detail.ok).toBe(true);
    expect(detail.detail.clientVisible).toBe(false);
    expect(detail.detail.processInstanceId).toEqual(expect.any(String));

    const deniedResponse = await request.post("/api/committee-reviews/actions", {
      data: {
        actionId: "j18.recordVote",
        targetId: detail.detail.recommendationId,
        typedConfirmation: "confirm",
      },
    });
    const denied = await deniedResponse.json();
    expect(deniedResponse.status(), JSON.stringify(denied)).toBe(403);
    expect(denied.ok).toBe(false);
    expect(denied.safety.commandExecuted).toBe(false);
    expect(denied.safety.noClientRelease).toBe(true);

    const voteResponse = await request.post("/api/committee-reviews/actions", {
      data: {
        actionId: "j18.recordVote",
        note: "Peer reviewer confirmed internal committee package.",
        targetId: detail.detail.recommendationId,
        typedConfirmation: "CONFIRM PEER REVIEW",
      },
    });
    const vote = await voteResponse.json();
    expect(voteResponse.ok(), JSON.stringify(vote)).toBe(true);
    expect(vote.ok).toBe(true);
    expect(vote.clientVisible).toBe(false);
    expect(vote.result.commandKey).toBe("COMMITTEE_REVIEW_VOTE_RECORDED");
    expect(vote.result.processCommandRows).toBe(1);

    const refreshedResponse = await request.get(`/api/committee-reviews?targetId=${detail.detail.recommendationId}`);
    const refreshed = await refreshedResponse.json();
    expect(refreshedResponse.ok(), JSON.stringify(refreshed)).toBe(true);
    expect(refreshed.detail.votes.recorded).toBeGreaterThanOrEqual(detail.detail.votes.recorded + 1);
    expect(refreshed.detail.processCommandCount).toBeGreaterThan(detail.detail.processCommandCount);
  });
});
