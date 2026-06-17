# Workflow Definitions V3

The application must support these workflows as product logic, not just visual screens.

## W-01 Platform Setup
Platform settings, policies, roles, security defaults, evidence templates and export templates.

Pages: 007–012.

## W-02 Tenant Setup
Tenant creation, setup checklist, team assignment, tenant policy profile and tenant users.

Pages: 013–018.

## W-03 User Onboarding
Login, MFA, invitation, identity setup, consent and role confirmation.

Pages: 001–006.

## W-04 Client Profile and Family Context
Client profile, family members and relationship map.

Pages: 019, 021–023.

## W-05 Entity and Wealth Structure
Entities, entity wizard, entity detail, wealth map, action board.

Pages: 024–026, 031–032.

## W-06 Document Intake
Documents list, document upload, extraction review and verification pending.

Pages: 027–030.

## W-07 Signal and Analyst Review
Signal queue, trigger detail, consultant workbench.

Pages: 033–035.

## W-08 Advisor Approval
Advisor queue and advisor detail. Advisor approval does not create client visibility.

Pages: 036–037.

## W-09 Compliance Release / Block
Compliance queue, review detail, release modal, block/request evidence, audit/exception log.

Pages: 038–042.

## W-10 Client Decisions
Decision list, decision room, submitted decision success.

Pages: 043–045.

## W-11 Evidence and Export
Evidence vault, evidence record, access audit, export wizard, redaction, preview, download/share.

Pages: 046–047, 051, 054–058.

## W-12 Governance and Access
Governance users, role management, access requests.

Pages: 048–050.

## W-13 Communication and Escalation
Communication centre and call trigger matrix.

Pages: 052–053.

## W-14 Operations and Reference
Ops queues, SLA dashboard, service blueprint, roadmap, state/badge reference.

Pages: 059–063.

## No-unapproved-advice gate

The gate must be represented by a central function and used by UI and tests:

```ts
canBecomeClientVisible(recommendationOrDecision) =>
  advisorApprovalComplete &&
  complianceReleased &&
  evidenceRecordComplete &&
  permissionValid
```

Blocked states must be visible on pages 020, 032, 037, 038, 039, 040, 041, 044 and all relevant export/evidence pages.
