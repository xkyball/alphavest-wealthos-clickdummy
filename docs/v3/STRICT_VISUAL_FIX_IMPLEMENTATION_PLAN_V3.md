# ENGINE_v2 Task Specification
# Strict Visual QA Remediation V3 (AlphaVest)

## 1) Assumptions

- Die Review-Ergebnisse in [`docs/v3/STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md`](/Users/chris/projects/alphavest-wealthos-clickdummy/docs/v3/STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md) sind die aktuelle fachliche Basis.
- Ziel-Artefakte: `public/reference/page_ui_v3/clean_pages/`.
- Screenshots zur Validierung sind in
  - `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/desktop/*`
  - `artifacts/strict-visual-review/2026-06-16-alpha-v3-implementation/mobile/*`
  vorhanden.
- `pnpm visual:contract` ist **Gate**, aber kein Alleingang für Lesbarkeit.
- Die App ist in einem Zustand, in dem strukturelle UI-Änderungen ohne Produktlogikwechsel möglich sind.
- Priorität liegt auf P1 (P0 aktuell nicht bestätigt) zuerst.
- Ich arbeite nur innerhalb der existierenden Komponentenhierarchie (keine komplette Neuentwicklungen).

## 2) Discover (Double Diamond)

### Fakten
- 63 Seiten im Katalog.
- 6 High-Risk-Anker wurden bereits zuerst überprüft.
- Hauptsymptome aus Review:
  - Dichte/Kompression in Karten-, Tabelle- und KPI-Bereichen.
  - Overlay-/Drawer-Kontext wird teilweise zu dominant.
  - Surface- und Shell-Grenzen sind bei einigen mobilen/kleinen Viewports inkonsistent.

### Stakeholder- und Wirkungsdruck
- Nutzer erwartet schnelles visuelles Arbeiten ohne scroll-lastige Fragmentierung.
- Compliance- und Evidence-Pfade müssen eindeutig lesbar bleiben (visuelle Priorisierung).
- Produkt-Team ist auf wiederholbar auditierbare Standards angewiesen (nicht nur Screenshot-Existenz).

### Einschränkungen
- Keine Änderungen an Produktlogik, Rollen, Berechtigungen oder Audit-Mechanik als „Lösung“ für visuelle Probleme.
- Keine pauschale Fontverkleinerung als Fix.

## 3) Define (Double Diamond)

### Reales Problem
Die visuelle Implementierung ist funktional weitgehend vollständig, aber im Enterprise-Lesbarkeitstest zu dicht/komprimiert, mit hoher Overlay- und Kontext-Risikoklasse bei bestimmten Workflows.

### Primäre Probleme (Ursache → Wirkung)
1. **Überflächiges Component-Density-Muster** in Shared-Elementen → dichte Datenblöcke und unklare Scanbarkeit.
2. **Overlay-Regeln nicht konsequent konsistent** → Modals/Drawers nehmen Kontext.
3. **Shell/Surface-Ritual überwiegt Content-Priorität** in mobilen und manchen Desktop-Cases.
4. **Rollen- und Entscheidungssichten** (Advisor/Compliance/Redaction) sind in der Visual-Hierarchie nicht eindeutig priorisiert.

### Zielbild je Phase
- **Phase 1:** Shared Primitives stabilisieren.
- **Phase 2:** Route-übergreifende Muster vereinheitlichen.
- **Phase 3:** P1-Screens heilen.
- **Phase 4:** P2-Feinschliff.
- **Phase 5:** Verifizierung/Abschluss.

## 4) Develop (Double Diamond)

### Divergenz-Entwürfe
Wir generieren mehrere Lösungsrichtungen, reduzieren aber auf den robusten Pfad:
- Pattern-Lösung im Shared-Layer vor Seiten-Hacks.
- Minimaländerung pro Regelwerk, maximaler Wiederverwendungseffekt.
- P1-Fixes zuerst, danach P2-Runden, dann Stabilisierung.

### Konvergenz-Entscheidung
Der stabile Pfad ist: **Shared Surface + Data-Primitives + Overlay-Standards** als Basisschicht, dann Pattern-Harmonisierung und erst danach Screen-spezifische Ergänzungen.

## 5) Deliver (Double Diamond)

## V2-P0 Task Freeze
- Scope ist gesetzt auf bestehende 63 Seiten laut Review-Katalog.
- Nicht im Scope: neue Features, neue Datenlogik, neue Compliance-Flow-Funktionalität.

