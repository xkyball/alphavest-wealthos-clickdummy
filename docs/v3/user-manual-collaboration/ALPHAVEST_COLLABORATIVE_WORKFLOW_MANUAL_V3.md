# AlphaVest Collaborative Workflow Manual V3

Generated: 2026-06-17  
Language: English  
Engine mode: ENGINE_MIX_V2_CODEX_V3_PROOF  
Boundary: Manual-content source package only. No application behavior was changed.

## Manual Thesis

AlphaVest WealthOS is a collaborative workflow system for complex family-office and advisory operations. It does not simply store data. It turns fragmented inputs, documents, signals, recommendations, approvals, decisions, communications, and exports into a controlled shared state. Each role sees the right slice of the truth at the right time, and sensitive outcomes only become client-visible after the required human review, evidence, permission, and compliance gates.

## Executive Workflow Orientation

AlphaVest solves a coordination problem before it solves a screen problem. In wealth operations, information arrives as documents, emails, family updates, advisor notes, entity structures, risk signals, decisions, and exceptions. A normal repository can store those fragments, but it does not reliably answer the operational questions that matter:

- who owns the next action,
- what state the object is in,
- which role can see it,
- what remains internal,
- whether evidence is complete,
- whether compliance has released it,
- whether an audit trail exists.

The manual therefore has to teach the workflow system, not only the interface. A user should understand that a button is rarely just a button. It often changes an object state, creates a queue item, exposes a controlled summary to another role, blocks a premature release, or creates evidence/audit lineage.

The product's core move is to turn data chaos into a shared operating picture. Client input, analyst normalization, advisor review, compliance release, client decision, evidence creation, export control, and operational monitoring are not separate manuals. They are one relay.

## Collaboration Model

The collaboration pattern is:

```text
Input -> Normalization -> Review -> Gate -> Visibility -> Decision -> Evidence -> Audit -> Monitoring
```

### Input

Client-side and operations roles introduce raw material: tenant data, profile context, entity structure, document uploads, messages, or requests. The system keeps that material tenant scoped and prevents it from becoming advice or released evidence too early.

### Normalization

Analysts, Client Success, and system-assisted extraction turn raw input into structured work. They identify missing context, low-confidence data, sensitivity, object links, and next action. Normalization is where data chaos starts becoming operational consistency.

### Review

Analysts, advisors, compliance, and privacy reviewers inspect the structured work from their own role lens. Review does not automatically mean release. It means the next role receives enough context to make a legitimate decision.

### Gate

Compliance, security, privacy, and permission controls decide whether work can move across a boundary. The key boundary is client visibility. A blocked state is a protective control, not a generic error.

### Visibility

Visibility changes only when state, permission, evidence, release, and sensitivity all allow it. Internal progress and client-visible release are different states.

### Decision

Client-side roles act only on released, scoped material. Their accept, defer, reject, or participant approval action becomes part of the workflow state.

### Evidence

Evidence records connect decisions, documents, approvals, releases, messages, exports, and audit events. Evidence is not an appendix. It is how the system proves why a workflow was allowed to advance.

### Audit

Audit preserves who acted, under which role, on which object, from which previous state to which next state, with which result. Corrections are new events, not edits.

### Monitoring

Ops, Product, QA, and Leads inspect queues, SLA states, service blueprint gaps, roadmap boundaries, and state-language consistency. This turns workflow friction into service and product improvement.

## Role Relay Model

| Relay | From | To | Object or state | What changes |
| --- | --- | --- | --- | --- |
| RR-001 | Platform Admin | Compliance | Platform policy baseline | Policy settings become reviewable release and evidence rules. |
| RR-002 | Compliance | Security Officer | Sensitive platform controls | Release meaning becomes access/session/confirmation control. |
| RR-003 | Ops Admin | Client Success | ClientTenant onboarding | Tenant moves from shell to coordinated readiness. |
| RR-004 | Client Success | Invited User | Invitation and consent | User moves from invited to role-confirmed demo context. |
| RR-005 | Principal / Family CFO | Analyst | Client profile and family context | Client facts become reviewable tenant context. |
| RR-006 | Analyst | Advisor | Entity, document, signal, or recommendation candidate | Normalized work becomes advisory review material. |
| RR-007 | Client / External Advisor | Analyst | Document upload and extraction | Raw file becomes reviewed source material or blocked work. |
| RR-008 | Advisor | Compliance Officer | Advisor-approved recommendation | Human review becomes compliance-controlled release candidate. |
| RR-009 | Compliance Officer | Principal / Family Council / Trustee scoped | Released client decision | Safe decision becomes scoped client-visible action. |
| RR-010 | Principal / Admin | Compliance / Security | Governance access request | Requested access becomes reviewed permission state. |
| RR-011 | Advisor / Client Success | Client | Communication escalation | Channel choice becomes service context and possible evidence. |
| RR-012 | Advisor / Compliance | Privacy Officer | Export request and redaction | Evidence sharing becomes scoped, redacted, approved export. |
| RR-013 | Ops | Product / QA / Leads | Queue, SLA, roadmap, and state friction | Workflow friction becomes improvement evidence. |

