import { expect, type Page, test } from "@playwright/test";

import { createDemoSession } from "../lib/demo-session";
import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { navigationGroupsForRole, productiveNavigationPageIds, uxNavigationPolicyForPageId } from "../lib/navigation";
import {
  eligibleUxPageContracts,
  protectedUxPageContracts,
  uxPageContractIntegrity,
  uxPageContracts,
} from "../lib/ux-page-contract";
import { uxContentHierarchyForPageType } from "../lib/ux-content-hierarchy";
import { uxDensityForPageId, uxDensityTierContracts } from "../lib/ux-density";
import { operationalRouteGuidanceForRoute } from "../lib/operational-route-guidance";
import { processFirstUxContractForPageId } from "../lib/process-first-ux-contract";
import { uxHubDefinitionForPageId } from "../lib/ux-hub";
import {
  groupedImplementationScreenRoutes,
  routeImplementationAccessDecision,
  routeScopeForPageId,
  routeSmokeList,
  routeToSmokePath,
  routeWorksetIntegrity,
  routeWorksetPageIds,
  screenRoutes
} from "../lib/route-registry";
import { scfDoNotImplementRegister } from "../lib/scf-foundation";
import { uxFlowStepsForPageId } from "../lib/ux-route-policy";

const lockedRouteWorksetCounts = {
  MVP: 31,
  MVP_SUPPORT: 25,
  P1_AFTER_MVP: 5,
  REFERENCE_ONLY: 3,
  HOLD_PENDING_DECISION: 7
};

const mvpPageIds = new Set<string>(routeWorksetPageIds.MVP);
const mvpSupportPageIds = new Set<string>(routeWorksetPageIds.MVP_SUPPORT);
const p1PageIds = new Set<string>(routeWorksetPageIds.P1_AFTER_MVP);
const referencePageIds = new Set<string>(routeWorksetPageIds.REFERENCE_ONLY);
const holdPageIds = new Set<string>(routeWorksetPageIds.HOLD_PENDING_DECISION);

async function authenticateRouteSmokePage(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("registered route smoke", () => {
  for (const route of routeSmokeList) {
    test(`${route.pageId} ${route.path}`, async ({ request }) => {
      const response = await request.get(route.path);
      expect(response.status(), `${route.pageId} ${route.path}`).toBe(200);

      const body = await response.text();
      expect(body).toContain("AlphaVest WealthOS");
    });
  }

  test("unknown catalogue route returns hardened not-found surface", async ({ request }) => {
    const response = await request.get("/not-a-catalogue-route");
    expect([200, 404]).toContain(response.status());

    const body = await response.text();
    expect(body).toContain("Route unavailable");
  });
});

test.describe("UX-NAV route policy navigation", () => {
  test("materializes UX route policy metadata for every registered route", () => {
    for (const route of screenRoutes) {
      const policy = uxNavigationPolicyForPageId(route.pageId);

      expect(policy.routePolicyLabels.length, `${route.pageId} policy labels`).toBeGreaterThan(0);
      expect(policy.routePolicyLabels).toContain("NO_ROUTE_RECLASSIFICATION");
      expect(policy.routePolicyLabels).toContain("NO_SCREEN_GENERATION");
    }
  });

  test("keeps productive navigation to MVP and MVP support routes only", () => {
    expect(productiveNavigationPageIds).not.toEqual(
      expect.arrayContaining([
        ...routeWorksetPageIds.P1_AFTER_MVP,
        ...routeWorksetPageIds.REFERENCE_ONLY,
        ...routeWorksetPageIds.HOLD_PENDING_DECISION,
      ]),
    );

    for (const pageId of productiveNavigationPageIds) {
      expect(["MVP", "MVP_SUPPORT"]).toContain(routeScopeForPageId(pageId));
    }
  });

  test("uses the approved final app area labels instead of a raw route-list model", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const labels = navigationGroupsForRole(admin.role).map((group) => group.label);

    expect(labels).toEqual([
      "Foundation",
      "Client Context",
      "Evidence Lifecycle",
      "Analyst Workbench",
      "Advisor Review",
      "Compliance Release",
      "Decision Record",
      "Client Visibility",
      "Export & Delivery",
      "Operations",
      "Protected Work",
    ]);
  });

  test("role-aware navigation filtering does not imply action or content authority", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const groups = navigationGroupsForRole(principal.role);
    const linkedLabels = groups.filter((group) => group.items.length > 0).map((group) => group.label);
    const lockedLabels = groups.filter((group) => group.lockedReason).map((group) => group.label);

    expect(linkedLabels).toEqual(["Client Context", "Evidence Lifecycle", "Decision Record", "Client Visibility"]);
    expect(lockedLabels).toEqual(["Foundation", "Analyst Workbench", "Advisor Review", "Compliance Release", "Export & Delivery", "Operations", "Protected Work"]);
    for (const group of groups.filter((candidate) => candidate.lockedReason)) {
      expect(group.items).toHaveLength(0);
      if (group.label === "Operations" || group.label === "Protected Work") {
        expect(group.lockedReason).toMatch(/support work|current delivery/);
      } else {
        expect(group.lockedReason).toContain("client-safe navigation view");
      }
    }
  });

  test("preserves route policy page types from the matrix for hub and workbench navigation", () => {
    for (const pageId of ["007", "015", "019", "020", "024", "031", "033", "034", "043", "046", "048", "054"]) {
      expect(uxNavigationPolicyForPageId(pageId).pageType, `${pageId} should be a hub`).toBe("Hub");
    }

    expect(uxNavigationPolicyForPageId("013").pageType).toBe("Workbench");
    expect(uxNavigationPolicyForPageId("038").pageType).toBe("Workbench");
    for (const pageId of routeWorksetPageIds.P1_AFTER_MVP) {
      expect(uxNavigationPolicyForPageId(pageId).pageType, `${pageId} should stay deferred`).toBe("P1");
    }
    for (const pageId of routeWorksetPageIds.HOLD_PENDING_DECISION) {
      expect(uxNavigationPolicyForPageId(pageId).pageType, `${pageId} should stay held`).toBe("Hold");
    }
  });

  test("step rails keep later checks blocked until prerequisites pass", () => {
    const advisorySteps = uxFlowStepsForPageId("038");
    expect(advisorySteps.map((step) => step.status)).toEqual([
      "complete",
      "complete",
      "complete",
      "current",
      "upcoming",
      "blocked",
      "blocked",
    ]);
    expect(advisorySteps.filter((step) => step.status === "complete")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ disabledReason: expect.stringContaining("does not unlock this check") }),
      ]),
    );
    expect(advisorySteps.filter((step) => step.status === "blocked")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ disabledReason: expect.stringContaining("Future check stays blocked") }),
      ]),
    );
  });

  test("renders product context, current check and one primary next step above the desktop fold", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await authenticateRouteSmokePage(page);
    await page.goto("/advisory/review-queue");

    await expect(page.getByTestId("wp02-worksurface-shell").first()).toHaveAttribute("data-wp02-route-id", "034");
    await expect(page.getByText("One selected work item, one blocker, one controlled next action.").first()).toBeVisible();
    await expect(page.locator('[data-ux-queue-row]').first()).toBeVisible();
    await expect(page.locator('[data-ux-queue-selected="true"]').first()).toBeVisible();
    await expect(page.getByText("Open review work").first()).toBeVisible();
    await expect(page.getByText("Client visibility held").first()).toBeVisible();
    await expect(page.getByTestId("ux-nav-route-context").first()).toContainText("Workbench");
    await expect(page.getByText("034 · Workbench")).toHaveCount(0);
  });
});