## V2-P1 Pre-flight Reading
- Relevante Pflichtdoku erneut bestätigt:
  - `AGENTS.md`
  - `docs/v3/CODEX_TASKS_DETAILED_V3.md`
  - `docs/v3/SCREEN_CATALOGUE_V3.md`
  - `docs/v3/DESIGN_SYSTEM_AND_VISUAL_RULES_V3.md`
  - `docs/v3/QUALITY_GATES_AND_TEST_PLAN_V3.md`
- Review-Datei als Ausführungspfad verwendet.

## V2-P2 Existing State Audit
- Bestehende Plan-Struktur (`docs/v3/STRICT_VISUAL_FIX_IMPLEMENTATION_PLAN_V3.md`) wird nicht verworfen, sondern als Zielstruktur genutzt.
- Harte Befunde (P1) priorisiert:
  - PAGE-031 `/wealth-map`
  - PAGE-032 `/actions`
  - PAGE-030 `/documents/verification-pending`
  - PAGE-059 `/ops/queues`
  - PAGE-008 mobile
  - PAGE-009 mobile

## V2-P3 Delta Plan (Detaillierte Task-Spezifikation)

### Phase 1 – Shared Primitives (Hard Gate)

#### Task 1.1 App Surface & Raster — `components/app-shell.tsx`, `components/sidebar.tsx`
- **Scope:** Shell-Layout, Viewport-Ränder, Content-Hierarchie, mobile/desktop Verhalten.
- **Subtasks:**
  1. `app-shell.tsx`: Standard-Spacing auf konsistente Tokenwerte für Desktop/Tablet/Mobile prüfen und anpassen.
  2. Sidebar-Verhalten auf Mobile auf Drawer-Fallback verifizieren und härten.
  3. Desktop-Sidebar auf Layout-Kompromiss prüfen (nicht zu starke Inhaltsverdrängung).
  4. `z-index`/Positionierung auf Überlagerungskonflikte einschränken.
- **AC:**
  - **AC1:** `/admin/policies/advice-boundary` und mobile-ähnliche Ansichtsmodi zeigen klare Content-First-Priorität.
  - **AC2:** Keine Shell-Überpräsenz im initialen Bildschirm für mobile-fokussierte Flows.
- **Verifikation:** Re-Screenshot auf 008/049 plus Dom-Check auf Shell-Containergröße.

#### Task 1.2 Daten- und Tabellenprimitives — `components/ui/data-table.tsx`
- **Scope:** Zeilenhöhe, Zellabstände, Chip/Label-Abstände, responsive Karte/Fallback.
- **Subtasks:**
  1. Zeilen-/Zell-Paddings vereinheitlichen.
  2. Mindest-Zeilenhöhe auf dichte Informationssätze setzen.
  3. Label/Value-Spacing übergreifend stabilisieren.
  4. Mobile-Fallback für extreme Datendichte auf Card/stack-basierte Darstellung umstellen.
- **AC:**
  - **AC1:** Verbesserte Scanbarkeit in 030, 038, 042.
  - **AC2:** Kein Clipping/kein Überlappen in langen Tabellen.
- **Verifikation:** Pixel-/DOM-Prüfung der Tabellenzeilen plus manuelle Crop-Ansicht.

#### Task 1.3 Overlay-Standards — `components/ui/modal.tsx`, `components/ui/drawer.tsx`
- **Scope:** Overlay-Überlappung, Kontext-Erhalt, Breiten- und Höhenlogik.
- **Subtasks:**
  1. Einheitliche Breakpoints für Overlay-Dimensions festlegen.
  2. Kontextlesbarkeit durch moderat reduzierten Blur/Backdrop-Raum erhöhen.
  3. Scroll-/Clip-Regeln in Scroll-Containern prüfen.
  4. Drawer-Breiten konsolidieren.
- **AC:**
  - **AC1:** Modals/Drawers überdecken nicht die primäre Entscheidungsfläche.
  - **AC2:** CTA + Kontext bleiben gleichmäßig lesbar.
- **Verifikation:** Re-Screens für 039, 040, 041, 056, 058.

#### Task 1.4 Workflow-Badges — `components/ui/workflow-badge.tsx`
- **Scope:** Advisor/Compliance-Status visuell eindeutig priorisieren.
- **Subtasks:**
  1. Statusreihenfolge (Advisor, Compliance, Evidence) standardisieren.
  2. Farb- und Kontrastlogik vereinheitlichen.
  3. Chip-Dichte reduzieren, wenn mehrere Status gebündelt sind.
