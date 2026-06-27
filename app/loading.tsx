import { AppShell } from "@/components/app-shell";
import { StateBoundary } from "@/components/ui/state-boundary";

export default function Loading() {
  return (
    <AppShell>
      <StateBoundary
        detail="Preparing the current AlphaVest workspace view."
        kind="loading"
        testId="workspace-loading-state-boundary"
        title="Loading workspace"
      />
    </AppShell>
  );
}
