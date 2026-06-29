"use client";

import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { SecondaryContextTabs } from "@/components/secondary-context-tabs";
import { cn } from "@/lib/cn";
import { uxHubDefinitionForPageId, type UxHubTone } from "@/lib/ux-hub";
import { uxDensityForPageId } from "@/lib/ux-density";
import { uxPageTemplateForPageId } from "@/lib/ux-page-template-system";
import { uxRouteShellPageJobDataAttributesForTemplate } from "@/lib/ux-route-shell-page-job-contract";

type UxHubPageProps = {
  pageId: string;
};

const toneClasses: Record<UxHubTone, string> = {
  blue: "border-blue-300/45 bg-blue-300/10 text-blue-100",
  gold: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold-soft",
  green: "border-emerald-300/45 bg-emerald-300/10 text-emerald-100",
  red: "border-red-300/45 bg-red-300/10 text-red-100",
};

function HubPill({ children, tone = "muted" }: { children: React.ReactNode; tone?: UxHubTone | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold",
        tone === "muted" && "border-alphavest-border bg-alphavest-panel/50 text-alphavest-muted",
        tone !== "muted" && toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

export function UxHubPage({ pageId }: UxHubPageProps) {
  const hub = uxHubDefinitionForPageId(pageId);

  if (!hub) {
    return null;
  }

  const density = uxDensityForPageId(pageId);
  const template = uxPageTemplateForPageId(pageId);
  const routeShellPageJobAttributes = uxRouteShellPageJobDataAttributesForTemplate(template);

  if (density.tier === "D1") {
    const isMobileClientHub = pageId === "020";

    return (
      <section
        className="mx-auto w-full max-w-[88rem] space-y-4"
        {...routeShellPageJobAttributes}
        data-testid="ux-hub-page"
        data-ux-page-template-action-zone={template.actionZoneBehavior}
        data-ux-page-template-family={template.family}
        data-ux-page-template-long-page={template.longPageBehavior}
        data-ux-page-template-proof-audit={template.proofAuditPlacement}
        data-ux-page-template-required-zones={template.requiredZones.join(" ")}
        data-ux-d1-calm-executive="true"
      >
        <div className={cn("grid gap-4", !isMobileClientHub && "xl:grid-cols-[minmax(0,1fr)_22rem]")}>
          <div className="space-y-4">
            <div
              className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-5"
              data-ux-content-tier="must-see"
              data-ux-long-page-anchor="summary"
              data-ux-template-zone="summary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">{hub.eyebrow}</p>
              <div className={cn("mt-4 flex flex-col gap-4", !isMobileClientHub && "lg:flex-row lg:items-end lg:justify-between")}>
                <div className="min-w-0">
                  <h2 className="font-display text-3xl text-alphavest-ivory">{hub.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-alphavest-muted" data-testid="ux-hub-summary">{hub.summary}</p>
                </div>
                <Link
                  className={cn(
                    "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft",
                    isMobileClientHub && "w-full"
                  )}
                  data-testid="ux-hub-primary-next-work"
                  href={hub.primaryAction.href}
                >
                  {hub.primaryAction.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {hub.statusStrip.map((item) => (
                  <HubPill key={item}>
                    {item}
                  </HubPill>
                ))}
              </div>
            </div>

            <Card className="p-4" data-ux-content-tier="secondary" data-ux-long-page-anchor="primary" data-ux-template-zone="primary_content">
              <CardHeader className="p-0">
                <CardTitle className="text-xl">Next work</CardTitle>
              </CardHeader>
              <CardContent className={cn("grid gap-3 p-0 pt-4", !isMobileClientHub && "md:grid-cols-3")}>
                {hub.queue.map((item) => (
                  <Link
                    className="rounded-md border border-alphavest-border/55 bg-alphavest-navy/30 p-3 text-sm leading-6 text-alphavest-muted transition hover:border-alphavest-gold/55"
                    data-testid="ux-hub-next-work-link"
                    href={item.href}
                    key={`${item.href}-${item.label}-d1-main`}
                  >
                    <span className="block font-semibold text-alphavest-ivory">{item.label}</span>
                    <span className="mt-1 block">{item.detail}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="p-4" data-ux-content-tier="secondary" data-testid="ux-d1-source-summary">
              <div className={cn("flex flex-col gap-3", !isMobileClientHub && "sm:flex-row sm:items-center sm:justify-between")}>
                <div>
                  <p className="font-display text-xl text-alphavest-ivory">Sources</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hub.sourceSummaries.map((summary) => (
                    <HubPill key={summary}>
                      {summary}
                    </HubPill>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card
              className="border-alphavest-gold/45 bg-alphavest-gold/10 p-4"
              data-testid="ux-d1-next-step-panel"
              data-ux-long-page-region="sticky_action"
              data-ux-sticky-action-zone="true"
              data-ux-template-zone="action_zone"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">One safe next step</p>
              <Link
                className="mt-4 block rounded-md border border-alphavest-gold/55 bg-alphavest-gold/10 p-4 transition hover:border-alphavest-gold"
                data-testid="ux-hub-next-link"
                href={hub.primaryAction.href}
              >
                <span className="flex items-center justify-between gap-3 text-sm font-semibold text-alphavest-gold-soft">
                  {hub.primaryAction.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
                <span className="sr-only">{hub.primaryAction.detail}</span>
              </Link>
              <div className="mt-4 rounded-md border border-alphavest-gold/35 bg-alphavest-navy/35 p-3 text-sm leading-6 text-alphavest-gold-soft" data-testid="ux-hub-safety-note">
                <div className="flex gap-3">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <p>{hub.safetyNote}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                  {hub.queue.slice(0, 2).map((item) => (
                  <Link className="block rounded-md border border-alphavest-border/55 bg-alphavest-navy/30 p-3 text-sm leading-6 text-alphavest-muted transition hover:border-alphavest-gold/55" data-testid="ux-hub-next-link" href={item.href} key={`${item.href}-${item.label}-d1-support`}>
                    <span className="font-semibold text-alphavest-ivory">{item.label}:</span> {item.detail}
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </section>
    );
  }

  const renderD2WorkbenchTriad = density.tier === "D2" && pageId === "034";

  return (
    <section
      className="mx-auto w-full max-w-[104rem] space-y-5"
      {...routeShellPageJobAttributes}
      data-testid="ux-hub-page"
      data-ux-page-template-action-zone={template.actionZoneBehavior}
      data-ux-page-template-family={template.family}
      data-ux-page-template-long-page={template.longPageBehavior}
      data-ux-page-template-proof-audit={template.proofAuditPlacement}
      data-ux-page-template-required-zones={template.requiredZones.join(" ")}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          <div
            className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-5"
            data-ux-content-tier="must-see"
            data-ux-long-page-anchor="summary"
            data-ux-template-zone="summary"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">{hub.eyebrow}</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h2 className="font-display text-3xl text-alphavest-ivory">{hub.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-alphavest-muted" data-testid="ux-hub-summary">{hub.summary}</p>
              </div>
              <Link
                className="inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft"
                data-testid="ux-hub-primary-next-work"
                data-ux-hub-next-step="primary"
                href={hub.primaryAction.href}
              >
                {hub.primaryAction.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {hub.statusStrip.map((item) => (
                <HubPill key={item}>
                  {item}
                </HubPill>
              ))}
            </div>
          </div>

          {renderD2WorkbenchTriad ? (
            <div
              className="grid gap-2 md:grid-cols-3"
              data-testid="ux-page-workbench-triad"
              data-ux-content-tier="secondary"
              data-ux-d2-productive-workbench="true"
            >
              <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/40 p-3" data-testid="ux-page-queue">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Priority work</p>
                <p className="mt-2 text-sm leading-6 text-alphavest-muted">{hub.queue[0]?.detail ?? hub.summary}</p>
              </div>
              <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/40 p-3" data-testid="ux-page-selected-context">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Context</p>
                <p className="mt-2 text-sm leading-6 text-alphavest-muted">{hub.sourceSummaries[0] ?? "Selected work remains route-limited."}</p>
              </div>
              <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3" data-testid="ux-page-action-rail">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-gold-soft">Next work</p>
                <p className="mt-2 text-sm leading-6 text-alphavest-muted">{hub.primaryAction.detail}</p>
                <p className="mt-2 text-xs leading-5 text-alphavest-gold-soft">Blocked until advice, evidence and release required checks pass.</p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3" data-ux-content-tier="secondary" data-ux-long-page-anchor="primary" data-ux-template-zone="primary_content">
            {hub.priorityCards.map((card) => (
              <Card className={cn("border", toneClasses[card.tone])} data-testid="ux-hub-priority-card" data-ux-hub-priority-card="true" key={card.label}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-80">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold text-alphavest-ivory">{card.value}</p>
                <p className="mt-3 text-sm leading-6 text-alphavest-muted">{card.detail}</p>
              </Card>
            ))}
          </div>

          <Card data-ux-content-tier="secondary">
            <CardHeader>
              <CardTitle>Sources</CardTitle>
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

          {pageId === "031" ? (
            <div data-ux-content-tier="tertiary">
            <SecondaryContextTabs
              note="Wealth-map tabs are context only; full review flows, control changes and release decisions stay on the linked workbench/detail routes."
              tabs={[
                {
                  content: (
                    <div className="grid gap-3 md:grid-cols-3">
                      {hub.sourceSummaries.map((summary) => (
                        <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-4 text-sm leading-6 text-alphavest-muted" key={summary}>
                          {summary}
                        </div>
                      ))}
                    </div>
                  ),
                  id: "map-signals",
                  label: "Map signals",
                },
                {
                  content: (
                    <div className="space-y-3">
                      {hub.priorityCards.map((card) => (
                        <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/55 p-4" key={card.label}>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-alphavest-ivory">{card.label}</p>
                            <HubPill tone={card.tone}>{card.value}</HubPill>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-alphavest-muted">{card.detail}</p>
                        </div>
                      ))}
                    </div>
                  ),
                  id: "drawer-context",
                  label: "Drawer context",
                },
                {
                  content: (
                    <div className="space-y-3">
                      {hub.queue.map((item) => (
                        <Link className="block rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/55 p-4 text-sm transition hover:border-alphavest-gold/60" href={item.href} key={`${item.href}-tab`}>
                          <span className="font-semibold text-alphavest-ivory">{item.label}</span>
                          <span className="mt-2 block leading-6 text-alphavest-muted">{item.detail}</span>
                        </Link>
                      ))}
                    </div>
                  ),
                  id: "handoffs",
                  label: "Handoffs",
                  tone: "warning",
                },
              ]}
              title="Secondary wealth-map context"
            />
            </div>
          ) : null}
        </div>

        <aside className="space-y-5">
          <Card data-ux-content-tier="secondary">
            <CardHeader>
              <CardTitle>Next Work Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3" data-testid="ux-hub-queue">
              <Link
                className="block rounded-md border border-alphavest-gold/55 bg-alphavest-gold/10 p-4 transition hover:border-alphavest-gold"
                data-testid="ux-hub-next-link"
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
                  data-testid="ux-hub-next-link"
                  href={item.href}
                  key={`${item.href}-${item.label}`}
                >
                  <span className="flex items-center justify-between gap-3 text-sm font-semibold text-alphavest-ivory">
                    {item.label}
                    <HubPill tone="gold">Safe next</HubPill>
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-alphavest-muted">{item.detail}</span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-md border border-alphavest-gold/40 bg-alphavest-gold/10 p-4 text-sm leading-6 text-alphavest-gold-soft" data-testid="ux-hub-safety-note" data-ux-content-tier="must-see">
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
