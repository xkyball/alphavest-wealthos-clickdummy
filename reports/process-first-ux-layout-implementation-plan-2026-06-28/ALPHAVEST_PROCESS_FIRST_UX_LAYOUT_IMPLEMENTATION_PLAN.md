# AlphaVest Process-First UX Layout Implementation Plan

Instruction: `max`  
Mode: `ENGINE_MIX_V2_V3` with BoC/CTES delivery-chain discipline.  
Created: 2026-06-28  
Target branch: `full-workflow`  
Status: `IMPLEMENTATION_PLAN_READY_WITH_DECISION_GATES`

## 0. Source Contract

This plan derives an implementation path from:

- Upload prompt: `/Users/chris/projects/tools/BOC_CTES_LOKALER_CODE_CAPABILITY_AUDIT_TICKETSTRUKTUR.md`
- UX/layout audit JSON: `artifacts/routes-and-modals/2026-06-28_05-32-44/audit-work/WEBAPP_LONG_SCREENSHOT_UX_LAYOUT_AUDIT_ENGINE_V2_V3.json`
- P0 process universe: `docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json`
- Repository authority: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- Current code reality inspected in `components/ui/*`, `components/worksurface-shell.tsx`, route family screen components, route registry, P0 proof files and tests.

Authority boundary:

- The True-UX handoff remains implementation authority.
- `universe:p0-business-process-specification` is a planning and traceability reference, not implementation authority.
- The screenshot audit is evidence of layout risk, not proof of functional defects.
- The BoC/CTES upload requires delivery-chain separation, local evidence discipline, CTES sizing, and no automatic overclaim.

Preflight state:

- Branch: `full-workflow`
- Latest commit: `c952cce docs: lock compliance decision room proof`
- `pnpm guard:source`: PASS
- Working tree is already dirty with P0 process / process-gate changes. This plan treats those as current local reality and does not overwrite them.

## 1. Executive Decision

The right implementation path is not a visual cleanup pass. It is a process-first structural refactor that uses the P0 business process universe to decide which page sections belong in the primary workflow, which belong in secondary context, and which actions must remain blocked until the relevant process gate passes.

Primary implementation thesis:

> Every long or overloaded surface must be refactored by process job, not by visual preference. The first question is: "Which P0 process step is the user trying to complete here, and which gate prevents the next step?"

The plan should execute in five controlled waves:

1. Process traceability foundation.
2. Shared process-first layout contract.
3. P0 route-family refactors for the worst long screens.
4. Safety and proof hardening.
5. Recapture and QA closure.

Do not create new routes unless a True-UX route-evolution record or screen-split decision is explicitly present. Prefer target-surface migration inside existing route families.

## 2. Evidence Summary

Screenshot audit facts:

- `88/88` screenshots captured.
- `42` long-screen risks.
- `77` capture QA warnings.
- Tallest screens:
  - S056 `/export/:id/redaction`: `5921px`
  - S039 `/compliance/reviews/:id/decision-room`: `5531px`
  - S032 `/actions`: `5443px`
  - S037 `/advisor/reviews/:id`: `5147px`
  - S057 `/export/:id/approval`: `4353px`

Audit recommendation drivers:

- REC-01: decision-room page template.
- REC-02: export stepper.
- REC-03: operational queue/workbench density.
- REC-04: local navigation for legitimate long pages.
- REC-06: modal/drawer suitability rules.
- REC-07: separate audit/history from primary decision.
- REC-09: capture naming traceability.

P0 process drivers:

- `DOMAIN-C`: Evidence and Document Processes.
- `DOMAIN-D`: Signal, Trigger and Workbench Processes.
- `DOMAIN-F`: Advisor Review and Approval Processes.
- `DOMAIN-G`: Compliance Review, Block and Release Processes.
- `DOMAIN-H`: Client Visibility and Communication Processes.
- `DOMAIN-I`: Decision Record and Evidence Vault Processes.
- `DOMAIN-J`: Export, Redaction and Delivery Processes.
- `DOMAIN-L`: Platform, Tenant and Template Administration Processes.

P0 acceptance gates that must shape the UI:

- `ACC-002`: upload is candidate evidence only, not sufficiency.
- `ACC-004`: advisor approval is not compliance release.
- `ACC-005`: compliance release requires advisor/evidence/audit/precondition proof.
- `ACC-006`: client visibility is fail-closed and allow-listed.
- `ACC-007`: critical actions require audit persistence or fail closed.
- `ACC-008`: export must be scoped, redacted, approved and free of forbidden payload.

## 3. Current Repo Reality

Reusable pieces already exist and should be used:

- `components/worksurface-shell.tsx`
- `components/ui/page-template.tsx`
- `components/ui/action-zone.tsx`
- `components/ui/master-detail-surface.tsx`
- `components/ui/process-gate-rail.tsx`
- `components/ui/data-table.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/validation-feedback.tsx`
- `lib/ux-page-template-system.ts`
- `lib/ux-data-surface-contract.ts`
- `lib/ux-action-hierarchy-contract.ts`
- `lib/p0-acceptance-proof.ts`
- `lib/source-reality-gate.ts`

Current local changes already add:

- `ProcessGateRail`
- process-gate rail adoption in action board, advisor detail, compliance detail, export redaction/approval and evidence templates
- P0 business process universe reference in source reality / P0 acceptance tests

What is still missing:

- A canonical route/page-to-business-process contract.
- A canonical component contract tying process gates to BP/ACC IDs.
- A measurable implementation budget for long-screen reduction.
- A process-first route-family migration sequence.
- A capture QA threshold that turns long-screen risk reduction into acceptance, not just advice.
- A fixed capture naming contract for parameterized routes.

## 4. Process-First Operating Model

Each implementation slice must answer:

- Which P0 domain, BP process IDs, and ACC gates does this route serve?
- What is the primary process job of the screen?
- What is the current blocking gate?
- What is the next permitted action?
- What content is primary, secondary, audit/history, or forbidden from client-safe projection?
- What proof shows the refactor did not weaken safety?

Screen structure rules:

- Queue/workbench pages use master-detail, compact row density and a selected-object summary.
- Decision rooms use a decision detail template with sticky decision/process rail.
- Export pages use a stepper and one primary job per step.
- Evidence/document pages separate upload/review/link/sufficiency.
- Governance/admin pages expose admin authority as non-bypass, not release authority.
- Long pages over `3400px` need split/tabs/stepper/sticky rail.
- Pages over `4800px` are P0 refactor candidates before serious user validation.

## 5. Critical Path

```text
ANALYSIS-1 Local current-source and process traceability inventory
→ SPEC-1 Process-first UI contract and acceptance budget
→ IMPL-FOUNDATION-1 Route/process/acceptance mapping
→ IMPL-FOUNDATION-2 Shared process-first layout primitives
→ IMPL-A Action board master-detail compression
→ IMPL-B Advisor/compliance/decision-room template adoption
→ IMPL-C Export stepper and redaction/approval split
→ IMPL-D Evidence/document sufficiency flow structure
→ IMPL-E Governance/admin non-bypass structure
→ QA-1 Positive/negative safety tests and route/template tests
→ QA-2 Screens-only capture, capture QA, long-screen delta report
→ DECISION-1 Human acceptance or next remediation loop
```

Parallelizable after foundation:

- IMPL-A and IMPL-E can run in parallel.
- IMPL-B and IMPL-C should not run in parallel unless branch/worktree separation exists, because they both touch safety-critical release/export semantics.
- QA-2 waits for all UI slices that should be included in the recapture.

## 6. Implementation Work Items

### ANALYSIS-1 - Process-to-Screen Traceability Inventory

Type: Analysis / Research / Spike  
CTES: 10/20  
Status: `EXECUTE_FIRST`

Goal: Produce the local matrix that ties screenshot audit risks to route IDs, P0 domains, BP process IDs, ACC gates, current component files and tests.

Target files:

- New report artifact under `reports/process-first-ux-layout-implementation-plan-2026-06-28/`
- Read-only inputs: audit JSON, P0 process spec, route registry, route-family components, tests.

Output:

