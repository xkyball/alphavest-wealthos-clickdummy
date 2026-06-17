# Demo Screencast Expansion Recommendation V3

Generated: 2026-06-16

Scope: analysis-only recommendation derived from `DEMO_JOURNEY_UNIVERSE_AUDIT_V3.md`.

## Verdict

Do not create 100 additional screencasts now.

Create a staged portfolio:

1. Keep and refactor the existing `J01-J10` into a 12-part primary narrative.
2. Add 16 trust-proof appendix candidates for compliance, investor and ops due diligence.
3. Keep 18 edge/negative candidates as QA-first micro-journeys and promote only the most valuable 6-8 into video later.
4. Keep exhaustive route/state/permission coverage as JSON, Playwright, visual-contract and QA-report artifacts.

## Why Not 100

| Reason | Explanation |
| --- | --- |
| Narrative dilution | A hundred videos would make the product feel harder to understand. |
| Redundancy | Many possible cases are route/state/role permutations, not distinct demo stories. |
| Proof mismatch | A video is weak proof for exhaustive permission/state coverage; automated matrices are better. |
| Overclaim risk | Recording route hops can make static or generic-audit paths look more complete than they are. |
| Maintenance cost | Every video needs fixtures, captions, run logs, screenshots and regeneration after UI changes. |

## What To Produce Instead

### Wave 1: P0 Primary Narrative

Recommended total: 12 video-worthy units.

| ID | Action | Source |
| --- | --- | --- |
| P0-01 | Retain `J10`, but label as policy frame until J10-specific handlers exist. | Existing J10 |
| P0-02 | Retain `J06` tenant setup/invite. | Existing J06 |
| P0-03 | Add user onboarding, identity, consent and role confirmation. | Missing UF-03 routes |
| P0-04 | Combine profile plus documents in demo script; keep J09/J04 as separate recordings if needed. | Existing J09/J04 |
| P0-05 | Retain `J05` entity/wealth/action. | Existing J05 |
| P0-06 | Split `J01` signal request/routing. | Existing J01 |
| P0-07 | Split `J01` advisor approval without release. | Existing J01 |
| P0-08 | Split `J02` compliance request/block. | Existing J02 |
| P0-09 | Split `J02` compliance release. | Existing J02 |
| P0-10 | Retain `J03`, add evidence vault entry point. | Existing J03 + `/evidence` |
| P0-11 | Retain `J08` export redaction/download. | Existing J08 |
| P0-12 | Retain `J07` governance access/audit. | Existing J07 |

### Wave 2: P1 Trust Proof Pack

Recommended total: 16 appendix candidates.

| Candidate | Video Need |
| --- | --- |
| Evidence vault browse and role-scoped evidence | High |
| Mobile next-step blocked recommendation | High |
| Communication centre path selection | High |
| Call trigger matrix | Medium |
| Ops queues | Medium |
| SLA escalation | Medium |
| Service blueprint | Low, appendix/docs |
| Roadmap/scope | Low, appendix/docs |
| States/badge reference | Low, QA/docs |
| Data-quality readiness proof | Medium |
| File metadata proof | Medium, technical appendix |
| Export package manifest proof | Medium, technical appendix |
| Tenant policy override | Medium |
| Permission matrix second confirmation | High |
| Audit export controlled | Medium |
| Evidence download audited | High |

### Wave 3: P2 Edge / Negative Pack

Recommended total: 18 QA-first micro-journeys.

Only promote to video when the audience needs to see the block visually. Start with Playwright/API proof.

Priority video promotions:

1. Principal cannot release recommendation.
2. Cross-tenant access denied.
3. Unsupported file upload blocked.
4. Low-confidence extraction requires human review.
5. Export without approval blocked.
6. Client defer/reject alternatives.
7. External advisor export denied.
8. Access request denied/revoked.

## Required Data And Fixture Work Before Expansion

| Area | Required Work |
| --- | --- |
| Onboarding | Add fixture records/refs for identity, consent, role confirmation and safe no-real-auth disclosure. |
| Mobile | Add blocked recommendation and next-step today state to the journey contract. |
| Evidence vault | Add list/search/filter fixture plus view/download audit action IDs. |
| Communication | Add MessageThread, Message and CallEvent fixture contracts if claiming workflow execution. |
| Ops | Add QueueItem/SLA breach fixture contracts for ops appendix. |
| J10 | Add dedicated `j10.*` API action handlers before claiming policy/security persistence. |
| Negative pack | Add specific action IDs where possible; do not rely on generic audit fallback for domain claims. |

## Recommended Number

| Layer | New / Retained | Count | Video? |
| --- | ---: | ---: | --- |
| Existing retained/refactored core | retained | 10 | Yes, but split/relabel some |
| P0 additions/splits | net new/split | 2-5 | Yes |
| P1 trust proof | new | 16 | Mostly yes or appendix |
| P2 edge/negative | new | 18 | QA-first; selective video |
| P3 exhaustive coverage | generated | 5 artifact families | No |

Practical target: about 28 polished video definitions for the next serious demo library, plus QA-first P2/P3 proof. Do not attempt 100 videos until the system has production-like auth, object storage, full UI persistence and a training/use-case library requirement.

## Final Recommendation

The right next prompt is not "record 100." It is:

```text
Take DEMO_JOURNEY_OPPORTUNITY_BACKLOG_V3.json and promote P0 plus selected P1 candidates into a new expanded screencast manifest. Add fixture contracts first. Do not add a candidate to video unless it has a route path, role/tenant state, data refs, current reality label, proof path and overclaim caveat.
```
