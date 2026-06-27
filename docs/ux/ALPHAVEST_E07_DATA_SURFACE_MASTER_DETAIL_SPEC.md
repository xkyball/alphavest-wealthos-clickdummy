# AlphaVest Deprecated E07 Data Surface And Master-Detail Refactor Pattern Specification

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Ticket | `SPEC-E07-1` |
| Parent epic | `E07 Data Surface and Master-Detail Refactor Patterns` |
| Source analysis | `docs/v3/proof/e07_data_surface_master_detail_analysis.md` |
| Spec status | `SUPERSEDED_BY_E06_UPLOAD_ARCHITECTURE` |
| Implementation status | `DO_NOT_USE_AS_OPERATIVE_EPIC_NUMBER` |
| Replacement | `docs/ux/ALPHAVEST_E06_DATA_SURFACE_MASTER_DETAIL_SPEC.md` |

This earlier specification used the wrong epic number for data surfaces. The uploaded architecture defines data surfaces and master-detail as E06. Use the E06 implementation spec as operative source for this run.

## Target State

AlphaVest must have one canonical typed data-surface contract that governs tables, lists, queues, boards, filter/search strips, row actions, sticky headers and master-detail behavior across app-wide operational surfaces.

The contract must answer these questions for every governed data surface:

1. Which surface family is being rendered: table, list, queue, board, audit log, redaction table, permission matrix or detail-support list?
2. Which density preset applies?
3. Which columns, card fields or board fields are primary, secondary, hidden on mobile or action-only?
4. Which row/card action policy applies and which downstream claim is forbidden?
5. Which search/filter state is inactive, active, disabled-static, resettable or unsupported?
6. Which master-detail mode is allowed: inline rail, drawer, route handoff or no detail?
7. Which empty/loading/error/permission state contract must render?
8. Which sticky header, action rail or detail rail behavior is allowed?
9. Which local table/filter/board implementations are deprecated, migrated or explicitly excepted?

## Canonical Source Decision

Recommended decision: add a narrow code-backed canonical contract in `lib/ux-data-surface-contract.ts`, then make `DataTable`, `FilterBar`, `Kanban`, master-detail adapters and representative route consumers project from it.

Allowed fallback if the user rejects a new file: extend `lib/ux-density.ts` and `lib/ux-page-template-system.ts` with data-surface metadata. This is acceptable for density and placement, but less clean because those contracts do not own row actions, column priority, filters or board/detail behavior.

Rejected approach: keep route-local table, filter and board implementations as equal vocabulary and only patch styles locally. That preserves the old overlapping implementation model E07 is meant to retire.

## Required Surface Families

Implementation must support families equivalent to:

```ts
export type UxDataSurfaceFamily =
  | "table"
  | "list"
  | "queue"
  | "board"
  | "audit_log"
  | "redaction_table"
  | "permission_matrix"
  | "detail_support_list";
```

Required semantics:

- `table`: structured comparable rows with explicit columns and one optional row-action policy.
- `list`: lighter stacked records where scan order matters more than column comparison.
- `queue`: work intake, triage or review list; row action may open detail but cannot complete gated work by itself.
- `board`: grouped cards or columns; card selection may open detail, but column/card actions remain governed by E05.
- `audit_log`: historical/proof-oriented surface; display is not audit persistence proof.
- `redaction_table`: export/payload review surface; preview is not approval, generation, download or share.
- `permission_matrix`: role/scope visibility surface; display is not permission mutation authority.
- `detail_support_list`: secondary evidence, document, timeline or related-object surface inside a detail view.

## Required Density Presets

Implementation must support density presets equivalent to:

```ts
export type UxDataSurfaceDensity =
  | "compact_operations"
  | "standard_review"
  | "spacious_detail_support"
  | "mobile_card_projection";
```

Density rules:

- `compact_operations`: for governance, audit, export, RBAC and admin operations where rows must scan tightly without hiding status, risk or action policy.
- `standard_review`: for advisor, compliance, KYC, monitoring and committee queues where identity, status, due/risk and next detail action must remain legible.
- `spacious_detail_support`: for detail panels, evidence lists and support tables where readability beats row count.
- `mobile_card_projection`: for small screens; it must preserve primary identity, status, blocked reason and row/card action policy.

Boolean `compact` may remain temporarily as a compatibility prop, but it must project to an approved density preset once E07 implementation begins.

## Required Column And Field Priority

Implementation must classify table columns, list fields and board card fields equivalent to:

```ts
export type UxDataFieldPriority =
  | "identity"
  | "primary_status"
  | "risk_due"
  | "evidence_gate"
  | "secondary_metadata"
  | "mobile_hidden"
  | "action";
```

Priority rules:

- `identity` names the row/card object and must remain visible on mobile.
- `primary_status` communicates state, review status, release status, evidence status or permission state.
- `risk_due` communicates priority, due date, SLA, risk, escalation or overdue state.
- `evidence_gate` communicates evidence, audit, redaction or proof posture.
- `secondary_metadata` supports scanability but can move below identity or become hidden on mobile.
- `mobile_hidden` must never be the only place where state, blocked reason, evidence gate or row action policy is visible.
- `action` is reserved for scoped row/card actions and must not create workflow-level authority by placement alone.

## Required Row And Card Action Policies

Implementation must support action policies equivalent to:

```ts
export type UxDataSurfaceActionPolicy =
  | "none"
  | "open_detail"
  | "preview"
  | "route_handoff"
  | "command_handoff"
  | "blocked_static"
  | "disabled_unavailable";
```

Action policy rules:

- `none`: no action column/card affordance renders.
- `open_detail`: opens a detail rail, drawer or route; it cannot approve, release, export, download, share or mark evidence sufficient.
- `preview`: opens preview/read-only context; it cannot imply approval or client-safe release.
- `route_handoff`: navigates to a registered route that owns the next step.
- `command_handoff`: may initiate a command only when E05 action hierarchy and permission/audit preconditions are explicit.
- `blocked_static`: renders as status, not a fake button; it must expose an accessible disabled reason.
- `disabled_unavailable`: renders only if user-visible absence is useful; it must expose an accessible disabled reason.

Every row/card action policy must project E05 action metadata where applicable.

## Required Filter And Search States

Implementation must support filter/search states equivalent to:

```ts
export type UxDataSurfaceFilterState =
  | "inactive"
  | "active_query"
  | "active_filter"
  | "active_query_and_filter"
  | "disabled_static"
  | "unsupported_hidden";
```

Filter/search rules:

- `inactive`: controls are visible and no query/filter is active.
- `active_query`: query value is visible and resettable when the surface supports reset.
- `active_filter`: active filter chips or selected values are visible and resettable when supported.
- `active_query_and_filter`: query and filters both remain visible; neither may hide the other.
- `disabled_static`: visible control communicates the missing implementation boundary and does not imply live filtering.
- `unsupported_hidden`: no visible filter/search affordance appears because it would imply unsupported behavior.

Route-local search bars, disabled filter buttons and clear/reset controls must migrate to the shared filter contract or carry an explicit exception marker.

## Required Master-Detail Modes

Implementation must support master-detail modes equivalent to:

```ts
export type UxMasterDetailMode =
  | "none"
  | "inline_detail_rail"
  | "drawer_detail"
  | "route_detail";
```

Master-detail rules:

- `none`: surface remains scan-only and no selected object detail is implied.
- `inline_detail_rail`: selected object context stays visible beside the master list/board on desktop and stacks safely on mobile.
- `drawer_detail`: selected object opens in a controlled drawer lifecycle governed by E04.
- `route_detail`: row/card action navigates to the registered detail or decision-room route.
- Selected state must identify the object, its state, blocked reason and allowed next action without implying approval, release, export or client visibility.
- Detail rails/drawers must preserve proof/audit/evidence boundaries from E03, E04, E05 and E06.

