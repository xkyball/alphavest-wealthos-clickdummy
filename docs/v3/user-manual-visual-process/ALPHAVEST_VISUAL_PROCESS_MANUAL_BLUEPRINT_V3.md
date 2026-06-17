# AlphaVest Visual Process Manual Blueprint V3

Generated: 2026-06-17T01:16:08.741Z

## Thesis

This blueprint rebuilds the manual around process explanation. Each workflow has a process graphic, an annotated screenshot, and callout-linked step explanations. Tables are intentionally pushed into secondary support material.

## Research Principles Applied

- NN/g Help and Documentation: Help must stay focused on the user task, list concrete steps, and avoid excessive bulk. (https://www.nngroup.com/articles/help-and-documentation/)
- Microsoft Procedures and Instructions: Complex tasks may need pictures, illustrations, videos, or numbered procedures with supporting visuals. (https://learn.microsoft.com/en-us/style-guide/procedures-instructions/)
- Atlassian Process Documentation: Process documentation records exact workflow steps and may use checklists or flowcharts. (https://www.atlassian.com/work-management/knowledge-sharing/documentation/process-documentation)
- Asana Process Documentation: Screenshots, diagrams, and flowcharts help users understand complex procedures with multiple steps. (https://asana.com/resources/process-documentation)
- TechSmith Workflow Documentation: Visual documentation such as screenshots and walkthroughs creates clearer workflow training material. (https://www.techsmith.com/blog/best-ways-to-document-workflows/)
- ScreenSteps End-User Documentation: Annotated screenshots with arrows, circles, or numbered sequences reduce ambiguity. (https://blog.screensteps.com/10-examples-of-great-end-user-documentation)
- Ritza Screenshot Guidelines: Use focused callouts, avoid too many annotations, keep placement consistent, and combine text with screenshots. (https://styleguide.ritza.co/screenshots/screenshot-guidelines-for-technical-documentation/)

## Coverage

- Workflow modules: 10
- Process graphics: 10
- Annotated screenshots: 10
- Callouts: 30
- Role relays represented: 13

## Workflow Modules

### WS-001. Tenant becomes operational

Outcome: Tenant setup becomes a governed collaboration container.

Why this process exists: A family-office workspace can become active before ownership, compliance, policy, and invitation context are aligned.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-001-tenant-becomes-operational.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-001-tenant-becomes-operational-annotated.png`

Callouts:

- 1. Trigger and source context: Platform Admin establishes baseline
  - Why: This anchors tenant becomes operational in the source context instead of treating the screen as an isolated page.
  - State: TenantStatus: draft -> TenantStatus: onboarding
  - Visibility: Internal setup visible to AlphaVest roles
  - Evidence/audit: Policy changes audit
  - Next role sees: Ops Admin receives a scoped view of the workflow context.
- 2. Review or gate action: Ops Admin creates tenant
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: TenantStatus: onboarding -> UserStatus: invited
  - Visibility: Invited user sees only onboarding context
  - Evidence/audit: Tenant create/team assignment audit expected
  - Next role sees: Compliance can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Invited User accepts and acknowledges scope
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: UserStatus: invited -> UserStatus: active/demo-confirmed
  - Visibility: Client workspace is not treated as operational until gates are satisfied
  - Evidence/audit: Invitation and consent audit expected
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: The UI is navigable with demo data; broad persisted tenant governance transactions are not fully claimed.

### WS-002. Client profile becomes usable shared family context

Outcome: Family context becomes shared, reviewed operating context.

Why this process exists: Family information, relationships, governance roles, and objectives often sit in separate memories, emails, spreadsheets, and documents.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-002-client-profile-becomes-usable-shared-family-context.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-002-client-profile-becomes-usable-shared-family-context-annotated.png`

Callouts:

- 1. Trigger and source context: Principal or Family CFO submits context
  - Why: This anchors client profile becomes usable shared family context in the source context instead of treating the screen as an isolated page.
  - State: WorkflowStatus: draft/new -> WorkflowStatus: in_review
  - Visibility: Client-side profile input remains tenant-scoped
  - Evidence/audit: Profile edits should audit when material
  - Next role sees: Family CFO receives a scoped view of the workflow context.
- 2. Review or gate action: Analyst validates and flags gaps
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: WorkflowStatus: in_review -> WorkflowStatus: awaiting_info or completed
  - Visibility: Analyst sees quality gaps and relationship context
  - Evidence/audit: Missing evidence creates review tasks or data quality issues
  - Next role sees: Advisor can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Advisor reviews governance significance
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: WorkflowStatus: in_review -> WorkflowStatus: awaiting_info or completed
  - Visibility: Advisor sees decision-relevant context only after review
  - Evidence/audit: Missing evidence creates review tasks or data quality issues
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: Profile and relationship screens are navigable with demo data; full persistence is still a stated implementation need.

### WS-003. Document chaos becomes verified evidence

Outcome: Raw documents become classified, checked, and evidence-ready.

Why this process exists: Documents arrive from different people, in different formats, with uncertain sensitivity, entity links, and extracted facts.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-003-document-chaos-becomes-verified-evidence.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-003-document-chaos-becomes-verified-evidence-annotated.png`

Callouts:

- 1. Trigger and source context: Client or advisor uploads source
  - Why: This anchors document chaos becomes verified evidence in the source context instead of treating the screen as an isolated page.
  - State: DocumentStatus: empty -> uploading
  - Visibility: Uploader sees upload/confirmation state
  - Evidence/audit: Upload, extraction review, versioning, correction, verification, and evidence linking should be auditable
  - Next role sees: Family CFO receives a scoped view of the workflow context.
- 2. Review or gate action: System/extraction drafts structure
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: uploading -> uploaded
  - Visibility: Analyst sees extraction detail
  - Evidence/audit: Review action becomes part of the workflow history when applicable.
  - Next role sees: Analyst can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Evidence receives verified source link
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: verified or needs_clarification or blocked -> linked_to_evidence
  - Visibility: Restricted documents remain scoped
  - Evidence/audit: Upload, extraction review, versioning, correction, verification, and evidence linking should be auditable
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: The manual documents demo UI and workflow intent; no real file storage or extraction transaction is claimed.

### WS-004. Signal becomes reviewed recommendation candidate

Outcome: Signals become reviewable recommendation candidates without becoming advice.

Why this process exists: A signal, data gap, market prompt, or document expiry can be mistaken for advice if review boundaries are not explicit.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-004-signal-becomes-reviewed-recommendation-candidate.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-004-signal-becomes-reviewed-recommendation-candidate-annotated.png`

Callouts:

- 1. Trigger and source context: Signal enters queue
  - Why: This anchors signal becomes reviewed recommendation candidate in the source context instead of treating the screen as an isolated page.
  - State: WorkflowStatus: new -> analyst_review
  - Visibility: Signal and draft remain internal
  - Evidence/audit: Routing, request-data, and recommendation-prep actions should create traceable events
  - Next role sees: Analyst receives a scoped view of the workflow context.
- 2. Review or gate action: Analyst classifies and routes
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: analyst_review -> awaiting_info or advisor_review
  - Visibility: Advisor sees review context
  - Evidence/audit: Review action becomes part of the workflow history when applicable.
  - Next role sees: Advisor can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Advisor receives a prepared candidate package
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: awaiting_info or advisor_review -> RecommendationStatus: advisor_pending
  - Visibility: Client sees nothing advice-like yet
  - Evidence/audit: Routing, request-data, and recommendation-prep actions should create traceable events
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: The J01 subset has demo-executable workflow actions; broad signal governance remains partial.

### WS-005. Advisor-approved package becomes compliance-controlled client visibility

Outcome: Advisor-approved work becomes client-visible only after compliance release.

Why this process exists: Advisor approval can feel final, but in a regulated wealth workflow it cannot be the same as client release.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-005-advisor-approved-package-becomes-compliance-controlled-client-visibility.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-005-advisor-approved-package-becomes-compliance-controlled-client-visibility-annotated.png`

Callouts:

- 1. Trigger and source context: Advisor records rationale
  - Why: This anchors advisor-approved package becomes compliance-controlled client visibility in the source context instead of treating the screen as an isolated page.
  - State: RecommendationStatus: advisor_pending -> advisor_approved
  - Visibility: Advisor approval remains internal
  - Evidence/audit: Advisor approval, compliance release, block, and evidence request should all create audit lineage
  - Next role sees: Compliance Officer receives a scoped view of the workflow context.
- 2. Review or gate action: Compliance checks classification/evidence/permissions
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: advisor_approved -> compliance_pending
  - Visibility: Compliance sees release controls
  - Evidence/audit: Review action becomes part of the workflow history when applicable.
  - Next role sees: Principal can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Client visibility is released or blocked with reason
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: compliance_pending -> released_to_client or blocked
  - Visibility: Client visibility begins only after release and permission check
  - Evidence/audit: Advisor approval, compliance release, block, and evidence request should all create audit lineage
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: Release/block states are visible; broad release persistence remains a top implementation gap.

### WS-006. Client decision becomes evidence and review cadence

Outcome: Client decisions become evidence and future review cadence.

Why this process exists: A client decision can disappear into email, meeting notes, or memory unless the decision, participants, rationale, and review date are captured together.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-006-client-decision-becomes-evidence-and-review-cadence.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-006-client-decision-becomes-evidence-and-review-cadence-annotated.png`

Callouts:

- 1. Trigger and source context: Compliance releases safe decision
  - Why: This anchors client decision becomes evidence and review cadence in the source context instead of treating the screen as an isolated page.
  - State: DecisionStatus: released_to_client -> awaiting_family_approval
  - Visibility: Client sees released decision only
  - Evidence/audit: Decision action, reason, participant action, and evidence package should be immutable/audited
  - Next role sees: Principal receives a scoped view of the workflow context.
- 2. Review or gate action: Client-side participant acts
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: awaiting_family_approval -> accepted/deferred/rejected
  - Visibility: Advisor/compliance see outcome and evidence lineage
  - Evidence/audit: Review action becomes part of the workflow history when applicable.
  - Next role sees: Trustee scoped can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Review cadence schedules follow-up
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: evidence_created -> review_scheduled
  - Visibility: Restricted internal notes remain hidden
  - Evidence/audit: Decision action, reason, participant action, and evidence package should be immutable/audited
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: Decision surfaces are navigable; final decision/evidence package persistence remains incomplete.

### WS-007. Governance change becomes permission-safe access

Outcome: Access changes become governed permission state.

Why this process exists: Family offices frequently need to adjust access, but access changes can silently overexpose sensitive client data.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-007-governance-change-becomes-permission-safe-access.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-007-governance-change-becomes-permission-safe-access-annotated.png`

Callouts:

- 1. Trigger and source context: Principal/Admin requests access
  - Why: This anchors governance change becomes permission-safe access in the source context instead of treating the screen as an isolated page.
  - State: WorkflowStatus: new/requested -> in_review
  - Visibility: Requester sees request state
  - Evidence/audit: Sensitive role/access actions require second confirmation and audit
  - Next role sees: Admin receives a scoped view of the workflow context.
- 2. Review or gate action: Compliance reviews purpose/scope
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: in_review -> approved or blocked or revoked
  - Visibility: Reviewer sees sensitivity and scope
  - Evidence/audit: Review action becomes part of the workflow history when applicable.
  - Next role sees: Security can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Audit history records lineage
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: in_review -> approved or blocked or revoked
  - Visibility: Target user sees only approved role scope
  - Evidence/audit: Sensitive role/access actions require second confirmation and audit
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: Demo actions are visible; governed access transactions remain incomplete.

### WS-008. Communication escalation becomes recorded service context

Outcome: Communication escalation becomes recorded service context.

Why this process exists: Complex advisory work often shifts between digital messages, calls, workshops, and specialists without preserving why the channel changed.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-008-communication-escalation-becomes-recorded-service-context.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-008-communication-escalation-becomes-recorded-service-context-annotated.png`

Callouts:

- 1. Trigger and source context: Advisor/Client Success selects channel
  - Why: This anchors communication escalation becomes recorded service context in the source context instead of treating the screen as an isolated page.
  - State: WorkflowStatus: draft -> sent or scheduled
  - Visibility: Client-visible messages are separated from internal notes
  - Evidence/audit: Sensitive communication should audit; material calls can link to evidence
  - Next role sees: Client Success receives a scoped view of the workflow context.
- 2. Review or gate action: Client responds or joins call
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: sent or scheduled -> awaiting_reply
  - Visibility: Material outcomes can become evidence-linked
  - Evidence/audit: Review action becomes part of the workflow history when applicable.
  - Next role sees: External Specialist can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Compliance controls advice-like messages when needed
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: awaiting_reply -> completed or escalated
  - Visibility: Advice-like content remains release-controlled
  - Evidence/audit: Sensitive communication should audit; material calls can link to evidence
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: Communication surfaces are mostly static; message and call persistence is not claimed.

### WS-009. Export request becomes redacted, approved, auditable package

Outcome: Export requests become redacted, approved, auditable packages.

Why this process exists: Exporting data can break the system's visibility controls if scope, redaction, approval, expiry, and audit are not explicit.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-009-export-request-becomes-redacted-approved-auditable-package.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-009-export-request-becomes-redacted-approved-auditable-package-annotated.png`

Callouts:

- 1. Trigger and source context: Requester chooses scope
  - Why: This anchors export request becomes redacted, approved, auditable package in the source context instead of treating the screen as an isolated page.
  - State: ExportStatus: draft -> scope_selected
  - Visibility: Internal evidence may become redacted package
  - Evidence/audit: Export create, scope, redaction, approval, generation, download, and share should audit
  - Next role sees: Compliance receives a scoped view of the workflow context.
- 2. Review or gate action: Privacy/Compliance reviews redaction and approval
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: scope_selected -> redaction_pending
  - Visibility: External sharing has expiry and classification
  - Evidence/audit: Review action becomes part of the workflow history when applicable.
  - Next role sees: Client can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Audit captures export lifecycle
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: generated -> downloaded or expired
  - Visibility: Restricted material remains excluded
  - Evidence/audit: Export create, scope, redaction, approval, generation, download, and share should audit
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: Export UI is navigable; file/share realism is a Phase 18 gap.

### WS-010. Ops monitoring turns workflow friction into service and product improvement

Outcome: Operational friction becomes service and product improvement evidence.

Why this process exists: Workflow friction often remains anecdotal: someone knows a queue is slow, but the system does not show where or why.

Process graphic: `docs/v3/user-manual-visual-process/process-graphics/ws-010-ops-monitoring-turns-workflow-friction-into-service-and-product-improvement.svg`

Annotated screenshot: `docs/v3/user-manual-visual-process/annotated-screenshots/ws-010-ops-monitoring-turns-workflow-friction-into-service-and-product-improvement-annotated.png`

Callouts:

- 1. Trigger and source context: Ops monitors queues
  - Why: This anchors ops monitoring turns workflow friction into service and product improvement in the source context instead of treating the screen as an isolated page.
  - State: WorkflowStatus: open -> in_review
  - Visibility: Operational pages remain internal
  - Evidence/audit: Ops mutations should audit when implemented and service-affecting
  - Next role sees: Product receives a scoped view of the workflow context.
- 2. Review or gate action: QA validates coverage and state language
  - Why: This is where the workflow becomes controlled work rather than raw information.
  - State: in_review -> blocked
  - Visibility: Workflow health informs product/service decisions
  - Evidence/audit: Review action becomes part of the workflow history when applicable.
  - Next role sees: Leads can act only after the relevant review or gate is satisfied.
- 3. Outcome, visibility, or evidence result: Leads prioritize next workflow improvement
  - Why: This shows what the workflow makes possible next and which boundary has changed.
  - State: deferred -> completed
  - Visibility: Client-facing promises are not inflated by reference pages
  - Evidence/audit: Ops mutations should audit when implemented and service-affecting
  - Next role sees: The next role sees the resulting state, not the entire internal preparation history.

Demo boundary: Queue/SLA mutation is not fully implemented; reference pages are internal only.


## Rejected Weak Approaches

- Table-led manual.
- Screenshot-only manual.
- Route-led manual.
- Generic diagram-only manual.
- Dense visibility matrix as the main explanation.
- Unannotated screenshot evidence.
- Decorative process graphics that do not map to UI evidence.
