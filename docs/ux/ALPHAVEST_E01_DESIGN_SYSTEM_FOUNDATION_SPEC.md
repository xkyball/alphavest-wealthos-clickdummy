# AlphaVest E01 Design-System Foundation Specification

Date: 2026-06-27

## Status

| Field | Value |
| --- | --- |
| Ticket | `E01-S1` |
| Parent epic | `E01 Design-System Implementation Foundation` |
| Source analysis | `docs/v3/proof/e01_design_system_foundation_analysis.md` |
| Spec status | `APPROVED_FOR_IMPLEMENTATION_BY_E00_RULES` |
| Implementation status | `READY_FOR_E01_I1` |

This specification defines the shared design-system foundation for E01. It authorizes only shared primitive, token, export and focused test changes. It does not authorize route-specific redesign, new routes, product-scope changes, schema/API work, generated visual assets or proof/debug scaffolding in default operational UI.

## Target State

AlphaVest must expose one narrow E01 design-system foundation that provides:

- Compact/default/comfortable density primitives.
- Typography and spacing tokens usable by shared UI components.
- Semantic status families with non-color cues.
- Stable runtime attributes for primitive family, density, text role and semantic status.
- Stable exports through `components/ui/index.ts`.

The design-system foundation must sit below E02-E09. It must not re-own route density, lifecycle state, data-surface behavior, action semantics, feedback messaging, client visibility or proof/reviewer visibility.

## Canonical Source Decision

Approved path: add a narrow code-backed design-system foundation contract in:

`lib/ux-design-system-foundation.ts`

Rejected approach: adding more local Tailwind class stacks or route-level CSS overrides. That would keep the old drift alive and force every later epic to solve the same visual semantics again.

## Density Rules

Implementation must support density modes equivalent to:

```ts
export type UxPrimitiveDensity = "compact" | "default" | "comfortable";
```

Required semantics:

- `compact`: dense operational rows, badges and metadata where scan efficiency matters.
- `default`: normal app-wide shared component density.
- `comfortable`: higher-padding panels/cards/details where readability matters more than row count.

Density primitives must project to runtime metadata:

- `data-ux-primitive-density`
- `data-ux-primitive-spacing`

Global CSS must expose reusable variables or classes for these modes. Route-specific CSS is forbidden in E01.

## Typography And Spacing Rules

Implementation must support text roles equivalent to:

```ts
export type UxPrimitiveTextRole =
  | "eyebrow"
  | "heading"
  | "body"
  | "metadata"
  | "caption";
```

Required semantics:

- `eyebrow`: small uppercase contextual label.
- `heading`: local section or card heading, not page hero scale.
- `body`: default readable paragraph/list copy.
- `metadata`: compact supporting data, timestamp, object ID or route-safe context.
- `caption`: low-emphasis support copy that remains legible in dark theme.

Text roles must not use negative letter spacing or viewport-scaled fonts.

## Semantic Status Rules

Implementation must support semantic status families equivalent to:

```ts
export type UxPrimitiveStatusFamily =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "critical"
  | "restricted"
  | "internal";
```

Required semantics:

- `neutral`: passive/default/read-only status.
- `info`: in-progress, scheduled or processing state.
- `success`: completed, active or passed state.
- `warning`: pending, evidence needed, validation, redaction or hold state.
- `critical`: failed, denied, blocked or escalated state.
- `restricted`: hidden, redacted or permission-limited state.
- `internal`: internal-only or reviewer-only state, never client visibility.

Every semantic status primitive must expose non-color cues:

- icon or visible label.
- accessible label where the status is compressed.
- runtime status-family metadata.

Color alone is not acceptance.

## Runtime Attribute Rules

Shared primitives touched by E01 must project stable attributes equivalent to:

- `data-ux-primitive`
- `data-ux-primitive-density`
- `data-ux-primitive-spacing`
- `data-ux-text-role`
- `data-ux-status-family`
- `data-ux-status-severity`
- `data-ux-status-color-only="false"`

These attributes support source/runtime QA without turning proof metadata into visible operational UI.

## Component Scope

E01 implementation may touch:

- `app/globals.css`
- `lib/ux-design-system-foundation.ts`
- `components/ui/badge.tsx`
- `components/ui/status-chip.tsx`
- `components/ui/workflow-badge.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/a11y-status.tsx`
- `components/ui/index.ts`
- focused tests and proof reports

E01 implementation must not touch route-family screens unless typecheck forces a narrow import update. Broad route adoption belongs to downstream epics.

## Export Rules

`components/ui/index.ts` must export reusable design-system primitives and support components needed by downstream work:

- `a11y-status`
- `badge`
- `disabled-control-reason`
- `state-panel`
- `status-chip`
- `workflow-badge`
- existing shared primitives already exported today

The E01 contract file must export typed helpers for density, text-role and status-family attributes/classes.

## Test Expectations

Minimum validation:

- `pnpm guard:source`
- `pnpm typecheck`
- focused E01 source/contract test, recommended: `tests/ux-design-system-foundation.spec.ts`
- existing shared primitive/lifecycle tests where touched:
  - `pnpm playwright test tests/true-ux-shared-primitives.spec.ts tests/ux-lifecycle-state-contract.spec.ts tests/ux-design-system-foundation.spec.ts --workers=1`

Screenshot proof is required only if a visible UI review is performed after style changes. E01 should avoid route-specific visual changes; visible changes are app-wide token refinements rather than screen redesign.

## Acceptance Criteria

| Criterion | Required Result |
| --- | --- |
| Tokens cover compact/default/comfortable density where relevant | E01 density helpers and CSS variables/classes exist |
| Status primitives expose semantic state variants with non-color cues | Badge, StatusChip, WorkflowBadge and StatePanel project family/severity/color-only metadata and keep icon/label cues |
| State primitives support loading, error, empty, permission, blocked, success and internal-only variants | StatePanel continues to support existing E04 states and projects E01 semantic status metadata |
| Exports are stable through `components/ui/index.ts` | Touched shared primitives and support components export centrally |
| No screen-specific workaround introduced | No route-family screen redesign in E01 |
| E00 Option A is preserved | E01 does not create visible proof/debug scaffolding in operational default UI |

## Downstream Tickets

| Ticket | Status | Scope |
| --- | --- | --- |
| `E01-I1` | Ready | Implement spacing, typography and density tokens via global CSS and E01 contract helpers. |
| `E01-I2` | Blocked until `E01-I1` | Harden status, badge and state primitives using E01 semantic status metadata. |
| `E01-I3` | Blocked until `E01-I2` | Normalize exports and focused E01 design-system tests. |
| `E01-Q1` | Blocked until implementation | Validate design-system foundation. |

## Ticket Result

`E01-S1` is complete. `E01-I1` is enabled.
