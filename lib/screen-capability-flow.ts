import { scfCriticalGateAuditContract } from "@/lib/audit-service";
import { evidenceService } from "@/lib/evidence-service";
import { workflowGate } from "@/lib/workflow-gate";
import type { BadgeTone } from "@/components/ui";

export type ScreenCapabilityFlowStep = {
  detail: string;
  label: string;
  status: string;
  tone: BadgeTone;
};

export type ScreenCapabilityFlowPanel = {
  detail: string;
  gateLabel: string;
  missing: string[];
  state: "success" | "blocked" | "restricted" | "loading" | "empty" | "error";
  steps: ScreenCapabilityFlowStep[];
  title: string;
};

const requestedLifecycle = evidenceService.evaluateEvidenceLifecycle({
  relatedObjectType: "DOCUMENT",
  requiredObjectType: "DOCUMENT",
  status: "PLACEHOLDER",
  visibilityStatus: "INTERNAL_ONLY",
});

const uploadLifecycle = evidenceService.evaluateEvidenceLifecycle({
  accepted: false,
  current: true,
  relatedObjectId: "document-demo-source",
  relatedObjectType: "DOCUMENT",
  requiredObjectId: "document-demo-source",
  requiredObjectType: "DOCUMENT",
  reviewed: false,
  status: "CREATED",
  uploaded: true,
  visibilityStatus: "INTERNAL_ONLY",
});

const acceptedRecommendationEvidence = evidenceService.evaluateEvidenceSufficiency({
  accepted: true,
  current: true,
  relatedObjectId: "recommendation-demo-release",
  relatedObjectType: "RECOMMENDATION",
  requiredObjectId: "recommendation-demo-release",
  requiredObjectType: "RECOMMENDATION",
  reviewed: true,
  status: "RELEASED",
  visibilityStatus: "CLIENT_VISIBLE",
});

const uploadOnlyRecommendationEvidence = evidenceService.evaluateEvidenceSufficiency({
  accepted: false,
  current: true,
  relatedObjectId: "recommendation-demo-release",
  relatedObjectType: "RECOMMENDATION",
  requiredObjectId: "recommendation-demo-release",
  requiredObjectType: "RECOMMENDATION",
  reviewed: false,
  status: "CREATED",
  visibilityStatus: "INTERNAL_ONLY",
});

const internalDraftGate = workflowGate.canBecomeClientVisible({
  advisorApprovalStatus: "PENDING",
  complianceStatus: "PENDING",
  containsAiDraft: true,
  containsInternalRationale: true,
  evidenceStatus: "CREATED",
  permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
  recommendationStatus: "AI_DRAFT",
});

const advisorApprovalGate = workflowGate.canBecomeClientVisible({
  advisorApprovalStatus: "APPROVED",
  complianceStatus: "PENDING",
  evidenceStatus: "VALIDATED",
  permission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
  recommendationStatus: "ADVISOR_APPROVED",
});

const blockedComplianceGate = workflowGate.canPassComplianceReleaseGate({
  advisorApprovalStatus: "PENDING",
  auditPersistenceAvailable: true,
  compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
  evidenceDecision: uploadOnlyRecommendationEvidence,
  payloadReady: false,
});

const releasableComplianceGate = workflowGate.canPassComplianceReleaseGate({
  advisorApprovalStatus: "APPROVED",
  auditPersistenceAvailable: true,
  compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
  evidenceDecision: acceptedRecommendationEvidence,
  payloadReady: true,
});

const auditUnavailableGate = workflowGate.canPassComplianceReleaseGate({
  advisorApprovalStatus: "APPROVED",
  auditPersistenceAvailable: false,
  compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
  evidenceDecision: acceptedRecommendationEvidence,
  payloadReady: true,
});

