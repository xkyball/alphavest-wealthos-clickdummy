# ALPHAVEST V0.96 — WP-16 RELEASE EVIDENCE / HANDOFF UPDATE — DEEP TASK DESCRIPTION

**Work Package:** `WP-16 — Release Evidence / Handoff Update`  
**Release:** `V0.96 Core Journey + UX/IA Refactor`  
**Mode:** Codex-ready task description only. No implementation inside this artefact.  
**Target baseline:** `full-workflow` only.  
**Created from:** Prompt 17 of `ALPHAVEST_V0_96_UX_IA_WP_DEEP_TASK_PROMPT_SUITE_ENGINE_PROOF.md`  

---

## 1. Executive Task Decision

**Decision:** `WP16_RELEASE_EVIDENCE_HANDOFF_UPDATE_READY_FOR_CODEX_DESCRIPTION`

WP-16 closes the V0.96 Core Journey + UX/IA Refactor release by creating a verified release evidence package and updating handoff/status documentation without inventing new product scope. It is not a new feature work package. It is the proof, traceability, and closure layer for everything implemented in WP-00 through WP-15.

Codex must use WP-16 to prove what changed, what passed, what failed, what was skipped, what remains blocked, and what should move to the next release. It must not convert incomplete work into a success claim. It must not promote P1/HOLD/reference-only routes. It must not generate screenshots, screens, state-screen images, or visual assets. Screenshots may only be referenced when produced by existing tests or manual QA during implementation, and they must be labelled as proof artefacts, not new design sources.

**Primary output expected from Codex during implementation:**

`ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_RELEASE_PROOF.md`

plus narrowly scoped updates to existing handoff/status docs only if the repo convention permits and the claims are evidence-backed.

---

## 2. Source-of-Truth Lock

