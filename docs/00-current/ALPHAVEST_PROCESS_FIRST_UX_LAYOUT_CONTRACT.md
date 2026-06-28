# AlphaVest Process-First UX Layout Contract

Status: `APPROVED_PROCESS_FIRST_UX_LAYOUT_CONTRACT`
Approval token: `APPROVE_PROCESS_FIRST_UX_CONTRACT_DOC`
Created: 2026-06-28
Target branch: `full-workflow`

## 1. Authority

This contract governs process-first UX layout refactors derived from:

- `reports/process-first-ux-layout-implementation-plan-2026-06-28/ALPHAVEST_BOC_CTES_PROCESS_FIRST_IMPLEMENTATION_PLAN_V1.json`
- `reports/process-first-ux-layout-implementation-plan-2026-06-28/ALPHAVEST_PROCESS_FIRST_UX_LAYOUT_IMPLEMENTATION_PLAN.json`
- `reports/process-first-ux-layout-implementation-plan-2026-06-28/PROCESS_FIRST_SCREEN_TRACEABILITY_MATRIX.json`
- `reports/webapp-long-screenshot-ux-layout-audit-2026-06-28/WEBAPP_LONG_SCREENSHOT_UX_LAYOUT_AUDIT_ENGINE_V2_V3.json`
- `docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json`

Implementation authority remains `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`.
The P0 business process universe is a traceability reference only. It does not authorize implementation, schema changes, route creation, screen generation, advice behavior, safety weakening or client-visible payload changes by itself.

## 2. Non-Negotiable Rule

Every P0 UX refactor must start from the business process job of the page.

A page is acceptable only when a reviewer can identify near the top:

- the current object or selected work item,
- the current process state,
- the blocking gate or satisfied gate,
- the next permitted action,
- the downstream actions that remain forbidden,
- the BP, ACC and gate IDs that explain why the UI is allowed to show that state.

Long pages are not fixed by hiding sections. They are fixed by making the process architecture real.

## 3. Page Job And Height Contract

Every process-first route must declare exactly one primary page job. Secondary context can exist only when it supports that job without competing with the command zone.

Allowed page-job families:

- `queue`: triage a list and expose one selected work item.
- `detail`: inspect one object and decide the next permitted process step.
- `decision`: approve, block, release or submit a decision with visible preconditions.
- `stepper`: complete one step of a controlled multi-step workflow.
- `audit_reference`: read proof, history or policy without mutating state.
- `confirmation`: confirm one irreversible or sensitive action after prerequisites are met.

Height rules:

- Any route over `3000px` must include local anchors, a sticky summary/step rail, or an approved exception in the implementation proof.
- Any MVP workflow route over `3400px` must be split into a real process pattern: master-detail, stepper, tabs, drawer extraction, or a route split with an approved True-UX record.
- Any route over `3400px` that remains unsplit must carry an explicit exception ledger entry with owner, reason, expiry condition and follow-up ticket.
- A screenshot height reduction is never acceptance by itself. The route must also preserve BP/ACC/gate semantics and forbidden-overclaim tests.

## 4. Forbidden Substitutes

The following are not acceptable implementations for process-first UX tickets:

- cosmetic copy-only changes,
- accordion-only hiding,
- overlay-only fixes,
- test-only expectation changes,
- documentation-only substitutions,
- fake success states,
- placeholder panels,
- route-local one-off styling that bypasses shared primitives,
- generic guidance layers that leave the target surface structurally unchanged,
- route creation or route split without a True-UX route-evolution or screen-split record.

If a smaller substitute is unavoidable, the implementation must report the actual blocker, the real refactor path inspected, the temporary scope, and the follow-up task needed to remove the substitute.

## 5. Shared Implementation Contract

Use shared primitives before adding page-local UI:

- `components/worksurface-shell.tsx`
- `components/ui/page-template.tsx`
- `components/ui/action-zone.tsx`
- `components/ui/master-detail-surface.tsx`
- `components/ui/process-gate-rail.tsx`
- `components/ui/data-table.tsx`
- `components/ui/state-panel.tsx`
- `lib/process-first-ux-contract.ts`
- `lib/ux-page-template-system.ts`
- `lib/ux-action-hierarchy-contract.ts`

