# AlphaVest E12 Contract Fulfillment Ledger Specification

Epic: E12-F0 - Contract Fulfillment Ledger and Gate
Ticket: E12-S1 - Ledger Schema / Fulfillment Status / Meta-Contract Specification
Status: `E12_S1_SPEC_READY_FOR_GATE_RULES_AND_DECISION`
Date: 2026-06-27

## Purpose

E12 turns AlphaVest UX/API/proof contracts from markdown discipline into release-relevant, machine-readable fulfillment truth.

The ledger is a meta-contract. It does not replace the typed domain contracts for operating mode, page templates, action hierarchy, lifecycle state, data surfaces, proof reviewer mode, capture context or backend query parsing. It records which obligations are active, where they are owned, how they are proven, whether they are fulfilled, and which exceptions are allowed.

## Source Order

1. `ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md` controls repo execution boundaries.
2. Upload `ALPHAVEST_E12_CONTRACT_FULFILLMENT_LEDGER_GATE_TICKET_STRUCTURE.json` controls E12-F0 ticket order.
3. `docs/ux/ALPHAVEST_E12_CONTRACT_FULFILLMENT_INVENTORY.md` supplies the E12-A1 inventory.
4. Current source, tests and scripts supply evidence.

Markdown registers are human review surfaces. They are not proof by themselves.

## Target Artifact Options

E12-D1 must approve one of these storage policies before E12-I1:

| Option | Canonical Machine Truth | Human Review Surface | Recommendation |
| --- | --- | --- | --- |
| `typed-ledger-only` | `lib/ux-contract-ledger.ts` | Generated reports only | Strong TypeScript safety, simplest initial path. |
| `json-ledger-with-typed-loader` | `docs/ux/contract-ledger.json` plus `lib/ux-contract-ledger.ts` loader/types | Markdown generated or validated from JSON | Useful if non-TypeScript tooling needs direct consumption. |
| `hybrid-ts-ledger-generated-json` | `lib/ux-contract-ledger.ts` | generated `docs/ux/contract-ledger.json` snapshot and markdown reports | Recommended: strong source ergonomics plus portable report output. |

S1 recommendation for D1: choose `hybrid-ts-ledger-generated-json`. It removes duplicate truth while keeping TypeScript as the authoring surface and JSON/markdown as generated or validated review output.

## Ledger Entry Schema

Implementation type name: `UxContractLedgerEntry`.

Required fields:

| Field | Type | Rule |
| --- | --- | --- |
| `id` | `UxContractId` | Stable, unique ID such as `E01-OPERATING-MODEL`, `E10-AZ-001`, `E11-DS-004`. |
| `title` | `string` | Short obligation title. |
| `source` | `ContractSource[]` | Source artifacts that define the obligation. Markdown is allowed as source but not as sole fulfillment evidence. |
| `contractFamily` | `ContractFamily` | Controlled family enum. |
| `ownerSurface` | `OwnerSurface[]` | Files, routes, APIs, scripts, tests or reports that own fulfillment. |
| `obligation` | `string` | Concrete statement that must be true. |
| `proofType` | `ProofType[]` | Controlled proof type enum. |
| `status` | `FulfillmentStatus` | Controlled status enum. |
| `evidence` | `EvidenceAnchor[]` | Proof anchors with command/file/test/report references. |
| `gateBehavior` | `GateBehavior` | How the global gate treats the entry. |
| `expiresOrFollowUp` | `string \| null` | Required for `partial`, `exception` and `blocked`. Optional for `fulfilled`, `retired`, `historical` and `planned`. |
| `notes` | `string` | Optional context; cannot be the only proof. |

### Controlled Family Values

```ts
type ContractFamily =
  | "release_gate"
  | "operating_model"
  | "design_system"
  | "page_template"
  | "proof_reviewer"
  | "lifecycle_state"
  | "action_feedback"
  | "data_surface"
  | "client_visibility"
  | "visual_accessibility"
  | "capture_qa"
  | "register_debt"
  | "backend_query_truth"
  | "contract_fulfillment";
```

### Controlled Proof Types

```ts
type ProofType =
  | "source_gate"
  | "runtime_test"
  | "api_test"
  | "screenshot"
  | "capture_qa"
  | "typed_contract"
  | "generated_report"
  | "manual_decision";
```

Proof rules:

- `screenshot` can supplement visual proof, but cannot satisfy API/filter/pagination truth.
- `manual_decision` can authorize an exception, but cannot mark a contract `fulfilled`.
- `typed_contract` proves model availability only when paired with source/runtime/API tests where behavior is claimed.
- `generated_report` is proof only when generated from source/test/script inputs.

### Fulfillment Status Values

```ts
type FulfillmentStatus =
  | "fulfilled"
  | "partial"
  | "exception"
  | "blocked"
  | "retired"
  | "historical"
  | "planned";
```

Status rules:

| Status | Required Evidence | Gate Meaning |
| --- | --- | --- |
| `fulfilled` | At least one non-markdown proof anchor plus owner surface. | Can satisfy release proof for its obligation. |
| `partial` | At least one current anchor and required follow-up. | Allowed only as warn-existing or fail-new depending on gate policy. |
| `exception` | Decision/follow-up and owner surface. | Temporary allowance; must never authorize new unregistered debt. |
| `blocked` | Blocker and required follow-up or decision gate. | Cannot satisfy release proof. |
| `retired` | Source/test proof that active use is removed or forbidden. | Gate must block resurrection. |
| `historical` | Historical source/report path. | Cannot satisfy current release proof. |
| `planned` | Implementation ticket reference. | Cannot satisfy release proof. |

### Gate Behavior Values

```ts
type GateBehavior =
  | "pass"
  | "warn_existing"
  | "fail_new"
  | "fail_always"
  | "report_only";
```

Gate behavior rules:

- `fulfilled` normally uses `pass`.
- `partial` and `exception` must use `warn_existing`, `fail_new` or `fail_always`.
- `blocked` must use `fail_always`.
- `historical` must use `report_only` unless it is used incorrectly as fulfillment proof, which fails.
- `retired` must fail any active resurrection.

## Evidence Anchor Schema

Implementation type name: `EvidenceAnchor`.

```ts
type EvidenceAnchor = {
  kind:
    | "file"
    | "test"
    | "command"
    | "script"
    | "api"
    | "route"
    | "report"
    | "decision";
  ref: string;
  result?: "pass" | "fail" | "not_run" | "historical" | "planned";
  notes?: string;
};
```

Evidence rules:

- `fulfilled` requires at least one evidence anchor with `result: "pass"` or a source-backed file/test anchor that is currently present.
- Markdown specs and registers may appear in `source`, but if every `evidence.kind` is `file` and every file is markdown, fulfillment must fail.
- Commands must be exact package commands or direct script invocations.
- Reports under `docs/v3/proof` are accepted only when they name the underlying source/test/script proof.

## Owner Surface Schema

Implementation type name: `OwnerSurface`.

```ts
type OwnerSurface = {
  kind: "file" | "route" | "api" | "script" | "test" | "report" | "package_script";
  ref: string;
};
```

Owner rules:

- Every active entry needs at least one owner surface.
- Entries for `backend_query_truth` must include API or readmodel ownership when they claim backend behavior.
- Entries for `capture_qa` must include a script or package-script owner.
- Entries for `register_debt` must include the source register and at least one gate/test owner.

## Meta-Contract Schema

Implementation type name: `UxContractMetaContract`.

```ts
type UxContractMetaContract = {
  id: "ALPHAVEST_E12_CONTRACT_META_CONTRACT";
  activeContractFamilies: ContractFamily[];
  activeTypedContracts: string[];
  activeMarkdownRegisters: string[];
  releaseRelevantCommands: string[];
  exceptionPolicy: {
    existingRegisteredDebt: "warn_existing" | "fail_always";
    newUnregisteredDebt: "fail_new" | "fail_always";
    requireExpiresOrFollowUp: true;
  };
  markdownPolicy: "validate_only" | "generated_read_only" | "hybrid_transition";
};
```

Required active typed contracts:

- `lib/ux-operating-model.ts`
- `lib/ux-page-contract.ts`
- `lib/ux-action-hierarchy-contract.ts`
- `lib/ux-data-surface-contract.ts`
- `lib/ux-lifecycle-state-contract.ts`
- `lib/ux-feedback-message-contract.ts`
- `lib/data-surface-query-contract.ts`
- `lib/ux-proof-reviewer-mode.ts`
- `lib/capture-screen-model-context.ts`

Required active markdown/register inputs:

- `docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md`
- `docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md`
- `docs/ux/ALPHAVEST_E10_RETIRED_PROOF_UI_REGISTER.md`
- `docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md`

## Hard Schema Rules

