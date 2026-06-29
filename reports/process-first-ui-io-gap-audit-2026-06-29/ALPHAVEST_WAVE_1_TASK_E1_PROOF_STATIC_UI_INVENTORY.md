# AlphaVest Wave 1 / TASK-E1 Proof-Looking And Static Operational UI Inventory

Date: 2026-06-29
Mode: Wave 1, read-only analysis item
Status: COMPLETED_WITH_CLEANUP_CLASSIFICATION

## Re-read Task Definition

TASK-E1 was re-read before execution from `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json`.

Objective: classify visible UI that should be wired, blocked, removed or moved to proof tooling so operational users see product-native work, blockers and next actions instead of implementation/proof scaffolding.

Out of scope for this item: product-code fixes, test edits, migrations, new routes, new visual design system, or cleanup implementation.

## Sources Inspected

Primitive sources:

- `components/ui/master-detail-surface.tsx`
- `components/ui/action-zone.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/status-chip.tsx`
- `components/ui/evidence-list.tsx`

Rules and authority:

- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

Operational surfaces sampled:

- `components/internal-workflow-screen.tsx`
- `components/client-intake-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/review-monitoring-screen.tsx`
- `components/kyc-aml-workflow-screen.tsx`
- `components/wealth-actions-screen.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/worksurface-shell.tsx`

## Spawned Explorer Results

Three read-only explorers were used for E1.

1. Primitive Explorer
   - `MasterDetailSurface`, `ActionZone` and `StatePanel` are salvageable as product-native primitives when wired to selected objects, real workflow state and recovery actions.
   - `StatusChip` is acceptable only as a small object-status cue, not as workflow leadership.
   - `EvidenceList` is currently the strongest proof/static smell because it carries phase/task markers and static evidence affordances.

2. Screen Usage Explorer
   - Proof/static patterns recur across internal workflow, client intake, communication/export, review monitoring, KYC, wealth actions and admin setup.
   - The most problematic recurring surfaces are phase/workbench panels, proof drawers, static action clusters, chip/status galleries, API/test-truth panels and self-describing static-control treatment.

3. Rule Explorer
   - Default operational UI must not show internal proof scaffolding, route/task/phase/work-package IDs, process explainer panels, proof strips or chip clouds.
   - If a test or contract requires visible internal scaffolding, the contract/test/report path is stale and should be refactored instead of adding compatibility UI.
   - Cleanup must preserve product meaning: object state, blockers, recovery actions, decision context, evidence context and real workflow controls.

## Primitive Classification

| Primitive | Product-native use | Proof/static risk | Classification |
|---|---|---|---|
| `MasterDetailSurface` | Real master/detail queues with selected object, selected state, detail panel and empty state | `proofPlacement`, `queueWorkbench`, `data-ux-queue-*`, proof drawer, selected summary as phase/status banner | leave + wire for real workflows; move proof metadata to tooling; remove visible proof drawers from default UI |
| `ActionZone` / `ActionButton` | Real navigation/mutation actions with audit, confirmation, permission and product-native disabled reason | Default "workflow target is wired" language, non-executable `role=status`, lifecycle trigger/result proof attrs | wire every visible action or remove/block with real disabled reason; move lifecycle proof labels to tooling |
| `StatePanel` | Empty/loading/error/blocked/restricted/success state with user-facing blocker/recovery detail | `internal-only`, `reference-only`, `p1-deferred`, `audit-unavailable`, lifecycle/feedback proof semantics | keep for real product state; translate internal states into user-facing object state; move proof semantics to tooling |
| `StatusChip` | Minor object-status cue tied to business state | Static/not-completion-gate semantics, chip clusters, proof-strip leadership | leave only as small supporting status; block chip clouds/proof strips as workflow guidance |
| `EvidenceList` | Decision-support list of real evidence with title, type, visibility, status and date | `static-evidence-list`, phase/task IDs, no open/review/download actions | wire into evidence review or move to proof tooling; remove phase/task markers |

## Screen Inventory And Cleanup Classification

