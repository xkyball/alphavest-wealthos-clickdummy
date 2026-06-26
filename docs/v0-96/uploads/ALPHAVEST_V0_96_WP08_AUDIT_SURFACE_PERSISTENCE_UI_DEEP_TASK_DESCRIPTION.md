# ALPHAVEST_V0_96_WP08_AUDIT_SURFACE_PERSISTENCE_UI_DEEP_TASK_DESCRIPTION.md

**Generated:** 2026-06-23  
**Prompt executed:** Prompt 09 — WP-08 Deep Task Description  
**Work Package:** `WP-08 — Audit Surface + Persistence UI`  
**Mode:** Deep Codex-ready task-description artefact only. No implementation. No code changes. No screen generation. No image generation. No Codex tickets created.  
**ENGINE mix:** ENGINE_v3 for KB/UX/IA discovery and contradiction control; ENGINE_v2 for operational tasking, gates, acceptance, tests and stop rules; Codex-Spark-like convergence for implementation-specific instructions.

---

## 1. Executive Task Decision

**Decision:** `WP08_AUDIT_SURFACE_PERSISTENCE_UI_DEEP_TASK_READY_FOR_CODEX_DESCRIPTION_USE`

This artefact defines a detailed Codex-ready task description for **WP-08 — Audit Surface + Persistence UI**.

The task is to make AlphaVest audit UI truthful and safety-relevant:

> Audit rows, timelines and history surfaces must be backed by persisted audit events or explicitly shown as unavailable / pending / display-only. A visible audit timeline must never be treated as audit proof.

This WP is part of the V0.96 Core Journey + UX/IA Refactor release. It supports all safety-critical journey gates, especially:

- Evidence accepted / rejected / insufficient
- Analyst draft rejection / rebuild / handoff
- Advisor approve / reject / request changes
- Compliance block / request evidence / release
- Admin / governance permission changes and denied bypass attempts
- Client-safe visibility projection
- Export scope / redaction / approval / download-manifest actions

The key implementation posture is:

```text
Audit display is not audit persistence.
Audit persistence is required for critical gate actions.
If required audit persistence fails, the safety action must fail closed or remain pending.
```

This WP does **not** authorize a broad audit product build, external compliance module, immutable ledger, blockchain-style proof layer, or new visual assets. It authorizes Codex to harden existing audit surfaces, services, state feedback, API/service integration and tests inside the V0.96 journey path.

---

## 2. Source-of-Truth Lock

| Rank | Source | Trust Level | Allowed Use | Forbidden Use |
|---:|---|---|---|---|
| 1 | Current `full-workflow` repo / checkout | Highest code truth after WP-00 rebase | Target files, services, APIs, components, tests and schema reality | Assuming older KB counts are current |
| 2 | `ALPHAVEST_V0_96_UX_IA_KB_EVIDENCE_AND_WP_INDEX.md` | Binding prompt-00 UX/IA intake | UI/UX/IA evidence register and WP mapping | Treating evidence register as implemented code |
| 3 | `ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_DETAILED_TASK_DESCRIPTIONS.md` | Binding WP source | WP-08 purpose, route surfaces, expected tasks, stop rules | Treating source WP as implementation proof |
| 4 | `EVIDENCE_AUDIT_EXPORT_SAFETY_CONTRACT.md` | Binding safety contract | Audit persistence rules, audit unavailable fail-closed, export/evidence audit expectations | Weakening audit requirements for UX convenience |
| 5 | `RBAC_CLIENT_VISIBILITY_ADVICE_BOUNDARY_CONTRACT.md` | Binding P0 safety contract | Route/action/object/payload separation, admin non-bypass, AI Draft internal-only | Treating route access as audit/detail payload authority |
| 6 | `DRAWER_MODAL_INTERACTION_CONTRACT.md` and `FEEDBACK_VALIDATION_ERROR_STATE_CONTRACT.md` | Binding interaction/copy contracts | Modal lifecycle, no-overclaim feedback, blocked/error states | Treating visible modals/buttons/status chips as proof |
| 7 | `STATE_SCREEN_SPEC.md` | Binding state contract | Audit unavailable, blocked, denied, loading, error and success states | Generating state-screen images |
| 8 | `API_CONTRACT_MATRIX.md` | Binding API contract | API route presence is not safety proof; validate request/response/error/audit obligations | Creating API sprawl without WP-00 proof |
| 9 | `SCHEMA_FIELD_LEVEL_RECONCILIATION.md` | Binding schema contract | Full-workflow schema baseline, `AuditEvent` usage, no blind schema replacement | Replacing Prisma schema with patch model |
| 10 | `P0_TEST_ACCEPTANCE_MATRIX.md` | Binding acceptance contract | Existing audit tests are proof slices only; missing audit-failure negatives are blockers | Claiming current tests close P0 audit gate |
| 11 | `ALPHAVEST_MEGA_JOURNEY_PRIORITY_LOCK.md` and `ALPHAVEST_MVP_JOURNEY_REQUIREMENTS_MATRIX.md` | Journey/product control | MJ-006, MJ-010 and audit proof spine | Pulling P1/HOLD journeys into WP-08 |
| 12 | `main` / `alphavest-wealthos-clickdummy-main.zip` | False-gap only | Historical warning | Any target implementation task |

