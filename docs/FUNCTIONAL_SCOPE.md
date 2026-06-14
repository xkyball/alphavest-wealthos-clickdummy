# Functional Scope — AlphaVest WealthOS Click-Dummy

## Prototype Goal
Create a browser-based product prototype that can be presented live. It should feel partly functional, but use mock data only.

## Minimum Functional Click Flows

1. Start demo from `/presentation`.
2. Mobile home action cards route to relevant surfaces.
3. Upload flow progresses through three states.
4. Portal metric card routes to Wealth Map with highlighted gaps.
5. Wealth Map entity click opens detail drawer.
6. Action Board cards open details and route to Decision Room.
7. Signal Engine source selection highlights related outputs.
8. Decision Room accept/defer/reject updates state.
9. Evidence Vault expands record/audit/document rows.
10. Workbench trigger opens detail panel.
11. Workbench Publish button disabled until all checklist gates complete.
12. Advisor Approval approve/revise/request-data/escalate updates gate state.
13. Compliance Console approve/block updates release status.
14. Governance permission toggle creates audit event; sensitive toggle requires confirmation.
15. Communication board scenario selection highlights Digital/Call/F2F lane.
16. Journey and Roadmap are navigable and visually complete.

## Required Data Objects

- Family
- User
- Role
- Permission
- Entity
- Asset
- Document
- Trigger
- ActionItem
- Recommendation
- Decision
- EvidenceRecord
- Approval
- AuditEvent
- ReviewSchedule
- Message

## Suggested State Types

- Action status: To Review, Awaiting Documents, Advisor Reviewing, Ready for Decision, Approved, Deferred.
- Recommendation status: AI Draft, Analyst Reviewed, Advisor Approved, Compliance Approved, Client Visible, Blocked.
- Decision status: Proposed, Under Review, Awaiting Family, Approved, Deferred, Rejected, Recorded.
- Evidence status: Missing, Partial, Complete, N/A, Active, Archived.
- Compliance status: Open, Review, Blocked, Approved, Released.
- Permission status: Full Access, Edit/Manage, View Only, Limited, Restricted, Second Confirmation Required.

## Demo Implementation Strategy

Use static mock arrays and lightweight React state first. Prisma/Postgres may be used for seeding, but do not let database complexity block the demo.

If Prisma/Postgres is too heavy for the first pass, build the UI with static `lib/demo-data.ts`, then add Prisma in a second pass. Document tradeoffs.
