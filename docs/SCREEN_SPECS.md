# Screen Specifications — AlphaVest WealthOS Click-Dummy

## Board 01 — Product Ecosystem Overview (`/presentation` or `/ecosystem` optional)
Purpose: Show four surfaces: Mobile App, Client Web Portal, Consultant Workbench, Compliance/Admin Console.  
Must show: shared services row, internal process flow, advice boundary, workflow badge legend, no-unapproved-advice callout.  
Primary interaction: `Start Click-Dummy` routes to `/mobile`.

## Board 02 — Mobile App Home / Next Step Today (`/mobile`)
Phone UI must show: Good morning Family Steward, Next step today, six action cards.  
Actions: documents missing, decisions awaiting review, insurance review due, advisor-approved recommendation ready, upload document, approve adviser access.  
Click routes: recommendation -> `/decisions`; upload -> `/mobile/upload`; advisor access -> `/governance`.  
Right/background workflow: [AUTO] trigger detected -> [AI-DRAFT] draft -> [ANALYST] data/context reviewed -> [ADVISOR] approved -> [COMPLIANCE] boundary checked -> [CLIENT] displayed.

## Board 03 — Mobile Document Upload Flow (`/mobile/upload`)
Three phone screens/stepper: Upload document -> Extracted information -> Verification pending.  
Document types: Trust deed, Passport, Insurance policy, Portfolio statement, Company register, Tax document, Other.  
Fields: Entity, Jurisdiction, Expiry date, Related asset, Related decision, Confidence score.  
Interaction: select type, confirm, move to verification pending. Toggle conflict/low confidence to show [BLOCKED].

## Board 04 — Client Web Portal Dashboard (`/portal`)
Dashboard modules: Structure completeness 72%, Open Actions 5, Pending Decisions 2, Missing Documents 5, Upcoming Reviews 3, Advisor Messages, Trigger Feed, Evidence Status, Family Governance Status.  
Click Structure completeness -> `/wealth-map?highlight=gaps`.  
Footer disclaimer: informational only, not legal/tax/investment advice.

## Board 05 — Live Global Wealth Map (`/wealth-map`)
Graph nodes: Trust X central, Family Members, Companies, Portfolios, Real Estate, Insurance, Liquidity, Mobility/Residency, Tax Residency, External Advisors, Documents, Decisions.  
Filters: All, Entities, Assets, Documents, Advisors, Jurisdictions, Decisions, Risk & Focus.  
Click Trust X -> detail drawer with Jurisdiction, Linked assets, Trustees, Beneficiaries, Missing documents, Upcoming review, Related decisions.  
Escalation notes: [CALL] clarification; [F2F] governance workshop for conflict.

## Board 06 — Action Board / Next Best Action (`/actions`)
Kanban columns: To Review, Awaiting Documents, Advisor Reviewing, Ready for Decision, Approved, Deferred.  
Cards: Upload updated trust deed; Review insurance cover; Confirm beneficial owner; Approve adviser access; Review liquidity requirement; Evaluate mobility decision point; Read advisor-approved recommendation.  
Each card has priority, due date, related asset/entity, owner, status, human review stage, evidence status.  
Card click -> drawer. Recommendation card -> `/decisions`.

## Board 07 — Signal & Trigger Engine (`/signals`)
Sources: Markets, Currencies, Tax/Regulatory Updates, Portfolio Changes, Insurance Expiry, Document Gaps, Life Events, Mobility Events, Succession Milestones, Advisor Input, Client Input.  
Outputs: Review required, Protection gap, Liquidity action needed, Mobility decision point, Portfolio exposure review, Document missing, Advisor input required, Compliance review required.  
Interaction: source selection highlights output.  
Must show: client-visible vs internal-only boundary and `Triggers are review points, not final advice.`

## Board 08 — Digital Decision Room (`/decisions`)
Modules: Decision title, Summary, Status, Your Decision, Family Approvals, External Specialist Input, Current Situation, Why This Matters, Options, Assumptions, Risks, Documents, Advisor Comments.  
Buttons: Accept, Defer, Reject.  
Interaction: updates visible decision status and adds evidence/audit notice.