## Required Sticky Header And Rail Rules

- Sticky topbars remain shell-owned and must not be reimplemented inside route data surfaces.
- Sticky table headers are allowed only inside a bounded data-surface container where they do not overlap the app topbar or action rail.
- Sticky detail/action rails must project from E02 template and E05 action placement rules.
- Desktop sticky rails must have a bounded height and scroll independently when needed.
- Mobile must render sticky rails/drawers in normal flow or controlled overlay lifecycle without content overlap.
- A sticky rail may show blocked status and safety note; it must not hide row identity, selected-object state or required recovery action.

## Required Runtime Attributes

Every contract-projected data surface should be able to emit attributes equivalent to:

- `data-ux-data-surface-family`
- `data-ux-data-surface-density`
- `data-ux-data-surface-field-priority`
- `data-ux-data-surface-action-policy`
- `data-ux-data-surface-filter-state`
- `data-ux-master-detail-mode`
- `data-ux-sticky-header`
- `data-ux-sticky-rail`
- `data-ux-no-overclaim`

These attributes are proof metadata for QA and capture review. They must not become visible product copy.

## Relationship To Existing Contracts

- E01 `ux-operating-model` remains the source for audience, productive eligibility and no-overclaim posture.
- E02 `ux-page-template-system` remains the source for template family, zones, action-zone behavior and long-page behavior.
- E03 `ux-proof-reviewer-mode` remains the source for operational/reviewer/client-mode visibility.
- E04 `ux-lifecycle-state-contract` remains the source for state, drawer and modal lifecycle.
- E05 `ux-action-hierarchy-contract` remains the source for action meaning, placement, availability and downstream separation.
- E06 `ux-feedback-message-contract` remains the source for feedback messaging, validation and no-overclaim copy.
- E07 owns data-surface family, density, column/card field priority, row/card action policy, filter/search state, master-detail mode and sticky data-surface conventions.

## Implementation Boundaries

Allowed after approval:

- Add `lib/ux-data-surface-contract.ts`.
- Make `components/ui/data-table.tsx` project density, field priority, row-action policy, filter/master-detail metadata where applicable.
- Make `components/ui/filter-bar.tsx` project filter/search state metadata and active/disabled/resettable semantics.
- Make `components/ui/kanban.tsx` or a board adapter project board family, density, card field priority and card action policy.
- Add a small `DataSurfaceShell` or `MasterDetailSurface` adapter if implementation proves it reduces local duplication across table/list/board/detail flows.
- Migrate representative low-risk manual tables to the shared data-surface contract.
- Migrate representative route-local filter/search strips to the shared filter contract.
- Apply master-detail metadata to representative queue/detail and board/detail flows.
- Add focused source and runtime tests proving contract coverage and representative adoption.

Forbidden:

- Do not add routes.
- Do not generate screen, state-screen, image or screenshot assets as product UI.
- Do not add backend pagination, API behavior, schemas, migrations, permission changes or audit persistence.
- Do not reclassify route scope or page type.
- Do not implement route-by-route redesign backlog.
- Do not use a wrapper component while leaving density, row action, filter and master-detail semantics as local string/class decisions.
- Do not imply approval, release, export, download, share, evidence sufficiency, permission mutation or client acceptance from row/card selection.

## Local Implementation Retirement Rules

- Manual `<table>` implementations that duplicate `DataTable` behavior should be treated as deprecated unless they carry an E07 exception marker.
- Route-local disabled filter buttons should migrate to `FilterBar` or an approved filter adapter.
- Route-local board columns/cards should migrate to `Kanban` or a board adapter if they only differ by local styling or static blocked controls.
- Route-local sticky asides should migrate to `WorksurfaceShell`, `UxDetailStandardPanel`, `MasterDetailSurface` or an approved sticky rail adapter.
- Exceptions must explain why the shared primitive cannot currently represent the surface and which follow-up ticket removes the exception.

