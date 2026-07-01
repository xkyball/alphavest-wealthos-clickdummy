import { expect, type Page, test } from "@playwright/test";

import { createActorSession } from "../lib/actor-session";
import { navigationGroupsForRole, productiveNavigationPageIds, uxNavigationPolicyForPageId } from "../lib/navigation";
import {
  eligibleUxPageContracts,
  protectedUxPageContracts,
  uxPageContractIntegrity,
  uxPageContracts,
} from "../lib/ux-page-contract";
import { uxDensityForPageId } from "../lib/ux-density";
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
import { authenticatePageWithContextJwt, authenticatePageWithJwt } from "./helpers/auth-jwt";

const lockedRouteWorksetCounts = {
  MVP: 34,
  MVP_SUPPORT: 28,
  P1_AFTER_MVP: 2,
  REFERENCE_ONLY: 3,
  HOLD_PENDING_DECISION: 4
};

const mvpPageIds = new Set<string>(routeWorksetPageIds.MVP);
const mvpSupportPageIds = new Set<string>(routeWorksetPageIds.MVP_SUPPORT);
const p1PageIds = new Set<string>(routeWorksetPageIds.P1_AFTER_MVP);
const referencePageIds = new Set<string>(routeWorksetPageIds.REFERENCE_ONLY);
const holdPageIds = new Set<string>(routeWorksetPageIds.HOLD_PENDING_DECISION);

async function authenticateRouteSmokePage(page: Page, request?: Parameters<typeof authenticatePageWithJwt>[1]) {
  if (request) {
    await authenticatePageWithJwt(page, request);
    return;
  }

  await authenticatePageWithContextJwt(page);
}

