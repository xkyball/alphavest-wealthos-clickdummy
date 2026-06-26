# ANALYSIS-1.1 - PP-003 AI Draft / Advice Boundary Readiness & Dependency Preflight

Generated: 2026-06-26

Task: `ANALYSIS-1.1 PP-003 AI Draft / Advice Boundary Readiness & Dependency Preflight`

Status: `COMPLETE`

## Befund

The current `full-workflow` repo is beyond the upload's initial assumption. It already contains first-class internal draft governance structures, client projection redaction logic, export forbidden-payload checks, canonical PP-002 evidence sufficiency tests and several PP001/PP003-adjacent P0 safety proof slices.

The analysis does not authorize implementation. It narrows the next spec and decision gate.

## Relevant Files / Flows / Artefacts

| Area | Files / artefacts | Finding |
|---|---|---|
| Source authority | `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`; upload PP003 ticket architecture | True-UX remains execution authority; upload defines PP003 order and blockers. |
| Dependency decisions | `reports/pp002-evidence-sufficiency-2026-06-26/03_execution_log.md`; `reports/pp002-evidence-sufficiency-2026-06-26/12_decision_pp003_readiness_gate.md` | PP001 accepted for PP002; PP002 approved for PP003 only as `PP003_READY_WITH_LIMITATIONS`. |
| Payload visibility | `lib/pp001-payload-visibility-contract.ts`; `lib/av27-phase6-payload-contract.ts`; `tests/pp001-payload-visibility-contract.spec.ts` | Existing matrix classifies AI draft, internal rationale, compliance notes, unreleased evidence/recommendations and audit fields away from client-safe payloads. |
| Internal draft spine | `prisma/schema.prisma`; `prisma/migrations/20260625143000_internal_draft_governance_spine/migration.sql`; `lib/internal-draft-governance-spine.ts`; `tests/internal-draft-governance-spine.spec.ts` | Dedicated `InternalDraft`, `DraftClassification`, `UnsupportedClaim` and `DraftTrace` models exist; legacy Recommendation draft-field fallback is guarded against in production writes. |
| Canonical workflow path | `lib/journeys/journey-api-service.ts`; `app/api/journeys/[id]/commands/route.ts`; `app/api/journeys/[id]/evidence-sufficiency/route.ts`; `tests/pp002-evidence-sufficiency-canonical.spec.ts` | Canonical journey commands include `AI_DRAFT_INTERNAL`; PP002 sufficiency is available through the first-wave journey/API path. |
| Advisor/release command path | `lib/typed-workflow-command-bus.ts`; `app/api/demo-workflow/route.ts`; `tests/demo-workflow-api.spec.ts`; `tests/workflow-gate.spec.ts` | Advisor approval/rebuild/release logic already writes internal draft rows and keeps `clientVisible=false` until compliance release preconditions pass. |
| Client projections | `lib/visibility-engine.ts`; `lib/control-layer/client-visibility.ts`; `tests/client-visibility-projection.spec.ts`; `tests/true-ux-client-projection.spec.ts`; `tests/true-ux-p0-safety.spec.ts` | Client-role projections fail closed and omit internal draft/rationale/compliance/audit fields from recommendations and decisions. |
| Export surfaces | `lib/export-service.ts`; `lib/export-package-service.ts`; `app/api/export-workflow/route.ts`; `tests/file-export-realism.spec.ts`; `tests/export-safety.spec.ts`; `tests/export-workflow-api.spec.ts` | Export payload classification blocks forbidden internal fields before package generation. |
| UI surfaces | `components/internal-workflow-screen.tsx`; `components/client-intake-screen.tsx`; `components/decisions-governance-screen.tsx`; `components/communication-export-ops-screen.tsx`; `components/no-overclaim-copy.ts` equivalent via `lib/no-overclaim-copy.ts` | UI copy already states internal-only/no-release boundaries in key advisory, decision and export surfaces, but PP003 wording should be spec-bound before any edits. |

## Internal Payload Candidate Register

