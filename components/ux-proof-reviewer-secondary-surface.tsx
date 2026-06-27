import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  uxProofReviewerRecordForPageId,
  type UxProofReviewerRouteRecord,
} from "@/lib/ux-proof-reviewer-mode";

type UxProofReviewerSecondarySurfaceProps = {
  className?: string;
  pageId?: string;
  record?: UxProofReviewerRouteRecord;
};

export function UxProofReviewerSecondarySurface({
  className,
  pageId,
  record,
}: UxProofReviewerSecondarySurfaceProps) {
  const proofRecord = record ?? (pageId ? uxProofReviewerRecordForPageId(pageId) : null);

  if (!proofRecord) {
    return null;
  }

  return (
    <Card
      className={className}
      data-testid="ux-proof-reviewer-secondary-surface"
      data-ux-proof-default-visible="false"
      data-ux-proof-mode="reviewer_secondary"
      data-ux-proof-route-id={proofRecord.pageId}
      data-ux-proof-suppressed-in-client={proofRecord.suppressedInClientMode.join(" ")}
    >
      <CardHeader>
        <CardTitle>Reviewer traceability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-alphavest-muted">
        <div className="flex flex-wrap gap-2">
          <Badge tone="muted">Route {proofRecord.pageId}</Badge>
          <Badge tone="blue">{proofRecord.mode}</Badge>
          <Badge tone="gold">{proofRecord.proofPosture}</Badge>
          <Badge tone="muted">{proofRecord.templateFamily}</Badge>
        </div>
        <p>{proofRecord.noOverclaimRule}</p>
        <p>
          Reviewer metadata is traceability only. It does not create product mutation, release, export,
          download, share or client acceptance authority.
        </p>
      </CardContent>
    </Card>
  );
}
