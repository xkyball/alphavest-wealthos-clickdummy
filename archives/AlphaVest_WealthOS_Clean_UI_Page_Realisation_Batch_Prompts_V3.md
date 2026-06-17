# AlphaVest WealthOS — Clean UI Page Realisation Batch Prompts V3

Date: 2026-06-14

## Purpose

This file contains copy-paste-ready prompts for generating **clean AlphaVest UI page designs** in batches of up to 10 pages. The current V3 page specification contains **63 routes/pages**, so this requires **7 batch prompts**.

These prompts are intended for this chat's image generation workflow. They are not Codex implementation prompts. They create visual UI designs that can later become reference material for Codex.

## Critical correction

The generated images must contain **only the actual UI design**.

Do **not** render:

- spec rails,
- route metadata panels,
- file names,
- dev handoff notes,
- annotation legends,
- callout numbers,
- acceptance-criteria boxes,
- explanatory sidebars,
- workflow documentation outside the app UI,
- artificial labels like “Source Board” or “Image ID” inside the canvas.

All those details are included in the prompt only to guide the design. They must **not** appear as extra visual documentation in the image.

## AlphaVest design lock

All pages must use one consistent AlphaVest design system:

- deep navy / midnight / charcoal base,
- ivory typography,
- champagne-gold accents, outlines and active states,
- premium but practical enterprise web-app aesthetic,
- clean grid, consistent spacing, consistent radius and line weight,
- left navigation for desktop app pages,
- mobile app shell for mobile pages,
- card/table/form/drawer/modal components,
- clear hierarchy,
- accessible contrast,
- no glossy marketing treatment,
- no photorealistic device render,
- no generic fintech dashboard,
- no product poster.

## Modal / overlay rule

If a page is a modal, drawer, bottom sheet or overlay state:

- mark this in the prompt using the visual mode,
- render modals as true centered overlays with the underlying AlphaVest page dimmed or blurred,
- render drawers attached to the right or left edge with the parent page still visible,
- render bottom sheets only for mobile flows,
- do not turn modals/drawers into separate explanatory posters,
- the image should still contain only the UI, not specification annotations.

## Hard product rule for UI copy

Where advice, recommendations, approval or release are involved, the UI may contain concise product copy such as:

> No unapproved advice reaches the client.

But do not render long explanations around it. Use concise UI banners, state chips or disabled-button explanations only.

---

# Page Index

| Page | Route | Purpose | Visual mode | Suggested filename |
|---:|---|---|---|---|
| 001 | `/login` | Authentication login | NORMAL_PAGE | `PAGE-001-login.png` |
| 002 | `/mfa` | Multi-factor authentication | MODAL_CAPABLE_AUTH_PAGE | `PAGE-002-mfa.png` |
| 003 | `/onboarding/invite` | Invitation acceptance | WIZARD_OR_STEP_PAGE | `PAGE-003-onboarding-invite.png` |
| 004 | `/onboarding/identity` | Identity setup | WIZARD_OR_STEP_PAGE | `PAGE-004-onboarding-identity.png` |
| 005 | `/onboarding/consent` | Consent and privacy acknowledgement | PAGE_WITH_POLICY_MODAL_AVAILABLE | `PAGE-005-onboarding-consent.png` |
| 006 | `/onboarding/role-confirmation` | Role confirmation | WIZARD_OR_STEP_PAGE | `PAGE-006-onboarding-role-confirmation.png` |
| 007 | `/admin/platform` | Platform settings | PAGE_WITH_SECOND_CONFIRMATION_MODAL | `PAGE-007-admin-platform.png` |
| 008 | `/admin/policies/advice-boundary` | Advice boundary policy | NORMAL_PAGE | `PAGE-008-admin-policies-advice-boundary.png` |
| 009 | `/admin/roles` | Global role templates | PAGE_WITH_PERMISSION_MODAL | `PAGE-009-admin-roles.png` |
| 010 | `/admin/security` | Security configuration | PAGE_WITH_SECOND_CONFIRMATION_MODAL | `PAGE-010-admin-security.png` |
| 011 | `/admin/evidence-templates` | Evidence templates | NORMAL_PAGE | `PAGE-011-admin-evidence-templates.png` |
| 012 | `/admin/export-templates` | Export templates and redaction | NORMAL_PAGE | `PAGE-012-admin-export-templates.png` |
| 013 | `/admin/tenants` | Tenant list | NORMAL_PAGE | `PAGE-013-admin-tenants.png` |
| 014 | `/tenants/new` | Create client tenant | WIZARD_OR_STEP_PAGE | `PAGE-014-tenants-new.png` |
| 015 | `/tenants/:id/setup` | Tenant setup dashboard | WIZARD_OR_STEP_PAGE | `PAGE-015-tenants-id-setup.png` |
| 016 | `/tenants/:id/team` | Assign AlphaVest team | NORMAL_PAGE | `PAGE-016-tenants-id-team.png` |
| 017 | `/tenants/:id/policies` | Tenant policies | NORMAL_PAGE | `PAGE-017-tenants-id-policies.png` |
| 018 | `/tenants/:id/users` | Tenant users | PAGE_WITH_INVITE_ROLE_MODAL | `PAGE-018-tenants-id-users.png` |
| 019 | `/portal` | Client web dashboard | NORMAL_PAGE | `PAGE-019-portal.png` |
| 020 | `/mobile` | Mobile home / next step today | NORMAL_PAGE | `PAGE-020-mobile.png` |
| 021 | `/client/profile` | Client profile | NORMAL_PAGE | `PAGE-021-client-profile.png` |
| 022 | `/client/family-members` | Family members | NORMAL_PAGE | `PAGE-022-client-family-members.png` |
| 023 | `/relationships` | Relationship map | NORMAL_PAGE | `PAGE-023-relationships.png` |
| 024 | `/entities` | Entity list | NORMAL_PAGE | `PAGE-024-entities.png` |
| 025 | `/entities/new` | Create entity | WIZARD_OR_STEP_PAGE | `PAGE-025-entities-new.png` |
| 026 | `/entities/:id` | Entity detail | NORMAL_PAGE | `PAGE-026-entities-id.png` |
| 027 | `/documents` | Documents list | NORMAL_PAGE | `PAGE-027-documents.png` |
| 028 | `/documents/upload` | Document upload | NORMAL_PAGE | `PAGE-028-documents-upload.png` |
| 029 | `/documents/extraction-review` | Extraction review | NORMAL_PAGE | `PAGE-029-documents-extraction-review.png` |
| 030 | `/documents/verification-pending` | Verification pending | NORMAL_PAGE | `PAGE-030-documents-verification-pending.png` |
| 031 | `/wealth-map` | Live wealth map | PAGE_WITH_SIDE_DRAWER | `PAGE-031-wealth-map.png` |
| 032 | `/actions` | Action board | PAGE_WITH_SIDE_DRAWER | `PAGE-032-actions.png` |
| 033 | `/signals` | Signal / trigger review | NORMAL_PAGE | `PAGE-033-signals.png` |
| 034 | `/workbench` | Consultant workbench | NORMAL_PAGE | `PAGE-034-workbench.png` |
| 035 | `/workbench/triggers/:id` | Trigger detail / analyst notes | NORMAL_PAGE | `PAGE-035-workbench-triggers-id.png` |
| 036 | `/advisor-approval` | Advisor approval queue | NORMAL_PAGE | `PAGE-036-advisor-approval.png` |
| 037 | `/advisor-approval/:id` | Advisor approval detail | NORMAL_PAGE | `PAGE-037-advisor-approval-id.png` |
| 038 | `/compliance` | Compliance queue | NORMAL_PAGE | `PAGE-038-compliance.png` |
| 039 | `/compliance/:id/review` | Compliance review detail | NORMAL_PAGE | `PAGE-039-compliance-id-review.png` |
| 040 | `/compliance/:id/release` | Release to client | RELEASE_CONFIRMATION_MODAL_STATE | `PAGE-040-compliance-id-release.png` |
| 041 | `/compliance/:id/block` | Block / request evidence | BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE | `PAGE-041-compliance-id-block.png` |
| 042 | `/compliance/:id/audit` | Audit / exception log | NORMAL_PAGE | `PAGE-042-compliance-id-audit.png` |
| 043 | `/decisions` | Decision list | NORMAL_PAGE | `PAGE-043-decisions.png` |
| 044 | `/decisions/:id` | Digital decision room | PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION | `PAGE-044-decisions-id.png` |
| 045 | `/decisions/:id/success` | Decision submitted | NORMAL_PAGE | `PAGE-045-decisions-id-success.png` |
| 046 | `/evidence` | Evidence vault | PAGE_WITH_SIDE_DRAWER | `PAGE-046-evidence.png` |
| 047 | `/evidence/:id` | Evidence record detail | NORMAL_PAGE | `PAGE-047-evidence-id.png` |
| 048 | `/governance/users` | Governance users | PAGE_WITH_USER_DRAWER_OR_MODAL | `PAGE-048-governance-users.png` |
| 049 | `/governance/roles` | Role management | PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL | `PAGE-049-governance-roles.png` |
| 050 | `/governance/access-requests` | Access requests | PAGE_WITH_APPROVAL_DRAWER | `PAGE-050-governance-access-requests.png` |
| 051 | `/governance/audit-history` | Access audit history | PAGE_WITH_SIDE_DRAWER | `PAGE-051-governance-audit-history.png` |
| 052 | `/communication` | Communication centre | PREVIEW_PAGE_OR_PANEL | `PAGE-052-communication.png` |
| 053 | `/communication/call-trigger` | Call trigger matrix | NORMAL_PAGE | `PAGE-053-communication-call-trigger.png` |
| 054 | `/export/new` | Create export | WIZARD_OR_STEP_PAGE | `PAGE-054-export-new.png` |
| 055 | `/export/:id/scope` | Export scope selection | NORMAL_PAGE | `PAGE-055-export-id-scope.png` |
| 056 | `/export/:id/redaction` | Export redaction | PREVIEW_PAGE_OR_PANEL | `PAGE-056-export-id-redaction.png` |
| 057 | `/export/:id/preview` | Export preview | PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL | `PAGE-057-export-id-preview.png` |
| 058 | `/export/:id/download` | Export download/share | DOWNLOAD_CONFIRMATION_STATE | `PAGE-058-export-id-download.png` |
| 059 | `/ops/queues` | Ops queues | NORMAL_PAGE | `PAGE-059-ops-queues.png` |
| 060 | `/ops/sla` | SLA and escalation | NORMAL_PAGE | `PAGE-060-ops-sla.png` |
| 061 | `/service-blueprint` | Service blueprint | REFERENCE_ONLY_INTERNAL_PAGE | `PAGE-061-service-blueprint.png` |
| 062 | `/roadmap` | MVP vs future scope | REFERENCE_ONLY_INTERNAL_PAGE | `PAGE-062-roadmap.png` |
| 063 | `/states` | State and badge reference | REFERENCE_ONLY_INTERNAL_PAGE | `PAGE-063-states.png` |

