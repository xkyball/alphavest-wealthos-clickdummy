import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type Locator, type Page } from "@playwright/test";
import type {
  JourneyProvisioningResult,
  JourneyQaResult,
  RunnerOptions,
  ScreencastDefinitionFile,
  ScreencastInteraction,
  ScreencastJourney,
  ScreencastLocatorTarget,
  ScreencastSpeedProfileName,
  ScreencastStep,
  StepQaResult,
} from "@/scripts/screencast/lib/types";

const root = process.cwd();
const defaultDefinitionPath = path.join(root, "docs", "v3", "journeys.screencast.v3.json");
const outputRoot = path.join(root, "artifacts", "screencasts");
const viewport = { width: 1440, height: 960 };

type SpeedProfile = {
  name: ScreencastSpeedProfileName;
  routeLoadPauseMs: number;
  pointerMoveMs: number;
  afterActionPauseMs: number;
  typingDelayMs: number;
  importantPauseMs: number;
  readingPauseMs: number;
};

type PointerPosition = {
  x: number;
  y: number;
};

const speedProfiles: Record<ScreencastSpeedProfileName, SpeedProfile> = {
  "human-demo": {
    name: "human-demo",
    routeLoadPauseMs: 2200,
    pointerMoveMs: 1000,
    afterActionPauseMs: 1500,
    typingDelayMs: 70,
    importantPauseMs: 2600,
    readingPauseMs: 3200,
  },
  "qa-fast": {
    name: "qa-fast",
    routeLoadPauseMs: 220,
    pointerMoveMs: 80,
    afterActionPauseMs: 140,
    typingDelayMs: 5,
    importantPauseMs: 280,
    readingPauseMs: 360,
  },
};

type JourneyPaths = {
  journeyId: string;
  journeyDir: string;
  screenshotsDir: string;
  rawVideo: string;
  mp4: string;
  captions: string;
  runLog: string;
  qaResult: string;
  storyboard: string;
  transcript: string;
  metadata: string;
  resolvedManifest: string;
  trace: string;
  provisioning: string;
};

function delay(ms: number) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

function runStamp(date = new Date()) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[:]/g, "-");
}

function normalizeJourneyId(id: string) {
  return id.trim().toUpperCase().replace(/[^A-Z0-9-]+/g, "-");
}

export function buildRunRoot(options: RunnerOptions) {
  const runId = options.date?.trim() || runStamp();
  return path.join(outputRoot, "runs", runId);
}

function buildJourneyPaths(runRoot: string, journeyId: string): JourneyPaths {
  const normalizedId = normalizeJourneyId(journeyId);
  const journeyDir = path.join(runRoot, normalizedId);
  return {
    journeyId: normalizedId,
    journeyDir,
    screenshotsDir: path.join(journeyDir, "screenshots"),
    rawVideo: path.join(journeyDir, "raw-video.webm"),
    mp4: path.join(journeyDir, "journey.mp4"),
    captions: path.join(journeyDir, "captions.srt"),
    runLog: path.join(journeyDir, "run-log.json"),
    qaResult: path.join(journeyDir, "qa-result.json"),
    storyboard: path.join(journeyDir, "storyboard.md"),
    transcript: path.join(journeyDir, "transcript.md"),
    metadata: path.join(journeyDir, "metadata.json"),
    resolvedManifest: path.join(journeyDir, "manifest.resolved.json"),
    trace: path.join(journeyDir, "trace.zip"),
    provisioning: path.join(journeyDir, "provisioning.json"),
  };
}

function resolveManifestPath(manifestPath?: string) {
  const requestedPath = manifestPath?.trim() || process.env.SCREENCAST_MANIFEST || defaultDefinitionPath;
  return path.isAbsolute(requestedPath) ? requestedPath : path.join(root, requestedPath);
}

