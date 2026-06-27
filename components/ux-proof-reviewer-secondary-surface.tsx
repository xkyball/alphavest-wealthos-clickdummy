import { ProofReviewerPanel, type ProofReviewerPanelMetadataItem } from "@/components/ui";
import {
  uxProofReviewerRecordForPageId,
  type UxProofReviewerRouteRecord,
} from "@/lib/ux-proof-reviewer-mode";

type UxProofReviewerSecondarySurfaceProps = {
  className?: string;
  enabled?: boolean;
  pageId?: string;
  record?: UxProofReviewerRouteRecord;
};

export function UxProofReviewerSecondarySurface({
  className,
  enabled = false,
  pageId,
  record,
}: UxProofReviewerSecondarySurfaceProps) {
  const proofRecord = record ?? (pageId ? uxProofReviewerRecordForPageId(pageId) : null);

  if (!enabled || !proofRecord) {
    return null;
  }

  const metadata: ProofReviewerPanelMetadataItem[] = [
    { label: "Route", value: proofRecord.pageId },
    { label: "Mode", tone: "blue", value: proofRecord.mode },
    { label: "Proof", tone: "gold", value: proofRecord.proofPosture },
    { label: "Template", value: proofRecord.templateFamily },
  ];

  return (
    <ProofReviewerPanel
      className={className}
      data-testid="ux-proof-reviewer-secondary-surface"
      defaultCollapsed={false}
      metadata={metadata}
      mode="reviewer_secondary"
      noOverclaim={proofRecord.noOverclaimRule}
      routeId={proofRecord.pageId}
      suppressedInClientMode={proofRecord.suppressedInClientMode}
      title="Reviewer traceability"
    >
      <p>
        Reviewer metadata is traceability only. It does not create product mutation, release, export,
        download, share or client acceptance authority.
      </p>
    </ProofReviewerPanel>
  );
}
