import { AuditResult, WorkflowStatus, type ObjectType, type Prisma, type PrismaClient } from "@prisma/client";

import { auditService } from "@/lib/audit-service";
import { createDataQualityRepository } from "@/lib/data-quality-repository";
import type { ObjectType as DomainObjectType, PermissionAction } from "@/lib/domain-types";

export type DataQualitySnapshotInput = {
  clientTenantId: string;
  targetId?: string;
  targetType?: ObjectType;
};

export type DataQualitySnapshot = {
  blocking: boolean;
  clientTenantId: string;
  highSeverityOpenCount: number;
  issues: {
    description: string;
    id: string;
    issueType: string;
    severity: string;
    status: string;
    targetId: string;
    targetType: ObjectType;
  }[];
  openIssueCount: number;
};

export type DataQualityGate = {
  gateName: "DATA_QUALITY_READY" | "DATA_QUALITY_RELEASE_READY";
  missing: string[];
  passed: boolean;
};

export type DataQualityAuditInput = {
  actorRoleKey: string;
  actorUserId: string;
  auditPersistenceAvailable?: boolean;
  correlationId?: string;
  eventType?: string;
  platformTenantId: string;
  reason: string;
};

export type CreateDataQualityIssueInput = {
  audit: DataQualityAuditInput;
  clientTenantId: string;
  description: string;
  issueType: string;
  ownerUserId?: string | null;
  severity: string;
  status?: WorkflowStatus;
  targetId: string;
  targetType: ObjectType;
};

export type ResolveDataQualityIssueInput = {
  audit: DataQualityAuditInput;
  issueId: string;
  nextStatus?: WorkflowStatus;
};

export type DataQualityMutationResult = {
  auditEventId: string;
  issueId: string;
};

const blockingSeverities = new Set(["high", "critical"]);

function isBlockingSeverity(severity: string) {
  return blockingSeverities.has(severity.toLowerCase());
}

function issueNextState(severity: string, status: WorkflowStatus) {
  if (status === WorkflowStatus.COMPLETED) return "DATA_QUALITY_RESOLVED";
  return isBlockingSeverity(severity) ? "DATA_QUALITY_BLOCKED" : "DATA_QUALITY_ISSUE_OPEN";
}

function criticalAuditMetadata(input: {
  action: PermissionAction;
  audit: DataQualityAuditInput;
  clientTenantId: string;
  eventType: string;
  nextState: string;
  previousState: string;
  targetId: string;
  targetType: ObjectType;
}) {
  auditService.assertCriticalAuditWritable({
    action: input.action,
    actorRoleKey: input.audit.actorRoleKey,
    actorUserId: input.audit.actorUserId,
    auditPersistenceAvailable: input.audit.auditPersistenceAvailable,
    clientTenantId: input.clientTenantId,
    correlationId: input.audit.correlationId,
    eventType: input.eventType,
    nextState: input.nextState,
    platformTenantId: input.audit.platformTenantId,
    previousState: input.previousState,
    reason: input.audit.reason,
    result: AuditResult.SUCCESS,
    targetId: input.targetId,
    targetType: input.targetType as DomainObjectType,
  });

  return auditService.criticalAuditMetadata({
    action: input.action,
    actorRoleKey: input.audit.actorRoleKey,
    actorUserId: input.audit.actorUserId,
    auditPersistenceAvailable: input.audit.auditPersistenceAvailable,
    clientTenantId: input.clientTenantId,
    correlationId: input.audit.correlationId,
    eventType: input.eventType,
    nextState: input.nextState,
    platformTenantId: input.audit.platformTenantId,
    previousState: input.previousState,
    reason: input.audit.reason,
    result: AuditResult.SUCCESS,
    targetId: input.targetId,
    targetType: input.targetType as DomainObjectType,
  });
}

export async function buildDataQualitySnapshot(
  prisma: Pick<PrismaClient, "dataQualityIssue">,
  input: DataQualitySnapshotInput,
): Promise<DataQualitySnapshot> {
  const repository = createDataQualityRepository(prisma);
  const [issues, openIssueCount] = await Promise.all([
    repository.listOpenIssues(input),
    repository.countOpenIssues(input),
  ]);
  const highSeverityOpenCount = issues.filter((issue) =>
    blockingSeverities.has(issue.severity.toLowerCase()),
  ).length;

  return {
    blocking: highSeverityOpenCount > 0,
    clientTenantId: input.clientTenantId,
    highSeverityOpenCount,
    issues: issues.map((issue) => ({
      description: issue.description,
      id: issue.id,
      issueType: issue.issueType,
      severity: issue.severity,
      status: issue.status,
      targetId: issue.targetId,
      targetType: issue.targetType,
    })),
    openIssueCount,
  };
}

