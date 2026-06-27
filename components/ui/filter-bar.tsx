import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import {
  uxDataSurfaceAttributesFor,
  type UxDataSurfaceDensity,
  type UxDataSurfaceFamily,
  type UxDataSurfaceFilterState,
  type UxMasterDetailMode,
} from "@/lib/ux-data-surface-contract";

type FilterOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  density?: UxDataSurfaceDensity;
  family?: UxDataSurfaceFamily;
  filters?: FilterOption[];
  filterState?: UxDataSurfaceFilterState;
  masterDetailMode?: UxMasterDetailMode;
  mobilePlaceholder?: string;
  placeholder?: string;
  tabs?: FilterOption[];
};

const inputClass =
  "h-[var(--field-height)] w-full rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-9 text-sm text-alphavest-ivory outline-none placeholder:text-alphavest-subtle focus:border-alphavest-gold";

export function FilterBar({
  density = "standard_review",
  family = "list",
  filters = [],
  filterState,
  masterDetailMode = "none",
  mobilePlaceholder,
  placeholder = "Search...",
  tabs = [],
}: FilterBarProps) {
  const resolvedFilterState = filterState ?? (filters.length > 0 ? "disabled_static" : tabs.length > 0 ? "active_filter" : "inactive");

  return (
    <div
      className="space-y-3"
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
            <Badge key={tab.value} tone={index === 0 ? "gold" : "muted"}>
              {tab.label}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">{placeholder}</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
          <input
            className={`${inputClass} sm:hidden`}
            data-ux-data-surface-filter-state={resolvedFilterState}
            placeholder={mobilePlaceholder ?? placeholder}
            type="search"
          />
          <input
            className={`${inputClass} hidden sm:block`}
            data-ux-data-surface-filter-state={resolvedFilterState}
            placeholder={placeholder}
            type="search"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const disabledReason = "This filter button is not wired in this release.";
            const disabledReasonId = disabledControlReasonId(`filter-${filter.value}`);

            return (
              <span
                aria-describedby={disabledReasonId}
                aria-label={`${filter.label} filter is not wired in this release`}
                className="inline-flex h-[var(--field-height)] items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm text-alphavest-muted opacity-65"
                data-ux-affordance="blocked-filter-button"
                data-ux-data-surface-filter-state="disabled_static"
                data-ux-disabled-message="accessible"
                data-ux-disabled-reason={disabledReason}
                data-ux-interactive="false"
                key={filter.value}
                role="status"
                title={disabledReason}
              >
                <SlidersHorizontal aria-hidden="true" className="size-4" />
                {filter.label}
                <DisabledControlReason id={disabledReasonId} reason={disabledReason} />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
