"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Filter,
  LockKeyhole,
  MessageSquareWarning,
  Search,
  Vote,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import {
  AuditTimeline,
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
import type { BackendDataSurfaceMeta, DataSurfaceSortDirection } from "@/lib/data-surface-query-contract";
import {
  isCommitteeReviewPageId,
  selectedCommitteeReview,
} from "@/lib/committee-review-seed-data";
import type { CommitteeReviewQueueRow, CommitteeReviewStatusFilter } from "@/lib/committee-review-service";
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
  { key: "risk", header: "Risk", render: (row) => <Badge tone={toneFor(row.risk)}>{row.risk}</Badge>, sortable: true },
  { key: "committeeStatus", header: "Committee", render: (row) => <Badge tone={toneFor(row.committeeStatus)}>{row.committeeStatus}</Badge>, sortable: true },
  { key: "priority", header: "Priority", render: (row) => row.priority, sortable: true },
  { key: "evidence", header: "Evidence", render: (row) => <Badge tone={toneFor(row.evidence)}>{row.evidence}</Badge>, sortable: true },
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
  const [actionMessage, setActionMessage] = useState<string | null>(null);
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

  async function recordPeerReview(row: CommitteeReviewQueueRow) {
    setActionMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/committee-reviews/actions", {
      body: JSON.stringify({
        actionId: "j18.openPeerReview",
        targetId: row.recommendationId,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const body = await response.json();

    if (!response.ok || !body.ok) {
      setErrorMessage(body.error ?? "Peer review action failed closed.");
      return;
    }

    setActionMessage(body.result?.message ?? "Peer review opened. Internal audit and workflow command history were recorded.");
    setPage(1);
    setSortKey("committeeStatus");
    setSortDirection("asc");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Independent peer review for high-risk advisor-approved recommendations. Committee approval is a separate internal check before compliance can consider client release."
          eyebrow="Committee review"
          title={title}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard detail="High-risk internal packages waiting for peer review." label="Pending review" status="PENDING" value={String(summary.pending)} />
          <MetricCard detail="Packages already opened for peer review." label="In review" status={summary.inReview > 0 ? "PROCESSING" : "PENDING"} value={String(summary.inReview)} />
          <MetricCard detail="Blocked packages remain internal and need recovery work." label="Blocked" status={summary.blocked > 0 ? "FAILED" : "COMPLETED"} value={String(summary.blocked)} />
          <MetricCard detail="Must remain zero until client-safe release checks pass downstream." label="Client-safe visible" status={summary.clientVisible === 0 ? "COMPLETED" : "FAILED"} value={String(summary.clientVisible)} />
        </div>
        {actionMessage ? <StatePanel detail={actionMessage} state="success" title="Peer review recorded" /> : null}
        {errorMessage ? <StatePanel detail={errorMessage} state="blocked" title="Committee action blocked" /> : null}
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_23rem]">
          <section className="space-y-5">
            <Card>
              <div className="grid gap-3 lg:grid-cols-[1fr_12rem_repeat(2,10rem)]">
                <label className="relative min-w-0">
                  <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                  <input
                    className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search client or recommendation"
                    value={query}
                  />
                </label>
                <select
                  className="h-11 rounded-md border border-alphavest-border bg-alphavest-charcoal/80 px-3 text-sm font-semibold text-alphavest-ivory outline-none transition focus:border-alphavest-gold"
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
              onRowAction={recordPeerReview}
              onSortChange={handleSort}
              pagination={meta ? { ...meta, onPageChange: setPage } : null}
              rowActionLabel={(row) => `Open peer review for ${row.client}`}
              rows={rows}
              serverSort
              sortDirection={sortDirection}
              sortKey={sortKey}
              state={loading ? "loading" : errorMessage ? "error" : "ready"}
            />
          </section>
          <aside className="space-y-5">
            <StatePanel
              detail="Advisor approval alone remains insufficient. This queue records peer-review handoff only; downstream compliance still controls release."
              state="restricted"
              title="Internal review only"
            />
            <Card>
              <CardHeader>
                <CardTitle>Selected package</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ["Queue rows", String(summary.total)],
                  ["Open peer reviews", String(summary.inReview)],
                  ["Blocked packages", String(summary.blocked)],
                  ["Client visible", String(summary.clientVisible)],
                  ["Next step", rows[0] ? `Open peer review for ${rows[0].client}` : "No matching package"],
                ].map(([label, value]) => (
                  <div className="flex justify-between gap-4 border-b border-alphavest-border/45 pb-2 last:border-0" key={label}>
                    <span className="text-alphavest-muted">{label}</span>
                    <span className="text-right font-semibold text-alphavest-ivory">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function DetailPage({ title }: { title: string }) {
  const voteProgress = selectedCommitteeReview.votes.filter((item) => item.vote !== "Pending").length;
  const evidenceLinked = selectedCommitteeReview.evidence.filter((item) => item.status === "Linked").length;
  const openDissent = selectedCommitteeReview.dissentItems.length;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Committee decision detail for a high-risk recommendation. Votes, dissent and evidence states are visible before any downstream compliance release."
          eyebrow="Committee decision"
          title={title}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard detail={selectedCommitteeReview.advisorApproval} label="advisor review" status="COMPLETED" value="Approved" />
          <MetricCard detail="Three peer votes required for this high-risk package." label="Votes" status="PENDING" value={`${voteProgress}/3`} />
          <MetricCard detail="Open dissent blocks committee completion." label="Dissent" status="FAILED" value={String(openDissent)} />
          <MetricCard detail="Committee evidence package readiness." label="Evidence" status="PROCESSING" value={`${evidenceLinked}/5`} />
        </div>
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_24rem]">
          <section className="min-w-0 space-y-5">
            <Card>
              <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  ["Client", selectedCommitteeReview.client],
                  ["Structure", selectedCommitteeReview.structure],
                  ["Recommendation ID", selectedCommitteeReview.recommendationId],
                  ["Risk", selectedCommitteeReview.risk],
                  ["Status", selectedCommitteeReview.status],
                ].map(([label, value]) => (
                  <div className="border-l border-alphavest-border pl-3" key={label}>
                    <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Review objective</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-6 text-alphavest-muted">{selectedCommitteeReview.objective}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCommitteeReview.riskDrivers.map((item) => (
                      <Badge key={item} tone="gold">{item}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recommendation under review</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-alphavest-muted">{selectedCommitteeReview.recommendation}</p>
                  <StatePanel className="mt-4" detail="This wording is internal review material. Client release remains blocked." state="restricted" title="Internal only" />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Committee votes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedCommitteeReview.votes.map((vote) => (
                    <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4" key={vote.reviewer}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-alphavest-ivory">{vote.reviewer}</p>
                          <p className="text-xs text-alphavest-muted">{vote.role}</p>
                        </div>
                        <Badge tone={toneFor(vote.vote)}>{vote.vote}</Badge>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-alphavest-muted">{vote.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Evidence labels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedCommitteeReview.evidence.map((item) => (
                    <div className="flex items-center justify-between gap-3 border-b border-alphavest-border/45 pb-2 text-sm last:border-0" key={item.label}>
                      <span className="text-alphavest-muted">{item.label}</span>
                      <Badge tone={toneFor(item.status)}>{item.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Dissent resolution</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 lg:grid-cols-2">
                {selectedCommitteeReview.dissentItems.map((item) => (
                  <StatePanel
                    detail={`Owner: ${item.owner}`}
                    key={item.title}
                    state="blocked"
                    title={`${item.title} - ${item.status}`}
                  />
                ))}
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Committee action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatePanel detail="Approval is disabled until all votes are present, dissent is resolved and evidence is complete." state="blocked" title="Check incomplete" />
                <button className={cn(primaryButtonClass, "w-full")} disabled type="button">
                  <Vote aria-hidden="true" className="size-4" />
                  Approve committee review
                </button>
                <span className={cn(secondaryButtonClass, "w-full")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
                  <MessageSquareWarning aria-hidden="true" className="size-4" />
                  Dissent held
                </span>
                <span className={cn(secondaryButtonClass, "w-full")} data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false">
                  <ClipboardCheck aria-hidden="true" className="size-4" />
                  Evidence request held
                </span>
              </CardContent>
            </Card>
            <StatePanel
              detail="Advisor approved, but committee_approval and committee_dissent_resolved are still missing."
              state="restricted"
              title="committee review"
            />
            <Card>
              <CardHeader>
                <CardTitle>Review history</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditTimeline items={selectedCommitteeReview.timeline} />
              </CardContent>
            </Card>
            <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
                <LockKeyhole aria-hidden="true" className="size-4" />
                Compliance remains downstream
              </div>
              <p className="mt-2 text-sm leading-6 text-alphavest-muted">
                Committee review never releases advice to the client. Compliance release, evidence and permission checks still control visibility.
              </p>
            </div>
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
