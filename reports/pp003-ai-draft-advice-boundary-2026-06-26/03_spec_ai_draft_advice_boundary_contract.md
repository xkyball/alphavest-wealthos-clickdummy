# SPEC-1.2 - PP-003 AI Draft Internal-only and Advice Boundary Proof Contract

Generated: 2026-06-26

Task: `SPEC-1.2 PP-003 AI Draft Internal-only and Advice Boundary Proof Contract`

Status: `COMPLETE_PENDING_DECISION_1_3`

Depends on:

- `DECISION-1.0 PP-001 / PP-002 Dependency Acceptance for PP-003`
- `ANALYSIS-1.1 PP-003 AI Draft / Advice Boundary Readiness & Dependency Preflight`

## Executive Contract

PP-003 may proceed only as an internal draft, unsupported-claim, no-unapproved-advice and payload-leakage proof pack. It must not introduce production AI generation, autonomous advice, broad schema replacement, a second evidence platform or client-visible draft content.

The bold cleanup boundary is intentional:

```text
PP003_CANONICAL_PATH_ONLY:
Use canonical journey/API PP-002 sufficiency for evidence-backed rebuild.
Quarantine legacy/P44 evidence paths from PP003 acceptance unless adapted.
Do not keep old ambiguity alive with compatibility language.
```

## Approved Dependency Use

| Dependency | PP-003 may use | PP-003 must not infer |
|---|---|---|
| PP-001 payload visibility | Actor, role, tenant, object, payload visibility and audit expectations. | Route access as payload permission; admin role as visibility bypass. |
| PP-002 limited readiness | Canonical first-wave journey evidence sufficiency path: explicit link, review, relevance, scope, currentness, unrestricted visibility and compliance decision. | Universal evidence platform readiness; legacy/P44 evidence acceptance; upload-as-proof. |
| Existing internal draft spine | Dedicated `InternalDraft`, `DraftClassification`, `UnsupportedClaim`, `DraftTrace` models and tests as current repo reality. | Permission for new schema migration or a production AI engine. |
| Existing projection/export proof | Current visibility and export services as implementation seams. | Full PP005 export readiness or complete release lifecycle. |

## Field Classification Contract

| Field / class | PP-003 class | Client/API/export rule |
|---|---|---|
| `clientSummaryDraft`, `draftClientSummary`, model output, model prompt | `AI_DRAFT_INTERNAL_ONLY` | Hidden from client, client API, export and decision projection until transformed by approved gates. |
| `internalRationale`, `summaryInternal` | `INTERNAL_RATIONALE_ONLY` | Hidden from client and export; visible only to scoped internal roles. |
| `assumptionsJson`, confidence/assumption metadata | `INTERNAL_ASSUMPTION_ONLY` | Hidden from client and export. |
| `UnsupportedClaim`, unsupported claim notes/reasons | `UNSUPPORTED_CLAIM_INTERNAL_ONLY` | Hidden from client; blocks promotion until resolved by canonical evidence. |
| `complianceNotes` | `COMPLIANCE_INTERNAL_ONLY` | Hidden from client and export unless a later approved redacted release contract allows safe summary. |
| `auditActor`, `auditEventId`, `auditMetadata`, `auditReason` | `CLIENT_REDACTED_AUDIT` | Redacted/hidden from client payloads. |
| `evidenceRecordId`, internal evidence decision reasons | `INTERNAL_EVIDENCE_DETAIL` | Hidden from client unless later released/redacted by approved gate; never proof by existence alone. |
| `clientSummary` | `CLIENT_SAFE_CANDIDATE` | Client-visible only when release, visibility, evidence and redaction gates pass. |

Unknown PP003-adjacent fields must be marked `REQUIRES_DECISION`, not guessed.

## State / Transition Contract

| State / transition | Required behaviour |
|---|---|
| Draft created | Internal-only; `clientVisible=false`; audit or trace required. |
| Draft classified | Must record classification and unsupported-claim status; classification alone is not client-safe. |
| Unsupported claim detected | Promotion blocked; status must route to rejected, needs evidence or rebuild-required; client projection remains fail-closed. |
| Rebuild with evidence | Allowed only when canonical PP-002 sufficiency inputs are present for the recommendation/journey scope. |
| Advisor candidate / advisor ready | Internal review state only; cannot imply compliance release or client visibility. |
| Compliance release | Out of PP003 implementation except as a negative boundary: PP003 may prove release cannot occur without canonical evidence, clean draft state and audit readiness. |
| Export candidate | Must exclude forbidden internal payload; PP003 prepares forbidden-payload proof, not full PP005 export implementation. |

## Surface Redaction Contract

