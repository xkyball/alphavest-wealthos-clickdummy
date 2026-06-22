# MVP_SCOPE_LOCK.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


## 1. Executive Decision

**MVP boundary status:** `MVP_SCOPE_LOCK_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

AlphaVest WealthOS MVP is locked as a **digital, human-backed, evidence-backed Family Office workflow platform**. The MVP is not a production-grade autonomous advisory engine. The MVP must prove the controlled journey from internal signal/draft preparation through human review, advisor approval, compliance release, evidence/audit traceability and fail-closed client visibility.

**Codex readiness status:** `CODEX_HANDOFF_NOT_READY`

Codex may not start. The v0.8 roadmap keeps final Codex handoff blocked and defines `MVP_SCOPE_LOCK.md` as the first artefact because all route, screen, safety, API, schema and test decisions depend on the MVP boundary.

**Downstream artefacts may proceed:** yes, but only to the next preparation artefact: `ROUTE_SCOPE_LOCK.md`.

**Still blocked:**

* implementation
* Codex tasks
* final Codex handoff
* screen generation
* state-screen generation
* schema changes
* Prisma migrations
* API implementation
* test implementation
* route-by-route implementation classification
* visual treatment for `064–071`

---

## 2. Source-of-Truth Lock

| Rank | Source | Role | Use Allowed | Use Forbidden |
|---:|---|---|---|---|
| 1 | `ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md` | Controlling roadmap and artefact sequence | Controls order, gate logic and `CODEX_HANDOFF_NOT_READY` | Do not bypass sequence |
| 2 | `ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md` | Latest KB layer | Controls schema/domain/patch interpretation | Do not treat schema gate as passed |
| 3 | `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` | Interaction reality layer | Distinguishes real, partial, deterministic and static interactions | Do not treat visible UI as behaviour proof |
| 4 | `ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md` | Route/visual/state layer | Controls 71 routes, 63 clean PNGs and unresolved `064–071` | Do not generate screens |
| 5 | `ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md` | Readiness layer | Confirms Codex not ready and open gates | Do not overclaim readiness |
| 6 | `ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md` | False-gap cleanup | Blocks `main`-based absence claims | Do not derive target tasks from `main` |
| 7 | `ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md` | Validated code inventory | Confirms 405 files, 71 routes, 4 APIs, 42 models, 10 specs, 63 PNGs | Do not treat inventory as MVP readiness proof |
| 8 | `ALPHAVEST_LIVING_KNOWLEDGE_BASE.md` | Recovery/versioning protocol | Keeps update discipline and source hierarchy | Do not let v0.1 override v0.2–v0.8 |
| 9 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | Control Spec | Use for advice boundary, RBAC, visibility, workflow, acceptance gates | Do not replace full-workflow code/schema |
| 10 | `local repository checkout / pull of target branch full-workflow` | Primary target codebase | Only valid target implementation baseline | Do not assume complete readiness |
| 11 | `main branch as false-gap / historical only; never target truth` | False-gap source only | Historical comparison only | Never target truth |

`full-workflow` is target truth. `main` is false-gap only. The MVP patch is Control Spec only. v0.7 is the latest KB layer. v0.8 controls roadmap order.

---

## 3. Roadmap Position

| Field | Value |
|---|---|
| Artefact | `MVP_SCOPE_LOCK.md` |
| Position | 1 of 15 |
| Predecessor artefacts | None |
| Successor artefact | `ROUTE_SCOPE_LOCK.md` |
| Purpose | Lock MVP vs demo vs future product scope |
| Reason this comes first | Route, screen, safety and test decisions depend on MVP boundary |

Downstream artefacts remain blocked until this scope lock exists. The next artefact may classify all 71 registered routes, but this artefact does not do that route-by-route classification.

---

## 4. Input Artefacts

| Input | Role | Use Allowed | Use Forbidden |
|---|---|---|---|
| `ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP_v0.8.md` | Roadmap control | Sequence, gates, required artefacts | Starting Codex early |
| `ALPHAVEST_FULL_WORKFLOW_SCHEMA_DOMAIN_PATCH_RECONCILIATION_v0.7.md` | Latest KB | Schema/domain scope signals | Field-level schema decisions here |
| `ALPHAVEST_FULL_WORKFLOW_INTERACTION_REALITY_AUDIT_v0.6.md` | Interaction truth | Interaction labels and overclaim protection | Treating partial/static UI as real behaviour |
| `ALPHAVEST_FULL_WORKFLOW_ROUTE_VISUAL_STATE_RECONCILIATION_v0.5.md` | Route/visual state truth | 71 route universe, unresolved `064–071` | Full route scope lock here |
| `ALPHAVEST_FULL_WORKFLOW_READINESS_KNOWLEDGE_BASE_REBASE_v0.4.md` | Readiness truth | Codex-not-ready, open decisions | Declaring final readiness |
| `ALPHAVEST_MAIN_BASED_FALSE_GAP_CLEANUP_v0.3.md` | False-gap truth | Blocks `main` contamination | Target truth from `main` |
| `ALPHAVEST_FULL_WORKFLOW_SOURCE_OF_TRUTH_INVENTORY_v0.2.md` | Code inventory | Presence facts | Readiness proof |
| `ALPHAVEST_LIVING_KNOWLEDGE_BASE.md` | KB protocol | Versioning and recovery structure | Overriding newer layers |
| MVP patch zip | Control Spec | Product/control rules | Direct code/schema replacement |
| `full-workflow` zip | Target baseline | Later file/route/component/API/schema/test references | Treating all presence as complete |
| `main` zip | False-gap source | Historical warning only | Any target task or target gap |

---

## 5. Current Evidence Baseline

| Evidence Area | Current Fact | Scope Meaning | What It Does Not Prove |
|---|---|---|---|
| Product | AlphaVest is a digital, human-backed Family Office platform | Stable product framing | Code readiness |
| MVP control | No unapproved advice, internal-only AI draft, fail-closed visibility and separated gates are preserved control rules | These are P0 MVP safety rules | That current code proves them end-to-end |
| Target codebase | `full-workflow` is the target | All future implementation references must use it | That everything in it is MVP-ready |
| Wrong codebase | `main` is false-gap only | No target decisions from `main` | Any target gap |
| Routes | 71 registered routes exist | Route universe for next artefact | All 71 are MVP |
| Visual assets | 63 clean PNGs exist for `001–063` | Valid visual baseline subset | Complete visual coverage or behaviour |
| `064–071` | Registered but missing/non-public visual refs | Scope/visual decision needed later | Immediate generation |
| APIs | 4 API routes exist | API absence claims are false | API safety contracts |
| Prisma | 42 models and 22 enums exist | Full schema remains baseline | Field-level MVP readiness |
| Tests | 10 specs exist | Useful proof slices | Complete P0 coverage |
| Interaction | Document upload is strongest implemented product interaction | Upload mechanics are real | Evidence sufficiency or release unlock |
| Interaction | Many actions are partial demo/visual/static | Behaviour contracts needed later | Real MVP workflow completeness |
| Codex | Final handoff not ready | Preparation sequence required | Codex may start |

The current reality snapshot keeps Codex blocked because scope, route classification, visual treatment, state screens, interaction lifecycles, safety contracts, API contracts, schema fields and negative tests remain unresolved.

---

## 6. MVP Product Boundary

| Capability / Product Area | Scope Label | Rationale | Safety Relevance | Route-Scope Dependency | Later Artefact Dependency |
|---|---|---|---|---|---|
| Human-backed advisory workflow | `MVP_CORE` | Core AlphaVest promise: digital first, human reviewed, evidence backed | `SAFETY_CRITICAL` | Advisory workflow routes | RBAC, advice boundary, tests |
| Internal AI/rules draft support | `MVP_CORE` | Allowed only as internal preparation | `SAFETY_CRITICAL` | Workbench / recommendation routes | Visibility, API, schema, tests |
| Advisor approval | `MVP_CORE` | Human judgement gate before client release | `SAFETY_CRITICAL` | Advisor routes | Safety contract, P0 tests |
| Compliance review / release / block | `MVP_CORE` | Required release gate | `SAFETY_CRITICAL` | Compliance routes | Evidence/audit/export contracts |
| Client visibility | `MVP_CORE` | Must be derived, redacted and fail-closed | `SAFETY_CRITICAL` | Client portal/mobile/export | RBAC/advice boundary |
| Decision record | `MVP_CORE` | Captures approved/released outcome | `SAFETY_CRITICAL` | Decision routes | Audit/evidence/test mapping |
| Evidence vault concept | `MVP_CORE` | Required for proof readiness | `SAFETY_CRITICAL` | Evidence/document routes | Evidence sufficiency contract |
| Document upload mechanics | `MVP_CORE` | Strongest implemented product interaction; needed for evidence story | `SAFETY_CRITICAL` | Document routes | Evidence sufficiency tests |
| Extraction/review of documents | `MVP_CORE` | Supports evidence qualification | `SAFETY_CRITICAL` | Document review routes | Feedback/evidence contract |
| Audit trail for gate actions | `MVP_CORE` | Required proof spine | `SAFETY_CRITICAL` | Audit/governance routes | Audit contract and tests |
| RBAC / governance baseline | `MVP_CORE` | Prevents unauthorized access and admin bypass | `SAFETY_CRITICAL` | Admin/governance routes | RBAC contract |
| Export/redaction for client-safe package | `MVP_CORE` | Required if MVP demonstrates released evidence/decision package | `SAFETY_CRITICAL` | Export routes | Export safety/API/test contracts |
| Tenant/admin setup | `MVP_SUPPORT` | Needed to frame controlled demo/product context | Medium | Admin/tenant routes | Route scope lock |
| Auth/MFA/onboarding shell | `MVP_SUPPORT` | Supports role and access story, not production auth | Medium | Access routes | Feedback/state specs |
| Client profile baseline | `MVP_SUPPORT` | Supports client context for workflow | Medium | Client routes | Route scope lock |
| Family members / relationships | `MVP_SUPPORT` | Contextual support only, not full family office graph | Low/medium | Client context routes | Route scope lock |
| Entities / wealth map | `MVP_SUPPORT` | Useful context; full graph/product breadth not MVP | Medium | Entity/wealth routes | Route and interaction contracts |
| Action board | `MVP_SUPPORT` | Supports internal execution context | Medium | Action routes | Interaction contract |
| Communication centre | `P1_AFTER_MVP` | Useful but not core to no-unapproved-advice MVP proof | Medium | Communication routes | Later route scope |
| Operations queues / SLA | `P1_AFTER_MVP` | Operational maturity layer | Low/medium | Ops routes | Later task master only |
| Review rhythm / review monitoring | `P1_AFTER_MVP` | Valuable service rhythm; not required for initial MVP proof unless route scope elevates it | Medium/high if advisory triggers | Review routes | Route scope + safety contract |
| KYC / AML | `HOLD_PENDING_DECISION` | Routes exist but assets/scope/safety unresolved | Potential P0 if included | `064–065` | Route scope, visual matrix, safety |
| Source-of-wealth review | `HOLD_PENDING_DECISION` | Same KYC/AML dependency | Potential P0 if included | `065` | Route scope, safety |
| Suitability profile | `HOLD_PENDING_DECISION` | Financial advice risk if included | Potential P0 | `066` | Route scope, advice boundary |
| IPS / mandate | `HOLD_PENDING_DECISION` | Advice boundary sensitive | Potential P0 | `067` | Route scope, advice boundary |
| Rebalance monitoring | `HOLD_PENDING_DECISION` | Could imply advice execution | Potential P0 | `069` | Route scope, no-auto-advice proof |
| Committee review | `HOLD_PENDING_DECISION` | Routes/components/tests exist but actions/static and visuals unresolved | P0 if MVP | `070–071` | Route scope, visual, safety |
| Service blueprint / roadmap / states reference pages | `DEMO_REFERENCE_ONLY` | Useful reference/demo pages, not product capability | Low | Reference routes | Route scope lock |
| Fully automated advice | `NON_GOAL` | Violates human-reviewed model | P0 risk | None | Non-goal |
| Production banking/custody/live integrations | `FUTURE_STATE` | Not needed for clickdummy-to-Codex MVP | High if implied | None | Future roadmap |
| Real client pilot | `FUTURE_STATE` | Not required for implementation handoff | High | None | Future roadmap |

---

## 7. MVP Core Scope

The MVP core is the minimum controlled workflow that proves AlphaVest’s product promise without overclaiming production readiness.

| MVP Core Area | Required MVP Meaning | Boundary |
|---|---|---|
| Human-backed workflow | Signals/drafts become reviewed, approved and compliance-gated decisions | No autonomous final advice |
| Internal AI/rules draft | AI/rules may assist internal preparation | Never client-visible before approval/release |
| Advisor approval | Human advisor gate before compliance release | Must remain separate from compliance |
| Compliance review/release/block | Compliance decides release, block or evidence request | No manual override by admin |
| Client visibility | Client sees only released, redacted, client-safe information | Fail-closed by default |
| Decision record | Captures decision outcome and rationale | Must not expose internal drafts |
| Evidence vault | Supports proof and audit story | Upload alone is not sufficiency |
| Document upload/extraction review | Intake and review source materials | Upload mechanics do not unlock advice/release |
| Audit trail | Gate actions require audit events | Visual audit rows alone are not persistence proof |
| RBAC/governance | Route/action/payload permission model is MVP-critical | Navigation-only RBAC is insufficient |
| Export/redaction | MVP may include client-safe decision/evidence pack export | No export without redaction and approval proof |

---

## 8. MVP Support Scope

| Support Area | MVP Support Decision | Limit |
|---|---|---|
| Tenant/admin setup | `MVP_SUPPORT` | Needed as controlled setup context, not full platform admin product |
| User onboarding/MFA | `MVP_SUPPORT` | Demo/auth flow only; production-grade identity is future |
| Client profile | `MVP_SUPPORT` | Context baseline only |
| Family members | `MVP_SUPPORT` | Minimal context; no full family governance graph |
| Relationships | `MVP_SUPPORT` | Context only unless route scope later elevates |
| Entities | `MVP_SUPPORT` | Supports client structure; not full wealth entity management |
| Wealth map | `MVP_SUPPORT` | Visual/context support; not full live wealth engine |
| Action board | `MVP_SUPPORT` | Internal workflow support; not full task management product |
| Communication centre | `P1_AFTER_MVP` | Do not include full messaging workflow in MVP |
| Operations queues / SLA | `P1_AFTER_MVP` | Operational layer after MVP proof |
| Review monitoring | `P1_AFTER_MVP` by default | May become P0 only if route scope ties it to advice/release safety |
| Reference pages | `DEMO_REFERENCE_ONLY` | Not MVP product surfaces |

---

## 9. P1 / Future / Hold Scope

| Area | Scope Label | Decision |
|---|---|---|
| KYC / AML | `HOLD_PENDING_DECISION` | Hold until route scope and safety contract decide whether KYC is MVP, P1 or future. Routes exist but assets/scope/safety are unresolved. |
| Source-of-wealth review | `HOLD_PENDING_DECISION` | Same as KYC/AML; do not treat as MVP yet. |
| Suitability profile | `HOLD_PENDING_DECISION` | Potentially advice-sensitive; hold until safety contract. |
| IPS / mandate | `HOLD_PENDING_DECISION` | Potentially advice-sensitive; hold until route and advice-boundary contract. |
| Review calendar | `P1_AFTER_MVP` by default | Useful review-rhythm feature, not first MVP core unless elevated later. |
| Rebalance monitoring | `HOLD_PENDING_DECISION` | Could imply advice execution; must not be MVP without no-auto-release proof. |
| Committee review | `HOLD_PENDING_DECISION` | Routes/components/tests exist, but route actions are static and visuals unresolved; do not discard or overbuild. |
| Full communication workflow | `P1_AFTER_MVP` | Not required for initial MVP proof. |
| Operations queues / SLA | `P1_AFTER_MVP` | Operational maturity layer. |
| Live banking/custody integrations | `FUTURE_STATE` | Not MVP. |
| Production-grade AI advice | `NON_GOAL` | Violates MVP control boundary. |
| Real client pilot | `FUTURE_STATE` | Outside implementation-readiness handoff. |
| Production identity/auth beyond clickdummy scope | `FUTURE_STATE` | Auth shell may support MVP, but production IAM is not MVP scope. |

Routes `064–071` remain special hold candidates because v0.5 identifies them as registered routes with missing/non-public visual references and no generation allowed yet.

---

## 10. Non-Goals

| Non-Goal | Why Excluded | Risk If Included Too Early | Later Revisit Condition |
|---|---|---|---|
| Fully automated advice engine | AlphaVest is human-backed | Regulatory/product boundary failure | Separate future strategy |
| Client-visible AI draft | AI/rules draft is internal-only | Advice leakage | Only after explicit approved/redacted release model |
| Manual client visibility override | Visibility must be derived/fail-closed | Admin or advisor leakage | Never unless control spec changes |
| Admin bypass of release/compliance/advice gates | Admin cannot override safety gates | P0 control failure | Never for MVP |
| Upload-to-release shortcut | Upload is not evidence sufficiency | False evidence proof | Only after evidence sufficiency contract and tests |
| Blind schema replacement | Full schema remains target baseline | Schema regression | Field-level reconciliation only |
| Implementation from `main` | `main` is false-gap source | Wrong codebase tasks | Never |
| Premature screen generation | Scope/visual/state not locked | Wrong or wasted screens | Only through `SCREEN_GENERATION_BRIEF_IF_NEEDED.md` |
| Codex task creation before gates pass | Codex would infer product/safety decisions | Bad implementation handoff | Only after all prior artefacts |
| Production live integrations | Not needed for MVP proof | Scope explosion | Future roadmap |
| Real client pilot | Not implementation-readiness requirement | Compliance/business risk | Later pilot planning |
| Production-grade auth/IAM | Clickdummy MVP does not need it | Overbuild | Later hardening |

---

## 11. Safety-Critical P0 Scope

| P0 Safety Rule | MVP Scope Decision | Why P0 | Required Later Contract | Required Later Test Proof |
|---|---|---|---|---|
| No unapproved advice reaches client | `MVP_CORE` | Central product safety rule | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Leakage negative tests |
| AI draft internal-only | `MVP_CORE` | Prevents draft/advice leakage | Visibility/API/export redaction contract | Client payload/export negative tests |
| Fail-closed client visibility | `MVP_CORE` | Client must see only released safe data | Visibility contract | Hidden-by-default tests |
| Advisor approval separate from compliance | `MVP_CORE` | Prevents collapsed gate logic | Advice-boundary contract | Bypass negative tests |
| Admin non-bypass | `MVP_CORE` | Admin must not override advice/compliance/release | RBAC contract | Admin bypass negative tests |
| Evidence sufficiency not equal upload | `MVP_CORE` | Upload alone cannot unlock release | Evidence/audit/export safety contract | Upload-does-not-unlock-release test |
| Audit persistence for gate actions | `MVP_CORE` | Required proof spine | Audit event matrix | Gate-action audit tests |
| Export redaction / approval | `MVP_CORE` for client-safe export subset | Prevents data leakage | Export safety contract | Internal draft/redaction tests |
| Route/action/payload RBAC | `MVP_CORE` | Navigation-only RBAC insufficient | RBAC contract | Field/payload denial tests |
| Client-safe released information only | `MVP_CORE` | Core trust boundary | Visibility + API + export contracts | Client route/API/export leakage tests |

These rules survive the false-gap cleanup as MVP-control truths and must be validated later; they are not automatically proven by existing code presence.

---

## 12. Artefact-Specific Decisions

| Decision ID | Decision | Scope Label | Evidence Basis | Downstream Impact |
|---|---|---|---|---|
| MVP-SCOPE-001 | MVP is a controlled human-backed advice workflow, not autonomous advice | `MVP_CORE` / `NON_GOAL` | Product/control truth and roadmap | Routes must support human review gates |
| MVP-SCOPE-002 | Internal AI/rules drafts are in MVP only as internal preparation | `MVP_CORE` | Control Spec + v0.3 preserved rule | Visibility/redaction contract required |
| MVP-SCOPE-003 | Advisor approval and compliance release are both core and separate | `MVP_CORE` | Preserved control rule | Workflow/advice-boundary contract required |
| MVP-SCOPE-004 | Client visibility is core, derived and fail-closed | `MVP_CORE` | Preserved control rule | RBAC/client visibility contract required |
| MVP-SCOPE-005 | Evidence/document intake is MVP core, but upload is not sufficiency | `MVP_CORE` | v0.6 upload reality + control rule | Evidence contract and negative tests required |
| MVP-SCOPE-006 | Audit trail is MVP core for gate actions | `MVP_CORE` | Control rule and schema reality | Audit matrix required |
| MVP-SCOPE-007 | Export/redaction is MVP core only as safe decision/evidence package export | `MVP_CORE` | v0.8 safety plan | Export contract required |
| MVP-SCOPE-008 | Tenant/admin/auth/client context are support scope | `MVP_SUPPORT` | Route reality and product setup need | Route scope may classify them as MVP/support routes |
| MVP-SCOPE-009 | Family/entity/wealth/action context is support, not full product breadth | `MVP_SUPPORT` | Product-scope restraint | Prevents overbuilding |
| MVP-SCOPE-010 | Communication/ops/review rhythm default to P1 unless safety route scope elevates | `P1_AFTER_MVP` | Roadmap and gate dependencies | Route scope must decide affected routes |
| MVP-SCOPE-011 | KYC/AML, source-of-wealth, suitability, IPS, rebalance and committee review are held | `HOLD_PENDING_DECISION` | v0.5/v0.6/v0.7 unresolved scope/safety/visual facts | Route scope + safety contracts must decide |
| MVP-SCOPE-012 | Reference pages remain demo/reference only | `DEMO_REFERENCE_ONLY` | v0.8 route/visual plan | Route scope can mark reference-only routes |
| MVP-SCOPE-013 | `main` cannot define MVP target scope | `NON_GOAL` / stop rule | v0.3 false-gap cleanup | No route/task from `main` |
| MVP-SCOPE-014 | Codex cannot start after this artefact | `BLOCKED_FOR_CODEX` | v0.8 handoff gate | Continue to `ROUTE_SCOPE_LOCK.md` |

---

## 13. Artefact-Specific Non-Decisions

| Non-Decision ID | Deferred Decision | Belongs To Artefact | Reason Deferred | Stop Rule Until Then |
|---|---|---|---|---|
| ND-001 | Final 71-route classification | `ROUTE_SCOPE_LOCK.md` | Product boundary first, route detail second | No route-by-route implementation classification |
| ND-002 | Visual asset treatment for `064–071` | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` | Scope and visual matrix required | No generation |
| ND-003 | Missing screens and state screens | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` | Route/visual scope must come first | No screen/state generation |
| ND-004 | Route-level loading/error/empty/blocked/success states | `STATE_SCREEN_SPEC.md` | Requires route scope and missing-state decision | No state implementation |
| ND-005 | Drawer/modal/confirmation lifecycle | `DRAWER_MODAL_INTERACTION_CONTRACT.md` | v0.6 shows partial/static/deterministic states | No component implementation |
| ND-006 | Feedback/error semantics | `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Requires interaction contract | No feedback implementation |
| ND-007 | RBAC/client visibility/advice-boundary details | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Safety contract requires route/schema/API context | No safety implementation |
| ND-008 | Evidence/audit/export details | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Requires safety contract and schema/API context | No export/evidence implementation |
| ND-009 | API request/response contracts | `API_CONTRACT_MATRIX.md` | Safety and feedback contracts must precede | No API implementation |
| ND-010 | Schema field-level decisions | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | v0.7 is model-level/partial, not field-level | No schema changes |
| ND-011 | P0 test acceptance mapping | `P0_TEST_ACCEPTANCE_MATRIX.md` | Contracts must exist first | No test tasks |
| ND-012 | Screen-generation brief | `SCREEN_GENERATION_BRIEF_IF_NEEDED.md` | Only if prior decisions require generation | No image generation |
| ND-013 | Final Codex task grouping | `FINAL_CODEX_TASK_MASTER.md` | Gates and contracts not passed | No Codex tasks |
| ND-014 | Final implementation handoff | `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md` | Codex not ready | No final handoff |

