import { notFound } from "next/navigation";
import { AdminTenantSetupScreen } from "@/components/admin-tenant-setup-screen";
import { AuthOnboardingScreen } from "@/components/auth-onboarding-screen";
import { ClientIntakeScreen } from "@/components/client-intake-screen";
import { CommitteeReviewScreen } from "@/components/committee-review-screen";
import { CommunicationExportOpsScreen } from "@/components/communication-export-ops-screen";
import { DecisionsGovernanceScreen } from "@/components/decisions-governance-screen";
import { InternalWorkflowScreen } from "@/components/internal-workflow-screen";
import { KycAmlWorkflowScreen } from "@/components/kyc-aml-workflow-screen";
import { ReviewMonitoringScreen } from "@/components/review-monitoring-screen";
import { SuitabilityIpsScreen } from "@/components/suitability-ips-screen";
import { WealthActionsScreen } from "@/components/wealth-actions-screen";
import { isAdminTenantSetupPageId } from "@/lib/admin-tenant-setup-demo-data";
import { isAuthOnboardingPageId } from "@/lib/auth-onboarding-demo-data";
import { isClientIntakePageId } from "@/lib/client-intake-demo-data";
import { isCommitteeReviewPageId } from "@/lib/committee-review-demo-data";
import { isCommunicationExportOpsPageId } from "@/lib/communication-export-ops-demo-data";
import { isDecisionsGovernancePageId } from "@/lib/decisions-governance-demo-data";
import { isInternalWorkflowPageId } from "@/lib/internal-workflow-demo-data";
import { isKycAmlPageId } from "@/lib/kyc-aml-demo-data";
import { isReviewMonitoringPageId } from "@/lib/review-monitoring-demo-data";
import { isSuitabilityIpsPageId } from "@/lib/suitability-ips-demo-data";
import { isWealthActionsPageId } from "@/lib/wealth-actions-demo-data";
import { RouteSkeletonPage } from "@/components/route-skeleton-page";
import {
  isRouteImplementationShellAccessible,
  matchRouteBySegments,
  routeSmokeList
} from "@/lib/route-registry";
import { normalizeVisualState, visualStateForRoute } from "@/lib/visual-contract";

type CatchAllRouteProps = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return routeSmokeList.map((route) => ({
    segments: route.segments
  }));
}

export default async function CatchAllRoute({ params, searchParams }: CatchAllRouteProps) {
  const { segments } = await params;
  const route = matchRouteBySegments(segments);

  if (!route) {
    notFound();
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const visualState = visualStateForRoute(route, normalizeVisualState(resolvedSearchParams.state));

  if (!isRouteImplementationShellAccessible(route)) {
    return <RouteSkeletonPage route={route} />;
  }

  if (isAuthOnboardingPageId(route.pageId)) {
    return <AuthOnboardingScreen pageId={route.pageId} />;
  }

  if (isAdminTenantSetupPageId(route.pageId)) {
    return <AdminTenantSetupScreen route={route} visualState={visualState} />;
  }

  if (isClientIntakePageId(route.pageId)) {
    return <ClientIntakeScreen route={route} />;
  }

  if (isWealthActionsPageId(route.pageId)) {
    return <WealthActionsScreen route={route} visualState={visualState} />;
  }

  if (isInternalWorkflowPageId(route.pageId)) {
    return <InternalWorkflowScreen route={route} visualState={visualState} />;
  }

  if (isKycAmlPageId(route.pageId)) {
    return <KycAmlWorkflowScreen route={route} />;
  }

  if (isSuitabilityIpsPageId(route.pageId)) {
    return <SuitabilityIpsScreen route={route} />;
  }

  if (isReviewMonitoringPageId(route.pageId)) {
    return <ReviewMonitoringScreen route={route} />;
  }

  if (isCommitteeReviewPageId(route.pageId)) {
    return <CommitteeReviewScreen route={route} />;
  }

  if (isDecisionsGovernancePageId(route.pageId)) {
    return <DecisionsGovernanceScreen route={route} visualState={visualState} />;
  }

  if (isCommunicationExportOpsPageId(route.pageId)) {
    return <CommunicationExportOpsScreen route={route} visualState={visualState} />;
  }

  return <RouteSkeletonPage route={route} />;
}
