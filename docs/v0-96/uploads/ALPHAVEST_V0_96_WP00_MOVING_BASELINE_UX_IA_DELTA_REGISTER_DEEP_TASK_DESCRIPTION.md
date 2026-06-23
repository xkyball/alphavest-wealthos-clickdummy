# ALPHAVEST_V0_96_WP00_MOVING_BASELINE_UX_IA_DELTA_REGISTER_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Mode:** Prompt 01 execution. Deep Codex-ready task description only.  
**Work Package:** `WP-00 — Moving Baseline + UX/IA Delta Register`  
**Release Target:** `V0.96 Core Journey Release + UX/IA Refactor`  
**Implementation status:** Not implemented here.  
**Screen/image generation:** Not authorized.  

---

## 1. Executive Task Decision

**Decision:** `WP00_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_CODEX_PRE_IMPLEMENTATION_REBASE`

`WP-00` is the mandatory first work package before any V0.96 implementation begins. It is a **read-only moving-baseline, source-of-truth and UX/IA delta register task**. Its job is to force Codex to inspect the current `full-workflow` repository reality, reconcile it against the AlphaVest Knowledge Base, and produce a current implementation baseline before changing code.

The current AlphaVest artefact set contains older snapshot facts, newer V0.96 task assumptions and UX/IA evidence. The current local `full-workflow` ZIP snapshot has already moved beyond older KB counts: it contains **815 files**, **15 API route files**, **51 Playwright/spec files**, **51 component files** and **73 lib TypeScript modules**. These current-snapshot numbers are useful, but Codex must still re-check the actual working repo or branch before implementation.

**Codex result expected from this WP:**

```text
V0_96_UX_IA_DELTA_REGISTER.md
```

This register must classify every downstream V0.96 WP as:

```text
ALREADY_PRESENT | PARTIAL | MISSING | CONFLICTING | BLOCKED | REQUIRES_DECISION
```

No downstream WP may be implemented until `WP-00` has completed this rebase and produced a current target-file, route, component, API, service, schema and test map.

---

## 2. Source-of-Truth Lock