---

## 14. Gap / Risk / Blocker Matrix

| Gap / Risk / Blocker | Severity | Why It Matters | Scope Decision | Routed To |
|---|---:|---|---|---|
| Route presence mistaken as MVP scope | High | 71 routes exist but not all are MVP | Use route universe only as next input | `ROUTE_SCOPE_LOCK.md` |
| 63 PNGs mistaken as complete coverage | High | Assets cover `001–063`, not all routes | Visual subset only | `ROUTE_SCREEN_VISUAL_ASSET_MATRIX.md` |
| `064–071` prematurely generated | High | Scope/visual/safety unresolved | Hold; no generation | `MISSING_SCREEN_STATE_SCREEN_DECISION_LOG.md` |
| Drawer/modal visual state mistaken as interaction | High | Could create shallow UI | Contract needed later | `DRAWER_MODAL_INTERACTION_CONTRACT.md` |
| Document upload mistaken as evidence sufficiency | High | Upload may wrongly unlock release | Upload core, sufficiency not proven | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` |
| Existing tests mistaken as full P0 proof | High | Safety gaps hidden | Tests are proof slices only | `P0_TEST_ACCEPTANCE_MATRIX.md` |
| Patch schema replacing full schema | High | Would corrupt target baseline | Patch is Control Spec only | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` |
| `main` false gaps leaking into tasks | High | Wrong target assumptions | `main` blocked | All artefacts |
| Codex starting too early | High | Codex would make product/scope/safety decisions | Codex blocked | `FINAL_CODEX_TASK_MASTER.md` / final handoff |
| Committee review discarded or overbuilt | Medium/high | It exists but is unresolved | Hold pending decision | Route scope + safety |
| KYC/Suitability/IPS overclaimed | Medium/high | Advice/safety risk | Hold pending decision | Route scope + safety |
| Export/redaction under-specified | High | Client leakage risk | MVP core subset only | Export/API/test contracts |

