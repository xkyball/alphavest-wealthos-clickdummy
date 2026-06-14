# Client Experience State Coverage v2

Date: 2026-06-14

## Route State Coverage

| Route | Default | Loading | Empty | Error | Blocked / restricted | Success / submitted |
|---|---:|---:|---:|---:|---:|---:|
| `/mobile` | Yes | Not data-loaded | Yes | Not data-loaded | Yes: recommendation blocked | Yes: decision notification entry |
| `/mobile/upload` | Yes: select type | Not data-loaded | n/a | Yes: retry | Yes: low confidence | Yes: verification pending |
| `/portal` | Yes | Yes | Not separate | Yes | Yes: permission blocked | n/a |
| `/wealth-map` | Yes | Not data-loaded | n/a | Not data-loaded | Yes: restricted node | Yes: Trust X drawer / escalation notice |
| `/actions` | Yes | Not data-loaded | Empty columns implied | n/a | Yes: missing evidence action | Detail drawer |
| `/decisions` | Yes: ready to decide | Not data-loaded | n/a | n/a | Yes: missing permission / release gate | Yes: evidence created |
| `/evidence` | Yes | Not data-loaded | Filter can produce empty list later | n/a | Yes: restricted record | Yes: preview drawer / missing escalation |

## Gate Coverage

| Gate | Covered in |
|---|---|
| Advisor approval alone is insufficient | `/mobile`, `/decisions`, model tests |
| Compliance release required | `/mobile`, `/decisions`, model tests |
| Evidence record required | `/mobile`, `/portal`, `/actions`, `/decisions`, `/evidence` |
| Permission check required | `/wealth-map`, `/decisions`, `/evidence` |
| Low confidence blocks upload | `/mobile/upload` |
| Missing evidence blocks action progress | `/actions` |
| Restricted evidence hides content | `/evidence` |
| Sensitive graph node hides content | `/wealth-map` |

## Evidence / Audit Coverage

| Product action | Evidence / audit representation |
|---|---|
| Document uploaded | `evidence://document-file/evidence-trust-deed` and `document.uploaded` audit row |
| Extraction confirmed | `[AI-DRAFT]` state and analyst review route before validation |
| Sensitive node viewed | Wealth-map drawer shows `client.viewed sensitive node` audit reference |
| Decision submitted | `decision.submitted` audit event and `evidence://decision-record/trust-x-*` link |
| Evidence preview opened | Evidence drawer shows audit trail preview |
| Missing evidence | Evidence vault escalation and action board blocked state |

## Known State Gaps

- Loading and error are implemented explicitly on `/portal`; other click-dummy routes are static mock surfaces and do not fetch data.
- Empty evidence filter state is not a separate visual yet.
- Server-side policy enforcement is still future work; current Phase 5 uses central helpers and visible blocked states.
