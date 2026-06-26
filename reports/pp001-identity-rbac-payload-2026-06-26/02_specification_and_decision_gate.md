# PP-001 Specification - Identity/RBAC/Payload Proof Contract

Generated: 2026-06-26

Tasks: `SPEC-1 PP-001 Identity/RBAC/Payload Proof Contract`, `DECISION-1 PP-001 Scope and Execution Boundary Approval`

Status: `SPEC-1 COMPLETE`, `DECISION-1 AWAITING HUMAN`

## Active Ticket Notice

After completing `ANALYSIS-1`, I worked on exactly one operative ticket in this slice: `SPEC-1`. No implementation tasks were executed.

## Target State

PP-001 acceptance means:

1. A known actor resolves deterministically to user, tenant and role context.
2. Unknown or mismatched actor context fails closed.
3. Tenant membership is explicit before tenant-scoped payload or mutation authority.
4. Route shell access, action permission, object scope and payload visibility are separate checks.
5. Object-scoped payloads require matching object type, tenant and object id.
6. Client roles receive only released/client-safe/redacted payloads.
7. Internal roles receive only task-relevant internal payloads.
8. Admin/security/governance roles cannot force evidence, release, visibility, export or advice payload gates.
9. Denied/sensitive actions write audit proof or fail closed when audit persistence is unavailable.
10. UX labels for tenant, role, scope, denied, hidden, redacted and success states do not overclaim authority.

## Source Hierarchy For PP-001

| Rank | Source | PP-001 use |
| --- | --- | --- |
| 1 | `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` | Operative repo authority and safety boundary. |
| 2 | Current `full-workflow` repo | Current code/test reality. |
| 3 | Upload ticket architecture | PP-001 delivery-chain input. |
| 4 | Existing tests and reports | Evidence only, not automatic acceptance. |
| 5 | Older docs and generated bundles | Supporting context only when consistent with current code and True-UX authority. |

## Accepted Actor/Role Matrix For Implementation Scope

Recommended minimum PP-001 actor matrix:

| Actor family | Roles | PP-001 purpose |
| --- | --- | --- |
| Client | `principal`, `family_cfo`, `trustee`, `next_gen`, `external_advisor` | Client-safe visibility, source-document edge cases, tenant/object denial. |
| Internal work | `analyst`, `senior_wealth_advisor`, `compliance_officer` | Internal payload, advisor/compliance separation, evidence/release boundaries. |
| Governance | `admin`, `security_officer`, `client_success` | Governance management, admin non-bypass, access/tenant context. |
| System | service/system actor only where existing code already has one | Audit/system context only; no new production service-account semantics in PP-001. |

Implementation boundary: do not invent new roles for PP-001. If a role is not in this matrix, it is out of scope unless the human decision explicitly adds it.

## Rule Contract

### Identity / Current User

- DB-user JWT current-user proof is allowed through `app/api/current-user/route.ts` and `lib/auth/current-user.ts`.
- Demo providerless proof is allowed through `lib/demo-session.ts` and strict helpers such as `tryCreateDemoSession` / `requireDemoSession`.
- Unknown JWT, unknown role, unknown tenant or role/tenant mismatch must fail closed.
- Demo UI fallback may exist for presentation, but strict PP-001 proof paths must not treat fallback as authority.

### Tenant / Object Scope

- Tenant context is required before tenant-scoped payload or mutation authority.
- Cross-tenant access is denied even when the route shell is visible.
- Object-scoped payloads require explicit object type and object id.
- Role alone never grants access to a foreign object.

### Route / Action / Payload Separation

- Route shell accessible means only that the user may see the shell.
- Action permission must be evaluated separately for create/edit/review/approve/release/export/manage operations.
- Payload visibility must be evaluated after tenant/object/action context and may still be hidden/redacted.

### Payload Visibility

Minimum PP-001 payload classes:

| Class | Meaning | Examples from current repo |
| --- | --- | --- |
| `visible` | Field may be returned to current actor. | `clientSummary` after client release; document title/status when client-safe. |
| `hidden` | Field must not be present in payload. | `internalRationale`, `complianceNotes`, `storageKey`, `checksum`, `assumptionsJson`. |
| `redacted` | Field may appear only as redacted marker when contract allows it. | Audit/internal fields on released client decision projections if required by later export/client spec. |
| `internal_only` | Internal work roles may see when scoped; clients never receive. | analyst/advisor/compliance review material. |
| `client_safe_released_only` | Client receives only after release/client-visible state. | recommendation/decision summaries. |

### Admin Non-Bypass

