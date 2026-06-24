# Run 2 Epic 1-2 Evidence and Safety Hardening Report

Date: 2026-06-24

Upload source: `/Users/chris/Downloads/ALPHAVEST_JOURNEY_FIRST_RUN2_BOC_CTES_TICKET_ARCHITECT_OUTPUT_v2_CLEAN_JIRA_READY.md`

## Extracted Scope

### RUN2-E1 — Post-Implementation Evidence and Residual Gap Discovery

Purpose: establish exact evidence for what Run 1 delivered before hardening starts.

Child tasks:
- `RUN2-A1`: validate Run 1 implementation against Decision Lock and E2E promise.
- `RUN2-A2`: build recommendation-to-implementation traceability matrix.
- `RUN2-S1`: specify residual gap closure boundaries and acceptance criteria.

Out of scope:
- Code changes during analysis/spec tasks.
- Hold unlock.
- New product scope.

### RUN2-E2 — Safety and Trust Boundary Hardening

Purpose: harden the safety boundaries that make the Journey-first app trustworthy after Run 1.

Child tasks:
- `RUN2-I1`: harden client-safe projection as explicit boundary.
- `RUN2-I2`: harden tenant isolation and admin non-bypass.
- `RUN2-I3`: harden data-quality release/export/client-visibility blocker.
- `RUN2-I4`: harden hold route blocking for `MJ-004` and `MJ-007`.

Out of scope:
- Committee lifecycle.
- KYC/SoW/Suitability/IPS lifecycle.
- Production external systems.

## RUN2-A1 Findings Matrix

| Area | Evidence inspected | Classification | Finding |
| --- | --- | --- | --- |
| Auth/session | `tests/auth-spine.spec.ts`, `tests/wave-0-2-p0-validation.spec.ts`, `/api/current-user` flow | Implemented | DB-user JWT plus stub MFA exists; missing/invalid JWT and wrong MFA fail closed. |
| Tenant isolation | `lib/journeys/journey-api-service.ts`, `tests/journey-api.spec.ts`, `tests/wave-0-2-p0-validation.spec.ts` | Implemented | `loadScopedJourneyInstance` and `scopedTenantWhere` deny cross-tenant reads/actions. |
| Admin non-bypass | `lib/journeys/journey-api-service.ts`, `tests/journey-api.spec.ts`, `tests/wave-0-2-p0-validation.spec.ts` | Implemented | Admin/security roles are denied for operational journey gates. |
| Client-safe projection | `lib/visibility-engine.ts`, `lib/journeys/journey-orchestrator.ts`, `tests/true-ux-client-projection.spec.ts`, `tests/wave-0-2-p0-validation.spec.ts` | Partial | Existing projection strips internal fields; residual gap is explicit target-scoped data-quality blocking for journey client projection. |
| Export safety | `lib/export-workflow-command-service.ts`, `lib/export-service.ts`, `tests/export-workflow-api.spec.ts` | Implemented | Export scope, redaction, forbidden field checks and high-severity data-quality blocker for export commands exist. |
| Data-quality release blocker | `lib/data-quality-service.ts`, `lib/workflow-gate.ts`, `lib/journeys/journey-api-service.ts` | Partial | Export and workflow helper use data-quality gates, but journey `COMPLIANCE_RELEASE` and journey client projection do not yet consult a journey-scoped data-quality gate. |
| Hold journeys/routes | `lib/source-lock/wave0-2-source-lock.ts`, `lib/journeys/journey-registry.ts`, `tests/journey-spine.spec.ts`, `tests/wave-0-2-p0-validation.spec.ts` | Implemented | `MJ-004` and `MJ-007` remain hold-locked and unavailable for API creation. |
| UI state | `components/journeys/*`, `tests/journey-ui.spec.ts` | Inspectable with local WIP | Existing unstaged local edits rename Journey UI copy to Client Work/Work Dashboard. Not required for Epic 1-2 safety hardening and left unstaged by this pass. |

## RUN2-A2 Recommendation Traceability Matrix

