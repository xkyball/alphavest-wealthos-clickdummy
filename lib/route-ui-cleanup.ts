const v096SetupAdminPageIds = new Set([
  "007",
  "008",
  "009",
  "010",
  "011",
  "012",
  "013",
  "014",
  "015",
  "016",
  "017",
  "018",
]);

const v096ExportPageIds = new Set(["054", "055", "056", "057", "058"]);
const v096GovernancePageIds = new Set(["048", "049", "050", "051"]);

function cleanPathname(pathname: string) {
  const cleanPath = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  return cleanPath.length > 1 ? cleanPath.replace(/\/+$/, "") : cleanPath;
}

export function isV096SetupAdminPageId(pageId?: string) {
  return Boolean(pageId && v096SetupAdminPageIds.has(pageId));
}

export function isV096ExportPageId(pageId?: string) {
  return Boolean(pageId && v096ExportPageIds.has(pageId));
}

export function isV096GovernancePageId(pageId?: string) {
  return Boolean(pageId && v096GovernancePageIds.has(pageId));
}

export function hasV096CleanRouteChrome(pageId?: string) {
  return isV096SetupAdminPageId(pageId) || isV096ExportPageId(pageId) || isV096GovernancePageId(pageId);
}

export function isV096GovernancePathname(pathname: string) {
  const normalized = cleanPathname(pathname);
  return normalized === "/governance" || normalized.startsWith("/governance/");
}

export function isV096SetupAdminPathname(pathname: string) {
  const normalized = cleanPathname(pathname);

  return (
    normalized === "/admin" ||
    normalized.startsWith("/admin/") ||
    normalized === "/tenants/new" ||
    normalized.startsWith("/tenants/")
  );
}

export function isV096ExportPathname(pathname: string) {
  const normalized = cleanPathname(pathname);
  return normalized === "/export" || normalized.startsWith("/export/");
}

export function shouldSuppressV096RouteGuidance(pathname: string) {
  return isV096SetupAdminPathname(pathname) || isV096ExportPathname(pathname) || isV096GovernancePathname(pathname);
}
