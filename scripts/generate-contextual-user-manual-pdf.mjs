import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const contextPath = path.join(
  ROOT,
  "docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json",
);
const sourcePath = path.join(ROOT, "docs/v3/user-manual-source/user-manual-source.v3.json");
const sourceDir = path.join(ROOT, "docs/v3/user-manual-pdf/source");
const outputDir = path.join(ROOT, "output/pdf");
const htmlPath = path.join(sourceDir, "alphavest-contextual-user-manual-v3.html");
const cssPath = path.join(sourceDir, "alphavest-contextual-user-manual-v3.css");
const dataPath = path.join(sourceDir, "contextual-manual-pdf-data.json");
const outputHtmlPath = path.join(outputDir, "alphavest-wealthos-contextual-user-manual-v3.html");
const pdfPath = path.join(outputDir, "alphavest-wealthos-contextual-user-manual-v3.pdf");
const screenshotDir = path.join(ROOT, "artifacts/user-manual-source/20260616-232649Z/screenshots");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function htmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textList(items, fallback = "No source detail provided.") {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!values.length) return `<p>${htmlEscape(fallback)}</p>`;
  return `<ul>${values.map((item) => `<li>${htmlEscape(item)}</li>`).join("")}</ul>`;
}

function joinList(items, fallback = "Not specified") {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  return values.length ? values.join(", ") : fallback;
}

function slugTask(taskId) {
  return String(taskId).toLowerCase();
}

function screenshotForTask(taskId) {
  const needle = `ss-task-${slugTask(taskId)}`;
  const match = fs
    .readdirSync(screenshotDir)
    .find((fileName) => fileName.toLowerCase().startsWith(needle) && fileName.endsWith(".png"));
  if (!match) return null;
  return path.join(screenshotDir, match);
}

function taskSourceFor(source, taskId) {
  return source.manualTasks.find((task) => task.id === taskId) || {};
}

function fieldsFor(source, taskId) {
  return source.fields.filter((field) => field.manualTaskId === taskId);
}

function sourceStatusBadge(status = "") {
  const normalized = status.toLowerCase();
  if (normalized.includes("e3")) return "Navigable demo UI";
  if (normalized.includes("e2")) return "Partial interaction";
  if (normalized.includes("blocked")) return "Blocked source state";
  return "Source bounded";
}

function rolePurpose(roleName) {
  const name = roleName.toLowerCase();
  if (name.includes("platform")) return "Sets platform-wide operating rules before tenant work starts.";
  if (name.includes("compliance")) return "Controls release, visibility, policy exceptions, and evidence completeness.";
  if (name.includes("security")) return "Protects access, session, permission, and sensitive-change controls.";
  if (name.includes("client success")) return "Coordinates tenant readiness, communication, and service follow-through.";
  if (name.includes("advisor")) return "Reviews advice-like work before it can move toward release.";
  if (name.includes("analyst")) return "Prepares entity, document, signal, and decision inputs for review.";
  if (name.includes("principal")) return "Represents client-side review, consent, and visible decision context.";
  if (name.includes("product")) return "Monitors operational quality, queues, and reference-data health.";
  if (name.includes("qa")) return "Uses the manual to verify flow coverage, blocked states, and source evidence.";
  if (name.includes("external advisor")) return "Supplies external review input inside controlled tenant context.";
  if (name.includes("trustee")) return "Participates in client-side decision review and accountability.";
  if (name.includes("ops")) return "Maintains operational cadence, service-level follow-up, and unresolved work queues.";
  if (name.includes("admin")) return "Prepares tenant setup, users, policies, and activation readiness.";
  return "Uses the UI within role, tenant, evidence, and release boundaries.";
}

