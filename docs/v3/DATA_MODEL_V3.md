# AlphaVest WealthOS — Data Model V3

Date: 2026-06-14

## 1. Design principles

The data model is built around:

1. **Multi-tenant isolation:** every client object belongs to a `ClientTenant`; tenant context must be applied to every query.
2. **RBAC + contextual constraints:** role-based permissions are extended by object scope, tenant, sensitivity, workflow state and ownership.
3. **No-unapproved-advice gate:** advice-like outputs require Advisor Approval, Compliance Release, Evidence Record and Permission Check before becoming client-visible.
4. **Evidence-by-default:** important actions create or update Evidence and Audit records.
5. **Privacy minimisation:** only capture data needed for the specific purpose and role.
6. **Append-only audit:** audit events should never be edited; corrections are new events.

## 2. Primitive types

| Type | Meaning |
|---|---|
| UUID | Unique ID, preferably UUID v4 or database-generated CUID/UUID. |
| String(n) | Bounded text field. |
| Text | Longer human text. |
| Email | Validated email string. |
| Date | Calendar date. |
| DateTime | Timestamp with timezone handling. |
| Boolean | True/false. |
| Int | Integer. |
| Decimal(p,s) | Decimal number, e.g. monetary values. |
| Json | Structured JSON; should be schema-validated where possible. |
| Enum | One of a fixed set of values. |
| Relation<T> | Foreign key relation to another model. |

## 3. Enums


### TenantStatus

`draft | onboarding | active | suspended | archived`

### UserStatus

`invited | active | suspended | locked | archived`

### RoleScope

`platform | tenant | entity | engagement | document | decision`

### ObjectType

`platform | tenant | user | role | permission | family_member | relationship | entity | asset | document | trigger | action_item | recommendation | decision | evidence_record | audit_event | export_request | message | review_schedule`

### PermissionAction

`view | create | edit | delete | upload | review | approve | release | block | export | invite | assign | revoke | comment | schedule | escalate | manage`

### Sensitivity

`public | client_visible | confidential | restricted | highly_restricted | internal_only`

### VisibilityStatus

`internal_only | advisor_visible | compliance_visible | client_visible | restricted | redacted`

### WorkflowStatus

`draft | new | in_review | awaiting_info | analyst_review | advisor_review | compliance_pending | ready_for_client | client_visible | completed | deferred | blocked | rejected | archived`

### DocumentStatus

`empty | uploading | uploaded | ai_extracted | client_confirmed | analyst_review_pending | verified | needs_clarification | blocked | linked_to_evidence | archived`

### ReviewStatus

`not_started | pending | in_review | approved | revised | rejected | request_more_data | escalated_to_call | completed`

### ComplianceStatus

`not_required | pending | in_review | released | blocked | needs_evidence | exception | expired`

### AdviceClassification

`information | workflow | guidance | advice_relevant | advice | out_of_scope`

### RecommendationStatus

`draft | ai_draft | analyst_reviewed | advisor_pending | advisor_approved | revision_requested | more_data_requested | compliance_pending | released_to_client | blocked | client_accepted | client_deferred | client_rejected | archived`

### DecisionStatus

`draft | released_to_client | awaiting_family_approval | accepted | deferred | rejected | evidence_created | review_scheduled | archived`

### EvidenceStatus

`placeholder | created | linked | validated | released | restricted | archived | superseded`

### ExportStatus

`draft | scope_selected | redaction_pending | approval_required | approved | generated | downloaded | expired | revoked | failed`

### CommunicationChannel

`secure_message | email | phone | video | in_person | system_notification`

### EscalationType

`none | request_data | advisor_call | f2f_workshop | external_specialist | compliance_escalation | security_privacy_review`

### AuditResult

`success | denied | blocked | failed | pending | warning`

### EntityType

`trust | company | foundation | partnership | individual | family_office | other`

### AssetType

`portfolio | bank_account | real_estate | insurance_policy | business_interest | liquidity | tax_residency | other`

### ExportType

`client_decision_pack | evidence_package | compliance_audit_pack | external_advisor_data_room | tenant_data_inventory | user_access_report | activity_log_export | pilot_metrics_export`

## 4. Entity model and fields

### PlatformTenant

