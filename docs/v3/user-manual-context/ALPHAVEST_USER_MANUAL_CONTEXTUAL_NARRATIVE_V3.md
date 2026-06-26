# AlphaVest WealthOS User Manual Contextual Narrative V3

Generated: 2026-06-17T00:00:00Z

## Purpose

This narrative layer explains the product context behind the existing AlphaVest WealthOS user manual. It is designed to be inserted into the next manual and PDF generation pass as compact callouts, task introductions, field rationales, gate explanations, and reader takeaways.

## Global Context

AlphaVest WealthOS is a demo-data-first wealth operations application for family-office and advisory workflows. Its purpose is not only to move users through screens, but to make sure client work moves through the right tenant, role, evidence, audit, permission, and compliance states.

The manual should repeatedly explain that blocked states are protective controls. They prevent unsafe shortcuts such as wrong-tenant access, advisor-only release, missing evidence, unredacted export, silent access changes, or demo-only behavior being mistaken for production completion.

## MT-001 - Configure the platform policy baseline

**Section:** Platform and policy setup

**Role context:** Platform, compliance, and security roles use this task to establish the operating rules that every later tenant and workflow inherits.

**Why this task exists:** AlphaVest needs a policy baseline before client work starts because advice boundaries, role templates, evidence expectations, security defaults, and export rules define what later workflows may safely do. Without this baseline, teams would be moving client data and review work through unclear controls.

**Why now:** This task belongs at the beginning because tenant onboarding, recommendations, exports, and governance all rely on the platform policy map being visible first.

**What the user is trying to achieve:** The user is trying to confirm that the operating model is safe enough for tenant setup and that sensitive changes still require review, confirmation, and audit.

**Context before steps:** Review the baseline before making client-specific changes. This is the control layer that tells the rest of the application how to treat advice-like content, sensitive permissions, evidence requirements, and export behavior.

**What this prevents:**
- unsafe default settings
- silent policy drift
- weak advice classification
- role templates that allow too much
- exports without evidence or redaction expectations

**What this enables next:**
- tenant setup with consistent policy inheritance
- clear role templates for invitations and governance
- future evidence templates for important actions
- safer export and release rules

### Step Context

- **MT-001-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-001-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-001-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-001-S4:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-001-S5:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-001-S6:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-001 - Setting key/value:** This value controls platform behavior that later tenants inherit. Downstream use: Tenant setup, security posture, retention expectations, and audit lineage. Risk if wrong or missing: Wrong values can weaken default controls or require second confirmation before activation.
- **F-002 - Advice classification:** Advice classification is the map that separates information, workflow guidance, advice-relevant material, and advice. Downstream use: Advisor review, compliance release, client visibility, and blocked states. Risk if wrong or missing: Wrong classification can either overexpose clients or block useful work unnecessarily.

### Gate And Control Context

- **MT-001-G1:** Second confirmation protects sensitive platform, security, and role changes from accidental activation.
- **MT-001-G2:** Advice-boundary policy protects clients from seeing advice-like material before human review and compliance release.
- **MT-001-G3:** Audit expectations preserve the lineage of sensitive configuration changes.

### Blocked-State Context

- **MT-001-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Policy baseline is reviewed; sensitive changes require confirmation and audit.
- **MT-001-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for production governance because later tenant policies, release checks, audit history, and evidence templates can inherit one controlled baseline instead of relying on ad hoc screen behavior.

**Demo-boundary note:** In the current demo, the UI shows policy states and confirmation patterns. It does not prove broad persisted policy transactions across every platform setting.

**Reader takeaway:** A safe tenant workflow starts with a visible and reviewable platform policy baseline.

## MT-002 - Create and prepare a client tenant

**Section:** Tenant onboarding

**Role context:** Admin, Client Success, and Compliance roles use this task to turn a client relationship into a scoped tenant with accountable owners.

**Why this task exists:** A client tenant is the container that keeps family-office data, roles, policies, evidence, and workflow state isolated from every other client. Creating it carefully prevents later work from being attached to the wrong client, jurisdiction, or service team.

**Why now:** Tenant setup comes before client onboarding because users, policies, team assignments, and invitation readiness all depend on a correct tenant context.

