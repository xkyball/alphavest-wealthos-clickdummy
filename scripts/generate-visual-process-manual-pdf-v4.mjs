import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const PYTHON =
  "/Users/chris/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const POPPLER_BIN = "/Users/chris/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin";

const blueprintPath = path.join(
  ROOT,
  "docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.json",
);
const annotationMapPath = path.join(ROOT, "docs/v3/user-manual-visual-process/annotated-screenshot-map.json");
const processMapPath = path.join(ROOT, "docs/v3/user-manual-visual-process/process-graphic-map.json");
const visualStandardPath =
  "/Users/chris/Documents/Source/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/README.md";
const visualRulesPath =
  "/Users/chris/Documents/Source/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/visual-implementation-rules.md";
const visualRubricPath =
  "/Users/chris/Documents/Source/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/human-visual-review-rubric.md";
const visualAdapterPath =
  "/Users/chris/Documents/Source/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/alphavest-project-adapter-delta.md";

const pdfSourceDir = path.join(ROOT, "docs/v3/user-manual-pdf/source");
const outputPdfDir = path.join(ROOT, "output/pdf");
const renderedDir = path.join(outputPdfDir, "rendered/visual-process-v4");

const dataPath = path.join(pdfSourceDir, "visual-process-manual-pdf-data-v4.json");
const htmlPath = path.join(pdfSourceDir, "alphavest-visual-process-manual-v4.html");
const cssPath = path.join(pdfSourceDir, "alphavest-visual-process-manual-v4.css");
const outputHtmlPath = path.join(outputPdfDir, "alphavest-wealthos-visual-process-manual-v4.html");
const pdfPath = path.join(outputPdfDir, "alphavest-wealthos-visual-process-manual-v4.pdf");
const contactSheetPath = path.join(renderedDir, "alphavest-visual-process-manual-v4-contact-sheet.png");
const qaPath = path.join(ROOT, "docs/v3/user-manual-pdf/ALPHAVEST_VISUAL_PROCESS_MANUAL_PDF_QA_REPORT_V4.md");
const readmePath = path.join(ROOT, "docs/v3/user-manual-pdf/README.md");

const researchPrinciples = [
  {
    source: "NN/g Help and Documentation",
    url: "https://www.nngroup.com/articles/help-and-documentation/",
    principle: "Keep help task-focused, concise, searchable, and grounded in concrete steps.",
  },
  {
    source: "NN/g Complex Application Design",
    url: "https://www.nngroup.com/articles/complex-application-design/",
    principle: "Complex applications need clear workflow support, visible state, and reduced cognitive load.",
  },
  {
    source: "Microsoft Procedures and Instructions",
    url: "https://learn.microsoft.com/en-us/style-guide/procedures-instructions/",
    principle: "Use consistent procedural instructions and input-neutral UI interaction wording.",
  },
  {
    source: "Microsoft Step-by-Step Instructions",
    url: "https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions",
    principle: "Choose simple or complex procedure formats based on the task, not on route structure.",
  },
  {
    source: "W3C PDF Reading Order",
    url: "https://www.w3.org/TR/WCAG20-TECHS/PDF3.html",
    principle: "PDF content should preserve a logical reading order as far as the production pipeline allows.",
  },
  {
    source: "W3C PDF Document Title",
    url: "https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF18",
    principle: "The PDF should expose a meaningful document title and metadata where possible.",
  },
  {
    source: "PDF Association Accessibility",
    url: "https://pdfa.org/accessibility/",
    principle: "Tagged PDF and PDF/UA status must be handled honestly as a structural accessibility question.",
  },
  {
    source: "PDF Association Tagged PDF Best Practice Guide",
    url: "https://pdfa.org/resource/tagged-pdf-best-practice-guide-syntax/",
    principle: "Tagged PDFs require structural semantics, not only visual polish.",
  },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function htmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    ...options,
  });
  return {
    command: [command, ...args].join(" "),
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

function imageTag(relativePath, alt) {
  const absolutePath = path.join(ROOT, relativePath);
  const url = pathToFileURL(absolutePath).href;
  return `<img src="${url}" alt="${htmlEscape(alt)}" />`;
}

function list(items) {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!values.length) return "<p>No source detail provided.</p>";
  return `<ul>${values.map((item) => `<li>${htmlEscape(item)}</li>`).join("")}</ul>`;
}

