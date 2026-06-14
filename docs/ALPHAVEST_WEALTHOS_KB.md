# AlphaVest WealthOS Knowledgebase

## 1. Product Identity

Product name: **AlphaVest Digital Wealth Assurance Platform**  
Product vision name: **AlphaVest WealthOS**  
Tagline: **A human-backed digital operating system for global family wealth.**  
Core promise: **Digital first. Human reviewed. Evidence backed.**  
Primary user-facing promise: **Your global family wealth, visible and decision-ready.**

This is a digital family-office operating system. It is not a conventional advisory brochure, not a trading platform, not a robo-advisor, and not a dashboard-only wealth reporting product.

The product must feel like a secure digital command center where high-net-worth families can:

- see their global wealth structure,
- upload and manage documents,
- understand missing information,
- see next best actions,
- review advisor-approved recommendations,
- approve, defer or reject decisions,
- manage family permissions,
- see which humans reviewed what,
- preserve evidence and audit trails.

## 2. Strategic Concept

AlphaVest WealthOS translates the former consulting/family-office concept into a **platform-first, human-backed product**.

The platform does:

- digital intake,
- wealth structure mapping,
- document vaulting,
- signal and trigger detection,
- action orchestration,
- decision room workflow,
- evidence record creation,
- governance and permissions,
- client communication and call-triggering.

Humans do:

- analyst review,
- wealth advisor judgement,
- compliance check,
- external legal/tax/specialist coordination,
- conflict handling,
- final recommendation approval,
- sensitive client calls or workshops.

Important distinction:

- **Signals and triggers are review points.**
- **Recommendations are not client-visible until advisor-approved and compliance-cleared.**
- **No unapproved advice reaches the client.**

## 3. Key Product Architecture

The platform has four major application surfaces:

1. **Mobile App** — daily family experience: next steps, uploads, approvals, alerts.
2. **Client Web Portal** — deeper client view: dashboard, wealth map, decisions, documents, governance.
3. **Consultant Workbench** — AlphaVest internal work: review triggers, draft recommendations, manage evidence and client tasks.
4. **Compliance / Admin Console** — advice boundary, KYC/FICA, POPIA/privacy, role access, approval gates, audit trail.

Cross-cutting services:

- Family Profile
- Global Wealth Map
- Document Vault
- Action Board
- Signal & Trigger Engine
- Digital Decision Room
- Evidence Vault
- Advisor Approval
- Compliance Gate
- Audit Trail
- Role-Based Access
- Family Governance Permissions
- Review Rhythm

## 4. Visual Design System

Use a premium AlphaVest WealthOS wireframe style.

### Palette

- Background: deep navy, midnight blue, charcoal, near-black blue.
- Primary text: warm ivory.
- Accent text and outlines: champagne gold / muted gold.
- Status accents: green/success, amber/warning, red/danger, blue/info, purple/AI-draft/review.

### Layout Language

- 16:9 presentation-ready boards.
- Dense but structured enterprise dashboard wireframes.
- Thin champagne-gold borders.
- Rounded rectangles.
- Dark glass panels.
- Small icon + label patterns.
- Large serif-like board titles.
- Small top-left `AlphaVest WealthOS — Wireframe System` brand line.
- Board number in top-right.
- Subtle dotted world map / global node motif in top-right.
- Right-side annotation panels for role/action/reaction/outcome.
- Bottom workflow and legend strips.
- Explicit workflow badges.

### What Not To Do

Do not use a generic SaaS dashboard theme.  
Do not use bright fintech gradients.  
Do not use trading charts as the dominant visual.  
Do not use crypto, gold bars, yachts, sports cars, watches or luxury clichés.  
Do not use real client data.  
Do not implement autonomous advice.

## 5. Workflow Badges

Use these badges consistently:

- `[AUTO]` system process
- `[AI-DRAFT]` AI draft, not final advice
- `[ANALYST]` analyst review
- `[ADVISOR]` advisor approval
- `[COMPLIANCE]` compliance review
- `[CLIENT]` client-visible or client action
- `[CALL]` advisor call required
- `[F2F]` face-to-face / workshop required
- `[EVIDENCE]` evidence recorded
- `[BLOCKED]` blocked / escalated
- `[REVIEW]` review rhythm / follow-up

## 6. Core State Machine

A recommendation must pass through:

