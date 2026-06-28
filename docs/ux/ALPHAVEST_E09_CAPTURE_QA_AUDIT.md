# AlphaVest E09 Capture QA Audit

Epic: E09 - Screenshot Capture QA and Regression Automation

Status: retired on 2026-06-28. The active replacement is the operational
1400x900 screenshot audit in `tests/operational-visual-audit.spec.ts`.

Do not reintroduce `scripts/capture-qa-contract.ts`,
`scripts/strict-visual-capture.ts`, `visual:capture-qa`,
`visual:capture-qa:release` or `visual:strict` as acceptance gates.
Ticket: E09-A1 - Analyse current capture scripts and output structure
Baseline commit: fd0e3c3 feat: implement e08 visual density accessibility
Branch: full-workflow

## Scope Inspected

- `scripts/capture-routes-and-modals.ts`
- `scripts/strict-visual-capture.ts`
- `scripts/visual-qa-contract.ts`
- `tests/capture-routes-and-modals-contract.spec.ts`
- Existing artifact roots under `artifacts/routes-and-modals/`, `artifacts/strict-visual-review/` and `artifacts/visual-qa/`
- E03/E04/E08 UX specs and proof reports that define proof/reviewer mode, lifecycle state variants and density/accessibility expectations

## Current Capture Outputs

`scripts/capture-routes-and-modals.ts` already writes a structured run folder under `artifacts/routes-and-modals/<run>/`:

- `index.json` with `auditBaseline`, `baseUrl`, `captureMode`, `captureVariantContract`, `captureVariantCounts`, `generatedAt`, `items` and `sidecarsEnabled`.
- `index.md` with route, state, capture variant, file kind, overlay, status, operating mode, proof posture, warnings and sidecar references.
- Per-capture screenshots named with page id, route slug, lifecycle kind and state slug.
- Optional sidecars for rendered DOM/CSS, component runtime summary, DOM rect trace, React source trace and interaction proof trace.

`scripts/strict-visual-capture.ts` already writes a structured run folder under `artifacts/strict-visual-review/<run>/`:

- `strict-review-dom-metrics.json` with viewport-specific screenshot metadata and DOM metrics.
- `index.md` with page, route, capture variant, file kind, overlay, viewport, model capability, screenshot, overflow and cramped-text counts.
- `normal-screen-model-context.json` and `.md`.
- Desktop/mobile contact sheets.

`scripts/visual-qa-contract.ts` writes `artifacts/visual-qa/visual-contract-result.json` with route/asset/fetch validation and forbidden visual chrome checks.

## Existing Strengths

- E04 lifecycle variants are already canonicalized through `uxCaptureVariantForFileKind`.
- Base, modal, drawer and confirmation captures are distinguishable in filenames and index rows.
- Capture scripts already keep proof metadata outside default operational UI.
- `strict-visual-capture` already measures horizontal overflow and cramped text.
- Capture scripts can run against existing generated output without changing route code.

## E09 Gaps

1. There is no standalone capture QA script that checks an existing capture folder offline.
2. Metadata is emitted, but not validated as a reusable gate for route id, route, state, file kind, lifecycle kind, overlay mode, screenshot path and dimensions.
3. Screenshot naming follows a convention, but missing/ambiguous filenames are not reported independently from capture generation.
4. Duplicate-state risk is not grouped or reported across route/state/variant/viewport keys.
5. Long-screen risk is partially observable through DOM metrics, but there is no explicit height/scroll-burden report.
6. `visual-qa-contract` checks source/route contract, but does not validate capture manifests or screenshot review discipline.
7. No repeatable E01-E08 UX sign-off artifact exists for release-style QA.

## Recommendation

Implement a separate `scripts/capture-qa-contract.ts` gate and make the existing capture scripts optionally invoke it after writing their output. This is the bold cleanup path: it centralizes capture QA as a real code artifact instead of scattering reviewer expectations across markdown, screenshots and test-only string checks.

The gate should be warning-first by default because legacy artifact folders may be noisy. It should support hard failure via an explicit environment variable so future CI can ratchet the standard without breaking all old captures immediately.
