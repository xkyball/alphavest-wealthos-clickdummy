import { Suspense } from "react";
import { MobileScreenV2 } from "@/components/phase5-client-screens";

export default function MobilePage() {
  return (
    <Suspense fallback={null}>
      <MobileScreenV2 />
    </Suspense>
  );
}
