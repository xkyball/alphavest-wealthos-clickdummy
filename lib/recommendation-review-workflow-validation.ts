import type { DemoRoleKey } from "@/lib/demo-session";
import type { AuditResult, PermissionAction, RecommendationStatus } from "@/lib/domain-types";
import {
  advisorApprovalActionToCanonicalCommand,
  advisorApprovalActionToCanonicalState,
  workflow05ComplianceReleaseConfirmationPhrase,
  type Workflow05CanonicalProcessCommandId,
  type Workflow05CanonicalState,
} from "@/lib/advisory-workflow-contract";

export type ValidationIssue = {
  code: string;
  field: string;
  message: string;
};

export type AdvisorApprovalWorkflowAction =
  | "submit_review"
  | "reject_unsupported_claim"
  | "rebuild_with_evidence"
  | "advisor_approve"
  | "advisor_request_evidence"
  | "advisor_return_to_analyst"
  | "compliance_release"
  | "compliance_block"
  | "request_evidence";

export type AdvisorApprovalWorkflowRequestInput = {
  action: AdvisorApprovalWorkflowAction;
  actorRole: string;
  confirmationText?: string;
  evidenceIds?: string[];
  reason?: string;
  simulateAuditPersistenceFailure?: boolean;
  targetId: string;
  workflowType: "advisor-approval";
};

export const advisorApprovalConfirmationText: Partial<Record<AdvisorApprovalWorkflowAction, string>> = {
  compliance_block: "BLOCK RELEASE",
  compliance_release: workflow05ComplianceReleaseConfirmationPhrase,
  request_evidence: "REQUEST EVIDENCE",
};

export type AdvisorApprovalWorkflowTransition = {
  auditResult: AuditResult;
  canonicalCommand: Workflow05CanonicalProcessCommandId;
  canonicalState: Workflow05CanonicalState;
  clientVisibleAfterAction: boolean;
  nextRecommendationStatus: RecommendationStatus;
  permissionAction: PermissionAction;
  requiredRole: DemoRoleKey;
};

export const advisorApprovalWorkflowStateMachine = {
  submit_review: {
    auditResult: "SUCCESS",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.submit_review,
    canonicalState: advisorApprovalActionToCanonicalState.submit_review,
    clientVisibleAfterAction: false,
    nextRecommendationStatus: "ANALYST_REVIEWED",
    permissionAction: "REVIEW",
    requiredRole: "analyst",
  },
  reject_unsupported_claim: {
    auditResult: "BLOCKED",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.reject_unsupported_claim,
    canonicalState: advisorApprovalActionToCanonicalState.reject_unsupported_claim,
    clientVisibleAfterAction: false,
    nextRecommendationStatus: "REVISION_REQUESTED",
    permissionAction: "REVIEW",
    requiredRole: "analyst",
  },
  rebuild_with_evidence: {
    auditResult: "SUCCESS",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.rebuild_with_evidence,
    canonicalState: advisorApprovalActionToCanonicalState.rebuild_with_evidence,
    clientVisibleAfterAction: false,
    nextRecommendationStatus: "ANALYST_REVIEWED",
    permissionAction: "REVIEW",
    requiredRole: "analyst",
  },
  advisor_approve: {
    auditResult: "SUCCESS",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.advisor_approve,
    canonicalState: advisorApprovalActionToCanonicalState.advisor_approve,
    clientVisibleAfterAction: false,
    nextRecommendationStatus: "COMPLIANCE_PENDING",
    permissionAction: "APPROVE",
    requiredRole: "senior_wealth_advisor",
  },
  advisor_request_evidence: {
    auditResult: "PENDING",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.advisor_request_evidence,
    canonicalState: advisorApprovalActionToCanonicalState.advisor_request_evidence,
    clientVisibleAfterAction: false,
    nextRecommendationStatus: "MORE_DATA_REQUESTED",
    permissionAction: "REVIEW",
    requiredRole: "senior_wealth_advisor",
  },
  advisor_return_to_analyst: {
    auditResult: "BLOCKED",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.advisor_return_to_analyst,
    canonicalState: advisorApprovalActionToCanonicalState.advisor_return_to_analyst,
    clientVisibleAfterAction: false,
    nextRecommendationStatus: "REVISION_REQUESTED",
    permissionAction: "REVIEW",
    requiredRole: "senior_wealth_advisor",
  },
  compliance_release: {
    auditResult: "SUCCESS",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.compliance_release,
    canonicalState: advisorApprovalActionToCanonicalState.compliance_release,
    clientVisibleAfterAction: true,
    nextRecommendationStatus: "RELEASED_TO_CLIENT",
    permissionAction: "RELEASE",
    requiredRole: "compliance_officer",
  },
  compliance_block: {
    auditResult: "BLOCKED",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.compliance_block,
    canonicalState: advisorApprovalActionToCanonicalState.compliance_block,
    clientVisibleAfterAction: false,
    nextRecommendationStatus: "BLOCKED",
    permissionAction: "BLOCK",
    requiredRole: "compliance_officer",
  },
  request_evidence: {
    auditResult: "PENDING",
    canonicalCommand: advisorApprovalActionToCanonicalCommand.request_evidence,
    canonicalState: advisorApprovalActionToCanonicalState.request_evidence,
    clientVisibleAfterAction: false,
    nextRecommendationStatus: "MORE_DATA_REQUESTED",
    permissionAction: "BLOCK",
    requiredRole: "compliance_officer",
  },
} satisfies Record<AdvisorApprovalWorkflowAction, AdvisorApprovalWorkflowTransition>;

