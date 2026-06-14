# Phase 5 Implementation Plan

Date: 2026-06-14

## Objective

Rebuild the client-facing AlphaVest WealthOS experience from the v2 client visual set and screen specs while preserving the Phase 4 route, permission, state, evidence and audit helpers.

## Scope

Routes in scope:

- `/mobile`
- `/mobile/upload`
- `/portal`
- `/wealth-map`
- `/actions`
- `/decisions`
- `/evidence`

Out of scope:

- Phase 6 internal workflow rebuild.
- Phase 7 governance expansion beyond existing helper consumption.
- Real API, auth, persistence, document storage or production audit logs.
- Rendering visual board annotations, developer notes, legends or metadata as product UI.

## Implementation Approach

1. Add `lib/phase5-client-model.ts` for Phase 5 mock contracts, client actions, evidence records, decision submission audit helpers and permission/release wrappers.
2. Add `components/phase5-client-screens.tsx` for the rebuilt client application regions only.
3. Repoint the seven Phase 5 route files from Phase 3 board components to the Phase 5 components.
4. Keep the central Phase 4 helpers as the source for:
   - `evaluateClientVisibility()`
   - `evaluatePermission()`
   - `createEvidenceLink()`
   - `createAuditEvent()`
5. Add tests covering client visibility, upload states, restricted graph/evidence, action blocked state, decision submission audit and route wiring.

## Visual Interpretation

The Phase 5 implementation uses the actual app UI regions from V2-001 through V2-025:

- mobile screen contents become `/mobile` and `/mobile/upload`;
- dashboard body becomes `/portal`;
- graph, drawer and restricted node become `/wealth-map`;
- kanban and detail drawer become `/actions`;
- decision room and submitted evidence state become `/decisions`;
- evidence list, preview drawer, restricted and missing states become `/evidence`.

Annotations and implementation notes were translated into helpers, state controls, tests and documentation rather than rendered as UI.

Correction note:

- Mobile visuals must not become phone-frame mockups in the web route.
- `/mobile` and `/mobile/upload` now bypass the global desktop shell and render only the mobile app content.
- Alternate QA states are driven by query parameters such as `?state=blocked`, `?state=low`, and `?state=pending` instead of visible state-toggle controls.

## Quality Target

Phase 5 is complete when:

- all seven routes render Phase 5 UI;
- blocked states prevent advice-like content from being revealed;
- upload low confidence routes to analyst review;
- portal readiness links to focused wealth-map gaps;
- wealth-map and evidence restricted states hide sensitive fields;
- action and decision flows show evidence/audit status;
- tests, lint and build pass or failures are documented.