| Rank | Source / Artefact | Role in WP-00 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current live `full-workflow` repo checkout, if available | Highest implementation reality | File/route/API/component/schema/test truth | Assuming older MD counts are current code truth |
| 2 | Current `alphavest-wealthos-clickdummy-full-workflow.zip` snapshot | Snapshot code reality if no live repo | Current inventory check and contradiction detection | Claiming it is newer than a live repo without inspection |
| 3 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | Prompt 00 evidence register and WP index | UI/UX/IA problem families and WP mapping | Treating KB evidence as implementation proof |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary V0.96 WP source | WP list, V0.96 scope, UX/IA intent | Treating task intent as code truth |
| 5 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` and `FINAL_CODEX_TASK_MASTER.md` | Implementation authorization boundaries | Stop rules, allowed implementation envelope | Expanding Codex authority beyond locked scope |
| 6 | `MVP_SCOPE_LOCK.md`, `ROUTE_SCOPE_LOCK.md`, `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md`, `STATE_SCREEN_SPEC.md` | Scope/route/state controls | MVP/P1/HOLD/reference route decisions | Reclassifying P1/HOLD/reference routes |
| 7 | `DRAWER_MODAL_INTERACTION_CONTRACT.md`, `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Interaction and feedback controls | Lifecycle, state and no-overclaim requirements | Treating visual overlays, chips or buttons as behaviour proof |
| 8 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md`, `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | P0 safety controls | No unapproved advice, no AI Draft leakage, fail-closed visibility, upload-not-sufficiency, audit/export safety | Weakening safety for UX convenience |
| 9 | `API_CONTRACT_MATRIX.md`, `SCHEMA_FIELD_LEVEL_RECONCILIATION.md`, `P0_TEST_ACCEPTANCE_MATRIX.md` | API/schema/test controls | Existing API/schema/test mapping and missing proof obligations | Claiming route/API/schema/test presence proves V0.96 readiness |
| 10 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md`, `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey controls | MJ-001, MJ-002, MJ-003, MJ-005, MJ-006, MJ-010 as V0.96 path | Pulling P1/HOLD journeys into V0.96 |
| 11 | UX/IA/True-UX artefacts in repo/snapshot if present | UX direction | Journey-first IA, density, page types, CTA hierarchy, long/sparse page decisions | Treating screenshot/audit findings as direct code facts without repo check |
| 12 | `main` branch / old main ZIP | False-gap warning only | Historical contamination detection | Any target task, absence claim or route decision |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-00 Implication |
|---|---|---|---|---|---|
| The app must stop behaving like a route catalogue and become a guided operating system. | Prompt 00 evidence register; V0.96 UX/IA task source | WP-01; app shell, sidebar, topbar, page header | IA / navigation | High | WP-00 must audit current nav model and detect whether journey-first IA already exists or is partial. |
| Long/complex pages were identified across actions, signals, admin platform, compliance review/audit, workbench, advisor detail, portal, documents and export pages. | Prompt 00 evidence register; V0.96 source | WP-02 through WP-10 | Layout / scroll depth | High | WP-00 must list touched long pages and map current component ownership before downstream layout refactors. |
| Sparse pages should gain meaningful density, not filler. | Prompt 00 evidence register; layout/density evidence | WP-02, WP-07, WP-16 | Layout / density | Medium | WP-00 must detect current empty/low-value surfaces and classify whether existing UX helpers solve them. |
| Many screens have too many action candidates and weak primary-action hierarchy. | Prompt 00 evidence register | WP-01, WP-11, WP-12 and surface WPs | CTA hierarchy | High | WP-00 must inventory CTAs on V0.96 routes and identify where one-primary-CTA policy is not satisfied. |
| Upload interaction exists but upload success is not evidence sufficiency. | Interaction Reality Audit; Evidence/Audit/Export Contract | WP-03, WP-12, WP-13, WP-15 | Evidence / no-overclaim | Critical | WP-00 must verify current upload UI/API/tests and classify upload sufficiency handling as present/partial/missing. |
| Advisor Approval may be confused with Compliance Release if layout/copy is weak. | Feedback contract; RBAC/advice boundary contract | WP-05, WP-06, WP-12 | Gate semantics | Critical | WP-00 must inspect advisor/compliance route copy and states before downstream implementation. |
| Client-facing projection must fail closed and never show internal payload. | RBAC/Client Visibility contract; Journey requirements | WP-07, WP-12, WP-15 | Client visibility | Critical | WP-00 must verify current portal/mobile payload/state sources and existing tests. |
| Audit display is not audit persistence. | Evidence/Audit/Export Contract; Interaction audit | WP-08, WP-15 | Audit proof | Critical | WP-00 must separate audit UI rows from persisted `AuditEvent` usage and tests. |
| Export preview, approval and download/share are separate stages. | Evidence/Audit/Export Contract; Feedback contract | WP-10, WP-12, WP-15 | Export semantics | Critical | WP-00 must map current export routes, services and tests before export UX tasks. |
| Modal/drawer/table/filter/kanban primitives can be visual-only. | Interaction Reality Audit; Drawer/Modal Contract | WP-11 and surface WPs | Interaction lifecycle | High | WP-00 must classify shared primitives as implemented/partial/visual-only against code and tests. |
| Existing tests are proof slices, not full V0.96 proof. | P0 Test Acceptance Matrix and current snapshot | WP-15 | P0 proof | Critical | WP-00 must list current tests and map which V0.96 claims they actually prove. |
| P1/HOLD routes must not be promoted because visual refs or route entries exist. | Route Scope Lock; Screen Generation Brief | All WPs | Scope control | Critical | WP-00 must preserve P1/HOLD/reference boundaries and mark any conflict. |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must re-check the live repo or working checkout. If only a ZIP snapshot is available, it must label results as `SNAPSHOT_EVIDENCE_ONLY`.

### 4.1 Current snapshot baseline to verify

| Area | Current local snapshot observation | WP-00 Required Recheck |
|---|---:|---|
| Files | 815 files | Confirm current checkout file count and changed files. |
| API routes | 15 API route files | List exact API routes and map to V0.96 WPs. |
| Tests | 51 Playwright/spec files | List exact test scripts and map to P0/True-UX coverage. |
| Components | 51 component TS/TSX files | Map screen components and shared UI primitives. |
| `lib` modules | 73 TypeScript modules | Map services, policy, visibility, UX helpers, workflow gates. |
| Routes | Route registry must be parsed; older baseline had 71 registered routes | Confirm count, V0.96 route IDs and scope labels in current `route-registry.ts`. |
| Schema | `prisma/schema.prisma` must be parsed | Confirm fields/models relevant to evidence, approval, release, visibility, audit and export. |

### 4.2 API files observed in current local snapshot

Codex must verify these in the live repo:

```text
app/api/admin-tenants/route.ts
app/api/audit-events/route.ts
app/api/auth/dummy/route.ts
app/api/dashboard-metrics/route.ts
app/api/demo-workflow/route.ts
app/api/documents/review/route.ts
app/api/documents/route.ts
app/api/documents/upload/route.ts
app/api/entities/route.ts
app/api/export-workflow/route.ts
app/api/family-members/route.ts
app/api/global-search/route.ts
app/api/ops-sla/route.ts
app/api/profile/route.ts
app/api/review-monitoring/route.ts
```

### 4.3 Test proof files observed in current local snapshot

Codex must verify current scripts and exact assertions, especially:

