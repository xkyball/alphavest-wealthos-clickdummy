import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

type CaptureQaSeverity = "failure" | "warning";

type CaptureQaFinding = {
  captureId?: string;
  detail: string;
  manifestPath?: string;
  rule: string;
  severity: CaptureQaSeverity;
};

type CaptureQaDuplicateCluster = {
  key: string;
  captures: string[];
  manifestPaths: string[];
  severity: CaptureQaSeverity;
};

type CaptureQaLongScreenRisk = {
  captureId: string;
  height?: number;
  ratio?: number;
  rule: string;
  screenshotPath?: string;
  severity: CaptureQaSeverity;
  viewportHeight?: number;
};

type NormalizedCapture = {
  captureId: string;
  fileKind?: string;
  height?: number;
  isOverlay?: boolean;
  lifecycleKind?: string;
  manifestPath: string;
  pageId?: string;
  proofEligibilityStatus?: string;
  route?: string;
  screenshotPath?: string;
  sourceKind: "routes-and-modals" | "strict-visual";
  state?: string;
  status?: string;
  viewport?: string;
  viewportHeight?: number;
  width?: number;
  scrollHeight?: number;
  scrollWidth?: number;
  clientWidth?: number;
};

type CaptureQaResult = {
  checkedCaptures: number;
  duplicateClusters: CaptureQaDuplicateCluster[];
  failures: CaptureQaFinding[];
  generatedAt: string;
  inputRoot: string;
  longScreenRisks: CaptureQaLongScreenRisk[];
  manifestCount: number;
  outputDir: string;
  status: "pass" | "warning" | "fail";
  warnings: CaptureQaFinding[];
};

type CaptureQaOptions = {
  failOnWarnings: boolean;
  inputRoot: string;
  outputDir: string;
  requireCaptures?: boolean;
};

const root = process.cwd();
const defaultInputRoot = process.env.CAPTURE_QA_INPUT ?? process.argv[2] ?? path.join(root, "artifacts");
const defaultOutputDir = process.env.CAPTURE_QA_OUTPUT ?? path.join(root, "artifacts", "capture-qa");
const failOnWarnings = process.env.CAPTURE_QA_FAIL_ON_WARNINGS === "1";
const requireCaptures = process.env.CAPTURE_QA_REQUIRE_CAPTURES === "1";

const longScreenWarningHeight = Number(process.env.CAPTURE_QA_LONG_SCREEN_WARNING_HEIGHT ?? 2200);
const longScreenSevereHeight = Number(process.env.CAPTURE_QA_LONG_SCREEN_SEVERE_HEIGHT ?? 3200);
const scrollBurdenRatio = Number(process.env.CAPTURE_QA_SCROLL_BURDEN_RATIO ?? 2.25);

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function walkFiles(entry: string, output: string[] = []) {
  if (!existsSync(entry)) return output;
  const stat = statSync(entry);

  if (stat.isDirectory()) {
    for (const child of readdirSync(entry)) {
      if ([".next", "node_modules", "test-results"].includes(child)) continue;
      walkFiles(path.join(entry, child), output);
    }
    return output;
  }

  if (path.basename(entry) === "index.json" || path.basename(entry) === "strict-review-dom-metrics.json") {
    output.push(entry);
  }

  return output;
}

function relativePath(filePath: string) {
  return path.relative(root, filePath) || filePath;
}

function firstExistingPath(candidates: Array<string | undefined>) {
  return candidates.find((candidate) => candidate && existsSync(candidate));
}

function screenshotAbsPath(manifestPath: string, screenshotPath?: string) {
  if (!screenshotPath) return undefined;
  if (path.isAbsolute(screenshotPath)) return screenshotPath;

  const manifestParts = manifestPath.split(path.sep);
  const artifactSegmentIndex = manifestParts.lastIndexOf("artifacts");
  const localArtifactRoot = artifactSegmentIndex >= 0 ? manifestParts.slice(0, artifactSegmentIndex + 1).join(path.sep) : undefined;
  const localArtifactRelative = localArtifactRoot ? path.join(localArtifactRoot, screenshotPath) : undefined;
  const artifactRelative = path.join(root, "artifacts", screenshotPath);
  const manifestRelative = path.join(path.dirname(manifestPath), screenshotPath);
  const cwdRelative = path.join(root, screenshotPath);

  return firstExistingPath([localArtifactRelative, artifactRelative, manifestRelative, cwdRelative]) ?? cwdRelative;
}

