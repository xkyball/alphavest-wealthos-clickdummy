# Adapt AlphaVest Screencast Automation From PPWR Reference

max

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

Goal:
Fix the AlphaVest WealthOS screencast system by first scanning the working reference implementation in `/Users/chris/projects/pack3/ppwr-readiness`, then adapting the same screencast quality pattern to this repository.

The current AlphaVest screencast output is not good enough. The final demo videos must show:

- visible captions
- a visible mouse pointer / cursor overlay
- human-paced movement and clicks
- reliable per-step evidence for J01-J10

Repository to adapt:
`/Users/chris/projects/alphavest-wealthos-clickdummy`

Reference repository to scan first:
`/Users/chris/projects/pack3/ppwr-readiness`

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v2 as the implementation design stack:

- Double Diamond
- Psycho-Logic + Map/Model
- Reframing
- TRIZ
- SIT Closed World
- Morphological Analysis / Zwicky Box + CCA
- SCAMPER
- Harvard / BATNA
- MESOs
- Measurement Plan
- Ethics & Fairness

Use ENGINE_v3 as proof wrapper:

- Mission Card
- Evidence Intake
- Problem Architecture
- Branch Debate
- Adversarial QA
- Proof Paths
- Learning Log

Keep the method artifacts concise but visible. Do not only name the methods.

Separate strictly:

- facts verified in the current run
- assumptions
- interpretation
- implementation decisions
- unresolved risks

## Non-Negotiable Outcome

At the end, AlphaVest must have a PPWR-quality screencast automation system.

For each journey J01-J10, a run must produce, at minimum:

- raw Playwright browser video
- final MP4
- visible cursor overlay in the video
- `captions.srt`
- captions visible in the final MP4, preferably burned into the video
- per-step screenshots
- structured run log
- resolved manifest / resolved journey definition
- human-readable storyboard or transcript
- QA result with warnings and failures separated

Do not accept a run as complete if the final video has no visible cursor or no captions.

## Mandatory AlphaVest Source Reading