```text
tests/source-reality-gate.spec.ts
tests/route-smoke.spec.ts
tests/dummy-auth-provider.spec.ts
tests/providerless-scope.spec.ts
tests/control-layer-actor-scope.spec.ts
tests/client-visibility-projection.spec.ts
tests/client-visibility-proof.spec.ts
tests/document-upload-api.spec.ts
tests/document-upload-flow.spec.ts
tests/evidence-review-api.spec.ts
tests/workflow-gate.spec.ts
tests/demo-workflow-api.spec.ts
tests/permission-engine.spec.ts
tests/governance-non-bypass.spec.ts
tests/audit-fail-closed.spec.ts
tests/export-safety.spec.ts
tests/file-export-realism.spec.ts
tests/fail-closed-error-envelope.spec.ts
tests/confirmation-lifecycle.spec.ts
tests/true-ux-flow-navigation.spec.ts
tests/ui-clickflow-phase01-05.spec.ts
```

### 4.4 Components and modules to inventory

| Family | Files / Globs to Inspect | Purpose |
|---|---|---|
| App shell / IA | `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`, `components/route-context-chip.tsx`, `components/product-guidance-panel.tsx`, `lib/navigation.ts`, `lib/route-registry.ts`, `lib/ux-route-policy.ts`, `lib/ux-page-contract.ts` | Detect route-catalog vs journey-first IA and page-job support. |
| UX helpers | `components/ux-hub-page.tsx`, `components/ux-cta-cluster.tsx`, `lib/ux-density.ts`, `lib/ux-content-hierarchy.ts`, `components/a11y-status.tsx` | Reuse before creating new components. |
| Evidence/client | `components/client-intake-screen.tsx`, evidence/document-related services and APIs | Upload, documents, evidence review, client projection surfaces. |
| Internal workflow | `components/internal-workflow-screen.tsx`, workflow services | Analyst, advisor and compliance routes. |
| Decisions/governance | `components/decisions-governance-screen.tsx`, permission/audit services | Decision record, governance, audit and role safety. |
| Export/ops | `components/communication-export-ops-screen.tsx`, export services/APIs | Scope, redaction, approval, download/share and manifest proof. |
| Shared primitives | `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/ui/data-table.tsx`, `components/ui/filter-bar.tsx`, `components/ui/kanban.tsx`, `components/ui/state-panel.tsx`, `components/ui/evidence-list.tsx`, `components/ui/audit-timeline.tsx`, `components/ui/status-chip.tsx` | Classify implemented lifecycle vs visual-only support. |

---

## 5. WP Problem Statement

The project has a strong Knowledge Base, multiple handoff layers and a moving `full-workflow` codebase. Older artefacts described **405 files, 4 APIs and 10 specs**, while the current local snapshot shows **815 files, 15 APIs and 51 specs**. If Codex implements downstream work without a moving-baseline rebase, it can:

- rebuild things that already exist;
- implement old false gaps;
- miss newer services/APIs/tests;
- treat visual/UI presence as behaviour proof;
- weaken scope gates by accidentally elevating P1/HOLD routes;
- refactor UI from generic UX assumptions instead of KB-supported V0.96 problem families;
- introduce broad redesign or visual generation despite explicit stop rules.

`WP-00` exists to prevent this. It must produce a read-only current-state register that every subsequent WP can use.

---

## 6. V0.96 Journey Role

`WP-00` is not a feature journey. It is the **control gate** for all V0.96 journeys:

| Journey / Scope | WP-00 Role |
|---|---|
| `MJ-001` New Family Office onboarding to first client-safe decision | Verify current user/tenant/role/session, route and state foundation before downstream tasks. |
| `MJ-002` Evidence missing to upload to release | Verify current document/evidence APIs, services, UI states and tests. |
| `MJ-003` AI draft rejected/rebuilt with evidence | Verify current analyst/workbench/AI-draft/internal-only state support. |
| `MJ-010` Admin role change cannot bypass compliance release | Verify governance, RBAC, admin UI, access request and permission tests. |
| `MJ-006` Cross-tenant access denied with audit proof | Verify tenant/object scope checks and negative tests. |
| `MJ-005` Export package with forbidden internal payload redaction | Verify export routes, services, manifest/redaction tests and UI stages. |
| UX/IA refactor spine | Verify navigation, page types, density, CTA, state and microcopy evidence before any UI changes. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | Current Evidence | WP-00 Rebase Action | Downstream WP(s) |
|---|---|---|---|
| Route catalogue navigation | KB says app must become journey-first and role-aware. | Inventory navigation structure, route groups and visible sidebar/topbar links. Classify current state. | WP-01 |
| Weak page jobs / page headers | KB requires page job, gate/blocker and next step. | Inspect page header component and current page contracts. | WP-01, WP-12 |
| Long pages / excessive scroll | KB lists long/complex route candidates. | Capture route/component ownership and mark touched long pages for refactor. | WP-02 to WP-10 |
| Empty / sparse pages | KB requires meaningful density, not filler. | Identify sparse V0.96 surfaces and whether data-backed modules exist. | WP-02, WP-07 |
| Too many CTAs | KB requires one primary CTA per state. | Inventory action clusters/buttons on V0.96 routes and classify primary/secondary ambiguity. | WP-01, WP-11, WP-12 |
| Visual-only interactions | Interaction audit warns drawers/modals/tables/kanban can be static. | Classify primitives and route usage as implemented/partial/visual-only. | WP-11 |
| No-overclaim copy | Feedback contract forbids success claims that imply later gates. | Search current UI copy for upload/advisor/compliance/export overclaims. | WP-12 |
| Client-safe visibility | Client UI must fail closed. | Inspect portal/mobile projection source and leakage tests. | WP-07, WP-15 |
| Audit display vs persistence | Audit UI is not audit proof. | Map audit UI to persisted `AuditEvent` source and tests. | WP-08, WP-15 |
| Export stage confusion | Preview, approval and download/share are distinct. | Map export UI/service stages and test coverage. | WP-10, WP-15 |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 WP-00 changes now

