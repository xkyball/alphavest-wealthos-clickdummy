export const localAuthSessionCookieName = "alphavest_local_auth_session";
export const localAuthSessionMaxAgeSeconds = 60 * 60 * 8;

export function isLocalAuthSessionToken(value?: string | null) {
  return typeof value === "string" && value.startsWith("av-session-") && value.length > "av-session-".length;
}
