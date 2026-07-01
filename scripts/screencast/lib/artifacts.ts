import path from "node:path";

import { processCoverageSummary } from "@/lib/process-universe-capture-model";

import type { ScreencastJourney, ScreencastManifest } from "./contract";
import { writeJson, writeText } from "./io";

export type ScreencastEvent = {
  action: string;
  detail: string;
  journeyId: string;
  status: "failed" | "passed" | "planned" | "skipped" | "warning";
  stepId: string;
};

export const srtCueSeconds = 8;

export type CaptionCue = {
  endMs: number;
  startMs: number;
  text: string;
};

function captionText(caption: string | CaptionCue) {
  return typeof caption === "string" ? caption : caption.text;
}

export function writeSrt(filePath: string, captions: Array<string | CaptionCue>) {
  const cues = captions.map((caption, index) => {
    const startMs = typeof caption === "string" ? index * srtCueSeconds * 1_000 : caption.startMs;
    const endMs = typeof caption === "string" ? (index * srtCueSeconds + srtCueSeconds - 1) * 1_000 : caption.endMs;
    const end = Math.max(endMs, startMs + 750);
    return `${index + 1}\n${millisecondsToSrt(startMs)} --> ${millisecondsToSrt(end)}\n${captionText(caption)}`;
  });
  writeText(filePath, `${cues.join("\n\n")}\n`);
}

function millisecondsToSrt(totalMilliseconds: number) {
  const totalSeconds = Math.floor(totalMilliseconds / 1_000);
  const milliseconds = Math.floor(totalMilliseconds % 1_000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

function valueNarrativeLines(journey: ScreencastJourney) {
  return [
    `User need: ${journey.valueNarrative.userNeed}`,
    `Confidence moment: ${journey.valueNarrative.confidenceMoment}`,
    `Safety boundary: ${journey.valueNarrative.safetyBoundary}`,
    `Result value: ${journey.valueNarrative.resultValue}`,
  ];
}

export function storyboardForJourney(input: {
  events: ScreencastEvent[];
  journey: ScreencastJourney;
  screenshotFiles: string[];
}) {
  return [
    `# ${input.journey.id} - ${input.journey.name}`,
    "",
    `Cluster: ${input.journey.cluster}`,
    `Status: ${input.journey.status}`,
    `Proof class: ${input.journey.proofClass}`,
    `Speed: ${input.journey.speedProfile}`,
    `Actors: ${input.journey.actors.join(", ")}`,
    "",
    "## User Value Story",
    "",
    ...valueNarrativeLines(input.journey).map((line) => `- ${line}`),
    "",
    "## Business Steps",
    "",
    ...input.journey.businessSteps.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## Required Cases",
    "",
    ...input.journey.requiredCases.map((item) => `- ${item}`),
    "",
    "## Screenshots",
    "",
    ...(input.screenshotFiles.length > 0 ? input.screenshotFiles.map((file) => `- ${file}`) : ["- none"]),
    "",
    "## Events",
    "",
    "| Step | Action | Status | Detail |",
    "| --- | --- | --- | --- |",
    ...input.events.map((event) => `| ${event.stepId} | ${event.action} | ${event.status} | ${event.detail.replaceAll("|", "/")} |`),
    "",
  ].join("\n");
}

export function transcriptForJourney(input: {
  captions: string[];
  journey: ScreencastJourney;
}) {
  return [
    `# Transcript - ${input.journey.id}`,
    "",
    input.journey.captions?.intro ?? `${input.journey.name} is captured against the AlphaVest Process Universe contract.`,
    "",
    "## User Value Story",
    "",
    ...valueNarrativeLines(input.journey).map((line) => `- ${line}`),
    "",
    "## Business Step Transcript",
    "",
    ...input.journey.businessSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "## Captured Action Captions",
    "",
    ...input.captions.map((caption, index) => `${index + 1}. ${caption}`),
    "",
  ].join("\n");
}

export function writeRunIndex(input: {
  events: ScreencastEvent[];
  journeys: Array<{
    artifactDir?: string;
    id: string;
    status: string;
  }>;
  manifest: ScreencastManifest;
  model: ReturnType<typeof import("@/lib/process-universe-capture-model").buildProcessUniverseCaptureModel>;
  runRoot: string;
  runId: string;
}) {
  const coverageSummary = processCoverageSummary(input.model.processCoverageScenarios);
  const ok = input.journeys.every((journey) => journey.status !== "failed");

  writeJson(path.join(input.runRoot, "index.json"), {
    generatedAt: new Date().toISOString(),
    journeyCount: input.journeys.length,
    journeys: input.journeys,
    ok,
    processCoverage: {
      completionClaimAllowed: input.model.auditSummary.completionClaimAllowed,
      coverageStatusCounts: coverageSummary.coverageStatusCounts,
      processCount: coverageSummary.processCount,
      stepCount: coverageSummary.stepCount,
    },
    runId: input.runId,
    speedProfile: input.manifest.speedProfiles.includes("human-demo") ? "human-demo" : input.manifest.speedProfiles[0],
  });
  writeText(
    path.join(input.runRoot, "index.md"),
    [
      "# AlphaVest Process-Universe Screencast Run",
      "",
      `Run: ${input.runId}`,
      `Journeys: ${input.journeys.length}`,
      `Process coverage: ${coverageSummary.processCount} processes / ${coverageSummary.stepCount} steps`,
      `Completion claim allowed: ${input.model.auditSummary.completionClaimAllowed ? "yes" : "no"}`,
      "",
      "| Journey | Status | Artifact Dir |",
      "| --- | --- | --- |",
      ...input.journeys.map((journey) => `| ${journey.id} | ${journey.status} | ${journey.artifactDir ?? ""} |`),
      "",
      "## Business-Step Coverage",
      "",
      "| Journey | Actors | Business Steps |",
      "| --- | --- | --- |",
      ...input.manifest.journeys.map((journey) => `| ${journey.id} | ${journey.actors.join(", ")} | ${journey.businessSteps.length} |`),
      "",
      "## Manifest Clusters",
      "",
      ...input.manifest.journeys.map((journey) => `- ${journey.id}: ${journey.cluster} (${journey.status})`),
      "",
    ].join("\n"),
  );
  writeJson(path.join(input.runRoot, "run-log.json"), {
    eventCount: input.events.length,
    events: input.events,
    generatedAt: new Date().toISOString(),
    runId: input.runId,
  });
}