test.describe("UX-PAGE page type contract", () => {
  test("materializes page type and page job for every registered route", () => {
    expect(uxPageContractIntegrity.totalCount).toBe(71);
    expect(uxPageContractIntegrity.missingPageIds).toEqual([]);
    expect(uxPageContractIntegrity.duplicatePageIds).toEqual([]);

    for (const contract of uxPageContracts) {
      expect(contract.pageType, `${contract.pageId} page type`).toBeTruthy();
      expect(contract.pageJob, `${contract.pageId} page job`).toContain(" ");
      expect(contract.allowedTreatment, `${contract.pageId} allowed treatment`).toContain(" ");
      expect(contract.forbiddenTreatment, `${contract.pageId} forbidden treatment`).toContain("No");
      expect(contract.routePolicyLabels, `${contract.pageId} policy labels`).toEqual(
        expect.arrayContaining(["NO_ROUTE_RECLASSIFICATION", "NO_SCREEN_GENERATION"]),
      );
    }
  });

  test("applies productive contracts only to MVP and MVP support routes", () => {
    expect(uxPageContractIntegrity.eligibleCount).toBe(56);

    for (const contract of eligibleUxPageContracts) {
      expect(["MVP", "MVP_SUPPORT"], `${contract.pageId} scope`).toContain(contract.routeScope);
      expect(["P1", "Reference", "Hold"], `${contract.pageId} page type`).not.toContain(contract.pageType);
      expect(contract.productiveUxEligible, `${contract.pageId} productive eligibility`).toBe(true);
      expect(contract.primaryCtaRule, `${contract.pageId} CTA rule`).not.toContain("No productive MVP CTA");
    }
  });

  test("keeps deferred, reference and held routes out of productive page type work", () => {
    expect(uxPageContractIntegrity.protectedCount).toBe(15);

    for (const contract of protectedUxPageContracts) {
      expect(["P1_AFTER_MVP", "REFERENCE_ONLY", "HOLD_PENDING_DECISION"], `${contract.pageId} protected scope`).toContain(contract.routeScope);
      expect(contract.productiveUxEligible, `${contract.pageId} productive eligibility`).toBe(false);
      expect(["P1", "Reference", "Hold"], `${contract.pageId} page type`).toContain(contract.pageType);
      expect(contract.forbiddenTreatment, `${contract.pageId} forbidden treatment`).toMatch(/No (productive|MVP)/);
    }
  });
});

test.describe("UX-HUB phase 3 orientation hubs", () => {
  const phase3HubRoutes = [
    { path: "/client/home", taskId: "UX-HUB-001", pageId: "019" },
    { path: "/advisory", taskId: "UX-HUB-002", pageId: "033" },
    { path: "/evidence", taskId: "UX-HUB-003", pageId: "046" },
    { path: "/compliance/reviews", taskId: "UX-HUB-004", pageId: "038", proofOnly: true },
    { path: "/export/new", taskId: "UX-HUB-005", pageId: "054" },
    { path: "/governance", taskId: "UX-HUB-006", pageId: "048" },
  ];

  test("defines Phase 3 hub contracts with summary, priority, queue and safety guidance", () => {
    for (const route of phase3HubRoutes) {
      const hub = uxHubDefinitionForPageId(route.pageId);

      expect(hub, `${route.taskId} ${route.pageId} hub definition`).toBeTruthy();
      expect(hub?.summary, `${route.taskId} summary`).toContain(" ");
      expect(hub?.priorityCards, `${route.taskId} priority cards`).toHaveLength(3);
      expect(hub?.queue.length, `${route.taskId} queue links`).toBeGreaterThanOrEqual(3);
      expect(hub?.safetyNote, `${route.taskId} safety note`).toMatch(/cannot|must not|No|not/i);
      if (!route.proofOnly) {
        expect(uxNavigationPolicyForPageId(route.pageId).pageType, `${route.taskId} page type`).toBe("Hub");
      }
    }
  });

  const renderedPhase3HubRoutes = phase3HubRoutes.filter((route) => !["038", "046", "048", "054"].includes(route.pageId));

  for (const route of renderedPhase3HubRoutes) {
    test(`${route.taskId} ${route.path} renders a focused orientation hub`, async ({ page }) => {
      await page.setViewportSize({ height: 1100, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      if (route.pageId === "019") {
        const entry = page.getByTestId("epic-07-client-family-entry");
        await expect(entry).toBeVisible();
        await expect(entry).toHaveAttribute("data-epic-07-contract", "client_family_context_foundation");
        await expect(entry).toHaveAttribute("data-epic-07-no-overclaim", "true");
        await expect(page.getByTestId("epic-07-primary-next-action")).toHaveCount(1);
        await expect(page.getByTestId("epic-07-proof-boundary")).toContainText("No client release");
        return;
      }

      const hub = page.getByTestId("ux-hub-page").first();
      await expect(hub).toBeVisible();
      await expect(hub).toHaveAttribute("data-ux-hub-task", "phase-3");
      await expect(hub.getByTestId("ux-hub-summary")).toBeVisible();
      await expect(hub.locator('[data-ux-hub-priority-card="true"]')).toHaveCount(3);
      await expect(hub.getByTestId("ux-hub-primary-next-work")).toHaveCount(1);
      expect(await hub.getByTestId("ux-hub-next-link").count()).toBeGreaterThan(2);
      await expect(hub.getByTestId("ux-hub-safety-note")).toBeVisible();
    });
  }

  test("EPIC-07 S019 area entry fits the 1440x1000 viewport without page scroll", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/client/home?state=base");

    const entry = page.getByTestId("epic-07-client-family-entry");
    await expect(entry).toBeVisible();
    await expect(page.getByTestId("epic-07-primary-next-action")).toHaveCount(1);
    await expect(page.getByTestId("epic-07-proof-boundary")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    }));

    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight);
  });

  test("EPIC-07 core context routes expose queue detail and step gates", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);

    await page.goto("/client/family-members");
    const familySurface = page.getByTestId("epic-07-family-core-surface");
    await expect(familySurface).toBeVisible();
    await expect(familySurface).toHaveAttribute("data-epic-07-process", "BP-004");
    await expect(familySurface).toHaveAttribute("data-epic-07-surface", "queue-detail");
    await expect(familySurface).toHaveAttribute("data-epic-07-no-overclaim", "true");
    await expect(page.getByTestId("epic-07-family-queue-surface")).toBeVisible();
    await expect(page.getByTestId("epic-07-family-detail-surface")).toBeVisible();

    await page.goto("/entities");
    const entitySurface = page.getByTestId("epic-07-entity-core-surface");
    await expect(entitySurface).toBeVisible();
    await expect(entitySurface).toHaveAttribute("data-epic-07-process", "BP-006");
    await expect(entitySurface).toHaveAttribute("data-epic-07-surface", "queue");
    await expect(entitySurface).toHaveAttribute("data-epic-07-no-overclaim", "true");
    await expect(page.getByTestId("epic-07-entity-queue-surface")).toBeVisible();

    await page.goto("/entities/new");
    const entityStepSurface = page.getByTestId("epic-07-entity-step-surface");
    await expect(entityStepSurface).toBeVisible();
    await expect(entityStepSurface).toHaveAttribute("data-epic-07-process", "BP-006");
    await expect(entityStepSurface).toHaveAttribute("data-epic-07-surface", "step");
    await expect(entityStepSurface).toHaveAttribute("data-epic-07-no-overclaim", "true");
  });

  test("EPIC-07 core context routes fit the 1440x1000 viewport without page scroll", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);

    for (const { path, testId } of [
      { path: "/client/family-members", testId: "epic-07-family-core-surface" },
      { path: "/entities", testId: "epic-07-entity-core-surface" },
      { path: "/entities/new", testId: "epic-07-entity-step-surface" },
    ]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.getByTestId(testId)).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        clientHeight: document.documentElement.clientHeight,
        scrollHeight: document.documentElement.scrollHeight,
      }));

      expect(dimensions.scrollHeight, path).toBeLessThanOrEqual(dimensions.clientHeight);
    }
  });

  test("EPIC-07 proof audit disclosures preserve negative no-overclaim boundaries", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);

    for (const path of ["/client/family-members", "/entities", "/entities/new"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const disclosure = page.getByTestId("epic-07-proof-audit-disclosure");
      await expect(disclosure).toBeVisible();
      await expect(disclosure).toHaveAttribute("data-epic-07-no-overclaim", "true");
      await expect(disclosure).toHaveAttribute("data-epic-07-client-release", "not_mutated");
      await expect(disclosure).toHaveAttribute("data-epic-07-evidence-sufficiency", "not_claimed");
      await disclosure.locator("summary").click();
      await expect(page.getByTestId("epic-07-proof-audit-drawer")).toContainText("Not changed");
      await expect(page.getByTestId("epic-07-proof-audit-drawer")).toContainText("Not claimed");
      await expect(page.locator("main")).not.toContainText(/release complete|client visibility unlocked|evidence sufficient|export ready|approved advice/i);
    }
  });

  test("EPIC-07 relationship graph exposes step depth and audit failure boundary without page scroll", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/relationships");
    await page.waitForLoadState("networkidle");

    const surface = page.getByTestId("epic-07-relationship-depth-surface");
    await expect(surface).toBeVisible();
    await expect(surface).toHaveAttribute("data-epic-07-process", "BP-005");
    await expect(surface).toHaveAttribute("data-epic-07-surface", "relationship-depth");
    await expect(surface).toHaveAttribute("data-epic-07-no-overclaim", "true");
    await expect(page.getByTestId("epic-07-relationship-depth-step")).toHaveCount(3);
    await expect(page.getByTestId("epic-07-relationship-audit-fail-closed")).toContainText("not created");
    await expect(page.getByTestId("j09-family-map")).toBeVisible();
    await expect(page.getByTestId("j09-add-relationship")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    }));

    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight);
  });
});

