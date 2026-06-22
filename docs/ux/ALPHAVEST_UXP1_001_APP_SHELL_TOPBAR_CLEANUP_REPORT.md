# AlphaVest UXP1-001 App Shell / Topbar Cleanup Report

## 1. Analyse

UXP1-001 targets global chrome copy in `components/app-shell.tsx` and `components/top-bar.tsx`.

The app shell contains no visible explanatory copy. The topbar contained demo/build explanation in the active-session area and one over-assertive visibility phrase:

- `Controlled scenario context; production auth is not claimed`
- `Scenario role`
- `Reset scenario context`
- `Client-safe context`

These strings are global chrome explanations or over-broad context labels. They are not needed for task execution and should not appear as persistent product UI copy.

## 2. Umsetzungsplan

1. Keep tenant, role, route context, risk and reset controls functional.
2. Replace global demo/session explanation with short functional context.
3. Avoid client-safety overclaim in the generic visibility chip.
4. Relocate the removed explanation to the Phase 1 manual register.
5. Repair validation expectations that still treated now-deferred or held routes as productive UX targets.

## 3. Artefakt

Changed product UI:

- `components/top-bar.tsx`
  - `Client-safe context` -> `Scoped context`
  - `session.sessionLabel` -> `Active context`
  - demo/auth explanation -> tenant and role display
  - `Scenario role` -> `Role context`
  - reset label -> `Reset role and tenant context`

Updated relocation/manual artefact:

- `docs/ux/ALPHAVEST_UI_MANUAL_RELOCATED_CONTENT.md`
  - Added Global chrome / topbar relocation row for the removed scenario-production-auth explanation.

Updated validation contract:

- `tests/route-smoke.spec.ts`
  - Aligned productive navigation and UX proof expectations with the corrected route worksets.
  - Kept P1, reference and HOLD routes registered but outside productive navigation and productive UX-PAGE proof.

## 4. Validierung

Acceptance criteria:

- No long manual/proof/methodology/demo explanation remains in the affected global chrome.
- Functional labels remain clear for tenant, role, reset and route context.
- Safety copy remains true now and does not imply release or production auth.
- Relocated explanation is recorded in the manual register.
- No route scope, feature behavior or capability was promoted.

Validation run:

- `rg -n "Controlled scenario|production auth|Scenario role|Reset scenario context|Client-safe context|proof|Proof|roadmap|Roadmap|engine|Engine|manual|methodology|recovery" components/app-shell.tsx components/top-bar.tsx`
  - Result: no matches.
- `pnpm lint`
  - Result: passed with 32 existing warnings.
- `pnpm exec playwright test tests/foundation-guardrails.spec.ts --reporter=line`
  - Result: 5 passed.
- `PLAYWRIGHT_PORT=3031 pnpm exec playwright test tests/route-smoke.spec.ts --reporter=line`
  - Result: 316 passed.

## 5. Offene Risiken

- Existing lint warnings remain outside UXP1-001 scope.
- Phase 1 still has broader product-page explanation cleanup pending outside global chrome.
- P1 and HOLD routes remain registered smoke routes only; they are not implementation unlocks or MVP proof.