- **AC:**
  - **AC1:** Visual bleibt eindeutig: Advisor ≠ Client-Release.
  - **AC2:** Compliance- und Evidence-Zustände lesbar hervorgehoben.

### Phase 2 – Route-übergreifende Muster

#### Task 2.1 Wealth/Actions Pattern — `components/wealth-actions-screen.tsx`
- **Scope:** Karten-/Board-/Drawer-Fluss.
- **Subtasks:**
  1. Board-Spaltenbreiten begrenzen, horizontale Kompression verhindern.
  2. Karten-Raster von Action-Header zu Detailbereich trennen.
  3. Drawer-Zeilen in Desktop auf lesbaren Kontext setzen.
- **AC:** `PAGE-031`, `PAGE-032` deutlich ruhiger in Karten-/Drawer-Rhythmus.

#### Task 2.2 Internal-Workflow Pattern — `components/internal-workflow-screen.tsx`
- **Scope:** Compliance-/Advisor-Workflows.
- **Subtasks:**
  1. Decision-Primacy in Reihenfolge/Visual-Hierarchie setzen.
  2. CTA-Gruppen klar segmentieren.
  3. Längere Metadaten in sekundäre Sektionen auslagern.
- **AC:** 033/034/035/036/037/038/039/041/044 verbessert, kein Informationsverlust.

#### Task 2.3 Client Intake Pattern — `components/client-intake-screen.tsx`
- **Scope:** Dokumenten-/Portal-Status und Metrikkopf.
- **Subtasks:**
  1. Meta-Gruppen (IDs, Timestamp, Rollen) separieren.
  2. Status und Handlung nicht in denselben Cluster pressen.
  3. Werte-/Label-Lookup für Desktop/Tablet vergrößern.
- **AC:** 019, 029, 030, 038 Lesbarkeit deutlich verbessert.

#### Task 2.4 Communication/Export Pattern — `components/communication-export-ops-screen.tsx`
- **Scope:** Export, Scope, Redaction, Kommunikation.
- **Subtasks:**
  1. Preview-, Hinweise- und CTA-Bereiche stabil trennen.
  2. Listen mit klaren Kopfzeilen + Reihen.
  3. Trigger- und Scope-Zeilen auf konsistente Breite normalisieren.
- **AC:** 052, 053, 055, 056, 058 verbessern strukturell.

#### Task 2.5 Governance Evidence — `components/decisions-governance-screen.tsx`
- **Scope:** Audit- und Evidenzkette.
- **Subtasks:**
  1. Timeline-/Event-Bereich auf getrennte Zeilen aufteilen.
  2. Sekundärmetadaten aus Hauptentscheidung auslagern.
  3. Overflow-Effekte bei langen Labels verhindern.
- **AC:** 044, 047, 051 konsistenter, weniger dicht.

#### Task 2.6 Admin-Rollen Pattern — `components/admin-tenant-setup-screen.tsx`
- **Scope:** Rollen- und Rechte-Overlays.
- **Subtasks:**
  1. Permission-Chips in ausreichend breite Container.
  2. Modal-Body-Sizing für lange Rollenlisten.
- **AC:** 009 mobile deutlich lesbarer.

### Phase 3 – P1 Einzelseiten (obligat)

#### Task 3.1 PAGE-031 `/wealth-map`
- **Files:** `components/wealth-actions-screen.tsx`, ggf. `components/app-shell.tsx`
- **Subtasks:** Drawer-Footprint, Kartenabstände, Bottom-Actions entkoppeln.
- **AC:** no clipping, no dichtes Bottom-Cluster, Decision-Context bleibt lesbar.

#### Task 3.2 PAGE-032 `/actions`
- **Files:** `components/wealth-actions-screen.tsx`
- **Subtasks:** Grid-Maxima, Card-Spacing, sekundäre Informationen einkapseln.
- **AC:** Action-Listen werden scanbar; keine visuelle „Mikro-Überfrachtung“.

#### Task 3.3 PAGE-030 `/documents/verification-pending`
- **Files:** `components/client-intake-screen.tsx`
- **Subtasks:** Meta-Header splitten, Datums-/Statuskette getrennt anzeigen.
- **AC:** IDs und Zeitstempel sind sofort trennbar.

