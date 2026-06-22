# AlphaVest Surface Copy Handbook Rule

This note captures the UX refactoring copy rule that emerged during UX-DENSITY-004.

## Product Surface Rule

AlphaVest application screens must show product work, not implementation explanation.

Allowed in app UI:

- current object or queue status
- data rows, filters, sort controls and row actions
- primary next step and recovery actions
- concise gate state such as blocked, restricted, pending, approved or released
- client visibility, evidence, audit, RBAC and export caveats when they directly affect the user's current action

Not allowed as visible app UI:

- route IDs, route labels, filenames or task IDs
- UX methodology labels such as D1, D2, D3, D4, complexity reduction or page-type policy
- proof-language such as visual proof, gate-completion proof or route-presence proof
- explanatory documentation about why the app is structured a certain way
- implementation notes, source-of-truth references or policy-matrix wording

Those explanatory materials belong in the user manual, QA reports and implementation handoff, not in the product surface.

## Current Application Move

The UX-DENSITY-004 slice moves shared AlphaVest UI toward this rule by replacing visible route/spec copy with product-native context labels, status labels, controls and concise gate states. The source metadata remains testable through `data-*` attributes and reports, but it should not read as app content.
