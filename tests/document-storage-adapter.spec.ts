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
});
