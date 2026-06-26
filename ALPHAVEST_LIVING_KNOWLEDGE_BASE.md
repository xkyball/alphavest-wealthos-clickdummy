# ALPHAVEST_LIVING_KNOWLEDGE_BASE.md
> **Repo-local bundle note:** This sanitized artefact is included as decision / policy / task / handoff guidance only. It does not provide source code, source snapshots, screenshots, screencasts, reference images or generated visual assets. Codex must work on a local repository checkout / pull of the intended target branch and run the Moving Baseline Preflight before any code change.


**Purpose:** Living, versioned, recovery-aware knowledge base for the AlphaVest WealthOS MVP / Click-Dummy-to-Codex handoff path.  
**Mode:** Knowledge base only. No implementation. No final Codex handoff. No new Codex tickets. No screen generation.  
**Current strategic decision:** `CONTROLLED_REBASE_SUFFICIENT` — no full conceptual restart, but all `main`-derived code facts must be frozen, classified and rebased against `full-workflow`.

---

## 0. Version Header

| Field | Value |
|---|---|
| KB Version | v0.1 |
| Date | 2026-06-19 |
| Current target codebase | `local repository checkout / pull of target branch full-workflow` |
| Previous wrong analysis basis | `main branch as false-gap / historical only; never target truth` |
| Current mode | Living KB / Recovery Rebase |
| Codex handoff ready? | No |
| Next prompt to run | Prompt 1 — AlphaVest Full-Workflow Source-of-Truth Inventory |
| Warning | This is not a final implementation handoff. Code-derived findings from `main` are not target truth. |

---

## 1. Executive Summary

AlphaVest WealthOS is a digital, human-backed Family Office platform concept. Its core logic is: **Digital first, human reviewed, evidence backed**. The product is not intended to be a fully automated financial-advice engine. It is a controlled workflow platform where signals, drafts, reviews, approvals, compliance gates, client visibility, decision records and evidence are traceable and human-governed.

The current recovery status is corrected as follows:

- The previous MVP/readiness check was treated as having run against the wrong codebase: `main branch as false-gap / historical only; never target truth`.
- The correct target codebase is now `local repository checkout / pull of target branch full-workflow`.
- `main` remains useful only as a false-gap source, earlier concept reference and comparison artefact.
- `full-workflow` is the actual code-reality source for routes, files, components, APIs, Prisma, tests, visual assets and Codex handoff preparation.
- A complete conceptual restart is not required because the product logic, MVP-control rules, advice-boundary principles, RBAC principles, client-visibility principles, evidence/audit thinking and QA method remain reusable.
- A final Codex handoff is still not possible because the `full-workflow` codebase must first be inventoried, reconciled and tested against the MVP-control layer.

This Living KB exists to prevent the project from restarting every time the analysis moves forward. Each future prompt in the Next Prompt Sequence must update this KB version-by-version, replacing assumptions with validated facts, marking obsolete claims as superseded and recording when Codex may safely take over implementation.

---

## 2. Current Source-of-Truth Hierarchy

