# AlphaVest ImageGen Artifact Structure V3

Status: Phase A preparation artifact.  
Scope: Folder and file contract for future ImageGen-to-UI tickets. This document does not authorize ImageGen generation by itself.

Alias term for reports and searches: ImageGen-Artefaktstruktur.

## Required Folder Shape

Each generated screen gets one isolated artifact folder:

```text
artifacts/imagegen/<ticket-id>/<screen-or-route-slug>/
  reference-app.png
  prompt.md
  generated-mockup.png
  implementation-map.md
  human-visual-review.md
  screenshot-proof-status.md
  README.md
```

Use lowercase slugs, for example:

```text
artifacts/imagegen/B-05/kyc-review/
artifacts/imagegen/C-05/ips-tenant-profile/
```

## Required Files

| File | Required when | Source | Acceptance note |
| --- | --- | --- | --- |
| `reference-app.png` | Before ImageGen | Real screenshot from the running AlphaVest app | Required ImageGen input; not final proof. |
| `prompt.md` | Before ImageGen | Human Visual Standard + implementation-map | Must record route, state, role/tenant/context and forbidden artifacts. |
| `generated-mockup.png` | After ImageGen | ImageGen output | Design reference only; not screenshot proof and not acceptance proof. |
| `implementation-map.md` | Before UI edits | `IMPLEMENTATION_MAP_TEMPLATE_V3.md` | Must be completed before product UI changes. |
| `human-visual-review.md` | After UI implementation screenshot | `HUMAN_VISUAL_REVIEW_RUBRIC_RESULT_TEMPLATE_V3.md` | Records rubric result and explicit gaps. |
| `screenshot-proof-status.md` | After screenshot capture attempts | `SCREENSHOT_PROOF_STATUS_TEMPLATE_V3.md` | Separates screenshot proof from technical tests. |
| `README.md` | Always | Ticket owner | Summarizes ticket, route, state, artifact status and blockers. |

## Prompt Requirements

`prompt.md` must include:

- source ticket ID and phase,
- target route and state,
- role, tenant and actor context,
- path to `reference-app.png`,
- path to the implementation-map,
- forbidden output: spec panels, route labels, filenames, annotation rails, dev notes, prompt metadata, debug panels and visible state toggles,
- statement that the result is a design reference only,
- explicit product limits: no invented persistence, advice release, audit or evidence semantics.

## Screenshot-Proof Separation

`reference-app.png` and `generated-mockup.png` are not implementation screenshot proof. A future implementation ticket still needs a screenshot captured from the running implemented route and a Human Visual Review Rubric result.

## Non-Overwriting Rule

Do not overwrite prior artifact folders. If a route needs another pass, create a sibling run folder:

```text
artifacts/imagegen/<ticket-id>/<screen-or-route-slug>-rerun-YYYYMMDD-HHMM/
```

## Phase A Status

Phase A creates this structure contract only. No `reference-app.png`, `generated-mockup.png` or implementation screenshot proof was created in Phase A.
