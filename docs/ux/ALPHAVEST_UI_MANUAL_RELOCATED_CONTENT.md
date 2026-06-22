# AlphaVest UI Manual Relocated Content

> Phase 1 relocation register for explanatory content removed from operative product UI.

## Status

| Field | Value |
| --- | --- |
| Artefact status | `PHASE_1_RELOCATION_TARGET_UPDATED_UXP1_009` |
| Scope | Internal UX/manual register for relocated explanations |
| Product authority | None |
| Runtime UI authority | None |
| Source contract | UXP0/UXP1 interaction pruning and content cleanup tasks |
| Last initialized | 2026-06-22 |
| Last updated | 2026-06-22 by `UXP1-009` |
| Covered execution slice | `UXP1-001` through `UXP1-008`, plus seeded cleanup-audit rows |

## Purpose

This document is the single Phase 1 destination for useful explanation that is removed from product UI because it is manual, proof, roadmap, demo, recovery, implementation, or methodology content.

It preserves context for implementation review without keeping that explanation on operative screens.

## UXP1-009 Consolidation

UXP1-009 consolidates this file as the Phase 1 relocation destination. It does not authorize new product UI, route movement, scope promotion, safety-policy changes, feature behavior, or release claims.

The document now serves four narrow jobs:

- preserve useful explanation removed from product UI;
- map each relocated explanation to a manual/reference section;
- record the short product UI replacement left behind;
- support Phase 1 validation without reintroducing manual/proof text into normal workflow screens.

## Guardrails

- This document must contain relocated explanations only.
- This document must not create new product requirements, route scope, feature behavior, safety policy, or release authority.
- Product UI should retain only domain content, functional labels, short state copy, direct next-step copy, and safety-critical microcopy.
- Any UI replacement copy must state only the current state or next action. It must not imply downstream gate completion.
- Internal proof, roadmap, demo, Engine, task-pack, density, and implementation commentary belongs here or in another internal reference/manual artefact, not in normal product workflow surfaces.

## Phase 1 Coverage

| Task | Coverage Status | Registered Relocation |
| --- | --- | --- |
| `UXP1-001` | Covered | Global chrome / topbar |
| `UXP1-002` | Covered | Page header, CTA, keyboard/status and product guidance support |
| `UXP1-003` | Covered | Route skeleton / demo context card |
| `UXP1-004` | Covered | Demo session panel / client topbar |
| `UXP1-005` | Covered | MVP screen components |
| `UXP1-006` | Covered | MVP_SUPPORT flow screens |
| `UXP1-007` | Covered | Reference-only routes `061`, `062`, `063` |
| `UXP1-008` | Covered | HOLD routes `064-067`, `069-071` and P1 route `068` |
| `UXP1-009` | Covered | This consolidation section and validation contract |

## Affected Artefact Map

| Artefact | Phase 1 Role |
| --- | --- |
| `components/top-bar.tsx` | Global context copy source for UXP1-001. |
| `components/page-header.tsx` | Header, primary CTA and keyboard/status copy source for UXP1-002. |
| `components/product-guidance-panel.tsx` | Product guidance and action rail copy source for UXP1-002. |
| `components/route-skeleton-page.tsx` | Registered-only, reference, P1 and hold shell copy source for UXP1-003, UXP1-007 and UXP1-008. |
| `components/demo-session-provider.tsx` | Session/context copy source for UXP1-004. |
| `components/client-intake-screen.tsx` | MVP client/document/evidence copy source for UXP1-005. |
| `components/decisions-governance-screen.tsx` | MVP governance/decision copy source for UXP1-005. |
| `components/communication-export-ops-screen.tsx` | MVP export, MVP_SUPPORT ops, and reference-only fallback copy source for UXP1-005 through UXP1-007. |
| `components/auth-onboarding-screen.tsx` | Access/onboarding support copy source for UXP1-006. |
| `components/admin-tenant-setup-screen.tsx` | Tenant/admin support copy source for UXP1-006. |
| `components/wealth-actions-screen.tsx` | Wealth/actions support copy source for UXP1-006. |
| `components/scf-p10-p14-closure-panel.tsx` | Closure/support copy source for UXP1-006. |
| `lib/product-guidance.ts` | Protected-scope action suppression and guidance copy source for UXP1-008. |

