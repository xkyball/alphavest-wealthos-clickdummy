import { MoreHorizontal } from "lucide-react";
import { StatePanel, type ComponentState } from "@/components/ui/state-panel";
import { cn } from "@/lib/cn";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  mobileHidden?: boolean;
};

type DataTableProps<T> = {
  columns: Array<DataTableColumn<T>>;
  compact?: boolean;
  emptyMessage?: string;
  getRowId: (row: T) => string;
  mobileCardTitle?: (row: T) => React.ReactNode;
  responsiveMode?: "cards" | "table";
  rows: T[];
  state?: ComponentState | "ready";
};

const stateCopy: Record<ComponentState, { detail: string; title: string }> = {
  blocked: { title: "Access blocked", detail: "This table is gated until the required workflow checks pass." },
  empty: { title: "No records", detail: "There are no matching records for the current filters." },
  error: { title: "Unable to load", detail: "The table could not load the requested demo records." },
  loading: { title: "Loading records", detail: "Rows are being prepared for this workspace." },
  restricted: { title: "Restricted", detail: "Only permitted roles can view these rows." }
};

export function DataTable<T>({
  columns,
  compact = false,
  emptyMessage,
  getRowId,
  mobileCardTitle,
  responsiveMode = "cards",
  rows,
  state = "ready"
}: DataTableProps<T>) {
  if (state !== "ready") {
    return <StatePanel detail={emptyMessage ?? stateCopy[state].detail} state={state} title={stateCopy[state].title} />;
  }

  const cellPadding = compact ? "px-4 py-3" : "px-5 py-3.5";
  const rowMinHeight = compact ? "min-h-[var(--table-row-height-compact)]" : "min-h-[var(--table-row-height)]";
  const tablePadding = compact ? "w-full min-w-0 table-fixed" : "w-full min-w-0 table-auto";

  const table = (
    <div className="min-w-0 max-w-full overflow-x-auto overflow-y-visible rounded-md border border-alphavest-border/70 [contain:inline-size]">
      <table className={tablePadding + " border-collapse text-left text-sm"}>
        <thead className="bg-alphavest-panel/75 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">
          <tr>
            {columns.map((column) => (
              <th
                className={cn(
                  "min-h-12 border-b border-alphavest-border/70 align-top text-[0.8rem] font-semibold tracking-[0.04em] uppercase",
                  rowMinHeight,
                  cellPadding,
                  column.className
                )}
                key={column.key}
              >
                {column.header}
              </th>
            ))}
            <th className="min-h-12 w-14 border-b border-alphavest-border/70 px-5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-alphavest-muted" colSpan={columns.length + 1}>
                {emptyMessage ?? "No records available."}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr className={cn("border-b border-alphavest-border/55 last:border-0", rowMinHeight)} key={getRowId(row)}>
                {columns.map((column) => (
                  <td
                    className={cn("min-w-0 break-words align-top leading-5 text-alphavest-muted", cellPadding, column.className)}
                    key={column.key}
                  >
                    {column.render(row)}
                  </td>
                ))}
                <td className="px-5 py-4 text-right text-alphavest-subtle">
                  <MoreHorizontal aria-hidden="true" className="ml-auto size-4" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  if (responsiveMode === "table") {
    return table;
  }

  return (
    <div>
      <div className="md:hidden">
        {rows.length === 0 ? (
          <div className="rounded-md border border-alphavest-border/70 px-4 py-6 text-sm text-alphavest-muted">
            {emptyMessage ?? "No records available."}
          </div>
        ) : (
          <div className="grid gap-3">
            {rows.map((row) => (
                <article className="rounded-md border border-alphavest-border/70 bg-alphavest-midnight/45 p-5" key={getRowId(row)}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 text-sm font-semibold text-alphavest-ivory">
                    {mobileCardTitle ? mobileCardTitle(row) : columns[0]?.render(row)}
                  </div>
                  <MoreHorizontal aria-hidden="true" className="size-4 shrink-0 text-alphavest-subtle" />
                </div>
                <dl className="grid gap-3">
                  {columns.slice(mobileCardTitle ? 0 : 1).filter((column) => !column.mobileHidden).map((column) => (
                    <div className="grid gap-1 border-t border-alphavest-border/45 pt-3 first:border-t-0 first:pt-0" key={column.key}>
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{column.header}</dt>
                      <dd className="min-w-0 text-sm text-alphavest-muted">{column.render(row)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
      <div className="hidden md:block">{table}</div>
    </div>
  );
}
