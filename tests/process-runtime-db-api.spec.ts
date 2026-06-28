import "dotenv/config";

import { execFileSync } from "node:child_process";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  ProcessDefinitionStatus,
  ProcessInstanceStatus,
  ProcessStepStatus,
  PrismaClient,
} from "@prisma/client";
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

test.describe("Process Runtime Backbone DB and API", () => {
  let prisma: PrismaClient | undefined;

  test.beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for process runtime tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("seed persists process runtime definitions, instances, step state and command history", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    await expect(prisma.processDefinition.count()).resolves.toBe(84);
    await expect(prisma.processStepDefinition.count()).resolves.toBe(438);
    await expect(prisma.processInstance.count()).resolves.toBe(84);
    await expect(prisma.processStepInstance.count()).resolves.toBe(438);
    await expect(prisma.processCommandRun.count()).resolves.toBe(84);
    await expect(prisma.journeyDefinition.count()).resolves.toBe(0);
    await expect(prisma.journeyInstance.count()).resolves.toBe(0);
    await expect(
      prisma.evidenceSufficiencyDecision.count({
        where: { processInstanceId: { not: null } },
      }),
    ).resolves.toBe(6);

    const process = await prisma.processInstance.findFirstOrThrow({
      include: {
        commandRuns: true,
        processDefinition: true,
        steps: { orderBy: { sequence: "asc" } },
      },
      where: {
        processDefinition: { processId: "BP-024" },
      },
    });

    expect(process.processDefinition.status).toBe(ProcessDefinitionStatus.ACTIVE);
    expect(process.status).toBe(ProcessInstanceStatus.ACTIVE);
    expect(process.steps[0]?.status).toBe(ProcessStepStatus.ACTIVE);
    expect(process.steps.slice(1).every((step) => step.status === ProcessStepStatus.LOCKED)).toBe(true);
    expect(process.commandRuns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commandKey: "START",
          nextState: ProcessInstanceStatus.ACTIVE,
          previousState: ProcessInstanceStatus.CREATED,
        }),
      ]),
    );
  });

  test("process API is scoped, backed by persisted instances and writes fail-closed command history", async ({ request }) => {
    const denied = await request.get("/api/processes");
    const deniedBody = await denied.json();

    expect(denied.status(), JSON.stringify(deniedBody)).toBe(401);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.safety.processMutated).toBe(false);

    const cfoJwt = await jwtFor(request, "cfo.bennett@example.demo");
    const listResponse = await request.get("/api/processes", {
      headers: bearer(cfoJwt),
    });
    const listBody = await listResponse.json();

    expect(listResponse.ok(), JSON.stringify(listBody)).toBe(true);
    expect(listBody.processes).toHaveLength(84);
    expect(listBody.processes.every((process: { processId?: string }) => process.processId?.startsWith("BP-"))).toBe(true);

    const successJwt = await jwtFor(request, "lina.success@alphavest.demo");
    const createResponse = await request.post("/api/processes", {
      data: { clientTenantId: listBody.processes[0].clientTenantId, processId: "BP-024" },
      headers: bearer(successJwt),
    });
    const createdBody = await createResponse.json();

    expect(createResponse.ok(), JSON.stringify(createdBody)).toBe(true);
    expect(createdBody.detail.processId).toBe("BP-024");
    expect(createdBody.detail.commandHistory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commandKey: "START",
          nextState: ProcessInstanceStatus.ACTIVE,
        }),
      ]),
    );

    const blockedResponse = await request.post(`/api/processes/${createdBody.detail.id}/commands`, {
      data: {
        command: "BLOCK",
        reason: "Runtime proof blocks before downstream UI work.",
      },
      headers: bearer(successJwt),
    });
    const blockedBody = await blockedResponse.json();

    expect(blockedResponse.ok(), JSON.stringify(blockedBody)).toBe(true);
    expect(blockedBody.detail.status).toBe(ProcessInstanceStatus.BLOCKED);
    expect(blockedBody.auditEventId).toMatch(/^[0-9a-f-]{36}$/);
    expect(blockedBody.detail.commandHistory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commandKey: "BLOCK",
          nextState: ProcessInstanceStatus.BLOCKED,
          result: "BLOCKED",
        }),
      ]),
    );
  });
});
