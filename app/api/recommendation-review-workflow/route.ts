import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { allowedDataSurfaceFilter, parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { handleRecommendationReviewWorkflowRequest } from "@/lib/recommendation-review-workflow-api";
import {
  analystWorkbenchPriorityFilters,
  analystWorkbenchSortKeys,
  analystWorkbenchStatusFilters,
  advisorReviewPriorityFilters,
  advisorReviewSortKeys,
  advisorReviewStatusFilters,
  complianceReviewPublishFilters,
  complianceReviewRiskFilters,
  complianceReviewSortKeys,
  loadRecommendationReviewQueueReadModel,
} from "@/lib/recommendation-review-queue-readmodel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RecommendationReviewWorkflowPrismaGlobal = typeof globalThis & {
  alphaVestRecommendationReviewWorkflowPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as RecommendationReviewWorkflowPrismaGlobal;
  globalForPrisma.alphaVestRecommendationReviewWorkflowPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestRecommendationReviewWorkflowPrisma;
}

export async function POST(request: Request) {
  return handleRecommendationReviewWorkflowRequest(request, prismaClient());
}

export async function GET(request: Request) {
  const prisma = prismaClient();

  if (!prisma) {
    return Response.json(
      {
        error: "DATABASE_URL is required for recommendation review queue state.",
        ok: false,
        reasonCode: "DATABASE_URL_REQUIRED",
      },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const surface = url.searchParams.get("surface");
  const analystQuery = parseDataSurfaceQuery(url.searchParams, {
    allowedSortKeys: analystWorkbenchSortKeys,
    defaultPageSize: 6,
    defaultSortDirection: "asc",
    defaultSortKey: "client",
    maxPageSize: 25,
  });
  const advisorQuery = parseDataSurfaceQuery(url.searchParams, {
    allowedSortKeys: advisorReviewSortKeys,
    defaultPageSize: 6,
    defaultSortDirection: "asc",
    defaultSortKey: "client",
    maxPageSize: 25,
  });
  const complianceQuery = parseDataSurfaceQuery(url.searchParams, {
    allowedSortKeys: complianceReviewSortKeys,
    defaultPageSize: 6,
    defaultSortDirection: "asc",
    defaultSortKey: "displayId",
    maxPageSize: 25,
  });
  const snapshot = await loadRecommendationReviewQueueReadModel(prisma, {
    analystFilters: surface === "analyst"
      ? {
          priority: allowedDataSurfaceFilter(url.searchParams, "priority", analystWorkbenchPriorityFilters, "all"),
          status: allowedDataSurfaceFilter(url.searchParams, "status", analystWorkbenchStatusFilters, "all"),
        }
      : undefined,
    analystQuery: surface === "analyst" ? analystQuery : undefined,
    advisorFilters: surface === "advisor"
      ? {
          priority: allowedDataSurfaceFilter(url.searchParams, "priority", advisorReviewPriorityFilters, "all"),
          status: allowedDataSurfaceFilter(url.searchParams, "status", advisorReviewStatusFilters, "all"),
        }
      : undefined,
    advisorQuery: surface === "advisor" ? advisorQuery : undefined,
    complianceFilters: surface === "compliance"
      ? {
          publish: allowedDataSurfaceFilter(url.searchParams, "publish", complianceReviewPublishFilters, "all"),
          risk: allowedDataSurfaceFilter(url.searchParams, "risk", complianceReviewRiskFilters, "all"),
        }
      : undefined,
    complianceQuery: surface === "compliance" ? complianceQuery : undefined,
    focusId: url.searchParams.get("focusId") ?? undefined,
  });

  return Response.json({
    ok: true,
    snapshot,
  });
}