---

## 15. Acceptance Criteria

| Criterion | Status |
|---|---|
| MVP, P1, future, demo/reference and non-goal boundaries are explicit | `PASS` |
| Ambiguous areas are classified or held with reason | `PASS` |
| Safety-critical MVP scope is explicit | `PASS` |
| No route-by-route implementation classification is performed | `PASS` |
| No implementation is created | `PASS` |
| No Codex task is created | `PASS` |
| No schema change or migration is created | `PASS` |
| No screen/state-screen/image generation is created | `PASS` |
| `full-workflow` remains target truth | `PASS` |
| `main` remains false-gap only | `PASS` |
| MVP patch remains Control Spec only | `PASS` |
| Presence evidence is not overclaimed as readiness proof | `PASS` |
| `ROUTE_SCOPE_LOCK.md` has enough product-scope input to classify all 71 routes | `PASS` |

---

## 16. Stop Rules

The following remain forbidden:

* no implementation
* no Codex task
* no final Codex handoff
* no code change
* no schema change
* no migration
* no API implementation
* no test implementation
* no screen generation
* no state-screen generation
* no image generation
* no route-by-route implementation classification
* no visual treatment decision for `064–071`
* no `main` target truth
* no patch-schema replacement
* no claim that a route is MVP because it exists
* no claim that a PNG proves behaviour
* no claim that a drawer/modal primitive proves route-level lifecycle
* no claim that document upload proves evidence sufficiency
* no claim that existing tests prove full P0 safety
* no client-visible AI draft
* no manual visibility override
* no admin bypass
* no upload-to-release shortcut
* no export without redaction/approval proof