Read these files before editing AlphaVest:

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md`
- `docs/v3/USERFLOW_DEFINITIONS_V3.md`, if present
- `docs/v3/WORKFLOW_DEFINITIONS_V3.md`, if present
- `docs/v3/PAGE_SPECS_V3.md`, if present
- `docs/v3/journeys.screencast.v3.json`
- `docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md`, if present
- `docs/v3/SCREENCAST_RUNBOOK_V3.md`, if present
- `docs/v3/SCREENCAST_QA_REPORT_V3.md`, if present
- `package.json`
- `scripts/screencast/`

Also inspect the live implementation surfaces needed by the journeys:

- `app/`
- `components/`
- `lib/`
- route, demo-session, role, tenant, workflow, evidence, audit, and permission helpers

Do not implement spec panels, route labels, filenames, annotation rails, dev notes, callout legends, or reference-board chrome as UI.

## Mandatory PPWR Reference Scan

Before designing the AlphaVest changes, scan `/Users/chris/projects/pack3/ppwr-readiness`.

Start with:

- `package.json`
- `docs/JOURNEY_SCREENCASTS.md`
- `scripts/journey-recorder.ts`
- `src/lib/screencast/manifest.ts`
- `src/lib/screencast/paths.ts`
- `src/lib/screencast/timing.ts`
- `journeys/screencasts/*.journey.json`

If existing PPWR outputs are present, inspect representative artifacts:

- `_codex_audit/journey-screencasts-*/index.md`
- `_codex_audit/journey-screencasts-*/index.json`
- `_codex_audit/journey-screencasts-*/J*/run-log.json`
- `_codex_audit/journey-screencasts-*/J*/manifest.resolved.json`
- `_codex_audit/journey-screencasts-*/J*/storyboard.md`
- `_codex_audit/journey-screencasts-*/J*/captions.srt`

Use `rg` / `rg --files` first.

Extract the patterns that matter:

- manifest shape
- step schema
- locator model
- caption model
- visible cursor implementation
- timing profiles
- browser launch options
- server readiness check
- Playwright video recording
- trace recording
- SRT generation
- ffmpeg MP4 rendering
- subtitle burn-in / fallback behavior
- run-log structure
- storyboard structure
- index generation
- CLI options
- output folder structure

Do not copy PPWR product language, domain behavior, brand colors, or routes. Transfer the screencast architecture pattern only.

## Known Reference Behaviors To Preserve When Useful

Verify these in PPWR before using them. Treat this list as a checklist, not as a substitute for scanning.

PPWR has a strong screencast pattern:

- `screencast:journey`
- `screencast:all`
- `screencast:dry-run`
- manifest-based journeys under `journeys/screencasts/`
- per-step `caption`
- structured locator targets such as `role`, `name`, `selector`, and `text`
- human-speed and QA-fast timing profiles
- DOM cursor overlay plus halo
- native mouse movement to locator centers
- cursor pulse before clicks
- `captions.srt` generation from step logs
- ffmpeg conversion to MP4
- caption burn-in when the ffmpeg subtitles filter exists
- embedded subtitle track fallback when burn-in is unavailable
- raw video preserved next to final MP4
- `run-log.json`
- `storyboard.md`
- `manifest.resolved.json`
- `trace.zip`
- dated run index

AlphaVest should reach the same class of output.

## Current AlphaVest Pain To Fix

Audit the current implementation first, but expect that it may currently have:

- generic string targets instead of reliable structured locators
- no per-step caption field
- no visible cursor overlay
- no generated SRT file
- MP4 conversion without caption burn-in or subtitle track
- transcript-only narration instead of video captions
- warning-heavy click fallbacks
- limited proof that final videos are actually demo-ready

Do not hide these problems in documentation. Replace weak behavior with a reliable implementation.

## Product Rules To Preserve

AlphaVest product rules stay authoritative:

- Digital first.
- Human reviewed.
- Evidence backed.
- No unapproved advice reaches the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Evidence is created by default for important actions where implemented.
- Sensitive actions create audit events where implemented.
- Use demo data only.
- Do not add real authentication.
- Use demo session, role switcher, and tenant switcher patterns already in the repo.
- Do not invent product state transitions, financial advice, legal advice, tax advice, evidence events, audit events, or approval semantics.

If a journey implies behavior not implemented in the UI, mark it as expected/static/simulated/blocked/unverified. Do not claim it as implemented.

## Target Architecture

Adapt AlphaVest to a PPWR-style screencast architecture.

Preferred implementation shape:

- keep the AlphaVest implementation under `scripts/screencast/`
- keep the AlphaVest source journey file `docs/v3/journeys.screencast.v3.json`
- add helper modules under `scripts/screencast/lib/` as needed
- preserve or update `package.json` scripts
- keep generated artifacts under `artifacts/screencasts/`

Preferred generated output shape:

`artifacts/screencasts/runs/<YYYY-MM-DD-or-run-id>/`

Run root should contain:

- `index.md`
- `index.json`

Each journey folder should contain:

- `raw-video.webm`
- `journey.mp4`
- `captions.srt`
- `run-log.json`
- `storyboard.md`
- `manifest.resolved.json`
- `qa-result.json`, if separate from run log
- `trace.zip`
- `screenshots/`

If existing docs/scripts expect `artifacts/screencasts/<journey-id>/video.webm` or `final.mp4`, preserve compatibility through documented copies or update all docs/scripts consistently. Do not silently break the old contract.

## Screencast Definition Contract

Upgrade `docs/v3/journeys.screencast.v3.json` so each step can support:

- stable id
- title
- role
- tenant
- route
- screen
- action type
- structured target locator
- input data
- visible caption
- expected visible text
- expected state change
- blocked actions
- client visibility rule
- evidence expectation
- audit expectation
- QA assertion
- pause / timing intent
- screenshot name
- manual/static/simulated/blocked marker
- source proof

The structured target should support at least:

- `role`
- `name`
- `selector`
- `text`
- `label`
- `placeholder`
- `testId`, only where already present or added with clear justification

Captions must be source-grounded. Derive them from existing journey intent, QA assertions, screen names, expected state changes, and product rules. Keep captions concise and demo-suitable.

Caption style:

- German is acceptable and preferred for Christoph-facing demo review.
- 1 sentence per meaningful step.
- No marketing fluff.
- No claims of final advice, final approval, or released communication unless the app proves that state.
- Use neutral wording for static or simulated states.

Examples:

- `Der Advisor oeffnet die Mandantenuebersicht und prueft den aktuellen Beratungsstatus.`
- `Die Entscheidung bleibt intern, bis Compliance die Freigabe erteilt.`
- `Der Client sieht nur freigegebene Inhalte; interne Pruefnotizen bleiben verborgen.`

## Cursor Requirement

Implement a visible cursor overlay that is recorded in the browser video.

Requirements:

- injected into the page during recording
- fixed-position overlay with very high z-index
- visible on light and dark AlphaVest surfaces
- styled with AlphaVest visual language, not PPWR green
- includes a pointer dot and optional halo / click pulse
- moves toward the locator center before clicks, fills, presses, and relevant selects
- pulses on click
- remains visible in raw video and final MP4
- does not permanently alter app code or ship as product UI

Suggested AlphaVest cursor styling:

- champagne / gold pointer
- subtle navy outline
- translucent ivory halo
- no oversized distraction

Prefer a runner-injected DOM overlay over app source changes.

## Caption And MP4 Requirement

Implement SRT caption generation from the executed step log.

Requirements:

- `captions.srt` is written for every journey run
- captions are timed against actual step execution
- skipped/manual/static steps can still produce captions if they appear in the demo flow
- final MP4 includes captions
- prefer burned-in subtitles using ffmpeg `subtitles` filter
- if burn-in is unavailable, embed an SRT subtitle track and record this fallback in `run-log.json`
- record `captionMode`, for example `burned-in`, `embedded-track`, or `unavailable`
- if `captionMode` is `unavailable`, the run cannot be considered demo-ready

Use a readable subtitle style suitable for executive demos:

- small enough not to cover app UI
- high contrast
- bottom aligned
- consistent across videos
- not huge hero typography

## Runner Behavior

Use Playwright unless the project already has a better local runner.

Runner must support:

- `BASE_URL`, default `http://127.0.0.1:3000`
- `--base-url`
- `--speed=human-demo`
- `--speed=qa-fast`
- `--date` or run id override
- `--dry-run`
- one journey by id
- all journeys J01-J10
- clear app reachability check
- deterministic viewport suitable for recording
- trace recording
- video recording
- screenshots after meaningful steps
- structured errors
- structured warnings
- manifest validation before execution

