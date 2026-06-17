import { ComponentLibraryPreview } from "@/components/component-library-preview";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Normalized AlphaVest UI primitives are ready for the page implementation phases. Components share layout tokens, dark-theme contrast and guarded workflow states."
          eyebrow="Design system"
          title="Shared UI Component Library"
        />

        <ComponentLibraryPreview />
      </div>
    </AppShell>
  );
}
