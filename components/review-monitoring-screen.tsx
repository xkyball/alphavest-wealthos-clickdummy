"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  EyeOff,
  Filter,
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
  MetricCard,
  StatePanel,
  type BadgeTone,
  type DataTableColumn,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  dueStateLabel,
  isReviewMonitoringPageId,
  triggerStateLabel,
  type ReviewMonitoringPageId,
} from "@/lib/review-monitoring-demo-data";
import type { RebalanceTriggerRow, ReviewCalendarRow, ReviewDueState, ReviewMonitoringSnapshot, RebalanceTriggerState } from "@/lib/review-monitoring-service";
import type { ScreenRoute } from "@/lib/route-registry";

type ReviewMonitoringScreenProps = {
  route: ScreenRoute;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

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

function ReadinessStrip() {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {[
        {
          icon: CalendarClock,
          title: "Due state",
          detail: "Derived from ReviewSchedule, QueueItem and ActionItem dates in the review monitoring service.",
        },
        {
          icon: ShieldAlert,
          title: "Trigger state",
          detail: "Rebalance rows stay internal and are verified through the review monitoring API.",
        },
        {
          icon: LockKeyhole,
          title: "No client release",
          detail: "J16/J17 actions write audit state only; they do not create client-visible advice.",
        },
      ].map((item) => {
        const Icon = item.icon;

        return (
          <Card className="min-h-32" key={item.title}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-md border border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-alphavest-ivory">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-alphavest-muted">{item.detail}</p>
              </div>
            </div>
          </Card>
        );
      })}
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
  const { loadState, snapshot } = useReviewMonitoringSnapshot();
  const reviewRows = snapshot?.reviews.rows ?? [];
  const overdueCount = snapshot?.reviews.overdue ?? 0;
  const dueSoonCount = snapshot?.reviews.dueSoon ?? 0;
  const escalatedCount = reviewRows.filter((row) => row.escalated).length;

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
    },
    {
      className: "w-24 whitespace-nowrap",
      key: "cadence",
      header: "Cadence",
      render: (row) => <span className="whitespace-nowrap">{row.cadence}</span>,
    },
    {
      className: "w-32 whitespace-nowrap",
      key: "nextReviewDate",
      header: "Next review",
      render: (row) => <span className="whitespace-nowrap">{formatDate(row.nextReviewDate)}</span>,
    },
    {
      className: "w-24 whitespace-nowrap",
      key: "dueState",
      header: "Due state",
      render: (row) => <StatusIcon tone={dueTone(row.dueState)} value={dueStateLabel(row.dueState)} />,
    },
    {
      className: "w-20 whitespace-nowrap",
      key: "queueState",
      header: "Queue",
      render: (row) => <StatusIcon tone={dueTone(row.queueState)} value={dueStateLabel(row.queueState)} />,
    },
  ];

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
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>Due Reviews</CardTitle>
                <button aria-label="Review schedule filters are unavailable for this view" className={secondaryButtonClass} disabled title="Review schedule filters are unavailable for this view." type="button">
                  <Filter aria-hidden="true" className="size-4" />
                  Filters
                </button>
              </CardHeader>
              <CardContent>
                <DataTable
                  actionPolicy="none"
                  columns={columns}
                  emptyMessage={loadState === "error" ? "Review monitoring snapshot could not be loaded from the API." : "No review schedule rows match the current filter."}
                  getRowId={(row) => row.id}
                  rows={reviewRows.slice(0, 6)}
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
                    <dd className="mt-1 font-semibold text-alphavest-ivory">{snapshot?.reviews.total ?? 0}</dd>
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
  const { loadState, snapshot } = useReviewMonitoringSnapshot();
  const rebalanceRows = snapshot?.rebalance.rows ?? [];
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
    title: loadState === "error" ? "Review monitoring API unavailable" : "No rebalance trigger loaded",
    triggerType: "none",
  };
  const blockedCount = snapshot?.rebalance.blocked ?? 0;
  const overdueCount = snapshot?.rebalance.overdue ?? 0;
  const clientVisibleCount = snapshot?.rebalance.clientVisible ?? 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Review rebalance drift and liquidity triggers as internal monitoring inputs. Trigger routing is not advice and remains blocked from client release."
          eyebrow="Rebalance monitoring"
          title={title}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard detail="Rebalance trigger rows from GET /api/review-monitoring." label="Triggers" status={loadState === "error" ? "FAILED" : "PROCESSING"} value={String(snapshot?.rebalance.total ?? rebalanceRows.length)} />
          <MetricCard detail="Blocked actions require human review before any recommendation path." label="Blocked" status="FAILED" value={String(blockedCount)} />
          <MetricCard detail="SLA state derived from queue/action due dates." label="Overdue" status="FAILED" value={String(overdueCount)} />
          <MetricCard detail="Client-safe visible triggers must stay at zero for this route." label="Client-safe visible" status={clientVisibleCount === 0 ? "COMPLETED" : "FAILED"} value={String(clientVisibleCount)} />
        </div>
        <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)_20rem] 2xl:grid-cols-[20rem_minmax(0,1fr)_24rem]">
          <aside className="space-y-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Trigger queue</CardTitle>
                <Badge tone="gold">{rebalanceRows.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {rebalanceRows.map((row, index) => (
                  <article
                    className={cn(
                      "rounded-md border p-4",
                      index === 0 ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35",
                    )}
                    key={row.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Badge tone={triggerTone(row.state)}>{triggerStateLabel(row.state)}</Badge>
                      <Badge tone={dueTone(row.dueState)}>{dueStateLabel(row.dueState)}</Badge>
                    </div>
                    <p className="mt-3 font-semibold text-alphavest-ivory">{row.title}</p>
                    <p className="mt-1 text-sm text-alphavest-muted">{row.client}</p>
                    <p className="mt-2 text-xs text-alphavest-subtle">SLA {formatDate(row.slaDueAt)} · {row.confidence}</p>
                  </article>
                ))}
                {rebalanceRows.length === 0 ? (
                  <StatePanel
                    detail={loadState === "error" ? "The review monitoring API failed closed." : "No API-backed rebalance triggers are available."}
                    state={loadState === "error" ? "error" : "empty"}
                    title={loadState === "error" ? "API unavailable" : "No triggers"}
                  />
                ) : null}
              </CardContent>
            </Card>
            <StatePanel detail="No rebalance triggers match this filter." state="empty" title="No triggers found" />
          </aside>
          <section className="space-y-5">
            <Card>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <LineChart aria-hidden="true" className="size-6 text-alphavest-gold" />
                    <h2 className="font-display text-3xl text-alphavest-ivory">{selected.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-alphavest-muted">
                    Rebalance drift is monitored as an internal trigger. It can request evidence or route review, but cannot publish advice to the client from this screen.
                  </p>
                </div>
                <Badge tone="red">Internal only</Badge>
              </div>
            </Card>
            <StatePanel
              detail="The selected trigger is blocked because due-state and release-check context require human review. Productive rebalance execution is out of access."
              state="blocked"
              title="Blocked review action"
            />
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ["Client", selected.client],
                ["State", triggerStateLabel(selected.state)],
                ["Due state", dueStateLabel(selected.dueState)],
                ["Client-safe visible", selected.clientVisible ? "Yes" : "No"],
              ].map(([label, value]) => (
                <Card className="min-h-28" key={label}>
                  <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{value}</p>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Trigger path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { icon: Route, label: "API snapshot", value: "GET /api/review-monitoring" },
                    { icon: ClipboardCheck, label: "Audit action", value: "POST /api/review-monitoring/actions" },
                    { icon: EyeOff, label: "Visibility", value: "clientVisible=false" },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-4" key={item.label}>
                        <Icon aria-hidden="true" className="size-5 text-alphavest-gold" />
                        <p className="mt-3 text-sm font-semibold text-alphavest-ivory">{item.label}</p>
                        <p className="mt-1 text-xs text-alphavest-muted">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Routing & actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                <ActionStatus value={actionStatus} />
              </CardContent>
            </Card>
            <StatePanel
              detail="Execution is disabled. This action records review state and audit only."
              state="restricted"
              title="Execution disabled"
            />
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