| Rank | Source | Role | Trust level | Notes |
|---:|---|---|---|---|
| 1 | `local repository checkout / pull of target branch full-workflow` | Primary target codebase | Highest for code reality | Source for actual route registry, files, components, APIs, Prisma schema, tests, scripts, visual assets and app architecture. |
| 2 | Full-Workflow code and docs | Target implementation context | High, but docs must be checked against code | `docs/v3/*` and related handoff docs are valuable, but some docs may still say 63 pages while code has 71 routes. |
| 3 | `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | MVP-control and safety specification | High for intended MVP gates, medium for target-code mapping | Useful for advice boundary, RBAC, client visibility, domain/data specs and acceptance gates. Must not blindly override full-workflow code. |
| 4 | `ALPHAVEST_MAIN_TO_FULL_WORKFLOW_RECOVERY_AUDIT.md` | Current recovery decision | High as recovery-control layer | Establishes `CONTROLLED_REBASE_SUFFICIENT` and classifies `main` gaps as suspect. |
| 5 | Earlier KBs and roadmaps | Hypotheses and reusable method | Medium/low for code facts | Can be reused for logic, structure and warnings, not as target-code truth. |
| 6 | `main branch as false-gap / historical only; never target truth` | False-gap source and historical concept reference | Low for target implementation | Not target truth. Use only to identify false gaps or preserve earlier visual/product ideas. |

---

## 3. Stable Product Truth

| Product truth | Classification | Notes |
|---|---|---|
| AlphaVest WealthOS is a digital, human-backed Family Office platform. | `VALID_ONLY_AS_PRODUCT_SPEC` | Stable product framing, not itself code proof. |
| The operating logic is: Digital first, human reviewed, evidence backed. | `VALID_ONLY_AS_PRODUCT_SPEC` | Must later map to routes, workflow states and acceptance gates. |
| The platform workflow begins with a signal or trigger. | `VALID_ONLY_AS_PRODUCT_SPEC` | Later route mapping needed against `full-workflow`. |
| AI / Rules Draft may support internal preparation. | `VALID_ONLY_AS_PRODUCT_SPEC` | Must remain internal-only under MVP-control rules. |
| Analyst Review is a required human-control step. | `VALID_ONLY_AS_PRODUCT_SPEC` | Later map to `internal-workflow-screen.tsx` and workflow gates. |
| Advisor Approval is a separate approval step. | `VALID_ONLY_AS_PRODUCT_SPEC` | Must not be collapsed into compliance clearance. |
| Compliance Gate controls advice boundary and release conditions. | `VALID_ONLY_AS_PRODUCT_SPEC` | Requires gate and test proof. |
| Client Visibility is a controlled release result, not a manual toggle. | `VALID_ONLY_AS_PRODUCT_SPEC` | Also a hard MVP-control rule. |
| Decision Record captures the rationale and approved/released state. | `VALID_ONLY_AS_PRODUCT_SPEC` | Must map to full-workflow decisions/governance model. |
| Evidence Vault supports auditability and proof readiness. | `VALID_ONLY_AS_PRODUCT_SPEC` | Upload alone must not equal evidence sufficiency. |
| Review Rhythm keeps decisions monitored over time. | `VALID_ONLY_AS_PRODUCT_SPEC` | Must map to review-monitoring routes/services if MVP-relevant. |
| The goal is not a fully automated advice engine. | `VALID_ONLY_AS_PRODUCT_SPEC` | Important non-goal for Codex guardrails. |

---

## 4. Stable MVP-Control Rules

| MVP-control rule | Classification | Later validation target |
|---|---|---|
| No unapproved advice reaches the client. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate through workflow gate, client routes, visibility engine, API payloads, export paths and tests. |
| AI Draft is internal-only. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate UI/API/export payload exclusion and client-route redaction. |
| Client Visibility is derived and fail-closed. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate `visibility-engine.ts`, workflow gates, payload redaction and no manual override. |
| Advisor Approval and Compliance Clearance are separate gates. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate state machine, workflow gate and test coverage. |
| Admin may not bypass Advice, Compliance or Release gates. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate permission engine and negative tests. |
| Evidence is required, but upload alone must not automatically prove evidence sufficiency. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate document upload service, evidence service and workflow gate. |
| Audit Events must be written for relevant gate actions. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate `audit-service.ts`, Prisma `AuditEvent`, API/service tests. |
| RBAC must be route-, action- and payload-relevant. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate permission engine, route guards and field-level payload behaviour. |
| Client sees only released, redacted, client-safe information. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Validate client portal, mobile/client views, decision/evidence routes and export previews. |
| Full automation, production-grade AI advice, live banking/custody integrations and real client pilot are not automatically MVP. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Codex handoff must include explicit non-goals and stop rules. |

---

## 5. Corrected Codebase Reality Snapshot

| Area | Current known state | Source | Classification | Needs recheck? |
|---|---|---|---|---|
| Target codebase | `full-workflow` is the intended target codebase. | Current corrected premise + recovery audit | `VALIDATED_AGAINST_FULL_WORKFLOW` | No for target direction; yes for detailed inventory. |
| Previous wrong basis | `main` was the wrong earlier analysis basis. | Current corrected premise + recovery audit | `VALID_ONLY_FOR_MAIN_CODEBASE` | No for recovery direction. |
| File count | `full-workflow` has 405 files in the current local repository working tree after preflight. | Zip inventory | `VALIDATED_AGAINST_FULL_WORKFLOW` | Reconfirm in Prompt 1 if needed. |
| Main file count | `main` has 72 files in the current local repository working tree after preflight. | Zip inventory | `VALID_ONLY_FOR_MAIN_CODEBASE` | No, unless comparing again. |
| Routing model | `full-workflow` uses `app/[...segments]/page.tsx` and `lib/route-registry.ts`. | Zip inventory | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: full route map required. |
| Route count | `lib/route-registry.ts` contains 71 route entries. | Route registry parse | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: route classification still needed. |
| API routes | `full-workflow` has 4 API routes. | Zip inventory | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: API contract readiness needed. |
| API route names | `deleted generic workflow route`, `/api/documents`, `/api/documents/upload`, `/api/review-monitoring`. | Zip inventory | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: acceptance and safety mapping needed. |
| Prisma | `full-workflow` has `prisma/schema.prisma`, migrations and seed support. | Zip inventory | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: schema/domain reconciliation needed. |
| Prisma models | Full-workflow schema contains 42 models. | Prisma parse | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: model-by-model mapping needed. |
| Tests | `full-workflow` has 10 test/spec files. | Zip inventory | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: P0 safety coverage unproven. |
| Visual assets | `full-workflow` has 63 clean page PNGs. | Zip inventory | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: reconcile against 71 routes. |
| Route/visual drift | There is a likely 71-routes-vs-63-assets drift. | Route + asset count | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Yes: Prompt 4. |
| Pages 064–071 | These remain relevant as likely missing/unresolved target visual assets. | Recovery audit + asset count | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Yes: route/visual reconciliation. |
| Drawer/Modal components | `components/ui/drawer.tsx` and `components/ui/modal.tsx` exist. | Zip inventory | `VALIDATED_AGAINST_FULL_WORKFLOW` | Yes: behaviour completeness unknown. |
| Interaction readiness | Components and visual modes do not automatically prove real interactions. | Recovery audit | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Yes: Prompt 5. |

---

## 6. False Gaps From Main

These false gaps must stay visible as a warning system. They should not be deleted, because otherwise they may re-enter later prompts as apparent gaps.

| Main-based false gap | Why it appeared | Full-workflow correction | Status | Future action |
|---|---|---|---|---|
| API fehlt | `main` has no API routes. | `full-workflow` has 4 API routes. | `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH` | Audit API readiness instead of claiming API absence. |
| Prisma fehlt | `main` has no Prisma folder. | `full-workflow` has Prisma schema, migrations and seed. | `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH` | Reconcile full schema with MVP patch/domain model. |
| Tests fehlen | `main` has no tests. | `full-workflow` has 10 specs. | `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH` | Map existing tests to P0 MVP gates. |
| Route universe only has 16 routes | `main` has 16 board routes. | `full-workflow` has 71 registry routes. | `VALID_ONLY_FOR_MAIN_CODEBASE` | Rebuild route inventory from `lib/route-registry.ts`. |
| UI components fehlen | `main` has a single `components/ui.tsx`. | `full-workflow` has modular `components/ui/*`. | `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH` | Audit behaviour semantics instead. |
| Drawer/Modal components fehlen | `main` has reduced UI primitives. | `full-workflow` has drawer and modal components. | `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH` | Audit real interaction behaviour, not component presence. |
| Workflow-Logik fehlt | `main` has lightweight workflow metadata. | `full-workflow` has workflow gate, demo mutation, validation and services. | `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH` | Audit if workflow logic is MVP-grade. |
| Review Monitoring fehlt | `main` lacks review-monitoring service/API. | `full-workflow` has `review-monitoring-service.ts` and API route. | `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH` | Audit readiness and tests. |
| Committee Review fehlt | `main` has no committee routes. | `full-workflow` has committee review routes/components/tests, but likely missing visuals 070–071. | `PARTIALLY_REUSABLE_AFTER_FULL_WORKFLOW_REBASE` | Treat as target partial gap only after full inventory. |
| Visual-System is only 16 wireframes | `main` has 16 wireframes + key visuals. | `full-workflow` has 63 clean page PNGs plus route registry references. | `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH` | Reconcile 71 route entries with 63 assets. |

---

## 7. True Remaining Full-Workflow Gap Hypotheses

These are not final findings yet; they are target-codebase hypotheses to validate through the Next Prompt Sequence.

| Gap hypothesis | Current evidence | Classification | Severity | What must validate it? | Related future prompt |
|---|---|---|---|---|---|
| 71 routes vs 63 visual assets | Route registry count and clean PNG count | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | Route/visual asset inventory | Prompt 4 |
| Missing or unresolved visuals 064–071 | Asset count stops at 063; recovery audit flags 064–071 | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | Visual manifest and route registry check | Prompt 4 |
| Drawer/Modal components exist, but behaviour completeness unknown | Drawer/modal files exist | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | Interaction reality audit | Prompt 5 |
| Visual states may not equal real interactions | Visual modes and state screens exist | `PARTIALLY_REUSABLE_AFTER_FULL_WORKFLOW_REBASE` | High | Trigger/validation/focus/save/error/audit behaviour check | Prompt 5 |
| Client Visibility engine exists, but fail-closed payload proof needed | `visibility-engine.ts` exists | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | Engine, routes, payload and tests | Prompt 7 |
| Permission engine exists, but demo permissiveness/admin bypass must be tested | `permission-engine.ts` exists; earlier README noted permissive demo phases | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | RBAC audit and negative tests | Prompt 7 |
| Evidence service exists, but evidence sufficiency must be proven | `evidence-service.ts`, upload API and Prisma models exist | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | Evidence workflow and tests | Prompt 7 / Prompt 8 |
| Audit service exists, but gate-action persistence must be proven | `audit-service.ts`, Prisma `AuditEvent` exist | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | Service/API tests and DB write mapping | Prompt 7 / Prompt 8 |
| Prisma schema exists, but patch/domain/data-dictionary reconciliation is needed | Full schema has 42 models; patch has its own schema/domain docs | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | Schema/domain/model mapping | Prompt 6 |
| Tests exist, but P0 MVP Safety coverage is unproven | 10 test files exist | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | High | Test-to-acceptance gate mapping | Prompt 8 |
| Docs may be stale relative to code | README/docs mention 63 pages while route registry has 71 | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Medium | Code-vs-doc inventory | Prompt 1 / Prompt 3 |

---

## 8. Route / Screen / Visual Knowledge

| Knowledge item | Current state | Confidence | Classification | Next validation |
|---|---|---|---|---|
| `main` 16-board route system is not target truth | It belongs to previous wrong analysis basis. | High | `VALID_ONLY_FOR_MAIN_CODEBASE` | No target use except comparison. |
| `full-workflow` 71-route registry is target route baseline | `lib/route-registry.ts` contains 71 route entries. | High for count, medium for final MVP scope | `VALIDATED_AGAINST_FULL_WORKFLOW` | Prompt 1 and Prompt 4. |
| Full route inventory must be regenerated | Existing KBs may mix target states. | High | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Prompt 1. |
| Visual reconciliation must follow route inventory | 71 routes vs 63 clean PNGs indicates drift. | High | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Prompt 4. |
| Missing 064–071 must not be assumed solved | Current asset count suggests unresolved assets. | Medium/high | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Prompt 4. |
| No new screens should be generated yet | Route/visual universe not locked. | High | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Prompt 4 must decide first. |
| Clean PNGs 001–063 exist | Public reference inventory confirms 63 images. | High | `VALIDATED_AGAINST_FULL_WORKFLOW` | Prompt 4 asset mapping. |
| Screens may be MVP, demo-only or future-only | 71 routes likely include broader catalogue. | Medium | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Prompt 1 / Prompt 4. |

---

## 9. Interaction / Drawer / Modal Knowledge

| Interaction area | Known state | Risk | Next validation |
|---|---|---|---|
| Main interactions | `main` had reduced visual/static interactions. | False gaps may overstate missing interactions. | Keep only as warning, not target truth. |
| Full-workflow drawer/modal components | `components/ui/drawer.tsx` and `components/ui/modal.tsx` exist. | Presence does not prove full behaviour. | Prompt 5. |
| Visual modes | `full-workflow` has visual-state concepts and route modes. | Deterministic visual state may be mistaken for real interaction. | Prompt 5. |
| Overlay triggers | Unknown until audited. | Codex may implement UI without allowed-state/role triggers. | Prompt 5. |
| Validation/save/loading/success/error | Unknown until audited. | Important flows may be visually present but functionally shallow. | Prompt 5. |
| Focus/escape/click-outside | Unknown until audited. | Accessibility and UI correctness risk. | Prompt 5. |
| Audit event on interaction | Unknown until audited. | Gate actions may not be evidence/audit-safe. | Prompt 5 / Prompt 7. |

Required later classification vocabulary:

- `STATIC_SCREEN_STATE`
- `DETERMINISTIC_VISUAL_STATE`
- `REAL_INTERACTIVE_STATE`
- `IMPLEMENTED_INTERACTION`
- `SPECIFIED_ONLY`
- `MISSING_BEHAVIOUR`
- `NEEDS_BEHAVIOUR_SPEC_BEFORE_CODEX`

---

## 10. Data / Prisma / Domain Knowledge

| Data area | Known state | Classification | Next validation |
|---|---|---|---|
| `main` data layer | No Prisma present. | `VALID_ONLY_FOR_MAIN_CODEBASE` | No target use. |
| `full-workflow` Prisma | Schema, migrations and seed support exist. | `VALIDATED_AGAINST_FULL_WORKFLOW` | Prompt 6. |
| Full schema model count | 42 models parsed from `prisma/schema.prisma`. | `VALIDATED_AGAINST_FULL_WORKFLOW` | Prompt 6 model-by-model reconciliation. |
| MVP patch schema/domain | Patch contains own `prisma/schema.prisma`, `DOMAIN_MODEL.md`, `DATA_DICTIONARY.md`. | `VALID_ONLY_AS_MVP_CONTROL_RULE` / `CONTROL_SPEC` | Prompt 6. |
| Schema strategy | No blind schema replacement. | `VALID_ONLY_AS_MVP_CONTROL_RULE` | Prompt 6. |
| Mapping need | Map full schema, patch schema, domain model, data dictionary, actual code use and tests/seeds. | `NEEDS_RECHECK_AGAINST_FULL_WORKFLOW` | Prompt 6. |

Key full-workflow Prisma models currently known include: `PlatformTenant`, `ClientTenant`, `User`, `UserProfile`, `Role`, `Permission`, `UserRole`, `RolePermission`, `AccessRequest`, `SecondConfirmation`, `ConsentRecord`, `Engagement`, `FamilyMember`, `Relationship`, `ClientObjective`, `Entity`, `EntityParticipant`, `Asset`, `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink`, `Trigger`, `ActionItem`, `Recommendation`, `RecommendationOption`, `Approval`, `ComplianceReview`, `Decision`, `DecisionParticipant`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent`, `ReviewSchedule`, `MessageThread`, `Message`, `CallEvent`, `ExportRequest`, `PolicyDefinition`, `QueueItem`, `DataQualityIssue`.

---

## 11. RBAC / Client Visibility / Advice Boundary Knowledge

| Safety area | Control rule | Current implementation evidence | Gap hypothesis | Next validation |
|---|---|---|---|---|
| RBAC | Role/action/payload permissions must be enforced. | `permission-engine.ts` exists. | Engine may still be demo-permissive or incomplete. | Prompt 7. |
| Client Visibility | Visibility must be derived and fail-closed. | `visibility-engine.ts` exists. | Need prove fail-closed route/API/payload behaviour. | Prompt 7. |
| Advice Boundary | No unapproved advice reaches client. | `workflow-gate.ts` exists. | Need prove UI/API/export/client routes cannot leak drafts. | Prompt 7 / Prompt 8. |
| AI Draft | Internal-only. | Workflow/data structures likely exist, exact mapping unverified. | Need identify all draft fields and payload redaction. | Prompt 7. |
| Advisor Approval | Separate from compliance clearance. | Workflow gate likely models gate logic. | Need prove separation and no bypass. | Prompt 7 / Prompt 8. |
| Compliance Gate | Must block/release client-safe output. | Compliance components/services exist. | Need prove release conditions and audit. | Prompt 7. |
| Admin role | Admin must not bypass advice/compliance/release gates. | Permission engine exists. | Need negative tests for admin bypass. | Prompt 7 / Prompt 8. |
| Evidence | Evidence sufficiency required. | Evidence/upload services exist. | Need prove upload does not auto-unlock advice. | Prompt 7 / Prompt 8. |
| Audit | Gate actions require audit events. | `audit-service.ts`, `AuditEvent` model exist. | Need prove persistence for all relevant gate actions. | Prompt 7 / Prompt 8. |

---

## 12. Test / Acceptance Knowledge

| Test area | Known state | What it may prove | What remains unproven | Next validation |
|---|---|---|---|---|
| Main tests | `main` has no tests. | Nothing for target. | All target proof must come from full-workflow or new tests. | Not target. |
| Full-workflow tests | 10 test/spec files exist. | Some route/API/service/permission/workflow slices. | Full P0 MVP safety coverage. | Prompt 8. |
| Existing test files | `committee-review-routes.spec.ts`, `data-quality-service.spec.ts`, `recommendation-review-workflow-api.spec.ts`, `document-upload-api.spec.ts`, `document-upload-flow.spec.ts`, `file-export-realism.spec.ts`, `permission-engine.spec.ts`, `review-monitoring-service.spec.ts`, `route-smoke.spec.ts`, `workflow-gate.spec.ts`. | Useful proof base. | Coverage against MVP acceptance gates not yet mapped. | Prompt 8. |
| Route smoke | Test exists. | Likely proves route renderability for a route list. | Does not prove MVP safety. | Prompt 8. |
| Permission tests | Test exists. | Likely proves part of permission engine. | Admin bypass, payload redaction and route-level negative cases may remain. | Prompt 8. |
| Workflow gate tests | Test exists. | Likely proves some gate rules. | No-unapproved-advice end-to-end and client visibility release/block may remain. | Prompt 8. |
| Upload tests | Tests exist. | Likely proves upload flow/API. | Evidence sufficiency and gate-unlock rules may remain. | Prompt 8. |

---

## 13. Artefact Registry

| Artefact | Role | Current status | Use allowed? | Required action |
|---|---|---|---|---|
| `ALPHAVEST_MAIN_TO_FULL_WORKFLOW_RECOVERY_AUDIT.md` | Current recovery decision | Current and controlling | Yes | Use as recovery source until superseded by this Living KB and later versions. |
| `ALPHAVEST_CODEBASE_MISMATCH_RECOVERY_AUDIT.md` | Earlier opposite-direction audit | Superseded by corrected premise | Hypothesis/history only | Mark relevant parts as superseded. |
| `ALPHAVEST_MVP_READINESS_KNOWLEDGE_BASE.md` | Earlier readiness KB | Potentially mixed / rebase-required | Hypothesis only | Rebase against `full-workflow`. |
| `ALPHAVEST_CODEX_HANDOFF_PREPARATION_ROADMAP.md` | Earlier prep roadmap | Potentially mixed / rebase-required | Hypothesis only | Rebuild after full-workflow inventory. |
| `main branch as false-gap / historical only; never target truth` | Wrong earlier analysis basis | False-gap source | No target-code truth | Use only for comparison and false-gap cleanup. |
| `local repository checkout / pull of target branch full-workflow` | Correct target codebase | Primary target | Yes | Inventory in Prompt 1. |
| `control-spec concepts represented in bundled markdown artefacts; no patch archive included` | MVP-control specification package | Control spec, not direct code truth | Yes | Map to target code carefully. |
| Previous Codex Task Masters | Task preparation artefacts | Rebase-required | Not for direct implementation | Rebuild after KB/roadmap rebase. |
| Previous visual/screen catalogues | Visual references | Rebase-required | Hypothesis only | Reconcile against 71-route registry and 63 assets. |
| Previous schema findings | Schema analysis | Rebase-required | Not target truth unless full-workflow based | Replace with full schema vs patch/domain mapping. |
| Previous test findings | Test analysis | Rebase-required | Not target truth unless full-workflow based | Replace with test-to-P0 mapping. |

Classification labels for future use:

- `PRIMARY_TARGET`
- `CONTROL_SPEC`
- `CURRENT_RECOVERY_DECISION`
- `HYPOTHESIS_ONLY`
- `FALSE_GAP_SOURCE`
- `REBASE_REQUIRED`
- `DISCARD_FOR_TARGET_TRUTH`
- `KEEP_AS_PRODUCT_SPEC_ONLY`

---

## 14. Living KB Update Protocol

This KB must be updated after each future prompt execution. Updates must not overwrite history silently. They must version the KB and mark outdated claims as superseded.

### Update rules

Each future update must add:

1. New KB version.
2. Date.
3. Prompt executed.
4. New evidence added.
5. Statements superseded.
6. New validated code-reality facts.
7. New false gaps.
8. New true full-workflow gaps.
9. New decisions.
10. New open questions.
11. Updated next prompt.

### KB Update Entry — vX.Y

| Field | Value |
|---|---|
| Previous version |  |
| New version |  |
| Prompt executed |  |
| New evidence added |  |
| Statements superseded |  |
| New validated facts |  |
| New gap decisions |  |
| Next prompt |  |

### Versioning convention

- `v0.1` — Initial Living KB from accumulated recovery knowledge.
- `v0.2` — Full-workflow source-of-truth inventory integrated.
- `v0.3` — Main-based false gap cleanup integrated.
- `v0.4` — Full-workflow readiness KB rebase integrated.
- `v0.5` — Route/visual/state reconciliation integrated.
- `v0.6` — Interaction reality audit integrated.
- `v0.7` — Schema/domain/patch reconciliation integrated.
- `v0.8` — RBAC/client visibility/advice boundary audit integrated.
- `v0.9` — P0 smoke test mapping integrated.
- `v1.0` — Task Master rebase complete.
- `v1.1+` — Final Codex handoff updates only after gates pass.

---

## 15. Next Prompt Sequence Integration

### Prompt 1 — AlphaVest Full-Workflow Source-of-Truth Inventory

**Goal:** Inventory `full-workflow` only: routes, files, components, APIs, Prisma, tests, docs, visual assets.

**KB sections to update:**

- Corrected Codebase Reality Snapshot
- Route / Screen / Visual Knowledge
- Artefact Registry
- Mandatory Rechecks
- Version Log

### Prompt 2 — AlphaVest Main-Based False Gap Cleanup

**Goal:** Remove false gaps created by checking `main` and preserve only reusable product/control knowledge.

**KB sections to update:**

- False Gaps From Main
- Artefact Registry
- Reusable Knowledge
- Risk Register

### Prompt 3 — AlphaVest Full-Workflow Readiness Knowledge Base Rebase

**Goal:** Create the corrected KB against `full-workflow`.

**KB sections to update:**

- All sections
- Especially Validated Facts, Real Remaining Gaps, Codex Readiness

### Prompt 4 — AlphaVest Full-Workflow Route / Visual / State Reconciliation

**Goal:** Reconcile 71 routes, 63 clean assets, missing 064–071 asset references and visual modes.

**KB sections to update:**

- Route / Screen / Visual Knowledge
- True Remaining Gaps
- State-Screen backlog
- Visual Asset decisions

### Prompt 5 — AlphaVest Full-Workflow Interaction Reality Audit

**Goal:** Determine which drawers, modals, confirmations and state panels are real interactions vs visual states.

**KB sections to update:**

- Interaction / Drawer / Modal Knowledge
- Codex readiness blockers
- Test requirements

### Prompt 6 — AlphaVest Full-Workflow Schema / Domain / Patch Reconciliation

**Goal:** Map full 42-model Prisma schema to MVP patch/domain/data dictionary without replacement.

**KB sections to update:**

- Data / Prisma / Domain Knowledge
- Schema decisions
- Migration/no-migration rules
- Model mapping

### Prompt 7 — AlphaVest Full-Workflow RBAC / Client Visibility / Advice Boundary Audit

**Goal:** Prove or specify fail-closed visibility, internal-only AI drafts, RBAC and admin non-bypass.

**KB sections to update:**

- RBAC / Client Visibility / Advice Boundary Knowledge
- Safety Gate status
- P0 negative tests

### Prompt 8 — AlphaVest Full-Workflow P0 Smoke Test Mapping

**Goal:** Map existing 10 tests to MVP P0 gates and identify missing negative tests.

**KB sections to update:**

- Test / Acceptance Knowledge
- Codex readiness gates
- Missing test matrix

### Prompt 9 — AlphaVest Full-Workflow Task Master Rebase

**Goal:** Build Codex-ready tasks with target files/routes/components/models/tests.

**KB sections to update:**

- Task Master readiness
- Codex-ready task criteria
- Implementation handoff prerequisites

### Prompt 10 — AlphaVest Final Codex Handoff Builder

**Goal:** Only after all rebase gates pass, create the final implementation-only Codex handoff.

**KB sections to update:**

- Final Codex Readiness
- Handoff artefact registry
- Completed decisions
- Remaining stop rules

---

## 16. Codex Readiness Gates

| Gate | Pass condition | Current status | Evidence required | Related prompt |
|---|---|---|---|---|
| Target Codebase Gate | `full-workflow` locked as target; `main` downgraded to false-gap source. | Mostly passed | Target lock and inventory. | Prompt 1 |
| Source-of-Truth Gate | Source hierarchy accepted and applied. | Partial | KB update after inventory. | Prompt 1 |
| Route Inventory Gate | All 71 routes listed, classified and mapped to route groups/components. | Not passed | Full route inventory. | Prompt 1 |
| Visual Asset Gate | 71 routes reconciled with available assets and missing 064–071 treatment decided. | Not passed | Visual asset matrix. | Prompt 4 |
| State-Screen Gate | Empty/loading/error/permission/gate states mapped to routes. | Not passed | State-screen backlog. | Prompt 4 |
| Interaction Behaviour Gate | Drawer/modal/overlay behaviour specified or verified. | Not passed | Interaction reality audit. | Prompt 5 |
| Workflow Gate | Workflow transitions mapped to roles, evidence, approvals and audit. | Not passed | Workflow/gate audit. | Prompt 7 |
| Schema Reconciliation Gate | Full 42-model schema mapped to patch/domain/data dictionary. | Not passed | Schema reconciliation. | Prompt 6 |
| RBAC Gate | Route/action/payload permissions validated with negative tests. | Not passed | RBAC audit and tests. | Prompt 7 / Prompt 8 |
| Client Visibility Gate | Visibility is proven derived/fail-closed and payload-safe. | Not passed | Visibility engine/payload tests. | Prompt 7 / Prompt 8 |
| Advice Boundary Gate | AI drafts/internal notes cannot leak to client. | Not passed | UI/API/export negative tests. | Prompt 7 / Prompt 8 |
| Evidence Gate | Evidence sufficiency rules verified; upload alone does not unlock gate. | Not passed | Evidence service and workflow tests. | Prompt 7 / Prompt 8 |
| Audit Gate | Critical gate actions persist audit events. | Not passed | Audit service + DB test mapping. | Prompt 7 / Prompt 8 |
| Test Coverage Gate | Existing 10 tests mapped to MVP P0 gates and gaps identified. | Not passed | P0 test mapping. | Prompt 8 |
| Task Master Rebase Gate | Codex tasks reference target files/routes/components/models/tests. | Not passed | Rebased task master. | Prompt 9 |
| Final Handoff Gate | Codex has no product/source/codebase decisions left. | Not passed | Final handoff after all gates. | Prompt 10 |

---

## 17. Risk Register

| Risk | Severity | Cause | Mitigation | Related prompt |
|---|---|---|---|---|
| Main-based false gaps leak into Codex handoff | High | Earlier analysis used wrong codebase. | Freeze and classify all `main` findings. | Prompt 2 |
| Full-workflow assumed complete because it is richer | High | It has APIs, Prisma and tests, but may still be demo-grade. | Run full-workflow readiness rebase. | Prompt 3 |
| Visual states mistaken for real interactions | High | Visual modes and static screen states can look complete. | Interaction reality audit. | Prompt 5 |
| Client Visibility leakage | High | Client payloads may expose drafts/internal notes if not tested. | RBAC/Visibility audit and negative tests. | Prompt 7 / 8 |
| Admin bypass | High | Admin role may be over-permissive. | Permission negative tests. | Prompt 7 / 8 |
| Evidence upload treated as evidence sufficiency | High | Upload flow may unlock states incorrectly. | Evidence gate audit. | Prompt 7 / 8 |
| Schema replacement instead of reconciliation | High | Patch schema differs from richer full schema. | Map, do not replace. | Prompt 6 |
| Existing tests overclaimed as P0 proof | High | Tests exist but may not cover MVP safety gates. | P0 smoke test mapping. | Prompt 8 |
| Docs stale vs code | Medium | Some docs reference 63 pages while code has 71 routes. | Source-of-truth inventory. | Prompt 1 |
| Missing 064–071 visual assets ignored or overbuilt | Medium/high | Route/visual drift unresolved. | Route/visual reconciliation before generation. | Prompt 4 |
| Codex receives tasks before Task Master rebase | High | Existing tasks may point to wrong files or incomplete acceptance. | Rebase tasks only after gates. | Prompt 9 |

---

## 18. Open Decisions

| Decision | Why needed | Current default | Must be resolved by | Blocking |
|---|---|---|---|---|
| Final route universe | 71 routes may include MVP, demo and future pages. | Use full 71 as inventory baseline, not all as MVP. | Prompt 1 / Prompt 4 | Task Master and tests. |
| 064–071 visual treatment | Asset drift likely exists. | Do not generate until route/visual reconciliation. | Prompt 4 | Visual proof and screen specs. |
| MVP vs demo vs future route classification | Prevents overbuild and false MVP claims. | Unknown. | Prompt 1 / Prompt 3 / Prompt 4 | Codex scope. |
| Drawer/modal behaviour standard | Static visual states cannot define implementation behaviour. | Must specify before Codex. | Prompt 5 | Interaction tasks. |
| Schema reconciliation strategy | Full schema and patch/domain model differ. | Reconcile; no blind replacement. | Prompt 6 | DB tasks. |
| Client visibility payload rules | Core no-leakage gate. | Fail-closed, redacted, derived. | Prompt 7 | P0 tests and client routes. |
| P0 negative test scope | Existing tests may miss safety negatives. | Must include leakage, permission, evidence, admin bypass. | Prompt 8 | Final handoff proof. |
| Final Codex task structure | Codex needs executable implementation tasks. | Use file/route/component/model/test references. | Prompt 9 | Final handoff. |

---

## 19. What Must Not Be Done Yet

- No implementation.
- No final Codex handoff.
- No Codex tickets from `main` gaps.
- No blind schema replacement.
- No screen generation before route/visual reconciliation.
- No assumption that existing visual modes are real interactions.
- No assumption that existing tests already prove P0 safety.
- No client-visible AI drafts.
- No manual Client Visibility toggle.
- No admin gate bypass.
- No production integrations.
- No real client pilot.
- No production-grade financial, tax, legal or regulatory advice engine.

---

## 20. Version Log

| Version | Date | Change | Source | Next prompt |
|---|---|---|---|---|
| v0.1 | 2026-06-19 | Initial Living KB created from accumulated recovery knowledge | Current chat, recovery audits and zip inventories | Prompt 1 — AlphaVest Full-Workflow Source-of-Truth Inventory |

---

## 21. Next Action

**Next:** Prompt 1 — AlphaVest Full-Workflow Source-of-Truth Inventory

---

## 22. QA / Proof of ENGINE Phases

### Required QA

| QA check | Result | Evidence in KB |
|---|---|---|
| Was `full-workflow` set as target codebase? | Passed | Sections 0, 2, 5. |
| Was `main` marked as wrong previous analysis basis? | Passed | Sections 0, 2, 6. |
| Was no `main` code finding accepted as target truth? | Passed | Sections 6, 13, 19. |
| Was product knowledge separated from code knowledge? | Passed | Sections 3, 4, 5. |
| Were MVP-control rules preserved? | Passed | Section 4. |
| Were false gaps from `main` included? | Passed | Section 6. |
| Were true full-workflow gap hypotheses included? | Passed | Section 7. |
| Was an update protocol defined for later prompts? | Passed | Section 14. |
| Was the Next Prompt Sequence integrated as KB extension mechanism? | Passed | Section 15. |
| Was no final Codex handoff created? | Passed | Sections 0, 16, 19. |
| Was no implementation proposed? | Passed | Section 19. |
| Was Codex-readiness defined through gates? | Passed | Section 16. |

### ENGINE Phase Proof

#### Phase 1 — Charter / Mission

The mission is to create a living, versioned knowledge base, not to implement AlphaVest or create a final Codex handoff. The KB locks the corrected target: `full-workflow` is the codebase; `main` is the false previous analysis basis.

#### Phase 2 — Evidence

The KB uses evidence from the recovery audits and zip inventories: `full-workflow` has 405 files, 71 route entries, 4 API routes, a 42-model Prisma schema, 10 tests and 63 clean page assets; `main` has 72 files, 16 board routes, no API routes, no Prisma and no tests.

#### Phase 3 — Framing

The problem is framed as knowledge stabilisation during recovery, not as immediate development. This prevents old false gaps from reappearing in later Codex tasks.

#### Phase 4 — Divergence

The KB opens all required knowledge branches: product truth, MVP-control rules, corrected codebase reality, false gaps, true target gap hypotheses, route/visual knowledge, interaction knowledge, Prisma/domain knowledge, RBAC/visibility/advice boundary, tests, artefacts, gates, risks and open decisions.

#### Phase 5 — Contradictions

The KB preserves the central contradiction: previous analysis could contain useful product/control knowledge while still being wrong at the code-reality level. It resolves this by separating `VALID_ONLY_FOR_MAIN_CODEBASE`, `INVALIDATED_BY_MAIN_CODEBASE_MISMATCH`, `VALIDATED_AGAINST_FULL_WORKFLOW`, `VALID_ONLY_AS_PRODUCT_SPEC` and `VALID_ONLY_AS_MVP_CONTROL_RULE`.

#### Phase 6 — Branch Build

Each knowledge branch has its own table, classification logic and next validation prompt. This makes later Codex-readiness possible because future work can point to routes, components, APIs, Prisma models, tests, screens, states and artefacts.

#### Phase 7 — Debate

The KB avoids both extremes: it does not throw away all earlier work, and it does not continue from contaminated `main` findings. The accepted position is controlled rebase.

#### Phase 8 — Adversarial QA

The KB contains built-in protection against repeated errors: false-gap register, risk register, what-not-to-do list, readiness gates and a versioned update protocol.

#### Phase 9 — Convergence

The output converges into a single living document with a clear next action. It does not create competing plans or premature tasks.

#### Phase 10 — Proof

The QA table verifies the requested constraints: correct target codebase, separation of product and code knowledge, preservation of MVP-control rules, no implementation, no final handoff, and Codex readiness only through gates.

#### Phase 11 — Operational Layer

The KB is operational: each future prompt updates specific sections and increments the version. This allows AlphaVest to move step-by-step from recovery to source inventory, gap rebase, task rebase and final Codex handoff without restarting the knowledge base.
