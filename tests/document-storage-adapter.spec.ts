import path from "node:path";
import { expect, test } from "@playwright/test";

import {
  activeDocumentStorageAdapter,
  assertSafeDocumentStorageKey,
  documentObjectStorageDriver,
  documentStorageRoot,
  localDocumentStorageAdapter,
  safeDocumentStoragePath,
  s3CompatibleDocumentStorageAdapter,
} from "../lib/document-storage-adapter";

test.describe("document storage adapter", () => {
  const originalStorageRoot = process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT;
  const originalStorageDriver = process.env.ALPHAVEST_OBJECT_STORAGE_DRIVER;
  const originalS3AccessKeyId = process.env.ALPHAVEST_S3_ACCESS_KEY_ID;
  const originalS3Bucket = process.env.ALPHAVEST_S3_BUCKET;
  const originalS3Endpoint = process.env.ALPHAVEST_S3_ENDPOINT;
  const originalS3Region = process.env.ALPHAVEST_S3_REGION;
  const originalS3SecretAccessKey = process.env.ALPHAVEST_S3_SECRET_ACCESS_KEY;
  const originalFetch = globalThis.fetch;

  test.afterEach(() => {
    if (originalStorageRoot === undefined) {
      delete process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT;
    } else {
      process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT = originalStorageRoot;
    }

    if (originalStorageDriver === undefined) {
      delete process.env.ALPHAVEST_OBJECT_STORAGE_DRIVER;
    } else {
      process.env.ALPHAVEST_OBJECT_STORAGE_DRIVER = originalStorageDriver;
    }

    if (originalS3AccessKeyId === undefined) {
      delete process.env.ALPHAVEST_S3_ACCESS_KEY_ID;
    } else {
      process.env.ALPHAVEST_S3_ACCESS_KEY_ID = originalS3AccessKeyId;
    }

    if (originalS3Bucket === undefined) {
      delete process.env.ALPHAVEST_S3_BUCKET;
    } else {
      process.env.ALPHAVEST_S3_BUCKET = originalS3Bucket;
    }

    if (originalS3Endpoint === undefined) {
      delete process.env.ALPHAVEST_S3_ENDPOINT;
    } else {
      process.env.ALPHAVEST_S3_ENDPOINT = originalS3Endpoint;
    }

    if (originalS3Region === undefined) {
      delete process.env.ALPHAVEST_S3_REGION;
    } else {
      process.env.ALPHAVEST_S3_REGION = originalS3Region;
    }

    if (originalS3SecretAccessKey === undefined) {
      delete process.env.ALPHAVEST_S3_SECRET_ACCESS_KEY;
    } else {
      process.env.ALPHAVEST_S3_SECRET_ACCESS_KEY = originalS3SecretAccessKey;
    }

    globalThis.fetch = originalFetch;
  });

  test("scopes local document objects to the default storage root", () => {
    delete process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT;

    const root = documentStorageRoot();
    const objectPath = safeDocumentStoragePath("tenants/morgan/documents/source.pdf");

    expect(root).toBe(path.join(process.cwd(), "tmp", "document-object-storage"));
    expect(objectPath).toBe(path.join(root, "tenants", "morgan", "documents", "source.pdf"));
  });

  test("uses configured local storage roots without allowing key escape", () => {
    const root = path.join(process.cwd(), "tmp", "configured-document-storage");
    process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT = root;

    expect(documentStorageRoot()).toBe(root);
    expect(safeDocumentStoragePath("tenants/morgan/document-derivatives/preview.webp")).toBe(
      path.join(root, "tenants", "morgan", "document-derivatives", "preview.webp"),
    );
  });

  test("rejects unsafe document storage keys before filesystem access", () => {
    delete process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT;

    expect(() => assertSafeDocumentStorageKey("tenants/morgan/documents/source.pdf")).not.toThrow();
    expect(() => safeDocumentStoragePath("")).toThrow("Unsafe storage key.");
    expect(() => safeDocumentStoragePath("../outside.pdf")).toThrow("Unsafe storage key.");
    expect(() => safeDocumentStoragePath("tenants/morgan/../../outside.pdf")).toThrow("Unsafe storage key.");
    expect(() => safeDocumentStoragePath(path.join(process.cwd(), "outside.pdf"))).toThrow("Unsafe storage key.");
  });

  test("selects document storage drivers explicitly and fails closed on invalid configuration", () => {
    delete process.env.ALPHAVEST_OBJECT_STORAGE_DRIVER;
    expect(documentObjectStorageDriver()).toBe("local");
    expect(activeDocumentStorageAdapter()).toBe(localDocumentStorageAdapter);

    process.env.ALPHAVEST_OBJECT_STORAGE_DRIVER = "s3";
    expect(documentObjectStorageDriver()).toBe("s3");
    expect(activeDocumentStorageAdapter()).toBe(s3CompatibleDocumentStorageAdapter);

    process.env.ALPHAVEST_OBJECT_STORAGE_DRIVER = "filesystem";
    expect(() => documentObjectStorageDriver()).toThrow("Unsupported document object storage driver: filesystem");
    expect(() => activeDocumentStorageAdapter()).toThrow("Unsupported document object storage driver: filesystem");
  });

  test("uses S3-compatible bucket endpoints without leaking object keys in failed storage errors", async () => {
    const requestedUrls: string[] = [];
    const storageKey = "tenants/morgan/documents/private-source.pdf";

    process.env.ALPHAVEST_S3_ACCESS_KEY_ID = "alphavest";
    process.env.ALPHAVEST_S3_BUCKET = "alphavest-documents";
    process.env.ALPHAVEST_S3_ENDPOINT = "http://127.0.0.1:9000";
    process.env.ALPHAVEST_S3_REGION = "us-east-1";
    process.env.ALPHAVEST_S3_SECRET_ACCESS_KEY = "alphavest-local-secret";
    globalThis.fetch = (async (input) => {
      requestedUrls.push(String(input));

      return new Response("denied", { status: 403 });
    }) as typeof fetch;

    await expect(
      s3CompatibleDocumentStorageAdapter.putObject({
        bytes: Buffer.from("private payload"),
        contentType: "application/pdf",
        fileName: "private-source.pdf",
        storageKey,
      }),
    ).rejects.toThrow("Unable to store document object.");
    await expect(s3CompatibleDocumentStorageAdapter.getObject({ storageKey })).rejects.toThrow(
      "Unable to read document object.",
    );

    expect(requestedUrls).toEqual([
      "http://127.0.0.1:9000/alphavest-documents/tenants/morgan/documents/private-source.pdf",
      "http://127.0.0.1:9000/alphavest-documents/tenants/morgan/documents/private-source.pdf",
    ]);
    await expect(
      s3CompatibleDocumentStorageAdapter.putObject({
        bytes: Buffer.from("private payload"),
        fileName: "private-source.pdf",
        storageKey,
      }),
    ).rejects.not.toThrow(storageKey);
  });
});
