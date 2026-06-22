export const demoAuthSessionCookieName = "alphavest_dummy_auth_session";
export const demoAuthSessionMaxAgeSeconds = 60 * 60 * 8;

export function isDemoAuthSessionToken(value?: string | null) {
  return typeof value === "string" && value.startsWith("av-session-") && value.length > "av-session-".length;
}
