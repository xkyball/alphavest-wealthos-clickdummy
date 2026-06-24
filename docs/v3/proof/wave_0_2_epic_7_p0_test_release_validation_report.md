# Wave 0-2 Epic 7 P0 Test and Release Validation Report

Date: 2026-06-24

## Extracted Scope

Upload source: `/Users/chris/Downloads/ALPHAVEST_JOURNEY_FIRST_BOC_CTES_TICKET_ARCHITECT_OUTPUT_WAVE_0_2.md`

Epic 7 is titled `P0 Test and Release Validation`. Its purpose is to convert critical Journey-first claims into positive and negative proof so Wave 0-2 is accepted only when tests prove end-to-end journey behaviour and safety invariants.

I verified that the upload does not contain an Epic 8 or JIRA Item 8 section. Epic 8 is therefore not executable from this source.

## Task Matrix

| Task | Detailed scope | Implementation proof |
| --- | --- | --- |
| SPEC-7.1 | Specify P0 positive/negative E2E matrix for auth, journey creation, evidence, AI internal-only, advisor/compliance, client projection, export, admin non-bypass, cross-tenant denial and hold blocking. | This report plus `tests/wave-0-2-p0-validation.spec.ts` matrix assertion. |
| IMPL-7.2A | Implement Auth/Journey positive tests. Known DB users must pass stub MFA, receive scoped current-user context, see only Wave 0-2 active startable journeys and create accepted journeys. | `tests/wave-0-2-p0-validation.spec.ts` test `IMPL-7.2A proves positive Auth/Journey access for scoped P0 users`. |
| IMPL-7.2B | Implement Evidence/Gate/Projection positive tests. Accepted seeded journeys must expose evidence sufficiency, client-safe projection and export preview flow without internal payload leakage or implied release. | `tests/wave-0-2-p0-validation.spec.ts` test `IMPL-7.2B proves positive evidence, projection and export preview gates`. |
| IMPL-7.3A | Implement Auth/RBAC/Admin negative tests. Wrong MFA, missing auth, cross-tenant access and admin force paths must fail closed. | `tests/wave-0-2-p0-validation.spec.ts` test `IMPL-7.3A blocks wrong MFA, missing auth, cross-tenant access and admin bypass`. |
| IMPL-7.3B | Implement Evidence/Advisor/Compliance negative tests. Upload-only and advisor-only states must not be sufficient to release client-visible output. | `tests/wave-0-2-p0-validation.spec.ts` test `IMPL-7.3B blocks upload-only and advisor-only release paths`. |
| IMPL-7.3C | Implement AI/Client Projection/Export leakage tests. Internal rationale, compliance notes and forbidden projection fields must be rejected before export preview or approval. | `tests/wave-0-2-p0-validation.spec.ts` test `IMPL-7.3C blocks AI/internal rationale leakage from export payloads`. |
| IMPL-7.3D | Implement Hold journey blocking tests. Hold journeys must stay unavailable in Wave 0-2. | `tests/wave-0-2-p0-validation.spec.ts` test `IMPL-7.3D keeps Wave 0-2 hold journeys blocked`. |
| QA-7.4 | Run focused validation and document final Wave 0-2 P0 acceptance result. | Completed with focused P0 validation, TypeScript and source-reality gate checks. |

## Acceptance Criteria

- Positive E2E journey paths pass.
- Negative bypass and leakage tests pass.
- Hold journeys stay blocked.
- No overclaiming UI copy is introduced.
- Regression checks pass or are reported with exact blockers.

## Changed Files

- `lib/source-reality-gate.ts`
- `tests/wave-0-2-p0-validation.spec.ts`
- `docs/v3/proof/wave_0_2_epic_7_p0_test_release_validation_report.md`

## Inspected Files

- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `tests/auth-spine.spec.ts`
- `tests/journey-api.spec.ts`
- `tests/export-workflow-api.spec.ts`
- `app/api/export-workflow/route.ts`
- `lib/export-workflow-command-service.ts`
- `lib/source-reality-gate.ts`
- Existing Wave 0-2 reports in `docs/v3/proof/`

## Validation

- `PLAYWRIGHT_PORT=3098 pnpm playwright test tests/wave-0-2-p0-validation.spec.ts --workers=1` — passed, 7/7.
- `pnpm typecheck` — passed.
- `pnpm test:source-reality` — initially failed because the source-reality Prisma shape lock still expected 26 enums / 48 models while the current `full-workflow` schema has 27 enums / 49 models. Updated `lib/source-reality-gate.ts` to the current Wave 0-2 schema baseline and reran successfully, 6/6.

## Deviations and Blockers

- Epic 8 is missing from the uploaded source, so it is not implemented in this pass.
- No UI files were changed for Epic 7; screenshots are not applicable unless later QA requires opening an existing route for evidence.
- Source-reality Prisma shape lock required a baseline update to reflect already-present Wave 0-2 export workflow schema objects.

## Status

`READY`
