import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

import {
  CurrentUserActorSessionError,
  resolveCurrentUserActorSession,
} from "@/lib/auth/current-user-actor-session";
import { activeDocumentStorageAdapter } from "@/lib/document-storage-adapter";
import { prismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const allowedProfileImageMimeTypes = new Set(["image/jpeg", "image/png", "image/tiff", "image/webp"]);

function avatarFailure(status: number, error: string, reasonCode: string) {
  return NextResponse.json(
    {
      error,
      ok: false,
      reasonCode,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        storageKeyDisclosed: false,
      },
    },
    { status },
  );
}

function extensionForMimeType(mimeType: string) {
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/tiff") return ".tif";
  if (mimeType === "image/webp") return ".webp";
  return ".bin";
}

function responseBodyFromBuffer(bytes: Buffer) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function cropProfileImage(input: { bytes: Buffer; mimeType: string }) {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "alphavest-profile-avatar-"));
  const inputPath = path.join(tmpDir, `source${extensionForMimeType(input.mimeType)}`);
  const outputPath = path.join(tmpDir, "avatar.webp");

  try {
    await writeFile(inputPath, input.bytes);
    await execFileAsync("magick", [
      inputPath,
      "-auto-orient",
      "-resize",
      "512x512^",
      "-gravity",
      "center",
      "-extent",
      "512x512",
      "-quality",
      "86",
      outputPath,
    ]);

    return await readFile(outputPath);
  } finally {
    await rm(tmpDir, { force: true, recursive: true }).catch(() => undefined);
  }
}

export async function GET(request: Request) {
  try {
    const { session } = await resolveCurrentUserActorSession(prismaClient(), request);
    const actor = await prismaClient().user.findUnique({
      select: { profileImageMimeType: true, profileImageStorageKey: true },
      where: { id: session.actor.id },
    });

    if (!actor?.profileImageStorageKey) {
      return avatarFailure(404, "No profile image is available for this account.", "PROFILE_IMAGE_NOT_FOUND");
    }

    const stored = await activeDocumentStorageAdapter().getObject({ storageKey: actor.profileImageStorageKey });
    return new Response(responseBodyFromBuffer(stored.bytes), {
      headers: {
        "cache-control": "private, max-age=60",
        "content-type": actor.profileImageMimeType ?? "image/webp",
      },
      status: 200,
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return avatarFailure(error.status, "Profile image is not available for this user.", error.reasonCode);
    }

    return avatarFailure(404, "Profile image is not available for this account.", "PROFILE_IMAGE_UNAVAILABLE");
  }
}

export async function POST(request: Request) {
  try {
    const { session } = await resolveCurrentUserActorSession(prismaClient(), request);
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return avatarFailure(400, "A profile image file is required.", "PROFILE_IMAGE_FILE_REQUIRED");
    }

    if (!allowedProfileImageMimeTypes.has(file.type)) {
      return avatarFailure(400, "Profile image must be PNG, JPG, WebP or TIFF.", "PROFILE_IMAGE_TYPE_UNSUPPORTED");
    }

    const sourceBytes = Buffer.from(await file.arrayBuffer());
    if (sourceBytes.length <= 0 || sourceBytes.length > 5 * 1024 * 1024) {
      return avatarFailure(400, "Profile image must be between 1 byte and 5 MB.", "PROFILE_IMAGE_SIZE_INVALID");
    }

    const avatarBytes = await cropProfileImage({ bytes: sourceBytes, mimeType: file.type });
    const storageKey = `tenants/${session.tenant.slug}/profile-images/${session.actor.id}-${randomUUID()}.webp`;
    const stored = await activeDocumentStorageAdapter().putObject({
      bytes: avatarBytes,
      contentType: "image/webp",
      fileName: "profile-avatar.webp",
      storageKey,
    });
    const updated = await prismaClient().user.update({
      data: {
        profileImageMimeType: "image/webp",
        profileImageStorageKey: stored.storageKey,
      },
      select: { updatedAt: true },
      where: { id: session.actor.id },
    });

    return NextResponse.json({
      ok: true,
      result: {
        contentType: "image/webp",
        profileImageUrl: `/api/profile/avatar?v=${encodeURIComponent(updated.updatedAt.toISOString())}`,
      },
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        storageKeyDisclosed: false,
      },
    });
  } catch (error) {
    if (error instanceof CurrentUserActorSessionError) {
      return avatarFailure(error.status, "Profile image is not available for this user.", error.reasonCode);
    }

    return avatarFailure(500, "Profile image could not be processed.", "PROFILE_IMAGE_PROCESSING_FAILED");
  }
}
