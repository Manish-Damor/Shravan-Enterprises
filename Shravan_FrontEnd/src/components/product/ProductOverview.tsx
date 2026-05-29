import type { NormalizedProduct } from "@/lib/product-normalizer";

export default function ProductOverview({
  product,
}: {
  product: NormalizedProduct;
}) {
  const sections = [
    {
      title: "Overview",
      body:
        product.detailed_description ??
        product.short_description ??
        "No description provided.",
    },
  ];

  const factGroups = [
    {
      title: "Applications",
      items: product.applications ?? [],
    },
    {
      title: "Industries",
      items: product.industries ?? [],
    },
    {
      title: "Tags",
      items: product.tags ?? [],
    },
  ].filter((group) => group.items.length > 0);

  return (
    <section className="space-y-8">
      {sections.map((section) => (
        <div
          key={section.title}
          className="rounded-[2rem] border border-border bg-card p-7 shadow-card md:p-9"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            Product Overview
          </div>
          <h2 className="mt-3 text-3xl font-bold text-foreground">
            {section.title}
          </h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground md:text-lg">
            {section.body}
          </p>
        </div>
      ))}

      {factGroups.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {factGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-[1.75rem] border border-border bg-secondary/45 p-6"
            >
              <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-card px-3 py-1.5 text-sm text-foreground shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
