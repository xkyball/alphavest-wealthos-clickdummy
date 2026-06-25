# AV27 Phase 7 - Client Payload / Export Redaction Sweep

Date: 2026-06-25
Ticket chain: `AV27-P7-T03-A`, `AV27-P7-T03-S`, `AV27-P7-T03-I`, `AV27-P7-T03-Q`

## Ticket Status

| Ticket | Status | Result |
| --- | --- | --- |
| `AV27-P7-T03-A` | Done | Inspected the Phase 6 payload contract, visibility engine, export service and payload sweep tests. |
| `AV27-P7-T03-S` | Done | Locked payload proof to API, UI and export surfaces using the centralized Phase 6 classification contract. |
| `AV27-P7-T03-I` | Done | Implemented `av27PayloadRedactionSweepMatrix` and sample inspectors in `lib/av27-phase7-certification.ts`. |
| `AV27-P7-T03-Q` | Done | `tests/av27-phase7-certification.spec.ts` validates clean safe payloads and blocked unsafe payloads. |

## Payload Matrix

| Surface | Surface name | Forbidden classes | Negative proof | Process coverage |
| --- | --- | --- | --- | --- |
| `api` | client decision/recommendation API projection | `AI_DRAFT`, `INTERNAL_RATIONALE`, `COMPLIANCE_NOTES` | Client/API projection rejects draft, rationale and compliance-note fields. | `E-006`, `H-001`, `H-003`, `I-004` |
| `ui` | client portal projection UI | `UNRELEASED_EVIDENCE`, `UNRELEASED_RECOMMENDATION`, `HIDDEN_FIELD` | Client UI projection hides unreleased evidence, unreleased recommendation and hidden metadata. | `C-003`, `C-005`, `H-001`, `H-003` |
| `export` | client-safe export package | `AI_DRAFT`, `INTERNAL_RATIONALE`, `COMPLIANCE_NOTES`, `UNRELEASED_EVIDENCE` | Export preview/package/download excludes or blocks forbidden internal payload. | `E-006`, `G-006`, `J-009` |

## Contract Owner

Payload truth remains centralized in `lib/av27-phase6-payload-contract.ts`. Phase 7 does not create a competing field allowlist; it consumes the Phase 6 contract to certify the cross-process sweep.

