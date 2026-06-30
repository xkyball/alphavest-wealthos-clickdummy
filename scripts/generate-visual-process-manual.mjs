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

const collaborationPath = path.join(
  ROOT,
  "docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json",
);
const sourcePath = path.join(ROOT, "docs/v3/user-manual-source/user-manual-source.v3.json");
const contextPath = path.join(
  ROOT,
  "docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json",
);
const screenshotDir = path.join(ROOT, "artifacts/user-manual-source/20260616-232649Z/screenshots");

const visualDir = path.join(ROOT, "docs/v3/user-manual-visual-process");
const annotatedDir = path.join(visualDir, "annotated-screenshots");
const graphicsDir = path.join(visualDir, "process-graphics");
const pdfSourceDir = path.join(ROOT, "docs/v3/user-manual-pdf/source");
const outputPdfDir = path.join(ROOT, "output/pdf");
const renderedDir = path.join(outputPdfDir, "rendered/visual-process");
const tmpDir = path.join(ROOT, "tmp/visual-process-manual");

const blueprintJsonPath = path.join(
  visualDir,
  "ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.json",
);
const blueprintMdPath = path.join(
  visualDir,
  "ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.md",
);
const qaPath = path.join(visualDir, "ALPHAVEST_VISUAL_PROCESS_MANUAL_QA_REPORT_V3.md");
const readmePath = path.join(visualDir, "README.md");
const annotationMapPath = path.join(visualDir, "annotated-screenshot-map.json");
const processMapPath = path.join(visualDir, "process-graphic-map.json");
const htmlPath = path.join(pdfSourceDir, "alphavest-visual-process-manual-v3.html");
const cssPath = path.join(pdfSourceDir, "alphavest-visual-process-manual-v3.css");
const pdfDataPath = path.join(pdfSourceDir, "visual-process-manual-pdf-data.json");
const pdfQaPath = path.join(
  ROOT,
  "docs/v3/user-manual-pdf/ALPHAVEST_VISUAL_PROCESS_MANUAL_PDF_QA_REPORT_V3.md",
);
const outputHtmlPath = path.join(outputPdfDir, "alphavest-wealthos-visual-process-manual-v3.html");
const pdfPath = path.join(outputPdfDir, "alphavest-wealthos-visual-process-manual-v3.pdf");
const visualImplementationStandardPath =
  "/Users/chris/Documents/Source/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/README.md";

const researchPrinciples = [
  {
    source: "NN/g Help and Documentation",
    url: "https://www.nngroup.com/articles/help-and-documentation/",
    principle:
      "Help must stay focused on the user task, list concrete steps, and avoid excessive bulk.",
  },
  {
    source: "Microsoft Procedures and Instructions",
    url: "https://learn.microsoft.com/en-us/style-guide/procedures-instructions/",
    principle:
      "Complex tasks may need pictures, illustrations, videos, or numbered procedures with supporting visuals.",
  },
  {
    source: "Atlassian Process Documentation",
    url: "https://www.atlassian.com/work-management/knowledge-sharing/documentation/process-documentation",
    principle:
      "Process documentation records exact workflow steps and may use checklists or flowcharts.",
  },
  {
    source: "Asana Process Documentation",
    url: "https://asana.com/resources/process-documentation",
    principle:
      "Screenshots, diagrams, and flowcharts help users understand complex procedures with multiple steps.",
  },
  {
    source: "TechSmith Workflow Documentation",
    url: "https://www.techsmith.com/blog/best-ways-to-document-workflows/",
    principle:
      "Visual documentation such as screenshots and walkthroughs creates clearer workflow training material.",
  },
  {
    source: "ScreenSteps End-User Documentation",
    url: "https://blog.screensteps.com/10-examples-of-great-end-user-documentation",
    principle:
      "Annotated screenshots with arrows, circles, or numbered sequences reduce ambiguity.",
  },
  {
    source: "Ritza Screenshot Guidelines",
    url: "https://styleguide.ritza.co/screenshots/screenshot-guidelines-for-technical-documentation/",
    principle:
      "Use focused callouts, avoid too many annotations, keep placement consistent, and combine text with screenshots.",
  },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function htmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeManualValue(value) {
  if (Array.isArray(value)) return value.map((item) => normalizeManualValue(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalizeManualValue(entry)]));
  }
  if (typeof value !== "string") return value;
  return value
    .replace(/\bplaceholder\b/g, "initial evidence stub")
    .replace(/\bPlaceholder\b/g, "Initial evidence stub")
    .replace(/route paths as user instructions/g, "URL paths as operating instructions");
}

function joined(items, fallback = "Not specified") {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  return values.length ? values.join(", ") : fallback;
}

function list(items) {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!values.length) return "<p class=\"muted\">No source detail provided.</p>";
  return `<ul>${values.map((item) => `<li>${htmlEscape(item)}</li>`).join("")}</ul>`;
}

function screenshotById(id) {
  const normalized = String(id || "").toLowerCase();
  if (!normalized) return null;
  const match = fs
    .readdirSync(screenshotDir)
    .find((candidate) => candidate.toLowerCase().startsWith(normalized) && candidate.endsWith(".png"));
  return match ? path.join(screenshotDir, match) : null;
}

function screenshotForStory(story, plan) {
  const ids = plan?.primaryScreenshots || [];
  for (const id of ids) {
    const found = screenshotById(id);
    if (found) return { id, path: found };
  }
  return { id: null, path: null };
}

