# ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md


**Generated:** 2026-06-21

**Mode:** Codex Prompt Pack only. Keine Codeänderung in diesem Artefakt. Keine Codex-Ausführung in diesem Artefakt. Keine Screen-/Image-/State-Screen-Generation.

**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`

**Target branch:** `full-workflow`


---


## 1. Executive Decision


**Decision:** `SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK_ACCEPTED_FOR_PHASED_CODEX_EXECUTION`


Dieses Artefakt übersetzt den akzeptierten Release Phase Plan in ein phasenbasiertes Codex Prompt Pack. Es autorisiert selbst keine Codeausführung in dieser ChatGPT-Antwort; es stellt Copy/Paste-ready Codex-Prompts für spätere, phasenweise Ausführung bereit. Codex darf später nur die im Release Plan ausdrücklich mit `AUTHORIZED_*` markierten Tasks/Subtasks bearbeiten. P1, Hold, Reference-only, `main`-derived, Screen-/Image-/State-Screen-Generation, blinde API-/Schema-/Migrationstasks und unspecified Work bleiben blockiert.


Kernumfang: 15 Phase Prompts P00–P14, 33 autorisierte Master Tasks, 147 autorisierte Subtasks, Global Start Prompt, Final QA/Regression Prompt, Do-Not-Implement Register, Reporting-Template und Validation-Discovery-Regeln.


## 2. Source-of-Truth Lock

| Rank | Source | Role | Allowed Use | Forbidden Use |
| --- | --- | --- | --- | --- |
| 1 | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md | Release-Plan / höchste Freigabequelle | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 2 | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md | Detailplan / Tasks und Subtasks | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 3 | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN.md | SCF-Implementierungsplan / Phasenmodell | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 4 | ALPHAVEST_E2E_FLOW_CLOSURE_MATRIX.md | E2E-Flows / Build Path | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 5 | ALPHAVEST_ORPHAN_UI_FALSE_COMPLETENESS_REGISTER.md | Orphans / False Completeness / Hide Remove Static Defer Hold | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 6 | ALPHAVEST_CUSTOMER_SIGNAL_THREAD_MAP.md | Customer / Signal / Governance / Trust Threads | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 7 | ALPHAVEST_CAPABILITY_CLOSURE_MATRIX.md | Capability Closure | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 8 | ALPHAVEST_SCREEN_AFFORDANCE_INVENTORY.md | Screen Affordance Inventory | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 9 | ALPHAVEST_SCREEN_CAPABILITY_SIGNAL_CLOSURE_CONCEPT_AND_PLAN.md | SCF-Konzept und Methode | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 10 | FINAL_CODEX_IMPLEMENTATION_HANDOFF.md | historischer Handoff-Rahmen / Stop Rules | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 11 | FINAL_CODEX_TASK_MASTER.md | historische Task-Basis / Rebase only | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 12 | P0_TEST_ACCEPTANCE_MATRIX.md | P0 Test- und Acceptance-Basis | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 13 | SCHEMA_FIELD_LEVEL_RECONCILIATION.md | Schema-/Field-Mapping | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 14 | API_CONTRACT_MATRIX.md | API-Kontrakte | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 15 | RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md | RBAC / Visibility / Advice Boundary | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 16 | EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md | Evidence / Audit / Export | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 17 | FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md | Feedback / Validation / Error States | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 18 | DRAWER_MODAL_INTERACTION_CONTRACT.md | Drawer / Modal / Interaction | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 19 | STATE_SCREEN_SPEC.md | State-Screen-Spec | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 20 | ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md | Route / Screen / Visual Matrix | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 21 | ROUTE_SCOPE_LOCK.md | Route Scope Lock | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 22 | MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md | Missing / State Decision Log | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 23 | ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md | Interaction Reality Audit | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 24 | ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md | Route / Visual / State Reconciliation | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 25 | alphavest-wealthos-clickdummy-full-workflow.zip | primäre Code-Realität / full-workflow | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 26 | alphavest_mvp_artifact_completion_patch.zip | Control Spec | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |
| 27 | alphavest-wealthos-clickdummy-main.zip | false-gap source only | use only within stated source hierarchy | do not override higher-ranked source; no implementation proof unless code-reality verified |


## 3. Predecessor Intake Matrix

| Artefact | Exists? | Role | Key Counts / Decisions | Blocking Issues | Use in Prompt Pack |
| --- | --- | --- | --- | --- | --- |
| ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md | YES | Release-Plan / höchste Freigabequelle | 15 phases, 33 master tasks, 147 subtasks parsed from release matrix. | none observed in /mnt/data | binding input |
| ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md | YES | Detailplan / Tasks und Subtasks | Direct detail-plan predecessor; expected 15 phases, 33 tasks, 147 subtasks. | none observed in /mnt/data | binding input |
| ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN.md | YES | SCF-Implementierungsplan / Phasenmodell | Binding context for traceability and scope. | none observed in /mnt/data | binding input |
| ALPHAVEST_E2E_FLOW_CLOSURE_MATRIX.md | YES | E2E-Flows / Build Path | 4 E2E flows expected; verify during P00. | none observed in /mnt/data | binding input |
| ALPHAVEST_ORPHAN_UI_FALSE_COMPLETENESS_REGISTER.md | YES | Orphans / False Completeness / Hide Remove Static Defer Hold | 519 orphan/false-completeness risks expected; verify during P00. | none observed in /mnt/data | binding input |
| ALPHAVEST_CUSTOMER_SIGNAL_THREAD_MAP.md | YES | Customer / Signal / Governance / Trust Threads | Binding context for traceability and scope. | none observed in /mnt/data | binding input |
| ALPHAVEST_CAPABILITY_CLOSURE_MATRIX.md | YES | Capability Closure | 522 capability mappings expected; verify during P00. | none observed in /mnt/data | binding input |
| ALPHAVEST_SCREEN_AFFORDANCE_INVENTORY.md | YES | Screen Affordance Inventory | 522 affordances expected; verify during P00. | none observed in /mnt/data | binding input |
| ALPHAVEST_SCREEN_CAPABILITY_SIGNAL_CLOSURE_CONCEPT_AND_PLAN.md | YES | SCF-Konzept und Methode | SCF closure method and stop rules. | none observed in /mnt/data | binding input |


## 4. Codex Prompt Pack Derivation Method

1. Lock Source-of-Truth with the Release Plan at rank 1.
2. Parse Release Plan phase overview, task matrix and subtask matrix.
3. Verify expected counts: 15 phases, 33 master tasks, 147 subtasks.
4. Convert each phase into one Copy/Paste-ready Codex phase prompt.
5. Include only authorized tasks/subtasks in each phase prompt.
6. Preserve dependency order and stop-after-phase reporting.
7. Add target area verification before editing.
8. Add positive and negative acceptance per phase/task.
9. Add validation command discovery from `package.json`.
10. Add phase proof package and reporting templates.
11. Add Do-Not-Implement Register.
12. Do not execute Codex and do not implement anything in this artefact.


## 5. Implementation Authorization Boundary Imported from Release Plan

Implementation is authorized later only for tasks/subtasks explicitly listed in this prompt pack with Release Plan `AUTHORIZED_*` status. This includes implementation, cleanup, test implementation, existing API hardening and schema-alignment-without-blind-migration only where explicitly listed.

Implementation remains not authorized for deferred, hold, reference-only, do-not-implement, main-derived, screen-generation, state-screen-generation, image-generation, blind API creation, blind schema replacement, migration without explicit evidence-backed authorization, or unspecified work.


## 6. Codex Global Rules


### Codex may later

* Use only `full-workflow` as target codebase.
* Work only on the currently selected phase prompt.
* Implement only authorized Task IDs/Subtask IDs in that phase.
* Verify target files/areas before editing.
* Harden existing APIs/schema usage only when authorized.
* Add/update tests when authorized.
* Stop and report after each phase.



### Codex must not


* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.


## 7. Repository Discipline and Branch Rules

* Target repo/branch is `full-workflow`.
* Codex must inspect repository root, `package.json`, `lib/route-registry.ts`, route rendering, APIs, Prisma schema and tests before editing in P00.
* If branch operations are available, use a dedicated work branch; otherwise report the environment limitation.
* Never derive target work from `main`.


## 8. Global Stop Rules

* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.


## 9. Validation Command Discovery Rules

1. Read `package.json` first and discover actual scripts.
2. Use only commands that exist or standard package/tool commands confirmed by project files.
3. If a command is missing, report `COMMAND_NOT_FOUND` or `COMMAND_TO_VERIFY`; do not invent replacement scripts.
4. Typical categories to verify when present: install, typecheck, lint, build, Prisma validate/generate, unit/API tests, Playwright route/E2E tests, targeted P0 negative tests, route smoke.


## 10. Reporting Requirements

| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |


## 11. Phase Execution Overview

| Prompt ID | Phase | Purpose | Authorized Task IDs | Authorized Subtask Count | Must Run After | Must Stop Before | Output Report |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CODEX-P00 | P00 | Repo / Artefact Intake & Baseline Verification | SCF-P00-T001, SCF-P00-T002 | 6 | none | P01 | P00 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P01 | P01 | SCF Normalization & Task Rebase | SCF-P01-T001, SCF-P01-T002 | 6 | P00 | P02 | P01 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P02 | P02 | Hide / Remove / Static / Defer / Hold Cleanup | SCF-P02-T001, SCF-P02-T002 | 8 | P00 → P01 | P03 | P02 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P03 | P03 | Foundation: User / Tenant / Role / Object Scope | SCF-P03-T001, SCF-P03-T002 | 10 | P01 → P02 | P04 | P03 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P04 | P04 | Primary Customer Need Flow: Evidence Request → Upload → Review | SCF-P04-T001, SCF-P04-T002, SCF-P04-T003 | 15 | P02 → P03 | P05 | P04 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P05 | P05 | Advisory Signal Flow: Signal → Analyst → Internal Draft → Advisor | SCF-P05-T001, SCF-P05-T002, SCF-P05-T003 | 15 | P03 → P04 | P06 | P05 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P06 | P06 | Compliance Release / Block / Request Evidence | SCF-P06-T001, SCF-P06-T002 | 10 | P04 → P05 | P07 | P06 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P07 | P07 | Client Visibility and Decision Projection | SCF-P07-T001, SCF-P07-T002 | 10 | P05 → P06 | P08 | P07 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P08 | P08 | Governance / Admin Non-Bypass / Cross-Tenant Denial | SCF-P08-T001, SCF-P08-T002 | 10 | P06 → P07 | P09 | P08 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P09 | P09 | Export / Redaction Trust Output | SCF-P09-T001, SCF-P09-T002 | 10 | P07 → P08 | P10 | P09 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P10 | P10 | UI Interaction Completeness | SCF-P10-T001, SCF-P10-T002, SCF-P10-T003 | 15 | P08 → P09 | P11 | P10 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P11 | P11 | API / Schema / Persistence Hardening | SCF-P11-T001, SCF-P11-T002 | 10 | P09 → P10 | P12 | P11 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P12 | P12 | P0 Positive / Negative Test Closure | SCF-P12-T001, SCF-P12-T002 | 10 | P10 → P11 | P13 | P12 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P13 | P13 | Proof Package and QA | SCF-P13-T001, SCF-P13-T002 | 6 | P11 → P12 | P14 | P13 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P14 | P14 | Codex Prompt Pack / Rebased Final Handoff Derivation | SCF-P14-T001, SCF-P14-T002 | 6 | P12 → P13 | final QA / handoff | P14 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |


## 12. Dependency and Sequencing Rules

1. Run P00 before any implementation phase.
2. Run P01 before cleanup or feature work.
3. Run P02 cleanup/static/hide/remove/defer/hold controls before building new behaviour.
4. Run P03 foundation before evidence/advice/client flows.
5. Run P04 before compliance release.
6. Run P05 before advisor/compliance signal handoff acceptance.
7. Run P06 before client visibility.
8. Run P07 before export/share.
9. Run P08 before claiming governance/non-bypass safety.
10. Run P09 before export trust output acceptance.
11. Run P10 before UI interaction completeness acceptance.
12. Run P11 before final API/schema/persistence acceptance.
13. Run P12 before P13 proof package.
14. Run P13 before P14 final consolidation.
15. Stop after each phase and report.


## 13. Prompt Pack Index

| Prompt ID | Phase | Purpose | Authorized Task IDs | Authorized Subtask Count | Must Run After | Must Stop Before | Output Report |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CODEX-P00 | P00 | Repo / Artefact Intake & Baseline Verification | SCF-P00-T001, SCF-P00-T002 | 6 | none | P01 | P00 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P01 | P01 | SCF Normalization & Task Rebase | SCF-P01-T001, SCF-P01-T002 | 6 | P00 | P02 | P01 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P02 | P02 | Hide / Remove / Static / Defer / Hold Cleanup | SCF-P02-T001, SCF-P02-T002 | 8 | P00 → P01 | P03 | P02 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P03 | P03 | Foundation: User / Tenant / Role / Object Scope | SCF-P03-T001, SCF-P03-T002 | 10 | P01 → P02 | P04 | P03 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P04 | P04 | Primary Customer Need Flow: Evidence Request → Upload → Review | SCF-P04-T001, SCF-P04-T002, SCF-P04-T003 | 15 | P02 → P03 | P05 | P04 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P05 | P05 | Advisory Signal Flow: Signal → Analyst → Internal Draft → Advisor | SCF-P05-T001, SCF-P05-T002, SCF-P05-T003 | 15 | P03 → P04 | P06 | P05 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P06 | P06 | Compliance Release / Block / Request Evidence | SCF-P06-T001, SCF-P06-T002 | 10 | P04 → P05 | P07 | P06 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P07 | P07 | Client Visibility and Decision Projection | SCF-P07-T001, SCF-P07-T002 | 10 | P05 → P06 | P08 | P07 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P08 | P08 | Governance / Admin Non-Bypass / Cross-Tenant Denial | SCF-P08-T001, SCF-P08-T002 | 10 | P06 → P07 | P09 | P08 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P09 | P09 | Export / Redaction Trust Output | SCF-P09-T001, SCF-P09-T002 | 10 | P07 → P08 | P10 | P09 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P10 | P10 | UI Interaction Completeness | SCF-P10-T001, SCF-P10-T002, SCF-P10-T003 | 15 | P08 → P09 | P11 | P10 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P11 | P11 | API / Schema / Persistence Hardening | SCF-P11-T001, SCF-P11-T002 | 10 | P09 → P10 | P12 | P11 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P12 | P12 | P0 Positive / Negative Test Closure | SCF-P12-T001, SCF-P12-T002 | 10 | P10 → P11 | P13 | P12 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P13 | P13 | Proof Package and QA | SCF-P13-T001, SCF-P13-T002 | 6 | P11 → P12 | P14 | P13 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |
| CODEX-P14 | P14 | Codex Prompt Pack / Rebased Final Handoff Derivation | SCF-P14-T001, SCF-P14-T002 | 6 | P12 → P13 | final QA / handoff | P14 phase report with completed tasks/subtasks, files changed, tests, proofs, blockers |


## 14. Global Codex Start Prompt

```text
# GLOBAL CODEX START PROMPT — AlphaVest SCF phased implementation