function joined(items, fallback = "Not specified") {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  return values.length ? values.join(", ") : fallback;
}

function verifyExists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function buildData() {
  const blueprint = readJson(blueprintPath);
  const annotationMap = readJson(annotationMapPath);
  const processGraphicMap = readJson(processMapPath);
  const annotationsByWorkflow = new Map(annotationMap.map((entry) => [entry.workflowId, entry]));
  const graphicsByWorkflow = new Map(processGraphicMap.map((entry) => [entry.workflowId, entry]));

  const modules = blueprint.modules.map((workflow) => {
    const annotation = annotationsByWorkflow.get(workflow.workflowId);
    const graphic = graphicsByWorkflow.get(workflow.workflowId);
    const annotatedScreenshot = workflow.annotatedScreenshot || annotation?.outputAnnotatedScreenshotPath;
    const processGraphic = workflow.processGraphicPng || graphic?.pngPath;
    return {
      ...workflow,
      annotation,
      processGraphicMap: graphic,
      annotatedScreenshot,
      processGraphic,
      artifacts: {
        processGraphicExists: processGraphic ? verifyExists(processGraphic) : false,
        annotatedScreenshotExists: annotatedScreenshot ? verifyExists(annotatedScreenshot) : false,
        processSvgExists: workflow.processGraphicSvg ? verifyExists(workflow.processGraphicSvg) : false,
      },
    };
  });

  return {
    metadata: {
      title: "AlphaVest WealthOS Visual Process User Manual V4",
      generatedAt: new Date().toISOString(),
      engineMode: "ENGINE_MIX_V2_SOURCE_V3_PROOF",
      visualImplementationStandard: visualStandardPath,
      visualRules: visualRulesPath,
      visualRubric: visualRubricPath,
      visualAdapter: visualAdapterPath,
      boundary: "V4 PDF production from the existing visual-process package; not production certification.",
    },
    researchPrinciples,
    sourceInputs: {
      blueprint: path.relative(ROOT, blueprintPath),
      annotationMap: path.relative(ROOT, annotationMapPath),
      processGraphicMap: path.relative(ROOT, processMapPath),
    },
    counts: {
      workflowModules: modules.length,
      processGraphics: modules.filter((item) => item.artifacts.processGraphicExists).length,
      annotatedScreenshots: modules.filter((item) => item.artifacts.annotatedScreenshotExists).length,
      callouts: modules.reduce((sum, item) => sum + item.callouts.length, 0),
      broadRegionCallouts: modules
        .flatMap((item) => item.callouts)
        .filter((callout) => /broad-region/i.test(callout.confidence || "")).length,
    },
    modules,
    rejectedWeakApproaches: [
      "Table-led manual",
      "Screenshot-only manual",
      "Route-led manual",
      "Generic diagram-only manual",
      "Dense visibility matrix as the main explanation",
      "Unannotated screenshot evidence",
      "Decorative process graphics that do not map to UI evidence",
      "Edge-to-edge dense PDF pages",
      "Tiny type to force fewer pages",
      "Prompt/spec-board style pages",
    ],
  };
}

