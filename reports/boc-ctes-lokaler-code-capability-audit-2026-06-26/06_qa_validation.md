# QA Validation And Claim Control

Ticket: `QA-1`  
Status: `DONE`  
QA decision: `PASS_WITH_LIMITATIONS`

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm guard:source` | `PASS` | Source hierarchy guard checked `AGENTS.md`, True-UX handoff files and required scripts; violations `0`. |
| `pnpm db:validate` | `PASS` | Prisma schema is valid. |
| `pnpm exec playwright test tests/schema-alignment.spec.ts tests/export-command-spine-contract.spec.ts tests/true-ux-api-service-ui-truth.spec.ts --workers=1` | `PASS` | `13/13` passed; proves 53-model schema alignment, canonical export command spine and export UI/API truth contract. |
| `git diff --check` | `PASS` | No whitespace errors after report refresh. |
| `git status --short --branch` | `PASS_WITH_EXPECTED_REPORT_DIFF` | Only the seven refreshed audit report files are modified; branch is `full-workflow` ahead of `origin/full-workflow`. |

## Spec Validation

| Acceptance criterion | Result | Evidence |
| --- | --- | --- |
| Local evidence only | `PASS` | Report relies on inspected local routes, components, API files, services, schema, tests and current guard output. |
| No stale context contamination | `PASS` | Older docs/reports were not elevated into code fact; True-UX authority was used as execution boundary. |
| Conservative complete claims | `PASS` | No broad product capability is marked `COMPLETE_VERTICAL_SLICE`; source/schema/export static-contract proof is current-run, full DB/browser vertical proof remains pending. |
| UI static separation | `PASS` | Static/held/disabled controls are separated as `UI_ONLY_STATIC` or `BLOCKED_UI_SAFETY_STATE`. |
| Schema-only separation | `PASS` | Schema breadth is reported separately from data editability and vertical-slice proof. |
| Test honesty | `PASS` | Test files are treated as local test intent unless executed in this run. |
| Safety honesty | `PASS` | Client visibility, advice, release, export and admin claims stay below complete status without current negative proof. |
| Decision readiness | `PASS` | Report has baseline options, limitations, recommendations and follow-up candidates. |

## Claim Control Notes

- `COMPLETE_VERTICAL_SLICE` is intentionally unused for broad product capabilities because full API/browser/DB vertical suites were not executed in this audit.
- `STRONG_VERTICAL_CANDIDATE` means static local UI/API/service/DB/guard/test-intent chain is strong, not that runtime proof passed.
- `/api/demo-workflow` is classified as `DEMO_COMMAND_BACKED_PARTIAL` because it is broad and action-ID-dependent.
- Export is upgraded to `STRONG_VERTICAL_CANDIDATE` for the command spine because current UI approval/download paths call `/api/export-workflow`, and export command-spine/UI-truth tests passed.
- Schema/test drift warning is resolved for this run: current schema inventory has 53 models and schema-alignment proof passed.

## Residual Risks

| Risk | Severity | Required next proof |
| --- | --- | --- |
| DB-backed suites may fail in current environment | Medium | Run focused document/profile/entity/export/journey tests against local DB. |
| Demo action IDs may be unevenly persisted/guarded | High | Inventory each action ID and classify state/guard/audit/test proof. |
| Export lifecycle still needs full vertical proof | Medium | Run direct export lifecycle API/browser tests that exercise stateful DB transitions. |
| Schema alignment may drift again later | Low | Keep `tests/schema-alignment.spec.ts` and source-reality gates in the proof pack. |
| Static action controls may remain visually product-like | Medium | Purge, wire or visibly quarantine them. |

## QA Result

The report is usable as a conservative baseline for decision-making. It is not a runtime acceptance certificate. The correct next step is human baseline acceptance plus authorization for a focused runtime proof pack or gap-fix implementation slice.