# Batch 01 — Pages 001–010

Copy the following prompt into ChatGPT image generation. It should produce separate images for this batch.

```text
Use ENGINE_v3 Standard — All Phases P0 to P12 internally to generate these visuals.

Generate 10 separate 16:9 clean AlphaVest WealthOS UI page designs for the listed pages.

CRITICAL OUTPUT RULES:
- Generate one separate image per page.
- The image must show only the actual UI design.
- Do not include spec panels, route labels, filename labels, annotation rails, callout legends, dev notes or explanatory documentation outside the app UI.
- Use all page details below only as design guidance.
- Maintain one consistent AlphaVest design system across all pages.
- If visual mode is MODAL, OVERLAY, DRAWER or BOTTOM SHEET, render that UI pattern correctly.
- If the page is a reference/internal page, render it as a clean internal AlphaVest application page, not as a poster.
- Do not render a marketing key visual.
- Do not render final content as legal/financial advice.
- All screens must respect: No unapproved advice reaches the client.

GLOBAL DESIGN SYSTEM:
Deep navy / midnight / charcoal background, ivory text, champagne-gold highlights, clean enterprise cards, tables, form controls, left nav, top bar, subtle dividers, premium but usable UI.

PAGES TO GENERATE:

001. Authentication login
    Suggested filename: PAGE-001-login.png
    Route: /login
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: All users
    Data input: Email/SSO; password if not SSO
    Data output: Session challenge or auth error
    Core UI components to design: Login form, SSO button, forgot password, security notice
    Workflow integration: UW-03 user onboarding / every secure entry
    Required states to reflect in the UI: default, loading, error, locked
    Security / compliance controls to reflect through UI behaviour: Rate limit, no tenant data before auth, audit failed/successful login
    Acceptance criterion: User can authenticate without exposing tenant data.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

002. Multi-factor authentication
    Suggested filename: PAGE-002-mfa.png
    Route: /mfa
    Visual mode: MODAL_CAPABLE_AUTH_PAGE
    Overlay/drawer/modal guidance: If showing recovery or locked account, use a modal over a dimmed auth page; otherwise show the main MFA screen.
    Primary roles: All elevated roles; recommended for all users
    Data input: OTP/WebAuthn/push challenge
    Data output: Authenticated session
    Core UI components to design: MFA challenge, recovery link, device label
    Workflow integration: UW-03 user onboarding
    Required states to reflect in the UI: default, loading, error, locked
    Security / compliance controls to reflect through UI behaviour: MFA for staff, principal, trustee, admin; audit attempt
    Acceptance criterion: MFA passes or fails with clear state.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

003. Invitation acceptance
    Suggested filename: PAGE-003-onboarding-invite.png
    Route: /onboarding/invite
    Visual mode: WIZARD_OR_STEP_PAGE
    Overlay/drawer/modal guidance: Render a clean wizard/step page with progress indicator where useful. No external annotations.
    Primary roles: Invited user
    Data input: Invite token, email confirmation
    Data output: User onboarding started
    Core UI components to design: Invite summary, role preview, expiry, accept CTA
    Workflow integration: PF-B / UW-03
    Required states to reflect in the UI: valid, expired, used, error
    Security / compliance controls to reflect through UI behaviour: Token scoped to tenant; no sensitive data pre-auth
    Acceptance criterion: Valid invitation leads to identity setup.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

004. Identity setup
    Suggested filename: PAGE-004-onboarding-identity.png
    Route: /onboarding/identity
    Visual mode: WIZARD_OR_STEP_PAGE
    Overlay/drawer/modal guidance: Render a clean wizard/step page with progress indicator where useful. No external annotations.
    Primary roles: Invited user
    Data input: Name, password/SSO setup, phone optional
    Data output: User record and profile draft
    Core UI components to design: Identity form, validation, privacy note
    Workflow integration: UW-03
    Required states to reflect in the UI: default, invalid, loading, error
    Security / compliance controls to reflect through UI behaviour: Minimise data; store consent separately
    Acceptance criterion: User can create account within assigned tenant.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

005. Consent and privacy acknowledgement
    Suggested filename: PAGE-005-onboarding-consent.png
    Route: /onboarding/consent
    Visual mode: PAGE_WITH_POLICY_MODAL_AVAILABLE
    Overlay/drawer/modal guidance: Main visual should show consent page. If including policy detail, render it as a modal/side drawer over dimmed background, not as a separate annotation panel.
    Primary roles: Invited user
    Data input: Privacy notice acknowledgement, terms, data use consent
    Data output: ConsentRecord
    Core UI components to design: Policy cards, version labels, required checkbox
    Workflow integration: UW-03
    Required states to reflect in the UI: default, accepted, declined
    Security / compliance controls to reflect through UI behaviour: POPIA-related consent/audit record
    Acceptance criterion: User cannot proceed without required acknowledgement.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

006. Role confirmation
    Suggested filename: PAGE-006-onboarding-role-confirmation.png
    Route: /onboarding/role-confirmation
    Visual mode: WIZARD_OR_STEP_PAGE
    Overlay/drawer/modal guidance: Render a clean wizard/step page with progress indicator where useful. No external annotations.
    Primary roles: Invited user
    Data input: Role acknowledgement; scope confirmation
    Data output: UserRole active/pending
    Core UI components to design: Role card, permissions summary, restrictions
    Workflow integration: UW-03
    Required states to reflect in the UI: active, pending review, blocked
    Security / compliance controls to reflect through UI behaviour: Do not expose hidden data; audit confirmation
    Acceptance criterion: User understands role and limitations.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

007. Platform settings
    Suggested filename: PAGE-007-admin-platform.png
    Route: /admin/platform
    Visual mode: PAGE_WITH_SECOND_CONFIRMATION_MODAL
    Overlay/drawer/modal guidance: Show the platform settings page with a critical-change second-confirmation modal overlay if a critical setting is being saved.
    Primary roles: Platform Admin / Ops
    Data input: Platform name, regions, timezone, retention defaults
    Data output: PlatformTenant config
    Core UI components to design: Settings form, region, retention, audit banner
    Workflow integration: PF-A / UW-01
    Required states to reflect in the UI: default, saved, error
    Security / compliance controls to reflect through UI behaviour: Admin-only; second confirmation for critical config
    Acceptance criterion: Platform settings saved and audited.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

008. Advice boundary policy
    Suggested filename: PAGE-008-admin-policies-advice-boundary.png
    Route: /admin/policies/advice-boundary
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Compliance Officer
    Data input: Output classifications, release rules, required evidence
    Data output: PolicyDefinition
    Core UI components to design: Advice matrix, gate rules, versioning
    Workflow integration: UW-01 / UW-09
    Required states to reflect in the UI: draft, active, archived, error
    Security / compliance controls to reflect through UI behaviour: Compliance-only; versioned policy; audit changes
    Acceptance criterion: Advice categories and release gates are configurable.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

009. Global role templates
    Suggested filename: PAGE-009-admin-roles.png
    Route: /admin/roles
    Visual mode: PAGE_WITH_PERMISSION_MODAL
    Overlay/drawer/modal guidance: Show role grid with sensitive permission change modal or confirmation state if appropriate.
    Primary roles: Admin / Compliance
    Data input: Role templates and default permissions
    Data output: Role / Permission / RolePermission
    Core UI components to design: Role list, permission grid, diff view
    Workflow integration: UW-01 / UW-12
    Required states to reflect in the UI: default, edited, pending confirmation, blocked
    Security / compliance controls to reflect through UI behaviour: Separation of duties; second confirmation
    Acceptance criterion: Default roles can be managed safely.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

010. Security configuration
    Suggested filename: PAGE-010-admin-security.png
    Route: /admin/security
    Visual mode: PAGE_WITH_SECOND_CONFIRMATION_MODAL
    Overlay/drawer/modal guidance: Security-critical changes should be represented with a confirmation modal over a dimmed background.
    Primary roles: Security / Privacy Officer
    Data input: MFA rules, session timeout, device controls
    Data output: PolicyDefinition / security config
    Core UI components to design: Security controls, session policy, enforcement status
    Workflow integration: UW-01
    Required states to reflect in the UI: default, saved, blocked
    Security / compliance controls to reflect through UI behaviour: Security-only; strong audit
    Acceptance criterion: Critical auth settings applied.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

END OF BATCH PROMPT.
```

