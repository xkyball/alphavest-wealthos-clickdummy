# Screencast QA Report V3

Date: 2026-06-15

## PPWR Reference Findings

Scanned files:

- `/Users/chris/projects/pack3/ppwr-readiness/docs/JOURNEY_SCREENCASTS.md`
- `/Users/chris/projects/pack3/ppwr-readiness/scripts/journey-recorder.ts`
- `/Users/chris/projects/pack3/ppwr-readiness/src/lib/screencast/manifest.ts`
- `/Users/chris/projects/pack3/ppwr-readiness/src/lib/screencast/paths.ts`
- `/Users/chris/projects/pack3/ppwr-readiness/src/lib/screencast/timing.ts`
- `/Users/chris/projects/pack3/ppwr-readiness/journeys/screencasts/J01-dev-context.journey.json`
- Representative PPWR output: `run-log.json`, `captions.srt`, `storyboard.md`, `manifest.resolved.json`

Patterns transferred:

- per-step captions
- structured targets
- human-demo / qa-fast speed profiles
- visible DOM cursor with halo
- screenshot, raw video, trace, SRT, MP4, storyboard and run-log output
- ffmpeg burned-in captions with embedded-track fallback
- dated/shared run-root index
- explicit gap/warning discipline

## Journey Coverage

| Journey | Name | Steps | Captioned | Structured targets | Start route | Actor |
| --- | --- | ---: | --- | --- | --- | --- |
| J01 | Signal To Advisor Approval Without Client Visibility | 8 | Yes | Yes | `/signals` | Analyst |
| J02 | Compliance Release Or Block | 8 | Yes | Yes | `/compliance` | Compliance Officer |
| J03 | Client Decision And Evidence Package | 7 | Yes | Yes | `/decisions` | Principal |
| J04 | Document Upload And Verification | 7 | Yes | Yes | `/documents` | Family CFO |
| J05 | Entity Wealth Map And Action Board | 8 | Yes | Yes | `/entities` | Principal |
| J06 | Tenant Onboarding And Principal Invitation | 7 | Yes | Yes | `/admin/tenants` | Admin |
| J07 | Governance Access Change And Audit | 7 | Yes | Yes | `/governance/users` | Principal |
| J08 | Export With Scope Redaction Approval And Download | 7 | Yes | Yes | `/export/new` | Principal |
| J09 | Client Profile And Family Intake | 7 | Yes | Yes | `/portal` | Principal |
| J10 | Platform Policy And No-Advice Baseline | 7 | Yes | Yes | `/admin/platform` | Platform Admin |

Total: 10 journeys, 73 steps.

## Gate Coverage

- Advisor approval does not create client visibility.
- Compliance release/block controls client visibility.
- Client decision room is release-gated.
- Evidence completeness and missing evidence block readiness.
- Sensitive role/access changes require confirmation and audit.
- Export requires scope, redaction, approval and audit.
- Platform advice-boundary policies define the no-advice baseline.

## Current Verification Status

| Check | Result | Notes |
| --- | --- | --- |
| `pnpm typecheck` | Passed | TypeScript strict check passed after runner rewrite. |
| `pnpm lint` | Passed | Lint passed after runner, caption and documentation edits. |
| `pnpm build` | Passed | Next.js production build compiled and generated all static pages. |
| `pnpm db:validate` | Passed | Prisma schema validates after adding the screencast provisioning layer. |
| `pnpm visual:contract` | Passed | 63 reference assets and 63 routes checked. |
| `pnpm screencast:dry-run -- all` | Passed | J01-J10 validated; all 73 steps have English captions and structured or null targets. |
| `pnpm screencast:seed-journey -- J01 --dry-run` | Passed | Fixture contract resolves without touching the database. |
| `pnpm screencast:seed-journey -- J01 --no-reset` | Passed | After local Postgres migration/seed, J01 validated 19 fixture refs with 0 missing records. |
| `pnpm screencast:journey -- J01 --provision-only` | Passed | Runner-level provisioning wrote `provisioning.json` with `status: passed`. |
| Live J01 proof | Passed with warnings | English captions, visible mouse pointer, raw WebM, MP4, SRT, run log and trace created. |
| Live J01-J10 | Passed with warnings | All ten journeys completed with burned-in English captions and zero hard errors. |

## Stateful Provisioning Contract

