# AlphaVest WealthOS — Codex Handoff V3 Technical Implementation Pack

Status: `SUPERSEDED_FOR_IMPLEMENTATION`

`ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md` is now the only operative
source of truth for implementation. This V3 handoff file is retained as
historical technical reference only and must not define task scope, phase order
or execution authority for the First Build.

Date: 2026-06-14

This pack was a repository-ready handoff for implementing AlphaVest WealthOS with Codex.

It contains:

- repository agent instructions (`AGENTS.md`),
- a master Codex task model,
- phase start prompts,
- detailed Codex implementation tasks,
- technical implementation sequence,
- workflow definitions,
- user-flow definitions,
- data model references,
- screen catalogue and page specs,
- visual design references for all 63 pages,
- strict design interpretation rules,
- quality gates and tests.

## Mandatory implementation stack

```text
Next.js / React / TypeScript
Tailwind CSS
PostgreSQL
Prisma ORM
Docker Compose
Playwright for E2E / smoke testing
Vitest or equivalent for unit/service tests
```

## Most important implementation rule

The visual references are mandatory design references, but they are **not pixel-perfect layout contracts**.

Codex must:

1. implement the AlphaVest style strictly,
2. implement the screens and UI states directly referenced in this pack,
3. normalize spacing, sizing, grid, typography and component geometry into a homogeneous design system,
4. avoid UI jumping between screens,
5. never copy visual annotations or internal reference text into the product UI unless it is natural in-app copy.

## Historical Start Here

For First Build work, do not use `PHASE_TO_RUN`. Use the allowed task IDs and
phase order in `ALPHAVEST_MVP_FIRST_BUILD_IMPLEMENTATION_HANDOFF.md`.

## Reference folders

```text
public/reference/page_ui_v3/clean_pages/       # 63 clean page UI references
public/reference/page_ui_v3/contact_sheets/    # visual overview sheets
```

## Key docs

```text
docs/v3/SCREEN_CATALOGUE_V3.md
docs/v3/CODEX_TASKS_DETAILED_V3.md
docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md
docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md
docs/v3/DATA_MODEL_V3.md
```
