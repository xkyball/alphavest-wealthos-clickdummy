import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  WorkflowStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  wp05LegacyDemoReleaseActionDirectnessFor,
  wp05TypedAdvisorWorkflowDirectnessFor,
} from "@/lib/advisory-workflow-contract";
import {
  demoWorkflowActionBoundaryFor,
  typedAdvisorApprovalWorkflowBoundary,
} from "@/lib/demo-workflow-action-registry";
import { parseDemoWorkflowRequestBody } from "@/lib/demo-workflow-validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DemoWorkflowAction =
  | "j01.requestData"
  | "j01.routeToAdvisor"
  | "j01.approveAdvisor"
  | "j01.escalateAdvisor";

class UnsupportedLegacyDemoWorkflowActionError extends Error {
  constructor(readonly actionId: string) {
    super(`Unsupported legacy demo workflow action: ${actionId}`);
  }
}

const platformTenantId = stableId("platform:alphavest");
const northbridgeTenantId = tenantId("northbridge");
const northbridgeTriggerId = triggerId("northbridge", "liquidity");
const northbridgeRecommendationId = recommendationId("northbridge");
const northbridgeApprovalId = approvalId("northbridge");

type DemoWorkflowPrismaGlobal = typeof globalThis & {
  alphaVestDemoWorkflowPrisma?: PrismaClient;
};

type DemoWorkflowAuditWriter = Pick<PrismaClient, "auditEvent">;

function stableId(label: string) {
  const hash = createHash("sha1").update(`alphavest-wealthos:${label}`).digest("hex");
  const variant = ((Number.parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, "0");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${variant}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join("-");
}

function tenantId(slug: string) {
  return stableId(`tenant:${slug}`);
}

function userId(key: string) {
  return stableId(`user:${key}`);
}

function triggerId(slug: string, key: string) {
  return stableId(`trigger:${slug}:${key}`);
}

function actionItemId(slug: string, key: string) {
  return stableId(`action:${slug}:${key}`);
}

function recommendationId(slug: string) {
  return stableId(`recommendation:${slug}:liquidity-review`);
}

function approvalId(slug: string) {
  return stableId(`approval:${slug}:advisor`);
}

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as DemoWorkflowPrismaGlobal;
  globalForPrisma.alphaVestDemoWorkflowPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestDemoWorkflowPrisma;
}

async function writeAuditEvent(
  prisma: DemoWorkflowAuditWriter,
  input: {
    actorUserId: string;
    actorRoleKey: string;
    eventType: string;
    targetType: ObjectType;
    targetId: string;
    clientTenantId?: string;
    previousState: string;
    nextState: string;
    reason: string;
    actionId: DemoWorkflowAction;
  }
) {
  await prisma.auditEvent.create({
    data: {
      platformTenantId,
      clientTenantId: input.clientTenantId ?? northbridgeTenantId,
      actorUserId: input.actorUserId,
      actorRoleKey: input.actorRoleKey,
      eventType: input.eventType,
      targetType: input.targetType,
      targetId: input.targetId,
      previousState: input.previousState,
      nextState: input.nextState,
      result: AuditResult.SUCCESS,
      reason: input.reason,
      metadataJson: {
        actionId: input.actionId,
        demoScope: "screencast",
        noClientRelease: true,
      },
    },
  });
}

