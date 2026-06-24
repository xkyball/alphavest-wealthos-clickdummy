import {
  AuditResult,
  EvidenceStatus,
  JourneyInstanceStatus as PrismaJourneyInstanceStatus,
  JourneyObjectLinkRole,
  JourneyStepStatus as PrismaJourneyStepStatus,
  ObjectType,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";

import type { CurrentUserContext } from "../auth/current-user";
import {
  buildClientJourneyProjection,
  buildInternalJourneyProjection,
  createJourneyStartPlan,
  type JourneyObjectLinkProjection,
} from "./journey-orchestrator";
import {
  activeJourneyDefinitions,
  assertJourneyCanStart,
  getJourneyDefinition,
  requireJourneyDefinition,
} from "./journey-registry";
import { transitionJourney, type JourneyActorContext, type JourneyRuntime } from "./journey-state-machine";
import type { JourneyCommandRequest } from "./journey-command-registry";

type JourneyInstanceWithGraph = Prisma.JourneyInstanceGetPayload<{
  include: {
    definition: true;
    objectLinks: { orderBy: { createdAt: "asc" } };
    steps: { orderBy: { sortOrder: "asc" } };
  };
}>;

const clientRoleKeys = new Set(["principal", "family_cfo", "trustee", "next_gen"]);

export class JourneyApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly reasonCode: "INVALID_REQUEST" | "PERMISSION_DENIED" | "SAFE_ERROR" | "SCOPE_DENIED",
    readonly issues: string[] = [],
  ) {
    super(message);
  }
}

export function normalizeJourneyRouteError(error: unknown, fallbackMessage: string) {
  if (error instanceof JourneyApiError) {
    return error;
  }

  if (error instanceof Error && error.message.startsWith("Auth JWT")) {
    return new JourneyApiError("Journey API requires a valid current-user session.", 401, "PERMISSION_DENIED", [
      "valid_auth_jwt_required",
    ]);
  }

  return new JourneyApiError(fallbackMessage, 500, "SAFE_ERROR");
}

function isClientRole(roleKey?: string) {
  return Boolean(roleKey && clientRoleKeys.has(roleKey));
}

function currentRoleKey(currentUser: CurrentUserContext) {
  return currentUser.role?.key;
}

function requireRole(currentUser: CurrentUserContext) {
  const roleKey = currentRoleKey(currentUser);

  if (!roleKey) {
    throw new JourneyApiError("Journey API requires an assigned role.", 403, "PERMISSION_DENIED", [
      "assigned_role_required",
    ]);
  }

  return roleKey;
}

function scopedTenantWhere(currentUser: CurrentUserContext, requestedClientTenantId?: string) {
  if (currentUser.tenant) {
    if (requestedClientTenantId && requestedClientTenantId !== currentUser.tenant.id) {
      throw new JourneyApiError("Journey scope is not available for this user.", 403, "SCOPE_DENIED", [
        "tenant_scope_denied",
      ]);
    }

    return currentUser.tenant.id;
  }

  if (!requestedClientTenantId) {
    throw new JourneyApiError("A clientTenantId is required for platform-scoped journey creation.", 400, "INVALID_REQUEST", [
      "client_tenant_id_required",
    ]);
  }

  return requestedClientTenantId;
}

async function permissionKeysForCurrentRole(prisma: PrismaClient, currentUser: CurrentUserContext) {
  const roleId = currentUser.role?.id;
  if (!roleId) return [];

  const rolePermissions = await prisma.rolePermission.findMany({
    include: {
      permission: {
        select: { key: true },
      },
    },
    where: {
      effect: "allow",
      roleId,
    },
  });

  return rolePermissions.map((rolePermission) => rolePermission.permission.key);
}

function commandPermissions(permissionKeys: string[]) {
  if (permissionKeys.includes("journeys.manage")) {
    return ["journey.manage"];
  }

  if (permissionKeys.includes("journeys.view")) {
    return ["journey.start"];
  }

  return [];
}

function objectLinksProjection(instance: JourneyInstanceWithGraph): JourneyObjectLinkProjection[] {
  return instance.objectLinks.map((link) => ({
    linkRole: link.linkRole,
    objectId: link.objectId,
    objectType: link.objectType,
    ...(link.title ? { title: link.title } : {}),
  }));
}

