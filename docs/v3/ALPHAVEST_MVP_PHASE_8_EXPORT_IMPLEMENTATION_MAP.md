# Implementation Map - MEGA-JOURNEY-PHASE-8 - Export / Redaction / Client-Safe Package

Date: 2026-06-20
Owner: Codex
Phase: Mega Journey Phase 8
Completion Status Label: implemented + verified with documented limitations

## Source Contract

- Human Visual Standard read order completed: yes
- AlphaVest source files read: yes
- Workflow plan ticket IDs: AV-MVP-P8-T001, AV-MVP-P8-T002, AV-MVP-P8-T003, AV-MVP-P8-T004, AV-MVP-P8-T005
- Product rule affected: no internal, unreleased or unapproved payload in client-safe export
- No-unapproved-advice risk: medium

## Route And Component Map

| Field | Value |
| --- | --- |
| Target routes | `/export/new`, `/export/:id/scope`, `/export/:id/redaction`, `/export/:id/preview`, `/export/:id/download` |
| Route registry entries | 054-058 |
| Pageflow/Userflow | PF-I / UF-11 |
| Components expected to change | `CommunicationExportOpsScreen`, export pages and export fixture data |
| Shared primitives expected to change | none planned |
| Files expected to change | `components/communication-export-ops-screen.tsx`, `lib/communication-export-ops-demo-data.ts`, export services/tests/reports |
| Files explicitly out of scope | Prisma schema, production auth, real binary export generation |

## State Coverage Map

| State | Required? | Source/reference | Planned implementation | Verification status |
| --- | --- | --- | --- | --- |
| default | yes | PAGE-054..058 | Export setup, scope, redaction, preview, download pages render | verified |
| loading | no | Existing shell | No new loading state | not applicable |
| empty | no | Existing export fixture | No empty route added | not applicable |
| error | yes | Phase 8 negatives | Forbidden payload/no approval/audit failure covered by tests | verified |
| disabled | yes | PAGE-057/058 | Download/share separated from approval in UI and service assertions | verified |
| hover | yes | Existing button styles | Existing button hover retained | verified by unchanged shared controls |
| focus | yes | Existing controls | Existing focus styles retained | verified by unchanged shared controls |
| modal | yes | PAGE-057/058 | Approval and share confirmation modal states | screenshot captured |
| drawer | no | Export references | No drawer state required | not applicable |
| overlay | yes | PAGE-057/058 | Modal overlay retained | screenshot captured |
| validation | yes | PAGE-054..057 | Redaction/scope/approval/policy validation states | verified |
| success | yes | PAGE-058 | Download/share success state | verified |

## Role, Tenant And Data Context

| Context | Value |
| --- | --- |
| Roles | Principal, Compliance Officer |
| Tenant | Summit Family Office demo tenant |
| Actor/user fixture | Existing demo session actors |
| Seed objects | Summit export request, recommendation, evidence record and generated export document metadata |
| Permission assumptions | Export requires permission, redaction, approval, audit persistence and safe payload classification |
| Evidence/audit assumptions | Export actions are audited through `runDemoWorkflowMutation`; package remains metadata-only |
| Product behavior not being claimed | No real binary package generation, no production storage/download/share, no client acceptance |

## Visual Inputs

| Input | Required path/status | Notes |
| --- | --- | --- |
| Existing AlphaVest reference screenshot | `public/reference/page_ui_v3/clean_pages/PAGE-054-export-new.png` through `PAGE-058-export-id-download.png` | Inspected before editing |
| ImageGen visual | not used | No generated mockup in this phase |
| Reference catalogue asset | required and present | Used for interaction shape and density |
| Prompt | current user request | Execute Phase 8 as implementation, take screenshots |

## Interaction Shape

| Interaction | Expected shape | Notes |
| --- | --- | --- |
| Page | yes | All five export routes |
| Modal | yes | Approval and share confirmation |
| Drawer | no | Not required |
| Overlay | yes | Modal overlay |
| Wizard/step | yes | Export setup and progress states |
| Confirmation | yes | Approval and share/download separation |
| Blocked/restricted state | yes | No approval/no redaction/forbidden payload/audit failure |

## Proof Plan

| Proof surface | Required? | Planned artifact | Verification status |
| --- | --- | --- | --- |
| Typecheck/lint/build | yes | command output | passed |
| Route smoke/Playwright | yes | `pnpm smoke:phase13` and focused tests | passed |
| Screenshot proof | yes | `artifacts/mvp-phase-8/*.png` | captured |
| Human Visual Review Rubric result | yes | QA report status | not reviewed |
| Accessibility/semantic review | partial | route smoke and screenshot inspection | partial |
| Evidence/audit/persistence proof | yes | export tests and API checks | passed |

## Explicit Gaps

| Gap | Completion Status Label | Owner/next step |
| --- | --- | --- |
| Real binary export generation | not performed | Later file/export realism phase |
| Production share/download delivery | not performed | Later operational export phase |
| Full human visual review | not reviewed | Human reviewer |
