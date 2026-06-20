import { expect, test } from "@playwright/test";

import {
  buildPhase0SourceRealitySnapshot,
  phase0LockedApiRoutes,
  phase0LockedPrismaShape,
  phase0LockedRouteWorksetCounts,
  phase0P0GateLabels,
  phase0SourceHierarchyMarkers,
} from "../lib/source-reality-gate";

test.describe("Mega-journey Phase 0 source reality gate", () => {
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

    for (const marker of phase0SourceHierarchyMarkers) {
      expect(planText).toContain(marker);
    }

    expect(planText).toContain("No code change, no test execution");
    expect(planText).toContain("no `main` target truth");
    expect(planText).toContain("CODEX_EXECUTION_REQUIRES_EXPLICIT_HANDOFF_OR_USER_CONFIRMATION");
  });

  test("keeps P0 gate labels mapped before acceptance claims", () => {
    const { p0GateLabels, planText } = buildPhase0SourceRealitySnapshot();

    expect(p0GateLabels).toEqual([...phase0P0GateLabels]);

    for (const gate of p0GateLabels) {
      expect(planText.toLowerCase()).toContain(gate.toLowerCase());
    }

    expect(planText).toContain("Presence is not readiness proof");
    expect(planText).toContain("No existing test slice overclaimed as full P0 proof");
  });

  test("tracks executable test inventory without treating count as readiness", () => {
    const { specFiles } = buildPhase0SourceRealitySnapshot();

    expect(specFiles).toContain("tests/source-reality-gate.spec.ts");
    expect(specFiles.length).toBeGreaterThanOrEqual(17);
  });
});

