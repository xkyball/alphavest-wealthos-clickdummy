import {
  AuditResult,
  ComplianceStatus,
  EvidenceSufficiencyDecisionStatus,
  EvidenceStatus,
  JourneyInstanceStatus as PrismaJourneyInstanceStatus,
  JourneyObjectLinkRole,
  JourneyStepStatus as PrismaJourneyStepStatus,
  ObjectType,
  type Prisma,
  type PrismaClient,
  RecommendationStatus,
  ReviewStatus,
} from "@prisma/client";

import type { CurrentUserContext } from "../auth/current-user";
import { dataQualityService } from "../data-quality-service";
import { workflowGate } from "../workflow-gate";
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
import { transitionJourney, type JourneyActorContext, type JourneyCommandKey, type JourneyRuntime } from "./journey-state-machine";
import type { JourneyCommandRequest } from "./journey-command-registry";

type JourneyInstanceWithGraph = Prisma.JourneyInstanceGetPayload<{
  include: {
    definition: true;
    objectLinks: { orderBy: { createdAt: "asc" } };
    steps: { orderBy: { sortOrder: "asc" } };
  };
}>;

const clientRoleKeys = new Set(["principal", "family_cfo", "trustee", "next_gen"]);
const genericJourneyCommands = new Set(["START", "COMPLETE_STEP", "BLOCK", "RESUME", "CANCEL"]);
const adminBypassRoleKeys = new Set(["admin", "security_officer"]);
const releaseConfirmationPhrase = "RELEASE CLIENT-SAFE JOURNEY";
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

function requireJourneyManagePermission(permissionKeys: string[]) {
  if (!permissionKeys.includes("journeys.manage")) {
    throw new JourneyApiError("Journey command is not permitted for this role.", 403, "PERMISSION_DENIED", [
      "command_permission_denied",
    ]);
  }
}

function requireOperationalRole(roleKey: string, command: string, allowedRoleKeys: string[]) {
  if (adminBypassRoleKeys.has(roleKey)) {
    throw new JourneyApiError("Admin and security roles cannot bypass journey gates.", 403, "PERMISSION_DENIED", [
      "admin_non_bypass",
      `${command.toLowerCase()}_requires_operational_role`,
    ]);
  }

  if (!allowedRoleKeys.includes(roleKey)) {
    throw new JourneyApiError("Journey gate command is not permitted for this role.", 403, "PERMISSION_DENIED", [
      "gate_role_denied",
      `${command.toLowerCase()}_requires_${allowedRoleKeys.join("_or_")}`,
    ]);
  }
}

function metadataObject(value: Prisma.JsonValue | null | undefined): Prisma.JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Prisma.JsonObject) : {};
}

function withCoreGateMetadata(
  metadataJson: Prisma.JsonValue | null | undefined,
  patch: Prisma.InputJsonObject,
): Prisma.InputJsonObject {
  const base = metadataObject(metadataJson);
  const existingCore = metadataObject(base.coreJourneyGates as Prisma.JsonValue | undefined);

  return {
    ...base,
    coreJourneyGates: {
      ...existingCore,
      ...patch,
    },
  };
}

async function loadEvidenceRequirement(
  prisma: PrismaClient | Prisma.TransactionClient,
  instance: JourneyInstanceWithGraph,
  requirementKey: string,
) {
  const requirement = await prisma.journeyEvidenceRequirement.findUnique({
    where: {
      journeyDefinitionId_requirementKey: {
        journeyDefinitionId: instance.definitionId,
        requirementKey,
      },
    },
  });

  if (!requirement) {
    throw new JourneyApiError("Evidence requirement is not available for this journey.", 400, "INVALID_REQUEST", [
      "journey_evidence_requirement_not_found",
    ]);
  }

  return requirement;
}

async function loadScopedEvidenceRecord(
  prisma: PrismaClient | Prisma.TransactionClient,
  instance: JourneyInstanceWithGraph,
  evidenceRecordId: string,
) {
  const evidence = await prisma.evidenceRecord.findUnique({
    where: { id: evidenceRecordId },
  });

  if (!evidence || evidence.clientTenantId !== instance.clientTenantId) {
    throw new JourneyApiError("Evidence is not available in this journey scope.", 403, "SCOPE_DENIED", [
      "evidence_scope_denied",
    ]);
  }

  return evidence;
}

