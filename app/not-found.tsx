import { AppShell } from "@/components/app-shell";
import { StateBoundary } from "@/components/ui/state-boundary";

export default function NotFound() {
  return (
    <AppShell>
      <StateBoundary
        detail="The requested route is not part of the registered AlphaVest demo catalogue."
        kind="permission-denied"
        testId="route-unavailable-state-boundary"
        title="Route unavailable"
      />
    </AppShell>
  );
}
