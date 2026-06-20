# PROMPT — AlphaVest MVP Readiness Verdict Generator from Interaction & DB Reality Audit

Du arbeitest im AlphaVest WealthOS Projektkontext.

## 1. Ziel

Prüfe auf Basis des vorhandenen Reality Audits:

`ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md`

ob AlphaVest aktuell wie ein **fertiges MVP** wirkt — oder ob es eher ein fortgeschrittener Prototyp / teilweise DB-gestützter Demo-Stand / MVP-naher Patch-Kandidat ist.

Die Kernfrage lautet:

> Sieht das aktuelle AlphaVest-Projekt nach einem fertigen MVP aus?

Erzeuge als Ergebnis ein Markdown-Artefakt:

`ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md`

Dieses Artefakt soll eine klare, harte, nicht-beschönigende Entscheidung liefern.

Wichtig: Nicht prüfen, ob das Projekt viel Arbeit enthält. Nicht prüfen, ob es eine gute Richtung hat. Nicht prüfen, ob es nah dran ist. Prüfe, ob es **als MVP wirklich fertig genug** ist, um als funktional nutzbare, DB-gestützte, interaktive App verstanden zu werden.

## 2. ENGINE-Kombination

Nutze die optimale Kombination aus:

### ENGINE_v3 Standard — Evidence-First MVP Readiness Verdict

Für:

* Fakten-vs-Annahmen-Trennung
* Audit-Evidence-Auswertung
* MVP-Readiness-Gate
* P0-/Safety-/Proof-Status
* No-Overclaim-Kontrolle
* harte Entscheidung statt Hoffnung
* klare Trennung von „fortgeschritten“ und „fertig“

Pflichtphasen:

1. Charter
2. Evidence
3. Framing
4. Divergence
5. Contradictions
6. Branch Build
7. Debate
8. Adversarial Review
9. Convergence
10. Proof
11. Learning Log

### ENGINE_v2 — Product Judgment / Reframing / MVP Sensemaking

Für:

* Reframing von „viel wurde gebaut“ zu „ist es nutzbar?“
* Unterscheidung von Prototype, Demo, MVP Candidate und MVP Ready
* Produktlogik, Nutzerwert, Arbeitsfähigkeit und Vertrauen
* konkrete Go/No-Go-Einschätzung

### ENGINE_v2-B Implementation Handoff Discipline

Für:

* klare Gate-Matrix
* file-/audit-evidence-basierte Bewertung
* Actionable Patch Path
* keine neue Implementation
* klare Acceptance Criteria
* spätere Codex-Nacharbeit ableitbar

### ENGINE_v2 Psycho-Logic / Map-vs-Reality Check

Für Schutz vor Scheinsicherheit:

* „viel Code = MVP“
* „Prisma existiert = DB-backed app“
* „Drawer sichtbar = Interaction fertig“
* „API existiert = Workflow fertig“
* „Test existiert = Proof“
* „Demo action = echter Workflow“
* „teilweise funktionierend = MVP fertig“
* „Handoff sauber = Produkt fertig“

### ENGINE_v2 Compression / Operational Layer

Für:

* kurze, klare Entscheidung
* harte Tabellen
* wenige, konkrete nächste Schritte
* keine Theorie

## 3. Source-of-Truth-Reihenfolge

Nutze zuerst:

1. `ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md`

Dann, falls vorhanden und nötig als Kontext:

2. `ALPHAVEST_CODEX_HANDOFF_EXECUTION_PACK_v2_1_PATCHED.zip`
3. `ALPHAVEST_CODEX_HANDOFF_EXECUTION_GUIDE_v2_1_PATCHED.pdf`
4. `FINAL_CODEX_IMPLEMENTATION_HANDOFF.md`
5. `FINAL_CODEX_TASK_MASTER.md`
6. `P0_TEST_ASSERTION_AND_FIXTURE_PLAN.md`
7. `TASK_DONE_DEFINITION_AND_QA_CHECKLIST.md`
8. `ALPHAVEST_CODEX_NO_DECISION_READINESS_AUDIT.md`
9. `ALPHAVEST_UI_INTERACTION_REALITY_CLARIFICATION.md`