function createLegendSvg() {
  return `<svg class="legend-svg" viewBox="0 0 980 255" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visual legend for process graphics">
  <rect x="0" y="0" width="980" height="255" rx="18" fill="#fffdf8" stroke="#d8cfbf"/>
  <rect x="42" y="44" width="150" height="58" rx="12" fill="#ffffff" stroke="#b88a38" stroke-width="3"/>
  <text x="64" y="80" font-family="Inter, Arial" font-size="18" fill="#10283b">Task/action</text>
  <polygon points="304,30 390,73 304,116 218,73" fill="#efe2c2" stroke="#b88a38" stroke-width="3"/>
  <text x="260" y="81" font-family="Inter, Arial" font-size="17" fill="#10283b">Gate</text>
  <rect x="432" y="38" width="158" height="76" rx="16" fill="#fbf7ef" stroke="#d8cfbf"/>
  <text x="456" y="80" font-family="Inter, Arial" font-size="18" font-weight="700" fill="#10283b">Role lane</text>
  <path d="M648 38 h120 l20 20 v62 h-140 z" fill="#ffffff" stroke="#687586" stroke-width="3"/>
  <text x="674" y="80" font-family="Inter, Arial" font-size="17" fill="#10283b">Data object</text>
  <circle cx="872" cy="72" r="25" fill="#b88a38"/>
  <text x="864" y="82" font-family="Inter, Arial" font-size="26" font-weight="800" fill="#ffffff">1</text>
  <text x="822" y="124" font-family="Inter, Arial" font-size="16" fill="#10283b">Screenshot callout</text>
  <line x1="55" y1="181" x2="196" y2="181" stroke="#10283b" stroke-width="4" marker-end="url(#arrow)"/>
  <text x="55" y="215" font-family="Inter, Arial" font-size="16" fill="#10283b">Current path</text>
  <line x1="250" y1="181" x2="390" y2="181" stroke="#687586" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#arrow)"/>
  <text x="250" y="215" font-family="Inter, Arial" font-size="16" fill="#10283b">Future/demo boundary</text>
  <rect x="456" y="158" width="52" height="52" rx="12" fill="#10283b"/>
  <text x="472" y="193" font-family="Inter, Arial" font-size="28" fill="#ffffff">L</text>
  <text x="525" y="190" font-family="Inter, Arial" font-size="16" fill="#10283b">Visibility / lock boundary</text>
  <rect x="735" y="158" width="52" height="52" rx="12" fill="#efe2c2" stroke="#b88a38" stroke-width="3"/>
  <text x="751" y="193" font-family="Inter, Arial" font-size="28" fill="#10283b">A</text>
  <text x="804" y="190" font-family="Inter, Arial" font-size="16" fill="#10283b">Audit / evidence marker</text>
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10283b"/></marker></defs>
</svg>`;
}

function calloutCard(callout) {
  return `<article class="callout-card">
    <div class="callout-heading"><span>${callout.number}</span><strong>${htmlEscape(callout.label)}</strong></div>
    <p><b>User action or inspection:</b> ${htmlEscape(callout.action)}</p>
    <p><b>Why this matters:</b> ${htmlEscape(callout.why)}</p>
    <p><b>Required data:</b> ${htmlEscape(callout.requiredData)}</p>
    <p><b>State:</b> ${htmlEscape(callout.stateChange)}</p>
    <p><b>Visibility:</b> ${htmlEscape(callout.visibilityChange)}</p>
    <p><b>Evidence/audit:</b> ${htmlEscape(callout.evidenceEffect)}</p>
    <p><b>Next role sees:</b> ${htmlEscape(callout.nextRoleSees)}</p>
  </article>`;
}

function workflowSections(workflow) {
  return `<section class="page workflow-overview" id="${workflow.workflowId}">
    <p class="eyebrow">Workflow module ${workflow.workflowId}</p>
    <h2>${htmlEscape(workflow.title)}</h2>
    <p class="lead">${htmlEscape(workflow.outcome)}</p>
    <div class="fact-strip">
      <article><h3>Why this exists</h3><p>${htmlEscape(workflow.businessReason)}</p></article>
      <article><h3>Roles</h3><p>${htmlEscape(joined(workflow.roles))}</p></article>
      <article><h3>Data object</h3><p>${htmlEscape(joined(workflow.dataObjects))}</p></article>
    </div>
    <figure class="process-figure">
      ${imageTag(workflow.processGraphic, `${workflow.workflowId} process graphic`)}
      <figcaption>${htmlEscape(workflow.processGraphicCaption)} This page shows the process before the reader inspects the UI evidence.</figcaption>
    </figure>
  </section>

  <section class="page ui-evidence">
    <p class="eyebrow">Annotated UI evidence ${workflow.workflowId}</p>
    <h2>Where the process appears in the interface</h2>
    <figure class="screenshot-figure">
      ${imageTag(workflow.annotatedScreenshot, `${workflow.workflowId} annotated screenshot`)}
      <figcaption>${htmlEscape(workflow.screenshotPlan?.whyTheyMatter || workflow.confidenceNote)}</figcaption>
    </figure>
    <div class="callout-grid">
      ${workflow.callouts.map((callout) => calloutCard(callout)).join("")}
    </div>
  </section>

  <section class="page recovery">
    <p class="eyebrow">Gate, exception, and recovery ${workflow.workflowId}</p>
    <h2>What can block the workflow and what remains protected</h2>
    <div class="recovery-grid">
      <article><h3>What the system prevents</h3>${list(workflow.systemPrevents)}</article>
      <article><h3>What remains hidden</h3>${list(workflow.visibilitySequence)}</article>
      <article><h3>Evidence and audit lineage</h3>${list(workflow.evidenceAuditSequence)}</article>
      <article><h3>What becomes possible next</h3><p>${htmlEscape(workflow.nextProcessEnabled || workflow.readerTakeaway)}</p></article>
    </div>
    <aside class="demo-boundary">
      <h3>Demo boundary</h3>
      <p>${htmlEscape(workflow.demoBoundary)}</p>
    </aside>
  </section>`;
}