async function runDemoWorkflowAction(
  prisma: PrismaClient,
  actionId: DemoWorkflowAction,
) {
  const now = new Date();

  switch (actionId) {
    case "j01.requestData": {
      const result = await prisma.$transaction(async (tx) => {
        const trigger = await tx.trigger.updateMany({
          where: { id: northbridgeTriggerId, clientTenantId: northbridgeTenantId },
          data: {
            status: WorkflowStatus.AWAITING_INFO,
            clientVisible: false,
          },
        });
        const blockedReleaseAction = await tx.actionItem.updateMany({
          where: {
            id: actionItemId("northbridge", "blocked-release"),
            clientTenantId: northbridgeTenantId,
          },
          data: {
            status: WorkflowStatus.AWAITING_INFO,
            clientVisible: false,
            blockedReason: "Screencast J01 requested ownership, wire purpose and source-of-funds confirmation.",
          },
        });
        await writeAuditEvent(tx, {
          actorUserId: userId("analyst"),
          actorRoleKey: "analyst",
          eventType: "screencast.trigger.request_data",
          targetType: ObjectType.TRIGGER,
          targetId: northbridgeTriggerId,
          previousState: WorkflowStatus.ANALYST_REVIEW,
          nextState: WorkflowStatus.AWAITING_INFO,
          reason: "Requested missing information before analyst routing.",
          actionId,
        });
        return { actionItemRows: blockedReleaseAction.count, triggerRows: trigger.count };
      });

      return { message: "Request-data state saved.", ...result };
    }

    case "j01.routeToAdvisor": {
      const result = await prisma.$transaction(async (tx) => {
        const trigger = await tx.trigger.updateMany({
          where: { id: northbridgeTriggerId, clientTenantId: northbridgeTenantId },
          data: {
            status: WorkflowStatus.ADVISOR_REVIEW,
            clientVisible: false,
          },
        });
        const recommendation = await tx.recommendation.updateMany({
          where: { id: northbridgeRecommendationId, clientTenantId: northbridgeTenantId },
          data: {
            status: RecommendationStatus.ADVISOR_PENDING,
            clientVisible: false,
          },
        });
        const approval = await tx.approval.updateMany({
          where: { id: northbridgeApprovalId, clientTenantId: northbridgeTenantId },
          data: {
            status: ReviewStatus.IN_REVIEW,
            notes: "Routed to senior wealth advisor for screencast J01. Compliance release remains required.",
          },
        });
        await writeAuditEvent(tx, {
          actorUserId: userId("analyst"),
          actorRoleKey: "analyst",
          eventType: "screencast.trigger.route_to_advisor",
          targetType: ObjectType.RECOMMENDATION,
          targetId: northbridgeRecommendationId,
          previousState: RecommendationStatus.BLOCKED,
          nextState: RecommendationStatus.ADVISOR_PENDING,
          reason: "Routed advisor package without client visibility.",
          actionId,
        });
        return {
          approvalRows: approval.count,
          recommendationRows: recommendation.count,
          triggerRows: trigger.count,
        };
      });

      return { message: "Advisor routing state saved.", ...result };
    }

    case "j01.approveAdvisor": {
      const result = await prisma.$transaction(async (tx) => {
        const approval = await tx.approval.updateMany({
          where: { id: northbridgeApprovalId, clientTenantId: northbridgeTenantId },
          data: {
            status: ReviewStatus.APPROVED,
            notes: "Advisor approved in screencast J01. Client release is still blocked by compliance.",
            approvedAt: now,
          },
        });
        const recommendation = await tx.recommendation.updateMany({
          where: { id: northbridgeRecommendationId, clientTenantId: northbridgeTenantId },
          data: {
            status: RecommendationStatus.ADVISOR_APPROVED,
            clientVisible: false,
          },
        });
        await writeAuditEvent(tx, {
          actorUserId: userId("advisor"),
          actorRoleKey: "senior_wealth_advisor",
          eventType: "screencast.approval.approve",
          targetType: ObjectType.RECOMMENDATION,
          targetId: northbridgeRecommendationId,
          previousState: ReviewStatus.IN_REVIEW,
          nextState: ReviewStatus.APPROVED,
          reason: "Advisor approved the package; compliance release remains required.",
          actionId,
        });
        return { approvalRows: approval.count, recommendationRows: recommendation.count };
      });

      return { message: "Advisor approval saved. Compliance release is still required.", ...result };
    }

    case "j01.escalateAdvisor": {
      const result = await prisma.$transaction(async (tx) => {
        const approval = await tx.approval.updateMany({
          where: { id: northbridgeApprovalId, clientTenantId: northbridgeTenantId },
          data: {
            status: ReviewStatus.ESCALATED_TO_CALL,
            notes: "Advisor escalated the non-release alternative to a call in screencast J01.",
          },
        });
        const recommendation = await tx.recommendation.updateMany({
          where: { id: northbridgeRecommendationId, clientTenantId: northbridgeTenantId },
          data: {
            status: RecommendationStatus.BLOCKED,
            clientVisible: false,
          },
        });
        await writeAuditEvent(tx, {
          actorUserId: userId("advisor"),
          actorRoleKey: "senior_wealth_advisor",
          eventType: "screencast.approval.escalate_to_call",
          targetType: ObjectType.RECOMMENDATION,
          targetId: northbridgeRecommendationId,
          previousState: ReviewStatus.APPROVED,
          nextState: ReviewStatus.ESCALATED_TO_CALL,
          reason: "Escalated to call as a non-release alternative.",
          actionId,
        });
        return { approvalRows: approval.count, recommendationRows: recommendation.count };
      });

      return { message: "Advisor escalation saved. No client release was created.", ...result };
    }

    default:
      throw new UnsupportedLegacyDemoWorkflowActionError(actionId as string);
  }
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for demo workflow actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 }
    );
  }

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
      const movedActionSafety =
        demoWorkflowBoundary.canonicalApiRoute === "/api/export-workflow"
          ? {
            commandExecuted: false,
            hiddenRowsDisclosed: false,
            noClientRelease: true,
            noExportApproval: true,
            noExportDownload: true,
            scoped: false,
          }
        : demoWorkflowBoundary.canonicalApiRoute === "/api/tenant-governance/actions" ||
            demoWorkflowBoundary.canonicalApiRoute === "/api/platform-admin/actions" ||
            demoWorkflowBoundary.canonicalApiRoute === "/api/data-maintenance/actions" ||
            demoWorkflowBoundary.canonicalApiRoute === "/api/advice-release-history/actions"
          ? {
              commandExecuted: false,
              hiddenRowsDisclosed: false,
              noAdviceExecution: true,
              noClientRelease: true,
              scoped: false,
            }
        : undefined;
    return failClosedJson(
      {
        actionId,
        canonicalApiRoute: demoWorkflowBoundary.canonicalApiRoute,
        demoWorkflowBoundary,
        error:
          demoWorkflowBoundary.canonicalApiRoute === "/api/export-workflow"
            ? "Legacy demo export actions are retired from /api/demo-workflow. Use the typed export workflow API."
            : demoWorkflowBoundary.canonicalApiRoute === "/api/journeys/[id]/commands"
              ? "Legacy Phase B/C demo actions are retired from /api/demo-workflow. Use the typed journey command API."
              : demoWorkflowBoundary.canonicalApiRoute === "/api/tenant-governance/actions"
                ? "Legacy tenant governance demo actions are retired from /api/demo-workflow. Use /api/tenant-governance/actions."
                : demoWorkflowBoundary.canonicalApiRoute === "/api/platform-admin/actions"
                  ? "Legacy platform admin demo actions are retired from /api/demo-workflow. Use /api/platform-admin/actions."
                  : demoWorkflowBoundary.canonicalApiRoute === "/api/data-maintenance/actions"
                    ? "Legacy data-maintenance demo actions are retired from /api/demo-workflow. Use /api/data-maintenance/actions."
                    : demoWorkflowBoundary.canonicalApiRoute === "/api/advice-release-history/actions"
                      ? "Legacy advice and release-history demo actions are retired from /api/demo-workflow. Use /api/advice-release-history/actions."
                      : "Review monitoring actions have moved out of /api/demo-workflow. Use /api/review-monitoring/actions.",
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

  const demoWorkflowActionId = actionId as DemoWorkflowAction;
  const proofDirectness = wp05LegacyDemoReleaseActionDirectnessFor(actionId);

  try {
    const result = await runDemoWorkflowAction(prisma, demoWorkflowActionId);
    const releasedToClient =
      typeof result === "object" &&
      result !== null &&
      "clientVisible" in result &&
      result.clientVisible === true;

    return NextResponse.json({
      actionId,
      demoWorkflowBoundary,
      demoOnly: true,
      noClientRelease: !releasedToClient,
      ok: true,
      productCommandAllowed: false,
      proofDirectness,
      result,
    });
  } catch (error) {
    if (error instanceof UnsupportedLegacyDemoWorkflowActionError) {
      return failClosedJson(
        {
          actionId: error.actionId,
          canonicalApiRoute: "/api/journeys/[id]/commands",
          error:
            "Unsupported demo workflow actions are blocked. Move real journey commands to the typed journey command API before enabling them.",
          legacyReasonCode: "UNSUPPORTED_DEMO_WORKFLOW_ACTION_BLOCKED",
          reasonCode: "SAFE_ERROR",
        },
        { status: 410 },
      );
    }

    return failClosedJson(
      {
        actionId,
        error: "Demo workflow action failed.",
        reasonCode: "SAFE_ERROR",
      },
      { status: 409 },
    );
  }
}