**What the user is trying to achieve:** The user is trying to prepare a client workspace that has the right identity, jurisdiction, service tier, assigned team, policy profile, and invitation path.

**Context before steps:** Treat tenant creation as the point where AlphaVest separates one client operating context from another. The key question is not only whether the tenant exists, but whether it is ready for people, policies, and review work to be attached to it.

**What this prevents:**
- duplicate tenant setup
- wrong jurisdiction context
- missing compliance ownership
- unassigned advisor or analyst work
- client onboarding before activation gates are ready

**What this enables next:**
- principal invitation
- role-scoped onboarding
- tenant-specific policy selection
- client profile and document intake under the correct tenant

### Step Context

- **MT-002-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-002-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-002-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-002-S4:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-002-S5:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-002-S6:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-003 - Client name and jurisdiction:** Client identity and jurisdiction establish the tenant boundary and regulatory context. Downstream use: Tenant activation, policy profile selection, onboarding, and later data isolation. Risk if wrong or missing: Missing or duplicate values can attach work to the wrong client or block activation.
- **F-004 - Compliance owner:** The compliance owner gives release decisions an accountable role before client work begins. Downstream use: Compliance review, release/block decisions, evidence requests, and activation readiness. Risk if wrong or missing: Without an owner, activation and release governance remain blocked.

### Gate And Control Context

- **MT-002-G1:** Activation gates protect the tenant from becoming active without assigned owners and required setup context.
- **MT-002-G2:** Compliance ownership ensures release decisions have an accountable role before client-visible work begins.
- **MT-002-G3:** Audit expectations preserve who created, assigned, or changed tenant setup state.

### Blocked-State Context

- **MT-002-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Tenant setup checklist shows whether activation gates are ready or blocked.
- **MT-002-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for production tenant isolation, onboarding automation, team assignment reporting, and policy inheritance once governed persistence is expanded.

**Demo-boundary note:** In the current demo, tenant setup is navigable and explains readiness. It does not yet prove a fully governed tenant-write lifecycle.

**Reader takeaway:** Tenant setup is the point where AlphaVest makes client work isolated, owned, and ready for safe onboarding.

## MT-003 - Accept an invitation and complete onboarding

**Section:** Client onboarding and profile

**Role context:** The invited user uses this task to enter the tenant context with consent and role awareness, while AlphaVest keeps production authentication out of scope for the demo.

**Why this task exists:** Onboarding connects a person to the right tenant, role, consent version, and access scope. This matters because later decisions, evidence views, and communications should depend on who the user is allowed to be in that client context.

**Why now:** Invitation acceptance happens after tenant setup and before client-side work because the user should not enter profile, evidence, or decision areas until the tenant and role context are clear.

**What the user is trying to achieve:** The user is trying to confirm that the invitation belongs to the expected tenant, acknowledge required privacy context, and understand the role scope they will operate under.

**Context before steps:** Use this flow to understand who is entering the workspace and under which tenant and role assumptions. The goal is not to prove production login; the goal is to make role and consent context explicit before client work starts.

**What this prevents:**
- wrong tenant access
- consent ambiguity
- role misunderstanding
- production-auth overclaim in the demo
- client work before invitation context is clear

**What this enables next:**
- client profile work
- role-scoped evidence access
- decision participation
- governed communication and consent history in later production flows

### Step Context

- **MT-003-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-003-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-003-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-003-S4:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-003-S5:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-003-S6:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-005 - Invite token:** The invite token scopes onboarding to one intended tenant and user. Downstream use: Role confirmation, consent capture, and client-side entry. Risk if wrong or missing: An expired, reused, or wrong token can put the user in the wrong context.
- **F-006 - Privacy acknowledgement:** Privacy acknowledgement records which consent version the user accepted. Downstream use: Onboarding completion, audit history, and later privacy review. Risk if wrong or missing: Missing consent blocks continuation because client-side work needs explicit acknowledgement.

### Gate And Control Context

- **MT-003-G1:** Invite-token scope prevents a user from entering the wrong tenant context.
- **MT-003-G2:** Privacy acknowledgement records which consent version the user has accepted.
- **MT-003-G3:** Role confirmation prevents users from assuming broader access than the assigned scope allows.

### Blocked-State Context

