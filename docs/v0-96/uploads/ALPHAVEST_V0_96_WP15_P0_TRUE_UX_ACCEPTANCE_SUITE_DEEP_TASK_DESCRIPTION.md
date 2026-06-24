# ALPHAVEST V0.96 — WP-15 P0 + True-UX Acceptance Suite — Deep Task Description

**Work Package:** `WP-15 — P0 + True-UX Acceptance Suite`  
**Release:** `V0.96 Core Journey + UX/IA Refactor`  
**Mode:** Codex-ready task description only. No implementation in this artefact.  
**ENGINE Combination:** ENGINE_v3 for KB / UX / IA / contradiction discovery; ENGINE_v2 for operational task decomposition, acceptance criteria, negative tests and stop rules; Codex-Spark-like convergence for implementation-ready specificity.

---

## 1. Executive Task Decision

**Task decision:** `WP15_DEEP_TASK_DESCRIPTION_ACCEPTED_FOR_CODEX_EXECUTION_AFTER_WP00_REBASE`

WP-15 is the release-proof layer for V0.96. It does not add product scope by itself. It proves that the work from WP-01 through WP-14 is real, safe and user-comprehensible through a combined **P0 safety + True-UX acceptance suite**.

The suite must prove both sides of the V0.96 promise:

1. **P0 safety truth:** no unapproved advice, no client-visible AI Draft, no admin bypass, no upload-to-release shortcut, no cross-tenant leakage, no export of forbidden internal payload, no silent success when audit is required.
2. **True-UX truth:** journey-first IA, clear page jobs, one primary CTA per state, density improvements, real modal/drawer/form/table lifecycles, no-overclaim microcopy, fail-closed client views and no reliance on visual-only/status-chip proof.

**Current local snapshot reality observed for this prompt-run family:**

- The current inspected `full-workflow` ZIP/snapshot is materially newer than older KB counts.
- Prompt 00 evidence register records current snapshot indicators of **815 files**, **15 API route files**, **51 Playwright/spec files**, **51 component files** and **76 lib modules**.
- Older KB layers reporting 405 files / 4 APIs / 10 specs remain historical source hierarchy evidence, not current implementation truth.

**Core implementation intent:**

> Create/update deterministic tests that prove the V0.96 core journey and its UX/IA refactor claims semantically, without brittle pixel assertions, generated screenshots, generated images, P1/HOLD scope elevation or false production-readiness claims.

**Codex status:** `READY_FOR_CODEX_AFTER_WP00_REBASE_AND_CURRENT_TEST_INVENTORY`

---

## 2. Source-of-Truth Lock

