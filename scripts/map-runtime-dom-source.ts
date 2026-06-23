import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

type SourceCandidate = {
  confidence: "PROVEN" | "HIGH_CONFIDENCE" | "MEDIUM_CONFIDENCE" | "LOW_CONFIDENCE";
  domNodeId?: string | null;
  file?: string | null;
  line?: number | null;
  column?: number | null;
  proofLabel: string;
  score: number;
  symbol?: string | null;
  text?: string | null;
};

type TraceSource = {
  columnNumber?: number | null;
  exportOrFunctionSymbol?: string | null;
  fileName?: string | null;
  lineNumber?: number | null;
  local?: {
    columnNumber?: number | null;
    localFileExists?: boolean;
    localFilePath?: string | null;
    lineNumber?: number | null;
    proofLabel?: string | null;
    sourceId?: string | null;
  };
  sourceId?: string | null;
  sourceKind?: string | null;
};

type RuntimeDomNode = {
  bbox?: {
    height?: number;
    width?: number;
  };
  cropGeometry?: unknown;
  elementFromPoint?: {
    proof?: string;
  };
  nodeId?: string | null;
  role?: string | null;
  screenshotCropId?: string | null;
  testId?: string | null;
  text?: string | null;
};

type ReactTraceNode = {
  domNode?: {
    nodeId?: string | null;
  };
  handlerCandidates?: Array<{
    eventProp?: string | null;
    handlerName?: string | null;
    localFilePath?: string | null;
    localLineNumber?: number | null;
    proofLabel?: string | null;
  }>;
  source?: TraceSource;
};

type InteractionTrace = {
  action?: {
    assertions?: {
      checks?: unknown[];
      status?: string | null;
    };
  };
  after?: {
    dom?: {
      htmlHash?: string;
      nodeCount?: number;
      visibleTextHash?: string;
    };
    plannedClicks?: Array<Record<string, unknown>>;
    recentClicks?: Array<Record<string, unknown>>;
  };
  before?: {
    dom?: {
      htmlHash?: string;
      nodeCount?: number;
      visibleTextHash?: string;
    };
  };
};

const repoRoot = process.cwd();
const captureRoot = path.resolve(process.argv[2] ?? "");
if (!captureRoot || !existsSync(captureRoot)) {
  throw new Error("Usage: pnpm exec tsx scripts/map-runtime-dom-source.ts <capture-folder>");
}

const outDir = path.join(captureRoot, "runtime-dom-source-mapping");
mkdirSync(path.join(outDir, "imagemagick"), { recursive: true });

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

function writeJson(file: string, value: unknown) {
  writeFileSync(path.join(outDir, file), `${JSON.stringify(value, null, 2)}\n`);
}

function writeMd(file: string, value: string) {
  writeFileSync(path.join(outDir, file), `${value.trimEnd()}\n`);
}

function walk(root: string, skip: string[] = []) {
  const files: string[] = [];
  const visit = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (skip.some((skipPath) => entryPath === skipPath || entryPath.startsWith(`${skipPath}${path.sep}`))) continue;
      if (entry.isDirectory()) visit(entryPath);
      else if (entry.isFile()) files.push(entryPath);
    }
  };
  visit(root);
  return files;
}

function sha256(file: string) {
  return crypto.createHash("sha256").update(readFileSync(file)).digest("hex");
}

function relCapture(file: string) {
  return path.relative(captureRoot, file);
}

function relRepo(file: string) {
  return path.relative(repoRoot, file);
}

