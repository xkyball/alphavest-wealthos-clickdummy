# Implementation Map - E-04 - Committee Review Detail

Date: 2026-06-17
Owner: Codex
Phase: E - Committee / Peer Review
Completion Status Label: implemented

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: E-01, E-02, E-04, E-05, E-06, E-07, E-08
- Product rule affected: high-risk recommendations need peer review before downstream release
- No-unapproved-advice risk: high
- Current capability level: E1/E2 existing advisor detail visual/static interaction, E6 existing no-client-release gate simulation
- Target capability level: E6 gated demo simulation

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | `/committee/reviews/:id` |
| Route registry entry | pageId `071`, `lib/route-registry.ts` |
| Pageflow/Userflow | PF-E / UF-08, Committee / Peer Review |
| Component(s) expected to change | `components/committee-review-screen.tsx` |
| Shared primitives expected to change | None |
| Files expected to change | `app/[...segments]/page.tsx`, `lib/route-registry.ts`, `lib/committee-review-demo-data.ts`, `components/committee-review-screen.tsx`, tests and reports |
| Files explicitly out of scope | Prisma schema, production auth, payloaded vote API, compliance release implementation |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | `/advisor-approval/:id` screenshot | Detail cards, votes, evidence, dissent and action rail | screenshot-proven |
| loading | no | Global route loading | Not route-local | not required |
| empty | no | Detail has seeded data | Not in scope | not required |
| error | yes | Shared route error boundary | No route-local error state | not verified |
| disabled | yes | Committee action gate | Approve button disabled until votes/dissent/evidence pass | screenshot-proven |
| hover | yes | Shared button styles | Covered by existing shared classes | not verified |
| focus | yes | Native buttons/links | Not separately screenshotted | not verified |
| modal | no | Normal page | Not in scope | not required |
| drawer | no | Normal page | Not in scope | not required |
| overlay | no | Normal page | Not in scope | not required |
| validation | yes | Gate incomplete state | Visible as blocked state panel | screenshot-proven |
| success | no | Committee approval not in scope | Not claimed | not required |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | Compliance Officer demo shell; committee chair / peer reviewer content context |
| Tenant(s) | Bennett Family Office demo shell; Thornton Family Office detail data |
| Actor/user fixture | `Naledi Mokoena` shell actor from demo session |
| Seed objects | `selectedCommitteeReview` in `lib/committee-review-demo-data.ts` |
| Permission assumptions | Demo permission allowed, but committee gate remains incomplete |
| Evidence/audit assumptions | Audit timeline and evidence labels are fixture-backed display state |
| Product behavior not being claimed | No persisted votes, no persisted dissent, no release, no real evidence/audit write |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `../E-02-reference-screenshots/advisor-approval-detail-reference-app.png` | Captured from running app. |
| ImageGen visual | not generated | Phase E used app references directly. |
| Reference catalogue asset | `public/reference/page_ui_v3/clean_pages/PAGE-037-advisor-approval-id.png` | Inspected before implementation. |
| Prompt | not required | No ImageGen generation in this slice. |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | Detail path with vote/evidence/dissent panels |
| Modal | no | Not in scope |
| Drawer | no | Not in scope |
| Overlay | no | Not in scope |
| Wizard/step | no | Not in scope |
| Confirmation | no | Committee approval button remains disabled |
| Blocked/restricted state | yes | Gate incomplete and downstream compliance warning |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | CLI output | typecheck passed; lint passed; build passed with existing demo-storage warnings |
| Route smoke/Playwright | yes | `tests/committee-review-routes.spec.ts` | passed |
| Screenshot proof | yes | `committee-review-detail-implemented.png` | screenshot-proven |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | visually reviewed |
| Accessibility/semantic review | yes | Playwright role heading + native controls | partially verified |
| Evidence/audit/persistence proof | yes | `tests/workflow-gate.spec.ts` | E6 gate proof passed; no E7 claim |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| Success/completed committee state | not verified | Future workflow task |
| Payloaded committee vote and dissent persistence | not verified | Future E7 service/API task |
| Route-local error screenshot | not verified | Phase H visual hardening |