| Rank | Source | Role for WP-15 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / snapshot | Target implementation and test baseline | Inspect current tests, route behavior, services, APIs, components and package scripts before editing | Do not duplicate stale tests or assume old counts are current |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | Prompt 00 KB-derived evidence register and WP index | Use problem families, route/component mapping, refactor-now decisions and current snapshot note | Do not treat it as code proof |
| 3 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Primary WP source | Use WP-15 goal, target files, scope, implementation steps, tests and stop rules | Do not skip WP-00 moving-baseline rebase |
| 4 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Binding P0 proof discipline | Existing tests are proof slices; map positive/negative gaps explicitly | Do not claim current tests prove full P0 safety without inspection |
| 5 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Core safety contract | Prove route/action/object/payload separation, fail-closed visibility, AI Draft internal-only and admin non-bypass | Do not accept route visibility as payload permission |
| 6 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Evidence/audit/export safety contract | Prove upload-not-sufficiency, audit persistence/fail-closed and export forbidden-payload exclusion | Do not treat upload/audit/export UI visibility as proof |
| 7 | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | No-overclaim feedback contract | Test success/error/pending/blocked wording and downstream gate separation | Do not allow success text to imply later gates passed |
| 8 | `STATE_SCREEN_SPEC.md` + `DRAWER_MODAL_INTERACTION_CONTRACT.md` | State and lifecycle contracts | Test route states, modal/drawer/form/action lifecycles and failure paths | Do not accept deterministic visual states as real interaction proof |
| 9 | `ROUTE_SCOPE_LOCK.md` + `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | Route/scope/visual boundaries | Keep MVP/MVP_SUPPORT/P1/REFERENCE/HOLD boundaries stable | Do not elevate P1/HOLD routes or generate visual assets |
| 10 | `API_CONTRACT_MATRIX.md` + `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | API/schema contracts | Test API/service/schema-driven UI truth and safe error behavior | Do not create new APIs/schema replacements via tests |
| 11 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` + `FINAL_CODEX_TASK_MASTER.md` | Final implementation constraints | Preserve no-generation, no blind schema replacement, full-workflow-only implementation | Do not expand beyond approved V0.96 scope |
| 12 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` + `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey product proof | Use selected V0.96 journey spine and acceptance obligations | Do not flatten all mega-journeys into V0.96 |
| 13 | `main` repo / ZIP | False-gap history only | Explain contamination if found | Never derive target tests or absence claims from `main` |

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | WP-15 Task Implication | Must Test Now? |
|---|---|---|---|---|---|---|
| Existing tests are proof slices, not full P0 proof | `P0_TEST_ACCEPTANCE_MATRIX.md`; Prompt 00 register | All V0.96 | Test coverage / overclaim risk | Critical | Build matrix: covered / partial / missing / conflicting before adding tests | Yes |
| Route 200 / screenshot / PNG does not prove UX or safety | Route/visual matrix; Interaction Audit | Route smoke / UI tests | Visual-only proof risk | Critical | True-UX tests must assert semantic state, CTA, copy, lifecycle and forbidden-content absence | Yes |
| Upload success is not evidence sufficiency | Evidence/Audit/Export Contract; Feedback Contract | Routes 027–030, 046–047 | Evidence safety | Critical | Negative tests: upload alone cannot release, cannot satisfy evidence, cannot unlock client view/export | Yes |
| Advisor approval is not compliance release | RBAC/Advice Contract; Feedback Contract | Routes 036–040 | Gate confusion | Critical | Tests assert advisor approval yields compliance-pending, not client-visible/released | Yes |
| AI Draft is internal-only | MVP Scope; Journey Matrix; RBAC Contract | Routes 033–037, 019–020, 054–058 | Advice boundary | Critical | Tests assert AI Draft/internal rationale absent from client portal, mobile, APIs and export | Yes |
| Client visibility is fail-closed | RBAC/Visibility Contract; State Spec | Routes 019–020, 043–047 | Client safety | Critical | Tests assert no released content shows before compliance release/redaction proof | Yes |
| Admin cannot bypass gates | RBAC Contract; Governance WP | Routes 009–010, 048–051, 038–040, 054–058 | Governance safety | Critical | Tests assert admin cannot force release, evidence sufficiency, visibility, audit bypass or export approval | Yes |
| Audit display is not audit persistence | Evidence/Audit Contract; Interaction Audit | Routes 042, 051, audit timeline components | Audit proof | Critical | Tests assert critical actions create persisted audit references; audit failure blocks critical action | Yes |
| Export preview, approval and download are separate | Export contract; Feedback contract | Routes 054–058 | Export safety | Critical | Tests assert forbidden payload excluded and preview ≠ approval ≠ download/share | Yes |
| Route catalogue IA must become journey-first | Prompt 00 register; WP-01 | App shell/sidebar/topbar/page header | IA / navigation | High | True-UX tests assert core journey nav groups and de-emphasizes P1/HOLD/reference routes | Yes |
| Long/sparse pages require page-type/density rules | Prompt 00 register; WP-02 | Internal workbenches/client pages | Layout / density | High | Tests assert semantic density markers/classes/contracts, not pixel-perfect visual assertions | Yes |
| One primary CTA per state | Prompt 00 register; WP-01/WP-02/WP-11/WP-12 | Core V0.96 routes | CTA hierarchy | High | Tests assert one primary action per state and disabled/secondary behavior where blocked | Yes |
| Modal/drawer/table/form primitives must have lifecycles | Drawer/Modal Contract; WP-11 | Shared UI primitives and affected routes | Interaction lifecycle | High | Tests cover open/close/cancel/submit/loading/error/permission/focus/keyboard basics | Yes |
| No-overclaim microcopy is safety surface | Feedback Contract; WP-12 | Cross-cutting UI | Microcopy | High | Tests assert specific forbidden wording patterns are absent and safe alternatives present | Yes |
| P1/HOLD route visuals do not authorize implementation | Route Scope / Visual Matrix / Screen Generation Brief | 052–053, 059–060, 064–071 | Scope control | High | Tests/acceptance must not require new visuals or elevate held routes | Yes |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must inspect current repo reality before editing any tests. This section is an inspection map, not a claim that all files exist in the live branch.

### Test files to inventory first

| Test File / Pattern | Why to inspect | Expected WP-15 decision |
|---|---|---|
| `tests/p0-acceptance.spec.ts` | Central P0 journey proof, if present | Extend if partial; create only if absent after rebase |
| `tests/p0-api-contract.spec.ts` | API safety/error/payload proof | Extend for safe errors, forbidden payloads, validation and no state advancement |
| `tests/true-ux-a11y.spec.ts` | A11y/focus/keyboard proof | Extend for changed modal/drawer/CTA states |
| `tests/true-ux-client-projection.spec.ts` | Client-safe projection truth | Assert fail-closed client views and forbidden content absence |
| `tests/true-ux-cta-state.spec.ts` | Primary CTA/state hierarchy | Assert one primary CTA per state on touched surfaces |
| `tests/true-ux-density.spec.ts` | Page-type/density proof | Assert semantic density/page-type contracts, not pixels |
| `tests/true-ux-p0-safety.spec.ts` | Combined UX/P0 safety proof | Extend only after gap matrix confirms need |
| `tests/ui-clickflow-phase01-05.spec.ts` | Earlier clickflow proof | Reuse or update if it covers V0.96 core route phases |
| `tests/ui-clickflow-phase06-10.spec.ts` | Later clickflow proof | Reuse or update if it covers V0.96 core route phases |
| `tests/interaction-lifecycle.spec.ts` | Modal/drawer/action lifecycle | Extend for open/close/cancel/submit/loading/error/permission cases |
| `tests/confirmation-lifecycle.spec.ts` | Confirmation lifecycle | Extend for release/block/export/second-confirmation confirmations |
| `tests/export-safety.spec.ts` | Export/redaction proof | Extend for forbidden payload exclusion and staged lifecycle |
| `tests/governance-non-bypass.spec.ts` | Admin bypass proof | Extend for admin cannot release/force evidence/visibility/export |
| `tests/audit-fail-closed.spec.ts` | Audit failure behavior | Extend for critical actions blocking when audit cannot persist |
| `tests/route-smoke.spec.ts` | Route presence only | Keep as smoke; do not treat as P0/True-UX proof |
| `tests/navigation-shell.spec.ts` | Journey-first IA proof, if present | Extend for journey nav, role-aware grouping and P1/HOLD de-emphasis |
| `tests/ui-state-boundaries.spec.ts` | UI state boundary proof, if present | Extend for pending/blocked/denied/empty/success no-overclaim states |

### Application areas whose behavior tests must exercise

| Area | Routes / Modules | Required proof type |
|---|---|---|
| Evidence | 027–030, 046–047; document/evidence services/APIs | Upload-only, review/link/sufficiency, needs-evidence, rejected/insufficient/sufficient |
| Analyst / AI Draft | 033–035; workbench/trigger/detail services | AI Draft internal-only, unsupported claim, needs-evidence, rebuild/reject |
| Advisor | 036–037 | Approve/reject/request changes; advisor approval not release |
| Compliance | 038–042 | Preconditions, request evidence, block, release, audit required, permission denied |
| Client Projection | 019–020, 043–047 | No released content before release; released safe summary after release; forbidden absence |
| Audit | 042, 051, audit timeline/components/services | Persisted audit references and audit-failure fail-closed |
| Governance | 009–010, 048–051 | Admin non-bypass, role/action/payload separation, second confirmation |
| Export | 054–058 | Scope/redaction/preview/approval/download separation; forbidden payload exclusion |
| Shared UX | app shell/sidebar/topbar/page header, modal/drawer/table/form/CTA primitives | Journey-first nav, page job, density, CTA, lifecycle, a11y |

---

## 5. WP Problem Statement

V0.96 cannot be accepted because the UI looks better or because routes, APIs, schema fields and tests exist. It can only be accepted when the implementation proves that the core journey is both **safe** and **true in the user experience**.

Current known risks:

- Existing tests may already cover pieces of the journey, but they may be duplicated, stale, partial or overclaiming.
- Route smoke tests can prove pages load, but not that users understand the journey or that gates hold.
- UI can display status chips and audit rows without real gate or persistence proof.
- Positive paths can pass while negative leakage/bypass cases remain untested.
- True-UX expectations can become brittle if implemented as pixel assertions instead of semantic layout/state contracts.

WP-15 must therefore build a release-proof suite that is matrix-driven, current-repo-aware, negative-test-heavy and tied directly to the V0.96 Work Packages.

---

## 6. V0.96 Journey Role

WP-15 is the proof gate for the selected V0.96 journey spine:

1. Mapped user / tenant / role context is present.
2. Evidence is uploaded, reviewed, linked and marked sufficient or insufficient correctly.
3. Analyst reviews internal AI/rules draft and unsupported claims.
4. Advisor approves or rejects without creating release.
5. Compliance blocks, requests evidence or releases only after preconditions.
6. Decision Record and Client-Safe Projection show only released/redacted content.
7. Audit persists critical gate events and blocks/fails closed when unavailable.
8. Governance/Admin cannot bypass evidence, release, visibility, audit or export gates.
9. Export scope/redaction/approval/download are separate and forbidden payloads are excluded.
10. UI/UX/IA changes are proven through journey navigation, page job, density, CTA, lifecycle, state, copy and a11y tests.

**Release implication:** WP-15 is a `P0_RELEASE_BLOCKER`. V0.96 is not acceptable if WP-15 cannot produce a clear covered/partial/missing matrix plus passing core positive/negative tests.

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | V0.96 UX Risk | WP-15 Test Obligation | Assertion Type |
|---|---|---|---|
| Route-catalog navigation | User sees many routes instead of guided journey | Test journey-first nav groups and core route access order | Semantic labels / nav groups / role-aware visibility |
| Missing page job | User cannot tell what a page is for | Test page header contains job/gate/blocker/next-step where relevant | Text and landmark assertions |
| Long page sprawl | Critical action buried in scroll | Test primary summary/action regions appear before secondary detail | Region/order assertions, not pixels |
| Empty space / sparse pages | States look unfinished or meaningless | Test meaningful empty/blocked/pending content appears | Text/role assertions |
| Too many CTAs | User cannot tell next safe action | Test one primary CTA per state and secondary/disabled actions | Button role/class/data-state assertions |
| Visual-only modals/drawers | Confirmation looks real but lifecycle incomplete | Test open/close/cancel/submit/loading/error/focus/escape where applicable | Interaction assertions |
| Status chips pretending gate proof | UI says state without real source | Test chips derive from service state and do not imply downstream gate | State/payload assertion + copy assertion |
| Upload success overclaim | User thinks upload unlocks release | Test upload success copy and blocked release state | Copy + workflow state assertion |
| Advisor/release confusion | User thinks advisor approval releases to client | Test advisor-approved => compliance-pending and no client visibility | State + forbidden content assertion |
| Client internal data risk | Client sees AI/internal notes | Test forbidden content absence on portal/mobile/export | Negative DOM/API assertions |
| Audit display vs persistence | Visual timeline treated as proof | Test persisted audit references after critical actions and fail-closed on audit failure | DB/API/service or fixture-backed assertions |
| Export lifecycle confusion | Preview/download/approval collapse | Test preview ≠ approval ≠ download and forbidden payload exclusion | State + manifest assertions |
| Table/filter/kanban visual-only | UX looks interactive without behavior | Test only V0.96-touched tables/forms for meaningful loading/empty/error/filter/selection behavior | Interaction assertions |
| A11y/focus gaps | Modals/drawers/CTAs hard to use | Test focus movement, accessible names, keyboard close/submit where relevant | A11y/keyboard assertions |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### Changes now

- Add/update P0 positive end-to-end proof for the V0.96 core journey.
- Add/update negative safety tests for leakage, bypass and false gate completion.
- Add/update True-UX tests for journey navigation, page headers, density, CTA hierarchy, lifecycle, copy, client projection and a11y.
- Create a P0/True-UX coverage matrix that classifies every required gate as `COVERED`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED`.
- Prefer semantic assertions and data-testid / ARIA / visible-copy checks over brittle pixel assertions.
- Reuse and extend existing test files after WP-00 test inventory; do not duplicate test families blindly.