test.describe("UX-WORKBENCH phase 4 active task workbenches", () => {
  const phase4WorkbenchRoutes = [
    { path: "/advisory/triggers/demo/review", taskId: "UX-WORKBENCH-001" },
  ];
  const phase4ClientSuppressedRoutes = [
    { family: "client_portal", path: "/documents/demo/review", taskId: "UX-WORKBENCH-002" },
  ];

  test("keeps client-safe workbench tasks suppressed instead of rendering proof panels", async ({ page }) => {
    for (const route of phase4ClientSuppressedRoutes) {
      await page.setViewportSize({ height: 1100, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const boundary = page.getByTestId("e07-client-safe-ui-boundary").first();
      await expect(boundary).toHaveAttribute("data-e07-client-safe-family", route.family);
      await expect(boundary).toHaveAttribute("data-e07-suppressed-classes", /ux_task_id/);
      await expect(page.locator('[data-testid="ux-workbench-phase4"][data-ux-workbench-task="' + route.taskId + '"]')).toHaveCount(0);
    }
  });

  for (const route of phase4WorkbenchRoutes) {
    test(`${route.taskId} ${route.path} renders queue, active context and guarded action rail`, async ({ page }) => {
      await page.setViewportSize({ height: 1100, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const workbench = page.getByTestId("ux-workbench-phase4").first();
      await expect(workbench).toBeVisible();
      await expect(workbench).toHaveAttribute("data-ux-workbench-task", route.taskId);
      await expect(workbench.getByTestId("ux-workbench-triad")).toBeVisible();
      await expect(workbench.getByTestId("ux-workbench-queue")).toHaveCount(1);
      await expect(workbench.getByTestId("ux-workbench-active-context")).toHaveCount(1);
      await expect(workbench.getByTestId("ux-workbench-action-rail")).toHaveCount(1);
      await expect(workbench.getByTestId("ux-workbench-blocker")).toContainText(/blocked|cannot|requires|does not/i);
      await expect(workbench.getByTestId("ux-workbench-safety-note")).toContainText(/client|release|export|visibility|advice|compliance|evidence/i);
      await expect(workbench).not.toContainText(/UX-WORKBENCH-\d{3}/);
      await expect(workbench.getByTestId("ux-workbench-primary-cta")).toHaveCount(1);
      await expect(workbench.getByTestId("ux-workbench-primary-cta")).toBeDisabled();
    });
  }
});



test.describe("process-first release and governance route contracts", () => {
  const processFirstRoutes = [
    { currentStep: "advisor_review", pageId: "037", path: "/advisor/reviews/demo" },
    { currentStep: "compliance_release_decision", pageId: "039", path: "/compliance/reviews/demo/decision-room" },
    { currentStep: "governance_user_review", pageId: "048", path: "/governance" },
    { currentStep: "access_request_review", pageId: "050", path: "/governance/access-requests/demo" },
  ];
  const compactOperationalProcessRoutes = new Set(["050"]);

  for (const route of processFirstRoutes) {
    test(`${route.pageId} ${route.path} exposes process-first gate metadata without visible internal scaffolding`, async ({ page }) => {
      const contract = processFirstUxContractForPageId(route.pageId);

      await page.setViewportSize({ height: 1200, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const gate = page
        .locator(`[data-ux-process-first="true"][data-ux-process-current-step="${route.currentStep}"]`)
        .first();
      await expect(gate).toBeVisible();
      if (compactOperationalProcessRoutes.has(route.pageId)) {
        await expect(page.getByTestId("wp02-worksurface-summary-banner")).toHaveCount(0);
      }
      await expect(gate).toHaveAttribute("data-ux-process-business-processes", contract.businessProcessIds.join(" "));
      await expect(gate).toHaveAttribute("data-ux-process-acceptance-gates", contract.acceptanceIds.join(" "));
      await expect(gate).toHaveAttribute("data-ux-process-gate-ids", contract.gateIds.join(" "));
      await expect(gate).toHaveAttribute("data-ux-process-next-step", contract.nextPermittedAction);
      await expect(gate).toContainText(/blocked|required|review|gate|approval|audit|release|redaction|scope/i);
      await expect(gate).not.toContainText(/UX-[A-Z0-9-]+-\d{3}|WP-?\d+|EPIC-\d+|DOMAIN-[A-Z]|S\d{3}|BP-\d{3}|ACC-\d{3}|P0_[A-Z0-9_]+|data-testid|data-ux-|visual proof|Workflow step|proof scaffolding/i);
    });
  }
});


test.describe("UX-PAGE detail standard", () => {

test.describe("UX-DETAIL / UX-PAGE-SPLIT phase 5 object review", () => {
  const phase5Routes = [
    { path: "/evidence/demo/review", taskId: "UX-DETAIL-001", splitTaskId: "UX-PAGE-SPLIT-002" },
    { path: "/advisory/triggers/demo/review", taskId: "UX-DETAIL-003", splitTaskId: "UX-PAGE-SPLIT-001" },
    { path: "/compliance/reviews/demo/audit", taskId: "UX-DETAIL-005", splitTaskId: "UX-PAGE-SPLIT-006" },
    { path: "/advisory", taskId: "UX-PAGE-SPLIT-001", splitTaskId: "UX-PAGE-SPLIT-001" },
  ];
  const phase5ClientSuppressedRoutes = [
    { path: "/entities/demo", taskId: "UX-DETAIL-002", splitTaskId: "UX-PAGE-SPLIT-007" },
    { path: "/documents/review-queue", taskId: "UX-PAGE-SPLIT-002", splitTaskId: "UX-PAGE-SPLIT-002" },
    { path: "/client/home", taskId: "UX-PAGE-SPLIT-007", splitTaskId: "UX-PAGE-SPLIT-007" },
  ];

  test("covers every Phase 5 task exactly in route proof inputs", () => {
    expect(new Set([...phase5Routes, ...phase5ClientSuppressedRoutes].map((route) => route.taskId))).toEqual(new Set([
      "UX-DETAIL-001",
      "UX-DETAIL-002",
      "UX-DETAIL-003",
      "UX-DETAIL-005",
      "UX-PAGE-SPLIT-001",
      "UX-PAGE-SPLIT-002",
      "UX-PAGE-SPLIT-005",
      "UX-PAGE-SPLIT-007",
    ]));
  });

  for (const route of phase5Routes) {
    test(route.taskId + " " + route.path + " exposes object state, decision support and split boundary", async ({ page }) => {
      await page.setViewportSize({ height: 1100, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const panel = page.locator('[data-testid="ux-phase5-detail-split"][data-ux-phase5-task="' + route.taskId + '"]').first();
      await expect(panel).toBeVisible();
      await expect(panel).toHaveAttribute("data-ux-phase5-split-task", route.splitTaskId);
      await expect(panel).not.toContainText(/UX-(DETAIL|PAGE-SPLIT)-\d{3}/);
      await expect(panel.getByTestId("ux-phase5-object-state")).toContainText(/state|active|pending|blocked|verified|review|release|overview|package|breach|trigger|request|evidence/i);
      await expect(panel.getByTestId("ux-phase5-decision-support")).toContainText(/separates|support|explains|shows|captures|distinguishes|routes|reviewed/i);
      await expect(panel.getByTestId("ux-phase5-drawer-boundary")).toContainText(/cannot|No client-visible|release|export|payload|advice|visibility/i);
      await expect(panel.getByTestId("ux-phase5-page-job")).toContainText(/without|separate|one|routes|handles|reviews|supports|choose/i);
    });
  }

  for (const route of phase5ClientSuppressedRoutes) {
    test(route.taskId + " " + route.path + " suppresses object-review proof panel in client-safe UI", async ({ page }) => {
      await page.setViewportSize({ height: 1100, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const boundary = page.getByTestId("e07-client-safe-ui-boundary").first();
      await expect(boundary).toHaveAttribute("data-e07-client-safe-ui-boundary", "true");
      await expect(boundary).toHaveAttribute("data-e07-suppressed-classes", /proof_scaffolding/);
      await expect(boundary).toHaveAttribute("data-e07-suppressed-classes", /ux_task_id/);
      await expect(page.locator('[data-testid="ux-phase5-detail-split"][data-ux-phase5-task="' + route.taskId + '"]')).toHaveCount(0);
      await expect(page.locator('[data-testid="ux-phase5-detail-split"][data-ux-phase5-split-task="' + route.splitTaskId + '"]')).toHaveCount(0);
    });
  }

});

  const uxPage003Routes = [
    "/advisory/triggers/demo/review",
    "/compliance/reviews/demo/release",
    "/compliance/reviews/demo/block",
    "/decisions/demo",
    "/decisions/demo/success",
    "/evidence/demo/review",
  ];

  for (const path of uxPage003Routes) {
    test(`${path} renders object header, evidence timeline and gated action rail`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const detailStandard = page.getByTestId("ux-page-detail-standard").first();
      await expect(detailStandard).toBeVisible();
      await expect(detailStandard.getByTestId("ux-page-detail-object-header")).toHaveCount(1);
      await expect(detailStandard.getByTestId("ux-page-detail-key-facts")).toHaveCount(1);
      await expect(detailStandard.getByTestId("ux-page-detail-evidence-timeline")).toHaveCount(1);
      await expect(detailStandard.getByTestId("ux-page-detail-gated-action-rail")).toHaveCount(1);
    });
  }
});

test.describe("UX-COMPLEXITY priority hierarchy", () => {
  const uxComplexity001Routes = [
    "/actions",
    "/compliance/reviews/demo/audit",
  ];

  for (const path of uxComplexity001Routes) {
    test(`${path} renders summary strip, priority queue and action rail`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const panel = page.getByTestId("ux-complexity-priority-panel").first();
      await expect(panel).toBeVisible();
      await expect(panel.getByTestId("ux-complexity-summary-strip")).toHaveCount(1);
      await expect(panel.getByTestId("ux-complexity-priority-queue")).toHaveCount(1);
      await expect(panel.getByTestId("ux-complexity-action-rail")).toHaveCount(1);
    });
  }
});

test.describe("UX-COMPLEXITY secondary context drawers and tabs", () => {
  const uxComplexity002Routes = [
    "/wealth-map?state=drawer",
    "/evidence?state=drawer",
    "/governance?state=drawer",
    "/governance/access-requests/demo?state=drawer",
  ];

  for (const path of uxComplexity002Routes) {
    test(`${path} keeps secondary context in tabs with visible safety notes`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const tabs = page.getByTestId("ux-complexity-secondary-tabs").first();
      await expect(tabs).toBeVisible();
      await expect(tabs.getByTestId("ux-complexity-secondary-tablist")).toBeVisible();
      expect(await tabs.getByTestId("ux-complexity-secondary-tab").count()).toBeGreaterThan(1);
      await expect(tabs.getByTestId("ux-complexity-secondary-safety-note")).toBeVisible();
      await expect(tabs.getByTestId("ux-complexity-secondary-active-panel")).toBeVisible();
    });
  }
});

test.describe("UX-COMPLEXITY content priority hierarchy", () => {
  test("defines Must-see, Secondary and Tertiary content for every page type", () => {
    for (const contract of uxPageContracts) {
      const hierarchy = uxContentHierarchyForPageType(contract.pageType);

      expect(hierarchy.mustSee.length, `${contract.pageId} must-see`).toBeGreaterThan(0);
      expect(hierarchy.secondary.length, `${contract.pageId} secondary`).toBeGreaterThan(0);
      expect(hierarchy.tertiary.length, `${contract.pageId} tertiary`).toBeGreaterThan(0);
    }
  });

  const representativeRoutes = [
    "/wealth-map",
    "/actions",
    "/evidence?state=drawer",
  ];

  for (const path of representativeRoutes) {
    test(`${path} exposes visible priority tiers without surfacing handbook copy`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      await expect(page.locator('[data-ux-content-tier="must-see"]').first()).toBeVisible();
      await expect(page.locator('[data-ux-content-tier="secondary"]').first()).toBeVisible();
      await expect(page.getByText(/gate-completion proof|visual proof|Workflow step|complexity reduction/i)).toHaveCount(0);
    });
  }
});

test.describe("UX-COMPLEXITY CTA clusters", () => {
  const ctaRoutes = [
    "/actions",
    "/actions?state=drawer",
    "/evidence/demo/review",
    "/export/demo/redaction",
  ];

  for (const path of ctaRoutes) {
    test(`${path} exposes one primary CTA with contextual secondary actions`, async ({ page }) => {
      await page.setViewportSize({ height: 900, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const cluster = page.getByTestId("ux-complexity-cta-cluster").first();
      await expect(cluster).toBeVisible();
      await expect(cluster.locator('[data-ux-primary-cta="true"]')).toHaveCount(1);
      await expect(cluster.locator('[data-ux-secondary-cta="true"]').first()).toBeVisible();
      await expect(cluster.getByTestId("ux-complexity-cta-blocked-reason")).toBeVisible();
    });
  }
});

test.describe("UX-DENSITY tier contract", () => {
  test("defines D1-D4 density layout patterns", () => {
    expect(Object.keys(uxDensityTierContracts).sort()).toEqual(["D1", "D2", "D3", "D4"]);

    for (const contract of Object.values(uxDensityTierContracts)) {
      expect(contract.pattern).toMatch(/^[a-z-]+$/);
      expect(contract.description.length).toBeGreaterThan(20);
      expect(contract.shellClassName.length).toBeGreaterThan(0);
    }
  });

  const representatives = [
    { path: "/actions", pattern: "productive-workbench", tier: "D2" },
    { path: "/export/demo/redaction", pattern: "dense-operations", tier: "D3" },
    { path: "/evidence/demo/review", pattern: "focused-detail", tier: "D4" },
  ];

  for (const representative of representatives) {
    test(`${representative.path} exposes ${representative.tier} density metadata`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(representative.path);

      const densitySurface = page.locator(`[data-ux-density-tier="${representative.tier}"]`).first();
      await expect(densitySurface).toBeVisible();
      await expect(densitySurface).toHaveAttribute("data-ux-density-pattern", representative.pattern);
    });
  }
});

test.describe("UX-DENSITY calm executive client views", () => {
  for (const path of ["/client/home"]) {
    test(`${path} keeps the client home product entry free of legacy density proof UI`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const clientEntry = page.getByTestId("epic-07-client-family-entry");
      await expect(clientEntry).toBeVisible();
      await expect(clientEntry).toHaveAttribute("data-epic-07-no-overclaim", "true");
      await expect(page.locator('[data-ux-d1-calm-executive="true"]')).toHaveCount(0);
      await expect(page.getByTestId("ux-d1-state-card")).toHaveCount(0);
      await expect(page.getByTestId("ux-d1-next-step-panel")).toHaveCount(0);
      await expect(page.getByTestId("ux-d1-source-summary")).toHaveCount(0);
      await expect(page.getByTestId("ux-hub-queue")).toHaveCount(0);

      await expect(clientEntry).toContainText(/release|released|hidden|client/i);
      await expect(clientEntry).not.toContainText(/D1|calm executive|Workflow step|route policy|gate-completion proof|visual proof|complexity reduction/i);
    });
  }
});

test.describe("UX-DENSITY productive workbench routes", () => {
  test("keeps D4 detail routes in the related range out of D2 workbench coercion", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);

    expect(uxDensityForPageId("039").tier).toBe("D4");
    expect(uxDensityForPageId("047").tier).toBe("D4");

    for (const path of ["/compliance/reviews/demo/decision-room", "/evidence/demo/review"]) {
      await page.goto(path);
      await expect(page.locator('[data-ux-d2-productive-workbench="true"]')).toHaveCount(0);
    }
  });
});

test.describe("UX-DENSITY dense operations routes", () => {
  const d3OperationsRoutes = [
    { pageId: "042", path: "/compliance/reviews/demo/audit" },
  ];

  test("keeps export-new as D2 request start rather than D3 operations table", async ({ page }) => {
    expect(uxDensityForPageId("054").tier).toBe("D2");

    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/export/new");

    await expect(page.getByTestId("ux-d3-dense-operations")).toHaveCount(0);
    await expect(page.getByTestId("wp02-worksurface-shell").getByRole("heading", { name: "Create Export" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Select contents/i })).toBeVisible();
    await expect(page.getByTestId("ux-hub-page")).toHaveCount(0);
  });

  for (const route of d3OperationsRoutes) {
    test(`${route.pageId} ${route.path} applies D3 table-first operations density`, async ({ page }) => {
      expect(uxDensityForPageId(route.pageId).tier).toBe("D3");

      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const operations = page.getByTestId("ux-d3-dense-operations").first();
      await expect(operations).toBeVisible();
      await expect(operations).toHaveAttribute("data-ux-density-tier", "D3");
      await expect(operations).toHaveAttribute("data-ux-density-pattern", "dense-operations");
      await expect(operations.getByTestId("ux-d3-filter-sort-controls")).toBeVisible();
      await expect(operations.getByTestId("ux-data-table").first()).toBeVisible();
      await expect(operations.getByTestId("ux-data-table-sort").first()).toBeVisible();
      await expect(operations.getByTestId("ux-data-table-row-action").first()).toBeVisible();
      await expect(operations).toContainText(/blocked|gate|approval|audit|payload|permission|redaction|release/i);
      await expect(operations).not.toContainText(/complexity reduction|gate-completion proof|Workflow step|visual proof/i);
    });
  }
});

test.describe("UX-DENSITY focused detail routes", () => {
  const d4DetailRoutes = [
    { pageId: "035", path: "/advisory/triggers/demo/review" },
    { pageId: "044", path: "/decisions/demo" },
    { pageId: "047", path: "/evidence/demo/review" },
  ];

  for (const route of d4DetailRoutes) {
    test(`${route.path} applies D4 focused detail density`, async ({ page }) => {
      expect(uxDensityForPageId(route.pageId).tier).toBe("D4");

      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const detail = page.getByTestId("ux-page-detail-standard").first();
      await expect(detail).toBeVisible();
      await expect(detail).toHaveAttribute("data-ux-density-tier", "D4");
      await expect(detail).toHaveAttribute("data-ux-density-pattern", "focused-detail");
      await expect(detail).toHaveAttribute("data-ux-d4-focused-detail", "true");
      const hasStatusStrip = await detail.getByTestId("ux-d4-focused-status-strip").count();
      if (hasStatusStrip) {
        await expect(detail.getByTestId("ux-d4-focused-status-strip")).toBeVisible();
      }
      await expect(detail.getByTestId("ux-page-detail-object-header")).toBeVisible();
      await expect(detail.getByTestId("ux-page-detail-key-facts")).toBeVisible();
      await expect(detail.getByTestId("ux-page-detail-evidence-timeline")).toBeVisible();
      await expect(detail.getByTestId("ux-page-detail-gated-action-rail")).toBeVisible();
      await expect(detail).toContainText(hasStatusStrip ? /Object|Status|Next action|Gate/i : /Evidence record|Actions|Timeline/i);
      await expect(detail).toContainText(/client|compliance|evidence|audit|approval|release|share|download|gate/i);
      await expect(detail).not.toContainText(/D4|Focused Detail|Workflow step|route policy|gate-completion proof|visual proof|complexity reduction/i);
      await expect(page.locator('[data-ux-d2-productive-workbench="true"]')).toHaveCount(0);
      await expect(page.getByTestId("ux-d3-dense-operations")).toHaveCount(0);
    });
  }
});

test.describe("UX-CTA BP-001 setup-to-release process chain", () => {
  const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));
  const expectedPrimaryHrefs: Record<string, string> = {
    "013": "/tenants/new",
    "014": "/tenants/demo/setup",
    "015": "/tenants/demo/users",
    "018": "/documents",
    "027": "/documents/upload",
    "028": "/documents/review-queue",
    "029": "/documents/demo/review",
    "030": "/advisory",
    "033": "/advisory/review-queue",
    "034": "/advisor/reviews",
    "035": "/advisor/reviews",
    "036": "/advisor/reviews/demo",
    "037": "/compliance/reviews",
    "038": "/compliance/reviews/demo/decision-room",
    "039": "/compliance/reviews/demo/release",
    "040": "/decisions",
    "041": "/documents/upload",
    "042": "/decisions",
    "043": "/decisions/demo",
    "044": "/decisions/demo/success",
    "045": "/client/home",
  };

  test("maps BP-001 primary CTAs from setup through released client-safe endpoint", () => {
    for (const [pageId, href] of Object.entries(expectedPrimaryHrefs)) {
      const route = routeByPageId.get(pageId);
      expect(route, `${pageId} registered route`).toBeDefined();
      const guidance = operationalRouteGuidanceForRoute(route!);

      expect(guidance.ctaState.primaryAction?.href, `${pageId} primary href`).toBe(href);
      expect(guidance.ctaState.state, `${pageId} guarded state`).toBe("guarded");
      expect(guidance.ctaState.primaryAction?.label, `${pageId} primary label`).not.toMatch(
        /evidence sufficient|client accepted|release complete|download ready|admin override/i,
      );
    }
  });

});

test.describe("UX-CTA evidence upload and review chain", () => {
  const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));
  const evidencePrimaryHrefs: Record<string, string> = {
    "027": "/documents/upload",
    "028": "/documents/review-queue",
    "029": "/documents/demo/review",
    "030": "/advisory",
    "038": "/compliance/reviews/demo/decision-room",
    "039": "/compliance/reviews/demo/release",
    "040": "/decisions",
    "041": "/documents/upload",
    "047": "/evidence/demo/review",
  };

  test("keeps upload and review CTAs separate from evidence sufficiency", () => {
    for (const [pageId, href] of Object.entries(evidencePrimaryHrefs)) {
      const route = routeByPageId.get(pageId);
      expect(route, `${pageId} registered route`).toBeDefined();
      const guidance = operationalRouteGuidanceForRoute(route!);

      expect(guidance.ctaState.primaryAction?.href, `${pageId} evidence primary href`).toBe(href);
      expect(guidance.ctaState.blockedReason, `${pageId} evidence blocked reason`).toMatch(
        /sufficiency|release|client visibility|separate|blocked|review|gates/i,
      );
      expect(guidance.ctaState.primaryAction?.label, `${pageId} evidence primary label`).not.toMatch(
        /evidence sufficient|sufficiency accepted|release ready|client visible|export ready/i,
      );
    }
  });

});

