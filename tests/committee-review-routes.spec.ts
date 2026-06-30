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
    await expect(page.getByText("Internal review only")).toBeVisible();
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

  test("detail remains held until vote dissent and evidence commands exist", async ({ page }) => {
    await page.goto("/committee/reviews/rebalance-review/decision-room");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" }).first()).toBeVisible();
    await expect(page.locator('[data-ux-route-scope="HOLD_PENDING_DECISION"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
  });
});