- `PROCESS_FIRST_SCREEN_TRACEABILITY_MATRIX.json`
- Each row: `pageId`, `route`, `auditFinding`, `heightPx`, `domainIds`, `businessProcessIds`, `acceptanceIds`, `primaryProcessJob`, `blockingGate`, `targetComponent`, `tests`.

Acceptance:

- S032, S037, S039, S056 and S057 have complete traceability rows.
- No row claims implementation readiness from screenshot evidence alone.
- Matrix parses as JSON.

Validation:

- `node -e "JSON.parse(require('fs').readFileSync('...'))"`
- `pnpm guard:source`

### SPEC-1 - Process-First UI Contract

Type: Specification / Acceptance Criteria  
CTES: 9/20  
Status: `EXECUTE_AFTER_ANALYSIS-1`

Goal: Lock the implementation contract before changing UI structure.

Target files:

- `docs/00-current/ALPHAVEST_PROCESS_FIRST_UX_LAYOUT_CONTRACT.md` or report-local equivalent if docs are not approved.

Contract sections:

- Page-family rule: queue, decision room, export stepper, evidence detail, governance admin.
- Process gate rail data contract.
- Long-screen budget and exception rules.
- Modal/drawer suitability rules.
- Capture QA and proof rules.
- No-overclaim copy requirements.

Acceptance:

- Contract states that `universe:p0-business-process-specification` is traceability reference only.
- Contract maps every P0 UI refactor to BP/ACC IDs.
- Contract names forbidden shortcuts: cosmetic copy-only, hiding with accordions, overlay-only fixes, route creation without record.

### IMPL-FOUNDATION-1 - Canonical Route/Process/Acceptance Mapping

Type: Implementation / Foundation  
CTES: 12/20  
Status: `EXECUTE_AFTER_SPEC-1`

Goal: Add a typed local contract that lets UI and tests ask, for a page ID, which P0 process and acceptance gates govern the screen.

Proposed target files:

- `lib/process-first-ux-contract.ts`
- `tests/process-first-ux-contract.spec.ts`
- optional integration into `lib/p0-acceptance-proof.ts`

Minimum fields:

```ts
type ProcessFirstUxRouteContract = {
  pageId: string;
  route: string;
  primaryProcessJob: string;
  domainIds: string[];
  businessProcessIds: string[];
  acceptanceIds: string[];
  gateIds: string[];
  pageFamily: "queue" | "decision_room" | "export_step" | "evidence_detail" | "governance_admin" | "client_projection" | "reference";
  nextPermittedAction: string;
  forbiddenOverclaims: string[];
};
```

Initial required rows:

- `032` Action Board: DOMAIN-D, evidence/workbench gates.
- `037` Advisor Approval Detail: DOMAIN-F, `ACC-004`.
- `039` Compliance Review Detail: DOMAIN-G, `ACC-005`, `ACC-007`.
- `056` Export Redaction: DOMAIN-J, `ACC-008`.
- `057` Export Preview: DOMAIN-J, `ACC-008`.
- `046/047` Evidence Vault/Detail: DOMAIN-C/I, `ACC-002`.
- `048/050/051` Governance/Admin: DOMAIN-B/L, `ACC-001`, admin non-bypass.

Acceptance:

- Every initial P0 risk page has a route contract.
- Tests fail if a P0 long-screen target lacks BP/ACC/gate mapping.
- Contract does not authorize new behavior by itself.

### IMPL-FOUNDATION-2 - ProcessGateRail Contract Hardening

Type: Implementation / Shared Component  
CTES: 10/20  
Status: `EXECUTE_AFTER_IMPL-FOUNDATION-1`

Goal: Extend the existing `ProcessGateRail` so process references are machine-readable, not only visible copy.

Target files:

- `components/ui/process-gate-rail.tsx`
- `tests/p0-process-first-ux-burndown.spec.ts`
- possibly `components/ui/index.ts`

Change:

- Add optional props: `businessProcessIds`, `acceptanceIds`, `gateIds`, `currentStep`, `blockedReason`.
- Render data attributes:
  - `data-ux-process-business-processes`
  - `data-ux-process-acceptance-gates`
  - `data-ux-process-gate-ids`
  - `data-ux-process-blocked-reason`

