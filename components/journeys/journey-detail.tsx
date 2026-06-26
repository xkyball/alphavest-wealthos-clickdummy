"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, LockKeyhole, Play, RefreshCw, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { useDemoSession } from "@/components/demo-session-provider";
import { StatusChip, type StatusChipStatus } from "@/components/ui/status-chip";
import { cn } from "@/lib/cn";
import {
  demoJwtForSession,
  journeyApi,
  safeErrorMessage,
  type JourneyAuditResponse,
  type JourneyClientProjectionResponse,
  type JourneyCommandResponse,
  type JourneyDetail as JourneyDetailPayload,
  type JourneyDetailResponse,
  type JourneyEvidenceResponse,
  type JourneyNextAction,
  type JourneyStepProjection,
} from "./journey-api-client";
import type { DemoSession } from "@/lib/demo-session";

type JourneyDetailState = {
  audit: JourneyAuditResponse | null;
  clientProjection: JourneyClientProjectionResponse | null;
  detail: JourneyDetailPayload;
  evidence: JourneyEvidenceResponse | null;
};

function statusForJourney(status: JourneyDetailPayload["status"]): StatusChipStatus {
  if (status === "CREATED") return "PENDING";
  if (status === "BLOCKED") return "ON_HOLD";
  return status;
}

