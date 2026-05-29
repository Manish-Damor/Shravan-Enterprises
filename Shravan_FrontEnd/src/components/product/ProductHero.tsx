import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight, Download, MessageSquare, Package2 } from "lucide-react";
import type {
  NormalizedCategory,
  NormalizedProduct,
} from "@/lib/product-normalizer";

export default function ProductHero({
  product,
  category,
}: {
  product: NormalizedProduct;
  category: NormalizedCategory | null;
}) {
  const tds = product.tds_pdf ?? null;
  const brochure = product.brochure_pdf ?? null;
  const highlightChips = [
    ...(product.tags ?? []).slice(0, 2),
    ...(product.applications ?? []).slice(0, 1),
  ].slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_oklch(0.65_0.18_152_/_0.15),_transparent_28%),linear-gradient(135deg,_oklch(0.16_0.04_160),_oklch(0.26_0.06_158)_55%,_oklch(0.15_0.03_155))] text-white">
      <div className="absolute inset-0 opacity-15">
        <img
          src={product.image || category?.image || undefined}
          alt={product.name}
          className="h-full w-full object-cover mix-blend-screen"
        />
      </div>
      <div className="relative container mx-auto px-6 py-18 md:py-22">
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
          <Link to="/products" className="transition hover:text-white">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          {category ? (
            <>
              <Link
                to="/products/$slug"
                params={{ slug: category.slug }}
                className="transition hover:text-white"
              >
                {category.title}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          ) : null}
          <span className="text-white">{product.name}</span>
        </div>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/78">
              <Package2 className="h-3.5 w-3.5" />
              Dynamic Product Detail
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.02] md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/80">
              {product.short_description ??
                product.detailed_description ??
                "Industrial-grade product with documentation, specifications, and inquiry support."}
            </p>

            {highlightChips.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {highlightChips.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-sm text-white/85"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition hover:scale-[1.02]"
              >
                <MessageSquare className="h-4 w-4" />
                Send Inquiry
              </Link>
              <a
                href={tds ?? undefined}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full border border-white/18 px-5 py-3 font-semibold ${
                  tds
                    ? "bg-white/8 text-white transition hover:bg-white/14"
                    : "pointer-events-none opacity-35"
                }`}
              >
                <Download className="h-4 w-4" />
                TDS
              </a>
              <a
                href={brochure ?? undefined}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full border border-white/18 px-5 py-3 font-semibold ${
                  brochure
                    ? "bg-white/8 text-white transition hover:bg-white/14"
                    : "pointer-events-none opacity-35"
                }`}
              >
                <Download className="h-4 w-4" />
                Brochure
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="absolute -left-6 top-8 h-30 w-30 rounded-full bg-emerald-300/18 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-elegant backdrop-blur-sm">
              <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(145deg,_oklch(1_0_0_/_0.14),_oklch(1_0_0_/_0.04))] p-8">
                <img
                  src={product.image || category?.image || undefined}
                  alt={product.name}
                  className="h-56 w-full object-contain md:h-80"
                  loading="lazy"
                />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MiniFact
                  label="Category"
                  value={category?.title ?? product.category_title ?? product.category_slug ?? "-"}
                />
                <MiniFact label="Product Code" value={product.slug} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/12 px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">{label}</div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
