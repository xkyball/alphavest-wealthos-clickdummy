import { expect, test } from "@playwright/test";

import {
  domainJExportLifecycleAuthority,
  domainJExportLifecycleContract,
  domainJExportLifecycleIntegrity,
  domainJExportProcessIds,
} from "../lib/domain-j-export-lifecycle-contract";
import coverageMatrixArtifact from "../docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json";
import { exportWorkflowCanonicalApiRoute, exportWorkflowCommandIds } from "../lib/export-workflow-command-service";
import { requireProcessDefinition, requiresDomainSpineForGenericCompletion } from "../lib/process-runtime/process-registry";
import { routeToSmokePath, screenRoutes } from "../lib/route-registry";

type CoverageMatrixArtifact = {
  coverage_matrix: Array<{
    acceptance_state: string;
    blockers?: unknown[];
    completion_credit: string;
    current_touchpoints?: {
      apis?: string[];
      models_or_services?: string[];
      routes?: string[];
      tests?: string[];
    };
    domain_id: string;
    missing_layers?: string[];
    process_id: string;
    proof_refs?: {
      negative?: string[];
      positive?: string[];
    };
    step_id: string;
  }>;
};

const coverageMatrix = coverageMatrixArtifact as CoverageMatrixArtifact;

test.describe("DOMAIN-14 Domain-J export lifecycle contract", () => {
  test("covers every Domain-J process step with an export route and command pendant", () => {
    const integrity = domainJExportLifecycleIntegrity();

    expect(integrity.status).toBe("DOMAIN_J_EXPORT_LIFECYCLE_READY");
    expect(integrity.stepCount).toBe(72);
    expect(integrity.expectedStepCount).toBe(72);
    expect(integrity.missingStepIds).toEqual([]);
    expect(integrity.duplicateStepIds).toEqual([]);
    expect(integrity.missingProofStepIds).toEqual([]);

    expect(new Set(domainJExportLifecycleContract.map((step) => step.processId))).toEqual(new Set(domainJExportProcessIds));
    expect(new Set(domainJExportLifecycleContract.map((step) => step.routePendant.pageId))).toEqual(
      new Set(["054", "055", "056", "057", "058"]),
    );
    expect(new Set(domainJExportLifecycleContract.flatMap((step) => step.commandIds))).toEqual(new Set(exportWorkflowCommandIds));
  });

  test("uses the existing export screens as product-native UI pendants", () => {
    const routesByPageId = new Map(screenRoutes.map((route) => [route.pageId, route]));

    for (const pageId of domainJExportLifecycleAuthority.routePageIds) {
      const route = routesByPageId.get(pageId);

      expect(route, `${pageId} must remain registered`).toBeTruthy();
      expect(route?.navigationGroup).toBe("export");
      expect(route ? routeToSmokePath(route.route) : "").toMatch(/^\/export\//);
    }

    for (const step of domainJExportLifecycleContract) {
      expect(step.uiPendant, step.stepId).toContain(" ");
      expect(step.routePendant.route, step.stepId).toMatch(/^\/export\//);
    }
  });

  test("keeps Domain-J behind the export command spine instead of generic completion", () => {
    expect(domainJExportLifecycleAuthority.apiRoute).toBe(exportWorkflowCanonicalApiRoute);
    expect(domainJExportLifecycleAuthority.commandService).toBe("lib/export-workflow-command-service.ts");

    for (const processId of domainJExportProcessIds) {
      const definition = requireProcessDefinition(processId);

      expect(definition.domainId).toBe("DOMAIN-J");
      expect(definition.steps).toHaveLength(8);
      expect(requiresDomainSpineForGenericCompletion(definition)).toBe(true);
    }
  });

  test("requires negative safety, audit failure and forbidden-payload proof for every step", () => {
    for (const step of domainJExportLifecycleContract) {
      expect(step.negativeProofRefs, `${step.stepId} negative proof`).toEqual(
        expect.arrayContaining([
          "tests/export-workflow-api.spec.ts",
          "tests/export-safety.spec.ts",
          "tests/true-ux-export-scope-redaction-approval.spec.ts",
        ]),
      );
      expect(step.auditFailureProofRefs, `${step.stepId} audit failure proof`).toEqual(
        expect.arrayContaining(["tests/export-workflow-api.spec.ts", "tests/export-workflow-api.spec.ts"]),
      );
    }

    const auditSteps = domainJExportLifecycleContract.filter((step) => step.processId === "BP-091");
    const payloadSteps = domainJExportLifecycleContract.filter((step) => step.processId === "BP-092");

    expect(auditSteps).toHaveLength(8);
    expect(payloadSteps).toHaveLength(8);
    expect(auditSteps.every((step) => step.commandIds.length > 0)).toBe(true);
    expect(payloadSteps.every((step) => step.negativeProofRefs.includes("tests/export-safety.spec.ts"))).toBe(true);
  });

  test("keeps the P0 coverage matrix closed for all 72 Domain-J rows", () => {
    const rows = coverageMatrix.coverage_matrix.filter((row) => row.domain_id === "DOMAIN-J");

    expect(rows).toHaveLength(72);
    expect(new Set(rows.map((row) => row.step_id))).toEqual(new Set(domainJExportLifecycleContract.map((step) => step.stepId)));

    for (const row of rows) {
      expect(row.acceptance_state, row.step_id).toBe("implemented");
      expect(row.completion_credit, row.step_id).toBe("full");
      expect(row.missing_layers ?? [], row.step_id).toEqual([]);
      expect(row.blockers ?? [], row.step_id).toEqual([]);
      expect(row.current_touchpoints?.apis, row.step_id).toContain("/api/export-workflow");
      expect(row.current_touchpoints?.models_or_services, row.step_id).toContain("lib/domain-j-export-lifecycle-contract.ts");
      expect(row.current_touchpoints?.tests, row.step_id).toContain("tests/domain-j-export-lifecycle-contract.spec.ts");
      expect(row.proof_refs?.positive ?? [], row.step_id).toContain("tests/export-workflow-api.spec.ts");
      expect(row.proof_refs?.negative ?? [], row.step_id).toContain("tests/export-safety.spec.ts");
      expect(row.proof_refs?.negative ?? [], row.step_id).toContain("tests/export-workflow-api.spec.ts");
    }
  });
});
