# AlphaVest E09 Capture QA Specification

Epic: E09 - Screenshot Capture QA and Regression Automation
Ticket: E09-S1 - Specify capture QA rules

## Decision

Capture QA is a code-backed contract, not a manual screenshot review convention. Existing capture output must be checkable offline, and capture scripts may generate a QA report immediately after a run.

## Supported Inputs

The E09 QA contract accepts:

- Routes/modal capture run folders with `index.json` from `scripts/capture-routes-and-modals.ts`.
- Strict visual capture run folders with `strict-review-dom-metrics.json` from `scripts/strict-visual-capture.ts`.
- A root folder containing one or more of those run folders.

The default input is `artifacts/` so the script can inspect existing captures without generating new screens.

## Metadata Rules

Each capture item must expose:

- route id or page id.
- route path.
- state label.
- screenshot path.
- capture variant lifecycle kind.
- capture file kind.
- overlay flag.
- status.
- model/proof metadata when emitted by the source manifest.
- dimensions when available from metrics or image headers.

Routes/modal captures must use filenames in this shape:

`<pageId>-route-<routeSlug>-<lifecycleKind>-<stateSlug>.png`

Strict visual captures must use filenames in this shape:

`<assetSlug>-<lifecycleKind>-<viewport>.png`

The QA script must report missing metadata and ambiguous naming as warnings by default. Hard failure is opt-in with `CAPTURE_QA_FAIL_ON_WARNINGS=1`.

## Duplicate-State Rules

The QA script groups screenshots by:

- source kind.
- route id or page id.
- route path.
- state label.
- capture lifecycle kind.
- capture file kind.
- overlay flag.
- viewport when present.

Multiple screenshots for the same group are duplicate-state warnings unless they are from different run folders. Collisions within one run are stronger warnings because they can confuse reviewer evidence.

## Base/Overlay Rules

Overlay captures must not be ambiguous:

- `modal`, `drawer` and `confirmation` lifecycle kinds require `isOverlay=true`.
- `base` lifecycle kind requires `isOverlay=false`.
- A `screen` file kind must not claim overlay state.
- Overlay states must not be named `base`.

## Long-Screen Rules

Long-screen risk is reported from available dimensions:

- `height > 2200px` is a long-screen warning.
- `height > 3200px` is a severe long-screen warning.
- `scrollHeight / viewportHeight >= 2.25` is a scroll-burden warning when both values are available.
- Horizontal overflow remains a warning when `scrollWidth > clientWidth`.

The default long-screen threshold is intentionally strict enough to catch review pain, but report-only by default to avoid breaking legacy captures.

## UX Sign-Off Rules

The generated sign-off checklist must cover E01-E08:

- E01 design-system/operating-mode foundation.
- E02 page template and layout discipline.
- E03 proof/reviewer separation.
- E04 base/modal/drawer/confirmation lifecycle boundaries.
- E05 action hierarchy and feedback.
- E06 data-surface, filtering and master-detail discipline.
- E07 client-safe/internal separation.
- E08 density, focus and semantic status accessibility.

The checklist is not a design approval replacement. It is a repeatable acceptance artifact for capture review and regression discipline.

## Output Contract

The QA script writes:

- `artifacts/capture-qa/capture-qa-report.json`
- `artifacts/capture-qa/capture-qa-report.md`
- `docs/v3/proof/e09_capture_qa_signoff_checklist.md` when explicitly requested through the sign-off script

Each report must include checked counts, warning counts, failure counts, duplicate-state clusters, long-screen risks and metadata/naming findings.
