import { chromium, type Browser, type BrowserContext, type Locator, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  buildProcessUniverseCaptureModel,
  processCoverageSummary,
  processUniverseRowsForScenario,
  validateProcessUniverseCaptureModel,
  type ProcessUniverseCaptureAction,
  type ProcessUniverseCaptureLocator,
  type ProcessUniverseCaptureScenario,
  type ProcessUniverseProcessCoverageScenario,
} from "@/lib/process-universe-capture-model";
import type { ProcessUniverseProjectionWave } from "@/lib/process-universe-proof-plans";

type ActionStatus = "passed" | "failed" | "planned" | "warning";
type ScenarioStatus = "passed" | "failed" | "dry_run" | "completed_with_warnings" | "api_proven_not_ui_projected" | "blocked_proof";

type RunEvent = {
  action: string;
  detail: string;
  scenarioId: string;
  status: ActionStatus;
  stepId: string;
};

type RunnerState = {
  values: Record<string, unknown>;
};

type ScenarioActor = {
  email?: string;
  roleKey: string;
  tenantSlug: string;
};

type RunnerOptions = {
  baseUrl: string;
  dryRun: boolean;
  outputDir: string;
  runId: string;
};

type ApiResult = {
  body: unknown;
  status: number;
};

type GapEntry = {
  coverageStatus: string;
  gapReasons: string[];
  processId: string;
  processName: string;
  severity: "gap" | "product-gap" | "warning";
};

type AuthorityLedgerEntry = {
  classificationAfter: string;
  classificationBefore: string;
  executable: boolean;
  forbiddenAuthorityPresent: boolean;
  primaryAuthorityKind: string | null;
  primaryEndpoint: string | null;
  projectionTargetClassificationAfter: string | null;
  projectionWave: string | null;
  processId: string;
  proofPlanId: string | null;
  remainingProjectionGap: string | null;
  uiProjection: string | null;
};

type VisualEvidenceEntry = {
  absolutePath: string | null;
  compareWith: string | null;
  diff: {
    changedPixels: number | null;
    diffPath: string | null;
    passed: boolean | null;
    threshold: number | null;
  };
  dimensions: {
    height: number | null;
    width: number | null;
  };
  expectedOcrText: string[];
  hash: string | null;
  ocr: {
    matchedText: string[];
    passed: boolean | null;
    required: boolean;
    textPath: string | null;
  };
  phase: "after" | "before" | null;
  processId: string | null;
  proofPlanId: string | null;
  relativePath: string;
  scenarioId: string;
  screenshotName: string;
  status: "failed" | "passed" | "planned" | "warning";
  stepId: string;
  thumbnailPath: string | null;
  visualProofId: string | null;
};

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run") || process.env.AVS_PROCESS_UNIVERSE_CAPTURE_DRY_RUN === "1";
const runId =
  process.env.AVS_PROCESS_UNIVERSE_CAPTURE_OUTPUT ??
  new Date().toISOString().replace(/[.:]/g, "-").replace("T", "_").slice(0, 19);
const baseUrl = process.env.AVS_BASE_URL ?? process.env.BASE_URL ?? "http://127.0.0.1:3020";
const outputDir = path.join(process.cwd(), "artifacts", "process-universe-captures", runId);

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath: string, value: string) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, value);
}

function relativeToOutput(options: RunnerOptions, filePath: string) {
  return path.relative(options.outputDir, filePath);
}

function assertVisualEvidenceTools() {
  for (const command of ["magick", "tesseract"]) {
    try {
      execFileSync(command, ["--version"], { stdio: "ignore" });
    } catch {
      throw new Error(`Process-Universe visual evidence requires ${command} on PATH.`);
    }
  }
}

function fileSha256(filePath: string) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function imageDimensions(filePath: string) {
  const output = execFileSync("magick", ["identify", "-format", "%w %h", filePath], { encoding: "utf8" }).trim();
  const [width, height] = output.split(/\s+/).map(Number);
  return { height, width };
}

function createThumbnail(inputPath: string, outputPath: string) {
  ensureDir(path.dirname(outputPath));
  execFileSync("magick", [inputPath, "-resize", "360x", "-quality", "82", outputPath], { stdio: "pipe" });
}

function normalizeVisualText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function runOcr(inputPath: string, outputPath: string) {
  ensureDir(path.dirname(outputPath));
  const text = execFileSync("tesseract", [inputPath, "stdout", "--psm", "6"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  writeText(outputPath, text);
  return text;
}

function compareImages(beforePath: string, afterPath: string, diffImagePath: string) {
  ensureDir(path.dirname(diffImagePath));
  try {
    const output = execFileSync("magick", ["compare", "-metric", "AE", beforePath, afterPath, diffImagePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return Number(output.trim() || 0);
  } catch (error) {
    const stderr = (error as { stderr?: Buffer | string }).stderr;
    const stdout = (error as { stdout?: Buffer | string }).stdout;
    const metric = `${stderr ? stderr.toString() : ""}${stdout ? stdout.toString() : ""}`.trim();
    const parsed = Number(metric.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i)?.[0] ?? NaN);
    if (Number.isFinite(parsed)) return parsed;
    throw error;
  }
}

function duplicateValues(items: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const item of items) {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  }
  return [...duplicates].sort();
}

function resolveTemplate(value: string, state: RunnerState) {
  return value.replace(/\$\{([a-zA-Z0-9_.-]+)\}/g, (_, key: string) => {
    const resolved = state.values[key];
    if (typeof resolved !== "string" && typeof resolved !== "number" && typeof resolved !== "boolean") {
      throw new Error(`Missing template value ${key}.`);
    }
    return String(resolved);
  });
}

function resolveBody(value: unknown, state: RunnerState): unknown {
  if (typeof value === "string") return resolveTemplate(value, state);
  if (Array.isArray(value)) return value.map((item) => resolveBody(item, state));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, resolveBody(entry, state)]),
    );
  }
  return value;
}

function readPath(source: unknown, jsonPath: string) {
  return jsonPath.split(".").reduce<unknown>((current, part) => {
    if (current === undefined || current === null) return undefined;
    if (Array.isArray(current) && /^\d+$/.test(part)) return current[Number(part)];
    if (typeof current === "object") return (current as Record<string, unknown>)[part];
    return undefined;
  }, source);
}

function containsValue(source: unknown, value: string | number | boolean): boolean {
  if (Array.isArray(source)) return source.some((item) => containsValue(item, value));
  if (source && typeof source === "object") return JSON.stringify(source).includes(String(value));
  return String(source).includes(String(value));
}

function locatorFor(page: Page, locator: ProcessUniverseCaptureLocator): Locator {
  if (locator.kind === "label") return page.getByLabel(locator.value);
  if (locator.kind === "placeholder") return page.getByPlaceholder(locator.value);
  if (locator.kind === "role") return page.getByRole(locator.role, { name: locator.name });
  if (locator.kind === "selector") return page.locator(locator.value);
  if (locator.kind === "testId") return page.getByTestId(locator.value);
  return page.getByText(locator.value);
}

