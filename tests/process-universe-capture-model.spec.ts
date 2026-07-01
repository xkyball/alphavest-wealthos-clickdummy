import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  projectionWave1ProcessIds,
  projectionWave2ProcessIds,
  projectionWave3ProcessIds,
  projectionWave4ProcessIds,
  projectionWave5ProcessIds,
  projectionWave6ProcessIds,
  projectionWave7ProcessIds,
} from "../lib/process-universe-proof-plans";
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

    const proofPlanScenarios = model.processCoverageScenarios.filter((scenario) => scenario.proofPlan);
    const visibleProjectionScenarios = proofPlanScenarios.filter((scenario) => scenario.uiProjection === "visible");
    const projectionWave1Scenarios = proofPlanScenarios.filter((scenario) => scenario.projectionWave === "wave_1");
    const projectionWave2Scenarios = proofPlanScenarios.filter((scenario) => scenario.projectionWave === "wave_2");
    const projectionWave3Scenarios = proofPlanScenarios.filter((scenario) => scenario.projectionWave === "wave_3");
    const projectionWave4Scenarios = proofPlanScenarios.filter((scenario) => scenario.projectionWave === "wave_4");
    const projectionWave5Scenarios = proofPlanScenarios.filter((scenario) => scenario.projectionWave === "wave_5");
    const projectionWave6Scenarios = proofPlanScenarios.filter((scenario) => scenario.projectionWave === "wave_6");
    const projectionWave7Scenarios = proofPlanScenarios.filter((scenario) => scenario.projectionWave === "wave_7");
    const allScreenshotActions = [
      ...model.deepProofScenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.actions)),
      ...model.processCoverageScenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.actions)),
    ].filter((action) => action.action === "screenshot");
    const visualProofIds = allScreenshotActions.map((action) => action.visualProofId).filter((id): id is string => Boolean(id));
    expect(proofPlanScenarios).toHaveLength(75);
    expect(visibleProjectionScenarios).toHaveLength(75);
    expect(projectionWave1ProcessIds).toHaveLength(12);
    expect(projectionWave2ProcessIds).toHaveLength(12);
    expect(projectionWave3ProcessIds).toHaveLength(12);
    expect(projectionWave4ProcessIds).toHaveLength(12);
    expect(projectionWave5ProcessIds).toHaveLength(10);
    expect(projectionWave6ProcessIds).toHaveLength(6);
    expect(projectionWave7ProcessIds).toHaveLength(11);
    expect(new Set(projectionWave1ProcessIds).size).toBe(12);
    expect(new Set(projectionWave2ProcessIds).size).toBe(12);
    expect(new Set(projectionWave3ProcessIds).size).toBe(12);
    expect(new Set(projectionWave4ProcessIds).size).toBe(12);
    expect(new Set(projectionWave5ProcessIds).size).toBe(10);
    expect(new Set(projectionWave6ProcessIds).size).toBe(6);
    expect(new Set(projectionWave7ProcessIds).size).toBe(11);
    expect(projectionWave1Scenarios.map((scenario) => scenario.processId).sort()).toEqual([...projectionWave1ProcessIds].sort());
    expect(projectionWave2Scenarios.map((scenario) => scenario.processId).sort()).toEqual([...projectionWave2ProcessIds].sort());
    expect(projectionWave3Scenarios.map((scenario) => scenario.processId).sort()).toEqual([...projectionWave3ProcessIds].sort());
    expect(projectionWave4Scenarios.map((scenario) => scenario.processId).sort()).toEqual([...projectionWave4ProcessIds].sort());
    expect(projectionWave5Scenarios.map((scenario) => scenario.processId).sort()).toEqual([...projectionWave5ProcessIds].sort());
    expect(projectionWave6Scenarios.map((scenario) => scenario.processId).sort()).toEqual([...projectionWave6ProcessIds].sort());
    expect(projectionWave7Scenarios.map((scenario) => scenario.processId).sort()).toEqual([...projectionWave7ProcessIds].sort());
    expect(new Set([...projectionWave1ProcessIds, ...projectionWave2ProcessIds, ...projectionWave3ProcessIds, ...projectionWave4ProcessIds, ...projectionWave5ProcessIds, ...projectionWave6ProcessIds, ...projectionWave7ProcessIds]).size).toBe(75);
    expect(new Set(allScreenshotActions.map((action) => action.name)).size).toBe(allScreenshotActions.length);
    expect(new Set(visualProofIds).size).toBe(visualProofIds.length);
    expect(visualProofIds).toHaveLength(150);

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
      expect(scenario.apiEndpoints.join(" "), scenario.id).not.toContain(processUniverseCaptureForbiddenAuthority);
      expect(scenario.steps.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.steps.flatMap((step) => step.actions).some((action) => action.action === "api"), scenario.id).toBe(true);
      if (scenario.proofPlan) {
        expect(scenario.proofPlanId, scenario.id).toBe(`PU-PROOF-${scenario.processId}`);
        expect(scenario.classificationBefore, scenario.id).toBe(
          scenario.projectionWave === "wave_6"
            ? "gap_only"
            : scenario.projectionWave
              ? "api_executable"
              : "visual_reference_only",
        );
        expect(["api_executable", "blocked_negative_only"], scenario.id).toContain(scenario.classificationAfter);
        expect(scenario.proofPlan.primaryEndpoint, scenario.id).not.toContain(processUniverseCaptureForbiddenAuthority);
        expect(JSON.stringify(scenario.proofPlan.positiveActions), scenario.id).not.toContain(processUniverseCaptureForbiddenAuthority);
        expect(JSON.stringify(scenario.proofPlan.visibleProjectionActions), scenario.id).not.toContain(processUniverseCaptureForbiddenAuthority);
        expect(scenario.proofPlan.positiveActions.length, scenario.id).toBeGreaterThan(0);
        expect(scenario.proofPlan.expectedAssertions.length, scenario.id).toBeGreaterThan(0);
        if (scenario.projectionWave) {
          const actions = scenario.steps.flatMap((step) => step.actions);
          const serializedActions = JSON.stringify(actions);
          const screenshots = actions.filter((action) => action.action === "screenshot");
          const beforeScreenshots = screenshots.filter((action) => action.phase === "before");
          const afterScreenshots = screenshots.filter((action) => action.phase === "after");
          expect(scenario.proofPlan.projectionTargetClassificationAfter, scenario.id).toBe("deep_executable");
          expect(scenario.proofPlan.visibleProjectionActions.length, scenario.id).toBeGreaterThan(0);
          expect(scenario.proofPlan.negativeAction, scenario.id).toBeTruthy();
          expect(scenario.remainingProjectionGap, scenario.id).toBeNull();
          expect(beforeScreenshots, scenario.id).toHaveLength(1);
          expect(afterScreenshots, scenario.id).toHaveLength(1);
          expect(beforeScreenshots[0].processId, scenario.id).toBe(scenario.processId);
          expect(afterScreenshots[0].processId, scenario.id).toBe(scenario.processId);
          expect(afterScreenshots[0].compareWith, scenario.id).toBe(beforeScreenshots[0].visualProofId);
          expect(afterScreenshots[0].ocrRequired, scenario.id).toBe(true);
          expect(afterScreenshots[0].expectedOcrText?.length, scenario.id).toBeGreaterThan(0);
          expect(afterScreenshots[0].minChangedPixels, scenario.id).toBeGreaterThan(0);
          expect(actions.some((action) => action.action === "api"), scenario.id).toBe(true);
          expect(actions.some((action) => action.action === "expectBlocked"), scenario.id).toBe(true);
          expect(actions.some((action) => action.action === "assertApiState"), scenario.id).toBe(true);
          expect(actions.some((action) => action.action === "assertText"), scenario.id).toBe(true);
          expect(actions.some((action) => action.action === "screenshot" && action.visibleProof), scenario.id).toBe(true);
          if (scenario.processId === "BP-030") {
            expect(scenario.proofPlan.actor, scenario.id).toMatchObject({ roleKey: "compliance_officer", tenantSlug: "morgan" });
            expect(serializedActions, scenario.id).toContain("j04-upload-document");
            expect(serializedActions, scenario.id).toContain("morgan-tax-residency-2026.pdf");
            expect(serializedActions, scenario.id).toContain("stage3-accept-sufficiency");
            expect(serializedActions, scenario.id).toContain("Run sufficiency check");
          }
          if (scenario.processId === "BP-053") {
            expect(serializedActions, scenario.id).toContain("advisor-rationale-input");
            expect(serializedActions, scenario.id).toContain("j01-request-evidence");
            expect(serializedActions, scenario.id).toContain("Evidence request saved. The package remains internal.");
          }
          if (scenario.processId === "BP-054") {
            expect(serializedActions, scenario.id).toContain("advisor-rationale-input");
            expect(serializedActions, scenario.id).toContain("j01-approve-advisor");
            expect(serializedActions, scenario.id).toContain("Package submitted for compliance review.");
          }
          if (scenario.processId === "BP-061") {
            expect(serializedActions, scenario.id).toContain("Confirm Evidence Request - No Client Release");
            expect(serializedActions, scenario.id).toContain("j02-confirm-request-evidence");
          }
          if (scenario.processId === "BP-062") {
            expect(serializedActions, scenario.id).toContain("Confirm Compliance Block - No Client Release");
            expect(serializedActions, scenario.id).toContain("typed-compliance_block-submit");
          }
          if (scenario.processId === "BP-015") {
            expect(serializedActions, scenario.id).toContain("j07-open-role-drawer");
            expect(serializedActions, scenario.id).toContain("j07-review-role-changes");
            expect(serializedActions, scenario.id).toContain("CONFIRM ROLE CHANGE");
            expect(serializedActions, scenario.id).toContain("Confirm Sensitive Permission Changes");
          }
          if (scenario.processId === "BP-018") {
            expect(serializedActions, scenario.id).toContain("domain-06-governance-primary-next-action");
            expect(serializedActions, scenario.id).toContain("j07-open-access-request-drawer");
            expect(serializedActions, scenario.id).toContain("Access request blocked");
          }
          if (scenario.processId === "BP-019") {
            expect(serializedActions, scenario.id).toContain("j07-role-confirmation-phrase");
            expect(serializedActions, scenario.id).toContain("WRONG PHRASE");
            expect(serializedActions, scenario.id).toContain("Role confirmation blocked");
          }
          if (scenario.processId === "BP-104") {
            expect(serializedActions, scenario.id).toContain("j10-save-security");
            expect(serializedActions, scenario.id).toContain("Change recorded");
          }
          if (scenario.processId === "BP-016") {
            expect(serializedActions, scenario.id).toContain("j10-review-permission");
            expect(serializedActions, scenario.id).toContain("Security controls guarded");
          }
          if (scenario.processId === "BP-020") {
            expect(serializedActions, scenario.id).toContain("j10-review-permission");
            expect(serializedActions, scenario.id).toContain("Security controls guarded");
          }
          if (scenario.processId === "BP-022") {
            expect(serializedActions, scenario.id).toContain("j07-approve-access");
            expect(serializedActions, scenario.id).toContain("Access request routed");
          }
          if (scenario.processId === "BP-103") {
            expect(serializedActions, scenario.id).toContain("j10-save-platform");
            expect(serializedActions, scenario.id).toContain("Change recorded");
          }
          if (scenario.processId === "BP-105") {
            expect(serializedActions, scenario.id).toContain("/tenants/morgan/policies");
            expect(serializedActions, scenario.id).toContain("Policy creation held");
          }
          if (scenario.processId === "BP-106") {
            expect(serializedActions, scenario.id).toContain("/admin/evidence-templates");
            expect(serializedActions, scenario.id).toContain("Template held");
          }
          if (scenario.processId === "BP-107") {
            expect(serializedActions, scenario.id).toContain("/admin/export-templates");
            expect(serializedActions, scenario.id).toContain("Template held");
          }
          if (scenario.processId === "BP-109") {
            expect(serializedActions, scenario.id).toContain("j06-assign-team");
            expect(serializedActions, scenario.id).toContain("Policy creation held");
          }
          if (scenario.processId === "BP-050") {
            expect(serializedActions, scenario.id).toContain("domain10-s036-primary-next-action");
            expect(serializedActions, scenario.id).toContain("Next action");
          }
          if (scenario.processId === "BP-051") {
            expect(serializedActions, scenario.id).toContain("s036-open-selected-review");
            expect(serializedActions, scenario.id).toContain("Recommendation file");
          }
          if (scenario.processId === "BP-052") {
            expect(serializedActions, scenario.id).toContain("Recommendation file");
            expect(serializedActions, scenario.id).toContain("scenario fit");
          }
          if (scenario.processId === "BP-055") {
            expect(serializedActions, scenario.id).toContain("j01-return-to-analyst");
            expect(serializedActions, scenario.id).toContain("Package returned to analyst review.");
          }
          if (scenario.processId === "BP-058") {
            expect(serializedActions, scenario.id).toContain("s038-open-selected-review");
            expect(serializedActions, scenario.id).toContain("Release readiness");
          }
          if (scenario.processId === "BP-059") {
            expect(serializedActions, scenario.id).toContain("j02-block-release");
            expect(serializedActions, scenario.id).toContain("Compliance action is blocked");
          }
          if (scenario.processId === "BP-060") {
            expect(serializedActions, scenario.id).toContain("j02-request-evidence");
            expect(serializedActions, scenario.id).toContain("Action recorded");
          }
          if (scenario.processId === "BP-064") {
            expect(serializedActions, scenario.id).toContain("/compliance/reviews/current/audit");
            expect(serializedActions, scenario.id).toContain("Export controlled");
          }
          if (scenario.processId === "BP-089") {
            expect(serializedActions, scenario.id).toContain("/export/client-package/download");
            expect(serializedActions, scenario.id).toContain("Generate package");
          }
          if (scenario.processId === "BP-090") {
            expect(serializedActions, scenario.id).toContain("No Share Link");
            expect(serializedActions, scenario.id).toContain("No external link yet");
          }
          if (scenario.processId === "BP-091") {
            expect(serializedActions, scenario.id).toContain("/governance/audit");
            expect(serializedActions, scenario.id).toContain("Export audit events");
          }
          if (scenario.processId === "BP-100") {
            expect(serializedActions, scenario.id).toContain("/ops");
            expect(serializedActions, scenario.id).toContain("Review monitoring");
          }
          if (scenario.processId === "BP-034") {
            expect(serializedActions, scenario.id).toContain("ux-hub-primary-next-work");
            expect(serializedActions, scenario.id).toContain("Compliance review");
          }
          if (scenario.processId === "BP-038") {
            expect(serializedActions, scenario.id).toContain("/advisory/review-queue");
            expect(serializedActions, scenario.id).toContain("Client view");
          }
          if (scenario.processId === "BP-039") {
            expect(serializedActions, scenario.id).toContain("/advisory/triggers/liquidity-drift/review");
            expect(serializedActions, scenario.id).toContain("Request missing evidence");
          }
          if (scenario.processId === "BP-040") {
            expect(serializedActions, scenario.id).toContain("Request missing evidence");
            expect(serializedActions, scenario.id).toContain("Missing evidence");
          }
          if (scenario.processId === "BP-041") {
            expect(serializedActions, scenario.id).toContain("/ops");
            expect(serializedActions, scenario.id).toContain("High-severity blockers");
          }
          if (scenario.processId === "BP-042") {
            expect(serializedActions, scenario.id).toContain("Draft");
            expect(serializedActions, scenario.id).toContain("Compliance review");
          }
          if (scenario.processId === "BP-043") {
            expect(serializedActions, scenario.id).toContain("Draft");
            expect(serializedActions, scenario.id).toContain("Open review work");
          }
          if (scenario.processId === "BP-044") {
            expect(serializedActions, scenario.id).toContain("Missing evidence");
            expect(serializedActions, scenario.id).toContain("Request missing evidence");
          }
          if (scenario.processId === "BP-045") {
            expect(serializedActions, scenario.id).toContain("Route to advisor review");
            expect(serializedActions, scenario.id).toContain("Status");
          }
          if (scenario.processId === "BP-046") {
            expect(serializedActions, scenario.id).toContain("Request missing evidence");
            expect(serializedActions, scenario.id).toContain("Next action");
          }
          if (scenario.processId === "BP-047") {
            expect(serializedActions, scenario.id).toContain("Client view");
            expect(serializedActions, scenario.id).toContain("Held");
          }
          if (scenario.processId === "BP-048") {
            expect(serializedActions, scenario.id).toContain("Request missing evidence");
            expect(serializedActions, scenario.id).toContain("Trigger detail");
          }
          if (scenario.processId === "BP-004") {
            expect(serializedActions, scenario.id).toContain("/client/family-members");
            expect(serializedActions, scenario.id).toContain("Family edit state");
          }
          if (scenario.processId === "BP-005") {
            expect(serializedActions, scenario.id).toContain("/relationships");
            expect(serializedActions, scenario.id).toContain("Relationship edges");
          }
          if (scenario.processId === "BP-006") {
            expect(serializedActions, scenario.id).toContain("/entities");
            expect(serializedActions, scenario.id).toContain("View and manage entities");
          }
          if (scenario.processId === "BP-010") {
            expect(serializedActions, scenario.id).toContain("/entities/philanthropy-trust");
            expect(serializedActions, scenario.id).toContain("Data Sensitivity");
          }
          if (scenario.processId === "BP-023") {
            expect(serializedActions, scenario.id).toContain("/documents/upload");
            expect(serializedActions, scenario.id).toContain("Upload remains blocked");
          }
          if (scenario.processId === "BP-026") {
            expect(serializedActions, scenario.id).toContain("Version");
            expect(serializedActions, scenario.id).toContain("checksum evidence stored internally");
          }
          if (scenario.processId === "BP-027") {
            expect(serializedActions, scenario.id).toContain("/documents/review-queue");
            expect(serializedActions, scenario.id).toContain("Review & Sufficiency");
          }
          if (scenario.processId === "BP-028") {
            expect(serializedActions, scenario.id).toContain("Request clarification");
          }
          if (scenario.processId === "BP-029") {
            expect(serializedActions, scenario.id).toContain("/documents/morgan-tax-residency/review");
            expect(serializedActions, scenario.id).toContain("Verification step");
          }
          if (scenario.processId === "BP-033") {
            expect(serializedActions, scenario.id).toContain("Lifecycle: Insufficient");
          }
        }
        if (scenario.gapReasons.includes("missing_negative_proof")) {
          expect(scenario.proofPlan.negativeAction, scenario.id).toBeTruthy();
          expect(scenario.classificationAfter, scenario.id).toBe("blocked_negative_only");
        }
      }
      if (scenario.coverageStatus === "api_executable") {
        expect(scenario.proofPlan, scenario.id).toBeTruthy();
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
    expect(existsSync(path.join(outputDir, "authority-ledger.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "gap-register.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "screenshot-index.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "screenshot-index.md"))).toBe(true);
    expect(existsSync(path.join(outputDir, "run-log.json"))).toBe(true);

    const index = readJson<{ authorityLedgerCount: number; dryRun: boolean; ok: boolean; processCoverageCount: number; scenarioCount: number }>(
      path.join(outputDir, "index.json"),
    );
    const coverageLedger = readJson<{
      allProcessCoverage: Array<{
        classificationAfter: string;
        classificationBefore: string;
        coverageStatus: string;
        coveredStepIds: string[];
        gapReasons: string[];
        processId: string;
        projectionWave: string | null;
        proofPlanId: string | null;
        uiProjection: string | null;
      }>;
      authorityLedger: Array<{ processId: string; proofPlanId: string | null }>;
      coverageSummary: ReturnType<typeof processCoverageSummary>;
      dryRun: boolean;
      projectionWave1Delta: { failed: number; passed: number; selected: number; stillApiOnly: number };
      projectionWave2Delta: { failed: number; passed: number; selected: number; stillApiOnly: number };
      projectionWave3Delta: { failed: number; passed: number; selected: number; stillApiOnly: number };
      projectionWave4Delta: { failed: number; passed: number; selected: number; stillApiOnly: number };
      projectionWave5Delta: { failed: number; passed: number; selected: number; stillApiOnly: number };
      projectionWave6Delta: { failed: number; passed: number; selected: number; stillApiOnly: number };
      projectionWave7Delta: { failed: number; passed: number; selected: number; stillApiOnly: number };
      scenarios: Array<{ id: string; status: string; steps: Array<{ screenshotNames: string[] }> }>;
    }>(path.join(outputDir, "coverage-ledger.json"));
    const gapRegister = readJson<{ gaps: Array<{ coverageStatus?: string; gapReasons?: string[]; processId?: string; severity: string }> }>(
      path.join(outputDir, "gap-register.json"),
    );
    const stateLedger = readJson<{
      dryRun: boolean;
      events: Array<{ status: string }>;
      executedProofActions: Array<{ classificationAfter: string | null; classificationBefore: string | null; proofPlanId: string | null }>;
      tracePath: string;
      screenshotIndexPath: string;
    }>(
      path.join(outputDir, "state-ledger.json"),
    );
    const authorityLedger = readJson<{ authorityLedger: Array<{ processId: string; proofPlanId: string | null }> }>(
      path.join(outputDir, "authority-ledger.json"),
    );
    const screenshotIndex = readJson<{
      entries: Array<{
        compareWith: string | null;
        expectedOcrText: string[];
        phase: string | null;
        processId: string | null;
        relativePath: string;
        scenarioId: string;
        status: string;
        visualProofId: string | null;
        diff: { threshold: number | null };
        ocr: { required: boolean };
      }>;
      screenshotCount: number;
      visualEvidenceCount: number;
    }>(path.join(outputDir, "screenshot-index.json"));

    expect(index).toMatchObject({ authorityLedgerCount: 84, dryRun: true, ok: true, processCoverageCount: 84, scenarioCount: 5 });
    expect(coverageLedger.dryRun).toBe(true);
    expect(coverageLedger.scenarios).toHaveLength(5);
    expect(coverageLedger.allProcessCoverage).toHaveLength(84);
    expect(coverageLedger.authorityLedger).toHaveLength(84);
    expect(authorityLedger.authorityLedger).toHaveLength(84);
    expect(coverageLedger.coverageSummary.processCount).toBe(84);
    expect(coverageLedger.coverageSummary.stepCount).toBe(438);
    expect(new Set(coverageLedger.allProcessCoverage.map((scenario) => scenario.processId)).size).toBe(84);
    expect(new Set(coverageLedger.allProcessCoverage.flatMap((scenario) => scenario.coveredStepIds)).size).toBe(438);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.proofPlanId).length).toBe(75);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.uiProjection === "visible").length).toBe(75);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_1").length).toBe(12);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_1").map((scenario) => scenario.processId).sort()).toEqual([...projectionWave1ProcessIds].sort());
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_2").length).toBe(12);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_2").map((scenario) => scenario.processId).sort()).toEqual([...projectionWave2ProcessIds].sort());
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_3").length).toBe(12);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_3").map((scenario) => scenario.processId).sort()).toEqual([...projectionWave3ProcessIds].sort());
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_4").length).toBe(12);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_4").map((scenario) => scenario.processId).sort()).toEqual([...projectionWave4ProcessIds].sort());
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_5").length).toBe(10);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_5").map((scenario) => scenario.processId).sort()).toEqual([...projectionWave5ProcessIds].sort());
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_6").length).toBe(6);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_6").map((scenario) => scenario.processId).sort()).toEqual([...projectionWave6ProcessIds].sort());
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_7").length).toBe(11);
    expect(coverageLedger.allProcessCoverage.filter((scenario) => scenario.projectionWave === "wave_7").map((scenario) => scenario.processId).sort()).toEqual([...projectionWave7ProcessIds].sort());
    expect(coverageLedger.projectionWave1Delta).toEqual({ failed: 0, passed: 0, selected: 12, stillApiOnly: 12 });
    expect(coverageLedger.projectionWave2Delta).toEqual({ failed: 0, passed: 0, selected: 12, stillApiOnly: 12 });
    expect(coverageLedger.projectionWave3Delta).toEqual({ failed: 0, passed: 0, selected: 12, stillApiOnly: 12 });
    expect(coverageLedger.projectionWave4Delta).toEqual({ failed: 0, passed: 0, selected: 12, stillApiOnly: 12 });
    expect(coverageLedger.projectionWave5Delta).toEqual({ failed: 0, passed: 0, selected: 10, stillApiOnly: 10 });
    expect(coverageLedger.projectionWave6Delta).toEqual({ failed: 0, passed: 0, selected: 6, stillApiOnly: 6 });
    expect(coverageLedger.projectionWave7Delta).toEqual({ failed: 0, passed: 0, selected: 11, stillApiOnly: 11 });
    expect(
      coverageLedger.allProcessCoverage
        .filter((scenario) => scenario.projectionWave)
        .every((scenario) => ["api_executable", "gap_only"].includes(scenario.classificationBefore) && ["api_executable", "blocked_negative_only"].includes(scenario.classificationAfter)),
    ).toBe(true);
    expect(
      coverageLedger.allProcessCoverage
        .filter((scenario) => scenario.coverageStatus !== "deep_executable")
        .every((scenario) => scenario.gapReasons.length > 0),
    ).toBe(true);
    expect(
      coverageLedger.allProcessCoverage
        .filter((scenario) => scenario.coverageStatus === "api_executable")
        .every((scenario) => Boolean(scenario.proofPlanId)),
    ).toBe(true);
    expect(gapRegister.gaps.some((gap) => gap.gapReasons?.includes("stale_demo_workflow_touchpoint"))).toBe(true);
    expect(gapRegister.gaps.some((gap) => gap.gapReasons?.includes("specified_only_status_present"))).toBe(true);
    expect(coverageLedger.scenarios.every((scenario) => scenario.status === "dry_run")).toBe(true);
    expect(coverageLedger.scenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.screenshotNames)).length).toBeGreaterThan(0);
    expect(stateLedger.dryRun).toBe(true);
    expect(stateLedger.tracePath).toContain("trace.zip");
    expect(stateLedger.screenshotIndexPath).toBe("screenshot-index.json");
    expect(stateLedger.events.length).toBeGreaterThan(0);
    expect(stateLedger.events.every((event) => event.status === "planned")).toBe(true);
    expect(stateLedger.executedProofActions.length).toBe(stateLedger.events.length);
    expect(stateLedger.executedProofActions.some((event) => event.proofPlanId?.startsWith("PU-PROOF-"))).toBe(true);
    expect(screenshotIndex.screenshotCount).toBe(screenshotIndex.entries.length);
    expect(screenshotIndex.visualEvidenceCount).toBe(150);
    expect(new Set(screenshotIndex.entries.map((entry) => entry.relativePath)).size).toBe(screenshotIndex.entries.length);
    expect(new Set(screenshotIndex.entries.map((entry) => entry.visualProofId).filter(Boolean)).size).toBe(150);
    for (const processId of [...projectionWave1ProcessIds, ...projectionWave2ProcessIds, ...projectionWave3ProcessIds, ...projectionWave4ProcessIds, ...projectionWave5ProcessIds, ...projectionWave6ProcessIds, ...projectionWave7ProcessIds]) {
      const entries = screenshotIndex.entries.filter((entry) => entry.processId === processId);
      const before = entries.find((entry) => entry.phase === "before");
      const after = entries.find((entry) => entry.phase === "after");
      expect(before, processId).toBeTruthy();
      expect(after, processId).toBeTruthy();
      expect(after?.compareWith, processId).toBe(before?.visualProofId);
      expect(after?.ocr.required, processId).toBe(true);
      expect(after?.expectedOcrText.length, processId).toBeGreaterThan(0);
      expect(after?.diff.threshold, processId).toBeGreaterThan(0);
    }
  });
});