function createHtml(data) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${htmlEscape(data.metadata.title)}</title>
  <link rel="stylesheet" href="./alphavest-visual-process-manual-v4.css" />
</head>
<body>
  <main>
    <section class="cover">
      <div class="cover-kicker">
        <span>AlphaVest WealthOS</span>
        <span>Visual Process User Manual / V4</span>
      </div>
      <div class="cover-copy">
        <p class="eyebrow light">Process graphics + annotated UI evidence</p>
        <h1>Understand the workflow before touching the interface.</h1>
        <p>Role handoffs, visibility gates, evidence trails, and UI callouts are explained together so the reader can see why each action matters.</p>
      </div>
      <div class="cover-meta">
        <span>Generated ${htmlEscape(data.metadata.generatedAt.slice(0, 10))}</span>
        <span>${htmlEscape(data.metadata.engineMode)}</span>
        <span>${data.counts.workflowModules} workflows</span>
      </div>
    </section>

    <section class="page orientation">
      <p class="eyebrow">Reader orientation</p>
      <h2>How to read this manual</h2>
      <p class="lead">AlphaVest WealthOS is a collaboration system for turning fragmented client, document, recommendation, governance, export, and operations data into controlled workflow state.</p>
      <div class="orientation-grid">
        <article><h3>Process first</h3><p>Each workflow begins with a role/state process graphic so the reader knows what is happening before reading UI detail.</p></article>
        <article><h3>Screenshot second</h3><p>Annotated screenshots show where the process appears and connect numbered regions to procedure explanations.</p></article>
        <article><h3>Gate-aware</h3><p>Advisor review, compliance release, permission scope, evidence lineage, and audit boundaries are explained as workflow controls.</p></article>
        <article><h3>Demo-aware</h3><p>The manual distinguishes current demo surfaces from production persistence, certification, and full PDF/UA accessibility claims.</p></article>
      </div>
      <div class="source-note">
        <h3>Source Visual Implementation Standard</h3>
        <p>This V4 PDF is produced under the Source Visual Implementation Standard: rendered pages, contact sheet, visual self-review, and explicit limitations are required before acceptance.</p>
      </div>
    </section>

    <section class="page legend">
      <p class="eyebrow">Process legend</p>
      <h2>The visual grammar used throughout the manual</h2>
      <p class="lead">The same symbols repeat across every workflow so process graphics and annotated screenshots reinforce each other instead of becoming separate artifacts.</p>
      ${createLegendSvg()}
      <div class="legend-grid">
        <article><h3>Numbered markers</h3><p>Numbers in the process graphic correspond to numbered regions in the annotated screenshot and nearby callout cards.</p></article>
        <article><h3>Solid and dashed paths</h3><p>Solid lines indicate current documented flow. Dashed paths are reserved for future, fallback, or demo-boundary behavior.</p></article>
        <article><h3>Boundaries</h3><p>Lock, visibility, audit, and evidence markers show why a step changes what another role can see or do next.</p></article>
      </div>
    </section>

    ${data.modules.map((workflow) => workflowSections(workflow)).join("\n")}

    <section class="page proof">
      <p class="eyebrow">Boundary and proof</p>
      <h2>What this PDF claims and what it does not claim</h2>
      <div class="proof-grid">
        <article><h3>Grounded</h3><p>Workflow content comes from the visual-process package and its process graphic and annotated screenshot maps.</p></article>
        <article><h3>Not table-led</h3><p>Tables are not the spine of this manual. The primary pattern is process graphic, annotated UI evidence, and callout explanation.</p></article>
        <article><h3>Broad callouts</h3><p>Callouts identify UI regions rather than exact DOM hitboxes because the screenshot source package does not expose semantic coordinates.</p></article>
        <article><h3>Not PDF/UA</h3><p>The PDF is text-extractable and titled, but Chromium output is not claimed as tagged PDF/UA.</p></article>
      </div>
      <div class="research-grid">
        ${data.researchPrinciples
          .map((item) => `<article><h3>${htmlEscape(item.source)}</h3><p>${htmlEscape(item.principle)}</p></article>`)
          .join("")}
      </div>
    </section>
  </main>
