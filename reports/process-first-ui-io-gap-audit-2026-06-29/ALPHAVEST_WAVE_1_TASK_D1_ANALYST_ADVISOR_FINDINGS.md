# AlphaVest Wave 1 / TASK-D1 Analyst Draft + Advisor Lifecycle Findings

Date: 2026-06-29
Mode: Wave 1, read-only analysis item
Status: COMPLETED_WITH_LIFECYCLE_ACTION_GAPS

## Re-read Task Definition

TASK-D1 was re-read before execution from `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json`.

Objective: determine whether analyst draft workflows, internal-only no-leakage boundaries, source traceability, advisor rationale, option comparison, evidence request, return/reject, and approval handoff are represented as process-step UI with required inputs and outputs.

Out of scope for this item: product-code fixes, test edits, migrations, new routes, or UI remediation.

## Sources Inspected

- `components/internal-workflow-screen.tsx`
- `components/worksurface-shell.tsx`
- `lib/analyst-draft-governance-contract.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/recommendation-review-workflow-client.ts`
- `lib/recommendation-review-workflow-validation.ts`
- `lib/advisor-review-action-contract.ts`
- `app/api/advisor-review/actions/route.ts`
- `lib/internal-workflow-demo-data.ts`
- `tests/analyst-draft-proof-boundary-ui.spec.ts`
- `tests/analyst-draft-governance-contract.spec.ts`
- `tests/advisor-review-approval-ui.spec.ts`
- `tests/workflow-gate.spec.ts`

## Spawned Explorer Results

Three read-only explorers were used for D1.

1. Analyst Draft Explorer
   - Contract-level no-leakage is strong.
   - Raw draft fields such as `aiDraft`, `internalDraftText`, `draftTraceInternals`, and `sourceRefsJson` are internal-only by contract.
   - The inspected UI does not render those raw fields, but it does render proof/contract vocabulary such as "draft-governance contracts", "Truth: readmodel + contract", and "No-overclaim", which violates the operational UI rule even though it is not a client-data leak.
   - Source traceability is required by contract, but appears in the UI mostly as generic source/evidence display, not as an operational safe-trace check before handoff.

2. Advisor Lifecycle Explorer
   - Advisor queue/search/open is readmodel and navigation-backed.
   - Advisor approval and escalation are genuinely wired.
   - Advisor-side request evidence, request analyst rebuild, return/send-back, and reject/rebuild are visible or implied but static/blocked in this component.
   - Option alternatives exist in demo data but are not rendered as an operational option-comparison control.

3. Command/Test Proof Explorer
   - D1 tests prove no-overclaim, role/contract boundaries, and gate logic.
   - The D1 test set does not directly execute the full command-bus mutation paths for `runAdvisorApprovalWorkflowMutation`.
   - No D1 UI test clicks "Approve for compliance review"; the test proves visible contract shape rather than end-to-end mutation.
   - Existing command-bus code does implement `reject_unsupported_claim`, `rebuild_with_evidence`, `advisor_approve`, and related negative paths, but UI proof is uneven.

## Test Evidence