---

## 17. Next Artefact Dependency

Next artefact:

`ROUTE_SCOPE_LOCK.md`

`ROUTE_SCOPE_LOCK.md` may proceed because the product-scope boundary is now locked.

It must classify all 71 registered routes as:

* `MVP`
* `DEMO_ONLY`
* `FUTURE`
* `HOLD`
* `REFERENCE_ONLY`

It must not generate visuals, implement code, create Codex tasks or solve safety/API/schema/test contracts.

The route scope lock must use this artefact’s product decisions to determine which registered routes serve the MVP core, which support context, which are P1/future, which are reference-only and which remain hold candidates.

---

## 18. Proof

### Phase 1 — ENGINE_v3 Source-of-Truth Lock

Passed. The source hierarchy was applied with v0.8 as roadmap control and v0.7 as latest KB layer. `full-workflow` remains the only target baseline, `main` remains false-gap only, and the MVP patch remains Control Spec only.

### Phase 2 — ENGINE_v3 Evidence Discipline

Passed. Evidence was separated from readiness. 71 routes, 63 PNGs, 4 APIs, Prisma schema, tests, document upload mechanics and UI primitives were treated as presence or partial evidence, not proof of MVP readiness.

### Phase 3 — ENGINE_v3 Contradiction Control

Passed. The artefact blocks both wrong conclusions: `main`-based false gaps and `full-workflow` overcompletion.