# Batch 02 — Pages 011–020

Copy the following prompt into ChatGPT image generation. It should produce separate images for this batch.

```text
Use ENGINE_v3 Standard — All Phases P0 to P12 internally to generate these visuals.

Generate 10 separate 16:9 clean AlphaVest WealthOS UI page designs for the listed pages.

CRITICAL OUTPUT RULES:
- Generate one separate image per page.
- The image must show only the actual UI design.
- Do not include spec panels, route labels, filename labels, annotation rails, callout legends, dev notes or explanatory documentation outside the app UI.
- Use all page details below only as design guidance.
- Maintain one consistent AlphaVest design system across all pages.
- If visual mode is MODAL, OVERLAY, DRAWER or BOTTOM SHEET, render that UI pattern correctly.
- If the page is a reference/internal page, render it as a clean internal AlphaVest application page, not as a poster.
- Do not render a marketing key visual.
- Do not render final content as legal/financial advice.
- All screens must respect: No unapproved advice reaches the client.

GLOBAL DESIGN SYSTEM:
Deep navy / midnight / charcoal background, ivory text, champagne-gold highlights, clean enterprise cards, tables, form controls, left nav, top bar, subtle dividers, premium but usable UI.

PAGES TO GENERATE:

011. Evidence templates
    Suggested filename: PAGE-011-admin-evidence-templates.png
    Route: /admin/evidence-templates
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Compliance / Ops
    Data input: Evidence types, required evidence, review cycles
    Data output: PolicyDefinition
    Core UI components to design: Template list, required items, retention
    Workflow integration: UW-01 / UW-11
    Required states to reflect in the UI: default, edited, active
    Security / compliance controls to reflect through UI behaviour: Versioned; compliance reviewed
    Acceptance criterion: Evidence requirements can be reused.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

012. Export templates and redaction
    Suggested filename: PAGE-012-admin-export-templates.png
    Route: /admin/export-templates
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Ops / Compliance
    Data input: Export types, redaction profiles, expiry rules
    Data output: PolicyDefinition
    Core UI components to design: Export template cards, redaction matrix
    Workflow integration: UW-10
    Required states to reflect in the UI: draft, active, blocked
    Security / compliance controls to reflect through UI behaviour: Redaction mandatory; audit changes
    Acceptance criterion: Exports have controlled templates.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

013. Tenant list
    Suggested filename: PAGE-013-admin-tenants.png
    Route: /admin/tenants
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: AlphaVest Admin / Ops
    Data input: Search/filter tenant list
    Data output: Tenant selection / status update
    Core UI components to design: Tenant table, status chips, actions
    Workflow integration: PF-B / UW-02
    Required states to reflect in the UI: default, empty, loading, error
    Security / compliance controls to reflect through UI behaviour: Platform admin only; tenant isolation
    Acceptance criterion: Operator can find and manage tenants.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

014. Create client tenant
    Suggested filename: PAGE-014-tenants-new.png
    Route: /tenants/new
    Visual mode: WIZARD_OR_STEP_PAGE
    Overlay/drawer/modal guidance: Render a clean wizard/step page with progress indicator where useful. No external annotations.
    Primary roles: AlphaVest Admin / Ops
    Data input: Family office name, jurisdiction, tier, primary owner
    Data output: ClientTenant draft
    Core UI components to design: Tenant creation wizard
    Workflow integration: PF-B / UW-02
    Required states to reflect in the UI: draft, validating, created, error
    Security / compliance controls to reflect through UI behaviour: No client invitation until team/policy set
    Acceptance criterion: Tenant draft created.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

015. Tenant setup dashboard
    Suggested filename: PAGE-015-tenants-id-setup.png
    Route: /tenants/:id/setup
    Visual mode: WIZARD_OR_STEP_PAGE
    Overlay/drawer/modal guidance: Render a clean wizard/step page with progress indicator where useful. No external annotations.
    Primary roles: Ops / Client Success
    Data input: Setup checklist completion
    Data output: Tenant onboarding status
    Core UI components to design: Checklist, missing items, owners
    Workflow integration: UW-02
    Required states to reflect in the UI: incomplete, ready, blocked
    Security / compliance controls to reflect through UI behaviour: Tenant-scoped access only
    Acceptance criterion: Tenant can be made active only when gates pass.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

016. Assign AlphaVest team
    Suggested filename: PAGE-016-tenants-id-team.png
    Route: /tenants/:id/team
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Ops Admin
    Data input: Advisor, analyst, compliance owner, client success
    Data output: Tenant team assignments
    Core UI components to design: Team selector, workload info
    Workflow integration: UW-02
    Required states to reflect in the UI: default, saved, conflict
    Security / compliance controls to reflect through UI behaviour: Cannot lack compliance owner for pilot
    Acceptance criterion: Team assigned and audited.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

017. Tenant policies
    Suggested filename: PAGE-017-tenants-id-policies.png
    Route: /tenants/:id/policies
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Compliance / Ops
    Data input: Policy profile, evidence, export, privacy settings
    Data output: Tenant policy profile
    Core UI components to design: Policy selection, overrides, version
    Workflow integration: UW-02
    Required states to reflect in the UI: draft, active, blocked
    Security / compliance controls to reflect through UI behaviour: Compliance approval for overrides
    Acceptance criterion: Tenant has active policy profile.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

018. Tenant users
    Suggested filename: PAGE-018-tenants-id-users.png
    Route: /tenants/:id/users
    Visual mode: PAGE_WITH_INVITE_ROLE_MODAL
    Overlay/drawer/modal guidance: User invite or role assignment may appear as right drawer/modal; show as overlay only if selected state is invite/edit.
    Primary roles: Admin / Principal / Client Success
    Data input: Invite users, assign roles, scope
    Data output: User invitations and roles
    Core UI components to design: User table, role assignment, invite status
    Workflow integration: UW-02 / UW-12
    Required states to reflect in the UI: default, invited, pending, revoked
    Security / compliance controls to reflect through UI behaviour: Second confirmation for sensitive roles
    Acceptance criterion: Users are invited with scoped roles.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

019. Client web dashboard
    Suggested filename: PAGE-019-portal.png
    Route: /portal
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Principal / Family CFO / Trustee scoped
    Data input: None usually; filters/view selections
    Data output: Navigation to gaps/actions/decisions
    Core UI components to design: Readiness score, open actions, pending decisions, missing docs, advisor messages, evidence, governance
    Workflow integration: PF-C / UW-04 / UW-05
    Required states to reflect in the UI: default, empty, loading, error, permission_restricted
    Security / compliance controls to reflect through UI behaviour: Client-visible only; no internal notes; score not advice
    Acceptance criterion: User sees current status and next steps.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

020. Mobile home / next step today
    Suggested filename: PAGE-020-mobile.png
    Route: /mobile
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Principal / Family member
    Data input: None usually; selects action
    Data output: Navigation / action open events
    Core UI components to design: Priority actions, quick actions, recommendation status, bottom nav
    Workflow integration: PF-C / PF-D / UW-04
    Required states to reflect in the UI: default, recommendation_blocked, empty, loading, error
    Security / compliance controls to reflect through UI behaviour: Client visibility helper; recommendation blocked if compliance pending
    Acceptance criterion: User can see what requires attention today.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

END OF BATCH PROMPT.
```

