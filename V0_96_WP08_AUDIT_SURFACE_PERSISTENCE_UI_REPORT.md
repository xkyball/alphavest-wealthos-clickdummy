# V0.96 WP-08 Audit Surface and Persistence UI Report

Authority: `AGENTS.md` -> `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Companion task source: `docs/v0-96/uploads/ALPHAVEST_V0_96_WP08_AUDIT_SURFACE_PERSISTENCE_UI_DEEP_TASK_DESCRIPTION.md`

Status: `ACCEPTED_WITH_AUDIT_SURFACE_PERSISTENCE_UI_HARDENING_AND_CURRENT_PROOF`

Date: 2026-06-23

## Scope

WP-08 makes audit UI truthful: visible audit rows are either source-backed by persisted `AuditEvent` records or explicitly marked as display-only, pending or unavailable. Audit display is not audit persistence. Critical gate actions still depend on existing service-level audit writes and fail-closed behaviour; this slice hardens the product UI and proof around that existing audit spine.

No route, schema, migration or broad audit analytics product was added. Existing audit services, API, DB readmodels, route screens and tests were reused under the True-UX authority boundary.

## Moving Baseline Preflight

| Check | Result |
| --- | --- |
| Branch | `full-workflow` |
| Baseline commit | `d87c044 feat(v0.96): harden compliance and client projection` |
| Dirty worktree before WP-08 | Only four untracked root artefacts: `EXECUTION_PROTOCOL.md`, `NEXT_ACTION.md`, `PROMPT_CHAIN_DEPENDENCY_MAP.md`, `UPLOAD_READINESS.md`; left untouched |
| Tracked diff before WP-08 | None |
| Package scripts checked | `pnpm typecheck`, `pnpm lint`, audit/client/governance/workflow Playwright specs available |
| Source hierarchy read | `AGENTS.md`, `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`, WP-08 companion prompt |

## Audit Reality Classification

| Required key | Classification | Evidence |
| --- | --- | --- |
| `AUDIT_SERVICE_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | `lib/audit-service.ts`, `lib/control-layer/audit-guard.ts`, `lib/typed-workflow-command-bus.ts`, `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts`. |
| `AUDIT_API_REALITY` | `ALREADY_PRESENT_WITH_SAFE_ERROR_ENVELOPE` | `app/api/audit-events/route.ts` scopes by tenant and role, returns safe empty/error envelopes and does not expose raw metadata on missing scope. |
| `AUDIT_UI_REALITY` | `ACCEPTED_WITH_TARGETED_REFACTOR` | `components/ui/audit-timeline.tsx` now distinguishes `source-backed`, `pending`, `unavailable` and `display-only`; compliance demo audit rows are labelled display-only; DB audit history shows source-backed state. |
| `AUDIT_TEST_REALITY` | `ACCEPTED_WITH_FOCUSED_TRUE_UX_PROOF` | `tests/true-ux-audit-surface.spec.ts` adds WP-08 UI/API/source-contract proof. Existing P0 audit specs remain the mutation/persistence proof. |
| `AUDIT_FAILURE_HANDLING_REALITY` | `ALREADY_PRESENT_WITH_CURRENT_PROOF` | Critical mutations already call the audit guard before completion and fail closed when persistence is unavailable. |
| `CLIENT_AUDIT_REDACTION_REALITY` | `ACCEPTED_WITH_PROJECTION_REDACTION_HARDENING` | `lib/visibility-engine.ts` treats audit actor/event/reason/metadata as internal decision fields; `tests/client-visibility-projection.spec.ts` proves client projection excludes them. |

## Changed Files

| File | Change |
| --- | --- |
| `components/ui/audit-timeline.tsx` | Added source-state contract, persisted-proof DOM attributes, source reference display, empty/unavailable state handling and display-only default for legacy demo rows. |
| `lib/dbtf-table-service.ts` | Marks tenant-scoped `AuditEvent` rows as `source-backed` with `sourceRef`. |
| `lib/export-workflow-readmodel-service.ts` | Marks export workflow timeline events from persisted audit rows as `source-backed`. |
| `components/communication-export-ops-screen.tsx` | Shows DB audit source-backed state, safe loading/unavailable audit states and source state/ref in selected-event detail. |
| `components/decisions-governance-screen.tsx` | Labels compliance audit demo rows as display-only context and points persisted proof to DB-backed `AuditEvent` records. |
| `lib/visibility-engine.ts` | Adds audit actor/event/reason/metadata to internal decision projection fields. |
| `tests/client-visibility-projection.spec.ts` | Adds negative proof that released client decision projection does not expose internal audit detail. |
| `tests/true-ux-audit-surface.spec.ts` | Adds WP-08 UI/API/source-contract proof. |
| `V0_96_UX_IA_DELTA_REGISTER.md` | Updates WP-08 status and required audit reality classifications. |
| `V0_96_WP08_AUDIT_SURFACE_PERSISTENCE_UI_REPORT.md` | Adds this execution report. |