The important manual pattern is the same in every relay:

1. The first role changes an object or state.
2. The next role sees that change in a different UI context.
3. The next role can act only within role, tenant, sensitivity, workflow-state, and permission boundaries.
4. Evidence and audit preserve why the relay was legitimate.

## End-To-End Workflow Stories

### WS-001. Tenant becomes operational

Before AlphaVest, a family-office workspace can become active before ownership, compliance, policy, and invitation context are aligned.

The relay starts with the platform policy baseline. Platform Admin establishes the operating rules. Ops Admin creates the tenant shell. Client Success coordinates readiness. Compliance confirms owner and policy gates. The invited user receives only the onboarding context that belongs to that tenant.

The state path is tenant draft to onboarding, user invited to active/demo-confirmed. Internal setup is visible to AlphaVest roles; the invited user sees onboarding and consent. Client workspace visibility is not treated as operational until activation gates are satisfied.

Reader takeaway: A tenant is not just a record. It is the scoped collaboration container that makes later visibility and accountability possible.

Demo boundary: The UI is navigable with demo data; broad persisted tenant governance transactions are not fully claimed.

### WS-002. Client profile becomes usable shared family context

Before AlphaVest, family information, relationships, governance roles, and objectives often sit in separate memories, emails, spreadsheets, and documents.

Principal or Family CFO submits profile and relationship context. Analyst validates completeness and flags gaps. Advisor reviews governance significance. The wealth map becomes a shared model, not a decorative screen.

The profile moves from draft/new to review and either awaiting information or complete enough for later work. Client-side input remains tenant-scoped. Analyst sees quality gaps. Advisor sees decision-relevant context after review.

Reader takeaway: The wealth map tells each role what the family structure currently means and where uncertainty remains.

Demo boundary: Profile and relationship screens are navigable with demo data; full persistence is still a stated implementation need.

### WS-003. Document chaos becomes verified evidence

Before AlphaVest, documents arrive from different people, in different formats, with uncertain sensitivity, entity links, and extracted facts.

Client, Family CFO, or External Advisor uploads a source. Extraction drafts structure. Client confirms or corrects. Analyst validates. Evidence receives verified source links.

The state path is empty, uploading, uploaded, ai_extracted, client_confirmed, analyst_review_pending, then verified, needs_clarification, blocked, or linked_to_evidence. Uploader sees upload/confirmation. Analyst sees extraction detail. Compliance sees evidence suitability when relevant.

Reader takeaway: A document becomes useful only when it is classified, checked, linked, and made available at the correct visibility level.

Demo boundary: The manual documents demo UI and workflow intent; no real file storage or extraction transaction is claimed.

### WS-004. Signal becomes reviewed recommendation candidate

Before AlphaVest, a signal, data gap, market prompt, or document expiry can be mistaken for advice if review boundaries are not explicit.

A signal enters the internal queue. Analyst classifies and routes it. Advisor receives a prepared candidate package. Client sees nothing advice-like yet.

The state path moves from new to analyst_review to awaiting_info or advisor_review. A recommendation candidate may reach advisor_pending, but still remains internal.

Reader takeaway: The system keeps signals useful without letting them masquerade as advice.

Demo boundary: The J01 subset is on the canonical typed boundary (legacy compatibility bridge); full signal governance remains the typed boundary implementation gap.

### WS-005. Advisor-approved package becomes compliance-controlled client visibility

Before AlphaVest, advisor approval can feel final. In this workflow it is not final.

Advisor records rationale. Compliance checks classification, evidence completeness, permissions, and release controls. Compliance then releases, blocks, or requests evidence. Client visibility begins only after release and permission checks.

The state path is advisor_pending, advisor_approved, compliance_pending, released_to_client or blocked. Advisor approval is internal human review. Compliance release is the decisive client-visibility gate.

