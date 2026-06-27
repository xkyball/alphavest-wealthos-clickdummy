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

  test("supports E12 release-candidate output for hard capture QA", async () => {
    const source = await readFile("scripts/capture-routes-and-modals.ts", "utf8");
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { scripts: Record<string, string> };

    expect(source).toContain('cliArgs.has("--release-candidate")');
    expect(source).toContain('process.env.AVS_CAPTURE_RELEASE_CANDIDATE === "1"');
    expect(source).toContain('const outputArtifactPrefix = releaseCandidate ? "release-candidate/current" : `routes-and-modals/${runTs}`;');
    expect(source).toContain("path.join(process.cwd(), \"artifacts\", outputArtifactPrefix)");
    expect(source).toContain("captureScope: releaseCandidate ? \"release-candidate\" : \"audit\"");
    expect(source).toContain("releaseCandidate");
    expect(source).toContain("requireCaptures: releaseCandidate");
    expect(source).toContain("failOnWarnings: releaseCandidate || process.env.CAPTURE_QA_FAIL_ON_WARNINGS === \"1\"");
    expect(packageJson.scripts["visual:capture-routes:release-candidate"]).toBe("tsx scripts/capture-routes-and-modals.ts --release-candidate --screens-only");
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
    expect(source).toContain("item.modelContext.uxOperatingModel.mode");
    expect(source).toContain("item.modelContext.uxOperatingModel.audience");
    expect(source).toContain("item.modelContext.uxOperatingModel.proofPosture");
    expect(source).toContain("item.modelContext.uxOperatingModel.noOverclaimRule");
    expect(source).toContain("item.modelContext.warnings.join");
    expect(source).toContain("item.modelContext.models.join");
  });

  test("uses screenshot filenames that expose route and interaction kind", async () => {
    const source = await readFile("scripts/capture-routes-and-modals.ts", "utf8");

    expect(source).toContain("routeToSmokePath(route.route)");
    expect(source).toContain("visualStateForRoute(route)");
    expect(source).toContain('const pathname = visualState === "base" ? smokePath : `${smokePath}?state=${visualState}`;');
    expect(source).toContain("const url = captureUrlForRoute(route);");
    expect(source).toContain('const keepParentOverlayContext = overlay.label === "role-confirm-modal" || visualState !== "base";');
    expect(source).toContain("uxCaptureVariantForFileKind");
    expect(source).toContain('${route.pageId}-route-${routeSlug(routeToSmokePath(route.route))}-${captureVariant.lifecycleKind}-${stateSlug(state)}.png');
    expect(source).toContain('const baseFile = fileNameFor(route, "screen", "base");');
    expect(source).toContain("const overlayFile = fileNameFor(route, overlay.mode, overlay.label);");
    expect(source).toContain('state.replace(/-(modal|drawer)$/i, "")');
  });

  test("projects canonical capture variants into runtime metadata and index output", async () => {
    const source = await readFile("scripts/capture-routes-and-modals.ts", "utf8");

    expect(source).toContain("captureVariant: UxCaptureVariant");
    expect(source).toContain("captureVariant: baseItem.captureVariant");
    expect(source).toContain("captureVariant: overlayItem.captureVariant");
    expect(source).toContain("captureVariant.lifecycleKind");
    expect(source).toContain("captureVariantContract");
    expect(source).toContain("captureVariantCounts");
    expect(source).toContain('"data-ux-capture-variant-kind"');
    expect(source).toContain("| State | Capture Variant | File Kind | Overlay | Status |");
    expect(source).toContain("item.captureVariant.fileKind");
    expect(source).toContain('item.captureVariant.isOverlay ? "yes" : "no"');
  });

  test("strict visual capture labels normal screenshots as base variants", async () => {
    const source = await readFile("scripts/strict-visual-capture.ts", "utf8");

    expect(source).toContain("uxCaptureVariantForFileKind");
    expect(source).toContain('uxCaptureVariantForFileKind("screen", "base")');
    expect(source).toContain("${assetName}-${captureVariant.lifecycleKind}-${viewport}.png");
    expect(source).toContain("captureVariant: UxCaptureVariant");
    expect(source).toContain("| Capture Variant | File Kind | Overlay |");
  });
});
