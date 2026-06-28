# AlphaVest Process-First UX Layout Contract

Status: `APPROVED_PROCESS_FIRST_UX_LAYOUT_CONTRACT`
Approval token: `APPROVE_PROCESS_FIRST_UX_CONTRACT_DOC`
Created: 2026-06-28
Target branch: `full-workflow`

## 1. Authority

This contract governs process-first UX layout refactors derived from:

- `reports/process-first-ux-layout-implementation-plan-2026-06-28/ALPHAVEST_PROCESS_FIRST_UX_LAYOUT_IMPLEMENTATION_PLAN.json`
- `reports/process-first-ux-layout-implementation-plan-2026-06-28/PROCESS_FIRST_SCREEN_TRACEABILITY_MATRIX.json`
- `artifacts/routes-and-modals/2026-06-28_05-32-44/audit-work/WEBAPP_LONG_SCREENSHOT_UX_LAYOUT_AUDIT_ENGINE_V2_V3.json`
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

## 3. Forbidden Substitutes

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

## 4. Shared Implementation Contract

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

`ProcessGateRail` is the canonical visible process gate primitive for this workstream. Critical call sites must pass machine-readable process metadata:

- `businessProcessIds`
- `acceptanceIds`
- `gateIds`
- `currentStep`
- `blockedReason`

## 5. P0 Route Mapping

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

## 6. Acceptance Rules By Risk Family

### Action Board

The selected action, missing evidence, owner/due date and next permitted action must be visible near the top. The page must not imply readiness, advisor approval, compliance release, export readiness or client visibility.

### Advisor Review

Advisor approval is a prerequisite only. It must not create compliance release, export readiness, client visibility or client acceptance.

### Compliance Decision Room

Release controls must appear only with preconditions and blocked reasons. Missing evidence, missing advisor approval, missing audit persistence, forbidden payload and admin bypass attempts must keep release visibly blocked.

### Evidence And Documents

Upload success cannot imply evidence sufficiency, release readiness, export readiness or client visibility. Evidence sufficiency requires review, scope, currentness, acceptance and client-safe visibility.

### Governance And Admin

Admin, platform and governance surfaces must state non-bypass boundaries. No admin action can imply advice release, compliance release, evidence sufficiency, export readiness, audit suppression or client visibility.

### Export

Export is a separated process: create/scope, redact, preview, approve, generate/download, share/client response. Redaction cannot approve, generate, download or share. Approval cannot download/share or create advice release/client acceptance.

## 7. Validation Rules

Every implementation ticket must run the narrow tests named by its work item plus the relevant safety regression tests. At minimum:

- contract or source tests for BP/ACC/gate mapping,
- workflow or visibility tests for safety-critical release and client projection surfaces,
- export safety tests for export and redaction surfaces,
- route or screenshot proof when UI layout changes.

Screenshot height is risk evidence only. It is not implementation readiness, not acceptance proof, and not safety proof.

## 8. Decision Rules

Stop for a user decision when:

- a route must be created, split, merged or deprecated without an existing explicit record,
- a long-screen exception is needed instead of meeting the target height,
- a schema/API change is required beyond the current True-UX handoff,
- a safety rule would need reinterpretation,
- an implementation substitute would hide debt rather than remove it.

Recommendation bias for this workstream: prefer canonical refactors that remove misleading surfaces, duplicate truth, local-only logic and compatibility debt. Do not preserve old structures merely because they already exist.
