# AlphaVest Data Model Implementation Reconciliation V3

Generated: 2026-06-16T07:47:11+02:00

## Summary

The planned `DATA_MODEL_V3.md` and current `prisma/schema.prisma` are broadly aligned for the V3 demo scope. Most missing work is not schema creation; it is validated write paths, repository/API boundaries, tenant/role enforcement, file/export realism and audit/evidence transaction wiring.

## Entity Reconciliation

| Planned Entity | Planned Fields/Relations | Prisma Entity | Current Fields/Relations | Seed/Demo Availability | Workflow Consumers | Missing Fields | Missing Relations | Migration Risk | Source Proof |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PlatformTenant | platform root, policies | `PlatformTenant` | id, name, slug, status, timestamps | seeded platform policies | W-01 | none obvious | policy relation is generic | low | `prisma/schema.prisma:278` |
| ClientTenant | tenant profile/status/jurisdiction | `ClientTenant` | id, platformTenantId, display/legal names, slug, status, jurisdiction | four tenants seeded | W-02+ | activation readiness fields may be payload/status based | policies not direct FK | low | `prisma/schema.prisma:296`, `prisma/seed.ts:323-393` |
| User/Profile | users, identity, role context | `User`, `UserProfile` | user plus profile relation | 27 users seeded per report | W-03/W-04/W-12 | invite token/session fields deferred | auth provider relation absent by design | medium for real auth later | `prisma/schema.prisma:350-373` |
| RBAC | roles, permissions, assignments | `Role`, `Permission`, `UserRole`, `RolePermission` | role templates and grants | roles/permissions seeded | all workflows | policy SOD fields mostly payload/helper | object-level grants via access request | medium | `prisma/schema.prisma:393-460`, `prisma/seed.ts:140-271` |
| Access workflow | access request and second confirmation | `AccessRequest`, `SecondConfirmation` | request/confirm models exist | seeded | W-12 | stronger SOD fields, confirmation phrase lifecycle | user/role relation may be UUID not strict FK everywhere | medium | `prisma/schema.prisma:474-495` |
| Consent | privacy/terms acceptance | `ConsentRecord` | version, accepted, timestamps | seeded | W-03 | token/source metadata may need expansion | user link exists | low | `prisma/schema.prisma:514` |
| Engagement | client/advisory engagement lifecycle | `Engagement` | tenant/user/status/type | seeded | W-02/W-04 | workflow-specific checklist fields | links can stay generic | low | `prisma/schema.prisma:534` |
| FamilyMember | family participants | `FamilyMember` | person fields and status | seeded | W-04/W-10 | privacy minimization review fields | profile/user links may need strengthening | low | `prisma/schema.prisma:563` |
| Relationship | family/entity relationships | `Relationship` | source/target/type/status | seeded | W-04/W-05 | percentage/conflict details may live in payload | graph can use polymorphic target IDs | medium | `prisma/schema.prisma:583` |
| Entity/Asset | trusts/companies/assets | `Entity`, `EntityParticipant`, `Asset` | core entity, participants, assets | seeded | W-05 | jurisdiction review payload may need explicit fields | document/evidence links through `DocumentLink` | medium | `prisma/schema.prisma:625-667` |
| Documents | upload, version, extraction, review, links | `Document`, `DocumentVersion`, `DocumentExtraction`, `DocumentReview`, `DocumentLink` | full doc pipeline models | seeded | W-06/W-11 | storage/file integrity needs real object store | evidence link exists via document/evidence item | medium/high for file realism | `prisma/schema.prisma:691-772` |
| Trigger/Action | signal and action lifecycle | `Trigger`, `ActionItem` | statuses, clientVisible, owner fields | seeded and J01-mutated | W-07/W-05 | stronger typed transition table | recommendation/action links exist indirectly | medium | `prisma/schema.prisma:786-811` |
| Recommendation/Options | recommendation draft/release | `Recommendation`, `RecommendationOption` | status, visibility, options | seeded and J01-mutated | W-07/W-09/W-10 | release transaction wrapper | approval/compliance/evidence links may need stricter FK | high for safety | `prisma/schema.prisma:837-866` |
| Approval | advisor approval | `Approval` | status, notes, actedAt | seeded and J01-mutated | W-08 | revise/request data conditions | recommendation relation adequate | medium | `prisma/schema.prisma:882` |
| ComplianceReview | release/block review | `ComplianceReview` | status, checks, release/block timestamps | seeded | W-09 | transactional gate outcome record | evidence/recommendation links may need hard FK | high | `prisma/schema.prisma:901`, `DATA_MODEL_V3.md:986-996` |
| Decision/Participant | client decision | `Decision`, `DecisionParticipant` | status, participants | seeded | W-10 | final signed acknowledgement fields | evidence linkage needs transaction | high | `prisma/schema.prisma:926-950` |
| Evidence | record/items | `EvidenceRecord`, `EvidenceItem` | status, visibility, items | seeded | W-06/W-09/W-10/W-11 | immutable release/version metadata may expand | source links polymorphic | high | `prisma/schema.prisma:965-989` |
| Audit | append-only sensitive events | `AuditEvent` | event, target, actor, result, metadata | seeded and J01/generic demo writes | all sensitive workflows | append-only DB guard not obvious | broad target polymorphism | high for governance | `prisma/schema.prisma:1006`, `prisma/seed.ts:1747-1800` |
| Communication | threads/messages/calls | `MessageThread`, `Message`, `CallEvent` | message/call models | seeded | W-13 | advice-sensitivity explicit field likely needed | evidence link optional | medium | `prisma/schema.prisma:1053-1090` |
| Export | export request and package lifecycle | `ExportRequest` | type, status, redaction profile | seeded | W-11 | actual file/package/share link/checksum | evidence relation may need stricter linking | high for Phase 18 | `prisma/schema.prisma:1112`, `prisma/seed.ts:1607-1635` |
| Policy | platform/tenant rules | `PolicyDefinition` | key/category/payload | seeded | W-01/W-02/W-09/W-11 | approval/version workflow may expand | tenant/platform relation via IDs | medium | `prisma/schema.prisma:1133`, `prisma/seed.ts:606-638` |
| Ops/Data Quality | queues/issues | `QueueItem`, `DataQualityIssue` | queue/issue models | seeded | W-14/W-04/W-05 | SLA history and assignment audit could expand | generic links | low/medium | `prisma/schema.prisma:1155`, `prisma/seed.ts:1671-1706` |

