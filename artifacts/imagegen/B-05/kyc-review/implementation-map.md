# Implementation Map - B-05/B-06 - KYC Review

Date: 2026-06-17
Owner: Codex
Phase: B - KYC / AML / Source-of-Wealth foundation
Completion Status Label: partially implemented

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: B-01, B-02, B-03, B-04, B-05, B-06, B-08, B-09, B-10, B-11, B-12
- Product rule affected: human reviewed, evidence backed, sensitive actions create audit events
- No-unapproved-advice risk: low; KYC review is internal/compliance workflow and no client advice is released

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | `/kyc/demo/review` |
| Route registry entry | New Phase B route, KYC Review |
| Pageflow/Userflow | PF-D document intake plus PF-E internal trigger context; J12 Phase B workflow |
| Component(s) expected to change | New `components/kyc-aml-workflow-screen.tsx`, catch-all route dispatch |
| Shared primitives expected to change | Route registry and visual contract coverage only |
| Files expected to change | `lib/kyc-aml-demo-data.ts`, `components/kyc-aml-workflow-screen.tsx`, `lib/route-registry.ts`, `app/[...segments]/page.tsx`, `app/api/demo-workflow/route.ts`, tests and reports |
| Files explicitly out of scope | Prisma schema migrations, production auth, real document storage, production KYC provider integration |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | `/documents/extraction-review` reference screenshot | Review dashboard with identity, AML, evidence and audit panels | partially implemented |
| loading | yes | component state standard | State panel documents demo loading behavior | partially implemented |
| empty | yes | component state standard | Missing-evidence and no-open-hits panels | partially implemented |
| error | yes | component state standard | Sanctions/PEP conflict and evidence gap panels | partially implemented |
| disabled | yes | product gate | Release/approve CTA disabled until compliance release | partially implemented |
| hover | yes | AlphaVest button styles | Shared button hover classes | not verified |
| focus | yes | accessibility minimum | Semantic buttons/links, focus styles inherited | not verified |
| modal | no | not implied by Phase B reference | Not implemented | not required |
| drawer | no | not implied by KYC review reference | Not implemented | not required |
| overlay | no | not implied | Not implemented | not required |
| validation | yes | KYC checklist | Evidence gap and review blocker states | partially implemented |
| success | yes | approve/complete demo mutation | Ready-for-compliance visual state and J12 API action | partially implemented |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | Analyst, compliance officer |
| Tenant(s) | Morgan Family Office demo tenant |
| Actor/user fixture | `compliance_officer`, `analyst` demo roles |
| Seed objects | Morgan tax/source document, KYC compliance review, KYC evidence record |
| Permission assumptions | Demo permission engine remains authoritative; sensitive review requires audit |
| Evidence/audit assumptions | J12 actions create audit rows; evidence record is upserted for review/complete actions |
| Product behavior not being claimed | No production identity provider, no real AML screening provider, no client release |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `artifacts/imagegen/B-05/kyc-review/reference-app.png` required before ImageGen | Real running app screenshot from `/documents/extraction-review`. |
| ImageGen visual | `artifacts/imagegen/B-05/kyc-review/generated-mockup.png` required | Design reference only; not screenshot proof. |
| Reference catalogue asset | `public/reference/page_ui_v3/clean_pages/PAGE-029-documents-extraction-review.png` | Directional design reference. |
| Prompt | `artifacts/imagegen/B-05/kyc-review/prompt.md` | Records route, state, role and forbidden artifacts. |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | Internal KYC review page in AlphaVest shell. |
| Modal | no | Not required for Phase B. |
| Drawer | no | Not required for Phase B. |
| Overlay | no | Not required for Phase B. |
| Wizard/step | yes | Workflow stepper/checklist pattern. |
| Confirmation | yes | Demo action buttons record status and audit. |
| Blocked/restricted state | yes | Compliance release remains blocked when evidence is incomplete. |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | command output summary in reports | not verified |
| Route smoke/Playwright | yes | `pnpm test:route-smoke` and screenshot script | not verified |
| Screenshot proof | yes | `artifacts/imagegen/B-05/kyc-review/implemented-route.png` | not verified |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | not verified |
| Accessibility/semantic review | yes | rubric and route smoke headings | not verified |
| Evidence/audit/persistence proof | yes | J12 workflow API test and audit/evidence upsert result | not verified |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| Production KYC provider integration | not verified | Future production integration phase |
| Human reviewer has not manually approved screenshot | not verified | Human visual review after screenshot proof |
