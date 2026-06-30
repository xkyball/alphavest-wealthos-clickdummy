import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { handleRecommendationReviewWorkflowRequest } from "@/lib/recommendation-review-workflow-api";
import { loadRecommendationReviewQueueReadModel } from "@/lib/recommendation-review-queue-readmodel";

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

export async function GET() {
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

  const snapshot = await loadRecommendationReviewQueueReadModel(prisma);

  return Response.json({
    ok: true,
    snapshot,
  });
}