## Inspected Files

- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `docs/v0-96/uploads/ALPHAVEST_V0_96_WP08_AUDIT_SURFACE_PERSISTENCE_UI_DEEP_TASK_DESCRIPTION.md`
- `V0_96_UX_IA_DELTA_REGISTER.md`
- `lib/route-registry.ts`
- `app/[...segments]/page.tsx`
- `app/api/audit-events/route.ts`
- `components/ui/audit-timeline.tsx`
- `components/ui/data-table.tsx`
- `components/ui/state-panel.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/client-intake-screen.tsx`
- `lib/audit-service.ts`
- `lib/control-layer/audit-guard.ts`
- `lib/dbtf-table-service.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/export-workflow-readmodel-service.ts`
- `lib/visibility-engine.ts`
- `prisma/schema.prisma`
- `tests/audit-fail-closed.spec.ts`
- `tests/phase6-audit-persistence.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/route-smoke.spec.ts`

## Refactor-First Proof

Real implementation was performed in shared product code:

- `AuditTimeline` now defaults static/demo callers to `display-only`, so visual timelines no longer imply persisted proof by default.
- DB/readmodel timelines explicitly set `source-backed` and carry a source reference.
- Compliance audit page copy calls out display-only context and identifies persisted `AuditEvent` as the proof path.
- Governance audit history exposes source-backed state from tenant-scoped DB audit rows without adding new API scope.
- Client projection explicitly treats audit actor/event/reason/metadata as internal-only.

No shortcut was used for the UI contract. The already-present service/API/schema audit spine was not replaced because it contains the authorized implementation path and existing P0 proof.

## Acceptance Results

| Criterion | Result |
| --- | --- |
| Critical gate actions create or require persisted audit events | `PASS_EXISTING_SERVICE_PROOF` |
| Audit timeline/table differentiates source-backed/display-only/unavailable states | `PASS` |
| Compliance audit UI does not claim demo rows are persisted proof | `PASS` |
| Governance audit history uses source-backed DB audit rows | `PASS` |
| Evidence/advisor/compliance/export audit write fail-closed path preserved | `PASS_EXISTING_SERVICE_PROOF` |
| Client-facing projection excludes internal audit actor/event/reason/metadata | `PASS` |
| Audit unavailable state is visible and no-overclaim copy is used | `PASS` |
| No route creation, schema migration, screen/image generation or broad audit product | `PASS` |

## Proof

Focused proof for this slice:

- `pnpm typecheck` -> `PASS`
- `pnpm playwright test tests/true-ux-audit-surface.spec.ts` -> `PASS` 4/4
- `PLAYWRIGHT_PORT=3041 pnpm playwright test tests/client-visibility-projection.spec.ts tests/audit-fail-closed.spec.ts` -> `PASS` 7/7
- `PLAYWRIGHT_PORT=3042 pnpm playwright test tests/phase6-audit-persistence.spec.ts tests/governance-non-bypass.spec.ts --workers=1` -> `PASS` 7/7
- `pnpm playwright test tests/v0-96-ux-ia-delta-register.spec.ts` -> `PASS` 3/3
- `pnpm lint` -> `PASS` with 0 errors and 29 pre-existing warnings

Transient validation notes:

- An initial parallel run of `tests/client-visibility-projection.spec.ts tests/audit-fail-closed.spec.ts` failed with `EADDRINUSE` because two Playwright web servers attempted to use port `3020`; rerun on port `3041` passed.
- An initial `pnpm lint` failed with `ENOENT` scanning a missing local `test-results` directory; after recreating that tool output directory, lint passed with the existing warning set.
- An initial UI-route version of `tests/true-ux-audit-surface.spec.ts` rendered the login/support page for `/actions` and `/compliance/reviews/demo/audit` in the local Playwright harness. The final WP-08 spec therefore asserts the new audit UI contract through source/API proof while existing route-smoke specs remain responsible for general route rendering.

## Deferred Boundaries

- WP-09 still owns governance/admin non-bypass UX proof beyond the audit-history hardening touched here.
- WP-10 still owns export scope/redaction/approval/download/share UX acceptance; WP-08 only prepared source-backed audit status for export timelines.
- WP-11 still owns shared interaction primitive consolidation beyond the `AuditTimeline` change.
- WP-12 still owns the full no-overclaim copy/state sweep across later touched surfaces.
- WP-15 still owns aggregate P0/True-UX acceptance.
- WP-16 still owns final release evidence and handoff update.

## Next Recommended Work Package

Proceed to `WP-09 - Governance / Admin Non-Bypass UX`.