- **MT-003-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: User reaches role confirmation; production auth remains intentionally deferred.
- **MT-003-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for provider-backed authentication, consent versioning, and role-scoped client access without changing the demo-first implementation order.

**Demo-boundary note:** In the current demo, onboarding screens are visual and navigable. They do not introduce real production authentication.

**Reader takeaway:** Onboarding is where the user, tenant, consent, and role context become explicit before client work begins.

## MT-004 - Submit client profile and family context

**Section:** Client onboarding and profile

**Role context:** Principals and Family CFOs use this task to provide the context that internal teams need before advice-like or decision workflows can be interpreted responsibly.

**Why this task exists:** Family-office work depends on relationships, responsibilities, objectives, and governance preferences. Capturing that context helps AlphaVest distinguish useful information from incomplete or conflicted inputs.

**Why now:** Profile and family context comes before entity, document, recommendation, and decision work because later reviewers need to know who is involved and which relationships matter.

**What the user is trying to achieve:** The user is trying to make the client profile clear enough that later reviewers can understand family roles, decision scopes, relationship conflicts, and missing evidence.

**Context before steps:** This step gives the application the client context needed to make later workflow states meaningful. It should capture facts and relationship context, not final advice.

**What this prevents:**
- decisions without family context
- relationship conflicts being missed
- wrong person receiving access
- profile data being mistaken for final advice
- review work based on incomplete context

**What this enables next:**
- entity and wealth-structure intake
- role-aware decision participation
- relationship-aware governance review
- better evidence requests and analyst follow-up

### Step Context

- **MT-004-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-004-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-004-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-004-S4:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-007 - Family profile and objective:** Family profile and objective capture context without turning it into final advice. Downstream use: Relationship review, entity work, decision context, and advisor understanding. Risk if wrong or missing: Missing context makes later decisions harder to interpret and can trigger review blocks.
- **F-008 - Family member role:** Family member role defines who can participate, decide, or view scoped material. Downstream use: Decision participation, relationship mapping, and access control. Risk if wrong or missing: Wrong roles can create access errors, conflict flags, or decision ambiguity.

### Gate And Control Context

- **MT-004-G1:** Tenant context protects family data from crossing client boundaries.
- **MT-004-G2:** Relationship and role scope protect decision and access workflows from using the wrong participant model.
- **MT-004-G3:** Missing-evidence indicators keep incomplete profile context visible instead of hiding uncertainty.

### Blocked-State Context

- **MT-004-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Profile and relationship context is visible with conflicts or missing evidence flagged.
- **MT-004-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for richer family governance, permission scoping, conflict review, and future data-quality automation.

**Demo-boundary note:** In the current demo, profile and relationship screens are navigable with static or demo data. Profile persistence is not fully claimed.

**Reader takeaway:** Family context turns later workflow actions from isolated clicks into role-aware client decisions.

## MT-005 - Create an entity and review wealth structure

**Section:** Structure, documents and evidence intake

**Role context:** Principals, Family CFOs, Analysts, and Advisors use this task to connect legal and ownership structure to reviewable workflow objects.

**Why this task exists:** Wealth operations need a clear map of entities, participants, jurisdictions, assets, and missing proof. Entity intake turns loose structure information into nodes that can be reviewed, evidenced, and acted on.

**Why now:** Entity structure follows profile context because reviewers first need to know the client and family roles, then the entities and assets connected to them.

**What the user is trying to achieve:** The user is trying to create or review a structure node and understand what evidence or action is still needed before the structure can support decisions.

**Context before steps:** Treat each entity as part of the client operating map. The task is useful when it exposes what is known, what is missing, and what cannot yet be treated as ready.

**What this prevents:**
- structure gaps being hidden
- assets being linked to the wrong entity
- jurisdiction risk being missed
- entity creation without supporting evidence
- legal review flags being skipped

**What this enables next:**
- document linking
- wealth-map analysis
- action-board follow-up
- evidence-backed review of ownership and participants

### Step Context

- **MT-005-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-005-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-005-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-005-S4:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-005-S5:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-009 - Entity type/name/jurisdiction:** Entity type, name, and jurisdiction define a legal or structure node. Downstream use: Wealth map, document linkage, jurisdiction review, and action-board gaps. Risk if wrong or missing: Incorrect structure data can hide legal or evidence gaps.

