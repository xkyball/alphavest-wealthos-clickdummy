# Screencast Runbook V3

Date: 2026-06-15

## What This Does

The screencast system reads `docs/v3/journeys.screencast.v3.json`, opens the AlphaVest app with Playwright, applies demo role/tenant context, injects a visible AlphaVest cursor, captures screenshots and raw browser video, writes `captions.srt`, renders a captioned MP4 and stores QA evidence per journey.

Before every non-dry-run journey, the runner now provisions deterministic journey data. The provisioning step resets the local demo database with `pnpm db:seed`, validates the journey fixture records and writes `provisioning.json` into the journey output folder. This is the foundation for replacing direct route hops with true click-through process demonstrations.

## Prerequisites

- Install dependencies with `pnpm install`.
- Keep the V3 app running locally before non-dry-run capture.
- Use demo data only.
- Keep the local Postgres database available for provisioned live runs.
- Install `ffmpeg` for demo-ready MP4 output with captions.

Check ffmpeg:

```bash
ffmpeg -version
```

If needed:

```bash
SCREENCAST_FFMPEG=/opt/homebrew/bin/ffmpeg pnpm screencast:journey -- J01
```

## Start The App

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
```

The runner defaults to `http://127.0.0.1:3000`. Override with either:

```bash
BASE_URL=http://127.0.0.1:3020 pnpm screencast:journey -- J01
pnpm screencast:journey -- J01 --base-url=http://127.0.0.1:3020
```

## Run One Journey

Presentation-paced:

```bash
BASE_URL=http://127.0.0.1:3000 SCREENCAST_HEADLESS=false pnpm screencast:journey -- J01 --speed=human-demo
```

The command above provisions J01 data before recording. To validate the data fixture without recording:

```bash
pnpm screencast:journey -- J01 --provision-only
```

To run only the seed/validation command:

```bash
pnpm screencast:seed-journey -- J01
```

Use `--skip-provisioning` only when debugging the recorder against an already-known database state:

```bash
BASE_URL=http://127.0.0.1:3000 pnpm screencast:journey -- J01 --skip-provisioning
```

Fast QA:

```bash
BASE_URL=http://127.0.0.1:3000 pnpm screencast:journey -- J01 --speed=qa-fast
```

Optional fixed run id:

```bash
BASE_URL=http://127.0.0.1:3000 pnpm screencast:journey -- J01 --speed=qa-fast --date=2026-06-15-qa
```

## Run All Journeys

```bash
BASE_URL=http://127.0.0.1:3000 pnpm screencast:all -- --speed=qa-fast
```

## Portfolio Manifests

The original `J01-J10` manifest remains available as the legacy baseline. Customer-video work should use the generated portfolio manifests:

```bash
pnpm screencast:generate-portfolio
pnpm screencast:p0:dry-run
pnpm screencast:p0 -- --speed=human-demo --date=2026-06-16-customer-demo
```

Portfolio layers:

- `P0`: primary customer-sendable demo candidates.
- `P1`: trust-proof appendix candidates for compliance, operations and investor follow-up.
- `P2`: edge/negative proof candidates; QA-first unless promoted deliberately.
- `P3`: proof-family records, not video manifests by default.

To capture P0, P1 and P2 into one run folder, use the same `--date` value for each command and render MP4s after the final capture:

```bash
BASE_URL=http://127.0.0.1:3000 pnpm screencast:p0 -- --speed=human-demo --date=2026-06-16-demo-bundle
BASE_URL=http://127.0.0.1:3000 pnpm screencast:p1 -- --speed=qa-fast --date=2026-06-16-demo-bundle
BASE_URL=http://127.0.0.1:3000 pnpm screencast:p2 -- --speed=qa-fast --date=2026-06-16-demo-bundle
pnpm screencast:mp4
```

Each portfolio journey writes its `portfolioLayer`, `candidateId`, `currentRealityLabel`, `proofLevel`, caveat and proof path into `metadata.json`, `qa-result.json` and the run index.

## Dry-Run Validation

Validate all definitions without opening a browser:

```bash
pnpm screencast:dry-run -- all
```

Validate the primary customer portfolio:

```bash
pnpm screencast:p0:dry-run
```

Dry-run one journey:

