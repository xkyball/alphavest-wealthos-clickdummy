import { createHash, createHmac } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredDocumentObject = {
  absolutePath: string;
  storageKey: string;
};

export type StoreDocumentObjectInput = {
  bytes: Buffer;
  contentType?: string;
  fileName: string;
  storageKey: string;
};

export type ReadDocumentObjectResult = {
  bytes: Buffer;
  storageKey: string;
};

export type DocumentObjectStorageAdapter = {
  getObject(input: { storageKey: string }): Promise<ReadDocumentObjectResult>;
  putObject(input: StoreDocumentObjectInput): Promise<StoredDocumentObject>;
};

export type DocumentObjectStorageDriver = "local" | "s3";

const defaultDocumentStorageRootSegments = ["tmp", "document-object-storage"] as const;

export function assertSafeDocumentStorageKey(storageKey: string) {
  if (!storageKey || path.isAbsolute(storageKey) || storageKey.split(/[\\/]+/).includes("..")) {
    throw new Error("Unsafe storage key.");
  }
}

export function documentStorageRoot() {
  const configuredRoot = process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT?.trim();

  if (configuredRoot) {
    return path.resolve(/* turbopackIgnore: true */ configuredRoot);
  }

  return path.join(/* turbopackIgnore: true */ process.cwd(), ...defaultDocumentStorageRootSegments);
}

export function safeDocumentStoragePath(storageKey: string) {
  assertSafeDocumentStorageKey(storageKey);

  const root = documentStorageRoot();
  const absolutePath = path.join(/* turbopackIgnore: true */ root, storageKey);
  const relativePath = path.relative(root, absolutePath);

  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Unsafe storage key.");
  }

  return absolutePath;
}

export const localDocumentStorageAdapter: DocumentObjectStorageAdapter = {
  async getObject(input: { storageKey: string }): Promise<ReadDocumentObjectResult> {
    const absolutePath = safeDocumentStoragePath(input.storageKey);
    const bytes = await readFile(absolutePath);

    return {
      bytes,
      storageKey: input.storageKey,
    };
  },

  async putObject(input: StoreDocumentObjectInput): Promise<StoredDocumentObject> {
    const absolutePath = safeDocumentStoragePath(input.storageKey);

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, input.bytes);

    return {
      absolutePath,
      storageKey: input.storageKey,
    };
  },
};

function s3Config() {
  return {
    accessKeyId: process.env.ALPHAVEST_S3_ACCESS_KEY_ID ?? "alphavest",
    bucket: process.env.ALPHAVEST_S3_BUCKET ?? "alphavest-documents",
    endpoint: process.env.ALPHAVEST_S3_ENDPOINT ?? "http://127.0.0.1:9000",
    region: process.env.ALPHAVEST_S3_REGION ?? "us-east-1",
    secretAccessKey: process.env.ALPHAVEST_S3_SECRET_ACCESS_KEY ?? "alphavest-local-secret",
  };
}

function iso8601Basic(date = new Date()) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function dateStamp(amzDate: string) {
  return amzDate.slice(0, 8);
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function sha256Hex(bytes: Buffer | string) {
  return createHash("sha256").update(bytes).digest("hex");
}

function bodyFromBuffer(bytes: Buffer) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function signingKey(secretAccessKey: string, stamp: string, region: string) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, stamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, "s3");
  return hmac(serviceKey, "aws4_request");
}

function s3ObjectUrl(endpoint: string, bucket: string, storageKey: string) {
  assertSafeDocumentStorageKey(storageKey);

  const url = new URL(endpoint);
  const encodedKey = storageKey.split("/").map(encodeURIComponent).join("/");
  url.pathname = `${url.pathname.replace(/\/$/, "")}/${bucket}/${encodedKey}`;
  return url;
}

function signedS3Headers(input: {
  bytes?: Buffer;
  contentType?: string;
  method: "GET" | "PUT";
  storageKey: string;
}) {
  assertSafeDocumentStorageKey(input.storageKey);

  const config = s3Config();
  const url = s3ObjectUrl(config.endpoint, config.bucket, input.storageKey);
  const amzDate = iso8601Basic();
  const stamp = dateStamp(amzDate);
  const payloadHash = sha256Hex(input.bytes ?? "");
  const headers: Record<string, string> = {
    host: url.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  if (input.contentType) {
    headers["content-type"] = input.contentType;
  }

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaderNames.map((name) => `${name}:${headers[name]}\n`).join("");
  const canonicalRequest = [
    input.method,
    url.pathname,
    "",
    canonicalHeaders,
    signedHeaderNames.join(";"),
    payloadHash,
  ].join("\n");
  const credentialScope = `${stamp}/${config.region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const signature = createHmac("sha256", signingKey(config.secretAccessKey, stamp, config.region))
    .update(stringToSign)
    .digest("hex");

  return {
    headers: {
      ...headers,
      authorization: `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaderNames.join(";")}, Signature=${signature}`,
    },
    url,
  };
}

export const s3CompatibleDocumentStorageAdapter: DocumentObjectStorageAdapter = {
  async getObject(input: { storageKey: string }): Promise<ReadDocumentObjectResult> {
    const { headers, url } = signedS3Headers({ method: "GET", storageKey: input.storageKey });
    const response = await fetch(url, { headers, method: "GET" });

    if (!response.ok) {
      throw new Error("Unable to read document object.");
    }

    return {
      bytes: Buffer.from(await response.arrayBuffer()),
      storageKey: input.storageKey,
    };
  },

  async putObject(input: StoreDocumentObjectInput): Promise<StoredDocumentObject> {
    const { headers, url } = signedS3Headers({
      bytes: input.bytes,
      contentType: input.contentType,
      method: "PUT",
      storageKey: input.storageKey,
    });
    const response = await fetch(url, {
      body: bodyFromBuffer(input.bytes),
      headers,
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Unable to store document object.");
    }

    return {
      absolutePath: url.toString(),
      storageKey: input.storageKey,
    };
  },
};

export function documentObjectStorageDriver(): DocumentObjectStorageDriver {
  const driver = process.env.ALPHAVEST_OBJECT_STORAGE_DRIVER?.trim() || "local";

  if (driver === "local" || driver === "s3") {
    return driver;
  }

  throw new Error(`Unsupported document object storage driver: ${driver}`);
}

export function activeDocumentStorageAdapter(): DocumentObjectStorageAdapter {
  if (documentObjectStorageDriver() === "s3") {
    return s3CompatibleDocumentStorageAdapter;
  }

  return localDocumentStorageAdapter;
}
