# P0 Test Rebase Current

Status: CURRENT_REBASE_APPLIED
Date: 2026-06-23
Operative authority: ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md
Companion source: /Users/chris/Downloads/ALPHAVEST_V1_0_DETAILED_IMPLEMENTATION_TASK_DESCRIPTIONS.md

## Repository Reality

| Item | Current value | Note |
|---|---:|---|
| Playwright spec files | 78 | Current repo reality; the external V1.0 task text still references an older 51-spec baseline. |
| API route files | 15 | Verified through `p0ApiRouteUniverse` and `tests/p0-acceptance.spec.ts`. |
| Registered routes | 71 | Locked by `lib/route-registry.ts`. |
| MVP routes | 31 | Current True-UX route workset. |
| MVP support routes | 25 | Current True-UX route workset. |
| P1 after MVP routes | 5 | Registered-only; no MVP implementation claim. |
| Reference-only routes | 3 | Registered-only; no product task. |
| Hold-pending-decision routes | 7 | Registered-only until explicit unlock. |

## P0 Gate Coverage

| Gate | Status | Positive proof | Negative proof / blocker |
|---|---|---|---|
| Mapped user / tenant / role | ALREADY_PRESENT | `tests/providerless-scope.spec.ts`; `tests/control-layer-actor-scope.spec.ts` | wrong tenant and wrong role deny without row leakage |
| Route / action / object / payload separation | ALREADY_PRESENT | `tests/p0-acceptance.spec.ts`; `tests/permission-engine.spec.ts` | registered-only P1/reference/hold routes cannot become MVP shells |
| Evidence upload lifecycle | ALREADY_PRESENT | `tests/document-upload-api.spec.ts`; `tests/evidence-review-api.spec.ts` | upload success is not sufficiency, release or export proof |
| AI draft internal-only | ALREADY_PRESENT | `tests/client-visibility-projection.spec.ts`; `tests/p0-acceptance.spec.ts` | AI draft, internal rationale, assumptions and compliance notes stay out of client/export payloads |
| Advisor approval versus compliance release | ALREADY_PRESENT | `tests/recommendation-review-workflow-validation.spec.ts`; `tests/recommendation-review-workflow-api.spec.ts` | advisor approval remains compliance-pending, not client-visible release |
| Client-safe projection | ALREADY_PRESENT | `tests/client-visibility-projection.spec.ts`; `tests/true-ux-client-projection.spec.ts` | unreleased/internal payloads fail closed for client roles |
| Audit persistence fail-closed | ALREADY_PRESENT | `tests/audit-fail-closed.spec.ts`; `tests/phase6-audit-persistence.spec.ts` | audit-unavailable export/release gates block advancement |
| Export redaction / approval package | ALREADY_PRESENT | `tests/export-safety.spec.ts`; `tests/file-export-realism.spec.ts` | missing approval, missing redaction profile and forbidden payloads block generation |
| UI no-overclaim feedback | ALREADY_PRESENT | `tests/ui-state-boundaries.spec.ts`; lifecycle tests | upload/display/release/export copy cannot claim downstream completion without gate proof |
| API safe error envelopes | ALREADY_PRESENT | `tests/fail-closed-error-envelope.spec.ts`; `tests/p0-api-contract.spec.ts` | extra fields cannot override no-mutation/no-release safety metadata |
| Schema alignment | ALREADY_PRESENT | `tests/schema-alignment.spec.ts`; `pnpm db:validate` | no blind migration or V1 patch-only model required |
| P0 acceptance proof package | CURRENT_REBASE_APPLIED | `tests/p0-acceptance.spec.ts`; `lib/p0-acceptance-proof.ts` | explicit blockers remain for P1, Hold and Reference-only surfaces |

## Acceptance Commands

Minimum reproducible V1.0 P0 command sequence:

```bash
pnpm test:v1-p0
pnpm phase:check
```

Expanded supporting commands used across the preceding work packages:

```bash
pnpm test:providerless-scope
pnpm test:permissions
pnpm test:workflow-gate
pnpm test:workflow-api
pnpm test:document-upload-api
pnpm test:client-visibility
pnpm test:export-safety
pnpm test:fail-closed-error-envelope
pnpm test:route-smoke
pnpm db:validate
pnpm phase:check
```

Manual visual inspection is not a replacement for these P0 tests. Screenshots can support UI review, but they do not prove safety gates, tenant scope, redaction, audit persistence or export authorization.

## Overclaim Controls

- P1 routes `052`, `053`, `059`, `060` and `068` remain `P1_AFTER_MVP` and `REGISTERED_ONLY`.
- Reference routes `061`, `062` and `063` remain `REFERENCE_ONLY` and `REGISTERED_ONLY`.
- Held routes `064`, `065`, `066`, `067`, `069`, `070` and `071` remain `HOLD_PENDING_DECISION` and `REGISTERED_ONLY`.
- P0 mapped journeys are limited to `MJ-001`, `MJ-002`, `MJ-003`, `MJ-005`, `MJ-006`, `MJ-010` and `MJ-012`.
- `MJ-004`, `MJ-007`, `MJ-008`, `MJ-009` and `MJ-011` remain explicit blockers, not accepted V1.0 scope.

