import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Boxes,
  ChevronRight,
  MessageCircle,
  PackageSearch,
} from "lucide-react";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { fetchPublicCatalog } from "@/lib/catalog";
import { normalizeCategory, normalizeProduct } from "@/lib/product-normalizer";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const catalog = await fetchPublicCatalog();
    const categories = (catalog.categories ?? [])
      .map(normalizeCategory)
      .filter((category): category is NonNullable<typeof category> => category !== null);
    const products = (catalog.products ?? [])
      .map(normalizeProduct)
      .filter((product): product is NonNullable<typeof product> => product !== null);

    const category = categories.find((item) => item.slug === params.slug);
    if (!category) throw notFound();

    const items = products.filter((product) => product.category_slug === category.slug);
    const featured = items.filter((product) => product.featured).slice(0, 3);

    return { category, categories, items, featured };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.category.title ?? "Category"} - Shravan Enterprises`,
      },
      {
        name: "description",
        content:
          loaderData?.category.tagline ??
          "Explore product previews and detailed specifications by category.",
      },
      {
        property: "og:title",
        content: `${loaderData?.category.title ?? "Category"} - Shravan Enterprises`,
      },
      {
        property: "og:description",
        content:
          loaderData?.category.tagline ??
          "Explore product previews and detailed specifications by category.",
      },
      {
        property: "og:image",
        content: loaderData?.category.image ?? "",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `/products/${loaderData?.category.slug ?? ""}`,
      },
    ],
  }),
  component: ProductCategory,
});

function ProductCategory() {
  const { category, categories, items, featured } = Route.useLoaderData();
  const relatedCategories = categories.filter((item) => item.slug !== category.slug).slice(0, 4);
  const highlightedProducts = featured.length > 0 ? featured : items.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_oklch(0.62_0.13_145_/_0.2),_transparent_35%),linear-gradient(135deg,_oklch(0.17_0.04_160),_oklch(0.28_0.06_158)_52%,_oklch(0.14_0.03_155))] text-white">
        <div className="absolute inset-0 opacity-15">
          <img
            src={category.image || undefined}
            alt={category.title}
            className="h-full w-full object-cover mix-blend-screen"
            width={1440}
            height={900}
          />
        </div>
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
        <div className="relative container mx-auto px-6 py-20 md:py-24">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/85 backdrop-blur-sm transition hover:bg-white/12"
            >
              <ArrowLeft className="h-4 w-4" /> Back to catalog
            </Link>
            <span className="hidden text-white/35 md:inline">/</span>
            <span className="rounded-full border border-white/10 bg-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/78">
              {category.title}
            </span>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_24rem] xl:items-stretch">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
                <BadgeCheck className="h-3.5 w-3.5" />
                Category Overview
              </div>
              <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.02] md:text-7xl">
                {category.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/78 md:text-xl">
                {category.tagline}
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                {(category.items ?? []).slice(0, 5).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/919824124043"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition hover:scale-[1.02]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Speak to sales
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/16"
                >
                  Request quote
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatCard
                  icon={<Boxes className="h-5 w-5" />}
                  label="Products"
                  value={String(items.length)}
                />
                <StatCard
                  icon={<PackageSearch className="h-5 w-5" />}
                  label="Featured"
                  value={String(featured.length)}
                />
                <StatCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Item Lines"
                  value={String(category.items?.length ?? 0)}
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] p-5 backdrop-blur-sm"
            >
              <div className="overflow-hidden rounded-[1.6rem] border border-white/10">
                <img
                  src={category.image || undefined}
                  alt={category.title}
                  className="h-60 w-full object-cover"
                  width={1280}
                  height={896}
                />
              </div>
              <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-black/15 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                  Top products in this category
                </div>
                <div className="mt-4 space-y-3">
                  {highlightedProducts.map((product, index) => (
                    <Link
                      key={product.slug}
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/8 px-4 py-3 transition hover:bg-white/14"
                    >
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                          0{index + 1}
                        </div>
                        <div className="mt-1 font-semibold text-white">{product.name}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/60" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-18 md:py-22">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,_transparent,_oklch(0.97_0.01_150))]" />
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Product Range"
            title={`Preview all ${items.length} products in ${category.title}.`}
          />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Each product below links to a dedicated detail page with overview, specifications,
            documents, inquiry form, and related products from the same category.
          </p>

          {items.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((product, index) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: index * 0.03 }}
                >
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/35 hover:shadow-elegant"
                  >
                    <div className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(145deg,_oklch(0.98_0.01_150),_oklch(0.94_0.015_150))]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_oklch(0.65_0.18_152_/_0.18),_transparent_35%)]" />
                      <div className="flex min-h-[240px] items-center justify-center p-8">
                        <img
                          src={product.image || category.image || undefined}
                          alt={product.name}
                          loading="lazy"
                          className="max-h-44 object-contain transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      {product.featured ? (
                        <div className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                          Featured
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/75">
                        {category.title}
                      </div>
                      <h2 className="mt-3 text-2xl font-bold leading-tight text-foreground transition group-hover:text-primary">
                        {product.name}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                        {product.short_description ??
                          product.detailed_description ??
                          "Industrial-grade product profile with application and specification support."}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(product.tags?.slice(0, 2) ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {(product.applications?.length ?? 0) > 0 ? (
                          <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                            {product.applications?.[0]}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Open product details
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-border bg-card p-8 shadow-card">
              <div className="max-w-2xl">
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/75">
                  Catalog update in progress
                </div>
                <h2 className="mt-3 text-3xl font-bold text-foreground">
                  Products for this category will be listed here.
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  This category page is ready and the item coverage is shown below. Individual
                  products can be published into this section as they are added to the catalog.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/35 py-18">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <SectionHeader
                eyebrow="Category Coverage"
                title={`Everything covered under ${category.title}.`}
              />
              <p className="mt-4 max-w-xl text-muted-foreground">
                Useful for fast scanning when buyers want to compare the full range before opening
                individual product pages.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(category.items ?? []).map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-border bg-white/85 px-5 py-4 text-sm font-medium text-foreground shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-18 md:py-22">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="More Categories"
            title="Continue browsing adjacent product families."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedCategories.map((relatedCategory) => (
              <Link
                key={relatedCategory.slug}
                to="/products/$slug"
                params={{ slug: relatedCategory.slug }}
                className="group overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="aspect-[5/4] overflow-hidden">
                  <img
                    src={relatedCategory.image || undefined}
                    alt={relatedCategory.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="font-bold text-foreground transition group-hover:text-primary">
                    {relatedCategory.title}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {relatedCategory.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
      <div className="flex items-center gap-2 text-white/65">{icon}</div>
      <div className="mt-4 text-3xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/62">{label}</div>
    </div>
  );
}
