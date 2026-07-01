import { expect, test } from "@playwright/test";

import {
  buildStage0SourceRealitySnapshot,
  evaluateTrueUxTechnicalGuard,
  findOperationalSurfaceNonNegotiableViolationsForText,
  findTechnicalGuardViolationsForText,
  listOperationalSurfaceFiles,
  stage0LockedApiRoutes,
  stage0LockedPrismaShape,
  stage0LockedRouteWorksetCounts,
  stage0P0GateLabels,
  stage0SourceUniverseReferences,
  oldSourceOfTruthPhrases,
  trueUxRequiredSupportArtifacts,
  trueUxSourceHierarchyMarkers,
} from "../lib/source-reality-gate";

test.describe("True UX source reality gate", () => {
  test("keeps route worksets, API universe and Prisma shape executable", () => {
    const snapshot = buildStage0SourceRealitySnapshot();

    expect(snapshot.routeRegistryCount).toBe(71);
    expect(snapshot.routeWorksetIntegrity.counts).toEqual(stage0LockedRouteWorksetCounts);
    expect(snapshot.routeWorksetIntegrity.missingPageIds).toEqual([]);
    expect(snapshot.routeWorksetIntegrity.unknownPageIds).toEqual([]);
    expect(snapshot.routeWorksetIntegrity.duplicatePageIds).toEqual([]);
    expect(snapshot.apiRouteFiles).toEqual([...stage0LockedApiRoutes]);
    expect(snapshot.prismaShape).toEqual(stage0LockedPrismaShape);
  });

  test("keeps source hierarchy and main-branch exclusion explicit", () => {
    const { planText } = buildStage0SourceRealitySnapshot();

    for (const marker of trueUxSourceHierarchyMarkers) {
      expect(planText).toContain(marker);
    }

    expect(planText).toContain("Source-of-Truth Applied");
    expect(planText).toContain("Moving Baseline Preflight Gate");
    expect(planText).toContain("Execution Order Overview");
  });

  test("keeps P0 gate labels mapped before acceptance claims", () => {
    const { p0GateLabels, planText } = buildStage0SourceRealitySnapshot();

    expect(p0GateLabels).toEqual([...stage0P0GateLabels]);

    for (const gate of p0GateLabels) {
      expect(planText.toLowerCase()).toContain(gate.toLowerCase());
    }

    expect(planText).toContain("Skip safety negative tests");
    expect(planText).toContain("P0 Safety Tests");
  });

  test("tracks executable test inventory without treating count as readiness", () => {
    const { specFiles } = buildStage0SourceRealitySnapshot();

    expect(specFiles).toContain("tests/source-reality-gate.spec.ts");
    expect(specFiles.length).toBeGreaterThanOrEqual(17);
  });

  test("keeps P0 business process specification available through source universe references", () => {
    const { sourceUniverseReferences } = buildStage0SourceRealitySnapshot();

    expect(sourceUniverseReferences).toEqual(stage0SourceUniverseReferences);
    expect(sourceUniverseReferences).toContainEqual(
      expect.objectContaining({
        path: "docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json",
        referenceKey: "universe:p0-business-process-specification",
        status: "P0_PROCESS_DETAIL_SPECIFICATION_ACCEPTED_AS_FILTERED_VIEW",
      }),
    );
  });

  test("keeps True UX support artifacts present and handoff-bounded", () => {
    const { trueUxSupportArtifacts } = buildStage0SourceRealitySnapshot();

    expect(trueUxSupportArtifacts.map((artifact) => artifact.path)).toEqual(
      trueUxRequiredSupportArtifacts.map((artifact) => artifact.path),
    );

    for (const artifact of trueUxSupportArtifacts) {
      expect(artifact.exists, `${artifact.path} exists`).toBe(true);

      for (const marker of artifact.markers) {
        expect(artifact.text, `${artifact.path} contains ${marker}`).toContain(marker);
      }
    }
  });

  test("keeps repo entrypoints on the True UX handoff and off old operative sources", () => {
    const { trueUxEntrypoints } = buildStage0SourceRealitySnapshot();

    for (const entrypoint of trueUxEntrypoints) {
      expect(entrypoint.text, `${entrypoint.path} names True UX handoff`).toContain(
        "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md",
      );

      for (const oldPhrase of oldSourceOfTruthPhrases) {
        expect(entrypoint.text, `${entrypoint.path} does not contain ${oldPhrase}`).not.toContain(oldPhrase);
      }
    }
  });

  test("keeps the technical source and target guard executable", () => {
    const result = evaluateTrueUxTechnicalGuard();

    expect(result.checkedFiles).toEqual([
      "AGENTS.md",
      "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md",
      "README.md",
    ]);
    expect(result.checkedSurfaceFiles).toEqual(listOperationalSurfaceFiles());
    expect(result.checkedSurfaceFiles.length).toBeGreaterThan(0);
    expect(result.checkedScripts).toEqual(["guard:source", "test:source-reality"]);
    expect(result.violations).toEqual([]);
  });

  test("breaks when operational UI renders internal proof or process scaffolding as visible copy", () => {
    const violations = findOperationalSurfaceNonNegotiableViolationsForText(
      "components/example-screen.tsx",
      [
        '<CardTitle>UX-DECISION-ROOM-001 release proof</CardTitle>',
        '<PageHeading subtitle="data-testid selector proves Workflow step BP-063" title="Compliance" />',
        '{ label: "Route", tone: "blue", value: "048" },',
      ].join("\n"),
    );

    expect(violations).toEqual([
      expect.objectContaining({
        line: 1,
        ruleId: "NO_VISIBLE_INTERNAL_UI_SCAFFOLDING",
      }),
      expect.objectContaining({
        line: 2,
        ruleId: "NO_VISIBLE_INTERNAL_UI_SCAFFOLDING",
      }),
      expect.objectContaining({
        line: 3,
        ruleId: "NO_VISIBLE_INTERNAL_UI_SCAFFOLDING",
      }),
    ]);
  });

  test("allows product-native operational state and recovery copy", () => {
    expect(
      findOperationalSurfaceNonNegotiableViolationsForText(
        "components/example-screen.tsx",
        [
          '<CardTitle>Compliance release blocked</CardTitle>',
          '<StatePanel detail="Evidence review is incomplete. Request missing evidence before release can continue." title="Release blocked" />',
        ].join("\n"),
      ),
    ).toEqual([]);
  });

  test("distinguishes forbidden target drift from approved stop-rule wording", () => {
    expect(
      findTechnicalGuardViolationsForText(
        "allowed.md",
        [
          "Do not use main as target truth.",
          "main branch / main ZIP is a false-gap warning only.",
          "Do not generate images, state-screen assets, or screen assets.",
          "No blind schema replacement.",
          "Do not promote P1 hold routes to MVP without route evolution policy.",
        ].join("\n"),
      ),
    ).toEqual([]);

    const violations = findTechnicalGuardViolationsForText(
      "forbidden.md",
      [
        "Target branch: main",
        "Generate screen images for the missing states.",
        "Adopt the patch-schema before implementation.",
        "Promote P1 hold routes to MVP now.",
      ].join("\n"),
    );

    expect(violations.map((violation) => violation.ruleId)).toEqual([
      "NO_MAIN_TARGET_TRUTH",
      "NO_UNAUTHORIZED_SCREEN_ASSET_GENERATION",
      "NO_BLIND_SCHEMA_OR_PATCH_REPLACEMENT",
      "NO_SCOPE_ELEVATION_WITHOUT_POLICY",
    ]);
  });
});