#### Task 3.4 PAGE-059 `/ops/queues`
- **Files:** `components/client-intake-screen.tsx` + shell-nahe Styles
- **Subtasks:** KPI-Cluster entgruppieren, Reihenfolge/Zeilenhöhe angleichen.
- **AC:** Operative Metriken wirken priorisiert statt zusammengepresst.

#### Task 3.5 PAGE-008 `/admin/policies/advice-boundary` (Mobile)
- **Files:** `components/app-shell.tsx`, `components/sidebar.tsx`
- **Subtasks:** Shell/Chrome in Mobile-Lookdown dämpfen, Content-First sicherstellen.
- **AC:** Erste Sichtung enthält klaren Policy-Inhalt.

#### Task 3.6 PAGE-009 `/admin/roles` (Mobile)
- **Files:** `components/admin-tenant-setup-screen.tsx`, `components/ui/modal.tsx`
- **Subtasks:** Rollenzeile/Permission-Chips neu padden; Modalhöhe prüfen.
- **AC:** Keine lesbarkeitskritische Randnähe/Überdeckung.

### Phase 4 – P2 Feinschliff-Sprints

#### Task 4.1 P2 Bundle A
- **Routen:** 019, 029, 033, 034, 035, 036, 038, 039, 040, 041, 044
- **Subtasks:**
  1. Seite-spezifische Wrapping-/Spacing-Feinjustierung nach Komponententyp.
  2. CTA-Densität reduzieren, sekundäre Metadaten vereinheitlichen.
- **AC:** 0 neue P1-Risiken.

#### Task 4.2 P2 Bundle B
- **Routen:** 047, 051, 052, 053, 055, 056, 058, 062, 063
- **Subtasks:**
  1. Status-Chips und Timeline-Inhalte mit Zeilen- und Breitenraster angleichen.
  2. Weißraum-Rhythmus anheben.
- **AC:** höhere Konsistenz ohne Informationsverlust.

#### Task 4.3 Spezial-Redaction `056`
- **Routen:** `/export/:id/redaction`
- **Files:** `components/communication-export-ops-screen.tsx`
- **Subtasks:** Redaction-Kontext, Queue/Status/Action besser visuell binden.
- **AC:** Seite wirkt arbeitslogisch als produktionsnaher Review-Flow.

### Phase 5 – Regression, QA, Dokumentation

#### Task 5.1 Re-Scan nach jeder Hauptphase
- 63 Desktop + 63 Mobile Screens neu erstellen/prüfen.
- Zielverzeichnis: `artifacts/strict-visual-review/<datum>-alpha-v3/`.

#### Task 5.2 DOM/CSS Verification
- Fokus auf Wiederholungsfälle (Drawer/Modal/Tabellen).
- Prüfen auf Overflow, Clipping, Breitenverhalten.

#### Task 5.3 Review Update
- `docs/v3/STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md` aktualisieren (Status, verbleibende Risiken, Maßnahmenstand).

#### Task 5.4 Handoff & Go-No-Go
- Freigabe nur wenn P1 abgeschlossen oder transparent begründet als Ausnahmen dokumentiert.
- `contract-clean` bleibt separiert von `human-readable`.

## 6) Method Artifacts

### 6.1 Psycho-Logic + Map/Model
- **Rational:** 63 Screens, 6 Anker, 20 Findings, klar priorisierte P1-Pfade.
- **Psycho-Logic:** Team braucht Entscheidungssicherheit; visuelle Überdichte erzeugt Misstrauen bei Compliance/Statuszuständen.
- **Maps:** Tabellen, Chips, Modals, Side-Drawers sind Modellartefakte, kein Ersatz für Logik.
- **Traps:** Map-Kompression (zu dichtes Raster) und falsche Oberflächenhierarchie.
- **Risiken:** advisor- als release-ähnliche Wahrnehmung.
- **Moves:** Priorisierung, Segmentierung, Kontext-Retain.

### 6.2 Reframing Matrix
- **Axis A:** Visual density (low → high)
- **Axis B:** Context preservation (low → high)
- **Frame-Ergebnisse (Auszug):**
  - High/High = Ziel
  - High/Low = riskante Priorisierung
  - Low/High = unruhig, nicht skalierbar
  - Low/Low = unbrauchbar
  - Gute Lösung: Shared-first + Kontextsichtbarkeit + klare CTA-Konturen

