# EPIC-09-ANALYSIS-01 Domain Gap Report

Generated: 2026-06-28
Ticket: EPIC-09-ANALYSIS-01
Epic: EPIC-09 Signal, Analyst Workbench and Internal Draft Governance
Source: ALPHAVEST_PROCESS_FIRST_REFACTORING_MASTERPLAN_BOC_CTES.json
Baseline: full-workflow @ a42887b

## Ticket Definition Re-Read

Task: Audit all mapped processes and steps for Signal, Analyst Workbench and Internal Draft Governance against current routes, components, services and tests.

Goal: Separate implemented behavior from visual-only or specified-only claims.

Scope:
- BP-034 External signal intake
- BP-038 Analyst workbench triage
- BP-039 Action item creation
- BP-040 Evidence gap identification
- BP-041 Data-quality issue routing
- BP-042 Internal AI/rules draft generation
- BP-043 Draft classification
- BP-044 Unsupported claim detection
- BP-045 Draft rejection
- BP-046 Rebuild with evidence
- BP-047 Internal-only redaction
- BP-048 Source/evidence traceability

Expected output: EPIC-09 domain gap report.

Definition of done: Each mapped process has implementation status and missing step list.

## Extracted EPIC-09 Delivery Chain

EPIC-09 purpose: Implement and prove Signal, Analyst Workbench and Internal Draft Governance as a process-first app area, not as isolated screens.

EPIC-09 goal: Every relevant process/step for DOMAIN-D and DOMAIN-E has a route/component/service/test proof state and user-facing work surface where authorized.

Target app area: AREA-04. Process domains: DOMAIN-D and DOMAIN-E. Target screens: S033, S034, S035.

Ordered child tasks:

1. EPIC-09-ANALYSIS-01 - Step coverage and current implementation audit for Signal, Analyst Workbench and Internal Draft Governance
   - Status in masterplan: Planned
   - Decision: Plan-first analysis
   - Output: EPIC-09 domain gap report
   - DoD: Each mapped process has implementation status and missing step list.

2. EPIC-09-SPEC-01 - Process-first target contract for Signal, Analyst Workbench and Internal Draft Governance
   - Status in masterplan: Blocked until EPIC-09-ANALYSIS-01
   - Decision: No implementation until specification
   - Output: EPIC-09 implementation contract
   - DoD: Acceptance criteria cover positive and negative paths; UI, service and test boundaries are named.

3. EPIC-09-IMPL-01 - Implement Signal, Analyst Workbench and Internal Draft Governance process area
   - Status in masterplan: Blocked until EPIC-09-SPEC-01, EPIC-03-IMPL-01, EPIC-04-IMPL-01 and EPIC-05-IMPL-01
   - Decision: Split required
   - Subtasks:
     - EPIC-09-IMPL-01A - Implement primary area hub/workbench entry
     - EPIC-09-IMPL-01B - Implement queue/detail/step surfaces for core process cluster
     - EPIC-09-IMPL-01C - Implement proof/audit/client-safe boundaries
     - EPIC-09-IMPL-01D - Update process coverage matrix statuses

4. EPIC-09-QA-01 - Positive, negative and screenshot proof for Signal, Analyst Workbench and Internal Draft Governance
   - Status in masterplan: Blocked until EPIC-09-IMPL-01
   - Decision: Split required
   - DoD: Positive path passes; negative path fails closed; screenshots show improved structure or approved exception; coverage matrix reflects result.

## Current Route and Code Coverage

Implemented route seams found:
- S033 `/advisory`
- S034 `/advisory/review-queue`
- S035 `/advisory/triggers/:id/review`
- Navigation groups S033/S034/S035 under Analyst Workbench.

Implemented service/API seams found:
- `lib/p44-phase4-signal-workbench.ts`
- `lib/internal-draft-governance-spine.ts`
- `lib/typed-workflow-command-bus.ts`
- `lib/workflow-gate.ts`
- `lib/permission-engine.ts`
- `lib/visibility-engine.ts`
- `app/api/recommendation-review-workflow/route.ts`
- `app/api/journeys/[id]/commands/route.ts`

Implemented UI seams found:
- `components/internal-workflow-screen.tsx`
- `lib/internal-workflow-demo-data.ts`
- shared primitives including `StatePanel`, `MasterDetailSurface`, `UxDetailStandardPanel`, `Phase4WorkbenchPanel` and `Phase5DetailSplitPanel`.

Implemented test seams found:
- `tests/p44-phase4-certification.spec.ts`
- `tests/internal-draft-governance-spine.spec.ts`
- `tests/workflow-gate.spec.ts`
- `tests/recommendation-review-workflow-api.spec.ts`
- `tests/client-visibility-projection.spec.ts`
- `tests/route-smoke.spec.ts`
- `tests/navigation-shell.spec.ts`
- `tests/ux-master-detail-surface.spec.ts`

