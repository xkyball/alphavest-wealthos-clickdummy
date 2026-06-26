# SPEC-1.2 - PP-005 Export Scope, Redaction, Approval and Delivery Contract

Generated: 2026-06-26

Status: `COMPLETE_PENDING_DECISION_1_3`

Source ticket: `SPEC-1.2`

## Target State

PP-005 export/redaction may operate only as a controlled, canonical, client-safe delivery boundary.

An export package candidate may include only deliberately scoped, actor-authorized, object-scoped, released, redacted and client-safe content. Preview is read-only and non-approval. Approval is a controlled gate but does not imply generation, download/share or client acceptance. Generation/download/share are separate audited transitions. Missing scope, missing redaction, forbidden payload, missing approval, audit failure, wrong tenant/object, insufficient evidence or unreleased content blocks export fail-closed.

## Authority Boundary

| Area | Approved PP-005 Boundary |
| --- | --- |
| Canonical export command API | `/api/export-workflow` |
| Canonical export command service | `lib/export-workflow-command-service.ts` |
| Canonical release authority | `/api/journeys/[id]/commands` |
| Canonical released client-safe content | Typed journey client projections |
| Demo workflow | Compatibility/demo only, not PP-005 authority |
| Recommendation-review workflow | Typed compatibility proof only, not PP-005 release truth |
| Export package output | Metadata-only redacted manifest proof unless later decision authorizes binary storage/download semantics |

## Lifecycle Contract

| Step | Command / State | Required Preconditions | Forbidden Overclaim |
| --- | --- | --- | --- |
| Scope | `SET_SCOPE` / `SCOPE_SELECTED` | Valid tenant, role, object and selected client-safe scope item. | Scope is not redaction, preview, approval, generation or delivery. |
| Redaction | `VALIDATE_REDACTION` | Scope selected, explicit non-empty redaction profile, no forbidden payload fields in candidate output. | Redaction does not approve export or create delivery. |
| Preview | `PREVIEW` / `APPROVAL_REQUIRED` | Scope and redaction checks passed; payload remains client-safe. | Preview is not approval, generation, download/share or client acceptance. |
| Approval | `APPROVE` / `APPROVED` | Previewed/redacted/scoped content; permission; data-quality and safety blockers clear; audit persists. | Approval is not package generation or download/share. |
| Generation | `GENERATE` / `GENERATED` | Approval exists, redaction still explicit, no forbidden payload, audit persists. | Metadata-only package proof is not real binary export unless separately authorized. |
| Download | `DOWNLOAD` / `DOWNLOADED` | Generated/approved state and audit persistence. | Download is not share, client acceptance, investment action or advice execution. |
| Share | `SHARE` / recorded share audit with downloaded state | Controlled download path, explicit external-share flag, audit persistence. | Share is not client acceptance or proof of client understanding/action. |

## Payload Contract

Allowed export payload may include only approved client-safe projection fields such as:

- released client-safe summary,
- released decision state,
- released timestamp,
- redacted title,
- released evidence summary where accepted by upstream contract,
- manifest metadata allowed by the redaction profile.

Forbidden payload classes:

- AI Draft,
- internal rationale,
- analyst notes,
- compliance notes,
- unreleased recommendation,
- unreleased evidence,
- raw evidence,
- hidden payload fields,
- storage key/checksum/raw file metadata unless explicitly redacted and approved for manifest proof,
- model prompt/output/assumptions not released through the accepted client-safe projection.

## Scope / Permission Contract

PP-005 must enforce:

- route access is not action permission,
- action permission is not payload visibility,
- actor role must be export-operational and permitted,
- tenant and object scope must match,
- selected objects must be explicitly allowed or safely excluded,
- admin/governance authority cannot bypass evidence, redaction, release, approval, audit or payload gates.

## Audit Contract

The following PP-005 actions require audit mapping when executed or denied in safety-relevant paths:

- scope selection,
- redaction validation,
- preview,
- approval,
- generation,
- download,
- share,
- denial/failure where scope, redaction, permission, data-quality, audit or forbidden payload blocks the action.

If required audit persistence cannot be written or confirmed, the command must fail closed or remain pending; it must not silently complete.

## UI / Feedback Contract

Required wording boundaries:

- `Preview` must not be labelled as approval.
- `Approve export` must not imply generation, download or share.
- `Download/share` must not imply client acceptance.
- Success messages must name only the completed lifecycle action.
- Blocked states must identify the missing precondition: scope, redaction, approval, audit, data quality, permission, tenant/object scope, evidence sufficiency, release state or forbidden payload.
- Demo-backed states must not overclaim production persistence.

## Positive Acceptance Criteria

- Given a permitted user, allowed object scope, released client-safe decision and explicit redaction profile, when scope, redaction, preview, approval, generation, download and share run in order through `/api/export-workflow`, then each state transition completes separately and emits the expected audit event.
- Given approved released content, when metadata-only package generation succeeds, then the manifest contains no forbidden internal payload and still states that no real binary storage was generated.
- Given current route surfaces 054-058, when a user navigates export stages, then scope, redaction, preview/approval and download/share remain conceptually separate.

## Negative Acceptance Criteria

- Given preview exists without approval, generation/download/share remain blocked.
- Given approval exists but redaction profile is missing or empty, generation remains blocked.
- Given forbidden payload fields are present, preview/package generation fails closed and no payload leaks.
- Given high-severity data quality blocker exists, approval remains blocked.
- Given wrong tenant/object/role/payload visibility, export command is denied with no hidden rows disclosed.
- Given admin attempts to force export without gates, export remains denied and does not bypass PP-001 to PP-004.
- Given download/share succeeds, response/copy must not imply client acceptance, advice execution or financial action.

## Implementation Boundary

Codex may, after DECISION-1.3:

- revalidate the existing command spine and tests,
- harden existing export services/helpers,
- align route/UI copy if wording drift remains,
- add focused tests or fixtures,
- write/update PP-005 proof reports.

Codex must not, without a new human decision:

- create a broad new export API,
- add schema migrations,
- add real binary storage/download semantics,
- widen export types beyond MVP routes 054-058,
- elevate P1/HOLD export scope,
- treat `/api/demo-workflow` as release/export authority,
- invent new definitions for released, client-safe, evidence sufficient, forbidden payload or client acceptance.

## Test Plan

Minimum targeted validation after DECISION-1.3:

```bash
pnpm playwright test tests/export-command-spine-contract.spec.ts
pnpm playwright test tests/export-workflow-api.spec.ts
pnpm playwright test tests/export-safety.spec.ts tests/file-export-realism.spec.ts tests/true-ux-export-scope-redaction-approval.spec.ts
pnpm playwright test tests/pp002-evidence-sufficiency-canonical.spec.ts tests/pp003-advice-boundary-contract.spec.ts tests/journey-api.spec.ts tests/client-visibility-projection.spec.ts
pnpm phase:check
```

If the database-backed export workflow suite is unavailable, the blocker must be reported rather than replaced by UI-only proof.

## Definition Of Done Check

| Criterion | Result |
| --- | --- |
| Target state unambiguous | PASS |
| Scope and out-of-scope clear | PASS |
| Positive/negative acceptance criteria testable | PASS |
| Test/review logic defined | PASS |
| Implementation tasks derivable | PASS |
| Human approval prepared | PASS |

## Result

`SPEC-1.2_COMPLETE_PENDING_DECISION_1.3`

Next ticket in uploaded order: `DECISION-1.3`.
