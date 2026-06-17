# Demo Video Implementation Tasks Detailed V3

Generated: 2026-06-16

Instruction: `Max` / `ENGINE_MIX_V2_V3`

Purpose: detailed implementation task catalogue derived from `DEMO_VIDEO_IMPLEMENTATION_ROADMAP_V3.md`.

Scope of this file: planning artifact only. It does not implement code, UI, schema, seed data, manifests or recordings.

Primary sources:

- `docs/v3/DEMO_VIDEO_IMPLEMENTATION_ROADMAP_V3.md`
- `docs/v3/DEMO_JOURNEY_UNIVERSE_AUDIT_V3.md`
- `docs/v3/DEMO_JOURNEY_OPPORTUNITY_BACKLOG_V3.json`
- `docs/v3/DEMO_SCREENCAST_EXPANSION_RECOMMENDATION_V3.md`
- `docs/v3/journeys.screencast.v3.json`
- `scripts/screencast/lib/types.ts`
- `scripts/screencast/lib/runner.ts`
- `scripts/screencast/lib/journey-fixtures.ts`
- `scripts/screencast/seed-journey.ts`
- `app/api/demo-workflow/route.ts`
- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

## Executive Task Verdict

The work should be implemented as a controlled production programme, not as a direct "make more videos" sprint. The first two phases are infrastructure and refactor phases. Customer-sendable video production only starts after the manifest, fixture, proof-label and current-reality contracts are in place.

## Task Rules

- Preserve the existing `J01-J10` screencast manifest until the P0 portfolio has passed.
- Prefer cloning/splitting current journeys into portfolio manifests over renaming current journeys in place.
- Do not change product UI unless a task explicitly enters an implementation phase and the change is necessary for the approved journey proof.
- Do not claim real auth, real MFA, final financial/legal/tax advice, real binary export generation, production-grade compliance or production-grade authorization.
- Treat route coverage, seed data, static UI and generic audit fallback as different proof levels.
- Every video-worthy task must end with a proof path, caveat, caption metadata and QA command.

## Task Status Vocabulary

| Status | Meaning |
| --- | --- |
| Planned | Not started. |
| Ready | Inputs are available and the task can be picked up. |
| Blocked | Needs a decision or upstream implementation. |
| Done | Acceptance gates passed and docs updated. |

## Proof Level Vocabulary

| Proof Level | Meaning |
| --- | --- |
| PL0 | Idea/plan only. |
| PL1 | Route exists or static visual route exists. |
| PL2 | Screencast definition navigates the route. |
| PL3 | Fixture-backed demo state exists. |
| PL4 | Specific demo workflow handler/action exists. |
| PL5 | Automated test or direct DB/API proof exists. |
| PL6 | Customer-sendable recording passed with captions, metadata and caveats. |

## Phase 0 - Freeze And Portfolio Contract

### DV-00-01 - Accept Portfolio Model As Contract

Goal: make P0/P1/P2/P3 the working model before anyone expands the manifest.

Inputs:

- `DEMO_JOURNEY_OPPORTUNITY_BACKLOG_V3.json`
- `DEMO_VIDEO_IMPLEMENTATION_ROADMAP_V3.md`

Deliverables:

- Short decision note in `docs/v3/`.
- Confirmed portfolio counts: 12 P0, 16 P1, 18 P2, 5 P3.
- Explicit statement that "100 videos now" is rejected.

Acceptance criteria:

- Decision note names the accepted rollout path, preferably MESO B.
- Decision note states which layer is customer-facing first.
- No implementation task treats P2/P3 as mandatory video production.

QA:

- Manual doc review.

Dependencies:

- None.

### DV-00-02 - Define Customer-Sendable Video Policy

Goal: define what makes a clip safe to send to customers.

Inputs:

- Roadmap target-state section.
- Product rules from `AGENTS.md`.

Deliverables:

- A checklist for customer-sendable clips.
- Required metadata fields for customer delivery.
- Required caveat language categories.

Acceptance criteria:

- Checklist includes no real data, no final advice, no real auth, no production compliance claim.
- Checklist references proof path, caption safety and current reality label.
- Checklist is usable before sending a video externally.

QA:

- Manual review against overclaim register.

Dependencies:

- DV-00-01.

### DV-00-03 - Decide Language And Caption Strategy

Goal: choose the language model for videos, metadata and notes.

Inputs:

- Existing `captions.srt` generation behavior.
- Customer/audience expectation.

Deliverables:

- Language decision: English videos, German notes, bilingual metadata or another approved model.
- Caption tone rules: concise, non-technical, no overclaim.
- Speaker-note tone rules: more detailed, evidence-aware, caveat-friendly.

Acceptance criteria:

- Every future manifest entry can point to one caption language and one notes language.
- No task assumes a language different from the decision.

QA:

- Manual review.

Dependencies:

- DV-00-02.

### DV-00-04 - Define Current-Reality Label Taxonomy

Goal: make every claim traceable to implementation maturity.

Inputs:

- Existing E0-E6 maturity scale.
- Proof level vocabulary in this file.

Deliverables:

- A taxonomy for `currentRealityLabel`, for example:
  - `route-static`
  - `fixture-backed`
  - `demo-action-executable`
  - `test-proven`
  - `customer-recording-proven`
  - `policy-frame-only`
  - `metadata-only-export`

Acceptance criteria:

- Labels distinguish route/static, fixture, handler and test proof.
- Labels include special cases for J10 and metadata-only file/export.

QA:

- Compare labels against P0/P1/P2 candidates.

Dependencies:

- DV-00-02.

### DV-00-05 - Define Video-Worthy Gate

Goal: prevent weak route hops from becoming polished videos.

Inputs:

- Roadmap acceptance gates.
- Candidate backlog.

Deliverables:

- Gate checklist with required fields:
  - candidate ID,
  - route sequence,
  - role/tenant,
  - fixture refs,
  - expected proof,
  - handler or static caveat,
  - caption,
  - proof path,
  - QA command.

Acceptance criteria:

- P0 tasks cannot enter recording until all fields are present.
- P1/P2 tasks can explicitly choose "QA artifact, not video."

QA:

- Manual review against several candidates: P0-03, P0-10, P1-02, P2-11.

Dependencies:

- DV-00-04.

## Phase 1 - Screencast Architecture Refactor

### DV-01-01 - Audit Screencast Tooling Entry Points

