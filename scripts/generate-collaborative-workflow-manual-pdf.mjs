import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const collaborationPath = path.join(
  ROOT,
  "docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json",
);
const collaborationReportPath = path.join(
  ROOT,
  "docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_QA_REPORT_V3.md",
);
const sourceDir = path.join(ROOT, "docs/v3/user-manual-pdf/source");
const outputDir = path.join(ROOT, "output/pdf");
const htmlPath = path.join(sourceDir, "alphavest-collaborative-workflow-manual-v3.html");
const cssPath = path.join(sourceDir, "alphavest-collaborative-workflow-manual-v3.css");
const dataPath = path.join(sourceDir, "collaborative-workflow-manual-pdf-data.json");
const outputHtmlPath = path.join(outputDir, "alphavest-wealthos-collaborative-workflow-manual-v3.html");
const pdfPath = path.join(outputDir, "alphavest-wealthos-collaborative-workflow-manual-v3.pdf");
const screenshotDir = path.join(ROOT, "artifacts/user-manual-source/20260616-232649Z/screenshots");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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

function htmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function list(items, className = "") {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!values.length) return `<p class="muted">No source detail provided.</p>`;
  return `<ul class="${className}">${values.map((item) => `<li>${htmlEscape(item)}</li>`).join("")}</ul>`;
}

function joined(items, fallback = "Not specified") {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  return values.length ? values.join(", ") : fallback;
}

function sentence(value, fallback = "No source detail provided.") {
  return htmlEscape(value || fallback);
}

function screenshotById(id) {
  const normalized = String(id || "").toLowerCase();
  if (!normalized) return null;
  const fileName = fs
    .readdirSync(screenshotDir)
    .find((candidate) => candidate.toLowerCase().startsWith(normalized) && candidate.endsWith(".png"));
  return fileName ? path.join(screenshotDir, fileName) : null;
}

function screenshotForStory(story, plan) {
  const candidates = plan?.primaryScreenshots || [];
  for (const candidate of candidates) {
    const match = screenshotById(candidate);
    if (match) return match;
  }
  return null;
}

function stageCards(stages) {
  return stages
    .map(
      (stage, index) => `<article class="stage-card">
        <span class="stage-index">${String(index + 1).padStart(2, "0")}</span>
        <h3>${htmlEscape(stage.stage)}</h3>
        <p>${htmlEscape(stage.incomingObject)}</p>
        <dl>
          <dt>Roles</dt><dd>${htmlEscape(joined(stage.responsibleRoles))}</dd>
          <dt>State movement</dt><dd>${htmlEscape(stage.stateTransition)}</dd>
          <dt>Other roles see</dt><dd>${htmlEscape(stage.whatOtherRolesSeeNext)}</dd>
          <dt>Protected from view</dt><dd>${htmlEscape(stage.notVisibleYet)}</dd>
        </dl>
      </article>`,
    )
    .join("");
}

function lifecycleDiagram(stages) {
  return `<figure class="diagram diagram-lifecycle" data-diagram-id="D-001">
    <div class="diagram-title">D-001. Global workflow lifecycle</div>
    <div class="lifecycle-track">
      ${stages
        .map(
          (stage, index) => `<div class="life-step">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${htmlEscape(stage.stage)}</strong>
          </div>`,
        )
        .join("")}
    </div>
    <figcaption>The lifecycle shows how raw material becomes reviewed, gated, visible, decided, evidenced, audited, and monitored. It matters because a user action in AlphaVest often prepares the next role rather than finishing the entire workflow.</figcaption>
  </figure>`;
}

function swimlaneDiagram(id, title, lanes, caption) {
  return `<figure class="diagram swimlane" data-diagram-id="${htmlEscape(id)}">
    <div class="diagram-title">${htmlEscape(id)}. ${htmlEscape(title)}</div>
    <div class="swimlane-grid" style="--lane-count:${lanes.length}">
      ${lanes
        .map(
          (lane) => `<div class="lane">
            <h4>${htmlEscape(lane.role)}</h4>
            ${lane.steps.map((step) => `<span>${htmlEscape(step)}</span>`).join("")}
          </div>`,
        )
        .join("")}
    </div>
    <figcaption>${htmlEscape(caption)}</figcaption>
  </figure>`;
}

