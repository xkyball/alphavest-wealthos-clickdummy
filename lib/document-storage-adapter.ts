import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredDocumentObject = {
  absolutePath: string;
  storageKey: string;
};

export type StoreDocumentObjectInput = {
  bytes: Buffer;
  fileName: string;
  storageKey: string;
};

function storageRoot() {
  return path.resolve(process.cwd(), process.env.ALPHAVEST_DEMO_STORAGE_ROOT ?? "tmp/demo-document-storage");
}

function safeStoragePath(storageKey: string) {
  const root = storageRoot();
  const absolutePath = path.resolve(root, storageKey);

  if (!absolutePath.startsWith(root)) {
    throw new Error("Unsafe storage key.");
  }

  return absolutePath;
}

export const localDocumentStorageAdapter = {
  async putObject(input: StoreDocumentObjectInput): Promise<StoredDocumentObject> {
    const absolutePath = safeStoragePath(input.storageKey);

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, input.bytes);

    return {
      absolutePath,
      storageKey: input.storageKey,
    };
  },
};
