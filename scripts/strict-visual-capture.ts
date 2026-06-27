import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type Page } from "@playwright/test";
import {
  captureModelContextForRoute,
  captureScreenModelAuditBaseline,
  type CaptureScreenModelContext
} from "@/lib/capture-screen-model-context";
import { demoAuthSessionCookieName } from "@/lib/demo/demo-auth-session";
import { routeToSmokePath, screenRoutes } from "@/lib/route-registry";
import { uxCaptureVariantForFileKind, type UxCaptureVariant } from "@/lib/ux-lifecycle-state-contract";
import { visualStateForRoute } from "@/lib/visual-contract";
import { runCaptureQa } from "./capture-qa-contract";

type ViewportName = "desktop" | "mobile";

type CaptureMetric = {
  consoleMessages: string[];
  captureVariant: UxCaptureVariant;
  modelContext: CaptureScreenModelContext;
  metrics: {
    crampedText: string[];
    document: {
      clientWidth: number;
      scrollHeight: number;
      scrollWidth: number;
    };
    loadingTextPresent: boolean;
    viewport: {
      height: number;
      width: number;
    };
  };
  pageId: string;
  route: string;
  screenshot: string;
  title: string;
  url: string;
  viewport: ViewportName;
};

const root = process.cwd();
const baseUrl = process.env.STRICT_VISUAL_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? process.env.BASE_URL ?? "http://127.0.0.1:3107";
const outputName =
  process.env.STRICT_VISUAL_OUTPUT ??
  new Date().toISOString().replace(/[:.]/g, "-").replace("T", "_").slice(0, 19);
const outputDir = path.join(root, "artifacts", "strict-visual-review", outputName);
const pageIdFilter = process.env.STRICT_VISUAL_PAGE_IDS
  ? new Set(process.env.STRICT_VISUAL_PAGE_IDS.split(",").map((item) => item.trim()).filter(Boolean))
  : null;
const captureRoutes = pageIdFilter ? screenRoutes.filter((route) => pageIdFilter.has(route.pageId)) : screenRoutes;

const viewports: Record<ViewportName, { height: number; width: number }> = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 }
};

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function markdownText(value: string) {
  return value.replace(/\|/g, "\\|");
}

function slugFor(route: (typeof screenRoutes)[number], viewport: ViewportName) {
  const assetName = path.basename(route.visualAsset).replace(/\.png$/i, "");
  const captureVariant = uxCaptureVariantForFileKind("screen", "base");
  return `${assetName}-${captureVariant.lifecycleKind}-${viewport}.png`;
}

function isAuthRoute(route: string) {
  return route === "/login" || route === "/mfa" || route.startsWith("/onboarding/");
}

async function collectMetrics(page: Page) {
  return page.evaluate(() => {
    const crampedText: string[] = [];
    const elements = Array.from(document.querySelectorAll<HTMLElement>("body *"));

    for (const element of elements) {
      const text = element.innerText?.replace(/\s+/g, " ").trim();
      if (!text || text.length < 6 || text.length > 120) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const visible = rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";

      if (!visible) {
        continue;
      }

      if ((rect.width < 72 && text.length > 18) || (rect.height > 72 && rect.width < 110 && text.length > 24)) {
        crampedText.push(text);
      }

      if (crampedText.length >= 20) {
        break;
      }
    }

    return {
      crampedText,
      document: {
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth
      },
      loadingTextPresent: document.body.innerText.includes("Loading workspace"),
      viewport: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    };
  });
}

function runCaptureQaForOutput() {
  if (process.env.STRICT_VISUAL_CAPTURE_QA_AFTER_RUN === "0") return;

  const result = runCaptureQa({
    failOnWarnings: process.env.CAPTURE_QA_FAIL_ON_WARNINGS === "1",
    inputRoot: outputDir,
    outputDir: path.join(outputDir, "capture-qa"),
  });

  if (result.status === "fail") {
    throw new Error(`Capture QA failed for ${path.relative(root, outputDir)} with ${result.failures.length} failures.`);
  }
}

