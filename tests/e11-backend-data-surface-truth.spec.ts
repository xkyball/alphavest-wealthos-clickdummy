import { expect, test, type APIRequestContext } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { authJwtCookieName } from "../lib/auth/auth-jwt";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import { e11BackendDataSurfaceLedgerEntries } from "@/lib/ux-contract-ledger";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

async function authHeaders(
  request: APIRequestContext,
  email: string,
  scope: { roleKey?: string; tenantSlug?: string } = {},
) {
  const password = email.split("@")[0] ?? "";
  const startResponse = await request.post("/api/auth/provider-login", {
    data: { email, password, providerId: "db-user-jwt", ...scope },
  });
  const startBody = await startResponse.json();
  expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);

  const mfaResponse = await request.post("/api/auth/mfa/verify", {
    data: { code: "123456", email, providerId: "db-user-jwt", ...scope },
  });
  const mfaBody = await mfaResponse.json();
  expect(mfaResponse.ok(), JSON.stringify(mfaBody)).toBe(true);

  return { cookie: `${authJwtCookieName}=${mfaBody.jwt as string}` };
}

test.describe("E11 backend data surface truth", () => {
  test("documents the E11 register and canonical query spec", () => {
    const register = read("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_COVERAGE_REGISTER.md");
    const spec = read("docs/ux/ALPHAVEST_E11_BACKEND_DATA_SURFACE_QUERY_SPEC.md");

    expect(register).toContain("E11-DS-001");
    expect(register).toContain("backend_snapshot_only");
    expect(spec).toContain("Canonical Request Contract");
    expect(spec).toContain("sourceTruth");
  });

  test("maps E11 coverage rows into the E12 contract ledger", () => {
    expect(e11BackendDataSurfaceLedgerEntries.map((entry) => entry.id)).toEqual([
      "E11-DS-001",
      "E11-DS-002",
      "E11-DS-003",
      "E11-DS-004",
      "E11-DS-005",
      "E11-DS-006",
      "E11-DS-007",
      "E11-DS-008",
    ]);

    for (const entry of e11BackendDataSurfaceLedgerEntries) {
      expect(entry.contractFamily, entry.id).toBe("backend_query_truth");
      expect(entry.currentClass, entry.id).toBeTruthy();
      expect(entry.targetClass, entry.id).toMatch(/^backend_query_/);
      expect(entry.ownerSurface.length, entry.id).toBeGreaterThan(0);
      expect(entry.expiresOrFollowUp, entry.id).toBeTruthy();
      expect(entry.status, entry.id).toBe("partial");
      expect(entry.gateBehavior, entry.id).toBe("warn_existing");
    }
  });

  test("normalizes query parameters with page caps and sort allow-lists", () => {
    const query = parseDataSurfaceQuery(new URLSearchParams("q=AlphaVest&page=2&pageSize=999&sortKey=status&sortDirection=desc"), {
      allowedSortKeys: ["name", "status"] as const,
      defaultPageSize: 10,
      defaultSortKey: "name",
      maxPageSize: 25,
    });

    expect(query).toEqual({
      page: 2,
      pageSize: 25,
      q: "AlphaVest",
      sortDirection: "desc",
      sortKey: "status",
    });
  });

  test("DBTF APIs return backend query metadata", async ({ request }) => {
    const morganHeaders = await authHeaders(request, "cfo.morgan@example.demo");
    const family = await request.get("/api/family-members?pageSize=1&sortKey=name", {
      headers: morganHeaders,
    });
    const entities = await request.get("/api/entities?pageSize=1&sortKey=name", {
      headers: morganHeaders,
    });
    const documents = await request.get("/api/documents?tenantSlug=bennett&roleKey=admin&source=all&pageSize=1&sortKey=uploadedAt&sortDirection=desc", {
      headers: morganHeaders,
    });

    for (const response of [family, entities, documents]) {
      expect(response.ok()).toBe(true);
      const body = await response.json();

      expect(body.meta.sourceTruth).toBe("backend_query_backed");
      expect(body.meta.pageSize).toBe(1);
      expect(body.meta.returnedRows).toBeLessThanOrEqual(1);
      expect(body.meta.totalRows).toBeGreaterThanOrEqual(body.meta.returnedRows);
      expect(body.meta.totalPages).toBeGreaterThanOrEqual(1);
      expect(body.meta.hasNextPage).toBe(body.meta.totalRows > body.meta.returnedRows);
      expect(body.safety.hiddenRowsDisclosed).toBe(false);
    }
  });

  test("entity detail is backend readmodel backed and no longer fixture driven", async ({ request }) => {
    const response = await request.get("/api/entities?targetId=philanthropy-trust", {
      headers: await authHeaders(request, "cfo.bennett@example.demo"),
    });
    const body = await response.json();
    const source = read("components/client-intake-screen.tsx");

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.entity.sourceTruth).toBe("entity_db_readmodel");
    expect(body.meta.sourceTruth).toBe("backend_query_backed");
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.entity.name).not.toBe("Carter Family Trust");
    expect(source).not.toContain("entityDetail");
    expect(source).not.toContain("ENT-000482");
    expect(source).not.toContain("Equities 49.0%");
  });

  test("admin tenant surfaces expose paginated backend rows", async ({ request }) => {
    const headers = await authHeaders(request, "ava.admin@alphavest.demo", { roleKey: "admin" });
    const tenants = await request.get("/api/admin-tenants?surface=tenants&pageSize=1&sortKey=name", { headers });
    const users = await request.get("/api/admin-tenants?surface=users&pageSize=1&sortKey=name", { headers });

    for (const response of [tenants, users]) {
      expect(response.ok()).toBe(true);
      const body = await response.json();

      expect(body.meta.sourceTruth).toBe("backend_query_backed");
      expect(body.meta.pageSize).toBe(1);
      expect(body.meta.returnedRows).toBeLessThanOrEqual(1);
      expect(body.safety.authority).toBe("db-user-jwt");
      expect(body.safety.hiddenRowsDisclosed).toBe(false);
    }
  });

  test("review monitoring surfaces expose paginated backend rows", async ({ request }) => {
    const reviews = await request.get("/api/review-monitoring?surface=reviews&pageSize=1&sortKey=nextReviewDate&sortDirection=asc");
    const rebalance = await request.get("/api/review-monitoring?surface=rebalance&pageSize=1&sortKey=slaDueAt&sortDirection=desc&triggerState=blocked");

    for (const response of [reviews, rebalance]) {
      expect(response.ok()).toBe(true);
      const body = await response.json();

      expect(body.meta.sourceTruth).toBe("backend_query_backed");
      expect(body.meta.pageSize).toBe(1);
      expect(body.meta.returnedRows).toBeLessThanOrEqual(1);
      expect(body.meta.totalRows).toBeGreaterThanOrEqual(body.meta.returnedRows);
      expect(body.noAdviceExecution).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.safety.hiddenRowsDisclosed).toBe(false);
    }
  });

  test("decision records expose paginated backend rows with fail-closed safety metadata", async ({ request }) => {
    const response = await request.get("/api/decision-records?tenantSlug=morgan&roleKey=compliance_officer&pageSize=1&sortKey=updatedAt&sortDirection=desc");
    expect(response.ok()).toBe(true);

    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(body.sourceTruth).toBe("decision_db_readmodel");
    expect(body.meta.sourceTruth).toBe("backend_query_backed");
    expect(body.meta.pageSize).toBe(1);
    expect(body.meta.returnedRows).toBeLessThanOrEqual(1);
    expect(body.meta.totalRows).toBeGreaterThanOrEqual(body.meta.returnedRows);
    expect(body.meta.totalPages).toBeGreaterThanOrEqual(1);
    expect(body.noAdviceExecution).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.safety.scope).toBe("tenant-role-decision-record-list");
  });

  test("recommendation review queues return workflow DB readmodels instead of static fixtures", async ({ request }) => {
    const response = await request.get("/api/recommendation-review-workflow");
    expect(response.ok()).toBe(true);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.snapshot.source).toBe("workflow_process_db");
    expect(body.snapshot.processBackbone).toBe(true);

    const advisorClients = body.snapshot.advisorQueue.map((row: { client: string }) => row.client);
    const complianceClients = body.snapshot.complianceQueue.map((row: { sub: string }) => row.sub);
    const complianceDisplayIds = body.snapshot.complianceQueue.map((row: { displayId: string }) => row.displayId);
    const advisorWorkflowRows = body.snapshot.advisorQueue.map((row: {
      workflow: {
        commandHistoryCount: number;
        currentActionLabel: string;
        processInstanceId: string;
        status: string;
      };
    }) => row.workflow);
    const complianceWorkflowRows = body.snapshot.complianceQueue.map((row: {
      workflow: {
        commandHistoryCount: number;
        currentActionLabel: string;
        processInstanceId: string;
        status: string;
      };
    }) => row.workflow);

    expect(advisorClients).toEqual(expect.arrayContaining(["Morgan Family Office", "Northbridge Family Office"]));
    expect(complianceClients).toEqual(expect.arrayContaining(["Morgan Family Office", "Northbridge Family Office"]));
    expect(advisorClients).not.toContain("James Thornton");
    expect(advisorClients).not.toContain("Michael Wong");
    expect(complianceDisplayIds).not.toContain("CMP-2025-0137");
    for (const workflow of [...advisorWorkflowRows, ...complianceWorkflowRows]) {
      expect(workflow.processInstanceId).toMatch(/^[0-9a-f-]{36}$/);
      expect(workflow.currentActionLabel.length).toBeGreaterThan(0);
      expect(workflow.status.length).toBeGreaterThan(0);
      expect(workflow.commandHistoryCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("source gates block local-snapshot and demo-row regression", () => {
    const clientIntake = read("components/client-intake-screen.tsx");
    const routeDispatcher = read("app/[...segments]/page.tsx");
    const wealthActions = read("components/wealth-actions-screen.tsx");
    const adminTenant = read("components/admin-tenant-setup-screen.tsx");
    const exportOps = read("components/communication-export-ops-screen.tsx");
    const reviewMonitoring = read("components/review-monitoring-screen.tsx");
    const dataTable = read("components/ui/data-table.tsx");

    expect(clientIntake).not.toContain("const filteredRows = sortByKey");
    expect(routeDispatcher).not.toContain("wealth-actions-seed-data");
    expect(wealthActions).not.toContain("wealth-actions-seed-data");
    expect(wealthActions).toContain("wealth-actions-route-contract");
    expect(exportOps).not.toContain("snapshot?.queueRows.length ? snapshot.queueRows : queueRows");
    expect(exportOps).not.toContain("snapshot?.metrics.length ? snapshot.metrics : opsMetrics");
    expect(exportOps).not.toContain("snapshot?.breachRows.length ? snapshot.breachRows : breachRows");
    expect(exportOps).not.toContain("snapshot?.slaMetrics.length ? snapshot.slaMetrics : slaMetrics");
    expect(exportOps).not.toContain("dataQualityReleaseControls.map");
    expect(exportOps).not.toContain("snapshot?.scopeItems.length ? snapshot.scopeItems : exportScopeItems");
    expect(exportOps).not.toContain("snapshot?.summary ?? exportScopeSummary");
    expect(exportOps).not.toContain("exportScopeItems");
    expect(exportOps).not.toContain("exportScopeSummary");
    expect(exportOps).not.toContain("redactionSummary");
    expect(exportOps).not.toContain("previewPolicyChecks");
    expect(exportOps).not.toContain("exportForbiddenPayloadChecks");
    expect(adminTenant).not.toContain("snapshot?.tenantRows.length ? snapshot.tenantRows : tenantRows");
    expect(adminTenant).not.toContain("snapshot?.userRows.length ? snapshot.userRows : tenantUsers");
    expect(adminTenant).not.toContain("snapshot?.setupChecklist.length ? snapshot.setupChecklist : tenantSetupChecklist");
    expect(adminTenant).not.toContain("snapshot?.teamRows.length ? snapshot.teamRows : teamAssignments");
    expect(adminTenant).not.toContain("tenantSetupChecklist");
    expect(adminTenant).not.toContain("teamAssignments");
    expect(adminTenant).not.toContain("pagination={null}");
    expect(adminTenant).not.toContain("rows={rows.slice(0, 3)}");
    expect(adminTenant).toContain("pagination={meta ? { ...meta, onPageChange: setPage } : null}");
    expect(reviewMonitoring).not.toContain("rows={reviewRows.slice(0, 6)}");
    expect(reviewMonitoring).toContain("surface: \"reviews\"");
    expect(reviewMonitoring).toContain("surface: \"rebalance\"");
    expect(reviewMonitoring).toContain("pagination={meta ? { ...meta, onPageChange: setPage } : null}");
    expect(reviewMonitoring).toContain("data-testid=\"ux-data-list-pagination\"");
    expect(reviewMonitoring).not.toContain("reviewCalendarRows");
    expect(reviewMonitoring).not.toContain("rebalanceTriggerRows");
    expect(dataTable).toContain("data-testid=\"ux-data-table-pagination\"");
    expect(dataTable).toContain("serverSort");
  });
});