export function advisorApprovalTransitionFor(action: AdvisorApprovalWorkflowAction) {
  return advisorApprovalWorkflowStateMachine[action];
}

export type RecommendationReviewWorkflowRequestInput = AdvisorApprovalWorkflowRequestInput;

type ValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      issues: ValidationIssue[];
      ok: false;
    };

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const advisorApprovalActions = new Set<AdvisorApprovalWorkflowAction>([
  "submit_review",
  "reject_unsupported_claim",
  "rebuild_with_evidence",
  "advisor_approve",
  "advisor_request_evidence",
  "advisor_return_to_analyst",
  "compliance_release",
  "compliance_block",
  "request_evidence",
]);
const advisorApprovalWorkflowTypes = new Set(["advisor-approval", "recommendation-review"]);
const demoActorRoles = new Set([
  "principal",
  "family_cfo",
  "trustee",
  "next_gen",
  "external_advisor",
  "analyst",
  "senior_wealth_advisor",
  "compliance_officer",
  "client_success",
  "admin",
  "security_officer",
]);

function hasAdvisorApprovalShape(body: Record<string, unknown>) {
  return (
    "workflowType" in body ||
    "targetId" in body ||
    "action" in body ||
    "actorRole" in body ||
    "evidenceIds" in body ||
    "confirmationText" in body
  );
}

function stringValue(body: Record<string, unknown>, field: string) {
  const value = body[field];
  return typeof value === "string" ? value.trim() : undefined;
}

export function parseRecommendationReviewWorkflowRequestBody(body: unknown): ValidationResult<RecommendationReviewWorkflowRequestInput> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      issues: [
        {
          code: "invalid_body",
          field: "body",
          message: "Request body must be an object.",
        },
      ],
      ok: false,
    };
  }

  const record = body as Record<string, unknown>;
  if (hasAdvisorApprovalShape(record)) {
    const issues: ValidationIssue[] = [];
    const workflowType = stringValue(record, "workflowType");
    const targetId = stringValue(record, "targetId");
    const action = stringValue(record, "action");
    const actorRole = stringValue(record, "actorRole");
    const reason = stringValue(record, "reason");
    const confirmationText = stringValue(record, "confirmationText");
    const evidenceIds = record.evidenceIds;

    if (!workflowType || !advisorApprovalWorkflowTypes.has(workflowType)) {
      issues.push({
        code: "invalid_workflow_type",
        field: "workflowType",
        message: "Workflow type must be advisor-approval.",
      });
    }

    if (!targetId || !uuidPattern.test(targetId)) {
      issues.push({
        code: "invalid_target_id",
        field: "targetId",
        message: "Target ID must be a UUID recommendation identifier.",
      });
    }

    if (!action || !advisorApprovalActions.has(action as AdvisorApprovalWorkflowAction)) {
      issues.push({
        code: "invalid_workflow_action",
        field: "action",
        message: "Action must be a supported advisor approval workflow action.",
      });
    }

    if (!actorRole || !demoActorRoles.has(actorRole)) {
      issues.push({
        code: "invalid_actor_role",
        field: "actorRole",
        message: "Actor role must be a supported workspace role.",
      });
    }

    if ("reason" in record && (typeof record.reason !== "string" || !reason)) {
      issues.push({
        code: "invalid_reason",
        field: "reason",
        message: "Reason must be a non-empty string when provided.",
      });
    }

    if ("confirmationText" in record && (typeof record.confirmationText !== "string" || !confirmationText)) {
      issues.push({
        code: "invalid_confirmation_text",
        field: "confirmationText",
        message: "Confirmation text must be a non-empty string when provided.",
      });
    }

    if (
      "simulateAuditPersistenceFailure" in record &&
      typeof record.simulateAuditPersistenceFailure !== "boolean"
    ) {
      issues.push({
        code: "invalid_audit_persistence_simulation",
        field: "simulateAuditPersistenceFailure",
        message: "Audit persistence simulation must be a boolean when provided.",
      });
    }

    if (
      evidenceIds !== undefined &&
      (!Array.isArray(evidenceIds) ||
        !evidenceIds.every((evidenceId) => typeof evidenceId === "string" && uuidPattern.test(evidenceId)))
    ) {
      issues.push({
        code: "invalid_evidence_ids",
        field: "evidenceIds",
        message: "Evidence IDs must be UUID strings when provided.",
      });
    }

    if (issues.length > 0) {
      return { issues, ok: false };
    }

    return {
      ok: true,
      value: {
        action: action as AdvisorApprovalWorkflowAction,
        actorRole: actorRole as string,
        ...(confirmationText ? { confirmationText } : {}),
        ...(Array.isArray(evidenceIds) ? { evidenceIds } : {}),
        ...(reason ? { reason } : {}),
        ...(record.simulateAuditPersistenceFailure === true
          ? { simulateAuditPersistenceFailure: true }
          : {}),
        targetId: targetId as string,
        workflowType: "advisor-approval",
      },
    };
  }

  return {
    issues: [
      {
        code: "invalid_workflow_request",
        field: "workflowType",
        message: "Recommendation review workflow requests must include a typed advisor approval payload.",
      },
    ],
    ok: false,
  };
}