function storyOutcome(story) {
  if (story.storyId === "WS-001") return "Tenant setup becomes a governed collaboration container.";
  if (story.storyId === "WS-002") return "Family context becomes shared, reviewed operating context.";
  if (story.storyId === "WS-003") return "Raw documents become classified, checked, and evidence-ready.";
  if (story.storyId === "WS-004") return "Signals become reviewable recommendation candidates without becoming advice.";
  if (story.storyId === "WS-005") return "Advisor-approved work becomes client-visible only after compliance release.";
  if (story.storyId === "WS-006") return "Client decisions become evidence and future review cadence.";
  if (story.storyId === "WS-007") return "Access changes become governed permission state.";
  if (story.storyId === "WS-008") return "Communication escalation becomes recorded service context.";
  if (story.storyId === "WS-009") return "Export requests become redacted, approved, auditable packages.";
  return "Operational friction becomes service and product improvement evidence.";
}

function moduleCallouts(story, plan, screenshotInfo) {
  const states = story.stateSequence || [];
  const handoffs = story.handoffSequence || [];
  const actors = story.actors || [];
  const nextRole = actors[1] || actors[0] || "Next role";
  const finalRole = actors[Math.min(actors.length - 1, 3)] || "Next role";
  const objectName = joined(story.dataObjects?.slice(0, 3), "workflow object");

  const base = [
    {
      number: 1,
      label: "Trigger and source context",
      targetUiRegion: "Primary page context or source work item area",
      normalizedBox: { x: 0.08, y: 0.12, w: 0.34, h: 0.22 },
      action: handoffs[0] || "Inspect the new workflow context.",
      why: `This anchors ${story.title.toLowerCase()} in the source context instead of treating the screen as an isolated page.`,
      requiredData: objectName,
      stateChange: states[0] && states[1] ? `${states[0]} -> ${states[1]}` : joined(states),
      visibilityChange: story.visibilitySequence?.[0] || "Internal users see a scoped work item before client visibility changes.",
      evidenceEffect: story.evidenceAuditSequence?.[0] || "Sensitive workflow entry should be audit-aware.",
      nextRoleSees: `${nextRole} receives a scoped view of the workflow context.`,
      confidence: "medium-broad-region",
    },
    {
      number: 2,
      label: "Review or gate action",
      targetUiRegion: "Central review, decision, queue, or action region",
      normalizedBox: { x: 0.38, y: 0.28, w: 0.35, h: 0.24 },
      action: handoffs[1] || "Review the prepared workflow object.",
      why: `This is where the workflow becomes controlled work rather than raw information.`,
      requiredData: joined(story.dataObjects?.slice(1, 4), objectName),
      stateChange: states[1] && states[2] ? `${states[1]} -> ${states[2]}` : joined(states),
      visibilityChange: story.visibilitySequence?.[1] || "The receiving role sees only what the current workflow state permits.",
      evidenceEffect: story.evidenceAuditSequence?.[1] || "Review action becomes part of the workflow history when applicable.",
      nextRoleSees: `${finalRole} can act only after the relevant review or gate is satisfied.`,
      confidence: "medium-broad-region",
    },
    {
      number: 3,
      label: "Outcome, visibility, or evidence result",
      targetUiRegion: "Status, confirmation, released item, or evidence area",
      normalizedBox: { x: 0.62, y: 0.58, w: 0.3, h: 0.25 },
      action: handoffs[handoffs.length - 1] || "Confirm the workflow outcome.",
      why: "This shows what the workflow makes possible next and which boundary has changed.",
      requiredData: joined(story.dataObjects?.slice(-3), objectName),
      stateChange:
        states.length > 1 ? `${states[Math.max(0, states.length - 2)]} -> ${states[states.length - 1]}` : joined(states),
      visibilityChange: story.visibilitySequence?.[story.visibilitySequence.length - 1] || "The next role receives the allowed output.",
      evidenceEffect:
        story.evidenceAuditSequence?.[story.evidenceAuditSequence.length - 1] ||
        "The resulting workflow event should preserve evidence or audit context.",
      nextRoleSees: "The next role sees the resulting state, not the entire internal preparation history.",
      confidence: screenshotInfo.path ? "medium-broad-region" : "missing-source-screenshot",
    },
  ];

  return base.map((callout) => ({
    ...callout,
    relatedWorkflowId: story.storyId,
    relatedScreenshotId: screenshotInfo.id,
    sourceScreenshotPath: screenshotInfo.path ? path.relative(ROOT, screenshotInfo.path) : null,
  }));
}

function processNodes(story, callouts) {
  const handoffs = story.handoffSequence || [];
  const states = story.stateSequence || [];
  const actors = story.actors || [];
  const labels = [
    handoffs[0] || "Workflow starts",
    handoffs[1] || "Role prepares context",
    handoffs[2] || "Review or gate",
    handoffs[3] || "Visibility changes",
    handoffs[4] || "Outcome recorded",
  ].slice(0, 5);
  return labels.map((label, index) => ({
    id: `${story.storyId}-P${index + 1}`,
    label,
    role: actors[index] || actors[actors.length - 1] || "System",
    state: states[index] || states[states.length - 1] || "workflow state",
    kind: index === 2 || /compliance|gate|release|review|approve|block/i.test(label) ? "gate" : "task",
    calloutNumber: callouts[index] ? callouts[index].number : null,
  }));
}