## Step Coverage Summary

Source step inventory for BP-034 and BP-038 through BP-048 contains 60 steps.

Current source status distribution:
- partial_current_app_representation: 20 steps
- partial_domain_representation: 10 steps
- specified_not_proven: 30 steps

Process-level source status:

| Process | Name | Current status | Missing step list |
| --- | --- | --- | --- |
| BP-034 | External signal intake | partial_current_app_representation | No missing source-inventory steps, but only partial current app representation. Missing canonical route/process contract and UI step proof for Intake/Triage/Classify/Route/Create trigger. |
| BP-038 | Analyst workbench triage | partial_current_app_representation | No missing source-inventory steps, but only partial current app representation. Missing canonical route/process contract and step-addressable UI proof for Intake/Triage/Classify/Route/Create action/evidence gap. |
| BP-039 | Action item creation | partial_domain_representation | No `specified_not_proven` inventory steps, but action-item creation is not bound to S033/S034/S035 as a hard route contract. Missing role/object/tenant denial proof mapped to EPIC-09. |
| BP-040 | Evidence gap identification | specified_not_proven | BP-040-S01 Intake; BP-040-S02 Triage; BP-040-S03 Classify; BP-040-S04 Route; BP-040-S05 Create action/evidence gap. |
| BP-041 | Data-quality issue routing | partial_current_app_representation | No missing source-inventory steps, but routing is only partially represented through workflow/data-quality seams. Missing EPIC-09-owned acceptance proof on S034/S035. |
| BP-042 | Internal AI/rules draft generation | partial_domain_representation | No `specified_not_proven` inventory steps, but draft generation is still domain-partial. Missing S033/S034/S035 contract and visible step status tied to first-class draft spine. |
| BP-043 | Draft classification | specified_not_proven | BP-043-S01 Generate/classify; BP-043-S02 Review; BP-043-S03 Reject/rebuild; BP-043-S04 Redact; BP-043-S05 Route to advisor. |
| BP-044 | Unsupported claim detection | specified_not_proven | BP-044-S01 Generate/classify; BP-044-S02 Review; BP-044-S03 Reject/rebuild; BP-044-S04 Redact; BP-044-S05 Route to advisor. |
| BP-045 | Draft rejection | partial_current_app_representation | No missing source-inventory steps, but rejection/rebuild proof is split between typed workflow and draft spine. Missing process-first route contract, concise UI blocker state and step-level audit proof. |
| BP-046 | Rebuild with evidence | specified_not_proven | BP-046-S01 Generate/classify; BP-046-S02 Review; BP-046-S03 Reject/rebuild; BP-046-S04 Redact; BP-046-S05 Route to advisor. |
| BP-047 | Internal-only redaction | specified_not_proven | BP-047-S01 Generate/classify; BP-047-S02 Review; BP-047-S03 Reject/rebuild; BP-047-S04 Redact; BP-047-S05 Route to advisor. |
| BP-048 | Source/evidence traceability | specified_not_proven | BP-048-S01 Generate/classify; BP-048-S02 Review; BP-048-S03 Reject/rebuild; BP-048-S04 Redact; BP-048-S05 Route to advisor. |

## Evidence From Current Code

Strong implemented behavior:
- `lib/p44-phase4-signal-workbench.ts` creates signal intake, queue items and audit events with `clientVisible: false`.
- P44 Phase 4 service supports internal workbench actions: assign review, block signal, request evidence and route to advisor.
- P44 Phase 4 certification tests cover signal intake, validation failure, internal triage, action item creation, evidence-gap routing and no-auto-advice proof.
- `lib/internal-draft-governance-spine.ts` introduces first-class internal draft governance models and roles for analyst/advisor/compliance visibility.
- `tests/internal-draft-governance-spine.spec.ts` proves first-class draft models exist and rejects legacy overloaded recommendation draft-field writes.
- S033/S034/S035 exist and are reachable in route/navigation tests.
- S034 uses a master/detail workbench shape and explicitly blocks release/export/client visibility.
- S035 exposes trigger detail, evidence gaps, analyst notes, handoff guard and copy that avoids client-visible advice.
- UI copy repeatedly separates analyst work from advisor approval, compliance release, export and client visibility.

