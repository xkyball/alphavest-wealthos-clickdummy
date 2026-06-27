# AlphaVest E05 Action And Feedback Audit

Date: 2026-06-27

## Source

Upload epic: `E05 - Action Hierarchy and No-Overclaim Feedback Implementation`

Ticket order:

1. `E05-A1` analyse current action and feedback patterns.
2. `E05-S1` specify action hierarchy and no-overclaim feedback rules.
3. `E05-I1` implement shared action hierarchy primitives.
4. `E05-I2` implement no-overclaim feedback/message primitives.
5. `E05-I3a` apply primitives to document/evidence family.
6. `E05-I3b` apply primitives to advisor/compliance/decision family.
7. `E05-I3c` apply primitives to export/client-safe family.
8. `E05-Q1` validate action and feedback behaviour.

## Current Code Reality

Existing useful primitives:

- `lib/ux-action-hierarchy-contract.ts` already defines action priorities, meanings, placements, availability and runtime attributes.
- `lib/ux-feedback-message-contract.ts` already defines feedback intents, subjects, placements, audiences and no-overclaim runtime attributes.
- `components/ui/state-panel.tsx` can project feedback metadata.
- `components/ui/validation-feedback.tsx` can render accessible validation/status feedback.
- `components/ui/guarded-action-button.tsx` can project guarded action metadata.
- `components/ux-action-rail.tsx` exists for static rail messaging.

Remaining implementation gap:

- Route-family surfaces still use local `primaryButtonClass`, `secondaryButtonClass`, ad hoc disabled spans and local destructive button styling for important controls.
- The existing contracts are not yet backed by a route-family action-zone primitive that owns one-primary grouping, sticky/inline placement metadata and disabled reason projection.
- Upload, compliance and export families have no-overclaim copy, but several controls still encode their action semantics locally instead of through a reusable button primitive.

## Family Findings

Document/evidence family:

- `/documents/upload` already uses upload-only `ValidationFeedback` and upload subject metadata.
- The submit/review/retry controls are local buttons and links rather than contract-projected action buttons.
- Upload success copy correctly avoids evidence sufficiency, but the action hierarchy around upload vs review navigation remains locally styled.

Advisor/compliance/decision family:

- `/compliance/reviews/demo/decision-room` separates release, request evidence and block with runtime action attributes.
- The rail still mixes local spans, primary button classes and custom destructive classes.
- This is the most important family to normalize because advisor approval, compliance release, evidence request and block must never collapse into one "successful" action.

Export/client-safe family:

- `/export/demo/approval` and `/export/demo/download` already separate approval, download and share with no-overclaim metadata.
- Export approval/download/share buttons remain local.
- Share blocked reason is present but not produced by a reusable disabled-reason action primitive.

## Decision

Implement a canonical `ActionZone` and `ActionButton` primitive in `components/ui/action-zone.tsx`.

This is the clean path because it removes the repeating local class/attribute pattern without changing backend workflow logic, routes, permissions, APIs or policy. It also keeps E01-E04 contracts intact: E01 owns operating posture, E02 owns page zones, E03 owns proof/reviewer separation and E04 owns lifecycle state. E05 owns action semantics inside those zones.

## Out Of Scope Confirmed

- No backend workflow gate logic.
- No new action APIs.
- No schema, permission, audit persistence or release policy change.
- No new routes.
- No generated screen assets.
