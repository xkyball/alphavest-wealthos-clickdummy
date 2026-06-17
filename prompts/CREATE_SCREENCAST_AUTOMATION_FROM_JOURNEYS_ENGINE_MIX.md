# Create Screencast Automation From Journey Playbook

Use `ENGINE_MIX_V2_CODEX_V3_PROOF`.

Goal:
Create all artifacts needed to automatically turn the documented AlphaVest WealthOS user journeys into human-paced demo screencasts, QA evidence, and implementation-ready documentation.

Repository:
`/Users/chris/projects/alphavest-wealthos-clickdummy`

## Engine Dispatch

Load `engine-mixed-v2-v3-methodology` before planning or editing.

Use ENGINE_v2 as the primary design and implementation stack:
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
- Debate
- Adversarial QA
- Proof Paths
- Learning Log

Separate strictly:
- facts
- assumptions
- interpretations
- implementation decisions
- open questions

Do not invent product functions, routes, screens, roles, data, compliance claims, workflow states, evidence events, audit events, or click paths.

## Mandatory Source Reading

Read these files before making decisions:

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
- UI references in `public/reference/page_ui_v3/clean_pages/`

Also inspect the implementation surface:

- `package.json`
- `app/`
- `components/`
- `lib/`
- `prisma/`
- existing `tests/`
- existing `scripts/`
- route, status, permission, workflow, evidence, audit, and demo-data helpers

## Non-Negotiable Project Rules

- Only document and automate real app UI.
- Do not include spec panels, route labels, filenames, annotation rails, dev notes, or reference-board chrome in app interactions.
- Demo-data-first only.
- Do not start real authentication.
- Account for demo session, role switcher, and tenant switcher.
- No real client data.
- No unapproved advice to the client.
- Advisor approval alone is not enough.
- Compliance release controls client visibility.
- Important actions should create evidence where implemented.
- Sensitive actions should create audit events where implemented.
- If the current app is static or clickdummy-only, distinguish expected product behavior from implemented UI behavior.
- Centralize route, status, permission, workflow, evidence, and audit assumptions in generated artifacts.

## Required Outcome

Create a complete journey-to-screencast system that can be run by Codex or a developer.

The system must support:

1. Reading the ten journeys from `docs/v3/USER_JOURNEY_PLAYBOOK_V3.md`.
2. Converting each journey into a machine-readable screencast definition.
3. Running one journey by id.
4. Running all journeys.
5. Capturing step screenshots.
6. Capturing a browser video.
7. Producing a human-readable transcript per journey.
8. Producing QA results per journey.
9. Optionally converting browser video to MP4 when `ffmpeg` is available.
10. Writing a runbook that explains exactly how to start the process and where videos land.

## Required Files To Create Or Update

Create or update these artifacts as needed:

- `docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md`
- `docs/v3/SCREENCAST_RUNBOOK_V3.md`
- `docs/v3/SCREENCAST_QA_REPORT_V3.md`
- `docs/v3/journeys.screencast.v3.json`
- `scripts/screencast/run-journey.ts`
- `scripts/screencast/run-all.ts`
- `scripts/screencast/lib/` helper modules if useful
- `scripts/screencast/render-mp4.ts` if MP4 conversion is implemented
- `package.json` scripts for running the screencasts
- `docs/v3/PHASE_EXECUTION_REPORT.md` if implementation artifacts are changed
- `docs/v3/IMPLEMENTATION_QA_REPORT.md` if implementation artifacts are changed

Do not change app UI code unless it is strictly necessary for testable selectors or the user explicitly approves it. If a selector or screen is missing, document the limitation and prefer a non-invasive runner fallback.

## Required Package Scripts

Add scripts similar to these, adapted to the existing stack:

- `screencast:journey`
- `screencast:all`
- `screencast:mp4`, only if MP4 rendering is implemented

