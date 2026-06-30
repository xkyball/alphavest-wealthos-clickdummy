import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { p0ApiRouteUniverse } from "../lib/p0-acceptance-proof";
import { routeWorksetIntegrity } from "../lib/route-registry";
import {
  assertWave02ProcessExecutable,
  wave02BlockedProcesses,
  wave02HoldRouteAssertions,
  wave02SourceLock,
} from "../lib/source-lock/wave0-2-source-lock";

const handoffRoot = "_codex_handoff/ALPHAVEST_SOURCE_HANDOFF_EXECUTION_PACK_v2_1_PATCHED";

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

test.describe("Stage 01 foundation guardrails", () => {
  test("keeps the operative source hierarchy and patched changelog explicit", () => {
    const sourceOrder = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/SOURCE_OF_TRUTH_ORDER.md`);
    const patchChangelog = fileText(`${handoffRoot}/00_START_HERE/V2_1_PATCH_CHANGELOG.md`);
    const trueUxHandoff = fileText("ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md");

    expect(sourceOrder.indexOf("FINAL_SOURCE_IMPLEMENTATION_HANDOFF.md")).toBeLessThan(
      sourceOrder.indexOf("FINAL_SOURCE_WORK_MASTER.md"),
    );
    expect(sourceOrder).toContain("Safety contracts remain binding below the operative authority.");
    expect(patchChangelog).toContain("v2.1 is not a new product handoff");
    expect(patchChangelog).toContain("No Source product decisions.");
    expect(trueUxHandoff).toContain("ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF");
    expect(trueUxHandoff).toContain("MANDATORY_BEFORE_ANY_CODE_CHANGE");
    expect(trueUxHandoff).toContain("TRUE_UX_SOURCE_WORK_PACK_APPLIED");
  });

  test("preserves no-main, no-generation, no-new-api and no-schema-replacement stop rules", () => {
    const finalHandoff = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/FINAL_SOURCE_IMPLEMENTATION_HANDOFF.md`);
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
      MVP: 34,
      MVP_SUPPORT: 27,
      P1_AFTER_MVP: 2,
      REFERENCE_ONLY: 3,
      HOLD_PENDING_DECISION: 5,
    });
    expect(routeWorksetIntegrity.missingPageIds).toEqual([]);
    expect(routeWorksetIntegrity.unknownPageIds).toEqual([]);
    expect(routeWorksetIntegrity.duplicatePageIds).toEqual([]);

    expect(apiRouteFiles("app/api")).toEqual([...p0ApiRouteUniverse]);
  });

  test("keeps patch-only schema concepts blocked by default", () => {
    const schema = fileText("prisma/schema.prisma");
    const taskMaster = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/FINAL_SOURCE_WORK_MASTER.md`);

    for (const modelName of ["AiDraft", "ClientVisibilityEvaluation", "PolicyException"]) {
      expect(schema).not.toContain(`model ${modelName}`);
    }
    expect(taskMaster).toContain("Block blind creation of patch-only models");
    expect(taskMaster).toContain("Do not create explicit models unless final handoff resolves need");
  });

  test("keeps Process Runtime source lock and held route surfaces machine-readable", () => {
    expect(wave02SourceLock.targetBranch).toBe("full-workflow");
    expect(wave02SourceLock.forbiddenTargetTruth).toContain("main");
    expect(wave02SourceLock.noGenerationRules).toEqual([
      "NO_SCREEN_GENERATION",
      "NO_STATE_SCREEN_GENERATION",
      "NO_IMAGE_GENERATION",
    ]);

    expect(wave02BlockedProcesses.map((process) => process.processId)).toEqual([
      "HOLD-COMMITTEE-DETAIL",
      "HOLD-KYC-SUITABILITY",
    ]);
    expect(() => assertWave02ProcessExecutable("BP-054")).not.toThrow();
    expect(() => assertWave02ProcessExecutable("HOLD-COMMITTEE-DETAIL")).toThrow(/blocked by Wave 0-2 source lock/);
    expect(() => assertWave02ProcessExecutable("BP-001")).not.toThrow();

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
    const finalHandoff = fileText(`${handoffRoot}/01_OPERATIVE_AUTHORITY/FINAL_SOURCE_IMPLEMENTATION_HANDOFF.md`);
    const interactionPatch = fileText(`${handoffRoot}/04_SOURCE_PHASE_PROMPTS/03_04_05_UI_INTERACTION_REALITY_REMEDIATION_PATCH.md`);

    expect(finalHandoff).toContain("Existing tests partial; missing tests specified");
    expect(finalHandoff).toContain("visible drawers/modals prove lifecycle behaviour");
    expect(interactionPatch).toContain("claim existing tests prove full P0 safety");
    expect(interactionPatch).toContain("treat visible UI as lifecycle proof");
  });
});
