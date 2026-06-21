# ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md

**Generated:** 2026-06-21  
**Mode:** Focused Reality-Rebase-Plan. Keine Implementierung. Keine Codeänderung. Keine Codex-Ausführung. Keine Screen-/Image-/State-Screen-Generation.  
**Target repository:** `https://github.com/xkyball/alphavest-wealthos-clickdummy/tree/full-workflow`  
**Target branch:** `full-workflow`  
**Focus:** DB-backed Search / Filter / Sort / Tables und DB-backed Forms / Input Masks / Wizards inklusive Seed-Daten, datengetriebener Metrics / Gauges / Charts und fokussierter Testbarkeit.

---

## 1. Executive Decision

**Final Decision:** `DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN_ACCEPTED_WITH_IMPLEMENTATION_REBASE_REQUIRED`

Der fokussierte Rebase ist notwendig. Das aktualisierte `full-workflow`-Repo ist deutlich weiter als frühere Planungsstände: Es hat `package.json`-Commands für Typecheck, Lint, Build, DB-Validate, DB-Seed und zahlreiche Playwright-Testfamilien; es hat Prisma/Seed-Support; es hat echte Dokument-Upload- und Evidence-Review-APIs; und es nutzt teils echte DB-Reloads für Upload-Dokumente. Gleichzeitig sind viele sichtbare Tabellen, Filter, Saved Views, Forms, Wizards, Metrics, Cards und Charts weiterhin komponentenlokal, hardcoded, demo-array-basiert, actionId-getrieben oder visual-only.

Der Fokus-Rebase soll deshalb **nicht** den gesamten AlphaVest-Workflow neu planen. Er soll ausschließlich diese zwei Kernlücken schließen:

1. **Position 1 — DB-backed Tables / Search / Filter / Sort / Lists / Boards**  
   Alle sichtbaren Tabellen, Listen, Cards mit Datensätzen, Saved Views, Filterchips, Search Inputs, Sort-Header, Pagination, Row Actions und Board-/Kanban-artigen Listen müssen entweder echte DB/API/Service/Seed-Daten nutzen und echtes Verhalten haben oder bewusst als `STATIC_EXPLICIT`, `HIDE_NOW`, `REMOVE_NOW`, `DEFER_P1`, `HOLD_BLOCKED` oder `REFERENCE_ONLY` behandelt werden.

2. **Position 2 — DB-backed Forms / Input Masks / Wizards**  
   Alle sichtbaren Forms, Field Groups, Input Masks, Selects, Required Fields, Wizards und Stepper müssen echte State-/Validation-/Save-/Submit-/API-/Persistence-/Reload-Ketten haben oder bewusst statisch/hidden/deferred/hold bleiben.

**Zusatzentscheidung:** Metriken, Gauges, Readiness Scores, Evidence Percentages, Governance Status, Queue Metrics, Export Counts und ähnliche visuelle Daten dürfen nicht als “Product Data” stehen bleiben, wenn sie nur hardcoded oder aus lokalen Demo-Arrays kommen. Sie müssen aus DB/Seed/API/Service ableitbar sein oder klar als static/reference markiert werden.

**Implementation status:** Noch keine Codeausführung. Dieses Artefakt ist der Rebase-Plan.  
**Next Artefact Recommended:** `ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md`

---

## 2. Source-of-Truth Lock

| Rank | Source | Role | Applied Use | Limit |
|---:|---|---|---|---|
| 1 | Aktualisiertes `full-workflow` Repo | Primäre Code-Reality | GitHub-Webansicht und Raw-Dateien wurden geprüft: Repo-Struktur, `package.json`, README, UI primitives, Client/Admin/Wealth/Export-Komponenten, Document APIs, Services, Tests. | Lokaler Clone/Download war in dieser Umgebung nicht verfügbar; alles repo-basierte wird als Web-/Raw-GitHub-Intake markiert. |
| 2 | `ALPHAVEST_SCREEN_FUNCTIONALITY_REALITY_GAP_AUDIT.md` | Aktueller Gap-Kontext | Bestätigt Rebase-Bedarf und Fokus auf sichtbare UI-Funktionalität. | Nicht als Codebeweis. |
| 3 | `ALPHAVEST_SCREEN_CAPABILITY_E2E_IMPLEMENTATION_RELEASE_PHASE_PLAN.md` | Freigabe-/Task-Kontext | Nur für spätere Codex-Phasen und nicht zu bauende Bereiche. | Nicht blind übernehmen, wenn Repo-Reality widerspricht. |
| 4 | Fünf SCF-Artefakte | Erwartungs-/Affordance-Kontext | Als Vergleich, welche sichtbaren Funktionen erwartet wurden. | Nicht aktuelle Implementierung. |
| 5 | API/Schema/Safety/P0 Contracts | Guardrails | Nur soweit relevant für Tabellen-/Form-/Seed-/Persistence-/RBAC-Row-Filtering. | Keine Scope-Ausweitung auf vollständige Advice-/Compliance-/Export-Architektur. |
| 6 | `main` | False-gap source only | Historische Warnung. | Nie Target Truth. |

---

## 3. Updated Repo Intake Summary

### 3.1 Repo / Branch / Package Intake

| Area | Expected / Searched Path | Found? | Evidence | Status |
|---|---|---:|---|---|
| Repo root | GitHub `full-workflow` branch | YES | GitHub tree shows `app`, `components`, `lib`, `prisma`, `tests`, root project artefacts and 88 commits. | CURRENT_WEB_REALITY |
| Package manager | `package.json` | YES | `packageManager: pnpm@9.15.9`; scripts include `dev`, `build`, `lint`, `typecheck`, `db:seed`, `db:validate`, many targeted Playwright tests. | CURRENT_WEB_REALITY |
| DB support | README / `prisma` / scripts | YES | README documents local Postgres, `pnpm db:migrate`, `pnpm db:seed`; seed creates tenants, roles, users, workflow records, recommendations, evidence, exports, audit events. | CURRENT_WEB_REALITY |
| UI component primitives | `components/ui/*` | YES | `DataTable` and `FilterBar` exist. They render rows/search/filter UI but lack built-in sorting/filtering handlers. | CURRENT_WEB_REALITY |
| Client intake screens | `components/client-intake-screen.tsx` | YES | Many client/profile/entity/document surfaces import demo data arrays and use `DataTable`; document upload/review uses real APIs. | CURRENT_WEB_REALITY |
| Admin screens | `components/admin-tenant-setup-screen.tsx` | YES | Many admin tables/forms import demo data arrays and render SearchShell/Filter shells, DataTables, modals and drawers. | CURRENT_WEB_REALITY |
| Wealth/actions screens | `components/wealth-actions-screen.tsx` | YES | Wealth map/actions use demo-data imports, filter badges, metrics, action board cards and drawer state. | CURRENT_WEB_REALITY |
| Export/ops screens | `components/communication-export-ops-screen.tsx` | YES | Export/ops/communication use demo-data imports, DataTables, metrics, charts/trends, modals and hardcoded counts. | CURRENT_WEB_REALITY |
| Documents API | `app/api/documents*` | YES | `/api/documents`, `/api/documents/upload`, `/api/documents/review` are present. | CURRENT_WEB_REALITY |
| Document service | `lib/document-upload-service.ts` | YES | Upload persists Document, Version, Extraction, EvidenceRecord, EvidenceItem, AuditEvent; list reload uses DB query. | CURRENT_WEB_REALITY |
| Evidence review service | `lib/evidence-review-service.ts` | YES | Review/accept sufficiency uses role allowlist, validation, permission, document/evidence records, audit and transaction updates. | CURRENT_WEB_REALITY |
| Tests | `tests/*` | YES | Document upload API tests strongly prove upload rows, reload, tenant isolation, role denial and fail-closed cases. Search/sort/filter/table/forms tests remain partial/missing. | PARTIAL_P0 |

### 3.2 Scope Focus and Explicit Out-of-Scope

