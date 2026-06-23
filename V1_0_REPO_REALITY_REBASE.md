# AlphaVest V1.0 Repo Reality Rebase

Generated: 2026-06-23
Branch: `full-workflow`
Baseline commit: `7a14598 chore(visual): capture runtime component sidecars`
Execution scope: `WP-00` from `/Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md`
Operative repo source of truth: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## 1. Source Hierarchy Finding

`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` remains the only operative repository source of truth under `AGENTS.md`.

The downloaded V1.0 detailed task descriptions are useful as an execution companion, but they cannot replace the True-UX hierarchy. The V1.0 document references `ALPHAVEST_V1_0_IMPLEMENTATION_TASK_PACK.md` and `ALPHAVEST_VERSION_1_0_STRATEGY_RESEARCH_REPORT.md`; those files are not present in this checkout. Therefore V1.0 feature work must be mapped through the current True-UX handoff and existing safety contracts before implementation.

## 2. Moving Baseline Preflight

| Check | Result |
|---|---|
| Branch | `full-workflow` |
| Latest commit | `7a14598 chore(visual): capture runtime component sidecars` |
| Working tree | Dirty before WP-00 edits |
| Existing modified file before WP-00 | `scripts/capture-routes-and-modals.ts` |
| Existing untracked files before WP-00 | `EXECUTION_PROTOCOL.md`, `NEXT_ACTION.md`, `PROMPT_CHAIN_DEPENDENCY_MAP.md`, `UPLOAD_READINESS.md`, `babel.config.js`, `scripts/avs-jsx-source-trace-babel.cjs`, `scripts/map-runtime-dom-source.ts` |
| WP-00 code/doc edits made | `lib/source-reality-gate.ts`, `V1_0_REPO_REALITY_REBASE.md` |
| Baseline stabilization edits made after first WP-00 report | `scripts/capture-routes-and-modals.ts`, `babel.config.js`, `scripts/avs-jsx-source-trace-babel.cjs`, `scripts/map-runtime-dom-source.ts` |
| Stop-rule status | Static and route-smoke baselines are green; V1.0 companion-source chain remains partial because two referenced V1.0 documents are absent |

## 3. Current Inventory Counts

| Area | Current count | V1.0 download snapshot | Older false-gap baseline | Finding |
|---|---:|---:|---:|---|
| App page route files | 2 | Not listed as count | Not reliable | `ALREADY_PRESENT` |
| API route files | 15 | 15 | 4 | `ALREADY_PRESENT`; old 4-API claim is stale |
| Playwright specs | 77 | 51 | 10 | `ALREADY_PRESENT`; both old 10-test and downloaded 51-test snapshots are stale |
| `lib/**/*.ts` files | 73 | 73 | Not reliable | `ALREADY_PRESENT` |
| `components/**/*.tsx` files | 51 | 50 | Not reliable | `PARTIAL_DRIFT`; current repo has one more component than V1.0 snapshot |
| `components/ui/**/*.tsx` files | 17 | Not listed as count | Not reliable | `ALREADY_PRESENT` |
| Prisma models | 42 | Not listed in WP-00 table | Not reliable | `ALREADY_PRESENT` |
| Prisma enums | 22 | Not listed in WP-00 table | Not reliable | `ALREADY_PRESENT` |
| Route registry entries | 71 | Not listed in WP-00 table | Not reliable | `ALREADY_PRESENT` |
| Tracked markdown files | 128 | Not listed in WP-00 table | Not reliable | `ALREADY_PRESENT` |

## 4. Route Workset Reality

The route registry currently contains 71 screen routes and an explicit locked workset map:

| Scope | Count | Page IDs |
|---|---:|---|
| `MVP` | 31 | 008, 019, 020, 027, 028, 029, 030, 033, 034, 035, 036, 037, 038, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 049, 050, 051, 054, 055, 056, 057, 058 |
| `MVP_SUPPORT` | 25 | 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 021, 022, 023, 024, 025, 026, 031, 032 |
| `P1_AFTER_MVP` | 5 | 052, 053, 059, 060, 068 |
| `REFERENCE_ONLY` | 3 | 061, 062, 063 |
| `HOLD_PENDING_DECISION` | 7 | 064, 065, 066, 067, 069, 070, 071 |

No route scope was reclassified during WP-00.

