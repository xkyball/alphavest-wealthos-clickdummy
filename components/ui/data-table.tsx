"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { StatePanel, type ComponentState } from "@/components/ui/state-panel";
import { cn } from "@/lib/cn";
import type { BackendDataSurfaceMeta } from "@/lib/data-surface-query-contract";
import {
  uxPrimitiveInteractionAttributesFor,
  uxPrimitiveInteractionClassFor,
} from "@/lib/ux-design-system-foundation";
import {
  uxDataFieldAttributesFor,
  uxDataSurfaceActionAttributesFor,
  uxDataSurfaceActionContractFor,
  uxDataSurfaceAttributesFor,
  uxDataSurfaceDensityForPreset,
  uxDataSurfacePresetForDensity,
  type UxDataFieldPriority,
  type UxDataSurfaceActionPolicy,
  type UxDataSurfaceDensityInput,
  type UxDataSurfaceFamily,
  type UxDataSurfaceFilterState,
  type UxMasterDetailMode,
} from "@/lib/ux-data-surface-contract";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  priority?: UxDataFieldPriority;
  mobileHidden?: boolean;
  sortable?: boolean;
};

type DataTablePagination = Pick<
  BackendDataSurfaceMeta<string>,
  "hasNextPage" | "hasPreviousPage" | "page" | "pageSize" | "returnedRows" | "sourceTruth" | "totalPages" | "totalRows"
> & {
  onPageChange?: (page: number) => void;
};

type DataTableProps<T> = {
  actionPolicy?: UxDataSurfaceActionPolicy;
  columns: Array<DataTableColumn<T>>;
  compact?: boolean;
  density?: UxDataSurfaceDensityInput;
  emptyMessage?: string;
  family?: UxDataSurfaceFamily;
  filterState?: UxDataSurfaceFilterState;
  getRowId: (row: T) => string;
  masterDetailMode?: UxMasterDetailMode;
  mobileCardTitle?: (row: T) => React.ReactNode;
  onRowAction?: (row: T) => void;
  pagination?: DataTablePagination | null;
  responsiveMode?: "cards" | "table";
  rowActionLabel?: (row: T) => string;
  rowActionPriority?: "primary" | "secondary";
  rowActionUnavailableLabel?: string;
  rows: T[];
  serverSort?: boolean;
  onSortChange?: (key: string) => void;
  sortDirection?: "asc" | "desc";
  sortKey?: string;
  state?: ComponentState | "ready";
  stickyHeader?: boolean;
};

const stateCopy: Record<ComponentState, { detail: string; title: string }> = {
  "audit-unavailable": { title: "Audit unavailable", detail: "This table cannot complete a critical action until audit persistence is available." },
  blocked: { title: "Access blocked", detail: "This table is controlled until the required review checks pass." },
  denied: { title: "Permission denied", detail: "The current actor cannot view this table or perform this action." },
  empty: { title: "No records", detail: "There are no matching records for the current filters." },
  error: { title: "Unable to load", detail: "The table could not load the requested demo records." },
  "export-failed": { title: "Export failed closed", detail: "The export cannot continue because one or more safety controls failed." },
  "export-pending": { title: "Export pending", detail: "Preview, approval, generation, download and share remain separate export steps." },
  "export-redaction": { title: "Redaction pending", detail: "Export access must be redacted and approved before generation." },
  hidden: { title: "Hidden", detail: "Content is hidden until route, role and visibility checks allow it." },
  "hold-blocked": { title: "Held route", detail: "This route remains blocked until an explicit access and safety unlock exists." },
  "internal-only": { title: "Internal only", detail: "This state is visible internally only and does not create client visibility." },
  loading: { title: "Loading records", detail: "Rows are being prepared for this workspace." },
  "p1-deferred": { title: "Deferred guard", detail: "This P1 route is guard-only and cannot activate MVP release or advice flow." },
  redacted: { title: "Redacted", detail: "Sensitive fields are redacted for this actor and review state." },
  "reference-only": { title: "Reference only", detail: "This route is registered as reference material, not product action access." },
  restricted: { title: "Restricted", detail: "Only permitted roles can view these rows." },
  success: { title: "State complete", detail: "The requested state is complete for this review view." },
  validation: { title: "Validation required", detail: "Complete the required inputs before continuing." }
};