Reader takeaway: Client visibility is a controlled outcome, not a side effect of internal approval.

Demo boundary: Release/block states are visible; broad release persistence remains a top implementation gap.

### WS-006. Client decision becomes evidence and review cadence

Before AlphaVest, a client decision can disappear into email, meeting notes, or memory.

Compliance releases a safe decision. Principal, Family Council, or trustee-scoped participant acts. Evidence captures the decision outcome. Review cadence schedules follow-up.

The state path is released_to_client, awaiting_family_approval, accepted/deferred/rejected, evidence_created, review_scheduled. Client-side participants see only released decision context. Advisor and compliance see outcome and evidence lineage.

Reader takeaway: The client decision is not the end of the workflow; it becomes the start of evidence and future review discipline.

Demo boundary: Decision surfaces are navigable; final decision/evidence package persistence remains incomplete.

### WS-007. Governance change becomes permission-safe access

Before AlphaVest, access changes can silently overexpose sensitive client data.

Principal or Admin requests access. Compliance reviews purpose and scope. Security confirms sensitive changes. Audit history records lineage.

The state path is requested, in_review, approved, blocked, or revoked. The target user receives only the approved role scope.

Reader takeaway: Access is not a user setting. It is a governed collaboration boundary.

Demo boundary: Demo actions are visible; governed access transactions remain incomplete.

### WS-008. Communication escalation becomes recorded service context

Before AlphaVest, complex advisory work moves between digital messages, calls, workshops, and specialists without preserving why the channel changed.

Advisor or Client Success selects the channel. Client responds or joins a call. Material outcome links to evidence. Compliance controls advice-like messages when needed.

The state path is draft, sent or scheduled, awaiting_reply, completed or escalated. Client-visible messages are separated from internal notes.

Reader takeaway: Communication is part of the workflow state, not a side channel outside the system.

Demo boundary: Communication surfaces are mostly static; message and call persistence is not claimed.

### WS-009. Export request becomes redacted, approved, auditable package

Before AlphaVest, exporting data can break visibility controls.

Requester chooses scope. Privacy and compliance review redaction and approval. The package becomes downloadable only when allowed. Audit captures the lifecycle.

The state path is draft, scope_selected, redaction_pending, approval_required, approved, generated, downloaded or expired. External sharing has expiry and classification.

Reader takeaway: An export is a controlled visibility event, not a simple download.

Demo boundary: Export UI is navigable; file/share realism is a Phase 18 gap.

### WS-010. Ops monitoring turns workflow friction into service and product improvement

Before AlphaVest, workflow friction remains anecdotal.

Ops monitors queues. QA validates coverage and state language. Product identifies roadmap or implementation gaps. Leads prioritize improvement.

The state path is open, in_review, blocked, deferred, completed. Operational pages remain internal and improve future consistency.

Reader takeaway: AlphaVest uses operations feedback to keep the workflow model honest.

Demo boundary: Queue/SLA mutation is not fully implemented; reference pages are internal only.

## Cross-Role Visibility Matrix

The matrix lives in the structured JSON as `visibilityMatrix`. It should be rendered in the future PDF as a supporting artifact, not as the main manual spine. It covers tenant, profile, entity, document, extraction, trigger, recommendation, approval, compliance review, decision, evidence record, export request, message thread, access request, queue item, and data quality issue across Platform Admin, Ops Admin, Client Success, Principal, Family CFO, Analyst, Advisor, Compliance, Privacy Officer, Security, External Advisor, and Product / QA.

## State Transition Atlas

The structured atlas covers:

- TenantStatus,
- DocumentStatus,
- WorkflowStatus,
- RecommendationStatus,
- ComplianceStatus,
- DecisionStatus,
- EvidenceStatus,
- ExportStatus.

The future PDF should use this atlas to explain what a state means, who can move it forward, what other roles see, whether evidence/audit is created, and whether client visibility changes.

## Screen Usage As Evidence

Screenshots should not define the manual structure. They should prove role viewpoints:

- Tenant setup story: policy, tenant, invitation screenshots.
- Client context story: portal, profile, entity, wealth structure screenshots.
- Document evidence story: document and evidence screenshots.
- Signal/advisor/compliance story: signal, advisor queue, compliance queue screenshots.
- Decision story: decision and evidence screenshots.
- Governance story: governance users and audit history screenshots.
- Communication story: communication centre and call trigger screenshots.
- Export story: evidence/export surfaces.
- Ops story: ops queues and state/reference surfaces.

