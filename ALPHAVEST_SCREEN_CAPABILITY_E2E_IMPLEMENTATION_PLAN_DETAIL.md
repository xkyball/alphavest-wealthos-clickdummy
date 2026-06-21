# ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md

**Generated:** 2026-06-20
**Mode:** Detaillierter SCF-Implementierungsplan. Keine Implementierung. Keine Codeänderung. Keine Codex-Ausführung. Keine Screen-/Image-Generation.
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`
**Target branch:** `full-workflow`

## 0. Task-/Phasen-Autorität

**Authority updated:** 2026-06-21
**Authority status:** `SOLE_TASK_AND_PHASE_SOURCE_OF_TRUTH`

Dieses Artefakt ist ab sofort die einzige operative Wahrheit für AlphaVest
Tasks, Phasen, Task-IDs, Phasenreihenfolge, Dependencies, Scope-Splits,
Acceptance Criteria, Proof-Pflichten und Stop Rules. Alle älteren
First-Build-, MVP-, V3-, Minimum-Path-, Journey-, Handoff-, Package-Plan-,
Task-Master- und Prompt-Pack-Artefakte sind für Tasks und Phasen nur noch
historische oder unterstützende Referenzen. Sie dürfen keine Task- oder
Phasenreihenfolge definieren, keine Task-IDs hinzufügen oder reaktivieren und
keine SCF-Entscheidung aus diesem Detailplan überstimmen.

Die bindende Task-/Phasenbasis ist:

- Phasen: `P00` bis `P14` aus Abschnitt 7, 8 und 9.
- Tasks: alle `SCF-Pxx-Txxx` Tasks, Subtasks, Dependencies und Proof-Pakete
  dieses Detailplans.
- Build-Sequenz: Abschnitt 28.
- Stop Rules: Abschnitt 29.
- QA-before-Codex Gate: Abschnitt 30 und 31.

Der bisherige First-Build-Handoff bleibt nur als historische
Sicherheits-/Produktregel-Referenz verwendbar, soweit er diesem Detailplan
nicht widerspricht. Bei jedem Konflikt zu Tasks, Phasen, Reihenfolge, Scope,
Readiness oder Proof gilt ausschließlich dieser Detailplan.

## 1. Executive Decision

**Decision:** `SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL_ACCEPTED_WITH_CODEX_HANDOFF_DEPENDENCY`

Dieser Detailplan rebaset den bestehenden `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN.md` in eine abarbeitbare Ebene aus Phasen, Tasks, Subtasks, Dependencies, Target Areas, Akzeptanzkriterien, Testpflichten und Proof-Anforderungen. Er ist die kanonische Task-/Phasenquelle; Implementierung darf erst nach bestandenem Detail-QA-Gate und separatem Prompt Pack oder rebasetem Final Handoff starten.

Der Detailplan ist stärker als der bestehende High-Level-Plan, weil er die 33 Master Tasks in ein Subtask Register mit konkreten späteren Codex-Aktionen übersetzt, die 15 Phasen beibehält, die fünf SCF-Artefakte als bindende Inputs verwendet und jede Task an Route-/Affordance-/Capability-/Thread-/Flow-/Orphan-IDs, Safety, API/Schema, UX States, Tests und Proofs bindet.

**Gültige Produktbau-Reihenfolge:** Foundation → Primary Customer Need Flow → Parallel Signal Flow → Compliance/Visibility → Safety Spine → Trust Output → UI Completion → API/Schema → P0 Tests → Proof/QA → Codex Prompt Pack oder rebaseter Final Handoff.

**Nächster empfohlener Schritt:** `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL_QA.md`. Codex darf erst danach über ein separates Prompt Pack oder ein rebasetes Final Handoff starten.

## 2. Source-of-Truth Lock

| Rank | Source | Role / Use | Forbidden |
| --- | --- | --- | --- |
| 1 | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN.md | Direkter Vorgängerplan: Phasenmodell, Build Path, Master Task Matrix | Nicht als ausreichend detailliert für Codex lesen |
| 2 | ALPHAVEST_E2E_FLOW_CLOSURE_MATRIX.md | Build Path, Flow-Gaps, Safety Spine, Trust Output | Nicht als Code-Implementierung lesen |
| 3 | ALPHAVEST_ORPHAN_UI_FALSE_COMPLETENESS_REGISTER.md | Hide/Remove/Static/Defer/Hold/Implement Entscheidungen | Orphans nicht ignorieren |
| 4 | ALPHAVEST_CUSTOMER_SIGNAL_THREAD_MAP.md | Capability-Wertbeitrag und Flow-Zuordnung | Capabilities ohne Thread nicht build-ready machen |
| 5 | ALPHAVEST_CAPABILITY_CLOSURE_MATRIX.md | Actor/Object/Action/Input/Output/API/Schema/Safety/Test-Mapping | Capability ohne Closure nicht in Task überführen |
| 6 | ALPHAVEST_SCREEN_AFFORDANCE_INVENTORY.md | Sichtbare UI-Elemente, Current Reality, Initial Decision | Visible UI nicht als Verhalten überclaimen |
| 7 | SCF-Konzept, Journey, Handoff, P0, API, Schema, Safety Contracts | Methode, Stop Rules, Journey/Safety/API/Test-Kontext | Nicht als Implementierungsbeweis lesen |
| 8 | full-workflow ZIP / Repo branch full-workflow | Route Registry, Components, APIs, Prisma, Tests, Seeds, Assets | Nicht behaupten ohne Prüfung |
| 9 | main branch / main ZIP | False-gap source only | Nie Target Truth |

## 3. Predecessor Intake Matrix

| Artefact | Exists? | Role | Key Counts / Decisions | Blocking Issues | Use in Detail Plan |
| --- | --- | --- | --- | --- | --- |
| ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN.md | PASS | Direkter Vorgängerplan | 33 Master Tasks, 15 Phasen, Build Path mit E2E-001..004 | Noch nicht subtask-/Codex-granular | Direkte Task- und Phasenbasis |
| ALPHAVEST_SCREEN_AFFORDANCE_INVENTORY.md | PASS | Screen/control baseline | 522 Affordances; Decisions {'implement_candidate': 363, 'static_explicit_candidate': 80, 'defer_candidate': 26, 'reference_only': 11, 'hold_blocked': 42} | Visual/partial/static nicht überclaimen | Source Affordance IDs und UI Completion |
| ALPHAVEST_CAPABILITY_CLOSURE_MATRIX.md | PASS | Capability closure | 522 Capability rows; Decisions {'implement': 363, 'static_explicit': 80, 'defer': 26, 'static explicit': 11, 'hold': 42} | API/Safety/Test closure nicht als implemented lesen | Actor/Object/Action/Input/Output Mapping |
| ALPHAVEST_CUSTOMER_SIGNAL_THREAD_MAP.md | PASS | Need/signal threading | 522 thread rows; Types {'Support / Setup Thread': 118, 'Governance / Non-Bypass Thread': 118, 'Customer Need Thread': 100, 'Signal Processing Thread': 62, 'Orphan / No Thread': 7, 'P1 Deferred Thread': 26, 'Export / Trust Output Thread': 38, 'Reference-only Thread': 11, 'Hold Blocked Thread': 42} | No-thread/weak-thread items nicht bauen | Flow fit und value binding |
| ALPHAVEST_ORPHAN_UI_FALSE_COMPLETENESS_REGISTER.md | PASS | False-completeness control | 519 risk rows; Top types {'Table False Completeness': 224, 'Safety Gap': 150, 'State False Completeness': 56, 'Modal/Drawer False Completeness': 33, 'Wizard False Completeness': 12, 'Form False Completeness': 12} | Orphans nicht verschlucken | Hide/remove/static/defer/hold plan |
| ALPHAVEST_E2E_FLOW_CLOSURE_MATRIX.md | PASS | Flow closure | 4 E2E flows; E2E-001 primary, E2E-002 parallel, E2E-003 safety, E2E-004 trust | Remaining P0/safety/UI/API gaps | Sequencing and flow tasks |

## 4. Detail Plan Derivation Method

```text
1. Source-of-Truth locken
2. Vorgängerplan und fünf SCF-Artefakte einlesen
3. Route/Affordance/Capability/Thread/Orphan/Flow/Task IDs normalisieren
4. Implement / static / hide / remove / defer / hold Entscheidungen konservieren
5. 15-Phasenmodell in detailed work packages rebasen
6. Work packages in Tasks und Subtasks splitten
7. Jede Task an Source IDs, Target Areas, API/Schema/Safety/UX/Test binden
8. Sequenz aus Dependencies ableiten, nicht aus Screen-Reihenfolge
9. Positive und negative Akzeptanz je Task definieren
10. Proof Package je Task und Phase definieren
11. Do-not-build, hold/defer und static Register festschreiben
12. QA vor Codex Prompt Pack erzwingen
```

## 5. Scope / Route / Workset Summary

| Workset | Route Count | Route IDs | Detail Treatment |
| --- | --- | --- | --- |
| MVP | 31 | 008,019,020,027,028,029,030,033,034,035,036,037,038,039,040,041,042,043,044,045,046,047,048,049,050,051,054,055,056,057,058 | Build detail tasks |
| MVP_SUPPORT | 25 | 001,002,003,004,005,006,007,009,010,011,012,013,014,015,016,017,018,021,022,023,024,025,026,031,032 | Build detail tasks |
| P1_AFTER_MVP | 5 | 052,053,059,060,068 | Defer register |
| REFERENCE_ONLY | 3 | 061,062,063 | Reference/static only |
| HOLD_PENDING_DECISION | 7 | 064,065,066,067,069,070,071 | Hold-blocked, no implementation |

## 6. Existing Plan Rebase Summary

| Existing Plan Element | Rebased Detail Treatment | Result |
| --- | --- | --- |
| 15 Phasen | Alle Phasen P00-P14 bleiben erhalten | Detaillierte Phase Tables und Dependency Map |
| 33 Master Tasks | Jede Task erhält Priority, detaillierte Subtasks, Proofs und Status | Master Detailed Task Matrix |
| 522 Affordances / Capabilities | Nicht als flache Ticketliste; in Work Packages verdichtet | Traceability über Wildcards und Route-Gruppen |
| 519 False-Completeness Risiken | In Cleanup, UI Completion, P0 Tests und Do-Not-Implement Register geroutet | Orphan Treatment Plan |
| 4 E2E-Flows | Primary, parallel, safety, trust output als Build Path Layers | Flow-specific task grouping |
| P0 Tests partial | Positive und negative Test Detail Plan ergänzt | P0 proof before acceptance |

## 7. Detailed Phase Overview

| Phase | Name | Task Count | Primary Task IDs | Main Output | Codex Readiness |
| --- | --- | --- | --- | --- | --- |
| P00 | Repo / Artefact Intake & Baseline Verification | 2 | SCF-P00-T001, SCF-P00-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P01 | SCF Normalization & Task Rebase | 2 | SCF-P01-T001, SCF-P01-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P02 | Hide / Remove / Static / Defer / Hold Cleanup | 2 | SCF-P02-T001, SCF-P02-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P03 | Foundation: User / Tenant / Role / Object Scope | 2 | SCF-P03-T001, SCF-P03-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P04 | Primary Customer Need Flow: Evidence Request → Upload → Review | 3 | SCF-P04-T001, SCF-P04-T002, SCF-P04-T003 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P05 | Advisory Signal Flow: Signal → Analyst → Internal Draft → Advisor | 3 | SCF-P05-T001, SCF-P05-T002, SCF-P05-T003 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P06 | Compliance Release / Block / Request Evidence | 2 | SCF-P06-T001, SCF-P06-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P07 | Client Visibility and Decision Projection | 2 | SCF-P07-T001, SCF-P07-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P08 | Governance / Admin Non-Bypass / Cross-Tenant Denial | 2 | SCF-P08-T001, SCF-P08-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P09 | Export / Redaction Trust Output | 2 | SCF-P09-T001, SCF-P09-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P10 | UI Interaction Completeness | 3 | SCF-P10-T001, SCF-P10-T002, SCF-P10-T003 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P11 | API / Schema / Persistence Hardening | 2 | SCF-P11-T001, SCF-P11-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P12 | P0 Positive / Negative Test Closure | 2 | SCF-P12-T001, SCF-P12-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P13 | Proof Package and QA | 2 | SCF-P13-T001, SCF-P13-T002 | Detailed tasks, subtasks, acceptance and proof obligations | Plan-only / later candidate |
| P14 | Codex Prompt Pack / Rebased Final Handoff Derivation | 2 | SCF-P14-T001, SCF-P14-T002 | Detailed tasks, subtasks, acceptance and proof obligations | blocked until QA |

## 8. Phase Dependency Map

```text
P00 Baseline verification
  → P01 SCF normalization
  → P02 hide/remove/static/defer/hold cleanup
  → P03 user/tenant/role/object foundation
  → P04 evidence request/upload/review
  → P05 signal/internal draft/advisor review
  → P06 compliance release/block/request evidence + audit
  → P07 client-safe visibility projection
  → P08 governance/admin non-bypass/cross-tenant denial
  → P09 export/redaction trust output
  → P10 UI interaction completeness
  → P11 API/schema/persistence hardening
  → P12 P0 positive/negative test closure
  → P13 proof package + detail QA
  → P14 Codex prompt pack / rebased final handoff derivation
