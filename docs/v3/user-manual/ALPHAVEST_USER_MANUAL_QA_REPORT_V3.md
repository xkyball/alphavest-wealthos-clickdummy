# AlphaVest User Manual QA Report V3

## Verdict

The English user manual package was generated from the current `docs/v3/user-manual-source/` package and repository source-of-truth files. It is task-led, UI-led, screenshot-supported, and conservative about demo/prototype boundaries.

## Source Package Counts

| Source Item | Count |
| --- | ---: |
| Manual tasks | 14 |
| Workflow crosswalk records | 14 |
| Procedure source cards | 14 |
| Step records | 66 |
| Screenshot register entries | 91 |
| Successful live screenshots used | 14 |
| Field/input references | 19 |
| Roles | 22 |
| Branch/troubleshooting records | 28 |
| Proof paths | 10 |
| Limitations | 3 |

## Online Research Baseline

The editorial rules were checked against current online guidance:

- Microsoft Style Guide: procedures should be clear and consistent, and UI instructions should use input-neutral verbs such as "select" and "go to".
- Google Developer Documentation Style Guide: focus on the feature and task first; refer to UI elements only where it helps clarity.
- Nielsen Norman Group: help and documentation should be easy to search, task-focused, concrete, and not too large.
- ScreenSteps: screenshots help users confirm that the documented software state matches what they see; screenshots should support procedures rather than replace text.
- TechSmith: user manuals benefit from clear hierarchy, logical flow, concise language, and visuals that support the task.

Sources:

- https://learn.microsoft.com/en-us/style-guide/procedures-instructions/
- https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions
- https://learn.microsoft.com/en-us/style-guide/procedures-instructions/describing-interactions-with-ui
- https://learn.microsoft.com/en-us/style-guide/procedures-instructions/formatting-text-in-instructions
- https://developers.google.com/style/ui-elements
- https://developers.google.com/style/highlights
- https://www.nngroup.com/articles/help-and-documentation/
- https://www.nngroup.com/articles/task-analysis/
- https://www.nngroup.com/articles/user-journeys-vs-user-flows/
- https://www.nngroup.com/articles/ten-usability-heuristics/
- https://blog.screensteps.com/10-examples-of-great-end-user-documentation
- https://help.screensteps.com/a/55086-use-pictures
- https://help.screensteps.com/a/1075837-example-of-a-style-guide
- https://www.techsmith.com/blog/user-documentation/

## V3 Proof Wrapper

| Phase | Result |
| --- | --- |
| P0 Mission Card | Create an English, task-led, UI-led user manual from the manual-source package. |
| P1 Evidence Intake | Read prompt, Engine instructions, source package, repository source docs, JSON counts, screenshot metadata, implementation reality checks, and online documentation sources. |
| P2 Content Architecture | Manual structured around product principles, roles, concepts, 14 tasks, workflow reference, field reference, troubleshooting, and implementation notes. |
| P3 Manual Design Architecture | User-facing manual separates procedures from screenshot index, traceability, and QA report. |
| P4 Requirements/Gates | No route-led user instructions; no production claims without evidence; no weakened compliance/evidence/audit semantics. |
| P5 Execution Plan | Create manual package, then validate JSON, screenshots, task coverage, and wording constraints. |
| P6 Draft Manual | `ALPHAVEST_USER_MANUAL_V3.md` created. |
| P7 Integration Pass | Screenshot index, traceability, README, QA report, and JSON metadata created. |
| P8 Verification | See validation summary below. |
| P9 QA/Inspection | Blocked and static states retained; failed screenshot captures excluded from user-facing images. |
| P10 Hardening | Route paths retained only in traceability/metadata and not used as procedure instructions. |
| P11 Final Assembly | Five Markdown deliverables and one JSON metadata file. |
| P12 Final Proof | Final checks run after generation. |

## V2 Method Artifacts

