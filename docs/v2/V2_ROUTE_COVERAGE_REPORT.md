# V2 Route Coverage Report

Date: 2026-06-14

## Required Routes

| Route | Status | Primary surface |
|---|---|---|
| `/mobile` | Covered | `MobileScreenV2` |
| `/mobile/upload` | Covered | `MobileUploadScreenV2` |
| `/portal` | Covered | `PortalScreenV2` |
| `/wealth-map` | Covered | `WealthMapScreenV2` |
| `/actions` | Covered | `ActionsScreenV2` |
| `/signals` | Covered | `InternalSignalsScreen` |
| `/decisions` | Covered | `DecisionsScreenV2` |
| `/evidence` | Compatibility redirect | Redirects to `/portal`; evidence is `overlay:evidence-preview` |
| `/workbench` | Covered | `RuntimeWorkbenchScreen` |
| `/advisor-approval` | Covered | `InternalAdvisorApprovalScreen` |
| `/compliance` | Covered | `InternalComplianceScreen` |
| `/governance` | Covered | `Phase7GovernanceScreen` |
| `/communication` | Covered | `Phase8CommunicationScreen` |
| `/service-blueprint` | Covered | `Phase8ServiceBlueprintScreen` |
| `/journey` | Covered alias | `Phase8ServiceBlueprintScreen` |
| `/roadmap` | Covered | `Phase8RoadmapScreen` |

## HTTP Smoke

Temporary dev server smoke on `http://localhost:3019` returned 200 for all required app routes. `/evidence` returned 307 to `/portal`, which is expected because evidence preview is a focused overlay.

## Optional Routes

| Optional route | Status | Reason |
|---|---|---|
| `/states` | Not implemented | State visuals V2-054 and V2-055 are logic-only inputs. |
| `/permissions/reference` | Not implemented | Permission reference V2-043 is a logic-only input. |
| `/evidence/audit-map` | Not implemented | Evidence/audit mapping V2-056 is covered by helpers and tests. |

## Evidence

Coverage is enforced by `tests/phase9-final-handoff.test.mjs` and `tests/v2-surface-contracts.test.mjs`.