async function openFirstAdvisoryTriggerReview(page: Page) {
  await page.goto("/advisory/review-queue");
  const reviewWorkLink = page.getByRole("link", { name: "Open review work" }).first();

  await expect(reviewWorkLink).toHaveAttribute("href", /^\/advisory\/triggers\/[^/]+\/review$/);
  await reviewWorkLink.click();
  await expect(page).toHaveURL(/\/advisory\/triggers\/[^/]+\/review$/);
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

  test("retired demo object slugs redirect to canonical product fixture paths", async ({ page, request }) => {
    await authenticateRouteSmokePage(page, request);

    const retiredDemoRoutes = [
      ["/entities/demo", /\/entities\/philanthropy-trust$/],
      ["/documents/demo/review", /\/documents\/morgan-tax-residency\/review$/],
      ["/tenants/demo/users?state=base", /\/tenants\/morgan\/users\?state=base$/],
      ["/advisory/triggers/demo/review", /\/advisory\/triggers\/[^/]+\/review$/],
      ["/reviews/demo", /\/reviews\/rebalance-review$/],
      ["/advisor/reviews/demo", /\/advisor\/reviews$/],
      ["/committee/reviews/demo/decision-room", /\/committee\/reviews\/investment-committee\/decision-room$/],
      ["/compliance/reviews/demo/decision-room", /\/compliance\/reviews$/],
      ["/decisions/demo", /\/decisions\/liquidity-governance$/],
      ["/evidence/demo/review", /\/evidence\/decision-pack\/review$/],
      ["/governance/roles/demo", /\/governance\/roles\/portfolio-manager$/],
      ["/governance/access-requests/demo?state=base", /\/governance\/access-requests\/external-advisor\?state=base$/],
      ["/communication/demo/context", /\/communication\/client-follow-up\/context$/],
      ["/export/demo/download", /\/export\/client-package\/download$/],
      ["/ops/sla/demo", /\/ops\/sla\/release-readiness$/],
    ] as const;

    for (const [retiredPath, canonicalPathPattern] of retiredDemoRoutes) {
      await page.goto(retiredPath);
      await expect(page).toHaveURL(canonicalPathPattern);
    }
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
    const admin = createActorSession({ roleKey: "admin", tenantSlug: "bennett" });
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
    const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
    const groups = navigationGroupsForRole(principal.role);
    const linkedLabels = groups.filter((group) => group.items.length > 0).map((group) => group.label);
    const lockedLabels = groups.filter((group) => group.lockedReason).map((group) => group.label);

    expect(linkedLabels).toEqual(["Client Context", "Evidence Lifecycle", "Decision Record", "Client Visibility"]);
    expect(lockedLabels).toEqual(["Foundation", "Analyst Workbench", "Advisor Review", "Compliance Release", "Export & Delivery", "Operations", "Protected Work"]);
    for (const group of groups.filter((candidate) => candidate.lockedReason)) {
      expect(group.items).toHaveLength(0);
      if (group.label === "Protected Work") {
        expect(group.lockedReason).toContain("current delivery");
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
      "current",
      "upcoming",
      "blocked",
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
    expect(uxPageContractIntegrity.eligibleCount).toBe(62);

    for (const contract of eligibleUxPageContracts) {
      expect(["MVP", "MVP_SUPPORT"], `${contract.pageId} scope`).toContain(contract.routeScope);
      expect(["P1", "Reference", "Hold"], `${contract.pageId} page type`).not.toContain(contract.pageType);
      expect(contract.productiveUxEligible, `${contract.pageId} productive eligibility`).toBe(true);
      expect(contract.primaryCtaRule, `${contract.pageId} CTA rule`).not.toContain("No productive MVP CTA");
    }
  });

  test("keeps deferred, reference and held routes out of productive page type work", () => {
    expect(uxPageContractIntegrity.protectedCount).toBe(9);

    for (const contract of protectedUxPageContracts) {
      expect(["P1_AFTER_MVP", "REFERENCE_ONLY", "HOLD_PENDING_DECISION"], `${contract.pageId} protected scope`).toContain(contract.routeScope);
      expect(contract.productiveUxEligible, `${contract.pageId} productive eligibility`).toBe(false);
      expect(["P1", "Reference", "Hold"], `${contract.pageId} page type`).toContain(contract.pageType);
      expect(contract.forbiddenTreatment, `${contract.pageId} forbidden treatment`).toMatch(/No (productive|MVP)/);
    }
  });
});

test.describe("UX-HUB stage 3 orientation hubs", () => {
  const stage3HubRoutes = [
    { path: "/client/home", taskId: "UX-HUB-001", pageId: "019" },
    { path: "/advisory", taskId: "UX-HUB-002", pageId: "033" },
    { path: "/evidence", taskId: "UX-HUB-003", pageId: "046" },
    { path: "/compliance/reviews", taskId: "UX-HUB-004", pageId: "038", proofOnly: true },
    { path: "/export/new", taskId: "UX-HUB-005", pageId: "054" },
    { path: "/governance", taskId: "UX-HUB-006", pageId: "048" },
  ];

  test("defines Stage 3 hub contracts with summary, priority, queue and safety guidance", () => {
    for (const route of stage3HubRoutes) {
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

  const renderedStage3HubRoutes = stage3HubRoutes.filter((route) => !["038", "046", "048", "054"].includes(route.pageId));

  for (const route of renderedStage3HubRoutes) {
    test(`${route.taskId} ${route.path} renders a focused orientation hub`, async ({ page }) => {
      await page.setViewportSize({ height: 1100, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      if (route.pageId === "019") {
        const entry = page.getByTestId("domain-07-client-family-entry");
        await expect(entry).toBeVisible();
        await expect(entry).toHaveAttribute("data-domain-07-contract", "client_family_context_foundation");
        await expect(entry).toHaveAttribute("data-domain-07-no-overclaim", "true");
        await expect(page.getByTestId("domain-07-primary-next-action")).toHaveCount(1);
        await expect(page.getByTestId("workflow07-client-safe-projection-card")).toBeVisible();
        await expect(page.getByTestId("domain-07-proof-boundary")).toHaveCount(0);
        return;
      }

      const hub = page.getByTestId("ux-hub-page").first();
      await expect(hub).toBeVisible();
      await expect(hub.getByTestId("ux-hub-summary")).toBeVisible();
      await expect(hub.locator('[data-ux-hub-priority-card="true"]')).toHaveCount(3);
      await expect(hub.getByTestId("ux-hub-primary-next-work")).toHaveCount(1);
      expect(await hub.getByTestId("ux-hub-next-link").count()).toBeGreaterThan(2);
      await expect(hub.getByTestId("ux-hub-safety-note")).toBeVisible();
    });
  }

  test("DOMAIN-07 S019 area entry fits the 1440x1000 viewport without page scroll", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/client/home?state=base");

    const entry = page.getByTestId("domain-07-client-family-entry");
    await expect(entry).toBeVisible();
    await expect(page.getByTestId("domain-07-primary-next-action")).toHaveCount(1);
    await expect(page.getByTestId("workflow07-client-safe-projection-card")).toBeVisible();
    await expect(page.getByTestId("domain-07-proof-boundary")).toHaveCount(0);

    const dimensions = await page.evaluate(() => ({
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    }));

    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight);
  });

  test("DOMAIN-07 core context routes expose queue detail and step gates", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);

    await page.goto("/client/family-members");
    const familySurface = page.getByTestId("domain-07-family-core-surface");
    await expect(familySurface).toBeVisible();
    await expect(familySurface).toHaveAttribute("data-domain-07-process", "BP-004");
    await expect(familySurface).toHaveAttribute("data-domain-07-surface", "queue-detail");
    await expect(familySurface).toHaveAttribute("data-domain-07-no-overclaim", "true");
    await expect(page.getByTestId("domain-07-family-queue-surface")).toBeVisible();
    await expect(page.getByTestId("domain-07-family-detail-surface")).toBeVisible();

    await page.goto("/entities");
    const entitySurface = page.getByTestId("domain-07-entity-core-surface");
    await expect(entitySurface).toBeVisible();
    await expect(entitySurface).toHaveAttribute("data-domain-07-process", "BP-006");
    await expect(entitySurface).toHaveAttribute("data-domain-07-surface", "queue");
    await expect(entitySurface).toHaveAttribute("data-domain-07-no-overclaim", "true");
    await expect(page.getByTestId("domain-07-entity-queue-surface")).toBeVisible();

    await page.goto("/entities/philanthropy-trust");
    const entityDetailSurface = page.getByTestId("domain-07-entity-detail-surface");
    await expect(entityDetailSurface).toBeVisible();
    await expect(entityDetailSurface).toHaveAttribute("data-domain-07-process", "BP-010");
    await expect(entityDetailSurface).toHaveAttribute("data-domain-07-surface", "detail");
    await expect(entityDetailSurface).toHaveAttribute("data-domain-07-no-overclaim", "true");
    await expect(entityDetailSurface).toContainText("Bennett Legacy Trust");
    await expect(entityDetailSurface).not.toContainText("Carter Family Trust");
    await expect(entityDetailSurface).not.toContainText("ENT-000482");

    await page.goto("/entities/new");
    const entityStepSurface = page.getByTestId("domain-07-entity-step-surface");
    await expect(entityStepSurface).toBeVisible();
    await expect(entityStepSurface).toHaveAttribute("data-domain-07-process", "BP-006");
    await expect(entityStepSurface).toHaveAttribute("data-domain-07-surface", "step");
    await expect(entityStepSurface).toHaveAttribute("data-domain-07-no-overclaim", "true");
  });

  test("DOMAIN-07 core context routes fit the 1440x1000 viewport without page scroll", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);

    for (const { path, testId } of [
      { path: "/client/family-members", testId: "domain-07-family-core-surface" },
      { path: "/entities", testId: "domain-07-entity-core-surface" },
      { path: "/entities/new", testId: "domain-07-entity-step-surface" },
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

  test("DOMAIN-07 relationship graph exposes DB-backed detail state without page scroll", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/relationships");
    await page.waitForLoadState("networkidle");

    const surface = page.getByTestId("domain-07-relationship-depth-surface");
    await expect(surface).toBeVisible();
    await expect(surface).toHaveAttribute("data-domain-07-process", "BP-005");
    await expect(surface).toHaveAttribute("data-domain-07-surface", "relationship-depth");
    await expect(surface).toHaveAttribute("data-domain-07-no-overclaim", "true");
    await expect(page.getByTestId("domain-07-relationship-depth-step")).toHaveCount(3);
    await expect(page.getByTestId("domain-07-relationship-db-detail")).toContainText("Evidence");
    await expect(page.getByTestId("domain-07-relationship-action-state")).toContainText("Select an edge");
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    await expect(page.getByTestId("j09-family-map")).toBeVisible();
    await expect(page.getByTestId("j09-add-relationship")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    }));

    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight);
  });
});

