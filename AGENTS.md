# AlphaVest WealthOS — Agent Guidance

## Current Project Phase

Phase 1–3 are already implemented in this repository.

Current next phase:

> **Phase 4 — UX Model Refactor and Visual Alignment**

This phase replaces the previously assumed continuation plan. Do not continue with the old Phase 4/5/6 logic unless explicitly instructed by the operator.

## Source of Truth

Functional source of truth:

- `docs/v2/*`

Visual source of truth:

- `public/reference/visuals_v2/*`

Board-level concept and style context:

- `public/reference/wireframes_v2_boards/*`

Historical reference only:

- `public/reference/wireframes_v1/*`

Existing implementation:

- The current repo reflects Phase 1–3 state, but it is not automatically correct. It must be audited against v2 source of truth.

## Product Principles

- Digital first.
- Human reviewed.
- Evidence backed.
- No unapproved advice reaches the client.
- Triggers are review points, not advice.
- Advisor approval alone is not enough.
- Compliance gate controls client visibility.
- Evidence is created by default.
- Sensitive actions create audit events.
- Client visibility is a controlled state, not a visual styling decision.

## Visual Interpretation Rules

Visuals are **reference artefacts**, not literal screenshots to recreate end-to-end.

Each visual may contain:

1. actual UI to implement;
2. annotation panels;
3. dev handoff notes;
4. workflow explanation;
5. state examples;
6. metadata such as asset ID, source board, version and audience;
7. reference-only information.

Codex must implement the **actual application UI region** and translate the surrounding annotations into logic, documentation, tests, state models and data contracts.

Do not render developer notes, source-board labels, asset IDs, dev handoff blocks, legends, QA callouts, or design-spec metadata inside the actual client/advisor application UI unless the screen is explicitly a reference/admin documentation route.

### Mandatory Implementation Boundary

Only the actual app screen area, drawer, modal, table, mobile screen content, kanban board, form, graph, or user-facing/internal-facing interface region may become HTML/CSS/React UI.

Annotations, legends, dev notes, metadata, backend workflow notes, evidence/audit notes, state explanations, permission hints, and test hints must become implementation logic, central helpers, route state handling, tests, documentation, API/mock-data contracts, state machines, permission rules, and evidence/audit mapping.

For mobile visuals, implement only the content that appears inside the phone screen. Do not render a decorative phone frame, phone shell, surrounding desktop board, state-toggle controls, or explanatory panels around it. If alternate mobile states are needed for QA, drive them through mock data or query parameters rather than visible demo controls.

Some visuals are entirely reference/information boards, especially:

- V2-043 Permission Matrix Reference Board
- V2-048 End-to-End Service Blueprint — Full Swimlane View
- V2-049 Evidence Chain View
- V2-050 Escalation / Returns View
- V2-051 Roadmap Board
- V2-052 Blocked / Not MVP Ready Features
- V2-053 Dependency Flow
- V2-054 State Chip / Workflow Badge Reference Board
- V2-055 State Machine Reference Board
- V2-056 Evidence / Audit Mapping Reference Board

These should inform architecture, rules, tests and docs. Do not implement them as ordinary product screens unless a dedicated internal reference route is explicitly in scope.

## UX Rules

- Every route must map to a v2 screen spec.
- Every page must have default, loading, error and blocked states where relevant.
- Every sensitive screen must show permission and visibility logic.
- Every advice-like flow must include backstage review and compliance gate.
- Every decision must link to evidence and audit.
- Product-board pages are not acceptable as implementation screens.
- Reference boards should become rules, models and test cases before they become UI.

## Engineering Rules

- Preserve working code unless it conflicts with v2.
- Refactor in small commits.
- Centralise routes, statuses, permissions, workflows and evidence logic.
- Do not rely on client-side hiding alone for access control.
- Add tests for permissions, gates and state transitions.
- Run build, lint and tests where available.

## Phase 4 Rule

Before writing feature code:

1. Audit existing Phase 1–3 implementation.
2. Read all v2 docs and visuals.
3. Create `docs/v2/EXISTING_PHASE_1_3_AUDIT.md`.
4. Create `docs/v2/DELTA_ANALYSIS_V2.md`.
5. Create `docs/v2/REFACTOR_PLAN_V2.md`.
6. Implement only Phase 4 refactor.
7. Do not start Phase 5 until Phase 4 QA passes.