function runtimeFromInstance(instance: JourneyInstanceWithGraph): JourneyRuntime {
  const definition = requireJourneyDefinition(instance.definition.journeyKey);

  return {
    blockerCode: instance.blockerCode ?? undefined,
    blockerReason: instance.blockerReason ?? undefined,
    completedAt: instance.completedAt?.toISOString(),
    currentStageKey: instance.currentStageKey ?? undefined,
    currentStepKey: instance.currentStepKey ?? undefined,
    definition,
    journeyKey: instance.definition.journeyKey,
    startedAt: instance.startedAt?.toISOString(),
    status: instance.status,
    steps: instance.steps.map((step) => ({
      actorRoleKey: step.actorRoleKey ?? "",
      blockerCode: step.blockerCode ?? undefined,
      blockerReason: step.blockerReason ?? undefined,
      completedAt: step.completedAt?.toISOString(),
      key: step.stepKey,
      sortOrder: step.sortOrder,
      stageKey: step.stageKey as never,
      startedAt: step.startedAt?.toISOString(),
      status: step.status,
      title: step.title,
    })),
  };
}

async function loadScopedJourneyInstance(prisma: PrismaClient, currentUser: CurrentUserContext, journeyInstanceId: string) {
  const instance = await prisma.journeyInstance.findUnique({
    include: {
      definition: true,
      objectLinks: {
        orderBy: { createdAt: "asc" },
      },
      steps: {
        orderBy: { sortOrder: "asc" },
      },
    },
    where: { id: journeyInstanceId },
  });

  if (!instance) {
    throw new JourneyApiError("Journey was not found.", 404, "SCOPE_DENIED", ["journey_not_found"]);
  }

  if (currentUser.tenant && instance.clientTenantId !== currentUser.tenant.id) {
    throw new JourneyApiError("Journey scope is not available for this user.", 403, "SCOPE_DENIED", [
      "tenant_scope_denied",
    ]);
  }

  return instance;
}

export async function listJourneysForCurrentUser(prisma: PrismaClient, currentUser: CurrentUserContext) {
  requireRole(currentUser);

  const instances = await prisma.journeyInstance.findMany({
    include: {
      definition: true,
      objectLinks: {
        orderBy: { createdAt: "asc" },
      },
      steps: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
    where: currentUser.tenant ? { clientTenantId: currentUser.tenant.id } : undefined,
  });

  return {
    availableDefinitions: activeJourneyDefinitions.map((definition) => ({
      actorRoleKeys: definition.actorRoleKeys,
      journeyKey: definition.journeyKey,
      title: definition.title,
      wave: definition.wave,
    })),
    currentUser: {
      roleKey: currentRoleKey(currentUser),
      tenantId: currentUser.tenant?.id,
    },
    journeys: instances.map((instance) => {
      const runtime = runtimeFromInstance(instance);
      const projection = isClientRole(currentRoleKey(currentUser))
        ? buildClientJourneyProjection({ journey: runtime })
        : buildInternalJourneyProjection({ journey: runtime, objectLinks: objectLinksProjection(instance) });

      return {
        clientTenantId: instance.clientTenantId,
        id: instance.id,
        journeyKey: instance.definition.journeyKey,
        projection,
        status: instance.status,
      };
    }),
  };
}

export async function createJourneyForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  input: { clientTenantId?: string; journeyKey?: string },
) {
  requireRole(currentUser);

  if (!input.journeyKey || typeof input.journeyKey !== "string") {
    throw new JourneyApiError("Journey creation requires a valid journeyKey.", 400, "INVALID_REQUEST", [
      "journey_key_required",
    ]);
  }

  const registeredDefinition = getJourneyDefinition(input.journeyKey);
  if (!registeredDefinition || registeredDefinition.status !== "ACTIVE") {
    throw new JourneyApiError("Journey is not executable in Wave 0-2.", 403, "PERMISSION_DENIED", [
      "journey_not_executable",
    ]);
  }

  const definition = assertJourneyCanStart(input.journeyKey);
  const clientTenantId = scopedTenantWhere(currentUser, input.clientTenantId);
  const startPlan = createJourneyStartPlan(definition.journeyKey);
  const firstStep = startPlan.runtime.steps[0];

  const dbDefinition = await prisma.journeyDefinition.findUnique({
    where: { journeyKey: definition.journeyKey },
  });

  if (!dbDefinition) {
    throw new JourneyApiError("Journey definition is missing from persistence.", 500, "SAFE_ERROR", [
      "journey_definition_missing",
    ]);
  }

  const created = await prisma.$transaction(async (tx) => {
    const instance = await tx.journeyInstance.create({
      data: {
        clientTenantId,
        currentStageKey: firstStep?.stageKey ?? null,
        currentStepKey: firstStep?.key ?? null,
        definitionId: dbDefinition.id,
        metadataJson: {
          createdFromApi: true,
          noClientRelease: true,
        },
        ownerUserId: currentUser.actor.id,
        startedAt: null,
        status: PrismaJourneyInstanceStatus.CREATED,
      },
    });

    await tx.journeyStepInstance.createMany({
      data: startPlan.runtime.steps.map((step) => ({
        actorRoleKey: step.actorRoleKey,
        journeyInstanceId: instance.id,
        metadataJson: {
          clientVisible: Boolean(step.clientVisible),
          requiresAudit: Boolean(step.requiresAudit),
          requiresEvidence: Boolean(step.requiresEvidence),
        },
        sortOrder: step.sortOrder,
        stageKey: step.stageKey,
        status: step.status as PrismaJourneyStepStatus,
        stepKey: step.key,
        title: step.title,
      })),
    });

    return instance;
  });

  return getJourneyDetailForCurrentUser(prisma, currentUser, created.id);
}

