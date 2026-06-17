# AlphaVest Visual Process Explanation Manual Prompt

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Rebuild the AlphaVest WealthOS user manual explanation model from the ground up.

The last PDF variant failed because it still treated tables, raw screenshots, and generic cards as the primary explanation mechanism. That is not how a complex application workflow manual should work.

Create a new English manual production package that explains AlphaVest workflows through:

1. Process graphics.
2. Role swimlanes.
3. State-transition visuals.
4. Annotated screenshots with numbered callouts.
5. Short, task-focused explanations tied directly to the process graphic and screenshot.
6. Clear "what changed in the system" and "what another role sees next" explanations.

Tables are allowed only as secondary checklists or appendices. They must not be the main explanatory structure.

## Online Research Basis

Use these documentation principles as mandatory design input:

1. NN/g help and documentation guidance: help should be task-focused, concrete, searchable, and not too large. Source: `https://www.nngroup.com/articles/help-and-documentation/`
2. Microsoft procedure guidance: complex tasks may need pictures, illustrations, videos, or numbered procedures with supporting visuals. Source: `https://learn.microsoft.com/en-us/style-guide/procedures-instructions/`
3. Atlassian process documentation guidance: process documentation records exact workflow steps and may use checklists or flowcharts. Source: `https://www.atlassian.com/work-management/knowledge-sharing/documentation/process-documentation`
4. Asana process documentation guidance: screenshots, diagrams, and flowcharts make complex multi-step procedures easier to understand. Source: `https://asana.com/resources/process-documentation`
5. TechSmith workflow documentation guidance: visual documentation such as screenshots, screen recordings, and walkthroughs helps create clear, scalable workflow documentation. Source: `https://www.techsmith.com/blog/best-ways-to-document-workflows/`
6. ScreenSteps end-user documentation guidance: useful end-user documentation often uses annotated screenshots, arrows, circles, or numbered sequences to remove ambiguity. Source: `https://blog.screensteps.com/10-examples-of-great-end-user-documentation`
7. Ritza screenshot guidance: combine text with screenshots, place text before the screenshot, use focused callouts, avoid too many annotations, and keep annotation style consistent. Source: `https://styleguide.ritza.co/screenshots/screenshot-guidelines-for-technical-documentation/`

## Core Design Principle

Every major manual section must answer this sequence:

1. What process is this?
2. Why does the process exist?
3. Which roles participate?
4. What object moves through the process?
5. Which state changes occur?
6. Which visibility boundary changes?
7. Which UI screen supports each process moment?
8. Where exactly in the screenshot does the user act or inspect?
9. What evidence or audit record is created?
10. What becomes possible for the next role?

If a section cannot answer these questions, it is not ready for the manual.

## Primary Source Inputs

Use these as the primary source package:

1. `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json`
2. `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.md`
3. `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_QA_REPORT_V3.md`
4. `docs/v3/user-manual-collaboration/README.md`
5. `docs/v3/user-manual-source/user-manual-source.v3.json`
6. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json`
7. `artifacts/user-manual-source/20260616-232649Z/screenshots/`

Use these for product grounding:

1. `CODEX_MASTER_TASK.md`
2. `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
3. `docs/v3/DATA_MODEL_V3.md`
4. `docs/v3/SCREEN_CATALOGUE_V3.md`
5. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
6. `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`

Use the existing generated PDFs only as negative examples:

1. `output/pdf/alphavest-wealthos-user-manual-v3.pdf`
2. `output/pdf/alphavest-wealthos-contextual-user-manual-v3.pdf`
3. `output/pdf/alphavest-wealthos-collaborative-workflow-manual-v3.pdf`

Do not copy their explanation model.

## Required New Deliverables

Create a new visual-process manual package:

1. `docs/v3/user-manual-visual-process/README.md`
2. `docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.md`
3. `docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_BLUEPRINT_V3.json`
4. `docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_QA_REPORT_V3.md`
5. `docs/v3/user-manual-visual-process/annotated-screenshots/*.png`
6. `docs/v3/user-manual-visual-process/process-graphics/*.svg`
7. `docs/v3/user-manual-visual-process/process-graphics/*.png`

If producing a PDF in the same run is appropriate, create:

1. `docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v3.html`
2. `docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v3.css`
3. `docs/v3/user-manual-pdf/source/visual-process-manual-pdf-data.json`
4. `output/pdf/alphavest-wealthos-visual-process-manual-v3.pdf`
5. `output/pdf/rendered/visual-process/alphavest-visual-process-manual-v3-page-*.png`
6. `output/pdf/rendered/visual-process/alphavest-visual-process-manual-v3-contact-sheet.png`
7. `docs/v3/user-manual-pdf/ALPHAVEST_VISUAL_PROCESS_MANUAL_PDF_QA_REPORT_V3.md`

## Manual Architecture

