import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import {
  scfDoNotImplementRegister,
  scfFoundationTaskIds,
  scfMasterTasksForPhases,
  scfSubtasksForPhases,
} from "../lib/scf-foundation";
import { scfP10P14ProofPackage } from "../lib/scf-p10-p14-proof";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("SCF P10-P14 implementation closure", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

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
    await page.getByLabel("Tenant context").last().selectOption("bennett");
    await page.getByLabel("Role context").last().selectOption("compliance_officer");

    await expect(page.getByTestId("p10-p14-documents-closure")).toBeVisible();
    await expect(page.getByTestId("p10-document-filter-summary")).toContainText("scoped documents visible");
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    const documentTable = page.getByRole("table").last();

    const fetchExpectedDocumentNames = async (params: Record<string, string>) => {
      const searchParams = new URLSearchParams({
        page: "1",
        pageSize: "10",
        roleKey: "compliance_officer",
        sortDirection: "desc",
        sortKey: "uploadedAt",
        tenantSlug: "bennett",
        ...params,
      });
      const response = await page.request.get(`/api/documents?${searchParams.toString()}`);
      const body = (await response.json()) as { documents?: Array<{ fileName?: string; title?: string }> };

      expect(response.ok()).toBe(true);
      return (body.documents ?? []).map((document) => document.fileName ?? document.title ?? "");
    };

    const expectBackendDocumentsVisible = async (expectedNames: string[]) => {
      if (expectedNames.length === 0) {
        await expect(documentTable).toContainText("No scoped documents match the current search and filters.");
        return;
      }

      await expect(documentTable).toContainText(expectedNames[0]);
    };

    const taxResidencyNames = await fetchExpectedDocumentNames({ q: "tax-residency-2026" });
    await page.getByTestId("p10-document-search").fill("tax-residency-2026");
    await expectBackendDocumentsVisible(taxResidencyNames);
    await expect(page.getByTestId("p10-document-filter-summary")).toContainText(`${taxResidencyNames.length} of`);

    const sourceOfFundsNames = await fetchExpectedDocumentNames({ type: "source_of_funds" });
    await page.getByTestId("p10-document-search").fill("");
    await page.getByTestId("p10-document-type-filter").selectOption("source_of_funds");
    await expectBackendDocumentsVisible(sourceOfFundsNames);

    const restrictedNeedsClarificationNames = await fetchExpectedDocumentNames({
      sensitivity: "HIGHLY_RESTRICTED",
      status: "NEEDS_CLARIFICATION",
    });
    await page.getByTestId("p10-document-type-filter").selectOption("all");
    await page.getByTestId("p10-document-status-filter").selectOption("NEEDS_CLARIFICATION");
    await page.getByTestId("p10-document-sensitivity-filter").selectOption("HIGHLY_RESTRICTED");
    await expectBackendDocumentsVisible(restrictedNeedsClarificationNames);
  });

  test("renders P10-P14 closure panels on API and handoff-adjacent workflows", async ({ page }) => {
    await page.goto("/export/demo/scope");
    await expect(page.getByTestId("p10-p14-api-closure")).toBeVisible();
    await expect(page.getByText("API and Persistence Closure")).toBeVisible();

    await page.goto("/admin/platform");
    await expect(page.getByTestId("p10-p14-handoff-closure")).toBeVisible();
    await expect(page.getByText("Handoff Closure")).toBeVisible();
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
