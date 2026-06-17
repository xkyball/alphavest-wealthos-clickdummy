# Data State Evidence Audit Reference V3

Generated: 2026-06-16T23:25:11.459Z

| Reference ID | Term | User-Facing Meaning | Internal Source | Where Users See It | What It Allows | What It Blocks | Related Workflow(s) | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REF-001 | Demo session | A non-production role and tenant context used before real authentication. | lib/demo-session.ts | Top bar and demo panels | Fast role/tenant review | Production-auth claims | all relevant manual tasks | lib/demo-session.ts |
| REF-002 | No unapproved advice | Advice-like content cannot reach clients until advisor approval, compliance release, evidence, and permission checks pass. | AGENTS.md; lib/workflow-gate.ts | Advisor, compliance, decisions, export | Safe client visibility | Advisor-only release | all relevant manual tasks | AGENTS.md; lib/workflow-gate.ts |
| REF-003 | Advisor approval | Human advisor review stage that still stays internal. | WORKFLOW_DEFINITIONS_V3.md | Advisor Approval Detail | Routes package to compliance | Client visibility | all relevant manual tasks | WORKFLOW_DEFINITIONS_V3.md |
| REF-004 | Compliance release | Final compliance control for client visibility. | DATA_MODEL_V3.md; workflow-gate.ts | Compliance review/release pages | Allows released content if all gates pass | Release with missing evidence | all relevant manual tasks | DATA_MODEL_V3.md; workflow-gate.ts |
| REF-005 | Evidence record | Proof package for important actions, decisions, and releases. | prisma/schema.prisma; evidence-service.ts | Evidence vault and decision success | Traceability | Unsupported advice or export | all relevant manual tasks | prisma/schema.prisma; evidence-service.ts |
| REF-006 | Audit event | Append-only proof that a sensitive action occurred or was denied. | prisma/schema.prisma; audit-service.ts | Audit history/compliance pages | Reconstruct lineage | Silent sensitive changes | all relevant manual tasks | prisma/schema.prisma; audit-service.ts |
| REF-007 | Redaction | Removal or masking of sensitive fields before export/share. | export-service.ts; DATA_MODEL_V3.md | Export redaction and preview | Role-safe export | Unredacted external package | all relevant manual tasks | export-service.ts; DATA_MODEL_V3.md |
| REF-008 | Second confirmation | Extra confirmation for sensitive role, policy, manage, revoke, assign, or release actions. | permission-engine.ts | Roles, platform, security, release pages | Safer sensitive changes | Silent privilege escalation | all relevant manual tasks | permission-engine.ts |
| REF-009 | Restricted state | User can see a blocked/restricted explanation instead of inaccessible data. | components/ui/state-panel.tsx | Many workflow pages | Clear next step | Data leakage | all relevant manual tasks | components/ui/state-panel.tsx |
| REF-010 | Reference-only page | Internal documentation/product page, not a client workflow. | SCREEN_CATALOGUE_V3.md | Service blueprint, roadmap, states | Shared understanding | Client/manual task overclaim | all relevant manual tasks | SCREEN_CATALOGUE_V3.md |

## Status families

| Family | Key values | Manual guidance | Source proof |
| --- | --- | --- | --- |
| TenantStatus | draft, onboarding, active, suspended, archived | Explain tenant readiness and blocked activation. | DATA_MODEL_V3.md; prisma/schema.prisma |
| WorkflowStatus | draft, new, in_review, awaiting_info, advisor_review, compliance_pending, ready_for_client, client_visible, completed, deferred, blocked, rejected, archived | Use to explain where a task is in the lifecycle. | DATA_MODEL_V3.md; prisma/schema.prisma |
| DocumentStatus | uploading, uploaded, ai_extracted, analyst_review_pending, verified, needs_clarification, blocked, linked_to_evidence | Use to explain document intake and verification. | DATA_MODEL_V3.md; prisma/schema.prisma |
| ComplianceStatus | pending, in_review, released, blocked, needs_evidence, exception, expired | Use to explain release/block outcomes. | DATA_MODEL_V3.md; prisma/schema.prisma |
| DecisionStatus | released_to_client, awaiting_family_approval, accepted, deferred, rejected, evidence_created | Use to explain client decisions. | DATA_MODEL_V3.md; prisma/schema.prisma |
| EvidenceStatus | placeholder, created, linked, validated, released, restricted, archived, superseded | Use to explain proof completeness and release gates. | DATA_MODEL_V3.md; prisma/schema.prisma |
| ExportStatus | draft, scope_selected, redaction_pending, approval_required, approved, generated, downloaded, expired, revoked, failed | Use to explain export wizard states. | DATA_MODEL_V3.md; prisma/schema.prisma |
| AuditResult | success, denied, blocked, failed, pending, warning | Use to explain audit history outcomes. | DATA_MODEL_V3.md; prisma/schema.prisma |
