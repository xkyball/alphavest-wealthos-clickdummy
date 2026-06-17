import { AppShell } from "@/components/app-shell";
import { StatePanel } from "@/components/ui/state-panel";

export default function Loading() {
  return (
    <AppShell>
      <StatePanel
        detail="Preparing the current AlphaVest workspace view."
        state="loading"
        title="Loading workspace"
      />
    </AppShell>
  );
}
