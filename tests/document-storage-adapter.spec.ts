import path from "node:path";
import { expect, test } from "@playwright/test";

import {
  documentStorageRoot,
  safeDocumentStoragePath,
} from "../lib/document-storage-adapter";

test.describe("document storage adapter", () => {
  const originalStorageRoot = process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT;

  test.afterEach(() => {
    if (originalStorageRoot === undefined) {
      delete process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT;
    } else {
      process.env.ALPHAVEST_DOCUMENT_STORAGE_ROOT = originalStorageRoot;
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

    expect(() => safeDocumentStoragePath("")).toThrow("Unsafe storage key.");
    expect(() => safeDocumentStoragePath("../outside.pdf")).toThrow("Unsafe storage key.");
    expect(() => safeDocumentStoragePath("tenants/morgan/../../outside.pdf")).toThrow("Unsafe storage key.");
    expect(() => safeDocumentStoragePath(path.join(process.cwd(), "outside.pdf"))).toThrow("Unsafe storage key.");
  });
});
