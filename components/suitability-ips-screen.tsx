"use client";

import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  FileText,
  LockKeyhole,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Target,
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
  type DataTableColumn,
} from "@/components/ui";
import { AppShell } from "@/components/app-shell";
import {
  gateLabelMap,
  ipsAllocationBands,
  ipsConstraints,
  ipsDocuments,
  ipsMandate,
  suitabilityAssessments,
  suitabilityAuditItems,
  suitabilityCase,
  suitabilityEvidenceItems,
  suitabilityGateResult,
  suitabilityIpsPageIds,
  suitabilityObjectives,
  suitabilityWorkflowSteps,
  toneForSuitability,
} from "@/lib/suitability-ips-demo-data";
import { runPhaseBCProcessCommand, type PhaseBCDemoActionId } from "@/lib/phase-b-c-process-command-client";
import type { ScreenRoute } from "@/lib/route-registry";

type SuitabilityIpsScreenProps = {
  route: ScreenRoute;
};

const primaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

const secondaryButtonClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55";

function PageHeading({
  action,
  icon: Icon,
  subtitle,
  title,
}: {
  action?: React.ReactNode;
  icon: LucideIcon;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex min-w-0 gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-md border border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone="gold">{suitabilityCase.client}</Badge>
            <Badge tone="red">Client visibility unavailable</Badge>
            <Badge>Case {suitabilityCase.caseId}</Badge>
          </div>
          <h1 className="mt-3 font-display text-3xl text-alphavest-ivory md:text-4xl">{title}</h1>
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-red">Decision checkpoint</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{decisionLabel}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted" data-testid="ux-phase6-safety-note">{safetyNote}</p>
        </div>
        <Badge tone="red">Controlled action</Badge>
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
        <button className={primaryButtonClass} data-testid="ux-phase6-confirm" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" disabled title="Blocked until a typed service command is implemented." type="button">{confirmLabel} blocked</button>
        <button className={secondaryButtonClass} data-testid="ux-phase6-cancel" data-ux-affordance="blocked-static-control" data-ux-disabled-message="explicit" data-ux-disabled-reason="Blocked until a typed workflow command is implemented." data-ux-interactive="false" disabled title="Blocked until a typed service command is implemented." type="button">{cancelLabel} blocked</button>
      </div>
    </section>
  );
}

function GateChecklist() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advice Visibility Check</CardTitle>
        <CardDescription>Local readiness result used by this screen before any client-visible claim.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suitabilityGateResult.missing.map((item) => (
          <div className="flex items-start gap-3 rounded-md border border-alphavest-red/25 bg-alphavest-red/10 p-3" key={item}>
            <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-alphavest-red" />
            <div>
              <p className="text-sm font-semibold text-alphavest-ivory">{gateLabelMap[item] ?? item}</p>
              <p className="text-xs leading-5 text-alphavest-muted">Required before advice-like material can become client-visible.</p>
            </div>
          </div>
        ))}
        <button className={secondaryButtonClass + " w-full"} disabled type="button">
          <Send aria-hidden="true" className="size-4" />
          Release to client disabled
        </button>
      </CardContent>
    </Card>
  );
}

const assessmentColumns: Array<DataTableColumn<(typeof suitabilityAssessments)[number]>> = [
  { key: "dimension", header: "Dimension", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.dimension}</span> },
  { key: "clientInput", header: "Client input", render: (row) => row.clientInput },
  { key: "reviewer", header: "Reviewer", render: (row) => row.reviewer },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneForSuitability(row.status)}>{row.status}</Badge> },
  { key: "evidence", header: "Evidence", render: (row) => row.evidence },
];

const objectiveColumns: Array<DataTableColumn<(typeof suitabilityObjectives)[number]>> = [
  { key: "objective", header: "Objective", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.objective}</span> },
  { key: "priority", header: "Priority", render: (row) => <Badge tone={toneForSuitability(row.priority)}>{row.priority}</Badge> },
  { key: "owner", header: "Owner", render: (row) => row.owner },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneForSuitability(row.status)}>{row.status}</Badge> },
  { key: "blocker", header: "Blocker", render: (row) => row.blocker },
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">Detail review</p>
          <h2 className="mt-2 font-display text-2xl text-alphavest-ivory">{objectLabel}</h2>
        </div>
        <Badge tone="gold">Internal review</Badge>
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
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Controls</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{safetyBoundary}</p>
        </div>
        <div className="rounded-md border border-alphavest-border bg-alphavest-charcoal/55 p-3" data-testid="ux-phase5-page-job">
          <p className="text-xs uppercase tracking-[0.12em] text-alphavest-muted">Focus</p>
          <p className="mt-2 text-sm font-semibold text-alphavest-ivory">{pageJob}</p>
        </div>
      </div>
    </section>
  );
}

