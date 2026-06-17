import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type Page } from "@playwright/test";
import { routeToSmokePath, screenRoutes } from "@/lib/route-registry";
import { visualStateForRoute } from "@/lib/visual-contract";

type ViewportName = "desktop" | "mobile";

type CaptureMetric = {
  consoleMessages: string[];
  metrics: {
    crampedText: string[];
    document: {
      clientWidth: number;
      scrollWidth: number;
    };
    loadingTextPresent: boolean;
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

const viewports: Record<ViewportName, { height: number; width: number }> = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 }
};

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function slugFor(route: (typeof screenRoutes)[number], viewport: ViewportName) {
  const assetName = path.basename(route.visualAsset).replace(/\.png$/i, "");
  return `${assetName}-${viewport}.png`;
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
        scrollWidth: document.documentElement.scrollWidth
      },
      loadingTextPresent: document.body.innerText.includes("Loading workspace")
    };
  });
}

function routeUrl(route: (typeof screenRoutes)[number]) {
  const smokePath = routeToSmokePath(route.route);
  const visualState = visualStateForRoute(route);
  const pathname = visualState === "base" ? smokePath : `${smokePath}?state=${visualState}`;

  return new URL(pathname, baseUrl).toString();
}

async function captureViewport(page: Page, viewport: ViewportName) {
  await page.setViewportSize(viewports[viewport]);
  ensureDir(path.join(outputDir, viewport));

  const metrics: CaptureMetric[] = [];

  for (const route of screenRoutes) {
    const consoleMessages: string[] = [];
    const onConsole = (message: { text: () => string; type: () => string }) => {
      if (message.type() === "error" || message.type() === "warning") {
        consoleMessages.push(message.text());
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
    "",
    "| Page | Route | Viewport | Screenshot | Overflow | Cramped candidates |",
    "| --- | --- | --- | --- | --- | --- |"
  ];

  for (const item of metrics) {
    const overflow = item.metrics.document.scrollWidth > item.metrics.document.clientWidth ? "yes" : "no";
    lines.push(
      `| ${item.pageId} | \`${item.route}\` | ${item.viewport} | [png](${item.screenshot}) | ${overflow} | ${item.metrics.crampedText.length} |`
    );
  }

  writeFileSync(path.join(outputDir, "index.md"), `${lines.join("\n")}\n`);
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
  const page = await browser.newPage();
  const metrics = [
    ...(await captureViewport(page, "desktop")),
    ...(await captureViewport(page, "mobile"))
  ];

  writeFileSync(path.join(outputDir, "strict-review-dom-metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
  writeIndex(metrics);

  const desktopSheet = writeContactSheet("desktop", metrics);
  const mobileSheet = writeContactSheet("mobile", metrics);
  await screenshotContactSheet(page, desktopSheet, "desktop");
  await screenshotContactSheet(page, mobileSheet, "mobile");

  await browser.close();

  const errors = metrics.filter((item) => item.consoleMessages.length > 0).length;
  const loadingStillPresent = metrics.filter((item) => item.metrics.loadingTextPresent).length;
  const overflow = metrics.filter((item) => item.metrics.document.scrollWidth > item.metrics.document.clientWidth).length;

  console.log(
    JSON.stringify(
      {
        screenshots: metrics.length,
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