async function createJourneyAuditAndRun(
  tx: Prisma.TransactionClient,
  input: {
    command: JourneyCommandRequest["command"];
    currentUser: CurrentUserContext;
    eventType: string;
    evidenceRecordId?: string | null;
    fromStepKey?: string | null;
    instance: JourneyInstanceWithGraph;
    metadataJson?: Prisma.InputJsonObject;
    nextState?: string | null;
    platformTenantId: string;
    previousState?: string | null;
    reason?: string | null;
    result: AuditResult;
    roleKey: string;
    toStepKey?: string | null;
  },
) {
  const auditEvent = await tx.auditEvent.create({
    data: {
      actorRoleKey: input.roleKey,
      actorUserId: input.currentUser.actor.id,
      clientTenantId: input.instance.clientTenantId,
      eventType: input.eventType,
      evidenceRecordId: input.evidenceRecordId ?? null,
      metadataJson: {
        noAdviceExecution: true,
        noAutonomousAdvice: true,
        noClientRelease: input.command === "COMPLIANCE_RELEASE" && input.result === AuditResult.SUCCESS ? false : true,
        ...(input.metadataJson ?? {}),
      },
      nextState: input.nextState ?? null,
      platformTenantId: input.platformTenantId,
      previousState: input.previousState ?? input.instance.status,
      reason: input.reason ?? "Journey command executed through scoped API.",
      result: input.result,
      targetId: input.instance.id,
      targetType: ObjectType.JOURNEY,
    },
  });

  await tx.journeyCommandRun.create({
    data: {
      actorRoleKey: input.roleKey,
      actorUserId: input.currentUser.actor.id,
      auditEventId: auditEvent.id,
      commandKey: input.command,
      fromStepKey: input.fromStepKey ?? null,
      journeyInstanceId: input.instance.id,
      metadataJson: {
        noAdviceExecution: true,
        ...(input.metadataJson ?? {}),
      },
      reason: input.reason ?? null,
      result: input.result,
      toStepKey: input.toStepKey ?? null,
    },
  });

  return auditEvent;
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

async function linkedRecommendation(prisma: PrismaClient | Prisma.TransactionClient, instance: JourneyInstanceWithGraph) {
  const link = await prisma.journeyObjectLink.findFirst({
    where: {
      journeyInstanceId: instance.id,
      linkRole: JourneyObjectLinkRole.RECOMMENDATION,
      objectType: ObjectType.RECOMMENDATION,
    },
  });

  if (!link) return null;

  return prisma.recommendation.findUnique({
    where: { id: link.objectId },
  });
}

async function latestSufficiencyDecisions(prisma: PrismaClient | Prisma.TransactionClient, instance: JourneyInstanceWithGraph) {
  const decisions = await prisma.evidenceSufficiencyDecision.findMany({
    orderBy: { createdAt: "desc" },
    where: { journeyInstanceId: instance.id },
  });
  const byRequirement = new Map<string, (typeof decisions)[number]>();

  for (const decision of decisions) {
    if (!byRequirement.has(decision.requirementKey)) {
      byRequirement.set(decision.requirementKey, decision);
    }
  }

  return byRequirement;
}

async function journeyDataQualityReleaseGate(
  prisma: Pick<PrismaClient, "dataQualityIssue">,
  instance: JourneyInstanceWithGraph,
) {
  const snapshot = await dataQualityService.buildDataQualitySnapshot(prisma, {
    clientTenantId: instance.clientTenantId,
    targetId: instance.id,
    targetType: ObjectType.JOURNEY,
  });

  return {
    gate: dataQualityService.evaluateDataQualityReleaseGate(snapshot),
    snapshot,
  };
}

async function executeLinkEvidenceCommand(input: {
  currentUser: CurrentUserContext;
  instance: JourneyInstanceWithGraph;
  platformTenantId: string;
  prisma: PrismaClient;
  request: JourneyCommandRequest;
  roleKey: string;
}) {
  if (!input.request.requirementKey || !input.request.evidenceRecordId) {
    throw new JourneyApiError("Link evidence requires a requirement key and evidence record.", 400, "INVALID_REQUEST", [
      "requirement_key_required",
      "evidence_record_id_required",
    ]);
  }

  requireOperationalRole(input.roleKey, input.request.command, [
    "analyst",
    "client_success",
    "compliance_officer",
    "senior_wealth_advisor",
  ]);

  const audit = await input.prisma.$transaction(async (tx) => {
    const requirement = await loadEvidenceRequirement(tx, input.instance, input.request.requirementKey!);
    const evidence = await loadScopedEvidenceRecord(tx, input.instance, input.request.evidenceRecordId!);

    if (requirement.requiredObjectType !== ObjectType.EVIDENCE_RECORD) {
      throw new JourneyApiError("Journey requirement does not accept evidence records.", 400, "INVALID_REQUEST", [
        "requirement_object_type_mismatch",
      ]);
    }

    const existingLink = await tx.journeyObjectLink.findFirst({
      where: {
        journeyInstanceId: input.instance.id,
        linkRole: JourneyObjectLinkRole.SUPPORTING_EVIDENCE,
        objectId: evidence.id,
        objectType: ObjectType.EVIDENCE_RECORD,
      },
    });

    if (!existingLink) {
      await tx.journeyObjectLink.create({
        data: {
          journeyInstanceId: input.instance.id,
          linkRole: JourneyObjectLinkRole.SUPPORTING_EVIDENCE,
          metadataJson: {
            requirementKey: requirement.requirementKey,
            uploadIsNotSufficiency: true,
          },
          objectId: evidence.id,
          objectType: ObjectType.EVIDENCE_RECORD,
          title: evidence.title,
        },
      });
    }

    if (evidence.status === EvidenceStatus.CREATED || evidence.status === EvidenceStatus.PLACEHOLDER) {
      await tx.evidenceRecord.update({
        data: { status: EvidenceStatus.LINKED },
        where: { id: evidence.id },
      });
    }

    return createJourneyAuditAndRun(tx, {
      command: input.request.command,
      currentUser: input.currentUser,
      eventType: "journey.evidence.linked",
      evidenceRecordId: evidence.id,
      instance: input.instance,
      metadataJson: {
        linkCreated: !existingLink,
        requirementKey: requirement.requirementKey,
        uploadIsNotSufficiency: true,
      },
      nextState: input.instance.status,
      platformTenantId: input.platformTenantId,
      reason: input.request.reason ?? "Evidence linked to journey requirement.",
      result: AuditResult.SUCCESS,
      roleKey: input.roleKey,
    });
  });

  return {
    auditEventId: audit.id,
    command: input.request.command,
    detail: await getJourneyDetailForCurrentUser(input.prisma, input.currentUser, input.instance.id),
    mutated: true,
    noAdviceExecution: true,
    noClientRelease: true,
  };
}

async function executeEvidenceSufficiencyDecisionCommand(input: {
  currentUser: CurrentUserContext;
  instance: JourneyInstanceWithGraph;
  platformTenantId: string;
  prisma: PrismaClient;
  request: JourneyCommandRequest;
  roleKey: string;
}) {
  if (!input.request.requirementKey || !input.request.evidenceRecordId || !input.request.decision || !input.request.reason) {
    throw new JourneyApiError("Evidence sufficiency requires evidence, requirement, decision and reason.", 400, "INVALID_REQUEST", [
      "evidence_sufficiency_payload_required",
    ]);
  }

  const sufficiencyDecision = input.request.decision;
  const decisionReason = input.request.reason;

  requireOperationalRole(input.roleKey, input.request.command, ["analyst", "compliance_officer"]);

  const audit = await input.prisma.$transaction(async (tx) => {
    const requirement = await loadEvidenceRequirement(tx, input.instance, input.request.requirementKey!);
    const evidence = await loadScopedEvidenceRecord(tx, input.instance, input.request.evidenceRecordId!);
    const linked = await tx.journeyObjectLink.findFirst({
      where: {
        journeyInstanceId: input.instance.id,
        linkRole: JourneyObjectLinkRole.SUPPORTING_EVIDENCE,
        objectId: evidence.id,
        objectType: ObjectType.EVIDENCE_RECORD,
      },
    });
    const minimum = requirement.minEvidenceStatus ?? EvidenceStatus.VALIDATED;
    const reviewed = input.request.reviewed === true;
    const scopeMatches = input.request.scopeMatches === true;
    const relevanceConfirmed = input.request.relevanceConfirmed === true;
    const currentnessConfirmed = input.request.currentnessConfirmed === true;
    const sufficientStatus = statusRank[evidence.status] >= statusRank[minimum];
    const clientSafeVisibility =
      evidence.visibilityStatus !== "INTERNAL_ONLY" && evidence.visibilityStatus !== "RESTRICTED";
    const preconditionMissing = [
      ...(!linked ? ["evidence_requirement_link"] : []),
      ...(!reviewed ? ["evidence_review"] : []),
      ...(!scopeMatches ? ["evidence_scope"] : []),
      ...(!relevanceConfirmed ? ["evidence_relevance"] : []),
      ...(!currentnessConfirmed ? ["evidence_current"] : []),
      ...(!sufficientStatus ? ["evidence_status"] : []),
      ...(!clientSafeVisibility ? ["client_safe_visibility"] : []),
    ];

    if (sufficiencyDecision === "SUFFICIENT" && preconditionMissing.length > 0) {
      throw new JourneyApiError("Evidence cannot be marked sufficient before scoped review passes.", 400, "INVALID_REQUEST", [
        "evidence_review_preconditions_failed",
        ...preconditionMissing,
      ]);
    }

    const auditEvent = await createJourneyAuditAndRun(tx, {
      command: input.request.command,
      currentUser: input.currentUser,
      eventType: `journey.evidence_sufficiency.${sufficiencyDecision.toLowerCase()}`,
      evidenceRecordId: evidence.id,
      instance: input.instance,
      metadataJson: {
        currentnessConfirmed,
        decision: sufficiencyDecision,
        preconditionMissing,
        relevanceConfirmed,
        requirementKey: requirement.requirementKey,
        reviewed,
        scopeMatches,
        uploadIsNotSufficiency: true,
      },
      nextState: input.instance.status,
      platformTenantId: input.platformTenantId,
      reason: decisionReason,
      result: AuditResult.SUCCESS,
      roleKey: input.roleKey,
    });

    await tx.evidenceSufficiencyDecision.create({
      data: {
        auditEventId: auditEvent.id,
        clientTenantId: input.instance.clientTenantId,
        currentnessConfirmed,
        decidedByRoleKey: input.roleKey,
        decidedByUserId: input.currentUser.actor.id,
        decision:
          sufficiencyDecision === "SUFFICIENT"
            ? EvidenceSufficiencyDecisionStatus.SUFFICIENT
            : EvidenceSufficiencyDecisionStatus.INSUFFICIENT,
        evidenceRecordId: evidence.id,
        journeyInstanceId: input.instance.id,
        metadataJson: {
          minEvidenceStatus: minimum,
          preconditionMissing,
          uploadIsNotSufficiency: true,
        },
        reason: decisionReason,
        relevanceConfirmed,
        requirementKey: requirement.requirementKey,
        reviewed,
        scopeMatches,
      },
    });

    return auditEvent;
  });

  return {
    auditEventId: audit.id,
    command: input.request.command,
    detail: await getJourneyDetailForCurrentUser(input.prisma, input.currentUser, input.instance.id),
    mutated: true,
    noAdviceExecution: true,
    noClientRelease: true,
  };
}

async function executeAiDraftInternalCommand(input: {
  currentUser: CurrentUserContext;
  instance: JourneyInstanceWithGraph;
  platformTenantId: string;
  prisma: PrismaClient;
  request: JourneyCommandRequest;
  roleKey: string;
}) {
  requireOperationalRole(input.roleKey, input.request.command, ["analyst"]);

  const audit = await input.prisma.$transaction(async (tx) => {
    await tx.journeyInstance.update({
      data: {
        metadataJson: withCoreGateMetadata(input.instance.metadataJson, {
          aiDraftInternalOnly: true,
          aiDraftRecordedAt: new Date().toISOString(),
          clientVisible: false,
          noClientRelease: true,
        }),
      },
      where: { id: input.instance.id },
    });

    return createJourneyAuditAndRun(tx, {
      command: input.request.command,
      currentUser: input.currentUser,
      eventType: "journey.ai_draft.internal_only",
      instance: input.instance,
      metadataJson: {
        aiDraftInternalOnly: true,
        clientVisible: false,
        noClientRelease: true,
      },
      nextState: input.instance.status,
      platformTenantId: input.platformTenantId,
      reason: input.request.reason ?? "Internal AI/rules draft recorded without client visibility.",
      result: AuditResult.SUCCESS,
      roleKey: input.roleKey,
    });
  });

  return {
    auditEventId: audit.id,
    command: input.request.command,
    detail: await getJourneyDetailForCurrentUser(input.prisma, input.currentUser, input.instance.id),
    mutated: true,
    noAdviceExecution: true,
    noClientRelease: true,
  };
}

async function executeAdvisorApprovalCommand(input: {
  currentUser: CurrentUserContext;
  instance: JourneyInstanceWithGraph;
  platformTenantId: string;
  prisma: PrismaClient;
  request: JourneyCommandRequest;
  roleKey: string;
}) {
  if (!input.request.reason) {
    throw new JourneyApiError("Advisor approval requires a reason.", 400, "INVALID_REQUEST", ["gate_reason_required"]);
  }

  requireOperationalRole(input.roleKey, input.request.command, ["senior_wealth_advisor"]);

  const audit = await input.prisma.$transaction(async (tx) => {
    const recommendation = await linkedRecommendation(tx, input.instance);

    if (recommendation) {
      await tx.approval.create({
        data: {
          approvalType: "JOURNEY_ADVISOR_APPROVAL",
          approvedAt: new Date(),
          approverRoleKey: input.roleKey,
          approverUserId: input.currentUser.actor.id,
          clientTenantId: input.instance.clientTenantId,
          notes: input.request.reason,
          status: ReviewStatus.APPROVED,
          targetId: recommendation.id,
          targetType: ObjectType.RECOMMENDATION,
        },
      });

      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.ADVISOR_APPROVED,
        },
        where: { id: recommendation.id },
      });
    }

    await tx.journeyInstance.update({
      data: {
        metadataJson: withCoreGateMetadata(input.instance.metadataJson, {
          advisorApproved: true,
          advisorApprovedAt: new Date().toISOString(),
          advisorApprovalIsNotRelease: true,
          clientVisible: false,
          noClientRelease: true,
        }),
      },
      where: { id: input.instance.id },
    });

    return createJourneyAuditAndRun(tx, {
      command: input.request.command,
      currentUser: input.currentUser,
      eventType: "journey.advisor.approved",
      instance: input.instance,
      metadataJson: {
        advisorApprovalIsNotRelease: true,
        recommendationId: recommendation?.id ?? null,
      },
      nextState: input.instance.status,
      platformTenantId: input.platformTenantId,
      reason: input.request.reason,
      result: AuditResult.SUCCESS,
      roleKey: input.roleKey,
    });
  });

  return {
    auditEventId: audit.id,
    command: input.request.command,
    detail: await getJourneyDetailForCurrentUser(input.prisma, input.currentUser, input.instance.id),
    mutated: true,
    noAdviceExecution: true,
    noClientRelease: true,
  };
}

