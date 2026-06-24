import "dotenv/config";

import { execFileSync } from "node:child_process";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  JourneyDefinitionStatus,
  JourneyInstanceStatus,
  JourneyObjectLinkRole,
  JourneyStepStatus,
  ObjectType,
  PrismaClient,
} from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  activeJourneyDefinitions,
  assertJourneyCanStart,
  holdLockedJourneyDefinitions,
  journeyRegistryIntegrity,
} from "../lib/journeys/journey-registry";
import { buildClientJourneyProjection, buildInternalJourneyProjection } from "../lib/journeys/journey-orchestrator";
import { createJourneyRuntime, transitionJourney } from "../lib/journeys/journey-state-machine";

const manageActor = {
  permissions: ["journey.manage"],
  roleKey: "admin",
};

test.describe("Wave 0-2 Journey Orchestration and Database Spine", () => {
  let prisma: PrismaClient | undefined;

  test.beforeAll(() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for journey spine tests.");
    }

    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("registry exposes all known journeys while only Wave 0-2 accepted journeys are executable", () => {
    const integrity = journeyRegistryIntegrity();

    expect(integrity.totalDefinitions).toBe(12);
    expect(integrity.activeKeys).toEqual(integrity.sourceLockActiveKeys);
    expect(integrity.blockedKeys).toEqual(integrity.sourceLockBlockedKeys);
    expect(integrity.blockedKeys).toEqual(["MJ-004", "MJ-007"]);
    expect(integrity.deferredKeys).toEqual(["MJ-008", "MJ-009", "MJ-011"]);
    expect(activeJourneyDefinitions).toHaveLength(7);
    expect(holdLockedJourneyDefinitions.every((definition) => definition.steps.length === 0)).toBe(true);
    expect(() => assertJourneyCanStart("MJ-004")).toThrow(/blocked by Wave 0-2 source lock/);
    expect(() => assertJourneyCanStart("MJ-011")).toThrow(/not authorized for Wave 0-2 execution/);
  });

  test("state machine validates permissions, actors and no-skip transitions", () => {
    const runtime = createJourneyRuntime("MJ-001");

    expect(() =>
      transitionJourney({
        actor: {
          permissions: [],
          roleKey: "client_success",
        },
        command: "START",
        journey: runtime,
      })
    ).toThrow(/lacks journey.start/);

    const started = transitionJourney({
      actor: {
        permissions: ["journey.start"],
        roleKey: "client_success",
      },
      command: "START",
      journey: runtime,
    }).journey;

    expect(started.status).toBe("ACTIVE");
    expect(started.currentStepKey).toBe("intake.confirm_scope");

    expect(() =>
      transitionJourney({
        actor: manageActor,
        command: "COMPLETE_STEP",
        fromStepKey: "review.human_approval",
        journey: started,
      })
    ).toThrow(/Cannot transition review.human_approval before intake.confirm_scope is completed/);

    const afterIntake = transitionJourney({
      actor: {
        permissions: ["journey.complete_step"],
        roleKey: "client_success",
      },
      command: "COMPLETE_STEP",
      journey: started,
    }).journey;

    expect(afterIntake.currentStepKey).toBe("evidence.collect");
    expect(afterIntake.steps.find((step) => step.key === "intake.confirm_scope")?.status).toBe("COMPLETED");

    expect(() =>
      transitionJourney({
        actor: {
          permissions: ["journey.complete_step"],
          roleKey: "client_success",
        },
        command: "COMPLETE_STEP",
        journey: afterIntake,
      })
    ).toThrow(/expected analyst/);
  });

  test("orchestrator projections keep internal and client surfaces separated", () => {
    const started = transitionJourney({
      actor: {
        permissions: ["journey.start"],
        roleKey: "principal",
      },
      command: "START",
      journey: createJourneyRuntime("MJ-005"),
    }).journey;
    const blocked = transitionJourney({
      actor: manageActor,
      command: "BLOCK",
      fromStepKey: "intake.select_scope",
      journey: started,
      reason: "Redaction approval missing.",
    }).journey;

    const internalProjection = buildInternalJourneyProjection({
      journey: blocked,
      objectLinks: [
        {
          linkRole: "EXPORT",
          objectId: "00000000-0000-5000-8000-000000000005",
          objectType: "EXPORT_REQUEST",
          title: "Evidence package export",
        },
      ],
    });
    const clientProjection = buildClientJourneyProjection({ journey: blocked });

    expect(internalProjection.blockerReason).toBe("Redaction approval missing.");
    expect(internalProjection.objectLinks).toHaveLength(1);
    expect(internalProjection.evidenceRequirements[0]?.requiredObjectType).toBe("EVIDENCE_RECORD");
    expect(clientProjection.status).toBe("BLOCKED");
    expect(clientProjection.nextAction.detail).toContain("AlphaVest team");
    expect(clientProjection as Record<string, unknown>).not.toHaveProperty("blockerReason");
    expect(clientProjection as Record<string, unknown>).not.toHaveProperty("objectLinks");
  });

  test("seed persists definitions, accepted instances and queryable object links while hold journeys stay metadata-only", async () => {
    if (!prisma) throw new Error("Prisma client was not initialized.");

    await expect(prisma.journeyDefinition.count()).resolves.toBe(12);
    await expect(
      prisma.journeyDefinition.count({
        where: { status: JourneyDefinitionStatus.ACTIVE },
      })
    ).resolves.toBe(7);

    const holdDefinition = await prisma.journeyDefinition.findUnique({
      include: { instances: true },
      where: { journeyKey: "MJ-004" },
    });

    expect(holdDefinition?.status).toBe(JourneyDefinitionStatus.HOLD_LOCKED);
    expect(holdDefinition?.holdReason).toContain("Hold unlock was rejected");
    expect(holdDefinition?.instances).toHaveLength(0);

    const seededInstance = await prisma.journeyInstance.findFirst({
      include: {
        definition: true,
        objectLinks: true,
        steps: {
          orderBy: { sortOrder: "asc" },
        },
      },
      where: {
        definition: {
          journeyKey: "MJ-005",
        },
      },
    });

    expect(seededInstance?.status).toBe(JourneyInstanceStatus.ACTIVE);
    expect(seededInstance?.definition.status).toBe(JourneyDefinitionStatus.ACTIVE);
    expect(seededInstance?.steps[0]?.status).toBe(JourneyStepStatus.ACTIVE);
    expect(seededInstance?.steps.slice(1).every((step) => step.status === JourneyStepStatus.LOCKED)).toBe(true);
    expect(seededInstance?.objectLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          linkRole: JourneyObjectLinkRole.EXPORT,
          objectType: ObjectType.EXPORT_REQUEST,
        }),
        expect.objectContaining({
          linkRole: JourneyObjectLinkRole.SUPPORTING_EVIDENCE,
          objectType: ObjectType.EVIDENCE_RECORD,
        }),
      ])
    );
  });
});
