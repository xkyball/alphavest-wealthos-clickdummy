"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, LockKeyhole, Play, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { useDemoSession } from "@/components/demo-session-provider";
import { StatusChip, type StatusChipStatus } from "@/components/ui/status-chip";
import { cn } from "@/lib/cn";
import {
  demoJwtForSession,
  holdJourneyPlaceholders,
  journeyApi,
  safeErrorMessage,
  type JourneyDefinitionSummary,
  type JourneyListItem,
  type JourneyListResponse,
} from "./journey-api-client";

function statusForJourney(status: JourneyListItem["status"]): StatusChipStatus {
  if (status === "CREATED") return "PENDING";
  if (status === "BLOCKED") return "ON_HOLD";
  return status;
}

function JourneyCard({ journey }: { journey: JourneyListItem }) {
  const nextAction = journey.projection.nextAction;
  const blocked = journey.status === "BLOCKED" || nextAction.type === "RESOLVE_BLOCKER" || nextAction.type === "BLOCKED";

  return (
    <article
      className="rounded-md border border-alphavest-border bg-alphavest-panel/76 p-4 shadow-sm"
      data-testid="journey-worklist-card"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-alphavest-gold-soft">{journey.journeyKey}</p>
          <h2 className="mt-1 font-display text-xl text-alphavest-ivory">{journey.projection.title}</h2>
          <p className="mt-2 text-sm leading-6 text-alphavest-muted">{nextAction.detail}</p>
        </div>
        <StatusChip
          label={blocked ? "Blocked or gated" : undefined}
          sourceDescription="Journey status is an operational orientation only, not a completion gate."
          status={statusForJourney(journey.status)}
        />
      </div>
      <div className="mt-4 grid gap-2 text-xs text-alphavest-subtle sm:grid-cols-3">
        <div className="rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/45 p-3">
          <p className="font-semibold text-alphavest-muted">Current stage</p>
          <p className="mt-1 text-alphavest-ivory">{journey.projection.currentStageKey ?? "Not started"}</p>
        </div>
        <div className="rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/45 p-3">
          <p className="font-semibold text-alphavest-muted">Step</p>
          <p className="mt-1 text-alphavest-ivory">
            {journey.projection.currentStepTitle ?? journey.projection.currentStepKey ?? "Client-safe preview"}
          </p>
        </div>
        <div className="rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/45 p-3">
          <p className="font-semibold text-alphavest-muted">Next safe action</p>
          <p className="mt-1 text-alphavest-ivory">{nextAction.type.replaceAll("_", " ")}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          className="inline-flex h-10 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/70 hover:text-alphavest-gold-soft"
          href={`/journeys/${journey.id}`}
        >
          Open detail
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function DefinitionCard({
  definition,
  disabled,
  onStart,
  starting,
}: {
  definition: JourneyDefinitionSummary;
  disabled: boolean;
  onStart: (definition: JourneyDefinitionSummary) => void;
  starting: boolean;
}) {
  return (
    <article className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-alphavest-gold-soft">{definition.journeyKey}</p>
          <h3 className="mt-1 text-sm font-semibold text-alphavest-ivory">{definition.title}</h3>
          <p className="mt-2 text-xs leading-5 text-alphavest-subtle">
            Startable in Wave 0-2 for {definition.actorRoleKeys.join(", ")}.
          </p>
        </div>
        <button
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-semibold transition",
            disabled
              ? "cursor-not-allowed border border-alphavest-border text-alphavest-subtle"
              : "bg-alphavest-gold text-alphavest-navy hover:bg-alphavest-gold-soft"
          )}
          disabled={disabled}
          onClick={() => onStart(definition)}
          type="button"
        >
          {starting ? <RefreshCw aria-hidden="true" className="size-3.5 animate-spin" /> : <Play aria-hidden="true" className="size-3.5" />}
          Start
        </button>
      </div>
    </article>
  );
}

