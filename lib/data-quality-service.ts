import type { ObjectType, PrismaClient } from "@prisma/client";

import { createDataQualityRepository } from "@/lib/data-quality-repository";

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

const blockingSeverities = new Set(["high", "critical"]);

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

export const dataQualityService = {
  buildDataQualitySnapshot,
  evaluateDataQualityGate,
  evaluateDataQualityReleaseGate,
};
