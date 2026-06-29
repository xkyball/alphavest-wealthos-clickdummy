import { execFileSync } from "node:child_process";
import path from "node:path";

export function seedDemoDatabase() {
  execFileSync(path.join(process.cwd(), "node_modules/.bin/tsx"), ["prisma/seed.ts"], {
    env: {
      ...process.env,
      ALPHAVEST_DATA_MODE: process.env.ALPHAVEST_DATA_MODE ?? "demo",
    },
    stdio: "inherit",
  });
}
