"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Home,
  Landmark,
  LockKeyhole,
  Network,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  X
} from "lucide-react";
import { GlobalSearchBox } from "@/components/global-search-box";
import { ProcessSidebar } from "@/components/process-navigation";
import { Badge, Card, CardContent, CardHeader, CardTitle, MasterDetailSurface, StatePanel, type BadgeTone } from "@/components/ui";
import { ActorSessionProvider, useActorSession } from "@/components/actor-session-provider";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";
import { SecondaryContextTabs } from "@/components/secondary-context-tabs";
import { WorksurfacePanel, WorksurfaceShell } from "@/components/worksurface-shell";
import { cn } from "@/lib/cn";
import { processFirstUxContractForPageId } from "@/lib/process-first-ux-contract";
import type { ScreenRoute } from "@/lib/route-registry";
import { runDataMaintenanceCommand } from "@/lib/data-maintenance-command-client";
import type { VisualState } from "@/lib/visual-contract";
import {
  actionColumns,
  selectedAction,
  selectedActionEvidence,
  selectedActionTimeline,
  selectedWealthNode,
  wealthActionsPageIds,
  wealthMapAlerts,
  wealthMapConnections,
  wealthMapDecisions,
  wealthMapFilters,
  wealthMapLegend,
  wealthMapNodes,
  wealthWorkspace,
  type ActionCard
} from "@/lib/wealth-actions-seed-data";

type WealthActionsScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";
const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-gold bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft";

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("complete") || normalized.includes("done") || normalized.includes("active") || normalized.includes("ready")) {
    return "green";
  }

  if (normalized.includes("missing") || normalized.includes("blocked") || normalized.includes("overdue") || normalized.includes("high") || normalized.includes("conflict")) {
    return "red";
  }

  if (normalized.includes("medium") || normalized.includes("pending") || normalized.includes("review") || normalized.includes("required")) {
    return "gold";
  }

  if (normalized.includes("low") || normalized.includes("client")) {
    return "blue";
  }

  return "muted";
}

function InlineStatus({ tone, value }: { tone: BadgeTone; value: string }) {
  const Icon = tone === "red" ? AlertTriangle : tone === "green" ? CheckCircle2 : ShieldCheck;
  const toneClass: Record<BadgeTone, string> = {
    blue: "text-alphavest-blue",
    gold: "text-alphavest-gold",
    green: "text-alphavest-green",
    muted: "text-alphavest-muted",
    purple: "text-violet-200",
    red: "text-alphavest-red",
    teal: "text-teal-200",
  };

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5 font-semibold", toneClass[tone])}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span className="truncate">{value}</span>
    </span>
  );
}

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="sr-only">{children}</h1>;
}

function IconTile({ children, tone = "gold" }: { children: React.ReactNode; tone?: BadgeTone }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue",
    gold: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold",
    green: "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green",
    muted: "border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted",
    purple: "border-violet-400/35 bg-violet-400/10 text-violet-200",
    red: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red",
    teal: "border-teal-300/35 bg-teal-300/10 text-teal-200"
  };

  return <span className={cn("grid size-10 shrink-0 place-items-center rounded-md border", toneClass[tone])}>{children}</span>;
}

function WorksurfaceInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3">
      <p className="text-xs text-alphavest-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
    </div>
  );
}

function WealthContextRail() {
  return (
    <>
      <WorksurfacePanel
        description="Wealth map and action board are context surfaces, not final decision or release checks."
        title="Wealth context"
      >
        <div className="space-y-3">
          <WorksurfaceInfoRow label="Household" value={wealthWorkspace.household} />
          <WorksurfaceInfoRow label="Last updated" value={wealthWorkspace.lastUpdated} />
          <WorksurfaceInfoRow label="Selected object" value={selectedWealthNode.name} />
          <WorksurfaceInfoRow label="Blocked action" value={selectedAction.title} />
        </div>
      </WorksurfacePanel>
      <StatePanel
        detail="Map and action context can route work, but readiness still depends on evidence, audit and review flow checks."
        state="restricted"
        title="Context is not readiness"
      />
    </>
  );
}

function WealthSidebar() {
  return (
    <ProcessSidebar
      footer={
        <div className="space-y-3">
          <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/60 p-4">
            <p className="text-sm font-semibold text-alphavest-ivory">{wealthWorkspace.household}</p>
            <p className="mt-1 text-xs text-alphavest-muted">Tenant context</p>
          </div>
          <p className="flex h-10 w-full items-center gap-2 rounded-md border border-alphavest-border px-3 text-sm text-alphavest-muted opacity-65" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            Configure
          </p>
        </div>
      }
    />
  );
}

