import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Download, MessageCircle, Send } from "lucide-react";
import { categories, type Category } from "@/lib/products-data";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }): Category => {
    const cat = categories.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return cat;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Product"} — Shravan Enterprises` },
      { name: "description", content: loaderData?.tagline ?? "" },
      { property: "og:title", content: `${loaderData?.title} — Shravan Enterprises` },
      { property: "og:description", content: loaderData?.tagline ?? "" },
      { property: "og:image", content: loaderData?.image ?? "" },
    ],
    links: [{ rel: "canonical", href: `/products/${loaderData?.slug ?? ""}` }],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-6 py-32 text-center">
      <h1 className="text-4xl font-bold">Category not found</h1>
      <Link to="/products" className="mt-6 inline-block text-primary font-semibold">← Back to products</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-6 py-32 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground mt-2">{error.message}</p>
    </div>
  ),
  component: ProductCategory,
});

function ProductCategory() {
  const cat = Route.useLoaderData();
  const related = categories.filter((c) => c.slug !== cat.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" width={1280} height={896} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.14 0.04 155 / 0.92), oklch(0.36 0.09 155 / 0.7))" }} />
        </div>
        <div className="relative container mx-auto px-6 py-28 md:py-36 text-primary-foreground">
          <Link to="/products" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-smooth">
            <ArrowLeft className="w-4 h-4" /> All Products
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-5xl md:text-7xl font-bold leading-[1.05] max-w-3xl">
            {cat.title}
          </motion.h1>
          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl">{cat.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://wa.me/919824124043" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-semibold shadow-elegant hover:scale-105 transition-smooth">
              <MessageCircle className="w-4 h-4" /> WhatsApp Inquiry
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur font-semibold hover:bg-white/20 transition-smooth">
              <Send className="w-4 h-4" /> Request a Quote
            </Link>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur font-semibold hover:bg-white/20 transition-smooth">
              <Download className="w-4 h-4" /> Download Brochure
            </a>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Range Includes</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">All {cat.items.length} products in this category</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">Curated, ISO-grade materials carefully selected for performance, consistency and long-term reliability in industrial applications.</p>

              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {cat.items.map((item: string, i: number) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="group rounded-2xl p-5 bg-card border border-border hover:border-primary/40 shadow-card hover:shadow-elegant transition-smooth flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center shrink-0 shadow-glow group-hover:scale-110 transition-smooth">
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{item}</div>
                      <div className="text-xs text-muted-foreground mt-1">Available in multiple grades & packing.</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="rounded-3xl p-7 bg-card border border-border shadow-card">
                <h3 className="text-xl font-bold text-foreground">Quick Inquiry</h3>
                <p className="text-sm text-muted-foreground mt-1">Get pricing & availability within hours.</p>
                <form className="mt-5 space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input required maxLength={100} placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input required type="tel" maxLength={20} placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input required type="email" maxLength={255} placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <textarea rows={3} maxLength={1000} placeholder={`Interested in ${cat.title}...`} className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                  <button type="submit" className="w-full py-3 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-smooth">
                    Send Inquiry
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Related Categories" title="Explore more of our catalog." />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.slug} to="/products/$slug" params={{ slug: r.slug }} className="group block rounded-3xl overflow-hidden bg-card border border-border shadow-card hover:shadow-elegant transition-smooth">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={r.image} alt={r.title} loading="lazy" width={1280} height={896} className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-smooth">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}