Goal: document exactly where manifest, fixture and output assumptions live.

Inputs:

- `scripts/screencast/lib/runner.ts`
- `scripts/screencast/run-journey.ts`
- `scripts/screencast/run-all.ts`
- `scripts/screencast/render-mp4.ts`
- `scripts/screencast/seed-journey.ts`
- `scripts/screencast/lib/types.ts`

Deliverables:

- Short tooling audit note.
- List of hard-coded paths.
- List of scripts needing manifest selection support.

Acceptance criteria:

- Audit identifies `docs/v3/journeys.screencast.v3.json` hard-code.
- Audit identifies output metadata/run-log points.
- Audit identifies seed fixture lookup assumptions.

QA:

- No code required for this task.
- Optional `pnpm screencast:dry-run` baseline.

Dependencies:

- Phase 0 accepted.

### DV-01-02 - Add Manifest Selection Contract

Goal: allow the runner to load legacy and portfolio manifests explicitly.

Affected files likely:

- `scripts/screencast/lib/runner.ts`
- `scripts/screencast/run-journey.ts`
- `scripts/screencast/run-all.ts`
- `scripts/screencast/render-mp4.ts`
- `scripts/screencast/seed-journey.ts`
- `package.json` if scripts are added.

Deliverables:

- CLI and/or env option for manifest path, for example `--manifest=docs/v3/journeys.screencast.p0.v3.json` or `SCREENCAST_MANIFEST=...`.
- Default remains legacy `docs/v3/journeys.screencast.v3.json`.
- Manifest path recorded in run metadata.

Acceptance criteria:

- Existing commands work without new args.
- New command can dry-run a supplied manifest.
- Invalid manifest path fails with a clear error.

QA:

- `pnpm typecheck`
- `pnpm screencast:dry-run`
- Dry-run with explicit legacy manifest.

Dependencies:

- DV-01-01.

### DV-01-03 - Extend Screencast Definition Types For Portfolio Metadata

Goal: add metadata needed for customer delivery and proof traceability.

Affected files likely:

- `scripts/screencast/lib/types.ts`
- `scripts/screencast/lib/runner.ts`
- optional schema/validation helper under `scripts/screencast/lib/`.

Fields to add or support:

- `portfolioLayer`
- `candidateId`
- `legacyJourneyIds`
- `demoPriority`
- `audienceFit`
- `currentRealityLabel`
- `proofLevel`
- `overclaimRisk`
- `caveat`
- `proofPath`
- `captionShort`
- `captionLong`
- `presenterNotes`

Acceptance criteria:

- Metadata is optional for legacy J01-J10 but required for new P0/P1 manifests.
- Validation errors name the missing field and journey ID.
- Run metadata includes the portfolio fields.

QA:

- `pnpm typecheck`
- Unit or script-level validation of one valid and one invalid manifest.

Dependencies:

- DV-01-02.

### DV-01-04 - Create Legacy-To-Portfolio Compatibility Map

Goal: keep traceability from J01-J10 to P0/P1/P2.

Deliverables:

- New docs or JSON artifact, for example `docs/v3/DEMO_JOURNEY_LEGACY_TO_PORTFOLIO_MAP_V3.json`.
- Mapping from each `J01-J10` to target P0/P1/P2 IDs.

Required mappings:

- J01 -> P0-06, P0-07, P2-07, P2-08
- J02 -> P0-08, P0-09, P2-01, P2-15
- J03 -> P0-10, P1-01, P1-15, P2-09, P2-10
- J04 -> P0-04, P1-10, P2-05, P2-06
- J05 -> P0-05, P2-16, P2-17
- J06 -> P0-02, P0-03, P2-14
- J07 -> P0-12, P1-13, P1-14, P2-13
- J08 -> P0-11, P1-11, P2-03, P2-11, P2-12
- J09 -> P0-04, P1-16
- J10 -> P0-01, P1-12

Acceptance criteria:

- Every legacy journey maps to at least one portfolio candidate.
- Every P0 candidate maps either to legacy or explicitly "new".
- J10 is marked with overclaim caveat.

QA:

- JSON parse check if JSON.

Dependencies:

- DV-01-03.

### DV-01-05 - Add Caption Metadata Contract

Goal: separate app UI from explanatory demo narration.

Deliverables:

- Metadata schema or JSON-like contract under `docs/v3/`.
- Required fields:
  - `journeyId`
  - `candidateId`
  - `captionShort`
  - `captionLong`
  - `presenterNotes`
  - `currentRealityLabel`
  - `proofPath`
  - `overclaimRisk`
  - `caveat`
  - `customerSendable`

Acceptance criteria:

- Metadata can generate or validate captions/notes without adding UI overlays.
- Contract explicitly forbids spec panels/dev notes as app UI.

QA:

- Manual schema review.

Dependencies:

- DV-01-03.

### DV-01-06 - Add Portfolio Manifest Validation

Goal: catch missing proof/caveat fields before live recording.

Deliverables:

- Validation command or runner validation branch.
- Checks for P0/P1:
  - candidate ID exists in backlog,
  - portfolio layer is valid,
  - proof level/current reality/caveat present,
  - no missing caption,
  - fixture required when provisioning is required,
  - no route outside registry unless explicitly allowed.

Acceptance criteria:

- Legacy manifest still validates with legacy rules.
- P0/P1 manifests validate with stricter rules.
- Invalid P0 manifest fails before browser launch.

QA:

- `pnpm typecheck`
- valid/invalid manifest validation.

Dependencies:

- DV-01-03, DV-01-04, DV-01-05.

### DV-01-07 - Normalize Run Output Naming

Goal: make recorded assets easy to ship and trace.

Deliverables:

- Run output path includes run ID and journey ID as today.
- Metadata includes portfolio layer and manifest path.
- Optional delivery-copy naming convention:
  - `AlphaVest_P0-01_policy_no_advice_baseline.mp4`
  - matching `.srt`, `.md`, `.json`.

Acceptance criteria:

- Existing artifact paths continue to work.
- New customer bundle naming can be generated without manual renaming.

QA:

- Run dry-run and inspect metadata output.

Dependencies:

- DV-01-02, DV-01-03.

### DV-01-08 - Update Screencast Runbook For Portfolio Mode

Goal: document how to run legacy, P0 and selected P1/P2 manifests.

Affected files:

- `docs/v3/SCREENCAST_RUNBOOK_V3.md`
- possibly `docs/v3/SCREENCAST_AUTOMATION_PLAN_V3.md`

Acceptance criteria:

- Runbook shows legacy command.
- Runbook shows explicit P0 manifest command.
- Runbook explains dry-run, qa-fast, human-demo, MP4 render and proof output.
- Runbook states no final advice/real auth caveat.

QA:

- Manual command review.

Dependencies:

- DV-01-02.

### DV-01-09 - Phase 1 Regression Gate

Goal: prove architecture refactor did not break existing videos.

Commands:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm screencast:dry-run`
- explicit dry-run with legacy manifest
- `pnpm visual:contract`

Acceptance criteria:

- Legacy J01-J10 dry-run still passes.
- New manifest validation path works.
- QA reports are updated.

Dependencies:

- DV-01-02 through DV-01-08.

## Phase 2 - Legacy Journey Refactor Into P0

### DV-02-01 - Scaffold P0 Manifest

Goal: create the initial P0 manifest with 12 journey entries.

Likely file:

- `docs/v3/journeys.screencast.p0.v3.json`

Deliverables:

- 12 P0 journey shells.
- Each shell has candidate ID, name, role, tenant, start route, end state, demo session, preconditions, risk notes and metadata.
- No final live recording yet.

Acceptance criteria:

- P0 manifest parses and passes strict portfolio validation.
- P0-01 through P0-12 are all represented.
- Each P0 entry points to legacy source or marks itself as new.

QA:

- P0 manifest dry-run or validation-only command.

Dependencies:

- Phase 1 complete.

### DV-02-02 - Refactor P0-01 Platform Policy Baseline

Source:

- Legacy J10.

Goal:

- Keep J10 as opening policy frame without overstating persistence.

Task details:

- Clone relevant J10 route sequence into P0-01.
- Include routes `/admin/platform`, `/admin/policies/advice-boundary`, `/admin/roles`, `/admin/security`, `/admin/evidence-templates`, `/admin/export-templates`.
- Set `currentRealityLabel` to `policy-frame-only` unless dedicated `j10.*` handlers are implemented later.
- Caption thesis: "No unapproved advice reaches the client; platform policies define the gate."
- Caveat: "This clip frames the policy model; policy/security persistence requires dedicated handler proof."

Acceptance criteria:

- P0-01 does not claim persisted policy/security changes.
- P0-01 metadata references J10 and the J10 caveat.
- P0-01 can dry-run without breaking legacy J10.

QA:

- P0 manifest validation.

Dependencies:

- DV-02-01.

### DV-02-03 - Refactor P0-02 Tenant Setup And Invitation

Source:

- Legacy J06.

Goal:

- Keep the tenant setup story as the first concrete data setup step.

Task details:

- Clone J06 steps for tenant setup, team, policies, users and invite.
- Keep Morgan fixture and J06 handler proof.
- Caption thesis: "A tenant becomes demo-ready before any client advice workflow begins."
- Caveat: "Invitation delivery and real authentication remain demo-mode."

Acceptance criteria:

- P0-02 points to J06 fixture.
- J06 mutation proof is referenced.
- No claim of real email delivery or real auth.

QA:

- `pnpm screencast:seed-journey -- J06 --dry-run`
- P0 manifest validation.

Dependencies:

- DV-02-01.

### DV-02-04 - Create P0-03 User Onboarding, Consent And Role Confirmation

Source:

- New P0 candidate.
- Extends J06.

Goal:

- Close the missing UF-03 route gap.

Task details:

- Add route sequence: `/login`, `/mfa`, `/onboarding/invite`, `/onboarding/identity`, `/onboarding/consent`, `/onboarding/role-confirmation`.
- Create a fixture contract for invited user, identity review, consent and role confirmation.
- Use explicit no-real-auth labels.
- Decide whether this is static route proof first or needs dedicated demo workflow actions.

Acceptance criteria:

- P0-03 has fixture refs or clear route-static caveat.
- No production MFA/auth claim.
- Consent state is visible in notes/metadata.

QA:

- Route smoke for all onboarding routes.
- P0 manifest validation.
- Optional handler test if actions are added.

Dependencies:

- DV-02-03.

### DV-02-05 - Refactor P0-04 Profile, Documents And Data Quality

Source:

- Legacy J09 + J04.

Goal:

- Create one narrative clip that shows trustworthy input collection.

Task details:

- Combine route logic from profile/family/relationships and document intake.
- Decide whether to make one longer P0 clip or two P0 subclips assembled in playlist.
- Reference Bennett profile/family proof and Morgan document proof honestly.
- Add data-quality note if route/state is shown.
- Avoid making AI extraction sound final.

Acceptance criteria:

- P0-04 clearly says profile/docs are input evidence, not advice.
- J04/J09 proof paths are referenced.
- Low-confidence/unsupported file cases are reserved for P2.

QA:

- `pnpm screencast:seed-journey -- J04 --dry-run`
- `pnpm screencast:seed-journey -- J09 --dry-run`
- P0 manifest validation.

Dependencies:

- DV-02-01.

### DV-02-06 - Refactor P0-05 Entities, Wealth Map And Action Readiness

Source:

- Legacy J05.

Goal:

- Show structure/action readiness while preserving no-advice boundary.

Task details:

- Clone J05 success/action path into P0-05.
- Keep blocked ready/request-info as proof in notes or P2 tasks.
- Caption thesis: "Structure and action boards guide work, but evidence gates still control readiness."
- Caveat: static UI still may not render every Prisma update.

Acceptance criteria:

- P0-05 includes action gate language.
- P2-16/P2-17 remain separate negative proof candidates.

QA:

- `pnpm screencast:seed-journey -- J05 --dry-run`
- P0 manifest validation.

Dependencies:

- DV-02-01.

### DV-02-07 - Split J01 Into P0-06 Signal Request And Routing

Source:

- Legacy J01 steps 1-4.

Goal:

- Make analyst signal handling a focused clip.

Task details:

- P0-06 should end before advisor approval.
- Include signal queue, request data, workbench readiness and route to advisor.
- Caption thesis: "Signals stay internal until reviewed and routed."
- Do not show or imply client release.

Acceptance criteria:

- P0-06 excludes advisor approval step if P0-07 owns it.
- Metadata references J01 handler proof.

QA:

- J01 seed dry-run.
- P0 manifest validation.

Dependencies:

- DV-02-01.

### DV-02-08 - Split J01 Into P0-07 Advisor Approval Without Release

Source:

- Legacy J01 advisor steps.

Goal:

- Make the central rule visible: advisor approval alone is not enough.

Task details:

- Start at advisor queue or advisor detail.
- Click/record advisor approval.
- End with compliance still required and client visibility still blocked.
- Caption thesis: "Human review is required, but advisor approval still does not release to the client."

Acceptance criteria:

- P0-07 has explicit blocked client visibility text/metadata.
- Does not include compliance release.
- P0-07 proof points to `j01.approveAdvisor`.

QA:

- J01 seed dry-run.
- P0 manifest validation.

Dependencies:

- DV-02-07.

### DV-02-09 - Split J02 Into P0-08 Compliance Request/Block

Source:

- Legacy J02 request/block paths.

Goal:

- Show that compliance can stop unsafe release.

Task details:

- Include compliance review, request evidence and block release.
- End with client visibility still off.
- Caption thesis: "Compliance can require evidence or block release before the client sees anything."

Acceptance criteria:

- P0-08 excludes successful release.
- Metadata references J02 request/block handler proof.
- Current reality labels distinguish request evidence vs block.

QA:

- `pnpm screencast:seed-journey -- J02 --dry-run`
- `pnpm test:workflow-api`

Dependencies:

- DV-02-01.

### DV-02-10 - Split J02 Into P0-09 Compliance Release

Source:

- Legacy J02 release path.

Goal:

- Show the moment client visibility is allowed.

Task details:

- Use Summit fixture or the known releasable fixture.
- Include evidence validated/advisor approved/compliance release condition.
- End with client-visible decision available.
- Caption thesis: "Client visibility is created only after compliance release."

Acceptance criteria:

- P0-09 does not imply advisor alone released it.
- Metadata references workflow gate proof.
- Release path is separate from block path.

QA:

- `pnpm test:workflow-api`
- J02 seed dry-run.

Dependencies:

- DV-02-09.

### DV-02-11 - Refactor P0-10 Client Decision And Evidence

Source:

- Legacy J03 plus `/evidence`.

Goal:

- Complete the client decision loop with evidence.

Task details:

- Add `/evidence` index entry before `/evidence/demo` if route is ready.
- Keep accept path as primary P0.
- Move defer/reject/request-more-info into P2 metadata or separate future clips.
- Caption thesis: "The client acts only on released advice and can trace the evidence."

Acceptance criteria:

- P0-10 includes evidence vault or caveats if index is route-only.
- J03 accept/evidence view/download proof is referenced.
- Client alternatives are not hidden; they are noted as P2.

QA:

- J03 seed dry-run.
- P0 manifest validation.

Dependencies:

- DV-02-10.

### DV-02-12 - Refactor P0-11 Export, Redaction And Download

Source:

- Legacy J08.

Goal:

- Show controlled export without implying real binary package generation.

Task details:

- Clone J08 scope/redaction/approval/download/share path.
- Use `metadata-only-export` label.
- Caption thesis: "Export is scoped, redacted, approved and audited before sharing."
- Caveat: "This is metadata/package-manifest proof, not real binary export generation."

Acceptance criteria:

- Metadata includes file/export realism caveat.
- J08 proof path references export package service/tests.

QA:

- `pnpm test:file-export`
- J08 seed dry-run.

Dependencies:

- DV-02-01.

### DV-02-13 - Refactor P0-12 Governance Access And Audit

Source:

- Legacy J07.

Goal:

- Show access control and audit as the safety proof after export/decision.

Task details:

- Clone J07 invite, role change, access approval and audit export control.
- Keep deny/revoke as P2.
- Caption thesis: "Sensitive access changes are scoped, confirmed and audited."

Acceptance criteria:

- Metadata references Northbridge fixture alignment.
- Caveat notes demo auth/permission engine limitations.

QA:

- `pnpm test:permissions`
- J07 seed dry-run.

Dependencies:

- DV-02-01.

### DV-02-14 - Phase 2 P0 Manifest Gate

Goal: prove the P0 manifest is structurally complete before missing-readiness work.

Acceptance criteria:

- 12 P0 entries exist.
- Every entry has candidate metadata, proof level, caveat and source proof.
- Legacy J01-J10 manifest still dry-runs.
- P0 manifest validates.

QA:

- `pnpm typecheck`
- `pnpm screencast:dry-run`
- explicit P0 manifest validation/dry-run.

Dependencies:

- DV-02-01 through DV-02-13.

## Phase 3 - Missing P0 Readiness

### DV-03-01 - Add P0-03 Fixture Contract

Goal: make onboarding/consent demo-state explicit.

Affected likely:

- `scripts/screencast/lib/journey-fixtures.ts`
- seed or fixture validation if needed.

Deliverables:

- Fixture for invited user, identity, consent and role confirmation.
- Form inputs for consent and role acknowledgement.
- Expected mutations or explicit route-static caveat.

Acceptance criteria:

- Fixture dry-run validates.
- Real auth remains out of scope.

QA:

- `pnpm screencast:seed-journey -- P0-03 --dry-run` or equivalent once portfolio IDs are supported.

Dependencies:

- DV-02-04.

### DV-03-02 - Decide And Implement P0-03 Action Depth

Goal: decide whether onboarding needs handler proof now.

Options:

- Route/static only with caveat.
- Generic audit action.
- Dedicated `p0.onboarding.*` or `j06/onboarding.*` demo workflow actions.

Recommended decision:

- Use dedicated demo actions only if the final video caption claims completion of consent/role acknowledgement.

Acceptance criteria:

- Decision is documented.
- Handler is implemented only if required by claim.
- No production auth is introduced.

QA:

- If handler added: workflow API test.
- If no handler: metadata caveat required.

Dependencies:

- DV-03-01.

### DV-03-03 - Add Evidence Vault Index Proof For P0-10

Goal: avoid jumping directly to `/evidence/demo` without proving the vault concept.

Affected likely:

- P0 manifest.
- Metadata/caption records.
- Fixture refs may reuse J03 evidence record.

Deliverables:

- P0-10 route sequence includes `/evidence`.
- Expected visible text for evidence vault route.
- Current reality label for vault index.

Acceptance criteria:

- `/evidence` route appears in P0-10 or P1-01 with clear proof path.
- Evidence access/download still points to J03 handler proof.

QA:

- Route smoke.
- P0 dry-run.

Dependencies:

- DV-02-11.

### DV-03-04 - Decide Mobile Placement

Goal: decide whether `/mobile` becomes P0 or stays P1-16.

Inputs:

- Customer demo story.
- P1-16 backlog entry.

Decision criteria:

- Include in P0 if customers will receive mobile-first demo snippets.
- Keep P1 if P0 should stay desktop governance story.

Acceptance criteria:

- Decision recorded in P0/P1 manifest metadata.
- No duplicate mobile clip unless there is a different audience purpose.

QA:

- Manual review.

Dependencies:

- DV-02-05.

### DV-03-05 - Add Mobile Safe Next-Step Fixture/Metadata

Goal: make mobile route useful instead of a route-only extra.

Task details:

- Define blocked recommendation, next-step today and missing-doc status for mobile.
- Add fixture refs if used in a video.
- Add caveat if mobile is route/static only.

Acceptance criteria:

- Mobile metadata explains client-safe visibility.
- No unreleased recommendation appears as client action.

QA:

- Route smoke.
- P1/P0 manifest validation.

Dependencies:

- DV-03-04.

### DV-03-06 - Decide J10 Handler Upgrade

Goal: choose between real demo action proof and policy-frame caveat.

Options:

- Keep P0-01 as policy frame.
- Add dedicated `j10.*` handlers for policy/security/template updates.

Recommended:

- Keep policy-frame for first P0 release unless a customer/investor needs policy update persistence.

Acceptance criteria:

- P0-01 metadata is unambiguous.
- If handlers are deferred, no caption claims policy/security persistence.

QA:

- Manual metadata review.

Dependencies:

- DV-02-02.

### DV-03-07 - Add Current-Reality Metadata To All P0 Entries

Goal: avoid accidental overclaim during recording and delivery.

Deliverables:

- `currentRealityLabel` and `proofLevel` for P0-01 through P0-12.
- `overclaimRisk` and `caveat` for each.

Acceptance criteria:

- J10 has special caveat.
- J08 has metadata-only export caveat.
- P0-03 has no-real-auth caveat.
- P0-04/J04 has no real file upload/storage caveat.

QA:

- Portfolio manifest validation.

Dependencies:

- DV-03-01 through DV-03-06.

### DV-03-08 - Phase 3 Readiness Gate

Goal: prove P0 is ready for final customer recording.

Acceptance criteria:

- P0 manifest validates.
- New P0 fixtures validate or carry approved static caveats.
- Legacy J01-J10 still dry-runs.
- No P0 clip lacks caption/caveat/proof path.

QA:

- `pnpm typecheck`
- `pnpm test:workflow-api`
- `pnpm test:permissions`
- `pnpm visual:contract`
- P0 dry-run.

Dependencies:

- DV-03-01 through DV-03-07.

## Phase 4 - P0 Customer Video Production

### DV-04-01 - P0 Dry-Run And Selector Stabilization

Goal: catch route, text and locator issues before recording.

Deliverables:

- Dry-run result for all P0 journeys.
- List of missing visible text or locator issues.
- Fix plan for any unstable steps.

Acceptance criteria:

- P0 dry-run completes without validation errors.
- Any known static/manual step is justified in metadata.

QA:

- P0 dry-run command.

Dependencies:

- Phase 3 readiness gate.

### DV-04-02 - P0 QA-Fast Live Recording Pass

Goal: validate interactions quickly before human-demo recording.

Deliverables:

- QA-fast run root.
- `qa-result.json`, screenshots, transcripts and run logs for P0.

Acceptance criteria:

- 12/12 P0 clips pass or documented failures are fixed before next task.
- 0 click fallback warnings.
- 0 missing expected text.

QA:

- P0 live run with `--speed=qa-fast`.

Dependencies:

- DV-04-01.

### DV-04-03 - P0 Human-Demo Recording Pass

Goal: generate the customer-sendable pacing version.

Deliverables:

- Human-demo run root.
- MP4s or raw videos for 12 P0 clips.

Acceptance criteria:

- 12/12 P0 clips pass.
- No visible debug/spec UI.
- Cursor/captions render correctly.

QA:

- P0 live run with `--speed=human-demo`.

Dependencies:

- DV-04-02.

### DV-04-04 - Render And Verify P0 MP4s

Goal: produce final video files.

Deliverables:

- `journey.mp4` for each P0 clip.
- `captions.srt` for each clip.
- Render status metadata.

Acceptance criteria:

- Captions are burned in or explicitly available.
- MP4s exist and are playable.
- File names can be mapped to customer index.

QA:

- `pnpm screencast:mp4` or manifest-aware equivalent.
- Spot-check MP4 duration and first/last frames.

Dependencies:

- DV-04-03.

### DV-04-05 - Caption And Speaker Notes Review

Goal: make the videos safe to send.

Deliverables:

- Reviewed captions.
- Reviewed speaker notes.
- Caveat checklist signed off.

Acceptance criteria:

- No forbidden claims.
- Captions are short enough for video.
- Speaker notes contain proof/caveat context.

QA:

- Manual review against customer-sendable policy.

Dependencies:

- DV-04-04.

### DV-04-06 - Create 5/15/30 Minute Playlist Scripts

Goal: make the same video library usable in different demo lengths.

Deliverables:

- `docs/v3/DEMO_VIDEO_PLAYLISTS_V3.md` or equivalent.
- 5-minute sequence.
- 15-minute sequence.
- 30-minute sequence.
- Optional compliance/investor deep-dive sequence.

Acceptance criteria:

- Each playlist references P0 clip IDs.
- Each playlist has story thesis and stop points.
- 5-minute version is not overloaded.

QA:

- Manual review.

Dependencies:

- DV-04-05.

### DV-04-07 - Create P0 Customer Delivery Index

Goal: create a customer-facing inventory.

Deliverables:

- Delivery index with clip title, audience fit, duration, one-line description, caveat and file path.

Acceptance criteria:

- Customer can understand the bundle without repo context.
- Internal proof links remain available but not distracting.

QA:

- Manual review.

Dependencies:

- DV-04-06.

### DV-04-08 - P0 Release Gate

Goal: approve or reject external sharing.

Acceptance criteria:

- 12 P0 videos passed.
- Captions reviewed.
- Customer delivery index complete.
- QA reports updated.
- No unresolved P0 blocker remains.

QA:

- `pnpm visual:contract`
- Relevant screencast QA summaries.
- Manual release checklist.

Dependencies:

- DV-04-01 through DV-04-07.

## Phase 5 - P1 Trust Proof Expansion

### DV-05-01 - Select P1 Wave 1 Clips

Goal: choose which P1 candidates become videos first.

Recommended Wave 1:

- P1-01 evidence vault browse.
- P1-15 evidence download audited.
- P1-16 mobile next-step blocked recommendation.
- P1-02 communication path selection.
- P1-03 call trigger matrix.
- P1-13 permission matrix / second confirmation.

Acceptance criteria:

- Selection is documented.
- Each selected P1 candidate has stakeholder question and proof level.

QA:

- Manual review.

Dependencies:

- P0 release gate or parallel approval.

### DV-05-02 - Implement P1-01 Evidence Vault Browse

Goal: create a trust-proof clip around `/evidence`.

Task details:

- Add P1 manifest entry.
- Reuse J03 evidence record.
- Show vault index and evidence detail.
- Keep download audit for P1-15 if split.

Acceptance criteria:

- Vault route is no longer uncovered in demo library.
- Proof label distinguishes index route from J03 detail handler.

QA:

- P1 dry-run.
- Route smoke.

Dependencies:

- DV-03-03.

### DV-05-03 - Implement P1-15 Evidence Download Audited

Goal: prove evidence access is audited.

Task details:

- Use J03 evidence view/download handler proof.
- Create concise clip or append to P1-01.
- Caption should say "download/view is audited," not "complete audit product."

Acceptance criteria:

- Audit event proof path included.
- No restricted evidence overclaim.

QA:

- `pnpm test:workflow-api`
- P1 dry-run/live if video.

Dependencies:

- DV-05-02.

### DV-05-04 - Implement P1-16 Mobile Safe Next Step

Goal: show client-safe mobile route.

Task details:

- Use `/mobile`.
- Show blocked recommendation or safe next step.
- Explicitly state no unreleased advice appears.

Acceptance criteria:

- Mobile route has fixture or approved static caveat.
- Caption avoids production-mobile claims.

QA:

- Route smoke.
- P1 dry-run/live if video.

Dependencies:

- DV-03-04, DV-03-05.

### DV-05-05 - Implement P1-02 Communication Path Selection

Goal: cover PF-H communication.

Task details:

- Add `/communication` and `/communication/call-trigger`.
- Decide if route/static, generic audit, or dedicated communication handler.
- Metadata must not claim message persistence unless handler exists.

Acceptance criteria:

- Communication route coverage gap is closed.
- Human escalation story is tied to advisor/compliance decision safely.

QA:

- Route smoke.
- P1 dry-run.
- Handler test if implemented.

Dependencies:

- P1 selection.

### DV-05-06 - Implement P1-03 Call Trigger Matrix

Goal: show escalation rules without inventing persistence.

Task details:

- Use `/communication/call-trigger`.
- Show digital, call, face-to-face or specialist escalation states if available.
- Add caveat if static.

Acceptance criteria:

- Clip answers "when does human escalation happen?"
- Does not create advice release.

QA:

- P1 dry-run.

Dependencies:

- DV-05-05.

### DV-05-07 - Implement P1-13 Permission Matrix / Second Confirmation

Goal: deepen governance trust proof.

Task details:

- Use existing J07 role-change proof and permission tests.
- Include second-confirmation behavior.
- Optional route sequence includes `/admin/roles`, `/governance/roles`, `/governance/access-requests`.

Acceptance criteria:

- Shows sensitive access is not silent.
- References permission test proof.

QA:

- `pnpm test:permissions`
- P1 dry-run/live if video.

Dependencies:

- P0-12 available.

### DV-05-08 - Implement P1-04/P1-05 Ops Queues And SLA Appendix

Goal: cover PF-J operations gap.

Task details:

- Add `/ops/queues` and `/ops/sla`.
- Treat as appendix unless a customer asks for operations workflow.
- Use QueueItem/SLA state if available; otherwise route-static caveat.

Acceptance criteria:

- Ops route gap is covered in P1/P3.
- No client-facing advice claim.

QA:

- Route smoke.
- P1 dry-run if video.

Dependencies:

- P1 selection.

### DV-05-09 - Implement P1-09 Data Quality Readiness Proof

Goal: connect data quality to demo trust.

Task details:

- Use data-quality service proof.
- Tie to profile/docs readiness.
- Decide whether video or proof artifact.

Acceptance criteria:

- Data quality proof has test path.
- Clip/artifact does not duplicate P0-04.

QA:

- `pnpm test:data-quality`

Dependencies:

- P0-04 available.

### DV-05-10 - Implement P1-10 File Metadata Proof

Goal: support document intake realism.

Task details:

- Use Phase 18 file metadata validation.
- Use J04 as visual source if needed.
- Make clear this is metadata validation, not real object storage.

Acceptance criteria:

- File safety proof is documented.
- Unsupported file path remains P2 unless promoted.

QA:

- `pnpm test:file-export`

Dependencies:

- P0-04 available.

### DV-05-11 - Implement P1-11 Export Package Manifest Proof

Goal: support export realism caveat.

Task details:

- Use export package service/test proof.
- Connect to P0-11.
- State metadata-only boundary.

Acceptance criteria:

- Export package proof distinguishes manifest from binary archive.

QA:

- `pnpm test:file-export`

Dependencies:

- P0-11 available.

### DV-05-12 - Implement P1-14 Audit Export Controlled

Goal: deepen governance/audit appendix.

Task details:

- Use J07 audit export proof.
- Add route sequence around `/governance/audit-history`.
- Do not imply complete audit-export product if handler scope is narrower.

Acceptance criteria:

- Audit export is shown as controlled, not freely downloadable.

QA:

- J07 seed dry-run.
- P1 dry-run if video.

Dependencies:

- P0-12 available.

### DV-05-13 - Keep P1-06/P1-07/P1-08 As Reference Appendix

Goal: prevent service blueprint/roadmap/states from bloating video production.

Task details:

- Create appendix entries in delivery/proof index.
- Do not record by default.
- Use them to explain scope/state language in notes.

Acceptance criteria:

- `/service-blueprint`, `/roadmap`, `/states` are covered as appendix/reference.
- They are not mistaken for customer workflow proof.

QA:

- Route smoke.
- Manual docs review.

Dependencies:

- P1 structure.

### DV-05-14 - Decide P1-12 Tenant Policy Override

Goal: decide whether J10 policy gap should be upgraded.

Task details:

- If J10 handlers are added, create P1-12.
- If not, keep it as future/deferred.

Acceptance criteria:

- No policy override video without dedicated proof.

QA:

- Handler test if implemented.

Dependencies:

- DV-03-06.

### DV-05-15 - Phase 5 Trust Proof Gate

Goal: approve P1 clips/artifacts.

Acceptance criteria:

- Selected P1 clips have proof paths.
- P1 does not duplicate P0.
- P1 notes are suitable for diligence follow-up.

QA:

- Relevant tests:
  - `pnpm test:data-quality`
  - `pnpm test:file-export`
  - `pnpm test:permissions`
  - selected live runs.

Dependencies:

- DV-05-01 through DV-05-14.

## Phase 6 - P2/P3 Proof Library

### DV-06-01 - Build P2 Candidate Proof Matrix

Goal: make all 18 P2 cases trackable without recording all of them.

Deliverables:

- Matrix with candidate, route, role, blocked action, proof path, video promotion decision.

Acceptance criteria:

- 18/18 P2 candidates are represented.
- Each candidate is marked `test-only`, `artifact`, `promote-to-video` or `defer`.

QA:

- Manual backlog parity check against JSON.

Dependencies:

- P1/P0 structure.

### DV-06-02 - Promote P2-01 Principal Cannot Release Recommendation

Goal: produce high-stakes visual or QA proof for release authority.

Acceptance criteria:

- Principal release attempt is denied.
- Denied audit proof exists.
- Clip only if stakeholder-facing proof is needed.

QA:

- `pnpm test:permissions`

Dependencies:

- DV-06-01.

### DV-06-03 - Promote P2-02 Cross-Tenant Access Denied

Goal: prove tenant isolation.

Acceptance criteria:

- Cross-tenant deny is proven.
- No real customer data used.
- Prefer test/proof artifact unless requested as video.

QA:

- `pnpm test:permissions`

Dependencies:

- DV-06-01.

### DV-06-04 - Promote P2-03 External Advisor Export Denied

Goal: prove export role boundary.

Acceptance criteria:

- Forbidden export role denial is tested.
- Caveat distinguishes demo authorization from production auth.

QA:

- `pnpm test:permissions`

Dependencies:

- DV-06-01.

### DV-06-05 - Promote P2-05 Unsupported File Upload Blocked

Goal: prove file metadata gate.

Acceptance criteria:

- Unsupported/unsafe file metadata is rejected.
- No real file/malware scanning claim.

QA:

- `pnpm test:file-export`

Dependencies:

- DV-05-10.

### DV-06-06 - Promote P2-06 Low-Confidence Extraction Requires Review

Goal: prove AI extraction is draft/human-reviewed.

Acceptance criteria:

- Low-confidence or pending review state is fixture-backed.
- No final AI evidence claim.

QA:

- J04 handler/test proof or dedicated fixture validation.

Dependencies:

- DV-05-10.

### DV-06-07 - Promote P2-09/P2-10 Client Defer/Reject

Goal: prove client agency and non-coercive decision design.

Acceptance criteria:

- Defer and reject actions are executable or clearly fixture-backed.
- Evidence/audit proof exists.

QA:

- `pnpm test:workflow-api`

Dependencies:

- P0-10.

### DV-06-08 - Promote P2-11/P2-12 Export Block And Share Expiry

Goal: prove export success path has real stop states.

Acceptance criteria:

- Export without approval is blocked.
- Share expiry is fixture-backed or deferred with caveat.

QA:

- `pnpm test:file-export`
- Additional handler test if share expiry is implemented.

Dependencies:

- P0-11, P1-11.

### DV-06-09 - Promote P2-13 Access Denied/Revoke

Goal: prove access can be denied or removed.

Acceptance criteria:

- Access denial/revoke path has test or handler proof.
- Audit event exists where sensitive.

QA:

- `pnpm test:permissions`

Dependencies:

- P0-12, P1-13.

### DV-06-10 - Handle P2-14 Through P2-18 As QA-First Cases

Goal: cover remaining edge cases without forcing videos.

Candidates:

- P2-14 expired invite / declined consent.
- P2-15 compliance exception path.
- P2-16 blocked action remains client-safe.
- P2-17 evidence missing blocks mark-ready.
- P2-18 unknown route/loading/error hardening.

Acceptance criteria:

- Each candidate has artifact/test/defer decision.
- No video is made unless promoted with a stakeholder reason.

QA:

- Relevant route, workflow, permission and visual checks.

Dependencies:

- DV-06-01.

### DV-06-11 - Build P3-01 Route Smoke Coverage Artifact

Goal: preserve exhaustive route coverage as test proof.

Acceptance criteria:

- 63 route smoke coverage remains passing.
- Artifact links to latest route smoke run.

QA:

- `pnpm test:route-smoke`

Dependencies:

- None beyond current test setup.

### DV-06-12 - Build P3-02 Route x State x Role Matrix

Goal: document route/state/role combinations without video bloat.

Deliverables:

- Matrix file under `docs/v3/` or generated artifact.

Acceptance criteria:

- Matrix distinguishes allowed, blocked, route-only and not implemented.

QA:

- Manual review and optional script validation.

Dependencies:

- Route registry and backlog.

### DV-06-13 - Build P3-03 Permission Denial Matrix

Goal: summarize denial coverage.

Acceptance criteria:

- Cross-tenant, release, export and internal-only denial cases are represented.
- Each row links to test or proof.

QA:

- `pnpm test:permissions`

Dependencies:

- Permission tests.

### DV-06-14 - Build P3-04 Evidence/Audit Lifecycle Matrix

Goal: trace important actions to evidence and audit objects.

Acceptance criteria:

- Matrix covers P0 and selected P1/P2 actions.
- Marks generic audit fallback separately from specific domain proof.

QA:

- Manual review against route handler and QA report.

Dependencies:

- P0/P1 manifests.

### DV-06-15 - Build P3-05 Visual Contract Bundle

Goal: keep visual integrity separate from story videos.

Acceptance criteria:

- Visual contract passes.
- Bundle notes clean UI and forbidden chrome checks.

QA:

- `pnpm visual:contract`

Dependencies:

- Current visual contract scripts.

### DV-06-16 - Phase 6 Proof Library Gate

Goal: approve P2/P3 as proof assets.

Acceptance criteria:

- P2 matrix complete.
- P3 artifacts complete.
- Promoted P2 videos are explicitly selected and not accidental.

QA:

- `pnpm test:route-smoke`
- `pnpm test:permissions`
- `pnpm test:workflow-api`
- `pnpm visual:contract`

Dependencies:

- DV-06-01 through DV-06-15.

## Phase 7 - Packaging And Maintenance

### DV-07-01 - Create Customer Delivery Bundle Index

Goal: make P0 videos usable outside the repo.

Deliverables:

- Index with clip order, title, file path, duration, audience fit and one-line description.

Acceptance criteria:

- Customer can understand the package without docs.
- Caveats are present but not noisy.

QA:

- Manual customer-readiness review.

Dependencies:

- P0 release gate.

### DV-07-02 - Create Internal Proof Index

Goal: make claims traceable for internal review.

Deliverables:

- Index mapping each clip/candidate to proof path, tests, fixtures, caveats and current reality label.

Acceptance criteria:

- Every P0 claim has a proof path.
- P1/P2/P3 proof artifacts are discoverable.

QA:

- Manual proof-path review.

Dependencies:

- P1/P2/P3 completion.

### DV-07-03 - Create Naming And Storage Convention

Goal: make final videos and artifacts stable.

Deliverables:

- Naming convention for MP4, SRT, transcript, metadata, thumbnail and run logs.
- Storage convention for customer vs internal artifacts.

Acceptance criteria:

- File names are readable and unique.
- Internal proof artifacts are not confused with customer videos.

QA:

- Manual review.

Dependencies:

- DV-07-01.

### DV-07-04 - Create Regeneration Runbook

Goal: make future changes maintainable.

Deliverables:

- Runbook section with steps after UI, route, fixture or copy changes.

Acceptance criteria:

- Regeneration tells which tests to run before re-recording.
- Runbook includes legacy/P0/P1 manifest commands.

QA:

- Manual command review.

Dependencies:

- Phase 1 tooling support.

### DV-07-05 - Create External Send Review Checklist

Goal: prevent accidental overclaim before videos are sent.

Checklist must include:

- Demo-data-only.
- No final advice.
- No real auth/MFA.
- No production compliance claim.
- Captions reviewed.
- Proof path exists.
- Caveat present.
- Customer delivery index updated.

Acceptance criteria:

- Checklist is short enough to be used.
- Checklist links to internal proof index.

QA:

- Manual review.

Dependencies:

- DV-07-01, DV-07-02.

### DV-07-06 - Final Customer Bundle Gate

Goal: approve the package for customer sharing.

Acceptance criteria:

- P0 bundle complete.
- Selected P1 appendix complete if MESO B is used.
- Internal proof index complete.
- External send checklist passed.
- Known limitations are documented.

QA:

- `pnpm visual:contract`
- Relevant latest P0/P1 live-run QA summaries.
- Manual send review.

Dependencies:

- DV-07-01 through DV-07-05.

## Cross-Cutting Task Set

### DV-X-01 - Update Phase Execution Report After Every Implementation Phase

Affected file:

- `docs/v3/PHASE_EXECUTION_REPORT.md`

Acceptance criteria:

- Changed files listed.
- Commands run listed.
- Risks and TODOs listed.
- Phase scope is clear.

### DV-X-02 - Update Implementation QA Report After Every Implementation Phase

Affected file:

- `docs/v3/IMPLEMENTATION_QA_REPORT.md`

Acceptance criteria:

- QA gates are documented.
- Runtime proof snapshots are included where relevant.
- Limitations remain visible.

### DV-X-03 - Maintain Overclaim Register

Goal: prevent narrative drift.

Acceptance criteria:

- Every new customer-facing claim is either proven, caveated or removed.
- J10, auth, file/export and production compliance caveats remain visible.

### DV-X-04 - Preserve Clean UI Boundary

Goal: avoid putting explanatory docs into product UI.

Acceptance criteria:

- No spec panels, route labels, annotation rails, filenames or dev notes appear as app UI.
- Captions/notes live in screencast metadata or delivery docs.

QA:

- `pnpm visual:contract`
- Manual screenshot review.

### DV-X-05 - Keep Legacy J01-J10 Until Retirement Gate

Goal: preserve working proof while portfolio grows.

Acceptance criteria:

- Legacy manifest remains runnable.
- Retirement only happens after P0 passes and a replacement decision is documented.

## Suggested Implementation Order

1. DV-00-01 through DV-00-05.
2. DV-01-01 through DV-01-09.
3. DV-02-01, then P0 tasks DV-02-02 through DV-02-13.
4. DV-02-14.
5. DV-03-01 through DV-03-08.
6. DV-04-01 through DV-04-08.
7. DV-05-01 through DV-05-15.
8. DV-06-01 through DV-06-16.
9. DV-07-01 through DV-07-06.

## Method Compliance Checklist

| Method | Applied artifact |
| --- | --- |
| V3 Mission/Evidence | Tasks cite source files, proof levels and acceptance gates. |
| V3 Branch Debate | Weak branches from roadmap remain killed: direct rename, 100 videos, route-only proof. |
| V3 Proof Paths | Every task includes acceptance and QA/proof expectations. |
| V2 Double Diamond | Discovery/definition from roadmap/backlog; delivery as phased task catalogue. |
| Psycho-Logic + Map/Model | Videos are treated as trust artifacts, not mere route recordings. |
| Reframing | "Create videos" becomes "build proof-aligned customer-sendable library." |
| TRIZ | Breadth vs maintainability resolved through P0/P1/P2/P3 layering. |
| SIT Closed World | Existing runner, manifest, fixtures, route registry, tests and QA docs are reused first. |
| Morphological / CCA | Tasks are separated by layer, proof level, audience, implementation maturity and video need. |
| SCAMPER | Existing journeys are cloned, split, combined, reduced or promoted selectively. |
| Harvard/BATNA | Legacy J01-J10 is preserved as fallback; MESO B remains recommended path. |
| MESOs | P0-only, P0+P1 and full proof-library options remain supported. |
| Measurement | Task gates include commands, proof levels and customer-sendable criteria. |
| Ethics/Fairness | Caveats prevent deception, overclaim and implied production compliance. |