test.describe("UX-CTA AI draft internal-only chain", () => {
  test("advisor detail exposes escalation/rebuild boundaries as internal-only without client release", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/advisor/reviews/demo");

    await expect(page.getByRole("heading", { name: "Recommendation Summary" })).toBeVisible();
    await expect(page.getByTestId("bd07-advisor-decision-room-panel").getByText("Ask the analyst to rebuild unsupported claims before submitting the package for compliance review.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Approve for compliance review" })).toBeVisible();
    await expect(page.getByTestId("ux-cta-ai-rebuild")).toBeVisible();
    await expect(page.getByTestId("ux-cta-ai-rebuild")).toHaveAttribute("data-ux-interactive", "false");
    await expect(page.getByTestId("ux-cta-ai-rebuild")).toContainText("Request analyst rebuild");
    await expect(page.getByText("Request evidence follow-up")).toBeVisible();
    await expect(page.getByRole("button", { name: "Escalate advisor review call" })).toBeVisible();
    await expect(page.getByText(/release to client|client visibility unlocked|client-ready draft|approved for client/i)).toHaveCount(0);
    await expect(page.getByText("82% Success")).toHaveCount(0);
  });
});

test.describe("V0.96 WP-06 compliance decision-room refactor-first chain", () => {
  test("compliance decision room exposes release preconditions and one safe primary action", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/compliance/reviews/demo/decision-room");

    const checklist = page.getByTestId("wp06-compliance-precondition-checklist");
    await expect(checklist).toBeVisible();
    await expect(checklist).toHaveAttribute("data-wp06-release-ready", "false");
    await expect(checklist).toContainText("Advisor review");
    await expect(checklist).toContainText("Evidence");
    await expect(checklist).toContainText("Audit record");
    await expect(checklist).toContainText("Client package");

    await expect(page.getByTestId("wp06-release-blocked-control")).toContainText("Release unavailable");
    await expect(page.getByTestId("wp06-release-blocked-control")).toHaveAttribute("data-ux-interactive", "false");
    await expect(page.locator('[data-ux-primary-cta="true"]').filter({ hasText: "Request Evidence" })).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Hold Release" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(
      /advisor approved, released|upload complete, evidence complete|client accepted|admin override release|release complete/i,
    );
  });

  test("decision room request-evidence modal validates lifecycle before API mutation", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/compliance/reviews/demo/decision-room");

    await page.getByTestId("j02-request-evidence").click();

    const dialog = page.getByRole("dialog", { name: "Confirm Evidence Request" });
    const lifecycle = page.getByTestId("uxp3-compliance-sensitive-action-lifecycle");
    await expect(dialog).toBeVisible();
    await expect(lifecycle).toHaveAttribute("data-ux-sensitive-action", "request_evidence");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-acknowledgement-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j02-confirm-request-evidence")).toBeDisabled();

    await dialog.locator("input[type='checkbox']").check();
    await page.getByTestId("j02-request-evidence-confirmation").fill("REQUEST EVIDENCE");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-reason-required");
    await expect(page.getByTestId("j02-confirm-request-evidence")).toBeDisabled();
  });
});

