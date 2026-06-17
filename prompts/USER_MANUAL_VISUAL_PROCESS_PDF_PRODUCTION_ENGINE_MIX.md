# AlphaVest Visual Process Manual PDF Production Prompt

Max

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Create a polished, print-ready English PDF manual from the AlphaVest WealthOS visual-process manual package.

This is not a generic "make it pretty" PDF task. The PDF must make AlphaVest's collaboration logic understandable: how work moves between roles, why each gate exists, what the user sees, what changes in system state, what becomes visible to another role, and what evidence or audit trail is preserved.

The PDF must look like a serious AlphaVest product artifact: premium, calm, readable, workflow-native, compliance-aware, and visually aligned with the AlphaVest WealthOS design direction. It must also satisfy the Codex Visual Implementation Standard. Do not claim visual acceptance until rendered PDF pages have been inspected.

## Core Principle

The manual must teach a complex workflow by pairing:

1. A process graphic that explains the role/state/visibility journey.
2. An annotated screenshot that shows where that journey appears in the UI.
3. Nearby callout text that explains what the user does, why it matters, what data is involved, what changes, and what the next role sees.

If a page contains a process graphic without UI evidence, it is incomplete.
If a page contains a screenshot without process context, it is incomplete.
If a page relies mainly on tables, it has failed.

## Repository

`/Users/chris/projects/alphavest-wealthos-clickdummy`

## Mandatory Standards And Grounding

Read these before producing or modifying artifacts:

1. `AGENTS.md`
2. `CODEX_MASTER_TASK.md`
3. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
4. `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
5. `docs/v3/DATA_MODEL_V3.md`
6. `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
7. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/README.md`
8. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/visual-implementation-rules.md`
9. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/human-visual-review-rubric.md`
10. `/Users/chris/Documents/Codex/2026-06-16/du-bist-ein-senior-architekt-f/docs/codex-visual-implementation-standard/alphavest-project-adapter-delta.md`

## Online Research Basis

Use these documentation and PDF principles as mandatory input. Cite them in the QA report.

1. NN/g help/documentation: help must be task-focused, concise, searchable, and list concrete steps. Source: `https://www.nngroup.com/articles/help-and-documentation/`
2. NN/g complex-application guidance: complex applications require clear workflow support, visible state, and reduction of cognitive load. Source: `https://www.nngroup.com/articles/complex-application-design/`
3. Microsoft procedure guidance: procedural documentation should use clear step-by-step instructions and UI interaction verbs. Source: `https://learn.microsoft.com/en-us/style-guide/procedures-instructions/`
4. Microsoft step-by-step instruction guidance: choose clear procedural formats and distinguish simple from complex procedures. Source: `https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions`
5. W3C PDF accessibility techniques: PDF output should preserve logical reading order, document title/language where possible, and text extraction. Sources: `https://www.w3.org/TR/WCAG20-TECHS/PDF3.html`, `https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF18`
6. PDF Association tagged PDF guidance: if the PDF is not tagged/PDF-UA, document that limitation honestly. Source: `https://pdfa.org/accessibility/`
7. PDF Association tagged PDF best practices: tagged PDF/PDF-UA requires structural document semantics, not just visual appearance. Source: `https://pdfa.org/resource/tagged-pdf-best-practice-guide-syntax/`

## Primary Source Inputs

Use the current visual-process package as the main source:

1. `docs/v3/user-manual-visual-process/README.md`
2. `docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.md`
3. `docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.json`
4. `docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_QA_REPORT_V3.md`
5. `docs/v3/user-manual-visual-process/annotated-screenshot-map.json`
6. `docs/v3/user-manual-visual-process/process-graphic-map.json`
7. `docs/v3/user-manual-visual-process/annotated-screenshots/*.png`
8. `docs/v3/user-manual-visual-process/process-graphics/*.svg`
9. `docs/v3/user-manual-visual-process/process-graphics/*.png`

Use these as supporting source and traceability inputs:

1. `docs/v3/user-manual-source/user-manual-source.v3.json`
2. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json`
3. `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json`
4. `artifacts/user-manual-source/20260616-232649Z/screenshots/`

Use previous PDFs only as negative examples or implementation references:

1. `output/pdf/alphavest-wealthos-user-manual-v3.pdf`
2. `output/pdf/alphavest-wealthos-contextual-user-manual-v3.pdf`
3. `output/pdf/alphavest-wealthos-collaborative-workflow-manual-v3.pdf`
4. `output/pdf/alphavest-wealthos-visual-process-manual-v3.pdf`

Do not copy a weak layout from a previous PDF.

## Required Deliverables

Create or update:

1. `docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v4.html`
2. `docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v4.css`
3. `docs/v3/user-manual-pdf/source/visual-process-manual-pdf-data-v4.json`
4. `output/pdf/alphavest-wealthos-visual-process-manual-v4.html`
5. `output/pdf/alphavest-wealthos-visual-process-manual-v4.pdf`
6. `output/pdf/rendered/visual-process-v4/alphavest-visual-process-manual-v4-page-*.png`
7. `output/pdf/rendered/visual-process-v4/alphavest-visual-process-manual-v4-contact-sheet.png`
8. `docs/v3/user-manual-pdf/ALPHAVEST_VISUAL_PROCESS_MANUAL_PDF_QA_REPORT_V4.md`
9. `docs/v3/user-manual-pdf/README.md`

Create or update a reusable generation script:

1. `scripts/generate-visual-process-manual-pdf-v4.mjs`

Do not overwrite the V3 PDF artifacts unless explicitly necessary. Preserve previous evidence.

## PDF Architecture

The PDF should be a process-learning manual, not a route catalogue.

### 1. Cover

Include:

1. Product name: AlphaVest WealthOS.
2. Title: Visual Process User Manual.
3. Version marker: V4.
4. Subtitle: process graphics, annotated UI evidence, role handoffs, visibility gates, evidence trails.
5. Generated date.
6. A restrained AlphaVest visual treatment.

### 2. Reader Orientation

Explain:

1. What problem AlphaVest solves.
2. How to read a process module.
3. Why process graphic and screenshot always appear together.
4. Why advisor approval, compliance release, evidence, and visibility gates matter.
5. What the current demo/prototype boundary means.

### 3. Process Legend

Create a compact visual legend:

1. Task/action shape.
2. Decision/gate shape.
3. Role lane.
4. Data/evidence object.
5. Visibility marker.
6. Permission/compliance marker.
7. Audit/evidence marker.
8. Screenshot callout marker.
9. Current path vs future/demo-boundary path.

The legend must be visually consistent with the actual workflow graphics.

### 4. Workflow Modules

Create one chapter for each:

1. `WS-001` Tenant becomes operational.
2. `WS-002` Client profile becomes usable shared family context.
3. `WS-003` Document chaos becomes verified evidence.
4. `WS-004` Signal becomes reviewed recommendation candidate.
5. `WS-005` Advisor-approved package becomes compliance-controlled client visibility.
6. `WS-006` Client decision becomes evidence and review cadence.
7. `WS-007` Governance change becomes permission-safe access.
8. `WS-008` Communication escalation becomes recorded service context.
9. `WS-009` Export request becomes redacted, approved, auditable package.
10. `WS-010` Ops monitoring turns workflow friction into service and product improvement.

Each workflow module should use this page pattern:

#### Page A: Process Overview

1. Workflow title.
2. One-sentence outcome.
3. Why the workflow exists.
4. Roles and responsibilities.
5. Data object moving through the process.
6. Dominant process graphic.
7. Caption explaining what the graphic shows and why it matters.

#### Page B: Annotated UI Evidence

1. Annotated screenshot, large enough to inspect.
2. Numbered callout explanations next to or directly below the screenshot.
3. Each callout explains:
   - user action or inspection,
   - why this matters,
   - required data,
   - state change,
   - visibility change,
   - evidence/audit effect,
   - what the next role sees.
4. Keep callout text close to the visual marker it explains.

#### Page C: Exception, Gate, And Recovery

Include when meaningful:

1. What blocks the workflow.
2. Which role must resolve it.
3. What remains hidden.
4. What the user can do next.
5. Which evidence/audit lineage remains preserved.
6. What becomes possible after recovery.

#### Page D: Compact Reference

Include only when it adds value. Use a checklist or small table, not a dense matrix.

## Layout And Visual Direction

Follow AlphaVest design:

1. Deep navy / midnight / charcoal.
2. Ivory paper background.
3. Champagne-gold accents.
4. Cool neutral dividers.
5. Restrained semantic status colors.
6. Calm enterprise-SaaS typography.
7. Strong whitespace.
8. No decorative blobs, fake hero graphics, or ornamental filler.
9. No one-note purple/blue gradient system.
10. No visible prompt metadata, filenames, route labels, spec rails, QA notes, or debug content in the user-facing PDF.

### Page Geometry

Use A4.

Baseline:

```css
@page {
  size: A4;
  margin: 25.4mm;
}
```

The document must not feel cramped or pasted to the edge. Use comfortable internal spacing:

1. No content touching page margins.
2. Clear gutters around screenshots and process graphics.
3. Captions separated from images.
4. Header/footer quiet enough not to compete with content.
5. Body text line length readable in print.
6. Minimum body text around 10.5pt to 11.5pt.
7. Captions no smaller than 8.5pt unless unavoidable.
8. Tables no smaller than 8.5pt and never used as the main explanation.

## Visual Implementation Standard Requirements

Apply the Codex Visual Implementation Standard:

1. DOM/file success is not visual acceptance.
2. Every generated page must be judged by human visual review criteria.
3. Product-native feel, hierarchy, spacing, reference fidelity, data realism, and accessibility must be reviewed.
4. Screenshot proof is mandatory.
5. Old evidence must not be overwritten silently; write V4 artifacts to new paths.
6. Completion claims must distinguish:
   - generated,
   - rendered,
   - text-checked,
   - visually reviewed,
   - accepted with minor issues,
   - blocked.

Use the human visual review rubric and write the rubric result into the QA report.

## Technical Production Pipeline

Use a deterministic local pipeline.

Preferred:

1. Read visual-process JSON and maps.
2. Build a structured `visual-process-manual-pdf-data-v4.json`.
3. Generate HTML from the structured data.
4. Generate print CSS.
5. Render PDF with Playwright/Chromium.
6. Copy the HTML artifact to `output/pdf/`.
7. Render pages to PNG using Poppler `pdftoppm`.
8. Generate a contact sheet.
9. Run text and artifact checks.
10. Write QA report.

Fallback:

Use Python/reportlab only if browser PDF rendering fails, and document the reason.

Do not load external fonts, scripts, CSS, images, Mermaid CDNs, or remote rendering services at PDF build time.

## Image And Diagram Requirements

Process graphics:

1. Use the existing process graphics as the primary diagrams.
2. If a graphic is illegible, clipped, crowded, or visually weak, regenerate it before using it in the PDF.
3. Preserve source SVG and rendered PNG.
4. Ensure no title/subtitle overlaps with swimlanes.
5. Ensure diagram text remains legible after being placed into the PDF.

Annotated screenshots:

1. Use only annotated screenshots in the workflow chapters.
2. Do not embed raw screenshots as the primary evidence.
3. Ensure callouts remain visible after PDF rendering.
4. Do not use more than four callouts per screenshot.
5. If a callout is broad-region rather than exact UI-element level, state that in the QA report.

Captions:

Every graphic and screenshot must have a caption explaining:

1. What it shows.
2. Why it matters.
3. Which workflow/callouts it supports.

## Content Rules

Preserve these AlphaVest product rules:

1. Digital first.
2. Human reviewed.
3. Evidence backed.
4. Demo-data-first only.
5. No real client data.
6. No final financial, legal, or tax advice.
7. No unapproved advice reaches the client.
8. Advisor approval alone is not enough.
9. Compliance release controls client visibility.
10. Evidence supports important actions where completion is claimed.
11. Sensitive actions create audit events where completion is claimed.
12. Role, tenant, object scope, workflow state, sensitivity, and ownership affect what users can see or do.
13. Blocked states are controls, not generic errors.
14. Exports are scoped, redacted, permission-checked, approved, and audited where completion is claimed.

Do not invent application behavior. If the source only supports a demo or static representation, phrase it as:

1. "This prepares..."
2. "This supports..."
3. "This creates the context needed for..."
4. "In production, this pattern can support..."

Do not write:

1. "This is compliant" without proof.
2. "This guarantees..." without proof.
3. "The client can rely on this as advice."
4. "This automatically..." for behavior not implemented or verified.
5. route paths as user-facing navigation instructions.

## Forbidden Layouts

Reject these explicitly in the QA report if considered:

1. Table-led manual.
2. Screenshot-only manual.
3. Route-led manual.
4. Generic diagram-only manual.
5. Dense visibility matrix as the main explanation.
6. Unannotated screenshot evidence.
7. Decorative process graphics that do not map to UI evidence.
8. Edge-to-edge dense PDF pages.
9. Tiny text used to force content onto fewer pages.
10. Page designs that look like prompt/spec boards rather than a product manual.

## Verification Requirements

Run and report:

1. `node scripts/generate-visual-process-manual-pdf-v4.mjs`
2. Source artifact existence checks.
3. JSON consistency checks:
   - 10 workflow modules,
   - 10 process graphics,
   - 10 annotated screenshots,
   - at least 30 callouts,
   - no raw screenshot references as primary chapter images.
4. Required workflow ID scan for `WS-001` through `WS-010`.
5. Callout-to-text linkage check.
6. Placeholder scan.
7. Route-led instruction scan.
8. ASCII scan for generated source files unless non-ASCII is justified.
9. `pdfinfo output/pdf/alphavest-wealthos-visual-process-manual-v4.pdf`
10. Poppler page rendering with `pdftoppm`.
11. Contact-sheet generation.
12. Text extraction with `pypdf`, `pdfplumber`, or `pdftotext`.
13. Verify that the text contains:
    - all workflow IDs,
    - "User action or inspection",
    - "Why this matters",
    - "Visibility",
    - "Evidence/audit",
    - "Codex Visual Implementation Standard".
14. Visual inspection of:
    - cover,
    - orientation page,
    - process legend,
    - at least three process overview pages,
    - at least three annotated UI evidence pages,
    - final boundary/proof page,
    - full contact sheet.
15. Human visual review rubric.
16. `pnpm lint`
17. `pnpm typecheck`

If a verification step cannot run, document why and do not mark it as passed.

## QA Report Requirements

Write:

`docs/v3/user-manual-pdf/ALPHAVEST_VISUAL_PROCESS_MANUAL_PDF_QA_REPORT_V4.md`

Include:

1. Inputs used.
2. Online research principles applied.
3. Visual Implementation Standard files used.
4. Outputs produced.
5. Generation command.
6. Page count.
7. Rendered-page artifact locations.
8. Contact sheet location.
9. JSON consistency results.
10. Text extraction results.
11. PDF metadata.
12. Visual inspection notes.
13. Human visual review rubric table.
14. Rejected weak approaches.
15. Known limitations.
16. PDF/UA tagging status.
17. Commands run and results.

The QA report must be honest. If broad-region callouts remain, say so. If the PDF is not tagged/PDF-UA, say so. If some behavior is demo-only, say so.

## Engine Execution Requirements

Use V2 for structured execution:

1. Discover: read source package, standards, previous PDF artifacts, and current generated images.
2. Define: choose a page architecture and layout system that solves the user's criticism.
3. Develop: implement the HTML/CSS/JSON/PDF pipeline and improve graphics only where needed.
4. Deliver: render, inspect, verify, document, and report.

Use V3 proof discipline:

1. Evidence before claims.
2. Facts vs assumptions separated.
3. Preserve meaningful layout alternatives only if they materially differ.
4. Kill weak layout approaches explicitly.
5. Use adversarial QA against the user's prior criticism: "tables and images do not explain the workflow."
6. End with proof paths and residual limitations.

## Acceptance Criteria

The task is complete only if:

1. The PDF exists at `output/pdf/alphavest-wealthos-visual-process-manual-v4.pdf`.
2. The HTML/CSS source exists and can regenerate the PDF.
3. The PDF uses standard A4 margins and visible internal spacing.
4. The PDF is not table-led.
5. Every workflow module uses process graphic plus annotated screenshot evidence.
6. Callout explanations are near the relevant screenshot.
7. All `WS-001` through `WS-010` are represented.
8. The visual-process package and AlphaVest product rules are respected.
9. The PDF pages are rendered to PNG.
10. The contact sheet exists.
11. Visual inspection found no obvious overlap, clipping, margin failure, broken image, or unreadably tiny text in reviewed pages.
12. The QA report documents the Visual Implementation Standard review.
13. `pnpm lint` and `pnpm typecheck` pass or failures are documented.

## Final Response Requirements

Respond in German unless the user asks otherwise.

Include:

1. PDF path.
2. HTML source path.
3. CSS source path.
4. Contact sheet path.
5. QA report path.
6. Commands run.
7. Visual inspection status.
8. Honest limitations.

Do not claim perfection. Claim only what was generated, rendered, inspected, and verified.