function pngDimensions(filePath?: string) {
  if (!filePath || !existsSync(filePath) || path.extname(filePath).toLowerCase() !== ".png") return {};
  const buffer = readFileSync(filePath);
  if (buffer.length < 24) return {};

  const pngSignature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== pngSignature) return {};

  return {
    height: buffer.readUInt32BE(20),
    width: buffer.readUInt32BE(16),
  };
}

function booleanFromUnknown(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "yes";
  return undefined;
}

function routeSlug(route: string) {
  return route.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 96) || "root";
}

function stateSlug(state: string) {
  return routeSlug(state.replace(/-(modal|drawer)$/i, ""));
}

function normalizeRoutesAndModalsManifest(manifestPath: string) {
  const manifest = readJson<{
    items?: Array<{
      captureVariant?: {
        fileKind?: string;
        isOverlay?: boolean;
        lifecycleKind?: string;
      };
      pageId?: string;
      path?: string;
      proofEligibility?: {
        status?: string;
      };
      route?: string;
      state?: string;
      status?: string;
    }>;
  }>(manifestPath);

  if (!manifest?.items) return [];

  return manifest.items.map((item, index): NormalizedCapture => {
    const absoluteScreenshotPath = screenshotAbsPath(manifestPath, item.path);
    const dimensions = pngDimensions(absoluteScreenshotPath);

    return {
      captureId: `${relativePath(manifestPath)}#${item.pageId ?? "unknown"}:${item.route ?? "unknown"}:${item.state ?? index}`,
      fileKind: item.captureVariant?.fileKind,
      height: dimensions.height,
      isOverlay: booleanFromUnknown(item.captureVariant?.isOverlay),
      lifecycleKind: item.captureVariant?.lifecycleKind,
      manifestPath,
      pageId: item.pageId,
      proofEligibilityStatus: item.proofEligibility?.status,
      route: item.route,
      screenshotPath: item.path,
      sourceKind: "routes-and-modals",
      state: item.state,
      status: item.status,
      width: dimensions.width,
    };
  });
}

function normalizeStrictVisualManifest(manifestPath: string) {
  const metrics = readJson<Array<{
    captureVariant?: {
      fileKind?: string;
      isOverlay?: boolean;
      lifecycleKind?: string;
    };
    metrics?: {
      document?: {
        clientWidth?: number;
        scrollHeight?: number;
        scrollWidth?: number;
      };
      viewport?: {
        height?: number;
      };
    };
    pageId?: string;
    route?: string;
    screenshot?: string;
    status?: string;
    viewport?: string;
  }>>(manifestPath);

  if (!Array.isArray(metrics)) return [];

  return metrics.map((item, index): NormalizedCapture => {
    const absoluteScreenshotPath = screenshotAbsPath(manifestPath, item.screenshot);
    const dimensions = pngDimensions(absoluteScreenshotPath);

    return {
      captureId: `${relativePath(manifestPath)}#${item.pageId ?? "unknown"}:${item.route ?? "unknown"}:${item.viewport ?? index}`,
      clientWidth: item.metrics?.document?.clientWidth,
      fileKind: item.captureVariant?.fileKind,
      height: dimensions.height,
      isOverlay: booleanFromUnknown(item.captureVariant?.isOverlay),
      lifecycleKind: item.captureVariant?.lifecycleKind,
      manifestPath,
      pageId: item.pageId,
      route: item.route,
      screenshotPath: item.screenshot,
      scrollHeight: item.metrics?.document?.scrollHeight,
      scrollWidth: item.metrics?.document?.scrollWidth,
      sourceKind: "strict-visual",
      state: "base",
      status: item.status ?? "captured",
      viewport: item.viewport,
      viewportHeight: item.metrics?.viewport?.height,
      width: dimensions.width,
    };
  });
}