# Batch 03 — Pages 021–030

Copy the following prompt into ChatGPT image generation. It should produce separate images for this batch.

```text
Use ENGINE_v3 Standard — All Phases P0 to P12 internally to generate these visuals.

Generate 10 separate 16:9 clean AlphaVest WealthOS UI page designs for the listed pages.

CRITICAL OUTPUT RULES:
- Generate one separate image per page.
- The image must show only the actual UI design.
- Do not include spec panels, route labels, filename labels, annotation rails, callout legends, dev notes or explanatory documentation outside the app UI.
- Use all page details below only as design guidance.
- Maintain one consistent AlphaVest design system across all pages.
- If visual mode is MODAL, OVERLAY, DRAWER or BOTTOM SHEET, render that UI pattern correctly.
- If the page is a reference/internal page, render it as a clean internal AlphaVest application page, not as a poster.
- Do not render a marketing key visual.
- Do not render final content as legal/financial advice.
- All screens must respect: No unapproved advice reaches the client.

GLOBAL DESIGN SYSTEM:
Deep navy / midnight / charcoal background, ivory text, champagne-gold highlights, clean enterprise cards, tables, form controls, left nav, top bar, subtle dividers, premium but usable UI.

PAGES TO GENERATE:

021. Client profile
    Suggested filename: PAGE-021-client-profile.png
    Route: /client/profile
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Principal / Family CFO
    Data input: Family profile, goals, governance preferences
    Data output: ClientObjective / FamilyMember updates
    Core UI components to design: Profile form, governance cards, review summary
    Workflow integration: PF-C / UW-04
    Required states to reflect in the UI: draft, submitted, needs_review, blocked
    Security / compliance controls to reflect through UI behaviour: Sensitive fields scoped; audit edits
    Acceptance criterion: Profile submitted for review.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

022. Family members
    Suggested filename: PAGE-022-client-family-members.png
    Route: /client/family-members
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Principal / Family CFO
    Data input: Person details, relationships, roles
    Data output: FamilyMember / Relationship
    Core UI components to design: Member list, relationship editor
    Workflow integration: PF-C / UW-04
    Required states to reflect in the UI: default, editing, conflict, permission_restricted
    Security / compliance controls to reflect through UI behaviour: Minimise sensitive data; trustee/beneficiary flags
    Acceptance criterion: Family map data captured.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

023. Relationship map
    Suggested filename: PAGE-023-relationships.png
    Route: /relationships
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Principal / Analyst / Advisor
    Data input: Relationship edges; evidence source
    Data output: Relationship records
    Core UI components to design: Graph/table relationship editor
    Workflow integration: PF-C / UW-04
    Required states to reflect in the UI: default, conflict, missing_evidence
    Security / compliance controls to reflect through UI behaviour: Conflicts trigger advisor/legal review
    Acceptance criterion: Relationships can be validated.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

024. Entity list
    Suggested filename: PAGE-024-entities.png
    Route: /entities
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Principal / CFO / Analyst / Advisor
    Data input: Search/filter; create entity
    Data output: Entity selection
    Core UI components to design: Entity cards/table, missing docs, risk
    Workflow integration: PF-C / UW-05
    Required states to reflect in the UI: default, empty, loading, restricted
    Security / compliance controls to reflect through UI behaviour: Entity scope permissions
    Acceptance criterion: User can identify structures and gaps.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

025. Create entity
    Suggested filename: PAGE-025-entities-new.png
    Route: /entities/new
    Visual mode: WIZARD_OR_STEP_PAGE
    Overlay/drawer/modal guidance: Render a clean wizard/step page with progress indicator where useful. No external annotations.
    Primary roles: Principal / CFO / Analyst
    Data input: Entity type, name, jurisdiction, participants
    Data output: Entity draft
    Core UI components to design: Entity creation wizard
    Workflow integration: PF-C / UW-05
    Required states to reflect in the UI: draft, validating, created, blocked
    Security / compliance controls to reflect through UI behaviour: Sensitive jurisdictions may trigger legal review
    Acceptance criterion: Entity created with owner and evidence placeholder.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

026. Entity detail
    Suggested filename: PAGE-026-entities-id.png
    Route: /entities/:id
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Principal / Advisor / scoped roles
    Data input: Edit details if allowed
    Data output: Entity updates / actions
    Core UI components to design: Overview, participants, assets, documents, related decisions
    Workflow integration: UW-05
    Required states to reflect in the UI: default, selected, restricted, missing_docs
    Security / compliance controls to reflect through UI behaviour: Object-level permissions
    Acceptance criterion: Entity status and actions clear.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

027. Documents list
    Suggested filename: PAGE-027-documents.png
    Route: /documents
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Client / Advisor / Analyst scoped
    Data input: Search/filter
    Data output: Document selection
    Core UI components to design: Document table, statuses, sensitivity, evidence links
    Workflow integration: UW-06
    Required states to reflect in the UI: default, empty, loading, restricted
    Security / compliance controls to reflect through UI behaviour: Restrict sensitive docs by permission
    Acceptance criterion: User can find accessible docs.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

028. Document upload
    Suggested filename: PAGE-028-documents-upload.png
    Route: /documents/upload
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Client / CFO / External advisor scoped
    Data input: Document type, file, entity/asset link, notes
    Data output: Document record
    Core UI components to design: Upload source, file selector, type selector
    Workflow integration: PF-D / UW-06
    Required states to reflect in the UI: empty, uploading, error
    Security / compliance controls to reflect through UI behaviour: Upload permission; malware/format checks
    Acceptance criterion: Document uploaded to extraction pipeline.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

029. Extraction review
    Suggested filename: PAGE-029-documents-extraction-review.png
    Route: /documents/extraction-review
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Client / CFO initially; Analyst later
    Data input: Confirm/edit extracted fields
    Data output: DocumentExtraction confirmed
    Core UI components to design: Extracted fields, confidence, edit, confirm
    Workflow integration: PF-D / UW-06
    Required states to reflect in the UI: extraction_review, low_confidence_blocked, error
    Security / compliance controls to reflect through UI behaviour: AI draft label; not final evidence
    Acceptance criterion: Client understands extraction is draft.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

030. Verification pending
    Suggested filename: PAGE-030-documents-verification-pending.png
    Route: /documents/verification-pending
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Client / CFO
    Data input: None; status view
    Data output: Analyst review task
    Core UI components to design: Pending summary, expected time, evidence placeholder
    Workflow integration: PF-D / UW-06
    Required states to reflect in the UI: pending, SLA_breach, needs_clarification
    Security / compliance controls to reflect through UI behaviour: No final validation yet
    Acceptance criterion: User sees next human review step.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

END OF BATCH PROMPT.
```