async function apiRequest(action: Extract<ProcessUniverseCaptureAction, { action: "api" | "expectBlocked" }>, state: RunnerState) {
  const endpoint = resolveTemplate(action.endpoint, state);
  const url = new URL(endpoint, baseUrl);
  const token = "tokenRef" in action && action.tokenRef ? state.values[action.tokenRef] : state.values.__currentActorJwt;
  const headers: Record<string, string> = {
    accept: "application/json",
  };
  if (action.method === "POST") headers["content-type"] = "application/json";
  if (typeof token === "string") headers.authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    body: action.method === "POST" ? JSON.stringify(resolveBody(action.body ?? {}, state)) : undefined,
    headers,
    method: action.method,
  });

  const body = await response.json().catch(() => null);
  return {
    body,
    status: response.status,
  } satisfies ApiResult;
}

async function applyAuthCookie(context: BrowserContext, token: string) {
  const parsedBaseUrl = new URL(baseUrl);
  await context.addCookies([
    {
      domain: parsedBaseUrl.hostname,
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      httpOnly: true,
      name: "alphavest_auth_jwt",
      path: "/",
      sameSite: "Lax",
      secure: parsedBaseUrl.protocol === "https:",
      value: token,
    },
    {
      domain: parsedBaseUrl.hostname,
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      httpOnly: true,
      name: "alphavest_local_auth_session",
      path: "/",
      sameSite: "Lax",
      secure: parsedBaseUrl.protocol === "https:",
      value: "av-session-process-universe-capture",
    },
  ]);
}

function emailForActor(actor: ScenarioActor) {
  if (actor.email) return actor.email;
  if (actor.roleKey === "admin") return "ava.admin@alphavest.demo";
  if (actor.roleKey === "security_officer") return "sam.security@alphavest.demo";
  if (actor.roleKey === "compliance_officer") return "naledi.compliance@alphavest.demo";
  if (actor.roleKey === "senior_wealth_advisor") return "thabo.advisor@alphavest.demo";
  if (actor.roleKey === "analyst") return "mira.analyst@alphavest.demo";
  if (actor.roleKey === "client_success") return "lina.success@alphavest.demo";
  if (actor.roleKey === "principal") return `principal.${actor.tenantSlug}@example.demo`;
  if (actor.roleKey === "family_cfo") return `cfo.${actor.tenantSlug}@example.demo`;
  if (actor.roleKey === "trustee") return `trustee.${actor.tenantSlug}@example.demo`;
  if (actor.roleKey === "next_gen") return `nextgen.${actor.tenantSlug}@example.demo`;
  if (actor.roleKey === "external_advisor") return `external.${actor.tenantSlug}@example.demo`;

  return "lina.success@alphavest.demo";
}

async function issueScenarioActorJwt(actor: ScenarioActor) {
  const authBody = {
    email: emailForActor(actor),
    providerId: "db-user-jwt",
    roleKey: actor.roleKey,
    tenantSlug: actor.tenantSlug,
  };
  const startResponse = await fetch(new URL("/api/auth/provider-login", baseUrl), {
    body: JSON.stringify(authBody),
    headers: { accept: "application/json", "content-type": "application/json" },
    method: "POST",
  });
  if (!startResponse.ok) {
    throw new Error(`Scenario actor auth start failed with HTTP ${startResponse.status}: ${await startResponse.text()}`);
  }

  const mfaResponse = await fetch(new URL("/api/auth/mfa/verify", baseUrl), {
    body: JSON.stringify({ ...authBody, code: "123456" }),
    headers: { accept: "application/json", "content-type": "application/json" },
    method: "POST",
  });
  const mfaBody = (await mfaResponse.json().catch(() => undefined)) as { jwt?: unknown } | undefined;
  if (!mfaResponse.ok || typeof mfaBody?.jwt !== "string") {
    throw new Error(`Scenario actor MFA failed with HTTP ${mfaResponse.status}: ${JSON.stringify(mfaBody)}`);
  }

  return mfaBody.jwt;
}

async function applyDemoBrowserSession(context: BrowserContext, page: Page, actor: ScenarioActor) {
  const parsedBaseUrl = new URL(baseUrl);
  await context.addInitScript(
    ({ roleKey, tenantSlug }) => {
      window.localStorage.setItem("alphavest.demoSession.v1", JSON.stringify({ roleKey, tenantSlug }));
    },
    { roleKey: actor.roleKey, tenantSlug: actor.tenantSlug },
  );

  await context.addCookies([
    {
      domain: parsedBaseUrl.hostname,
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      httpOnly: true,
      name: "alphavest_local_auth_session",
      path: "/",
      sameSite: "Lax",
      secure: parsedBaseUrl.protocol === "https:",
      value: "av-session-process-universe-capture",
    },
  ]);

  await page.goto(new URL("/portal", baseUrl).toString(), { waitUntil: "load", timeout: 20_000 });
  await page.evaluate(
    ({ roleKey, tenantSlug }) => {
      window.localStorage.setItem("alphavest.demoSession.v1", JSON.stringify({ roleKey, tenantSlug }));
    },
    { roleKey: actor.roleKey, tenantSlug: actor.tenantSlug },
  );
}

function scenarioDir(options: RunnerOptions, scenario: ProcessUniverseCaptureScenario) {
  return path.join(options.outputDir, scenario.id);
}

function proofScenarioFromCoverage(scenario: ProcessUniverseProcessCoverageScenario): ProcessUniverseCaptureScenario | null {
  if (!scenario.proofPlan) return null;

  return {
    actor: scenario.proofPlan.actor,
    apiEndpoints: scenario.apiEndpoints,
    expectedOutputs: scenario.expectedOutputs,
    id: scenario.id,
    negativeProof: scenario.proofPlan.negativeAction
      ? [`${scenario.proofPlan.proofPlanId} includes fail-closed negative proof.`]
      : [`${scenario.proofPlan.proofPlanId} has no additional negative proof requirement.`],
    positiveProof: [`${scenario.proofPlan.proofPlanId} executes ${scenario.proofPlan.primaryEndpoint}.`],
    processIds: [scenario.processId],
    routes: scenario.proofPlan.screenshotRoutes,
    statusExpectation:
      scenario.projectionWave
        ? "visible_proof"
        : scenario.proofPlan.classificationAfter === "blocked_negative_only"
        ? "blocked_proof"
        : scenario.proofPlan.remainingProjectionGap
          ? "api_proven_not_ui_projected"
          : "visible_proof",
    steps: scenario.steps,
    title: `${scenario.processId} proof-plan capture`,
  };
}

