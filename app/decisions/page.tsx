import { Suspense } from "react";
import { DecisionsScreenV2 } from "@/components/phase5-client-screens";

export default function DecisionsPage() {
  return (
    <Suspense fallback={null}>
      <DecisionsScreenV2 />
    </Suspense>
  );
}