Environment support:

- `SCREENCAST_HEADLESS=false` for visible local recording
- `SCREENCAST_BROWSER`
- `SCREENCAST_BROWSER_CHANNEL`
- `SCREENCAST_FFMPEG`

Do not leave the dev server running after verification unless it was already running before the task began.

## Locator Quality

Reduce warning-heavy fallback behavior.

Do not rely only on fuzzy text clicks. Improve locators by:

- scanning the current UI DOM / accessible names
- using role and accessible name where possible
- using labels/placeholders for form inputs
- using stable existing test ids only when present
- adding new test ids only if necessary, narrowly scoped, and documented

If a selector cannot be made reliable without product UI changes, document it as a limitation and choose the smallest safe fallback.

Do not change product flows just to make a screencast easier.

## Required Package Scripts

Update `package.json` with the actual final commands.

Target script set:

- `screencast:journey`
- `screencast:all`
- `screencast:dry-run`
- `screencast:mp4`, only if still useful as a standalone command

The runbook must include exact examples, for example:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
BASE_URL=http://127.0.0.1:3000 SCREENCAST_HEADLESS=false pnpm screencast:journey -- J01 --speed=human-demo
BASE_URL=http://127.0.0.1:3000 pnpm screencast:all -- --speed=qa-fast
BASE_URL=http://127.0.0.1:3000 pnpm screencast:dry-run -- all
```

Use the real final syntax, not these examples blindly.

## Documentation To Update

Update or create:

- `docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md`
- `docs/v3/SCREENCAST_RUNBOOK_V3.md`
- `docs/v3/SCREENCAST_QA_REPORT_V3.md`
- `docs/v3/PHASE_EXECUTION_REPORT.md`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

The screencast runbook must explain:

- how to start the dev server
- how to run one journey
- how to run all journeys
- how to run dry-run validation
- where artifacts land
- how to inspect captions
- how to inspect cursor visibility
- how to interpret `captionMode`
- how to interpret warnings vs failures
- known limitations

The QA report must include:

- J01-J10 result table
- artifact paths
- caption status per journey
- cursor status per journey
- warnings/failures
- commands run
- unresolved risks

## Verification Requirements

Run the strongest reasonable verification available.

At minimum:

```bash
pnpm typecheck
pnpm lint
pnpm visual:contract
pnpm screencast:dry-run -- all
```

Then run live recording verification:

```bash
BASE_URL=http://127.0.0.1:3000 SCREENCAST_HEADLESS=false pnpm screencast:journey -- J01 --speed=human-demo
```

Verify J01 output manually or programmatically:

- raw video exists
- final MP4 exists
- `captions.srt` exists and has real cue text
- `run-log.json` records caption mode
- final MP4 has visible captions or an embedded subtitle track
- cursor is visible in at least one captured frame
- screenshots are not blank

Then run all journeys:

```bash
BASE_URL=http://127.0.0.1:3000 pnpm screencast:all -- --speed=qa-fast
```

If a full J01-J10 recording is too slow or blocked, run as many as possible, document the exact blocker, and do not claim full completion.

Use `ffmpeg` / `ffprobe` where available to prove the MP4 and subtitle behavior. Extract at least one representative frame from a final MP4 and verify that a caption and cursor are visible.

## Acceptance Criteria

The task is not done until:

- PPWR was scanned and the extracted patterns were documented in the plan or implementation notes
- AlphaVest has per-step captions for J01-J10
- AlphaVest videos show a visible cursor overlay
- every generated journey writes `captions.srt`
- final MP4 output includes captions
- `captionMode` is recorded
- dry-run validation passes for J01-J10
- at least J01 is live-recorded and visually verified for caption + cursor
- a J01-J10 run is attempted and honestly reported
- docs and QA reports are updated
- product rules about advice, approval, compliance release, evidence, audit, and demo data remain intact

## Failure Policy

Fail loudly for:

- invalid journey definitions
- missing required route
- app not reachable
- no video captured
- no captions generated
- final MP4 missing after ffmpeg was required
- cursor injection failure

Warn, but continue when defensible, for:

- optional text assertion not found on a static screen
- a product behavior is documented but not implemented
- fallback navigation is used because the click path is not available
- ffmpeg burn-in is unavailable but embedded subtitle fallback succeeds

Warnings must be visible in `run-log.json`, QA report, and final response.

## Deliverable Format

In the final response, report:

- files changed
- PPWR files scanned
- commands run
- J01 proof path
- J01-J10 status
- caption status
- cursor status
- unresolved risks

Keep it honest. If captions or cursor visibility are not proven, say so directly and leave the task marked incomplete.