# Batch 04 — Pages 031–040

Copy the following prompt into ChatGPT image generation. It should produce separate images for this batch.

```text
Use ENGINE_v3 Standard — All Phases P0 to P12 internally to generate these visuals.

Generate 10 separate 16:9 clean AlphaVest WealthOS UI page designs for the listed pages.

CRITICAL OUTPUT RULES:
- Generate one separate image per page.
- The image must show only the actual UI design.
- Do not include spec panels, route labels, filename labels, annotation rails, callout legends, dev notes or explanatory documentation outside the app UI.
- Use all page details below only as design guidance.
- Maintain one consistent AlphaVest design system across all pages.
- If visual mode is MODAL, OVERLAY, DRAWER or BOTTOM SHEET, render that UI pattern correctly.
- If the page is a reference/internal page, render it as a clean internal AlphaVest application page, not as a poster.
- Do not render a marketing key visual.
- Do not render final content as legal/financial advice.
- All screens must respect: No unapproved advice reaches the client.

GLOBAL DESIGN SYSTEM:
Deep navy / midnight / charcoal background, ivory text, champagne-gold highlights, clean enterprise cards, tables, form controls, left nav, top bar, subtle dividers, premium but usable UI.

PAGES TO GENERATE:

031. Live wealth map
    Suggested filename: PAGE-031-wealth-map.png
    Route: /wealth-map
    Visual mode: PAGE_WITH_SIDE_DRAWER
    Overlay/drawer/modal guidance: Render the parent page plus the relevant side drawer. The drawer is part of the UI; background remains visible, not blurred.
    Primary roles: Principal / Advisor / scoped roles
    Data input: Filters, node selection
    Data output: Selected node / action / audit event
    Core UI components to design: Graph, filters, legend, detail drawer
    Workflow integration: PF-C / UW-05
    Required states to reflect in the UI: default_graph, selected_drawer, restricted_node, conflict_escalation
    Security / compliance controls to reflect through UI behaviour: Object-level visibility; restricted nodes masked
    Acceptance criterion: Structure and gaps visible without data leakage.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

032. Action board
    Suggested filename: PAGE-032-actions.png
    Route: /actions
    Visual mode: PAGE_WITH_SIDE_DRAWER
    Overlay/drawer/modal guidance: Render the parent page plus the relevant side drawer. The drawer is part of the UI; background remains visible, not blurred.
    Primary roles: Client / Family Office Operator / Analyst
    Data input: Action filters; card updates if allowed
    Data output: Action state changes
    Core UI components to design: Kanban, detail drawer, priority, evidence state
    Workflow integration: UW-05 / UW-06 / UW-13
    Required states to reflect in the UI: default, detail_drawer, blocked_missing_evidence, empty
    Security / compliance controls to reflect through UI behaviour: Role determines card action availability
    Acceptance criterion: Actions move through workflow safely.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

033. Signal / trigger review
    Suggested filename: PAGE-033-signals.png
    Route: /signals
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Analyst / Advisor
    Data input: Classify trigger, request data, route
    Data output: Trigger status / ActionItem / Recommendation draft
    Core UI components to design: Signal queue, context, AI draft, route panel
    Workflow integration: UW-07
    Required states to reflect in the UI: default, low_confidence_escalated, error
    Security / compliance controls to reflect through UI behaviour: Internal only; triggers not advice
    Acceptance criterion: Trigger becomes routed review or dismissed.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

034. Consultant workbench
    Suggested filename: PAGE-034-workbench.png
    Route: /workbench
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Analyst / Client Success
    Data input: Notes, route work, request data
    Data output: Queue updates, evidence links
    Core UI components to design: Client queue, data quality, trigger queue, drafts, checklist
    Workflow integration: UW-07 / UW-06
    Required states to reflect in the UI: default_queue, publish_disabled, detail_drawer
    Security / compliance controls to reflect through UI behaviour: Internal only; publish gate disabled until complete
    Acceptance criterion: Analyst can progress work without client release.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

035. Trigger detail / analyst notes
    Suggested filename: PAGE-035-workbench-triggers-id.png
    Route: /workbench/triggers/:id
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Analyst
    Data input: Analyst note, evidence link, assign advisor
    Data output: Trigger review record
    Core UI components to design: Signal details, notes, related docs, route controls
    Workflow integration: UW-07
    Required states to reflect in the UI: default, data_gaps, escalated, no_permission
    Security / compliance controls to reflect through UI behaviour: Internal; all notes audit logged
    Acceptance criterion: Trigger is documented and routed.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

036. Advisor approval queue
    Suggested filename: PAGE-036-advisor-approval.png
    Route: /advisor-approval
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Senior Wealth Advisor
    Data input: Select review item
    Data output: Recommendation review
    Core UI components to design: Queue/list and default review
    Workflow integration: UW-08
    Required states to reflect in the UI: default, empty, loading, error
    Security / compliance controls to reflect through UI behaviour: Advisor permission required
    Acceptance criterion: Advisor can select pending items.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

037. Advisor approval detail
    Suggested filename: PAGE-037-advisor-approval-id.png
    Route: /advisor-approval/:id
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Senior Wealth Advisor
    Data input: Approve/revise/request data/escalate, notes
    Data output: Approval record / state transition
    Core UI components to design: Recommendation package, risks, alternatives, decision panel
    Workflow integration: UW-08
    Required states to reflect in the UI: default_review, escalate_to_call, compliance_pending
    Security / compliance controls to reflect through UI behaviour: Internal only; client visibility remains blocked
    Acceptance criterion: Advisor decision creates audit/evidence.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

038. Compliance queue
    Suggested filename: PAGE-038-compliance.png
    Route: /compliance
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Compliance Officer
    Data input: Filter/review compliance queue
    Data output: Compliance item selected
    Core UI components to design: Queue table, classification, risk status
    Workflow integration: UW-09
    Required states to reflect in the UI: default_queue, empty, loading, error
    Security / compliance controls to reflect through UI behaviour: Compliance-only access
    Acceptance criterion: Compliance officer reviews pending items.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

039. Compliance review detail
    Suggested filename: PAGE-039-compliance-id-review.png
    Route: /compliance/:id/review
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Compliance Officer
    Data input: Classify, review evidence, notes
    Data output: ComplianceReview draft/update
    Core UI components to design: Classification, evidence completeness, policy checks, notes
    Workflow integration: UW-09
    Required states to reflect in the UI: in_review, needs_evidence, exception
    Security / compliance controls to reflect through UI behaviour: No release until gates complete
    Acceptance criterion: Compliance can decide release/block.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

040. Release to client
    Suggested filename: PAGE-040-compliance-id-release.png
    Route: /compliance/:id/release
    Visual mode: RELEASE_CONFIRMATION_MODAL_STATE
    Overlay/drawer/modal guidance: Render the release-to-client confirmation modal over the compliance review page; background dimmed/blurred.
    Primary roles: Compliance Officer
    Data input: Release confirmation
    Data output: clientVisible true, release record, audit
    Core UI components to design: Release checklist, preview, confirm
    Workflow integration: UW-09
    Required states to reflect in the UI: release_ready, released, error
    Security / compliance controls to reflect through UI behaviour: Release permission + second confirmation if configured
    Acceptance criterion: Approved content becomes client-visible.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

END OF BATCH PROMPT.
```

