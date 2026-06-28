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

Process-first implementation remains mandatory. The difference is placement:
process/runtime truth belongs in DB/service/API/test metadata and reports; the
operational UI must translate it into user-relevant task state and next action.