function collectCaptures(inputRoot: string) {
  const manifests = walkFiles(inputRoot);
  const captures = manifests.flatMap((manifestPath) => {
    if (path.basename(manifestPath) === "strict-review-dom-metrics.json") {
      return normalizeStrictVisualManifest(manifestPath);
    }
    return normalizeRoutesAndModalsManifest(manifestPath);
  });

  return {
    captures,
    manifests: manifests.filter((manifestPath) => {
      if (path.basename(manifestPath) === "strict-review-dom-metrics.json") return normalizeStrictVisualManifest(manifestPath).length > 0;
      return normalizeRoutesAndModalsManifest(manifestPath).length > 0;
    }),
  };
}

function pushFinding(
  target: CaptureQaFinding[],
  capture: NormalizedCapture,
  rule: string,
  detail: string,
  severity: CaptureQaSeverity = "warning",
) {
  target.push({
    captureId: capture.captureId,
    detail,
    manifestPath: relativePath(capture.manifestPath),
    rule,
    severity,
  });
}

function validateMetadata(captures: NormalizedCapture[]) {
  const warnings: CaptureQaFinding[] = [];
  const failures: CaptureQaFinding[] = [];

  for (const capture of captures) {
    const requiredFields: Array<[keyof NormalizedCapture, string]> = [
      ["pageId", "route/page id"],
      ["route", "route path"],
      ["state", "state label"],
      ["screenshotPath", "screenshot path"],
      ["lifecycleKind", "capture lifecycle kind"],
      ["fileKind", "capture file kind"],
      ["status", "capture status"],
    ];

    for (const [field, label] of requiredFields) {
      if (capture[field] === undefined || capture[field] === "") {
        pushFinding(warnings, capture, "metadata.required", `Missing ${label}.`);
      }
    }

    if (capture.isOverlay === undefined) {
      pushFinding(warnings, capture, "metadata.overlay", "Missing overlay flag.");
    }

    const screenshot = screenshotAbsPath(capture.manifestPath, capture.screenshotPath);
    if (capture.screenshotPath && !screenshot) {
      pushFinding(warnings, capture, "metadata.screenshot-path", "Screenshot path could not be resolved.");
    }

    if (capture.screenshotPath && screenshot && !existsSync(screenshot)) {
      pushFinding(warnings, capture, "metadata.screenshot-exists", `Screenshot is referenced but missing: ${capture.screenshotPath}.`);
    }

    if (capture.sourceKind === "routes-and-modals" && capture.screenshotPath && capture.pageId && capture.route && capture.lifecycleKind && capture.state) {
      const fileName = path.basename(capture.screenshotPath);
      const expectedPrefix = `${capture.pageId}-route-${routeSlug(capture.route)}-${capture.lifecycleKind}-${stateSlug(capture.state)}`;
      if (!fileName.startsWith(expectedPrefix) || !fileName.endsWith(".png")) {
        pushFinding(warnings, capture, "naming.routes-and-modals", `Expected filename prefix ${expectedPrefix}.png, got ${fileName}.`);
      }
    }

    if (capture.sourceKind === "routes-and-modals" && !capture.proofEligibilityStatus) {
      pushFinding(warnings, capture, "proof-eligibility.required", "Missing screenshot proof eligibility status.");
    }

    if (capture.sourceKind === "strict-visual" && capture.screenshotPath && capture.lifecycleKind && capture.viewport) {
      const fileName = path.basename(capture.screenshotPath);
      const expectedSuffix = `-${capture.lifecycleKind}-${capture.viewport}.png`;
      if (!fileName.endsWith(expectedSuffix)) {
        pushFinding(warnings, capture, "naming.strict-visual", `Expected filename suffix ${expectedSuffix}, got ${fileName}.`);
      }
    }

    if (capture.lifecycleKind === "base" && capture.isOverlay === true) {
      pushFinding(failures, capture, "overlay.base", "Base capture must not be marked as overlay.", "failure");
    }

    if (["modal", "drawer", "confirmation"].includes(capture.lifecycleKind ?? "") && capture.isOverlay !== true) {
      pushFinding(failures, capture, "overlay.required", "Modal/drawer/confirmation capture must be marked as overlay.", "failure");
    }

    if (capture.fileKind === "screen" && capture.isOverlay === true) {
      pushFinding(failures, capture, "overlay.screen-file-kind", "Screen file kind must not claim overlay state.", "failure");
    }

    if (capture.state === "base" && ["modal", "drawer", "confirmation"].includes(capture.lifecycleKind ?? "")) {
      pushFinding(failures, capture, "overlay.state-label", "Overlay lifecycle kind must not use base state label.", "failure");
    }
  }

  return { failures, warnings };
}

