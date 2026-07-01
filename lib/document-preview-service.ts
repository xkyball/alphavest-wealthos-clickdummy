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
const textPreviewMimeTypes = new Set([
  "application/csv",
  "application/vnd.ms-excel",
  "text/csv",
  "text/plain",
  "text/tab-separated-values",
]);

const docxMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const xlsxMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type GeneratedDerivative = {
  bytes: Buffer;
  generationStrategy: "imagemagick" | "imagemagick_content_preview" | "imagemagick_document_card";
  height: number;
  width: number;
};

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

function isContentPreviewReadable(mimeType: string) {
  return textPreviewMimeTypes.has(mimeType) || mimeType === docxMimeType || mimeType === xlsxMimeType;
}

function safePreviewLabel(value: string, fallback: string) {
  const normalized = value.replace(/[^a-zA-Z0-9._ -]/g, " ").replace(/\s+/g, " ").trim();
  return (normalized || fallback).slice(0, 72);
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function normalizePreviewText(value: string) {
  return decodeXmlEntities(value)
    .replace(/\0/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 18)
    .join("\n")
    .slice(0, 1600);
}

function previewTextFromDelimitedBytes(originalBytes: Buffer) {
  const decoded = originalBytes.toString("utf8");
  const rows = decoded
    .split(/\r?\n/)
    .map((row) => row.split(/,|\t|;/).map((cell) => cell.trim()).filter(Boolean).join(" | "))
    .join("\n");

  return normalizePreviewText(rows);
}

async function unzipXml(sourcePath: string, entryPath: string) {
  try {
    const { stdout } = await execFileAsync("unzip", ["-p", sourcePath, entryPath], { maxBuffer: 1024 * 1024 });
    return stdout;
  } catch {
    return "";
  }
}

async function previewTextFromDocx(sourcePath: string) {
  const xml = await unzipXml(sourcePath, "word/document.xml");
  const withBreaks = xml
    .replace(/<w:(?:p|br|tab)\b[^>]*>/g, "\n")
    .replace(/<[^>]+>/g, " ");

  return normalizePreviewText(withBreaks);
}

async function previewTextFromXlsx(sourcePath: string) {
  const sharedStringsXml = await unzipXml(sourcePath, "xl/sharedStrings.xml");
  const sharedStrings = [...sharedStringsXml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
    .map((match) => decodeXmlEntities(match[1] ?? "").trim())
    .filter(Boolean);

  if (sharedStrings.length > 0) {
    return normalizePreviewText(sharedStrings.join("\n"));
  }

  const sheetXml = await unzipXml(sourcePath, "xl/worksheets/sheet1.xml");
  const inlineStrings = [...sheetXml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
    .map((match) => decodeXmlEntities(match[1] ?? "").trim())
    .filter(Boolean);

  return normalizePreviewText(inlineStrings.join("\n"));
}

async function contentPreviewText(input: {
  mimeType: string;
  originalBytes: Buffer;
  sourcePath: string;
}) {
  if (textPreviewMimeTypes.has(input.mimeType)) {
    return previewTextFromDelimitedBytes(input.originalBytes);
  }

  if (input.mimeType === docxMimeType) {
    return previewTextFromDocx(input.sourcePath);
  }

  if (input.mimeType === xlsxMimeType) {
    return previewTextFromXlsx(input.sourcePath);
  }

  return "";
}

async function runMagickDocumentCard(input: {
  fileName: string;
  kind: DocumentDerivativeKind;
  mimeType: string;
}): Promise<GeneratedDerivative> {
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
      generationStrategy: "imagemagick_document_card",
      height: dimensions.height,
      width: dimensions.width,
    };
  } finally {
    await rm(tmpDir, { force: true, recursive: true });
  }
}

async function runMagickContentPreview(input: {
  fileName: string;
  kind: DocumentDerivativeKind;
  mimeType: string;
  originalBytes: Buffer;
  sourcePath: string;
}): Promise<GeneratedDerivative | null> {
  const previewText = await contentPreviewText(input);

  if (!previewText) {
    return null;
  }

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "alphavest-document-content-preview-"));
  const outputPath = path.join(tmpDir, `${input.kind}.webp`);
  const textPath = path.join(tmpDir, "preview-text.txt");
  const captionPath = path.join(tmpDir, "caption.png");
  const dimensions = input.kind === "thumbnail"
    ? { captionHeight: 88, captionWidth: 264, height: 220, pointSize: 14, titleSize: 15, width: 320 }
    : { captionHeight: 420, captionWidth: 832, height: 720, pointSize: 26, titleSize: 28, width: 960 };
  const label = safePreviewLabel(input.fileName, "Uploaded document");

  try {
    await writeFile(textPath, previewText);
    await execFileAsync("magick", [
      "-background",
      "none",
      "-fill",
      "#F4EFE4",
      "-pointsize",
      String(dimensions.pointSize),
      "-size",
      `${dimensions.captionWidth}x${dimensions.captionHeight}`,
      `caption:@${textPath}`,
      captionPath,
    ]);
    await execFileAsync("magick", [
      "-size",
      `${dimensions.width}x${dimensions.height}`,
      "xc:#0F1B2D",
      "-fill",
      "#D8B45F",
      "-gravity",
      "northwest",
      "-pointsize",
      String(dimensions.titleSize),
      "-annotate",
      `+${input.kind === "thumbnail" ? 24 : 48}+${input.kind === "thumbnail" ? 24 : 48}`,
      "DOCUMENT PREVIEW",
      "-fill",
      "#8FA3B8",
      "-pointsize",
      String(Math.max(11, Math.round(dimensions.pointSize * 0.62))),
      "-annotate",
      `+${input.kind === "thumbnail" ? 24 : 48}+${input.kind === "thumbnail" ? 52 : 96}`,
      label,
      captionPath,
      "-geometry",
      `+${input.kind === "thumbnail" ? 24 : 64}+${input.kind === "thumbnail" ? 86 : 164}`,
      "-composite",
      "-quality",
      "82",
      outputPath,
    ]);

    const bytes = await readFile(outputPath);

    return {
      bytes,
      generationStrategy: "imagemagick_content_preview",
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
}): Promise<GeneratedDerivative> {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "alphavest-document-preview-"));
  const sourcePath = path.join(tmpDir, `source${extensionForMimeType(input.mimeType)}`);
  const rasterPath = path.join(tmpDir, "source-page.png");
  const outputPath = path.join(tmpDir, `${input.kind}.webp`);
  const resize = input.kind === "thumbnail" ? "320x220>" : "960x720>";

  try {
    await writeFile(sourcePath, input.originalBytes);

    if (!isPreviewRenderable(input.mimeType)) {
      const contentPreview = isContentPreviewReadable(input.mimeType)
        ? await runMagickContentPreview({
            fileName: input.fileName,
            kind: input.kind,
            mimeType: input.mimeType,
            originalBytes: input.originalBytes,
            sourcePath,
          })
        : null;

      return contentPreview ?? runMagickDocumentCard({
        fileName: input.fileName,
        kind: input.kind,
        mimeType: input.mimeType,
      });
    }

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
      generationStrategy: "imagemagick",
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
        generationStrategy: generated.generationStrategy,
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