function authorityLedgerForCoverage(scenarios: ProcessUniverseProcessCoverageScenario[]): AuthorityLedgerEntry[] {
  return scenarios.map((scenario) => ({
    classificationAfter: scenario.classificationAfter,
    classificationBefore: scenario.classificationBefore,
    executable: Boolean(scenario.proofPlan),
    forbiddenAuthorityPresent:
      scenario.gapReasons.includes("stale_demo_workflow_touchpoint") ||
      scenario.apiEndpoints.some((endpoint) => endpoint.includes("/api/demo-workflow")),
    primaryAuthorityKind: scenario.primaryAuthorityKind,
    primaryEndpoint: scenario.proofPlan?.primaryEndpoint ?? null,
    projectionTargetClassificationAfter: scenario.projectionTargetClassificationAfter,
    projectionWave: scenario.projectionWave,
    processId: scenario.processId,
    proofPlanId: scenario.proofPlanId,
    remainingProjectionGap: scenario.remainingProjectionGap,
    uiProjection: scenario.uiProjection,
  }));
}

function addUnique(items: string[], value: string) {
  return items.includes(value) ? items : [...items, value];
}

function projectionWaveDelta(
  scenarios: ProcessUniverseProcessCoverageScenario[],
  scenarioResults: Array<{ id: string; status: ScenarioStatus }> = [],
  wave: ProcessUniverseProjectionWave = "wave_1",
) {
  const waveScenarios = scenarios.filter((scenario) => scenario.projectionWave === wave);
  const resultById = new Map(scenarioResults.map((result) => [result.id, result.status]));
  const passed = waveScenarios.filter((scenario) => resultById.get(scenario.id) === "passed").length;
  const failed = waveScenarios.filter((scenario) => resultById.get(scenario.id) === "failed").length;
  const stillApiOnly = waveScenarios.length - passed;

  return {
    failed,
    passed,
    selected: waveScenarios.length,
    stillApiOnly,
  };
}

function coverageWithLiveProjectionResults(
  scenarios: ProcessUniverseProcessCoverageScenario[],
  scenarioResults: Array<{ id: string; status: ScenarioStatus }>,
): ProcessUniverseProcessCoverageScenario[] {
  const resultById = new Map(scenarioResults.map((result) => [result.id, result]));

  return scenarios.map((scenario) => {
    if (!scenario.projectionWave) return scenario;

    const passed = resultById.get(scenario.id)?.status === "passed";
    if (!passed) {
      return {
        ...scenario,
        classificationAfter: scenario.classificationAfter,
        classificationBefore: scenario.classificationBefore,
        coverageStatus: scenario.classificationAfter,
        gapReasons: addUnique(scenario.gapReasons, "missing_visible_ui_projection_proof"),
        proofDepth: scenario.classificationAfter === "blocked_negative_only" ? "blocked_negative" : "api_or_runtime_backed_not_ui_projected",
        remainingProjectionGap: "missing_visible_ui_projection_proof",
      };
    }

    return {
      ...scenario,
      classificationAfter: "deep_executable",
      classificationBefore: scenario.classificationBefore,
      coverageStatus: "deep_executable",
      gapReasons: scenario.gapReasons.filter(
        (reason) => reason !== "missing_visible_ui_projection_proof" && reason !== "not_executed_by_current_capture_run",
      ),
      proofDepth: "deep_positive_negative_state",
      remainingProjectionGap: null,
    };
  });
}

function executedProofActionsFromEvents(events: RunEvent[], scenarios: ProcessUniverseProcessCoverageScenario[]) {
  const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));

  return events.map((event) => {
    const scenario = scenarioById.get(event.scenarioId);
    return {
      ...event,
      classificationAfter: scenario?.classificationAfter ?? null,
      classificationBefore: scenario?.classificationBefore ?? null,
      primaryAuthorityKind: scenario?.primaryAuthorityKind ?? null,
      proofPlanId: scenario?.proofPlanId ?? null,
      remainingProjectionGap: scenario?.remainingProjectionGap ?? null,
    };
  });
}

function visualEvidenceById(entries: VisualEvidenceEntry[]) {
  return new Map(entries.filter((entry) => entry.visualProofId).map((entry) => [entry.visualProofId, entry]));
}

function validateVisualEvidenceDedupe(entries: VisualEvidenceEntry[]) {
  const errors: string[] = [];
  const duplicateVisualProofIds = duplicateValues(entries.map((entry) => entry.visualProofId).filter((id): id is string => Boolean(id)));
  const duplicateRelativePaths = duplicateValues(entries.map((entry) => entry.relativePath).filter(Boolean));
  const duplicateThumbnailPaths = duplicateValues(entries.map((entry) => entry.thumbnailPath).filter((entry): entry is string => Boolean(entry)));
  const duplicateHashesByScenario = new Map<string, string[]>();
  for (const scenarioId of new Set(entries.map((entry) => entry.scenarioId))) {
    const duplicateHashes = duplicateValues(
      entries
        .filter((entry) => entry.scenarioId === scenarioId && entry.visualProofId)
        .map((entry) => entry.hash)
        .filter((hash): hash is string => Boolean(hash)),
    );
    if (duplicateHashes.length > 0) duplicateHashesByScenario.set(scenarioId, duplicateHashes);
  }

  for (const duplicate of duplicateVisualProofIds) errors.push(`Duplicate visualProofId ${duplicate}.`);
  for (const duplicate of duplicateRelativePaths) errors.push(`Duplicate screenshot path ${duplicate}.`);
  for (const duplicate of duplicateThumbnailPaths) errors.push(`Duplicate thumbnail path ${duplicate}.`);
  for (const [scenarioId, duplicates] of duplicateHashesByScenario) {
    for (const duplicate of duplicates) errors.push(`Duplicate visual evidence screenshot hash ${duplicate} in ${scenarioId}.`);
  }

  return errors;
}

function validateLedgerDedupe(input: {
  authorityLedger: AuthorityLedgerEntry[];
  coverage: ProcessUniverseProcessCoverageScenario[];
  gapEntries: GapEntry[];
}) {
  const errors: string[] = [];
  for (const duplicate of duplicateValues(input.coverage.map((entry) => entry.processId))) {
    errors.push(`Duplicate coverage-ledger process row ${duplicate}.`);
  }
  for (const duplicate of duplicateValues(input.authorityLedger.map((entry) => entry.processId))) {
    errors.push(`Duplicate authority-ledger process row ${duplicate}.`);
  }
  for (const duplicate of duplicateValues(input.gapEntries.map((entry) => entry.processId).filter(Boolean))) {
    errors.push(`Duplicate gap-register process row ${duplicate}.`);
  }
  return errors;
}

function visualEvidencePassedForScenario(scenarioId: string, entries: VisualEvidenceEntry[]) {
  const scenarioEntries = entries.filter((entry) => entry.scenarioId === scenarioId && entry.visualProofId);
  const beforeCount = scenarioEntries.filter((entry) => entry.phase === "before" && entry.status === "passed").length;
  const afterEntries = scenarioEntries.filter((entry) => entry.phase === "after");

  return (
    beforeCount > 0 &&
    afterEntries.length > 0 &&
    afterEntries.every((entry) => entry.status === "passed" && entry.diff.passed === true && entry.ocr.passed === true)
  );
}

