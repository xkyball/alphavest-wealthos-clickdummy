"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  LineChart,
  LockKeyhole,
  RefreshCw,
  Route,
  ShieldAlert,
  TimerReset,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  StatePanel,
  type BadgeTone,
  type DataTableColumn,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import type { BackendDataSurfaceMeta, DataSurfaceSortDirection } from "@/lib/data-surface-query-contract";
import {
  dueStateLabel,
  isReviewMonitoringPageId,
  triggerStateLabel,
  type ReviewMonitoringPageId,
} from "@/lib/review-monitoring-seed-data";
import type { RebalanceTriggerRow, ReviewCalendarRow, ReviewDueState, ReviewMonitoringSnapshot, RebalanceTriggerState } from "@/lib/review-monitoring-service";
import type { ScreenRoute } from "@/lib/route-registry";

type ReviewMonitoringScreenProps = {
  route: ScreenRoute;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";
const defaultReviewsPageSize = 8;
const defaultRebalancePageSize = 1;
type DataSurfaceMeta = BackendDataSurfaceMeta<string>;

function dataSurfaceParams(input: {
  filters?: Record<string, string>;
  page?: number;
  pageSize?: number;
  q?: string;
  sortDirection?: DataSurfaceSortDirection;
  sortKey?: string;
  surface: "rebalance" | "reviews";
}) {
  const params = new URLSearchParams({
    page: String(input.page ?? 1),
    pageSize: String(input.pageSize ?? (input.surface === "reviews" ? defaultReviewsPageSize : defaultRebalancePageSize)),
    sortDirection: input.sortDirection ?? "asc",
    sortKey: input.sortKey ?? (input.surface === "reviews" ? "nextReviewDate" : "priority"),
    surface: input.surface,
  });

  if (input.q?.trim()) {
    params.set("q", input.q.trim());
  }

  for (const [key, value] of Object.entries(input.filters ?? {})) {
    if (value && value !== "all") {
      params.set(key, value);
    }
  }

  return params;
}

function dueTone(state: ReviewDueState): BadgeTone {
  if (state === "completed") return "green";
  if (state === "overdue") return "red";
  if (state === "due_soon") return "gold";
  if (state === "upcoming") return "blue";
  return "muted";
}

function triggerTone(state: RebalanceTriggerState): BadgeTone {
  if (state === "blocked") return "red";
  if (state === "routed") return "purple";
  if (state === "in_review") return "gold";
  if (state === "awaiting_info") return "blue";
  return "muted";
}

function StatusIcon({ tone, value }: { tone: BadgeTone; value: string }) {
  const Icon = tone === "red"
    ? AlertTriangle
    : tone === "green"
      ? CheckCircle2
      : tone === "gold"
        ? LockKeyhole
        : tone === "blue"
          ? CalendarClock
          : tone === "purple" || tone === "teal"
            ? Route
            : ShieldAlert;
  const toneClass: Record<BadgeTone, string> = {
    blue: "border-alphavest-blue/40 bg-alphavest-blue/10 text-alphavest-blue",
    gold: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft",
    green: "border-alphavest-green/40 bg-alphavest-green/10 text-alphavest-green",
    muted: "border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted",
    purple: "border-violet-400/40 bg-violet-400/10 text-violet-200",
    red: "border-alphavest-red/40 bg-alphavest-red/10 text-alphavest-red",
    teal: "border-teal-300/40 bg-teal-300/10 text-teal-200",
  };

  return (
    <span
      aria-label={value}
      className={cn("inline-flex size-8 items-center justify-center rounded-md border", toneClass[tone])}
      title={value}
    >
      <Icon aria-hidden="true" className="size-4" />
    </span>
  );
}

function MetricTile({ detail, label, tone = "muted", value }: { detail: string; label: string; tone?: BadgeTone; value: string }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "text-alphavest-blue",
    gold: "text-alphavest-gold-soft",
    green: "text-alphavest-green",
    muted: "text-alphavest-muted",
    purple: "text-violet-200",
    red: "text-alphavest-red",
    teal: "text-teal-200",
  };

  return (
    <Card className="min-h-0" density="compact">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-alphavest-muted">{label}</p>
        <span className={cn("text-xs font-semibold", toneClass[tone])}>{tone === "red" ? "Blocked" : tone === "green" ? "Clear" : "Active"}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-alphavest-ivory">{value}</p>
      <p className="mt-1 text-sm leading-5 text-alphavest-muted">{detail}</p>
    </Card>
  );
}

