import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { demoTenants, type DemoTenantSlug } from "@/lib/demo-session";
import { projectOperationalClientSafeEvidenceSummary } from "@/lib/evidence-lifecycle-service";
import { prismaClient } from "@/lib/prisma";
import { stableId } from "@/lib/stable-id";

export const runtime = "nodejs";

function tenantSlug(value: string | null): DemoTenantSlug | undefined {
  return demoTenants.some((tenant) => tenant.slug === value) ? (value as DemoTenantSlug) : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedTenantSlug = tenantSlug(url.searchParams.get("tenantSlug")) ?? "bennett";
  const evidenceRecordId =
    url.searchParams.get("evidenceRecordId") ?? stableId(`evidence:${parsedTenantSlug}:decision-pack`);

  try {
    const summary = await projectOperationalClientSafeEvidenceSummary(prismaClient(), {
      evidenceRecordId,
      tenantSlug: parsedTenantSlug,
    });

    return NextResponse.json({
      ok: true,
      safety: {
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        scoped: true,
        tenantSlug: parsedTenantSlug,
      },
      summary,
    });
  } catch {
    return failClosedJson(
      {
        error: "Client-safe evidence summary is not available.",
        reasonCode: "SAFE_ERROR",
        safety: {
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          scoped: false,
        },
      },
      { status: 500 },
    );
  }
}
