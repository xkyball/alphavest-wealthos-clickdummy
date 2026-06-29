# AlphaVest EPIC-3 SUBTASK-C3-2A Implementation Report

Datum: 2026-06-29
Item: `SUBTASK-C3-2A - Evidence request state with existing models`
Status: erledigt

## Umsetzung

- `lib/document-upload-service.ts`
  - Beim Upload wird ein eigenes `EvidenceItem` mit `itemType = evidence_request` erzeugt.
  - Der Request-Zustand wird im selben auditpflichtigen Upload-Transaction-Scope persistiert.
  - Keine neue Tabelle, keine Migration.

- `app/api/documents/upload/route.ts`
  - Gibt `evidenceRequestState = requested_upload_received` als sicheren Zustand aus.
  - Interne EvidenceItem-IDs bleiben aus der Response heraus.

- `components/client-intake-screen.tsx`
  - Upload-Erfolgstext meldet produktiv, dass der Evidence Request erfasst wurde und Review noch aussteht.

- `tests/document-upload-api.spec.ts`
  - Prueft persistiertes `evidence_request` EvidenceItem.
  - Prueft, dass keine interne Request-Item-ID leakt.
  - Prueft den erweiterten Safety-Response-Shape.

- `tests/evidence-review-api.spec.ts`
  - Upload-Helper auf den erweiterten Safety-Response-Shape aktualisiert.

## Tests

- `pnpm exec tsc --noEmit --pretty false` - bestanden
- `pnpm playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts` - bestanden, 16/16

## Findings

- Evidence Request ist jetzt von reiner Upload-Persistenz unterscheidbar.
- Target Object Identity ist noch nicht geschlossen; das ist das naechste separate Item `SUBTASK-C3-2B`.

