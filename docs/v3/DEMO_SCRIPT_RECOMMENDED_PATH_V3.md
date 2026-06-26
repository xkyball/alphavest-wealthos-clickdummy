# AlphaVest WealthOS V3 Recommended Demo Script

Generated: 2026-06-16  
Scope: presenter script and route plan only.

## One-Sentence Opening

AlphaVest WealthOS demonstrates how complex family-office work becomes safe client action: data and documents create context, signals move through human review, compliance controls release, and every important decision is backed by evidence, export controls and audit.

## Recommended Primary Path

Use this order for the main demo:

1. `J10` short policy frame.
2. `J09` client/family context.
3. `J04` document evidence input.
4. `J01` signal to advisor review without client visibility.
5. `J02` compliance release or block.
6. `J03` client decision and evidence package.
7. `J08` export with scope/redaction/approval/download.
8. `J07` governance access and audit appendix.

This order tells the cleanest story: setup rules -> client context -> evidence -> internal review -> compliance release -> client decision -> portable proof -> governance.

## 5-Minute Live Script

| Time | Scene | Route(s) | Talk track | Proof / caveat |
| ---: | --- | --- | --- | --- |
| 0:00 | Thesis | `/admin/policies/advice-boundary` | "This is not a dashboard-first demo. The product rule is: no unapproved advice reaches the client." | J10 is framing, not the strongest mutation proof. |
| 0:45 | Internal signal | `/signals` -> `/advisor-approval/demo` | "An analyst and advisor can work the signal without leaking advice." | Advisor approval is not release. |
| 1:45 | Compliance gate | `/compliance/demo/review` -> `/compliance/demo/release?state=release` | "Compliance release is the visibility gate." | J02 has persisted demo evidence/audit proof. |
| 3:00 | Client decision | `/decisions/demo?state=approval` -> `/evidence/demo` | "The client decides only after release, and the decision has an evidence package." | No final financial/legal/tax advice. |
| 4:15 | Export proof | `/export/demo/preview?state=approval` -> `/export/demo/download?state=confirm` | "The evidence can be exported only with scope, redaction, approval and audit." | Metadata-only package, no binary file yet. |

## 15-Minute Script

| Scene | Route(s) | Presenter note |
| --- | --- | --- |
| Policy frame | `/admin/policies/advice-boundary`, `/admin/roles?state=permission` | Spend one minute on guardrails, then move on. |
| Client context | `/portal`, `/client/profile`, `/relationships` | Show that client context is reviewable data, not automated advice. |
| Document evidence | `/documents/upload`, `/documents/extraction-review`, `/documents/verification-pending` | Show metadata/extraction/human review boundary. |
| Signal and advisor | `/signals`, `/workbench/triggers/demo`, `/advisor-approval/demo` | Make "advisor approval is not release" explicit. |
| Compliance | `/compliance/demo/review`, `/compliance/demo/block?state=block`, `/compliance/demo/release?state=release` | Show block first, release second. |
| Client decision | `/decisions/demo?state=approval`, `/decisions/demo/success`, `/evidence/demo` | Show accept/defer/reject/request-info options if time allows. |
| Export | `/export/demo/scope`, `/export/demo/redaction`, `/export/demo/preview?state=approval`, `/export/demo/download?state=confirm` | Close with controlled portability. |

## 30-Minute Deep Script

| Module | Routes | Why it exists |
| --- | --- | --- |
| Platform and tenant setup | J10, J06 | Explains policy, roles, team assignment and onboarding. |
| Client and source context | J09, J04, J05 | Shows profile, family, document, entity and blocked action context. |
| Trust chain | J01, J02, J03 | Proves human review, compliance release and client action. |
| Governance and export | J07, J08 | Proves scoped access, second confirmation, redaction, expiry and audit. |
| Ops appendix | `/ops/queues`, `/ops/sla`, `/service-blueprint` | Use only for internal/ops audiences. |

## Safe Phrases

- "This is a demo-scoped transaction with audit/evidence proof."
- "Advisor approval is necessary, but compliance release controls client visibility."
- "The export is metadata-backed in this prototype; binary generation and object storage are explicit next steps."
- "The role/tenant model is deterministic demo authorization, not production identity."
- "This is not final financial, legal or tax advice."

## Phrases To Avoid

- "Production-compliant release engine."
- "The client receives advice immediately after advisor approval."
- "This export is a real signed package."
- "All 63 routes are full workflows."
- "Seed data proves the user action."
- "Real authentication is implemented."

## Best Closing

"The demo is strongest because it does not ask the audience to trust a pretty recommendation screen. It shows the chain of custody: who saw the data, who reviewed it, who released it, what the client decided, and what evidence can be exported afterward."

## Verification Back Pocket

Use these when someone asks "how do you know?":

- `docs/v3/IMPLEMENTATION_QA_REPORT.md` Phase 14 addenda for J02-J09 transaction proof.
- `docs/v3/SCREENCAST_QA_REPORT_V3.md` for final J01-J10 captioned screencast proof.
- `tests/recommendation-review-workflow-api.spec.ts` for API mutation regression.
- `tests/permission-engine.spec.ts` for role-aware demo denials.
- `tests/file-export-realism.spec.ts` for metadata-only file/export validation.
- `docs/v3/FINAL_HANDOFF_REPORT.md` for intentional boundaries.
