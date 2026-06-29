# AlphaVest EPIC-3 TASK-C1 Gap Analysis

Datum: 2026-06-29
Quelle: `reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json`
Aktives Item: `AV-PFUI-E03 / TASK-C1 - Analyse client context and evidence lifecycle gaps`

## Verdict

Client Context und Evidence Lifecycle sind teilweise service-backed, aber nicht geschlossen. Die staerksten Schichten sind Dokument-Upload, Dokument-Review, EvidenceRecord/EvidenceItem/AuditEvent-Persistenz und negative Audit-Pfade. Die groessten offenen Luecken liegen bei expliziter Evidence-Request-Erstellung, robuster Target-Object-Auswahl, Vault-/Summary-Traceability und sichtbaren Lifecycle-/Proof-/Contract-Flaechen in der operativen UI.

Route-, Contract- oder Component-Presence ist kein Prozessbeweis. Der aktuelle Stand darf nicht als vollstaendige Evidence-Lifecycle- oder Client-Context-Closure behauptet werden.

## Source Map

| Artefakt | Befund |
|---|---|
| `components/client-intake-screen.tsx` | Enthaelt Client Profile, Family, Relationship, Entity, Documents, Upload, Review Queue und Verification UI. Mehrere Bereiche sind operational nutzbar, aber auch sichtbare Lifecycle-/Proof-/Contract-Flaechen sind vorhanden. |
| `components/decisions-governance-screen.tsx` | Enthaelt eigene Evidence-Vault-Seite fuer Governance-Kontext. `/evidence` liest teilweise `/api/documents`, faellt aber auf statische `evidenceRows` zurueck; keine Closure-Quelle. |
| `lib/dbtf-table-service.ts` | Family/Entity Tabellen sind tenant-/role-/sensitivity-gescoped und backend-backed. Outputs sind aber ueberwiegend Readmodel-Felder, nicht explizite Workflow-State-Objekte. |
| `lib/dbtf-form-service.ts` | Profile, Family-Member-Update und Entity-Wizard sind service-backed mit Validierung und Audit. |
| `lib/document-upload-service.ts` | Upload persistiert Document, DocumentVersion, DocumentExtraction, EvidenceRecord, EvidenceItem und AuditEvent. Kein robuster Target-Object-Identity-Input beim Upload; nur `linkedObjectLabel`. |
| `lib/evidence-review-service.ts` | Review/Sufficiency ist permission-, role-, audit- und DB-backed. Sufficiency akzeptiert nur Compliance fuer `accept_sufficiency`. Target-Object-Pruefung bleibt praktisch document-scoped. |
| `lib/evidence-service.ts` | Sufficiency-Regeln pruefen Review, Acceptance, Currentness, ObjectType/ObjectId Scope und Client-safe Visibility. Lifecycle kann `NEEDS_EVIDENCE` modellieren, aber Request Creation ist nicht als eigener persistierter Workflow umgesetzt. |
| `lib/evidence-lifecycle-contract.ts` | Contract beschreibt States und Route Attributes. Als interne Contract-/Testhilfe brauchbar, aber sichtbare Produktfuehrung darf daraus nicht entstehen. |
| `app/api/client-profile/route.ts` | Stale Source-Pfad in der Ticket-Architektur. Existiert nicht. Aktuelle Route ist `app/api/profile/route.ts`. |
| `app/api/profile/route.ts` | Profile GET/PATCH ist service-backed und release-/visibility-safe. |
| `app/api/family-members/route.ts` | Family Members GET/PATCH ist service-backed und tenant-/role-gescoped. |
| `app/api/entities/route.ts` | Entity GET/POST ist service-backed, tenant-/role-gescoped und Entity-Wizard validiert. |
| `app/api/documents/route.ts` | Dokumentliste ist backend-query-backed mit Such-/Filter-/Sort-/Pagination-Meta. |
| `app/api/documents/upload/route.ts` | Multipart Upload ist service-backed, auditpflichtig, erzeugt interne Evidence und blockiert Release/Export/Client Visibility. |
| `app/api/documents/review/route.ts` | Review API ist service-backed. `requiredObjectId` existiert, aber kein kanonischer Target-Object-Type-Input im API-Vertrag. |
| `tests/av27-client-context-closure.spec.ts` | Deckt Profile/Family/Entity/Relationship/Sensitivity stark ab, erwartet aber teilweise interne `data-ux-*` Nachweise. |
| `tests/document-upload-api.spec.ts` | Deckt Upload-Persistenz, Projection, Hidden Fields, locked safety state und Audit-Fail-Closed ab. |
| `tests/document-upload-flow.spec.ts` | Deckt Upload/Reload/Review Queue ab; prueft Clarification und Sufficiency Buttons. |
| `tests/evidence-review-api.spec.ts` | Deckt Evidence Review/Sufficiency API ab und bestaetigt service-backed Review-Pfade. |