Acceptance:

- Existing call sites continue to work.
- Critical call sites pass explicit BP/ACC/gate IDs.
- Tests assert metadata presence for S032, S037, S039, S056 and S057.

### IMPL-A - Action Board Master-Detail Compression

Type: Implementation / Route Family Refactor  
CTES: 12/20  
Status: `EXECUTE_AFTER_FOUNDATION`

Target audit issue:

- S032 `/actions`, `5443px`, `EXCESSIVE_LENGTH`.

Business process basis:

- DOMAIN-D Signal, Trigger and Workbench Processes.
- Build path step 7 where relevant: internal draft / analyst review / rebuild with evidence.
- Acceptance links: `ACC-002`, `ACC-003` as relevant to evidence and internal draft boundaries.

Target files:

- `components/wealth-actions-screen.tsx`
- `lib/wealth-actions-demo-data.ts`
- `tests/p0-process-first-ux-burndown.spec.ts`
- possibly `tests/ux-master-detail-surface.spec.ts`

Implementation moves:

- Keep `MasterDetailSurface`.
- Compress board into process lanes and selected work item summary.
- Move secondary evidence/audit detail into the selected detail rail.
- Keep `ProcessGateRail` above work details with explicit `businessProcessIds` and `acceptanceIds`.
- Remove repeated explanatory/state panels that duplicate the gate rail.

Acceptance:

- Selected action, missing evidence, owner/due date and next permitted action are visible near the top.
- No copy implies action readiness, advisor approval, compliance release, export or client visibility.
- Capture height target: reduce S032 below `3400px`, or document remaining long-page exception with section navigation.

Tests:

- `pnpm playwright test tests/p0-process-first-ux-burndown.spec.ts --workers=1`
- `pnpm playwright test tests/ux-master-detail-surface.spec.ts --workers=1`
- `pnpm playwright test tests/route-smoke.spec.ts --workers=1`

### IMPL-B - Advisor/Compliance Decision-Room Template Adoption

Type: Implementation / Safety-Critical Route Family Refactor  
CTES: 14/20  
Status: `SPLIT_REQUIRED`

Target audit issues:

- S037 `/advisor/reviews/:id`, `5147px`, `EXCESSIVE_LENGTH`.
- S039 `/compliance/reviews/:id/decision-room`, `5531px`, `EXCESSIVE_LENGTH`.
- S044 `/decisions/:id`, `3838px`, `APPEND_ONLY_PAGE_GROWTH`.

Business process basis:

- DOMAIN-F Advisor Review and Approval.
- DOMAIN-G Compliance Review, Block and Release.
- DOMAIN-I Decision Record and Evidence Vault.
- `ACC-004`, `ACC-005`, `ACC-007`.

Split into:

#### IMPL-B1 - Advisor Detail Is Not Release

Target files:

- `components/internal-workflow-screen.tsx`
- `tests/p0-process-first-ux-burndown.spec.ts`
- `tests/recommendation-review-workflow-api.spec.ts`
- `tests/workflow-gate.spec.ts`

Moves:

- Keep advisor approval detail focused on advisor candidate review.
- Make compliance-pending state explicit in `ProcessGateRail`.
- Move release/evidence/audit details into secondary context or links to compliance route.

Acceptance:

- Advisor detail cannot visually or functionally imply release.
- Advisor approval state does not set client visibility, export readiness or client acceptance.

#### IMPL-B2 - Compliance Detail Decision Room

Target files:

- `components/internal-workflow-screen.tsx`
- `components/worksurface-shell.tsx` if needed for stronger sticky rail support.
- `tests/client-visibility-proof.spec.ts`
- `tests/journey-api.spec.ts`
- `tests/workflow-gate.spec.ts`

Moves:

- Use one sticky process/decision rail for release state.
- Keep evidence sufficiency, forbidden payload, permission and audit prerequisites visible before confirmation.
- Push long audit history into proof/audit zone or secondary section.

Acceptance:

- Release action appears only with preconditions and blocked reasons.
- Missing evidence/advisor/audit/admin bypass blocks release in visible state and tests.
- Capture height target: S039 below `3400px`, or approved long-page decision-room exception with section nav.

