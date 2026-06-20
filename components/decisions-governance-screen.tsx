"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  FileCheck2,
  FileText,
  Filter,
  Folder,
  Home,
  KeyRound,
  Landmark,
  LockKeyhole,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AuditTimeline,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Drawer,
  Modal,
  StatePanel,
  type BadgeTone,
  type DataTableColumn
} from "@/components/ui";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { cn } from "@/lib/cn";
import { runScreencastDemoAction } from "@/lib/screencast-demo-client";
import {
  accessPolicyChecks,
  accessRequests,
  complianceAuditMetrics,
  complianceAuditRows,
  complianceBlockReview,
  decisionApprovals,
  decisionOptions,
  decisionRoom,
  decisionRows,
  decisionSuccess,
  decisionsGovernancePageIds,
  decisionsMetrics,
  evidenceRecord,
  evidenceRows,
  evidenceTimeline,
  exceptionSummary,
  governanceMetrics,
  governanceUsers,
  missingEvidenceChecklist,
  requestedEvidenceItems,
  rolePermissions,
  roleRows
} from "@/lib/decisions-governance-demo-data";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import type { ScreenRoute } from "@/lib/route-registry";
import type { VisualState } from "@/lib/visual-contract";

type DecisionsGovernanceScreenProps = {
  route: ScreenRoute;
  visualState?: VisualState;
};

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  pageIds?: string[];
  count?: number;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";

const destructiveButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-red/60 bg-alphavest-red/10 px-4 text-sm font-semibold text-alphavest-red transition hover:bg-alphavest-red/16";

const decisionNav: NavItem[] = [
  { href: "/portal", icon: Home, label: "Home" },
  { href: "/client/family-members", icon: UsersRound, label: "Clients" },
  { href: "/wealth-map", icon: Landmark, label: "Wealth Map" },
  { href: "/actions", icon: CheckCircle2, label: "Actions" },
  { href: "/decisions", icon: FileCheck2, label: "Decisions", pageIds: ["043", "044", "045"], count: 3 },
  { href: "/evidence", icon: Folder, label: "Evidence Vault", pageIds: ["046", "047"] },
  { href: "/compliance", icon: ShieldCheck, label: "Compliance", pageIds: ["041", "042"] },
  { href: "/governance/users", icon: KeyRound, label: "Governance", pageIds: ["048", "049", "050"], count: 8 },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/communication", icon: MessageSquare, label: "Messages" },
  { href: "/settings", icon: SlidersHorizontal, label: "Settings" }
];

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("active") || normalized.includes("approved") || normalized.includes("complete") || normalized.includes("verified") || normalized.includes("resolved") || normalized.includes("compliant") || normalized.includes("success")) {
    return "green";
  }

  if (normalized.includes("blocked") || normalized.includes("denied") || normalized.includes("high") || normalized.includes("open") || normalized.includes("missing") || normalized.includes("restricted")) {
    return "red";
  }

  if (normalized.includes("pending") || normalized.includes("review") || normalized.includes("awaiting") || normalized.includes("required") || normalized.includes("partial") || normalized.includes("medium") || normalized.includes("custom")) {
    return "gold";
  }

  if (normalized.includes("internal") || normalized.includes("others") || normalized.includes("low") || normalized.includes("system")) {
    return "blue";
  }

  if (normalized.includes("escalated")) {
    return "purple";
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

  return <span className={cn("grid size-11 shrink-0 place-items-center rounded-md border", toneClass[tone])}>{children}</span>;
}