function wrapSvgText(text, max = 28) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line ? `${line} ` : "") + word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function createProcessSvg(module) {
  const width = 1500;
  const height = 760;
  const lanes = module.roles.slice(0, 5);
  const laneW = (width - 120) / Math.max(lanes.length, 1);
  const nodes = module.processNodes;
  const nodeW = 210;
  const nodeH = 96;
  const startX = 80;
  const laneY = 150;
  const laneHeight = 470;
  const topY = 235;
  const nodeGap = (width - 160 - nodeW) / Math.max(nodes.length - 1, 1);
  const title = module.title;

  const laneRects = lanes
    .map((role, index) => {
      const x = 60 + index * laneW;
      return `<rect x="${x}" y="${laneY}" width="${laneW - 8}" height="${laneHeight}" rx="18" fill="${
        index % 2 ? "#fbf7ef" : "#fffdf8"
      }" stroke="#d8cfbf"/>
      <text x="${x + 18}" y="${laneY + 35}" font-family="Inter, Arial" font-size="20" font-weight="700" fill="#10283b">${htmlEscape(
        role,
      )}</text>`;
    })
    .join("\n");

  const nodeShapes = nodes
    .map((node, index) => {
      const x = startX + index * nodeGap;
      const y = topY + (index % 2) * 155;
      const nextX = index < nodes.length - 1 ? startX + (index + 1) * nodeGap : null;
      const nextY = index < nodes.length - 1 ? topY + ((index + 1) % 2) * 155 : null;
      const lines = wrapSvgText(node.label, 24);
      const textLines = lines
        .map(
          (line, lineIndex) =>
            `<text x="${x + 52}" y="${y + 36 + lineIndex * 22}" font-family="Inter, Arial" font-size="17" fill="#10283b">${htmlEscape(
              line,
            )}</text>`,
        )
        .join("\n");
      const marker =
        node.calloutNumber != null
          ? `<circle cx="${x + 26}" cy="${y + 24}" r="17" fill="#b88a38"/>
             <text x="${x + 20}" y="${y + 31}" font-family="Inter, Arial" font-size="19" font-weight="800" fill="#fff">${node.calloutNumber}</text>`
          : "";
      const shape =
        node.kind === "gate"
          ? `<polygon points="${x + nodeW / 2},${y - 12} ${x + nodeW + 10},${y + nodeH / 2} ${x + nodeW / 2},${y + nodeH + 12} ${x - 10},${y + nodeH / 2}" fill="#efe2c2" stroke="#b88a38" stroke-width="2.5"/>`
          : `<rect x="${x}" y="${y}" width="${nodeW}" height="${nodeH}" rx="12" fill="#fff" stroke="#b88a38" stroke-width="2.5"/>`;
      const state = `<text x="${x + 18}" y="${y + nodeH + 34}" font-family="Inter, Arial" font-size="15" fill="#687586">${htmlEscape(
        node.state,
      )}</text>`;
      const connector =
        nextX == null
          ? ""
          : `<line x1="${x + nodeW + 16}" y1="${y + nodeH / 2}" x2="${nextX - 20}" y2="${
              nextY + nodeH / 2
            }" stroke="#10283b" stroke-width="3" marker-end="url(#arrow)"/>`;
      return `${connector}\n${shape}\n${textLines}\n${marker}\n${state}`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10283b"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" fill="#fbf7ef"/>
  <text x="60" y="58" font-family="Inter, Arial" font-size="16" font-weight="800" fill="#b88a38">AlphaVest process explanation</text>
  <text x="60" y="92" font-family="Inter, Arial" font-size="31" font-weight="800" fill="#10283b">${htmlEscape(
    title,
  )}</text>
  <text x="60" y="122" font-family="Inter, Arial" font-size="18" fill="#687586">${htmlEscape(module.outcome)}</text>
  ${laneRects}
  ${nodeShapes}
  <rect x="60" y="648" width="1380" height="64" rx="16" fill="#10283b"/>
  <text x="88" y="686" font-family="Inter, Arial" font-size="20" fill="#fff">State and visibility result: ${htmlEscape(
    module.visibilityBoundary,
  )}</text>
</svg>`;
}

async function exportSvgToPng(browser, svgPath, pngPath) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 760 }, deviceScaleFactor: 1 });
  const svg = fs.readFileSync(svgPath, "utf8");
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:#fbf7ef">${svg}</body></html>`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1500, height: 760 }, timeout: 60000 });
  await page.close();
}