## Relocation Register

| Route / Workset | Relocated Explanation | Manual Section | Product UI Replacement | Status |
| --- | --- | --- | --- | --- |
| ALL | Controlled scenario, production-auth context, database/demo-mode chips, or similar build/demo explanation that does not change the user's immediate task. | Developer and Demo Mode Notes | Remove from normal product chrome or expose only through a dev-only/reference surface. | Seeded from cleanup audit |
| Global chrome / topbar | Topbar explanation that the visible session is a controlled scenario and does not claim production authentication. | Developer and Demo Mode Notes | UI now shows `Active context` plus tenant and role only. Reset action says `Reset role and tenant context`. | Relocated in UXP1-001 |
| Page header / primary CTA support | Visible Phase 8 CTA proof copy explaining exact-primary-CTA proof, downstream-gate proof and state-proof rationale. | CTA / State Proof Manual | UI now shows `Next action state`, `Next action`, `Blocked reason`, `Recovery` and `No downstream completion`. | Relocated in UXP1-002 |
| Page header keyboard/status support | Visible Phase 10 proof label and proof-oriented header terms for keyboard, focus and status support. | Accessibility Proof Manual | UI now shows `Keyboard ready`, `Keyboard + status`, `Keyboard actions`, `Focus return`, `Status update` and `Page context`. | Relocated in UXP1-002 |
| Product guidance side rail | Visible Phase 9 density proof label in the product guidance action rail. | Layout Proof Manual | UI now shows `Layout`, `Layout priority` and `Safety state`. | Relocated in UXP1-002 |
| Route skeleton / demo context card | Scenario-context explanation that tenant and role are controlled scenario inputs in the top bar, plus permission-mode/scenario-active wording. | Developer and Demo Mode Notes | UI now shows `Route Context`, `Tenant`, `Actor`, `Role family`, `Access context` and `Active`. | Relocated in UXP1-003 |
| Demo session panel / client topbar | Scenario-context and proof-heavy session explanation, including controlled-scenario badges, permission-mode wording and draft-state labels. | Developer and Demo Mode Notes | UI now shows `Session context`, `Active context`, `Access state`, `Audit state`, `Evidence state`, `Tenant context` and `Role context`. | Relocated in UXP1-004 |
| MVP screen components | Visible Phase 5/6/7 proof labels, audit-proof wording, demo approval proof copy and sufficiency-proof wording inside MVP client, advisory, governance and export screens. | MVP Screen Proof Manual | UI now shows `Detail state`, `Decision gate`, `Client-safe projection`, `Unavailable content`, `audit record` and current blocked-state copy. | Relocated in UXP1-005 |
| MVP_SUPPORT flow screens | Demo/dummy/provider explanation, DB-backed support wording, proof-oriented audit/closure wording and demo tenant context inside access, setup, client-context and action support screens. | Support Flow Manual | UI now shows `Access pending`, `Checking user access`, `audit event`, `Invitation state`, `Tenant context`, `implementation state` and concise readiness blockers. | Relocated in UXP1-006 |
| ALL | Phase, page job, density hierarchy, safety-retained, recovery-proof, or implementation-proof explanation. | Implementation Proof Manual | Compact current gate, blocked reason, and next action only. | Seeded from cleanup audit |
| MVP routes | "No success overclaim" proof explanation that describes why the UI is safe rather than what the user can do now. | Safety and Gate Copy Manual | Keep only short safety copy where an action could be misunderstood. | Seeded from cleanup audit |
| 028 `/documents/upload` | Upload-not-sufficiency explanation: upload completion does not mean evidence sufficiency, extraction completion, verification, approval, release, or client visibility. | Evidence Lifecycle Manual | `Upload received. Evidence review is still required.` | Seeded from cleanup audit |
| 040-041 | Release/block gate explanation for compliance-controlled client visibility. | Compliance Gate Manual | Show blocked reason, required preconditions, and confirm/cancel controls only. | Seeded from cleanup audit |
| 048-051 | RBAC/admin non-bypass explanation and role/access governance rationale. | Governance and Access Manual | Show role diff, affected object, confirmation reason, and current permission state. | Seeded from cleanup audit |
| 054-058 | Export lifecycle proof explanation, including approval, redaction, and download-control rationale. | Export and Redaction Manual | Show scope, redaction state, approval state, and download step state. | Seeded from cleanup audit |
| 061 `/service-blueprint` | Service blueprint/process explanation presented as product-style navigation, filters or controls. | Internal Service Blueprint | UI now shows `Read-only reference` and keeps blueprint lanes as internal reference content only. | Relocated in UXP1-007 |
| 062 `/roadmap` | MVP/future-scope roadmap explanation presented as an operative product page or scope-control surface. | Internal Roadmap Reference | UI now shows `Read-only scope reference`, `Reference Summary` and `Scope Decision Register`. | Relocated in UXP1-007 |
| 063 `/states` | State and badge catalogue explanation presented as a product workflow surface or status-changing control set. | Internal State Reference | UI now shows `Read-only state reference` and keeps state examples non-mutating. | Relocated in UXP1-007 |
| 064-067, 069-071 HOLD / 068 P1 | Long protected-route explanation, implementation-placeholder language, product-action lock wording and continuation links that could imply unlocked high-risk workflow. | Hold and Deferred Route Manual | UI now shows `Held`, `Deferred`, `Hold Guard`, `Deferred Guard`, no product controls and no related-workspace continuation from protected routes. | Relocated in UXP1-008 |