function duplicateKey(capture: NormalizedCapture) {
  return [
    capture.sourceKind,
    capture.pageId ?? "missing-page",
    capture.route ?? "missing-route",
    capture.state ?? "missing-state",
    capture.lifecycleKind ?? "missing-lifecycle",
    capture.fileKind ?? "missing-file-kind",
    capture.isOverlay === undefined ? "missing-overlay" : capture.isOverlay ? "overlay" : "base",
    capture.viewport ?? "no-viewport",
    relativePath(capture.manifestPath),
  ].join("|");
}

function detectDuplicateClusters(captures: NormalizedCapture[]) {
  const groups = new Map<string, NormalizedCapture[]>();
  for (const capture of captures) {
    const key = duplicateKey(capture);
    groups.set(key, [...(groups.get(key) ?? []), capture]);
  }

  return Array.from(groups.entries())
    .filter(([, group]) => group.length > 1)
    .map(([key, group]): CaptureQaDuplicateCluster => ({
      captures: group.map((capture) => capture.captureId),
      key,
      manifestPaths: Array.from(new Set(group.map((capture) => relativePath(capture.manifestPath)))),
      severity: "warning",
    }));
}

function detectLongScreenRisks(captures: NormalizedCapture[]) {
  const risks: CaptureQaLongScreenRisk[] = [];

  for (const capture of captures) {
    if (capture.height && capture.height > longScreenWarningHeight) {
      risks.push({
        captureId: capture.captureId,
        height: capture.height,
        rule: capture.height > longScreenSevereHeight ? "long-screen.severe-height" : "long-screen.height",
        screenshotPath: capture.screenshotPath,
        severity: "warning",
      });
    }

    if (capture.scrollHeight && capture.viewportHeight && capture.scrollHeight / capture.viewportHeight >= scrollBurdenRatio) {
      risks.push({
        captureId: capture.captureId,
        height: capture.scrollHeight,
        ratio: Number((capture.scrollHeight / capture.viewportHeight).toFixed(2)),
        rule: "long-screen.scroll-burden",
        screenshotPath: capture.screenshotPath,
        severity: "warning",
        viewportHeight: capture.viewportHeight,
      });
    }

    if (capture.scrollWidth && capture.clientWidth && capture.scrollWidth > capture.clientWidth) {
      risks.push({
        captureId: capture.captureId,
        height: capture.height,
        rule: "long-screen.horizontal-overflow",
        screenshotPath: capture.screenshotPath,
        severity: "warning",
      });
    }
  }

  return risks;
}

function markdownCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function writeReports(result: CaptureQaResult) {
  mkdirSync(result.outputDir, { recursive: true });
  writeFileSync(path.join(result.outputDir, "capture-qa-report.json"), `${JSON.stringify(result, null, 2)}\n`);

  const lines = [
    "# Capture QA Report",
    "",
    `Generated: ${result.generatedAt}`,
    `Input: ${result.inputRoot}`,
    `Status: ${result.status}`,
    "",
    "| Metric | Count |",
    "| --- | ---: |",
    `| Manifests | ${result.manifestCount} |`,
    `| Captures | ${result.checkedCaptures} |`,
    `| Failures | ${result.failures.length} |`,
    `| Warnings | ${result.warnings.length} |`,
    `| Duplicate clusters | ${result.duplicateClusters.length} |`,
    `| Long-screen risks | ${result.longScreenRisks.length} |`,
    "",
    "## Metadata and Naming Findings",
    "",
    "| Severity | Rule | Capture | Detail |",
    "| --- | --- | --- | --- |",
    ...[...result.failures, ...result.warnings].map(
      (finding) =>
        `| ${finding.severity} | ${finding.rule} | ${markdownCell(finding.captureId ?? finding.manifestPath ?? "")} | ${markdownCell(finding.detail)} |`,
    ),
    "",
    "## Duplicate-State Clusters",
    "",
    "| Severity | Key | Captures |",
    "| --- | --- | --- |",
    ...result.duplicateClusters.map(
      (cluster) => `| ${cluster.severity} | ${markdownCell(cluster.key)} | ${markdownCell(cluster.captures.join("<br>"))} |`,
    ),
    "",
    "## Long-Screen Risks",
    "",
    "| Severity | Rule | Capture | Height | Ratio |",
    "| --- | --- | --- | ---: | ---: |",
    ...result.longScreenRisks.map(
      (risk) =>
        `| ${risk.severity} | ${risk.rule} | ${markdownCell(risk.captureId)} | ${risk.height ?? ""} | ${risk.ratio ?? ""} |`,
    ),
  ];

  writeFileSync(path.join(result.outputDir, "capture-qa-report.md"), `${lines.join("\n")}\n`);
}

export function runCaptureQa(options: CaptureQaOptions): CaptureQaResult {
  const inputRoot = path.resolve(options.inputRoot);
  const outputDir = path.resolve(options.outputDir);
  const { captures, manifests } = collectCaptures(inputRoot);
  const metadataResult = validateMetadata(captures);
  const duplicateClusters = detectDuplicateClusters(captures);
  const longScreenRisks = detectLongScreenRisks(captures);
  const requiredCaptureFailures: CaptureQaFinding[] = options.requireCaptures && captures.length === 0
    ? [{
      detail: "Release capture QA requires at least one E09-compliant capture manifest in the input root.",
      manifestPath: relativePath(inputRoot),
      rule: "release-candidate.required-captures",
      severity: "failure",
    }]
    : [];
  const warningFindings = [
    ...metadataResult.warnings,
    ...duplicateClusters.map((cluster): CaptureQaFinding => ({
      detail: `Duplicate-state cluster contains ${cluster.captures.length} captures.`,
      rule: "duplicate-state.cluster",
      severity: "warning",
    })),
    ...longScreenRisks.map((risk): CaptureQaFinding => ({
      captureId: risk.captureId,
      detail: `Long-screen risk ${risk.rule}${risk.height ? ` height=${risk.height}` : ""}${risk.ratio ? ` ratio=${risk.ratio}` : ""}.`,
      rule: risk.rule,
      severity: "warning",
    })),
  ];
  const failureFindings = [
    ...metadataResult.failures,
    ...requiredCaptureFailures,
  ];
  const status = failureFindings.length > 0
    ? "fail"
    : options.failOnWarnings && warningFindings.length > 0
      ? "fail"
      : warningFindings.length > 0
        ? "warning"
        : "pass";

  const result: CaptureQaResult = {
    checkedCaptures: captures.length,
    duplicateClusters,
    failures: failureFindings,
    generatedAt: new Date().toISOString(),
    inputRoot: relativePath(inputRoot),
    longScreenRisks,
    manifestCount: manifests.length,
    outputDir: relativePath(outputDir),
    status,
    warnings: warningFindings,
  };

  writeReports(result);
  return result;
}

async function main() {
  const result = runCaptureQa({
    failOnWarnings,
    inputRoot: defaultInputRoot,
    outputDir: defaultOutputDir,
    requireCaptures,
  });

  console.log(JSON.stringify({
    checkedCaptures: result.checkedCaptures,
    duplicateClusters: result.duplicateClusters.length,
    failures: result.failures.length,
    longScreenRisks: result.longScreenRisks.length,
    outputDir: result.outputDir,
    status: result.status,
    warnings: result.warnings.length,
  }, null, 2));

  if (result.status === "fail") {
    process.exit(1);
  }
}

if (require.main === module) {
  void main();
}