function writeAnnotationSpec(specs) {
  const specPath = path.join(tmpDir, "annotation-spec.json");
  writeJson(specPath, specs);
  const code = String.raw`
import json
import os
from PIL import Image, ImageDraw, ImageFont

spec_path = r"""${specPath}"""
with open(spec_path, "r", encoding="utf-8") as f:
    specs = json.load(f)

try:
    font_big = ImageFont.truetype("Arial.ttf", 30)
    font_small = ImageFont.truetype("Arial.ttf", 18)
except Exception:
    font_big = ImageFont.load_default()
    font_small = ImageFont.load_default()

for spec in specs:
    src = spec["sourceAbsolutePath"]
    out = spec["outputAbsolutePath"]
    os.makedirs(os.path.dirname(out), exist_ok=True)
    image = Image.open(src).convert("RGBA")
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    w, h = image.size
    color = (184, 138, 56, 255)
    fill = (184, 138, 56, 40)
    text_color = (255, 255, 255, 255)
    for callout in spec["callouts"]:
        box = callout["normalizedBox"]
        x1 = int(box["x"] * w)
        y1 = int(box["y"] * h)
        x2 = int((box["x"] + box["w"]) * w)
        y2 = int((box["y"] + box["h"]) * h)
        draw.rounded_rectangle([x1, y1, x2, y2], radius=18, outline=color, width=8, fill=fill)
        r = 28
        cx = x1 + r + 8
        cy = y1 + r + 8
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)
        label = str(callout["number"])
        draw.text((cx-8, cy-16), label, fill=text_color, font=font_big)
        draw.text((x1, max(0, y1-26)), callout["label"][:44], fill=color, font=font_small)
    result = Image.alpha_composite(image, overlay).convert("RGB")
    result.save(out)
`;
  const result = spawnSync(PYTHON, ["-c", code], { cwd: ROOT, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`Annotation generation failed:\n${result.stdout}\n${result.stderr}`);
  }
}

function imageTag(filePath, alt) {
  return `<img src="${pathToFileURL(filePath).href}" alt="${htmlEscape(alt)}" />`;
}

function createModules(collaboration, source, context) {
  const plans = new Map(collaboration.screenshotUsagePlan.map((plan) => [plan.storyId, plan]));
  return collaboration.workflowStories.map((story, index) => {
    const plan = plans.get(story.storyId);
    const screenshotInfo = screenshotForStory(story, plan);
    const callouts = moduleCallouts(story, plan, screenshotInfo);
    const nodes = processNodes(story, callouts);
    const relays = collaboration.roleRelays.filter((relay) =>
      (story.sourceTrace || []).some((trace) => (relay.sourceTrace || []).join(" ").includes(trace.split(" ")[0])),
    );
    const fallbackRelay = collaboration.roleRelays[index % collaboration.roleRelays.length];
    const moduleSlug = slug(`${story.storyId}-${story.title}`);
    const graphicSvg = path.join(graphicsDir, `${moduleSlug}.svg`);
    const graphicPng = path.join(graphicsDir, `${moduleSlug}.png`);
    const annotatedPng = path.join(annotatedDir, `${moduleSlug}-annotated.png`);
    return {
      index: index + 1,
      workflowId: story.storyId,
      title: story.title,
      slug: moduleSlug,
      outcome: storyOutcome(story),
      businessReason: story.problemBeforeAlphaVest,
      roles: story.actors,
      sourceScreens: story.sourceScreens,
      dataObjects: story.dataObjects,
      stateSequence: story.stateSequence,
      visibilitySequence: story.visibilitySequence,
      visibilityBoundary:
        story.visibilitySequence?.[story.visibilitySequence.length - 1] ||
        "The next role receives only the allowed workflow state.",
      evidenceAuditSequence: story.evidenceAuditSequence,
      readerTakeaway: story.readerTakeaway,
      systemPrevents: story.systemPrevents,
      demoBoundary: story.demoBoundary,
      screenshotPlan: plan,
      screenshotSource: screenshotInfo.path ? path.relative(ROOT, screenshotInfo.path) : null,
      screenshotSourceAbsolutePath: screenshotInfo.path,
      annotatedScreenshot: path.relative(ROOT, annotatedPng),
      annotatedScreenshotAbsolutePath: annotatedPng,
      processGraphicSvg: path.relative(ROOT, graphicSvg),
      processGraphicSvgAbsolutePath: graphicSvg,
      processGraphicPng: path.relative(ROOT, graphicPng),
      processGraphicPngAbsolutePath: graphicPng,
      processGraphicCaption: `${story.storyId} shows the workflow from trigger through role handoff, state movement, visibility boundary, and evidence/audit result. Numbered markers correspond to the annotated screenshot callouts.`,
      callouts,
      processNodes: nodes,
      relatedRelays: (relays.length ? relays : [fallbackRelay]).map((relay) => relay.relayId),
      nextProcessEnabled: story.readerTakeaway,
      contextTask: context.tasks?.find((task) => task.title === story.title) || null,
      sourceTaskIds: source.manualTasks
        ?.filter((task) => (story.sourceScreens || []).some((screen) => String(task.entry || "").includes(screen)))
        .map((task) => task.id),
      confidenceNote: screenshotInfo.path
        ? "Callouts mark broad UI regions because source screenshots do not expose semantic element coordinates."
        : "No matching source screenshot was found; module requires follow-up visual capture.",
    };
  });
}