## 5. API Route Files

- `app/api/admin-tenants/route.ts`
- `app/api/audit-events/route.ts`
- `app/api/auth/dummy/route.ts`
- `app/api/dashboard-metrics/route.ts`
- `app/api/demo-workflow/route.ts`
- `app/api/documents/review/route.ts`
- `app/api/documents/route.ts`
- `app/api/documents/upload/route.ts`
- `app/api/entities/route.ts`
- `app/api/export-workflow/route.ts`
- `app/api/family-members/route.ts`
- `app/api/global-search/route.ts`
- `app/api/ops-sla/route.ts`
- `app/api/profile/route.ts`
- `app/api/review-monitoring/route.ts`

## 6. Playwright Spec Inventory

Current spec count: 77.

- `tests/access-request-drawer-lifecycle.spec.ts`
- `tests/admin-confirmation-modal-lifecycle.spec.ts`
- `tests/audit-fail-closed.spec.ts`
- `tests/button-cta-lifecycle-pruning.spec.ts`
- `tests/card-kpi-affordance-pruning.spec.ts`
- `tests/client-visibility-proof.spec.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/committee-review-routes.spec.ts`
- `tests/confirmation-lifecycle.spec.ts`
- `tests/consent-policy-modal-lifecycle.spec.ts`
- `tests/control-layer-actor-scope.spec.ts`
- `tests/control-layer-p0-fixtures.spec.ts`
- `tests/data-quality-service.spec.ts`
- `tests/dbtf-tables-api.spec.ts`
- `tests/decision-confirmation-lifecycle.spec.ts`
- `tests/demo-session-panel-copy.spec.ts`
- `tests/demo-workflow-api.spec.ts`
- `tests/disabled-control-a11y-messaging.spec.ts`
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `tests/document-upload-lifecycle-hardening.spec.ts`
- `tests/drawer-lifecycle-hardening.spec.ts`
- `tests/dummy-auth-provider.spec.ts`
- `tests/e2e/e2e-journey-proof-ws00-ws05.spec.ts`
- `tests/evidence-drawer-lifecycle.spec.ts`
- `tests/evidence-review-api.spec.ts`
- `tests/export-approval-lifecycle.spec.ts`
- `tests/export-download-confirmation-lifecycle.spec.ts`
- `tests/export-safety.spec.ts`
- `tests/fail-closed-error-envelope.spec.ts`
- `tests/filter-affordance-pruning.spec.ts`
- `tests/file-export-realism.spec.ts`
- `tests/foundation-guardrails.spec.ts`
- `tests/global-search-affordance.spec.ts`
- `tests/governance-non-bypass.spec.ts`
- `tests/governance-user-drawer-lifecycle.spec.ts`
- `tests/hold-route-copy-cleanup.spec.ts`
- `tests/interaction-lifecycle.spec.ts`
- `tests/invite-user-drawer-lifecycle.spec.ts`
- `tests/modal-lifecycle-hardening.spec.ts`
- `tests/mvp-support-copy-cleanup.spec.ts`
- `tests/navigation-shell.spec.ts`
- `tests/offboarding-control.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/p0-api-contract.spec.ts`
- `tests/p1-hold-defensive-noninteractive.spec.ts`
- `tests/permission-engine.spec.ts`
- `tests/phase6-audit-persistence.spec.ts`
- `tests/phase8-export-workflow-api.spec.ts`
- `tests/phase9-support-hardening.spec.ts`
- `tests/product-guidance-shell.spec.ts`
- `tests/providerless-scope.spec.ts`
- `tests/reference-only-copy-cleanup.spec.ts`
- `tests/reference-product-control-pruning.spec.ts`
- `tests/review-monitoring-service.spec.ts`
- `tests/role-drawer-confirmation-lifecycle.spec.ts`
- `tests/route-demo-context-card.spec.ts`
- `tests/route-smoke.spec.ts`
- `tests/schema-alignment.spec.ts`
- `tests/scf-p04-p06-flow-ui.spec.ts`
- `tests/scf-p07-p09-trust-ui.spec.ts`
- `tests/scf-p10-p14-closure.spec.ts`
- `tests/scf-scope-control-ui.spec.ts`
- `tests/sort-affordance-pruning.spec.ts`
- `tests/source-reality-gate.spec.ts`
- `tests/state-copy-cleanup.spec.ts`
- `tests/status-badge-affordance-pruning.spec.ts`
- `tests/true-ux-a11y.spec.ts`
- `tests/true-ux-client-projection.spec.ts`
- `tests/true-ux-cta-state.spec.ts`
- `tests/true-ux-density.spec.ts`
- `tests/true-ux-p0-safety.spec.ts`
- `tests/ui-clickflow-phase01-05.spec.ts`
- `tests/ui-clickflow-phase06-10.spec.ts`
- `tests/ui-state-boundaries.spec.ts`
- `tests/workflow-gate.spec.ts`

