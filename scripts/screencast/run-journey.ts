import path from "node:path";

import { validateProcessUniverseCaptureModel } from "@/lib/process-universe-capture-model";

import { writeRunIndex } from "./lib/artifacts";
import {
  journeyOutputDir,
  loadScreencastContract,
  outputRootFor,
  resolveBaseUrl,
  validateScreencastContract,
} from "./lib/contract";
import { timestampRunId, writeJson } from "./lib/io";
import { runExecutableJourney } from "./lib/runner";

async function main() {
  const journeyFlag = process.argv.find((arg) => arg.startsWith("--journey="));
  const runIdArg = process.argv.find((arg) => arg.startsWith("--run-id="));
  const journeyId = journeyFlag?.slice("--journey=".length);
  const runId = runIdArg?.slice("--run-id=".length) || timestampRunId(journeyId ?? "journey");

  if (!journeyId) {
    console.error("Missing --journey=<id>.");
    process.exit(1);
  }

  const contract = loadScreencastContract();
  const validation = validateScreencastContract(contract);
  const modelValidation = validateProcessUniverseCaptureModel(contract.model);
  const runRoot = outputRootFor(contract.config, runId);
  const journey = contract.manifest.journeys.find((candidate) => candidate.id === journeyId);

  if (!validation.ok || !modelValidation.ok || !journey) {
    console.error(JSON.stringify({ journeyFound: Boolean(journey), modelValidation, validation }, null, 2));
    process.exit(1);
  }

  if (!journey.processUniverseScenarioId) {
    writeJson(path.join(runRoot, "qa-result.json"), {
      journeyId,
      reason: "Journey is not deep executable; use screencast:dry-run for ledger/report proof.",
      status: "skipped",
    });
    console.log(JSON.stringify({ outputDir: runRoot, status: "skipped" }, null, 2));
    process.exit(0);
  }

  const scenario = contract.scenarioById.get(journey.processUniverseScenarioId);
  if (!scenario) {
    console.error(`Unknown Process-Universe scenario: ${journey.processUniverseScenarioId}`);
    process.exit(1);
  }

  const outputDir = journeyOutputDir(runRoot, journey.id);
  const result = await runExecutableJourney({
    baseUrl: resolveBaseUrl(contract.config),
    journey,
    outputDir,
    scenario,
    viewport: contract.manifest.defaultViewport,
  });

  writeRunIndex({
    events: result.events,
    journeys: [{ artifactDir: path.relative(runRoot, outputDir), id: journey.id, status: result.status }],
    manifest: contract.manifest,
    model: contract.model,
    runId,
    runRoot,
  });

  console.log(JSON.stringify({ outputDir, runId, status: result.status }, null, 2));

  if (result.status === "failed") process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
