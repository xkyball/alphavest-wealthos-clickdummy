# AlphaVest UXP0-005 Risk / Blocker Register

> Phase 0 execution-control register for UX interaction pruning. This document routes risks; it does not resolve, promote or implement them.

## Status

| Field | Value |
| --- | --- |
| Artefact status | `UXP0_005_INITIALIZED` |
| Task | `UXP0-005 Risk / Blocker Register Initialization` |
| Branch inspected | `full-workflow` |
| Baseline commit | `7c3be96 chore(true-ux): add remaining remediation artifacts` |
| Created | 2026-06-22 |
| Implementation changes | None |
| Product authority | None |
| Runtime authority | None |

## Execution Rule

Phase 0 may identify and route blockers only. A blocker marked `STOP_CONDITION` blocks affected implementation tasks until the owning phase or a later approved product/safety decision resolves it. HOLD and P1 entries are not implementation candidates.

## Severity Scale

| Severity | Meaning |
| --- | --- |
| `P0_STOP` | Blocks affected implementation claims or safety-critical task completion. |
| `P1_BLOCKER` | Must be handled before the affected Phase 1/2/3 implementation can be marked done. |
| `P2_RISK` | Must be tracked and reported; does not block unrelated tasks. |
| `INFO` | Execution note or already-contained risk. |

## Blocker Register

| ID | Category | Risk / Blocker | Severity | Owner Phase | Status | Stop Condition / Routing |
| --- | --- | --- | --- | --- | --- | --- |
| UXP0-B001 | Source blocker | `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` is stale and must not override current True-UX handoff, live code or UX cleanup audit. | `P1_BLOCKER` | Phase 0 / Phase 4 | `CONTAINED` | If a later task uses v0.6 as operative scope truth, stop and rebase against current route registry and live code. |
| UXP0-B002 | Source blocker | Current Phase 0 work has generated local uncommitted artefacts and workset fixes. | `INFO` | Phase 4 | `OPEN_REPORTING` | Final report must list changed files and distinguish Phase 0 register artefacts from product implementation. |
| UXP0-B003 | Scope blocker | Routes `064`, `065`, `066`, `067`, `069`, `070`, `071` are `HOLD_PENDING_DECISION`. Existing UI/actions/tests do not unlock them. | `P0_STOP` | HOLD blocked | `OPEN` | Any implementation, promotion or MVP claim for these routes stops until explicit decision authority exists. |
| UXP0-B004 | Scope blocker | Routes `052`, `053`, `059`, `060`, `068` are `P1_AFTER_MVP`. | `P1_BLOCKER` | P1 deferred | `OPEN` | Phase 1 may clean copy/state around them only if it preserves deferred status; no MVP unlock. |
| UXP0-B005 | Fake affordance | Static buttons, disabled actions, unconnected filters and unproven row actions exist across route families. | `P1_BLOCKER` | Phase 2 | `OPEN` | Before Phase 2 completion, each touched fake affordance must be removed, disabled, made visually non-interactive or connected with lifecycle proof. |
| UXP0-B006 | Fake affordance | Committee review `070-071` has visible review/vote/evidence controls but remains static or disabled. | `P0_STOP` | HOLD blocked / Phase 2 | `OPEN` | Do not convert committee controls into active workflow without HOLD decision and safety proof. |
| UXP0-B007 | Manual/content leakage | Product UI still contains proof/manual/demo/density/recovery explanation blocks that compete with task execution. | `P1_BLOCKER` | Phase 1 | `OPEN` | Affected Phase 1 tasks must move useful explanation to `docs/ux/ALPHAVEST_UI_MANUAL_RELOCATED_CONTENT.md` or final report. |
| UXP0-B008 | Manual/content leakage | Demo/session/build context can appear in product chrome or operative pages. | `P2_RISK` | Phase 1 | `OPEN` | Keep only functional demo controls; relocate explanatory demo narrative to manual/reference surfaces. |
| UXP0-B009 | State/manual mixing | Reference routes `061`, `062`, `063` are not product workflow pages. | `P1_BLOCKER` | Phase 1 / Phase 4 | `OPEN` | Keep reference-only separation; do not include them as primary product navigation or interaction proof. |
| UXP0-B010 | State/manual mixing | State panels sometimes explain implementation proof rather than current state, impact and next step. | `P1_BLOCKER` | Phase 1 | `OPEN` | Rewrite touched state copy to current state, blocked reason and next action only. |
| UXP0-B011 | Safety copy overclaim | Upload success can be misread as evidence sufficiency, extraction completion, release, export or client visibility. | `P0_STOP` | Phase 1 / Phase 3 | `OPEN` | Preserve short upload-not-sufficiency copy; failing upload safety tests blocks done claims. |
| UXP0-B012 | Safety copy overclaim | Advisor approval, committee approval and compliance release are separate gates and must not be collapsed in copy. | `P0_STOP` | Phase 1 / Phase 3 | `OPEN` | Any copy/control implying advisor or committee approval releases content blocks affected task completion. |
| UXP0-B013 | Safety copy overclaim | Export approval, package generation, download and share are separate lifecycle steps. | `P0_STOP` | Phase 1 / Phase 3 | `OPEN` | Any copy/control implying final download/share readiness before proof blocks export-related tasks. |
| UXP0-B014 | Lifecycle gap | Modal and drawer primitives have improved focus/Escape lifecycle, but route-level mutation semantics still require per-action proof. | `P1_BLOCKER` | Phase 3 | `OPEN` | Touched safety modals must prove trigger, cancel, validation, loading, success/error and fail-closed result. |
| UXP0-B015 | Lifecycle gap | Search/filter/table/kanban controls are mixed: some wired, some visual-only. | `P1_BLOCKER` | Phase 2 / Phase 3 | `OPEN` | A touched control must be classified before removal/disable/connect work. |
| UXP0-B016 | Lifecycle gap | KYC/source-of-wealth/suitability/IPS/rebalance controls have demo action slices but remain P1/HOLD according to workset. | `P0_STOP` | P1 deferred / HOLD blocked | `OPEN` | Demo action presence cannot be used as MVP implementation proof. |
| UXP0-B017 | Test gap | Passing held/P1 route tests may prove guard labels only, not MVP product readiness. | `P1_BLOCKER` | Phase 4 | `OPEN` | Final report must avoid presenting held/P1 test passes as implementation unlocks. |
| UXP0-B018 | Test gap | Targeted validation must match touched area; broad lint/test pass is not enough for safety actions. | `P0_STOP` | Phase 4 | `OPEN` | Missing targeted safety test for touched release/export/RBAC/evidence/client visibility areas blocks done claim. |