WP-00 itself is read-only except for producing documentation/report artefacts. It may create:

```text
V0_96_UX_IA_DELTA_REGISTER.md
V0_96_SOURCE_REALITY_REBASE.md
V0_96_ROUTE_SURFACE_MAP.md
V0_96_API_SERVICE_TEST_INVENTORY.md
```

The exact filenames may follow existing repo documentation conventions, but the content must include the required classifications.

### 8.2 WP-00 does not change now

WP-00 must not:

- edit application code;
- refactor UI;
- change navigation;
- update schema;
- add tests;
- create routes;
- generate screens/images;
- change visual assets;
- modify API behaviour;
- reclassify scope;
- elevate P1/HOLD routes.

### 8.3 Refactor-later decisions that WP-00 must prepare

| Refactor Area | WP-00 Output Required | Later WP |
|---|---|---|
| Journey-first IA | Current nav/app-shell delta and affected files. | WP-01 |
| Page type/density | Current long/sparse page list and helper inventory. | WP-02 |
| Evidence workbench | Current evidence UI/API/test state. | WP-03 |
| Analyst/advisor/compliance flows | Current route/component/API/state reality. | WP-04 to WP-06 |
| Client-safe projection | Current client payload state and tests. | WP-07 |
| Audit/export/governance | Current services/UI/test reality. | WP-08 to WP-10 |
| Shared primitives | Current modal/drawer/table/form lifecycle status. | WP-11 |
| Microcopy | Current overclaim terms and affected files. | WP-12 |
| API/schema/test support | Current proof gap map. | WP-13 to WP-15 |

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP00-T01 | Confirm repo/branch/baseline | Prevent implementing against wrong branch or stale ZIP. | `git status`, `git branch`, `AGENTS.md`, root files | Record branch, commit, dirty state, package manager, scripts and repo root. Mark ZIP-only execution as snapshot. | Baseline report includes branch/commit/status and execution mode. | None required; read-only. | Audit only. | Stop if repo is not `full-workflow` or target is unclear. |
| WP00-T02 | Inventory route registry and route worksets | Prevent scope drift and P1/HOLD elevation. | `lib/route-registry.ts`, `app/[...segments]/page.tsx`, `ROUTE_SCOPE_LOCK.md` | Parse route IDs, paths, groups, components, visual refs and scope labels. Compare to locked MVP/P1/HOLD/reference sets. | Route surface map lists all current routes and V0.96 scope decisions. | `pnpm test:route-smoke` if scripts confirmed. | Audit nav/IA implications only. | Stop if route registry missing or route IDs cannot be reconciled. |
| WP00-T03 | Inventory app shell/navigation/page headers | Prepare WP-01 without guessing. | `components/app-shell.tsx`, `sidebar.tsx`, `top-bar.tsx`, `page-header.tsx`, `lib/navigation.ts`, UX route policy files | Map current nav groups, role filters, labels, page header props and context chips. Classify route-catalog vs journey-first readiness. | IA delta shows `ALREADY_PRESENT/PARTIAL/MISSING` for app shell, sidebar, topbar and page header. | Navigation/true-UX tests if available. | Yes, but audit only. | Do not edit navigation in WP-00. |
| WP00-T04 | Inventory page-type/density helpers | Prevent duplicate UX components. | `components/ux-*`, `lib/ux-*`, `product-guidance-panel`, `state-panel` | List existing UX helpers and their current usage by route/component. | Downstream WPs know which helpers to reuse. | Typecheck only if scripts confirmed. | Yes, audit only. | Do not create new helper components. |
| WP00-T05 | Identify long-page and sparse-page current owners | Anchor layout refactor in code reality. | V0.96 long-page route components and route registry | Map long/sparse route candidates to component files and current layout pattern. | Long/sparse page table exists with target owner and later WP mapping. | Optional true-UX/layout tests if present. | Yes, audit only. | Do not rewrite layouts in WP-00. |
| WP00-T06 | Inventory shared interaction primitives | Determine lifecycle vs visual-only. | `components/ui/modal.tsx`, `drawer.tsx`, `data-table.tsx`, `filter-bar.tsx`, `kanban.tsx`, `state-panel.tsx`, `evidence-list.tsx`, `audit-timeline.tsx`, `status-chip.tsx` | Inspect props, lifecycle support, a11y/focus, loading/error states and route usage. Classify each primitive. | Primitive register flags implemented/partial/static/visual-only. | `tests/confirmation-lifecycle.spec.ts`, a11y/true-UX tests if available. | Yes, audit only. | Do not modify primitives yet. |
| WP00-T07 | Inventory API/service baseline | Avoid old 4-API assumption and map UI truth sources. | `app/api/**/route.ts`, `lib/**/*service*.ts`, workflow/visibility/audit/export/evidence files | List current APIs, methods, payload families, errors, permissions, audit hooks and tests. Map to WPs. | API/service inventory supersedes stale API counts for current repo. | `pnpm test:source-reality`, API-specific tests if safe. | Indirect: service truth for UI. | Stop if current APIs contradict task assumptions in a way that affects scope. |
| WP00-T08 | Inventory schema support | Prevent blind schema replacement. | `prisma/schema.prisma`, migrations, seed files | Map models/fields for user/tenant/role, evidence, recommendation, approval, compliance, decision, visibility, audit and export. | Schema support map shows whether current schema can represent V0.96 states. | `pnpm db:validate`, typecheck if configured. | Indirect. | No migrations in WP-00. |
| WP00-T09 | Inventory existing tests and scripts | Avoid writing duplicate tests and overclaiming proof. | `package.json`, `tests/**/*.spec.ts`, Playwright config | List scripts and test files; map assertions to P0 gates and True-UX claims. | Test inventory distinguishes existing proof, partial proof and missing proof. | `pnpm test --list` if available; otherwise list files. | Yes, proof of UX/IA and safety. | Do not add/edit tests in WP-00. |
| WP00-T10 | Search current UI copy for overclaims | Prepare microcopy WP. | Components and route screens | Search for success/release/export/upload/advisor/approval/client-visible wording. Flag risky phrases. | Microcopy delta lists risky copy and target WP. | Static grep/read-only. | Yes, audit only. | Do not edit copy yet. |
| WP00-T11 | Map V0.96 WPs to exact files | Give Codex surgical targets. | V0.96 source, Prompt 00 register, current repo | Build WP-to-route-to-component-to-API-to-test matrix. | Every WP-01 to WP-16 has likely files/modules/tests and status classification. | None. | Yes, mapping only. | Stop if a WP lacks enough code reality to implement safely. |
| WP00-T12 | Produce final delta register | Create authoritative downstream input. | All above | Write `V0_96_UX_IA_DELTA_REGISTER.md` or equivalent with classifications and blockers. | Register is complete, cites current repo mode, and is usable by every next WP. | Run validation commands that are safe and available; record results. | Yes, audit only. | No implementation beyond docs/report output. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Route worksets to classify

