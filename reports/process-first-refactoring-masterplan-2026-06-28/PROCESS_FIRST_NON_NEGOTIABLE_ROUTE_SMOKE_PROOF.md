# Process-First Non-Negotiable Route-Smoke Proof

Date: 2026-06-28

## Scope

- Added a project-level operational UI non-negotiable for internal route/task/process/proof/debug scaffolding.
- Hardened `pnpm guard:source` so visible operational UI copy fails when it exposes internal proof or process scaffolding.
- Removed visible `Route ###` status chips from operational product surfaces.
- Rebased the red route-smoke cluster to process-first UI contracts for advisor review, compliance decision room, export redaction/approval and governance hub/detail.
- Removed stale route-smoke expectations that forced legacy UX proof panels onto product surfaces.

## Proof

- `pnpm exec tsc --noEmit --pretty false`
- `pnpm guard:source`
- `pnpm exec playwright test tests/source-reality-gate.spec.ts tests/surface-copy-guard.spec.ts --workers=1 --reporter=line`
- `pnpm test:route-smoke`

Result: all commands passed. Full route smoke: 180 passed.

## Screenshots

- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/advisor-reviews.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/compliance-reviews.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/export-redaction.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/governance-access-request.png`

## Decision Notes

- Stale UX-HUB, UX-PAGE detail and UX-DENSITY proof-panel expectations were treated as contract debt, not as UI requirements.
- Internal page IDs remain available as DOM/test metadata where needed for route registry and automation, but are no longer surfaced as product copy.
- Explicit proof-reviewer surfaces remain excluded from the operational UI guard because they are not default product UI.
