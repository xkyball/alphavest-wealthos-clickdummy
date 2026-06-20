# PROMPT — AlphaVest MVP Minimum Path Targeted Patch Implementation for Codex

You are Codex working inside the existing AlphaVest WealthOS repository.

## 1. Goal

Implement the **minimum path to MVP candidate readiness** identified by the current reality audit and MVP readiness verdict.

This is not a broad rewrite. This is not a new product scope. This is a targeted patch sequence to move AlphaVest from:

```text
Advanced DB-backed demo / MVP candidate after targeted patches
```

toward:

```text
MVP_CANDIDATE_PATCHED_WITH_PROOF
```

The required minimum path is:

1. fix tenant-scoped upload reload,
2. implement one complete typed and persistent Review → Advisor Approval → Compliance workflow vertical,
3. harden sensitive confirmations,
4. prove client visibility,
5. write/run P0 tests and validation commands.

You must work phase-by-phase. Do not implement outside the current phase. Do not silently make product decisions. Every ambiguity must be classified before editing.

Create or update a final report:

```text
ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md
```

---

## 2. Source-of-Truth Order

Read these first:

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

Then read the audit/verdict artefacts in the repo root or docs folder if present:

12. `ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md`
13. `ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md`

Then inspect repo reality:

* `package.json`
* `prisma/schema.prisma`
* `lib/prisma.ts`
* `app/api/demo-workflow/route.ts`
* `app/api/documents/route.ts`
* `app/api/documents/upload/route.ts`
* `app/api/review-monitoring/route.ts`
* `lib/document-upload-service.ts`
* `lib/demo-workflow-mutation.ts`
* `lib/demo-workflow-validation.ts`
* `lib/workflow-gate.ts`
* `lib/visibility-engine.ts`
* `lib/permission-engine.ts`
* `lib/audit-service.ts`
* relevant `components/**`
* relevant `tests/**`

If any required handoff or verdict artefact is missing, do not guess. Report `MISSING_INPUT`.

---

## 3. Hard Stop Rules

Do not:

* create new product scope,
* change route worksets,
* promote P1/Hold/reference routes,
* generate screens, images, state-screens or replacement visuals,
* create new API routes by default,
* replace Prisma schema with patch schema,
* run migrations unless explicitly required and approved by existing handoff authority,
* use `main` as target truth,
* make AI Draft client-visible,
* make advisor approval equal compliance release,
* make upload success equal evidence sufficiency,
* make export preview equal export approval,
* claim P0 passed without executed tests,
* claim MVP ready without validation proof,
* silently resolve product/safety/API/schema ambiguity.

If a new endpoint, schema migration, route-scope change or product decision seems necessary, classify it as:

```text
BLOCKER
```

or:

```text
PRODUCT_DECISION_REQUIRED
API_DECISION_REQUIRED
SCHEMA_DECISION_REQUIRED
```

and stop.

---

## 4. Required Pre-Edit Report

Before changing files, return:

```md
# ALPHAVEST_MVP_MINIMUM_PATH_PRE_EDIT_REPORT

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

If the decision is not `ENTRY_READY` or `ENTRY_READY_WITH_TECHNICAL_CHOICES`, stop.

---

## 5. Allowed Technical Choices

You may decide:

* file inspection order,
* local helper names,
* whether to extend an existing test file or create a new test file,
* local UI state variable names such as `modalState`, `activeDrawer`, `confirmationInput`,
* whether a previously static surface should be classified as permanent page region or reactive lifecycle surface, if this is already allowed by the UI patch,
* technical implementation order inside the current phase.

You must document each technical choice in the phase report.

You must not decide product behaviour, route scope, schema authority, new APIs, safety boundaries or P0 pass status.

---

# 6. Patch Phases

## Phase 0 — Baseline and No-Decision Guard

### Goal

Confirm repo state, source hierarchy, target branch, package scripts and DB readiness.

### Required actions

1. Read all source artefacts listed above.
2. Inspect `package.json` scripts.
3. Inspect DB config and Prisma setup.
4. Inspect current tests.
5. Inspect whether `DATABASE_URL` / test DB assumptions are documented.
6. Confirm no `main` target usage.
7. Create the pre-edit report.

### Must not do

* no code edits,
* no commands that mutate DB,
* no migrations,
* no tests until DB/test env safety is clear.

### Exit criteria

* Pre-edit report produced.
* Ambiguities classified.
* Phase 1 can begin safely.

---

## Phase 1 — Tenant-Scoped Upload Reload Fix

### Goal

Fix the strongest existing vertical first: document upload must reload per active tenant/session instead of a hardcoded tenant.

### Known audit problem

The audit found that the document upload vertical is the strongest DB-backed path, but the UI fetches persisted documents using hardcoded `tenantSlug=morgan`.

### Files to inspect

* `components/client-intake-screen.tsx`
* `components/demo-session-provider.tsx`
* `app/api/documents/route.ts`
* `app/api/documents/upload/route.ts`
* `lib/document-upload-service.ts`
* existing document upload tests

### Allowed implementation

* Replace hardcoded tenant reload with active tenant/session/route context already present in the app.
* Keep using existing `/api/documents` and `/api/documents/upload`.
* Preserve upload-only semantics.
* Preserve role/tenant validation.
* Preserve DB-backed persisted upload path.
* Update or add tests for tenant-scoped reload.

### Must not do

* do not add a new documents API route,
* do not change schema unless existing code already supports required fields,
* do not treat upload as evidence sufficiency,
* do not widen client visibility.

### Required tests

At minimum:

* upload succeeds for active tenant,
* uploaded document appears after reload for that tenant,
* uploaded document does not appear for another tenant,
* invalid role/tenant remains denied,
* upload success does not set evidence sufficiency/release/export/client visibility.

### Exit report section

```md
## Phase 1 Exit — Tenant-Scoped Upload Reload
- Files changed
- Tenant source used
- API path used
- Tests added/updated
- Commands run
- Remaining blockers
```

---

## Phase 2 — Typed Persistent Review → Advisor Approval → Compliance Workflow Vertical

### Goal

Implement one complete core workflow vertical with typed user payloads and DB persistence:

```text
Review → Advisor Approval → Compliance Release / Block / Request Evidence
```

This must replace the relevant actionId-only path for one MVP workflow vertical with typed UI payload → existing API route → service → Prisma persistence → reload proof.

### Files to inspect

* `app/api/demo-workflow/route.ts`
* `lib/demo-workflow-validation.ts`
* `lib/demo-workflow-mutation.ts`
* `lib/workflow-gate.ts`
* `lib/visibility-engine.ts`
* `lib/permission-engine.ts`
* `lib/audit-service.ts`
* `prisma/schema.prisma`
* `components/internal-workflow-screen.tsx`
* `components/decisions-governance-screen.tsx`
* workflow-related tests

### Allowed implementation

* Use the existing `/api/demo-workflow` route as the existing workflow API surface.
* Extend existing validation to accept typed payloads for this selected workflow vertical.
* Add or harden service logic to persist:
  * review state,
  * advisor approval state,
  * compliance release/block/request evidence state,
  * actor,
  * reason/comment,
  * audit event.
* Preserve the existing `actionId` demo path only if needed for backward demo compatibility, but do not claim it as the MVP workflow.
* Add reload proof from persisted DB state after mutation.
* Keep advisor approval separate from compliance release.
* Keep client visibility false until compliance release plus visibility rules pass.

### Required typed payload shape

Define a minimal typed payload within the existing API surface, for example:

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

Adapt names to existing code conventions. Do not invent product semantics outside the handoff.

### Must not do

* do not create a new API route unless you stop with `API_DECISION_REQUIRED`,
* do not promote hold/P1 routes,
* do not make advisor approval release to client,
* do not bypass evidence/audit requirements,
* do not create schema models from patch concepts,
* do not claim production auth if the app uses demo session.

### Required tests

At minimum:

* submit review persists state,
* advisor approval persists but does not release to client,
* compliance release persists only after prerequisites,
* compliance block persists and prevents client visibility,
* request evidence persists reason/comment,
* wrong role/action/object fails closed,
* audit row exists for critical transitions,
* reload after mutation shows persisted state.

### Exit report section

```md
## Phase 2 Exit — Typed Persistent Review Approval Compliance Workflow
- Typed payload implemented
- Existing API route used
- Service/Prisma persistence path
- Advisor vs compliance boundary proof
- Audit proof
- Tests added/updated
- Commands run
- Remaining blockers
```

---

## Phase 3 — Confirmation Lifecycle Hardening

### Goal

Harden sensitive confirmations so they are not visual-only.

### Surfaces to inspect

* release confirmation,
* block/request evidence confirmation,
* role/permission confirmation,
* export approval confirmation if in MVP scope,
* any drawer/modal/action surface touched by Phase 2.

### Required behaviour

Every sensitive confirmation must have:

* controlled user input where required,
* disabled submit until valid,
* cancel path,
* loading/submitting state,
* success state,
* error state,
* server-side validation,
* audit expectation for critical action,
* no mutation on cancel/invalid/denied.

### Must not do

* do not leave prefilled confirmation phrases as proof,
* do not use close-only controls as confirmed actions,
* do not make modal visibility equal action success.

### Required tests

* confirmation cannot submit while invalid,
* cancel performs no mutation,
* valid confirmation calls API and persists result,
* invalid server-side confirmation fails closed,
* audit exists for critical successful action,
* denied action does not mutate.

### Exit report section

```md
## Phase 3 Exit — Confirmation Lifecycle Hardening
- Surfaces hardened
- Reactive lifecycle states added
- Server-side confirmation validation
- Tests added/updated
- Commands run
- Remaining blockers
```

---

## Phase 4 — Client Visibility Proof

### Goal

Prove that internal workflow state and client-visible state are separated.

### Required behaviour

* Client cannot see draft/internal/unreleased recommendation.
* Client cannot see AI Draft/internal rationale/compliance notes.
* Client cannot see evidence that is not released/redacted/safe.
* After compliance release and visibility rules pass, client sees only safe/redacted output.
* Internal actors see appropriate internal states by role.
* Cross-tenant or wrong-role access fails closed.

### Files to inspect

* `lib/visibility-engine.ts`
* `lib/permission-engine.ts`
* `components/client-intake-screen.tsx`
* any client-facing route/screen
* workflow API/service from Phase 2
* document/evidence services
* tests around permissions/visibility/workflow

### Must not do

* do not make client visibility true because advisor approved,
* do not expose AI Draft,
* do not expose compliance notes,
* do not expose unreleased evidence,
* do not imply production auth if only demo session exists.

### Required tests

* internal actor can see internal state,
* client sees hidden/redacted/pending pre-release,
* client sees safe output after release,
* client never receives AI Draft/internal rationale/compliance notes,
* cross-tenant access fails closed,
* export/client payload does not leak forbidden fields if export touched.

### Exit report section

```md
## Phase 4 Exit — Client Visibility Proof
- Visibility rules touched
- Internal vs client state proof
- Forbidden payload proof
- Role/tenant tests added/updated
- Commands run
- Remaining blockers
```

---

## Phase 5 — P0 Tests and Validation

### Goal

Run the proof gate. Do not claim MVP readiness before this phase passes.

### Required checks

Inspect scripts first. Then run safe commands using the correct development/test DB environment.

Suggested commands, only if safe and available:

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

If a script does not exist:

```text
SCRIPT_NOT_FOUND
```

If a command fails:

```text
COMMAND_FAILED
```

If a command would mutate unsafe data or requires missing DB safety:

```text
NOT_RUN_MUTATION_RISK
```

### Required final test proof

At minimum prove:

* tenant-scoped upload reload,
* typed review/advisor/compliance workflow,
* confirmation lifecycle,
* client visibility separation,
* audit for critical transitions,
* no advisor approval = client release,
* no upload = evidence sufficiency,
* no AI Draft client visibility,
* role/tenant denial,
* validation/build health.

### Exit report section

```md
## Phase 5 Exit — P0 and Validation
- Commands run
- Results
- Scripts missing
- Tests passed
- Tests failed
- DB/env blockers
- P0 impact
- MVP readiness impact
```

---

## 7. Final Report Required

At the end, create or update:

```text
ALPHAVEST_MVP_MINIMUM_PATH_PATCH_REPORT.md
```

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

---

## 8. Final Decision Rules

Use:

### `MVP_MINIMUM_PATH_PATCH_PASSED`

Only if all five phases pass, required tests pass, and validation commands pass or documented non-critical script missing cases exist.

### `MVP_MINIMUM_PATH_PATCH_PASSED_WITH_LIMITATIONS`

If the minimum path is implemented and proven for a constrained MVP vertical, but some non-critical areas remain demo/static/deferred.

### `MVP_MINIMUM_PATH_PATCH_PARTIAL_BLOCKERS_REMAIN`

If some patch phases are implemented but important proof or workflow blockers remain.

### `MVP_MINIMUM_PATH_PATCH_BLOCKED`

If source, DB, schema, API, product, safety or test blockers prevent safe completion.

Do not claim `MVP_READY` unless a separate MVP readiness audit after this patch confirms it.

---

## 9. Final Instruction

Be strict.

Do the smallest safe work that converts the minimum path from demo/static/partial into typed, persisted, reloadable, role-aware, visibility-safe, test-proven behaviour.

If a decision is missing, stop and classify it. Do not invent product meaning.