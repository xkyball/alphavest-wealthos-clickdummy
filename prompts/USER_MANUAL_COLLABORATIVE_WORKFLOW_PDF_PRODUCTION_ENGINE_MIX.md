# AlphaVest Collaborative Workflow Manual PDF Production Prompt

Max

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Create a state-of-the-art English PDF user manual for AlphaVest WealthOS that turns the collaboration workflow source package into a polished, readable, story-led manual.

The PDF must explain how AlphaVest creates visibility and consistency in a complex multi-role wealth-management data environment. It must not merely show pages, screenshots, tables, fields, or route paths. It must help a human understand how work moves through the application, why each role acts at a given moment, what becomes visible to whom, which safeguards apply, and what future actions become possible.

The final output should feel like an AlphaVest product artifact: calm, premium, compliance-aware, operationally useful, and visually aligned with the existing AlphaVest WealthOS design direction.

## Source Priority

Use the following source package as the primary input:

1. `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.md`
2. `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json`
3. `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_QA_REPORT_V3.md`
4. `docs/v3/user-manual-collaboration/README.md`

Use these repository sources only for grounding and validation:

1. `CODEX_MASTER_TASK.md`
2. `docs/v3/CODEX_TASKS_DETAILED_V3.md`
3. `docs/v3/SCREEN_CATALOGUE_V3.md`
4. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
5. `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
6. `docs/v3/DATA_MODEL_V3.md`
7. `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
8. `public/reference/page_ui_v3/clean_pages/`

Use the older contextual PDF package only as a technical reference for production mechanics and as a negative example for layout density:

1. `prompts/USER_MANUAL_CONTEXTUAL_PDF_PRODUCTION_ENGINE_MIX.md`
2. `docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.html`
3. `docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.css`
4. `scripts/generate-contextual-user-manual-pdf.mjs`
5. `output/pdf/alphavest-wealthos-contextual-user-manual-v3.pdf`

Do not let the older PDF structure dominate the new manual.

## What This PDF Must Not Become

Do not create a manual that is primarily:

1. A table collection.
2. A screenshot catalogue.
3. A route-by-route manual.
4. A field appendix with design polish.
5. A cramped, edge-to-edge document.
6. A collection of disconnected page descriptions.
7. A marketing brochure that hides operational detail.
8. A manual that explains only what is on screen but not why it matters.

The application solves a workflow and collaboration problem. The manual must therefore make the collaboration model visible.

## Required Deliverables

Create or update these files:

1. `docs/v3/user-manual-pdf/source/alphavest-collaborative-workflow-manual-v3.html`
2. `docs/v3/user-manual-pdf/source/alphavest-collaborative-workflow-manual-v3.css`
3. `docs/v3/user-manual-pdf/source/collaborative-workflow-manual-pdf-data.json`
4. `output/pdf/alphavest-wealthos-collaborative-workflow-manual-v3.html`
5. `output/pdf/alphavest-wealthos-collaborative-workflow-manual-v3.pdf`
6. `output/pdf/rendered/collaborative/alphavest-collaborative-workflow-manual-v3-page-*.png`
7. `output/pdf/rendered/collaborative/alphavest-collaborative-workflow-manual-v3-contact-sheet.png`
8. `docs/v3/user-manual-pdf/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_PDF_QA_REPORT_V3.md`
9. `docs/v3/user-manual-pdf/README.md`

Create a reusable script if it improves repeatability:

1. `scripts/generate-collaborative-workflow-manual-pdf.mjs`

## PDF Architecture

Build the manual as a workflow narrative, not a route reference.

### 1. Cover

Include:

1. Product name: AlphaVest WealthOS.
2. Manual title: Collaborative Workflow User Manual.
3. Version marker: V3.
4. Subtitle explaining the purpose: visibility, consistency, review, release control, and evidence-backed collaboration.
5. Date generated.
6. A restrained AlphaVest-style visual system, not a decorative illustration.

### 2. Executive Orientation

Explain:

1. What operational problem AlphaVest solves.
2. Why multiple roles must collaborate instead of acting in isolation.
3. Why evidence, review, and compliance release are part of the workflow rather than afterthoughts.
4. How the manual should be read: by workflow story, role relay, visibility gate, and evidence trail.

### 3. Collaboration Model Overview

Create a diagram-first chapter that shows the full collaboration lifecycle:

`Client context -> Advisor intake -> Operations preparation -> Investment analysis -> Compliance review -> Client visibility -> Decision record -> Evidence and audit trail`

Explain for each stage:

1. Who acts.
2. What they need.
3. What they produce.
4. What becomes visible.
5. Which guardrail applies.
6. What the next role can now do.

### 4. Role Relay Model

Transform the `roleRelays` source into role relay strips. Each relay must show:

1. Trigger role.
2. Receiving role.
3. Artifact being handed over.
4. Status or visibility change.
5. Why the handoff matters.
6. Failure or risk prevented by the handoff.

Include all relay IDs from `RR-001` through `RR-013`.

### 5. Workflow Story Chapters

Create a chapter for each workflow story from `WS-001` through `WS-010`.