Top-level operator organisation. For this concept, usually AlphaVest WealthOS as platform operator.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| name | String(160) | required | Platform tenant name. |
| legalName | String(220) | optional | Legal name of platform operator. |
| status | TenantStatus | required | Operational status. |
| defaultTimezone | String(64) | required | Default timezone for audit and display. |
| defaultLocale | String(16) | required | Default locale. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### ClientTenant

A family office / household / client group within AlphaVest. All client data belongs to exactly one client tenant.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| platformTenantId | UUID | required | Owning PlatformTenant. |
| displayName | String(180) | required | Client-facing name. |
| legalName | String(220) | optional | Legal or contractual name. |
| status | TenantStatus | required | Draft, onboarding, active, suspended or archived. |
| jurisdiction | String(80) | optional | Primary jurisdiction for tenant setup. |
| relationshipTier | String(80) | optional | Commercial or service tier. |
| primaryAdvisorUserId | UUID | optional | Assigned senior advisor. |
| primaryAnalystUserId | UUID | optional | Assigned analyst. |
| complianceOwnerUserId | UUID | optional | Assigned compliance owner. |
| clientSuccessOwnerUserId | UUID | optional | Assigned client success manager. |
| policyProfileId | UUID | optional | Tenant-specific policy profile. |
| dataRegion | String(80) | optional | Hosting/data residency label. |
| riskRating | String(40) | optional | Internal tenant risk rating. |
| onboardingCompletedAt | DateTime | optional | When tenant onboarding completed. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Engagement

A matter, review, planning project or advisory workflow scoped under a client tenant.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Owning client tenant. |
| name | String(180) | required | Matter / engagement name. |
| type | String(80) | required | Estate review, insurance review, tax residency check, etc. |
| status | WorkflowStatus | required | Engagement lifecycle status. |
| ownerUserId | UUID | required | Primary owner. |
| advisorUserId | UUID | optional | Assigned advisor. |
| analystUserId | UUID | optional | Assigned analyst. |
| complianceUserId | UUID | optional | Assigned compliance officer. |
| startDate | Date | optional | Start date. |
| targetEndDate | Date | optional | Target end date. |
| closedAt | DateTime | optional | Closure timestamp. |
| sensitivity | Sensitivity | required | Matter sensitivity. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### User

Human account. A user may have multiple roles and may be linked to several tenants or object scopes.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| platformTenantId | UUID | required | Platform context. |
| email | Email | required | Unique login email. |
| displayName | String(160) | required | Display name. |
| status | UserStatus | required | Invitation/account state. |
| mfaEnabled | Boolean | required | Whether MFA is active. |
| lastLoginAt | DateTime | optional | Last successful login. |
| preferredLocale | String(16) | optional | Preferred locale. |
| timezone | String(64) | optional | User timezone. |
| isServiceAccount | Boolean | required | Whether non-human/system account. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### UserProfile

Profile data kept separate from identity/account data to support minimisation and privacy reviews.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| userId | UUID | required | Linked user. |
| clientTenantId | UUID | optional | Tenant context when user is client-side. |
| firstName | String(80) | optional | First name. |
| lastName | String(80) | optional | Last name. |
| phone | String(40) | optional | Phone number. |
| relationshipLabel | String(80) | optional | Principal, spouse, trustee, advisor, etc. |
| countryOfResidence | String(80) | optional | Residence country. |
| dateOfBirth | Date | optional | Only if justified by onboarding/KYC scope. |
| sensitivity | Sensitivity | required | Profile sensitivity. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Role

Role template or tenant-specific role. Used by the permission engine and UI.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| platformTenantId | UUID | required | Platform owner. |
| clientTenantId | UUID | optional | Null for global template; set for tenant-specific role. |
| name | String(100) | required | Role name. |
| description | Text | optional | Role description. |
| scope | RoleScope | required | Platform, tenant, entity, engagement, document or decision. |
| isSystemRole | Boolean | required | System-defined role cannot be deleted. |
| requiresSecondConfirmation | Boolean | required | Whether sensitive changes require second confirmation. |
| segregationGroup | String(80) | optional | Separation-of-duties group. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Permission

