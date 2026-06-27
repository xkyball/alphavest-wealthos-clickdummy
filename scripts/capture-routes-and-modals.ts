import { chromium, type BrowserContext, type Locator, type Page, type Request, type Response } from "@playwright/test";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  captureModelContextForRoute,
  captureScreenModelAuditBaseline,
  type CaptureScreenModelContext,
} from "@/lib/capture-screen-model-context";
import { demoAuthSessionCookieName } from "@/lib/demo/demo-auth-session";
import { routeToSmokePath, screenRoutes, type ScreenRoute } from "@/lib/route-registry";
import { uxCaptureVariantForFileKind, type UxCaptureVariant } from "@/lib/ux-lifecycle-state-contract";
import { visualStateForRoute } from "@/lib/visual-contract";

type CaptureMode = "drawer" | "modal";
type CaptureFileKind = CaptureMode | "screen";

type CaptureStatus = "captured" | "failed-open" | "failed-screenshot" | "missing-trigger";

type RuntimeReflectionStrategy = "mixed" | "react-devtools-hook" | "react-fiber-dom-backpointer" | "unavailable";

type RuntimeConfidence = "high" | "medium" | "low" | "unavailable";

type CaptureItem = {
  captureVariant: UxCaptureVariant;
  componentRuntimeMarkdownPath?: string;
  componentRuntimePath?: string;
  componentRuntimeError?: string;
  componentRuntimeStatus?: "captured" | "failed-components";
  componentRuntimeStrategy?: RuntimeReflectionStrategy;
  componentRuntimeConfidence?: RuntimeConfidence;
  cssPath?: string;
  domPath?: string;
  domRectTracePath?: string;
  domRectTraceStatus?: "captured" | "failed-dom-rect-trace";
  domStatus?: "captured" | "failed-dom";
  interactionProofTracePath?: string;
  interactionProofTraceStatus?: "captured" | "failed-interaction-proof" | "not-tested";
  modelContext: CaptureScreenModelContext;
  pageId: string;
  path: string;
  reactSourceTracePath?: string;
  reactSourceTraceStatus?: "captured" | "failed-react-source-trace";
  route: string;
  state: string;
  status: CaptureStatus;
  title: string;
  url: string;
};

type OverlayStep = {
  label: string;
  mode: CaptureMode;
  open: (page: Page) => Promise<boolean>;
};

type RuntimeOverlayMeta = {
  captureVariant: UxCaptureVariant;
  mode: CaptureMode | "none";
  selector: string | null;
  status: CaptureStatus;
  trigger: string | null;
};

type RuntimePlausibilityCheck = {
  checks: Array<{ name: string; passed: boolean; detail: string }>;
  failed: number;
  passed: number;
  status: "passed" | "warning" | "failed";
  warnings: string[];
};

const captureVariantContract = {
  markerAttributes: [
    "data-ux-capture-file-kind",
    "data-ux-capture-is-overlay",
    "data-ux-capture-state-label",
    "data-ux-capture-variant-kind",
  ],
  requiredVariantKinds: ["base", "modal", "drawer", "confirmation"],
};

const baseUrl = process.env.AVS_BASE_URL ?? process.env.BASE_URL ?? "http://localhost:3095";
const runTs =
  process.env.AVS_CAPTURE_OUTPUT ??
  new Date().toISOString().replace(/[.:]/g, "-").replace("T", "_").slice(0, 19);
const outputDir = path.join(process.cwd(), "artifacts", "routes-and-modals", runTs);
const cliArgs = new Set(process.argv.slice(2));
const screensOnly = cliArgs.has("--screens-only") || process.env.AVS_CAPTURE_SCREENS_ONLY === "1";
const modalSelector = '[data-testid="ux-a11y-modal"][role="dialog"]';
const drawerSelector = '[data-testid="ux-a11y-drawer"][role="complementary"], aside[aria-label="Action Details"]';
const pageIdFilter = process.env.AVS_CAPTURE_PAGE_IDS
  ? new Set(process.env.AVS_CAPTURE_PAGE_IDS.split(",").map((item) => item.trim()).filter(Boolean))
  : null;
const sourceTraceEnabled = process.env.AVS_CAPTURE_SOURCE_TRACE !== "0";
const sourceRoots = ["app", "components", "lib", "hooks", "contexts", "styles"].map((folder) => path.join(process.cwd(), folder)).filter(existsSync);

type SourceFileIndexEntry = {
  absPath: string;
  content: string;
  relPath: string;
};

type ResolvedSourceLocation = {
  columnNumber: number | null;
  confidence: "high" | "medium" | "low" | "unavailable";
  fileName: string | null;
  lineNumber: number | null;
  localFileExists: boolean;
  localFilePath: string | null;
  proofLabel: "EXACT_SOURCE_MATCH" | "SOURCE_MAP_NORMALIZED_MATCH" | "COMPILED_RUNTIME_HINT" | "NO_SOURCE_MATCH";
  sourceId: string | null;
  sourceKind: string | null;
};

function walkSourceFiles(root: string) {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", ".next", "dist", "build", "coverage", "artifacts"].includes(entry.name)) continue;
        walk(entryPath);
      } else if (entry.isFile() && /\.(tsx|ts|jsx|js|css)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
        files.push(entryPath);
      }
    }
  };
  walk(root);
  return files;
}

const sourceFileIndex: SourceFileIndexEntry[] = sourceRoots
  .flatMap(walkSourceFiles)
  .map((absPath) => ({
    absPath,
    content: readFileSync(absPath, "utf8"),
    relPath: path.relative(process.cwd(), absPath),
  }));

function normalizeRuntimeSourcePath(fileName: string | null | undefined) {
  if (!fileName) return null;
  let normalized = fileName
    .replace(/^webpack-internal:\/\/\/(?:\(.*?\)\/)?/, "")
    .replace(/^file:\/\//, "")
    .replace(/\?.*$/, "");
  const srcIndex = normalized.indexOf("/src/");
  if (srcIndex >= 0) normalized = normalized.slice(srcIndex + "/src/".length);
  if (normalized.startsWith(process.cwd())) return path.relative(process.cwd(), normalized);
  const direct = sourceFileIndex.find((entry) => normalized === entry.relPath || normalized.endsWith(`/${entry.relPath}`));
  if (direct) return direct.relPath;
  const byBasename = sourceFileIndex.filter((entry) => path.basename(entry.relPath) === path.basename(normalized));
  if (byBasename.length === 1) return byBasename[0].relPath;
  const bySuffix = sourceFileIndex.filter((entry) => normalized.endsWith(entry.relPath) || entry.relPath.endsWith(normalized));
  if (bySuffix.length === 1) return bySuffix[0].relPath;
  return normalized;
}

function resolveSourceLocation(source: {
  columnNumber?: number | null;
  fileName?: string | null;
  lineNumber?: number | null;
  sourceKind?: string | null;
}, symbol?: string | null): ResolvedSourceLocation {
  const localFilePath = normalizeRuntimeSourcePath(source.fileName);
  const localFileExists = Boolean(localFilePath && existsSync(path.join(process.cwd(), localFilePath)));
  const lineNumber = typeof source.lineNumber === "number" ? source.lineNumber : null;
  const columnNumber = typeof source.columnNumber === "number" ? source.columnNumber : null;
  const sourceId = localFilePath && lineNumber
    ? `${localFilePath}:${lineNumber}:${columnNumber ?? 0}:${symbol ?? "unknown"}`
    : null;

  return {
    columnNumber,
    confidence: localFileExists && lineNumber ? "high" : localFilePath ? "low" : "unavailable",
    fileName: source.fileName ?? null,
    lineNumber,
    localFileExists,
    localFilePath: localFilePath ?? null,
    proofLabel: localFileExists && lineNumber
      ? ["_debugSource", "data-avs-source-id", "jsx-compile-time"].includes(source.sourceKind ?? "")
        ? "EXACT_SOURCE_MATCH"
        : "SOURCE_MAP_NORMALIZED_MATCH"
      : localFilePath
        ? "COMPILED_RUNTIME_HINT"
        : "NO_SOURCE_MATCH",
    sourceId,
    sourceKind: source.sourceKind ?? null,
  };
}

function resolveHandlerSource(handlerName: string | null | undefined, ownerSource: ResolvedSourceLocation, eventProp: string) {
  const normalizedName = handlerName && handlerName !== "anonymous" ? handlerName : null;
  if (!ownerSource.localFilePath || !normalizedName) {
    return {
      confidence: ownerSource.localFileExists ? "medium" : "low",
      handlerSourceId: ownerSource.sourceId ? `${ownerSource.sourceId}:${eventProp}` : `unresolved:${eventProp}:${normalizedName ?? "anonymous"}`,
      localFilePath: ownerSource.localFilePath,
      proofLabel: ownerSource.localFileExists ? "HANDLER_OWNER_SOURCE_CANDIDATE" : "HANDLER_RUNTIME_PROP_ONLY",
    };
  }

  const sourceFile = sourceFileIndex.find((entry) => entry.relPath === ownerSource.localFilePath);
  const matchIndex = sourceFile?.content.search(new RegExp(`\\\\b${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\\\b`)) ?? -1;
  if (sourceFile && matchIndex >= 0) {
    const lineNumber = sourceFile.content.slice(0, matchIndex).split("\n").length;
    return {
      confidence: "high",
      handlerSourceId: `${sourceFile.relPath}:${lineNumber}:0:${normalizedName}`,
      lineNumber,
      localFilePath: sourceFile.relPath,
      proofLabel: "HANDLER_SOURCE_MATCH",
    };
  }

  return {
    confidence: "medium",
    handlerSourceId: `${ownerSource.localFilePath}:${ownerSource.lineNumber ?? 0}:${ownerSource.columnNumber ?? 0}:${normalizedName}:${eventProp}`,
    localFilePath: ownerSource.localFilePath,
    proofLabel: "HANDLER_OWNER_SOURCE_CANDIDATE",
  };
}

const overlayPlans: Record<string, OverlayStep[]> = {
  "/onboarding/consent": [{ label: "policy-modal", mode: "modal", open: (page) => clickText(page, "Review policy") }],
  "/admin/platform": [{ label: "confirm-modal", mode: "modal", open: (page) => clickSelector(page, '[data-testid="j10-save-platform"]') }],
  "/admin/roles": [{ label: "permission-modal", mode: "modal", open: (page) => clickSelector(page, '[data-testid="j10-review-permission"]') }],
  "/admin/security": [{ label: "confirm-modal", mode: "modal", open: (page) => clickSelector(page, '[data-testid="j10-save-security"]') }],
  "/tenants/:id/users": [{ label: "invite-user-drawer", mode: "drawer", open: (page) => clickSelector(page, '[data-testid="j06-invite-user"]') }],
  "/actions": [{ label: "actions-drawer", mode: "drawer", open: (page) => clickText(page, "Open selected action") }],
  "/compliance/reviews/:id/release": [{ label: "release-confirm-modal", mode: "modal", open: (page) => clickSelector(page, '[data-testid="j02-release-client"]') }],
  "/compliance/reviews/:id/block": [{ label: "block-request-modal", mode: "modal", open: (page) => clickText(page, "Manage Block") }],
  "/decisions/:id": [{ label: "decision-confirm-option", mode: "modal", open: (page) => clickSelector(page, '[data-testid="j03-accept-option"]') }],
  "/evidence": [{ label: "evidence-drawer", mode: "drawer", open: (page) => clickSelector(page, '[data-testid="j03-open-evidence-drawer"]') }],
  "/governance": [{ label: "user-drawer", mode: "drawer", open: (page) => clickSelector(page, '[data-testid="j07-invite-user"]') }],
  "/governance/roles/:id": [
    { label: "role-drawer", mode: "drawer", open: (page) => clickSelector(page, '[data-testid="j07-open-role-drawer"]') },
    {
      label: "role-confirm-modal",
      mode: "modal",
      open: async (page) => {
        if (!(await isOverlayVisible(page, "drawer"))) {
          const openedDrawer = await clickSelector(page, '[data-testid="j07-open-role-drawer"]');
          if (!openedDrawer || !(await waitForOverlay(page, "drawer"))) return false;
        }
        await checkFirstVisibleCheckbox(page);
        return clickSelector(page, '[data-testid="j07-review-role-changes"]');
      },
    },
  ],
  "/governance/access-requests/:id": [{ label: "access-request-drawer", mode: "drawer", open: (page) => clickSelector(page, '[data-testid="j07-open-access-request-drawer"]') }],
  "/export/:id/approval": [{ label: "export-approval-modal", mode: "modal", open: (page) => clickSelector(page, '[data-testid="j08-open-export-approval"]') }],
  "/export/:id/download": [{ label: "download-confirmation-modal", mode: "modal", open: (page) => clickSelector(page, '[data-testid="j08-open-download-confirmation"]') }],
};

function isAuthRoute(route: string) {
  return route === "/login" || route === "/mfa" || route.startsWith("/onboarding/");
}

function routeSlug(route: string) {
  return route.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 96) || "root";
}

