# Human Decision Gate

Ticket: `DECISION-1`
Status: `ACCEPTED_WITH_LIMITATIONS_AND_CLEANUP_AUTHORIZATION`
Decision source: refreshed local capability audit run on 2026-06-26; human baseline acceptance recorded after QA.
QA decision: `PASS_WITH_LIMITATIONS`
Codex recommendation: `ACCEPT_WITH_LIMITATIONS_AND_AUTHORIZE_TYPED_BOUNDARY_PROOF_PLUS_CLEANUP`
Human decision: `ACCEPT_WITH_LIMITATIONS_AND_CLEANUP_AUTHORIZATION`

## Decision Recorded

The local capability report has been accepted with limitations and cleanup authorization. The current QA result remains `PASS_WITH_LIMITATIONS`: the report is evidence-bound, source-only, reproducible from local artefacts and protected by the capability report drift gate.

This baseline is not a release certificate and not a full runtime vertical-slice proof. The current proof is deliberately narrower:

- `pnpm guard:source` passed before ordered execution.
- The focused Playwright proof pack passed `12/12` for capture model context, typed workflow action boundaries and capability report drift rejection.
- `pnpm gate:capability-report` passed against the current `53`-model schema truth and required report taxonomy.
- Full DB-backed browser/API lifecycle proof was not run in `QA-1`.

## Baseline Options

| Option | Meaning | Codex recommendation |
| --- | --- | --- |
| `Accept` | Accept the report as the current conservative code-reality baseline. | Usable, but too weak alone because it can let follow-up work drift into soft language. |
| `Accept with Limitations + Cleanup Authorization` | Accept the baseline exactly as conservative truth, preserve its limits, and authorize the next proof/cleanup slice. | Strong recommendation. This creates a working baseline without pretending it is runtime certification. |
| `Accept with Corrections` | Accept baseline after named wording or evidence corrections. | Good only if you see a concrete source/evidence error. |
| `Rework` | Send report back for more static analysis before follow-up. | Not recommended; the bottleneck is runtime proof and legacy removal, not more inventory. |
| `Reject` | Do not use the report as baseline. | Not recommended unless a named local evidence error is found. |

## Recommended Decision

Choose `Accept with Limitations + Cleanup Authorization`.

The next move should be wide-reaching rather than cosmetic:

1. Make the capability report drift gate mandatory for future capture/report generation so stale model counts, stale API-route counts and broad `COMPLETE_VERTICAL_SLICE` language cannot re-enter generated truth.
2. Run a focused browser/runtime proof pack for export, tenant governance and platform admin typed command surfaces.
3. Cut the remaining J01 ambiguity: build a typed intake/advisor-review command boundary or quarantine J01 as pure screencast seed support.
4. Keep J02/J03 behind a clean Advice/Release-History command boundary; do not stabilize them as typed-command product behavior.
5. Remove `runScreencastDemoAction` from product-like screens once the last typed command boundary is in place, instead of maintaining any generic workflow route as a product command bus.
6. Purge, wire or visibly safety-block static controls that still look like real product actions.

This is the cleanest route because it treats `/api/recommendation-review-workflow` as retired generic infrastructure, not as a convenient half-product command bus.

## Follow-Up Authorization State

| Follow-up | Current status | Needs human authorization? |
| --- | --- | --- |
| Accept local report baseline with explicit QA limitations | Accepted | Authorized |
| Browser/runtime proof pack for export, tenant governance and platform admin | Ready to derive | Authorized |
| J01 typed intake/advisor-review boundary or screencast-seed quarantine | Ready to derive | Authorized |
| Advice/Release-History typed command boundary for J02/J03 | Ready to derive after J01/boundary inspection | Authorized |
| Removal of `runScreencastDemoAction` from product-like screens | Ready after typed boundaries are complete | Authorized |
| Static affordance purge/wire/safety-block pass | Ready to derive | Authorized |

## Execution Control

The human decision is recorded. Follow-up work may proceed one ticket at a time, preserving the QA limitations: no `COMPLETE_VERTICAL_SLICE` claim without full UI/API/service/DB/security/test proof, and no use of `/api/recommendation-review-workflow` as product-like command infrastructure.

Recorded human response:

```text
Decision = Accept with Limitations + Cleanup Authorization
Authorize proof pack = Yes
Authorize J01 typed boundary/quarantine = Yes
Authorize Advice/Release-History typed boundary for J02/J03 = Yes
Authorize removal of product-like runScreencastDemoAction usage = Yes
```