Atomic permission definition: action on object type with constraints.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| key | String(160) | required | Machine key, e.g. decisions.release. |
| objectType | ObjectType | required | Object category. |
| action | PermissionAction | required | Action allowed or denied. |
| description | Text | optional | Human-readable description. |
| defaultSensitivityLimit | Sensitivity | optional | Maximum sensitivity allowed by default. |
| requiresAudit | Boolean | required | Whether action always writes audit event. |
| requiresSecondConfirmation | Boolean | required | Whether action requires second confirmation. |
| requiresComplianceReview | Boolean | required | Whether action requires compliance review. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### UserRole

Assignment of a user to a role, optionally scoped to tenant/entity/engagement/object.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| userId | UUID | required | User. |
| roleId | UUID | required | Role. |
| clientTenantId | UUID | optional | Tenant scope. |
| entityId | UUID | optional | Entity scope. |
| engagementId | UUID | optional | Engagement scope. |
| objectType | ObjectType | optional | Object scope type. |
| objectId | UUID | optional | Object scope ID. |
| status | String(40) | required | Active, pending, revoked. |
| validFrom | DateTime | optional | Start time. |
| validUntil | DateTime | optional | Expiry time. |
| assignedByUserId | UUID | optional | Who assigned role. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### RolePermission

Assignment of a permission to a role with allow/deny/conditional effect.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| roleId | UUID | required | Role. |
| permissionId | UUID | required | Permission. |
| effect | String(20) | required | allow, deny, conditional. |
| conditionJson | Json | optional | ABAC-light constraints, e.g. ownOnly, entityScope, sensitivity limit. |
| createdAt | DateTime | required | Creation timestamp. |

### AccessRequest

Request for access to restricted object, elevated permission or external advisor scope.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| requesterUserId | UUID | required | Who requested access. |
| targetUserId | UUID | optional | Who access is for. |
| objectType | ObjectType | required | Requested object category. |
| objectId | UUID | required | Requested object. |
| requestedAction | PermissionAction | required | Requested action. |
| reason | Text | required | Business reason. |
| status | WorkflowStatus | required | Requested, under review, approved, blocked, revoked. |
| reviewerUserId | UUID | optional | Human reviewer. |
| complianceRequired | Boolean | required | Whether compliance review is required. |
| decisionAt | DateTime | optional | Decision time. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### SecondConfirmation

Second approval or typed confirmation for sensitive changes.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | optional | Tenant scope. |
| actorUserId | UUID | required | User initiating action. |
| targetObjectType | ObjectType | required | Target object type. |
| targetObjectId | UUID | required | Target object. |
| action | PermissionAction | required | Action requiring confirmation. |
| confirmationPhrase | String(160) | optional | Required phrase, if used. |
| confirmedByUserId | UUID | optional | Second approver. |
| status | String(40) | required | pending, confirmed, expired, rejected. |
| expiresAt | DateTime | optional | Expiry time. |
| createdAt | DateTime | required | Creation timestamp. |
| confirmedAt | DateTime | optional | Confirmation time. |

### ConsentRecord

Consent/privacy/terms acknowledgement record. Needed for POPIA and tenant policy proof.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | optional | Tenant context. |
| userId | UUID | required | User. |
| consentType | String(80) | required | Privacy notice, terms, processing, marketing, document sharing, etc. |
| version | String(40) | required | Policy version. |
| status | String(40) | required | accepted, withdrawn, expired. |
| acceptedAt | DateTime | optional | Accepted timestamp. |
| withdrawnAt | DateTime | optional | Withdrawn timestamp. |
| source | String(80) | optional | Web, mobile, admin. |
| ipAddress | String(64) | optional | IP address at acceptance. |
| createdAt | DateTime | required | Creation timestamp. |

### FamilyMember

A person in the family context. May or may not have a login user account.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| userId | UUID | optional | Linked user account if applicable. |
| displayName | String(160) | required | Name. |
| relationshipType | String(80) | required | Principal, spouse, child, trustee, beneficiary, etc. |
| dateOfBirth | Date | optional | Only if needed. |
| taxResidency | String(80) | optional | Tax residence, if collected. |
| isPrincipal | Boolean | required | Whether family principal. |
| sensitivity | Sensitivity | required | Data sensitivity. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Relationship