export function evaluateDataQualityGate(snapshot: DataQualitySnapshot): DataQualityGate {
  const missing: string[] = [];
  if (snapshot.openIssueCount > 0) missing.push("open_data_quality_issues");
  if (snapshot.highSeverityOpenCount > 0) missing.push("high_severity_data_quality_issues");

  return {
    gateName: "DATA_QUALITY_READY",
    missing,
    passed: missing.length === 0,
  };
}

export function evaluateDataQualityReleaseGate(snapshot: DataQualitySnapshot): DataQualityGate {
  const missing = snapshot.highSeverityOpenCount > 0 ? ["high_severity_data_quality_issues"] : [];

  return {
    gateName: "DATA_QUALITY_RELEASE_READY",
    missing,
    passed: missing.length === 0,
  };
}

export async function createDataQualityIssue(
  prisma: PrismaClient,
  input: CreateDataQualityIssueInput,
): Promise<DataQualityMutationResult> {
  const status = input.status ?? WorkflowStatus.IN_REVIEW;
  const previousState = "DATA_QUALITY_READY";
  const nextState = issueNextState(input.severity, status);
  const eventType = input.audit.eventType ?? "data_quality.issue.created";

  return prisma.$transaction(async (tx) => {
    const issue = await tx.dataQualityIssue.create({
      data: {
        clientTenantId: input.clientTenantId,
        description: input.description,
        issueType: input.issueType,
        ownerUserId: input.ownerUserId ?? null,
        severity: input.severity,
        status,
        targetId: input.targetId,
        targetType: input.targetType,
      },
    });
    const auditMetadata = criticalAuditMetadata({
      action: "BLOCK",
      audit: input.audit,
      clientTenantId: input.clientTenantId,
      eventType,
      nextState,
      previousState,
      targetId: input.targetId,
      targetType: input.targetType,
    });
    const auditEvent = await tx.auditEvent.create({
      data: {
        actorRoleKey: input.audit.actorRoleKey,
        actorUserId: input.audit.actorUserId,
        clientTenantId: input.clientTenantId,
        eventType,
        metadataJson: {
          ...auditMetadata,
          dataQualityIssueId: issue.id,
          issueType: input.issueType,
          severity: input.severity,
        } satisfies Prisma.InputJsonObject,
        nextState,
        platformTenantId: input.audit.platformTenantId,
        previousState,
        reason: input.audit.reason,
        result: AuditResult.SUCCESS,
        targetId: input.targetId,
        targetType: input.targetType,
      },
    });

    return {
      auditEventId: auditEvent.id,
      issueId: issue.id,
    };
  });
}

export async function resolveDataQualityIssue(
  prisma: PrismaClient,
  input: ResolveDataQualityIssueInput,
): Promise<DataQualityMutationResult> {
  const repository = createDataQualityRepository(prisma);
  const issue = await repository.getIssue(input.issueId);
  const nextStatus = input.nextStatus ?? WorkflowStatus.COMPLETED;
  const previousState = issueNextState(issue.severity, issue.status);
  const nextState = issueNextState(issue.severity, nextStatus);
  const eventType = input.audit.eventType ?? "data_quality.issue.resolved";

  return prisma.$transaction(async (tx) => {
    const auditMetadata = criticalAuditMetadata({
      action: "REVIEW",
      audit: input.audit,
      clientTenantId: issue.clientTenantId,
      eventType,
      nextState,
      previousState,
      targetId: issue.targetId,
      targetType: issue.targetType,
    });
    const updatedIssue = await tx.dataQualityIssue.update({
      data: {
        status: nextStatus,
      },
      where: { id: issue.id },
    });
    const auditEvent = await tx.auditEvent.create({
      data: {
        actorRoleKey: input.audit.actorRoleKey,
        actorUserId: input.audit.actorUserId,
        clientTenantId: issue.clientTenantId,
        eventType,
        metadataJson: {
          ...auditMetadata,
          dataQualityIssueId: updatedIssue.id,
          issueType: updatedIssue.issueType,
          severity: updatedIssue.severity,
        } satisfies Prisma.InputJsonObject,
        nextState,
        platformTenantId: input.audit.platformTenantId,
        previousState,
        reason: input.audit.reason,
        result: AuditResult.SUCCESS,
        targetId: issue.targetId,
        targetType: issue.targetType,
      },
    });

    return {
      auditEventId: auditEvent.id,
      issueId: updatedIssue.id,
    };
  });
}

export const dataQualityService = {
  buildDataQualitySnapshot,
  createDataQualityIssue,
  evaluateDataQualityGate,
  evaluateDataQualityReleaseGate,
  resolveDataQualityIssue,
};