## 7. Validation Results

| Command | Result | Notes |
|---|---|---|
| `pnpm db:validate` | PASS | Prisma schema is valid. |
| `pnpm test:source-reality` | PASS after WP-00 gate update | Source gate now matches current route worksets and existing True-UX entrypoints. |
| `pnpm typecheck` | PASS | Runtime mapping type blockers were stabilized. |
| `pnpm lint` | PASS_WITH_WARNINGS | Warnings remain for existing unused UI helpers and one unused capture helper; no lint errors. |
| `pnpm build` | PASS_WITH_WARNINGS | Build passes; known warnings remain for custom Babel config and broad `document-storage-adapter` tracing. |
| `pnpm phase:check` | PASS_WITH_WARNINGS | Runs `typecheck`, `lint`, `db:validate`, `build`. |
| `pnpm test:route-smoke` | PASS | 315 passed. |

## 8. WP-00 Task Status

| Task | Status | Evidence |
|---|---|---|
| `V10-WP00-T01` Current repo inventory | `ALREADY_PRESENT_WITH_REBASE_ARTIFACT` | Counts and path inventories recorded in this file. |
| `V10-WP00-T02` Stale assumptions neutralisieren | `PARTIAL` | Old source gate counts and missing entrypoint assumptions were fixed in `lib/source-reality-gate.ts`; deeper V1.0 compare is blocked because two referenced V1.0 source files are absent from the repo. |
| `V10-WP00-T03` Baseline checks | `PASS_WITH_WARNINGS` | `phase:check`, `db:validate`, `test:source-reality`, and `test:route-smoke` pass. |
| `V10-WP00-T04` Implementation Delta ableiten | `READY_WITH_SOURCE_CHAIN_NOTE` | Sequential delta is defined below; V1.0 companion documents remain partial, but repo baseline gates are green. |

## 9. Sequential Delta

1. Keep `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` as authority and treat the V1.0 detailed file as a companion until its missing task-pack and strategy-report sources are provided or intentionally superseded.
2. Execute next work in order: WP-01 providerless actor/tenant/role, WP-02 guard spine, WP-03 evidence lifecycle, WP-04 internal draft/analyst review, WP-05 advisor/compliance split, WP-06 client-safe projection, WP-07 audit fail-closed, WP-08 export redaction, WP-09 UI no-overclaim, WP-10 API hardening, WP-11 schema usage alignment, WP-12 P0 acceptance, WP-13 pilot ops, WP-14 pilot buyer proof.
3. Do not promote P1/Hold/Reference routes into V1.0. Current route scopes remain locked.
4. Prioritize P0 safety and payload/no-leakage proof before UI/GTM polishing.

## 10. Current Blockers

- `V1_0_SOURCE_CHAIN_PARTIAL`: the downloaded V1.0 detailed file references `ALPHAVEST_V1_0_IMPLEMENTATION_TASK_PACK.md` and `ALPHAVEST_VERSION_1_0_STRATEGY_RESEARCH_REPORT.md`, which are absent from this repo.
- `VALIDATION_WARNINGS_REMAIN`: `pnpm phase:check` passes, but lint/build warnings remain from existing unused UI helpers, custom Babel config, and Turbopack/NFT tracing around `lib/document-storage-adapter.ts`.

## 11. WP-00 Verdict

`READY_FOR_WP01_WITH_SOURCE_CHAIN_NOTE`.

The repo reality is now rebased, the True-UX source gate is green, `phase:check` is green, and route-smoke is green. V1.0 feature work can proceed in order only through the True-UX authority chain, with the missing V1.0 companion-source files treated as a documented limitation rather than an invitation to invent scope.