Relationship edge between people, entities or roles.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| subjectType | ObjectType | required | Subject object type. |
| subjectId | UUID | required | Subject object. |
| relationshipType | String(80) | required | Spouse, trustee, beneficiary, director, owner, advisor, etc. |
| objectType | ObjectType | required | Object type. |
| objectId | UUID | required | Object. |
| startDate | Date | optional | Start date. |
| endDate | Date | optional | End date. |
| confidence | Decimal(5,2) | optional | Data confidence. |
| sourceDocumentId | UUID | optional | Evidence source. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### ClientObjective

Goal, objective, risk appetite or planning preference used to contextualise decisions.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| ownerFamilyMemberId | UUID | optional | Family member this objective belongs to. |
| category | String(80) | required | Liquidity, succession, preservation, education, philanthropy, tax, mobility. |
| title | String(160) | required | Objective title. |
| description | Text | optional | Details. |
| priority | String(40) | optional | Low, medium, high. |
| timeHorizon | String(80) | optional | Short, medium, long, date range. |
| status | WorkflowStatus | required | Draft, active, under review, archived. |
| sensitivity | Sensitivity | required | Sensitivity. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Entity

Legal/economic structure node: trust, company, partnership, individual entity, foundation.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| entityType | EntityType | required | Type. |
| name | String(180) | required | Entity name. |
| jurisdiction | String(80) | optional | Jurisdiction. |
| registrationNumber | String(120) | optional | Company/trust registration. |
| status | String(40) | required | Active, inactive, draft, dissolved. |
| ownerSummary | Text | optional | Human-readable ownership summary. |
| riskRating | String(40) | optional | Internal risk rating. |
| dataQualityScore | Int | optional | 0-100 score. |
| sensitivity | Sensitivity | required | Sensitivity. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### EntityParticipant

Participant / role relationship within an entity, e.g. trustee, director, beneficiary.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| entityId | UUID | required | Entity. |
| participantType | ObjectType | required | User, family_member, external advisor, entity. |
| participantId | UUID | required | Participant object ID. |
| roleLabel | String(80) | required | Trustee, beneficiary, director, shareholder, grantor, advisor. |
| ownershipPercent | Decimal(6,3) | optional | Ownership or beneficial percentage if applicable. |
| effectiveFrom | Date | optional | Start date. |
| effectiveUntil | Date | optional | End date. |
| sourceDocumentId | UUID | optional | Evidence source. |
| createdAt | DateTime | required | Creation timestamp. |

### Asset

Asset or exposure object linked to entities or family members.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| entityId | UUID | optional | Owning entity. |
| assetType | AssetType | required | Asset category. |
| name | String(180) | required | Asset name. |
| jurisdiction | String(80) | optional | Jurisdiction/location. |
| currency | String(3) | optional | Currency code. |
| valueBand | String(80) | optional | Value band, not exact value if not required. |
| estimatedValue | Decimal(18,2) | optional | Estimated value if collected. |
| valuationDate | Date | optional | Valuation date. |
| riskRating | String(40) | optional | Risk rating. |
| status | String(40) | required | Active, archived, sold, pending. |
| sensitivity | Sensitivity | required | Sensitivity. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Document

Uploaded or generated document record. Actual file storage should be external object storage with secure pointers.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| engagementId | UUID | optional | Matter/engagement. |
| uploadedByUserId | UUID | required | Uploader. |
| documentType | String(100) | required | Trust deed, policy, statement, KYC document, memo, etc. |
| title | String(220) | required | Display title. |
| status | DocumentStatus | required | Lifecycle status. |
| fileName | String(260) | optional | Original file name. |
| mimeType | String(120) | optional | MIME type. |
| fileSizeBytes | Int | optional | File size. |
| storageKey | String(500) | optional | Storage pointer, not public URL. |
| checksum | String(128) | optional | Hash for integrity. |
| source | String(80) | optional | Upload, secure import, generated, external advisor. |
| sensitivity | Sensitivity | required | Sensitivity. |
| clientVisible | Boolean | required | Whether visible to client roles. |
| retentionPolicy | String(120) | optional | Retention rule. |
| expiresAt | Date | optional | Expiry date if relevant. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### DocumentVersion

