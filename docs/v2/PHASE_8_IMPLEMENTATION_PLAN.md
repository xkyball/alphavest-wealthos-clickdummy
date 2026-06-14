# Phase 8 Implementation Plan

Date: 2026-06-14

## Scope

Phase 8 implements communication, service blueprint and roadmap/planning surfaces after Phase 7 and 7.5.

Routes:

- `/communication`
- `/service-blueprint`
- `/journey` as the existing blueprint alias
- `/roadmap`

## Visual Interpretation

Communication visuals contain implementable internal workflow UI: decision tree, trigger matrix, message preview and communication log.

Service blueprint, planning and state visuals are reference boards. They inform internal/reference screens, route state, tests, documentation and model data. They are not client wealth screens.

## Implementation Steps

1. Add a Phase 8 model for communication route selection, communication gate evaluation, blueprint lanes, evidence chain, escalation loops, roadmap scope, blocked features and dependency flow.
2. Replace the old Phase 4 wrappers on `/communication`, `/journey` and `/roadmap` with dedicated Phase 8 screens.
3. Add `/service-blueprint` as an explicit internal/reference route while retaining `/journey`.
4. Use Phase 7 permission, state, evidence, audit and client visibility helpers for send/release checks.
5. Add tests for route loading, trigger route selection, blocked message send, evidence log, blueprint reference sections and roadmap scope.
6. Document QA results and known limitations.

## Non-Goals

- Do not implement future roadmap features.
- Do not turn service blueprint boards into client-facing product UI.
- Do not bypass the no-unapproved-advice gate for communication.
- Do not add real CRM, calendar, document API or messaging integrations.
