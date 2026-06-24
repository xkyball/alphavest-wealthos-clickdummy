# AlphaVest Journey-first Run 1 + Run 2 As-built Evidence Pack

Date: 2026-06-24

Source upload: `/Users/chris/Downloads/ALPHAVEST_JOURNEY_FIRST_RUN2_BOC_CTES_TICKET_ARCHITECT_OUTPUT (1).md`

Operative repo source of truth: `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`

## Status

`RUN2_EPIC_5_COMPLETED_WITH_FOCUSED_P0_PROOF`

This evidence pack maps the implemented Run 1 + Run 2 Journey-first state to EPIC 5: `P0 Test Expansion and Final Validation`. It reports the tested state honestly and does not add new product scope.

## Extracted EPIC 5

Purpose: convert Run 2 hardening into objective, repeatable proof.

Goal: provide positive and negative tests covering auth/session, journey gates, evidence, client projection, export, data quality, hold routes, UI states and no-overclaim feedback.

Child tasks:

| Task | Title | As-built status |
| --- | --- | --- |
| `RUN2-T1.1` | Auth/session/tenant/admin-bypass negative tests | Completed |
| `RUN2-T1.2` | Journey gate/evidence/advisor/compliance tests | Completed |
| `RUN2-T1.3` | Client projection/export/data-quality/hold-route tests | Completed |
| `RUN2-T1.4` | UI state/microcopy/responsive regression tests | Completed |
| `RUN2-Q3` | Final Wave 0-2 + Run 2 regression review | Completed |
| `RUN2-D1` | Create as-built JIRA/Codex evidence pack | Completed |

## Test Evidence Matrix

| EPIC 5 item | Primary proof | Coverage |
| --- | --- | --- |
| `RUN2-T1.1` | `tests/auth-spine.spec.ts` | DB-user provider, unknown-user denial, valid MFA, invalid MFA, current-user scoping, missing/invalid auth fail-closed behavior |
| `RUN2-T1.1` | `tests/journey-api.spec.ts` | Cross-tenant denial and admin non-bypass for journey gates |
| `RUN2-T1.1` | `tests/wave-0-2-p0-validation.spec.ts` | Consolidated P0 proof rows for auth/session/scope/admin |
| `RUN2-T1.2` | `tests/journey-api.spec.ts` | Evidence link, explicit sufficiency, AI internal-only draft, advisor approval, compliance release, wrong phrase denial, upload-only/advisor-only negative cases |
| `RUN2-T1.2` | `tests/wave-0-2-p0-validation.spec.ts` | Consolidated gate-order positive and negative proof rows |
| `RUN2-T1.3` | `tests/journey-api.spec.ts` | Client projection no-leakage and hold journey denial |
| `RUN2-T1.3` | `tests/export-workflow-api.spec.ts` | Export redaction, forbidden internal payload denial, data-quality export approval blocker |
| `RUN2-T1.3` | `tests/run2-safety-boundary.spec.ts` | Journey release and projection blocked by high-severity data-quality issues |
| `RUN2-T1.3` | `tests/wave-0-2-p0-validation.spec.ts` | Consolidated projection/export/hold proof rows |
| `RUN2-T1.4` | `tests/journey-ui.spec.ts` | Dashboard list states, hold copy, no-overclaim command copy, permission-denied actions, mobile sticky action, screenshot refresh |
| `RUN2-Q3` | Focused validation command | `28/28` Playwright tests passed plus TypeScript passed |
| `RUN2-D1` | This file and `docs/v3/proof/run2_epic_5_p0_test_expansion_final_validation_report.md` | As-built closure and limitations |

## Validation Run

Passed:

```bash
pnpm typecheck
PLAYWRIGHT_PORT=3115 pnpm playwright test tests/auth-spine.spec.ts tests/journey-api.spec.ts tests/run2-safety-boundary.spec.ts tests/export-workflow-api.spec.ts tests/journey-ui.spec.ts tests/wave-0-2-p0-validation.spec.ts --workers=1
```

Result: `28 passed`.

## Screenshot Evidence

The EPIC 5 UI regression pass refreshed the existing Journey screenshot proof:

- `artifacts/screenshots/wave02-journey-dashboard.png`
- `artifacts/screenshots/wave02-journey-detail.png`
- `artifacts/screenshots/wave02-journey-detail-mobile.png`

## Hold Lock Confirmation

`MJ-004` and `MJ-007` remain blocked for productive creation. The implemented tests assert `journey_not_executable` and `mutated: false`.

No hold lifecycle implementation was added.

## API Authorization Note

The tested auth spine uses the demo DB-user JWT provider with stub MFA code `123456`. This remains explicitly non-production IdP behavior. The test scope proves fail-closed current-user scoping and Run2 safety boundaries, not a production authentication launch.

## Known Limitations

- Production IdP, production MFA and external integrations remain out of scope.
- Performance, load and penetration testing remain out of EPIC 5 scope.
- Existing runtime warnings about `NO_COLOR` and custom Babel configuration appeared during Playwright validation and did not fail the test run.
- The evidence pack is based on focused EPIC 5 validation, not an all-tests full-suite run.

## Next Inputs

- Use this pack as the Run 2 P0 proof baseline for future Wave 3/P1 planning.
- Keep hold-route activation behind a separate explicit scope unlock and route-evolution record.
- Keep client-visible output changes covered by projection/export redaction and no-leakage negative tests.