## Questions To Answer

| Frage | Befund |
|---|---|
| Which client context outputs are first-class workflow states? | Teilweise: Family/Entity Rows haben backend-backed payload/visibility/status Felder; Profile/Family/Entity Mutationen sind service-backed. Nicht vollstaendig: Wealth Map, Relationship/Entity Output Readiness und Sensitivity Classification sind keine eigenstaendigen kanonischen Workflow-State-Objekte. |
| Where are wealth map and sensitivity merely displayed instead of workflow-backed? | Sensitivity ist backend-seitig vorhanden und beeinflusst Sichtbarkeit. Als operative Klassifikation mit downstream readiness/blockers ist sie aber nur teilweise modelliert. Wealth Map/Entity Detail nutzt statische bzw. readmodelartige Flaechen und darf nicht als workflow-backed Closure gelten. |
| How is target object selection represented today? | Schwach. Upload verwendet `linkedObjectLabel`, Review akzeptiert optional `requiredObjectId`, aber Sufficiency prueft weiterhin Document gegen Document. Es gibt kein robustes Produkt-UI mit ObjectType/ObjectId-Auswahl fuer Entity/Asset/FamilyMember/Relationship. |
| Which vault filters/details are backend-query backed? | `/api/documents` ist backend-query-backed fuer search/filter/sort/pagination und role/tenant projection. Detail-/Vault-Traceability zu EvidenceRecord, EvidenceItem, reviews und client-safe summary ist nur teilweise im readmodel sichtbar. |
| How is client-safe summary linked to release-safe evidence? | Review kann `clientVisibleSummary` und redacted evidence visibility erzeugen, und Projection schuetzt Felder. Es fehlt aber eine klare readmodel-/UI-Traceability vom client-safe summary zu genau akzeptierter, scoped, current, client-safe evidence. |

## Classified Gaps

| Gap ID | Kategorie | Schwere | Befund | Empfohlener Slice |
|---|---|---:|---|---|
| C1-G01 | stale source artifact | P3 | Ticket nennt `app/api/client-profile/route.ts`, tatsaechliche Route ist `app/api/profile/route.ts`. | C2 Source-Correction aufnehmen. |
| C1-G02 | missing output state | P1 | Client Context Outputs sind nicht durchgehend als `ready / incomplete / blocked` fuer Downstream Use modelliert. | `SUBTASK-C3-1` Context Readiness State in Service/API/UI. |
| C1-G03 | display-only UI | P1 | Wealth Map/Entity Detail kann wie operational readiness wirken, obwohl downstream readiness nicht kanonisch service-backed ist. | `SUBTASK-C3-1` ehrliche readiness/blocker ohne Meta-Tafel. |
| C1-G04 | missing workflow state | P1 | Sensitivity beeinflusst Visibility, ist aber keine vollstaendige Sensitivity Classification Workflow mit Review-/Blocker-State. | `SUBTASK-C3-1` classification output in readmodels. |
| C1-G05 | missing action | P0/P1 | Evidence Request kann als Lifecycle-State gedacht werden, aber es gibt keine explizite Request-Creation-Aktion mit persistiertem Request-State. | `SUBTASK-C3-2a` Evidence Request state/service. |
| C1-G06 | weak target-object binding | P0/P1 | Upload `linkedObjectLabel` ist label-only; Review `requiredObjectId` ist document-scoped und kennt keinen robusten ObjectType. | `SUBTASK-C3-2b` Target Object Identity. |
| C1-G07 | missing output traceability | P1 | Evidence sufficiency output ist service-backed, aber client-safe summary ist nicht ausreichend als readmodel trace zu accepted evidence/review/audit sichtbar. | `SUBTASK-C3-3b` Summary trace readmodel. |
| C1-G08 | partial vault readmodel | P2 | Vault/List Query ist backend-backed, Detail-Readmodel fuer EvidenceRecord/EvidenceItem/Review/Audit/summary fehlt bzw. ist nicht ausreichend explizit. | `SUBTASK-C3-3a` Vault readmodel classification/wiring. |
| C1-G09 | visible meta scaffolding | P1 | `EvidenceLifecycleAreaEntry`, `EvidenceLifecycleCoreSurface`, proof-boundary blocks und `proofPlacement` fuehren interne Lifecycle-/Proof-/Contract-Metadaten sichtbar. | C3 UI cleanup: produktnative Objekt-/Aktion-/Blocker-Fuehrung, keine Prozess-/Proof-Tafeln. |
| C1-G10 | downstream readiness overclaim risk | P0 | Copy kann Upload/Review/Sufficiency nah an Release/Export/Visibility ruecken. Viele Locks sind korrekt, aber UI muss klare Produktblocker statt Contract-Scaffold zeigen. | C3/C4 no-overclaim review. |
| C1-G11 | display-only relationship state | P1 | Relationship graph/table kommen aus statischen `relationshipNodes` / `relationshipRows`; Add Edge ist test/service-backed, aber die sichtbare Relationship-Map ist kein DB-Readmodel. | `SUBTASK-C3-1` Relationship readiness aus Service/API oder ehrlich blockieren. |
| C1-G12 | display-only entity detail | P1 | Entity Queue ist DB-backed, Entity Detail/Participants/Documents nutzen statische Demo-Daten. | `SUBTASK-C3-1` Entity detail readmodel oder Detail-Flaeche entkoppeln/blockieren. |
| C1-G13 | weak backend facets | P2 | Entity Filter-Optionen werden aus aktueller UI-Seite abgeleitet, nicht aus backend-backed Facets. | Backend-backed facet/readiness output in Context Readmodel. |
| C1-G14 | missing sufficiency decision row | P1 | Dokument-Review/Sufficiency nutzt `EvidenceSufficiencyDecision` als Runtime-Entscheidung und Audit-Metadata, schreibt aber keinen `EvidenceSufficiencyDecision`-DB-Row, obwohl das Prisma-Modell existiert. | `SUBTASK-C3-2` Sufficiency Persistence anbinden oder bewusst blockieren. |
| C1-G15 | static vault fallback | P1 | Governance Evidence Vault kann auf statische `evidenceRows` zurueckfallen; das darf nicht als lifecycle-complete gewertet werden. | `SUBTASK-C3-3` Fallback entfernen oder produktnative blocked empty state. |