**Hard lock:** `full-workflow` remains the implementation baseline. `main` remains false-gap only. Markdown artefacts are control evidence, not code truth. Codex must re-check code reality in WP-00 before applying this WP.

---

## 3. KB Evidence Intake for this WP

| Evidence Item | Source Artefact | Route / Component / WP | Problem Type | Severity | Task Implication | Must Refactor Now? |
|---|---|---|---|---|---|---|
| Visible audit timeline is not persistence proof. | Interaction Reality Audit + Evidence/Audit/Export Safety Contract | `AuditTimeline`, compliance audit, governance audit, decision audit | Audit truth / overclaim | Critical | Bind audit UI to persisted/source-backed events; label display-only rows if any remain. | Yes |
| Critical gate actions require stored audit events. | Evidence/Audit/Export Safety Contract | Advisor, compliance, evidence, export, governance actions | Safety / traceability | Critical | Ensure gate actions either write audit or fail closed / remain pending. | Yes |
| Audit unavailable must fail closed. | Evidence/Audit/Export Safety Contract + State Screen Spec | Release, block, export, permission changes | State / error semantics | Critical | Add audit unavailable / audit write failed UI and service state. | Yes |
| Audit minimum fields are required. | Evidence/Audit/Export Safety Contract | `AuditEvent`, audit APIs/services | Data quality / evidence | High | Audit rows must include actor, role, tenant, target, action, result, previous/next state, timestamp and reason/context where available. | Yes |
| Client-facing routes must not show internal audit detail. | RBAC/Visibility Contract | `/portal`, `/mobile`, client-safe projection | Client visibility / leakage | Critical | Client pages may show safe status only, not internal audit timeline or compliance notes. | Yes |
| Governance audit must not imply admin can bypass gates. | RBAC/Visibility Contract + Mega Journey `MJ-010` | Governance users/roles/access requests/audit history | Admin non-bypass UX | Critical | Admin UI must show denied bypass and audit-required states without superuser-release impression. | Yes |
| Audit UI can bloat decision/compliance screens. | UX/IA evidence register + V0.96 source | Decision room, compliance detail, governance detail | Layout / density | Medium/High | Use progressive disclosure: summary audit status first, detail drawer/table second. | Yes, where touched |
| Status chips can pretend to be gate proof. | UI/UX/IA register + Feedback Contract | Audit rows, gate statuses, state chips | Visual-only proof | High | Chips must be backed by persisted audit state or marked unavailable/pending. | Yes |
| Existing tests are only proof slices. | P0 Test Acceptance Matrix | audit-related specs | P0 coverage | Critical | Add/update positive audit persistence and negative audit-failure fail-closed tests. | Yes |
| Existing current snapshot may have more audit APIs/tests than older KB. | Prompt-00 evidence register / WP-00 | Current repo reality | Moving baseline | High | Re-check `/api/audit-events`, `lib/audit-service.ts`, audit specs before implementing. | Yes |

---

## 4. Current Code / Route / Component Reality to Recheck

Codex must re-check the actual repo after WP-00. The following files and modules are likely relevant but must be classified before editing.

| Area | Files / Modules to Inspect | Classification Required |
|---|---|---|
| Audit UI primitive | `components/ui/audit-timeline.tsx` | `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING` |
| Decision / evidence / compliance audit surfaces | `components/decisions-governance-screen.tsx`, `components/internal-workflow-screen.tsx`, `components/demo-session-panel.tsx` | Identify static rows vs persisted event source |
| Governance audit surfaces | `components/admin-tenant-setup-screen.tsx`, `components/decisions-governance-screen.tsx`, governance routes `048–051` | Identify role/access/audit-history behaviours |
| Client surfaces | `components/client-intake-screen.tsx`, `/portal`, `/mobile` | Ensure no internal audit detail leaks |
| Audit API | `app/api/audit-events/route.ts` if present, plus any audit endpoints found by `find app/api -type f` | Verify methods, response shape, RBAC, redaction, error semantics |
| Audit services | `lib/audit-service.ts`, `lib/permission-engine.ts`, `lib/typed-workflow-command-bus.ts`, `lib/workflow-gate.ts`, `lib/export-service.ts`, `lib/evidence-service.ts` | Verify write path, failure handling, service usage |
| Schema | `prisma/schema.prisma`, `AuditEvent` model, any audit enum/string taxonomies | Confirm minimum field support; no blind schema replacement |
| Existing tests | `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts`, `tests/permission-engine.spec.ts`, `tests/governance-non-bypass.spec.ts`, `tests/document-upload-api.spec.ts`, `tests/demo-workflow-api.spec.ts` | Reuse/harden existing specs; do not duplicate names blindly |
| UX helpers | `components/ui/state-panel.tsx`, `components/ui/data-table.tsx`, `components/ui/modal.tsx`, `components/ui/drawer.tsx`, `components/ui/guarded-action-button.tsx`, `components/ux-*` if present | Reuse existing helpers for state, table, progressive detail |

