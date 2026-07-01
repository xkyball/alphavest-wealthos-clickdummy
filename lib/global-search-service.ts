import { ObjectType, Prisma, type PrismaClient } from "@prisma/client";

import { actorTenants, type ActorSession } from "@/lib/actor-session";
import { resolveGlobalSearchAccessPolicy, type SearchVisibilityScope } from "@/lib/global-search-access-policy";
import { stableId } from "@/lib/stable-id";

export type GlobalSearchResult = {
  description: string;
  href: string;
  id: string;
  label: string;
  nextActionLabel?: string;
  processLabel?: string;
  status: string;
  type: string;
};

type SearchIndexInput = {
  clientTenantId: string | null;
  content: Array<string | null | undefined>;
  href: string;
  nextActionLabel?: string;
  objectId: string;
  objectType: ObjectType;
  processInstanceId?: string | null;
  processLabel?: string;
  source?: string;
  status: string;
  summary: string;
  title: string;
  typeLabel: string;
  visibilityScope: SearchVisibilityScope;
};

const maxQueryLength = 80;

export function normalizeGlobalSearchQuery(value: string | null | undefined) {
  return (value ?? "").trim().slice(0, maxQueryLength);
}

function compact(values: Array<string | null | undefined>) {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value));
}

function tenantSlugForId(id: string | null | undefined) {
  return actorTenants.find((tenant) => tenant.id === id)?.slug;
}

function searchDocumentId(input: Pick<SearchIndexInput, "objectId" | "objectType" | "visibilityScope">) {
  return stableId(`search-document:${input.visibilityScope}:${input.objectType}:${input.objectId}`);
}

function toSearchDocument(input: SearchIndexInput): Prisma.SearchDocumentCreateManyInput {
  const content = compact([input.title, input.summary, input.status, input.typeLabel, ...input.content]).join("\n");

  return {
    clientTenantId: input.clientTenantId,
    content,
    href: input.href,
    id: searchDocumentId(input),
    indexedAt: new Date(),
    metadataJson: {
      nextActionLabel: input.nextActionLabel ?? nextActionLabelForHref(input.href),
      processLabel: input.processLabel,
      typeLabel: input.typeLabel,
    },
    objectId: input.objectId,
    objectType: input.objectType,
    processInstanceId: input.processInstanceId ?? null,
    source: input.source ?? "search_index_rebuild",
    status: input.status,
    summary: input.summary,
    title: input.title,
    visibilityScope: input.visibilityScope,
  };
}

function nextActionLabelForHref(href: string) {
  if (href.startsWith("/advisor/reviews/")) return "Open advisor review";
  if (href.startsWith("/advisory/triggers/")) return "Open analyst workbench";
  if (href.startsWith("/compliance/reviews/")) return "Open compliance decision";
  if (href.startsWith("/documents/review-queue") || href.includes("/documents/")) return "Open evidence review";
  if (href.startsWith("/documents")) return "Open evidence workspace";
  if (href.startsWith("/decisions")) return "Open decision record";
  if (href.startsWith("/evidence")) return "Open evidence vault";
  if (href.startsWith("/export")) return "Open export flow";
  if (href.startsWith("/governance") || href.startsWith("/admin")) return "Open governance workspace";
  if (href.startsWith("/ops")) return "Open operations queue";
  if (href.startsWith("/client") || href.startsWith("/mobile")) return "Open client workspace";
  if (href.startsWith("/tenants")) return "Open tenant setup";

  return "Open workspace item";
}

