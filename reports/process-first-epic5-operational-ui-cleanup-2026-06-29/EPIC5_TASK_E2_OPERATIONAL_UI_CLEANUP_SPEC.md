# EPIC-5 TASK-E2 - Operational UI cleanup specification

Datum: 2026-06-29
Status: Accepted implementation spec for TASK-E3

## Non-Negotiable Rule

Default operational UI must not render process, gate, proof, contract, step, task, phase, scaffold or metadata panels. Safety is proven through state logic, disabled controls, services, persistence, audit/evidence records and tests. The user-facing surface shows the selected object, decision context, blocker, recovery action and next action only.

## Wire / Block / Remove / Move Rules

| Classification | Required handling |
| --- | --- |
| wire | Keep the control only when it has a real handler, route handoff, API/service command or persisted workflow transition. |
| block | Keep as disabled or read-only only with product-native reason visible or accessible. The reason must not mention implementation wiring. |
| remove | Delete default-visible process/proof/gate/meta panels and dead re-entry components. |
| move | Keep proof/traceability in tests, contracts, reports, logs or explicit `?proofMode=reviewer` tooling only. |
| leave | Keep product-native object state, decision context, evidence context, risk/status indicators and real next actions. |

## Shared Primitive Rules

1. `ActionButton` must never tell users that a "workflow target is wired" or not wired. Missing handlers become unavailable product actions.
2. `MasterDetailSurface` must not expose proof placement in default operational DOM. Selected object/state and workbench mode may remain.
3. `StatePanel` and `StatusChip` may show product state, but cannot be counted as workflow completion proof by themselves.
4. `EvidenceList` may show evidence rows, but must not carry visible or default DOM task/proof phase markers.
5. `ProcessGateRail` is retired for default UI. Existing safety facts must be expressed as selected-object requirements, action blockers, confirmation dialogs or service-backed states.

## Implementation Slices For TASK-E3

### SUBTASK-E3-1 Static Actions And Disabled Controls

- Replace implementation-flavored disabled copy in shared action primitives.
- Preserve service-backed actions already wired through handlers or route handoffs.
- Keep safety-blocked release/export/share controls disabled with product-native reasons.

### SUBTASK-E3-2 Proof-looking UI Removal

- Remove default-visible proof/boundary panels from S019, evidence lifecycle core surfaces and governance role/access surfaces.
- Remove retired ProcessGateRail export/import and tests that assert its presence as desired product UI.
- Remove default operational DOM proof-placement from MasterDetailSurface consumers.
- Keep reviewer-only proof tooling behind explicit `?proofMode=reviewer`.

## Validation Logic

Validation is acceptable when:

- No default-visible panel title/body uses proof/process/gate/boundary wording as product guidance.
- No route smoke test requires proof-boundary panels to be visible.
- Product actions either call a handler/route/API or show a product-native blocked reason.
- Remaining evidence/status rows are clearly display/context, not lifecycle completion.
- Proof remains available through report/test/reviewer tooling.

## Reviewer-only Proof Surface Policy

Reviewer-only proof tooling may remain only when it is opt-in and not rendered in the default product route. Current approved mechanism: `?proofMode=reviewer` via `ProofReviewerModeSlot`. This is not a product surface and must not add workflow controls.

## TASK-E2 Status

Complete. The implementation scope is explicit and unblocks TASK-E3.