## Acceptance Criteria

- A canonical typed E07 data-surface contract exists or the user-approved fallback is implemented.
- Data surface family, density, field priority, row/card action policy, filter/search state and master-detail mode resolve to runtime attributes.
- `DataTable` projects E07 density and row-action policy without losing current sorting, mobile card and E04 state behavior.
- `FilterBar` or an approved adapter projects inactive, active, disabled-static and resettable filter/search states.
- `Kanban` or an approved board adapter projects board family, card priority and card action policy for representative board use.
- Representative manual table copies are migrated or marked as explicit E07 exceptions.
- Representative route-local filter/search strips are migrated or marked as explicit E07 exceptions.
- Representative queue/detail and board/detail flows expose a master-detail mode.
- Row/card actions do not imply release, export, approval, evidence sufficiency, permission mutation, download, share, client visibility or client acceptance unless E05 authorizes that explicit action meaning.
- Empty/loading/error/permission states continue to project through E04/E06.
- Sticky header/rail behavior is bounded and responsive for touched surfaces.
- No route, schema, API, permission, audit persistence, release, export or client visibility policy is changed.

## Review And Test Design

Minimum validation after implementation:

- `./node_modules/.bin/tsx scripts/source-target-guard.ts`
- `./node_modules/.bin/tsc --noEmit`
- Focused E07 contract test, recommended: `tests/ux-data-surface-contract.spec.ts`
- Shared primitive adoption proof for `DataTable`, `FilterBar`, `Kanban` or approved adapters
- Representative runtime checks:
  - data table density and row action metadata
  - filter/search inactive, active and disabled-static metadata
  - master-detail metadata for one queue/detail and one board/detail surface
  - no-overclaim row/card action boundaries
  - local manual table/filter exception or retirement proof

Screenshots are required for visible UI layout, density, sticky rail, table, filter or board changes. Contract metadata-only or source/test-only changes may report that no screenshot was warranted.

## Downstream Implementation Tasks

| Ticket | Status | Required Scope |
| --- | --- | --- |
| `IMPL-E07-1` | Blocked pending approval | Add the canonical data-surface contract and implement table/list density presets plus typed row-action hierarchy in shared primitives and representative consumers. |
| `IMPL-E07-2` | Blocked pending approval and `IMPL-E07-1` | Add master-detail mode metadata/adapter and apply it to one representative queue/detail and one board/detail flow. |
| `IMPL-E07-3` | Blocked pending approval and `IMPL-E07-1` | Normalize filter/search active-state metadata and sticky header/rail conventions in shared primitives and representative consumers. |
| `QA-E07-1` | Blocked pending implementation | Validate E07 contract adoption, local-copy retirement, state coverage, row/card action boundaries, sticky behavior and screenshots where UI changes occurred. |

## Post-Spec Approval Gate

Implementation must not start until the user approves one of these choices:

| Approval Choice | Recommendation | Consequence |
| --- | --- | --- |
| `APPROVE_E07_CANONICAL_DATA_SURFACE_CONTRACT` | Recommended | Add a typed data-surface contract and make shared table/list/board/filter/master-detail primitives project from it. Best path to retire route-local table/filter/board ambiguity. |
| `APPROVE_E07_DENSITY_ONLY_EXTENSION` | Acceptable fallback | Extend density/template contracts only. Lower risk, but row actions, filter state and board/detail drift remain partially local. |
| `REJECT_E07_IMPLEMENTATION` | Not recommended | Leaves E07 as analysis/spec only and preserves duplicated data-surface vocabulary. |

## Ticket Result

`SPEC-E07-1` is complete and decision-ready. `IMPL-E07-1`, `IMPL-E07-2`, `IMPL-E07-3` and `QA-E07-1` remain blocked until the post-spec approval gate is cleared.
