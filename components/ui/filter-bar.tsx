import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FilterOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  filters?: FilterOption[];
  mobilePlaceholder?: string;
  placeholder?: string;
  tabs?: FilterOption[];
};

const inputClass =
  "h-[var(--field-height)] w-full rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-9 text-sm text-alphavest-ivory outline-none placeholder:text-alphavest-subtle focus:border-alphavest-gold";

export function FilterBar({ filters = [], mobilePlaceholder, placeholder = "Search...", tabs = [] }: FilterBarProps) {
  return (
    <div className="space-y-3">
      {tabs.length > 0 ? (
        <div className="flex flex-wrap gap-2">
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
            placeholder={mobilePlaceholder ?? placeholder}
            type="search"
          />
          <input
            className={`${inputClass} hidden sm:block`}
            placeholder={placeholder}
            type="search"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              className="inline-flex h-[var(--field-height)] items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-midnight/70 px-3 text-sm text-alphavest-muted transition hover:border-alphavest-gold/45 hover:text-alphavest-gold-soft"
              key={filter.value}
              type="button"
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