function visibilityGateDiagram() {
  return `<figure class="diagram gate-diagram" data-diagram-id="D-006">
    <div class="diagram-title">D-006. Visibility and release gate model</div>
    <div class="gate-chain">
      <div>Advisor approval</div>
      <div>Compliance review</div>
      <div>Evidence complete</div>
      <div>Permission check</div>
      <div class="gate-result">Client visible</div>
    </div>
    <p class="diagram-note">The chain is conjunctive: client visibility is allowed only when review, release, evidence, and permission conditions align.</p>
    <figcaption>This diagram turns the no-unapproved-advice rule into a business-readable control model. Advisor approval alone is useful internal review, but it is not the client release event.</figcaption>
  </figure>`;
}

function evidenceLineageDiagram() {
  return `<figure class="diagram lineage-diagram" data-diagram-id="D-005">
    <div class="diagram-title">D-005. Evidence and audit lineage</div>
    <div class="lineage-row">
      <div>Action</div>
      <div>Document</div>
      <div>Approval</div>
      <div>Release</div>
      <div>Decision</div>
      <div>Export</div>
    </div>
    <div class="lineage-spine">Evidence item -> Evidence record -> Audit event lineage</div>
    <figcaption>Evidence is assembled from workflow events, so a later reviewer can understand what happened before they entered the flow.</figcaption>
  </figure>`;
}

function relayCards(relays) {
  return relays
    .map(
      (relay) => `<article class="relay-card">
        <div class="relay-id">${htmlEscape(relay.relayId)}</div>
        <h3>${htmlEscape(relay.fromRole)} -> ${htmlEscape(relay.toRole)}</h3>
        <p class="relay-object">${htmlEscape(relay.objectOrState)}</p>
        <dl>
          <dt>Why first role acts</dt><dd>${htmlEscape(relay.whyFirstRoleActs)}</dd>
          <dt>What changes</dt><dd>${htmlEscape(relay.stateChange)}</dd>
          <dt>Next role sees</dt><dd>${htmlEscape(relay.whatNextRoleSees)}</dd>
          <dt>Client visibility impact</dt><dd>${htmlEscape(relay.clientVisibilityImpact)}</dd>
        </dl>
      </article>`,
    )
    .join("");
}

function storyCard(story, index, plan) {
  const screenshot = screenshotForStory(story, plan);
  const screenshotUri = screenshot ? pathToFileURL(screenshot).href : "";
  return `<section class="story-chapter" id="${htmlEscape(story.storyId)}">
    <div class="chapter-kicker">Workflow story ${htmlEscape(story.storyId)}</div>
    <h2>${htmlEscape(story.title)}</h2>
    <div class="story-hero">
      <article>
        <h3>Workflow purpose</h3>
        <p>${htmlEscape(story.problemBeforeAlphaVest)}</p>
      </article>
      <article>
        <h3>Roles involved</h3>
        <p>${htmlEscape(joined(story.actors))}</p>
      </article>
      <article>
        <h3>Reader takeaway</h3>
        <p>${htmlEscape(story.readerTakeaway)}</p>
      </article>
    </div>
    <div class="story-flow">
      <article>
        <h3>Handoff sequence</h3>
        ${list(story.handoffSequence, "numbered-flow")}
      </article>
      <article>
        <h3>State changes</h3>
        ${list(story.stateSequence, "state-list")}
      </article>
      <article>
        <h3>Visibility changes</h3>
        ${list(story.visibilitySequence)}
      </article>
      <article>
        <h3>Evidence and audit</h3>
        ${list(story.evidenceAuditSequence)}
      </article>
    </div>
    <div class="story-detail">
      <article>
        <h3>Required inputs and objects</h3>
        <p>${htmlEscape(joined(story.dataObjects))}</p>
        <h3>What the system prevents</h3>
        <p>${sentence(story.systemPrevents)}</p>
      </article>
      <figure class="evidence-panel">
        ${
          screenshotUri
            ? `<img src="${screenshotUri}" alt="${htmlEscape(story.storyId)} supporting interface evidence" />`
            : `<div class="missing-shot">No screenshot evidence found for ${htmlEscape(story.storyId)}</div>`
        }
        <figcaption>Evidence panel ${index + 1}: ${htmlEscape(plan?.whyTheyMatter || "Representative workflow evidence.")} Role viewpoint: ${htmlEscape(plan?.roleViewpoint || joined(story.actors))}. This panel supports the workflow explanation; it is not a route instruction.</figcaption>
      </figure>
    </div>
    <div class="boundary-note">
      <strong>Demo boundary:</strong> ${htmlEscape(story.demoBoundary)}
    </div>
  </section>`;
}