function SuitabilityProfilePage({ title }: { title: string }) {
  const [status, setStatus] = useState<string | null>(null);

  async function run(actionId: PhaseBCDemoActionId, next: string) {
    setStatus(next);
    await runPhaseBCProcessCommand(actionId);
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Phase5DetailSplitPanel decisionSupport="Suitability profile separates objectives and risk evidence from IPS mandate decisions." objectLabel="Suitability review split" objectState="Suitability evidence incomplete" pageJob="Suitability page captures profile review without releasing advice." safetyBoundary="Suitability detail cannot publish advice or client-visible recommendations." splitTaskId="UX-PAGE-SPLIT-008" taskId="UX-PAGE-SPLIT-008" />
        <PageHeading
          action={
            <>
              <button className={secondaryButtonClass} onClick={() => void run("j13.requestSuitabilityEvidence", "Suitability evidence request audit recorded.")} type="button">
                <AlertTriangle aria-hidden="true" className="size-4" />
                Request evidence
              </button>
              <button className={primaryButtonClass} onClick={() => void run("j13.markSuitabilityReviewed", "Suitability review routed to IPS/Compliance. No client release occurred.")} type="button">
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Mark reviewed
              </button>
            </>
          }
          icon={Target}
          subtitle="Capture risk, objectives, constraints and evidence before any advice-like flow can move toward compliance release."
          title={title}
        />
        <StatePanel
          detail={`Gate result: ${suitabilityGateResult.passed ? "passed" : "blocked"}. Missing ${suitabilityGateResult.missing.length} local prerequisite checks.`}
          state="blocked"
          title="Unreviewed advice flow blocked"
        />
        {status ? <p className="text-sm text-alphavest-gold-soft">{status}</p> : null}
        <WizardStepper steps={suitabilityWorkflowSteps.map((step) => ({ ...step }))} />
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard detail={suitabilityCase.client} label="Suitability status" status="PENDING" value={suitabilityCase.suitabilityStatus} />
          <MetricCard detail="Objectives mapped to evidence" label="Objective coverage" status="PROCESSING" value={`${suitabilityCase.objectiveCoverage}%`} />
          <MetricCard detail="Risk profile still under review" label="Risk alignment" status="FAILED" value={`${suitabilityCase.riskAlignment}%`} />
          <MetricCard detail={`Next review ${suitabilityCase.nextReview}`} label="Evidence" status="SCHEDULED" value={`${suitabilityCase.evidenceCompleteness}%`} />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
          <section className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Risk And Suitability Assessment</CardTitle>
                <CardDescription>Human-reviewed profile inputs. Incomplete values block downstream advice visibility.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={assessmentColumns} getRowId={(row) => row.dimension} rows={suitabilityAssessments} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Investment Objectives</CardTitle>
                <CardDescription>Objectives must be evidenced and mapped before IPS mandate review can complete.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={objectiveColumns} getRowId={(row) => row.objective} rows={suitabilityObjectives} />
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-3">
              <StatePanel detail="Tax-aware liquidity objective is blocked until missing certificate evidence is validated." state="error" title="Evidence blocker" />
              <StatePanel detail="Impact sleeve range must be reconciled with the draft IPS mandate." state="restricted" title="Mandate conflict" />
              <StatePanel detail="Advisor approval is not enough; compliance release remains required." state="blocked" title="Client visibility guarded" />
            </div>
          </section>
          <aside className="space-y-5">
            <GateChecklist />
            <Card>
              <CardHeader>
                <CardTitle>Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Principal" value={suitabilityCase.principal} />
                <InfoRow label="Advisor" value={suitabilityCase.advisor} />
                <InfoRow label="Compliance" value={suitabilityCase.complianceOwner} />
                <InfoRow label="Last updated" value={suitabilityCase.lastUpdated} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <EvidenceList items={suitabilityEvidenceItems.map((item) => ({ ...item }))} />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

const allocationColumns: Array<DataTableColumn<(typeof ipsAllocationBands)[number]>> = [
  { key: "assetClass", header: "Asset class", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.assetClass}</span> },
  { key: "target", header: "Target", render: (row) => row.target },
  { key: "minimum", header: "Min", render: (row) => row.minimum },
  { key: "maximum", header: "Max", render: (row) => row.maximum },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneForSuitability(row.status)}>{row.status}</Badge> },
];

const constraintColumns: Array<DataTableColumn<(typeof ipsConstraints)[number]>> = [
  { key: "constraint", header: "Constraint", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.constraint}</span> },
  { key: "rule", header: "Rule", render: (row) => row.rule },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneForSuitability(row.status)}>{row.status}</Badge> },
];

