import { expect, test } from "@playwright/test";

import {
  domainKOperationsLifecycleContractId,
  domainKOperationsLifecycleSteps,
  domainKOperationsProcessIds,
  domainKOperationsStepIds,
  domainKOperationsSurfaceRoute,
} from "../lib/domain-k-operations-lifecycle-contract";
import { screenRoutes } from "../lib/route-registry";

test.describe("DOMAIN-K operations lifecycle contract", () => {
  test("maps every BP-099/BP-100 step to queue, detail and step surfaces", () => {
    expect(domainKOperationsLifecycleContractId).toBe("DOMAIN-K-OPERATIONS-LIFECYCLE-01");
    expect(domainKOperationsLifecycleSteps.map((step) => step.stepId)).toEqual([...domainKOperationsStepIds]);
    expect(domainKOperationsLifecycleSteps).toHaveLength(10);

    for (const processId of domainKOperationsProcessIds) {
      const processSteps = domainKOperationsLifecycleSteps.filter((step) => step.processId === processId);

      expect(processSteps.map((step) => step.stepLabel)).toEqual([
        "Monitor",
        "Prioritize",
        "Block/escalate",
        "Resolve",
        "Audit when safety-relevant",
      ]);
    }

    for (const step of domainKOperationsLifecycleSteps) {
      expect(step.inputUi.length, `${step.stepId} input UI`).toBeGreaterThan(0);
      expect(step.outputUi.length, `${step.stepId} output UI`).toBeGreaterThan(0);
      expect(step.routePendants.length, `${step.stepId} route pendants`).toBeGreaterThan(0);
      expect(step.serviceProof.length, `${step.stepId} service proof`).toBeGreaterThan(0);
      expect(step.apiProof.length, `${step.stepId} API proof`).toBeGreaterThan(0);

      for (const surfaceId of step.routePendants) {
        const surfaceRoute = domainKOperationsSurfaceRoute(surfaceId);
        const registryRoute = screenRoutes.find((route) => route.pageId === surfaceRoute.pageId);

        expect(registryRoute?.title, `${step.stepId} ${surfaceId} title`).toBe(surfaceRoute.title);
        expect(registryRoute?.route, `${step.stepId} ${surfaceId} route`).toBe(surfaceRoute.path);
      }
    }
  });

  test("requires positive, negative, gate, audit and client-safe proof for every step", () => {
    for (const step of domainKOperationsLifecycleSteps) {
      expect(step.positiveProof.length, `${step.stepId} positive proof`).toBeGreaterThan(0);
      expect(step.negativeProof.length, `${step.stepId} negative proof`).toBeGreaterThan(0);
      expect(step.gateProof.length, `${step.stepId} gate proof`).toBeGreaterThan(0);
      expect(step.auditOrEvidenceFailureProof.length, `${step.stepId} audit/evidence failure proof`).toBeGreaterThan(0);
      expect(step.clientSafeBoundary.length, `${step.stepId} client-safe boundary`).toBeGreaterThan(0);
      expect(step.testProof.length, `${step.stepId} test proof`).toBeGreaterThan(0);

      expect(step.clientSafeBoundary.join(" ")).toMatch(/no client release|cannot release|does not publish|internal|clientVisible=false/i);
    }
  });
});
