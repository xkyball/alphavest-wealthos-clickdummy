# Quality Gates v2

## UX gates

- Every route maps to a v2 screen spec.
- Every primary state has a visual reference or explicit TODO.
- Every screen has a primary user and user goal.
- Every sensitive action has blocked/error/loading states where relevant.
- Every advice-like flow includes backstage workflow and compliance gate.
- Every decision links to evidence and audit.
- No product-board-only implementation remains as a primary UI screen.
- Visual annotations are translated into logic/docs/tests, not blindly rendered.

## Permission gates

- Central permission helper exists.
- Role/object/action model exists.
- Second confirmation exists for sensitive changes.
- Permission blocked states exist.
- Client-side hiding is not the only permission mechanism.
- Role-permission tests exist.

## No-Unapproved-Advice gates

- AI draft cannot be client-visible.
- Analyst review alone cannot be client-visible.
- Advisor approval alone cannot be client-visible.
- Compliance release is required.
- Evidence record is required.
- Permission check is required.
- Tests assert these blocks.

## Evidence / audit gates

- Document uploads create document events.
- Advisor actions create sign-off events.
- Compliance release/block creates audit events.
- Client decisions link to evidence records.
- Permission changes create audit events.
- Evidence and audit references are visible in internal views where relevant.

## Technical gates

- Build passes.
- Lint passes if configured.
- Tests pass or failures are documented.
- Route smoke tests updated.
- README/demo instructions updated.
- Phase 4 QA report generated.
