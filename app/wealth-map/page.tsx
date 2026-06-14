import { WealthMapScreenV2 } from "@/components/phase5-client-screens";

export default async function WealthMapPage({
  searchParams
}: {
  searchParams?: Promise<{ focus?: string; highlight?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return <WealthMapScreenV2 initialFocus={resolvedSearchParams?.focus ?? resolvedSearchParams?.highlight} />;
}
