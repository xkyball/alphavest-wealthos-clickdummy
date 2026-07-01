"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useActorSession } from "@/components/actor-session-provider";
import { disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { cn } from "@/lib/cn";

type GlobalSearchResult = {
  description: string;
  href: string;
  id: string;
  label: string;
  status: string;
  type: string;
};

type GlobalSearchBoxProps = {
  className?: string;
  disabledReason?: string;
  placeholder?: string;
};

export function GlobalSearchBox({ className, disabledReason, placeholder = "Search workspace..." }: GlobalSearchBoxProps) {
  const { session } = useActorSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const trimmedQuery = query.trim();
  const disabled = Boolean(disabledReason);
  const descriptionId = "global-search-state";
  const disabledReasonId = disabledReason ? disabledControlReasonId("global-search") : undefined;
  const resultPanelId = "global-search-results";
  const searchUrl = useMemo(() => {
    const params = new URLSearchParams({
      actorTenantSlug: session.tenant.slug,
      q: trimmedQuery,
      roleKey: session.role.key,
      tenantSlug: session.tenant.slug,
    });

    return `/api/global-search?${params.toString()}`;
  }, [session.role.key, session.tenant.slug, trimmedQuery]);

  useEffect(() => {
    if (disabled || trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const handle = window.setTimeout(() => {
      setState("loading");
      fetch(searchUrl, { cache: "no-store", signal: controller.signal })
        .then(async (response) => {
          const body = (await response.json()) as { results?: GlobalSearchResult[] };

          if (!response.ok) {
            throw new Error("Global search failed.");
          }

          setResults(body.results ?? []);
          setState("ready");
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          setResults([]);
          setState("error");
        });
    }, 160);

    return () => {
      controller.abort();
      window.clearTimeout(handle);
    };
  }, [disabled, searchUrl, trimmedQuery.length]);

  const hasPanel = !disabled && trimmedQuery.length >= 2;
  const visibleResults = hasPanel ? results : [];
  const visibleState = hasPanel ? state : "idle";
  const resultCountLabel = visibleResults.length === 1 ? "1 workspace match" : `${visibleResults.length} workspace matches`;

  return (
    <div className={cn("relative min-w-0", className)}>
      <label className="block">
        <span className="sr-only">Global search</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-5 size-4 -translate-y-1/2 text-alphavest-subtle" />
        <input
          aria-controls={resultPanelId}
          aria-describedby={disabledReasonId ? `${descriptionId} ${disabledReasonId}` : descriptionId}
          aria-expanded={hasPanel}
          className={cn(
            "h-10 w-full rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-10 pr-28 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold",
            disabled ? "cursor-not-allowed opacity-70" : "",
          )}
          data-ux-disabled-message={disabledReason ? "visible" : undefined}
          data-ux-disabled-reason={disabledReason}
          disabled={disabled}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (!disabled && event.key === "Enter" && results[0]) {
              window.location.assign(results[0].href);
            }
          }}
          placeholder={placeholder}
          role="combobox"
          type="search"
          value={query}
        />
        <span
          className="pointer-events-none absolute right-3 top-5 hidden -translate-y-1/2 rounded border border-alphavest-border px-1.5 py-0.5 text-xs text-alphavest-subtle md:block"
          data-testid="global-search-scope-badge"
          title="Workspace filtered search"
        >
          Workspace
        </span>
      </label>
      <p className="sr-only" id={descriptionId}>
        {disabledReason ?? "Searches workspace records for the current access context."}
      </p>
      {disabledReason ? (
        <p className="mt-1 text-xs text-alphavest-muted" data-testid="ux-disabled-control-reason" data-ux-disabled-reason={disabledReason} id={disabledReasonId}>
          {disabledReason}
        </p>
      ) : null}
      {hasPanel ? (
        <div
          aria-label="Global search results"
          className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-md border border-alphavest-border bg-alphavest-panel shadow-2xl"
          id={resultPanelId}
          role="listbox"
        >
          {visibleState === "loading" ? <p className="p-4 text-sm text-alphavest-muted">Searching tenant records...</p> : null}
          {visibleState === "error" ? <p className="p-4 text-sm text-alphavest-red">Search failed closed for this context.</p> : null}
          {visibleState === "ready" && visibleResults.length === 0 ? <p className="p-4 text-sm text-alphavest-muted">No matching rows found.</p> : null}
          {visibleState === "ready" && visibleResults.length > 0 ? (
            <p className="border-b border-alphavest-border/55 px-4 py-2 text-xs font-semibold text-alphavest-gold-soft" role="status">
              {resultCountLabel}
            </p>
          ) : null}
          {visibleResults.map((result) => (
            <a
              aria-selected="false"
              className="block border-b border-alphavest-border/55 px-4 py-3 text-sm transition last:border-0 hover:bg-alphavest-charcoal/70"
              href={result.href}
              key={result.id}
              role="option"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="min-w-0 font-semibold text-alphavest-ivory">{result.label}</span>
                <span className="shrink-0 rounded border border-alphavest-border px-2 py-0.5 text-xs text-alphavest-gold-soft">
                  {result.type}
                </span>
              </span>
              <span className="mt-1 block truncate text-xs text-alphavest-muted">
                {result.status} - {result.description}
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