Wenn `ALPHAVEST_INTERACTION_AND_DB_REALITY_AUDIT.md` fehlt, entscheide `MISSING_INPUT`.

## 4. Harte Regeln

Das Artefakt darf nicht:

* Code schreiben
* Tests schreiben
* Commands ausführen
* Implementation starten
* Produkt-Scope ändern
* neue APIs vorschlagen, außer als späteren Patchbedarf
* Schemaänderungen empfehlen, außer als späteren blocker-/decision-pfad
* P0 als passed erklären, wenn Tests nicht ausgeführt wurden
* DB-backed readiness behaupten, wenn Persistence nur teilweise belegt ist
* Interaction readiness behaupten, wenn UI nur sichtbar, statisch oder demo-only ist
* „MVP fertig“ sagen, nur weil viel Struktur/Handoff existiert

## 5. Entscheidungslogik

Nutze genau eine dieser Entscheidungen:

* `MVP_READY`
* `MVP_READY_WITH_MINOR_LIMITATIONS`
* `MVP_CANDIDATE_PATCH_REQUIRED`
* `ADVANCED_DEMO_NOT_MVP_READY`
* `CLICKDUMMY_OR_STATIC_PROTOTYPE`
* `INSUFFICIENT_EVIDENCE`
* `BLOCKER`

Entscheide:

### `MVP_READY`

Nur wenn:

* Kernworkflows sind interaktiv
* Kernworkflows sind DB-backed
* Nutzer können sinnvolle Aktionen starten und abschließen
* Ergebnisse persistieren
* mehrere Rollen sehen korrekte Zustände
* Permission / Safety / Visibility ist bewiesen
* P0-Tests wurden ausgeführt und bestanden
* Validation Commands wurden ausgeführt
* keine major blockers offen sind

### `MVP_READY_WITH_MINOR_LIMITATIONS`

Nur wenn:

* MVP-Kern ist wirklich nutzbar
* DB-backed Workflows sind end-to-end bewiesen
* Interaction Lifecycle ist überwiegend real
* Remaining Gaps sind nicht kernkritisch
* keine P0-Blocker offen sind

### `MVP_CANDIDATE_PATCH_REQUIRED`

Wenn:

* starke Teile existieren
* ein oder mehrere echte vertikale Workflows teilweise funktionieren
* aber kritische Workflows noch gezielte Patches brauchen
* Workability plausibel nahe ist, aber nicht fertig
* Tests/Proof/DB/Persistence noch fehlen

### `ADVANCED_DEMO_NOT_MVP_READY`

Wenn:

* viel UI und Struktur existiert
* einige DB-backed Teile existieren
* aber viele Workflows static/demo/actionId/local-state bleiben
* Nutzer nicht durchgängig produktiv arbeiten können
* MVP-Release-Claim nicht verantwortbar ist

### `CLICKDUMMY_OR_STATIC_PROTOTYPE`

Wenn:

* UI überwiegend statisch ist
* keine echte DB-gestützte Workability existiert
* Aktionen überwiegend no-op/demo/local-only sind

### `INSUFFICIENT_EVIDENCE`

Wenn:

* Audit nicht ausreicht
* kritische Quellen fehlen
* keine belastbare Aussage möglich ist

### `BLOCKER`

Wenn:

* eine Stop Rule verletzt würde
* Product-/Safety-/P0-Readiness falsch behauptet werden müsste

## 6. Erwartete Output-Struktur

Erzeuge exakt:

# ALPHAVEST_MVP_READINESS_VERDICT_FROM_REALITY_AUDIT.md

## 1. Executive Decision

Eine klare Entscheidung aus:

* `MVP_READY`
* `MVP_READY_WITH_MINOR_LIMITATIONS`
* `MVP_CANDIDATE_PATCH_REQUIRED`
* `ADVANCED_DEMO_NOT_MVP_READY`
* `CLICKDUMMY_OR_STATIC_PROTOTYPE`
* `INSUFFICIENT_EVIDENCE`
* `BLOCKER`

