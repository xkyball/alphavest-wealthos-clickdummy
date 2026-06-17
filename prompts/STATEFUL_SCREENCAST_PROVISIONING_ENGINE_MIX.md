Max

# Stateful Screencast Provisioning Overhaul — Engine Mix Prompt

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

## Mission

Overhaul the AlphaVest screencast foundation so every screencast journey starts from a known, journey-specific database state and then demonstrates the process through real UI interactions: clicks, text input, select/check actions, confirmation phrases and route transitions. Do not revisit the visual recording layer except where required to execute real interactions.

## Non-Goals

- Do not redesign captions, cursor styling, video encoding or artifact naming unless a data-provisioning change requires metadata updates.
- Do not implement real authentication.
- Do not use real client data.
- Do not turn reference/spec boards into product UI.
- Do not imply production persistence unless the database state is actually created or mutated and then verified.

## Mandatory Sources

Read before editing:

1. `AGENTS.md`
2. `CODEX_MASTER_TASK.md`
3. `docs/v3/CODEX_TASKS_DETAILED_V3.md`
4. `docs/v3/SCREEN_CATALOGUE_V3.md`
5. `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
6. `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
7. `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
8. `docs/v3/DATA_MODEL_V3.md`
9. `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
10. `docs/v3/SCREENCAST_RUNBOOK_V3.md`
11. `docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md`
12. `docs/v3/journeys.screencast.v3.json`
13. `prisma/schema.prisma`
14. `prisma/seed.ts`
15. `scripts/screencast/lib/runner.ts`
16. `scripts/screencast/lib/journey-fixtures.ts`
17. `scripts/screencast/seed-journey.ts`

## Facts To Preserve

- AlphaVest is demo-data-first.
- No unapproved advice reaches the client.
- Advisor approval alone is not client release.
- Compliance release controls advice-like client visibility.
- Evidence and audit claims must be backed by data or clearly marked as expected/future behavior.
- Existing captioned MP4, cursor, SRT, trace, storyboard and run-root output must keep working.

## Required Architecture

Create or complete these layers:

1. **Journey Fixture Contract**
   - Every journey must declare `fixtureId`.
   - Every journey must declare `provisioning`.
   - Every step must declare `interaction`, `navigation` and `dataRefs`.
   - The contract must validate in dry-run.

2. **Database Provisioning**
   - Before every non-dry-run journey, reset to deterministic demo seed data.
   - Then validate that the journey-specific fixture records exist.
   - Write `provisioning.json` beside `run-log.json`.
   - Fail the journey if required fixture data is missing.
   - Keep `--skip-provisioning` as an explicit emergency escape hatch.
   - Provide `--provision-only` for data validation without recording.

3. **Real Interaction Runner**
   - Support `click`, `fill`, `select`, `check`, `press` and `none`.
   - Support `navigation: "goto"` for direct setup route and `navigation: "continue"` for true click-through continuation.
   - Record whether interaction succeeded, failed or fell back.
   - Required interactions must fail the journey, not become soft warnings.

4. **UI State Transitions**
   - Replace static/no-op buttons on the ten screencast paths with real route or state transitions where the product surface already implies the workflow.
   - Add server actions/API route handlers only where needed and keep them demo-scoped.
   - Do not introduce production auth.
   - Use existing Prisma models and demo session context.
   - Add stable accessible labels or `data-testid` only where the existing UI lacks reliable locator semantics.

5. **Journey Rewriting**
   - Convert route-hop/manual steps into real `continue` steps where possible.
   - Use fixture data references for IDs, visible labels and typed text.
   - For form-based flows, include `fill` interactions and then click submit/continue.
   - Keep captions English.

6. **Proof And QA**
   - Run `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm db:validate`, `pnpm visual:contract`.
   - Run `pnpm screencast:dry-run -- all`.
   - Run `pnpm screencast:seed-journey -- J01 --dry-run`.
   - If a local database is available, run `pnpm db:seed` and `pnpm screencast:seed-journey -- J01`.
   - If the app and DB are available, run at least J01 live with provisioning enabled and inspect `provisioning.json`, `run-log.json`, `journey.mp4` and one proof frame.

## Engine Artifacts

### V3 Mission Card

| Field | Decision |
| --- | --- |
| Objective | Turn screencasts from route-based visual tours into deterministic, data-backed process demos. |
| Evidence standard | Database fixture exists before run, UI performs the action, runner records interaction, artifact logs proof. |
| Main risk | Claiming process completion while UI or database still only shows static demo state. |

### Double Diamond

