# ALPHAVEST_ALL_ROUTES_SOFT_UNLOCK_HANDOFF.md

**Generated:** 2026-06-21  
**Mode:** max — explicit soft-unlock implementation amendment.  
**Status:** `ALL_ROUTES_SOFT_UNLOCK_AUTHORIZED_WITH_GUARDRAILS`

## 1. Decision

This amendment authorizes a UI-only soft unlock for every registered AlphaVest route in `full-workflow`.
It does not reclassify the route worksets and does not relax safety, release, export, advice, audit,
schema or API stop rules.

## 2. Scope

| Area | Decision |
| --- | --- |
| Route registry | Preserve all existing route IDs and route workset labels. |
| P1 routes | Render implementation UI with `SOFT_UNLOCKED` access mode. |
| Reference routes | Render reference UI with `SOFT_UNLOCKED` access mode. |
| Held routes | Render implementation UI with `SOFT_UNLOCKED` access mode. |
| Navigation | Add soft-unlocked routes to support navigation. |
| APIs | No new API routes. Existing API gates remain authoritative. |
| Prisma | No schema changes and no migrations. |
| Advice | No autonomous advice and no client-visible AI draft. |
| Release/export | No upload-to-release, advisor-as-release, preview-as-approval or admin bypass. |

## 3. Authorized Task IDs

| Task ID | Intent |
| --- | --- |
| `AV-SOFT-UNLOCK-ALL-T001` | Add explicit soft-unlock route access metadata. |
| `AV-SOFT-UNLOCK-ALL-T002` | Render P1, reference and held routes through existing screen components. |
| `AV-SOFT-UNLOCK-ALL-T003` | Expose soft-unlocked routes in support navigation. |
| `AV-SOFT-UNLOCK-ALL-T004` | Update route, navigation and committee route tests from exclusion to soft-unlock proof. |
| `AV-SOFT-UNLOCK-ALL-T005` | Preserve safety-boundary proof and phase reporting. |

## 4. Safety Boundary

Soft unlock means the route UI is visible and navigable. It does not mean:

- compliance release is bypassed;
- committee review releases advice;
- KYC, suitability or IPS creates final regulated advice;
- rebalance monitoring executes a rebalance;
- communication routes send external messages;
- reference routes become lifecycle proof;
- external advisor access becomes unscoped;
- API payloads expand beyond role, tenant and object scope.

## 5. Required Proof

| Proof Area | Required Check |
| --- | --- |
| Route access | `routeImplementationAccessDecision()` returns `implementationShellAccessible=true` for all registered routes. |
| Provenance | Existing route workset counts remain unchanged. |
| Soft boundary | P1/reference/held decisions use `accessMode=SOFT_UNLOCKED` and `safetyBoundary=UI_ONLY_NO_RELEASE_OR_ADVICE_UNLOCK`. |
| Navigation | Soft-unlocked routes are visible in support navigation. |
| Committee | Committee queue/detail render product UI while client release remains guarded. |
| Validation | Run focused route/navigation tests, then type/lint/build or broader suite as practical. |

## 6. Stop Rules Preserved

- No generated screens, state-screen images or visual replacement.
- No Prisma migration.
- No new API route.
- No final financial, legal or tax advice.
- No autonomous advice execution.
- No admin bypass.
- No client-visible AI Draft/internal rationale/compliance notes.
- No upload-to-release or preview-to-approval shortcut.