EPIC-04-specific master-detail, data-surface and long-screen governance is
machine-readable in
`docs/00-current/ALPHAVEST_MASTER_DETAIL_DATA_SURFACE_LONG_SCREEN_GOVERNANCE_CONTRACT.json`.
That contract is the acceptance layer for allowed/forbidden usage, target-screen
expectations, runtime attribute requirements and no-overclaim rules.

EPIC-05-specific status, action, blocker and confirmation governance is
machine-readable in
`docs/00-current/ALPHAVEST_STATUS_ACTION_BLOCKER_CONFIRMATION_PRIMITIVES_CONTRACT.json`.
That contract is the acceptance layer for shared status hierarchy, command
semantics, blocker metadata, confirmation scope and no-overclaim rules.

`ProcessGateRail` is the canonical visible process gate primitive for this workstream. Critical call sites must pass machine-readable process metadata:

- `businessProcessIds`
- `acceptanceIds`
- `gateIds`
- `currentStep`
- `blockedReason`

## 6. Proof And Audit Placement Rules

Proof and audit content must be placed by page family, not appended wherever space is available.

| Page family | Primary zone | Proof/audit placement | Forbidden placement |
| --- | --- | --- | --- |
| `queue` | selected work item, current blocker, next action | compact row metadata, selected-detail rail, drawer for audit/history | full audit timeline below every row |
| `detail` | current object state and one next permitted step | secondary tab/drawer or right rail with BP/ACC IDs | proof blocks that push the command zone below the fold |
| `decision` | preconditions, blocked/release state, primary decision command | sticky process rail and audit drawer; negative blockers stay visible | mixed release, client visibility and export actions in one command area |
| `stepper` | current step, allowed transition, blocked downstream steps | step checklist and per-step evidence drawer | generation/download/share controls before their gate |
| `audit_reference` | read-only proof, timeline and provenance | main content can be audit-first; mutation commands are absent or disabled | approval or release controls presented as audit actions |
| `confirmation` | action summary, irreversible impact, second confirmation | minimal evidence summary plus audit intent | hidden payload, broad export/share copy, or post-hoc approval |

Command-zone rules:

- A page has one primary command zone.
- Secondary commands must be visually subordinate and must not imply downstream gates are satisfied.
- Disabled commands must name the missing BP/ACC/gate condition.
- Client-visible or export-adjacent commands must fail closed when redaction, release or visibility gates are missing.

### Strict Worksurface Slot Contract

Shared P0 workflow screens must render through a named shell slot contract instead of uncontrolled vertical stacking. `WorksurfaceShell` and `lib/ux-page-template-system.ts` are responsible for making this contract source-testable.

Allowed shell slots by page family:

| Page family | Page job | Required slots | Optional slots | Freeform children |
| --- | --- | --- | --- | --- |
| `client_summary` | `client_summary` | `summary`, `primary_content`, `action_zone`, `state_zone` | `proof_audit_zone` as client-safe summary only | forbidden unless explicitly classified as supporting client-safe proof |
| `dashboard_list` | `queue` | `summary`, `primary_content`, `action_zone`, `state_zone` | `secondary_content`, `proof_audit_zone` | forbidden on productive P0 routes unless classified into an allowed optional slot |
| `workbench_master_detail` | `queue_detail` | `primary_content`, `secondary_content`, `action_zone`, `state_zone` | `summary`, `proof_audit_zone` | forbidden on productive P0 routes unless classified into an allowed optional slot |
| `detail_decision_room` | `decision_room` | `summary`, `primary_content`, `proof_audit_zone`, `action_zone`, `state_zone` | `secondary_content` | forbidden on productive P0 routes unless classified as proof/audit support |
| `workflow_stepper` | `stepper` | `summary`, `primary_content`, `action_zone`, `state_zone` | `secondary_content`, `proof_audit_zone` | forbidden on productive P0 routes unless classified into the current step support slot |
| `reference_hold` | `audit_reference` | `summary`, `state_zone` | `secondary_content` | allowed only for non-productive reference or hold content; mutation slots stay forbidden |

