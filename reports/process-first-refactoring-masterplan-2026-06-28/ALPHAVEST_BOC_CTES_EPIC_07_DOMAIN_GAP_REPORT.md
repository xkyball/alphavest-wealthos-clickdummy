# AlphaVest BOC/CTES EPIC-07 Domain Gap Report

Date: 2026-06-28

Ticket: `EPIC-07-ANALYSIS-01`

## Scope

EPIC-07 covers `DOMAIN-A` / `AREA-02`: Client and Family Context Foundation.

Mapped processes:

- `BP-001` Client relationship intake
- `BP-002` Client tenant creation
- `BP-003` Family office profile setup
- `BP-004` Family member context management
- `BP-005` Relationship mapping
- `BP-006` Entity registration
- `BP-008` Wealth map context review
- `BP-010` Sensitivity classification

Target screens:

- `S019` `/client/home`
- `S020` `/mobile`
- `S021` `/client/profile`
- `S022` `/client/family-members`
- `S023` `/relationships`
- `S024` `/entities`
- `S025` `/entities/new`
- `S026` `/entities/:id`
- `S031` `/wealth-map`
- `S032` `/actions`

## Current Route And Code Seams

Observed route registry coverage:

- `S019` to `S026` are registered under `client_workspace` with client profile, family profile, relationship and entity intake route jobs.
- `S031` and `S032` are registered under `wealth_actions` and share the client/entity context workflow.
- `S020` and `S032` are client-visibility-sensitive surfaces.

Observed implementation seams:

- `components/client-intake-screen.tsx` renders client home, mobile home, profile, family members, relationships, entities, entity creation and entity detail.
- `components/wealth-actions-screen.tsx` renders wealth-map and actions context surfaces.
- `lib/client-context-visibility.ts` derives client/internal payload visibility from role and sensitivity.
- `lib/visibility-engine.ts` continues to own released/client-safe projection behavior.
- `app/api/profile/route.ts`, `app/api/family-members/route.ts` and `app/api/entities/route.ts` expose DB-backed profile/family/entity read and mutation surfaces.
- `lib/dbtf-table-service.ts` and `lib/dbtf-form-service.ts` provide DB-backed table/form behavior with tenant and role checks.

Observed proof seams:

- `tests/av27-client-context-closure.spec.ts` proves profile save/reload, wrong-tenant denial, family member edit denial, entity creation validation and sensitivity hiding.
- `tests/dbtf-tables-api.spec.ts` proves DB-backed family/entity/profile API behavior and invalid/unauthorized mutations.
- `tests/e11-backend-data-surface-truth.spec.ts` checks backend-backed table truth for family/entity surfaces.
- `tests/route-smoke.spec.ts` includes route-smoke, page-type, client-safe and complexity checks for `S019`, `S020`, `S024`, `S031` and `S032`.
- `tests/ux-page-template-adoption.spec.ts`, `tests/ux-route-shell-page-job-contract.spec.ts` and `tests/ux-master-detail-surface.spec.ts` provide shared layout/page-type proof.

## Matrix Reality

The active P0 matrix still has no full completion credit for this domain.

| Process | Matrix Status | Acceptance State | Current Read |
| --- | --- | --- | --- |
| `BP-001` Client relationship intake | `specified_not_proven` | `specified_only` | No implementation credit. |
| `BP-002` Client tenant creation | `partial_current_app_representation` | `partially_implemented` | Existing tenant/setup seams are partial, not DOMAIN-A complete. |
| `BP-003` Family office profile setup | `partial_current_app_representation` | `partially_implemented` | Profile UI/API exists, but process-step proof is incomplete. |
| `BP-004` Family member context management | `partial_domain_representation` | `partially_implemented` | DB-backed family member behavior exists; matrix proof is not wired. |
| `BP-005` Relationship mapping | `partial_domain_representation` | `partially_implemented` | Route/UI exists; step-level gate/audit proof is missing. |
| `BP-006` Entity registration | `partial_current_app_representation` | `partially_implemented` | Entity list/wizard/API exists; process coverage remains partial. |
| `BP-008` Wealth map context review | `partial_domain_representation` | `partially_implemented` | Wealth map/action surfaces exist; context-readiness boundary needs stronger proof. |
| `BP-010` Sensitivity classification | `specified_not_proven` | `specified_only` | Implementation seam exists in `client-context-visibility`, but matrix has no proof credit yet. |