function visibilityTable(matrix) {
  const roleGroups = [
    {
      title: "Setup and client-side visibility",
      roles: ["Platform Admin", "Ops Admin", "Client Success", "Principal"],
    },
    {
      title: "Family, analysis, advice, and release",
      roles: ["Family CFO", "Analyst", "Advisor", "Compliance"],
    },
    {
      title: "Privacy, security, external scope, and QA",
      roles: ["Privacy Officer", "Security", "External Advisor", "Product / QA"],
    },
  ];
  return `<div class="visibility-groups">
    ${roleGroups
      .map(
        (group) => `<section class="visibility-group">
          <h3>${htmlEscape(group.title)}</h3>
          <table class="visibility-table">
            <thead>
              <tr>
                <th>Object or state</th>
                ${group.roles.map((role) => `<th>${htmlEscape(role)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${matrix
                .map(
                  (entry) => `<tr>
                    <td><strong>${htmlEscape(entry.objectOrState)}</strong></td>
                    ${group.roles.map((role) => `<td>${htmlEscape(entry[role] || "")}</td>`).join("")}
                  </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </section>`,
      )
      .join("")}
  </div>`;
}

function stateAtlas(atlas) {
  return atlas
    .map(
      (group) => `<article class="state-card">
        <h3>${htmlEscape(group.stateGroup)}</h3>
        <p>${htmlEscape(group.businessMeaning)}</p>
        <div class="state-strip">${group.states.map((state) => `<span>${htmlEscape(state)}</span>`).join("")}</div>
        <dl>
          <dt>Who moves it forward</dt><dd>${htmlEscape(joined(group.whoMovesForward))}</dd>
          <dt>What other roles see</dt><dd>${htmlEscape(group.whatOtherRolesSee)}</dd>
          <dt>Evidence and audit</dt><dd>${htmlEscape(group.evidenceAuditImplications)}</dd>
          <dt>Client visibility</dt><dd>${htmlEscape(group.clientVisibilityImplications)}</dd>
        </dl>
      </article>`,
    )
    .join("");
}

function screenEvidencePanels(stories, plans) {
  return stories
    .map((story, index) => {
      const plan = plans.find((item) => item.storyId === story.storyId);
      const screenshot = screenshotForStory(story, plan);
      const screenshotUri = screenshot ? pathToFileURL(screenshot).href : "";
      return `<article class="screen-evidence">
        <div>
          <p class="evidence-id">${htmlEscape(story.storyId)}</p>
          <h3>${htmlEscape(story.title)}</h3>
          <p>${htmlEscape(plan?.whyTheyMatter || story.readerTakeaway)}</p>
          <dl>
            <dt>Role viewpoint</dt><dd>${htmlEscape(plan?.roleViewpoint || joined(story.actors))}</dd>
            <dt>Handoff shown</dt><dd>${htmlEscape(plan?.handoffShown || joined(story.handoffSequence))}</dd>
            <dt>What happened before</dt><dd>${htmlEscape(story.handoffSequence?.[0] || "The workflow was triggered.")}</dd>
            <dt>What happens next</dt><dd>${htmlEscape(story.handoffSequence?.[story.handoffSequence.length - 1] || "The next role acts.")}</dd>
          </dl>
        </div>
        <figure>
          ${
            screenshotUri
              ? `<img src="${screenshotUri}" alt="${htmlEscape(story.storyId)} appendix screenshot" />`
              : `<div class="missing-shot">No screenshot found</div>`
          }
          <figcaption>Appendix screenshot ${index + 1}. Used as workflow evidence only.</figcaption>
        </figure>
      </article>`;
    })
    .join("");
}

function buildData(source) {
  const plansByStory = new Map(source.screenshotUsagePlan.map((plan) => [plan.storyId, plan]));
  return {
    metadata: {
      title: "AlphaVest WealthOS Collaborative Workflow User Manual V3",
      language: "en",
      generatedAt: new Date().toISOString(),
      engineMode: "ENGINE_MIX_V2_CODEX_V3_PROOF",
      boundary: "Generated PDF production artifact from manual source package; not a production certification.",
    },
    sourceInputs: {
      collaborationJson: path.relative(ROOT, collaborationPath),
      collaborationQaReport: path.relative(ROOT, collaborationReportPath),
      screenshots: path.relative(ROOT, screenshotDir),
    },
    counts: {
      collaborationStages: source.collaborationModel.length,
      roleRelays: source.roleRelays.length,
      workflowStories: source.workflowStories.length,
      visibilityRows: source.visibilityMatrix.length,
      stateGroups: source.stateTransitionAtlas.length,
      screenshotPlans: source.screenshotUsagePlan.length,
      diagramSpecs: source.diagramSpecs.length,
      storyScreenshots: source.workflowStories.filter((story) => screenshotForStory(story, plansByStory.get(story.storyId))).length,
    },
    pdfStructure: source.pdfTocRecommendation,
    collaborationModel: source.collaborationModel,
    roleRelays: source.roleRelays,
    workflowStories: source.workflowStories,
    visibilityMatrix: source.visibilityMatrix,
    stateTransitionAtlas: source.stateTransitionAtlas,
    screenshotUsagePlan: source.screenshotUsagePlan,
    diagramSpecs: source.diagramSpecs,
    qaSource: source.qa,
  };
}

function buildHtml(data) {
  const plansByStory = new Map(data.screenshotUsagePlan.map((plan) => [plan.storyId, plan]));
  const stories = data.workflowStories
    .map((story, index) => storyCard(story, index, plansByStory.get(story.storyId)))
    .join("\n");
  const tocRows = data.pdfStructure
    .map(
      (item) => `<tr>
        <td>${htmlEscape(item.chapter)}</td>
        <td>${htmlEscape(item.title)}</td>
        <td>${htmlEscape(item.purpose)}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${htmlEscape(data.metadata.title)}</title>
  <link rel="stylesheet" href="./alphavest-collaborative-workflow-manual-v3.css" />
</head>
<body>
  <main>
    <section class="cover">
      <div class="cover-topline">
        <span>AlphaVest WealthOS</span>
        <span>Collaborative Workflow User Manual / V3</span>
      </div>
      <div class="cover-content">
        <p class="eyebrow light">Manual thesis</p>
        <h1>Turning data chaos into controlled shared workflow state.</h1>
        <p>${htmlEscape(data.qaSource.v3ProofWrapper.problemArchitecture)}</p>
      </div>
      <div class="cover-meta">
        <span>Generated: ${htmlEscape(data.metadata.generatedAt.slice(0, 10))}</span>
        <span>${htmlEscape(data.metadata.engineMode)}</span>
        <span>English PDF source package</span>
      </div>
    </section>

    <section class="section-page orientation">
      <p class="eyebrow">Executive orientation</p>
      <h2>What AlphaVest coordinates</h2>
      <p class="lead">${htmlEscape(data.metadata.title)} explains AlphaVest as a collaboration system, not as a catalogue of screens. The product value is that multiple roles can move from fragmented inputs to reviewed, released, evidenced, and auditable outcomes without confusing internal progress with client-visible advice.</p>
      <div class="principle-grid">
        <article><h3>Digital first</h3><p>Work enters the system as structured tenant, profile, entity, document, message, signal, decision, or export context.</p></article>
        <article><h3>Human reviewed</h3><p>Analysts, advisors, compliance, privacy, and security each inspect the part of the workflow they are responsible for.</p></article>
        <article><h3>Evidence backed</h3><p>Important actions create traceable proof so future reviewers know why the workflow advanced.</p></article>
        <article><h3>Client release controlled</h3><p>Client visibility waits for the required release, permission, evidence, and sensitivity gates.</p></article>
      </div>
      ${lifecycleDiagram(data.collaborationModel)}
    </section>

    <section class="section-page">
      <p class="eyebrow">Table of contents</p>
      <h2>Manual spine</h2>
      <p>This manual is organized by collaboration concept and workflow story. Tables and screenshots are supporting evidence, not the document structure.</p>
      <table class="toc-table">
        <thead><tr><th>Chapter</th><th>Title</th><th>Purpose</th></tr></thead>
        <tbody>${tocRows}</tbody>
      </table>
      <div class="summary-grid">
        <article><strong>${data.counts.collaborationStages}</strong><span>collaboration stages</span></article>
        <article><strong>${data.counts.roleRelays}</strong><span>role relays</span></article>
        <article><strong>${data.counts.workflowStories}</strong><span>workflow stories</span></article>
        <article><strong>${data.counts.stateGroups}</strong><span>state groups</span></article>
      </div>
    </section>

    <section class="section-page">
      <p class="eyebrow">Collaboration model</p>
      <h2>How work moves through AlphaVest</h2>
      <p>Every important flow follows the same pattern: a role introduces or improves an object, the system changes state, the next role sees a controlled view, and evidence or audit explains why the relay is legitimate.</p>
      <div class="stage-grid">${stageCards(data.collaborationModel)}</div>
    </section>

    <section class="section-page role-relays">
      <p class="eyebrow">Role relay model</p>
      <h2>Who changes what the next role can see</h2>
      <p>These relays make collaboration explicit. They show where a workflow crosses from one role lens into another and why that handoff protects visibility, release, and accountability.</p>
      <div class="relay-grid">${relayCards(data.roleRelays)}</div>
    </section>

    <section class="section-page">
      <p class="eyebrow">Core swimlanes</p>
      <h2>Collaboration flows that carry the manual</h2>
      ${swimlaneDiagram("D-002", "Trigger to client decision", [
        { role: "System / Analyst", steps: ["Signal enters queue", "Classify and route", "Prepare candidate"] },
        { role: "Advisor", steps: ["Review rationale", "Approve internally", "Send to compliance"] },
        { role: "Compliance", steps: ["Check evidence", "Release or block", "Control visibility"] },
        { role: "Client-side role", steps: ["View released context", "Accept, defer, or reject", "Decision recorded"] },
      ], "The flow shows why signal handling, advisor approval, compliance release, and client decision are distinct workflow events.") }
      ${swimlaneDiagram("D-003", "Document intake handoff", [
        { role: "Client / External Advisor", steps: ["Upload source", "Confirm extraction", "Resolve missing context"] },
        { role: "Analyst", steps: ["Validate classification", "Link entity or context", "Mark verified or blocked"] },
        { role: "Compliance", steps: ["Check suitability", "Use as release evidence", "Preserve audit trail"] },
      ], "The flow shows how an uploaded source becomes trusted evidence only after classification, confirmation, and review.") }
      ${swimlaneDiagram("D-004", "Tenant onboarding relay", [
        { role: "Platform Admin", steps: ["Set policy baseline", "Prepare platform rules"] },
        { role: "Ops Admin", steps: ["Create tenant", "Assign team", "Prepare activation"] },
        { role: "Client Success", steps: ["Coordinate readiness", "Invite user", "Track consent"] },
        { role: "Compliance", steps: ["Confirm owner gates", "Review release controls"] },
      ], "The flow shows tenant activation as a governed collaboration container, not only an account setup task.") }
      ${evidenceLineageDiagram()}
      ${visibilityGateDiagram()}
    </section>

    ${stories}

    <section class="section-page">
      <p class="eyebrow">Visibility and release gates</p>
      <h2>Why internal progress is different from client visibility</h2>
      <p class="lead">AlphaVest separates internal collaboration from client-visible release. Advisor approval is a human review step, but compliance release, evidence completeness, permission checks, and sensitivity boundaries decide whether a client can see or act on something.</p>
      ${visibilityGateDiagram()}
      <p>The matrix below is intentionally supporting material. It helps readers compare role visibility across objects, but it is not the main story of the manual.</p>
      ${visibilityTable(data.visibilityMatrix)}
    </section>

    <section class="section-page">
      <p class="eyebrow">Evidence and audit lineage</p>
      <h2>How AlphaVest preserves the reason a workflow advanced</h2>
      <p>Evidence lets a later reviewer understand what changed before they entered the flow. Audit events protect sensitive actions by preserving actor, role, object, previous state, next state, and result.</p>
      ${evidenceLineageDiagram()}
      <div class="principle-grid">
        <article><h3>Review memory</h3><p>Evidence connects decisions, releases, documents, exports, messages, and approvals into a coherent trace.</p></article>
        <article><h3>Controlled correction</h3><p>Corrections create new events rather than silently rewriting what happened.</p></article>
        <article><h3>Future collaboration</h3><p>The next role can act with context instead of reconstructing the past from messages or memory.</p></article>
        <article><h3>Client trust</h3><p>Released material has an explainable lineage instead of appearing as an unsupported conclusion.</p></article>
      </div>
    </section>

    <section class="section-page">
      <p class="eyebrow">State transition atlas</p>
      <h2>What states mean for collaboration</h2>
      <p>States are not technical labels in this manual. They explain whether an object is still being prepared, blocked for protection, ready for review, released to a client, or captured as evidence.</p>
      <div class="state-grid">${stateAtlas(data.stateTransitionAtlas)}</div>
    </section>

    <section class="section-page appendix">
      <p class="eyebrow">Screen evidence appendix</p>
      <h2>Screenshots as workflow evidence</h2>
      <p>Each screenshot is tied to a workflow moment, role viewpoint, and handoff. The screenshot supports the explanation; it does not replace it.</p>
      <div class="screen-evidence-list">${screenEvidencePanels(data.workflowStories, data.screenshotUsagePlan)}</div>
    </section>

    <section class="section-page appendix">
      <p class="eyebrow">Production boundary</p>
      <h2>What this PDF claims and what it does not claim</h2>
      <div class="principle-grid">
        <article><h3>Grounded claim</h3><p>The manual is generated from the collaboration source package and current repository documentation.</p></article>
        <article><h3>Demo boundary</h3><p>Some workflows are navigable with demo data but not claimed as fully persisted production transactions.</p></article>
        <article><h3>Accessibility boundary</h3><p>The PDF is text-extractable, but this Chromium generation is not claimed as tagged PDF/UA output.</p></article>
        <article><h3>Operational use</h3><p>The manual should support onboarding, review, QA, and stakeholder explanation of collaboration mechanics.</p></article>
      </div>
      <h3>Proof points from the source package</h3>
      ${list(data.qaSource.v3ProofWrapper.proofPath)}
      <h3>Adversarial QA from the source package</h3>
      ${list(data.qaSource.v3ProofWrapper.adversarialQA)}
    </section>
  </main>
</body>
</html>`;
}

function buildCss() {
  return `:root {
  --navy: #10283b;
  --navy-2: #18384f;
  --ink: #1f2933;
  --muted: #687586;
  --paper: #fbf7ef;
  --paper-2: #fffdf8;
  --line: #d8cfbf;
  --gold: #b88a38;
  --gold-soft: #efe2c2;
  --blue-soft: #dce9ef;
  --sage-soft: #dfe8df;
  --rose-soft: #f3e2dc;
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
  font-size: 10.7pt;
  line-height: 1.46;
}

body {
  counter-reset: figures;
}

h1,
h2,
h3,
h4,
p {
  margin-top: 0;
}

h1 {
  max-width: 154mm;
  color: #fff;
  font-size: 35pt;
  line-height: 1.04;
  font-weight: 680;
}

h2 {
  color: var(--navy);
  font-size: 21pt;
  line-height: 1.1;
  margin-bottom: 10px;
  font-weight: 680;
}

h3 {
  color: var(--navy);
  font-size: 9.4pt;
  text-transform: uppercase;
  letter-spacing: 0;
  margin-bottom: 5px;
}

h4 {
  color: var(--navy);
  font-size: 9.4pt;
  margin: 0 0 6px;
}

p,
li,
dt,
dd,
td,
th {
  overflow-wrap: anywhere;
}

ul {
  margin: 0 0 10px 17px;
  padding: 0;
}

li {
  margin-bottom: 4px;
}

dl {
  display: grid;
  grid-template-columns: 31mm 1fr;
  gap: 3px 8px;
  margin: 0;
}

dt {
  color: var(--navy);
  font-weight: 700;
}

dd {
  margin: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0 16px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 6px 7px;
  text-align: left;
  vertical-align: top;
}

th {
  background: #efe8d8;
  color: var(--navy);
  font-size: 7.8pt;
  text-transform: uppercase;
  letter-spacing: 0;
}

td {
  font-size: 8.4pt;
}

figcaption,
.muted,
.diagram-note {
  color: var(--muted);
}

figcaption {
  font-size: 8.3pt;
  margin-top: 7px;
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

.cover-topline,
.cover-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #f4ead7;
  font-size: 8.8pt;
}

.cover-content p {
  max-width: 142mm;
  color: #f4ead7;
  font-size: 13.2pt;
}

.cover-meta {
  flex-wrap: wrap;
  justify-content: flex-start;
}

.cover-meta span {
  border: 1px solid rgba(239, 226, 194, 0.45);
  padding: 6px 8px;
}

.section-page,
.story-chapter {
  break-before: page;
  min-height: 246.2mm;
}

.eyebrow,
.chapter-kicker {
  color: var(--gold);
  font-size: 8.2pt;
  text-transform: uppercase;
  font-weight: 780;
  letter-spacing: 0;
  margin-bottom: 8px;
}

.eyebrow.light {
  color: var(--gold-soft);
}

.lead {
  max-width: 162mm;
  font-size: 12.2pt;
  color: #364452;
}

.principle-grid,
.summary-grid,
.stage-grid,
.relay-grid,
.story-hero,
.story-flow,
.story-detail,
.state-grid {
  display: grid;
  gap: 10px;
}

.principle-grid {
  grid-template-columns: repeat(4, 1fr);
  margin: 13px 0 16px;
}

.principle-grid article,
.stage-card,
.relay-card,
.story-hero article,
.story-flow article,
.state-card,
.screen-evidence,
.evidence-panel,
.diagram {
  border: 1px solid var(--line);
  background: var(--paper-2);
  padding: 11px;
  break-inside: avoid;
}

.principle-grid article {
  border-top: 3px solid var(--gold);
}

.summary-grid {
  grid-template-columns: repeat(4, 1fr);
  margin-top: 15px;
}

.summary-grid article {
  background: var(--navy);
  color: #fff;
  padding: 13px;
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

.stage-grid {
  grid-template-columns: repeat(3, 1fr);
}

.stage-card {
  position: relative;
  padding-top: 14px;
}

.stage-card p {
  color: #344253;
}

.stage-index,
.relay-id,
.evidence-id {
  display: inline-block;
  color: var(--navy);
  background: var(--gold-soft);
  border: 1px solid var(--gold);
  padding: 3px 6px;
  font-weight: 760;
  font-size: 8pt;
  margin-bottom: 7px;
}

.relay-grid {
  grid-template-columns: repeat(2, 1fr);
}

.relay-card {
  border-left: 4px solid var(--gold);
}

.relay-object {
  color: #40505f;
  font-weight: 650;
}

.diagram {
  margin: 14px 0;
  background: #fffaf1;
}

.diagram-title {
  color: var(--navy);
  font-weight: 760;
  margin-bottom: 9px;
}

.lifecycle-track {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.life-step {
  min-height: 20mm;
  background: var(--navy);
  color: #fff;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.life-step span {
  color: var(--gold-soft);
  font-weight: 800;
}

.swimlane-grid {
  display: grid;
  grid-template-columns: repeat(var(--lane-count), 1fr);
  gap: 7px;
}

.lane {
  background: #f7f0e3;
  border: 1px solid var(--line);
  padding: 8px;
}

.lane span {
  display: block;
  background: #fff;
  border-left: 3px solid var(--gold);
  padding: 6px 7px;
  margin-bottom: 6px;
  font-size: 8.5pt;
}

.gate-chain,
.lineage-row {
  display: grid;
  gap: 7px;
}

.gate-chain {
  grid-template-columns: repeat(5, 1fr);
}

.gate-chain div,
.lineage-row div,
.lineage-spine {
  background: var(--blue-soft);
  color: var(--navy);
  border: 1px solid #bed0da;
  padding: 8px;
  text-align: center;
  font-weight: 700;
}

.gate-chain .gate-result {
  background: var(--navy);
  color: #fff;
}

.lineage-row {
  grid-template-columns: repeat(6, 1fr);
}

.lineage-spine {
  margin-top: 8px;
  background: var(--navy);
  color: #fff;
}

.story-hero {
  grid-template-columns: 1fr 0.82fr 1fr;
  margin: 12px 0;
}

.story-flow {
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 12px;
}

.story-flow article {
  background: #fffaf1;
}

.story-detail {
  grid-template-columns: 0.78fr 1.22fr;
  align-items: start;
}

.evidence-panel {
  margin: 0;
}

.evidence-panel img,
.screen-evidence img {
  display: block;
  width: 100%;
  max-height: 88mm;
  object-fit: contain;
  background: #fff;
  border: 1px solid #cfc5b4;
}

.boundary-note {
  margin-top: 12px;
  padding: 9px 10px;
  border-left: 4px solid var(--gold);
  background: #f8efdf;
  break-inside: avoid;
}

.visibility-table {
  margin-bottom: 12px;
}

.visibility-table th,
.visibility-table td {
  padding: 5px 6px;
  font-size: 7.9pt;
}

.visibility-group {
  break-inside: avoid;
  margin-bottom: 12px;
}

.visibility-group h3 {
  color: var(--gold);
}

.state-grid {
  grid-template-columns: repeat(2, 1fr);
}

.state-card {
  background: #fffaf1;
}

.state-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 8px 0;
}

.state-strip span {
  background: var(--navy);
  color: #fff;
  padding: 4px 6px;
  font-size: 7.6pt;
}

.screen-evidence-list {
  display: grid;
  gap: 12px;
}

.screen-evidence {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 10px;
  align-items: start;
}

.screen-evidence figure {
  margin: 0;
}

.missing-shot {
  min-height: 58mm;
  display: grid;
  place-items: center;
  color: var(--muted);
  border: 1px dashed var(--line);
  background: #fff;
}

.appendix {
  break-before: page;
}

.toc-table td {
  font-size: 9pt;
}
`;
}

async function main() {
  ensureDir(sourceDir);
  ensureDir(outputDir);

  const source = normalizeManualValue(readJson(collaborationPath));
  const data = buildData(source);
  const html = buildHtml(data);
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
    headerTemplate: `<div style="width:100%;font-size:7px;color:#7a6f5f;padding:0 25.4mm;font-family:Inter,Arial,sans-serif;">AlphaVest WealthOS Collaborative Workflow Manual V3</div>`,
    footerTemplate: `<div style="width:100%;font-size:7px;color:#7a6f5f;padding:0 25.4mm;font-family:Inter,Arial,sans-serif;display:flex;justify-content:space-between;"><span>Workflow collaboration manual</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    preferCSSPageSize: true,
  });
  await browser.close();

  console.log(
    JSON.stringify(
      {
        html: path.relative(ROOT, htmlPath),
        css: path.relative(ROOT, cssPath),
        data: path.relative(ROOT, dataPath),
        outputHtml: path.relative(ROOT, outputHtmlPath),
        pdf: path.relative(ROOT, pdfPath),
        counts: data.counts,
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
