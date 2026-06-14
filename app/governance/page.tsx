import { Phase7GovernanceScreen } from "@/components/phase7-governance-screen";

export default async function GovernancePage({
  searchParams
}: {
  searchParams?: Promise<{ surface?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialSurface =
    resolvedSearchParams?.surface === "second-confirmation"
      ? "second-confirmation"
      : undefined;

  return <Phase7GovernanceScreen initialSurface={initialSurface} />;
}
