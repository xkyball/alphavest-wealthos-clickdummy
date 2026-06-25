import {
  AuditResult,
  EvidenceStatus,
  ObjectType,
  Prisma,
  type PrismaClient,
  RecommendationStatus,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";

import { demoPlatformTenantId, requireDemoSession, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { createP44EvidenceRequest } from "@/lib/p44-phase3-evidence-lifecycle";
import { stableId } from "@/lib/stable-id";

type P44PrismaTx = Prisma.TransactionClient;

export type P44SignalSource = "advisor_input" | "client_service" | "document_expiry" | "external_signal" | "internal_monitoring";
export type P44SignalSeverity = "low" | "medium" | "high" | "critical";
export type P44SignalScope = "tenant" | "engagement" | "object";
export type P44WorkbenchAction = "assign_review" | "block_signal" | "request_evidence" | "route_to_advisor";

export type P44ActionUiState = "awaiting_info" | "blocked" | "completed" | "in_review" | "new";

export class P44Phase4ValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super("Invalid P44 Phase 4 signal/workbench request.");
  }
}

export class P44Phase4PermissionError extends Error {
  constructor(public readonly reasonCode: string) {
    super("P44 Phase 4 signal/workbench action is not permitted.");
  }
}

const allowedSignalRoles = new Set<DemoRoleKey>(["analyst", "client_success", "compliance_officer", "senior_wealth_advisor"]);
const allowedWorkbenchRoles = new Set<DemoRoleKey>(["analyst", "compliance_officer", "senior_wealth_advisor"]);
const supportedSources = new Set<P44SignalSource>(["advisor_input", "client_service", "document_expiry", "external_signal", "internal_monitoring"]);
const supportedSeverities = new Set<P44SignalSeverity>(["low", "medium", "high", "critical"]);
const supportedScopes = new Set<P44SignalScope>(["tenant", "engagement", "object"]);

function assertSignalRole(roleKey: DemoRoleKey) {
  if (!allowedSignalRoles.has(roleKey)) {
    throw new P44Phase4PermissionError("signal_role_denied");
  }
}

function assertWorkbenchRole(roleKey: DemoRoleKey) {
  if (!allowedWorkbenchRoles.has(roleKey)) {
    throw new P44Phase4PermissionError("workbench_role_denied");
  }
}

function requireReason(reason: string) {
  if (reason.trim().length < 12) {
    throw new P44Phase4ValidationError(["reason_min_length"]);
  }
}

function validateSignalInput(input: {
  confidenceScore: number;
  scope: P44SignalScope;
  severity: P44SignalSeverity;
  source: P44SignalSource;
  title: string;
}) {
  const issues: string[] = [];
  if (!supportedSources.has(input.source)) issues.push("unsupported_source");
  if (!supportedSeverities.has(input.severity)) issues.push("unsupported_severity");
  if (!supportedScopes.has(input.scope)) issues.push("unsupported_scope");
  if (!Number.isFinite(input.confidenceScore) || input.confidenceScore < 0 || input.confidenceScore > 100) {
    issues.push("confidence_out_of_range");
  }
  if (input.title.trim().length < 6) issues.push("title_min_length");

  if (issues.length) {
    throw new P44Phase4ValidationError(issues);
  }
}

function metadata(input: Prisma.InputJsonObject): Prisma.InputJsonObject {
  return {
    noAdviceExecution: true,
    noAutonomousAdvice: true,
    noClientRelease: true,
    noExportApproval: true,
    p44Phase: "PH4",
    ...input,
  };
}

function triggerIdFor(tenantSlug: DemoTenantSlug, signalKey: string) {
  return stableId(`p44:phase4:trigger:${tenantSlug}:${signalKey}`);
}

function queueIdFor(tenantSlug: DemoTenantSlug, signalKey: string) {
  return stableId(`p44:phase4:queue:${tenantSlug}:${signalKey}`);
}

function actionIdFor(tenantSlug: DemoTenantSlug, signalKey: string) {
  return stableId(`p44:phase4:action:${tenantSlug}:${signalKey}`);
}

