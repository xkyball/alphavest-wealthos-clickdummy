import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { expect, test } from "@playwright/test";

import {
  loadScreencastContract,
  validateScreencastContract,
} from "../scripts/screencast/lib/contract";

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

test.describe("AlphaVest screencast contract", () => {
  test("keeps Process-Universe screencast coverage honest and segmented", () => {
    const contract = loadScreencastContract();
    const validation = validateScreencastContract(contract);

    expect(validation.ok, validation.errors.join("\n")).toBe(true);
    expect(contract.model.processUniverseSummary.retainedP0ProcessCount).toBe(84);
    expect(contract.model.processUniverseSummary.retainedP0StepCount).toBe(438);
    expect(contract.model.auditSummary.completionClaimAllowed).toBe(false);
    expect(contract.manifest.journeys).toHaveLength(8);
    expect(contract.manifest.journeys.filter((journey) => journey.status === "deep_executable")).toHaveLength(4);
    expect(contract.manifest.journeys.some((journey) => journey.status === "api_runtime_backed")).toBe(true);
    expect(contract.manifest.journeys.every((journey) => journey.requiredCases.length > 0)).toBe(true);

    const executableScenarioIds = new Set(contract.model.deepProofScenarios.map((scenario) => scenario.id));
    for (const journey of contract.manifest.journeys.filter((candidate) => candidate.processUniverseScenarioId)) {
      expect(executableScenarioIds.has(journey.processUniverseScenarioId ?? ""), journey.id).toBe(true);
    }
  });

  test("writes dry-run ledger artifacts without launching a browser", () => {
    const runId = "contract-test-screencast-dry-run";
    const outputDir = path.join(process.cwd(), "artifacts", "screencasts", "runs", runId);
    if (existsSync(outputDir)) rmSync(outputDir, { force: true, recursive: true });

    execFileSync("./node_modules/.bin/tsx", ["scripts/screencast/run-all.ts", "--dry-run", `--run-id=${runId}`], {
      env: {
        ...process.env,
        SCREENCAST_BASE_URL: "http://127.0.0.1:3020",
      },
      stdio: "pipe",
    });

    expect(existsSync(path.join(outputDir, "index.md"))).toBe(true);
    expect(existsSync(path.join(outputDir, "coverage-ledger.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "state-ledger.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "gap-register.json"))).toBe(true);
    expect(existsSync(path.join(outputDir, "qa-result.json"))).toBe(true);

    const index = readJson<{ journeyCount: number; processCoverage: { completionClaimAllowed: boolean; processCount: number; stepCount: number } }>(
      path.join(outputDir, "index.json"),
    );
    const coverage = readJson<{ allProcessCoverage: unknown[]; dryRun: boolean; processUniverseSummary: { retainedP0StepCount: number } }>(
      path.join(outputDir, "coverage-ledger.json"),
    );
    const state = readJson<{ dryRun: boolean; eventCount: number }>(path.join(outputDir, "state-ledger.json"));
    const qa = readJson<{ status: string }>(path.join(outputDir, "qa-result.json"));

    expect(index.journeyCount).toBe(8);
    expect(index.processCoverage.processCount).toBe(84);
    expect(index.processCoverage.stepCount).toBe(438);
    expect(index.processCoverage.completionClaimAllowed).toBe(false);
    expect(coverage.dryRun).toBe(true);
    expect(coverage.allProcessCoverage).toHaveLength(84);
    expect(coverage.processUniverseSummary.retainedP0StepCount).toBe(438);
    expect(state.dryRun).toBe(true);
    expect(state.eventCount).toBeGreaterThan(0);
    expect(qa.status).toBe("passed");
  });
});