### Stays out

- No screen generation, screenshot generation or image-generation requirements.
- No pixel-perfect visual assertions.
- No test-driven scope elevation of P1/HOLD/reference-only routes.
- No new production integrations, no banking/custody tests, no production AI advice tests.
- No blind Prisma migration or patch-schema replacement.
- No broad 71-route UX redesign acceptance.
- No claim that V0.96 is full production/GA-ready.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP15-T01 | Inventory current test suite and map coverage | Snapshot has many more tests than older KB; avoid duplication | `tests/**/*.spec.ts`, `package.json`, `playwright.config.ts`, `P0_TEST_ACCEPTANCE_MATRIX.md` | List existing specs; map each to P0/True-UX gates; classify `COVERED/PARTIAL/MISSING/CONFLICTING/BLOCKED`; identify obsolete duplicates | Coverage matrix exists before new tests; no test is treated as proof without assertion inspection | New/updated `tests/p0-true-ux-coverage.spec.ts` only if useful; otherwise doc/report output from tests | Indirect | Stop if tests cannot be enumerated or package scripts are missing; record blocker |
| WP15-T02 | Add positive V0.96 journey proof | Core journey must pass end-to-end semantically | `tests/p0-acceptance.spec.ts`, route components, APIs/services from WPs 03–10 | Build deterministic journey: mapped user -> evidence review/sufficiency -> analyst -> advisor -> compliance release -> client-safe projection -> audit -> redacted export manifest | Positive test proves journey state transitions and safe client/export outputs | `tests/p0-acceptance.spec.ts` | Yes, through page/job/CTA/state assertions | Stop if current implementation lacks product decision for a required transition; mark missing proof |
| WP15-T03 | Prove upload is not sufficiency/release | Upload is strongest interaction but not evidence sufficiency | `tests/document-upload-flow.spec.ts`, `tests/evidence-review-api.spec.ts`, evidence/document APIs/services | Add negative assertions after upload: release disabled, client no content, evidence pending review, export blocked | Upload success confirms upload only; no release/client/export unlock | `tests/p0-acceptance.spec.ts`, `tests/evidence-review-api.spec.ts` | Yes, copy/state assertions | Stop if tests would require creating unsupported product behavior; mark gap |
| WP15-T04 | Prove advisor approval is not compliance release | Advisor and compliance gates must remain separate | Advisor routes/tests, workflow gate tests | Add test: advisor approves -> compliance pending; client sees no released summary; compliance route still requires release | Advisor approval never sets released/client-visible state | `tests/workflow-gate.spec.ts`, `tests/p0-acceptance.spec.ts` | Yes, no-overclaim copy assertions | Stop if status model conflates approval/release; mark blocker for WP14/WP05 |
| WP15-T05 | Prove AI Draft/internal notes never leak | AI Draft is internal-only | Analyst/workbench/client/export routes and APIs | Add forbidden content fixture labels; assert absent from portal/mobile/client projection/export/API safe payload | AI Draft/internal rationale/analyst notes/compliance notes absent from client-safe surfaces | `tests/true-ux-client-projection.spec.ts`, `tests/export-safety.spec.ts`, `tests/p0-api-contract.spec.ts` | Yes, forbidden visible-text assertions | Stop if no deterministic internal content marker exists; create test fixture only within accepted seed/test setup |
| WP15-T06 | Prove cross-tenant, wrong-role and admin-bypass denial | Governance safety and tenant isolation | Permission engine tests, governance routes, APIs/services | Add negative tests for cross-tenant read/action, wrong role release/export, admin forced release/evidence/visibility/export | Denied with safe feedback/audit/no mutation/no payload leak | `tests/governance-non-bypass.spec.ts`, `tests/permission-engine.spec.ts`, `tests/p0-api-contract.spec.ts` | Yes, denied/disabled states | Stop if current actor model is not rebased; route to WP00/WP13/WP14 |
| WP15-T07 | Prove compliance preconditions and audit fail-closed | Release must require advisor/evidence/audit | Compliance/gate/audit services and routes | Tests for missing advisor, missing/insufficient evidence, missing audit: release blocked/fails closed | Compliance release only succeeds after all preconditions; audit failure blocks critical action | `tests/audit-fail-closed.spec.ts`, `tests/workflow-gate.spec.ts`, `tests/p0-acceptance.spec.ts` | Yes, blocker/release-disabled UI states | Stop if audit failure cannot be simulated deterministically; mark test harness gap |
| WP15-T08 | Prove export redaction and lifecycle separation | Export is V0.96 trust output | Export route/API/services/tests | Test scope -> redaction -> preview -> approval -> manifest; assert preview not approval, approval not download, forbidden payload excluded | Redacted manifest only includes client-safe approved scoped content | `tests/export-safety.spec.ts`, `tests/p0-api-contract.spec.ts` | Yes, staged export UI/copy assertions | Stop if binary export is required; only metadata/manifest proof is in scope unless existing code supports more |
| WP15-T09 | Prove journey-first IA and route-scope boundaries | UI must not remain route catalogue | App shell/sidebar/topbar/page header tests | Assert core journey groups; P1/HOLD/reference de-emphasized/guarded; page header has job/gate/next step | Navigation supports V0.96 journey; no P1/HOLD scope elevation | `tests/navigation-shell.spec.ts`, `tests/true-ux-p0-safety.spec.ts` | Yes, direct IA assertions | Stop if nav model not implemented; mark WP01 incomplete |
| WP15-T10 | Prove density and page-type contracts | Long/sparse pages must be improved semantically | UX density/page contract helpers and core routes | Assert client pages calm; internal workbenches compact; decision rooms prioritize summary/action; no pixel checks | Touched routes expose correct semantic density/page-type markers and critical regions | `tests/true-ux-density.spec.ts` | Yes | Stop if only visual screenshots can prove; avoid pixel brittle assertions |
| WP15-T11 | Prove one-primary-CTA and state feedback rules | CTA hierarchy is core UX fix | CTA cluster/action button components/routes | Assert one primary CTA per state on Evidence/Advisor/Compliance/Export/Client; blocked state disables/hides unsafe actions | No page exposes multiple competing primary CTAs for same state | `tests/true-ux-cta-state.spec.ts`, `tests/ui-state-boundaries.spec.ts` | Yes | Stop if UI lacks stable selectors/roles; add semantic labels in relevant WP, not in test-only hack |
| WP15-T12 | Prove modal/drawer/form/table lifecycles and a11y | Shared primitives cannot be visual-only | Modal/drawer/table/form components and changed routes | Test open/close/cancel/submit/loading/error/permission states, focus return, Escape behavior where in contract, accessible names | Interaction primitives used in V0.96 routes have real lifecycles and basic a11y | `tests/interaction-lifecycle.spec.ts`, `tests/confirmation-lifecycle.spec.ts`, `tests/true-ux-a11y.spec.ts` | Yes | Stop if route has deterministic visual-only state; mark originating WP incomplete |
| WP15-T13 | Prove no-overclaim microcopy | Feedback text is safety surface | WP12 copy helpers/routes/tests | Assert forbidden phrases absent; safe phrases present for upload/advisor/compliance/export/client states | Copy names only completed action and not downstream gates | `tests/true-ux-p0-safety.spec.ts`, `tests/ui-state-boundaries.spec.ts` | Yes | Stop if copy is duplicated in many components; route to WP12 centralization |
| WP15-T14 | Validate API/service-driven UI truth | UI must not be static chips | API routes/services/UI readmodels | Test UI reflects API/service state for evidence, compliance, client, audit, export; safe errors do not advance state | State changes come from service/API truth and errors fail closed | `tests/p0-api-contract.spec.ts`, `tests/true-ux-client-projection.spec.ts` | Indirect but required | Stop if service state unavailable; route to WP13 |
| WP15-T15 | Produce test evidence summary for WP16 | WP16 needs release evidence/handoff | Test output/report docs | Generate/update concise coverage report: passed, partial, missing, blocked, commands run, unresolved risks | WP16 can consume a clear evidence index | `ALPHAVEST_V0_96_P0_TRUE_UX_ACCEPTANCE_EVIDENCE.md` or existing docs path | Indirect | Stop if tests not executed; document not-run reason and blockers honestly |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### Core routes under test