### Phase 4 — ENGINE_v2 Map-vs-Reality Reframing

Passed. Product scope, code reality, visual evidence, interaction reality, schema reality and test reality are separated.

### Phase 5 — ENGINE_v2 Scope / Sequence Logic

Passed. This artefact made only product-scope decisions. It did not classify all 71 routes, decide visual assets, specify state screens, define interaction lifecycles, write API contracts, decide schema fields, map tests, create Codex tasks or produce a final handoff.

### Phase 6 — ENGINE_v2 Psycho-Logic / Decision Friction Control

Passed. The artefact reduces ambiguity before Codex receives any work. It prevents the common pressure failure modes: overbuilding future routes, generating missing screens too early, treating visuals as real behaviour, treating upload as evidence sufficiency, treating tests as full P0 proof or treating Codex as a product-decider.

### Phase 7 — ENGINE_v2-B Handoff Discipline

Passed. Implementation-relevant references were preserved at the correct abstraction level: routes, APIs, Prisma, tests, visual assets, interaction states, safety gates and downstream artefacts are identified, but no implementation task was created.

### Phase 8 — ENGINE_v3 Safety / Adversarial QA

Passed. P0 safety rules were explicitly locked into MVP scope: no unapproved advice, internal-only AI draft, fail-closed client visibility, advisor/compliance separation, admin non-bypass, evidence sufficiency, audit persistence, export redaction and route/action/payload RBAC. These remain contract/test obligations, not assumed proof.

### Phase 9 — ENGINE_v2 Compression / Operational Layer

Passed. The artefact is compact enough to feed directly into `ROUTE_SCOPE_LOCK.md` while preserving the required stop rules and downstream dependencies.

### Final Proof Decision

`MVP_SCOPE_LOCK_ACCEPTED_WITH_DOWNSTREAM_DEPENDENCIES`

`MVP_SCOPE_LOCK.md` is accepted as the first preparation artefact. It creates no implementation, no Codex task, no screen, no schema change, no migration and no final handoff.
