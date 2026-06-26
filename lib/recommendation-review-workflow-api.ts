import { NextResponse } from "next/server";
import type { PrismaClient } from "@prisma/client";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  wp05CanonicalJourneyCommandApiRoute,
  wp05TypedAdvisorWorkflowDirectnessFor,
} from "@/lib/advisory-workflow-contract";
import { parseRecommendationReviewWorkflowRequestBody } from "@/lib/recommendation-review-workflow-validation";
import type { DemoRoleKey } from "@/lib/demo-session";
import {
  AdvisorApprovalWorkflowError,
  runAdvisorApprovalWorkflowMutation,
} from "@/lib/typed-workflow-command-bus";

export async function handleRecommendationReviewWorkflowRequest(request: Request, prisma: PrismaClient | undefined) {
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for recommendation review workflow actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => undefined);
  const parsedBody = parseRecommendationReviewWorkflowRequestBody(body);
  if (!parsedBody.ok) {
    return failClosedJson(
      {
        error: "Invalid recommendation review workflow request.",
        issues: parsedBody.issues,
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const parsedValue = parsedBody.value;
  if (!("workflowType" in parsedValue) || parsedValue.workflowType !== "advisor-approval") {
    return failClosedJson(
      {
        canonicalApiRoute: wp05CanonicalJourneyCommandApiRoute,
        error: "Recommendation review workflow requires a typed advisor approval request.",
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  try {
    const result = await runAdvisorApprovalWorkflowMutation(prisma, {
      action: parsedValue.action,
      actorRoleKey: parsedValue.actorRole as DemoRoleKey,
      auditPersistenceAvailable:
        parsedValue.simulateAuditPersistenceFailure === true ? false : undefined,
      confirmationText: parsedValue.confirmationText,
      evidenceIds: parsedValue.evidenceIds,
      reason: parsedValue.reason,
      targetId: parsedValue.targetId,
    });

    return NextResponse.json({
      action: parsedValue.action,
      noClientRelease: !result.clientVisible,
      ok: true,
      proofDirectness: wp05TypedAdvisorWorkflowDirectnessFor(parsedValue.action),
      result,
      workflowType: "advisor-approval",
    });
  } catch (error) {
    return failClosedJson(
      {
        action: parsedValue.action,
        error:
          error instanceof AdvisorApprovalWorkflowError
            ? error.message
            : "Recommendation review workflow action failed.",
        gateMissing: error instanceof AdvisorApprovalWorkflowError ? error.details?.gateMissing : undefined,
        reasonCode: "SAFE_ERROR",
        releasePreconditions:
          error instanceof AdvisorApprovalWorkflowError
            ? error.details?.releasePreconditions
            : undefined,
        workflowType: "advisor-approval",
      },
      { status: error instanceof AdvisorApprovalWorkflowError ? error.status : 409 },
    );
  }
}