| Surface | Required PP-003 behaviour |
|---|---|
| Internal workbench / advisory routes | May show scoped internal draft/rationale and unsupported claim details to allowed internal roles. Must label them as internal and not released. |
| Client portal/mobile | Must fail closed until released client-safe projection exists. Must not render or return AI draft, internal rationale, unsupported claim details, compliance notes, internal evidence IDs or internal audit details. |
| Client/API payloads | Must allowlist client-safe fields and deny forbidden internal keys, including hidden JSON fields. |
| Decision projection | Must not project internal draft/advice as client decision content before released client-safe state. |
| Export candidate / export API | Must classify and block forbidden internal payload before generation. PP003 does not approve download/share. |
| Demo workflow responses | Must retain `noClientRelease` and must not be presented as production advice proof. |

## Audit Contract

PP-003 safety-relevant transitions require audit or trace proof:

- internal draft creation/classification,
- unsupported claim rejection or needs-evidence state,
- rebuild with evidence,
- boundary denial,
- advisor-candidate transition,
- failed attempt to promote unsupported or insufficiently evidenced draft.

Where current code cannot prove an audit event, the implementation task must either add proof or report a blocker. A UI audit label is not audit persistence proof.

## UX Wording Contract

Allowed wording:

- `Internal draft`
- `Unsupported claim`
- `Needs evidence`
- `Rebuild required`
- `Advisor candidate`
- `Compliance pending`
- `Client-safe summary candidate`
- `Not released`
- `No client release`

Forbidden wording before later release gates:

- `Client ready`
- `Advice sent`
- `Released`
- `Approved for client`
- `Evidence sufficient` after upload-only or unlinked evidence
- `Export approved` from preview/generation state

## Acceptance Criteria

1. Given a client-facing actor and a recommendation/draft payload, when the payload is projected, then AI draft, internal rationale, assumptions, unsupported claim details, compliance notes, internal evidence IDs and internal audit details are absent or redacted.
2. Given an unsupported claim, when promotion to advisor candidate, client-safe summary, compliance release or export is attempted, then the action is blocked and auditable.
3. Given rebuild without canonical PP-002 sufficient evidence, when advisor-ready or client-safe promotion is attempted, then the state remains blocked or needs evidence.
4. Given advisor/internal actor, when viewing workbench/advisor candidate states, then internal draft visibility is allowed only under PP-001 role/object/payload rules and remains explicitly internal.
5. Given export candidate payload, when forbidden internal fields are present, then export generation remains blocked and PP005 readiness is not overclaimed.
6. Given any success or confirmation feedback, then copy does not imply client release, compliance release, export approval or evidence sufficiency unless the relevant later gate has passed.

## Required Implementation Task Boundaries

| Task | Approved boundary after DECISION-1.3 |
|---|---|
| IMPL-1.4 | Build or align one PP003 dictionary/redaction map. Prefer code-level reusable contract plus tests over doc-only lists. |
| IMPL-1.5 | Enforce or test draft classification, unsupported claim lifecycle and canonical evidence-backed rebuild. Legacy/P44 evidence must stay quarantined unless adapted. |
| IMPL-1.6 | Add API/client/decision/export-adjacent negative tests. Payload assertions must be stronger than visual text checks. |
| IMPL-1.7 | Add or verify advisor-candidate/no-release guard. No advisor state may set `clientVisible=true`. |
| IMPL-1.8 | Add or verify audit/trace proof for draft boundary transitions. Fail closed or report blocker on missing audit persistence. |
| IMPL-1.9 | Apply wording only where it reflects real state. Wording-only patches must not be reported as runtime safety proof. |

## Explicit Non-Goals

- No production AI engine.
- No autonomous financial/legal/tax advice.
- No client-visible AI Draft.
- No broad Prisma schema replacement or migration by default.
- No new Evidence Platform API.
- No full PP004 advisor/compliance/release implementation.
- No full PP005 export package implementation.
- No screen, state-screen or image generation.
- No implementation from `main`.

## Test / Review Design

Minimum validation after implementation approval:

```text
pnpm guard:source
pnpm typecheck
pnpm db:validate
pnpm playwright test tests/pp002-evidence-sufficiency-canonical.spec.ts --workers=1
pnpm playwright test tests/pp001-payload-visibility-contract.spec.ts tests/internal-draft-governance-spine.spec.ts --workers=1
pnpm playwright test tests/true-ux-p0-safety.spec.ts tests/client-visibility-projection.spec.ts tests/file-export-realism.spec.ts --workers=1
```

Additional targeted tests should be added by IMPL tasks rather than weakening existing suites.

## Decision Required Next

`DECISION-1.3` must answer:

```text
Approve this SPEC-1.2 as the PP003 advice-boundary policy and execution boundary?
```

Recommended answer: `PP003_ADVICE_BOUNDARY_POLICY_APPROVED_WITH_CANONICAL_PATH_ONLY`.

Reason: this removes old ambiguity instead of preserving it. PP003 should become the cleanup moment where AI draft safety moves onto a single canonical evidence-backed path, with legacy/P44 compatibility treated as quarantined reference unless adapted explicitly.

