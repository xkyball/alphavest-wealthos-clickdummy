Max

# AlphaVest Contextual User Manual PDF Production Prompt

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Produce a polished, premium, print-ready PDF version of the AlphaVest WealthOS user manual that includes the new contextual explanation layer.

This PDF must not merely present tasks and screenshots. It must help the reader understand why each workflow exists, what each action protects, what becomes possible later, and where the current demo/prototype boundary remains. The final result should feel like a serious enterprise wealth-operations manual in an AlphaVest visual style: elegant, restrained, readable, evidence-aware, and compliance-conscious.

The PDF is the primary output. A maintainable HTML/CSS or equivalent source artifact must be created so the manual can be regenerated later.

This is a document production, layout, and QA task. Do not change application behavior. Do not invent functionality. Do not weaken compliance, evidence, audit, permission, redaction, role, tenant, or client-visibility constraints.

## Repository

`/Users/chris/projects/alphavest-wealthos-clickdummy`

## Source Priority

Read these first:

1. `AGENTS.md`
2. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
3. `docs/v3/user-manual-context/README.md`
4. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.md`
5. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json`
6. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXT_INTEGRATION_BRIEF_V3.md`
7. `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXT_QA_REPORT_V3.md`
8. `docs/v3/user-manual/README.md`
9. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.md`
10. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`
11. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_SCREENSHOT_INDEX_V3.md`
12. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_TRACEABILITY_V3.md`
13. `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_QA_REPORT_V3.md`
14. `docs/v3/user-manual-source/user-manual-source.v3.json`
15. `docs/v3/user-manual-source/UI_REALITY_CHECK_V3.md`

Also inspect screenshot assets:

- `artifacts/user-manual-source/20260616-232649Z/screenshots/`
- `public/reference/page_ui_v3/clean_pages/`

If the existing `docs/v3/user-manual/` package has not yet been regenerated with the contextual package, use the existing manual as the structural backbone and use `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json` as the explanation backbone. Do not wait for another manual-generation pass unless the user explicitly asks you to stop.

## PDF Skill And Tooling

Use the local `pdf` skill workflow:

- Create PDFs programmatically with reliable formatting.
- Render final PDF pages to PNG for visual review.
- Use Poppler tools such as `pdfinfo` and `pdftoppm` where available.
- Use `pdfplumber`, `pypdf`, or equivalent for text and metadata checks.
- Do not deliver until rendered pages show no obvious layout defects.

Prefer bundled workspace dependencies. If useful, call `load_workspace_dependencies`.

Recommended pipeline:

1. Create a maintainable print source:
   - `docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.html`
   - `docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.css`
   - `docs/v3/user-manual-pdf/source/contextual-manual-pdf-data.json`
2. Generate the PDF:
   - preferred: Playwright/Chromium `page.pdf()` from the HTML source.
   - fallback: Python `reportlab` only if browser PDF generation is unavailable.
3. Write final PDF to:
   - `output/pdf/alphavest-wealthos-contextual-user-manual-v3.pdf`
4. Render QA PNGs to:
   - `output/pdf/rendered/contextual/alphavest-contextual-user-manual-v3-page-*.png`
5. Create a sampled contact sheet:
   - `output/pdf/rendered/contextual/alphavest-contextual-user-manual-v3-contact-sheet.png`
6. Create or update:
   - `docs/v3/user-manual-pdf/ALPHAVEST_CONTEXTUAL_USER_MANUAL_PDF_QA_REPORT_V3.md`
   - `docs/v3/user-manual-pdf/README.md`

If you choose a different pipeline, document why in the QA report.

## Design Direction

Follow the AlphaVest design lock:

- deep navy / midnight / charcoal foundation,
- ivory paper surfaces for body pages,
- champagne-gold accents,
- clean enterprise tables,
- subtle dividers,
- restrained cards,
- clear typographic hierarchy,
- premium but usable wealth-operations feel.

The PDF must look more like a refined enterprise operating manual than a raw export. It should be elegant, but never decorative at the cost of comprehension.

Use this design structure unless a better layout emerges during render QA:

1. Dark premium cover.
2. Document metadata page.
3. Table of contents.
4. How to use this manual.
5. AlphaVest operating model:
   - demo-data-first,
   - human-reviewed,
   - evidence-backed,
   - compliance-controlled client visibility.
6. Roles and core concepts.
7. Contextual task chapters MT-001 through MT-014.
8. Workflow reference.
9. Field and data rationale reference.
10. Evidence, audit, release, redaction, and governance reference.
11. Troubleshooting and blocked-state controls.
12. Screenshot index summary.
13. Implementation and demo-boundary notes.
14. Source and QA appendix.

## Contextual Layout Rules

The contextual layer is the reason for this prompt. Use it deliberately.

For each task chapter, include:

- task ID,
- task title,
- role context,
- "Why this task exists",
- "Why now",
- "What the user is trying to achieve",
- screenshot and caption,
- concise procedure,
- result,
- "What this unlocks",
- field rationale,
- gate/control rationale,
- blocked-state rationale,
- future-readiness note,
- demo-boundary note,
- reader takeaway.

Do not paste every context field blindly. Select and lay out the context so the task remains readable. Use the JSON as a source of structured truth and the Markdown narrative for editorial phrasing.

Preferred task chapter layout:

1. **Task opener**
   - task ID, workflow/pageflow IDs, title,
   - role context,
   - short purpose paragraph.
2. **Why this matters**
   - 2-4 sentences derived from `whyThisTaskExists`, `whyNow`, and `whatTheUserIsTryingToAchieve`.
3. **Live screen reference**
   - screenshot,
   - caption,
   - screenshot ID.
4. **Procedure**
   - numbered steps,
   - concise wording,
   - no route paths as user-facing instructions.
5. **Result and what this unlocks**
   - expected result,
   - 2-4 bullets from `whatThisEnablesNext`.
6. **Controls and blocked states**
   - one compact control rationale callout,
   - blocked-state next legitimate action.
7. **Demo boundary**
   - 1-2 sentences from `demoBoundaryNote`.
8. **Reader takeaway**
   - one sentence.

## Context Callout Types

Use a small set of visually consistent callouts:

- Context note:
  - purpose: why the task is here.
  - color: ivory or pale gold with navy text.
- Control rationale:
  - purpose: gate, blocked state, permission, evidence, audit, redaction, second confirmation, compliance release.
  - color: subtle red/burgundy accent only where a real control is being explained.
- Evidence and audit note:
  - purpose: proof, traceability, audit lineage.
  - color: muted green or champagne accent.
- Demo boundary:
  - purpose: what the current demo does not prove.
  - color: pale blue/grey, clearly differentiated from warnings.
- Reader takeaway:
  - purpose: final mental model.
  - color: restrained navy rule or quote block.

Avoid too many callouts on one page. If a task becomes dense, move detailed field rationale into a compact table or reference appendix.

## Content Rules

Preserve these AlphaVest principles throughout:

- Digital first.
- Human reviewed.
- Evidence backed.
- Demo-data-first only.
- No real client data.
- No final financial, legal, or tax advice.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence supports important actions where completion is claimed.
- Sensitive actions create audit events where completion is claimed.
- Role, tenant, object scope, workflow state, sensitivity, and ownership affect what users can see or do.
- Blocked states are product controls, not generic errors.
- Exports must be scoped, redacted, permission-checked, approved, and audited.

Do not write:

- "This is compliant" unless a proper validator or legal/compliance source proves it.
- "This guarantees" or similar absolute claims.
- "The client can rely on this as advice."
- "This automatically..." for behavior not proven in the source.
- route paths as user-facing navigation instructions.

Use dependency-framed future language:

- "This prepares..."
- "This supports..."
- "This creates the context needed for..."
- "When production persistence is implemented, this pattern can support..."

## Screenshot Rules

Use the 14 successful live task screenshots as primary images:

- `artifacts/user-manual-source/20260616-232649Z/screenshots/`

For each screenshot:

- verify the file exists,
- avoid failed capture files from `20260616-232615Z`,
- keep aspect ratio,
- do not crop away required UI context,
- frame consistently,
- add visible caption,
- add source alt text in the HTML,
- place near the relevant task context and procedure.

Screenshots should clarify state and orientation; they should not carry the entire explanation.

## PDF And Accessibility Requirements

Best-effort accessibility is required:

- real selectable text,
- document title and language metadata,
- logical heading hierarchy,
- meaningful image alt text in HTML/source,
- visible screenshot captions,
- readable contrast,
- no text embedded only in images except actual UI screenshots,
- tables with clear headers,
- no overlapping or clipped text,
- no broken image icons,
- no tool-token leftovers,
- no hidden temporary filler text.

If the chosen generator cannot create tagged PDF, say so honestly in the QA report. Do not claim PDF/UA or WCAG conformance without a proper validator.

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v3 as the proof/QA wrapper:

- P0 Mission Card
- P1 Evidence Intake
- P2 Contextual PDF Architecture
- P3 Visual Design Architecture
- P4 Content Density and Gate Architecture
- P5 PDF Production Plan
- P6 Build
- P7 Render Integration Pass
- P8 Verification
- P9 Visual QA
- P10 Revision/Hardening
- P11 Final Assembly
- P12 Final Proof

Use ENGINE_v2 as the design and layout stack:

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

Internal Engine artifacts belong in the PDF QA report, not in the user-facing PDF unless a distilled result directly helps the reader.

## V2 Design Problem To Solve

The central contradiction:

Add the rich context layer without making the manual bloated, visually noisy, or legally/productively overclaiming.

Use the method artifacts to decide:

- which context belongs on task pages,
- which context belongs in references,
- which context belongs only in QA/source appendices,
- how many callouts a page can support,
- how to keep blocked states understandable without making the manual feel punitive.

## Deliverables

Create or update:

1. `docs/v3/user-manual-pdf/README.md`
2. `docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.html`
3. `docs/v3/user-manual-pdf/source/alphavest-contextual-user-manual-v3.css`
4. `docs/v3/user-manual-pdf/source/contextual-manual-pdf-data.json`
5. `docs/v3/user-manual-pdf/ALPHAVEST_CONTEXTUAL_USER_MANUAL_PDF_QA_REPORT_V3.md`
6. `output/pdf/alphavest-wealthos-contextual-user-manual-v3.pdf`
7. `output/pdf/alphavest-wealthos-contextual-user-manual-v3.html`
8. `output/pdf/rendered/contextual/alphavest-contextual-user-manual-v3-page-*.png`
9. `output/pdf/rendered/contextual/alphavest-contextual-user-manual-v3-contact-sheet.png`

Do not delete or overwrite:

- `docs/v3/user-manual-source/`
- `docs/v3/user-manual-context/`
- `docs/v3/user-manual/`
- the earlier non-contextual PDF unless the user explicitly asks.

## Verification Requirements

Before final response, run all available checks:

1. Source checks:
   - parse `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json`,
   - verify all 14 task IDs are present,
   - verify all 19 field-context records are present,
   - verify all task chapters include future-readiness and demo-boundary content,
   - verify all referenced screenshot files exist,
   - verify failed capture screenshots are not used.
2. PDF checks:
   - create final PDF without errors,
   - run `pdfinfo` if available,
   - extract text with `pdfplumber`, `pypdf`, `pdftotext`, or equivalent,
   - verify extracted text includes title and all 14 task IDs.
3. Visual render checks:
   - render all pages to PNG,
   - inspect cover, table of contents, early task chapter, screenshot-heavy task chapter, context-heavy task chapter, field/reference page, and appendix page,
   - create a contact sheet,
   - confirm no clipping, overlap, broken images, unreadable text, huge blank gaps, black boxes, or header/footer collisions.
4. Wording checks:
   - no user-facing imperative route-path instructions,
   - no unresolved editorial markers,
   - no product overclaims,
   - no claim of production authentication,
   - no claim of final financial/legal/tax advice,
   - advisor approval and compliance release remain distinct.
5. Repository checks:
   - `pnpm typecheck`
   - `pnpm lint`

If any check cannot run, document the missing dependency and the fallback.

## Acceptance Criteria

The output is acceptable only if:

- contextual PDF exists and renders,
- PDF source HTML/CSS exists,
- rendered PNG pages exist,
- contact sheet exists,
- all 14 tasks are present,
- all 14 successful task screenshots are included or explicitly justified if omitted,
- context modules appear near task content,
- context improves comprehension without overwhelming the page,
- task pages preserve demo boundaries,
- blocked states are explained as controls,
- all product safety rules are preserved,
- no product behavior is invented,
- QA report documents proof, checks, limitations, method artifacts, and unresolved risks.

## Final Response Format

Return a concise summary with:

- PDF path,
- source files created,
- page count,
- screenshot count,
- task and field coverage,
- checks run,
- visual QA result,
- unresolved limitations,
- recommended next action.

End with a Method Compliance Checklist and honest limitations.
