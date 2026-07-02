import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

import {
  evidenceLifecycleContractId,
  evidenceLifecycleProofBoundaryForScreen,
  evidenceLifecycleProcessContracts,
  evidenceLifecycleProcessIds,
  evidenceLifecycleRouteAttributesForScreen,
  evidenceLifecycleRouteContractForScreen,
  evidenceLifecycleRouteContracts,
  evidenceLifecycleStateContracts,
  evidenceLifecycleStates,
  evidenceLifecycleStepContracts,
} from "../lib/evidence-lifecycle-contract";
import { authenticatePageWithJwt } from "./helpers/auth-jwt";

const repoRoot = process.cwd();

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, {
    email: "cfo.morgan@example.demo",
    roleKey: "family_cfo",
    tenantSlug: "morgan",
  });
}

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("DOMAIN-08 evidence lifecycle contract", () => {
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

  test("owns the six DOMAIN-08 target surfaces without creating new routes", () => {
    expect(evidenceLifecycleRouteContracts.map((contract) => contract.screenId)).toEqual(["S027", "S028", "S029", "S030", "S046", "S047"]);
    expect(evidenceLifecycleRouteContractForScreen("S027")).toMatchObject({
      ownedProcesses: ["BP-023", "BP-024", "BP-025", "BP-026", "BP-027", "BP-028", "BP-033"],
      route: "/documents",
    });
    expect(evidenceLifecycleRouteContractForScreen("S046").ownedProcesses).toContain("BP-032");
    expect(evidenceLifecycleRouteContracts.every((contract) => contract.route.startsWith("/"))).toBe(true);
  });

  test("defines fail-closed proof boundaries for the core evidence process cluster", () => {
    for (const screen of ["S028", "S029", "S030"] as const) {
      const boundary = evidenceLifecycleProofBoundaryForScreen(screen);

      expect(boundary.auditFailureMode).toBe("fail_closed_without_client_visibility");
      expect(boundary.clientSafePayload).toBe("redacted_summary_only");
      expect(boundary.auditRequiredStepIds.length).toBeGreaterThan(0);
      expect(boundary.forbiddenOverclaims.join(" ")).not.toMatch(/release_complete|client_visibility_unlocked|export_approved/i);
    }
  });

  test("projects S027 runtime attributes for the area entry without product-copy scaffolding", () => {
    expect(evidenceLifecycleRouteAttributesForScreen("S027")).toMatchObject({
      "data-ux-domain08-contract": evidenceLifecycleContractId,
      "data-ux-domain08-screen": "S027",
      "data-ux-domain08-route": "/documents",
      "data-ux-no-overclaim": "true",
    });
    expect(evidenceLifecycleRouteAttributesForScreen("S027")["data-ux-domain08-owned-processes"]).toContain("BP-023");
    expect(evidenceLifecycleRouteAttributesForScreen("S027")["data-ux-domain08-forbidden-overclaims"]).toContain("upload_as_sufficiency");
  });

  test("adopts the contract in the S027 document area entry", () => {
    const source = readSource("components", "client-intake-screen.tsx");

    expect(source).toContain("EvidenceLifecycleAreaEntry");
    expect(source).toContain('evidenceLifecycleRouteAttributesForScreen("S027")');
    expect(source).toContain('data-testid="domain08-evidence-lifecycle-area-entry"');
    expect(source).toContain("Upload evidence");
    expect(source).toContain('data-testid="p10-document-filter-summary"');
    expect(source).toContain('density="compact"');
    expect(source).not.toContain('<ScfP04P06FlowPanel mode="evidence" />\n        <ScfP10P14ClosurePanel mode="documents" />');
  });

  test("keeps the S027 area entry and document workbench within the 1440x900 viewport", async ({ page, request }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await authenticate(page, request);
    await page.goto("/documents");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("domain08-evidence-lifecycle-area-entry")).toBeVisible();
    await expect(page.getByTestId("p10-document-filter-summary")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    }));

    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight);
  });

  test("keeps the S028 S029 S030 core process cluster gated and within the 1440x900 viewport", async ({ page, request }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await authenticate(page, request);

    for (const route of [
      { path: "/documents/upload", screen: "S028", testId: "domain08-core-surface-s028" },
      { path: "/documents/review-queue", screen: "S029", testId: "domain08-core-surface-s029" },
      { path: "/documents/morgan-tax-residency/review", screen: "S030", testId: "domain08-core-surface-s030" },
    ]) {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");

      const surface = page.getByTestId(route.testId);
      await expect(surface).toBeVisible();
      await expect(surface).toHaveAttribute("data-ux-domain08-contract", evidenceLifecycleContractId);
      await expect(surface).toHaveAttribute("data-ux-domain08-screen", route.screen);
      await expect(surface).toHaveAttribute("data-ux-no-overclaim", "true");
      await expect(page.getByTestId(`domain08-proof-boundary-${route.screen.toLowerCase()}`)).toHaveCount(0);
      await expect(page.locator("main")).not.toContainText(/release complete|client visibility unlocked|evidence sufficient|export approved|client accepted/i);

      const dimensions = await page.evaluate(() => ({
        clientHeight: document.documentElement.clientHeight,
        scrollHeight: document.documentElement.scrollHeight,
      }));

      expect(dimensions.scrollHeight, route.path).toBeLessThanOrEqual(dimensions.clientHeight);
    }
  });
});
