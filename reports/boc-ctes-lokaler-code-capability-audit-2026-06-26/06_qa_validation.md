# QA Validation And Claim Control

Ticket: `QA-1`  
Status: `DONE`  
QA decision: `PASS_WITH_LIMITATIONS`

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm guard:source` | `PASS` | Moving-baseline source hierarchy guard passed before ordered execution; violations `0`. |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/demo-workflow-action-registry.spec.ts tests/capture-screen-model-context.spec.ts tests/capability-report-drift-gate.spec.ts --workers=1` | `PASS` | `12/12` passed after current QA fixes; proves capture model context, remaining demo-only boundary, typed-command family extraction and report drift rejection. |
| `pnpm gate:capability-report` | `PASS` | Checked the current capability report and inventory against the drift gate: `53` schema models, required status taxonomy present, stale complete-slice/report-truth claims rejected. |

## Defects Found During QA

| Finding | Severity | Resolution |
| --- | --- | --- |
| Stale drift-gate truth still required `DEMO_COMMAND_BACKED_PARTIAL` even after product-like families were migrated away from `/api/demo-workflow`. | High | Gate updated to require `TYPED_COMMAND_BACKED_PARTIAL` and `LEGACY_DEMO_ONLY_BOUNDARY` instead. |
| Drift gate treated negative `COMPLETE_VERTICAL_SLICE` warning lines as overclaims. | Medium | Gate wording parser now allows explicit negative/reject/fail contexts while still blocking positive broad complete-slice claims. |
| Existing QA report contained stale current-run claims for `pnpm db:validate` and a broad `28/28` Playwright pack. | High | QA report rewritten to document only commands actually run in this QA ticket or the current ordered preflight. |

## Spec Validation

| Acceptance criterion | Result | Evidence |
| --- | --- | --- |
| Local evidence only | `PASS` | Report relies on inspected local routes, components, API files, services, schema, tests, source guard output and current QA commands. |
| No stale context contamination | `PASS` | Older report prose was removed where it claimed proof not produced in this QA ticket. |
| No external web evidence | `PASS` | No web source is used as local project evidence. |
| Capability status labels match SPEC-1 | `PASS` | Capability gate requires the current taxonomy including typed-command and legacy-demo boundary language. |
| Conservative complete claims | `PASS` | Broad product capabilities are not marked `COMPLETE_VERTICAL_SLICE`; negative complete-slice warning prose is preserved as guardrail language. |
| UI static separation | `PASS` | Static/held/disabled controls remain separated as `UI_ONLY_STATIC` or `BLOCKED_UI_SAFETY_STATE`. |
| Schema-only separation | `PASS` | Schema breadth is separated from editability and runtime vertical-slice proof. |
| Test honesty | `PASS_WITH_LIMITATIONS` | Current proof covers focused drift/boundary tests and the capability gate; full DB-backed browser/API suites were not run in this QA ticket. |
| Safety honesty | `PASS` | Client visibility, advice, release, export and admin claims stay below complete status without current full lifecycle proof. |
| Decision readiness | `PASS` | Report contains limitations, overclaim warnings, recommendations and follow-up candidates. |

## Claim Control Notes

- `COMPLETE_VERTICAL_SLICE` is intentionally unused for broad product capabilities because full API/browser/DB vertical suites were not executed in this audit ticket.
- `STRONG_VERTICAL_CANDIDATE` means local UI/API/service/DB/test-intent evidence is strong, not that the full runtime lifecycle passed.
- `/api/demo-workflow` is classified as `LEGACY_DEMO_ONLY_BOUNDARY`; product-like J02/J03/J04/J05/J06/J07/J09/J10/J16/J17 flows must remain on typed command surfaces.
- The remaining demo-shaped J01 surface must either move behind a typed intake/advisor-review command boundary or be quarantined as pure screencast seed support.
- The generator/report-drift gate is current-run proof that stale model counts, stale API-route truth, stale demo status terminology and broad complete-slice claims are rejected before generated report truth is accepted.

## Residual Risks

| Risk | Severity | Required next proof |
| --- | --- | --- |
| Full DB-backed browser/API lifecycle proof was not run in this QA ticket. | Medium | Run focused document/profile/entity/export/journey lifecycle suites against local DB and browser runtime. |
| Remaining J01 command semantics can still be reintroduced through prose, generated sources or weak fallback language. | High | Type J01 as intake/advisor-review or quarantine it as screencast seed only; keep Markdown/JSON/PDF source terminology aligned to `canonical typed boundary`. |
| Static action controls may remain visually product-like. | Medium | Purge, wire or visibly quarantine them by journey family. |
| Report gates may need expansion as new route/API/schema counts change. | Medium | Keep `pnpm gate:capability-report` in future report-generation and capture-generation flows. |

## QA Result

`PASS_WITH_LIMITATIONS`: the report is usable as a conservative local capability-reality baseline and decision artifact. It is not a runtime release certificate, not a complete vertical-slice proof, and not authorization to keep `/api/demo-workflow` as a product-like shadow API.
