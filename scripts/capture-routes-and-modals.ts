import { chromium, type BrowserContext, type Page } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { demoAuthSessionCookieName } from "@/lib/demo/demo-auth-session";
import { routeToSmokePath, screenRoutes, type ScreenRoute } from "@/lib/route-registry";

type CaptureMode = "drawer" | "modal";

type CaptureStatus = "captured" | "failed-open" | "failed-screenshot" | "missing-trigger";

type RuntimeReflectionStrategy = "mixed" | "react-devtools-hook" | "react-fiber-dom-backpointer" | "unavailable";

type RuntimeConfidence = "high" | "medium" | "low" | "unavailable";

type CaptureItem = {
  componentRuntimeMarkdownPath?: string;
  componentRuntimePath?: string;
  componentRuntimeError?: string;
  componentRuntimeStatus?: "captured" | "failed-components";
  componentRuntimeStrategy?: RuntimeReflectionStrategy;
  componentRuntimeConfidence?: RuntimeConfidence;
  cssPath?: string;
  domPath?: string;
  domStatus?: "captured" | "failed-dom";
  pageId: string;
  path: string;
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

const baseUrl = process.env.AVS_BASE_URL ?? process.env.BASE_URL ?? "http://localhost:3095";
const runTs =
  process.env.AVS_CAPTURE_OUTPUT ??
  new Date().toISOString().replace(/[.:]/g, "-").replace("T", "_").slice(0, 19);
const outputDir = path.join(process.cwd(), "artifacts", "routes-and-modals", runTs);
const modalSelector = '[data-testid="ux-a11y-modal"][role="dialog"]';
const drawerSelector = '[data-testid="ux-a11y-drawer"][role="complementary"], aside[aria-label="Action Details"]';
const pageIdFilter = process.env.AVS_CAPTURE_PAGE_IDS
  ? new Set(process.env.AVS_CAPTURE_PAGE_IDS.split(",").map((item) => item.trim()).filter(Boolean))
  : null;

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
  "/evidence": [{ label: "evidence-drawer", mode: "drawer", open: (page) => clickText(page, "Open Selected Evidence") }],
  "/governance": [{ label: "user-drawer", mode: "drawer", open: (page) => clickSelector(page, '[data-testid="j07-invite-user"]') }],
  "/governance/roles/:id": [
    { label: "role-drawer", mode: "drawer", open: (page) => clickText(page, "Create scoped role") },
    {
      label: "role-confirm-modal",
      mode: "modal",
      open: async (page) => {
        if (!(await isOverlayVisible(page, "drawer"))) {
          const openedDrawer = await clickText(page, "Create scoped role");
          if (!openedDrawer || !(await waitForOverlay(page, "drawer"))) return false;
        }
        return clickText(page, "Review scoped changes");
      },
    },
  ],
  "/governance/access-requests/:id": [{ label: "access-request-drawer", mode: "drawer", open: (page) => clickText(page, "Review policy-checked request") }],
  "/export/:id/download": [{ label: "download-confirmation-modal", mode: "modal", open: (page) => clickSelector(page, '[data-testid="j08-download-export"]') }],
};

function isAuthRoute(route: string) {
  return route === "/login" || route === "/mfa" || route.startsWith("/onboarding/");
}

function routeSlug(route: string) {
  return route.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48) || "root";
}

function fileNameFor(route: ScreenRoute, suffix: string) {
  return `${route.pageId}-${routeSlug(route.route)}-${suffix}.png`;
}

function sidecarNameFor(fileName: string, extension: "css" | "html") {
  return fileName.replace(/\.png$/i, `.rendered.${extension}`);
}

function componentRuntimeNameFor(fileName: string, extension: "json" | "md") {
  return fileName.replace(/\.png$/i, `.components.runtime.${extension}`);
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

async function clickSelector(page: Page, selector: string) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) === 0) return false;
  try {
    await locator.waitFor({ state: "visible", timeout: 1500 });
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
    await locator.click({ timeout: 2000 });
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
    await page.screenshot({ fullPage: true, path: path.join(outputDir, fileName) });
    await captureRenderedDom(page, item, fileName);
    await captureRuntimeComponents(page, item, fileName, overlay);
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

async function captureRoute(page: Page, route: ScreenRoute) {
  const items: CaptureItem[] = [];
  const url = new URL(routeToSmokePath(route.route), baseUrl).toString();
  const baseFile = fileNameFor(route, "base");
  const baseItem: CaptureItem = {
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
      mode: "none",
      selector: null,
      status: "captured",
      trigger: null,
    });
  }
  items.push(baseItem);

  for (const overlay of overlayPlans[route.route] ?? []) {
    const overlayFile = fileNameFor(route, overlay.label);
    const overlayItem: CaptureItem = {
      pageId: route.pageId,
      path: `routes-and-modals/${runTs}/${overlayFile}`,
      route: route.route,
      state: overlay.label,
      status: "captured",
      title: route.title,
      url,
    };

    const alreadyOpen = await isOverlayVisible(page, overlay.mode);
    const opened = alreadyOpen || (await overlay.open(page));
    if (!opened) {
      overlayItem.status = "missing-trigger";
    } else if (!(await waitForOverlay(page, overlay.mode))) {
      overlayItem.status = "failed-open";
    } else {
      await page.waitForTimeout(300);
      await captureScreenshot(page, overlayItem, overlayFile, {
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

function writeIndex(items: CaptureItem[]) {
  writeFileSync(path.join(outputDir, "index.json"), `${JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), items }, null, 2)}\n`);

  const lines = [
    "# Routes and Drawer/Modal captures",
    "",
    `Base URL: ${baseUrl}`,
    `Run: ${runTs}`,
    "",
    "| Page | Route | State | Status | Screenshot | Rendered DOM | Rendered CSS | Runtime Components | Runtime Summary | Runtime Confidence |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...items.map(
      (item) =>
        `| ${item.pageId} | ${item.route} | ${item.state} | ${item.status} | ${item.path} | ${item.domPath ?? ""} | ${item.cssPath ?? ""} | ${item.componentRuntimePath ?? ""} | ${item.componentRuntimeMarkdownPath ?? ""} | ${item.componentRuntimeConfidence ?? ""} |`,
    ),
  ];
  writeFileSync(path.join(outputDir, "index.md"), `${lines.join("\n")}\n`);
}

async function main() {
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const unauthContext = await browser.newContext({ viewport: { height: 1000, width: 1440 } });
  const authContext = await browser.newContext({ viewport: { height: 1000, width: 1440 } });
  await installReactReflectionHook(unauthContext);
  await installReactReflectionHook(authContext);
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