You are working in the AlphaVest WealthOS project.

## Mission
Use `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md` as the phased implementation instruction set. Start with **P00 only** unless the user explicitly tells you to continue to another phase. Implement only tasks/subtasks authorized in the current phase prompt.

## Required source order
1. `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`
2. `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`
3. `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN.md`
4. five SCF basis artefacts
5. safety/API/schema/test contracts
6. `alphavest-wealthos-clickdummy-full-workflow` repo/branch reality
7. `main` only as false-gap warning, never target truth

## Repository rules
* Target branch/source: `full-workflow`.
* Verify current branch/repo before editing.
* Create or use a working branch only if the execution environment supports it.
* Never use `main` as target truth.

## Validation command discovery
1. Read `package.json` first and discover actual scripts.
2. Use only commands that exist or standard package/tool commands confirmed by project files.
3. If a command is missing, report `COMMAND_NOT_FOUND` or `COMMAND_TO_VERIFY`; do not invent replacement scripts.
4. Typical categories to verify when present: install, typecheck, lint, build, Prisma validate/generate, unit/API tests, Playwright route/E2E tests, targeted P0 negative tests, route smoke.

## Global stop rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## Reporting
After each phase, stop and report using the Phase Reporting Template in this prompt pack.
```


## 15. Phase Prompt P00 — Repo / Artefact Intake & Baseline Verification

## Phase Prompt P00 — Repo / Artefact Intake & Baseline Verification

```text
# CODEX PHASE PROMPT — P00 — Repo / Artefact Intake & Baseline Verification

## 1. Mission
Verify repository, branch, command, route, API, Prisma, test, asset and artefact baselines before any implementation work.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P00-T001, SCF-P00-T002

