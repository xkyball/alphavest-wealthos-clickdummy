import { Phase8CommunicationScreen } from "@/components/phase8-screens";

export default async function CommunicationPage({
  searchParams
}: {
  searchParams?: Promise<{ surface?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialSurface =
    resolvedSearchParams?.surface === "client-preview"
      ? "client-preview"
      : undefined;

  return <Phase8CommunicationScreen initialSurface={initialSurface} />;
}
