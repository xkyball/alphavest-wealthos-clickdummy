# AlphaVest E10 Retired Proof UI Register

Epic: E10 - Register Reconciliation and Legacy UX Debt Burn-Down
Ticket: E10-A1 - Register inventory
Decision: `APPROVE_E10_HARD_RETIRE_AND_MIGRATE_REGISTERS`
Baseline: `c50ba31 chore: enforce e09 capture release policy`

## Register Rule

Retired proof/debug UI must not re-enter operational default surfaces. `ProductGuidance*` names are treated as legacy compatibility debt unless they are renamed into operational route context or removed.

## Inventory

| ID | File | Current Finding | Decision | Target | Follow-up |
| --- | --- | --- | --- | --- | --- |
| RPU-001 | `components/product-guidance-panel.tsx` | `ProductGuidancePanel` renders `null`; `ProductGuidanceContent` delegates to `OperationalDefaultSurface`. | retire_now | Remove active dependency path or convert to explicit deprecated shim with source gate. | E10-I3 |
| RPU-002 | `lib/product-guidance.ts` | Large legacy route-guidance data/model still named product-guidance and imported by route context/tests. | rename_or_retire | Rename active route-context model to operational route guidance, or quarantine old name behind deprecated adapter. | E10-I3 |
| RPU-003 | `components/route-context-chip.tsx` | Imports `productGuidanceForPathname` for operational route context. | migrate_now | Import operational route guidance API instead of ProductGuidance naming. | E10-I3 |
| RPU-004 | `tests/route-smoke.spec.ts` | Imports `productGuidanceForRoute` for route expectations. | migrate_now | Use operational route guidance naming or canonical route/page contracts. | E10-I3 |
| RPU-005 | `tests/product-guidance-shell.spec.ts` | Test file name and assertions still use product-guidance naming while proving suppression. | migrate_later | Rename or add E10 gate to prevent new imports; avoid broad test rename unless stable. | E10-I3-followup |
| RPU-006 | Historical docs/proof reports | Historical mentions remain by design. | keep_historical | Do not rewrite history; do not let historical text become implementation authority. | none |

## Acceptance Notes

- Historical docs may mention retired proof UI.
- Active code should not import `components/product-guidance-panel.tsx` after E10.
- Active operational route context should not require visible proof/debug/reviewer vocabulary.