const documentColumns: Array<DataTableColumn<(typeof ipsDocuments)[number]>> = [
  { key: "document", header: "Document", render: (row) => <span className="font-semibold text-alphavest-ivory">{row.document}</span> },
  { key: "type", header: "Type", render: (row) => row.type },
  { key: "status", header: "Status", render: (row) => <Badge tone={toneForSuitability(row.status)}>{row.status}</Badge> },
  { key: "evidence", header: "Evidence", render: (row) => row.evidence },
];

function IpsMandatePage({ title }: { title: string }) {
  const [status, setStatus] = useState<string | null>(null);

  async function run(actionId: PhaseBCDemoActionId, next: string) {
    setStatus(next);
    await runPhaseBCProcessCommand(actionId);
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          action={
            <>
              <button className={secondaryButtonClass} onClick={() => void run("j14.requestIpsMandateChanges", "IPS change request audit recorded.")} type="button">
                <SlidersHorizontal aria-hidden="true" className="size-4" />
                Request changes
              </button>
              <button className={primaryButtonClass} onClick={() => void run("j14.linkIpsEvidence", "IPS evidence linked for compliance review. No client release occurred.")} type="button">
                <FileCheck2 aria-hidden="true" className="size-4" />
                Link evidence
              </button>
            </>
          }
          icon={FileText}
          subtitle="Review the draft investment policy mandate and evidence prerequisites. The mandate is internal until all suitability, IPS, evidence, permission and compliance required checks pass."
          title={title}
        />
        <StatePanel
          detail="Draft IPS content is not client-visible. Client release remains disabled because the local Suitability/IPS check is blocked."
          state="blocked"
          title="IPS / mandate release blocked"
        />
        <Phase6DecisionRoomPanel audit="IPS decision audit must record actor, mandate version, suitability gate state and cancel or confirm outcome." blocker="IPS release remains blocked because acknowledgement, evidence and suitability checks are incomplete." cancelLabel="Cancel IPS decision" confirmLabel="Confirm IPS release" decisionLabel="IPS mandate decision room" evidence="Mandate constraints, document evidence, suitability gate result and audit trail are visible before decision." preconditions="Suitability pass, IPS evidence complete, acknowledgement and compliance release must all pass." safetyNote="No release, export or advice effect can occur until required checks pass and audit is recorded." taskId="UX-DECISION-ROOM-003" />
        {status ? <p className="text-sm text-alphavest-gold-soft">{status}</p> : null}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard detail={ipsMandate.scope} label="Mandate" status="PENDING" value={ipsMandate.version} />
          <MetricCard detail={ipsMandate.effectiveDate} label="Status" status="FAILED" value={ipsMandate.status} />
          <MetricCard detail={ipsMandate.acknowledgement} label="Acknowledgement" status="SCHEDULED" value="Missing" />
          <MetricCard detail={ipsMandate.reviewCadence} label="Evidence" status="PROCESSING" value={ipsMandate.evidenceStatus} />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
          <section className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Allocation Bands</CardTitle>
                <CardDescription>Draft mandate ranges only. These values are not final advice and not released to the client.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={allocationColumns} getRowId={(row) => row.assetClass} rows={ipsAllocationBands} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mandate Constraints</CardTitle>
                <CardDescription>Constraints require evidence and human review before compliance can consider release.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={constraintColumns} getRowId={(row) => row.constraint} rows={ipsConstraints} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Documents And Evidence</CardTitle>
                <CardDescription>Evidence references support review only; they do not create client visibility.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={documentColumns} getRowId={(row) => row.document} rows={ipsDocuments} />
              </CardContent>
            </Card>
          </section>
          <aside className="space-y-5">
            <GateChecklist />
            <Card>
              <CardHeader>
                <CardTitle>Mandate Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Mandate ID" value={ipsMandate.mandateId} />
                <InfoRow label="Version" value={ipsMandate.version} />
                <InfoRow label="Status" value={ipsMandate.status} />
                <InfoRow label="Review cadence" value={ipsMandate.reviewCadence} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Audit Boundary</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditTimeline items={suitabilityAuditItems.map((item) => ({ ...item }))} />
              </CardContent>
            </Card>
            <button className={secondaryButtonClass + " w-full"} disabled type="button">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Compliance release required
            </button>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

export function SuitabilityIpsScreen({ route }: SuitabilityIpsScreenProps) {
  if (!suitabilityIpsPageIds.includes(route.pageId as (typeof suitabilityIpsPageIds)[number])) {
    return null;
  }

  if (route.pageId === "066") {
    return <SuitabilityProfilePage title={route.title} />;
  }

  return <IpsMandatePage title={route.title} />;
}
