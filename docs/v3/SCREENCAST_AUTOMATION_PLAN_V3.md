# Screencast Automation Plan V3

Date: 2026-06-15

Engine mode: `ENGINE_MIX_V2_CODEX_V3_PROOF`

## Mission Card

| Field | Decision |
| --- | --- |
| Mission | Adapt AlphaVest screencast automation to the PPWR-quality pattern: captions, visible cursor, human-paced movement, structured run evidence and J01-J10 coverage. |
| Primary AlphaVest sources | `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md`, `docs/v3/journeys.screencast.v3.json`, route registry, demo data, workflow gates and V3 source-of-truth docs. |
| PPWR reference scanned | `/Users/chris/projects/pack3/ppwr-readiness/docs/JOURNEY_SCREENCASTS.md`, `scripts/journey-recorder.ts`, `src/lib/screencast/manifest.ts`, `paths.ts`, `timing.ts`, `journeys/screencasts/*.journey.json`, representative `_codex_audit/journey-screencasts-*` outputs. |
| Output contract | Primary run artifacts live under `artifacts/screencasts/runs/<run-id>/<journey-id>/`; compatibility copies remain under `artifacts/screencasts/<journey-id>/`. |
| Non-goals | No app UI changes, no real authentication, no production persistence claims, no reference/spec chrome in recordings. |
| Quality bar | Every final live journey run must include raw video, MP4, `captions.srt`, caption mode, visible cursor overlay, screenshots, run log, storyboard, resolved manifest and transparent QA status. |

## Evidence Intake

| Evidence | Use |
| --- | --- |
| `AGENTS.md` and `CODEX_MASTER_TASK.md` | Demo-data-first stack, clean UI rule, no-unapproved-advice product rule. |
| PPWR `docs/JOURNEY_SCREENCASTS.md` | Reference runbook for browser recording, captions, output folders, `captionMode`, gap rules and CLI options. |
| PPWR `scripts/journey-recorder.ts` | Reference implementation for visible cursor injection, SRT generation, ffmpeg burn-in/fallback, trace capture, storyboard and run index. |
| PPWR `src/lib/screencast/*.ts` | Manifest, output-path and timing-profile contracts. |
| PPWR `journeys/screencasts/J01-*.json` | Per-step `caption` and structured locator example. |
| `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md` | Ten selected AlphaVest journeys, actors, routes, evidence/audit expectations and risk notes. |
| `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md` and `WORKFLOW_DEFINITIONS_V3.md` | Pageflow mapping and no-unapproved-advice gates. |
| `docs/v3/DATA_MODEL_V3.md` | Evidence, audit, export, visibility and approval data rules. |
| `components/*-screen.tsx` and `lib/*-demo-data.ts` | Current visible UI, role/tenant state and static/demo caveats. |

## Current Implementation Facts

- Previous AlphaVest screencasts used string targets, transcripts and separate MP4 conversion, but had no video captions and no visible cursor.
- Current journey JSON now contains exactly ten journeys and 73 steps.
- Each step now has a stable `id`, `title`, English `caption` and structured `target` object or `null`.
- The runner now injects an AlphaVest-styled DOM cursor overlay and halo during recording.
- The cursor now preserves its last known position across steps and route transitions instead of resetting to the top-left corner.
- The runner now writes `captions.srt` and renders `journey.mp4` with burned-in captions when ffmpeg supports the `subtitles` filter.
- If burn-in is unavailable, ffmpeg embeds the SRT as an English `mov_text` subtitle track and records `captionMode: embedded-track`.
- Compatibility files are copied to `artifacts/screencasts/<journey-id>/video.webm` and `final.mp4`.

## Assumptions

- `BASE_URL` or `--base-url` points at a running local app, defaulting to `http://127.0.0.1:3000`.
- Direct route navigation remains a transition fallback while full stateful click paths are incomplete. The new provisioning contract makes the target architecture data-first: seed/validate journey data before capture, then prefer true UI interactions and `navigation: "continue"` steps.
- Expected workflow effects remain target behavior unless visible UI or future persistence proves them.
- Generated videos, screenshots, logs and captions are run artifacts, not source-of-truth files.

## Double Diamond

| Phase | Notes |
| --- | --- |
| Discover | PPWR solved the exact quality gap with manifest captions, cursor overlay, SRT, ffmpeg caption modes and run indexes. AlphaVest already had journey definitions but lacked demo-ready video semantics. |
| Define | The real problem was not journey selection; it was missing video communication quality and weak proof artifacts. |
| Develop | Candidate moves were: patch MP4 only, rebuild runner from PPWR pattern, or add app-level cursor/caption UI. |
| Deliver | Chosen move: runner-side PPWR adaptation with no product UI change and backward-compatible output copies. |

## Method Artifacts