| Route IDs | Route Family | Required acceptance focus |
|---|---|---|
| 019–020 | Client portal/mobile | Fail-closed client-safe projection and forbidden content absence |
| 027–030 | Documents/upload/extraction/verification | Upload-only, evidence review/link/sufficiency and needs-evidence states |
| 033–035 | Signals/workbench/trigger detail | Analyst review, AI Draft internal-only, unsupported claims |
| 036–037 | Advisor approval | Approval/reject/request changes and compliance-pending state |
| 038–042 | Compliance | Block/request evidence/release/audit with preconditions |
| 043–047 | Decisions/evidence | Decision record, evidence trace, client-safe release state |
| 048–051 | Governance/audit history | Admin non-bypass, role/action/payload separation, audit proof |
| 054–058 | Export | Scope/redaction/preview/approval/download staged lifecycle |
| 007–018 | Access/admin/tenant support | Only where required for mapped user/tenant/role and governance proof |

### Components and primitives under test

- `components/app-shell.tsx`
- `components/sidebar.tsx`
- `components/top-bar.tsx`
- `components/page-header.tsx`
- `components/client-intake-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/ui/modal.tsx`
- `components/ui/drawer.tsx`
- `components/ui/data-table.tsx`
- `components/ui/state-panel.tsx`
- `components/ui/guarded-action-button.tsx` if present
- `components/ui/a11y-status.tsx` if present

