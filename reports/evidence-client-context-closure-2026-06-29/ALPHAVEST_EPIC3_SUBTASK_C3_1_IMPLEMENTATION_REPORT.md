# AlphaVest EPIC-3 SUBTASK-C3-1 Implementation Report

Datum: 2026-06-29
Item: `SUBTASK-C3-1 - Implement client context classification outputs`
Status: erledigt

## Umsetzung

- `lib/dbtf-table-service.ts`
  - `contextReadinessState` und `contextReadinessReasons` fuer Family- und Entity-Readmodels eingefuehrt.
  - Readiness wird aus Visibility/Payload Mode, Sensitivity, Relationship/Tax/Birth-Year, Entity Jurisdiction/Risk/Ownership und Evidence-Link-Zustand abgeleitet.
  - Entity-Facets werden backendseitig aus dem service-backed Rowset geliefert.

- `app/api/entities/route.ts`
  - Entity-Facets werden an die UI ausgeliefert.

- `components/client-intake-screen.tsx`
  - Family UI nutzt service-backed Readiness statt lokaler Ableitung.
  - Family-Tabelle auf Auswahl, Name und Downstream-Zustand verdichtet, damit keine vertikale Tabellen-Textklippung entsteht.
  - Entity UI nutzt API-Facets statt Facets aus der aktuellen UI-Seite.
  - Relationship Demo-Graph, Relationship Proof-Steps und Audit-Failure-Erklaerblock aus der operativen UI entfernt.
  - Sichtbare Proof-/Audit-Disclosure fuer Client-Context-Flächen entfernt.
  - Sichtbare DB-/Backend-Source-Wording auf Client-Context-Flächen durch produktnative Sprache ersetzt.

- `tests/av27-client-context-closure.spec.ts`
  - Assertions fuer Family/Entity `contextReadinessState`, `contextReadinessReasons` und Entity-Facets ergaenzt.

## Tests

- `pnpm exec tsc --noEmit --pretty false` - bestanden
- `pnpm playwright test tests/av27-client-context-closure.spec.ts` - bestanden, 6/6

## Screenshot

- `/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/screenshots/epic-3/epic3-c3-1-family-context-readiness.png`

## Findings

- Relationship Context ist jetzt ehrlich blockiert statt mit statischem Graph/Table als Produktzustand dargestellt.
- Family/Entity Readiness ist jetzt service-backed, aber keine Compliance Release-, Export- oder Client Visibility-Freigabe.
- Evidence-Lifecycle-spezifische Proof-/Boundary-Flächen bestehen noch ausserhalb dieses Client-Context-Slices und muessen in `SUBTASK-C3-2`/`SUBTASK-C3-3` weiter geschlossen werden.

## Naechstes Item

`SUBTASK-C3-2` wird gemaess TASK-C2 in zwei Slices ausgefuehrt:

1. `SUBTASK-C3-2A - Evidence request state with existing models`
2. `SUBTASK-C3-2B - Target object identity for upload/review`