Additional shell rules:

- A productive P0 worksurface must expose typed `pageJob` and `activeStep` metadata at the shell boundary.
- `primary`, `secondary`, `rail` and `children` must not collapse into one undifferentiated scroll column. `secondary` maps to `secondary_content`; `rail` maps to the single `action_zone`; `children` must declare an explicit policy before it can render on a productive P0 route.
- A productive P0 page may have exactly one command zone. A summary rail may contain status or subordinate navigation, but it must not become a second primary command zone.
- Proof/audit material must render in the family-approved slot and must be compact/collapsible when it would push the command zone below the primary work. A full audit timeline below every primary block is forbidden.
- Any long-screen exception must be machine-readable and include owner, reason, expiry condition and follow-up ticket. An exception is a debt ledger entry, not acceptance.

### QueueWorkbench Adoption Contract

Productive queue screens must migrate from stacked list/detail/audit pages into a shared `QueueWorkbench` / `MasterDetailSurface` pattern when the page job is queue triage, review intake, evidence review, compliance release intake, advisor work intake, vault review, governance user review or access-request review.

Required QueueWorkbench zones:

- `master_list`: dense, scannable queue rows with one selected object.
- `selected_detail`: selected object facts, blockers, process state and safe next step.
- `action_rail`: one command zone, visibly gated and subordinate to missing BP/ACC/gate reasons.
- `proof_drawer`: audit, evidence lineage, timeline and policy proof as a secondary drawer/tab, not a full vertical appendix.
- `selection_state`: stable selected object id and state exposed through data attributes.

Required data attributes and state behavior:

- The shared surface must expose `data-ux-queue-workbench="true"`.
- The selected row must expose `data-ux-queue-selected="true"` and preserve selection through local filter/sort/status changes where the selected object remains in the result set.
- The surface must expose `data-ux-queue-selected-object`, `data-ux-queue-selected-state`, `data-ux-queue-proof-placement` and `data-ux-queue-action-rail`.
- Empty states must keep the action rail disabled or absent and must not imply completion.

Dense row field priorities:

1. Object identity and current process state.
2. Blocking reason or missing gate.
3. Owner / role / due or SLA signal.
4. Evidence, release, redaction, audit or permission risk signal.
5. Secondary metadata only if it helps triage the selected work item.

Audit/proof drawer handoff:

- Audit/proof payloads move to `proof_drawer` or a compact secondary tab.
- Queue rows may show proof counts or blocker badges, but not full audit timelines.
- Detail panes may summarize the current proof state, but the drawer owns history/provenance expansion.
- A queue workbench may not use audit visibility as approval, release, export, evidence sufficiency or permission-change proof by itself.

### Typed Status And Command Hierarchy

P0 queue, workbench, decision and export surfaces must use one shared status/command language instead of local route-specific interpretations.

Canonical status levels:

| Level | Meaning | Command implication | Required fields |
| --- | --- | --- | --- |
| `blocking` | Downstream work is stopped. | No primary completion command may imply success. | blocker reason, recovery action |
| `attention` | Work needs review or remediation before a later gate. | Recovery command may be shown, but completion remains separate. | attention reason, recovery action |
| `informational` | Context only. | Status-only; no mutation authority. | none unless local copy names a blocker |
| `completed` | A named local action completed. | Status-only unless the next command has its own gate. | no downstream completion claim |

Command hierarchy rules:

- Blockers must expose both `reason` and `recoveryAction`.
- A completed status is scoped to the local action only and must not imply release, export, evidence sufficiency, client visibility, permission mutation or client acceptance.
- Route-local status labels must map into `lib/ux-status-command-hierarchy.ts` before they can drive queue or action UI.
- Secondary queue migrations must use this hierarchy before expanding advisor, vault, governance or access-request workbench cleanup.

## 7. P0 Route Mapping

The following route families are locked as initial process-first refactor targets.

