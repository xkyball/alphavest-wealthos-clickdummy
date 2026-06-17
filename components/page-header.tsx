type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl text-alphavest-ivory md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-alphavest-muted md:text-base">
            {description}
          </p>
        </div>
        <div className="inline-flex h-[var(--status-chip-height)] w-fit items-center rounded-full border border-alphavest-gold/35 bg-alphavest-gold/10 px-3 text-xs font-semibold text-alphavest-gold-soft">
          No unapproved advice reaches the client
        </div>
      </div>
    </header>
  );
}
