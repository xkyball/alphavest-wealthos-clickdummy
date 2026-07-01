import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

export function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeText(filePath: string, value: string) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, value);
}

export function repoPath(...segments: string[]) {
  return path.join(process.cwd(), ...segments);
}

export function timestampRunId(prefix = "process-universe") {
  return `${new Date().toISOString().replace(/[.:]/g, "-")}-${prefix}`;
}