The runbook must explain example commands, for example:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
BASE_URL=http://127.0.0.1:3000 pnpm screencast:journey -- J01
BASE_URL=http://127.0.0.1:3000 pnpm screencast:all
```

Use the actual final command syntax from the implemented scripts.

## Output Location Contract

All generated video and QA artifacts must land under:

`artifacts/screencasts/`

Use one folder per journey:

`artifacts/screencasts/<journey-id>/`

Each journey folder should contain, where possible:

- `video.webm`
- `final.mp4`, if MP4 conversion succeeds
- `transcript.md`
- `qa-result.json`
- `screenshots/`
- `screenshots/<step-number>-<slug>.png`
- `metadata.json`

The runbook must state that these artifacts are generated outputs and should not be treated as source of truth unless the repo explicitly tracks them.

## Screencast Definition Contract

Create `docs/v3/journeys.screencast.v3.json` with exactly ten journeys from `USER_JOURNEY_PLAYBOOK_V3.md`.

Each journey entry must include:

- `id`
- `name`
- `primaryActor`
- `tenant`
- `startRoute`
- `endState`
- `demoSession`
- `queryParams`
- `preconditions`
- `demoData`
- `visibilityRules`
- `complianceRules`
- `evidenceExpectations`
- `auditExpectations`
- `riskNotes`
- `steps`

Each step must include:

- `step`
- `role`
- `tenant`
- `route`
- `screen`
- `inputData`
- `action`
- `target`
- `expectedVisibleText`
- `expectedStateChange`
- `blockedActions`
- `clientVisibility`
- `evidence`
- `audit`
- `qaAssertion`
- `pauseMs`
- `screenshotName`
- `manualOrStatic`, when the action cannot be automated safely
- `sourceProof`

Use only values grounded in the playbook, route registry, data model, screen catalogue, existing code, or visible UI references.

## Runner Behavior

Implement the runner with Playwright unless the existing project clearly uses a different browser testing library.

Preferred behavior:

- Use `BASE_URL`, defaulting to `http://127.0.0.1:3000`.
- Before running, check that the app is reachable.
- If the app is not reachable, fail with a clear message that tells the user to start the dev server.
- Use a desktop viewport suitable for demo recording.
- Capture Playwright video.
- Capture screenshots at meaningful step boundaries.
- Use robust locators: role, label, text, accessible name, and stable data attributes where already present.
- Do not add data attributes unless necessary and documented.
- Use route navigation when the UI path is not yet clickable, but record that fallback in `qa-result.json`.
- Do not claim persistence, evidence creation, audit creation, workflow advancement, or compliance release unless implemented or verified.
- Mark implemented, expected, simulated, static, blocked, and unverified behavior separately.

Human-paced defaults:

- after navigation: 900-1400 ms
- before a click: 300-700 ms
- after a click: 1200-2500 ms
- after form input: 500-1000 ms
- key decision screen: 2500-4000 ms
- blocked or compliance state: 2500-4000 ms

Use deterministic values unless randomization is explicitly useful for a natural recording. If randomization is used, record the seed in `metadata.json`.

## Documentation Requirements

`docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md` must include:

- Mission Card
- Evidence Intake
- current implementation facts
- assumptions
- rejected options
- chosen architecture
- route and data dependency map
- artifact map
- measurement plan
- ethics and fairness notes
- implementation sequence

`docs/v3/SCREENCAST_RUNBOOK_V3.md` must explain:

- what the screencast system does
- prerequisites
- how to start the app
- how to run one journey
- how to run all journeys
- where videos land
- how to inspect screenshots and QA JSON
- how MP4 conversion works, if available
- how to rerun after a UI change
- known limitations
- how to avoid accidentally recording spec/reference chrome

`docs/v3/SCREENCAST_QA_REPORT_V3.md` must include:

- journey coverage table
- route coverage
- role coverage
- tenant/demo-session coverage
- compliance-gate coverage
- evidence/audit coverage
- client-visibility coverage
- automation confidence per journey
- blocked/unverified behavior
- Adversarial QA
- Proof Paths
- Learning Log

## Required Adversarial QA

Explicitly answer:

- Which journey or step might still look invented?
- Which clicks are not proven from the app UI?
- Which expected workflow effects are documentation-only?
- Which screens are UI references rather than implemented product surfaces?
- Where is there risk of recording spec chrome, route labels, or annotation rails?
- Where could a screencast imply unapproved advice to a client?
- Where could advisor approval be confused with compliance release?
- Where could client visibility be shown too early?
- Which evidence or audit expectations are not implemented?

## Required Proof Paths

For every journey, list:

- source journey file and section
- route or component proof
- demo-data proof
- compliance or workflow proof
- evidence or audit proof
- screenshot or browser check required
- automation confidence

Use file paths and, when possible, line references.

## Verification

Run all checks that are available and relevant after implementation.

Minimum expected checks:

```bash
pnpm typecheck
pnpm lint
pnpm visual:contract
```

Also run at least one dry run or smoke run of the screencast runner if technically possible.

If a dev server is needed, either:

- start it and run a short screencast smoke test, or
- document exactly why the smoke test was not run.

Never leave required long-running sessions active at the end.

## Final Response Required From The Implementing Agent

End with:

- changed files
- generated or expected output folders
- exact commands to start the process
- where the videos land
- checks run
- blocked checks
- open risks/TODOs
- Method Compliance Checklist for ENGINE_v2 + ENGINE_v3

Keep the final response concise, but include the run commands and the output folder explicitly.