test.describe("UX-CTA governance admin non-bypass chain", () => {
  const governancePageIds = ["009", "048", "049", "050", "051"] as const;

  test("maps admin and governance routes to bounded non-bypass CTA states", () => {
    for (const pageId of governancePageIds) {
      const route = screenRoutes.find((candidate) => candidate.pageId === pageId);
      expect(route, `${pageId} route`).toBeDefined();

      const guidance = operationalRouteGuidanceForRoute(route!);
      expect(guidance.ctaState.state, `${pageId} CTA state`).toBe("guarded");
      expect(guidance.ctaState.primaryAction?.label, `${pageId} primary label`).not.toMatch(
        /admin override|force release|release to client|evidence sufficient|approve export|download ready|suppress audit/i,
      );
      expect(`${guidance.safetyHint} ${guidance.ctaState.blockedReason}`, `${pageId} safety copy`).toMatch(
        /cannot|does not|separate|limited|audit|bypass|checks/i,
      );
    }
  });

  test("keeps S048 as the EPIC-06 governance entry with one safe next action", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/governance?state=base");

    const entry = page.getByTestId("epic-06-governance-entry");
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute("data-epic-06-entry", "primary-area-hub");
    await expect(entry).toHaveAttribute("data-ux-page-job", "governance_process_triage");
    await expect(entry).toHaveAttribute("data-ux-next-action", "review-scoped-access-request");
    await expect(entry).toContainText("User Access Review");
    await expect(entry).toContainText("Access only");

    const nextAction = page.getByTestId("epic-06-governance-primary-next-action");
    await expect(nextAction).toHaveAttribute("href", "/governance/access-requests/demo?state=base");
    await expect(nextAction).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(entry).toContainText("Identity and role");
    await expect(entry).toContainText("Limits");
    await expect(entry).toContainText("Saved change");

    const pageExtent = await page.evaluate(() => ({
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    }));
    expect(pageExtent.scrollHeight).toBeLessThanOrEqual(pageExtent.clientHeight);
  });

  const coreGovernanceSurfaces = [
    {
      action: "j07-open-role-drawer",
      expectedText: "Role review is not role activation",
      path: "/governance/roles/demo?state=base",
    },
    {
      action: "j07-open-access-request-drawer",
      expectedText: "Access is not granted yet",
      path: "/governance/access-requests/demo?state=base",
    },
  ] as const;

  for (const surface of coreGovernanceSurfaces) {
    test(`${surface.path} keeps the EPIC-06 core surface viewport-fit`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(surface.path);

      const entry = page.getByTestId(`epic-06-${surface.action}-surface`);
      await expect(entry).toBeVisible();
      await expect(entry).toHaveAttribute("data-epic-06-core-surface", "queue-detail-step");
      await expect(entry).toContainText(surface.expectedText);
      await expect(page.getByTestId(surface.action)).toBeVisible();
      if (surface.action === "j07-open-access-request-drawer") {
        await expect(entry).toHaveAttribute("data-ux-process-current-step", "access_request_review");
        await expect(entry).toHaveAttribute("data-ux-process-first", "true");
      } else {
        const proofBoundary = page.getByTestId("epic-06-proof-boundary");
        await expect(proofBoundary).toHaveAttribute("data-epic-06-client-visible", "false");
        await expect(proofBoundary).toHaveAttribute("data-epic-06-audit-boundary", "separate-before-mutation");
        await expect(proofBoundary).toHaveAttribute("data-ux-no-overclaim", "true");
      }

      const pageExtent = await page.evaluate(() => ({
        clientHeight: document.documentElement.clientHeight,
        scrollHeight: document.documentElement.scrollHeight,
      }));
      expect(pageExtent.scrollHeight).toBeLessThanOrEqual(pageExtent.clientHeight);
    });
  }

  const governanceScreens = [
    { path: "/admin/roles?state=permission", required: "Confirm permission change" },
    { path: "/governance?state=invite", required: "Send invitation" },
    { path: "/governance/roles/demo?state=confirm", required: "Confirm role change" },
    { path: "/governance/access-requests/demo?state=approval", required: "Approve access request" },
    { path: "/governance?state=drawer", required: "Send invitation" },
  ];

  for (const { path, required } of governanceScreens) {
    test(`${path} keeps admin authority bounded`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      await expect(page.getByText(required).first()).toBeVisible();
      await expect(page.locator("body")).toContainText(/cannot|does not|separate|audit/i);
      await expect(page.locator("body")).not.toContainText(
        /admin override|release to client|release ready|client visibility unlocked|download ready|audit suppressed/i,
      );
    });
  }
});

