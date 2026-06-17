import { AppShell } from "@/components/app-shell";
import { StatePanel } from "@/components/ui/state-panel";

export default function NotFound() {
  return (
    <AppShell>
      <StatePanel
        detail="The requested route is not part of the registered AlphaVest demo catalogue."
        state="restricted"
        title="Route unavailable"
      />
    </AppShell>
  );
}
