# ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md

**Generated:** 2026-06-21  
**Mode:** Focused Codex Prompt Pack. Keine Ausführung in diesem Artefakt. Keine Codeänderung in diesem Artefakt. Keine Screen-/Image-/State-Screen-Generation.  
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`  
**Target branch:** `full-workflow`  
**Highest source:** `ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md`  
**Scope:** DB-backed Tables/Search/Filter/Sort + DB-backed Forms/Input/Wizards + Seed Data + Metrics/Charts/Gauges + focused tests only.

---

## 1. Executive Decision

**Decision:** `DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK_ACCEPTED_FOR_FOCUSED_PHASED_CODEX_EXECUTION`

This Prompt Pack translates the focused Rebase Plan into phased, copy/paste-ready Codex prompts.

Codex may later implement only the focused DBTF work listed here:

1. **DB-backed table/list/board/card data**
2. **Search / filter / sort / pagination against real rows**
3. **Row actions and RBAC row filtering**
4. **DB-backed forms / input masks / validation / save / submit / reload**
5. **Wizard lifecycle where explicitly in scope**
6. **Seed data expansion for table/filter/form/metric states**
7. **Data-derived metrics/charts/gauges**
8. **Focused positive and negative tests**
9. **Cleanup / hide / static label of fake visible controls**

This Prompt Pack does **not** authorize broad AlphaVest implementation, full advice/compliance/export architecture, new screens, screen generation, blind API creation, blind Prisma migrations or any work not listed in the focused Rebase Plan.

---

## 2. Source-of-Truth Lock

| Rank | Source | Role | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | `ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md` | Direct focused source | Workstreams, tasks, subtasks, decisions, DB-backed gaps, seed/chart/form/table matrices | Do not widen scope beyond it |
| 2 | Current `full-workflow` repo | Code reality | Verify files, package commands, APIs, Prisma, seed, tests | Do not invent target files |
| 3 | `ALPHAVEST_SCREEN_FUNCTIONALITY_REALITY_GAP_AUDIT.md` | Gap context | Confirms table/form/DB-backed false-completeness risks | Not implementation proof |
| 4 | `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md` | Broad release context | Stop rules, do-not-implement guardrails | Not primary task source here |
| 5 | Existing broad Codex Prompt Pack, if present | Historical / stale comparison | Compare only | Do not execute blindly |
| 6 | SCF artefacts and safety/API/schema/test contracts | Context / guardrails | Traceability and focused safety | Do not expand scope |
| 7 | `main` branch / zip | False-gap source only | Historical warning | Never target truth |

---

## 3. Predecessor Intake Matrix

| Artefact / Source | Exists / Reachable? | Role | Key Findings / Counts | Blocking Issues | Use in Prompt Pack |
|---|---:|---|---|---|---|
| `ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md` | YES | Direct source | 9 workstreams, 18 focused tasks, 20 seed subtasks, 6 focused test families | None for prompt-pack creation | Highest authority |
| Current `full-workflow` repo | TO_VERIFY_BY_CODEX | Code reality | Repo was web-inspected in rebase plan; Codex must verify checked-out repo before editing | Local environment may differ | P00 baseline verification |
| `ALPHAVEST_SCREEN_FUNCTIONALITY_REALITY_GAP_AUDIT.md` | YES | Gap context | Search/filter/sort/forms/wizards/metrics remain core gaps | Not code proof | Context only |
| Broad Release Plan | YES / optional | Guardrail | Do-not-implement, no screen generation, no broad scope | Not focused enough | Stop rules |
| Existing broad Codex Prompt Pack | OPTIONAL | Comparison | Too broad and pending focused rebase | Do not execute | Superseded for focused DBTF work |

---

## 4. Codex Prompt Pack Derivation Method

```text
1. Treat the focused Rebase Plan as highest source.
2. Keep scope limited to DB-backed Tables/Search/Filter/Sort and Forms/Input/Wizards plus Seed/Metrics/Tests.
3. Convert WS-01..WS-09 into DBTF-Pxx phase prompts.
4. Preserve all decisions: IMPLEMENT_NOW, DB_BACK_NOW, SEED_NOW, HARDEN_NOW, HIDE_NOW, STATIC_EXPLICIT, DEFER_P1, HOLD_BLOCKED, REFERENCE_ONLY, TO_VERIFY.
5. Use current repo verification before editing.
6. Use package.json as command source.
7. Require focused positive and negative tests.
8. Stop after each phase and report.
9. Do not run Codex inside this artefact.
```

---

## 5. Focus Scope Boundary

### Authorized

| Area | Authorized Treatment |
|---|---|
| Tables/lists/boards/card-lists | DB/API/service/seed-backed data or explicit static/hide/defer |
| Search/filter/sort/pagination | Implement only against real rows/data |
| Row actions | Permission, state feedback and tests required |
| Forms/input masks | Controlled state, validation, save/submit, persistence, reload |
| Wizards | Real next/back/cancel/save/submit lifecycle or static/defer/hide |
| Seed data | Add deterministic rows/states for focused surfaces |
| Metrics/charts/gauges | Derive from DB/seed/service data or static/hide/remove |
| Hardcoded dynamic data | Replace, hide, remove or explicitly static/reference label |
| Tests | Add/update focused DBTF positive and negative tests |

### Blocked

| Area | Blocked Action |
|---|---|
| Full Advice Engine | Do not implement |
| Full Compliance Architecture | Do not implement beyond table/form/data touchpoints |
| Full Export Architecture | Do not implement beyond table/data/metric touchpoints |
| New screens / screen generation | Do not create |
| Production auth rebuild | Do not do |
| Blind API creation | Block unless explicitly authorized in a DBTF phase |
| Blind Prisma migration | Block unless explicitly authorized in a DBTF phase |
| Patch-schema replacement | Do not do |
| P1/Hold/Reference promotion | Do not do |
| `main` branch | Never target truth |

---

## 6. Global Codex Rules

Codex must:

* Work only on the current `full-workflow` branch / repo.
* Read `package.json` before running commands.
* Verify target files and services before editing.
* Use existing Prisma schema and seed as baseline.
* Mark missing target areas as `BLOCKED_TARGET_NOT_FOUND`.
* Keep every change inside the DBTF focus.
* Stop and report after each phase.
* Report changed files, inspected files, tests run, proofs, blockers and stop-rule triggers.

Codex must not:

* Make product decisions.
* Invent new architecture if target files are missing.
* Treat hardcoded dynamic arrays as product data.
* Treat `DataTable` rendering as search/sort/filter proof.
* Treat `FilterBar` rendering as filter proof.
* Treat wizard steppers as wizard behaviour.
* Treat forms without save/validation/API/persistence as implemented.
* Treat metrics/charts/gauges as product metrics unless data-derived.
* Run broad AlphaVest implementation phases.
* Generate screens/images/state-screens.

---

## 7. Repository Discipline and Branch Rules

```text
Target branch: full-workflow
Target repo: https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow
main: false-gap source only, never target truth
```

Before any edit, Codex must verify:

```text
package.json
app/**
app/api/**
components/**
components/ui/**
lib/**
prisma/schema.prisma
prisma/seed.ts
scripts/**
tests/**
```

If a target area differs:

```text
Search for equivalent. If no equivalent exists, stop and report BLOCKED_TARGET_NOT_FOUND. Do not create unrelated new architecture.
```

---

## 8. Validation Command Discovery Rules

Codex must read `package.json` and discover actual commands. Candidate commands from the rebase plan are not automatically true in the checked-out repo.

| Command Category | Candidate Command | Source | Required? | If Missing |
|---|---|---|---:|---|
| Typecheck | `pnpm typecheck` | package.json expected | YES if present | Report `COMMAND_NOT_FOUND` |
| Lint | `pnpm lint` | package.json expected | YES if present | Report `COMMAND_NOT_FOUND` |
| Build | `pnpm build` | package.json expected | YES before final proof if present | Report |
| DB validate | `pnpm db:validate` | package.json expected | YES if DB touched and present | Report |
| DB seed | `pnpm db:seed` | package.json expected | YES if seed touched and present | Report |
| Document upload API | `pnpm test:document-upload-api` | expected | Targeted when docs changed | Report |
| Document upload flow | `pnpm test:document-upload-flow` | expected | Targeted when upload UI changed | Report |
| Route smoke | `pnpm test:route-smoke` | expected | Regression if present | Report |
| Playwright broad | `pnpm test:playwright` | expected | As feasible | Report |
| Focused DBTF tests | exact command TBD | To create/discover | YES after tests added | If no command, run matching Playwright/spec command if present |

---

## 9. Reporting Requirements

Every phase report must include:

| Report Field | Required Content |
|---|---|
| Phase ID | `DBTF-Pxx` |
| Completed Workstream IDs | List |
| Completed Task IDs | List |
| Completed Subtask IDs | List |
| Files changed | List |
| Files inspected only | List |
| DB/Seed changes | List or `none` |
| API/Service changes | List or `none` |
| Tests run | Commands + result |
| Proofs produced | test output / API output / seed output / screenshots if useful |
| Positive acceptance result | PASS/FAIL per criterion |
| Negative acceptance result | PASS/FAIL per criterion |
| Stop rules triggered | yes/no + details |
| Deviations | Every deviation with reason |
| Blockers | Every blocking uncertainty |
| Next recommended phase | Phase/task |

---

## 10. Prompt Pack Index

| Prompt ID | Phase | Purpose | Authorized Workstreams / Tasks | Must Run After | Must Stop Before | Output Report |
|---|---|---|---|---|---|---|
| DBTF-P00 | Repo / Package / Prisma / Seed / Test Baseline Verification | Verify repo and command reality | all verification only | Start | Any feature edit | Baseline report |
| DBTF-P01 | Data Source Inventory & Hardcoded Dynamic Data Cleanup | Classify and clean fake dynamic data | WS-09, supporting all WS | P00 | DB-backed implementation if target baseline missing | Cleanup report |
| DBTF-P02 | DB-backed List/Table Data Rebase | Move key lists/tables to DB/API/service/seed | WS-01 | P00/P01 | Search/sort implementation | Data source report |
| DBTF-P03 | Real Search / Filter / Sort / Pagination | Implement real list operations | WS-02 | P02 | Row actions | Behaviour report |
| DBTF-P04 | Row Actions and RBAC Row Filtering | Harden row permissions/actions | WS-03 | P02/P03 | Form persistence where shared role logic absent | RBAC row report |
| DBTF-P05 | DB-backed Forms / Input Masks / Field Validation | Implement focused forms | WS-04 | P00/P01 | Wizard lifecycle | Form report |
| DBTF-P06 | Wizard Lifecycle / Save Draft / Submit / Reload | Implement/defer/static focused wizards | WS-05 | P05 | Seed expansion if fields unclear | Wizard report |
| DBTF-P07 | Seed Data Coverage Expansion | Add deterministic seed states | WS-06 | P02/P05/P06 as needed | Metrics/tests relying on seed | Seed report |
| DBTF-P08 | Chart / Gauge / Metric Data Derivation | Derive metrics or static/hide | WS-07 | P07 | Final tests | Metrics report |
| DBTF-P09 | Focused Tests and Validation Closure | Add/update focused tests | WS-08 | P02-P08 | Proof package | Test report |
| DBTF-P10 | Proof Package / Regression / Rebase Summary | Consolidate proof | all | P09 | Further implementation | Final proof report |

---

# 11. Global Codex Start Prompt

```text
You are Codex working on AlphaVest WealthOS.

Use only the `full-workflow` target repository. Do not use `main` as target truth.

Your active implementation source is:
ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md

Your highest planning source is:
ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md

Scope is strictly limited to:
1. DB-backed Tables / Lists / Boards / Card-lists
2. Search / Filter / Sort / Pagination against real rows
3. Row actions and RBAC row filtering
4. DB-backed Forms / Input Masks / Wizards
5. Seed data for tables/forms/metrics
6. Data-derived Metrics / Charts / Gauges
7. Focused tests and proof

Before any phase:
- Verify package.json commands.
- Verify target files exist.
- If a target file or equivalent cannot be found, stop with BLOCKED_TARGET_NOT_FOUND.
- Do not invent unrelated architecture.
- Do not generate screens/images/state-screens.
- Do not create blind APIs or blind Prisma migrations.
- Stop after each phase and report using the Phase Reporting Template.
```

---

# 12. CODEX PHASE PROMPT — DBTF-P00 — Repo / Package / Prisma / Seed / Test Baseline Verification

## 1. Mission

Verify the current repo baseline before edits. No feature work.

## 2. Binding Sources

1. `ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md`
2. Current `full-workflow` repo
3. package.json, Prisma schema, seed, tests

## 3. Authorized Workstream / Task IDs

Verification only for all DBTF workstreams.

## 4. Authorized Subtask IDs

Verification only; no implementation subtasks.

## 5. Target Routes / Components / Data Surfaces

All focused surfaces: `/documents`, `/client/profile`, `/client/family-members`, `/entities`, `/entities/new`, `/governance/audit-history`, `/portal`, `/mobile`, `/export/*`, topbars and relevant admin surfaces.

## 6. Target Files / Areas to Verify Before Editing

```text
package.json
app/**
app/api/**
components/**
components/ui/**
lib/**
prisma/schema.prisma
prisma/seed.ts
scripts/**
tests/**
```

## 7. Implementation Instructions

Do not edit. Inspect and report:

* package scripts
* Prisma schema models relevant to focused surfaces
* seed coverage
* existing APIs/services for documents, evidence, entities, family, audit, export, metrics
* existing tests
* current `DataTable` / `FilterBar` capabilities
* hardcoded demo-data import locations

## 8. Non-Goals

No implementation. No cleanup. No refactor. No schema change.

## 9. API / Service / Prisma / Seed / UX / Test Dependencies

Discovery only.

## 10. Required Positive Acceptance

Baseline report identifies actual files and commands.

## 11. Required Negative Acceptance

Missing commands/files are reported as `COMMAND_NOT_FOUND` or `BLOCKED_TARGET_NOT_FOUND`, not invented.

## 12. Required Tests / Validation Commands

Run no tests unless safe and already installed; command discovery is enough in this phase.

## 13. Required Proof Package

Baseline report with file paths and commands.

## 14. Stop Rules

Stop if repo is not `full-workflow` or target project is missing.

## 15. Reporting Requirements

Use Phase Reporting Template.

## 16. Completion Criteria

P00 complete when baseline report is produced.

---

# 13. CODEX PHASE PROMPT — DBTF-P01 — Data Source Inventory & Hardcoded Dynamic Data Cleanup

## 1. Mission

Inventory hardcoded dynamic data and clean or label fake visible controls where authorized.

## 2. Binding Sources

Rebase Plan hardcoded register and DB-backed data rule.

## 3. Authorized Workstream / Task IDs

| Task ID | Status |
|---|---|
| DBTF-WS09-T001 | `HIDE_NOW` / `STATIC_EXPLICIT` |
| DBTF-WS02-T001 | `HIDE_NOW` unless real scoped search is implemented |
| DBTF-WS09-T002 | `DEFER_P1` / `STATIC_EXPLICIT` |
| DBTF-WS09-T003 | `REFERENCE_ONLY` |
| DBTF-WS09-T004 | `STATIC_EXPLICIT` / `DEFER_P1` |
| DBTF-WS09-T005 | `STATIC_EXPLICIT` |
| DBTF-WS09-T006 | `DEFER_P1` / `STATIC_EXPLICIT` |

## 4. Authorized Subtask IDs

| Subtask ID | Parent |
|---|---|
| DBTF-WS09-T001-S01 | DBTF-WS09-T001 |

## 5. Target Routes / Components / Data Surfaces

Topbars, `/communication`, `/ops/*`, `/states`, `/roadmap`, `/service-blueprint`, `/tenants/demo/users`, `/admin/platform`, `/admin/security`.

## 6. Target Files / Areas to Verify Before Editing

```text
components/top-bar.tsx
components/client-intake-screen.tsx
components/wealth-actions-screen.tsx
components/communication-export-ops-screen.tsx
components/admin-tenant-setup-screen.tsx
components/ui/*
```

Verify actual file names first.

## 7. Implementation Instructions

* Find hardcoded dynamic-looking data and controls outside the focused implementation path.
* Hide, remove or label as static/reference only when authorized by the Rebase Plan.
* For global search, prefer hide/static-label unless a focused DB-backed scoped search service already exists and is explicitly usable without widening scope.
* Preserve genuine MVP DB-backed functionality.
* Do not implement broad communication/ops/admin settings workflows here.

## 8. Non-Goals

No full communication system. No ops dashboard implementation. No new screens. No broad settings API.

## 9. Dependencies

P00 must be complete.

## 10. Required Positive Acceptance

Visible fake controls outside focus no longer imply dynamic product functionality.

## 11. Required Negative Acceptance

No functioning MVP table/form is removed. No P1/Hold route becomes MVP.

## 12. Required Tests / Validation Commands

Run typecheck/lint if available. Update route smoke if hidden/static labels affect visible text.

## 13. Required Proof Package

Changed files, before/after description, list of hidden/static/deferred controls.

## 14. Stop Rules

Stop if deciding whether a control is product-critical requires a product decision not present in Rebase Plan.

## 15. Reporting Requirements

Report all controls changed.

## 16. Completion Criteria

No unlabeled dynamic-looking fake controls in the focused pages identified by the task remain without decision.

---

# 14. CODEX PHASE PROMPT — DBTF-P02 — DB-backed List/Table Data Rebase

## 1. Mission

Back key tables/lists with DB/API/service/seed data.

## 2. Binding Sources

Rebase Plan WS-01 and displayed data source matrix.

## 3. Authorized Workstream / Task IDs

| Task ID | Task |
|---|---|
| DBTF-WS01-T001 | Harden documents table as fully DB-backed |
| DBTF-WS01-T002 | DB-back family members table and visible profile records |
| DBTF-WS01-T003 | DB-back entities list/detail core rows |
| DBTF-WS01-T004 | DB-back audit history table |
| DBTF-WS01-T005 | DB-back or defer action board cards |
| DBTF-WS01-T006 | DB-back admin tenant directory |
| DBTF-WS01-T007 | Verify evidence templates: DB-backed or static |
| DBTF-WS01-T008 | Verify export templates/redaction profiles |
| DBTF-WS01-T009 | DB-back governance audit history table |
| DBTF-WS01-T010 | Harden export scope items if visible/in-focus |

## 4. Authorized Subtask IDs

| Subtask ID | Parent |
|---|---|
| DBTF-WS01-T001-S01 | DBTF-WS01-T001 |
| DBTF-WS01-T001-S02 | DBTF-WS01-T001 |
| DBTF-WS01-T001-S03 | DBTF-WS01-T001 |
| DBTF-WS01-T002-S01 | DBTF-WS01-T002 |
| DBTF-WS01-T002-S02 | DBTF-WS01-T002 |
| DBTF-WS01-T003-S01 | DBTF-WS01-T003 |
| DBTF-WS01-T003-S02 | DBTF-WS01-T003 |

## 5. Target Routes / Components / Data Surfaces

`/documents`, `/client/family-members`, `/client/profile`, `/entities`, `/entities/demo`, `/governance/audit-history`, `/admin/tenants`, `/export/:id/scope`.

## 6. Target Files / Areas to Verify Before Editing

```text
components/client-intake-screen.tsx
components/admin-tenant-setup-screen.tsx
components/communication-export-ops-screen.tsx
app/api/documents/**
lib/document-upload-service.ts
lib/**
prisma/schema.prisma
prisma/seed.ts
tests/**
```

## 7. Implementation Instructions

* Documents: stop uncontrolled merge of persisted rows and demo rows, or clearly separate/label demo rows.
* Family/profile: verify FamilyMember/UserProfile fields and seed; add query service/API or route-level loader only if compatible with existing architecture.
* Entities: verify Entity/Asset/EntityParticipant seed and implement focused entity query path.
* Audit history: query AuditEvent rows instead of demo arrays if target table remains product-facing.
* Admin/template/export surfaces: DB-back only if model/service exists and focus plan authorizes it; otherwise static/reference/defer.

## 8. Non-Goals

No broad admin platform rebuild. No full export system. No blind API creation.

## 9. Dependencies

P00 and relevant P01 cleanup should be complete.

## 10. Required Positive Acceptance

Rows displayed in focused tables come from DB/API/service/seed or are clearly static/reference.

## 11. Required Negative Acceptance

Wrong tenant/role cannot see hidden rows. Hardcoded dynamic product rows do not appear as product data.

## 12. Required Tests / Validation Commands

Typecheck/lint. Add/update tests for DB-backed rows where implementation changes occur.

## 13. Required Proof Package

Data source proof, changed files, seed/API/service evidence, test output.

## 14. Stop Rules

Do not create new architecture if an equivalent service/API cannot be found; report `BLOCKED_TARGET_NOT_FOUND`.

## 15. Reporting Requirements

List every table/list converted, deferred, static-labelled or left blocked.

## 16. Completion Criteria

Focused high-priority tables no longer rely on unlabeled hardcoded dynamic arrays.

---

# 15. CODEX PHASE PROMPT — DBTF-P03 — Real Search / Filter / Sort / Pagination

## 1. Mission

Implement visible search/filter/sort/pagination against real DB-backed rows, or hide/static/defer controls.

## 2. Binding Sources

Rebase Plan WS-02.

## 3. Authorized Workstream / Task IDs

| Task ID | Task |
|---|---|
| DBTF-WS02-T001 | Decide global search |
| DBTF-WS02-T002 | Implement document saved view filters and sort |
| DBTF-WS02-T003 | Implement entity filters and sort |
| DBTF-WS02-T004 | Upgrade reusable table/filter primitives |

## 4. Authorized Subtask IDs

| Subtask ID | Parent |
|---|---|
| DBTF-WS02-T004-S01 | DBTF-WS02-T004 |

## 5. Target Routes / Components / Data Surfaces

Topbar search, `/documents` saved views, `/entities` filters, `DataTable`, `FilterBar`.

## 6. Target Files / Areas to Verify Before Editing

```text
components/ui/data-table.tsx
components/ui/filter-bar.tsx
components/client-intake-screen.tsx
app/api/documents/**
lib/document-upload-service.ts
lib/**
tests/**
```

## 7. Implementation Instructions

* Implement sort/filter/search only for configured fields backed by actual data.
* `DataTable` must not imply all headers are sortable by default.
* `FilterBar` must support controlled values/callbacks where used.
* Document saved views must change actual document rows.
* Entity filters must change actual entity rows.
* Global search should be hidden/static unless real scoped search is implemented within focus without broad architecture.

## 8. Non-Goals

No global platform-wide search unless scoped and authorized. No fake URL state.

## 9. Dependencies

P02 DB-backed data source should exist for affected tables.

## 10. Required Positive Acceptance

Search/filter/sort changes actual DB-backed result rows.

## 11. Required Negative Acceptance

Invalid filters do not leak data; unauthorized rows remain hidden; unconfigured columns are not fake-sortable.

## 12. Required Tests / Validation Commands

Focused UI/API tests for document and entity filters/sort. Component tests where appropriate.

## 13. Required Proof Package

Test output demonstrating row order/result changes.

## 14. Stop Rules

If rows are not DB-backed yet, stop and return to P02.

## 15. Reporting Requirements

Report each table with active search/filter/sort or explicit static/hide decision.

## 16. Completion Criteria

No visible focused search/filter/sort control remains fake unless intentionally static/hidden/deferred.

---

# 16. CODEX PHASE PROMPT — DBTF-P04 — Row Actions and RBAC Row Filtering

## 1. Mission

Ensure row actions and row visibility respect permission, object scope and state.

## 2. Binding Sources

Rebase Plan WS-03.

## 3. Authorized Workstream / Task IDs

| Task ID | Task |
|---|---|
| DBTF-WS03-T001 | Row action permission discipline |

## 4. Authorized Subtask IDs

No explicit subtask in seed matrix; derive subtasks only inside this task.

## 5. Target Routes / Components / Data Surfaces

Focused active tables with row actions: documents, entities, family members, audit, admin tenant/user tables if in scope.

## 6. Target Files / Areas to Verify Before Editing

```text
components/client-intake-screen.tsx
components/admin-tenant-setup-screen.tsx
components/ui/data-table.tsx
lib/permission-engine.ts
lib/visibility-engine.ts
tests/**
```

## 7. Implementation Instructions

* Hide or disable unauthorized row actions.
* Ensure row action handlers verify role/object scope.
* Add denied feedback where user can see an unavailable action.
* Prevent mutation when permission fails.

## 8. Non-Goals

No broad RBAC redesign. No admin non-bypass architecture beyond focused row actions.

## 9. Dependencies

P02/P03 for DB-backed tables. Permission engine baseline from P00.

## 10. Required Positive Acceptance

Allowed actor sees and can use authorized row action.

## 11. Required Negative Acceptance

Denied actor cannot see/use action, no mutation occurs, sensitive rows hidden where required.

## 12. Required Tests / Validation Commands

Focused RBAC row-action tests.

## 13. Required Proof Package

Test output and file changes.

## 14. Stop Rules

If permission scope is unclear and not specified by existing contracts/rebase plan, stop and report.

## 15. Reporting Requirements

Report every focused row action changed or deferred.

## 16. Completion Criteria

No focused row action is clickable without permission/state handling.

---

# 17. CODEX PHASE PROMPT — DBTF-P05 — DB-backed Forms / Input Masks / Field Validation

## 1. Mission

Make focused visible forms DB-backed, validated, persistent and reloadable, or static/defer/hide them.

## 2. Binding Sources

Rebase Plan WS-04.

## 3. Authorized Workstream / Task IDs

| Task ID | Task |
|---|---|
| DBTF-WS04-T001 | DB-backed client profile form |
| DBTF-WS04-T002 | DB-backed family member edit form or static-label |
| DBTF-WS04-T003 | Role assignment table/form only if foundation requires; otherwise defer/static |
| DBTF-WS04-T004 | Harden document upload form |
| DBTF-WS04-T005 | Harden document extraction/evidence review form |

## 4. Authorized Subtask IDs

| Subtask ID | Parent |
|---|---|
| DBTF-WS04-T001-S01 | DBTF-WS04-T001 |
| DBTF-WS04-T001-S02 | DBTF-WS04-T001 |
| DBTF-WS04-T001-S03 | DBTF-WS04-T001 |
| DBTF-WS04-T003-S01 | DBTF-WS04-T003 |
| DBTF-WS04-T003-S02 | DBTF-WS04-T003 |

## 5. Target Routes / Components / Data Surfaces

`/client/profile`, `/client/family-members`, `/documents/upload`, `/documents/extraction-review`, selected admin/team forms only if authorized.

## 6. Target Files / Areas to Verify Before Editing

```text
components/client-intake-screen.tsx
components/admin-tenant-setup-screen.tsx
app/api/documents/**
lib/document-upload-service.ts
lib/evidence-review-service.ts
prisma/schema.prisma
tests/**
```

## 7. Implementation Instructions

* Profile fields: controlled state, validation, save/submit API/service or static decision.
* Family member edit: implement only if target model/API exists; otherwise static label.
* Upload/review: preserve existing DB/API flow; harden validation/error/retry/no-release messaging.
* Forms must reload persisted values after save where implemented.
* No visual-only editable form may remain unlabeled.

## 8. Non-Goals

No production auth rebuild. No broad admin user-management implementation unless task-authorized.

## 9. Dependencies

P00, P02 for DB data, P07 if seed missing.

## 10. Required Positive Acceptance

Implemented forms validate, save, persist and reload.

## 11. Required Negative Acceptance

Missing required fields fail; unauthorized edits denied; upload/review cannot imply release.

## 12. Required Tests / Validation Commands

Focused form persistence tests; existing document upload/review tests extended.

## 13. Required Proof Package

API/service/file changes + test output + reload proof.

## 14. Stop Rules

No new API architecture if existing patterns cannot be verified; report `TO_VERIFY`.

## 15. Reporting Requirements

Report each form as implemented/static/deferred/blocked.

## 16. Completion Criteria

No focused form appears editable without validation/save/persistence or explicit static/defer decision.

---

# 18. CODEX PHASE PROMPT — DBTF-P06 — Wizard Lifecycle / Save Draft / Submit / Reload

## 1. Mission

Turn focused visible wizards into real wizards or static/defer/hide them.

## 2. Binding Sources

Rebase Plan WS-05.

## 3. Authorized Workstream / Task IDs

| Task ID | Task |
|---|---|
| DBTF-WS05-T001 | Decide entity creation wizard |
| DBTF-WS05-T002 | Decide tenant/user/admin wizards |
| DBTF-WS05-T003 | Export wizard only for data surfaces if visible; otherwise static |

## 4. Authorized Subtask IDs

| Subtask ID | Parent |
|---|---|
| DBTF-WS05-T001-S01 | DBTF-WS05-T001 |
| DBTF-WS05-T001-S02 | DBTF-WS05-T001 |

## 5. Target Routes / Components / Data Surfaces

`/entities/new`, `/tenants/new`, `/tenants/*`, `/export/new`, `/export/:id/scope`.

## 6. Target Files / Areas to Verify Before Editing

```text
components/client-intake-screen.tsx
components/admin-tenant-setup-screen.tsx
components/communication-export-ops-screen.tsx
components/ui/wizard-stepper.tsx
prisma/schema.prisma
tests/**
```

## 7. Implementation Instructions

* Decide implement/static/defer per wizard using Rebase Plan and repo target availability.
* For implemented entity wizard: add step state, validation before next, save draft if visible, submit persistence and reload.
* For tenant/admin/export wizards: static/defer unless focused DB-backed path is authorized and target services exist.
* Wizard stepper alone is not wizard behaviour.

## 8. Non-Goals

No broad tenant creation workflow. No full export architecture. No new screens.

## 9. Dependencies

P05 forms. P07 seed if implemented.

## 10. Required Positive Acceptance

Implemented wizard persists progress/submit and reloads.

## 11. Required Negative Acceptance

Cannot continue/submit with missing required fields or unauthorized role.

## 12. Required Tests / Validation Commands

Wizard tests only where implementation is chosen.

## 13. Required Proof Package

Decision log plus implementation/test proof where applicable.

## 14. Stop Rules

If implementation requires new product decision, static/defer and report.

## 15. Reporting Requirements

Report each wizard decision and reason.

## 16. Completion Criteria

No visible wizard implies behaviour without real lifecycle or explicit static/defer label.

---

# 19. CODEX PHASE PROMPT — DBTF-P07 — Seed Data Coverage Expansion

## 1. Mission

Add deterministic seed data for focused table, filter, sort, form, wizard and metric states.

## 2. Binding Sources

Rebase Plan WS-06 and Seed Data Coverage Matrix.

## 3. Authorized Workstream / Task IDs

| Task ID | Task |
|---|---|
| DBTF-WS06-T001 | Extend deterministic seed for focus surfaces |

## 4. Authorized Subtask IDs

| Subtask ID | Parent |
|---|---|
| DBTF-WS06-T001-S01 | DBTF-WS06-T001 |

## 5. Target Routes / Components / Data Surfaces

Documents, family/profile, entities/assets, audit events, export metrics, dashboard metrics, action/review states where in focus.

## 6. Target Files / Areas to Verify Before Editing

```text
prisma/schema.prisma
prisma/seed.ts
scripts/**
tests/**
```

## 7. Implementation Instructions

* Add seed records only against existing schema unless explicit migration is authorized.
* Cover status, risk, sensitivity, document type, entity type, jurisdiction, ownership, evidence states, audit events and metric source states as needed.
* Keep seed deterministic.
* Ensure tenant/object scoping is represented for negative tests.

## 8. Non-Goals

No blind migration. No random/faker product data without deterministic state purpose.

## 9. Dependencies

May run before/after P02-P06 depending on discovered missing states.

## 10. Required Positive Acceptance

Seed reset creates stable rows for focused UI behaviours.

## 11. Required Negative Acceptance

Seed includes rows needed to prove RBAC/tenant filtering and hidden states.

## 12. Required Tests / Validation Commands

`pnpm db:seed`, `pnpm db:validate`, focused tests if present.

## 13. Required Proof Package

Seed diff, seed command output, test output.

## 14. Stop Rules

No migration unless explicitly authorized and necessary; otherwise report schema gap.

## 15. Reporting Requirements

List all seed areas added and why.

## 16. Completion Criteria

Focused tests have deterministic data basis.

---

# 20. CODEX PHASE PROMPT — DBTF-P08 — Chart / Gauge / Metric Data Derivation

## 1. Mission

Derive dynamic-looking metrics/charts/gauges from structured data or static/hide/remove them.

## 2. Binding Sources

Rebase Plan WS-07 and Chart/Gauge/Metric Matrix.

## 3. Authorized Workstream / Task IDs

| Task ID | Task |
|---|---|
| DBTF-WS07-T001 | Derive dashboard metrics from DB |
| DBTF-WS07-T002 | Derive export/redaction metrics or static-label |
| DBTF-WS07-T003 | Defer or static-label ops metrics/trends |

## 4. Authorized Subtask IDs

| Subtask ID | Parent |
|---|---|
| DBTF-WS07-T001-S01 | DBTF-WS07-T001 |

## 5. Target Routes / Components / Data Surfaces

`/portal`, `/mobile`, `/export/*`, `/ops/*`.

## 6. Target Files / Areas to Verify Before Editing

```text
components/client-intake-screen.tsx
components/communication-export-ops-screen.tsx
lib/**
prisma/seed.ts
tests/**
```

## 7. Implementation Instructions

* Dashboard metrics must derive from documents/evidence/decisions/actions seed/service data or become static.
* Export/redaction metrics must derive from ExportRequest/scope/redaction data if implemented; otherwise static/defer.
* Ops metrics should be P1/static unless in focused scope and data-backed.
* No decorative numbers as product metrics.

## 8. Non-Goals

No broad analytics platform. No free metric invention.

## 9. Dependencies

P07 seed and relevant DB-backed data sources.

## 10. Required Positive Acceptance

Metric values match seeded/service-derived data.

## 11. Required Negative Acceptance

Hidden/internal/unauthorized records are excluded from metrics.

## 12. Required Tests / Validation Commands

Unit/API/UI tests verifying metric values.

## 13. Required Proof Package

Selector/service code, seed proof, tests.

## 14. Stop Rules

If derivation cannot be grounded, static/hide/remove instead.

## 15. Reporting Requirements

Report every metric as data-derived/static/deferred/blocked.

## 16. Completion Criteria

No focused metric/gauge/chart remains dynamic-looking without data derivation or explicit static/defer decision.

---

# 21. CODEX PHASE PROMPT — DBTF-P09 — Focused Tests and Validation Closure

## 1. Mission

Add/update focused tests for DB-backed tables/forms/search/filter/sort/wizard/metrics.

## 2. Binding Sources

Rebase Plan WS-08 and test matrix.

## 3. Authorized Workstream / Task IDs

| Task ID | Task |
|---|---|
| DBTF-WS08-T001 | Focused P0 test suite for DB-backed tables/forms |

## 4. Authorized Subtask IDs

| Subtask ID | Parent |
|---|---|
| DBTF-WS08-T001-S01 | DBTF-WS08-T001 |
| DBTF-WS08-T001-S02 | DBTF-WS08-T001 |

## 5. Target Routes / Components / Data Surfaces

All implemented DBTF surfaces.

## 6. Target Files / Areas to Verify Before Editing

```text
tests/**
playwright.config.ts
package.json
```

## 7. Implementation Instructions

Add or update tests for:

* Search returns DB-backed matching rows.
* Filter changes DB/API/service-backed result set.
* Sort order changes actual result rows.
* Pagination does not leak unauthorized rows.
* Row actions respect RBAC and state.
* Empty/loading/error states render.
* Form required fields validate.
* Form submit persists.
* Reload shows persisted values.
* Wizard next/back/save does not skip validation.
* Charts/gauges/metrics match seeded data.
* Hardcoded dynamic data removed/static-labelled/converted.

## 8. Non-Goals

No broad AlphaVest P0 rewrite outside focus.

## 9. Dependencies

P02-P08 as applicable.

## 10. Required Positive Acceptance

Focused tests pass for implemented behaviours.

## 11. Required Negative Acceptance

Fail-closed cases pass: unauthorized rows/actions hidden/denied; invalid forms blocked; fake metrics absent.

## 12. Required Tests / Validation Commands

Use discovered package commands. Add focused command only if project conventions support it.

## 13. Required Proof Package

Test files, commands, results.

## 14. Stop Rules

Do not mark phase complete with tests skipped unless blocker is reported.

## 15. Reporting Requirements

Report each test and covered task.

## 16. Completion Criteria

Focused DBTF implementation has positive and negative test coverage.

---

# 22. CODEX PHASE PROMPT — DBTF-P10 — Proof Package / Regression / Rebase Summary

## 1. Mission

Consolidate final proof and regression summary. No new implementation.

## 2. Binding Sources

All previous DBTF phases.

## 3. Authorized Workstream / Task IDs

All completed DBTF workstreams for proof only.

## 4. Authorized Subtask IDs

Proof/reporting only.

## 5. Target Routes / Components / Data Surfaces

All changed focused surfaces.

## 6. Target Files / Areas to Verify Before Editing

No editing unless report files are explicitly created by project convention.

## 7. Implementation Instructions

* Gather changed files list.
* Gather tests run and results.
* Summarize DB/seed/API/service changes.
* Summarize UI surfaces now DB-backed/static/deferred.
* Summarize remaining blockers.
* Confirm no screen generation, no broad scope, no main branch usage.
* Recommend next release step.

## 8. Non-Goals

No new product work.

## 9. Dependencies

P09 complete or blockers reported.

## 10. Required Positive Acceptance

Proof package traces every completed task to tests/proof.

## 11. Required Negative Acceptance

Unfinished or blocked items not claimed done.

## 12. Required Tests / Validation Commands

Run final reasonable command set from package.json if available: typecheck, lint, build, db validate, focused tests, route smoke.

## 13. Required Proof Package

Final report.

## 14. Stop Rules

Do not implement new work.

## 15. Reporting Requirements

Final report in the required report template.

## 16. Completion Criteria

Prompt pack execution can be evaluated phase-by-phase.

---

# 23. Final QA / Regression Prompt

```text
# CODEX FINAL QA PROMPT — DBTF Focus

Mission:
Verify that the focused DB-backed Tables/Forms implementation is complete and did not widen scope.

Check:
1. Every completed DBTF task has a test/proof.
2. Search/filter/sort operate on real DB/API/service/seed rows.
3. Forms validate, save, persist and reload or are static/deferred.
4. Metrics/charts/gauges are data-derived or static/deferred.
5. Hardcoded dynamic product records are removed, DB-backed or explicitly static/reference.
6. No P1/Hold/Reference/broad advice/compliance/export scope was pulled into MVP.
7. No screen/image/state-screen generation happened.
8. No blind API/schema/migration happened.
9. package.json commands were used, not invented.
10. Stop-rule violations are reported.

Output:
- PASS/FAIL by task.
- Files changed.
- Tests run.
- Remaining blockers.
- Recommendation for next release.
```

---

## 24. Do-Not-Implement Register for Codex

| Item | Reason | Forbidden Codex Action | Allowed Treatment | Reopen Condition |
|---|---|---|---|---|
| Full Advice Engine | Out of DBTF focus | Do not implement | None | Separate approved scope |
| Full Compliance Architecture | Too broad | Do not implement | Only table/form touchpoints if listed | Separate approved scope |
| Full Export Architecture | Too broad | Do not implement | Only DBTF data/metric touchpoints | Separate approved scope |
| New Screens | Not authorized | Do not create | Existing screens only | Separate visual/screen brief |
| Screen/image/state-screen generation | Explicitly blocked | Do not generate | N/A | Separate approved generation brief |
| Production auth rebuild | Out of focus | Do not rebuild | Use existing role/session context | Separate auth scope |
| Blind API creation | Risk of architecture drift | Do not create | Use existing patterns or block | Explicit phase authorization |
| Blind Prisma migration | Risk of schema drift | Do not migrate | Use existing schema or block | Explicit phase authorization |
| Patch schema replacement | Forbidden | Do not replace | Map to existing schema | Separate schema decision |
| P1/Hold/Reference promotion | Scope risk | Do not implement as MVP | Static/defer/hold | Explicit scope unlock |
| `main` branch work | False-gap source only | Do not use as target | None | Never, unless user changes target |
| Unlisted table/form/chart work | Not authorized | Do not implement | Report | Add to Rebase Plan |

---

## 25. Phase Reporting Template

```text
# DBTF Phase Report

Phase ID:
Phase name:

Completed Workstream IDs:
Completed Task IDs:
Completed Subtask IDs:

Files changed:
Files inspected only:
DB/Seed changes:
API/Service changes:

Tests run:
- command:
- result:

Proofs produced:
Positive acceptance results:
Negative acceptance results:

Stop rules triggered:
Deviations:
Blockers:
Remaining TODOs:
Next recommended phase:
```

---

## 26. Blocker / Stop Rule Reporting Template

```text
# DBTF Blocker Report

Phase ID:
Task/Subtask:
Stop rule triggered:
Target area:
What was expected:
What was found:
Why blocked:
Recommended resolution:
Can continue with other tasks? yes/no:
```

---

## 27. Acceptance Criteria for This Prompt Pack

| Criterion | Status |
|---|---|
| Uses `ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md` as highest source | PASS |
| Stays focused on DB-backed Tables/Search/Filter/Sort + Forms/Wizards + Seed/Metrics | PASS |
| Provides DBTF-P00 to DBTF-P10 phase prompts | PASS |
| Includes global Codex rules and focus boundaries | PASS |
| Includes verify-before-edit instruction | PASS |
| Includes package.json command discovery | PASS |
| Includes Do-Not-Implement Register | PASS |
| Includes reporting templates | PASS |
| Does not execute Codex in this artefact | PASS |
| Blocks screen/image/state-screen generation | PASS |
| Blocks blind API/schema/migration work | PASS |
| Includes ENGINE_v2/v3 Proof | PASS |

---

## 28. ENGINE_v2/v3 Proof

### Phase 1 — Charter Proof

| Element | Proof |
|---|---|
| Auftrag | Create Codex Prompt Pack for focused DB-backed Tables/Forms rebase. |
| Scope | Prompt Pack only; no implementation. |
| Output | `ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md`. |

### Phase 2 — Evidence Proof

| Evidence | Use |
|---|---|
| Rebase Plan | Highest source for workstreams/tasks/subtasks. |
| Current repo | Must be verified by Codex before edit. |
| DataTable/FilterBar limitations | P03 and P02 focus. |
| Forms/wizards visual-only risk | P05/P06 focus. |
| Seed/metrics gaps | P07/P08 focus. |

### Phase 3 — Framing Proof

| Framing | Decision |
|---|---|
| Focus only essentials | DBTF scope boundary. |
| Phase-based execution | Avoids one huge unsafe prompt. |
| Verify-before-edit | Prevents invented architecture. |

### Phase 4 — Divergence Proof

| Option | Decision |
|---|---|
| Broad SCF prompt pack | Rejected. |
| One-shot DBTF prompt | Rejected. |
| Phased DBTF prompt pack | Accepted. |

### Phase 5 — Contradiction Proof

| Contradiction | Resolution |
|---|---|
| DB-backed goal vs no blind schema | Use existing schema/seed; block migration unless explicit. |
| Charts from data vs no analytics invention | Derive from seed/service or static/hide. |
| Forms dynamic vs visual-only | Implement or static/defer/hide. |

### Phase 6 — Branch Build Proof

| Branch | Status |
|---|---|
| DBTF-P00 to DBTF-P10 | Accepted. |
| Broad release prompt | Rejected. |
| Direct code execution | Rejected. |

### Phase 7 — Convergence Proof

| Decision | Result |
|---|---|
| Prompt pack phases | 11 phase prompts plus QA. |
| Highest source | Focused Rebase Plan. |
| Final label | Accepted for focused phased Codex execution. |

### Phase 8 — Adversarial Proof

| Risk | Guardrail |
|---|---|
| Scope creep | Do-not-implement register. |
| Fake data remains | P01/P02. |
| Fake sort/filter | P03. |
| Fake forms/wizards | P05/P06. |
| Missing seed | P07. |
| Decorative charts | P08. |
| Missing tests | P09. |

### Phase 9 — QA Proof

| QA | Status |
|---|---|
| Required sections present | PASS |
| Phase prompts present | PASS |
| Reporting templates present | PASS |
| Stop rules present | PASS |

### Phase 10 — Learning Proof

This Prompt Pack is now suitable for later phased Codex execution. The safest execution order is DBTF-P00 through DBTF-P10, with a stop-and-report after every phase.

---

## 29. Final Decision Label

```text
DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK_ACCEPTED_FOR_FOCUSED_PHASED_CODEX_EXECUTION
```
