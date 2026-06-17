# Implementation Map - D-07 - Rebalance Monitoring

Date: 2026-06-17
Owner: Codex
Phase: D - Review calendar and monitoring
Completion Status Label: not verified

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: D-01, D-02, D-03, D-04, D-05, D-07, D-08, D-09, D-10
- Product rule affected: Trigger is a review point, not advice; advisor approval alone is not client release
- No-unapproved-advice risk: high

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | `/monitoring/rebalance` |
| Route registry entry | New Phase D page ID 069 in `lib/route-registry.ts` |
| Pageflow/Userflow | PF-E + PF-J / UF-07 + UF-14 |
| Component(s) expected to change | `components/review-monitoring-screen.tsx`, `app/[...segments]/page.tsx` |
| Shared primitives expected to change | None planned |
| Files expected to change | route registry, review-monitoring demo/service/API/test/report files |
| Files explicitly out of scope | Real portfolio trading, advice generation, production scheduler |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | `/signals` reference | Trigger queue, central detail, action rail and notes | not verified |
| loading | yes | Human Visual Standard | API proof path has test coverage; UI static loading not added unless client fetch is introduced | not verified |
| empty | yes | Human Visual Standard | Empty-state panel for filtered trigger rows | not verified |
| error | yes | Human Visual Standard | API returns 503 if DB is unavailable; UI records error path in proof | not verified |
| disabled | yes | Product rules | Productive rebalance/release action is blocked | not verified |
| hover | yes | Design system | Existing button hover classes reused | not verified |
| focus | yes | Design system | Native buttons/links, focus-visible via browser defaults and shared classes | not verified |
| modal | no | Screen target | Not planned | not required |
| drawer | no | Screen target | Not planned | not required |
| overlay | no | Screen target | Not planned | not required |
| validation | yes | Trigger state | Blocked/no-release guard shown | not verified |
| success | yes | API actions | J17 action response and snapshot proof | not verified |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | Analyst, senior wealth advisor, operations |
| Tenant(s) | Northbridge and seeded demo tenants |
| Actor/user fixture | Demo analyst / advisor |
| Seed objects | Trigger, ActionItem, QueueItem, Recommendation, AuditEvent |
| Permission assumptions | Demo permission engine remains permissive with audit requirements |
| Evidence/audit assumptions | Audit events only claimed for tested `/api/demo-workflow` J17 actions |
| Product behavior not being claimed | No productive trading, no client advice, no client release, no real portfolio rebalance |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `artifacts/phase-d-review-monitoring/D-04-reference-screenshots/signals-reference-catalogue.png` | Catalogue reference copied before implementation |
| ImageGen visual | not generated | Prompt contract exists; implementation uses reference screenshot directly |
| Reference catalogue asset | `public/reference/page_ui_v3/clean_pages/PAGE-033-signals.png` | Inspected before edit |
| Prompt | `artifacts/phase-d-review-monitoring/D-05-imagegen-mockups/rebalance-monitoring-prompt.md` | Records source route, state, role and forbidden artifacts |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | Full desktop app page |
| Modal | no | None |
| Drawer | no | None |
| Overlay | no | None |
| Wizard/step | no | None |
| Confirmation | no | None |
| Blocked/restricted state | yes | Rebalance trigger actions are internal review only |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | `pnpm typecheck`, `pnpm lint`, `pnpm build` | not verified |
| Route smoke/Playwright | yes | route smoke and Phase D tests | not verified |
| Screenshot proof | yes | `rebalance-monitoring-implemented.png` | not verified |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | not verified |
| Accessibility/semantic review | yes | headings, action buttons and alert text checked in route proof | not verified |
| Evidence/audit/persistence proof | yes | GET `/api/review-monitoring` and POST `j17.*` API tests | not verified |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| Generated mockup file is not produced | partially implemented | Prompt contract used; screenshot proof remains the acceptance source |

