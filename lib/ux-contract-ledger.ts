export type ContractFamily =
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
  | "operational_visual_audit"
  | "register_debt"
  | "backend_query_truth"
  | "contract_fulfillment";

export type ProofType =
  | "source_gate"
  | "runtime_test"
  | "api_test"
  | "screenshot"
  | "screenshot_audit"
  | "typed_contract"
  | "generated_report"
  | "manual_decision";

export type FulfillmentStatus =
  | "fulfilled"
  | "partial"
  | "exception"
  | "blocked"
  | "retired"
  | "historical"
  | "planned";

export type GateBehavior =
  | "pass"
  | "warn_existing"
  | "fail_new"
  | "fail_always"
  | "report_only";

export type ContractSourceKind =
  | "upload"
  | "markdown_spec"
  | "markdown_register"
  | "typed_contract"
  | "source_gate"
  | "api_test"
  | "manual_decision";

export type ContractSource = {
  kind: ContractSourceKind;
  ref: string;
};

export type EvidenceAnchor = {
  kind: "file" | "test" | "command" | "script" | "api" | "route" | "report" | "decision";
  ref: string;
  result?: "pass" | "fail" | "not_run" | "historical" | "planned";
  notes?: string;
};

export type OwnerSurface = {
  kind: "file" | "route" | "api" | "script" | "test" | "report" | "package_script";
  ref: string;
};

export type UxContractLedgerEntry = {
  id: string;
  title: string;
  source: ContractSource[];
  contractFamily: ContractFamily;
  ownerSurface: OwnerSurface[];
  obligation: string;
  proofType: ProofType[];
  status: FulfillmentStatus;
  evidence: EvidenceAnchor[];
  gateBehavior: GateBehavior;
  expiresOrFollowUp: string | null;
  sourceRegisterId?: string;
  registerDecision?: "migrate_first_slice" | "temporary_exception" | "migrate_later" | "migrate_with_data_surface" | "keep_canonical" | "keep_backend_backed_with_exception" | "retire_now" | "retired_by_backend_query_contract" | "rename_or_retire" | "migrate_now" | "keep_historical";
  currentClass?: string;
  targetClass?: string;
  notes?: string;
};

export type UxContractMetaContract = {
  id: "ALPHAVEST_E12_CONTRACT_META_CONTRACT";
  approvalToken: "APPROVE_E12_HYBRID_LEDGER_WARN_EXISTING_FAIL_NEW_GENERATE_MARKDOWN_AFTER_Q1";
  activeContractFamilies: ContractFamily[];
  activeTypedContracts: string[];
  activeMarkdownRegisters: string[];
  releaseRelevantCommands: string[];
  exceptionPolicy: {
    existingRegisteredDebt: "warn_existing";
    newUnregisteredDebt: "fail_new";
    requireExpiresOrFollowUp: true;
  };
  markdownPolicy: "hybrid_transition";
  stageCheckPolicy: "add_contract_script_first_hardwire_after_q1";
};

export const uxContractMetaContract: UxContractMetaContract = {
  id: "ALPHAVEST_E12_CONTRACT_META_CONTRACT",
  approvalToken: "APPROVE_E12_HYBRID_LEDGER_WARN_EXISTING_FAIL_NEW_GENERATE_MARKDOWN_AFTER_Q1",
  activeContractFamilies: [
    "release_gate",
    "operating_model",
    "design_system",
    "page_template",
    "proof_reviewer",
    "lifecycle_state",
    "action_feedback",
    "data_surface",
    "client_visibility",
    "visual_accessibility",
    "operational_visual_audit",
    "register_debt",
    "backend_query_truth",
    "contract_fulfillment",
  ],
  activeTypedContracts: [
    "lib/ux-operating-model.ts",
    "lib/ux-page-contract.ts",
    "lib/ux-action-hierarchy-contract.ts",
    "lib/ux-data-surface-contract.ts",
    "lib/ux-lifecycle-state-contract.ts",
    "lib/ux-feedback-message-contract.ts",
    "lib/data-surface-query-contract.ts",
    "lib/capture-screen-model-context.ts",
  ],
  activeMarkdownRegisters: [
    "docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md",
    "docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md",
    "docs/ux/ALPHAVEST_E10_RETIRED_PROOF_UI_REGISTER.md",
    "docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md",
    "docs/ux/ALPHAVEST_E12_LONG_SCREEN_BURNDOWN_REGISTER.md",
  ],
  releaseRelevantCommands: [
    "pnpm guard:source",
    "pnpm test:route-smoke",
    "pnpm test:contract-fulfillment",
    "pnpm visual:audit-operational",
    "pnpm visual:capture-routes:release-candidate",
    "pnpm release:contract-check",
  ],
  exceptionPolicy: {
    existingRegisteredDebt: "warn_existing",
    newUnregisteredDebt: "fail_new",
    requireExpiresOrFollowUp: true,
  },
  markdownPolicy: "hybrid_transition",
  stageCheckPolicy: "add_contract_script_first_hardwire_after_q1",
};

const uploadSource: ContractSource = {
  kind: "upload",
  ref: "/Users/chris/Downloads/alphavest/ALPHAVEST_E12_CONTRACT_FULFILLMENT_LEDGER_GATE_TICKET_STRUCTURE.json",
};

function markdownSpec(ref: string): ContractSource {
  return { kind: "markdown_spec", ref };
}

function markdownRegister(ref: string): ContractSource {
  return { kind: "markdown_register", ref };
}

function typedContract(ref: string): ContractSource {
  return { kind: "typed_contract", ref };
}