function ProgressBar({ tone = "gold", value }: { tone?: BadgeTone; value: number }) {
  const toneClass: Record<BadgeTone, string> = {
    blue: "bg-alphavest-blue",
    gold: "bg-alphavest-gold",
    green: "bg-alphavest-green",
    muted: "bg-alphavest-muted",
    purple: "bg-violet-300",
    red: "bg-alphavest-red",
    teal: "bg-teal-300"
  };

  return (
    <div className="h-2 rounded-full bg-alphavest-border">
      <div className={cn("h-2 rounded-full", toneClass[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}

function Phase12Sidebar({ activePageId }: { activePageId: string }) {
  return (
    <aside className="hidden min-h-screen border-r border-alphavest-border/60 bg-alphavest-navy/88 p-5 lg:flex lg:w-[var(--sidebar-width)] lg:flex-col">
      <AlphaVestMark />
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {decisionNav.map((item) => {
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
              {item.count ? <span className="rounded-full bg-alphavest-gold px-2 text-xs font-semibold text-alphavest-navy">{item.count}</span> : null}
            </a>
          );
        })}
      </nav>
      <div className="rounded-md border border-alphavest-gold/30 bg-alphavest-gold/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
          <ShieldCheck aria-hidden="true" className="size-4" />
          Controlled visibility
        </div>
        <p className="mt-2 text-xs leading-5 text-alphavest-muted">No unapproved advice reaches the client. Sensitive actions are audit logged.</p>
      </div>
    </aside>
  );
}

function Phase12TopBar() {
  const { session, setRole, setTenant } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative min-w-0 xl:w-[34rem]">
          <span className="sr-only">Search WealthOS</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          <input
            className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-10 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
            placeholder="Search decisions, evidence, users, policies..."
            type="search"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-alphavest-border px-1.5 py-0.5 text-xs text-alphavest-subtle md:block">cmd K</span>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
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

function Phase12Shell({ activePageId, children }: { activePageId: string; children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-internal av-shell-grid">
        <Phase12Sidebar activePageId={activePageId} />
        <div className="min-w-0">
          <Phase12TopBar />
          <main className="px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </DemoSessionProvider>
  );
}

function PageHeading({ action, badge, subtitle, title }: { action?: React.ReactNode; badge?: React.ReactNode; subtitle: string; title: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-3xl text-alphavest-ivory md:text-4xl">{title}</h2>
          {badge}
        </div>
        <p className="mt-1 text-sm leading-6 text-alphavest-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-alphavest-border/45 pb-2 text-sm last:border-0">
      <span className="min-w-0 text-alphavest-muted">{label}</span>
      <span className="min-w-0 break-words text-right font-semibold text-alphavest-ivory">{value}</span>
    </div>
  );
}

function ComplianceBlockPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [modalOpen, setModalOpen] = useState(visualState === "block");

  return (
    <Phase12Shell activePageId="041">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto grid max-w-[104rem] gap-5 xl:grid-cols-[19rem_1fr_19rem]">
        <aside className={cn("space-y-4", modalOpen ? "opacity-55" : "")}>
          <Card>
            <CardHeader><CardTitle>Review Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Review Type" value="Advice Review" />
              <InfoRow label="Initiated" value="Apr 17, 2025" />
              <InfoRow label="Due Date" value={complianceBlockReview.dueDate} />
              <InfoRow label="Priority" value="High" />
            </CardContent>
          </Card>
          <StatePanel detail="Advice content is not releasable." state="blocked" title="Blocked" />
          <Card>
            <CardHeader><CardTitle>Advice Visibility</CardTitle></CardHeader>
            <CardContent>
              <IconTile tone="gold"><LockKeyhole aria-hidden="true" className="size-5" /></IconTile>
              <p className="mt-3 text-sm leading-6 text-alphavest-muted">Client cannot view blocked advice. No unapproved advice reaches the client.</p>
            </CardContent>
          </Card>
        </aside>
        <section className={cn("min-w-0 space-y-5", modalOpen ? "opacity-45" : "")}>
          <PageHeading
            action={<button className={primaryButtonClass} onClick={() => setModalOpen(true)} type="button">Manage Block</button>}
            badge={<Badge tone="red">Blocked</Badge>}
            subtitle={`${complianceBlockReview.id} - ${complianceBlockReview.client} - advisor ${complianceBlockReview.advisor}`}
            title={complianceBlockReview.reviewTitle}
          />
          <div className="rounded-md border border-alphavest-border bg-alphavest-panel/70 p-4">
            <p className="text-sm text-alphavest-muted">Advice content is blocked and cannot be viewed by the client.</p>
          </div>
        </section>
        <aside className={cn("space-y-4", modalOpen ? "opacity-55" : "")}>
          <Card>
            <CardHeader><CardTitle>Review Timeline</CardTitle></CardHeader>
            <CardContent>
              <AuditTimeline items={[...complianceBlockReview.timeline]} />
            </CardContent>
          </Card>
        </aside>
      </div>
      <Modal
        className="max-w-[52rem]"
        context={
          <div className="grid gap-2 text-sm">
            <p className="font-semibold text-alphavest-ivory">Compliance block state</p>
            <p className="text-alphavest-muted">Advice remains blocked from client visibility until requested evidence is received, reviewed and released.</p>
          </div>
        }
        description="Advice remains blocked while evidence is incomplete."
        footer={
          <>
            <button className={secondaryButtonClass} onClick={() => setModalOpen(false)} type="button">Cancel</button>
            <button className={secondaryButtonClass} onClick={() => setModalOpen(false)} type="button">Keep Blocked</button>
            <button
              className={primaryButtonClass}
              data-testid="j02-confirm-request-evidence"
              onClick={() => {
                void runScreencastDemoAction("j02.confirmRequestEvidence");
              }}
              type="button"
            >
              Request Evidence
            </button>
            <button className={secondaryButtonClass} type="button">Escalate</button>
          </>
        }
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title={title}
      >
        <div className="space-y-4">
          <div className="grid gap-4 rounded-md border border-alphavest-red/45 bg-alphavest-red/12 p-4 md:grid-cols-[auto_1fr_auto]">
            <IconTile tone="red"><LockKeyhole aria-hidden="true" className="size-5" /></IconTile>
            <div>
              <p className="font-semibold uppercase text-alphavest-ivory">Status: Blocked</p>
              <p className="text-sm text-alphavest-muted">{complianceBlockReview.summary}</p>
            </div>
            <p className="text-sm font-semibold text-alphavest-ivory">No unapproved advice reaches the client.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Block Reason</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm font-semibold text-alphavest-ivory">Missing required evidence</div>
                <p className="text-sm leading-6 text-alphavest-muted">Required documentation is missing to support this advice package.</p>
                {missingEvidenceChecklist.map((item) => (
                  <p className="flex items-center gap-2 text-sm text-alphavest-muted" key={item}>
                    <CheckCircle2 aria-hidden="true" className="size-4 text-alphavest-gold" />
                    {item}
                  </p>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Requested Evidence</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {requestedEvidenceItems.map((item) => (
                  <div className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm" key={item.item}>
                    <span className="text-alphavest-ivory">{item.item}</span>
                    <Badge tone="gold">{item.required ? "Required" : "Optional"}</Badge>
                  </div>
                ))}
                <button className="text-sm font-semibold text-alphavest-gold" type="button">Add evidence item</button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Owner and Escalation</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Assigned owner" value={complianceBlockReview.owner} />
                <InfoRow label="Response due" value={complianceBlockReview.dueDate} />
                <InfoRow label="Escalation status" value="Not escalated" />
                <StatePanel detail="Request will be sent to the assigned owner. Release remains blocked until evidence is received and approved." state="restricted" title="What happens next?" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Modal>
    </Phase12Shell>
  );
}

const complianceAuditColumns: Array<DataTableColumn<(typeof complianceAuditRows)[number]>> = [
  { key: "timestamp", header: "Timestamp", render: (row) => row.timestamp },
  { key: "event", header: "Event Type", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.event}</span> },
  { key: "status", header: "Exception Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
  { key: "severity", header: "Severity", render: (row) => <Badge tone={toneFor(row.severity)}>{row.severity}</Badge> },
  { key: "actor", header: "Actor", render: (row) => row.actor },
  { key: "client", header: "Client", render: (row) => row.client },
  { key: "policy", header: "Policy / Rule", render: (row) => row.policy },
  { key: "source", header: "Source", render: (row) => row.source }
];

function ComplianceAuditPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="042">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto grid max-w-[112rem] gap-5 2xl:grid-cols-[1fr_20rem]">
        <section className="min-w-0 space-y-5">
          <PageHeading subtitle="Compliance decision, exception and resolution activity for audit review." title={title} />
          <div className="grid gap-3 md:grid-cols-4">
            {complianceAuditMetrics.map((metric) => (
              <Card key={metric.label}>
                <div className="flex items-center gap-4">
                  <IconTile tone={toneFor(metric.label)}>{metric.label === "Open Exceptions" ? <AlertTriangle aria-hidden="true" className="size-5" /> : <FileCheck2 aria-hidden="true" className="size-5" />}</IconTile>
                  <div>
                    <p className="text-3xl font-semibold text-alphavest-ivory">{metric.value}</p>
                    <p className="text-sm text-alphavest-muted">{metric.label}</p>
                    <p className="text-xs text-alphavest-subtle">{metric.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <FilterPanel filters={["Date range", "Event type", "Exception status", "Policy / rule", "Actor", "Client", "Severity", "Source"]} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-alphavest-muted">12,842 results</p>
            <div className="flex gap-3">
              <button
                className={secondaryButtonClass}
                data-testid="j02-export-controlled"
                onClick={() => {
                  void runScreencastDemoAction("j02.exportControlled");
                }}
                type="button"
              >
                <LockKeyhole aria-hidden="true" className="size-4" />Export Controlled
              </button>
              <button className={secondaryButtonClass} type="button">Column Settings</button>
            </div>
          </div>
          <DataTable columns={complianceAuditColumns} getRowId={(row) => `${row.timestamp}-${row.event}`} rows={complianceAuditRows} />
        </section>
        <aside className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Exception Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid size-28 place-items-center rounded-full border-8 border-alphavest-gold/70 text-center">
                <div><p className="text-3xl font-semibold text-alphavest-ivory">27</p><p className="text-xs text-alphavest-muted">Open</p></div>
              </div>
              {exceptionSummary.map((item) => (
                <InfoRow key={item.label} label={item.label} value={String(item.value)} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Resolution Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Resolved" value="184" />
              <InfoRow label="Auto-resolved" value="96" />
              <InfoRow label="Manual" value="88" />
              <InfoRow label="Avg. time" value="2.6 days" />
            </CardContent>
          </Card>
          <StatePanel detail="Exports require security controls and audit confirmation before they can proceed." state="restricted" title="Export controlled" />
        </aside>
      </div>
    </Phase12Shell>
  );
}

function FilterPanel({ filters }: { filters: string[] }) {
  return (
    <div className="grid gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 md:grid-cols-2 xl:grid-cols-4">
      {filters.map((filter) => (
        <button className="flex h-11 items-center justify-between gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted" key={filter} type="button">
          <span>{filter}</span>
          <ChevronDown aria-hidden="true" className="size-4" />
        </button>
      ))}
      <button className={primaryButtonClass} type="button">Apply Filters</button>
    </div>
  );
}

const decisionColumns: Array<DataTableColumn<(typeof decisionRows)[number]>> = [
  { key: "title", header: "Title", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.title}<span className="block text-xs text-alphavest-muted">{row.updated}</span></span> },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
  { key: "stage", header: "Approval Stage", render: (row) => row.stage },
  { key: "due", header: "Due Date", render: (row) => <span className={row.owner === "You" ? "text-alphavest-gold" : ""}>{row.due}</span> },
  { key: "category", header: "Category", render: (row) => <Badge tone="muted">{row.category}</Badge> },
  { key: "owner", header: "Needs Action From", render: (row) => row.owner }
];

function DecisionsListPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="043">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto max-w-[104rem] space-y-5">
        <PageHeading
          action={<button className={secondaryButtonClass} type="button"><ShieldCheck aria-hidden="true" className="size-4" />Learn about Decisions</button>}
          subtitle="Review and act on decisions that require your attention."
          title={title}
        />
        <div className="grid gap-3 lg:grid-cols-[1fr_repeat(4,10rem)_auto]">
          <label className="relative min-w-0">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            <input className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold" placeholder="Search decisions..." />
          </label>
          {["Status", "Approval Stage", "Category", "Needs Action"].map((filter) => (
            <button className="flex h-11 items-center justify-between rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted" key={filter} type="button">{filter}<ChevronDown aria-hidden="true" className="size-4" /></button>
          ))}
          <button className={secondaryButtonClass} type="button"><Filter aria-hidden="true" className="size-4" />Filters</button>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {decisionsMetrics.map((metric) => (
            <Card key={metric.label}>
              <div className="flex items-center gap-4">
                <IconTile tone={toneFor(metric.label)}><FileCheck2 aria-hidden="true" className="size-5" /></IconTile>
                <div>
                  <p className="text-3xl font-semibold text-alphavest-ivory">{metric.value}</p>
                  <p className="text-sm text-alphavest-muted">{metric.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <DataTable columns={decisionColumns} getRowId={(row) => row.title} rows={decisionRows} />
        <div className="grid gap-5 lg:grid-cols-3">
          <StatePanel detail="There are no decisions that match the current filters." state="empty" title="No decisions found" />
          <StatePanel detail="Rows are being prepared for this workspace." state="loading" title="Loading decisions" />
          <StatePanel detail="You do not have permission to view restricted decisions." state="restricted" title="Restricted" />
        </div>
      </div>
    </Phase12Shell>
  );
}

function DecisionRoomPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="044">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto max-w-[112rem] space-y-5">
        <PageHeading
          action={<button className={secondaryButtonClass} type="button">View Release Workflow</button>}
          badge={<Badge tone="gold">Ready to Decide</Badge>}
          subtitle={`${decisionRoom.decisionId} - ${decisionRoom.client}`}
          title={title}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_18rem]">
          <section className="min-w-0 space-y-5">
            <StatePanel detail="Until released, this decision and related materials are confidential and not visible to the client. No unapproved advice reaches the client." state="restricted" title="Content is client-visible only after Compliance Release" />
            <Card>
              <CardHeader><CardTitle>{decisionRoom.title}</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-5">
                <InfoRow label="Client" value={decisionRoom.client} />
                <InfoRow label="Portfolio" value={decisionRoom.portfolio} />
                <InfoRow label="Decision Owner" value={decisionRoom.owner} />
                <InfoRow label="Due Date" value={decisionRoom.dueDate} />
                <InfoRow label="Impact" value={decisionRoom.impact} />
              </CardContent>
            </Card>
            <div className="grid gap-5 xl:grid-cols-[1fr_0.65fr]">
              <Card>
                <CardHeader><CardTitle>Situation Summary</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-alphavest-muted">{decisionRoom.summary}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-5">
                    {["Current allocation: see analysis", "Target allocation: option 1", "Impact: +0.35% return", "Turnover: 18%", "Recommendation: option 1"].map((item) => <Badge key={item} tone="gold">{item}</Badge>)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Risks</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Market Risk", "Medium-High", 82],
                    ["Interest Rate Risk", "Medium", 58],
                    ["Liquidity Risk", "Medium", 52],
                    ["Concentration Risk", "Low-Medium", 36]
                  ].map(([label, value, progress]) => (
                    <div className="grid grid-cols-[1fr_7rem] items-center gap-3 text-sm" key={label}>
                      <span className="text-alphavest-muted">{label}</span>
                      <div><p className="text-alphavest-gold">{value}</p><ProgressBar value={Number(progress)} /></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle>Options</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {decisionOptions.map((option) => (
                  <div className={cn("grid gap-3 rounded-md border p-3 text-sm md:grid-cols-[1fr_1.4fr_repeat(3,6rem)]", option.recommended ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35")} key={option.label}>
                    <span className="font-semibold text-alphavest-ivory">{option.label}{option.recommended ? <span className="block text-xs text-alphavest-gold">Recommended</span> : null}</span>
                    <span className="text-alphavest-muted">{option.description}</span>
                    <span className="text-alphavest-green">{option.estimatedReturn}</span>
                    <span>{option.risk}</span>
                    <span>{option.turnover}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Decision Actions</CardTitle></CardHeader>
              <CardContent className="grid gap-3 lg:grid-cols-4">
                <button
                  className={secondaryButtonClass}
                  data-testid="j03-request-more-information"
                  onClick={() => {
                    void runScreencastDemoAction("j03.requestMoreInformation");
                  }}
                  type="button"
                >
                  <MessageSquare aria-hidden="true" className="size-4" />Request More Information
                </button>
                <button
                  className={secondaryButtonClass}
                  data-testid="j03-defer-decision"
                  onClick={() => {
                    void runScreencastDemoAction("j03.deferDecision");
                  }}
                  type="button"
                >
                  <Calendar aria-hidden="true" className="size-4" />Defer
                </button>
                <button
                  className={destructiveButtonClass}
                  data-testid="j03-reject-decision"
                  onClick={() => {
                    void runScreencastDemoAction("j03.rejectDecision");
                  }}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />Reject
                </button>
                <button
                  className={primaryButtonClass}
                  data-testid="j03-accept-option"
                  onClick={() => {
                    void runScreencastDemoAction("j03.acceptOption", "/decisions/demo/success");
                  }}
                  type="button"
                >
                  <Check aria-hidden="true" className="size-4" />Accept Option 1
                </button>
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-5">
            <StatePanel detail="Your permissions or approval role may restrict access or actions." state="restricted" title="Access may be blocked" />
            <Card>
              <CardHeader><CardTitle>Linked Documents</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Investment committee memo", "Portfolio analysis report", "Risk assessment report", "Cash flow forecast"].map((item) => <p className="text-sm text-alphavest-muted" key={item}>{item}</p>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Approvals</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {decisionApprovals.map((approval) => (
                  <div className="flex items-center justify-between gap-3 text-sm" key={approval.actor}>
                    <span className="text-alphavest-muted">{approval.actor}<span className="block text-xs">{approval.role}</span></span>
                    <Badge tone="green">{approval.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </Phase12Shell>
  );
}

function DecisionSuccessPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="045">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto max-w-[92rem] space-y-6">
        <section className="grid gap-6 lg:grid-cols-[14rem_1fr]">
          <div className="grid size-40 place-items-center rounded-full border border-alphavest-gold/45 bg-alphavest-green/10">
            <Check aria-hidden="true" className="size-20 text-alphavest-gold" />
          </div>
          <div>
            <h2 className="font-display text-5xl text-alphavest-ivory">{title}</h2>
            <p className="mt-2 text-lg text-alphavest-gold">The decision has been recorded for review. Audit persistence remains a controlled gate.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <InfoRow label="Decision ID" value={decisionSuccess.decisionId} />
              <InfoRow label="Client" value={decisionSuccess.client} />
              <InfoRow label="Submitted By" value={decisionSuccess.submittedBy} />
              <InfoRow label="Submitted On" value={decisionSuccess.submittedOn} />
            </div>
          </div>
        </section>
        <Card className="border-alphavest-gold/45 bg-alphavest-green/10">
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-2xl text-alphavest-ivory">Recorded for Review</p>
              <p className="mt-2 text-sm leading-6 text-alphavest-muted">This screen confirms the decision event only. Later audit checks must prove final persistence and immutability.</p>
            </div>
            <Badge tone="gold">Audit gate pending</Badge>
          </CardContent>
        </Card>
        <div className="grid gap-5 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Evidence Package Queued</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-alphavest-muted">An evidence package reference has been queued for this decision. Evidence sufficiency still requires review and release gates.</p>
              <p className="mt-6 text-xl font-semibold text-alphavest-ivory">{decisionSuccess.evidenceId}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Review Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Next Review" value={decisionSuccess.nextReview} />
              <InfoRow label="Review Cadence" value="Annually" />
              <InfoRow label="Reviewer" value={decisionSuccess.reviewer} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Decision Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Decision Type" value={decisionSuccess.type} />
              <InfoRow label="Scope" value="Portfolio Level" />
              <InfoRow label="Impact" value="Moderate" />
              <InfoRow label="Status" value="Active" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-2xl text-alphavest-ivory">Next Steps</p>
              <p className="text-sm text-alphavest-muted">Continue working or return to the Decisions list.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className={secondaryButtonClass} type="button">Return to Decisions</button>
              <button
                className={primaryButtonClass}
                data-testid="j03-view-evidence-record"
                onClick={() => {
                  void runScreencastDemoAction("j03.viewEvidenceRecord", "/evidence/demo");
                }}
                type="button"
              >
                View Evidence Record
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Phase12Shell>
  );
}

const evidenceColumns: Array<DataTableColumn<(typeof evidenceRows)[number]>> = [
  { key: "title", header: "Evidence", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.title}<span className="block text-xs text-alphavest-muted">{row.type}</span></span> },
  { key: "client", header: "Client / Account", render: (row) => row.client },
  { key: "category", header: "Category", render: (row) => <Badge tone="gold">{row.category}</Badge> },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
  { key: "updated", header: "Updated", render: (row) => row.updated }
];

function EvidenceVaultPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer");

  return (
    <Phase12Shell activePageId="046">
      <ScreenTitle>{title}</ScreenTitle>
      <div className={cn("mx-auto max-w-[104rem] space-y-5", drawerOpen ? "pr-0 xl:pr-[23rem]" : "")}>
        <PageHeading
          action={<button className={primaryButtonClass} onClick={() => setDrawerOpen(true)} type="button">Open Selected Evidence</button>}
          badge={<ShieldCheck aria-hidden="true" className="size-5 text-alphavest-gold" />}
          subtitle="Secure, role-based repository for client evidence and attestations."
          title={title}
        />
        <div className="flex flex-wrap gap-2 border-b border-alphavest-border/70">
          {["All Evidence", "By Category", "Expiring Soon 12", "Needs Review 5"].map((tab, index) => (
            <span className={cn("px-3 pb-3 text-sm font-semibold", index === 0 ? "border-b-2 border-alphavest-gold text-alphavest-gold" : "text-alphavest-muted")} key={tab}>{tab}</span>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[minmax(14rem,1fr)_repeat(4,minmax(9rem,10rem))_auto]">
          <label className="relative min-w-0 sm:col-span-2 lg:col-span-1">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            <input className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold" placeholder="Search evidence..." />
          </label>
          {["Category", "Evidence Type", "Status", "Date Range"].map((filter) => (
            <button className="flex h-11 min-w-0 items-center justify-between gap-3 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-muted" key={filter} type="button">
              <span className="truncate">{filter}</span>
              <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
            </button>
          ))}
          <button className={secondaryButtonClass} type="button"><Filter aria-hidden="true" className="size-4" />Filters</button>
        </div>
        <DataTable columns={evidenceColumns} getRowId={(row) => row.title} rows={evidenceRows} />
      </div>
      <Drawer
        description="Verified form assessment."
        footer={<button className={primaryButtonClass + " w-full"} type="button"><Download aria-hidden="true" className="size-4" />Download</button>}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        title="Risk Tolerance Questionnaire"
      >
        <div className="space-y-5">
          <StatePanel detail="Internal and advisor visibility only. Not shared with client." state="restricted" title="Controlled visibility" />
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Client / Account" value="Johnson Family" />
              <InfoRow label="Category" value="Suitability" />
              <InfoRow label="Evidence Type" value="Form assessment" />
              <InfoRow label="Date Completed" value="May 13, 2025" />
              <InfoRow label="Next Review" value="May 13, 2026" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Linked Documents</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Investment policy statement", "Client profile - Johnson Family"].map((item) => <p className="text-sm text-alphavest-muted" key={item}>{item}</p>)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Access</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Owners" value="AC, SL, +1" />
              <InfoRow label="Internal roles" value="Advisors, Compliance" />
              <InfoRow label="Client visibility" value="Advisors and internal only" />
            </CardContent>
          </Card>
        </div>
      </Drawer>
    </Phase12Shell>
  );
}

function EvidenceRecordDetailPage({ title }: { title: string }) {
  return (
    <Phase12Shell activePageId="047">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mx-auto max-w-[112rem] space-y-5">
        <PageHeading
          action={<div className="flex flex-wrap gap-3"><button className={secondaryButtonClass} type="button">Open</button><button className={secondaryButtonClass} data-testid="j03-download-evidence" onClick={() => { void runScreencastDemoAction("j03.downloadEvidence"); }} type="button">Download</button><button className={primaryButtonClass} type="button">Share</button></div>}
          badge={<Badge tone="green">Verified</Badge>}
          subtitle="Complete evidence record with provenance, access and audit information."
          title={title}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_18rem]">
          <section className="space-y-5">
            <Card>
              <CardContent className="grid gap-5 md:grid-cols-[9rem_1fr_1fr_1fr]">
                <IconTile tone="red"><FileText aria-hidden="true" className="size-7" /></IconTile>
                <div>
                  <p className="font-display text-2xl text-alphavest-ivory">{evidenceRecord.title}</p>
                  <p className="mt-1 text-sm text-alphavest-muted">Quarterly consolidated statement for AlphaVest managed accounts.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Client Statements", "Financial Statement", "Q1 2024", "Confidential"].map((tag) => <Badge key={tag} tone="muted">{tag}</Badge>)}
                  </div>
                </div>
                <div className="space-y-3">
                  <InfoRow label="Evidence ID" value={evidenceRecord.evidenceId} />
                  <InfoRow label="Version" value={evidenceRecord.version} />
                  <InfoRow label="Status" value="Active" />
                  <InfoRow label="Owner" value={evidenceRecord.owner} />
                </div>
                <div className="space-y-3">
                  <InfoRow label="Client" value={evidenceRecord.client} />
                  <InfoRow label="Related Decision" value={evidenceRecord.relatedDecision} />
                  <InfoRow label="Created" value={evidenceRecord.created} />
                  <InfoRow label="Last Updated" value="May 02, 2024 11:23 AM" />
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-5 xl:grid-cols-[0.85fr_0.95fr_1.1fr]">
              <Card>
                <CardHeader><CardTitle>Evidence Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="Evidence Type" value="Financial Statement" />
                  <InfoRow label="Source" value="AlphaVest PMS" />
                  <InfoRow label="Pages" value="12" />
                  <InfoRow label="Integrity" value={evidenceRecord.integrity} />
                  <InfoRow label="Retention Policy" value={evidenceRecord.retention} />
                </CardContent>
              </Card>
              <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent>
                  <AuditTimeline items={[...evidenceTimeline]} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] rounded-md border border-alphavest-border bg-alphavest-ivory p-6 text-alphavest-navy">
                    <p className="font-display text-2xl">AlphaVest</p>
                    <p className="mt-6 text-sm font-semibold">Client Statement Q1 2024</p>
                    <div className="mt-5 space-y-2 text-xs">
                      {["Portfolio overview", "Total market value", "Quarterly change", "Asset allocation"].map((line) => <div className="rounded bg-slate-200 px-3 py-2" key={line}>{line}</div>)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          <aside className="space-y-5">
            <StatePanel detail="Only authorized users and roles can access this evidence." state="restricted" title="Access and Permissions" />
            <Card>
              <CardHeader><CardTitle>At a Glance</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Access Events" value="15" />
                <InfoRow label="Linked Decisions" value="2" />
                <InfoRow label="Audit Events" value="23" />
                <InfoRow label="Version" value={evidenceRecord.version} />
                <InfoRow label="Classification" value="Confidential" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {["Revoke Access", "Add to Collection", "Create New Version", "Request Review"].map((item) => <button className={secondaryButtonClass + " w-full justify-start"} key={item} type="button">{item}</button>)}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </Phase12Shell>
  );
}

const userColumns: Array<DataTableColumn<(typeof governanceUsers)[number]>> = [
  { key: "name", header: "User", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.name}<span className="block text-xs text-alphavest-muted">{row.email}</span></span> },
  { key: "role", header: "Role(s)", render: (row) => row.role },
  { key: "access", header: "Entity Access", render: (row) => row.access },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
  { key: "lastActive", header: "Last Active", render: (row) => row.lastActive },
  { key: "mfa", header: "MFA", render: (row) => <Badge tone={toneFor(row.mfa)}>{row.mfa}</Badge> }
];

function GovernanceUsersPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer" || visualState === "invite");

  return (
    <Phase12Shell activePageId="048">
      <ScreenTitle>{title}</ScreenTitle>
      <div className={cn("mx-auto max-w-[104rem] space-y-5", drawerOpen ? "pr-0 xl:pr-[23rem]" : "")}>
        <PageHeading
          action={
            <button
              className={primaryButtonClass}
              data-testid="j07-invite-user"
              onClick={() => {
                void runScreencastDemoAction("j07.inviteUser");
                setDrawerOpen(true);
              }}
              type="button"
            >
              <Plus aria-hidden="true" className="size-4" />Invite User
            </button>
          }
          subtitle="Manage platform access, roles and user permissions."
          title={title}
        />
        <div className="grid gap-3 md:grid-cols-5">
          {governanceMetrics.map((metric) => (
            <Card key={metric.label}>
              <p className="text-sm text-alphavest-muted">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-alphavest-ivory">{metric.value}</p>
              <p className="text-xs text-alphavest-subtle">{metric.detail}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-panel/55 p-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative min-w-0">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            <input className="h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 pl-10 pr-3 text-sm outline-none focus:border-alphavest-gold" placeholder="Search users by name or email..." />
          </label>
          <button className={secondaryButtonClass} type="button"><Filter aria-hidden="true" className="size-4" />Filters</button>
          <button className={secondaryButtonClass} type="button"><Download aria-hidden="true" className="size-4" />Export</button>
        </div>
        <DataTable columns={userColumns} getRowId={(row) => row.email} rows={governanceUsers} />
      </div>
      <Drawer
        description="Invite a user and assign scoped roles."
        footer={<div className="grid gap-3 sm:grid-cols-2"><button className={secondaryButtonClass} onClick={() => setDrawerOpen(false)} type="button">Cancel</button><button className={primaryButtonClass} data-testid="j07-send-invitation" onClick={() => { void runScreencastDemoAction("j07.sendInvitation", "/governance/roles?state=confirm"); }} type="button"><Send aria-hidden="true" className="size-4" />Send Invitation</button></div>}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        title="Invite New User"
      >
        <div className="space-y-5">
          <Field label="Full Name" value="Alex Morgan" />
          <Field label="Email Address" value="alex.morgan@example.test" />
          <Card>
            <CardHeader><CardTitle>Assign Roles</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Investment Manager", "Analyst"].map((role, index) => (
                <div className={cn("rounded-md border p-4", index === 0 ? "border-alphavest-gold bg-alphavest-gold/10" : "border-alphavest-border bg-alphavest-navy/35")} key={role}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-alphavest-ivory">{role}</p>
                    <Badge tone={index === 0 ? "gold" : "muted"}>{index === 0 ? "Sensitive" : "Optional"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-alphavest-muted">{index === 0 ? "Can manage investments, view performance and execute transactions." : "Can view data, run reports and perform analysis."}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <StatePanel detail="This role grants access to sensitive investment and transaction capabilities. Changes are monitored and audited." state="restricted" title="Sensitive access" />
        </div>
      </Drawer>
    </Phase12Shell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-alphavest-muted">{label}</span>
      <input className="mt-2 h-11 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" readOnly value={value} />
    </label>
  );
}

function RoleManagementPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer" || visualState === "confirm");
  const [modalOpen, setModalOpen] = useState(visualState === "confirm");

  return (
    <Phase12Shell activePageId="049">
      <ScreenTitle>{title}</ScreenTitle>
      <div className={cn("mx-auto max-w-[104rem] space-y-5", drawerOpen ? "pr-0 xl:pr-[23rem]" : "")}>
        <PageHeading
          action={<button className={primaryButtonClass} onClick={() => setDrawerOpen(true)} type="button"><Plus aria-hidden="true" className="size-4" />Create Role</button>}
          subtitle="Define roles and manage permissions across WealthOS."
          title={title}
        />
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Total Roles", "12", "Active roles"],
            ["Custom Roles", "7", "Configured by you"],
            ["Sensitive Permissions", "18", "Across 5 roles"],
            ["Last Updated", "May 12, 2025", "By Sofia Shah"]
          ].map(([label, value, detail]) => (
            <Card key={label}><p className="text-sm text-alphavest-muted">{label}</p><p className="mt-2 text-2xl font-semibold text-alphavest-ivory">{value}</p><p className="text-xs text-alphavest-subtle">{detail}</p></Card>
          ))}
        </div>
        <RoleMatrix />
      </div>
      <Drawer
        description="Custom role with sensitive permission changes."
        footer={<div className="grid gap-3 sm:grid-cols-2"><button className={secondaryButtonClass} onClick={() => setDrawerOpen(false)} type="button">Discard Changes</button><button className={primaryButtonClass} onClick={() => setModalOpen(true)} type="button">Save Changes</button></div>}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        title="Portfolio Manager"
      >
        <div className="space-y-5">
          <StatePanel detail="Changes to sensitive permissions require additional confirmation." state="restricted" title="Sensitive permission change" />
          {rolePermissions.map((group) => (
            <Card key={group.group}>
              <CardHeader><CardTitle>{group.group}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {group.permissions.map((permission, index) => (
                  <div className="flex items-center justify-between gap-3 text-sm" key={permission}>
                    <span className="text-alphavest-muted">{permission}</span>
                    <Badge tone={index < 2 ? "green" : index === 2 ? "muted" : "gold"}>{index < 2 ? "Full" : index === 2 ? "None" : "Partial"}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
          <p className="text-sm font-semibold text-alphavest-gold">3 sensitive changes</p>
        </div>
      </Drawer>
      <Modal
        className="max-w-[34rem]"
        context={
          <div className="grid gap-2 text-sm">
            <p className="font-semibold text-alphavest-ivory">Portfolio Manager role</p>
            <p className="text-alphavest-muted">Second confirmation protects sensitive permissions, transaction access and client privacy.</p>
          </div>
        }
        description="You are about to save changes that modify sensitive permissions."
        footer={<><button className={secondaryButtonClass} onClick={() => setModalOpen(false)} type="button">Cancel</button><button className={primaryButtonClass} data-testid="j07-save-role-changes" onClick={() => { void runScreencastDemoAction("j07.saveRoleChanges", "/governance/access-requests?state=approval"); }} type="button">Confirm and Save Changes</button></>}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title="Confirm Sensitive Permission Changes"
      >
        <div className="space-y-4">
          <StatePanel detail="This action may impact data access, transactions and client privacy." state="restricted" title="Second confirmation required" />
          <div className="rounded-md border border-alphavest-border bg-alphavest-navy/35 p-4 text-sm text-alphavest-muted">
            <p>3 sensitive permissions modified.</p>
            <p>Affects 7 users across 2 teams.</p>
            <p>This change requires audit logging before it can be accepted.</p>
          </div>
          <Field label="Confirmation phrase" value="PORTFOLIO MANAGER" />
        </div>
      </Modal>
    </Phase12Shell>
  );
}

function RoleMatrix() {
  return (
    <div className="overflow-x-auto rounded-md border border-alphavest-border/70">
      <table className="w-full min-w-[62rem] table-fixed border-collapse text-left text-sm">
        <thead className="bg-alphavest-panel/75 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">
          <tr>
            {["Role", "Clients", "Accounts", "Investments", "Trading", "Reporting", "Billing"].map((header) => <th className="h-10 border-b border-alphavest-border/70 px-4" key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {roleRows.map((row, index) => (
            <tr className={cn("h-[var(--table-row-height)] border-b border-alphavest-border/55 last:border-0", index === 1 ? "bg-alphavest-gold/10" : "")} key={row.role}>
              <td className="px-4 py-3 font-semibold text-alphavest-ivory">{row.role}<Badge className="ml-2" tone={toneFor(row.type)}>{row.type}</Badge></td>
              {[row.clients, row.accounts, row.investments, row.trading, row.reporting, row.billing].map((value, valueIndex) => <td className="px-4 py-3" key={`${row.role}-${valueIndex}`}><Badge tone={toneFor(value)}>{value}</Badge></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const accessColumns: Array<DataTableColumn<(typeof accessRequests)[number]>> = [
  { key: "access", header: "Request", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.access}<span className="block text-xs text-alphavest-muted">{row.type}</span></span> },
  { key: "requester", header: "Requester", render: (row) => row.requester },
  { key: "type", header: "Requested Access", render: (row) => row.type },
  { key: "scope", header: "Affected Scope", render: (row) => row.scope },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
  { key: "submitted", header: "Requested", render: (row) => row.submitted }
];

function AccessRequestsPage({ title, visualState }: { title: string; visualState?: VisualState }) {
  const [drawerOpen, setDrawerOpen] = useState(visualState === "drawer" || visualState === "approval");

  return (
    <Phase12Shell activePageId="050">
      <ScreenTitle>{title}</ScreenTitle>
      <div className={cn("mx-auto max-w-[104rem] space-y-5", drawerOpen ? "pr-0 xl:pr-[23rem]" : "")}>
        <PageHeading
          action={<button className={primaryButtonClass} onClick={() => setDrawerOpen(true)} type="button">Review Selected Request</button>}
          subtitle="Review and take action on access requests across the organization."
          title={title}
        />
        <div className="flex flex-wrap gap-2">
          {["All 24", "Pending 8", "Approved 11", "Denied 3", "Escalated 2"].map((item, index) => <Badge key={item} tone={index === 0 ? "gold" : toneFor(item)}>{item}</Badge>)}
          <button className={secondaryButtonClass + " ml-auto"} type="button"><Filter aria-hidden="true" className="size-4" />Filters</button>
        </div>
        <DataTable columns={accessColumns} getRowId={(row) => `${row.requester}-${row.access}`} rows={accessRequests} />
      </div>
      <Drawer
        description="Review access request, policy checks and decision."
        footer={<div className="grid gap-3 sm:grid-cols-3"><button className={secondaryButtonClass} onClick={() => setDrawerOpen(false)} type="button">Escalate</button><button className={destructiveButtonClass} onClick={() => setDrawerOpen(false)} type="button">Deny</button><button className={primaryButtonClass} data-testid="j07-approve-access" onClick={() => { void runScreencastDemoAction("j07.approveAccess", "/governance/audit-history?state=drawer"); }} type="button">Approve</button></div>}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        title="AR-2025-0612"
      >
        <div className="space-y-5">
          <Badge tone="gold">Pending</Badge>
          <Card>
            <CardHeader><CardTitle>Request Reason</CardTitle></CardHeader>
            <CardContent><p className="text-sm leading-6 text-alphavest-muted">Need visibility into client performance to prepare quarterly review materials for the investment committee.</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Requested Access</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Access Type" value="View" />
              <InfoRow label="Resource" value="Client Performance" />
              <InfoRow label="Permissions" value="View performance, returns and holdings summary" />
              <InfoRow label="Justification" value="Prepare quarterly analysis" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Policy and SOD Checks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {accessPolicyChecks.map((check) => (
                <div className="flex items-center justify-between gap-3 text-sm" key={check.label}>
                  <span className="text-alphavest-muted">{check.label}</span>
                  <Badge tone={toneFor(check.result)}>{check.result}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <label className="block">
            <span className="text-sm font-semibold text-alphavest-muted">Decision comment</span>
            <textarea className="mt-2 min-h-24 w-full rounded-md border border-alphavest-border bg-alphavest-navy/35 p-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold" placeholder="Add a comment..." />
          </label>
        </div>
      </Drawer>
    </Phase12Shell>
  );
}

export function DecisionsGovernanceScreen({ route, visualState }: DecisionsGovernanceScreenProps) {
  if (!decisionsGovernancePageIds.includes(route.pageId as (typeof decisionsGovernancePageIds)[number])) {
    return null;
  }

  switch (route.pageId) {
    case "041":
      return <ComplianceBlockPage title={route.title} visualState={visualState} />;
    case "042":
      return <ComplianceAuditPage title={route.title} />;
    case "043":
      return <DecisionsListPage title={route.title} />;
    case "044":
      return <DecisionRoomPage title={route.title} />;
    case "045":
      return <DecisionSuccessPage title={route.title} />;
    case "046":
      return <EvidenceVaultPage title={route.title} visualState={visualState} />;
    case "047":
      return <EvidenceRecordDetailPage title={route.title} />;
    case "048":
      return <GovernanceUsersPage title={route.title} visualState={visualState} />;
    case "049":
      return <RoleManagementPage title={route.title} visualState={visualState} />;
    case "050":
      return <AccessRequestsPage title={route.title} visualState={visualState} />;
    default:
      return null;
  }
}
