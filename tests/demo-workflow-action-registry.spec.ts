import { expect, test } from "@playwright/test";

import {
  demoOnlyWorkflowActionIds,
  demoWorkflowActionBoundaryFor,
  typedAdvisorApprovalWorkflowBoundary,
} from "../lib/demo-workflow-action-registry";

test.describe("demo workflow action registry", () => {
  test("keeps executable demo workflow actions explicitly demo-only", () => {
    expect(demoOnlyWorkflowActionIds).toHaveLength(14);

    for (const actionId of demoOnlyWorkflowActionIds) {
      expect(demoWorkflowActionBoundaryFor(actionId), actionId).toMatchObject({
        allowedOnDemoWorkflow: true,
        classification: "DEMO_ONLY_COMPATIBILITY",
        productCommandAllowed: false,
        reasonCode: "SCREENCAST_DEMO_ACTION_ONLY",
      });
    }
  });

  test("moves typed product command families out of demo workflow", () => {
    expect(typedAdvisorApprovalWorkflowBoundary).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/recommendation-review-workflow",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      productCommandAllowed: true,
      reasonCode: "ADVISOR_APPROVAL_WORKFLOW_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j08.confirmApproval")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/export-workflow",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "LEGACY_EXPORT_DEMO_ACTION_RETIRED",
    });
    expect(demoWorkflowActionBoundaryFor("j12.completeKycReview")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/journeys/[id]/commands",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "PHASE_B_C_JOURNEY_COMMANDS_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j14.linkIpsEvidence")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/journeys/[id]/commands",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "PHASE_B_C_JOURNEY_COMMANDS_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j16.scheduleReview")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/review-monitoring/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "REVIEW_MONITORING_ACTION_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j06.continueTenant")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/tenant-governance/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "TENANT_GOVERNANCE_ACTIONS_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j07.exportAudit")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/tenant-governance/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "TENANT_GOVERNANCE_ACTIONS_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j10.saveSecurity")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/platform-admin/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "PLATFORM_ADMIN_ACTIONS_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j04.uploadDocument")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/data-maintenance/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "DATA_MAINTENANCE_ACTIONS_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j05.requestInfo")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/data-maintenance/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "DATA_MAINTENANCE_ACTIONS_MOVED",
    });
    expect(demoWorkflowActionBoundaryFor("j09.addRelationship")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/data-maintenance/actions",
      classification: "MOVED_TO_TYPED_PRODUCT_COMMAND",
      reasonCode: "DATA_MAINTENANCE_ACTIONS_MOVED",
    });
  });

  test("blocks unregistered demo-shaped actions until a typed command exists", () => {
    expect(demoWorkflowActionBoundaryFor("j99.fakeAction")).toMatchObject({
      allowedOnDemoWorkflow: false,
      canonicalApiRoute: "/api/journeys/[id]/commands",
      classification: "UNSUPPORTED_REQUIRES_TYPED_COMMAND",
      productCommandAllowed: true,
      reasonCode: "UNSUPPORTED_DEMO_WORKFLOW_ACTION_BLOCKED",
    });
  });
});
