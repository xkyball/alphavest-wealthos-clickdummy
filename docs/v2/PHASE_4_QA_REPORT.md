# Phase 4 QA Report

Date: 2026-06-14

## Scope

Run scope: Phase 4 - UX Model Refactor and Visual Alignment.

This pass audited the existing Phase 1-3 implementation, produced the required v2 audit/delta/plan docs, centralised v2 route and gate logic, and replaced generic board-placeholder pages for the Phase 4 internal/reference routes with route-specific v2 foundation screens.

## Changed Files

Primary implementation:

- `lib/v2-model.ts`
- `components/phase4-v2-screens.tsx`
- `components/app-shell.tsx`
- `app/workbench/page.tsx`
- `app/advisor-approval/page.tsx`
- `app/compliance/page.tsx`
- `app/governance/page.tsx`
- `app/communication/page.tsx`
- `app/journey/page.tsx`
- `app/roadmap/page.tsx`
- `app/layout.tsx`
- `lib/workflows.ts`
- `package.json`
- `tests/v2-model.test.mjs`

Required Phase 4 docs:

- `docs/v2/EXISTING_PHASE_1_3_AUDIT.md`
- `docs/v2/DELTA_ANALYSIS_V2.md`
- `docs/v2/REFACTOR_PLAN_V2.md`

Handoff/source-of-truth files present in this phase:

- `AGENTS.md`
- `CODEX_TASK_MASTER_V2.md`
- `docs/v2/*`
- `public/reference/visuals_v2/*`
- `public/reference/wireframes_v2_boards/*`

## Tests Run

| Command | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm test` | Passed: 6 tests |
| `npm run lint` | Passed |
| `npm run build` | Passed |

Browser smoke:

- Started local app on `http://localhost:3007`.
- Checked `/workbench`, `/advisor-approval`, `/compliance`, `/governance`, `/communication`, `/journey`, `/roadmap`.
- Verified expected v2 headings render.
- Verified `No unapproved advice reaches the client.` is visible.
- Verified blocked/gate state text is present.
- Verified old `Reference Image Viewer` / `Dev / QA` board chrome is absent from the refactored routes.

## Route-to-Visual Mapping Status

Central mapping now exists in `lib/v2-model.ts`.

| Route | Status |
|---|---|
| `/mobile` | Mapped to V2-001, V2-002, V2-003, V2-009; full v2 rebuild deferred to Phase 5. |
| `/mobile/upload` | Mapped to V2-004 through V2-008; full v2 rebuild deferred to Phase 5. |
| `/portal` | Mapped to V2-010 through V2-012; full v2 rebuild deferred to Phase 5. |
| `/wealth-map` | Mapped to V2-013 through V2-016; full v2 rebuild deferred to Phase 5. |
| `/actions` | Mapped to V2-017 through V2-019; full v2 rebuild deferred to Phase 5. |
| `/decisions` | Mapped to V2-020 through V2-022; gate model added, full rebuild deferred to Phase 5. |
| `/evidence` | Mapped to V2-023 through V2-025; evidence model added, full rebuild deferred to Phase 5. |
| `/signals` | Mapped to V2-026 and V2-027; deeper internal trigger rebuild deferred to Phase 6. |
| `/workbench` | Replaced generic board placeholder with v2 queue/readiness foundation. |
| `/advisor-approval` | Replaced generic board placeholder with advisor gate and compliance-pending foundation. |
| `/compliance` | Replaced generic board placeholder with release/block/audit foundation. |
| `/governance` | Replaced generic board placeholder with permission matrix, second confirmation and audit foundation. |
| `/communication` | Replaced generic board placeholder with decision-tree, message preview and gated send foundation. |
| `/journey` | Converted to service-blueprint logic summary; does not recreate reference boards. |
| `/roadmap` | Converted to scope-control route; does not recreate reference boards. |

## Permission Gate Status

Central helper: `evaluatePermission()` in `lib/v2-model.ts`.

Covered now:

- Role/action permissions.
- Sensitive permission actions.
- Second-confirmation requirement.
- Relationship-scope placeholder.
- Restricted-role denial test.
- Governance UI foundation using the central helper.

Remaining:

- Server-side auth enforcement.
- Persistent users/roles/objects.
- Full object-level policy matrix.

## No-Unapproved-Advice Gate Status

Central helper: `evaluateClientVisibility()` in `lib/v2-model.ts`.

Required release checks now represented:

- advisor approval;
- compliance release;
- evidence record exists;
- permission check;
- client visibility state is `released`.

Tests assert:

- advisor approval alone remains blocked;
- all release gates are required for `[CLIENT]`.

## Evidence / Audit Status

Central helpers:

- `createEvidenceLink()`
- `createAuditEvent()`

Covered now:

- Structured audit event shape.
- Evidence URI convention.
- Tests assert event/evidence links.
- Compliance and governance screens display audit/evidence-derived state.

Remaining:

- Persistence.
- Immutable checksum/seal.
- Actor/device/session capture.

## Unresolved Issues

- Client-facing Phase 3 routes still contain some board-style framing and annotation-derived UI. They are mapped and preserved for Phase 5 rather than fully rebuilt in Phase 4.
- `/signals` remains the previous Phase 3 trigger screen with v2 mapping; deeper V2-026/V2-027 rebuild belongs to Phase 6.
- `BoardPage` / `BoardShell` remain in the repo for legacy compatibility but are no longer used by the Phase 4 refactored routes.
- No Playwright dependency or full route-interaction suite exists; browser smoke was manual through the in-app browser.
- No real server-side permission enforcement exists yet.

## Recommendation for Phase 5 Readiness

Phase 4 foundation is ready for Phase 5 planning after review. The next phase should rebuild the P0 client routes from the v2 app UI regions while using the central helpers introduced here for permissions, release gates, evidence and audit.
