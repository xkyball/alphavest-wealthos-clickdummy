import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { routeSmokeList, routeToSmokePath, screenRoutes } from "@/lib/route-registry";
import { forbiddenVisualChromeTerms, visualStateForRoute } from "@/lib/visual-contract";

type ContractResult = {
  checkedRoutes: number;
  checkedAssets: number;
  failures: string[];
  fetchedRoutes: number;
};

const root = process.cwd();
const baseUrl = process.env.VISUAL_QA_BASE_URL ?? process.env.BASE_URL;
const artifactDir = path.join(root, "artifacts", "visual-qa");
const forbiddenFetchedChromeTerms = forbiddenVisualChromeTerms.filter((term) => term !== "public/reference");
const sourceFilesToScan = [
  "app",
  "components",
  "lib",
  "scripts"
];

function collectSourceFiles(entry: string, output: string[] = []) {
  const fullPath = path.join(root, entry);

  if (!existsSync(fullPath)) {
    return output;
  }

  const stat = statSync(fullPath);

  if (stat.isDirectory()) {
    for (const child of readdirSync(fullPath)) {
      collectSourceFiles(path.join(entry, child), output);
    }
    return output;
  }

  if (/\.(ts|tsx|css)$/.test(entry)) {
    output.push(fullPath);
  }

  return output;
}

async function fetchRoute(pathname: string) {
  if (!baseUrl) {
    return undefined;
  }

  const url = new URL(pathname, baseUrl);
  const response = await fetch(url);
  const text = await response.text();

  return { response, text, url: url.toString() };
}

async function main() {
  const failures: string[] = [];
  let fetchedRoutes = 0;

  mkdirSync(artifactDir, { recursive: true });

  for (const route of screenRoutes) {
    const assetPath = path.join(root, route.visualAsset);

    if (!existsSync(assetPath)) {
      failures.push(`${route.pageId} missing visual asset ${route.visualAsset}`);
    }

    const smokePath = routeToSmokePath(route.route);
    const visualState = visualStateForRoute(route);
    const routeWithState = visualState === "base" ? smokePath : `${smokePath}?state=${visualState}`;

    if (!routeSmokeList.some((item) => item.pageId === route.pageId && item.path === smokePath)) {
      failures.push(`${route.pageId} missing smoke route mapping for ${smokePath}`);
    }

    const fetched = await fetchRoute(routeWithState);

    if (fetched) {
      fetchedRoutes += 1;

      if (!fetched.response.ok) {
        failures.push(`${route.pageId} ${fetched.url} returned ${fetched.response.status}`);
        continue;
      }

      if (!fetched.text.includes(route.title)) {
        failures.push(`${route.pageId} ${fetched.url} does not include heading ${route.title}`);
      }

      for (const term of forbiddenFetchedChromeTerms) {
        if (fetched.text.includes(term)) {
          failures.push(`${route.pageId} ${fetched.url} leaks visual chrome term ${term}`);
        }
      }
    }
  }

  for (const file of sourceFilesToScan.flatMap((entry) => collectSourceFiles(entry))) {
    const text = readFileSync(file, "utf8");
    const relative = path.relative(root, file);

    for (const term of forbiddenVisualChromeTerms) {
      if (
        text.includes(term) &&
        relative !== "lib/route-registry.ts" &&
        relative !== "lib/visual-contract.ts" &&
        relative !== "scripts/visual-qa-contract.ts"
      ) {
        failures.push(`${relative} contains forbidden visual chrome term ${term}`);
      }
    }
  }

  const result: ContractResult = {
    checkedAssets: screenRoutes.length,
    checkedRoutes: screenRoutes.length,
    failures,
    fetchedRoutes
  };

  writeFileSync(path.join(artifactDir, "visual-contract-result.json"), `${JSON.stringify(result, null, 2)}\n`);

  if (failures.length > 0) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
}

void main();