# Batch 05 — Pages 041–050

Copy the following prompt into ChatGPT image generation. It should produce separate images for this batch.

```text
Use ENGINE_v3 Standard — All Phases P0 to P12 internally to generate these visuals.

Generate 10 separate 16:9 clean AlphaVest WealthOS UI page designs for the listed pages.

CRITICAL OUTPUT RULES:
- Generate one separate image per page.
- The image must show only the actual UI design.
- Do not include spec panels, route labels, filename labels, annotation rails, callout legends, dev notes or explanatory documentation outside the app UI.
- Use all page details below only as design guidance.
- Maintain one consistent AlphaVest design system across all pages.
- If visual mode is MODAL, OVERLAY, DRAWER or BOTTOM SHEET, render that UI pattern correctly.
- If the page is a reference/internal page, render it as a clean internal AlphaVest application page, not as a poster.
- Do not render a marketing key visual.
- Do not render final content as legal/financial advice.
- All screens must respect: No unapproved advice reaches the client.

GLOBAL DESIGN SYSTEM:
Deep navy / midnight / charcoal background, ivory text, champagne-gold highlights, clean enterprise cards, tables, form controls, left nav, top bar, subtle dividers, premium but usable UI.

PAGES TO GENERATE:

041. Block / request evidence
    Suggested filename: PAGE-041-compliance-id-block.png
    Route: /compliance/:id/block
    Visual mode: BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE
    Overlay/drawer/modal guidance: Render block/request-evidence decision as modal or focused action panel over compliance review page.
    Primary roles: Compliance Officer
    Data input: Block reason, requested evidence, owner
    Data output: Blocked state, evidence request, audit
    Core UI components to design: Block banner, missing evidence checklist, request actions
    Workflow integration: UW-09
    Required states to reflect in the UI: blocked, request_evidence, escalated
    Security / compliance controls to reflect through UI behaviour: Client cannot see blocked advice content
    Acceptance criterion: Release remains blocked and evidence requested.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

042. Audit / exception log
    Suggested filename: PAGE-042-compliance-id-audit.png
    Route: /compliance/:id/audit
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Compliance Officer
    Data input: Filter/view/export audit
    Data output: Audit export/request
    Core UI components to design: Audit trail, exceptions, policy refs
    Workflow integration: UW-09 / UW-11
    Required states to reflect in the UI: default, exception_open, resolved
    Security / compliance controls to reflect through UI behaviour: Internal only; export controlled
    Acceptance criterion: Compliance can reconstruct decision lineage.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

043. Decision list
    Suggested filename: PAGE-043-decisions.png
    Route: /decisions
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Client / Principal / Family Council
    Data input: Filter/select decision
    Data output: Decision selection
    Core UI components to design: Decision table/cards, statuses, approvals
    Workflow integration: UW-10
    Required states to reflect in the UI: default, empty, loading, restricted
    Security / compliance controls to reflect through UI behaviour: Only released decisions shown to client
    Acceptance criterion: User finds decisions requiring action.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

044. Digital decision room
    Suggested filename: PAGE-044-decisions-id.png
    Route: /decisions/:id
    Visual mode: PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION
    Overlay/drawer/modal guidance: Main Decision Room page; accept/defer/reject confirmation may be shown as modal only if selected state is decision submit.
    Primary roles: Principal / Family Council / Trustee scoped
    Data input: Accept/defer/reject, comments
    Data output: Decision state and audit
    Core UI components to design: Situation, options, risks, docs, approvals, buttons
    Workflow integration: UW-10
    Required states to reflect in the UI: ready_to_decide, missing_permission_blocked, loading, error
    Security / compliance controls to reflect through UI behaviour: Client-visible only after compliance release
    Acceptance criterion: Client can decide with context.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

045. Decision submitted
    Suggested filename: PAGE-045-decisions-id-success.png
    Route: /decisions/:id/success
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Principal / Family Council
    Data input: None; success state
    Data output: Evidence package created
    Core UI components to design: Confirmation, evidence, review schedule
    Workflow integration: UW-10 / UW-11
    Required states to reflect in the UI: success, evidence_created
    Security / compliance controls to reflect through UI behaviour: Decision event immutable
    Acceptance criterion: User sees proof and next review.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

046. Evidence vault
    Suggested filename: PAGE-046-evidence.png
    Route: /evidence
    Visual mode: PAGE_WITH_SIDE_DRAWER
    Overlay/drawer/modal guidance: Render the parent page plus the relevant side drawer. The drawer is part of the UI; background remains visible, not blurred.
    Primary roles: Client / Advisor / Compliance scoped
    Data input: Search/filter/open record
    Data output: Evidence selected / audit event
    Core UI components to design: Evidence list, preview drawer, filters
    Workflow integration: UW-11
    Required states to reflect in the UI: default, preview_drawer, restricted, missing_evidence
    Security / compliance controls to reflect through UI behaviour: Visibility by role; internal notes hidden
    Acceptance criterion: User can inspect accessible evidence.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

047. Evidence record detail
    Suggested filename: PAGE-047-evidence-id.png
    Route: /evidence/:id
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Scoped roles
    Data input: View/open/download if allowed
    Data output: Audit event / export path
    Core UI components to design: Evidence details, linked docs, audit, versions
    Workflow integration: UW-11
    Required states to reflect in the UI: default, restricted, loading, error
    Security / compliance controls to reflect through UI behaviour: Access events logged
    Acceptance criterion: Record is traceable and contextual.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

048. Governance users
    Suggested filename: PAGE-048-governance-users.png
    Route: /governance/users
    Visual mode: PAGE_WITH_USER_DRAWER_OR_MODAL
    Overlay/drawer/modal guidance: User invitation / revoke access actions can be side drawer or modal.
    Primary roles: Principal / Admin / Compliance
    Data input: Invite/revoke user, assign role
    Data output: UserRole / AccessRequest
    Core UI components to design: User list, role summary, status
    Workflow integration: UW-12
    Required states to reflect in the UI: default, pending, revoked, blocked
    Security / compliance controls to reflect through UI behaviour: Sensitive role changes need second confirmation
    Acceptance criterion: Access can be managed safely.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

049. Role management
    Suggested filename: PAGE-049-governance-roles.png
    Route: /governance/roles
    Visual mode: PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL
    Overlay/drawer/modal guidance: Show role matrix and role drawer; sensitive save may show second-confirmation modal over blurred background.
    Primary roles: Principal / Admin / Compliance
    Data input: Create/edit role, permission matrix
    Data output: Role / RolePermission
    Core UI components to design: Matrix view, role drawer, save changes
    Workflow integration: UW-12
    Required states to reflect in the UI: matrix, role_drawer, second_confirmation, blocked
    Security / compliance controls to reflect through UI behaviour: Central permission engine; audit changes
    Acceptance criterion: Roles reflect tenant governance.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

050. Access requests
    Suggested filename: PAGE-050-governance-access-requests.png
    Route: /governance/access-requests
    Visual mode: PAGE_WITH_APPROVAL_DRAWER
    Overlay/drawer/modal guidance: Access request detail should be shown as side drawer or focused panel, not annotations.
    Primary roles: Principal / Admin / Compliance
    Data input: Approve/deny/escalate access request
    Data output: AccessRequest decision
    Core UI components to design: Request list, reason, decision panel
    Workflow integration: UW-12
    Required states to reflect in the UI: pending, approved, denied, escalated
    Security / compliance controls to reflect through UI behaviour: SOD and policy checks
    Acceptance criterion: Sensitive access is controlled.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

END OF BATCH PROMPT.
```