### APIs/services/schema areas under test

- `app/api/**/route.ts` routes supporting V0.96
- `lib/permission-engine.ts`
- `lib/visibility-engine.ts`
- `lib/workflow-gate.ts`
- `lib/evidence-service.ts`
- `lib/evidence-review-service.ts`
- `lib/audit-service.ts`
- `lib/export-service.ts`
- `lib/export-package-service.ts`
- `lib/export-workflow-readmodel-service.ts`
- `lib/domain-types.ts`
- `prisma/schema.prisma` field usage only; no blind migration

---

## 11. Interaction Lifecycle Requirements

WP-15 must test only lifecycle behavior specified and implemented by previous WPs. It must not invent new lifecycle behavior by assertion alone.

| Lifecycle Area | Required Test Behavior | Negative / Failure Test |
|---|---|---|
| Modal open/close | User can open modal, see accessible title, close/cancel without mutation | Closing does not silently submit or advance state |
| Confirmation submit | Submit shows loading/pending and success/error state | Invalid preconditions block submit with safe feedback |
| Drawer open/close | Drawer opens from route action, contains scoped content, closes with focus return where supported | Drawer does not expose forbidden payload |
| Form validation | Required fields/preconditions validated before submit | Validation failure preserves safe state and no mutation |
| Table/list state | Loading/empty/error/permission states render meaningfully | Empty/blocked state does not show stale rows or fake action |
| Primary CTA | One primary CTA per state; unsafe CTA disabled/hidden | Forbidden role or missing gate cannot click through |
| API-driven state | UI updates from service/API response | API error does not advance workflow or expose internal data |
| Export lifecycle | Scope, redaction, preview, approval, manifest/download are staged | Preview alone cannot download/share; forbidden payload excluded |