### Gate And Control Context

- **MT-005-G1:** Entity sensitivity and jurisdiction checks protect high-risk structures from casual progression.
- **MT-005-G2:** Evidence requirements prevent structure records from looking complete before supporting documents exist.
- **MT-005-G3:** Action-board blockers keep unresolved structure work visible.

### Blocked-State Context

- **MT-005-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Entity detail, wealth-map drawer, and action-board blockers show what must happen next.
- **MT-005-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for richer wealth-map analysis, specialist review, automated gap detection, and evidence-backed entity governance.

**Demo-boundary note:** In the current demo, entity and wealth-map screens are navigable. Entity mutations, action transitions, and evidence gates still need broader transaction wiring.

**Reader takeaway:** Entity intake makes the client structure visible enough to review, but missing evidence must stay visible too.

## MT-006 - Upload and verify a document

**Section:** Structure, documents and evidence intake

**Role context:** Clients, Family CFOs, External Advisors, and Analysts use this task to turn source documents into verified evidence inputs.

**Why this task exists:** Documents are the source proof behind profile, entity, recommendation, export, and compliance decisions. Uploading and verifying them reduces reliance on memory, assumptions, or unreviewed extracted data.

**Why now:** Document intake follows profile and structure intake because files need to be scoped to the right tenant, entity, asset, sensitivity, and review purpose.

**What the user is trying to achieve:** The user is trying to upload source evidence, classify it, review extracted draft data, correct uncertainty, and move it toward human verification.

**Context before steps:** A document should not become trusted simply because it was uploaded. The useful work is in classifying, scoping, reviewing, correcting, and linking it to the right evidence context.

**What this prevents:**
- unsupported advice-like work
- wrong document scope
- low-confidence extraction becoming accepted fact
- sensitive files being treated casually
- evidence gaps being hidden

**What this enables next:**
- analyst validation
- evidence linking
- compliance review
- controlled exports
- future data extraction and document-quality workflows

### Step Context

- **MT-006-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-006-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-006-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-006-S4:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-010 - Document file/type/scope:** Document file, type, and scope connect source proof to the right object. Downstream use: Extraction review, evidence linking, compliance review, and export packages. Risk if wrong or missing: Unsupported or wrongly scoped files cannot become reliable evidence.
- **F-011 - Corrected extracted value:** Corrected extracted values keep AI draft data from becoming accepted fact without human review. Downstream use: Analyst verification, evidence quality, and downstream decision confidence. Risk if wrong or missing: Low-confidence or wrong extracted values can mislead later reviewers.

### Gate And Control Context

- **MT-006-G1:** Allowed file type and document taxonomy protect the intake queue from unusable sources.
- **MT-006-G2:** Extraction review prevents AI draft data from becoming accepted evidence without human confirmation.
- **MT-006-G3:** Sensitivity and scope controls determine who can view or export the document later.

### Blocked-State Context

- **MT-006-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Document reaches verification-pending or needs-clarification state.
- **MT-006-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for production file storage, extraction confidence handling, analyst review queues, evidence automation, and redacted export packaging.

**Demo-boundary note:** In the current demo, document screens are navigable. Real file storage and extraction transactions are not claimed as production-complete.

**Reader takeaway:** Documents become useful to AlphaVest only when they are scoped, reviewed, corrected, and linked to evidence.

## MT-007 - Process a signal and route internal work

**Section:** Internal advisory review

**Role context:** Analysts use this task to convert ambiguous internal signals into reviewable work while keeping the client protected from premature advice.

**Why this task exists:** Signals may indicate missing ownership data, funding questions, document gaps, or workflow triggers. Analyst review separates internal triage from client-visible recommendations.

**Why now:** Signal review happens before advisor approval because the analyst must clarify missing data, route the work, or dismiss non-actionable items before senior judgment is requested.

**What the user is trying to achieve:** The user is trying to understand the signal, add internal context, and choose the next safe route without creating client-visible advice.

**Context before steps:** Signals are prompts for human review, not final outputs. The analyst should use this task to clarify the issue and decide the next internal action while preserving client invisibility.

