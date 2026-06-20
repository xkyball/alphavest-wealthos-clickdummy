# ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PROMPT_PACK.md

**Artefact Type:** Codex Prompt Pack  
**Purpose:** Execute the AlphaVest MVP Minimum Path in separate, copy-paste-ready Codex prompts.  
**Source Prompt:** `ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PATCH_PROMPT.md`  
**Status:** `CODEX_PROMPT_PACK_ACCEPTED`  
**Mode:** Phase-by-phase implementation guidance. No product decisions. No MVP/P0 overclaim.

---

## 1. Executive Decision

**Decision:** `CODEX_PROMPT_PACK_ACCEPTED`

### Direct answers

| Question | Answer |
|---|---|
| Können alle Codex-Prompts aus dem Minimum Path erzeugt werden? | Yes. The Minimum Path can be split into a bootstrap prompt, baseline/no-decision prompt, five execution/proof prompts, final report prompt and optional re-audit prompt. |
| Welche Prompts sind Pflicht? | Prompts `00` through `07` are mandatory. |
| Welche Prompts sind optional? | Prompt `08` is optional and should be used only after patches and validation evidence exist. |
| In welcher Reihenfolge sind sie auszuführen? | Strictly in numerical order: `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`, then optional `08`. |
| Was bleibt verboten? | New product scope, route reclassification, P1/Hold promotion, new APIs by default, schema changes by default, screen/image/state-screen generation, P0/MVP overclaim and silent product/safety/API/schema decisions. |

### Required execution posture

Codex must treat this as a **minimum path patch sequence**, not a redesign. The target is to convert the most important MVP candidate path from demo/static/partial into typed, persisted, reloadable, role-aware, visibility-safe and test-proven behaviour.

---

## 2. Source Prompt and Artefacts