| Method | Artifact |
| --- | --- |
| Psycho-Logic + Map/Model | Users need the recording itself to communicate intent. A silent cursorless video is a poor map of the demo flow; captions and pointer movement make the proof legible without overstating product state. |
| Reframing Matrix | From "make scripts pass" to "make demo evidence inspectable"; from "transcript beside video" to "caption inside video"; from "click warnings hidden" to "warnings classified"; from "single folder output" to "run-root audit trail". |
| TRIZ | Contradiction: human-paced presentable videos must also be deterministic QA artifacts. Resolution: speed profiles, fixed viewport, route navigation, structured locators and run logs. |
| SIT Closed World | Reused existing journey JSON, Playwright, topbar demo selectors, ffmpeg, artifact root and docs. Added no app-level demo UI. |
| Morphological / CCA | Dimensions: captions burned-in vs embedded; cursor DOM vs native only; output old flat vs dated run-root; targets string vs structured. Kept: burned-in preferred, DOM cursor, run-root plus compatibility copy, structured targets. |
| SCAMPER | Substitute string targets with locator objects; combine QA log and storyboard; adapt PPWR cursor with AlphaVest colors; modify MP4 conversion for captions; eliminate separate silent final MP4; rearrange output under run roots. |
| Harvard / BATNA | Objective criteria are visible captions, visible cursor, generated SRT, caption mode, raw+final video and inspectable logs. BATNA is keeping raw WebM/captions when ffmpeg fails, but that run is not demo-ready. |
| MESOs | A: full human-demo run for presentation. B: qa-fast run for technical verification. C: dry-run for manifest validation before browser capture. |
| Measurement Plan | Dry-run all J01-J10, live J01 proof, full J01-J10 attempt, ffprobe/frame extraction for captions/cursor, typecheck/lint/visual contract. |
| Ethics & Fairness | Captions must not imply final advice, compliance release, evidence creation or audit writes unless visible/proven. Static/demo effects stay marked as such. |

## Chosen Architecture

The automation now uses four layers:

1. `docs/v3/journeys.screencast.v3.json` is the source-bound journey and caption contract.
2. `scripts/screencast/lib/journey-fixtures.ts` defines the deterministic journey data fixture refs, inputs and expected mutation map.
3. `scripts/screencast/seed-journey.ts` resets/validates the database fixture before live capture.
4. `scripts/screencast/lib/runner.ts` validates definitions, provisions data, records browser video, injects cursor, captures screenshots, writes captions and renders MP4.
5. `scripts/screencast/run-journey.ts` and `run-all.ts` execute one or all journeys with shared run-root output.
6. `scripts/screencast/render-mp4.ts` can re-render latest run videos with captions when needed.

## Artifact Map

| Artifact | Purpose |
| --- | --- |
| `artifacts/screencasts/runs/<run-id>/index.md` | Human-readable run index. |
| `artifacts/screencasts/runs/<run-id>/index.json` | Machine-readable run summary. |
| `artifacts/screencasts/runs/<run-id>/<journey-id>/raw-video.webm` | Playwright raw browser recording. |
| `artifacts/screencasts/runs/<run-id>/<journey-id>/journey.mp4` | Final MP4 with captions burned in or embedded. |
| `captions.srt` | Step captions timed to execution. |
| `provisioning.json` | Database fixture status, checked refs, form inputs, click path and expected mutations for the journey. |
| `run-log.json` / `qa-result.json` | Structured journey status, steps, warnings, errors and caption mode. |
| `storyboard.md` / `transcript.md` | Human-readable review artifacts. |
| `manifest.resolved.json` | Resolved journey contract used for that run. |
| `trace.zip` | Playwright trace. |
| `screenshots/` | Per-step viewport screenshots with cursor overlay. |

## Verification Plan

| Check | Success Signal |
| --- | --- |
| `pnpm typecheck` | TypeScript strict check passes. |
| `pnpm lint` | ESLint passes. |
| `pnpm visual:contract` | 63 route/asset contract still clean. |
| `pnpm screencast:dry-run -- all` | J01-J10 definitions validate with zero errors. |
| Live J01 | raw video, MP4, SRT, run log, trace, screenshots and visible cursor/caption proof. |
| Live J01-J10 | no failed journeys; warnings classified. |
| ffprobe/frame extraction | Caption mode and at least one frame prove caption/cursor visibility. |

## Stateful J01 Clickthrough Addendum

Date: 2026-06-16

- J01 now keeps only `j01.requestData` on the canonical typed boundary (legacy compatibility bridge); route-to-advisor, escalations and advisor approval are routed through typed product command APIs.
- J01 step 2, 4, 6 and 7 are required real clicks with interaction success/fallback recorded in `run-log.json`.
- J01 step 3, 5 and 8 now use `navigation: "continue"` to verify the state reached by the previous click.
- The cursor state is preserved through page transitions; proof frames show it near active controls, not jumping from the top-left corner.
- Live proof run: `artifacts/screencasts/runs/2026-06-15-j01-stateful-clickthrough-cursor-continuity-proof/J01/run-log.json`.
