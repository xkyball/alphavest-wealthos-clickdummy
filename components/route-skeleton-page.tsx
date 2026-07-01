import { ArrowRight, ClipboardList, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { RouteActorContextCard } from "@/components/route-actor-context-card";
import {
  groupedScreenRoutes,
  isRouteImplementationShellAccessible,
  navigationGroupLabels,
  routeScopeForPageId,
  routeToSmokePath,
  type RouteScopeLabel,
  type ScreenRoute
} from "@/lib/route-registry";
import { uxFlowStepsForPageId, uxRoutePolicyForRoute } from "@/lib/ux-route-policy";
import { uxPageTemplateForRoute } from "@/lib/ux-page-template-system";
import { uxRouteShellPageJobDataAttributesForTemplate } from "@/lib/ux-route-shell-page-job-contract";
import { canBecomeClientVisible } from "@/lib/workflow-gate";

type RouteSkeletonPageProps = {
  route: ScreenRoute;
};

const modeLabels: Record<ScreenRoute["visualMode"], string> = {
  BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE: "Block or evidence request state",
  DOWNLOAD_CONFIRMATION_STATE: "Download confirmation state",
  MODAL_CAPABLE_AUTH_PAGE: "Modal-capable access page",
  NORMAL_PAGE: "Standard workspace page",
  PAGE_WITH_APPROVAL_DRAWER: "Approval drawer page",
  PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL: "Approval or export confirmation page",
  PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION: "Decision confirmation page",
  PAGE_WITH_INVITE_ROLE_MODAL: "Invite and role modal page",
  PAGE_WITH_PERMISSION_MODAL: "Permission modal page",
  PAGE_WITH_POLICY_MODAL_AVAILABLE: "Policy modal page",
  PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL: "Role drawer and second confirmation page",
  PAGE_WITH_SECOND_CONFIRMATION_MODAL: "Second confirmation page",
  PAGE_WITH_SIDE_DRAWER: "Side drawer page",
  PAGE_WITH_USER_DRAWER_OR_MODAL: "User drawer or modal page",
  PREVIEW_PAGE_OR_PANEL: "Preview page",
  REFERENCE_ONLY_INTERNAL_PAGE: "Internal reference page",
  RELEASE_CONFIRMATION_MODAL_STATE: "Release confirmation state",
  WIZARD_OR_STEP_PAGE: "Guided step page"
};

type ScopeShellCopy = {
  actionLabel: string;
  clientVisibilityDetail?: string;
  description: string;
  guard: {
    description: string;
    detail: string;
    stateTitle: string;
    title: string;
  };
  heading: string;
  interactionDetail: string;
  protectedScope: boolean;
};

const scopeShellCopy: Record<RouteScopeLabel, ScopeShellCopy> = {
  MVP: {
    actionLabel: "Action unavailable",
    guard: {
      description: "Advisor approval alone never unlocks client visibility.",
      detail: "",
      stateTitle: "Client visibility unavailable",
      title: "Release Guard",
    },
    heading: "Workspace Ready",
    interactionDetail: "Select a backed work item to continue.",
    protectedScope: false,
    description:
      "Workspace is available. Product controls appear when a backed work item is selected."
  },
  MVP_SUPPORT: {
    actionLabel: "Action unavailable",
    guard: {
      description: "Advisor approval alone never unlocks client visibility.",
      detail: "",
      stateTitle: "Client visibility unavailable",
      title: "Release Guard",
    },
    heading: "Support Workspace",
    interactionDetail: "Use the available setup or support workspaces to continue.",
    protectedScope: false,
    description:
      "This support workspace remains available for setup, access or client-context work while actions stay governed by review checks."
  },
  P1_AFTER_MVP: {
    actionLabel: "Deferred",
    clientVisibilityDetail: "No client-visible content is exposed.",
    guard: {
      description: "Deferred areas do not unlock current-release review.",
      detail: "No product action, release, export, mutation or client visibility is available here.",
      stateTitle: "Deferred review unavailable",
      title: "Deferred Guard",
    },
    heading: "Deferred",
    interactionDetail: "No product controls are available.",
    protectedScope: true,
    description:
      "This workspace is outside the current operating stream. No product controls are available."
  },
  REFERENCE_ONLY: {
    actionLabel: "Read only",
    clientVisibilityDetail: "No client-visible content is exposed.",
    guard: {
      description: "Read-only areas do not unlock product review.",
      detail: "No product action, release, export, mutation or client visibility is available here.",
      stateTitle: "Product review unavailable",
      title: "Read-only Guard",
    },
    heading: "Read only",
    interactionDetail: "No product controls are available.",
    protectedScope: true,
    description:
      "This area is read-only. No product controls are available."
  },
  HOLD_PENDING_DECISION: {
    actionLabel: "Held",
    clientVisibilityDetail: "No client-visible content is exposed.",
    guard: {
      description: "Held workspaces require explicit access and safety approval before any MVP review exists.",
      detail: "No product action, release, export, mutation or client visibility is available here.",
      stateTitle: "Held review flow unavailable",
      title: "Hold Guard",
    },
    heading: "Held",
    interactionDetail: "No product controls are available.",
    protectedScope: true,
    description:
      "This workspace is held pending approval. No product controls are available."
  }
};

const routeScopeStatusLabels: Record<RouteScopeLabel, string> = {
  HOLD_PENDING_DECISION: "Held workspace",
  MVP: "Active workspace",
  MVP_SUPPORT: "Support workspace",
  P1_AFTER_MVP: "Deferred workspace",
  REFERENCE_ONLY: "Read-only area",
};

function getSiblingRoutes(route: ScreenRoute) {
  return (
    groupedScreenRoutes
      .find((group) => group.key === route.navigationGroup)
      ?.routes.filter((item) => item.route !== route.route && isRouteImplementationShellAccessible(item))
      .slice(0, 4) ?? []
  );
}

export function RouteSkeletonPage({ route }: RouteSkeletonPageProps) {
  const routeScope = routeScopeForPageId(route.pageId);
  const uxPolicy = uxRoutePolicyForRoute(route);
  const template = uxPageTemplateForRoute(route);
  const routeShellPageJobAttributes = uxRouteShellPageJobDataAttributesForTemplate(template);
  const scopeCopy = scopeShellCopy[routeScope];
  const gate = canBecomeClientVisible({
    recommendationStatus: route.clientVisibilitySensitive ? "ADVISOR_APPROVED" : "DRAFT",
    advisorApprovalStatus: route.clientVisibilitySensitive ? "APPROVED" : "PENDING",
    complianceStatus: "PENDING",
    evidenceStatus: route.clientVisibilitySensitive ? "VALIDATED" : "PLACEHOLDER",
    permission: { allowed: true, reasonCode: "DEMO_PERMISSIVE" }
  });
  const siblingRoutes = scopeCopy.protectedScope ? [] : getSiblingRoutes(route);
  const clientVisibilityDetail =
    scopeCopy.clientVisibilityDetail ??
    (route.clientVisibilitySensitive
      ? "Advice-like content stays blocked until compliance release and evidence are complete."
      : "No client-visible advice is exposed from this placeholder.");
  const guardStateDetail =
    scopeCopy.protectedScope
      ? scopeCopy.guard.detail
      : `Missing checks: ${gate.missing.length > 0 ? gate.missing.join(", ") : "none"}.`;

  return (
    <AppShell>
      <div
        className="space-y-6"
        {...routeShellPageJobAttributes}
        data-testid="route-skeleton-page"
        data-ux-deferred-hold-product-controls={
          routeScope === "P1_AFTER_MVP" || routeScope === "HOLD_PENDING_DECISION" ? "non-interactive" : undefined
        }
        data-ux-productive-controls={scopeCopy.protectedScope ? "false" : "true"}
        data-ux-page-template-action-zone={template.actionZoneBehavior}
        data-ux-page-template-family={template.family}
        data-ux-page-template-long-page={template.longPageBehavior}
        data-ux-page-template-proof-audit={template.proofAuditPlacement}
        data-ux-page-template-required-zones={template.requiredZones.join(" ")}
        data-ux-reference-product-controls={routeScope === "REFERENCE_ONLY" ? "removed" : undefined}
        data-ux-route-scope={routeScope}
      >
        <PageHeader
          blockedReason={routeScope === "MVP" || routeScope === "MVP_SUPPORT" ? undefined : scopeCopy.description}
          description={route.purpose}
          eyebrow={navigationGroupLabels[route.navigationGroup]}
          primaryAction={
            routeScope === "MVP" || routeScope === "MVP_SUPPORT"
              ? undefined
              : { disabledReason: uxPolicy.safetyReminder, label: scopeCopy.actionLabel }
          }
          status={routeScope === "MVP" ? "ACTIVE" : routeScope === "MVP_SUPPORT" ? "PENDING" : "ON_HOLD"}
          statusLabel={routeScopeStatusLabels[routeScope]}
          steps={uxFlowStepsForPageId(route.pageId)}
          title={route.title}
        />

        {scopeCopy.protectedScope ? (
          <section className="max-w-2xl" data-ux-long-page-anchor="primary" data-ux-template-zone="primary_content">
            <article className="alpha-card p-5" data-testid="registered-route-empty-state">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full border border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted">
                  <LockKeyhole aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-alphavest-ivory">{scopeCopy.heading}</h2>
                  <p className="mt-1 text-sm leading-6 text-alphavest-muted">{scopeCopy.description}</p>
                </div>
              </div>
            </article>
          </section>
        ) : (
        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]" data-ux-long-page-anchor="primary" data-ux-template-zone="primary_content">
          <article className="alpha-card p-5">
            <div className="flex items-start gap-3 border-b border-alphavest-border/60 pb-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-full border border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold">
                <ClipboardList aria-hidden="true" className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-alphavest-ivory">{scopeCopy.heading}</h2>
                <p className="mt-1 text-sm leading-6 text-alphavest-muted">
                  {scopeCopy.description}
                </p>
              </div>
            </div>

            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-subtle">
                  Workspace area
                </dt>
                <dd className="mt-2 text-sm font-semibold text-alphavest-ivory">{navigationGroupLabels[route.navigationGroup]}</dd>
                <dd className="mt-1 text-sm text-alphavest-muted">{route.roleFamily}</dd>
              </div>
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-subtle">
                  Work pattern
                </dt>
                <dd className="mt-2 text-sm font-semibold text-alphavest-ivory">
                  {modeLabels[route.visualMode]}
                </dd>
                <dd className="mt-1 text-sm text-alphavest-muted">
                  {scopeCopy.interactionDetail}
                </dd>
              </div>
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-subtle">
                  Access boundary
                </dt>
                <dd className="mt-2 text-sm font-semibold text-alphavest-ivory">
                  {route.objectType.replaceAll("_", " ").toLowerCase()}
                </dd>
                <dd className="mt-1 text-sm text-alphavest-muted">
                  Only permitted tenant roles can open or act on these items.
                </dd>
              </div>
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-subtle">
                  Client visibility
                </dt>
                <dd className="mt-2 text-sm font-semibold text-alphavest-ivory">
                  {gate.passed ? "Eligible" : "Guarded"}
                </dd>
                <dd className="mt-1 text-sm text-alphavest-muted">
                  {clientVisibilityDetail}
                </dd>
              </div>
            </dl>
          </article>

          <RouteActorContextCard roleFamily={route.roleFamily} />
        </section>
        )}

        {!scopeCopy.protectedScope ? (
          <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]" data-ux-long-page-anchor="state" data-ux-template-zone="state_zone">
            <article className="alpha-card p-5">
              <div className="flex items-center gap-3 border-b border-alphavest-border/60 pb-4">
                <div className="grid size-10 place-items-center rounded-full border border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold">
                  <LockKeyhole aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-alphavest-ivory">{scopeCopy.guard.title}</h2>
                  <p className="text-sm text-alphavest-muted">{scopeCopy.guard.description}</p>
                </div>
              </div>

              <div className="mt-5 rounded-md border border-alphavest-red/30 bg-alphavest-red/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-alphavest-red">
                  <ShieldCheck aria-hidden="true" className="size-4" />
                  {scopeCopy.guard.stateTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-alphavest-muted">
                  {guardStateDetail}
                </p>
              </div>
            </article>

            {siblingRoutes.length > 0 ? (
              <article className="alpha-card p-5">
                <div className="border-b border-alphavest-border/60 pb-4">
                  <h2 className="font-display text-2xl text-alphavest-ivory">Related Workspaces</h2>
                  <p className="mt-1 text-sm text-alphavest-muted">
                    Available workspaces in the same area.
                  </p>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {siblingRoutes.map((item) => (
                    <Link
                      className="flex items-center justify-between gap-3 rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 px-4 py-3 text-sm text-alphavest-ivory transition hover:border-alphavest-gold/50 hover:text-alphavest-gold-soft"
                      href={routeToSmokePath(item.route)}
                      key={item.pageId}
                    >
                      <span className="truncate">{item.title}</span>
                      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                    </Link>
                  ))}
                </div>
              </article>
            ) : null}
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
