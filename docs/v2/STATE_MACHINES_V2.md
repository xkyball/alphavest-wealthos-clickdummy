# State Machines v2

## Recommendation

Draft → Needs Review → Advisor Approved → Compliance Pending → Released → Client Visible → Deferred / Rejected / Completed

Blocked transitions:

- Draft → Client Visible
- Needs Review → Client Visible
- Advisor Approved → Client Visible without Compliance Released
- Compliance Pending → Client Visible

## Communication

Draft → Needs Review → Advisor Approved → Compliance Pending → Released → Client Sent → Deferred / Cancelled

Blocked transitions:

- AI draft → Client Sent
- Advisor Approved → Client Sent without Compliance Release
- Compliance Pending → Client Sent

## Evidence Record

Draft / Upload → Under Review → Validated → Linked → Locked → Archived

## Decision Record

Draft → Needs Review → Advisor Approved → Compliance Pending → Finalized → Archived

## Access Request

Requested → Under Review → Approved → Provisioning → Access Granted → Revoked → Closed

## Core rule

No state machine may expose client-visible advice-like output unless advisor approval, compliance release, evidence record and permission checks have passed.
