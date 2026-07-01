import { routeToSmokePath, screenRoutes } from "@/lib/route-registry";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const stage07PageIds = new Set(["001", "002", "003", "004", "005", "006"]);

const checks = screenRoutes
  .filter((route) => stage07PageIds.has(route.pageId))
  .map((route) => ({
    expected: route.title,
    pageId: route.pageId,
    path: routeToSmokePath(route.route)
  }));

async function main() {
  const failures: string[] = [];

  for (const check of checks) {
    const url = new URL(check.path, baseUrl);
    const response = await fetch(url);
    const body = await response.text();

    if (!response.ok) {
      failures.push(`${check.pageId} ${check.path} returned ${response.status}`);
      continue;
    }

    if (!body.includes(check.expected)) {
      failures.push(`${check.pageId} ${check.path} did not include ${check.expected}`);
    }
  }

  if (failures.length > 0) {
    console.error(JSON.stringify({ checked: checks.length, failures }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({ checked: checks.length, failures: 0 }, null, 2));
}

void main();