Each story chapter must use this structure:

1. Workflow purpose.
2. Business context.
3. Roles involved.
4. Preconditions.
5. Trigger.
6. End-to-end flow.
7. What each role sees.
8. What each role can do.
9. Required input data.
10. Optional input data.
11. Validation and guardrails.
12. Evidence created.
13. State changes.
14. Visibility changes.
15. Outcome.
16. What becomes possible next.
17. Screenshots or UI evidence panels.
18. Edge cases and recovery.

The chapter body should be prose-led and diagram-supported. Use tables only for compact comparison, not as the main content shape.

### 6. Core Collaboration Swimlanes

Create swimlane pages for the most important cross-role flows:

1. Trigger -> recommendation -> compliance -> client decision.
2. Document intake -> review -> evidence -> client/advisor availability.
3. Tenant onboarding -> operations setup -> advisor readiness -> client portal activation.
4. Investment proposal -> risk context -> compliance release -> client-facing publication.
5. Service request -> triage -> owner assignment -> resolution -> audit event.

Each swimlane must show:

1. Role lanes.
2. Trigger event.
3. Decision points.
4. Data artifacts.
5. System-generated evidence.
6. Visibility boundary.
7. Completion signal.

### 7. Visibility And Release Gates

Create a dedicated chapter for visibility control.

Explain:

1. Why advisor approval alone is not sufficient.
2. Why compliance release controls client visibility.
3. Which objects can be internal-only, advisor-visible, compliance-pending, or client-visible.
4. How the user knows that something has moved from internal collaboration to client-facing release.
5. What risks are avoided by these gates.

The visibility matrix may appear here, but only as a focused artifact. Do not let it become the main manual.

### 8. Evidence And Audit Lineage

Create a dedicated chapter showing how AlphaVest records decisions and sensitive actions.

Explain:

1. Which user actions create evidence.
2. Which actions create audit events.
3. How evidence supports review, traceability, and future collaboration.
4. How a later user can understand what happened before they entered the workflow.
5. Why this matters for compliance, client trust, and operational consistency.

### 9. State Transition Atlas

Create a visual state transition atlas from the source data.

For each state group:

1. Show allowed transitions.
2. Explain the role or event that causes the transition.
3. Explain what the transition enables.
4. Explain what it prevents.
5. Reference relevant workflow stories.

Keep this as an atlas, not a raw technical dump.

### 10. Screen Evidence Appendix

Use screenshots as supporting evidence, not as the spine of the manual.

For each screenshot evidence panel:

1. Include the page or component name.
2. Explain what workflow moment it supports.
3. Explain what the user should notice.
4. Explain which role sees it.
5. Explain what can be done from there.
6. Explain what has already happened before this screen appears.
7. Explain what happens next.

Do not instruct users by filesystem path. Do not use screenshots without context.

## Layout And Design Direction

Use a polished AlphaVest-style design:

1. Deep navy or near-black ink for major surfaces and chapter openers.
2. Ivory or off-white paper background for long reading pages.
3. Muted champagne or gold accents for hierarchy, dividers, and key states.
4. Cool neutral greys for structure.
5. Restrained semantic colors for statuses.
6. No loud gradients.
7. No decorative blobs or ornamental filler.
8. No marketing landing-page composition.

The manual should feel like a premium enterprise SaaS operations document: precise, calm, clear, and useful.

## Page Geometry

Use standard readable print margins.

Required baseline:

```css
@page {
  size: A4;
  margin: 25.4mm;
}
```

You may adjust individual page types only when the reason is documented, but the document must never feel edge-to-edge, cramped, or pasted against the page border.

Use:

1. Comfortable internal spacing.
2. Readable line lengths.
3. Clear section breaks.
4. Wide enough gutters around diagrams.
5. Tables with breathing room.
6. Captions with enough separation from screenshots.
7. Page headers and footers that do not compete with content.

Avoid:

1. Full-width dense paragraphs.
2. Tiny type to force content onto fewer pages.
3. Tables that span the entire page without visual grouping.
4. Screenshot panels that touch page margins.
5. Repeating heavy chrome on every page.

## Typography

Use a system-font stack unless the project already provides a usable local brand font.

Recommended print sizing:

1. Body text: 10.5pt to 11.5pt.
2. Captions: 8.5pt to 9.5pt.
3. Tables: 8.5pt minimum unless unavoidable.
4. Section headings: materially larger than body text but not oversized.
5. Chapter openers: visually distinctive but not wasteful.

Never scale font size with viewport width. Use explicit print-oriented sizing.

## Diagram Requirements

Create at least six diagrams:

1. Full collaboration lifecycle.
2. Role relay model.
3. Recommendation to compliance to client decision swimlane.
4. Document intake and evidence lineage.
5. Tenant onboarding collaboration map.
6. Visibility and release gate model.

Use Mermaid, generated SVG, or semantic HTML/CSS diagrams. If Mermaid rendering is unreliable, use semantic HTML/CSS blocks or inline SVG. Do not rely on external network resources.

Every diagram must include a caption that explains:

1. What the diagram shows.
2. Why it matters.
3. Which manual chapters or workflow stories it supports.

