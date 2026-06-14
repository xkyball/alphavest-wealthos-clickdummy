"use client";

import { useMemo, useState } from "react";
import { auditEventForAction } from "@/lib/audit";
import { canShowClientAdviceLikeOutput } from "@/lib/visibility";
import {
  cn,
  DashboardTable,
  GateChecklist,
  GlassPanel,
  StatusChip,
  WorkflowBadge
} from "./ui";
import { findDemoWorkflow, useDemoSession } from "./use-demo-session";

function InternalFrame({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
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
                <p className="text-sm text-av-goldBright">AlphaVest WealthOS</p>
                <p className="text-xs uppercase text-av-muted">
                  Internal workflow surface
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
          <StatusChip tone="review">Internal</StatusChip>
        </header>
        {children}
      </div>
    </article>
  );
}

function VisibilityGatePanel({
  advisorApproval,
  complianceRelease,
  evidenceRecordExists,
  permissionCheck,
  released
}: {
  advisorApproval: boolean;
  complianceRelease: boolean;
  evidenceRecordExists: boolean;
  permissionCheck: boolean;
  released: boolean;
}) {
  const result = canShowClientAdviceLikeOutput({
    advisorApproval,
    complianceRelease,
    evidenceRecord: evidenceRecordExists,
    permissionCheck,
    outputClassification: "recommendation",
    clientVisibilityState: released ? "released" : "blocked"
  });

  return (
    <GlassPanel
      title="Advice Visibility Gate"
      actions={<WorkflowBadge label={result.clientVisible ? "CLIENT" : "BLOCKED"} />}
    >
      <GateChecklist
        items={[
          { label: "Advisor approval", complete: advisorApproval },
          { label: "Compliance release", complete: complianceRelease },
          { label: "Evidence record", complete: evidenceRecordExists },
          { label: "Permission check", complete: permissionCheck },
          { label: "Released state", complete: released }
        ]}
      />
      <p className="mt-3 text-xs text-av-muted">
        Advisor approval alone never makes advice-like content client-visible.
      </p>
    </GlassPanel>
  );
}

const signalSources = [
  "Markets",
  "Currencies",
  "Tax / Regulatory Updates",
  "Portfolio Changes",
  "Insurance Expiry",
  "Document Gaps",
  "Life Events",
  "Mobility Events",
  "Succession Milestones",
  "Advisor Input",
  "Client Input"
];

const signalOutputs = [
  "Review required",
  "Protection gap",
  "Liquidity action needed",
  "Mobility decision point",
  "Portfolio exposure review",
  "Document missing",
  "Advisor input required",
  "Compliance review required"
];

const signalMap: Record<string, string[]> = {
  Markets: ["Review required", "Portfolio exposure review"],
  "Insurance Expiry": ["Protection gap", "Advisor input required"],
  "Document Gaps": ["Document missing", "Compliance review required"],
  "Mobility Events": ["Mobility decision point", "Compliance review required"],
  "Client Input": ["Advisor input required", "Review required"]
};