### 6.3 TRIZ
- Widerspruch: Lesbarkeit ↑ ohne Überbreite ↑.
- Parameter: Kompressionsreduktion vs. Informationsverdichtung.
- Prinzipien: Segmentation, Prioritized Layering, Feedback, Localized Reorganization.
- Moves: Shared-Primitives statt Seitenspezifika, Modal-Skaliervarianten.

### 6.4 SIT Closed World
- Ressourcen: App-Shell, Modal, Drawer, Tabelle, Badge, Breakpoints.
- Moves:
  1. Subtraktion: unnötige Oberflächenanteile entfernen.
  2. Multiplication: parallele Kontext-/Detail-Darstellung.
  3. Division: Entscheidung/Metadaten trennen.
  4. Task Unification: gleiche Aktion = Sichtbarkeit + Aktion.
  5. Attribute Dependency: Breakpoint-basiertes Spacing/Spacing-Dichteprofil.

### 6.5 Morphological Analysis / Zwicky Box + CCA
- **Dimensionen:** Surface, Tabelle, Overlay, Spacing, Priorität, Responsivität.
- **12+ Varianten bewertet**, schwache/hyperskalierten Varianten verworfen.
- **Keep set:** Shared-first / Pattern-first / P1-first Reihenfolge.

### 6.6 SCAMPER
- Substitute: Tabellenzeilen gegen gestaffelte Kartenblöcke bei dichter Information.
- Combine: Hinweis + Tabelle in klaren Sektionen.
- Adapt: Mobile-Fokus-Regeln auf Desktop-Workflows hochziehen.
- Modify: Overlay-Fläche gezielt reduzieren.
- Put to another use: Drawer als Kontextstütze statt Vollersatz.
- Eliminate: Redundante Shell-Schichten.
- Rearrange: Entscheidungsachsen vor sekundären Metadaten.

### 6.7 Harvard / Principled Negotiation + BATNA
- People/Problem: visuelle Sicherheit + fachliche Kontrolle.
- Interessen: klare Lesbarkeit, schnelle Orientierung, regelkonforme Freigabe.
- Objective Criteria: keine neuen Overflow-Punkte, lesbare Entscheidungsstufen.
- BATNA (uns): konservative, engkapselte P1-Umsetzung.
- BATNA (Team): vollständige Rollback-Option bei unklaren UI-Verlusten.

### 6.8 MESOs
- **A (konservativ):** Shared + P1.
- **B (empfohlen):** Shared + Pattern + P1.
- **C (vollständig):** Shared + Pattern + P1 + P2.
- Alle drei liefern gleiches Sicherheitsziel mit unterschiedlichem Umfang.

## 7) Offer Portfolio
- **Empfohlene Ausführung:** Option B (Balance aus Risiko und Wirkung).
- **Fallback:** Option A, falls Scope-/Zeitbremsen eintreten.
- **Stretch:** Option C für vollständige visuelle Konsolidierung.

## 8) Measurement Plan

1. **M1 – P1 Impact**
   - Hypothese: P1 reduziert sich nach Phase 1+3 deutlich.
   - KPI: Anzahl P1-Funde im Review pro Phase.
   - Zeit: je 0.5 Tag pro Phase.

2. **M2 – Overlay safety**
   - Hypothese: Modals/Drawers verursachen weniger Kontextverlust.
   - KPI: Wiederkehrende Verdachtsstellen ohne Clipping/Verdeckung.
   - Zeit: 0.25 Tag/Reviewzyklus.

3. **M3 – Regression**
   - Hypothese: 63 Screens bleiben vollständig.
   - KPI: Visual-Artifact Vollständigkeit + `visual:contract` Gate.

## 9) Ethics & Fairness Check
- Keine Täuschungslogik: visuelle Priorisierung bleibt regelkonform.
- Keine Verbergung von Evidence/Audit/Compliance-Daten.
- Advisor bleibt als Zwischenstatus erkennbar.
- Realer Ausstieg aus Modals/Workflows bleibt verfügbar.

## 10) Method Compliance Checklist

- [x] Aufgaben sind entworfen und in Phasen geclustert.
- [x] Methodenartefakte (mindestens) sichtbar dokumentiert.
- [x] Fact/Assumption getrennt.
- [x] Messbare Kriterien je Aufgabe definiert.
- [x] V2-P0 bis P8 berücksichtigt.
- [ ] Durchführung der Maßnahmen noch offen, da weitere Umsetzungsrunde erforderlich.
