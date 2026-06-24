import { NextResponse } from "next/server";

import { authProviders } from "@/lib/auth/provider-registry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    providers: authProviders,
    safety: {
      noExternalIdpClaim: true,
      productionAuthClaim: false,
    },
  });
}