function WealthTopBar() {
  const { session } = useActorSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <GlobalSearchBox className="xl:w-[34rem]" />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <span className="relative grid size-10 place-items-center rounded-full border border-alphavest-border text-alphavest-muted opacity-65" data-ux-affordance="static-notification-indicator" data-ux-interactive="false" role="status">
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute -right-1 -top-1 rounded-full bg-alphavest-gold px-1.5 text-[0.65rem] font-bold text-alphavest-navy">7</span>
          </span>
          <div className="flex h-10 items-center gap-2 rounded-full border border-alphavest-border bg-alphavest-charcoal/70 pl-1 pr-3">
            <span className="grid size-8 place-items-center rounded-full border border-alphavest-gold/45 text-xs font-semibold text-alphavest-gold">{session.actor.initials}</span>
            <span className="hidden text-sm font-semibold text-alphavest-ivory md:block">{session.actor.displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function WealthShell({ children }: { activePageId: string; children: React.ReactNode }) {
  return (
    <ActorSessionProvider>
      <div className="av-surface av-surface-wealth av-shell-grid">
        <WealthSidebar />
        <div className="min-w-0">
          <WealthTopBar />
          <main className="px-4 py-6 md:px-6">
            <OperationalDefaultSurface>{children}</OperationalDefaultSurface>
          </main>
        </div>
      </div>
    </ActorSessionProvider>
  );
}

function PageHeading({ action, subtitle, title }: { action?: React.ReactNode; subtitle: string; title: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-3xl text-alphavest-ivory md:text-4xl">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-alphavest-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function WealthMapOperationalSurface() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <Card density="compact">
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
          <CardTitle>Wealth map</CardTitle>
          <InlineStatus tone="gold" value="Context only" />
        </CardHeader>
        <CardContent>
          <div className="relative h-[25rem] overflow-hidden rounded-md border border-alphavest-border bg-[radial-gradient(circle_at_50%_30%,rgba(37,99,235,0.16),transparent_34%),linear-gradient(180deg,rgba(16,43,63,0.92),rgba(7,20,32,0.95))]">
            <svg className="absolute inset-0 size-full" aria-hidden="true">
              {wealthMapConnections.map((connection, index) => (
                <line
                  key={`${connection.kind}-${index}`}
                  stroke={connection.kind === "conflict" ? "#ef5b5b" : connection.kind === "restricted" ? "#c4b5fd" : "#45647c"}
                  strokeDasharray={connection.kind === "normal" ? undefined : "5 5"}
                  strokeWidth={connection.kind === "normal" ? 1.2 : 1.6}
                  x1={`${connection.from[0]}%`}
                  x2={`${connection.to[0]}%`}
                  y1={`${connection.from[1]}%`}
                  y2={`${connection.to[1]}%`}
                />
              ))}
            </svg>
            {wealthMapNodes.map((node) => (
              <WealthNode key={node.id} node={node} />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Card density="compact">
          <CardHeader className="pb-2"><CardTitle>Selected object</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3">
              <p className="text-sm font-semibold text-alphavest-ivory">{selectedWealthNode.name}</p>
              <p className="mt-1 text-xs text-alphavest-muted">{selectedWealthNode.type} · {selectedWealthNode.value}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <WorksurfaceInfoRow label="Household" value={wealthWorkspace.household} />
              <WorksurfaceInfoRow label="Last updated" value={wealthWorkspace.lastUpdated} />
            </div>
            <Link className={primaryButtonClass + " w-full"} href="/client/profile">Review client profile</Link>
          </CardContent>
        </Card>
        <Card density="compact">
          <CardHeader className="pb-2"><CardTitle>Attention needed</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {wealthMapAlerts.map((alert) => (
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2" key={alert.title}>
                <div className="flex items-start gap-2">
                  <AlertTriangle aria-hidden="true" className={cn("mt-0.5 size-4 shrink-0", alert.tone === "red" ? "text-alphavest-red" : alert.tone === "gold" ? "text-alphavest-gold" : "text-alphavest-blue")} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-alphavest-ivory">{alert.title}</p>
                    <p className="text-xs leading-5 text-alphavest-muted">{alert.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WealthMapPage({ title }: { title: string; visualState?: VisualState }) {
  return (
    <WealthShell activePageId="031">
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        density="compact"
        description="Relationship and entity map context for wealth-structure work, with restricted objects and follow-up actions kept gated."
        eyebrow="Client context"
        primary={
          <div className="space-y-3">
            <PageHeading
              subtitle="Relationship and entity context for wealth-structure work."
              title={title}
            />
            <WealthMapOperationalSurface />
          </div>
        }
        routeId="031"
        safetyNote="The wealth map can reveal structure and route work, but cannot mark action readiness or expose restricted object details."
        statusItems={[
          { label: "Context", tone: "blue", value: "Wealth map" },
          { label: "Surface", tone: "gold", value: "wealth context" },
        ]}
        title={title}
        worksurfaceId="client-context-wealth-map"
      />
    </WealthShell>
  );
}

function dotClass(tone: string) {
  const classes: Record<string, string> = {
    blue: "bg-alphavest-blue",
    gold: "bg-alphavest-gold",
    green: "bg-alphavest-green",
    muted: "bg-alphavest-muted",
    purple: "bg-violet-300",
    red: "bg-alphavest-red",
    restricted: "bg-violet-300",
    teal: "bg-teal-300"
  };

  return classes[tone] ?? classes.muted;
}

function WealthNode({ node }: { node: (typeof wealthMapNodes)[number] }) {
  const restricted = node.tone === "restricted";
  const compact = node.detail === "Tax Residency" || node.detail === "Portfolio" || node.detail === "Insurance" || node.detail === "Real Estate" || node.detail === "Liquidity" || node.detail === "Operating Co.";
  const nodeClass: Record<string, string> = {
    blue: "border-alphavest-blue/55 bg-alphavest-blue/12",
    gold: "border-alphavest-gold/70 bg-alphavest-gold/12",
    green: "border-alphavest-green/55 bg-alphavest-green/10",
    muted: "border-alphavest-border bg-alphavest-charcoal/82",
    purple: "border-violet-300/60 bg-violet-400/12",
    red: "border-alphavest-red/55 bg-alphavest-red/10",
    restricted: "border-dashed border-violet-300/60 bg-violet-400/10",
    teal: "border-teal-300/55 bg-teal-300/10"
  };

  return (
    <article
      className={cn(
        "absolute z-10 -translate-x-1/2 rounded-md border text-center shadow-xl",
        compact ? "w-24 p-2" : "w-[7.5rem] p-2.5",
        nodeClass[node.tone]
      )}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <div className="relative mx-auto w-fit">
        <div className={cn("mx-auto grid place-items-center rounded-full border", compact ? "size-8" : "size-10", nodeClass[node.tone])}>
          {restricted ? <LockKeyhole aria-hidden="true" className="size-4 text-violet-200" /> : <NodeIcon tone={node.tone} />}
        </div>
        {node.flags.length ? (
          <div className="absolute -right-2 -top-1 flex gap-0.5">
            {node.flags.map((flag) => (
              <span className={cn("size-2 rounded-full ring-1 ring-alphavest-navy", flag === "Conflict" ? "bg-alphavest-red" : flag === "Gap" ? "bg-alphavest-gold" : flag === "Restricted" ? "bg-violet-300" : "bg-alphavest-green")} key={flag} />
            ))}
          </div>
        ) : null}
      </div>
      <p className="mt-1.5 text-xs font-semibold leading-tight text-alphavest-ivory">{node.label}</p>
      <p className="mt-0.5 text-[0.68rem] leading-tight text-alphavest-muted">{node.detail}</p>
      {node.value ? <p className="mt-0.5 text-[0.65rem] leading-tight text-alphavest-subtle">{node.value}</p> : null}
    </article>
  );
}

function NodeIcon({ tone }: { tone: string }) {
  if (tone === "purple") {
    return <UserRound aria-hidden="true" className="size-5 text-violet-200" />;
  }

  if (tone === "gold") {
    return <Landmark aria-hidden="true" className="size-5 text-alphavest-gold" />;
  }

  if (tone === "blue") {
    return <Building2 aria-hidden="true" className="size-5 text-alphavest-blue" />;
  }

  if (tone === "red") {
    return <Home aria-hidden="true" className="size-5 text-alphavest-red" />;
  }

  if (tone === "teal") {
    return <ShieldCheck aria-hidden="true" className="size-5 text-teal-200" />;
  }

  if (tone === "muted") {
    return <Network aria-hidden="true" className="size-5 text-alphavest-muted" />;
  }

  return <ClipboardCheck aria-hidden="true" className="size-5 text-alphavest-green" />;
}

function WealthMapDrawer({ onClose }: { onClose: () => void }) {
  return (
    <aside aria-label={selectedWealthNode.name} className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-panel/88 p-4 shadow-2xl xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <IconTile tone="gold"><Landmark aria-hidden="true" className="size-5" /></IconTile>
          <div className="min-w-0">
            <h2 className="font-display text-2xl text-alphavest-ivory">{selectedWealthNode.name}</h2>
            <p className="text-sm text-alphavest-muted">{selectedWealthNode.type}</p>
          </div>
        </div>
        <button className="grid size-9 place-items-center rounded-full border border-alphavest-border text-alphavest-muted" onClick={onClose} type="button">
          <X aria-hidden="true" className="size-4" />
          <span className="sr-only">Close detail drawer</span>
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Badge tone="green">{selectedWealthNode.status}</Badge>
        <Badge tone="gold">Relationships {selectedWealthNode.relationships}</Badge>
        <Badge tone="blue">Documents {selectedWealthNode.documents}</Badge>
      </div>
      <div className="mt-5">
        <SecondaryContextTabs
          note="This drawer is secondary context only; full review flows and final checks stay on the target workbench/detail route."
          tabs={[
            {
              content: (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  {[
                    ["Estimated value", selectedWealthNode.value],
                    ["Last updated", wealthWorkspace.lastUpdated],
                    ["Purpose", selectedWealthNode.purpose],
                    ["Settlor", selectedWealthNode.settlor],
                    ["Trustee", selectedWealthNode.trustee],
                    ["Jurisdiction", selectedWealthNode.jurisdiction]
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-alphavest-muted">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
                    </div>
                  ))}
                </div>
              ),
              id: "facts",
              label: "Facts",
            },
            {
              content: (
                <div className="space-y-3">
                  {wealthMapAlerts.map((alert) => (
                    <div className={cn("rounded-md border p-3", alert.tone === "red" && "border-alphavest-red/35 bg-alphavest-red/10", alert.tone === "gold" && "border-alphavest-gold/35 bg-alphavest-gold/10", alert.tone === "blue" && "border-alphavest-blue/35 bg-alphavest-blue/10")} key={alert.title}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle aria-hidden="true" className={cn("mt-0.5 size-4 shrink-0", alert.tone === "red" ? "text-alphavest-red" : alert.tone === "gold" ? "text-alphavest-gold" : "text-alphavest-blue")} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-alphavest-ivory">{alert.title}</p>
                          <p className="mt-1 text-xs text-alphavest-muted">{alert.detail}</p>
                        </div>
                        <button
                          className="text-xs font-semibold text-alphavest-gold"
                          data-testid={alert.action === "View details" ? "j05-view-details" : undefined}
                          onClick={() => {
                            if (alert.action === "View details") {
                              void runDataMaintenanceCommand("j05.viewDetails", "/actions?state=drawer");
                            }
                          }}
                          type="button"
                        >
                          {alert.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ),
              id: "alerts",
              label: "Alerts",
              tone: "warning",
            },
            {
              content: (
                <div className="space-y-3">
                  {wealthMapDecisions.map((decision) => (
                    <div className="flex items-start justify-between gap-3 border-b border-alphavest-border/45 pb-3 last:border-0" key={decision.title}>
                      <div>
                        <p className="text-sm font-semibold text-alphavest-ivory">{decision.title}</p>
                        <p className="mt-1 text-xs text-alphavest-muted">{decision.status} · {decision.due}</p>
                      </div>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-alphavest-border text-xs text-alphavest-muted">{decision.owner}</span>
                    </div>
                  ))}
                </div>
              ),
              id: "related-decisions",
              label: "Related decisions",
            },
          ]}
          title="Secondary wealth-map context"
        />
      </div>
      <StatePanel className="mt-4" detail="You can see the structure and connections, but sensitive data is hidden due to object-level permissions." state="restricted" title="Restricted entities in this map are masked" />
    </aside>
  );
}

function ActionsPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer");
  const processContract = processFirstUxContractForPageId("032");
  const compactActionRows = actionColumns.flatMap((column) => (
    column.cards.map((card) => ({ ...card, columnTitle: column.title }))
  )).slice(0, 3);

  return (
    <WealthShell activePageId="032">
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        description="Action board for relationship and evidence-linked work, normalized into the shared review surface."
        eyebrow="Client context"
        primary={<MasterDetailSurface
          actionPolicy="open_detail"
          density="standard_review"
          detail={drawerOpen ? <ActionDrawer onClose={() => setDrawerOpen(false)} /> : undefined}
          family="board"
          filterState="disabled_static"
          masterDetailMode={drawerOpen ? "drawer_detail" : "inline_detail_rail"}
          selectedObjectId={selectedAction.id}
          selectedObjectState={selectedAction.evidenceState}
          stickyRail={drawerOpen}
        >
        <section
          className="min-w-0 space-y-3"
          data-testid="bd05-action-board-process-board"
          data-ux-process-acceptance-gates={processContract.acceptanceIds.join(" ")}
          data-ux-process-blocked-reason="selected_action_missing_evidence"
          data-ux-process-business-processes={processContract.businessProcessIds.join(" ")}
          data-ux-process-current-step="action_triage"
          data-ux-process-first="true"
          data-ux-process-gate-ids={processContract.gateIds.join(" ")}
          data-ux-process-gate-state="Evidence review required"
          data-ux-process-next-step={processContract.nextPermittedAction}
        >
          <div
            className="sr-only"
            data-ux-data-surface-filter-state="disabled_static"
            data-ux-disabled-reason="Action board filters remain registered as DSF-007 until the board is backed by a query surface."
            data-ux-e10-filter-exception-id="DSF-007"
          />
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Action Board</CardTitle>
                <InlineStatus tone="gold" value="Evidence review required" />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2 md:grid-cols-4">
                {[
                  ["Selected", selectedAction.title],
                  ["Owner", selectedAction.owner],
                  ["Due", selectedAction.due],
                  ["Evidence", selectedAction.evidenceState],
                ].map(([label, value]) => (
                  <div className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2" key={label}>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle">{label}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-alphavest-ivory">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2 text-sm leading-5 text-alphavest-gold-soft">
                Request the missing approval evidence before marking this work ready.
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {compactActionRows.map((card) => (
                  <button
                    className={cn(
                      "min-h-24 rounded-md border bg-alphavest-charcoal/55 p-3 text-left",
                      card.id === selectedAction.id ? "border-alphavest-gold/75" : card.warning ? "border-alphavest-red/45" : "border-alphavest-border/70",
                    )}
                    key={card.id}
                    onClick={() => setDrawerOpen(true)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-5 text-alphavest-ivory">{card.title}</p>
                      <InlineStatus tone={toneFor(card.priority)} value={card.priority} />
                    </div>
                    <p className="mt-2 text-xs text-alphavest-muted">{card.columnTitle}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-alphavest-muted">
                      <span>{card.assignee}</span>
                      <span className={card.due.includes("Overdue") ? "text-alphavest-red" : undefined}>{card.due}</span>
                      <InlineStatus tone={toneFor(card.evidence)} value={card.evidence} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-2">
            <button className={primaryButtonClass} onClick={() => setDrawerOpen(true)} type="button">Open selected action</button>
            <button className={secondaryButtonClass} onClick={() => setDrawerOpen(true)} type="button">Request missing evidence</button>
          </div>
        </section>
      </MasterDetailSurface>}
        rail={drawerOpen ? undefined : <WealthContextRail />}
        routeId="032"
        safetyNote="Action context can prioritize work only. Evidence, audit, review flow and approval checks still control readiness and visibility."
        statusItems={[
          { label: "Queue", tone: "blue", value: "Action review" },
          { label: "Surface", tone: selectedAction.evidenceState.includes("Missing") ? "red" : "gold", value: selectedAction.evidenceState },
        ]}
        title={title}
        worksurfaceId="client-context-actions"
      />
    </WealthShell>
  );
}

function ActionBoardCard({ card, selected }: { card: ActionCard; selected?: boolean }) {
  const evidenceParts = card.evidence.match(/(\d+) of (\d+)/);
  const progress = evidenceParts ? (Number(evidenceParts[1]) / Number(evidenceParts[2])) * 100 : card.evidence === "Done" ? 100 : card.evidence === "Missing" ? 0 : 8;

  return (
    <article className={cn("rounded-md border bg-alphavest-charcoal/70 p-3 shadow-lg", selected ? "border-alphavest-gold/70" : card.warning ? "border-alphavest-red/45" : "border-alphavest-border/70")}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-5 text-alphavest-ivory">{card.title}</h3>
        <Badge tone={toneFor(card.priority)}>{card.priority}</Badge>
      </div>
      <p className="mt-2 text-xs text-alphavest-muted">{card.object}</p>
      <div className="mt-3 space-y-2 text-xs text-alphavest-muted">
        <p className="flex items-center gap-2"><UserRound aria-hidden="true" className="size-3.5 text-alphavest-gold" />{card.assignee}</p>
        <p className={cn("flex items-center gap-2", card.due.includes("Overdue") && "text-alphavest-red")}><Calendar aria-hidden="true" className="size-3.5 text-alphavest-gold" />{card.due}</p>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-alphavest-muted">Evidence: {card.evidence}</span>
          {card.warning ? <AlertTriangle aria-hidden="true" className="size-4 text-alphavest-red" /> : null}
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-alphavest-border">
          <div className={cn("h-1.5 rounded-full", card.evidence === "Missing" ? "bg-alphavest-red" : progress === 100 ? "bg-alphavest-green" : "bg-alphavest-gold")} style={{ width: `${Math.max(progress, 8)}%` }} />
        </div>
      </div>
    </article>
  );
}

function ActionDrawer({ onClose }: { onClose: () => void }) {
  return (
    <aside aria-label="Action Details" className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-panel/88 p-3 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">Action Details</p>
          <h2 className="mt-2 font-display text-xl text-alphavest-ivory">{selectedAction.title}</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            <InlineStatus tone="red" value={selectedAction.priority} />
            <InlineStatus tone="gold" value={selectedAction.stage} />
          </div>
        </div>
        <button className="grid size-9 shrink-0 place-items-center rounded-full border border-alphavest-border text-alphavest-muted" onClick={onClose} type="button">
          <X aria-hidden="true" className="size-4" />
          <span className="sr-only">Close action drawer</span>
        </button>
      </div>
      <div className="mt-3 space-y-3">
        <section className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3">
          <p className="text-sm font-semibold text-alphavest-ivory">Summary</p>
          <p className="mt-1 text-sm leading-5 text-alphavest-muted">{selectedAction.summary}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              ["Owner", selectedAction.owner],
              ["Due date", selectedAction.due],
              ["Related object", selectedAction.relatedObject],
              ["Evidence", selectedAction.evidenceState]
            ].map(([label, value]) => (
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-2" key={label}>
                <p className="text-xs text-alphavest-muted">{label}</p>
                <p className="mt-1 truncate text-sm font-semibold text-alphavest-ivory">{value}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-alphavest-ivory">Related Evidence</p>
            <span className="text-xs font-semibold text-alphavest-muted" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Permitted list</span>
          </div>
          <div className="grid gap-2">
            {selectedActionEvidence.slice(0, 1).map((item) => (
              <div className={cn("flex items-start gap-3 rounded-md border border-alphavest-border/55 p-2", item.status === "Missing" && "border-alphavest-red/50 bg-alphavest-red/10")} key={item.title}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-alphavest-ivory">{item.title}</p>
                  <p className="text-xs text-alphavest-muted">{item.type} · {item.updated}</p>
                </div>
                <InlineStatus tone={toneFor(item.status)} value={item.status} />
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-alphavest-ivory">Timeline</p>
            <span className="text-xs font-semibold text-alphavest-muted" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">Permitted timeline</span>
          </div>
          <ol
            aria-label="Audit timeline"
            className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2 text-sm text-alphavest-muted"
            data-testid="ux-stage5-audit-timeline"
            data-ux-affordance="static-audit-timeline"
            data-ux-audit-source="display-only"
            data-ux-audit-source-state="display-only"
            data-ux-interactive="false"
          >
            <li data-ux-affordance="static-timeline-item" data-ux-interactive="false">
              {selectedActionTimeline[0]?.title ?? "Latest action context"} · {selectedActionTimeline[0]?.timestamp ?? "Current"}
            </li>
          </ol>
        </section>
        <section className="grid gap-2">
          <button className={primaryButtonClass} data-testid="j05-request-info" onClick={() => { void runDataMaintenanceCommand("j05.requestInfo"); }} type="button">Request Info</button>
          <Link className="text-center text-sm font-semibold text-alphavest-gold hover:text-alphavest-gold-soft" href="/documents/upload">Request client approval evidence</Link>
        </section>
      </div>
    </aside>
  );
}

export function WealthActionsScreen({ route, visualState }: WealthActionsScreenProps) {
  if (!wealthActionsPageIds.includes(route.pageId as (typeof wealthActionsPageIds)[number])) {
    return null;
  }

  if (route.pageId === "031") {
    return <WealthMapPage title={route.title} visualState={visualState} />;
  }

  return <ActionsPage title={route.title} visualState={visualState} />;
}