async function writeP44Audit(
  tx: P44PrismaTx,
  input: {
    actorRoleKey: DemoRoleKey;
    actorUserId: string;
    clientTenantId: string;
    eventType: string;
    evidenceRecordId?: string;
    metadataJson?: Prisma.InputJsonObject;
    nextState?: string;
    previousState?: string;
    reason: string;
    result: AuditResult;
    targetId: string;
    targetType: ObjectType;
  },
) {
  return tx.auditEvent.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId,
      clientTenantId: input.clientTenantId,
      eventType: input.eventType,
      evidenceRecordId: input.evidenceRecordId,
      metadataJson: metadata(input.metadataJson ?? {}),
      nextState: input.nextState,
      platformTenantId: demoPlatformTenantId,
      previousState: input.previousState,
      reason: input.reason,
      result: input.result,
      targetId: input.targetId,
      targetType: input.targetType,
    },
  });
}

export async function createP44SignalIntake(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    confidenceScore: number;
    description: string;
    reason: string;
    scope: P44SignalScope;
    severity: P44SignalSeverity;
    signalKey: string;
    source: P44SignalSource;
    tenantSlug: DemoTenantSlug;
    title: string;
    triggerType: string;
  },
) {
  assertSignalRole(input.actorRoleKey);
  requireReason(input.reason);
  validateSignalInput(input);

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const triggerId = triggerIdFor(input.tenantSlug, input.signalKey);
  const queueId = queueIdFor(input.tenantSlug, input.signalKey);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.trigger.findUnique({ where: { id: triggerId } });
    const trigger = await tx.trigger.upsert({
      create: {
        clientTenantId: session.tenant.id,
        clientVisible: false,
        confidenceScore: new Prisma.Decimal(input.confidenceScore),
        createdBy: session.role.key,
        description: input.description,
        id: triggerId,
        severity: input.severity,
        source: input.source,
        status: WorkflowStatus.NEW,
        title: input.title,
        triggerType: input.triggerType,
      },
      update: {
        clientVisible: false,
        confidenceScore: new Prisma.Decimal(input.confidenceScore),
        description: input.description,
        severity: input.severity,
        source: input.source,
        status: WorkflowStatus.NEW,
        title: input.title,
        triggerType: input.triggerType,
      },
      where: { id: triggerId },
    });
    const queue = await tx.queueItem.upsert({
      create: {
        assignedRoleKey: "analyst",
        clientTenantId: session.tenant.id,
        escalated: input.severity === "critical",
        id: queueId,
        priority: input.severity,
        queueName: "Signal intake",
        status: WorkflowStatus.NEW,
        targetId: trigger.id,
        targetType: ObjectType.TRIGGER,
      },
      update: {
        assignedRoleKey: "analyst",
        escalated: input.severity === "critical",
        priority: input.severity,
        status: WorkflowStatus.NEW,
        targetId: trigger.id,
        targetType: ObjectType.TRIGGER,
      },
      where: { id: queueId },
    });
    const audit = await writeP44Audit(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      clientTenantId: session.tenant.id,
      eventType: "p44.signal.intake.created",
      metadataJson: {
        confidenceScore: input.confidenceScore,
        queueItemId: queue.id,
        scope: input.scope,
        source: input.source,
      },
      nextState: trigger.status,
      previousState: existing?.status,
      reason: input.reason,
      result: AuditResult.PENDING,
      targetId: trigger.id,
      targetType: ObjectType.TRIGGER,
    });

    return {
      auditEventId: audit.id,
      clientVisible: trigger.clientVisible,
      noAutonomousAdvice: true,
      queueItemId: queue.id,
      queueStatus: queue.status,
      status: trigger.status,
      triggerId: trigger.id,
    };
  });
}

export function validateP44SignalForWorkflow(input: {
  confidenceScore: number;
  scope: P44SignalScope;
  severity: P44SignalSeverity;
  source: P44SignalSource;
  title: string;
}) {
  validateSignalInput(input);

  return {
    accepted: true,
    state: "validated_for_internal_workflow",
  };
}

