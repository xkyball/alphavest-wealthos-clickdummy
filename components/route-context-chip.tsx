"use client";

import { Compass } from "lucide-react";
import { usePathname } from "next/navigation";
import { productGuidanceForPathname } from "@/lib/product-guidance";

export function RouteContextChip({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const routeContext = productGuidanceForPathname(pathname);

  return (
    <span
      className={`inline-flex h-10 max-w-64 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/62 px-3 text-xs font-semibold text-alphavest-muted ${className}`}
      data-testid="ux-nav-route-context"
      data-ux-proof-client-mode-allowed="false"
      data-ux-proof-content-class="route_context"
      data-ux-proof-default-visible="true"
      data-ux-proof-mode="operational_default"
      title={`${routeContext.area}: ${routeContext.shortTitle}`}
    >
      <Compass aria-hidden="true" className="size-3.5 shrink-0 text-alphavest-gold" />
      <span className="truncate">{routeContext.shortTitle}</span>
    </span>
  );
}
