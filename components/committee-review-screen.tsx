"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Filter,
  MessageSquareWarning,
  Search,
  Vote,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import {
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
  isCommitteeReviewPageId,
} from "@/lib/committee-review-seed-data";
import type {
  CommitteeReviewDetail,
  CommitteeReviewQueueRow,
  CommitteeReviewStatusFilter,
  CommitteeReviewWorkflowAction,
} from "@/lib/committee-review-service";
import type { ScreenRoute } from "@/lib/route-registry";

type CommitteeReviewScreenProps = {
  route: ScreenRoute;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

type CommitteeReviewDataSurfaceMeta = BackendDataSurfaceMeta<string>;

type CommitteeReviewSummary = {
  blocked: number;
  clientVisible: number;
  inReview: number;
  pending: number;
  total: number;
};

const committeePageSize = 6;
const emptyCommitteeSummary: CommitteeReviewSummary = {
  blocked: 0,
  clientVisible: 0,
  inReview: 0,
  pending: 0,
  total: 0,
};

function committeeQueryParams(input: {
  page: number;
  q: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: string;
  status: CommitteeReviewStatusFilter;
}) {
  const params = new URLSearchParams({
    page: String(input.page),
    pageSize: String(committeePageSize),
    sortDirection: input.sortDirection,
    sortKey: input.sortKey,
  });

  if (input.q.trim()) {
    params.set("q", input.q.trim());
  }

  if (input.status !== "all") {
    params.set("status", input.status);
  }

  return params;
}

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("approved") || normalized.includes("linked") || normalized.includes("complete")) return "green";
  if (normalized.includes("critical") || normalized.includes("blocked") || normalized.includes("open")) return "red";
  if (normalized.includes("high") || normalized.includes("pending") || normalized.includes("partial") || normalized.includes("review")) return "gold";
  if (normalized.includes("none")) return "blue";
  return "muted";
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

const committeeColumns: Array<DataTableColumn<CommitteeReviewQueueRow>> = [
  {
    key: "client",
    header: "Client / Recommendation",
    render: (row) => (
      <span className="font-semibold text-alphavest-ivory">
        {row.client}
        <span className="block text-xs text-alphavest-muted">{row.recommendation}</span>
      </span>
    ),
    sortable: true,
  },
  { key: "risk", header: "Risk", render: (row) => <StatusLabel tone={toneFor(row.risk)}>{row.risk}</StatusLabel>, sortable: true },
  { key: "committeeStatus", header: "Committee", render: (row) => <StatusLabel tone={toneFor(row.committeeStatus)}>{row.committeeStatus}</StatusLabel>, sortable: true },
  { key: "priority", header: "Priority", render: (row) => row.priority, sortable: true },
  { key: "evidence", header: "Evidence", render: (row) => <StatusLabel tone={toneFor(row.evidence)}>{row.evidence}</StatusLabel>, sortable: true },
  {
    key: "due",
    header: "Due",
    render: (row) => (
      <span className={row.committeeStatus === "Blocked" ? "text-alphavest-red" : ""}>
        {new Date(row.due).toLocaleDateString("en", { day: "2-digit", month: "short", year: "numeric" })}
      </span>
    ),
    sortable: true,
  },
];