function roleControlIdea(roleName) {
  const name = roleName.toLowerCase();
  if (name.includes("compliance")) return "Client visibility must wait for compliance release.";
  if (name.includes("advisor")) return "Advisor review helps, but does not replace compliance release.";
  if (name.includes("principal") || name.includes("client")) return "Client views expose only released or permitted material.";
  if (name.includes("security") || name.includes("platform")) return "Sensitive configuration changes require visible controls and audit.";
  if (name.includes("analyst")) return "Prepared inputs stay reviewable before becoming client-facing.";
  return "Important actions remain role-scoped, evidence-backed, and audit-aware.";
}

function roleRows(source) {
  return source.roles
    .map((role) => {
      const tasks = source.manualTasks
        .filter((task) => String(task.role || "").toLowerCase().includes(String(role).toLowerCase()))
        .map((task) => task.id)
        .slice(0, 4);
      return `<tr>
        <td>${htmlEscape(role)}</td>
        <td>${htmlEscape(rolePurpose(role))}<br><span>Related tasks: ${htmlEscape(tasks.length ? tasks.join(", ") : "Cross-cutting")}</span></td>
        <td>${htmlEscape(roleControlIdea(role))}</td>
      </tr>`;
    })
    .join("");
}

function fieldRows(fields, compact = false) {
  if (!fields.length) {
    return `<p class="muted">No task-specific field contract is listed in the source package.</p>`;
  }
  return `
    <table class="${compact ? "compact" : ""}">
      <thead>
        <tr>
          <th>Field</th>
          <th>Required input</th>
          <th>Allowed or example value</th>
          <th>Why it matters</th>
          <th>Blocked state</th>
        </tr>
      </thead>
      <tbody>
        ${fields
          .map(
            (field) => `<tr>
              <td><strong>${htmlEscape(field.fieldLabel)}</strong><br><span>${htmlEscape(field.screen)}</span></td>
              <td>${htmlEscape(field.required)} / ${htmlEscape(field.type)}</td>
              <td>${htmlEscape(field.allowedValues)}<br><span>Demo: ${htmlEscape(field.exampleDemoValue)}</span></td>
              <td>${htmlEscape(field.userMeaning)}<br><span>${htmlEscape(field.dataModelMapping)}</span></td>
              <td>${htmlEscape(field.errorBlockedState)}<br><span>${htmlEscape(field.sensitivity)}</span></td>
            </tr>`,
          )
          .join("")}
      </tbody>
    </table>`;
}

