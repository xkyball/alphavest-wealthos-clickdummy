"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Folder,
  Home,
  Landmark,
  LockKeyhole,
  MessageSquare,
  Network,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlobalSearchBox } from "@/components/global-search-box";
import { AuditTimeline, Badge, Card, CardContent, CardHeader, CardTitle, StatePanel, type BadgeTone } from "@/components/ui";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { ProductGuidanceContent } from "@/components/product-guidance-panel";
import { UxComplexityPriorityPanel } from "@/components/ux-complexity-priority-panel";
import { RouteContextChip } from "@/components/route-context-chip";
import { UxCtaCluster } from "@/components/ux-cta-cluster";
import { UxHubPage } from "@/components/ux-hub-page";
import { UxSecondaryContextTabs } from "@/components/ux-secondary-context-tabs";
import { UxSupportDensityStrip } from "@/components/ux-support-density-strip";
import { cn } from "@/lib/cn";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import type { ScreenRoute } from "@/lib/route-registry";
import { runScreencastDemoAction } from "@/lib/screencast-demo-client";
import type { VisualState } from "@/lib/visual-contract";
import {
  actionColumns,
  actionMetrics,
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
} from "@/lib/wealth-actions-demo-data";

type WealthActionsScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

type ShellNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  pageIds?: string[];
};

const shellNav: ShellNavItem[] = [
  { href: "/client/home", icon: Home, label: "Home" },
  { href: "/client/family-members", icon: UsersRound, label: "Clients" },
  { href: "/entities", icon: Landmark, label: "Entities" },
  { href: "/wealth-map", icon: Network, label: "Live wealth map", pageIds: ["031"] },
  { href: "/documents", icon: Folder, label: "Documents" },
  { href: "/actions", icon: ClipboardCheck, label: "Actions", pageIds: ["032"] },
  { href: "/advisor/reviews", icon: CheckCircle2, label: "Workflows" },
  { href: "/communication/:id/context", icon: MessageSquare, label: "Communications" },
  { href: "/compliance/reviews", icon: ShieldCheck, label: "Compliance" },
  { href: "/evidence", icon: FileText, label: "Evidence" }
];

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";

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

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="sr-only">{children}</h1>;
}

function AlphaVestMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded text-2xl font-semibold text-alphavest-gold">A</div>
      <div>
        <p className="font-display text-2xl leading-none text-alphavest-ivory">AlphaVest</p>
        <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-alphavest-gold">WealthOS</p>
      </div>
    </div>
  );
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

