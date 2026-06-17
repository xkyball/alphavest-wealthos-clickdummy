# AlphaVest WealthOS — Pageflow, User Workflow and Mapping V3

Date: 2026-06-14

## 1. Definitions

### Pageflow Stream

A **pageflow** is the route/screen sequence through the web application. It answers:

- Where does a user go?
- Which page comes next?
- Which screen state appears?
- Which UI objects are involved?

### User Workflow Stream

A **user workflow** is the role/action/state sequence. It answers:

- Who performs the task?
- What data is entered or reviewed?
- Which approval or review happens?
- Which evidence or audit event is created?

### Relationship between both

A user workflow can span multiple pageflows. A pageflow can support several user workflows. The implementation must therefore tag every route with:

```text
pageflowId
userWorkflowId
actorRole
objectType
objectId
permissionAction
stateBefore
stateAfter
evidenceCreated
auditEvent
```

## 2. Pageflow streams

| ID | Name | Route sequence | Primary roles | Purpose |
| --- | --- | --- | --- | --- |
| PF-A | Platform Setup | /admin/platform → /admin/policies/advice-boundary → /admin/roles → /admin/security → /admin/evidence-templates → /admin/export-templates | Platform Admin, Compliance, Security | Sets platform-wide policies, roles, evidence and export defaults. |
| PF-B | Client Tenant Setup | /admin/tenants → /tenants/new → /tenants/:id/setup → /tenants/:id/team → /tenants/:id/policies → /tenants/:id/users → /onboarding/invite | Ops Admin, Client Success, Compliance | Creates client tenant, assigns team, applies policies and invites Principal. |
| PF-C | Client Profile and Structure Intake | /portal → /client/profile → /client/family-members → /relationships → /entities → /entities/new → /entities/:id → /wealth-map | Principal, Family CFO, Analyst, Advisor | Captures family, relationships, entities, assets and initial structure map. |
| PF-D | Document Intake | /documents/upload → /documents/extraction-review → /documents/verification-pending → /workbench/documents/:id/review → /documents/:id → /evidence | Client, CFO, Analyst, Compliance if sensitive | Uploads, extracts, validates and links documents to evidence. |
| PF-E | Trigger to Recommendation | /signals → /workbench/triggers/:id → /workbench/evidence-builder → /advisor-approval/:id → /compliance/:id/review | System, Analyst, Advisor, Compliance | Turns signal into human-reviewed, gated recommendation workflow. |
| PF-F | Compliance Release to Client Decision | /compliance/:id/release or /compliance/:id/block → /decisions → /decisions/:id → /decisions/:id/success → /evidence/:id | Compliance, Principal, Family Council | Releases approved content, captures decision and evidence. |
| PF-G | Governance and Access | /governance/users → /governance/roles → /governance/access-requests → /governance/audit-history | Principal, Admin, Compliance, Security | Manages roles, permissions, second confirmations and audit history. |
| PF-H | Communication and Escalation | /communication → /communication/call-trigger → /communication message/call records → /evidence | Advisor, Client Success, Client | Routes digital vs call vs F2F vs external specialist and records outcomes. |
| PF-I | Export and Reporting | /export/new → /export/:id/scope → /export/:id/redaction → /export/:id/preview → /export/:id/download → /export/:id/audit | Principal, Advisor, Compliance, Privacy Officer | Creates redacted, role-safe, audited exports. |
| PF-J | Operations and Monitoring | /ops/queues → /ops/sla → /service-blueprint → /roadmap → /states | Ops, Product, QA, Leads | Monitors capacity, SLA, product scope and workflow consistency. |

## 3. User workflow streams

| ID | Name | Actor(s) | Purpose / task | Primary pageflow |
| --- | --- | --- | --- | --- |
| UF-01 | Platform policy setup | Platform Admin + Compliance + Security | Configure platform, policies, evidence templates, export defaults | PF-A |
| UF-02 | Tenant onboarding | Ops Admin + Client Success + Compliance | Create tenant, assign team, policies, invite Principal | PF-B |
| UF-03 | User onboarding and consent | Invited user + System | Accept invitation, set identity/MFA, consent, role confirmation | PF-B |
| UF-04 | Family profile intake | Principal / Family CFO + Analyst | Enter family members, relationships, governance preferences | PF-C |
| UF-05 | Entity and asset intake | Principal / CFO / Analyst / Advisor | Create entities and assets, link relationships/docs | PF-C |
| UF-06 | Document upload and verification | Client / CFO / External Advisor + Analyst | Upload, extraction review, analyst validation, evidence linking | PF-D |
| UF-07 | Signal review and routing | System + Analyst | Review signal, classify trigger, request data or route to advisor | PF-E |
| UF-08 | Advisor approval | Senior Wealth Advisor | Approve, revise, request data or escalate to call | PF-E |
| UF-09 | Compliance release/block | Compliance Officer | Classify, check evidence/ROA/permissions, release or block | PF-F |
| UF-10 | Client decision | Principal / Family Council / Trustee scoped | Review released decision, accept/defer/reject | PF-F |
| UF-11 | Evidence review and export | Client / Advisor / Compliance / Privacy | Review evidence, export packages with redaction | PF-I |
| UF-12 | Governance access change | Principal / Admin / Compliance | Assign/revoke role, approve access, second confirmation | PF-G |
| UF-13 | Communication escalation | Advisor / Client Success / Client | Choose digital, request data, call, F2F or external specialist | PF-H |
| UF-14 | Ops monitoring and QA | Ops / Product / QA | Monitor queues, SLAs, workflow quality and roadmap scope | PF-J |

## 4. User workflow to pageflow mapping

