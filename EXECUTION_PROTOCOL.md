# EXECUTION_PROTOCOL

## Grundsatz

Immer nur einen Prompt pro Schritt ausführen.

Die operative Source-of-Truth-Hierarchie für diese Vorbereitung lautet:

1. AlphaVest repo `AGENTS.md` und `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` aus dem Repo-Zip.
2. Repo-Zip als Code-/Dokumentationsrealität aus Git HEAD.
3. Capture-Run als visuelle/runtime Evidence.
4. Prompt-Bundle als Audit-Methode.
5. Keine externen Quellen.

## Harte Grenzen

- Read-only bis einschließlich Prompt 18.
- Keine Codeänderungen.
- Keine Refactoring-, Test-, Implementation- oder Improvement-Prompts vor abgeschlossenem Prompt 17 und Prompt 18.
- Keine App-Audit-Ergebnisse vorwegnehmen.
- Keine AlphaVest-Produktwahrheit aus dem Prompt-Bundle ableiten.
- Keine getrackten Repo-Artefakte mit dem separaten Capture-Run verwechseln.
- Keine lokalen Runtime-/Screenshot-/Capture-Artefakte als Repo-Codewahrheit behandeln.
- Keine unbelegten Features als vorhanden deklarieren.
- Jede Aussage mit Evidence-ID oder Statuswert führen.

## Statuswerte

Erlaubte Claim-Statuswerte:

- `OBSERVED`
- `INFERRED`
- `MISSING`
- `CONFLICTING`
- `NOT_VERIFIABLE`
- `NEEDS_HUMAN_DECISION`

## Schrittprotokoll pro Prompt

Nach jedem Prompt müssen diese Punkte erzeugt werden:

1. Geforderte Prompt-Artefakte exakt mit den im Prompt vorgesehenen Dateinamen.
2. Evidence IDs für alle verwendeten Upload-/Repo-/Capture-Quellen.
3. Liste `Missing`.
4. Liste `Not Verifiable`.
5. Liste `Conflicting`.
6. Liste `Needs Human Decision`.
7. Stop-/Go-Entscheidung, ob der nächste Prompt starten darf.
8. Klare Übergabe an den nächsten Prompt inklusive zulässiger Inputs.

## Prompt-Startregeln

| Situation | Regel |
|---|---|
| Alle drei Upload-Gruppen vorhanden | Prompt 01 starten; Prompt 02 erst nach den Prompt-01-Artefakten. |
| Capture-Run fehlt | Nur Prompt 01 gegen Prompt-Bundle + Repo-Zip starten; visuelle/runtime Phasen als `blocked` oder `limited` markieren; `BLOCKED_FOR_FULL_RUN: provide Capture Run`. |
| Repo-Zip fehlt | Kein AlphaVest-authority-sicherer Full Run; Prompt 01 maximal gegen vorhandenes Bundle/Capture mit `READY_WITH_BLOCKERS`. |
| Prompt-Bundle fehlt | Nicht starten; keine Audit-Methode vorhanden. |
| Pflichtinput eines Prompts fehlt | Prompt nicht starten; `BLOCKED` oder `READY_WITH_LIMITATIONS` gemäß Prompt-Regel. |
| Widerspruch zwischen Repo-Autorität und Audit-Methode | Repo-`AGENTS.md` und `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` gewinnen; Prompt-Bundle bleibt Methode. |
| Prompt 17 fehlt oder blockiert | Keine Folgeprompts für Refactoring, Tests, Implementierung oder Verbesserungen. |
| Prompt 18 fehlt oder blockiert | Keine Folgeprompts für Refactoring, Tests, Implementierung oder Verbesserungen. |

## Current Gate Decision

| Gate | Status | Entscheidung |
|---|---|---|
| Prompt-Bundle lesbar | OBSERVED | OK für Prompt 01. |
| Repo-Zip lesbar | OBSERVED | OK für Prompt 01; Limitierung wegen Namens-/Inhaltskonflikt dokumentieren. |
| AlphaVest Authority-Dateien im Repo-Zip | OBSERVED | `AGENTS.md` und True-UX-Handoff vorhanden; sie sind vor jeder weiteren Planung/QA-Claim/Prompt-Derivation zu berücksichtigen. |
| Capture-Run lesbar | OBSERVED | OK für Prompt 01 und spätere visuelle/runtime Phasen; Interaction-Proof nur teilweise vollständig. |
| Externe Quellen | OBSERVED | Nicht verwendet und nicht zulässig. |
| Codeänderungen | OBSERVED | Nicht zulässig; Vorbereitung erzeugt nur die vier Steuerartefakte. |

## Evidence-ID-Konvention ab Prompt 01

Prompt 01 soll mindestens diese Evidence-ID-Präfixe anlegen:

| Präfix | Quelle |
|---|---|
| `UP-PROMPT-*` | Prompt-Bundle-Dateien. |
| `UP-REPO-*` | Repo-Zip-Dateien. |
| `UP-CAPTURE-*` | Capture-Run-Dateien. |
| `AUTH-*` | AlphaVest-Autoritätsquellen aus Repo-Zip. |
| `LIMIT-*` | Limitations, Konflikte, nicht verifizierbare Punkte. |

## Folgeprompt-Sperre

Prompt 17 und Prompt 18 sind Pflicht vor jedem Refactoring-, Test-, Implementation- oder Improvement-Prompt.

Bis `PHASE_18_FINAL_QA_HANDOFF.md` vorliegt und Folgefähigkeit explizit freigibt, ist jeder Implementation-/Improvement-/Test-Generierungsschritt `BLOCKED`.
