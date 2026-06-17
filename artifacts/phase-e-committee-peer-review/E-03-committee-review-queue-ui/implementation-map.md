# Implementation Map - E-03 - Committee Review Queue

Date: 2026-06-17
Owner: Codex
Phase: E - Committee / Peer Review
Completion Status Label: implemented

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: E-01, E-02, E-03, E-05, E-06, E-07, E-08
- Product rule affected: advisor approval alone is not enough; high-risk cases require second review
- No-unapproved-advice risk: high
- Current capability level: E1/E2 existing visual/static advisor screens, E6 existing no-client-release gate simulation
- Target capability level: E6 gated demo simulation

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | `/committee/reviews` |
| Route registry entry | pageId `070`, `lib/route-registry.ts` |
| Pageflow/Userflow | PF-E / UF-08, Committee / Peer Review |
| Component(s) expected to change | `components/committee-review-screen.tsx` |
| Shared primitives expected to change | None |
| Files expected to change | `app/[...segments]/page.tsx`, `lib/route-registry.ts`, `lib/committee-review-demo-data.ts`, `components/committee-review-screen.tsx`, tests and reports |
| Files explicitly out of scope | Prisma schema, seed migrations, production auth, compliance release APIs |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | `/advisor-approval` screenshot | Queue, metrics, proof strip and side summary | screenshot-proven |
| loading | no | Existing app shell handles global loading | Not implemented in this slice | not required |
| empty | yes | Shared table/card pattern | No empty dataset variant; queue remains seeded | not verified |
| error | yes | Shared route error boundary | No route-local error state | not verified |
| disabled | yes | Gate proof cards | Open review is visual/static only; no productive action | implemented |
| hover | yes | Shared button/table styles | Covered by existing shared classes | not verified |
| focus | yes | Native input/button focus | Search/filter controls use focusable elements | not verified |
| modal | no | Normal page | Not in scope | not required |
| drawer | no | Normal page | Not in scope | not required |
| overlay | no | Normal page | Not in scope | not required |
| validation | no | No editable payload | Not in scope | not required |
| success | no | Committee completion not implemented | Not claimed | not required |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | Compliance Officer demo shell; committee chair / peer reviewer content context |
| Tenant(s) | Bennett Family Office demo shell; Northbridge/Thornton seeded display examples |
| Actor/user fixture | `Naledi Mokoena` shell actor from demo session |
| Seed objects | Fixture rows in `lib/committee-review-demo-data.ts` |
| Permission assumptions | Demo permission allowed, but committee gate blocks until review conditions pass |
| Evidence/audit assumptions | Evidence labels are visual fixture state only |
| Product behavior not being claimed | No payloaded committee vote, no persisted dissent, no real audit/evidence row, no client release |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `../E-02-reference-screenshots/advisor-approval-reference-app.png` | Captured from running app. |
| ImageGen visual | not generated | Phase E used app references directly. |
| Reference catalogue asset | `public/reference/page_ui_v3/clean_pages/PAGE-036-advisor-approval.png` | Inspected before implementation. |
| Prompt | not required | No ImageGen generation in this slice. |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | Queue page with metrics, filters and table |
| Modal | no | Not in scope |
| Drawer | no | Not in scope |
| Overlay | no | Not in scope |
| Wizard/step | no | Not in scope |
| Confirmation | no | Not in scope |
| Blocked/restricted state | yes | Second review and client-visible zero states |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | CLI output | typecheck passed; lint passed; build passed with existing demo-storage warnings |
| Route smoke/Playwright | yes | `tests/committee-review-routes.spec.ts` | passed |
| Screenshot proof | yes | `committee-review-queue-implemented.png` | screenshot-proven |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | visually reviewed |
| Accessibility/semantic review | yes | Playwright role heading + native controls | partially verified |
| Evidence/audit/persistence proof | yes | `tests/workflow-gate.spec.ts` | E6 gate proof passed; no E7 claim |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| Empty/error state screenshots | not verified | Phase H visual hardening |
| Payloaded committee vote persistence | not verified | Future operationalization beyond Phase E |
| Productive audit/evidence write | not verified | Future E7 service/API task |
