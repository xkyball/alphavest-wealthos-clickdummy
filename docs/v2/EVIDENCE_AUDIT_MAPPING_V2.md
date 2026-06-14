# Evidence / Audit Mapping v2

## Principle

Evidence replaces assumption.

Every material action must create or link evidence and emit an audit event.

## Mapping examples

| Product action | Actor | Evidence object | Audit event | Visibility | Review needed |
|---|---|---|---|---|---|
| Document Uploaded | Advisor / Analyst | Document File | document.uploaded | Client/Internal by policy | No |
| Extraction Confirmed | System / Analyst | Extraction Record | extraction.confirmed | Internal-only | Spot review |
| Analyst Note Added | Analyst | Analyst Note | note.added | Internal-only | No |
| Recommendation Drafted | Analyst / Advisor | Recommendation Draft | recommendation.drafted | Internal-only | Peer/Advisor review |
| Advisor Approved | Advisor | Approval Record | advice.approved | Internal-only | No |
| Compliance Released | Compliance User | Compliance Release Record | compliance.released | Internal-only | No |
| Client Viewed | Client | View Event | client.viewed | Client/Internal | No |
| Decision Submitted | Client | Decision Record | decision.submitted | Client/Internal | Compliance if applicable |
| Communication Sent | System/User | Communication Record | communication.sent | Client/Internal by policy | No |
| Access Changed | Admin/System | Access Change Record | access.changed | Internal-only | No |
| Call Scheduled | Advisor/Support | Call Schedule | call.scheduled | Client/Internal participants | No |
| Call Completed | Advisor/System | Call Outcome | call.completed | Client/Internal participants | Spot review |

## Immutable audit attributes

- UTC timestamp
- Actor ID
- Actor role
- Source IP / device
- Action name
- Object type
- Object ID
- Correlation / session ID
- Result
- Evidence link
- Digital seal / checksum where applicable
