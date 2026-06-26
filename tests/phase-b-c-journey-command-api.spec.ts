import "dotenv/config";

import { execFileSync } from "node:child_process";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test, type APIRequestContext } from "@playwright/test";

import { stableId } from "../lib/stable-id";

const morganTenantId = stableId("tenant:morgan");

type PhaseBCCommandCase = {
  command: string;
  email: string;
  expectedGate?: boolean;
};

const phaseBCCommands: PhaseBCCommandCase[] = [
  { command: "KYC_REQUEST_EVIDENCE", email: "mira.analyst@alphavest.demo" },
  { command: "KYC_COMPLETE_REVIEW", email: "naledi.compliance@alphavest.demo" },
  { command: "SOURCE_OF_WEALTH_ESCALATE", email: "mira.analyst@alphavest.demo" },
  { command: "SOURCE_OF_WEALTH_LINK_EVIDENCE", email: "naledi.compliance@alphavest.demo" },
  { command: "SUITABILITY_REQUEST_EVIDENCE", email: "mira.analyst@alphavest.demo", expectedGate: true },
  { command: "SUITABILITY_MARK_REVIEWED", email: "mira.analyst@alphavest.demo", expectedGate: true },
  { command: "IPS_REQUEST_MANDATE_CHANGES", email: "thabo.advisor@alphavest.demo", expectedGate: true },
  { command: "IPS_LINK_EVIDENCE", email: "thabo.advisor@alphavest.demo", expectedGate: true },
];

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

async function createMorganJourney(request: APIRequestContext, jwt: string) {
  const response = await request.post("/api/journeys", {
    data: {
      clientTenantId: morganTenantId,
      journeyKey: "MJ-003",
    },
    headers: bearer(jwt),
  });
  const body = await response.json();
  expect(response.ok(), JSON.stringify(body)).toBe(true);

  return body.detail.id as string;
}

test.describe.serial("Phase B/C typed journey commands", () => {
  let prisma: PrismaClient;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Phase B/C journey command tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("executes KYC, source-of-wealth, suitability and IPS commands through the typed journey API", async ({
    request,
  }) => {
    const analystJwt = await jwtFor(request, "mira.analyst@alphavest.demo");
    const journeyId = await createMorganJourney(request, analystJwt);
    const jwtByEmail = new Map<string, string>([["mira.analyst@alphavest.demo", analystJwt]]);

    for (const item of phaseBCCommands) {
      const jwt = jwtByEmail.get(item.email) ?? (await jwtFor(request, item.email));
      jwtByEmail.set(item.email, jwt);

      const response = await request.post(`/api/journeys/${journeyId}/commands`, {
        data: {
          command: item.command,
          reason: `${item.command} typed command proof.`,
        },
        headers: bearer(jwt),
      });
      const body = await response.json();

      expect(response.ok(), `${item.command}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.command).toBe(item.command);
      expect(body.mutated).toBe(true);
      expect(body.noAdviceExecution).toBe(true);
      expect(body.noClientRelease).toBe(true);
      expect(body.safety).toMatchObject({
        commandExecuted: true,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      });
      expect(body.result.clientVisible).toBe(false);
      expect(body.result.evidenceItemId).toBeTruthy();
      expect(body.result.evidenceRecordId).toBeTruthy();

      if (item.expectedGate) {
        expect(body.result.gateName).toBe("NO_UNAPPROVED_ADVICE");
        expect(body.result.gatePassed).toBe(false);
        expect(body.result.gateMissing).toContain("compliance_release");
        expect(body.result.gateMissing).toContain("ips_mandate_acknowledged");
      }
    }

    const commandRuns = await prisma.journeyCommandRun.findMany({
      orderBy: { createdAt: "asc" },
      where: {
        commandKey: { in: phaseBCCommands.map((item) => item.command) },
        journeyInstanceId: journeyId,
      },
    });
    expect(commandRuns.map((run) => run.commandKey)).toEqual(phaseBCCommands.map((item) => item.command));

    const auditRows = await prisma.auditEvent.count({
      where: {
        eventType: { startsWith: "journey.phase_" },
        targetId: journeyId,
      },
    });
    expect(auditRows).toBe(phaseBCCommands.length);
  });

  test("blocks Phase B/C command execution for client-scoped users", async ({ request }) => {
    const analystJwt = await jwtFor(request, "mira.analyst@alphavest.demo");
    const clientJwt = await jwtFor(request, "cfo.morgan@example.demo");
    const journeyId = await createMorganJourney(request, analystJwt);

    const response = await request.post(`/api/journeys/${journeyId}/commands`, {
      data: {
        command: "KYC_REQUEST_EVIDENCE",
        reason: "Client users must not execute internal KYC commands.",
      },
      headers: bearer(clientJwt),
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(403);
    expect(body.safety).toMatchObject({
      commandExecuted: false,
      hiddenRowsDisclosed: false,
    });
    expect(body.issues).toEqual(expect.arrayContaining(["command_permission_denied"]));
  });
});