Version record for document changes or generated outputs.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| documentId | UUID | required | Document. |
| versionNumber | Int | required | Version number. |
| storageKey | String(500) | required | Storage pointer. |
| checksum | String(128) | optional | Integrity hash. |
| createdByUserId | UUID | required | Creator. |
| changeReason | Text | optional | Reason for new version. |
| createdAt | DateTime | required | Creation timestamp. |

### DocumentExtraction

AI/OCR or rules extraction draft from a document.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| documentId | UUID | required | Document. |
| extractionStatus | String(60) | required | pending, completed, failed, low_confidence. |
| confidenceScore | Decimal(5,2) | optional | 0-100 confidence. |
| extractedFieldsJson | Json | optional | Structured extracted fields. |
| lowConfidenceFieldsJson | Json | optional | Fields requiring review. |
| modelVersion | String(80) | optional | Model/rules version. |
| isClientVisible | Boolean | required | Usually false; client sees simplified state only. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### DocumentReview

Human review of a document/extraction.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| documentId | UUID | required | Document. |
| reviewerUserId | UUID | required | Analyst, advisor, compliance or specialist. |
| reviewType | String(80) | required | Analyst validation, legal review, compliance review, specialist review. |
| status | ReviewStatus | required | Review status. |
| notes | Text | optional | Internal review notes. |
| clientVisibleSummary | Text | optional | Summary safe for clients if released. |
| reviewedAt | DateTime | optional | Review completion timestamp. |
| createdAt | DateTime | required | Creation timestamp. |

### DocumentLink

Links documents to entities, assets, decisions, evidence or workflows.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| documentId | UUID | required | Document. |
| targetType | ObjectType | required | Linked target type. |
| targetId | UUID | required | Linked target ID. |
| relationship | String(80) | required | source, support, evidence, attachment, generated_output. |
| createdByUserId | UUID | required | Who linked it. |
| createdAt | DateTime | required | Creation timestamp. |

### Trigger

System, advisor or client-generated review point. Not advice by itself.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| engagementId | UUID | optional | Matter/engagement. |
| source | String(80) | required | Market, document expiry, data gap, client input, advisor input. |
| triggerType | String(100) | required | Liquidity drop, policy expiry, missing doc, market volatility, etc. |
| title | String(180) | required | Display title. |
| description | Text | optional | Internal/context description. |
| severity | String(40) | required | Low, medium, high, critical. |
| confidenceScore | Decimal(5,2) | optional | Confidence score. |
| status | WorkflowStatus | required | Lifecycle status. |
| clientVisible | Boolean | required | False unless neutral review prompt released. |
| createdBy | String(80) | required | System/user/source. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### ActionItem

Task/action card for client or internal user.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| engagementId | UUID | optional | Matter. |
| triggerId | UUID | optional | Originating trigger. |
| title | String(180) | required | Action title. |
| description | Text | optional | Action details. |
| ownerUserId | UUID | optional | Owner. |
| assignedRoleKey | String(120) | optional | Fallback assignment by role. |
| priority | String(40) | required | Low, medium, high, critical. |
| status | WorkflowStatus | required | Action workflow status. |
| dueDate | Date | optional | Due date. |
| clientVisible | Boolean | required | Whether visible to client. |
| evidenceStatus | EvidenceStatus | optional | Evidence link state. |
| blockedReason | Text | optional | Reason if blocked. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Recommendation

Draft or advisor-approved recommendation. Client visibility is controlled separately.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| engagementId | UUID | optional | Matter. |
| triggerId | UUID | optional | Originating trigger. |
| createdByUserId | UUID | optional | Analyst/system/advisor. |
| title | String(200) | required | Recommendation title. |
| summaryInternal | Text | optional | Internal draft content. |
| clientSummaryDraft | Text | optional | Client wording draft, not visible until release. |
| adviceClassification | AdviceClassification | required | Information/workflow/advice-related/advice/out-of-scope. |
| status | RecommendationStatus | required | Lifecycle status. |
| advisorApprovalId | UUID | optional | Advisor approval record. |
| complianceReviewId | UUID | optional | Compliance review. |
| clientVisible | Boolean | required | True only after release and permission checks. |
| riskSummary | Text | optional | Risk summary. |
| assumptionsJson | Json | optional | Assumptions. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### RecommendationOption

