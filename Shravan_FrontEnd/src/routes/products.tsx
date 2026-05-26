import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { categories } from "@/lib/products-data";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — FRP, Fiberglass, Resin & Stone Care | Shravan Enterprises" },
      { name: "description", content: "Complete catalog of FRP raw materials, fiberglass, polyester resins, vacuum infusion consumables, accessories and stone-care chemistries." },
      { property: "og:title", content: "Products — Shravan Enterprises" },
      { property: "og:description", content: "Explore our premium catalog across 5 industrial categories." },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Products,
});

function Products() {
  return (
    <>
      <PageHero eyebrow="Our Products" title="A complete catalog for industrial excellence." description="Premium raw materials, consumables and accessories across 5 specialized categories." />
      <section className="py-24">
        <div className="container mx-auto px-6 space-y-10">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/products/$slug" params={{ slug: cat.slug }} className="group block">
                <div className={`grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-card border border-border shadow-card hover:shadow-elegant transition-smooth ${idx % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                  <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                    <img src={cat.image} alt={cat.title} loading="lazy" width={1280} height={896} className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700" />
                    <div className="absolute top-5 left-5 text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full glass border border-white/30 text-white">
                      0{idx + 1}
                    </div>
                  </div>
                  <div className="p-10 lg:p-14 flex flex-col justify-center lg:[direction:ltr]">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-smooth">{cat.title}</h2>
                    <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{cat.tagline}</p>
                    <ul className="mt-6 grid sm:grid-cols-2 gap-2">
                      {cat.items.map((item) => (
                        <li key={item} className="text-sm text-foreground/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      View Category <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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