function table(headers: string[], rows: Array<Array<unknown>>) {
  const cell = (value: unknown) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").slice(0, 260);
  return [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`)].join("\n");
}

function command(commandName: string, args: string[]) {
  try {
    return execFileSync(commandName, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 10_000 }).trim();
  } catch {
    return null;
  }
}

function commandExists(commandName: string) {
  try {
    execFileSync("/bin/zsh", ["-lc", `command -v ${commandName}`], { stdio: ["ignore", "pipe", "ignore"], timeout: 3_000 });
    return true;
  } catch {
    return false;
  }
}

const sourceRoots = ["app", "components", "lib", "hooks", "contexts", "styles"].map((folder) => path.join(repoRoot, folder)).filter(existsSync);
const sourceFiles = sourceRoots
  .flatMap((root) => walk(root).filter((file) => /\.(tsx|ts|jsx|js|css)$/.test(file) && !file.endsWith(".d.ts")))
  .map((file) => ({ abs: file, rel: relRepo(file), content: readFileSync(file, "utf8") }));

type SourceMapSegment = {
  generatedColumn: number;
  name?: string | null;
  originalColumn?: number;
  originalLine?: number;
  source?: string | null;
};

type LoadedSourceMap = {
  file: string;
  mapPath: string;
  sources: string[];
  segmentsByLine: SourceMapSegment[][];
};

const vlqChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const vlqValues = new Map([...vlqChars].map((char, index) => [char, index]));
let loadedSourceMaps: LoadedSourceMap[] | null = null;

function decodeVlqSegment(segment: string) {
  const values: number[] = [];
  let value = 0;
  let shift = 0;

  for (const char of segment) {
    const digit = vlqValues.get(char);
    if (digit === undefined) continue;
    const continuation = Boolean(digit & 32);
    const digitValue = digit & 31;
    value += digitValue << shift;

    if (continuation) {
      shift += 5;
      continue;
    }

    const negative = value & 1;
    values.push((value >> 1) * (negative ? -1 : 1));
    value = 0;
    shift = 0;
  }

  return values;
}

function parseMappings(mappings: string, sources: string[]) {
  const lines = mappings.split(";");
  const segmentsByLine: SourceMapSegment[][] = [];
  let previousGeneratedColumn = 0;
  let previousSource = 0;
  let previousOriginalLine = 0;
  let previousOriginalColumn = 0;
  let previousName = 0;

  lines.forEach((line, lineIndex) => {
    previousGeneratedColumn = 0;
    const segments: SourceMapSegment[] = [];

    for (const rawSegment of line.split(",")) {
      if (!rawSegment) continue;
      const decoded = decodeVlqSegment(rawSegment);
      if (!decoded.length) continue;

      previousGeneratedColumn += decoded[0];
      const segment: SourceMapSegment = { generatedColumn: previousGeneratedColumn };

      if (decoded.length >= 4) {
        previousSource += decoded[1];
        previousOriginalLine += decoded[2];
        previousOriginalColumn += decoded[3];
        segment.source = sources[previousSource] ?? null;
        segment.originalLine = previousOriginalLine + 1;
        segment.originalColumn = previousOriginalColumn;
      }

      if (decoded.length >= 5) {
        previousName += decoded[4];
        segment.name = String(previousName);
      }

      segments.push(segment);
    }

    segmentsByLine[lineIndex + 1] = segments;
  });

  return segmentsByLine;
}

function sourceMapFiles() {
  const roots = [path.join(repoRoot, ".next", "static", "chunks"), path.join(repoRoot, ".next", "server"), path.join(repoRoot, ".next")].filter(existsSync);
  const seen = new Set<string>();
  const maps: string[] = [];

  for (const root of roots) {
    for (const file of walk(root).filter((entry) => entry.endsWith(".map"))) {
      if (seen.has(file)) continue;
      seen.add(file);
      maps.push(file);
    }
  }

  return maps;
}

function loadSourceMaps() {
  if (loadedSourceMaps) return loadedSourceMaps;
  loadedSourceMaps = [];

  for (const mapPath of sourceMapFiles()) {
    const map = readJson<{ file?: string; mappings?: string; sources?: string[] }>(mapPath);
    if (!map?.mappings || !map.sources?.length) continue;
    loadedSourceMaps.push({
      file: map.file ?? path.basename(mapPath).replace(/\.map$/, ""),
      mapPath,
      sources: map.sources,
      segmentsByLine: parseMappings(map.mappings, map.sources),
    });
  }

  return loadedSourceMaps;
}

function sourceMapForRuntimeFile(fileName: string) {
  const cleanName = fileName.replace(/^https?:\/\/[^/]+/, "");
  const basename = path.basename(cleanName);
  const withoutMap = basename.replace(/\.map$/, "");
  const maps = loadSourceMaps();

  return (
    maps.find((map) => path.basename(map.file) === withoutMap) ??
    maps.find((map) => path.basename(map.mapPath) === `${withoutMap}.map`) ??
    maps.find((map) => map.mapPath.includes(withoutMap))
  );
}

function normalizeSourceMapSource(source: string | null | undefined) {
  if (!source) return null;
  let normalized = source
    .replace(/^webpack:\/\/_N_E\//, "")
    .replace(/^webpack:\/\/[^/]+\//, "")
    .replace(/^file:\/\//, "")
    .replace(/^\((?:app|pages)-[^)]*\)\//, "")
    .replace(/^\.\//, "")
    .replace(/\?.*$/, "");

  const appMarker = normalized.match(/(?:^|\/)(app|components|lib|hooks|contexts|styles)\//);
  if (appMarker?.index !== undefined && appMarker.index >= 0) normalized = normalized.slice(appMarker.index).replace(/^\//, "");
  if (normalized.startsWith(repoRoot)) normalized = relRepo(normalized);

  const direct = sourceFiles.find((file) => normalized === file.rel || normalized.endsWith(`/${file.rel}`));
  if (direct) return direct.rel;
  const bySuffix = sourceFiles.filter((file) => file.rel.endsWith(normalized) || normalized.endsWith(file.rel));
  if (bySuffix.length === 1) return bySuffix[0].rel;
  return normalized;
}

function resolveSourceMapLocation(fileName: string | null | undefined, lineNumber: number | null | undefined, columnNumber: number | null | undefined) {
  if (!fileName || !lineNumber) return null;
  const map = sourceMapForRuntimeFile(fileName);
  if (!map) return null;
  const segments = map.segmentsByLine[lineNumber] ?? [];
  if (!segments.length) return null;
  const column = columnNumber ?? 0;
  const segment = [...segments].reverse().find((candidate) => candidate.generatedColumn <= column) ?? segments[0];
  if (!segment?.source || !segment.originalLine) return null;
  const localFilePath = normalizeSourceMapSource(segment.source);
  if (!localFilePath || !sourceExists(localFilePath)) return null;

  return {
    columnNumber: segment.originalColumn ?? null,
    fileName: segment.source,
    lineNumber: segment.originalLine,
    localFilePath,
    mapPath: relRepo(map.mapPath),
    sourceKind: "source-map",
  };
}

const routeOwnerHints: Array<{ match: RegExp; owner: string }> = [
  { match: /^\/(login|mfa|onboarding)/, owner: "components/auth-onboarding-screen.tsx" },
  { match: /^\/admin|^\/tenants/, owner: "components/admin-tenant-setup-screen.tsx" },
  { match: /^\/client|^\/relationships|^\/entities|^\/documents/, owner: "components/client-intake-screen.tsx" },
  { match: /^\/wealth-map|^\/actions|^\/advisory/, owner: "components/wealth-actions-screen.tsx" },
  { match: /^\/kyc/, owner: "components/kyc-aml-workflow-screen.tsx" },
  { match: /^\/ips/, owner: "components/suitability-ips-screen.tsx" },
  { match: /^\/reviews|^\/advisor|^\/committee/, owner: "components/review-monitoring-screen.tsx" },
  { match: /^\/compliance|^\/decisions|^\/evidence|^\/governance/, owner: "components/decisions-governance-screen.tsx" },
  { match: /^\/communication|^\/export|^\/ops|^\/service-blueprint|^\/roadmap|^\/states/, owner: "components/communication-export-ops-screen.tsx" },
];

function ownerForRoute(route: string | undefined) {
  const hint = routeOwnerHints.find((entry) => entry.match.test(route ?? ""));
  return hint?.owner ?? null;
}

function normalizeSourceFile(fileName: string | null | undefined) {
  if (!fileName) return null;
  let candidate = fileName.replace(/^webpack-internal:\/\/\/(?:\(.*?\)\/)?/, "").replace(/^file:\/\//, "").replace(/\?.*$/, "");
  candidate = candidate.replace(/^https?:\/\/[^/]+\/_next\/static\/chunks\//, "_next/static/chunks/");
  candidate = candidate.replace(/^webpack:\/\/_N_E\//, "").replace(/^webpack:\/\/[^/]+\//, "").replace(/^\.\//, "");
  if (candidate.startsWith(repoRoot)) return relRepo(candidate);
  const direct = sourceFiles.find((file) => candidate === file.rel || candidate.endsWith(`/${file.rel}`));
  if (direct) return direct.rel;
  const byBasename = sourceFiles.filter((file) => path.basename(file.rel) === path.basename(candidate));
  if (byBasename.length === 1) return byBasename[0].rel;
  return candidate;
}

function sourceExists(relPath: string | null | undefined) {
  return Boolean(relPath && existsSync(path.join(repoRoot, relPath)));
}

function resolveSourceLocation(source: {
  columnNumber?: number | null;
  fileName?: string | null;
  lineNumber?: number | null;
  local?: {
    columnNumber?: number | null;
    localFileExists?: boolean;
    localFilePath?: string | null;
    lineNumber?: number | null;
    proofLabel?: string | null;
    sourceId?: string | null;
  };
  sourceKind?: string | null;
}, symbol?: string | null) {
  const isExactRuntimeKind = ["_debugSource", "data-avs-source-id", "jsx-compile-time"].includes(source.sourceKind ?? "");
  const localFromRuntime = source.local?.localFilePath;
  if (localFromRuntime && sourceExists(localFromRuntime) && source.local?.lineNumber) {
    return {
      columnNumber: source.local.columnNumber ?? null,
      confidence: "PROVEN" as const,
      file: localFromRuntime,
      line: source.local.lineNumber,
      proofLabel: source.local.proofLabel === "SOURCE_MAP_NORMALIZED_MATCH" ? "SOURCE_MAP_NORMALIZED_MATCH" : "EXACT_SOURCE_MATCH",
      score: source.local.proofLabel === "SOURCE_MAP_NORMALIZED_MATCH" ? 90 : 100,
      sourceId: source.local.sourceId ?? `${localFromRuntime}:${source.local.lineNumber}:${source.local.columnNumber ?? 0}:${symbol ?? "unknown"}`,
    };
  }

  const directFile = normalizeSourceFile(source.fileName);
  if (directFile && sourceExists(directFile) && source.lineNumber && isExactRuntimeKind) {
    return {
      columnNumber: source.columnNumber ?? null,
      confidence: "PROVEN" as const,
      file: directFile,
      line: source.lineNumber,
      proofLabel: "EXACT_SOURCE_MATCH",
      score: 100,
      sourceId: `${directFile}:${source.lineNumber}:${source.columnNumber ?? 0}:${symbol ?? "unknown"}`,
    };
  }

  const sourceMap = resolveSourceMapLocation(source.fileName, source.lineNumber, source.columnNumber);
  if (sourceMap) {
    return {
      columnNumber: sourceMap.columnNumber,
      confidence: "PROVEN" as const,
      file: sourceMap.localFilePath,
      line: sourceMap.lineNumber,
      mapPath: sourceMap.mapPath,
      proofLabel: "SOURCE_MAP_NORMALIZED_MATCH",
      score: 90,
      sourceId: `${sourceMap.localFilePath}:${sourceMap.lineNumber}:${sourceMap.columnNumber ?? 0}:${symbol ?? "unknown"}`,
    };
  }

  return null;
}

function findText(text: string, limit = 3) {
  if (text.trim().length < 6) return [];
  const hits: SourceCandidate[] = [];
  for (const file of sourceFiles) {
    const index = file.content.indexOf(text);
    if (index >= 0) {
      hits.push({
        confidence: "MEDIUM_CONFIDENCE",
        file: file.rel,
        line: file.content.slice(0, index).split("\n").length,
        proofLabel: "TEXT_CONSTANT_MATCH",
        score: 35,
        text,
      });
      if (hits.length >= limit) break;
    }
  }
  return hits;
}

function topK(candidates: SourceCandidate[], k = 12) {
  const key = (candidate: SourceCandidate) =>
    `${candidate.file ?? "unresolved"}:${candidate.line ?? ""}:${candidate.column ?? ""}:${candidate.domNodeId ?? ""}:${candidate.proofLabel}:${candidate.symbol ?? candidate.text ?? ""}`;
  const unique = new Map<string, SourceCandidate>();
  for (const candidate of candidates) {
    const existing = unique.get(key(candidate));
    if (!existing || candidate.score > existing.score) unique.set(key(candidate), candidate);
  }
  return [...unique.values()].sort((a, b) => b.score - a.score || a.proofLabel.localeCompare(b.proofLabel)).slice(0, k);
}

function imageInfo(file: string) {
  if (commandExists("magick")) {
    const raw = command("magick", ["identify", "-format", "%w|%h|%[colorspace]", file]);
    if (raw) {
      const [width, height, colorspace] = raw.split("|");
      return { colorspace, height: Number(height), status: "OK", width: Number(width) };
    }
  }
  return { status: "IMAGE_METADATA_UNAVAILABLE" };
}

const head = existsSync(path.join(repoRoot, ".git", "HEAD")) ? readFileSync(path.join(repoRoot, ".git", "HEAD"), "utf8").trim() : "";
let branch = "UNKNOWN";
let commit = "UNKNOWN";
if (head.startsWith("ref: ")) {
  const ref = head.slice(5);
  branch = ref.replace(/^refs\/heads\//, "");
  const refPath = path.join(repoRoot, ".git", ref);
  if (existsSync(refPath)) commit = readFileSync(refPath, "utf8").trim();
} else if (head) {
  commit = head;
}

const files = walk(captureRoot, [outDir]);
const fileRows = files.map((file) => ({
  bytes: statSync(file).size,
  path: relCapture(file),
  role: roleFor(file),
  sha256: sha256(file),
}));

function roleFor(file: string) {
  const base = path.basename(file);
  if (base === "index.json") return "bundle_index_json";
  if (/\.png$/i.test(base)) return "screenshot_png";
  if (/\.rendered\.html$/i.test(base)) return "rendered_html";
  if (/\.rendered\.css$/i.test(base)) return "rendered_css";
  if (/\.components\.runtime\.json$/i.test(base)) return "runtime_reflection_json";
  if (/\.RUNTIME_DOM_RECT_TRACE\.json$/i.test(base)) return "runtime_dom_rect_trace";
  if (/\.REACT_SOURCE_TRACE\.json$/i.test(base)) return "react_source_trace";
  if (/\.INTERACTION_PROOF_TRACE\.json$/i.test(base)) return "interaction_proof_trace";
  return "other";
}

const byBase = new Map(files.map((file) => [path.basename(file), file]));
const index = readJson<{ baseUrl?: string; generatedAt?: string; items?: Array<Record<string, string>> }>(path.join(captureRoot, "index.json")) ?? {};
const items = index.items ?? [];

function sidecar(item: Record<string, string>, prop: string, suffix: string) {
  const explicit = item[prop];
  if (explicit && byBase.has(path.basename(explicit))) return byBase.get(path.basename(explicit))!;
  return byBase.get(path.basename(item.path ?? "").replace(/\.png$/i, suffix)) ?? null;
}

const captures = items.map((item) => {
  const screenshot = byBase.get(path.basename(item.path ?? "")) ?? null;
  const html = sidecar(item, "domPath", ".rendered.html");
  const rect = sidecar(item, "domRectTracePath", ".RUNTIME_DOM_RECT_TRACE.json");
  const react = sidecar(item, "reactSourceTracePath", ".REACT_SOURCE_TRACE.json");
  const interaction = sidecar(item, "interactionProofTracePath", ".INTERACTION_PROOF_TRACE.json");
  const captureId = `${item.pageId}:${item.route}:${item.state}`.replace(/[^a-zA-Z0-9:/_-]+/g, "-");
  return {
    captureId,
    html,
    image: screenshot ? imageInfo(screenshot) : { status: "MISSING_SCREENSHOT" },
    interaction,
    interactionTrace: interaction ? readJson<InteractionTrace>(interaction) : null,
    item,
    react,
    reactTrace: react ? readJson<{ nodes?: ReactTraceNode[] }>(react) : null,
    rect,
    rectTrace: rect ? readJson<{ nodes?: RuntimeDomNode[] }>(rect) : null,
    screenshot,
  };
});

const imageDomMappings = captures.map((capture) => {
  const rectNodes = capture.rectTrace?.nodes ?? [];
  const regions = rectNodes
    .filter(
      (node): node is RuntimeDomNode & { bbox: { height: number; width: number } } =>
        typeof node.bbox?.width === "number" &&
        typeof node.bbox?.height === "number" &&
        node.bbox.width > 0 &&
        node.bbox.height > 0 &&
        Boolean(node.role || node.testId || node.text || node.elementFromPoint),
    )
    .slice(0, 120)
    .map((node) => ({
      confidence: node.elementFromPoint?.proof === "ELEMENT_FROM_POINT_MATCH" ? "PROVEN" : "HIGH_CONFIDENCE",
      cropGeometry: node.cropGeometry,
      domNodeId: node.nodeId,
      elementFromPoint: node.elementFromPoint,
      regionId: `${capture.captureId}:region:${node.nodeId}`,
      screenshotCropId: node.screenshotCropId,
    }));
  return {
    assets: {
      domRectTrace: capture.rect ? relCapture(capture.rect) : null,
      interactionProofTrace: capture.interaction ? relCapture(capture.interaction) : null,
      reactSourceTrace: capture.react ? relCapture(capture.react) : null,
      screenshot: capture.screenshot ? relCapture(capture.screenshot) : null,
    },
    captureId: capture.captureId,
    regions,
    route: capture.item.route,
    state: capture.item.state,
  };
});

const domSourceMappings = captures.map((capture) => {
  const candidates: SourceCandidate[] = [];
  const add = (candidate: SourceCandidate) => candidates.push(candidate);

  if (sourceExists("app/[...segments]/page.tsx")) {
    add({ confidence: "HIGH_CONFIDENCE", file: "app/[...segments]/page.tsx", proofLabel: "FILE_ROUTING_MATCH", score: 70 });
  }
  const routeOwner = ownerForRoute(capture.item.route);
  if (sourceExists(routeOwner)) {
    add({
      confidence: "HIGH_CONFIDENCE",
      file: routeOwner,
      proofLabel: "ROUTE_COMPONENT_OWNER_MATCH",
      score: 88,
      symbol: path.basename(routeOwner ?? "", ".tsx"),
    });
  }
  for (const term of [capture.item.route, capture.item.pageId, capture.item.title].filter(Boolean)) {
    for (const hit of findText(String(term), 4)) {
      if (hit.file === "lib/route-registry.ts") add({ ...hit, confidence: "HIGH_CONFIDENCE", proofLabel: "ROUTE_REGISTRY_MATCH", score: 70 });
    }
  }

  for (const node of capture.reactTrace?.nodes ?? []) {
    const symbol = node.source?.exportOrFunctionSymbol ?? null;
    const resolvedLocation = resolveSourceLocation(node.source ?? {}, symbol);
    const resolvedFile = resolvedLocation?.file ?? node.source?.local?.localFilePath ?? normalizeSourceFile(node.source?.fileName);
    if (resolvedLocation) {
      add({
        column: resolvedLocation.columnNumber,
        confidence: resolvedLocation.confidence,
        domNodeId: node.domNode?.nodeId,
        file: resolvedLocation.file,
        line: resolvedLocation.line,
        proofLabel: resolvedLocation.proofLabel,
        score: resolvedLocation.score,
        symbol,
      });
    } else if (resolvedFile) {
      const isFrameworkCompiledHint = /^https?:\/\/|_next\/static|next_dist_compiled|node_modules/.test(resolvedFile);
      add({
        confidence: "LOW_CONFIDENCE",
        domNodeId: node.domNode?.nodeId,
        file: resolvedFile,
        proofLabel: "COMPILED_RUNTIME_HINT",
        score: isFrameworkCompiledHint ? 1 : 5,
        symbol: node.source?.exportOrFunctionSymbol ?? null,
      });
    }
    for (const handler of node.handlerCandidates ?? []) {
      const handlerIsExact = handler.proofLabel === "HANDLER_EXACT_SOURCE_MATCH";
      const handlerIsSourceMatch = handler.proofLabel === "HANDLER_SOURCE_MATCH";
      const proofLabel = handlerIsExact ? "HANDLER_EXACT_SOURCE_MATCH" : handlerIsSourceMatch ? "HANDLER_SOURCE_MATCH" : "EVENT_HANDLER_CANDIDATE";
      add({
        confidence: handlerIsExact ? "PROVEN" : handlerIsSourceMatch ? "HIGH_CONFIDENCE" : "MEDIUM_CONFIDENCE",
        domNodeId: node.domNode?.nodeId,
        file: handler.localFilePath ?? (sourceExists(routeOwner) ? routeOwner : resolvedFile) ?? null,
        line: handler.localLineNumber ?? null,
        proofLabel: handlerIsExact || handlerIsSourceMatch ? proofLabel : sourceExists(routeOwner) ? "HANDLER_ROUTE_OWNER_CANDIDATE" : proofLabel,
        score: handlerIsExact ? 96 : handlerIsSourceMatch ? 85 : sourceExists(routeOwner) ? 65 : 55,
        symbol: handler.handlerName ?? handler.eventProp ?? null,
      });
    }
  }

  const assertionStatus = capture.interactionTrace?.action?.assertions?.status ?? null;
  const assertionChecks = capture.interactionTrace?.action?.assertions?.checks ?? [];
  const observableEffect =
    capture.interactionTrace?.before?.dom?.htmlHash !== capture.interactionTrace?.after?.dom?.htmlHash ||
    capture.interactionTrace?.before?.dom?.visibleTextHash !== capture.interactionTrace?.after?.dom?.visibleTextHash ||
    capture.interactionTrace?.before?.dom?.nodeCount !== capture.interactionTrace?.after?.dom?.nodeCount;
  const plannedClicks = capture.interactionTrace?.after?.plannedClicks ?? [];
  const recentClicks = capture.interactionTrace?.after?.recentClicks ?? [];
  const interactionProofs = [...plannedClicks.map((click) => ({ click, clickKind: "planned-click" })), ...recentClicks.map((click) => ({ click, clickKind: "runtime-click" }))]
    .filter((entry) => entry.click)
    .map((entry) => ({
      ...entry,
      assertions: {
        checks: assertionChecks,
        status: assertionStatus,
      },
      confidence: assertionStatus === "passed" || observableEffect ? "PROVEN" : assertionStatus === "warning" ? "HIGH_CONFIDENCE" : "MEDIUM_CONFIDENCE",
      proofLabel: assertionStatus === "passed" ? "INTERACTION_ASSERTION_PASS" : "INTERACTION_PROOF_TRACE",
    }));

  return {
    captureId: capture.captureId,
    gaps: [
      ...(candidates.some((candidate) => candidate.proofLabel === "EXACT_SOURCE_MATCH" || candidate.proofLabel === "SOURCE_MAP_NORMALIZED_MATCH") ? [] : [{ label: "NO_EXACT_REACT_SOURCE_MATCH" }]),
      ...(capture.interaction ? [] : [{ label: "NO_INTERACTION_TEST_FOR_CAPTURE" }]),
      ...(capture.interaction && !interactionProofs.length ? [{ label: "INTERACTION_TRACE_WITHOUT_CLICK_EVIDENCE" }] : []),
      ...(capture.interaction && assertionStatus === "failed" ? [{ label: "INTERACTION_ASSERTION_FAILED" }] : []),
    ],
    interactionProofs,
    route: capture.item.route,
    sourceCandidates: topK(candidates, 12),
    state: capture.item.state,
  };
});

const sourceTrace: Record<string, { captures: unknown[]; proofLabels: Record<string, number>; sourceId: string }> = {};
for (const mapping of domSourceMappings) {
  for (const candidate of mapping.sourceCandidates) {
    if (!candidate.file) continue;
    sourceTrace[candidate.file] ??= { captures: [], proofLabels: {}, sourceId: candidate.file };
    sourceTrace[candidate.file].captures.push({ captureId: mapping.captureId, route: mapping.route, state: mapping.state, ...candidate });
    sourceTrace[candidate.file].proofLabels[candidate.proofLabel] = (sourceTrace[candidate.file].proofLabels[candidate.proofLabel] ?? 0) + 1;
  }
}

const inventory = {
  bundle: { captureRoot, fileCount: fileRows.length, indexItems: items.length },
  captures: captures.map((capture) => ({
    captureId: capture.captureId,
    domRectTrace: Boolean(capture.rect),
    interactionProofTrace: Boolean(capture.interaction),
    reactSourceTrace: Boolean(capture.react),
    ready: Boolean(capture.screenshot && capture.html && capture.rect && capture.react),
    route: capture.item.route,
    state: capture.item.state,
  })),
  files: fileRows,
  generatedAt: new Date().toISOString(),
  repo: { branch, commit, root: repoRoot, sourceFileCount: sourceFiles.length },
};

const canonical = {
  captures: captures.map((capture) => ({
    assets: {
      domRectTrace: capture.rect ? relCapture(capture.rect) : null,
      interactionProofTrace: capture.interaction ? relCapture(capture.interaction) : null,
      reactSourceTrace: capture.react ? relCapture(capture.react) : null,
      screenshot: capture.screenshot ? relCapture(capture.screenshot) : null,
    },
    captureId: capture.captureId,
    route: capture.item.route,
    state: capture.item.state,
  })),
  confidenceLabels: ["PROVEN", "HIGH_CONFIDENCE", "MEDIUM_CONFIDENCE", "LOW_CONFIDENCE", "BLOCKED"],
  entities: {
    DOMNode: "Runtime node with DOM rect and elementFromPoint evidence",
    InteractionProofTrace: "Planned/recent click and before-after evidence",
    ReactSourceTrace: "DOM node to React owner/source/handler evidence",
    SourceCandidate: "Top-K scored source candidate",
  },
  generatedAt: new Date().toISOString(),
  proofLabels: ["EXACT_SOURCE_MATCH", "SOURCE_MAP_NORMALIZED_MATCH", "HANDLER_EXACT_SOURCE_MATCH", "HANDLER_SOURCE_MATCH", "EVENT_HANDLER_CANDIDATE", "ROUTE_REGISTRY_MATCH", "FILE_ROUTING_MATCH", "COMPILED_RUNTIME_HINT"],
};

writeJson("RUNTIME_CAPTURE_UPLOAD_INVENTORY.json", inventory);
writeJson("CANONICAL_RUNTIME_MAPPING_MODEL.schema.json", { $schema: "https://json-schema.org/draft/2020-12/schema", type: "object" });
writeJson("IMAGE_TO_DOM_MAPPING.json", { generatedAt: new Date().toISOString(), mappings: imageDomMappings });
writeJson("DOM_TO_SOURCE_CODE_MAPPING.json", { generatedAt: new Date().toISOString(), mappings: domSourceMappings, scoring: { exactSource: 100, sourceMapNormalized: 90, handlerSource: 85, routeRegistry: 70, eventHandlerCandidate: 55, textConstant: 35, compiledRuntimeHint: 5, topK: 12 } });
writeJson("SOURCE_COMPONENT_TRACE_INDEX.json", { generatedAt: new Date().toISOString(), sourceFiles: Object.values(sourceTrace).sort((a, b) => b.captures.length - a.captures.length) });
writeJson("CANONICAL_RUNTIME_MAPPING_MODEL.json", canonical);
writeJson("imagemagick/REGION_ANALYSIS.json", { generatedAt: new Date().toISOString(), captures: imageDomMappings.map((mapping) => ({ captureId: mapping.captureId, regions: mapping.regions })) });

writeMd("RUNTIME_CAPTURE_UPLOAD_INVENTORY.md", `# Runtime Capture Upload Inventory\n\n${table(["Metric", "Value"], [["Capture folder", captureRoot], ["Captures", captures.length], ["Ready", inventory.captures.filter((capture) => capture.ready).length], ["DOM rect traces", inventory.captures.filter((capture) => capture.domRectTrace).length], ["React source traces", inventory.captures.filter((capture) => capture.reactSourceTrace).length], ["Interaction traces", inventory.captures.filter((capture) => capture.interactionProofTrace).length]])}`);
writeMd("CANONICAL_RUNTIME_MAPPING_MODEL.md", `# Canonical Runtime Mapping Model\n\n${table(["Entity", "Meaning"], Object.entries(canonical.entities))}`);
writeMd("IMAGE_TO_DOM_MAPPING.md", `# Image to DOM Mapping\n\n${table(["Metric", "Value"], [["Captures", imageDomMappings.length], ["Regions", imageDomMappings.reduce((sum, mapping) => sum + mapping.regions.length, 0)], ["ElementFromPoint proven", imageDomMappings.flatMap((mapping) => mapping.regions).filter((region) => region.confidence === "PROVEN").length]])}`);
writeMd("DOM_TO_SOURCE_CODE_MAPPING.md", `# DOM to Source Code Mapping\n\n${table(["Metric", "Value"], [["Captures", domSourceMappings.length], ["Top-K source candidates", domSourceMappings.reduce((sum, mapping) => sum + mapping.sourceCandidates.length, 0)], ["Exact source matches", domSourceMappings.flatMap((mapping) => mapping.sourceCandidates).filter((candidate) => candidate.proofLabel === "EXACT_SOURCE_MATCH").length], ["Exact handler source matches", domSourceMappings.flatMap((mapping) => mapping.sourceCandidates).filter((candidate) => candidate.proofLabel === "HANDLER_EXACT_SOURCE_MATCH").length], ["Handler source matches", domSourceMappings.flatMap((mapping) => mapping.sourceCandidates).filter((candidate) => candidate.proofLabel === "HANDLER_SOURCE_MATCH").length], ["Compiled hints kept after Top-K", domSourceMappings.flatMap((mapping) => mapping.sourceCandidates).filter((candidate) => candidate.proofLabel === "COMPILED_RUNTIME_HINT").length], ["Interaction proofs", domSourceMappings.flatMap((mapping) => mapping.interactionProofs).length], ["Interaction assertion pass", domSourceMappings.flatMap((mapping) => mapping.interactionProofs).filter((proof) => proof.proofLabel === "INTERACTION_ASSERTION_PASS").length]])}`);
writeMd("RUNTIME_DOM_SOURCE_MAPPING_INDEX.md", `# Runtime DOM Source Mapping Index\n\n${table(["Field", "Value"], [["Repo", repoRoot], ["Branch", branch], ["Commit", commit], ["Capture folder", captureRoot], ["Output folder", outDir], ["Top-K filter", "enabled, max 12 candidates per capture"]])}`);

console.log(JSON.stringify({ outDir, captures: captures.length, topKCandidates: domSourceMappings.reduce((sum, mapping) => sum + mapping.sourceCandidates.length, 0), exactSourceMatches: domSourceMappings.flatMap((mapping) => mapping.sourceCandidates).filter((candidate) => candidate.proofLabel === "EXACT_SOURCE_MATCH").length, exactHandlerSourceMatches: domSourceMappings.flatMap((mapping) => mapping.sourceCandidates).filter((candidate) => candidate.proofLabel === "HANDLER_EXACT_SOURCE_MATCH").length, handlerSourceMatches: domSourceMappings.flatMap((mapping) => mapping.sourceCandidates).filter((candidate) => candidate.proofLabel === "HANDLER_SOURCE_MATCH").length, interactionProofs: domSourceMappings.flatMap((mapping) => mapping.interactionProofs).length, interactionAssertionPass: domSourceMappings.flatMap((mapping) => mapping.interactionProofs).filter((proof) => proof.proofLabel === "INTERACTION_ASSERTION_PASS").length }, null, 2));
