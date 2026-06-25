# ALPHAVEST WP-00 Source Hierarchy Target Guard Execution

Generated: 2026-06-25
Source upload: `/Users/chris/Downloads/ALPHAVEST_WP00_SOURCE_HIERARCHY_TARGET_GUARD_BOC_TICKET_STRUCTURE.md`
Status: `WP00_GUARD_IMPLEMENTED_WITH_TECHNICAL_CHECK`

## Source Contract

`ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` remains the only operative source of truth. The target implementation baseline is `full-workflow`. `main`, uploaded source snapshots, visual media packages and previous prompt packs are false-gap or historical context only, never target truth.

The approved implementation mode is `Documentation + technical script/check`. Christoph approved the technical guard on 2026-06-25. The guard command is:

```bash
pnpm guard:source
```

The guard is supported by:

- `lib/source-reality-gate.ts`
- `scripts/source-target-guard.ts`
- `tests/source-reality-gate.spec.ts`
- `package.json` script `guard:source`

## Extracted Task Chain

### WP-00 Epic: Source Hierarchy & Target Codebase Guard

Type: Epic.

Purpose: Ensure later AlphaVest Codex and refactoring work is derived only from the locked source hierarchy, correct target codebase and non-negotiable stop rules.

Goal: Create a reviewable guardrail layer that enforces `full-workflow` as target truth, blocks `main` as target, prevents documentation/visual/presence overclaims and protects future execution against source, scope, safety and generation drift.

Scope: source-of-truth hierarchy, `full-workflow` target guard, `main` false-gap treatment, no screen/state/image generation, no blind schema replacement, no route/scope reclassification, no safety overclaims, documentation/instruction/start-command updates and an approved technical guard.

Out of scope: feature implementation, UI/screen work, navigation rebuild, API changes, Prisma/schema/migration changes, product-logic tests, P1/Hold/Reference scope changes and image/screen/state-screen generation.

Completion criteria: relevant guard surfaces identified, clear guard spec approved, future Codex execution cannot start without guardrails, `main` target use is blocked, no-generation/no-schema/no-scope-reclassification rules are visible, technical checks are implemented, and WP-01 can start without false target truth.

### ANALYSIS-00.1: Audit Current Source Hierarchy, Guard Surfaces And Codex Entry Points

Type: Analysis / Research / Spike.

Detailed description: Audit the current repo and instruction surface before implementation so WP-00 does not guess which files control Codex. The task answers which root/instruction files steer execution, whether current guardrails already exist, where `main`, old false gaps, stale docs, visual generation, patch schema or documentation overclaims could re-enter, and whether existing tests/scripts can validate the guard.

Scope: inspect source artefacts and repo-entry docs; identify guardrail surfaces; classify each candidate file as update required, confirm only, do not touch, superseded or optional technical guard candidate; produce task split and CTES estimates.

Execution result: Complete. Candidate surfaces are `AGENTS.md`, `CODEX_MASTER_TASK.md`, `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`, `README.md`, `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`, `lib/source-reality-gate.ts`, `tests/source-reality-gate.spec.ts` and `package.json`. `README_CODEX_HANDOFF_V3.md` is superseded and confirm-only.

### SPEC-00.2: Source Hierarchy, Target Codebase And Execution Guard Contract

Type: Specification / Design / Acceptance Criteria.

Detailed description: Define the binding guard contract so later implementation cannot leave source, scope, safety or generation decisions to Codex. The contract covers source hierarchy, target codebase, `main` blocker, visual/screen-generation blocker, schema-replacement blocker, scope-reclassification blocker, safety-overclaim blocker, file/update boundaries and acceptance criteria.

Target state: every future task has a visible source-hierarchy reference; `full-workflow` is the only target implementation baseline; `main` is blocked as target truth; PNGs are visual references only; schema presence and API presence are not proof; Codex cannot reclassify routes, elevate P1/Hold/Reference routes, generate screens/images or weaken safety gates.

Accepted technical guard mode: required for WP-00 completion. The guard scans active execution/entrypoint docs only and avoids archive/reference files to reduce false positives.

Execution result: Complete. This document is the extracted task/spec artefact, and the technical guard implementation encodes the contract.

### DECISION-00.3: Approve WP-00 Guard Policy And Implementation Mode

Type: Decision / Approval.

Detailed description: Review and approve the guard policy and choose implementation mode: documentation-only, documentation plus checklist, or documentation plus technical script/check. This prevents guardrails that are too soft, too broad or not testable.

Decision: Approved. Implementation mode is `Documentation + technical script/check`.

File boundaries: documentation/instruction files may be updated; technical validation may be added to source-reality guard files; no product UI, route metadata, API, schema, Prisma migration or visual asset changes are authorized by WP-00.

Execution result: Complete based on Christoph's explicit approval: "technischer guard ist freigegeben".

### IMPL-00.4: Implement Documentation And Instruction Guardrails

Type: Implementation / Execution.

Detailed description: Update approved repo/handoff/instruction files so they explicitly enforce the WP-00 source hierarchy, target codebase and stop rules. This makes guardrails visible and binding at the places where humans or Codex start work.

Scope: root/agent/handoff docs; target-codebase rule; `main` blocker; no-generation rule; no-schema-replacement rule; route-scope preservation rule; safety-overclaim rules; P0 proof reminder for safety-critical tasks.

Execution result: Complete. `AGENTS.md`, `CODEX_MASTER_TASK.md`, `README.md` and this WP-00 execution document now expose the technical guard and source/target contract. Existing `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` and `README_CODEX_HANDOFF_V3.md` remain superseded blocker files and were not expanded into new authority.