| Payload / field class | Current source | PP003 classification |
|---|---|---|
| `clientSummaryDraft` / `draftClientSummary` | `Recommendation`, `InternalDraft`, visibility/export tests | Internal draft, not client-safe until transformed and released. |
| `internalRationale` / `summaryInternal` | `Recommendation`, `InternalDraft`, decision/recommendation projection tests | Internal-only rationale. |
| `assumptionsJson` | Recommendation and decision payloads | Internal assumptions; forbidden in client/export projection. |
| `aiDraft` / model output / model prompt | Decision payloads and internal draft field classification | AI draft internal-only. |
| `unsupportedClaims` / `UnsupportedClaim` | `UnsupportedClaim`, internal draft spine | Internal review/evidence blocker. |
| `complianceNotes` | recommendation/decision/export projection tests | Compliance-only internal content. |
| `auditActor`, `auditEventId`, `auditMetadata`, `auditReason` | decision projection and PP001 matrix | Redacted/hidden from client payloads. |
| `evidenceRecordId`, internal evidence reasons | PP002 evidence sufficiency, decision projection | Client-hidden unless released/redacted by later approved gates. |

## Leakage Surface Register

| Surface | Current status | PP003 risk |
|---|---|---|
| Client portal/mobile routes `019-020` | Client projections exist and fail closed for unreleased/internal payloads. | Needs PP003-specific negative acceptance tying AI draft and evidence IDs to client role responses. |
| Decision routes `043-045` | Decision projection hides `aiDraft`, rationale, compliance notes and audit internals. | Needs explicit no-unapproved-advice decision projection spec. |
| Advisory/internal routes `033-037` | Internal workbench/advisor review copy distinguishes internal draft and no client release. | Should remain internal-only; no client projection from advisor candidate. |
| Export routes/API `054-058`, `/api/export-workflow` | Export tests classify forbidden internal fields and block generation. | Needs PP003 dictionary alignment so export remains a downstream leakage target, not full PP005 implementation. |
| `/api/demo-workflow` | Demo/action transport exists and returns no-release signals. | Must not be overclaimed as production advice proof. |
| Journey command API | Canonical `AI_DRAFT_INTERNAL` and evidence sufficiency path exists. | Preferred canonical path for PP003 evidence-backed rebuild coupling. |

## Existing Proof-Slice Register

| Proof slice | Evidence |
|---|---|
| PP001 payload field matrix | `tests/pp001-payload-visibility-contract.spec.ts` |
| PP002 canonical evidence sufficiency | `tests/pp002-evidence-sufficiency-canonical.spec.ts` |
| Internal draft model separation | `tests/internal-draft-governance-spine.spec.ts` |
| Client projection no leakage | `tests/client-visibility-projection.spec.ts`; `tests/true-ux-client-projection.spec.ts`; `tests/true-ux-p0-safety.spec.ts` |
| Export forbidden payload classification | `tests/file-export-realism.spec.ts`; `tests/export-safety.spec.ts` |
| Advisor-not-release gate | `tests/workflow-gate.spec.ts`; `tests/demo-workflow-api.spec.ts` |

## Specification Scope Recommendation

SPEC-1.2 should not invent a new AI product. It should freeze a PP003 contract around:

- canonical evidence-backed rebuild via the PP002 first-wave journey/API sufficiency path,
- forbidden internal payload dictionary and surface redaction map,
- unsupported claim lifecycle and rebuild state semantics,
- advisor candidate is internal and not release,
- client/API/decision/export negative leakage tests,
- audit expectations for reject/rebuild/boundary denial,
- wording rules that prevent upload, advisor approval, demo success or review presence from implying client advice readiness.

## Implementation Split Recommendation

Keep the upload's split, but make the bold cleanup boundary stricter:

- `IMPL-1.4`: create one authoritative PP003 dictionary/map instead of scattering field names through tests.
- `IMPL-1.5`: wire unsupported-claim/rebuild proof only to canonical PP002 sufficiency, quarantining legacy/P44 evidence unless adapted.
- `IMPL-1.6`: add negative tests at payload/API/projection level, not only rendered text.
- `IMPL-1.7`: make advisor candidate impossible to confuse with compliance release.
- `IMPL-1.8`: require audit proof or fail-closed blocker for draft boundary mutations.
- `IMPL-1.9`: allow UI wording edits only after state labels are approved; do not use wording as runtime proof.

## Risks and Open Decisions

- Legacy/P44 draft and evidence paths are useful but must not be treated as universally accepted PP002 truth for PP003.
- Existing projection tests are strong slices, but PP003 still needs a single dictionary and API/projection-specific negative proof matrix.
- The schema already contains dedicated draft models; blind schema work would be regression, not progress.
- Human approval is still required for the exact PP003 advice-boundary policy before implementation.

## Analysis DoD

- Relevant files, flows and artefacts identified: PASS.
- Internal-only and client-safe candidate fields inventoried: PASS.
- Leakage surfaces identified: PASS.
- Specification need clarified: PASS.
- Implementation split proposed: PASS.
- Open questions and risks named: PASS.