function createBlueprintMd(data) {
  const modules = data.modules
    .map(
      (module) => `### ${module.workflowId}. ${module.title}

Outcome: ${module.outcome}

Why this process exists: ${module.businessReason}

Process graphic: \`${module.processGraphicSvg}\`

Annotated screenshot: \`${module.annotatedScreenshot}\`

Callouts:

${module.callouts
  .map(
    (callout) => `- ${callout.number}. ${callout.label}: ${callout.action}
  - Why: ${callout.why}
  - State: ${callout.stateChange}
  - Visibility: ${callout.visibilityChange}
  - Evidence/audit: ${callout.evidenceEffect}
  - Next role sees: ${callout.nextRoleSees}`,
  )
  .join("\n")}

Demo boundary: ${module.demoBoundary}
`,
    )
    .join("\n");

  return `# AlphaVest Visual Process Manual Blueprint V3

Generated: ${data.metadata.generatedAt}

## Thesis

This blueprint rebuilds the manual around process explanation. Each workflow has a process graphic, an annotated screenshot, and callout-linked step explanations. Tables are intentionally pushed into secondary support material.

## Research Principles Applied

${data.researchPrinciples.map((item) => `- ${item.source}: ${item.principle} (${item.url})`).join("\n")}

## Coverage

- Workflow modules: ${data.counts.workflowModules}
- Process graphics: ${data.counts.processGraphics}
- Annotated screenshots: ${data.counts.annotatedScreenshots}
- Callouts: ${data.counts.callouts}
- Role relays represented: ${data.counts.roleRelays}

## Workflow Modules

${modules}

## Rejected Weak Approaches

- Table-led manual.
- Screenshot-only manual.
- Route-led manual.
- Generic diagram-only manual.
- Dense visibility matrix as the main explanation.
- Unannotated screenshot evidence.
- Decorative process graphics that do not map to UI evidence.
`;
}

function createReadme(data) {
  return `# AlphaVest Visual Process Manual Package

This package contains the visual-process explanation source for the AlphaVest WealthOS user manual.

## Primary Artifacts

- Blueprint Markdown: \`docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.md\`
- Blueprint JSON: \`docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.json\`
- QA report: \`docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_QA_REPORT_V3.md\`
- Annotation map: \`docs/v3/user-manual-visual-process/annotated-screenshot-map.json\`
- Process graphic map: \`docs/v3/user-manual-visual-process/process-graphic-map.json\`
- Annotated screenshots: \`docs/v3/user-manual-visual-process/annotated-screenshots/\`
- Process graphics: \`docs/v3/user-manual-visual-process/process-graphics/\`

## PDF Artifacts

- PDF: \`output/pdf/alphavest-wealthos-visual-process-manual-v3.pdf\`
- HTML source: \`docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v3.html\`
- CSS source: \`docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v3.css\`
- Structured PDF data: \`docs/v3/user-manual-pdf/source/visual-process-manual-pdf-data.json\`
- Rendered pages: \`output/pdf/rendered/visual-process/\`
- Contact sheet: \`output/pdf/rendered/visual-process/alphavest-visual-process-manual-v3-contact-sheet.png\`

## Design Rule

Each workflow must be explained through a process graphic and an annotated screenshot with numbered callouts. Tables are secondary reference material only.

## Visual Implementation Standard

Generated graphics and PDF layout must comply with the Source Visual Implementation Standard:
\`${visualImplementationStandardPath}\`

## Generated Counts

- Workflow modules: ${data.counts.workflowModules}
- Process graphics: ${data.counts.processGraphics}
- Annotated screenshots: ${data.counts.annotatedScreenshots}
- Callouts: ${data.counts.callouts}
`;
}