function plannedScreenshotIndex(model: ReturnType<typeof buildProcessUniverseCaptureModel>, options: RunnerOptions): VisualEvidenceEntry[] {
  const scenarios = [
    ...model.deepProofScenarios.map((scenario) => ({ proofPlanId: null as string | null, scenario })),
    ...model.processCoverageScenarios.map((coverageScenario) => ({
      proofPlanId: coverageScenario.proofPlanId,
      scenario: proofScenarioFromCoverage(coverageScenario),
    })),
  ].filter((entry): entry is { proofPlanId: string | null; scenario: ProcessUniverseCaptureScenario } => Boolean(entry.scenario));

  return scenarios.flatMap(({ proofPlanId, scenario }) =>
    scenario.steps.flatMap((step) =>
      step.actions
        .filter((action): action is Extract<ProcessUniverseCaptureAction, { action: "screenshot" }> => action.action === "screenshot")
        .map((action) => {
          const relativePath = path.join(scenario.id, "screenshots", `${action.name}.png`);
          return {
            absolutePath: path.join(options.outputDir, relativePath),
            compareWith: action.compareWith ?? null,
            diff: {
              changedPixels: null,
              diffPath: action.compareWith ? path.join("visual-evidence", "diffs", `${action.visualProofId ?? action.name}.json`) : null,
              passed: null,
              threshold: action.minChangedPixels ?? null,
            },
            dimensions: { height: null, width: null },
            expectedOcrText: action.expectedOcrText ?? [],
            hash: null,
            ocr: {
              matchedText: [],
              passed: null,
              required: Boolean(action.ocrRequired),
              textPath: action.ocrRequired ? path.join("visual-evidence", "ocr", `${action.visualProofId ?? action.name}.txt`) : null,
            },
            phase: action.phase ?? null,
            processId: action.processId ?? null,
            proofPlanId,
            relativePath,
            scenarioId: scenario.id,
            screenshotName: action.name,
            status: "planned" as const,
            stepId: step.id,
            thumbnailPath: path.join("visual-evidence", "thumbnails", `${action.visualProofId ?? action.name}.webp`),
            visualProofId: action.visualProofId ?? null,
          };
        }),
    ),
  );
}

function writeScreenshotIndex(options: RunnerOptions, entries: VisualEvidenceEntry[], title: string) {
  writeJson(path.join(options.outputDir, "screenshot-index.json"), {
    generatedAt: new Date().toISOString(),
    screenshotCount: entries.length,
    visualEvidenceCount: entries.filter((entry) => entry.visualProofId).length,
    entries,
  });
  writeText(
    path.join(options.outputDir, "screenshot-index.md"),
    [
      `# ${title}`,
      "",
      `Run: ${options.runId}`,
      `Screenshots: ${entries.length}`,
      `Visual evidence entries: ${entries.filter((entry) => entry.visualProofId).length}`,
      "",
      "| Process | Scenario | Phase | Status | Screenshot | Thumbnail | OCR | Diff |",
      "| --- | --- | --- | --- | --- | --- | --- | --- |",
      ...entries.map((entry) => {
        const shot = entry.relativePath ? `[png](${entry.relativePath})` : "";
        const thumb = entry.thumbnailPath ? `![thumb](${entry.thumbnailPath})` : "";
        const ocr = entry.ocr.textPath ? `[text](${entry.ocr.textPath})` : "";
        const diff = entry.diff.diffPath ? `[diff](${entry.diff.diffPath})` : "";
        return `| ${entry.processId ?? ""} | ${entry.scenarioId} | ${entry.phase ?? ""} | ${entry.status} | ${shot} | ${thumb} | ${ocr} | ${diff} |`;
      }),
      "",
    ].join("\n"),
  );
}

