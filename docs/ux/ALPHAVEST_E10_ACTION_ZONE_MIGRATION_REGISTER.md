# AlphaVest E10 Action Zone Migration Register

Epic: E10 - Register Reconciliation and Legacy UX Debt Burn-Down
Ticket: E10-A1 - Register inventory
Decision: `APPROVE_E10_HARD_RETIRE_AND_MIGRATE_REGISTERS`
Baseline: `c50ba31 chore: enforce e09 capture release policy`

## Register Rule

Route-local action class vocabularies are migration debt. They may stay only when they are explicitly registered here with a target migration decision and follow-up ticket. New unregistered `primaryButtonClass`, `secondaryButtonClass`, `staticButtonClass` or `destructiveButtonClass` definitions are not allowed.

## Target State

- Workflow action groups use `ActionZone`, `StickyActionZone` and `ActionButton`.
- Action class treatment projects from `ux-action-hierarchy-contract`.
- Local button-class constants are either removed, projected from the canonical contract as a temporary adapter, or exception-marked with a removal ticket.
- Modal footer and topbar controls are allowed to migrate later because they require E04/topbar-specific behavior checks.

## Inventory

| ID | File | Current Finding | Decision | Target | Follow-up |
| --- | --- | --- | --- | --- | --- |
| AZ-001 | `components/admin-tenant-setup-screen.tsx` | Local `primaryButtonClass`, `secondaryButtonClass`, `staticButtonClass`; many section actions and disabled static controls. | migrate_first_slice | Replace section action groups with `ActionZone`/`ActionButton`; keep modal footers as temporary exceptions. | E10-I1 |
| AZ-002 | `components/auth-onboarding-screen.tsx` | Local primary/secondary classes in auth/onboarding controls. | temporary_exception | Keep until auth/onboarding form semantics are separated from workflow action zones. | E10-I1-followup-auth |
| AZ-003 | `components/client-intake-screen.tsx` | Local primary/secondary classes plus partial `ActionZone` adoption. | migrate_first_slice | Expand `ActionZone` adoption around document upload/entity/document actions. | E10-I1 |
| AZ-004 | `components/committee-review-screen.tsx` | Local primary/secondary classes on committee P1/HOLD surface. | temporary_exception | Keep as registered hold-scope exception until route unlock. | E10-I1-followup-hold |
| AZ-005 | `components/communication-export-ops-screen.tsx` | Local primary/secondary classes plus partial export `ActionZone` adoption. | migrate_first_slice | Use `ActionButton` for export approval/download/share separation where visible actions are in productive scope. | E10-I1 |
| AZ-006 | `components/decisions-governance-screen.tsx` | Local primary/secondary/destructive classes across release/block/evidence/governance flows. | migrate_first_slice | Prioritize destructive/block/release action groups and row scoped controls. | E10-I1 |
| AZ-007 | `components/internal-workflow-screen.tsx` | Local primary/secondary classes plus `StickyActionZone` on compliance release rail. | migrate_first_slice | Project local classes through canonical action hierarchy and migrate rail action children first. | E10-I1 |
| AZ-008 | `components/kyc-aml-workflow-screen.tsx` | Local primary/secondary classes in KYC workflow. | temporary_exception | Keep as registered safety workflow exception until action meanings are mapped. | E10-I1-followup-kyc |
| AZ-009 | `components/review-monitoring-screen.tsx` | Local primary/secondary classes and disabled review filters/actions. | migrate_later | Migrate after filter exception cleanup to avoid mixing concerns. | E10-I2-followup |
| AZ-010 | `components/suitability-ips-screen.tsx` | Local primary/secondary classes in suitability/IPS flows. | temporary_exception | Keep until action meanings are mapped against advice/release safety tests. | E10-I1-followup-suitability |
| AZ-011 | `components/wealth-actions-screen.tsx` | Local secondary class and board controls. | migrate_with_data_surface | Migrate with board/data-surface filter cleanup. | E10-I2 |

## Acceptance Notes

- This register is not an approval to keep local action classes indefinitely.
- Temporary exceptions must be reduced or converted into concrete follow-up tickets after E10-I1.
- Visible action layout changes require screenshots; metadata/class-source projection only does not.
