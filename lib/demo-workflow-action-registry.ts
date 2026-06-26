import { isReviewMonitoringWorkflowAction } from "@/lib/review-monitoring-workflow-actions";
import { isTenantGovernanceWorkflowAction } from "@/lib/tenant-governance-action-contract";

export type DemoWorkflowActionBoundary =
  | {
      allowedOnDemoWorkflow: true;
      classification: "DEMO_ONLY_COMPATIBILITY";
      productCommandAllowed: false;
      reasonCode: "SCREENCAST_DEMO_ACTION_ONLY";
    }
  | {
      allowedOnDemoWorkflow: false;
      canonicalApiRoute:
        | "/api/export-workflow"
        | "/api/journeys/[id]/commands"
        | "/api/recommendation-review-workflow"
        | "/api/review-monitoring/actions"
        | "/api/tenant-governance/actions";
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND";
      productCommandAllowed: true;
      reasonCode:
        | "LEGACY_EXPORT_DEMO_ACTION_RETIRED"
        | "PHASE_B_C_JOURNEY_COMMANDS_MOVED"
        | "ADVISOR_APPROVAL_WORKFLOW_MOVED"
        | "REVIEW_MONITORING_ACTION_MOVED"
        | "TENANT_GOVERNANCE_ACTIONS_MOVED";
    }
  | {
      allowedOnDemoWorkflow: false;
      canonicalApiRoute: "/api/journeys/[id]/commands";
      classification: "UNSUPPORTED_REQUIRES_TYPED_COMMAND";
      productCommandAllowed: true;
      reasonCode: "UNSUPPORTED_DEMO_WORKFLOW_ACTION_BLOCKED";
    };

export const demoOnlyWorkflowActionIds = [
  "j01.requestData",
  "j01.routeToAdvisor",
  "j01.approveAdvisor",
  "j01.escalateAdvisor",
  "j02.requestEvidence",
  "j02.confirmRequestEvidence",
  "j02.blockRelease",
  "j02.releaseClient",
  "j03.requestMoreInformation",
  "j03.deferDecision",
  "j03.rejectDecision",
  "j03.acceptOption",
  "j03.viewEvidenceRecord",
  "j03.downloadEvidence",
  "j04.portalUpload",
  "j04.openUploadDocument",
  "j04.uploadDocument",
  "j04.confirmFinalize",
  "j04.viewDetails",
  "j05.createEntity",
  "j05.continueEntity",
  "j05.editEntity",
  "j05.viewDetails",
  "j05.markReady",
  "j05.requestInfo",
  "j09.portalUpload",
  "j09.submitProfile",
  "j09.addMember",
  "j09.saveFamilyChanges",
  "j09.openFamilyMap",
  "j09.addRelationship",
] as const;

const demoOnlyWorkflowActions = new Set<string>(demoOnlyWorkflowActionIds);

export const typedAdvisorApprovalWorkflowBoundary = {
  allowedOnDemoWorkflow: false,
  canonicalApiRoute: "/api/recommendation-review-workflow",
  classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
  productCommandAllowed: true,
  reasonCode: "ADVISOR_APPROVAL_WORKFLOW_MOVED",
} satisfies DemoWorkflowActionBoundary;

function isLegacyExportDemoAction(actionId: string) {
  return actionId.startsWith("j08.");
}

function isPhaseBCJourneyDemoAction(actionId: string) {
  return actionId.startsWith("j12.") || actionId.startsWith("j13.") || actionId.startsWith("j14.");
}

export function demoWorkflowActionBoundaryFor(actionId: string): DemoWorkflowActionBoundary {
  if (demoOnlyWorkflowActions.has(actionId)) {
    return {
      allowedOnDemoWorkflow: true,
      classification: "DEMO_ONLY_COMPATIBILITY",
      productCommandAllowed: false,
      reasonCode: "SCREENCAST_DEMO_ACTION_ONLY",
    };
  }

  if (isLegacyExportDemoAction(actionId)) {
    return {
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/export-workflow",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "LEGACY_EXPORT_DEMO_ACTION_RETIRED",
    };
  }

  if (isPhaseBCJourneyDemoAction(actionId)) {
    return {
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/journeys/[id]/commands",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "PHASE_B_C_JOURNEY_COMMANDS_MOVED",
    };
  }

  if (isReviewMonitoringWorkflowAction(actionId)) {
    return {
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/review-monitoring/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "REVIEW_MONITORING_ACTION_MOVED",
    };
  }

  if (isTenantGovernanceWorkflowAction(actionId)) {
    return {
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/tenant-governance/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "TENANT_GOVERNANCE_ACTIONS_MOVED",
    };
  }

  return {
    allowedOnDemoWorkflow: false,
    canonicalApiRoute: "/api/journeys/[id]/commands",
    classification: "UNSUPPORTED_REQUIRES_TYPED_COMMAND",
    productCommandAllowed: true,
    reasonCode: "UNSUPPORTED_DEMO_WORKFLOW_ACTION_BLOCKED",
  };
}