# Batch 06 — Pages 051–060

Copy the following prompt into ChatGPT image generation. It should produce separate images for this batch.

```text
Use ENGINE_v3 Standard — All Phases P0 to P12 internally to generate these visuals.

Generate 10 separate 16:9 clean AlphaVest WealthOS UI page designs for the listed pages.

CRITICAL OUTPUT RULES:
- Generate one separate image per page.
- The image must show only the actual UI design.
- Do not include spec panels, route labels, filename labels, annotation rails, callout legends, dev notes or explanatory documentation outside the app UI.
- Use all page details below only as design guidance.
- Maintain one consistent AlphaVest design system across all pages.
- If visual mode is MODAL, OVERLAY, DRAWER or BOTTOM SHEET, render that UI pattern correctly.
- If the page is a reference/internal page, render it as a clean internal AlphaVest application page, not as a poster.
- Do not render a marketing key visual.
- Do not render final content as legal/financial advice.
- All screens must respect: No unapproved advice reaches the client.

GLOBAL DESIGN SYSTEM:
Deep navy / midnight / charcoal background, ivory text, champagne-gold highlights, clean enterprise cards, tables, form controls, left nav, top bar, subtle dividers, premium but usable UI.

PAGES TO GENERATE:

051. Access audit history
    Suggested filename: PAGE-051-governance-audit-history.png
    Route: /governance/audit-history
    Visual mode: PAGE_WITH_SIDE_DRAWER
    Overlay/drawer/modal guidance: Render the parent page plus the relevant side drawer. The drawer is part of the UI; background remains visible, not blurred.
    Primary roles: Principal / Admin / Security
    Data input: Filter/review access changes
    Data output: Audit detail / export path
    Core UI components to design: Audit log table, event drawer
    Workflow integration: UW-12 / UW-11
    Required states to reflect in the UI: default, empty, loading, error
    Security / compliance controls to reflect through UI behaviour: Read-only immutable log
    Acceptance criterion: Access history can be reviewed.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

052. Communication centre
    Suggested filename: PAGE-052-communication.png
    Route: /communication
    Visual mode: PREVIEW_PAGE_OR_PANEL
    Overlay/drawer/modal guidance: Render the preview panel/page as actual UI, no annotation rails.
    Primary roles: Advisor / Client Success / Client scoped
    Data input: Select path, create message/call
    Data output: MessageThread / CallEvent
    Core UI components to design: Decision tree, templates, log, preview
    Workflow integration: UW-13
    Required states to reflect in the UI: decision_tree, call_trigger, preview, evidence_log
    Security / compliance controls to reflect through UI behaviour: Advice-like comms require gates
    Acceptance criterion: Communication routed appropriately.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

053. Call trigger matrix
    Suggested filename: PAGE-053-communication-call-trigger.png
    Route: /communication/call-trigger
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Advisor / Client Success
    Data input: Evaluate scenario and path
    Data output: CallEvent / escalation
    Core UI components to design: Matrix, rules, recommended path
    Workflow integration: UW-13
    Required states to reflect in the UI: default, escalated, compliance_hold
    Security / compliance controls to reflect through UI behaviour: Internal rules; client sees simplified message
    Acceptance criterion: Meeting triggered only when needed.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

054. Create export
    Suggested filename: PAGE-054-export-new.png
    Route: /export/new
    Visual mode: WIZARD_OR_STEP_PAGE
    Overlay/drawer/modal guidance: Render a clean wizard/step page with progress indicator where useful. No external annotations.
    Primary roles: Principal / Compliance / Advisor / Privacy scoped
    Data input: Export type and scope
    Data output: ExportRequest draft
    Core UI components to design: Export wizard step 1
    Workflow integration: UW-11 / UW-10
    Required states to reflect in the UI: draft, permission_blocked
    Security / compliance controls to reflect through UI behaviour: Export permission + tenant scope required
    Acceptance criterion: Export scope initiated.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

055. Export scope selection
    Suggested filename: PAGE-055-export-id-scope.png
    Route: /export/:id/scope
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Requester
    Data input: Objects, date range, recipients
    Data output: ExportRequest scope
    Core UI components to design: Scope tree, selected items
    Workflow integration: UW-11
    Required states to reflect in the UI: scope_selected, invalid_scope
    Security / compliance controls to reflect through UI behaviour: Object-level permission checks
    Acceptance criterion: Only allowed objects included.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

056. Export redaction
    Suggested filename: PAGE-056-export-id-redaction.png
    Route: /export/:id/redaction
    Visual mode: PREVIEW_PAGE_OR_PANEL
    Overlay/drawer/modal guidance: Render the preview panel/page as actual UI, no annotation rails.
    Primary roles: Requester / Compliance
    Data input: Redaction profile, visibility level
    Data output: Redaction config
    Core UI components to design: Redaction preview, internal/client-visible split
    Workflow integration: UW-11
    Required states to reflect in the UI: pending, approved, error
    Security / compliance controls to reflect through UI behaviour: Redaction mandatory for external/client exports
    Acceptance criterion: Sensitive fields removed.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

057. Export preview
    Suggested filename: PAGE-057-export-id-preview.png
    Route: /export/:id/preview
    Visual mode: PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL
    Overlay/drawer/modal guidance: If approval is required, show approval/confirm modal over export preview.
    Primary roles: Requester / Approver
    Data input: Review package
    Data output: Approval or confirm action
    Core UI components to design: Preview, warnings, missing approvals
    Workflow integration: UW-11
    Required states to reflect in the UI: preview, approval_required, blocked
    Security / compliance controls to reflect through UI behaviour: No download before approval if required
    Acceptance criterion: Requester can validate package.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

058. Export download/share
    Suggested filename: PAGE-058-export-id-download.png
    Route: /export/:id/download
    Visual mode: DOWNLOAD_CONFIRMATION_STATE
    Overlay/drawer/modal guidance: Show final generated/download state; modal only for secure-share confirmation.
    Primary roles: Approved requester
    Data input: Download/share action
    Data output: Export file and audit event
    Core UI components to design: Download link, expiry, watermark
    Workflow integration: UW-11
    Required states to reflect in the UI: generated, downloaded, expired
    Security / compliance controls to reflect through UI behaviour: Audit download; expiry on external share
    Acceptance criterion: Export delivered safely.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

059. Ops queues
    Suggested filename: PAGE-059-ops-queues.png
    Route: /ops/queues
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Ops / Programme / Leads
    Data input: Filter/reassign queues
    Data output: QueueItem updates
    Core UI components to design: Queue dashboard, workload, SLA
    Workflow integration: UW-14
    Required states to reflect in the UI: default, overload, error
    Security / compliance controls to reflect through UI behaviour: Internal only
    Acceptance criterion: Bottlenecks visible.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

060. SLA and escalation
    Suggested filename: PAGE-060-ops-sla.png
    Route: /ops/sla
    Visual mode: NORMAL_PAGE
    Overlay/drawer/modal guidance: Render the default page state as a clean AlphaVest UI screen, with no annotations outside the actual app UI.
    Primary roles: Ops / Client Success
    Data input: SLA thresholds, escalation actions
    Data output: SLAEvent / Queue updates
    Core UI components to design: SLA dashboard, breaches, escalations
    Workflow integration: UW-14
    Required states to reflect in the UI: on_track, at_risk, breached
    Security / compliance controls to reflect through UI behaviour: Internal; client comms controlled
    Acceptance criterion: SLA risk can be managed.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

END OF BATCH PROMPT.
```