test.describe("process-first release and governance route contracts", () => {
  const processFirstRoutes = [
    { currentStep: "compliance_release_decision", pageId: "039", path: "/compliance/reviews/current/decision-room" },
    { currentStep: "governance_user_review", pageId: "048", path: "/governance" },
    { currentStep: "access_request_review", pageId: "050", path: "/governance/access-requests/external-advisor" },
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
        await expect(page.getByTestId("workflow02-worksurface-summary-banner")).toHaveCount(0);
      }
      await expect(gate).toHaveAttribute("data-ux-process-business-processes", contract.businessProcessIds.join(" "));
      await expect(gate).toHaveAttribute("data-ux-process-acceptance-gates", contract.acceptanceIds.join(" "));
      await expect(gate).toHaveAttribute("data-ux-process-gate-ids", contract.gateIds.join(" "));
      await expect(gate).toHaveAttribute("data-ux-process-next-step", contract.nextPermittedAction);
      await expect(gate).toContainText(/blocked|required|review|gate|approval|audit|release|redaction|scope/i);
      await expect(gate).not.toContainText(/UX-[A-Z0-9-]+-\d{3}|WP-?\d+|DOMAIN-\d+|DOMAIN-[A-Z]|S\d{3}|BP-\d{3}|ACC-\d{3}|P0_[A-Z0-9_]+|data-testid|data-ux-|visual proof|Workflow step|proof scaffolding/i);
    });
  }
});


