"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { productGuidanceForPathname } from "@/lib/product-guidance";
import { uxHubGuidanceForPageId, type UxHubGuidance, type UxHubPriorityTone } from "@/lib/ux-hub";

function hubToneClass(tone: UxHubPriorityTone) {
  if (tone === "green") return "border-alphavest-green/30 bg-alphavest-green/10 text-alphavest-green";
  if (tone === "red") return "border-alphavest-red/30 bg-alphavest-red/10 text-alphavest-red";
  if (tone === "blue") return "border-alphavest-blue/30 bg-alphavest-blue/10 text-alphavest-blue";
  return "border-alphavest-gold/30 bg-alphavest-gold/10 text-alphavest-gold-soft";
}

export function UxHubPanel({ pageId }: { pageId?: string }) {
  const pathname = usePathname();
  const guidance = pageId
    ? ({ hub: uxHubGuidanceForPageId(pageId) } satisfies { hub: UxHubGuidance | null })
    : productGuidanceForPathname(pathname);

  if (!guidance.hub) return null;

  return (
    <section
      aria-label="Hub priority workspace"
      className="order-2 mb-4 grid gap-3 rounded-md border border-alphavest-border/75 bg-alphavest-panel/72 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] md:mb-5 md:p-5"
      data-testid="ux-hub-panel"
    >
      <div className="flex flex-wrap gap-2">
        {guidance.hub.statusStrip.map((item) => (
          <span
            className="rounded-full border border-alphavest-border/55 bg-alphavest-navy/35 px-2.5 py-1 text-[0.62rem] font-semibold uppercase text-alphavest-subtle"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {guidance.hub.priorityCards.map((item) => (
          <div className="rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/45 p-3" key={item.label}>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-semibold uppercase text-alphavest-subtle">{item.label}</p>
              <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[0.62rem] font-semibold", hubToneClass(item.tone))}>
                {item.status}
              </span>
            </div>
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-alphavest-muted">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-2 border-t border-alphavest-border/55 pt-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <p className="text-xs leading-5 text-alphavest-muted">{guidance.hub.safetyNote}</p>
        <Link
          className="inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft"
          data-testid="ux-hub-primary-next-work"
          href={guidance.hub.primaryQueueItem.href}
        >
          {guidance.hub.primaryQueueItem.label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className="hidden gap-2 md:grid md:grid-cols-3">
        {guidance.hub.nextWorkQueue.map((item) => (
          <Link
            className="rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/45 p-3 text-xs transition hover:border-alphavest-gold/55"
            href={item.href}
            key={`${item.href}:${item.label}`}
          >
            <span className="block font-semibold text-alphavest-ivory">{item.label}</span>
            <span className="mt-1 block line-clamp-2 leading-5 text-alphavest-muted">{item.detail}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
