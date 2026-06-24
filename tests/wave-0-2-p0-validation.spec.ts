import "dotenv/config";

import { execFileSync } from "node:child_process";

import { expect, test, type APIRequestContext } from "@playwright/test";

import { stableId } from "../lib/stable-id";

type P0ProofRow = {
  area: string;
  expectation: string;
  mode: "positive" | "negative";
  proof: string;
};

const requiredP0ProofRows: P0ProofRow[] = [
  {
    area: "Auth/Journey",
    expectation: "Known DB user completes stub MFA and receives scoped journey access.",
    mode: "positive",
    proof: "IMPL-7.2A",
  },
  {
    area: "Evidence/Gate/Projection",
    expectation: "Accepted P0 journey exposes evidence sufficiency and client projection without internal payload leakage.",
    mode: "positive",
    proof: "IMPL-7.2B",
  },
  {
    area: "Export",
    expectation: "Client-safe export scope can preview through explicit redaction before approval.",
    mode: "positive",
    proof: "IMPL-7.2B",
  },
  {
    area: "Auth/RBAC/Admin",
    expectation: "Wrong MFA, missing auth, cross-tenant access and admin force paths fail closed.",
    mode: "negative",
    proof: "IMPL-7.3A",
  },
  {
    area: "Evidence/Advisor/Compliance",
    expectation: "Upload-only and advisor-only states cannot release client-visible output.",
    mode: "negative",
    proof: "IMPL-7.3B",
  },
  {
    area: "AI/Projection/Export",
    expectation: "Internal rationale and compliance notes are blocked from client projection and export preview.",
    mode: "negative",
    proof: "IMPL-7.3C",
  },
  {
    area: "Hold Journeys",
    expectation: "Wave 0-2 hold journeys remain unavailable for creation.",
    mode: "negative",
    proof: "IMPL-7.3D",
  },
];

function bearer(jwt: string) {
  return {
    authorization: `Bearer ${jwt}`,
  };
}

async function jwtFor(request: APIRequestContext, email: string) {
  const startResponse = await request.post("/api/auth/provider-login", {
    data: {
      email,
      providerId: "db-user-jwt",
    },
  });
  expect(startResponse.ok(), await startResponse.text()).toBe(true);

  const mfaResponse = await request.post("/api/auth/mfa/verify", {
    data: {
      code: "123456",
      email,
      providerId: "db-user-jwt",
    },
  });
  const body = await mfaResponse.json();
  expect(mfaResponse.ok(), JSON.stringify(body)).toBe(true);

  return body.jwt as string;
}

async function exportCommand(request: APIRequestContext, data: Record<string, unknown>) {
  return request.post("/api/export-workflow", { data });
}

function safeScopeItem(label: string) {
  return {
    access: "Allowed",
    id: stableId(`wave-0-2-p0-validation:${label}`),
    name: "Released client-safe decision summary",
    payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
    selected: true,
    type: "DECISION",
  };
}

async function createExportRequest(request: APIRequestContext, label: string) {
  const response = await exportCommand(request, {
    command: "SET_SCOPE",
    reason: "Epic 7 P0 release validation selects only client-safe released objects.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem(label)],
    tenantSlug: "summit",
  });
  const body = await response.json();

  expect(response.ok(), JSON.stringify(body)).toBe(true);
  expect(body.status).toBe("SCOPE_SELECTED");
  expect(body.noClientRelease).toBe(true);

  return body.exportRequestId as string;
}