The screencast system now has a data-first contract for future real-click process demos:

- all 10 journeys declare `fixtureId`;
- all 10 journeys declare `provisioning`;
- all 73 steps declare `interaction`;
- all 73 steps declare `navigation`;
- all 73 steps declare `dataRefs`;
- fixture metadata lives in `scripts/screencast/lib/journey-fixtures.ts`;
- runner provisioning evidence is written to each journey's `provisioning.json`.

Proof run:

`artifacts/screencasts/runs/2026-06-15-j01-provisioning-contract-proof/J01/provisioning.json`

Summary: J01 provisioning status `passed`, reset executed `true`, refs checked `19`, missing refs `0`.

## Live Run Results

Run root:

`artifacts/screencasts/runs/2026-06-15-j01-j10-english-caption-cursor`

| Journey | Status | Caption mode | Warnings | Errors |
| --- | --- | --- | ---: | ---: |
| J01 | `completed_with_warnings` | `burned-in` | 4 | 0 |
| J02 | `completed_with_warnings` | `burned-in` | 4 | 0 |
| J03 | `completed_with_warnings` | `burned-in` | 3 | 0 |
| J04 | `completed_with_warnings` | `burned-in` | 2 | 0 |
| J05 | `completed_with_warnings` | `burned-in` | 2 | 0 |
| J06 | `completed_with_warnings` | `burned-in` | 6 | 0 |
| J07 | `completed_with_warnings` | `burned-in` | 4 | 0 |
| J08 | `completed_with_warnings` | `burned-in` | 4 | 0 |
| J09 | `completed_with_warnings` | `burned-in` | 3 | 0 |
| J10 | `completed_with_warnings` | `burned-in` | 6 | 0 |
| Total | - | - | 38 | 0 |

The warnings are intentionally retained because some current click targets are static demo controls, manual/static route hops or selector fallbacks. They are not caption failures, browser crashes or missing output artifacts.

## Adversarial QA

| Question | Answer |
| --- | --- |
| Could captions overstate product behavior? | Captions are generic and gate-safe; they avoid final advice/release claims unless route state supports them. |
| Could cursor be mistaken for app UI? | It is injected only by the runner and never added to application source. |
| Could old `final.mp4` consumers break? | Compatibility copies keep `artifacts/screencasts/<journey-id>/final.mp4`. |
| Could a run pass without captions? | No; live MP4 caption failure records `captionMode: unavailable` and fails the journey. |
| Could static demo clicks imply persistence? | Warnings and transcripts keep static/manual and expected workflow effects separated. |
| Could spec chrome leak into recordings? | No app UI was changed; `visual:contract` remains the guard before final captures. |

## Proof Paths To Complete

| Proof | Artifact |
| --- | --- |
| Caption generation | `artifacts/screencasts/runs/2026-06-15-j01-j10-english-caption-cursor/J01/captions.srt` through `J10/captions.srt`. |
| Captioned MP4 | `artifacts/screencasts/runs/2026-06-15-j01-j10-english-caption-cursor/J01/journey.mp4` through `J10/journey.mp4`. |
| Cursor visibility | `artifacts/screencasts/runs/2026-06-15-j01-j10-english-caption-cursor/J01/proof-frame-cursor.png`. |
| Traceability | Each journey folder contains `trace.zip`, `manifest.resolved.json`, `storyboard.md`, `run-log.json` and `qa-result.json`. |
| J01-J10 status | `artifacts/screencasts/runs/2026-06-15-j01-j10-english-caption-cursor/index.json`. |

## Learning Log

### Proven

- PPWR has the reference quality pattern the user asked for.
- AlphaVest now has English captions and structured targets in the journey definition.
- AlphaVest TypeScript compiles after the runner rewrite.
- Dry-run validation passes for all ten journeys.
- Live browser capture passed for J01-J10 with burned-in English captions.
- The final J01 proof frame shows both the English caption and the visible mouse pointer.

### Remaining limitations

- The journeys are still `completed_with_warnings`, not clean-pass, because several app flows remain demo/static.
- Current videos prove visible UI walkthroughs and caption/cursor automation; they do not prove production persistence for evidence, audit, release, export or workflow state.
- The warning list and the new `interaction` / `navigation` metadata should become the next selector and statefulness backlog before a final executive demo capture.
- The current implementation provisions and validates known data before live journeys; it does not yet convert every J01-J10 route hop into `navigation: "continue"` click-through UI transitions.