function QueuePage({ title }: { title: string }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<CommitteeReviewDataSurfaceMeta | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<CommitteeReviewQueueRow[]>([]);
  const [sortDirection, setSortDirection] = useState<DataSurfaceSortDirection>("asc");
  const [sortKey, setSortKey] = useState("due");
  const [statusFilter, setStatusFilter] = useState<CommitteeReviewStatusFilter>("all");
  const [summary, setSummary] = useState<CommitteeReviewSummary>(emptyCommitteeSummary);

  useEffect(() => {
    let active = true;

    async function loadRows() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`/api/committee-reviews?${committeeQueryParams({ page, q: query, sortDirection, sortKey, status: statusFilter })}`, {
          cache: "no-store",
        });
        const body = await response.json();

        if (!response.ok || !body.ok) {
          throw new Error(body.error ?? "Committee review queue unavailable.");
        }

        if (active) {
          setRows(body.rows ?? []);
          setMeta(body.meta ?? null);
          setSummary(body.summary ?? emptyCommitteeSummary);
        }
      } catch (error) {
        if (active) {
          setRows([]);
          setMeta(null);
          setErrorMessage(error instanceof Error ? error.message : "Committee review queue unavailable.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRows();

    return () => {
      active = false;
    };
  }, [page, query, sortDirection, sortKey, statusFilter]);

  function handleSort(nextKey: string) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextKey);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function openDetail(row: CommitteeReviewQueueRow) {
    window.location.assign(`/committee/reviews/${row.recommendationId}/decision-room`);
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          chrome="compact"
          description="Independent peer review for high-risk advisor-approved recommendations. Committee approval is a separate internal check before compliance can consider client release."
          eyebrow="Committee review"
          title={title}
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile detail="High-risk internal packages." label="Pending review" tone="gold" value={String(summary.pending)} />
          <MetricTile detail="Packages opened for peer review." label="In review" tone={summary.inReview > 0 ? "blue" : "gold"} value={String(summary.inReview)} />
          <MetricTile detail="Internal recovery work." label="Blocked" tone={summary.blocked > 0 ? "red" : "green"} value={String(summary.blocked)} />
          <MetricTile detail="No packages released to clients." label="Client-safe visible" tone={summary.clientVisible === 0 ? "green" : "red"} value={String(summary.clientVisible)} />
        </div>
        {errorMessage ? <StatePanel detail={errorMessage} state="blocked" title="Committee action blocked" /> : null}
        <section className="space-y-3">
            <Card density="compact">
              <div className="grid gap-2 lg:grid-cols-[1fr_12rem_repeat(2,10rem)]">
                <label className="relative min-w-0">
                  <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                  <input
                    className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search client or recommendation"
                    value={query}
                  />
                </label>
                <select
                  className="h-10 rounded-md border border-alphavest-border bg-alphavest-charcoal/80 px-3 text-sm font-semibold text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                  onChange={(event) => {
                    setStatusFilter(event.target.value as CommitteeReviewStatusFilter);
                    setPage(1);
                  }}
                  value={statusFilter}
                >
                  <option value="all">All states</option>
                  <option value="pending">Pending</option>
                  <option value="in_review">In review</option>
                  <option value="blocked">Blocked</option>
                </select>
                {["Risk", "Evidence"].map((item) => (
                  <button aria-label={`${item} filter is unavailable for this queue`} className={secondaryButtonClass} disabled key={item} title="Additional filters are fixed to backend queue state for this slice." type="button">
                    <Filter aria-hidden="true" className="size-4" />
                    {item}
                  </button>
                ))}
              </div>
            </Card>
            <DataTable
              actionPolicy="open_detail"
              columns={committeeColumns}
              emptyMessage={loading ? "Committee rows are loading." : "No committee review rows match the current filters."}
              filterState={query || statusFilter !== "all" ? "active_query_and_filter" : "inactive"}
              getRowId={(row) => row.id}
              onRowAction={openDetail}
              onSortChange={handleSort}
              pagination={meta ? { ...meta, onPageChange: setPage } : null}
              rowActionLabel={(row) => `Review ${row.client}`}
              rows={rows}
              serverSort
              sortDirection={sortDirection}
              sortKey={sortKey}
              state={loading ? "loading" : errorMessage ? "error" : "ready"}
            />
          </section>
      </div>
    </AppShell>
  );
}