test.describe("UX-PAGE detail standard", () => {

test.describe("UX-DETAIL / UX-PAGE-SPLIT stage 5 object review", () => {
  const productDetailRoutes = [
    {
      path: "/evidence/decision-pack/review",
      productMarkers: ["domain12-evidence-detail-core", "ux-page-detail-object-header", "ux-page-detail-gated-action-rail"],
      text: /Evidence record|Verified|Actions/i,
    },
    {
      openViaAdvisoryQueue: true,
      path: "/advisory/review-queue",
      productMarkers: [],
      selectors: ['[data-domain09-review-surface="trigger-draft"]'],
      text: /Trigger detail|Actions|advisor review/i,
    },
    {
      path: "/advisory",
      productMarkers: ["ux-hub-page", "s033-backed-state", "ux-hub-primary-next-work"],
      text: /Signal entry|Internal work only|Open analyst workbench/i,
    },
    {
      path: "/compliance/reviews/current/audit",
      productMarkers: ["domain11-s042-audit-boundary", "j02-export-controlled"],
      text: /Audit readiness|audit/i,
    },
    {
      path: "/documents/review-queue",
      productMarkers: ["s029-extraction-master-list", "s029-extraction-selected-detail", "s029-request-clarification"],
      text: /Extraction review queue|Reviewer|Request clarification/i,
    },
    {
      path: "/client/home",
      productMarkers: ["e07-client-safe-ui-boundary"],
      text: /Client|Documents|Decisions/i,
    },
  ];

  for (const route of productDetailRoutes) {
    test(route.path + " uses product workflow state instead of the retired Stage 5 proof panel", async ({ page }) => {
      await page.setViewportSize({ height: 1100, width: 1440 });
      await authenticateRouteSmokePage(page);
      if (route.openViaAdvisoryQueue) {
        await openFirstAdvisoryTriggerReview(page);
      } else {
        await page.goto(route.path);
      }

      await expect(page.locator('[data-testid="ux-stage5-detail-split"]')).toHaveCount(0);
      for (const marker of route.productMarkers) {
        await expect(page.getByTestId(marker).first()).toBeVisible();
      }
      for (const selector of route.selectors ?? []) {
        await expect(page.locator(selector).first()).toBeVisible();
      }
      await expect(page.locator("main")).toContainText(route.text);
      await expect(page.locator("main")).not.toContainText(/UX-(DETAIL|PAGE-SPLIT)-\d{3}|visual proof|proof scaffolding/i);
    });
  }

});

  const uxPage003Routes = [
    {
      openViaAdvisoryQueue: true,
      path: "/advisory/review-queue",
      selectors: ['[data-domain09-review-surface="trigger-draft"]'],
      testIds: [],
      text: /Trigger detail|Route to advisor review|Request missing evidence/i,
    },
    {
      path: "/compliance/reviews/current/release",
      selectors: [],
      testIds: ["domain11-s040-release-boundary", "s040-open-release-review"],
      text: /Release review|Review release|audit readiness/i,
    },
    {
      path: "/compliance/reviews/current/block",
      selectors: [],
      testIds: ["domain11-s041-block-boundary"],
      text: /Block status|Evidence required|Manage Block/i,
    },
    {
      path: "/decisions/liquidity-governance",
      selectors: [],
      testIds: ["domain12-decision-room-core", "domain12-s044-input", "domain12-s044-output"],
      text: /Next actions|Action ready for review|No shortcut path/i,
    },
    {
      path: "/decisions/liquidity-governance/success",
      selectors: [],
      testIds: ["domain12-decision-success-core"],
      text: /Decision|audit|client/i,
    },
    {
      path: "/evidence/decision-pack/review",
      selectors: [],
      testIds: ["ux-page-detail-standard", "ux-page-detail-object-header", "ux-page-detail-evidence-timeline", "ux-page-detail-gated-action-rail"],
      text: /Evidence record|Actions|Timeline/i,
    },
  ];

  for (const route of uxPage003Routes) {
    test(`${route.path} renders product object state and action context`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      if (route.openViaAdvisoryQueue) {
        await openFirstAdvisoryTriggerReview(page);
      } else {
        await page.goto(route.path);
      }

      for (const testId of route.testIds) {
        await expect(page.getByTestId(testId).first()).toBeVisible();
      }
      for (const selector of route.selectors) {
        await expect(page.locator(selector).first()).toBeVisible();
      }
      await expect(page.locator("main")).toContainText(route.text);
      await expect(page.locator("main")).not.toContainText(/UX-(DETAIL|PAGE-SPLIT)-\d{3}|visual proof|proof scaffolding/i);
    });
  }
});