export async function triageP44WorkbenchAction(
  prisma: PrismaClient,
  input: {
    action: P44WorkbenchAction;
    actorRoleKey: DemoRoleKey;
    reason: string;
    tenantSlug: DemoTenantSlug;
    triggerId: string;
  },
) {
  assertWorkbenchRole(input.actorRoleKey);
  requireReason(input.reason);

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const trigger = await prisma.trigger.findFirst({
    where: { clientTenantId: session.tenant.id, id: input.triggerId },
  });

  if (!trigger) {
    throw new P44Phase4ValidationError(["trigger_scope_required"]);
  }

  const nextState =
    input.action === "block_signal"
      ? WorkflowStatus.BLOCKED
      : input.action === "route_to_advisor"
        ? WorkflowStatus.ADVISOR_REVIEW
        : input.action === "request_evidence"
          ? WorkflowStatus.AWAITING_INFO
          : WorkflowStatus.IN_REVIEW;

  return prisma.$transaction(async (tx) => {
    const updatedTrigger = await tx.trigger.update({
      data: {
        clientVisible: false,
        status: nextState,
      },
      where: { id: trigger.id },
    });
    const actionItem = await tx.actionItem.upsert({
      create: {
        assignedRoleKey: input.action === "route_to_advisor" ? "senior_wealth_advisor" : "analyst",
        blockedReason: input.action === "block_signal" || input.action === "request_evidence" ? input.reason : null,
        clientTenantId: session.tenant.id,
        clientVisible: false,
        description: input.reason,
        evidenceStatus: input.action === "request_evidence" ? EvidenceStatus.PLACEHOLDER : null,
        id: actionIdFor(input.tenantSlug, trigger.id),
        priority: trigger.severity,
        status: nextState,
        title: `Workbench action for ${trigger.title}`,
        triggerId: trigger.id,
      },
      update: {
        assignedRoleKey: input.action === "route_to_advisor" ? "senior_wealth_advisor" : "analyst",
        blockedReason: input.action === "block_signal" || input.action === "request_evidence" ? input.reason : null,
        clientVisible: false,
        description: input.reason,
        evidenceStatus: input.action === "request_evidence" ? EvidenceStatus.PLACEHOLDER : null,
        priority: trigger.severity,
        status: nextState,
      },
      where: { id: actionIdFor(input.tenantSlug, trigger.id) },
    });
    const recommendation = await tx.recommendation.updateMany({
      data: {
        clientVisible: false,
        status: input.action === "route_to_advisor" ? RecommendationStatus.ADVISOR_PENDING : RecommendationStatus.BLOCKED,
      },
      where: { clientTenantId: session.tenant.id, triggerId: trigger.id },
    });
    const audit = await writeP44Audit(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      clientTenantId: session.tenant.id,
      eventType: `p44.workbench.${input.action}`,
      metadataJson: {
        actionItemId: actionItem.id,
        recommendationRows: recommendation.count,
        workbenchAction: input.action,
      },
      nextState: updatedTrigger.status,
      previousState: trigger.status,
      reason: input.reason,
      result: input.action === "block_signal" ? AuditResult.BLOCKED : AuditResult.PENDING,
      targetId: trigger.id,
      targetType: ObjectType.TRIGGER,
    });

    return {
      actionItemId: actionItem.id,
      actionStatus: actionItem.status,
      auditEventId: audit.id,
      clientVisible: updatedTrigger.clientVisible,
      noClientRelease: true,
      recommendationRows: recommendation.count,
      triggerStatus: updatedTrigger.status,
    };
  });
}

