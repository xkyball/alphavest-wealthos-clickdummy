# Design System and Visual Rules V3

## AlphaVest design lock

All screens must use a consistent AlphaVest design system:

- deep navy / midnight / charcoal base,
- ivory typography,
- champagne-gold highlights,
- clean enterprise cards,
- tables and forms with subtle dividers,
- left navigation for desktop app pages,
- top bar with search, role/tenant context and user controls,
- modal overlays and side drawers implemented consistently,
- premium but usable enterprise SaaS feel.

## Visual references are mandatory but not pixel-perfect

Codex must inspect the referenced page image for each screen. However:

- do not copy exact pixel dimensions,
- do not preserve inconsistent spacing between generated images,
- do not let typography scale jump between pages,
- do not implement each generated image as an isolated design,
- normalize all screens into one coherent component system.

## Layout normalization rule

Create shared layout constants:

```text
Sidebar width
Topbar height
Page max width
Card radius
Card padding
Grid gutters
Table row height
Form field height
Modal widths
Drawer widths
Status chip size
Button sizes
```

All screens should use those values, even if a reference image differs.

## What to implement from images

Implement:

- actual app screen area,
- app navigation,
- top bar,
- cards,
- tables,
- forms,
- modals,
- drawers,
- wizards,
- status chips,
- workflow states,
- primary actions,
- disabled states,
- restricted/blocked states,
- loading/empty/error states where specified.

Do not implement:

- filename labels,
- route labels,
- external annotation rails,
- generated-image captions,
- dev notes,
- callout legends,
- prompt/spec metadata,
- page numbers unless naturally part of a wizard.

## Modal and drawer rule

- Modal: centered, above dimmed/blurred background, focus state, cancel/confirm actions.
- Drawer: right-side or left-side panel, parent page remains visible and not blurred unless modal is also open.
- Bottom sheet: only for mobile flows.
- Reference/internal pages: render as real internal app pages, not posters.

## Hard copy rule

Use concise UI copy only. For advice/recommendation/release screens, short copy may appear:

> No unapproved advice reaches the client.

Do not add long explanatory text unless it naturally belongs to the app UI.
