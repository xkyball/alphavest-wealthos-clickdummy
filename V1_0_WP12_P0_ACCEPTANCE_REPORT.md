# V1.0 WP-12 P0 Acceptance Report

Status: ACCEPTED_WITH_EXPLICIT_SCOPE_LOCKS
Date: 2026-06-23

## Analyse

WP-12 required a current positive and negative P0 proof suite. The repo already had most safety slices, but two stale First-Build assumptions were still present in the acceptance layer:

- `tests/p0-acceptance.spec.ts` expected old route workset counts.
- `lib/scf-foundation.ts` mirrored those old counts.

Those expectations conflicted with the current True-UX route registry, where P1, Reference-only and Hold routes remain registered-only.

## Umsetzungsplan

1. Rebase SCF route workset counts to the current `lib/route-registry.ts` truth.
2. Update P0 acceptance assertions so P1, Reference-only and Hold routes cannot be treated as MVP product shells.
3. Add a standard V1.0 P0 acceptance command.
4. Produce a current P0 test coverage artefact.

## Artefakt

- Updated `lib/scf-foundation.ts` route workset baseline.
- Updated `tests/p0-acceptance.spec.ts` registered-only route boundary assertions.
- Added `test:v1-p0` in `package.json`.
- Added `P0_TEST_REBASE_CURRENT.md`.

## Validierung

Executed command set for this work package:

```bash
pnpm test:v1-p0
# 86 passed

pnpm phase:check
# passed: typecheck, lint, db:validate, build
```

The command set intentionally combines positive path, negative bypass, leakage, tenant scope, export, audit and API-safe-error proof. `phase:check` still reports the existing 30 lint warnings and the known Next/Turbopack build warnings, but no errors. Screenshots were not produced for WP-12 because this package changed tests/reports/control metadata rather than visible UI.

## Offene Risiken

- The P0 proof is V1.0 safety/readiness proof, not production-auth proof.
- Manual visual QA is still separate from safety acceptance.
- P1, Reference-only and Hold routes remain explicit non-claims unless a later True-UX-approved unlock changes the source of truth.
