# AlphaVest WealthOS User Manual PDF Package

This package contains the generated PDF production sources for the AlphaVest WealthOS demo-data-first user manual.

## Primary artifacts

- Final PDF: `output/pdf/alphavest-wealthos-user-manual-v3.pdf`
- Contextual final PDF: `output/pdf/alphavest-wealthos-contextual-user-manual-v3.pdf`
- Collaborative workflow final PDF: `output/pdf/alphavest-wealthos-collaborative-workflow-manual-v3.pdf`
- HTML print source: `docs/v3/user-manual-pdf/source/alphavest-user-manual-v3.html`
- CSS print source: `docs/v3/user-manual-pdf/source/alphavest-user-manual-v3.css`
- Structured generation data: `docs/v3/user-manual-pdf/source/manual-pdf-data.json`
- Contextual HTML print source: `docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.html`
- Contextual CSS print source: `docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.css`
- Contextual structured generation data: `docs/v3/user-manual-pdf/source/contextual-manual-pdf-data.json`
- Collaborative workflow HTML print source: `docs/v3/user-manual-pdf/source/alphavest-collaborative-workflow-manual-v3.html`
- Collaborative workflow CSS print source: `docs/v3/user-manual-pdf/source/alphavest-collaborative-workflow-manual-v3.css`
- Collaborative workflow structured generation data: `docs/v3/user-manual-pdf/source/collaborative-workflow-manual-pdf-data.json`
- Render QA pages: `output/pdf/rendered/alphavest-wealthos-user-manual-v3-page-01.png` through `output/pdf/rendered/alphavest-wealthos-user-manual-v3-page-38.png`
- Visual contact sheet: `output/pdf/rendered/alphavest-wealthos-user-manual-v3-contact-sheet.png`
- Contextual render QA pages: `output/pdf/rendered/contextual/alphavest-contextual-user-manual-v3-page-01.png` through `output/pdf/rendered/contextual/alphavest-contextual-user-manual-v3-page-56.png`
- Contextual visual contact sheet: `output/pdf/rendered/contextual/alphavest-contextual-user-manual-v3-contact-sheet.png`
- Collaborative workflow render QA pages: `output/pdf/rendered/collaborative/alphavest-collaborative-workflow-manual-v3-page-01.png` through `output/pdf/rendered/collaborative/alphavest-collaborative-workflow-manual-v3-page-55.png`
- Collaborative workflow visual contact sheet: `output/pdf/rendered/collaborative/alphavest-collaborative-workflow-manual-v3-contact-sheet.png`
- Contextual QA report: `docs/v3/user-manual-pdf/ALPHAVEST_CONTEXTUAL_USER_MANUAL_PDF_QA_REPORT_V3.md`
- Collaborative workflow QA report: `docs/v3/user-manual-pdf/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_PDF_QA_REPORT_V3.md`

## Source inputs

- Raw manual source package: `docs/v3/user-manual-source/user-manual-source.v3.json`
- State-of-art manual structure: `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`
- Contextual narrative package: `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json`
- Collaborative workflow package: `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json`
- Screenshot evidence: `artifacts/user-manual-source/20260616-232649Z/screenshots/`

## Production notes

The PDF is produced as a task-led, UI-first manual. It uses screenshots, figure IDs, roles, required data, allowed values, workflow outcomes, blocked states, and compliance/evidence guardrails rather than route-path instructions.

The contextual PDF extends this with close-to-action explanations: why each task exists, what the user is trying to achieve, which controls are being protected, what future workflow becomes possible, and where the demo boundary sits.

The collaborative workflow PDF extends this again into a role-relay and workflow-story manual. It explains how one role changes what another role can see, why compliance release controls client visibility, how evidence and audit preserve lineage, and how data chaos becomes controlled shared workflow state. Screenshots are used as contextual evidence panels rather than as the manual spine.

The visual language follows the current AlphaVest direction: deep navy, ivory paper surfaces, muted gold accents, restrained tables, task cards, and print-safe page headers and footers.

## Accessibility and format boundary

The generated PDF is text-extractable and visually verified through rendered PNG pages. It is not claimed as PDF/UA conformant because Chromium-generated output is not tagged PDF in this run. A later accessibility hardening pass should add tagged structure, reading order validation, alt text validation, bookmarks, and PDF/UA-specific checks with a dedicated validator.

The collaborative workflow PDF follows the same accessibility boundary. It includes selectable text and nearby explanations for diagrams, but it is not a tagged PDF/UA artifact.

## Visual Process V4 PDF Artifacts

- Visual process V4 PDF: `output/pdf/alphavest-wealthos-visual-process-manual-v4.pdf`
- Visual process V4 HTML source: `docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v4.html`
- Visual process V4 CSS source: `docs/v3/user-manual-pdf/source/alphavest-visual-process-manual-v4.css`
- Visual process V4 structured data: `docs/v3/user-manual-pdf/source/visual-process-manual-pdf-data-v4.json`
- Visual process V4 rendered pages: `output/pdf/rendered/visual-process-v4/`
- Visual process V4 contact sheet: `output/pdf/rendered/visual-process-v4/alphavest-visual-process-manual-v4-contact-sheet.png`
- Visual process V4 QA report: `docs/v3/user-manual-pdf/ALPHAVEST_VISUAL_PROCESS_MANUAL_PDF_QA_REPORT_V4.md`

The V4 manual is produced from the visual-process package. It preserves V3 outputs and adds a stricter PDF production proof path: process graphic plus annotated UI evidence, A4 margins, rendered-page QA, contact sheet, text extraction, and a Codex Visual Implementation Standard review.

