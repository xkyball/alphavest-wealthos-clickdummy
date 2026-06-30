"use client";

export type StageBCSeedActionId =
  | "j12.requestKycEvidence"
  | "j12.completeKycReview"
  | "j12.escalateSourceOfWealth"
  | "j12.linkSourceEvidence"
  | "j13.requestSuitabilityEvidence"
  | "j13.markSuitabilityReviewed"
  | "j14.requestIpsMandateChanges"
  | "j14.linkIpsEvidence";

type StageBCActionSpec = {
  email: string;
  processId: "BP-023" | "BP-024" | "BP-030" | "BP-046";
  reason: string;
};

const morganTenantId = "7870ddd4-4587-58c6-a30b-ed6710109c17";

const stageBCActionSpecs: Record<StageBCSeedActionId, StageBCActionSpec> = {
  "j12.requestKycEvidence": {
    email: "mira.analyst@alphavest.demo",
    processId: "BP-023",
    reason: "Stage B KYC evidence request recorded through the Process Runtime Backbone.",
  },
  "j12.completeKycReview": {
    email: "naledi.compliance@alphavest.demo",
    processId: "BP-030",
    reason: "Stage B KYC review routed to compliance through the Process Runtime Backbone.",
  },
  "j12.escalateSourceOfWealth": {
    email: "mira.analyst@alphavest.demo",
    processId: "BP-046",
    reason: "Stage B source-of-wealth evidence gap escalated through the Process Runtime Backbone.",
  },
  "j12.linkSourceEvidence": {
    email: "naledi.compliance@alphavest.demo",
    processId: "BP-024",
    reason: "Stage B source-of-wealth evidence linked through the Process Runtime Backbone.",
  },
  "j13.requestSuitabilityEvidence": {
    email: "mira.analyst@alphavest.demo",
    processId: "BP-023",
    reason: "Stage C suitability evidence request recorded through the Process Runtime Backbone.",
  },
  "j13.markSuitabilityReviewed": {
    email: "mira.analyst@alphavest.demo",
    processId: "BP-030",
    reason: "Stage C suitability review marked through the Process Runtime Backbone.",
  },
  "j14.requestIpsMandateChanges": {
    email: "thabo.advisor@alphavest.demo",
    processId: "BP-046",
    reason: "Stage C IPS mandate changes requested through the Process Runtime Backbone.",
  },
  "j14.linkIpsEvidence": {
    email: "thabo.advisor@alphavest.demo",
    processId: "BP-024",
    reason: "Stage C IPS evidence linked through the Process Runtime Backbone.",
  },
};

const jwtByEmail = new Map<string, string>();
const processInstanceIdByKey = new Map<string, string>();

async function jsonOrUndefined(response: Response) {
  return (await response.json().catch(() => undefined)) as unknown;
}

function errorMessage(body: unknown, fallback: string) {
  return body && typeof body === "object" && "error" in body && typeof body.error === "string"
    ? body.error
    : fallback;
}

async function seedJwtFor(email: string) {
  const cached = jwtByEmail.get(email);
  if (cached) return cached;

  const login = await fetch("/api/auth/provider-login", {
    body: JSON.stringify({ email, providerId: "db-user-jwt" }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const loginBody = await jsonOrUndefined(login);
  if (!login.ok) {
    throw new Error(errorMessage(loginBody, "Local provider login failed."));
  }

  const mfa = await fetch("/api/auth/mfa/verify", {
    body: JSON.stringify({ code: "123456", email, providerId: "db-user-jwt" }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const mfaBody = (await jsonOrUndefined(mfa)) as { jwt?: string } | undefined;
  if (!mfa.ok || typeof mfaBody?.jwt !== "string") {
    throw new Error(errorMessage(mfaBody, "Local MFA verification failed."));
  }

  jwtByEmail.set(email, mfaBody.jwt);
  return mfaBody.jwt;
}

async function processInstanceIdFor(spec: StageBCActionSpec, jwt: string) {
  const cacheKey = `${morganTenantId}:${spec.processId}`;
  const cached = processInstanceIdByKey.get(cacheKey);
  if (cached) return cached;

  const list = await fetch("/api/processes", {
    headers: { authorization: `Bearer ${jwt}` },
  });
  const listBody = (await jsonOrUndefined(list)) as
    | { processes?: Array<{ clientTenantId?: string; id?: string; processId?: string }> }
    | undefined;
  if (!list.ok) {
    throw new Error(errorMessage(listBody, "Process list failed."));
  }

  const existing = listBody?.processes?.find(
    (process) =>
      process.clientTenantId === morganTenantId && process.processId === spec.processId && typeof process.id === "string",
  );
  if (existing?.id) {
    processInstanceIdByKey.set(cacheKey, existing.id);
    return existing.id;
  }

  const created = await fetch("/api/processes", {
    body: JSON.stringify({
      clientTenantId: morganTenantId,
      processId: spec.processId,
    }),
    headers: {
      authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const createdBody = (await jsonOrUndefined(created)) as { detail?: { id?: string } } | undefined;
  if (!created.ok || typeof createdBody?.detail?.id !== "string") {
    throw new Error(errorMessage(createdBody, "Process creation failed."));
  }

  processInstanceIdByKey.set(cacheKey, createdBody.detail.id);
  return createdBody.detail.id;
}

export async function runStageBCProcessCommand(actionId: StageBCSeedActionId, nextRoute?: string) {
  const spec = stageBCActionSpecs[actionId];
  const jwt = await seedJwtFor(spec.email);
  const processInstanceId = await processInstanceIdFor(spec, jwt);
  const response = await fetch(`/api/processes/${processInstanceId}/commands`, {
    body: JSON.stringify({
      command: "BLOCK",
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
    throw new Error(errorMessage(body, `Stage B/C process command failed with HTTP ${response.status}.`));
  }

  if (nextRoute) {
    window.location.assign(nextRoute);
  }

  return body;
}
