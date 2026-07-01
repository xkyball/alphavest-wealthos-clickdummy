import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { evaluateMonitoringGuard } from "@/lib/control-layer/monitoring-guard";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import {
  getReviewMonitoringSnapshot,
  listReviewMonitoringRebalanceRowsPage,
  listReviewMonitoringReviewRowsPage,
  reviewMonitoringDefaultAsOf,
  type ReviewMonitoringRebalanceSortKey,
  type ReviewMonitoringReviewSortKey,
} from "@/lib/review-monitoring-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReviewMonitoringPrismaGlobal = typeof globalThis & {
  alphaVestReviewMonitoringPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as ReviewMonitoringPrismaGlobal;
  globalForPrisma.alphaVestReviewMonitoringPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestReviewMonitoringPrisma;
}

function parseAsOf(request: Request) {
  const value = new URL(request.url).searchParams.get("asOf");
  if (!value) return { ok: true as const, value: reviewMonitoringDefaultAsOf };

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? { issue: "valid_as_of_required", ok: false as const }
    : { ok: true as const, value: parsed };
}

const reviewSortKeys = ["cadence", "client", "dueState", "nextReviewDate", "owner", "queueState", "status"] as const satisfies readonly ReviewMonitoringReviewSortKey[];
const rebalanceSortKeys = ["actionStatus", "client", "confidence", "dueState", "priority", "slaDueAt", "state", "title", "triggerType"] as const satisfies readonly ReviewMonitoringRebalanceSortKey[];

export async function GET(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for review monitoring snapshots.",
        issues: ["database_url_required"],
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
        safety: {
          failClosed: true,
          releaseUnlocked: false,
          silentStateAdvance: false,
          snapshotGenerated: false,
        },
      },
      { status: 503 },
    );
  }

  const parsedAsOf = parseAsOf(request);
  if (!parsedAsOf.ok) {
    return failClosedJson(
      {
        error: "Review monitoring is not available for this query.",
        issues: [parsedAsOf.issue],
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  const surface = url.searchParams.get("surface");

  if (surface === "reviews") {
    const page = await listReviewMonitoringReviewRowsPage(
      prisma,
      parsedAsOf.value,
      parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: reviewSortKeys,
        defaultPageSize: 8,
        defaultSortKey: "nextReviewDate",
        maxPageSize: 25,
      }),
      { dueState: url.searchParams.get("dueState") ?? undefined },
    );

    return NextResponse.json({
      meta: page.meta,
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      reviewRows: page.reviewRows,
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        returnedRows: page.meta.returnedRows,
        scoped: true,
        totalRows: page.meta.totalRows,
      },
    });
  }

  if (surface === "rebalance") {
    const page = await listReviewMonitoringRebalanceRowsPage(
      prisma,
      parsedAsOf.value,
      parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: rebalanceSortKeys,
        defaultPageSize: 5,
        defaultSortDirection: "desc",
        defaultSortKey: "priority",
        maxPageSize: 20,
      }),
      { state: url.searchParams.get("triggerState") ?? url.searchParams.get("state") ?? undefined },
    );

    return NextResponse.json({
      meta: page.meta,
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      rebalanceRows: page.rebalanceRows,
      safety: {
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        returnedRows: page.meta.returnedRows,
        scoped: true,
        totalRows: page.meta.totalRows,
      },
    });
  }

  const snapshot = await getReviewMonitoringSnapshot(prisma, parsedAsOf.value);
  const monitoringGuard = evaluateMonitoringGuard({
    reviewDue: snapshot.reviews.dueSoon > 0 || snapshot.reviews.overdue > 0,
    triggerCreated: snapshot.rebalance.total > 0,
  });

  return NextResponse.json({
    ...snapshot,
    clientVisible: false,
    monitoringGuard,
    mutated: false,
    noAdviceExecution: true,
    noClientRelease: true,
    ok: true,
  });
}