</body>
</html>`;
}

function createCss() {
  return `:root {
  --navy: #10283b;
  --navy-2: #18384f;
  --ink: #1f2933;
  --muted: #667383;
  --paper: #fbf7ef;
  --paper-2: #fffdf8;
  --line: #d8cfbf;
  --gold: #b88a38;
  --gold-soft: #efe2c2;
  --warn: #7f3b36;
}

@page {
  size: A4;
  margin: 25.4mm;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 10.8pt;
  line-height: 1.42;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  max-width: 148mm;
  color: #ffffff;
  font-size: 35pt;
  line-height: 1.05;
}

h2 {
  color: var(--navy);
  font-size: 22pt;
  line-height: 1.08;
  margin-bottom: 8px;
}

h3 {
  color: var(--navy);
  font-size: 8.8pt;
  letter-spacing: 0;
  margin-bottom: 5px;
  text-transform: uppercase;
}

p,
li {
  overflow-wrap: anywhere;
}

figcaption {
  margin-top: 7px;
  color: var(--muted);
  font-size: 8.8pt;
}

.cover {
  min-height: 246mm;
  padding: 14mm 13mm 12mm;
  break-after: page;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #ffffff;
  background:
    linear-gradient(145deg, rgba(16, 40, 59, 0.99), rgba(24, 56, 79, 0.96)),
    linear-gradient(90deg, rgba(184, 138, 56, 0.2), transparent 65%);
}

.cover-kicker,
.cover-meta {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  color: #f4ead7;
  font-size: 8.8pt;
}

.cover-copy p {
  max-width: 146mm;
  color: #f4ead7;
  font-size: 13pt;
}

.cover-meta {
  justify-content: flex-start;
  flex-wrap: wrap;
}

.cover-meta span {
  border: 1px solid rgba(239, 226, 194, 0.45);
  padding: 6px 8px;
}

.page {
  min-height: 246mm;
  break-before: page;
}

.eyebrow {
  color: var(--gold);
  font-size: 8.1pt;
  font-weight: 800;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.eyebrow.light {
  color: var(--gold-soft);
}

.lead {
  max-width: 162mm;
  color: #263747;
  font-size: 12.3pt;
}

.orientation-grid,
.legend-grid,
.fact-strip,
.recovery-grid,
.proof-grid,
.research-grid {
  display: grid;
  gap: 10px;
}

.orientation-grid,
.proof-grid {
  grid-template-columns: repeat(2, 1fr);
  margin-top: 14px;
}

.legend-grid {
  grid-template-columns: repeat(3, 1fr);
  margin-top: 12px;
}

.fact-strip {
  grid-template-columns: 1.15fr 0.9fr 1.1fr;
  margin: 11px 0 14px;
}

.recovery-grid,
.research-grid {
  grid-template-columns: repeat(2, 1fr);
  margin-top: 12px;
}

article,
.source-note,
.demo-boundary {
  border: 1px solid var(--line);
  border-top: 3px solid var(--gold);
  background: var(--paper-2);
  padding: 10px 11px;
  break-inside: avoid;
}

.source-note {
  margin-top: 16px;
  background: #fff8e8;
}

.process-figure,
.screenshot-figure {
  margin: 0;
  padding: 10px;
  border: 1px solid var(--line);
  background: #fffaf1;
  break-inside: avoid;
}

.process-figure img,
.screenshot-figure img {
  display: block;
  width: 100%;
  object-fit: contain;
  border: 1px solid #cfc5b4;
  background: #ffffff;
}

.process-figure img {
  max-height: 142mm;
}

.screenshot-figure img {
  max-height: 101mm;
}

.callout-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.callout-card {
  padding: 9px;
  border-top-width: 4px;
}

.callout-card p {
  margin-bottom: 4px;
  font-size: 8.25pt;
  line-height: 1.28;
}

.callout-heading {
  display: flex;
  gap: 7px;
  align-items: center;
  margin-bottom: 6px;
}

.callout-heading span {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--gold);
  color: #ffffff;
  font-weight: 800;
}