test.describe("UX-CTA export lifecycle separation", () => {
  const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));

  test("maps export routes to separate lifecycle CTA states", () => {
    const expectedPrimaryLabels: Record<string, RegExp> = {
      "054": /Select export content/,
      "055": /Review protection/,
      "056": /Inspect preview/,
      "057": /Open delivery controls after approval/,
      "058": /Review approval context/,
    };

    for (const [pageId, labelPattern] of Object.entries(expectedPrimaryLabels)) {
      const route = routeByPageId.get(pageId);
      expect(route, `${pageId} route`).toBeDefined();
      const guidance = operationalRouteGuidanceForRoute(route!);

      expect(guidance.ctaState.state, `${pageId} CTA state`).toBe("guarded");
      expect(guidance.ctaState.primaryAction?.label, `${pageId} primary label`).toMatch(labelPattern);
      expect(guidance.safetyHint, `${pageId} safety hint`).toMatch(/content|protection|preview|approval|download|share|separate/i);
      expect(guidance.ctaState.primaryAction?.label, `${pageId} no collapsed delivery label`).not.toMatch(
        /download ready|share ready|approved and downloaded|preview approved/i,
      );
    }
  });

  const exportScreens = [
    { path: "/export/new", required: "Name the request, choose contents and continue to review.", routeLanguage: /choose contents|content/i },
    { path: "/export/demo/scope", required: "Choose permitted content, review recipients and continue to protection review.", routeLanguage: /content|protection review/i },
    { path: "/export/demo/redaction", required: "Confirm which content areas need cover before inspection.", routeLanguage: /protection|preview|inspection/i },
    { path: "/export/demo/approval?state=approval", required: "Confirm review of this protected export package.", routeLanguage: /approval|delivery|sharing/i },
    { path: "/export/demo/download", required: "No Share Link", routeLanguage: /download|share/i },
  ];

  for (const { path, required, routeLanguage } of exportScreens) {
    test(`${path} keeps export lifecycle steps separate`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      await expect(page.getByText(required).first()).toBeVisible();
      await expect(page.locator("body")).toContainText(routeLanguage);
      await expect(page.locator("body")).not.toContainText(
        /download ready|share ready|client accepted|client visibility unlocked|preview approved/i,
      );
    });
  }

  test("download page blocks share until download is recorded", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/export/demo/download");

    await expect(page.getByTestId("j08-open-download-confirmation")).toBeVisible();
    await expect(page.getByRole("button", { name: "Share link off" })).toBeDisabled();
    await expect(page.getByText("No external link exists for this package.")).toBeVisible();
  });
});