**What this prevents:**
- AI or signal data being mistaken for advice
- client visibility before review
- recommendations based on missing beneficial-owner or source-of-funds data
- unrouted internal work

**What this enables next:**
- data request workflows
- advisor approval packages
- internal action tracking
- canonical typed boundary triage for the J01 subset

### Step Context

- **MT-007-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-007-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-007-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-007-S4:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-012 - Analyst route decision:** The analyst route decision turns an internal signal into the next safe action. Downstream use: Data requests, advisor routing, dismissal, or assignment. Risk if wrong or missing: A wrong route can create premature advice or leave important work unresolved.

### Gate And Control Context

- **MT-007-G1:** Internal-only visibility protects clients from seeing unreviewed triggers.
- **MT-007-G2:** Route decisions create the next workflow state without bypassing advisor and compliance gates.
- **MT-007-G3:** Audit rows are expected for executable request or route actions where the demo API supports them.

### Blocked-State Context

- **MT-007-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Trigger moves toward awaiting information or advisor review while staying internal-only.
- **MT-007-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for broader signal governance, triage metrics, automated queueing, and safer recommendation preparation.

**Demo-boundary note:** In the current demo, J01 signal/advisor behavior is handled on the canonical typed boundary (legacy compatibility bridge). Full canonical typed signal governance is not yet implemented across all paths.

**Reader takeaway:** Signal review turns ambiguity into internal work without turning it into client advice.

## MT-008 - Review an advisor approval package

**Section:** Internal advisory review

**Role context:** Senior Wealth Advisors use this task to apply human judgment before compliance decides whether anything can become client-visible.

**Why this task exists:** Advisor review is the human judgment stage between analyst work and compliance release. It lets advisors approve, revise, request more data, or escalate without granting client visibility.

**Why now:** Advisor approval follows analyst routing and precedes compliance release because professional review should happen before release controls evaluate the package.

**What the user is trying to achieve:** The user is trying to review the recommendation package, record a defensible advisor decision, and route the work to the next gate.

**Context before steps:** Advisor approval is an internal quality gate. It can improve or route a recommendation, but it does not by itself make anything visible to the client.

**What this prevents:**
- advisor silence being treated as approval
- approval without rationale
- client release by advisor action alone
- incomplete packages reaching compliance without conditions

**What this enables next:**
- compliance review
- revision loops
- data requests
- escalation to calls when complexity needs human conversation

### Step Context

- **MT-008-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-008-S2:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-013 - Advisor decision and rationale:** Advisor decision and rationale record human judgment without creating client release. Downstream use: Compliance review, revision loops, escalation, and advisor accountability. Risk if wrong or missing: Approval without rationale weakens review lineage and can confuse release status.

### Gate And Control Context

- **MT-008-G1:** Advisor decision and rationale create review lineage.
- **MT-008-G2:** Compliance release remains required before client visibility.
- **MT-008-G3:** Escalation paths protect complex matters from being forced through a digital-only route.

### Blocked-State Context

- **MT-008-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Advisor decision is recorded or routed; compliance release remains required.
- **MT-008-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for clearer advisor accountability, package quality metrics, and compliance-ready recommendation records.

**Demo-boundary note:** In the current demo, J01 advisor actions are handled on the canonical typed boundary (legacy compatibility bridge). Canonical advisor governance remains a typed recommendation-review command boundary.

**Reader takeaway:** Advisor approval is human review, not client release.

## MT-009 - Release, block, or request evidence for advice-like content

**Section:** Compliance release and client decisions

**Role context:** Compliance Officers use this task to decide whether advice-like content may become client-visible, must stay blocked, or needs more evidence.

**Why this task exists:** Compliance release is the decisive client-visibility gate. It checks whether classification, evidence, permissions, disclosures, and review lineage are strong enough for the client to see the material.

**Why now:** Compliance review happens after advisor approval because the package should already have human judgment before the release decision is considered.

**What the user is trying to achieve:** The user is trying to release, block, or request evidence in a way that preserves the no-unapproved-advice rule and leaves a defensible record.

**Context before steps:** This is the moment where AlphaVest decides whether internal work may cross the boundary to the client. The safest outcome may be release, block, or request evidence depending on the record.

