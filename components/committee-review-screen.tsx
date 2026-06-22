"use client";

import {
  ClipboardCheck,
  EyeOff,
  Filter,
  Gavel,
  LockKeyhole,
  MessageSquareWarning,
  Search,
  ShieldCheck,
  UsersRound,
  Vote,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { UxHubPage } from "@/components/ux-hub-page";
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
import {
  committeeReviewRows,
  isCommitteeReviewPageId,
  selectedCommitteeReview,
  type CommitteeReviewRow,
} from "@/lib/committee-review-demo-data";
import type { ScreenRoute } from "@/lib/route-registry";

type CommitteeReviewScreenProps = {
  route: ScreenRoute;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("approved") || normalized.includes("linked") || normalized.includes("complete")) return "green";
  if (normalized.includes("critical") || normalized.includes("blocked") || normalized.includes("open")) return "red";
  if (normalized.includes("high") || normalized.includes("pending") || normalized.includes("partial") || normalized.includes("review")) return "gold";
  if (normalized.includes("none")) return "blue";
  return "muted";
}

function ProofStrip() {
  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {[
        {
          icon: ShieldCheck,
          title: "Advisor gate",
          detail: "Advisor approval is required but cannot advance high-risk advice by itself.",
        },
        {
          icon: UsersRound,
          title: "Peer review",
          detail: "High-risk cases require committee vote coverage before compliance release.",
        },
        {
          icon: MessageSquareWarning,
          title: "Dissent",
          detail: "Open dissent keeps the package blocked and visible to internal reviewers only.",
        },
        {
          icon: EyeOff,
          title: "Client visibility",
          detail: "clientVisible=false until committee, compliance, evidence and permission gates pass.",
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

const committeeColumns: Array<DataTableColumn<CommitteeReviewRow>> = [
  {
    key: "client",
    header: "Client / Recommendation",
    render: (row) => (
      <span className="font-semibold text-alphavest-ivory">
        {row.client}
        <span className="block text-xs text-alphavest-muted">{row.recommendation}</span>
      </span>
    ),
  },
  { key: "risk", header: "Risk", render: (row) => <Badge tone={toneFor(row.risk)}>{row.risk}</Badge> },
  { key: "advisorApproval", header: "Advisor", render: (row) => <Badge tone={toneFor(row.advisorApproval)}>{row.advisorApproval}</Badge> },
  { key: "committeeStatus", header: "Committee", render: (row) => <Badge tone={toneFor(row.committeeStatus)}>{row.committeeStatus}</Badge> },
  { key: "votes", header: "Votes", render: (row) => row.votes },
  { key: "dissent", header: "Dissent", render: (row) => <Badge tone={toneFor(row.dissent)}>{row.dissent}</Badge> },
  { key: "evidence", header: "Evidence", render: (row) => <Badge tone={toneFor(row.evidence)}>{row.evidence}</Badge> },
  { key: "due", header: "Due", render: (row) => <span className={row.committeeStatus === "Dissent" ? "text-alphavest-red" : ""}>{row.due}</span> },
];



type Phase5DetailSplitPanelProps = {
  decisionSupport: string;
  objectLabel: string;
  objectState: string;
  pageJob: string;
  safetyBoundary: string;
  splitTaskId?: string;
  taskId: string;
};

function Phase5DetailSplitPanel({ decisionSupport, objectLabel, objectState, pageJob, safetyBoundary, splitTaskId, taskId }: Phase5DetailSplitPanelProps) {
  return (
    <section className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/65 p-4" data-testid="ux-phase5-detail-split" data-ux-phase5-split-task={splitTaskId ?? "none"} data-ux-phase5-task={taskId}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">Phase 5 detail / split proof</p>
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
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Page job</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{pageJob}</p>
        </div>
      </div>
    </section>
  );
}

function QueuePage({ title }: { title: string }) {
  const pendingCount = committeeReviewRows.filter((row) => row.committeeStatus === "Pending").length;
  const dissentCount = committeeReviewRows.filter((row) => row.committeeStatus === "Dissent").length;
  const blockedCount = committeeReviewRows.filter((row) => row.committeeStatus === "Blocked").length;
  const visibleCount = committeeReviewRows.filter((row) => row.clientVisible).length;

  return (
    <AppShell>
      <div className="space-y-6">
        <Phase5DetailSplitPanel decisionSupport="Committee queue separates package selection from vote and dissent detail." objectLabel="Committee review split" objectState="Committee packages pending" pageJob="Committee queue routes elevated reviews without becoming final decision room." safetyBoundary="Committee queue cannot release to client or bypass compliance." splitTaskId="UX-PAGE-SPLIT-008" taskId="UX-PAGE-SPLIT-008" />
        <PageHeader
          description="Independent peer review for high-risk advisor-approved recommendations. Committee approval is a separate internal gate before compliance can consider client release."
          eyebrow="Phase E · E-03"
          title={title}
        />
        <UxHubPage pageId="070" />
        <ProofStrip />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard detail="High-risk packages waiting for committee votes." label="Pending review" status="PENDING" value={String(pendingCount)} />
          <MetricCard detail="Open dissent blocks downstream release." label="Dissent open" status={dissentCount > 0 ? "FAILED" : "COMPLETED"} value={String(dissentCount)} />
          <MetricCard detail="Advisor gate or evidence gate still incomplete." label="Blocked" status={blockedCount > 0 ? "FAILED" : "COMPLETED"} value={String(blockedCount)} />
          <MetricCard detail="Must remain zero on this route." label="Client visible" status={visibleCount === 0 ? "COMPLETED" : "FAILED"} value={String(visibleCount)} />
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]">
          <section className="space-y-5">
            <Card>
              <div className="grid gap-3 lg:grid-cols-[1fr_repeat(3,10rem)_auto]">
                <label className="relative min-w-0">
                  <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
                  <input
                    className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold"
                    placeholder="Search committee queue..."
                  />
                </label>
                {["Risk", "Vote state", "Evidence"].map((item) => (
                  <button className={secondaryButtonClass} key={item} type="button">
                    <Filter aria-hidden="true" className="size-4" />
                    {item}
                  </button>
                ))}
                <button className={primaryButtonClass} type="button">
                  <Gavel aria-hidden="true" className="size-4" />
                  Open review
                </button>
              </div>
            </Card>
            <DataTable columns={committeeColumns} getRowId={(row) => row.id} rows={committeeReviewRows} />
          </section>
          <aside className="space-y-5">
            <StatePanel
              detail="Advisor approval alone leaves high-risk recommendations blocked. Committee review adds peer votes, dissent handling and evidence labels."
              state="blocked"
              title="Second review required"
            />
            <Card>
              <CardHeader>
                <CardTitle>Selected package</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ["Committee ID", selectedCommitteeReview.id],
                  ["Recommendation", selectedCommitteeReview.recommendationId],
                  ["Advisor", selectedCommitteeReview.advisor],
                  ["Chair", selectedCommitteeReview.committeeChair],
                  ["Due", selectedCommitteeReview.due],
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
          eyebrow="Phase E · E-04"
          title={title}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard detail={selectedCommitteeReview.advisorApproval} label="Advisor gate" status="COMPLETED" value="Approved" />
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
                <StatePanel detail="Approval is disabled until all votes are present, dissent is resolved and evidence is complete." state="blocked" title="Gate incomplete" />
                <button className={cn(primaryButtonClass, "w-full")} disabled type="button">
                  <Vote aria-hidden="true" className="size-4" />
                  Approve committee review
                </button>
                <button className={cn(secondaryButtonClass, "w-full")} type="button">
                  <MessageSquareWarning aria-hidden="true" className="size-4" />
                  Record dissent
                </button>
                <button className={cn(secondaryButtonClass, "w-full")} type="button">
                  <ClipboardCheck aria-hidden="true" className="size-4" />
                  Request evidence
                </button>
              </CardContent>
            </Card>
            <StatePanel
              detail="Advisor approved, but committee_approval and committee_dissent_resolved are still missing."
              state="restricted"
              title="Committee gate proof"
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
                Committee review never releases advice to the client. Compliance release, evidence and permission gates still control visibility.
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
