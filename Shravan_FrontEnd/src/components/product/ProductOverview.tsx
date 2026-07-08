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
    ...(product.key_features
      ? [
          {
            title: "Key Features",
            body: product.key_features,
          },
        ]
      : []),
  ];

  const factGroups = [
    {
      title: "Product Type",
      items: product.characteristics ? [product.characteristics] : [],
    },
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

  const commercialFacts = [
    { label: "Unit", value: product.unit_of_measurement ?? "" },
    { label: "Min. Order QTY", value: product.moq ?? "" },
    { label: "Packing Size", value: product.available_packing_size ?? "" },
  ].filter((item) => item.value);

  const applicationRows = (product.application_rows ?? []).filter(
    (item) => item.title,
  );

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

      {commercialFacts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {commercialFacts.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.6rem] border border-border bg-card px-5 py-5 shadow-sm"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70">
                {item.label}
              </div>
              <div className="mt-3 text-base font-semibold text-foreground">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}

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

      {applicationRows.length > 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-7 shadow-card md:p-9">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            Application Details
          </div>
          <h2 className="mt-3 text-3xl font-bold text-foreground">
            Where This Product Is Used
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {applicationRows.map((item) => (
              <div
                key={`${item.title}-${item.description ?? ""}`}
                className="rounded-[1.5rem] border border-border bg-secondary/35 p-5"
              >
                <div className="text-base font-semibold text-foreground">
                  {item.title}
                </div>
                {item.description ? (
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
