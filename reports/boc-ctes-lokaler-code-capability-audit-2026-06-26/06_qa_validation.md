# QA Validation And Claim Control

Ticket: `QA-1`  
Status: `DONE`  
QA decision: `PASS_WITH_LIMITATIONS`

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm guard:source` | `PASS` | Source hierarchy guard checked `AGENTS.md`, True-UX handoff files and required scripts; violations `0`. |
| `git diff --check` | `PASS` | No whitespace or patch-format issues reported. |
| `git status --short` | `PASS` | Report package changes are visible as new/modified report files only. |

## Spec Validation

| Acceptance criterion | Result | Evidence |
| --- | --- | --- |
| Local evidence only | `PASS` | Report relies on inspected local routes, components, API files, services, schema, tests and current guard output. |
| No stale context contamination | `PASS` | Older docs/reports were not elevated into code fact; True-UX authority was used as execution boundary. |
| Conservative complete claims | `PASS` | No product capability is marked `COMPLETE_VERTICAL_SLICE`; only source guard has current-run runtime proof. |
| UI static separation | `PASS` | Static/held/disabled controls are separated as `UI_ONLY_STATIC` or `BLOCKED_UI_SAFETY_STATE`. |
| Schema-only separation | `PASS` | Schema breadth is reported separately from data editability and vertical-slice proof. |
| Test honesty | `PASS` | Test files are treated as local test intent unless executed in this run. |
| Safety honesty | `PASS` | Client visibility, advice, release, export and admin claims stay below complete status without current negative proof. |
| Decision readiness | `PASS` | Report has baseline options, limitations, recommendations and follow-up candidates. |

## Claim Control Notes

- `COMPLETE_VERTICAL_SLICE` is intentionally unused for product capabilities because focused API/browser/DB suites were not executed in this audit.
- `STRONG_VERTICAL_CANDIDATE` means static local UI/API/service/DB/guard/test-intent chain is strong, not that runtime proof passed.
- `/api/demo-workflow` is classified as `DEMO_COMMAND_BACKED_PARTIAL` because it is broad and action-ID-dependent.
- Export remains `API_BACKED_PARTIAL` because service/API evidence is strong but inspected UI binding appears mixed with demo action paths.
- Schema/test drift remains a warning: current static schema inventory observed 49 models, while historical test expectation text references 53.

## Residual Risks

| Risk | Severity | Required next proof |
| --- | --- | --- |
| DB-backed suites may fail in current environment | Medium | Run focused document/profile/entity/export/journey tests against local DB. |
| Demo action IDs may be unevenly persisted/guarded | High | Inventory each action ID and classify state/guard/audit/test proof. |
| Export UI may still depend on demo actions | High | Runtime proof or direct rewire to `/api/export-workflow`. |
| Schema alignment stale expectation may mask drift | Medium | Run/update schema alignment suite after deciding 49 vs 53 model truth. |
| Static action controls may remain visually product-like | Medium | Purge, wire or visibly quarantine them. |

## QA Result

The report is usable as a conservative baseline for decision-making. It is not a runtime acceptance certificate. The correct next step is human baseline acceptance plus authorization for a focused runtime proof pack or gap-fix implementation slice.