async function executeComplianceBlockCommand(input: {
  currentUser: CurrentUserContext;
  instance: JourneyInstanceWithGraph;
  platformTenantId: string;
  prisma: PrismaClient;
  request: JourneyCommandRequest;
  roleKey: string;
}) {
  if (!input.request.reason) {
    throw new JourneyApiError("Compliance gate command requires a reason.", 400, "INVALID_REQUEST", ["gate_reason_required"]);
  }

  requireOperationalRole(input.roleKey, input.request.command, ["compliance_officer"]);

  const isEvidenceRequest = input.request.command === "COMPLIANCE_REQUEST_EVIDENCE";
  const blockerCode = isEvidenceRequest ? "COMPLIANCE_EVIDENCE_REQUESTED" : "COMPLIANCE_BLOCKED";
  const audit = await input.prisma.$transaction(async (tx) => {
    const recommendation = await linkedRecommendation(tx, input.instance);

    if (recommendation) {
      const existingReview = await tx.complianceReview.findFirst({
        where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
      });
      const reviewData = {
        blockedAt: new Date(),
        evidenceComplete: false,
        releaseNotes: input.request.reason,
        reviewerUserId: input.currentUser.actor.id,
        status: isEvidenceRequest ? ComplianceStatus.NEEDS_EVIDENCE : ComplianceStatus.BLOCKED,
      };

      if (existingReview) {
        await tx.complianceReview.update({ data: reviewData, where: { id: existingReview.id } });
      } else {
        await tx.complianceReview.create({
          data: {
            ...reviewData,
            adviceClassification: recommendation.adviceClassification,
            clientTenantId: input.instance.clientTenantId,
            targetId: recommendation.id,
            targetType: ObjectType.RECOMMENDATION,
          },
        });
      }

      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: isEvidenceRequest ? RecommendationStatus.MORE_DATA_REQUESTED : RecommendationStatus.BLOCKED,
        },
        where: { id: recommendation.id },
      });
    }

    await tx.journeyInstance.update({
      data: {
        blockerCode,
        blockerReason: input.request.reason,
        metadataJson: withCoreGateMetadata(input.instance.metadataJson, {
          clientVisible: false,
          complianceBlocked: !isEvidenceRequest,
          complianceEvidenceRequested: isEvidenceRequest,
          noClientRelease: true,
        }),
        status: PrismaJourneyInstanceStatus.BLOCKED,
      },
      where: { id: input.instance.id },
    });

    if (input.instance.currentStepKey) {
      await tx.journeyStepInstance.update({
        data: {
          blockerCode,
          blockerReason: input.request.reason,
          status: PrismaJourneyStepStatus.BLOCKED,
        },
        where: {
          journeyInstanceId_stepKey: {
            journeyInstanceId: input.instance.id,
            stepKey: input.instance.currentStepKey,
          },
        },
      });
    }

    return createJourneyAuditAndRun(tx, {
      command: input.request.command,
      currentUser: input.currentUser,
      eventType: isEvidenceRequest ? "journey.compliance.evidence_requested" : "journey.compliance.blocked",
      instance: input.instance,
      metadataJson: {
        blockerCode,
        clientVisible: false,
        recommendationId: recommendation?.id ?? null,
      },
      nextState: PrismaJourneyInstanceStatus.BLOCKED,
      platformTenantId: input.platformTenantId,
      reason: input.request.reason,
      result: AuditResult.BLOCKED,
      roleKey: input.roleKey,
    });
  });

  return {
    auditEventId: audit.id,
    command: input.request.command,
    detail: await getJourneyDetailForCurrentUser(input.prisma, input.currentUser, input.instance.id),
    mutated: true,
    noAdviceExecution: true,
    noClientRelease: true,
  };
}