| Workset | Route IDs | WP-00 Action |
|---|---|---|
| V0.96 MVP core | 027–030, 033–047, 048–051, 054–058, 019–020 | Map route to component, API/service, schema fields, states and tests. |
| V0.96 support | 001–018, 021–026, 031–032 where flow-relevant | Map only where needed for user/tenant/role/governance/client context. |
| P1 deferred | 052–053, 059–060, 068 | Preserve as deferred; detect if visible in nav and mark de-emphasis/guard need. |
| Reference-only | 061–063 | Preserve as reference/utility, not product proof. |
| HOLD | 064–067, 069–071 | Preserve blocked; no visual generation or route promotion. |

### 10.2 Component areas

| Area | Recheck Purpose |
|---|---|
| App shell / navigation / headers | Detect route-catalogue problem and page-job support. |
| Client intake screen | Documents, upload, portal/mobile and client-safe states. |
| Internal workflow screen | Analyst, advisor, compliance paths and gate copy. |
| Decisions/governance screen | Decision record, evidence, audit, governance, access requests. |
| Communication/export/ops screen | Export stage surfaces and P1 ops/comms boundaries. |
| Shared UI primitives | Lifecycle/a11y/state truth vs visual-only support. |

### 10.3 API/service areas

| Area | Recheck Purpose |
|---|---|
| Auth/providerless/session | Mapped user/tenant/role context. |
| Documents/evidence APIs | Upload, list, review, evidence sufficiency support. |
| Demo workflow / workflow gate | Analyst/advisor/compliance state transitions. |
| Visibility engine | Client-safe projection and redaction. |
| Permission engine | Route/action/object/payload separation. |
| Audit service / audit events API | Persisted audit proof. |
| Export workflow/service | Scope, redaction, approval, manifest and forbidden payload. |

### 10.4 Schema areas

| Domain | Models/Fields to Map |
|---|---|
| User/Tenant/RBAC | `User`, `ClientTenant`, `Role`, `Permission`, `UserRole`, `RolePermission`, `AccessRequest`, `SecondConfirmation` |
| Evidence/Documents | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `EvidenceRecord`, `EvidenceItem` |
| Advice/Workflow | `Trigger`, `ActionItem`, `Recommendation`, `RecommendationOption`, `Approval`, `ComplianceReview`, `Decision` |
| Visibility/Audit/Export | `AuditEvent`, visibility fields/statuses, `ExportRequest`, generated file/document links |

