"use client";

import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge, Card, CardContent, CardHeader, CardTitle, type BadgeTone } from "@/components/ui";
import { cn } from "@/lib/cn";
import { uxHubDefinitionForPageId, type UxHubTone } from "@/lib/ux-hub";

type UxHubPageProps = {
  pageId: string;
};

const toneClasses: Record<UxHubTone, string> = {
  blue: "border-blue-300/45 bg-blue-300/10 text-blue-100",
  gold: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold-soft",
  green: "border-emerald-300/45 bg-emerald-300/10 text-emerald-100",
  red: "border-red-300/45 bg-red-300/10 text-red-100",
};

const badgeToneByCardTone: Record<UxHubTone, BadgeTone> = {
  blue: "blue",
  gold: "gold",
  green: "green",
  red: "red",
};

export function UxHubPage({ pageId }: UxHubPageProps) {
  const hub = uxHubDefinitionForPageId(pageId);

  if (!hub) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[104rem] space-y-5" data-testid="ux-hub-page">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          <div className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">{hub.eyebrow}</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h2 className="font-display text-3xl text-alphavest-ivory">{hub.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-alphavest-muted">{hub.summary}</p>
              </div>
              <Link
                className="inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft"
                data-testid="ux-hub-primary-next-work"
                href={hub.primaryAction.href}
              >
                {hub.primaryAction.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {hub.statusStrip.map((item) => (
                <Badge key={item} tone="muted">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {hub.priorityCards.map((card) => (
              <Card className={cn("border", toneClasses[card.tone])} key={card.label}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-80">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold text-alphavest-ivory">{card.value}</p>
                <p className="mt-3 text-sm leading-6 text-alphavest-muted">{card.detail}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Source Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {hub.sourceSummaries.map((summary) => (
                <div
                  className="flex min-h-24 items-start gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-4"
                  data-testid="ux-hub-source-summary"
                  key={summary}
                >
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-alphavest-gold-soft" />
                  <p className="text-sm leading-6 text-alphavest-muted">{summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Next Work Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3" data-testid="ux-hub-queue">
              <Link
                className="block rounded-md border border-alphavest-gold/55 bg-alphavest-gold/10 p-4 transition hover:border-alphavest-gold"
                href={hub.primaryAction.href}
              >
                <span className="flex items-center justify-between gap-3 text-sm font-semibold text-alphavest-gold-soft">
                  {hub.primaryAction.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
                <span className="mt-2 block text-sm leading-6 text-alphavest-muted">{hub.primaryAction.detail}</span>
              </Link>
              {hub.queue.map((item) => (
                <Link
                  className="block rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-4 transition hover:border-alphavest-gold/60"
                  href={item.href}
                  key={`${item.href}-${item.label}`}
                >
                  <span className="flex items-center justify-between gap-3 text-sm font-semibold text-alphavest-ivory">
                    {item.label}
                    <Badge tone={badgeToneByCardTone.gold}>Safe next</Badge>
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-alphavest-muted">{item.detail}</span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-md border border-alphavest-gold/40 bg-alphavest-gold/10 p-4 text-sm leading-6 text-alphavest-gold-soft">
            <div className="flex gap-3">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <p>{hub.safetyNote}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