## Gaps By Category

| Category | Gap | Impact | Next Action |
| --- | --- | --- | --- |
| Planned but not modeled | No major planned entity is completely absent for the demo scope. | Low schema risk. | Avoid new schema unless a selected form proves a missing field. |
| Modeled but not used by UI | Access requests, second confirmations, export requests, document versions/reviews, message/call events and queues are mostly display/seed-backed. | UI can overclaim workflow completion. | Wire selected masks to existing models. |
| UI/demo fields not represented | Some screen-specific labels, readiness cards, visual warnings and screencast expected mutations live in TS data or JSON. | Medium drift risk. | Convert only fields needed for stateful workflows into validated models/payloads. |
| State enum gaps | Broad status enums exist, but legal transition maps are not centralized. | Invalid state transitions possible. | Add transition service per workflow. |
| Evidence/audit linkage | Tables exist, but services often preview rather than persist; generic audit fallback lacks domain mutation. | High proof risk. | Wrap domain mutations with audit/evidence creation. |
| Client visibility | `clientVisible` and visibility statuses exist; gate helper exists; release transaction missing. | High compliance risk if overclaimed. | Implement compliance release transaction before decision flows. |
| Tenant/role ownership | Tenant IDs and RBAC tables exist; permission engine is permissive demo. | Security semantics are not real yet. | Phase 16 role/tenant guard after core demo transactions. |
| File/export realism | Document/export models exist; no actual file/package generation proof in current app code. | Export/document workflows remain visual. | Phase 18 object/file/package slice. |

## Reconciliation Verdict

The data model is sufficient to implement the next stateful workflow slices without broad migration. The immediate engineering risk is writing ad hoc server actions that bypass the safety model. Each new input mask should use a shared mutation wrapper that validates tenant scope, permission, state transition, evidence requirement and audit event before writing domain rows.