| Source | Rolle | Verwendete Aussage | Limit |
|---|---|---|---|
| `ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PATCH_PROMPT.md` | Primary source | Defines the five required patch areas and no-decision constraints. | Controls this prompt pack. |
| `ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md` | Reality audit | Establishes that the app is partially workable and patch required. | Audit evidence; may be stale after patches. |
| `ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md` | MVP verdict | Establishes current status as advanced DB-backed demo / MVP candidate after targeted patches. | Verdict before this patch sequence. |
| `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/` | Operative handoff | Provides source hierarchy, stop rules, no-decision execution and UI interaction reality patch. | Must be read before implementation. |
| `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Authority | Controls implementation boundaries. | Must not be expanded silently. |
| `FINAL_CODEX_TASK_MASTER.md` | Task authority | Provides locked task context. | Does not authorize product decisions. |
| `P0_TEST_ASSERTION_AND_FIXTURE_PLAN.md` | Proof planning | Defines P0 assertion/fixture discipline. | Existing tests do not equal P0 passed. |
| `TASK_DONE_DEFINITION_AND_QA_CHECKLIST.md` | Done criteria | Defines task-done and QA requirements. | Must be applied per phase. |
| `ALPHAVEST_UI_INTERACTION_REALITY_CLARIFICATION.md` | Interaction reality control | Distinguishes visible UI from lifecycle behaviour. | Must prevent drawer/modal overclaim. |
| `CODEX_UI_INTERACTION_REMEDIATION_PROMPT_PATCH.md` | UI lifecycle patch | Controls static-vs-reactive surface classification. | Must be used for touched UI surfaces. |

---

## 3. Global Codex Operating Rules

These rules apply to every prompt in this pack.

1. Read the source hierarchy before editing.
2. The existing `full-workflow` repository is the only implementation target.
3. Do not use `main` as target truth.
4. Work phase-by-phase only.
5. Produce a pre-edit report before implementation edits when requested.
6. Produce an exit report after each implementation phase.
7. Do not make product decisions.
8. Do not create new APIs by default.
9. Do not change Prisma schema by default.
10. Do not change route worksets.
11. Do not promote P1, Hold or Reference routes.
12. Do not generate screens, images or state-screens.
13. Do not make AI Draft client-visible.
14. Do not make advisor approval equal compliance release.
15. Do not make upload success equal evidence sufficiency.
16. Do not make export preview equal export approval.
17. Do not claim P0 passed without executed tests.
18. Do not claim MVP ready without post-patch validation proof and separate readiness audit.
19. Every ambiguity must be classified before action.
20. If product/safety/API/schema authority is missing, stop and report `BLOCKER`, `PRODUCT_DECISION_REQUIRED`, `API_DECISION_REQUIRED` or `SCHEMA_DECISION_REQUIRED`.

Allowed technical choices:

* file inspection order,
* local helper names,
* local UI state variable names,
* whether to extend existing tests or create a focused new test,
* technical ordering inside the current phase,
* classification of touched surfaces as permanent region or reactive lifecycle surface when allowed by the UI patch.

Forbidden technical shortcuts:

* treating actionId demo behaviour as the MVP workflow,
* treating visible drawer/modal UI as implemented lifecycle,
* treating Prisma schema presence as DB-backed app proof,
* treating test file existence as passing proof,
* treating metadata-only export as real export.

---

## 4. Prompt Pack Overview

| Prompt Nr. | Prompt Name | Purpose | Mandatory / Optional | Run Order | Output |
|---|---|---|---|---:|---|
| `00` | `MASTER_MINIMUM_PATH_BOOTSTRAP_PROMPT` | Load sources, confirm rules, confirm minimum path, no edits. | Mandatory | 1 | Bootstrap confirmation |
| `01` | `BASELINE_NO_DECISION_GUARD_PROMPT` | Repo state, scripts, DB/test readiness, pre-edit report. | Mandatory | 2 | `ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md` |
| `02` | `TENANT_SCOPED_UPLOAD_RELOAD_PROMPT` | Fix hardcoded tenant reload and prove tenant isolation. | Mandatory | 3 | Phase 1 exit report |
| `03` | `TYPED_REVIEW_APPROVAL_COMPLIANCE_WORKFLOW_PROMPT` | Build typed persistent Review → Advisor Approval → Compliance vertical. | Mandatory | 4 | Phase 2 exit report |
| `04` | `CONFIRMATION_LIFECYCLE_HARDENING_PROMPT` | Harden sensitive confirmations. | Mandatory | 5 | Phase 3 exit report |
| `05` | `CLIENT_VISIBILITY_PROOF_PROMPT` | Prove internal/client separation and fail-closed visibility. | Mandatory | 6 | Phase 4 exit report |
| `06` | `P0_TESTS_AND_VALIDATION_PROMPT` | Run safe P0 tests and validation proof. | Mandatory | 7 | Phase 5 validation report |
| `07` | `FINAL_PATCH_REPORT_PROMPT` | Produce final patch report and remaining claims. | Mandatory | 8 | `ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md` |
| `08` | `POST_PATCH_MVP_READINESS_REAUDIT_PROMPT` | Re-audit MVP readiness after proof exists. | Optional | 9 | `ALPHAVEST_POST_PATCH_MVP_READINESS_REAUDIT.md` |

---

## 5. Full Prompt 00 — Master Minimum Path Bootstrap

Copy and run this first in Codex.

```md
# CODEX PROMPT 00 — AlphaVest Master Minimum Path Bootstrap

You are Codex working inside the existing AlphaVest WealthOS repository.

## Goal

Bootstrap the Minimum Path patch run. Read the controlling sources, confirm source hierarchy and stop rules, identify whether the repository is ready for Phase 01 baseline inspection, and do **not** edit files.

This prompt is read-only.

## Sources to read first

Read these if present:

1. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/00_START_HERE/README_START_HERE.md`
2. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/00_START_HERE/CODEX_OPERATING_RULES.md`
3. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/00_START_HERE/V2_1_PATCH_CHANGELOG.md`
4. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/01_OPERATIVE_AUTHORITY/FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`
5. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/01_OPERATIVE_AUTHORITY/FINAL_CODEX_TASK_MASTER.md`
6. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/04_CODEX_PHASE_PROMPTS/00A_NO_DECISION_EXECUTION_PATCH_PROMPT.md`
7. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/02_EXECUTION_COMPLETION_ARTEFACTS/TASK_DONE_DEFINITION_AND_QA_CHECKLIST.md`
8. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/02_EXECUTION_COMPLETION_ARTEFACTS/P0_TEST_ASSERTION_AND_FIXTURE_PLAN.md`
9. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/06_UI_INTERACTION_REALITY_PATCH/ALPHAVEST_UI_INTERACTION_REALITY_CLARIFICATION.md`
10. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/06_UI_INTERACTION_REALITY_PATCH/CODEX_UI_INTERACTION_REMEDIATION_PROMPT_PATCH.md`
11. `_codex_handoff/ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED/06A_NO_DECISION_EXECUTION_PATCH/AMBIGUITY_CLASSIFICATION_RULES.md`
12. `ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md`
13. `ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md`
14. `ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PATCH_PROMPT.md`

If a required file is missing, report it. Do not guess its content.

## Minimum Path to confirm

The Minimum Path is:

1. tenant-scoped upload reload,
2. typed persistent Review → Advisor Approval → Compliance workflow vertical,
3. confirmation lifecycle hardening,
4. client visibility proof,
5. P0 tests and validation,
6. final patch report,
7. optional post-patch readiness re-audit.

## Stop rules

Do not edit code. Do not write tests. Do not run migrations. Do not run validation commands. Do not change schema. Do not create APIs. Do not generate screens/images/state-screens. Do not make MVP/P0 claims.

## Required output

Return:

```md
# ALPHAVEST_MINIMUM_PATH_BOOTSTRAP_CONFIRMATION

## 1. Sources Found
## 2. Sources Missing
## 3. Source Hierarchy Confirmed
## 4. Minimum Path Confirmed
## 5. Global Stop Rules Confirmed
## 6. Known Current Status
## 7. Ambiguities
## 8. Classification of Ambiguities
## 9. Readiness for Prompt 01
```

Readiness must be one of:

* `READY_FOR_BASELINE_NO_DECISION_GUARD`
* `MISSING_INPUT`
* `BLOCKER`

If not ready, stop.
```

---

## 6. Full Prompt 01 — Baseline and No-Decision Guard

Copy and run this after Prompt 00 succeeds.

```md
# CODEX PROMPT 01 — AlphaVest Baseline and No-Decision Guard

You are Codex working inside the existing AlphaVest WealthOS repository.

## Goal

Create a read-only baseline and pre-edit report before any Minimum Path implementation begins.

Do not edit files.

## Required inspections

Inspect:

* current branch,
* git status,
* package scripts in `package.json`,
* Prisma/db config:
  * `prisma/schema.prisma`
  * `lib/prisma.ts`
  * environment assumptions,
* existing API routes:
  * `app/api/demo-workflow/route.ts`
  * `app/api/documents/route.ts`
  * `app/api/documents/upload/route.ts`
  * `app/api/review-monitoring/route.ts`
* existing services:
  * `lib/document-upload-service.ts`
  * `lib/demo-workflow-mutation.ts`
  * `lib/demo-workflow-validation.ts`
  * `lib/workflow-gate.ts`
  * `lib/visibility-engine.ts`
  * `lib/permission-engine.ts`
  * `lib/audit-service.ts`
* relevant components:
  * `components/client-intake-screen.tsx`
  * `components/demo-session-provider.tsx`
  * `components/internal-workflow-screen.tsx`
  * `components/decisions-governance-screen.tsx`
* relevant tests under `tests/**`.

## Must not do

* no code edits,
* no tests written,
* no commands that mutate DB,
* no migrations,
* no seed commands,
* no schema changes,
* no API creation,
* no MVP/P0 claims.

## Required classification

Classify every ambiguity as:

* `TECHNICAL_CHOICE_ALLOWED`
* `PRODUCT_DECISION_REQUIRED`
* `API_DECISION_REQUIRED`
* `SCHEMA_DECISION_REQUIRED`
* `MISSING_INPUT`
* `BLOCKER`
* `OUT_OF_SCOPE`
* `REFERENCE_ONLY`
* `FALSE_GAP`
* `PROOF_NOT_SUFFICIENT`

## Required output file

Create:

`ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md`

with this exact structure:

```md
# ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md

## 1. Source Artefacts Read
## 2. Current Git Status
## 3. Current Branch
## 4. Files Inspected
## 5. Files Likely To Edit
## 6. Phase Sequence
## 7. Existing Tests / Scripts Found
## 8. Database / Environment Readiness
## 9. Ambiguities Found
## 10. Classification of Each Ambiguity
## 11. Entry Decision
```

Entry Decision must be one of:

* `ENTRY_READY`
* `ENTRY_READY_WITH_TECHNICAL_CHOICES`
* `MISSING_INPUT`
* `BLOCKER`
* `OUT_OF_SCOPE`

If the decision is not `ENTRY_READY` or `ENTRY_READY_WITH_TECHNICAL_CHOICES`, stop and do not proceed to Prompt 02.
```

---

## 7. Full Prompt 02 — Tenant-Scoped Upload Reload Fix

Copy and run this only after Prompt 01 returns `ENTRY_READY` or `ENTRY_READY_WITH_TECHNICAL_CHOICES`.

```md
# CODEX PROMPT 02 — AlphaVest Tenant-Scoped Upload Reload Fix

You are Codex working inside the existing AlphaVest WealthOS repository.

## Goal

Fix tenant-scoped upload reload so uploaded documents are fetched for the active tenant/session/context instead of a hardcoded tenant.

This is Phase 1 of the Minimum Path.

## Source requirements

Before editing, read:

1. `ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md`
2. `ALPHAVEST_MVP_MINIMUM_PATH_CODEX_PATCH_PROMPT.md`
3. `ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md`
4. `ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md`
5. `components/client-intake-screen.tsx`
6. `components/demo-session-provider.tsx`
7. `app/api/documents/route.ts`
8. `app/api/documents/upload/route.ts`
9. `lib/document-upload-service.ts`
10. existing document upload tests.

## Known issue

The reality audit found that the upload path is the strongest DB-backed vertical, but the UI fetches persisted uploaded documents using hardcoded tenant context such as `tenantSlug=morgan`.

## Allowed implementation

You may:

* replace hardcoded tenant reload with active tenant/session/route context already present in the app,
* keep using existing `/api/documents`,
* keep using existing `/api/documents/upload`,
* preserve upload-only semantics,
* preserve existing role/tenant validation,
* preserve the DB-backed persisted upload path,
* update existing upload tests or add focused tests for tenant-scoped reload.

## Forbidden work

Do not:

* create a new documents API route,
* change Prisma schema unless existing authority explicitly requires it,
* treat upload success as evidence sufficiency,
* widen client visibility,
* change route worksets,
* add new product scope,
* claim MVP/P0 readiness.

If a schema/API/product decision seems required, stop and classify it.

## Required tests

Add or update tests proving at minimum:

1. upload succeeds for the active tenant,
2. uploaded document appears after reload for that tenant,
3. uploaded document does not appear for another tenant,
4. invalid role/tenant remains denied,
5. upload success does not set evidence sufficiency,
6. upload success does not trigger release/export/client visibility.

## Required exit report

Return and append to `ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md` if it exists, otherwise include in response:

```md
## Phase 1 Exit — Tenant-Scoped Upload Reload

### Files changed
### Tenant source used
### API path used
### Tests added/updated
### Commands run
### Results
### Remaining blockers
### Claims still not allowed
```

Do not proceed to Prompt 03 unless this phase is complete or blockers are explicitly classified.
```

---

## 8. Full Prompt 03 — Typed Persistent Review → Advisor Approval → Compliance Workflow

Copy and run this only after Prompt 02 is complete or its blockers are classified and accepted.

```md
# CODEX PROMPT 03 — AlphaVest Typed Persistent Review → Advisor Approval → Compliance Workflow

You are Codex working inside the existing AlphaVest WealthOS repository.

## Goal

Implement one complete typed, persistent workflow vertical:

```text
Review → Advisor Approval → Compliance Release / Block / Request Evidence
```

This is Phase 2 of the Minimum Path.

The goal is to replace the relevant actionId-only demo path for one MVP workflow vertical with:

```text
typed UI payload → existing API route → service validation → Prisma persistence → audit event → reload proof
```

## Source requirements

Read:

1. `ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md`
2. Phase 1 exit report
3. `app/api/demo-workflow/route.ts`
4. `lib/demo-workflow-validation.ts`
5. `lib/demo-workflow-mutation.ts`
6. `lib/workflow-gate.ts`
7. `lib/visibility-engine.ts`
8. `lib/permission-engine.ts`
9. `lib/audit-service.ts`
10. `prisma/schema.prisma`
11. `components/internal-workflow-screen.tsx`
12. `components/decisions-governance-screen.tsx`
13. workflow-related tests.

## Allowed implementation

You may:

* use existing `/api/demo-workflow` as the API surface,
* extend existing validation to accept typed payloads for this selected vertical,
* add or harden service logic to persist:
  * review state,
  * advisor approval state,
  * compliance release state,
  * compliance block state,
  * request evidence state,
  * actor,
  * reason/comment,
  * audit event,
* preserve actionId demo path only for backwards demo compatibility,
* add reload proof from persisted DB state after mutation,
* keep advisor approval separate from compliance release,
* keep client visibility false until compliance release and visibility rules pass.

## Minimal typed payload shape

Use the existing code conventions, but the payload must be equivalent to:

```ts
{
  workflowType: "recommendation-review",
  targetId: string,
  action: "submit_review" | "advisor_approve" | "compliance_release" | "compliance_block" | "request_evidence",
  actorRole: string,
  reason?: string,
  evidenceIds?: string[],
  confirmationText?: string
}
```

Adapt naming to existing types. Do not invent new product semantics.

## Forbidden work

Do not:

* create a new API route unless you stop with `API_DECISION_REQUIRED`,
* change schema unless existing authority clearly requires it,
* promote hold/P1/reference routes,
* make advisor approval release to client,
* bypass evidence/audit requirements,
* claim production auth if only demo session exists,
* claim MVP/P0 readiness.

## Required tests

At minimum prove:

1. submit review persists state,
2. advisor approval persists but does not release to client,
3. compliance release persists only after prerequisites,
4. compliance block persists and prevents client visibility,
5. request evidence persists reason/comment,
6. wrong role/action/object fails closed,
7. audit row exists for critical transitions,
8. reload after mutation shows persisted state.

## Required exit report

Return and append to `ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md` if it exists, otherwise include in response:

```md
## Phase 2 Exit — Typed Persistent Review Approval Compliance Workflow

### Files changed
### Typed payload implemented
### Existing API route used
### Service / Prisma persistence path
### Advisor vs compliance boundary proof
### Audit proof
### Tests added/updated
### Commands run
### Results
### Remaining blockers
### Claims still not allowed
```

Do not proceed to Prompt 04 unless this phase is complete or blockers are explicitly classified.
```

---

## 9. Full Prompt 04 — Confirmation Lifecycle Hardening

Copy and run this only after Prompt 03 is complete or its blockers are classified and accepted.

```md
# CODEX PROMPT 04 — AlphaVest Confirmation Lifecycle Hardening

You are Codex working inside the existing AlphaVest WealthOS repository.

## Goal

Harden sensitive confirmations so they are not visual-only.

This is Phase 3 of the Minimum Path.

## Source requirements

Read:

1. `ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md`
2. Phase 2 exit report
3. `components/internal-workflow-screen.tsx`
4. `components/decisions-governance-screen.tsx`
5. any components touched by the Review → Advisor Approval → Compliance workflow
6. `app/api/demo-workflow/route.ts`
7. `lib/demo-workflow-validation.ts`
8. `lib/demo-workflow-mutation.ts`
9. `lib/audit-service.ts`
10. existing interaction/workflow tests.

## Surfaces to inspect

At minimum inspect:

* release confirmation,
* compliance block confirmation,
* request evidence confirmation,
* role/permission confirmation if touched,
* export approval confirmation if in current MVP scope,
* any drawer/modal/action surface touched by Phase 2.

## Required behaviour

Every sensitive confirmation touched in this phase must have:

* controlled user input where required,
* disabled submit until valid,
* cancel path,
* loading/submitting state,
* success state,
* error state,
* server-side validation,
* audit expectation for critical action,
* no mutation on cancel,
* no mutation on invalid input,
* no mutation on denied action.