Admin/security/governance authority does not grant:

- evidence sufficiency approval,
- compliance release,
- client visibility release,
- export approval/download/share,
- internal advice/rationale payload visibility,
- audit bypass.

Governance management may be allowed where scoped and second-confirmed, but it must remain separate from safety outcomes.

### Denied / Sensitive Audit

Minimum audit fields for PP-001 denied/sensitive actions:

- actor user id,
- actor role key,
- platform tenant id,
- client tenant id when applicable,
- target type,
- target id,
- action,
- previous state,
- next state,
- result,
- reason,
- correlation id where available.

If a critical action cannot write required audit proof, the action must fail closed.

## Acceptance Criteria

### Positive

- Known DB-user JWT resolves to current user, active role, tenant membership and memberships list.
- Known demo actor resolves to deterministic role, tenant and membership.
- Allowed actor/tenant/object/action combinations pass with expected reason code.
- Released client-safe payload projects without internal fields.
- Compliance/evidence/admin governance actions that are legitimately allowed require audit and, where applicable, second confirmation.

### Negative

- Missing/invalid JWT returns denied fail-closed current-user envelope.
- Unknown role/tenant in strict providerless paths returns issues and no payload expansion.
- Cross-tenant access is denied.
- Missing tenant context denies payload/action authority.
- Route shell access does not grant payload visibility.
- Wrong object id or object type denies object-scoped access.
- Client role cannot receive internal drafts, analyst notes, compliance notes, storage keys, checksums or unreleased recommendations.
- Admin/security cannot force evidence sufficiency, release, visibility, export, advice payload or audit bypass.
- Denied/sensitive action records audit or blocks mutation if audit cannot be confirmed.
- UX copy does not claim release, client acceptance, evidence sufficiency, export approval or payload access unless the corresponding technical gate passed.

## Implementation Boundaries After Approval

Codex may:

- Add or adjust PP-001-specific test fixtures and tests.
- Add a small adapter/bridge test between DB current-user and permission context if approved.
- Consolidate allowed/forbidden payload field constants into a PP-001 matrix if it reuses current contracts.
- Harden fail-closed reason codes or test assertions without broadening access.
- Update safety wording for denied/hidden/redacted/context labels where directly tied to PP-001.

Codex must not:

- Add production IAM or real provider enforcement.
- Add blind schema migrations.
- Create new product routes.
- Expand client visibility.
- Treat admin/security as superuser for safety gates.
- Replace existing proof with UI-only states.
- Implement PP-002 through PP-005.
- Use `main` as implementation truth.

## Recommended Execution Plan After Decision

1. `IMPL-1.1`: Bridge current-user proof. Prefer a targeted test first; only add adapter code if the test exposes a real gap.
2. `IMPL-1.2`: Confirm tenant membership and cross-tenant denial using existing strict helpers plus one DB/API edge if approved.
3. `IMPL-2`: Reuse `providerless-scope` route/action/object separation and add only missing action/object cases.
4. `IMPL-3.1`: Materialize PP-001 payload matrix from existing field constants and projection tests.
5. `IMPL-3.2`: Add missing admin/internal/client payload negatives only where existing tests do not cover the matrix.
6. `IMPL-4.1`: Extend admin non-bypass forbidden action list if needed.
7. `IMPL-4.2`: Align audit minimum field assertions and audit persistence fail-closed proof.
8. `IMPL-5`: Run PP-001 UX wording review and update only route/context states directly covered by the contract.
9. `QA-1`: Run focused suite plus `pnpm test:v1-p0` or scoped equivalent if runtime permits.

## DECISION-1 Request

Recommended decision:

`APPROVE_PP001_EXECUTION_SCOPE_WITH_CONSOLIDATION_FIRST_BOUNDARY`

Why this is the bold route:

- It refuses to keep masking safety debt as scattered tests and local assumptions.
- It does not start a broad auth rewrite just to look decisive.
- It makes PP-001 the acceptance contract that can later justify deleting duplicate, stale or misleading proof fragments.
- It keeps the codebase demo-first while making runtime proof stricter.

Decision options:

| Option | Recommendation | Consequence |
| --- | --- | --- |
| Approve consolidation-first PP-001 | Recommended | Codex may implement the scoped PP-001 proof bridge/matrix/tests one task at a time. |
| Rework spec before implementation | Acceptable if actor/payload scope should change | Codex updates this spec, no code changes. |
| Proof-only, no hardening | Conservative | Codex may only run/report existing tests; likely leaves scattered proof debt. |
| Full auth/RBAC rewrite | Not recommended | Conflicts with demo-first rule and creates high blast radius. |