### IMPL-C - Export Stepper and Redaction/Approval Split

Type: Implementation / Safety-Critical Flow Refactor  
CTES: 14/20  
Status: `SPLIT_REQUIRED`

Target audit issues:

- S056 `/export/:id/redaction`, `5921px`, `EXCESSIVE_LENGTH`.
- S057 `/export/:id/approval`, `4353px`, `APPEND_ONLY_PAGE_GROWTH`.
- S058 `/export/:id/download`, `3181px`, `LONG_WITH_STRUCTURE_RISK`.

Business process basis:

- DOMAIN-J Export, Redaction and Delivery Processes.
- Build path step 12.
- `ACC-008`.

Target files:

- `components/communication-export-ops-screen.tsx`
- `lib/communication-export-ops-demo-data.ts`
- `components/ui/wizard-stepper.tsx` only if existing stepper needs metadata.
- `tests/export-workflow-api.spec.ts`
- `tests/export-command-spine-contract.spec.ts`
- `tests/true-ux-export-scope-redaction-approval.spec.ts`
- `tests/export-safety.spec.ts`

Moves:

- Treat export as five visible process steps: create/scope, redact, preview, approve, download/share.
- On S056, show only redaction work, forbidden payload status, and next step; move preview/audit/timeline detail below or secondary.
- On S057, approval records only approval; generation/download/share remain separate.
- Add process metadata to stepper or export stage boundary.

Acceptance:

- Redaction cannot approve, generate, download or share.
- Approval cannot download/share or create advice release/client acceptance.
- Export forbidden payload checks remain explicit.
- Capture height target: S056 below `3400px`; S057 below `3400px`.

### IMPL-D - Evidence/Document Sufficiency Structure

Type: Implementation / Route Family Refactor  
CTES: 13/20  
Status: `SPLIT_REQUIRED`

Target audit issues:

- S027-S030 document pages, `2245-2848px`.
- S046 Evidence Vault, `2930px`.
- S047 Evidence Record Detail, `3440px`.

Business process basis:

- DOMAIN-C Evidence and Document Processes.
- DOMAIN-I Decision Record and Evidence Vault.
- `ACC-002`.

Target files:

- `components/client-intake-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/ui/evidence-list.tsx`
- `components/ui/audit-timeline.tsx`
- `tests/document-upload-api.spec.ts`
- `tests/document-upload-flow.spec.ts`
- `tests/evidence-review-api.spec.ts`
- `tests/pp002-evidence-sufficiency-canonical.spec.ts`

Moves:

- Make upload/review/link/sufficiency separate visual states.
- Keep "upload is not sufficiency" in process gate or state boundary.
- Use selected evidence summary and secondary proof/audit zone.

Acceptance:

- Upload success cannot imply evidence sufficiency, release, export or client visibility.
- Evidence detail shows required blocker and next permitted action.
- Capture height target: S047 below `3000px` or approved evidence-detail exception.

### IMPL-E - Governance/Admin Non-Bypass Structure

Type: Implementation / Admin Route Family Refactor  
CTES: 12/20  
Status: `EXECUTE_AFTER_FOUNDATION`

Target audit issues:

- S007 Platform Settings, `3894px`.
- S048/S051 Governance, `3822px`.
- REC-09 capture traceability warnings for route parameters.

Business process basis:

- DOMAIN-B Identity, Access and Governance.
- DOMAIN-L Platform, Tenant and Template Administration.
- `ACC-001`; admin non-bypass decision `DEC-005`.

Target files:

