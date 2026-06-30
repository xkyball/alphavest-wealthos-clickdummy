import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  buildProcessUniverseCaptureModel,
  processCoverageSummary,
  processUniverseCaptureScenarios,
  processUniverseCaptureForbiddenAuthority,
  processUniverseRowsForScenario,
  validateProcessUniverseCaptureModel,
} from "../lib/process-universe-capture-model";

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

test.describe("Process-Universe stateful capture model", () => {
  test("loads the P0 Process Universe and selected scenario rows without completion overclaim", () => {
    const model = buildProcessUniverseCaptureModel();
    const validation = validateProcessUniverseCaptureModel(model);

    expect(validation.ok, validation.errors.join("\n")).toBe(true);
    expect(model.processUniverseSummary.retainedP0ProcessCount).toBe(84);
    expect(model.processUniverseSummary.retainedP0StepCount).toBe(438);
    expect(model.auditSummary.totalProcesses).toBe(84);
    expect(model.auditSummary.totalSteps).toBe(438);
    expect(model.auditSummary.completionClaimAllowed).toBe(false);
    expect(model.coverageRows).toHaveLength(438);
    expect(model.deepProofScenarios.map((scenario) => scenario.id)).toEqual([
      "PU-CAP-01-auth-negative-positive",
      "PU-CAP-02-process-runtime-cross-screen",
      "PU-CAP-03-compliance-negative-gate",
      "PU-CAP-04-client-visibility-fail-closed",
      "PU-CAP-05-export-negative-authority",
    ]);
    expect(model.scenarios).toBe(model.deepProofScenarios);
    expect(processUniverseCaptureScenarios).toBe(model.processCoverageScenarios);
    expect(model.processCoverageScenarios).toHaveLength(84);

    const matrixProcessIds = Array.from(new Set(model.coverageRows.map((row) => row.process_id))).sort();
    const generatedProcessIds = model.processCoverageScenarios.map((scenario) => scenario.processId).sort();
    const generatedStepIds = model.processCoverageScenarios.flatMap((scenario) => scenario.coveredStepIds);
    const summary = processCoverageSummary(model.processCoverageScenarios);

    expect(generatedProcessIds).toEqual(matrixProcessIds);
    expect(generatedStepIds).toHaveLength(438);
    expect(new Set(generatedStepIds).size).toBe(438);
    expect(summary.processCount).toBe(84);
    expect(summary.stepCount).toBe(438);
    expect(Object.values(summary.coverageStatusCounts).reduce((sum, count) => sum + count, 0)).toBe(84);
    expect(Object.values(summary.stepAcceptanceStateCounts).reduce((sum, count) => sum + count, 0)).toBe(438);
    expect(summary.gapReasonCounts.not_executed_by_current_capture_run).toBeGreaterThan(0);

    for (const scenario of model.deepProofScenarios) {
      expect(scenario.positiveProof.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.negativeProof.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.expectedOutputs.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.processIds.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.routes.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.apiEndpoints.join(" ")).not.toContain(processUniverseCaptureForbiddenAuthority);
      expect(processUniverseRowsForScenario(scenario).length, scenario.id).toBeGreaterThan(0);
    }

    const deepProcessIds = new Set(model.deepProofScenarios.flatMap((scenario) => scenario.processIds));
    for (const scenario of model.processCoverageScenarios) {
      expect(scenario.coverageMode).toBe("generated_process_coverage");
      expect(scenario.coveredStepIds.length, scenario.id).toBe(scenario.totalStepCount);
      if (deepProcessIds.has(scenario.processId)) expect(scenario.coverageStatus).toBe("deep_executable");
      if (scenario.coverageStatus !== "deep_executable") expect(scenario.gapReasons.length, scenario.id).toBeGreaterThan(0);
      if (scenario.coverageStatus === "api_executable") {
        expect(scenario.gapReasons, scenario.id).not.toContain("stale_demo_workflow_touchpoint");
      }
    }
  });

  test("keeps the v1 scenarios tied to positive, negative and API-only projection proof classes", () => {
    const model = buildProcessUniverseCaptureModel();
    const statusById = Object.fromEntries(model.deepProofScenarios.map((scenario) => [scenario.id, scenario.statusExpectation]));

    expect(statusById["PU-CAP-01-auth-negative-positive"]).toBe("visible_proof");
    expect(statusById["PU-CAP-02-process-runtime-cross-screen"]).toBe("api_proven_not_ui_projected");
    expect(statusById["PU-CAP-03-compliance-negative-gate"]).toBe("blocked_proof");
    expect(statusById["PU-CAP-04-client-visibility-fail-closed"]).toBe("visible_proof");
    expect(statusById["PU-CAP-05-export-negative-authority"]).toBe("blocked_proof");

    const allActions = model.deepProofScenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.actions));
    expect(allActions.some((action) => action.action === "goto")).toBe(true);
    expect(allActions.some((action) => action.action === "fill")).toBe(true);
    expect(allActions.some((action) => action.action === "click")).toBe(true);
    expect(allActions.some((action) => action.action === "api")).toBe(true);
    expect(allActions.some((action) => action.action === "assertApiState")).toBe(true);
    expect(allActions.some((action) => action.action === "expectBlocked")).toBe(true);
    expect(allActions.some((action) => action.action === "assertNotText")).toBe(true);
    expect(allActions.some((action) => action.action === "screenshot")).toBe(true);
    expect(allActions.some((action) => action.action === "trace")).toBe(true);
  });

  test("writes the dry-run artifact contract without launching a browser", () => {
    const runId = "contract-test-process-universe-capture";
    const outputDir = path.join(process.cwd(), "artifacts", "process-universe-captures", runId);

    if (existsSync(outputDir)) rmSync(outputDir, { force: true, recursive: true });

    execFileSync("./node_modules/.bin/tsx", ["scripts/capture-process-universe.ts", "--dry-run"], {
      env: {
        ...process.env,
        AVS_PROCESS_UNIVERSE_CAPTURE_OUTPUT: runId,
        BASE_URL: "http://127.0.0.1:3020",
      },
      stdio: "pipe",
    });

    expect(existsSync(path.join(outputDir, "index.md"))).toBe(true);
    expect(existsSync(path.join(outputDir, "index.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "coverage-ledger.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "state-ledger.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "gap-register.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "run-log.json"))).toBe(true);

    const index = readJson<{ dryRun: boolean; ok: boolean; processCoverageCount: number; scenarioCount: number }>(
      path.join(outputDir, "index.json"),
    );
    const coverageLedger = readJson<{
      allProcessCoverage: Array<{ coverageStatus: string; coveredStepIds: string[]; gapReasons: string[]; processId: string }>;
      coverageSummary: ReturnType<typeof processCoverageSummary>;
      dryRun: boolean;
      scenarios: Array<{ id: string; status: string; steps: Array<{ screenshotNames: string[] }> }>;
    }>(path.join(outputDir, "coverage-ledger.json"));
    const gapRegister = readJson<{ gaps: Array<{ coverageStatus?: string; gapReasons?: string[]; processId?: string; severity: string }> }>(
      path.join(outputDir, "gap-register.json"),
    );
    const stateLedger = readJson<{ dryRun: boolean; events: Array<{ status: string }>; tracePath: string }>(
      path.join(outputDir, "state-ledger.json"),
    );

    expect(index).toMatchObject({ dryRun: true, ok: true, processCoverageCount: 84, scenarioCount: 5 });
    expect(coverageLedger.dryRun).toBe(true);
    expect(coverageLedger.scenarios).toHaveLength(5);
    expect(coverageLedger.allProcessCoverage).toHaveLength(84);
    expect(coverageLedger.coverageSummary.processCount).toBe(84);
    expect(coverageLedger.coverageSummary.stepCount).toBe(438);
    expect(new Set(coverageLedger.allProcessCoverage.map((scenario) => scenario.processId)).size).toBe(84);
    expect(new Set(coverageLedger.allProcessCoverage.flatMap((scenario) => scenario.coveredStepIds)).size).toBe(438);
    expect(
      coverageLedger.allProcessCoverage
        .filter((scenario) => scenario.coverageStatus !== "deep_executable")
        .every((scenario) => scenario.gapReasons.length > 0),
    ).toBe(true);
    expect(
      coverageLedger.allProcessCoverage
        .filter((scenario) => scenario.coverageStatus === "api_executable")
        .every((scenario) => !scenario.gapReasons.includes("stale_demo_workflow_touchpoint")),
    ).toBe(true);
    expect(gapRegister.gaps.some((gap) => gap.gapReasons?.includes("stale_demo_workflow_touchpoint"))).toBe(true);
    expect(gapRegister.gaps.some((gap) => gap.gapReasons?.includes("specified_only_status_present"))).toBe(true);
    expect(coverageLedger.scenarios.every((scenario) => scenario.status === "dry_run")).toBe(true);
    expect(coverageLedger.scenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.screenshotNames)).length).toBeGreaterThan(0);
    expect(stateLedger.dryRun).toBe(true);
    expect(stateLedger.tracePath).toContain("trace.zip");
    expect(stateLedger.events.length).toBeGreaterThan(0);
    expect(stateLedger.events.every((event) => event.status === "planned")).toBe(true);
  });
});