Command:

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3127 pnpm playwright test tests/analyst-draft-proof-boundary-ui.spec.ts tests/analyst-draft-governance-contract.spec.ts tests/advisor-review-approval-ui.spec.ts tests/workflow-gate.spec.ts --workers=1
```

Result: 22 passed.

What this proves:

- Analyst draft pages do not visibly overclaim advisor approval, compliance release, export readiness, or client visibility.
- Analyst governance contract covers S033-S035 ownership, internal draft fields, forbidden overclaims, audit requirements, `route_to_advisor`, and evidence requirements for rebuild.
- Advisor review pages expose advisor review surfaces without release/export overclaim.
- Workflow gates keep advisor approval, compliance release, export authority, and client visibility separate.

What this does not prove:

- Full UI-to-command mutation for every analyst/advisor process step.
- Advisor secondary actions such as request evidence, return, reject, send back, or rebuild.
- Selected queue row to exact command target continuity for every action.
- Negative UI proof for wrong role, wrong tenant, missing target, incomplete fixture, and audit-persistence failure.

## Process-Step UI Pendant Matrix

| Process area | Required process-step input | Expected output | Current UI pendant | Workflow/service backing | Classification |
|---|---|---|---|---|---|
| Analyst signal entry S033 | Signal/review context | Analyst enters internal work queue without advice/release/export | Entry cards and route handoffs | Contract-backed, route/readmodel oriented | visible_only |
| Analyst workbench S034 | Selected client, selected draft/review item | Triage context and next action | Search/select queue, selected detail, blocked release/visibility indicators | Readmodel plus contract, limited command usage | actionable_with_blockers |
| Analyst route to advisor S035 | Selected analyst draft, safe evidence/source readiness | Advisor-pending handoff | Handoff handler exists, route push to advisor review | Command exists, UI binding and selected-target proof incomplete | partially_service_backed |
| Analyst request evidence | Missing evidence reason, target object | Evidence request workflow state and audit | Not operationally exposed in analyst rail | Command/service exists elsewhere | absent_for_analyst_ui |
| Analyst reject unsupported claim | Unsupported claim target, reason | Draft rejected/returned with audit | No operational UI binding in D1 surface | Command-bus path exists | absent_for_ui |
| Analyst rebuild with evidence | Accepted scoped evidence, rebuild reason | New internal draft and trace | No operational UI binding in D1 surface | Command-bus path exists with gate | absent_for_ui |
| Source traceability check | Safe source/evidence references | Handoff allowed/blocked by trace state | Generic source/evidence text, no safe-trace gate control | Contract requires it | visible_only |
| Advisor queue S036 | Review package selection | Selected review/package | Search, row selection, open detail | Readmodel/navigation | actionable_ui_only |
| Advisor rationale review S037 | Recommendation rationale, evidence, suitability context | Advisor decision context | Summary cards, objective/recommendation/evidence | Readmodel plus demo data | visible_only |
| Advisor option comparison | Alternatives/options and comparison criteria | Explicit comparison output | Alternatives exist in demo data but are not surfaced as a real comparison control | Demo data only | absent_for_ui |
| Advisor approve | Button confirmation, target recommendation | Advisor approval state, compliance remains pending | "Approve for compliance review" button with status text | Command/client/API-backed | partially_service_backed |
| Advisor escalate | Escalation trigger | Route/escalation handoff | "Escalate advisor review call" button | Command/API-backed, limited output | partially_service_backed |
| Advisor request analyst rebuild | Rebuild reason | Return/rebuild workflow state | Static blocked control | Command exists elsewhere, no UI binding | visible_only |
| Advisor request evidence follow-up | Evidence reason and target | Evidence request workflow state | Static blocked control | Compliance request evidence path exists elsewhere | visible_only |
| Advisor return/send-back/reject | Decision reason and target | Returned/rejected workflow state | Static summary controls only | `reject_unsupported_claim` exists in workflow validation/bus | absent_for_operational_ui |
| Internal-only no-leakage | Role/tenant/runtime boundaries | No internal draft payload leaks to client/export surfaces | Raw internal draft fields not rendered in inspected UI | Contract and tests strong | implemented_for_negative_boundary |

## Findings

### D1-F01: Analyst and advisor lifecycle is not yet fully operational in UI

Severity: P1

The underlying command bus contains important workflow actions, but the default UI does not expose all required process-step inputs and outputs as operational controls. Analyst reject/rebuild/request-evidence and advisor return/reject/request-evidence/rebuild remain absent or static.

Impact: the user can see workflow state and some safe buttons, but cannot complete the complete analyst/advisor lifecycle from UI.

Next target: create a workflow-backed analyst/advisor action spine where each action has selected object, required reason/evidence input, command execution, durable output, and audit/error state.

### D1-F02: Source traceability is contract-required but not a real operational gate in the UI

Severity: P1

The governance contract requires safe source/evidence traceability before handoff. The UI shows source/evidence context, but does not present a clear safe-trace validation result or block/unblock reason as an operational handoff gate.

Impact: a user cannot verify why a draft is trace-safe or why handoff is blocked.

Next target: add a service-backed traceability decision row to the analyst handoff surface, using product-native language and no internal proof vocabulary.

### D1-F03: Advisor option comparison is missing as a usable process-step output

Severity: P1

Alternatives exist in demo data, but the advisor review surface does not render a real option-comparison control. A recommendation can therefore appear reviewable without exposing the comparison basis required for an advisor decision.

Impact: advisor approval can look action-ready while a key decision input is absent.

Next target: render option comparison as a compact decision table with selected option, rejected alternatives, reasons, evidence links, and suitability constraints.

### D1-F04: Advisor approval is wired, but UI proof remains narrower than implementation

Severity: P2

The approval button calls a workflow-backed client path, but D1 tests mostly prove visible contract boundaries and no-overclaim wording. They do not click through the UI action and assert resulting workflow state/audit/pending-compliance output.

Impact: approval is partially service-backed but not fully proven as an end-to-end UI process step in the D1 evidence set.

Next target: add UI proof that clicks advisor approval, verifies exact selected target, audit/event output, `COMPLIANCE_PENDING`, and no client/export release.

### D1-F05: Several visible controls are product-static, not workflow actions

Severity: P2

"Request analyst rebuild", "Request evidence follow-up", "Request info", "Send back", and summary "Approve in detail" controls appear as static spans or blocked controls rather than workflow-backed actions.

Impact: visible UI overstates lifecycle completeness unless explicitly treated as blocked product debt.

Next target: either remove static controls until executable or convert them into workflow commands with required inputs and outputs.

### D1-F06: Operational UI still leaks implementation/proof vocabulary

Severity: P2

The raw internal draft payload is not leaking, but visible text includes proof/system terms such as "draft-governance contracts", "Truth: readmodel + contract", and "No-overclaim". This violates the repo operational UI rule.

Impact: the surface reads like implementation proof rather than product UI.

Next target: replace visible proof wording with product-native state, blockers, next actions, and decision context.

### D1-F07: Selected-object continuity is not fully proven

Severity: P2

Multiple actions use fixed demo targets or route-level demo state. The audit cannot prove for every action that the selected queue row, displayed object, command target, persisted state, and visible output are the same object.

Impact: workflow UI can pass visual/contract checks while mutating a different fixture target.

Next target: add selected-object continuity checks for analyst and advisor commands.

## Missing UI / Service / Proof Layers

- Analyst evidence request UI with reason and target.
- Analyst reject unsupported claim UI with target, reason, output, and audit.
- Analyst rebuild-with-evidence UI with accepted scoped evidence proof.
- Source-trace safe/unsafe operational gate before handoff.
- Advisor option-comparison UI.
- Advisor return/send-back/reject UI.
- Advisor request evidence follow-up UI.
- Advisor request analyst rebuild UI.
- UI mutation proof for advisor approval.
- Negative UI proof for wrong role, wrong tenant, missing target, missing evidence, and audit failure.
- Product-native replacement for visible proof vocabulary.

## Recommended Next Ticket Shapes

1. `D2-ANALYST-ACTION-SPINE`
   - Scope: analyst request evidence, reject unsupported claim, rebuild with evidence, and route to advisor.
   - Required proof: selected target continuity, command mutation, audit event, blocked negative paths.

2. `D2-SOURCE-TRACE-GATE`
   - Scope: source/evidence traceability as product-native handoff gate.
   - Required proof: missing trace blocks handoff, safe trace enables only advisor-pending state.

3. `D2-ADVISOR-DECISION-CONTROLS`
   - Scope: option comparison, rationale capture, request evidence, return/reject, request rebuild, approve.
   - Required proof: every action has inputs, workflow command, state output, audit/evidence output, no client release.

4. `D2-SELECTED-OBJECT-CONTINUITY`
   - Scope: selected row to command target to persisted output consistency.
   - Required proof: tests fail if the UI mutates a hardcoded fixture unrelated to selected object.

5. `D2-OPERATIONAL-COPY-DEBT-REMOVAL`
   - Scope: remove visible implementation/proof vocabulary from operational surfaces.
   - Required proof: screenshot audit at 1400x900 and text assertions against forbidden scaffold terms.

## Item Outcome

Status: completed as an analysis item.

Changed files:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_D1_ANALYST_ADVISOR_FINDINGS.md`

Tests:

- `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3127 pnpm playwright test tests/analyst-draft-proof-boundary-ui.spec.ts tests/analyst-draft-governance-contract.spec.ts tests/advisor-review-approval-ui.spec.ts tests/workflow-gate.spec.ts --workers=1` -> 22 passed.

Findings:

- No raw analyst draft leakage found in inspected UI.
- Contract and gate boundaries are materially stronger than operational UI completeness.
- Analyst/advisor lifecycle actions still need workflow-backed UI pendants with explicit inputs and outputs.

Next item:

- TASK-E1.