- `components/admin-tenant-setup-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `tests/permission-engine.spec.ts`
- `tests/platform-admin-command-client-source.spec.ts`
- `tests/pp001-admin-audit-proof.spec.ts`

Moves:

- Separate admin settings by category or tabs.
- Use governance master-detail for users/access/audit.
- Ensure admin controls are described as governance changes, not release/export/client-visibility authority.

Acceptance:

- Admin screens state non-bypass boundaries.
- No admin action can imply advice/compliance/evidence/export/client visibility bypass.
- Capture height target: S007/S048/S051 below `3400px`, or documented admin audit exception.

### IMPL-F - Capture Naming Traceability Fix

Type: Tooling / Proof Refactor  
CTES: 8/20  
Status: `EXECUTE_AFTER_UI_SLICES_OR_IN_PARALLEL`

Target audit issue:

- REC-09: `77` QA warnings caused by parameterized route filenames using demo substitutions.

Target files:

- `scripts/capture-routes-and-modals.ts`
- `tests/capture-routes-and-modals-contract.spec.ts` if present, otherwise add focused source contract test.

Moves:

- Preserve route parameter contract in filenames: `id`, `tenantId`.
- Store concrete demo substitution in `index.json` metadata.
- Keep human-readable route path clarity.

Acceptance:

- `capture-qa` naming warnings fall to zero for parameterized routes.
- Screens-only capture still produces 88 PNGs plus `index.json` and `index.md`.

## 7. QA and Validation Plan

Minimum after each implementation slice:

```bash
pnpm guard:source
pnpm playwright test <slice-specific tests> --workers=1
pnpm playwright test tests/route-smoke.spec.ts --workers=1
```

After full plan:

```bash
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm playwright test tests/p0-process-first-ux-burndown.spec.ts tests/ux-page-template-long-page.spec.ts tests/ux-page-template-adoption.spec.ts tests/ux-master-detail-surface.spec.ts --workers=1
pnpm playwright test tests/workflow-gate.spec.ts tests/client-visibility-proof.spec.ts tests/export-safety.spec.ts tests/export-workflow-api.spec.ts --workers=1
AVS_BASE_URL=http://127.0.0.1:3020 pnpm visual:capture-routes:screens-only
```

Capture acceptance:

- `captured=88/88`
- no failed captures
- lower long-screen risk count than current `42`
- S032, S037, S039, S056 and S057 must no longer be `EXCESSIVE_LENGTH`, unless a signed exception exists in the implementation report
- parameterized route naming warnings should be zero after IMPL-F

## 8. Decision Gates

Decision Gate 1: approve writing `docs/00-current/ALPHAVEST_PROCESS_FIRST_UX_LAYOUT_CONTRACT.md` if the plan should become a current repo contract instead of report-local guidance.

Recommendation: approve, because the implementation needs a stable process-first UI contract. Exact approval token:

```text
APPROVE_PROCESS_FIRST_UX_CONTRACT_DOC
```

Decision Gate 2: choose first implementation wedge.

Recommendation: start with `IMPL-FOUNDATION-1` and `IMPL-FOUNDATION-2`, then `IMPL-C` export, because export has the worst height and highest client-safety risk. Exact approval token:

```text
APPROVE_FOUNDATION_THEN_EXPORT_WEDGE
```

Decision Gate 3: confirm capture naming fix timing.

Recommendation: run `IMPL-F` after the structural UI slices, unless capture QA noise blocks evidence review. Exact approval token:

```text
APPROVE_CAPTURE_NAMING_AFTER_UI_SLICES
```

## 9. V3 Branch Debate

Branch A: Visual-only cleanup.

- Killed.
- Reason: violates process-first requirement and would likely hide structure issues without improving P0 gates.

Branch B: Big-bang route redesign.

- Killed.
- Reason: too much route/safety blast radius and likely violates True-UX route evolution discipline.

Branch C: Process contract plus route-family slices.

- Kept.
- Reason: uses existing components, maps to P0 process universe, isolates safety-critical flows and allows proof after each slice.

Branch D: Tooling-only capture/naming fix.

- Kept as support slice only.
- Reason: improves evidence traceability but does not solve user workflow structure.

## 10. Method Artifacts

### Psycho-Logic + Map/Model

Rational logic: long pages reduce scanability and can bury gated decisions.  
Psycho-logic: users need confidence that the next action is legitimate and safe; more visible sections can feel thorough but also create anxiety and uncertainty.  
Map trap: screenshot completeness is not process completeness. A page with every section visible is not a better operating model if the process gate is unclear.  
Design move: every surface should show current process step, blocker, next permitted action and proof/audit boundary.

### Reframing Matrix

| Frame | Weak version | Strong process-first version |
| --- | --- | --- |
| Long page | make it shorter | identify primary process job and move non-current process context out |
| Safety | add warning copy | expose gate state, blocked reason and next permitted action |
| Export | one page with sections | stepper with scope, redaction, preview, approval, delivery |
| Decision room | all proof on page | sticky decision rail plus evidence/proof zones |

### TRIZ

Contradiction: increase proof visibility without increasing page length.  
Improving parameter: decision confidence and safety.  
Worsening parameter: scanability and completion speed.  
Resolution: split by process step, keep blocker summary sticky, move secondary proof into governed zones.

### SIT Closed World

Closed-world resources:

- `WorksurfaceShell`
- `PageTemplateFrame`
- `PageTemplateSectionNav`
- `PageTemplateSummaryRail`
- `MasterDetailSurface`
- `StickyActionZone`
- `ProcessGateRail`
- existing P0 proof and UX template tests

SIT moves:

- Subtraction: remove duplicated safety copy when `ProcessGateRail` already carries it.
- Division: split export into stepper states.
- Task unification: make the right rail carry process gate, next action and proof state.
- Attribute dependency: page height threshold drives required template behavior.
- Multiplication: use the same process metadata across UI, tests and capture QA.

### Morphological Analysis / CCA

Kept variants:

- Decision room + sticky rail + proof/audit zone.
- Export stepper + per-step process gate.
- Queue master-detail + compact rows.
- Evidence detail + sufficiency state.
- Governance admin + non-bypass rail.

Rejected:

- Accordion-only hiding.
- Modal-based complex release/export decisions.
- New route family without route-evolution approval.

### SCAMPER

- Substitute generic card stacks with process templates.
- Combine blocker state, next action and acceptance ID in `ProcessGateRail`.
- Adapt `MasterDetailSurface` for queue compression.
- Modify export pages into explicit process steps.
- Put capture QA to another use as acceptance evidence.
- Eliminate duplicate warning panels.
- Rearrange audit/history into secondary proof zones.

### Harvard / BATNA

Interests:

- User: know what can safely happen next.
- Compliance: no release without proof.
- Product: reduce screen length without weakening safety.
- Engineering: reuse local components and preserve route constraints.

Objective criteria:

- P0 process spec BP/ACC mapping.
- capture height and long-screen count.
- route-smoke and safety tests.
- source guard pass.

BATNA:

- Keep pages long but require section navigation and explicit exceptions. This is acceptable only for lower-risk pages, not S032/S037/S039/S056/S057.

### MESOs

Offer A: Foundation then export wedge.

- Equal value: highest safety impact and biggest height reduction.
- First step: IMPL-FOUNDATION-1/2 then IMPL-C.

Offer B: Foundation then decision-room wedge.

- Equal value: strengthens advisor/compliance/client visibility gates.
- First step: IMPL-FOUNDATION-1/2 then IMPL-B.

Offer C: Foundation then queue/workbench wedge.

- Equal value: quickest visual improvement and repeated-user ergonomics.
- First step: IMPL-FOUNDATION-1/2 then IMPL-A.

Recommendation: Offer A, because export redaction is the tallest page and tied to forbidden payload safety.

## 11. Compliance Checklist

- Upload prompt used as delivery-chain/ticket architecture contract: yes.
- Audit JSON used as evidence input: yes.
- P0 process universe considered: yes.
- True-UX authority preserved: yes.
- Process-first implementation route defined: yes.
- Necessary refactors/extensions named: yes.
- Current codebase inspected: yes.
- CTES applied to work items: yes.
- Weak branches killed: yes.
- Safety and no-overclaim boundaries included: yes.
- Human decision gates explicit: yes.

## 12. Limitations

- This plan does not implement product code.
- Screenshot height is a proxy for UX risk, not proof of runtime behavior.
- The P0 business process spec is uncommitted local state at the time of inspection; it is referenced as current workspace reality, not as committed baseline.
- Existing dirty worktree changes must be preserved and understood before implementation.
- Exact route-evolution authorization must be rechecked before any route creation or split.
