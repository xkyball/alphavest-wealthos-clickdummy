import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { handleRecommendationReviewWorkflowRequest } from "@/lib/recommendation-review-workflow-api";

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
