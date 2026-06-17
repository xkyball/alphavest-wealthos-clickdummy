# Input Mask And Data Maintenance Requirements V3

Date: 2026-06-17

Purpose: define the input masks needed to turn the current AlphaVest clickdummy into a truthful operational demo. These masks should initialize from seed data, accept user edits, validate payloads, persist through Prisma services, create audit/evidence where appropriate, and reload from the database.

## Priority 0 Masks

| Mask | Core Fields | Target Models | Required Behavior |
|---|---|---|---|
| Document upload | file, document type, client/family/entity link, source, period start/end, confidentiality, notes | `Document`, `DocumentVersion`, file metadata/extraction/evidence/audit models | Drag/drop and file picker, multipart upload, type/size validation, stored object, extraction job state, audit event |
| Extraction review | extracted field name/value, corrected value, confidence, reviewer note, finalize checkbox | extraction field/review models, `EvidenceRecord`, `AuditEvent` | Editable corrections, field-level validation, finalize/reopen, evidence creation |
| Client profile | name, DOB, residency, tax residency, risk profile, mandate, advisor, relationship manager, review status | `Client`, related profile/review models | Save draft, submit for review, validation, reload from DB |
| Family member | name, role, DOB, residency, contact preferences, relationship to client, authority flags | family/relationship models | Add/edit/remove member, relationship graph checks, audit on sensitive changes |
| Entity | entity name/type, jurisdiction, registration id, beneficial owners, controlling persons, review status | entity/ownership models | Create/edit entity, ownership validation, readiness checklist |
| Asset | asset type, owner, custodian, valuation, currency, valuation date, source, linked documents | asset/document/link models | Asset CRUD, required evidence links, data quality warnings |
| Tenant setup | tenant name, region, legal entity, enabled modules, review policy, compliance owner | tenant/policy/team models | Persist setup, block activation until required fields/team complete |
| Team assignment | user, role, tenant, access scope, start/end, approval note | user/role/permission/access models | Role validation, permission preview, audit event |
| Governance confirmation | action type, confirmation phrase, approver, reason, affected role/scope | second confirmation/access/audit models | Non-read-only phrase input, exact phrase validation, denied attempts audited |
| Export request | export type, scope, redaction level, recipients, reason, approval reference | export/evidence/audit models | Validate scope, require approvals, generate binary package and manifest |

## Priority 1 Masks

| Mask | Core Fields | Target Models | Required Behavior |
|---|---|---|---|
| Recommendation review | recommendation id, decision, rationale, required evidence, notes | recommendation/approval/compliance/evidence models | Advisor approval or escalation with typed note and audit trail |
| Compliance release/block | release decision, checklist, policy version, conditions, client-visible flag | compliance release/policy/audit models | Enforce no-release gates, persist rationale |
| Client decision | accepted/deferred/rejected, client note, family approvals, requested follow-up | client decision/communication/evidence models | Only available after release, creates audit/evidence |
| Communication message | channel, recipients, subject, body, template, linked recommendation/evidence | communication/audit/evidence models | Draft/send, status tracking, audit event |
| Call record | participants, date/time, topic, notes, outcome, follow-up owner/date | call/communication/review models | Create call note, link to workflow, trigger follow-ups |
| Access request | requester, requested role/scope, reason, expiry, approver decision | access request/role/audit models | Approve/deny/escalate with permission checks |
| Data quality issue | affected object, issue type, severity, owner, due date, resolution | data quality/workflow/audit models | Queue handling, assignment, closure evidence |

## Implementation Rules

1. Use real form controls for fields that imply editability.
2. Avoid hidden fixture-only mutations for primary actions; accept typed payloads.
3. Keep seeded demo data as initial values, not as the only possible values.
4. Centralize validation in domain service modules, not screen components.
5. Route all sensitive saves through permission checks and audit events.
6. Add tests that prove data survives reload from the database.
7. Keep demo identity explicit until real auth is intentionally introduced.

## Suggested Service Boundaries

| Service | Responsibilities |
|---|---|
| `document-upload-service` | Multipart validation, storage adapter calls, document/version/extraction/audit creation |
| `client-profile-service` | Client/family/entity/asset payload validation and persistence |
| `tenant-admin-service` | Tenant setup, team assignment, invitations, activation checks |
| `governance-service` | Role changes, access requests, second confirmation validation |
| `communication-service` | Message drafts, sent status, call notes, follow-ups |
| `export-package-service` | Export job, manifest, binary artifact, download authorization |
| `workflow-review-service` | Recommendation/advisor/compliance/client decision transitions |

## Minimum Acceptance Tests

- Uploading a small PDF through multipart creates stored bytes, document/version rows, extraction job state, audit event, and visible row after reload.
- Rejected upload types create no document row and return a clear validation error.
- Editing client profile and family data persists after page reload.
- Tenant activation is blocked until setup/team/policy prerequisites pass.
- Governance role change requires valid confirmation phrase and audited approval.
- Export package sets `realBinaryGenerated: true` and downloads a real artifact.
- Communication send creates a persisted message with status and linked audit event.

