# True-UX Blocker Remediation Report

Date: 2026-06-22
Branch: `full-workflow`
Status: `READY`

## Analysis

This remediation phase addressed the failing test surface discovered after the True-UX phase work. The original blocker set was treated as either stale test-contract drift against the current True-UX source of truth or as a real UI regression where the app surface no longer exposed the required user-facing proof.

Primary remediation categories:

- Migrated stale route expectations from legacy paths such as `/portal`, `/workbench`, `/compliance/demo/*`, `/governance/roles`, `/documents/extraction-review`, and old export/governance assumptions to the current True-UX route registry.
- Updated route workset count assertions to the current moving baseline: `MVP=39`, `MVP_SUPPORT=29`, `P1_AFTER_MVP=0`, `REFERENCE_ONLY=3`, `HOLD_PENDING_DECISION=0`.
- Replaced old E2E source-lock expectations with True-UX handoff and superseded-pack assertions.
- Scoped duplicated tenant/role controls in tests to the current app shell reality instead of assuming one global select.
- Stabilized above-fold density proof against the actual visible DOM contract under full-suite load.
- Fixed real UI regressions where product guidance/action-rail proof was hidden or pushed below the required working surface.

## Implementation Plan Executed

1. Reproduce the blocker surface with targeted suites and the full suite.
2. Classify each failure as stale True-UX contract, selector ambiguity, test timing gap, or real UI regression.
3. Migrate stale assertions to current routes, labels, source hierarchy, route counts and fail-closed language.
4. Patch real UI regressions in product guidance/action-rail visibility and export scope panel ordering.
5. Validate first with focused suites, then with `phase:check`, then with the full Playwright suite.

## Artifact

Changed implementation files:

- `components/communication-export-ops-screen.tsx`
- `components/product-guidance-panel.tsx`
- `lib/p0-acceptance-proof.ts`
- `lib/scf-foundation.ts`
- `lib/source-reality-gate.ts`

Changed test/proof files:

- `tests/confirmation-lifecycle.spec.ts`
- `tests/dummy-auth-provider.spec.ts`
- `tests/e2e/e2e-journey-proof-ws00-ws05.spec.ts`
- `tests/foundation-guardrails.spec.ts`
- `tests/interaction-lifecycle.spec.ts`
- `tests/navigation-shell.spec.ts`
- `tests/p0-acceptance.spec.ts`
- `tests/p0-api-contract.spec.ts`
- `tests/product-guidance-shell.spec.ts`
- `tests/route-smoke.spec.ts`
- `tests/scf-p04-p06-flow-ui.spec.ts`
- `tests/scf-p07-p09-trust-ui.spec.ts`
- `tests/scf-p10-p14-closure.spec.ts`
- `tests/scf-scope-control-ui.spec.ts`
- `tests/ui-clickflow-phase06-10.spec.ts`
- `tests/ui-state-boundaries.spec.ts`

## Validation

Focused validation:

- `PLAYWRIGHT_PORT=3094 pnpm playwright test tests/confirmation-lifecycle.spec.ts tests/interaction-lifecycle.spec.ts tests/dummy-auth-provider.spec.ts tests/e2e/e2e-journey-proof-ws00-ws05.spec.ts tests/foundation-guardrails.spec.ts tests/navigation-shell.spec.ts tests/source-reality-gate.spec.ts tests/p0-acceptance.spec.ts --workers=1 --reporter=line`
- Result: `57 passed`

Remediation regression validation:

- `PLAYWRIGHT_PORT=3106 pnpm playwright test tests/p0-api-contract.spec.ts tests/product-guidance-shell.spec.ts tests/route-smoke.spec.ts tests/scf-p04-p06-flow-ui.spec.ts tests/scf-p07-p09-trust-ui.spec.ts tests/scf-p10-p14-closure.spec.ts tests/scf-scope-control-ui.spec.ts tests/ui-clickflow-phase06-10.spec.ts tests/ui-state-boundaries.spec.ts --workers=1 --reporter=line`
- Result: `383 passed`

Targeted final fixes:

- `PLAYWRIGHT_PORT=3109 pnpm playwright test tests/route-smoke.spec.ts -g "043 /decisions shows job|044 /decisions/demo shows job" --workers=1 --reporter=line`
- Result: `2 passed`
- `PLAYWRIGHT_PORT=3111 pnpm playwright test tests/route-smoke.spec.ts tests/scf-scope-control-ui.spec.ts -g "016 /tenants/demo/team shows job|017 /tenants/demo/policies shows job|evaluates route shell" --workers=1 --reporter=line`
- Result: `3 passed`

Phase gate:

- `pnpm phase:check`
- Result: passed
- Notes: existing warnings remain: 32 ESLint unused-symbol warnings and 3 Turbopack/NFT warnings around dynamic document storage tracing.

Full validation:

- `PLAYWRIGHT_PORT=3112 pnpm playwright test --workers=1 --reporter=line`
- Result: `627 passed (3.3m)`

Positive acceptance:

- The original blocker families are migrated to the current True-UX route/source/validation truth.
- The full Playwright suite is green.
- The strongest repo phase gate is green.
- Product guidance and above-fold route job contracts are visible and test-stable across the full suite.

Negative acceptance:

- Old `/portal`, `/workbench`, stale compliance demo routes, stale governance role routes and stale extraction-review routes are no longer treated as active implementation truth.
- Advisor approval is still not treated as compliance release.
- Upload success is still not treated as evidence sufficiency, release, export, or client visibility.
- Reference-only routes remain outside productive implementation navigation.

## Open Risks

- `next-env.d.ts` is intentionally left unstaged because it is generated/unrelated to this remediation phase.
- Build still reports existing Turbopack/NFT warnings for dynamic document storage path tracing.
- ESLint still reports existing unused-symbol warnings in broader UI files.
- Repeated Playwright runs can leave stale Next dev server locks; when this occurred, the exact reported PID was stopped before rerun.
