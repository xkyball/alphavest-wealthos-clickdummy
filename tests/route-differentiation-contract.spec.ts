import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  allDomain16PageIds,
  domain16ContractViolations,
  domain16HeldPageIds,
  domain16ProductivePageIds,
  domain16ProductiveRouteBacking,
  domain16ReferencePageIds,
  evaluateDomain16RouteDifferentiation,
} from "../lib/route-differentiation-contract";
import {
  routeImplementationAccessDecision,
  routeToSmokePath,
  routeScopeForPageId,
  screenRoutes,
} from "../lib/route-registry";
import { operationalRouteGuidanceForRoute } from "../lib/operational-route-guidance";
import { uxHubDefinitionForPageId } from "../lib/ux-hub";

function readWorkspaceText(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test.describe("DOMAIN-16 route differentiation contract", () => {
  test("IMPL-01A keeps the area entry as proof-hardened route differentiation, not a product hub", () => {
    expect(allDomain16PageIds()).toEqual([
      "061",
      "062",
      "063",
      "064",
      "065",
      "066",
      "067",
      "070",
      "071",
      "068",
      "069",
    ]);
    expect(domain16ReferencePageIds).toEqual(["061", "062", "063"]);
    expect(domain16HeldPageIds).toEqual(["064", "065", "066", "067", "070", "071"]);
    expect(domain16ProductivePageIds).toEqual(["068", "069"]);
    expect(domain16ContractViolations()).toEqual([]);
  });

  test("held and reference routes cannot become implementation-shell accessible without scope unlock", () => {
    const protectedRows = evaluateDomain16RouteDifferentiation().filter(
      (row) => row.expectedClass !== "productive_operational",
    );

    expect(protectedRows.map((row) => row.pageId)).toEqual([
      "061",
      "062",
      "063",
      "064",
      "065",
      "066",
      "067",
      "070",
      "071",
    ]);

    for (const row of protectedRows) {
      expect(row.implementationShellAccessible, `${row.pageId} must stay registered-only`).toBe(false);
      expect(row.accessMode, `${row.pageId} access mode`).toBe("REGISTERED_ONLY");
      expect(routeImplementationAccessDecision({ pageId: row.pageId }).safetyBoundary).toBe("SCF_DO_NOT_IMPLEMENT_REGISTER");
    }
  });

  test("S068 and S069 are productive DOMAIN-16 routes with explicit service DB workflow backing contracts", () => {
    const reviewCalendar = evaluateDomain16RouteDifferentiation().find((row) => row.pageId === "068");
    const rebalanceMonitoring = evaluateDomain16RouteDifferentiation().find((row) => row.pageId === "069");

    expect(reviewCalendar).toBeDefined();
    expect(reviewCalendar?.expectedClass).toBe("productive_operational");
    expect(reviewCalendar?.scope).toBe("MVP");
    expect(reviewCalendar?.implementationShellAccessible).toBe(true);
    expect(reviewCalendar?.route.route).toBe("/reviews");
    expect(reviewCalendar?.route.navigationGroup).toBe("operations");
    expect(domain16ProductiveRouteBacking["068"]).toMatchObject({
      commandApi: "app/api/review-monitoring/actions/route.ts",
      commandService: "lib/review-monitoring-workflow-actions.ts",
      readApi: "app/api/review-monitoring/route.ts",
      readService: "lib/review-monitoring-service.ts",
      screenComponent: "components/review-monitoring-screen.tsx",
    });
    expect(domain16ProductiveRouteBacking["068"].dbModels).toEqual(
      expect.arrayContaining(["ReviewSchedule", "QueueItem", "Trigger", "ActionItem", "Recommendation", "AuditEvent"]),
    );
    expect(rebalanceMonitoring).toBeDefined();
    expect(rebalanceMonitoring?.expectedClass).toBe("productive_operational");
    expect(rebalanceMonitoring?.scope).toBe("MVP_SUPPORT");
    expect(rebalanceMonitoring?.implementationShellAccessible).toBe(true);
    expect(rebalanceMonitoring?.route.route).toBe("/reviews/:id");
    expect(domain16ProductiveRouteBacking["069"]).toMatchObject({
      commandApi: "app/api/review-monitoring/actions/route.ts",
      commandService: "lib/review-monitoring-workflow-actions.ts",
      readApi: "app/api/review-monitoring/route.ts?surface=rebalance",
      readService: "lib/review-monitoring-service.ts",
      screenComponent: "components/review-monitoring-screen.tsx",
    });
  });

  test("the catch-all router checks implementation access before legacy held components can render", () => {
    const routerSource = readWorkspaceText("app/[...segments]/page.tsx");
    const accessGuardIndex = routerSource.indexOf("if (!isRouteImplementationShellAccessible(route))");
    const kycRenderIndex = routerSource.indexOf("<KycAmlWorkflowScreen");
    const suitabilityRenderIndex = routerSource.indexOf("<SuitabilityIpsScreen");
    const committeeRenderIndex = routerSource.indexOf("<CommitteeReviewScreen");

    expect(accessGuardIndex).toBeGreaterThanOrEqual(0);
    expect(kycRenderIndex).toBeGreaterThan(accessGuardIndex);
    expect(suitabilityRenderIndex).toBeGreaterThan(accessGuardIndex);
    expect(committeeRenderIndex).toBeGreaterThan(accessGuardIndex);
  });

  test("legacy demo components are not accepted as service-backed unlock proof for held DOMAIN-16 routes", () => {
    const heldRoutes = screenRoutes.filter((route) => (domain16HeldPageIds as readonly string[]).includes(route.pageId));

    for (const route of heldRoutes) {
      expect(routeScopeForPageId(route.pageId), `${route.pageId} scope`).toBe("HOLD_PENDING_DECISION");
      expect(routeImplementationAccessDecision(route).implementationShellAccessible, `${route.pageId} accessible`).toBe(false);
    }

    expect(domain16HeldPageIds).not.toContain("068");
    expect(domain16HeldPageIds).not.toContain("069");
    expect(domain16ReferencePageIds).not.toContain("068");
    expect(domain16ReferencePageIds).not.toContain("069");
  });

  test("operational guidance and hubs do not route productive surfaces into protected DOMAIN-16 details", () => {
    const protectedDomain16PageIds = new Set<string>([...domain16ReferencePageIds, ...domain16HeldPageIds]);
    const protectedDomain16Hrefs = screenRoutes
      .filter((route) => protectedDomain16PageIds.has(route.pageId))
      .map((route) => routeToSmokePath(route.route));
    const productiveDomain16Routes = screenRoutes.filter((route) =>
      (domain16ProductivePageIds as readonly string[]).includes(route.pageId),
    );

    for (const route of productiveDomain16Routes) {
      const guidance = operationalRouteGuidanceForRoute(route);
      const guidanceHrefs = [
        guidance.primaryAction?.href,
        guidance.nextStep?.href,
        guidance.ctaState.primaryAction?.href,
        guidance.ctaState.recovery?.href,
        ...guidance.relatedRoutes.map((relatedRoute) => relatedRoute.href),
      ].filter(Boolean);
      const hub = uxHubDefinitionForPageId(route.pageId);
      const hubHrefs = hub ? [hub.primaryAction.href, ...hub.queue.map((queueRoute) => queueRoute.href)] : [];

      expect(guidanceHrefs, `${route.pageId} operational guidance hrefs`).toEqual(
        expect.not.arrayContaining(protectedDomain16Hrefs),
      );
      expect(hubHrefs, `${route.pageId} hub hrefs`).toEqual(expect.not.arrayContaining(protectedDomain16Hrefs));
    }

    for (const pageId of [...domain16ReferencePageIds, ...domain16HeldPageIds]) {
      expect(uxHubDefinitionForPageId(pageId), `${pageId} must not expose a productive hub definition`).toBeNull();
    }
  });

  test("S068 and S069 proof, audit and client-safe boundaries remain service-backed instead of UI-explained", () => {
    const backing = domain16ProductiveRouteBacking["068"];
    const readApi = readWorkspaceText(backing.readApi);
    const commandApi = readWorkspaceText(backing.commandApi);
    const commandService = readWorkspaceText(backing.commandService);
    const screen = readWorkspaceText(backing.screenComponent);

    expect(readApi).toContain("getReviewMonitoringSnapshot");
    expect(readApi).toContain("noClientRelease: true");
    expect(readApi).toContain("noAdviceExecution: true");
    expect(readApi).toContain("mutated: false");

    expect(commandApi).toContain("runReviewMonitoringWorkflowAction");
    expect(commandApi).toContain("clientVisible: false");
    expect(commandApi).toContain("noClientRelease: true");
    expect(commandApi).toContain("noAdviceExecution: true");

    expect(commandService).toContain("auditEvent.create");
    expect(commandService).toContain("noClientRelease: true");
    expect(commandService).toContain("clientVisible: false");
    expect(commandService).toContain("j16.scheduleReview");
    expect(commandService).toContain("j17.blockRebalanceTrigger");

    expect(screen).toContain('fetch("/api/review-monitoring"');
    expect(screen).toContain('surface: "rebalance"');
    expect(screen).toContain('fetch("/api/review-monitoring/actions"');
    expect(screen).not.toMatch(/DOMAIN-16|step contract|proof panel|RouteSkeletonPage/i);
  });
});