function StepRail({ currentStepKey, steps }: { currentStepKey?: string; steps: JourneyStepProjection[] }) {
  if (steps.length === 0) {
    return (
      <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/40 p-4 text-sm leading-6 text-alphavest-muted">
        Client-safe projection is available for this actor. Internal step details remain withheld from this view.
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {steps.map((step) => {
        const active = step.key === currentStepKey || step.status === "ACTIVE";
        const complete = step.status === "COMPLETED";

        return (
          <li
            className={cn(
              "rounded-md border p-3",
              active
                ? "border-alphavest-gold/60 bg-alphavest-gold/10"
                : "border-alphavest-border/70 bg-alphavest-charcoal/38"
            )}
            data-testid="journey-step"
            key={step.key}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                  complete
                    ? "border-emerald-300/70 bg-emerald-400/15 text-emerald-100"
                    : active
                    ? "border-alphavest-gold/70 bg-alphavest-gold/15 text-alphavest-gold-soft"
                    : "border-alphavest-border text-alphavest-subtle"
                )}
              >
                {complete ? <CheckCircle2 aria-hidden="true" className="size-4" /> : step.sortOrder / 10}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-alphavest-gold-soft">{step.stageKey}</p>
                <h3 className="mt-1 text-sm font-semibold text-alphavest-ivory">{step.title}</h3>
                <p className="mt-2 text-xs leading-5 text-alphavest-muted">
                  Actor: {step.actorRoleKey} · State: {step.status}
                  {step.requiresEvidence ? " · evidence required" : ""}
                  {step.requiresAudit ? " · audit required" : ""}
                </p>
                {step.blockerReason ? (
                  <p className="mt-2 rounded-md border border-red-400/35 bg-red-950/20 p-2 text-xs leading-5 text-red-100">
                    {step.blockerCode ?? "BLOCKED"}: {step.blockerReason}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function EvidencePanel({ evidence }: { evidence: JourneyEvidenceResponse | null }) {
  const requirements = evidence?.requirements ?? [];

  return (
    <section className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-4">
      <h2 className="font-display text-xl text-alphavest-ivory">Evidence requirements</h2>
      <p className="mt-2 text-xs leading-5 text-alphavest-muted">
        Evidence status is checked before release-oriented projection. Upload success is not evidence sufficiency.
      </p>
      <div className="mt-4 grid gap-3">
        {requirements.length > 0 ? (
          requirements.map((requirement) => (
            <article
              className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/42 p-3"
              data-testid="journey-evidence-requirement"
              key={requirement.key}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-alphavest-ivory">{requirement.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-alphavest-subtle">
                    {requirement.linkedObjectType} must reach {requirement.minEvidenceStatus} for {requirement.requiredForStepKey}.
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2 py-1 text-xs font-semibold",
                    requirement.met
                      ? "border-emerald-300/60 bg-emerald-400/10 text-emerald-100"
                      : "border-alphavest-border bg-alphavest-navy/35 text-alphavest-muted"
                  )}
                >
                  {requirement.met ? "Met" : "Open"}
                </span>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/42 p-3 text-sm text-alphavest-muted">
            No evidence requirements are exposed for this actor and work state.
          </p>
        )}
      </div>
    </section>
  );
}

function AuditPanel({ audit }: { audit: JourneyAuditResponse | null }) {
  const events = audit?.audit ?? [];

  return (
    <section className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-4">
      <h2 className="font-display text-xl text-alphavest-ivory">Audit spine</h2>
      <p className="mt-2 text-xs leading-5 text-alphavest-muted">
        Sensitive commands create audit evidence. Absence of an event means no command completion is being claimed here.
      </p>
      <div className="mt-4 space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
            <article className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/42 p-3" key={event.id}>
              <div className="flex items-start gap-3">
                <Clock3 aria-hidden="true" className="mt-0.5 size-4 text-alphavest-gold-soft" />
                <div>
                  <p className="text-sm font-semibold text-alphavest-ivory">
                    {event.commandKey} · {event.result}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-alphavest-subtle">
                    {event.actorRoleKey} · {new Date(event.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-alphavest-muted">
                    {event.fromStepKey ?? "start"} → {event.toStepKey ?? "no step change"}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/42 p-3 text-sm text-alphavest-muted">
            No journey command runs have been recorded for this instance.
          </p>
        )}
      </div>
    </section>
  );
}

function ClientProjectionPanel({ projection }: { projection: JourneyClientProjectionResponse | null }) {
  const clientProjection = projection?.projection;

  return (
    <section className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-4">
      <h2 className="font-display text-xl text-alphavest-ivory">Client projection preview</h2>
      <p className="mt-2 text-xs leading-5 text-alphavest-muted">
        Preview shows client-safe status only. Released summary appears only after compliance release; internal payloads stay hidden.
      </p>
      {clientProjection ? (
        <div className="mt-4 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/42 p-4">
          <p className="text-xs font-semibold uppercase text-alphavest-gold-soft">{clientProjection.journeyKey}</p>
          <h3 className="mt-1 text-sm font-semibold text-alphavest-ivory">{clientProjection.title}</h3>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">{clientProjection.nextAction.detail}</p>
          {clientProjection.releasedSummary ? (
            <p className="mt-3 rounded-md border border-emerald-300/35 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-100" data-testid="journey-released-summary">
              Released client-safe summary: {clientProjection.releasedSummary}
            </p>
          ) : (
            <p className="mt-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/30 p-3 text-xs leading-5 text-alphavest-muted" data-testid="journey-release-summary-held">
              Released summary held until compliance release succeeds.
            </p>
          )}
          <p className="mt-3 text-xs font-semibold uppercase text-alphavest-subtle">
            Safe state: {clientProjection.status}
          </p>
        </div>
      ) : (
        <p className="mt-4 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/42 p-3 text-sm text-alphavest-muted">
          Client projection is not available for this state.
        </p>
      )}
    </section>
  );
}

function actionCommand(nextAction: JourneyNextAction) {
  if (nextAction.type === "START") return "START";
  if (nextAction.type === "COMPLETE_STEP") return "COMPLETE_STEP";
  return null;
}

async function loadJourneyDetailState(session: DemoSession, journeyId: string) {
  const token = await demoJwtForSession(session);
  const detail = await journeyApi<JourneyDetailResponse>(`/api/journeys/${journeyId}`, token);
  const [audit, clientProjection, evidence] = await Promise.all([
    journeyApi<JourneyAuditResponse>(`/api/journeys/${journeyId}/audit`, token).catch(() => null),
    journeyApi<JourneyClientProjectionResponse>(`/api/journeys/${journeyId}/client-projection`, token).catch(() => null),
    journeyApi<JourneyEvidenceResponse>(`/api/journeys/${journeyId}/evidence-sufficiency`, token).catch(() => null),
  ]);

  return {
    state: {
      audit,
      clientProjection,
      detail: detail.detail,
      evidence,
    },
    token,
  };
}

export function JourneyDetail({ journeyId }: { journeyId: string }) {
  const { session } = useDemoSession();
  const [jwt, setJwt] = useState<string | null>(null);
  const [state, setState] = useState<JourneyDetailState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commandError, setCommandError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningCommand, setRunningCommand] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const loaded = await loadJourneyDetailState(session, journeyId);
      setJwt(loaded.token);
      setState(loaded.state);
    } catch (loadError) {
      setError(safeErrorMessage(loadError, "Work detail could not load."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      setLoading(true);
      setError(null);

      try {
        const loaded = await loadJourneyDetailState(session, journeyId);
        if (!active) return;
        setJwt(loaded.token);
        setState(loaded.state);
      } catch (loadError) {
        if (!active) return;
        setError(safeErrorMessage(loadError, "Work detail could not load."));
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadInitial();

    return () => {
      active = false;
    };
  }, [journeyId, session]);

  const detail = state?.detail;
  const projection = detail?.projection;
  const nextAction = projection?.nextAction;
  const command = nextAction ? actionCommand(nextAction) : null;
  const steps = useMemo(() => projection?.steps ?? [], [projection?.steps]);
  const actorMayRun =
    Boolean(command) &&
    (!nextAction?.actorRoleKey || nextAction.actorRoleKey === session.role.key || session.role.key === "admin");

  async function runCommand() {
    if (!jwt || !detail || !nextAction || !command) return;
    setRunningCommand(true);
    setCommandError(null);
    setFeedback(null);

    try {
      const result = await journeyApi<JourneyCommandResponse>(`/api/journeys/${detail.id}/commands`, jwt, {
        body: JSON.stringify({
          command,
          fromStepKey: command === "COMPLETE_STEP" ? nextAction.stepKey : undefined,
          reason: "Executed from Work Detail UI after user-visible permission and state feedback.",
        }),
        method: "POST",
      });
      setFeedback(
        `${result.command} accepted. Audit event ${result.auditEventId ?? "created by API"}. Client release and advice execution remain separate.`,
      );
      await load();
    } catch (runError) {
      setCommandError(safeErrorMessage(runError, "Workflow command failed closed."));
    } finally {
      setRunningCommand(false);
    }
  }

  if (loading && !state) {
    return (
      <div className="space-y-6" data-testid="journey-detail">
        <PageHeader
          description="Loading work state, evidence posture, audit preview and client projection."
          eyebrow="Wave 0-2 Work Detail"
          status="PROCESSING"
          title="Work Detail"
        />
        <div className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-8 text-center text-sm text-alphavest-muted">
          Loading work detail...
        </div>
      </div>
    );
  }

  if (error || !detail || !projection) {
    return (
      <div className="space-y-6" data-testid="journey-detail">
        <PageHeader
          description="The requested work item did not pass scoped API loading."
          eyebrow="Wave 0-2 Work Detail"
          recoveryAction={{ label: "Retry", onClick: load }}
          status="FAILED"
          title="Work Detail"
        />
        <section className="rounded-md border border-red-400/50 bg-red-950/25 p-4 text-sm leading-6 text-red-100">
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-5" />
            <p>{error ?? "Work detail unavailable."}</p>
          </div>
        </section>
      </div>
    );
  }

  const blocked = detail.status === "BLOCKED" || nextAction?.type === "RESOLVE_BLOCKER" || nextAction?.type === "BLOCKED";
  const projectionViewLabel = detail.projectionType === "client" ? "Client workspace" : "Team workspace";
  const actionButtonLabel = runningCommand ? "Running..." : command;
  const actionButtonContent = (
    <>
      {actorMayRun ? <Play aria-hidden="true" className="size-4" /> : <LockKeyhole aria-hidden="true" className="size-4" />}
      {actionButtonLabel}
    </>
  );
  const actionButtonClassName = cn(
    "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition",
    actorMayRun
      ? "bg-alphavest-gold text-alphavest-navy hover:bg-alphavest-gold-soft"
      : "cursor-not-allowed border border-alphavest-border text-alphavest-subtle"
  );

  return (
    <div className="space-y-6" data-testid="journey-detail">
      <PageHeader
        blockedReason={blocked ? projection.blockerReason ?? nextAction?.detail : undefined}
        description="Inspect the operational stage, actor-owned step, requirements, audit spine and client-safe projection before taking any command."
        eyebrow={`${detail.journeyKey} · ${projectionViewLabel}`}
        primaryAction={{ href: "/journeys", label: "Back to dashboard" }}
        recoveryAction={{ label: "Refresh", onClick: load }}
        status={statusForJourney(detail.status)}
        statusLabel="Work state is orientation only"
        title={projection.title}
      />

      <section
        aria-live="polite"
        className={cn(
          "rounded-md border p-4 text-sm",
          commandError
            ? "border-red-400/50 bg-red-950/25 text-red-100"
            : "border-alphavest-border bg-alphavest-panel/72 text-alphavest-muted"
        )}
      >
        <div className="flex items-start gap-3">
          {commandError ? (
            <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 text-red-200" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 text-alphavest-gold-soft" />
          )}
          <div>
            <p className="font-semibold text-alphavest-ivory">
              {commandError ? "Command feedback" : feedback ?? "Next safe action"}
            </p>
            <p className="mt-1 leading-6">{commandError ?? nextAction?.detail ?? "No action is available for this state."}</p>
          </div>
        </div>
      </section>

      {command ? (
        <section
          className="sticky bottom-3 z-20 rounded-md border border-alphavest-gold/45 bg-alphavest-navy/95 p-3 shadow-2xl shadow-black/30 xl:hidden"
          data-testid="journey-sticky-action"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-alphavest-gold-soft">Next safe action</p>
              <p className="mt-1 text-xs leading-5 text-alphavest-muted">
                {actorMayRun
                  ? "Runs through the API gate and audit spine; client release remains separate."
                  : `Required actor: ${nextAction?.actorRoleKey ?? "authorized operator"}.`}
              </p>
            </div>
            <button
              className={cn(actionButtonClassName, "sm:w-auto sm:px-4")}
              data-run2-action-state={actorMayRun ? "enabled" : "permission-denied"}
              disabled={!actorMayRun || runningCommand}
              onClick={runCommand}
              type="button"
            >
              {actionButtonContent}
            </button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-alphavest-ivory">Progress</h2>
              <p className="mt-2 text-xs leading-5 text-alphavest-muted">
                Stage: {projection.currentStageKey ?? "not started"} · Step:{" "}
                {projection.currentStepKey ?? projection.currentStepTitle ?? "client-safe status"}
              </p>
            </div>
            <StatusChip
              label={blocked ? "Blocked or gated" : undefined}
              sourceDescription="Work detail status is orientation only, not a completion gate."
              status={statusForJourney(detail.status)}
            />
          </div>
          <div className="mt-5">
            <StepRail currentStepKey={projection.currentStepKey} steps={steps} />
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-4">
            <h2 className="font-display text-xl text-alphavest-ivory">Available action</h2>
            <p className="mt-2 text-xs leading-5 text-alphavest-muted">
              Only API-supported commands are exposed. Permission denial leaves state unchanged; command acceptance never equals compliance release, client acceptance or advice execution.
            </p>
            <div className="mt-4 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/42 p-3">
              <p className="text-xs font-semibold uppercase text-alphavest-gold-soft">
                {nextAction?.type.replaceAll("_", " ") ?? "No action"}
              </p>
              <p className="mt-2 text-sm leading-6 text-alphavest-muted">{nextAction?.detail}</p>
              {command ? (
                <button
                  className={cn(actionButtonClassName, "mt-4")}
                  data-run2-action-state={actorMayRun ? "enabled" : "permission-denied"}
                  disabled={!actorMayRun || runningCommand}
                  onClick={runCommand}
                  type="button"
                >
                  {actionButtonContent}
                </button>
              ) : (
                <p className="mt-4 flex items-start gap-2 rounded-md border border-alphavest-border/70 bg-alphavest-navy/30 p-3 text-xs leading-5 text-alphavest-muted">
                  <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                  No command is exposed for this state.
                </p>
              )}
              {!actorMayRun && command && nextAction?.actorRoleKey ? (
                <p className="mt-3 text-xs leading-5 text-alphavest-subtle">
                  Required actor: {nextAction.actorRoleKey}. Current demo role: {session.role.key}.
                </p>
              ) : null}
            </div>
          </section>

          <Link
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/70 hover:text-alphavest-gold-soft"
            href="/journeys"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Work Dashboard
          </Link>

          <button
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/70 hover:text-alphavest-gold-soft"
            onClick={load}
            type="button"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            Refresh state
          </button>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <EvidencePanel evidence={state.evidence} />
        <AuditPanel audit={state.audit} />
        <ClientProjectionPanel projection={state.clientProjection} />
      </div>
    </div>
  );
}
