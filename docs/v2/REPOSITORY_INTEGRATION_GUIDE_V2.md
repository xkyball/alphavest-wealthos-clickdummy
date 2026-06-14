# Repository Integration Guide — AlphaVest WealthOS Codex Handoff v2 FULL

This package is meant to be copied into an existing AlphaVest WealthOS repository where Codex Phase 1–3 have already been implemented.

## Critical clarification

The images in `public/reference/visuals_v2/` are **not** simple screenshots to copy 1:1 into HTML/CSS.

Most visuals contain two kinds of information:

1. **UI implementation zone** — the actual app screen, mobile frame, dashboard, table, drawer, modal, matrix or service view that should become React/Tailwind UI.
2. **Specification/annotation zones** — callouts, legends, dev handoff notes, workflow explanations, permission notes, evidence mapping, audit notes, state examples and metadata.

Codex must implement the UI implementation zone as interface, but translate annotation zones into:

- component props,
- state machines,
- permission helpers,
- test cases,
- documentation,
- mock data,
- route logic,
- evidence/audit events,
- blocked/error/loading/empty states.

Some visuals are **reference-only** and should not become normal app pages unless the route intentionally exposes a reference view. Examples:

- V2-043 Permission Matrix Reference Board
- V2-048 End-to-End Service Blueprint — Full Swimlane View
- V2-049 Evidence Chain View
- V2-050 Escalation / Returns View
- V2-054 Global State Chip / Workflow Badge Reference Board
- V2-055 State Machine Reference Board
- V2-056 Evidence / Audit Mapping Reference Board

## Recommended integration process

### Step 0 — Create a branch

```bash
git checkout -b phase-4-v2-ux-refactor
```

### Step 1 — Back up current handoff files

If your repo already has these files, keep a backup before overwriting:

```bash
cp AGENTS.md AGENTS.pre-v2.md 2>/dev/null || true
cp CODEX_TASK_MASTER.md CODEX_TASK_MASTER.pre-v2.md 2>/dev/null || true
```

### Step 2 — Copy package contents into the repo root

From inside this extracted package folder:

```bash
rsync -av ./docs/v2/ <YOUR_REPO>/docs/v2/
rsync -av ./public/reference/ <YOUR_REPO>/public/reference/
cp ./AGENTS.md <YOUR_REPO>/AGENTS.md
cp ./CODEX_TASK_MASTER_V2.md <YOUR_REPO>/CODEX_TASK_MASTER_V2.md
cp ./CODEX_PHASE_4_START_PROMPT.md <YOUR_REPO>/CODEX_PHASE_4_START_PROMPT.md
cp ./COPY_PASTE_CODEX_START_COMMAND.md <YOUR_REPO>/COPY_PASTE_CODEX_START_COMMAND.md
cp ./README_CODEX_HANDOFF_V2.md <YOUR_REPO>/README_CODEX_HANDOFF_V2.md
```

If you have important existing custom instructions in `AGENTS.md`, merge them manually into the new file instead of overwriting blindly.

### Step 3 — Verify visual files are present

```bash
find public/reference/visuals_v2 -type f -name 'V2-*.png' | sort
```

You should see V2-001 through V2-056. A few planned states that were not originally image-generated are included as clearly marked placeholder visuals so the manifest remains complete.

### Step 4 — Verify manifests

Important files:

```text
docs/v2/VISUAL_ASSET_MANIFEST_V2.md
docs/v2/VISUAL_ASSET_MANIFEST_V2.json
docs/v2/PAGE_VISUAL_INVENTORY_V2.md
docs/v2/VISUAL_INTERPRETATION_RULES_V2.md
```

### Step 5 — Start Codex Phase 4

Use the content of:

```text
CODEX_PHASE_4_START_PROMPT.md
```

or copy the shorter command from:

```text
COPY_PASTE_CODEX_START_COMMAND.md
```

### Step 6 — Review what Codex produces first

Codex must first generate:

```text
docs/v2/EXISTING_PHASE_1_3_AUDIT.md
docs/v2/DELTA_ANALYSIS_V2.md
docs/v2/REFACTOR_PLAN_V2.md
```

Review those before continuing with larger refactors.

### Step 7 — Only then allow Phase 4 implementation

Phase 4 is **not** a feature build. It is:

```text
UX Model Refactor and Visual Alignment
```

Codex must not start Phase 5 client-feature rebuilds until Phase 4 QA passes.

## Overwrite or merge?

Recommended:

- `docs/v2/*`: safe to add or overwrite, because it is new v2 handoff content.
- `public/reference/visuals_v2/*`: safe to add or overwrite with the package files.
- `public/reference/wireframes_v2_boards/*`: safe to add or overwrite with the package files.
- `AGENTS.md`: merge if you have existing repo-specific rules; otherwise replace.
- `CODEX_TASK_MASTER_V2.md`: add new file; do not delete old `CODEX_TASK_MASTER.md`.
- `CODEX_PHASE_4_START_PROMPT.md`: add new file.
- Existing app code: do not overwrite manually. Let Codex audit and refactor after the delta plan.

## Phase 4 acceptance criteria

Phase 4 is done only when:

- existing Phase 1–3 implementation has been audited,
- delta analysis exists,
- refactor plan exists,
- routes map to v2 screen specs,
- permission/state/evidence helpers are centralised or planned,
- no-unapproved-advice gate is protected,
- visual interpretation rules are followed,
- build/lint/tests pass or failures are documented,
- Phase 4 QA report is created.
