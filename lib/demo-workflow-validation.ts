export type ValidationIssue = {
  code: string;
  field: string;
  message: string;
};

export type RecommendationReviewWorkflowAction =
  | "submit_review"
  | "reject_unsupported_claim"
  | "rebuild_with_evidence"
  | "advisor_approve"
  | "compliance_release"
  | "compliance_block"
  | "request_evidence";

export type RecommendationReviewWorkflowRequestInput = {
  action: RecommendationReviewWorkflowAction;
  actorRole: string;
  confirmationText?: string;
  evidenceIds?: string[];
  reason?: string;
  simulateAuditPersistenceFailure?: boolean;
  targetId: string;
  workflowType: "recommendation-review";
};

export const recommendationReviewConfirmationText: Partial<Record<RecommendationReviewWorkflowAction, string>> = {
  compliance_block: "BLOCK RELEASE",
  compliance_release: "RELEASE TO CLIENT",
  request_evidence: "REQUEST EVIDENCE",
};

export type DemoWorkflowActionIdRequestInput = {
  actionId: string;
  simulateAuditPersistenceFailure?: boolean;
};

export type DemoWorkflowRequestInput =
  | DemoWorkflowActionIdRequestInput
  | RecommendationReviewWorkflowRequestInput;

type ValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      issues: ValidationIssue[];
      ok: false;
    };

const demoWorkflowActionPattern = /^j\d{2}\.[a-zA-Z0-9]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const recommendationReviewActions = new Set<RecommendationReviewWorkflowAction>([
  "submit_review",
  "reject_unsupported_claim",
  "rebuild_with_evidence",
  "advisor_approve",
  "compliance_release",
  "compliance_block",
  "request_evidence",
]);
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

export function isDemoWorkflowActionId(value: unknown): value is string {
  return typeof value === "string" && demoWorkflowActionPattern.test(value);
}

function hasRecommendationReviewShape(body: Record<string, unknown>) {
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

export function parseDemoWorkflowRequestBody(body: unknown): ValidationResult<DemoWorkflowRequestInput> {
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
  const actionId = record.actionId;
  if (isDemoWorkflowActionId(actionId)) {
    if (
      "simulateAuditPersistenceFailure" in record &&
      typeof record.simulateAuditPersistenceFailure !== "boolean"
    ) {
      return {
        issues: [
          {
            code: "invalid_audit_persistence_simulation",
            field: "simulateAuditPersistenceFailure",
            message: "Audit persistence simulation must be a boolean when provided.",
          },
        ],
        ok: false,
      };
    }

    return {
      ok: true,
      value: {
        actionId,
        ...(record.simulateAuditPersistenceFailure === true
          ? { simulateAuditPersistenceFailure: true }
          : {}),
      },
    };
  }

  if (hasRecommendationReviewShape(record)) {
    const issues: ValidationIssue[] = [];
    const workflowType = stringValue(record, "workflowType");
    const targetId = stringValue(record, "targetId");
    const action = stringValue(record, "action");
    const actorRole = stringValue(record, "actorRole");
    const reason = stringValue(record, "reason");
    const confirmationText = stringValue(record, "confirmationText");
    const evidenceIds = record.evidenceIds;

    if (workflowType !== "recommendation-review") {
      issues.push({
        code: "invalid_workflow_type",
        field: "workflowType",
        message: "Workflow type must be recommendation-review.",
      });
    }

    if (!targetId || !uuidPattern.test(targetId)) {
      issues.push({
        code: "invalid_target_id",
        field: "targetId",
        message: "Target ID must be a UUID recommendation identifier.",
      });
    }

    if (!action || !recommendationReviewActions.has(action as RecommendationReviewWorkflowAction)) {
      issues.push({
        code: "invalid_workflow_action",
        field: "action",
        message: "Action must be a supported recommendation review workflow action.",
      });
    }

    if (!actorRole || !demoActorRoles.has(actorRole)) {
      issues.push({
        code: "invalid_actor_role",
        field: "actorRole",
        message: "Actor role must be a supported demo role.",
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
        action: action as RecommendationReviewWorkflowAction,
        actorRole: actorRole as string,
        ...(confirmationText ? { confirmationText } : {}),
        ...(Array.isArray(evidenceIds) ? { evidenceIds } : {}),
        ...(reason ? { reason } : {}),
        ...(record.simulateAuditPersistenceFailure === true
          ? { simulateAuditPersistenceFailure: true }
          : {}),
        targetId: targetId as string,
        workflowType: "recommendation-review",
      },
    };
  }

  if (!isDemoWorkflowActionId(actionId)) {
    return {
      issues: [
        {
          code: "invalid_action_id",
          field: "actionId",
          message: "Action ID must use the demo workflow format, for example j02.releaseClient.",
        },
      ],
      ok: false,
    };
  }

  return {
    issues: [
      {
        code: "invalid_action_id",
        field: "actionId",
        message: "Action ID must use the demo workflow format, for example j02.releaseClient.",
      },
    ],
    ok: false,
  };
}