Beantworte direkt:

* Sieht es nach fertigem MVP aus?
* Wenn nein: wie weit ist es wirklich?
* Was ist schon echt?
* Was ist noch Demo / partial / static?
* Was blockiert MVP-Readiness?
* Was wäre der Minimum Path to MVP?

## 2. Evidence Summary from Reality Audit

| Evidence Area | Audit Finding | MVP Impact | Decision |
| ------------- | ------------- | ---------- | -------- |

Muss enthalten:

* Interaction Design
* Drawer / Modal Lifecycle
* Upload Vertical
* DB / Prisma Reality
* API Persistence
* Workflow Persistence
* Review / Approval / Compliance
* Client Visibility
* Evidence / Audit / Export
* Tests / Validation
* End-to-End Workability

## 3. MVP Readiness Gate Matrix

| Gate | Required for MVP | Audit Status | Pass / Partial / Fail | Reason |
| ---- | ---------------- | ------------ | --------------------- | ------ |

Muss enthalten:

* Real Interaction Lifecycle
* DB-backed core workflow
* Persisted reload proof
* Typed user payloads
* Role / permission proof
* Client visibility proof
* Evidence sufficiency proof
* Audit proof
* Export proof
* Error / blocked states
* P0 test proof
* Validation command proof

## 4. What Is Already Real

| Area | Real Evidence | Limit |
| ---- | ------------- | ----- |

Führe nur Dinge auf, die laut Audit wirklich belegt sind.

## 5. What Is Still Demo / Partial / Static

| Area | Current Reality | Why Not MVP-Ready |
| ---- | --------------- | ----------------- |

Muss schonungslos sein.

## 6. MVP-Blocking Gap Register

| Gap ID | Gap | Severity | Why It Blocks MVP | Minimum Required Fix |
| ------ | --- | -------- | ----------------- | -------------------- |

Severity:

* `MVP_BLOCKER`
* `MAJOR_GAP`
* `MINOR_GAP`
* `INFO`

## 7. MVP Candidate vs Finished MVP

| Dimension | MVP Candidate? | Finished MVP? | Verdict |
| --------- | -------------- | ------------- | ------- |

Muss den Unterschied klar machen.

## 8. Minimum Path to MVP

| Step | Patch Area | Why Needed | Done Criteria |
| ---- | ---------- | ---------- | ------------- |

Maximal 10 Schritte.

## 9. Claims That Must Not Be Made Yet

Liste explizit:

* „fully DB-backed app“
* „finished MVP“
* „production-ready“
* „P0 passed“
* „all workflows are real“
* „real export implemented“
* „complete RBAC/auth“
* „complete interaction lifecycle“

oder alle Claims, die aus dem Audit nicht belegbar sind.

## 10. Final Recommendation

Nutze genau eine Empfehlung:

* `DO_NOT_CALL_THIS_FINISHED_MVP`
* `CALL_IT_MVP_CANDIDATE_AFTER_TARGETED_PATCH`
* `CALL_IT_INTERNAL_ALPHA`
* `CALL_IT_ADVANCED_DB_BACKED_DEMO`
* `RUN_MORE_AUDIT_FIRST`

Gib danach maximal 7 konkrete nächste Schritte.

## 11. Acceptance Criteria

| Criterion | Required Standard | Pass/Fail |
| --------- | ----------------- | --------- |

Muss enthalten:

* basiert auf Reality Audit
* keine Implementation gestartet
* keine Tests geschrieben
* keine Commands ausgeführt
* MVP-Readiness nicht overclaimt
* Demo/partial/static klar getrennt
* Minimum Path to MVP enthalten
* harte finale Empfehlung enthalten

## 12. Final Summary

Maximal 10 Bulletpoints:

* Ist es ein fertiges MVP?
* Was ist der ehrlichste Status?
* Was ist schon gut?
* Was fehlt?
* Was ist der nächste konkrete Schritt?
