# AlphaVest E08 Visual Density, Accessibility And Status Semantics Audit

Source epic: E08 - Visual Density, Dark-Theme Accessibility and Status Semantics.

Audit status: E08-A1 complete.

## Scope Read

E08 is a shared-primitives cleanup epic. It is not a per-screen polishing pass and it is not a WCAG certification task.

The executable scope is:

- shared text hierarchy and spacing rules
- visible focus, selected and active states
- semantic status and alert hierarchy
- non-color-only state cues
- dense dark-theme readability across shared page, card, data and state primitives

## Existing Strengths

- `lib/ux-design-system-foundation.ts` already provides primitive density, text role and status-family contracts.
- `app/globals.css` already defines density, text role, focus-ring and status-family CSS tokens.
- `Badge`, `StatusChip` and `WorkflowBadge` already expose status-family runtime attributes.
- `StatePanel` already maps component lifecycle states to primitive status families.
- `DataTable` already carries E06 data-surface density and action-policy attributes.

## Risks Found

### R1 - Focus standards are not canonical

Several shared interactive primitives use local focus behavior or no visible focus class at all:

- `components/ui/action-zone.tsx`
- `components/ui/guarded-action-button.tsx`
- `components/ui/data-table.tsx`
- `components/ui/filter-bar.tsx`
- `components/ui/page-template.tsx`

The repo has an `av-focus-ring` class, but it is not a required shared interaction contract.

### R2 - Selected and active states are not a shared primitive

Current active states are mostly encoded as ad hoc tone choices, labels or data attributes. There is no canonical `selected` or `active` visual primitive for navigation links, tabs, sortable table headers, active filters or selectable rows.

### R3 - Status semantics exist, but hierarchy is still too visual-component-specific

`Badge`, `StatusChip`, `WorkflowBadge` and `StatePanel` use status families, but there is no explicit semantic meaning layer for:

- info
- warning
- blocked
- success
- destructive
- restricted
- internal
- neutral

This allows repeated safety/status blocks to be technically annotated while still blending together visually.

### R4 - Non-color cue claims are stronger than some renderers

`uxPrimitiveStatusAttributesFor` exposes `data-ux-status-color-only="false"`. That is accurate for `StatusChip` and `WorkflowBadge`, because they render icons and labels. It is weaker for plain `Badge`, because plain badges can still rely on tone plus content text and do not expose a semantic cue consistently.

### R5 - Density tokens exist, but shared primitives still hardcode density

The repo already has E01 density tokens and E06 data-surface density presets. Some shared primitives still hardcode spacing:

- `Card` and `MetricCard` use fixed padding/height patterns.
- `DataTable` maps density through E06 attributes but still uses local `compact` branching for cell padding.
- Mobile table cards use one fixed padding stack.
- Filter surfaces use fixed spacing independent of density intent.

### R6 - Dark-theme readability is uneven at the primitive layer

Secondary labels use the right palette family, but contrast and scanability depend on the component. Tables, metric cards, state panels and filter summaries need the same readability attributes/classes so tests can distinguish intentional density from cramped UI.

## Implementation Direction

E08 should consolidate existing foundations instead of adding a parallel accessibility layer.

The recommended path is:

1. Extend `ux-design-system-foundation` with interaction-state and semantic-status contracts.
2. Add canonical CSS classes for focus, selected, active, readable density and semantic status markers.
3. Update shared primitives to use those contracts.
4. Update tests to assert the shared contracts, not individual visual taste.

## Decision

No user decision is required before implementation. The missing exact style choices can be resolved inside the existing AlphaVest design system:

- focus: gold outline plus offset and box-shadow
- selected: left/top inset semantic marker plus stronger border
- active: pressed/raised contrast with non-color data attribute
- blocked/destructive: icon-and-label hierarchy, never color-only
- density: compact shared primitives stay dense but receive stable min-size, line-height and readable surface attributes