async function executeAction(input: {
  action: ProcessUniverseCaptureAction;
  context: BrowserContext;
  events: RunEvent[];
  options: RunnerOptions;
  page: Page;
  scenario: ProcessUniverseCaptureScenario;
  state: RunnerState;
  stepId: string;
  visualEvidence: VisualEvidenceEntry[];
}) {
  const { action, context, events, options, page, scenario, state, stepId, visualEvidence } = input;

  const record = (status: ActionStatus, detail: string) => {
    events.push({ action: action.action, detail, scenarioId: scenario.id, status, stepId });
  };

  try {
    if (action.action === "goto") {
      const targetUrl = new URL(action.route, options.baseUrl).toString();
      await page.goto(targetUrl, { waitUntil: "load", timeout: 20_000 }).catch(async (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        const alreadyAtTarget =
          page.url() === targetUrl &&
          (message.includes("interrupted by another navigation") || message.includes("net::ERR_ABORTED"));
        if (!alreadyAtTarget && message.includes("net::ERR_ABORTED")) {
          await page.waitForURL(targetUrl, { timeout: 5_000 }).catch(() => {
            throw error;
          });
          return;
        }
        if (!alreadyAtTarget) {
          throw error;
        }
      });
      await page.getByText("Loading workspace").waitFor({ state: "hidden", timeout: 5_000 }).catch(() => undefined);
      record("passed", action.route);
      return;
    }

    if (action.action === "gotoByReplacingCurrentPath") {
      const currentUrl = new URL(page.url());
      if (!currentUrl.pathname.endsWith(action.fromSuffix)) {
        throw new Error(`Current path ${currentUrl.pathname} does not end with ${action.fromSuffix}.`);
      }
      currentUrl.pathname = `${currentUrl.pathname.slice(0, -action.fromSuffix.length)}${action.toSuffix}`;
      currentUrl.search = "";
      currentUrl.hash = "";
      await page.goto(currentUrl.toString(), { waitUntil: "load", timeout: 20_000 });
      await page.getByText("Loading workspace").waitFor({ state: "hidden", timeout: 5_000 }).catch(() => undefined);
      record("passed", `${action.fromSuffix} -> ${action.toSuffix}`);
      return;
    }

    if (action.action === "fill") {
      await locatorFor(page, action.locator).fill(action.value, { timeout: 5_000 });
      record("passed", `${action.locator.kind}:${"value" in action.locator ? action.locator.value : action.locator.name}`);
      return;
    }

    if (action.action === "select") {
      await locatorFor(page, action.locator).selectOption(action.value, { timeout: 5_000 });
      record("passed", action.value);
      return;
    }

    if (action.action === "click") {
      const locator = locatorFor(page, action.locator).first();
      if (action.optional && (await locator.count()) === 0) {
        record("warning", "Optional click target missing.");
        return;
      }
      await locator.click({ timeout: 5_000 });
      record("passed", `${action.locator.kind}`);
      return;
    }

    if (action.action === "assertText") {
      await page.getByText(action.text).first().waitFor({ state: "visible", timeout: 5_000 });
      record("passed", action.text);
      return;
    }

    if (action.action === "assertNotText") {
      const count = await page.getByText(action.text, { exact: false }).count();
      if (count > 0) throw new Error(`Forbidden text is visible: ${action.text}`);
      record("passed", action.text);
      return;
    }

    if (action.action === "api") {
      const result = await apiRequest(action, state);
      if (result.status !== action.expectStatus) {
        throw new Error(`Expected ${action.expectStatus}, received ${result.status}: ${JSON.stringify(result.body)}`);
      }
      if (action.saveAs) state.values[action.saveAs] = result.body;
      for (const extraction of action.extract ?? []) {
        const extracted = readPath(result.body, extraction.path);
        if (extracted === undefined) throw new Error(`Missing API extraction ${extraction.path}.`);
        state.values[extraction.as] = extracted;
        if (typeof extracted === "string" && extraction.as.toLowerCase().includes("jwt")) {
          await applyAuthCookie(context, extracted);
        }
      }
      record("passed", `${action.method} ${action.endpoint}`);
      return;
    }

    if (action.action === "expectBlocked") {
      const result = await apiRequest(action, state);
      if (result.status !== action.expectStatus) {
        throw new Error(`Expected blocked status ${action.expectStatus}, received ${result.status}: ${JSON.stringify(result.body)}`);
      }
      if (action.expectIssue && !containsValue(result.body, action.expectIssue)) {
        throw new Error(`Blocked response did not contain issue ${action.expectIssue}: ${JSON.stringify(result.body)}`);
      }
      if (action.saveAs) state.values[action.saveAs] = result.body;
      record("passed", `${action.method} ${action.endpoint}`);
      return;
    }

    if (action.action === "assertApiState") {
      const source = state.values[action.sourceRef];
      const actual = readPath(source, action.path);
      const passed =
        action.expect === "equals"
          ? actual === action.value
          : action.expect === "matches"
            ? new RegExp(String(action.value)).test(String(actual))
            : containsValue(actual, action.value);
      if (!passed) throw new Error(`API state assertion failed at ${action.sourceRef}.${action.path}; actual=${JSON.stringify(actual)}`);
      record("passed", `${action.sourceRef}.${action.path}`);
      return;
    }

    if (action.action === "screenshot") {
      const screenshotDir = path.join(scenarioDir(options, scenario), "screenshots");
      ensureDir(screenshotDir);
      const screenshotPath = path.join(screenshotDir, `${action.name}.png`);
      await page.screenshot({ fullPage: true, path: screenshotPath });
      const relativePath = relativeToOutput(options, screenshotPath);
      const visualId = action.visualProofId ?? action.name;
      const thumbnailPath = path.join(options.outputDir, "visual-evidence", "thumbnails", `${visualId}.webp`);
      const ocrTextPath = action.ocrRequired ? path.join(options.outputDir, "visual-evidence", "ocr", `${visualId}.txt`) : null;
      const diffJsonPath = action.compareWith ? path.join(options.outputDir, "visual-evidence", "diffs", `${visualId}.json`) : null;
      const diffImagePath = action.compareWith ? path.join(options.outputDir, "visual-evidence", "diffs", `${visualId}.png`) : null;
      const dimensions = imageDimensions(screenshotPath);
      const hash = fileSha256(screenshotPath);
      createThumbnail(screenshotPath, thumbnailPath);
      let visualFailureMessage: string | null = null;

      let ocrPassed: boolean | null = null;
      let matchedText: string[] = [];
      if (action.ocrRequired && ocrTextPath) {
        const ocrText = runOcr(screenshotPath, ocrTextPath);
        const normalizedOcr = normalizeVisualText(ocrText);
        matchedText = (action.expectedOcrText ?? []).filter((text) => normalizedOcr.includes(normalizeVisualText(text)));
        ocrPassed = matchedText.length === (action.expectedOcrText ?? []).length;
        if (!ocrPassed) {
          visualFailureMessage = `OCR visual proof failed for ${action.name}; expected ${JSON.stringify(action.expectedOcrText)}.`;
        }
      }

      let changedPixels: number | null = null;
      let diffPassed: boolean | null = null;
      if (action.compareWith && diffJsonPath && diffImagePath) {
        const beforeEntry = visualEvidenceById(visualEvidence).get(action.compareWith);
        if (!beforeEntry?.absolutePath) throw new Error(`Missing visual comparison baseline ${action.compareWith}.`);
        changedPixels = compareImages(beforeEntry.absolutePath, screenshotPath, diffImagePath);
        const threshold = action.minChangedPixels ?? 1;
        diffPassed = changedPixels >= threshold;
        writeJson(diffJsonPath, {
          after: relativePath,
          before: beforeEntry.relativePath,
          changedPixels,
          diffImagePath: relativeToOutput(options, diffImagePath),
          passed: diffPassed,
          threshold,
          visualProofId: action.visualProofId ?? null,
        });
        if (!diffPassed) {
          visualFailureMessage = `Pixel-diff visual proof failed for ${action.name}; changed=${changedPixels}, threshold=${threshold}.`;
        }
      }

      visualEvidence.push({
        absolutePath: screenshotPath,
        compareWith: action.compareWith ?? null,
        diff: {
          changedPixels,
          diffPath: diffJsonPath ? relativeToOutput(options, diffJsonPath) : null,
          passed: diffPassed,
          threshold: action.minChangedPixels ?? null,
        },
        dimensions,
        expectedOcrText: action.expectedOcrText ?? [],
        hash,
        ocr: {
          matchedText,
          passed: ocrPassed,
          required: Boolean(action.ocrRequired),
          textPath: ocrTextPath ? relativeToOutput(options, ocrTextPath) : null,
        },
        phase: action.phase ?? null,
        processId: action.processId ?? null,
        proofPlanId: scenario.id.startsWith("PU-PROC-") ? `PU-PROOF-${scenario.processIds[0]}` : null,
        relativePath,
        scenarioId: scenario.id,
        screenshotName: action.name,
        status: visualFailureMessage ? "failed" : action.visibleProof ? "passed" : "warning",
        stepId,
        thumbnailPath: relativeToOutput(options, thumbnailPath),
        visualProofId: action.visualProofId ?? null,
      });
      if (visualFailureMessage) throw new Error(visualFailureMessage);
      record(action.visibleProof ? "passed" : "warning", relativePath);
      return;
    }

    if (action.action === "trace") {
      record("passed", action.label);
      return;
    }
  } catch (error) {
    record("failed", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

function dryRunArtifacts(options: RunnerOptions, events: RunEvent[]) {
  const model = buildProcessUniverseCaptureModel();
  const validation = validateProcessUniverseCaptureModel(model);
  const screenshotIndex = plannedScreenshotIndex(model, options);
  const screenshotIndexErrors = validateVisualEvidenceDedupe(screenshotIndex);
  for (const message of screenshotIndexErrors) validation.errors.push(message);
  const scenarios = model.deepProofScenarios.map((scenario) => ({
    actor: scenario.actor,
    apiEndpoints: scenario.apiEndpoints,
    expectedOutputs: scenario.expectedOutputs,
    id: scenario.id,
    negativeProof: scenario.negativeProof,
    positiveProof: scenario.positiveProof,
    processIds: scenario.processIds,
    routeCount: scenario.routes.length,
    rowCount: processUniverseRowsForScenario(scenario).length,
    status: "dry_run" satisfies ScenarioStatus,
    statusExpectation: scenario.statusExpectation,
    steps: scenario.steps.map((step) => ({
      actionCount: step.actions.length,
      id: step.id,
      processStepIds: step.processStepIds,
      screenshotNames: step.actions.filter((action) => action.action === "screenshot").map((action) => action.name),
    })),
  }));

  for (const scenario of model.deepProofScenarios) {
    for (const step of scenario.steps) {
      for (const action of step.actions) {
        events.push({
          action: action.action,
          detail: "Dry-run planned action; browser was not mutated.",
          scenarioId: scenario.id,
          status: "planned",
          stepId: step.id,
        });
      }
    }
  }
  for (const scenario of model.processCoverageScenarios.filter((candidate) => candidate.coverageStatus !== "deep_executable")) {
    if (scenario.proofPlan) {
      for (const step of scenario.steps) {
        for (const action of step.actions) {
          events.push({
            action: action.action,
            detail: `Dry-run planned proof action for ${scenario.proofPlan.proofPlanId}; browser/API was not mutated.`,
            scenarioId: scenario.id,
            status: "planned",
            stepId: step.id,
          });
        }
      }
    } else {
      events.push({
        action: "coverage-gap",
        detail: scenario.gapReasons.join(", "),
        scenarioId: scenario.id,
        status: "planned",
        stepId: scenario.coveredStepIds[0] ?? scenario.processId,
      });
    }
  }
  const authorityLedger = authorityLedgerForCoverage(model.processCoverageScenarios);
  const executedProofActions = executedProofActionsFromEvents(events, model.processCoverageScenarios);
  const projectionWave1Delta = projectionWaveDelta(model.processCoverageScenarios, [], "wave_1");
  const projectionWave2Delta = projectionWaveDelta(model.processCoverageScenarios, [], "wave_2");
  const projectionWave3Delta = projectionWaveDelta(model.processCoverageScenarios, [], "wave_3");
  const projectionWave4Delta = projectionWaveDelta(model.processCoverageScenarios, [], "wave_4");
  const projectionWave5Delta = projectionWaveDelta(model.processCoverageScenarios, [], "wave_5");
  const projectionWave6Delta = projectionWaveDelta(model.processCoverageScenarios, [], "wave_6");
  const projectionWave7Delta = projectionWaveDelta(model.processCoverageScenarios, [], "wave_7");
  const gapEntries = gapEntriesForProcessCoverage(model.processCoverageScenarios);
  const ledgerDedupeErrors = validateLedgerDedupe({ authorityLedger, coverage: model.processCoverageScenarios, gapEntries });
  for (const message of ledgerDedupeErrors) validation.errors.push(message);
  const validationOk = validation.ok && screenshotIndexErrors.length === 0 && ledgerDedupeErrors.length === 0;

  writeJson(path.join(options.outputDir, "coverage-ledger.json"), {
    allProcessCoverage: model.processCoverageScenarios,
    auditSummary: model.auditSummary,
    authorityLedger,
    coverageSummary: processCoverageSummary(model.processCoverageScenarios),
    deepProofScenarios: scenarios,
    dryRun: true,
    scenarios,
    sourceArtifacts: model.sourceArtifacts,
    projectionWave1Delta,
    projectionWave2Delta,
    projectionWave3Delta,
    projectionWave4Delta,
    projectionWave5Delta,
    projectionWave6Delta,
    projectionWave7Delta,
    validation: { ...validation, ok: validationOk },
  });
  writeJson(path.join(options.outputDir, "state-ledger.json"), {
    dryRun: true,
    events,
    executedProofActions,
    screenshotIndexPath: "screenshot-index.json",
    stateKeys: [],
    tracePath: "trace.zip planned for live runs",
  });
  writeJson(path.join(options.outputDir, "authority-ledger.json"), {
    authorityLedger,
    dryRun: true,
  });
  writeJson(path.join(options.outputDir, "gap-register.json"), {
    gaps: [
      ...validation.errors.map((message) => ({ severity: "error", message })),
      ...validation.warnings.map((message) => ({ severity: "warning", message })),
      ...ledgerDedupeErrors.map((message) => ({ severity: "error", message })),
      ...gapEntries,
    ],
  });
  writeJson(path.join(options.outputDir, "index.json"), {
    authorityLedgerCount: authorityLedger.length,
    baseUrl: options.baseUrl,
    dryRun: true,
    ok: validationOk,
    outputDir: options.outputDir,
    processCoverageCount: model.processCoverageScenarios.length,
    projectionWave1Delta,
    projectionWave2Delta,
    projectionWave3Delta,
    projectionWave4Delta,
    projectionWave5Delta,
    projectionWave6Delta,
    projectionWave7Delta,
    runId: options.runId,
    scenarioCount: scenarios.length,
    screenshotIndexPath: "screenshot-index.json",
    visualEvidenceDedupeErrors: screenshotIndexErrors,
    ledgerDedupeErrors,
  });
  writeScreenshotIndex(options, screenshotIndex, "Process-Universe Screenshot Index Dry Run");
  writeText(
    path.join(options.outputDir, "index.md"),
    [
      "# Process-Universe Capture Dry Run",
      "",
      `Run: ${options.runId}`,
      `Base URL: ${options.baseUrl}`,
      `Validation: ${validationOk ? "PASS" : "FAIL"}`,
      "",
      "| Scenario | Status | Process Rows | Routes |",
      "| --- | --- | ---: | ---: |",
      ...scenarios.map((scenario) => `| ${scenario.id} | dry_run | ${scenario.rowCount} | ${scenario.routeCount} |`),
      "",
      "## All-P0 Process Coverage",
      "",
      `Processes: ${model.processCoverageScenarios.length}`,
      `Steps: ${model.processCoverageScenarios.reduce((sum, scenario) => sum + scenario.totalStepCount, 0)}`,
      `Authority ledger rows: ${authorityLedger.length}`,
      "",
      "## Projection Wave 1",
      "",
      `Selected: ${projectionWave1Delta.selected}`,
      "Passed: 0",
      `Still API-only: ${projectionWave1Delta.selected}`,
      "",
      "## Projection Wave 2",
      "",
      `Selected: ${projectionWave2Delta.selected}`,
      "Passed: 0",
      `Still API-only: ${projectionWave2Delta.selected}`,
      "",
      "## Projection Wave 3",
      "",
      `Selected: ${projectionWave3Delta.selected}`,
      "Passed: 0",
      `Still API-only: ${projectionWave3Delta.selected}`,
      "",
      "## Projection Wave 4",
      "",
      `Selected: ${projectionWave4Delta.selected}`,
      "Passed: 0",
      `Still API-only: ${projectionWave4Delta.selected}`,
      "",
      "## Projection Wave 5",
      "",
      `Selected: ${projectionWave5Delta.selected}`,
      "Passed: 0",
      `Still API-only: ${projectionWave5Delta.selected}`,
      "",
      "## Projection Wave 6",
      "",
      `Selected: ${projectionWave6Delta.selected}`,
      "Passed: 0",
      `Still API-only: ${projectionWave6Delta.selected}`,
      "",
      "## Projection Wave 7",
      "",
      `Selected: ${projectionWave7Delta.selected}`,
      "Passed: 0",
      `Still API-only: ${projectionWave7Delta.selected}`,
      "",
    ].join("\n"),
  );
}

function gapEntriesForProcessCoverage(scenarios: ProcessUniverseProcessCoverageScenario[]): GapEntry[] {
  return scenarios
    .filter((scenario) => scenario.coverageStatus !== "deep_executable" || scenario.gapReasons.length > 0)
    .map((scenario) => ({
      coverageStatus: scenario.coverageStatus,
      gapReasons: scenario.gapReasons,
      processId: scenario.processId,
      processName: scenario.processName,
      severity:
        scenario.coverageStatus === "api_executable" || scenario.coverageStatus === "visual_reference_only"
          ? "product-gap"
          : scenario.coverageStatus === "blocked_negative_only"
            ? "warning"
            : "gap",
    }));
}

async function liveRun(options: RunnerOptions, events: RunEvent[]) {
  assertVisualEvidenceTools();
  const model = buildProcessUniverseCaptureModel();
  const validation = validateProcessUniverseCaptureModel(model);
  if (!validation.ok) {
    throw new Error(`Process-Universe capture model is invalid: ${validation.errors.join("; ")}`);
  }

  let browser: Browser | undefined;
  const state: RunnerState = { values: {} };
  const visualEvidence: VisualEvidenceEntry[] = [];
  const scenarioResults: Array<{
    classificationAfter?: string;
    classificationBefore?: string;
    id: string;
    processIds: string[];
    proofPlanId?: string | null;
    rowCount: number;
    status: ScenarioStatus;
    statusExpectation: string;
  }> = [];

  try {
    browser = await chromium.launch({ headless: process.env.AVS_CAPTURE_HEADLESS !== "0" });
    const context = await browser.newContext({ baseURL: options.baseUrl, viewport: { height: 900, width: 1400 } });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    const page = await context.newPage();

    for (const scenario of model.deepProofScenarios) {
      let failed = false;
      for (const step of scenario.steps) {
        for (const action of step.actions) {
          try {
            await executeAction({ action, context, events, options, page, scenario, state, stepId: step.id, visualEvidence });
          } catch {
            failed = true;
            break;
          }
        }
        if (failed) break;
      }

      scenarioResults.push({
        id: scenario.id,
        processIds: scenario.processIds,
        rowCount: processUniverseRowsForScenario(scenario).length,
        status: failed
          ? "failed"
          : scenario.statusExpectation === "api_proven_not_ui_projected"
            ? "api_proven_not_ui_projected"
            : scenario.statusExpectation === "blocked_proof"
              ? "blocked_proof"
              : events.some((event) => event.scenarioId === scenario.id && event.status === "warning")
                ? "completed_with_warnings"
                : "passed",
        statusExpectation: scenario.statusExpectation,
      });
    }

    for (const coverageScenario of model.processCoverageScenarios) {
      const scenario = proofScenarioFromCoverage(coverageScenario);
      if (!scenario) continue;

      const actorJwt = await issueScenarioActorJwt(scenario.actor);
      state.values.__currentActorJwt = actorJwt;
      await applyAuthCookie(context, actorJwt);
      await applyDemoBrowserSession(context, page, scenario.actor);

      let failed = false;
      for (const step of scenario.steps) {
        for (const action of step.actions) {
          try {
            await executeAction({ action, context, events, options, page, scenario, state, stepId: step.id, visualEvidence });
          } catch {
            failed = true;
            break;
          }
        }
        if (failed) break;
      }

      const visualProofFailed = Boolean(coverageScenario.projectionWave) && !visualEvidencePassedForScenario(scenario.id, visualEvidence);

      scenarioResults.push({
        classificationAfter: coverageScenario.classificationAfter,
        classificationBefore: coverageScenario.classificationBefore,
        id: scenario.id,
        processIds: scenario.processIds,
        proofPlanId: coverageScenario.proofPlanId,
        rowCount: coverageScenario.totalStepCount,
        status: failed || visualProofFailed
          ? "failed"
          : scenario.statusExpectation === "api_proven_not_ui_projected"
            ? "api_proven_not_ui_projected"
            : scenario.statusExpectation === "blocked_proof"
              ? "blocked_proof"
              : "passed",
        statusExpectation: scenario.statusExpectation,
      });
    }

    await context.tracing.stop({ path: path.join(options.outputDir, "trace.zip") });
    await context.close();
  } finally {
    await browser?.close();
  }

  const failedCount = scenarioResults.filter((result) => result.status === "failed").length;
  const visualEvidenceDedupeErrors = validateVisualEvidenceDedupe(visualEvidence);
  const finalizedCoverage = coverageWithLiveProjectionResults(model.processCoverageScenarios, scenarioResults);
  const authorityLedger = authorityLedgerForCoverage(finalizedCoverage);
  const executedProofActions = executedProofActionsFromEvents(events, finalizedCoverage);
  const projectionWave1Delta = projectionWaveDelta(finalizedCoverage, scenarioResults, "wave_1");
  const projectionWave2Delta = projectionWaveDelta(finalizedCoverage, scenarioResults, "wave_2");
  const projectionWave3Delta = projectionWaveDelta(finalizedCoverage, scenarioResults, "wave_3");
  const projectionWave4Delta = projectionWaveDelta(finalizedCoverage, scenarioResults, "wave_4");
  const projectionWave5Delta = projectionWaveDelta(finalizedCoverage, scenarioResults, "wave_5");
  const projectionWave6Delta = projectionWaveDelta(finalizedCoverage, scenarioResults, "wave_6");
  const projectionWave7Delta = projectionWaveDelta(finalizedCoverage, scenarioResults, "wave_7");
  const gapEntries = gapEntriesForProcessCoverage(finalizedCoverage);
  const ledgerDedupeErrors = validateLedgerDedupe({ authorityLedger, coverage: finalizedCoverage, gapEntries });
  writeJson(path.join(options.outputDir, "coverage-ledger.json"), {
    allProcessCoverage: finalizedCoverage,
    auditSummary: model.auditSummary,
    authorityLedger,
    coverageSummary: processCoverageSummary(finalizedCoverage),
    deepProofScenarios: scenarioResults,
    dryRun: false,
    projectionWave1Delta,
    projectionWave2Delta,
    projectionWave3Delta,
    projectionWave4Delta,
    projectionWave5Delta,
    projectionWave6Delta,
    projectionWave7Delta,
    scenarios: scenarioResults,
    sourceArtifacts: model.sourceArtifacts,
    validation,
    visualEvidenceDedupeErrors,
    ledgerDedupeErrors,
  });
  writeJson(path.join(options.outputDir, "state-ledger.json"), {
    dryRun: false,
    events,
    executedProofActions,
    screenshotIndexPath: "screenshot-index.json",
    stateKeys: Object.keys(state.values).sort(),
    tracePath: "trace.zip",
    visualEvidenceSummary: {
      dedupeErrors: visualEvidenceDedupeErrors,
      ledgerDedupeErrors,
      failed: visualEvidence.filter((entry) => entry.status === "failed").length,
      passed: visualEvidence.filter((entry) => entry.status === "passed").length,
      total: visualEvidence.length,
    },
  });
  writeJson(path.join(options.outputDir, "authority-ledger.json"), {
    authorityLedger,
    dryRun: false,
  });
  writeJson(path.join(options.outputDir, "gap-register.json"), {
    gaps: [
      ...validation.warnings.map((message) => ({ severity: "warning", message })),
      ...visualEvidenceDedupeErrors.map((message) => ({ severity: "error", message })),
      ...ledgerDedupeErrors.map((message) => ({ severity: "error", message })),
      ...scenarioResults
        .filter((scenario) => scenario.status === "api_proven_not_ui_projected")
        .map((scenario) => ({
          message: `${scenario.id} proved API state without claiming visible UI projection.`,
          severity: "product-gap",
        })),
      ...gapEntries,
    ],
  });
  writeJson(path.join(options.outputDir, "index.json"), {
    authorityLedgerCount: authorityLedger.length,
    baseUrl: options.baseUrl,
    dryRun: false,
    failedCount,
    ok: failedCount === 0 && visualEvidenceDedupeErrors.length === 0 && ledgerDedupeErrors.length === 0,
    outputDir: options.outputDir,
    processCoverageCount: finalizedCoverage.length,
    projectionWave1Delta,
    projectionWave2Delta,
    projectionWave3Delta,
    projectionWave4Delta,
    projectionWave5Delta,
    projectionWave6Delta,
    projectionWave7Delta,
    runId: options.runId,
    scenarioCount: scenarioResults.length,
    screenshotIndexPath: "screenshot-index.json",
    visualEvidenceDedupeErrors,
    ledgerDedupeErrors,
  });
  writeScreenshotIndex(options, visualEvidence, "Process-Universe Screenshot Index");
  writeText(
    path.join(options.outputDir, "index.md"),
    [
      "# Process-Universe Capture Run",
      "",
      `Run: ${options.runId}`,
      `Base URL: ${options.baseUrl}`,
      `Status: ${failedCount === 0 ? "PASS" : "FAIL"}`,
      `Screenshot index: [screenshot-index.md](screenshot-index.md)`,
      `Visual dedupe: ${visualEvidenceDedupeErrors.length === 0 ? "PASS" : "FAIL"}`,
      `Ledger dedupe: ${ledgerDedupeErrors.length === 0 ? "PASS" : "FAIL"}`,
      "",
      "| Scenario | Status | Process Rows |",
      "| --- | --- | ---: |",
      ...scenarioResults.map((scenario) => `| ${scenario.id} | ${scenario.status} | ${scenario.rowCount} |`),
      "",
      "## All-P0 Process Coverage",
      "",
      `Processes: ${finalizedCoverage.length}`,
      `Steps: ${finalizedCoverage.reduce((sum, scenario) => sum + scenario.totalStepCount, 0)}`,
      "",
      "## Projection Wave 1",
      "",
      `Selected: ${projectionWave1Delta.selected}`,
      `Passed: ${projectionWave1Delta.passed}`,
      `Failed: ${projectionWave1Delta.failed}`,
      `Still API-only: ${projectionWave1Delta.stillApiOnly}`,
      "",
      "## Projection Wave 2",
      "",
      `Selected: ${projectionWave2Delta.selected}`,
      `Passed: ${projectionWave2Delta.passed}`,
      `Failed: ${projectionWave2Delta.failed}`,
      `Still API-only: ${projectionWave2Delta.stillApiOnly}`,
      "",
      "## Projection Wave 3",
      "",
      `Selected: ${projectionWave3Delta.selected}`,
      `Passed: ${projectionWave3Delta.passed}`,
      `Failed: ${projectionWave3Delta.failed}`,
      `Still API-only: ${projectionWave3Delta.stillApiOnly}`,
      "",
      "## Projection Wave 4",
      "",
      `Selected: ${projectionWave4Delta.selected}`,
      `Passed: ${projectionWave4Delta.passed}`,
      `Failed: ${projectionWave4Delta.failed}`,
      `Still API-only: ${projectionWave4Delta.stillApiOnly}`,
      "",
      "## Projection Wave 5",
      "",
      `Selected: ${projectionWave5Delta.selected}`,
      `Passed: ${projectionWave5Delta.passed}`,
      `Failed: ${projectionWave5Delta.failed}`,
      `Still API-only: ${projectionWave5Delta.stillApiOnly}`,
      "",
      "## Projection Wave 6",
      "",
      `Selected: ${projectionWave6Delta.selected}`,
      `Passed: ${projectionWave6Delta.passed}`,
      `Failed: ${projectionWave6Delta.failed}`,
      `Still API-only: ${projectionWave6Delta.stillApiOnly}`,
      "",
      "## Projection Wave 7",
      "",
      `Selected: ${projectionWave7Delta.selected}`,
      `Passed: ${projectionWave7Delta.passed}`,
      `Failed: ${projectionWave7Delta.failed}`,
      `Still API-only: ${projectionWave7Delta.stillApiOnly}`,
      "",
      "## Visual Evidence",
      "",
      `Screenshots indexed: ${visualEvidence.length}`,
      `Dedupe errors: ${visualEvidenceDedupeErrors.length}`,
      `Ledger dedupe errors: ${ledgerDedupeErrors.length}`,
      "",
    ].join("\n"),
  );

  if (failedCount > 0 || visualEvidenceDedupeErrors.length > 0 || ledgerDedupeErrors.length > 0) {
    throw new Error(
      `Process-Universe live capture failed: scenarios=${failedCount}, visualDedupe=${visualEvidenceDedupeErrors.length}, ledgerDedupe=${ledgerDedupeErrors.length}.`,
    );
  }
}

async function main() {
  const options: RunnerOptions = {
    baseUrl,
    dryRun,
    outputDir,
    runId,
  };
  ensureDir(options.outputDir);

  const events: RunEvent[] = [];
  if (options.dryRun) {
    dryRunArtifacts(options, events);
  } else {
    await liveRun(options, events);
  }

  writeJson(path.join(options.outputDir, "run-log.json"), {
    baseUrl: options.baseUrl,
    dryRun: options.dryRun,
    eventCount: events.length,
    generatedAt: new Date().toISOString(),
    outputDir: options.outputDir,
    runId: options.runId,
  });
  console.log(JSON.stringify({ dryRun: options.dryRun, outputDir: options.outputDir, runId: options.runId }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