.legend-svg {
  display: block;
  width: 100%;
  margin: 12px 0;
}

.demo-boundary {
  margin-top: 14px;
  border-top-color: var(--warn);
  background: #fff8f3;
}

ul {
  margin: 0 0 0 18px;
  padding: 0;
}
`;
}

async function renderPdf() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    headerTemplate:
      '<div style="width:100%;font-size:7px;color:#7a6f5f;padding:0 25.4mm;font-family:Inter,Arial,sans-serif;">AlphaVest WealthOS Visual Process Manual V4</div>',
    footerTemplate:
      '<div style="width:100%;font-size:7px;color:#7a6f5f;padding:0 25.4mm;font-family:Inter,Arial,sans-serif;display:flex;justify-content:space-between;"><span>Visual process manual</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    preferCSSPageSize: true,
  });
  await page.close();
  await browser.close();
}

function renderPages() {
  ensureDir(renderedDir);
  for (const oldFile of fs.readdirSync(renderedDir)) {
    if (oldFile.startsWith("alphavest-visual-process-manual-v4-page-")) {
      fs.rmSync(path.join(renderedDir, oldFile));
    }
  }
  return shell(path.join(POPPLER_BIN, "pdftoppm"), [
    "-png",
    "-r",
    "120",
    pdfPath,
    path.join(renderedDir, "alphavest-visual-process-manual-v4-page"),
  ]);
}

function createContactSheet() {
  const code = `
from pathlib import Path
from PIL import Image, ImageDraw
rendered = Path(r"""${renderedDir}""")
pages = sorted(rendered.glob("alphavest-visual-process-manual-v4-page-*.png"))
thumb_w = 170
margin = 14
cols = 5
thumbs = []
for page in pages:
    image = Image.open(page).convert("RGB")
    ratio = thumb_w / image.width
    thumb = image.resize((thumb_w, int(image.height * ratio)))
    thumbs.append((page, thumb))