**What this prevents:**
- advisor-only release
- missing evidence reaching clients
- advice-like content bypassing compliance
- unresolved classification being hidden
- client visibility without audit

**What this enables next:**
- released client decisions
- evidence requests
- blocked-state recovery
- client-visible content only after gates pass

### Step Context

- **MT-009-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-009-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-009-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-009-S4:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-009-S5:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-014 - Release/block decision:** Release or block decision determines whether advice-like content can become client-visible. Downstream use: Client decision availability, evidence requests, and audit history. Risk if wrong or missing: Wrong release decisions can expose unapproved advice or hide needed evidence.

### Gate And Control Context

- **MT-009-G1:** Compliance release protects client visibility.
- **MT-009-G2:** Evidence completeness protects the release decision from unsupported claims.
- **MT-009-G3:** Block and request-evidence states are legitimate controls, not failures.
- **MT-009-G4:** Audit records preserve why release did or did not happen.

### Blocked-State Context

- **MT-009-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Release, block, or evidence-request state is visible; no unapproved advice reaches the client.
- **MT-009-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for production release governance, release analytics, exception review, and evidence-backed client-decision packages.

**Demo-boundary note:** In the current demo, compliance states are visible and partially executable. Broad release transactions remain a top implementation gap.

**Reader takeaway:** Compliance release is the client-visibility control point.

## MT-010 - Review and submit a released client decision

**Section:** Compliance release and client decisions

**Role context:** Principals, Family Council members, and scoped Trustees use this task to review only released content and record a client-side response.

**Why this task exists:** Client decisions should be based only on material that has passed the release gate. The decision workflow records acceptance, deferral, rejection, or a request for more information with evidence context.

**Why now:** Client decision comes after compliance release because the client should not review advice-like content that is still internal, advisor-only, or compliance-pending.

**What the user is trying to achieve:** The user is trying to understand the released decision context and record a response that can be traced later.

**Context before steps:** Use this task only for released client-visible material. The decision screen should help the client respond, not expose internal work or unreleased advice-like content.

**What this prevents:**
- clients acting on unreleased material
- family decisions without proof
- ambiguous accept or defer outcomes
- decision records without evidence lineage

**What this enables next:**
- evidence package creation
- review scheduling
- family approval tracking
- clear completion proof after submission

### Step Context

- **MT-010-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-010-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-010-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-010-S4:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-015 - Decision choice:** Decision choice records the client-side response to released material. Downstream use: Decision evidence, family approval, review scheduling, and completion proof. Risk if wrong or missing: Ambiguous choices make later evidence and follow-up unclear.

### Gate And Control Context

- **MT-010-G1:** Only released decisions are shown to client roles.
- **MT-010-G2:** Participant acknowledgement protects family-governance context.
- **MT-010-G3:** Evidence records preserve completion proof after the decision response.

### Blocked-State Context

- **MT-010-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Decision success page and linked evidence record show the completion proof.
- **MT-010-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for richer family approval chains, review scheduling, evidence-backed decision history, and client-facing status clarity.

**Demo-boundary note:** In the current demo, decision screens are navigable and show demo workflow actions. Final decision and evidence package persistence remains incomplete.

**Reader takeaway:** Client decisions begin only after release and should end with traceable proof.

## MT-011 - Review evidence and create a controlled export

**Section:** Evidence, export and data sharing

**Role context:** Clients, Advisors, Compliance, and Privacy roles use this task to inspect proof and share only scoped, redacted, approved evidence.

**Why this task exists:** Evidence and export workflows make proof portable without making all underlying data visible. They help users share the right subset of records while preserving redaction, permission, expiry, and audit controls.

**Why now:** Evidence review and export happen after workflows create proof or after a user needs a controlled package for a specific decision, audit, advisor, or privacy purpose.

**What the user is trying to achieve:** The user is trying to find relevant evidence, choose an export scope, apply redaction, confirm approval, and avoid exposing restricted material.

**Context before steps:** An export is not just a download. It is a controlled disclosure decision that must respect scope, redaction, permission, approval, and expiry.

**What this prevents:**
- unredacted data sharing
- exports outside role scope
- external packages without approval
- sensitive evidence leaving without audit
- expired or overbroad sharing

