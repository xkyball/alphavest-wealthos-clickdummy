# Implementation Map - C-06 - Suitability Profile

Date: 2026-06-17
Owner: Codex
Phase: C - Suitability and IPS foundation
Completion Status Label: not verified

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: C-01, C-02, C-03, C-04, C-05, C-06, C-08, C-09, C-10, C-11, C-12
- Product rule affected: No unapproved advice reaches the client.
- No-unapproved-advice risk: high

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | `/suitability/:tenantId/profile` |
| Route registry entry | New page ID `066`; registered after Phase B workflow routes |
| Pageflow/Userflow | PF-E / UF-07 with suitability prerequisite state for advice review |
| Component(s) expected to change | `components/suitability-ips-screen.tsx`, `app/[...segments]/page.tsx` |
| Shared primitives expected to change | none expected; use existing `components/ui` primitives |
| Files expected to change | `lib/suitability-ips-demo-data.ts`, `lib/workflow-gate.ts`, `lib/route-registry.ts`, tests, reports |
| Files explicitly out of scope | Prisma schema migration; production auth; production advice release engine |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | `/client/profile` reference screenshot and ImageGen prompt | Suitability dashboard with risk/objective/constraint review | not verified |
| loading | yes | AlphaVest table/component conventions | Existing component-level state documented; no route loading state added | not verified |
| empty | yes | AlphaVest component conventions | Empty state panel for missing objectives/evidence | not verified |
| error | yes | AlphaVest blocked/restricted panels | Conflict and missing-evidence panels | not verified |
| disabled | yes | Product no-advice gate | Client-release CTA disabled until local gate passes | not verified |
| hover | yes | Existing buttons/sidebar/table patterns | Use shared hover classes from app shell/buttons | not verified |
| focus | yes | Existing select/input/button patterns | Use focus-visible/focus border patterns where controls exist | not verified |
| modal | no | Not required by C-06 | Not implemented | not required |
| drawer | no | Not required by C-06 | Not implemented | not required |
| overlay | no | Not required by C-06 | Not implemented | not required |
| validation | yes | Suitability gate checklist | Gate missing items displayed from local gate function | not verified |
| success | yes | Workflow action status | Demo action status text after review/evidence actions | not verified |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | Analyst, advisor, compliance officer |
| Tenant(s) | Morgan Family Office demo tenant |
| Actor/user fixture | Demo session role switcher; J13 demo actions |
| Seed objects | Demo-only fixture data in `lib/suitability-ips-demo-data.ts` |
| Permission assumptions | Uses demo permission engine and local no-unapproved-advice gate; no production auth claim |
| Evidence/audit assumptions | Demo API writes audit/evidence boundaries only for J13 actions |
| Product behavior not being claimed | No final financial advice, no production persistence beyond demo action handler, no client visibility |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `artifacts/phase-c-suitability-ips/C-04-reference-screenshots/client-profile-reference-app.png` | Real running app screenshot before Phase C UI edits |
| ImageGen visual | blocked | Built-in ImageGen produced inline output but no workspace-persisted path was available; prompt retained in C-05 folder |
| Reference catalogue asset | `public/reference/page_ui_v3/clean_pages/PAGE-021-client-profile.png` | Client-profile intent reference |
| Prompt | `artifacts/phase-c-suitability-ips/C-05-imagegen-mockups/suitability-prompt.md` | Records source route, state, role and forbidden artifacts |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | Full internal workspace page |
| Modal | no | Not in scope |
| Drawer | no | Not in scope |
| Overlay | no | Not in scope |
| Wizard/step | yes | Stepper-style review progress |
| Confirmation | no | Release remains disabled |
| Blocked/restricted state | yes | Client visibility blocked by gate |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | `pnpm typecheck`, `pnpm lint`, `pnpm build` | not verified |
| Route smoke/Playwright | yes | `pnpm test:route-smoke` and focused route screenshot | not verified |
| Screenshot proof | yes | `artifacts/phase-c-suitability-ips/C-06-suitability-ui/suitability-implemented.png` | not verified |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | not verified |
| Accessibility/semantic review | yes | Rubric and Playwright heading visibility | not verified |
| Evidence/audit/persistence proof | yes | `pnpm test:workflow-api` J13 checks | not verified |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| ImageGen generated bitmap could not be persisted from built-in tool output | blocked | Keep prompt and inline generation note; rerun with accessible output path if needed |
| Production suitability persistence is not implemented | not verified | Future production data-model phase |