## Entry Template

Use this table row format when Phase 1 removes or shortens explanatory UI copy:

| Route / Workset | Relocated Explanation | Manual Section | Product UI Replacement | Status |
| --- | --- | --- | --- | --- |
| `route-id` / `path` | Plain-language summary of removed explanation. Do not add new requirements. | Internal manual/reference section. | Exact short state or next-step microcopy left in UI, or `None`. | `Relocated in <task-id>` |

## Phase 1 Acceptance Check

For each touched UI area:

- The removed explanation is represented in the relocation register or a final report.
- The remaining product UI contains no long manual, proof, methodology, roadmap, demo, or implementation explanation.
- Remaining labels are functional and task-oriented.
- Remaining safety copy is short, state-bound, and non-overclaiming.
- Any future update to this document is traceable to a concrete UI cleanup task.

## Validation Contract

Before a Phase 1 cleanup task is considered complete:

- the changed UI copy must either remain functional/state-bound or be represented in the relocation register;
- every new relocation row must name the route/workset, removed explanation class, manual section, product UI replacement and task status;
- seeded rows may remain as audit carry-forward, but task-executed rows must use `Relocated in <task-id>`;
- this document must not introduce product requirements, route eligibility, release authority, feature behavior or acceptance claims;
- full route-smoke proof is deferred until the Phase 1 completion gate unless the active task explicitly overrides that instruction.

Current UXP1-009 validation state:

| Check | Result |
| --- | --- |
| Manual file exists at `docs/ux/ALPHAVEST_UI_MANUAL_RELOCATED_CONTENT.md` | PASS |
| `UXP1-001` through `UXP1-008` have explicit coverage entries | PASS |
| `UXP1-009` adds consolidation metadata without product authority | PASS |
| Product UI changes in UXP1-009 | None |
| Route scope or capability changes in UXP1-009 | None |