export async function loadDefinitions(manifestPath?: string) {
  const definitionPath = resolveManifestPath(manifestPath);
  const raw = await readFile(definitionPath, "utf8");
  const definitions = JSON.parse(raw) as ScreencastDefinitionFile;
  validateDefinitions(definitions);
  return definitions;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function targetLabel(target: ScreencastStep["target"]) {
  if (!target || target === "none") return "none";
  if (typeof target === "string") return target;
  return target.name ?? target.text ?? target.label ?? target.placeholder ?? target.testId ?? target.selector ?? "none";
}

function validateTarget(target: ScreencastStep["target"], field: string, errors: string[]) {
  if (!target || target === "none") return;
  if (typeof target === "string") {
    if (!target.trim()) errors.push(`${field} must be non-empty when provided.`);
    return;
  }
  const hasLocator = ["role", "selector", "text", "label", "placeholder", "testId"].some((key) =>
    isNonEmptyString(target[key as keyof ScreencastLocatorTarget])
  );
  if (!hasLocator) {
    errors.push(`${field} needs role, selector, text, label, placeholder or testId.`);
  }
}

export function validateDefinitions(definitions: ScreencastDefinitionFile) {
  const errors: string[] = [];
  if (!isPlainObject(definitions)) errors.push("Definition file must be an object.");
  if (!Array.isArray(definitions.journeys)) errors.push("journeys must be an array.");
  const requiresPortfolioMetadata = definitions.requiresPortfolioMetadata === true || definitions.portfolioLayer !== undefined;

  for (const journey of definitions.journeys ?? []) {
    if (!isNonEmptyString(journey.id)) errors.push("journey.id missing.");
    if (!isNonEmptyString(journey.name)) errors.push(`${journey.id}.name missing.`);
    if (requiresPortfolioMetadata) validatePortfolioJourney(journey, errors);
    if (!Array.isArray(journey.steps) || journey.steps.length === 0) {
      errors.push(`${journey.id}.steps must be a non-empty array.`);
      continue;
    }
    for (const step of journey.steps) {
      const prefix = `${journey.id}.steps[${step.step}]`;
      if (typeof step.step !== "number") errors.push(`${prefix}.step must be a number.`);
      if (!isNonEmptyString(step.route)) errors.push(`${prefix}.route missing.`);
      if (!isNonEmptyString(step.screen)) errors.push(`${prefix}.screen missing.`);
      if (!isNonEmptyString(step.action)) errors.push(`${prefix}.action missing.`);
      if (!isNonEmptyString(step.caption)) errors.push(`${prefix}.caption missing.`);
      if (step.navigation && !["goto", "continue"].includes(step.navigation)) {
        errors.push(`${prefix}.navigation must be goto or continue.`);
      }
      if (!Array.isArray(step.expectedVisibleText)) errors.push(`${prefix}.expectedVisibleText must be an array.`);
      if (step.dataRefs && !Array.isArray(step.dataRefs)) errors.push(`${prefix}.dataRefs must be an array.`);
      validateTarget(step.target, `${prefix}.target`, errors);
      validateInteraction(step.interaction, `${prefix}.interaction`, errors);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Screencast definition invalid:\n- ${errors.join("\n- ")}`);
  }
}

function validatePortfolioJourney(journey: ScreencastJourney, errors: string[]) {
  const prefix = `${journey.id}.portfolio`;
  const requiredStringFields: Array<keyof ScreencastJourney> = [
    "portfolioLayer",
    "candidateId",
    "demoPriority",
    "currentRealityLabel",
    "proofLevel",
    "overclaimRisk",
    "caveat",
    "captionShort",
    "captionLong",
  ];

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(journey[field])) errors.push(`${prefix}.${field} missing.`);
  }
  if (!Array.isArray(journey.proofPath) || journey.proofPath.length === 0) errors.push(`${prefix}.proofPath missing.`);
  if (!Array.isArray(journey.audienceFit) || journey.audienceFit.length === 0) errors.push(`${prefix}.audienceFit missing.`);
  if (!Array.isArray(journey.presenterNotes) || journey.presenterNotes.length === 0) errors.push(`${prefix}.presenterNotes missing.`);
  if (typeof journey.customerSendable !== "boolean") errors.push(`${prefix}.customerSendable must be boolean.`);
}

function validateInteraction(interaction: ScreencastInteraction | undefined, field: string, errors: string[]) {
  if (!interaction) return;
  if (!["none", "click", "fill", "select", "check", "press"].includes(interaction.type)) {
    errors.push(`${field}.type is unsupported.`);
  }
  if (interaction.type === "fill" && !isNonEmptyString(interaction.value)) {
    errors.push(`${field}.value is required for fill.`);
  }
  if (interaction.type === "select" && !isNonEmptyString(interaction.value)) {
    errors.push(`${field}.value is required for select.`);
  }
  if (interaction.type === "press" && !isNonEmptyString(interaction.key)) {
    errors.push(`${field}.key is required for press.`);
  }
}

export function parseRunnerOptions(args: string[]): RunnerOptions {
  const positional = args.filter((arg) => !arg.startsWith("--"));
  const speedArg = args.find((arg) => arg.startsWith("--speed="));
  const baseUrlArg = args.find((arg) => arg.startsWith("--base-url="));
  const dateArg = args.find((arg) => arg.startsWith("--date="));
  const manifestArg = args.find((arg) => arg.startsWith("--manifest="));
  const requestedSpeed = speedArg?.split("=")[1] as ScreencastSpeedProfileName | undefined;
  const envHeaded = process.env.SCREENCAST_HEADLESS === "false";
  const baseUrl =
    baseUrlArg?.split("=")[1] ?? process.env.BASE_URL ?? process.env.SCREENCAST_BASE_URL ?? "http://127.0.0.1:3000";
  const manifestPath = resolveManifestPath(manifestArg?.split("=")[1]);

  return {
    baseUrl,
    manifestPath,
    dryRun: args.includes("--dry-run"),
    headed: args.includes("--headed") || envHeaded,
    strict: args.includes("--strict") || process.env.STRICT_SCREENCAST === "true",
    skipProvisioning: args.includes("--skip-provisioning") || process.env.SCREENCAST_SKIP_PROVISIONING === "true",
    provisionOnly: args.includes("--provision-only"),
    speed: requestedSpeed === "qa-fast" ? "qa-fast" : "human-demo",
    date: dateArg?.split("=")[1],
    journeyId: positional[0]?.toUpperCase(),
  };
}

export function findJourney(definitions: ScreencastDefinitionFile, journeyId: string) {
  return definitions.journeys.find((journey) => journey.id.toUpperCase() === journeyId.toUpperCase());
}

export async function assertAppReachable(baseUrl: string) {
  const startedAt = Date.now();
  let detail = "timeout";

  while (Date.now() - startedAt < 20_000) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok || response.status < 500) return;
      detail = `received HTTP ${response.status}`;
    } catch (error) {
      detail = error instanceof Error ? error.message : String(error);
    }
    await delay(350);
  }

  throw new Error(
    `AlphaVest app is not reachable at ${baseUrl} (${detail}). Start it first, for example: pnpm dev --hostname 127.0.0.1 --port 3000`
  );
}

function findBrowserExecutable() {
  const candidates = [
    process.env.SCREENCAST_BROWSER,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean) as string[];

  return candidates.find((candidate) => existsSync(candidate));
}

async function launchBrowser(options: RunnerOptions) {
  const channel = process.env.SCREENCAST_BROWSER_CHANNEL ?? "chrome";
  const headless = !options.headed && process.env.SCREENCAST_HEADLESS !== "false";

  try {
    return await chromium.launch({ channel, headless });
  } catch (channelError) {
    const executablePath = findBrowserExecutable();
    if (!executablePath) throw channelError;
    return chromium.launch({ executablePath, headless });
  }
}

function findFfmpegBinary() {
  const candidates = [
    process.env.SCREENCAST_FFMPEG,
    "/opt/homebrew/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
    "/usr/bin/ffmpeg",
    "ffmpeg",
  ].filter(Boolean) as string[];

  return candidates.find((candidate) => candidate === "ffmpeg" || existsSync(candidate));
}

function ffmpegHasFilter(name: string) {
  const ffmpegBinary = findFfmpegBinary();
  if (!ffmpegBinary) return false;
  const result = spawnSync(ffmpegBinary, ["-hide_banner", "-filters"], { encoding: "utf8" });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  return output.includes(` ${name}`) || output.includes(` ${name} `);
}

function escapeFfmpegFilterPath(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll(":", "\\:").replaceAll("'", "\\'").replaceAll(",", "\\,");
}

export async function renderMp4WithCaptions(input: string, captions: string, output: string) {
  const ffmpegBinary = findFfmpegBinary();
  if (!ffmpegBinary) {
    throw new Error("ffmpeg is not available. Set SCREENCAST_FFMPEG or install ffmpeg before rendering MP4 captions.");
  }

  const canBurnCaptions = ffmpegHasFilter("subtitles");
  const captionStyle =
    "FontName=Arial,FontSize=10,PrimaryColour=&H00FFFFFF,OutlineColour=&H900B1220,BorderStyle=1,Outline=0.8,Shadow=0.25,Alignment=2,MarginV=52";
  const args = canBurnCaptions
    ? [
        "-y",
        "-i",
        input,
        "-vf",
        `fps=30,scale=1920:-2,subtitles='${escapeFfmpegFilterPath(captions)}':force_style='${captionStyle}',format=yuv420p`,
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-movflags",
        "+faststart",
        output,
      ]
    : [
        "-y",
        "-i",
        input,
        "-i",
        captions,
        "-map",
        "0:v:0",
        "-map",
        "1:0",
        "-vf",
        "fps=30,scale=1920:-2,format=yuv420p",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-c:s",
        "mov_text",
        "-metadata:s:s:0",
        "language=eng",
        "-metadata:s:s:0",
        "title=AlphaVest Journey Captions",
        "-movflags",
        "+faststart",
        output,
      ];

  await new Promise<void>((resolveProcess, rejectProcess) => {
    const ffmpeg = spawn(ffmpegBinary, args);
    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    ffmpeg.once("error", rejectProcess);
    ffmpeg.once("exit", (code) => {
      if (code === 0) {
        resolveProcess();
        return;
      }
      rejectProcess(new Error(`ffmpeg failed with code ${code}.\n${stderr}`));
    });
  });

  return canBurnCaptions ? "burned-in" : "embedded-track";
}

function resolveUrl(baseUrl: string, route: string) {
  return new URL(route, baseUrl).toString();
}

function locatorFromTarget(page: Page, target: ScreencastLocatorTarget | string): Locator {
  if (typeof target === "string") {
    return page.getByRole("button", { name: new RegExp(escapeRegex(target), "i") }).first();
  }
  if (target.selector) return page.locator(target.selector).first();
  if (target.testId) return page.getByTestId(target.testId).first();
  if (target.label) return page.getByLabel(target.label, { exact: false }).first();
  if (target.placeholder) return page.getByPlaceholder(target.placeholder, { exact: false }).first();
  if (target.role) {
    return page
      .getByRole(target.role as never, target.name ? { name: new RegExp(escapeRegex(target.name), "i") } : undefined)
      .first();
  }
  if (target.text) return page.getByText(target.text, { exact: false }).first();
  throw new Error("Locator target needs selector, testId, label, placeholder, role or text.");
}

async function findActionTarget(page: Page, target: ScreencastStep["target"]) {
  if (!target || target === "none") return undefined;
  if (typeof target !== "string") {
    const locator = locatorFromTarget(page, target);
    if ((await locator.count().catch(() => 0)) > 0) return locator;
    if (await locator.isVisible({ timeout: 900 }).catch(() => false)) return locator;
    if (target.name) {
      return findStringTarget(page, target.name);
    }
    if (target.text) {
      return findStringTarget(page, target.text);
    }
    return undefined;
  }

  return findStringTarget(page, target);
}

function interactionLabel(interaction: ScreencastInteraction | undefined) {
  if (!interaction) return "click";
  if (interaction.type === "fill") return `fill:${interaction.value}`;
  if (interaction.type === "select") return `select:${interaction.value}`;
  if (interaction.type === "check") return `check:${interaction.checked ?? true}`;
  if (interaction.type === "press") return `press:${interaction.key}`;
  return interaction.type;
}

async function findStringTarget(page: Page, target: string) {
  const patterns = [target, target.replace(/`/g, "")].filter(Boolean);

  for (const pattern of patterns) {
    const button = page.getByRole("button", { name: new RegExp(escapeRegex(pattern), "i") }).first();
    if (await button.isVisible({ timeout: 600 }).catch(() => false)) return button;

    const link = page.getByRole("link", { name: new RegExp(escapeRegex(pattern), "i") }).first();
    if (await link.isVisible({ timeout: 600 }).catch(() => false)) return link;

    const text = page.getByText(pattern, { exact: false }).first();
    if (await text.isVisible({ timeout: 600 }).catch(() => false)) return text;
  }

  return undefined;
}

async function installVisualCursor(page: Page, position: PointerPosition) {
  await page.evaluate(({ nextX, nextY }) => {
    const existingCursor = document.getElementById("alphavest-screencast-cursor");
    if (existingCursor) {
      existingCursor.style.transform = `translate(${nextX}px, ${nextY}px)`;
      return;
    }

    const cursor = document.createElement("div");
    cursor.id = "alphavest-screencast-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.style.position = "fixed";
    cursor.style.left = "0";
    cursor.style.top = "0";
    cursor.style.width = "28px";
    cursor.style.height = "34px";
    cursor.style.borderRadius = "0";
    cursor.style.border = "0";
    cursor.style.background = "rgba(214, 184, 110, 0.96)";
    cursor.style.clipPath = "polygon(0 0, 0 28px, 8px 20px, 13px 33px, 18px 31px, 13px 18px, 25px 18px)";
    cursor.style.filter = "drop-shadow(0 0 2px rgba(11, 18, 32, 0.95)) drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45))";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "2147483647";
    cursor.style.transform = `translate(${nextX}px, ${nextY}px)`;

    const halo = document.createElement("div");
    halo.id = "alphavest-screencast-cursor-halo";
    halo.setAttribute("aria-hidden", "true");
    halo.style.position = "fixed";
    halo.style.left = "0";
    halo.style.top = "0";
    halo.style.width = "42px";
    halo.style.height = "42px";
    halo.style.borderRadius = "999px";
    halo.style.border = "2px solid rgba(214, 184, 110, 0.70)";
    halo.style.background = "rgba(246, 239, 222, 0.10)";
    halo.style.pointerEvents = "none";
    halo.style.opacity = "0";
    halo.style.zIndex = "2147483646";
    halo.style.transform = "translate(27px, 27px)";
    halo.style.transition = "opacity 180ms ease, transform 180ms ease";

    document.body.append(cursor, halo);
  }, { nextX: position.x, nextY: position.y });
}

async function setVisualCursor(page: Page, x: number, y: number) {
  await page.evaluate(
    ({ nextX, nextY }) => {
      const cursor = document.getElementById("alphavest-screencast-cursor");
      if (cursor) cursor.style.transform = `translate(${nextX}px, ${nextY}px)`;
    },
    { nextX: x, nextY: y }
  );
}

async function pulseCursor(page: Page, x: number, y: number) {
  await page.evaluate(
    ({ nextX, nextY }) => {
      const halo = document.getElementById("alphavest-screencast-cursor-halo");
      if (!halo) return;
      halo.style.transition = "none";
      halo.style.opacity = "0.92";
      halo.style.transform = `translate(${nextX - 21}px, ${nextY - 21}px) scale(0.72)`;
      window.setTimeout(() => {
        halo.style.transition = "opacity 280ms ease, transform 280ms ease";
        halo.style.opacity = "0";
        halo.style.transform = `translate(${nextX - 21}px, ${nextY - 21}px) scale(1.22)`;
      }, 40);
    },
    { nextX: x, nextY: y }
  );
}

async function moveToPoint(page: Page, from: PointerPosition, to: PointerPosition, speed: SpeedProfile) {
  await installVisualCursor(page, from);
  const steps = speed.name === "human-demo" ? 14 : 4;
  const pause = Math.max(5, Math.floor(speed.pointerMoveMs / steps));

  for (let index = 1; index <= steps; index += 1) {
    const progress = index / steps;
    const currentX = to.x * progress + from.x * (1 - progress);
    const currentY = to.y * progress + from.y * (1 - progress);
    await page.mouse.move(currentX, currentY);
    await setVisualCursor(page, currentX, currentY);
    await delay(pause);
  }

  return to;
}

async function moveToLocator(page: Page, locator: Locator, speed: SpeedProfile, pointerPosition: PointerPosition) {
  const box = await locator.boundingBox();
  if (!box) return undefined;
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await moveToPoint(page, pointerPosition, point, speed);
  return point;
}

async function applyDemoContext(
  page: Page,
  step: ScreencastStep,
  speed: SpeedProfile,
  warnings: string[],
  pointerPosition: PointerPosition
) {
  if (step.tenantSlug) {
    const tenantSelect = page
      .getByLabel(/Tenant context/i)
      .first()
      .or(page.locator("select").filter({ has: page.locator(`option[value="${step.tenantSlug}"]`) }).first());
    const count = await tenantSelect.count().catch(() => 0);

    if (count > 0) {
      const nextPosition = await moveToLocator(page, tenantSelect, speed, pointerPosition).catch(() => undefined);
      if (nextPosition) Object.assign(pointerPosition, nextPosition);
      await tenantSelect.selectOption(step.tenantSlug).catch((error: unknown) => {
        warnings.push(`Tenant context could not be selected: ${String(error)}`);
      });
    } else {
      warnings.push(`Tenant selector not available for ${step.tenantSlug}`);
    }
  }

  if (step.roleKey) {
    const roleSelect = page
      .getByLabel(/Role context/i)
      .first()
      .or(page.locator("select").filter({ has: page.locator(`option[value="${step.roleKey}"]`) }).first());
    const count = await roleSelect.count().catch(() => 0);

    if (count > 0) {
      const nextPosition = await moveToLocator(page, roleSelect, speed, pointerPosition).catch(() => undefined);
      if (nextPosition) Object.assign(pointerPosition, nextPosition);
      await roleSelect.selectOption(step.roleKey).catch((error: unknown) => {
        warnings.push(`Role context could not be selected: ${String(error)}`);
      });
    } else {
      warnings.push(`Role selector not available for ${step.roleKey}`);
    }
  }
}

async function runStep(
  page: Page,
  step: ScreencastStep,
  options: RunnerOptions,
  speed: SpeedProfile,
  screenshotsDir: string,
  pointerPosition: PointerPosition
) {
  const stepStartedAt = Date.now();
  const startedAt = new Date(stepStartedAt).toISOString();
  const warnings: string[] = [];
  const visibleText: string[] = [];
  const missingVisibleText: string[] = [];
  const routeUrl = resolveUrl(options.baseUrl, step.route);
  const navigationMode = step.navigation ?? "goto";
  let clicked = false;
  let clickFallback = false;
  let interactionAttempted = false;
  let interactionSucceeded = false;
  let interactionFailed = false;
  let interactionFallback = false;
  let fatalError: string | undefined;

  if (navigationMode === "goto" || page.url() === "about:blank") {
    await page.goto(routeUrl, { waitUntil: "domcontentloaded" });
  } else {
    const currentPath = new URL(page.url()).pathname;
    const expectedPath = new URL(routeUrl).pathname;
    if (currentPath !== expectedPath) {
      warnings.push(`Continuation step expected route ${step.route}, current route is ${currentPath}.`);
    }
  }
  await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => undefined);
  await installVisualCursor(page, pointerPosition);
  await delay(speed.routeLoadPauseMs);
  await applyDemoContext(page, step, speed, warnings, pointerPosition);
  await delay(speed.afterActionPauseMs);

  if (!step.manualOrStatic && step.interaction?.type !== "none" && step.target && step.target !== "none") {
    interactionAttempted = true;
    const locator = await findActionTarget(page, step.target);

    if (locator) {
      try {
        await locator.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => undefined);
        const point = await moveToLocator(page, locator, speed, pointerPosition);
        if (point) Object.assign(pointerPosition, point);
        if (point) await pulseCursor(page, point.x, point.y);
        const interaction = step.interaction ?? { type: "click" as const };
        await performInteraction(page, locator, interaction, speed);
        clicked = interaction.type === "click";
        interactionSucceeded = true;
        await delay(speed.importantPauseMs);
      } catch (error) {
        clickFallback = true;
        interactionFailed = true;
        interactionFallback = true;
        const detail = error instanceof Error ? error.message.split("\n")[0] : String(error);
        const interaction = step.interaction ?? { type: "click" as const };
        const message = `${interactionLabel(interaction)} target could not be activated: ${targetLabel(step.target)} (${detail})`;
        if ("required" in interaction && interaction.required) {
          fatalError = message;
        } else {
          warnings.push(message);
        }
      }
    } else {
      clickFallback = true;
      interactionFailed = true;
      interactionFallback = true;
      const interaction = step.interaction ?? { type: "click" as const };
      const message = `${interactionLabel(interaction)} target not found: ${targetLabel(step.target)}`;
      if ("required" in interaction && interaction.required) {
        fatalError = message;
      } else {
        warnings.push(message);
      }
    }
  } else if (step.manualOrStatic) {
    warnings.push("Step marked manualOrStatic; recorded visual state without forcing a click.");
  }

  for (const text of step.expectedVisibleText) {
    const found = await page.getByText(text, { exact: false }).first().isVisible({ timeout: 1500 }).catch(() => false);
    if (found) {
      visibleText.push(text);
    } else {
      missingVisibleText.push(text);
      warnings.push(`Expected visible text not found: ${text}`);
    }
  }

  await delay(Math.max(speed.readingPauseMs, step.pauseMs));

  const screenshotPath = path.join(screenshotsDir, `step-${String(step.step).padStart(3, "0")}-${step.screenshotName}.png`);
  try {
    await page.screenshot({ fullPage: false, path: screenshotPath });
  } catch (error) {
    fatalError = error instanceof Error ? error.message : String(error);
  }

  const endedAtMs = Date.now();
  const status: StepQaResult["status"] = fatalError
    ? "fail"
    : warnings.length > 0 || missingVisibleText.length > 0 || clickFallback
      ? step.manualOrStatic
        ? "manual_static"
        : "warning"
      : "pass";

  return {
    step: step.step,
    id: step.id ?? `S${String(step.step).padStart(2, "0")}`,
    title: step.title ?? step.screen,
    route: step.route,
    screen: step.screen,
    action: step.action,
    target: targetLabel(step.target),
    caption: step.caption,
    interaction: interactionLabel(step.interaction),
    dataRefs: step.dataRefs ?? [],
    status,
    startedAt,
    endedAt: new Date(endedAtMs).toISOString(),
    elapsedMs: endedAtMs - stepStartedAt,
    screenshotPath,
    clicked,
    clickFallback,
    interactionAttempted,
    interactionSucceeded,
    interactionFailed,
    interactionFallback,
    manualOrStatic: step.manualOrStatic,
    visibleText,
    missingVisibleText,
    warnings: fatalError ? [...warnings, fatalError] : warnings,
  } satisfies StepQaResult;
}

