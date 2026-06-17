"use client";

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Flag,
  LockKeyhole,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import {
  AuditTimeline,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  EvidenceList,
  MetricCard,
  StatePanel,
  WizardStepper,
  type BadgeTone,
  type DataTableColumn,
} from "@/components/ui";
import { DemoSessionProvider, useDemoSession } from "@/components/demo-session-provider";
import { cn } from "@/lib/cn";
import {
  amlChecks,
  identityChecks,
  kycAmlPageIds,
  kycAuditItems,
  kycCase,
  kycEvidenceItems,
  kycWorkflowSteps,
  sourceDocuments,
  sourceOfWealthTrail,
  sourceRiskFindings,
} from "@/lib/kyc-aml-demo-data";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import type { ScreenRoute } from "@/lib/route-registry";
import { runScreencastDemoAction } from "@/lib/screencast-demo-client";

type KycAmlWorkflowScreenProps = {
  route: ScreenRoute;
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
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const kycNav: NavItem[] = [
  { href: "/signals", icon: ShieldAlert, label: "Signals" },
  { href: "/workbench/triggers/demo", icon: Flag, label: "Triggers", count: 12 },
  { href: "/documents/extraction-review", icon: FileCheck2, label: "Extraction review" },
  { href: "/kyc/demo/review", icon: UserCheck, label: "KYC review", pageIds: ["064"], count: 3 },
  { href: "/kyc/demo/source-of-wealth", icon: WalletCards, label: "Source of wealth", pageIds: ["065"], count: 2 },
  { href: "/compliance", icon: ShieldCheck, label: "Compliance" },
];

function toneFor(value: string): BadgeTone {
  const normalized = value.toLowerCase();

  if (normalized.includes("verified") || normalized.includes("cleared") || normalized.includes("linked") || normalized.includes("complete")) {
    return "green";
  }

  if (normalized.includes("high") || normalized.includes("missing") || normalized.includes("open") || normalized.includes("escalated") || normalized.includes("blocked")) {
    return "red";
  }

  if (normalized.includes("review") || normalized.includes("medium") || normalized.includes("partial") || normalized.includes("needs")) {
    return "gold";
  }

  if (normalized.includes("low") || normalized.includes("created")) {
    return "blue";
  }

  return "muted";
}

function confidenceTone(value: string): BadgeTone {
  if (value === "High") {
    return "green";
  }

  if (value === "Medium") {
    return "gold";
  }

  if (value === "Low") {
    return "red";
  }

  return toneFor(value);
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

function KycSidebar({ activePageId }: { activePageId: string }) {
  return (
    <aside className="hidden min-h-screen border-r border-alphavest-border/60 bg-alphavest-navy/88 p-5 lg:flex lg:w-[var(--sidebar-width)] lg:flex-col">
      <AlphaVestMark />
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {kycNav.map((item) => {
          const Icon = item.icon;
          const active = item.pageIds?.includes(activePageId);

          return (
            <a
              className={cn(
                "flex h-10 items-center gap-3 rounded-md border px-3 text-sm transition",
                active
                  ? "border-alphavest-gold/45 bg-alphavest-gold/12 text-alphavest-gold-soft"
                  : "border-transparent text-alphavest-muted hover:border-alphavest-border hover:bg-alphavest-panel/65 hover:text-alphavest-ivory",
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
          <LockKeyhole aria-hidden="true" className="size-4" />
          Internal Only
        </div>
        <p className="mt-2 text-xs leading-5 text-alphavest-muted">KYC review stays hidden from clients until compliance release gates pass.</p>
      </div>
    </aside>
  );
}

function KycTopBar() {
  const { session, setRole, setTenant } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-20 px-4 py-3 md:px-6">
      <div className="flex min-h-12 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative min-w-0 xl:w-[34rem]">
          <span className="sr-only">Search KYC workspace</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          <input
            className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-10 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
            placeholder="Search KYC cases, evidence, owners..."
            type="search"
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <select
            aria-label="Tenant context"
            className="h-10 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold sm:w-64"
            onChange={(event) => setTenant(event.target.value as DemoTenantSlug)}
            value={session.tenant.slug}
          >
            {demoTenants.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.displayName}
              </option>
            ))}
          </select>
          <select
            aria-label="Role context"
            className="h-10 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold sm:w-56"
            onChange={(event) => setRole(event.target.value as DemoRoleKey)}
            value={session.role.key}
          >
            {demoRoles.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
          <Badge tone="gold">Internal only</Badge>
        </div>
      </div>
    </header>
  );
}

function KycShell({ activePageId, children }: { activePageId: string; children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-internal av-shell-grid overflow-x-hidden">
        <KycSidebar activePageId={activePageId} />
        <div className="min-w-0">
          <KycTopBar />
          <main className="min-w-0 px-4 py-5 md:px-6 lg:px-8 lg:py-7">
            <div className="av-page-wide">{children}</div>
          </main>
        </div>
      </div>
    </DemoSessionProvider>
  );
}

function PageHeading({ action, icon: Icon, subtitle, title }: { action?: React.ReactNode; icon: LucideIcon; subtitle: string; title: string }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex min-w-0 gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-md border border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone="red">{kycCase.riskTier} risk</Badge>
            <Badge tone="gold">{kycCase.reviewStatus}</Badge>
            <Badge>Case {kycCase.caseId}</Badge>
          </div>
          <h2 className="mt-3 font-display text-3xl text-alphavest-ivory md:text-4xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-alphavest-muted">{subtitle}</p>
        </div>
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-3">{action}</div> : null}
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

const identityColumns: Array<DataTableColumn<(typeof identityChecks)[number]>> = [
  { key: "check", header: "Check", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.check}</span> },
  { key: "evidence", header: "Evidence", render: (row) => row.evidence },
  { key: "result", header: "Result", render: (row) => <Badge tone={toneFor(row.result)}>{row.result}</Badge> },
  { key: "owner", header: "Owner", render: (row) => row.owner },
];

const amlColumns: Array<DataTableColumn<(typeof amlChecks)[number]>> = [
  { key: "signal", header: "Signal", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.signal}</span> },
  { key: "source", header: "Source", render: (row) => row.source },
  { key: "severity", header: "Severity", render: (row) => <Badge tone={toneFor(row.severity)}>{row.severity}</Badge> },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
];

function KycReviewPage({ title }: { title: string }) {
  const [status, setStatus] = useState<string | null>(null);

  async function run(actionId: string, next: string) {
    setStatus(next);
    await runScreencastDemoAction(actionId);
  }

  return (
    <KycShell activePageId="064">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <PageHeading
          action={
            <>
              <button className={secondaryButtonClass} onClick={() => void run("j12.requestKycEvidence", "Evidence request audit recorded.")} type="button">
                <AlertTriangle aria-hidden="true" className="size-4" />
                Request evidence
              </button>
              <button className={primaryButtonClass} onClick={() => void run("j12.completeKycReview", "KYC review routed to compliance.")} type="button">
                <Check aria-hidden="true" className="size-4" />
                Route to compliance
              </button>
            </>
          }
          icon={UserCheck}
          subtitle="Review identity, AML and evidence readiness before anything can move toward downstream compliance release."
          title={title}
        />
        <StatePanel detail="Client visibility is blocked until KYC/FICA status, evidence completeness and compliance release are all satisfied." state="blocked" title="No client release from KYC review" />
        {status ? <p className="text-sm text-alphavest-gold-soft">{status}</p> : null}
        <WizardStepper steps={kycWorkflowSteps.map((step) => ({ ...step }))} />
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard detail={kycCase.client} label="Client" status="PROCESSING" value={kycCase.kycFicaStatus} />
          <MetricCard detail="Evidence package completeness" label="Evidence" status="PENDING" value={`${kycCase.evidenceCompleteness}%`} />
          <MetricCard detail="Open adverse-media review" label="AML confidence" status="FAILED" value={`${kycCase.amlConfidence}%`} />
          <MetricCard detail={`Due ${kycCase.due}`} label="Owner" status="SCHEDULED" value={kycCase.owner} />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr_22rem]">
          <section className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Identity and KYC Checks</CardTitle>
                <CardDescription>Human-reviewed status for identity, UBO, tax and consent checks.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={identityColumns} getRowId={(row) => row.check} rows={identityChecks} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Evidence Package</CardTitle>
                <CardDescription>Important KYC actions create evidence records by default where the demo adapter verifies persistence.</CardDescription>
              </CardHeader>
              <CardContent>
                <EvidenceList items={kycEvidenceItems.map((item) => ({ ...item }))} />
              </CardContent>
            </Card>
          </section>
          <section className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>AML Screening</CardTitle>
                <CardDescription>Screening outcomes remain internal and require review before any downstream use.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={amlColumns} getRowId={(row) => row.signal} rows={amlChecks} />
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <StatePanel detail="No sanctions match remains open after human review." state="empty" title="Sanctions cleared" />
              <StatePanel detail="Adverse media and jurisdiction risk prevent release." state="error" title="2 blockers" />
            </div>
          </section>
          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Principal" value={kycCase.principal} />
                <InfoRow label="Structure" value={kycCase.structure} />
                <InfoRow label="Analyst" value={kycCase.analyst} />
                <InfoRow label="Last updated" value={kycCase.lastUpdated} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Audit Boundary</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditTimeline items={kycAuditItems.map((item) => ({ ...item }))} />
              </CardContent>
            </Card>
            <button className={secondaryButtonClass + " w-full"} disabled type="button">
              <LockKeyhole aria-hidden="true" className="size-4" />
              Client release disabled
            </button>
          </aside>
        </div>
      </div>
    </KycShell>
  );
}

const sourceTrailColumns: Array<DataTableColumn<(typeof sourceOfWealthTrail)[number]>> = [
  { key: "step", header: "Trail step", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.step}</span> },
  { key: "party", header: "Party", render: (row) => row.party },
  { key: "value", header: "Value", render: (row) => row.value },
  { key: "evidence", header: "Evidence", render: (row) => row.evidence },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
];

const sourceDocumentColumns: Array<DataTableColumn<(typeof sourceDocuments)[number]>> = [
  { key: "document", header: "Document", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.document}</span> },
  { key: "type", header: "Type", render: (row) => row.type },
  { key: "confidence", header: "Confidence", render: (row) => <Badge tone={confidenceTone(row.confidence)}>{row.confidence}</Badge> },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneFor(row.status)}>{row.status}</Badge> },
];

