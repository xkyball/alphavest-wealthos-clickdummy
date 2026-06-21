import { expect, test } from "@playwright/test";

import {
  scfDoNotImplementRegister,
  scfFoundationTaskIds,
  scfMasterTasksForPhases,
  scfSubtasksForPhases,
} from "../lib/scf-foundation";
import { scfP10P14ProofPackage } from "../lib/scf-p10-p14-proof";

test.describe("SCF P10-P14 implementation closure", () => {
  test("represents all P10-P14 master tasks, subtasks and unsupported P15 honestly", () => {
    const taskIds = scfFoundationTaskIds();
    const masterTasks = scfMasterTasksForPhases(["P10", "P11", "P12", "P13", "P14"]);
    const subtasks = scfSubtasksForPhases(["P10", "P11", "P12", "P13", "P14"]);

    expect(masterTasks).toHaveLength(11);
    expect(subtasks).toHaveLength(47);
    expect(taskIds).toEqual(expect.arrayContaining(scfP10P14ProofPackage.taskIds));
    expect(scfP10P14ProofPackage.unsupportedRequestedPhases).toEqual(["P15"]);
    expect(scfP10P14ProofPackage.taskIds.some((taskId) => taskId.includes("P15"))).toBe(false);
    expect(scfP10P14ProofPackage.p14TaskStatuses.every((task) => task.status === "blocked_until_QA")).toBe(true);
    expect(scfDoNotImplementRegister.map((entry) => entry.id)).toEqual(
      expect.arrayContaining(["DNI-P1-001", "DNI-REF-001", "DNI-HOLD-001"]),
    );
  });

  test("filters the document table by search, type, status and sensitivity", async ({ page }) => {
    await page.goto("/documents");

    await expect(page.getByTestId("p10-p14-documents-closure")).toBeVisible();
    await expect(page.getByTestId("p10-document-filter-summary")).toContainText("scoped documents visible");
    const documentTable = page.getByRole("table").last();

    await page.getByTestId("p10-document-search").fill("Tax Return");
    await expect(documentTable.getByText("Tax Return 2023.pdf")).toBeVisible();
    await expect(documentTable.getByText("Estate Plan Overview.docx")).toBeHidden();
    await expect(page.getByTestId("p10-document-filter-summary")).toContainText("1 of");

    await page.getByTestId("p10-document-search").fill("");
    await page.getByTestId("p10-document-type-filter").selectOption("Estate Planning");
    await expect(documentTable.getByText("Estate Plan Overview.docx")).toBeVisible();
    await expect(documentTable.getByText("Tax Return 2023.pdf")).toBeHidden();

    await page.getByTestId("p10-document-type-filter").selectOption("all");
    await page.getByTestId("p10-document-status-filter").selectOption("In Review");
    await page.getByTestId("p10-document-sensitivity-filter").selectOption("Confidential");
    await expect(documentTable.getByText("Estate Plan Overview.docx")).toBeVisible();
    await expect(documentTable.getByText("Portfolio Holdings - Apr 2024.xlsx")).toBeHidden();
  });

  test("renders P10-P14 closure panels on API and proof-adjacent workflows", async ({ page }) => {
    await page.goto("/export/demo/scope");
    await expect(page.getByTestId("p10-p14-api-closure")).toBeVisible();
    await expect(page.getByText("API and Persistence Closure")).toBeVisible();

    await page.goto("/admin/platform");
    await expect(page.getByTestId("p10-p14-proof-closure")).toBeVisible();
    await expect(page.getByText("Proof and Handoff Closure")).toBeVisible();
  });

  test("returns fail-closed document API metadata for invalid scope", async ({ request }) => {
    const response = await request.get("/api/documents?tenantSlug=unknown&roleKey=family_cfo");
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body).toMatchObject({
      documents: [],
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: false,
      safety: {
        hiddenRowsDisclosed: false,
        releaseUnlocked: false,
        scoped: false,
      },
    });
    expect(body.issues).toContain("valid_tenant_slug_required");
  });
});
