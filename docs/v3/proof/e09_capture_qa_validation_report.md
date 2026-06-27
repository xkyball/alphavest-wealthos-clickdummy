# E09 Capture QA Validation Report

Epic: E09 - Screenshot Capture QA and Regression Automation
Baseline: `fd0e3c3 feat: implement e08 visual density accessibility`
Branch: `full-workflow`

## Implemented Tickets

| Ticket | Result |
| --- | --- |
| E09-A1 | Current capture scripts and artifact structure analysed in `docs/ux/ALPHAVEST_E09_CAPTURE_QA_AUDIT.md`. |
| E09-S1 | Capture QA rules specified in `docs/ux/ALPHAVEST_E09_CAPTURE_QA_SPEC.md`. |
| E09-I1 | `scripts/capture-qa-contract.ts` validates existing capture naming and metadata offline and is wired into capture scripts. |
| E09-I2 | Duplicate-state and long-screen QA checks are implemented in the capture QA contract and markdown/JSON reports. |
| E09-I3 | `scripts/ux-qa-signoff-report.ts` generates `docs/v3/proof/e09_capture_qa_signoff_checklist.md`. |
| E09-Q1 | Validation completed without generating new screens or visual assets. |

## Validation Commands

| Command | Result |
| --- | --- |
| `./node_modules/.bin/tsx scripts/source-target-guard.ts` | PASS, violations 0 |
| `./node_modules/.bin/tsc --noEmit` | PASS |
| `./node_modules/.bin/playwright test tests/capture-qa-contract.spec.ts tests/ux-qa-signoff-report.spec.ts tests/capture-routes-and-modals-contract.spec.ts --workers=1` | PASS, 9 tests |
| `CAPTURE_QA_INPUT=artifacts/routes-and-modals CAPTURE_QA_OUTPUT=artifacts/capture-qa/e09-validation ./node_modules/.bin/tsx scripts/capture-qa-contract.ts` | PASS with warning status |
| `./node_modules/.bin/eslint .` | PASS, 0 errors, 22 remaining pre-existing warnings outside E09 plus one pre-existing unused helper in `capture-routes-and-modals.ts` |

## Offline Capture QA Result

Input: `artifacts/routes-and-modals`
Output: `artifacts/capture-qa/e09-validation`

| Metric | Count |
| --- | ---: |
| Manifests | 15 |
| Captures | 809 |
| Failures | 0 |
| Warnings | 3007 |
| Duplicate clusters | 0 |
| Long-screen risks | 557 |

The warning result is expected for legacy capture bundles. Older manifests lack the E04/E09 capture variant metadata now required by the contract. The gate reports this truth without hard-failing unless `CAPTURE_QA_FAIL_ON_WARNINGS=1` is enabled.

## Acceptance Result

Positive:

- Existing captures can be checked without generating new screens.
- Missing/ambiguous metadata is reported.
- Duplicate-state grouping runs.
- Long-screen risk reporting runs.
- UX QA sign-off checklist covers E01-E08.
- Capture QA scripts write repeatable JSON and Markdown reports.

Negative / Truth Reconciliation:

- Legacy capture bundles are not E09-clean. They should be treated as historical evidence, not release-grade primary proof.
- Long-screen risk is now visibly high in old route/modal capture sets.
- The strict visual capture script now emits scroll-height and viewport metrics for future stronger long-screen checks, but old strict visual outputs may not have those fields.

## Recommendation

Use `CAPTURE_QA_FAIL_ON_WARNINGS=1` for new release-candidate capture folders only after one clean E09-compliant capture run has been produced. Do not retrofit old bundles just to silence warnings; archive them as legacy evidence and make the next capture run the new baseline.