**What this enables next:**
- client decision packs
- compliance audit packs
- external advisor data rooms
- controlled evidence review
- future export reporting

### Step Context

- **MT-011-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-011-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-011-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-011-S4:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-011-S5:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-011-S6:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-011-S7:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-011-S8:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-016 - Scope and redaction profile:** Scope and redaction profile control what leaves the evidence vault. Downstream use: Export preview, approval, download, expiry, and audit. Risk if wrong or missing: Wrong scope or redaction can expose restricted information.

### Gate And Control Context

- **MT-011-G1:** Scope selection limits what can leave the vault.
- **MT-011-G2:** Redaction protects restricted fields before preview or sharing.
- **MT-011-G3:** Approval and audit controls protect download and share actions.
- **MT-011-G4:** Expiry or revocation prevents old packages from staying valid indefinitely.

### Blocked-State Context

- **MT-011-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Export package is previewed/downloaded only if scope, redaction, permission, and approval allow it.
- **MT-011-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for production-grade data rooms, evidence packages, activity-log exports, privacy review, and auditable disclosure history.

**Demo-boundary note:** In the current demo, evidence and export screens are visual and navigable. Export package generation, file realism, and share-link behavior remain future implementation work.

**Reader takeaway:** Evidence can be shared only when scope, redaction, permission, approval, and audit all line up.

## MT-012 - Manage governance users, roles, and access requests

**Section:** Governance and access

**Role context:** Principals, Admins, Compliance, and Security roles use this task to manage sensitive access without silent privilege changes.

**Why this task exists:** Role and permission changes can expose documents, decisions, evidence, exports, and governance controls. AlphaVest needs access changes to be scoped, confirmed, reviewable, and auditable.

**Why now:** Governance work may happen whenever users join, roles change, access requests appear, or sensitive permissions need review before important workflows continue.

**What the user is trying to achieve:** The user is trying to assign, revoke, approve, deny, or escalate access in a way that preserves tenant scope and audit lineage.

**Context before steps:** Access governance is part of the product safety model. The goal is not merely to add a user, but to make sure the right person receives the right scope for the right reason.

**What this prevents:**
- silent privilege escalation
- cross-tenant access
- unreviewed sensitive permission changes
- external advisors receiving broad access
- role changes without reason or audit

**What this enables next:**
- safe collaboration
- segregation-of-duties review
- access audit history
- future permission governance and security reporting

### Step Context

- **MT-012-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-012-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-012-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-012-S4:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-017 - Role/permission/scope/reason:** Role, permission, scope, and reason explain why sensitive access should change. Downstream use: Access requests, second confirmation, audit history, and security review. Risk if wrong or missing: Missing reason or wrong scope can create silent privilege escalation.

### Gate And Control Context

- **MT-012-G1:** Second confirmation protects sensitive assign, revoke, release, and manage actions.
- **MT-012-G2:** Role and scope checks prevent users from acting outside their tenant or object boundary.
- **MT-012-G3:** Audit history preserves who requested, approved, denied, or changed access.

### Blocked-State Context

- **MT-012-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Access request is approved/denied/escalated and audit history shows lineage.
- **MT-012-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for production access reviews, separation-of-duties controls, delegated administration, and security audit reporting.

**Demo-boundary note:** In the current demo, governance screens and selected demo actions are visible. Fully governed role and access transactions remain incomplete.

**Reader takeaway:** Governance changes should be scoped, confirmed, and auditable before they affect sensitive work.

## MT-013 - Choose a communication or escalation path

**Section:** Communication and escalation

**Role context:** Advisors, Client Success, and Clients use this task to choose the communication path that fits the sensitivity and complexity of the issue.

**Why this task exists:** Not every issue belongs in the same channel. AlphaVest needs a way to distinguish secure messages, data requests, advisor calls, workshops, external specialist handoffs, and compliance escalations.

**Why now:** Communication and escalation become relevant when a workflow cannot move safely with the current data, channel, or risk level.

**What the user is trying to achieve:** The user is trying to choose the least risky communication path that can resolve the issue while preserving evidence and compliance context where material.

**Context before steps:** Choose the communication route based on risk, sensitivity, missing information, and the need for human conversation. The path should fit the work rather than forcing every matter into a single channel.

