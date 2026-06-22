export const demoAuthStorageKey = "alphavest.dummyAuth.v1";

export type DemoAuthStorage = {
  email: string;
  inviteToken?: string;
  nextStep?: string;
};

export type DemoAuthResponse = {
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

export function readDemoAuthStorage(defaultEmail: string): DemoAuthStorage {
  if (typeof window === "undefined") {
    return { email: defaultEmail };
  }

  try {
    const stored = window.localStorage.getItem(demoAuthStorageKey);
    return stored ? { email: defaultEmail, ...JSON.parse(stored) } : { email: defaultEmail };
  } catch {
    return { email: defaultEmail };
  }
}

export function writeDemoAuthStorage(value: DemoAuthStorage) {
  window.localStorage.setItem(demoAuthStorageKey, JSON.stringify(value));
}
