# IMPL-1.9 UX Safety Wording Overlay for AI/Internal-only/Unsupported Claims

Status: Complete

Source ticket: `IMPL-1.9`

## Implementation

Updated UI safety wording in:

- `components/internal-workflow-screen.tsx`
- `lib/screen-capability-flow.ts`

Updated tests:

- `tests/scf-p04-p06-flow-ui.spec.ts`
- `tests/route-smoke.spec.ts`

## Wording Changes

The advisor/detail surfaces now explicitly distinguish:

- internal draft from client advice;
- unsupported claims from advisor-ready wording;
- advisor candidate from compliance release;
- compliance review from client visibility;
- no export and no client acceptance side effects.

Key visible phrases added:

- `Advisor candidate only`
- `Unsupported claims stay internal and require evidence-backed analyst rebuild before advisor-ready wording can move toward compliance.`
- `Advisor candidate saved. Compliance pending; no client visibility, export, release or client acceptance was created.`
- `Internal draft only, not client advice. Unsupported claims require evidence-backed rebuild...`
- `Not released`

## Screenshot

Captured UI proof:

`reports/pp003-ai-draft-advice-boundary-2026-06-26/screenshots/impl-1-9-advisor-candidate-wording.png`

## Validation

```text
pnpm playwright test tests/scf-p04-p06-flow-ui.spec.ts tests/route-smoke.spec.ts --grep "P05|AI draft internal-only chain" --workers=1
Result: PASS, 2/2

pnpm typecheck
Result: PASS

pnpm guard:source
Result: PASS, violations 0

pnpm db:validate
Result: PASS
```

## Acceptance

Positive acceptance:

- UI wording no longer lets advisor approval read as release, export or client acceptance.
- Internal draft wording now calls out unsupported claims and evidence-backed rebuild.
- The advisor detail page visibly says the state is not released.

Negative acceptance:

- This is a safety wording overlay, not runtime proof by itself.
- Runtime proof remains in IMPL-1.4 through IMPL-1.8.
- No new screen design or production AI UI was added.