export const p04P06FlowPanels = {
  advisory: {
    detail: "Signals can create internal draft work, but AI/rules draft, unsupported-claim notes, internal rationale and advisor notes stay internal until evidence-backed rebuild and compliance release.",
    gateLabel: internalDraftGate.blockedReason ?? "Internal-only draft boundary",
    missing: internalDraftGate.missing,
    state: "restricted",
    steps: [
      {
        detail: "Analyst classification routes the signal to review without producing client-visible advice.",
        label: "Signal classified",
        status: "Internal",
        tone: "blue",
      },
      {
        detail: "AI/rules draft, unsupported claims and rationale are visible to Analyst and Advisor only until canonical evidence rebuild clears them.",
        label: "Draft boundary",
        status: "Hidden from client",
        tone: "red",
      },
      {
        detail: "Advisor approval creates an advisor candidate only; it does not release content, export content or create client acceptance.",
        label: "Advisor approval",
        status: advisorApprovalGate.passed ? "Ready for compliance" : "Not released",
        tone: "gold",
      },
    ],
    title: "Advisory Signal Boundary",
  } satisfies ScreenCapabilityFlowPanel,
  audit: {
    detail: `Critical gate actions must persist audit rows with actor, role, target, previous state, next state, result and reason. Contract: ${scfCriticalGateAuditContract}.`,
    gateLabel: auditUnavailableGate.blockedReason ?? "Audit persistence required",
    missing: auditUnavailableGate.missing,
    state: "blocked",
    steps: [
      {
        detail: "Advisor, evidence, compliance, governance and export actions require audit metadata.",
        label: "Critical actions",
        status: "Audit required",
        tone: "gold",
      },
      {
        detail: "If audit persistence is unavailable, release/export/permission mutation remains denied or pending.",
        label: "Fail closed",
        status: "No mutation",
        tone: "red",
      },
      {
        detail: "Audit display alone is not proof; persisted rows are required.",
        label: "Proof",
        status: "Persisted row",
        tone: "green",
      },
    ],
    title: "Audit Persistence Gate",
  } satisfies ScreenCapabilityFlowPanel,
  compliance: {
    detail: "Compliance can release only after advisor approval, scoped sufficient evidence, client-safe payload, permission and audit readiness pass.",
    gateLabel: "Release blocked until prerequisites pass",
    missing: blockedComplianceGate.missing,
    state: "blocked",
    steps: [
      {
        detail: "Upload-only or unreviewed evidence keeps release blocked.",
        label: "Needs evidence",
        status: "Blocked",
        tone: "red",
      },
      {
        detail: "Block and request-evidence actions keep client visibility hidden and write audit rows.",
        label: "Compliance action",
        status: "Controlled",
        tone: "gold",
      },
      {
        detail: "Only a successful compliance release can set the safe client projection.",
        label: "Release",
        status: releasableComplianceGate.passed ? "Compliance only" : "Blocked",
        tone: releasableComplianceGate.passed ? "gold" : "red",
      },
    ],
    title: "Compliance Release Gate",
  } satisfies ScreenCapabilityFlowPanel,
  evidence: {
    detail: "Evidence moves from request to upload to human review and explicit sufficiency. Upload success never unlocks release by itself.",
    gateLabel: uploadLifecycle.statusLabel,
    missing: uploadLifecycle.missing,
    state: "restricted",
    steps: [
      {
        detail: requestedLifecycle.statusLabel,
        label: "Evidence requested",
        status: "Needs evidence",
        tone: "gold",
      },
      {
        detail: "A valid upload creates document, version, extraction, evidence and audit rows.",
        label: "Upload received",
        status: uploadLifecycle.canEnterReviewQueue ? "Review queue" : "Waiting",
        tone: "blue",
      },
      {
        detail: "Sufficiency requires review, scope, currentness, acceptance and client-safe visibility.",
        label: "Sufficiency",
        status: uploadLifecycle.canSupportComplianceRelease ? "Sufficient" : "Not sufficient",
        tone: uploadLifecycle.canSupportComplianceRelease ? "green" : "red",
      },
    ],
    title: "Evidence Lifecycle Gate",
  } satisfies ScreenCapabilityFlowPanel,
} as const;