export function DataTable<T>({
  actionPolicy,
  columns,
  compact = false,
  density,
  emptyMessage,
  family = "table",
  filterState,
  getRowId,
  masterDetailMode,
  mobileCardTitle,
  onRowAction,
  pagination,
  onSortChange,
  responsiveMode = "cards",
  rowActionLabel,
  rowActionPriority = "secondary",
  rowActionUnavailableLabel = "No row action is available for this table state.",
  rows,
  serverSort = false,
  sortDirection,
  sortKey,
  state = "ready",
  stickyHeader = false
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<{ direction: "asc" | "desc"; key: string | undefined }>({
    direction: sortDirection ?? "asc",
    key: sortKey,
  });

  const activeSortKey = sortKey ?? internalSort.key;
  const activeSortDirection = sortDirection ?? internalSort.direction ?? "asc";
  const sortedRows = useMemo(() => {
    if (serverSort) return rows;
    if (!activeSortKey) return rows;

    return [...rows].sort((left, right) => {
      const leftValue = String((left as Record<string, unknown>)[activeSortKey] ?? "");
      const rightValue = String((right as Record<string, unknown>)[activeSortKey] ?? "");
      const order = leftValue.localeCompare(rightValue, undefined, { numeric: true, sensitivity: "base" });

      return activeSortDirection === "desc" ? -order : order;
    });
  }, [activeSortDirection, activeSortKey, rows, serverSort]);

  if (state !== "ready") {
    return <StatePanel detail={emptyMessage ?? stateCopy[state].detail} state={state} title={stateCopy[state].title} />;
  }

  function handleSort(key: string) {
    if (serverSort) {
      onSortChange?.(key);
      return;
    }

    setInternalSort((current) => ({
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
      key,
    }));
    onSortChange?.(key);
  }

  function sortStateForColumn(column: DataTableColumn<T>) {
    if (!column.sortable) return undefined;
    if (activeSortKey !== column.key) return "none";
    return activeSortDirection === "desc" ? "descending" : "ascending";
  }

  const densityPreset = uxDataSurfaceDensityForPreset(density ?? (compact ? "compact" : "default"));
  const e06DensityPreset = uxDataSurfacePresetForDensity(density ?? (compact ? "compact" : "default"));
  const densityPresentation = {
    compact: {
      cellPadding: "px-3 py-2.5",
      mobileCardPadding: "p-4",
      rowMinHeight: "min-h-[var(--table-row-height-compact)]",
      tableLayout: "table-fixed",
    },
    comfortable: {
      cellPadding: "px-5 py-3.5",
      mobileCardPadding: "p-5",
      rowMinHeight: "min-h-[var(--table-row-height)]",
      tableLayout: "table-auto",
    },
    default: {
      cellPadding: "px-4 py-3",
      mobileCardPadding: "p-4",
      rowMinHeight: "min-h-[var(--table-row-height-compact)]",
      tableLayout: "table-auto",
    },
  } as const;
  const densityClasses = densityPresentation[e06DensityPreset];
  const resolvedActionPolicy = actionPolicy ?? (onRowAction ? "open_detail" : "disabled_unavailable");
  const rendersRowAction = uxDataSurfaceActionContractFor(resolvedActionPolicy).rendersAffordance;
  const tableAttributes = uxDataSurfaceAttributesFor({
    actionPolicy: resolvedActionPolicy,
    density: densityPreset,
    densityPreset: e06DensityPreset,
    family,
    filterState,
    masterDetailMode,
    stickyHeader,
    stickyRail: false,
  });

  function columnPriorityFor(column: DataTableColumn<T>, index: number): UxDataFieldPriority {
    if (column.priority) return column.priority;
    if (column.mobileHidden) return "mobile_hidden";
    if (index === 0) return "identity";
    return "secondary_metadata";
  }

  function RowAction({ row }: { row: T }) {
    const actionLabel = rowActionLabel?.(row) ?? `Open row action for ${getRowId(row)}`;
    const disabledByPolicy = resolvedActionPolicy === "blocked_static" || resolvedActionPolicy === "disabled_unavailable";
    const disabledReason = onRowAction && !disabledByPolicy ? undefined : rowActionUnavailableLabel;
    const disabledReasonId = disabledReason ? disabledControlReasonId(`row-action-${getRowId(row)}`) : undefined;
    const actionEnabled = Boolean(onRowAction) && !disabledByPolicy;

    return (
      <button
        aria-describedby={disabledReason ? disabledReasonId : undefined}
        aria-label={actionEnabled ? actionLabel : rowActionUnavailableLabel}
        className={cn(
          "ml-auto grid size-8 place-items-center rounded-md border border-transparent text-alphavest-subtle transition enabled:hover:border-alphavest-border enabled:hover:text-alphavest-ivory disabled:cursor-not-allowed disabled:opacity-45",
          uxPrimitiveInteractionClassFor(actionEnabled ? "focus-visible" : "disabled"),
        )}
        data-testid="ux-data-table-row-action"
        data-ux-affordance="row-action"
        data-ux-disabled-message={disabledReason ? "accessible" : undefined}
        data-ux-disabled-reason={disabledReason}
        data-ux-data-surface-row-action-priority={rowActionPriority}
        data-ux-interactive={actionEnabled ? "true" : "false"}
        data-ux-row-action-state={actionEnabled ? "enabled" : "disabled"}
        disabled={!actionEnabled}
        onClick={actionEnabled ? () => onRowAction?.(row) : undefined}
        title={actionEnabled ? actionLabel : rowActionUnavailableLabel}
        type="button"
        {...uxPrimitiveInteractionAttributesFor(actionEnabled ? "focus-visible" : "disabled")}
        {...uxDataSurfaceActionAttributesFor(resolvedActionPolicy)}
      >
        <MoreHorizontal aria-hidden="true" className="size-4" />
        {disabledReason ? <DisabledControlReason id={disabledReasonId} reason={disabledReason} /> : null}
      </button>
    );
  }

  const cellPadding = densityClasses.cellPadding;
  const rowMinHeight = densityClasses.rowMinHeight;
  const tablePadding = cn("w-full", responsiveMode === "table" ? "min-w-[44rem]" : "min-w-full", densityClasses.tableLayout);

  const table = (
    <div
      className="av-readable-surface min-w-0 max-w-full overflow-x-auto overflow-y-visible rounded-md border border-alphavest-border/70 [contain:inline-size]"
      data-ux-density-readability="true"
      data-testid="ux-data-table"
      {...tableAttributes}
    >
      <table className={cn(tablePadding, "border-collapse text-left text-sm")}>
        <thead className={cn("bg-alphavest-panel/75 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle", stickyHeader && "sticky top-0 z-10")}>
          <tr>
            {columns.map((column, index) => {
              const columnSortState = sortStateForColumn(column);
              const columnPriority = columnPriorityFor(column, index);

              return (
                <th
                  aria-sort={columnSortState}
                  className={cn(
                    "min-h-12 border-b border-alphavest-border/70 align-top text-[0.8rem] font-semibold tracking-[0.04em] uppercase",
                    rowMinHeight,
                    cellPadding,
                    column.className
                  )}
                  key={column.key}
                  {...uxDataFieldAttributesFor(columnPriority)}
                >
                  {column.sortable ? (
                    <button
                      aria-label={`Sort by ${column.header}${activeSortKey === column.key ? `, currently ${columnSortState}` : ""}`}
                      className={cn(
                        "inline-flex max-w-full items-center gap-1 rounded-sm text-left uppercase",
                        uxPrimitiveInteractionClassFor("focus-visible"),
                        activeSortKey === column.key && uxPrimitiveInteractionClassFor("active"),
                      )}
                      data-testid="ux-data-table-sort"
                      onClick={() => handleSort(column.key)}
                      title={`Sort table by ${column.header}${activeSortKey === column.key ? `, currently ${columnSortState}` : ""}.`}
                      type="button"
                      {...uxPrimitiveInteractionAttributesFor(activeSortKey === column.key ? "active" : "focus-visible")}
                    >
                      <span className="truncate">{column.header}</span>
                      <span aria-hidden="true" className="text-[0.68rem] text-alphavest-subtle">
                        {activeSortKey === column.key ? (activeSortDirection === "desc" ? "desc" : "asc") : ""}
                      </span>
                      {activeSortKey === column.key ? (
                        <span className="sr-only">Sorted {columnSortState}</span>
                      ) : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
            {rendersRowAction ? (
              <th className="min-h-12 w-14 border-b border-alphavest-border/70 px-5" {...uxDataFieldAttributesFor("action")}>
                <span className="sr-only">Actions</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-alphavest-muted" colSpan={columns.length + (rendersRowAction ? 1 : 0)}>
                {emptyMessage ?? "No records available."}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr className={cn("border-b border-alphavest-border/55 last:border-0", rowMinHeight)} data-ux-density-readability="true" key={getRowId(row)}>
                {columns.map((column, index) => (
                  <td
                    className={cn("av-readable-secondary min-w-0 break-words align-top text-sm", cellPadding, column.className)}
                    key={column.key}
                    {...uxDataFieldAttributesFor(columnPriorityFor(column, index))}
                  >
                    {column.render(row)}
                  </td>
                ))}
                {rendersRowAction ? (
                  <td className={cn(cellPadding, "text-right text-alphavest-subtle")} {...uxDataFieldAttributesFor("action")}>
                    <RowAction row={row} />
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const paginationFooter = pagination
    ? (() => {
      const previousDisabled = !pagination.hasPreviousPage;
      const nextDisabled = !pagination.hasNextPage;

      return (
      <div
        className="mt-3 flex flex-col gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-navy/30 px-3 py-2 text-sm text-alphavest-muted sm:flex-row sm:items-center sm:justify-between"
        data-testid="ux-data-table-pagination"
        data-ux-data-surface-source-truth={pagination.sourceTruth}
      >
        <p>
          Showing {pagination.returnedRows} of {pagination.totalRows} backend rows · Page {pagination.page} of {pagination.totalPages}
        </p>
        <div className="flex gap-2">
          <button
            aria-label="Previous backend page"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm font-semibold text-alphavest-ivory transition disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:border-alphavest-gold/60"
            data-testid="ux-data-table-page-previous"
            disabled={previousDisabled}
            onClick={() => pagination.onPageChange?.(Math.max(1, pagination.page - 1))}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            Previous
          </button>
          <button
            aria-label="Next backend page"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-3 text-sm font-semibold text-alphavest-ivory transition disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:border-alphavest-gold/60"
            data-testid="ux-data-table-page-next"
            disabled={nextDisabled}
            onClick={() => pagination.onPageChange?.(Math.min(pagination.totalPages, pagination.page + 1))}
            type="button"
          >
            Next
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
      );
    })()
    : null;

  if (responsiveMode === "table") {
    return (
      <div>
        {table}
        {paginationFooter}
      </div>
    );
  }

  return (
    <div>
      <div
        className="md:hidden"
        {...uxDataSurfaceAttributesFor({
          actionPolicy: resolvedActionPolicy,
          density: "mobile_card_projection",
          densityPreset: "comfortable",
          family,
          filterState,
          masterDetailMode,
          stickyHeader: false,
          stickyRail: false,
        })}
      >
        {sortedRows.length === 0 ? (
          <div className="rounded-md border border-alphavest-border/70 px-4 py-6 text-sm text-alphavest-muted">
            {emptyMessage ?? "No records available."}
          </div>
        ) : (
          <div className="grid gap-3">
            {sortedRows.map((row) => (
                <article
                  className={cn("av-readable-surface rounded-md border border-alphavest-border/70 bg-alphavest-midnight/45", densityClasses.mobileCardPadding)}
                  data-ux-density-readability="true"
                  key={getRowId(row)}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 text-sm font-semibold text-alphavest-ivory" {...uxDataFieldAttributesFor("identity")}>
                    {mobileCardTitle ? mobileCardTitle(row) : columns[0]?.render(row)}
                  </div>
                  {rendersRowAction ? <RowAction row={row} /> : null}
                </div>
                <dl className="grid gap-3">
                  {columns.slice(mobileCardTitle ? 0 : 1).filter((column) => !column.mobileHidden).map((column, index) => (
                    <div className="grid gap-1 border-t border-alphavest-border/45 pt-3 first:border-t-0 first:pt-0" key={column.key}>
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{column.header}</dt>
                      <dd className="min-w-0 text-sm text-alphavest-muted" {...uxDataFieldAttributesFor(columnPriorityFor(column, index))}>{column.render(row)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
      <div className="hidden md:block">{table}</div>
      {paginationFooter}
    </div>
  );
}