Option presented within a recommendation/decision.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| recommendationId | UUID | required | Recommendation. |
| label | String(120) | required | Option label. |
| description | Text | optional | Description. |
| prosJson | Json | optional | Pros. |
| consJson | Json | optional | Cons. |
| riskLevel | String(40) | optional | Risk rating. |
| isPreferred | Boolean | required | Preferred option marker. |
| sortOrder | Int | required | Display order. |

### Approval

Human approval by advisor, family member, trustee, compliance or other authority.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| targetType | ObjectType | required | Approved object type. |
| targetId | UUID | required | Approved object ID. |
| approverUserId | UUID | required | Approver. |
| approverRoleKey | String(120) | required | Role under which approval is made. |
| approvalType | String(80) | required | Advisor, family, trustee, compliance, specialist. |
| status | ReviewStatus | required | Approved, rejected, request_more_data, etc. |
| notes | Text | optional | Approval notes. |
| approvedAt | DateTime | optional | Approval time. |
| createdAt | DateTime | required | Creation timestamp. |

### ComplianceReview

Compliance release/block review for advice-like or sensitive outputs.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| targetType | ObjectType | required | Object reviewed. |
| targetId | UUID | required | Object ID. |
| reviewerUserId | UUID | required | Compliance officer. |
| status | ComplianceStatus | required | Pending, released, blocked, needs evidence, exception. |
| adviceClassification | AdviceClassification | required | Classification. |
| recordOfAdviceRequired | Boolean | required | Whether ROA required. |
| recordOfAdviceDocumentId | UUID | optional | ROA document, if any. |
| kycFicaStatus | String(80) | optional | KYC/FICA status label. |
| popiaConsentStatus | String(80) | optional | Consent/privacy status. |
| evidenceComplete | Boolean | required | Evidence completeness. |
| releaseNotes | Text | optional | Release or block rationale. |
| releasedAt | DateTime | optional | Release time. |
| blockedAt | DateTime | optional | Block time. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Decision

Client/family-facing decision object after release to client.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| recommendationId | UUID | optional | Related recommendation. |
| title | String(200) | required | Decision title. |
| status | DecisionStatus | required | Lifecycle status. |
| releasedToClientAt | DateTime | optional | Visibility release time. |
| decisionByUserId | UUID | optional | User who decided. |
| decisionAction | String(40) | optional | Accept, defer, reject. |
| decisionReason | Text | optional | Client reason/note. |
| decisionAt | DateTime | optional | Decision time. |
| reviewDate | Date | optional | Next review date. |
| evidenceRecordId | UUID | optional | Evidence package. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### DecisionParticipant

Participant/approval requirement for a decision.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| decisionId | UUID | required | Decision. |
| userId | UUID | optional | Specific user. |
| roleKey | String(120) | optional | Required role if no fixed user. |
| required | Boolean | required | Whether approval required. |
| status | ReviewStatus | required | Pending/approved/rejected. |
| actedAt | DateTime | optional | When participant acted. |
| createdAt | DateTime | required | Creation timestamp. |

### EvidenceRecord

Structured proof package for decision, release, communication or action.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| engagementId | UUID | optional | Matter. |
| title | String(220) | required | Evidence record title. |
| status | EvidenceStatus | required | Evidence lifecycle status. |
| relatedObjectType | ObjectType | required | Primary object supported. |
| relatedObjectId | UUID | required | Primary object ID. |
| summary | Text | optional | Evidence summary. |
| visibilityStatus | VisibilityStatus | required | Who can see it. |
| retentionPolicy | String(120) | optional | Retention rule. |
| reviewDate | Date | optional | Next review date. |
| createdByUserId | UUID | optional | Creator. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### EvidenceItem

Individual item inside an evidence record: document, approval, audit event, note, export, etc.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| evidenceRecordId | UUID | required | Evidence record. |
| itemType | String(80) | required | Document, approval, audit_event, note, compliance_release, decision. |
| sourceObjectType | ObjectType | required | Source type. |
| sourceObjectId | UUID | required | Source ID. |
| title | String(200) | required | Item title. |
| visibilityStatus | VisibilityStatus | required | Visibility. |
| hash | String(128) | optional | Integrity hash. |
| createdAt | DateTime | required | Creation timestamp. |

### AuditEvent

