import { chromium, type Browser, type BrowserContext, type Locator, type Page } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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
  const token = "tokenRef" in action && action.tokenRef ? state.values[action.tokenRef] : undefined;
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
  ]);
}

function scenarioDir(options: RunnerOptions, scenario: ProcessUniverseCaptureScenario) {
  return path.join(options.outputDir, scenario.id);
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
}) {
  const { action, context, events, options, page, scenario, state, stepId } = input;

  const record = (status: ActionStatus, detail: string) => {
    events.push({ action: action.action, detail, scenarioId: scenario.id, status, stepId });
  };

  try {
    if (action.action === "goto") {
      await page.goto(new URL(action.route, options.baseUrl).toString(), { waitUntil: "load", timeout: 20_000 });
      await page.getByText("Loading workspace").waitFor({ state: "hidden", timeout: 5_000 }).catch(() => undefined);
      record("passed", action.route);
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
      record(action.visibleProof ? "passed" : "warning", path.relative(options.outputDir, screenshotPath));
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
    events.push({
      action: "coverage-gap",
      detail: scenario.gapReasons.join(", "),
      scenarioId: scenario.id,
      status: "planned",
      stepId: scenario.coveredStepIds[0] ?? scenario.processId,
    });
  }

  writeJson(path.join(options.outputDir, "coverage-ledger.json"), {
    allProcessCoverage: model.processCoverageScenarios,
    auditSummary: model.auditSummary,
    coverageSummary: processCoverageSummary(model.processCoverageScenarios),
    deepProofScenarios: scenarios,
    dryRun: true,
    scenarios,
    sourceArtifacts: model.sourceArtifacts,
    validation,
  });
  writeJson(path.join(options.outputDir, "state-ledger.json"), {
    dryRun: true,
    events,
    stateKeys: [],
    tracePath: "trace.zip planned for live runs",
  });
  writeJson(path.join(options.outputDir, "gap-register.json"), {
    gaps: [
      ...validation.errors.map((message) => ({ severity: "error", message })),
      ...validation.warnings.map((message) => ({ severity: "warning", message })),
      ...gapEntriesForProcessCoverage(model.processCoverageScenarios),
    ],
  });
  writeJson(path.join(options.outputDir, "index.json"), {
    baseUrl: options.baseUrl,
    dryRun: true,
    ok: validation.ok,
    outputDir: options.outputDir,
    processCoverageCount: model.processCoverageScenarios.length,
    runId: options.runId,
    scenarioCount: scenarios.length,
  });
  writeText(
    path.join(options.outputDir, "index.md"),
    [
      "# Process-Universe Capture Dry Run",
      "",
      `Run: ${options.runId}`,
      `Base URL: ${options.baseUrl}`,
      `Validation: ${validation.ok ? "PASS" : "FAIL"}`,
      "",
      "| Scenario | Status | Process Rows | Routes |",
      "| --- | --- | ---: | ---: |",
      ...scenarios.map((scenario) => `| ${scenario.id} | dry_run | ${scenario.rowCount} | ${scenario.routeCount} |`),
      "",
      "## All-P0 Process Coverage",
      "",
      `Processes: ${model.processCoverageScenarios.length}`,
      `Steps: ${model.processCoverageScenarios.reduce((sum, scenario) => sum + scenario.totalStepCount, 0)}`,
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
  const model = buildProcessUniverseCaptureModel();
  const validation = validateProcessUniverseCaptureModel(model);
  if (!validation.ok) {
    throw new Error(`Process-Universe capture model is invalid: ${validation.errors.join("; ")}`);
  }

  let browser: Browser | undefined;
  const state: RunnerState = { values: {} };
  const scenarioResults: Array<{
    id: string;
    processIds: string[];
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
            await executeAction({ action, context, events, options, page, scenario, state, stepId: step.id });
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

    await context.tracing.stop({ path: path.join(options.outputDir, "trace.zip") });
    await context.close();
  } finally {
    await browser?.close();
  }

  const failedCount = scenarioResults.filter((result) => result.status === "failed").length;
  writeJson(path.join(options.outputDir, "coverage-ledger.json"), {
    allProcessCoverage: model.processCoverageScenarios,
    auditSummary: model.auditSummary,
    coverageSummary: processCoverageSummary(model.processCoverageScenarios),
    deepProofScenarios: scenarioResults,
    dryRun: false,
    scenarios: scenarioResults,
    sourceArtifacts: model.sourceArtifacts,
    validation,
  });
  writeJson(path.join(options.outputDir, "state-ledger.json"), {
    dryRun: false,
    events,
    stateKeys: Object.keys(state.values).sort(),
    tracePath: "trace.zip",
  });
  writeJson(path.join(options.outputDir, "gap-register.json"), {
    gaps: [
      ...validation.warnings.map((message) => ({ severity: "warning", message })),
      ...scenarioResults
        .filter((scenario) => scenario.status === "api_proven_not_ui_projected")
        .map((scenario) => ({
          message: `${scenario.id} proved API state without claiming visible UI projection.`,
          severity: "product-gap",
        })),
      ...gapEntriesForProcessCoverage(model.processCoverageScenarios),
    ],
  });
  writeJson(path.join(options.outputDir, "index.json"), {
    baseUrl: options.baseUrl,
    dryRun: false,
    failedCount,
    ok: failedCount === 0,
    outputDir: options.outputDir,
    processCoverageCount: model.processCoverageScenarios.length,
    runId: options.runId,
    scenarioCount: scenarioResults.length,
  });
  writeText(
    path.join(options.outputDir, "index.md"),
    [
      "# Process-Universe Capture Run",
      "",
      `Run: ${options.runId}`,
      `Base URL: ${options.baseUrl}`,
      `Status: ${failedCount === 0 ? "PASS" : "FAIL"}`,
      "",
      "| Scenario | Status | Process Rows |",
      "| --- | --- | ---: |",
      ...scenarioResults.map((scenario) => `| ${scenario.id} | ${scenario.status} | ${scenario.rowCount} |`),
      "",
      "## All-P0 Process Coverage",
      "",
      `Processes: ${model.processCoverageScenarios.length}`,
      `Steps: ${model.processCoverageScenarios.reduce((sum, scenario) => sum + scenario.totalStepCount, 0)}`,
      "",
    ].join("\n"),
  );
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