function StatusLabel({ children, tone = "muted" }: { children: React.ReactNode; tone?: BadgeTone }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue",
    gold: "border-alphavest-gold/45 bg-alphavest-gold/10 text-alphavest-gold-soft",
    green: "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green",
    muted: "border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted",
    purple: "border-violet-400/35 bg-violet-400/10 text-violet-200",
    red: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red",
    teal: "border-teal-300/35 bg-teal-300/10 text-teal-200",
  };

  return <span className={cn("inline-flex min-h-7 items-center whitespace-nowrap rounded-full border px-3 text-xs font-semibold", toneClass[tone])}>{children}</span>;
}

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function useReviewMonitoringSnapshot() {
  const [snapshot, setSnapshot] = useState<ReviewMonitoringSnapshot | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const response = await fetch("/api/review-monitoring", { cache: "no-store" });
        const body = (await response.json()) as (ReviewMonitoringSnapshot & { ok?: boolean }) | { error?: string };

        if (!response.ok || !("reviews" in body) || !("rebalance" in body)) {
          throw new Error("Review monitoring snapshot failed.");
        }

        if (!cancelled) {
          setSnapshot(body);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setSnapshot(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { loadState, snapshot };
}

function useReviewRows(queryState: {
  dueState: string;
  page: number;
  q: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
}) {
  const [rows, setRows] = useState<ReviewCalendarRow[]>([]);
  const [meta, setMeta] = useState<DataSurfaceMeta | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const params = dataSurfaceParams({
          filters: { dueState: queryState.dueState },
          page: queryState.page,
          q: queryState.q,
          sortDirection: queryState.sortDirection,
          sortKey: queryState.sortKey,
          surface: "reviews",
        });
        const response = await fetch(`/api/review-monitoring?${params.toString()}`, { cache: "no-store" });
        const body = (await response.json()) as { meta?: DataSurfaceMeta; reviewRows?: ReviewCalendarRow[] };

        if (!response.ok) {
          throw new Error("Review rows failed.");
        }

        if (!cancelled) {
          setRows(body.reviewRows ?? []);
          setMeta(body.meta ?? null);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setMeta(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [queryState.dueState, queryState.page, queryState.q, queryState.sortDirection, queryState.sortKey]);

  return { loadState, meta, rows };
}

function useRebalanceRows(queryState: {
  page: number;
  q: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
  state: string;
}) {
  const [rows, setRows] = useState<RebalanceTriggerRow[]>([]);
  const [meta, setMeta] = useState<DataSurfaceMeta | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");

      try {
        const params = dataSurfaceParams({
          filters: { state: queryState.state },
          page: queryState.page,
          pageSize: defaultRebalancePageSize,
          q: queryState.q,
          sortDirection: queryState.sortDirection,
          sortKey: queryState.sortKey,
          surface: "rebalance",
        });
        const response = await fetch(`/api/review-monitoring?${params.toString()}`, { cache: "no-store" });
        const body = (await response.json()) as { meta?: DataSurfaceMeta; rebalanceRows?: RebalanceTriggerRow[] };

        if (!response.ok) {
          throw new Error("Rebalance rows failed.");
        }

        if (!cancelled) {
          setRows(body.rebalanceRows ?? []);
          setMeta(body.meta ?? null);
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setMeta(null);
          setLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [queryState.page, queryState.q, queryState.sortDirection, queryState.sortKey, queryState.state]);

  return { loadState, meta, rows };
}

function DataListPagination({ itemLabel, meta, onPageChange }: { itemLabel: string; meta: DataSurfaceMeta | null; onPageChange: (page: number) => void }) {
  if (!meta) return null;

  return (
    <div
      className="flex items-center justify-between gap-2 rounded-md border border-alphavest-border bg-alphavest-panel/65 p-2 text-xs text-alphavest-muted"
      data-testid="ux-data-list-pagination"
      data-ux-data-surface-source-truth={meta.sourceTruth}
    >
      <span className="min-w-0 truncate">
        {meta.returnedRows}/{meta.totalRows} {itemLabel} · {meta.page}/{meta.totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          aria-label="Previous page"
          className="inline-flex h-8 w-9 items-center justify-center rounded-md border border-alphavest-border bg-alphavest-charcoal/70 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(Math.max(1, meta.page - 1))}
          type="button"
        >
          Prev
        </button>
        <button
          aria-label="Next page"
          className="inline-flex h-8 w-9 items-center justify-center rounded-md border border-alphavest-border bg-alphavest-charcoal/70 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(Math.min(meta.totalPages, meta.page + 1))}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

async function postStageDAction(actionId: string) {
  const response = await fetch("/api/review-monitoring/actions", {
    body: JSON.stringify({ actionId }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const body = (await response.json().catch(() => undefined)) as { error?: string; noClientRelease?: boolean; result?: { message?: string } } | undefined;
  if (!response.ok) {
    throw new Error(body?.error ?? `Review monitoring action failed with HTTP ${response.status}.`);
  }

  return body?.result?.message ?? "Review monitoring action recorded. No client release occurred.";
}

function ActionStatus({ value }: { value: string | null }) {
  if (!value) return null;

  return (
    <p className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3 text-sm leading-6 text-alphavest-gold-soft">
      {value}
    </p>
  );
}

function ReviewCalendarPage({ title }: { title: string }) {
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dueStateFilter, setDueStateFilter] = useState("all");
  const [sortKey, setSortKey] = useState<keyof ReviewCalendarRow>("nextReviewDate");
  const [sortDirection, setSortDirection] = useState<DataSurfaceSortDirection>("asc");
  const [page, setPage] = useState(1);
  const { loadState: snapshotLoadState, snapshot } = useReviewMonitoringSnapshot();
  const { loadState, meta, rows: reviewRows } = useReviewRows({
    dueState: dueStateFilter,
    page,
    q: searchTerm,
    sortDirection,
    sortKey: String(sortKey),
  });
  const overdueCount = snapshot?.reviews.overdue ?? 0;
  const dueSoonCount = snapshot?.reviews.dueSoon ?? 0;
  const escalatedCount = snapshot?.reviews.rows.filter((row) => row.escalated).length ?? 0;
  const dueStateOptions: ReviewDueState[] = ["completed", "due_soon", "overdue", "scheduled", "upcoming"];

  const columns: Array<DataTableColumn<ReviewCalendarRow>> = [
    {
      className: "w-[20rem] whitespace-normal",
      key: "client",
      header: "Client",
      render: (row) => (
        <span className="block min-w-52">
          <span className="block font-semibold text-alphavest-ivory">{row.client}</span>
          <span className="mt-1 block text-xs text-alphavest-muted">Owner: {row.owner}</span>
        </span>
      ),
      sortable: true,
    },
    {
      className: "w-24 whitespace-nowrap",
      key: "cadence",
      header: "Cadence",
      render: (row) => <span className="whitespace-nowrap">{row.cadence}</span>,
      sortable: true,
    },
    {
      className: "w-32 whitespace-nowrap",
      key: "nextReviewDate",
      header: "Next review",
      render: (row) => <span className="whitespace-nowrap">{formatDate(row.nextReviewDate)}</span>,
      sortable: true,
    },
    {
      className: "w-24 whitespace-nowrap",
      key: "dueState",
      header: "Due state",
      render: (row) => <StatusIcon tone={dueTone(row.dueState)} value={dueStateLabel(row.dueState)} />,
      sortable: true,
    },
    {
      className: "w-20 whitespace-nowrap",
      key: "queueState",
      header: "Queue",
      render: (row) => <StatusIcon tone={dueTone(row.queueState)} value={dueStateLabel(row.queueState)} />,
      sortable: true,
    },
  ];

  function toggleSort(key: string) {
    const nextKey = key as keyof ReviewCalendarRow;

    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      setPage(1);
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
    setPage(1);
  }

  return (
    <AppShell>
      <div className="space-y-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">Review calendar</p>
            <h1 className="mt-1 font-display text-2xl text-alphavest-ivory">{title}</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-alphavest-muted">
              Monitor due dates, internal escalation readiness and human review actions without client release.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 xl:w-[36rem]">
            {[
              { label: "Due soon", value: dueSoonCount, state: "Scheduled", tone: "gold" as BadgeTone },
              { label: "Overdue", value: overdueCount, state: overdueCount > 0 ? "Failed" : "Completed", tone: overdueCount > 0 ? "red" as BadgeTone : "green" as BadgeTone },
              { label: "Escalated", value: escalatedCount, state: "Pending", tone: "blue" as BadgeTone },
            ].map((item) => (
              <Card className="p-3" key={item.label}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-alphavest-ivory">{item.value}</p>
                  </div>
                  <StatusIcon tone={item.tone} value={item.state} />
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="space-y-3">
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Due Reviews</CardTitle>
                  <Badge tone={loadState === "error" ? "red" : "green"}>{loadState === "error" ? "Review list unavailable" : "Current view"}</Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-[1fr_14rem]">
                  <label className="block">
                    <span className="sr-only">Search review schedule</span>
                    <input
                      className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
                      onChange={(event) => {
                        setSearchTerm(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search reviews..."
                      type="search"
                      value={searchTerm}
                    />
                  </label>
                  <select
                    aria-label="Review due state"
                    className="h-11 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                    onChange={(event) => {
                      setDueStateFilter(event.target.value);
                      setPage(1);
                    }}
                    value={dueStateFilter}
                  >
                    <option value="all">All due states</option>
                    {dueStateOptions.map((state) => (
                      <option key={state} value={state}>{dueStateLabel(state)}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  actionPolicy="none"
                  columns={columns}
                  emptyMessage={loadState === "error" ? "Review monitoring rows could not be loaded." : "No review schedule rows match this search."}
                  getRowId={(row) => row.id}
                  onSortChange={toggleSort}
                  pagination={meta ? { ...meta, onPageChange: setPage } : null}
                  rows={reviewRows}
                  serverSort
                  sortDirection={sortDirection}
                  sortKey={String(sortKey)}
                  state={loadState === "loading" ? "loading" : loadState === "error" ? "error" : "ready"}
                />
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Calendar actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  className={primaryButtonClass + " w-full"}
                  data-testid="j16-escalate-overdue-review"
                  onClick={() => {
                    void postStageDAction("j16.escalateOverdueReview")
                      .then(setActionStatus)
                      .catch((error: unknown) => setActionStatus(error instanceof Error ? error.message : "Review monitoring action failed."));
                  }}
                  type="button"
                >
                  <TimerReset aria-hidden="true" className="size-4" />
                  Escalate overdue review
                </button>
                <button
                  className={secondaryButtonClass + " w-full"}
                  data-testid="j16-schedule-review"
                  onClick={() => {
                    void postStageDAction("j16.scheduleReview")
                      .then(setActionStatus)
                      .catch((error: unknown) => setActionStatus(error instanceof Error ? error.message : "Review monitoring action failed."));
                  }}
                  type="button"
                >
                  <CalendarClock aria-hidden="true" className="size-4" />
                  Schedule human review
                </button>
                <ActionStatus value={actionStatus} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monitoring snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">Reviews</dt>
                    <dd className="mt-1 font-semibold text-alphavest-ivory">{snapshotLoadState === "error" ? "0" : snapshot?.reviews.total ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">Triggers</dt>
                    <dd className="mt-1 font-semibold text-alphavest-ivory">{snapshot?.rebalance.total ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">Visible</dt>
                    <dd className="mt-1 font-semibold text-alphavest-ivory">{snapshot?.rebalance.clientVisible ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted">Audit rows</dt>
                    <dd className="mt-1 font-semibold text-alphavest-ivory">{snapshot?.auditProof.recentStageDAuditRows ?? 0}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function RebalanceMonitoringPage({ title }: { title: string }) {
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortKey, setSortKey] = useState<keyof RebalanceTriggerRow>("priority");
  const [sortDirection, setSortDirection] = useState<DataSurfaceSortDirection>("desc");
  const [page, setPage] = useState(1);
  const { loadState: snapshotLoadState, snapshot } = useReviewMonitoringSnapshot();
  const { loadState, meta, rows: rebalanceRows } = useRebalanceRows({
    page,
    q: searchTerm,
    sortDirection,
    sortKey: String(sortKey),
    state: stateFilter,
  });
  const selected: RebalanceTriggerRow = rebalanceRows[0] ?? {
    actionStatus: "not_loaded",
    client: "No API trigger loaded",
    clientVisible: false,
    confidence: "Not scored",
    dueState: "scheduled",
    id: "no-api-trigger",
    priority: "n/a",
    queueEscalated: false,
    slaDueAt: null,
    state: "new",
    title: loadState === "error" ? "Review monitoring unavailable" : "No rebalance trigger loaded",
    triggerType: "none",
  };
  const blockedCount = snapshot?.rebalance.blocked ?? 0;
  const overdueCount = snapshot?.rebalance.overdue ?? 0;
  const clientVisibleCount = snapshot?.rebalance.clientVisible ?? 0;
  const triggerStateOptions: RebalanceTriggerState[] = ["awaiting_info", "blocked", "in_review", "new", "routed"];
  const sortOptions: Array<{ label: string; value: keyof RebalanceTriggerRow }> = [
    { label: "Priority", value: "priority" },
    { label: "SLA due", value: "slaDueAt" },
    { label: "State", value: "state" },
    { label: "Client", value: "client" },
  ];

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          chrome="compact"
          description="Review rebalance drift and liquidity triggers as internal monitoring inputs. Trigger routing is not advice and remains blocked from client release."
          eyebrow="Rebalance monitoring"
          title={title}
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile detail="Internal trigger rows awaiting review." label="Triggers" tone={snapshotLoadState === "error" ? "red" : "blue"} value={String(snapshot?.rebalance.total ?? rebalanceRows.length)} />
          <MetricTile detail="Human review required before recommendation." label="Blocked" tone="red" value={String(blockedCount)} />
          <MetricTile detail="Derived from action due dates." label="Overdue" tone="red" value={String(overdueCount)} />
          <MetricTile detail="Must stay zero on this route." label="Visible" tone={clientVisibleCount === 0 ? "green" : "red"} value={String(clientVisibleCount)} />
        </div>
        <div className="grid gap-3 xl:grid-cols-[16rem_minmax(0,1fr)_18rem] 2xl:grid-cols-[18rem_minmax(0,1fr)_20rem]">
          <aside className="space-y-3">
            <Card>
              <CardHeader className="space-y-2 pb-2">
                <div className="flex flex-row items-center justify-between">
                  <CardTitle>Trigger queue</CardTitle>
                  <StatusLabel tone={loadState === "error" ? "red" : "gold"}>{meta?.totalRows ?? rebalanceRows.length}</StatusLabel>
                </div>
                <label className="block">
                  <span className="sr-only">Search rebalance triggers</span>
                  <input
                    className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search triggers..."
                    type="search"
                    value={searchTerm}
                  />
                </label>
                <div className="grid gap-2">
                  <select
                    aria-label="Trigger state"
                    className="h-10 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                    onChange={(event) => {
                      setStateFilter(event.target.value);
                      setPage(1);
                    }}
                    value={stateFilter}
                  >
                    <option value="all">All states</option>
                    {triggerStateOptions.map((state) => (
                      <option key={state} value={state}>{triggerStateLabel(state)}</option>
                    ))}
                  </select>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <select
                      aria-label="Trigger sort"
                      className="h-10 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                      onChange={(event) => {
                        setSortKey(event.target.value as keyof RebalanceTriggerRow);
                        setPage(1);
                      }}
                      value={String(sortKey)}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <select
                      aria-label="Trigger sort direction"
                      className="h-10 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                      onChange={(event) => {
                        setSortDirection(event.target.value === "asc" ? "asc" : "desc");
                        setPage(1);
                      }}
                      value={sortDirection}
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {rebalanceRows.map((row, index) => (
                  <article
                    className={cn(
                      "rounded-md border p-2.5",
                      index === 0 ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35",
                    )}
                    key={row.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <StatusLabel tone={triggerTone(row.state)}>{triggerStateLabel(row.state)}</StatusLabel>
                      <StatusLabel tone={dueTone(row.dueState)}>{dueStateLabel(row.dueState)}</StatusLabel>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{row.title}</p>
                    <p className="mt-1 text-sm text-alphavest-muted">{row.client}</p>
                    <p className="mt-1 text-xs text-alphavest-subtle">SLA {formatDate(row.slaDueAt)} · {row.confidence}</p>
                  </article>
                ))}
                {rebalanceRows.length === 0 ? (
                  <StatePanel
                    detail={loadState === "error" ? "Review monitoring failed closed." : "No rebalance triggers match this search."}
                    state={loadState === "error" ? "error" : "empty"}
                    title={loadState === "error" ? "Monitoring unavailable" : "No triggers"}
                  />
                ) : null}
                <DataListPagination itemLabel="triggers" meta={meta} onPageChange={setPage} />
              </CardContent>
            </Card>
          </aside>
          <section className="space-y-3">
            <Card>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <LineChart aria-hidden="true" className="size-6 text-alphavest-gold" />
                    <h2 className="font-display text-2xl text-alphavest-ivory">{selected.title}</h2>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-alphavest-muted">
                    Rebalance drift is monitored as an internal trigger. It can request evidence or route review, but cannot publish advice to the client from this screen.
                  </p>
                </div>
                <StatusLabel tone="red">Internal only</StatusLabel>
              </div>
              <CardContent className="mt-3 grid gap-2 md:grid-cols-2">
                {[
                  ["Client", selected.client],
                  ["State", triggerStateLabel(selected.state)],
                  ["Due state", dueStateLabel(selected.dueState)],
                  ["Visibility", selected.clientVisible ? "Client-safe" : "Internal"],
                ].map(([label, value]) => (
                  <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2" key={label}>
                    <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="rounded-md border border-alphavest-red/45 bg-alphavest-red/10 p-3">
              <p className="text-sm font-semibold text-alphavest-ivory">Blocked review action</p>
              <p className="mt-1 text-sm leading-5 text-alphavest-muted">Due-state and release-check context require human review. Rebalance execution is out of access.</p>
            </div>
          </section>
          <aside className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Routing & actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  className={primaryButtonClass + " w-full"}
                  data-testid="j17-block-rebalance-trigger"
                  onClick={() => {
                    void postStageDAction("j17.blockRebalanceTrigger")
                      .then(setActionStatus)
                      .catch((error: unknown) => setActionStatus(error instanceof Error ? error.message : "Review monitoring action failed."));
                  }}
                  type="button"
                >
                  <AlertTriangle aria-hidden="true" className="size-4" />
                  Block rebalance trigger
                </button>
                <button
                  className={secondaryButtonClass + " w-full"}
                  data-testid="j17-route-rebalance-review"
                  onClick={() => {
                    void postStageDAction("j17.routeRebalanceReview")
                      .then(setActionStatus)
                      .catch((error: unknown) => setActionStatus(error instanceof Error ? error.message : "Review monitoring action failed."));
                  }}
                  type="button"
                >
                  <ArrowRight aria-hidden="true" className="size-4" />
                  Route human review
                </button>
                <button className={secondaryButtonClass + " w-full"} disabled type="button">
                  <RefreshCw aria-hidden="true" className="size-4" />
                  Execute rebalance
                </button>
                <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-2 text-sm leading-5 text-alphavest-muted">
                  Execution is disabled. This action records review state and audit only.
                </div>
                <ActionStatus value={actionStatus} />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function ReviewMonitoringPageBody({ pageId, title }: { pageId: ReviewMonitoringPageId; title: string }) {
  if (pageId === "068") {
    return <ReviewCalendarPage title={title} />;
  }

  return <RebalanceMonitoringPage title={title} />;
}

export function ReviewMonitoringScreen({ route }: ReviewMonitoringScreenProps) {
  if (!isReviewMonitoringPageId(route.pageId)) {
    return (
      <AppShell>
        <StatePanel detail="This route is not part of review monitoring." state="error" title="Unknown review route" />
      </AppShell>
    );
  }

  return <ReviewMonitoringPageBody pageId={route.pageId} title={route.title} />;
}
