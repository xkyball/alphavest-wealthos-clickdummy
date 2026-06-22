# AlphaVest UXP2 Phase 2 Fake Affordance Pruning Completion Report

## Status

| Field | Value |
| --- | --- |
| Phase | Phase 2 - Fake Affordance Pruning |
| Completion status | `COMPLETED_WITH_SMOKE_DEFERRED` |
| Last updated | 2026-06-22 by `UXP2-010` |
| Product authority added | None |
| Route authority added | None |
| Schema/API authority added | None |

## Scope Completed

| Task | Result |
| --- | --- |
| `UXP2-001` | Global search kept only where scoped DB lifecycle exists; registered-only routes keep search disabled. |
| `UXP2-002` | Fake filter affordances removed, disabled with reasons, or made static/non-interactive. |
| `UXP2-003` | Shared table sort kept only where visible row reordering and ARIA sort state exist. |
| `UXP2-004` | Status chips, badges and workflow badges confirmed as static indicators. |
| `UXP2-005` | Cards and KPI surfaces confirmed as static summaries, not implicit actions. |
| `UXP2-006` | Row, timeline and evidence affordances either lifecycle-backed, disabled with reason, or static. |
| `UXP2-007` | Dummy buttons/CTAs removed or changed to static status; lifecycle-backed controls kept. |
| `UXP2-008` | Reference routes `061-063` expose no product controls. |
| `UXP2-009` | P1/HOLD routes expose no product controls; only static `Deferred`/`Held` guard status remains. |
| `UXP2-010` | Disabled/static controls expose accessible reason messaging through shared primitives and action-board controls. |

## Acceptance Result

- No Phase 2 task added product behavior, API, schema or route scope.
- Fake controls touched by Phase 2 are removed, made static, disabled with reason, or kept only with lifecycle proof.
- P1, HOLD and reference route worksets did not gain product interactions.
- Disabled controls touched in UXP2-010 expose reason messaging through visible text or screenreader-accessible text.
- Safety-sensitive controls remain blocked or deferred to lifecycle hardening.

## Validation

Executed during `UXP2-010`:

```bash
pnpm typecheck
pnpm lint
git diff --check
PLAYWRIGHT_PORT=3070 pnpm exec playwright test tests/disabled-control-a11y-messaging.spec.ts tests/global-search-affordance.spec.ts tests/filter-affordance-pruning.spec.ts tests/row-timeline-affordance-pruning.spec.ts tests/button-cta-lifecycle-pruning.spec.ts tests/reference-product-control-pruning.spec.ts tests/p1-hold-defensive-noninteractive.spec.ts --reporter=line
```

Result:

- `pnpm typecheck`: pass.
- `pnpm lint`: pass with existing unused-symbol warnings, 0 errors.
- `git diff --check`: pass.
- Focused Playwright: `33 passed`.

## Deferred Validation

Full route smoke remains deferred until after `UXP3-015` per execution instruction.

## Open Risks

- Full route-smoke proof is intentionally deferred.
- Existing lint warnings remain outside this Phase 2 slice.
