import { WorkflowStatus, type ObjectType, type Prisma, type PrismaClient } from "@prisma/client";

type DataQualityReader = Pick<PrismaClient, "dataQualityIssue">;

export type DataQualityIssueFilter = {
  clientTenantId: string;
  targetId?: string;
  targetType?: ObjectType;
};

const openWorkflowStatuses = [
  WorkflowStatus.NEW,
  WorkflowStatus.IN_REVIEW,
  WorkflowStatus.AWAITING_INFO,
  WorkflowStatus.ANALYST_REVIEW,
  WorkflowStatus.ADVISOR_REVIEW,
  WorkflowStatus.COMPLIANCE_PENDING,
  WorkflowStatus.BLOCKED,
];

function openIssueWhere(input: DataQualityIssueFilter): Prisma.DataQualityIssueWhereInput {
  return {
    clientTenantId: input.clientTenantId,
    status: { in: openWorkflowStatuses },
    targetId: input.targetId,
    targetType: input.targetType,
  };
}

export function createDataQualityRepository(prisma: DataQualityReader) {
  return {
    countOpenIssues(input: DataQualityIssueFilter) {
      return prisma.dataQualityIssue.count({
        where: openIssueWhere(input),
      });
    },

    listOpenIssues(input: DataQualityIssueFilter) {
      return prisma.dataQualityIssue.findMany({
        orderBy: [{ severity: "asc" }, { createdAt: "asc" }],
        where: openIssueWhere(input),
      });
    },
  };
}