Immutable append-only audit event. No edits; corrections are new events.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| platformTenantId | UUID | required | Platform. |
| clientTenantId | UUID | optional | Tenant. |
| actorUserId | UUID | optional | Actor user. |
| actorRoleKey | String(120) | optional | Role used. |
| eventType | String(120) | required | Machine event key. |
| targetType | ObjectType | required | Object type. |
| targetId | UUID | required | Object ID. |
| previousState | String(120) | optional | Previous state. |
| nextState | String(120) | optional | Next state. |
| result | AuditResult | required | Outcome. |
| reason | Text | optional | Reason/rationale. |
| ipAddress | String(64) | optional | IP address. |
| deviceId | UUID | optional | Device/session ID. |
| correlationId | UUID | optional | Trace/correlation ID. |
| evidenceRecordId | UUID | optional | Linked evidence. |
| metadataJson | Json | optional | Additional event details. |
| createdAt | DateTime | required | Event timestamp. |

### ReviewSchedule

Review cadence and reminders for decisions, evidence, entities or engagements.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| targetType | ObjectType | required | Object to review. |
| targetId | UUID | required | Object ID. |
| cadence | String(80) | required | Quarterly, annually, custom. |
| nextReviewDate | Date | required | Next review. |
| ownerUserId | UUID | optional | Review owner. |
| status | WorkflowStatus | required | Active, completed, deferred, archived. |
| lastCompletedAt | DateTime | optional | Last completion. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### MessageThread

Secure communication thread. Client-visible messages must comply with release and template rules if advice-like.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| engagementId | UUID | optional | Matter. |
| subject | String(220) | required | Thread subject. |
| channel | CommunicationChannel | required | Primary channel. |
| status | WorkflowStatus | required | Draft, sent, awaiting reply, closed. |
| clientVisible | Boolean | required | Whether thread is visible to client. |
| relatedObjectType | ObjectType | optional | Related object type. |
| relatedObjectId | UUID | optional | Related object ID. |
| createdByUserId | UUID | required | Creator. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### Message

Message inside a thread. Internal notes and client-visible messages must be distinguished.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| threadId | UUID | required | Thread. |
| senderUserId | UUID | required | Sender. |
| body | Text | required | Message body. |
| clientVisible | Boolean | required | Visible to client roles. |
| requiresApproval | Boolean | required | Whether message needs approval/release. |
| approvalId | UUID | optional | Approval. |
| sentAt | DateTime | optional | Sent time. |
| createdAt | DateTime | required | Creation timestamp. |

### CallEvent

Call/F2F/external specialist escalation and outcome.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| engagementId | UUID | optional | Matter. |
| relatedObjectType | ObjectType | optional | Related object. |
| relatedObjectId | UUID | optional | Related ID. |
| escalationType | EscalationType | required | Advisor call, F2F, external specialist. |
| scheduledByUserId | UUID | required | Scheduler. |
| scheduledFor | DateTime | optional | Scheduled time. |
| durationMinutes | Int | optional | Duration. |
| status | WorkflowStatus | required | Scheduled, completed, cancelled. |
| outcomeSummary | Text | optional | Outcome. |
| evidenceRecordId | UUID | optional | Evidence. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### ExportRequest

Request to export documents, evidence or audit data with redaction and permission controls.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| requestedByUserId | UUID | required | Requester. |
| exportType | ExportType | required | Export package type. |
| status | ExportStatus | required | Lifecycle status. |
| scopeJson | Json | required | Selected objects and filters. |
| redactionProfile | String(80) | required | client-visible, advisor-visible, compliance-internal, external-limited. |
| approvalRequired | Boolean | required | Whether export requires approval. |
| approvedByUserId | UUID | optional | Approver. |
| generatedFileDocumentId | UUID | optional | Generated export document. |
| expiresAt | DateTime | optional | Expiry. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### PolicyDefinition

Tenant or platform policy used by advice boundary, exports, permissions, retention and evidence rules.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| platformTenantId | UUID | required | Platform. |
| clientTenantId | UUID | optional | Tenant-specific policy if set. |
| policyKey | String(140) | required | Machine key. |
| name | String(180) | required | Policy name. |
| version | String(40) | required | Version. |
| category | String(80) | required | Advice boundary, privacy, export, retention, access, evidence. |
| rulesJson | Json | required | Policy rules. |
| status | String(40) | required | Draft, active, archived. |
| createdByUserId | UUID | required | Creator. |
| effectiveFrom | Date | optional | Effective from. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### QueueItem

