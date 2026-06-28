# Process-First Non-Negotiable Route-Smoke Proof

Date: 2026-06-28

## Scope

- Added a project-level operational UI non-negotiable for internal route/task/process/proof/debug scaffolding.
- Extended the non-negotiable so every UI screenshot proof requires an explicit 1400x900 visual audit.
- Added forbidden classes for badge clusters, status-chip state guidance, dense operations/scope proof strips, gate/scope/process explainer panels, command-spine copy and artificially empty/short operational surfaces.
- Hardened `pnpm guard:source` so visible operational UI copy fails when it exposes internal proof or process scaffolding.
- Removed visible route-summary banners, dense operations proof chrome and badge-based state guidance from the audited operational routes.
- Rebased the red route-smoke cluster to process-first UI contracts for advisor review, compliance decision room, export redaction/approval and governance hub/detail.
- Reworked the access-request governance screen from a gate/scope explainer into a real request-review surface backed by the existing access-request demo data.
- Removed stale route-smoke expectations that forced legacy UX proof panels onto product surfaces.

## Proof

- `pnpm exec tsc --noEmit --pretty false`
- `pnpm guard:source`
- `pnpm visual:audit-operational --reporter=line`
- `pnpm exec playwright test tests/route-smoke.spec.ts -g "process-first release and governance route contracts|advisor queue search filters|compliance queue search filters|export dense tables|UX-COMPLEXITY CTA clusters|governance admin non-bypass chain|keeps the EPIC-06 core surface viewport-fit" --workers=1 --reporter=line`

Result: all commands passed. Focused route-smoke cluster: 22 passed. Operational visual audit: 4 passed at 1400x900.

## Screenshots

- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900/advisor-reviews.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900/compliance-reviews.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900/export-redaction.png`
- `artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900/governance-access-request.png`

Each screenshot is produced by `tests/operational-visual-audit.spec.ts` and is paired with audit checks for viewport fit, page scroll, horizontal overflow, table/text clipping, summary banners, badge clusters, proof strips, gate/scope/process explainer panels, primary action visibility and minimum operational substance.

## Decision Notes

- Stale UX-HUB, UX-PAGE detail and UX-DENSITY proof-panel expectations were treated as contract debt, not as UI requirements.
- Internal page IDs remain available as DOM/test metadata where needed for route registry and automation, but are no longer surfaced as product copy.
- Empty/sparse operational screens are not acceptable substitutes for long-page cleanup; meaningful space should be filled with real object context, decision context, evidence, history, checks or next actions when available.
- Explicit proof-reviewer surfaces remain excluded from the operational UI guard because they are not default product UI.
