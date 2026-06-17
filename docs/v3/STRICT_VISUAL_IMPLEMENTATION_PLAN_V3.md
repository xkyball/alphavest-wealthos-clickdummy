# Strict Visual Implementation Plan V3

Max.

Date: 2026-06-16  
Source: `docs/v3/STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md`  
Mode: phased implementation plan, tasks only, no detailed task expansion.

## Mission

Turn the strict visual review findings into a shared-first implementation plan that fixes professional readability, mobile first-viewport behavior, dense enterprise layouts, surface fidelity, and product-safe workflow visibility without weakening AlphaVest product rules.

## Source Constraints

- Keep `AGENTS.md` and the V3 source-of-truth docs authoritative.
- Fix shared primitives before route-specific screens.
- Keep actual app UI only; no spec panels, route labels, filenames, annotation rails, or dev notes.
- Do not hide evidence, audit, redaction, permission, release, or second-confirmation information.
- Do not treat advisor approval as compliance release.
- Do not use font-size reduction as the default fix.
- Keep demo session, role switcher, tenant switcher, permission, evidence, audit, and compliance gates intact.

## Phase Overview

| Phase | Name | Primary outcome | Main findings covered |
| --- | --- | --- | --- |
| 00 | Planning and QA Baseline | Scope frozen, evidence and route list locked | All |
| 01 | Mobile Shell and Content-First Layout | Mobile routes show route content before navigation | P1-01 |
| 02 | Responsive Data Display Primitives | Tables/matrices stop fragmenting on mobile | P1-02, P1-03, P1-10, P2-07 |
| 03 | Graph, Board, and Fixed-Format Containers | Wealth map, relationship graph, and action board become stable | P1-04, P1-05, P2-03 |
| 04 | Dense Workflow Gate Layouts | Signal, advisor, and compliance reviews become scanable | P1-06, P1-07, P1-08 |
| 05 | Export and Redaction Workspace | Redaction/export workflow gains serious document fidelity | P1-09 |
| 06 | Modal, Drawer, and Confirmation Context | Sensitive states preserve enough surrounding context | P2-01, P2-04 |
| 07 | Polish and Residual Cramped-Text Sweep | Search, roadmap, matrices, and remaining rhythm issues cleaned | P2-02, P2-05, P2-06, P2-07 |
| 08 | Verification, Reports, and Handoff | Contract, screenshots, DOM metrics, and docs refreshed | All |

## Phase 00 - Planning and QA Baseline

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-00-01 | Freeze strict visual remediation scope | Confirm P1/P2 list from strict review |
| AV-SV-00-02 | Lock route/reference/evidence inputs | Use all 63 catalogue pages and existing strict screenshot bundle |
| AV-SV-00-03 | Create visual remediation checklist | Convert P1/P2 findings into trackable task status |
| AV-SV-00-04 | Confirm shared component ownership map | Map findings to shell, table, graph, modal, drawer, workflow, export components |
| AV-SV-00-05 | Establish before/after screenshot protocol | Non-overwriting evidence folder per run |

Gate:

- No implementation starts until affected shared primitives and route groups are identified.

## Phase 01 - Mobile Shell and Content-First Layout

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-01-01 | Make mobile `AppShell` content-first | Admin and tenant routes |
| AV-SV-01-02 | Convert mobile sidebar into menu/drawer navigation | Shared shell/sidebar |
| AV-SV-01-03 | Preserve role and tenant switcher access on mobile | Shared topbar/shell |
| AV-SV-01-04 | Add mobile route-identity smoke checks | Pages 008, 011-017 |
| AV-SV-01-05 | Regenerate mobile screenshots for shell pages | Phase evidence |

Gate:

- Pages 008 and 011-017 show route-specific content in the first mobile viewport.

## Phase 02 - Responsive Data Display Primitives

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-02-01 | Add responsive row-card mode for dense tables | Shared data display primitive |
| AV-SV-02-02 | Add contained horizontal-table mode where cards are inappropriate | Shared data display primitive |
| AV-SV-02-03 | Fix consent policy card wrapping | Page 005 |
| AV-SV-02-04 | Fix family members mobile table | Page 022 |
| AV-SV-02-05 | Fix service blueprint mobile matrix | Page 061 |
| AV-SV-02-06 | Apply primitive to governance/audit/export table candidates | Pages 046, 051, 055, 061 |
| AV-SV-02-07 | Re-run cramped-text DOM metric check | Affected table/matrix pages |

Gate:

- No table header or policy label breaks into unreadable fragments on mobile.

## Phase 03 - Graph, Board, and Fixed-Format Containers

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-03-01 | Stabilize wealth-map graph footer and controls | Page 031 |
| AV-SV-03-02 | Restore/verify wealth-map drawer-state rendering | Page 031 |
| AV-SV-03-03 | Add mobile relationship-map alternative | Page 023 |
| AV-SV-03-04 | Normalize action-board column/card rhythm | Page 032 |
| AV-SV-03-05 | Add fixed-format hover/state stability checks | Pages 023, 031, 032 |
| AV-SV-03-06 | Regenerate anchor screenshots | Pages 023, 031, 032 |

Gate:

- Graph nodes, board cards, and graph controls remain readable and stable in desktop and mobile screenshots.

## Phase 04 - Dense Workflow Gate Layouts

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-04-01 | Rebalance signal review layout | Page 033 |
| AV-SV-04-02 | Rebalance advisor approval detail layout | Page 037 |
| AV-SV-04-03 | Rebalance compliance review layout | Page 039 |
| AV-SV-04-04 | Promote compliance release and evidence gate hierarchy | Pages 037, 039, 040 |
| AV-SV-04-05 | Preserve audit/evidence/decision visibility | Internal workflow components |
| AV-SV-04-06 | Run product-rule visual pass | Advisor and compliance routes |

