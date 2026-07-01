import { existsSync } from "node:fs";
import path from "node:path";

import {
  buildProcessUniverseCaptureModel,
  humanDemoProcessUniverseScenarios,
  processCoverageSummary,
  type ProcessUniverseCaptureModel,
  type ProcessUniverseCaptureScenario,
} from "@/lib/process-universe-capture-model";

import { readJson, repoPath } from "./io";

export type ScreencastConfig = {
  adapter: {
    module: string;
  };
  artifactPolicy: Record<string, boolean>;
  baseUrlEnv: string[];
  defaultBaseUrl: string;
  manifestPath: string;
  outputRoot: string;
  packageScripts: Record<string, string>;
  schemaVersion: number;
  sourceArtifacts: string[];
};

export type ScreencastJourneyStatus =
  | "api_runtime_backed"
  | "deep_executable"
  | "gap_only"
  | "visible_ui_proof";

export type ScreencastJourney = {
  actors: string[];
  businessSteps: string[];
  captions?: {
    intro?: string;
  };
  cluster: string;
  runtimeContext: {
    defaultRoleKey: string;
    defaultTenantSlug: string;
    mode: "seeded";
  };
  id: string;
  name: string;
  primaryActor: string;
  processUniverseScenarioId: string | null;
  proofClass: string;
  requiredCases: string[];
  routes: string[];
  speedProfile: "human-demo" | "qa-fast";
  status: ScreencastJourneyStatus;
  testRefs?: string[];
  valueNarrative: {
    confidenceMoment: string;
    resultValue: string;
    safetyBoundary: string;
    userNeed: string;
  };
};

export type ScreencastManifest = {
  defaultViewport: {
    height: number;
    width: number;
  };
  journeys: ScreencastJourney[];
  manifestId: string;
  proofRules: string[];
  schemaVersion: string;
  sourceMatrix: string;
  sourceModel: string;
  speedProfiles: Array<"human-demo" | "qa-fast">;
};

export type ResolvedScreencastContract = {
  config: ScreencastConfig;
  manifest: ScreencastManifest;
  model: ProcessUniverseCaptureModel;
  scenarioById: Map<string, ProcessUniverseCaptureScenario>;
};

function businessScenarioSteps(scenario: ProcessUniverseCaptureScenario) {
  return scenario.steps.filter((step) => step.countAsBusiness !== false);
}

export function loadScreencastContract(): ResolvedScreencastContract {
  const configPath = repoPath("screencast.config.json");
  const config = readJson<ScreencastConfig>(configPath);
  const rawManifest = readJson<ScreencastManifest>(repoPath(config.manifestPath));
  const model = buildProcessUniverseCaptureModel();
  const scenarioById = new Map(
    [...humanDemoProcessUniverseScenarios, ...model.deepProofScenarios].map((scenario) => [scenario.id, scenario]),
  );
  const manifest: ScreencastManifest = {
    ...rawManifest,
    journeys: rawManifest.journeys.map((journey) => {
      const scenario = journey.processUniverseScenarioId ? scenarioById.get(journey.processUniverseScenarioId) : undefined;
      const scenarioBusinessSteps = scenario ? businessScenarioSteps(scenario) : [];
      if (!scenario || journey.businessSteps.length >= scenarioBusinessSteps.length) return journey;

      return {
        ...journey,
        businessSteps: [
          ...journey.businessSteps,
          ...scenarioBusinessSteps.slice(journey.businessSteps.length).map((step) => step.title),
        ],
      };
    }),
  };

  return {
    config,
    manifest,
    model,
    scenarioById,
  };
}

export function resolveBaseUrl(config: ScreencastConfig) {
  for (const envName of config.baseUrlEnv) {
    const value = process.env[envName];
    if (value) return value;
  }
  return config.defaultBaseUrl;
}