export function JourneyDashboard() {
  const router = useRouter();
  const { session } = useDemoSession();
  const [jwt, setJwt] = useState<string | null>(null);
  const [data, setData] = useState<JourneyListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingKey, setStartingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      setFeedback(null);

      try {
        const token = await demoJwtForSession(session);
        const list = await journeyApi<JourneyListResponse>("/api/journeys", token);
        if (!active) return;
        setJwt(token);
        setData(list);
      } catch (loadError) {
        if (!active) return;
        setError(safeErrorMessage(loadError));
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [session]);

  const activeJourneys = useMemo(() => data?.journeys ?? [], [data?.journeys]);
  const existingKeys = useMemo(() => new Set(activeJourneys.map((journey) => journey.journeyKey)), [activeJourneys]);
  const startableDefinitions = data?.availableDefinitions ?? [];

  async function refresh() {
    if (!jwt) return;
    setError(null);
    setLoading(true);
    try {
      setData(await journeyApi<JourneyListResponse>("/api/journeys", jwt));
    } catch (refreshError) {
      setError(safeErrorMessage(refreshError));
    } finally {
      setLoading(false);
    }
  }

  async function startJourney(definition: JourneyDefinitionSummary) {
    if (!jwt) return;
    setStartingKey(definition.journeyKey);
    setError(null);
    setFeedback(null);

    try {
      const created = await journeyApi<{ detail: { id: string }; ok: boolean }>("/api/journeys", jwt, {
        body: JSON.stringify({
          clientTenantId: session.tenant.id,
          journeyKey: definition.journeyKey,
        }),
        method: "POST",
      });
      setFeedback(`${definition.journeyKey} created. It remains unreleased until its gates pass.`);
      router.push(`/journeys/${created.detail.id}`);
    } catch (startError) {
      setError(safeErrorMessage(startError, "Journey creation failed closed."));
    } finally {
      setStartingKey(null);
    }
  }

  return (
    <div className="space-y-6" data-testid="journey-dashboard">
      <PageHeader
        description="Work from client-safe journeys, their current state, the next permitted action and any source-locked holds."
        eyebrow="Wave 0-2 Journey-first"
        recoveryAction={{ label: "Refresh", onClick: refresh }}
        status={error ? "FAILED" : loading ? "PROCESSING" : "ACTIVE"}
        statusLabel="Journey status is orientation only"
        title="Journey Dashboard"
      />

      <section
        aria-live="polite"
        className={cn(
          "rounded-md border p-4 text-sm",
          error
            ? "border-red-400/50 bg-red-950/25 text-red-100"
            : "border-alphavest-border bg-alphavest-panel/72 text-alphavest-muted"
        )}
      >
        <div className="flex items-start gap-3">
          {error ? <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 text-red-200" /> : <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 text-alphavest-gold-soft" />}
          <div>
            <p className="font-semibold text-alphavest-ivory">
              {error ? "Journey API feedback" : feedback ?? "Client-visible outcomes stay gated"}
            </p>
            <p className="mt-1 leading-6">
              {error ?? "This surface shows allowed work and blocked reasons. It does not claim evidence sufficiency, advice release or final approval."}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-alphavest-ivory">Active worklist</h2>
            <p className="text-xs font-semibold uppercase text-alphavest-subtle">{loading ? "Loading" : `${activeJourneys.length} scoped journeys`}</p>
          </div>
          {loading ? (
            <div className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-8 text-center text-sm text-alphavest-muted">
              Loading scoped journeys...
            </div>
          ) : activeJourneys.length > 0 ? (
            <div className="grid gap-4">
              {activeJourneys.map((journey) => (
                <JourneyCard journey={journey} key={journey.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-8 text-center text-sm text-alphavest-muted">
              No scoped journeys are available for this demo actor.
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-4">
            <h2 className="font-display text-xl text-alphavest-ivory">Startable definitions</h2>
            <p className="mt-2 text-xs leading-5 text-alphavest-muted">
              Starting creates an internal journey instance only. It does not release client advice.
            </p>
            <div className="mt-4 grid gap-3">
              {startableDefinitions.map((definition) => (
                <DefinitionCard
                  definition={definition}
                  disabled={startingKey !== null || existingKeys.has(definition.journeyKey)}
                  key={definition.journeyKey}
                  onStart={startJourney}
                  starting={startingKey === definition.journeyKey}
                />
              ))}
            </div>
          </section>

          <section className="rounded-md border border-alphavest-border bg-alphavest-panel/72 p-4" data-testid="journey-hold-panel">
            <h2 className="font-display text-xl text-alphavest-ivory">Hold placeholders</h2>
            <p className="mt-2 text-xs leading-5 text-alphavest-muted">
              These entries are source-locked and intentionally non-executable in Wave 0-2.
            </p>
            <div className="mt-4 grid gap-3">
              {holdJourneyPlaceholders.map((journey) => (
                <article
                  className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3"
                  data-testid="journey-hold-card"
                  key={journey.journeyKey}
                >
                  <div className="flex items-start gap-3">
                    <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-alphavest-gold-soft" />
                    <div>
                      <p className="text-xs font-semibold uppercase text-alphavest-gold-soft">
                        {journey.journeyKey} · {journey.reason}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-alphavest-ivory">{journey.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-alphavest-subtle">{journey.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
