# Implementation Map - D-06 - Review Calendar

Date: 2026-06-17
Owner: Codex
Phase: D - Review calendar and monitoring
Completion Status Label: not verified

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: D-01, D-02, D-03, D-04, D-05, D-06, D-08, D-09, D-10
- Product rule affected: Evidence backed; sensitive actions create audit events; no unapproved advice reaches the client
- No-unapproved-advice risk: medium

## Route And Component Map

| Field | Value |
| --- | --- |
| Target route | `/reviews/calendar` |
| Route registry entry | New Phase D page ID 068 in `lib/route-registry.ts` |
| Pageflow/Userflow | PF-J / UF-14 |
| Component(s) expected to change | `components/review-monitoring-screen.tsx`, `app/[...segments]/page.tsx` |
| Shared primitives expected to change | None planned |
| Files expected to change | route registry, review-monitoring demo/service/API/test/report files |
| Files explicitly out of scope | Prisma schema, production authentication, compliance release logic |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | `/ops/sla` reference | Metrics, filters, calendar lane, review table and right rail | not verified |
| loading | yes | Human Visual Standard | API proof path has test coverage; UI static loading not added unless client fetch is introduced | not verified |
| empty | yes | Human Visual Standard | Empty-state panel for filtered review rows | not verified |
| error | yes | Human Visual Standard | API returns 503 if DB is unavailable; UI records error path in proof | not verified |
| disabled | yes | Product rules | Client-release actions disabled/blocked copy | not verified |
| hover | yes | Design system | Existing button/link hover classes reused | not verified |
| focus | yes | Design system | Native buttons/links, focus-visible via browser defaults and shared classes | not verified |
| modal | no | Screen target | Not planned | not required |
| drawer | no | Screen target | Not planned | not required |
| overlay | no | Screen target | Not planned | not required |
| validation | no | Read-only review calendar | Not planned | not required |
| success | yes | API actions | J16 action response and snapshot proof | not verified |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Role(s) | Operations, product, QA, analyst |
| Tenant(s) | Demo tenants seeded by Prisma |
| Actor/user fixture | Demo analyst / operations context |
| Seed objects | ReviewSchedule, QueueItem, AuditEvent |
| Permission assumptions | Demo permission engine remains permissive with audit requirements |
| Evidence/audit assumptions | Audit events only claimed for tested `/api/demo-workflow` J16 actions |
| Product behavior not being claimed | No production scheduler, no real reminders, no client-visible advice release |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `artifacts/phase-d-review-monitoring/D-04-reference-screenshots/ops-sla-reference-catalogue.png` | Catalogue reference copied before implementation |
| ImageGen visual | not generated | Prompt contract exists; implementation uses reference screenshot directly |
| Reference catalogue asset | `public/reference/page_ui_v3/clean_pages/PAGE-060-ops-sla.png` | Inspected before edit |
| Prompt | `artifacts/phase-d-review-monitoring/D-05-imagegen-mockups/review-calendar-prompt.md` | Records source route, state, role and forbidden artifacts |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | Full desktop app page |
| Modal | no | None |
| Drawer | no | None |
| Overlay | no | None |
| Wizard/step | no | None |
| Confirmation | no | None |
| Blocked/restricted state | yes | Client release remains blocked; overdue escalation is internal |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | `pnpm typecheck`, `pnpm lint`, `pnpm build` | not verified |
| Route smoke/Playwright | yes | route smoke and Phase D tests | not verified |
| Screenshot proof | yes | `review-calendar-implemented.png` | not verified |
| Human Visual Review Rubric result | yes | `human-visual-review.md` | not verified |
| Accessibility/semantic review | yes | headings, tables, buttons checked in route smoke/screenshot pass | not verified |
| Evidence/audit/persistence proof | yes | GET `/api/review-monitoring` and POST `j16.*` API tests | not verified |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| Generated mockup file is not produced | partially implemented | Prompt contract used; screenshot proof remains the acceptance source |

