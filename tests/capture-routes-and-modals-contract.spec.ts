import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

test.describe("routes and modals capture contract", () => {
  test("supports a sidecar-free screens-only mode", async () => {
    const source = await readFile("scripts/capture-routes-and-modals.ts", "utf8");

    expect(source).toContain('cliArgs.has("--screens-only")');
    expect(source).toContain('process.env.AVS_CAPTURE_SCREENS_ONLY === "1"');
    expect(source).toContain('captureMode: screensOnly ? "screens-only" : "full-runtime"');
    expect(source).toContain("sidecarsEnabled: !screensOnly");
    expect(source).toContain("if (screensOnly) return;");
    expect(source).toMatch(/screensOnly\s+\?\s+alreadyOpen \|\| \(await overlay\.open\(page\)\)/);
  });

  test("keeps modal capture triggers aligned to lifecycle-tested surfaces", async () => {
    const source = await readFile("scripts/capture-routes-and-modals.ts", "utf8");

    expect(source).toContain('"/export/:id/approval"');
    expect(source).toContain('[data-testid="j08-open-export-approval"]');
    expect(source).toContain('[data-testid="j08-open-download-confirmation"]');
    expect(source).toContain('[data-testid="j07-open-role-drawer"]');
    expect(source).toContain('[data-testid="j07-review-role-changes"]');
    expect(source).toContain("await checkFirstVisibleCheckbox(page);");
    expect(source).toContain('[data-testid="j07-open-access-request-drawer"]');
    expect(source).toContain('[data-testid="j03-open-evidence-drawer"]');
  });

  test("writes model and capability context into the capture index", async () => {
    const source = await readFile("scripts/capture-routes-and-modals.ts", "utf8");

    expect(source).toContain("captureModelContextForRoute");
    expect(source).toContain("captureScreenModelAuditBaseline");
    expect(source).toContain("modelContext: CaptureScreenModelContext");
    expect(source).toContain("auditBaseline: captureScreenModelAuditBaseline");
    expect(source).toContain("item.modelContext.capability.status");
    expect(source).toContain("item.modelContext.models.join");
  });
});
