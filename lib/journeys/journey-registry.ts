import { p0AcceptanceProofMap } from "../p0-acceptance-proof";
import {
  assertWave02JourneyExecutable,
  isWave02JourneyExecutable,
  wave02BlockedJourneyFor,
  wave02BlockedJourneys,
  wave02ExecutableJourneyIds,
} from "../source-lock/wave0-2-source-lock";

export type JourneyDefinitionStatus = "ACTIVE" | "HOLD_LOCKED" | "DEFERRED";
export type JourneyStageKey = "intake" | "evidence" | "review" | "release" | "support";

export type JourneyStepDefinition = {
  actorRoleKey: string;
  key: string;
  sortOrder: number;
  stageKey: JourneyStageKey;
  title: string;
  requiresAudit?: boolean;
  requiresEvidence?: boolean;
  clientVisible?: boolean;
};

export type JourneyEvidenceRequirementDefinition = {
  key: string;
  minEvidenceStatus: "CREATED" | "LINKED" | "VALIDATED" | "RELEASED";
  requiredForStepKey: string;
  requiredObjectType: "DOCUMENT" | "EVIDENCE_RECORD" | "RECOMMENDATION" | "DECISION" | "EXPORT_REQUEST";
  title: string;
};

export type JourneyDefinition = {
  actorRoleKeys: string[];
  description: string;
  evidenceRequirements: JourneyEvidenceRequirementDefinition[];
  foundationIds: string[];
  holdReason?: string;
  journeyKey: string;
  routePageIds: string[];
  status: JourneyDefinitionStatus;
  steps: JourneyStepDefinition[];
  title: string;
  wave: "WAVE_0_2";
};

const defaultSteps: JourneyStepDefinition[] = [
  {
    actorRoleKey: "client_success",
    key: "intake.confirm_scope",
    sortOrder: 10,
    stageKey: "intake",
    title: "Confirm tenant, actor and journey scope",
    requiresAudit: true,
  },
  {
    actorRoleKey: "analyst",
    key: "evidence.collect",
    sortOrder: 20,
    stageKey: "evidence",
    title: "Collect and link supporting evidence",
    requiresEvidence: true,
  },
  {
    actorRoleKey: "senior_wealth_advisor",
    key: "review.human_approval",
    sortOrder: 30,
    stageKey: "review",
    title: "Complete human advisor review",
    requiresAudit: true,
  },
  {
    actorRoleKey: "compliance_officer",
    key: "release.compliance_gate",
    sortOrder: 40,
    stageKey: "release",
    title: "Pass compliance release gate before client visibility",
    requiresAudit: true,
  },
];

const journeySpecificSteps: Partial<Record<string, JourneyStepDefinition[]>> = {
  "MJ-002": [
    {
      actorRoleKey: "family_cfo",
      key: "intake.request_upload",
      sortOrder: 10,
      stageKey: "intake",
      title: "Open client-safe evidence upload request",
    },
    {
      actorRoleKey: "analyst",
      key: "evidence.review_upload",
      sortOrder: 20,
      stageKey: "evidence",
      title: "Review uploaded document without claiming sufficiency",
      requiresEvidence: true,
    },
    {
      actorRoleKey: "compliance_officer",
      key: "release.accept_sufficiency",
      sortOrder: 30,
      stageKey: "release",
      title: "Compliance accepts evidence sufficiency",
      requiresAudit: true,
    },
  ],
  "MJ-005": [
    {
      actorRoleKey: "principal",
      key: "intake.select_scope",
      sortOrder: 10,
      stageKey: "intake",
      title: "Select export scope",
      requiresAudit: true,
    },
    {
      actorRoleKey: "compliance_officer",
      key: "review.redaction_approval",
      sortOrder: 20,
      stageKey: "review",
      title: "Approve redaction profile before generation",
      requiresAudit: true,
    },
    {
      actorRoleKey: "principal",
      key: "release.download_package",
      sortOrder: 30,
      stageKey: "release",
      title: "Download generated client-safe package",
      clientVisible: true,
    },
  ],
  "MJ-012": [
    {
      actorRoleKey: "analyst",
      key: "support.identify_issue",
      sortOrder: 10,
      stageKey: "support",
      title: "Identify data-quality support issue",
      requiresAudit: true,
    },
    {
      actorRoleKey: "client_success",
      key: "support.assign_owner",
      sortOrder: 20,
      stageKey: "support",
      title: "Assign support owner and remediation due date",
    },
    {
      actorRoleKey: "compliance_officer",
      key: "review.verify_non_advice",
      sortOrder: 30,
      stageKey: "review",
      title: "Verify support action does not release advice",
      requiresAudit: true,
    },
  ],
};

