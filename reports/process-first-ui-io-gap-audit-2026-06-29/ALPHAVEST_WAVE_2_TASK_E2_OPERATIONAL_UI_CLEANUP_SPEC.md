# AlphaVest Wave 2 / TASK-E2 Operational UI Cleanup And Primitive Rollout Specification

Date: 2026-06-29
Mode: Wave 2, specification / acceptance criteria
Status: COMPLETED_SPEC_READY_FOR_ACCEPTANCE

## Re-read Task Definition

TASK-E2 was re-read from `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json` before execution.

Goal: define which UI elements are product-native, blocked, static/report-only or invalid in default operational UI.

## Source Basis

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_E1_PROOF_STATIC_UI_INVENTORY.md`
- `components/ui/master-detail-surface.tsx`
- `components/ui/action-zone.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/status-chip.tsx`
- `components/ui/evidence-list.tsx`
- `components/worksurface-shell.tsx`
- sampled operational screens listed in E1
- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## Classification Rules

| Classification | Use when | Required UI behavior | Forbidden |
|---|---|---|---|
| `wire` | A visible action represents a real process step and the service/workflow exists or is in the approved implementation slice | Selected object, required inputs, command, success/blocked/error output, audit/evidence where sensitive | Hardcoded target unrelated to selected object; modal-only success; no negative proof |
| `block` | A valid product action is unavailable because a product/safety/workflow condition is unmet | Disabled control or state panel with product-native reason and recovery path | "Blocked until a typed workflow command is implemented" in default UI; task/phase/proof wording |
| `remove` | UI exists only as placeholder, phase/task panel, proof strip, chip cloud, static gallery, API/test truth or implementation explanation | Remove from default route without losing safety context | Removing safety blocker, selected object, evidence context or recovery action |
| `move_to_proof_tooling` | Information is useful for QA/reviewer/reporting but not operational work | Store in reports/tests/DOM assertions/proof tooling, not visible default UI | New product route without route-evolution approval |
| `leave_product_native` | Element directly helps work: selected object, decision context, blocker, recovery, evidence item, history or concise business status | Keep concise, object-scoped and service/readmodel backed where it implies state | Treating display-only evidence/status as lifecycle completion |

## Shared Primitive Rules

| Primitive | Allowed default use | Must change | Acceptance rule |
|---|---|---|---|
| `MasterDetailSurface` | Real queue/detail work with selected object, selected state, detail panel and empty state | Visible proof drawer, phase/task summary banner, proof-placement-driven page job | No visible `proofPlacement` semantics in default UI; selected summary may show product object state only |
| `ActionZone` / `ActionButton` | Real command/navigation or product-native disabled action | Default "workflow target is wired" reason, fake actions as `role=status`, lifecycle proof labels as product copy | Every visible action has `href`/`onClick` or product blocker; no implementation-language disabled reason |
| `StatePanel` | Empty/loading/error/blocked/restricted/success product state | Internal states like `reference-only`, `p1-deferred`, `audit-unavailable` rendered as methodology labels | State text explains user-facing blocker/recovery; proof semantics stay in data/test/report |
| `StatusChip` | Small object status cue | Chip clouds as workflow guide or completion proof | Chip cannot be required to understand the next action; no completion claim from chip alone |
| `EvidenceList` | Real evidence review/open/download/visibility decision support | `static-evidence-list`, phase/task IDs, no open/review/download affordance while counted as lifecycle UI | Evidence display does not count as evidence lifecycle completion unless backed by readmodel and action/output proof |
| `WorksurfaceShell` | Layout and product-native page framing | Visible descriptions containing contract/readmodel/proof/process/task language | Shell descriptions must be business task descriptions only |

## Default UI Forbidden Vocabulary / Patterns

Forbidden in visible default operational UI unless part of a deliberately approved reviewer/proof tool:

- route IDs
- task IDs
- UX phase IDs
- work-package IDs
- acceptance IDs
- contract names
- `data-testid` names
- `data-ux-*` wording
- proof boundary language
- "Truth: readmodel + contract"
- "No-overclaim"
- "static control treatment"
- API/test truth such as `GET /api/...`, `POST /api/...`, `clientVisible=false`
- source-trace internals
- proof drawers, proof strips, chip clouds and badge clusters as primary guidance
- phase split panels as product work surfaces

Allowed replacements:

- selected object
- decision context
- blocker
- recovery action
- next permitted action
- evidence item/status
- audit requirement phrased as product obligation
- concise business status

## Reviewer-Only Proof Surface Policy

Current policy for TASK-E2:

1. Proof information may stay in reports, tests, DOM attributes and screenshot manifests.
2. Proof information must not be visible in default operational UI.
3. A new reviewer-only proof route is not authorized by E2 because route evolution approval is missing.
4. If implementation needs reviewer-visible proof, it must either:
   - write a report/proof artifact under `reports/` or `artifacts/`, or
   - request a route-evolution decision before creating a proof route.

## Screen Cleanup Targets

| Surface | Required cleanup |
|---|---|
| `components/internal-workflow-screen.tsx` | Remove visible contract/proof/no-overclaim text; convert static analyst/advisor actions into wired actions or product blockers; move proof drawers/audit strips to proof tooling |
| `components/client-intake-screen.tsx` | Move proof/audit disclosure controls out of default UI; keep client-safe/evidence content as product state |
| `components/decisions-governance-screen.tsx` | Replace phase panels/static workbench controls with product-native decision context or wire them; move evidence proof metadata to tooling |
| `components/communication-export-ops-screen.tsx` | Wire export command spine or remove static held controls; keep export safety blockers |
| `components/review-monitoring-screen.tsx` | Remove API/test truth from visible UI; keep due/rebalance review state |
| `components/kyc-aml-workflow-screen.tsx` | Remove phase split panels; keep evidence/audit/release blockers |
| `components/wealth-actions-screen.tsx` | Remove permitted/static/timeline proof labels; keep selected wealth/action/evidence blocker state |
| `components/admin-tenant-setup-screen.tsx` | Remove self-describing static-control treatment; wire admin workflows or leave true safety confirmations |
| `components/worksurface-shell.tsx` | Block internal descriptions from rendering visibly; pass only product-native copy |

## Implementation Slices For TASK-E3

| Slice | Scope | CTES decision | Dependencies | Validation |
|---|---|---:|---|---|
| E3-1 Primitive Guardrails | Update primitives/default copy to prevent implementation-language disabled reasons and visible proof semantics | 9 | E2 accepted | unit/DOM assertions, route smoke |
| E3-2 Shell Copy Guard | Prevent shell descriptions from surfacing contract/readmodel/proof vocabulary | 6 | E2 accepted | text assertions on sampled routes |
| E3-3 Static Action Cleanup | Replace inert spans/placeholder clusters with wired actions or product-native blockers | 12 | A2/C2/D2 accepted for safety workflows | targeted UI tests per surface |
| E3-4 Proof Drawer/Phase Panel Removal | Move proof drawers, phase panels, API/test truth and static galleries out of default UI | 12 | E2 accepted; route-evolution not required if no new route | `operational-visual-audit.spec.ts`, screenshots |
| E3-5 EvidenceList Reclassification | Wire evidence list to readmodel actions or restrict to proof tooling | 10 | C2 accepted | evidence vault/detail tests |

## Validation Logic For TASK-E4

1. Search visible text for forbidden vocabulary on sampled operational routes.
2. Verify no default route leads with proof strips, chip clouds, phase/task panels or API/test truth.
3. Verify every visible action has a command/navigation target or product-native disabled reason.
4. Verify every disabled reason names a product blocker, not missing implementation.
5. Verify evidence display is not asserted as lifecycle completion without readmodel/action proof.
6. Capture 1400x900 screenshots for changed UI routes.
7. Confirm no horizontal overflow, no clipped table text, no oversized summary banner, no primary action below fold.
8. Run safety tests for any screen that touches release/export/client visibility/advice.

## Human Confirmation Points

Before implementation, confirm:

1. Whether a future reviewer-only proof route is desired. Current E2 policy blocks new route creation without route-evolution approval.
2. Whether proof metadata should be centralized under `reports/`, `artifacts/`, or an existing non-default reviewer tool.
3. Whether "Internal only" is acceptable visible product copy in staff-only screens, or should be replaced with object-specific state such as "Not released".

## Item Outcome

Status: completed as a specification item.

Changed files:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_2_TASK_E2_OPERATIONAL_UI_CLEANUP_SPEC.md`

Tests:

- `pnpm guard:source` was run during Wave 2 preflight and passed.
- No additional tests were required because TASK-E2 is specification-only.

Findings:

- UI cleanup must be structural, not copy-only.
- Static controls either become workflow-backed actions, honest product blockers, or leave default UI.
- Proof tooling stays outside default operational routes unless route evolution is approved.

Next item:

- Wave 2 item execution is complete. Create Wave 2 report, validate and commit if sensible.
