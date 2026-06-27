# E12 Contract Fulfillment Decision Report

Ticket: E12-D1 - Ledger Format and Markdown Policy Approval
Status: `approved`
Decision date: 2026-06-27

## Approval Token

`APPROVE_E12_HYBRID_LEDGER_WARN_EXISTING_FAIL_NEW_GENERATE_MARKDOWN_AFTER_Q1`

## Decision

The approved E12 implementation path is:

- Canonical source: `lib/ux-contract-ledger.ts`.
- Generated/review outputs: JSON and markdown reports are generated or script-produced.
- Markdown registers: validate-only during I1/I2, then generated/read-only after Q1 if the gate report is stable.
- Existing registered debt: warn for one burn-down pass, with required follow-up.
- New unregistered debt: fail immediately.
- `phase:check`: add `test:contract-fulfillment` first, then hard-wire after Q1 unless explicitly approved earlier by clean/excepted evidence.

## Boundaries Preserved

- No product/route scope change.
- No schema migration.
- No visual screen generation.
- No UI change.
- No safety weakening.

## Next Ticket

Proceed to `E12-I1: Introduce Canonical Contract Ledger`.