test.describe("UX-DENSITY calm executive client views", () => {
  for (const path of ["/client/home"]) {
    test(`${path} keeps the client home product entry free of legacy density proof UI`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const clientEntry = page.getByTestId("domain-07-client-family-entry");
      await expect(clientEntry).toBeVisible();
      await expect(clientEntry).toHaveAttribute("data-domain-07-no-overclaim", "true");
      await expect(page.locator('[data-ux-d1-calm-executive="true"]')).toHaveCount(0);
      await expect(page.getByTestId("ux-d1-state-card")).toHaveCount(0);
      await expect(page.getByTestId("ux-d1-next-step-panel")).toHaveCount(0);
      await expect(page.getByTestId("ux-d1-source-summary")).toHaveCount(0);
      await expect(page.getByTestId("ux-hub-queue")).toHaveCount(0);

      await expect(clientEntry).toContainText(/release|released|hidden|client/i);
      await expect(page.getByTestId("client-intake-continuation-card")).toContainText("Client intake path");
      await expect(page.getByTestId("client-intake-continuation-card").getByRole("link", { name: "Request evidence" })).toHaveAttribute("href", "/documents/upload");
      await expect(page.getByTestId("client-home-open-work")).toBeVisible();
      await expect(page.getByTestId("client-home-open-work")).not.toContainText("Resolve release gate");
      await expect(page.getByTestId("client-home-recent-activity")).toBeVisible();
      await expect(page.getByTestId("client-home-recent-activity")).not.toContainText("Governance update");
      await expect(page.getByTestId("client-home-recent-activity")).not.toContainText("Trust agreement");
      await expect(page.getByTestId("client-home-recent-activity")).not.toContainText("Beneficiary update");
      await expect(clientEntry.getByRole("link", { name: /Family contacts/ })).toHaveAttribute("href", "/client/family-members");
      await expect(clientEntry.getByRole("link", { name: /Relationship map/ })).toHaveAttribute("href", "/relationships");
      await expect(clientEntry.getByRole("link", { name: /Entity links/ })).toHaveAttribute("href", "/entities");
      await expect(clientEntry.getByRole("link", { name: /Evidence documents/ })).toHaveAttribute("href", "/documents/upload");
      await expect(clientEntry).toContainText("Family directory");
      await expect(clientEntry).toContainText("Connected family context");
      await expect(clientEntry).toContainText("Trusts and holdings");
      await expect(clientEntry).toContainText("Upload and review state");
      await expect(clientEntry).not.toContainText(/Profile and roles|Requested items/);
      await expect(page.getByTestId("client-safe-evidence-summary-card")).toContainText("Evidence summary");
      await expect(page.getByTestId("client-safe-evidence-summary-card").getByRole("link", { name: "Request missing evidence" })).toHaveAttribute("href", "/documents/upload");
      await expect(clientEntry).not.toContainText(/D1|calm executive|Workflow step|route policy|gate-completion proof|visual proof|complexity reduction/i);
    });
  }

  test("/mobile uses client work state instead of static mobile counts", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/mobile");

    const mobileSummary = page.getByTestId("mobile-client-work-summary");
    await expect(page.getByTestId("workflow07-client-safe-projection-card")).toBeVisible();
    await expect(mobileSummary).toBeVisible();
    await expect(mobileSummary).toContainText("Open work");
    await expect(mobileSummary).toContainText("Evidence");
    await expect(mobileSummary).toContainText("Recent activity");
    await expect(mobileSummary).not.toContainText("3 requests open");
    await expect(mobileSummary).not.toContainText("2 items awaiting review");
    await expect(mobileSummary).not.toContainText("No new messages");
  });
});

