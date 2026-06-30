"use client";

import { useEffect, useState } from "react";
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
import { Badge, Card, CardContent, CardHeader, CardTitle, FilterBar, MasterDetailSurface, StatePanel, type BadgeTone } from "@/components/ui";
import { ActorSessionProvider, useActorSession } from "@/components/actor-session-provider";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";
import { SecondaryContextTabs } from "@/components/secondary-context-tabs";
import { WorksurfacePanel, WorksurfaceShell } from "@/components/worksurface-shell";
import { cn } from "@/lib/cn";
import type { ActionBoardSortKey } from "@/lib/action-board-readmodel-service";
import type { BackendDataSurfaceMeta, DataSurfaceSortDirection } from "@/lib/data-surface-query-contract";
import { processFirstUxContractForPageId } from "@/lib/process-first-ux-contract";
import type { ScreenRoute } from "@/lib/route-registry";
import { runDataMaintenanceCommand } from "@/lib/data-maintenance-command-client";
import type { VisualState } from "@/lib/visual-contract";
import {
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

function WealthContextRail({ selectedActionTitle }: { selectedActionTitle: string }) {
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
          <WorksurfaceInfoRow label="Selected action" value={selectedActionTitle} />
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

type ActionBoardReadModelRow = {
  assignedRoleLabel: string;
  blockedReason: string | null;
  clientVisible: boolean;
  description: string;
  dueDate: string | null;
  evidenceStatus: string;
  href: string;
  id: string;
  priority: string;
  status: string;
  title: string;
  updatedAt: string;
};

type ActionBoardReadModelOptions = {
  page: number;
  pageSize: number;
  priority: string;
  q: string;
  roleKey: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: ActionBoardSortKey;
  status: string;
  tenantSlug: string;
};

function actionBoardFilterState(searchTerm: string, activeFilterCount: number) {
  if (searchTerm.length > 0 && activeFilterCount > 0) return "active_query_and_filter";
  if (searchTerm.length > 0) return "active_query";
  if (activeFilterCount > 0) return "active_filter";

  return "inactive";
}

function useActionBoardReadModel(options: ActionBoardReadModelOptions) {
  const [loadState, setLoadState] = useState<"error" | "loading" | "ready">("loading");
  const [meta, setMeta] = useState<BackendDataSurfaceMeta<ActionBoardSortKey> | null>(null);
  const [rows, setRows] = useState<ActionBoardReadModelRow[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const params = new URLSearchParams({
          page: String(options.page),
          pageSize: String(options.pageSize),
          priority: options.priority,
          q: options.q,
          roleKey: options.roleKey,
          sortDirection: options.sortDirection,
          sortKey: options.sortKey,
          status: options.status,
          tenantSlug: options.tenantSlug,
        });
        const response = await fetch(`/api/action-board?${params.toString()}`, { cache: "no-store" });
        const body = (await response.json()) as {
          meta?: BackendDataSurfaceMeta<ActionBoardSortKey>;
          rows?: ActionBoardReadModelRow[];
        };

        if (!response.ok) {
          throw new Error("Action board readmodel failed.");
        }

        if (!cancelled) {
          setMeta(body.meta ?? null);
          setRows(body.rows ?? []);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setMeta(null);
          setRows([]);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [options.page, options.pageSize, options.priority, options.q, options.roleKey, options.sortDirection, options.sortKey, options.status, options.tenantSlug, refreshKey]);

  return { loadState, meta, refresh: () => setRefreshKey((current) => current + 1), rows };
}

function ActionsPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  return (
    <WealthShell activePageId="032">
      <ActionsPageContent title={title} visualState={visualState} />
    </WealthShell>
  );
}

function ActionsPageContent({ title, visualState }: { title: string; visualState?: VisualState }) {
  const { session } = useActorSession();
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer");
  const [page, setPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<DataSurfaceSortDirection>("asc");
  const [sortKey, setSortKey] = useState<ActionBoardSortKey>("dueDate");
  const [statusFilter, setStatusFilter] = useState("all");
  const processContract = processFirstUxContractForPageId("032");
  const activeFilterCount = [priorityFilter !== "all", statusFilter !== "all"].filter(Boolean).length;
  const filterState = actionBoardFilterState(searchTerm, activeFilterCount);
  const readModel = useActionBoardReadModel({
    page,
    pageSize: 4,
    priority: priorityFilter,
    q: searchTerm,
    roleKey: session.role.key,
    sortDirection,
    sortKey,
    status: statusFilter,
    tenantSlug: session.tenant.slug,
  });
  const selectedBoardAction = readModel.rows.find((row) => row.id === selectedActionId) ?? readModel.rows[0] ?? null;

  async function runActionCommand(actionId: "j05.markReady" | "j05.requestInfo" | "j05.viewDetails", action = selectedBoardAction) {
    if (!action) return;
    await runDataMaintenanceCommand(actionId, undefined, {
      actionItemId: action.id,
      roleKey: session.role.key,
      tenantSlug: session.tenant.slug,
    });
    readModel.refresh();
  }

  return (
    <>
      <ScreenTitle>{title}</ScreenTitle>
      <WorksurfaceShell
        description="Action board for relationship and evidence-linked work, normalized into the shared review surface."
        eyebrow="Client context"
        primary={<MasterDetailSurface
          actionPolicy="open_detail"
          density="standard_review"
          detail={drawerOpen && selectedBoardAction ? <ActionDrawer action={selectedBoardAction} onClose={() => setDrawerOpen(false)} onRequestInfo={() => { void runActionCommand("j05.requestInfo"); }} /> : undefined}
          family="board"
          filterState={filterState}
          masterDetailMode={drawerOpen ? "drawer_detail" : "inline_detail_rail"}
          selectedObjectId={selectedBoardAction?.id ?? "none"}
          selectedObjectState={selectedBoardAction?.status ?? "Loading"}
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
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Action Board</CardTitle>
                <InlineStatus tone={selectedBoardAction?.blockedReason ? "red" : "gold"} value={selectedBoardAction?.blockedReason ? "Blocked by evidence" : "Action review"} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2 md:grid-cols-4">
                {[
                  ["Selected", selectedBoardAction?.title ?? "Loading actions"],
                  ["Owner", selectedBoardAction?.assignedRoleLabel ?? "Unassigned"],
                  ["Due", selectedBoardAction?.dueDate ?? "No due date"],
                  ["Evidence", selectedBoardAction?.evidenceStatus ?? "Pending"],
                ].map(([label, value]) => (
                  <div className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-2" key={label}>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-alphavest-subtle">{label}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-alphavest-ivory">{value}</p>
                  </div>
                ))}
              </div>
              <FilterBar
                activeFilterCount={activeFilterCount}
                activeStateLabel={searchTerm.length > 0 || activeFilterCount > 0 ? "Action board filters applied." : "Action board is current."}
                filterState={filterState}
                onQueryChange={(value) => { setSearchTerm(value); setPage(1); }}
                onReset={() => { setSearchTerm(""); setPriorityFilter("all"); setStatusFilter("all"); setPage(1); }}
                placeholder="Search action items..."
                queryValue={searchTerm}
                searchTestId="ux-interaction-action-board-search"
              />
              <div className="grid gap-2 md:grid-cols-2" data-testid="s032-action-board-real-filters">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                  Action state
                  <select className="mt-0 h-11 rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm font-semibold text-alphavest-ivory" onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} value={statusFilter}>
                    <option value="all">All states</option>
                    <option value="AWAITING_INFO">Awaiting info</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="COMPLIANCE_PENDING">Compliance pending</option>
                    <option value="IN_REVIEW">In review</option>
                    <option value="NEW">New</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                  Priority
                  <select className="mt-0 h-11 rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm font-semibold text-alphavest-ivory" onChange={(event) => { setPriorityFilter(event.target.value); setPage(1); }} value={priorityFilter}>
                    <option value="all">All priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">
                  Sort
                  <select className="mt-0 h-11 rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm font-semibold text-alphavest-ivory" onChange={(event) => { setSortKey(event.target.value as ActionBoardSortKey); setPage(1); }} value={sortKey}>
                    <option value="dueDate">Due date</option>
                    <option value="priority">Priority</option>
                    <option value="status">Action state</option>
                    <option value="title">Title</option>
                    <option value="updatedAt">Updated</option>
                  </select>
                </label>
                <button className={secondaryButtonClass + " self-end"} onClick={() => { setSortDirection((current) => current === "asc" ? "desc" : "asc"); setPage(1); }} type="button">
                  {sortDirection === "asc" ? "Ascending" : "Descending"}
                </button>
              </div>
              {readModel.meta ? (
                <div
                  className="flex flex-col gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/30 px-3 py-2 text-sm text-alphavest-muted md:flex-row md:items-center md:justify-between"
                  data-testid="ux-data-list-pagination"
                  data-ux-data-surface-source-truth={readModel.meta.sourceTruth}
                >
                  <p>
                    Showing {readModel.meta.returnedRows} of {readModel.meta.totalRows} action items · Page {readModel.meta.page} of {readModel.meta.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button className="inline-flex h-9 items-center rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm font-semibold text-alphavest-ivory transition disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:border-alphavest-gold/60" disabled={!readModel.meta.hasPreviousPage} onClick={() => setPage(Math.max(1, readModel.meta!.page - 1))} type="button">Previous</button>
                    <button className="inline-flex h-9 items-center rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm font-semibold text-alphavest-ivory transition disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:border-alphavest-gold/60" disabled={!readModel.meta.hasNextPage} onClick={() => setPage(Math.min(readModel.meta!.totalPages, readModel.meta!.page + 1))} type="button">Next</button>
                  </div>
                </div>
              ) : null}
              {readModel.rows.length === 0 ? (
                <StatePanel
                  detail={readModel.loadState === "error" ? "The action board could not be loaded." : "No action items match the current query."}
                  state={readModel.loadState === "error" ? "error" : "empty"}
                  title="No action items"
                />
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                {readModel.rows.map((card) => (
                  <button
                    className={cn(
                      "min-h-24 rounded-md border bg-alphavest-charcoal/55 p-3 text-left",
                      card.id === selectedBoardAction?.id ? "border-alphavest-gold/75" : card.blockedReason ? "border-alphavest-red/45" : "border-alphavest-border/70",
                    )}
                    key={card.id}
                    onClick={() => { setSelectedActionId(card.id); setDrawerOpen(true); void runActionCommand("j05.viewDetails", card); }}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-5 text-alphavest-ivory">{card.title}</p>
                      <InlineStatus tone={toneFor(card.priority)} value={card.priority} />
                    </div>
                    <p className="mt-2 text-xs text-alphavest-muted">{card.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-alphavest-muted">
                      <span>{card.assignedRoleLabel}</span>
                      <span>{card.dueDate ?? "No due date"}</span>
                      <InlineStatus tone={toneFor(card.status)} value={card.status} />
                    </div>
                  </button>
                ))}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-2">
            <button className={primaryButtonClass} disabled={!selectedBoardAction} onClick={() => setDrawerOpen(true)} type="button">Open selected action</button>
            <button className={secondaryButtonClass} disabled={!selectedBoardAction} onClick={() => { void runActionCommand("j05.requestInfo"); }} type="button">Request missing evidence</button>
            <button className={secondaryButtonClass} disabled={!selectedBoardAction} onClick={() => { void runActionCommand("j05.markReady"); }} type="button">Check ready gate</button>
          </div>
        </section>
      </MasterDetailSurface>}
        rail={drawerOpen ? undefined : <WealthContextRail selectedActionTitle={selectedBoardAction?.title ?? "No action selected"} />}
        routeId="032"
        safetyNote="Action context can prioritize work only. Evidence, audit, review flow and approval checks still control readiness and visibility."
        statusItems={[
          { label: "Queue", tone: "blue", value: "Action review" },
          { label: "Surface", tone: selectedBoardAction?.blockedReason ? "red" : "gold", value: selectedBoardAction?.status ?? "Loading" },
        ]}
        title={title}
        worksurfaceId="client-context-actions"
      />
    </>
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

function ActionDrawer({ action, onClose, onRequestInfo }: { action: ActionBoardReadModelRow; onClose: () => void; onRequestInfo: () => void }) {
  return (
    <aside aria-label="Action Details" className="min-w-0 rounded-md border border-alphavest-border bg-alphavest-panel/88 p-3 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">Action Details</p>
          <h2 className="mt-2 font-display text-xl text-alphavest-ivory">{action.title}</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            <InlineStatus tone={toneFor(action.priority)} value={action.priority} />
            <InlineStatus tone={toneFor(action.status)} value={action.status} />
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
          <p className="mt-1 text-sm leading-5 text-alphavest-muted">{action.description}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              ["Owner", action.assignedRoleLabel],
              ["Due date", action.dueDate ?? "No due date"],
              ["Updated", action.updatedAt],
              ["Evidence", action.evidenceStatus]
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
            <p className="text-sm font-semibold text-alphavest-ivory">Evidence state</p>
            <InlineStatus tone={toneFor(action.evidenceStatus)} value={action.evidenceStatus} />
          </div>
          <div className={cn("rounded-md border border-alphavest-border/55 p-3", action.blockedReason && "border-alphavest-red/50 bg-alphavest-red/10")}>
            <p className="text-sm font-semibold text-alphavest-ivory">{action.blockedReason ? "Blocked before ready state" : "Evidence check is tracked"}</p>
            <p className="mt-1 text-sm text-alphavest-muted">
              {action.blockedReason ?? "The action remains governed by action state, evidence status and release controls."}
            </p>
          </div>
        </section>
        <section className="rounded-md border border-alphavest-border bg-alphavest-charcoal/45 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-alphavest-ivory">Action state</p>
            <InlineStatus tone={action.clientVisible ? "blue" : "muted"} value={action.clientVisible ? "Client-visible request" : "Internal work"} />
          </div>
          <p className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2 text-sm text-alphavest-muted">
            Current state: <span className="font-semibold text-alphavest-ivory">{action.status}</span>. Ready checks stay fail-closed until missing evidence is resolved.
          </p>
        </section>
        <section className="grid gap-2">
          <button className={primaryButtonClass} data-testid="j05-request-info" onClick={onRequestInfo} type="button">Request Info</button>
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
