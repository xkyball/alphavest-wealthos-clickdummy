# AlphaVest Wave 2 / TASK-C2 Client Context And Evidence Lifecycle Target-State Specification

Date: 2026-06-29
Mode: Wave 2, specification / acceptance criteria
Status: COMPLETED_SPEC_READY_FOR_ACCEPTANCE

## Re-read Task Definition

TASK-C2 was re-read from `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json` before execution.

Goal: define actionable UI target states for client context and evidence lifecycle.

## Source Basis

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_1_TASK_C1_CLIENT_EVIDENCE_FINDINGS.md`
- `components/client-intake-screen.tsx`
- `components/wealth-actions-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `app/api/profile/route.ts`
- `app/api/family-members/route.ts`
- `app/api/documents/upload/route.ts`
- `lib/document-upload-service.ts`
- `lib/evidence-review-service.ts`
- `lib/evidence-lifecycle-contract.ts`
- `lib/visibility-engine.ts`
- `lib/client-context-visibility.ts`

Known source correction: `app/api/client-profile/route.ts` is stale; canonical profile API is `app/api/profile/route.ts`.

## Target-State Matrix

| Scope item | Required UI input | Required output state | Service/readmodel target | Acceptance criteria | Blocked / out-of-scope boundary |
|---|---|---|---|---|---|
| Client profile context | Tenant/role context, selected client profile fields | Saved/reloaded profile state with safe/unsafe downstream readiness | `/api/profile` | Save shows persisted profile output; wrong tenant/role denies without payload leak; client-safe surface hides internal-only fields | Profile save never releases advice, evidence, export, or client projection |
| Family member target selection | Explicit row selection, selected member id/name/scope, editable fields | Updated selected family member on same row/detail | `/api/family-members` | Detail form is bound to selected row, not `rows[0]`; mutation payload includes selected object id; post-save readback updates same object | Free label or first-row default cannot count as selected-object proof |
| Entity detail / relationship map | Selected entity/relationship id, relationship type, participant context | Backend/readmodel-backed graph/detail state | Existing entity APIs or new readmodel if approved | Detail route reads selected entity by id; relationship output is traceable to DB/readmodel; no client release created | Demo graph can remain only if labelled as display-only and not counted as implemented |
| Wealth map workflow | Selected wealth node/action, evidence state, sensitivity/visibility context | Selected object detail, restricted fields masked, action readiness blocked/allowed | Wealth/action readmodel or explicit backend query | Wealth map shows object identity, restricted state, downstream blocker, evidence state and recovery route | Wealth map cannot mark action ready, release advice, or expose restricted object details by itself |
| Sensitivity classification | Sensitivity field/classification source, actor/role, object scope | Visibility decision: visible, masked, blocked or redacted | `visibility-engine`, document/profile/entity readmodels | Sensitive fields are hidden/masked for unauthorized roles; UI explains product-native availability status | No raw storage key, checksum, internal evidence state or internal rationale in client surfaces |
| Evidence request creation | Selected review/object, missing evidence item, reason, confirmation where required | Requested evidence state visible on same selected review/object | Typed workflow `request_evidence` or evidence request API/readmodel | Request can be created, audited and tracked; release remains blocked; target continuity proven | Fixed demo target ids cannot count as robust target-object selection |
| Document upload | Tenant/role context, file, document type, title, sensitivity | Upload-complete but review-pending state; no release/export/client visibility | `/api/documents/upload`, `document-upload-service` | Upload UI proof passes; response hides storage/checksum internals; audit/evidence rows exist | Upload alone cannot prove evidence sufficiency, release, export, download, or client visibility |
| Evidence vault filters | Query/filter/sort/pagination, selected evidence id | Backend-query-backed rows and meta state | `/api/documents` or dedicated evidence readmodel | Filters affect backend query; selected row opens detail for same evidence id | Disabled static filters must be product-blocked or not counted as implemented |
| Evidence record detail | Selected evidence id, role/tenant context | Evidence lineage, sufficiency/review state, client-safe summary state | Evidence readmodel + review service | Detail view reloads selected evidence; open/download/share actions are either backed or blocked with reasons | Local drawer state or demo timeline cannot count as service-backed detail |
| Client-safe summary traceability | Selected released evidence/recommendation/document, release-safe payload | Client-safe summary card and projection linkage | `visibility-engine`, evidence review output | Summary is derived from release-safe evidence and linked to source id/status; internal payloads absent | Forced Prisma release states in tests cannot substitute for end-to-end UI trace |