test.describe("UX-DENSITY productive workbench routes", () => {
  test("keeps D4 detail routes in the related range out of D2 workbench coercion", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);

    expect(uxDensityForPageId("039").tier).toBe("D4");
    expect(uxDensityForPageId("047").tier).toBe("D4");

    for (const path of ["/compliance/reviews/current/decision-room", "/evidence/decision-pack/review"]) {
      await page.goto(path);
      await expect(page.locator('[data-ux-d2-productive-workbench="true"]')).toHaveCount(0);
    }
  });
});

test.describe("UX-DENSITY focused detail routes", () => {
  const d4DetailRoutes = [
    {
      openViaAdvisoryQueue: true,
      pageId: "035",
      path: "/advisory/review-queue",
      selectors: ['[data-domain09-review-surface="trigger-draft"]'],
      testIds: [],
      text: /Trigger detail|Route to advisor review|Request missing evidence/i,
    },
    {
      pageId: "044",
      path: "/decisions/liquidity-governance",
      selectors: [],
      testIds: ["domain12-decision-room-core", "domain12-s044-input", "domain12-s044-output", "decision-rationale-preview", "decision-status-preview", "domain12-s044-review-actions"],
      text: /Next actions|Action ready for review|Rationale draft|Decision status/i,
    },
    {
      pageId: "047",
      path: "/evidence/decision-pack/review",
      selectors: [],
      testIds: ["ux-page-detail-standard", "ux-page-detail-object-header", "ux-page-detail-key-facts", "ux-page-detail-evidence-timeline", "ux-page-detail-gated-action-rail"],
      text: /Evidence record|Actions|Timeline/i,
    },
  ];

  for (const route of d4DetailRoutes) {
    test(`${route.path} renders focused product detail without dense-operations scaffolding`, async ({ page }) => {
      expect(uxDensityForPageId(route.pageId).tier).toBe("D4");

      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      if (route.openViaAdvisoryQueue) {
        await openFirstAdvisoryTriggerReview(page);
      } else {
        await page.goto(route.path);
      }

      for (const testId of route.testIds) {
        await expect(page.getByTestId(testId).first()).toBeVisible();
      }
      for (const selector of route.selectors) {
        await expect(page.locator(selector).first()).toBeVisible();
      }
      const detail = page.getByTestId("ux-page-detail-standard").first();
      if ((await detail.count()) > 0) {
        await expect(detail).toHaveAttribute("data-ux-d4-focused-detail", "true");
      }
      await expect(page.locator("main")).toContainText(route.text);
      await expect(page.locator("main")).not.toContainText(/D4|Focused Detail|Workflow step|route policy|gate-completion proof|visual proof|complexity reduction/i);
      await expect(page.locator('[data-ux-d2-productive-workbench="true"]')).toHaveCount(0);
      await expect(page.getByTestId("ux-d3-dense-operations")).toHaveCount(0);
    });
  }
});

