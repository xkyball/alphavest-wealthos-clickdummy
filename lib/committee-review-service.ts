import {
  AuditResult,
  ObjectType,
  Prisma,
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

export type CommitteeReviewWorkflowAction =
  | "j18.openPeerReview"
  | "j18.blockPeerReview"
  | "j18.recordVote"
  | "j18.requestEvidence"
  | "j18.resolveDissent";

const committeeReviewWorkflowActions = new Set<string>([
  "j18.openPeerReview",
  "j18.blockPeerReview",
  "j18.recordVote",
  "j18.requestEvidence",
  "j18.resolveDissent",
]);

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

export type CommitteeReviewDetail = {
  auditTrail: Array<{
    actor: string;
    id: string;
    result: "BLOCKED" | "PENDING" | "SUCCESS";
    timestamp: string;
    title: string;
  }>;
  client: string;
  clientVisible: boolean;
  committeeStatus: CommitteeReviewQueueRow["committeeStatus"];
  dissent: {
    open: boolean;
    status: "Open" | "Resolution recorded";
    title: string;
  };
  due: string;
  evidence: Array<{
    label: string;
    status: "Linked" | "Missing" | "Requested";
  }>;
  evidenceLinked: number;
  id: string;
  processCommandCount: number;
  processId: string;
  processInstanceId: string;
  recommendation: string;
  recommendationId: string;
  risk: CommitteeReviewQueueRow["risk"];
  stateMessage: string;
  structure: string;
  votes: {
    recorded: number;
    required: number;
    reviewers: Array<{
      note: string;
      reviewer: string;
      role: string;
      vote: "Approved" | "Pending";
    }>;
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

function metadataObject(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function auditTitleFor(eventType: string) {
  if (eventType.endsWith(".record_vote")) return "Committee vote recorded";
  if (eventType.endsWith(".request_evidence")) return "Evidence request recorded";
  if (eventType.endsWith(".resolve_dissent")) return "Dissent resolution recorded";
  if (eventType.endsWith(".block_peer_review")) return "Peer review blocked";
  if (eventType.endsWith(".open_peer_review")) return "Peer review opened";
  return "Committee review event";
}

function detailStateMessage(input: {
  dissentResolved: boolean;
  evidenceRequested: boolean;
  recordedVotes: number;
  requiredVotes: number;
}) {
  if (input.recordedVotes >= input.requiredVotes && input.dissentResolved) {
    return "Committee package is internally ready for downstream compliance review. Client release remains controlled by compliance.";
  }

  if (input.evidenceRequested) {
    return "Evidence request is active. Committee review remains internal until the evidence gap is resolved.";
  }

  if (input.dissentResolved) {
    return "Dissent resolution is recorded. Remaining peer votes are still required before compliance can review release.";
  }

  if (input.recordedVotes > 0) {
    return "Peer vote recorded. Dissent and evidence checks remain internal blockers.";
  }

  return "Committee detail is open for peer vote, dissent resolution and evidence request actions.";
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

export async function getCommitteeReviewDetail(
  prisma: PrismaClient,
  input: { slugOrTargetId?: string | null },
): Promise<CommitteeReviewDetail> {
  const requested = input.slugOrTargetId?.trim();
  const rowsPage = await listCommitteeReviewRowsPage(
    prisma,
    {
      page: 1,
      pageSize: 20,
      q: "",
      sortDirection: "asc",
      sortKey: "due",
    },
    { status: "all" },
  );

  const selectedRow =
    rowsPage.rows.find((row) => row.recommendationId === requested || row.id === requested) ??
    rowsPage.rows.find((row) => requested === "investment-committee" && row.committeeStatus !== "Blocked") ??
    rowsPage.rows[0];

  if (!selectedRow?.processInstanceId || !selectedRow.processId) {
    throw new CommitteeReviewWorkflowActionError("Committee review detail requires a workflow-backed queue row.", 404, "detail_not_found");
  }

  const [recommendation, queue, commandRuns, auditEvents, evidenceRecords] = await Promise.all([
    prisma.recommendation.findUnique({
      include: {
        clientTenant: {
          select: {
            displayName: true,
            riskRating: true,
          },
        },
      },
      where: { id: selectedRow.recommendationId },
    }),
    prisma.queueItem.findUnique({ where: { id: selectedRow.id } }),
    prisma.processCommandRun.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        commandKey: {
          startsWith: "COMMITTEE_REVIEW",
        },
        processInstanceId: selectedRow.processInstanceId,
      },
    }),
    prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      where: {
        eventType: {
          startsWith: "stage_e.committee_review.",
        },
        targetId: selectedRow.recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
    }),
    prisma.evidenceRecord.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      where: {
        relatedObjectId: selectedRow.recommendationId,
        relatedObjectType: ObjectType.RECOMMENDATION,
      },
    }),
  ]);

  if (!recommendation) {
    throw new CommitteeReviewWorkflowActionError("Committee review recommendation was not found.", 404, "target_not_found");
  }

  const voteCommands = commandRuns.filter((run) => run.commandKey === "COMMITTEE_REVIEW_VOTE_RECORDED");
  const evidenceRequested = commandRuns.some((run) => run.commandKey === "COMMITTEE_REVIEW_EVIDENCE_REQUESTED");
  const dissentResolved = commandRuns.some((run) => run.commandKey === "COMMITTEE_REVIEW_DISSENT_RESOLVED");
  const recordedVotes = Math.min(voteCommands.length, 3);
  const reviewers = ["Committee chair", "Portfolio peer", "Compliance liaison"].map((role, index) => {
    const command = voteCommands[index];
    const metadata = metadataObject(command?.metadataJson);
    return {
      note:
        typeof metadata.note === "string"
          ? metadata.note
          : command
            ? "Peer reviewer confirmed the internal package remains committee-only."
            : "Awaiting peer review.",
      reviewer:
        typeof metadata.reviewer === "string"
          ? metadata.reviewer
          : index === 0
            ? "Nadia Hoffmann"
            : index === 1
              ? "Lukas Meyer"
              : "Amara Okafor",
      role,
      vote: command ? ("Approved" as const) : ("Pending" as const),
    };
  });

  const evidence: CommitteeReviewDetail["evidence"] = evidenceRecords.length
    ? evidenceRecords.map((record, index) => ({
        label: record.title || `Evidence item ${index + 1}`,
        status: "Linked" as const,
      }))
    : [
        { label: "Advisor approval record", status: "Linked" as const },
        { label: "IPS suitability memo", status: "Linked" as const },
        { label: "Tax projection evidence", status: "Missing" as const },
      ];

  if (evidenceRequested) {
    evidence.push({ label: "Committee follow-up evidence", status: "Requested" });
  }

  const committeeStatus = committeeStatusFor({
    queueStatus: queue?.status,
    recommendationStatus: recommendation.status,
  });

  return {
    auditTrail: auditEvents.map((event) => ({
      actor: event.actorRoleKey ?? "Committee workflow",
      id: event.id,
      result: event.result === AuditResult.SUCCESS ? "SUCCESS" : event.result === AuditResult.PENDING ? "PENDING" : "BLOCKED",
      timestamp: event.createdAt.toLocaleString("en", {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        year: "numeric",
      }),
      title: auditTitleFor(event.eventType),
    })),
    client: recommendation.clientTenant.displayName,
    clientVisible: false,
    committeeStatus,
    dissent: {
      open: !dissentResolved,
      status: dissentResolved ? "Resolution recorded" : "Open",
      title: dissentResolved ? "Liquidity and estate-plan dissent resolved" : "Liquidity and estate-plan dissent open",
    },
    due: (queue?.slaDueAt ?? recommendation.updatedAt).toISOString(),
    evidence,
    evidenceLinked: evidence.filter((item) => item.status === "Linked").length,
    id: queue?.id ?? selectedRow.id,
    processCommandCount: commandRuns.length,
    processId: selectedRow.processId,
    processInstanceId: selectedRow.processInstanceId,
    recommendation: recommendation.title,
    recommendationId: recommendation.id,
    risk: riskFor(recommendation.clientTenant.riskRating),
    stateMessage: detailStateMessage({
      dissentResolved,
      evidenceRequested,
      recordedVotes,
      requiredVotes: 3,
    }),
    structure: recommendation.clientTenant.displayName,
    votes: {
      recorded: recordedVotes,
      required: 3,
      reviewers,
    },
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
  input: { actionId: CommitteeReviewWorkflowAction; note?: string; targetId: string; typedConfirmation?: string },
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

  const normalizedNote = input.note?.trim() ?? "";
  const normalizedConfirmation = input.typedConfirmation?.trim() ?? "";

  if (input.actionId === "j18.recordVote" && normalizedConfirmation !== "CONFIRM PEER REVIEW") {
    throw new CommitteeReviewWorkflowActionError(
      "Recording a committee vote requires the exact peer review confirmation.",
      403,
      "typed_confirmation_required",
    );
  }

  if (input.actionId === "j18.resolveDissent" && normalizedConfirmation !== "RESOLVE DISSENT") {
    throw new CommitteeReviewWorkflowActionError(
      "Resolving dissent requires the exact dissent resolution confirmation.",
      403,
      "typed_confirmation_required",
    );
  }

  if (input.actionId === "j18.requestEvidence" && normalizedNote.length < 12) {
    throw new CommitteeReviewWorkflowActionError(
      "Evidence requests require a concrete reason before the workflow command can be recorded.",
      400,
      "evidence_reason_required",
    );
  }

  const commandSpec = {
    "j18.blockPeerReview": {
      commandKey: "COMMITTEE_REVIEW_BLOCKED",
      eventType: "stage_e.committee_review.block_peer_review",
      nextQueueStatus: WorkflowStatus.BLOCKED,
      nextRecommendationStatus: RecommendationStatus.BLOCKED,
      result: AuditResult.BLOCKED,
    },
    "j18.openPeerReview": {
      commandKey: "COMMITTEE_REVIEW_OPENED",
      eventType: "stage_e.committee_review.open_peer_review",
      nextQueueStatus: WorkflowStatus.IN_REVIEW,
      nextRecommendationStatus: RecommendationStatus.ADVISOR_APPROVED,
      result: AuditResult.SUCCESS,
    },
    "j18.recordVote": {
      commandKey: "COMMITTEE_REVIEW_VOTE_RECORDED",
      eventType: "stage_e.committee_review.record_vote",
      nextQueueStatus: WorkflowStatus.IN_REVIEW,
      nextRecommendationStatus: RecommendationStatus.ADVISOR_APPROVED,
      result: AuditResult.SUCCESS,
    },
    "j18.requestEvidence": {
      commandKey: "COMMITTEE_REVIEW_EVIDENCE_REQUESTED",
      eventType: "stage_e.committee_review.request_evidence",
      nextQueueStatus: WorkflowStatus.AWAITING_INFO,
      nextRecommendationStatus: RecommendationStatus.MORE_DATA_REQUESTED,
      result: AuditResult.BLOCKED,
    },
    "j18.resolveDissent": {
      commandKey: "COMMITTEE_REVIEW_DISSENT_RESOLVED",
      eventType: "stage_e.committee_review.resolve_dissent",
      nextQueueStatus: WorkflowStatus.IN_REVIEW,
      nextRecommendationStatus: RecommendationStatus.ADVISOR_APPROVED,
      result: AuditResult.SUCCESS,
    },
  } as const satisfies Record<
    CommitteeReviewWorkflowAction,
    {
      commandKey: string;
      eventType: string;
      nextQueueStatus: WorkflowStatus;
      nextRecommendationStatus: RecommendationStatus;
      result: AuditResult;
    }
  >;

  const spec = commandSpec[input.actionId];
  const queueId = stableId(`queue:committee:${recommendation.id}`);
  const actorUserId = stableId("user:advisor");

  const result = await prisma.$transaction(async (tx) => {
    const queue = await tx.queueItem.upsert({
      create: {
        id: queueId,
        assignedRoleKey: "senior_wealth_advisor",
        clientTenantId: recommendation.clientTenantId,
        escalated: input.actionId === "j18.blockPeerReview" || input.actionId === "j18.requestEvidence",
        priority: riskFor(recommendation.clientTenant.riskRating) === "Critical" ? "critical" : "high",
        queueName: "Committee review",
        slaDueAt: new Date("2026-06-18T12:00:00.000Z"),
        status: spec.nextQueueStatus,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        escalated: input.actionId === "j18.blockPeerReview" || input.actionId === "j18.requestEvidence",
        status: spec.nextQueueStatus,
      },
      where: { id: queueId },
    });

    const updatedRecommendation = await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: spec.nextRecommendationStatus,
      },
      where: { id: recommendation.id },
    });

    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: "senior_wealth_advisor",
        actorUserId,
        clientTenantId: recommendation.clientTenantId,
        eventType: spec.eventType,
        metadataJson: {
          actionId: input.actionId,
          apiRoute: committeeReviewCanonicalActionApiRoute,
          committeeReviewQueueId: queue.id,
          noAdviceExecution: true,
          noClientRelease: true,
          note: normalizedNote || undefined,
          processId: processLink.processInstance.processDefinition.processId,
          processRuntimeBackbone: true,
          typedConfirmationMatched: input.actionId === "j18.recordVote" || input.actionId === "j18.resolveDissent",
        },
        nextState: spec.nextQueueStatus,
        platformTenantId: platformTenant.id,
        previousState: recommendation.status,
        reason: normalizedNote || "Committee review workflow command recorded. No client release occurred.",
        result: spec.result,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    await tx.processCommandRun.create({
      data: {
        actorRoleKey: "senior_wealth_advisor",
        actorUserId,
        auditEventId: audit.id,
        commandKey: spec.commandKey,
        metadataJson: {
          actionId: input.actionId,
          note: normalizedNote || undefined,
          queueName: "Committee review",
          reviewer: "Nadia Hoffmann",
          route: "/committee/reviews/:id/decision-room",
        },
        nextState: spec.nextQueueStatus,
        previousState: recommendation.status,
        processInstanceId: processLink.processInstanceId,
        reason: "Committee detail transition recorded in review history.",
        result: spec.result,
      },
    });

    return {
      auditEventId: audit.id,
      clientVisible: updatedRecommendation.clientVisible,
      commandKey: spec.commandKey,
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
    message:
      input.actionId === "j18.requestEvidence"
        ? "Evidence request recorded. The package remains internal and blocked from release."
        : input.actionId === "j18.resolveDissent"
          ? "Dissent resolution recorded. Compliance remains downstream."
          : input.actionId === "j18.recordVote"
            ? "Committee vote recorded. Review history was updated."
            : input.actionId === "j18.blockPeerReview"
              ? "Peer review blocked. Review history was updated."
              : "Peer review opened. Review history was updated.",
    noAdviceExecution: true,
    noClientRelease: true,
    searchIndex,
  };
}