**Required classification output:** WP-08 implementation must begin by updating or referencing the WP-00 delta register with:

```text
AUDIT_SERVICE_REALITY
AUDIT_API_REALITY
AUDIT_UI_REALITY
AUDIT_TEST_REALITY
AUDIT_FAILURE_HANDLING_REALITY
CLIENT_AUDIT_REDACTION_REALITY
```

---

## 5. WP Problem Statement

AlphaVest V0.96 needs audit to become a **trust spine**, not a decorative timeline.

Current risk patterns:

1. A timeline can show audit-like rows without proving persistence.
2. UI can imply a gate action succeeded even if audit write failed.
3. Compliance, advisor, evidence, governance and export flows may treat audit as passive display rather than required safety precondition.
4. Client-facing pages may accidentally expose internal audit detail, compliance notes or internal rationale.
5. Audit tables can overload already-long decision and compliance pages.
6. Admin/governance screens can look like broad power panels if denied/bypass attempts and audit-required states are not shown clearly.
7. Existing tests may prove some audit rows but not full P0 audit fail-closed behaviour.

WP-08 resolves this by tasking Codex to implement or harden source-backed audit UI, audit unavailable states, audit persistence requirements and audit-failure negative tests across the V0.96 journey path.

---

## 6. V0.96 Journey Role

| Journey | WP-08 Role |
|---|---|
| `MJ-001 — First client-safe decision` | Provides traceability from internal action through release and client-safe projection. |
| `MJ-002 — Evidence missing to upload to release` | Audits upload, review, sufficiency, evidence request and evidence accepted/rejected decisions. |
| `MJ-003 — AI draft rejected/rebuilt with evidence` | Audits analyst rejection/rebuild/handoff while keeping internal rationale internal-only. |
| `MJ-006 — Cross-tenant access denied with audit proof` | Proves denied access attempts are logged and no payload leaks. |
| `MJ-010 — Admin role change cannot bypass compliance release` | Proves governance changes are audited and admin bypass attempts fail. |
| `MJ-005 — Export package with forbidden payload redaction` | Audits export scope, redaction, approval and download/share manifest steps. |

---

## 7. UI / UX / Layout / IA Problem Mapping

| Problem Family | WP-08 Interpretation | Required UX/IA Refactor |
|---|---|---|
| Audit display vs persistence confusion | Timeline rows can falsely look like proof. | Add source-backed indicators, audit IDs/correlation where safe, and unavailable state if persistence cannot be confirmed. |
| Long decision/compliance pages | Audit details can create scroll bloat. | Use summary audit status inline; place full audit history in progressive detail table/drawer/section. |
| Sparse audit pages | Audit history route may look empty or decorative. | Add meaningful empty state: no events yet, unavailable, permission denied, or filtered no-results. |
| Page job weakness | Audit surfaces must explain why audit matters. | Page header/guidance: “Trace critical gate actions and denied attempts.” |
| Too many CTAs | Audit is mostly view/retry/reload; not multiple destructive actions. | One primary CTA: retry audit load / view event detail / return to gate depending on state. |
| Status chip overclaim | “Audited” chip can imply persistence without source. | Chip only appears when event is persisted/source-backed. Otherwise show `Audit pending` or `Audit unavailable`. |
| Client leakage risk | Audit details may include internal notes, actors or reasons. | Client surfaces show safe status only; internal audit details remain hidden/redacted. |
| Governance superuser illusion | Admin pages can look like all-powerful controls. | Show denied/bypass attempts and audit-required constraints; no “force release” impression. |
| Modal/drawer lifecycle | Audit detail drawer/modal may be visual-only. | If used, specify open/close/loading/error/focus lifecycle; no mutation unless scoped. |

---

## 8. Refactor Scope: What Changes Now vs What Stays Out

### 8.1 Changes Now

| Scope Area | Included in WP-08 |
|---|---|
| Audit source binding | Audit UI consumes persisted/source-backed events from service/API/readmodel. |
| Audit unavailable states | Critical surfaces show audit load/write unavailable and block/hold action where required. |
| Audit-fail-closed behaviour | Release, block, evidence sufficiency, permission change and export approval do not silently succeed if required audit cannot persist. |
| Audit event minimum fields | UI/service/test checks expect actor, role, tenant, target, action, result, prev/next state, timestamp, reason/context where available. |
| Internal vs client audit visibility | Client-facing UI receives no internal audit details. |
| Audit table/detail pattern | Governance/compliance/decision audit surfaces become scannable and density-appropriate. |
| Audit tests | Add/update positive persistence and negative audit-failure fail-closed tests. |