Gate:

- Advisor approval is visually distinct from compliance release, and compliance review is readable without hiding evidence/audit state.

## Phase 05 - Export and Redaction Workspace

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-05-01 | Recompose export redaction desktop workspace | Page 056 |
| AV-SV-05-02 | Add richer document-preview surface | Page 056 |
| AV-SV-05-03 | Add redaction queue/status rhythm | Page 056 |
| AV-SV-05-04 | Align export scope, preview, and download states | Pages 055-058 |
| AV-SV-05-05 | Verify export evidence/release visibility | Export workflow pages |
| AV-SV-05-06 | Regenerate export workflow screenshots | Pages 054-058 |

Gate:

- Export/redaction reads as a regulated workflow, not a sparse placeholder.

## Phase 06 - Modal, Drawer, and Confirmation Context

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-06-01 | Define shared sensitive-modal context pattern | Modal primitive |
| AV-SV-06-02 | Apply context pattern to admin/security/governance/export modals | Pages 007, 009, 010, 049, 057 |
| AV-SV-06-03 | Apply release/block modal context rules | Pages 040, 041 |
| AV-SV-06-04 | Reduce drawer compression of underlying tables | Pages 046, 051 |
| AV-SV-06-05 | Verify route-state screenshots remain intentional | `lib/visual-contract.ts` route states |
| AV-SV-06-06 | Regenerate modal/drawer screenshot set | Modal/drawer pages |

Gate:

- Sensitive modals and drawers preserve enough context to understand what is being confirmed or inspected.

## Phase 07 - Polish and Residual Cramped-Text Sweep

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-07-01 | Normalize mobile search/filter placeholders | Pages 031, 032, 052, 056 |
| AV-SV-07-02 | Tighten call-trigger matrix rhythm | Page 053 |
| AV-SV-07-03 | Fix roadmap lower-card truncation | Page 062 |
| AV-SV-07-04 | Sweep remaining DOM cramped-text candidates | DOM metric candidate list |
| AV-SV-07-05 | Normalize shared padding and chip spacing | Shared surface/card primitives |
| AV-SV-07-06 | Verify no route-by-route padding drift was introduced | All affected pages |

Gate:

- Residual P2 findings are either fixed or explicitly deferred with reason.

## Phase 08 - Verification, Reports, and Handoff

| Task ID | Task | Scope |
| --- | --- | --- |
| AV-SV-08-01 | Run type/lint/build gates where available | Repo QA |
| AV-SV-08-02 | Run `pnpm visual:contract` | Visual contract |
| AV-SV-08-03 | Regenerate strict screenshot bundle | 63 desktop + 63 mobile |
| AV-SV-08-04 | Regenerate DOM geometry/cramped-text metrics | All 63 pages |
| AV-SV-08-05 | Rebuild desktop/mobile contact sheets | Evidence artifact |
| AV-SV-08-06 | Update strict visual review status | `docs/v3/STRICT_VISUAL_SCREENSHOT_REVIEW_V3.md` |
| AV-SV-08-07 | Update phase QA reports | `docs/v3/PHASE_EXECUTION_REPORT.md`, `docs/v3/IMPLEMENTATION_QA_REPORT.md` |
| AV-SV-08-08 | Prepare handoff summary | Changed files, tests, residual risks |

Gate:

- Visual contract is green, strict P1 findings are closed, and any residual P2s are documented.

## Recommended Execution Order

1. Phase 00
2. Phase 01
3. Phase 02
4. Phase 03
5. Phase 04
6. Phase 05
7. Phase 06
8. Phase 07
9. Phase 08

Parallel-safe groups after Phase 01:

- Phase 02 and Phase 03 can run in parallel if shared table and graph primitives do not touch the same components.
- Phase 04 and Phase 05 can run in parallel after Phase 02 shared display decisions are stable.
- Phase 06 should wait until workflow/export layout decisions are mostly settled.
- Phase 07 should wait for all P1 work.

## Acceptance Criteria

- All P1 findings from the strict review are closed.
- P2 findings are fixed or explicitly deferred.
- All 63 routes remain covered by the visual contract.
- No spec/reference chrome appears in product UI.
- Mobile first viewport shows route content, not only global navigation.
- Dense data is readable without one-word label fragmentation.
- Evidence, audit, redaction, permission, second-confirmation, and compliance-release states remain visible.
- Advisor approval remains visually and semantically distinct from compliance release.
- Reports and screenshot artifacts are refreshed without overwriting previous evidence.

## Deferred By Default

- Pixel-perfect image matching.
- Production authentication/security activation.
- New data model semantics.
- Removing product content.
- Replacing the design system.
- Route-specific styling unless a shared primitive cannot reasonably own the fix.

## Method Notes

V3 proof wrapper:

- Evidence source is the strict screenshot review and generated screenshot bundle.
- Weak branch rejected: fixing pages one by one with isolated CSS.
- Preferred branch: shared primitive remediation before route polish.

V2 execution logic:

- Discover: strict review showed visual readability gaps despite green contract.
- Define: issue is shared UI-system behavior, not missing routes.
- Develop: shell, tables, graphs, workflows, export, modal/drawer, polish.
- Deliver: eight implementation phases with task IDs and gates.

## Method Compliance Checklist

- Facts, assumptions, and proposed moves are separated at plan level.
- Shared-first remediation preserves AlphaVest system consistency.
- Product safety rules are preserved.
- No dark-pattern, coercive, deceptive, or content-hiding fix is proposed.
- Weak branch of route-specific cosmetic patching is rejected.
- Tasks are intentionally not detailed beyond phase/task/scope.