1. Ledger IDs must be unique.
2. `fulfilled` entries must have owner surfaces and non-markdown evidence.
3. `partial`, `exception` and `blocked` entries must include `expiresOrFollowUp`.
4. `historical` evidence cannot satisfy current release proof.
5. `screenshot` evidence cannot satisfy API/filter/pagination truth.
6. `manual_decision` cannot satisfy implementation or runtime proof by itself.
7. `backend_query_truth` entries with `backend_query_backed` claims must include API/readmodel metadata proof and UI source-truth proof.
8. `register_debt` entries must include original register ID, owner surface and follow-up.
9. Retired patterns remain retired and fail active resurrection.
10. E12 ledger/gate entries are invalid until E12-D1 approves storage and markdown policy.

## Initial Ledger Seed Requirement

E12-I1 must seed entries for at least:

- E00 implementation-first governance.
- E01 operating model.
- E01 design-system foundation.
- E02 page template system.
- E03 proof/reviewer separation.
- E04 lifecycle/state/capture variants.
- E05 action/feedback hierarchy.
- E06 data surface/master-detail.
- E07 client/internal separation.
- E08 visual density/accessibility/status.
- E09 capture QA release proof.
- E10 action-zone register debt.
- E10 data-surface filter register debt.
- E10 retired proof UI register.
- E11 backend data-surface truth.
- E12 contract fulfillment ledger/gate itself.

E12-I2 may then expand E10/E11 into row-level ledger entries such as `E10-AZ-001`, `E10-DSF-001`, `E10-RPU-001` and `E11-DS-001`.

## E12-D1 Decision Inputs

E12-D1 must decide:

1. Ledger format and storage location.
2. Markdown policy: validate-only, generated/read-only, or hybrid transition.
3. Exception policy for existing registered debt.
4. Whether E12-I4 may hard-wire the gate into `phase:check` immediately or only after Q1.

S1 recommendation:

- Use `hybrid-ts-ledger-generated-json`.
- Use `hybrid_transition` for markdown first, then move E10/E11 registers to generated/read-only after E12-I2 proves stable.
- Fail new unregistered debt immediately.
- Warn existing registered exceptions for one burn-down pass, then fail unexpired exceptions.

## Acceptance Result

| E12-S1 Criterion | Result |
| --- | --- |
| Schema contains all explicitly required fields. | PASS |
| Status and proofType values are controlled. | PASS |
| Meta-contract describes active contracts, required surfaces and exceptions. | PASS |
| Exception follow-up is required for partial/exception/blocked. | PASS |
| Schema supports TS ledger plus generated JSON/markdown path for D1. | PASS |
| E12-I1 and E12-I2 are implementable from this spec. | PASS |

## No-UI Confirmation

E12-S1 is a specification artifact only. No visible UI changed, no screenshot was warranted, and no screen/image/state-screen asset was generated.

---

# E12-S2 Contract Gate Rules And Release Definition

Ticket: E12-S2 - Contract Gate Rules and Hardened Release Definition Specification
Status: `E12_S2_SPEC_READY_FOR_D1_APPROVAL`

## Gate Script Contract

Planned script: `scripts/contract-fulfillment-gate.ts`

Required inputs:

| Input | Source | Required |
| --- | --- | --- |
| Contract ledger | `lib/ux-contract-ledger.ts` or D1-approved equivalent | yes |
| E10 action-zone register | `docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md` | yes until generated/read-only |
| E10 data-surface filter register | `docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md` | yes until generated/read-only |
| E10 retired proof UI register | `docs/ux/ALPHAVEST_E10_RETIRED_PROOF_UI_REGISTER.md` | yes until generated/read-only |
| E11 backend data-surface register | `docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md` | yes until generated/read-only |
| package scripts | `package.json` | yes |
| source scan roots | `components`, `lib`, `app/api`, `scripts`, `tests`, `docs/ux` | yes |

Required outputs:

| Output | Path | Required |
| --- | --- | --- |
| JSON report | `reports/contract-fulfillment/latest.json` | yes |
| Markdown report | `docs/v3/proof/e12_contract_fulfillment_report.md` | yes |
| Process exit | `0` when no failures, non-zero when failure rules trip | yes |

The JSON report must include:

- `status`: `pass`, `warn`, or `fail`.
- `countsByStatus`.
- `countsByFamily`.
- `warnings`.
- `failures`.
- `exceptions`.
- `blocked`.
- `releaseCommands`.
- `generatedAt`.