function owner(kind: OwnerSurface["kind"], ref: string): OwnerSurface {
  return { kind, ref };
}

function evidence(kind: EvidenceAnchor["kind"], ref: string, result: EvidenceAnchor["result"] = "pass"): EvidenceAnchor {
  return { kind, ref, result };
}

export const uxContractLedgerEntries: readonly UxContractLedgerEntry[] = [
  {
    id: "E00-IMPLEMENTATION-FIRST",
    title: "Implementation-first contract governance",
    source: [markdownSpec("docs/ux/ALPHAVEST_E00_IMPLEMENTATION_FIRST_RULES.md")],
    contractFamily: "release_gate",
    ownerSurface: [
      owner("script", "scripts/source-target-guard.ts"),
      owner("test", "tests/source-reality-gate.spec.ts"),
    ],
    obligation: "Contracts/specifications are prerequisites and acceptance anchors, not delivery completion.",
    proofType: ["source_gate", "generated_report"],
    status: "partial",
    evidence: [
      evidence("command", "pnpm guard:source"),
      evidence("test", "tests/source-reality-gate.spec.ts"),
      evidence("report", "docs/v3/proof/e12_contract_fulfillment_inventory_report.md"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-Q1 validates contract fulfillment gate before release use.",
  },
  {
    id: "E01-OPERATING-MODEL",
    title: "Canonical UX operating model",
    source: [
      markdownSpec("docs/ux/ALPHAVEST_E01_UX_OPERATING_MODEL_SPEC.md"),
      typedContract("lib/ux-operating-model.ts"),
    ],
    contractFamily: "operating_model",
    ownerSurface: [
      owner("file", "lib/ux-operating-model.ts"),
      owner("file", "lib/ux-page-contract.ts"),
      owner("file", "lib/capture-screen-model-context.ts"),
      owner("test", "tests/ux-operating-model.spec.ts"),
    ],
    obligation: "Every route resolves to one canonical operating mode, audience and proof posture.",
    proofType: ["typed_contract", "source_gate", "runtime_test"],
    status: "fulfilled",
    evidence: [
      evidence("file", "lib/ux-operating-model.ts"),
      evidence("test", "tests/ux-operating-model.spec.ts"),
    ],
    gateBehavior: "pass",
    expiresOrFollowUp: null,
  },
  {
    id: "E01-DESIGN-SYSTEM",
    title: "Design-system primitive foundation",
    source: [markdownSpec("docs/ux/ALPHAVEST_E01_DESIGN_SYSTEM_FOUNDATION_SPEC.md")],
    contractFamily: "design_system",
    ownerSurface: [
      owner("file", "lib/ux-design-system-foundation.ts"),
      owner("test", "tests/ux-design-system-foundation.spec.ts"),
    ],
    obligation: "Primitive density, text role and semantic status behavior projects from shared contracts.",
    proofType: ["typed_contract", "runtime_test"],
    status: "partial",
    evidence: [
      evidence("file", "lib/ux-design-system-foundation.ts"),
      evidence("test", "tests/ux-design-system-foundation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-Q1 classifies remaining primitive proof gaps.",
  },
  {
    id: "E02-PAGE-TEMPLATE-SYSTEM",
    title: "Canonical page template system",
    source: [markdownSpec("docs/ux/ALPHAVEST_E02_PAGE_TEMPLATE_SYSTEM_SPEC.md")],
    contractFamily: "page_template",
    ownerSurface: [
      owner("file", "lib/ux-page-template-system.ts"),
      owner("file", "components/ui/page-template.tsx"),
      owner("test", "tests/e02-page-template-runtime.spec.ts"),
    ],
    obligation: "Page/template hierarchy and route family proof placement resolve through shared page contracts.",
    proofType: ["typed_contract", "runtime_test"],
    status: "partial",
    evidence: [
      evidence("file", "lib/ux-page-template-system.ts"),
      evidence("test", "tests/e02-page-template-runtime.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-Q1 classifies template proof completeness.",
  },
  {
    id: "E04-LIFECYCLE-STATE",
    title: "Lifecycle state and capture variant contract",
    source: [
      markdownSpec("docs/ux/ALPHAVEST_E04_STATE_MODAL_DRAWER_LIFECYCLE_SPEC.md"),
      typedContract("lib/ux-lifecycle-state-contract.ts"),
    ],
    contractFamily: "lifecycle_state",
    ownerSurface: [
      owner("file", "lib/ux-lifecycle-state-contract.ts"),
      owner("file", "components/ui/modal.tsx"),
      owner("file", "components/ui/drawer.tsx"),
      owner("file", "components/ui/state-panel.tsx"),
      owner("test", "tests/ux-lifecycle-state-contract.spec.ts"),
    ],
    obligation: "Modal, drawer, base state and capture variants use canonical lifecycle/state metadata.",
    proofType: ["typed_contract", "runtime_test", "screenshot_audit"],
    status: "fulfilled",
    evidence: [
      evidence("file", "lib/ux-lifecycle-state-contract.ts"),
      evidence("test", "tests/ux-lifecycle-state-contract.spec.ts"),
    ],
    gateBehavior: "pass",
    expiresOrFollowUp: null,
  },
  {
    id: "E05-ACTION-FEEDBACK",
    title: "Action hierarchy and no-overclaim feedback",
    source: [
      markdownSpec("docs/ux/ALPHAVEST_E05_ACTION_HIERARCHY_SPEC.md"),
      markdownSpec("docs/ux/ALPHAVEST_E05_ACTION_FEEDBACK_IMPLEMENTATION_SPEC.md"),
      typedContract("lib/ux-action-hierarchy-contract.ts"),
      typedContract("lib/ux-feedback-message-contract.ts"),
    ],
    contractFamily: "action_feedback",
    ownerSurface: [
      owner("file", "lib/ux-action-hierarchy-contract.ts"),
      owner("file", "lib/ux-feedback-message-contract.ts"),
      owner("file", "components/ui/action-zone.tsx"),
      owner("test", "tests/ux-action-hierarchy-contract.spec.ts"),
      owner("test", "tests/ux-feedback-message-contract.spec.ts"),
    ],
    obligation: "Action hierarchy, availability, disabled reasons and feedback messages project from canonical contracts.",
    proofType: ["typed_contract", "source_gate", "runtime_test"],
    status: "partial",
    evidence: [
      evidence("file", "lib/ux-action-hierarchy-contract.ts"),
      evidence("file", "lib/ux-feedback-message-contract.ts"),
      evidence("test", "tests/ux-action-hierarchy-contract.spec.ts"),
      evidence("test", "tests/ux-feedback-message-contract.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-I2.1 maps remaining E10 action-zone debt into ledger entries.",
  },
  {
    id: "E06-DATA-SURFACE-MASTER-DETAIL",
    title: "Data surface and master-detail contract",
    source: [
      markdownSpec("docs/ux/ALPHAVEST_E06_DATA_SURFACE_MASTER_DETAIL_SPEC.md"),
      typedContract("lib/ux-data-surface-contract.ts"),
    ],
    contractFamily: "data_surface",
    ownerSurface: [
      owner("file", "lib/ux-data-surface-contract.ts"),
      owner("file", "components/ui/data-table.tsx"),
      owner("file", "components/ui/filter-bar.tsx"),
      owner("test", "tests/ux-data-surface-contract.spec.ts"),
    ],
    obligation: "Shared table/filter/master-detail surfaces expose accurate density, filter-state and source-truth claims.",
    proofType: ["typed_contract", "runtime_test", "api_test"],
    status: "partial",
    evidence: [
      evidence("file", "lib/ux-data-surface-contract.ts"),
      evidence("test", "tests/ux-data-surface-contract.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-I2.2 maps E11 backend data-surface proof obligations.",
  },
  {
    id: "E07-CLIENT-INTERNAL-SEPARATION",
    title: "Client-safe and internal UI separation",
    source: [markdownSpec("docs/ux/ALPHAVEST_E07_CLIENT_INTERNAL_SEPARATION_SPEC.md")],
    contractFamily: "client_visibility",
    ownerSurface: [
      owner("file", "lib/ux-client-safe-ui-boundary.ts"),
      owner("test", "tests/client-visibility-proof.spec.ts"),
      owner("test", "tests/true-ux-client-projection.spec.ts"),
    ],
    obligation: "Client-facing UI suppresses internal rationale, debug/proof metadata and unreleased payloads.",
    proofType: ["typed_contract", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("file", "lib/ux-client-safe-ui-boundary.ts"),
      evidence("test", "tests/client-visibility-proof.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-Q1 confirms no-leakage proof coverage used by contract fulfillment.",
  },
  {
    id: "E08-VISUAL-DENSITY-A11Y",
    title: "Visual density, focus and semantic status",
    source: [markdownSpec("docs/ux/ALPHAVEST_E08_VISUAL_DENSITY_ACCESSIBILITY_SPEC.md")],
    contractFamily: "visual_accessibility",
    ownerSurface: [
      owner("file", "lib/ux-design-system-foundation.ts"),
      owner("test", "tests/ux-design-system-foundation.spec.ts"),
      owner("test", "tests/true-ux-a11y.spec.ts"),
    ],
    obligation: "Focus, selected, semantic status and density states are shared primitive behavior.",
    proofType: ["typed_contract", "runtime_test", "screenshot"],
    status: "partial",
    evidence: [
      evidence("file", "lib/ux-design-system-foundation.ts"),
      evidence("test", "tests/ux-design-system-foundation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-Q1 confirms current visual/accessibility proof coverage.",
  },
  {
    id: "E09-OPERATIONAL-SCREENSHOT-AUDIT-PROOF",
    title: "Operational screenshot audit release proof",
    source: [markdownSpec("docs/ux/ALPHAVEST_OPERATIONAL_UI_NON_NEGOTIABLE.md")],
    contractFamily: "operational_visual_audit",
    ownerSurface: [
      owner("package_script", "visual:audit-operational"),
      owner("package_script", "release:contract-check"),
      owner("test", "tests/operational-visual-audit.spec.ts"),
      owner("test", "tests/e09-capture-release-policy.spec.ts"),
    ],
    obligation: "Every UI screenshot proof used for release must be paired with the 1400x900 operational screenshot audit.",
    proofType: ["screenshot_audit", "source_gate", "runtime_test"],
    status: "fulfilled",
    evidence: [
      evidence("test", "tests/operational-visual-audit.spec.ts"),
      evidence("test", "tests/e09-capture-release-policy.spec.ts"),
      evidence("command", "pnpm visual:audit-operational", "pass"),
    ],
    gateBehavior: "fail_always",
    expiresOrFollowUp: null,
    notes: "Legacy capture QA scripts were removed. Operational screenshots now require the route-level 1400x900 audit instead of offline capture bundle metadata.",
  },
  {
    id: "E12-LEGACY-CAPTURE-QA-RETIRED-001",
    title: "Legacy capture QA quarantine retired",
    source: [
      uploadSource,
      { kind: "manual_decision", ref: "APPROVE_E12_OPERATIONAL_SCREENSHOT_AUDIT_AND_LONG_SCREEN_BURNDOWN" },
      markdownRegister("docs/ux/ALPHAVEST_E12_LONG_SCREEN_BURNDOWN_REGISTER.md"),
    ],
    contractFamily: "operational_visual_audit",
    ownerSurface: [
      owner("file", "docs/ux/ALPHAVEST_E12_LONG_SCREEN_BURNDOWN_REGISTER.md"),
      owner("test", "tests/capture-routes-and-modals-contract.spec.ts"),
      owner("test", "tests/e09-capture-release-policy.spec.ts"),
    ],
    obligation: "Legacy capture QA scripts must stay retired; screenshot acceptance moves to operational visual audit.",
    proofType: ["screenshot_audit", "source_gate", "manual_decision"],
    status: "retired",
    evidence: [
      evidence("decision", "APPROVE_E12_OPERATIONAL_SCREENSHOT_AUDIT_AND_LONG_SCREEN_BURNDOWN"),
      evidence("test", "tests/e09-capture-release-policy.spec.ts"),
      evidence("file", "docs/ux/ALPHAVEST_E12_LONG_SCREEN_BURNDOWN_REGISTER.md"),
    ],
    gateBehavior: "fail_always",
    expiresOrFollowUp: null,
  },
  {
    id: "E12-RELEASE-GATE-001",
    title: "Bundled release contract check",
    source: [
      uploadSource,
      { kind: "manual_decision", ref: "APPROVE_E12_RELEASE_CONTRACT_CHECK_LEDGER_GATE" },
    ],
    contractFamily: "release_gate",
    ownerSurface: [
      owner("package_script", "release:contract-check"),
      owner("package_script", "guard:source"),
      owner("package_script", "test:contract-fulfillment"),
      owner("package_script", "test:route-smoke"),
      owner("package_script", "visual:audit-operational"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
      owner("test", "tests/e09-capture-release-policy.spec.ts"),
      owner("test", "tests/ux-data-surface-contract.spec.ts"),
    ],
    obligation: "Release contract claims must use one hard command that bundles source guard, ledger fulfillment, E10/E11 truth, route smoke and operational screenshot audit.",
    proofType: ["source_gate", "runtime_test", "api_test", "screenshot_audit", "typed_contract"],
    status: "fulfilled",
    evidence: [
      evidence("command", "pnpm release:contract-check", "planned"),
      evidence("test", "tests/contract-fulfillment-gate.spec.ts"),
      evidence("file", "package.json"),
    ],
    gateBehavior: "fail_always",
    expiresOrFollowUp: null,
    notes: "The command is intentionally separate from check:full; the ledger gate fails if this command loses any required constituent gate.",
  },
  {
    id: "E10-ACTION-ZONE-REGISTER",
    title: "Action-zone migration register debt",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Local action-class vocabularies are registered migration debt and cannot grow outside the ledger.",
    proofType: ["source_gate", "typed_contract"],
    status: "exception",
    evidence: [
      evidence("file", "docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-I2.1 converts action-zone rows into ledger IDs and follow-ups.",
  },
  {
    id: "E10-AZ-001",
    title: "Admin tenant setup action-zone migration",
    sourceRegisterId: "AZ-001",
    registerDecision: "migrate_first_slice",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/admin-tenant-setup-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Admin tenant setup local action-class vocabulary remains registered debt and must project from the E05 action contract when touched.",
    proofType: ["source_gate", "typed_contract"],
    status: "exception",
    evidence: [
      evidence("file", "components/admin-tenant-setup-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I1",
  },
  {
    id: "E10-AZ-002",
    title: "Auth onboarding action-zone exception",
    sourceRegisterId: "AZ-002",
    registerDecision: "temporary_exception",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/auth-onboarding-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Auth/onboarding local action classes remain a temporary exception until form semantics are separated from workflow action zones.",
    proofType: ["source_gate"],
    status: "exception",
    evidence: [
      evidence("file", "components/auth-onboarding-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I1-followup-auth",
  },
  {
    id: "E10-AZ-003",
    title: "Client intake action-zone migration",
    sourceRegisterId: "AZ-003",
    registerDecision: "migrate_first_slice",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/client-intake-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Client intake action groups remain registered migration debt and should expand ActionZone adoption around document/entity actions.",
    proofType: ["source_gate", "typed_contract"],
    status: "exception",
    evidence: [
      evidence("file", "components/client-intake-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I1",
  },
  {
    id: "E10-AZ-004",
    title: "Committee review action-zone exception",
    sourceRegisterId: "AZ-004",
    registerDecision: "temporary_exception",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/committee-review-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Committee detail actions are now internal support controls and must stay workflow-backed, audited and non-release.",
    proofType: ["source_gate"],
    status: "fulfilled",
    evidence: [
      evidence("file", "components/committee-review-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "committee-detail-service-backed-unlock",
  },
  {
    id: "E10-AZ-005",
    title: "Communication/export action-zone migration",
    sourceRegisterId: "AZ-005",
    registerDecision: "migrate_first_slice",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/communication-export-ops-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Communication/export actions remain registered migration debt and should separate export approval/download/share via ActionButton.",
    proofType: ["source_gate", "typed_contract"],
    status: "exception",
    evidence: [
      evidence("file", "components/communication-export-ops-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I1",
  },
  {
    id: "E10-AZ-006",
    title: "Decisions governance action-zone migration",
    sourceRegisterId: "AZ-006",
    registerDecision: "migrate_first_slice",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/decisions-governance-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Decision/governance release, block and evidence actions remain registered migration debt and must not expand outside the ledger.",
    proofType: ["source_gate", "typed_contract"],
    status: "exception",
    evidence: [
      evidence("file", "components/decisions-governance-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I1",
  },
  {
    id: "E10-AZ-007",
    title: "Internal workflow action-zone migration",
    sourceRegisterId: "AZ-007",
    registerDecision: "migrate_first_slice",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/internal-workflow-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Internal workflow action classes remain registered migration debt and must project through canonical action hierarchy.",
    proofType: ["source_gate", "typed_contract"],
    status: "exception",
    evidence: [
      evidence("file", "components/internal-workflow-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I1",
  },
  {
    id: "E10-AZ-008",
    title: "KYC workflow action-zone exception",
    sourceRegisterId: "AZ-008",
    registerDecision: "temporary_exception",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/kyc-aml-workflow-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "KYC workflow action classes remain a registered safety workflow exception until action meanings are mapped.",
    proofType: ["source_gate"],
    status: "exception",
    evidence: [
      evidence("file", "components/kyc-aml-workflow-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I1-followup-kyc",
  },
  {
    id: "E10-AZ-009",
    title: "Review monitoring action-zone migration",
    sourceRegisterId: "AZ-009",
    registerDecision: "migrate_later",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/review-monitoring-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Review monitoring action classes remain registered debt until filter exception cleanup is stable.",
    proofType: ["source_gate"],
    status: "exception",
    evidence: [
      evidence("file", "components/review-monitoring-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I2-followup",
  },
  {
    id: "E10-AZ-010",
    title: "Suitability IPS action-zone exception",
    sourceRegisterId: "AZ-010",
    registerDecision: "temporary_exception",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/suitability-ips-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Suitability/IPS action classes remain registered debt until advice/release safety action meanings are mapped.",
    proofType: ["source_gate"],
    status: "exception",
    evidence: [
      evidence("file", "components/suitability-ips-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I1-followup-suitability",
  },
  {
    id: "E10-AZ-011",
    title: "Wealth actions board action-zone migration",
    sourceRegisterId: "AZ-011",
    registerDecision: "migrate_with_data_surface",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_ACTION_ZONE_MIGRATION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/wealth-actions-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Wealth action board controls remain registered debt and should migrate with board/data-surface filter cleanup.",
    proofType: ["source_gate"],
    status: "exception",
    evidence: [
      evidence("file", "components/wealth-actions-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I2",
  },
  {
    id: "E10-DATA-SURFACE-FILTER-REGISTER",
    title: "Disabled/static filter exception register debt",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Disabled/static filter controls require canonical metadata or explicit temporary exception IDs.",
    proofType: ["source_gate", "runtime_test"],
    status: "exception",
    evidence: [
      evidence("file", "docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-I2.1 converts filter exception rows into ledger IDs and follow-ups.",
  },
  {
    id: "E10-DSF-001",
    title: "Admin tenant directory disabled filter exception",
    sourceRegisterId: "DSF-001",
    registerDecision: "migrate_first_slice",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/admin-tenant-setup-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Tenant directory static filter affordance requires disabled-static metadata and a ledger/register ID until migrated.",
    proofType: ["source_gate", "runtime_test"],
    status: "exception",
    evidence: [
      evidence("file", "components/admin-tenant-setup-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I2",
  },
  {
    id: "E10-DSF-002",
    title: "Admin tenant users disabled filter exception retired",
    sourceRegisterId: "DSF-002",
    registerDecision: "retired_by_backend_query_contract",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/admin-tenant-setup-screen.tsx"),
      owner("api", "app/api/admin-tenants/route.ts"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Tenant users no longer carry a disabled filter exception in source because E11 backend query metadata owns the filter truth.",
    proofType: ["source_gate", "api_test"],
    status: "retired",
    evidence: [
      evidence("file", "components/admin-tenant-setup-screen.tsx"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "pass",
    expiresOrFollowUp: null,
  },
  {
    id: "E10-DSF-003",
    title: "Communication/export queue disabled filter exception",
    sourceRegisterId: "DSF-003",
    registerDecision: "migrate_first_slice",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/communication-export-ops-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Export/communication queue disabled filters require disabled-static metadata and a ledger/register ID until migrated.",
    proofType: ["source_gate", "runtime_test"],
    status: "exception",
    evidence: [
      evidence("file", "components/communication-export-ops-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I2",
  },
  {
    id: "E10-DSF-004",
    title: "Decision governance evidence filter exception",
    sourceRegisterId: "DSF-004",
    registerDecision: "retired_by_backend_query_contract",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/decisions-governance-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Evidence vault uses backend query controls through the document read model.",
    proofType: ["source_gate", "runtime_test"],
    status: "retired",
    evidence: [
      evidence("file", "components/decisions-governance-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "pass",
    expiresOrFollowUp: null,
  },
  {
    id: "E10-DSF-005",
    title: "Internal workflow canonical disabled filter exemplar",
    sourceRegisterId: "DSF-005",
    registerDecision: "keep_canonical",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/internal-workflow-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Advisor/compliance queues already use canonical FilterBar disabled-static state and remain the proof exemplar.",
    proofType: ["source_gate", "runtime_test"],
    status: "fulfilled",
    evidence: [
      evidence("file", "components/internal-workflow-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "pass",
    expiresOrFollowUp: null,
  },
  {
    id: "E10-DSF-006",
    title: "Review monitoring disabled filter exception",
    sourceRegisterId: "DSF-006",
    registerDecision: "migrate_later",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/review-monitoring-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Review schedule local disabled filter controls remain registered debt until the filter gate is stable.",
    proofType: ["source_gate"],
    status: "exception",
    evidence: [
      evidence("file", "components/review-monitoring-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I2-followup",
  },
  {
    id: "E10-DSF-007",
    title: "Wealth actions board disabled filter exception",
    sourceRegisterId: "DSF-007",
    registerDecision: "migrate_first_slice",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/wealth-actions-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Action board disabled filters and summaries require canonical disabled-static metadata or a board adapter.",
    proofType: ["source_gate", "runtime_test"],
    status: "exception",
    evidence: [
      evidence("file", "components/wealth-actions-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I2",
  },
  {
    id: "E10-DSF-008",
    title: "Client intake access filter disabled-static boundary",
    sourceRegisterId: "DSF-008",
    registerDecision: "keep_backend_backed_with_exception",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/client-intake-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "Document page real DB-backed filters may remain, but the access filter boundary must stay explicitly disabled-static.",
    proofType: ["source_gate", "runtime_test"],
    status: "exception",
    evidence: [
      evidence("file", "components/client-intake-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I2",
  },
  {
    id: "E10-DSF-009",
    title: "KYC workflow search exception",
    sourceRegisterId: "DSF-009",
    registerDecision: "temporary_exception",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_DATA_SURFACE_FILTER_EXCEPTION_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "components/kyc-aml-workflow-screen.tsx"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    obligation: "KYC search controls remain registered debt until safety wording and route state are audited.",
    proofType: ["source_gate"],
    status: "exception",
    evidence: [
      evidence("file", "components/kyc-aml-workflow-screen.tsx"),
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E10-I2-followup-kyc",
  },
  {
    id: "E10-RETIRED-PROOF-UI-REGISTER",
    title: "Retired proof UI remains retired",
    source: [markdownRegister("docs/ux/ALPHAVEST_E10_RETIRED_PROOF_UI_REGISTER.md")],
    contractFamily: "register_debt",
    ownerSurface: [
      owner("file", "docs/ux/ALPHAVEST_E10_RETIRED_PROOF_UI_REGISTER.md"),
      owner("test", "tests/e10-register-reconciliation.spec.ts"),
      owner("test", "tests/route-smoke.spec.ts"),
    ],
    obligation: "Retired ProductGuidance proof/debug UI must not re-enter active operational surfaces.",
    proofType: ["source_gate"],
    status: "fulfilled",
    evidence: [
      evidence("test", "tests/e10-register-reconciliation.spec.ts"),
      evidence("file", "components/route-context-chip.tsx"),
    ],
    gateBehavior: "pass",
    expiresOrFollowUp: null,
  },
  {
    id: "E11-BACKEND-DATA-SURFACE-TRUTH",
    title: "Backend data-surface query truth",
    source: [
      markdownSpec("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_QUERY_SPEC.md"),
      markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md"),
      typedContract("lib/data-surface-query-contract.ts"),
    ],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "lib/data-surface-query-contract.ts"),
      owner("file", "components/ui/data-table.tsx"),
      owner("api", "app/api/family-members/route.ts"),
      owner("api", "app/api/entities/route.ts"),
      owner("api", "app/api/documents/route.ts"),
      owner("api", "app/api/admin-tenants/route.ts"),
      owner("api", "app/api/review-monitoring/route.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Every backend_query_backed UI surface has API meta, sourceTruth and UI consumption proof.",
    proofType: ["api_test", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("file", "lib/data-surface-query-contract.ts"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-I2.2 maps E11-DS-001 through E11-DS-008 into ledger entries.",
  },
  {
    id: "E11-DS-001",
    title: "Client Intake family members backend query truth",
    sourceRegisterId: "E11-DS-001",
    currentClass: "backend_snapshot_only",
    targetClass: "backend_query_backed",
    source: [markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md")],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "components/client-intake-screen.tsx"),
      owner("api", "app/api/family-members/route.ts"),
      owner("file", "lib/dbtf-table-service.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Family member rows that claim backend-backed filtering/sorting/pagination require API metadata and UI source-truth consumption.",
    proofType: ["api_test", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("api", "app/api/family-members/route.ts"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E11-I2",
  },
  {
    id: "E11-DS-002",
    title: "Client Intake entities backend query truth",
    sourceRegisterId: "E11-DS-002",
    currentClass: "backend_snapshot_only",
    targetClass: "backend_query_backed",
    source: [markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md")],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "components/client-intake-screen.tsx"),
      owner("api", "app/api/entities/route.ts"),
      owner("file", "lib/dbtf-table-service.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Entity rows that claim backend-backed filtering/sorting/pagination require API metadata and UI source-truth consumption.",
    proofType: ["api_test", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("api", "app/api/entities/route.ts"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E11-I2",
  },
  {
    id: "E11-DS-003",
    title: "Client Intake documents backend query truth",
    sourceRegisterId: "E11-DS-003",
    currentClass: "backend_partial_no_pagination",
    targetClass: "backend_query_backed",
    source: [markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md")],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "components/client-intake-screen.tsx"),
      owner("api", "app/api/documents/route.ts"),
      owner("file", "lib/document-upload-service.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Document rows that claim backend-backed filtering/sorting/pagination require complete result metadata and UI source-truth consumption.",
    proofType: ["api_test", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("api", "app/api/documents/route.ts"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E11-I2",
  },
  {
    id: "E11-DS-004",
    title: "Admin tenant directory backend query truth",
    sourceRegisterId: "E11-DS-004",
    currentClass: "backend_snapshot_only",
    targetClass: "backend_query_backed",
    source: [markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md")],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "components/admin-tenant-setup-screen.tsx"),
      owner("api", "app/api/admin-tenants/route.ts"),
      owner("file", "lib/admin-tenant-readmodel-service.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Admin tenant directory claims require backend query metadata and no demo fallback.",
    proofType: ["api_test", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("api", "app/api/admin-tenants/route.ts"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E11-I3",
  },
  {
    id: "E11-DS-005",
    title: "Admin tenant users backend query truth",
    sourceRegisterId: "E11-DS-005",
    currentClass: "backend_snapshot_only",
    targetClass: "backend_query_backed",
    source: [markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md")],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "components/admin-tenant-setup-screen.tsx"),
      owner("api", "app/api/admin-tenants/route.ts"),
      owner("file", "lib/admin-tenant-readmodel-service.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Admin tenant user rows require backend query metadata and no demo fallback when DB-backed claims are visible.",
    proofType: ["api_test", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("api", "app/api/admin-tenants/route.ts"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E11-I3",
  },
  {
    id: "E11-DS-006",
    title: "Review monitoring due reviews backend query truth",
    sourceRegisterId: "E11-DS-006",
    currentClass: "static_demo_surface",
    targetClass: "backend_query_backed",
    source: [markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md")],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "components/review-monitoring-screen.tsx"),
      owner("api", "app/api/review-monitoring/route.ts"),
      owner("file", "lib/review-monitoring-service.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Due review rows must consume backend review-monitoring data before DB-backed/filter/pagination claims are fulfilled.",
    proofType: ["api_test", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("api", "app/api/review-monitoring/route.ts"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E11-I4",
  },
  {
    id: "E11-DS-007",
    title: "Review monitoring rebalance triggers backend query truth",
    sourceRegisterId: "E11-DS-007",
    currentClass: "static_demo_surface",
    targetClass: "backend_query_backed",
    source: [markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md")],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "components/review-monitoring-screen.tsx"),
      owner("api", "app/api/review-monitoring/route.ts"),
      owner("file", "lib/review-monitoring-service.ts"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    obligation: "Rebalance trigger rows must consume backend review-monitoring data before DB-backed/filter/pagination claims are fulfilled.",
    proofType: ["api_test", "runtime_test", "source_gate"],
    status: "partial",
    evidence: [
      evidence("api", "app/api/review-monitoring/route.ts"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E11-I4",
  },
  {
    id: "E11-DS-008",
    title: "Shared DataTable backend query capability",
    sourceRegisterId: "E11-DS-008",
    currentClass: "client_only_component",
    targetClass: "backend_query_capable_component",
    source: [markdownRegister("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md")],
    contractFamily: "backend_query_truth",
    ownerSurface: [
      owner("file", "components/ui/data-table.tsx"),
      owner("test", "tests/e11-backend-data-surface-truth.spec.ts"),
      owner("test", "tests/ux-data-surface-contract.spec.ts"),
    ],
    obligation: "Shared DataTable must support server-mode sort/pagination/source-truth metadata before backend query surfaces can claim fulfillment.",
    proofType: ["runtime_test", "source_gate", "typed_contract"],
    status: "partial",
    evidence: [
      evidence("file", "components/ui/data-table.tsx"),
      evidence("test", "tests/e11-backend-data-surface-truth.spec.ts"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E11-I5",
  },
  {
    id: "E12-CONTRACT-FULFILLMENT-LEDGER-GATE",
    title: "Contract fulfillment ledger and global gate",
    source: [
      uploadSource,
      markdownSpec("docs/ux/ALPHAVEST_E12_CONTRACT_FULFILLMENT_SPEC.md"),
      { kind: "manual_decision", ref: "APPROVE_E12_HYBRID_LEDGER_WARN_EXISTING_FAIL_NEW_GENERATE_MARKDOWN_AFTER_Q1" },
    ],
    contractFamily: "contract_fulfillment",
    ownerSurface: [
      owner("file", "lib/ux-contract-ledger.ts"),
      owner("test", "tests/ux-contract-ledger.spec.ts"),
      owner("report", "docs/v3/proof/e12_contract_fulfillment_decision_report.md"),
    ],
    obligation: "E12 ledger, gate and report chain makes contract fulfillment machine-readable and release-relevant.",
    proofType: ["typed_contract", "manual_decision", "generated_report"],
    status: "partial",
    evidence: [
      evidence("file", "lib/ux-contract-ledger.ts"),
      evidence("test", "tests/ux-contract-ledger.spec.ts"),
      evidence("decision", "APPROVE_E12_HYBRID_LEDGER_WARN_EXISTING_FAIL_NEW_GENERATE_MARKDOWN_AFTER_Q1"),
    ],
    gateBehavior: "warn_existing",
    expiresOrFollowUp: "E12-I3 builds the global contract fulfillment gate; E12-Q1 validates it.",
  },
];

export const requiredSeedContractIds = [
  "E00-IMPLEMENTATION-FIRST",
  "E01-OPERATING-MODEL",
  "E01-DESIGN-SYSTEM",
  "E02-PAGE-TEMPLATE-SYSTEM",
  "E03-PROOF-REVIEWER-SEPARATION",
  "E04-LIFECYCLE-STATE",
  "E05-ACTION-FEEDBACK",
  "E06-DATA-SURFACE-MASTER-DETAIL",
  "E07-CLIENT-INTERNAL-SEPARATION",
  "E08-VISUAL-DENSITY-A11Y",
  "E09-OPERATIONAL-SCREENSHOT-AUDIT-PROOF",
  "E10-ACTION-ZONE-REGISTER",
  "E10-DATA-SURFACE-FILTER-REGISTER",
  "E10-RETIRED-PROOF-UI-REGISTER",
  "E11-BACKEND-DATA-SURFACE-TRUTH",
  "E12-CONTRACT-FULFILLMENT-LEDGER-GATE",
] as const;

export function contractLedgerEntryById(id: string) {
  return uxContractLedgerEntries.find((entry) => entry.id === id);
}

export const e10ActionZoneLedgerEntries = uxContractLedgerEntries.filter((entry) =>
  entry.id.startsWith("E10-AZ-")
);

export const e10RegisteredActionFiles = e10ActionZoneLedgerEntries.flatMap((entry) =>
  entry.ownerSurface.filter((surface) => surface.kind === "file" && surface.ref.startsWith("components/")).map((surface) => surface.ref)
);

export const e10FirstSliceActionFiles = e10ActionZoneLedgerEntries
  .filter((entry) => entry.registerDecision === "migrate_first_slice")
  .flatMap((entry) =>
    entry.ownerSurface.filter((surface) => surface.kind === "file" && surface.ref.startsWith("components/")).map((surface) => surface.ref)
  );

export const e11BackendDataSurfaceLedgerEntries = uxContractLedgerEntries.filter((entry) =>
  entry.id.startsWith("E11-DS-")
);

export const e10DataSurfaceFilterLedgerEntries = uxContractLedgerEntries.filter((entry) =>
  entry.id.startsWith("E10-DSF-")
);

export const e10SourceRequiredFilterExceptionIds = e10DataSurfaceFilterLedgerEntries
  .filter((entry) =>
    entry.status === "exception" &&
    ["migrate_first_slice", "keep_backend_backed_with_exception"].includes(entry.registerDecision ?? "")
  )
  .map((entry) => entry.sourceRegisterId)
  .filter((id): id is string => Boolean(id));

export function duplicateContractLedgerIds(entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const entry of entries) {
    if (seen.has(entry.id)) duplicates.add(entry.id);
    seen.add(entry.id);
  }

  return [...duplicates].sort();
}

export function ledgerEntriesMissingRequiredFollowUp(entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries) {
  return entries.filter((entry) =>
    ["partial", "exception", "blocked"].includes(entry.status) && !entry.expiresOrFollowUp
  );
}

export function ledgerEntriesMissingOwnerSurface(entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries) {
  return entries.filter((entry) =>
    !["historical", "planned"].includes(entry.status) && entry.ownerSurface.length === 0
  );
}

export function fulfilledEntriesWithMarkdownOnlyEvidence(entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries) {
  return entries.filter((entry) =>
    entry.status === "fulfilled" &&
    entry.evidence.length > 0 &&
    entry.evidence.every((anchor) => anchor.kind === "file" && anchor.ref.endsWith(".md"))
  );
}

export function fulfilledEntriesWithManualDecisionOnlyEvidence(entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries) {
  return entries.filter((entry) =>
    entry.status === "fulfilled" &&
    entry.evidence.length > 0 &&
    entry.evidence.every((anchor) => anchor.kind === "decision")
  );
}

export function screenshotOnlyApiTruthEntries(entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries) {
  return entries.filter((entry) =>
    ["backend_query_truth", "data_surface"].includes(entry.contractFamily) &&
    entry.status === "fulfilled" &&
    entry.proofType.includes("screenshot") &&
    !entry.proofType.some((proofType) => proofType === "api_test" || proofType === "runtime_test" || proofType === "typed_contract")
  );
}

function emptyContractFamilyGroups(): Record<ContractFamily, UxContractLedgerEntry[]> {
  return {
    action_feedback: [],
    backend_query_truth: [],
    client_visibility: [],
    contract_fulfillment: [],
    data_surface: [],
    design_system: [],
    lifecycle_state: [],
    operating_model: [],
    operational_visual_audit: [],
    page_template: [],
    proof_reviewer: [],
    register_debt: [],
    release_gate: [],
    visual_accessibility: [],
  };
}

function emptyStatusGroups(): Record<FulfillmentStatus, UxContractLedgerEntry[]> {
  return {
    blocked: [],
    exception: [],
    fulfilled: [],
    historical: [],
    partial: [],
    planned: [],
    retired: [],
  };
}

export function ledgerEntriesByContractFamily(entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries) {
  return entries.reduce<Record<ContractFamily, UxContractLedgerEntry[]>>((groups, entry) => {
    groups[entry.contractFamily].push(entry);
    return groups;
  }, emptyContractFamilyGroups());
}

export function ledgerEntriesByStatus(entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries) {
  return entries.reduce<Record<FulfillmentStatus, UxContractLedgerEntry[]>>((groups, entry) => {
    groups[entry.status].push(entry);
    return groups;
  }, emptyStatusGroups());
}

export const uxContractLedgerIntegrity = {
  totalEntries: uxContractLedgerEntries.length,
  duplicateIds: duplicateContractLedgerIds(),
  missingFollowUps: ledgerEntriesMissingRequiredFollowUp().map((entry) => entry.id),
  missingOwnerSurfaces: ledgerEntriesMissingOwnerSurface().map((entry) => entry.id),
  markdownOnlyFulfilled: fulfilledEntriesWithMarkdownOnlyEvidence().map((entry) => entry.id),
  manualDecisionOnlyFulfilled: fulfilledEntriesWithManualDecisionOnlyEvidence().map((entry) => entry.id),
  screenshotOnlyApiTruth: screenshotOnlyApiTruthEntries().map((entry) => entry.id),
  missingSeedIds: requiredSeedContractIds.filter((id) => !contractLedgerEntryById(id)),
};