---

## 11. Interaction Lifecycle Requirements

`WP-00` must not implement interaction lifecycles, but it must classify whether the current repo already supports them.

| Interaction Family | What WP-00 Must Classify | Later WP |
|---|---|---|
| Modal / confirmation | Trigger, open, close, cancel, submit, loading, error, success, focus/escape, permission/audit hooks | WP-11 |
| Drawer | Trigger, scoped content, close/cancel, submit where relevant, focus/overlay behaviour | WP-11 and surface WPs |
| Table/filter/kanban | Loading, empty, error, permission, selection/action, sort/filter persistence if claimed | WP-02, WP-11 |
| Upload | File select/drop, validation, progress, failure, retry, upload-only success | WP-03 |
| Advisor approve/reject | Action preconditions, validation, comments, no release, audit | WP-05 |
| Compliance release/block/request evidence | Preconditions, confirmation, blocked state, audit/fail-closed | WP-06 |
| Export preview/approval/download | Stage progression and forbidden-payload checks | WP-10 |

---

## 12. State / Feedback / Microcopy Requirements

`WP-00` must produce a microcopy and state-risk inventory, not edit copy.

| Feedback Area | Risk Phrase / Risk Pattern | Required WP-00 Output |
|---|---|---|
| Upload | “Evidence complete”, “sufficient”, “ready for release” after upload | Flag as overclaim if present; route to WP-03/WP-12. |
| Advisor approval | “Released”, “client visible”, “sent to client” after advisor action | Flag as gate confusion; route to WP-05/WP-12. |
| Compliance release | “client accepted” or “advice executed” after release | Flag as downstream overclaim; route to WP-06/WP-12. |
| Client portal | Internal draft/rationale/compliance/audit wording visible to client | Flag as leakage risk; route to WP-07/WP-15. |
| Export | “Export ready” before approval/redaction/download separation | Flag as export overclaim; route to WP-10/WP-12. |
| Audit | UI timeline implies persisted proof without source/event ref | Flag as audit proof gap; route to WP-08/WP-15. |
| Admin | Admin wording implies superuser override | Flag as admin bypass UX risk; route to WP-09/WP-12. |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| P0 Safety Rule | WP-00 Rebase Obligation | Downstream Blocker If Not Mapped |
|---|---|---|
| No unapproved advice reaches client | Map all current client-facing payload sources and release gates. | WP-07 and WP-15 blocked. |
| AI Draft internal-only | Locate all AI/rules draft fields, UI copy and export/client projections. | WP-04, WP-07, WP-10 blocked. |
| Admin cannot bypass gates | Map admin/gov actions, permission checks and tests. | WP-09, WP-15 blocked. |
| Upload is not sufficiency | Map upload API/UI success and evidence review/link/sufficiency support. | WP-03, WP-06 blocked. |
| Advisor approval is not release | Map advisor state transitions and compliance preconditions. | WP-05, WP-06 blocked. |
| Client visibility fail closed | Map visibility engine/projection/client route behaviour. | WP-07 blocked. |
| Audit persistence required for gate actions | Map audit service/API/model/test support. | WP-08 blocked. |
| Export forbidden payload exclusion | Map export service/manifest/redaction tests. | WP-10 blocked. |
| Route access is not payload/action permission | Map route guards, permission engine, action guards, payload redaction. | WP-01, WP-13, WP-15 blocked. |

---

## 14. Positive Acceptance Criteria

`WP-00` is accepted when:

1. The current repo/checkout or snapshot mode is explicitly recorded.
2. Route registry, route groups, component owners and V0.96 route worksets are inventoried.
3. Current API routes and services are listed and mapped to WPs.
4. Current tests and scripts are listed and mapped to P0/True-UX gates.
5. Current UX helper components are listed with usage status.
6. Navigation, page header, page-type, density, CTA and microcopy deltas are documented.
7. Shared primitive lifecycle status is documented.
8. Every downstream WP-01 to WP-16 has a status classification and likely file/test targets.
9. Stale KB claims are marked stale instead of converted into tasks.
10. P1/HOLD/reference routes are preserved and not promoted.
11. The resulting delta register is detailed enough for downstream Codex tasks to proceed without guessing.

---

## 15. Negative Acceptance Criteria

`WP-00` fails if any of the following happen:

1. Any application code is modified.
2. Any schema migration is created.
3. Any UI/screen/image/visual asset is generated or replaced.
4. Any P1/HOLD/reference route is promoted into V0.96 scope.
5. `main` is used as target truth.
6. Older KB counts are accepted without current recheck.
7. API/schema/test presence is treated as readiness proof.
8. Visual components, status chips, buttons, drawers or modals are treated as behaviour proof.
9. Upload success is treated as evidence sufficiency.
10. Advisor approval is treated as compliance release.
11. Audit display is treated as audit persistence.
12. Export preview is treated as export approval/download.
13. The final register lacks exact downstream files/tests/routes for later WPs.