## Gate Rule Families

| Rule ID | Severity | Inputs | Failure Message |
| --- | --- | --- | --- |
| `E12-GATE-LEDGER-PARSE` | failure | ledger module or JSON snapshot | `E12 ledger could not be loaded or parsed.` |
| `E12-GATE-ID-UNIQUENESS` | failure | all ledger entries | `Duplicate contract ledger id: <id>.` |
| `E12-GATE-REQUIRED-FIELDS` | failure | every active ledger entry | `Contract <id> is missing required field <field>.` |
| `E12-GATE-FULFILLED-EVIDENCE` | failure | `fulfilled` entries | `Contract <id> is fulfilled without non-markdown evidence.` |
| `E12-GATE-FOLLOWUP-REQUIRED` | failure | `partial`, `exception`, `blocked` entries | `Contract <id> is <status> without expiresOrFollowUp.` |
| `E12-GATE-HISTORICAL-NOT-RELEASE` | failure | `historical` entries used as release proof | `Contract <id> uses historical evidence as current release proof.` |
| `E12-GATE-SCREENSHOT-NOT-API-PROOF` | failure | entries with API/filter/pagination obligations | `Contract <id> uses screenshot evidence for API/filter/pagination truth.` |
| `E12-GATE-MANUAL-DECISION-NOT-FULFILLMENT` | failure | `fulfilled` entries with only manual decision evidence | `Contract <id> is fulfilled by manual decision only.` |
| `E12-GATE-REGISTER-ID-SYNC` | failure | E10/E11 register IDs and ledger IDs | `Register id <id> has no matching ledger entry.` |
| `E12-GATE-NO-NEW-ACTION-DEBT` | failure | `components/**/*.tsx` and registered E10-AZ owners | `Unregistered local action-class vocabulary found in <file>.` |
| `E12-GATE-NO-NEW-FAKE-FILTERS` | failure | route component filter/search controls and E10-DSF IDs | `Unregistered disabled/static filter debt found in <file>.` |
| `E12-GATE-RETIRED-PROOF-UI` | failure | active implementation files | `Retired ProductGuidance proof UI path re-entered active code: <file>.` |
| `E12-GATE-BACKEND-META` | failure | E11 `backend_query_backed` entries | `Backend query surface <id> lacks required API metadata proof.` |
| `E12-GATE-UI-SOURCE-TRUTH` | failure | E11 UI owner surfaces | `Backend query surface <id> lacks UI source-truth consumption proof.` |
| `E12-GATE-CAPTURE-RELEASE-WARNINGS` | failure for release mode | package scripts and capture reports | `Release capture proof must run with CAPTURE_QA_FAIL_ON_WARNINGS=1.` |
| `E12-GATE-PHASE-CHECK-INTEGRATION` | warning or failure by D1/I4 policy | `package.json` | `phase:check does not include contract fulfillment gate.` |

## Rule Details

### Ledger Integrity

The gate must validate the ledger before any source scan:

1. Load the D1-approved ledger source.
2. Check duplicate IDs.
3. Check required fields.
4. Check proof/status/follow-up invariants.
5. Check that every referenced owner surface exists unless the entry is `planned`, `historical` or explicitly `blocked`.

Expected negative test cases:

- Duplicate ID fails.
- Missing `ownerSurface` fails for active entries.
- `exception` without follow-up fails.
- `fulfilled` with markdown-only evidence fails.

### E10 Action And Filter Debt

The gate must not rely on prose only. It must scan for the concrete debt signatures already governed by E10:

- `primaryButtonClass`
- `secondaryButtonClass`
- `staticButtonClass`
- `destructiveButtonClass`
- `data-ux-e10-filter-exception-id`
- `data-ux-data-surface-filter-state="disabled_static"`

Rules:

- Existing registered E10-AZ and E10-DSF files may warn under the approved transition policy.
- New unregistered files fail immediately.
- Registered entries must carry a ledger ID and follow-up.
- First-slice files must continue projecting from the canonical contracts where E10 already requires it.

Expected negative test cases:

- Add a fixture component with `const primaryButtonClass =` and no ledger/register ID: fail.
- Add a disabled filter without `data-ux-e10-filter-exception-id`: fail.
- Add a registered exception without follow-up: fail.

### Retired Proof UI

The gate must enforce retirement, not just documentation.

Forbidden in active implementation code:

- `components/product-guidance-panel.tsx`
- `lib/product-guidance.ts`
- Active imports from `@/lib/product-guidance`
- Active imports from `@/components/product-guidance-panel`

Allowed:

- Historical docs and proof reports.
- Explicit deprecated shim only if D1 or later user approval names it and the gate marks it as `retired`/`exception` with follow-up.

Expected negative test case:

- Fixture file imports `@/lib/product-guidance`: fail with `E12-GATE-RETIRED-PROOF-UI`.

### E11 Backend Query Truth

For every ledger entry that claims `backend_query_backed`, the gate must require:

- API/readmodel metadata proof with `sourceTruth: "backend_query_backed"`.
- Required meta fields: `page`, `pageSize`, `returnedRows`, `totalRows`, `totalPages`, `hasNextPage`, `hasPreviousPage`, `sortKey`, `sortDirection`, `query`.
- Safety metadata proof with `hiddenRowsDisclosed: false` and scoped access.
- UI source-truth consumption proof for visible DB-backed/filter/pagination claims.

Expected negative test cases:

- Ledger marks E11 surface fulfilled but evidence lacks API test: fail.
- API metadata lacks `totalRows`: fail.
- UI claims DB-backed but lacks source-truth owner/proof: fail.
- Screenshot is the only proof for pagination: fail.

### Capture QA Release Proof

Capture QA is a release-proof contract, not a screenshot convention.

Rules:

- Old capture bundles are `historical` unless the current run and E09 report prove otherwise.
- New release captures must use `pnpm visual:capture-qa:release`.
- `visual:capture-qa:release` must include `CAPTURE_QA_FAIL_ON_WARNINGS=1`.
- Capture warnings cannot satisfy release proof in release mode.
- No screen/image/state-screen assets are generated by E12 unless a later UI ticket explicitly changes visible UI and requests screenshots.

Expected negative test cases:

- Release report points only to an old artifact folder: fail.
- Package script drops `CAPTURE_QA_FAIL_ON_WARNINGS=1`: fail.
- New release-capture proof has warnings and is marked fulfilled: fail.

## Hardened Release Definition

Minimum release-relevant command bundle:

```bash
pnpm guard:source
pnpm test:route-smoke
pnpm test:contract-fulfillment
```

Conditional release commands:

```bash
pnpm visual:capture-qa:release
```

Run this when new release captures are produced or when release capture proof is part of the certification claim.

Focused touched-contract tests:

| Contract Area | Focused Command |
| --- | --- |
| E10 registers | `playwright test tests/e10-register-reconciliation.spec.ts` |
| E11 backend data surfaces | `playwright test tests/e11-backend-data-surface-truth.spec.ts tests/ux-data-surface-contract.spec.ts` |
| E09 capture QA | `playwright test tests/capture-qa-contract.spec.ts tests/e09-capture-release-policy.spec.ts` |
| Action / feedback | `playwright test tests/ux-action-hierarchy-contract.spec.ts tests/ux-feedback-message-contract.spec.ts` |
| Proof reviewer | `playwright test tests/ux-proof-reviewer-mode.spec.ts` |
| Lifecycle state | `playwright test tests/ux-lifecycle-state-contract.spec.ts` |
| Client visibility | `playwright test tests/client-visibility-proof.spec.ts tests/true-ux-client-projection.spec.ts` |

`phase:check` policy:

- E12-I4 must add `test:contract-fulfillment` as a package script.
- `phase:check` should not be hard-wired until D1/I4 approval unless the current report is clean.
- Bold recommendation: after Q1 produces a clean or explicitly excepted report, add `pnpm test:contract-fulfillment` to `phase:check` so contract fulfillment is no longer optional.

## Implementation Subtasks For E12-I3

| Subtask | Scope |
| --- | --- |
| `E12-I3.1` | Ledger parse, duplicate ID, required field and exception follow-up checks. |
| `E12-I3.2` | Action/filter/proof UI debt source-scan checks. |
| `E12-I3.3` | Backend query metadata and UI source-truth proof checks. |
| `E12-I3.4` | Retired proof UI and capture release-warning checks. |
| `E12-I3.5` | Positive and negative gate test suite plus JSON/markdown report checks. |

## D1 Decisions Required Before Implementation

E12-D1 must approve:

1. Ledger format and canonical storage.
2. Markdown register policy.
3. Existing exception hardening policy.
4. Whether `phase:check` integration is immediate or after Q1.

