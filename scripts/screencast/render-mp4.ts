import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { repoPath, writeJson } from "./lib/io";

const journeyDirArg = process.argv.find((arg) => arg.startsWith("--journey-dir="));
const journeyDir = journeyDirArg ? path.resolve(journeyDirArg.slice("--journey-dir=".length)) : process.cwd();
const rawVideo = path.join(journeyDir, "raw-video.webm");
const captions = path.join(journeyDir, "captions.srt");
const mp4 = path.join(journeyDir, "journey.mp4");
const ffmpeg = process.env.SCREENCAST_FFMPEG ?? "ffmpeg";

if (!existsSync(rawVideo)) {
  console.error(`raw-video.webm not found in ${journeyDir}`);
  process.exit(1);
}

const args = existsSync(captions)
  ? ["-y", "-i", rawVideo, "-vf", `subtitles=${captions.replaceAll(":", "\\:")}`, "-pix_fmt", "yuv420p", mp4]
  : ["-y", "-i", rawVideo, "-pix_fmt", "yuv420p", mp4];
const result = spawnSync(ffmpeg, args, { encoding: "utf8" });

writeJson(path.join(journeyDir, "mp4-result.json"), {
  command: `${ffmpeg} ${args.join(" ")}`,
  stderr: result.stderr,
  stdout: result.stdout,
  status: result.status,
  output: existsSync(mp4) ? path.relative(repoPath(), mp4) : null,
});

if (result.status !== 0) process.exitCode = result.status ?? 1;
