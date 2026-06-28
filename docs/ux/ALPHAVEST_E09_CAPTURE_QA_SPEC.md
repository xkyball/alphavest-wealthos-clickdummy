# AlphaVest E09 Capture QA Specification

Status: retired on 2026-06-28.

## Decision

The legacy offline capture-QA path is no longer an operative screenshot
acceptance gate.

Retired scripts:

- `scripts/capture-qa-contract.ts`
- `scripts/strict-visual-capture.ts`

Retired package scripts:

- `visual:capture-qa`
- `visual:capture-qa:release`
- `visual:strict`

## Replacement

Operational UI screenshots are governed by
`docs/ux/ALPHAVEST_OPERATIONAL_UI_NON_NEGOTIABLE.md` and validated by:

```bash
pnpm visual:audit-operational
```

Every screenshot used as UI proof must be paired with the 1400x900 operational
visual audit. An unaudited screenshot is not proof.

`scripts/capture-routes-and-modals.ts` remains a capture generator and manifest
producer only. It does not own screenshot acceptance.