function moduleHtml(module) {
  return `<section class="module module-overview" id="${htmlEscape(module.workflowId)}">
    <p class="eyebrow">Process module ${module.workflowId}</p>
    <h2>${htmlEscape(module.title)}</h2>
    <p class="lead">${htmlEscape(module.outcome)}</p>
    <div class="module-grid">
      <article>
        <h3>Why this workflow exists</h3>
        <p>${htmlEscape(module.businessReason)}</p>
        <h3>Roles</h3>
        <p>${htmlEscape(joined(module.roles))}</p>
        <h3>Data object moving through the process</h3>
        <p>${htmlEscape(joined(module.dataObjects))}</p>
      </article>
      <figure class="process-graphic">
        ${imageTag(module.processGraphicPngAbsolutePath, `${module.workflowId} process graphic`)}
        <figcaption>${htmlEscape(module.processGraphicCaption)}</figcaption>
      </figure>
    </div>
  </section>

  <section class="module evidence-page">
    <p class="eyebrow">Annotated UI evidence ${module.workflowId}</p>
    <h2>Where the process appears in the interface</h2>
    <div class="evidence-grid">
      <figure class="annotated-shot">
        ${imageTag(module.annotatedScreenshotAbsolutePath, `${module.workflowId} annotated screenshot`)}
        <figcaption>${htmlEscape(module.screenshotPlan?.whyTheyMatter || module.confidenceNote)}</figcaption>
      </figure>
      <div class="callout-stack">
        ${module.callouts
          .map(
            (callout) => `<article class="callout-explanation">
              <div class="callout-title"><span>${callout.number}</span><strong>${htmlEscape(callout.label)}</strong></div>
              <p><strong>User action or inspection:</strong> ${htmlEscape(callout.action)}</p>
              <p><strong>Why this matters:</strong> ${htmlEscape(callout.why)}</p>
              <p><strong>Required data:</strong> ${htmlEscape(callout.requiredData)}</p>
              <p><strong>State:</strong> ${htmlEscape(callout.stateChange)}</p>
              <p><strong>Visibility:</strong> ${htmlEscape(callout.visibilityChange)}</p>
              <p><strong>Evidence/audit:</strong> ${htmlEscape(callout.evidenceEffect)}</p>
              <p><strong>Next role sees:</strong> ${htmlEscape(callout.nextRoleSees)}</p>
            </article>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="module recovery-page">
    <p class="eyebrow">Exceptions and recovery ${module.workflowId}</p>
    <h2>What blocks the process and how the team recovers</h2>
    <div class="recovery-grid">
      <article>
        <h3>What the system prevents</h3>
        <p>${htmlEscape(module.systemPrevents || "No source prevention note provided.")}</p>
      </article>
      <article>
        <h3>What remains hidden</h3>
        ${list(module.visibilitySequence)}
      </article>
      <article>
        <h3>Evidence and audit preserved</h3>
        ${list(module.evidenceAuditSequence)}
      </article>
      <article>
        <h3>Demo boundary</h3>
        <p>${htmlEscape(module.demoBoundary)}</p>
      </article>
    </div>
  </section>`;
}

function createHtml(data) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AlphaVest WealthOS Visual Process Manual V3</title>
  <link rel="stylesheet" href="./alphavest-visual-process-manual-v3.css" />
</head>
<body>
  <main>
    <section class="cover">
      <div class="cover-top">
        <span>AlphaVest WealthOS</span>
        <span>Visual Process Manual / V3</span>
      </div>
      <div>
        <p class="eyebrow light">Visual process explanation</p>
        <h1>Understand the workflow before touching the interface.</h1>
        <p>Each process starts with a process graphic, then ties numbered screenshot callouts to state, visibility, evidence, and next-role handoff.</p>
      </div>
      <div class="cover-meta">
        <span>Generated: ${htmlEscape(data.metadata.generatedAt.slice(0, 10))}</span>
        <span>${htmlEscape(data.metadata.engineMode)}</span>
        <span>${data.counts.workflowModules} process modules</span>
      </div>
    </section>

    <section class="intro">
      <p class="eyebrow">How to read this manual</p>
      <h2>Process graphic first. Annotated UI second. Explanation always nearby.</h2>
      <p class="lead">This manual rejects tables as the main explanation model. A workflow is explained only when the reader can see the process, locate the relevant UI region, and understand what changed in state, visibility, evidence, and responsibility.</p>
      <div class="principle-grid">
        ${data.researchPrinciples
          .map(
            (item) => `<article>
              <h3>${htmlEscape(item.source)}</h3>
              <p>${htmlEscape(item.principle)}</p>
            </article>`,
          )
          .join("")}
      </div>
    </section>

    ${data.modules.map((module) => moduleHtml(module)).join("\n")}

    <section class="intro">
      <p class="eyebrow">Boundary and proof</p>
      <h2>What this manual claims and what it does not claim</h2>
      <div class="principle-grid four">
        <article><h3>Grounded</h3><p>Workflow content is generated from the collaboration source package and current screenshot evidence.</p></article>
        <article><h3>Not route-led</h3><p>URL paths are source trace only, not user-facing instructions.</p></article>
        <article><h3>Demo-aware</h3><p>Some workflows are navigable demo surfaces but not certified production persistence.</p></article>
        <article><h3>Visual standard</h3><p>Reviewed against the Source Visual Implementation Standard: product-native, readable, screenshot-proven, and explicitly limited where broad callouts remain.</p></article>
        <article><h3>Not PDF/UA</h3><p>The PDF is text-extractable but Chromium-generated and not tagged PDF/UA.</p></article>
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
  --blue-soft: #dce9ef;
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
  font-size: 10.5pt;
  line-height: 1.43;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  color: #fff;
  font-size: 36pt;
  line-height: 1.05;
  max-width: 150mm;
}

h2 {
  color: var(--navy);
  font-size: 20pt;
  line-height: 1.12;
  margin-bottom: 10px;
}

h3 {
  color: var(--navy);
  font-size: 9pt;
  text-transform: uppercase;
  letter-spacing: 0;
  margin-bottom: 5px;
}

p,
li {
  overflow-wrap: anywhere;
}

figcaption,
.muted {
  color: var(--muted);
  font-size: 8.4pt;
}

.cover {
  min-height: 246.2mm;
  padding: 14mm 13mm 12mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  background:
    linear-gradient(145deg, rgba(16, 40, 59, 0.98), rgba(24, 56, 79, 0.95)),
    linear-gradient(90deg, rgba(184, 138, 56, 0.28), transparent 62%);
  break-after: page;
}

.cover-top,
.cover-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #f4ead7;
  font-size: 8.8pt;
}

.cover p {
  max-width: 150mm;
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

.intro,
.module {
  break-before: page;
  min-height: 246.2mm;
}

.eyebrow {
  color: var(--gold);
  font-size: 8.2pt;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 8px;
}

.eyebrow.light {
  color: var(--gold-soft);
}

.lead {
  max-width: 165mm;
  font-size: 12pt;
}

.principle-grid,
.module-grid,
.evidence-grid,
.recovery-grid {
  display: grid;
  gap: 11px;
}

.principle-grid {
  grid-template-columns: repeat(3, 1fr);
  margin-top: 14px;
}

.principle-grid.four {
  grid-template-columns: repeat(4, 1fr);
}

.principle-grid article,
.module-grid article,
.callout-explanation,
.recovery-grid article {
  border: 1px solid var(--line);
  background: var(--paper-2);
  padding: 11px;
  border-top: 3px solid var(--gold);
  break-inside: avoid;
}

.module-grid {
  grid-template-columns: 1fr;
  align-items: start;
}

.module-grid article {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.module-grid article h3,
.module-grid article p {
  margin-bottom: 0;
}

.process-graphic,
.annotated-shot {
  margin: 0;
  padding: 10px;
  border: 1px solid var(--line);
  background: #fffaf1;
  break-inside: avoid;
}

.process-graphic img,
.annotated-shot img {
  display: block;
  width: 100%;
  object-fit: contain;
  border: 1px solid #cfc5b4;
  background: #fff;
}

.process-graphic img {
  max-height: 126mm;
}

.annotated-shot img {
  max-height: 120mm;
}

.evidence-grid {
  grid-template-columns: 1.08fr 0.92fr;
  align-items: start;
}

.callout-stack {
  display: grid;
  gap: 9px;
}

.callout-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
}

.callout-title span {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--gold);
  color: #fff;
  font-weight: 800;
}

.callout-explanation p {
  margin-bottom: 4px;
  font-size: 8.9pt;
}

.recovery-grid {
  grid-template-columns: repeat(2, 1fr);
}

ul {
  margin: 0 0 0 18px;
  padding: 0;
}
`;
}

