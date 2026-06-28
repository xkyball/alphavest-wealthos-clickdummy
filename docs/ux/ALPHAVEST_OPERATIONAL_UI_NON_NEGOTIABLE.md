# AlphaVest Operational UI Non-Negotiable

Date: 2026-06-28

## Rule

Operational AlphaVest screens show product work, not implementation proof.

Visible UI must not expose internal implementation logic, internal state-machine
labels, route/test/proof identifiers or contract scaffolding. If a smoke test,
route contract or legacy UX proof requires that content to appear on screen, the
contract is stale and must be refactored.

## Forbidden In Default Product UI

- Route IDs, page IDs, task IDs, work-package IDs, UX phase IDs and epic IDs.
- Business process IDs, acceptance IDs, internal gate IDs or source universe IDs.
- `data-testid`, `data-ux-*`, selector names, filenames or source paths.
- Proof, reviewer, capture, debug or source-trace wording.
- Visible contract names, methodology labels or implementation notes.
- Internal process/runtime labels that exist only to prove implementation state.
- Oversized operational hero, route-summary or status-banner blocks that repeat
  the current route, stage, payload counters or gate labels without enabling the
  user's immediate work.
- Dense operations, scope, proof, preview or approval strips that expose
  implementation choreography instead of the next product action.
- Gate/scope/process explainer panels such as `selected/scoped/gated`,
  `command spine`, `access request gate` or equivalent internal choreography.
  These may exist as metadata or reports, not default product UI.
- Badge clusters, status-chip clouds or repeated badges used as state guidance.
  State must be expressed as product-native icon-plus-text status, object fields,
  disabled-action reasons or real workflow controls.

## Allowed In Default Product UI

- Product-native object state such as pending, blocked, approved, released or
  incomplete.
- Safety blockers that affect the user's next safe action.
- Recovery actions and disabled-control reasons that explain what the user can
  do next.
- Client visibility, evidence, audit, RBAC and export caveats when they directly
  affect the current task.

## Enforcement

`pnpm guard:source` must fail when visible operational component copy contains
internal proof/contract/state scaffolding. Focused surface-copy tests may add
more examples, but the source guard is the hard non-negotiable gate.

Visual audits for operational routes must also fail when a 1400x900 viewport
shows a route-summary banner instead of the actual work surface, requires page
scroll for the primary task, clips table text into vertical fragments, creates
horizontal overflow, hides the primary action below the fold or exposes proof
scaffolding as product UI.

Every screenshot used as UI proof must be paired with this visual audit. The
audit must record the viewport, scroll result, horizontal-overflow result,
table-clipping result, summary-banner result, badge-cluster/proof-strip result,
gate/scope/process-explainer result, internal-marker result and primary-action
visibility. It must also record a substance result: the screen must not be
artificially short, sparse or empty when the route represents real operational
work. A route passes only when the screenshot shows meaningful service-backed
object, decision, table, evidence or action content for the current task.
Meaningful empty space should be filled when the workflow can truthfully provide
useful work content; acceptable fill is real object context, decision context,
evidence, history, checks or next actions. Decorative filler, explainer prose,
methodology labels and internal contract text do not count. An unaudited
screenshot is not proof and must not be used as acceptance evidence.

Process-first implementation remains mandatory. The difference is placement:
process/runtime truth belongs in DB/service/API/test metadata and reports; the
operational UI must translate it into user-relevant task state and next action.