| Method | Applied Artifact |
| --- | --- |
| Double Diamond | Discover: source package and product gates. Define: manual must answer role/task/workflow/input/state questions. Develop: task chapter format plus screenshot and field references. Deliver: finished manual package with QA evidence. |
| Psycho-Logic + Map/Model | User trust depends on visible gates, not hidden enforcement. The manual explains why blocks exist and does not mistake route availability for completed governance. |
| Reframing Matrix | Client role view: what can I safely do. Internal role view: what must be reviewed. Compliance view: what controls visibility. Ops view: what remains demo/reference. |
| TRIZ | Improve speed without reducing compliance by keeping concise task procedures while preserving release/evidence/audit gates. |
| SIT Closed World | Used existing manual-source package, screenshot captures, route registry, data model, workflow gates, and QA checks; no new product behavior invented. |
| Morphological Analysis / CCA | Dimensions: role, task, screen, data, gate, evidence, implementation status. Rejected route-only, screenshot-only, and production-overclaim variants. |
| SCAMPER | Substituted route lists with task chapters; combined screenshots with procedures; eliminated dev/source details from user instructions. |
| Harvard / BATNA | Mutual gain: users get clear help, engineering keeps evidence boundaries. BATNA would be a raw source package only, but that would not serve end users. |
| MESOs | A: full manual now; B: task articles only; C: screenshot atlas only. Chosen A, with screenshot index and QA split out for maintainability. |
| Measurement Plan | Validate JSON, coverage, screenshot existence, no route-led procedure steps, non-ASCII drift, and product checks. |
| Ethics & Fairness | No fabricated implementation claims, no hidden advice release, no dark patterns, blocked states remain visible. |

## Validation Summary

| Check | Result |
| --- | --- |
| Source JSON parses | Passed. |
| All 14 manual tasks covered | Covered in `ALPHAVEST_USER_MANUAL_V3.md`. |
| Live screenshot references used | 14 task screenshots. |
| Missing screenshot paths | 0. |
| Failed capture entries used as successful images | No. Failed 3007 capture entries are QA-only. |
| Route paths used as main procedure instructions | No. User-facing steps use screen names. |
| Source limitations reflected | Yes. Demo boundaries and implementation notes are explicit. |
| Product gates preserved | Yes: advisor approval is not client release; compliance release controls client visibility. |

## Checks Run

- Parsed `docs/v3/user-manual-source/user-manual-source.v3.json`.
- Parsed `docs/v3/user-manual/ALPHAVEST_USER_MANUAL_V3.json`.
- Verified 14/14 manual task headings.
- Verified 14/14 manual task IDs covered.
- Verified 14/14 Markdown image references resolve to existing files.
- Verified 0 failed 3007 capture paths are used as user-facing images.
- Verified 0 route-led procedure instructions matching `Go to /...`, `Open /...`, or `Select /...`.
- Verified 0 non-ASCII characters in `docs/v3/user-manual/`.
- `pnpm typecheck` passed.
- `pnpm lint` passed.
- `pnpm db:validate` passed.
- `pnpm build` passed.
- `pnpm visual:contract` passed with 63 assets, 63 routes, 0 failures.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:route-smoke` passed with 72 tests.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:workflow-api` passed with 2 tests.

## Known Limitations

1. The manual is Markdown, not a designed PDF or in-app help center.
2. The current screenshot set has one live orientation screenshot per manual task, not one screenshot for every sub-step.
3. Most visible workflows are demo/navigable surfaces; the manual preserves implementation caveats instead of claiming production completion.
4. The manual does not introduce real authentication, real client data, final advice, or backend behavior not proven by the source package.

## Recommended Next Step

Run a dedicated screenshot expansion pass that captures each major step state in the 14 workflows, then update the screenshot index and place additional images near high-friction steps such as compliance release, export redaction, second confirmation, document extraction review, and governance role changes.

## Method Compliance Checklist

- [x] Mixed Engine route applied.
- [x] V3 proof wrapper used.
- [x] V2 methods produced visible QA artifacts.
- [x] Facts, assumptions, limitations, and implementation caveats separated.
- [x] No invented production behavior added.
- [x] No user-facing route catalogue created.
- [x] No unapproved-advice rule weakened.
- [x] Screenshot provenance preserved.
