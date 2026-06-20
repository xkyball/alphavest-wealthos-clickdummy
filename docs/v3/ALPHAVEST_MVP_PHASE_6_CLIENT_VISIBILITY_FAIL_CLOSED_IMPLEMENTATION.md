# AlphaVest MVP Phase 6 Client Visibility Fail-Closed Implementation

Date: 2026-06-20
Phase source: `mega_journeys_1/ALPHAVEST_MVP_JOURNEY_IMPLEMENTATION_PLAN.md`
Phase: `6 - Client Visibility Fail-Closed Projection`
Execution status: `PHASE_6_COMPLETED_AS_IMPLEMENTATION`

## Scope

Implemented Phase 6 as a bounded service/API/test proof. Client-safe projections are now derived from visibility, release and redaction rules. Client roles fail closed for unreleased/internal document payloads, recommendation payloads and export inputs. Internal roles retain operational metadata where allowed.

No UI, route composition, schema migration, generated visual, screenshot or ImageGen work was performed.

## Capability Position

| Capability | Current level | Target level reached | Non-claim boundary |
| --- | ---: | ---: | --- |
| Recommendation client-safe projection | E6 candidate | E6 tested | Not production auth and not client acceptance. |
| Document/evidence client projection | E4/E5 candidate | E6 tested | No production document entitlement engine added. |
| Export input alignment | E5/E6 candidate | E6 tested | Export package remains metadata/control oriented, not binary E7. |
| Portal/mobile fail-closed semantics | E2/E5 candidate | E6 API/service proof | No UI screenshot acceptance claimed. |

## Implemented Changes

- Added document projection to `lib/visibility-engine.ts`, including `CLIENT_SAFE`, `NO_AVAILABLE_CONTENT`, `PERMISSION_DENIED` and `INTERNAL_PROJECTION` states.
- Made `/api/documents` role-aware with `roleKey`; default remains internal analyst projection for existing operational reloads.
- Made uploaded document listing pass through the visibility projection before API response.
- Added export projection alignment in `lib/export-service.ts` so only visible client-safe payloads can be used as export input.
- Extended client visibility tests for document projection and export projection.
- Extended document API tests for principal-role fail-closed and released-safe document payloads.

## Phase 6 Task Closure

| Task | Implementation result |
| --- | --- |
| `AV-MVP-P6-T001` | Implemented and tested. Recommendation projection allowlist exposes only `clientSummary` to client roles after release. |
| `AV-MVP-P6-T002` | Implemented and tested at API/service level. Client document views return fail-closed states before release. |
| `AV-MVP-P6-T003` | Implemented and tested. Document/evidence operational fields are hidden from client role payloads. |
| `AV-MVP-P6-T004` | Implemented and tested. Export input helper rejects invisible or forbidden projection payloads. |
| `AV-MVP-P6-T005` | Implemented and tested through focused client visibility, document API and export tests. |

## Tests Run

| Command | Result |
| --- | --- |
| `pnpm typecheck` | Passed. |
| `pnpm exec playwright test tests/client-visibility-proof.spec.ts tests/document-upload-api.spec.ts tests/file-export-realism.spec.ts` | Passed, 21 tests. |

## Exit Gate Decision

`PHASE_6_EXIT_PASSED_WITH_IMPLEMENTATION_PROOF_AND_LIMITATIONS`

Client roles now receive only released/redacted summaries or explicit fail-closed states. Internal fields such as storage keys, checksums, extraction state, internal rationale, compliance notes and unreleased evidence stay out of client/export payloads. This phase does not claim production auth, full UI screenshot acceptance, binary export generation, client acceptance or full P0 closure.
