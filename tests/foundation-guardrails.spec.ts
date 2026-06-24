import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { routeWorksetIntegrity } from "../lib/route-registry";
import {
  assertWave02JourneyExecutable,
  wave02BlockedJourneys,
  wave02HoldRouteAssertions,
  wave02SourceLock,
} from "../lib/source-lock/wave0-2-source-lock";

const handoffRoot = "_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED";

function fileText(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function apiRouteFiles(relativePath: string) {
  const absolutePath = path.join(process.cwd(), relativePath);
  return readdirSync(absolutePath, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name === "route.ts")
    .map((entry) => path.join(entry.parentPath, entry.name))
    .map((absoluteFile) => path.relative(process.cwd(), absoluteFile).split(path.sep).join("/"))
    .sort();
}

test.describe("Phase 01 foundation guardrails", () => {
  test("keeps the operative source hierarchy and patched changelog explicit", () => {
    const sourceOrder = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/SOURCE_OF_TRUTH_ORDER.md`);
    const patchChangelog = fileText(`${handoffRoot}/00_START_HERE/V2_1_PATCH_CHANGELOG.md`);
    const trueUxHandoff = fileText("ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md");

    expect(sourceOrder.indexOf("FINAL_CODEX_IMPLEMENTATION_HANDOFF.md")).toBeLessThan(
      sourceOrder.indexOf("FINAL_CODEX_TASK_MASTER.md"),
    );
    expect(sourceOrder).toContain("Safety contracts remain binding below the operative authority.");
    expect(patchChangelog).toContain("v2.1 is not a new product handoff");
    expect(patchChangelog).toContain("No Codex product decisions.");
    expect(trueUxHandoff).toContain("ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF");
    expect(trueUxHandoff).toContain("MANDATORY_BEFORE_ANY_CODE_CHANGE");
    expect(trueUxHandoff).toContain("TRUE_UX_CODEX_TASK_PACK_APPLIED");
  });

  test("preserves no-main, no-generation, no-new-api and no-schema-replacement stop rules", () => {
    const finalHandoff = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`);
    const stopRules = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/STOP_RULES_MASTER.md`);
    const gateChecklist = fileText(`${handoffRoot}/02_EXECUTION_COMPLETION_ARTEFACTS/PHASE_ENTRY_EXIT_GATE_CHECKLIST.md`);

    expect(finalHandoff).toContain("alphavest-wealthos-clickdummy-full-workflow.zip");
    expect(finalHandoff).toContain("BLOCKED_AS_TARGET");
    expect(stopRules).toContain("new API route by default");
    expect(stopRules).toContain("Prisma/schema replacement");
    expect(stopRules).toContain("screen/state-screen/image/visual generation");
    expect(stopRules).toContain("`main` as target truth");
    expect(gateChecklist).toContain("Preserve no-generation rule.");
    expect(gateChecklist).toContain("Preserve `main` block.");
  });

  test("keeps the route worksets and existing API universe locked", () => {
    expect(routeWorksetIntegrity.counts).toEqual({
      MVP: 31,
      MVP_SUPPORT: 25,
      P1_AFTER_MVP: 5,
      REFERENCE_ONLY: 3,
      HOLD_PENDING_DECISION: 7,
    });
    expect(routeWorksetIntegrity.missingPageIds).toEqual([]);
    expect(routeWorksetIntegrity.unknownPageIds).toEqual([]);
    expect(routeWorksetIntegrity.duplicatePageIds).toEqual([]);

    expect(apiRouteFiles("app/api")).toEqual([
      "app/api/admin-tenants/route.ts",
      "app/api/audit-events/route.ts",
      "app/api/auth/dummy/route.ts",
      "app/api/auth/logout/route.ts",
      "app/api/auth/mfa/verify/route.ts",
      "app/api/auth/provider-login/route.ts",
      "app/api/auth/providers/route.ts",
      "app/api/current-user/route.ts",
      "app/api/dashboard-metrics/route.ts",
      "app/api/demo-workflow/route.ts",
      "app/api/documents/review/route.ts",
      "app/api/documents/route.ts",
      "app/api/documents/upload/route.ts",
      "app/api/entities/route.ts",
      "app/api/export-workflow/route.ts",
      "app/api/family-members/route.ts",
      "app/api/global-search/route.ts",
      "app/api/journeys/[id]/audit/route.ts",
      "app/api/journeys/[id]/client-projection/route.ts",
      "app/api/journeys/[id]/commands/route.ts",
      "app/api/journeys/[id]/evidence-sufficiency/route.ts",
      "app/api/journeys/[id]/route.ts",
      "app/api/journeys/route.ts",
      "app/api/ops-sla/route.ts",
      "app/api/profile/route.ts",
      "app/api/review-monitoring/route.ts",
    ]);
  });

  test("keeps patch-only schema concepts blocked by default", () => {
    const schema = fileText("prisma/schema.prisma");
    const taskMaster = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/FINAL_CODEX_TASK_MASTER.md`);

    for (const modelName of ["AiDraft", "ClientVisibilityEvaluation", "PolicyException"]) {
      expect(schema).not.toContain(`model ${modelName}`);
    }
    expect(taskMaster).toContain("Block blind creation of patch-only models");
    expect(taskMaster).toContain("Do not create explicit models unless final handoff resolves need");
  });

  test("keeps Wave 0-2 source lock and hold journeys machine-readable", () => {
    expect(wave02SourceLock.targetBranch).toBe("full-workflow");
    expect(wave02SourceLock.forbiddenTargetTruth).toContain("main");
    expect(wave02SourceLock.noGenerationRules).toEqual([
      "NO_SCREEN_GENERATION",
      "NO_STATE_SCREEN_GENERATION",
      "NO_IMAGE_GENERATION",
    ]);

    expect(wave02BlockedJourneys.map((journey) => journey.journeyId)).toEqual(["MJ-004", "MJ-007"]);
    expect(() => assertWave02JourneyExecutable("MJ-004")).toThrow(/blocked by Wave 0-2 source lock/);
    expect(() => assertWave02JourneyExecutable("MJ-007")).toThrow(/blocked by Wave 0-2 source lock/);
    expect(() => assertWave02JourneyExecutable("MJ-001")).not.toThrow();

    expect(wave02HoldRouteAssertions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pageId: "064",
          routeScope: "HOLD_PENDING_DECISION",
          access: expect.objectContaining({ implementationShellAccessible: false }),
        }),
        expect.objectContaining({
          pageId: "071",
          routeScope: "HOLD_PENDING_DECISION",
          access: expect.objectContaining({ implementationShellAccessible: false }),
        }),
      ]),
    );
  });

  test("keeps P0 and UI lifecycle proof language bounded", () => {
    const finalHandoff = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`);
    const interactionPatch = fileText(`${handoffRoot}/04_CODEX_PHASE_PROMPTS/03_04_05_UI_INTERACTION_REALITY_REMEDIATION_PATCH.md`);

    expect(finalHandoff).toContain("Existing tests partial; missing tests specified");
    expect(finalHandoff).toContain("visible drawers/modals prove lifecycle behaviour");
    expect(interactionPatch).toContain("claim existing tests prove full P0 safety");
    expect(interactionPatch).toContain("treat visible UI as lifecycle proof");
  });
});
