# Implementation Map - B-05/B-07 - Source-of-Wealth Review

Date: 2026-06-17
Owner: Codex
Phase: B - KYC / AML / Source-of-Wealth foundation
Completion Status Label: partially implemented

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: B-01, B-02, B-03, B-04, B-05, B-07, B-08, B-09, B-10, B-11, B-12
- Product rule affected: evidence backed, human reviewed, sensitive actions create audit events
- No-unapproved-advice risk: low; this is an internal wealth-source review and not client advice

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | `/kyc/demo/source-of-wealth` |
| Route registry entry | New Phase B route, Source-of-Wealth Review |
| Pageflow/Userflow | PF-E trigger/review context plus PF-D evidence document context; J12 Phase B workflow |
| Component(s) expected to change | New `components/kyc-aml-workflow-screen.tsx`, catch-all route dispatch |
| Shared primitives expected to change | Route registry and visual contract coverage only |
| Files expected to change | `lib/kyc-aml-demo-data.ts`, `components/kyc-aml-workflow-screen.tsx`, `lib/route-registry.ts`, `app/[...segments]/page.tsx`, `app/api/demo-workflow/route.ts`, tests and reports |
| Files explicitly out of scope | Prisma schema migrations, productive bank connectivity, external AML provider calls |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | `/workbench/triggers/:id` reference screenshot | Source-of-wealth trigger detail with funds trail, documents and risk decisions | partially implemented |
| loading | yes | component state standard | Review queue/loading panel | partially implemented |
| empty | yes | component state standard | No unresolved adverse-media panel | partially implemented |
| error | yes | component state standard | Unverified source and jurisdiction blockers | partially implemented |
| disabled | yes | product gate | Approve/route CTA disabled when evidence remains incomplete | partially implemented |
| hover | yes | AlphaVest button styles | Shared button hover classes | not verified |
| focus | yes | accessibility minimum | Semantic buttons/links, focus styles inherited | not verified |
| modal | no | not implied by Phase B reference | Not implemented | not required |
| drawer | no | not implied by reference | Not implemented | not required |
| overlay | no | not implied | Not implemented | not required |
| validation | yes | Source-of-wealth proof chain | Incomplete proof and threshold validation states | partially implemented |
| success | yes | escalation/complete demo mutation | Ready-for-compliance evidence package state | partially implemented |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | Analyst, compliance officer, senior wealth advisor as downstream reviewer |
| Tenant(s) | Morgan Family Office demo tenant |
| Actor/user fixture | `analyst`, `compliance_officer`, `senior_wealth_advisor` demo roles |
| Seed objects | Morgan source-of-wealth document, KYC trigger/action item, KYC evidence record |
| Permission assumptions | Demo permission engine remains authoritative; no real auth introduced |
| Evidence/audit assumptions | J12 actions create audit rows; evidence record/item upserts are scoped to demo data |
| Product behavior not being claimed | No production bank verification, no final tax/legal/advice conclusion, no client release |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `artifacts/imagegen/B-05/source-of-wealth-review/reference-app.png` required before ImageGen | Real running app screenshot from `/workbench/triggers/demo`. |
| ImageGen visual | `artifacts/imagegen/B-05/source-of-wealth-review/generated-mockup.png` required | Design reference only; not screenshot proof. |
| Reference catalogue asset | `public/reference/page_ui_v3/clean_pages/PAGE-035-workbench-triggers-id.png` | Directional design reference. |
| Prompt | `artifacts/imagegen/B-05/source-of-wealth-review/prompt.md` | Records route, state, role and forbidden artifacts. |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | Internal source-of-wealth review page in AlphaVest shell. |
| Modal | no | Not required for Phase B. |
| Drawer | no | Not required for Phase B. |
| Overlay | no | Not required for Phase B. |
| Wizard/step | yes | Funds-trail review sequence. |
| Confirmation | yes | Demo action buttons record status and audit. |
| Blocked/restricted state | yes | Unverified source proof blocks release. |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | command output summary in reports | not verified |
| Route smoke/Playwright | yes | `pnpm test:route-smoke` and screenshot script | not verified |
| Screenshot proof | yes | `artifacts/imagegen/B-05/source-of-wealth-review/implemented-route.png` | not verified |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | not verified |
| Accessibility/semantic review | yes | rubric and route smoke headings | not verified |
| Evidence/audit/persistence proof | yes | J12 workflow API test and audit/evidence upsert result | not verified |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| Production source-of-wealth verification integrations | not verified | Future production integration phase |
| Human reviewer has not manually approved screenshot | not verified | Human visual review after screenshot proof |
