# DECISION-1.0 - PP-005 Dependency Acceptance

Generated: 2026-06-26

Status: `COMPLETE_ACCEPTED_FROM_EXISTING_APPROVED_REPO_EVIDENCE`

Source ticket: `DECISION-1.0`

## Decision Result

PP-005 may consume the current repository's approved PP-001 through PP-004 canonical outputs.

This decision does not authorize broad PP-005 implementation by itself. It clears the upstream dependency gate for analysis and specification, and it allows later implementation only inside the canonical boundaries listed here plus the PP-005 export policy gate.

## Accepted Dependency Inputs

| Dependency | Accepted Source | What PP-005 May Use |
| --- | --- | --- |
| PP-001 Actor/Tenant/Object/Payload/Audit | `V1_0_WP02_GUARD_SPINE_REPORT.md`; `tests/control-layer-actor-scope.spec.ts`; `tests/permission-engine.spec.ts`; PP-005 readiness gate | Route access, action permission, object scope, payload visibility, redaction mode and admin non-bypass boundaries. |
| PP-002 Evidence Sufficiency / Linkage / Upload-not-Sufficiency | `V1_0_WP03_EVIDENCE_LIFECYCLE_REPORT.md`; `tests/pp002-evidence-sufficiency-canonical.spec.ts`; `tests/workflow-gate.spec.ts`; `docs/00-current/ALPHAVEST_WP04_EVIDENCE_WORKFLOW_UPLOAD_NOT_SUFFICIENCY_EXECUTION.md` | Upload is intake only; evidence sufficiency is reviewed, linked, relevant, scoped, current, accepted and audit-backed for the gate. |
| PP-003 AI Draft / Advice Boundary / Forbidden Payload | `V1_0_WP04_AI_DRAFT_GUARD_REPORT.md`; `tests/pp003-advice-boundary-contract.spec.ts`; `tests/pp003-leakage-negative.spec.ts`; `lib/pp003-advice-boundary-contract.ts` | AI draft, assumptions, internal rationale, compliance notes, unsupported claims and internal-only payloads are forbidden for client/export payloads unless released through the accepted gates. |
| PP-004 Advisor/Compliance/Release / Client-safe State | `V1_0_WP05_ADVISOR_COMPLIANCE_RELEASE_REPORT.md`; `reports/pp004-advisor-compliance-release-2026-06-26/12_decision_1_11_pp005_readiness_gate.md`; `tests/journey-api.spec.ts`; `tests/client-visibility-projection.spec.ts` | Advisor approval is not release; compliance release is canonical through `/api/journeys/[id]/commands`; released client-safe projection is the only release output PP-005 may consume. |

## Explicit Human Approval Found

Existing repo report:

`reports/pp004-advisor-compliance-release-2026-06-26/12_decision_1_11_pp005_readiness_gate.md`

Approved decision:

`APPROVE_PP005_CANONICAL_RELEASE_OUTPUTS_ONLY`

Approval date: 2026-06-26

## PP-005 Must Use

- Canonical release authority: `/api/journeys/[id]/commands`.
- Canonical released client-safe output: typed journey client projections.
- Forbidden export payload source: PP-001/PP-003 field classifications.
- Evidence sufficiency source: PP-002 canonical sufficiency.
- Release-boundary source: PP-004 QA and directness classification.

## PP-005 Must Not Use

- `/api/demo-workflow` as release authority.
- `/api/recommendation-review-workflow` as PP-005 source of release truth.
- Advisor approval as client visibility, release, export approval, download/share approval or client acceptance.
- Upload success as evidence sufficiency.
- Internal AI draft, internal rationale, compliance notes or unreleased evidence in export payloads.
- Any new PP-005-specific definition of released, client-safe, forbidden internal payload, evidence sufficient or client accepted.

## Evidence Checked This Turn

- Branch: `full-workflow`.
- Latest commit: `c5dbc48 docs: approve pp005 canonical release outputs`.
- Working tree before report edits: clean.
- `pnpm guard:source`: PASS, 0 violations.

## Definition Of Done Check

| Criterion | Result |
| --- | --- |
| Accepted dependency outputs listed | PASS |
| Missing upstream outputs explicitly marked | PASS - none blocking for analysis/spec; implementation remains dependent on PP-005 gate. |
| PP-005 start condition clear | PASS - analysis/spec may continue; implementation still gated. |
| Unresolved dependency assumptions not passed into implementation | PASS |

## Decision

`DECISION-1.0_COMPLETE`

Next ticket in uploaded order: `ANALYSIS-1.1`.
