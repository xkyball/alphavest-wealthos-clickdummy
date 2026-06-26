"use client";

export type PhaseBCDemoActionId =
  | "j12.requestKycEvidence"
  | "j12.completeKycReview"
  | "j12.escalateSourceOfWealth"
  | "j12.linkSourceEvidence"
  | "j13.requestSuitabilityEvidence"
  | "j13.markSuitabilityReviewed"
  | "j14.requestIpsMandateChanges"
  | "j14.linkIpsEvidence";

type PhaseBCJourneyCommand =
  | "KYC_REQUEST_EVIDENCE"
  | "KYC_COMPLETE_REVIEW"
  | "SOURCE_OF_WEALTH_ESCALATE"
  | "SOURCE_OF_WEALTH_LINK_EVIDENCE"
  | "SUITABILITY_REQUEST_EVIDENCE"
  | "SUITABILITY_MARK_REVIEWED"
  | "IPS_REQUEST_MANDATE_CHANGES"
  | "IPS_LINK_EVIDENCE";

type PhaseBCActionSpec = {
  command: PhaseBCJourneyCommand;
  email: string;
  journeyKey: "MJ-003";
  reason: string;
};

const morganTenantId = "7870ddd4-4587-58c6-a30b-ed6710109c17";

const phaseBCActionSpecs: Record<PhaseBCDemoActionId, PhaseBCActionSpec> = {
  "j12.requestKycEvidence": {
    command: "KYC_REQUEST_EVIDENCE",
    email: "mira.analyst@alphavest.demo",
    journeyKey: "MJ-003",
    reason: "Phase B KYC evidence request recorded through typed journey command.",
  },
  "j12.completeKycReview": {
    command: "KYC_COMPLETE_REVIEW",
    email: "naledi.compliance@alphavest.demo",
    journeyKey: "MJ-003",
    reason: "Phase B KYC review routed to compliance through typed journey command.",
  },
  "j12.escalateSourceOfWealth": {
    command: "SOURCE_OF_WEALTH_ESCALATE",
    email: "mira.analyst@alphavest.demo",
    journeyKey: "MJ-003",
    reason: "Phase B source-of-wealth evidence gap escalated through typed journey command.",
  },
  "j12.linkSourceEvidence": {
    command: "SOURCE_OF_WEALTH_LINK_EVIDENCE",
    email: "naledi.compliance@alphavest.demo",
    journeyKey: "MJ-003",
    reason: "Phase B source-of-wealth evidence linked through typed journey command.",
  },
  "j13.requestSuitabilityEvidence": {
    command: "SUITABILITY_REQUEST_EVIDENCE",
    email: "mira.analyst@alphavest.demo",
    journeyKey: "MJ-003",
    reason: "Phase C suitability evidence request recorded through typed journey command.",
  },
  "j13.markSuitabilityReviewed": {
    command: "SUITABILITY_MARK_REVIEWED",
    email: "mira.analyst@alphavest.demo",
    journeyKey: "MJ-003",
    reason: "Phase C suitability review marked through typed journey command.",
  },
  "j14.requestIpsMandateChanges": {
    command: "IPS_REQUEST_MANDATE_CHANGES",
    email: "thabo.advisor@alphavest.demo",
    journeyKey: "MJ-003",
    reason: "Phase C IPS mandate changes requested through typed journey command.",
  },
  "j14.linkIpsEvidence": {
    command: "IPS_LINK_EVIDENCE",
    email: "thabo.advisor@alphavest.demo",
    journeyKey: "MJ-003",
    reason: "Phase C IPS evidence linked through typed journey command.",
  },
};

const jwtByEmail = new Map<string, string>();
const journeyIdByKey = new Map<string, string>();

async function jsonOrUndefined(response: Response) {
  return (await response.json().catch(() => undefined)) as unknown;
}

function errorMessage(body: unknown, fallback: string) {
  return body && typeof body === "object" && "error" in body && typeof body.error === "string"
    ? body.error
    : fallback;
}

async function demoJwtFor(email: string) {
  const cached = jwtByEmail.get(email);
  if (cached) return cached;

  const login = await fetch("/api/auth/provider-login", {
    body: JSON.stringify({ email, providerId: "db-user-jwt" }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const loginBody = await jsonOrUndefined(login);
  if (!login.ok) {
    throw new Error(errorMessage(loginBody, "Demo provider login failed."));
  }

  const mfa = await fetch("/api/auth/mfa/verify", {
    body: JSON.stringify({ code: "123456", email, providerId: "db-user-jwt" }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const mfaBody = (await jsonOrUndefined(mfa)) as { jwt?: string } | undefined;
  if (!mfa.ok || typeof mfaBody?.jwt !== "string") {
    throw new Error(errorMessage(mfaBody, "Demo MFA verification failed."));
  }

  jwtByEmail.set(email, mfaBody.jwt);
  return mfaBody.jwt;
}

async function journeyIdFor(spec: PhaseBCActionSpec, jwt: string) {
  const cacheKey = `${morganTenantId}:${spec.journeyKey}`;
  const cached = journeyIdByKey.get(cacheKey);
  if (cached) return cached;

  const list = await fetch("/api/journeys", {
    headers: { authorization: `Bearer ${jwt}` },
  });
  const listBody = (await jsonOrUndefined(list)) as
    | { journeys?: Array<{ clientTenantId?: string; id?: string; journeyKey?: string }> }
    | undefined;
  if (!list.ok) {
    throw new Error(errorMessage(listBody, "Journey list failed."));
  }

  const existing = listBody?.journeys?.find(
    (journey) => journey.clientTenantId === morganTenantId && journey.journeyKey === spec.journeyKey && typeof journey.id === "string",
  );
  if (existing?.id) {
    journeyIdByKey.set(cacheKey, existing.id);
    return existing.id;
  }

  const created = await fetch("/api/journeys", {
    body: JSON.stringify({
      clientTenantId: morganTenantId,
      journeyKey: spec.journeyKey,
    }),
    headers: {
      authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const createdBody = (await jsonOrUndefined(created)) as { detail?: { id?: string } } | undefined;
  if (!created.ok || typeof createdBody?.detail?.id !== "string") {
    throw new Error(errorMessage(createdBody, "Journey creation failed."));
  }

  journeyIdByKey.set(cacheKey, createdBody.detail.id);
  return createdBody.detail.id;
}

export async function runPhaseBCJourneyCommand(actionId: PhaseBCDemoActionId, nextRoute?: string) {
  const spec = phaseBCActionSpecs[actionId];
  const jwt = await demoJwtFor(spec.email);
  const journeyId = await journeyIdFor(spec, jwt);
  const response = await fetch(`/api/journeys/${journeyId}/commands`, {
    body: JSON.stringify({
      command: spec.command,
      reason: spec.reason,
    }),
    headers: {
      authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const body = (await jsonOrUndefined(response)) as { error?: string; result?: { message?: string } } | undefined;

  if (!response.ok) {
    throw new Error(errorMessage(body, `Phase B/C journey command failed with HTTP ${response.status}.`));
  }

  if (nextRoute) {
    window.location.assign(nextRoute);
  }

  return body;
}