function routeUrl(route: (typeof screenRoutes)[number]) {
  const smokePath = routeToSmokePath(route.route);
  const visualState = visualStateForRoute(route);
  const pathname = visualState === "base" ? smokePath : `${smokePath}?state=${visualState}`;

  return new URL(pathname, baseUrl).toString();
}

function shouldRecordConsoleMessage(text: string) {
  return !text.includes("/_next/webpack-hmr");
}

async function captureViewport(pages: { auth: Page; unauth: Page }, viewport: ViewportName) {
  await pages.auth.setViewportSize(viewports[viewport]);
  await pages.unauth.setViewportSize(viewports[viewport]);
  ensureDir(path.join(outputDir, viewport));

  const metrics: CaptureMetric[] = [];

  for (const route of captureRoutes) {
    const page = isAuthRoute(route.route) ? pages.unauth : pages.auth;
    const consoleMessages: string[] = [];
    const onConsole = (message: { text: () => string; type: () => string }) => {
      if (message.type() === "error" || message.type() === "warning") {
        const text = message.text();
        if (shouldRecordConsoleMessage(text)) {
          consoleMessages.push(text);
        }
      }
    };
    page.on("console", onConsole);

    const url = routeUrl(route);
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(350);

    const filename = slugFor(route, viewport);
    const screenshot = path.join(outputDir, viewport, filename);
    await page.screenshot({ fullPage: false, path: screenshot });
    const pageMetrics = await collectMetrics(page);

    page.off("console", onConsole);

    metrics.push({
      consoleMessages,
      captureVariant: uxCaptureVariantForFileKind("screen", "base"),
      modelContext: captureModelContextForRoute(route),
      metrics: pageMetrics,
      pageId: route.pageId,
      route: route.route,
      screenshot: path.relative(outputDir, screenshot),
      title: route.title,
      url,
      viewport
    });
  }

  return metrics;
}

function writeIndex(metrics: CaptureMetric[]) {
  const lines = [
    "# Strict Visual Capture",
    "",
    `Base URL: ${baseUrl}`,
    `Output: ${path.relative(root, outputDir)}`,
    `Audit model baseline: ${captureScreenModelAuditBaseline.schemaModels} Prisma models / ${captureScreenModelAuditBaseline.schemaEnums} enums`,
    "",
    "| Page | Route | Capture Variant | File Kind | Overlay | Viewport | Capability | Prisma models | Screenshot | Overflow | Cramped candidates |",
    "| --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |"
  ];

  for (const item of metrics) {
    const overflow = item.metrics.document.scrollWidth > item.metrics.document.clientWidth ? "yes" : "no";
    lines.push(
      `| ${item.pageId} | \`${item.route}\` | ${item.captureVariant.lifecycleKind} | ${item.captureVariant.fileKind} | ${item.captureVariant.isOverlay ? "yes" : "no"} | ${item.viewport} | ${item.modelContext.capability.status} | ${item.modelContext.models.length} | [png](${item.screenshot}) | ${overflow} | ${item.metrics.crampedText.length} |`
    );
  }

  writeFileSync(path.join(outputDir, "index.md"), `${lines.join("\n")}\n`);
}

function writeModelContext() {
  const contexts = captureRoutes.map((route) => captureModelContextForRoute(route));
  const statusCounts = contexts.reduce<Record<string, number>>((acc, context) => {
    acc[context.capability.status] = (acc[context.capability.status] ?? 0) + 1;
    return acc;
  }, {});

  writeFileSync(
    path.join(outputDir, "normal-screen-model-context.json"),
    `${JSON.stringify(
      {
        auditBaseline: captureScreenModelAuditBaseline,
        generatedAt: new Date().toISOString(),
        routeCount: contexts.length,
        routes: contexts,
        statusCounts
      },
      null,
      2
    )}\n`
  );

  const lines = [
    "# Normal Screen Model Context",
    "",
    `Routes: ${contexts.length}`,
    `Schema baseline: ${captureScreenModelAuditBaseline.schemaModels} models / ${captureScreenModelAuditBaseline.schemaEnums} enums`,
    `Capability report: ${captureScreenModelAuditBaseline.capabilityReport}`,
    "",
    "| Page | Route | Scope | Capability | Model families | Models | Warnings |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...contexts.map((context) =>
      [
        context.route.pageId,
        `\`${context.route.path}\``,
        context.route.routeScope,
        context.capability.status,
        markdownText(context.modelFamilies.join(", ")),
        markdownText(context.models.join(", ")),
        markdownText(context.warnings.join(" ")),
      ].join(" | ")
    ).map((row) => `| ${row} |`),
  ];

  writeFileSync(path.join(outputDir, "normal-screen-model-context.md"), `${lines.join("\n")}\n`);
}