const acceptedDescriptions: Record<string, string> = {
  "MJ-001": "DB-backed onboarding spine from tenant intake through first compliance-released, client-safe decision.",
  "MJ-002": "Evidence upload and sufficiency journey where upload success remains separate from evidence acceptance.",
  "MJ-003": "Internal-only draft review journey proving unsupported claims are blocked and rebuilt with evidence.",
  "MJ-005": "Export scope, redaction, approval, generation and download journey with client-safe separation.",
  "MJ-006": "Tenant and object isolation journey proving route access never substitutes for payload authorization.",
  "MJ-010": "Admin governance journey proving role changes cannot bypass compliance release.",
  "MJ-012": "Data-quality support journey for internal remediation without client advice execution.",
};

const deferredDescriptions: Record<string, string> = {
  "MJ-008": "Review monitoring and rebalance guard remains deferred to avoid automatic advice or execution claims.",
  "MJ-009": "Mobile and client communication layer remains deferred for a later Wave/P1 communication contract.",
  "MJ-011": "External advisor object-scope access remains conditional until explicitly unlocked beyond Wave 0-2.",
};

function definitionFromProof(journeyKey: string): JourneyDefinition {
  const proofEntry = p0AcceptanceProofMap.find((entry) => entry.journeyId === journeyKey);
  const blocked = wave02BlockedJourneyFor(journeyKey);
  const executable = isWave02JourneyExecutable(journeyKey);
  const status: JourneyDefinitionStatus = blocked ? "HOLD_LOCKED" : executable ? "ACTIVE" : "DEFERRED";

  return {
    actorRoleKeys: Array.from(new Set((journeySpecificSteps[journeyKey] ?? defaultSteps).map((step) => step.actorRoleKey))),
    description:
      acceptedDescriptions[journeyKey] ??
      deferredDescriptions[journeyKey] ??
      blocked?.reason ??
      "Journey metadata is retained for registry completeness but is not executable in Wave 0-2.",
    evidenceRequirements: executable
      ? [
          {
            key: `${journeyKey.toLowerCase()}.evidence-record`,
            minEvidenceStatus: journeyKey === "MJ-005" ? "RELEASED" : "VALIDATED",
            requiredForStepKey: (journeySpecificSteps[journeyKey] ?? defaultSteps).find((step) => step.requiresEvidence)?.key ?? "evidence.collect",
            requiredObjectType: "EVIDENCE_RECORD",
            title: "Evidence record linked before release/projection",
          },
        ]
      : [],
    foundationIds: proofEntry?.foundationIds ?? [],
    holdReason: blocked?.reason,
    journeyKey,
    routePageIds: blocked ? [...blocked.routePageIds] : [],
    status,
    steps: status === "HOLD_LOCKED" ? [] : journeySpecificSteps[journeyKey] ?? defaultSteps,
    title: proofEntry?.journeyName ?? blocked?.label ?? journeyKey,
    wave: "WAVE_0_2",
  };
}

export const journeyRegistry = p0AcceptanceProofMap.map((entry) => definitionFromProof(entry.journeyId));

export const journeyRegistryByKey = new Map(journeyRegistry.map((definition) => [definition.journeyKey, definition]));

export const activeJourneyDefinitions = journeyRegistry.filter((definition) => definition.status === "ACTIVE");
export const holdLockedJourneyDefinitions = journeyRegistry.filter((definition) => definition.status === "HOLD_LOCKED");
export const deferredJourneyDefinitions = journeyRegistry.filter((definition) => definition.status === "DEFERRED");

export function getJourneyDefinition(journeyKey: string) {
  return journeyRegistryByKey.get(journeyKey);
}

export function requireJourneyDefinition(journeyKey: string) {
  const definition = getJourneyDefinition(journeyKey);

  if (!definition) {
    throw new Error(`${journeyKey} is not present in the Wave 0-2 Journey Registry.`);
  }

  return definition;
}

export function assertJourneyCanStart(journeyKey: string) {
  const definition = requireJourneyDefinition(journeyKey);

  assertWave02JourneyExecutable(journeyKey);

  if (definition.status !== "ACTIVE") {
    throw new Error(`${journeyKey} is ${definition.status}; only ACTIVE Wave 0-2 journeys can start.`);
  }

  if (definition.steps.length === 0) {
    throw new Error(`${journeyKey} has no executable steps.`);
  }

  return definition;
}

export function isJourneyExecutable(journeyKey: string) {
  return Boolean(getJourneyDefinition(journeyKey)?.status === "ACTIVE" && isWave02JourneyExecutable(journeyKey));
}

export function journeyRegistryIntegrity() {
  const activeKeys = activeJourneyDefinitions.map((definition) => definition.journeyKey).sort();
  const blockedKeys = holdLockedJourneyDefinitions.map((definition) => definition.journeyKey).sort();

  return {
    activeKeys,
    blockedKeys,
    deferredKeys: deferredJourneyDefinitions.map((definition) => definition.journeyKey).sort(),
    sourceLockActiveKeys: [...wave02ExecutableJourneyIds].sort(),
    sourceLockBlockedKeys: wave02BlockedJourneys.map((journey) => journey.journeyId).sort(),
    totalDefinitions: journeyRegistry.length,
  };
}
