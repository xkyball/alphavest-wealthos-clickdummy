import { Suspense } from "react";
import { MobileUploadScreenV2 } from "@/components/phase5-client-screens";

export default function MobileUploadPage() {
  return (
    <Suspense fallback={null}>
      <MobileUploadScreenV2 />
    </Suspense>
  );
}