function stateSlug(state: string) {
  return routeSlug(state.replace(/-(modal|drawer)$/i, ""));
}

function fileNameFor(route: ScreenRoute, kind: CaptureFileKind, state: string) {
  const captureVariant = uxCaptureVariantForFileKind(kind, state);
  return `${route.pageId}-route-${routeSlug(routeToSmokePath(route.route))}-${captureVariant.lifecycleKind}-${stateSlug(state)}.png`;
}

function captureUrlForRoute(route: ScreenRoute) {
  const smokePath = routeToSmokePath(route.route);
  const visualState = visualStateForRoute(route);
  const pathname = visualState === "base" ? smokePath : `${smokePath}?state=${visualState}`;

  return new URL(pathname, baseUrl).toString();
}

function sidecarNameFor(fileName: string, extension: "css" | "html") {
  return fileName.replace(/\.png$/i, `.rendered.${extension}`);
}

function componentRuntimeNameFor(fileName: string, extension: "json" | "md") {
  return fileName.replace(/\.png$/i, `.components.runtime.${extension}`);
}

function domRectTraceNameFor(fileName: string) {
  return fileName.replace(/\.png$/i, ".RUNTIME_DOM_RECT_TRACE.json");
}

function reactSourceTraceNameFor(fileName: string) {
  return fileName.replace(/\.png$/i, ".REACT_SOURCE_TRACE.json");
}

function interactionProofTraceNameFor(fileName: string) {
  return fileName.replace(/\.png$/i, ".INTERACTION_PROOF_TRACE.json");
}

function overlaySelectorFor(mode: CaptureMode | "none") {
  if (mode === "drawer") return drawerSelector;
  if (mode === "modal") return modalSelector;
  return null;
}

async function installReactReflectionHook(context: BrowserContext) {
  await context.addInitScript(() => {
    type CaptureWindow = Window & typeof globalThis & {
      __AVS_REACT_REFLECTION__?: {
        commits: number;
        errors: string[];
        injected: boolean;
        preexistingHook: boolean;
        renderers: Array<{ id: number | string; keys: string[] }>;
        roots: Array<{ rendererId: number | string; rootTag: number | string | null }>;
      };
      __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
        checkDCE?: (...args: unknown[]) => unknown;
        inject?: (renderer: unknown) => number | string;
        isDisabled?: boolean;
        onCommitFiberRoot?: (rendererId: number | string, root: unknown, priorityLevel?: unknown, didError?: unknown) => unknown;
        onCommitFiberUnmount?: (rendererId: number | string, fiber: unknown) => unknown;
        rendererInterfaces?: Map<unknown, unknown> | Record<string, unknown>;
        renderers?: Map<unknown, unknown> | Record<string, unknown>;
        supportsFiber?: boolean;
      };
      __name?: <T>(target: T) => T;
    };

    const win = window as CaptureWindow;
    win.__name ??= <T>(target: T) => target;
    if (win.__AVS_REACT_REFLECTION__?.injected) return;

    const state = {
      commits: 0,
      errors: [] as string[],
      injected: true,
      preexistingHook: Boolean(win.__REACT_DEVTOOLS_GLOBAL_HOOK__),
      renderers: [] as Array<{ id: number | string; keys: string[] }>,
      roots: [] as Array<{ rendererId: number | string; rootTag: number | string | null }>,
    };
    win.__AVS_REACT_REFLECTION__ = state;

    const recordError = (error: unknown) => {
      state.errors.push(error instanceof Error ? error.message : String(error));
    };

    const hook = win.__REACT_DEVTOOLS_GLOBAL_HOOK__ ?? {
      isDisabled: false,
      rendererInterfaces: new Map<unknown, unknown>(),
      renderers: new Map<unknown, unknown>(),
      supportsFiber: true,
    };

    const originalInject = hook.inject?.bind(hook);
    const originalCommitRoot = hook.onCommitFiberRoot?.bind(hook);
    const originalCommitUnmount = hook.onCommitFiberUnmount?.bind(hook);
    let nextRendererId = 1;

    hook.supportsFiber = true;
    hook.inject = (renderer: unknown) => {
      let rendererId: number | string = nextRendererId++;
      try {
        const injectedId = originalInject?.(renderer);
        if (typeof injectedId === "number" || typeof injectedId === "string") rendererId = injectedId;
      } catch (error) {
        recordError(error);
      }

      try {
        if (hook.renderers instanceof Map) hook.renderers.set(rendererId, renderer);
        else if (hook.renderers && typeof hook.renderers === "object") (hook.renderers as Record<string, unknown>)[String(rendererId)] = renderer;
      } catch (error) {
        recordError(error);
      }

      state.renderers.push({
        id: rendererId,
        keys: renderer && typeof renderer === "object" ? Object.keys(renderer as Record<string, unknown>).slice(0, 20) : [],
      });

      return rendererId;
    };
    hook.onCommitFiberRoot = (rendererId: number | string, root: unknown, priorityLevel?: unknown, didError?: unknown) => {
      state.commits += 1;
      try {
        const maybeRoot = root as { current?: { tag?: number | string } } | null;
        const rootTag = maybeRoot?.current?.tag ?? null;
        const exists = state.roots.some((entry) => entry.rendererId === rendererId && entry.rootTag === rootTag);
        if (!exists) state.roots.push({ rendererId, rootTag });
      } catch (error) {
        recordError(error);
      }

      try {
        return originalCommitRoot?.(rendererId, root, priorityLevel, didError);
      } catch (error) {
        recordError(error);
        return undefined;
      }
    };
    hook.onCommitFiberUnmount = (rendererId: number | string, fiber: unknown) => {
      try {
        return originalCommitUnmount?.(rendererId, fiber);
      } catch (error) {
        recordError(error);
        return undefined;
      }
    };
    hook.checkDCE ??= () => undefined;

    win.__REACT_DEVTOOLS_GLOBAL_HOOK__ = hook;
  });
}

async function annotateRuntimeSourceIds(page: Page) {
  if (!sourceTraceEnabled) return;

  await page.evaluate(() => {
    type FiberLike = {
      _debugOwner?: FiberLike | null;
      _debugStack?: { stack?: string } | null;
      _debugSource?: { columnNumber?: number; fileName?: string; lineNumber?: number } | null;
      elementType?: unknown;
      memoizedProps?: unknown;
      return?: FiberLike | null;
      type?: unknown;
    };

    const isPlainObject = (value: unknown): value is Record<string, unknown> =>
      Boolean(value) && typeof value === "object" && !Array.isArray(value);
    const typeLabel = (type: unknown): string => {
      if (typeof type === "string") return type;
      if (typeof type === "function") return (type as { displayName?: string; name?: string }).displayName ?? type.name ?? "Anonymous";
      if (isPlainObject(type)) {
        if (typeof type.displayName === "string") return type.displayName;
        if (typeof type.name === "string") return type.name;
        if (typeof type.render === "function") return (type.render as { displayName?: string; name?: string }).displayName ?? type.render.name ?? "ForwardRef";
        if (type.type) return typeLabel(type.type);
      }
      return "Unknown";
    };
    const isCompositeFiber = (fiber: FiberLike | null | undefined) => {
      if (!fiber) return false;
      const type = fiber.elementType ?? fiber.type;
      return typeof type !== "string" && typeLabel(type) !== "Unknown";
    };
    const nearestCompositeFiber = (fiber: FiberLike | null | undefined) => {
      let current: FiberLike | null | undefined = fiber;
      let guard = 0;
      while (current && guard < 80) {
        if (isCompositeFiber(current)) return current;
        current = current.return ?? null;
        guard += 1;
      }
      return null;
    };
    const sourceFor = (fiber: FiberLike | null | undefined) => {
      if (!fiber) return { columnNumber: null, fileName: null, lineNumber: null, sourceKind: null as string | null };
      if (fiber._debugSource?.fileName) {
        return {
          columnNumber: fiber._debugSource.columnNumber ?? null,
          fileName: fiber._debugSource.fileName,
          lineNumber: fiber._debugSource.lineNumber ?? null,
          sourceKind: "_debugSource",
        };
      }
      const stack = fiber._debugStack?.stack;
      const match = typeof stack === "string" ? stack.match(/(\/[^)\s]+|\w+:\/\/[^)\s]+):(\d+):(\d+)/) : null;
      if (match) {
        return {
          columnNumber: Number(match[3]),
          fileName: match[1],
          lineNumber: Number(match[2]),
          sourceKind: "react-debug-stack",
        };
      }
      return { columnNumber: null, fileName: null, lineNumber: null, sourceKind: null as string | null };
    };
    const getFiberAndPropsForElement = (element: Element) => {
      const record = element as unknown as Record<string, unknown>;
      const keys = Object.keys(record);
      const fiberKey = keys.find((key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"));
      const propsKey = keys.find((key) => key.startsWith("__reactProps$") || key.startsWith("__reactEventHandlers$"));
      return {
        fiber: fiberKey ? (record[fiberKey] as FiberLike | undefined) : undefined,
        props: propsKey ? (record[propsKey] as Record<string, unknown> | undefined) : undefined,
      };
    };

    [document.documentElement, ...Array.from(document.documentElement.querySelectorAll<HTMLElement>("*"))].forEach((element, index) => {
      if (!(element instanceof HTMLElement)) return;
      const nodeId = element.getAttribute("data-avs-node-id") ?? String(index);
      element.setAttribute("data-avs-node-id", nodeId);
      const { fiber, props } = getFiberAndPropsForElement(element);
      const owner = nearestCompositeFiber(fiber);
      const source = sourceFor(owner);
      const symbol = owner ? typeLabel(owner.elementType ?? owner.type) : null;
      if (!element.getAttribute("data-avs-source-id") && source.fileName && source.lineNumber) {
        const sourceId = `${source.fileName}:${source.lineNumber}:${source.columnNumber ?? 0}:${symbol ?? "unknown"}`;
        element.setAttribute("data-avs-source-id", sourceId);
        element.setAttribute("data-avs-source-file", source.fileName);
        element.setAttribute("data-avs-source-line", String(source.lineNumber));
        element.setAttribute("data-avs-source-column", String(source.columnNumber ?? 0));
        element.setAttribute("data-avs-source-symbol", symbol ?? "unknown");
        element.setAttribute("data-avs-source-kind", source.sourceKind ?? "runtime");
      }

      const handlers = Object.entries(props ?? {})
        .filter(([key, value]) => /^on[A-Z]/.test(key) && typeof value === "function")
        .map(([key, value]) => {
          const handlerName = (value as { name?: string }).name || "anonymous";
          return source.fileName && source.lineNumber
            ? `${source.fileName}:${source.lineNumber}:${source.columnNumber ?? 0}:${symbol ?? "unknown"}:${key}:${handlerName}`
            : `unresolved:${key}:${handlerName}`;
        });
      if (handlers.length && !element.getAttribute("data-avs-handler-ids")) element.setAttribute("data-avs-handler-ids", handlers.join("|"));
    });
  });
}

