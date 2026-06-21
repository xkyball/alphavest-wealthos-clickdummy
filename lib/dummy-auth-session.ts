export const dummyAuthSessionCookieName = "alphavest_dummy_auth_session";
export const dummyAuthSessionMaxAgeSeconds = 60 * 60 * 8;

export function isDummyAuthSessionToken(value?: string | null) {
  return typeof value === "string" && value.startsWith("av-session-") && value.length > "av-session-".length;
}
