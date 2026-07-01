import { chromium, type Browser, type BrowserContext, type Locator, type Page } from "@playwright/test";
import { copyFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";

import type {
  ProcessUniverseCaptureAction,
  ProcessUniverseCaptureLocator,
  ProcessUniverseCaptureScenario,
} from "@/lib/process-universe-capture-model";

import {
  beforeJourney,
  setupBrowserContext,
} from "../project-adapter";
import {
  storyboardForJourney,
  transcriptForJourney,
  type ScreencastEvent,
  writeSrt,
} from "./artifacts";
import type { ScreencastJourney } from "./contract";
import { ensureDir, writeJson, writeText } from "./io";

type RunnerState = {
  values: Record<string, unknown>;
};

function delayFor(journey: ScreencastJourney) {
  return journey.speedProfile === "human-demo" ? 720 : 80;
}

async function settleForSpeed(page: Page, journey: ScreencastJourney, multiplier = 1) {
  await page.waitForTimeout(delayFor(journey) * multiplier);
}

type JourneyRunInput = {
  baseUrl: string;
  journey: ScreencastJourney;
  outputDir: string;
  scenario: ProcessUniverseCaptureScenario;
  viewport: {
    height: number;
    width: number;
  };
};

function locatorFor(page: Page, locator: ProcessUniverseCaptureLocator): Locator {
  if (locator.kind === "label") return page.getByLabel(locator.value);
  if (locator.kind === "placeholder") return page.getByPlaceholder(locator.value);
  if (locator.kind === "role") return page.getByRole(locator.role, { name: locator.name });
  if (locator.kind === "selector") return page.locator(locator.value);
  if (locator.kind === "testId") return page.getByTestId(locator.value);
  return page.getByText(locator.value);
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
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, resolveBody(entry, state)]));
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

async function apiRequest(action: Extract<ProcessUniverseCaptureAction, { action: "api" | "expectBlocked" }>, state: RunnerState, baseUrl: string) {
  const endpoint = resolveTemplate(action.endpoint, state);
  const url = new URL(endpoint, baseUrl);
  const token = "tokenRef" in action && action.tokenRef ? state.values[action.tokenRef] : undefined;
  const headers: Record<string, string> = { accept: "application/json" };
  if (action.method === "POST") headers["content-type"] = "application/json";
  if (typeof token === "string") headers.authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    body: action.method === "POST" ? JSON.stringify(resolveBody(action.body ?? {}, state)) : undefined,
    headers,
    method: action.method,
  });

  return {
    body: await response.json().catch(() => null),
    status: response.status,
  };
}

