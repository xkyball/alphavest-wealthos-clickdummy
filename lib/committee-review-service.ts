import {
  AuditResult,
  ObjectType,
  RecommendationStatus,
  WorkflowStatus,
  type PrismaClient,
} from "@prisma/client";

import {
  type BackendDataSurfaceMeta,
  type DataSurfaceQuery,
  paginateDataSurfaceRows,
  sortDataSurfaceRows,
} from "@/lib/data-surface-query-contract";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { stableId } from "@/lib/stable-id";

export const committeeReviewCanonicalApiRoute = "/api/committee-reviews";
export const committeeReviewCanonicalActionApiRoute = "/api/committee-reviews/actions";

export type CommitteeReviewWorkflowAction = "j18.openPeerReview" | "j18.blockPeerReview";

const committeeReviewWorkflowActions = new Set<string>(["j18.openPeerReview", "j18.blockPeerReview"]);

const committeeProcessIds = ["BP-054", "BP-055", "BP-050", "BP-051", "BP-052"] as const;

export type CommitteeReviewSortKey =
  | "advisorApproval"
  | "client"
  | "committeeStatus"
  | "due"
  | "evidence"
  | "priority"
  | "risk";

export type CommitteeReviewStatusFilter = "all" | "blocked" | "in_review" | "pending";

export type CommitteeReviewQueueRow = {
  advisor: string;
  advisorApproval: string;
  client: string;
  clientTenantId: string;
  clientVisible: boolean;
  committeeStatus: "Blocked" | "In Review" | "Pending";
  due: string;
  evidence: string;
  id: string;
  processCommandCount: number;
  processId: string | null;
  processInstanceId: string | null;
  priority: string;
  recommendation: string;
  recommendationId: string;
  risk: "Critical" | "High" | "Medium";
};

export type CommitteeReviewRowsPage = {
  auditProof: {
    latestEventTypes: string[];
    recentCommitteeAuditRows: number;
  };
  meta: BackendDataSurfaceMeta<CommitteeReviewSortKey>;
  rows: CommitteeReviewQueueRow[];
  summary: {
    blocked: number;
    clientVisible: number;
    inReview: number;
    pending: number;
    total: number;
  };
};

export class CommitteeReviewWorkflowActionError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly reasonCode = "committee_review_action_denied",
  ) {
    super(message);
    this.name = "CommitteeReviewWorkflowActionError";
  }
}

export function isCommitteeReviewWorkflowAction(value: unknown): value is CommitteeReviewWorkflowAction {
  return typeof value === "string" && committeeReviewWorkflowActions.has(value);
}

function readableStatus(value: WorkflowStatus | RecommendationStatus | null | undefined) {
  return String(value ?? "PENDING")
    .toLowerCase()
    .split("_")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function committeeStatusFor(input: {
  queueStatus?: WorkflowStatus | null;
  recommendationStatus: RecommendationStatus;
}) {
  if (input.queueStatus === WorkflowStatus.BLOCKED || input.recommendationStatus === RecommendationStatus.BLOCKED) {
    return "Blocked" as const;
  }

  if (
    input.queueStatus === WorkflowStatus.IN_REVIEW ||
    input.queueStatus === WorkflowStatus.ADVISOR_REVIEW ||
    input.recommendationStatus === RecommendationStatus.ADVISOR_APPROVED
  ) {
    return "In Review" as const;
  }

  return "Pending" as const;
}

function riskFor(value: string | null | undefined) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("critical")) return "Critical" as const;
  if (normalized.includes("high")) return "High" as const;
  return "Medium" as const;
}

function evidenceLabel(count: number) {
  if (count <= 0) return "Missing";
  if (count < 2) return `${count} linked`;
  return `${count} linked`;
}

function matchesStatusFilter(row: CommitteeReviewQueueRow, filter: CommitteeReviewStatusFilter) {
  if (filter === "all") return true;
  if (filter === "blocked") return row.committeeStatus === "Blocked";
  if (filter === "in_review") return row.committeeStatus === "In Review";
  return row.committeeStatus === "Pending";
}

function valueFor(row: CommitteeReviewQueueRow, key: CommitteeReviewSortKey) {
  if (key === "advisorApproval") return row.advisorApproval;
  if (key === "client") return row.client;
  if (key === "committeeStatus") return row.committeeStatus;
  if (key === "due") return row.due;
  if (key === "evidence") return row.evidence;
  if (key === "priority") return row.priority;
  return row.risk;
}

