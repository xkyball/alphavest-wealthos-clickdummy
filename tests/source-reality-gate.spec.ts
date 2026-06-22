import { expect, test } from "@playwright/test";

import {
  buildPhase0SourceRealitySnapshot,
  phase0LockedApiRoutes,
  phase0LockedPrismaShape,
  phase0LockedRouteWorksetCounts,
  phase0P0GateLabels,
  oldSourceOfTruthPhrases,
  trueUxRequiredSupportArtifacts,
  trueUxSourceHierarchyMarkers,
} from "../lib/source-reality-gate";

test.describe("True UX source reality gate", () => {
  test("keeps route worksets, API universe and Prisma shape executable", () => {
    const snapshot = buildPhase0SourceRealitySnapshot();

    expect(snapshot.routeRegistryCount).toBe(71);
    expect(snapshot.routeWorksetIntegrity.counts).toEqual(phase0LockedRouteWorksetCounts);
    expect(snapshot.routeWorksetIntegrity.missingPageIds).toEqual([]);
    expect(snapshot.routeWorksetIntegrity.unknownPageIds).toEqual([]);
    expect(snapshot.routeWorksetIntegrity.duplicatePageIds).toEqual([]);
    expect(snapshot.apiRouteFiles).toEqual([...phase0LockedApiRoutes]);
    expect(snapshot.prismaShape).toEqual(phase0LockedPrismaShape);
  });

  test("keeps source hierarchy and main-branch exclusion explicit", () => {
    const { planText } = buildPhase0SourceRealitySnapshot();

    for (const marker of trueUxSourceHierarchyMarkers) {
      expect(planText).toContain(marker);
    }

    expect(planText).toContain("Source-of-Truth Applied");
    expect(planText).toContain("Moving Baseline Preflight Gate");
    expect(planText).toContain("Execution Order Overview");
  });

  test("keeps P0 gate labels mapped before acceptance claims", () => {
    const { p0GateLabels, planText } = buildPhase0SourceRealitySnapshot();

    expect(p0GateLabels).toEqual([...phase0P0GateLabels]);

    for (const gate of p0GateLabels) {
      expect(planText.toLowerCase()).toContain(gate.toLowerCase());
    }

    expect(planText).toContain("Skip safety negative tests");
    expect(planText).toContain("P0 Safety Tests");
  });

  test("tracks executable test inventory without treating count as readiness", () => {
    const { specFiles } = buildPhase0SourceRealitySnapshot();

    expect(specFiles).toContain("tests/source-reality-gate.spec.ts");
    expect(specFiles.length).toBeGreaterThanOrEqual(17);
  });

  test("keeps True UX support artifacts present and handoff-bounded", () => {
    const { trueUxSupportArtifacts } = buildPhase0SourceRealitySnapshot();

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
    const { trueUxEntrypoints } = buildPhase0SourceRealitySnapshot();

    for (const entrypoint of trueUxEntrypoints) {
      expect(entrypoint.text, `${entrypoint.path} names True UX handoff`).toContain(
        "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md",
      );

      for (const oldPhrase of oldSourceOfTruthPhrases) {
        expect(entrypoint.text, `${entrypoint.path} does not contain ${oldPhrase}`).not.toContain(oldPhrase);
      }
    }
  });
});