test.describe.serial("Epic 7 Wave 0-2 P0 test and release validation", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("SPEC-7.1 maps required P0 positive and negative proof rows", () => {
    expect(requiredP0ProofRows).toHaveLength(7);
    expect(requiredP0ProofRows.filter((row) => row.mode === "positive").map((row) => row.proof).sort()).toEqual([
      "IMPL-7.2A",
      "IMPL-7.2B",
      "IMPL-7.2B",
    ]);
    expect(requiredP0ProofRows.filter((row) => row.mode === "negative").map((row) => row.proof).sort()).toEqual([
      "IMPL-7.3A",
      "IMPL-7.3B",
      "IMPL-7.3C",
      "IMPL-7.3D",
    ]);
  });

  test("IMPL-7.2A proves positive Auth/Journey access for scoped P0 users", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");

    const currentUserResponse = await request.get("/api/current-user", {
      headers: bearer(jwt),
    });
    const currentUserBody = await currentUserResponse.json();
    expect(currentUserResponse.ok(), JSON.stringify(currentUserBody)).toBe(true);
    expect(currentUserBody.currentUser.role.key).toBe("family_cfo");
    expect(currentUserBody.currentUser.tenant.displayName).toBe("Bennett Family Office");

    const journeysResponse = await request.get("/api/journeys", {
      headers: bearer(jwt),
    });
    const journeysBody = await journeysResponse.json();
    expect(journeysResponse.ok(), JSON.stringify(journeysBody)).toBe(true);
    expect(journeysBody.availableDefinitions.map((definition: { journeyKey: string }) => definition.journeyKey).sort()).toEqual([
      "MJ-001",
      "MJ-002",
      "MJ-003",
      "MJ-005",
      "MJ-006",
      "MJ-010",
      "MJ-012",
    ]);

    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-002" },
      headers: bearer(jwt),
    });
    const createBody = await createResponse.json();
    expect(createResponse.ok(), JSON.stringify(createBody)).toBe(true);
    expect(createBody.detail.journeyKey).toBe("MJ-002");
    expect(createBody.detail.projectionType).toBe("client");
    expect(createBody.mutated).toBe(true);
  });

  test("IMPL-7.2B proves positive evidence, projection and export preview gates", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");
    const journeysResponse = await request.get("/api/journeys", {
      headers: bearer(jwt),
    });
    const journeysBody = await journeysResponse.json();
    const exportJourney = journeysBody.journeys.find((journey: { journeyKey: string }) => journey.journeyKey === "MJ-005");
    expect(exportJourney).toBeTruthy();

    const projectionResponse = await request.get(`/api/journeys/${exportJourney.id}/client-projection`, {
      headers: bearer(jwt),
    });
    const projectionBody = await projectionResponse.json();
    expect(projectionResponse.ok(), JSON.stringify(projectionBody)).toBe(true);
    expect(projectionBody.projection.journeyKey).toBe("MJ-005");
    expect(projectionBody.safety.internalPayloadReturned).toBe(false);
    expect(JSON.stringify(projectionBody)).not.toMatch(/internalRationale|objectLinks|evidenceRequirements|complianceNotes/);

    const evidenceResponse = await request.get(`/api/journeys/${exportJourney.id}/evidence-sufficiency`, {
      headers: bearer(jwt),
    });
    const evidenceBody = await evidenceResponse.json();
    expect(evidenceResponse.ok(), JSON.stringify(evidenceBody)).toBe(true);
    expect(evidenceBody.evidenceSufficient).toBe(true);
    expect(evidenceBody.safety).toMatchObject({
      noClientRelease: true,
      uploadIsNotSufficiency: true,
    });

    const exportRequestId = await createExportRequest(request, "positive-preview");
    const preview = await exportCommand(request, {
      command: "PREVIEW",
      exportRequestId,
      payload: {
        clientSummary: "Released client-safe export summary.",
        decisionState: "Released",
        releasedAt: "2026-06-24T00:00:00.000Z",
        status: "RELEASED_TO_CLIENT",
        title: "Liquidity governance decision",
      },
      reason: "Preview client-safe export package for Epic 7 P0 positive proof.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const previewBody = await preview.json();

    expect(preview.ok(), JSON.stringify(previewBody)).toBe(true);
    expect(previewBody.status).toBe("APPROVAL_REQUIRED");
    expect(previewBody.noClientRelease).toBe(true);
  });

  test("IMPL-7.3A blocks wrong MFA, missing auth, cross-tenant access and admin bypass", async ({ request }) => {
    const wrongMfa = await request.post("/api/auth/mfa/verify", {
      data: {
        code: "000000",
        email: "cfo.bennett@example.demo",
        providerId: "db-user-jwt",
      },
    });
    const wrongMfaBody = await wrongMfa.json();
    expect(wrongMfa.status(), JSON.stringify(wrongMfaBody)).toBe(403);
    expect(wrongMfaBody.reasonCode).toBe("DUMMY_AUTH_MFA_INVALID_CODE");

    const unauthenticatedJourneys = await request.get("/api/journeys");
    const unauthenticatedBody = await unauthenticatedJourneys.json();
    expect(unauthenticatedJourneys.status(), JSON.stringify(unauthenticatedBody)).toBe(401);
    expect(unauthenticatedBody.mutated).toBe(false);

    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const morganJwt = await jwtFor(request, "cfo.morgan@example.demo");
    const adminJwt = await jwtFor(request, "ava.admin@alphavest.demo");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-003" },
      headers: bearer(cfoJwt),
    });
    const journeyId = ((await createResponse.json()).detail.id ?? "") as string;

    const crossTenant = await request.get(`/api/journeys/${journeyId}/evidence-sufficiency`, {
      headers: bearer(morganJwt),
    });
    const crossTenantBody = await crossTenant.json();
    expect(crossTenant.status(), JSON.stringify(crossTenantBody)).toBe(403);
    expect(crossTenantBody.reasonCode).toBe("SCOPE_DENIED");
    expect(crossTenantBody.mutated).toBe(false);

    const adminRelease = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: {
        clientSafeSummary: "Admin cannot release.",
        command: "COMPLIANCE_RELEASE",
        confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
        reason: "Epic 7 admin non-bypass proof.",
      },
      headers: bearer(adminJwt),
    });
    const adminReleaseBody = await adminRelease.json();
    expect(adminRelease.status(), JSON.stringify(adminReleaseBody)).toBe(403);
    expect(adminReleaseBody.mutated).toBe(false);
    expect(adminReleaseBody.issues).toContain("admin_non_bypass");
  });

  test("IMPL-7.3B blocks upload-only and advisor-only release paths", async ({ request }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const advisorJwt = await jwtFor(request, "thabo.advisor@alphavest.demo");
    const complianceJwt = await jwtFor(request, "naledi.compliance@alphavest.demo");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-003" },
      headers: bearer(cfoJwt),
    });
    const createBody = await createResponse.json();
    const journeyId = createBody.detail.id as string;

    const advisorApproval = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: {
        command: "ADVISOR_APPROVE",
        reason: "Advisor approval alone must not release client output.",
      },
      headers: bearer(advisorJwt),
    });
    const advisorApprovalBody = await advisorApproval.json();
    expect(advisorApproval.ok(), JSON.stringify(advisorApprovalBody)).toBe(true);
    expect(advisorApprovalBody.noClientRelease).toBe(true);

    const releaseWithoutEvidence = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: {
        clientSafeSummary: "Client-safe summary cannot release without evidence sufficiency.",
        command: "COMPLIANCE_RELEASE",
        confirmationPhrase: "RELEASE CLIENT-SAFE JOURNEY",
        reason: "Epic 7 upload-only/advisor-only release block proof.",
      },
      headers: bearer(complianceJwt),
    });
    const releaseWithoutEvidenceBody = await releaseWithoutEvidence.json();
    expect(releaseWithoutEvidence.status(), JSON.stringify(releaseWithoutEvidenceBody)).toBe(400);
    expect(releaseWithoutEvidenceBody.mutated).toBe(false);
    expect(releaseWithoutEvidenceBody.issues).toContain("release_preconditions_failed");
    expect(releaseWithoutEvidenceBody.issues.some((issue: string) => issue.startsWith("evidence_sufficiency:"))).toBe(true);
  });

  test("IMPL-7.3C blocks AI/internal rationale leakage from export payloads", async ({ request }) => {
    const exportRequestId = await createExportRequest(request, "negative-leakage");

    const response = await exportCommand(request, {
      command: "PREVIEW",
      exportRequestId,
      payload: {
        clientSummary: "Released summary.",
        complianceNotes: "Internal compliance-only note.",
        internalRationale: "Model rationale.",
      },
      reason: "Epic 7 unsafe export preview must fail closed.",
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.mutated).toBe(false);
    expect(body.issues).toEqual(
      expect.arrayContaining(["forbidden_export_payload", "forbidden_projection_field:complianceNotes", "forbidden_projection_field:internalRationale"]),
    );
    expect(body.safety.commandExecuted).toBe(false);
  });

  test("IMPL-7.3D keeps Wave 0-2 hold journeys blocked", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");

    for (const journeyKey of ["MJ-004", "MJ-007"]) {
      const response = await request.post("/api/journeys", {
        data: { journeyKey },
        headers: bearer(jwt),
      });
      const body = await response.json();

      expect(response.status(), JSON.stringify(body)).toBe(403);
      expect(body.ok).toBe(false);
      expect(body.mutated).toBe(false);
      expect(body.issues).toContain("journey_not_executable");
    }
  });
});