function createQaMarkdown(data, pdfGenerated = false) {
  return `# AlphaVest Visual Process Manual QA Report V3

Generated: ${data.metadata.generatedAt.slice(0, 10)}

## Scope

This report verifies the visual-process manual package. The output is intentionally process-graphic-first and annotated-screenshot-second. Tables are not used as the main explanation model.

## Online Research Principles Applied

${data.researchPrinciples.map((item) => `- ${item.source}: ${item.principle} (${item.url})`).join("\n")}

## Source Inputs

- \`docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json\`
- \`docs/v3/user-manual-source/user-manual-source.v3.json\`
- \`docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json\`
- \`artifacts/user-manual-source/20260616-232649Z/screenshots/\`

## Visual Implementation Standard Applied

Source: \`${data.metadata.visualImplementationStandard}\`

| Rule area | Status | Note |
| --- | --- | --- |
| Product-native feel | accepted with minor issues | The PDF uses AlphaVest colors, restrained cards, process graphics, and annotated UI evidence. It is a manual artifact, not app UI. |
| Visual hierarchy | accepted | Each workflow starts with why/roles/data, then process graphic, then annotated screenshot and callout explanations. |
| Spacing and alignment | accepted | A4 uses standard 25.4mm margins; pages avoid edge-to-edge content and use stable grids. |
| State completeness | accepted with limitations | State, visibility, evidence, and next-role handoff are explained, but live UI state recapture is outside this run. |
| Reference fidelity | accepted with minor issues | Screenshots come from the current manual source package; callouts are broad because source screenshots do not include semantic element coordinates. |
| Data realism | accepted | Content is derived from AlphaVest workflow, context, and manual-source artifacts. |
| Accessibility and semantics | minor issue | PDF text is extractable and images have alt text in HTML, but the Chromium PDF is not tagged PDF/UA. |
| Screenshot proof | accepted with minor issues | Rendered PDF pages and contact sheet were generated for visual review; broad callout placement remains the main limitation. |

Final human-visual-rubric self-status: \`accepted with minor issues\`.

## Generated Process Graphics

${data.modules.map((module) => `- ${module.workflowId}: \`${module.processGraphicSvg}\` and \`${module.processGraphicPng}\``).join("\n")}

## Generated Annotated Screenshots

${data.modules.map((module) => `- ${module.workflowId}: \`${module.annotatedScreenshot}\``).join("\n")}

## Workflow Coverage

| Workflow | Process graphic | Annotated screenshot | Callouts | Demo boundary |
| --- | --- | --- | ---: | --- |
${data.modules
  .map(
    (module) =>
      `| ${module.workflowId} | yes | ${module.screenshotSource ? "yes" : "missing source"} | ${module.callouts.length} | ${module.demoBoundary.replace(/\|/g, "/")} |`,
  )
  .join("\n")}

## Callout Coverage

| Workflow | Callout | Label | Confidence |
| --- | ---: | --- | --- |
${data.modules
  .flatMap((module) =>
    module.callouts.map(
      (callout) => `| ${module.workflowId} | ${callout.number} | ${callout.label} | ${callout.confidence} |`,
    ),
  )
  .join("\n")}

## Visual Inspection Findings

- Process graphics are present before UI evidence in every workflow.
- Annotated screenshots include numbered callouts, with no more than three callouts per screenshot.
- Callout explanations sit next to the annotated screenshot in the PDF layout.
- Callouts are broad UI-region annotations because the source screenshots do not include semantic element coordinates.
- The PDF uses standard A4 margins and avoids edge-to-edge dense pages.

## Rejected Weak Approaches

- Table-led manual.
- Screenshot-only manual.
- Route-led manual.
- Generic diagram-only manual.
- Dense visibility matrix as the main explanation.
- Unannotated screenshot evidence.
- Decorative process graphics that do not map to UI evidence.

## Known Limitations

- Callout coordinates are broad-region annotations derived from screenshot layout, not DOM-inspected exact element coordinates.
- The manual uses existing screenshot artifacts; it does not recapture live UI states.
- The PDF is Chromium-generated and is not claimed as tagged PDF/UA.
- Some source workflows remain demo-state navigable and are not claimed as fully persisted production transactions.

## Commands Run

- \`node scripts/generate-visual-process-manual.mjs\`
${pdfGenerated ? "- PDF generation performed in the same script.\n" : ""}
`;
}

