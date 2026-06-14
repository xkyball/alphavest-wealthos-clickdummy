# Visual Interpretation Rules v2

## Purpose

The v2 visual assets are implementation references, not literal screenshots to reproduce end-to-end.

Many images are **hybrid artefacts**: part application UI, part annotation board, part workflow explanation, part developer note.

Codex must interpret them carefully.

## Rule 1 — Identify the implementable UI region

For each visual, identify the region that represents actual app UI. It is usually one of:

- central desktop app frame;
- mobile phone frame;
- selected drawer;
- modal overlay;
- data table / list / kanban board;
- route content area;
- actual workflow or decision-tree component if the route is an internal tool.

## Rule 2 — Do not implement spec annotations as app UI

Do not render these inside the actual UI unless explicitly scoped as an internal reference page:

- asset ID labels;
- filename labels;
- source board labels;
- board title labels if they are outside the app frame;
- primary user / user goal metadata blocks;
- dev handoff notes;
- “key UI zones” sidebars;
- QA checklists;
- design rules;
- explanatory bottom strips;
- legend panels that are meant for designers/developers;
- annotations such as “this screen must include...”;
- visual watermark-like labels;
- “version/date/owner/status” board metadata.

Translate those into documentation, component props, state machines or tests.

## Rule 3 — Preserve functional meaning from annotations

Although annotation panels should not appear in product UI, their information must be used.

Examples:

- A visual note saying “No unapproved advice reaches the client” becomes gate logic and tests.
- A dev handoff note describing API fields becomes data-contract assumptions.
- A permission note becomes RBAC/ABAC-light helper logic.
- An evidence note becomes evidence/audit event creation.
- A state examples strip becomes empty/loading/error/blocked state coverage.

## Rule 4 — Classify images before implementation

Every visual must be classified as one of:

1. `IMPLEMENTABLE_SCREEN` — contains a route/page to implement.
2. `IMPLEMENTABLE_STATE` — contains a state variant for a route/page.
3. `IMPLEMENTABLE_COMPONENT` — drawer, modal, matrix, table, badge, chip or flow component.
4. `REFERENCE_ONLY` — architecture, service blueprint, roadmap, state-machine or mapping board.
5. `MIXED` — contains both actual UI region and reference annotations.

## Rule 5 — Reference-only visuals are still mandatory input

Reference-only visuals should inform:

- route model;
- state machines;
- permission helpers;
- evidence/audit mapping;
- no-unapproved-advice test cases;
- scope and feature flags;
- documentation.

Do not ignore them simply because they are not directly rendered.

## Rule 6 — Client-visible UI must be cleaner than reference boards

Client-facing UI should be clear, calm and minimally annotated. It must not show internal details, dev notes, compliance workpapers or board metadata.

Internal workbench/admin/compliance screens may show more operational detail, but still should not show developer-only annotations unless explicitly part of an internal reference route.

## Rule 7 — Special reference-only assets

Treat these as reference-only unless an explicit internal documentation route is requested:

- V2-043 Permission Matrix Reference Board
- V2-048 End-to-End Service Blueprint — Full Swimlane View
- V2-049 Evidence Chain View
- V2-050 Escalation / Returns View
- V2-051 Roadmap Board
- V2-052 Blocked / Not MVP Ready Features
- V2-053 Dependency Flow
- V2-054 Global State Chip / Workflow Badge Reference Board
- V2-055 State Machine Reference Board
- V2-056 Evidence / Audit Mapping Reference Board

## Rule 8 — Visual extraction checklist

For every visual, extract:

- implemented route;
- implemented component(s);
- states represented;
- actual UI area;
- annotation-derived logic;
- permission rules;
- evidence/audit obligations;
- tests to add;
- documentation to update.



## Additional rule — visuals contain non-UI specification material

Many generated visuals contain information that is intentionally placed around the actual screen mockup. Codex must classify each visual into zones before implementation:

### Implement as UI

- actual app screen layout,
- mobile frame content,
- dashboard body,
- table/list/card areas,
- drawers,
- modals,
- forms,
- state banners,
- navigation elements,
- primary/secondary actions.

### Translate into logic/docs/tests, not UI chrome

- annotation legends,
- numbered callouts,
- dev handoff notes,
- metadata tables,
- source board labels,
- filename labels,
- route labels,
- visual QA notes,
- workflow explanation sidebars,
- backstage annotations,
- evidence/audit mapping explanations,
- state-machine explanations.

### Reference-only visuals

Some visuals are not app screens. They are architectural/reference inputs. Codex should use them to update data models, permission rules, state machines, tests and docs. Do not turn them into end-user UI unless the route intentionally exposes an internal reference board.

Reference-only candidates:

- V2-043 Permission Matrix Reference Board
- V2-048 Full Service Blueprint
- V2-049 Evidence Chain View
- V2-050 Escalation / Returns View
- V2-054 State Chip / Badge Reference
- V2-055 State Machine Reference
- V2-056 Evidence / Audit Mapping Reference

If uncertain, Codex must record the interpretation in `docs/v2/DELTA_ANALYSIS_V2.md` before implementing.
