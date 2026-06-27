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