function SourceOfWealthPage({ title }: { title: string }) {
  const [status, setStatus] = useState<string | null>(null);

  async function run(actionId: string, next: string) {
    setStatus(next);
    await runScreencastDemoAction(actionId);
  }

  return (
    <KycShell activePageId="065">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="space-y-5">
        <PageHeading
          action={
            <>
              <button className={secondaryButtonClass} onClick={() => void run("j12.escalateSourceOfWealth", "Source-of-wealth escalation audit recorded.")} type="button">
                <ShieldAlert aria-hidden="true" className="size-4" />
                Escalate proof gap
              </button>
              <button className={primaryButtonClass} onClick={() => void run("j12.linkSourceEvidence", "Source evidence package linked.")} type="button">
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Link evidence package
              </button>
            </>
          }
          icon={WalletCards}
          subtitle="Trace source-of-wealth evidence before the KYC package can move toward compliance release. This is not advice and not client-visible."
          title={title}
        />
        <StatePanel detail="Funds trail is partially verified. Missing wire purpose and trustee resolution keep the case in internal review." state="restricted" title="Source-of-wealth review required" />
        {status ? <p className="text-sm text-alphavest-gold-soft">{status}</p> : null}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard detail="Incoming transfer under review" label="Amount" status="PENDING" value="USD 2.45M" />
          <MetricCard detail="Sale agreement and broker receipt" label="Verified source" status="COMPLETED" value="2 of 4" />
          <MetricCard detail="Wire purpose and trustee resolution" label="Open gaps" status="FAILED" value="2" />
          <MetricCard detail="Internal-only status" label="Client visibility" status="SCHEDULED" value="Blocked" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
          <section className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Funds Trail</CardTitle>
                <CardDescription>Each step must be explained by linked evidence before release controls can proceed.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={sourceTrailColumns} getRowId={(row) => row.step} rows={sourceOfWealthTrail} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Source Documents</CardTitle>
                <CardDescription>Document confidence is reviewed by humans; low-confidence extraction is not final evidence.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={sourceDocumentColumns} getRowId={(row) => row.document} rows={sourceDocuments} />
              </CardContent>
            </Card>
            <div className="grid gap-4 lg:grid-cols-3">
              {sourceRiskFindings.map((finding) => (
                <StatePanel detail={finding.detail} key={finding.title} state={finding.priority === "High" ? "error" : "restricted"} title={finding.title} />
              ))}
            </div>
          </section>
          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Review Gate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="KYC/FICA" value={kycCase.kycFicaStatus} />
                <InfoRow label="Source status" value={kycCase.sourceOfWealthStatus} />
                <InfoRow label="Owner" value={kycCase.owner} />
                <InfoRow label="Downstream role" value="Compliance release review" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Evidence and Audit</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditTimeline items={kycAuditItems.map((item) => ({ ...item }))} />
              </CardContent>
            </Card>
            <button className={secondaryButtonClass + " w-full"} disabled type="button">
              <Clock3 aria-hidden="true" className="size-4" />
              Awaiting proof
            </button>
          </aside>
        </div>
      </div>
    </KycShell>
  );
}

export function KycAmlWorkflowScreen({ route }: KycAmlWorkflowScreenProps) {
  if (!kycAmlPageIds.includes(route.pageId as (typeof kycAmlPageIds)[number])) {
    return null;
  }

  if (route.pageId === "064") {
    return <KycReviewPage title={route.title} />;
  }

  return <SourceOfWealthPage title={route.title} />;
}
