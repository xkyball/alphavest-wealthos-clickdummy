import { cn } from "@/lib/cn";
import {
  uxDataSurfaceAttributesFor,
  type UxDataSurfaceActionPolicy,
  type UxDataSurfaceDensityInput,
  type UxDataSurfaceFamily,
  type UxDataSurfaceFilterState,
  type UxMasterDetailMode,
} from "@/lib/ux-data-surface-contract";

type MasterDetailSurfaceProps = {
  actionPolicy?: UxDataSurfaceActionPolicy;
  children?: React.ReactNode;
  className?: string;
  density?: UxDataSurfaceDensityInput;
  detail?: React.ReactNode;
  empty?: React.ReactNode;
  family?: UxDataSurfaceFamily;
  filterState?: UxDataSurfaceFilterState;
  master?: React.ReactNode;
  masterDetailMode: UxMasterDetailMode;
  selectedObjectId?: string;
  selectedObjectState?: string;
  selectedSummary?: React.ReactNode;
  stickyHeader?: boolean;
  stickyRail?: boolean;
};

export function MasterDetailSurface({
  actionPolicy = "open_detail",
  children,
  className,
  density = "standard_review",
  detail,
  empty,
  family = "queue",
  filterState,
  master,
  masterDetailMode,
  selectedObjectId,
  selectedObjectState,
  selectedSummary,
  stickyHeader = false,
  stickyRail = false,
}: MasterDetailSurfaceProps) {
  const hasStructuredSlots = Boolean(master || detail || empty || selectedSummary);

  return (
    <div
      className={cn("min-w-0", className)}
      data-ux-master-detail-selected-object={selectedObjectId}
      data-ux-master-detail-selected-state={selectedObjectState}
      {...uxDataSurfaceAttributesFor({
        actionPolicy,
        density,
        family,
        filterState,
        masterDetailMode,
        stickyHeader,
        stickyRail,
      })}
    >
      {selectedSummary ? (
        <div className="mb-3 rounded-md border border-alphavest-border/65 bg-alphavest-navy/35 p-3 text-sm text-alphavest-muted" data-testid="ux-master-detail-selected-summary">
          {selectedSummary}
        </div>
      ) : null}
      {hasStructuredSlots ? (
        <div className={cn("grid gap-4", detail ? "xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.42fr)]" : "")} data-testid="ux-master-detail-slots">
          <div className="min-w-0" data-testid="ux-master-detail-master">
            {master ?? children}
            {empty ? <div data-testid="ux-master-detail-empty">{empty}</div> : null}
          </div>
          {detail ? (
            <aside className="min-w-0" data-testid="ux-master-detail-detail">
              {detail}
            </aside>
          ) : null}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
