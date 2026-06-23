# V1.0 WP-14 Pilot GTM / Buyer Proof Report

Status: ACCEPTED_WITH_CONTROLLED_PILOT_LIMITS
Date: 2026-06-23

## Analyse

WP-14 required a controlled paid pilot package that is sellable without contradicting the safety contracts. Existing demo strategy artefacts already pointed to the trust-chain demo, but there was no single V1.0 GTM pack, pilot scorecard or automated guard against mass-market GA, autonomous advice or P1/Hold overclaim.

## Umsetzungsplan

1. Define buyer personas and pilot inclusion/exclusion criteria.
2. Anchor the demo narrative on the approved MVP trust spine: MJ-001, MJ-002, MJ-003, MJ-010, MJ-006 and MJ-005.
3. Define measurable pilot scorecard outcomes.
4. State advice-boundary, pricing and commercial limits.
5. Add tests so GTM language stays aligned with safety contracts.

## Artefakt

- Added `lib/pilot-gtm-proof.ts`.
- Added `docs/V1_0_PILOT_GTM_PACK.md`.
- Added `docs/V1_0_PILOT_SCORECARD.md`.
- Added `tests/pilot-gtm-proof.spec.ts`.
- Added `test:v1-gtm` in `package.json`.

## Validierung

Executed command set:

```bash
pnpm test:v1-gtm
# 4 passed

pnpm phase:check
# passed: typecheck, lint, db:validate, build
```

`phase:check` still reports the existing 30 lint warnings and the known Next/Turbopack build warnings, but no errors. Screenshots may support the live demo narrative, but they are not acceptance proof for WP-14. The proof package is intentionally docs/tests/control language.

## Offene Risiken

- This is controlled paid pilot positioning, not GA.
- Pricing is framed as pilot/design-partner terms, not production procurement.
- P1/Hold requests from buyers must become later scoped decisions, not live promises.
