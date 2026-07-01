import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { cn } from "@/lib/cn";
import {
  uxPrimitiveInteractionAttributesFor,
  uxPrimitiveInteractionClassFor,
} from "@/lib/ux-design-system-foundation";
import {
  uxDataSurfaceAttributesFor,
  type UxDataSurfaceDensityInput,
  type UxDataSurfaceFamily,
  type UxDataSurfaceFilterState,
  type UxMasterDetailMode,
} from "@/lib/ux-data-surface-contract";

type FilterOption = {
  disabledAriaLabel?: string;
  label: string;
  value: string;
};

type FilterBarProps = {
  activeFilterCount?: number;
  activeStateLabel?: string;
  density?: UxDataSurfaceDensityInput;
  family?: UxDataSurfaceFamily;
  filters?: FilterOption[];
  filterState?: UxDataSurfaceFilterState;
  masterDetailMode?: UxMasterDetailMode;
  mobilePlaceholder?: string;
  onReset?: () => void;
  onQueryChange?: (value: string) => void;
  placeholder?: string;
  queryValue?: string;
  resetLabel?: string;
  searchTestId?: string;
  tabs?: FilterOption[];
};

const inputClass =
  "h-[var(--field-height)] w-full rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-9 text-sm text-alphavest-ivory placeholder:text-alphavest-subtle";

export function FilterBar({
  activeFilterCount = 0,
  activeStateLabel,
  density = "standard_review",
  family = "list",
  filters = [],
  filterState,
  masterDetailMode = "none",
  mobilePlaceholder,
  onReset,
  onQueryChange,
  placeholder = "Search...",
  queryValue = "",
  resetLabel = "Reset filters",
  searchTestId,
  tabs = [],
}: FilterBarProps) {
  const hasQuery = queryValue.trim().length > 0;
  const hasActiveFilter = activeFilterCount > 0 || tabs.length > 0;
  const resolvedFilterState =
    filterState ??
    (hasQuery && hasActiveFilter
      ? "active_query_and_filter"
      : hasQuery
        ? "active_query"
        : hasActiveFilter
          ? "active_filter"
          : filters.length > 0
            ? "disabled_static"
            : "inactive");
  const activeSummary =
    activeStateLabel ??
    (resolvedFilterState === "active_query_and_filter"
      ? `Query and ${activeFilterCount || tabs.length} filter ${activeFilterCount === 1 ? "state" : "states"} active.`
        : resolvedFilterState === "active_query"
        ? `Search active: ${queryValue}.`
        : resolvedFilterState === "active_filter"
          ? `${activeFilterCount || tabs.length} filter ${activeFilterCount === 1 ? "state" : "states"} active.`
          : resolvedFilterState === "disabled_static"
            ? "Optional filters are unavailable for this view. Search and row sorting remain available."
            : "No query or filter is active.");

  return (
    <div
      className="space-y-3"
      data-ux-density-readability="true"
      {...uxDataSurfaceAttributesFor({
        actionPolicy: "none",
        density,
        family,
        filterState: resolvedFilterState,
        masterDetailMode,
        stickyHeader: false,
        stickyRail: false,
      })}
    >
      {tabs.length > 0 ? (
        <div className="flex flex-wrap gap-2" data-ux-data-surface-filter-state="active_filter">
          {tabs.map((tab, index) => (
            <Badge
              className={index === 0 ? uxPrimitiveInteractionClassFor("selected") : undefined}
              data-ux-filter-tab-state={index === 0 ? "selected" : "available"}
              key={tab.value}
              tone={index === 0 ? "gold" : "muted"}
              {...(index === 0 ? uxPrimitiveInteractionAttributesFor("selected") : {})}
            >
              {tab.label}
            </Badge>
          ))}
        </div>
      ) : null}

      <div
        aria-live="polite"
        className="av-readable-surface flex flex-wrap items-center justify-between gap-3 rounded-md border border-alphavest-border/60 bg-alphavest-navy/30 px-3 py-2 text-xs text-alphavest-muted"
        data-ux-density-readability="true"
        data-testid="ux-filter-active-state"
        data-ux-data-surface-filter-state={resolvedFilterState}
      >
        <span>{activeSummary}</span>
        {onReset && resolvedFilterState !== "inactive" && resolvedFilterState !== "disabled_static" ? (
          <button
            className={cn(
              "rounded-sm text-alphavest-gold-soft underline-offset-4 hover:underline",
              uxPrimitiveInteractionClassFor("focus-visible"),
            )}
            data-testid="ux-filter-reset"
            onClick={onReset}
            type="button"
            {...uxPrimitiveInteractionAttributesFor("focus-visible")}
          >
            {resetLabel}
          </button>
        ) : null}
      </div>

      <div className="av-readable-surface flex flex-col gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3 lg:flex-row lg:flex-wrap lg:items-center">
        <label className="relative min-w-0 flex-1 lg:min-w-72">
          <span className="sr-only">{placeholder}</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          <input
            className={cn(inputClass, "sm:hidden", uxPrimitiveInteractionClassFor("focus-visible"))}
            data-ux-data-surface-filter-state={resolvedFilterState}
            data-testid={searchTestId ? `${searchTestId}-mobile` : undefined}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder={mobilePlaceholder ?? placeholder}
            type="search"
            value={queryValue}
            {...uxPrimitiveInteractionAttributesFor("focus-visible")}
          />
          <input
            className={cn(inputClass, "hidden sm:block", uxPrimitiveInteractionClassFor("focus-visible"))}
            data-ux-data-surface-filter-state={resolvedFilterState}
            data-testid={searchTestId}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder={placeholder}
            type="search"
            value={queryValue}
            {...uxPrimitiveInteractionAttributesFor("focus-visible")}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const disabledReason = "This filter is unavailable for the current queue.";
            const disabledReasonId = disabledControlReasonId(`filter-${filter.value}`);

            return (
              <button
                aria-describedby={disabledReasonId}
                aria-label={filter.disabledAriaLabel ?? `${filter.label} filter is unavailable for this queue`}
                className={cn(
                  "inline-flex h-[var(--field-height)] items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm text-alphavest-muted opacity-65",
                  uxPrimitiveInteractionClassFor("disabled"),
                )}
                data-ux-affordance="blocked-filter-button"
                data-ux-data-surface-filter-state="disabled_static"
                data-ux-disabled-message="accessible"
                data-ux-disabled-reason={disabledReason}
                data-ux-interactive="false"
                disabled
                key={filter.value}
                title={disabledReason}
                type="button"
                {...uxPrimitiveInteractionAttributesFor("disabled")}
              >
                <SlidersHorizontal aria-hidden="true" className="size-4" />
                {filter.label}
                <DisabledControlReason id={disabledReasonId} reason={disabledReason} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
