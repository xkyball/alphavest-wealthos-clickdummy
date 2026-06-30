import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import {
  committeeReviewCanonicalApiRoute,
  listCommitteeReviewRowsPage,
  type CommitteeReviewSortKey,
  type CommitteeReviewStatusFilter,
} from "@/lib/committee-review-service";
import { prismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const sortKeys = [
  "advisorApproval",
  "client",
  "committeeStatus",
  "due",
  "evidence",
  "priority",
  "risk",
] as const satisfies readonly CommitteeReviewSortKey[];

const statusFilters = ["all", "blocked", "in_review", "pending"] as const satisfies readonly CommitteeReviewStatusFilter[];

function parseStatusFilter(value: string | null): CommitteeReviewStatusFilter {
  return statusFilters.find((candidate) => candidate === value) ?? "all";
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = await listCommitteeReviewRowsPage(
      prismaClient(),
      parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: sortKeys,
        defaultPageSize: 6,
        defaultSortDirection: "asc",
        defaultSortKey: "due",
        maxPageSize: 20,
      }),
      { status: parseStatusFilter(url.searchParams.get("status")) },
    );

    return NextResponse.json({
      ...page,
      canonicalApiRoute: committeeReviewCanonicalApiRoute,
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        returnedRows: page.meta.returnedRows,
        scoped: true,
        totalRows: page.meta.totalRows,
      },
    });
  } catch {
    return failClosedJson(
      {
        canonicalApiRoute: committeeReviewCanonicalApiRoute,
        error: "Committee review queue is unavailable.",
        reasonCode: "SAFE_ERROR",
        safety: {
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: false,
        },
      },
      { status: 503 },
    );
  }
}
