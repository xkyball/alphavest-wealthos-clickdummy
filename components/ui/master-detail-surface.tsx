import { cn } from "@/lib/cn";
import {
  uxDataSurfaceAttributesFor,
  type UxDataSurfaceActionPolicy,
  type UxDataSurfaceDensity,
  type UxDataSurfaceFamily,
  type UxDataSurfaceFilterState,
  type UxMasterDetailMode,
} from "@/lib/ux-data-surface-contract";

type MasterDetailSurfaceProps = {
  actionPolicy?: UxDataSurfaceActionPolicy;
  children: React.ReactNode;
  className?: string;
  density?: UxDataSurfaceDensity;
  family?: UxDataSurfaceFamily;
  filterState?: UxDataSurfaceFilterState;
  masterDetailMode: UxMasterDetailMode;
  selectedObjectId?: string;
  selectedObjectState?: string;
  stickyHeader?: boolean;
  stickyRail?: boolean;
};

export function MasterDetailSurface({
  actionPolicy = "open_detail",
  children,
  className,
  density = "standard_review",
  family = "queue",
  filterState,
  masterDetailMode,
  selectedObjectId,
  selectedObjectState,
  stickyHeader = false,
  stickyRail = false,
}: MasterDetailSurfaceProps) {
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
      {children}
    </div>
  );
}