export function InternalSignalsScreen() {
  const [selected, setSelected] = useState("Document Gaps");
  const highlighted = signalMap[selected] ?? ["Review required"];

  return (
    <InternalFrame
      title="Signal and trigger review"
      subtitle="Classify incoming signals as review points. No trigger is treated as final advice or auto-executed output."
    >
      <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)_22rem]">
        <GlassPanel title="Signal Sources">
          <div className="grid gap-2">
            {signalSources.map((source) => (
              <button
                className={cn(
                  "rounded-lg border px-3 py-3 text-left text-sm transition",
                  selected === source
                    ? "border-av-gold bg-av-gold/15 text-av-ivory"
                    : "border-av-line bg-av-midnight/45 text-av-muted hover:border-av-gold"
                )}
                key={source}
                onClick={() => setSelected(source)}
                type="button"
              >
                {source}
              </button>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Processing Layer">
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-4">
              {["Ingest", "Correlate", "Classify", "Route"].map((step, index) => (
                <div
                  className="rounded-lg border border-av-line bg-av-midnight/45 p-4 text-sm"
                  key={step}
                >
                  <span className="mb-3 inline-grid size-7 place-items-center rounded-full border border-av-gold text-av-gold">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-av-ivory">{step}</p>
                  <p className="mt-2 text-xs text-av-muted">
                    Evidence-backed review logic.
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-av-gold bg-av-gold/10 p-6 text-center">
              <p className="font-display text-3xl text-av-goldBright">
                Trigger review only
              </p>
              <p className="mt-2 text-sm text-av-muted">
                System output routes work to humans; it does not publish advice.
              </p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel title="Trigger Outputs">
          <div className="grid gap-2">
            {signalOutputs.map((output) => (
              <div
                className={cn(
                  "rounded-lg border px-3 py-3 text-sm",
                  highlighted.includes(output)
                    ? "border-av-gold bg-av-gold/15 text-av-ivory"
                    : "border-av-line/60 bg-av-midnight/45 text-av-muted"
                )}
                key={output}
              >
                {output}
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel title="Client-Visible Boundary">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-av-muted">
            Clients may see neutral review notices only after the relevant gate
            opens. Internal scores, processing notes and confidence details stay
            backstage.
          </p>
          <WorkflowBadge label="BLOCKED" />
        </div>
      </GlassPanel>
    </InternalFrame>
  );
}

export function InternalAdvisorApprovalScreen() {
  const [decision, setDecision] = useState<"review" | "approved" | "call">("review");
  const { snapshot, transition, error } = useDemoSession();
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const advisorApproval = recommendation?.advisorApproval ?? decision === "approved";
  const complianceRelease = recommendation?.complianceRelease ?? false;
  const evidenceRecordExists = recommendation?.evidenceRecordExists ?? true;
  const permissionCheck = recommendation?.permissionCheck ?? true;
  const released = recommendation?.clientVisibilityState === "released";

  return (
    <InternalFrame
      title="Advisor approval"
      subtitle="Review evidence, approve for compliance, request more data or escalate to a call. Approval does not release content to the client."
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="grid gap-5">
          <GlassPanel title="Advisor Review">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Trigger summary", "Liquidity requirement exceeds current policy buffer."],
                ["Client objective", "Preserve flexibility while avoiding unnecessary product movement."],
                ["Documents reviewed", "Policy schedule, cash-flow forecast, trust deed, mandate."],
                ["Risk view", "Advice wording remains conditional until compliance release."]
              ].map(([title, detail]) => (
                <div className="rounded border border-av-line/50 bg-av-midnight/45 p-3 text-sm" key={title}>
                  <p className="font-semibold text-av-ivory">{title}</p>
                  <p className="mt-1 text-av-muted">{detail}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel title="Suggested Client Wording">
            <p className="text-sm text-av-muted">
              This wording remains internal until compliance releases it and an
              evidence record is linked.
            </p>
          </GlassPanel>
        </div>

        <div className="grid content-start gap-5">
          <GlassPanel title="Advisor Decision">
            <div className="grid gap-2">
              <button
                className="rounded-lg border border-av-gold bg-av-gold px-4 py-2 text-sm font-semibold text-av-midnight"
                onClick={async () => {
                  setDecision("approved");
                  await transition({ action: "advisor.approve", actorRole: "Senior Advisor" });
                }}
                type="button"
              >
                Approve for compliance
              </button>
              <button
                className="rounded-lg border border-av-line px-4 py-2 text-sm text-av-muted"
                onClick={() => setDecision("review")}
                type="button"
              >
                Request more data
              </button>
              <button
                className="rounded-lg border border-av-warning px-4 py-2 text-sm text-av-warning"
                onClick={async () => {
                  setDecision("call");
                  await transition({ action: "advisor.request_call", actorRole: "Senior Advisor" });
                }}
                type="button"
              >
                Escalate to call
              </button>
            </div>
            <p className="mt-4 text-sm text-av-muted">
              Current state: {recommendation?.state ?? decision}.
            </p>
            {error ? <p className="mt-2 text-sm text-av-danger">{error}</p> : null}
          </GlassPanel>
          <VisibilityGatePanel
            advisorApproval={advisorApproval}
            complianceRelease={complianceRelease}
            evidenceRecordExists={evidenceRecordExists}
            permissionCheck={permissionCheck}
            released={released}
          />
        </div>
      </div>
    </InternalFrame>
  );
}

export function InternalComplianceScreen() {
  const [status, setStatus] = useState<"review" | "released" | "blocked">("review");
  const { snapshot, transition, error } = useDemoSession();
  const recommendation = findDemoWorkflow(snapshot, "wf-trust-x-recommendation");
  const advisorApproval = recommendation?.advisorApproval ?? true;
  const complianceRelease = recommendation?.complianceRelease ?? status === "released";
  const evidenceRecordExists = recommendation?.evidenceRecordExists ?? status !== "blocked";
  const permissionCheck = recommendation?.permissionCheck ?? true;
  const released = recommendation?.clientVisibilityState === "released" || status === "released";
  const audit = useMemo(
    () =>
      auditEventForAction({
        actorRole: "Compliance Officer",
        action:
          status === "released"
            ? "compliance.released"
            : status === "blocked"
              ? "compliance.blocked"
              : "compliance.reviewed",
        objectType: "Compliance Release Record",
        objectId: "release-1842",
        result:
          status === "released"
            ? "released"
            : status === "blocked"
              ? "blocked"
              : "updated"
      }),
    [status]
  );

  return (
    <InternalFrame
      title="Compliance console"
      subtitle="Release or block advice-like output using evidence, permission and audit checks. This is the final client-visibility control."
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="grid gap-5">
          <GlassPanel title="Compliance Queue">
            <DashboardTable
              columns={["ID", "Output", "Classification", "Advisor", "Evidence", "Permission", "Status", "Age"]}
              rows={[
                ["OUT-1842", recommendation?.title ?? "Liquidity recommendation", "Advice-relevant", "R. Lee", evidenceRecordExists ? "Complete" : "Missing", permissionCheck ? "Allowed" : "Blocked", recommendation?.state ?? status, "1d"],
                ["OUT-1843", "Document request", "Information", "M. Chen", "Partial", "Allowed", "review", "2d"],
                ["OUT-1844", "Entity restructure note", "Advice", "A. Patel", "Missing ROA", "Blocked", "blocked", "4d"]
              ]}
            />
          </GlassPanel>

          <GlassPanel title="Selected Output">
            <p className="text-sm text-av-muted">
              Release is allowed only when evidence, advisor approval, compliance
              review and publish permission are complete.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border border-av-success px-4 py-2 text-sm text-av-success"
                onClick={async () => {
                  setStatus("released");
                  await transition({ action: "compliance.release", actorRole: "Compliance Officer" });
                }}
                type="button"
              >
                Release to client
              </button>
              <button
                className="rounded-lg border border-av-danger px-4 py-2 text-sm text-av-danger"
                onClick={async () => {
                  setStatus("blocked");
                  await transition({ action: "compliance.block", actorRole: "Compliance Officer" });
                }}
                type="button"
              >
                Block / request evidence
              </button>
            </div>
            {error ? <p className="mt-3 text-sm text-av-danger">{error}</p> : null}
          </GlassPanel>
        </div>

        <div className="grid content-start gap-5">
          <VisibilityGatePanel
            advisorApproval={advisorApproval}
            complianceRelease={complianceRelease}
            evidenceRecordExists={evidenceRecordExists}
            permissionCheck={permissionCheck}
            released={released}
          />
          <GlassPanel title="Audit Event">
            <div className="grid gap-2 text-xs text-av-muted">
              <p>Action: {audit.action}</p>
              <p>Actor: {audit.actorRole}</p>
              <p>Object: {audit.objectType}</p>
              <p>Evidence: {audit.evidenceLink}</p>
            </div>
          </GlassPanel>
        </div>
      </div>
    </InternalFrame>
  );
}