## Phase Routing Summary

| Route / Risk Group | Owner Phase | Required Handling |
| --- | --- | --- |
| Source staleness and report traceability | Phase 4 | Report source treatment and changed files; do not elevate stale artefacts. |
| Manual/proof/demo content in product UI | Phase 1 | Remove, shorten, relocate or convert to state copy. |
| Static/fake controls | Phase 2 | Remove, disable, make non-interactive or connect only with proof. |
| Modal/drawer/action lifecycle gaps | Phase 3 | Prove trigger, close/cancel, validation, loading, success/error and fail-closed behaviour. |
| Safety actions touching release, evidence, export, RBAC or client visibility | Phase 3 / Phase 4 | Require targeted safety tests and no-overclaim reporting. |
| `P1_AFTER_MVP` routes | P1 deferred | Preserve deferred state; no MVP unlock. |
| `HOLD_PENDING_DECISION` routes | HOLD blocked | Preserve blocked state; no implementation without explicit decision. |
| Route/screen/API creation outside task authority | Do-not-create | Stop; no new product surface or blind API/schema creation. |

## P0 Stop Conditions

| Stop Condition | Applies To |
| --- | --- |
| A safety-critical action lacks route/API/test proof after being touched. | Release, block, request evidence, export, download/share, role/access change, client visibility. |
| A HOLD route is promoted or implemented as MVP. | `064`, `065`, `066`, `067`, `069`, `070`, `071`. |
| A P1 route is promoted into MVP. | `052`, `053`, `059`, `060`, `068`. |
| Upload copy implies evidence sufficiency, release, export or client visibility. | `027-030`, evidence/document routes and related copy. |
| Export copy merges approval, generation, download and share into one completed state. | `054-058` and export-related actions. |
| A task creates new routes, APIs, schema models or screen assets without explicit authority. | All phases. |

## Acceptance Check

| Acceptance Criterion | Result |
| --- | --- |
| Every preflight risk has owner phase and status. | `PASS` |
| P0 safety risks cannot be hidden as UX cleanup only. | `PASS` |
| HOLD/P1 risks cannot become implementation candidates. | `PASS` |
| Register is ready for final report updates. | `PASS` |

## Validation Plan

| Command | Purpose |
| --- | --- |
| `pnpm lint` | Static quality after docs/register edits. |
| `pnpm exec playwright test tests/foundation-guardrails.spec.ts --reporter=line` | Route workset and source guardrail proof. |
| `pnpm exec playwright test tests/interaction-lifecycle.spec.ts tests/confirmation-lifecycle.spec.ts --reporter=line` | Lifecycle proof for modal/drawer and sensitive confirmation boundaries. |
