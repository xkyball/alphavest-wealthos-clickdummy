# AlphaVest EPIC-3 SUBTASK-C3-2B Implementation Report

Datum: 2026-06-29
Item: `SUBTASK-C3-2B - Target object identity for upload/review`
Status: erledigt

## Umsetzung

- `lib/document-upload-service.ts`
  - `targetObjectType` und `targetObjectId` als Upload-Input eingefuehrt.
  - Target-Objekt wird tenant-gescoped gegen bestehende `ENTITY`, `FAMILY_MEMBER`, `RELATIONSHIP`, `ASSET` oder `DOCUMENT` Datensaetze validiert.
  - `EvidenceRecord.relatedObjectType/relatedObjectId` wird bei Target-Auswahl auf das Zielobjekt gesetzt.
  - `DocumentLink` verbindet Upload-Dokument mit EvidenceRecord und Target-Objekt.
  - Dokument-Readmodel findet EvidenceRecords jetzt auch ueber `DocumentLink` statt nur ueber document-scoped EvidenceRecords.

- `app/api/documents/upload/route.ts`
  - Parsed `targetObjectType`/`targetObjectId` und liefert sichere Target-Identity im Dokument-Response.

- `lib/evidence-review-service.ts`
  - Review findet EvidenceRecord ueber DocumentLink, wenn der EvidenceRecord auf ein Target-Objekt scoped ist.
  - Sufficiency vergleicht gegen `requiredObjectType`/`requiredObjectId` und nicht gegen Freitext.

- `app/api/documents/review/route.ts`
  - Parsed `requiredObjectType` fuer Sufficiency Scope.

- `components/client-intake-screen.tsx`
  - Upload verwendet einen echten Entity-Target-Select.
  - Upload/Review senden und zeigen Target-Identity produktnativ.
  - Alte sichtbare Lifecycle-Core-Erklaerflaeche von Upload und Review Queue entfernt.
  - Button-Layout der Upload-Flaeche geglaettet.

- `tests/document-upload-api.spec.ts`
  - Prueft Entity Target auf Upload, EvidenceRecord-Scope und DocumentLink.

- `tests/evidence-review-api.spec.ts`
  - Review-Upload nutzt echte Entity Target Identity und Compliance-Sufficiency akzeptiert gegen denselben Scope.

- `tests/document-upload-flow.spec.ts`
  - Flow-Test nutzt die aktuelle Demo-Session-Architektur ueber localStorage.
  - Wartet auf hydrierte Upload-UI, bevor File Input gesetzt wird.

## Tests

- `pnpm exec tsc --noEmit --pretty false` - bestanden
- `pnpm playwright test tests/document-upload-api.spec.ts tests/evidence-review-api.spec.ts` - bestanden, 16/16
- `pnpm playwright test tests/document-upload-flow.spec.ts` - bestanden, 5/5

## Screenshot

- `/Users/chris/projects/alphavest-wealthos-clickdummy/artifacts/screenshots/epic-3/epic3-c3-2b-upload-target-object.png`

## Findings

- Target Object ist jetzt objektidentitaetsbasiert und nicht mehr sufficiency-relevant als Freitext.
- Upload und Review bleiben ohne Release, Export oder Client Visibility Claim.
- Vault/Client-safe Summary Readmodel ist noch offen und gehoert in `SUBTASK-C3-3`.