## Current Strengths

- Upload erzeugt echte persistierte Artefakte: `Document`, `DocumentVersion`, `DocumentExtraction`, `EvidenceRecord`, `EvidenceItem`, `AuditEvent`.
- Review/Sufficiency erzeugt echte persistierte Artefakte: `DocumentReview`, `DocumentLink`, `EvidenceItem`, `AuditEvent`, EvidenceRecord/Document Status Updates.
- Audit-Fail-Closed ist fuer Upload und Review/Sufficiency vorgesehen.
- Release, Export und Client Visibility bleiben im Upload/Review-Slice gesperrt.
- Family/Entity/Profile APIs sind tenant-/role-/sensitivity-gescoped und verwenden Services statt statischer UI-Behauptungen.

## Recommended Implementation Slices

1. `SUBTASK-C3-1`: Context Readiness State fuer Family/Entity/Relationship/Sensitivity/Wealth Map als service-backed Output, ohne sichtbare Prozess- oder Proof-Tafeln.
2. `SUBTASK-C3-2a`: Evidence Request State mit vorhandenen Prisma-Modellen soweit moeglich, ohne Migration, falls ausreichend.
3. `SUBTASK-C3-2b`: Target Object Identity fuer Upload/Review mit `ObjectType` und `ObjectId`, statt freiem Label als Sufficiency-relevantem Input.
4. `SUBTASK-C3-3a`: Vault Readmodel fuer Document/Evidence/Review/Audit-Zusammenhang oder produktnative blockierte Details.
5. `SUBTASK-C3-3b`: Client-safe Summary Trace zu accepted evidence/review/audit, ohne Compliance Release oder Export zu behaupten.
6. `TASK-C4`: Regression und manuelle UI-Overclaim-Pruefung, insbesondere ob keine Prozess-/Gate-/Proof-/Meta-Tafeln im operativen UI sichtbar sind.

## Open Decisions For TASK-C2

- Neue DB-Migrationen sind nicht erforderlich, solange `EvidenceRecord`, `EvidenceItem`, `DocumentLink`, `DocumentReview`, `AuditEvent`, `ObjectType` und bestehende Client Context Modelle reichen.
- Falls ein eigenstaendiges `EvidenceRequest`-Modell zwingend verlangt wird, ist das ein separater Stop-Gate, weil es Schema-/Migration-Scope oeffnet.
- Target Object Types sollten initial konservativ auf vorhandene kanonische `ObjectType`-Werte begrenzt werden: `DOCUMENT`, `ENTITY`, `FAMILY_MEMBER`, `RELATIONSHIP`, `ASSET`.

## TASK-C1 Definition Of Done

- Jede Client/Evidence-Luecke ist klassifiziert: erfuellt.
- Source Artifacts sind gemappt: erfuellt, inklusive stale path Korrektur.
- Spec Slices sind klar: erfuellt.