function buildTaskChapter(task, sourceTask, sourceFields, index) {
  const screenshot = screenshotForTask(task.taskId);
  const screenshotUri = screenshot ? pathToFileURL(screenshot).href : "";
  const figureId = `FIG-${String(index + 1).padStart(2, "0")}`;
  const visibleSteps = Array.isArray(task.stepContext) ? task.stepContext : [];
  const blockedStates = Array.isArray(task.blockedStateContext) ? task.blockedStateContext : [];
  const gates = Array.isArray(task.gateContext) ? task.gateContext : [];
  return `
  <section class="task-chapter" id="${htmlEscape(task.taskId)}">
    <div class="chapter-kicker">${htmlEscape(task.section)} / ${htmlEscape(task.workflowId)} / ${htmlEscape(task.pageflowId)}</div>
    <div class="chapter-title-row">
      <div>
        <h2>${htmlEscape(task.taskId)}. ${htmlEscape(task.title)}</h2>
        <p class="role-line">${htmlEscape(sourceTask.role || task.roleContext)}</p>
      </div>
      <span class="status-pill">${htmlEscape(sourceStatusBadge(sourceTask.status))}</span>
    </div>

    <div class="context-grid">
      <article class="context-callout context-why">
        <h3>Why this is here</h3>
        <p>${htmlEscape(task.whyThisTaskExists)}</p>
      </article>
      <article class="context-callout context-goal">
        <h3>What the user is trying to achieve</h3>
        <p>${htmlEscape(task.whatTheUserIsTryingToAchieve)}</p>
      </article>
      <article class="context-callout context-next">
        <h3>What this enables next</h3>
        ${textList(task.whatThisEnablesNext)}
      </article>
    </div>

    <figure class="screen-figure">
      ${screenshotUri ? `<img src="${screenshotUri}" alt="${htmlEscape(task.title)} screen capture" />` : `<div class="missing-shot">Screenshot not found for ${htmlEscape(task.taskId)}</div>`}
      <figcaption>${figureId}. ${htmlEscape(sourceTask.entry || task.title)}. The screenshot is referenced as UI evidence for the task context, not as a route instruction.</figcaption>
    </figure>

    <div class="flow-grid">
      <article>
        <h3>Procedure with rationale</h3>
        <ol class="steps">
          ${visibleSteps
            .map(
              (step) => `<li>
                <strong>${htmlEscape(step.userAction)}</strong>
                <span>${htmlEscape(step.whyItMatters)}</span>
                <small>Affected state: ${htmlEscape(joinList(step.affectedState))}</small>
              </li>`,
            )
            .join("")}
        </ol>
      </article>
      <article>
        <h3>Controls and gates</h3>
        ${gates.length ? `<ul class="gate-list">${gates.map((gate) => `<li><strong>${htmlEscape(gate.gateId)}</strong> ${htmlEscape(gate.rationale)}</li>`).join("")}</ul>` : `<p class="muted">No explicit gate rationale is listed for this task.</p>`}
        <h3>Data used in this flow</h3>
        <p>${htmlEscape(joinList(sourceTask.data, "No source data listed."))}</p>
      </article>
    </div>

    <div class="field-block">
      <h3>Input and data contract</h3>
      ${fieldRows(sourceFields, true)}
    </div>

    <div class="branch-grid">
      ${blockedStates
        .map(
          (state) => `<article class="branch-card">
            <h3>${htmlEscape(state.condition)}</h3>
            <p>${htmlEscape(state.controlRationale)}</p>
            <dl>
              <dt>User can do</dt><dd>${htmlEscape(state.userCanDo)}</dd>
              <dt>User cannot do</dt><dd>${htmlEscape(state.userCannotDo)}</dd>
              <dt>Next legitimate action</dt><dd>${htmlEscape(state.nextLegitimateAction)}</dd>
            </dl>
          </article>`,
        )
        .join("")}
    </div>

    <div class="takeaway-row">
      <article>
        <h3>Reader takeaway</h3>
        <p>${htmlEscape(task.readerTakeaway)}</p>
      </article>
      <article>
        <h3>Future readiness</h3>
        <p>${htmlEscape(task.futureReadinessNote)}</p>
      </article>
      <article>
        <h3>Demo boundary</h3>
        <p>${htmlEscape(task.demoBoundaryNote)}</p>
      </article>
    </div>
  </section>`;
}

