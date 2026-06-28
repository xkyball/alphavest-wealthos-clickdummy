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
  actionRail?: "absent" | "present";
  children?: React.ReactNode;
  className?: string;
  density?: UxDataSurfaceDensityInput;
  detail?: React.ReactNode;
  empty?: React.ReactNode;
  family?: UxDataSurfaceFamily;
  filterState?: UxDataSurfaceFilterState;
  master?: React.ReactNode;
  masterDetailMode: UxMasterDetailMode;
  proofPlacement?: "inline_summary" | "proof_drawer" | "secondary_tab";
  queueWorkbench?: boolean;
  selectedObjectId?: string;
  selectedObjectState?: string;
  selectedSummary?: React.ReactNode;
  stickyHeader?: boolean;
  stickyRail?: boolean;
};

export function MasterDetailSurface({
  actionPolicy = "open_detail",
  actionRail = "absent",
  children,
  className,
  density = "standard_review",
  detail,
  empty,
  family = "queue",
  filterState,
  master,
  masterDetailMode,
  proofPlacement = "inline_summary",
  queueWorkbench = false,
  selectedObjectId,
  selectedObjectState,
  selectedSummary,
  stickyHeader = false,
  stickyRail = false,
}: MasterDetailSurfaceProps) {
  const hasStructuredSlots = Boolean(master || detail || empty || selectedSummary);
  const slotGridClass = detail
    ? queueWorkbench
      ? "xl:grid-cols-[minmax(18rem,0.42fr)_minmax(0,1fr)]"
      : "xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.42fr)]"
    : "";

  return (
    <div
      className={cn("min-w-0", className)}
      data-ux-queue-action-rail={queueWorkbench ? actionRail : undefined}
      data-ux-queue-proof-placement={queueWorkbench ? proofPlacement : undefined}
      data-ux-queue-selected-object={queueWorkbench ? selectedObjectId : undefined}
      data-ux-queue-selected-state={queueWorkbench ? selectedObjectState : undefined}
      data-ux-queue-workbench={queueWorkbench ? "true" : undefined}
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
        <div className={cn("grid gap-4", slotGridClass)} data-testid="ux-master-detail-slots">
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
