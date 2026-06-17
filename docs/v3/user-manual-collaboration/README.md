# AlphaVest Collaborative Workflow Manual Package V3

This package reframes the AlphaVest WealthOS user manual around collaborative workflow mechanics rather than page-by-page screenshots.

## Purpose

The previous manual sources documented tasks, fields, screenshots, gates, and contextual notes. This package adds the missing operating story: how AlphaVest turns fragmented client, document, signal, recommendation, approval, decision, communication, and export work into one controlled shared state across roles.

## Primary artifacts

- Narrative manual source: `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.md`
- Structured manual source: `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_V3.json`
- QA report: `docs/v3/user-manual-collaboration/ALPHAVEST_COLLABORATIVE_WORKFLOW_MANUAL_QA_REPORT_V3.md`

## Source inputs

- `AGENTS.md`
- `CODEX_MASTER_TASK.md`
- `docs/v3/CODEX_TASKS_DETAILED_V3.md`
- `docs/v3/SCREEN_CATALOGUE_V3.md`
- `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
- `docs/v3/TECHNICAL_IMPLEMENTATION_SEQUENCE_V3.md`
- `docs/v3/PAGEFLOW_USERFLOW_MAPPING_V3.md`
- `docs/v3/DATA_MODEL_V3.md`
- `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- `docs/v3/user-manual-source/user-manual-source.v3.json`
- `docs/v3/user-manual-context/ALPHAVEST_USER_MANUAL_CONTEXTUAL_NARRATIVE_V3.json`
- `docs/v3/user-manual-pdf/source/contextual-manual-pdf-data.json`

## How to use this package

Use this package as the source for the next PDF production prompt. The next PDF should not lead with field tables or isolated screenshots. It should lead with workflow stories, role relays, visibility changes, state transitions, and evidence/audit lineage.

Screenshots should be placed only where they prove a role viewpoint, handoff, blocked state, release gate, or shared-state transition.

## Boundary

This package documents the current demo-data-first source evidence and known workflow intent. It does not certify production persistence, production authentication, real file extraction, real export generation, or complete backend governance transactions.