---

## 16. Required Tests and Test Names

`WP-00` is read-only. It may run tests only after confirming scripts, dependencies and safe execution conditions.

### 16.1 Preferred validation commands

```bash
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm test:source-reality
pnpm test:route-smoke
pnpm test:dummy-auth
pnpm test:providerless-scope
pnpm test:client-visibility
pnpm test:permissions
pnpm test:document-upload-api
pnpm test:document-upload-flow
pnpm test:workflow-gate
pnpm test:governance-non-bypass
pnpm test:export-safety
pnpm test:fail-closed-error-envelope
```

### 16.2 If running is not safe or dependencies are missing

Codex must still create a read-only inventory using:

```bash
find . -maxdepth 4 -type f
find app/api -name route.ts
find tests -name "*.spec.ts"
grep -R "Released\|advisor approved\|Evidence complete\|Export ready" components lib app tests || true
```

### 16.3 Test classification output required

| Test / Command | Run? | Result | What It Proves | What It Does Not Prove | Downstream WP Impact |
|---|---|---|---|---|---|
| `pnpm test:source-reality` | yes/no | pass/fail/not run | Source inventory baseline | V0.96 readiness | WP-00 register confidence |
| `pnpm test:route-smoke` | yes/no | pass/fail/not run | Route shell availability | Behaviour/safety | WP-01/WP-15 |
| `pnpm test:client-visibility` | yes/no | pass/fail/not run | Client projection slice | Full leakage proof | WP-07/WP-15 |
| `pnpm test:document-upload-api` | yes/no | pass/fail/not run | Upload API slice | Evidence sufficiency | WP-03/WP-15 |
| `pnpm test:permissions` | yes/no | pass/fail/not run | Permission slice | Full route/action/payload matrix | WP-09/WP-15 |
| `pnpm test:export-safety` | yes/no | pass/fail/not run | Export safety slice | Full UI stage proof | WP-10/WP-15 |

---

## 17. Validation Commands

Codex should validate scripts before running:

```bash
cat package.json
pnpm --version || true
node --version
```

Suggested read-only inventory commands:

```bash
git status --short
git branch --show-current
git rev-parse --short HEAD
find app -maxdepth 4 -type f | sort
find app/api -name route.ts | sort
find components -maxdepth 3 -type f | sort
find lib -maxdepth 3 -type f | sort
find tests -type f -name "*.spec.ts" | sort
find prisma -maxdepth 3 -type f | sort
```

Suggested focused searches:

```bash
grep -R "visualState\|status chip\|StatusChip\|WorkflowBadge" components lib app tests || true
grep -R "Advisor approved\|released to client\|Release to client\|waiting for compliance" components lib app tests || true
grep -R "upload successful\|Evidence complete\|Evidence sufficient\|requires review" components lib app tests || true
grep -R "AI Draft\|internal rationale\|clientVisible\|client-safe\|redacted" components lib app tests || true
grep -R "Export preview\|Export approved\|download\|redaction" components lib app tests || true
grep -R "AuditEvent\|audit event\|audit unavailable" components lib app tests prisma || true
```

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| `STOP_WRONG_REPO_OR_BRANCH` | Do not proceed if target repo/branch cannot be confirmed as `full-workflow` or equivalent current target. |
| `STOP_CODE_EDITS_IN_WP00` | No code edits in WP-00. |
| `STOP_SCHEMA_EDITS_IN_WP00` | No Prisma/schema/migration edits. |
| `STOP_VISUAL_GENERATION` | No screens, state-screens, images or visual assets. |
| `STOP_MAIN_TARGET_USE` | No `main`-based target tasks or absence claims. |
| `STOP_SCOPE_ELEVATION` | No P1/HOLD/reference route promotion. |
| `STOP_VISUAL_PROOF_OVERCLAIM` | Do not treat PNGs, chips, buttons, drawers, modals or route presence as behaviour proof. |
| `STOP_API_SCHEMA_TEST_OVERCLAIM` | Do not treat API/schema/test presence as readiness proof. |
| `STOP_UPLOAD_TO_RELEASE` | Upload success is not evidence sufficiency or release. |
| `STOP_ADVISOR_EQUALS_RELEASE` | Advisor approval is not compliance release. |
| `STOP_ADMIN_BYPASS` | Admin cannot bypass advice/compliance/evidence/audit/export gates. |
| `STOP_CLIENT_INTERNAL_LEAKAGE` | Client projection cannot include AI Draft/internal rationale/analyst notes/compliance notes/unreleased evidence. |

---

## 19. Open Questions / Blockers

WP-00 must explicitly answer or record these:

| Question | Required WP-00 Handling |
|---|---|
| Is there a live repo checkout, or only ZIP snapshot? | Record execution mode and trust level. |
| What is the current route count and route scope map? | Parse current `route-registry.ts`; compare to locked scope. |
| Are UX helper components already present and used? | Inventory and classify usage to prevent duplication. |
| Which API routes now exist beyond older four-API baseline? | List and map to WPs. |
| Which tests already cover V0.96 safety/UX claims? | Classify assertion scope, not just file presence. |
| Are there existing True-UX/IA/density tests? | List and map to WP-01/WP-02/WP-15. |
| Are any P1/HOLD/reference routes currently visible as primary navigation? | Flag for WP-01 de-emphasis/guarding; do not elevate. |
| Does current UI copy overclaim upload/advisor/compliance/export states? | Flag for WP-12. |
| Can the existing schema represent all V0.96 states without migration? | Map to WP-14; no schema changes in WP-00. |
| Are there conflicts between source pack assumptions and current code? | Mark `CONFLICTING` and block downstream implementation until resolved. |

---

## 20. Codex Execution Notes

1. Start from the current repo root, not from copied snippets.
2. Read `AGENTS.md` and root instructions before any command.
3. Treat this WP as an audit/rebase task. It may create a report, but it must not change application behaviour.
4. Prefer existing scripts in `package.json`. Do not invent commands if scripts are absent.
5. If dependencies are unavailable, perform static inventory and mark tests `NOT_RUN_DEPENDENCY_UNAVAILABLE`.
6. Every downstream WP should receive a precise file map from WP-00.
7. Keep the final register concise enough to be usable, but complete enough that Codex does not have to infer product scope or UX priorities later.
8. Use labels consistently: `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`, `REQUIRES_DECISION`.
9. Use `SNAPSHOT_EVIDENCE_ONLY` wherever the local ZIP rather than live repo is the inspected source.
10. Put user-visible UI/UX/IA issues into the register only if supported by KB, V0.96 source or current code evidence.

---

## 21. QA Matrix

| QA Check | Expected Result | Pass Criteria |
|---|---|---|
| Source hierarchy preserved | `full-workflow` target, `main` false-gap only | No target task derives from `main`. |
| WP-00 read-only | No code/app/schema/test edits | Only report/register artefacts produced. |
| Current repo rechecked | Branch/status/routes/APIs/tests/components/schema inventoried | Counts and files are current or labelled snapshot-only. |
| Stale KB facts handled | Older counts are not blindly used | Contradictions are marked stale/rebased. |
| UX/IA evidence used | Prompt 00 register and V0.96 source inform output | Problem families mapped to WPs. |
| No broad redesign | Refactor-later scope restricted to touched V0.96 surfaces | P1/HOLD/reference routes preserved. |
| Interaction proof discipline | Visual-only/static/partial states are labelled | No chips/buttons/modals treated as proof. |
| P0 safety preserved | Advice, visibility, evidence, audit, export rules remain fail-closed | No upload-to-release, admin bypass or AI Draft leakage implied. |
| Downstream readiness | Every WP gets file/test/API/component targets | WP-01 to WP-16 can proceed without guessing. |
| Validation documented | Commands/tests run or not run with reason | Results included in register/report. |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Role | ENGINE_v2 Role | Codex-Spark-like Convergence | Output in this Artefact |
|---|---|---|---|---|
| Problem framing | Identified WP-00 as a moving-baseline and UX/IA evidence gate, not an implementation task. | Locked source hierarchy and stop rules. | Converged on a read-only rebase task. | Executive Task Decision |
| KB/UI discovery | Interpreted route-catalogue, long page, density, CTA, visual-only, no-overclaim and true-UX problem families. | Converted evidence into tables and downstream mappings. | Avoided generic redesign; only supported UX/IA issues are carried forward. | KB Evidence Intake and UX/IA Problem Mapping |
| Code reality framing | Detected contradiction between older KB counts and current local snapshot. | Required live repo/static inventory before implementation. | Established WP-00 as mandatory first gate. | Current Code / Route / Component Reality to Recheck |
| Operational decomposition | Kept task concrete and file/module oriented. | Produced task IDs, concrete steps, acceptance criteria, commands and tests. | Made each task directly usable by Codex. | Detailed Implementation Task Breakdown |
| Safety discipline | Preserved no unapproved advice, no AI Draft leakage, fail-closed visibility and no admin bypass. | Mapped safety implications to blockers and downstream WPs. | Prevented UI convenience from weakening gates. | Safety / RBAC / Visibility / Evidence / Audit / Export Implications |
| QA and proof | Checked contradiction, scope and evidence risks. | Built QA matrix and negative acceptance criteria. | Produced a single executable deep task description. | QA Matrix and Stop Rules |

---

## Final WP-00 Execution Instruction for Codex

```text
Execute WP-00 first. Do not implement features. Inspect the current full-workflow repo, produce the V0.96 moving-baseline and UX/IA delta register, classify every downstream WP, and stop if source, scope, route, API, schema, test or UX evidence conflicts cannot be resolved without a product decision.
```