| Ticket | Screen/Page | Route | Domains | BP IDs | ACC IDs | Gate IDs | Required Process Job |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `IMPL-A` | `S032` / `032` | `/actions` | `DOMAIN-D`, `DOMAIN-I` | `BP-020`, `BP-021`, `BP-022` | `ACC-002` | `P0_ACTION_BOARD_GATE` | Action triage without implying evidence sufficiency, advisor approval, compliance release or client visibility. |
| `IMPL-B1` | `S037` / `037` | `/advisor/reviews/:id` | `DOMAIN-F`, `DOMAIN-I` | `BP-041`, `BP-042`, `BP-043` | `ACC-004` | `P0_ADVISOR_APPROVAL_NOT_RELEASE_GATE` | Advisor candidate review that cannot release advice or unlock client visibility. |
| `IMPL-B2` | `S039` / `039` | `/compliance/reviews/:id/decision-room` | `DOMAIN-G`, `DOMAIN-H`, `DOMAIN-I` | `BP-051`, `BP-052`, `BP-053`, `BP-061`, `BP-062` | `ACC-005`, `ACC-006`, `ACC-007` | `P0_COMPLIANCE_RELEASE_GATE`, `P0_CLIENT_VISIBILITY_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Compliance block/release decision with evidence, policy, permission and audit preconditions visible before mutation. |
| `IMPL-D` | `S046` / `046` | `/evidence` | `DOMAIN-C`, `DOMAIN-I` | `BP-030`, `BP-031`, `BP-032` | `ACC-002`, `ACC-007` | `P0_EVIDENCE_SUFFICIENCY_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Evidence vault review with lineage and sufficiency separated from upload existence. |
| `IMPL-D` | `S047` / `047` | `/evidence/:id/review` | `DOMAIN-C`, `DOMAIN-I` | `BP-030`, `BP-031`, `BP-032` | `ACC-002`, `ACC-007` | `P0_EVIDENCE_SUFFICIENCY_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Evidence detail separates document presence from accepted, current, scoped evidence. |
| `IMPL-E` | `S048` / `048` | `/governance` | `DOMAIN-L`, `DOMAIN-I` | `BP-071`, `BP-072`, `BP-073` | `ACC-007` | `P0_GOVERNANCE_CHANGE_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Governance user administration without silent access changes or compliance bypass. |
| `IMPL-E` | `S050` / `050` | `/governance/access-requests/:id` | `DOMAIN-L`, `DOMAIN-I` | `BP-071`, `BP-072`, `BP-073` | `ACC-007` | `P0_GOVERNANCE_CHANGE_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Access request decision with approval and audit as separate process gates. |
| `IMPL-E` | `S051` / `051` | `/governance` | `DOMAIN-I`, `DOMAIN-L` | `BP-073` | `ACC-007` | `P0_AUDIT_PERSISTENCE_GATE` | Access audit history as proof, not as a state-changing approval surface. |
| `IMPL-C` | `S056` / `056` | `/export/:id/redaction` | `DOMAIN-J`, `DOMAIN-H`, `DOMAIN-I` | `BP-082`, `BP-087` | `ACC-008` | `P0_EXPORT_REDACTION_GATE` | Redaction removes forbidden internal payloads before preview, approval, generation or delivery can continue. |
| `IMPL-C` | `S057` / `057` | `/export/:id/approval` | `DOMAIN-J`, `DOMAIN-H`, `DOMAIN-I` | `BP-082`, `BP-087` | `ACC-008` | `P0_EXPORT_REDACTION_GATE` | Approval records only scoped approval; generation, download, share and client acceptance remain later gates. |
| `EPIC-00/P0` | `S029` / `029` | `/documents/review-queue` | `DOMAIN-C`, `DOMAIN-I` | `BP-024`, `BP-028`, `BP-030`, `BP-032`, `BP-081`, `BP-082` | `ACC-002`, `ACC-007` | `P0_UPLOAD_NOT_SUFFICIENCY_GATE`, `P0_EVIDENCE_SUFFICIENCY_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Extraction/review queue without treating upload or extraction as sufficiency. |
| `EPIC-00/P0` | `S035` / `035` | `/advisory/triggers/:id/review` | `DOMAIN-D`, `DOMAIN-E`, `DOMAIN-F`, `DOMAIN-I` | `BP-038`, `BP-039`, `BP-041`, `BP-042`, `BP-043`, `BP-051`, `BP-082` | `ACC-003`, `ACC-004`, `ACC-007` | `P0_AI_DRAFT_INTERNAL_ONLY_GATE`, `P0_ADVISOR_NOT_RELEASE_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Trigger review and advisor-stage routing without internal-draft or release overclaim. |
| `EPIC-00/P0` | `S038` / `038` | `/compliance/reviews` | `DOMAIN-G`, `DOMAIN-I` | `BP-061`, `BP-062`, `BP-081`, `BP-082`, `BP-083` | `ACC-005`, `ACC-007` | `P0_COMPLIANCE_RELEASE_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Compliance queue triage with one selected recommendation and explicit release/block preconditions. |
| `EPIC-00/P0` | `S044` / `044` | `/decisions/:id` | `DOMAIN-H`, `DOMAIN-I` | `BP-081`, `BP-082`, `BP-083` | `ACC-006`, `ACC-007` | `P0_CLIENT_VISIBILITY_FAIL_CLOSED_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Client decision room after release, with client-safe projection and audit proof. |
| `EPIC-00/P0` | `S055` / `055` | `/export/:id/scope` | `DOMAIN-J`, `DOMAIN-H`, `DOMAIN-I` | `BP-084`, `BP-085`, `BP-082` | `ACC-008`, `ACC-007` | `P0_EXPORT_SCOPE_GATE`, `P0_EXPORT_REDACTION_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Export scope selection only; no preview, approval, generation, download or share. |
| `EPIC-00/P0` | `S058` / `058` | `/export/:id/download` | `DOMAIN-J`, `DOMAIN-H`, `DOMAIN-I` | `BP-087`, `BP-082` | `ACC-008`, `ACC-007` | `P0_EXPORT_DOWNLOAD_GATE`, `P0_AUDIT_PERSISTENCE_GATE` | Download/share confirmation only after scoped, redacted and approved package is safe. |