function DetailPage({ title }: { title: string }) {
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [detail, setDetail] = useState<CommitteeReviewDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [evidenceReason, setEvidenceReason] = useState("Liquidity stress evidence is needed before committee can continue.");
  const [loading, setLoading] = useState(true);
  const [typedConfirmation, setTypedConfirmation] = useState("");

  async function loadDetail() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const segments = window.location.pathname.split("/").filter(Boolean);
      const target = segments[2] ?? "investment-committee";
      const response = await fetch(`/api/committee-reviews?targetId=${encodeURIComponent(target)}`, { cache: "no-store" });
      const body = await response.json();

      if (!response.ok || !body.ok) {
        throw new Error(body.error ?? "Committee detail is unavailable.");
      }

      setDetail(body.detail ?? null);
    } catch (error) {
      setDetail(null);
      setErrorMessage(error instanceof Error ? error.message : "Committee detail is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    window.queueMicrotask(() => {
      void loadDetail();
    });
  }, []);

  async function runAction(actionId: CommitteeReviewWorkflowAction) {
    if (!detail) return;
    setActionMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/committee-reviews/actions", {
      body: JSON.stringify({
        actionId,
        note: actionId === "j18.requestEvidence" ? evidenceReason : "Committee decision-room action recorded.",
        targetId: detail.recommendationId,
        typedConfirmation,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const body = await response.json();

    if (!response.ok || !body.ok) {
      setErrorMessage(body.error ?? "Committee action failed closed.");
      return;
    }

    setActionMessage(body.result?.message ?? "Committee action recorded.");
    setTypedConfirmation("");
    await loadDetail();
  }

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <PageHeader
            chrome="compact"
            description="Committee decision detail for a high-risk recommendation."
            eyebrow="Committee decision"
            title={title}
          />
          <StatePanel detail="Committee decision context is loading." state="loading" title="Loading review" />
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_21rem]">
            <section className="grid gap-3 md:grid-cols-2">
              {[
                ["Package", "Loading recommendation package"],
                ["Votes", "Loading peer vote state"],
                ["Evidence", "Loading linked evidence labels"],
                ["Dissent", "Loading resolution status"],
              ].map(([label, value]) => (
                <Card density="compact" key={label}>
                  <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{value}</p>
                  <p className="mt-1 text-xs text-alphavest-muted">Loading the latest review context.</p>
                </Card>
              ))}
            </section>
            <Card density="compact">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Committee action</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-2">
                <input className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted" disabled value="Loading confirmation" readOnly />
                <button className={cn(primaryButtonClass, "w-full")} disabled type="button">Record peer vote</button>
                <button className={cn(secondaryButtonClass, "w-full")} disabled type="button">Resolve dissent</button>
                <button className={cn(secondaryButtonClass, "w-full")} disabled type="button">Request evidence</button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!detail) {
    return (
      <AppShell>
        <div className="space-y-6">
          <PageHeader
            description="Committee decision detail for a high-risk recommendation."
            eyebrow="Committee decision"
            title={title}
          />
          <StatePanel detail={errorMessage ?? "No committee package was found."} state="blocked" title="Detail unavailable" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          chrome="compact"
          description={detail.client}
          eyebrow="Committee decision"
          title={title}
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile detail="Senior advisor signed off." label="Advisor review" tone="green" value="Approved" />
          <MetricTile detail="Peer votes recorded." label="Votes" tone={detail.votes.recorded >= detail.votes.required ? "green" : "gold"} value={`${detail.votes.recorded}/${detail.votes.required}`} />
          <MetricTile detail="Resolution status." label="Dissent" tone={detail.dissent.open ? "red" : "green"} value={detail.dissent.open ? "Open" : "Resolved"} />
          <MetricTile detail="Linked evidence items." label="Evidence" tone={detail.evidenceLinked >= 3 ? "blue" : "red"} value={`${detail.evidenceLinked}/${detail.evidence.length}`} />
        </div>
        {actionMessage ? <StatePanel detail={actionMessage} state="success" title="Review updated" /> : null}
        {errorMessage ? <StatePanel detail={errorMessage} state="blocked" title="Committee action blocked" /> : null}
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <section className="min-w-0 space-y-3">
            <Card density="compact">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Package and proposal</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-2">
                <div className="grid gap-2 text-sm md:grid-cols-5">
                  {[
                    ["Client", detail.client],
                    ["Structure", detail.structure],
                    ["Vote package", `${detail.votes.recorded}/${detail.votes.required} recorded`],
                    ["Evidence", `${detail.evidenceLinked} linked`],
                    ["Dissent", detail.dissent.status],
                  ].map(([label, value]) => (
                    <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2" key={label}>
                      <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/35 p-2 text-sm">
                  <p className="min-w-0 truncate text-alphavest-muted">{detail.recommendation}</p>
                  <StatusLabel tone="gold">Internal review</StatusLabel>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
              <Card density="compact">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Committee votes</CardTitle>
                </CardHeader>
                <CardContent className="mt-2 space-y-2">
                  {detail.votes.reviewers.map((vote) => (
                    <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2" key={vote.reviewer}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-alphavest-ivory">{vote.reviewer}</p>
                          <p className="text-xs text-alphavest-muted">{vote.role}</p>
                        </div>
                        <StatusLabel tone={toneFor(vote.vote)}>{vote.vote}</StatusLabel>
                      </div>
                      <p className="mt-1 truncate text-xs text-alphavest-muted">{vote.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card density="compact">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Evidence labels</CardTitle>
                </CardHeader>
                <CardContent className="mt-2 space-y-2">
                  {detail.evidence.map((item) => (
                    <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-1.5 text-sm last:border-0" key={item.label}>
                      <span className="text-alphavest-muted">{item.label}</span>
                      <StatusLabel tone={toneFor(item.status)}>{item.status}</StatusLabel>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card density="compact">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Review history</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-2">
                {detail.auditTrail.length > 0 ? (
                  detail.auditTrail.slice(0, 4).map((event) => (
                    <div className="grid gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-2 text-sm md:grid-cols-[minmax(0,1fr)_8rem_7rem]" key={event.id}>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-alphavest-ivory">{event.title}</p>
                        <p className="mt-1 text-xs text-alphavest-muted">{event.actor}</p>
                      </div>
                      <p className="text-xs text-alphavest-muted md:text-right">{event.timestamp}</p>
                      <StatusLabel tone={toneFor(event.result)}>{event.result}</StatusLabel>
                    </div>
                  ))
                ) : (
                  <StatePanel detail="No committee review activity has been recorded yet." state="empty" title="No history yet" />
                )}
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-3">
            <Card density="compact">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Committee action</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted" htmlFor="committee-confirmation">
                  Confirmation
                </label>
                <input
                  id="committee-confirmation"
                  className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                  onChange={(event) => setTypedConfirmation(event.target.value)}
                  placeholder="Type CONFIRM PEER REVIEW or RESOLVE DISSENT"
                  value={typedConfirmation}
                />
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-muted" htmlFor="committee-evidence-note">
                  Evidence note
                </label>
                <textarea
                  id="committee-evidence-note"
                  className="min-h-16 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 py-2 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                  onChange={(event) => setEvidenceReason(event.target.value)}
                  value={evidenceReason}
                />
                <button className={cn(primaryButtonClass, "w-full")} onClick={() => void runAction("j18.recordVote")} type="button">
                  <Vote aria-hidden="true" className="size-4" />
                  Record peer vote
                </button>
                <button className={cn(secondaryButtonClass, "w-full")} onClick={() => void runAction("j18.resolveDissent")} type="button">
                  <MessageSquareWarning aria-hidden="true" className="size-4" />
                  Resolve dissent
                </button>
                <button className={cn(secondaryButtonClass, "w-full")} onClick={() => void runAction("j18.requestEvidence")} type="button">
                  <ClipboardCheck aria-hidden="true" className="size-4" />
                  Request evidence
                </button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

export function CommitteeReviewScreen({ route }: CommitteeReviewScreenProps) {
  if (!isCommitteeReviewPageId(route.pageId)) {
    return null;
  }

  if (route.pageId === "070") {
    return <QueuePage title={route.title} />;
  }

  return <DetailPage title={route.title} />;
}