test.describe("UX-CTA disabled blocked recovery copy", () => {
  const disabledRecoveryScreens = [
    {
      path: "/actions",
      expected: [
        "Open and resolve the selected blocked action before creating new work.",
        "Request missing evidence",
      ],
    },
    {
      path: "/actions?state=drawer",
      expected: [
        "Client approval evidence must be present before readiness can be marked.",
        "Request client approval evidence",
      ],
    },
    {
      path: "/evidence/demo/review",
      expected: [
        "Share needs evidence sufficiency, release and payload checks first.",
        "Revocation needs a scoped access decision and persisted audit event.",
        "New versions need evidence review; versioning cannot complete sufficiency review.",
      ],
    },
    {
      path: "/export/demo/redaction",
      expected: [
        "Preview inspection must pass before approval can be recorded.",
        "Approval and generation must be recorded before download.",
        "Resolve redaction blockers",
      ],
    },
    {
      path: "/governance/access-requests/demo?state=drawer",
      expected: [
        "Access approval remains constrained by visible policy, SOD and audit checks. This drawer cannot release advice, complete evidence review, approve export/share or make content client-visible.",
        "Approve access request",
      ],
    },
  ];

  for (const { expected, path } of disabledRecoveryScreens) {
    test(`${path} names blocked CTA reason and recovery without success overclaim`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      for (const text of expected) {
        await expect(page.getByText(text).first()).toBeVisible();
      }

      const ctaClusters = page.getByTestId("ux-complexity-cta-cluster");
      for (let index = 0; index < await ctaClusters.count(); index += 1) {
        await expect(ctaClusters.nth(index).locator('[data-ux-primary-cta="true"]')).toHaveCount(1);
      }
      await expect(page.locator("body")).not.toContainText(
        /admin override|client accepted|client visibility unlocked|download ready|evidence sufficient|preview approved|release complete|share ready/i,
      );
    });
  }
});

