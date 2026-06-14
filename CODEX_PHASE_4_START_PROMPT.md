Read AGENTS.md first.

PHASE_TO_RUN: 4
PHASE_NAME: UX Model Refactor and Visual Alignment

You are working in the existing AlphaVest WealthOS repository. Phase 1–3 are already implemented. The project phase model has changed.

Before making changes:
1. Read AGENTS.md.
2. Read CODEX_TASK_MASTER_V2.md.
3. Read docs/v2/VISUAL_INTERPRETATION_RULES_V2.md.
4. Read all docs/v2/*.
5. Inspect all public/reference/visuals_v2/*.
6. Inspect old boards in public/reference/wireframes_v2_boards/*.
7. Inspect historical boards in public/reference/wireframes_v1/* if present.
8. Audit the existing repo.

Important visual interpretation rule:
The generated visuals contain UI zones and non-UI specification zones. Implement only the actual app/screen/drawer/modal/table/mobile-frame areas as UI. Translate annotations, dev notes, legends, metadata, backstage workflow notes, evidence/audit notes and state examples into logic, docs, tests and state machines. Some visuals are reference-only and should not become client UI.

Produce first:
- docs/v2/EXISTING_PHASE_1_3_AUDIT.md
- docs/v2/DELTA_ANALYSIS_V2.md
- docs/v2/REFACTOR_PLAN_V2.md

Then implement only Phase 4.

Do not build Phase 5 features.
Do not delete working code blindly.
Preserve useful infrastructure.
Refactor anything that conflicts with v2 source of truth.
Centralise permissions, states, evidence and no-unapproved-advice gates.
Run build, lint and tests if available.
Commit with: "Phase 4: refactor to v2 UX model and visual inventory"