export async function listCommitteeReviewRowsPage(
  prisma: PrismaClient,
  query: DataSurfaceQuery<CommitteeReviewSortKey>,
  filters: { status?: CommitteeReviewStatusFilter } = {},
): Promise<CommitteeReviewRowsPage> {
  const [recommendations, committeeQueues, evidenceRecords, processLinks, processCommandRuns, committeeAuditEvents] =
    await Promise.all([
      prisma.recommendation.findMany({
        include: {
          clientTenant: {
            select: {
              displayName: true,
              riskRating: true,
            },
          },
        },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        where: {
          clientVisible: false,
          status: {
            in: [
              RecommendationStatus.ADVISOR_APPROVED,
              RecommendationStatus.COMPLIANCE_PENDING,
              RecommendationStatus.BLOCKED,
              RecommendationStatus.ADVISOR_PENDING,
            ],
          },
        },
      }),
      prisma.queueItem.findMany({
        where: {
          queueName: "Committee review",
          targetType: ObjectType.RECOMMENDATION,
        },
      }),
      prisma.evidenceRecord.findMany({
        select: {
          relatedObjectId: true,
          status: true,
        },
        where: {
          relatedObjectType: ObjectType.RECOMMENDATION,
        },
      }),
      prisma.processObjectLink.findMany({
        include: {
          processInstance: {
            include: {
              processDefinition: {
                select: {
                  processId: true,
                },
              },
            },
          },
        },
        where: {
          objectType: ObjectType.RECOMMENDATION,
        },
      }),
      prisma.processCommandRun.findMany({
        select: {
          processInstanceId: true,
        },
        where: {
          commandKey: {
            startsWith: "COMMITTEE_REVIEW",
          },
        },
      }),
      prisma.auditEvent.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          eventType: true,
        },
        take: 12,
        where: {
          eventType: {
            startsWith: "stage_e.committee_review.",
          },
        },
      }),
    ]);

  const queueByTarget = new Map(committeeQueues.map((queue) => [queue.targetId, queue]));
  const evidenceCountByRecommendation = new Map<string, number>();
  for (const evidence of evidenceRecords) {
    evidenceCountByRecommendation.set(
      evidence.relatedObjectId,
      (evidenceCountByRecommendation.get(evidence.relatedObjectId) ?? 0) + 1,
    );
  }

  const processByRecommendation = new Map<
    string,
    { processId: string; processInstanceId: string }
  >();
  for (const link of processLinks) {
    const processId = link.processInstance.processDefinition.processId;
    if (!committeeProcessIds.includes(processId as (typeof committeeProcessIds)[number])) continue;
    if (!processByRecommendation.has(link.objectId)) {
      processByRecommendation.set(link.objectId, {
        processId,
        processInstanceId: link.processInstanceId,
      });
    }
  }

  const commandCountByProcessInstance = new Map<string, number>();
  for (const run of processCommandRuns) {
    commandCountByProcessInstance.set(
      run.processInstanceId,
      (commandCountByProcessInstance.get(run.processInstanceId) ?? 0) + 1,
    );
  }

  const rows = recommendations
    .map((recommendation): CommitteeReviewQueueRow => {
      const queue = queueByTarget.get(recommendation.id);
      const process = processByRecommendation.get(recommendation.id);
      const committeeStatus = committeeStatusFor({
        queueStatus: queue?.status,
        recommendationStatus: recommendation.status,
      });

      return {
        advisor: "Senior wealth advisor",
        advisorApproval: readableStatus(recommendation.status),
        client: recommendation.clientTenant.displayName,
        clientTenantId: recommendation.clientTenantId,
        clientVisible: recommendation.clientVisible,
        committeeStatus,
        due: (queue?.slaDueAt ?? recommendation.updatedAt).toISOString(),
        evidence: evidenceLabel(evidenceCountByRecommendation.get(recommendation.id) ?? 0),
        id: queue?.id ?? stableId(`queue:committee:${recommendation.id}`),
        processCommandCount: process ? (commandCountByProcessInstance.get(process.processInstanceId) ?? 0) : 0,
        processId: process?.processId ?? null,
        processInstanceId: process?.processInstanceId ?? null,
        priority: queue?.priority ?? (riskFor(recommendation.clientTenant.riskRating) === "Critical" ? "critical" : "high"),
        recommendation: recommendation.title,
        recommendationId: recommendation.id,
        risk: riskFor(recommendation.clientTenant.riskRating),
      };
    })
    .filter((row) => matchesStatusFilter(row, filters.status ?? "all"))
    .filter((row) => {
      const q = query.q.toLowerCase();
      if (!q) return true;
      return [row.client, row.recommendation, row.committeeStatus, row.priority, row.risk, row.advisorApproval]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

  const sortedRows = sortDataSurfaceRows(rows, query, valueFor);
  const page = paginateDataSurfaceRows(sortedRows, query);
  const summary = {
    blocked: rows.filter((row) => row.committeeStatus === "Blocked").length,
    clientVisible: rows.filter((row) => row.clientVisible).length,
    inReview: rows.filter((row) => row.committeeStatus === "In Review").length,
    pending: rows.filter((row) => row.committeeStatus === "Pending").length,
    total: rows.length,
  };

  return {
    auditProof: {
      latestEventTypes: committeeAuditEvents.map((event) => event.eventType),
      recentCommitteeAuditRows: committeeAuditEvents.length,
    },
    meta: page.meta,
    rows: page.rows,
    summary,
  };
}

async function requireCommitteeTarget(prisma: PrismaClient, targetId: string) {
  const recommendation = await prisma.recommendation.findUnique({
    include: {
      clientTenant: {
        select: {
          displayName: true,
          riskRating: true,
        },
      },
    },
    where: { id: targetId },
  });

  if (!recommendation) {
    throw new CommitteeReviewWorkflowActionError("Committee review target was not found.", 404, "target_not_found");
  }

  if (recommendation.clientVisible) {
    throw new CommitteeReviewWorkflowActionError(
      "Committee review cannot mutate a client-visible recommendation.",
      403,
      "client_visible_target_denied",
    );
  }

  return recommendation;
}

export async function runCommitteeReviewWorkflowAction(
  prisma: PrismaClient,
  input: { actionId: CommitteeReviewWorkflowAction; targetId: string },
) {
  const recommendation = await requireCommitteeTarget(prisma, input.targetId);
  const platformTenant = await prisma.platformTenant.findFirst({ select: { id: true }, orderBy: { createdAt: "asc" } });
  if (!platformTenant) {
    throw new CommitteeReviewWorkflowActionError("Platform tenant is missing.", 500, "platform_missing");
  }

  const processLink = await prisma.processObjectLink.findFirst({
    include: {
      processInstance: {
        include: {
          processDefinition: {
            select: {
              processId: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    where: {
      objectId: recommendation.id,
      objectType: ObjectType.RECOMMENDATION,
      processInstance: {
        processDefinition: {
          processId: {
            in: [...committeeProcessIds],
          },
        },
      },
    },
  });

  if (!processLink) {
    throw new CommitteeReviewWorkflowActionError(
      "Committee review requires a workflow-backed recommendation process.",
      409,
      "process_instance_missing",
    );
  }

  const isBlock = input.actionId === "j18.blockPeerReview";
  const nextQueueStatus = isBlock ? WorkflowStatus.BLOCKED : WorkflowStatus.IN_REVIEW;
  const nextRecommendationStatus = isBlock ? RecommendationStatus.BLOCKED : RecommendationStatus.ADVISOR_APPROVED;
  const eventType = isBlock ? "stage_e.committee_review.block_peer_review" : "stage_e.committee_review.open_peer_review";
  const commandKey = isBlock ? "COMMITTEE_REVIEW_BLOCKED" : "COMMITTEE_REVIEW_OPENED";
  const queueId = stableId(`queue:committee:${recommendation.id}`);
  const actorUserId = stableId("user:advisor");

  const result = await prisma.$transaction(async (tx) => {
    const queue = await tx.queueItem.upsert({
      create: {
        id: queueId,
        assignedRoleKey: "senior_wealth_advisor",
        clientTenantId: recommendation.clientTenantId,
        escalated: isBlock,
        priority: riskFor(recommendation.clientTenant.riskRating) === "Critical" ? "critical" : "high",
        queueName: "Committee review",
        slaDueAt: new Date("2026-06-18T12:00:00.000Z"),
        status: nextQueueStatus,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        escalated: isBlock,
        status: nextQueueStatus,
      },
      where: { id: queueId },
    });

    const updatedRecommendation = await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: nextRecommendationStatus,
      },
      where: { id: recommendation.id },
    });

    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: "senior_wealth_advisor",
        actorUserId,
        clientTenantId: recommendation.clientTenantId,
        eventType,
        metadataJson: {
          actionId: input.actionId,
          apiRoute: committeeReviewCanonicalActionApiRoute,
          committeeReviewQueueId: queue.id,
          noAdviceExecution: true,
          noClientRelease: true,
          processId: processLink.processInstance.processDefinition.processId,
          processRuntimeBackbone: true,
        },
        nextState: nextQueueStatus,
        platformTenantId: platformTenant.id,
        previousState: recommendation.status,
        reason: isBlock
          ? "Committee review blocked the internal package pending peer dissent resolution. No client release occurred."
          : "Committee review queue opened for peer review. No client release occurred.",
        result: isBlock ? AuditResult.BLOCKED : AuditResult.SUCCESS,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    await tx.processCommandRun.create({
      data: {
        actorRoleKey: "senior_wealth_advisor",
        actorUserId,
        auditEventId: audit.id,
        commandKey,
        metadataJson: {
          actionId: input.actionId,
          queueName: "Committee review",
          route: "/committee/reviews",
        },
        nextState: nextQueueStatus,
        previousState: recommendation.status,
        processInstanceId: processLink.processInstanceId,
        reason: "Committee queue transition recorded through the workflow command history.",
        result: isBlock ? AuditResult.BLOCKED : AuditResult.SUCCESS,
      },
    });

    return {
      auditEventId: audit.id,
      clientVisible: updatedRecommendation.clientVisible,
      commandKey,
      processCommandRows: 1,
      processId: processLink.processInstance.processDefinition.processId,
      processInstanceId: processLink.processInstanceId,
      queueId: queue.id,
      queueStatus: queue.status,
      recommendationStatus: updatedRecommendation.status,
    };
  });

  const searchIndex = await refreshGlobalSearchIndexAfterMutation(
    prisma,
    `committee-review:${input.actionId}:${recommendation.id}`,
  );

  return {
    ...result,
    clientVisible: false,
    message: isBlock
      ? "Peer review blocked. Internal audit and workflow command history were recorded."
      : "Peer review opened. Internal audit and workflow command history were recorded.",
    noAdviceExecution: true,
    noClientRelease: true,
    searchIndex,
  };
}
