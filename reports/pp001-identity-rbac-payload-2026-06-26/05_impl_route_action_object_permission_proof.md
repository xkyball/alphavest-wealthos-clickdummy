# PP-001 Implementation - Route / Action / Object Permission Proof

Generated: 2026-06-26

Task: `IMPL-2 Route / Action / Object Permission Enforcement & Tests`

Status: `COMPLETE_WITH_PAYLOAD_RESIDUAL_FOR_IMPL_3`

## Change Summary

Updated `tests/providerless-scope.spec.ts` with an explicit route-vs-action boundary test:

- A Bennett principal can reach the Advisor Approval Detail route shell.
- The same principal cannot perform the advisor approval action.
- The denied action returns `DEMO_DENY_ADVISOR_APPROVAL_REQUIRED`.
- The denied action remains audit-required.

No product code, route, schema, API or UI change was made.

## Proof Added

| Proof | Expected result |
| --- | --- |
| Route shell access | `routeShellAccessible: true` |
| Action denied despite visible shell | `actionDecision.allowed: false` |
| Denial reason | `DEMO_DENY_ADVISOR_APPROVAL_REQUIRED` |
| Audit requirement | `actionDecision.requiresAudit: true` |

## Validation

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/providerless-scope.spec.ts --workers=1
```

Result: PASS, 10/10 tests.

## Negative Finding Carried Forward

The first draft of this test also asserted that `boundary.payloadDecision.allowed` should be false for the principal on the advisor approval detail route. That assertion failed: route/action separation was correct, but this specific route-boundary payload decision stayed allowed.

This is not closed inside `IMPL-2` because `IMPL-2` owns route/action/object permission separation, not field-level payload visibility or redaction. The finding is carried forward as a required `IMPL-3` payload-visibility hardening/reconciliation item.

Recommended `IMPL-3` handling:

- Decide whether `permissionEngine.evaluateRouteBoundary` should fail closed for client actors on `clientVisibilitySensitive` recommendation payloads.
- Or prove that payload output is always filtered by `visibilityEngine` / client projection before any sensitive fields can leave the route/API.
- Add a negative test that binds route shell access, denied action authority and hidden/redacted payload output in the same PP-001 proof chain.

## Acceptance Check

| Criterion | Result |
| --- | --- |
| Route access alone does not grant action authority | Pass |
| Denied action has reason code | Pass |
| Denied action is audit-required | Pass |
| Object-scope denial tests remain green | Pass |
| Product code untouched | Pass |
| Payload residual documented for next task | Pass |

## Ticket Completion

`IMPL-2 Route / Action / Object Permission Enforcement & Tests` is finished. `IMPL-3` must address the payload residual above.
