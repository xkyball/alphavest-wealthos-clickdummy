"use client";

import { Fragment, useState } from "react";
import {
  blockedFeatures,
  communicationLifecycleEvents,
  communicationRouteLabels,
  communicationSendTransition,
  communicationTriggers,
  evaluateCommunicationRelease,
  evidenceChain,
  escalationLoops,
  isReferenceRoute,
  permissionForCommunicationSend,
  roadmapColumns,
  roadmapDependencies,
  selectCommunicationRoute,
  serviceBlueprintLanes,
  serviceBlueprintStages,
  type CommunicationRoleView
} from "@/lib/phase8-model";
import type { StatusTone } from "@/lib/status";
import { canTransition, type WorkflowState } from "@/lib/state-machines";
import {
  cn,
  DashboardTable,
  GateChecklist,
  GlassPanel,
  StatusChip,
  WorkflowBadge
} from "./ui";
import { findDemoWorkflow, useDemoSession } from "./use-demo-session";

function Phase8Frame({
  title,
  subtitle,
  label,
  children
}: {
  title: string;
  subtitle: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-[100rem] gap-5">
        <header className="flex flex-col gap-4 border-b border-av-line pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg border border-av-gold text-sm font-semibold text-av-goldBright">
                AV
              </div>
              <div>
                <p className="text-sm text-av-goldBright">
                  AlphaVest WealthOS
                </p>
                <p className="text-xs uppercase text-av-muted">
                  Digital first, human reviewed, evidence backed
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
          {label ? <StatusChip tone="review">{label}</StatusChip> : null}
        </header>
        {children}
      </div>
    </article>
  );
}

const roleViews: Array<{
  id: CommunicationRoleView;
  label: string;
  role: "Senior Advisor" | "Client Success" | "Principal";
}> = [
  { id: "advisor", label: "Advisor", role: "Senior Advisor" },
  { id: "client-success", label: "Client Success", role: "Client Success" },
  { id: "client", label: "Client", role: "Principal" }
];

function workflowStepStatus(index: number, gateOpen: boolean) {
  if (gateOpen) {
    return "complete";
  }

  return index < 3 ? "complete" : "blocked";
}

