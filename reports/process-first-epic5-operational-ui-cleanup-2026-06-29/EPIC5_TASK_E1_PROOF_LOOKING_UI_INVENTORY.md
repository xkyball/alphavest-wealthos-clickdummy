# EPIC-5 TASK-E1 - Proof-looking/static operational UI inventory

Datum: 2026-06-29
Repo: /Users/chris/projects/alphavest-wealthos-clickdummy
Quelle: reports/process-first-ui-io-gap-audit-2026-06-29/ALPHAVEST_PROCESS_FIRST_UI_GAP_TICKET_ARCHITECTURE.json

## Task Definition

TASK-E1 fordert eine Analyse der sichtbaren UI, die produktiv, statisch, proof-looking oder intern scaffolded wirken kann. Ergebnis ist eine Wire/Block/Remove/Move/Leave-Klassifikation fuer die nachfolgenden Spezifikations- und Umsetzungsschritte.

## Scoped Primitive Inventory

| Artefakt | Befund | Klassifikation | Begruendung |
| --- | --- | --- | --- |
| components/ui/action-zone.tsx | `ActionButton` erzwingt disabled Zustand, wenn kein `href`/`onClick` existiert; Default-Reason nennt aktuell Workflow-Verdrahtung. | block | Gute Sicherheitslogik, aber Default-Text ist technisch. Muss produktnative Gruende erzwingen. |
| components/ui/master-detail-surface.tsx | Prop/Attribut `proofPlacement` und `data-ux-queue-proof-placement` existieren in Default-Surfaces. | move | Nicht sichtbar, aber Default-UI sollte keine Proof-Platzierung modellieren. Proof gehoert in Reviewer-/Report-Kontext. |
| components/ui/state-panel.tsx | Zustandspanels sind produktiv nutzbar, solange sie echte Objekt-/Blocker-/Recovery-Zustaende zeigen. | leave | Kein sichtbares Proof-Scaffold per se. Muss aber nicht als Prozess-/Gate-Tafel missbraucht werden. |
| components/ui/status-chip.tsx | StatusChip markiert sich als static visual summary, nicht Completion-Gate. | leave | Produktnative Statusanzeige ist akzeptabel, sofern nicht als Prozessbeweis gezaehlt. |
| components/ui/evidence-list.tsx | Statische Evidence-Liste mit `data-ux-phase5-*`; zeigt Evidence, aber keine Lifecycle-Aktion. | block | Als Read-only-Liste okay, darf nicht als Completion/Proof gelten. Interne Attribute muessen aus Default-UI raus. |
| components/ui/process-gate-rail.tsx | Rendered sichtbare Prozess/Gate-Rail mit Acceptance-/Business-Process-/Next-Step-Metadaten. | remove | Widerspricht dem zentralen Non-Negotiable: keine Prozess-, Gate-, Proof- oder Meta-Tafeln in der UI. |
| components/operational-default-surface.tsx + components/proof-reviewer-mode-slot.tsx | Reviewer-Proof-Slot wird nur bei `?proofMode=reviewer` gerendert. | leave | Nicht default-visible. Akzeptabel als explizites Reviewer-Tool, solange operational default leer bleibt. |

## Scoped Screen Inventory

| Surface | Befund | Klassifikation | Umsetzungshinweis |
| --- | --- | --- | --- |
| components/client-intake-screen.tsx S019 | Sichtbare `epic-07-proof-boundary`-Aside mit "Client-safe boundary", "Mutation result", "Visibility source", "Readiness". | remove/move | Als separate Boundary-Tafel entfernen. Client-safe Projektion darf als Objektzustand bleiben. |
| components/client-intake-screen.tsx S024-S029 Evidence lifecycle | Sichtbarer `epic08-proof-boundary-*` Block "Review boundary". | remove | Boundary-Metadaten bleiben in Service/Tests/Reports, nicht in Default-UI. |
| components/decisions-governance-screen.tsx governance surfaces | Sichtbarer `epic-06-proof-boundary` Block mit Client-safe/Audit/Denied. | remove | Werte sind wichtige Safety-Fakten, aber als Proof-Tafel unzulaessig. In echte Blocker/disabled reasons integrieren. |
| components/internal-workflow-screen.tsx compliance decision room | Alte `ProcessGateRail` Funktion existiert und waere unzulaessig, wird aktuell nicht genutzt. | remove | Dead code/import entfernen, damit keine Re-Entry-Flaeche bleibt. |
| components/internal-workflow-screen.tsx S038/S039 | MasterDetailSurface setzt `proofPlacement`, mehrere `data-epic11-proof-*` Attribute. | move | Nicht sichtbare Test-/Trace-Attribute nicht als UI fuehren. Produktive UI bleibt ueber Review-/Evidence-/Action-Kontext. |
| components/decisions-governance-screen.tsx S043 | MasterDetailSurface setzt `proofPlacement="secondary_tab"` und `data-epic12-step-pendants`. | move | Attribut-/Contract-Proof in Reports/Tests; UI selbst nur Decision Register/Room. |

## Action Classification

| Pattern | Decision | Rule |
| --- | --- | --- |
| Visible action with service/API/client workflow handler | wire | Behalten, wenn Verhalten oder State Change belegt ist. |
| Visible action intentionally unavailable for safety | block | Disabled bleiben, aber Grund muss fachlich sein, nicht "workflow target wired". |
| Static action that looks executable and has no handler | remove/block | Entfernen oder in produktiven disabled reason ueberfuehren. |
| Evidence/status display | leave/block | Anzeigen erlaubt; darf nicht Lifecycle-Completion oder Proof-Claim ersetzen. |
| Process/Gate/Proof panel | remove | Keine Default-UI-Flache. |
| Internal proof metadata | move | In Tests, contracts, reports, reviewer-only tools, nicht in sichtbare Default-UI. |

## Recommended Cleanup Slices

1. Primitive cleanup: `ActionButton` Default-Reason fachlich neutralisieren; `MasterDetailSurface` Proof-Placement aus Default-Attributen entfernen/umbenennen.
2. Visible proof panel removal: S019, Evidence lifecycle proof boundary, governance proof boundary.
3. Dead/re-entry cleanup: `ProcessGateRail` Nutzung/import/export/tests entfernen oder als retired markieren.
4. Test alignment: Route smoke und source tests weg von Proof-Boundary-Sichtbarkeit hin zu produktiven Objektzustanden, disabled reasons und service-backed Actions.

## TASK-E1 Status

Complete. Alle genannten Primitive-Familien wurden klassifiziert. Die Umsetzung wird nicht in der Analyse versteckt, sondern ueber TASK-E2/E3 gefuehrt.