| In Scope | Out of Scope |
|---|---|
| Tables, lists, boards and card-lists showing product/business records. | Full Advice Engine. |
| Search inputs, filter chips/tabs, saved views, sort headers, pagination, row actions. | Full Compliance Architecture beyond relevant tables/forms. |
| Forms, input masks, wizards, field validation, save/submit/reload. | Full Export Architecture except table/data/metric/form-relevant surfaces. |
| DB/Seed/API/Service-backed displayed data. | New screens / image generation / state-screen generation. |
| Metrics, gauges, cards, charts and derived values. | Production auth rebuild. |
| Hardcoded/demo/static data cleanup. | Blind new APIs / blind Prisma migrations. |
| Tests for search/filter/sort/form/persistence/reload/RBAC-row filtering. | Main branch. |

---

## 4. DB-Backed Data Rule

> Jede MVP-/MVP_SUPPORT-Anzeige, die Business-, Client-, Workflow-, Document-, Evidence-, Recommendation-, Decision-, Export-, Role-, User-, Entity-, Asset-, Signal-, Review-, Status- oder Metric-Daten zeigt, muss aus einer nachvollziehbaren DB-/Seed-/API-/Service-Struktur gespeist sein oder bewusst als `STATIC_EXPLICIT`, `REFERENCE_ONLY`, `DEFER_P1`, `HOLD_BLOCKED`, `HIDE_NOW` oder `REMOVE_NOW` markiert werden.

### 4.1 Current Rule Impact

| Data Source Type | Current Repo Pattern | Decision |
|---|---|---|
| Prisma DB Query | Strong for uploaded documents and evidence review; likely partial elsewhere. | Keep and harden. |
| Seeded DB Data | README says deterministic seed covers major roles, tenants, documents, workflow records, recommendations, approvals, compliance reviews, decisions, evidence, exports, ops queues, policies and audit events. | Use as base for DB-backed surfaces. |
| API Response | Present for `/api/documents`, upload and review. | Expand only where focused table/form surfaces need it. |
| Service Function | Present for upload/review/visibility/permission. | Use for focused DB-backed queries and commands. |
| Component-local arrays | Common in client/admin/wealth/export screens. | Convert if dynamic/product data; preserve only if static/reference. |
| Hardcoded metrics/charts | Common in dashboard, evidence status, export, ops, roadmap, trend mini charts. | Derive from seed/service or mark static/hide/defer. |

---

## 5. Route / Component / Data Surface Inventory Method

This rebase uses a focused workset, not all 71 routes. A route enters the focus if it contains at least one of:

* Table/list/board/card-list with product/business rows.
* Search/filter/sort/saved-view controls.
* Form/input field/select/toggle/wizard/stepper.
* Metric/gauge/chart/score/card showing dynamic-looking product data.
* DB-backed document/evidence upload/review surface.

### Focused Route Clusters

| Cluster | Routes / Components | Why included |
|---|---|---|
| Client/Family/Entity/Document intake | `/portal`, `/mobile`, `/client/profile`, `/client/family-members`, `/relationships`, `/entities`, `/entities/new`, `/entities/demo`, `/documents`, `/documents/upload`, `/documents/extraction-review`, `/documents/verification-pending` via `ClientIntakeScreen` | Contains the highest-density table/form/data gaps and strongest existing upload DB implementation. |
| Admin/Tenant setup | `/admin/*`, `/tenants/*` via `AdminTenantSetupScreen` | Contains SearchShell, DataTables, WizardStepper, forms, modals, drawers, role/user/tenant tables from demo data. |
| Wealth map/actions | `/wealth-map`, `/actions` via `WealthActionsScreen` | Contains filters, graph/list data, action board metrics, drawers and action cards from demo data. |
| Governance/Communication/Export/Ops/Reference | `/governance/audit-history`, `/communication`, `/communication/call-trigger`, `/export/*`, `/ops/*`, `/roadmap`, `/states` via `CommunicationExportOpsScreen` | Contains DataTables, hardcoded counts, export metrics, mini trends and reference tables. Focus only on table/form/data/metric aspects. |
| Documents APIs/services/tests | `/api/documents`, `/api/documents/upload`, `/api/documents/review`, `document-upload-service`, `evidence-review-service`, document tests | Strongest DB-backed foundation for focused workstream. |

---

## 6. Search / Filter / Sort / Table Reality Matrix

| Route / Area | Component | UI Surface | Visible Element | Current Data Source | Current Behaviour | Required Behaviour | API / Prisma / Seed Evidence | Test Evidence | Decision | Recommended Task |
|---|---|---|---|---|---|---|---|---|---|---|
| Global topbars | ClientTopBar / WealthTopBar / Phase13TopBar | Search | “Search”, “Search ⌘ K”, “Search WealthOS cmd K” | None / UI placeholder | `VISUAL_ONLY` | Either implement global scoped search against DB-backed indexed entities/docs/actions or hide/static-label. | No search API found in focused repo intake. | Missing. | `HIDE_NOW` or `IMPLEMENT_NOW` only if global search is in focused rebase. | DBTF-WS02-T001 |
| `/documents` | `ClientIntakeScreen` | DataTable | Document list + Saved Views | Mixed: DB persisted upload rows + `documentRows` demo array | `PARTIAL_DB_BACKED` | List all rows from DB/API/service or clearly separate demo seed/static rows; saved views filter actual rows. | `/api/documents` calls `listUploadedDocuments`; component merges persisted rows with demo rows. | Upload API tests verify DB reload/tenant isolation, not saved-view filtering/sorting. | `HARDEN_NOW` + `DB_BACK_NOW` | DBTF-WS01-T001 |
| `/documents` | `ClientIntakeScreen` | Saved Views | All Types / Statuses / Sensitivities / Entities / Accessible to Me | UI only | `VISUAL_ONLY` | Implement filter state/query against actual document rows or hide/static. | No filter handler in component. | Missing. | `IMPLEMENT_NOW` | DBTF-WS02-T002 |
| `/client/family-members` | `ClientIntakeScreen` | DataTable | Key Family Members / familyMembers table | Demo arrays | `HARDCODED_DYNAMIC_RISK` | Use seeded `FamilyMember` / related DB data or static-label demo. | Prisma seed claims family members; component imports `familyMembers`. | Missing search/filter/sort tests. | `DB_BACK_NOW` | DBTF-WS01-T002 |
| `/relationships` | `ClientIntakeScreen` | Graph/list/table | Relationship nodes and relationshipRows | Demo arrays/hardcoded detail cards | `HARDCODED_DYNAMIC_RISK` | Use seeded `Relationship`, `FamilyMember`, `EntityParticipant`, evidence links or static reference. | Schema likely has Relationship; seed claims relationships. | Missing. | `DB_BACK_NOW` / defer complex graph if needed. | DBTF-WS01-T003 |
| `/entities` | `ClientIntakeScreen` | DataTable | Entity table + All Types / Jurisdictions / Ownership filters | Demo arrays | `HARDCODED_DYNAMIC_RISK` + `VISUAL_ONLY` filters | DB-backed entity rows, actual filter state and row actions. | Seed claims entities/assets; component imports `entityRows`. | Missing. | `DB_BACK_NOW` + `IMPLEMENT_NOW` filters. | DBTF-WS01-T004 / DBTF-WS02-T003 |
| `/actions` | `WealthActionsScreen` | Board/list | Action board cards by workflow stage + filters | Demo arrays | `HARDCODED_DYNAMIC_RISK` | Either DB-backed ActionItem board with real grouping/filtering or static/defer. | Seed claims action/workflow records; component imports wealth-actions demo data. | Missing. | `DB_BACK_NOW` or `DEFER_P1` if outside focused MVP. | DBTF-WS01-T005 |
| `/admin/tenants` | `AdminTenantSetupScreen` | DataTable | Tenant Directory + filters | Demo arrays | `HARDCODED_DYNAMIC_RISK` + visual filters | DB-backed ClientTenant / tenant rows; filters real data. | Seed has tenants; component imports `tenantRows`. | Missing. | `DB_BACK_NOW` | DBTF-WS01-T006 |
| `/admin/evidence-templates` | `AdminTenantSetupScreen` | DataTable | Evidence Templates | Demo arrays | `HARDCODED_DYNAMIC_RISK` | Seed/DB-backed policy/template rows or static-reference. | Could map to PolicyDefinition / evidence template domain; requires model check. | Missing. | `TO_VERIFY` then `DB_BACK_NOW` or `STATIC_EXPLICIT`. | DBTF-WS01-T007 |
| `/admin/export-templates` | `AdminTenantSetupScreen` | DataTable | Export Templates / Redaction profiles | Demo arrays | `HARDCODED_DYNAMIC_RISK` | DB-backed templates or static-reference. | Could map to PolicyDefinition / ExportRequest / redaction profile JSON; requires check. | Missing. | `TO_VERIFY`. | DBTF-WS01-T008 |
| `/governance/audit-history` | `CommunicationExportOpsScreen` | DataTable | Access Events | Demo array `auditHistoryEvents`; hardcoded 1,248 row copy | `HARDCODED_DYNAMIC_RISK` | DB-backed AuditEvent list with pagination/filter/sort or static-label. | Prisma has AuditEvent; seed claims audit events. | Existing audit tests cover some actions, not audit table query. | `DB_BACK_NOW` | DBTF-WS01-T009 |
| `/communication` | `CommunicationExportOpsScreen` | DataTables/forms | Templates / communication log | Demo arrays and hardcoded draft text | `HARDCODED_DYNAMIC_RISK` | Defer P1 or static label unless comms are in focused MVP. | Message/MessageThread likely exists in schema/seed. | Missing. | `DEFER_P1` or `STATIC_EXPLICIT`. | DBTF-WS09-T001 |
| `/export/:id/scope` | `CommunicationExportOpsScreen` | DataTable | Export scope items and selected scope | Demo arrays | `PARTIAL_DEMO_ONLY` | DB/service-backed ExportRequest scope; real selected objects; no hardcoded records. | ExportRequest seed exists per README; service proofs partial. | File-export tests likely service-level. | `HARDEN_NOW` if export remains visible; otherwise static/defer. | DBTF-WS01-T010 |
| `/ops/queues` / `/ops/sla` | `CommunicationExportOpsScreen` | DataTables/metrics | Queue rows, breach rows, SLA metrics, mini trends | Demo arrays / hardcoded metrics | `HARDCODED_DYNAMIC_RISK` | P1 or static-reference unless ops route is focused. | QueueItem/DataQualityIssue/ReviewSchedule possible. | Partial service tests only. | `DEFER_P1` / `STATIC_EXPLICIT`. | DBTF-WS09-T002 |
| `/states`, `/roadmap`, `/service-blueprint` | `CommunicationExportOpsScreen` | Reference tables | State catalogue / roadmap | Static/reference arrays | `IMPLEMENTED_STATIC_ACCEPTABLE` if labelled reference | Keep as reference-only, not product data. | No DB needed if clearly reference. | Smoke tests enough. | `REFERENCE_ONLY`. | DBTF-WS09-T003 |