function buildHtml(context, source, data) {
  const taskChapters = context.tasks
    .map((task, index) => buildTaskChapter(task, taskSourceFor(source, task.taskId), fieldsFor(source, task.taskId), index))
    .join("\n");

  const tocRows = context.tasks
    .map((task, index) => {
      const sourceTask = taskSourceFor(source, task.taskId);
      return `<tr>
        <td>${index + 1}</td>
        <td>${htmlEscape(task.taskId)}</td>
        <td>${htmlEscape(task.title)}</td>
        <td>${htmlEscape(sourceTask.role || "")}</td>
        <td>${htmlEscape(task.workflowId)} / ${htmlEscape(task.pageflowId)}</td>
      </tr>`;
    })
    .join("");

  const fieldAppendixRows = source.fields
    .map(
      (field) => `<tr>
        <td>${htmlEscape(field.fieldReferenceId)}</td>
        <td>${htmlEscape(field.manualTaskId)}</td>
        <td><strong>${htmlEscape(field.fieldLabel)}</strong><br><span>${htmlEscape(field.screen)}</span></td>
        <td>${htmlEscape(field.required)} / ${htmlEscape(field.type)}</td>
        <td>${htmlEscape(field.allowedValues)}<br><span>Example: ${htmlEscape(field.exampleDemoValue)}</span></td>
        <td>${htmlEscape(field.validation)}<br><span>${htmlEscape(field.errorBlockedState)}</span></td>
      </tr>`,
    )
    .join("");

  const globalPurpose = textList(context.globalContext.productPurpose);
  const safety = textList(context.globalContext.safetyPrinciples);
  const boundaries = textList(context.globalContext.demoBoundaries);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AlphaVest WealthOS Contextual User Manual V3</title>
  <link rel="stylesheet" href="./alphavest-contextual-user-manual-v3.css" />
</head>
<body>
  <main>
    <section class="cover">
      <div class="brand-mark">AlphaVest WealthOS</div>
      <div class="cover-main">
        <p class="eyebrow">Contextual User Manual / V3</p>
        <h1>Operating the demo-data-first wealth workflow with purpose, evidence, and release control.</h1>
        <p class="cover-copy">This manual explains what users do, why each action exists, which data is required, what the application protects, and what later workflows become possible.</p>
      </div>
      <div class="cover-meta">
        <span>English source manual</span>
        <span>Generated: ${htmlEscape(context.metadata.generatedAt)}</span>
        <span>${htmlEscape(context.metadata.engineMode)}</span>
      </div>
    </section>

    <section class="section-page">
      <p class="eyebrow">Manual frame</p>
      <h2>How to read this manual</h2>
      <div class="intro-grid">
        <article>
          <h3>Task-led, not path-led</h3>
          <p>The manual follows visible UI tasks and user outcomes. Route paths remain source trace material, not operating instructions.</p>
        </article>
        <article>
          <h3>Context beside action</h3>
          <p>Each flow explains the reason for the action, the data it depends on, the controls it activates, and the downstream workflow it prepares.</p>
        </article>
        <article>
          <h3>Evidence boundary</h3>
          <p>Where a feature is navigable but not fully production-persistent, the manual says so. Demo behavior is never inflated into a production claim.</p>
        </article>
      </div>
      <h3>Product purpose</h3>
      ${globalPurpose}
      <h3>Safety principles</h3>
      ${safety}
      <h3>Demo boundaries</h3>
      ${boundaries}
    </section>

    <section class="section-page">
      <p class="eyebrow">Operating model</p>
      <h2>From intake to controlled visibility</h2>
      <div class="operating-strip">
        <span>Policy baseline</span>
        <span>Tenant readiness</span>
        <span>Client intake</span>
        <span>Entity and document work</span>
        <span>Signals and advice review</span>
        <span>Compliance release</span>
        <span>Evidence and audit</span>
      </div>
      <p>The application is designed around a simple rule: important client-facing outcomes must pass through human review, evidence creation, and compliance-controlled release. The manual therefore explains controls as part of normal work, not as separate compliance decoration.</p>
      <table class="role-table">
        <thead>
          <tr><th>Role family</th><th>Primary purpose in the manual</th><th>Control idea</th></tr>
        </thead>
        <tbody>
          ${roleRows(source)}
        </tbody>
      </table>
    </section>

    <section class="section-page">
      <p class="eyebrow">Coverage</p>
      <h2>Task and flow index</h2>
      <table class="toc-table">
        <thead>
          <tr><th>#</th><th>ID</th><th>Task</th><th>Primary roles</th><th>Workflow / pageflow</th></tr>
        </thead>
        <tbody>${tocRows}</tbody>
      </table>
      <div class="summary-grid">
        <article><strong>${data.counts.tasks}</strong><span>documented task flows</span></article>
        <article><strong>${data.counts.fields}</strong><span>field contracts</span></article>
        <article><strong>${data.counts.taskScreenshots}</strong><span>task screenshots embedded</span></article>
        <article><strong>${data.counts.steps}</strong><span>contextualized step notes</span></article>
      </div>
    </section>

    ${taskChapters}

    <section class="section-page appendix">
      <p class="eyebrow">Reference appendix</p>
      <h2>Field and data rationale</h2>
      <p>These fields are the manual-facing contract for what a user must provide, may select, or must resolve before the workflow can move forward legitimately.</p>
      <table class="compact appendix-table">
        <thead>
          <tr><th>ID</th><th>Task</th><th>Field</th><th>Required/type</th><th>Allowed or example</th><th>Validation and blocked state</th></tr>
        </thead>
        <tbody>${fieldAppendixRows}</tbody>
      </table>
    </section>

    <section class="section-page appendix">
      <p class="eyebrow">Evidence model</p>
      <h2>Why blocked states and release gates are part of the workflow</h2>
      <div class="intro-grid">
        <article>
          <h3>Evidence by default</h3>
          <p>Important actions should leave an evidence trail so future reviewers can understand what changed, who approved it, and why the system allowed it.</p>
        </article>
        <article>
          <h3>Compliance release</h3>
          <p>Client visibility is controlled by compliance release, especially when content may influence financial, legal, or tax decisions.</p>
        </article>
        <article>
          <h3>Blocked states</h3>
          <p>A blocked state is a protective control. It tells the user what condition is missing instead of allowing an unsafe completion claim.</p>
        </article>
      </div>
      <h3>Manual QA boundary</h3>
      <ul>
        <li>The PDF is generated from demo-data-first sources and contextual narrative files.</li>
        <li>It is text-extractable and screenshot-backed, but it is not claimed as PDF/UA conformant.</li>
        <li>It documents current source evidence and known boundaries; it does not certify production persistence.</li>
      </ul>
    </section>
  </main>
</body>
</html>`;
}

function buildCss() {
  return `:root {
  --navy: #0f2435;
  --navy-2: #17354c;
  --ink: #1f2933;
  --muted: #657181;
  --paper: #fbf7ef;
  --paper-2: #fffdf8;
  --line: #d8cfbf;
  --gold: #b68a39;
  --gold-soft: #efe2c2;
  --sage: #d9e4dc;
  --blue-soft: #dbe7ee;
  --rose-soft: #f1dfd8;
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
  font-size: 10.2pt;
  line-height: 1.43;
}

main {
  width: 100%;
}

body {
  counter-reset: figures;
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
  line-height: 1.03;
  font-weight: 650;
  max-width: 670px;
}

h2 {
  color: var(--navy);
  font-size: 20pt;
  line-height: 1.08;
  margin-bottom: 12px;
  font-weight: 650;
}

h3 {
  color: var(--navy);
  font-size: 9.8pt;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0;
}

p,
li,
dd,
td,
th {
  overflow-wrap: anywhere;
}

ul,
ol {
  margin: 0 0 10px 18px;
  padding: 0;
}

li {
  margin-bottom: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0 16px;
  break-inside: avoid;
}

.role-table,
.role-table tr {
  break-inside: auto;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 7px 8px;
  text-align: left;
  vertical-align: top;
}

th {
  background: #efe8d8;
  color: var(--navy);
  font-size: 8.4pt;
  text-transform: uppercase;
  letter-spacing: 0;
}

td span,
.muted,
small {
  color: var(--muted);
}

.cover {
  min-height: 246.2mm;
  padding: 14mm 12mm 12mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    linear-gradient(145deg, rgba(15, 36, 53, 0.97), rgba(23, 53, 76, 0.94)),
    linear-gradient(90deg, rgba(182, 138, 57, 0.24), transparent 58%);
  color: #fff;
  break-after: page;
}

.brand-mark {
  font-size: 18pt;
  font-weight: 700;
}

.cover-copy {
  max-width: 610px;
  color: #efe5d1;
  font-size: 14pt;
}

.cover-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  color: #f4ead7;
  font-size: 8.6pt;
}