function writeContactSheet(viewport: ViewportName, metrics: CaptureMetric[]) {
  ensureDir(path.join(outputDir, "contact-sheets"));
  const htmlPath = path.join(outputDir, "contact-sheets", `contact-${viewport}.html`);
  const cards = metrics
    .filter((item) => item.viewport === viewport)
    .map((item) => {
      const src = `../${item.screenshot}`;
      return `<article><h2>${item.pageId} ${item.title}</h2><p>${item.route}</p><img src="${src}" /></article>`;
    })
    .join("\n");

  writeFileSync(
    htmlPath,
    `<!doctype html><html><head><meta charset="utf-8" /><style>
      body{margin:0;background:#06121f;color:#f7f1e6;font-family:Inter,Arial,sans-serif}
      main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;padding:16px}
      article{border:1px solid #254057;background:#102536;padding:10px}
      h2{font-size:14px;margin:0 0 4px}
      p{font-size:11px;margin:0 0 8px;color:#aeb8c4}
      img{display:block;width:100%;height:auto;border:1px solid #254057}
    </style></head><body><main>${cards}</main></body></html>`
  );

  return htmlPath;
}

async function screenshotContactSheet(page: Page, htmlPath: string, viewport: ViewportName) {
  await page.setViewportSize({ width: viewport === "desktop" ? 1800 : 1200, height: 1200 });
  await page.goto(pathToFileURL(htmlPath).toString(), { waitUntil: "load" });
  await page.screenshot({
    fullPage: true,
    path: path.join(outputDir, "contact-sheets", `contact-${viewport}.png`)
  });
}

async function main() {
  ensureDir(outputDir);

  const browser = await chromium.launch();
  const unauthContext = await browser.newContext();
  const authContext = await browser.newContext();
  await authContext.addCookies([
    {
      httpOnly: true,
      name: demoAuthSessionCookieName,
      sameSite: "Lax",
      url: baseUrl,
      value: "av-session-playwright-authenticated"
    }
  ]);
  const pages = {
    auth: await authContext.newPage(),
    unauth: await unauthContext.newPage()
  };
  const metrics = [
    ...(await captureViewport(pages, "desktop")),
    ...(await captureViewport(pages, "mobile"))
  ];

  writeFileSync(path.join(outputDir, "strict-review-dom-metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
  writeIndex(metrics);
  writeModelContext();
  runCaptureQaForOutput();

  const desktopSheet = writeContactSheet("desktop", metrics);
  const mobileSheet = writeContactSheet("mobile", metrics);
  await screenshotContactSheet(pages.auth, desktopSheet, "desktop");
  await screenshotContactSheet(pages.auth, mobileSheet, "mobile");

  await unauthContext.close();
  await authContext.close();
  await browser.close();

  const errors = metrics.filter((item) => item.consoleMessages.length > 0).length;
  const loadingStillPresent = metrics.filter((item) => item.metrics.loadingTextPresent).length;
  const overflow = metrics.filter((item) => item.metrics.document.scrollWidth > item.metrics.document.clientWidth).length;

  console.log(
    JSON.stringify(
      {
        screenshots: metrics.length,
        modelContexts: captureRoutes.length,
        schemaModels: captureScreenModelAuditBaseline.schemaModels,
        errors,
        loadingStillPresent,
        overflow,
        output: path.relative(root, outputDir)
      },
      null,
      2
    )
  );
}

void main();