export async function createP44ActionItemFromSignal(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    assignedRoleKey: DemoRoleKey;
    reason: string;
    tenantSlug: DemoTenantSlug;
    title: string;
    triggerId: string;
  },
) {
  assertWorkbenchRole(input.actorRoleKey);
  requireReason(input.reason);

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const trigger = await prisma.trigger.findFirst({ where: { clientTenantId: session.tenant.id, id: input.triggerId } });

  if (!trigger) {
    throw new P44Phase4ValidationError(["trigger_scope_required"]);
  }

  return prisma.$transaction(async (tx) => {
    const action = await tx.actionItem.create({
      data: {
        assignedRoleKey: input.assignedRoleKey,
        clientTenantId: session.tenant.id,
        clientVisible: false,
        description: input.reason,
        priority: trigger.severity,
        status: WorkflowStatus.NEW,
        title: input.title,
        triggerId: trigger.id,
      },
    });
    const audit = await writeP44Audit(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      clientTenantId: session.tenant.id,
      eventType: "p44.action_item.created_from_signal",
      metadataJson: {
        actionItemId: action.id,
        assignedRoleKey: input.assignedRoleKey,
      },
      nextState: action.status,
      reason: input.reason,
      result: AuditResult.PENDING,
      targetId: action.id,
      targetType: ObjectType.ACTION_ITEM,
    });

    return {
      actionItemId: action.id,
      auditEventId: audit.id,
      clientVisible: action.clientVisible,
      status: action.status,
    };
  });
}

export function p44ActionItemUiState(input: {
  blockedReason?: string | null;
  clientVisible: boolean;
  evidenceStatus?: EvidenceStatus | null;
  status: WorkflowStatus;
}): {
  clientSafe: boolean;
  primaryState: P44ActionUiState;
  recoveryRequired: boolean;
} {
  const primaryState =
    input.status === WorkflowStatus.AWAITING_INFO
      ? "awaiting_info"
      : input.status === WorkflowStatus.BLOCKED || input.blockedReason
        ? "blocked"
        : input.status === WorkflowStatus.COMPLETED
          ? "completed"
          : input.status === WorkflowStatus.IN_REVIEW || input.status === WorkflowStatus.ANALYST_REVIEW || input.status === WorkflowStatus.ADVISOR_REVIEW
            ? "in_review"
            : "new";

  return {
    clientSafe: !input.clientVisible,
    primaryState,
    recoveryRequired: primaryState === "awaiting_info" || primaryState === "blocked" || input.evidenceStatus === EvidenceStatus.PLACEHOLDER,
  };
}

export async function identifyP44EvidenceGapFromWorkbench(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    gapReason: string;
    tenantSlug: DemoTenantSlug;
    triggerId: string;
  },
) {
  assertWorkbenchRole(input.actorRoleKey);
  requireReason(input.gapReason);

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const trigger = await prisma.trigger.findFirst({
    where: { clientTenantId: session.tenant.id, id: input.triggerId },
  });

  if (!trigger) {
    throw new P44Phase4ValidationError(["trigger_scope_required"]);
  }

  const recommendation = await prisma.recommendation.findFirst({
    where: { clientTenantId: session.tenant.id, triggerId: trigger.id },
  });

  if (!recommendation) {
    return prisma.$transaction(async (tx) => {
      const blocked = await tx.trigger.update({
        data: {
          clientVisible: false,
          status: WorkflowStatus.BLOCKED,
        },
        where: { id: trigger.id },
      });
      const audit = await writeP44Audit(tx, {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "p44.evidence_gap.blocked_no_target",
        metadataJson: { triggerId: trigger.id },
        nextState: blocked.status,
        previousState: trigger.status,
        reason: input.gapReason,
        result: AuditResult.BLOCKED,
        targetId: trigger.id,
        targetType: ObjectType.TRIGGER,
      });

      return {
        auditEventId: audit.id,
        clientVisible: blocked.clientVisible,
        evidenceRecordId: null,
        requestState: "blocked_no_recommendation",
        triggerStatus: blocked.status,
      };
    });
  }

  const request = await createP44EvidenceRequest(prisma, {
    actorRoleKey: input.actorRoleKey,
    reason: input.gapReason,
    source: "internal",
    targetRecommendationId: recommendation.id,
    tenantSlug: input.tenantSlug,
  });
  await prisma.$transaction(async (tx) => {
    await tx.actionItem.updateMany({
      data: {
        blockedReason: input.gapReason,
        clientVisible: false,
        evidenceStatus: EvidenceStatus.PLACEHOLDER,
        status: WorkflowStatus.AWAITING_INFO,
      },
      where: { clientTenantId: session.tenant.id, triggerId: trigger.id },
    });
    await writeP44Audit(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      clientTenantId: session.tenant.id,
      eventType: "p44.evidence_gap.converted_to_request",
      evidenceRecordId: request.evidenceRecordId,
      metadataJson: {
        evidenceItemId: request.evidenceItemId,
        recommendationId: recommendation.id,
        triggerId: trigger.id,
      },
      nextState: WorkflowStatus.AWAITING_INFO,
      previousState: trigger.status,
      reason: input.gapReason,
      result: AuditResult.PENDING,
      targetId: trigger.id,
      targetType: ObjectType.TRIGGER,
    });
  });

  return {
    auditEventId: request.auditEventId,
    clientVisible: false,
    evidenceRecordId: request.evidenceRecordId,
    requestState: "evidence_request_created",
    triggerStatus: WorkflowStatus.AWAITING_INFO,
  };
}