### 8.2 Stays Out

| Out of Scope | Reason |
|---|---|
| Immutable ledger / blockchain / external audit vault | Not needed for V0.96 Core Journey. |
| Full enterprise audit analytics product | V0.96 needs proof spine, not BI module. |
| Broad admin/audit redesign across all 71 routes | Refactor only touched V0.96 surfaces. |
| Client-visible internal audit timeline | Forbidden by client-safe visibility. |
| P1/HOLD audit routes / committee / KYC / suitability audit finalization | Held or P1 scope remains out. |
| New visual assets or state-screen generation | Explicitly forbidden. |
| Blind schema replacement | Existing full-workflow schema baseline must be preserved unless WP-14/migration protocol proves otherwise. |

---

## 9. Detailed Implementation Task Breakdown

| Task ID | Goal | Context | Files / Modules to inspect | Concrete Steps | Acceptance Criteria | Tests | UI/UX/IA Refactor Required? | Stop Rules |
|---|---|---|---|---|---|---|---|---|
| `WP08-T01-AUDIT-REALITY-REBASE` | Re-check current audit implementation and classify gaps before edits. | Current snapshot may contain more audit APIs/tests than older KB. | `app/api/**/route.ts`, `lib/audit-service.ts`, `components/ui/audit-timeline.tsx`, `tests/*audit*`, `prisma/schema.prisma` | Inventory audit APIs, services, event model, UI consumers and tests. Mark each as `ALREADY_PRESENT`, `PARTIAL`, `MISSING`, `CONFLICTING`, `BLOCKED`. Update WP-00 delta register. | No audit task proceeds from stale assumptions. | Source reality / route smoke / test listing where available. | Yes: classify audit surfaces and audit UI states. | Stop if Codex edits audit UI/service before this rebase. |
| `WP08-T02-AUDIT-EVENT-MINIMUM-FIELD-CONTRACT` | Ensure audit event write/read paths expose required minimum fields. | Audit proof needs actor/role/tenant/target/action/result/prev-next/reason/timestamp. | `prisma/schema.prisma`, `lib/audit-service.ts`, `lib/typed-workflow-command-bus.ts`, `lib/permission-engine.ts`, `lib/workflow-gate.ts` | Map existing fields. Add service-level normalization if fields exist but are inconsistently populated. Use schema alignment only if unavoidable and route to WP-14. | Critical events have consistent field envelope. | Audit persistence unit/API tests. | Indirect: UI can show trustworthy event summaries. | No blind schema replacement; no fake fields in UI. |
| `WP08-T03-GATE-ACTION-AUDIT-WRITES` | Attach audit requirements to V0.96 gate actions. | Evidence, advisor, compliance, governance and export gates require audit. | `lib/evidence-service.ts`, `lib/evidence-review-service.ts`, `lib/workflow-gate.ts`, `lib/typed-workflow-command-bus.ts`, `lib/export-service.ts`, `lib/permission-engine.ts` | For each gate action, verify audit write path. Add or harden audit call after permission/precondition check but before action is considered completed. Include denied/failure results where relevant. | Gate actions write audit or remain pending/blocked. | P0-POS-007; existing audit specs; new gate-action audit tests. | UI should show audit source/backing on action result. | Stop if release/export/permission change succeeds without audit where required. |
| `WP08-T04-AUDIT-FAIL-CLOSED-SERVICE-PATH` | Implement fail-closed behaviour when required audit cannot persist. | Safety actions must not silently complete without audit. | `lib/audit-service.ts`, `lib/workflow-gate.ts`, `app/api/demo-workflow/route.ts`, API/service error handling | Add explicit error/return state for audit write failure. Mark action `blocked`, `pending`, or `failed` per contract. Ensure safe error envelope. | Audit failure prevents or holds release/export/permission/evidence critical action. | `tests/audit-fail-closed.spec.ts`; P0-NEG-009. | UI receives `AUDIT_UNAVAILABLE` / `AUDIT_WRITE_FAILED`. | Stop if audit failure is swallowed or logged only to console. |
| `WP08-T05-AUDIT-TIMELINE-SOURCE-BACKING` | Refactor `AuditTimeline` to render source-backed events and display-only limitations truthfully. | Component presence is not persistence proof. | `components/ui/audit-timeline.tsx`, callers in decision/compliance/governance screens | Require event source type/id/correlation where available. Add visual treatment for `sourceBacked`, `pending`, `unavailable`, `displayOnly`. Avoid claiming proof for static rows. | Timeline differentiates persisted, pending and unavailable. | UI/component test or Playwright assertion for audit source states. | Yes: truthful labels, progressive display, no overclaim. | Stop if static rows are labelled “audited”. |
| `WP08-T06-COMPLIANCE-DECISION-AUDIT-SURFACE` | Add audit proof and unavailable states to compliance release/block/request evidence surfaces. | Compliance is the core release gate. | `components/internal-workflow-screen.tsx`, `components/decisions-governance-screen.tsx`, `lib/workflow-gate.ts`, `lib/audit-service.ts` | Show audit-required state before critical action. After action, show persisted event ref/status. If unavailable, show action blocked/pending. Keep details internal. | Compliance UI cannot imply release without audit. | Compliance release/block audit tests; confirmation lifecycle tests. | Yes: decision-room layout, one CTA, audit summary + detail progressive disclosure. | Stop if compliance release page claims success while audit missing. |
| `WP08-T07-GOVERNANCE-AUDIT-HISTORY-SURFACE` | Harden governance audit history and access/role audit surfaces. | Admin non-bypass needs visible denied/pending/audited states. | `components/decisions-governance-screen.tsx`, `components/admin-tenant-setup-screen.tsx`, `lib/permission-engine.ts` | Show access/role changes, denied attempts and second-confirmation events using scannable table/detail pattern. Add empty/permission denied/audit unavailable states. | Governance audit is source-backed and does not imply superuser release power. | Governance non-bypass and permission-engine tests. | Yes: table density, clear page job, no route-catalog feel. | Stop if admin UI suggests release/visibility override. |
| `WP08-T08-CLIENT-AUDIT-REDACTION` | Prevent internal audit detail from reaching client surfaces. | Client-safe projection must not expose internal audit. | `components/client-intake-screen.tsx`, `lib/visibility-engine.ts`, `lib/control-layer/visibility-projection.ts`, client APIs | Verify projection excludes audit internals. If client needs status, expose safe summary only. Add negative payload assertions. | Client sees no internal audit actor/reason/notes/compliance detail. | Client visibility / forbidden payload tests. | Yes: calm client state copy, no internal timeline. | Stop if client route renders internal audit detail. |
| `WP08-T09-AUDIT-DENSITY-PROGRESSIVE-DISCLOSURE` | Prevent audit UI from bloating long pages. | Long page problem is known; audit adds detail load. | decision/compliance/evidence/governance components, `DataTable`, `Drawer`, `StatePanel` | Add audit summary row/card near gate. Put full event detail behind table/detail drawer/section where lifecycle exists. Ensure no hidden critical blocker. | Pages remain summary-first; audit detail accessible but not dominant. | True-UX layout/density tests where available. | Yes: density/page-type refactor. | Stop if blocker hidden in collapsed detail only. |
| `WP08-T10-AUDIT-STATE-FEEDBACK-COPY` | Normalize audit-related copy and states. | No-overclaim microcopy required. | `components/**/*.tsx`, copy constants if present | Use copy: “Audit recorded”, “Audit pending”, “Audit unavailable — action remains pending”, “Audit required before release”. Avoid “complete” unless gate/action truly completed. | Copy names exact action and audit status. | Microcopy/no-overclaim tests. | Yes: state/feedback/microcopy. | Stop if copy says release/export/role change completed when audit failed. |
| `WP08-T11-AUDIT-API-READ-SAFETY` | Harden audit API/readmodel if present. | API presence is not safety proof. | `app/api/audit-events/route.ts`, any audit read APIs, `lib/audit-service.ts` | Validate actor/tenant/object scope. Return redacted/safe event fields by role. Safe error envelope. No raw metadata to unauthorized roles. | Audit API respects RBAC/object scope and safe error contract. | API negative tests for wrong tenant/role/raw metadata. | Indirect: UI gets safe event data. | Stop if route access equals audit payload access. |
| `WP08-T12-P0-AUDIT-TESTS` | Add/update P0 audit positive and negative tests. | Existing tests are partial proof only. | `tests/audit-fail-closed.spec.ts`, `tests/phase6-audit-persistence.spec.ts`, `tests/permission-engine.spec.ts`, `tests/p0-acceptance.spec.ts`, `tests/true-ux-*` | Add positive tests for critical gate audit writes. Add negative tests for audit failure fail-closed, client audit leakage, admin suppress audit, display-only overclaim. | P0 audit gate has explicit positive and negative proof. | P0-POS-007, P0-NEG-009, client leakage, admin non-bypass. | Yes: True-UX assertions for audit unavailable and source-backed display. | Stop if tests only check heading/route smoke. |

