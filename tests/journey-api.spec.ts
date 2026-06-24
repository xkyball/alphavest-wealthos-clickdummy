import "dotenv/config";

import { execFileSync } from "node:child_process";

import { expect, test, type APIRequestContext } from "@playwright/test";

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

function bearer(jwt: string) {
  return {
    authorization: `Bearer ${jwt}`,
  };
}

test.describe("Wave 0-2 Journey APIs and command execution", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("fails closed without a current-user JWT", async ({ request }) => {
    const response = await request.get("/api/journeys");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety.silentStateAdvance).toBe(false);
  });

  test("lists only scoped tenant journeys and active startable definitions", async ({ request }) => {
    const bennettJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const response = await request.get("/api/journeys", {
      headers: bearer(bennettJwt),
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.journeys).toHaveLength(7);
    expect(body.journeys.every((journey: { projectionType?: string }) => journey.projectionType !== "internal")).toBe(true);
    expect(body.availableDefinitions.map((definition: { journeyKey: string }) => definition.journeyKey).sort()).toEqual([
      "MJ-001",
      "MJ-002",
      "MJ-003",
      "MJ-005",
      "MJ-006",
      "MJ-010",
      "MJ-012",
    ]);
    expect(JSON.stringify(body)).not.toContain("MJ-004");
    expect(JSON.stringify(body)).not.toContain("MJ-007");

    const morganJwt = await jwtFor(request, "cfo.morgan@example.demo");
    const morganResponse = await request.get("/api/journeys", {
      headers: bearer(morganJwt),
    });
    const morganBody = await morganResponse.json();

    expect(morganResponse.ok(), JSON.stringify(morganBody)).toBe(true);
    expect(morganBody.journeys).toEqual([]);
  });

  test("creates accepted journeys and denies hold journeys", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-002" },
      headers: bearer(jwt),
    });
    const createBody = await createResponse.json();

    expect(createResponse.ok(), JSON.stringify(createBody)).toBe(true);
    expect(createBody.mutated).toBe(true);
    expect(createBody.detail.journeyKey).toBe("MJ-002");
    expect(createBody.detail.status).toBe("CREATED");
    expect(createBody.detail.projectionType).toBe("client");

    const holdResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-004" },
      headers: bearer(jwt),
    });
    const holdBody = await holdResponse.json();

    expect(holdResponse.status(), JSON.stringify(holdBody)).toBe(403);
    expect(holdBody.ok).toBe(false);
    expect(holdBody.mutated).toBe(false);
    expect(holdBody.issues).toContain("journey_not_executable");
  });

  test("validates command payloads before mutation", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-002" },
      headers: bearer(jwt),
    });
    const createBody = await createResponse.json();
    const journeyId = createBody.detail.id as string;

    const response = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: { command: "RUN_ANYTHING" },
      headers: bearer(jwt),
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.issues).toContain("valid_command_required");
    expect(body.safety.commandExecuted).toBe(false);
  });

  test("executes allowed commands with audit and denies unauthorized/no-skip commands", async ({ request }) => {
    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const adminJwt = await jwtFor(request, "ava.admin@alphavest.demo");
    const createResponse = await request.post("/api/journeys", {
      data: { journeyKey: "MJ-002" },
      headers: bearer(cfoJwt),
    });
    const journeyId = (await createResponse.json()).detail.id as string;

    const startResponse = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: { command: "START" },
      headers: bearer(cfoJwt),
    });
    const startBody = await startResponse.json();

    expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);
    expect(startBody.mutated).toBe(true);
    expect(startBody.auditEventId).toBeTruthy();
    expect(startBody.detail.status).toBe("ACTIVE");

    const deniedResponse = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: { command: "COMPLETE_STEP" },
      headers: bearer(cfoJwt),
    });
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.mutated).toBe(false);
    expect(deniedBody.safety.commandExecuted).toBe(false);

    const skipResponse = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: {
        command: "COMPLETE_STEP",
        fromStepKey: "release.accept_sufficiency",
      },
      headers: bearer(adminJwt),
    });
    const skipBody = await skipResponse.json();

    expect(skipResponse.status(), JSON.stringify(skipBody)).toBe(400);
    expect(skipBody.ok).toBe(false);
    expect(skipBody.mutated).toBe(false);
    expect(skipBody.safety.commandExecuted).toBe(false);

    const auditResponse = await request.get(`/api/journeys/${journeyId}/audit`, {
      headers: bearer(adminJwt),
    });
    const auditBody = await auditResponse.json();

    expect(auditResponse.ok(), JSON.stringify(auditBody)).toBe(true);
    expect(auditBody.audit).toEqual([
      expect.objectContaining({
        commandKey: "START",
        result: "SUCCESS",
      }),
    ]);
  });

  test("returns client projection and evidence sufficiency without internal leakage", async ({ request }) => {
    const jwt = await jwtFor(request, "cfo.bennett@example.demo");
    const listResponse = await request.get("/api/journeys", {
      headers: bearer(jwt),
    });
    const listBody = await listResponse.json();
    const exportJourney = listBody.journeys.find((journey: { journeyKey: string }) => journey.journeyKey === "MJ-005");

    expect(exportJourney).toBeTruthy();

    const projectionResponse = await request.get(`/api/journeys/${exportJourney.id}/client-projection`, {
      headers: bearer(jwt),
    });
    const projectionBody = await projectionResponse.json();

    expect(projectionResponse.ok(), JSON.stringify(projectionBody)).toBe(true);
    expect(projectionBody.projection.journeyKey).toBe("MJ-005");
    expect(JSON.stringify(projectionBody)).not.toMatch(/blockerReason|objectLinks|evidenceRequirements/);
    expect(projectionBody.safety.internalPayloadReturned).toBe(false);

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
  });
});