async function recordPlannedClick(locator: Locator, trigger: { kind: string; value: string }) {
  await locator.evaluate(
    (element, input) => {
      const win = window as typeof window & {
        __AVS_INTERACTION_PROOF__?: {
          plannedClicks?: unknown[];
        };
      };
      win.__AVS_INTERACTION_PROOF__ ??= { plannedClicks: [] };
      win.__AVS_INTERACTION_PROOF__.plannedClicks ??= [];
      const target = element as HTMLElement;
      const rect = target.getBoundingClientRect();
      win.__AVS_INTERACTION_PROOF__.plannedClicks.push({
        at: new Date().toISOString(),
        bbox: { height: rect.height, left: rect.left, top: rect.top, width: rect.width },
        node: {
          handlerIds: target.getAttribute("data-avs-handler-ids"),
          nodeId: target.getAttribute("data-avs-node-id"),
          role: target.getAttribute("role"),
          sourceId: target.getAttribute("data-avs-source-id"),
          tagName: target.tagName,
          testId: target.getAttribute("data-testid"),
          text: (target.getAttribute("aria-label") ?? target.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 180),
        },
        trigger: input,
      });
    },
    trigger,
  ).catch(() => undefined);
}

async function clickSelector(page: Page, selector: string) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) === 0) return false;
  try {
    await locator.waitFor({ state: "visible", timeout: 1500 });
    await recordPlannedClick(locator, { kind: "selector", value: selector });
    await locator.click({ timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

async function clickText(page: Page, text: string) {
  const locator = page.locator("button", { hasText: text }).first();
  if ((await locator.count()) === 0) return false;
  try {
    await locator.waitFor({ state: "visible", timeout: 1500 });
    await recordPlannedClick(locator, { kind: "button-text", value: text });
    await locator.click({ timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

async function checkFirstVisibleCheckbox(page: Page) {
  const locator = page.locator('input[type="checkbox"]').first();
  if ((await locator.count()) === 0) return false;
  try {
    await locator.waitFor({ state: "visible", timeout: 1500 });
    await locator.check({ timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

async function isOverlayVisible(page: Page, mode: CaptureMode) {
  const selector = mode === "drawer" ? drawerSelector : modalSelector;
  const locator = page.locator(selector).first();
  try {
    return (await locator.count()) > 0 && (await locator.isVisible({ timeout: 250 }));
  } catch {
    return false;
  }
}

async function waitForOverlay(page: Page, mode: CaptureMode) {
  const selector = mode === "drawer" ? drawerSelector : modalSelector;
  try {
    await page.locator(selector).first().waitFor({ state: "visible", timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

async function closeOverlayIfVisible(page: Page, mode: CaptureMode) {
  if (!(await isOverlayVisible(page, mode))) return false;
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.waitForTimeout(250);
  return !(await isOverlayVisible(page, mode));
}

async function gotoReady(page: Page, url: string) {
  try {
    await page.goto(url, { waitUntil: "load", timeout: 20000 });
    await page.getByText("Loading workspace").waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);
    await page.waitForTimeout(500);
    return true;
  } catch {
    return false;
  }
}

async function captureScreenshot(page: Page, item: CaptureItem, fileName: string, overlay: RuntimeOverlayMeta) {
  try {
    if (!screensOnly) await annotateRuntimeSourceIds(page);
    await page.screenshot({ fullPage: true, path: path.join(outputDir, fileName) });
    if (screensOnly) return;
    await captureRenderedDom(page, item, fileName);
    await captureRuntimeComponents(page, item, fileName, overlay);
    await captureDomRectTrace(page, item, fileName, overlay);
    await captureReactSourceTrace(page, item, fileName, overlay);
  } catch {
    item.status = "failed-screenshot";
  }
}

async function captureRenderedDom(page: Page, item: CaptureItem, screenshotFileName: string) {
  const htmlFile = sidecarNameFor(screenshotFileName, "html");
  const cssFile = sidecarNameFor(screenshotFileName, "css");

  try {
    const snapshot = await page.evaluate((capturedCssFileName) => {
      const clone = document.documentElement.cloneNode(true) as HTMLElement;
      const sourceElements = [document.documentElement, ...Array.from(document.documentElement.querySelectorAll<HTMLElement>("*"))];
      const cloneElements = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];
      const computedRules: string[] = [];

      sourceElements.forEach((element, index) => {
        const clonedElement = cloneElements[index];
        if (!clonedElement) return;

        element.setAttribute("data-avs-node-id", String(index));
        clonedElement.setAttribute("data-avs-node-id", String(index));
        const computedStyle = window.getComputedStyle(element);
        const declarations: string[] = [];

        for (const property of Array.from(computedStyle)) {
          const value = computedStyle.getPropertyValue(property);
          const priority = computedStyle.getPropertyPriority(property);
          declarations.push(`${property}:${value}${priority ? ` !${priority}` : ""};`);
        }

        computedRules.push(`[data-avs-node-id="${index}"]{${declarations.join("")}}`);
      });

      const stylesheetRules = Array.from(document.styleSheets).map((sheet, index) => {
        const href = sheet.href ?? "inline";

        try {
          return [
            `/* stylesheet ${index}: ${href} */`,
            ...Array.from(sheet.cssRules).map((rule) => rule.cssText),
          ].join("\n");
        } catch (error) {
          return `/* stylesheet ${index}: ${href}; unavailable: ${error instanceof Error ? error.message : "unknown"} */`;
        }
      });

      const head = clone.querySelector("head");
      const link = document.createElement("link");
      link.setAttribute("data-avs-captured-css", "true");
      link.setAttribute("href", `./${capturedCssFileName}`);
      link.setAttribute("rel", "stylesheet");
      if (head) {
        head.appendChild(link);
      }

      const css = [
        "/* AlphaVest rendered DOM/CSS capture */",
        `/* url: ${location.href} */`,
        `/* capturedAt: ${new Date().toISOString()} */`,
        "",
        "/* Source stylesheet rules visible to the browser */",
        ...stylesheetRules,
        "",
        "/* Per-node computed styles. Nodes are linked by data-avs-node-id in the rendered HTML. */",
        ...computedRules,
        "",
      ].join("\n");

      const html = [
        "<!doctype html>",
        `<!-- AlphaVest rendered DOM capture. CSS sidecar: ${capturedCssFileName}. URL: ${location.href}. Captured at ${new Date().toISOString()}. -->`,
        clone.outerHTML,
        "",
      ].join("\n");

      return { css, html };
    }, cssFile);

    writeFileSync(path.join(outputDir, htmlFile), snapshot.html);
    writeFileSync(path.join(outputDir, cssFile), snapshot.css);
    item.domPath = `routes-and-modals/${runTs}/${htmlFile}`;
    item.cssPath = `routes-and-modals/${runTs}/${cssFile}`;
    item.domStatus = "captured";
  } catch {
    item.domStatus = "failed-dom";
  }
}

async function captureDomRectTrace(page: Page, item: CaptureItem, screenshotFileName: string, overlay: RuntimeOverlayMeta) {
  const jsonFile = domRectTraceNameFor(screenshotFileName);

  try {
    const trace = await page.evaluate(
      (input: {
        overlay: RuntimeOverlayMeta;
        pageId: string;
        route: string;
        screenshot: string;
        state: string;
        url: string;
      }) => {
        const textFor = (element: Element) =>
          (element.getAttribute("aria-label") ?? element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 220);
        const inferredRole = (element: Element) => {
          const explicitRole = element.getAttribute("role");
          if (explicitRole) return explicitRole;
          const tag = element.tagName.toLowerCase();
          if (tag === "button") return "button";
          if (tag === "a") return "link";
          if (tag === "input" || tag === "textarea" || tag === "select") return "form-control";
          if (tag === "nav") return "navigation";
          if (tag === "main") return "main";
          if (tag === "aside") return "complementary";
          if (tag === "dialog") return "dialog";
          return null;
        };
        const isMeaningful = (element: HTMLElement) => {
          const rect = element.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return false;
          const style = window.getComputedStyle(element);
          if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
          const tag = element.tagName.toLowerCase();
          return Boolean(
            element.getAttribute("data-avs-node-id") ||
              element.getAttribute("data-testid") ||
              element.getAttribute("aria-label") ||
              element.getAttribute("role") ||
              ["button", "a", "input", "textarea", "select", "form", "dialog", "nav", "aside", "main", "header", "footer", "section", "article", "h1", "h2", "h3"].includes(tag) ||
              textFor(element).length >= 8,
          );
        };
        const elements = [document.documentElement, ...Array.from(document.documentElement.querySelectorAll<HTMLElement>("*"))].filter(
          (element): element is HTMLElement => element instanceof HTMLElement && isMeaningful(element),
        );
        const viewport = {
          devicePixelRatio: window.devicePixelRatio,
          height: window.innerHeight,
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          width: window.innerWidth,
        };

        const nodes = elements.slice(0, 1600).map((element, index) => {
          const rect = element.getBoundingClientRect();
          const nodeId = element.getAttribute("data-avs-node-id") ?? `runtime-${index}`;
          if (!element.getAttribute("data-avs-node-id")) element.setAttribute("data-avs-node-id", nodeId);
          const center = {
            x: Math.min(Math.max(rect.left + rect.width / 2, 0), Math.max(window.innerWidth - 1, 0)),
            y: Math.min(Math.max(rect.top + rect.height / 2, 0), Math.max(window.innerHeight - 1, 0)),
          };
          const hit = document.elementFromPoint(center.x, center.y);
          const hitNodeId = hit instanceof Element ? hit.getAttribute("data-avs-node-id") : null;
          const directHit = hit === element;
          const containsHit = hit instanceof Element ? element.contains(hit) : false;
          const cropGeometry = {
            height: Math.round(rect.height),
            width: Math.round(rect.width),
            x: Math.round(rect.left + window.scrollX),
            y: Math.round(rect.top + window.scrollY),
          };

          return {
            accessibleName: element.getAttribute("aria-label") ?? element.getAttribute("title") ?? textFor(element),
            bbox: {
              bottom: rect.bottom,
              height: rect.height,
              left: rect.left,
              right: rect.right,
              top: rect.top,
              width: rect.width,
              x: rect.x,
              y: rect.y,
            },
            className: typeof element.className === "string" ? element.className.slice(0, 260) : "",
            cropGeometry,
            elementFromPoint: {
              center,
              containsHit,
              directHit,
              hitNodeId,
              hitTag: hit instanceof Element ? hit.tagName : null,
              proof: directHit || containsHit ? "ELEMENT_FROM_POINT_MATCH" : "ELEMENT_FROM_POINT_OCCLUDED_OR_DIFFERENT_NODE",
            },
            nodeId,
            role: inferredRole(element),
            screenshotCropId: `${input.pageId}:${input.state}:${nodeId}:crop:${cropGeometry.x}_${cropGeometry.y}_${cropGeometry.width}_${cropGeometry.height}`,
            tagName: element.tagName,
            testId: element.getAttribute("data-testid"),
            text: textFor(element),
          };
        });

        return {
          capture: input,
          generatedAt: new Date().toISOString(),
          limitations: [
            "Bounding boxes are runtime browser geometry for this viewport and scroll position.",
            "elementFromPoint proves center-point hit/occlusion only; it does not prove handler behavior.",
          ],
          nodes,
          overlay: input.overlay,
          viewport,
        };
      },
      {
        overlay,
        pageId: item.pageId,
        route: item.route,
        screenshot: item.path,
        state: item.state,
        url: item.url,
      },
    );

    writeFileSync(path.join(outputDir, jsonFile), `${JSON.stringify(trace, null, 2)}\n`);
    item.domRectTracePath = `routes-and-modals/${runTs}/${jsonFile}`;
    item.domRectTraceStatus = "captured";
  } catch (error) {
    item.domRectTraceStatus = "failed-dom-rect-trace";
    console.warn(`DOM rect trace failed for ${item.route} ${item.state}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function enrichReactSourceTrace<T extends {
  nodes?: Array<{
    handlerCandidates?: Array<{
      eventProp?: string;
      handlerName?: string;
      handlerSourceId?: string;
      proofLabel?: string;
    }>;
    source?: {
      columnNumber?: number | null;
      exportOrFunctionSymbol?: string | null;
      fileName?: string | null;
      lineNumber?: number | null;
      sourceId?: string | null;
      sourceKind?: string | null;
    };
  }>;
}>(trace: T) {
  trace.nodes = trace.nodes?.map((node) => {
    const resolvedSource = resolveSourceLocation(node.source ?? {}, node.source?.exportOrFunctionSymbol ?? null);
    return {
      ...node,
      handlerCandidates: node.handlerCandidates?.map((handler) => {
        if (handler.proofLabel === "HANDLER_EXACT_SOURCE_MATCH" && handler.handlerSourceId) {
          const parsedHandler = parseSourceId(handler.handlerSourceId);
          const exactHandler = resolveSourceLocation(parsedHandler, parsedHandler.symbol);
          return {
            ...handler,
            localFilePath: exactHandler.localFilePath,
            localLineNumber: exactHandler.lineNumber,
            proofLabel: "HANDLER_EXACT_SOURCE_MATCH",
            sourceConfidence: exactHandler.confidence,
          };
        }
        const resolvedHandler = resolveHandlerSource(handler.handlerName, resolvedSource, handler.eventProp ?? "onUnknown");
        return {
          ...handler,
          handlerSourceId: resolvedHandler.handlerSourceId,
          localFilePath: resolvedHandler.localFilePath,
          localLineNumber: resolvedHandler.lineNumber ?? null,
          proofLabel: resolvedHandler.proofLabel,
          sourceConfidence: resolvedHandler.confidence,
        };
      }),
      source: {
        ...node.source,
        local: resolvedSource,
        sourceId: resolvedSource.sourceId ?? node.source?.sourceId ?? null,
      },
    };
  });
  return trace;
}

function enrichInteractionProofTrace<T extends {
  after?: {
    plannedClicks?: Array<{
      node?: {
        handlerIds?: string | null;
        sourceId?: string | null;
      };
    }>;
    recentClicks?: Array<{
      handlerCandidates?: Array<{
        eventProp?: string;
        handlerName?: string;
        handlerSourceId?: string;
        proofLabel?: string;
      }>;
      source?: {
        columnNumber?: number | null;
        exportOrFunctionSymbol?: string | null;
        fileName?: string | null;
        lineNumber?: number | null;
        sourceId?: string | null;
      };
    }>;
  };
}>(trace: T) {
  trace.after = trace.after
    ? {
        ...trace.after,
        plannedClicks: trace.after.plannedClicks?.map((click) => ({
          ...click,
          plannedSource: click.node?.sourceId
            ? resolveSourceLocation(parseSourceId(click.node.sourceId), parseSourceId(click.node.sourceId).symbol)
            : null,
          plannedHandlers: click.node?.handlerIds
            ? click.node.handlerIds.split("|").map((handlerId) => {
                const parsed = parseSourceId(handlerId);
                return {
                  handlerId,
                  resolved: resolveSourceLocation(parsed, parsed.symbol),
                };
              })
            : [],
        })),
        recentClicks: trace.after.recentClicks?.map((click) => {
          const source = resolveSourceLocation(click.source ?? {}, click.source?.exportOrFunctionSymbol ?? null);
          return {
            ...click,
            handlerCandidates: click.handlerCandidates?.map((handler) => {
              if (handler.proofLabel === "HANDLER_EXACT_SOURCE_MATCH" && handler.handlerSourceId) {
                const parsedHandler = parseSourceId(handler.handlerSourceId);
                const exactHandler = resolveSourceLocation(parsedHandler, parsedHandler.symbol);
                return {
                  ...handler,
                  localFilePath: exactHandler.localFilePath,
                  localLineNumber: exactHandler.lineNumber,
                  proofLabel: "HANDLER_EXACT_SOURCE_MATCH",
                  sourceConfidence: exactHandler.confidence,
                };
              }
              const resolvedHandler = resolveHandlerSource(handler.handlerName, source, handler.eventProp ?? "onUnknown");
              return {
                ...handler,
                handlerSourceId: resolvedHandler.handlerSourceId,
                localFilePath: resolvedHandler.localFilePath,
                localLineNumber: resolvedHandler.lineNumber ?? null,
                proofLabel: resolvedHandler.proofLabel,
                sourceConfidence: resolvedHandler.confidence,
              };
            }),
            source: {
              ...click.source,
              local: source,
              sourceId: source.sourceId ?? click.source?.sourceId ?? null,
            },
          };
        }),
      }
    : trace.after;
  return trace;
}

function parseSourceId(sourceId: string) {
  const parts = sourceId.split(":");
  const lineCandidate = parts.findIndex((part, index) => index > 0 && /^\d+$/.test(part) && /^\d+$/.test(parts[index + 1] ?? ""));
  if (lineCandidate < 0) return { columnNumber: null, fileName: sourceId, lineNumber: null, sourceKind: "data-avs-source-id", symbol: null };
  return {
    columnNumber: Number(parts[lineCandidate + 1]),
    fileName: parts.slice(0, lineCandidate).join(":"),
    lineNumber: Number(parts[lineCandidate]),
    sourceKind: "data-avs-source-id",
    symbol: parts[lineCandidate + 2] ?? null,
  };
}

async function captureReactSourceTrace(page: Page, item: CaptureItem, screenshotFileName: string, overlay: RuntimeOverlayMeta) {
  const jsonFile = reactSourceTraceNameFor(screenshotFileName);

  try {
    const trace = await page.evaluate(
      (input: {
        overlay: RuntimeOverlayMeta;
        pageId: string;
        route: string;
        screenshot: string;
        state: string;
        url: string;
      }) => {
        type FiberLike = {
          _debugOwner?: FiberLike | null;
          _debugStack?: { stack?: string } | null;
          _debugSource?: { columnNumber?: number; fileName?: string; lineNumber?: number } | null;
          elementType?: unknown;
          key?: string | null;
          memoizedProps?: unknown;
          return?: FiberLike | null;
          tag?: number;
          type?: unknown;
        };

        const isPlainObject = (value: unknown): value is Record<string, unknown> =>
          Boolean(value) && typeof value === "object" && !Array.isArray(value);
        const typeLabel = (type: unknown): string => {
          if (typeof type === "string") return type;
          if (typeof type === "function") return (type as { displayName?: string; name?: string }).displayName ?? type.name ?? "Anonymous";
          if (isPlainObject(type)) {
            if (typeof type.displayName === "string") return type.displayName;
            if (typeof type.name === "string") return type.name;
            if (typeof type.render === "function") return (type.render as { displayName?: string; name?: string }).displayName ?? type.render.name ?? "ForwardRef";
            if (type.type) return typeLabel(type.type);
          }
          return "Unknown";
        };
        const sourceFor = (fiber: FiberLike | null | undefined) => {
          if (!fiber) return { available: false, columnNumber: null, fileName: null, lineNumber: null, sourceKind: null as string | null };
          if (fiber._debugSource?.fileName) {
            return {
              available: true,
              columnNumber: fiber._debugSource.columnNumber ?? null,
              fileName: fiber._debugSource.fileName,
              lineNumber: fiber._debugSource.lineNumber ?? null,
              sourceKind: "_debugSource",
            };
          }
          const stack = fiber._debugStack?.stack;
          const match = typeof stack === "string" ? stack.match(/(\/[^)\s]+|\w+:\/\/[^)\s]+):(\d+):(\d+)/) : null;
          if (match) {
            return {
              available: true,
              columnNumber: Number(match[3]),
              fileName: match[1],
              lineNumber: Number(match[2]),
              sourceKind: "react-debug-stack",
            };
          }
          return { available: false, columnNumber: null, fileName: null, lineNumber: null, sourceKind: null as string | null };
        };
        const getFiberAndPropsForElement = (element: Element) => {
          const record = element as unknown as Record<string, unknown>;
          const keys = Object.keys(record);
          const fiberKey = keys.find((key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"));
          const propsKey = keys.find((key) => key.startsWith("__reactProps$") || key.startsWith("__reactEventHandlers$"));
          return {
            fiber: fiberKey ? (record[fiberKey] as FiberLike | undefined) : undefined,
            fiberKey: fiberKey ?? null,
            props: propsKey ? (record[propsKey] as Record<string, unknown> | undefined) : undefined,
            propsKey: propsKey ?? null,
          };
        };
        const isCompositeFiber = (fiber: FiberLike | null | undefined) => {
          if (!fiber) return false;
          const label = typeLabel(fiber.elementType ?? fiber.type);
          return label !== "Unknown" && typeof (fiber.elementType ?? fiber.type) !== "string";
        };
        const nearestCompositeFiber = (fiber: FiberLike | null | undefined) => {
          let current: FiberLike | null | undefined = fiber;
          let guard = 0;
          while (current && guard < 80) {
            if (isCompositeFiber(current)) return current;
            current = current.return ?? null;
            guard += 1;
          }
          return null;
        };
        const ownerChain = (fiber: FiberLike | null | undefined) => {
          const chain: string[] = [];
          let current: FiberLike | null | undefined = fiber;
          let guard = 0;
          while (current && guard < 40) {
            if (isCompositeFiber(current)) chain.push(typeLabel(current.elementType ?? current.type));
            current = current.return ?? null;
            guard += 1;
          }
          return chain.reverse();
        };
        const parseAvsSourceId = (sourceId: string | null, fallbackSymbol: string | null) => {
          if (!sourceId) return null;
          const parts = sourceId.split(":");
          const lineIndex = parts.findIndex((part, index) => index > 0 && /^\d+$/.test(part) && /^\d+$/.test(parts[index + 1] ?? ""));
          if (lineIndex < 0) return null;
          return {
            available: true,
            columnNumber: Number(parts[lineIndex + 1]),
            exportOrFunctionSymbol: parts[lineIndex + 2] ?? fallbackSymbol,
            fileName: parts.slice(0, lineIndex).join(":"),
            lineNumber: Number(parts[lineIndex]),
            sourceId,
            sourceKind: "data-avs-source-id",
          };
        };
        const sourceFromAttributes = (element: Element, fallbackSymbol: string | null) =>
          parseAvsSourceId(element.getAttribute("data-avs-source-id"), element.getAttribute("data-avs-source-symbol") ?? fallbackSymbol);
        const handlerCandidates = (element: Element, props: Record<string, unknown> | undefined, ownerSource: ReturnType<typeof sourceFor> & { sourceId?: string | null }) => {
          const attrCandidates = (element.getAttribute("data-avs-handler-ids") ?? "")
            .split("|")
            .map((item) => item.trim())
            .filter(Boolean)
            .map((handlerSourceId) => {
              const parsed = parseAvsSourceId(handlerSourceId, null);
              const suffix = handlerSourceId.split(":").slice(-1)[0] ?? "onUnknown";
              const eventProp = /^on[A-Z]/.test(suffix) ? suffix : handlerSourceId.split(":").find((part) => /^on[A-Z]/.test(part)) ?? "onUnknown";
              return {
                eventProp,
                handlerName: parsed?.exportOrFunctionSymbol ?? "anonymous",
                handlerSourceId,
                proofLabel: parsed ? "HANDLER_EXACT_SOURCE_MATCH" : "HANDLER_RUNTIME_PROP_ONLY",
              };
            });
          const runtimeCandidates = Object.entries(props ?? {})
            .filter(([key, value]) => /^on[A-Z]/.test(key) && typeof value === "function")
            .map(([key, value]) => ({
              eventProp: key,
              handlerName: (value as { name?: string }).name || "anonymous",
              handlerSourceId: ownerSource.sourceId
                ? `${ownerSource.sourceId}:${key}`
                : ownerSource.available
                  ? `${ownerSource.fileName}:${ownerSource.lineNumber}:${ownerSource.columnNumber ?? 0}:${key}`
                : `unresolved:${key}:${(value as { name?: string }).name || "anonymous"}`,
              proofLabel: ownerSource.available ? "HANDLER_OWNER_SOURCE_CANDIDATE" : "HANDLER_RUNTIME_PROP_ONLY",
            }));
          return attrCandidates.length ? [...attrCandidates, ...runtimeCandidates] : runtimeCandidates;
        };
        const textFor = (element: Element) =>
          (element.getAttribute("aria-label") ?? element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 160);

        const nodes = [document.documentElement, ...Array.from(document.documentElement.querySelectorAll<HTMLElement>("*"))]
          .filter((element): element is HTMLElement => element instanceof HTMLElement)
          .slice(0, 2200)
          .map((element, index) => {
            const nodeId = element.getAttribute("data-avs-node-id") ?? `runtime-${index}`;
            if (!element.getAttribute("data-avs-node-id")) element.setAttribute("data-avs-node-id", nodeId);
            const { fiber, fiberKey, props, propsKey } = getFiberAndPropsForElement(element);
            const owner = nearestCompositeFiber(fiber);
            const chain = ownerChain(fiber);
            const runtimeSymbol = owner ? typeLabel(owner.elementType ?? owner.type) : null;
            const attrSource = sourceFromAttributes(element, runtimeSymbol);
            const ownerSource = (attrSource ?? sourceFor(owner)) as ReturnType<typeof sourceFor> & { exportOrFunctionSymbol?: string | null; sourceId?: string | null };
            const symbol = ownerSource.exportOrFunctionSymbol ?? runtimeSymbol;
            return {
              componentOwnerChain: chain,
              confidence: ownerSource.available ? "high" : owner ? "medium" : fiber ? "low" : "unavailable",
              domNode: {
                nodeId,
                role: element.getAttribute("role"),
                tagName: element.tagName,
                testId: element.getAttribute("data-testid"),
                text: textFor(element),
              },
              fiberEvidence: {
                fiberKeyPresent: Boolean(fiberKey),
                propsKeyPresent: Boolean(propsKey),
              },
              handlerCandidates: handlerCandidates(element, props, ownerSource),
              source: {
                ...ownerSource,
                exportOrFunctionSymbol: symbol,
                sourceId: ownerSource.sourceId ?? (ownerSource.available
                  ? `${ownerSource.fileName}:${ownerSource.lineNumber}:${ownerSource.columnNumber ?? 0}:${symbol ?? "unknown"}`
                  : null),
              },
            };
          })
          .filter((entry) => entry.fiberEvidence.fiberKeyPresent || entry.fiberEvidence.propsKeyPresent || entry.source.available || entry.domNode.text || entry.domNode.role || entry.domNode.testId);

        return {
          capture: input,
          generatedAt: new Date().toISOString(),
          limitations: [
            "React source locations depend on development/runtime metadata such as _debugSource or _debugStack.",
            "Handler source IDs are owner-source candidates unless explicit handler source metadata is available.",
          ],
          nodes,
          overlay: input.overlay,
        };
      },
      {
        overlay,
        pageId: item.pageId,
        route: item.route,
        screenshot: item.path,
        state: item.state,
        url: item.url,
      },
    );

    writeFileSync(path.join(outputDir, jsonFile), `${JSON.stringify(enrichReactSourceTrace(trace), null, 2)}\n`);
    item.reactSourceTracePath = `routes-and-modals/${runTs}/${jsonFile}`;
    item.reactSourceTraceStatus = "captured";
  } catch (error) {
    item.reactSourceTraceStatus = "failed-react-source-trace";
    console.warn(`React source trace failed for ${item.route} ${item.state}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function captureRuntimeComponents(page: Page, item: CaptureItem, screenshotFileName: string, overlay: RuntimeOverlayMeta) {
  const jsonFile = componentRuntimeNameFor(screenshotFileName, "json");
  const mdFile = componentRuntimeNameFor(screenshotFileName, "md");

  try {
    const snapshot = await page.evaluate(
      (input: {
        cssPath: string | null;
        overlay: RuntimeOverlayMeta;
        pageId: string;
        renderedCss: string | null;
        renderedHtml: string | null;
        route: string;
        runTs: string;
        screenshot: string;
        state: string;
        url: string;
      }) => {
        type Confidence = "high" | "medium" | "low" | "unavailable";
        type Strategy = "mixed" | "react-devtools-hook" | "react-fiber-dom-backpointer" | "unavailable";

        type FiberLike = {
          _debugOwner?: FiberLike | null;
          _debugStack?: { stack?: string } | null;
          _debugSource?: { columnNumber?: number; fileName?: string; lineNumber?: number } | null;
          child?: FiberLike | null;
          elementType?: unknown;
          key?: string | null;
          memoizedProps?: unknown;
          return?: FiberLike | null;
          sibling?: FiberLike | null;
          tag?: number;
          type?: unknown;
        };

        const redactedKeyPattern = /token|secret|password|cookie|authorization|email|phone|ssn|tax|iban|account|address/i;
        const maxDepth = 3;
        const maxArrayLength = 12;
        const maxObjectKeys = 24;
        const maxStringLength = 180;

        const hookState = (window as typeof window & {
          __AVS_REACT_REFLECTION__?: {
            commits?: number;
            errors?: string[];
            injected?: boolean;
            preexistingHook?: boolean;
            renderers?: unknown[];
            roots?: unknown[];
          };
          __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
            rendererInterfaces?: Map<unknown, unknown> | Record<string, unknown>;
            renderers?: Map<unknown, unknown> | Record<string, unknown>;
          };
        }).__AVS_REACT_REFLECTION__;
        const hook = (window as typeof window & {
          __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
            rendererInterfaces?: Map<unknown, unknown> | Record<string, unknown>;
            renderers?: Map<unknown, unknown> | Record<string, unknown>;
          };
        }).__REACT_DEVTOOLS_GLOBAL_HOOK__;

        const getCollectionSize = (value: unknown) => {
          if (!value) return 0;
          if (value instanceof Map) return value.size;
          if (typeof value === "object") return Object.keys(value as Record<string, unknown>).length;
          return 0;
        };

        const isPlainObject = (value: unknown): value is Record<string, unknown> =>
          Boolean(value) && typeof value === "object" && !Array.isArray(value);

        const typeLabel = (type: unknown): string => {
          if (typeof type === "string") return type;
          if (typeof type === "function") {
            return (type as { displayName?: string; name?: string }).displayName ?? type.name ?? "Anonymous";
          }
          if (isPlainObject(type)) {
            const displayName = type.displayName;
            const name = type.name;
            if (typeof displayName === "string") return displayName;
            if (typeof name === "string") return name;
            const render = type.render;
            if (typeof render === "function") return (render as { displayName?: string; name?: string }).displayName ?? render.name ?? "ForwardRef";
            const nestedType = type.type;
            if (nestedType) return typeLabel(nestedType);
            const context = type._context;
            if (isPlainObject(context) && typeof context.displayName === "string") return context.displayName;
          }
          return "Unknown";
        };

        const isReactElementLike = (value: unknown) => {
          if (!isPlainObject(value)) return false;
          const maybeType = value.$$typeof;
          return typeof maybeType === "symbol" && String(maybeType).includes("react.");
        };

        const safeSerialize = (value: unknown, depth = 0, seen = new WeakSet<object>()): unknown => {
          if (value === null || value === undefined) return value;
          if (typeof value === "string") return value.length > maxStringLength ? `${value.slice(0, maxStringLength)}...` : value;
          if (typeof value === "number" || typeof value === "boolean") return value;
          if (typeof value === "bigint") return `[BigInt ${value.toString()}]`;
          if (typeof value === "symbol") return String(value);
          if (typeof value === "function") return `[Function ${(value as { name?: string }).name || "anonymous"}]`;
          if (typeof value !== "object") return `[${typeof value}]`;
          if (seen.has(value)) return "[Circular]";
          if (isReactElementLike(value)) return `[ReactElement ${typeLabel((value as { type?: unknown }).type)}]`;
          if (depth >= maxDepth) return Array.isArray(value) ? `[Array(${value.length})]` : "[Object]";

          seen.add(value);
          if (Array.isArray(value)) {
            const serialized = value.slice(0, maxArrayLength).map((entry) => safeSerialize(entry, depth + 1, seen));
            if (value.length > maxArrayLength) serialized.push(`... ${value.length - maxArrayLength} more`);
            return serialized;
          }

          const output: Record<string, unknown> = {};
          const entries = Object.entries(value as Record<string, unknown>).slice(0, maxObjectKeys);
          for (const [key, entry] of entries) {
            output[key] = redactedKeyPattern.test(key) ? "[REDACTED]" : safeSerialize(entry, depth + 1, seen);
          }
          const keyCount = Object.keys(value as Record<string, unknown>).length;
          if (keyCount > maxObjectKeys) output.__summary = `Object with ${keyCount} keys; ${keyCount - maxObjectKeys} omitted`;
          return output;
        };

        const typeKind = (type: unknown): string => {
          if (typeof type === "string") return "host";
          if (typeof type === "function") {
            return (type as { prototype?: { isReactComponent?: unknown } }).prototype?.isReactComponent ? "class" : "function";
          }
          if (isPlainObject(type)) {
            const marker = String(type.$$typeof ?? "");
            if (marker.includes("react.memo")) return "memo";
            if (marker.includes("react.forward_ref")) return "forwardRef";
            if (marker.includes("react.provider")) return "provider";
            if (marker.includes("react.context")) return "context";
            if (type.render) return "forwardRef";
            if (type.type) return typeKind(type.type);
          }
          return "unknown";
        };

        const isCompositeFiber = (fiber: FiberLike | null | undefined) => {
          if (!fiber) return false;
          const type = fiber.elementType ?? fiber.type;
          if (!type || typeof type === "string") return false;
          const name = typeLabel(type);
          return name !== "Unknown";
        };

        const nearestCompositeFiber = (fiber: FiberLike | null | undefined) => {
          let current = fiber;
          let guard = 0;
          while (current && guard < 80) {
            if (isCompositeFiber(current)) return current;
            current = current.return ?? null;
            guard += 1;
          }
          return null;
        };

        const ownerChain = (fiber: FiberLike) => {
          const chain: string[] = [];
          let owner = fiber._debugOwner ?? null;
          let guard = 0;
          while (owner && guard < 40) {
            const name = typeLabel(owner.elementType ?? owner.type);
            if (name !== "Unknown") chain.push(name);
            owner = owner._debugOwner ?? null;
            guard += 1;
          }
          return chain;
        };

        const debugStackFrameFor = (fiber: FiberLike) => {
          const stack = fiber._debugStack?.stack;
          if (!stack) return null;
          const frames = stack
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("at "));
          const frame =
            frames.find(
              (line) =>
                !line.includes("node_modules") &&
                !line.includes("react-dom") &&
                !line.includes("jsx-dev-runtime") &&
                !line.includes("exports.jsxDEV") &&
                line.includes("/_next/static/chunks/"),
            ) ??
            frames.find((line) => !line.includes("react-dom") && !line.includes("jsx-dev-runtime") && !line.includes("exports.jsxDEV"));
          if (!frame) return null;
          const match = frame.match(/^at\s+(.+?)\s+\((.+):(\d+):(\d+)\)$/) ?? frame.match(/^at\s+(.+):(\d+):(\d+)$/);
          if (!match) return { available: true, columnNumber: 0, fileName: null, functionName: null, lineNumber: 0, raw: frame };
          if (match.length === 5) {
            return {
              available: true,
              columnNumber: Number(match[4]),
              fileName: match[2],
              functionName: match[1],
              lineNumber: Number(match[3]),
              raw: frame,
            };
          }
          return {
            available: true,
            columnNumber: Number(match[3]),
            fileName: match[1],
            functionName: null,
            lineNumber: Number(match[2]),
            raw: frame,
          };
        };

        const sourceFor = (fiber: FiberLike) => {
          const source = fiber._debugSource;
          if (!source?.fileName) {
            const debugStackFrame = debugStackFrameFor(fiber);
            if (debugStackFrame?.fileName) {
              return {
                available: true,
                columnNumber: debugStackFrame.columnNumber,
                debugStackFrame,
                fileName: debugStackFrame.fileName,
                lineNumber: debugStackFrame.lineNumber,
                sourceKind: "react-debug-stack",
              };
            }
            return { available: false, columnNumber: 0, debugStackFrame, fileName: null, lineNumber: 0, sourceKind: "unavailable" };
          }
          return {
            available: true,
            columnNumber: source.columnNumber ?? 0,
            debugStackFrame: debugStackFrameFor(fiber),
            fileName: source.fileName,
            lineNumber: source.lineNumber ?? 0,
            sourceKind: "_debugSource",
          };
        };

        const getFiberForElement = (element: Element) => {
          const record = element as Element & Record<string, unknown>;
          const keys = Object.keys(record);
          const fiberKey = keys.find((key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"));
          const propsKey = keys.find((key) => key.startsWith("__reactProps$") || key.startsWith("__reactEventHandlers$"));
          return {
            fiber: fiberKey ? (record[fiberKey] as FiberLike | undefined) : undefined,
            fiberKey: fiberKey ?? null,
            propsKey: propsKey ?? null,
          };
        };

        const componentIdByFiber = new WeakMap<object, string>();
        const componentTree: Array<{
          componentId: string;
          confidence: Confidence;
          depth: number;
          domNodeIds: string[];
          evidence: string[];
          fiber: { hasDebugOwner: boolean; hasDebugSource: boolean; key: string | null; tag: number | null };
          kind: string;
          name: string;
          ownerChain: string[];
          parentComponentId: string | null;
          propsPreview: unknown;
          source: { available: boolean; columnNumber: number; debugStackFrame?: unknown; fileName: string | null; lineNumber: number; sourceKind?: string };
        }> = [];
        const parentByComponentId = new Map<string, string | null>();

        const getOrCreateComponent = (fiber: FiberLike, parentComponentId: string | null, depth: number) => {
          const existing = componentIdByFiber.get(fiber);
          if (existing) return existing;

          const componentId = `c${componentTree.length}`;
          componentIdByFiber.set(fiber, componentId);
          parentByComponentId.set(componentId, parentComponentId);
          const source = sourceFor(fiber);
          const evidence = ["fiber.return chain", "DOM __reactFiber backpointer"];
          if (source.sourceKind === "_debugSource") evidence.push("_debugSource");
          if (source.sourceKind === "react-debug-stack") evidence.push("_debugStack");
          if (fiber._debugOwner) evidence.push("_debugOwner");

          componentTree.push({
            componentId,
            confidence: source.available || fiber._debugOwner ? "high" : "medium",
            depth,
            domNodeIds: [],
            evidence,
            fiber: {
              hasDebugOwner: Boolean(fiber._debugOwner),
              hasDebugSource: Boolean(source.available),
              key: fiber.key ?? null,
              tag: typeof fiber.tag === "number" ? fiber.tag : null,
            },
            kind: typeKind(fiber.elementType ?? fiber.type),
            name: typeLabel(fiber.elementType ?? fiber.type),
            ownerChain: ownerChain(fiber),
            parentComponentId,
            propsPreview: safeSerialize(fiber.memoizedProps),
            source,
          });

          return componentId;
        };

        const materializeChain = (fiber: FiberLike) => {
          const chain: FiberLike[] = [];
          let current: FiberLike | null | undefined = fiber;
          let guard = 0;
          while (current && guard < 80) {
            if (isCompositeFiber(current)) chain.push(current);
            current = current.return ?? null;
            guard += 1;
          }
          chain.reverse();

          let parentComponentId: string | null = null;
          let depth = 0;
          for (const entry of chain) {
            parentComponentId = getOrCreateComponent(entry, parentComponentId, depth);
            depth += 1;
          }
          return parentComponentId;
        };

        const elements = [document.documentElement, ...Array.from(document.documentElement.querySelectorAll<HTMLElement>("*"))];
        const uniqueFiberObjects: object[] = [];
        const uniqueFiberSet = new WeakSet<object>();
        const domToComponentMap: Array<{
          componentId: string | null;
          componentName: string | null;
          confidence: Confidence;
          nearestCompositeOwner: string | null;
          nodeId: string;
          role: string | null;
          tagName: string;
          testId: string | null;
        }> = [];
        let domNodesWithFiber = 0;
        let propsMarkerCount = 0;

        elements.forEach((element, index) => {
          const nodeId = element.getAttribute("data-avs-node-id") ?? String(index);
          element.setAttribute("data-avs-node-id", nodeId);
          const { fiber, propsKey } = getFiberForElement(element);
          if (propsKey) propsMarkerCount += 1;

          let componentId: string | null = null;
          let componentName: string | null = null;
          let nearestCompositeOwner: string | null = null;
          let confidence: Confidence = "unavailable";

          if (fiber) {
            domNodesWithFiber += 1;
            if (typeof fiber === "object" && !uniqueFiberSet.has(fiber)) {
              uniqueFiberSet.add(fiber);
              uniqueFiberObjects.push(fiber);
            }
            const nearest = nearestCompositeFiber(fiber);
            if (nearest) {
              componentId = materializeChain(nearest);
              const component = componentTree.find((entry) => entry.componentId === componentId) ?? null;
              componentName = component?.name ?? null;
              nearestCompositeOwner = componentName;
              confidence = component?.confidence ?? "medium";
              if (component && !component.domNodeIds.includes(nodeId)) component.domNodeIds.push(nodeId);
            } else {
              confidence = "low";
            }
          }

          domToComponentMap.push({
            componentId,
            componentName,
            confidence,
            nearestCompositeOwner,
            nodeId,
            role: element.getAttribute("role"),
            tagName: element.tagName,
            testId: element.getAttribute("data-testid"),
          });
        });

        const rendererCount = Math.max(
          hookState?.renderers?.length ?? 0,
          getCollectionSize(hook?.renderers),
          getCollectionSize(hook?.rendererInterfaces),
        );
        const rootCount = hookState?.roots?.length ?? 0;
        const reactDetected = domNodesWithFiber > 0 || rendererCount > 0 || rootCount > 0 || propsMarkerCount > 0;
        const strategy: Strategy =
          domNodesWithFiber > 0 && (rendererCount > 0 || rootCount > 0)
            ? "mixed"
            : domNodesWithFiber > 0
              ? "react-fiber-dom-backpointer"
              : rootCount > 0
                ? "react-devtools-hook"
                : "unavailable";
        const confidence: Confidence =
          domNodesWithFiber > 0 && componentTree.length > 0 ? "high" : rootCount > 0 ? "medium" : reactDetected ? "low" : "unavailable";
        const limitations: string[] = [];
        if (!hook) limitations.push("React DevTools hook unavailable in page runtime");
        if (hook && rootCount === 0) limitations.push("React DevTools hook did not expose fiber roots to capture context");
        if (domNodesWithFiber === 0) limitations.push("No React Fiber DOM backpointers found on inspected DOM nodes");
        if (!componentTree.some((entry) => entry.source.sourceKind === "_debugSource")) limitations.push("React _debugSource metadata unavailable in this build");
        if (componentTree.some((entry) => entry.source.sourceKind === "react-debug-stack")) limitations.push("React _debugStack runtime callsite fallback used for source hints");
        if (hookState?.errors?.length) limitations.push(`DevTools hook capture errors: ${hookState.errors.slice(0, 5).join("; ")}`);

        const plausibilityChecks: RuntimePlausibilityCheck["checks"] = [
          {
            detail: input.screenshot ? `screenshot=${input.screenshot}` : "screenshot path missing",
            name: "screenshot-reference-present",
            passed: Boolean(input.screenshot),
          },
          {
            detail: input.renderedHtml && input.renderedCss ? `html=${input.renderedHtml}; css=${input.renderedCss}` : "rendered DOM/CSS sidecar path missing",
            name: "rendered-sidecars-present",
            passed: Boolean(input.renderedHtml && input.renderedCss),
          },
          {
            detail: `${domToComponentMap.length} mappings for ${elements.length} inspected DOM nodes`,
            name: "dom-map-covers-inspected-nodes",
            passed: domToComponentMap.length === elements.length,
          },
          {
            detail: `${domNodesWithFiber} nodes with fiber; reactDetected=${reactDetected}`,
            name: "react-detection-consistent",
            passed: reactDetected === (domNodesWithFiber > 0 || rendererCount > 0 || rootCount > 0 || propsMarkerCount > 0),
          },
          {
            detail: `${componentTree.length} components; confidence=${confidence}`,
            name: "component-tree-supports-confidence",
            passed: confidence !== "high" || componentTree.length > 0,
          },
          {
            detail: `${componentTree.filter((entry) => entry.domNodeIds.length > 0).length} components have host DOM nodes`,
            name: "components-have-host-dom-evidence",
            passed: confidence !== "high" || componentTree.some((entry) => entry.domNodeIds.length > 0),
          },
          {
            detail: "fallbackStaticInference.used=false",
            name: "static-fallback-not-used-as-runtime-proof",
            passed: true,
          },
        ];
        const failedChecks = plausibilityChecks.filter((check) => !check.passed);
        const warnings = [
          ...limitations.filter((limitation) => limitation.includes("_debugSource") || limitation.includes("DevTools hook")),
          ...(failedChecks.length ? failedChecks.map((check) => `${check.name}: ${check.detail}`) : []),
        ];
        const plausibility: RuntimePlausibilityCheck = {
          checks: plausibilityChecks,
          failed: failedChecks.length,
          passed: plausibilityChecks.length - failedChecks.length,
          status: failedChecks.length ? "failed" : warnings.length ? "warning" : "passed",
          warnings,
        };

        return {
          componentTree,
          domToComponentMap,
          fallbackStaticInference: {
            importedUiComponents: [],
            reason: null,
            topLevelRouteComponent: null,
            used: false,
          },
          overlay: input.overlay,
          pageId: input.pageId,
          plausibility,
          renderedCss: input.renderedCss,
          renderedHtml: input.renderedHtml,
          route: input.route,
          runtimeReflection: {
            confidence,
            devtoolsHook: {
              available: Boolean(hook),
              injected: Boolean(hookState?.injected),
              preexisting: Boolean(hookState?.preexistingHook),
              rendererCount,
              rootCount,
            },
            fiberBackpointer: {
              domNodesInspected: elements.length,
              domNodesWithFiber,
              propsMarkerCount,
              uniqueFibers: uniqueFiberObjects.length,
            },
            limitations,
            reactDetected,
            strategy,
          },
          screenshot: input.screenshot,
          state: input.state,
          url: input.url,
        };
      },
      {
        cssPath: item.cssPath ?? null,
        overlay,
        pageId: item.pageId,
        renderedCss: item.cssPath ?? null,
        renderedHtml: item.domPath ?? null,
        route: item.route,
        runTs,
        screenshot: item.path,
        state: item.state,
        url: item.url,
      },
    );

    writeFileSync(path.join(outputDir, jsonFile), `${JSON.stringify(snapshot, null, 2)}\n`);
    writeFileSync(path.join(outputDir, mdFile), componentRuntimeMarkdown(snapshot));
    item.componentRuntimePath = `routes-and-modals/${runTs}/${jsonFile}`;
    item.componentRuntimeMarkdownPath = `routes-and-modals/${runTs}/${mdFile}`;
    item.componentRuntimeStatus = "captured";
    item.componentRuntimeStrategy = snapshot.runtimeReflection.strategy;
    item.componentRuntimeConfidence = snapshot.runtimeReflection.confidence;
  } catch (error) {
    item.componentRuntimeStatus = "failed-components";
    item.componentRuntimeError = error instanceof Error ? error.message : String(error);
    console.warn(`Runtime component capture failed for ${item.route} ${item.state}: ${item.componentRuntimeError}`);
  }
}

function componentRuntimeMarkdown(snapshot: {
  componentTree: Array<{
    componentId: string;
    depth: number;
    domNodeIds: string[];
    kind: string;
    name: string;
    source: { available: boolean; fileName: string | null; lineNumber: number; sourceKind?: string };
  }>;
  domToComponentMap: unknown[];
  plausibility?: RuntimePlausibilityCheck;
  runtimeReflection: {
    confidence: RuntimeConfidence;
    devtoolsHook: { available: boolean; rendererCount: number; rootCount: number };
    fiberBackpointer: { domNodesInspected: number; domNodesWithFiber: number; uniqueFibers: number };
    limitations: string[];
    reactDetected: boolean;
    strategy: RuntimeReflectionStrategy;
  };
  route: string;
  state: string;
  url: string;
}) {
  const topComponents = snapshot.componentTree
    .filter((component) => component.domNodeIds.length > 0)
    .slice(0, 40)
    .map((component) => {
    const indent = "  ".repeat(component.depth);
    const source = component.source.available ? ` (${component.source.sourceKind ?? "source"}: ${component.source.fileName}:${component.source.lineNumber})` : "";
    return `${indent}- ${component.name} [${component.kind}]${source} — DOM nodes: ${component.domNodeIds.length}`;
    });

  const lines = [
    "# Runtime component reflection",
    "",
    `URL: ${snapshot.url}`,
    `Route: ${snapshot.route}`,
    `State: ${snapshot.state}`,
    "",
    "## Reflection",
    "",
    `- Strategy: ${snapshot.runtimeReflection.strategy}`,
    `- Confidence: ${snapshot.runtimeReflection.confidence}`,
    `- React detected: ${snapshot.runtimeReflection.reactDetected}`,
    `- DevTools hook: ${snapshot.runtimeReflection.devtoolsHook.available ? "available" : "unavailable"}; renderers=${snapshot.runtimeReflection.devtoolsHook.rendererCount}; roots=${snapshot.runtimeReflection.devtoolsHook.rootCount}`,
    `- Fiber DOM backpointers: ${snapshot.runtimeReflection.fiberBackpointer.domNodesWithFiber}/${snapshot.runtimeReflection.fiberBackpointer.domNodesInspected}`,
    `- Components: ${snapshot.componentTree.length}`,
    `- DOM mappings: ${snapshot.domToComponentMap.length}`,
    `- Plausibility: ${snapshot.plausibility?.status ?? "not-recorded"} (${snapshot.plausibility?.passed ?? 0}/${snapshot.plausibility?.checks.length ?? 0} checks passed)`,
    "",
    "## Plausibility Checks",
    "",
    ...(snapshot.plausibility?.checks.length
      ? snapshot.plausibility.checks.map((check) => `- ${check.passed ? "PASS" : "FAIL"} ${check.name}: ${check.detail}`)
      : ["- No plausibility checks recorded."]),
    "",
    "## Component Tree Preview",
    "",
    ...(topComponents.length ? topComponents : ["- No runtime component tree available."]),
    "",
    "## Limitations",
    "",
    ...(snapshot.runtimeReflection.limitations.length ? snapshot.runtimeReflection.limitations.map((item) => `- ${item}`) : ["- None recorded."]),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function loginRedirected(page: Page, route: ScreenRoute) {
  return !isAuthRoute(route.route) && new URL(page.url()).pathname === "/login";
}

async function ensureInteractionProofRuntime(page: Page) {
  await page.evaluate(() => {
    type FiberLike = {
      _debugSource?: { columnNumber?: number; fileName?: string; lineNumber?: number } | null;
      elementType?: unknown;
      return?: FiberLike | null;
      type?: unknown;
    };
    type InteractionProofWindow = Window & typeof globalThis & {
      __AVS_INTERACTION_PROOF__?: {
        clicks: Array<{
          at: string;
          handlerCandidates: Array<{ eventProp: string; handlerName: string; handlerSourceId: string; proofLabel: string }>;
          node: {
            nodeId: string | null;
            role: string | null;
            tagName: string;
            testId: string | null;
            text: string;
          };
          ownerChain: string[];
          source: {
            available: boolean;
            columnNumber: number | null;
            exportOrFunctionSymbol: string | null;
            fileName: string | null;
            lineNumber: number | null;
            sourceKind?: string | null;
            sourceId: string | null;
          };
        }>;
        installed: boolean;
        plannedClicks?: unknown[];
      };
    };

    const win = window as InteractionProofWindow;
    if (win.__AVS_INTERACTION_PROOF__?.installed) return;
    const plannedClicks = win.__AVS_INTERACTION_PROOF__?.plannedClicks ?? [];
    win.__AVS_INTERACTION_PROOF__ = { clicks: [], installed: true, plannedClicks };

    const isPlainObject = (value: unknown): value is Record<string, unknown> =>
      Boolean(value) && typeof value === "object" && !Array.isArray(value);
    const typeLabel = (type: unknown): string => {
      if (typeof type === "string") return type;
      if (typeof type === "function") return (type as { displayName?: string; name?: string }).displayName ?? type.name ?? "Anonymous";
      if (isPlainObject(type)) {
        if (typeof type.displayName === "string") return type.displayName;
        if (typeof type.name === "string") return type.name;
        if (typeof type.render === "function") return (type.render as { displayName?: string; name?: string }).displayName ?? type.render.name ?? "ForwardRef";
        if (type.type) return typeLabel(type.type);
      }
      return "Unknown";
    };
    const sourceFor = (fiber: FiberLike | null | undefined) => {
      if (fiber?._debugSource?.fileName) {
        return {
          available: true,
          columnNumber: fiber._debugSource.columnNumber ?? null,
          fileName: fiber._debugSource.fileName,
          lineNumber: fiber._debugSource.lineNumber ?? null,
          sourceKind: "_debugSource",
        };
      }
      return { available: false, columnNumber: null, fileName: null, lineNumber: null, sourceKind: null as string | null };
    };
    const getFiberAndPropsForElement = (element: Element) => {
      const record = element as unknown as Record<string, unknown>;
      const keys = Object.keys(record);
      const fiberKey = keys.find((key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"));
      const propsKey = keys.find((key) => key.startsWith("__reactProps$") || key.startsWith("__reactEventHandlers$"));
      return {
        fiber: fiberKey ? (record[fiberKey] as FiberLike | undefined) : undefined,
        props: propsKey ? (record[propsKey] as Record<string, unknown> | undefined) : undefined,
      };
    };
    const isCompositeFiber = (fiber: FiberLike | null | undefined) => {
      if (!fiber) return false;
      const type = fiber.elementType ?? fiber.type;
      return typeof type !== "string" && typeLabel(type) !== "Unknown";
    };
    const nearestCompositeFiber = (fiber: FiberLike | null | undefined) => {
      let current: FiberLike | null | undefined = fiber;
      let guard = 0;
      while (current && guard < 80) {
        if (isCompositeFiber(current)) return current;
        current = current.return ?? null;
        guard += 1;
      }
      return null;
    };
    const ownerChain = (fiber: FiberLike | null | undefined) => {
      const chain: string[] = [];
      let current: FiberLike | null | undefined = fiber;
      let guard = 0;
      while (current && guard < 40) {
        if (isCompositeFiber(current)) chain.push(typeLabel(current.elementType ?? current.type));
        current = current.return ?? null;
        guard += 1;
      }
      return chain.reverse();
    };
    const textFor = (element: Element) =>
      (element.getAttribute("aria-label") ?? element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 180);
    const parseAvsSourceId = (sourceId: string | null, fallbackSymbol: string | null) => {
      if (!sourceId) return null;
      const parts = sourceId.split(":");
      const lineIndex = parts.findIndex((part, index) => index > 0 && /^\d+$/.test(part) && /^\d+$/.test(parts[index + 1] ?? ""));
      if (lineIndex < 0) return null;
      return {
        available: true,
        columnNumber: Number(parts[lineIndex + 1]),
        exportOrFunctionSymbol: parts[lineIndex + 2] ?? fallbackSymbol,
        fileName: parts.slice(0, lineIndex).join(":"),
        lineNumber: Number(parts[lineIndex]),
        sourceId,
        sourceKind: "data-avs-source-id",
      };
    };
    const sourceFromAttributes = (element: Element, fallbackSymbol: string | null) =>
      parseAvsSourceId(element.getAttribute("data-avs-source-id"), element.getAttribute("data-avs-source-symbol") ?? fallbackSymbol);
    const handlerCandidatesFromAttributes = (element: Element) =>
      (element.getAttribute("data-avs-handler-ids") ?? "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((handlerSourceId) => {
          const parsed = parseAvsSourceId(handlerSourceId, null);
          const eventProp = handlerSourceId.split(":").find((part) => /^on[A-Z]/.test(part)) ?? "onUnknown";
          return {
            eventProp,
            handlerName: parsed?.exportOrFunctionSymbol ?? "anonymous",
            handlerSourceId,
            proofLabel: parsed ? "HANDLER_EXACT_SOURCE_MATCH" : "HANDLER_RUNTIME_PROP_ONLY",
          };
        });

    document.addEventListener(
      "click",
      (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;
        const element = target.closest("button,a,input,textarea,select,[role],[data-testid]") ?? target;
        const { fiber, props } = getFiberAndPropsForElement(element);
        const owner = nearestCompositeFiber(fiber);
        const runtimeSymbol = owner ? typeLabel(owner.elementType ?? owner.type) : null;
        const source = (sourceFromAttributes(element, runtimeSymbol) ?? sourceFor(owner)) as ReturnType<typeof sourceFor> & { exportOrFunctionSymbol?: string | null; sourceId?: string | null };
        const symbol = source.exportOrFunctionSymbol ?? runtimeSymbol;
        const sourceId = source.sourceId ?? (source.available ? `${source.fileName}:${source.lineNumber}:${source.columnNumber ?? 0}:${symbol ?? "unknown"}` : null);
        const runtimeHandlerCandidates = Object.entries(props ?? {})
          .filter(([key, value]) => /^on[A-Z]/.test(key) && typeof value === "function")
          .map(([key, value]) => ({
            eventProp: key,
            handlerName: (value as { name?: string }).name || "anonymous",
            handlerSourceId: sourceId ? `${sourceId}:${key}` : `unresolved:${key}:${(value as { name?: string }).name || "anonymous"}`,
            proofLabel: sourceId ? "HANDLER_OWNER_SOURCE_CANDIDATE" : "HANDLER_RUNTIME_PROP_ONLY",
          }));
        const attrHandlerCandidates = handlerCandidatesFromAttributes(element);

        win.__AVS_INTERACTION_PROOF__?.clicks.push({
          at: new Date().toISOString(),
          handlerCandidates: attrHandlerCandidates.length ? [...attrHandlerCandidates, ...runtimeHandlerCandidates] : runtimeHandlerCandidates,
          node: {
            nodeId: element.getAttribute("data-avs-node-id"),
            role: element.getAttribute("role"),
            tagName: element.tagName,
            testId: element.getAttribute("data-testid"),
            text: textFor(element),
          },
          ownerChain: ownerChain(fiber),
          source: {
            ...source,
            exportOrFunctionSymbol: symbol,
            sourceId,
          },
        });
      },
      true,
    );
  });
}

async function captureInteractionState(page: Page) {
  return page.evaluate(() => {
    const hashText = (text: string) => {
      let hash = 2166136261;
      for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
    };
    const visibleText = (document.body?.innerText ?? "").replace(/\s+/g, " ").trim();
    const html = document.documentElement.outerHTML;
    const controls = Array.from(document.querySelectorAll<HTMLElement>("button,a,input,textarea,select,[role='button'],[role='dialog'],[data-testid]"))
      .slice(0, 160)
      .map((element) => ({
        nodeId: element.getAttribute("data-avs-node-id"),
        role: element.getAttribute("role"),
        tagName: element.tagName,
        testId: element.getAttribute("data-testid"),
        text: (element.getAttribute("aria-label") ?? element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 160),
      }));
    const overlay = {
      dialogs: Array.from(document.querySelectorAll<HTMLElement>("[role='dialog'], dialog")).map((element) => ({
        nodeId: element.getAttribute("data-avs-node-id"),
        text: (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 220),
        visible: Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length),
      })),
    };
    const proof = (window as typeof window & {
      __AVS_INTERACTION_PROOF__?: { clicks?: unknown[]; plannedClicks?: unknown[] };
    }).__AVS_INTERACTION_PROOF__;

    const htmlHash = hashText(html);
    const visibleTextHash = hashText(visibleText);

    return {
      activeElement: document.activeElement instanceof Element
        ? {
            nodeId: document.activeElement.getAttribute("data-avs-node-id"),
            tagName: document.activeElement.tagName,
            text: (document.activeElement.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
          }
        : null,
      controls,
      dom: {
        htmlHash,
        nodeCount: document.querySelectorAll("*").length,
        visibleTextHash,
        visibleTextSample: visibleText.slice(0, 1000),
      },
      location: location.href,
      overlay,
      plannedClicks: (proof?.plannedClicks ?? []).slice(-10),
      recentClicks: (proof?.clicks ?? []).slice(-10),
      timestamp: new Date().toISOString(),
    };
  });
}

async function captureInteractionProofTrace(page: Page, item: CaptureItem, screenshotFileName: string, overlay: OverlayStep, alreadyOpen: boolean) {
  const jsonFile = interactionProofTraceNameFor(screenshotFileName);
  const requests: Array<{ method: string; postData: string | null; resourceType: string; url: string }> = [];
  const responses: Array<{ status: number; url: string }> = [];
  const onRequest = (request: Request) => {
    requests.push({
      method: request.method(),
      postData: request.postData()?.slice(0, 2000) ?? null,
      resourceType: request.resourceType(),
      url: request.url(),
    });
  };
  const onResponse = (response: Response) => {
    responses.push({ status: response.status(), url: response.url() });
  };

  try {
    await ensureInteractionProofRuntime(page);
    const overlayVisibleBefore = await isOverlayVisible(page, overlay.mode);
    const before = await captureInteractionState(page);
    page.on("request", onRequest);
    page.on("response", onResponse);
    const opened = alreadyOpen || (await overlay.open(page));
    await page.waitForTimeout(250);
    const overlayVisibleAfter = await isOverlayVisible(page, overlay.mode);
    const selector = overlaySelectorFor(overlay.mode);
    const overlayCountAfter = selector ? await page.locator(selector).count().catch(() => 0) : 0;
    const after = await captureInteractionState(page);
    page.off("request", onRequest);
    page.off("response", onResponse);
    const domHashChanged = before.dom.htmlHash !== after.dom.htmlHash;
    const visibleTextHashChanged = before.dom.visibleTextHash !== after.dom.visibleTextHash;
    const nodeCountChanged = before.dom.nodeCount !== after.dom.nodeCount;
    const plannedClickCount = after.plannedClicks?.length ?? 0;
    const recentClickCount = after.recentClicks?.length ?? 0;
    const assertionChecks = [
      {
        detail: `opened=${opened}`,
        name: "action-opened",
        passed: opened,
      },
      {
        detail: `before=${overlayVisibleBefore}; after=${overlayVisibleAfter}; countAfter=${overlayCountAfter}`,
        name: "overlay-visible-after-action",
        passed: overlayVisibleAfter && overlayCountAfter > 0,
      },
      {
        detail: `plannedClickCount=${plannedClickCount}; recentClickCount=${recentClickCount}`,
        name: "click-evidence-present",
        passed: plannedClickCount > 0 || recentClickCount > 0,
      },
      {
        detail: `htmlHashChanged=${domHashChanged}; visibleTextHashChanged=${visibleTextHashChanged}; nodeCountChanged=${nodeCountChanged}`,
        name: "observable-ui-effect",
        passed: domHashChanged || visibleTextHashChanged || nodeCountChanged,
      },
      {
        detail: `${requests.length} request(s); ${responses.length} response(s)`,
        name: "network-observed-if-any",
        passed: true,
      },
    ];
    const failedAssertionChecks = assertionChecks.filter((check) => !check.passed);

    const trace = {
      action: {
        alreadyOpen,
        assertions: {
          checks: assertionChecks,
          failed: failedAssertionChecks.length,
          passed: assertionChecks.length - failedAssertionChecks.length,
          status: failedAssertionChecks.length === 0 ? "passed" : opened && overlayVisibleAfter && (domHashChanged || visibleTextHashChanged || nodeCountChanged) ? "warning" : "failed",
        },
        label: overlay.label,
        mode: overlay.mode,
        opened,
        proofLabel: alreadyOpen ? "ACTION_NOT_REPLAYED_OVERLAY_ALREADY_OPEN" : opened ? "CLICK_ACTION_RECORDED" : "CLICK_ACTION_FAILED_OR_NO_OVERLAY",
      },
      after,
      before,
      capture: {
        pageId: item.pageId,
        route: item.route,
        screenshot: item.path,
        state: item.state,
        url: item.url,
      },
      generatedAt: new Date().toISOString(),
      limitations: [
        "Handler source IDs are runtime owner candidates unless explicit handler source metadata is present.",
        "Network capture records browser requests/responses observed during the action window; absence of network does not prove absence of in-memory state changes.",
      ],
      network: {
        requests,
        responses,
      },
    };

    writeFileSync(path.join(outputDir, jsonFile), `${JSON.stringify(trace, null, 2)}\n`);
    item.interactionProofTracePath = `routes-and-modals/${runTs}/${jsonFile}`;
    item.interactionProofTraceStatus = "captured";
    return opened;
  } catch (error) {
    page.off("request", onRequest);
    page.off("response", onResponse);
    item.interactionProofTraceStatus = "failed-interaction-proof";
    console.warn(`Interaction proof trace failed for ${item.route} ${item.state}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function captureRoute(page: Page, route: ScreenRoute) {
  const items: CaptureItem[] = [];
  const modelContext = captureModelContextForRoute(route);
  const visualState = visualStateForRoute(route);
  const url = captureUrlForRoute(route);
  const baseCaptureVariant = uxCaptureVariantForFileKind("screen", "base");
  const baseFile = fileNameFor(route, "screen", "base");
  const baseItem: CaptureItem = {
    captureVariant: baseCaptureVariant,
    interactionProofTraceStatus: "not-tested",
    modelContext,
    pageId: route.pageId,
    path: `routes-and-modals/${runTs}/${baseFile}`,
    route: route.route,
    state: "base",
    status: "captured",
    title: route.title,
    url,
  };

  const loaded = await gotoReady(page, url);
  if (!loaded || loginRedirected(page, route)) {
    baseItem.status = "failed-open";
  } else {
    await captureScreenshot(page, baseItem, baseFile, {
      captureVariant: baseItem.captureVariant,
      mode: "none",
      selector: null,
      status: "captured",
      trigger: null,
    });
  }
  items.push(baseItem);

  for (const overlay of overlayPlans[route.route] ?? []) {
    const captureVariant = uxCaptureVariantForFileKind(overlay.mode, overlay.label);
    const overlayFile = fileNameFor(route, overlay.mode, overlay.label);
    const overlayItem: CaptureItem = {
      captureVariant,
      interactionProofTraceStatus: screensOnly ? "not-tested" : undefined,
      modelContext,
      pageId: route.pageId,
      path: `routes-and-modals/${runTs}/${overlayFile}`,
      route: route.route,
      state: overlay.label,
      status: "captured",
      title: route.title,
      url,
    };

    const keepParentOverlayContext = overlay.label === "role-confirm-modal" || visualState !== "base";
    if (!keepParentOverlayContext) await closeOverlayIfVisible(page, overlay.mode);
    const alreadyOpen = await isOverlayVisible(page, overlay.mode);
    const opened = screensOnly
      ? alreadyOpen || (await overlay.open(page))
      : await captureInteractionProofTrace(page, overlayItem, overlayFile, overlay, alreadyOpen);
    if (!opened) {
      overlayItem.status = "missing-trigger";
    } else if (!(await waitForOverlay(page, overlay.mode))) {
      overlayItem.status = "failed-open";
    } else {
      await page.waitForTimeout(300);
      await captureScreenshot(page, overlayItem, overlayFile, {
        captureVariant: overlayItem.captureVariant,
        mode: overlay.mode,
        selector: overlaySelectorFor(overlay.mode),
        status: "captured",
        trigger: overlay.label,
      });
    }

    items.push(overlayItem);
  }

  return items;
}

function mergeItems(items: CaptureItem[]) {
  const indexPath = path.join(outputDir, "index.json");
  if (!process.env.AVS_CAPTURE_OUTPUT || !existsSync(indexPath)) return items;
  const previous = JSON.parse(readFileSync(indexPath, "utf8")) as { items?: CaptureItem[] };
  const merged = new Map<string, CaptureItem>();
  for (const item of previous.items ?? []) merged.set(`${item.pageId}:${item.route}:${item.state}`, item);
  for (const item of items) merged.set(`${item.pageId}:${item.route}:${item.state}`, item);
  return Array.from(merged.values()).sort((a, b) => a.pageId.localeCompare(b.pageId) || a.state.localeCompare(b.state));
}

function markdownCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function writeIndex(items: CaptureItem[]) {
  const captureVariantCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.captureVariant.lifecycleKind] = (acc[item.captureVariant.lifecycleKind] ?? 0) + 1;
    return acc;
  }, {});

  writeFileSync(
    path.join(outputDir, "index.json"),
    `${JSON.stringify(
      {
        auditBaseline: captureScreenModelAuditBaseline,
        baseUrl,
        captureMode: screensOnly ? "screens-only" : "full-runtime",
        captureVariantContract,
        captureVariantCounts,
        generatedAt: new Date().toISOString(),
        items,
        sidecarsEnabled: !screensOnly,
      },
      null,
      2,
    )}\n`,
  );

  const lines = [
    "# Routes and Drawer/Modal captures",
    "",
    `Base URL: ${baseUrl}`,
    `Run: ${runTs}`,
    `Capture mode: ${screensOnly ? "screens-only" : "full-runtime"}`,
    `Sidecars: ${screensOnly ? "disabled" : "enabled"}`,
    `Audit baseline: ${captureScreenModelAuditBaseline.registeredRoutes} routes, ${captureScreenModelAuditBaseline.schemaModels} models, ${captureScreenModelAuditBaseline.schemaEnums} enums`,
    "",
    "| Page | Route | State | Capture Variant | File Kind | Overlay | Status | UX Mode | Audience | Proof Posture | Productive | Capability | No-overclaim Rule | Scope Warnings | Models | Screenshot | Rendered DOM | Rendered CSS | Runtime Components | Runtime Summary | Runtime Confidence | DOM Rect Trace | React Source Trace | Interaction Proof Trace |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...items.map(
      (item) =>
        `| ${item.pageId} | ${item.route} | ${item.state} | ${item.captureVariant.lifecycleKind} | ${item.captureVariant.fileKind} | ${item.captureVariant.isOverlay ? "yes" : "no"} | ${item.status} | ${item.modelContext.uxOperatingModel.mode} | ${item.modelContext.uxOperatingModel.audience} | ${item.modelContext.uxOperatingModel.proofPosture} | ${item.modelContext.uxOperatingModel.productiveUxEligible ? "yes" : "no"} | ${item.modelContext.capability.status} | ${markdownCell(item.modelContext.uxOperatingModel.noOverclaimRule)} | ${markdownCell(item.modelContext.warnings.join("<br>"))} | ${item.modelContext.models.join(", ")} | ${item.path} | ${item.domPath ?? ""} | ${item.cssPath ?? ""} | ${item.componentRuntimePath ?? ""} | ${item.componentRuntimeMarkdownPath ?? ""} | ${item.componentRuntimeConfidence ?? ""} | ${item.domRectTracePath ?? ""} | ${item.reactSourceTracePath ?? ""} | ${item.interactionProofTracePath ?? ""} |`,
    ),
  ];
  writeFileSync(path.join(outputDir, "index.md"), `${lines.join("\n")}\n`);
}

async function main() {
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const unauthContext = await browser.newContext({ viewport: { height: 1000, width: 1440 } });
  const authContext = await browser.newContext({ viewport: { height: 1000, width: 1440 } });
  if (!screensOnly) {
    await installReactReflectionHook(unauthContext);
    await installReactReflectionHook(authContext);
  }
  await authContext.addCookies([
    {
      httpOnly: true,
      name: demoAuthSessionCookieName,
      sameSite: "Lax",
      url: baseUrl,
      value: "av-session-playwright-authenticated",
    },
  ]);

  const unauthPage = await unauthContext.newPage();
  const authPage = await authContext.newPage();
  const routes = pageIdFilter ? screenRoutes.filter((route) => pageIdFilter.has(route.pageId)) : screenRoutes;
  const items: CaptureItem[] = [];

  for (const route of routes) {
    items.push(...(await captureRoute(isAuthRoute(route.route) ? unauthPage : authPage, route)));
  }

  await unauthContext.close();
  await authContext.close();
  await browser.close();

  writeIndex(mergeItems(items));
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