| Rank | Source | Role in WP-16 | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / live branch | Target implementation reality | Verify changed files, tests, routes, services, schema and UI behaviour | Do not rely on stale snapshot counts over current repo reality |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | UX/IA evidence register and WP index | Carry forward known UX/IA problem families and WP coverage | Do not treat it as code proof |
| 3 | WP-00 through WP-15 deep task artefacts | Implementation task and acceptance contract set | Build final evidence index by task/WP | Do not mark tasks complete without code/test evidence |
| 4 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Release task source | Preserve V0.96 scope and WP-16 intent | Do not expand beyond V0.96 |
| 5 | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` / current final handoff | Existing implementation authority layer | Update only with verified release evidence if repo convention allows | Do not rewrite strategy or source truth with unverified claims |
| 6 | `P0_TEST_ACCEPTANCE_MATRIX.md` and WP-15 | P0 and True-UX proof expectations | Map pass/fail/skipped proof | Do not hide failing P0 cases |
| 7 | `ROUTE_SCOPE_LOCK.md` / route worksets | Scope boundary | Preserve MVP/MVP_SUPPORT/P1/REFERENCE/HOLD decisions | Do not promote P1/HOLD/reference routes |
| 8 | Safety contracts: RBAC, Evidence/Audit/Export, API, Schema | Safety proof requirements | Verify no leakage, no bypass, no overclaim | Do not weaken safety language |
| 9 | `main` branch / old `main` ZIP | False-gap history only | Mention only as blocked non-target | Never use as target reality or task source |

**Binding rule:** Markdown artefacts are control evidence; the current `full-workflow` repository is implementation evidence. WP-16 must keep that distinction visible.

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact / KB Layer | Route / Component / WP | Problem Type | Severity | WP-16 Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Visual coverage is not behaviour proof | Route/visual/state reconciliation; screen matrix; state spec | All routes | Proof overclaim | High | Release proof must separate visual changes from tested behaviour | No — proof/reporting only |
| Existing tests are proof slices, not full P0 proof | P0 test matrix | WP-15 / all P0 gates | Test overclaim | Critical | Report must show exact pass/fail/skipped/missing cases | No — closure evidence |
| Route access is not action permission or payload visibility | RBAC/client visibility/advice-boundary contract | All safety routes | Safety proof | Critical | Evidence report must prove route/action/payload separation where implemented | No — closure evidence |
| Upload success is not evidence sufficiency | Evidence/audit/export and feedback contracts | Routes 027–030 | No-overclaim / safety | Critical | Release proof must include upload-only and sufficiency test outcomes | No — closure evidence |
| Advisor approval is not compliance release | Feedback and RBAC/advice contracts | Routes 036–040 | Gate confusion | Critical | Report must show Advisor→Compliance separation proof | No — closure evidence |
| Compliance release is not client acceptance | Feedback/evidence/export contracts | Routes 038–045, 019–020 | Client safety | High | Report must avoid client-acceptance claims | No — closure evidence |
| Audit display is not audit persistence | Audit surface contract | Routes 042, 048–051, audit components | Proof overclaim | Critical | Release proof must distinguish persisted events from displayed rows | No — closure evidence |
| Export preview is not approval/download | Export contract | Routes 054–058 | Workflow overclaim | High | Export proof must separate preview, approval, manifest/download states | No — closure evidence |
| Journey-first IA replaced route-catalog concern | WP-01 / UX evidence register | App shell/sidebar/topbar/page headers | IA problem | High | Report must show which IA surfaces were changed and what remains deferred | No — closure evidence |
| Long-page and whitespace defects | WP-02 / UX evidence register | Touched workbenches/decision rooms/client pages | Layout problem | Medium/High | Report must list touched pages and whether density/page-type work was completed | No — closure evidence |
| No generated screens/assets allowed | Screen generation brief and prompt suite stop rules | All routes/assets | Scope control | Critical | Include explicit no-generation confirmation | No — closure evidence |
| P1/HOLD routes remain blocked | Route scope lock / route matrix | 052–053, 059–060, 061–063, 064–071 | Scope control | Critical | Report must preserve deferrals and held routes | No — closure evidence |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must recheck these before writing the final release proof, because repo reality may have moved since the KB artefacts were produced.

| Area | What Codex must verify | Expected evidence output |
|---|---|---|
| Git state | Branch, commit, status, changed files, untracked files | `git rev-parse --abbrev-ref HEAD`, `git rev-parse HEAD`, `git status --short` |
| Package scripts | Available validation/test scripts | Extract from `package.json` before running commands |
| Routes | Route registry and V0.96 route workset status | Route inventory delta and touched route list |
| Components | Touched app shell, page header, client, evidence, analyst, advisor, compliance, decision, audit, governance, export and shared UI components | Component change matrix |
| APIs/services | Touched service/API files and error envelopes | API/service change matrix |
| Schema | Whether schema changed, migration added, or only usage aligned | Schema/migration decision log |
| Tests | Added/updated tests, passed/failed/skipped tests | Test result matrix |
| UX/IA | Navigation, page type, density, primary CTA, state feedback, microcopy, a11y changes | UX/IA evidence table |
| Screenshots | Only if generated by Playwright/manual QA during implementation | Screenshot manifest with source and purpose; no generated design assets |
| Blockers | Any incomplete P0, failing test, missing proof, scope conflict | Blocker register |

---

## 5. WP Problem Statement

Without WP-16, the V0.96 release can be misread as complete simply because tasks were written or UI surfaces changed. AlphaVest requires stronger release discipline: every claim must be backed by changed files, tests, route/service/schema evidence, and explicit blocker reporting.

The main risks WP-16 prevents are:

- treating visible UI as implemented behaviour;
- treating screenshots as design source instead of proof output;
- hiding failed P0 tests;
- claiming production/pilot readiness without evidence;
- silently promoting deferred routes;
- losing the distinction between current repo reality and older KB artefacts;
- leaving Codex’s implementation impossible to review.

---

## 6. V0.96 Journey Role

WP-16 belongs to **release closure**, not journey feature implementation. It verifies the V0.96 proof spine:

1. Evidence workbench and sufficiency lifecycle.
2. Analyst review and internal-only AI draft handling.
3. Advisor approval separated from compliance release.
4. Compliance block/request evidence/release decision room.
5. Decision record and client-safe projection.
6. Audit persistence and audit UI truth.
7. Governance/admin non-bypass UX.
8. Export scope/redaction/approval proof.
9. Shared interaction primitives and no-overclaim feedback.
10. API/service/schema support for truthful UI states.
11. P0 and True-UX acceptance proof.

WP-16 decides whether these are `COMPLETE`, `PARTIAL`, `BLOCKED`, `DEFERRED`, or `NOT_STARTED`, based on repo/test evidence.

---

## 7. UI / UX / Layout / IA Problem Mapping

| UX/IA Problem Family | How WP-16 must close it | Evidence Required |
|---|---|---|
| Route-catalog navigation | Document whether sidebar/topbar/page headers now express journey-first IA | Changed files, route/nav screenshots only if test/manual proof exists, semantic tests if present |
| Weak page jobs/page headers | Show which page headers gained job/gate/blocker/next-step semantics | Component diffs, tests, or reviewer checklist |
| Long pages / excessive scroll | List touched pages structurally improved or deferred | Page-type/density report from WP-02 |
| Empty/unused whitespace | List sparse pages enriched with meaningful state/context, not filler | Before/after intent text and changed components |
| Too many equal CTAs | Report one-primary-CTA compliance for touched states | Test/checklist and affected files |
| Visual-only modals/drawers | Report lifecycle proof for modals/drawers touched | Tests and component changes |
| Status chips pretending gate proof | Report service/state-backed statuses | Tests/service integration evidence |
| No-overclaim copy | Report key corrected messages | Microcopy matrix and tests |
| Client-safe view | Report client projection positive/negative proof | Tests for hidden internal content and released safe summary |
| Audit display vs persistence | Report persisted AuditEvent proof and unavailable/fail-closed states | Tests/service proof |
| Export preview vs approval/download | Report staged export proof | Tests and export manifest evidence |
| P1/HOLD visual refs | Confirm no generation/promotions happened | Stop-rule compliance table |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### Changes now

- Create a release proof report for V0.96 implementation.
- Update handoff/status docs only where claims are verified.
- Produce a changed-files, changed-routes, changed-tests and changed-UX/IA matrix.
- Record P0/True-UX pass/fail/skipped outcomes.
- Record blockers and next-release carry-forward.
- Confirm no screen/image/state-screen generation and no hold-route promotion.
- Confirm whether each WP is complete, partial, blocked, deferred or not started.

### Stays out

- New implementation.
- New product scope.
- New route scope decisions.
- New screen/state-screen/image generation.
- New visual source assets.
- New design direction.
- Blind Prisma replacement.
- Marking failed/skipped P0 tests as pass.
- Treating screenshots as implementation source of truth.
- Turning unresolved UX/IA findings into immediate scope creep.

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| WP16-T01 | Establish final repo evidence baseline | Release proof must start from current repo reality | `git`, `package.json`, `AGENTS.md`, root docs | Record branch, commit, status, package scripts and validation command availability | Proof report names exact branch/commit and dirty/clean state | No test required; command evidence required | No; evidence only | Stop if repo/branch cannot be identified |
| WP16-T02 | Build WP completion matrix | WP-00..WP-15 must be classified by evidence | All WP task artefacts; changed files; test results | Create matrix: WP, intended outcome, changed files, tests, status, blocker | Every WP is classified `COMPLETE/PARTIAL/BLOCKED/DEFERRED/NOT_STARTED` | N/A | No; reporting only | Stop if status is guessed without evidence |
| WP16-T03 | Build changed route/component/API/schema/test inventory | Reviewer must see what changed | `lib/route-registry.ts`, `components/**`, `app/api/**`, `lib/**`, `prisma/**`, `tests/**` | Diff touched files and map to route/surface/API/schema/test | Report contains changed-file matrix and route/surface mapping | Existing route/test inventory checks if available | No; reporting only | Do not include unrelated files as V0.96 evidence |
| WP16-T04 | Produce UX/IA refactor evidence summary | V0.96 includes UX/IA refactor, not just backend safety | App shell, sidebar, topbar, page header, page-type, density, CTA, state components | Record evidence for journey-first IA, page jobs, density, long-page fixes, empty states, CTA logic | UX/IA summary separates implemented, partial, deferred | True-UX tests if present | No new refactor; summarize existing changes | Stop if report claims UX fix without file/test/checklist evidence |
| WP16-T05 | Produce P0 safety proof matrix | P0 gates must not be overclaimed | WP-15 tests, P0 matrix, test output | Map each P0 gate to positive/negative test result | Missing/failing/skipped gates are visible | Targeted P0 tests | No | Stop if failed P0 is hidden |
| WP16-T06 | Produce no-overclaim copy proof | UI copy must avoid false gate claims | WP-12, changed UI files, tests | List corrected high-risk messages and remaining risky copy | No key V0.96 message overclaims upload/release/export/client acceptance | Copy/state tests if present | No | Stop if overclaim copy remains on V0.96 critical path |
| WP16-T07 | Produce client-safe projection proof | Client UI must fail closed | Client portal/mobile components, visibility services, tests | Document positive safe summary and negative hidden internal content proof | Client only sees released/redacted/client-safe content | Client projection tests | No | Stop if internal content can leak to client |
| WP16-T08 | Produce audit/export/evidence proof sections | Gate evidence must be traceable | Audit, export, evidence services/tests | Summarize upload-only, sufficiency, audit persistence, export redaction outcomes | Sections distinguish display/preview from persistence/approval | Evidence/audit/export tests | No | Stop if upload/export/audit proof is ambiguous |
| WP16-T09 | Confirm no-generation and scope preservation | Stop rules must be visibly honored | Public assets, generated files, route scope matrix | Report generated/new visual assets, if any; confirm no route promotion | No generated screen/image assets; P1/HOLD/reference routes preserved | Route smoke/scope tests if available | No | Stop if generation or route promotion occurred without explicit decision |
| WP16-T10 | Update handoff/status docs narrowly | Final reviewer needs durable status | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`, repo docs, release proof file | Update only verified sections or create standalone release proof if docs are not meant to change | No stale/unverified source-of-truth overwrite | Markdown lint if available | No | Stop if update would replace source truth with unverified claims |
| WP16-T11 | Record next-release carry-forward | Incomplete items must not vanish | P1/HOLD list, blockers, failed/skipped tests | Create carry-forward matrix: item, reason, next owner/release, unblock condition | Next release scope is clear without scope creep | N/A | No | Do not recommend held routes unless decision exists |
| WP16-T12 | Final QA and reviewer handoff | Release proof must be reviewable | Release proof doc; test logs | Add QA checklist, known limitations, validation commands and reviewer instructions | Reviewer can verify release without asking Codex to infer | All selected validation commands | No | Stop if proof lacks commands/results |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### Routes to mention in release proof if touched

| Route Group | Routes | WP-16 Evidence Needed |
|---|---|---|
| Evidence | 027–030 | Upload-only, review, sufficiency, linking, needs-evidence proof |
| Analyst | 033–035 | AI draft internal-only, unsupported claims, ready-for-advisor proof |
| Advisor | 036–037 | Advisor approved/rejected/request-changes; not release proof |
| Compliance | 038–042 | Block/request evidence/release/audit proof |
| Decision/Evidence | 043–047 | Decision record, evidence trace, audit context proof |
| Client | 019–020 | Client-safe projection and fail-closed states proof |
| Governance | 048–051 plus admin support | Admin non-bypass, role/access/audit proof |
| Export | 054–058 | Scope/redaction/preview/approval/download-stage proof |
| P1/Reference/Hold | 052–053, 059–063, 064–071 | Confirm preserved as deferred/reference/hold unless WP-00 proved safe existing integration without scope expansion |

### Files / areas to inspect

- `app/[...segments]/page.tsx`
- `lib/route-registry.ts`
- `lib/navigation.ts` / navigation helpers if present
- `components/app-shell.tsx`, `components/sidebar.tsx`, `components/top-bar.tsx`, `components/page-header.tsx`
- `components/client-intake-screen.tsx`
- `components/internal-workflow-screen.tsx`
- `components/decisions-governance-screen.tsx`
- `components/communication-export-ops-screen.tsx`
- `components/admin-tenant-setup-screen.tsx`
- `components/ui/**`
- `lib/**permission**`, `lib/**visibility**`, `lib/**evidence**`, `lib/**audit**`, `lib/**export**`, `lib/**workflow**`
- `app/api/**/route.ts`
- `prisma/schema.prisma` and migrations if changed
- `tests/**/*.spec.ts`
- docs/handoff/release proof files

---

## 11. Interaction Lifecycle Requirements

WP-16 does not implement interaction lifecycles; it verifies and reports lifecycle proof for touched surfaces.

| Interaction Family | Proof Required in Release Report |
|---|---|
| Modals | Trigger, open, cancel, submit, loading, validation error, success/failure, permission denied where implemented |
| Drawers | Trigger, open, close, content source, role/payload scope, focus/escape if implemented |
| Forms | Field validation, form validation, submit disabled state, safe error, no silent state advancement |
| Tables | Loading, empty, error, permission-denied, row action gating, filter/sort if implemented |
| CTAs | One primary CTA per state, secondary grouping, disabled/hidden denied actions |
| Upload | In progress, failed, retry/reselect, success-upload-only |
| Export | Scope, preview, approval, download/share separated |
| Audit | Event persistence source, unavailable/fail-closed state |

---

## 12. State / Feedback / Microcopy Requirements

Release proof must include a **No-Overclaim Feedback Evidence Table**.

| Risky Claim | Required Safe Copy / Proof Language |
|---|---|
| Upload successful = evidence sufficient | “Upload complete. Evidence still requires review.” |
| Evidence exists = release allowed | “Evidence pending/insufficient/sufficient based on review and link state.” |
| Advisor approved = released | “Advisor approved. Waiting for compliance release.” |
| Compliance released = client accepted | “Released to client-safe view. Client acceptance is not implied.” |
| Audit timeline visible = audit persisted | “Audit event persisted and displayed” only if backed by stored event proof; otherwise “audit unavailable/pending.” |
| Export preview = export approved | “Preview ready. Approval still required.” |
| Export downloaded/shared = client accepted | “Package generated/downloaded. Client acceptance is not implied.” |
| Admin can do anything | “Admin action denied: this gate requires advisor/compliance/evidence/audit/export conditions.” |
| Client route has data = client can see all | “Only released, redacted, client-safe summary is visible.” |

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

WP-16 must explicitly report these safety implications:

| Safety Area | Required Closure Evidence |
|---|---|
| RBAC | Route/action/object/payload separation preserved; admin non-bypass outcomes reported |
| Client visibility | Client-safe projection positive and negative cases reported |
| Advice boundary | AI draft and internal rationale not client-visible or export-visible |
| Evidence | Upload-only, review, link, sufficiency and insufficiency states reported |
| Audit | Critical gate actions persist audit or fail closed; unavailable state reported |
| Export | Forbidden payloads excluded; scope/redaction/approval/download stages separated |
| API | Safe errors do not leak data or advance state |
| Schema | Any schema use or migration decision reported; no blind replacement |
| Scope | P1/HOLD/reference routes preserved |

---

## 14. Positive Acceptance Criteria

WP-16 is accepted when:

1. `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_RELEASE_PROOF.md` exists.
2. The report names current branch, commit, status, changed files and validation commands.
3. Every WP from WP-00 to WP-15 is classified with evidence-backed status.
4. Changed route/component/API/service/schema/test inventory is included.
5. P0 positive acceptance results are included.
6. P0 negative acceptance results are included.
7. True-UX/IA/layout/density/CTA/state feedback evidence is included for touched surfaces.
8. No-generation confirmation is included.
9. P1/HOLD/reference route preservation is explicitly confirmed.
10. Failed/skipped tests and unresolved blockers are visible.
11. Next-release carry-forward is included.
12. Updated docs, if any, contain only verified claims.

---

## 15. Negative Acceptance Criteria

WP-16 fails if:

1. A failed or skipped P0 test is hidden or marked pass.
2. A visual state, status chip, button, screenshot or route presence is treated as behaviour proof.
3. Upload success is described as evidence sufficiency.
4. Advisor approval is described as compliance release.
5. Compliance release is described as client acceptance.
6. Export preview is described as export approval.
7. Audit display is described as audit persistence without stored event proof.
8. A client-facing surface includes internal-only content.
9. P1/HOLD/reference routes are promoted without a locked decision.
10. Any generated screen/image/state-screen asset is introduced as implementation source.
11. `main` becomes target truth.
12. Handoff docs are overwritten with unverified strategy or production-readiness claims.

---

## 16. Required Tests and Test Names

Codex must verify the actual scripts first. Suggested test names and proof families:

| Test / Command | Purpose | Required in Report |
|---|---|---|
| `pnpm typecheck` | Type safety | Pass/fail/skipped with reason |
| `pnpm lint` | Static code quality | Pass/fail/skipped with reason |
| `pnpm build` | Build readiness | Pass/fail/skipped with reason |
| `pnpm db:validate` | Schema validation if available | Pass/fail/skipped with reason |
| `pnpm test:source-reality` | Current reality inventory | Route/API/test/schema delta |
| `pnpm test:route-smoke` | Route shell and hold/reference route guard | Pass/fail/skipped |
| `pnpm test:document-upload-api` | Upload API proof | Upload-only and validation evidence |
| `pnpm test:document-upload-flow` | Browser upload proof | UI upload evidence |
| `pnpm test:workflow-gate` | Gate logic proof | Advisor/compliance boundaries |
| `pnpm test:permissions` | RBAC proof | Non-bypass and object-scope proof |
| `pnpm test:client-visibility` | Client-safe projection | No leakage proof |
| `pnpm test:export-safety` | Export redaction and approval proof | Forbidden payload exclusion |
| `pnpm test:governance-non-bypass` | Admin cannot bypass | Negative proof |
| `pnpm test:fail-closed-error-envelope` | API safe failure proof | No silent advancement/leakage |
| `pnpm playwright test tests/evidence-review-api.spec.ts` | Evidence sufficiency lifecycle | Positive/negative proof |
| `pnpm playwright test tests/audit-fail-closed.spec.ts` | Audit persistence/fail-closed | Critical gate proof |
| `pnpm playwright test tests/confirmation-lifecycle.spec.ts` | Modal confirmation lifecycle | UX/interaction proof |
| `pnpm playwright test tests/interaction-lifecycle.spec.ts` | Drawer/modal/form/CTA lifecycle | UX interaction proof |
| `pnpm playwright test tests/true-ux-density.spec.ts` | Density/page-type semantics | Layout proof |
| `pnpm playwright test tests/true-ux-cta-state.spec.ts` | One-primary-CTA/state behaviour | UX proof |
| `pnpm playwright test tests/true-ux-client-projection.spec.ts` | Client-safe UI | No leakage proof |
| `pnpm playwright test tests/true-ux-a11y.spec.ts` | A11y/focus/keyboard proof | Accessibility proof |
| `pnpm playwright test tests/true-ux-p0-safety.spec.ts` | Combined P0/UX proof | Release blocker |
| `pnpm playwright test tests/p0-acceptance.spec.ts` | End-to-end P0 acceptance | Final release proof |

If runtime is too high, Codex may run targeted subsets only after documenting what was skipped and why. Skipped P0 safety tests remain blockers unless explicitly justified and accepted.

---

## 17. Validation Commands

Codex must inspect `package.json` first. Recommended command pattern:

```bash
git rev-parse --abbrev-ref HEAD
git rev-parse HEAD
git status --short
pnpm --version
cat package.json
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm build
pnpm test:source-reality
pnpm test:route-smoke
pnpm test:document-upload-api
pnpm test:document-upload-flow
pnpm test:workflow-gate
pnpm test:permissions
pnpm test:client-visibility
pnpm test:export-safety
pnpm test:governance-non-bypass
pnpm test:fail-closed-error-envelope
pnpm playwright test tests/true-ux-p0-safety.spec.ts
pnpm playwright test tests/p0-acceptance.spec.ts
```

If a command does not exist, report it as `NOT_AVAILABLE_IN_CURRENT_REPO`, not as pass.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Required Codex Response |
|---|---|
| Wrong branch or repo unknown | Stop and report; do not produce final proof as pass |
| Current repo contradicts older KB | Use current repo as implementation baseline and mark older claim stale |
| P0 negative test fails | Mark release blocker; do not hide |
| Client internal data leakage found | Mark critical blocker |
| Admin bypass found | Mark critical blocker |
| Upload-to-release shortcut found | Mark critical blocker |
| AI draft client/export leakage found | Mark critical blocker |
| Export forbidden payload found | Mark critical blocker |
| Audit persistence missing for critical gate | Mark critical blocker or partial depending on scope |
| Docs update would overwrite source truth with unverified claims | Do not update docs; create standalone proof only |
| New screen/image/state-screen generation is required | Stop; not authorized |
| Hold/P1 route implementation is required | Stop; requires explicit scope decision |

---

## 19. Open Questions / Blockers

Codex must populate this table during implementation:

| Blocker ID | Area | Description | Evidence | Severity | Required Decision / Next Action | Release Status |
|---|---|---|---|---|---|---|
| WP16-BLOCKER-001 | P0 tests | Any failed or skipped release-blocking P0 test | Test output | Critical | Fix or mark release blocked | To fill |
| WP16-BLOCKER-002 | Client projection | Any internal data exposure | UI/API/test evidence | Critical | Fix before release | To fill |
| WP16-BLOCKER-003 | Audit | Missing audit persistence for release/block/export/admin action | Service/test evidence | High/Critical | Fix or mark partial | To fill |
| WP16-BLOCKER-004 | UX/IA | Remaining long-page/CTA/density issue on critical V0.96 route | Reviewer/test evidence | Medium/High | Carry forward or fix | To fill |
| WP16-BLOCKER-005 | Scope | Any P1/HOLD route accidentally implemented/promoted | Diff/route evidence | Critical | Revert or obtain decision | To fill |
| WP16-BLOCKER-006 | Docs | Handoff claim not backed by repo/test evidence | Review finding | High | Remove or qualify claim | To fill |

---

## 20. Codex Execution Notes

1. Treat WP-16 as a release evidence task, not as a feature task.
2. Start from git status and current repo commands.
3. Never claim `complete` from task text alone; require file/test evidence.
4. Prefer a standalone proof file if updating existing handoff docs would blur source truth.
5. Preserve all skipped/failing test output.
6. Use tables for reviewability.
7. Screenshots are allowed only as proof artefacts generated by tests/manual QA; they are not design source-of-truth.
8. Any `manual QA` item must say exactly what was checked and by whom/tooling if known.
9. Use `PARTIAL` honestly when only a proof slice exists.
10. Next-release recommendations must be concrete but must not implement or promote held scope.

---

## 21. QA Matrix

| QA Check | Required Result | Status Field for Codex |
|---|---|---|
| Branch/commit/status recorded | Yes | `PASS/FAIL` |
| Changed files listed | Yes | `PASS/FAIL` |
| WP-00..WP-15 status matrix included | Yes | `PASS/FAIL` |
| Route/component/API/schema/test inventory included | Yes | `PASS/FAIL` |
| P0 positive tests reported | Yes | `PASS/FAIL/PARTIAL` |
| P0 negative tests reported | Yes | `PASS/FAIL/PARTIAL` |
| True-UX/IA evidence reported | Yes | `PASS/FAIL/PARTIAL` |
| No-generation confirmation included | Yes | `PASS/FAIL` |
| P1/HOLD/reference preservation included | Yes | `PASS/FAIL` |
| Failed/skipped tests visible | Yes | `PASS/FAIL` |
| No source-of-truth overwrite | Yes | `PASS/FAIL` |
| Next-release carry-forward included | Yes | `PASS/FAIL` |
| ENGINE proof included | Yes | `PASS/FAIL` |

---

## 22. ENGINE Execution Proof

| Phase | Engine | How it was used | Output in this artefact |
|---|---|---|---|
| KB / UX / IA discovery | ENGINE_v3 | Extracted UI/UX/IA proof risks: visual-only, route-catalog, long pages, sparse pages, no-overclaim, client-safe, audit/export confusion | KB Evidence Intake; UI/UX/IA Problem Mapping |
| Source-of-truth control | ENGINE_v2 | Locked `full-workflow` as target, `main` as false-gap, Markdown as control evidence, code/tests as implementation evidence | Source-of-Truth Lock; Stop Rules |
| Task operationalization | ENGINE_v2 | Converted WP-16 into concrete Codex subtasks, affected files, acceptance criteria and validation commands | Detailed Implementation Task Breakdown |
| Safety contradiction control | ENGINE_v3 + ENGINE_v2 | Preserved boundaries: upload not sufficiency, advisor not release, compliance not client acceptance, audit display not persistence, export preview not approval | Safety sections; Negative Acceptance Criteria |
| Codex convergence | Codex-Spark-like | Removed broad strategy alternatives and produced a direct execution-ready closeout task | Codex Execution Notes; QA Matrix |
| Final QA | ENGINE_v2 | Ensured no implementation, no screen generation, no false pass claims, no P1/HOLD promotion and no source mixing | QA Matrix and Stop Rules |

**Final WP-16 readiness decision:** `READY_FOR_CODEX_TO_IMPLEMENT_AS_RELEASE_EVIDENCE_CLOSEOUT_AFTER_WP00_TO_WP15_IMPLEMENTATION`.
