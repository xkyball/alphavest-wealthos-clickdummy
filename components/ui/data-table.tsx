import { MoreHorizontal } from "lucide-react";
import { StatePanel, type ComponentState } from "@/components/ui/state-panel";
import { cn } from "@/lib/cn";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  mobileHidden?: boolean;
  sortable?: boolean;
};

type DataTableProps<T> = {
  columns: Array<DataTableColumn<T>>;
  compact?: boolean;
  emptyMessage?: string;
  getRowId: (row: T) => string;
  mobileCardTitle?: (row: T) => React.ReactNode;
  responsiveMode?: "cards" | "table";
  rows: T[];
  onSortChange?: (key: string) => void;
  sortDirection?: "asc" | "desc";
  sortKey?: string;
  state?: ComponentState | "ready";
};

const stateCopy: Record<ComponentState, { detail: string; title: string }> = {
  "audit-unavailable": { title: "Audit unavailable", detail: "This table cannot complete a critical action until audit persistence is available." },
  blocked: { title: "Access blocked", detail: "This table is gated until the required workflow checks pass." },
  denied: { title: "Permission denied", detail: "The current actor cannot view this table or perform this action." },
  empty: { title: "No records", detail: "There are no matching records for the current filters." },
  error: { title: "Unable to load", detail: "The table could not load the requested demo records." },
  "export-failed": { title: "Export failed closed", detail: "The export cannot continue because one or more safety controls failed." },
  "export-pending": { title: "Export pending", detail: "Preview, approval, generation, download and share remain separate export steps." },
  "export-redaction": { title: "Redaction pending", detail: "Export scope must be redacted and approved before generation." },
  hidden: { title: "Hidden", detail: "Payload is hidden until route, role and visibility gates allow it." },
  "hold-blocked": { title: "Held route", detail: "This route remains blocked until an explicit scope and safety unlock exists." },
  "internal-only": { title: "Internal only", detail: "This state is visible internally only and does not create client visibility." },
  loading: { title: "Loading records", detail: "Rows are being prepared for this workspace." },
  "p1-deferred": { title: "Deferred guard", detail: "This P1 route is guard-only and cannot activate MVP release or advice flow." },
  redacted: { title: "Redacted", detail: "Sensitive fields are redacted for this actor and workflow state." },
  "reference-only": { title: "Reference only", detail: "This route is registered as reference material, not product action scope." },
  restricted: { title: "Restricted", detail: "Only permitted roles can view these rows." },
  success: { title: "State complete", detail: "The requested state is complete for this workflow view." },
  validation: { title: "Validation required", detail: "Complete the required inputs before continuing." }
};

export function DataTable<T>({
  columns,
  compact = false,
  emptyMessage,
  getRowId,
  mobileCardTitle,
  onSortChange,
  responsiveMode = "cards",
  rows,
  sortDirection,
  sortKey,
  state = "ready"
}: DataTableProps<T>) {
  if (state !== "ready") {
    return <StatePanel detail={emptyMessage ?? stateCopy[state].detail} state={state} title={stateCopy[state].title} />;
  }

  const cellPadding = compact ? "px-4 py-3" : "px-5 py-3.5";
  const rowMinHeight = compact ? "min-h-[var(--table-row-height-compact)]" : "min-h-[var(--table-row-height)]";
  const tablePadding = compact ? "w-full min-w-0 table-fixed" : "w-full min-w-0 table-auto";

  const table = (
    <div
      className="min-w-0 max-w-full overflow-x-auto overflow-y-visible rounded-md border border-alphavest-border/70 [contain:inline-size]"
      data-testid="ux-data-table"
    >
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
                {column.sortable && onSortChange ? (
                  <button
                    aria-label={`Sort by ${column.header}${sortKey === column.key ? `, currently ${sortDirection}` : ""}`}
                    className="inline-flex max-w-full items-center gap-1 text-left uppercase"
                    data-testid="ux-data-table-sort"
                    onClick={() => onSortChange(column.key)}
                    type="button"
                  >
                    <span className="truncate">{column.header}</span>
                    <span aria-hidden="true" className="text-[0.68rem] text-alphavest-subtle">
                      {sortKey === column.key ? (sortDirection === "desc" ? "desc" : "asc") : ""}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
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
                  <button
                    aria-label="Open row actions"
                    className="ml-auto grid size-8 place-items-center rounded-md border border-transparent text-alphavest-subtle transition hover:border-alphavest-border hover:text-alphavest-ivory"
                    data-testid="ux-data-table-row-action"
                    type="button"
                  >
                    <MoreHorizontal aria-hidden="true" className="size-4" />
                  </button>
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
                  <button
                    aria-label="Open row actions"
                    className="grid size-8 shrink-0 place-items-center rounded-md border border-transparent text-alphavest-subtle transition hover:border-alphavest-border hover:text-alphavest-ivory"
                    data-testid="ux-data-table-row-action"
                    type="button"
                  >
                    <MoreHorizontal aria-hidden="true" className="size-4" />
                  </button>
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
