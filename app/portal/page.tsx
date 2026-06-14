import { Suspense } from "react";
import { PortalScreenV2 } from "@/components/phase5-client-screens";

export default function PortalPage() {
  return (
    <Suspense fallback={null}>
      <PortalScreenV2 />
    </Suspense>
  );
}
