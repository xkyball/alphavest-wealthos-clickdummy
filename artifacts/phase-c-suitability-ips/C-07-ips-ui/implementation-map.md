# Implementation Map - C-07 - IPS / Mandate

Date: 2026-06-17
Owner: Codex
Phase: C - Suitability and IPS foundation
Completion Status Label: not verified

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: C-01, C-02, C-03, C-04, C-05, C-07, C-08, C-09, C-10, C-11, C-12
- Product rule affected: Compliance release controls client visibility.
- No-unapproved-advice risk: high

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | `/ips/:tenantId` |
| Route registry entry | New page ID `067`; registered after Phase C suitability route |
| Pageflow/Userflow | PF-E / UF-08 support context before compliance release |
| Component(s) expected to change | `components/suitability-ips-screen.tsx`, `app/[...segments]/page.tsx` |
| Shared primitives expected to change | none expected; use existing `components/ui` primitives |
| Files expected to change | `lib/suitability-ips-demo-data.ts`, `lib/workflow-gate.ts`, `lib/route-registry.ts`, tests, reports |
| Files explicitly out of scope | Real document generation, legal mandate execution, client e-signature provider |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | `/documents` and `/evidence/demo` screenshots | IPS mandate dashboard with constraints, documents and evidence gate | not verified |
| loading | yes | Existing component conventions | Component-level loading states documented | not verified |
| empty | yes | Documents/evidence reference surfaces | Empty evidence/constraint state represented | not verified |
| error | yes | Existing blocked panel language | Mandate conflict and stale IPS panels | not verified |
| disabled | yes | Product no-advice gate | Release/advice CTA disabled while local gate fails | not verified |
| hover | yes | Existing button/link classes | Inherited from shared patterns | not verified |
| focus | yes | Existing button/input patterns | Focusable controls preserve visible focus | not verified |
| modal | no | Not required by C-07 | Not implemented | not required |
| drawer | no | Not required by C-07 | Not implemented | not required |
| overlay | no | Not required by C-07 | Not implemented | not required |
| validation | yes | IPS gate checklist | Gate missing items from local gate function | not verified |
| success | yes | Demo action status | Demo action status after mandate action | not verified |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | Advisor, compliance officer |
| Tenant(s) | Morgan Family Office demo tenant |
| Actor/user fixture | Demo session role switcher; J14 demo actions |
| Seed objects | Demo-only fixture data in `lib/suitability-ips-demo-data.ts` |
| Permission assumptions | Demo permission and local gate only; no production release claim |
| Evidence/audit assumptions | Demo API writes audit/evidence boundaries only for J14 actions |
| Product behavior not being claimed | No final investment mandate advice, no client-visible IPS release, no production document package |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `artifacts/phase-c-suitability-ips/C-04-reference-screenshots/documents-reference-app.png` and `evidence-detail-reference-app.png` | Real running app screenshots before Phase C UI edits |
| ImageGen visual | blocked | Built-in ImageGen produced inline output but no workspace-persisted path was available; prompt retained in C-05 folder |
| Reference catalogue asset | `public/reference/page_ui_v3/clean_pages/PAGE-027-documents.png`, `PAGE-047-evidence-id.png` | Document/evidence intent references |
| Prompt | `artifacts/phase-c-suitability-ips/C-05-imagegen-mockups/ips-prompt.md` | Records source route, state, role and forbidden artifacts |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | Full internal workspace page |
| Modal | no | Not in scope |
| Drawer | no | Not in scope |
| Overlay | no | Not in scope |
| Wizard/step | yes | Mandate review progress |
| Confirmation | no | Release remains disabled |
| Blocked/restricted state | yes | Client visibility blocked by gate |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | `pnpm typecheck`, `pnpm lint`, `pnpm build` | not verified |
| Route smoke/Playwright | yes | `pnpm test:route-smoke` and focused route screenshot | not verified |
| Screenshot proof | yes | `artifacts/phase-c-suitability-ips/C-07-ips-ui/ips-implemented.png` | not verified |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | not verified |
| Accessibility/semantic review | yes | Rubric and Playwright heading visibility | not verified |
| Evidence/audit/persistence proof | yes | `pnpm test:workflow-api` J14 checks | not verified |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| ImageGen generated bitmap could not be persisted from built-in tool output | blocked | Keep prompt and inline generation note; rerun with accessible output path if needed |
| Production IPS document package and signature flow are not implemented | not verified | Future production workflow phase |
