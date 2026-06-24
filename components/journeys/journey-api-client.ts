import type { DemoSession } from "@/lib/demo-session";

export type JourneyInstanceStatus = "CREATED" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "CANCELLED";
export type JourneyStepStatus = "LOCKED" | "READY" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "SKIPPED";

export type JourneyNextAction = {
  actorRoleKey?: string;
  blockerCode?: string;
  detail: string;
  stepKey?: string;
  type: "START" | "COMPLETE_STEP" | "RESOLVE_BLOCKER" | "DONE" | "CANCELLED" | "CLIENT_SAFE_STATUS" | "BLOCKED";
};

export type JourneyStepProjection = {
  actorRoleKey: string;
  blockerCode?: string;
  blockerReason?: string;
  key: string;
  sortOrder: number;
  stageKey: string;
  status: JourneyStepStatus;
  title: string;
  requiresAudit?: boolean;
  requiresEvidence?: boolean;
  clientVisible?: boolean;
};

export type JourneyProjection = {
  actorRoleKeys?: string[];
  blockerCode?: string;
  blockerReason?: string;
  currentStageKey?: string;
  currentStepKey?: string;
  currentStepTitle?: string;
  definitionStatus?: string;
  evidenceRequirements?: JourneyEvidenceRequirement[];
  holdReason?: string;
  journeyKey: string;
  nextAction: JourneyNextAction;
  objectLinks?: {
    linkRole: string;
    objectId: string;
    objectType: string;
    title?: string;
  }[];
  status: string;
  steps?: JourneyStepProjection[];
  title: string;
};

export type JourneyListItem = {
  clientTenantId: string;
  id: string;
  journeyKey: string;
  projection: JourneyProjection;
  status: JourneyInstanceStatus;
};

export type JourneyDefinitionSummary = {
  actorRoleKeys: string[];
  journeyKey: string;
  title: string;
  wave: string;
};

export type JourneyListResponse = {
  availableDefinitions: JourneyDefinitionSummary[];
  currentUser: {
    roleKey?: string;
    tenantId?: string;
  };
  journeys: JourneyListItem[];
  ok: boolean;
};

export type JourneyDetail = {
  clientTenantId: string;
  id: string;
  journeyKey: string;
  projection: JourneyProjection;
  projectionType: "client" | "internal";
  status: JourneyInstanceStatus;
};

export type JourneyDetailResponse = {
  detail: JourneyDetail;
  ok: boolean;
};

export type JourneyAuditResponse = {
  audit: {
    actorRoleKey: string;
    commandKey: string;
    createdAt: string;
    fromStepKey: string | null;
    id: string;
    result: string;
    toStepKey: string | null;
  }[];
  journeyId: string;
  ok: boolean;
};

export type JourneyEvidenceRequirement = {
  key: string;
  linkedObjectType: string;
  met: boolean;
  minEvidenceStatus: string;
  requiredForStepKey: string;
  title: string;
};

export type JourneyEvidenceResponse = {
  evidenceSufficient: boolean;
  journeyId: string;
  ok: boolean;
  requirements: JourneyEvidenceRequirement[];
  safety: {
    noClientRelease: boolean;
    uploadIsNotSufficiency: boolean;
  };
};

export type JourneyClientProjectionResponse = {
  journeyId: string;
  ok: boolean;
  projection: JourneyProjection;
};

export type JourneyCommandResponse = {
  auditEventId?: string;
  command: string;
  detail: JourneyDetail;
  mutated: boolean;
  nextAction?: JourneyNextAction;
  ok: boolean;
};

export type HoldJourneyPlaceholder = {
  detail: string;
  journeyKey: string;
  reason: string;
  title: string;
};

export const holdJourneyPlaceholders: HoldJourneyPlaceholder[] = [
  {
    detail: "Committee routing is visible only as a source-locked hold in Wave 0-2.",
    journeyKey: "MJ-004",
    reason: "HOLD_LOCKED",
    title: "Committee / advisory governance review",
  },
  {
    detail: "KYC, SoW, suitability and IPS execution remain blocked until a later approved wave.",
    journeyKey: "MJ-007",
    reason: "HOLD_LOCKED",
    title: "KYC / SoW / Suitability / IPS",
  },
];

export function safeErrorMessage(error: unknown, fallback = "The work surface could not load.") {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export async function demoJwtForSession(session: DemoSession) {
  const email = session.actor.email;
  const providerId = "db-user-jwt";

  const loginResponse = await fetch("/api/auth/provider-login", {
    body: JSON.stringify({ email, providerId }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });

  if (!loginResponse.ok) {
    throw new Error("Demo auth session could not be started for this actor.");
  }

  const mfaResponse = await fetch("/api/auth/mfa/verify", {
    body: JSON.stringify({ code: "123456", email, providerId }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  const body = await mfaResponse.json().catch(() => undefined);

  if (!mfaResponse.ok || !body?.jwt) {
    throw new Error("Demo auth session could not be verified for this actor.");
  }

  return body.jwt as string;
}

export async function journeyApi<T>(path: string, jwt: string, init: RequestInit = {}) {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...(init.headers ?? {}),
      authorization: `Bearer ${jwt}`,
    },
  });
  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    const issues = Array.isArray(body?.issues) ? ` (${body.issues.join(", ")})` : "";
    throw new Error(`${body?.error ?? "Workflow API request failed."}${issues}`);
  }

  return body as T;
}
