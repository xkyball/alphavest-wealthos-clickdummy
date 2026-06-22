import { chromium, type Page } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { demoAuthSessionCookieName } from "@/lib/demo/demo-auth-session";
import { routeToSmokePath, screenRoutes, type ScreenRoute } from "@/lib/route-registry";

type CaptureMode = "drawer" | "modal";

type CaptureStatus = "captured" | "failed-open" | "failed-screenshot" | "missing-trigger";

type CaptureItem = {
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

async function captureScreenshot(page: Page, item: CaptureItem, fileName: string) {
  try {
    await page.screenshot({ fullPage: true, path: path.join(outputDir, fileName) });
    await captureRenderedDom(page, item, fileName);
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
    await captureScreenshot(page, baseItem, baseFile);
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
      await captureScreenshot(page, overlayItem, overlayFile);
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
    "| Page | Route | State | Status | Screenshot | Rendered DOM | Rendered CSS |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...items.map((item) => `| ${item.pageId} | ${item.route} | ${item.state} | ${item.status} | ${item.path} | ${item.domPath ?? ""} | ${item.cssPath ?? ""} |`),
  ];
  writeFileSync(path.join(outputDir, "index.md"), `${lines.join("\n")}\n`);
}

async function main() {
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const unauthContext = await browser.newContext({ viewport: { height: 1000, width: 1440 } });
  const authContext = await browser.newContext({ viewport: { height: 1000, width: 1440 } });
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