Operational queue entry for analysts, advisors, compliance, client success or ops.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| queueName | String(120) | required | Queue. |
| targetType | ObjectType | required | Object type. |
| targetId | UUID | required | Object ID. |
| assignedToUserId | UUID | optional | Assignee. |
| assignedRoleKey | String(120) | optional | Assignee role. |
| priority | String(40) | required | Priority. |
| status | WorkflowStatus | required | Queue state. |
| slaDueAt | DateTime | optional | SLA due timestamp. |
| escalated | Boolean | required | Whether escalated. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

### DataQualityIssue

Structured data gap, conflict or quality issue.

| Field | Type | Required | Documentation |
| --- | --- | --- | --- |
| id | UUID | required | Primary key. |
| clientTenantId | UUID | required | Tenant. |
| targetType | ObjectType | required | Object type. |
| targetId | UUID | required | Object ID. |
| severity | String(40) | required | Low, medium, high, critical. |
| issueType | String(100) | required | Missing data, conflict, expired doc, low confidence. |
| description | Text | required | Issue details. |
| status | WorkflowStatus | required | Open, in review, resolved, blocked. |
| ownerUserId | UUID | optional | Owner. |
| createdAt | DateTime | required | Creation timestamp. |
| updatedAt | DateTime | required | Last update timestamp. |

## 5. Relationship overview

| Relationship | Cardinality | Notes |
|---|---:|---|
| PlatformTenant → ClientTenant | 1:N | AlphaVest may operate multiple client tenants. |
| ClientTenant → Engagement | 1:N | Each review/matter belongs to one tenant. |
| User → UserRole → Role | N:M | Users can have multiple roles; roles can be assigned to many users. |
| Role → RolePermission → Permission | N:M | Roles contain multiple permissions; permissions can be reused. |
| ClientTenant → FamilyMember | 1:N | Family members may or may not have login accounts. |
| Entity → EntityParticipant | 1:N | Trustees, beneficiaries, directors, owners, advisors. |
| Entity → Asset | 1:N | Assets may be owned by entities. |
| Document → DocumentVersion | 1:N | Versioned document storage. |
| Document → DocumentExtraction | 1:N | Extraction can be re-run or revised. |
| Document → DocumentLink | 1:N | Documents link to entities, assets, decisions, evidence, etc. |
| Trigger → ActionItem / Recommendation | 1:N | Trigger is a review point, not final advice. |
| Recommendation → Approval / ComplianceReview / Decision | 1:1 or 1:N | Recommendation progresses through gates. |
| Decision → EvidenceRecord | 1:1 or 1:N | Final decision creates evidence package. |
| EvidenceRecord → EvidenceItem | 1:N | Evidence items can reference documents, approvals and audit events. |
| Any sensitive object → AuditEvent | 1:N | Important actions emit audit events. |
| ExportRequest → Document | 1:1 | Generated export should be stored as document with audit. |

## 6. Mandatory tenant and access patterns

Every model that contains client data must include or derive:

```text
clientTenantId
objectType
objectId
sensitivity
visibilityStatus/clientVisible
createdAt
updatedAt
audit events for sensitive changes
```

All reads and writes must pass through a central permission function:

```ts
permissionEngine.can(actor, action, object, {
  platformTenantId,
  clientTenantId,
  entityScopeId,
  engagementId,
  sensitivity,
  workflowState,
  clientVisibilityState
})
```

## 7. No-unapproved-advice gate as data rule

A recommendation or decision may become client-visible only when:

```text
recommendation.status in ["released_to_client"]
AND advisorApproval.status == "approved"
AND complianceReview.status == "released"
AND evidenceRecord.status in ["created", "validated", "released"]
AND permissionEngine.can(actor, "view", recommendation, context) == true
```

Advisor approval alone is never sufficient.

## 8. Export rule

An export may be generated only when:

```text
actor has export permission
tenant scope is valid
object scope is valid
redaction profile is selected
approval is complete if required
audit event is written
export expiry is set when external sharing is used
```