## Stateful J01 Proof Addendum

Date: 2026-06-16

Run root:

`artifacts/screencasts/runs/2026-06-15-j01-stateful-clickthrough-cursor-continuity-proof`

| Journey | Status | Caption mode | Required clicks | Fallbacks | Warnings | Errors |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| J01 | `passed` | `burned-in` | 4/4 | 0 | 0 | 0 |

### Proof Paths

| Proof | Artifact |
| --- | --- |
| Provisioning | `artifacts/screencasts/runs/2026-06-15-j01-stateful-clickthrough-cursor-continuity-proof/J01/provisioning.json` |
| Run log | `artifacts/screencasts/runs/2026-06-15-j01-stateful-clickthrough-cursor-continuity-proof/J01/run-log.json` |
| Captioned MP4 | `artifacts/screencasts/runs/2026-06-15-j01-stateful-clickthrough-cursor-continuity-proof/J01/journey.mp4` |
| English captions | `artifacts/screencasts/runs/2026-06-15-j01-stateful-clickthrough-cursor-continuity-proof/J01/captions.srt` |
| Cursor continuity start frame | `artifacts/screencasts/runs/2026-06-15-j01-stateful-clickthrough-cursor-continuity-proof/J01/proof-frame-cursor-start.png` |
| Request-click frame | `artifacts/screencasts/runs/2026-06-15-j01-stateful-clickthrough-cursor-continuity-proof/J01/proof-frame-request-click.png` |

### Proven

- J01 no longer relies on static route hops for request-data, route-to-advisor, approval and escalation.
- J01 creates demo-scoped database mutations and audit events through `/api/demo-workflow`.
- The runner records required interaction success/fallback state.
- The visible cursor no longer resets to the top-left corner between steps; it preserves the previous pointer position across route transitions.

## Stateful J01-J10 Final Proof Addendum

Date: 2026-06-16

Run root:

`artifacts/screencasts/runs/2026-06-16-j01-j10-stateful-clicks-final`

| Journey | Status | Caption mode | Warnings | Errors |
| --- | --- | --- | ---: | ---: |
| J01 | `passed` | `burned-in` | 0 | 0 |
| J02 | `passed` | `burned-in` | 0 | 0 |
| J03 | `passed` | `burned-in` | 0 | 0 |
| J04 | `passed` | `burned-in` | 0 | 0 |
| J05 | `passed` | `burned-in` | 0 | 0 |
| J06 | `passed` | `burned-in` | 0 | 0 |
| J07 | `passed` | `burned-in` | 0 | 0 |
| J08 | `passed` | `burned-in` | 0 | 0 |
| J09 | `passed` | `burned-in` | 0 | 0 |
| J10 | `passed` | `burned-in` | 0 | 0 |
| Total | - | - | 0 | 0 |

### Proof Paths

| Proof | Artifact |
| --- | --- |
| Batch index | `artifacts/screencasts/runs/2026-06-16-j01-j10-stateful-clicks-final/index.json` |
| Human index | `artifacts/screencasts/runs/2026-06-16-j01-j10-stateful-clicks-final/index.md` |
| Captioned MP4 | `artifacts/screencasts/runs/2026-06-16-j01-j10-stateful-clicks-final/J01/journey.mp4` through `J10/journey.mp4` |
| English captions | `artifacts/screencasts/runs/2026-06-16-j01-j10-stateful-clicks-final/J01/captions.srt` through `J10/captions.srt` |
| QA result | `artifacts/screencasts/runs/2026-06-16-j01-j10-stateful-clicks-final/J01/qa-result.json` through `J10/qa-result.json` |
| Traceability | Each journey folder contains `trace.zip`, `manifest.resolved.json`, `storyboard.md`, `run-log.json`, `metadata.json` and screenshots. |

### Proven

- All J01-J10 journeys now complete as clean `passed` screencasts with no warnings.
- Each journey provisions deterministic demo data before capture.
- The visible cursor is maintained across page transitions and click interactions use the live mouse pointer on target bounds.
- MP4 files include burned-in English captions and SRT files remain available for every journey.
- The final proof is a deterministic demo-data clickthrough package, not a production authorization proof.
