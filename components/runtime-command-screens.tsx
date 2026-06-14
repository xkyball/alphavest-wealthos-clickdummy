"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DemoWorkflowInstance, DemoSessionSnapshot } from "@/lib/demo-runtime";
import type { StatusTone } from "@/lib/status";
import { EvidencePreviewDrawer } from "./phase5-client-screens";
import { cn, DashboardTable, GlassPanel, StatusChip, WorkflowBadge } from "./ui";
import { findDemoWorkflow, useDemoSession } from "./use-demo-session";

type GateRow = {
  label: string;
  complete: boolean;
};

type CommandLink = {
  href: string;
  label: string;
  detail: string;
  tone: StatusTone;
};

const commandLinks: CommandLink[] = [
  {
    href: "/workbench",
    label: "Open workbench",
    detail: "Review the active recommendation and document queue.",
    tone: "info"
  },
  {
    href: "/advisor-approval",
    label: "Advisor review",
    detail: "Approve the recommendation before compliance can release it.",
    tone: "warning"
  },
  {
    href: "/compliance",
    label: "Compliance release",
    detail: "Release or block advice-like output before the client sees it.",
    tone: "review"
  },
  {
    href: "/decisions",
    label: "Client decision",
    detail: "Submit a decision only after the advice gate is open.",
    tone: "success"
  }
];

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <article className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-[96rem] gap-5">{children}</div>
    </article>
  );
}

function AppHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-av-line pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-4xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg border border-av-gold text-sm font-semibold text-av-goldBright">
            AV
          </div>
          <div>
            <p className="text-sm text-av-goldBright">AlphaVest WealthOS</p>
            <p className="text-xs uppercase text-av-muted">
              Digital wealth assurance
            </p>
          </div>
        </div>
        <h1 className="font-display text-4xl leading-tight text-av-ivory md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-base text-av-muted md:text-lg">
          {subtitle}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

function LoadingPanel() {
  return (
    <GlassPanel>
      <div className="flex items-center justify-between gap-3 text-sm text-av-muted">
        <span>Loading shared workflow state</span>
        <StatusChip tone="info">Syncing</StatusChip>
      </div>
    </GlassPanel>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <GlassPanel>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-av-muted">{message}</span>
        <StatusChip tone="danger">Runtime unavailable</StatusChip>
      </div>
    </GlassPanel>
  );
}

function gateRows(workflow: DemoWorkflowInstance | undefined): GateRow[] {
  return [
    ["Advisor approval", workflow?.advisorApproval ?? false],
    ["Compliance release", workflow?.complianceRelease ?? false],
    ["Evidence record", workflow?.evidenceRecordExists ?? false],
    ["Permission check", workflow?.permissionCheck ?? false],
    ["Client visibility", workflow?.clientVisibilityState === "released"]
  ].map(([label, complete]) => ({ label: String(label), complete: Boolean(complete) }));
}