## Screenshot Rules

Use screenshots from existing project assets or generated local renders only when they help explain a workflow moment.

Screenshots must:

1. Be framed with adequate padding.
2. Have captions.
3. Be tied to a workflow story or role relay.
4. Be referenced near the explanation that needs them.
5. Be legible after PDF rendering.

Screenshots must not:

1. Replace explanation.
2. Become decorative filler.
3. Be used as unlabelled page thumbnails.
4. Show design reference chrome, filenames, spec rails, or annotation panels.
5. Carry route labels as user-facing instructions.

## Data And Table Rules

Tables are allowed only when they improve scanning or comparison.

Use tables for:

1. Role permissions and responsibilities.
2. Required and optional data inputs.
3. Visibility states.
4. State transition summaries.
5. Evidence and audit triggers.

Do not use tables as the main narrative structure.

For every table, include:

1. A short purpose sentence before the table.
2. Column labels that a business user understands.
3. Enough spacing to be readable in print.
4. A short interpretation after the table.

## Technical Production Requirements

Prefer a deterministic HTML/CSS to PDF pipeline.

Recommended approach:

1. Generate structured PDF data JSON from the collaboration source package.
2. Generate an HTML source document from that JSON.
3. Generate a dedicated CSS file for print layout.
4. Render the HTML to PDF with Playwright/Chromium or an existing project-compatible renderer.
5. Copy the final HTML artifact to `output/pdf/`.
6. Render PDF pages to PNG with Poppler for visual QA.
7. Create a contact sheet for review.
8. Write a QA report.

Do not fetch external fonts, CSS, JavaScript, or images at render time. The PDF build must work offline after local project dependencies are available.

## Accessibility And Text Quality

The PDF should preserve selectable text wherever possible.

Required checks:

1. Extract text from the PDF and verify that chapter titles, workflow IDs, relay IDs, and key captions are present.
2. Ensure diagrams have nearby text explanations even if the diagram itself is not fully accessible.
3. Clearly state in the QA report whether the PDF is tagged PDF/UA. If it is not, document that limitation honestly.
4. Avoid text rendered only as images unless unavoidable for screenshots.

## Verification Requirements

Run and report:

1. `pdfinfo` or equivalent PDF metadata check.
2. Poppler page rendering to PNG.
3. Contact-sheet generation.
4. Text extraction with `pypdf`, `pdftotext`, or equivalent.
5. ASCII scan for generated source files unless the file already justifies non-ASCII.
6. Placeholder scan.
7. Route-led instruction scan.
8. Required workflow ID scan for `WS-001` through `WS-010`.
9. Required relay ID scan for `RR-001` through `RR-013`.
10. Diagram count verification.
11. Screenshot evidence panel verification.
12. Visual inspection of at least cover, table of contents, one story chapter, one swimlane, one matrix/atlas page, and final appendix page.

If script or app code is introduced or modified, also run available project checks such as:

1. `pnpm typecheck`
2. `pnpm lint`
3. Any existing PDF or artifact generation command relevant to this output.

## QA Report Requirements

Write `docs/v3/user-manual-pdf/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_PDF_QA_REPORT_V3.md`.

Include:

1. Inputs used.
2. Outputs produced.
3. Production command or script.
4. Page count.
5. Rendered-page artifact locations.
6. Contact sheet location.
7. Verification commands and results.
8. Visual QA notes.
9. Known limitations.
10. PDF/UA tagging status.
11. Any source gaps or assumptions.

## Engine Execution Requirements

Use V2 for structured solution design:

1. Discover: read the source package and existing PDF production artifacts.
2. Define: decide the narrative architecture and layout system.
3. Develop: produce the HTML/CSS/JSON/PDF pipeline.
4. Deliver: verify, document, and report.

Use V3 proof discipline:

1. Evidence before claims.
2. No unverified assumptions about implemented app behavior.
3. Branch between layout alternatives only when materially useful.
4. Kill weak layout approaches explicitly in the QA notes if they were considered.
5. End with proof paths and residual limitations.

## Acceptance Criteria

The work is complete only when:

1. The PDF exists at `output/pdf/alphavest-wealthos-collaborative-workflow-manual-v3.pdf`.
2. The PDF is visually readable with standard margins and adequate whitespace.
3. The manual is story-led and collaboration-led.
4. All `WS-001` through `WS-010` stories are represented.
5. All `RR-001` through `RR-013` role relays are represented.
6. At least six diagrams are present.
7. Screenshots are contextual evidence panels, not the main structure.
8. The visibility, compliance release, evidence, audit, and state-transition concepts are explained in business context.
9. The contact sheet exists and supports visual review.
10. The QA report honestly documents verification and limitations.
11. The final response lists changed files, outputs, commands run, and unresolved risks.

## Final Response Requirements

Respond in German unless the user asks otherwise.

Include:

1. PDF path.
2. HTML source path.
3. CSS source path.
4. Contact sheet path.
5. QA report path.
6. Verification commands run.
7. Any limitations or follow-up recommendations.

Do not claim the PDF is perfect. Claim only what has been verified.
