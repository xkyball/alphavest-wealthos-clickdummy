# CODEX_TASK_MASTER_V2 — AlphaVest WealthOS

## Mission

You are working in the existing AlphaVest WealthOS repository. Phase 1–3 are already implemented.

The phase model has changed. The next phase is:

> **Phase 4 — UX Model Refactor and Visual Alignment**

Do not continue with the old phase plan.

## Core product rule

> **No unapproved advice reaches the client.**

## Phase 4 objective

Audit the existing Phase 1–3 implementation, read v2 docs and visual assets, create a delta analysis, create a refactor plan, and refactor the foundation so future phases can be implemented from a correct UX and workflow model.

## Source of truth

Read in this order:

1. `AGENTS.md`
2. `CODEX_TASK_MASTER_V2.md`
3. `docs/v2/VISUAL_INTERPRETATION_RULES_V2.md`
4. `docs/v2/PAGE_VISUAL_INVENTORY_V2.md`
5. `docs/v2/VISUAL_ASSET_MANIFEST_V2.md`
6. `docs/v2/SCREEN_SPECS_V2.md`
7. `docs/v2/SCREEN_STATE_INVENTORY_V2.md`
8. `docs/v2/PERMISSION_MATRIX_V2.md`
9. `docs/v2/SERVICE_BLUEPRINT_V2.md`
10. `docs/v2/STATE_MACHINES_V2.md`
11. `docs/v2/EVIDENCE_AUDIT_MAPPING_V2.md`
12. `docs/v2/QUALITY_GATES_V2.md`
13. `docs/v2/TEST_PLAN_V2.md`
14. Visuals in `public/reference/visuals_v2/`
15. Board context in `public/reference/wireframes_v2_boards/`
16. Historical references in `public/reference/wireframes_v1/`

## Critical visual rule

Do **not** recreate entire visual images as HTML/CSS.

Visuals include annotations and spec areas. Only the actual app UI region should become application UI. Surrounding notes must be translated into logic, data model, tests, docs or comments.

Some visuals are fully reference-only and should not become ordinary screens unless explicitly requested.

## Required first outputs

Before making code changes, produce:

```text
docs/v2/EXISTING_PHASE_1_3_AUDIT.md
docs/v2/DELTA_ANALYSIS_V2.md
docs/v2/REFACTOR_PLAN_V2.md
```

## Phase 4 implementation rules

- Preserve existing working infrastructure.
- Preserve useful design tokens and components.
- Refactor screens that conflict with v2.
- Replace product-board-style screens with real route/screen/state logic.
- Add missing loading/empty/error/blocked states for P0 routes where feasible.
- Centralise permission helper logic.
- Centralise state machine/status logic.
- Centralise evidence/audit event helpers.
- Enforce No-Unapproved-Advice Gate.
- Do not build Phase 5 features yet.
- Do not delete code blindly.

## Quality gates

Follow `docs/v2/QUALITY_GATES_V2.md`.

## Test plan

Follow `docs/v2/TEST_PLAN_V2.md`.

## Expected Phase 4 final output

At the end of Phase 4, produce:

```text
docs/v2/PHASE_4_QA_REPORT.md
```

The QA report must include:

- changed files;
- tests run;
- build/lint/test result;
- unresolved issues;
- route-to-visual mapping status;
- permission gate status;
- no-unapproved-advice gate status;
- evidence/audit status;
- recommendation for Phase 5 readiness.

## Commit strategy

If commits are supported, use small commits. Recommended commit message:

```text
Phase 4: refactor to v2 UX model and visual inventory
```