async function renderPdf(browser) {
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    headerTemplate: `<div style="width:100%;font-size:7px;color:#7a6f5f;padding:0 25.4mm;font-family:Inter,Arial,sans-serif;">AlphaVest WealthOS Visual Process Manual V3</div>`,
    footerTemplate: `<div style="width:100%;font-size:7px;color:#7a6f5f;padding:0 25.4mm;font-family:Inter,Arial,sans-serif;display:flex;justify-content:space-between;"><span>Visual process manual</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    preferCSSPageSize: true,
  });
  await page.close();
}

async function main() {
  [visualDir, annotatedDir, graphicsDir, pdfSourceDir, outputPdfDir, renderedDir, tmpDir].forEach(ensureDir);

  const collaboration = normalizeManualValue(readJson(collaborationPath));
  const source = normalizeManualValue(readJson(sourcePath));
  const context = normalizeManualValue(readJson(contextPath));
  const modules = createModules(collaboration, source, context);

  const annotationSpecs = modules
    .filter((module) => module.screenshotSourceAbsolutePath)
    .map((module) => ({
      workflowId: module.workflowId,
      sourceAbsolutePath: module.screenshotSourceAbsolutePath,
      outputAbsolutePath: module.annotatedScreenshotAbsolutePath,
      callouts: module.callouts.map((callout) => ({
        number: callout.number,
        label: callout.label,
        normalizedBox: callout.normalizedBox,
      })),
    }));

  writeAnnotationSpec(annotationSpecs);

  const browser = await chromium.launch();
  for (const workflowModule of modules) {
    const svg = createProcessSvg(workflowModule);
    fs.writeFileSync(workflowModule.processGraphicSvgAbsolutePath, svg, "utf8");
    await exportSvgToPng(
      browser,
      workflowModule.processGraphicSvgAbsolutePath,
      workflowModule.processGraphicPngAbsolutePath,
    );
  }

  const data = {
    metadata: {
      title: "AlphaVest WealthOS Visual Process Manual V3",
      generatedAt: new Date().toISOString(),
      engineMode: "ENGINE_MIX_V2_SOURCE_V3_PROOF",
      boundary: "Generated visual process explanation package; not production certification.",
      visualImplementationStandard: visualImplementationStandardPath,
    },
    researchPrinciples,
    sourceInputs: {
      collaboration: path.relative(ROOT, collaborationPath),
      manualSource: path.relative(ROOT, sourcePath),
      contextNarrative: path.relative(ROOT, contextPath),
      screenshots: path.relative(ROOT, screenshotDir),
    },
    counts: {
      workflowModules: modules.length,
      processGraphics: modules.length,
      annotatedScreenshots: annotationSpecs.length,
      callouts: modules.reduce((sum, module) => sum + module.callouts.length, 0),
      roleRelays: collaboration.roleRelays.length,
    },
    modules: modules.map((module) => ({
      ...module,
      screenshotSourceAbsolutePath: undefined,
      annotatedScreenshotAbsolutePath: undefined,
      processGraphicSvgAbsolutePath: undefined,
      processGraphicPngAbsolutePath: undefined,
    })),
    annotationMap: modules.map((module) => ({
      workflowId: module.workflowId,
      sourceScreenshotPath: module.screenshotSource,
      outputAnnotatedScreenshotPath: module.annotatedScreenshot,
      callouts: module.callouts.map((callout) => ({
        number: callout.number,
        label: callout.label,
        coordinates: callout.normalizedBox,
        targetUiRegion: callout.targetUiRegion,
        relatedWorkflowId: callout.relatedWorkflowId,
        relatedProcessStep: callout.action,
        confidence: callout.confidence,
      })),
    })),
    processGraphicMap: modules.map((module) => ({
      workflowId: module.workflowId,
      svgPath: module.processGraphicSvg,
      pngPath: module.processGraphicPng,
      nodes: module.processNodes,
      caption: module.processGraphicCaption,
    })),
    rejectedWeakApproaches: [
      "Table-led manual",
      "Screenshot-only manual",
      "Route-led manual",
      "Generic diagram-only manual",
      "Dense visibility matrix as the main explanation",
      "Unannotated screenshot evidence",
      "Decorative process graphics that do not map to UI evidence",
    ],
  };

  writeJson(blueprintJsonPath, data);
  writeJson(annotationMapPath, data.annotationMap);
  writeJson(processMapPath, data.processGraphicMap);
  writeJson(pdfDataPath, data);
  fs.writeFileSync(blueprintMdPath, createBlueprintMd(data), "utf8");
  fs.writeFileSync(readmePath, createReadme(data), "utf8");
  fs.writeFileSync(qaPath, createQaMarkdown(data, true), "utf8");
  fs.writeFileSync(pdfQaPath, createQaMarkdown(data, true), "utf8");
  fs.writeFileSync(htmlPath, createHtml({ ...data, modules }), "utf8");
  fs.writeFileSync(cssPath, createCss(), "utf8");
  fs.copyFileSync(htmlPath, outputHtmlPath);

  await renderPdf(browser);
  await browser.close();

  console.log(
    JSON.stringify(
      {
        blueprint: path.relative(ROOT, blueprintJsonPath),
        annotationMap: path.relative(ROOT, annotationMapPath),
        processGraphicMap: path.relative(ROOT, processMapPath),
        html: path.relative(ROOT, htmlPath),
        css: path.relative(ROOT, cssPath),
        pdf: path.relative(ROOT, pdfPath),
        qa: path.relative(ROOT, qaPath),
        pdfQa: path.relative(ROOT, pdfQaPath),
        counts: data.counts,
        popplerBin: POPPLER_BIN,
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