---

## 10. Affected Routes / Components / APIs / Services / Schema Areas

### 10.1 Routes

| Route ID | Path | WP-08 Relevance | UI Treatment |
|---|---|---|---|
| `040` | `/compliance/:id/release` | Release requires audit and fail-closed behaviour. | Audit-required state, release blocked/pending if unavailable. |
| `041` | `/compliance/:id/block` | Block/request evidence requires audit. | Reason + audit status. |
| `042` | `/compliance/:id/audit` | Explicit audit and exception log. | Source-backed audit table/detail with unavailable/empty/denied states. |
| `043` | `/decisions` | Decision list may show audit/release indicators. | Summary only, no internal overload. |
| `044` | `/decisions/:id` | Digital decision room needs internal traceability. | Audit summary + detail, progressive disclosure. |
| `045` | `/decisions/:id/success` | Success must not overclaim if audit missing. | Show decision submitted/released only with audit source state. |
| `046` | `/evidence` | Evidence status changes require audit. | Evidence audit summary / history if source-backed. |
| `047` | `/evidence/:id` | Evidence detail audit. | Review/sufficiency audit references. |
| `048` | `/governance/users` | User/role access changes. | Governance audit status. |
| `049` | `/governance/roles` | Role management and second confirmation. | Audit-required / denied / pending states. |
| `050` | `/governance/access-requests` | Access request approvals/denials. | Audit trail and denied state. |
| `051` | `/governance/audit-history` | Main governance audit history. | Scannable source-backed table. |
| `054–058` | Export flow routes | Export scope/redaction/approval/download require audit. | Audit status must support WP-10. |
| `019`, `020` | Client portal/mobile | Must not expose internal audit. | Client-safe status only. |