thumb_h = max((thumb.height for _, thumb in thumbs), default=0)
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * margin, rows * (thumb_h + 26) + (rows + 1) * margin), "#fbf7ef")
draw = ImageDraw.Draw(sheet)
for idx, (page, thumb) in enumerate(thumbs):
    x = margin + (idx % cols) * (thumb_w + margin)
    y = margin + (idx // cols) * (thumb_h + 26 + margin)
    draw.text((x, y), f"Page {idx + 1}", fill="#10283b")
    sheet.paste(thumb, (x, y + 20))
out = Path(r"""${contactSheetPath}""")
sheet.save(out)
print({"pages": len(pages), "contact_sheet": str(out), "size": sheet.size})
`;
  return shell(PYTHON, ["-c", code]);
}

function extractPdfText() {
  const code = `
from pypdf import PdfReader
reader = PdfReader(r"""${pdfPath}""")
text = "\\n".join(page.extract_text() or "" for page in reader.pages)
checks = {
    "pages": len(reader.pages),
    "chars": len(text),
    "missing_workflows": [f"WS-{i:03d}" for i in range(1, 11) if f"WS-{i:03d}" not in text],
    "has_user_action": "User action or inspection" in text,
    "has_why_this_matters": "Why this matters" in text,
    "has_visibility": "Visibility" in text,
    "has_evidence_audit": "Evidence/audit" in text,
    "has_visual_standard": "Source Visual Implementation Standard" in text,
    "placeholder": "placeholder" in text.lower(),
}
print(checks)
`;
  return shell(PYTHON, ["-c", code]);
}

function pdfInfo() {
  return shell(path.join(POPPLER_BIN, "pdfinfo"), [pdfPath]);
}

function createQaMarkdown(data, checks) {
  const workflowRows = data.modules
    .map(
      (item) =>
        `| ${item.workflowId} | ${item.artifacts.processGraphicExists ? "yes" : "missing"} | ${
          item.artifacts.annotatedScreenshotExists ? "yes" : "missing"
        } | ${item.callouts.length} | ${item.callouts.some((callout) => /broad-region/i.test(callout.confidence || "")) ? "yes" : "no"} |`,
    )
    .join("\n");

  return `# AlphaVest Visual Process Manual PDF QA Report V4

Generated: ${data.metadata.generatedAt.slice(0, 10)}

## Inputs Used

- \`${data.sourceInputs.blueprint}\`
- \`${data.sourceInputs.annotationMap}\`
- \`${data.sourceInputs.processGraphicMap}\`
- Existing annotated screenshots and process graphics under \`docs/v3/user-manual-visual-process/\`

## Online Research Principles Applied

${data.researchPrinciples.map((item) => `- ${item.source}: ${item.principle} (${item.url})`).join("\n")}

## Visual Implementation Standard Files Used

- \`${data.metadata.visualImplementationStandard}\`
- \`${data.metadata.visualRules}\`
- \`${data.metadata.visualRubric}\`
- \`${data.metadata.visualAdapter}\`

## Outputs Produced

- HTML source: \`docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v4.html\`
- CSS source: \`docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v4.css\`
- Structured data: \`docs/v3/user-manual-pdf/source/visual-process-manual-pdf-data-v4.json\`
- Output HTML: \`output/pdf/alphavest-wealthos-visual-process-manual-v4.html\`
- Output PDF: \`output/pdf/alphavest-wealthos-visual-process-manual-v4.pdf\`
- Rendered pages: \`output/pdf/rendered/visual-process-v4/\`
- Contact sheet: \`output/pdf/rendered/visual-process-v4/alphavest-visual-process-manual-v4-contact-sheet.png\`

## Generation Command

- \`node scripts/generate-visual-process-manual-pdf-v4.mjs\`

## JSON Consistency Results

- Workflow modules: ${data.counts.workflowModules}
- Process graphics found: ${data.counts.processGraphics}
- Annotated screenshots found: ${data.counts.annotatedScreenshots}
- Callouts: ${data.counts.callouts}
- Broad-region callouts: ${data.counts.broadRegionCallouts}

| Workflow | Process graphic | Annotated screenshot | Callouts | Broad callouts |
| --- | --- | --- | ---: | --- |
${workflowRows}

## PDF Metadata

\`\`\`text
${checks.pdfInfo.stdout.trim() || checks.pdfInfo.stderr.trim()}
\`\`\`

## Text Extraction Results

\`\`\`text
${checks.text.stdout.trim() || checks.text.stderr.trim()}
\`\`\`

## Render And Contact Sheet Results

- Page render command: \`${checks.render.command}\`
- Page render status: ${checks.render.status}
- Contact sheet status: ${checks.contact.status}
- Contact sheet output:

\`\`\`text
${checks.contact.stdout.trim() || checks.contact.stderr.trim()}
\`\`\`

## Human Visual Review Rubric

| Area | Status | Note |
| --- | --- | --- |
| Product-native feel | pending visual inspection | V4 uses AlphaVest navy, ivory, gold, restrained cards, and manual-specific page composition. |
| Visual hierarchy | pending visual inspection | Workflow sections are process-first, screenshot-second, explanation-nearby. |
| Spacing and alignment | pending visual inspection | A4 25.4mm margins and internal gutters are defined in print CSS. |
| State completeness | minor issue | Workflow state and visibility are explained, but live UI states are not recaptured in this run. |
| Reference fidelity | minor issue | Existing generated process graphics and annotated screenshots are reused; broad-region callouts remain. |
| Data realism | pass | Content is sourced from the existing AlphaVest visual-process package. |
| Accessibility and semantics | minor issue | Text is extractable and image alt text exists in HTML; output is not tagged PDF/UA. |
| Final human judgment | pending visual inspection | Must be finalized after rendered PNG inspection. |

## Rejected Weak Approaches

${data.rejectedWeakApproaches.map((item) => `- ${item}.`).join("\n")}

## Known Limitations

- Callouts are broad UI regions, not DOM-inspected exact element hitboxes.
- The PDF uses existing screenshot evidence and does not recapture live UI.
- Chromium-generated PDF output is not claimed as tagged PDF/UA.
- Demo-state workflow claims remain bounded by the source package and are not production certification.

## Commands Run And Results

- \`node scripts/generate-visual-process-manual-pdf-v4.mjs\`: passed if this report exists with output artifacts.
- \`${checks.render.command}\`: status ${checks.render.status}.
- \`${checks.contact.command}\`: status ${checks.contact.status}.
- \`${checks.pdfInfo.command}\`: status ${checks.pdfInfo.status}.
- \`${checks.text.command}\`: status ${checks.text.status}.
`;
}

