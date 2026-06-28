import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import {
  evidenceLifecycleContractId,
  evidenceLifecycleProcessContracts,
  evidenceLifecycleProcessIds,
  evidenceLifecycleRouteAttributesForScreen,
  evidenceLifecycleRouteContractForScreen,
  evidenceLifecycleRouteContracts,
  evidenceLifecycleStateContracts,
  evidenceLifecycleStates,
  evidenceLifecycleStepContracts,
} from "../lib/evidence-lifecycle-contract";

const repoRoot = process.cwd();

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("EPIC-08 evidence lifecycle contract", () => {
  test("declares the full DOMAIN-C process and state vocabulary", () => {
    expect(evidenceLifecycleProcessIds).toEqual([
      "BP-023",
      "BP-024",
      "BP-025",
      "BP-026",
      "BP-027",
      "BP-028",
      "BP-029",
      "BP-030",
      "BP-031",
      "BP-032",
      "BP-033",
    ]);
    expect(evidenceLifecycleProcessContracts).toHaveLength(11);
    expect(evidenceLifecycleStates).toContain("NEEDS_EVIDENCE");
    expect(evidenceLifecycleStates).toContain("INSUFFICIENT_REREQUESTED");
    expect(evidenceLifecycleStates).toContain("CLIENT_SAFE_SUMMARY_AVAILABLE");
    expect(evidenceLifecycleStateContracts.UPLOAD_RECEIVED.overclaim).toContain("not evidence sufficiency");
  });

  test("materializes all 77 mapped steps with audit gates on validation review and sufficiency", () => {
    expect(evidenceLifecycleStepContracts).toHaveLength(77);
    expect(evidenceLifecycleStepContracts.filter((step) => step.stepId.endsWith("-S03")).every((step) => step.requiresAudit)).toBe(true);
    expect(evidenceLifecycleStepContracts.filter((step) => step.stepId.endsWith("-S04")).every((step) => step.requiresAudit)).toBe(true);
    expect(evidenceLifecycleStepContracts.filter((step) => step.stepId.endsWith("-S06")).every((step) => step.requiresAudit)).toBe(true);
    expect(evidenceLifecycleStepContracts.map((step) => step.stepId)).toContain("BP-023-S01");
    expect(evidenceLifecycleStepContracts.map((step) => step.stepId)).toContain("BP-033-S07");
  });

  test("owns the six EPIC-08 target surfaces without creating new routes", () => {
    expect(evidenceLifecycleRouteContracts.map((contract) => contract.screenId)).toEqual(["S027", "S028", "S029", "S030", "S046", "S047"]);
    expect(evidenceLifecycleRouteContractForScreen("S027")).toMatchObject({
      ownedProcesses: ["BP-023", "BP-024", "BP-025", "BP-026", "BP-027", "BP-028", "BP-033"],
      route: "/documents",
    });
    expect(evidenceLifecycleRouteContractForScreen("S046").ownedProcesses).toContain("BP-032");
    expect(evidenceLifecycleRouteContracts.every((contract) => contract.route.startsWith("/"))).toBe(true);
  });

  test("projects S027 runtime attributes for the area entry without product-copy scaffolding", () => {
    expect(evidenceLifecycleRouteAttributesForScreen("S027")).toMatchObject({
      "data-ux-epic08-contract": evidenceLifecycleContractId,
      "data-ux-epic08-screen": "S027",
      "data-ux-epic08-route": "/documents",
      "data-ux-no-overclaim": "true",
    });
    expect(evidenceLifecycleRouteAttributesForScreen("S027")["data-ux-epic08-owned-processes"]).toContain("BP-023");
    expect(evidenceLifecycleRouteAttributesForScreen("S027")["data-ux-epic08-forbidden-overclaims"]).toContain("upload_as_sufficiency");
  });

  test("adopts the contract in the S027 document area entry", () => {
    const source = readSource("components", "client-intake-screen.tsx");

    expect(source).toContain("EvidenceLifecycleAreaEntry");
    expect(source).toContain('evidenceLifecycleRouteAttributesForScreen("S027")');
    expect(source).toContain('data-testid="epic08-evidence-lifecycle-area-entry"');
    expect(source).toContain("Upload scoped evidence");
    expect(source).toContain('data-testid="p10-p14-documents-closure"');
    expect(source).toContain('density="compact"');
    expect(source).not.toContain('<ScfP04P06FlowPanel mode="evidence" />\n        <ScfP10P14ClosurePanel mode="documents" />');
  });

  test("keeps the S027 area entry and document workbench within the 1440x900 viewport", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await authenticate(page);
    await page.goto("/documents");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("epic08-evidence-lifecycle-area-entry")).toBeVisible();
    await expect(page.getByTestId("p10-p14-documents-closure")).toBeVisible();
    await expect(page.getByTestId("p10-document-filter-summary")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    }));

    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight);
  });
});
