# AlphaVest User Manual Context Package V3

Generated: 2026-06-17T00:00:00Z

## Purpose

This package adds the missing explanatory layer for the AlphaVest WealthOS user manual. It explains why each task, field, gate, and blocked state exists; what the user is trying to achieve; what the workflow protects; and what becomes possible later when the task is completed correctly.

This is a source-enrichment package, not the final PDF and not a product implementation change.

## Primary artifacts

- `ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.md` - editorial narrative layer for manual authors.
- `ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json` - machine-readable context data keyed by task, workflow, field, gate, and blocked state.
- `ALPHAVEST_USER_MANUAL_CONTEXT_INTEGRATION_BRIEF_V3.md` - instructions for integrating the context into the next manual and PDF generation pass.
- `ALPHAVEST_USER_MANUAL_CONTEXT_QA_REPORT_V3.md` - evidence, coverage, overclaim checks, method artifacts, and proof path.

## Source inputs

- `docs/v3/user-manual-source/user-manual-source.v3.json`
- `docs/v3/user-manual-source/*.md`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.md`
- `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`
- `docs/v3/user-manual-pdf/ALPHAVEST_USER_MANUAL_PDF_QA_REPORT_V3.md`
- AlphaVest V3 source-of-truth docs listed in `AGENTS.md`

## How to use this package

1. Regenerate the state-of-art manual with this context package as an additional source.
2. Insert concise context modules near each task, screenshot, procedure, field table, gate, and blocked-state note.
3. Keep deep source traceability and Engine method artifacts out of the user-facing manual unless they directly help the reader.
4. Regenerate the PDF only after the manual package has absorbed this context layer.

Recommended next command:

`max execute prompts/USER_MANUAL_STATE_OF_ART_GENERATION_ENGINE_MIX.md`