function humanizeSearchStatus(value: string | null | undefined) {
  return (value ?? "Active")
    .replace(/^PROCESS_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function searchDomainLabel(value: string | null | undefined) {
  return (value ?? "Work").replace(/\s+Processes$/i, "").trim();
}

function processLabelForSearch(
  processInstanceId: string | null | undefined,
  processContextById: Map<string, { blockerReason: string | null; processName: string; status: string }>,
) {
  if (!processInstanceId) return undefined;

  const context = processContextById.get(processInstanceId);
  if (!context) return "Workflow linked";

  if (context.blockerReason) {
    return `${context.processName}: blocker active`;
  }

  return `${context.processName}: ${humanizeSearchStatus(context.status)}`;
}

function tenantDescription(displayName: string, parts: Array<string | null | undefined>) {
  return compact([displayName, ...parts]).join(" / ");
}

export async function rebuildGlobalSearchIndex(prisma: PrismaClient) {
  const [
    tenants,
    userProfiles,
    documents,
    familyMembers,
    relationships,
    entities,
    assets,
    engagements,
    triggers,
    actionItems,
    recommendations,
    decisions,
    evidenceRecords,
    reviewSchedules,
    exportRequests,
    queueItems,
    dataQualityIssues,
    roles,
    policyDefinitions,
    auditEvents,
    processInstances,
    processLinks,
  ] = await Promise.all([
    prisma.clientTenant.findMany({
      orderBy: { displayName: "asc" },
      select: {
        displayName: true,
        id: true,
        jurisdiction: true,
        relationshipTier: true,
        riskRating: true,
        status: true,
      },
    }),
    prisma.userProfile.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        countryOfResidence: true,
        firstName: true,
        id: true,
        lastName: true,
        relationshipLabel: true,
        sensitivity: true,
        user: { select: { displayName: true, email: true, status: true } },
      },
      where: {
        clientTenantId: { not: null },
      },
    }),
    prisma.document.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        clientVisible: true,
        documentType: true,
        fileName: true,
        id: true,
        sensitivity: true,
        status: true,
        title: true,
      },
    }),
    prisma.familyMember.findMany({
      orderBy: { displayName: "asc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        displayName: true,
        id: true,
        relationshipType: true,
        taxResidency: true,
      },
    }),
    prisma.relationship.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        confidence: true,
        id: true,
        objectType: true,
        relationshipType: true,
        subjectType: true,
      },
    }),
    prisma.entity.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        entityType: true,
        id: true,
        jurisdiction: true,
        name: true,
        riskRating: true,
        status: true,
      },
    }),
    prisma.asset.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        assetType: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        currency: true,
        id: true,
        jurisdiction: true,
        name: true,
        riskRating: true,
        status: true,
        valueBand: true,
      },
    }),
    prisma.engagement.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        id: true,
        name: true,
        sensitivity: true,
        status: true,
        type: true,
      },
    }),
    prisma.trigger.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        clientVisible: true,
        description: true,
        id: true,
        severity: true,
        status: true,
        title: true,
        triggerType: true,
      },
    }),
    prisma.actionItem.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        assignedRoleKey: true,
        blockedReason: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        clientVisible: true,
        description: true,
        evidenceStatus: true,
        id: true,
        priority: true,
        status: true,
        title: true,
      },
    }),
    prisma.recommendation.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        adviceClassification: true,
        clientSummaryDraft: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        clientVisible: true,
        id: true,
        riskSummary: true,
        status: true,
        summaryInternal: true,
        title: true,
      },
    }),
    prisma.decision.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        decisionAction: true,
        decisionReason: true,
        evidenceRecordId: true,
        id: true,
        recommendation: { select: { title: true } },
        releasedToClientAt: true,
        status: true,
        title: true,
      },
    }),
    prisma.evidenceRecord.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        id: true,
        relatedObjectType: true,
        retentionPolicy: true,
        status: true,
        summary: true,
        title: true,
        visibilityStatus: true,
      },
    }),
    prisma.reviewSchedule.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        cadence: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        id: true,
        nextReviewDate: true,
        status: true,
        targetType: true,
      },
    }),
    prisma.exportRequest.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        exportType: true,
        id: true,
        redactionProfile: true,
        status: true,
      },
    }),
    prisma.queueItem.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        assignedRoleKey: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        id: true,
        priority: true,
        queueName: true,
        status: true,
        targetId: true,
        targetType: true,
      },
    }),
    prisma.dataQualityIssue.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        description: true,
        id: true,
        issueType: true,
        severity: true,
        status: true,
      },
    }),
    prisma.role.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        description: true,
        id: true,
        isSystemRole: true,
        key: true,
        name: true,
        requiresSecondConfirmation: true,
        scope: true,
      },
    }),
    prisma.policyDefinition.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        category: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        id: true,
        name: true,
        policyKey: true,
        status: true,
        version: true,
      },
    }),
    prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        eventType: true,
        id: true,
        reason: true,
        result: true,
        targetType: true,
      },
      take: 200,
    }),
    prisma.processInstance.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        blockerCode: true,
        blockerReason: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        currentStepId: true,
        id: true,
        processDefinition: {
          select: {
            domainName: true,
            intendedArea: true,
            processId: true,
            processName: true,
          },
        },
        status: true,
      },
    }),
    prisma.processObjectLink.findMany({
      select: {
        objectId: true,
        objectType: true,
        processInstanceId: true,
      },
      where: {
        objectType: { in: [ObjectType.RECOMMENDATION, ObjectType.DECISION, ObjectType.EVIDENCE_RECORD] },
      },
    }),
  ]);

  const processInstanceByObject = new Map(
    processLinks.map((link) => [`${link.objectType}:${link.objectId}`, link.processInstanceId]),
  );
  const processContextById = new Map(
    processInstances.map((instance) => [
      instance.id,
      {
        blockerReason: instance.blockerReason,
        processName: instance.processDefinition.processName,
        status: String(instance.status),
      },
    ]),
  );
  const documentsToCreate: Prisma.SearchDocumentCreateManyInput[] = [];

  for (const tenant of tenants) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: tenant.id,
      content: [tenant.displayName, tenant.jurisdiction, tenant.relationshipTier, tenant.riskRating, String(tenant.status)],
      href: `/tenants/${tenantSlugForId(tenant.id) ?? "current"}/setup`,
      objectId: tenant.id,
      objectType: ObjectType.TENANT,
      status: String(tenant.status),
      summary: tenantDescription(tenant.displayName, [tenant.jurisdiction, tenant.relationshipTier]),
      title: tenant.displayName,
      typeLabel: "Tenant",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const profile of userProfiles) {
    const displayName = compact([profile.firstName, profile.lastName]).join(" ") || profile.user.displayName;

    documentsToCreate.push(toSearchDocument({
      clientTenantId: profile.clientTenantId,
      content: [
        profile.clientTenant?.displayName,
        profile.user.displayName,
        profile.user.email,
        profile.relationshipLabel,
        profile.countryOfResidence,
        String(profile.sensitivity),
      ],
      href: "/client/home",
      objectId: profile.id,
      objectType: ObjectType.USER,
      status: String(profile.user.status),
      summary: tenantDescription(profile.clientTenant?.displayName ?? "Client profile", [
        profile.relationshipLabel,
        profile.countryOfResidence,
      ]),
      title: displayName,
      typeLabel: "Profile",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const document of documents) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: document.clientTenantId,
      content: [document.clientTenant.displayName, document.documentType, document.fileName, String(document.sensitivity)],
      href: "/documents",
      objectId: document.id,
      objectType: ObjectType.DOCUMENT,
      status: String(document.status),
      summary: tenantDescription(document.clientTenant.displayName, [document.documentType, document.fileName]),
      title: document.title,
      typeLabel: "Document",
      visibilityScope: document.clientVisible ? "CLIENT_SAFE" : "TENANT_INTERNAL",
    }));
  }

  for (const member of familyMembers) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: member.clientTenantId,
      content: [member.clientTenant.displayName, member.displayName, member.relationshipType, member.taxResidency],
      href: "/client/family-members",
      objectId: member.id,
      objectType: ObjectType.FAMILY_MEMBER,
      status: member.relationshipType ?? "Family member",
      summary: tenantDescription(member.clientTenant.displayName, [member.relationshipType, member.taxResidency]),
      title: member.displayName,
      typeLabel: "Family",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const relationship of relationships) {
    const relationshipLabel = relationship.relationshipType.replace(/_/g, " ");

    documentsToCreate.push(toSearchDocument({
      clientTenantId: relationship.clientTenantId,
      content: [
        relationship.clientTenant.displayName,
        relationship.relationshipType,
        String(relationship.subjectType),
        String(relationship.objectType),
        relationship.confidence ? `Confidence ${relationship.confidence.toString()}` : undefined,
      ],
      href: "/relationships",
      objectId: relationship.id,
      objectType: ObjectType.RELATIONSHIP,
      status: relationship.confidence ? `Confidence ${relationship.confidence.toString()}%` : "Relationship mapped",
      summary: tenantDescription(relationship.clientTenant.displayName, [
        String(relationship.subjectType),
        String(relationship.objectType),
      ]),
      title: `Relationship ${relationshipLabel}`,
      typeLabel: "Relationship",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const entity of entities) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: entity.clientTenantId,
      content: [entity.clientTenant.displayName, entity.name, String(entity.entityType), entity.jurisdiction, entity.riskRating, entity.status],
      href: "/entities",
      objectId: entity.id,
      objectType: ObjectType.ENTITY,
      status: entity.status,
      summary: tenantDescription(entity.clientTenant.displayName, [String(entity.entityType), entity.jurisdiction, entity.riskRating]),
      title: entity.name,
      typeLabel: "Entity",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const asset of assets) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: asset.clientTenantId,
      content: [
        asset.clientTenant.displayName,
        String(asset.assetType),
        asset.name,
        asset.jurisdiction,
        asset.currency,
        asset.valueBand,
        asset.riskRating,
        asset.status,
      ],
      href: "/client/assets",
      objectId: asset.id,
      objectType: ObjectType.ASSET,
      status: asset.status,
      summary: tenantDescription(asset.clientTenant.displayName, [String(asset.assetType), asset.valueBand, asset.riskRating]),
      title: asset.name,
      typeLabel: "Asset",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const engagement of engagements) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: engagement.clientTenantId,
      content: [engagement.clientTenant.displayName, engagement.name, engagement.type, String(engagement.status), String(engagement.sensitivity)],
      href: "/client/home",
      objectId: engagement.id,
      objectType: ObjectType.ENGAGEMENT,
      status: String(engagement.status),
      summary: tenantDescription(engagement.clientTenant.displayName, [engagement.type, String(engagement.status)]),
      title: engagement.name,
      typeLabel: "Engagement",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const trigger of triggers) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: trigger.clientTenantId,
      content: [
        trigger.clientTenant.displayName,
        trigger.title,
        trigger.description,
        trigger.triggerType,
        trigger.severity,
        String(trigger.status),
      ],
      href: `/advisory/triggers/${trigger.id}/review`,
      objectId: trigger.id,
      objectType: ObjectType.TRIGGER,
      status: String(trigger.status),
      summary: tenantDescription(trigger.clientTenant.displayName, [trigger.description, trigger.severity]),
      title: trigger.title,
      typeLabel: "Trigger",
      visibilityScope: trigger.clientVisible ? "CLIENT_SAFE" : "TENANT_INTERNAL",
    }));
  }

  for (const actionItem of actionItems) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: actionItem.clientTenantId,
      content: [
        actionItem.clientTenant.displayName,
        actionItem.title,
        actionItem.description,
        actionItem.assignedRoleKey,
        actionItem.priority,
        String(actionItem.status),
        String(actionItem.evidenceStatus ?? ""),
        actionItem.blockedReason,
      ],
      href: actionItem.clientVisible ? "/client/home" : "/ops",
      objectId: actionItem.id,
      objectType: ObjectType.ACTION_ITEM,
      status: `${actionItem.priority} / ${String(actionItem.status)}`,
      summary: tenantDescription(actionItem.clientTenant.displayName, [actionItem.description, actionItem.assignedRoleKey]),
      title: actionItem.title,
      typeLabel: "Action",
      visibilityScope: actionItem.clientVisible ? "CLIENT_SAFE" : "TENANT_INTERNAL",
    }));
  }

  for (const recommendation of recommendations) {
    const clientSafe = recommendation.clientVisible;
    const processInstanceId = processInstanceByObject.get(`${ObjectType.RECOMMENDATION}:${recommendation.id}`);

    documentsToCreate.push(toSearchDocument({
      clientTenantId: recommendation.clientTenantId,
      content: [
        recommendation.clientTenant.displayName,
        recommendation.title,
        clientSafe ? recommendation.clientSummaryDraft : recommendation.summaryInternal,
        recommendation.riskSummary,
        String(recommendation.adviceClassification),
      ],
      href: clientSafe ? "/mobile" : `/advisor/reviews/${recommendation.id}`,
      objectId: recommendation.id,
      objectType: ObjectType.RECOMMENDATION,
      processInstanceId,
      processLabel: processLabelForSearch(processInstanceId, processContextById),
      status: String(recommendation.status),
      summary: tenantDescription(recommendation.clientTenant.displayName, [
        clientSafe ? recommendation.clientSummaryDraft : "Internal advisor/compliance review item",
        String(recommendation.adviceClassification),
      ]),
      title: recommendation.title,
      typeLabel: "Recommendation",
      visibilityScope: clientSafe ? "CLIENT_SAFE" : "TENANT_INTERNAL",
    }));
  }

  for (const decision of decisions) {
    const clientSafe =
      Boolean(decision.releasedToClientAt) ||
      ["RELEASED_TO_CLIENT", "ACCEPTED", "DEFERRED", "REJECTED"].includes(String(decision.status));
    const processInstanceId = processInstanceByObject.get(`${ObjectType.DECISION}:${decision.id}`);

    documentsToCreate.push(toSearchDocument({
      clientTenantId: decision.clientTenantId,
      content: [
        decision.clientTenant.displayName,
        decision.title,
        decision.recommendation?.title,
        String(decision.status),
        decision.decisionAction,
        clientSafe ? undefined : decision.decisionReason,
      ],
      href: clientSafe ? "/client/decisions" : "/decisions",
      objectId: decision.id,
      objectType: ObjectType.DECISION,
      processInstanceId,
      processLabel: processLabelForSearch(processInstanceId, processContextById),
      status: String(decision.status),
      summary: tenantDescription(decision.clientTenant.displayName, [
        decision.recommendation?.title,
        clientSafe ? "Released decision" : "Internal decision work item",
      ]),
      title: decision.title,
      typeLabel: "Decision",
      visibilityScope: clientSafe ? "CLIENT_SAFE" : "TENANT_INTERNAL",
    }));
  }

  for (const evidence of evidenceRecords) {
    const clientSafe =
      ["CLIENT_VISIBLE", "REDACTED"].includes(String(evidence.visibilityStatus)) &&
      ["VALIDATED", "RELEASED"].includes(String(evidence.status));

    documentsToCreate.push(toSearchDocument({
      clientTenantId: evidence.clientTenantId,
      content: [
        evidence.clientTenant.displayName,
        evidence.title,
        evidence.summary,
        String(evidence.status),
        String(evidence.visibilityStatus),
        String(evidence.relatedObjectType),
        evidence.retentionPolicy,
      ],
      href: clientSafe ? "/client/evidence" : "/evidence",
      objectId: evidence.id,
      objectType: ObjectType.EVIDENCE_RECORD,
      processInstanceId: processInstanceByObject.get(`${ObjectType.EVIDENCE_RECORD}:${evidence.id}`),
      processLabel: processLabelForSearch(processInstanceByObject.get(`${ObjectType.EVIDENCE_RECORD}:${evidence.id}`), processContextById),
      status: `${String(evidence.status)} / ${String(evidence.visibilityStatus)}`,
      summary: tenantDescription(evidence.clientTenant.displayName, [evidence.summary, String(evidence.relatedObjectType)]),
      title: evidence.title,
      typeLabel: "Evidence",
      visibilityScope: clientSafe ? "CLIENT_SAFE" : "TENANT_INTERNAL",
    }));
  }

  for (const schedule of reviewSchedules) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: schedule.clientTenantId,
      content: [
        schedule.clientTenant.displayName,
        schedule.cadence,
        String(schedule.status),
        String(schedule.targetType),
        schedule.nextReviewDate.toISOString().slice(0, 10),
      ],
      href: "/ops/sla/release-readiness",
      objectId: schedule.id,
      objectType: ObjectType.REVIEW_SCHEDULE,
      status: String(schedule.status),
      summary: tenantDescription(schedule.clientTenant.displayName, [
        schedule.cadence,
        `Next review ${schedule.nextReviewDate.toISOString().slice(0, 10)}`,
      ]),
      title: `${String(schedule.targetType).replace(/_/g, " ")} review`,
      typeLabel: "Review",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const request of exportRequests) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: request.clientTenantId,
      content: [request.clientTenant.displayName, String(request.exportType), request.redactionProfile, String(request.status), request.id],
      href: "/export/client-package/download",
      objectId: request.id,
      objectType: ObjectType.EXPORT_REQUEST,
      status: String(request.status),
      summary: tenantDescription(request.clientTenant.displayName, [String(request.exportType), request.redactionProfile]),
      title: `Export ${request.id.slice(0, 8)}`,
      typeLabel: "Export",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const instance of processInstances) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: instance.clientTenantId,
      content: [
        instance.clientTenant.displayName,
        instance.processDefinition.processName,
        searchDomainLabel(instance.processDefinition.domainName),
        instance.processDefinition.intendedArea,
        humanizeSearchStatus(String(instance.status)),
        instance.blockerReason ? "blocked work needs review" : undefined,
      ],
      href: "/ops",
      nextActionLabel: instance.blockerCode ? "Review blocker" : "Open work queue",
      objectId: instance.id,
      objectType: ObjectType.PROCESS,
      processInstanceId: instance.id,
      processLabel: `${instance.processDefinition.processName}: ${humanizeSearchStatus(String(instance.status))}`,
      status: instance.blockerCode ? `${humanizeSearchStatus(String(instance.status))} / Blocked` : humanizeSearchStatus(String(instance.status)),
      summary: tenantDescription(instance.clientTenant.displayName, [
        searchDomainLabel(instance.processDefinition.domainName),
        instance.blockerReason ? "Needs operational setup before work can continue." : instance.processDefinition.intendedArea,
      ]),
      title: instance.processDefinition.processName,
      typeLabel: "Work item",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const item of queueItems) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: item.clientTenantId,
      content: [item.clientTenant.displayName, item.queueName, item.assignedRoleKey, item.priority, String(item.status)],
      href: "/ops",
      objectId: item.id,
      objectType: ObjectType.QUEUE_ITEM,
      status: String(item.status),
      summary: tenantDescription(item.clientTenant.displayName, [item.assignedRoleKey, item.priority]),
      title: item.queueName,
      typeLabel: "Ops",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const issue of dataQualityIssues) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: issue.clientTenantId,
      content: [issue.clientTenant.displayName, issue.issueType, issue.description, issue.severity, String(issue.status)],
      href: "/ops/sla/release-readiness",
      objectId: issue.id,
      objectType: ObjectType.DATA_QUALITY_ISSUE,
      status: `${issue.severity} / ${String(issue.status)}`,
      summary: tenantDescription(issue.clientTenant.displayName, [issue.description]),
      title: issue.issueType,
      typeLabel: "Data quality",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const role of roles) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: role.clientTenantId,
      content: [
        role.clientTenant?.displayName,
        role.key,
        role.name,
        role.description,
        String(role.scope),
        role.requiresSecondConfirmation ? "second confirmation required" : undefined,
      ],
      href: "/admin/roles",
      objectId: role.id,
      objectType: ObjectType.ROLE,
      status: role.isSystemRole ? "System role" : "Custom role",
      summary: tenantDescription(role.clientTenant?.displayName ?? "Platform role", [
        role.description,
        String(role.scope),
      ]),
      title: role.name,
      typeLabel: "Role",
      visibilityScope: role.clientTenantId ? "TENANT_INTERNAL" : "PLATFORM_INTERNAL",
    }));
  }

  for (const policy of policyDefinitions) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: policy.clientTenantId,
      content: [
        policy.clientTenant?.displayName,
        policy.policyKey,
        policy.name,
        policy.category,
        policy.version,
        policy.status,
      ],
      href: "/admin/security",
      objectId: policy.id,
      objectType: ObjectType.POLICY,
      status: `${policy.status} / ${policy.version}`,
      summary: tenantDescription(policy.clientTenant?.displayName ?? "Platform policy", [
        policy.category,
        policy.policyKey,
      ]),
      title: policy.name,
      typeLabel: "Policy",
      visibilityScope: policy.clientTenantId ? "TENANT_INTERNAL" : "PLATFORM_INTERNAL",
    }));
  }

  for (const event of auditEvents) {
    if (!event.clientTenantId) continue;

    documentsToCreate.push(toSearchDocument({
      clientTenantId: event.clientTenantId,
      content: [event.clientTenant?.displayName, event.eventType, event.reason, String(event.result), String(event.targetType)],
      href: "/compliance/reviews/current/audit",
      objectId: event.id,
      objectType: ObjectType.AUDIT_EVENT,
      status: String(event.result),
      summary: tenantDescription(event.clientTenant?.displayName ?? "Tenant audit", [event.reason, String(event.targetType)]),
      title: event.eventType,
      typeLabel: "Audit",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  await prisma.$transaction([
    prisma.searchDocument.deleteMany(),
    prisma.searchDocument.createMany({
      data: documentsToCreate,
      skipDuplicates: true,
    }),
  ]);

  return {
    count: documentsToCreate.length,
    sourceTruth: "full_text_search_index" as const,
  };
}

export async function refreshGlobalSearchIndexAfterMutation(prisma: PrismaClient, reason: string) {
  const result = await rebuildGlobalSearchIndex(prisma);

  return {
    ...result,
    refreshedAt: new Date().toISOString(),
    refreshReason: reason,
  };
}

type SearchRow = {
  href: string;
  id: string;
  nextActionLabel: string | null;
  objectType: ObjectType;
  processLabel: string | null;
  rank: number;
  status: string;
  summary: string;
  title: string;
  typeLabel: string | null;
};

export async function searchGlobalDb(
  prisma: PrismaClient,
  session: ActorSession,
  query: string,
) {
  const normalizedQuery = normalizeGlobalSearchQuery(query);

  if (normalizedQuery.length < 2) {
    return [];
  }

  if (await prisma.searchDocument.count() === 0) {
    await rebuildGlobalSearchIndex(prisma);
  }

  const searchAccessPolicy = resolveGlobalSearchAccessPolicy(session);
  const rows = await prisma.$queryRaw<SearchRow[]>`
    SELECT
      "id",
      "title",
      "summary",
      "href",
      "status",
      "objectType",
      "metadataJson"->>'typeLabel' AS "typeLabel",
      "metadataJson"->>'processLabel' AS "processLabel",
      "metadataJson"->>'nextActionLabel' AS "nextActionLabel",
      ts_rank(
        setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("status", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("summary", '')), 'C') ||
        setweight(to_tsvector('english', coalesce("content", '')), 'D'),
        websearch_to_tsquery('english', ${normalizedQuery})
      ) AS "rank"
    FROM "search_documents"
    WHERE
      "clientTenantId" IN (${Prisma.join(searchAccessPolicy.tenantIds)})
      AND "visibilityScope" IN (${Prisma.join(searchAccessPolicy.visibilityScopes)})
      AND "objectType" IN (${Prisma.join(searchAccessPolicy.objectTypes)})
      AND (
        setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("status", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("summary", '')), 'C') ||
        setweight(to_tsvector('english', coalesce("content", '')), 'D')
      )
        @@ websearch_to_tsquery('english', ${normalizedQuery})
    ORDER BY "rank" DESC, "updatedAt" DESC
    LIMIT 12
  `;

  return rows.map((row) => ({
    description: row.summary,
    href: row.href,
    id: row.id,
    label: row.title,
    nextActionLabel: row.nextActionLabel ?? undefined,
    processLabel: row.processLabel ?? undefined,
    status: row.status,
    type: row.typeLabel ?? row.objectType,
  }));
}