Do not structure the manual around routes, raw screenshots, tables, or data rows.

Structure it around process modules.

Each process module must have:

1. Process title.
2. One-sentence outcome.
3. Business reason.
4. Roles and responsibilities.
5. Process graphic.
6. Annotated screenshot set.
7. Step-by-step explanation tied to callout numbers.
8. State and visibility changes.
9. Evidence and audit implications.
10. Next-role handoff.
11. Edge cases and recovery.
12. Demo boundary.

## Required Process Modules

Create one module for each of these workflows:

1. WS-001 Tenant becomes operational.
2. WS-002 Client profile becomes usable shared family context.
3. WS-003 Document chaos becomes verified evidence.
4. WS-004 Signal becomes reviewed recommendation candidate.
5. WS-005 Advisor-approved package becomes compliance-controlled client visibility.
6. WS-006 Client decision becomes evidence and review cadence.
7. WS-007 Governance change becomes permission-safe access.
8. WS-008 Communication escalation becomes recorded service context.
9. WS-009 Export request becomes redacted, approved, auditable package.
10. WS-010 Ops monitoring turns workflow friction into service and product improvement.

## Process Graphic Requirements

For each workflow, create a process graphic before writing the procedure text.

The process graphic must show:

1. Start trigger.
2. Role lanes.
3. UI screen or system surface per step.
4. Data object moving through the process.
5. Decision point.
6. State transition.
7. Visibility boundary.
8. Evidence or audit creation.
9. End state.
10. Next process enabled.

Use a consistent visual grammar:

1. Rounded rectangle: task/action.
2. Diamond: decision or gate.
3. Document shape or labeled card: data/evidence object.
4. Lock/gate marker: permission, compliance, privacy, or security boundary.
5. Eye marker: visibility change.
6. Numbered marker: corresponding screenshot callout.
7. Dashed line: future or demo-boundary behavior.
8. Solid line: current documented workflow path.

Each process graphic must have a short caption:

1. What the graphic shows.
2. Why the graphic matters.
3. Which screenshots/callouts correspond to it.

## Annotated Screenshot Requirements

Create new annotated screenshot assets. Do not use raw screenshots alone.

For each process module:

1. Use 1 to 3 screenshots only.
2. Each screenshot must include numbered callouts.
3. Each callout number must correspond to a process step.
4. Use rectangles to outline the relevant UI region.
5. Use arrows only when the target region is small or ambiguous.
6. Use no more than 4 callouts per screenshot.
7. Avoid visual clutter.
8. Keep annotations consistent across the whole manual.
9. Use high-contrast but AlphaVest-compatible colors.
10. Add a caption that explains the workflow moment.

Every annotated screenshot must be accompanied by:

1. What the user should notice.
2. What the user can do here.
3. What the user cannot do here.
4. Which role sees this screen.
5. What must have happened before the screen appears.
6. What happens after the user action.

If the exact UI element cannot be confidently located in the screenshot, do not fake precision. Instead:

1. Use a broader region callout.
2. Mark the uncertainty in the source JSON.
3. Explain the limitation in the QA report.

## Step Explanation Pattern

Each numbered step must follow this exact pattern:

1. Callout number.
2. User action or inspection.
3. Why this matters.
4. Required data.
5. System state change.
6. Visibility change.
7. Evidence or audit effect.
8. What the next role sees.

Example shape:

```text
1. Review the extracted owner and entity context.
   Why: This prevents the document from becoming evidence before the family/entity relationship is confirmed.
   Data: entity, owner, source document, confidence indicator.
   State: ai_extracted -> analyst_review_pending.
   Visibility: client sees confirmation context; compliance does not treat it as releasable evidence yet.
   Evidence: extraction review becomes part of the evidence lineage after validation.
   Next role: advisor receives reviewed source context instead of raw uploaded material.
```

## Visual Page Pattern

Each process module should be built as a 2 to 4 page spread:

### Page A: Process Overview

1. Process outcome.
2. Why the workflow exists.
3. Role lanes.
4. Process graphic.
5. Legend for callout numbers.

### Page B: Annotated UI Evidence

1. Annotated screenshot.
2. Numbered callout explanations.
3. State and visibility impact.
4. Role handoff.

### Page C: Exceptions And Recovery

Only include this page when the process has meaningful exceptions.

1. What blocks the process.
2. What the user can do next.
3. What remains hidden.
4. Which role must resolve it.
5. What evidence/audit is preserved.

### Page D: Compact Reference

Only if needed.

Use a small checklist, not a dense table.

## Forbidden Structures

Do not produce:

1. A wall of tables.
2. A screenshot appendix pretending to be a manual.
3. A route catalogue.
4. Generic cards with no callout linkage.
5. A visibility matrix as the main explanation.
6. A process diagram without a screenshot next to it.
7. A screenshot without a process diagram.
8. A screenshot without numbered annotations.
9. A diagram with no corresponding explanation.
10. A PDF page where the reader cannot tell what to look at first.