export function validateScreencastContract(contract = loadScreencastContract()) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { config, manifest, model, scenarioById } = contract;

  if (config.schemaVersion !== 1) errors.push(`Unsupported screencast.config.json schemaVersion ${config.schemaVersion}.`);
  if (!existsSync(repoPath(config.manifestPath))) errors.push(`Manifest not found: ${config.manifestPath}.`);
  if (!existsSync(repoPath(config.adapter.module))) errors.push(`Adapter not found: ${config.adapter.module}.`);
  for (const sourceArtifact of config.sourceArtifacts) {
    if (!existsSync(repoPath(sourceArtifact))) errors.push(`Source artifact not found: ${sourceArtifact}.`);
  }

  if (manifest.schemaVersion !== "1") errors.push(`Unsupported manifest schemaVersion ${manifest.schemaVersion}.`);
  if (manifest.journeys.length < 5 || manifest.journeys.length > 6) {
    errors.push("Expected 5-6 complex end-to-end screencast journeys.");
  }
  if (new Set(manifest.journeys.map((journey) => journey.id)).size !== manifest.journeys.length) {
    errors.push("Journey ids must be unique.");
  }
  const deepExecutableJourneys = manifest.journeys.filter((journey) => journey.status === "deep_executable");
  if (deepExecutableJourneys.length < 5) {
    errors.push("At least 5 deep executable human-demo journeys are required.");
  }
  if (!manifest.speedProfiles.includes("human-demo")) {
    errors.push("Manifest must declare the human-demo speed profile for final videos.");
  }
  if (!manifest.speedProfiles.includes("qa-fast")) {
    errors.push("Manifest must retain qa-fast for dry-run/stability probes only.");
  }
  const threeRoleJourneyCount = manifest.journeys.filter((journey) => journey.actors.length >= 3).length;
  if (threeRoleJourneyCount < 3) {
    errors.push("At least three journeys must include three or more role perspectives.");
  }

  for (const journey of manifest.journeys) {
    if (journey.speedProfile !== "human-demo") errors.push(`${journey.id} must use human-demo for final capture.`);
    if (journey.actors.length < 2) errors.push(`${journey.id} must include at least two role perspectives.`);
    if (journey.businessSteps.length < 25) errors.push(`${journey.id} must declare at least 25 business steps.`);
    if (journey.businessSteps.length > 35) errors.push(`${journey.id} must stay within 25-35 business steps.`);
    if (journey.requiredCases.length === 0) errors.push(`${journey.id} has no required cases.`);
    if (journey.routes.length === 0) errors.push(`${journey.id} has no routes.`);
    if (!journey.valueNarrative?.userNeed) errors.push(`${journey.id} must declare a user-need value narrative.`);
    if (!journey.valueNarrative?.confidenceMoment) errors.push(`${journey.id} must declare a confidence-moment value narrative.`);
    if (!journey.valueNarrative?.safetyBoundary) errors.push(`${journey.id} must declare a safety-boundary value narrative.`);
    if (!journey.valueNarrative?.resultValue) errors.push(`${journey.id} must declare a result-value narrative.`);
    if (journey.status === "deep_executable" && !journey.processUniverseScenarioId) {
      errors.push(`${journey.id} is deep executable but has no Process-Universe scenario id.`);
    }
    if (journey.processUniverseScenarioId && !scenarioById.has(journey.processUniverseScenarioId)) {
      errors.push(`${journey.id} references unknown Process-Universe scenario ${journey.processUniverseScenarioId}.`);
    }
    if (journey.status !== "deep_executable" && journey.processUniverseScenarioId) {
      warnings.push(`${journey.id} reuses a deep scenario but keeps status ${journey.status}; live output must preserve that caveat.`);
    }
    const scenario = journey.processUniverseScenarioId ? scenarioById.get(journey.processUniverseScenarioId) : undefined;
    const scenarioBusinessStepCount = scenario ? businessScenarioSteps(scenario).length : 0;
    if (journey.status === "deep_executable" && scenario && scenarioBusinessStepCount < 25) {
      errors.push(`${journey.id} executable scenario must contain at least 25 captured business steps.`);
    }
    if (journey.status === "deep_executable" && scenario && scenarioBusinessStepCount > 35) {
      errors.push(`${journey.id} executable scenario must stay within 25-35 captured business steps.`);
    }
  }

  if (model.processUniverseSummary.retainedP0ProcessCount !== 84) {
    errors.push(`Expected 84 retained P0 processes, found ${model.processUniverseSummary.retainedP0ProcessCount}.`);
  }
  if (model.processUniverseSummary.retainedP0StepCount !== 438) {
    errors.push(`Expected 438 retained P0 steps, found ${model.processUniverseSummary.retainedP0StepCount}.`);
  }
  if (model.auditSummary.completionClaimAllowed) errors.push("Process-Universe completion claim must remain blocked.");

  const summary = processCoverageSummary(model.processCoverageScenarios);
  return {
    coverageSummary: summary,
    errors,
    ok: errors.length === 0,
    warnings,
  };
}

export function outputRootFor(config: ScreencastConfig, runId: string) {
  return path.join(process.cwd(), config.outputRoot, runId);
}

export function journeyOutputDir(runRoot: string, journeyId: string) {
  return path.join(runRoot, journeyId);
}
