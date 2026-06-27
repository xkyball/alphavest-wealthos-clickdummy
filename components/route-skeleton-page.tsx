import { ArrowRight, ClipboardList, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { RouteDemoContextCard } from "@/components/route-demo-context-card";
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
    actionLabel: "Product action locked",
    guard: {
      description: "Advisor approval alone never unlocks client visibility.",
      detail: "",
      stateTitle: "Client visibility blocked",
      title: "Release Guard",
    },
    heading: "Workspace Ready",
    interactionDetail: "Final controls are deferred to the page implementation phase.",
    protectedScope: false,
    description:
      "This screen is registered, navigable and ready for its dedicated UI build. The placeholder keeps the app shell, demo context and workflow guard visible without implementing the final screen early."
  },
  MVP_SUPPORT: {
    actionLabel: "Product action locked",
    guard: {
      description: "Advisor approval alone never unlocks client visibility.",
      detail: "",
      stateTitle: "Client visibility blocked",
      title: "Release Guard",
    },
    heading: "Support Workspace",
    interactionDetail: "Final controls are deferred to the page implementation phase.",
    protectedScope: false,
    description:
      "This support route remains available for setup, access or client-context flows while action and payload authority stay governed by the dedicated workflow gates."
  },
  P1_AFTER_MVP: {
    actionLabel: "Deferred",
    clientVisibilityDetail: "No client-visible payload is exposed from this deferred route.",
    guard: {
      description: "Deferred routes do not unlock current-release workflow.",
      detail: "No product action, release, export, mutation or client visibility is available from this deferred route.",
      stateTitle: "Deferred workflow unavailable",
      title: "Deferred Guard",
    },
    heading: "Deferred Workspace",
    interactionDetail: "Deferred routes expose no product controls in this release.",
    protectedScope: true,
    description:
      "Deferred after MVP. No product workflow, release, export, advice or client-visible change is available in this release."
  },
  REFERENCE_ONLY: {
    actionLabel: "Reference only",
    clientVisibilityDetail: "No client-visible payload is exposed from this reference route.",
    guard: {
      description: "Reference routes do not unlock product workflow.",
      detail: "No product action, release, export, mutation or client visibility is available from this route.",
      stateTitle: "Product workflow unavailable",
      title: "Reference Guard",
    },
    heading: "Reference Workspace",
    interactionDetail: "No product controls are available for reference-only routes.",
    protectedScope: true,
    description:
      "Read-only internal reference. No product workflow, mutation, release, export, advice or client-visible change is available."
  },
  HOLD_PENDING_DECISION: {
    actionLabel: "Held",
    clientVisibilityDetail: "No client-visible payload is exposed from this held route.",
    guard: {
      description: "Held routes require explicit scope and safety approval before any MVP workflow exists.",
      detail: "No product action, release, export, mutation or client visibility is available from this held route.",
      stateTitle: "Held workflow unavailable",
      title: "Hold Guard",
    },
    heading: "Held Workspace",
    interactionDetail: "Held routes expose no MVP controls until scope and safety are explicitly decided.",
    protectedScope: true,
    description:
      "Held pending explicit scope and safety decision. No MVP workflow, release, export, advice or client-visible change is available."
  }
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
      : `Missing gates: ${gate.missing.length > 0 ? gate.missing.join(", ") : "none"}.`;

  return (
    <AppShell>
      <div
        className="space-y-6"
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
          statusLabel={`${uxPolicy.pageType} · ${uxPolicy.densityTier}`}
          steps={uxFlowStepsForPageId(route.pageId)}
          title={route.title}
        />

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
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
                  Workflow stream
                </dt>
                <dd className="mt-2 text-sm font-semibold text-alphavest-ivory">{route.workflowName}</dd>
                <dd className="mt-1 text-sm text-alphavest-muted">{route.pageflowName}</dd>
              </div>
              <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-subtle">
                  Interaction pattern
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
                  Object scope
                </dt>
                <dd className="mt-2 text-sm font-semibold text-alphavest-ivory">
                  {route.objectType.replaceAll("_", " ").toLowerCase()}
                </dd>
                <dd className="mt-1 text-sm text-alphavest-muted">
                  Permission action: {route.permissionAction.toLowerCase()}
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

          <RouteDemoContextCard roleFamily={route.roleFamily} />
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
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
                  Nearby screens in the same navigation group are already registered for smoke coverage.
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
      </div>
    </AppShell>
  );
}