.cover-meta span {
  border: 1px solid rgba(239, 226, 194, 0.4);
  padding: 6px 8px;
}

.eyebrow,
.chapter-kicker {
  color: var(--gold);
  font-size: 8.4pt;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 8px;
}

.section-page,
.task-chapter {
  break-before: page;
  padding: 0;
}

.section-page {
  min-height: 246.2mm;
}

.intro-grid,
.context-grid,
.flow-grid,
.branch-grid,
.takeaway-row,
.summary-grid {
  display: grid;
  gap: 10px;
}

.intro-grid {
  grid-template-columns: repeat(3, 1fr);
  margin: 12px 0 16px;
}

.context-grid,
.takeaway-row {
  grid-template-columns: repeat(3, 1fr);
  margin: 10px 0 12px;
}

.flow-grid,
.branch-grid {
  grid-template-columns: 1.12fr 0.88fr;
  align-items: start;
}

.intro-grid article,
.context-callout,
.branch-card,
.takeaway-row article,
.field-block {
  border: 1px solid var(--line);
  background: var(--paper-2);
  padding: 12px;
  break-inside: avoid;
}

.context-why {
  border-top: 3px solid var(--gold);
}

.context-goal {
  border-top: 3px solid #4f7f95;
}

.context-next {
  border-top: 3px solid #82936d;
}

