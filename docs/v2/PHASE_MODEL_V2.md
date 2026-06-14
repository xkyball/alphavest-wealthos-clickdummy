# Phase Model v2 — AlphaVest WealthOS

## Status

Phase 1–3 are assumed complete in the existing repository.

The previous future phase model is replaced by the following v2 phase model.

## Phase 4 — UX Model Refactor and Visual Alignment

### Objective

Audit the existing Phase 1–3 implementation and align it with v2 UX, visual, screen-state, permission, state-machine and evidence/audit source of truth.

### Scope

- Audit current repo.
- Read all `docs/v2/*`.
- Inspect `public/reference/visuals_v2/*`.
- Compare old implementation vs new v2 inventory.
- Create delta analysis.
- Create refactor plan.
- Refactor app shell, routes, base components, token usage, status chips, badge system, permission helpers, state machines and evidence/audit helpers.
- Implement only changes required to align the foundation with v2.

### Not scope

- Do not build Phase 5 client feature expansion.
- Do not blindly delete existing code.
- Do not recreate full visual boards as UI.

## Phase 5 — Client Experience Rebuild

Routes:

- `/mobile`
- `/mobile/upload`
- `/portal`
- `/wealth-map`
- `/actions`
- `/decisions`

Focus:

- mobile home and upload flow;
- client dashboard;
- wealth map and drawers;
- action board and blocked states;
- decision room;
- contextual evidence preview overlay.

## Phase 6 — Internal Workflow Rebuild

Routes:

- `/signals`
- `/workbench`
- `/advisor-approval`
- `/compliance`

Focus:

- analyst trigger review;
- consultant workbench;
- advisor approval;
- compliance release/block gates.

## Phase 7 — Governance / Permissions / State / Evidence

Routes / modules:

- `/governance`
- permission helper;
- second confirmation;
- permission blocked states;
- central state machines;
- evidence event model;
- audit event model;
- no-unapproved-advice gate.

## Phase 8 — Communication, Service Blueprint and Planning

Routes / modules:

- `/communication`
- `/service-blueprint` or internal reference docs;
- `/roadmap` or internal planning reference docs.

Focus:

- communication decision tree;
- call/F2F triggers;
- client-visible message preview;
- communication/evidence log;
- service blueprint logic;
- scope roadmap and dependency rules.

## Phase 9 — QA, Tests, Documentation and Demo Handoff

Focus:

- Playwright / route coverage;
- role-permission tests;
- state-transition tests;
- no-unapproved-advice tests;
- evidence/audit tests;
- visual reference QA;
- README/demo script;
- implementation report.