1. Trigger created: `[AUTO]`
2. Draft recommendation: `[AI-DRAFT]`
3. Analyst review: `[ANALYST]`
4. Advisor approval: `[ADVISOR]`
5. Compliance review: `[COMPLIANCE]`
6. Client visibility: `[CLIENT]`
7. Decision/evidence record: `[EVIDENCE]`
8. Review rhythm scheduled: `[REVIEW]`

If any required gate is missing, show `[BLOCKED]` and keep client visibility disabled.

## 7. Core Routes

Implement these routes exactly:

- `/` redirects to `/presentation`
- `/presentation`
- `/mobile`
- `/mobile/upload`
- `/portal`
- `/wealth-map`
- `/actions`
- `/signals`
- `/decisions`
- `/evidence`
- `/workbench`
- `/advisor-approval`
- `/compliance`
- `/governance`
- `/communication`
- `/journey`
- `/roadmap`

## 8. Demo Roles

Client-side roles:

- Principal / Family Steward
- Spouse / Partner
- Next Generation
- Trustee
- Family CFO
- External Lawyer
- Tax Advisor
- Insurance Advisor

AlphaVest roles:

- AlphaVest Analyst
- Senior Wealth Advisor
- Principal Advisor
- Compliance Officer
- Client Success
- Mobility / Residency Specialist
- Portfolio Governance Specialist
- Insurance Specialist
- External Tax Counsel
- Legal Advisor

## 9. Seed Family

Use a fictional family. Suggested:

- Family: Steward Family
- Principal: Alex Steward
- Family Steward user: Emily Steward
- Next Gen: Next Gen 1
- Trust: Trust X / Dynasty 360 Trust / Greenridge Family Trust
- Example jurisdictions: South Africa, Mauritius, UAE, UK, USA, Singapore, Switzerland, British Virgin Islands
- Example assets: Global Portfolio, Real Estate, Life Insurance, Liquidity Account, Private Equity Fund
- Example advisor: Emily Steward / Senior Wealth Advisor or Principal Advisor
- Example analyst: Jane Analyst
- Example compliance officer: L. van der Merwe
- Example specialist: Marcus Allen / Real Estate Specialist, Mark Advisor, Sarah Chen

All data is fictional.

## 10. Required Demo Messages

Use these exact or near-exact messages:

- `No unapproved advice reaches the client.`
- `Triggers are review points, not final advice.`
- `Visibility score is not advice. It identifies missing information and review needs.`
- `Client visibility remains blocked until compliance review is complete.`
- `Evidence replaces assumption.`
- `Meeting only when judgment, trust or conflict requires it.`
- `Build first what makes the platform useful, safe and human-reviewable.`

## 11. Required Core Interactions

Implement at least these interactions:

1. `/presentation`: Start Click-Dummy routes to `/mobile`.
2. `/mobile`: click `Advisor-approved recommendation ready` opens recommendation preview or routes to `/decisions`.
3. `/mobile`: click `Upload document` routes to `/mobile/upload`.
4. `/mobile/upload`: `Confirm & continue` moves upload to verification pending.
5. `/portal`: click `Structure completeness: 72%` routes to `/wealth-map?highlight=gaps`.
6. `/wealth-map`: click `Trust X` opens detail drawer.
7. `/actions`: click `Read advisor-approved recommendation` routes to `/decisions`.
8. `/signals`: click a signal source highlights related trigger outputs.
9. `/decisions`: `Accept`, `Defer`, `Reject` update visible state and audit/evidence note.
10. `/evidence`: click document or audit row opens detail drawer/expanded state.
11. `/workbench`: publish button stays disabled until checklist items are complete; then enables in demo mode.
12. `/advisor-approval`: Approve sets next gate to Compliance, not Client.
13. `/compliance`: approve or block selected output; blocked state visible.
14. `/governance`: sensitive permission toggle requires second confirmation and creates audit log row.
15. `/communication`: selecting a scenario routes it into Digital / Call / F2F lane.
16. `/journey`: all 12 journey stages visible.
17. `/roadmap`: MVP / Phase 2 / Future Vision visible.

## 12. Functional Scope Boundary

Do not implement:

- real banking integrations,
- real financial data aggregation,
- real KYC/FICA checks,
- real POPIA compliance automation,
- real legal/tax/insurance/citizenship advice,
- real AI advice,
- real e-signatures,
- real document encryption beyond demo placeholders,
- real authentication beyond mocked role switching.

Do implement:

- believable states,
- mock tables,
- mock workflows,
- local demo interactions,
- route navigation,
- seeded data,
- clear role boundaries,
- clear compliance gates,
- presentable styling.
