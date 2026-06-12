import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { getFallbackCatalog, getPublicCatalogQueryOptions } from "@/lib/catalog";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      {
        title: "Products - FRP, Fiberglass, Resin & Stone Care | Shravan Enterprises",
      },
      {
        name: "description",
        content:
          "Complete catalog of FRP raw materials, fiberglass, resins, vacuum infusion consumables, accessories, stone-Pro chemistries and industrial supply categories.",
      },
      { property: "og:title", content: "Products - Shravan Enterprises" },
      {
        property: "og:description",
        content: "Explore our premium catalog across all active industrial categories.",
      },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Products,
});

function Products() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { data: catalog } = useQuery(getPublicCatalogQueryOptions());
  const categories = catalog?.categories ?? getFallbackCatalog().categories;

  if (pathname !== "/products") {
    return <Outlet />;
  }

  return (
    <>
      <PageHero
        eyebrow="Our Products"
        title="A complete catalog for industrial excellence."
        description="Premium raw materials, consumables and accessories across every active product category."
      />
      <section className="py-24">
        <div className="container mx-auto space-y-10 px-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/products/$slug" params={{ slug: category.slug }} className="group block">
                <div
                  className={`grid gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-smooth hover:shadow-elegant lg:grid-cols-2 ${
                    index % 2 === 1 ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
                    <img
                      src={category.image || undefined}
                      alt={category.title}
                      loading="lazy"
                      width={1280}
                      height={896}
                      className="h-full w-full object-cover transition-smooth duration-700 group-hover:scale-105"
                    />
                    <div className="glass absolute left-5 top-5 rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                      0{index + 1}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-10 lg:p-14 lg:[direction:ltr]">
                    <h2 className="text-3xl font-bold text-foreground transition-smooth group-hover:text-primary md:text-4xl">
                      {category.title}
                    </h2>
                    <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                      {category.tagline}
                    </p>
                    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                      {category.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      View Category{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
