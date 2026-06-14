# Client Experience Route Map v2

Date: 2026-06-14

| Route | Phase 5 component | Source visuals | Primary UI region implemented | Key gate / logic |
|---|---|---|---|---|
| `/mobile` | `MobileScreenV2` | V2-001, V2-002, V2-003, V2-009 | Mobile home content, role badge, next-step cards, bottom nav | Central client visibility gate blocks unreleased recommendation content. Alternate states use `?state=blocked`, `?state=empty`, `?state=decision`. |
| `/mobile/upload` | `MobileUploadScreenV2` | V2-004, V2-005, V2-006, V2-007, V2-008 | Mobile upload content with select, extraction, low-confidence, pending and retry states | AI-DRAFT extraction cannot advance when confidence is low; analyst review routing is represented in logic/docs/tests, not as client-facing internal route chrome. |
| `/portal` | `PortalScreenV2` | V2-010, V2-011, V2-012 | Dashboard cards, loading/error/blocked states, messages, trigger feed, evidence/governance status | Readiness score routes to `/wealth-map?focus=gaps`; visibility score copy says it is not advice. |
| `/wealth-map` | `WealthMapScreenV2` | V2-013, V2-014, V2-015, V2-016 | Graph-like node map, filters, relationship legend, detail drawer, escalation notice | Restricted node uses central permission helper and hides sensitive fields. |
| `/actions` | `ActionsScreenV2` | V2-017, V2-018, V2-019 | Kanban board, action cards, detail drawer | Missing evidence action is blocked and cannot advance in the mini workflow. |
| `/decisions` | `DecisionsScreenV2` | V2-020, V2-021, V2-022 | Modal-style decision workflow surface with ready, blocked and submitted states; Accept/Defer/Reject controls | Advice-like recommendation appears only when release, evidence and permission gates pass. Submission creates visible evidence result. |
| Evidence preview overlay | `EvidencePreviewDrawer` | V2-023, V2-024, V2-025 | Contextual preview drawer opened from workflows such as workbench and decision submission; contains document preview, restricted record and missing-evidence escalation regions | Restricted evidence hides content; missing evidence escalates before release. `/evidence` redirects to `/portal` and is not a standalone navigation target. |

## Navigation Relationships

- `/mobile` links to upload, decisions and governance; evidence is opened from workflow context instead of direct navigation.
- `/mobile/upload` blocks low-confidence records and marks AlphaVest review as required; internal analyst routing remains logic/docs/test coverage.
- `/portal` readiness score links to `/wealth-map?focus=gaps`.
- `/wealth-map` highlights focused evidence / restricted nodes when opened from the dashboard gap path.
- `/actions` links blocked evidence actions to `/mobile/upload` and ready decisions to `/decisions`.
- `/decisions` opens the evidence preview overlay after submission.
- Evidence preview overlay shows audit trail previews for records that can be viewed.

## Non-UI Translation

Visual callouts, dev handoff notes and metadata from the source assets were translated into:

- `lib/surface-registry.ts`
- `lib/phase5-client-model.ts`
- `tests/phase5-client-model.test.mjs`
- `tests/phase5-client-routes.test.mjs`
- `tests/v2-surface-contracts.test.mjs`
- state selectors inside the click-dummy routes
- this route map and state coverage documentation

Mobile-specific boundary:

- Do not render a decorative phone frame, phone shell, board title, visual ID, metadata, or demo state controls.
- The implementation region for mobile visuals is only the content inside the phone screen.

Global client boundary:

- Do not render the global left demo sidebar or route inventory around client screens.
- Do not render Phase/V2 labels, source-board metadata, page-spec headers or QA panels as product UI.
- If a workflow visual is modal/drawer-like, preserve that interaction shape even when the route exists as a deep link.
- Surface classification is controlled by `lib/surface-registry.ts`; route existence does not override the registry.