| User workflow | Pageflow | Pages | How they connect |
| --- | --- | --- | --- |
| UF-01 | PF-A | /admin/platform, /admin/policies/advice-boundary, /admin/roles | Platform configuration must exist before tenant setup. |
| UF-02 | PF-B | /tenants/new, /tenants/:id/setup, /tenants/:id/team | Tenant must be configured before client onboarding. |
| UF-03 | PF-B | /onboarding/invite, /onboarding/identity, /onboarding/mfa, /onboarding/consent | User becomes active only after identity, MFA if required and consent. |
| UF-04 | PF-C | /client/profile, /client/family-members, /relationships | Profile and family relationships create context for permissions and decisions. |
| UF-05 | PF-C | /entities, /entities/new, /entities/:id, /wealth-map | Entity/asset data becomes graph nodes and structure gaps. |
| UF-06 | PF-D | /documents/upload, /documents/extraction-review, /documents/verification-pending, /workbench | Documents move from client upload to analyst validation and evidence. |
| UF-07 | PF-E | /signals, /workbench/triggers/:id | Trigger remains internal until review; not final advice. |
| UF-08 | PF-E | /advisor-approval/:id | Advisor approval is human review but not client release. |
| UF-09 | PF-F | /compliance/:id/review, /compliance/:id/release, /compliance/:id/block | Compliance release determines client visibility. |
| UF-10 | PF-F | /decisions, /decisions/:id, /decisions/:id/success | Client decision creates decision record and evidence package. |
| UF-11 | PF-I | /evidence, /evidence/:id, /export/* | Evidence and exports are permission- and redaction-controlled. |
| UF-12 | PF-G | /governance/users, /governance/roles, /governance/access-requests | Access changes require policy checks, second confirmation and audit. |
| UF-13 | PF-H | /communication, /communication/call-trigger | Communication path selected by complexity, risk and compliance sensitivity. |
| UF-14 | PF-J | /ops/queues, /ops/sla, /service-blueprint, /roadmap, /states | Ops monitors implementation and service health. |

## 5. Detailed flow streams

### PF-A — Platform setup

```text
/admin/platform
→ /admin/policies/advice-boundary
→ /admin/roles
→ /admin/security
→ /admin/evidence-templates
→ /admin/export-templates
```

Data entered:
- platform settings,
- advice boundary classes,
- role templates,
- MFA/security defaults,
- evidence requirements,
- export/redaction rules.

Approval:
- Compliance approves advice boundary and evidence policies.
- Security approves MFA/session/export controls.
- Every change emits an AuditEvent.

### PF-B — Tenant onboarding

```text
/admin/tenants
→ /tenants/new
→ /tenants/:id/setup
→ /tenants/:id/team
→ /tenants/:id/policies
→ /tenants/:id/users
→ /onboarding/invite
→ /onboarding/identity
→ /onboarding/mfa
→ /onboarding/consent
→ /onboarding/role-confirmation
```

Data entered:
- family office name,
- jurisdiction,
- service tier,
- AlphaVest team,
- tenant policies,
- Principal invitation,
- consent and role acknowledgement.

Exit gate:
```text
Tenant Active only if:
- Principal accepted invitation
- Privacy notice acknowledged
- Service team assigned
- Compliance owner assigned
- Role template applied
- Audit logging enabled
```

### PF-C — Client profile and wealth structure

```text
/portal
→ /client/profile
→ /client/family-members
→ /relationships
→ /entities
→ /entities/new
→ /entities/:id
→ /wealth-map
```

Backstage:
- Analyst validates data quality.
- Advisor reviews governance significance.
- Legal/specialist review if trust/entity conflict.

### PF-D — Document intake

```text
/documents/upload
→ /documents/extraction-review
→ /documents/verification-pending
→ /workbench/documents/:id/review
→ /documents/:id
→ /evidence
```

State machine:
```text
empty → uploading → uploaded → ai_extracted → client_confirmed
→ analyst_review_pending → verified / needs_clarification / blocked
→ linked_to_evidence
```

### PF-E — Trigger to recommendation

```text
/signals
→ /workbench/triggers/:id
→ /workbench/evidence-builder
→ /advisor-approval/:id
→ /compliance/:id/review
```

Hard rule:
```text
Signal != advice
AI draft != advice
Analyst review != client release
Advisor approval != client release
Compliance release controls client visibility
```

### PF-F — Compliance release to client decision

```text
/compliance/:id/release OR /compliance/:id/block
→ /decisions
→ /decisions/:id
→ /decisions/:id/success
→ /evidence/:packageId
```

Release conditions:
- advisor approval complete,
- compliance checks complete,
- evidence record complete,
- permission valid,
- required disclosure/ROA state satisfied.

### PF-G — Governance and access

```text
/governance/users
→ /governance/roles
→ /governance/access-requests
→ /governance/second-confirmation
→ /governance/audit-history
```

Second confirmation required for:
- release-to-client permission,
- manage-permissions permission,
- external advisor broad access,
- sensitive document access,
- cross-tenant admin action.

### PF-H — Communication and escalation

```text
/communication
→ /communication/call-trigger
→ message/call scheduling
→ communication log
→ evidence link
```

Routing:
```text
digital-only → request data → advisor call → F2F workshop → external specialist
```

### PF-I — Export

```text
/export/new
→ /export/:id/scope
→ /export/:id/redaction
→ /export/:id/preview
→ /export/:id/confirm
→ /export/:id/download
→ /export/:id/audit
```

Export gates:
- actor permission check,
- tenant scope check,
- object scope check,
- sensitivity check,
- redaction profile,
- approval if required,
- watermark/classification,
- audit event.

### PF-J — Ops and management

```text
/ops/queues
→ /ops/sla
→ /service-blueprint
→ /roadmap
→ /states
```

Used for:
- implementation QA,
- service design,
- SLA management,
- training,
- phase planning.
