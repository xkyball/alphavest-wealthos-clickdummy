import path from "node:path";

import { processCoverageSummary, validateProcessUniverseCaptureModel } from "@/lib/process-universe-capture-model";

import { storyboardForJourney, type ScreencastEvent, writeRunIndex } from "./lib/artifacts";
import {
  journeyOutputDir,
  loadScreencastContract,
  outputRootFor,
  resolveBaseUrl,
  validateScreencastContract,
} from "./lib/contract";
import { ensureDir, timestampRunId, writeJson, writeText } from "./lib/io";
import { runExecutableJourney } from "./lib/runner";

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run");
  const live = args.has("--live");
  const qaFast = args.has("--qa-fast");
  const runIdArg = process.argv.find((arg) => arg.startsWith("--run-id="));
  const runId = runIdArg?.slice("--run-id=".length) || timestampRunId(dryRun ? "dry-run" : live ? "live" : "plan");

  const contract = loadScreencastContract();
  const validation = validateScreencastContract(contract);
  const modelValidation = validateProcessUniverseCaptureModel(contract.model);
  const runRoot = outputRootFor(contract.config, runId);
  const baseUrl = resolveBaseUrl(contract.config);
  const events: ScreencastEvent[] = [];

  ensureDir(runRoot);

  if (!validation.ok || !modelValidation.ok) {
    writeJson(path.join(runRoot, "qa-result.json"), {
      contractValidation: validation,
      modelValidation,
      status: "failed",
    });
    console.error(JSON.stringify({ contractValidation: validation, modelValidation }, null, 2));
    process.exit(1);
  }

  const liveCandidates = contract.manifest.journeys.filter((journey) => journey.processUniverseScenarioId);
  const journeysToRun = live && qaFast ? liveCandidates.slice(0, 2) : live ? liveCandidates : [];
  const journeyResults: Array<{ artifactDir?: string; id: string; status: string }> = [];

  if (dryRun || !live) {
    for (const journey of contract.manifest.journeys) {
      const outputDir = journeyOutputDir(runRoot, journey.id);
      ensureDir(outputDir);
      const scenario = journey.processUniverseScenarioId ? contract.scenarioById.get(journey.processUniverseScenarioId) : undefined;
      const plannedEvents = scenario
        ? scenario.steps.flatMap((step) =>
            step.actions.map((action) => ({
              action: action.action,
              detail: "Dry-run planned action; browser was not mutated.",
              journeyId: journey.id,
              status: "planned" as const,
              stepId: step.id,
            })),
          )
        : [
            {
              action: "gap",
              detail: journey.proofClass,
              journeyId: journey.id,
              status: "planned" as const,
              stepId: journey.id,
            },
          ];
      events.push(...plannedEvents);
      writeText(path.join(outputDir, "storyboard.md"), storyboardForJourney({ events: plannedEvents, journey, screenshotFiles: [] }));
      writeJson(path.join(outputDir, "manifest.resolved.json"), { journey, processUniverseScenario: scenario ?? null });
      writeJson(path.join(outputDir, "qa-result.json"), {
        businessStepCount: journey.businessSteps.length,
        dryRun: true,
        scenarioStepCount: scenario?.steps.length ?? 0,
        speedProfile: journey.speedProfile,
        status: journey.status === "deep_executable" ? "planned_executable" : journey.status,
      });
      journeyResults.push({ artifactDir: path.relative(runRoot, outputDir), id: journey.id, status: "dry_run" });
    }
  } else {
    for (const journey of journeysToRun) {
      const scenario = journey.processUniverseScenarioId ? contract.scenarioById.get(journey.processUniverseScenarioId) : undefined;
      const outputDir = journeyOutputDir(runRoot, journey.id);
      if (!scenario) {
        journeyResults.push({ artifactDir: path.relative(runRoot, outputDir), id: journey.id, status: "skipped_no_scenario" });
        continue;
      }
      const result = await runExecutableJourney({
        baseUrl,
        journey,
        outputDir,
        scenario,
        viewport: contract.manifest.defaultViewport,
      });
      events.push(...result.events);
      journeyResults.push({ artifactDir: path.relative(runRoot, outputDir), id: journey.id, status: result.status });
    }
  }

  const coverageSummary = processCoverageSummary(contract.model.processCoverageScenarios);
  writeJson(path.join(runRoot, "coverage-ledger.json"), {
    allProcessCoverage: contract.model.processCoverageScenarios,
    coverageSummary,
    dryRun: dryRun || !live,
    journeyManifest: contract.manifest.journeys.map((journey) => ({
      actorCount: journey.actors.length,
      businessStepCount: journey.businessSteps.length,
      id: journey.id,
      processUniverseScenarioId: journey.processUniverseScenarioId,
      proofClass: journey.proofClass,
      requiredCases: journey.requiredCases,
      speedProfile: journey.speedProfile,
      status: journey.status,
    })),
    processUniverseSummary: contract.model.processUniverseSummary,
  });
  writeJson(path.join(runRoot, "state-ledger.json"), {
    dryRun: dryRun || !live,
    eventCount: events.length,
    events,
    finalVideoPolicy: "Final videos must be captured with human-demo speed; qa-fast is limited to dry-run/stability probes.",
    tracePolicy: "trace.zip is written per live executable journey.",
  });
  writeJson(path.join(runRoot, "gap-register.json"), {
    gaps: [
      ...validation.warnings.map((message) => ({ message, severity: "warning" })),
      ...contract.model.processCoverageScenarios
        .filter((scenario) => scenario.coverageStatus !== "deep_executable" || scenario.gapReasons.length > 0)
        .map((scenario) => ({
          coverageStatus: scenario.coverageStatus,
          gapReasons: scenario.gapReasons,
          processId: scenario.processId,
          processName: scenario.processName,
          severity: scenario.coverageStatus === "gap_only" ? "gap" : "warning",
        })),
    ],
  });
  writeJson(path.join(runRoot, "qa-result.json"), {
    contractValidation: validation,
    journeyResults,
    liveMode: live ? (qaFast ? "qa-fast-stability" : "human-demo-final") : "dry-run",
    modelValidation,
    status: journeyResults.every((journey) => journey.status !== "failed") ? "passed" : "failed",
  });
  writeJson(path.join(runRoot, "manifest.resolved.json"), contract.manifest);
  writeRunIndex({
    events,
    journeys: journeyResults,
    manifest: contract.manifest,
    model: contract.model,
    runId,
    runRoot,
  });

  console.log(JSON.stringify({ outputDir: runRoot, runId, status: "completed" }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
