# AlphaVest Implementation-Map Template V3

Status: Phase A preparation artifact.  
Scope: Required before any future ticket edits product UI from an ImageGen output, screen reference or visual mock.

## Purpose

An `implementation-map` prevents visual work from jumping straight from a reference image into product UI. It records what route, component, state, data and proof surface will be touched before implementation begins.

DOM success is not design acceptance. The map is a prerequisite, not the final proof.

## Required Chain

```text
route -> component(s) -> state(s) -> role/tenant/context -> existing AlphaVest reference screenshot -> ImageGen visual -> source data/seed -> interaction shape -> expected assertion/proof -> verification status
```

## Copy Template

```markdown
# Implementation Map - [TICKET_ID] - [SCREEN_OR_ROUTE]

Date:
Owner:
Phase:
Completion Status Label: not verified

## Source Contract

- Human Visual Standard read order completed: yes/no
- AlphaVest source files read: yes/no
- Workflow plan ticket IDs:
- Product rule affected:
- No-unapproved-advice risk: none/low/medium/high

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | |
| Route registry entry | |
| Pageflow/Userflow | |
| Component(s) expected to change | |
| Shared primitives expected to change | |
| Files expected to change | |
| Files explicitly out of scope | |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | | | not verified |
| loading | yes/no | | | not verified |
| empty | yes/no | | | not verified |
| error | yes/no | | | not verified |
| disabled | yes/no | | | not verified |
| hover | yes/no | | | not verified |
| focus | yes/no | | | not verified |
| modal | yes/no | | | not verified |
| drawer | yes/no | | | not verified |
| overlay | yes/no | | | not verified |
| validation | yes/no | | | not verified |
| success | yes/no | | | not verified |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | |
| Tenant(s) | |
| Actor/user fixture | |
| Seed objects | |
| Permission assumptions | |
| Evidence/audit assumptions | |
| Product behavior not being claimed | |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `reference-app.png` required before ImageGen | Real running app screenshot, not generated. |
| ImageGen visual | `generated-mockup.png` required only for ImageGen tickets | Design reference only; not screenshot proof. |
| Reference catalogue asset | | From `public/reference/page_ui_v3/clean_pages/` when relevant. |
| Prompt | `prompt.md` required for ImageGen tickets | Must record source route, state, role and forbidden artifacts. |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes/no | |
| Modal | yes/no | |
| Drawer | yes/no | |
| Overlay | yes/no | |
| Wizard/step | yes/no | |
| Confirmation | yes/no | |
| Blocked/restricted state | yes/no | |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes/no | | not verified |
| Route smoke/Playwright | yes/no | | not verified |
| Screenshot proof | yes | | not verified |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | not verified |
| Accessibility/semantic review | yes/no | | not verified |
| Evidence/audit/persistence proof | yes/no | | not verified |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| | not scanned | |
```

## Acceptance

The map is implementation-ready only when it names the route, component(s), states, role/tenant/context, reference screenshot, ImageGen visual status, source data/seed, interaction shape, expected assertion/proof and verification status.

Use one of the approved Completion Status Labels from `docs/v3/COMPLETION_STATUS_LABELS_V3.md` for every unresolved item.
