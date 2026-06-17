import { NextResponse } from "next/server";

import { listUploadedDocuments } from "@/lib/document-upload-service";
import { prismaClient } from "@/lib/prisma";
import type { DemoTenantSlug } from "@/lib/demo-session";

function tenantSlugFromUrl(request: Request): DemoTenantSlug {
  const value = new URL(request.url).searchParams.get("tenantSlug");

  if (value === "bennett" || value === "morgan" || value === "northbridge" || value === "summit") {
    return value;
  }

  return "morgan";
}

export async function GET(request: Request) {
  try {
    const documents = await listUploadedDocuments(prismaClient(), tenantSlugFromUrl(request));

    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json(
      {
        documents: [],
        error: error instanceof Error ? error.message : "Unable to load documents.",
      },
      { status: 500 },
    );
  }
}
