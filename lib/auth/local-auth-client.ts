export const localAuthStorageKey = "alphavest.localAuth.v1";

export type LocalAuthStorage = {
  email: string;
  inviteToken?: string;
  nextStep?: string;
  providerId?: string;
};

export type LocalAuthResponse = {
  ok: boolean;
  challengeId?: string;
  error?: string;
  nextStep?: "mfa_required" | "invite_acceptance_required" | "denied";
  reasonCode?: string;
  result?: {
    accepted?: boolean;
    session?: {
      displayName: string;
      email: string;
      roleName?: string;
      tenantName?: string;
    };
  };
  safeMessage?: string;
  user?: {
    displayName: string;
    email: string;
    inviteToken?: string;
    roleName?: string;
    tenantName?: string;
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