.chapter-title-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.role-line {
  color: var(--muted);
  margin-bottom: 8px;
  font-size: 9.2pt;
}

.status-pill {
  flex: 0 0 auto;
  border: 1px solid var(--gold);
  color: var(--navy);
  background: var(--gold-soft);
  padding: 5px 7px;
  font-size: 8.1pt;
  font-weight: 700;
}

.screen-figure {
  margin: 12px 0 14px;
  border: 1px solid var(--line);
  background: #f7f1e5;
  padding: 10px;
  break-inside: avoid;
}

.screen-figure img {
  display: block;
  width: 100%;
  max-height: 92mm;
  object-fit: contain;
  background: #fff;
  border: 1px solid #cfc5b4;
}

figcaption {
  color: var(--muted);
  font-size: 8.2pt;
  margin-top: 6px;
}

.steps {
  margin-left: 0;
  list-style: none;
  counter-reset: step;
}

.steps li {
  counter-increment: step;
  position: relative;
  padding: 8px 8px 8px 32px;
  border-bottom: 1px solid var(--line);
}

.steps li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 8px;
  width: 20px;
  height: 20px;
  background: var(--navy);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 8pt;
  font-weight: 700;
}

.steps span,
.steps small {
  display: block;
  margin-top: 3px;
}

.gate-list {
  margin-left: 0;
  list-style: none;
}

.gate-list li {
  border-left: 3px solid var(--gold);
  padding: 3px 0 5px 8px;
}

.field-block {
  margin: 12px 0;
}

.compact th,
.compact td {
  padding: 5px 6px;
  font-size: 7.9pt;
}

.branch-card dl {
  display: grid;
  grid-template-columns: 32mm 1fr;
  gap: 3px 7px;
  margin: 0;
}

.branch-card dt {
  color: var(--navy);
  font-weight: 700;
}

.branch-card dd {
  margin: 0;
}

.takeaway-row article {
  background: #f9f3e8;
}

.operating-strip {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin: 14px 0;
}

.operating-strip span {
  background: var(--navy);
  color: #fff;
  padding: 8px 6px;
  text-align: center;
  font-size: 7.8pt;
  font-weight: 700;
}

.summary-grid {
  grid-template-columns: repeat(4, 1fr);
  margin-top: 16px;
}

.summary-grid article {
  background: var(--navy);
  color: #fff;
  padding: 14px;
}

.summary-grid strong {
  display: block;
  color: var(--gold-soft);
  font-size: 19pt;
  line-height: 1;
}

.summary-grid span {
  display: block;
  margin-top: 5px;
  font-size: 8.4pt;
}

.appendix-table {
  break-inside: auto;
}

.appendix-table tr {
  break-inside: avoid;
}