| Phase | Notes |
| --- | --- |
| Discover | Current videos are presentable but many journey steps are route hops or static/no-op controls. |
| Define | The core problem is missing deterministic journey state and missing executable interaction semantics, not video rendering. |
| Develop | Build fixtures, seed validation, interaction types, stateful UI paths and journey rewrites. |
| Deliver | J01-J10 can be rerun from known DB state and prove real interactions with transparent warnings only where product logic is still deferred. |

### Psycho-Logic + Map/Model

- Rational logic: Known seeded records make Playwright runs repeatable and debuggable.
- Psycho-logic: Reviewers trust a demo more when the cursor triggers visible consequences rather than teleporting between pages.
- Current map trap: A route sequence can look like a process even when no process happened.
- Design move: every journey step carries data refs and an interaction type, so the map says exactly what was actually done.

### Reframing Matrix

| Lens | Old frame | New frame |
| --- | --- | --- |
| QA | Does the page render? | Did the known process execute? |
| Demo | Is the video smooth? | Is the walkthrough truthful and reproducible? |
| Data | Use generic demo copy. | Seed journey-specific records before the run. |
| Risk | Hide gaps as direct navigation. | Mark unsupported transitions as warnings until implemented. |

### TRIZ

Contradiction: demos must be deterministic, but real clicks can be flaky if state is unknown.

Resolution principles:

- Prior action: seed known data before interaction.
- Segmentation: each journey owns a fixture.
- Feedback: write provisioning and interaction results into artifacts.
- Intermediary: demo-scoped actions connect UI to existing Prisma models without real auth.

### SIT Closed World

Use existing resources first:

- Prisma schema and seed.
- Demo session role/tenant context.
- Current route registry and components.
- Existing Playwright runner and artifact system.
- Existing workflow, visibility, evidence and audit rules.

### Morphological / CCA

| Dimension | Options | Chosen |
| --- | --- | --- |
| Reset | none, full seed, fixture-only | full deterministic base seed before each journey, then fixture validation |
| Interaction | route-hop, click-only, typed action model | typed action model |
| State proof | screenshots only, DB validation only, both | both |
| Scope | J01 only, J01-J03, J01-J10 | foundation for J01-J10, implement live proof incrementally |

Reject: app-global hidden demo mode that fakes state without DB validation.

### SCAMPER

- Substitute route hops with `navigation: "continue"` where real transitions exist.
- Combine seed validation and run logs.
- Adapt current demo seed IDs as journey fixtures.
- Modify runner to support typed input.
- Put provisioning artifacts to another use: QA evidence.
- Eliminate silent static/manual claims.
- Rearrange run order: seed, validate, interact, verify, render.

### Harvard / BATNA

- Objective criteria: deterministic DB records, successful UI interaction, artifact proof, zero ungrounded persistence claims.
- BATNA: keep direct-route fallback only for unfinished product logic, clearly marked as warning.
- Mutual gain: demo remains watchable while engineering gets precise backlog items.

### MESOs

Offer A: Foundation-first. Build fixture/provisioning/interaction contract now, convert real UI flows journey by journey.

Offer B: J01-first proof. Fully stateful J01, then scale the same pattern.

Offer C: Broad but shallow. Add fixture refs to all J01-J10, keep route hops until Phase 14 wiring.

Preferred: A plus a J01 proof run whenever DB/app are available.

### Measurement Plan

- Manifest validation: all journeys have `fixtureId`, `provisioning`, `interaction`, `navigation`, `dataRefs`.
- Seed validation: fixture refs exist after seed.
- Runner validation: dry-run all and provision-only J01.
- App validation: at least one live journey records `provisioning.status: passed`.
- Regression gates: typecheck, lint, build, db validate, visual contract.

### Ethics & Fairness

- Pass if captions and logs separate actual DB mutations from expected/future workflow effects.
- Fail if a static route hop is presented as a completed approval/release/export.
- Fail if real client data is introduced.
- Fail if no-unapproved-advice gate is weakened.

## Deliverables

- Updated prompt/report docs.
- Updated `docs/v3/journeys.screencast.v3.json`.
- Fixture manifest under `scripts/screencast/lib/`.
- Journey seed command under `scripts/screencast/`.
- Runner provisioning and interaction support.
- Updated runbook and QA/phase reports.
- Verification output and honest limitations.

## Final Response Contract

Report:

- prompt file path,
- changed files,
- commands run,
- which generated prompts were executed,
- what is now implemented,
- what still needs the next stateful UI pass,
- Method Compliance Checklist.
