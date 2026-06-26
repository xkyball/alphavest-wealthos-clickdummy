# Human Decision Gate

Ticket: `DECISION-1`  
Status: `NEEDS_HUMAN_DECISION`  
Codex recommendation: `ACCEPT_WITH_LIMITATIONS_AND_AUTHORIZE_PROOF_PLUS_CLEANUP`

## Decision Needed

The local capability report is ready for human baseline decision. The QA result is `PASS_WITH_LIMITATIONS`: the report is evidence-bound and useful, but it is not a runtime acceptance certificate because focused DB/API/browser tests were not executed in this run.

## Baseline Options

| Option | Meaning | Codex recommendation |
| --- | --- | --- |
| `Accept` | Accept the report as the current conservative code-reality baseline. | Not bold enough unless paired with immediate proof/cleanup. |
| `Accept with Corrections` | Accept baseline and add targeted corrections before follow-up work. | Good if you want wording tweaks first. |
| `Rework` | Send report back for more analysis before any follow-up. | Not recommended; the current bottleneck is proof execution and legacy cleanup, not more static analysis. |
| `Reject` | Do not use the report as baseline. | Not recommended unless a named source/evidence error is found. |

## Recommended Decision

Choose `Accept with Corrections` only if you want wording changes; otherwise choose `Accept`, and immediately authorize the next implementation/proof slice:

1. Run a focused runtime proof pack for document upload/review, profile/family/entity, journey commands and export workflow.
2. Split `/api/demo-workflow` into a demo-only action bus plus typed domain command APIs.
3. Rewire export UI actions to `/api/export-workflow` or explicitly demote them to demo-only.
4. Purge static controls that look like real product actions unless they are wired or visibly safety-blocked by data.
5. Resolve the schema count drift before schema alignment is used as acceptance proof.

This is the cleanest route to remove legacy ambiguity instead of hiding it behind broader “demo works” language.

## Follow-Up Authorization State

| Follow-up | Current status | Needs human authorization? |
| --- | --- | --- |
| Focused runtime proof pack | Ready to derive | Yes |
| Demo workflow action-ID split | Ready to derive | Yes |
| Export UI/API directness proof or rewire | Ready to derive | Yes |
| Static affordance purge | Ready to derive | Yes |
| Schema alignment refresh | Ready to derive | Yes |

## Stop Condition

Codex should stop here until the human chooses the baseline decision and authorizes the next proof or cleanup slice.