Common missing layers in the matrix:

- `negative_test`
- `step_level_gate_proof`
- `audit_or_evidence_failure_proof`
- `implementation_touchpoint_proof`

## Visual / UX Reality

Existing screenshot audit flags:

- `S020` `/mobile`: long-screen structure risk at `2285px`.
- `S032` `/actions`: long-screen structure risk at `2819px`.
- `S032-actions-drawer`: long-screen structure risk at `2819px`.

Interpretation:

- `S019`, `S021-S026` and `S031` are already better bounded as route surfaces.
- `S020` and `S032` are the main EPIC-07 visual debt targets.
- The domain should not add another broad context panel. It should compress existing client/family/action context into process-first, one-next-action surfaces.

## Process Gap Summary

`BP-001`:

- Missing: relationship intake step proof, route-to-process mapping, negative proof, and implementation touchpoint refs.
- Existing help: client home/profile/family routes can become the area entry and intake chain.
- Recommended slice: define client/family context entry semantics before mutating UI.

`BP-002`:

- Missing: client tenant creation step gate proof in the DOMAIN-A matrix.
- Existing help: tenant setup and demo-session tenant context exist outside this domain.
- Recommended slice: reference tenant creation as dependency/context, not as a new schema or IdP project.

`BP-003`:

- Missing: matrix proof refs for profile save, submit-for-review and fail-closed validation.
- Existing help: `/client/profile`, `/api/profile`, DB-backed tests.
- Recommended slice: surface profile process state in the client/family area entry and attach proof refs.

`BP-004`:

- Missing: matrix proof refs for family-member mutation denial, wrong-object denial and client-safe hiding.
- Existing help: `/client/family-members`, `/api/family-members`, AV27 closure tests.
- Recommended slice: treat family members as the core queue/detail process cluster.

`BP-005`:

- Missing: relationship map step-level proof and audit/recovery boundaries.
- Existing help: `/relationships` route and relationship UI.
- Recommended slice: avoid new route creation; keep relationship mapping as bounded context unless future proof requires deeper editing.

`BP-006`:

- Missing: process-level proof refs for entity wizard validation, creation and no partial rows.
- Existing help: `/entities`, `/entities/new`, `/entities/:id`, `/api/entities`, DB-backed tests.
- Recommended slice: core implementation should compact entity context and preserve DB-backed wizard boundaries.

`BP-008`:

- Missing: context review cannot be mistaken for readiness, action completion or client visibility.
- Existing help: `components/wealth-actions-screen.tsx` already states context is not readiness.
- Recommended slice: S031/S032 should expose a concise proof boundary and no-overclaim CTA semantics.

`BP-010`:

- Missing: matrix proof refs and visible process contract for sensitivity classification.
- Existing help: `deriveClientContextVisibility` plus AV27 negative sensitivity tests.
- Recommended slice: make sensitivity classification an explicit proof boundary across S019/S020/S022/S024/S031/S032, without creating a manual visibility override.

## Recommended Implementation Direction

Bold cleanup path:

1. Make `S019` the compact EPIC-07 area entry and stop treating the client/family context as a pile of isolated pages.
2. Compress `S020` and `S032` first because they are the active long-screen debt surfaces.
3. Use the existing DB-backed APIs and AV27 tests as proof seams instead of inventing new API/schema layers.
4. Add explicit client-safe/no-overclaim proof boundaries for profile, family, entity, relationship, wealth map and action context.
5. Update the matrix only to `strong_partial_domain_representation` unless every process step has implementation, positive proof, negative proof and audit/recovery proof.

Rejected weak branch:

- Do not solve EPIC-07 by adding another generic overlay, explanatory report panel, or compatibility copy layer. That would preserve the old problem: visually process-oriented screens without process-step proof.

## Decision Gate

No human decision is required before `EPIC-07-SPEC-01`.

The next ticket should define the implementation contract and explicitly decide which existing screens are representative proof surfaces for the first implementation slice.