---

## 12. State / Feedback / Microcopy Requirements

Tests must assert state and copy semantics on touched V0.96 routes.

| State / Copy Area | Required Safe Copy / State | Forbidden Overclaim |
|---|---|---|
| Upload success | `Upload complete. Evidence requires review.` or equivalent | `Evidence complete`, `Released`, `Ready for client` |
| Evidence review | `Pending review`, `Insufficient`, `Sufficient after review/linking`, `Needs evidence` | Upload alone labelled sufficient |
| Analyst AI Draft | `Internal draft`, `Unsupported claim`, `Needs evidence`, `Ready for advisor` | Client-safe / released AI wording |
| Advisor approval | `Advisor approved. Waiting for compliance release.` | `Released`, `Sent to client` |
| Compliance release | `Released to client-safe view` after preconditions | Compliance release implies client acceptance |
| Client projection | `No released content available` before release; released safe summary after release | Internal notes, AI Draft, compliance notes |
| Audit | `Audit recorded` only when persisted event/reference exists | Visual timeline as proof without persisted event |
| Export | `Preview ready`, `Approval required`, `Approved`, `Manifest generated` | Preview/download/approval collapsed |
| Admin denial | `Action denied. Admin cannot bypass release/evidence/export gate.` | Superuser/full override wording |
| API errors | Safe recoverable error; no sensitive stack/internal data | Raw errors or state advancement |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Gate | Required WP-15 Proof | Blocking if Missing? |
|---|---|---|
| Mapped user / tenant / role | Positive journey starts from deterministic scoped actor | Yes |
| Cross-tenant denial | Wrong tenant cannot read/action/export payload | Yes |
| Role/action/payload separation | Route access does not grant action/payload visibility | Yes |
| Client visibility fail-closed | Client sees no internal/unreleased content | Yes |
| AI Draft internal-only | AI Draft/internal rationale absent from client/API/export | Yes |
| No unapproved advice | Advice cannot reach client before advisor + compliance release | Yes |
| Advisor approval not release | Advisor approved state remains compliance-pending | Yes |
| Compliance release gate | Release blocked without advisor/evidence/audit/preconditions | Yes |
| Upload not sufficiency | Upload alone does not release/satisfy/export | Yes |
| Evidence sufficiency | Requires review/link/relevance/acceptance | Yes |
| Audit persistence | Critical actions write persisted audit references | Yes |
| Audit fail-closed | Missing audit blocks/holds critical safety action | Yes |
| Export redaction | Forbidden payload absent from manifest/package | Yes |
| Export lifecycle separation | Preview, approval, download/share remain separate | Yes |
| Admin non-bypass | Admin cannot force release/evidence/visibility/export/audit | Yes |
| API validation/error safety | Invalid requests fail safely without mutation/leakage | Yes |
| No `main` assumptions | Tests do not encode `main` false gaps | Yes |

---

## 14. Positive Acceptance Criteria

WP-15 is accepted only if the following positive criteria are met or explicitly classified with honest blockers:

1. A current test inventory exists and maps each required P0/True-UX gate to `COVERED`, `PARTIAL`, `MISSING`, `CONFLICTING`, or `BLOCKED`.
2. A positive V0.96 core journey test passes or is blocked with a precise missing implementation reference.
3. Evidence can move from upload to reviewed/linked/sufficient state without implying sufficiency from upload alone.
4. Analyst review can mark AI/internal draft states and move safe items toward advisor review.
5. Advisor approval can occur without client release.
6. Compliance release can occur only after required preconditions and audit.
7. Client portal/mobile shows released client-safe summary only after release.
8. Critical audit references are persisted and displayed only as persisted proof.
9. Export manifest/package proof contains only scoped/redacted/client-safe content.
10. Journey-first navigation/page headers/density/CTA semantics are tested on touched V0.96 surfaces.
11. Shared modal/drawer/form/table/CTA lifecycles and a11y basics are tested where changed.
12. No tests require generated images, newly generated screens or pixel-perfect comparisons.

---

## 15. Negative Acceptance Criteria

The following negative cases are mandatory P0 release blockers unless explicitly marked infeasible with a product/test-harness blocker:

1. Cross-tenant actor cannot see or mutate another tenant's documents, decisions, evidence, audit or export.
2. Wrong role cannot perform advisor, compliance, export or governance actions.
3. Admin cannot force compliance release.
4. Admin cannot mark evidence sufficient without review/link/relevance/acceptance.
5. Admin cannot manually switch client visibility on.
6. Upload alone does not release, satisfy evidence, unlock client view or export.
7. Advisor approval alone does not release to client.
8. Missing/insufficient evidence blocks compliance release.
9. Missing audit persistence blocks/holds critical safety action.
10. AI Draft/internal rationale does not appear in client portal/mobile/API safe payload/export.
11. Analyst notes and compliance notes do not appear in client-safe projection/export.
12. Export preview cannot be treated as export approval.
13. Export approval cannot be treated as download/share/client acceptance.
14. Forbidden export payload is excluded or export is blocked.
15. API validation errors do not advance state and do not leak sensitive internals.
16. P1/HOLD/reference routes are not silently elevated by tests or nav assertions.
17. Status chip/visual row/button alone is not accepted as gate proof.
18. No-overclaim forbidden copy patterns are absent.