export async function assertP44NoAutoAdviceForTrigger(
  prisma: PrismaClient,
  input: { tenantSlug: DemoTenantSlug; triggerId: string },
) {
  const session = requireDemoSession({ roleKey: "analyst", tenantSlug: input.tenantSlug });
  const [trigger, actionItems, recommendations] = await Promise.all([
    prisma.trigger.findFirstOrThrow({ where: { clientTenantId: session.tenant.id, id: input.triggerId } }),
    prisma.actionItem.findMany({ where: { clientTenantId: session.tenant.id, triggerId: input.triggerId } }),
    prisma.recommendation.findMany({ where: { clientTenantId: session.tenant.id, triggerId: input.triggerId } }),
  ]);

  const clientVisibleActionItems = actionItems.filter((item) => item.clientVisible);
  const clientVisibleRecommendations = recommendations.filter((item) => item.clientVisible);
  const recommendationIds = recommendations.map((recommendation) => recommendation.id);
  const evidenceRecords = recommendationIds.length
    ? await prisma.evidenceRecord.findMany({
        where: {
          clientTenantId: session.tenant.id,
          relatedObjectId: { in: recommendationIds },
          relatedObjectType: ObjectType.RECOMMENDATION,
        },
      })
    : [];
  const releasedEvidence = evidenceRecords.filter((item) => item.visibilityStatus === VisibilityStatus.CLIENT_VISIBLE || item.status === EvidenceStatus.RELEASED);

  return {
    autonomousAdviceCreated: false,
    clientVisibleActionItems: clientVisibleActionItems.length,
    clientVisibleRecommendations: clientVisibleRecommendations.length,
    clientVisibleTrigger: trigger.clientVisible,
    releasedEvidenceRecords: releasedEvidence.length,
    safe:
      !trigger.clientVisible &&
      clientVisibleActionItems.length === 0 &&
      clientVisibleRecommendations.length === 0 &&
      releasedEvidence.length === 0,
  };
}

export function certifyP44SignalWorkbenchExit(input: {
  negativeProofs: string[];
  readyProcessIds: string[];
  ticketIds: string[];
}) {
  const requiredTickets = [
    "P44-4-T01-IMPL",
    "P44-4-T02-IMPL",
    "P44-4-T03-IMPL",
    "P44-4-T04-IMPL",
    "P44-4-T05-IMPL",
    "P44-4-T06-IMPL",
    "P44-4-T07-IMPL",
    "P44-4-T08-IMPL",
    "P44-4-T09-IMPL",
  ];
  const requiredProofs = [
    "signal_not_client_advice",
    "invalid_signal_rejected",
    "triage_internal_only",
    "action_item_internal_only",
    "gap_flag_not_sufficiency",
    "gap_request_no_visibility",
    "no_autonomous_advice",
  ];

  return {
    missingProofs: requiredProofs.filter((proof) => !input.negativeProofs.includes(proof)),
    missingTickets: requiredTickets.filter((ticket) => !input.ticketIds.includes(ticket)),
    phase: "PH4",
    ready:
      requiredTickets.every((ticket) => input.ticketIds.includes(ticket)) &&
      requiredProofs.every((proof) => input.negativeProofs.includes(proof)) &&
      input.readyProcessIds.includes("D-001") &&
      input.readyProcessIds.includes("D-005") &&
      input.readyProcessIds.includes("D-006") &&
      input.readyProcessIds.includes("D-007"),
  };
}