```bash
pnpm screencast:journey -- J01 --dry-run
```

## Output Location

Primary run output:

```text
artifacts/screencasts/runs/<run-id>/
  index.md
  index.json
  J01/
    raw-video.webm
    journey.mp4
    captions.srt
    provisioning.json
    run-log.json
    qa-result.json
    storyboard.md
    transcript.md
    manifest.resolved.json
    metadata.json
    trace.zip
    screenshots/
      step-001-*.png
```

Compatibility output:

```text
artifacts/screencasts/J01/
  video.webm
  final.mp4
  captions.srt
  provisioning.json
  run-log.json
  qa-result.json
  storyboard.md
  manifest.resolved.json
  trace.zip
  screenshots/
```

These are generated outputs. Do not treat them as source of truth unless a specific capture is intentionally archived.

## Captions

Every live journey writes `captions.srt`.

`captionMode` in `run-log.json` means:

- `burned-in`: captions are visible in the MP4 image.
- `embedded-track`: captions are embedded as a selectable English subtitle track.
- `unavailable`: MP4 captions failed; the run is not demo-ready.

The runner prefers burn-in via ffmpeg `subtitles`. If that filter is unavailable, it falls back to an embedded `mov_text` subtitle track.

## Provisioning

Every journey has a fixture contract in `docs/v3/journeys.screencast.v3.json`:

- `fixtureId`
- `provisioning`
- per-step `dataRefs`
- per-step `interaction`
- per-step `navigation`

Fixture definitions live in `scripts/screencast/lib/journey-fixtures.ts`.

Live journey sequence:

1. Reset local demo data through `pnpm db:seed`.
2. Validate the fixture records for the selected journey.
3. Write `provisioning.json`.
4. Start browser capture.
5. Execute typed interactions and visible checks.
6. Render captions and MP4.

`provisioning.json` is a hard evidence artifact. A missing required fixture fails the journey before recording.

## Cursor

The visible cursor is injected at recording time. It is not product UI.

Cursor behavior:

- champagne/gold pointer with navy outline
- translucent halo on click
- moves to role/label/text/selector targets before click/select
- keeps its last known position across steps and page navigations
- starts away from the top-left corner so the recording does not show an artificial reset jump
- appears in raw video, screenshots and final MP4

## Inspect A Run

Open:

- `index.md` for the run table
- `storyboard.md` for step captions and screenshots
- `run-log.json` for machine-readable caption mode, warnings and errors
- `captions.srt` for timed captions
- `journey.mp4` for demo-ready video
- `trace.zip` for Playwright trace review

Useful checks:

```bash
ffprobe -hide_banner artifacts/screencasts/runs/<run-id>/J01/journey.mp4
sed -n '1,80p' artifacts/screencasts/runs/<run-id>/J01/captions.srt
```

Extract a frame for caption/cursor inspection:

```bash
ffmpeg -y -ss 00:00:04 -i artifacts/screencasts/runs/<run-id>/J01/journey.mp4 -frames:v 1 artifacts/screencasts/runs/<run-id>/J01/proof-frame.png
```

## Status Meaning

- `passed`: no warnings, no missing expected visible text and no errors.
- `completed_with_warnings`: capture completed but one or more clicks/text checks were fallback, static/manual or missing.
- `failed`: runner hit an error, no raw video, no captions, no MP4 captions or another hard failure.
- `dry_run`: browser was not launched.

Warnings are not hidden. They stay in `run-log.json`, `qa-result.json`, `storyboard.md` and the run index.

## Rerun After UI Changes

1. Run `pnpm visual:contract`.
2. Start the app.
3. Run the affected journey with `--speed=qa-fast`.
4. Inspect `run-log.json`, screenshots and MP4.
5. Run `pnpm screencast:all -- --speed=qa-fast`.

## Known Limits

- Direct route navigation is still present in the current J01-J10 definitions, but now each route hop is explicitly typed with `navigation`. Future stateful passes should convert eligible steps to `navigation: "continue"`.
- Some current UI actions are demo/static and do not persist workflow state; the new fixture and interaction contract makes those gaps visible instead of hiding them.
- Evidence, audit, release, export and workflow effects remain expected/visible proof unless future implementation verifies persistence.
- Real authentication remains intentionally deferred.
