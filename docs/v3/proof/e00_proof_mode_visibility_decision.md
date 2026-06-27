# E00 Proof Mode Visibility Decision

Date: 2026-06-27

## Ticket

`E00-D1` - Confirm Proof Mode vs Operational Mode visibility policy.

## Decision Captured

Human approval token received:

`APPROVE_E00_OPTION_A_PROOF_REVIEWER_MODE_DEFAULT`

## Selected Policy

Option A is approved:

Proof/debug/reviewer metadata is hidden from the default operational UI and exposed through explicit Proof Mode / Reviewer Mode or capture/report artifacts.

## Scope Of The Decision

This decision applies to downstream E03 and E07 work:

- `E03` must treat proof/debug/reviewer metadata as secondary or capture-only by default.
- `E07` must treat client-facing mode as a hard suppression boundary for proof/debug/reviewer scaffolding.
- Default operational UI may show only task context, safety blockers, recovery guidance and safe next actions needed to complete the current task.
- Route IDs, proof tags, capture warnings, debug metadata, implementation traceability and internal rationale must not be preserved as normal visible operational UI.

## Cleanup Interpretation

The approved path deliberately rejects compatibility debt:

- Do not restore default proof scaffolding to satisfy stale tests.
- Do not keep old proof labels visible as internal demo decoration.
- Do not hide legacy scaffolding behind a generic overlay when a real Proof/Reviewer Mode or capture artifact can own it.
- Retire, migrate or exception-mark stale tests and UI paths that require proof/debug metadata in operational default views.

## Required Exception

Operational safety blockers and recovery guidance remain visible when they affect the user's next safe action.

This exception does not authorize visible route proof tags, debug metadata, capture warnings or implementation traceability in the default operational UI.

## Definition Of Done Review

| Requirement | Result |
| --- | --- |
| Human visibility policy confirmed | PASS |
| Decision captured exactly | PASS |
| E03 downstream reference established | PASS |
| E07 downstream reference established | PASS |
| Default operational UI cleanup direction established | PASS |

## Ticket Result

`E00-D1` is complete. `E00-Q1` is enabled.
