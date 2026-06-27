"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { UxProofReviewerSecondarySurface } from "@/components/ux-proof-reviewer-secondary-surface";
import { matchRouteBySegments } from "@/lib/route-registry";
import { uxProofReviewerRecordForRoute } from "@/lib/ux-proof-reviewer-mode";

function routeForPathname(pathname: string) {
  const cleanPath = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const normalized = cleanPath.length > 1 ? cleanPath.replace(/\/+$/, "") : cleanPath;

  if (normalized === "/") return null;

  return matchRouteBySegments(normalized.split("/").filter(Boolean)) ?? null;
}

export function ProofReviewerModeSlot() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (searchParams.get("proofMode") !== "reviewer") {
    return null;
  }

  const route = routeForPathname(pathname);
  const record = route ? uxProofReviewerRecordForRoute(route) : null;

  if (!record || record.audience === "client_safe") {
    return (
      <div
        data-testid="proof-reviewer-mode-client-suppressed"
        data-ux-proof-mode="client_mode"
        data-ux-proof-reviewer-requested="suppressed"
      />
    );
  }

  return <UxProofReviewerSecondarySurface className="mt-4" enabled record={record} />;
}
