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

async function runMagickPreview(input: {
  kind: DocumentDerivativeKind;
  mimeType: string;
  originalBytes: Buffer;
}) {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "alphavest-document-preview-"));
  const sourcePath = path.join(tmpDir, `source${extensionForMimeType(input.mimeType)}`);
  const rasterPath = path.join(tmpDir, "source-page.png");
  const outputPath = path.join(tmpDir, `${input.kind}.webp`);
  const resize = input.kind === "thumbnail" ? "320x220>" : "960x720>";

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

  if (!isPreviewRenderable(input.mimeType)) {
    const failedRows = kinds.map((kind) =>
      failedDerivative({
        documentId: input.documentId,
        errorCode: "preview_renderer_not_available_for_type",
        kind,
        versionId: input.versionId,
      }),
    );
    await prisma.documentDerivative.createMany({ data: failedRows });
    return failedRows.map((row) => ({
      height: null,
      id: row.id,
      kind: row.kind,
      mimeType: null,
      status: row.status,
      width: null,
    }));
  }

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
        generationStrategy: "imagemagick",
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