function updateReadme() {
  const block = `

## Visual Process V4 PDF Artifacts

- Visual process V4 PDF: \`output/pdf/alphavest-wealthos-visual-process-manual-v4.pdf\`
- Visual process V4 HTML source: \`docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v4.html\`
- Visual process V4 CSS source: \`docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v4.css\`
- Visual process V4 structured data: \`docs/v3/user-manual-pdf/source/visual-process-manual-pdf-data-v4.json\`
- Visual process V4 rendered pages: \`output/pdf/rendered/visual-process-v4/\`
- Visual process V4 contact sheet: \`output/pdf/rendered/visual-process-v4/alphavest-visual-process-manual-v4-contact-sheet.png\`
- Visual process V4 QA report: \`docs/v3/user-manual-pdf/ALPHAVEST_VISUAL_PROCESS_MANUAL_PDF_QA_REPORT_V4.md\`

The V4 manual is produced from the visual-process package. It preserves V3 outputs and adds a stricter PDF production proof path: process graphic plus annotated UI evidence, A4 margins, rendered-page QA, contact sheet, text extraction, and a Source Visual Implementation Standard review.
`;
  const current = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "# AlphaVest WealthOS User Manual PDF Package\n";
  const marker = "## Visual Process V4 PDF Artifacts";
  if (current.includes(marker)) {
    const before = current.slice(0, current.indexOf(marker)).trimEnd();
    fs.writeFileSync(readmePath, `${before}${block}\n`, "utf8");
  } else {
    fs.writeFileSync(readmePath, `${current.trimEnd()}${block}\n`, "utf8");
  }
}

async function main() {
  [pdfSourceDir, outputPdfDir, renderedDir].forEach(ensureDir);
  const data = buildData();
  writeJson(dataPath, data);
  fs.writeFileSync(cssPath, createCss(), "utf8");
  fs.writeFileSync(htmlPath, createHtml(data), "utf8");
  fs.copyFileSync(htmlPath, outputHtmlPath);

  await renderPdf();
  const render = renderPages();
  const contact = createContactSheet();
  const info = pdfInfo();
  const text = extractPdfText();
  const checks = { render, contact, pdfInfo: info, text };
  fs.writeFileSync(qaPath, createQaMarkdown(data, checks), "utf8");
  updateReadme();

  console.log(
    JSON.stringify(
      {
        data: path.relative(ROOT, dataPath),
        html: path.relative(ROOT, htmlPath),
        css: path.relative(ROOT, cssPath),
        outputHtml: path.relative(ROOT, outputHtmlPath),
        pdf: path.relative(ROOT, pdfPath),
        renderedDir: path.relative(ROOT, renderedDir),
        contactSheet: path.relative(ROOT, contactSheetPath),
        qa: path.relative(ROOT, qaPath),
        counts: data.counts,
        checks: {
          render: render.status,
          contact: contact.status,
          pdfInfo: info.status,
          text: text.status,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
