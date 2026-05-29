import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { NormalizedCategory } from "@/lib/product-normalizer";

export default function CategoryNav({
  categories,
  active,
}: {
  categories: NormalizedCategory[];
  active?: string | null;
}) {
  if (!categories || categories.length === 0) return null;

  return (
    <nav role="navigation" aria-label="Product categories">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => {
          const isActive = category.slug === active;

          return (
            <Link
              key={category.slug}
              to="/products/$slug"
              params={{ slug: category.slug }}
              aria-current={isActive ? "true" : undefined}
              className={`group relative overflow-hidden rounded-[1.6rem] border transition-smooth ${
                isActive
                  ? "border-primary/20 bg-[linear-gradient(135deg,_oklch(0.22_0.05_160),_oklch(0.33_0.07_156))] text-white shadow-elegant"
                  : "border-border/80 bg-card hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card"
              }`}
            >
              <div
                className={`absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 ${
                  isActive
                    ? "bg-[radial-gradient(circle_at_top_right,_oklch(0.66_0.18_152_/_0.22),_transparent_32%)]"
                    : "bg-[radial-gradient(circle_at_top_right,_oklch(0.66_0.18_152_/_0.08),_transparent_34%)]"
                }`}
              />
              <div className="relative flex h-full flex-col p-5">
                <div
                  className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    isActive ? "text-white/58" : "text-primary/65"
                  }`}
                >
                  {isActive ? "Current Category" : `Category ${String(index + 1).padStart(2, "0")}`}
                </div>
                <div
                  className={`mt-3 text-xl font-bold leading-tight ${
                    isActive ? "text-white" : "text-foreground"
                  }`}
                >
                  {category.title}
                </div>
                {category.tagline ? (
                  <p
                    className={`mt-3 line-clamp-3 text-sm leading-6 ${
                      isActive ? "text-white/74" : "text-muted-foreground"
                    }`}
                  >
                    {category.tagline}
                  </p>
                ) : null}

                <div
                  className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {isActive ? "Currently viewing" : "Open category"}
                  <ArrowUpRight
                    className={`h-4 w-4 transition ${
                      isActive ? "" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    }`}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