### 10.2 Components

| Component | WP-08 Treatment |
|---|---|
| `components/ui/audit-timeline.tsx` | Must distinguish persisted/source-backed, pending, unavailable and display-only events. |
| `components/ui/state-panel.tsx` | Use for audit unavailable / permission denied / empty / loading / error states. |
| `components/ui/data-table.tsx` | Audit history table must handle loading/empty/error/permission/filter states if used. |
| `components/ui/drawer.tsx`, `components/ui/modal.tsx` | Audit event detail overlay must have lifecycle if used. |
| `components/internal-workflow-screen.tsx` | Compliance/advisor audit state integration where relevant. |
| `components/decisions-governance-screen.tsx` | Decision/evidence/governance audit surfaces. |
| `components/client-intake-screen.tsx` | Audit redaction / safe client status. |
| `components/demo-session-panel.tsx` | Must not present deterministic audit preview as persistence proof. |

### 10.3 APIs / Services / Schema

| Area | Expected Treatment |
|---|---|
| `app/api/audit-events/route.ts` if present | Harden RBAC, tenant/object scope, safe response, fail-closed errors. |
| `lib/audit-service.ts` | Normalize event write/read result; expose failure state; no swallowed failure. |
| `lib/permission-engine.ts` | Denied actions should write denied audit when required and not mutate. |
| `lib/workflow-gate.ts` | Gate actions depend on audit where required. |
| `lib/typed-workflow-command-bus.ts` | Demo action audit counts must not be overclaimed as production proof. |
| `prisma/schema.prisma` / `AuditEvent` | Preserve schema baseline; align usage to fields. |

---

## 11. Interaction Lifecycle Requirements

| Interaction | Required Lifecycle |
|---|---|
| View audit history | Loading → source-backed rows / empty / permission denied / error / audit unavailable. |
| Open audit detail | Trigger → open drawer/modal/section → loading event detail if async → close/cancel → no mutation. |
| Retry audit load | Disabled while loading → retry → success/error state → no hidden internal data. |
| Gate action requiring audit | Trigger → validate permission/preconditions → attempt mutation + audit persistence → success only if audit required and persisted → fail-closed if audit write fails. |
| Governance denied action | Trigger denied → no mutation → denied audit if required → visible safe feedback. |
| Client-safe audit status | Load projection → show safe status only → never show internal audit details. |

---

## 12. State / Feedback / Microcopy Requirements

| State | Required UI Copy / Behaviour |
|---|---|
| Audit loading | “Loading audit history…” |
| Audit empty | “No audit events recorded for this scope yet.” |
| Audit source-backed | “Audit recorded” with safe timestamp/event ref where role permits. |
| Audit pending | “Audit pending — this action is not final yet.” |
| Audit unavailable | “Audit unavailable — required action remains blocked/pending.” |
| Audit write failed | “Audit could not be recorded. The safety action was not completed.” |
| Permission denied | “You do not have permission to view this audit history.” |
| Client-safe projection | No internal audit copy; at most “Release history is available internally.” |
| Advisor approval audit | “Advisor approval recorded. Waiting for compliance release.” |
| Compliance release audit | “Compliance release recorded. Client-safe content is available.” only when release and audit succeed. |
| Export audit | “Export approval recorded.” not “Export accepted by client.” |

**No-overclaim rule:** Never use “complete”, “approved”, “released”, “exported”, “client-ready” or “audited” unless the matching gate and audit proof have actually succeeded.

---

## 13. Safety / RBAC / Visibility / Evidence / Audit / Export Implications