---

## 16. Required Tests and Test Names

Codex must first inspect current tests and then either extend existing files or create new files only when no suitable file exists.

| Test Name / File | Purpose | Required Assertions |
|---|---|---|
| `tests/p0-acceptance.spec.ts` | Positive V0.96 journey proof | Mapped user -> evidence -> analyst -> advisor -> compliance -> client safe -> audit -> export manifest |
| `tests/p0-api-contract.spec.ts` | API safety and errors | Validation, permission, safe errors, no mutation on failure, no forbidden payloads |
| `tests/true-ux-client-projection.spec.ts` | Client-safe UI projection | Fail-closed before release; released safe summary after release; forbidden content absent |
| `tests/true-ux-cta-state.spec.ts` | CTA hierarchy and state | One primary CTA per state; blocked/denied actions disabled/secondary |
| `tests/true-ux-density.spec.ts` | Page type / density semantics | Calm client pages, compact workbenches, decision rooms prioritize summary/action |
| `tests/true-ux-a11y.spec.ts` | A11y and keyboard basics | Accessible names, focus handling, keyboard close/submit where specified |
| `tests/true-ux-p0-safety.spec.ts` | Cross-cutting UX/P0 safety | No overclaim copy, no forbidden content, no visual-only proof |
| `tests/ui-state-boundaries.spec.ts` | State feedback boundaries | Loading/empty/error/permission/blocked/success semantics |
| `tests/interaction-lifecycle.spec.ts` | Modal/drawer/form/table behavior | Open/close/cancel/submit/loading/error/permission paths |
| `tests/confirmation-lifecycle.spec.ts` | Confirmation behavior | Release/block/export/second-confirmation validation and cancel behavior |
| `tests/export-safety.spec.ts` | Export/redaction proof | Scope/redaction/preview/approval/manifest; forbidden payload excluded |
| `tests/governance-non-bypass.spec.ts` | Admin non-bypass | Admin denied for release/evidence/visibility/export bypass |
| `tests/audit-fail-closed.spec.ts` | Audit persistence/failure | Audit event reference exists; missing audit blocks critical action |
| `tests/navigation-shell.spec.ts` | Journey-first IA | Role-aware journey nav, page header job/gate/next-step, P1/HOLD de-emphasis |
| `tests/route-smoke.spec.ts` | Smoke only | Keep route 200/heading coverage; do not count as P0/True-UX proof |

---

## 17. Validation Commands

Codex should run the smallest deterministic command set available in the current repo. Use existing scripts from `package.json`; do not invent scripts without adding them intentionally and documenting why.