function WealthSidebar({ activePageId }: { activePageId: string }) {
  return (
    <aside className="hidden min-h-screen border-r border-alphavest-border/60 bg-alphavest-navy/88 p-5 lg:flex lg:w-[var(--sidebar-width)] lg:flex-col">
      <AlphaVestMark />
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {shellNav.map((item) => {
          const Icon = item.icon;
          const active = item.pageIds?.includes(activePageId);

          return (
            <a
              className={cn(
                "flex h-10 items-center gap-3 rounded-md border px-3 text-sm transition",
                active
                  ? "border-alphavest-gold/45 bg-alphavest-gold/12 text-alphavest-gold-soft"
                  : "border-transparent text-alphavest-muted hover:border-alphavest-border hover:bg-alphavest-panel/65 hover:text-alphavest-ivory"
              )}
              href={item.href}
              key={item.label}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="space-y-3">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/60 p-4">
          <p className="text-sm font-semibold text-alphavest-ivory">{wealthWorkspace.household}</p>
          <p className="mt-1 text-xs text-alphavest-muted">Demo tenant context</p>
        </div>
        <button className="flex h-10 w-full items-center gap-2 rounded-md border border-alphavest-border px-3 text-sm text-alphavest-muted" type="button">
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          Configure
        </button>
      </div>
    </aside>
  );
}

function WealthTopBar() {
  const { session, setRole, setTenant } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <GlobalSearchBox className="xl:w-[34rem]" />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <RouteContextChip />
          <label className="relative">
            <span className="sr-only">Tenant context</span>
            <select
              className="h-10 w-full appearance-none rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-3 pr-8 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold sm:w-64"
              onChange={(event) => setTenant(event.target.value as DemoTenantSlug)}
              value={session.tenant.slug}
            >
              {demoTenants.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.displayName}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          </label>
          <label className="relative">
            <span className="sr-only">Role context</span>
            <select
              className="h-10 w-full appearance-none rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-3 pr-8 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold sm:w-56"
              onChange={(event) => setRole(event.target.value as DemoRoleKey)}
              value={session.role.key}
            >
              {demoRoles.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          </label>
          <button className={primaryButtonClass} type="button">
            <Plus aria-hidden="true" className="size-4" />
            New
          </button>
          <button className="relative grid size-10 place-items-center rounded-full border border-alphavest-border text-alphavest-muted" type="button">
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute -right-1 -top-1 rounded-full bg-alphavest-gold px-1.5 text-[0.65rem] font-bold text-alphavest-navy">7</span>
          </button>
          <div className="flex h-10 items-center gap-2 rounded-full border border-alphavest-border bg-alphavest-charcoal/70 pl-1 pr-3">
            <span className="grid size-8 place-items-center rounded-full border border-alphavest-gold/45 text-xs font-semibold text-alphavest-gold">{session.actor.initials}</span>
            <span className="hidden text-sm font-semibold text-alphavest-ivory md:block">{session.actor.displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function WealthShell({ activePageId, children }: { activePageId: string; children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-wealth av-shell-grid">
        <WealthSidebar activePageId={activePageId} />
        <div className="min-w-0">
          <WealthTopBar />
          <main className="px-4 py-6 md:px-6">
            <ProductGuidanceContent>{children}</ProductGuidanceContent>
          </main>
        </div>
      </div>
    </DemoSessionProvider>
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

function SafeGateBanner() {
  return (
    <div className="flex items-center gap-3 rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm text-alphavest-gold-soft">
      <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
      <span>No unapproved advice reaches the client. Action visibility stays blocked until advisor, compliance, evidence and permission gates pass.</span>
    </div>
  );
}

function WealthMapPage({ title }: { title: string; visualState?: VisualState }) {
  return (
    <WealthShell activePageId="031">
      <ScreenTitle>{title}</ScreenTitle>
      <UxSupportDensityStrip className="mx-auto mb-5 max-w-[104rem]" pageId="031" />
      <UxHubPage pageId="031" />
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
        <UxSecondaryContextTabs
          safetyNote="This drawer is secondary context only; full workflows and final gates stay on the target workbench/detail route."
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
                              void runScreencastDemoAction("j05.viewDetails", "/actions?state=drawer");
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

  return (
    <WealthShell activePageId="032">
      <ScreenTitle>{title}</ScreenTitle>
      <div className={cn("mx-auto grid max-w-[118rem] gap-5", drawerOpen ? "2xl:grid-cols-[1fr_30rem]" : "")}>
        <section className="min-w-0 space-y-5">
          <PageHeading
            action={
              <UxCtaCluster
                blockedReason="New action is secondary; selected blocked work must be opened first because evidence is missing."
                primary={{ label: "Open selected action", onClick: () => setDrawerOpen(true) }}
                recoveryAction={{ label: "Request missing evidence", onClick: () => setDrawerOpen(true) }}
                secondary={[
                  { label: "Filters" },
                  {
                    disabled: true,
                    disabledReason: "Open and resolve the selected blocked action before creating new work.",
                    label: "New action",
                  },
                ]}
              />
            }
            subtitle="Track and advance actions through the workflow."
            title={title}
          />
          <UxSupportDensityStrip pageId="032" />
          <UxComplexityPriorityPanel
            actionLabel="Open selected action"
            actionState="Selected action review stays blocked until missing client approval evidence is resolved."
            priorityItems={[
              { detail: selectedAction.object, label: selectedAction.title, value: selectedAction.priority },
              { detail: "Client approval evidence missing", label: "Evidence blocker", value: selectedAction.evidenceState },
              { detail: selectedAction.due, label: "Next due item", value: selectedAction.stage },
            ]}
            safetyNote="Readiness still requires evidence, audit and workflow gates."
            summaryItems={[
              { detail: "Work that needs attention first", label: "Blocked", value: "1" },
              { detail: "Visible on the board", label: "Active actions", value: "22" },
              { detail: "Must stay evidence-backed", label: "Client visible", value: "0" },
            ]}
            title="Action status"
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            {actionMetrics.map((metric) => (
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/70 p-4" key={metric.label}>
                <p className="text-sm text-alphavest-muted">{metric.label}</p>
                <p className={cn("mt-2 text-3xl font-semibold", metric.label === "Overdue" || metric.label === "Blocked" ? "text-alphavest-red" : metric.label === "Due Today" ? "text-alphavest-gold" : "text-alphavest-ivory")}>{metric.value}</p>
                <p className={cn("mt-2 text-xs", metric.trend === "down" ? "text-alphavest-red" : metric.trend === "up" ? "text-alphavest-green" : "text-alphavest-muted")}>{metric.delta}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {["Priority", "Owner", "Due date", "Evidence state", "Workflow stage"].map((filter) => (
                <button className="flex h-10 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted" key={filter} type="button">
                  {filter}
                  <ChevronDown aria-hidden="true" className="size-4" />
                </button>
              ))}
            </div>
            <button className={secondaryButtonClass} type="button">Group: Workflow Stage</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {actionColumns.map((column) => (
              <section className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/55 p-4" key={column.id}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-alphavest-ivory">{column.title}</h2>
                  <Badge tone="muted">{column.count}</Badge>
                </div>
                <div className="space-y-3">
                  {column.cards.map((card) => (
                    <ActionBoardCard card={card} key={card.id} selected={card.id === selectedAction.id} />
                  ))}
                  <button className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed border-alphavest-border text-xs font-semibold text-alphavest-gold transition hover:border-alphavest-gold" type="button">
                    <Plus aria-hidden="true" className="size-4" />
                    Add Action
                  </button>
                </div>
              </section>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 text-xs text-alphavest-muted">
            <span className="font-semibold text-alphavest-ivory">Legend</span>
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-alphavest-red" />High</span>
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-alphavest-gold" />Medium</span>
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-alphavest-green" />Low</span>
            <span className="flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />Complete</span>
            <span className="flex items-center gap-2"><AlertTriangle aria-hidden="true" className="size-4 text-alphavest-red" />Missing evidence</span>
          </div>
          <SafeGateBanner />
        </section>
        {drawerOpen ? <ActionDrawer onClose={() => setDrawerOpen(false)} /> : null}
      </div>
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
    <aside aria-label="Action Details" className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-panel/88 p-4 shadow-2xl 2xl:sticky 2xl:top-24 2xl:max-h-[calc(100vh-7rem)] 2xl:overflow-y-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Action Details</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="red">{selectedAction.priority}</Badge>
            <h2 className="font-display text-2xl text-alphavest-ivory">{selectedAction.title}</h2>
            <Badge tone="blue">{selectedAction.stage}</Badge>
          </div>
          <p className="mt-2 text-sm text-alphavest-muted">{selectedAction.object} · Action ID: {selectedAction.id}</p>
        </div>
        <button className="grid size-9 shrink-0 place-items-center rounded-full border border-alphavest-border text-alphavest-muted" onClick={onClose} type="button">
          <X aria-hidden="true" className="size-4" />
          <span className="sr-only">Close action drawer</span>
        </button>
      </div>
      <div className="mt-5 space-y-5">
        <section className="border-t border-alphavest-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Summary</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">{selectedAction.summary}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Owner", selectedAction.owner],
              ["Due date", selectedAction.due],
              ["Workflow stage", selectedAction.stage],
              ["Related object", selectedAction.relatedObject]
            ].map(([label, value]) => (
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3" key={label}>
                <p className="text-xs text-alphavest-muted">{label}</p>
                <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-alphavest-muted">Evidence State</span>
              <span className="font-semibold text-alphavest-gold">{selectedAction.evidenceState}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-alphavest-border">
              <div className="h-2 w-4/5 rounded-full bg-alphavest-gold" />
            </div>
          </div>
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Related Evidence</p>
            <button className="text-xs font-semibold text-alphavest-gold" type="button">View all</button>
          </div>
          <div className="overflow-hidden rounded-md border border-alphavest-border/70">
            {selectedActionEvidence.map((item) => (
              <div className={cn("flex items-start gap-3 border-b border-alphavest-border/55 p-3 last:border-0", item.status === "Missing" && "border-alphavest-red/50 bg-alphavest-red/10")} key={item.title}>
                <IconTile tone={item.status === "Missing" ? "red" : "blue"}>{item.status === "Missing" ? <Upload aria-hidden="true" className="size-4" /> : <FileText aria-hidden="true" className="size-4" />}</IconTile>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-alphavest-ivory">{item.title}</p>
                  <p className="text-xs text-alphavest-muted">{item.type} · {item.updated}</p>
                </div>
                <Badge tone={toneFor(item.status)}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Timeline</p>
            <button className="text-xs font-semibold text-alphavest-gold" type="button">View all</button>
          </div>
          <AuditTimeline items={selectedActionTimeline.map((item) => ({ ...item }))} />
        </section>
        <Card>
          <CardHeader><CardTitle className="text-xl">Notes</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-alphavest-gold/45 text-xs text-alphavest-gold">AB</span>
              <p className="text-sm leading-6 text-alphavest-muted">{selectedAction.note}</p>
            </div>
          </CardContent>
        </Card>
        <StatePanel detail="Client approval evidence is missing. This action cannot be marked ready for advisor or client release yet." state="blocked" title="Blocked by missing evidence" />
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Available actions</p>
          <UxCtaCluster
            blockedReason="Mark Ready stays blocked until client approval evidence is present; do not use drawer actions as readiness proof."
            primary={{ label: "Request Info", onClick: () => { void runScreencastDemoAction("j05.requestInfo"); }, testId: "j05-request-info" }}
            recoveryAction={{ href: "/documents/upload", label: "Request client approval evidence" }}
            secondary={[
              { label: "Update Due Date" },
              {
                disabled: true,
                disabledReason: "Client approval evidence must be present before readiness can be marked.",
                label: "Mark Ready",
                testId: "j05-mark-ready",
              },
            ]}
          />
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