## Forbidden work

Do not:

* leave prefilled confirmation phrases as proof,
* use close-only controls as confirmed actions,
* make modal visibility equal action success,
* expand product scope,
* create new routes by default,
* change schema by default,
* claim MVP/P0 readiness.

## Required tests

At minimum prove:

1. confirmation cannot submit while invalid,
2. cancel performs no mutation,
3. valid confirmation calls API and persists result,
4. invalid server-side confirmation fails closed,
5. audit exists for critical successful action,
6. denied action does not mutate.

## Required exit report

Return and append to `ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md` if it exists, otherwise include in response:

```md
## Phase 3 Exit — Confirmation Lifecycle Hardening

### Files changed
### Surfaces hardened
### Reactive lifecycle states added
### Server-side confirmation validation
### Tests added/updated
### Commands run
### Results
### Remaining blockers
### Claims still not allowed
```

Do not proceed to Prompt 05 unless this phase is complete or blockers are explicitly classified.
```

---

## 10. Full Prompt 05 — Client Visibility Proof

Copy and run this only after Prompt 04 is complete or its blockers are classified and accepted.

```md
# CODEX PROMPT 05 — AlphaVest Client Visibility Proof

You are Codex working inside the existing AlphaVest WealthOS repository.

## Goal

Prove that internal workflow states and client-visible states are separated.

This is Phase 4 of the Minimum Path.

## Source requirements

Read:

1. `ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md`
2. Phase 2 and Phase 3 exit reports
3. `lib/visibility-engine.ts`
4. `lib/permission-engine.ts`
5. workflow API/service touched in Phase 2
6. `components/client-intake-screen.tsx`
7. any client-facing route/screen
8. document/evidence services
9. tests around permission, visibility, workflow, client payloads and export if touched.

## Required behaviour

Prove or implement within existing authority:

1. client cannot see draft/internal/unreleased recommendation,
2. client cannot see AI Draft,
3. client cannot see internal rationale,
4. client cannot see compliance notes,
5. client cannot see unreleased evidence,
6. after compliance release and visibility rules pass, client sees only safe/redacted output,
7. internal actors see appropriate internal states by role,
8. cross-tenant access fails closed,
9. wrong-role access fails closed.

## Forbidden work

Do not:

* make client visibility true because advisor approved,
* expose AI Draft,
* expose compliance notes,
* expose unreleased evidence,
* imply production auth if only demo session exists,
* create new APIs by default,
* change schema by default,
* claim MVP/P0 readiness.

## Required tests

At minimum prove:

1. internal actor can see internal state,
2. client sees hidden/redacted/pending pre-release,
3. client sees safe output after compliance release,
4. client never receives AI Draft/internal rationale/compliance notes,
5. cross-tenant access fails closed,
6. wrong-role access fails closed,
7. export/client payload does not leak forbidden fields if export is touched.

## Required exit report

Return and append to `ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md` if it exists, otherwise include in response:

```md
## Phase 4 Exit — Client Visibility Proof

### Files changed
### Visibility rules touched
### Internal vs client state proof
### Forbidden payload proof
### Role/tenant tests added/updated
### Commands run
### Results
### Remaining blockers
### Claims still not allowed
```

Do not proceed to Prompt 06 unless this phase is complete or blockers are explicitly classified.
```

---

## 11. Full Prompt 06 — P0 Tests and Validation

Copy and run this only after Prompt 05 is complete or its blockers are classified and accepted.

```md
# CODEX PROMPT 06 — AlphaVest P0 Tests and Validation

You are Codex working inside the existing AlphaVest WealthOS repository.

## Goal

Run the proof gate for the Minimum Path.

This is Phase 5 of the Minimum Path.

Do not claim MVP readiness before this phase passes and a separate readiness audit is completed.

## Pre-check

Before running commands:

1. inspect `package.json`,
2. inspect test scripts,
3. inspect DB/test environment requirements,
4. confirm whether commands may seed or mutate a safe test DB only,
5. classify unsafe commands as `NOT_RUN_MUTATION_RISK`,
6. classify missing scripts as `SCRIPT_NOT_FOUND`.