Preferred order:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:playwright
pnpm phase:check
```

If the full suite is too large, run targeted Playwright/spec commands for the files touched by WP-15, then record exactly what was run and what was not run.

Examples, only if supported by current repo tooling:

```bash
pnpm playwright test tests/p0-acceptance.spec.ts
pnpm playwright test tests/true-ux-client-projection.spec.ts tests/true-ux-cta-state.spec.ts tests/true-ux-density.spec.ts
pnpm playwright test tests/governance-non-bypass.spec.ts tests/export-safety.spec.ts tests/audit-fail-closed.spec.ts
```

Validation output for WP-16 must include:

- commands run
- pass/fail result
- tests added/updated
- gates covered
- gates still partial/missing/blocked
- known runtime/tooling blockers

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Meaning |
|---|---|
| `NO_PIXEL_ASSERTION_DEPENDENCY` | Do not make V0.96 acceptance depend on pixel-perfect screenshots or generated images. |
| `NO_SCREEN_GENERATION` | Do not generate screens, state screens, image assets or visual replacements. |
| `NO_P1_HOLD_ELEVATION` | Do not elevate P1/HOLD/reference routes because a test wants coverage. |
| `NO_MAIN_TARGET_TRUTH` | Do not derive any test/gap/task from `main`. |
| `NO_ROUTE_SMOKE_OVERCLAIM` | Route smoke/heading tests do not count as P0 safety or True-UX proof. |
| `NO_STATUS_CHIP_PROOF` | Status chips/buttons/visual rows alone do not prove gates. |
| `NO_TEST_ONLY_PRODUCT_LOGIC` | Do not fake product behavior only inside tests. Implement in the relevant WP or mark blocker. |
| `NO_BROAD_REDESIGN_ACCEPTANCE` | Do not require broad 71-route redesign or all-route UX production readiness. |
| `NO_BLIND_SCHEMA_MIGRATION` | Tests must not force blind Prisma replacement/migration. Route to WP14 decision protocol. |
| `NO_EXTERNAL_SERVICE_DEPENDENCY` | P0/True-UX tests must be deterministic and repo-local unless explicitly configured. |
| `NO_UNSUPPORTED_PRODUCT_DECISION` | If a negative/positive case needs a missing product decision, mark blocker rather than inventing behavior. |
| `NO_FALSE_PRODUCTION_CLAIM` | Passing WP-15 does not mean GA/full production readiness. It proves V0.96 acceptance only. |

---

## 19. Open Questions / Blockers

Codex must resolve or record these during implementation:

| Question / Blocker | Required Handling |
|---|---|
| Are all named test files already present in current repo? | Inventory first; extend existing files where present; create missing files only when aligned with current test structure. |
| Is there a deterministic seeded journey fixture for V0.96? | Reuse current seed/test fixtures if available; otherwise create minimal local fixture through accepted test setup, not product shortcut. |
| Can audit failure be simulated deterministically? | If yes, add fail-closed test; if no, record harness gap and route to WP08/WP13. |
| Does current UI expose stable semantic selectors/ARIA labels? | If missing, route to relevant UI WP for semantic labels; do not use brittle CSS/pixel selectors. |
| Are API/service safe payloads available for client/export assertions? | If missing, route to WP13; do not assert against private internals. |
| Are schema fields sufficient to represent state truth? | If not, route to WP14 migration-decision protocol, not blind migration. |
| Are P1/HOLD routes visible in nav after WP01? | They may be de-emphasized/guarded; tests must not require implementation. |
| Can full Playwright suite run locally? | If not, run targeted subset and record commands/limitations. |

---

## 20. Codex Execution Notes

1. Start only after WP-00 moving-baseline and test inventory.
2. Treat this WP as proof orchestration. It should not implement product logic unless the originating WP explicitly requires test helpers/selectors.
3. Prefer extending existing test files over creating parallel duplicate suites.
4. Use semantic selectors, role names, ARIA labels, stable test IDs and service/API state assertions.
5. Avoid pixel/screenshot expectations; density/page-type assertions should use semantic contracts, visible regions, heading hierarchy and data attributes/classes if established by WP02.
6. Every negative test must prove both **no mutation / no state advancement** and **no payload leakage** where relevant.
7. Every success assertion must be paired with a no-overclaim/next-gate assertion when downstream gates remain pending.
8. Do not use generated screenshots as proof. Test screenshots may be captured by Playwright only as diagnostic artefacts if the existing test runner does so automatically; they are not source of truth.
9. Any missing product behavior must be routed back to the owning WP instead of hidden in tests.
10. Final output should feed WP-16 with a clean evidence matrix.

---

## 21. QA Matrix

| QA Check | Required Outcome | Status Label |
|---|---|---|
| Current test inventory completed before edits | Existing tests classified and duplicates avoided | `REQUIRED_BEFORE_IMPLEMENTATION` |
| Positive V0.96 journey proof exists | One deterministic journey path passes or is precisely blocked | `P0_REQUIRED` |
| Negative safety cases exist | Cross-tenant, wrong role, admin bypass, upload-not-sufficiency, advisor-not-release, AI/internal leakage, audit fail-closed, export forbidden payload | `P0_REQUIRED` |
| True-UX tests exist | Journey nav, page header, density, CTA, lifecycle, a11y, no-overclaim | `TRUE_UX_REQUIRED` |
| Tests are semantic, not pixel brittle | No pixel-perfect/generation dependency | `REQUIRED` |
| P1/HOLD/reference routes not elevated | Tests preserve route-scope lock | `REQUIRED` |
| No screen/image generation | No new visual assets created or required | `REQUIRED` |
| Existing proof not overclaimed | Route smoke and API presence remain proof slices only | `REQUIRED` |
| Commands documented | Exact validation commands and results captured | `REQUIRED_FOR_WP16` |
| Blockers honest | Any missing implementation/product decision marked `BLOCKER/PARTIAL/MISSING` | `REQUIRED` |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Role | ENGINE_v2 Role | Codex-Spark-like Convergence | Output in this WP |
|---|---|---|---|---|
| KB / UX / IA discovery | Extracted UI/UX/IA and safety problem families from Prompt 00, P0 matrix and safety contracts | Converted discovered issues into acceptance gates and test families | Removed broad alternatives and focused on V0.96 proof | KB evidence intake and UX/IA mapping |
| Contradiction control | Preserved current snapshot vs older KB count contradiction and visual-proof limits | Locked current full-workflow rebase as required before implementation | Forced test inventory first | Source lock and current reality recheck |
| Journey proof design | Mapped V0.96 core journey across Evidence, Analyst, Advisor, Compliance, Client, Audit, Governance and Export | Translated journey into positive acceptance criteria and targeted test files | Chose one deterministic positive journey as proof spine | Task IDs WP15-T02/T15 |
| Negative proof design | Identified leakage/bypass/overclaim failure modes | Operationalized cross-tenant, role, admin, upload, advisor, audit, export and API negatives | Made negatives release blockers | Negative acceptance matrix |
| True-UX proof design | Identified IA, density, CTA, lifecycle, a11y and microcopy requirements | Converted into semantic test obligations and file targets | Avoided pixel/screenshot overfitting | True-UX test requirements |
| Stop-rule enforcement | Flagged P1/HOLD, visual-generation and product-scope risks | Converted them into do-not-do rules | Prevented Codex from inventing scope | Stop rules / blockers |
| Final task readiness | Validated that this is a task description, not implementation | Produced concrete subtasks, files, tests, commands, acceptance criteria | Made result directly Codex-usable after WP-00 | Final deep task artefact |

---

**Final WP-15 status:** `READY_FOR_CODEX_AFTER_WP00_REBASE_AND_CURRENT_TEST_INVENTORY`  
**Implementation authorization:** only under the existing V0.96 release chain and final handoff constraints.  
**Release blocker:** yes — V0.96 cannot be accepted without passing or honestly classifying this P0 + True-UX acceptance suite.
