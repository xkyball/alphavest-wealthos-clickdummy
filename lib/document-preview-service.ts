import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import type { Prisma, PrismaClient } from "@prisma/client";

import { activeDocumentStorageAdapter } from "@/lib/document-storage-adapter";

const execFileAsync = promisify(execFile);

export type DocumentDerivativeKind = "thumbnail" | "preview";
export type DocumentDerivativeStatus = "PENDING" | "READY" | "FAILED";
export type DocumentDerivativeSummary = {
  height: number | null;
  id: string;
  kind: DocumentDerivativeKind;
  mimeType: string | null;
  status: DocumentDerivativeStatus;
  width: number | null;
};

type CreateDocumentPreviewDerivativesInput = {
  documentId: string;
  fileName: string;
  mimeType: string;
  originalBytes: Buffer;
  originalStorageKey: string;
  tenantSlug: string;
  versionId: string;
};

const imageMimeTypes = new Set(["image/png", "image/jpeg", "image/tiff"]);

function extensionForMimeType(mimeType: string) {
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/tiff") return ".tif";
  if (mimeType === "application/pdf") return ".pdf";
  return path.extname(fileNameFallback(mimeType)) || ".bin";
}

function fileNameFallback(mimeType: string) {
  return mimeType.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function derivativeStorageKey(input: {
  documentId: string;
  kind: DocumentDerivativeKind;
  tenantSlug: string;
}) {
  return `tenants/${input.tenantSlug}/document-derivatives/${input.documentId}/${input.kind}.webp`;
}

function isPreviewRenderable(mimeType: string) {
  return imageMimeTypes.has(mimeType) || mimeType === "application/pdf";
}

function safePreviewLabel(value: string, fallback: string) {
  const normalized = value.replace(/[^a-zA-Z0-9._ -]/g, " ").replace(/\s+/g, " ").trim();
  return (normalized || fallback).slice(0, 72);
}

async function runMagickDocumentCard(input: {
  fileName: string;
  kind: DocumentDerivativeKind;
  mimeType: string;
}) {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "alphavest-document-card-"));
  const outputPath = path.join(tmpDir, `${input.kind}.webp`);
  const dimensions = input.kind === "thumbnail"
    ? { height: 220, pointSize: 16, width: 320 }
    : { height: 720, pointSize: 34, width: 960 };
  const label = safePreviewLabel(input.fileName, "Uploaded document");
  const typeLabel = safePreviewLabel(input.mimeType, "Document");

  try {
    await execFileAsync("magick", [
      "-size",
      `${dimensions.width}x${dimensions.height}`,
      "xc:#0F1B2D",
      "-fill",
      "#D8B45F",
      "-gravity",
      "north",
      "-pointsize",
      String(Math.max(12, Math.round(dimensions.pointSize * 0.72))),
      "-annotate",
      `+0+${input.kind === "thumbnail" ? 24 : 96}`,
      "DOCUMENT PREVIEW",
      "-fill",
      "#F4EFE4",
      "-gravity",
      "center",
      "-pointsize",
      String(dimensions.pointSize),
      "-annotate",
      "+0-16",
      label,
      "-fill",
      "#8FA3B8",
      "-gravity",
      "south",
      "-pointsize",
      String(Math.max(11, Math.round(dimensions.pointSize * 0.56))),
      "-annotate",
      `+0+${input.kind === "thumbnail" ? 26 : 96}`,
      typeLabel,
      "-quality",
      "82",
      outputPath,
    ]);

    const bytes = await readFile(outputPath);

    return {
      bytes,
      height: dimensions.height,
      width: dimensions.width,
    };
  } finally {
    await rm(tmpDir, { force: true, recursive: true });
  }
}