# Batch 07 — Pages 061–063

Copy the following prompt into ChatGPT image generation. It should produce separate images for this batch.

```text
Use ENGINE_v3 Standard — All Phases P0 to P12 internally to generate these visuals.

Generate 3 separate 16:9 clean AlphaVest WealthOS UI page designs for the listed pages.

CRITICAL OUTPUT RULES:
- Generate one separate image per page.
- The image must show only the actual UI design.
- Do not include spec panels, route labels, filename labels, annotation rails, callout legends, dev notes or explanatory documentation outside the app UI.
- Use all page details below only as design guidance.
- Maintain one consistent AlphaVest design system across all pages.
- If visual mode is MODAL, OVERLAY, DRAWER or BOTTOM SHEET, render that UI pattern correctly.
- If the page is a reference/internal page, render it as a clean internal AlphaVest application page, not as a poster.
- Do not render a marketing key visual.
- Do not render final content as legal/financial advice.
- All screens must respect: No unapproved advice reaches the client.

GLOBAL DESIGN SYSTEM:
Deep navy / midnight / charcoal background, ivory text, champagne-gold highlights, clean enterprise cards, tables, form controls, left nav, top bar, subtle dividers, premium but usable UI.

PAGES TO GENERATE:

061. Service blueprint
    Suggested filename: PAGE-061-service-blueprint.png
    Route: /service-blueprint
    Visual mode: REFERENCE_ONLY_INTERNAL_PAGE
    Overlay/drawer/modal guidance: Render as an internal product/reference page inside the AlphaVest app. It is still a clean UI page; do not include external spec annotations.
    Primary roles: Product / Ops / Compliance
    Data input: None or stage focus
    Data output: Reference / documentation
    Core UI components to design: Swimlanes: customer, frontstage, backstage, support, evidence
    Workflow integration: UW-14 reference
    Required states to reflect in the UI: default
    Security / compliance controls to reflect through UI behaviour: Internal reference
    Acceptance criterion: Team sees full operating model.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

062. MVP vs future scope
    Suggested filename: PAGE-062-roadmap.png
    Route: /roadmap
    Visual mode: REFERENCE_ONLY_INTERNAL_PAGE
    Overlay/drawer/modal guidance: Render as an internal product/reference page inside the AlphaVest app. It is still a clean UI page; do not include external spec annotations.
    Primary roles: Product / Tech / Executive
    Data input: Scope decisions/status
    Data output: Roadmap decision / audit
    Core UI components to design: MVP/Phase2/Future columns, dependencies
    Workflow integration: UW-14 reference
    Required states to reflect in the UI: default, blocked_features, dependency_flow
    Security / compliance controls to reflect through UI behaviour: Internal planning; no client data
    Acceptance criterion: Scope stays controlled.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

063. State and badge reference
    Suggested filename: PAGE-063-states.png
    Route: /states
    Visual mode: REFERENCE_ONLY_INTERNAL_PAGE
    Overlay/drawer/modal guidance: Render as an internal product/reference page inside the AlphaVest app. It is still a clean UI page; do not include external spec annotations.
    Primary roles: Product / Engineering / QA
    Data input: None
    Data output: Reference
    Core UI components to design: State chips, workflow badges, state machines
    Workflow integration: UW-14 reference
    Required states to reflect in the UI: default
    Security / compliance controls to reflect through UI behaviour: Internal reference
    Acceptance criterion: State language consistent.
    UI-only instruction: Render only the usable AlphaVest page/screen/modal/drawer. Do not render the filename, route, data-input text, acceptance criterion, workflow ID, dev notes or annotation boxes on the canvas unless they are natural in-app UI labels.

END OF BATCH PROMPT.
```


# ENGINE_v3 Proof — Standard / All Phases

**P0 — Mission Card:** Ziel geklärt: Prompts in 10er-Batches für die Umsetzung der V3-Pages als saubere AlphaVest-UI-Designbilder erstellen.

**P1 — Evidence Intake:** PAGE_SPECS_V3.md als Quelle genutzt; daraus 63 Route-/Page-Spezifikationen extrahiert.

**P2 — Scope Count:** 63 Pages identifiziert; bei maximal 10 Bildern pro Request ergibt das 7 Batch-Prompts.

**P3 — Design Constraint Translation:** AlphaVest-Designsystem festgelegt: Navy/Midnight/Charcoal, Ivory, Champagne-Gold, konsistente Enterprise-App-Komponenten.

**P4 — No-Annotation Rule:** Explizit festgelegt, dass die generierten Visuals nur das eigentliche UI enthalten dürfen — keine Spec Rails, Dev Notes, Callouts, Dateinamen oder Legenden im Bild.

**P5 — Overlay / Modal Logic:** Modale, Side Drawers, Bottom Sheets und Overlay-Zustände je Seite klassifiziert und in den Batch-Prompts gekennzeichnet.

**P6 — Page Prompt Schema:** Für jede Seite Route, Zweck, Rollen, Inputs, Outputs, Komponenten, Workflow, States, Security Controls und Acceptance Criteria als Prompt-Kontext aufgenommen.

**P7 — Batch Construction:** 7 Prompts erstellt: sechs mit je 10 Seiten und ein letzter mit 3 Seiten.

**P8 — Consistency Gate:** Alle Prompts erzwingen konsistentes AlphaVest-Design und wiederkehrende UI-Komponenten.

**P9 — Safety / Product Logic:** No-Unapproved-Advice-Regel als UI-Verhaltensregel für advice-, approval- und release-bezogene Seiten integriert.

**P10 — Modal Quality Gate:** Für Overlay-Seiten definiert: Hintergrund dimmen/blurred, Drawer am Rand verankern, keine Posterlogik.

**P11 — Output Assembly:** Prompts als Markdown-Datei plus ZIP gebündelt.

**P12 — Final QA:** Geprüft, dass alle 63 Seiten abgedeckt sind, die Batches das 10er-Limit beachten, Modal-/Drawer-Hinweise enthalten und die Visuals ausschließlich Design ohne Zusatzinfos erzeugen sollen.