export async function getJourneyDetailForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  journeyInstanceId: string,
) {
  requireRole(currentUser);

  const instance = await loadScopedJourneyInstance(prisma, currentUser, journeyInstanceId);
  const runtime = runtimeFromInstance(instance);
  const objectLinks = objectLinksProjection(instance);
  const projection = isClientRole(currentRoleKey(currentUser))
    ? buildClientJourneyProjection({ journey: runtime })
    : buildInternalJourneyProjection({ journey: runtime, objectLinks });

  return {
    clientTenantId: instance.clientTenantId,
    id: instance.id,
    journeyKey: instance.definition.journeyKey,
    projection,
    projectionType: isClientRole(currentRoleKey(currentUser)) ? "client" : "internal",
    status: instance.status,
  };
}

export async function executeJourneyCommandForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  journeyInstanceId: string,
  request: JourneyCommandRequest,
) {
  const roleKey = requireRole(currentUser);
  const roleId = currentUser.role?.id;
  if (!roleId) {
    throw new JourneyApiError("Journey command requires an assigned role.", 403, "PERMISSION_DENIED", [
      "assigned_role_required",
    ]);
  }

  const permissionKeys = await permissionKeysForCurrentRole(prisma, currentUser);
  const role = await prisma.role.findUniqueOrThrow({
    select: { platformTenantId: true },
    where: { id: roleId },
  });
  const actor: JourneyActorContext = {
    permissions: commandPermissions(permissionKeys),
    roleKey,
    userId: currentUser.actor.id,
  };
  const instance = await loadScopedJourneyInstance(prisma, currentUser, journeyInstanceId);
  const runtime = runtimeFromInstance(instance);
  const result = (() => {
    try {
      return transitionJourney({
        actor,
        command: request.command,
        fromStepKey: request.fromStepKey,
        journey: runtime,
        reason: request.reason,
        toStepKey: request.toStepKey,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Journey transition was denied.";

      if (message.includes("lacks journey.")) {
        throw new JourneyApiError("Journey command is not permitted for this role.", 403, "PERMISSION_DENIED", [
          "command_permission_denied",
        ]);
      }

      throw new JourneyApiError("Journey command failed state validation.", 400, "INVALID_REQUEST", [
        "invalid_journey_transition",
      ]);
    }
  })();

  const audit = await prisma.$transaction(async (tx) => {
    const auditEvent = await tx.auditEvent.create({
      data: {
        actorRoleKey: roleKey,
        actorUserId: currentUser.actor.id,
        clientTenantId: instance.clientTenantId,
        eventType: `journey.command.${request.command.toLowerCase()}`,
        metadataJson: {
          fromStepKey: result.fromStepKey,
          noAdviceExecution: true,
          noClientRelease: true,
          toStepKey: result.toStepKey,
        },
        nextState: result.journey.status,
        platformTenantId: role.platformTenantId,
        previousState: instance.status,
        reason: request.reason ?? "Journey command executed through scoped API.",
        result: AuditResult.SUCCESS,
        targetId: instance.id,
        targetType: ObjectType.JOURNEY,
      },
    });

    await tx.journeyInstance.update({
      data: {
        blockerCode: result.journey.blockerCode ?? null,
        blockerReason: result.journey.blockerReason ?? null,
        completedAt: result.journey.completedAt ? new Date(result.journey.completedAt) : null,
        currentStageKey: result.journey.currentStageKey ?? null,
        currentStepKey: result.journey.currentStepKey ?? null,
        startedAt: result.journey.startedAt ? new Date(result.journey.startedAt) : instance.startedAt,
        status: result.journey.status as PrismaJourneyInstanceStatus,
      },
      where: { id: instance.id },
    });

    for (const step of result.journey.steps) {
      await tx.journeyStepInstance.update({
        data: {
          blockerCode: step.blockerCode ?? null,
          blockerReason: step.blockerReason ?? null,
          completedAt: step.completedAt ? new Date(step.completedAt) : null,
          startedAt: step.startedAt ? new Date(step.startedAt) : null,
          status: step.status as PrismaJourneyStepStatus,
        },
        where: {
          journeyInstanceId_stepKey: {
            journeyInstanceId: instance.id,
            stepKey: step.key,
          },
        },
      });
    }

    await tx.journeyCommandRun.create({
      data: {
        actorRoleKey: roleKey,
        actorUserId: currentUser.actor.id,
        auditEventId: auditEvent.id,
        commandKey: request.command,
        fromStepKey: result.fromStepKey ?? null,
        journeyInstanceId: instance.id,
        metadataJson: {
          auditRequired: result.auditRequired,
          noAdviceExecution: true,
        },
        reason: request.reason ?? null,
        result: AuditResult.SUCCESS,
        toStepKey: result.toStepKey ?? null,
      },
    });

    return auditEvent;
  });

  const detail = await getJourneyDetailForCurrentUser(prisma, currentUser, journeyInstanceId);

  return {
    auditEventId: audit.id,
    command: request.command,
    detail,
    mutated: true,
    nextAction: result.nextAction,
    noAdviceExecution: true,
    noClientRelease: true,
  };
}

export async function getJourneyAuditForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  journeyInstanceId: string,
) {
  const instance = await loadScopedJourneyInstance(prisma, currentUser, journeyInstanceId);
  const runs = await prisma.journeyCommandRun.findMany({
    orderBy: { createdAt: "asc" },
    where: { journeyInstanceId: instance.id },
  });

  return {
    audit: runs.map((run) => ({
      actorRoleKey: run.actorRoleKey,
      commandKey: run.commandKey,
      createdAt: run.createdAt.toISOString(),
      fromStepKey: run.fromStepKey,
      id: run.id,
      result: run.result,
      toStepKey: run.toStepKey,
    })),
    journeyId: instance.id,
  };
}

export async function getJourneyClientProjectionForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  journeyInstanceId: string,
) {
  const instance = await loadScopedJourneyInstance(prisma, currentUser, journeyInstanceId);

  return {
    journeyId: instance.id,
    projection: buildClientJourneyProjection({ journey: runtimeFromInstance(instance) }),
  };
}