```

## 9. Detailed Phase Plan — Phase 0 to Phase 14

### P00 — Repo / Artefact Intake & Baseline Verification

| Field | Required Content |
| --- | --- |
| Phase ID | P00 |
| Phase Name | Repo / Artefact Intake & Baseline Verification |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 001-071; all |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Baseline/QA |
| Detailed Tasks | SCF-P00-T001 Baseline aus full-workflow und SCF-Artefakten verifizieren; SCF-P00-T002 Validierungsbefehle und Proof-Package-Baseline festlegen |
| Dependencies | SCF-P00-T001; none |
| Safety Relevance | proof; source-lock |
| Acceptance Criteria | Counts stimmen oder werden TO_VERIFY markiert. / Proof commands sind benannt. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P01 — SCF Normalization & Task Rebase

| Field | Required Content |
| --- | --- |
| Phase ID | P01 |
| Phase Name | SCF Normalization & Task Rebase |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 001-071 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Planning |
| Detailed Tasks | SCF-P01-T001 SCF IDs normalisieren und Task-Backlog aus 522 Affordances bilden; SCF-P01-T002 SCF-Entscheidungen in Implement/Static/Hide/Remove/Defer/Hold splitten |
| Dependencies | SCF-P00-T001; SCF-P01-T001 |
| Safety Relevance | scope guard; traceability |
| Acceptance Criteria | Jede ID ist einem Workset zugeordnet. / Alle Entscheidungen sind in Work Queues. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P02 — Hide / Remove / Static / Defer / Hold Cleanup

| Field | Required Content |
| --- | --- |
| Phase ID | P02 |
| Phase Name | Hide / Remove / Static / Defer / Hold Cleanup |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 052,053,059,060,061,062,063,064,065,066,067,068,069,070,071; MVP_SUPPORT/P1/reference |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Cleanup/Scope; Cleanup/UI |
| Detailed Tasks | SCF-P02-T001 Static-explicit UI cleanup planen; SCF-P02-T002 P1/Reference/Hold Do-Not-Implement Register umsetzen |
| Dependencies | SCF-P01-T002 |
| Safety Relevance | no overclaim; scope guard |
| Acceptance Criteria | Statische Controls sind klar als nicht interaktiv gekennzeichnet. / Do-Not-Implement Register existiert. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P03 — Foundation: User / Tenant / Role / Object Scope

| Field | Required Content |
| --- | --- |
| Phase ID | P03 |
| Phase Name | Foundation: User / Tenant / Role / Object Scope |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 001-006,013-018; 001-071 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Foundation/Safety |
| Detailed Tasks | SCF-P03-T001 Providerless mapped current user und tenant context härten; SCF-P03-T002 Route/action/object/payload permission boundary implementieren |
| Dependencies | SCF-P02-T002; SCF-P03-T001 |
| Safety Relevance | RBAC, payload visibility; RBAC, tenant isolation |
| Acceptance Criteria | Mapped user sieht eigene Tenant/Role Contexts. / Permitted actor sees allowed route/action only. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P04 — Primary Customer Need Flow: Evidence Request → Upload → Review

| Field | Required Content |
| --- | --- |
| Phase ID | P04 |
| Phase Name | Primary Customer Need Flow: Evidence Request → Upload → Review |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 027,028,029,030,038,041,046,047; 028,027; 029,030,046,047,038,039,041 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Evidence/API/UI; Evidence/UI/API; Evidence/Workflow |
| Detailed Tasks | SCF-P04-T001 Evidence Request Status und Needs-Evidence States einführen; SCF-P04-T002 Document Upload UX und API Validierung komplettieren; SCF-P04-T003 Evidence Review/Link/Sufficiency Entscheidung planen |
| Dependencies | SCF-P03-T002; SCF-P04-T001 |
| Safety Relevance | Evidence sufficiency, audit; RBAC, upload-not-sufficiency, audit; evidence sufficiency, audit |
| Acceptance Criteria | Evidence Request führt zu Upload und Review Queue. / Valid upload erzeugt Document/Version/Extraction/Evidence/Audit und erscheint in Liste. ... |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P05 — Advisory Signal Flow: Signal → Analyst → Internal Draft → Advisor

| Field | Required Content |
| --- | --- |
| Phase ID | P05 |
| Phase Name | Advisory Signal Flow: Signal → Analyst → Internal Draft → Advisor |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 033,034,035; 033,034,035,036,037,019,020,054-058; 036,037,038,039,040,043,044,045 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Signal/Safety; Signal/Workflow; Workflow/Safety |
| Detailed Tasks | SCF-P05-T001 Signal Review und Analyst Classification schließen; SCF-P05-T002 AI/rules draft internal-only payload boundary implementieren; SCF-P05-T003 Advisor Approval getrennt von Release implementieren |
| Dependencies | SCF-P03-T002; SCF-P05-T001; SCF-P05-T002 |
| Safety Relevance | AI Draft internal-only, no unapproved advice; advice boundary, audit; advisor-not-release, audit |
| Acceptance Criteria | Analyst klassifiziert Signal und erzeugt internal-only workflow item. / Advisor/Analyst sieht interne Drafts. ... |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P06 — Compliance Release / Block / Request Evidence

| Field | Required Content |
| --- | --- |
| Phase ID | P06 |
| Phase Name | Compliance Release / Block / Request Evidence |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 036-045,048-051,054-058; 038,039,040,041,042,043,044,045 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Safety/Audit; Workflow/Safety |
| Detailed Tasks | SCF-P06-T001 Compliance Release/Block/Request Evidence Gate implementieren; SCF-P06-T002 Critical Gate Audit Persistence sicherstellen |
| Dependencies | SCF-P04-T003,SCF-P05-T003; SCF-P06-T001 |
| Safety Relevance | audit persistence, admin non-bypass; compliance release, evidence sufficiency, audit |
| Acceptance Criteria | Compliance released nur vollständige Fälle. / Gate actions produce actor/role/target/result/prev/next/reason audit rows. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P07 — Client Visibility and Decision Projection

| Field | Required Content |
| --- | --- |
| Phase ID | P07 |
| Phase Name | Client Visibility and Decision Projection |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 019,020,043,044,045,046,047; 043,044,045 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Decision/UI/Safety; Safety/UI/API |
| Detailed Tasks | SCF-P07-T001 Client-safe Visibility Projection implementieren; SCF-P07-T002 Decision Record und Submitted/Released States schließen |
| Dependencies | SCF-P06-T001; SCF-P07-T001 |
| Safety Relevance | client visibility fail-closed, payload redaction; decision/audit/visibility |
| Acceptance Criteria | Released decision appears as safe client summary. / Decision submitted/released state is clear and scoped. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P08 — Governance / Admin Non-Bypass / Cross-Tenant Denial

| Field | Required Content |
| --- | --- |
| Phase ID | P08 |
| Phase Name | Governance / Admin Non-Bypass / Cross-Tenant Denial |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 001-071; 007,008,009,010,017,018,048,049,050,051 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Governance/Safety; Governance/Safety/Test |
| Detailed Tasks | SCF-P08-T001 Role/Access Request Governance Lifecycle schließen; SCF-P08-T002 Cross-tenant/object denial für UI, API und row-level filtering planen |
| Dependencies | SCF-P03-T002; SCF-P08-T001 |
| Safety Relevance | admin non-bypass, RBAC; tenant isolation, row RBAC |
| Acceptance Criteria | Governed role/access change succeeds in scope and is audited. / Allowed rows visible. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P09 — Export / Redaction Trust Output

| Field | Required Content |
| --- | --- |
| Phase ID | P09 |
| Phase Name | Export / Redaction Trust Output |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 019,020,054-058; 054,055,056,057,058,043,044,045,046,047 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Export/Safety; Export/Safety/Test |
| Detailed Tasks | SCF-P09-T001 Export Scope/Redaction/Approval Lifecycle schließen; SCF-P09-T002 Forbidden Payload Assertions für Export und Client Views definieren |
| Dependencies | SCF-P07-T001,SCF-P06-T002; SCF-P09-T001 |
| Safety Relevance | AI draft internal-only, redaction; export redaction, client visibility, audit |
| Acceptance Criteria | Approved export contains only scoped redacted released content. / Export/client payloads are clean. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P10 — UI Interaction Completeness

| Field | Required Content |
| --- | --- |
| Phase ID | P10 |
| Phase Name | UI Interaction Completeness |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 002,005,007,009,010,014,015,018,025,031,040,041,044,048,049,050,057; 003,004,005,006,014,015,018,025,028,054; 003-060 selected MVP/MVP_SUPPORT lists |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | UI/API/Safety; UI/Safety |
| Detailed Tasks | SCF-P10-T001 Search/Sort/Filter/Table Behaviour Work Package; SCF-P10-T002 Forms/Wizards/Input Masks Completion Work Package; SCF-P10-T003 Drawer/Modal/Confirmation Lifecycle Work Package |
| Dependencies | SCF-P02-T001; SCF-P02-T001,SCF-P08-T002 |
| Safety Relevance | permission/audit where safety-sensitive; release/export/admin/evidence audit; row RBAC, payload visibility |
| Acceptance Criteria | Built search/filter changes scoped data or clearly static-labels. / Valid submit mutates intended object or clearly static-labels. ... |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P11 — API / Schema / Persistence Hardening

| Field | Required Content |
| --- | --- |
| Phase ID | P11 |
| Phase Name | API / Schema / Persistence Hardening |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | MVP routes using APIs; all MVP data routes |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | API/Safety; Schema/Data/Safety |
| Detailed Tasks | SCF-P11-T001 Existing API hardening without blind new routes; SCF-P11-T002 Prisma usage and schema alignment planning |
| Dependencies | SCF-P03..P10 tasks; SCF-P11-T001 |
| Safety Relevance | RBAC/visibility/evidence/audit/export; schema support for safety |
| Acceptance Criteria | Valid requests produce scoped response. / Models/fields support flow state and audit. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P12 — P0 Positive / Negative Test Closure

| Field | Required Content |
| --- | --- |
| Phase ID | P12 |
| Phase Name | P0 Positive / Negative Test Closure |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 019,020,027-030,036-041,043-047; 033-058,007-010,017-018,048-051 |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Test/P0 |
| Detailed Tasks | SCF-P12-T001 E2E-001 P0 Test Closure; SCF-P12-T002 E2E-002/E2E-003/E2E-004 Negative Safety Test Closure |
| Dependencies | SCF-P04..P07; SCF-P05..P11 |
| Safety Relevance | P0 safety gates; P0 upload/evidence/advisor/compliance/visibility |
| Acceptance Criteria | Happy path releases safe summary. / Safety positive proof where relevant. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P13 — Proof Package and QA

| Field | Required Content |
| --- | --- |
| Phase ID | P13 |
| Phase Name | Proof Package and QA |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | 001-071; all |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | QA; QA/Proof |
| Detailed Tasks | SCF-P13-T001 Proof Package: route/capability/flow/task coverage report; SCF-P13-T002 SCF Implementation Plan QA durchführen |
| Dependencies | SCF-P12-T001,SCF-P12-T002; SCF-P13-T001 |
| Safety Relevance | QA gates; proof |
| Acceptance Criteria | Every selected task has proof evidence. / QA passes without untracked tasks. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

### P14 — Codex Prompt Pack / Rebased Final Handoff Derivation

| Field | Required Content |
| --- | --- |
| Phase ID | P14 |
| Phase Name | Codex Prompt Pack / Rebased Final Handoff Derivation |
| Purpose | Den in dieser Phase gebündelten SCF-/Safety-/Flow-Scope in konkrete spätere Arbeit übersetzen. |
| Source Artefacts | Vorgängerplan + fünf SCF-Artefakte + relevante API/Schema/Safety/Test-Verträge |
| Input IDs | selected tasks |
| Output | Task-/Subtask-Detail, Acceptance, Proof und Stop Rules für diese Phase |
| Task Groups | Handoff/Final; Handoff/Prompt |
| Detailed Tasks | SCF-P14-T001 SCF Codex Prompt Pack ableiten; SCF-P14-T002 Rebased Final Handoff optional erstellen |
| Dependencies | SCF-P13-T002; SCF-P14-T001 |
| Safety Relevance | all safety contracts |
| Acceptance Criteria | Prompt pack contains all implementation candidates. / Handoff authorizes only locked tasks. |
| Proof Required | Tests, logs, audit rows, route/API proof, screenshots if applicable, no-generation proof |
| Stop Rules | Keine Implementierung in diesem Artefakt; keine P1/Hold/Reference-Elevation; kein Visual-as-behaviour |
| Codex Readiness | plan-only; later candidate only after Detail QA |

## 10. Master Detailed Task Matrix

Die Matrix enthält alle 33 Master Tasks aus dem Vorgängerplan, ergänzt um Priority, Subtask-Verweise und Proof-Disziplin.

| Task ID | Phase | Task Name | Task Type | Task Priority | Source Route IDs | Source Affordance IDs | Source Capability IDs | Source Thread IDs | Source Flow IDs | Source Orphan IDs | Target Files / Areas | Implementation Intent | Detailed Subtasks | Non-Goals | API Dependencies | Schema Dependencies | Safety Dependencies | UX State Dependencies | Positive Acceptance | Negative Acceptance | Test Obligation | Dependency Order | Proof Required | DoD | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P00-T001 | P00 | Baseline aus full-workflow und SCF-Artefakten verifizieren | Baseline/QA | P0 | 001-071 | all | all | all | E2E-001..004 | all | package.json, lib/route-registry.ts, app/[...segments]/page.tsx, prisma/schema.prisma, tests/* | Prüfe 71 Routes, Scope-Labels, 4 API-Routen, 42 Modelle, 10 Specs, 63 PNGs und SCF-Counts gegen Artefakte. | SCF-P00-T001-S01, SCF-P00-T001-S02, SCF-P00-T001-S03 | Keine Codeänderung, keine Korrektur im Repo. | none | none | source-lock | n/a | Counts stimmen oder werden TO_VERIFY markiert. | Abweichung blockiert Planübergabe. | phase:check / route-smoke später | none | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Planbaseline ist dokumentiert und Abweichungen sind blockiert. | plan_only |
| SCF-P00-T002 | P00 | Validierungsbefehle und Proof-Package-Baseline festlegen | Baseline/QA | P0 | all | all | all | all | all | all | package.json, playwright.config.ts | Lege spätere Mindestbefehle fest: pnpm typecheck, lint, db:validate, build, playwright tests und relevante smoke/phase checks. | SCF-P00-T002-S01, SCF-P00-T002-S02, SCF-P00-T002-S03 | Befehle jetzt nicht ausführen. | none | none | proof | loading/error for proof logs | Proof commands sind benannt. | Fehlende Command-Verfügbarkeit wird blockiert. | pnpm phase:check; pnpm test:playwright später | SCF-P00-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Proof-Befehle sind Teil der DoD. | plan_only |
| SCF-P01-T001 | P01 | SCF IDs normalisieren und Task-Backlog aus 522 Affordances bilden | Planning | P1 | 001-071 | A-* | CAP-* | T-* | E2E-* | O-* | SCF artefacts | Normalisiere Affordance-, Capability-, Thread-, Orphan- und Flow-IDs in ein taskfähiges Register. | SCF-P01-T001-S01, SCF-P01-T001-S02, SCF-P01-T001-S03 | Keine Implementierung einzelner Affordances. | none | none | traceability | n/a | Jede ID ist einem Workset zugeordnet. | Unbekannte ID wird nicht gebaut. | n/a | SCF-P00-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Traceability ist vollständig. | implementation_candidate |
| SCF-P01-T002 | P01 | SCF-Entscheidungen in Implement/Static/Hide/Remove/Defer/Hold splitten | Planning | P1 | 001-071 | A-* | CAP-* | T-* | E2E-* | O-* | SCF artefacts | Erzeuge Plan-Queues: 363 implement, 80 static explicit, 26 defer, 42 hold, 11 reference/static. | SCF-P01-T002-S01, SCF-P01-T002-S02, SCF-P01-T002-S03 | Keine P1/Hold-Elevation. | none | none | scope guard | n/a | Alle Entscheidungen sind in Work Queues. | P1/Hold bleibt blockiert. | n/a | SCF-P01-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Queues sind prüfbar. | implementation_candidate |
| SCF-P02-T001 | P02 | Static-explicit UI cleanup planen | Cleanup/UI | P1 | MVP_SUPPORT/P1/reference | A-*-SEARCH/FILTER/SORT/ROW-ACTION where static | CAP-* static_explicit | T-* support/defer/reference | none | O-* static_explicit | components/*, components/ui/* | Markiere sichtbare aber nicht zu bauende Controls als statisch, disabled oder explanatory, damit kein falscher Funktionsanspruch entsteht. | SCF-P02-T001-S01, SCF-P02-T001-S02, SCF-P02-T001-S03, SCF-P02-T001-S04 | Kein Entfernen ohne Source-Entscheidung. | none | none | no overclaim | disabled/empty/static states | Statische Controls sind klar als nicht interaktiv gekennzeichnet. | Nutzer kann keine Mutation/Filterung erwarten. | visual/route smoke später | SCF-P01-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | 80 static-explicit Kandidaten sind abgearbeitet oder begründet defered. | cleanup_candidate |
| SCF-P02-T002 | P02 | P1/Reference/Hold Do-Not-Implement Register umsetzen | Cleanup/Scope | Hold | 052,053,059,060,061,062,063,064,065,066,067,068,069,070,071 | A-052*..A-071* | CAP-052*..CAP-071* | P1/Hold/Reference | deferred/hold | O-* defer/hold/reference | routes/components/docs | Sichere P1, Reference-only und Hold Routen gegen versehentliche MVP-Tasks. | SCF-P02-T002-S01, SCF-P02-T002-S02, SCF-P02-T002-S03, SCF-P02-T002-S04 | Keine Implementierung der Hold-Routen. | none | none | scope guard | hold/defer/reference states | Do-Not-Implement Register existiert. | Codex würde Hold nicht bauen. | n/a | SCF-P01-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | P1/Hold/Reference sind blockiert. | blocked |
| SCF-P03-T001 | P03 | Providerless mapped current user und tenant context härten | Foundation/Safety | P0 | 001-006,013-018 | A-001*,A-002*,A-003*,A-004*,A-005*,A-006*,A-013*..A-018* | CAP-* SETUP | T-SETUP,T-GOV-NONBYPASS | E2E-003 | O-* Safety Gap setup | components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts | Provider kann technisch stub bleiben, aber UI/API/Services müssen deterministischen User, Tenant, Rollen, Membership und Object Scope nutzen. | SCF-P03-T001-S01, SCF-P03-T001-S02, SCF-P03-T001-S03, SCF-P03-T001-S04, SCF-P03-T001-S05 | Keine Produktion-IAM bauen. | /api/demo-workflow TO_VERIFY current actor usage | User, UserRole, Role, ClientTenant | RBAC, tenant isolation | permission denied/loading states | Mapped user sieht eigene Tenant/Role Contexts. | Unknown/wrong tenant fail-closed und kein Payload-Leak. | permission-engine.spec.ts update; route-smoke targeted | SCF-P02-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Session-Kontext ist deterministisch und tenant-scoped. | implementation_candidate |
| SCF-P03-T002 | P03 | Route/action/object/payload permission boundary implementieren | Foundation/Safety | P0 | 001-071 | A-*-NAV,A-*-VIEW,A-*-ROW-ACTION | CAP-* NAV/VIEW/SELECT | T-GOV-NONBYPASS,T-SETUP | E2E-003 | O-* Safety Gap | lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx | Trenne Route Shell, Action Permission, Object Scope und Payload Visibility für alle MVP/MVP_SUPPORT Flows. | SCF-P03-T002-S01, SCF-P03-T002-S02, SCF-P03-T002-S03, SCF-P03-T002-S04, SCF-P03-T002-S05 | Route access darf keine Payload-Rechte bedeuten. | /api/demo-workflow,/api/documents | Role, Permission, UserRole, RolePermission | RBAC, payload visibility | permission denied/hidden states | Permitted actor sees allowed route/action only. | Route shell ohne action/payload permission bleibt hidden/denied. | permission-engine.spec.ts; route smoke negative candidates | SCF-P03-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | RBAC-Layer trennt Route/Action/Payload. | implementation_candidate |
| SCF-P04-T001 | P04 | Evidence Request Status und Needs-Evidence States einführen | Evidence/UI/API | P0 | 027,028,029,030,038,041,046,047 | A-027*,A-028*,A-029*,A-030*,A-041*,A-046*,A-047* | CAP-* EVIDENCE/UPLOAD/REVIEW | T-EVIDENCE-SUFFICIENCY,T-CUSTOMER-EVIDENCE | E2E-001 | O-* Audit/Evidence Overclaim Risk | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts | Plane UI/API/State für Evidence Request, Review Pending, Linked, Sufficient/Insufficient ohne Upload-Overclaim. | SCF-P04-T001-S01, SCF-P04-T001-S02, SCF-P04-T001-S03, SCF-P04-T001-S04, SCF-P04-T001-S05 | Upload allein darf nie Sufficiency setzen. | /api/documents,/api/documents/upload,/api/demo-workflow | Document, DocumentReview, DocumentLink, EvidenceRecord, EvidenceItem | Evidence sufficiency, audit | needs evidence, upload in progress/failed/success | Evidence Request führt zu Upload und Review Queue. | Upload success bleibt upload-only; insufficient evidence blockt release. | document-upload-api/flow + new evidence sufficiency negatives | SCF-P03-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Evidence Lifecycle hat explizite States und P0 Tests. | implementation_candidate |
| SCF-P04-T002 | P04 | Document Upload UX und API Validierung komplettieren | Evidence/API/UI | P0 | 028,027 | A-028-FILE,A-028-SUBMIT,A-028-STATES,A-027-VIEW | CAP-028-UPLOAD* | T-CUSTOMER-EVIDENCE | E2E-001 | O-028* | components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts | Harte Validierung für file type/size/tenant/role/context, Retry, Fehler und reload-proof Liste. | SCF-P04-T002-S01, SCF-P04-T002-S02, SCF-P04-T002-S03, SCF-P04-T002-S04, SCF-P04-T002-S05 | Keine Malware/production storage versprechen, wenn nicht gebaut. | /api/documents/upload,/api/documents | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, AuditEvent | RBAC, upload-not-sufficiency, audit | upload progress/fail/success-only | Valid upload erzeugt Document/Version/Extraction/Evidence/Audit und erscheint in Liste. | Forbidden role/unsupported file/wrong tenant erzeugt keine sichtbare Row; denied audit. | document-upload-api.spec.ts; document-upload-flow.spec.ts | SCF-P04-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Upload ist robust, aber nicht Sufficiency. | implementation_candidate |
| SCF-P04-T003 | P04 | Evidence Review/Link/Sufficiency Entscheidung planen | Evidence/Workflow | P0 | 029,030,046,047,038,039,041 | A-029*,A-030*,A-046*,A-047*,A-038*,A-039*,A-041* | CAP-* REVIEW,EVIDENCE | T-EVIDENCE-SUFFICIENCY | E2E-001 | O-* Evidence/Safety Gap | lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx | Erstelle Work Package für Review, Link zu Recommendation/Decision/Compliance und Sufficiency Entscheidung. | SCF-P04-T003-S01, SCF-P04-T003-S02, SCF-P04-T003-S03, SCF-P04-T003-S04, SCF-P04-T003-S05 | Keine automatische Sufficiency aus Dokumentenstatus. | /api/demo-workflow candidate only; TO_VERIFY if existing action fits | DocumentReview, DocumentLink, EvidenceRecord, ComplianceReview | evidence sufficiency, audit | needs evidence/block/success | Reviewer kann Evidence linking/sufficiency begründet markieren. | Unlinked/stale/unreviewed evidence blockiert Release. | workflow-gate.spec.ts update; new evidence-service test candidate | SCF-P04-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Sufficiency ist explizit und testbar. | implementation_candidate |
| SCF-P05-T001 | P05 | Signal Review und Analyst Classification schließen | Signal/Workflow | P0 | 033,034,035 | A-033*,A-034*,A-035* | CAP-* SIGNAL/REVIEW | T-SIGNAL-PROCESSING | E2E-002 | O-* Safety/State Gap signal | components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts | Signal/Trigger wird intern klassifiziert, priorisiert und zur Draft/Review-Arbeit geroutet. | SCF-P05-T001-S01, SCF-P05-T001-S02, SCF-P05-T001-S03, SCF-P05-T001-S04, SCF-P05-T001-S05 | Keine automatische Advice-Ausführung. | /api/demo-workflow | Trigger, ActionItem, Recommendation | advice boundary, audit | review pending/block/success | Analyst klassifiziert Signal und erzeugt internal-only workflow item. | Signal erzeugt keinen client-visible payload. | demo-workflow-api.spec.ts; workflow-gate.spec.ts | SCF-P03-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Signal flow bleibt internal-only. | implementation_candidate |
| SCF-P05-T002 | P05 | AI/rules draft internal-only payload boundary implementieren | Signal/Safety | P0 | 033,034,035,036,037,019,020,054-058 | A-033*,A-034*,A-035*,A-019*,A-020*,A-054*..A-058* | CAP-* DRAFT/VIEW/EXPORT | T-SIGNAL-PROCESSING,T-CLIENT-VISIBILITY,T-EXPORT-TRUST | E2E-002,E2E-004 | O-* AI/internal leakage | lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx | Stelle sicher, dass AI/rules draft, internal rationale, analyst notes und compliance notes nur intern bleiben. | SCF-P05-T002-S01, SCF-P05-T002-S02, SCF-P05-T002-S03, SCF-P05-T002-S04, SCF-P05-T002-S05 | Keine production AI engine bauen. | /api/demo-workflow,/api/documents TO_VERIFY payloads | Recommendation.summaryInternal, clientSummaryDraft, Decision, ExportRequest | AI Draft internal-only, no unapproved advice | redacted/internal-only states | Advisor/Analyst sieht interne Drafts. | Client/API/export sieht keine Drafts/internal rationale. | new visibility/export payload negative tests | SCF-P05-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | AI Draft Leakage ist negativ getestet. | implementation_candidate |
| SCF-P05-T003 | P05 | Advisor Approval getrennt von Release implementieren | Workflow/Safety | P0 | 036,037,038,039,040,043,044,045 | A-036*,A-037*,A-038*,A-039*,A-040*,A-043*,A-044*,A-045* | CAP-* APPROVE/RELEASE/DECISION | T-SIGNAL-PROCESSING,T-CUSTOMER-EVIDENCE | E2E-001,E2E-002 | O-* Release Overclaim Risk | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts | Advisor approval setzt nur compliance-pending; Release bleibt Compliance-only. | SCF-P05-T003-S01, SCF-P05-T003-S02, SCF-P05-T003-S03, SCF-P05-T003-S04, SCF-P05-T003-S05 | Advisor darf keine clientVisible/released flags setzen. | /api/demo-workflow | Approval, Recommendation, ComplianceReview, Decision | advisor-not-release, audit | approval pending/release pending | Advisor approval erzeugt pending compliance state. | Client visibility bleibt hidden bis Compliance Release. | workflow-gate.spec.ts; demo-workflow-api.spec.ts negative | SCF-P05-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Advisor approval != release ist bewiesen. | implementation_candidate |
| SCF-P06-T001 | P06 | Compliance Release/Block/Request Evidence Gate implementieren | Workflow/Safety | P0 | 038,039,040,041,042,043,044,045 | A-038*,A-039*,A-040*,A-041*,A-042*,A-043*,A-044*,A-045* | CAP-* RELEASE/BLOCK/AUDIT/DECISION | T-CUSTOMER-EVIDENCE,T-SIGNAL-PROCESSING | E2E-001,E2E-002 | O-* Safety Gap compliance | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts | Compliance kann Release, Block oder Request Evidence nur nach advisor/evidence/audit/precondition checks durchführen. | SCF-P06-T001-S01, SCF-P06-T001-S02, SCF-P06-T001-S03, SCF-P06-T001-S04, SCF-P06-T001-S05 | Kein upload-to-release shortcut. | /api/demo-workflow | ComplianceReview, Approval, EvidenceRecord, Decision, AuditEvent | compliance release, evidence sufficiency, audit | blocked/release pending/compliance blocked | Compliance released nur vollständige Fälle. | Missing advisor/evidence/audit blocks release and hides client payload. | workflow-gate.spec.ts; new compliance E2E/API negative | SCF-P04-T003,SCF-P05-T003 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Compliance Gate ist fail-closed. | implementation_candidate |
| SCF-P06-T002 | P06 | Critical Gate Audit Persistence sicherstellen | Safety/Audit | P0 | 036-045,048-051,054-058 | A-*-WORKFLOW-ACTION,A-*-GOVERNANCE,A-*-EXPORT | CAP-* AUDIT/APPROVE/RELEASE/EXPORT | T-GOV-NONBYPASS,T-EVIDENCE,T-EXPORT | E2E-001..004 | O-* Audit Overclaim Risk | lib/audit-service.ts, prisma/schema.prisma, tests/* | Jede kritische Aktion schreibt AuditEvent oder bleibt pending/denied. Audit display zählt nicht als persistence. | SCF-P06-T002-S01, SCF-P06-T002-S02, SCF-P06-T002-S03, SCF-P06-T002-S04, SCF-P06-T002-S05 | Keine veränderlichen/überschreibenden Audit-Events. | /api/demo-workflow,/api/documents/upload | AuditEvent | audit persistence, admin non-bypass | audit unavailable fail-closed | Gate actions produce actor/role/target/result/prev/next/reason audit rows. | Audit failure prevents release/export/permission mutation. | permission-engine.spec.ts; document-upload-api.spec.ts; new audit-fail test candidate | SCF-P06-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Audit ist Voraussetzung für Safety Proof. | implementation_candidate |
| SCF-P07-T001 | P07 | Client-safe Visibility Projection implementieren | Safety/UI/API | P0 | 019,020,043,044,045,046,047 | A-019*,A-020*,A-043*,A-044*,A-045*,A-046*,A-047* | CAP-* VIEW/VISIBILITY/DECISION/EVIDENCE | T-CLIENT-VISIBILITY,T-CUSTOMER-EVIDENCE | E2E-001,E2E-002 | O-* Visibility/Safety Gap | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts | Client sieht nur released/redacted/client-safe summary; unreleased/internal-only bleibt hidden/redacted. | SCF-P07-T001-S01, SCF-P07-T001-S02, SCF-P07-T001-S03, SCF-P07-T001-S04, SCF-P07-T001-S05 | Keine manuelle Visibility Override. | /api/documents,/api/demo-workflow TO_VERIFY payloads | Decision, Recommendation, EvidenceRecord, Document, PolicyDefinition | client visibility fail-closed, payload redaction | hidden/redacted/empty/error | Released decision appears as safe client summary. | Client cannot see AI draft/internal rationale/compliance notes/unreleased evidence. | new client-visibility route/API negative tests | SCF-P06-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Client projection ist fail-closed. | implementation_candidate |
| SCF-P07-T002 | P07 | Decision Record und Submitted/Released States schließen | Decision/UI/Safety | P0 | 043,044,045 | A-043*,A-044*,A-045* | CAP-* DECISION/STATE | T-CUSTOMER-EVIDENCE,T-SIGNAL-PROCESSING | E2E-001,E2E-002 | O-* State False Completeness decision | components/decisions-governance-screen.tsx, lib/workflow-gate.ts | Decision record zeigt Status, evidence linkage, releasedToClientAt und audit summary ohne Gate-Overclaim. | SCF-P07-T002-S01, SCF-P07-T002-S02, SCF-P07-T002-S03, SCF-P07-T002-S04, SCF-P07-T002-S05 | Decision submitted ist nicht Client Acceptance. | /api/demo-workflow | Decision, EvidenceRecord, AuditEvent | decision/audit/visibility | submitted/released/blocked states | Decision submitted/released state is clear and scoped. | Submitted without release stays internal/hidden. | workflow-gate and route tests | SCF-P07-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Decision states overclaimen nicht. | implementation_candidate |
| SCF-P08-T001 | P08 | Role/Access Request Governance Lifecycle schließen | Governance/Safety | P0 | 007,008,009,010,017,018,048,049,050,051 | A-007*,A-008*,A-009*,A-010*,A-017*,A-018*,A-048*,A-049*,A-050*,A-051* | CAP-* ADMIN/GOVERNANCE/ACCESS | T-GOV-NONBYPASS | E2E-003 | O-* Governance Safety Gap | components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts | Role changes, access requests, second confirmations and governance actions obey tenant/object scope. | SCF-P08-T001-S01, SCF-P08-T001-S02, SCF-P08-T001-S03, SCF-P08-T001-S04, SCF-P08-T001-S05 | Admin darf keine advice/release/export gates umgehen. | /api/demo-workflow candidate; TO_VERIFY existing action families | Role, Permission, UserRole, AccessRequest, SecondConfirmation, AuditEvent | admin non-bypass, RBAC | permission denied/validation/success | Governed role/access change succeeds in scope and is audited. | Admin cannot force release/export/visibility/evidence sufficiency. | permission-engine.spec.ts; new admin-bypass tests | SCF-P03-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Governance ist auditierbar und non-bypass. | implementation_candidate |
| SCF-P08-T002 | P08 | Cross-tenant/object denial für UI, API und row-level filtering planen | Governance/Safety/Test | P0 | 001-071 | A-*-VIEW,A-*-SEARCH,A-*-FILTER,A-*-ROW-ACTION | CAP-* VIEW/SEARCH/FILTER/SELECT | T-GOV-NONBYPASS | E2E-003 | O-* Table False Completeness | lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx | Such-, Filter-, Listen- und Row-Actions filtern tenant/object scoped und fail-closed. | SCF-P08-T002-S01, SCF-P08-T002-S02, SCF-P08-T002-S03, SCF-P08-T002-S04, SCF-P08-T002-S05 | Keine Suchergebnisse aus fremden Tenants. | /api/documents,/api/demo-workflow,/api/review-monitoring TO_VERIFY | UserRole, ClientTenant, Document, Decision, ExportRequest | tenant isolation, row RBAC | empty/denied/error | Allowed rows visible. | Cross-tenant rows hidden/denied and no leaked counts/details. | permission-engine spec update; list route tests | SCF-P08-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Row-level RBAC ist Teil jeder List/Table-Aufgabe. | implementation_candidate |
| SCF-P09-T001 | P09 | Export Scope/Redaction/Approval Lifecycle schließen | Export/Safety | P0 | 054,055,056,057,058,043,044,045,046,047 | A-054*,A-055*,A-056*,A-057*,A-058*,A-043*,A-044*,A-045*,A-046*,A-047* | CAP-* EXPORT/DECISION/EVIDENCE | T-EXPORT-TRUST,T-CLIENT-VISIBILITY | E2E-004 | O-* Export Overclaim Risk | components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts | Export trennt scope, redaction, preview, approval und download/share; package nur aus released/redacted content. | SCF-P09-T001-S01, SCF-P09-T001-S02, SCF-P09-T001-S03, SCF-P09-T001-S04, SCF-P09-T001-S05 | Preview ist nicht Approval; Approval ist nicht Download. | /api/demo-workflow candidate; no new API unless final decision | ExportRequest, Decision, EvidenceRecord, Document, AuditEvent | export redaction, client visibility, audit | export pending/failed/success | Approved export contains only scoped redacted released content. | Unapproved/unredacted/internal payload blocks download/share. | file-export-realism.spec.ts update; new export route/API negative | SCF-P07-T001,SCF-P06-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Export ist trust output nach Release. | implementation_candidate |
| SCF-P09-T002 | P09 | Forbidden Payload Assertions für Export und Client Views definieren | Export/Safety/Test | P0 | 019,020,054-058 | A-019*,A-020*,A-054*..A-058* | CAP-* VISIBILITY/EXPORT | T-CLIENT-VISIBILITY,T-EXPORT-TRUST | E2E-004,E2E-001,E2E-002 | O-* Export/Visibility Risk | lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts | Definiere Tests für keine AI Drafts, internal rationale, compliance notes, unreleased evidence oder hidden fields im Client/Export Payload. | SCF-P09-T002-S01, SCF-P09-T002-S02, SCF-P09-T002-S03, SCF-P09-T002-S04, SCF-P09-T002-S05 | Keine Felder blind entfernen ohne Mapping. | /api/demo-workflow,/api/documents TO_VERIFY | Recommendation, ComplianceReview, EvidenceRecord, ExportRequest | AI draft internal-only, redaction | hidden/redacted | Export/client payloads are clean. | Forbidden payload test fails if internal field appears. | new payload assertion tests | SCF-P09-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Forbidden payloads sind negativ geprüft. | implementation_candidate |
| SCF-P10-T001 | P10 | Search/Sort/Filter/Table Behaviour Work Package | UI/API/Safety | P0 | 003-060 selected MVP/MVP_SUPPORT lists | A-*-SEARCH,A-*-FILTER,A-*-SORT,A-*-ROW-ACTION | CAP-* SEARCH/FILTER/SORT/SELECT | T-* | E2E-001..004 | O-* Table False Completeness | components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components | Implementiere oder static-label alle sichtbaren Search/Sort/Filter/Row Actions; URL state and RBAC row filtering where built. | SCF-P10-T001-S01, SCF-P10-T001-S02, SCF-P10-T001-S03, SCF-P10-T001-S04, SCF-P10-T001-S05 | Nicht jede Tabelle muss voll interaktiv werden; static/hide erlaubt. | /api/documents,/api/demo-workflow,/api/review-monitoring TO_VERIFY | various list models | row RBAC, payload visibility | empty/error/loading/no-results | Built search/filter changes scoped data or clearly static-labels. | Search/filter cannot leak hidden rows or counts. | new UI/API negative tests per built list | SCF-P02-T001,SCF-P08-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | 224 table false-completeness risks sind entschieden. | implementation_candidate |
| SCF-P10-T002 | P10 | Forms/Wizards/Input Masks Completion Work Package | UI/API/Safety | P0 | 003,004,005,006,014,015,018,025,028,054 | A-*-FORM,A-*-WIZARD,A-*-SUBMIT | CAP-* CREATE/EDIT/UPLOAD | T-SETUP,T-EVIDENCE,T-EXPORT | E2E-001,E2E-003,E2E-004 | O-* Form/Wizard False Completeness | components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx | Für gebaute Forms/Wizards: required fields, validation, save/submit, cancel, API target, schema mapping and errors. | SCF-P10-T002-S01, SCF-P10-T002-S02, SCF-P10-T002-S03, SCF-P10-T002-S04, SCF-P10-T002-S05 | Wizard stepper allein ist kein Wizard. | existing APIs or candidate_requires_final_decision | UserProfile, ClientTenant, Entity, Document, ExportRequest | permission/audit where safety-sensitive | validation failed/save success/error | Valid submit mutates intended object or clearly static-labels. | Invalid/missing fields do not mutate; unauthorized denied. | form/flow tests candidates | SCF-P02-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Form/Wizard false completeness ist geschlossen. | implementation_candidate |
| SCF-P10-T003 | P10 | Drawer/Modal/Confirmation Lifecycle Work Package | UI/Safety | P0 | 002,005,007,009,010,014,015,018,025,031,040,041,044,048,049,050,057 | A-*-MODAL,A-*-DRAWER,A-*-CONFIRM | CAP-* REVIEW/APPROVE/RELEASE/ADMIN/EXPORT | T-* | E2E-001..004 | O-* Modal/Drawer False Completeness | components/ui/modal.tsx, components/ui/drawer.tsx, affected screens | Open/close/cancel/submit, Escape/focus/accessibility, validation, confirmation phrases and audit where safety critical. | SCF-P10-T003-S01, SCF-P10-T003-S02, SCF-P10-T003-S03, SCF-P10-T003-S04, SCF-P10-T003-S05 | Close/cancel darf nicht mutieren. | existing APIs or candidate_requires_final_decision | various | release/export/admin/evidence audit | modal open/closed/error/success | Submit works after validation and permission. | Cancel/backdrop/Escape preserve data and do not mutate. | Playwright UI lifecycle tests candidates | SCF-P02-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | 33 overlay false completeness risks sind geschlossen. | implementation_candidate |
| SCF-P11-T001 | P11 | Existing API hardening without blind new routes | API/Safety | P0 | MVP routes using APIs | A-* API-backed | CAP-* API-backed | T-* | E2E-001..004 | O-* API/Safety Gap | app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts | Härten der vier existierenden APIs: validation, status codes, permission checks, redaction, error fail-closed. | SCF-P11-T001-S01, SCF-P11-T001-S02, SCF-P11-T001-S03, SCF-P11-T001-S04, SCF-P11-T001-S05 | Keine neue API Route ohne final decision. | all existing four APIs | current schema only unless proven gap | RBAC/visibility/evidence/audit/export | API error/loading/success | Valid requests produce scoped response. | Invalid/unauthorized/error does not advance workflow or expose data. | demo-workflow-api, document-upload-api, review-monitoring tests | SCF-P03..P10 tasks | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | API presence wird safety-proof. | implementation_candidate |
| SCF-P11-T002 | P11 | Prisma usage and schema alignment planning | Schema/Data/Safety | P0 | all MVP data routes | A-* data-backed | CAP-* data-backed | T-* | E2E-001..004 | O-* schema gaps | prisma/schema.prisma, lib/* services, prisma/seed.ts | Aligniere Nutzung auf vorhandene 42 Modelle/22 Enums; Schemaänderung nur wenn SCF/P0-Lücke nicht anders lösbar ist. | SCF-P11-T002-S01, SCF-P11-T002-S02, SCF-P11-T002-S03, SCF-P11-T002-S04, SCF-P11-T002-S05 | Kein patch schema replacement. | n/a | Document, EvidenceRecord, Recommendation, Approval, ComplianceReview, Decision, AuditEvent, ExportRequest, Role/UserRole | schema support for safety | n/a | Models/fields support flow state and audit. | No missing field is silently faked in UI. | db:validate; service tests | SCF-P11-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Schema alignment ist dokumentiert und minimal. | implementation_candidate |
| SCF-P12-T001 | P12 | E2E-001 P0 Test Closure | Test/P0 | P0 | 019,020,027-030,036-041,043-047 | A-027*..A-047*,A-019*,A-020* | CAP-* E2E-001 | T-CUSTOMER-EVIDENCE,T-CLIENT-VISIBILITY | E2E-001 | O-* primary | tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates | Positive and negative Tests für evidence request/upload/review/approval/release/visibility. | SCF-P12-T001-S01, SCF-P12-T001-S02, SCF-P12-T001-S03, SCF-P12-T001-S04, SCF-P12-T001-S05 | Keine Testannahme ohne code path. | /api/documents/upload,/api/documents,/api/demo-workflow | Document/Evidence/Decision/Audit | P0 upload/evidence/advisor/compliance/visibility | all flow states | Happy path releases safe summary. | Wrong tenant/unsupported file/insufficient evidence/missing approval/audit failure blocks. | new/updated Playwright specs | SCF-P04..P07 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | E2E-001 P0 proof package exists. | implementation_candidate |
| SCF-P12-T002 | P12 | E2E-002/E2E-003/E2E-004 Negative Safety Test Closure | Test/P0 | P0 | 033-058,007-010,017-018,048-051 | A-* safety | CAP-* safety | T-SIGNAL,T-GOV,T-EXPORT | E2E-002,E2E-003,E2E-004 | O-* safety/export | tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts | AI draft leakage, advisor-not-release, admin-bypass, cross-tenant denial, export forbidden payload tests. | SCF-P12-T002-S01, SCF-P12-T002-S02, SCF-P12-T002-S03, SCF-P12-T002-S04, SCF-P12-T002-S05 | Nicht nur happy path testen. | existing APIs/services | various | P0 safety gates | fail-closed states | Safety positive proof where relevant. | Leakage/bypass/export unredacted cases fail. | new/updated specs | SCF-P05..P11 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Safety spine and trust output are negative-tested. | implementation_candidate |
| SCF-P13-T001 | P13 | Proof Package: route/capability/flow/task coverage report | QA/Proof | P0 | 001-071 | all | all | all | E2E-001..004 | all | docs/proof or generated report TO_VERIFY | Erzeuge später einen Proof-Report: route coverage, capability coverage, orphan disposition, P0 test output, audit rows, screenshots if applicable. | SCF-P13-T001-S01, SCF-P13-T001-S02, SCF-P13-T001-S03 | Keine neuen Produktentscheidungen im Proof. | n/a | n/a | proof | n/a | Every selected task has proof evidence. | Missing proof blocks completion. | phase:check + test suite + screenshots/logs | SCF-P12-T001,SCF-P12-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Proof Package ist vollständig. | implementation_candidate |
| SCF-P13-T002 | P13 | SCF Implementation Plan QA durchführen | QA | P0 | all | all | all | all | all | all | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_QA.md | QA gegen fünf SCF Artefakte: keine verlorenen Orphans, keine Hold-Elevation, keine Safety-Gaps, keine untracked Tasks. | SCF-P13-T002-S01, SCF-P13-T002-S02, SCF-P13-T002-S03 | Kein Codex start. | n/a | n/a | QA gates | n/a | QA passes without untracked tasks. | Any missing traceability is rework. | manual/automated artifact diff | SCF-P13-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Plan ist Codex-Prompt-Pack-ready. | plan_only |
| SCF-P14-T001 | P14 | SCF Codex Prompt Pack ableiten | Handoff/Prompt | Hold | selected tasks | selected A-* | selected CAP-* | selected T-* | E2E-001..004 | selected O-* | ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md | Nach QA: Phasenweise Codex-Prompts erstellen, jeder Prompt mit Source IDs, target files, tests, stop rules. | SCF-P14-T001-S01, SCF-P14-T001-S02, SCF-P14-T001-S03 | Nicht vor QA ausführen. | n/a | n/a | all safety contracts | all states | Prompt pack contains all implementation candidates. | No deferred/hold/remove tasks smuggled. | n/a | SCF-P13-T002 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Prompt Pack ist ausführbar aber noch nicht ausgeführt. | blocked_until_QA |
| SCF-P14-T002 | P14 | Rebased Final Handoff optional erstellen | Handoff/Final | Hold | selected tasks | selected A-* | selected CAP-* | selected T-* | E2E-001..004 | selected O-* | FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md | Optional: ein finaler SCF-rebaseter Codex-Handoff statt Prompt Pack. | SCF-P14-T002-S01, SCF-P14-T002-S02, SCF-P14-T002-S03 | Nicht parallel mit widersprüchlichem Prompt Pack nutzen. | n/a | n/a | all safety contracts | all states | Handoff authorizes only locked tasks. | P1/Hold/Reference remain blocked. | n/a | SCF-P14-T001 | Code diff/test/runtime/audit/data/safety/regression proof later; no proof means not done. | Final handoff basiert auf SCF und QA. | blocked_until_QA |

## 11. Detailed Subtask Register

| Subtask ID | Parent Task ID | Subtask Name | Action Detail | Target Area | Dependency | Acceptance | Proof | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P00-T001-S01 | SCF-P00-T001 | Source- und Count-Baseline prüfen | Prüfe Source IDs und Counts für 001-071 gegen direkte Artefakte; markiere Abweichungen als TO_VERIFY. | package.json, lib/route-registry.ts, app/[...segments]/page.tsx, prisma/schema.prisma, tests/* | none | Counts und Source-ID-Familien sind nachvollziehbar. | Artefact diff / intake table | Keine Repo-Änderung. |
| SCF-P00-T001-S02 | SCF-P00-T001 | Target Areas plausibilisieren | Prüfe, ob die genannten Target Areas existieren oder als TO_VERIFY bleiben müssen. | package.json, lib/route-registry.ts, app/[...segments]/page.tsx, prisma/schema.prisma, tests/* | SCF-P00-T001-S01 | Jeder Target Area Status ist exists/TO_VERIFY. | Repo tree / file list later | Nur Planning. |
| SCF-P00-T001-S03 | SCF-P00-T001 | Proof- und Stop-Rule-Bindung ergänzen | Ordne Task an Stop Rules, Safety Dependencies und Proof-Anforderungen an. | plan/proof register | SCF-P00-T001-S02 | Stop Rules sind an Task gebunden. | Plan QA | Keine Implementierung. |
| SCF-P00-T002-S01 | SCF-P00-T002 | Source- und Count-Baseline prüfen | Prüfe Source IDs und Counts für all gegen direkte Artefakte; markiere Abweichungen als TO_VERIFY. | package.json, playwright.config.ts | SCF-P00-T001 | Counts und Source-ID-Familien sind nachvollziehbar. | Artefact diff / intake table | Keine Repo-Änderung. |
| SCF-P00-T002-S02 | SCF-P00-T002 | Target Areas plausibilisieren | Prüfe, ob die genannten Target Areas existieren oder als TO_VERIFY bleiben müssen. | package.json, playwright.config.ts | SCF-P00-T002-S01 | Jeder Target Area Status ist exists/TO_VERIFY. | Repo tree / file list later | Nur Planning. |
| SCF-P00-T002-S03 | SCF-P00-T002 | Proof- und Stop-Rule-Bindung ergänzen | Ordne Task an Stop Rules, Safety Dependencies und Proof-Anforderungen an. | plan/proof register | SCF-P00-T002-S02 | Stop Rules sind an Task gebunden. | Plan QA | Keine Implementierung. |
| SCF-P01-T001-S01 | SCF-P01-T001 | Source- und Count-Baseline prüfen | Prüfe Source IDs und Counts für 001-071 gegen direkte Artefakte; markiere Abweichungen als TO_VERIFY. | SCF artefacts | SCF-P00-T001 | Counts und Source-ID-Familien sind nachvollziehbar. | Artefact diff / intake table | Keine Repo-Änderung. |
| SCF-P01-T001-S02 | SCF-P01-T001 | Target Areas plausibilisieren | Prüfe, ob die genannten Target Areas existieren oder als TO_VERIFY bleiben müssen. | SCF artefacts | SCF-P01-T001-S01 | Jeder Target Area Status ist exists/TO_VERIFY. | Repo tree / file list later | Nur Planning. |
| SCF-P01-T001-S03 | SCF-P01-T001 | Proof- und Stop-Rule-Bindung ergänzen | Ordne Task an Stop Rules, Safety Dependencies und Proof-Anforderungen an. | plan/proof register | SCF-P01-T001-S02 | Stop Rules sind an Task gebunden. | Plan QA | Keine Implementierung. |
| SCF-P01-T002-S01 | SCF-P01-T002 | Source- und Count-Baseline prüfen | Prüfe Source IDs und Counts für 001-071 gegen direkte Artefakte; markiere Abweichungen als TO_VERIFY. | SCF artefacts | SCF-P01-T001 | Counts und Source-ID-Familien sind nachvollziehbar. | Artefact diff / intake table | Keine Repo-Änderung. |
| SCF-P01-T002-S02 | SCF-P01-T002 | Target Areas plausibilisieren | Prüfe, ob die genannten Target Areas existieren oder als TO_VERIFY bleiben müssen. | SCF artefacts | SCF-P01-T002-S01 | Jeder Target Area Status ist exists/TO_VERIFY. | Repo tree / file list later | Nur Planning. |
| SCF-P01-T002-S03 | SCF-P01-T002 | Proof- und Stop-Rule-Bindung ergänzen | Ordne Task an Stop Rules, Safety Dependencies und Proof-Anforderungen an. | plan/proof register | SCF-P01-T002-S02 | Stop Rules sind an Task gebunden. | Plan QA | Keine Implementierung. |
| SCF-P02-T001-S01 | SCF-P02-T001 | Betroffene UI-Items sammeln | Ermittle aus Affordance/Orphan IDs die Controls für MVP_SUPPORT/P1/reference mit Entscheidung static/hide/remove/defer/hold. | components/routes TO_VERIFY | SCF-P01-T002 | Jedes Item hat eine Entscheidung. | Orphan register diff | Keine P1/Hold-Elevation. |
| SCF-P02-T001-S02 | SCF-P02-T001 | UI-Behandlung spezifizieren | Lege je Item static label, disabled state, hide, remove, defer oder hold fest. | components/*, components/ui/* | SCF-P02-T001-S01 | UI-Behandlung ist eindeutig und testbar. | UI plan table | Noch kein Code. |
| SCF-P02-T001-S03 | SCF-P02-T001 | Do-Not-Implement Guard definieren | Erzeuge Guard-Regeln, damit spätere Codex-Prompts keine blockierten Items bauen. | Do-Not-Implement Register | SCF-P02-T001-S02 | Guard existiert. | QA checklist | Codex blockiert. |
| SCF-P02-T001-S04 | SCF-P02-T001 | Regression-/Smoke-Kriterien definieren | Definiere spätere Smoke Checks, damit entfernte/versteckte Controls keine falschen Erwartungen erzeugen. | tests/route-smoke TO_VERIFY | SCF-P02-T001-S03 | Smoke-Kriterien benannt. | Test plan | Keine Testausführung. |
| SCF-P02-T002-S01 | SCF-P02-T002 | Betroffene UI-Items sammeln | Ermittle aus Affordance/Orphan IDs die Controls für 052,053,059,060,061,062,063,064,065,066,067,068,069,070,071 mit Entscheidung static/hide/remove/defer/hold. | components/routes TO_VERIFY | SCF-P01-T002 | Jedes Item hat eine Entscheidung. | Orphan register diff | Keine P1/Hold-Elevation. |
| SCF-P02-T002-S02 | SCF-P02-T002 | UI-Behandlung spezifizieren | Lege je Item static label, disabled state, hide, remove, defer oder hold fest. | routes/components/docs | SCF-P02-T002-S01 | UI-Behandlung ist eindeutig und testbar. | UI plan table | Noch kein Code. |
| SCF-P02-T002-S03 | SCF-P02-T002 | Do-Not-Implement Guard definieren | Erzeuge Guard-Regeln, damit spätere Codex-Prompts keine blockierten Items bauen. | Do-Not-Implement Register | SCF-P02-T002-S02 | Guard existiert. | QA checklist | Codex blockiert. |
| SCF-P02-T002-S04 | SCF-P02-T002 | Regression-/Smoke-Kriterien definieren | Definiere spätere Smoke Checks, damit entfernte/versteckte Controls keine falschen Erwartungen erzeugen. | tests/route-smoke TO_VERIFY | SCF-P02-T002-S03 | Smoke-Kriterien benannt. | Test plan | Keine Testausführung. |
| SCF-P03-T001-S01 | SCF-P03-T001 | Current Reality und Source IDs verifizieren | Prüfe für 001-006,013-018 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts | SCF-P02-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P03-T001-S02 | SCF-P03-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Provider kann technisch stub bleiben, aber UI/API/Services müssen deterministischen User, Tenant, Rollen, Membership und Object Scope nutzen. | components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts | SCF-P03-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P03-T001-S03 | SCF-P03-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: RBAC, tenant isolation und UX States: permission denied/loading states an positive/negative Fälle. | components/demo-session-provider.tsx, lib/demo-session.ts, lib/permission-engine.ts, prisma/seed.ts | SCF-P03-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P03-T001-S04 | SCF-P03-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Mapped user sieht eigene Tenant/Role Contexts.` und Negative Acceptance `Unknown/wrong tenant fail-closed und kein Payload-Leak.` ab. | permission-engine.spec.ts update; route-smoke targeted | SCF-P03-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P03-T001-S05 | SCF-P03-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: Session-Kontext ist deterministisch und tenant-scoped.. | proof package | SCF-P03-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P03-T002-S01 | SCF-P03-T002 | Current Reality und Source IDs verifizieren | Prüfe für 001-071 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx | SCF-P03-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P03-T002-S02 | SCF-P03-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Trenne Route Shell, Action Permission, Object Scope und Payload Visibility für alle MVP/MVP_SUPPORT Flows. | lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx | SCF-P03-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P03-T002-S03 | SCF-P03-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: RBAC, payload visibility und UX States: permission denied/hidden states an positive/negative Fälle. | lib/permission-engine.ts, lib/visibility-engine.ts, components/app-shell.tsx | SCF-P03-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P03-T002-S04 | SCF-P03-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Permitted actor sees allowed route/action only.` und Negative Acceptance `Route shell ohne action/payload permission bleibt hidden/denied.` ab. | permission-engine.spec.ts; route smoke negative candidates | SCF-P03-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P03-T002-S05 | SCF-P03-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: RBAC-Layer trennt Route/Action/Payload.. | proof package | SCF-P03-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P04-T001-S01 | SCF-P04-T001 | Current Reality und Source IDs verifizieren | Prüfe für 027,028,029,030,038,041,046,047 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts | SCF-P03-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P04-T001-S02 | SCF-P04-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Plane UI/API/State für Evidence Request, Review Pending, Linked, Sufficient/Insufficient ohne Upload-Overclaim. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts | SCF-P04-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P04-T001-S03 | SCF-P04-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: Evidence sufficiency, audit und UX States: needs evidence, upload in progress/failed/success an positive/negative Fälle. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/evidence-service.ts | SCF-P04-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P04-T001-S04 | SCF-P04-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Evidence Request führt zu Upload und Review Queue.` und Negative Acceptance `Upload success bleibt upload-only; insufficient evidence blockt release.` ab. | document-upload-api/flow + new evidence sufficiency negatives | SCF-P04-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P04-T001-S05 | SCF-P04-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: Evidence Lifecycle hat explizite States und P0 Tests.. | proof package | SCF-P04-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P04-T002-S01 | SCF-P04-T002 | Current Reality und Source IDs verifizieren | Prüfe für 028,027 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts | SCF-P04-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P04-T002-S02 | SCF-P04-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Harte Validierung für file type/size/tenant/role/context, Retry, Fehler und reload-proof Liste. | components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts | SCF-P04-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P04-T002-S03 | SCF-P04-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: RBAC, upload-not-sufficiency, audit und UX States: upload progress/fail/success-only an positive/negative Fälle. | components/client-intake-screen.tsx, app/api/documents/upload/route.ts, lib/document-upload-service.ts | SCF-P04-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P04-T002-S04 | SCF-P04-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Valid upload erzeugt Document/Version/Extraction/Evidence/Audit und erscheint in Liste.` und Negative Acceptance `Forbidden role/unsupported file/wrong tenant erzeugt keine sichtbare Row; denied audit.` ab. | document-upload-api.spec.ts; document-upload-flow.spec.ts | SCF-P04-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P04-T002-S05 | SCF-P04-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: Upload ist robust, aber nicht Sufficiency.. | proof package | SCF-P04-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P04-T003-S01 | SCF-P04-T003 | Current Reality und Source IDs verifizieren | Prüfe für 029,030,046,047,038,039,041 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx | SCF-P04-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P04-T003-S02 | SCF-P04-T003 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Erstelle Work Package für Review, Link zu Recommendation/Decision/Compliance und Sufficiency Entscheidung. | lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx | SCF-P04-T003-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P04-T003-S03 | SCF-P04-T003 | Safety- und UX-State-Anforderungen binden | Binde Safety: evidence sufficiency, audit und UX States: needs evidence/block/success an positive/negative Fälle. | lib/evidence-service.ts, lib/workflow-gate.ts, components/decisions-governance-screen.tsx | SCF-P04-T003-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P04-T003-S04 | SCF-P04-T003 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Reviewer kann Evidence linking/sufficiency begründet markieren.` und Negative Acceptance `Unlinked/stale/unreviewed evidence blockiert Release.` ab. | workflow-gate.spec.ts update; new evidence-service test candidate | SCF-P04-T003-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P04-T003-S05 | SCF-P04-T003 | Proof Package und DoD definieren | Lege spätere Proofs fest: Sufficiency ist explizit und testbar.. | proof package | SCF-P04-T003-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P05-T001-S01 | SCF-P05-T001 | Current Reality und Source IDs verifizieren | Prüfe für 033,034,035 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts | SCF-P03-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P05-T001-S02 | SCF-P05-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Signal/Trigger wird intern klassifiziert, priorisiert und zur Draft/Review-Arbeit geroutet. | components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts | SCF-P05-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P05-T001-S03 | SCF-P05-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: advice boundary, audit und UX States: review pending/block/success an positive/negative Fälle. | components/internal-workflow-screen.tsx, lib/internal-workflow-demo-data.ts, lib/demo-workflow-mutation.ts | SCF-P05-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P05-T001-S04 | SCF-P05-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Analyst klassifiziert Signal und erzeugt internal-only workflow item.` und Negative Acceptance `Signal erzeugt keinen client-visible payload.` ab. | demo-workflow-api.spec.ts; workflow-gate.spec.ts | SCF-P05-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P05-T001-S05 | SCF-P05-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: Signal flow bleibt internal-only.. | proof package | SCF-P05-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P05-T002-S01 | SCF-P05-T002 | Current Reality und Source IDs verifizieren | Prüfe für 033,034,035,036,037,019,020,054-058 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx | SCF-P05-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P05-T002-S02 | SCF-P05-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Stelle sicher, dass AI/rules draft, internal rationale, analyst notes und compliance notes nur intern bleiben. | lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx | SCF-P05-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P05-T002-S03 | SCF-P05-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: AI Draft internal-only, no unapproved advice und UX States: redacted/internal-only states an positive/negative Fälle. | lib/visibility-engine.ts, lib/export-service.ts, components/internal-workflow-screen.tsx | SCF-P05-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P05-T002-S04 | SCF-P05-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Advisor/Analyst sieht interne Drafts.` und Negative Acceptance `Client/API/export sieht keine Drafts/internal rationale.` ab. | new visibility/export payload negative tests | SCF-P05-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P05-T002-S05 | SCF-P05-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: AI Draft Leakage ist negativ getestet.. | proof package | SCF-P05-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P05-T003-S01 | SCF-P05-T003 | Current Reality und Source IDs verifizieren | Prüfe für 036,037,038,039,040,043,044,045 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P05-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P05-T003-S02 | SCF-P05-T003 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Advisor approval setzt nur compliance-pending; Release bleibt Compliance-only. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P05-T003-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P05-T003-S03 | SCF-P05-T003 | Safety- und UX-State-Anforderungen binden | Binde Safety: advisor-not-release, audit und UX States: approval pending/release pending an positive/negative Fälle. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P05-T003-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P05-T003-S04 | SCF-P05-T003 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Advisor approval erzeugt pending compliance state.` und Negative Acceptance `Client visibility bleibt hidden bis Compliance Release.` ab. | workflow-gate.spec.ts; demo-workflow-api.spec.ts negative | SCF-P05-T003-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P05-T003-S05 | SCF-P05-T003 | Proof Package und DoD definieren | Lege spätere Proofs fest: Advisor approval != release ist bewiesen.. | proof package | SCF-P05-T003-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P06-T001-S01 | SCF-P06-T001 | Current Reality und Source IDs verifizieren | Prüfe für 038,039,040,041,042,043,044,045 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts | SCF-P04-T003,SCF-P05-T003 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P06-T001-S02 | SCF-P06-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Compliance kann Release, Block oder Request Evidence nur nach advisor/evidence/audit/precondition checks durchführen. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts | SCF-P06-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P06-T001-S03 | SCF-P06-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: compliance release, evidence sufficiency, audit und UX States: blocked/release pending/compliance blocked an positive/negative Fälle. | components/internal-workflow-screen.tsx, components/decisions-governance-screen.tsx, lib/workflow-gate.ts, lib/audit-service.ts | SCF-P06-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P06-T001-S04 | SCF-P06-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Compliance released nur vollständige Fälle.` und Negative Acceptance `Missing advisor/evidence/audit blocks release and hides client payload.` ab. | workflow-gate.spec.ts; new compliance E2E/API negative | SCF-P06-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P06-T001-S05 | SCF-P06-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: Compliance Gate ist fail-closed.. | proof package | SCF-P06-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P06-T002-S01 | SCF-P06-T002 | Current Reality und Source IDs verifizieren | Prüfe für 036-045,048-051,054-058 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/audit-service.ts, prisma/schema.prisma, tests/* | SCF-P06-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P06-T002-S02 | SCF-P06-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Jede kritische Aktion schreibt AuditEvent oder bleibt pending/denied. Audit display zählt nicht als persistence. | lib/audit-service.ts, prisma/schema.prisma, tests/* | SCF-P06-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P06-T002-S03 | SCF-P06-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: audit persistence, admin non-bypass und UX States: audit unavailable fail-closed an positive/negative Fälle. | lib/audit-service.ts, prisma/schema.prisma, tests/* | SCF-P06-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P06-T002-S04 | SCF-P06-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Gate actions produce actor/role/target/result/prev/next/reason audit rows.` und Negative Acceptance `Audit failure prevents release/export/permission mutation.` ab. | permission-engine.spec.ts; document-upload-api.spec.ts; new audit-fail test candidate | SCF-P06-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P06-T002-S05 | SCF-P06-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: Audit ist Voraussetzung für Safety Proof.. | proof package | SCF-P06-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P07-T001-S01 | SCF-P07-T001 | Current Reality und Source IDs verifizieren | Prüfe für 019,020,043,044,045,046,047 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts | SCF-P06-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P07-T001-S02 | SCF-P07-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Client sieht nur released/redacted/client-safe summary; unreleased/internal-only bleibt hidden/redacted. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts | SCF-P07-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P07-T001-S03 | SCF-P07-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: client visibility fail-closed, payload redaction und UX States: hidden/redacted/empty/error an positive/negative Fälle. | components/client-intake-screen.tsx, components/decisions-governance-screen.tsx, lib/visibility-engine.ts | SCF-P07-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P07-T001-S04 | SCF-P07-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Released decision appears as safe client summary.` und Negative Acceptance `Client cannot see AI draft/internal rationale/compliance notes/unreleased evidence.` ab. | new client-visibility route/API negative tests | SCF-P07-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P07-T001-S05 | SCF-P07-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: Client projection ist fail-closed.. | proof package | SCF-P07-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P07-T002-S01 | SCF-P07-T002 | Current Reality und Source IDs verifizieren | Prüfe für 043,044,045 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P07-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P07-T002-S02 | SCF-P07-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Decision record zeigt Status, evidence linkage, releasedToClientAt und audit summary ohne Gate-Overclaim. | components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P07-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P07-T002-S03 | SCF-P07-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: decision/audit/visibility und UX States: submitted/released/blocked states an positive/negative Fälle. | components/decisions-governance-screen.tsx, lib/workflow-gate.ts | SCF-P07-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P07-T002-S04 | SCF-P07-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Decision submitted/released state is clear and scoped.` und Negative Acceptance `Submitted without release stays internal/hidden.` ab. | workflow-gate and route tests | SCF-P07-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P07-T002-S05 | SCF-P07-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: Decision states overclaimen nicht.. | proof package | SCF-P07-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P08-T001-S01 | SCF-P08-T001 | Current Reality und Source IDs verifizieren | Prüfe für 007,008,009,010,017,018,048,049,050,051 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts | SCF-P03-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P08-T001-S02 | SCF-P08-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Role changes, access requests, second confirmations and governance actions obey tenant/object scope. | components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts | SCF-P08-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P08-T001-S03 | SCF-P08-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: admin non-bypass, RBAC und UX States: permission denied/validation/success an positive/negative Fälle. | components/admin-tenant-setup-screen.tsx, components/decisions-governance-screen.tsx, lib/permission-engine.ts | SCF-P08-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P08-T001-S04 | SCF-P08-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Governed role/access change succeeds in scope and is audited.` und Negative Acceptance `Admin cannot force release/export/visibility/evidence sufficiency.` ab. | permission-engine.spec.ts; new admin-bypass tests | SCF-P08-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P08-T001-S05 | SCF-P08-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: Governance ist auditierbar und non-bypass.. | proof package | SCF-P08-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P08-T002-S01 | SCF-P08-T002 | Current Reality und Source IDs verifizieren | Prüfe für 001-071 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx | SCF-P08-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P08-T002-S02 | SCF-P08-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Such-, Filter-, Listen- und Row-Actions filtern tenant/object scoped und fail-closed. | lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx | SCF-P08-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P08-T002-S03 | SCF-P08-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: tenant isolation, row RBAC und UX States: empty/denied/error an positive/negative Fälle. | lib/permission-engine.ts, components/ui/data-table.tsx, components/ui/filter-bar.tsx | SCF-P08-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P08-T002-S04 | SCF-P08-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Allowed rows visible.` und Negative Acceptance `Cross-tenant rows hidden/denied and no leaked counts/details.` ab. | permission-engine spec update; list route tests | SCF-P08-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P08-T002-S05 | SCF-P08-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: Row-level RBAC ist Teil jeder List/Table-Aufgabe.. | proof package | SCF-P08-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P09-T001-S01 | SCF-P09-T001 | Current Reality und Source IDs verifizieren | Prüfe für 054,055,056,057,058,043,044,045,046,047 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts | SCF-P07-T001,SCF-P06-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P09-T001-S02 | SCF-P09-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Export trennt scope, redaction, preview, approval und download/share; package nur aus released/redacted content. | components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts | SCF-P09-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P09-T001-S03 | SCF-P09-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: export redaction, client visibility, audit und UX States: export pending/failed/success an positive/negative Fälle. | components/communication-export-ops-screen.tsx, lib/export-service.ts, lib/export-package-service.ts | SCF-P09-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P09-T001-S04 | SCF-P09-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Approved export contains only scoped redacted released content.` und Negative Acceptance `Unapproved/unredacted/internal payload blocks download/share.` ab. | file-export-realism.spec.ts update; new export route/API negative | SCF-P09-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P09-T001-S05 | SCF-P09-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: Export ist trust output nach Release.. | proof package | SCF-P09-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P09-T002-S01 | SCF-P09-T002 | Current Reality und Source IDs verifizieren | Prüfe für 019,020,054-058 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts | SCF-P09-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P09-T002-S02 | SCF-P09-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Definiere Tests für keine AI Drafts, internal rationale, compliance notes, unreleased evidence oder hidden fields im Client/Export Payload. | lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts | SCF-P09-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P09-T002-S03 | SCF-P09-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: AI draft internal-only, redaction und UX States: hidden/redacted an positive/negative Fälle. | lib/visibility-engine.ts, lib/export-package-service.ts, tests/file-export-realism.spec.ts | SCF-P09-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P09-T002-S04 | SCF-P09-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Export/client payloads are clean.` und Negative Acceptance `Forbidden payload test fails if internal field appears.` ab. | new payload assertion tests | SCF-P09-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P09-T002-S05 | SCF-P09-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: Forbidden payloads sind negativ geprüft.. | proof package | SCF-P09-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P10-T001-S01 | SCF-P10-T001 | Current Reality und Source IDs verifizieren | Prüfe für 003-060 selected MVP/MVP_SUPPORT lists die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components | SCF-P02-T001,SCF-P08-T002 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P10-T001-S02 | SCF-P10-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Implementiere oder static-label alle sichtbaren Search/Sort/Filter/Row Actions; URL state and RBAC row filtering where built. | components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components | SCF-P10-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P10-T001-S03 | SCF-P10-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: row RBAC, payload visibility und UX States: empty/error/loading/no-results an positive/negative Fälle. | components/ui/data-table.tsx, components/ui/filter-bar.tsx, route screen components | SCF-P10-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P10-T001-S04 | SCF-P10-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Built search/filter changes scoped data or clearly static-labels.` und Negative Acceptance `Search/filter cannot leak hidden rows or counts.` ab. | new UI/API negative tests per built list | SCF-P10-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P10-T001-S05 | SCF-P10-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: 224 table false-completeness risks sind entschieden.. | proof package | SCF-P10-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P10-T002-S01 | SCF-P10-T002 | Current Reality und Source IDs verifizieren | Prüfe für 003,004,005,006,014,015,018,025,028,054 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx | SCF-P02-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P10-T002-S02 | SCF-P10-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Für gebaute Forms/Wizards: required fields, validation, save/submit, cancel, API target, schema mapping and errors. | components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx | SCF-P10-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P10-T002-S03 | SCF-P10-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: permission/audit where safety-sensitive und UX States: validation failed/save success/error an positive/negative Fälle. | components/auth-onboarding-screen.tsx, components/admin-tenant-setup-screen.tsx, components/client-intake-screen.tsx, components/communication-export-ops-screen.tsx | SCF-P10-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P10-T002-S04 | SCF-P10-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Valid submit mutates intended object or clearly static-labels.` und Negative Acceptance `Invalid/missing fields do not mutate; unauthorized denied.` ab. | form/flow tests candidates | SCF-P10-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P10-T002-S05 | SCF-P10-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: Form/Wizard false completeness ist geschlossen.. | proof package | SCF-P10-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P10-T003-S01 | SCF-P10-T003 | Current Reality und Source IDs verifizieren | Prüfe für 002,005,007,009,010,014,015,018,025,031,040,041,044,048,049,050,057 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | components/ui/modal.tsx, components/ui/drawer.tsx, affected screens | SCF-P02-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P10-T003-S02 | SCF-P10-T003 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Open/close/cancel/submit, Escape/focus/accessibility, validation, confirmation phrases and audit where safety critical. | components/ui/modal.tsx, components/ui/drawer.tsx, affected screens | SCF-P10-T003-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P10-T003-S03 | SCF-P10-T003 | Safety- und UX-State-Anforderungen binden | Binde Safety: release/export/admin/evidence audit und UX States: modal open/closed/error/success an positive/negative Fälle. | components/ui/modal.tsx, components/ui/drawer.tsx, affected screens | SCF-P10-T003-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P10-T003-S04 | SCF-P10-T003 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Submit works after validation and permission.` und Negative Acceptance `Cancel/backdrop/Escape preserve data and do not mutate.` ab. | Playwright UI lifecycle tests candidates | SCF-P10-T003-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P10-T003-S05 | SCF-P10-T003 | Proof Package und DoD definieren | Lege spätere Proofs fest: 33 overlay false completeness risks sind geschlossen.. | proof package | SCF-P10-T003-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P11-T001-S01 | SCF-P11-T001 | Current Reality und Source IDs verifizieren | Prüfe für MVP routes using APIs die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts | SCF-P03..P10 tasks | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P11-T001-S02 | SCF-P11-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Härten der vier existierenden APIs: validation, status codes, permission checks, redaction, error fail-closed. | app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts | SCF-P11-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P11-T001-S03 | SCF-P11-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: RBAC/visibility/evidence/audit/export und UX States: API error/loading/success an positive/negative Fälle. | app/api/demo-workflow/route.ts, app/api/documents/route.ts, app/api/documents/upload/route.ts, app/api/review-monitoring/route.ts | SCF-P11-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P11-T001-S04 | SCF-P11-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Valid requests produce scoped response.` und Negative Acceptance `Invalid/unauthorized/error does not advance workflow or expose data.` ab. | demo-workflow-api, document-upload-api, review-monitoring tests | SCF-P11-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P11-T001-S05 | SCF-P11-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: API presence wird safety-proof.. | proof package | SCF-P11-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P11-T002-S01 | SCF-P11-T002 | Current Reality und Source IDs verifizieren | Prüfe für all MVP data routes die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | prisma/schema.prisma, lib/* services, prisma/seed.ts | SCF-P11-T001 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P11-T002-S02 | SCF-P11-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Aligniere Nutzung auf vorhandene 42 Modelle/22 Enums; Schemaänderung nur wenn SCF/P0-Lücke nicht anders lösbar ist. | prisma/schema.prisma, lib/* services, prisma/seed.ts | SCF-P11-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P11-T002-S03 | SCF-P11-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: schema support for safety und UX States: n/a an positive/negative Fälle. | prisma/schema.prisma, lib/* services, prisma/seed.ts | SCF-P11-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P11-T002-S04 | SCF-P11-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Models/fields support flow state and audit.` und Negative Acceptance `No missing field is silently faked in UI.` ab. | db:validate; service tests | SCF-P11-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P11-T002-S05 | SCF-P11-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: Schema alignment ist dokumentiert und minimal.. | proof package | SCF-P11-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P12-T001-S01 | SCF-P12-T001 | Current Reality und Source IDs verifizieren | Prüfe für 019,020,027-030,036-041,043-047 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates | SCF-P04..P07 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P12-T001-S02 | SCF-P12-T001 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: Positive and negative Tests für evidence request/upload/review/approval/release/visibility. | tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates | SCF-P12-T001-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P12-T001-S03 | SCF-P12-T001 | Safety- und UX-State-Anforderungen binden | Binde Safety: P0 upload/evidence/advisor/compliance/visibility und UX States: all flow states an positive/negative Fälle. | tests/document-upload-*.spec.ts, tests/workflow-gate.spec.ts, new e2e candidates | SCF-P12-T001-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P12-T001-S04 | SCF-P12-T001 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Happy path releases safe summary.` und Negative Acceptance `Wrong tenant/unsupported file/insufficient evidence/missing approval/audit failure blocks.` ab. | new/updated Playwright specs | SCF-P12-T001-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P12-T001-S05 | SCF-P12-T001 | Proof Package und DoD definieren | Lege spätere Proofs fest: E2E-001 P0 proof package exists.. | proof package | SCF-P12-T001-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P12-T002-S01 | SCF-P12-T002 | Current Reality und Source IDs verifizieren | Prüfe für 033-058,007-010,017-018,048-051 die Source Affordances, Capabilities, Threads, Flows und Orphans; bestätige Current Reality und Decision Labels. | tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts | SCF-P05..P11 | Source IDs sind bestätigt oder TO_VERIFY. | Traceability matrix | Kein Source-ID-loser Task. |
| SCF-P12-T002-S02 | SCF-P12-T002 | Behaviour/API/Schema Contract ausarbeiten | Spezifiziere spätere Änderung: AI draft leakage, advisor-not-release, admin-bypass, cross-tenant denial, export forbidden payload tests. | tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts | SCF-P12-T002-S01 | Behaviour ist als Implementierungsabsicht ohne offene Produktentscheidung beschrieben. | Task detail record | Keine neue API/Schema ohne Candidate-Entscheidung. |
| SCF-P12-T002-S03 | SCF-P12-T002 | Safety- und UX-State-Anforderungen binden | Binde Safety: P0 safety gates und UX States: fail-closed states an positive/negative Fälle. | tests/permission-engine.spec.ts, tests/file-export-realism.spec.ts, tests/demo-workflow-api.spec.ts | SCF-P12-T002-S02 | Fail-closed und no-overclaim States sind definiert. | Safety checklist | Kein Visual-as-behaviour. |
| SCF-P12-T002-S04 | SCF-P12-T002 | Positive und negative Tests festlegen | Leite Tests aus Positive Acceptance `Safety positive proof where relevant.` und Negative Acceptance `Leakage/bypass/export unredacted cases fail.` ab. | new/updated specs | SCF-P12-T002-S03 | Testpflicht ist eindeutig: existing/update/new candidate. | P0 test map | Bestehende Tests nicht überclaimen. |
| SCF-P12-T002-S05 | SCF-P12-T002 | Proof Package und DoD definieren | Lege spätere Proofs fest: Safety spine and trust output are negative-tested.. | proof package | SCF-P12-T002-S04 | Proofs sind Code/Test/Audit/UI/Data/Regression zugeordnet. | Proof checklist | Kein Abschluss ohne Proof. |
| SCF-P13-T001-S01 | SCF-P13-T001 | Input- und Gate-Check durchführen | Prüfe, ob alle Vorgänger-Tasks und P0 Proofs für Proof Package: route/capability/flow/task coverage report vorhanden sind. | docs/proof or generated report TO_VERIFY | SCF-P12-T001,SCF-P12-T002 | Alle Dependencies grün oder blockiert. | QA matrix | Kein Codex vor QA. |
| SCF-P13-T001-S02 | SCF-P13-T001 | Artefaktstruktur vorbereiten | Definiere Struktur, Source Lock, Stop Rules, Task Scope und Proof-Anforderungen für das Nachfolgeartefakt. | docs/proof or generated report TO_VERIFY | SCF-P13-T001-S01 | Nachfolgeartefakt kann ohne Produktentscheidung erzeugt werden. | Generated artefact draft later | Nur Artefaktplanung. |
| SCF-P13-T001-S03 | SCF-P13-T001 | Blockierte/deferred Items ausschließen | Vergleiche Prompt/Handoff Scope gegen Do-Not-Implement Register und Hold/P1/Reference Routes. | Do-Not-Implement Register | SCF-P13-T001-S02 | Keine blockierten Items im Handoff. | QA diff | Keine Implementierung. |
| SCF-P13-T002-S01 | SCF-P13-T002 | Input- und Gate-Check durchführen | Prüfe, ob alle Vorgänger-Tasks und P0 Proofs für SCF Implementation Plan QA durchführen vorhanden sind. | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_QA.md | SCF-P13-T001 | Alle Dependencies grün oder blockiert. | QA matrix | Kein Codex vor QA. |
| SCF-P13-T002-S02 | SCF-P13-T002 | Artefaktstruktur vorbereiten | Definiere Struktur, Source Lock, Stop Rules, Task Scope und Proof-Anforderungen für das Nachfolgeartefakt. | ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_QA.md | SCF-P13-T002-S01 | Nachfolgeartefakt kann ohne Produktentscheidung erzeugt werden. | Generated artefact draft later | Nur Artefaktplanung. |
| SCF-P13-T002-S03 | SCF-P13-T002 | Blockierte/deferred Items ausschließen | Vergleiche Prompt/Handoff Scope gegen Do-Not-Implement Register und Hold/P1/Reference Routes. | Do-Not-Implement Register | SCF-P13-T002-S02 | Keine blockierten Items im Handoff. | QA diff | Keine Implementierung. |
| SCF-P14-T001-S01 | SCF-P14-T001 | Input- und Gate-Check durchführen | Prüfe, ob alle Vorgänger-Tasks und P0 Proofs für SCF Codex Prompt Pack ableiten vorhanden sind. | ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md | SCF-P13-T002 | Alle Dependencies grün oder blockiert. | QA matrix | Kein Codex vor QA. |
| SCF-P14-T001-S02 | SCF-P14-T001 | Artefaktstruktur vorbereiten | Definiere Struktur, Source Lock, Stop Rules, Task Scope und Proof-Anforderungen für das Nachfolgeartefakt. | ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md | SCF-P14-T001-S01 | Nachfolgeartefakt kann ohne Produktentscheidung erzeugt werden. | Generated artefact draft later | Nur Artefaktplanung. |
| SCF-P14-T001-S03 | SCF-P14-T001 | Blockierte/deferred Items ausschließen | Vergleiche Prompt/Handoff Scope gegen Do-Not-Implement Register und Hold/P1/Reference Routes. | Do-Not-Implement Register | SCF-P14-T001-S02 | Keine blockierten Items im Handoff. | QA diff | Keine Implementierung. |
| SCF-P14-T002-S01 | SCF-P14-T002 | Input- und Gate-Check durchführen | Prüfe, ob alle Vorgänger-Tasks und P0 Proofs für Rebased Final Handoff optional erstellen vorhanden sind. | FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md | SCF-P14-T001 | Alle Dependencies grün oder blockiert. | QA matrix | Kein Codex vor QA. |
| SCF-P14-T002-S02 | SCF-P14-T002 | Artefaktstruktur vorbereiten | Definiere Struktur, Source Lock, Stop Rules, Task Scope und Proof-Anforderungen für das Nachfolgeartefakt. | FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md | SCF-P14-T002-S01 | Nachfolgeartefakt kann ohne Produktentscheidung erzeugt werden. | Generated artefact draft later | Nur Artefaktplanung. |
| SCF-P14-T002-S03 | SCF-P14-T002 | Blockierte/deferred Items ausschließen | Vergleiche Prompt/Handoff Scope gegen Do-Not-Implement Register und Hold/P1/Reference Routes. | Do-Not-Implement Register | SCF-P14-T002-S02 | Keine blockierten Items im Handoff. | QA diff | Keine Implementierung. |

## 12. Route / Affordance / Capability / Flow / Orphan Traceability Matrix

| Route ID | Scope | Path | Component | Affordance Count | Capability Count | Orphan Count | Flow Contribution | Planned Task IDs | Decision Mix | Proof Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | MVP_SUPPORT | /login | AuthOnboardingScreen | 3 | 3 | 3 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:3 | TO_PROVE in later tasks |
| 002 | MVP_SUPPORT | /mfa | AuthOnboardingScreen | 5 | 5 | 5 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T003, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:5 | TO_PROVE in later tasks |
| 003 | MVP_SUPPORT | /onboarding/invite | AuthOnboardingScreen | 9 | 9 | 9 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T001, SCF-P10-T002, SCF-P11-T002, SCF-P13-T001 ... | implement_candidate:5; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 004 | MVP_SUPPORT | /onboarding/identity | AuthOnboardingScreen | 9 | 9 | 9 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:5; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 005 | MVP_SUPPORT | /onboarding/consent | AuthOnboardingScreen | 11 | 11 | 11 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003, SCF-P11-T002, SCF-P13-T001 ... | implement_candidate:7; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 006 | MVP_SUPPORT | /onboarding/role-confirmation | AuthOnboardingScreen | 9 | 9 | 9 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T002, SCF-P10-T002, SCF-P11-T002, SCF-P13-T001 ... | implement_candidate:5; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 007 | MVP_SUPPORT | /admin/platform | AdminTenantSetupScreen | 6 | 6 | 6 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003 ... | implement_candidate:6 | TO_PROVE in later tasks |
| 008 | MVP | /admin/policies/advice-boundary | AdminTenantSetupScreen | 4 | 4 | 4 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P11-T002 ... | implement_candidate:4 | TO_PROVE in later tasks |
| 009 | MVP_SUPPORT | /admin/roles | AdminTenantSetupScreen | 10 | 10 | 10 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003 ... | implement_candidate:6; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 010 | MVP_SUPPORT | /admin/security | AdminTenantSetupScreen | 6 | 6 | 6 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003 ... | implement_candidate:6 | TO_PROVE in later tasks |
| 011 | MVP_SUPPORT | /admin/evidence-templates | AdminTenantSetupScreen | 8 | 8 | 8 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:4; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 012 | MVP_SUPPORT | /admin/export-templates | AdminTenantSetupScreen | 10 | 10 | 10 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:6; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 013 | MVP_SUPPORT | /admin/tenants | AdminTenantSetupScreen | 7 | 7 | 7 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:3; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 014 | MVP_SUPPORT | /tenants/new | AdminTenantSetupScreen | 9 | 9 | 9 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003, SCF-P11-T002, SCF-P13-T001 ... | implement_candidate:5; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 015 | MVP_SUPPORT | /tenants/:id/setup | AdminTenantSetupScreen | 9 | 9 | 9 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003, SCF-P11-T002, SCF-P13-T001 ... | implement_candidate:5; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 016 | MVP_SUPPORT | /tenants/:id/team | AdminTenantSetupScreen | 7 | 7 | 7 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:3; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 017 | MVP_SUPPORT | /tenants/:id/policies | AdminTenantSetupScreen | 8 | 8 | 8 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P11-T002 ... | implement_candidate:4; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 018 | MVP_SUPPORT | /tenants/:id/users | AdminTenantSetupScreen | 10 | 10 | 10 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003 ... | implement_candidate:6; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 019 | MVP | /portal | ClientIntakeScreen | 8 | 8 | 8 | E2E-001, E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 020 | MVP | /mobile | ClientIntakeScreen | 8 | 8 | 8 | E2E-001, E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 021 | MVP_SUPPORT | /client/profile | ClientIntakeScreen | 7 | 7 | 7 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:3; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 022 | MVP_SUPPORT | /client/family-members | ClientIntakeScreen | 7 | 7 | 7 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:3; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 023 | MVP_SUPPORT | /relationships | ClientIntakeScreen | 7 | 7 | 7 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:3; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 024 | MVP_SUPPORT | /entities | ClientIntakeScreen | 7 | 7 | 7 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:3; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 025 | MVP_SUPPORT | /entities/new | ClientIntakeScreen | 9 | 9 | 9 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003, SCF-P11-T002, SCF-P13-T001 ... | implement_candidate:5; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 026 | MVP_SUPPORT | /entities/:id | ClientIntakeScreen | 7 | 7 | 7 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:3; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 027 | MVP | /documents | ClientIntakeScreen | 8 | 8 | 8 | E2E-001 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T003, SCF-P06-T001 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 028 | MVP | /documents/upload | ClientIntakeScreen | 10 | 10 | 7 | E2E-001 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T003, SCF-P06-T001 ... | implement_candidate:10 | TO_PROVE in later tasks |
| 029 | MVP | /documents/extraction-review | ClientIntakeScreen | 8 | 8 | 8 | E2E-001 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T003, SCF-P06-T001 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 030 | MVP | /documents/verification-pending | ClientIntakeScreen | 8 | 8 | 8 | E2E-001 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T003, SCF-P06-T001 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 031 | MVP_SUPPORT | /wealth-map | WealthActionsScreen | 4 | 4 | 4 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T003, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:4 | TO_PROVE in later tasks |
| 032 | MVP_SUPPORT | /actions | WealthActionsScreen | 8 | 8 | 8 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:4; static_explicit_candidate:4 | TO_PROVE in later tasks |
| 033 | MVP | /signals | InternalWorkflowScreen | 8 | 8 | 8 | E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P05-T001, SCF-P05-T002, SCF-P05-T003, SCF-P06-T001, SCF-P07-T001 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 034 | MVP | /workbench | InternalWorkflowScreen | 8 | 8 | 8 | E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P05-T001, SCF-P05-T002, SCF-P05-T003, SCF-P06-T001, SCF-P07-T001 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 035 | MVP | /workbench/triggers/:id | InternalWorkflowScreen | 8 | 8 | 8 | E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P05-T001, SCF-P05-T002, SCF-P05-T003, SCF-P06-T001, SCF-P07-T001 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 036 | MVP | /advisor-approval | InternalWorkflowScreen | 8 | 8 | 8 | E2E-001, E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 037 | MVP | /advisor-approval/:id | InternalWorkflowScreen | 8 | 8 | 8 | E2E-001, E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 038 | MVP | /compliance | InternalWorkflowScreen | 8 | 8 | 8 | E2E-001, E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 039 | MVP | /compliance/:id/review | InternalWorkflowScreen | 8 | 8 | 8 | E2E-001, E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 040 | MVP | /compliance/:id/release | InternalWorkflowScreen | 6 | 6 | 6 | E2E-001, E2E-002, E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001 ... | implement_candidate:6 | TO_PROVE in later tasks |
| 041 | MVP | /compliance/:id/block | DecisionsGovernanceScreen | 11 | 11 | 11 | E2E-001, E2E-002 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:11 | TO_PROVE in later tasks |
| 042 | MVP | /compliance/:id/audit | DecisionsGovernanceScreen | 7 | 7 | 7 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P06-T001, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | implement_candidate:7 | TO_PROVE in later tasks |
| 043 | MVP | /decisions | DecisionsGovernanceScreen | 8 | 8 | 8 | E2E-001, E2E-002, E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 044 | MVP | /decisions/:id | DecisionsGovernanceScreen | 6 | 6 | 6 | E2E-001, E2E-002, E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:6 | TO_PROVE in later tasks |
| 045 | MVP | /decisions/:id/success | DecisionsGovernanceScreen | 8 | 8 | 8 | E2E-001, E2E-002, E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T001, SCF-P05-T002 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 046 | MVP | /evidence | DecisionsGovernanceScreen | 9 | 9 | 9 | E2E-001, E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T002, SCF-P05-T003 ... | implement_candidate:9 | TO_PROVE in later tasks |
| 047 | MVP | /evidence/:id | DecisionsGovernanceScreen | 8 | 8 | 8 | E2E-001, E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T002, SCF-P05-T003 ... | implement_candidate:8 | TO_PROVE in later tasks |
| 048 | MVP | /governance/users | DecisionsGovernanceScreen | 11 | 11 | 11 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P06-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002 ... | implement_candidate:11 | TO_PROVE in later tasks |
| 049 | MVP | /governance/roles | DecisionsGovernanceScreen | 11 | 11 | 11 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003 ... | implement_candidate:11 | TO_PROVE in later tasks |
| 050 | MVP | /governance/access-requests | DecisionsGovernanceScreen | 9 | 9 | 9 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P10-T003 ... | implement_candidate:9 | TO_PROVE in later tasks |
| 051 | MVP | /governance/audit-history | CommunicationExportOpsScreen | 9 | 9 | 9 | E2E-003 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P06-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002 ... | implement_candidate:9 | TO_PROVE in later tasks |
| 052 | P1_AFTER_MVP | /communication | CommunicationExportOpsScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | defer_candidate:6 | deferred/hold/reference |
| 053 | P1_AFTER_MVP | /communication/call-trigger | CommunicationExportOpsScreen | 2 | 2 | 2 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | defer_candidate:2 | deferred/hold/reference |
| 054 | MVP | /export/new | CommunicationExportOpsScreen | 6 | 6 | 6 | E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P05-T002, SCF-P06-T002, SCF-P08-T002, SCF-P09-T001, SCF-P09-T002 ... | implement_candidate:6 | TO_PROVE in later tasks |
| 055 | MVP | /export/:id/scope | CommunicationExportOpsScreen | 10 | 10 | 10 | E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P05-T002, SCF-P08-T002, SCF-P09-T001, SCF-P09-T002, SCF-P10-T002 ... | implement_candidate:10 | TO_PROVE in later tasks |
| 056 | MVP | /export/:id/redaction | CommunicationExportOpsScreen | 10 | 10 | 10 | E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P05-T002, SCF-P08-T002, SCF-P09-T001, SCF-P09-T002, SCF-P10-T002 ... | implement_candidate:10 | TO_PROVE in later tasks |
| 057 | MVP | /export/:id/preview | CommunicationExportOpsScreen | 6 | 6 | 6 | E2E-003, E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T001, SCF-P03-T002, SCF-P05-T002, SCF-P08-T001, SCF-P08-T002, SCF-P09-T001 ... | implement_candidate:6 | TO_PROVE in later tasks |
| 058 | MVP | /export/:id/download | CommunicationExportOpsScreen | 6 | 6 | 6 | E2E-004 | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P03-T002, SCF-P05-T002, SCF-P06-T002, SCF-P08-T002, SCF-P09-T001, SCF-P09-T002 ... | implement_candidate:6 | TO_PROVE in later tasks |
| 059 | P1_AFTER_MVP | /ops/queues | CommunicationExportOpsScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | defer_candidate:6 | deferred/hold/reference |
| 060 | P1_AFTER_MVP | /ops/sla | CommunicationExportOpsScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P10-T001, SCF-P11-T002, SCF-P13-T001 ... | defer_candidate:6 | deferred/hold/reference |
| 061 | REFERENCE_ONLY | /service-blueprint | CommunicationExportOpsScreen | 3 | 3 | 3 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | reference_only:3 | deferred/hold/reference |
| 062 | REFERENCE_ONLY | /roadmap | CommunicationExportOpsScreen | 5 | 5 | 5 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | reference_only:5 | deferred/hold/reference |
| 063 | REFERENCE_ONLY | /states | CommunicationExportOpsScreen | 3 | 3 | 3 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | reference_only:3 | deferred/hold/reference |
| 064 | HOLD_PENDING_DECISION | /kyc/:id/review | KycAmlWorkflowScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | hold_blocked:6 | deferred/hold/reference |
| 065 | HOLD_PENDING_DECISION | /kyc/:id/source-of-wealth | KycAmlWorkflowScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | hold_blocked:6 | deferred/hold/reference |
| 066 | HOLD_PENDING_DECISION | /suitability/:tenantId/profile | SuitabilityIpsScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | hold_blocked:6 | deferred/hold/reference |
| 067 | HOLD_PENDING_DECISION | /ips/:tenantId | SuitabilityIpsScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | hold_blocked:6 | deferred/hold/reference |
| 068 | P1_AFTER_MVP | /reviews/calendar | ReviewMonitoringScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | defer_candidate:6 | deferred/hold/reference |
| 069 | HOLD_PENDING_DECISION | /monitoring/rebalance | ReviewMonitoringScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | hold_blocked:6 | deferred/hold/reference |
| 070 | HOLD_PENDING_DECISION | /committee/reviews | CommitteeReviewScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | hold_blocked:6 | deferred/hold/reference |
| 071 | HOLD_PENDING_DECISION | /committee/reviews/:id | CommitteeReviewScreen | 6 | 6 | 6 | none | SCF-P00-T001, SCF-P00-T002, SCF-P01-T001, SCF-P01-T002, SCF-P02-T002, SCF-P03-T002, SCF-P08-T002, SCF-P11-T002, SCF-P13-T001, SCF-P13-T002 | hold_blocked:6 | deferred/hold/reference |

## 13. Primary Build Path Detail Plan

| Flow | Route IDs | Capability IDs / Threads | Task IDs | Positive Path | Negative Path | Proof Required | Remaining Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2E-001 — Primary Build Path | 027,028,029,030,036,037,038,039,040,041,043,044,045,046,047,019,020 | T-CUSTOMER-EVIDENCE / T-EVIDENCE-SUFFICIENCY / T-CLIENT-VISIBILITY | SCF-P00-T001, SCF-P04-T001, SCF-P04-T002, SCF-P04-T003, SCF-P05-T003, SCF-P06-T001, SCF-P06-T002, SCF-P07-T001, SCF-P07-T002, SCF-P09-T002, SCF-P10-T001, SCF-P10-T002, SCF-P10-T003, SCF-P11-T001, SCF-P11-T002, SCF-P12-T001, SCF-P13-T001, SCF-P14-T001, SCF-P14-T002 | Evidence Request → Upload → Evidence Review / Link / Sufficiency → Advisor Approval → Compliance Release / Block → Client-safe Visibility | Upload-only, insufficient evidence, missing advisor approval, missing compliance release, audit failure and wrong tenant must block. | P0 tests, audit rows, route/API payload proof, no-leak assertions | TO_VERIFY exact route/component implementation points before Codex |

## 14. Parallel Signal Path Detail Plan

| Flow | Route IDs | Capability IDs / Threads | Task IDs | Positive Path | Negative Path | Proof Required | Remaining Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2E-002 — Parallel Signal Path | 033,034,035,036,037,038,039,040,041,043,044,045,019,020 | T-SIGNAL-PROCESSING / T-ADVICE-BOUNDARY | SCF-P05-T001, SCF-P05-T002, SCF-P05-T003, SCF-P06-T001, SCF-P07-T001, SCF-P07-T002, SCF-P09-T002, SCF-P12-T002 | Signal / Trigger → Analyst Classification → Internal AI/Rules Draft → Advisor Review → Compliance Release / Block → Audit + Client Visibility | AI Draft and internal rationale must remain internal-only; no auto-advice. | P0 tests, audit rows, route/API payload proof, no-leak assertions | TO_VERIFY exact route/component implementation points before Codex |

## 15. Safety Spine Detail Plan

| Flow | Route IDs | Capability IDs / Threads | Task IDs | Positive Path | Negative Path | Proof Required | Remaining Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2E-003 — Safety Spine | 001-010,013-018,040,048,049,050,051,057 | T-GOV-NONBYPASS / T-SETUP | SCF-P03-T001, SCF-P03-T002, SCF-P08-T001, SCF-P08-T002, SCF-P10-T002, SCF-P12-T002 | Providerless mapped user → Tenant/Object Scope → Admin Non-Bypass → Cross-Tenant Denial → Audit Proof | Admin and cross-tenant bypass attempts denied and audited. | P0 tests, audit rows, route/API payload proof, no-leak assertions | TO_VERIFY exact route/component implementation points before Codex |

## 16. Trust Output / Export Detail Plan

| Flow | Route IDs | Capability IDs / Threads | Task IDs | Positive Path | Negative Path | Proof Required | Remaining Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2E-004 — Trust Output / Export | 043,044,045,046,047,054,055,056,057,058 | T-EXPORT-TRUST / T-CLIENT-VISIBILITY | SCF-P05-T002, SCF-P09-T001, SCF-P09-T002, SCF-P10-T002, SCF-P12-T002 | Released Decision/Evidence → Export Scope → Redaction → Approval → Preview → Download/Share without internal payload | Preview not approval; export contains no AI Draft, internal notes, compliance notes or unreleased evidence. | P0 tests, audit rows, route/API payload proof, no-leak assertions | TO_VERIFY exact route/component implementation points before Codex |

## 17. UI Completion Detail Plan

UI Completion ist bewusst Phase 10, nicht Phase 1. Sie darf erst nach Foundation, Evidence, Signal, Compliance, Visibility, Governance und Export-Safety sinnvoll umgesetzt werden. Dadurch werden sichtbare Controls nicht ohne Daten-/Safety-Backing aktiviert.

| UI Completion Area | Routes / Components | Main Task IDs | Required Treatment | Negative Proof |
| --- | --- | --- | --- | --- |
| Search / Sort / Filter / Tables | 022-027,036,038,043,052-055,059-060 plus selected MVP tables | SCF-P10-T001 | Implement, static-label, hide, defer or hold; never leave visual-only | Hidden rows/counts/details do not leak across RBAC/object scope |
| Forms / Input Masks / Wizards | 003-006,014-015,025,054-056 plus evidence/compliance forms | SCF-P10-T002 | Field/form/workflow/safety validation, save/submit semantics, no-overclaim feedback | Invalid fields or missing permissions do not mutate state |
| Drawers / Modals / Confirmations | 002,005,007,009,010,018,040,041,046,048-051,057-058 | SCF-P10-T003 | Trigger/open/close/cancel/submit/Escape/focus/audit lifecycle | Cancel/Escape/backdrop never mutates; unauthorized submit denied |

## 18. Search / Sort / Filter / Table Detailed Task Plan

| Route | Component | UI Element | Current Reality | Needed Behaviour | Data Source | URL State | RBAC Row Filtering | Empty/Error/Loading | Task ID | Positive Acceptance | Negative Test |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 027 /documents | ClientIntakeScreen | Document list/search/filter/row action | partial/static risk | Search/filter by document type/status/evidence state if selected; otherwise hide/static label | /api/documents + Document/EvidenceRecord | candidate / TO_VERIFY | Required fail-closed | empty/loading/error/permission | SCF-P10-T001 + SCF-P04-T002 | Scoped actor sees own uploaded/reviewed docs | Wrong tenant/forbidden role sees no row/count/detail |
| 036-037 advisor approval | InternalWorkflowScreen | Approval queue table/row action | partial | Filter by status/risk/evidence readiness; row action requires advisor permission | Recommendation/Approval | candidate | Required | empty/loading/blocked | SCF-P10-T001 + SCF-P05-T003 | Advisor sees actionable approval item | Analyst/client cannot approve or infer hidden items |
| 038-041 compliance | InternalWorkflowScreen / DecisionsGovernanceScreen | Compliance queue/actions | partial | Filter by review status/evidence state; row actions release/block/request evidence | ComplianceReview/Recommendation/EvidenceRecord | candidate | Required | needs-evidence/error/blocked | SCF-P10-T001 + SCF-P06-T001 | Compliance actor can process eligible item | Release denied if evidence/advisor/audit preconditions fail |
| 054-058 export | CommunicationExportOpsScreen | Export scope/redaction/preview lists | partial/static risk | Scope selection/redaction rows only after client-safe release | ExportRequest/Decision/EvidenceRecord | candidate | Required | empty/export pending/error | SCF-P10-T001 + SCF-P09-T001 | Allowed actor sees scoped export rows | Forbidden/internal/unreleased payload absent |

## 19. Input Mask / Form / Wizard Detailed Task Plan

| Route | Form/Wizard | Field | Field Type | Required | Validation | API Target | Schema Field | Save Draft | Submit Action | Error Feedback | Permission | Audit | Task ID | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 014 /tenants/new | Tenant creation wizard | Tenant name, legal entity, jurisdiction | text/select | yes | required, valid jurisdiction, tenant uniqueness TO_VERIFY | /api/demo-workflow candidate / future TO_VERIFY | ClientTenant fields | candidate | create tenant context | field + form error | Admin/Ops only | audit candidate | SCF-P10-T002 / SCF-P03-T001 | future wizard validation spec |
| 028 /documents/upload | Document upload form | file, document type, tenant/object context | file/select/hidden context | yes | file type/size/context/role | /api/documents/upload | Document, DocumentVersion, EvidenceRecord | no | upload file | upload failed/retry/success-upload-only | scoped upload permission | AuditEvent required | SCF-P04-T002 | document-upload-api/flow updated |
| 039 /compliance/:id/review | Compliance review form | decision, reason, evidence status | select/text | yes | advisor approval/evidence/audit preconditions | /api/demo-workflow candidate | ComplianceReview, AuditEvent | candidate | submit review | blocked/needs evidence/error | Compliance only | AuditEvent required | SCF-P06-T001 | workflow-gate + API negatives |
| 055-056 export scope/redaction | Export wizard | scope, redaction profile, selected objects | checkbox/select | yes | released/client-safe scope only | /api/demo-workflow candidate or service | ExportRequest.scopeJson/redactionProfile | candidate | save scope/redaction | export redaction pending/error | advisor/compliance scoped | AuditEvent required | SCF-P09-T001 | file-export-realism updated |

## 20. Drawer / Modal / Confirmation Detailed Task Plan

| Route | Overlay Type | Current Reality | Trigger | Open Condition | Close / Cancel | Submit / Confirm | Validation | Escape / Focus / Accessibility | API / State Change | Audit | Task ID | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 040 /compliance/:id/release | Release confirmation modal | partial/visual mode | Release button | Compliance role + advisor approval + evidence sufficiency | Close/cancel no mutation | Confirm release | confirmation + precondition validation | Escape returns focus; focus trapped | /api/demo-workflow candidate; Recommendation/Decision/ComplianceReview state | required | SCF-P06-T001 / SCF-P10-T003 | release modal negative tests |
| 041 /compliance/:id/block | Block/request evidence modal | partial/static | Block/request evidence action | Compliance role and target scope | Cancel preserves state | Submit block/request | reason required | accessibility modal contract | ComplianceReview blocked + EvidenceRequest state TO_VERIFY | required | SCF-P06-T001 / SCF-P10-T003 | block/request evidence tests |
| 048-051 governance | Access/role drawers | partial | Row action/open drawer | Governance/admin scoped permission | Close no mutation | approve/deny role/access | second confirmation where needed | focus/escape/backdrop | UserRole/AccessRequest/AuditEvent | required | SCF-P08-T001 / SCF-P10-T003 | admin non-bypass tests |
| 057-058 export | Export approval/download modal | partial | approve/download/share | Released/redacted/approved scope | Cancel no mutation | approve/download | confirmation + payload check | focus/escape | ExportRequest approved/generated/download state | required | SCF-P09-T001 / SCF-P10-T003 | export approval/download negatives |

## 21. Upload / Evidence / Audit / Export Detailed Task Plan

| Task ID | Flow | Routes | Data Objects | API/Service | Safety Rule | Positive Acceptance | Negative Acceptance | Tests | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P04-T002 | E2E-001 | 027,028 | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, AuditEvent | /api/documents/upload, /api/documents | Upload is upload-only | Valid upload persists scoped candidate evidence and audit row | Forbidden role/unsupported file/wrong tenant creates no visible row | document-upload-api/flow | Document row + AuditEvent + no sufficiency flag |
| SCF-P04-T003 | E2E-001 | 029,030,046,047,038-041 | DocumentReview, DocumentLink, EvidenceRecord, ComplianceReview | evidence-service/workflow-gate TO_VERIFY | Sufficiency needs reviewed/linked/relevant/scoped/accepted evidence | Reviewed linked evidence can satisfy precondition | Unreviewed/unlinked/stale evidence blocks release | new evidence sufficiency tests | workflow state + audit row |
| SCF-P06-T002 | E2E-001/E2E-002 | 036-042 | Approval, ComplianceReview, AuditEvent, Decision | audit-service/workflow-gate | Critical gate actions require audit persistence | Advisor/compliance actions write audit events | Audit unavailable keeps action pending/denied | audit fail-closed test candidate | AuditEvent proof + no silent advance |
| SCF-P09-T001 | E2E-004 | 054-058 | ExportRequest, Decision, EvidenceRecord, AuditEvent | export-service/export-package-service | Preview not approval; approval not download/share | Approved redacted export package available | Preview-only/unredacted/internal payload blocked | file-export-realism updated | manifest/payload/audit proof |

## 22. RBAC / Client Visibility / Advice Boundary Detailed Task Plan

| Task ID | Scope | Routes | Safety Rule | Implementation Intent | Positive Acceptance | Negative Acceptance | Proof |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P03-T001 | Foundation | 001-006,013-018 | Mapped user/tenant/role context | Deterministic providerless user + membership + role context | Mapped actor sees own tenant context | Unknown/wrong tenant denied and hidden | permission-engine + route proof |
| SCF-P03-T002 | Foundation | 001-071 | Route access != action permission != payload visibility | Central permission/visibility boundary | Allowed role performs scoped action only | Route shell without permission leaks no payload/action | permission-engine tests |
| SCF-P07-T001 | Client visibility | 019,020,043-047 | Client-safe released-only fail-closed projection | Only released/redacted/approved projection visible | Client sees safe summary after compliance release | Draft/internal/compliance/unreleased evidence hidden | client route/API payload assertions |
| SCF-P08-T002 | Admin non-bypass | 009,010,048-051,040,057 | Admin cannot bypass gates | Role/access changes cannot force release/export/visibility | Governed role change audited | Admin bypass denied/audited/no mutation | negative admin bypass tests |

## 23. API / Schema / Persistence Detailed Task Plan

| Task ID | API / Service | Current Baseline | Required Change | Request / Response | Validation | Schema Model / Field | Safety | Tests | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCF-P11-T001 | /api/demo-workflow | exists | Harden action payloads, gate preconditions and noClientRelease semantics | Action request/structured result/auditRows/visibility flags | role/object/workflow preconditions | Trigger, Recommendation, Approval, ComplianceReview, Decision, AuditEvent | advice/visibility/audit | demo-workflow-api updated | implementation_candidate |
| SCF-P11-T001 | /api/documents | exists | Tenant/object-scoped document list with fail-closed payload | GET scoped list; no hidden row/count/detail leakage | tenant/role/object scope | Document, EvidenceRecord, DocumentReview | RBAC/evidence/client visibility | document-upload-api + row filtering candidate | implementation_candidate |
| SCF-P11-T001 | /api/documents/upload | exists | File/context validation, audit, upload-only response | multipart; upload-only success response | file type/size/context/role | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, AuditEvent | upload-not-sufficiency/audit | document-upload-api/flow | implementation_candidate |
| SCF-P11-T001 | /api/review-monitoring | exists / P1 relevance | Keep P1/hold-safe; no auto advice | GET internal monitoring snapshot | no client release; internal scope | ReviewSchedule, Trigger, ActionItem | no-auto-advice | review-monitoring-service tests | deferred/guarded |
| SCF-P11-T002 | Prisma schema | 42 models baseline | Align usage; no blind replacement | n/a | n/a | Document/Evidence/Recommendation/Approval/ComplianceReview/Decision/AuditEvent/ExportRequest/UserRole | schema supports safety states | db validate/service tests | no schema change unless evidence-backed candidate |

## 24. P0 Positive / Negative Test Detail Plan

| Test ID | Related Task IDs | Flow | Route/API/Service | Positive Case | Negative Case | P0 Gate | Existing Test Reuse | New/Updated Test Candidate | Required Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0-DETAIL-001 | SCF-P04-T001,T002,T003 | E2E-001 | /api/documents/upload,/api/documents,evidence-service | Evidence request→upload→review/link works | Upload-only/unlinked evidence cannot release | Upload not sufficiency / evidence sufficiency | document-upload-api/flow | evidence sufficiency service/API test | Document/Evidence/Audit rows |
| P0-DETAIL-002 | SCF-P05-T003,SCF-P06-T001 | E2E-001/E2E-002 | workflow-gate,/api/demo-workflow | Advisor approval moves to compliance pending | Advisor approval alone creates no client visibility | Advisor not release | workflow-gate | advisor-not-release route/API negative | state + payload hidden proof |
| P0-DETAIL-003 | SCF-P06-T001,SCF-P07-T001 | E2E-001/E2E-002 | workflow-gate,visibility-engine,client routes | Compliance release creates safe projection | Missing evidence/advisor/audit blocks client projection | Client visibility fail-closed | workflow-gate/demo-workflow partial | client route/API payload redaction test | client-safe summary only |
| P0-DETAIL-004 | SCF-P05-T002,SCF-P09-T002 | E2E-002/E2E-004 | visibility-engine,export-package-service | Internal draft visible internally only | AI draft/internal rationale absent from client/export | AI Draft internal-only / no unapproved advice | file-export-realism partial | payload leakage negative | payload assertions |
| P0-DETAIL-005 | SCF-P03-T001,T002,SCF-P08-T001,T002 | E2E-003 | permission-engine,/api/demo-workflow | Scoped actor performs allowed action | Cross-tenant/admin bypass denied and audited | RBAC/admin non-bypass | permission-engine | route/API row-filter negative | denied audit + no leak |
| P0-DETAIL-006 | SCF-P09-T001,T002 | E2E-004 | export-service/export-package-service | Approved redacted export generated | Preview-only/unredacted/internal payload blocked | Export redaction/approval | file-export-realism | export payload tests | manifest/payload/audit proof |
| P0-DETAIL-007 | SCF-P10-T001 | selected list routes | data-table/filter-bar + APIs | Search/filter/sort returns scoped rows | Hidden rows/count/details do not leak | Table RBAC and visibility | route-smoke partial | table behaviour tests | row visibility proof |
| P0-DETAIL-008 | SCF-P10-T002,T003 | forms/modals/drawers | UI interactions | Submit after validation and permission | Cancel/Escape/backdrop no mutation; invalid fields no mutation | Feedback/validation/lifecycle | none/partial | Playwright lifecycle tests | state transitions + no mutation |
| P0-DETAIL-009 | SCF-P06-T002 | critical actions | audit-service | Gate action writes audit row | Audit unavailable blocks action | Audit persistence/fail-closed | permission/document tests partial | audit fail simulation candidate | AuditEvent proof |

## 25. Do-Not-Implement / Hide / Remove / Static / Defer / Hold Register

| Item ID | Source Route | Visible Thing / Category | Decision | Task ID / Register ID | Reason | Acceptance | Stop Rule |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DNI-P1-001 | 052,053,059,060,068 | Communication, ops, review rhythm | defer | SCF-P02-T002 | P1 after MVP | Listed in P1 register, not in MVP task pack | No P1-to-MVP promotion |
| DNI-REF-001 | 061,062,063 | Service blueprint, roadmap, state catalogue | static_explicit / reference | SCF-P02-T002 | Reference-only product pages | Label as reference, no product capability | No reference-only product tasks |
| DNI-HOLD-001 | 064,065,066,067,069,070,071 | KYC/SoW/Suitability/IPS/Rebalance/Committee | hold | SCF-P02-T002 | Scope/safety/visual unresolved | Blocked until dedicated unlock prompt | No hold-route implementation |
| DNI-STATIC-001 | various | 80 static-explicit candidates | static_explicit | SCF-P02-T001 | Visible but not selected as MVP behaviour | Marked disabled/reference/not interactive or hidden | No false affordance |
| DNI-ORPHAN-001 | various | 35 no-thread/weak-thread items | hide/remove/static/defer/hold | SCF-P02-T001 / SCF-P10 tasks | No customer/signal/safety thread | Resolve before Codex prompt pack | No orphan silently built |
| DNI-API-001 | all | New API/schema/migration candidates | candidate_requires_final_decision | SCF-P11-T001/T002 | Existing APIs/schema baseline | Only after QA evidence and final handoff | No blind API/schema changes |

## 26. Acceptance Criteria Catalogue

| Category | Acceptance Criteria |
| --- | --- |
| Plan completeness | All 15 phases P00-P14 are represented with tasks, dependencies, acceptance and proof. |
| Traceability | Every task links to route/affordance/capability/thread/flow/orphan source IDs or a grouped source family. |
| SCF decision preservation | Implement/static/hide/remove/defer/hold decisions are not overwritten. |
| Safety | No unapproved advice, AI Draft leakage, admin bypass, upload-to-release, export leakage or client visibility leak is accepted. |
| UI completeness | Search/sort/filter/table, forms/wizards, drawers/modals and states are either implemented later with tests or hidden/static/deferred/hold. |
| API/schema restraint | Existing APIs and full-workflow schema are baseline; candidates remain candidates. |
| P0 proof | Positive and negative tests exist or are explicit missing test candidates before acceptance. |
| Codex gate | No Codex prompt or final handoff is authorized until Detail QA passes. |

## 27. Proof Package Requirements

| Proof Type | Required Later Evidence | Applies To |
| --- | --- | --- |
| Code diff proof | Files changed, forbidden areas unchanged, no visual generation | All implementation tasks |
| Test proof | Unit/API/E2E positive and negative tests, command outputs | P12 and all safety tasks |
| Runtime proof | Local app route smoke, API responses, no route regressions | P00/P13 |
| UI proof | Screenshots only where needed, no new image generation | UI lifecycle and state tasks |
| Audit proof | AuditEvent row or denied audit proof for gate actions | Compliance, admin, evidence, export |
| Data proof | Prisma/seed/demo data state, persisted rows, payload snapshots | Evidence, decision, export, role tasks |
| Safety proof | No client leak, no unapproved advice, admin non-bypass, export redaction | All P0 gates |
| Regression proof | Existing tests still pass; new tests do not hide failures | Final QA |

## 28. Execution Sequencing and Dependency Rules

1. Baseline verification before changes.
2. Hide/remove/static/defer/hold cleanup before building false affordances.
3. User/tenant/role/object scope before client/evidence/advice flows.
4. Evidence upload/review before compliance release.
5. Advisor approval before compliance release.
6. Compliance release before client visibility.
7. Client-safe visibility before export/share.
8. Audit persistence for safety actions before claiming proof.
9. Negative tests before final acceptance.
10. QA before Codex prompt pack.

## 29. Risks, Blockers and Stop Rules

| Risk / Stop Rule | Required Control |
| --- | --- |
| Visual-as-behaviour | Every visual/static/partial item must pass through capability, thread, safety, API/schema and test closure or be static/hide/remove/defer/hold. |
| Route-as-capability | Route access remains separate from action permission and payload visibility. |
| Button-as-mutation | Every action needs trigger, handler, state change, permission, feedback, audit and tests. |
| Table-as-filter/sort-proof | Search/filter/sort/table actions are not real until data source, URL state, RBAC row filtering and tests exist. |
| Upload-as-evidence-sufficiency | Upload success is upload-only; sufficiency requires review/link/relevance/scope/acceptance. |
| Advisor-approval-as-release | Advisor approval leads to compliance pending, not client visibility. |
| Compliance-release-as-client-acceptance | Release creates client-safe projection; not client acceptance/action. |
| Export-preview-as-package | Preview is not approval/download/share; redaction and audit required. |
| Audit-display-as-persistence | Audit timeline display is not proof; AuditEvent persistence required. |
| P1/Hold/Reference leakage | P1, reference and hold routes stay in Do-Not-Implement register. |
| Codex too early | No Codex execution until Detail QA and Prompt Pack/Handoff. |

## 30. QA Before Codex

| QA Check | Expected Result | Blocks Codex If |
| --- | --- | --- |
| SCF coverage check | All five SCF artefacts represented in traceability matrices | Any source IDs vanish without decision |
| Orphan check | Every orphan has implement/static/hide/remove/defer/hold treatment | Any orphan remains undecided |
| Hold/P1/reference check | No P1/hold/reference task is smuggled into MVP implementation | Any blocked route appears as MVP build |
| Safety check | All P0 safety tasks have positive and negative tests | Missing fail-closed proof |
| API/schema check | No new API/schema/migration is task-ready without evidence-backed final decision | Candidate becomes task without proof |
| Proof check | Every task has proof type and DoD | Task has no proof path |
| Prompt-pack readiness | Tasks can be batched into Codex prompts without product decisions | Codex would need to decide product/scope/safety |

## 31. Next Artefact Recommendation

**Recommended next artefact:** `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL_QA.md`

Begründung: Vor Codex muss dieser Detailplan gegen die fünf SCF-Artefakte, den Vorgängerplan, Repo-Reality und P0-Gates geprüft werden. Erst wenn Detail-QA passed ist, sollte ein `ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md` oder `FINAL_CODEX_IMPLEMENTATION_HANDOFF_REBASED_ON_SCF.md` erzeugt werden.

## 32. ENGINE_v2/v3 Proof

| Phase | Engine Combination | Proof |
| --- | --- | --- |
| Charter | ENGINE_v3 | Der Upload-Prompt wurde als Auftrag ausgeführt: Zielartefakt `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL.md`, keine Implementierung. |
| Evidence Intake | ENGINE_v3 Rebase | Direkter Vorgängerplan, fünf SCF-Artefakte, API/Schema/Safety/P0-Verträge und full-workflow-Regeln wurden als Source Lock eingesetzt. |
| Framing | ENGINE_v2 | Das Problem wurde als Detailierungsproblem gelöst: bestehender Plan → Tasks/Subtasks/Dependencies/Proof, nicht neue Journey-Priorisierung. |
| Divergence | ENGINE_v2/v3 | Alternativen wie flache 522-Ticketliste oder Codex Prompt Pack direkt wurden verworfen; detaillierter SCF-Taskplan gewählt. |
| Contradiction Control | ENGINE_v3 | Detaillierte Tasks werden spezifiziert, aber nicht ausgeführt; Implement/Static/Hide/Remove/Defer/Hold bleibt erhalten. |
| Branch Build | ENGINE_v2-B | 33 Master Tasks wurden zu detaillierten Tasks und Subtasks mit Source IDs, Target Areas, Acceptance und Proofs erweitert. |
| Convergence | ENGINE_v2-B + v3 | 15-Phasenmodell, Master Detailed Task Matrix, Subtask Register und Build-Path Detailpläne erzeugt. |
| Adversarial QA | ENGINE_v3 | Stop Rules blockieren Visual-as-behaviour, P1/Hold-Elevation, blindes API/Schema und frühen Codex-Start. |
| Proof Architecture | ENGINE_v3 | P0 positive/negative Tests, Proof Package Requirements und QA Before Codex sind verpflichtend. |
| Learning | ENGINE_v3 | Nächster Schritt ist Detailplan-QA, nicht Codex. |

## 33. Final Decision Label

`SCREEN_CAPABILITY_E2E_IMPLEMENTATION_PLAN_DETAIL_ACCEPTED_WITH_CODEX_HANDOFF_DEPENDENCY`
