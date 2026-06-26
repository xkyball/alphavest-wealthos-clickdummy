# Human Decision Gate

Ticket: `DECISION-1`
Status: `PENDING_HUMAN_DECISION_CURRENT_RUN`
Decision source: current refreshed audit run on 2026-06-26; no new baseline acceptance has been assumed.
Codex recommendation: `ACCEPT_WITH_LIMITATIONS_AND_AUTHORIZE_PROOF_PLUS_CLEANUP`

## Decision Needed

The local capability report is ready for human baseline decision. The QA result is `PASS_WITH_LIMITATIONS`: the report is evidence-bound and useful, and this refresh added current-run proof for source guard, Prisma schema validation, 53-model schema alignment, export command spine and export UI/API truth. It is still not a full runtime acceptance certificate because full DB/API/browser vertical suites were not executed for every product flow.

## Baseline Options

| Option | Meaning | Codex recommendation |
| --- | --- | --- |
| `Accept` | Accept the report as the current conservative code-reality baseline. | Not bold enough unless paired with immediate proof/cleanup. |
| `Accept with Corrections` | Accept baseline and add targeted corrections before follow-up work. | Good if you want wording tweaks first. |
| `Rework` | Send report back for more analysis before any follow-up. | Not recommended; the current bottleneck is proof execution and legacy cleanup, not more static analysis. |
| `Reject` | Do not use the report as baseline. | Not recommended unless a named source/evidence error is found. |

## Recommended Decision

Choose `Accept with Corrections` only if you want wording changes; otherwise choose `Accept`, and immediately authorize the next proof/cleanup slice:

1. Run a focused runtime proof pack for document upload/review, profile/family/entity, journey commands and export workflow.
2. Split `/api/demo-workflow` into a demo-only action bus plus typed domain command APIs.
3. Retire or hard-block remaining legacy `j08.*` demo compatibility paths after the direct `/api/export-workflow` lifecycle is runtime-proven.
4. Purge static controls that look like real product actions unless they are wired or visibly safety-blocked by data.
5. Keep the 53-model schema alignment gate in the proof pack and reject future stale 49-model claims.

This is the cleanest route to remove legacy ambiguity instead of hiding it behind broader “demo works” language.

## Follow-Up Authorization State

| Follow-up | Current status | Needs human authorization? |
| --- | --- | --- |
| Focused runtime proof pack | Ready to derive | Yes |
| Demo workflow action-ID split | Ready to derive | Yes |
| Export lifecycle runtime proof / legacy J08 retirement | Ready to derive | Yes |
| Static affordance purge | Ready to derive | Yes |
| Schema alignment regression gate | Current-run proven; keep in follow-up proof pack | Yes |

## Stop Condition

Current run stops here unless you explicitly accept the refreshed baseline and authorize follow-up execution. Recommended authorization: focused runtime proof pack plus a hard cleanup slice that demotes `/api/demo-workflow` to demo-only, retires legacy export demo paths after proof, and purges or wires product-looking static controls.
