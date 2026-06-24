import { AppShell } from "@/components/app-shell";
import { JourneyDashboard } from "@/components/journeys/journey-dashboard";

export default function JourneysPage() {
  return (
    <AppShell>
      <JourneyDashboard />
    </AppShell>
  );
}