## 8. Acceptance Rules By Risk Family

### Action Board

The selected action, missing evidence, owner/due date and next permitted action must be visible near the top. The page must not imply readiness, advisor approval, compliance release, export readiness or client visibility.

### Advisor Review

Advisor approval is a prerequisite only. It must not create compliance release, export readiness, client visibility or client acceptance.

### Compliance Decision Room

Release controls must appear only with preconditions and blocked reasons. Missing evidence, missing advisor approval, missing audit persistence, forbidden payload and admin bypass attempts must keep release visibly blocked.

### Evidence And Documents

Upload success cannot imply evidence sufficiency, release readiness, export readiness or client visibility. Evidence sufficiency requires review, scope, currentness, acceptance and client-safe visibility.

Document review queues must use queue/detail separation. Extraction, verification, sufficiency and audit history cannot all compete in a single linear scroll column.

### Governance And Admin

Admin, platform and governance surfaces must state non-bypass boundaries. No admin action can imply advice release, compliance release, evidence sufficiency, export readiness, audit suppression or client visibility.

### Export

Export is a separated process: create/scope, redact, preview, approve, generate/download, share/client response. Redaction cannot approve, generate, download or share. Approval cannot download/share or create advice release/client acceptance.

## 9. Validation Rules

Every implementation ticket must run the narrow tests named by its work item plus the relevant safety regression tests. At minimum:

- contract or source tests for BP/ACC/gate mapping,
- workflow or visibility tests for safety-critical release and client projection surfaces,
- export safety tests for export and redaction surfaces,
- route or screenshot proof when UI layout changes.

Screenshot height is risk evidence only. It is not implementation readiness, not acceptance proof, and not safety proof.

## 10. Decision Rules

Stop for a user decision when:

- a route must be created, split, merged or deprecated without an existing explicit record,
- a long-screen exception is needed instead of meeting the target height,
- a schema/API change is required beyond the current True-UX handoff,
- a safety rule would need reinterpretation,
- an implementation substitute would hide debt rather than remove it.

Recommendation bias for this workstream: prefer canonical refactors that remove misleading surfaces, duplicate truth, local-only logic and compatibility debt. Do not preserve old structures merely because they already exist.