## 4. Authorized Subtask IDs
SCF-P00-T001-S01, SCF-P00-T001-S02, SCF-P00-T001-S03, SCF-P00-T002-S01, SCF-P00-T002-S02, SCF-P00-T002-S03

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
package.json, lib/route-registry.ts, app/[...segments]/page.tsx, prisma/schema.prisma, tests/*; package.json, playwright.config.ts

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P00-T001 | Baseline aus full-workflow und SCF-Artefakten verifizieren | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Baseline/QA | package.json, lib/route-registry.ts, app/[...segments]/page.tsx, prisma/schema.prisma, tests/* | Prüfe 71 Routes, Scope-Labels, 4 API-Routen, 42 Modelle, 10 Specs, 63 PNGs und SCF-Counts gegen Artefakte. | none | Counts stimmen oder werden TO_VERIFY markiert. | Abweichung blockiert Planübergabe. | phase:check / route-smoke später |
| SCF-P00-T002 | Validierungsbefehle und Proof-Package-Baseline festlegen | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Baseline/QA | package.json, playwright.config.ts | Lege spätere Mindestbefehle fest: pnpm typecheck, lint, db:validate, build, playwright tests und relevante smoke/phase checks. | SCF-P00-T001 | Proof commands sind benannt. | Fehlende Command-Verfügbarkeit wird blockiert. | pnpm phase:check; pnpm test:playwright später |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P00-T001-S01 | SCF-P00-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Source- und Count-Baseline prüfen | Prüfe Source IDs und Counts für 001-071 gegen direkte Artefakte; markiere Abweichungen als TO_VERIFY. | package.json, lib/route-registry.ts, app/[...segments]/page.tsx, prisma/schema.prisma, tests/* | none | Counts und Source-ID-Familien sind nachvollziehbar. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Artefact diff / intake table |
| SCF-P00-T001-S02 | SCF-P00-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Target Areas plausibilisieren | Prüfe, ob die genannten Target Areas existieren oder als TO_VERIFY bleiben müssen. | package.json, lib/route-registry.ts, app/[...segments]/page.tsx, prisma/schema.prisma, tests/* | SCF-P00-T001-S01 | Jeder Target Area Status ist exists/TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Repo tree / file list later |
| SCF-P00-T001-S03 | SCF-P00-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Proof- und Stop-Rule-Bindung ergänzen | Ordne Task an Stop Rules, Safety Dependencies und Proof-Anforderungen an. | plan/proof register | SCF-P00-T001-S02 | Stop Rules sind an Task gebunden. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Plan QA |
| SCF-P00-T002-S01 | SCF-P00-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Source- und Count-Baseline prüfen | Prüfe Source IDs und Counts für all gegen direkte Artefakte; markiere Abweichungen als TO_VERIFY. | package.json, playwright.config.ts | SCF-P00-T001 | Counts und Source-ID-Familien sind nachvollziehbar. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Artefact diff / intake table |
| SCF-P00-T002-S02 | SCF-P00-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Target Areas plausibilisieren | Prüfe, ob die genannten Target Areas existieren oder als TO_VERIFY bleiben müssen. | package.json, playwright.config.ts | SCF-P00-T002-S01 | Jeder Target Area Status ist exists/TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Repo tree / file list later |
| SCF-P00-T002-S03 | SCF-P00-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Proof- und Stop-Rule-Bindung ergänzen | Ordne Task an Stop Rules, Safety Dependencies und Proof-Anforderungen an. | plan/proof register | SCF-P00-T002-S02 | Stop Rules sind an Task gebunden. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Plan QA |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Do not change code in P00 unless the user explicitly asks for baseline-report artifact updates. Inspect and report only.
* If release-plan task/subtask counts do not match 33/147, stop and report `BLOCKED_RELEASE_PLAN_COUNT_MISMATCH`.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 16. Phase Prompt P01 — SCF Normalization & Task Rebase

## Phase Prompt P01 — SCF Normalization & Task Rebase

```text
# CODEX PHASE PROMPT — P01 — SCF Normalization & Task Rebase

## 1. Mission
Normalize SCF IDs and task worksets so later implementation stays traceable to routes, affordances, capabilities, threads, orphans and flows.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P01-T001, SCF-P01-T002

## 4. Authorized Subtask IDs
SCF-P01-T001-S01, SCF-P01-T001-S02, SCF-P01-T001-S03, SCF-P01-T002-S01, SCF-P01-T002-S02, SCF-P01-T002-S03

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
SCF artefacts

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P01-T001 | SCF IDs normalisieren und Task-Backlog aus 522 Affordances bilden | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Planning | SCF artefacts | Normalisiere Affordance-, Capability-, Thread-, Orphan- und Flow-IDs in ein taskfähiges Register. | SCF-P00-T001 | Jede ID ist einem Workset zugeordnet. | Unbekannte ID wird nicht gebaut. | n/a |
| SCF-P01-T002 | SCF-Entscheidungen in Implement/Static/Hide/Remove/Defer/Hold splitten | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Planning | SCF artefacts | Erzeuge Plan-Queues: 363 implement, 80 static explicit, 26 defer, 42 hold, 11 reference/static. | SCF-P01-T001 | Alle Entscheidungen sind in Work Queues. | P1/Hold bleibt blockiert. | n/a |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P01-T001-S01 | SCF-P01-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Source- und Count-Baseline prüfen | Prüfe Source IDs und Counts für 001-071 gegen direkte Artefakte; markiere Abweichungen als TO_VERIFY. | SCF artefacts | SCF-P00-T001 | Counts und Source-ID-Familien sind nachvollziehbar. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Artefact diff / intake table |
| SCF-P01-T001-S02 | SCF-P01-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Target Areas plausibilisieren | Prüfe, ob die genannten Target Areas existieren oder als TO_VERIFY bleiben müssen. | SCF artefacts | SCF-P01-T001-S01 | Jeder Target Area Status ist exists/TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Repo tree / file list later |
| SCF-P01-T001-S03 | SCF-P01-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Proof- und Stop-Rule-Bindung ergänzen | Ordne Task an Stop Rules, Safety Dependencies und Proof-Anforderungen an. | plan/proof register | SCF-P01-T001-S02 | Stop Rules sind an Task gebunden. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Plan QA |
| SCF-P01-T002-S01 | SCF-P01-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Source- und Count-Baseline prüfen | Prüfe Source IDs und Counts für 001-071 gegen direkte Artefakte; markiere Abweichungen als TO_VERIFY. | SCF artefacts | SCF-P01-T001 | Counts und Source-ID-Familien sind nachvollziehbar. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Artefact diff / intake table |
| SCF-P01-T002-S02 | SCF-P01-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Target Areas plausibilisieren | Prüfe, ob die genannten Target Areas existieren oder als TO_VERIFY bleiben müssen. | SCF artefacts | SCF-P01-T002-S01 | Jeder Target Area Status ist exists/TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Repo tree / file list later |
| SCF-P01-T002-S03 | SCF-P01-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Proof- und Stop-Rule-Bindung ergänzen | Ordne Task an Stop Rules, Safety Dependencies und Proof-Anforderungen an. | plan/proof register | SCF-P01-T002-S02 | Stop Rules sind an Task gebunden. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Plan QA |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.


## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 17. Phase Prompt P02 — Hide / Remove / Static / Defer / Hold Cleanup

## Phase Prompt P02 — Hide / Remove / Static / Defer / Hold Cleanup

```text
# CODEX PHASE PROMPT — P02 — Hide / Remove / Static / Defer / Hold Cleanup

## 1. Mission
Clean up false visible completeness before building new behaviour by hiding, removing, static-labelling, deferring or holding UI only where authorized.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P02-T001, SCF-P02-T002

## 4. Authorized Subtask IDs
SCF-P02-T001-S01, SCF-P02-T001-S02, SCF-P02-T001-S03, SCF-P02-T001-S04, SCF-P02-T002-S01, SCF-P02-T002-S02, SCF-P02-T002-S03, SCF-P02-T002-S04

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/*, components/ui/*; routes/components/docs

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P02-T001 | Static-explicit UI cleanup planen | AUTHORIZED_FOR_CLEANUP | Cleanup/UI | components/*, components/ui/* | Markiere sichtbare aber nicht zu bauende Controls als statisch, disabled oder explanatory, damit kein falscher Funktionsanspruch entsteht. | SCF-P01-T002 | Statische Controls sind klar als nicht interaktiv gekennzeichnet. | Nutzer kann keine Mutation/Filterung erwarten. | visual/route smoke später |
| SCF-P02-T002 | P1/Reference/Hold Do-Not-Implement Register umsetzen | AUTHORIZED_FOR_CLEANUP | Cleanup/Scope | routes/components/docs | Sichere P1, Reference-only und Hold Routen gegen versehentliche MVP-Tasks. | SCF-P01-T002 | Do-Not-Implement Register existiert. | Codex würde Hold nicht bauen. | n/a |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P02-T001-S01 | SCF-P02-T001 | AUTHORIZED_FOR_CLEANUP | Betroffene UI-Items sammeln | Ermittle aus Affordance/Orphan IDs die Controls für MVP_SUPPORT/P1/reference mit Entscheidung static/hide/remove/defer/hold. | components/routes TO_VERIFY | SCF-P01-T002 | Jedes Item hat eine Entscheidung. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Orphan register diff |
| SCF-P02-T001-S02 | SCF-P02-T001 | AUTHORIZED_FOR_CLEANUP | UI-Behandlung spezifizieren | Lege je Item static label, disabled state, hide, remove, defer oder hold fest. | components/*, components/ui/* | SCF-P02-T001-S01 | UI-Behandlung ist eindeutig und testbar. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | UI plan table |
| SCF-P02-T001-S03 | SCF-P02-T001 | AUTHORIZED_FOR_CLEANUP | Do-Not-Implement Guard definieren | Erzeuge Guard-Regeln, damit spätere Codex-Prompts keine blockierten Items bauen. | Do-Not-Implement Register | SCF-P02-T001-S02 | Guard existiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA checklist |
| SCF-P02-T001-S04 | SCF-P02-T001 | AUTHORIZED_FOR_CLEANUP | Regression-/Smoke-Kriterien definieren | Definiere spätere Smoke Checks, damit entfernte/versteckte Controls keine falschen Erwartungen erzeugen. | tests/route-smoke TO_VERIFY | SCF-P02-T001-S03 | Smoke-Kriterien benannt. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Test plan |
| SCF-P02-T002-S01 | SCF-P02-T002 | AUTHORIZED_FOR_CLEANUP | Betroffene UI-Items sammeln | Ermittle aus Affordance/Orphan IDs die Controls für 052,053,059,060,061,062,063,064,065,066,067,068,069,070,071 mit Entscheidung static/hide/remove/defer/hold. | components/routes TO_VERIFY | SCF-P01-T002 | Jedes Item hat eine Entscheidung. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Orphan register diff |
| SCF-P02-T002-S02 | SCF-P02-T002 | AUTHORIZED_FOR_CLEANUP | UI-Behandlung spezifizieren | Lege je Item static label, disabled state, hide, remove, defer oder hold fest. | routes/components/docs | SCF-P02-T002-S01 | UI-Behandlung ist eindeutig und testbar. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | UI plan table |
| SCF-P02-T002-S03 | SCF-P02-T002 | AUTHORIZED_FOR_CLEANUP | Do-Not-Implement Guard definieren | Erzeuge Guard-Regeln, damit spätere Codex-Prompts keine blockierten Items bauen. | Do-Not-Implement Register | SCF-P02-T002-S02 | Guard existiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA checklist |
| SCF-P02-T002-S04 | SCF-P02-T002 | AUTHORIZED_FOR_CLEANUP | Regression-/Smoke-Kriterien definieren | Definiere spätere Smoke Checks, damit entfernte/versteckte Controls keine falschen Erwartungen erzeugen. | tests/route-smoke TO_VERIFY | SCF-P02-T002-S03 | Smoke-Kriterien benannt. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Test plan |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Hide/remove/static-label only items explicitly authorized for cleanup.
* Do not remove functioning MVP capabilities.
* Do not implement deferred/hold/reference items as features.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 18. Phase Prompt P03 — Foundation: User / Tenant / Role / Object Scope

## Phase Prompt P03 — Foundation: User / Tenant / Role / Object Scope

```text
# CODEX PHASE PROMPT — P03 — Foundation: User / Tenant / Role / Object Scope

## 1. Mission
Implement the foundation for providerless but real mapped users, tenant membership, role, permission and object scope.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P03-T001, SCF-P03-T002

## 4. Authorized Subtask IDs
SCF-P03-T001-S01, SCF-P03-T001-S02, SCF-P03-T001-S03, SCF-P03-T001-S04, SCF-P03-T001-S05, SCF-P03-T002-S01, SCF-P03-T002-S02, SCF-P03-T002-S03, SCF-P03-T002-S04, SCF-P03-T002-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts; lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P03-T001 | Providerless mapped current user und tenant context härten | AUTHORIZED_FOR_IMPLEMENTATION | Foundation/Safety | components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts | Provider kann technisch stub bleiben, aber UI/API/Services müssen deterministischen User, Tenant, Rollen, Membership und Object Scope nutzen. | SCF-P02-T002 | Mapped user sieht eigene Tenant/Role Contexts. | Unknown/wrong tenant fail-closed und kein Payload-Leak. | permission-engine.spec.ts update; route-smoke targeted |
| SCF-P03-T002 | Route/action/object/payload permission boundary implementieren | AUTHORIZED_FOR_IMPLEMENTATION | Foundation/Safety | lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx | Trenne Route Shell, Action Permission, Object Scope und Payload Visibility für alle MVP/MVP_SUPPORT Flows. | SCF-P03-T001 | Permitted actor sees allowed route/action only. | Route shell ohne action/payload permission bleibt hidden/denied. | permission-engine.spec.ts; route smoke negative candidates |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P03-T001-S01 | SCF-P03-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 001-006,013-018 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts | SCF-P02-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P03-T001-S02 | SCF-P03-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Provider kann technisch stub bleiben, aber UI/API/Services müssen deterministischen User, Tenant, Rollen, Membership und Object Scope nutzen. | components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts | SCF-P03-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P03-T001-S03 | SCF-P03-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: RBAC, tenant isolation und UX States: permission denied/loading states an positive/negative Fälle. | components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts | SCF-P03-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P03-T001-S04 | SCF-P03-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Mapped user sieht eigene Tenant/Role Contexts.` und Negative Acceptance `Unknown/wrong tenant fail-closed und kein Payload-Leak.` ab. | permission-engine.spec.ts update; route-smoke targeted | SCF-P03-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P03-T001-S05 | SCF-P03-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Session-Kontext ist deterministisch und tenant-scoped.. | proof package | SCF-P03-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P03-T002-S01 | SCF-P03-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 001-071 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx | SCF-P03-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P03-T002-S02 | SCF-P03-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Trenne Route Shell, Action Permission, Object Scope und Payload Visibility für alle MVP/MVP_SUPPORT Flows. | lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx | SCF-P03-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P03-T002-S03 | SCF-P03-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: RBAC, payload visibility und UX States: permission denied/hidden states an positive/negative Fälle. | lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx | SCF-P03-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P03-T002-S04 | SCF-P03-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Permitted actor sees allowed route/action only.` und Negative Acceptance `Route shell ohne action/payload permission bleibt hidden/denied.` ab. | permission-engine.spec.ts; route smoke negative candidates | SCF-P03-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P03-T002-S05 | SCF-P03-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: RBAC-Layer trennt Route/Action/Payload.. | proof package | SCF-P03-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Route access must not imply action permission or payload visibility.
* Unknown/unmapped actor must fail closed.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 19. Phase Prompt P04 — Primary Customer Need Flow: Evidence Request → Upload → Review

## Phase Prompt P04 — Primary Customer Need Flow: Evidence Request → Upload → Review

```text
# CODEX PHASE PROMPT — P04 — Primary Customer Need Flow: Evidence Request → Upload → Review

## 1. Mission
Close the primary customer need flow from evidence request through upload, review, link/sufficiency and upload-not-sufficiency handling.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P04-T001, SCF-P04-T002, SCF-P04-T003

## 4. Authorized Subtask IDs
SCF-P04-T001-S01, SCF-P04-T001-S02, SCF-P04-T001-S03, SCF-P04-T001-S04, SCF-P04-T001-S05, SCF-P04-T002-S01, SCF-P04-T002-S02, SCF-P04-T002-S03, SCF-P04-T002-S04, SCF-P04-T002-S05, SCF-P04-T003-S01, SCF-P04-T003-S02, SCF-P04-T003-S03, SCF-P04-T003-S04, SCF-P04-T003-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts; components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts; lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P04-T001 | Evidence Request Status und Needs-Evidence States einführen | AUTHORIZED_FOR_IMPLEMENTATION | Evidence/UI/API | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts | Plane UI/API/State für Evidence Request, Review Pending, Linked, Sufficient/Insufficient ohne Upload-Overclaim. | SCF-P03-T002 | Evidence Request führt zu Upload und Review Queue. | Upload success bleibt upload-only; insufficient evidence blockt release. | document-upload-api/flow + new evidence sufficiency negatives |
| SCF-P04-T002 | Document Upload UX und API Validierung komplettieren | AUTHORIZED_FOR_IMPLEMENTATION | Evidence/API/UI | components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts | Harte Validierung für file type/size/tenant/role/context, Retry, Fehler und reload-proof Liste. | SCF-P04-T001 | Valid upload erzeugt Document/Version/Extraction/Evidence/Audit und erscheint in Liste. | Forbidden role/unsupported file/wrong tenant erzeugt keine sichtbare Row; denied audit. | document-upload-api.spec.ts; document-upload-flow.spec.ts |
| SCF-P04-T003 | Evidence Review/Link/Sufficiency Entscheidung planen | AUTHORIZED_FOR_IMPLEMENTATION | Evidence/Workflow | lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx | Erstelle Work Package für Review, Link zu Recommendation/Decision/Compliance und Sufficiency Entscheidung. | SCF-P04-T001 | Reviewer kann Evidence linking/sufficiency begründet markieren. | Unlinked/stale/unreviewed evidence blockiert Release. | workflow-gate.spec.ts update; new evidence-service test candidate |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P04-T001-S01 | SCF-P04-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 027,028,029,030,038,041,046,047 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts | SCF-P03-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P04-T001-S02 | SCF-P04-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Plane UI/API/State für Evidence Request, Review Pending, Linked, Sufficient/Insufficient ohne Upload-Overclaim. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts | SCF-P04-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P04-T001-S03 | SCF-P04-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: Evidence sufficiency, audit und UX States: needs evidence, upload in progress/failed/success an positive/negative Fälle. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts | SCF-P04-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P04-T001-S04 | SCF-P04-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Evidence Request führt zu Upload und Review Queue.` und Negative Acceptance `Upload success bleibt upload-only; insufficient evidence blockt release.` ab. | document-upload-api/flow + new evidence sufficiency negatives | SCF-P04-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P04-T001-S05 | SCF-P04-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Evidence Lifecycle hat explizite States und P0 Tests.. | proof package | SCF-P04-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P04-T002-S01 | SCF-P04-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 028,027 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts | SCF-P04-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P04-T002-S02 | SCF-P04-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Harte Validierung für file type/size/tenant/role/context, Retry, Fehler und reload-proof Liste. | components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts | SCF-P04-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P04-T002-S03 | SCF-P04-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: RBAC, upload-not-sufficiency, audit und UX States: upload progress/fail/success-only an positive/negative Fälle. | components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts | SCF-P04-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P04-T002-S04 | SCF-P04-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Valid upload erzeugt Document/Version/Extraction/Evidence/Audit und erscheint in Liste.` und Negative Acceptance `Forbidden role/unsupported file/wrong tenant erzeugt keine sichtbare Row; denied audit.` ab. | document-upload-api.spec.ts; document-upload-flow.spec.ts | SCF-P04-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P04-T002-S05 | SCF-P04-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Upload ist robust, aber nicht Sufficiency.. | proof package | SCF-P04-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P04-T003-S01 | SCF-P04-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 029,030,046,047,038,039,041 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx | SCF-P04-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P04-T003-S02 | SCF-P04-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Erstelle Work Package für Review, Link zu Recommendation/Decision/Compliance und Sufficiency Entscheidung. | lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx | SCF-P04-T003-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P04-T003-S03 | SCF-P04-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: evidence sufficiency, audit und UX States: needs evidence/block/success an positive/negative Fälle. | lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx | SCF-P04-T003-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P04-T003-S04 | SCF-P04-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Reviewer kann Evidence linking/sufficiency begründet markieren.` und Negative Acceptance `Unlinked/stale/unreviewed evidence blockiert Release.` ab. | workflow-gate.spec.ts update; new evidence-service test candidate | SCF-P04-T003-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P04-T003-S05 | SCF-P04-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Sufficiency ist explizit und testbar.. | proof package | SCF-P04-T003-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Upload success is upload-only and must not unlock evidence sufficiency or release.
* Evidence sufficiency requires reviewed, linked, relevant, scoped and accepted evidence.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 20. Phase Prompt P05 — Advisory Signal Flow: Signal → Analyst → Internal Draft → Advisor

## Phase Prompt P05 — Advisory Signal Flow: Signal → Analyst → Internal Draft → Advisor

```text
# CODEX PHASE PROMPT — P05 — Advisory Signal Flow: Signal → Analyst → Internal Draft → Advisor

## 1. Mission
Close the advisory signal flow from trigger/classification to internal-only AI/rules draft and advisor review handoff.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P05-T001, SCF-P05-T002, SCF-P05-T003

## 4. Authorized Subtask IDs
SCF-P05-T001-S01, SCF-P05-T001-S02, SCF-P05-T001-S03, SCF-P05-T001-S04, SCF-P05-T001-S05, SCF-P05-T002-S01, SCF-P05-T002-S02, SCF-P05-T002-S03, SCF-P05-T002-S04, SCF-P05-T002-S05, SCF-P05-T003-S01, SCF-P05-T003-S02, SCF-P05-T003-S03, SCF-P05-T003-S04, SCF-P05-T003-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts; lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx; components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P05-T001 | Signal Review und Analyst Classification schließen | AUTHORIZED_FOR_IMPLEMENTATION | Signal/Workflow | components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts | Signal/Trigger wird intern klassifiziert, priorisiert und zur Draft/Review-Arbeit geroutet. | SCF-P03-T002 | Analyst klassifiziert Signal und erzeugt internal-only workflow item. | Signal erzeugt keinen client-visible payload. | demo-workflow-api.spec.ts; workflow-gate.spec.ts |
| SCF-P05-T002 | AI/rules draft internal-only payload boundary implementieren | AUTHORIZED_FOR_IMPLEMENTATION | Signal/Safety | lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx | Stelle sicher, dass AI/rules draft, internal rationale, analyst notes und compliance notes nur intern bleiben. | SCF-P05-T001 | Advisor/Analyst sieht interne Drafts. | Client/API/export sieht keine Drafts/internal rationale. | new visibility/export payload negative tests |
| SCF-P05-T003 | Advisor Approval getrennt von Release implementieren | AUTHORIZED_FOR_IMPLEMENTATION | Workflow/Safety | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts | Advisor approval setzt nur compliance-pending; Release bleibt Compliance-only. | SCF-P05-T002 | Advisor approval erzeugt pending compliance state. | Client visibility bleibt hidden bis Compliance Release. | workflow-gate.spec.ts; demo-workflow-api.spec.ts negative |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P05-T001-S01 | SCF-P05-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 033,034,035 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts | SCF-P03-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P05-T001-S02 | SCF-P05-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Signal/Trigger wird intern klassifiziert, priorisiert und zur Draft/Review-Arbeit geroutet. | components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts | SCF-P05-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P05-T001-S03 | SCF-P05-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: advice boundary, audit und UX States: review pending/block/success an positive/negative Fälle. | components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts | SCF-P05-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P05-T001-S04 | SCF-P05-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Analyst klassifiziert Signal und erzeugt internal-only workflow item.` und Negative Acceptance `Signal erzeugt keinen client-visible payload.` ab. | demo-workflow-api.spec.ts; workflow-gate.spec.ts | SCF-P05-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P05-T001-S05 | SCF-P05-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Signal flow bleibt internal-only.. | proof package | SCF-P05-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P05-T002-S01 | SCF-P05-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 033,034,035,036,037,019,020,054-058 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx | SCF-P05-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P05-T002-S02 | SCF-P05-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Stelle sicher, dass AI/rules draft, internal rationale, analyst notes und compliance notes nur intern bleiben. | lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx | SCF-P05-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P05-T002-S03 | SCF-P05-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: AI Draft internal-only, no unapproved advice und UX States: redacted/internal-only states an positive/negative Fälle. | lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx | SCF-P05-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P05-T002-S04 | SCF-P05-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Advisor/Analyst sieht interne Drafts.` und Negative Acceptance `Client/API/export sieht keine Drafts/internal rationale.` ab. | new visibility/export payload negative tests | SCF-P05-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P05-T002-S05 | SCF-P05-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: AI Draft Leakage ist negativ getestet.. | proof package | SCF-P05-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P05-T003-S01 | SCF-P05-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 036,037,038,039,040,043,044,045 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P05-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P05-T003-S02 | SCF-P05-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Advisor approval setzt nur compliance-pending; Release bleibt Compliance-only. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P05-T003-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P05-T003-S03 | SCF-P05-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: advisor-not-release, audit und UX States: approval pending/release pending an positive/negative Fälle. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P05-T003-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P05-T003-S04 | SCF-P05-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Advisor approval erzeugt pending compliance state.` und Negative Acceptance `Client visibility bleibt hidden bis Compliance Release.` ab. | workflow-gate.spec.ts; demo-workflow-api.spec.ts negative | SCF-P05-T003-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P05-T003-S05 | SCF-P05-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Advisor approval != release ist bewiesen.. | proof package | SCF-P05-T003-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* AI/rules draft is internal-only.
* Unsupported claims must not proceed to client-facing projection.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 21. Phase Prompt P06 — Compliance Release / Block / Request Evidence

## Phase Prompt P06 — Compliance Release / Block / Request Evidence

```text
# CODEX PHASE PROMPT — P06 — Compliance Release / Block / Request Evidence

## 1. Mission
Implement compliance release/block/request-evidence gate with fail-closed behaviour and audit expectations.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P06-T001, SCF-P06-T002

## 4. Authorized Subtask IDs
SCF-P06-T001-S01, SCF-P06-T001-S02, SCF-P06-T001-S03, SCF-P06-T001-S04, SCF-P06-T001-S05, SCF-P06-T002-S01, SCF-P06-T002-S02, SCF-P06-T002-S03, SCF-P06-T002-S04, SCF-P06-T002-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts; lib/audit-service.ts, prisma/schema.prisma, tests/*

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P06-T001 | Compliance Release/Block/Request Evidence Gate implementieren | AUTHORIZED_FOR_IMPLEMENTATION | Workflow/Safety | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts | Compliance kann Release, Block oder Request Evidence nur nach advisor/evidence/audit/precondition checks durchführen. | SCF-P04-T003,SCF-P05-T003 | Compliance released nur vollständige Fälle. | Missing advisor/evidence/audit blocks release and hides client payload. | workflow-gate.spec.ts; new compliance E2E/API negative |
| SCF-P06-T002 | Critical Gate Audit Persistence sicherstellen | AUTHORIZED_FOR_IMPLEMENTATION | Safety/Audit | lib/audit-service.ts, prisma/schema.prisma, tests/* | Jede kritische Aktion schreibt AuditEvent oder bleibt pending/denied. Audit display zählt nicht als persistence. | SCF-P06-T001 | Gate actions produce actor/role/target/result/prev/next/reason audit rows. | Audit failure prevents release/export/permission mutation. | permission-engine.spec.ts; document-upload-api.spec.ts; new audit-fail test candidate |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P06-T001-S01 | SCF-P06-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 038,039,040,041,042,043,044,045 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts | SCF-P04-T003,SCF-P05-T003 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P06-T001-S02 | SCF-P06-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Compliance kann Release, Block oder Request Evidence nur nach advisor/evidence/audit/precondition checks durchführen. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts | SCF-P06-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P06-T001-S03 | SCF-P06-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: compliance release, evidence sufficiency, audit und UX States: blocked/release pending/compliance blocked an positive/negative Fälle. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts | SCF-P06-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P06-T001-S04 | SCF-P06-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Compliance released nur vollständige Fälle.` und Negative Acceptance `Missing advisor/evidence/audit blocks release and hides client payload.` ab. | workflow-gate.spec.ts; new compliance E2E/API negative | SCF-P06-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P06-T001-S05 | SCF-P06-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Compliance Gate ist fail-closed.. | proof package | SCF-P06-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P06-T002-S01 | SCF-P06-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 036-045,048-051,054-058 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/audit-service.ts, prisma/schema.prisma, tests/* | SCF-P06-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P06-T002-S02 | SCF-P06-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Jede kritische Aktion schreibt AuditEvent oder bleibt pending/denied. Audit display zählt nicht als persistence. | lib/audit-service.ts, prisma/schema.prisma, tests/* | SCF-P06-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P06-T002-S03 | SCF-P06-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: audit persistence, admin non-bypass und UX States: audit unavailable fail-closed an positive/negative Fälle. | lib/audit-service.ts, prisma/schema.prisma, tests/* | SCF-P06-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P06-T002-S04 | SCF-P06-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Gate actions produce actor/role/target/result/prev/next/reason audit rows.` und Negative Acceptance `Audit failure prevents release/export/permission mutation.` ab. | permission-engine.spec.ts; document-upload-api.spec.ts; new audit-fail test candidate | SCF-P06-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P06-T002-S05 | SCF-P06-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Audit ist Voraussetzung für Safety Proof.. | proof package | SCF-P06-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Advisor approval is not compliance release.
* Missing evidence, missing audit or missing permission must block or hold release.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 22. Phase Prompt P07 — Client Visibility and Decision Projection

## Phase Prompt P07 — Client Visibility and Decision Projection

```text
# CODEX PHASE PROMPT — P07 — Client Visibility and Decision Projection

## 1. Mission
Implement client-safe released projections and fail-closed client visibility for portal/mobile/decision/evidence surfaces.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P07-T001, SCF-P07-T002

## 4. Authorized Subtask IDs
SCF-P07-T001-S01, SCF-P07-T001-S02, SCF-P07-T001-S03, SCF-P07-T001-S04, SCF-P07-T001-S05, SCF-P07-T002-S01, SCF-P07-T002-S02, SCF-P07-T002-S03, SCF-P07-T002-S04, SCF-P07-T002-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts; components/decisions-governance-screen.tsx, lib/workflow-gate.ts

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P07-T001 | Client-safe Visibility Projection implementieren | AUTHORIZED_FOR_IMPLEMENTATION | Safety/UI/API | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts | Client sieht nur released/redacted/client-safe summary; unreleased/internal-only bleibt hidden/redacted. | SCF-P06-T001 | Released decision appears as safe client summary. | Client cannot see AI draft/internal rationale/compliance notes/unreleased evidence. | new client-visibility route/API negative tests |
| SCF-P07-T002 | Decision Record und Submitted/Released States schließen | AUTHORIZED_FOR_IMPLEMENTATION | Decision/UI/Safety | components/decisions-governance-screen.tsx, lib/workflow-gate.ts | Decision record zeigt Status, evidence linkage, releasedToClientAt und audit summary ohne Gate-Overclaim. | SCF-P07-T001 | Decision submitted/released state is clear and scoped. | Submitted without release stays internal/hidden. | workflow-gate and route tests |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P07-T001-S01 | SCF-P07-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 019,020,043,044,045,046,047 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts | SCF-P06-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P07-T001-S02 | SCF-P07-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Client sieht nur released/redacted/client-safe summary; unreleased/internal-only bleibt hidden/redacted. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts | SCF-P07-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P07-T001-S03 | SCF-P07-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: client visibility fail-closed, payload redaction und UX States: hidden/redacted/empty/error an positive/negative Fälle. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts | SCF-P07-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P07-T001-S04 | SCF-P07-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Released decision appears as safe client summary.` und Negative Acceptance `Client cannot see AI draft/internal rationale/compliance notes/unreleased evidence.` ab. | new client-visibility route/API negative tests | SCF-P07-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P07-T001-S05 | SCF-P07-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Client projection ist fail-closed.. | proof package | SCF-P07-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P07-T002-S01 | SCF-P07-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 043,044,045 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P07-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P07-T002-S02 | SCF-P07-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Decision record zeigt Status, evidence linkage, releasedToClientAt und audit summary ohne Gate-Overclaim. | components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P07-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P07-T002-S03 | SCF-P07-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: decision/audit/visibility und UX States: submitted/released/blocked states an positive/negative Fälle. | components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P07-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P07-T002-S04 | SCF-P07-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Decision submitted/released state is clear and scoped.` und Negative Acceptance `Submitted without release stays internal/hidden.` ab. | workflow-gate and route tests | SCF-P07-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P07-T002-S05 | SCF-P07-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Decision states overclaimen nicht.. | proof package | SCF-P07-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Client visibility is fail-closed.
* Unreleased/internal/forbidden fields must be hidden/redacted and not sent.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 23. Phase Prompt P08 — Governance / Admin Non-Bypass / Cross-Tenant Denial

## Phase Prompt P08 — Governance / Admin Non-Bypass / Cross-Tenant Denial

```text
# CODEX PHASE PROMPT — P08 — Governance / Admin Non-Bypass / Cross-Tenant Denial

## 1. Mission
Harden governance, admin non-bypass, cross-tenant/object denial and audit proof.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P08-T001, SCF-P08-T002

## 4. Authorized Subtask IDs
SCF-P08-T001-S01, SCF-P08-T001-S02, SCF-P08-T001-S03, SCF-P08-T001-S04, SCF-P08-T001-S05, SCF-P08-T002-S01, SCF-P08-T002-S02, SCF-P08-T002-S03, SCF-P08-T002-S04, SCF-P08-T002-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts; lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P08-T001 | Role/Access Request Governance Lifecycle schließen | AUTHORIZED_FOR_IMPLEMENTATION | Governance/Safety | components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts | Role changes, access requests, second confirmations and governance actions obey tenant/object scope. | SCF-P03-T002 | Governed role/access change succeeds in scope and is audited. | Admin cannot force release/export/visibility/evidence sufficiency. | permission-engine.spec.ts; new admin-bypass tests |
| SCF-P08-T002 | Cross-tenant/object denial für UI, API und row-level filtering planen | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Governance/Safety/Test | lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx | Such-, Filter-, Listen- und Row-Actions filtern tenant/object scoped und fail-closed. | SCF-P08-T001 | Allowed rows visible. | Cross-tenant rows hidden/denied and no leaked counts/details. | permission-engine spec update; list route tests |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P08-T001-S01 | SCF-P08-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 007,008,009,010,017,018,048,049,050,051 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts | SCF-P03-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P08-T001-S02 | SCF-P08-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Role changes, access requests, second confirmations and governance actions obey tenant/object scope. | components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts | SCF-P08-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P08-T001-S03 | SCF-P08-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: admin non-bypass, RBAC und UX States: permission denied/validation/success an positive/negative Fälle. | components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts | SCF-P08-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P08-T001-S04 | SCF-P08-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Governed role/access change succeeds in scope and is audited.` und Negative Acceptance `Admin cannot force release/export/visibility/evidence sufficiency.` ab. | permission-engine.spec.ts; new admin-bypass tests | SCF-P08-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P08-T001-S05 | SCF-P08-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Governance ist auditierbar und non-bypass.. | proof package | SCF-P08-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P08-T002-S01 | SCF-P08-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 001-071 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx | SCF-P08-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P08-T002-S02 | SCF-P08-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Such-, Filter-, Listen- und Row-Actions filtern tenant/object scoped und fail-closed. | lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx | SCF-P08-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P08-T002-S03 | SCF-P08-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: tenant isolation, row RBAC und UX States: empty/denied/error an positive/negative Fälle. | lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx | SCF-P08-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P08-T002-S04 | SCF-P08-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Allowed rows visible.` und Negative Acceptance `Cross-tenant rows hidden/denied and no leaked counts/details.` ab. | permission-engine spec update; list route tests | SCF-P08-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P08-T002-S05 | SCF-P08-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Row-level RBAC ist Teil jeder List/Table-Aufgabe.. | proof package | SCF-P08-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Admin authority is governance-scoped and cannot bypass release/export/visibility/evidence gates.
* Denials require audit proof where safety-relevant.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 24. Phase Prompt P09 — Export / Redaction Trust Output

## Phase Prompt P09 — Export / Redaction Trust Output

```text
# CODEX PHASE PROMPT — P09 — Export / Redaction Trust Output

## 1. Mission
Implement export scope, redaction, approval, preview and download/share trust output without forbidden payload leakage.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P09-T001, SCF-P09-T002

## 4. Authorized Subtask IDs
SCF-P09-T001-S01, SCF-P09-T001-S02, SCF-P09-T001-S03, SCF-P09-T001-S04, SCF-P09-T001-S05, SCF-P09-T002-S01, SCF-P09-T002-S02, SCF-P09-T002-S03, SCF-P09-T002-S04, SCF-P09-T002-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts; lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P09-T001 | Export Scope/Redaction/Approval Lifecycle schließen | AUTHORIZED_FOR_IMPLEMENTATION | Export/Safety | components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts | Export trennt scope, redaction, preview, approval und download/share; package nur aus released/redacted content. | SCF-P07-T001,SCF-P06-T002 | Approved export contains only scoped redacted released content. | Unapproved/unredacted/internal payload blocks download/share. | file-export-realism.spec.ts update; new export route/API negative |
| SCF-P09-T002 | Forbidden Payload Assertions für Export und Client Views definieren | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Export/Safety/Test | lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts | Definiere Tests für keine AI Drafts, internal rationale, compliance notes, unreleased evidence oder hidden fields im Client/Export Payload. | SCF-P09-T001 | Export/client payloads are clean. | Forbidden payload test fails if internal field appears. | new payload assertion tests |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P09-T001-S01 | SCF-P09-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 054,055,056,057,058,043,044,045,046,047 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts | SCF-P07-T001,SCF-P06-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P09-T001-S02 | SCF-P09-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Export trennt scope, redaction, preview, approval und download/share; package nur aus released/redacted content. | components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts | SCF-P09-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P09-T001-S03 | SCF-P09-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: export redaction, client visibility, audit und UX States: export pending/failed/success an positive/negative Fälle. | components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts | SCF-P09-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P09-T001-S04 | SCF-P09-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Approved export contains only scoped redacted released content.` und Negative Acceptance `Unapproved/unredacted/internal payload blocks download/share.` ab. | file-export-realism.spec.ts update; new export route/API negative | SCF-P09-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P09-T001-S05 | SCF-P09-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Export ist trust output nach Release.. | proof package | SCF-P09-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P09-T002-S01 | SCF-P09-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 019,020,054-058 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts | SCF-P09-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P09-T002-S02 | SCF-P09-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Definiere Tests für keine AI Drafts, internal rationale, compliance notes, unreleased evidence oder hidden fields im Client/Export Payload. | lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts | SCF-P09-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P09-T002-S03 | SCF-P09-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: AI draft internal-only, redaction und UX States: hidden/redacted an positive/negative Fälle. | lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts | SCF-P09-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P09-T002-S04 | SCF-P09-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Export/client payloads are clean.` und Negative Acceptance `Forbidden payload test fails if internal field appears.` ab. | new payload assertion tests | SCF-P09-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P09-T002-S05 | SCF-P09-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Forbidden payloads sind negativ geprüft.. | proof package | SCF-P09-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Export preview is not approval. Approval is not download/share.
* Export must exclude AI draft, internal rationale, compliance notes and unreleased evidence.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 25. Phase Prompt P10 — UI Interaction Completeness

## Phase Prompt P10 — UI Interaction Completeness

```text
# CODEX PHASE PROMPT — P10 — UI Interaction Completeness

## 1. Mission
Complete authorized UI interaction behaviour for search/sort/filter/table, forms, wizards, modals, drawers, confirmations and states.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P10-T001, SCF-P10-T002, SCF-P10-T003

## 4. Authorized Subtask IDs
SCF-P10-T001-S01, SCF-P10-T001-S02, SCF-P10-T001-S03, SCF-P10-T001-S04, SCF-P10-T001-S05, SCF-P10-T002-S01, SCF-P10-T002-S02, SCF-P10-T002-S03, SCF-P10-T002-S04, SCF-P10-T002-S05, SCF-P10-T003-S01, SCF-P10-T003-S02, SCF-P10-T003-S03, SCF-P10-T003-S04, SCF-P10-T003-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components; components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx; components/ui/modal.tsx, components/ui/drawer.tsx, affected screens

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P10-T001 | Search/Sort/Filter/Table Behaviour Work Package | AUTHORIZED_FOR_IMPLEMENTATION | UI/API/Safety | components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components | Implementiere oder static-label alle sichtbaren Search/Sort/Filter/Row Actions; URL state and RBAC row filtering where built. | SCF-P02-T001,SCF-P08-T002 | Built search/filter changes scoped data or clearly static-labels. | Search/filter cannot leak hidden rows or counts. | new UI/API negative tests per built list |
| SCF-P10-T002 | Forms/Wizards/Input Masks Completion Work Package | AUTHORIZED_FOR_IMPLEMENTATION | UI/API/Safety | components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx | Für gebaute Forms/Wizards: required fields, validation, save/submit, cancel, API target, schema mapping and errors. | SCF-P02-T001 | Valid submit mutates intended object or clearly static-labels. | Invalid/missing fields do not mutate; unauthorized denied. | form/flow tests candidates |
| SCF-P10-T003 | Drawer/Modal/Confirmation Lifecycle Work Package | AUTHORIZED_FOR_IMPLEMENTATION | UI/Safety | components/ui/modal.tsx, components/ui/drawer.tsx, affected screens | Open/close/cancel/submit, Escape/focus/accessibility, validation, confirmation phrases and audit where safety critical. | SCF-P02-T001 | Submit works after validation and permission. | Cancel/backdrop/Escape preserve data and do not mutate. | Playwright UI lifecycle tests candidates |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P10-T001-S01 | SCF-P10-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 003-060 selected MVP/MVP_SUPPORT lists die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components | SCF-P02-T001,SCF-P08-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P10-T001-S02 | SCF-P10-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Implementiere oder static-label alle sichtbaren Search/Sort/Filter/Row Actions; URL state and RBAC row filtering where built. | components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components | SCF-P10-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P10-T001-S03 | SCF-P10-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: row RBAC, payload visibility und UX States: empty/error/loading/no-results an positive/negative Fälle. | components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components | SCF-P10-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P10-T001-S04 | SCF-P10-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Built search/filter changes scoped data or clearly static-labels.` und Negative Acceptance `Search/filter cannot leak hidden rows or counts.` ab. | new UI/API negative tests per built list | SCF-P10-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P10-T001-S05 | SCF-P10-T001 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: 224 table false-completeness risks sind entschieden.. | proof package | SCF-P10-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P10-T002-S01 | SCF-P10-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 003,004,005,006,014,015,018,025,028,054 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx | SCF-P02-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P10-T002-S02 | SCF-P10-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Für gebaute Forms/Wizards: required fields, validation, save/submit, cancel, API target, schema mapping and errors. | components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx | SCF-P10-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P10-T002-S03 | SCF-P10-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: permission/audit where safety-sensitive und UX States: validation failed/save success/error an positive/negative Fälle. | components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx | SCF-P10-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P10-T002-S04 | SCF-P10-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Valid submit mutates intended object or clearly static-labels.` und Negative Acceptance `Invalid/missing fields do not mutate; unauthorized denied.` ab. | form/flow tests candidates | SCF-P10-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P10-T002-S05 | SCF-P10-T002 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Form/Wizard false completeness ist geschlossen.. | proof package | SCF-P10-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P10-T003-S01 | SCF-P10-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 002,005,007,009,010,014,015,018,025,031,040,041,044,048,049,050,057 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/ui/modal.tsx, components/ui/drawer.tsx, affected screens | SCF-P02-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P10-T003-S02 | SCF-P10-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Open/close/cancel/submit, Escape/focus/accessibility, validation, confirmation phrases and audit where safety critical. | components/ui/modal.tsx, components/ui/drawer.tsx, affected screens | SCF-P10-T003-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P10-T003-S03 | SCF-P10-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: release/export/admin/evidence audit und UX States: modal open/closed/error/success an positive/negative Fälle. | components/ui/modal.tsx, components/ui/drawer.tsx, affected screens | SCF-P10-T003-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P10-T003-S04 | SCF-P10-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Submit works after validation and permission.` und Negative Acceptance `Cancel/backdrop/Escape preserve data and do not mutate.` ab. | Playwright UI lifecycle tests candidates | SCF-P10-T003-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P10-T003-S05 | SCF-P10-T003 | AUTHORIZED_FOR_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: 33 overlay false completeness risks sind geschlossen.. | proof package | SCF-P10-T003-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Table headers/chips/tabs are not behaviour unless implemented.
* Overlay close/cancel must not mutate. Submit only after validation and permission.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 26. Phase Prompt P11 — API / Schema / Persistence Hardening

## Phase Prompt P11 — API / Schema / Persistence Hardening

```text
# CODEX PHASE PROMPT — P11 — API / Schema / Persistence Hardening

## 1. Mission
Harden existing APIs, schema usage, payload validation, persistence and failure behaviour without blind API/schema creation.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P11-T001, SCF-P11-T002

## 4. Authorized Subtask IDs
SCF-P11-T001-S01, SCF-P11-T001-S02, SCF-P11-T001-S03, SCF-P11-T001-S04, SCF-P11-T001-S05, SCF-P11-T002-S01, SCF-P11-T002-S02, SCF-P11-T002-S03, SCF-P11-T002-S04, SCF-P11-T002-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts; prisma/schema.prisma, lib/* services, prisma/seed.ts

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P11-T001 | Existing API hardening without blind new routes | AUTHORIZED_FOR_API_HARDENING_EXISTING_ONLY | API/Safety | app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts | Härten der vier existierenden APIs: validation, status codes, permission checks, redaction, error fail-closed. | SCF-P03..P10 tasks | Valid requests produce scoped response. | Invalid/unauthorized/error does not advance workflow or expose data. | demo-workflow-api, document-upload-api, review-monitoring tests |
| SCF-P11-T002 | Prisma usage and schema alignment planning | AUTHORIZED_FOR_SCHEMA_ALIGNMENT_NO_BLIND_MIGRATION | Schema/Data/Safety | prisma/schema.prisma, lib/* services, prisma/seed.ts | Aligniere Nutzung auf vorhandene 42 Modelle/22 Enums; Schemaänderung nur wenn SCF/P0-Lücke nicht anders lösbar ist. | SCF-P11-T001 | Models/fields support flow state and audit. | No missing field is silently faked in UI. | db:validate; service tests |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P11-T001-S01 | SCF-P11-T001 | AUTHORIZED_FOR_API_HARDENING_EXISTING_ONLY | Current Reality und Source IDs verifizieren | Prüfe für MVP routes using APIs die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts | SCF-P03..P10 tasks | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P11-T001-S02 | SCF-P11-T001 | AUTHORIZED_FOR_API_HARDENING_EXISTING_ONLY | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Härten der vier existierenden APIs: validation, status codes, permission checks, redaction, error fail-closed. | app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts | SCF-P11-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P11-T001-S03 | SCF-P11-T001 | AUTHORIZED_FOR_API_HARDENING_EXISTING_ONLY | Safety- und UX-State-Anforderungen binden | Binde Safety: RBAC/visibility/evidence/audit/export und UX States: API error/loading/success an positive/negative Fälle. | app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts | SCF-P11-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P11-T001-S04 | SCF-P11-T001 | AUTHORIZED_FOR_API_HARDENING_EXISTING_ONLY | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Valid requests produce scoped response.` und Negative Acceptance `Invalid/unauthorized/error does not advance workflow or expose data.` ab. | demo-workflow-api, document-upload-api, review-monitoring tests | SCF-P11-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P11-T001-S05 | SCF-P11-T001 | AUTHORIZED_FOR_API_HARDENING_EXISTING_ONLY | Proof Package und DoD definieren | Lege spätere Proofs fest: API presence wird safety-proof.. | proof package | SCF-P11-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P11-T002-S01 | SCF-P11-T002 | AUTHORIZED_FOR_SCHEMA_ALIGNMENT_NO_BLIND_MIGRATION | Current Reality und Source IDs verifizieren | Prüfe für all MVP data routes die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | prisma/schema.prisma, lib/* services, prisma/seed.ts | SCF-P11-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P11-T002-S02 | SCF-P11-T002 | AUTHORIZED_FOR_SCHEMA_ALIGNMENT_NO_BLIND_MIGRATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Aligniere Nutzung auf vorhandene 42 Modelle/22 Enums; Schemaänderung nur wenn SCF/P0-Lücke nicht anders lösbar ist. | prisma/schema.prisma, lib/* services, prisma/seed.ts | SCF-P11-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P11-T002-S03 | SCF-P11-T002 | AUTHORIZED_FOR_SCHEMA_ALIGNMENT_NO_BLIND_MIGRATION | Safety- und UX-State-Anforderungen binden | Binde Safety: schema support for safety und UX States: n/a an positive/negative Fälle. | prisma/schema.prisma, lib/* services, prisma/seed.ts | SCF-P11-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P11-T002-S04 | SCF-P11-T002 | AUTHORIZED_FOR_SCHEMA_ALIGNMENT_NO_BLIND_MIGRATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Models/fields support flow state and audit.` und Negative Acceptance `No missing field is silently faked in UI.` ab. | db:validate; service tests | SCF-P11-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P11-T002-S05 | SCF-P11-T002 | AUTHORIZED_FOR_SCHEMA_ALIGNMENT_NO_BLIND_MIGRATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Schema alignment ist dokumentiert und minimal.. | proof package | SCF-P11-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Existing APIs baseline only: `/api/demo-workflow`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring`.
* No blind Prisma migration or patch-schema replacement.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 27. Phase Prompt P12 — P0 Positive / Negative Test Closure

## Phase Prompt P12 — P0 Positive / Negative Test Closure

```text
# CODEX PHASE PROMPT — P12 — P0 Positive / Negative Test Closure

## 1. Mission
Close positive and negative P0 tests for safety, visibility, evidence, audit, export, API and UI state gates.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P12-T001, SCF-P12-T002

## 4. Authorized Subtask IDs
SCF-P12-T001-S01, SCF-P12-T001-S02, SCF-P12-T001-S03, SCF-P12-T001-S04, SCF-P12-T001-S05, SCF-P12-T002-S01, SCF-P12-T002-S02, SCF-P12-T002-S03, SCF-P12-T002-S04, SCF-P12-T002-S05

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates; tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P12-T001 | E2E-001 P0 Test Closure | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Test/P0 | tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates | Positive and negative Tests für evidence request/upload/review/approval/release/visibility. | SCF-P04..P07 | Happy path releases safe summary. | Wrong tenant/unsupported file/insufficient evidence/missing approval/audit failure blocks. | new/updated Playwright specs |
| SCF-P12-T002 | E2E-002/E2E-003/E2E-004 Negative Safety Test Closure | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Test/P0 | tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts | AI draft leakage, advisor-not-release, admin-bypass, cross-tenant denial, export forbidden payload tests. | SCF-P05..P11 | Safety positive proof where relevant. | Leakage/bypass/export unredacted cases fail. | new/updated specs |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P12-T001-S01 | SCF-P12-T001 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 019,020,027-030,036-041,043-047 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates | SCF-P04..P07 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P12-T001-S02 | SCF-P12-T001 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Positive and negative Tests für evidence request/upload/review/approval/release/visibility. | tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates | SCF-P12-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P12-T001-S03 | SCF-P12-T001 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: P0 upload/evidence/advisor/compliance/visibility und UX States: all flow states an positive/negative Fälle. | tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates | SCF-P12-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P12-T001-S04 | SCF-P12-T001 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Happy path releases safe summary.` und Negative Acceptance `Wrong tenant/unsupported file/insufficient evidence/missing approval/audit failure blocks.` ab. | new/updated Playwright specs | SCF-P12-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P12-T001-S05 | SCF-P12-T001 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: E2E-001 P0 proof package exists.. | proof package | SCF-P12-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |
| SCF-P12-T002-S01 | SCF-P12-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Current Reality und Source IDs verifizieren | Prüfe für 033-058,007-010,017-018,048-051 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts | SCF-P05..P11 | Source IDs sind bestätigt oder TO_VERIFY. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Traceability matrix |
| SCF-P12-T002-S02 | SCF-P12-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: AI draft leakage, advisor-not-release, admin-bypass, cross-tenant denial, export forbidden payload tests. | tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts | SCF-P12-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Task detail record |
| SCF-P12-T002-S03 | SCF-P12-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Safety- und UX-State-Anforderungen binden | Binde Safety: P0 safety gates und UX States: fail-closed states an positive/negative Fälle. | tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts | SCF-P12-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Safety checklist |
| SCF-P12-T002-S04 | SCF-P12-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Safety positive proof where relevant.` und Negative Acceptance `Leakage/bypass/export unredacted cases fail.` ab. | new/updated specs | SCF-P12-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | P0 test map |
| SCF-P12-T002-S05 | SCF-P12-T002 | AUTHORIZED_FOR_TEST_IMPLEMENTATION | Proof Package und DoD definieren | Lege spätere Proofs fest: Safety spine and trust output are negative-tested.. | proof package | SCF-P12-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Proof checklist |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Negative tests are mandatory before claiming acceptance for safety-sensitive tasks.
* Existing tests are proof slices only, not full P0 proof.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 28. Phase Prompt P13 — Proof Package and QA

## Phase Prompt P13 — Proof Package and QA

```text
# CODEX PHASE PROMPT — P13 — Proof Package and QA

## 1. Mission
Consolidate proof package, QA evidence, regression results, audit/data/safety proofs and blockers.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P13-T001, SCF-P13-T002

## 4. Authorized Subtask IDs
SCF-P13-T001-S01, SCF-P13-T001-S02, SCF-P13-T001-S03, SCF-P13-T002-S01, SCF-P13-T002-S02, SCF-P13-T002-S03

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
docs/proof or generated report TO_VERIFY; ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_QA.md

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P13-T001 | Proof Package: route/capability/flow/task coverage report | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | QA/Proof | docs/proof or generated report TO_VERIFY | Erzeuge später einen Proof-Report: route coverage, capability coverage, orphan disposition, P0 test output, audit rows, screenshots if applicable. | SCF-P12-T001,SCF-P12-T002 | Every selected task has proof evidence. | Missing proof blocks completion. | phase:check + test suite + screenshots/logs |
| SCF-P13-T002 | SCF Implementation Plan QA durchführen | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | QA | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_QA.md | QA gegen fünf SCF Artefakte: keine verlorenen Orphans, keine Hold-Elevation, keine Safety-Gaps, keine untracked Tasks. | SCF-P13-T001 | QA passes without untracked tasks. | Any missing traceability is rework. | manual/automated artifact diff |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P13-T001-S01 | SCF-P13-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Input- und Gate-Check durchführen | Prüfe, ob alle Vorgänger-Tasks und P0 Proofs für Proof Package: route/capability/flow/task coverage report vorhanden sind. | docs/proof or generated report TO_VERIFY | SCF-P12-T001,SCF-P12-T002 | Alle Dependencies grün oder blockiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA matrix |
| SCF-P13-T001-S02 | SCF-P13-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Artefaktstruktur vorbereiten | Definiere Struktur, Source Lock, Stop Rules, Task Scope und Proof-Anforderungen für das Nachfolgeartefakt. | docs/proof or generated report TO_VERIFY | SCF-P13-T001-S01 | Nachfolgeartefakt kann ohne Produktentscheidung erzeugt werden. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Generated artefact draft later |
| SCF-P13-T001-S03 | SCF-P13-T001 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Blockierte/deferred Items ausschließen | Vergleiche Prompt/Handoff Scope gegen Do-Not-Implement Register und Hold/P1/Reference Routes. | Do-Not-Implement Register | SCF-P13-T001-S02 | Keine blockierten Items im Handoff. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA diff |
| SCF-P13-T002-S01 | SCF-P13-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Input- und Gate-Check durchführen | Prüfe, ob alle Vorgänger-Tasks und P0 Proofs für SCF Implementation Plan QA durchführen vorhanden sind. | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_QA.md | SCF-P13-T001 | Alle Dependencies grün oder blockiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA matrix |
| SCF-P13-T002-S02 | SCF-P13-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Artefaktstruktur vorbereiten | Definiere Struktur, Source Lock, Stop Rules, Task Scope und Proof-Anforderungen für das Nachfolgeartefakt. | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_QA.md | SCF-P13-T002-S01 | Nachfolgeartefakt kann ohne Produktentscheidung erzeugt werden. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Generated artefact draft later |
| SCF-P13-T002-S03 | SCF-P13-T002 | AUTHORIZED_FOR_BASELINE_VERIFICATION_AND_QA | Blockierte/deferred Items ausschließen | Vergleiche Prompt/Handoff Scope gegen Do-Not-Implement Register und Hold/P1/Reference Routes. | Do-Not-Implement Register | SCF-P13-T002-S02 | Keine blockierten Items im Handoff. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA diff |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Do not implement new product work. Consolidate proof only.
* Any missing proof remains a blocker.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```


## 29. Phase Prompt P14 — Codex Prompt Pack / Rebased Final Handoff Derivation

## Phase Prompt P14 — Codex Prompt Pack / Rebased Final Handoff Derivation

```text
# CODEX PHASE PROMPT — P14 — Codex Prompt Pack / Rebased Final Handoff Derivation

## 1. Mission
Derive final execution summary and optional rebased final handoff only from completed proofs; no new product work.

## 2. Binding Sources
`ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md`; direct SCF predecessors; full-workflow repo reality after verification.

## 3. Authorized Task IDs
SCF-P14-T001, SCF-P14-T002

## 4. Authorized Subtask IDs
SCF-P14-T001-S01, SCF-P14-T001-S02, SCF-P14-T001-S03, SCF-P14-T002-S01, SCF-P14-T002-S02, SCF-P14-T002-S03

## 5. Target Routes / Affordances / Capabilities / Flows / Orphans
Use only the source route, affordance, capability, thread, flow and orphan IDs listed in the task table below. If an ID is `all`, `selected`, `GROUPED_FROM_*`, or wildcarded, resolve it only through the Release Plan and direct SCF artefacts before editing.

## 6. Target Files / Areas to Verify Before Editing
ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md; FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md

Before editing, verify each target exists. If a target is not found, stop the affected task and report `BLOCKED_TARGET_NOT_FOUND`.

## 7. Implementation Instructions
Execute only the tasks and subtasks in this phase. Preserve the dependency order. Do not implement tasks from later phases.

## 8. Authorized Task Blocks
| Task ID | Task Name | Release Status | Task Type | Target Files / Areas | Implementation Instruction | Dependency Order | Positive Acceptance | Negative Acceptance | Test Obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P14-T001 | SCF Codex Prompt Pack ableiten | AUTHORIZED_FOR_HANDOFF_DERIVATION_AFTER_RELEASE_ACCEPTANCE | Handoff/Prompt | ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md | Nach QA: Phasenweise Codex-Prompts erstellen, jeder Prompt mit Source IDs, target files, tests, stop rules. | SCF-P13-T002 | Prompt pack contains all implementation candidates. | No deferred/hold/remove tasks smuggled. | n/a |
| SCF-P14-T002 | Rebased Final Handoff optional erstellen | AUTHORIZED_FOR_HANDOFF_DERIVATION_AFTER_RELEASE_ACCEPTANCE | Handoff/Final | FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md | Optional: ein finaler SCF-rebaseter Codex-Handoff statt Prompt Pack. | SCF-P14-T001 | Handoff authorizes only locked tasks. | P1/Hold/Reference remain blocked. | n/a |

## 9. Authorized Subtask Blocks
| Subtask ID | Parent Task ID | Release Status | Subtask Name | Action Detail | Target Area | Dependency | Positive Acceptance | Negative Acceptance if Safety-Relevant | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P14-T001-S01 | SCF-P14-T001 | AUTHORIZED_FOR_HANDOFF_DERIVATION_AFTER_RELEASE_ACCEPTANCE | Input- und Gate-Check durchführen | Prüfe, ob alle Vorgänger-Tasks und P0 Proofs für SCF Codex Prompt Pack ableiten vorhanden sind. | ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md | SCF-P13-T002 | Alle Dependencies grün oder blockiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA matrix |
| SCF-P14-T001-S02 | SCF-P14-T001 | AUTHORIZED_FOR_HANDOFF_DERIVATION_AFTER_RELEASE_ACCEPTANCE | Artefaktstruktur vorbereiten | Definiere Struktur, Source Lock, Stop Rules, Task Scope und Proof-Anforderungen für das Nachfolgeartefakt. | ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md | SCF-P14-T001-S01 | Nachfolgeartefakt kann ohne Produktentscheidung erzeugt werden. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Generated artefact draft later |
| SCF-P14-T001-S03 | SCF-P14-T001 | AUTHORIZED_FOR_HANDOFF_DERIVATION_AFTER_RELEASE_ACCEPTANCE | Blockierte/deferred Items ausschließen | Vergleiche Prompt/Handoff Scope gegen Do-Not-Implement Register und Hold/P1/Reference Routes. | Do-Not-Implement Register | SCF-P14-T001-S02 | Keine blockierten Items im Handoff. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA diff |
| SCF-P14-T002-S01 | SCF-P14-T002 | AUTHORIZED_FOR_HANDOFF_DERIVATION_AFTER_RELEASE_ACCEPTANCE | Input- und Gate-Check durchführen | Prüfe, ob alle Vorgänger-Tasks und P0 Proofs für Rebased Final Handoff optional erstellen vorhanden sind. | FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md | SCF-P14-T001 | Alle Dependencies grün oder blockiert. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA matrix |
| SCF-P14-T002-S02 | SCF-P14-T002 | AUTHORIZED_FOR_HANDOFF_DERIVATION_AFTER_RELEASE_ACCEPTANCE | Artefaktstruktur vorbereiten | Definiere Struktur, Source Lock, Stop Rules, Task Scope und Proof-Anforderungen für das Nachfolgeartefakt. | FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md | SCF-P14-T002-S01 | Nachfolgeartefakt kann ohne Produktentscheidung erzeugt werden. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | Generated artefact draft later |
| SCF-P14-T002-S03 | SCF-P14-T002 | AUTHORIZED_FOR_HANDOFF_DERIVATION_AFTER_RELEASE_ACCEPTANCE | Blockierte/deferred Items ausschließen | Vergleiche Prompt/Handoff Scope gegen Do-Not-Implement Register und Hold/P1/Reference Routes. | Do-Not-Implement Register | SCF-P14-T002-S02 | Keine blockierten Items im Handoff. | Safety-relevante Wirkung darf nicht ohne Permission, Fail-Closed, Audit/Test-Proof akzeptiert werden. | QA diff |

## 10. Non-Goals
* Do not perform any task/subtask not listed above.
* Do not implement P1, Hold, Reference-only or Do-Not-Implement items.
* Do not use `main` as target truth.
* Do not make product decisions.
* Do not implement new product work.
* Derive handoff only from completed, reported, proven tasks.

## 11. API / Schema / Safety / UX / Test Dependencies
Respect the dependencies listed per task. For safety-relevant work, include fail-closed behaviour, audit expectation, payload visibility and negative tests. For API/schema work, use existing full-workflow APIs/schema unless the current phase explicitly authorizes otherwise.

## 12. Required Positive Acceptance
Every task's `Positive Acceptance` must pass or be reported as blocked.

## 13. Required Negative Acceptance
Every safety-relevant task's `Negative Acceptance` must pass or be reported as blocked. No client leak, admin bypass, upload-to-release shortcut, unapproved advice, or export forbidden-payload leak may be accepted.

## 14. Required Tests / Validation Commands
Discover commands from `package.json` first. Suggested categories:
| Command Category | Command | Source | Required? | If Missing |
| --- | --- | --- | --- | --- |
| Command discovery | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Build/typecheck/lint | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Unit/API tests | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Playwright/E2E | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |
| Targeted P0 negatives | discover from package.json / project files | package.json, playwright.config.ts, repo files | YES if relevant and available | report COMMAND_NOT_FOUND / COMMAND_TO_VERIFY, do not invent |

## 15. Required Proof Package
Provide changed files, inspected-only files, test outputs, runtime/API evidence where relevant, audit/data proof where relevant, safety proof, regression proof, and any screenshot proof only when useful. Do not generate new screens/images.

## 16. Stop Rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.

## 17. Reporting Requirements
Use this template exactly:
| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |

## 18. Completion Criteria
This phase is complete only when all authorized task IDs and subtask IDs above are either completed with proof or explicitly reported as blocked with reason. Stop after reporting this phase. Do not continue to the next phase unless the user explicitly instructs you to proceed.
```

## 30. Final QA / Regression Prompt

```text
# CODEX FINAL QA / REGRESSION PROMPT — AlphaVest SCF Implementation

## Mission
After all authorized phase prompts P00–P14 have been executed and reported, consolidate the complete proof package. Do not implement new product work.

## Inputs
* All phase reports P00–P14.
* Changed files list.
* Test outputs.
* Audit/data/safety proof artifacts.
* This Codex Prompt Pack.
* Release Plan and SCF artefacts.

## Required checks
1. Verify all completed task IDs and subtask IDs are authorized in the Release Plan.
2. Verify no P1/Hold/Reference/Do-Not-Implement item was implemented.
3. Verify no screen/image/state-screen generation occurred.
4. Verify no `main` target usage occurred.
5. Verify no blind API/schema/migration work occurred.
6. Verify positive acceptance cases pass.
7. Verify negative P0 safety cases pass.
8. Verify proof package includes files changed, tests run, audit/data/safety proof where relevant, and blockers.

## Required output
* Executive QA result: PASS / FAIL / PASS_WITH_BLOCKERS.
* Completed task/subtask table.
* Tests run table.
* P0 gate coverage table.
* Stop-rule compliance table.
* Remaining blockers.
* Recommendation: ship / continue remediation / create rebaseted final handoff.

## Stop rules
* Use only the `full-workflow` target codebase. Never use `main` as target truth.
* Work only on the currently authorized phase, task IDs and subtask IDs.
* Do not elevate P1, Hold or Reference-only routes into MVP.
* Do not generate or replace screens, state screens or images.
* Do not treat visual UI as behaviour, route access as action permission, button as mutation, table header as sorting proof, upload as evidence sufficiency, advisor approval as compliance release, export preview as client-safe package, audit display as audit persistence, or status chips as gates.
* Do not create new API routes, Prisma models, schema migrations or patch-schema replacements unless the current phase prompt explicitly authorizes it with evidence. If not explicit, stop and report `BLOCKED_UNAUTHORIZED_ARCHITECTURE_CHANGE`.
* Before editing any target file/area, verify it exists. If no matching file/service/component exists, stop and report `BLOCKED_TARGET_NOT_FOUND`; do not invent unrelated architecture.
* Preserve all hide/remove/static/defer/hold decisions from the Release Plan.
* If a required source, command, file, model, route or test cannot be found, stop the affected task and report a blocker instead of guessing.
```


## 31. Do-Not-Implement Register for Codex

| Item ID | Route / Scope | Reason | Forbidden Implementation | Allowed Treatment | Reopen Condition |
| --- | --- | --- | --- | --- | --- |
| DNI-P1-001 | 052,053,059,060,068 / P1_AFTER_MVP | P1 nach MVP | Kommunikation/Ops/Review-Rhythm als MVP-Funktion bauen | Defer/Register, keine MVP-Feature-Implementierung | Eigener P1-Unlock-Prompt mit Scope/Safety/Test-Plan |
| DNI-REF-001 | 061,062,063 / REFERENCE_ONLY | Reference-only Seiten | Service blueprint, Roadmap, State catalogue als Produktverhalten implementieren | Static explicit/reference labeling | Nur bei separater Produktentscheidung reopen |
| DNI-HOLD-001 | 064,065,066,067,069,070,071 / HOLD_PENDING_DECISION | Scope/Safety/Visual unresolved | KYC/SoW/Suitability/IPS/Rebalance/Committee als MVP bauen | Hold/Register, nicht implementieren | Scope-, Safety-, Visual- und P0-Unlock-Artefakt |
| DNI-MAIN-001 | main branch / main zip | False-gap source only | Target-Tasks aus main ableiten | Ignorieren außer als historische Warnung | Nie, außer separate recovery decision |
| DNI-GEN-001 | All routes | No generation authorization | Screens, state-screens, images generieren oder ersetzen | Keine Generation; vorhandene Visuals nur Referenz | Nur dedizierter Screen-generation brief nach Scope/Safety |
| DNI-API-001 | All APIs/schema | No blind API/schema/migration | Neue API-Routen, blind patch schema, Migrationen ohne Evidence bauen | Existing API hardening only, schema alignment only | Explizite evidence-backed final decision |
| DNI-SAFE-001 | All safety flows | Safety non-goals | Autonomous advice, client-visible AI Draft, admin bypass, upload-to-release shortcut | Verbieten und negative Tests verlangen | Nie im MVP |


## 32. Phase Reporting Template

| Report Field | Required Content |
| --- | --- |
| Phase ID | Pxx |
| Completed Task IDs | list |
| Completed Subtask IDs | list |
| Files changed | list |
| Files inspected only | list |
| Tests run | commands + result |
| Proofs produced | logs / audit rows / API output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | every deviation with reason |
| Blockers | every blocking uncertainty |
| Next recommended phase | phase/task |


## 33. Blocker / Stop Rule Reporting Template

| Field | Required Content |
| --- | --- |
| Blocker ID | Stable ID, e.g. `BLOCK-P04-001` |
| Phase | Pxx |
| Task/Subtask | Task ID / Subtask ID |
| Stop Rule Triggered? | yes/no |
| Missing Source / File / Command / Model / Route | exact item |
| Why blocked | reason |
| Work performed before stop | inspected files only / none / partial safe changes |
| Files changed | list or none |
| Required user/product decision | exact question if unavoidable |
| Recommended next action | unblock / adjust prompt / defer / hold |


## 34. Acceptance Criteria for the Prompt Pack

* Release Plan is the highest source.
* All 15 phases P00–P14 are present.
* All 33 Release Plan master tasks are represented in phase prompts.
* All 147 authorized subtasks are represented in phase prompts.
* Each phase prompt is Copy/Paste-ready and includes Mission, Binding Sources, Authorized Tasks/Subtasks, Target Areas, Implementation Instructions, Non-Goals, Acceptance, Tests, Proofs, Stop Rules and Reporting.
* Global Start Prompt is present.
* Final QA / Regression Prompt is present.
* Do-Not-Implement Register is present.
* P1/Hold/Reference items are blocked.
* No screen/image/state-screen generation is authorized.
* No blind API/schema/migration work is authorized.
* This artefact does not execute Codex.

## 35. ENGINE_v2/v3 Proof

| Phase | Proof |
| --- | --- |
| Charter | Auftrag war, den Upload-Prompt auszuführen und `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md` zu erzeugen. Das Artefakt ist Prompt-Pack only, keine Codeausführung. |
| Evidence | Release-Plan als höchste Quelle genutzt; daraus 15 Phasen, 33 Master Tasks und 147 autorisierte Subtasks geparst. |
| Framing | Kein weiterer Plan, sondern phasenweises Codex Prompt Pack mit Copy/Paste-ready Phase Prompts, Stop Rules, Validation und Reporting. |
| Divergence | Einzelprompt, direkter Codex-Start und reiner Handoff wurden verworfen; gewählt wurde ein kontrolliertes P00–P14 Prompt Pack. |
| Contradiction | „Codex-Ready“ vs. „keine blinde Umsetzung“ gelöst: Nur `AUTHORIZED_*` Tasks/Subtasks je Phase, nach jeder Phase stoppen und berichten. |
| Branch Build | Foundation, Primary Flow, Signal Path, Safety Spine, Trust Output, UI Completion, API/Schema und P0 Tests bleiben getrennte Phasen. |
| Convergence | Ergebnis ist `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md` mit Global Start Prompt, 15 Phase Prompts, QA Prompt und Do-Not-Implement Register. |
| Adversarial | Schutz gegen P1/Hold-Leakage, visual-as-behaviour, button-as-mutation, upload-as-sufficiency, admin bypass, blind API/schema und missing tests eingebaut. |
| QA | Akzeptanzkriterien aus Upload umgesetzt: Source Lock, 15 Phasen, Copy/Paste Prompts, Do-Not-Implement, Reporting, Validation, Proof Package. |
| Learning | Nächster sinnvoller Schritt ist die phasenweise Verwendung des Prompt Packs oder optional ein rebasetes Final Handoff aus diesem Pack. |


## 36. Final Decision Label


```text
SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK_ACCEPTED_FOR_PHASED_CODEX_EXECUTION
```