| Surface | Proof/static UI found | Why it matters | Classification |
|---|---|---|---|
| `components/internal-workflow-screen.tsx` | Workbench proof drawer, "Truth: readmodel + contract", no-overclaim text, inert "Open review work", proof attrs, audit strips | Internal proof vocabulary and static controls sit in the operational work surface | wire selected actions; move proof/audit strips to proof tooling; remove visible contract/proof copy |
| `components/internal-workflow-screen.tsx` compliance release | Safety blockers are valid, but dense Review Requirements, evidence/policy/audit chip strips and proof attributes look like acceptance scaffolding | Release UI can feel complete because chips exist, while workflow outputs remain incomplete | leave safety blockers; wire release/evidence actions; move chip/proof strips to tooling |
| `components/client-intake-screen.tsx` | "Evidence tracked", "Client-safe boundary", proof/audit disclosure controls, evidence lifecycle proof boundary | Client intake mixes real intake/evidence work with proof-language surfaces | keep evidence workflow content; move proof/audit disclosure controls to reviewer tooling |
| `components/communication-export-ops-screen.tsx` | "New item held", "Matrix management held", "Digital send held", disabled package/download/share controls, status-chip galleries | Export safety locks are valid, but many held controls are static placeholders | wire export command spine where supported; remove static held controls; keep true export safety locks |
| `components/review-monitoring-screen.tsx` | API/test truth in UI such as `GET /api/...`, `POST ...`, `clientVisible=false`, controlled-action proof panels | Product users see implementation/test vocabulary instead of review state | move to proof tooling; keep due/rebalance object state |
| `components/kyc-aml-workflow-screen.tsx` | Phase split panel and internal task vocabulary | KYC evidence/audit/release blocks are mostly product-native; phase panel is not | remove phase panel; leave evidence/audit/release blockers |
| `components/wealth-actions-screen.tsx` | Internal process attributes, "Permitted list/timeline", static evidence/timeline labels | Wealth actions become proof-like rather than workflow-backed object actions | leave product evidence state; move static/permitted/audit metadata to proof tooling |
| `components/admin-tenant-setup-screen.tsx` | "Static Control Treatment", self-describing disabled/static UI handling, many held controls | Admin UI describes implementation limitations to users | remove/move static-control treatment; wire admin workflows or leave only true safety confirmations |
| `components/decisions-governance-screen.tsx` | Decision checkpoint/workbench panels and static primary action patterns | Decision flow can look operational without full process behavior | wire decision actions or collapse proof checkpoint panels |
| `components/worksurface-shell.tsx` | Proof-audit placement and visible descriptions can surface contract/readmodel/proof terms | A shell-level feature can spread proof vocabulary across screens | keep layout; block visible internal description strings in operational pages |

## Cleanup Decision Rubric

1. Wire
   - Use when a visible action represents a real process step and the service/workflow layer exists or can be implemented in the owning task.
   - Required: selected object, required input, command/action, durable output state, audit/evidence result, error state and negative proof.

2. Block
   - Use when the action is valid product behavior but must be disabled because a safety or workflow condition is unmet.
   - Required: product-native disabled reason, recovery path, and no implementation-language wording.

3. Remove
   - Use when a visible element only exists to prove implementation state, display phase/task metadata, show a static placeholder, or repeat internal process scaffolding.
   - Required: no loss of product-critical safety information.

4. Move To Proof Tooling
   - Use when the information is useful for QA/reviewer/reporting but not needed by an operational user.
   - Examples: route IDs, task IDs, phase IDs, work-package IDs, proof strips, contract names, source-trace wording, data-attribute explanations, API/test truth.

5. Leave As Product-Native
   - Use only when the UI directly helps a user complete the job: selected object, blocker, recovery action, next action, object field, evidence item, review history, or concise status.

## Highest Priority Cleanup Slices

1. `E2-PRIMITIVE-RULES`
   - Define strict allowed/forbidden usage for `MasterDetailSurface`, `ActionButton`, `StatePanel`, `StatusChip` and `EvidenceList`.

2. `E2-STATIC-ACTION-REMOVAL`
   - Replace inert spans and disabled placeholder clusters with either workflow-backed actions or product-native blocked states.

3. `E2-PROOF-TOOLING-SPLIT`
   - Move proof drawers, chip galleries, API/test truth, route/task/phase strings and contract vocabulary out of default operational routes.

4. `E2-EVIDENCE-LIST-WIRING`
   - Convert `EvidenceList` into a real evidence review/open/download/visibility component or restrict it to proof tooling.

5. `E2-SHELL-COPY-GUARD`
   - Prevent shell descriptions from rendering internal contract/readmodel/proof language in product pages.

## Item Outcome

Status: completed as an analysis item.

Changed files:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_E1_PROOF_STATIC_UI_INVENTORY.md`

Tests:

- No test run was required for E1 because it is a read-only inventory/classification task.

Findings:

- The repo already has useful shared primitives, but their current usage still allows proof-looking and static UI to appear in operational screens.
- The cleanup must not delete safety context. It must translate safety/evidence/audit into product-native blockers, object state, recovery actions and workflow controls.
- The next implementation wave should start by removing static/proof UI debt at the primitive and shell level, then wire the highest-risk actions.

Next item:

- Wave 1 item execution is complete. Create Wave 1 report, validate, and commit the report artefacts if sensible.