## Suggested commands

Run only if safe and available:

```bash
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm build
pnpm test:playwright
pnpm test:permissions
pnpm test:workflow-gate
pnpm test:workflow-api
pnpm test:route-smoke
pnpm test:data-quality
pnpm test:file-export
pnpm test:phase-d
```

If a command fails, mark:

```text
COMMAND_FAILED
```

If a script does not exist, mark:

```text
SCRIPT_NOT_FOUND
```

If unsafe to run, mark:

```text
NOT_RUN_MUTATION_RISK
```

## Required proof

At minimum prove:

1. tenant-scoped upload reload,
2. typed review/advisor/compliance workflow,
3. confirmation lifecycle,
4. client visibility separation,
5. audit for critical transitions,
6. no advisor approval equals client release,
7. no upload equals evidence sufficiency,
8. no AI Draft client visibility,
9. role/tenant denial,
10. validation/build health.

## Forbidden work

Do not:

* edit code unless fixing a failed test within the already implemented Minimum Path scope,
* add new product scope,
* create new APIs by default,
* change schema by default,
* run migrations against unsafe data,
* claim P0 passed if commands fail or are not run,
* claim MVP ready.

## Required exit report

Return and append to `ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md` if it exists, otherwise include in response:

```md
## Phase 5 Exit — P0 and Validation

### Commands run
### Results
### Scripts missing
### Commands not run and why
### Tests passed
### Tests failed
### DB/env blockers
### P0 impact
### MVP readiness impact
### Claims still not allowed
```

Do not proceed to final MVP claim. Proceed only to Prompt 07 final patch report.
```

---

## 12. Full Prompt 07 — Final Patch Report

Copy and run this after Prompt 06.

```md
# CODEX PROMPT 07 — AlphaVest Final Minimum Path Patch Report

You are Codex working inside the existing AlphaVest WealthOS repository.

## Goal

Create or update the final Minimum Path patch report.

Do not implement new changes unless required to accurately write the report. Do not claim MVP ready.

## Source requirements

Read:

1. `ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md`
2. all Phase 1–5 exit reports,
3. git diff,
4. git status,
5. relevant test output,
6. relevant command output,
7. current changed files.

## Required output file

Create or update:

`ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md`

with exactly this structure:

```md
# ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md

## 1. Executive Decision
Use one:
- MVP_MINIMUM_PATH_PATCH_PASSED
- MVP_MINIMUM_PATH_PATCH_PASSED_WITH_LIMITATIONS
- MVP_MINIMUM_PATH_PATCH_PARTIAL_BLOCKERS_REMAIN
- MVP_MINIMUM_PATH_PATCH_BLOCKED

## 2. Source Artefacts Read

## 3. Changed Files

## 4. Phase 1 — Tenant-Scoped Upload Reload

## 5. Phase 2 — Typed Persistent Review Approval Compliance Workflow

## 6. Phase 3 — Confirmation Lifecycle Hardening

## 7. Phase 4 — Client Visibility Proof

## 8. Phase 5 — P0 Tests and Validation

## 9. Tests Added / Updated

## 10. Commands Run and Results

## 11. Blockers / Deferred / Out-of-Scope

## 12. MVP Readiness Impact

## 13. Claims Still Not Allowed

## 14. Next Steps
```

## Decision rules

Use:

* `MVP_MINIMUM_PATH_PATCH_PASSED` only if all five phases pass, required tests pass, and validation commands pass or non-critical script-missing cases are documented.
* `MVP_MINIMUM_PATH_PATCH_PASSED_WITH_LIMITATIONS` if the minimum path is implemented and proven for a constrained MVP vertical, but some non-critical areas remain demo/static/deferred.
* `MVP_MINIMUM_PATH_PATCH_PARTIAL_BLOCKERS_REMAIN` if some patch phases are implemented but important proof or workflow blockers remain.
* `MVP_MINIMUM_PATH_PATCH_BLOCKED` if source, DB, schema, API, product, safety or test blockers prevent safe completion.

## Required no-overclaim section

Include claims still not allowed, especially:

* `MVP_READY`,
* `P0_PASSED` if not fully proven,
* fully DB-backed app,
* production-ready app,
* complete RBAC/auth,
* complete export if export remains metadata-only,
* all workflows real.

## Final instruction

Be strict. The report must reflect evidence, not optimism.
```

---

## 13. Optional Full Prompt 08 — Post-Patch MVP Readiness Re-Audit

Run this only after Prompt 07 is complete and all test/validation outputs are available.

```md
# OPTIONAL CODEX / CHATGPT PROMPT 08 — AlphaVest Post-Patch MVP Readiness Re-Audit

You are auditing the patched AlphaVest WealthOS repository and final Minimum Path patch report.

## Goal

Determine whether the Minimum Path patches changed the MVP readiness status.

Create:

`ALPHAVEST_POST_PATCH_MVP_READINESS_REAUDIT.md`

Do not implement. Do not write tests. Audit only.

## Sources to read

1. `ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md`
2. `ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT.md`
3. all Phase 1–5 exit reports
4. command/test output referenced by the patch report
5. changed files from the Minimum Path patch
6. prior `ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md`
7. prior `ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md`

## Required decision

Use exactly one:

* `MVP_READY`
* `MVP_READY_WITH_MINOR_LIMITATIONS`
* `MVP_CANDIDATE_PATCH_REQUIRED`
* `ADVANCED_DEMO_NOT_MVP_READY`
* `INSUFFICIENT_EVIDENCE`
* `BLOCKER`

## Required gates

Evaluate:

1. real interaction lifecycle,
2. DB-backed core workflow,
3. persisted reload proof,
4. typed user payloads,
5. role/permission proof,
6. client visibility proof,
7. evidence sufficiency proof,
8. audit proof,
9. export proof or explicit exclusion/truth-labeling,
10. error/blocked states,
11. P0 test proof,
12. validation command proof.

## Required output structure

```md
# ALPHAVEST_POST_PATCH_MVP_READINESS_REAUDIT.md

## 1. Executive Decision
## 2. Evidence Read
## 3. Before vs After
## 4. MVP Gate Matrix
## 5. What Is Now Proven
## 6. What Remains Partial / Demo / Static
## 7. Remaining Blockers
## 8. Claims Allowed
## 9. Claims Still Not Allowed
## 10. Recommendation
```

## Recommendation options

Use one:

* `CALL_IT_MVP_READY_WITH_LIMITATIONS`
* `CALL_IT_MVP_CANDIDATE`
* `KEEP_AS_ADVANCED_DB_BACKED_DEMO`
* `RUN_MORE_PATCHES_FIRST`
* `BLOCK_RELEASE_CLAIMS`

Do not call it MVP-ready unless proof is actually present.
```

---

## 14. Acceptance Criteria for Prompt Pack

| Criterion | Required Standard | Pass/Fail |
|---|---|---|
| all mandatory prompts included | Prompts `00` through `07` are present. | PASS |
| optional re-audit prompt included | Prompt `08` is present and marked optional. | PASS |
| each prompt copy-paste-ready | Each full prompt is self-contained. | PASS |
| each prompt includes stop rules | Global or phase-level stop rules are included. | PASS |
| each prompt includes source requirements | Source files are listed per prompt. | PASS |
| each prompt includes output requirement | Each prompt specifies expected output. | PASS |
| implementation prompts require reports | Phase prompts require exit reports. | PASS |
| no new APIs by default | API creation is blocked unless classified. | PASS |
| no schema changes by default | Schema changes are blocked unless classified. | PASS |
| no scope change | Route/workset/product-scope changes forbidden. | PASS |
| no MVP/P0 overclaim | Claims blocked until proof and re-audit. | PASS |

---

## 15. Final Summary

* Created the full Codex prompt pack for the AlphaVest MVP Minimum Path.
* Required run order is `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`.
* Optional re-audit prompt `08` should run only after patches and validation proof exist.
* Prompts `02` through `05` implement targeted minimum patches.
* Prompt `06` handles tests and validation.
* Prompt `07` produces the final patch report.
* The pack forbids new product scope, route changes, new APIs by default, schema changes by default and MVP/P0 overclaim.
* The next step is to copy Prompt `00` into Codex inside the AlphaVest repository.