export async function getJourneyEvidenceSufficiencyForCurrentUser(
  prisma: PrismaClient,
  currentUser: CurrentUserContext,
  journeyInstanceId: string,
) {
  const instance = await loadScopedJourneyInstance(prisma, currentUser, journeyInstanceId);
  const definition = requireJourneyDefinition(instance.definition.journeyKey);
  const requiredTypes = new Set(definition.evidenceRequirements.map((requirement) => requirement.requiredObjectType));
  const linkedEvidenceIds = instance.objectLinks
    .filter((link) => requiredTypes.has(link.objectType as never))
    .map((link) => link.objectId);
  const records =
    linkedEvidenceIds.length > 0
      ? await prisma.evidenceRecord.findMany({
          where: { id: { in: linkedEvidenceIds } },
        })
      : [];
  const statusRank: Record<EvidenceStatus, number> = {
    ARCHIVED: 0,
    PLACEHOLDER: 0,
    SUPERSEDED: 0,
    CREATED: 1,
    LINKED: 2,
    VALIDATED: 3,
    RELEASED: 4,
    RESTRICTED: 0,
  };

  const requirements = definition.evidenceRequirements.map((requirement) => {
    const linkedRecord = records.find((record) => record.status && requirement.requiredObjectType === "EVIDENCE_RECORD");
    const minimum = requirement.minEvidenceStatus;

    return {
      key: requirement.key,
      linkedObjectType: requirement.requiredObjectType,
      met: Boolean(
        linkedRecord &&
          minimum &&
          statusRank[linkedRecord.status] >= statusRank[minimum as EvidenceStatus] &&
          linkedRecord.visibilityStatus !== "RESTRICTED",
      ),
      minEvidenceStatus: minimum,
      requiredForStepKey: requirement.requiredForStepKey,
      title: requirement.title,
    };
  });

  return {
    evidenceSufficient: requirements.length > 0 && requirements.every((requirement) => requirement.met),
    journeyId: instance.id,
    requirements,
    safety: {
      noClientRelease: true,
      uploadIsNotSufficiency: true,
    },
  };
}

export function journeyObjectLinkRoleForDefinition(journeyKey: string) {
  return journeyKey === "MJ-005" ? JourneyObjectLinkRole.EXPORT : JourneyObjectLinkRole.PRIMARY_CONTEXT;
}