async function runMagickPreview(input: {
  fileName: string;
  kind: DocumentDerivativeKind;
  mimeType: string;
  originalBytes: Buffer;
}) {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "alphavest-document-preview-"));
  const sourcePath = path.join(tmpDir, `source${extensionForMimeType(input.mimeType)}`);
  const rasterPath = path.join(tmpDir, "source-page.png");
  const outputPath = path.join(tmpDir, `${input.kind}.webp`);
  const resize = input.kind === "thumbnail" ? "320x220>" : "960x720>";

  if (!isPreviewRenderable(input.mimeType)) {
    return runMagickDocumentCard({
      fileName: input.fileName,
      kind: input.kind,
      mimeType: input.mimeType,
    });
  }

  try {
    await writeFile(sourcePath, input.originalBytes);
    const sourceForMagick =
      input.mimeType === "application/pdf"
        ? rasterPath
        : sourcePath;

    if (input.mimeType === "application/pdf") {
      await execFileAsync("gs", [
        "-dSAFER",
        "-dBATCH",
        "-dNOPAUSE",
        "-dFirstPage=1",
        "-dLastPage=1",
        "-sDEVICE=pngalpha",
        "-r144",
        `-sOutputFile=${rasterPath}`,
        sourcePath,
      ]);
    }

    await execFileAsync("magick", [
      sourceForMagick,
      "-auto-orient",
      "-thumbnail",
      resize,
      "-background",
      "#0F1B2D",
      "-alpha",
      "remove",
      "-quality",
      "82",
      outputPath,
    ]);

    const bytes = await readFile(outputPath);

    return {
      bytes,
      height: input.kind === "thumbnail" ? 220 : 720,
      width: input.kind === "thumbnail" ? 320 : 960,
    };
  } finally {
    await rm(tmpDir, { force: true, recursive: true });
  }
}

function failedDerivative(input: {
  documentId: string;
  errorCode: string;
  kind: DocumentDerivativeKind;
  versionId: string;
}): Prisma.DocumentDerivativeCreateManyInput & {
  height: null;
  id: string;
  kind: DocumentDerivativeKind;
  mimeType: null;
  status: DocumentDerivativeStatus;
  width: null;
} {
  return {
    documentId: input.documentId,
    errorCode: input.errorCode,
    generationStrategy: "imagemagick",
    height: null,
    id: randomUUID(),
    kind: input.kind,
    mimeType: null,
    status: "FAILED" as const,
    versionId: input.versionId,
    width: null,
  };
}

export async function createDocumentPreviewDerivatives(
  prisma: PrismaClient | Prisma.TransactionClient,
  input: CreateDocumentPreviewDerivativesInput,
): Promise<DocumentDerivativeSummary[]> {
  const kinds: DocumentDerivativeKind[] = ["thumbnail", "preview"];

  const derivativeRows: Array<Prisma.DocumentDerivativeCreateManyInput & {
    height: number | null;
    id: string;
    kind: DocumentDerivativeKind;
    mimeType: string | null;
    status: DocumentDerivativeStatus;
    width: number | null;
  }> = [];

  for (const kind of kinds) {
    try {
      const generated = await runMagickPreview({
        fileName: input.fileName,
        kind,
        mimeType: input.mimeType,
        originalBytes: input.originalBytes,
      });
      const storageKey = derivativeStorageKey({
        documentId: input.documentId,
        kind,
        tenantSlug: input.tenantSlug,
      });
      const stored = await activeDocumentStorageAdapter().putObject({
        bytes: generated.bytes,
        contentType: "image/webp",
        fileName: `${kind}.webp`,
        storageKey,
      });

      derivativeRows.push({
        byteSize: generated.bytes.length,
        documentId: input.documentId,
        generationStrategy: isPreviewRenderable(input.mimeType) ? "imagemagick" : "imagemagick_document_card",
        height: generated.height,
        id: randomUUID(),
        kind,
        mimeType: "image/webp",
        status: "READY" as const,
        storageKey: stored.storageKey,
        versionId: input.versionId,
        width: generated.width,
      });
    } catch {
      derivativeRows.push(
        failedDerivative({
          documentId: input.documentId,
          errorCode: "preview_generation_failed",
          kind,
          versionId: input.versionId,
        }),
      );
    }
  }

  await prisma.documentDerivative.createMany({ data: derivativeRows });

  return derivativeRows.map((row) => ({
    height: row.height,
    id: row.id,
    kind: row.kind,
    mimeType: row.mimeType,
    status: row.status,
    width: row.width,
  }));
}

export function publicDocumentDerivativeUrl(derivativeId?: string | null) {
  return derivativeId ? `/api/documents/derivatives/${derivativeId}` : null;
}