function GatePanel({ workflow }: { workflow: DemoWorkflowInstance | undefined }) {
  const rows = gateRows(workflow);
  const released = rows.every((row) => row.complete);

  return (
    <GlassPanel
      title="Advice Visibility Gate"
      actions={<WorkflowBadge label={released ? "CLIENT" : "BLOCKED"} />}
    >
      <div className="grid gap-2">
        {rows.map((row) => (
          <div
            className="flex items-center justify-between gap-3 rounded border border-av-line/50 bg-av-midnight/45 px-3 py-2 text-sm"
            key={row.label}
          >
            <span>{row.label}</span>
            <StatusChip tone={row.complete ? "success" : "warning"}>
              {row.complete ? "Ready" : "Pending"}
            </StatusChip>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-av-muted">
        Advice-like output remains blocked until every condition is complete.
      </p>
    </GlassPanel>
  );
}

function EventPanel({ snapshot }: { snapshot: DemoSessionSnapshot | null }) {
  const events = [
    ...(snapshot?.evidenceRecords.slice(0, 3).map((event) => ({
      type: "Evidence",
      name: event.event,
      detail: event.objectId
    })) ?? []),
    ...(snapshot?.auditEvents.slice(0, 3).map((event) => ({
      type: "Audit",
      name: event.action,
      detail: event.result
    })) ?? [])
  ].slice(0, 5);

  return (
    <GlassPanel title="Recent Event Output">
      <div className="grid gap-2">
        {events.map((event) => (
          <div
            className="rounded border border-av-line/50 bg-av-midnight/45 px-3 py-2 text-sm"
            key={`${event.type}-${event.name}-${event.detail}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-av-ivory">{event.name}</span>
              <StatusChip tone={event.type === "Evidence" ? "success" : "info"}>
                {event.type}
              </StatusChip>
            </div>
            <p className="mt-1 text-xs text-av-muted">{event.detail}</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function WorkflowStateGrid({ snapshot }: { snapshot: DemoSessionSnapshot | null }) {
  const rows = snapshot?.workflows ?? [];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {rows.map((workflow) => (
        <GlassPanel className="min-h-36" key={workflow.id}>
          <div className="flex h-full flex-col justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-av-muted">{workflow.workflow}</p>
              <p className="mt-2 text-sm font-semibold text-av-ivory">
                {workflow.title}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusChip tone={workflow.clientVisibilityState === "released" ? "success" : "warning"}>
                {workflow.state}
              </StatusChip>
              <StatusChip tone={workflow.evidenceRecordExists ? "success" : "neutral"}>
                Evidence
              </StatusChip>
            </div>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}

export function RuntimePresentationScreen() {
  const { snapshot, loading, error, reset } = useDemoSession();
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const latestAudit = snapshot?.auditEvents[0]?.action ?? "Waiting for next action";

  return (
    <PageFrame>
      <AppHeader
        title="Operating command center"
        subtitle="A shared runtime view for the active wealth workflow, from internal review through compliance release and client decision capture."
        action={
          <button
            className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted hover:border-av-gold hover:text-av-goldBright"
            onClick={() => void reset()}
            type="button"
          >
            Reset session
          </button>
        }
      />

      {loading ? <LoadingPanel /> : null}
      {error ? <ErrorPanel message={error} /> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <GlassPanel>
          <p className="text-xs uppercase text-av-muted">Active workflows</p>
          <p className="mt-2 font-display text-4xl text-av-goldBright">
            {snapshot?.workflows.length ?? 0}
          </p>
          <StatusChip tone="info">Live runtime</StatusChip>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase text-av-muted">Client visibility</p>
          <p className="mt-2 font-display text-4xl text-av-goldBright">
            {recommendation?.clientVisibilityState === "released" ? "Open" : "Closed"}
          </p>
          <StatusChip tone={recommendation?.clientVisibilityState === "released" ? "success" : "warning"}>
            Advice gate
          </StatusChip>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase text-av-muted">Evidence records</p>
          <p className="mt-2 font-display text-4xl text-av-goldBright">
            {snapshot?.evidenceRecords.length ?? 0}
          </p>
          <StatusChip tone="success">Captured</StatusChip>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase text-av-muted">Latest audit event</p>
          <p className="mt-2 text-sm font-semibold text-av-ivory">{latestAudit}</p>
          <StatusChip tone="info">Audit trail</StatusChip>
        </GlassPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <GlassPanel title="Workflow Entry Points">
          <div className="grid gap-3 md:grid-cols-2">
            {commandLinks.map((item) => (
              <Link
                className={cn(
                  "rounded-lg border border-av-line bg-av-midnight/45 p-4 transition hover:border-av-gold",
                  item.tone === "success" && "hover:border-av-success",
                  item.tone === "danger" && "hover:border-av-danger"
                )}
                href={item.href}
                key={item.href}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-av-ivory">{item.label}</p>
                  <StatusChip tone={item.tone}>Open</StatusChip>
                </div>
                <p className="mt-2 text-sm text-av-muted">{item.detail}</p>
              </Link>
            ))}
          </div>
        </GlassPanel>
        <GatePanel workflow={recommendation} />
      </div>

      <WorkflowStateGrid snapshot={snapshot} />
    </PageFrame>
  );
}

export function RuntimeWorkbenchScreen() {
  const { snapshot, loading, error, reset } = useDemoSession();
  const [evidencePreviewOpen, setEvidencePreviewOpen] = useState(false);
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const documentWorkflow = findDemoWorkflow(snapshot, "wf-trust-deed-document");
  const accessRequest = findDemoWorkflow(snapshot, "wf-external-advisor-access");

  const queueRows = useMemo(
    () => [
      [
        "Steward Family",
        recommendation?.title ?? "Trust X beneficiary update recommendation",
        documentWorkflow?.state ?? "loading",
        recommendation?.state ?? "loading",
        recommendation?.advisorApproval ? "Approved" : "Pending",
        recommendation?.complianceRelease ? "Released" : "Blocked",
        recommendation?.clientVisibilityState === "released" ? "On track" : "At risk"
      ],
      [
        "Steward Family",
        accessRequest?.title ?? "External advisor access",
        accessRequest?.state ?? "loading",
        accessRequest?.lastEvent ?? "access.requested",
        accessRequest?.permissionCheck ? "Confirmed" : "Needs confirmation",
        "Sensitive",
        accessRequest?.permissionCheck ? "On track" : "Blocked"
      ],
      [
        "Bennett Foundation",
        "Grant strategy refresh",
        "under_review",
        "needs_review",
        "Pending",
        "Blocked",
        "At risk"
      ],
      [
        "Summit Ventures",
        "Performance review pack",
        "validated",
        "advisor_approved",
        "Approved",
        "Pending",
        "On track"
      ]
    ],
    [accessRequest, documentWorkflow, recommendation]
  );

  return (
    <PageFrame>
      <AppHeader
        title="Advisor workbench"
        subtitle="Review priority work, inspect the active recommendation, and keep the advice gate tied to shared evidence and audit output."
        action={
          <button
            className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted hover:border-av-gold hover:text-av-goldBright"
            onClick={() => void reset()}
            type="button"
          >
            Reset session
          </button>
        }
      />

      {loading ? <LoadingPanel /> : null}
      {error ? <ErrorPanel message={error} /> : null}

      <div className="grid gap-4 md:grid-cols-5">
        {[
          ["Total items", "326", "info"],
          ["Overdue", "18", "danger"],
          ["Due today", "41", "warning"],
          ["At risk", recommendation?.clientVisibilityState === "released" ? "17" : "52", "danger"],
          ["On track", recommendation?.clientVisibilityState === "released" ? "250" : "215", "success"]
        ].map(([label, value, tone]) => (
          <GlassPanel key={label}>
            <p className="text-xs uppercase text-av-muted">{label}</p>
            <p className="mt-2 font-display text-4xl text-av-goldBright">
              {value}
            </p>
            <StatusChip tone={tone as StatusTone}>Queue health</StatusChip>
          </GlassPanel>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-5">
          <GlassPanel title="Priority Work Queue">
            <DashboardTable
              columns={[
                "Client",
                "Primary item",
                "Document state",
                "Workflow state",
                "Advisor",
                "Compliance",
                "SLA"
              ]}
              rows={queueRows}
            />
          </GlassPanel>

          <GlassPanel title="Selected Trigger Detail">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="grid gap-3 text-sm text-av-muted">
                <p className="text-base font-semibold text-av-ivory">
                  {recommendation?.title ?? "Trust X beneficiary update recommendation"}
                </p>
                <p>
                  Single-family trust documentation changed. The next review must
                  prove source evidence, advisor approval and compliance release
                  before any advice-like output can become visible to the client.
                </p>
                <div className="flex flex-wrap gap-2">
                  <StatusChip tone="info">
                    {recommendation?.workflow ?? "recommendation"}
                  </StatusChip>
                  <StatusChip tone={recommendation?.state === "released" ? "success" : "warning"}>
                    {recommendation?.state ?? "loading"}
                  </StatusChip>
                  <StatusChip tone={documentWorkflow?.state === "validated" ? "success" : "warning"}>
                    Document {documentWorkflow?.state ?? "loading"}
                  </StatusChip>
                </div>
              </div>
              <div className="grid gap-2">
                <Link
                  className="rounded-lg border border-av-line px-4 py-2 text-center text-sm text-av-muted hover:border-av-gold hover:text-av-goldBright"
                  href="/advisor-approval"
                >
                  Open advisor review
                </Link>
                <Link
                  className="rounded-lg border border-av-line px-4 py-2 text-center text-sm text-av-muted hover:border-av-gold hover:text-av-goldBright"
                  href="/mobile/upload"
                >
                  Confirm extraction
                </Link>
                <button
                  className="rounded-lg border border-av-line px-4 py-2 text-center text-sm text-av-muted hover:border-av-gold hover:text-av-goldBright"
                  onClick={() => setEvidencePreviewOpen(true)}
                  type="button"
                >
                  Preview evidence
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>

        <div className="grid content-start gap-5">
          <GatePanel workflow={recommendation} />
          <EventPanel snapshot={snapshot} />
        </div>
      </div>
      <EvidencePreviewDrawer
        accessAllowed
        accessReason="allowed"
        auditAction={snapshot?.auditEvents[0]?.action ?? "recommendation.drafted"}
        auditActorRole={snapshot?.auditEvents[0]?.actorRole ?? "AlphaVest Analyst"}
        auditEvidenceLink={snapshot?.auditEvents[0]?.evidenceLink ?? "evidence://recommendation-draft/trust-x-beneficiary-update"}
        auditResult={snapshot?.auditEvents[0]?.result ?? "created"}
        auditTimestamp={snapshot?.auditEvents[0]?.timestamp ?? "2026-06-14T00:00:00.000Z"}
        evidenceUri={snapshot?.evidenceRecords[0]?.link ?? "evidence://recommendation-draft/trust-x-beneficiary-update"}
        onClose={() => setEvidencePreviewOpen(false)}
        open={evidencePreviewOpen}
        recordStatus={recommendation?.evidenceRecordExists ? "Validated" : "Missing"}
        recordTitle="Risk Profile - Investor Questionnaire"
        recordType={snapshot?.evidenceRecords[0]?.objectType ?? "Form / Assessment"}
        recordVisibility={snapshot?.evidenceRecords[0]?.visibility ?? "Client-visible"}
      />
    </PageFrame>
  );
}