test.describe("UX-PF policy version state", () => {
  test("tenant policies show version lineage without adding internal proof UI", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/tenants/morgan/policies");

    const versionState = page.getByTestId("tenant-policy-version-state");
    await expect(versionState).toBeVisible();
    await expect(page.locator("main")).toContainText("Policy Version History");
    await expect(versionState).toContainText("Change held for review");
    await expect(versionState).toContainText("Activate held");
    await expect(versionState).not.toContainText(/BP-\d{3}|visual proof|capture|data-testid|route policy/i);
  });
});

test.describe("UX-CTA BP-001 setup-to-release process chain", () => {
  const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));
  const expectedPrimaryHrefs: Record<string, string> = {
    "013": "/tenants/new",
    "014": "/tenants/morgan/setup",
    "015": "/tenants/morgan/users",
    "018": "/documents",
    "027": "/documents/upload",
    "028": "/documents/review-queue",
    "029": "/advisory/review-queue",
    "030": "/advisory",
    "033": "/advisory/review-queue",
    "034": "/advisory/review-queue",
    "035": "/advisor/reviews",
    "036": "/advisor/reviews",
    "037": "/compliance/reviews",
    "038": "/compliance/reviews/current/decision-room",
    "039": "/compliance/reviews/current/release",
    "040": "/decisions",
    "041": "/documents/upload",
    "042": "/decisions",
    "043": "/decisions/liquidity-governance",
    "044": "/decisions/liquidity-governance/success",
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
    "029": "/advisory/review-queue",
    "030": "/advisory",
    "038": "/compliance/reviews/current/decision-room",
    "039": "/compliance/reviews/current/release",
    "040": "/decisions",
    "041": "/documents/upload",
    "047": "/evidence/decision-pack/review",
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

test.describe("V0.96 WP-06 compliance decision-room refactor-first chain", () => {
  test("compliance decision room exposes release preconditions and one safe primary action", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/compliance/reviews/current/decision-room");

    const checklist = page.getByTestId("workflow06-compliance-precondition-checklist");
    await expect(checklist).toBeVisible();
    await expect(checklist).toHaveAttribute("data-workflow06-release-ready", "false");
    await expect(checklist).toContainText("Advisor review");
    await expect(checklist).toContainText("Evidence");
    await expect(checklist).toContainText("Audit record");
    await expect(checklist).toContainText("Client delivery");

    await expect(page.getByTestId("workflow06-release-blocked-control")).toContainText("Release unavailable");
    await expect(page.getByTestId("workflow06-release-blocked-control")).toHaveAttribute("data-ux-interactive", "false");
    await expect(page.locator('[data-ux-primary-cta="true"]').filter({ hasText: "Request Evidence" })).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Hold Release" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(
      /advisor approved, released|upload complete, evidence complete|client accepted|admin override release|release complete/i,
    );
  });

  test("decision room request-evidence modal validates lifecycle before API mutation", async ({ page, request }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticatePageWithJwt(page, request, { email: "naledi.compliance@alphavest.demo" });
    await page.goto("/compliance/reviews/current/decision-room");

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

  const coreGovernanceSurfaces = [
    {
      action: "j07-open-role-drawer",
      expectedText: "Change held",
      path: "/governance/roles/portfolio-manager?state=base",
    },
    {
      action: "j07-open-access-request-drawer",
      expectedText: "Access held",
      path: "/governance/access-requests/external-advisor?state=base",
    },
  ] as const;

  for (const surface of coreGovernanceSurfaces) {
    test(`${surface.path} keeps the DOMAIN-06 core surface viewport-fit`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(surface.path);

      const entry = page.getByTestId(`domain-06-${surface.action}-surface`);
      await expect(entry).toBeVisible();
      await expect(entry).toHaveAttribute("data-domain-06-core-surface", "queue-detail-step");
      await expect(entry).toContainText(surface.expectedText);
      await expect(page.getByTestId(surface.action)).toBeVisible();
      if (surface.action === "j07-open-access-request-drawer") {
        await expect(entry).toHaveAttribute("data-ux-process-current-step", "access_request_review");
        await expect(entry).toHaveAttribute("data-ux-process-first", "true");
      } else {
        await expect(page.getByTestId("domain-06-proof-boundary")).toHaveCount(0);
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
    { path: "/governance/roles/portfolio-manager?state=confirm", required: "Confirm role change" },
    { path: "/governance/access-requests/external-advisor?state=approval", required: "Approve access request" },
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
      "056": /Review sign-off/,
      "057": /Open delivery controls after sign-off/,
      "058": /Review sign-off context/,
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
    { path: "/export/client-package/scope", required: "Choose permitted content, review recipients and continue to protection review.", routeLanguage: /content|protection review/i },
    { path: "/export/client-package/redaction", required: "Confirm which content areas need cover before inspection.", routeLanguage: /protection|preview|inspection/i },
    { path: "/export/client-package/approval?state=approval", required: "Confirm sign-off for this protected export package.", routeLanguage: /sign-off|delivery|sharing/i },
    { path: "/export/client-package/download", required: "Share link unavailable", routeLanguage: /download|share/i },
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
    await page.goto("/export/client-package/download");

    await expect(page.getByTestId("j08-open-download-confirmation")).toBeVisible();
    await expect(page.getByRole("button", { name: "Prepare share link unavailable" })).toBeDisabled();
    await expect(page.getByText("No external link exists for this package.")).toBeVisible();
  });
});

test.describe("UX-INTERACTION table search sort row-action semantics", () => {
  test("advisor queue search filters rows and row action opens the advisor detail", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/advisor/reviews");

    await page.getByTestId("ux-interaction-advisor-search").fill("Northbridge");
    const table = page.getByTestId("ux-data-table").first();
    await expect(table).toContainText("Northbridge Family Office");
    await expect(table).not.toContainText("Morgan Family Office");
    await expect(page.getByRole("button", { name: "Type filter is unavailable for this queue" })).toBeDisabled();
    await table.getByTestId("ux-data-table-sort").first().click();
    await table.getByTestId("ux-data-table-row-action").first().click();
    await expect(page).toHaveURL(/\/advisor\/reviews\/[0-9a-f-]{36}/);
  });

  test("compliance queue search filters rows and row action opens review detail", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/compliance/reviews");

    await page.getByTestId("ux-interaction-compliance-search").fill("Northbridge");
    const table = page.getByTestId("ux-data-table").first();
    await expect(table).toContainText("Northbridge Family Office");
    await expect(table).not.toContainText("Morgan Family Office");
    await expect(page.getByRole("button", { name: "Additional compliance filters are unavailable for this queue" })).toBeDisabled();
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(table).toContainText("Morgan Family Office");
    await table.getByTestId("ux-data-table-sort").first().click();
    await table.getByTestId("ux-data-table-row-action").first().click();
    await expect(page).toHaveURL(/\/compliance\/reviews\/[^/]+\/decision-room/);
  });

  test("export protection review is compact and avoids dense operations scaffolding", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/export/client-package/redaction");

    await expect(page.getByTestId("ux-d3-dense-operations")).toHaveCount(0);
    await expect(page.getByText("Protection Checklist").first()).toBeVisible();
    await expect(page.getByText("Review sign-off").first()).toBeVisible();
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

    expect(excludedRoutes).toHaveLength(9);

    for (const route of excludedRoutes) {
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      await expect(page.getByTestId("ux-page-workbench-triad"), `${route.pageId} workbench triad`).toHaveCount(0);
      await expect(page.getByTestId("ux-page-detail-standard"), `${route.pageId} detail standard`).toHaveCount(0);
      const expectedActionLabel =
        p1ProtectedPageIds.has(route.pageId)
          ? "Deferred"
          : referenceProtectedPageIds.has(route.pageId)
            ? "Read only"
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
        guardHeading: "Read only",
        productText: "This area is read-only. No product controls are available."
      },
      {
        path: "/roadmap",
        guardHeading: "Read only",
        productText: "This area is read-only. No product controls are available."
      },
      {
        path: "/states",
        guardHeading: "Read only",
        productText: "This area is read-only. No product controls are available."
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