export function Phase8CommunicationScreen({
  initialSurface
}: {
  initialSurface?: "client-preview";
}) {
  const { snapshot, loading, error, transition } = useDemoSession();
  const workflow = findDemoWorkflow(snapshot, "wf-q2-communication");
  const [triggerId, setTriggerId] = useState(communicationTriggers[0].id);
  const [roleView, setRoleView] = useState<CommunicationRoleView>("advisor");
  const [advisorApproved, setAdvisorApproved] = useState(false);
  const [complianceReleased, setComplianceReleased] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(
    initialSurface === "client-preview"
  );

  const trigger =
    communicationTriggers.find((item) => item.id === triggerId) ??
    communicationTriggers[0];
  const route = selectCommunicationRoute(trigger);
  const activeRole =
    roleViews.find((item) => item.id === roleView) ?? roleViews[0];
  const permission = permissionForCommunicationSend(
    activeRole.role,
    complianceReleased || Boolean(workflow?.complianceRelease)
  );
  const releaseState = {
    advisorApproval: Boolean(workflow?.advisorApproval) || advisorApproved,
    complianceRelease: Boolean(workflow?.complianceRelease) || complianceReleased,
    evidenceRecordExists: workflow?.evidenceRecordExists ?? true,
    permissionCheck: permission,
    clientVisibilityState:
      workflow?.clientVisibilityState === "released" ||
      (advisorApproved && complianceReleased)
        ? "released"
        : "blocked"
  } as const;
  const visibility = evaluateCommunicationRelease(releaseState);
  const sendTransition = communicationSendTransition(releaseState);
  const logRows = communicationLifecycleEvents(trigger).map((event) => [
    event.time,
    event.event,
    event.actor,
    event.visibility,
    event.evidence
  ]);

  return (
    <Phase8Frame
      title="Communication routing"
      subtitle="Choose whether digital-only is enough, whether more data is needed, or whether a call, F2F workshop or external specialist path is required."
    >
      {loading ? (
        <GlassPanel>
          <div className="flex items-center justify-between gap-3 text-sm text-av-muted">
            <span>Loading communication workflow state</span>
            <StatusChip tone="info">Syncing</StatusChip>
          </div>
        </GlassPanel>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="grid gap-5">
          <GlassPanel title="Communication Decision Tree">
            <div className="grid gap-3 md:grid-cols-5">
              {communicationTriggers.map((item) => (
                <button
                  className={cn(
                    "min-h-44 rounded-lg border p-3 text-left transition",
                    triggerId === item.id
                      ? "border-av-gold bg-av-gold/10 text-av-ivory"
                      : "border-av-line bg-av-midnight/45 text-av-muted hover:border-av-gold"
                  )}
                  key={item.id}
                  onClick={() => setTriggerId(item.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <StatusChip
                      tone={
                        item.complexity === "high"
                          ? "danger"
                          : item.complexity === "medium"
                            ? "warning"
                            : "success"
                      }
                    >
                      {item.complexity}
                    </StatusChip>
                  </div>
                  <p className="mt-2 text-xs">{item.signal}</p>
                  <p className="mt-3 text-xs text-av-goldBright">
                    Route: {communicationRouteLabels[item.defaultRoute]}
                  </p>
                </button>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel title="Call Trigger Matrix">
            <DashboardTable
              columns={["Trigger", "Complexity", "Sensitivity", "Recommended route", "Owner"]}
              rows={communicationTriggers.map((item) => [
                item.label,
                item.complexity,
                item.sensitivity,
                communicationRouteLabels[item.defaultRoute],
                item.ownerRole
              ])}
            />
          </GlassPanel>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <GlassPanel title="Client-Visible Message Preview">
              <p className="text-sm text-av-muted">
                Open the client-facing wording as a preview overlay over the
                internal communication context. The content stays blocked until
                the release gate passes.
              </p>
              <button
                className={cn(
                  "mt-4 w-full rounded-lg border px-4 py-3 text-sm font-semibold",
                  previewOpen
                    ? "border-av-gold bg-av-gold/10 text-av-goldBright"
                    : "border-av-line text-av-muted"
                )}
                onClick={() => setPreviewOpen(true)}
                type="button"
              >
                Open client preview overlay
              </button>
            </GlassPanel>

            <GlassPanel title="Role View">
              <div className="grid gap-2">
                {roleViews.map((item) => (
                  <button
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm",
                      roleView === item.id
                        ? "border-av-gold bg-av-gold/10 text-av-ivory"
                        : "border-av-line text-av-muted"
                    )}
                    key={item.id}
                    onClick={() => setRoleView(item.id)}
                    type="button"
                  >
                    <span className="block font-semibold">{item.label}</span>
                    <span className="text-xs">{item.role}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-av-line/60 bg-av-midnight/45 p-3 text-xs text-av-muted">
                Current send permission: {permission.blockedReason}.
              </div>
            </GlassPanel>
          </div>

          <GlassPanel title="Evidence and Communication Log">
            <DashboardTable
              columns={["Time", "Event", "Actor", "Visibility", "Evidence"]}
              rows={logRows}
            />
          </GlassPanel>
        </div>

        <div className="grid content-start gap-5">
          <GlassPanel title="Recommendation Route">
            <p className="text-sm text-av-muted">
              Selected trigger: <span className="text-av-ivory">{trigger.label}</span>
            </p>
            <p className="mt-3 font-display text-3xl text-av-goldBright">
              {communicationRouteLabels[route]}
            </p>
            <div className="mt-4 grid gap-2">
              {[
                "digital-only",
                "request-data",
                "schedule-call",
                "f2f-workshop",
                "external-specialist"
              ].map((item) => (
                <div
                  className={cn(
                    "flex items-center justify-between rounded border px-3 py-2 text-sm",
                    route === item
                      ? "border-av-gold bg-av-gold/10 text-av-ivory"
                      : "border-av-line/50 text-av-muted"
                  )}
                  key={item}
                >
                  <span>
                    {communicationRouteLabels[item as keyof typeof communicationRouteLabels]}
                  </span>
                  {route === item ? <WorkflowBadge label="REVIEW" /> : null}
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel title="Release Controls">
            <GateChecklist
              items={[
                {
                  label: "Advisor approval",
                  complete: releaseState.advisorApproval
                },
                {
                  label: "Compliance release",
                  complete: releaseState.complianceRelease
                },
                {
                  label: "Evidence record",
                  complete: releaseState.evidenceRecordExists
                },
                {
                  label: "Send permission",
                  complete: permission.allowed
                }
              ]}
            />
            <div className="mt-4 grid gap-2">
              <button
                className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted hover:border-av-gold hover:text-av-goldBright"
                onClick={() => setAdvisorApproved(true)}
                type="button"
              >
                Mark advisor reviewed
              </button>
              <button
                className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted hover:border-av-gold hover:text-av-goldBright"
                onClick={() => setComplianceReleased(true)}
                type="button"
              >
                Release message wording
              </button>
            </div>
          </GlassPanel>

          <GlassPanel title="Lifecycle State">
            <div className="grid gap-2">
              {(["draft", "needs_review", "advisor_approved", "compliance_pending", "released", "client_sent"] as WorkflowState[]).map((state, index) => {
                const status = workflowStepStatus(index, sendTransition.allowed);

                return (
                  <div
                    className="flex items-center justify-between rounded border border-av-line/50 bg-av-midnight/45 px-3 py-2 text-sm"
                    key={state}
                  >
                    <span>{state}</span>
                    <StatusChip
                      tone={
                        status === "complete"
                          ? "success"
                          : status === "blocked"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {status}
                    </StatusChip>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-av-midnight/78 px-4 py-8 backdrop-blur-sm">
          <section className="mx-auto grid w-full max-w-6xl gap-4 rounded-lg border border-av-line bg-av-panel p-5 shadow-panel">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-av-line/50 pb-4">
              <div>
                <p className="text-xs uppercase text-av-muted">
                  Communications Hub / Drafts / Message Preview
                </p>
                <p className="mt-1 font-display text-3xl text-av-goldBright">
                  Client-visible message preview
                </p>
                <p className="mt-1 text-sm text-av-muted">
                  Draft ID: DFT-2025-05-14-0287 / Created: May 14, 2025
                  10:22 AM
                </p>
              </div>
              <WorkflowBadge label={visibility.clientVisible ? "CLIENT" : "BLOCKED"} />
            </div>

            <div className="rounded-lg border border-av-line bg-av-midnight/45 p-4">
              <div className="grid gap-3 md:grid-cols-[repeat(4,minmax(0,1fr))_13rem]">
                {[
                  ["Drafted", "complete"],
                  ["Advisor Review", releaseState.advisorApproval ? "approved" : "pending"],
                  ["Compliance Review", releaseState.complianceRelease ? "released" : "pending"],
                  ["Ready to Send", sendTransition.allowed ? "ready" : "blocked"]
                ].map(([label, state]) => (
                  <div
                    className="rounded border border-av-line/60 bg-av-panelSoft p-3"
                    key={label}
                  >
                    <p className="text-xs uppercase text-av-muted">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-av-ivory">
                      {state}
                    </p>
                  </div>
                ))}
                <div className="rounded border border-av-success/60 bg-av-success/10 p-3">
                  <p className="text-xs uppercase text-av-muted">
                    Overall status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-av-success">
                    Ready to Send
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-av-muted">
                No unapproved advice reaches the client. Send stays disabled
                until advisor approval, compliance release, evidence and
                permission gates are all satisfied.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_28rem]">
              <div className="grid gap-4">
                <div className="rounded-lg border border-av-line bg-av-midnight/55 p-5">
                  <p className="text-xs uppercase text-av-muted">
                    Message Preview (client-visible)
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-av-ivory">
                    Market Update & Your Portfolio
                  </h2>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-av-muted">
                    <p>Dear Jordan,</p>
                    <p>
                      Recent market movements have increased concentration risk
                      in your portfolio. We recommend scheduling a portfolio
                      review call to discuss whether your current allocation
                      remains aligned with your long-term objectives.
                    </p>
                    <p>
                      This message is based on your latest portfolio holdings,
                      approved risk profile and the AlphaVest Q2 market
                      assessment. No changes will be made without your explicit
                      instruction.
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusChip tone="info">
                      {communicationRouteLabels[route]}
                    </StatusChip>
                    <StatusChip tone={visibility.clientVisible ? "success" : "warning"}>
                      {visibility.clientVisible ? "Released" : "Blocked until release"}
                    </StatusChip>
                  </div>
                </div>

                <div className="rounded-lg border border-av-line bg-av-midnight/40 p-4">
                  <p className="text-sm font-semibold text-av-ivory">
                    Important Disclosures
                  </p>
                  <p className="mt-2 text-sm leading-6 text-av-muted">
                    Portfolio recommendations are subject to your investment
                    objectives, risk tolerance and liquidity needs. Past
                    performance is not a guarantee of future returns.
                  </p>
                </div>

                <div className="rounded-lg border border-av-line bg-av-midnight/40 p-4">
                  <p className="text-sm font-semibold text-av-ivory">
                    Linked Recommendation / Next Step
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-av-muted">
                    <span>Schedule review call for concentration risk.</span>
                    <button
                      className="rounded-lg border border-av-line px-3 py-2 text-av-muted"
                      type="button"
                    >
                      View Recommendation
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-lg border border-av-line bg-av-midnight/40 p-4">
                  <p className="text-sm font-semibold text-av-ivory">
                    Contextual Summary
                  </p>
                  <div className="mt-3">
                    <DashboardTable
                      columns={["Field", "Value"]}
                      rows={[
                        ["Client", "Jordan Smith"],
                        ["Household", "Smith Household"],
                        ["Account(s)", "3 Accounts"],
                        ["Topic", "Portfolio concentration risk"],
                        ["Channel", "Email"],
                        ["Scheduled Send", "Pending approval gate"]
                      ]}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-av-line bg-av-midnight/40 p-4">
                  <p className="text-sm font-semibold text-av-ivory">
                    Approval & Compliance Status
                  </p>
                  <div className="mt-3 grid gap-2">
                    {[
                      ["Advisor Approval", releaseState.advisorApproval ? "APPROVED" : "PENDING"],
                      ["Compliance Review", releaseState.complianceRelease ? "RELEASED" : "PENDING"],
                      ["Human Review Step", releaseState.advisorApproval ? "Completed" : "Required"],
                      ["Compliance Step", releaseState.complianceRelease ? "Completed" : "Required"]
                    ].map(([label, value]) => (
                      <div
                        className="flex items-center justify-between rounded border border-av-line/50 bg-av-panelSoft px-3 py-2 text-sm"
                        key={label}
                      >
                        <span className="text-av-muted">{label}</span>
                        <StatusChip
                          tone={
                            value === "APPROVED" ||
                            value === "RELEASED" ||
                            value === "Completed"
                              ? "success"
                              : "warning"
                          }
                        >
                          {value}
                        </StatusChip>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-av-warning/60 bg-av-warning/10 p-4">
                  <WorkflowBadge label="BLOCKED" />
                  <p className="mt-3 text-sm leading-6 text-av-ivory">
                    Preview is blocked until both approvals are complete. Send
                    to Client remains disabled until Advisor Approval and
                    Compliance Release are complete.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-av-line/50 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted"
                  type="button"
                >
                  Save Draft
                </button>
                <button
                  className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted"
                  type="button"
                >
                  Return for Revision
                </button>
              </div>
              <p className="max-w-md text-xs text-av-muted">
                Send to Client is disabled. Reason: Awaiting final approvals.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-semibold",
                    sendTransition.allowed
                      ? "border-av-gold bg-av-gold text-av-midnight"
                      : "border-av-line text-av-muted"
                  )}
                  disabled={!sendTransition.allowed}
                  onClick={() =>
                    void transition({
                      action: "communication.send",
                      actorRole: "Client Success"
                    })
                  }
                  type="button"
                >
                  Send to Client
                </button>
                <button
                  className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted"
                  onClick={() => setPreviewOpen(false)}
                  type="button"
                >
                  Back to communication workflow
                </button>
              </div>
              {error ? <p className="w-full text-sm text-av-danger">{error}</p> : null}
            </div>
          </section>
        </div>
      ) : null}
    </Phase8Frame>
  );
}

function ReferenceBadge({ path }: { path: "/service-blueprint" | "/journey" | "/roadmap" }) {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusChip tone="review">
        {isReferenceRoute(path) ? "Internal / reference" : "Product"}
      </StatusChip>
      <StatusChip tone="info">Not client-facing</StatusChip>
    </div>
  );
}

export function Phase8ServiceBlueprintScreen() {
  return (
    <Phase8Frame
      label="Internal / reference"
      title="Service blueprint"
      subtitle="A reference view of the end-to-end WealthOS journey, showing what the client sees, what AlphaVest does backstage, and where evidence is created."
    >
      <ReferenceBadge path="/service-blueprint" />

      <GlassPanel title="Full Swimlane View">
        <div className="overflow-x-auto">
          <div className="grid min-w-[72rem] grid-cols-[13rem_repeat(10,minmax(8rem,1fr))] gap-2 text-xs">
            <div className="rounded-lg border border-av-line bg-av-panelSoft p-3 text-av-goldBright">
              Swimlane
            </div>
            {serviceBlueprintStages.map((stage) => (
              <div
                className="rounded-lg border border-av-line bg-av-panelSoft p-3 text-av-goldBright"
                key={stage}
              >
                {stage}
              </div>
            ))}
            {serviceBlueprintLanes.map((lane) => (
              <Fragment key={lane.lane}>
                <div
                  className="rounded-lg border border-av-line bg-av-midnight/60 p-3 font-semibold text-av-ivory"
                >
                  {lane.lane}
                </div>
                {serviceBlueprintStages.map((stage, index) => (
                  <div
                    className={cn(
                      "min-h-24 rounded-lg border border-av-line/60 bg-av-midnight/35 p-3 text-av-muted",
                      lane.lane === "Evidence" && "border-av-success/50"
                    )}
                    key={`${lane.lane}-${stage}`}
                  >
                    {lane.examples[index % lane.examples.length]}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <GlassPanel title="Evidence Chain">
          <ol className="grid gap-3 md:grid-cols-3">
            {evidenceChain.map((item, index) => (
              <li
                className="rounded-lg border border-av-line bg-av-midnight/45 p-3 text-sm"
                key={item}
              >
                <span className="mb-2 inline-grid size-7 place-items-center rounded-full border border-av-gold text-av-gold">
                  {index + 1}
                </span>
                <p className="font-semibold text-av-ivory">{item}</p>
                <p className="mt-1 text-xs text-av-muted">
                  Linked before visibility or final decision where applicable.
                </p>
              </li>
            ))}
          </ol>
        </GlassPanel>

        <GlassPanel title="Escalation / Returns View">
          <DashboardTable
            columns={["Trigger", "Return loop", "Owner"]}
            rows={escalationLoops.map((loop) => [
              loop.trigger,
              loop.returnTo,
              loop.owner
            ])}
          />
        </GlassPanel>
      </div>
    </Phase8Frame>
  );
}

export function Phase8RoadmapScreen() {
  return (
    <Phase8Frame
      label="Planning / reference"
      title="MVP and future scope"
      subtitle="A planning view that separates implemented MVP capability from later-phase and future features without presenting future automation as live product behavior."
    >
      <ReferenceBadge path="/roadmap" />

      <div className="grid gap-5 lg:grid-cols-3">
        {roadmapColumns.map((column) => (
          <GlassPanel
            actions={<StatusChip tone={column.tone as StatusTone}>{column.title}</StatusChip>}
            className="min-h-80"
            key={column.title}
            title={`${column.title} scope`}
          >
            <ul className="grid gap-3 text-sm text-av-muted">
              {column.items.map((item) => (
                <li
                  className="rounded-lg border border-av-line/60 bg-av-midnight/45 p-3"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_30rem]">
        <GlassPanel title="Blocked / Not-MVP-Ready Features">
          <DashboardTable
            columns={["Feature", "Reason", "Dependency"]}
            rows={blockedFeatures.map((item) => [
              item.feature,
              item.reason,
              item.dependency
            ])}
          />
        </GlassPanel>

        <GlassPanel title="Dependency Flow">
          <ol className="grid gap-2">
            {roadmapDependencies.map(([from, to], index) => {
              const allowed = canTransition("recommendation", "released", "client_visible", {
                advisorApproval: true,
                complianceRelease: true,
                evidenceRecordExists: true,
                permissionCheck: true
              }).allowed;

              return (
                <li
                  className="rounded-lg border border-av-line bg-av-midnight/45 p-3 text-sm"
                  key={`${from}-${to}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-av-ivory">
                      {index + 1}. {from}
                    </span>
                    <StatusChip tone={allowed ? "success" : "warning"}>
                      Gate
                    </StatusChip>
                  </div>
                  <p className="mt-2 text-av-muted">Unlocks: {to}</p>
                </li>
              );
            })}
          </ol>
        </GlassPanel>
      </div>
    </Phase8Frame>
  );
}
