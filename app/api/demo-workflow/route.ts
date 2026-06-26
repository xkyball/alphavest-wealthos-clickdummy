import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  wp05TypedAdvisorWorkflowDirectnessFor,
} from "@/lib/advisory-workflow-contract";
import {
  demoWorkflowActionBoundaryFor,
  typedAdvisorApprovalWorkflowBoundary,
} from "@/lib/demo-workflow-action-registry";
import { parseDemoWorkflowRequestBody } from "@/lib/demo-workflow-validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function safetyForMovedAction(canonicalApiRoute: string) {
  if (canonicalApiRoute === "/api/export-workflow") {
    return {
      commandExecuted: false,
      hiddenRowsDisclosed: false,
      noClientRelease: true,
      noExportApproval: true,
      noExportDownload: true,
      scoped: false,
    };
  }

  if (
    canonicalApiRoute === "/api/advisor-review/actions" ||
    canonicalApiRoute === "/api/tenant-governance/actions" ||
    canonicalApiRoute === "/api/platform-admin/actions" ||
    canonicalApiRoute === "/api/data-maintenance/actions" ||
    canonicalApiRoute === "/api/advice-release-history/actions" ||
    canonicalApiRoute === "/api/review-monitoring/actions" ||
    canonicalApiRoute === "/api/journeys/[id]/commands"
  ) {
    return {
      commandExecuted: false,
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scoped: false,
    };
  }

  return undefined;
}

function movedActionErrorFor(canonicalApiRoute: string) {
  if (canonicalApiRoute === "/api/export-workflow") {
    return "Legacy demo export actions are retired from /api/demo-workflow. Use the typed export workflow API.";
  }

  if (canonicalApiRoute === "/api/advisor-review/actions") {
    return "Legacy J01 advisor-review actions are retired from /api/demo-workflow. Use /api/advisor-review/actions.";
  }

  if (canonicalApiRoute === "/api/journeys/[id]/commands") {
    return "Legacy Phase B/C demo actions are retired from /api/demo-workflow. Use the typed journey command API.";
  }

  if (canonicalApiRoute === "/api/tenant-governance/actions") {
    return "Legacy tenant governance demo actions are retired from /api/demo-workflow. Use /api/tenant-governance/actions.";
  }

  if (canonicalApiRoute === "/api/platform-admin/actions") {
    return "Legacy platform admin demo actions are retired from /api/demo-workflow. Use /api/platform-admin/actions.";
  }

  if (canonicalApiRoute === "/api/data-maintenance/actions") {
    return "Legacy data-maintenance demo actions are retired from /api/demo-workflow. Use /api/data-maintenance/actions.";
  }

  if (canonicalApiRoute === "/api/advice-release-history/actions") {
    return "Legacy advice and release-history demo actions are retired from /api/demo-workflow. Use /api/advice-release-history/actions.";
  }

  return "Legacy review monitoring actions are retired from /api/demo-workflow. Use /api/review-monitoring/actions.";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const parsedBody = parseDemoWorkflowRequestBody(body);
  if (!parsedBody.ok) {
    return failClosedJson(
      {
        error: "Invalid demo workflow request.",
        issues: parsedBody.issues,
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const parsedValue = parsedBody.value;

  if ("workflowType" in parsedValue && parsedValue.workflowType === "advisor-approval") {
    return failClosedJson(
      {
        action: parsedValue.action,
        canonicalApiRoute: typedAdvisorApprovalWorkflowBoundary.canonicalApiRoute,
        demoWorkflowBoundary: typedAdvisorApprovalWorkflowBoundary,
        error:
          "Typed advisor approval workflow actions have moved out of /api/demo-workflow. Use /api/recommendation-review-workflow.",
        legacyReasonCode: typedAdvisorApprovalWorkflowBoundary.reasonCode,
        proofDirectness: wp05TypedAdvisorWorkflowDirectnessFor(parsedValue.action),
        reasonCode: "SAFE_ERROR",
        workflowType: "advisor-approval",
      },
      { status: 410 },
    );
  }

  if (!("actionId" in parsedValue)) {
    return failClosedJson(
      {
        error: "Invalid demo workflow request.",
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const actionId = parsedValue.actionId;
  const demoWorkflowBoundary = demoWorkflowActionBoundaryFor(actionId);

  if (demoWorkflowBoundary.classification === "MOVED_TO_TYPED_PRODUCT_COMMAND") {
    const movedActionSafety = safetyForMovedAction(demoWorkflowBoundary.canonicalApiRoute);

    return failClosedJson(
      {
        actionId,
        canonicalApiRoute: demoWorkflowBoundary.canonicalApiRoute,
        demoWorkflowBoundary,
        error: movedActionErrorFor(demoWorkflowBoundary.canonicalApiRoute),
        legacyReasonCode: demoWorkflowBoundary.reasonCode,
        reasonCode: "SAFE_ERROR",
        ...(movedActionSafety ? { safety: movedActionSafety } : {}),
      },
      { status: 410 },
    );
  }

  if (demoWorkflowBoundary.classification === "UNSUPPORTED_REQUIRES_TYPED_COMMAND") {
    return failClosedJson(
      {
        actionId,
        canonicalApiRoute: demoWorkflowBoundary.canonicalApiRoute,
        demoWorkflowBoundary,
        error:
          "Unsupported demo workflow actions are blocked. Move real journey commands to the typed journey command API before enabling them.",
        legacyReasonCode: demoWorkflowBoundary.reasonCode,
        reasonCode: "SAFE_ERROR",
      },
      { status: 410 },
    );
  }

  return failClosedJson(
    {
      actionId,
      canonicalApiRoute: "/api/advisor-review/actions",
      demoWorkflowBoundary,
      error: "No executable demo workflow actions remain on /api/demo-workflow. Use typed command APIs.",
      legacyReasonCode: "DEMO_WORKFLOW_EXECUTION_RETIRED",
      reasonCode: "SAFE_ERROR",
    },
    { status: 410 },
  );
}