## Required UI Output Semantics

1. `visible_static` is allowed only for context, never for lifecycle completion.
2. `modal_local` success must be reflected in parent selected-object state before completion.
3. Evidence display is not evidence sufficiency.
4. Upload complete is not evidence review complete.
5. Evidence review complete is not compliance release.
6. Compliance release is not client acceptance.
7. Client-safe summary must show source status and projection status without exposing internal payload.

## Implementation Slices For TASK-C3

| Slice | Scope | CTES decision | Dependencies | Validation |
|---|---|---:|---|---|
| C3-1 Family Target Selection | Replace implicit first-row detail with explicit selected member state and selected-object mutation proof | 8 | C2 accepted; current client-intake dirty diff reconciled | `av27-client-context-closure.spec.ts`, new UI selected-object assertion |
| C3-2 Evidence Request Object Binding | Bind evidence request UI to selected review/evidence request target and durable post-command state | 10 | A2 + C2 accepted | recommendation workflow API/UI proof, object continuity negative test |
| C3-3 Evidence Vault Readmodel | Backend-query-backed vault list/detail with filters, selected evidence id and lineage | 12 | C2 accepted; readmodel location approved | document/evidence API tests, UI vault filter/detail test |
| C3-4 Client-Safe Summary Projection | Render backend-sourced client-safe summary linked to release-safe evidence | 10 | A2 + C2 accepted | visibility projection tests, no-leak client UI assertions |
| C3-5 Wealth/Sensitivity Workflow | Selected wealth node/action plus sensitivity masking and evidence blocker state | 11 | C2 accepted; readmodel approval if needed | wealth route UI proof, visibility-engine negative proof |
| C3-6 Upload UI Proof Repair | Restore browser flow proof for document upload context selector or canonical session context | 7 | C2 accepted; current UI selector truth checked | `document-upload-flow.spec.ts`, screenshot after upload-ready state |

## Readmodel Decision

TASK-C2 cannot decide whether new read models are allowed. It recommends:

- If existing APIs can serve vault/detail/wealth-map target states without broad schema change, use them.
- If not, create readmodel services in implementation wave only after human acceptance.
- No blind Prisma migration is authorized by C2.

## Acceptance Criteria For TASK-C3 / TASK-C4

1. Every mutation has explicit selected-object identity in UI and payload.
2. Every output state appears on the selected object after success/failure.
3. Every sensitive action creates audit/evidence proof or fails closed.
4. Vault list/detail filters are backend-backed or honestly blocked.
5. Client-safe summary links to release-safe evidence/recommendation/document source.
6. Client-facing routes render only visibility-engine-safe payloads.
7. UI tests cover positive flow and at least one wrong-role/wrong-tenant/wrong-object negative.
8. `tests/document-upload-flow.spec.ts` must pass or be replaced with an equivalent product-native UI proof.

## Human Confirmation Points

Before implementation, confirm:

1. Whether new readmodel services are allowed for evidence vault and wealth map.
2. Whether Evidence Vault belongs under current decisions/governance surface or a future reviewer-only evidence workspace.
3. Whether document upload UI proof should restore the `Tenant context` label or update tests to the canonical session/context control.

## Item Outcome

Status: completed as a specification item.

Changed files:

- `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_WAVE_2_TASK_C2_CLIENT_EVIDENCE_TARGET_STATE_SPEC.md`

Tests:

- `pnpm guard:source` was run during Wave 2 preflight and passed.
- No additional tests were required because TASK-C2 is specification-only.

Findings:

- Client/evidence closure must prioritize selected-object continuity and durable output states.
- Evidence Vault and Wealth Map need readmodel decisions before implementation.
- The failing document upload UI proof remains a P0 proof repair target.

Next item:

- TASK-D2.
