import type { NormalizedProduct } from "@/lib/product-normalizer";

export default function DocumentCenter({
  product,
}: {
  product: NormalizedProduct;
}) {
  const docs: Array<{ title: string; url: string }> = [];

  if (product.tds_pdf) docs.push({ title: "TDS", url: product.tds_pdf });
  if (product.brochure_pdf) {
    docs.push({ title: "Brochure", url: product.brochure_pdf });
  }

  for (const file of product.files ?? []) {
    if (docs.some((doc) => doc.url === file.url)) continue;
    docs.push({ title: file.name, url: file.url });
  }

  if (docs.length === 0) return null;

  return (
    <section className="rounded-[2rem] border border-border bg-card p-7 shadow-card md:p-9">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
        Downloads
      </div>
      <h3 className="mt-3 text-3xl font-bold text-foreground">Documents</h3>
      <div className="mt-3 space-y-2">
        {docs.map((doc) => (
          <div
            key={`${doc.title}-${doc.url}`}
            className="flex items-center justify-between rounded-[1.2rem] border border-border bg-secondary/30 p-4"
          >
            <div className="font-medium text-foreground">{doc.title}</div>
            <a
              href={doc.url}
              className="text-sm text-amber-400"
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
