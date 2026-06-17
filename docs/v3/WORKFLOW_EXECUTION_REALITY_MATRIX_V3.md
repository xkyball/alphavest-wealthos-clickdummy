# Workflow Execution Reality Matrix V3

Date: 2026-06-17

This matrix compares the intended AlphaVest workflows against observed implementation behavior. Levels follow `CAPABILITY_TRUTH_AUDIT_V3.md`.

| Workflow | Intended Capability | Current Level | Current Evidence | Must Implement Next |
|---|---|---:|---|---|
| UF-01 Platform policy setup | Configure platform-wide policy, review, and workflow rules | E3 | Settings UI exists; save behavior is generic demo action/audit, not persisted policy state | Versioned policy form, validation, policy table writes, gate integration |
| UF-02 Tenant onboarding | Create tenant, assign team, invite users, activate tenant | E4-E5 | Tenant/team/invite demo actions exist; visible fields are static or read-only | Persist form payloads, invitation lifecycle, activation prerequisites, reload from DB |
| UF-03 User onboarding and consent | User accepts invite, consents, completes profile/access setup | E2-E4 | Onboarding screens exist, but no real auth, MFA, invite token, or consent payload flow | Demo invitation tokens, consent persistence, profile payload save |
| UF-04 Family profile intake | Maintain client and family data | E4-E5 | Fixture actions submit profile/add family/save relationships | Controlled forms, validation, arbitrary members, relationship graph persistence |
| UF-05 Entity and asset intake | Maintain trusts, companies, assets, review completeness | E4-E5 | Fixture actions mark readiness/request info | Entity/asset CRUD, ownership validation, asset value/source tracking, data quality queue |
| UF-06 Document upload and verification | Upload, classify, extract, review, verify documents | E1-E5 | Visual dropzone; JSON `j04.uploadDocument`; metadata-only file service | Real drag/drop/input, multipart upload, binary storage, scan/OCR/extraction status, reviewer edits |
| UF-07 Signal review and routing | Review trigger signals and assign actions | E5 | J01 fixture actions can mutate seeded workflow objects | General trigger review service, notes, assignment, data-driven queues |
| UF-08 Advisor approval | Advisor reviews recommendation and approves/escalates | E6 | Demo permission and workflow gate behavior exists for seeded recommendation | Payloaded review notes, attachment/evidence requirements, reusable approval state machine |
| UF-09 Compliance release/block | Compliance releases or blocks client visibility | E6 | Central no-unapproved-advice gates and fixture actions | Reusable release/block API, policy-driven checklists, persisted release rationale |
| UF-10 Client decision | Client accepts/rejects/defers released recommendation | E6 | Client decision fixture only after gate conditions | Decision input, family approval variants, communication/evidence linkage |
| UF-11 Evidence review and export | Review evidence and generate export package | E5 | Manifest metadata and export scope fixture actions | Generated archive/PDF/CSV, object storage, signed download, export audit route |
| UF-12 Governance access change | Invite users, change roles, approve access | E6 | Role-aware demo denials and fixture access approval | Editable role/access forms, second confirmation phrase validation, durable user/role writes |
| UF-13 Communication escalation | Send digital messages and record calls | E1-E3 | Communication screens are mostly static; message button has no domain handler | Message/call forms, delivery status, call notes, evidence/audit events |
| UF-14 Operations monitoring | Manage SLA queues and system health | E1-E2 | Visual queues and dashboards | Live queues from workflow state, assignment, SLA transitions, exception handling |
| J12 Suitability | Review suitability gap and prevent client release until controls complete | E6 | Demo tests cover no-client-release behavior | Editable suitability inputs, evidence requirements, real release unblock path |
| J13 IPS | Maintain investment policy statement review | E5-E6 | Fixture workflow and release guard exist | IPS document/form editor, versioning, review comments, evidence linkage |
| J14 Risk alert | Review risk alert and enforce blocked-release guard | E5-E6 | Fixture workflow and release guard exist | Alert payload ingestion, triage notes, escalation assignments, closure evidence |

## Route Reality Notes

Planned pageflow includes detail/review routes such as document review/detail, export audit, communication message/call records, and governance confirmation states. The catch-all route pattern can support them, but several are not yet backed by real payload services or route-specific operational screens. Before adding new visual routes, implement the relevant domain service and persistence path.

## Highest-Risk Demo Illusions

1. Document upload looks like drag/drop but cannot accept a real file.
2. Form fields often look editable but are static `FieldBox`, `FieldPill`, or `readOnly` values.
3. Export appears package-like but generates only metadata/manifest state.
4. Governance confirmations show critical UI but confirmation phrase handling is not operational.
5. Communication send/call flows look active but are not yet persisted communications.

