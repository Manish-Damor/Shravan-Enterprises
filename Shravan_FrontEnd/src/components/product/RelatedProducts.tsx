import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import type { NormalizedProduct } from "@/lib/product-normalizer";

export default function RelatedProducts({
  items,
}: {
  items: NormalizedProduct[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-labelledby="related-products-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            Same Category
          </div>
          <h3
            id="related-products-heading"
            className="mt-2 text-3xl font-bold text-foreground"
          >
            Related Products
          </h3>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((product) => (
          <Link
            key={product.slug}
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="group overflow-hidden rounded-[1.7rem] border border-border bg-card shadow-card transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant"
            aria-label={`View product ${product.name}`}
          >
            <div className="flex h-44 items-center justify-center border-b border-border bg-[linear-gradient(160deg,_oklch(0.98_0.01_150),_oklch(0.94_0.015_150))] p-6">
              <img
                src={product.image || undefined}
                alt={product.name}
                loading="lazy"
                className="max-h-30 object-contain transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h4 className="text-lg font-bold text-foreground transition group-hover:text-primary">
                {product.name}
              </h4>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {product.short_description ??
                  product.detailed_description ??
                  "Industrial product detail page with specifications and documents."}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View details
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
