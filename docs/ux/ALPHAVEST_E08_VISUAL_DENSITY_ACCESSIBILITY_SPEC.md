# AlphaVest E08 Visual Density, Accessibility And Status Semantics Spec

Source epic: E08 - Visual Density, Dark-Theme Accessibility and Status Semantics.

Spec status: E08-S1 complete.

## Contract

E08 introduces a shared primitive contract for visible interaction states, semantic status meanings and dark-theme density/readability.

The implementation must avoid per-screen compaction and local focus hacks. Shared components must consume the same foundation helpers and CSS classes.

## Interaction State Rules

Every shared interactive primitive must expose a visible focus state through the canonical focus class.

Required interaction states:

- `focus-visible`: keyboard focus is visible through outline and shadow.
- `selected`: current selection is visible through border, surface and a non-color marker.
- `active`: active/pressed/current state is visible through border, surface and a non-color marker.
- `disabled`: disabled controls retain accessible disabled reason where applicable.

Runtime attributes:

- `data-ux-interaction-state`
- `data-ux-focus-visible="required"` for focusable shared primitives
- `data-ux-selected-cue="marker-and-label"` when selected state is represented
- `data-ux-active-cue="marker-and-label"` when active/current state is represented

Canonical CSS classes:

- `av-focus-ring`
- `av-selected-state`
- `av-active-state`
- `av-disabled-state`

## Semantic Status Rules

Shared status surfaces must separate status family from semantic meaning.

Canonical semantic meanings:

- `info`
- `warning`
- `blocked`
- `success`
- `destructive`
- `restricted`
- `internal`
- `neutral`

Runtime attributes:

- `data-ux-status-family`
- `data-ux-status-meaning`
- `data-ux-status-color-only="false"`
- `data-ux-status-non-color-cue`
- `data-ux-status-hierarchy`

Non-color cue requirement:

- Blocking, destructive, warning, restricted and internal states must use icon-and-label or marker-and-label.
- Neutral status may use label-only when the label itself carries the meaning.
- Components must not rely on color alone to distinguish critical safety status.

## Density And Readability Rules

Density is allowed only as a shared primitive or data-surface contract.

Required density levels:

- `compact`: dense operations, still readable, no text clipping.
- `default`: standard review surfaces.
- `comfortable`: state panels, cards and detailed review content.

Runtime attributes:

- `data-ux-primitive-density`
- `data-ux-primitive-spacing`
- `data-ux-density-readability="true"`

Canonical CSS classes:

- `av-density-compact`
- `av-density-default`
- `av-density-comfortable`
- `av-readable-surface`
- `av-readable-secondary`

## Component Mapping

### Badge

- Must keep primitive density and status attributes.
- Must expose semantic status meaning.
- Must support a visible status cue for non-neutral status.

### StatusChip And WorkflowBadge

- Must remain icon-and-label status renderers.
- Must pass through semantic status meaning.

### StatePanel

- Must render status hierarchy visibly.
- Must expose semantic status meaning and readable density attributes.

### DataTable

- Sort controls and row actions must use canonical focus styles.
- Active sort state must expose `active` interaction semantics.
- Cell padding must derive from the data-surface density preset instead of local-only compact branching.
- Rows and mobile cards must expose readable density attributes.

### FilterBar

- Search inputs and reset controls must use canonical focus styles.
- Active filter tabs must expose selected state semantics.
- Filter summaries must use readable density attributes.

### Card And MetricCard

- Must use primitive density/readability attributes.
- Must not rely on one-off hardcoded compaction for shared card spacing.

## Acceptance

E08 is complete when:

- representative shared interactive components expose visible focus states
- selected and active states use canonical attributes/classes
- status surfaces expose semantic meaning and non-color cue metadata
- dense shared data/card areas remain readable in dark theme
- tests cover the foundation contract and representative renderers