---

## 7. Form / Input Mask / Wizard Reality Matrix

| Route / Area | Component | Form / Wizard | Field / Step | Current Source | Current Reality | Validation / Save / Submit Evidence | API / Schema Evidence | Reload Evidence | Test Evidence | Decision | Recommended Task |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/client/profile` | `ClientIntakeScreen` | Family Profile Edit | profileFields | Demo array + FieldBox display | `HARDCODED_DYNAMIC_RISK` / mostly static | Save Draft button no handler; Submit for Review uses demo action. | No profile save API observed. | Missing. | Missing. | `DB_BACK_NOW` + `IMPLEMENT_NOW` or make read-only static. | DBTF-WS04-T001 |
| `/client/family-members` | `ClientIntakeScreen` | Family detail edit | hardcoded individual fields | Hardcoded array | `HARDCODED_DYNAMIC_RISK` | Save Changes uses demo action; no validation/persistence. | No form API observed. | Missing. | Missing. | `DB_BACK_NOW` or `STATIC_EXPLICIT`. | DBTF-WS04-T002 |
| `/entities/new` | `ClientIntakeScreen` | Create Entity Wizard | Entity details fields + WizardStepper | Hardcoded field values + demo steps | `VISUAL_ONLY` / `DEMO_ONLY` | Save Draft no persistence; Continue uses demo action. | No entity create API observed. | Missing. | Missing. | `IMPLEMENT_NOW` if MVP entity creation remains; otherwise `STATIC_EXPLICIT`/`DEFER_P1`. | DBTF-WS05-T001 |
| `/tenants/new` | `AdminTenantSetupScreen` | Create Tenant Wizard | tenantWizardSteps and form-like surfaces | Demo arrays | `DEMO_ONLY` | Continue demo action. | No tenant create API observed. | Missing. | Missing. | `DEFER_P1` or `STATIC_EXPLICIT` unless foundation task requires it. | DBTF-WS05-T002 |
| `/tenants/demo/team` | `AdminTenantSetupScreen` | Role assignment table/form | teamAssignments | Demo arrays | `DEMO_ONLY` | Save changes demo action. | No assignment mutation API observed. | Missing. | Missing. | `DEFER_P1` or `DB_BACK_NOW` only if role/object scope foundation requires. | DBTF-WS04-T003 |
| `/tenants/demo/users` | `AdminTenantSetupScreen` | Invite Drawer | Message / invite action | Static text + demo action | `DEMO_ONLY` | Drawer opens/closes; Send invitation demo action. | No real invite API observed. | Missing. | Missing. | `STATIC_EXPLICIT` / `DEFER_P1`. | DBTF-WS09-T004 |
| `/admin/platform` / `/admin/security` | `AdminTenantSetupScreen` | Settings toggles / critical modals | platform/security settings | Demo arrays | `VISUAL_ONLY` / `DEMO_ONLY` | Save changes demo action; confirmation modal phrase display but no true typed validation. | No settings API observed. | Missing. | Partial smoke only. | `STATIC_EXPLICIT` unless current focused rebase needs settings persistence. | DBTF-WS09-T005 |
| `/documents/upload` | `ClientIntakeScreen` | Document Upload Form | file, documentType, subType, linkedObjectLabel, periodLabel, notes | Component state + API | `PARTIAL_DB_BACKED` / mostly implemented | File validation in service; POST multipart; upload persists DB rows; reload occurs. | `/api/documents/upload`, Document/Version/Extraction/Evidence/Audit rows. | YES via `/api/documents` refresh. | Strong API tests; UI flow tests likely present. | `HARDEN_NOW` not rebuild. | DBTF-WS04-T004 |
| `/documents/extraction-review` | `ClientIntakeScreen` | Review / Sufficiency form | reviewer notes + review actions | Component state + API | `PARTIAL_DB_BACKED` | POST `/api/documents/review` validates action and sufficiency acceptances. | Evidence review service updates DocumentReview, Document, DocumentExtraction, DocumentLink, EvidenceRecord, AuditEvent. | Refresh after review. | To verify UI + API tests. | `HARDEN_NOW`. | DBTF-WS04-T005 |
| `/communication` | `CommunicationExportOpsScreen` | Build Message/Call | subject/body/channel | Hardcoded draft/static | `HARDCODED_DYNAMIC_RISK` | No durable save/send API in focused evidence. | Message models may exist, but no API proven. | Missing. | Missing. | `DEFER_P1` / `STATIC_EXPLICIT`. | DBTF-WS09-T006 |
| `/export/new` / `/export/scope` | `CommunicationExportOpsScreen` | Export wizard | export type, scope selection | Demo arrays + demo actions | `DEMO_ONLY` | Demo action selection/clear scope. | ExportRequest exists historically; service-level export partial. | Missing route reload. | File-export service tests partial. | `HARDEN_NOW` only for data surfaces if visible; otherwise `STATIC_EXPLICIT`. | DBTF-WS05-T003 |

---

## 8. Displayed Data Source Matrix

| Route / Component | Displayed Data | Current Source | Should Be DB-backed? | Candidate Model / Field | Seed Needed | Derived? | Decision |
|---|---|---|---:|---|---|---:|---|
| `/portal` Client Dashboard | Readiness score, missing docs, evidence status, governance status, advisor messages, next steps | `clientWorkspace`, `missingDocuments`, hardcoded arrays | YES for product dashboard | ClientTenant, Document, EvidenceRecord, Decision, MessageThread, AuditEvent | YES | YES | `DB_BACK_NOW` / phase by surface |
| `/mobile` | Priority actions, blocked recommendations, quick actions | demo arrays / hardcoded | YES if product-facing | ActionItem, Recommendation, ComplianceReview, Document | YES | YES | `DB_BACK_NOW` or `STATIC_EXPLICIT` for shell-only |
| `/client/profile` | Profile fields, governance preferences, review summary | `profileFields`, `governancePreferences`, hardcoded review rows | YES | UserProfile, FamilyMember, ClientObjective, PolicyDefinition | YES | Partial | `DB_BACK_NOW` |
| `/client/family-members` | Family member table and detail fields | demo arrays + hardcoded person details | YES | FamilyMember, UserProfile, Relationship, Consent/Access scope | YES | NO | `DB_BACK_NOW` |
| `/relationships` | Relationship graph/table/evidence summary | demo arrays/hardcoded | YES if product; else reference | Relationship, EntityParticipant, EvidenceRecord, DocumentLink | YES | YES | `DB_BACK_NOW` / or static if graph deferred |
| `/entities` / `/entities/demo` | Entity rows, participants, assets, docs, next steps | demo arrays/hardcoded | YES | Entity, EntityParticipant, Asset, Document, ActionItem | YES | YES | `DB_BACK_NOW` |
| `/documents` | Uploaded docs + demo document rows | Mixed DB + demo arrays | YES | Document, DocumentVersion, EvidenceRecord, DocumentExtraction | Seed maybe needed for non-upload demo docs | NO | `HARDEN_NOW` |
| `/admin/*` | Role templates, policies, security, evidence/export templates, tenants, users | demo arrays | YES where product, static where template/reference | Role, Permission, PolicyDefinition, ClientTenant, UserRole, User | YES | NO | Mixed `DB_BACK_NOW` / `STATIC_EXPLICIT` |
| `/wealth-map` / `/actions` | Wealth nodes, actions, metrics, action board | demo arrays | YES if product; P1 maybe | Entity, Asset, ActionItem, Trigger, EvidenceRecord | YES | YES | `DB_BACK_NOW` or `DEFER_P1` |
| `/governance/audit-history` | AuditEvent rows and detail drawer | demo arrays | YES | AuditEvent | YES | NO | `DB_BACK_NOW` |
| `/export/*` | Export scope, redaction counts, forbidden checks, metadata summary | demo arrays/hardcoded counts | YES for trust output | ExportRequest, Document, EvidenceRecord, AuditEvent, PolicyDefinition | YES | YES | `HARDEN_NOW` / static if not in focus |
| `/ops/*` | Queue metrics, breaches, SLA health, trends | demo arrays/hardcoded | P1 | QueueItem, ReviewSchedule, DataQualityIssue, CallEvent | YES if P1 | YES | `DEFER_P1` / `STATIC_EXPLICIT` |

---

## 9. Seed Data Coverage Matrix

| Data Area | Model / Seed Source | Needed For | Current Seed Coverage | Missing Seed | Decision |
|---|---|---|---|---|---|
| Tenants | ClientTenant / PlatformTenant | Tenant switcher, admin tenant list, DB query scoping | README claims Bennett, Morgan, Northbridge, Summit Ridge. | Need query-backed tenants on admin page. | `SEED_NOW` only if specific states missing. |
| Users/Roles/Permissions | User, Role, Permission, UserRole | RBAC row filtering, forms, admin tables | README claims major roles and tenant-scoped demo users. | Need seeded role edge cases for denied row actions. | `SEED_NOW` |
| Family Members | FamilyMember / UserProfile | Family member tables/forms | README claims family members. | Need enough states: principal, trustee, beneficiary conflict, hidden sensitive data. | `SEED_NOW` |
| Relationships | Relationship / EntityParticipant | Relationship map/table | README claims relationship records indirectly via seed broad list. | Need evidence-linked relationships if UI shows evidence. | `SEED_NOW` |
| Entities / Assets | Entity, EntityParticipant, Asset | Entity list/detail, wealth-map, charts | README claims entities/assets. | Need rows for filter/sort: type, jurisdiction, ownership, risk, missing docs. | `SEED_NOW` |
| Documents | Document, DocumentVersion, Extraction, Review, Link | Documents table/upload/extraction/review | Strong upload path creates records; README claims documents. | Need seeded non-upload docs for list/filter/sort states. | `SEED_NOW` |
| Evidence | EvidenceRecord, EvidenceItem | Evidence status, sufficiency, charts | Upload and review create evidence; README claims evidence. | Need seeded CREATED/LINKED/VALIDATED/RELEASED states. | `SEED_NOW` |
| Recommendations / Decisions / Compliance | Recommendation, Decision, ComplianceReview, Approval | Advisor/compliance/client visibility metrics and dashboard | README claims recommendations, approvals, compliance reviews, decisions. | Need display-query coverage for dashboard/cards. | `SEED_NOW` |
| Exports | ExportRequest | Export tables, metrics, scope, redaction | README claims exports. | Need seeded export statuses and forbidden payload checks. | `SEED_NOW` if export surfaces visible. |
| Audit | AuditEvent | Governance audit history | README claims audit events; upload tests create audit rows. | Need enough rows for pagination/filter/sort/action result states. | `SEED_NOW` |
| Ops / Review / SLA | ReviewSchedule, QueueItem, DataQualityIssue, CallEvent | Ops dashboards and trends | README claims ops queues / workflow records. | If P1 deferred, static/reference only. | `DEFER_P1` |

---

## 10. Chart / Gauge / Metric Data Derivation Matrix

| Route / Component | Graphic / Metric / Gauge | Displayed Value | Current Source | Required Data Derivation | DB / Seed / Service Evidence | Decision |
|---|---|---|---|---|---|---|
| `/portal` | Readiness Score | `clientWorkspace.readiness` / 68/20/12 Evidence Status | Demo object/hardcoded | Compute from evidence/doc/compliance/action states. | Seed claims docs/evidence/compliance/action records. | `DB_BACK_NOW` |
| `/portal` | Governance Status | Structure/Policies/Compliance/Meetings On track/action needed | Hardcoded array | Derive from PolicyDefinition, AuditEvent, compliance status, meetings if present; otherwise static. | TO_VERIFY. | `TO_VERIFY` |
| `/relationships` | Evidence Summary | “4 of 6” and item statuses | Hardcoded | Derive from DocumentLink/EvidenceRecord/Relationship. | TO_VERIFY. | `DB_BACK_NOW` or static. |
| `/entities/demo` | Asset Summary | value/dayChange/allocation list | demo object/hardcoded percentages | Derive from Asset values, assetType, valuationDate. | Seed claims assets. | `DB_BACK_NOW` |
| `/wealth-map` | Node values / flags | wealthMapNodes values | demo arrays | Derive from Entity/Asset/Relationship/evidence status. | Seed claims entities/assets. | `DB_BACK_NOW` or `DEFER_P1`. |
| `/actions` | actionMetrics / progress | counts/deltas/cards | demo arrays | Derive from ActionItem statuses/evidenceStatus/due dates. | Seed claims workflow records. | `DB_BACK_NOW` or `DEFER_P1`. |
| `/export/redaction` | Redaction counts / internal/external visible counts | hardcoded 12/28/16 | demo arrays/hardcoded | Derive from ExportRequest scopeJson/redactionProfile/generated manifest. | Export service tests partial. | `HARDEN_NOW` if export visible. |
| `/export/preview` | Included items counts | Clients 1248, Accounts 15, etc. | Hardcoded | Derive from scoped ExportRequest selected objects. | TO_VERIFY. | `DB_BACK_NOW` / `STATIC_EXPLICIT`. |
| `/ops/queues` | queue metrics and mini trends | demo arrays | demo arrays | Derive from QueueItem/DataQualityIssue/SLA data. | TO_VERIFY. | `DEFER_P1` / `STATIC_EXPLICIT`. |
| `/roadmap` / `/states` | dependency counts, state catalogue | hardcoded/reference arrays | static reference | May remain static if labelled reference. | No DB required if reference-only. | `REFERENCE_ONLY`. |

---

## 11. API / Service / Prisma / Seed Mapping Matrix

| UI Surface / Form / Table | Route | API / Service | Prisma Model / Field | Seed Source | Current Mapping | Missing Mapping | Decision |
|---|---|---|---|---|---|---|---|
| Uploaded Documents table | `/documents`, `/documents/upload` | `/api/documents`, `/api/documents/upload`, `document-upload-service` | Document, DocumentVersion, DocumentExtraction, EvidenceRecord, EvidenceItem, AuditEvent | Upload creates rows; seed may add docs. | Strong partial DB-backed. | Search/filter/sort/pagination; do not merge uncontrolled demo rows. | `HARDEN_NOW` |
| Evidence review form | `/documents/extraction-review` | `/api/documents/review`, `evidence-review-service` | DocumentReview, Document, DocumentLink, EvidenceRecord, AuditEvent | Upload-created rows. | Strong partial DB-backed. | UI/API tests for review path, persistence/reload states. | `HARDEN_NOW` |
| Family table/forms | `/client/family-members`, `/client/profile` | No focused API proven. | FamilyMember, UserProfile, ClientObjective | Seed claimed. | Demo arrays/hardcoded. | Query APIs/services + form persistence. | `DB_BACK_NOW` |
| Entity list/wizard/detail | `/entities`, `/entities/new`, `/entities/demo` | No focused API proven. | Entity, EntityParticipant, Asset, Document, ActionItem | Seed claimed. | Demo arrays/hardcoded. | Query/mutation APIs/service + seed states. | `DB_BACK_NOW` |
| Admin tenant/user/role tables | `/admin/tenants`, `/tenants/*`, `/admin/roles` | No focused API proven; permissionEngine exists. | ClientTenant, User, Role, Permission, UserRole, AccessRequest | Seed claimed. | Demo arrays. | DB query service + filters + permission constraints. | `DB_BACK_NOW` or static/defer by route. |
| Audit history | `/governance/audit-history` | Possible audit service; no table API proven in focused intake. | AuditEvent | Seed/action-generated audit. | Demo array. | DB query, pagination/filter. | `DB_BACK_NOW` |
| Export scope/redaction | `/export/*` | export services historically exist; no route API proven in focused intake. | ExportRequest, Document, EvidenceRecord, AuditEvent | Seed claimed. | Demo arrays/hardcoded metrics. | DB/service-backed scope and redaction counts. | `HARDEN_NOW` / static if deferred. |
| Ops queues / SLA | `/ops/*` | Review-monitoring/data-quality service possible. | QueueItem, ReviewSchedule, DataQualityIssue | Seed claimed. | Demo arrays/hardcoded charts. | Query service if P1 later. | `DEFER_P1`. |

---

## 12. Hardcoded / Static / Demo Data Register

| ID | Route | Component | Hardcoded / Static / Demo Data | Why Risky | DB-backed Replacement Needed? | Decision | Task Candidate |
|---|---|---|---|---|---|---|---|
| HSD-001 | `/portal` | ClientIntakeScreen | Readiness, Evidence Status percentages, Governance Status, Advisor Messages, At-a-glance | Looks like live client dashboard. | Yes. | `DB_BACK_NOW` | DBTF-WS07-T001 |
| HSD-002 | `/client/profile` | ClientIntakeScreen | profileFields, governancePreferences, review summary | Looks editable/reviewable. | Yes if editable; otherwise read-only static. | `DB_BACK_NOW` | DBTF-WS04-T001 |
| HSD-003 | `/client/family-members` | ClientIntakeScreen | familyMembers plus detailed hardcoded person fields | Looks like family record management. | Yes. | `DB_BACK_NOW` | DBTF-WS01-T002 |
| HSD-004 | `/relationships` | ClientIntakeScreen | relationshipNodes / rows / evidence summary hardcoded | Looks like real graph. | Yes if graph remains product surface. | `DB_BACK_NOW` / defer graph complexity. | DBTF-WS01-T003 |
| HSD-005 | `/entities` | ClientIntakeScreen | entityRows and filter selects | Looks searchable/filterable/sortable. | Yes. | `DB_BACK_NOW` | DBTF-WS01-T004 |
| HSD-006 | `/entities/new` | ClientIntakeScreen | Wizard fields prefilled hardcoded | Looks like create form. | Yes if form active. | `IMPLEMENT_NOW` or `STATIC_EXPLICIT`. | DBTF-WS05-T001 |
| HSD-007 | `/wealth-map` | WealthActionsScreen | wealth map nodes/filters/alerts/decisions | Looks live. | Yes if route remains active. | `DEFER_P1` or `DB_BACK_NOW`. | DBTF-WS01-T005 |
| HSD-008 | `/actions` | WealthActionsScreen | actionMetrics, action columns, cards | Looks workflow-operational. | Yes if active. | `DB_BACK_NOW` or `DEFER_P1`. | DBTF-WS01-T005 |
| HSD-009 | `/admin/tenants` | AdminTenantSetupScreen | tenantRows and filters | Looks admin-live. | Yes. | `DB_BACK_NOW`. | DBTF-WS01-T006 |
| HSD-010 | `/governance/audit-history` | CommunicationExportOpsScreen | auditHistoryEvents, 1,248 demo copy | Looks like real audit table. | Yes. | `DB_BACK_NOW`. | DBTF-WS01-T009 |
| HSD-011 | `/export/*` | CommunicationExportOpsScreen | export counts, redaction counts, included item counts, metadata-only copy | Looks like trust-critical export. | Yes or static label. | `HARDEN_NOW` / `STATIC_EXPLICIT`. | DBTF-WS07-T002 |
| HSD-012 | `/ops/*` | CommunicationExportOpsScreen | queue metrics, SLA trends, mini charts | Looks operational live. | Later/P1. | `DEFER_P1` / `STATIC_EXPLICIT`. | DBTF-WS09-T002 |
| HSD-013 | `/states`, `/roadmap`, `/service-blueprint` | CommunicationExportOpsScreen | state/roadmap/reference data | Reference surfaces. | No if clearly reference. | `REFERENCE_ONLY`. | DBTF-WS09-T003 |

---

## 13. Focused Implementation Rebase Plan

### 13.1 Workstreams

| Workstream | Purpose | Priority | Outcome |
|---|---|---|---|
| WS-01 — DB-backed list/table data | Move visible business tables/lists from demo arrays to DB/API/Service-backed data where in MVP/MVP_SUPPORT. | P0 | Dynamic rows from seed/DB with tenant/role scoping. |
| WS-02 — Real search/filter/sort/pagination | Make visible search/filter/sort real, or hide/static/defer. | P0 | No visible fake search/filter/sort controls. |
| WS-03 — Row actions and RBAC row filtering | Ensure row actions respect role/object/payload constraints. | P0 | Fail-closed row filtering and action permissions. |
| WS-04 — DB-backed forms/input masks | Connect editable forms to state/validation/API/persistence/reload or make static. | P0 | No editable-looking fake forms. |
| WS-05 — Wizard lifecycle | Turn wizard steppers into real lifecycle or mark static/defer. | P0/P1 | No stepper-as-behaviour overclaim. |
| WS-06 — Seed data coverage | Seed data for table rows, form defaults, state variants, metrics. | P0 | Deterministic testable data states. |
| WS-07 — Chart/gauge/metric derivation | Derive metrics from data or static/hide. | P0/P1 | No decorative dynamic-looking metrics. |
| WS-08 — Tests and validation | Add positive/negative tests for DB-backed behaviour. | P0 | Proof for search/filter/sort/forms/reload/RBAC. |
| WS-09 — Cleanup/hide/static/defer | Clean visible false completeness outside focused scope. | P0 | Reduce user frustration and overclaim. |

### 13.2 Focused Sequencing

1. Verify `package.json` commands and current route/component/API baselines.
2. Identify all active MVP/MVP_SUPPORT list/table/form surfaces.
3. Preserve existing strong upload/review path; harden, do not rebuild.
4. DB-back high-value active surfaces first: documents, entities, family/profile, audit history, tenant/users if needed.
5. Implement real search/filter/sort only after rows are DB-backed.
6. Implement forms/wizards only if the data model and seed exist; otherwise static/hide/defer.
7. Derive metrics only after underlying DB data exists.
8. Add tests before claiming completion.
9. Keep P1/reference/hold static/deferred.

---

## 14. Focused Task Matrix

| Task ID | Workstream | Task Name | Routes / Components | Source Findings | Target Areas | Required Implementation | DB / API / Schema / Seed Need | Positive Acceptance | Negative Acceptance | Tests | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DBTF-WS01-T001 | WS-01 | Harden documents table as fully DB-backed | `/documents`, `/documents/upload`; `ClientIntakeScreen` | DB persisted uploads are merged with demo `documentRows`; saved views are visual. | `components/client-intake-screen.tsx`, `/api/documents`, `document-upload-service`, tests | Stop uncontrolled merge or clearly label demo rows; query DB/seed-backed docs; add list parameters. | Document, EvidenceRecord, seed docs. | Uploaded and seeded docs display from API/service. | Wrong tenant/role cannot see hidden docs. | Update document upload/list tests + table UI tests. | `HARDEN_NOW` |
| DBTF-WS01-T002 | WS-01 | DB-back family members table and visible profile records | `/client/family-members`, `/client/profile` | Demo arrays/hardcoded fields. | New/updated service/API `TO_VERIFY`; component data loader | Query FamilyMember/UserProfile and render rows; static-label any not persisted fields. | FamilyMember, UserProfile, seed family states. | Table rows from seed/DB. | Sensitive fields hidden for restricted role. | New list/RBAC tests. | `DB_BACK_NOW` |
| DBTF-WS01-T003 | WS-01 | DB-back entities list/detail core rows | `/entities`, `/entities/demo` | Demo arrays and filter shells. | Entity service/API `TO_VERIFY`, component | Query Entity/Participant/Asset/Document counts; support type/jurisdiction/risk filter. | Entity, Asset, EntityParticipant, Document. | Entity list filters real rows. | Unauthorized entity rows hidden. | New entity table tests. | `DB_BACK_NOW` |
| DBTF-WS01-T004 | WS-01 | DB-back audit history table | `/governance/audit-history` | Demo `auditHistoryEvents`, fake 1,248 count. | Audit service/API `TO_VERIFY`, component | Query AuditEvent with pagination/filter/sort. | AuditEvent seed/action rows. | Audit table shows real audit rows. | Cross-tenant audit rows hidden. | New audit table tests. | `DB_BACK_NOW` |
| DBTF-WS02-T001 | WS-02 | Decide global search | topbars | Visible global search placeholders. | Topbar components | Hide/static-label or implement real scoped search; recommend hide until search service exists. | Search index/service candidate. | No fake search visible if not implemented. | Search cannot leak hidden rows. | UI visibility tests. | `HIDE_NOW` unless implemented. |
| DBTF-WS02-T002 | WS-02 | Implement document saved view filters and sort | `/documents` | Saved Views visible; DataTable not sortable. | `ClientIntakeScreen`, API query params, tests | Add status/type/sensitivity/entity filters, sort by updated/name/status. | Document fields + seed states. | Filter/sort changes actual rows. | Invalid filter rejected/no leak. | API/UI tests. | `IMPLEMENT_NOW` |
| DBTF-WS02-T003 | WS-02 | Implement entity filters and sort | `/entities` | FilterSelect labels visual. | Entity component/API/service | Filter by type/jurisdiction/ownership/risk; sort name/risk/missing docs. | Entity fields + seed states. | Filter/sort real rows. | No unauthorized rows. | New tests. | `IMPLEMENT_NOW` |
| DBTF-WS02-T004 | WS-02 | Upgrade reusable table/filter primitives | `components/ui/DataTable`, `FilterBar` | DataTable renders rows only; FilterBar renders UI only. | UI primitives | Add optional controlled handlers/aria/sort affordance only when provided; avoid fake default sort. | None. | Tables with configured handlers work; others show static/read-only. | No fake sort header. | Component/Playwright tests. | `IMPLEMENT_NOW` |
| DBTF-WS03-T001 | WS-03 | Row action permission discipline | active tables | Row actions often demo buttons or not present. | Components/services | Row actions require permission/state feedback; hide disabled unauthorized actions. | PermissionEngine + target model. | Allowed user sees/action succeeds. | Denied user sees hidden/disabled and no mutation. | New RBAC row action tests. | `HARDEN_NOW` |
| DBTF-WS04-T001 | WS-04 | DB-backed client profile form | `/client/profile` | profileFields visual/static; submit demo action. | Component + profile API/service `TO_VERIFY` | Convert editable fields to controlled form, validate, save draft/submit, reload persisted values. | UserProfile/ClientTenant/FamilyMember fields. | Save persists and reloads. | Required fields fail; unauthorized denied. | New form persistence tests. | `IMPLEMENT_NOW` |
| DBTF-WS04-T002 | WS-04 | DB-backed family member edit form or static-label | `/client/family-members` | Hardcoded member detail; Save Changes demo action. | Component + family API/service `TO_VERIFY` | Either implement edit/save/reload or mark static. | FamilyMember fields + seed. | Edit persists/reloads if implemented. | Restricted role cannot edit sensitive fields. | New tests. | `TO_VERIFY` then implement/static. |
| DBTF-WS04-T003 | WS-04 | Harden document upload/review forms | `/documents/upload`, `/documents/extraction-review` | Strong partial DB-backed. | Existing APIs/services/tests | Preserve existing API; add missing UI validation/reload/error tests and reduce demo journey ambiguity. | Existing Document/Evidence models. | Upload/review succeeds and reloads. | Upload/review cannot release or leak. | Extend existing tests. | `HARDEN_NOW` |
| DBTF-WS05-T001 | WS-05 | Decide entity creation wizard | `/entities/new` | Wizard visible with hardcoded values and demo Continue. | Component/API/service `TO_VERIFY` | Implement DB-backed wizard or static/defer. | Entity/Asset/Participant models + seed defaults. | If implemented, save draft/continue persists. | Cannot bypass validation. | Wizard tests. | `TO_VERIFY` |
| DBTF-WS05-T002 | WS-05 | Decide tenant/user/admin wizards | `/tenants/new`, `/tenants/*` | Demo-only wizard/table flows. | Admin component/services | Static/defer unless foundation requires DB admin forms. | ClientTenant/UserRole models. | No fake admin forms visible. | Unauthorized admin cannot mutate gates. | Tests if implemented. | `DEFER_P1` / `STATIC_EXPLICIT` |
| DBTF-WS06-T001 | WS-06 | Extend deterministic seed for focus surfaces | Prisma seed/scripts | Seed exists but UI coverage needs targeted states. | `prisma/seed.ts`, scripts | Add records for filters, sorts, empty states, form reloads, metrics. | Models listed in seed matrix. | Seed reset yields stable rows. | No cross-tenant leakage. | Seed/integration tests. | `SEED_NOW` |
| DBTF-WS07-T001 | WS-07 | Derive dashboard metrics from DB | `/portal`, `/mobile` | Readiness/evidence status hardcoded. | Metrics service `TO_VERIFY` | Compute readiness/evidence/compliance/action counts from seeded data or static-label. | Documents/Evidence/Decisions/Actions. | Metrics match seeded data. | Hidden data excluded. | Metric tests. | `DB_BACK_NOW` |
| DBTF-WS07-T002 | WS-07 | Derive export/redaction metrics or static-label | `/export/*` | Redaction counts and included records hardcoded. | Export service/component | Use export request/scope service or mark static. | ExportRequest/Document/Audit. | Counts match selected scope. | Forbidden payload not counted/displayed. | Export metric tests. | `HARDEN_NOW` / static |
| DBTF-WS07-T003 | WS-07 | Defer or static-label ops metrics/trends | `/ops/*` | SLA/queue metrics hardcoded. | Ops components | Mark P1/static unless DB-backed ops service prioritized. | QueueItem/ReviewSchedule possible. | No fake live ops claim. | N/A | Reference/static tests. | `DEFER_P1` |
| DBTF-WS08-T001 | WS-08 | Focused P0 test suite for DB-backed tables/forms | tests | Missing coverage for search/filter/sort/forms/charts. | `tests/*` | Add targeted Playwright/API tests. | All focus models. | All positive cases pass. | Fail-closed negatives pass. | New suite. | `IMPLEMENT_NOW` |
| DBTF-WS09-T001 | WS-09 | Cleanup fake controls outside focused rebase | many | Search/filter/buttons/charts visible without backing. | Components | Hide/remove/static-label where not implemented. | None. | No fake dynamic control remains. | No functional MVP data removed. | UI smoke/regression. | `HIDE_NOW` / `STATIC_EXPLICIT` |

---

## 15. Focused Subtask Matrix

| Subtask ID | Parent Task ID | Action Detail | Target Area | Dependency | Acceptance | Proof | Notes |
|---|---|---|---|---|---|---|---|
| DBTF-WS01-T001-S01 | DBTF-WS01-T001 | Verify `/api/documents` response shape and listUploadedDocuments DB query. | `app/api/documents`, `lib/document-upload-service` | none | Evidence captured. | File diff/report. | Do before component changes. |
| DBTF-WS01-T001-S02 | DBTF-WS01-T001 | Replace uncontrolled `rows=[...persistedRows,...documentRows]` with DB/seed/service-backed source or explicit static demo section. | `components/client-intake-screen.tsx` | S01 | Document table no longer mixes product and unlabelled demo rows. | UI/test. | Keep upload reload. |
| DBTF-WS01-T001-S03 | DBTF-WS01-T001 | Add API query params or client-side query state for document type/status/sensitivity/entity/sort. | API/component | S01 | Saved views affect actual rows. | API/UI tests. | Use DB-backed rows. |
| DBTF-WS01-T002-S01 | DBTF-WS01-T002 | Verify current schema fields for FamilyMember/UserProfile. | Prisma schema | none | Target fields mapped. | Mapping report. | No blind migration. |
| DBTF-WS01-T002-S02 | DBTF-WS01-T002 | Build family member list service/API or route-level loader using seeded DB records. | lib/app API `TO_VERIFY` | S01 | Rows from DB. | Test + code proof. | Preserve access scoping. |
| DBTF-WS01-T003-S01 | DBTF-WS01-T003 | Verify Entity/Asset/EntityParticipant seed coverage. | Prisma seed | none | Seed has enough filter/sort states. | Seed proof. | Add seed if missing. |
| DBTF-WS01-T003-S02 | DBTF-WS01-T003 | Implement entity list service/API with type/jurisdiction/risk filters. | lib/API/component | S01 | Filters real rows. | Tests. | No fake filters. |
| DBTF-WS02-T004-S01 | DBTF-WS02-T004 | Add optional controlled search/filter/sort API to `DataTable`/`FilterBar` without making all headers fake-sortable. | UI primitives | none | Only configured columns are sortable. | Component/test proof. | Avoid overclaim. |
| DBTF-WS04-T001-S01 | DBTF-WS04-T001 | Convert profile fields to controlled state with validation. | Client profile component | schema mapping | Required fields validate. | UI tests. | Save Draft no silent success. |
| DBTF-WS04-T001-S02 | DBTF-WS04-T001 | Add profile save/submit API/service or verify existing equivalent. | app/api/lib `TO_VERIFY` | S01 | Save persists. | API test. | No blind architecture. |
| DBTF-WS04-T001-S03 | DBTF-WS04-T001 | Reload persisted profile values after save. | component/API | S02 | Reload shows saved values. | E2E test. | Key user frustration reducer. |
| DBTF-WS04-T003-S01 | DBTF-WS04-T003 | Preserve upload-only safety copy and upload API behavior. | upload component/API | none | Upload copy still says sufficiency/release locked. | Regression. | Do not regress. |
| DBTF-WS04-T003-S02 | DBTF-WS04-T003 | Add UI tests for invalid file, retry, error and no-release. | tests | S01 | Negative upload cases pass. | Test output. | Existing API tests strong; UI gap remains. |
| DBTF-WS05-T001-S01 | DBTF-WS05-T001 | Decide implement/static/defer for entity wizard based on schema/API availability. | component/schema | none | No fake editable wizard remains. | Rebase decision. | If implement, follow S02/S03. |
| DBTF-WS05-T001-S02 | DBTF-WS05-T001 | If implemented: add validation, save draft, next/back state and persistence. | entity wizard | S01 | Wizard behaves as wizard. | Tests. | Otherwise static-label. |
| DBTF-WS06-T001-S01 | DBTF-WS06-T001 | Add deterministic seed rows for table filter/sort states. | `prisma/seed.ts` | schema verify | Seed reset stable. | Seed/test output. | No migration unless needed. |
| DBTF-WS07-T001-S01 | DBTF-WS07-T001 | Define metric selectors from DB-backed documents/evidence/decisions/actions. | lib metrics service | seed coverage | Metrics derive from seeded data. | Unit/API tests. | No decorative numbers. |
| DBTF-WS08-T001-S01 | DBTF-WS08-T001 | Add focused API/UI tests for search/filter/sort. | tests | data/query tasks | Positive/negative pass. | Test output. | Use real commands. |
| DBTF-WS08-T001-S02 | DBTF-WS08-T001 | Add focused form persistence/reload tests. | tests | form tasks | Reload shows saved values. | Test output. | High priority. |
| DBTF-WS09-T001-S01 | DBTF-WS09-T001 | Inventory remaining visible fake controls and mark hide/static/defer. | components | none | No unlabeled fake dynamic controls in focused pages. | UI smoke. | Prevents frustration. |

---

## 16. Test and Validation Requirements

| Test ID | Related Task IDs | Area | Positive Case | Negative Case | Existing Test Reuse | New/Updated Test Needed | Proof |
|---|---|---|---|---|---|---|---|
| DBTF-TEST-001 | WS01/WS02 | Document table | Search/filter/sort returns DB-backed docs. | Wrong tenant/role cannot see hidden docs. | Reuse `document-upload-api.spec.ts`. | Update/add UI/API list tests. | Playwright/API output. |
| DBTF-TEST-002 | WS01/WS02 | Entity table | Type/jurisdiction/risk filters change actual rows. | Unauthorized entity hidden. | Existing route smoke maybe. | New. | Test output. |
| DBTF-TEST-003 | WS04 | Client profile form | Save persists; reload shows values. | Required field fails; restricted role denied. | None proven. | New. | Test output. |
| DBTF-TEST-004 | WS05 | Entity wizard | Next/back/save respects validation. | Cannot continue with required missing values. | None proven. | New if implemented. | Test output. |
| DBTF-TEST-005 | WS07 | Metrics/gauges | Dashboard values match seeded data. | Hidden/internal records excluded. | None proven. | New. | Test output. |
| DBTF-TEST-006 | WS09 | Cleanup/static | Hidden/static controls no longer imply functionality. | No MVP functional control accidentally removed. | Route smoke. | Update smoke/visual assertions. | Test output. |

### Validation Commands

Use `package.json` as command truth. Current web-intake command candidates include:

```text
pnpm typecheck
pnpm lint
pnpm db:validate
pnpm build
pnpm db:seed
pnpm test:document-upload-api
pnpm test:document-upload-flow
pnpm test:phase9
pnpm test:playwright
pnpm test:route-smoke
```

If a command is not present in the checked-out repo, report `COMMAND_NOT_FOUND` and do not invent alternatives.

---

## 17. Codex Pack Impact

| Existing / Future Codex Area | Audit Finding | Rebase Impact | Recommended Action |
|---|---|---|---|
| Existing broad SCF Prompt Pack | Too broad for current frustration. | Supersede for focused execution. | Create `ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md`. |
| Release Plan tasks for upload/evidence | Upload/review are stronger than old plan; hardening needed, not rebuild. | Convert build tasks to verify/harden/tests. | Preserve API/service. |
| UI Completion phase | Needs focused DB-backed table/form implementation. | Replace broad UI completion with DBTF workstreams. | Prioritize WS01–WS05. |
| Seed/data tasks | Need specific seed coverage for table/filter/sort/form/metrics states. | Add seed-specific tasks. | WS06. |
| Tests | Existing document tests strong; table/filter/form/metric tests missing. | Add focused tests. | WS08. |

---

## 18. Stop Rules

* Keine Implementierung in diesem Artefakt.
* Keine Codeänderung.
* Keine Codex-Ausführung.
* Keine Screen-/Image-/State-Screen-Generation.
* Kein Scope-Ausweiten über Tables/Search/Filter/Sort und Forms/Input/Wizards plus DB-backed displayed data hinaus.
* Kein `main` als Target Truth.
* Keine alten Counts als aktuelle Repo-Wahrheit.
* Keine visual-only Tables als DB-backed.
* Keine hardcoded dynamic records als akzeptierte Product Data.
* Kein Wizard Stepper als Wizard Behaviour.
* Keine Form ohne Save/Validation/API/Persistence als implemented.
* Keine Charts/Gauges ohne Datenableitung als Product Metrics.
* Keine blinden API-Routen.
* Keine blinden Prisma-Migrationen.
* Kein Patch-Schema Replacement.
* Keine P1/Hold/Reference Items als MVP durch die Hintertür.

---

## 19. Acceptance Criteria

Dieses Artefakt ist akzeptiert, weil es:

| Criterion | Status |
|---|---|
| Das aktualisierte Repo als höchste Code-Reality behandelt. | PASS |
| Strikt auf Search/Filter/Sort/Tables und Forms/Input/Wizards fokussiert. | PASS |
| Sichtbare Business-/Product-Data Surfaces auf Datenquelle prüft. | PASS |
| Hardcoded dynamic data sichtbar macht. | PASS |
| DB-/Seed-/API-/Service-Backing je relevantem UI-Element bewertet. | PASS |
| Search/Filter/Sort/Pagination/Row Actions gegen echte Daten prüft. | PASS |
| Forms/Wizards gegen Validation, Save/Submit, Persistence und Reload prüft. | PASS |
| Seed-Daten-Abdeckung prüft. | PASS |
| Charts/Gauges/Metrics auf Datenableitbarkeit prüft. | PASS |
| Klare Decisions je Element trifft. | PASS |
| Fokussierten Rebase-Plan mit Workstreams, Tasks und Subtasks erzeugt. | PASS |
| Tests und Validation Requirements definiert. | PASS |
| Keine Implementierung autorisiert. | PASS |
| ENGINE_v2/v3 Proof enthält. | PASS |

---

## 20. ENGINE_v2/v3 Proof

### Phase 1 — Charter Proof

| Element | Proof |
|---|---|
| Auftrag | Fokussierter Rebase Plan für DB-backed Tables/Search/Filter/Sort und Forms/Input/Wizards. |
| Grenze | Keine Implementierung; keine Codex-Ausführung; keine generische AlphaVest-Neuplanung. |
| Ziel | `ALPHAVEST_DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN.md`. |

### Phase 2 — Evidence Proof

| Evidence | Use |
|---|---|
| Repo root / README / package scripts | DB/seed/test capability exists, but demo-data-first status remains relevant. |
| DataTable / FilterBar | Render primitives do not themselves prove sort/filter behaviour. |
| ClientIntakeScreen | Many demo arrays/hardcoded fields, but upload/review DB path exists. |
| AdminTenantSetupScreen | Many admin tables/forms are demo-data-driven and require static/DB decisions. |
| WealthActionsScreen | Metrics/filters/action board are demo-data-driven and dynamic-looking. |
| CommunicationExportOpsScreen | Export/ops/audit tables and metrics contain many hardcoded/demo values. |
| Document APIs/services/tests | Strong basis for upload/review hardening and test pattern reuse. |

### Phase 3 — Framing Proof

| Framing | Decision |
|---|---|
| Not full compliance/advice rebase | Too broad. |
| Tables/forms first | Directly addresses visible functionality frustration. |
| DB-backed data rule | Required to make search/filter/sort real. |

### Phase 4 — Divergence Proof

| Option | Decision |
|---|---|
| Broad release rebase | Rejected. |
| DB-only plan | Rejected because UI behaviour/testing would still be missing. |
| Focused DBTF plan | Accepted. |

### Phase 5 — Contradiction Proof

| Contradiction | Resolution |
|---|---|
| “All data from DB” vs static/reference screens | Product/business data DB-backed; reference/static allowed only if explicit. |
| “Charts from data” vs no new analytics | Derive from seed/service or static/hide; no free analytics invention. |
| “Focus only essentials” vs safety | Safety only where row visibility/form permission/persistence/test relevant. |

### Phase 6 — Branch Build Proof

| Branch | Status |
|---|---|
| Keep old Codex pack | Rejected pending focused rebase. |
| Direct coding | Rejected. |
| DBTF Rebase Plan | Accepted. |

### Phase 7 — Convergence Proof

| Decision | Result |
|---|---|
| Workstreams | 9 focused workstreams. |
| Tasks | 18 focused tasks. |
| Subtasks | 20 seed subtasks defined; later Codex pack can expand. |
| Next artefact | `ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md`. |

### Phase 8 — Adversarial Proof

| Risk | Guardrail |
|---|---|
| Scope creep | Explicit out-of-scope. |
| Hardcoded dynamic data remains | Hardcoded register and DB-backed rule. |
| Fake sort/filter | Table reality matrix and WS02. |
| Visual forms remain | Form/wizard matrix and WS04/WS05. |
| Fake metrics | Metric derivation matrix and WS07. |
| Blind schema | No blind migration / TO_VERIFY. |

### Phase 9 — QA Proof

| QA | Status |
|---|---|
| Required matrices present | PASS |
| Focus maintained | PASS |
| Decisions assigned | PASS |
| No implementation authorized | PASS |
| Next artefact named | PASS |

### Phase 10 — Learning Proof

Der nächste Schritt ist kein allgemeiner Rebase mehr, sondern ein fokussiertes Codex Prompt Pack nur für DB-backed Tables/Forms/Metrics/Seed/Test-Gaps. Dadurch wird die Frustration konkret adressiert: sichtbare Daten und Controls werden entweder echt oder klar nicht-funktional/static/deferred.

---

## 21. Final Decision Label

```text
DB_BACKED_TABLES_FORMS_REALITY_REBASE_PLAN_ACCEPTED_WITH_IMPLEMENTATION_REBASE_REQUIRED
```

```text
NEXT_ARTEFACT_RECOMMENDED = ALPHAVEST_DB_BACKED_TABLES_FORMS_CODEX_PROMPT_PACK.md
```