## Diagram Specifications

The JSON includes six diagram specs:

1. Global workflow lifecycle.
2. Trigger to client decision swimlane.
3. Document intake handoff.
4. Tenant onboarding relay.
5. Evidence and audit lineage.
6. Visibility gate.

The future PDF should render these as diagrams before long tables. The diagrams should teach the collaboration model first, then use screenshots and fields as supporting evidence.

## PDF Table Of Contents Recommendation

1. What AlphaVest Coordinates.
2. The Collaboration Model.
3. Roles and Relays.
4. Workflow Stories.
5. Visibility and Client Release.
6. Evidence, Audit, and Blocked States.
7. State Transition Atlas.
8. Screen Evidence Appendix.
9. Demo Boundary and Implementation Limits.
10. Future PDF Production Notes.

## Method Artifacts

### V3 Mission Card

Produce a collaboration-centered manual source package that explains workflow handoffs, state changes, and visibility gates.

### V3 Evidence Intake

Evidence used:

- `AGENTS.md` product rules.
- `PAGEFLOW_USERFLOW_MAPPING_V3.md` pageflow and user workflow definitions.
- `DATA_MODEL_V3.md` states, relationships, no-unapproved-advice gate, evidence and audit rules.
- Manual source JSON with tasks, roles, fields, screenshots, and contextual narrative.

### V3 Problem Architecture

The existing manual overweights pages, screenshots, and tables. The real product value is the controlled relay between roles and states. The manual must therefore use workflow stories as the main structure and move fields/screenshots into evidence roles.

### V2 Psycho-Logic + Map/Model

Users do not only need to know which UI element exists. They need confidence that the system knows who should act next, what is safe to show, what remains blocked, and why no one can accidentally release advice-like material too early. A page is a map. The workflow state is the territory the user must learn.

### V2 Reframing Matrix

| Old frame | New frame |
| --- | --- |
| Page manual | Workflow manual |
| Individual task manual | Collaboration manual |
| Screenshot proof | Role viewpoint evidence |
| Field table | State and visibility contract |

### V2 TRIZ

Contradiction: the manual must preserve detail without burying the collaboration logic. Resolution: make workflow stories the first-order structure and place fields, screenshots, and state tables as supporting proof.

### V2 SIT Closed World

The manual uses only existing routes, roles, workflows, states, screenshot references, data model objects, and source JSON. No new product behavior is invented.

### V2 Morphological Analysis

The selected structure combines:

- chapter type: thesis, relay, story, atlas, appendix,
- diagram type: lifecycle, swimlane, state, lineage, gate,
- role view: client, analyst, advisor, compliance, ops,
- state view: object lifecycle, visibility, evidence, audit,
- screenshot usage: viewpoint proof, not navigation order.

### V2 SCAMPER

- Substitute route order with workflow stories.
- Combine screenshots with role relays.
- Adapt state-machine language for users.
- Modify tables into a visibility matrix.
- Put screenshots to use as evidence.
- Eliminate page-led structure.
- Reverse from UI-first to collaboration-first.

### V2 Harvard / BATNA

Objective criteria for a good manual:

- source-grounded,
- role-aware,
- workflow-state-aware,
- visibility-aware,
- evidence/audit-aware,
- honest about demo boundaries.

BATNA: if a workflow cannot be proven from source, mark it as a demo boundary or implementation gap rather than writing it as finished behavior.

### V2 MESOs

Three equal-value future PDF structures:

1. Story-first PDF: strongest for executive and user comprehension.
2. Role-first PDF: strongest for training by user persona.
3. State-machine-first PDF: strongest for QA, implementation, and compliance review.

Recommended blend: Story-first as the main body, with role and state appendices.

### V2 Measurement Plan

Test whether a reader can answer:

1. After advisor approval, who must act before client visibility?
2. What does the client see before compliance release?
3. Which evidence or audit item should exist after a client decision?
4. What does an analyst see that the client should not see?
5. Why is a blocked state a protective workflow control?

### Ethics And Fairness

This package does not claim production persistence where the source only proves demo UI. It does not weaken release, evidence, audit, permission, redaction, role, tenant, or client-visibility constraints. It does not hide known implementation limits.

## Limitations

- This package is not the final PDF.
- Some workflows are navigable demo UI but not fully persisted transactions.
- Screenshots prove representative UI states, not complete backend behavior.
- The next step should be a PDF production prompt that renders this workflow-first structure with diagrams, role relays, and story-led pages.
