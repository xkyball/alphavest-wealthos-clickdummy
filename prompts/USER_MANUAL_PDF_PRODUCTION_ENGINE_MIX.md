Max

# AlphaVest User Manual PDF Production Prompt

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Transform the existing AlphaVest WealthOS English user manual package into a polished, premium, print-ready PDF in an AlphaVest visual style.

The PDF is the primary output. A maintainable HTML/CSS or document-source artifact should be created as the production source for the PDF unless a better repository-native pipeline already exists. The result must look like a serious enterprise wealth-operations manual, not like raw Markdown printed to PDF.

This is a document production and visual QA task, not a product implementation task. Do not change application behavior. Do not invent product functionality. Preserve all demo/prototype limitations and compliance boundaries from the source manual.

## Repository

`/Users/chris/projects/alphavest-wealthos-clickdummy`

## Primary Inputs

Read these first:

- `AGENTS.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/user-manual/README.md`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.md`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_SCREENSHOT_INDEX_V3.md`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_TRACEABILITY_V3.md`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_QA_REPORT_V3.md`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`
- `docs/v3/user-manual-source/user-manual-source.v3.json`

Also inspect the screenshot assets referenced by the manual:

- `artifacts/user-manual-source/20260616-232649Z/screenshots/`
- `public/reference/page_ui_v3/clean_pages/`

## PDF Skill

Use the local `pdf` skill workflow:

- Create PDFs programmatically with reliable formatting.
- Render final PDF pages to PNG for visual review.
- Use Poppler tools such as `pdfinfo` and `pdftoppm` where available.
- Use `pdfplumber`, `pypdf`, or equivalent for text and metadata checks.
- Do not deliver until rendered pages show no obvious layout defects.

Prefer bundled workspace dependencies when available. If dependency discovery is useful, call `load_workspace_dependencies`.

## Recommended Production Pipeline

Use this pipeline unless the repository already has a better documented PDF system:

1. Create a maintainable print source:
   - preferred: `docs/v3/user-manual-pdf/source/alphavest-user-manual-v3.html`
   - stylesheet: `docs/v3/user-manual-pdf/source/alphavest-user-manual-v3.css`
   - optional data source: `docs/v3/user-manual-pdf/source/manual-pdf-data.json`
2. Generate the PDF:
   - preferred: Playwright/Chromium `page.pdf()` from the HTML source if available and stable.
   - fallback: Python `reportlab` if browser PDF generation is unavailable.
3. Write final PDF to:
   - `output/pdf/alphavest-wealthos-user-manual-v3.pdf`
4. Render QA PNGs to:
   - `output/pdf/rendered/alphavest-wealthos-user-manual-v3-page-*.png`
5. Create a contact sheet or sampled preview if useful:
   - `output/pdf/rendered/alphavest-wealthos-user-manual-v3-contact-sheet.png`
6. Create a QA report:
   - `docs/v3/user-manual-pdf/ALPHAVEST_USER_MANUAL_PDF_QA_REPORT_V3.md`

If the chosen pipeline differs, document why in the QA report.

## Online PDF And Accessibility Baseline

Use these external principles as production constraints. Do not over-quote them.

Sources checked:

- W3C, PDF Techniques for WCAG: https://www.w3.org/TR/2014/NOTE-WCAG20-TECHS-20140311/pdf.html
- W3C, WCAG 2.1: https://www.w3.org/TR/WCAG21/
- Adobe, Create and verify PDF accessibility: https://helpx.adobe.com/acrobat/using/create-verify-pdf-accessibility.html
- Adobe, Reading Order tool for PDFs: https://helpx.adobe.com/acrobat/using/touch-reading-order-tool-pdfs.html
- PDF Association, Tagged PDF Best Practice Guide: https://pdfa.org/resource/tagged-pdf-best-practice-guide-syntax/
- Section508.gov, Common PDF Tags and Their Usage: https://www.section508.gov/create/pdfs/common-tags-and-usage/
- WebAIM, Defining PDF Accessibility: https://webaim.org/techniques/acrobat/
- Nielsen Norman Group, Avoid PDF for On-Screen Reading: https://www.nngroup.com/articles/avoid-pdf-for-on-screen-reading/
- Nielsen Norman Group, Legibility, Readability, and Comprehension: https://www.nngroup.com/articles/legibility-readability-comprehension/

Derived rules:

1. PDF is best for a stable, printable, branded manual; provide a maintainable source artifact for future updates.
2. Use real selectable text, not screenshots of text.
3. Preserve logical reading order.
4. Use hierarchical headings.
5. Provide PDF metadata: title, author/publisher if appropriate, subject, language.
6. Add bookmarks/outlines if the generator supports them.
7. Include alt text in the source for meaningful screenshots.
8. Keep tables readable and avoid using tables for decorative layout.
9. Use sufficient contrast and generous spacing for long-form reading.
10. Use headers, footers, page numbers, and section landmarks.
11. Do not claim PDF/UA certification unless a proper validator confirms it.
12. Because PDFs are weaker for online reading, optionally produce an HTML companion or keep the HTML source clean enough to publish later.

## AlphaVest Visual Direction

Follow the AlphaVest design lock from `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`:

- deep navy / midnight / charcoal base,
- ivory typography,
- champagne-gold highlights,
- clean enterprise cards,
- subtle dividers,
- premium but usable enterprise SaaS feel.

Adapt this for print/PDF:

- Use a dark premium cover and section divider pages.
- Use a mostly light or ivory body page background for readability and ink-friendly printing, unless a dark page genuinely improves a section.
- Use AlphaVest navy for headers, running footers, table headers, and section accents.
- Use champagne-gold sparingly for hierarchy, page rules, callout accents, and key gate labels.
- Keep body text highly legible.
- Avoid visual clutter, heavy gradients, decorative blobs, or low-contrast text.
- Keep screenshots framed consistently with a subtle border, caption, screenshot ID, and role/state context.

Suggested visual tokens:

- Page size: A4 by default; use US Letter only if repository/user context requires it.
- Margins: generous enough for print binding and readable tables.
- Body type: 9.5-11 pt equivalent.
- Line height: 1.35-1.55.
- Heading hierarchy: H1, H2, H3 visibly distinct but restrained.
- Tables: compact, zebra or divider-based, no cramped columns.
- Callouts:
  - Safety / compliance gate
  - Demo limitation
  - Evidence / audit note
  - Blocked state
  - Result

## Content Transformation Rules

The source manual is already editorially approved. Do not rewrite it into a different product story. Transform it into a more polished PDF structure:

1. Cover
2. Document metadata page
3. Table of contents
4. How to use this manual
5. Demo boundaries and safety principles
6. Roles and core concepts
7. Getting started
8. Task chapters MT-001 through MT-014
9. Workflow reference
10. Field and data reference
11. Troubleshooting and blocked states
12. Screenshot index summary
13. Implementation status notes
14. Source and QA appendix

For each task chapter, preserve:

- task ID,
- task title,
- who can do it,
- before you start,
- required information,
- screenshot,
- numbered procedure,
- result,
- blocked-state guidance,
- implementation note.

You may improve layout, headings, captions, callouts, and table formatting, but do not remove safety constraints or implementation caveats.

## Screenshot Rules

Use the 14 successful live task screenshots as the primary manual images.

For each screenshot:

- verify the source file exists,
- avoid upscaling until blurry,
- keep aspect ratio,
- crop only if it improves readability and does not remove required UI context,
- place near the related task,
- include a caption and screenshot ID,
- include alt text in the HTML/source,
- avoid using failed capture images from `20260616-232615Z`.

If screenshots are too large for a single page, scale them consistently and place captions below. Do not let screenshots overlap text, page margins, headers, or footers.

## Document Design Requirements

The PDF must include:

- a strong AlphaVest-style cover,
- clear title: `AlphaVest WealthOS User Manual V3`,
- version/date/source note,
- table of contents,
- running header or footer,
- page numbers,
- section divider treatment,
- task chapter cards or structured task blocks,
- consistent screenshot frames,
- polished tables for roles, workflows, fields, and troubleshooting,
- callout boxes for compliance gates and demo limitations,
- appendix section for QA/source traceability,
- final page or appendix note with generated artifacts and validation results.

Do not use excessive decoration. This is a premium enterprise manual, not a marketing brochure.

## Accessibility And Technical Requirements

Best effort accessibility is required:

- selectable text,
- document title and language metadata,
- logical heading hierarchy,
- meaningful image alt text in the source,
- visible captions for screenshots,
- readable contrast,
- no text embedded only in images except actual UI screenshots,
- tables with clear headers,
- no overlapping or clipped text,
- no hidden placeholder text,
- no broken image icons,
- no tool-token leftovers,
- no route paths as user-facing navigation instructions.

If the final generator cannot create a fully tagged PDF, state that honestly in the QA report. Do not claim PDF/UA or WCAG conformance without a proper validator.

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v3 as the proof/QA wrapper:

- P0 Mission Card
- P1 Evidence Intake
- P2 Content and Layout Architecture
- P3 Visual Design Architecture
- P4 Requirements/Gate Architecture
- P5 PDF Production Plan
- P6 Build
- P7 Render Integration Pass
- P8 Verification
- P9 Visual QA
- P10 Revision/Hardening
- P11 Final Assembly
- P12 Final Proof

Use ENGINE_v2 as the design and production stack:

- Double Diamond
- Psycho-Logic + Map/Model
- Reframing Matrix
- TRIZ
- SIT Closed World
- Morphological Analysis / Zwicky Box + CCA
- SCAMPER
- Harvard / BATNA
- MESOs
- Measurement Plan
- Ethics & Fairness

Internal Engine artifacts should go into the PDF QA report, not into the user-facing PDF unless they are directly useful to the reader.

## Deliverables

Create or update:

1. `docs/v3/user-manual-pdf/README.md`
   - Overview of the PDF production package.
2. `docs/v3/user-manual-pdf/source/alphavest-user-manual-v3.html`
   - Maintainable PDF source.
3. `docs/v3/user-manual-pdf/source/alphavest-user-manual-v3.css`
   - Print stylesheet / AlphaVest PDF design system.
4. `docs/v3/user-manual-pdf/ALPHAVEST_USER_MANUAL_PDF_QA_REPORT_V3.md`
   - Production decisions, online baseline, checks, limitations, render QA, method compliance.
5. `output/pdf/alphavest-wealthos-user-manual-v3.pdf`
   - Final PDF.
6. `output/pdf/rendered/`
   - Rendered PNG pages or sampled render evidence.
7. Optional but recommended:
   - `docs/v3/user-manual-pdf/source/manual-pdf-data.json`
   - `output/pdf/alphavest-wealthos-user-manual-v3.html`
   - `output/pdf/rendered/alphavest-wealthos-user-manual-v3-contact-sheet.png`

Do not delete or overwrite `docs/v3/user-manual/` or `docs/v3/user-manual-source/`.

## Verification Requirements

Before final response, run all checks that are available:

1. Source checks:
   - parse `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`,
   - verify all 14 task IDs appear in the PDF source,
   - verify all referenced screenshot files exist,
   - verify failed capture screenshots are not used.
2. PDF generation checks:
   - create final PDF without errors,
   - run `pdfinfo` if available,
   - extract text with `pdftotext`, `pdfplumber`, or `pypdf`,
   - verify extracted text includes title and all 14 task IDs.
3. Visual render checks:
   - render PDF pages to PNG,
   - inspect first page, table-of-contents area, one early task page, one screenshot-heavy task page, one table/reference page, and final/appendix page,
   - confirm no clipping, overlap, unreadable text, broken images, black boxes, huge blank gaps, or page-number/header collisions.
4. Repository checks:
   - `pnpm typecheck`
   - `pnpm lint`
   - other relevant checks only if the PDF pipeline touches app code.

If any check cannot run because a dependency is missing, record the missing dependency and the fallback used.

## Acceptance Criteria

The output is acceptable only if:

- final PDF exists,
- PDF opens and renders,
- rendered pages look polished,
- design resembles AlphaVest without sacrificing readability,
- all 14 manual tasks are present,
- all 14 live task screenshots are either included or explicitly excluded with a reason,
- screenshot paths resolve,
- no failed capture is presented as successful,
- user-facing content remains UI-led and not route-led,
- demo/prototype limitations remain visible,
- advisor approval and compliance release remain distinct,
- no product behavior is invented,
- PDF QA report documents checks and limitations.

## Final Response Format

Return a concise summary with:

- PDF path,
- source files created,
- page count,
- screenshot count,
- task coverage,
- checks run,
- visual QA result,
- unresolved limitations,
- recommended next step.

End with a Method Compliance Checklist and honest limitations because this is an Engine run.