async function applyAuthCookie(context: BrowserContext, token: string, baseUrl: string) {
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

function jwtStateKeyForRole(roleKey: string) {
  return `${roleKey.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())}Jwt`;
}

async function bootstrapScenarioAuth(input: {
  baseUrl: string;
  context: BrowserContext;
  scenario: ProcessUniverseCaptureScenario;
  state: RunnerState;
}) {
  const tokenRefs = new Set(
    input.scenario.steps.flatMap((step) =>
      step.actions.flatMap((action) => ("tokenRef" in action && action.tokenRef ? [action.tokenRef] : [])),
    ),
  );
  if (tokenRefs.size === 0) return;

  const response = await fetch(new URL("/api/auth/mfa/verify", input.baseUrl), {
    body: JSON.stringify({
      code: "123456",
      email: input.scenario.actor.email,
      providerId: "db-user-jwt",
      roleKey: input.scenario.actor.roleKey,
      tenantSlug: input.scenario.actor.tenantSlug,
    }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  const body = (await response.json().catch(() => null)) as { jwt?: string };
  if (!response.ok || !body?.jwt) {
    throw new Error(`Could not bootstrap JWT for ${input.scenario.id}: ${JSON.stringify(body)}`);
  }

  const preferredKey = jwtStateKeyForRole(input.scenario.actor.roleKey);
  for (const tokenRef of tokenRefs) input.state.values[tokenRef] = body.jwt;
  input.state.values[preferredKey] = body.jwt;
  await applyAuthCookie(input.context, body.jwt, input.baseUrl);
}

async function injectCursor(page: Page) {
  await page.addStyleTag({
    content:
      "#codex-screencast-cursor{position:fixed;z-index:2147483647;width:18px;height:18px;border:2px solid #f8d46a;border-radius:50%;background:rgba(24,24,24,.16);box-shadow:0 0 0 4px rgba(248,212,106,.22);pointer-events:none;transform:translate(-50%,-50%);transition:left .18s ease,top .18s ease}",
  }).catch(() => undefined);
  await page.evaluate(() => {
    if (document.getElementById("codex-screencast-cursor")) return;
    const cursor = document.createElement("div");
    cursor.id = "codex-screencast-cursor";
    cursor.style.left = "32px";
    cursor.style.top = "32px";
    document.body.appendChild(cursor);
  }).catch(() => undefined);
}

async function moveCursor(page: Page, locator: Locator) {
  const box = await locator.boundingBox().catch(() => null);
  if (!box) return;
  await page.evaluate(
    ({ x, y }) => {
      const cursor = document.getElementById("codex-screencast-cursor");
      if (!cursor) return;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    },
    { x: box.x + box.width / 2, y: box.y + box.height / 2 },
  );
  await page.waitForTimeout(160);
}

function valueCaptionForStep(input: {
  fallbackTitle: string;
  index: number;
  journey: ScreencastJourney;
}) {
  const rawCaption = input.journey.businessSteps[input.index] ?? input.fallbackTitle;
  if (/^(Audit value|Blocker reason|Decision value|Gate check|Governance check|Object-scope check|Outcome check|Recovery value|Role check|Safety check|Scope check|Search value|System check|User value):/.test(rawCaption)) {
    return rawCaption;
  }

  if (/\b(open|switch|return|move|enter|submit|attempt|start|load|filter|search|edit|save|request|approve)\b/i.test(rawCaption)) {
    return `User action: ${rawCaption}`;
  }
  if (/\b(internal draft.*absent|unreleased.*absent|draft text.*absent)\b/i.test(rawCaption)) {
    return `Safety check: ${rawCaption}`;
  }
  if (/\b(block|blocked|denied|invalid|missing|wrong-role|wrong role|fail-closed|fail closed|not expose|not release|not download|not share)\b/i.test(rawCaption)) {
    return `Blocker reason: ${rawCaption}`;
  }
  if (/\b(verify|confirm|observe|capture|check|review|audit|gate|scoped|scope|tenant|role|permission)\b/i.test(rawCaption)) {
    return `System check: ${rawCaption}`;
  }
  if (/\b(approve|release|download|result|ready|first workspace|client-safe|evidence sufficiency|recovery)\b/i.test(rawCaption)) {
    return `User value: ${rawCaption}`;
  }

  return `User action: ${rawCaption}`;
}

async function executeAction(input: {
  action: ProcessUniverseCaptureAction;
  baseUrl: string;
  context: BrowserContext;
  events: ScreencastEvent[];
  journey: ScreencastJourney;
  outputDir: string;
  page: Page;
  state: RunnerState;
  stepId: string;
}) {
  const { action, baseUrl, context, events, journey, outputDir, page, state, stepId } = input;
  const record = (status: ScreencastEvent["status"], detail: string) => {
    events.push({ action: action.action, detail, journeyId: journey.id, status, stepId });
  };

  try {
    if (action.action === "goto") {
      await page.goto(new URL(action.route, baseUrl).toString(), { waitUntil: "load", timeout: 25_000 });
      await injectCursor(page);
      await page.getByText("Loading workspace").waitFor({ state: "hidden", timeout: 5_000 }).catch(() => undefined);
      await settleForSpeed(page, journey, 1.5);
      record("passed", action.route);
      return;
    }

    if (action.action === "gotoByReplacingCurrentPath") {
      const current = new URL(page.url());
      if (!current.pathname.endsWith(action.fromSuffix)) {
        throw new Error(`Cannot replace path suffix ${action.fromSuffix}; current path is ${current.pathname}.`);
      }
      current.pathname = `${current.pathname.slice(0, -action.fromSuffix.length)}${action.toSuffix}`;
      await page.goto(current.toString(), { waitUntil: "load", timeout: 25_000 });
      await injectCursor(page);
      await page.getByText("Loading workspace").waitFor({ state: "hidden", timeout: 5_000 }).catch(() => undefined);
      await settleForSpeed(page, journey, 1.5);
      record("passed", current.pathname);
      return;
    }

    if (action.action === "fill") {
      const locator = locatorFor(page, action.locator).first();
      await moveCursor(page, locator);
      await locator.fill(action.value, { timeout: 7_500 });
      await settleForSpeed(page, journey);
      record("passed", `${action.locator.kind}`);
      return;
    }

    if (action.action === "select") {
      const locator = locatorFor(page, action.locator).first();
      await moveCursor(page, locator);
      await locator.selectOption(action.value, { timeout: 7_500 });
      await settleForSpeed(page, journey);
      record("passed", action.value);
      return;
    }

    if (action.action === "click") {
      const locator = locatorFor(page, action.locator).first();
      if (action.optional && (await locator.count()) === 0) {
        record("warning", "Optional click target missing.");
        return;
      }
      await moveCursor(page, locator);
      await locator.click({ timeout: 7_500 });
      await settleForSpeed(page, journey);
      record("passed", `${action.locator.kind}`);
      return;
    }

    if (action.action === "assertText") {
      await page.getByText(action.text).first().waitFor({ state: "visible", timeout: 7_500 });
      await settleForSpeed(page, journey, 0.5);
      record("passed", action.text);
      return;
    }

    if (action.action === "assertNotText") {
      const count = await page.getByText(action.text, { exact: false }).count();
      if (count > 0) throw new Error(`Forbidden text is visible: ${action.text}`);
      await settleForSpeed(page, journey, 0.5);
      record("passed", action.text);
      return;
    }

    if (action.action === "api") {
      const result = await apiRequest(action, state, baseUrl);
      if (result.status !== action.expectStatus) {
        throw new Error(`Expected ${action.expectStatus}, received ${result.status}: ${JSON.stringify(result.body)}`);
      }
      if (action.saveAs) state.values[action.saveAs] = result.body;
      for (const extraction of action.extract ?? []) {
        const extracted = readPath(result.body, extraction.path);
        if (extracted === undefined) throw new Error(`Missing API extraction ${extraction.path}.`);
        state.values[extraction.as] = extracted;
        if (typeof extracted === "string" && extraction.as.toLowerCase().includes("jwt")) {
          await applyAuthCookie(context, extracted, baseUrl);
        }
      }
      await settleForSpeed(page, journey, 0.75);
      record("passed", `${action.method} ${action.endpoint}`);
      return;
    }

    if (action.action === "expectBlocked") {
      const result = await apiRequest(action, state, baseUrl);
      if (result.status !== action.expectStatus) {
        throw new Error(`Expected blocked status ${action.expectStatus}, received ${result.status}: ${JSON.stringify(result.body)}`);
      }
      if (action.expectIssue && !containsValue(result.body, action.expectIssue)) {
        throw new Error(`Blocked response did not contain issue ${action.expectIssue}: ${JSON.stringify(result.body)}`);
      }
      if (action.saveAs) state.values[action.saveAs] = result.body;
      await settleForSpeed(page, journey, 0.75);
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
      await settleForSpeed(page, journey, 0.5);
      record("passed", `${action.sourceRef}.${action.path}`);
      return;
    }

    if (action.action === "screenshot") {
      const screenshotDir = path.join(outputDir, "screenshots");
      ensureDir(screenshotDir);
      const screenshotPath = path.join(screenshotDir, `${action.name}.png`);
      await page.screenshot({ fullPage: true, path: screenshotPath });
      await settleForSpeed(page, journey);
      record(action.visibleProof ? "passed" : "warning", path.relative(outputDir, screenshotPath));
      return;
    }

    if (action.action === "trace") {
      await settleForSpeed(page, journey, 0.5);
      record("passed", action.label);
      return;
    }
  } catch (error) {
    record("failed", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

function browserLaunchOptions() {
  const executablePath = process.env.SCREENCAST_BROWSER;
  const channel = process.env.SCREENCAST_BROWSER_CHANNEL;
  return {
    channel: executablePath ? undefined : channel,
    executablePath,
    headless: process.env.SCREENCAST_HEADLESS !== "false",
  };
}

function copyRawVideo(videoDir: string, outputDir: string) {
  const videoFile = readdirSync(videoDir).find((file) => file.endsWith(".webm"));
  if (!videoFile) return null;
  const target = path.join(outputDir, "raw-video.webm");
  copyFileSync(path.join(videoDir, videoFile), target);
  return target;
}

export async function runExecutableJourney(input: JourneyRunInput) {
  ensureDir(input.outputDir);
  const events: ScreencastEvent[] = [];
  const captions: string[] = [];
  const videoDir = path.join(input.outputDir, ".video");
  ensureDir(videoDir);

  const provisioning = await beforeJourney({ journeyId: input.journey.id, outputDir: input.outputDir });
  writeJson(path.join(input.outputDir, "provisioning.json"), provisioning);

  const state: RunnerState = { values: {} };
  let browser: Browser | undefined;
  let failed: string | null = null;

  try {
    browser = await chromium.launch(browserLaunchOptions());
    const context = await browser.newContext({
      baseURL: input.baseUrl,
      recordVideo: { dir: videoDir, size: input.viewport },
      viewport: input.viewport,
    });
    await setupBrowserContext({ baseUrl: input.baseUrl, context });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    const page = await context.newPage();
    await bootstrapScenarioAuth({ baseUrl: input.baseUrl, context, scenario: input.scenario, state });

    for (const [index, step] of input.scenario.steps.entries()) {
      captions.push(valueCaptionForStep({ fallbackTitle: step.title, index, journey: input.journey }));
      for (const action of step.actions) {
        await executeAction({
          action,
          baseUrl: input.baseUrl,
          context,
          events,
          journey: input.journey,
          outputDir: input.outputDir,
          page,
          state,
          stepId: step.id,
        });
      }
    }

    await context.tracing.stop({ path: path.join(input.outputDir, "trace.zip") });
    await context.close();
  } catch (error) {
    failed = error instanceof Error ? error.message : String(error);
  } finally {
    await browser?.close();
  }

  const screenshotFiles = existsSync(path.join(input.outputDir, "screenshots"))
    ? readdirSync(path.join(input.outputDir, "screenshots")).filter((file) => file.endsWith(".png")).map((file) => `screenshots/${file}`)
    : [];
  const rawVideo = existsSync(videoDir) ? copyRawVideo(videoDir, input.outputDir) : null;
  const status = failed ? "failed" : events.some((event) => event.status === "warning") ? "passed_with_warnings" : "passed";

  writeJson(path.join(input.outputDir, "manifest.resolved.json"), {
    journey: input.journey,
    processUniverseScenario: input.scenario,
  });
  writeSrt(path.join(input.outputDir, "captions.srt"), captions);
  writeText(path.join(input.outputDir, "transcript.md"), transcriptForJourney({ captions, journey: input.journey }));
  writeText(path.join(input.outputDir, "storyboard.md"), storyboardForJourney({ events, journey: input.journey, screenshotFiles }));
  writeJson(path.join(input.outputDir, "run-log.json"), {
    baseUrl: input.baseUrl,
    events,
    failed,
    generatedAt: new Date().toISOString(),
    journeyId: input.journey.id,
    rawVideo: rawVideo ? "raw-video.webm" : null,
    screenshotCount: screenshotFiles.length,
    status,
  });
  writeJson(path.join(input.outputDir, "qa-result.json"), {
    artifactChecks: {
      captions: existsSync(path.join(input.outputDir, "captions.srt")),
      rawVideo: Boolean(rawVideo),
      screenshots: screenshotFiles.length,
      storyboard: existsSync(path.join(input.outputDir, "storyboard.md")),
      trace: existsSync(path.join(input.outputDir, "trace.zip")),
      transcript: existsSync(path.join(input.outputDir, "transcript.md")),
    },
    failed,
    status,
  });

  return { events, status };
}