| Safety Area | WP-08 Requirement |
|---|---|
| RBAC | Audit read/write visibility depends on role/action/object scope. Route access does not grant audit payload access. |
| Tenant isolation | Wrong tenant cannot read audit events or infer hidden object details. |
| Client visibility | Client cannot see internal audit actors, notes, compliance reasons, raw metadata or denied attempts. |
| Evidence | Evidence accepted/rejected/insufficient/requested actions require audit where gate-relevant. |
| Advisor approval | Advisor approval writes audit but does not release or create client visibility. |
| Compliance release | Compliance release/block/request evidence requires audit; failure leaves action pending/blocked. |
| Admin non-bypass | Admin cannot suppress audit or force release/export/evidence sufficiency. Denied attempts should be auditable. |
| Export | Export preview/approval/download audit must support WP-10; no download/share without required audit if scoped as critical. |
| API errors | Audit API/service failures use safe error envelopes and do not expose sensitive metadata. |

---

## 14. Positive Acceptance Criteria

| ID | Acceptance Criteria |
|---|---|
| `WP08-POS-01` | Critical V0.96 gate actions create or require persisted audit events. |
| `WP08-POS-02` | Audit timeline/table renders persisted/source-backed events and distinguishes unavailable/pending states. |
| `WP08-POS-03` | Compliance release/block/request evidence UI shows audit-required and audit-recorded states truthfully. |
| `WP08-POS-04` | Governance audit history shows user/role/access request changes and denied attempts in a scannable table/detail pattern. |
| `WP08-POS-05` | Evidence review/sufficiency actions have audit references when state changes. |
| `WP08-POS-06` | Export approval/download manifest path can consume audit status for WP-10. |
| `WP08-POS-07` | Client portal/mobile do not render internal audit details. |
| `WP08-POS-08` | Audit unavailable state is visible and blocks/holds critical action where required. |

---

## 15. Negative Acceptance Criteria

| ID | Negative Acceptance Criteria |
|---|---|
| `WP08-NEG-01` | Audit write failure must not allow compliance release to complete. |
| `WP08-NEG-02` | Audit write failure must not allow export approval/download/share to complete where audit is required. |
| `WP08-NEG-03` | Admin cannot suppress audit, force release, mark evidence sufficient or force export release. |
| `WP08-NEG-04` | Static/display-only audit rows must not be labelled as persisted proof. |
| `WP08-NEG-05` | Client-facing routes must not expose internal audit detail, actor notes, compliance reasons or denied internal attempts. |
| `WP08-NEG-06` | Wrong tenant / wrong object / wrong role cannot read audit event payload. |
| `WP08-NEG-07` | Advisor approval audit must not imply compliance release or client visibility. |
| `WP08-NEG-08` | Upload/evidence audit must not imply evidence sufficiency unless review/link/relevance/acceptance gates pass. |

---

## 16. Required Tests and Test Names

Codex must inspect current tests first and reuse existing names if present. Suggested/expected tests:

| Test Name | Type | Purpose |
|---|---|---|
| `tests/audit-fail-closed.spec.ts` | P0 negative | Simulate audit write failure and prove release/export/permission change remains denied/pending. |
| `tests/phase6-audit-persistence.spec.ts` | P0 positive / regression | Verify audit event persistence for critical gate actions if existing. |
| `tests/permission-engine.spec.ts` | P0 negative | Denied access/mutation writes denied audit and skips mutation. |
| `tests/governance-non-bypass.spec.ts` | P0 negative | Admin cannot bypass gates and audit cannot be suppressed. |
| `tests/client-visibility-projection.spec.ts` or equivalent | P0 negative | Client-safe payload excludes internal audit detail. |
| `tests/true-ux-audit-surface.spec.ts` | True-UX | Audit UI shows source-backed, empty, unavailable, permission denied and progressive-detail states. |
| `tests/export-redaction-approval.spec.ts` or existing export spec | P0 export | Export approval/download path includes audit expectation and no forbidden payload. |
| `tests/workflow-gate.spec.ts` | Unit/service | Critical action cannot proceed when audit requirement fails. |

**Minimum release-blocking tests for WP-08:**

1. Positive: compliance release writes audit.
2. Positive: evidence sufficiency status change writes audit.
3. Positive: governance role/access change writes audit.
4. Negative: audit failure blocks compliance release.
5. Negative: client does not see internal audit detail.
6. Negative: admin cannot bypass/suppress audit.
7. UX: audit unavailable state is visible and does not claim success.

---

## 17. Validation Commands

