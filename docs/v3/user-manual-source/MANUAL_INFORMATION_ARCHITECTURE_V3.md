# Manual Information Architecture V3

Generated: 2026-06-16T23:25:11.459Z

## Principle

The future manual should be organized by user goals and roles, not by paths. Routes and code files remain evidence metadata.

## Proposed manual sections

| Section ID | Section | Primary audience | Purpose | Source tasks |
| --- | --- | --- | --- | --- |
| SEC-01 | Getting started with demo session | All roles | Explain role/tenant context and demo-only boundaries. | MT-003 plus all tasks |
| SEC-02 | Platform and policy setup | Platform Admin, Compliance, Security | Configure policy, roles, evidence, export and security baselines. | MT-001 |
| SEC-03 | Tenant onboarding | Admin, Client Success, Compliance | Create tenant, assign team/policies and invite principal. | MT-002 |
| SEC-04 | Client onboarding and profile | Invited User, Principal, Family CFO | Accept invitation and submit family/profile data. | MT-003, MT-004 |
| SEC-05 | Structure, documents and evidence intake | Principal, Family CFO, Analyst, External Advisor | Enter entities, upload documents and handle review states. | MT-005, MT-006 |
| SEC-06 | Internal advisory review | Analyst, Senior Wealth Advisor | Process signals and advisor approval without client visibility. | MT-007, MT-008 |
| SEC-07 | Compliance release and client decisions | Compliance Officer, Principal, Family Council | Release/block advice-like content and record client decisions. | MT-009, MT-010 |
| SEC-08 | Evidence, export and data sharing | Client, Advisor, Compliance, Privacy | Review proof and export only scoped/redacted data. | MT-011 |
| SEC-09 | Governance and access | Principal, Admin, Security, Compliance | Manage users, roles, access requests and audit history. | MT-012 |
| SEC-10 | Communication and escalation | Advisor, Client Success, Client | Choose secure communication, call or escalation path. | MT-013 |
| SEC-11 | Operations and reference | Ops, Product, QA, Leads | Monitor queues/SLA and use reference-only pages. | MT-014 |
| SEC-12 | Field, status and troubleshooting reference | All roles | Explain statuses, blocked states, evidence, audit, export and permissions. | All tasks |

## Pageflow coverage

| Pageflow | Name | Manual section | User-facing framing |
| --- | --- | --- | --- |
| PF-A | Platform Setup | SEC-02 | /admin/platform -> /admin/policies/advice-boundary -> /admin/roles -> /admin/security -> /admin/evidence-templates -> /admin/export-templates |
| PF-B | Client Tenant Setup | SEC-03/SEC-04 | /admin/tenants -> /tenants/new -> /tenants/:id/setup -> /tenants/:id/team -> /tenants/:id/policies -> /tenants/:id/users -> onboarding |
| PF-C | Client Profile and Structure Intake | SEC-04/SEC-05 | /portal -> /client/profile -> /client/family-members -> /relationships -> /entities -> /entities/new -> /entities/:id -> /wealth-map |
| PF-D | Document Intake | SEC-05 | /documents/upload -> /documents/extraction-review -> /documents/verification-pending -> workbench/evidence |
| PF-E | Trigger to Recommendation | SEC-06 | /signals -> /workbench/triggers/:id -> advisor approval -> compliance review |
| PF-F | Compliance Release to Client Decision | SEC-07 | /compliance review/release/block -> /decisions -> /decisions/:id -> success -> evidence |
| PF-G | Governance and Access | SEC-09 | /governance/users -> /governance/roles -> /governance/access-requests -> /governance/audit-history |
| PF-H | Communication and Escalation | SEC-10 | /communication -> /communication/call-trigger -> evidence |
| PF-I | Export and Reporting | SEC-08 | /export/new -> scope -> redaction -> preview -> download -> audit |
| PF-J | Operations and Monitoring | SEC-11 | /ops/queues -> /ops/sla -> /service-blueprint -> /roadmap -> /states |

## Editorial rules for the later polished manual

- Use task titles such as "Upload a document for review", not "Go to /documents/upload".
- Place screenshot references next to the step where they remove confusion.
- Keep route paths in hidden metadata, footnotes, QA tables or source-proof columns.
- Explain blocked states as product controls, not errors.
- Do not claim production authentication, real file storage, full persistence or E6 governance unless later verification proves it.