test.describe("UX-INTERACTION table search sort row-action semantics", () => {
  test("advisor queue search filters rows and row action opens the advisor detail", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/advisor/reviews");

    await page.getByTestId("ux-interaction-advisor-search").fill("Michael Wong");
    const table = page.getByTestId("ux-data-table").first();
    await expect(table).toContainText("Michael Wong");
    await expect(table).not.toContainText("James Thornton");
    await expect(page.getByRole("button", { name: "Type filter is static in this demo queue" })).toBeDisabled();
    await table.getByTestId("ux-data-table-sort").first().click();
    await table.getByTestId("ux-data-table-row-action").first().click();
    await expect(page).toHaveURL(/\/advisor\/reviews\/demo/);
  });

  test("compliance queue search filters rows and row action opens review detail", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/compliance/reviews");

    await page.getByTestId("ux-interaction-compliance-search").fill("CMP-2025-0134");
    const table = page.getByTestId("ux-data-table").first();
    await expect(table).toContainText("CMP-2025-0134");
    await expect(table).not.toContainText("CMP-2025-0137");
    await expect(page.getByRole("button", { name: "Additional compliance filters are static in this demo queue" })).toBeDisabled();
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(table).toContainText("CMP-2025-0137");
    await table.getByTestId("ux-data-table-sort").first().click();
    await table.getByTestId("ux-data-table-row-action").first().click();
    await expect(page).toHaveURL(/\/compliance\/reviews\/[^/]+\/decision-room/);
  });

  test("export protection review is compact and avoids dense operations scaffolding", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/export/demo/redaction");

    await expect(page.getByTestId("ux-d3-dense-operations")).toHaveCount(0);
    await expect(page.getByText("Protection Checklist").first()).toBeVisible();
    await expect(page.getByText("Inspect preview").first()).toBeVisible();
    await expect(page.getByText(/Payload Redaction Operations|Approval blocked until preview|Blocked before preview/i)).toHaveCount(0);
  });
});

test.describe("locked route workset preservation", () => {
  test("all registered routes are classified exactly once", () => {
    expect(routeWorksetIntegrity.counts).toEqual(lockedRouteWorksetCounts);
    expect(routeWorksetIntegrity.missingPageIds).toEqual([]);
    expect(routeWorksetIntegrity.unknownPageIds).toEqual([]);
    expect(routeWorksetIntegrity.duplicatePageIds).toEqual([]);
    expect(routeSmokeList).toHaveLength(71);
  });

  test("P1, reference and held routes stay outside implementation navigation", () => {
    const implementationPageIds = new Set(
      groupedImplementationScreenRoutes.flatMap((group) => group.routes.map((route) => route.pageId))
    );

    const doNotImplementPageIds = [
      ...routeWorksetPageIds.P1_AFTER_MVP,
      ...routeWorksetPageIds.REFERENCE_ONLY,
      ...routeWorksetPageIds.HOLD_PENDING_DECISION
    ];

    for (const pageId of doNotImplementPageIds) {
      expect(implementationPageIds.has(pageId), `${pageId} should not be implementation navigation`).toBe(false);
    }
  });

  test("route access decisions preserve SCF provenance without elevating held worksets", () => {
    for (const route of screenRoutes) {
      const decision = routeImplementationAccessDecision(route);

      if (mvpPageIds.has(route.pageId) || mvpSupportPageIds.has(route.pageId)) {
        expect(decision.accessMode).toBe("FIRST_BUILD");
        expect(decision.exclusionReason).toBeUndefined();
        expect(decision.implementationShellAccessible, `${route.pageId} implementation access`).toBe(true);
        expect(decision.safetyBoundary).toBe("FULL_FIRST_BUILD_SCOPE");
      } else {
        expect(decision.accessMode).toBe("REGISTERED_ONLY");
        expect(decision.implementationShellAccessible, `${route.pageId} implementation access`).toBe(false);
        expect(decision.safetyBoundary).toBe("SCF_DO_NOT_IMPLEMENT_REGISTER");
        if (p1PageIds.has(route.pageId)) {
          expect(decision.exclusionReason).toBe("P1_DEFERRED");
        } else if (referencePageIds.has(route.pageId)) {
          expect(decision.exclusionReason).toBe("REFERENCE_ONLY_NO_PRODUCT_TASK");
        } else if (holdPageIds.has(route.pageId)) {
          expect(decision.exclusionReason).toBe("HOLD_PENDING_SCOPE_UNLOCK");
        }
      }
    }
  });

  test("SCF Do-Not-Implement register covers every non-MVP workset route", () => {
    const registeredDniPageIds = new Set(scfDoNotImplementRegister.flatMap((entry) => entry.pageIds));
    const expectedPageIds = [
      ...routeWorksetPageIds.P1_AFTER_MVP,
      ...routeWorksetPageIds.REFERENCE_ONLY,
      ...routeWorksetPageIds.HOLD_PENDING_DECISION
    ];

    for (const pageId of expectedPageIds) {
      expect(registeredDniPageIds.has(pageId), `${pageId} should be in the SCF DNI register`).toBe(true);
    }
  });

  test("deferred, reference and held routes remain registered smoke routes only", () => {
    const routePathsByPageId = new Map(screenRoutes.map((route) => [route.pageId, routeToSmokePath(route.route)]));
    const smokePathsByPageId = new Map(routeSmokeList.map((route) => [route.pageId, route.path]));

    const excludedPageIds = [
      ...routeWorksetPageIds.P1_AFTER_MVP,
      ...routeWorksetPageIds.REFERENCE_ONLY,
      ...routeWorksetPageIds.HOLD_PENDING_DECISION
    ];

    for (const pageId of excludedPageIds) {
      expect(smokePathsByPageId.get(pageId), `${pageId} smoke path should remain registered`).toBe(
        routePathsByPageId.get(pageId)
      );
    }
  });

  test("deferred, reference and held routes do not receive productive UX-PAGE surfaces", async ({ page }) => {
    const p1ProtectedPageIds = new Set<string>(routeWorksetPageIds.P1_AFTER_MVP);
    const referenceProtectedPageIds = new Set<string>(routeWorksetPageIds.REFERENCE_ONLY);
    const holdProtectedPageIds = new Set<string>(routeWorksetPageIds.HOLD_PENDING_DECISION);
    const excludedRoutes = routeSmokeList.filter((route) => {
      return (
        p1ProtectedPageIds.has(route.pageId) ||
        referenceProtectedPageIds.has(route.pageId) ||
        holdProtectedPageIds.has(route.pageId)
      );
    });

    expect(excludedRoutes).toHaveLength(15);

    for (const route of excludedRoutes) {
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      await expect(page.getByTestId("ux-page-workbench-triad"), `${route.pageId} workbench triad`).toHaveCount(0);
      await expect(page.getByTestId("ux-page-detail-standard"), `${route.pageId} detail standard`).toHaveCount(0);
      const expectedActionLabel =
        p1ProtectedPageIds.has(route.pageId)
          ? "Deferred"
          : referenceProtectedPageIds.has(route.pageId)
            ? "Reference only"
            : "Held";
      await expect(page.getByRole("button", { name: expectedActionLabel }), `${route.pageId} locked action button`).toHaveCount(0);
      await expect(
        page.locator('[data-ux-primary-cta="true"][data-ux-interactive="false"]').filter({ hasText: expectedActionLabel }),
        `${route.pageId} locked action status`
      ).toBeVisible();
    }
  });

  test("reference requests render registered-only guard screens", async ({ page }) => {
    const registeredOnlyScreens = [
      {
        path: "/service-blueprint",
        guardHeading: "Reference Workspace",
        productText: "Read-only internal reference."
      },
      {
        path: "/roadmap",
        guardHeading: "Reference Workspace",
        productText: "Read-only internal reference."
      },
      {
        path: "/states",
        guardHeading: "Reference Workspace",
        productText: "Read-only internal reference."
      }
    ];

    for (const route of registeredOnlyScreens) {
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const main = page.getByRole("main");
      await expect(main.getByRole("heading", { name: route.guardHeading })).toBeVisible();
      await expect(main.getByText(route.productText).first()).toBeVisible();
    }
  });
});