| Recommendation cluster | Run 1/2 evidence | Status | Owner item |
| --- | --- | --- | --- |
| Client projection no leakage | Projection/export tests assert no `internalRationale`, `objectLinks`, `evidenceRequirements` or `complianceNotes` in client payloads. | Partial | `RUN2-I1` extends this to data-quality-blocked projection. |
| Tenant isolation | Cross-tenant evidence sufficiency API test returns `SCOPE_DENIED`. | Covered | `RUN2-I2` receives proof-only coverage. |
| Admin non-bypass | Admin sufficiency/release attempts return `admin_non_bypass`. | Covered | `RUN2-I2` receives proof-only coverage. |
| Data-quality blocker | Export workflow blocks approval when high-severity DQ exists; journey release/projection gap remains. | Needs Run 2 task | `RUN2-I3`. |
| Hold route/journey lock | Registry/source lock/API tests keep `MJ-004` and `MJ-007` blocked. | Covered | `RUN2-I4` receives proof-only coverage. |
| No new product scope | Upload and True-UX handoff forbid hold unlock, new lifecycle scope and production IdP. | Covered | `RUN2-S1` boundary. |

## RUN2-S1 Residual Boundary Specification

Allowed implementation:
- Add a journey-scoped data-quality release gate to `COMPLIANCE_RELEASE`.
- Add a journey-scoped data-quality client-projection fail-closed state.
- Add or update targeted tests proving the blocker.
- Keep export, tenant, admin and hold logic within existing service/test seams.

Forbidden implementation:
- No hold unlock for `MJ-004` or `MJ-007`.
- No production IdP.
- No external integrations.
- No new advice content or route/product lifecycle expansion.
- No UI copy churn beyond existing local WIP unless directly required by safety evidence.

Acceptance criteria:
- `RUN2-I1`: client projection fails closed when a high-severity open `DataQualityIssue` targets the journey.
- `RUN2-I2`: existing cross-tenant/admin negative tests remain green.
- `RUN2-I3`: `COMPLIANCE_RELEASE` fails closed when a high-severity open `DataQualityIssue` targets the journey; export DQ blocker remains green.
- `RUN2-I4`: `MJ-004` and `MJ-007` remain hold-locked and API-denied.
- Validation must include focused P0/API tests and source-reality/type checks.

## Task Status

| Task | Status | Evidence |
| --- | --- | --- |
| `RUN2-A1` | Completed | Findings matrix above. |
| `RUN2-A2` | Completed | Traceability matrix above. |
| `RUN2-S1` | Completed | Residual boundary specification above. |
| `RUN2-I1` | Completed | `tests/run2-safety-boundary.spec.ts` proves released journey client projection fails closed when target-scoped high-severity data-quality issues appear. |
| `RUN2-I2` | Completed | `tests/wave-0-2-p0-validation.spec.ts` and `tests/journey-api.spec.ts` revalidated tenant isolation and admin non-bypass. |
| `RUN2-I3` | Completed | `tests/run2-safety-boundary.spec.ts` proves `COMPLIANCE_RELEASE` blocks on target-scoped high-severity data-quality issues; `tests/export-workflow-api.spec.ts` revalidated export DQ blocking. |
| `RUN2-I4` | Completed | `tests/wave-0-2-p0-validation.spec.ts` and existing source lock proof keep `MJ-004` and `MJ-007` blocked. |

## Validation

- `PLAYWRIGHT_PORT=3101 pnpm playwright test tests/run2-safety-boundary.spec.ts --workers=1` — passed, 2/2.
- `PLAYWRIGHT_PORT=3102 pnpm playwright test tests/wave-0-2-p0-validation.spec.ts --workers=1` — passed, 7/7.
- `pnpm typecheck` — passed.
- `pnpm test:source-reality` — passed, 6/6.
- `PLAYWRIGHT_PORT=3103 pnpm playwright test tests/journey-api.spec.ts --workers=1` — passed, 8/8.
- `PLAYWRIGHT_PORT=3104 pnpm playwright test tests/export-workflow-api.spec.ts --workers=1` — passed, 4/4 after rerunning sequentially because the first parallel attempt collided with another Next dev server.

## Notes

- The five pre-existing unstaged UI/guidance/test edits were inspected and left out of the safety-hardening delta unless later validation proves they are required.
- No UI files were changed by this Run2 Epic 1-2 pass; screenshots are not applicable for this scoped commit.
