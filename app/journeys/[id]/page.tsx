import { AppShell } from "@/components/app-shell";
import { JourneyDetail } from "@/components/journeys/journey-detail";

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function JourneyDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <JourneyDetail journeyId={id} />
    </AppShell>
  );
}