Thin or missing behavior:
- `lib/process-first-ux-contract.ts` does not include S033/S034/S035. The canonical process-first contract currently skips EPIC-09's target screens entirely.
- The only DOMAIN-D process-first contract nearby is S032 for BP-020/BP-021/BP-022, not BP-034/BP-038/BP-039/BP-040/BP-041.
- Advisor route S037 is incorrectly mapped to BP-041/BP-042/BP-043 in the process-first contract, creating domain overlap risk and making EPIC-09 boundaries blurry.
- BP-040 and BP-043 through BP-048 still have 30 `specified_not_proven` steps in the P0 process-step inventory.
- S035 still contains substantial vertical detail, notes, tabs, data gaps and audit/completeness content. It is improved, but long-page risk remains for the given viewport class.
- S034 secondary sections still list metrics, trigger proof queue, draft readiness and controls below the main master/detail surface. This creates no-scroll risk and duplicated proof placement.
- Analyst notes are visibly marked internal/audit-sensitive, but EPIC-09 lacks a dedicated route/source/API negative test proving notes/internal draft payload cannot reach client/export projections.
- Draft classification, unsupported claim detection, evidence-backed rebuild, redaction and source traceability exist as components of larger services, but not as EPIC-09 step-addressable UI/service/test claims.

## Refactor-First Finding

The weak shortcut would be to add more explanatory safety copy to S034/S035. That preserves the old debt: the UI can sound safe while the route contract and step proof remain partial.

The real implementation path is to make AREA-04 a hard process contract:
- Add an EPIC-09 analyst/draft process contract for S033/S034/S035, covering BP-034, BP-038, BP-039, BP-040, BP-041 and BP-042 through BP-048.
- Make S033 the compact area entry, S034 the bounded workbench queue/detail, and S035 the selected trigger/draft review object. Do not let all three repeat proof, history and command context.
- Treat BP-040 evidence-gap identification as a first-class bridge into the evidence lifecycle, not as a card on trigger detail.
- Treat BP-043 through BP-048 as a first-class internal draft state machine, not as scattered labels across advisor and analyst UI.
- Move proof/audit into concise summaries and drawers/tabs while keeping blockers and next actions above the fold.
- Add negative tests for no client/export/internal-note leakage and no advisor/compliance overclaim after analyst actions.

## Bold Recommendation For EPIC-09-SPEC-01

Recommended option: hard canonical AREA-04 contract and a first-class internal draft state machine.

Define a new EPIC-09 contract that removes the loose split between analyst workbench UI, P44 phase services and internal draft governance:
- Extend `ProcessFirstUxPageFamily` with `analyst_signal_hub`, `analyst_workbench` and `analyst_trigger_review`.
- Add S033/S034/S035 contracts in `lib/process-first-ux-contract.ts` with explicit BP coverage, forbidden overclaims and gate ids.
- Add a typed contract module such as `lib/analyst-draft-governance-contract.ts` that names allowed states, commands, route owners, forbidden fields, audit events, UI proof attributes and test ids for BP-034/BP-038 through BP-048.
- Use `lib/p44-phase4-signal-workbench.ts` and `lib/internal-draft-governance-spine.ts` as implementation backing, but stop letting them be implicit proof. They must be referenced by route/service/test acceptance criteria.
- Shrink S034/S035 for the target viewport by default: primary job, selected object, blocker and one next action visible without page scroll; proof/history/secondary queues behind tabs/drawers or below only as non-primary context.

Rejected weaker options:
- Add another safety panel to S035: rejected because it increases long-page debt and does not close route-contract proof.
- Mark P44 Phase 4 services as full EPIC-09 completion: rejected because 30 steps remain `specified_not_proven`.
- Move all signal/draft proof into advisor review: rejected because it smears the analyst/advisor boundary and makes advisor approval look like draft governance.
- Leave S033/S034/S035 outside `process-first-ux-contract.ts`: rejected because the acceptance surface stays visual-only for the target area.

## Decision Gate

EPIC-09-ANALYSIS-01 is complete.

EPIC-09-SPEC-01 can start because the domain audit is now complete. It should remain a specification ticket, not implementation. The spec must name UI, service and test boundaries before EPIC-09-IMPL-01 starts.

No human product decision is required to write the spec. A human decision will be required before implementing any new route, route merge, schema/API expansion or advisor/compliance boundary change not already covered by the True-UX route evolution authority.

## Screenshot Decision

No screenshot was warranted for EPIC-09-ANALYSIS-01. This ticket produced a source/report audit only and did not change visible UI.

## Validation

Commands run:
- `git status --short`
- `git branch --show-current`
- `git log -1 --oneline`
- `git diff --stat`
- `cat package.json`
- `pnpm guard:source`

Result:
- Branch: `full-workflow`
- Baseline: `a42887b fix: preserve epic 08 upload flow proof copy`
- Source guard: PASS
- Product code changed: no
- UI changed: no
- Safety regression introduced: no
