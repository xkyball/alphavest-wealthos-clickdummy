import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import { authenticatePageWithContextJwt } from "./helpers/auth-jwt";
import {
  scfDoNotImplementRegister,
  scfFoundationTaskIds,
  scfMasterTasksForStages,
  scfSubtasksForStages,
} from "../lib/scf-foundation";
import { scfP10P14ProofPackage } from "../lib/scf-p10-p14-proof";

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

test.describe("SCF P10-P14 implementation closure", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
    await authenticatePageWithContextJwt(page, {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
  });

  test("represents all P10-P14 master tasks, subtasks and unsupported P15 honestly", () => {
    const taskIds = scfFoundationTaskIds();
    const masterTasks = scfMasterTasksForStages(["P10", "P11", "P12", "P13", "P14"]);
    const subtasks = scfSubtasksForStages(["P10", "P11", "P12", "P13", "P14"]);

    expect(masterTasks).toHaveLength(11);
    expect(subtasks).toHaveLength(47);
    expect(taskIds).toEqual(expect.arrayContaining(scfP10P14ProofPackage.taskIds));
    expect(scfP10P14ProofPackage.unsupportedRequestedStages).toEqual(["P15"]);
    expect(scfP10P14ProofPackage.taskIds.some((taskId) => taskId.includes("P15"))).toBe(false);
    expect(scfP10P14ProofPackage.p14TaskStatuses.every((task) => task.status === "blocked_until_QA")).toBe(true);
    expect(scfDoNotImplementRegister.map((entry) => entry.id)).toEqual(
      expect.arrayContaining(["DNI-P1-001", "DNI-REF-001", "DNI-HOLD-001"]),
    );
  });

  test("filters the document table by search, type, status and sensitivity", async ({ page }) => {
    await page.goto("/documents");

    await expect(page.getByTestId("p10-document-search")).toBeVisible();
    await expect(page.getByTestId("p10-document-filter-summary")).toContainText("scoped documents visible");
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    const documentTable = page.getByRole("table").last();

    await page.getByTestId("p10-document-search").fill("tax-residency-2026");
    await expect(documentTable).toContainText("bennett-tax-residency-2026.pdf");
    await expect(page.getByTestId("p10-document-filter-summary")).toContainText("1 of");

    await page.getByTestId("p10-document-search").fill("");
    await page.getByTestId("p10-document-type-filter").selectOption("source_of_funds");
    await expect(documentTable).toContainText("bennett-source-of-funds-review.pdf");

    await page.getByTestId("p10-document-type-filter").selectOption("all");
    await page.getByTestId("p10-document-status-filter").selectOption("NEEDS_CLARIFICATION");
    await page.getByTestId("p10-document-sensitivity-filter").selectOption("HIGHLY_RESTRICTED");
    await expect(documentTable).toContainText("bennett-ips-risk-addendum.pdf");
  });

  test("keeps P10-P14 explainer panels out of product routes", async ({ page }) => {
    await page.goto("/export/client-package/scope");
    await expect(page.getByTestId("p10-p14-api-closure")).toHaveCount(0);
    await expect(page.getByText("API and Persistence Closure")).toHaveCount(0);

    await page.goto("/admin/platform");
    await expect(page.getByTestId("p10-p14-handoff-closure")).toHaveCount(0);
    await expect(page.getByText("Handoff Closure")).toHaveCount(0);
  });

  test("returns fail-closed document API metadata without DB user JWT", async ({ request }) => {
    const response = await request.get("/api/documents?tenantSlug=unknown&roleKey=family_cfo");
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body).toMatchObject({
      documents: [],
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: false,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        releaseUnlocked: false,
        scoped: false,
      },
    });
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
  });
});
