# V2 State Coverage Report

Date: 2026-06-14

## Client States

| Surface | Covered states |
|---|---|
| `/mobile` | default, recommendation blocked, empty, decision notification |
| `/mobile/upload` | select type, extraction review, low confidence blocked, verification pending, upload error/retry |
| `/portal` | default, loading, error, permission blocked |
| `/wealth-map` | default graph, Trust X drawer, restricted node, escalation context |
| `/actions` | kanban, action detail drawer, blocked/missing evidence |
| `/decisions` | ready, permission blocked, submitted/evidence created |
| Evidence preview | default preview, restricted preview, missing evidence escalation |

## Internal States

| Surface | Covered states |
|---|---|
| `/signals` | trigger review only, client-visible boundary blocked |
| `/workbench` | priority queue, publish disabled until gates complete, evidence preview |
| `/advisor-approval` | review, approved/compliance pending, call escalation |
| `/compliance` | review, release to client, block/request evidence, audit output |
| `/governance` | matrix, role drawer, second confirmation, permission blocked, audit history |
| `/communication` | decision tree, trigger matrix, gated preview, evidence log |

## Reference States

Service blueprint, roadmap, global badge/state-machine and evidence/audit boards are documented as internal/reference or logic-only inputs. They are not rendered as end-user product screens.

## Limitation

Several states are modeled with query parameters or demo runtime state rather than real network loading, authorization failures or production error responses.

