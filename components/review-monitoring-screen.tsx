"use client";

import { useState } from "react";
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
import { UxHubPage } from "@/components/ux-hub-page";
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
  rebalanceTriggerRows,
  reviewCalendarRows,
  triggerStateLabel,
  type ReviewMonitoringPageId,
} from "@/lib/review-monitoring-demo-data";
import type { ReviewCalendarRow, ReviewDueState, RebalanceTriggerState } from "@/lib/review-monitoring-service";
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

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ReadinessStrip() {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {[
        {
          icon: CalendarClock,
          title: "Due state",
          detail: "Derived from ReviewSchedule, QueueItem and ActionItem dates in the Phase D service.",
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



type Phase5DetailSplitPanelProps = {
  decisionSupport: string;
  objectLabel: string;
  objectState: string;
  pageJob: string;
  safetyBoundary: string;
  splitTaskId?: string;
  taskId: string;
};



type Phase6DecisionRoomPanelProps = {
  audit: string;
  blocker: string;
  cancelLabel: string;
  confirmLabel: string;
  decisionLabel: string;
  evidence: string;
  preconditions: string;
  safetyNote: string;
  taskId: string;
};

function Phase6DecisionRoomPanel({ audit, blocker, cancelLabel, confirmLabel, decisionLabel, evidence, preconditions, safetyNote, taskId }: Phase6DecisionRoomPanelProps) {
  return (
    <section className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-4" data-testid="ux-phase6-decision-room" data-ux-phase6-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-red">Phase 6 decision room safety recheck</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{decisionLabel}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted" data-testid="ux-phase6-safety-note">{safetyNote}</p>
        </div>
        <Badge tone="red">{taskId}</Badge>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase6-preconditions">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Preconditions</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{preconditions}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase6-evidence">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Evidence</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{evidence}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase6-audit">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Audit</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{audit}</p>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3" data-testid="ux-phase6-blocker">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-red">Blocker</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{blocker}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className={primaryButtonClass} data-testid="ux-phase6-confirm" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" disabled title="Blocked until a typed workflow command is implemented." type="button">{confirmLabel} blocked</button>
        <button className={secondaryButtonClass} data-testid="ux-phase6-cancel" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" disabled title="Blocked until a typed workflow command is implemented." type="button">{cancelLabel} blocked</button>
      </div>
    </section>
  );
}

function Phase5DetailSplitPanel({ decisionSupport, objectLabel, objectState, pageJob, safetyBoundary, splitTaskId, taskId }: Phase5DetailSplitPanelProps) {
  return (
    <section className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/65 p-4" data-testid="ux-phase5-detail-split" data-ux-phase5-split-task={splitTaskId ?? "none"} data-ux-phase5-task={taskId}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">Detail review</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{objectLabel}</h2>
        </div>
        <Badge tone="gold">{taskId}</Badge>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-object-state">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Object state</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{objectState}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-decision-support">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Decision support</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{decisionSupport}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-drawer-boundary">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Drawer boundary</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">Drawer-only context cannot approve, release, delete, export or mutate payload visibility. {safetyBoundary}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-page-job">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Focus</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{pageJob}</p>
        </div>
      </div>
    </section>
  );
}

function Phase4WorkbenchPanel({
  activeTask,
  blocker,
  context,
  primaryAction,
  queueLabel,
  safetyNote,
  taskId,
}: {
  activeTask: string;
  blocker: string;
  context: string;
  primaryAction: string;
  queueLabel: string;
  safetyNote: string;
  taskId: string;
}) {
  return (
    <section className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4" data-testid="ux-workbench-phase4" data-ux-workbench-task={taskId}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge tone="gold">{taskId}</Badge>
          <h3 className="mt-3 font-display text-2xl text-alphavest-ivory">Active task workbench</h3>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">One selected item, one guarded action rail and one explicit blocker. Queue visibility does not change release, export or client visibility state.</p>
        </div>
        <button className={primaryButtonClass} data-testid="ux-workbench-primary-cta" disabled type="button">{primaryAction}</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3" data-testid="ux-workbench-triad">
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-3" data-testid="ux-workbench-queue">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Queue</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{queueLabel}</p>
        </div>
        <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/45 p-3" data-testid="ux-workbench-active-context">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Active context</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{activeTask}</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">{context}</p>
        </div>
        <div className="rounded-md border border-alphavest-red/35 bg-alphavest-red/10 p-3" data-testid="ux-workbench-action-rail">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-red">Action rail</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{primaryAction}</p>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted" data-testid="ux-workbench-blocker">{blocker}</p>
        </div>
      </div>
      <p className="mt-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-3 text-sm leading-6 text-alphavest-muted" data-testid="ux-workbench-safety-note">{safetyNote}</p>
    </section>
  );
}

async function postPhaseDAction(actionId: string) {
  const response = await fetch("/api/demo-workflow", {
    body: JSON.stringify({ actionId }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const body = (await response.json().catch(() => undefined)) as { error?: string; noClientRelease?: boolean; result?: { message?: string } } | undefined;
  if (!response.ok) {
    throw new Error(body?.error ?? `Phase D action failed with HTTP ${response.status}.`);
  }

  return body?.result?.message ?? "Phase D action recorded. No client release occurred.";
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
  const overdueCount = reviewCalendarRows.filter((row) => row.dueState === "overdue").length;
  const dueSoonCount = reviewCalendarRows.filter((row) => row.dueState === "due_soon").length;
  const escalatedCount = reviewCalendarRows.filter((row) => row.escalated).length;

  const columns: Array<DataTableColumn<ReviewCalendarRow>> = [
    {
      key: "client",
      header: "Client",
      render: (row) => <span className="font-semibold text-alphavest-ivory">{row.client}</span>,
    },
    {
      key: "cadence",
      header: "Cadence",
      render: (row) => row.cadence,
    },
    {
      key: "nextReviewDate",
      header: "Next review",
      render: (row) => formatDate(row.nextReviewDate),
    },
    {
      key: "dueState",
      header: "Due state",
      render: (row) => <Badge tone={dueTone(row.dueState)}>{dueStateLabel(row.dueState)}</Badge>,
    },
    {
      key: "owner",
      header: "Owner",
      render: (row) => row.owner,
    },
    {
      key: "queueState",
      header: "Queue",
      render: (row) => <Badge tone={dueTone(row.queueState)}>{dueStateLabel(row.queueState)}</Badge>,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Monitor review cadence, due dates and internal escalation readiness. Calendar state is operational only and does not release advice to clients."
          eyebrow="Phase D · J16"
          title={title}
        />
        <UxHubPage pageId="068" />
        <ReadinessStrip />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard detail="Reviews with a due date inside the next 14 days." label="Due soon" status="SCHEDULED" value={String(dueSoonCount)} />
          <MetricCard detail="Overdue is derived from dated service fields, not from UI labels." label="Overdue" status={overdueCount > 0 ? "FAILED" : "COMPLETED"} value={String(overdueCount)} />
          <MetricCard detail="Rows with queue escalation or overdue queue state." label="Escalated" status="PENDING" value={String(escalatedCount)} />
          <MetricCard detail="Snapshot path: GET /api/review-monitoring." label="API path" status="PROCESSING" value="1 path" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="space-y-5">
            <Card>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Review schedule board</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-alphavest-muted">
                    Default, due-soon, completed and escalated rows are visible. Empty and error states are covered by the shared table and API response contract.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["All", "Due soon", "Overdue", "Escalated"].map((item, index) => (
                    <Badge key={item} tone={index === 0 ? "gold" : "muted"}>{item}</Badge>
                  ))}
                </div>
              </div>
            </Card>
            <Card>
              <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle>Due Reviews</CardTitle>
                <button aria-label="Review schedule filters are not wired in this release" className={secondaryButtonClass} disabled title="Review schedule filters are not wired in this release." type="button">
                  <Filter aria-hidden="true" className="size-4" />
                  Filters
                </button>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} emptyMessage="No review schedule rows match the current filter." getRowId={(row) => row.id} rows={reviewCalendarRows} />
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Calendar actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  className={primaryButtonClass + " w-full"}
                  data-testid="j16-escalate-overdue-review"
                  onClick={() => {
                    void postPhaseDAction("j16.escalateOverdueReview")
                      .then(setActionStatus)
                      .catch((error: unknown) => setActionStatus(error instanceof Error ? error.message : "Phase D action failed."));
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
                    void postPhaseDAction("j16.scheduleReview")
                      .then(setActionStatus)
                      .catch((error: unknown) => setActionStatus(error instanceof Error ? error.message : "Phase D action failed."));
                  }}
                  type="button"
                >
                  <CalendarClock aria-hidden="true" className="size-4" />
                  Schedule human review
                </button>
                <ActionStatus value={actionStatus} />
              </CardContent>
            </Card>
            <StatePanel
              detail="Review scheduling is internal operational state. It does not approve advice, publish client content or replace compliance release."
              state="restricted"
              title="Client visibility blocked"
            />
            <Card>
              <CardHeader>
                <CardTitle>Review checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-alphavest-muted">
                {["GET snapshot returns review rows", "J16 POST actions return audit rows", "No client release flag remains true"].map((item) => (
                  <p className="flex items-center gap-2" key={item}>
                    <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-green" />
                    {item}
                  </p>
                ))}
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
  const selected = rebalanceTriggerRows[0];
  const blockedCount = rebalanceTriggerRows.filter((row) => row.state === "blocked").length;
  const overdueCount = rebalanceTriggerRows.filter((row) => row.dueState === "overdue").length;
  const clientVisibleCount = rebalanceTriggerRows.filter((row) => row.clientVisible).length;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Review rebalance drift and liquidity triggers as internal monitoring inputs. Trigger routing is not advice and remains blocked from client release."
          eyebrow="Phase D · J17"
          title={title}
        />
        <Phase4WorkbenchPanel activeTask="Rebalance trigger RB-77 selected" blocker="Monitoring trigger is internal review state only and cannot execute advice automatically." context="Reviewer confirms stale evidence, drift and suitability prerequisites before advisory routing." primaryAction="Route to advisory review" queueLabel="Rebalance monitoring queue" safetyNote="UX-WORKBENCH-005: monitoring does not create client release, rebalance execution or advice approval." taskId="UX-WORKBENCH-005" />
        <Phase5DetailSplitPanel decisionSupport="Monitoring detail separates rebalance trigger review from execution or client advice." objectLabel="Rebalance trigger split" objectState="Internal trigger blocked" pageJob="Monitoring detail reviews one trigger without becoming rebalance execution." safetyBoundary="Monitoring detail cannot execute trades, approve advice or release content." splitTaskId="UX-PAGE-SPLIT-008" taskId="UX-PAGE-SPLIT-008" />
        <Phase6DecisionRoomPanel audit="Monitoring audit must record trigger, due state, reviewer routing and cancel or confirm outcome." blocker="Rebalance review remains blocked because monitoring state cannot execute trades or publish client advice." cancelLabel="Cancel monitoring decision" confirmLabel="Confirm rebalance review route" decisionLabel="Rebalance review decision room" evidence="Trigger path, due state, client-safe visibility flag and audit action path are visible before decision." preconditions="Human review route, evidence freshness, suitability context and compliance boundary must all pass." safetyNote="No release, export or advice effect can occur until gate preconditions pass and audit is recorded." taskId="UX-DECISION-ROOM-005" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard detail="Rebalance trigger rows in demo monitoring scope." label="Triggers" status="PROCESSING" value={String(rebalanceTriggerRows.length)} />
          <MetricCard detail="Blocked actions require human review before any recommendation path." label="Blocked" status="FAILED" value={String(blockedCount)} />
          <MetricCard detail="SLA state derived from queue/action due dates." label="Overdue" status="FAILED" value={String(overdueCount)} />
          <MetricCard detail="Client-safe visible triggers must stay at zero for this route." label="Client-safe visible" status={clientVisibleCount === 0 ? "COMPLETED" : "FAILED"} value={String(clientVisibleCount)} />
        </div>
        <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)_20rem] 2xl:grid-cols-[20rem_minmax(0,1fr)_24rem]">
          <aside className="space-y-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Trigger queue</CardTitle>
                <Badge tone="gold">{rebalanceTriggerRows.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {rebalanceTriggerRows.map((row, index) => (
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
              detail="The selected trigger is blocked because due-state and release-gate context require human review. Productive rebalance execution is out of scope."
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
                    { icon: ClipboardCheck, label: "Audit action", value: "POST j17.blockRebalanceTrigger" },
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
                    void postPhaseDAction("j17.blockRebalanceTrigger")
                      .then(setActionStatus)
                      .catch((error: unknown) => setActionStatus(error instanceof Error ? error.message : "Phase D action failed."));
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
                    void postPhaseDAction("j17.routeRebalanceReview")
                      .then(setActionStatus)
                      .catch((error: unknown) => setActionStatus(error instanceof Error ? error.message : "Phase D action failed."));
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
        <StatePanel detail="This route is not part of Phase D review monitoring." state="error" title="Unknown Phase D route" />
      </AppShell>
    );
  }

  return <ReviewMonitoringPageBody pageId={route.pageId} title={route.title} />;
}