#### Subtask 1.4.1: Update Root/Agent/Handoff Guard Instructions

Detailed description: Add/update concise source hierarchy and stop-rule language in approved root/agent/handoff files so Codex receives guardrails at first read.

Execution result: Complete. `AGENTS.md` now requires `pnpm guard:source` after moving-baseline preflight, and `CODEX_MASTER_TASK.md` marks guard failure as stop-and-report.

#### Subtask 1.4.2: Update Codex Start/Run Guard Language

Detailed description: Update Codex start/run docs so execution cannot start without target and stop-rule confirmation.

Execution result: Complete. `CODEX_MASTER_TASK.md` now requires `pnpm guard:source` before downstream WP execution and blocks edits if the guard fails.

#### Subtask 1.4.3: Add Source-Hierarchy Checklist Or Guardrail Reference

Detailed description: Create/update a concise source-hierarchy checklist/reference for future work packages.

Execution result: Complete. This document is the reusable WP-00 reference, and `README.md` documents `pnpm guard:source` plus `pnpm test:source-reality`.

### IMPL-00.5: Implement Optional Technical Validation Guard

Type: Implementation / Execution.

Detailed description: Add a minimal technical validation guard, once approved, to detect forbidden target-source or execution-risk patterns before downstream Codex work proceeds. It must be machine-checkable without changing app behaviour.

Scope: validation command; active implementation/start files only; direct `main` target references; unauthorized generation instructions; blind patch-schema/schema replacement instructions; preservation of `full-workflow` target references.

Out of scope: runtime app guard, production security control, CI enforcement, feature tests, route/API/schema modification.

Execution result: Complete. The guard is implemented as `pnpm guard:source`, backed by `scripts/source-target-guard.ts` and `evaluateTrueUxTechnicalGuard()`.

#### Subtask 1.5.1: Add Source/Target Validation Script Or Checklist Command

Detailed description: Add a minimal source/target validation script or command that returns clear pass/fail output and scans only approved files.

Execution result: Complete. `scripts/source-target-guard.ts` runs the guard and emits JSON pass/fail output. `package.json` exposes it as `guard:source`.

#### Subtask 1.5.2: Add Guardrail Test Or Static Validation Where Feasible

Detailed description: Add a small test/static assertion so the guard itself is reviewable and does not create false confidence.

Execution result: Complete. `tests/source-reality-gate.spec.ts` checks the command wiring, target scan set and positive/negative sample behaviour for allowed stop-rule wording versus forbidden target drift.

### QA-00.6: Validate WP-00 Guardrails Against Stop Rules And Downstream Readiness

Type: QA / Validation / Review.

Detailed description: Verify that WP-00 actually protects against false target truth and unapproved changes, without introducing unauthorized app/product changes.

Validation checklist:

- `full-workflow` remains the target codebase.
- `main` remains false-gap/historical warning only.
- No active instruction treats `main` as target truth.
- No active instruction authorizes screen/image/state-screen generation.
- No active instruction authorizes blind patch-schema replacement.
- No active instruction allows Codex route/scope reclassification.
- Safety stop rules remain present.
- WP-01 can cite WP-00 as preflight guard.

Execution result: Complete. Guard and source-reality checks pass. No UI, route, API, schema, Prisma migration or visual asset changes were made.

## Technical Guard Contract

The technical guard scans:

- `AGENTS.md`
- `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md`
- `CODEX_MASTER_TASK.md`
- `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`
- `README.md`

The technical guard blocks:

- `main` as target branch, target truth, implementation source or source of truth.
- screen/image/state-screen/visual asset generation as an affirmative instruction.
- blind schema replacement or patch-schema adoption as an affirmative instruction.
- P1, reference-only or hold route promotion into MVP without policy support.
- missing `guard:source` or `test:source-reality` script wiring.
- missing active `full-workflow` and True-UX handoff markers.

The technical guard allows:

- negative stop-rule wording such as "Do not use main as target truth".
- false-gap warnings.
- "No blind schema replacement" style blocker language.
- "Do not generate images" style blocker language.

## Validation Evidence

Commands run:

```bash
pnpm guard:source
pnpm test:source-reality
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm build
```

Current result: guard/source/typecheck/lint/db/build pass. Lint still reports pre-existing warnings only and zero errors. Build still reports the existing Turbopack/NFT warnings around `lib/document-storage-adapter.ts`.

## Downstream Recommendation

For WP-01+, start every execution with:

```bash
git status --short
git branch --show-current
git log -1 --oneline
git diff --stat
cat package.json
pnpm guard:source
```

If `pnpm guard:source` fails, stop before implementation and classify the finding as one of:

- `SOURCE_TARGET_DRIFT`
- `UNAUTHORIZED_GENERATION_DRIFT`
- `BLIND_SCHEMA_DRIFT`
- `ROUTE_SCOPE_RECLASSIFICATION_DRIFT`
- `GUARD_SCRIPT_WIRING_DRIFT`

## Engine Method Notes

Facts: the upload defines WP-00 as a foundation guard with analysis, specification, decision, implementation and QA. The repo already contains the True-UX handoff and source-reality gate. Christoph approved the technical guard.

Assumptions: no extra human decision is needed for checklist placement because a repo-local document plus README/Codex entrypoint references is low-risk and reversible.

V3 weak branch killed: documentation-only was rejected because it remains too easy for later agents to ignore. Broad archive scanning was rejected because it would create false positives from historical/reference documents.

Ethics/fairness: the guard blocks only source/target/safety drift; it does not hide decisions, coerce acceptance, or change user-facing product behaviour.