Recommended approval token:

`APPROVE_E12_HYBRID_LEDGER_WARN_EXISTING_FAIL_NEW_GENERATE_MARKDOWN_AFTER_Q1`

Meaning:

- Canonical source is `lib/ux-contract-ledger.ts`.
- JSON/report artifacts are generated or script-produced outputs.
- Markdown registers are validate-only during I1/I2, then generated/read-only after Q1 if stable.
- Existing registered exceptions warn for one burn-down pass.
- New unregistered debt fails immediately.
- `test:contract-fulfillment` is added first; `phase:check` hard-wiring happens after Q1 unless the user explicitly approves immediate hard CI.

## E12-S2 Acceptance Result

| E12-S2 Criterion | Result |
| --- | --- |
| Every gate rule has testable inputs and failure messages. | PASS |
| Every exception requires `expiresOrFollowUp`. | PASS |
| Release definition separates source guard, smoke, contract fulfillment, visual capture QA and focused tests. | PASS |
| Rules are split into implementation subtasks. | PASS |
| Retired Pattern and Capture-QA checks are testable gate contracts. | PASS |

## No-UI Confirmation

E12-S2 is a specification artifact only. No visible UI changed, no screenshot was warranted, and no screen/image/state-screen asset was generated.

---

# E12-D1 Ledger Format And Markdown Policy Approval

Ticket: E12-D1 - Ledger Format and Markdown Policy Approval
Status: `APPROVED`
Approved token: `APPROVE_E12_HYBRID_LEDGER_WARN_EXISTING_FAIL_NEW_GENERATE_MARKDOWN_AFTER_Q1`
Decision date: 2026-06-27

## Approved Policy

| Decision Area | Approved Policy |
| --- | --- |
| Canonical ledger source | `lib/ux-contract-ledger.ts` is the canonical machine-readable E12 meta-contract. |
| Generated outputs | JSON/report outputs are generated or script-produced review artifacts, not hand-maintained truth. |
| Markdown policy during I1/I2 | E10/E11 markdown registers remain validate-only review surfaces while the ledger and register mappings stabilize. |
| Markdown policy after Q1 | Move E10/E11 markdown registers toward generated/read-only from the ledger after Q1 proves the first gate report is clean or explicitly excepted. |
| Existing registered debt | Existing registered exceptions warn for one burn-down pass and must carry `expiresOrFollowUp`. |
| New unregistered debt | New unregistered debt fails immediately. |
| `phase:check` integration | Add `test:contract-fulfillment` first; hard-wire it into `phase:check` after Q1 unless later evidence is clean or explicitly excepted. |

## Implementation Consequences

- E12-I1 may create `lib/ux-contract-ledger.ts`.
- E12-I1 may add typed schema, initial entries, helper validation functions and focused ledger tests.
- E12-I2 may map E10/E11 register rows into ledger entries and update source gates to consume ledger exports where practical.
- E12-I3 may build the global gate with warning behavior for existing registered debt and hard failure for new unregistered debt.
- E12-I4 may add `test:contract-fulfillment` as a package script but must not hard-wire `phase:check` before the approved Q1 condition.

## No-UI Confirmation

E12-D1 is a decision record only. No visible UI changed, no screenshot was warranted, and no screen/image/state-screen asset was generated.

---

# E12-I4 Release Script Integration

Ticket: E12-I4 - Integrate Contract Gate into phase:check / CI Release Flow
Status: `IMPLEMENTED_SCRIPT_ONLY_PHASE_CHECK_DEFERRED_TO_Q1`

## Implemented Release Boundary

| Area | Result |
| --- | --- |
| Package script | `test:contract-fulfillment` runs `tsx scripts/contract-fulfillment-gate.ts`. |
| Gate report | Running the script updates `docs/v3/proof/e12_contract_fulfillment_report.md` and ignored JSON under `reports/contract-fulfillment/latest.json`. |
| `phase:check` | Unchanged by design. D1 approved hard-wiring only after Q1 unless explicitly approved earlier by clean/excepted evidence. |
| Release definition | Minimum release bundle now includes `pnpm guard:source`, `pnpm test:route-smoke`, `pnpm test:contract-fulfillment`, and conditional `pnpm visual:capture-qa:release` when new release captures are produced. |

## No-UI Confirmation

E12-I4 is package-script/release-definition work only. No visible UI changed, no screenshot was warranted, and no screen/image/state-screen asset was generated.
