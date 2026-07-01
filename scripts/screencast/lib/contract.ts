import { existsSync } from "node:fs";
import path from "node:path";

import {
  buildProcessUniverseCaptureModel,
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
  speedProfile: "human-guided" | "qa-fast";
  status: ScreencastJourneyStatus;
  testRefs?: string[];
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
  speedProfiles: string[];
};

export type ResolvedScreencastContract = {
  config: ScreencastConfig;
  manifest: ScreencastManifest;
  model: ProcessUniverseCaptureModel;
  scenarioById: Map<string, ProcessUniverseCaptureScenario>;
};

export function loadScreencastContract(): ResolvedScreencastContract {
  const configPath = repoPath("screencast.config.json");
  const config = readJson<ScreencastConfig>(configPath);
  const manifest = readJson<ScreencastManifest>(repoPath(config.manifestPath));
  const model = buildProcessUniverseCaptureModel();
  const scenarioById = new Map(model.deepProofScenarios.map((scenario) => [scenario.id, scenario]));

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
  if (manifest.journeys.length < 8) errors.push("Expected at least 8 screencast journey clusters.");
  if (new Set(manifest.journeys.map((journey) => journey.id)).size !== manifest.journeys.length) {
    errors.push("Journey ids must be unique.");
  }
  if (!manifest.journeys.some((journey) => journey.status === "deep_executable")) {
    errors.push("At least one deep executable journey is required.");
  }

  for (const journey of manifest.journeys) {
    if (journey.requiredCases.length === 0) errors.push(`${journey.id} has no required cases.`);
    if (journey.routes.length === 0) errors.push(`${journey.id} has no routes.`);
    if (journey.status === "deep_executable" && !journey.processUniverseScenarioId) {
      errors.push(`${journey.id} is deep executable but has no Process-Universe scenario id.`);
    }
    if (journey.processUniverseScenarioId && !scenarioById.has(journey.processUniverseScenarioId)) {
      errors.push(`${journey.id} references unknown Process-Universe scenario ${journey.processUniverseScenarioId}.`);
    }
    if (journey.status !== "deep_executable" && journey.processUniverseScenarioId) {
      warnings.push(`${journey.id} reuses a deep scenario but keeps status ${journey.status}; live output must preserve that caveat.`);
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