**What this prevents:**
- advice-like content being sent through the wrong channel
- sensitive messages without evidence links
- complex issues being forced into digital-only handling
- missing follow-up ownership

**What this enables next:**
- data requests
- advisor calls
- workshops
- external specialist escalation
- communication evidence links

### Step Context

- **MT-013-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-013-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-013-S3:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-018 - Channel, recipient, sensitivity, notes:** Channel, recipient, sensitivity, and notes determine the safest communication path. Downstream use: Secure messaging, calls, evidence links, and escalation. Risk if wrong or missing: Wrong channel or recipient can expose sensitive or advice-like content.

### Gate And Control Context

- **MT-013-G1:** Sensitivity and recipient checks protect communication from leaking advice-like or confidential material.
- **MT-013-G2:** Compliance holds protect messages that require review before client visibility.
- **MT-013-G3:** Evidence links preserve material communications where the workflow needs proof.

### Blocked-State Context

- **MT-013-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Communication path or call-trigger state is visible and linked to evidence when material.
- **MT-013-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for communication logs, meeting/call evidence, follow-up ownership, and escalation analytics.

**Demo-boundary note:** In the current demo, communication surfaces are mostly static or navigable. Message and call persistence is not claimed.

**Reader takeaway:** The right communication path reduces risk and makes follow-up work traceable.

## MT-014 - Monitor operations, SLA, and reference state

**Section:** Operations and reference

**Role context:** Ops, Product, QA, and Leads use this task to monitor delivery health and keep workflow language consistent.

**Why this task exists:** Operations users need to see bottlenecks, SLA pressure, roadmap boundaries, and state definitions so the service model can improve without confusing reference material with client workflow.

**Why now:** Ops monitoring runs alongside the product lifecycle because queues, SLA risk, state language, and implementation scope affect how safely the rest of the workflow can scale.

**What the user is trying to achieve:** The user is trying to understand current workload, risk, reference state, and product scope without treating reference pages as client task flows.

**Context before steps:** Use ops and reference pages to understand service health and product scope. These pages are primarily internal controls for monitoring, alignment, and implementation discipline.

**What this prevents:**
- SLA risk being hidden
- state labels being used inconsistently
- reference-only pages being mistaken for client workflows
- roadmap scope being described as implemented behavior

**What this enables next:**
- capacity planning
- QA triage
- workflow consistency reviews
- future queue automation
- clearer roadmap and implementation reporting

### Step Context

- **MT-014-S1:** Opening the entry screen confirms that the user is working in the intended task context before acting.
- **MT-014-S2:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-014-S3:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-014-S4:** Entering or selecting the required data gives later reviewers the context they need to interpret the workflow safely.
- **MT-014-S5:** Reviewing the visible state helps the user spot missing context, blocked controls, or evidence gaps before taking action.

### Field Context

- **F-019 - Queue filter, owner, status, SLA:** Queue filter, owner, status, and SLA help internal teams monitor work and risk. Downstream use: Ops triage, SLA review, state language, and roadmap scope. Risk if wrong or missing: Wrong filtering can hide bottlenecks or misrepresent service health.

### Gate And Control Context

- **MT-014-G1:** Reference-only framing protects users from mistaking product documentation pages for client workflow actions.
- **MT-014-G2:** Queue ownership and SLA status guide operational follow-up.
- **MT-014-G3:** Audit expectations should apply if queue mutations become implemented actions.

### Blocked-State Context

- **MT-014-B1:** This state confirms the intended demo path while preserving the rule that gates cannot be bypassed. Next legitimate action: Bottlenecks, SLA breaches, roadmap scope, and state language are visible for internal use.
- **MT-014-B2:** This state protects the workflow from being forced forward when role, evidence, compliance, data, or implementation conditions are not satisfied. Next legitimate action: Resolve the missing role, evidence, compliance, or data requirement.

**Future-readiness note:** This prepares the workflow for SLA analytics, queue ownership, product health reporting, and cleaner internal operating cadence.

**Demo-boundary note:** In the current demo, operations and reference pages are mostly dashboard or reference surfaces. Queue and SLA mutation is not yet implemented.

**Reader takeaway:** Ops pages help AlphaVest run the system; they are not client-facing advice workflows.
