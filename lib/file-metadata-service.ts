import { createHash } from "node:crypto";

export type DemoFileCategory = "documents" | "exports";

export type FileMetadataDraft = {
  category: DemoFileCategory;
  checksumSeed: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  tenantSlug: string;
};

export type PreparedFileMetadata = {
  checksum: string;
  contentAddress: string;
  fileName: string;
  fileSizeBytes: number;
  issues: string[];
  mimeType: string;
  storageKey: string;
  valid: boolean;
};

const allowedMimeTypes = new Set([
  "application/json",
  "application/pdf",
  "application/zip",
  "text/csv",
]);

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function isSafeFileName(fileName: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,180}$/.test(fileName) && !fileName.includes("..");
}

export function prepareDemoFileMetadata(input: FileMetadataDraft): PreparedFileMetadata {
  const issues: string[] = [];

  if (!isSafeFileName(input.fileName)) {
    issues.push("safe_file_name_required");
  }

  if (!allowedMimeTypes.has(input.mimeType)) {
    issues.push("supported_mime_type_required");
  }

  if (!Number.isInteger(input.fileSizeBytes) || input.fileSizeBytes <= 0) {
    issues.push("positive_file_size_required");
  }

  if (!input.checksumSeed.trim()) {
    issues.push("checksum_seed_required");
  }

  const checksum = sha256(input.checksumSeed);
  const storageKey = `demo/${input.tenantSlug}/${input.category}/${checksum.slice(0, 12)}-${input.fileName}`;

  return {
    checksum,
    contentAddress: `sha256:${checksum}`,
    fileName: input.fileName,
    fileSizeBytes: input.fileSizeBytes,
    issues,
    mimeType: input.mimeType,
    storageKey,
    valid: issues.length === 0,
  };
}

export const fileMetadataService = {
  prepareDemoFileMetadata,
};