## V2/V3 Method Artifacts

Psycho-Logic + Map/Model:

- Rational logic: safety proof must bind identity, role, tenant, object, action, payload and audit into one acceptance chain.
- Psycho-logic: the user wants old debt removed, not cosmetically hidden; the spec must create permission to delete ambiguity later.
- Current map trap: existing tests can be mistaken for a coherent proof pack.
- Design move: make PP-001 a single proof contract that names which test/service owns which acceptance criterion.

Reframing Matrix:

| Frame | What it reveals |
| --- | --- |
| "Add missing implementation" | Tempting but too blunt; the repo already has many foundations. |
| "Consolidate proof authority" | Stronger; makes current evidence decision-ready. |
| "UI safety clarity" | Necessary but secondary; cannot replace runtime proof. |
| "Auth rewrite" | Looks bold but violates demo-first and increases risk. |

TRIZ:

- Contradiction: strengthen PP-001 without broadening auth/RBAC blast radius.
- Principle: segmentation. Split DB current-user, demo-session, permission, payload, audit and UX into explicit acceptance layers.
- Principle: prior action. Reuse existing P0 and control-layer proof before adding code.
- Derived move: add bridge/matrix tests only where the existing proof chain has a real gap.

SIT Closed World:

- Resources: `auth/current-user`, `demo-session`, `permission-engine`, `visibility-engine`, `audit-service`, control-layer helpers, current P0 tests.
- Subtraction: remove implicit "admin superuser" and "route means payload" assumptions.
- Multiplication: represent the same actor matrix across JWT, demo and permission tests.
- Division: separate route, action, object and payload proof.
- Task unification: use PP-001 matrix as test fixture, specification and QA checklist.
- Attribute dependency: payload fields depend on actor role, tenant, object and workflow state.

Morphological / CCA:

- Dimensions: actor family, identity surface, tenant/object state, permission layer, payload class, audit expectation, UX state.
- Rejected combination: admin + release/export/evidence gate + allow.
- Rejected combination: client + internal draft/compliance note + visible.
- Kept combination: client + released decision summary + visible.
- Kept combination: compliance officer + scoped evidence approval + audit required.
- Kept combination: route shell allowed + object outside scope + payload hidden/denied.

SCAMPER:

- Substitute broad implementation with targeted bridge proof.
- Combine current-user and demo-session expectations in one matrix.
- Adapt existing visibility constants into PP-001 payload classes.
- Modify tests to assert reason codes and no-mutation/audit outcomes.
- Put existing reports to another use as evidence patterns, not acceptance truth.
- Eliminate duplicate local proof if PP-001 later supersedes it.
- Reverse "write code first" into "prove contract first".

Harvard / BATNA:

- Interests: safety proof, fewer stale assumptions, low blast radius, honest acceptance language.
- Objective criteria: passing targeted tests, no leakage, no admin bypass, fail-closed envelope, audit minimum fields.
- Our BATNA: stop at decision and do no implementation.
- Their BATNA: manually approve a smaller proof-only run.
- Mutual-gain option: approve consolidation-first boundary so Codex can remove ambiguity without overbuilding production auth.

MESOs:

- Offer A, recommended: consolidation-first proof implementation. Equal value: strongest proof per change.
- Offer B: proof-only reporting wave. Equal value: lowest risk, but less debt removal.
- Offer C: spec rework only. Equal value: best if actor/payload policy is not ready.

Measurement Plan:

- Run `pnpm guard:source` before implementation.
- Run targeted tests per implemented subtask.
- Run `pnpm test:v1-p0` or focused P0 equivalent before QA close if runtime permits.
- Stop on any P0 safety, no-leakage, admin non-bypass or audit fail-closed failure.

Ethics & Fairness:

- No fabricated proof.
- No hidden broadening of access.
- No dark patterns or misleading UI copy.
- No client-visible internal advice or unreleased payload.
- Real human decision remains visible before implementation.

## SPEC-1 Definition Of Done Check

| Criterion | Result |
| --- | --- |
| Target state described | Pass |
| Scope and out-of-scope clear | Pass |
| Acceptance criteria testable | Pass |
| Implementation boundaries clear | Pass |
| Human decision prepared | Pass |
| Product code untouched | Pass |

## Ticket Completion

`SPEC-1 PP-001 Identity/RBAC/Payload Proof Contract` is finished.

`DECISION-1 PP-001 Scope and Execution Boundary Approval` is now the active stop gate and requires human decision.
