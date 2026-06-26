import { execFileSync } from "node:child_process";

import { expect, test } from "@playwright/test";

test.describe("advisor-review command API", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  const advisorReviewActions = ["j01.requestData", "j01.routeToAdvisor", "j01.escalateAdvisor"] as const;

  for (const actionId of advisorReviewActions) {
    test(`executes typed ${actionId} command via /api/advisor-review/actions`, async ({ request }) => {
      const response = await request.post("/api/advisor-review/actions", {
        data: { actionId },
      });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.actionId).toBe(actionId);
      expect(body.canonicalApiRoute).toBe("/api/advisor-review/actions");
      expect(body.clientVisible).toBe(false);
      expect(body.noAdviceExecution).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.ok).toBe(true);
      expect(body.command).toBeTruthy();
      expect(body.safety).toMatchObject({
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      });
    });
  }

  test("rejects non advisor-review actions", async ({ request }) => {
    const response = await request.post("/api/advisor-review/actions", {
      data: { actionId: "j02.requestEvidence" },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.error).toBe("Advisor-review actions only support J01 request-data, route and escalation commands.");
    expect(body.safety).toMatchObject({
      commandExecuted: false,
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scoped: false,
    });
  });
});