async function performInteraction(page: Page, locator: Locator, interaction: ScreencastInteraction, speed: SpeedProfile) {
  switch (interaction.type) {
    case "none":
      return;
    case "fill":
      if (interaction.clear !== false) await locator.clear({ timeout: 2800 }).catch(() => undefined);
      await locator.fill(interaction.value, { timeout: 2800 });
      if (interaction.submitWithEnter) await locator.press("Enter", { timeout: 2800 });
      return;
    case "select":
      await locator.selectOption(interaction.value, { timeout: 2800 });
      return;
    case "check":
      if (interaction.checked === false) {
        await locator.uncheck({ timeout: 2800 });
      } else {
        await locator.check({ timeout: 2800 });
      }
      return;
    case "press":
      await locator.press(interaction.key, { timeout: 2800 });
      return;
    case "click":
      await locator.waitFor({ state: "visible", timeout: 2800 });
      await locator.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => undefined);
      if (!(await locator.isEnabled({ timeout: 1200 }).catch(() => true))) {
        throw new Error("Target is visible but disabled.");
      }
      const box = await locator.boundingBox();
      if (!box) {
        await locator.click({ timeout: 2800 });
      } else {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }
      await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => undefined);
      await delay(speed.afterActionPauseMs);
      return;
  }
}

function srtTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const ms = milliseconds % 1000;
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function buildCaptions(steps: StepQaResult[], runStartedAtMs: number) {
  const timings = steps.map((step) => ({
    start: Math.max(0, Date.parse(step.startedAt) - runStartedAtMs),
    end: Math.max(0, Date.parse(step.endedAt) - runStartedAtMs),
    text: step.caption,
  }));

  return timings
    .map((timing, index) => {
      const nextStart = timings[index + 1]?.start;
      const desiredEnd = Math.max(timing.end, timing.start + 900);
      const end =
        typeof nextStart === "number"
          ? Math.max(timing.start + 160, Math.min(desiredEnd, nextStart - 60))
          : desiredEnd;

      return `${index + 1}\n${srtTime(timing.start)} --> ${srtTime(end)}\n${timing.text}\n`;
    })
    .join("\n");
}

function relativeToRepo(value: string | undefined) {
  return value ? path.relative(root, value) : undefined;
}

function statusFromSteps(stepResults: StepQaResult[], warnings: string[], errors: string[]) {
  if (errors.length > 0 || stepResults.some((step) => step.status === "fail")) return "failed";
  if (warnings.length > 0 || stepResults.some((step) => step.status !== "pass")) return "completed_with_warnings";
  return "passed";
}

async function provisionJourneyData(
  journey: ScreencastJourney,
  options: RunnerOptions,
  paths: JourneyPaths
): Promise<JourneyProvisioningResult> {
  if (options.skipProvisioning || !journey.provisioning) {
    return {
      status: "skipped",
      fixtureId: journey.fixtureId ?? journey.provisioning?.fixtureId,
      warnings: ["Provisioning skipped by option or missing journey.provisioning contract."],
      errors: [],
    };
  }

  const args = [
    "tsx",
    "scripts/screencast/seed-journey.ts",
    journey.id,
    `--fixture=${journey.provisioning.fixtureId}`,
    `--output=${paths.provisioning}`,
  ];

  const command = `pnpm ${args.join(" ")}`;

  const result = await new Promise<JourneyProvisioningResult>((resolveProvisioning) => {
    const child = spawn("pnpm", args, {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.once("error", (error) => {
      resolveProvisioning({
        status: "failed",
        fixtureId: journey.provisioning?.fixtureId,
        mode: "database-fixture",
        resetStrategy: journey.provisioning?.resetStrategy,
        command,
        outputPath: paths.provisioning,
        warnings: [],
        errors: [error.message],
      });
    });
    child.once("exit", (code) => {
      const failed = code !== 0;
      resolveProvisioning({
        status: failed ? "failed" : "passed",
        fixtureId: journey.provisioning?.fixtureId,
        mode: "database-fixture",
        resetStrategy: journey.provisioning?.resetStrategy,
        command,
        outputPath: paths.provisioning,
        summary: {
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        },
        warnings: stderr.trim() && !failed ? [stderr.trim()] : [],
        errors: failed ? [`Provisioning command failed with code ${code}.\n${stdout}\n${stderr}`] : [],
      });
    });
  });

  if (!existsSync(paths.provisioning)) {
    await writeFile(paths.provisioning, `${JSON.stringify(result, null, 2)}\n`);
  }

  return result;
}

export async function runJourney(journey: ScreencastJourney, options: RunnerOptions, runRoot = buildRunRoot(options)) {
  const runStartedAtMs = Date.now();
  const startedAt = new Date(runStartedAtMs).toISOString();
  const paths = buildJourneyPaths(runRoot, journey.id);

  await rm(paths.journeyDir, { force: true, recursive: true });
  await mkdir(paths.screenshotsDir, { recursive: true });
  await writeFile(paths.resolvedManifest, `${JSON.stringify(journey, null, 2)}\n`);

  if (options.dryRun) {
    const result = buildDryRunResult(journey, options, startedAt, paths, {
      status: "skipped",
      fixtureId: journey.fixtureId ?? journey.provisioning?.fixtureId,
      mode: journey.provisioning?.mode,
      resetStrategy: journey.provisioning?.resetStrategy,
      command: journey.provisioning?.seedCommand,
      warnings: ["Dry run validates the provisioning contract but does not touch the database."],
      errors: [],
    });
    await writeJourneyArtifacts(journey, result, paths);
    return result;
  }

  const provisioning = await provisionJourneyData(journey, options, paths);
  if (provisioning.status === "failed" || options.provisionOnly) {
    const result = buildDryRunResult(journey, options, startedAt, paths, provisioning);
    result.status = provisioning.status === "failed" ? "failed" : "dry_run";
    result.errors.push(...provisioning.errors);
    result.warnings.push(...provisioning.warnings);
    await writeJourneyArtifacts(journey, result, paths);
    if (options.strict) {
      throw new Error(`${journey.id} completed with status ${result.status}. See ${paths.qaResult}`);
    }
    return result;
  }

  await assertAppReachable(options.baseUrl);
  const speed = speedProfiles[options.speed];
  let browser: Browser | undefined;
  let videoSource: string | undefined;
  let captionMode: JourneyQaResult["captionMode"];
  const warnings: string[] = [];
  const errors: string[] = [];
  const stepResults: StepQaResult[] = [];

  try {
    browser = await launchBrowser(options);
    const context = await browser.newContext({
      recordVideo: {
        dir: paths.journeyDir,
        size: viewport,
      },
      viewport,
    });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    const video = page.video();
    const pointerPosition = { x: viewport.width - 96, y: 96 };

    for (const step of journey.steps) {
      try {
        const result = await runStep(page, step, options, speed, paths.screenshotsDir, pointerPosition);
        stepResults.push(result);
        warnings.push(...result.warnings);
        if (result.status === "fail") break;
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        errors.push(detail);
        break;
      }
    }

    await context.tracing.stop({ path: paths.trace }).catch(() => undefined);
    await page.close().catch(() => undefined);
    await context.close();
    videoSource = await video?.path().catch(() => undefined);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  } finally {
    await browser?.close().catch(() => undefined);
  }

  await writeFile(paths.captions, buildCaptions(stepResults, runStartedAtMs));

  if (videoSource && existsSync(videoSource)) {
    await copyFile(videoSource, paths.rawVideo);
    try {
      captionMode = await renderMp4WithCaptions(paths.rawVideo, paths.captions, paths.mp4);
    } catch (error) {
      captionMode = "unavailable";
      errors.push(error instanceof Error ? error.message : String(error));
    }
  } else {
    errors.push("Playwright did not produce a raw video file.");
  }

  const finishedAt = new Date().toISOString();
  const status = statusFromSteps(stepResults, warnings, errors);
  const result: JourneyQaResult = {
    journeyId: journey.id,
    journeyName: journey.name,
    manifestPath: options.manifestPath,
    portfolioLayer: journey.portfolioLayer,
    candidateId: journey.candidateId,
    currentRealityLabel: journey.currentRealityLabel,
    proofLevel: journey.proofLevel,
    caveat: journey.caveat,
    status,
    baseUrl: options.baseUrl,
    runRoot,
    startedAt,
    finishedAt,
    elapsedMs: Date.parse(finishedAt) - runStartedAtMs,
    outputDir: paths.journeyDir,
    provisioning,
    rawVideoPath: existsSync(paths.rawVideo) ? paths.rawVideo : undefined,
    videoPath: existsSync(paths.rawVideo) ? paths.rawVideo : undefined,
    mp4Path: existsSync(paths.mp4) ? paths.mp4 : undefined,
    captionsPath: existsSync(paths.captions) ? paths.captions : undefined,
    captionMode,
    runLogPath: paths.runLog,
    storyboardPath: paths.storyboard,
    resolvedManifestPath: paths.resolvedManifest,
    tracePath: existsSync(paths.trace) ? paths.trace : undefined,
    screenshotsDir: paths.screenshotsDir,
    steps: stepResults,
    warnings,
    errors,
  };

  await writeJourneyArtifacts(journey, result, paths);
  await writeLegacyCompatibilityArtifacts(result);

  if (options.strict && status !== "passed") {
    throw new Error(`${journey.id} completed with status ${status}. See ${paths.qaResult}`);
  }

  return result;
}

function buildDryRunResult(
  journey: ScreencastJourney,
  options: RunnerOptions,
  startedAt: string,
  paths: JourneyPaths,
  provisioning?: JourneyProvisioningResult
): JourneyQaResult {
  const finishedAt = new Date().toISOString();
  return {
    journeyId: journey.id,
    journeyName: journey.name,
    manifestPath: options.manifestPath,
    portfolioLayer: journey.portfolioLayer,
    candidateId: journey.candidateId,
    currentRealityLabel: journey.currentRealityLabel,
    proofLevel: journey.proofLevel,
    caveat: journey.caveat,
    status: "dry_run",
    baseUrl: options.baseUrl,
    runRoot: path.dirname(paths.journeyDir),
    startedAt,
    finishedAt,
    elapsedMs: Date.parse(finishedAt) - Date.parse(startedAt),
    outputDir: paths.journeyDir,
    provisioning,
    captionsPath: undefined,
    captionMode: undefined,
    runLogPath: paths.runLog,
    storyboardPath: paths.storyboard,
    resolvedManifestPath: paths.resolvedManifest,
    screenshotsDir: paths.screenshotsDir,
    steps: journey.steps.map((step) => ({
      step: step.step,
      id: step.id ?? `S${String(step.step).padStart(2, "0")}`,
      title: step.title ?? step.screen,
      route: step.route,
      screen: step.screen,
      action: step.action,
      target: targetLabel(step.target),
      caption: step.caption,
      interaction: interactionLabel(step.interaction),
      dataRefs: step.dataRefs ?? [],
      status: "pass",
      startedAt,
      endedAt: finishedAt,
      elapsedMs: 0,
      clicked: false,
      clickFallback: false,
      interactionAttempted: step.interaction?.type !== "none" && Boolean(step.target && step.target !== "none"),
      interactionSucceeded: false,
      interactionFailed: false,
      interactionFallback: false,
      manualOrStatic: step.manualOrStatic,
      visibleText: [],
      missingVisibleText: [],
      warnings: [],
    })),
    warnings: [],
    errors: [],
  };
}

async function writeJourneyArtifacts(journey: ScreencastJourney, result: JourneyQaResult, paths: JourneyPaths) {
  await mkdir(paths.journeyDir, { recursive: true });
  await writeFile(paths.qaResult, `${JSON.stringify(result, null, 2)}\n`);
  await writeFile(paths.runLog, `${JSON.stringify(result, null, 2)}\n`);
  await writeFile(paths.metadata, `${JSON.stringify(buildMetadata(journey, result), null, 2)}\n`);
  await writeFile(paths.transcript, buildTranscript(journey, result));
  await writeFile(paths.storyboard, buildStoryboard(journey, result));
}

function buildMetadata(journey: ScreencastJourney, result: JourneyQaResult) {
  return {
    journeyId: journey.id,
    journeyName: journey.name,
    manifestPath: result.manifestPath,
    portfolioLayer: journey.portfolioLayer,
    candidateId: journey.candidateId,
    legacyJourneyIds: journey.legacyJourneyIds,
    demoPriority: journey.demoPriority,
    audienceFit: journey.audienceFit,
    currentRealityLabel: journey.currentRealityLabel,
    proofLevel: journey.proofLevel,
    overclaimRisk: journey.overclaimRisk,
    caveat: journey.caveat,
    proofPath: journey.proofPath,
    captionShort: journey.captionShort,
    captionLong: journey.captionLong,
    presenterNotes: journey.presenterNotes,
    customerSendable: journey.customerSendable,
    primaryActor: journey.primaryActor,
    tenant: journey.tenant,
    startRoute: journey.startRoute,
    endState: journey.endState,
    status: result.status,
    fixtureId: journey.fixtureId,
    provisioning: result.provisioning,
    baseUrl: result.baseUrl,
    runRoot: result.runRoot,
    outputDir: result.outputDir,
    generatedAt: result.finishedAt,
    captionMode: result.captionMode,
    engineMode: "ENGINE_MIX_V2_CODEX_V3_PROOF",
  };
}

function buildTranscript(journey: ScreencastJourney, result: JourneyQaResult) {
  const lines = [
    `# ${journey.id} - ${journey.name}`,
    "",
    `Primary actor: ${journey.primaryActor}`,
    `Tenant: ${journey.tenant}`,
    `Start route: ${journey.startRoute}`,
    `End state: ${journey.endState}`,
    `Status: ${result.status}`,
    `Caption mode: ${result.captionMode ?? "not generated"}`,
    "",
    "## Steps",
    "",
  ];

  for (const step of journey.steps) {
    const qa = result.steps.find((item) => item.step === step.step);
    lines.push(`### Step ${step.step}: ${step.screen}`);
    lines.push("");
    lines.push(`- Caption: ${step.caption}`);
    lines.push(`- Route: \`${step.route}\``);
    lines.push(`- Role: ${step.role}`);
    lines.push(`- Tenant: ${step.tenant}`);
    lines.push(`- Input data: ${step.inputData.join("; ") || "none"}`);
    lines.push(`- Action: ${step.action}`);
    lines.push(`- Target: ${targetLabel(step.target)}`);
    lines.push(`- Interaction: ${interactionLabel(step.interaction)}`);
    if (step.dataRefs?.length) lines.push(`- Data refs: ${step.dataRefs.join("; ")}`);
    lines.push(`- Expected state change: ${step.expectedStateChange}`);
    lines.push(`- Client visibility: ${step.clientVisibility}`);
    lines.push(`- Evidence: ${step.evidence}`);
    lines.push(`- Audit: ${step.audit}`);
    lines.push(`- QA assertion: ${step.qaAssertion}`);
    if (qa?.warnings.length) lines.push(`- Runner warnings: ${qa.warnings.join("; ")}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function buildStoryboard(journey: ScreencastJourney, result: JourneyQaResult) {
  const lines = [
    `# ${journey.id} ${journey.name}`,
    "",
    `Status: ${result.status}`,
    `MP4: ${relativeToRepo(result.mp4Path) ?? "not generated"}`,
    `Raw video: ${relativeToRepo(result.rawVideoPath) ?? "not generated"}`,
    `Captions: ${relativeToRepo(result.captionsPath) ?? "not generated"}`,
    `Caption Mode: ${result.captionMode ?? "not generated"}`,
    `Provisioning: ${result.provisioning?.status ?? "not configured"}${
      result.provisioning?.fixtureId ? ` (${result.provisioning.fixtureId})` : ""
    }`,
    `Trace: ${relativeToRepo(result.tracePath) ?? "not generated"}`,
    "",
    "## Product Gates",
    "",
    ...journey.visibilityRules.map((rule) => `- ${rule}`),
    ...journey.complianceRules.map((rule) => `- ${rule}`),
    "",
    "## Steps",
    "",
    "| Step | Status | Interaction | Caption | Target | Screenshot |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const step of result.steps) {
    const screenshotName = step.screenshotPath?.split(path.sep).pop();
    const interactionState = step.interactionAttempted
      ? step.interactionSucceeded
        ? "succeeded"
        : step.interactionFallback
          ? "fallback"
          : step.interactionFailed
            ? "failed"
            : "attempted"
      : "none";
    lines.push(
      `| ${step.id} ${step.title} | ${step.status} | ${interactionState} | ${step.caption.replace(/\|/g, "/")} | ${step.target.replace(/\|/g, "/")} | ${
        screenshotName ? `[${screenshotName}](screenshots/${screenshotName})` : "-"
      } |`
    );
  }

  return `${lines.join("\n")}\n`;
}

async function writeLegacyCompatibilityArtifacts(result: JourneyQaResult) {
  const legacyDir = path.join(outputRoot, result.journeyId);
  await rm(legacyDir, { force: true, recursive: true });
  await mkdir(path.join(legacyDir, "screenshots"), { recursive: true });

  const copyIfPresent = async (source: string | undefined, target: string) => {
    if (source && existsSync(source)) await copyFile(source, path.join(legacyDir, target));
  };

  await copyIfPresent(result.rawVideoPath, "video.webm");
  await copyIfPresent(result.mp4Path, "final.mp4");
  await copyIfPresent(result.captionsPath, "captions.srt");
  await copyIfPresent(result.provisioning?.outputPath, "provisioning.json");
  await copyIfPresent(result.runLogPath, "run-log.json");
  await copyIfPresent(result.storyboardPath, "storyboard.md");
  await copyIfPresent(result.resolvedManifestPath, "manifest.resolved.json");
  await copyIfPresent(result.tracePath, "trace.zip");

  await writeFile(path.join(legacyDir, "qa-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  await writeFile(path.join(legacyDir, "metadata.json"), `${JSON.stringify({ ...result, compatibilityCopy: true }, null, 2)}\n`);

  if (existsSync(result.screenshotsDir)) {
    for (const filename of readdirSync(result.screenshotsDir)) {
      if (filename.endsWith(".png")) {
        await copyFile(path.join(result.screenshotsDir, filename), path.join(legacyDir, "screenshots", filename));
      }
    }
  }
}

export async function writeRunIndex(runRoot: string, results: JourneyQaResult[]) {
  await mkdir(runRoot, { recursive: true });
  const generatedAt = new Date().toISOString();
  const summary = {
    generatedAt,
    runRoot,
    manifestPath: results[0]?.manifestPath,
    portfolioLayers: Array.from(new Set(results.map((result) => result.portfolioLayer).filter(Boolean))),
    totals: {
      journeys: results.length,
      passed: results.filter((result) => result.status === "passed").length,
      warnings: results.filter((result) => result.status === "completed_with_warnings").length,
      failed: results.filter((result) => result.status === "failed").length,
      dryRun: results.filter((result) => result.status === "dry_run").length,
      captionBurnedIn: results.filter((result) => result.captionMode === "burned-in").length,
      captionEmbeddedTrack: results.filter((result) => result.captionMode === "embedded-track").length,
      captionUnavailable: results.filter((result) => result.captionMode === "unavailable").length,
    },
    results,
  };

  await writeFile(path.join(runRoot, "index.json"), `${JSON.stringify(summary, null, 2)}\n`);

  const lines = [
    "# AlphaVest Journey Screencast Run",
    "",
    `Generated: ${generatedAt}`,
    `Output: ${relativeToRepo(runRoot)}`,
    results[0]?.manifestPath ? `Manifest: ${results[0].manifestPath}` : undefined,
    summary.portfolioLayers.length > 0 ? `Portfolio Layers: ${summary.portfolioLayers.join(", ")}` : undefined,
    "",
    "| Journey | Status | Caption Mode | MP4 | Storyboard | Warnings / Errors |",
    "| --- | --- | --- | --- | --- | --- |",
  ].filter((line): line is string => typeof line === "string");

  for (const result of results) {
    const relativeRoot = relativeToRepo(runRoot);
    const relativeMp4 = relativeToRepo(result.mp4Path)?.replace(`${relativeRoot}/`, "");
    const relativeStoryboard = relativeToRepo(result.storyboardPath)?.replace(`${relativeRoot}/`, "");
    const problems = [...result.errors, ...result.warnings].slice(0, 3).join("<br>");
    lines.push(
      `| ${result.journeyId} ${result.journeyName} | ${result.status} | ${result.captionMode ?? "-"} | ${
        relativeMp4 ? `[journey.mp4](${relativeMp4})` : "-"
      } | ${relativeStoryboard ? `[storyboard.md](${relativeStoryboard})` : "-"} | ${problems.replace(/\|/g, "/") || "-"} |`
    );
  }

  await writeFile(path.join(runRoot, "index.md"), `${lines.join("\n")}\n`);
  await writeFile(path.join(outputRoot, "run-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
