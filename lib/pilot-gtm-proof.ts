export type PilotBuyerPersonaKey =
  | "family_office_principal_cfo"
  | "advisor_operator"
  | "compliance_risk_owner"
  | "trust_led_buyer";

export type PilotProcessKey = "BP-001" | "BP-017" | "BP-020" | "BP-024" | "BP-046" | "BP-088";

export type PilotSuccessMetricKey =
  | "buyer_confidence"
  | "no_leakage"
  | "evidence_completeness"
  | "review_time"
  | "gate_clarity"
  | "support_incidents"
  | "feedback_issues";

export const pilotBuyerPersonas = [
  {
    key: "family_office_principal_cfo",
    label: "Family Office Principal/CFO",
    qualifiesWhen: "Needs evidence-backed decision control across family, entity and advisor workflows.",
    excludesWhen: "Seeks autonomous final financial, legal or tax advice.",
  },
  {
    key: "advisor_operator",
    label: "Advisor / operating partner",
    qualifiesWhen: "Owns advisor review, evidence collection and client-safe delivery quality.",
    excludesWhen: "Needs production banking, custody or trade execution integrations in the pilot.",
  },
  {
    key: "compliance_risk_owner",
    label: "Compliance / risk owner",
    qualifiesWhen: "Cares about approval separation, auditability, redaction and no-bypass controls.",
    excludesWhen: "Requires regulated production deployment certification before design partnership.",
  },
  {
    key: "trust_led_buyer",
    label: "Trust-led buyer",
    qualifiesWhen: "Buys confidence that internal work cannot leak into client-visible advice.",
    excludesWhen: "Wants mass-market self-serve onboarding or GA procurement terms.",
  },
] as const satisfies Array<{
  excludesWhen: string;
  key: PilotBuyerPersonaKey;
  label: string;
  qualifiesWhen: string;
}>;

export const pilotDemoProcessSpine = [
  {
    key: "BP-001",
    role: "relationship intake process",
    proof: "mapped tenant actor reaches first client-safe decision only after evidence, advisor and compliance gates",
  },
  {
    key: "BP-024",
    role: "document upload process",
    proof: "upload and review stay separate from evidence sufficiency and release",
  },
  {
    key: "BP-046",
    role: "rebuild-with-evidence process",
    proof: "AI/rules draft and internal rationale remain internal-only",
  },
  {
    key: "BP-020",
    role: "admin non-bypass proof",
    proof: "admin/governance powers cannot force release, export, visibility or sufficiency",
  },
  {
    key: "BP-017",
    role: "cross-tenant denial proof",
    proof: "wrong tenant or wrong object fails closed without payload leakage",
  },
  {
    key: "BP-088",
    role: "export trust output",
    proof: "export package requires scope, redaction, approval and audit",
  },
] as const satisfies Array<{
  key: PilotProcessKey;
  proof: string;
  role: string;
}>;

export const pilotDemoJourneySpine = pilotDemoProcessSpine;

export const pilotSuccessMetrics = [
  {
    key: "buyer_confidence",
    target: "design partner can restate the trust spine and name the non-bypass gates",
  },
  {
    key: "no_leakage",
    target: "zero client-visible AI draft, internal rationale, compliance notes or unreleased evidence leakage",
  },
  {
    key: "evidence_completeness",
    target: "every release candidate names linked, reviewed and scoped evidence",
  },
  {
    key: "review_time",
    target: "pilot team can measure time from evidence request to compliance release decision",
  },
  {
    key: "gate_clarity",
    target: "advisor approval, compliance release, client visibility and export approval are distinguishable",
  },
  {
    key: "support_incidents",
    target: "P1/P2/P3 incidents are classified with owner, correlation id and safe status",
  },
  {
    key: "feedback_issues",
    target: "pilot feedback is sorted into product fit, workflow clarity, missing integration and safety blocker buckets",
  },
] as const satisfies Array<{
  key: PilotSuccessMetricKey;
  target: string;
}>;

export const pilotCommercialBoundaries = {
  allowedOffer: "controlled_paid_design_partner_pilot",
  adviceBoundary: "human_reviewed_no_autonomous_final_advice",
  dataBoundary: "demo_data_only_until_written_approval",
  excludedClaims: [
    "mass_market_ga",
    "regulated_production_ready",
    "autonomous_financial_legal_tax_advice",
    "real_client_data_approved",
    "banking_custody_trade_execution",
  ],
};
