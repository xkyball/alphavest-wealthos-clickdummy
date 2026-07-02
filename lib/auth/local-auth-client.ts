export const localAuthStorageKey = "alphavest.localAuth.v1";

export type LocalAuthInvitation = {
  assignmentStatus: string;
  consentRequired: true;
  displayName: string;
  email: string;
  roleKey: string;
  roleName: string;
  status: string;
  tenantId?: string;
  tenantName?: string;
  tenantSlug?: string;
  token: string;
  validUntil?: string;
};

export type LocalAuthStorage = {
  displayName?: string;
  email: string;
  inviteToken?: string;
  nextStep?: string;
  providerId?: string;
  roleKey?: string;
  roleName?: string;
  tenantName?: string;
  tenantSlug?: string;
};

export type LocalAuthResponse = {
  ok: boolean;
  challengeId?: string;
  error?: string;
  nextStep?: "mfa_required" | "invite_acceptance_required" | "denied";
  reasonCode?: string;
  result?: {
    accepted?: boolean;
    currentUser?: {
      displayName: string;
      email: string;
      roleKey?: string;
      roleName?: string;
      tenantName?: string;
      tenantSlug?: string;
    };
    invitation?: LocalAuthInvitation;
    session?: {
      displayName: string;
      email: string;
      roleKey?: string;
      roleName?: string;
      tenantName?: string;
      tenantSlug?: string;
    };
    tokenType?: "Bearer";
  };
  safeMessage?: string;
  user?: {
    displayName: string;
    email: string;
    inviteToken?: string;
    roleKey?: string;
    roleName?: string;
    tenantName?: string;
    tenantSlug?: string;
  };
};

export function readLocalAuthStorage(defaultEmail: string): LocalAuthStorage {
  if (typeof window === "undefined") {
    return { email: defaultEmail };
  }

  try {
    const stored = window.localStorage.getItem(localAuthStorageKey);
    return stored ? { email: defaultEmail, ...JSON.parse(stored) } : { email: defaultEmail };
  } catch {
    return { email: defaultEmail };
  }
}

export function writeLocalAuthStorage(value: LocalAuthStorage) {
  window.localStorage.setItem(localAuthStorageKey, JSON.stringify(value));
}

export function clearLocalAuthStorage() {
  window.localStorage.removeItem(localAuthStorageKey);
}
