import { isPlatformAdminWorkflowAction } from "@/lib/platform-admin-action-contract";
import { advisorReviewCanonicalApiRoute, isAdvisorReviewWorkflowAction } from "@/lib/advisor-review-action-contract";
import { isReviewMonitoringWorkflowAction } from "@/lib/review-monitoring-workflow-actions";
import { isTenantGovernanceWorkflowAction } from "@/lib/tenant-governance-action-contract";
import { isDataMaintenanceWorkflowAction } from "@/lib/data-maintenance-action-contract";
import { isAdviceReleaseHistoryWorkflowAction } from "@/lib/advice-release-history-action-contract";

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
        | "/api/data-maintenance/actions"
        | "/api/advice-release-history/actions"
        | "/api/journeys/[id]/commands"
        | "/api/platform-admin/actions"
        | "/api/recommendation-review-workflow"
        | "/api/review-monitoring/actions"
        | "/api/advisor-review/actions"
        | "/api/tenant-governance/actions";
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND";
      productCommandAllowed: true;
      reasonCode:
        | "LEGACY_EXPORT_DEMO_ACTION_RETIRED"
        | "PHASE_B_C_JOURNEY_COMMANDS_MOVED"
        | "ADVISOR_APPROVAL_WORKFLOW_MOVED"
        | "ADVISOR_REVIEW_WORKFLOW_ACTIONS_MOVED"
        | "ADVICE_RELEASE_HISTORY_ACTIONS_MOVED"
        | "DATA_MAINTENANCE_ACTIONS_MOVED"
        | "PLATFORM_ADMIN_ACTIONS_MOVED"
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
] as const;

const demoOnlyWorkflowActions = new Set<string>(demoOnlyWorkflowActionIds);

export const typedAdvisorApprovalWorkflowBoundary = {
  allowedOnDemoWorkflow: false,
  canonicalApiRoute: "/api/recommendation-review-workflow",
  classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
  productCommandAllowed: true,
  reasonCode: "ADVISOR_APPROVAL_WORKFLOW_MOVED",
} satisfies DemoWorkflowActionBoundary;

const advisorReviewWorkflowBoundary = {
  allowedOnDemoWorkflow: false,
  canonicalApiRoute: advisorReviewCanonicalApiRoute,
  classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
  productCommandAllowed: true,
  reasonCode: "ADVISOR_REVIEW_WORKFLOW_ACTIONS_MOVED",
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

  if (isAdvisorReviewWorkflowAction(actionId)) {
    return advisorReviewWorkflowBoundary;
  }

  if (actionId === "j01.approveAdvisor") {
    return typedAdvisorApprovalWorkflowBoundary;
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

  if (isDataMaintenanceWorkflowAction(actionId)) {
    return {
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/data-maintenance/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "DATA_MAINTENANCE_ACTIONS_MOVED",
    };
  }

  if (isAdviceReleaseHistoryWorkflowAction(actionId)) {
    return {
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/advice-release-history/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "ADVICE_RELEASE_HISTORY_ACTIONS_MOVED",
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

  if (isPlatformAdminWorkflowAction(actionId)) {
    return {
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/platform-admin/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "PLATFORM_ADMIN_ACTIONS_MOVED",
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
