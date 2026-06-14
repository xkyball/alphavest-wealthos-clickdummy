import { WealthMapScreen } from "@/components/phase3-client-screens";

export default async function WealthMapPage({
  searchParams
}: {
  searchParams?: Promise<{ highlight?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return <WealthMapScreen initialHighlight={resolvedSearchParams?.highlight} />;
}