## Board 09 — Evidence Vault / Decision Record (`/evidence`)
Sections: Source Documents, Decision Records, Selected Evidence Record, Advisor Sign-off, Client Approval, Review Dates, Audit Trail, Related Entities, Related Actions, Version History.  
Must show evidence lifecycle timeline: Document uploaded -> Advisor reviewed -> Client approved -> Linked to decision -> Next review.  
Interaction: expand audit/event/document drawer.

## Board 10 — Consultant Workbench (`/workbench`)
Internal modules: Client Queue, Data Quality Score, Intake Review, Missing Information, Trigger Review Queue, Draft Recommendations, Advisor Approval Queue, Compliance Checklist, SLA Status, Call Required Queue.  
Trigger detail: Cash flow stress (Rising expenses).  
Publish gate: Advisor Approval, Compliance Check, Evidence Record, Client Permission, Advice Boundary. Publish disabled until all true.

## Board 11 — Advisor Approval Screen (`/advisor-approval`)
Sections: Trigger Summary, Client Objective, Related Wealth Structure, Data Completeness, Documents Reviewed, AI Draft Recommendation, Analyst Notes, Risk View, Alternatives, Suggested Client Wording, Advisor Decision.  
Actions: Approve, Revise, Request More Data, Escalate to Call.  
Approve sets advisor gate done but keeps client visibility blocked until compliance.

## Board 12 — Compliance / Advice Boundary Console (`/compliance`)
Sections: Compliance Queue, Blocked Outputs, Open Reviews, Approved Today, Average Review Time, SLA Compliance, Exception Items, High Risk Items.  
Table columns: ID, Output Title, Classification, Responsible Advisor, Client Context, Disclaimer Status, Evidence Record Status, Publish Permission, Status, Age.  
Classifications: Information, Guidance, Advice-relevant, Advice.  
Interaction: select row, approve release if complete or block if missing evidence/ROA.

## Board 13 — Role-Based Access & Family Governance (`/governance`)
Role permission matrix with roles: Principal, Spouse/Partner, Next Generation, Trustee, Family CFO, External Lawyer, Tax Advisor, Insurance Advisor, AlphaVest Analyst, Senior Advisor, Compliance Officer.  
Controls: invite user, assign role, grant access, time-limited access, approval rights, view-only, revoke access, family council permissions, audit access history.  
Interaction: toggle permission; sensitive permission requires second confirmation and audit event.

## Board 14 — Client Communication & Call Trigger Flow (`/communication`)
Workflow: Client receives action -> completes digitally -> system checks complexity -> analyst reviews -> advisor decides -> publish/request data/schedule call/F2F/external specialist.  
Matrix lanes: Digital-only sufficient, Advisor call required, Face-to-face/workshop required.  
Interaction: select scenario and highlight lane.

## Board 15 — End-to-End Client Journey (`/journey`)
12 stages: Platform Walkthrough, Digital Onboarding, KYC/FICA Intake, Document Upload, Global Wealth Map Draft, Analyst Review, Trigger Feed, Advisor Recommendation, Compliance Check, Client Decision Room, Evidence Record, Review Rhythm.  
Swimlanes: Client-visible, Human/Internal, Governance/Evidence.  
Must show summary: digital-first with human judgment, accountability and provenance at every step.

## Board 16 — MVP Scope vs Future Vision (`/roadmap`)
Groups: MVP Scope, Phase 2, Phase 3/Future Vision.  
MVP: Mobile Home, Client Web Dashboard, Digital Intake, Document Upload, Global Wealth Map, Action Board, Consultant Workbench, Evidence Record, Compliance Console Basic.  
Phase 2: Signal & Trigger Engine, Advisor Approval Workflow, Decision Room, Role-Based Access Advanced, Client Messaging, Call Scheduling.  
Future: Mobile App Advanced, Data Integrations, AI Document Assistant, Advanced Recommendation Drafting, Multi-family Governance Workflows, External Advisor Portal.  
End statement: Build first what makes the platform useful, safe and human-reviewable.