## Annotation Production Instructions

Use deterministic local tooling to create annotated screenshots.

Preferred implementation options:

1. Python/Pillow overlay generation.
2. Node canvas or Sharp if already available.
3. SVG overlay composed on top of the screenshot and exported to PNG.

Do not manually edit binary screenshots.

Each annotated screenshot generation record must store:

1. Source screenshot path.
2. Output annotated screenshot path.
3. Callout coordinates.
4. Callout label.
5. Target UI region.
6. Related workflow ID.
7. Related process step.
8. Confidence level.

Write the annotation specification to:

`docs/v3/user-manual-visual-process/annotated-screenshot-map.json`

## Process Graphic Production Instructions

Create process graphics as source-controlled SVG first.

For each process graphic:

1. Generate SVG.
2. Export PNG if needed for PDF rendering.
3. Store both source and rendered artifact.
4. Keep text selectable in HTML/PDF where possible.
5. Use consistent symbol language.
6. Do not rely on remote diagram services.

Write the process graphic specification to:

`docs/v3/user-manual-visual-process/process-graphic-map.json`

## Content Tone

The manual must sound like a useful human guide:

1. Direct.
2. Operational.
3. Contextual.
4. Precise.
5. Calm.
6. Business-readable.

Avoid:

1. Consultant abstraction.
2. Compliance theater.
3. Product marketing fluff.
4. Data-model dumping.
5. Unexplained UI descriptions.

## AlphaVest Design Direction

Use a restrained AlphaVest visual language:

1. Deep navy as the primary structural color.
2. Ivory or off-white reading surfaces.
3. Muted champagne/gold accents.
4. Cool neutral greys for diagram structure.
5. Semantic but restrained status colors.
6. Strong whitespace.
7. Standard A4 print margins if PDF is generated.
8. No edge-to-edge dense content.
9. No decorative filler.
10. No one-note color palette.

## Quality Gates

The output passes only if:

1. Every workflow has a process graphic.
2. Every workflow has at least one annotated screenshot.
3. Every annotated screenshot has numbered callouts.
4. Every callout is explained in nearby text.
5. Every process graphic has corresponding callout references.
6. No workflow explanation depends primarily on a table.
7. No raw screenshot appears without annotation.
8. No route path is used as a user instruction.
9. WS-001 through WS-010 are all present.
10. RR-001 through RR-013 are represented where role handoffs are explained.
11. State changes are explained in human terms.
12. Visibility changes are explained in human terms.
13. Evidence/audit implications are explained in human terms.
14. Demo boundaries are explicit.
15. Visual QA confirms that margins, callouts, captions, and process graphics are readable.

## Verification Requirements

Run and report:

1. Source artifact existence checks.
2. Annotation JSON schema/check consistency.
3. Process graphic JSON schema/check consistency.
4. Count of workflow modules.
5. Count of process graphics.
6. Count of annotated screenshots.
7. Count of callouts.
8. Check that each callout has nearby explanatory text.
9. Check that no raw screenshot is embedded without annotation.
10. Placeholder scan.
11. Route-led instruction scan.
12. PDF render check if a PDF is generated.
13. Contact sheet if a PDF is generated.
14. Visual inspection notes for at least three workflows and the final appendix.

If code is introduced or modified, run:

1. `pnpm typecheck`
2. `pnpm lint`

## QA Report Requirements

Create:

`docs/v3/user-manual-visual-process/ALPHAVEST_VISUAL_PROCESS_MANUAL_QA_REPORT_V3.md`

If a PDF is generated, also create:

`docs/v3/user-manual-pdf/ALPHAVEST_VISUAL_PROCESS_MANUAL_PDF_QA_REPORT_V3.md`

The QA report must include:

1. Online research principles applied.
2. Source inputs.
3. Generated process graphics.
4. Generated annotated screenshots.
5. Workflow coverage table.
6. Callout coverage table.
7. Visual inspection findings.
8. Rejected weak approaches.
9. Known limitations.
10. Commands run.

## Rejected Weak Approaches

Explicitly reject these in the QA report if they appear during execution:

1. Table-led manual.
2. Screenshot-only manual.
3. Route-led manual.
4. Generic diagram-only manual.
5. Dense visibility matrix as the main explanation.
6. Unannotated screenshot evidence.
7. Decorative process graphics that do not map to UI evidence.

## Final Response Requirements

Respond in German.

Include:

1. Created prompt/source artifact paths.
2. If executed, PDF path and contact sheet path.
3. Annotated screenshot directory.
4. Process graphic directory.
5. QA report path.
6. Verification commands run.
7. Honest limitations.

Do not claim that the manual has high explanatory value unless the process graphics, annotations, and callout-to-text links have actually been generated and inspected.