Codex must inspect `package.json` first and use actual scripts. Candidate commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm playwright test tests/audit-fail-closed.spec.ts
pnpm playwright test tests/phase6-audit-persistence.spec.ts
pnpm playwright test tests/governance-non-bypass.spec.ts
pnpm playwright test tests/true-ux-audit-surface.spec.ts
pnpm playwright test tests/client-visibility-projection.spec.ts
```

If a named test file does not exist, Codex must either:

1. use the nearest existing equivalent and document it, or
2. create/update the test under the acceptance obligations of this WP, without inventing unrelated scope.

---

## 18. Stop Rules / Do-Not-Do Register

| Stop Rule | Reason |
|---|---|
| Do not treat audit timeline rows as proof unless source-backed. | Prevents false audit confidence. |
| Do not allow release/export/permission change to complete if required audit cannot persist. | Safety-critical fail-closed behaviour. |
| Do not show internal audit detail on client portal/mobile. | Client-safe visibility. |
| Do not let admin suppress audit or force gates. | Admin non-bypass. |
| Do not create a broad audit analytics product. | Scope control. |
| Do not generate screens/images/state-screen assets. | Generation forbidden. |
| Do not replace Prisma schema blindly. | Full-workflow schema baseline. |
| Do not elevate held routes `064–067`, `069–071` or P1 route `068`. | Route-scope lock. |
| Do not add new API routes unless WP-00 proves existing routes cannot support locked V0.96 needs. | Avoid API sprawl. |
| Do not hide critical blockers only in collapsed detail. | UX safety visibility. |
| Do not use generic copy such as “completed” where only audit pending/unavailable exists. | No-overclaim microcopy. |

---

## 19. Open Questions / Blockers

| Blocker / Question | Handling |
|---|---|
| Does the current repo already have `/api/audit-events`? | WP-00/WP08-T01 must inspect. If absent, prefer service-backed read model before adding route. |
| Does `AuditEvent` schema contain all minimum fields? | Map existing fields first; route field gaps to WP-14. |
| How should audit write failure be simulated in tests? | Use dependency injection/mock service if present; otherwise create safe test seam without changing product scope. |
| Are demo workflow audit rows production-like or demo-only? | Label demo audit as proof slice only; do not overclaim production persistence. |
| Which audit details may client see? | Default none. Only safe release status or public-safe summary if explicitly projected. |
| Does audit detail require drawer/modal? | Use existing table/detail pattern; do not create overlay unless lifecycle is supported by WP-11 primitives. |

---

## 20. Codex Execution Notes

1. Start by reading `AGENTS.md`, current branch/status and WP-00 delta register.
2. Do not implement WP-08 until WP-00 has classified audit surfaces.
3. Prefer hardening existing `audit-service`, `AuditTimeline`, governance/decision screens and tests.
4. Treat every audit row as suspect until source/persistence is proven.
5. Keep client audit output safe by default: hidden/redacted/no internal details.
6. Keep UI density appropriate: audit summary on decision pages, full detail only in audit-specific surfaces or progressive disclosure.
7. Add test proof before declaring WP complete.
8. Document any stale KB assumption that conflicts with current repo.

---

## 21. QA Matrix

| QA Check | Required Result |
|---|---|
| Source hierarchy preserved | PASS required |
| `main` ignored as target | PASS required |
| WP-00 rebase referenced | PASS required |
| Audit display vs persistence separated | PASS required |
| Audit unavailable state specified | PASS required |
| Audit failure fail-closed specified | PASS required |
| Client audit redaction specified | PASS required |
| Governance/admin non-bypass audit specified | PASS required |
| UI/UX/IA refactor embedded | PASS required |
| Positive and negative tests listed | PASS required |
| No screen/image generation | PASS required |
| No broad audit product scope | PASS required |
| No blind schema replacement | PASS required |
| No P1/HOLD elevation | PASS required |

---

## 22. ENGINE Execution Proof

| Phase | ENGINE_v3 Contribution | ENGINE_v2 Contribution | Codex-Spark-like Convergence |
|---|---|---|---|
| KB / UX discovery | Identified audit display vs persistence, long-page risk, client leakage, governance superuser illusion and no-overclaim issues. | Classified evidence into source hierarchy, route scope and task obligations. | Converted audit evidence into concrete implementation constraints. |
| Contradiction control | Separated visual timeline, static rows and demo audit counts from persisted audit proof. | Preserved full-workflow as code reality and KB as control evidence. | Required WP-00 audit reality classification before implementation. |
| Task decomposition | Mapped audit issues to decision, compliance, evidence, governance, export and client surfaces. | Produced task IDs, files, concrete steps, acceptance criteria, tests and stop rules. | Avoided broad alternatives; produced direct Codex-ready task cards. |
| Safety discipline | Highlighted audit failure, client leakage and admin suppression risks. | Enforced P0 positive/negative acceptance and fail-closed behaviour. | Made audit failure a release blocker for critical actions. |
| UX/IA integration | Folded density, progressive disclosure, page job, state copy and source-backed display into the WP. | Scoped refactor to touched V0.96 surfaces only. | No broad redesign; truthful audit UI where Codex already works. |
| QA | Checked no implementation, no generation, no schema replacement, no P1/HOLD elevation. | Built QA matrix and stop-rule register. | Final artefact is ready as a Codex task description, not implementation. |