.missing-shot {
  min-height: 60mm;
  display: grid;
  place-items: center;
  border: 1px dashed var(--line);
  color: var(--muted);
}
`;
}

function buildData(context, source) {
  const tasks = context.tasks.map((task, index) => {
    const sourceTask = taskSourceFor(source, task.taskId);
    const sourceFields = fieldsFor(source, task.taskId);
    const screenshot = screenshotForTask(task.taskId);
    return {
      index: index + 1,
      taskId: task.taskId,
      title: task.title,
      workflowId: task.workflowId,
      pageflowId: task.pageflowId,
      section: task.section,
      role: sourceTask.role || task.roleContext,
      entry: sourceTask.entry,
      outcome: sourceTask.outcome,
      result: sourceTask.result,
      sourceStatus: sourceTask.status,
      whyThisTaskExists: task.whyThisTaskExists,
      whatTheUserIsTryingToAchieve: task.whatTheUserIsTryingToAchieve,
      whatThisEnablesNext: task.whatThisEnablesNext,
      steps: task.stepContext,
      gates: task.gateContext,
      blockedStates: task.blockedStateContext,
      fieldReferences: sourceFields.map((field) => field.fieldReferenceId),
      screenshot: screenshot ? path.relative(ROOT, screenshot) : null,
      demoBoundaryNote: task.demoBoundaryNote,
      futureReadinessNote: task.futureReadinessNote,
    };
  });
  return {
    metadata: {
      title: "AlphaVest WealthOS Contextual User Manual V3",
      language: "en",
      generatedAt: new Date().toISOString(),
      engineMode: "ENGINE_MIX_V2_CODEX_V3_PROOF",
      boundary: "Generated manual production artifact, not a production certification.",
    },
    sourceInputs: {
      contextNarrative: path.relative(ROOT, contextPath),
      manualSource: path.relative(ROOT, sourcePath),
      screenshots: path.relative(ROOT, screenshotDir),
    },
    counts: {
      tasks: tasks.length,
      fields: source.fields.length,
      taskScreenshots: tasks.filter((task) => task.screenshot).length,
      steps: tasks.reduce((sum, task) => sum + (task.steps?.length || 0), 0),
      gates: tasks.reduce((sum, task) => sum + (task.gates?.length || 0), 0),
      blockedStates: tasks.reduce((sum, task) => sum + (task.blockedStates?.length || 0), 0),
    },
    tasks,
    fields: source.fields,
    qaExpectations: [
      "The manual is UI-task-led rather than route-path-led.",
      "Every task chapter includes why, goal, next-use, screenshot, procedure, fields, gates, blocked states, future readiness, and demo boundary.",
      "The PDF is text-extractable and visually rendered to PNG for inspection.",
    ],
  };
}

async function main() {
  ensureDir(sourceDir);
  ensureDir(outputDir);

  const context = readJson(contextPath);
  const source = readJson(sourcePath);
  const data = buildData(context, source);
  const html = buildHtml(context, source, data);
  const css = buildCss();

  fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  fs.writeFileSync(cssPath, css, "utf8");
  fs.writeFileSync(htmlPath, html, "utf8");
  fs.copyFileSync(htmlPath, outputHtmlPath);

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
    headerTemplate: `<div style="width:100%;font-size:7px;color:#7a6f5f;padding:0 25.4mm;font-family:Inter,Arial,sans-serif;">AlphaVest WealthOS Contextual User Manual V3</div>`,
    footerTemplate: `<div style="width:100%;font-size:7px;color:#7a6f5f;padding:0 25.4mm;font-family:Inter,Arial,sans-serif;display:flex;justify-content:space-between;"><span>Demo-data-first manual</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    preferCSSPageSize: true,
  });
  await browser.close();

  console.log(JSON.stringify({
    html: path.relative(ROOT, htmlPath),
    css: path.relative(ROOT, cssPath),
    data: path.relative(ROOT, dataPath),
    outputHtml: path.relative(ROOT, outputHtmlPath),
    pdf: path.relative(ROOT, pdfPath),
    counts: data.counts,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