async function executeComplianceReleaseCommand(input: {
  currentUser: CurrentUserContext;
  instance: JourneyInstanceWithGraph;
  platformTenantId: string;
  prisma: PrismaClient;
  request: JourneyCommandRequest;
  roleKey: string;
}) {
  if (!input.request.reason) {
    throw new JourneyApiError("Compliance release requires a reason.", 400, "INVALID_REQUEST", ["gate_reason_required"]);
  }

  requireOperationalRole(input.roleKey, input.request.command, ["compliance_officer"]);

  const audit = await input.prisma.$transaction(async (tx) => {
    const recommendation = await linkedRecommendation(tx, input.instance);
    const metadata = metadataObject(input.instance.metadataJson);
    const coreMetadata = metadataObject(metadata.coreJourneyGates as Prisma.JsonValue | undefined);
    const decisions = await latestSufficiencyDecisions(tx, input.instance);
    const dataQuality = await journeyDataQualityReleaseGate(tx, input.instance);
    const definition = requireJourneyDefinition(input.instance.definition.journeyKey);
    const missingEvidence = definition.evidenceRequirements.flatMap((requirement) => {
      const decision = decisions.get(requirement.key);

      if (
        decision?.decision === EvidenceSufficiencyDecisionStatus.SUFFICIENT &&
        decision.reviewed &&
        decision.scopeMatches &&
        decision.relevanceConfirmed &&
        decision.currentnessConfirmed &&
        decision.auditEventId
      ) {
        return [];
      }

      return [`evidence_sufficiency:${requirement.key}`];
    });
    const releaseStepIsCurrent =
      input.instance.currentStageKey === "release" ||
      input.instance.steps.some(
        (step) => step.stageKey === "release" && step.stepKey === input.instance.currentStepKey && step.status === "ACTIVE",
      );
    const advisorApprovalRun = await tx.journeyCommandRun.findFirst({
      where: {
        commandKey: "ADVISOR_APPROVE",
        journeyInstanceId: input.instance.id,
        result: AuditResult.SUCCESS,
      },
    });
    const advisorApproved = coreMetadata.advisorApproved === true && Boolean(advisorApprovalRun);
    const payloadReady = Boolean(input.request.clientSafeSummary?.trim());
    const confirmationMatches = input.request.confirmationPhrase === releaseConfirmationPhrase;
    const releaseGate = workflowGate.canPassComplianceReleaseGate({
      advisorApprovalStatus: advisorApproved ? ReviewStatus.APPROVED : ReviewStatus.PENDING,
      auditPersistenceAvailable: Boolean(advisorApprovalRun) && missingEvidence.length === 0,
      compliancePermission: { allowed: confirmationMatches, reasonCode: confirmationMatches ? "allowed" : "release_confirmation_required" },
      dataQualityGate: dataQuality.gate,
      evidenceDecision: {
        exportImpact: missingEvidence.length === 0 ? "EXPORT_ALLOWED_FOR_SCOPED_GATE" : "EXPORT_BLOCKED_NEEDS_EVIDENCE",
        label: missingEvidence.length === 0 ? "EVIDENCE_SUFFICIENT" : "EVIDENCE_INSUFFICIENT",
        missing: missingEvidence,
        releaseImpact: missingEvidence.length === 0 ? "RELEASE_ALLOWED_FOR_SCOPED_GATE" : "RELEASE_BLOCKED_NEEDS_EVIDENCE",
        sufficient: missingEvidence.length === 0,
      },
      payloadReady,
    });
    const missing = [
      ...releaseGate.missing,
      ...(!releaseStepIsCurrent ? ["journey_release_step_current"] : []),
      ...(!confirmationMatches ? ["release_confirmation_phrase"] : []),
    ];

    if (missing.length > 0) {
      const deniedAudit = await createJourneyAuditAndRun(tx, {
        command: input.request.command,
        currentUser: input.currentUser,
        eventType: "journey.compliance.release_denied",
        instance: input.instance,
        metadataJson: {
          clientVisible: false,
          dataQualityHighSeverityOpenCount: dataQuality.snapshot.highSeverityOpenCount,
          dataQualityMissing: dataQuality.gate.missing,
          expectedConfirmationPhrase: releaseConfirmationPhrase,
          missing: [...new Set(missing)],
          recommendationId: recommendation?.id ?? null,
        },
        nextState: input.instance.status,
        platformTenantId: input.platformTenantId,
        reason: input.request.reason,
        result: AuditResult.DENIED,
        roleKey: input.roleKey,
      });

      throw new JourneyApiError("Compliance release preconditions failed.", 400, "INVALID_REQUEST", [
        "release_preconditions_failed",
        deniedAudit.id,
        ...new Set(missing),
      ]);
    }

    if (recommendation) {
      const existingReview = await tx.complianceReview.findFirst({
        where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
      });
      const reviewData = {
        blockedAt: null,
        evidenceComplete: true,
        releaseNotes: input.request.reason,
        releasedAt: new Date(),
        reviewerUserId: input.currentUser.actor.id,
        status: ComplianceStatus.RELEASED,
      };

      if (existingReview) {
        await tx.complianceReview.update({ data: reviewData, where: { id: existingReview.id } });
      } else {
        await tx.complianceReview.create({
          data: {
            ...reviewData,
            adviceClassification: recommendation.adviceClassification,
            clientTenantId: input.instance.clientTenantId,
            targetId: recommendation.id,
            targetType: ObjectType.RECOMMENDATION,
          },
        });
      }

      await tx.recommendation.update({
        data: {
          clientSummaryDraft: input.request.clientSafeSummary,
          clientVisible: true,
          status: RecommendationStatus.RELEASED_TO_CLIENT,
        },
        where: { id: recommendation.id },
      });
    }

    const linkedDecision = await tx.journeyObjectLink.findFirst({
      where: {
        journeyInstanceId: input.instance.id,
        linkRole: JourneyObjectLinkRole.DECISION,
        objectType: ObjectType.DECISION,
      },
    });

    if (linkedDecision) {
      await tx.decision.update({
        data: {
          releasedToClientAt: new Date(),
          status: "RELEASED_TO_CLIENT",
        },
        where: { id: linkedDecision.objectId },
      });
    }

    await tx.journeyInstance.update({
      data: {
        blockerCode: null,
        blockerReason: null,
        completedAt: new Date(),
        currentStageKey: null,
        currentStepKey: null,
        metadataJson: withCoreGateMetadata(input.instance.metadataJson, {
          clientSafeSummary: input.request.clientSafeSummary,
          clientVisible: true,
          complianceReleased: true,
          complianceReleasedAt: new Date().toISOString(),
          releaseConfirmationPhrase,
        }),
        status: PrismaJourneyInstanceStatus.COMPLETED,
      },
      where: { id: input.instance.id },
    });

    await tx.journeyStepInstance.updateMany({
      data: {
        completedAt: new Date(),
        status: PrismaJourneyStepStatus.COMPLETED,
      },
      where: {
        journeyInstanceId: input.instance.id,
        stageKey: "release",
      },
    });

    return createJourneyAuditAndRun(tx, {
      command: input.request.command,
      currentUser: input.currentUser,
      eventType: "journey.compliance.released",
      instance: input.instance,
      metadataJson: {
        clientVisible: true,
        dataQualityHighSeverityOpenCount: dataQuality.snapshot.highSeverityOpenCount,
        gatePassed: true,
        recommendationId: recommendation?.id ?? null,
      },
      nextState: PrismaJourneyInstanceStatus.COMPLETED,
      platformTenantId: input.platformTenantId,
      reason: input.request.reason,
      result: AuditResult.SUCCESS,
      roleKey: input.roleKey,
    });
  });

  return {
    auditEventId: audit.id,
    command: input.request.command,
    detail: await getJourneyDetailForCurrentUser(input.prisma, input.currentUser, input.instance.id),
    mutated: true,
    noAdviceExecution: true,
    noClientRelease: false,
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

  if (request.command === "LINK_EVIDENCE") {
    requireJourneyManagePermission(permissionKeys);
    return executeLinkEvidenceCommand({ currentUser, instance, platformTenantId: role.platformTenantId, prisma, request, roleKey });
  }

  if (request.command === "DECIDE_EVIDENCE_SUFFICIENCY") {
    requireJourneyManagePermission(permissionKeys);
    return executeEvidenceSufficiencyDecisionCommand({
      currentUser,
      instance,
      platformTenantId: role.platformTenantId,
      prisma,
      request,
      roleKey,
    });
  }

  if (request.command === "AI_DRAFT_INTERNAL") {
    requireJourneyManagePermission(permissionKeys);
    return executeAiDraftInternalCommand({ currentUser, instance, platformTenantId: role.platformTenantId, prisma, request, roleKey });
  }

  if (request.command === "ADVISOR_APPROVE") {
    requireJourneyManagePermission(permissionKeys);
    return executeAdvisorApprovalCommand({ currentUser, instance, platformTenantId: role.platformTenantId, prisma, request, roleKey });
  }

  if (request.command === "COMPLIANCE_BLOCK" || request.command === "COMPLIANCE_REQUEST_EVIDENCE") {
    requireJourneyManagePermission(permissionKeys);
    return executeComplianceBlockCommand({ currentUser, instance, platformTenantId: role.platformTenantId, prisma, request, roleKey });
  }

  if (request.command === "COMPLIANCE_RELEASE") {
    requireJourneyManagePermission(permissionKeys);
    return executeComplianceReleaseCommand({ currentUser, instance, platformTenantId: role.platformTenantId, prisma, request, roleKey });
  }

  if (!genericJourneyCommands.has(request.command)) {
    throw new JourneyApiError("Journey command handler is not implemented.", 400, "INVALID_REQUEST", [
      "journey_command_handler_missing",
    ]);
  }

  const runtime = runtimeFromInstance(instance);
  const result = (() => {
    try {
      return transitionJourney({
        actor,
        command: request.command as JourneyCommandKey,
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
  const dataQuality = await journeyDataQualityReleaseGate(prisma, instance);
  const projection = buildClientJourneyProjection({ journey: runtimeFromInstance(instance) });

  if (!dataQuality.gate.passed) {
    return {
      dataQuality: {
        gateName: dataQuality.gate.gateName,
        highSeverityOpenCount: dataQuality.snapshot.highSeverityOpenCount,
        missing: dataQuality.gate.missing,
        releaseReady: false,
      },
      journeyId: instance.id,
      projection: {
        ...projection,
        nextAction: {
          detail: "Data-quality review blocks client-visible projection until high-severity issues are resolved.",
          type: "BLOCKED" as const,
        },
        status: "BLOCKED" as const,
      },
    };
  }

  return {
    dataQuality: {
      gateName: dataQuality.gate.gateName,
      highSeverityOpenCount: dataQuality.snapshot.highSeverityOpenCount,
      missing: dataQuality.gate.missing,
      releaseReady: true,
    },
    journeyId: instance.id,
    projection,
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
  const decisions = await latestSufficiencyDecisions(prisma, instance);

  const requirements = definition.evidenceRequirements.map((requirement) => {
    const linkedRecord = records.find((record) => record.status && requirement.requiredObjectType === "EVIDENCE_RECORD");
    const minimum = requirement.minEvidenceStatus;
    const latestDecision = decisions.get(requirement.key);
    const decisionIsSufficient =
      latestDecision?.decision === EvidenceSufficiencyDecisionStatus.SUFFICIENT &&
      latestDecision.reviewed &&
      latestDecision.scopeMatches &&
      latestDecision.relevanceConfirmed &&
      latestDecision.currentnessConfirmed;

    return {
      decision: latestDecision
        ? {
            decidedAt: latestDecision.createdAt.toISOString(),
            decision: latestDecision.decision,
            evidenceRecordId: latestDecision.evidenceRecordId,
            reason: latestDecision.reason,
          }
        : null,
      key: requirement.key,
      linkedObjectType: requirement.requiredObjectType,
      met: Boolean(
        decisionIsSufficient &&
        linkedRecord &&
          minimum &&
          statusRank[linkedRecord.status] >= statusRank[minimum as EvidenceStatus] &&
          linkedRecord.visibilityStatus !== "INTERNAL_ONLY" &&
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
