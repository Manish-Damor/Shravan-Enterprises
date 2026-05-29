import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Factory, Award, Truck, Sparkles, CheckCircle2, Quote, Star } from "lucide-react";
import heroImg from "@/assets/hero-industrial.jpg";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/site/SectionHeader";
import { fetchPublicCatalog, getFallbackCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shravan Enterprises — Premium FRP, Marble & Granite Solutions" },
      { name: "description", content: "ISO 9001:2015 certified supplier of FRP raw materials, fiberglass, Italian marble & granite consumables and vacuum bonding solutions." },
      { property: "og:title", content: "Shravan Enterprises — Premium Industrial Solutions" },
      { property: "og:description", content: "Trusted partner for FRP, marble, granite & composite industries since 2018." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const stats = [
  { value: "16+", label: "Years of Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "200+", label: "Product Categories" },
  { value: "20+", label: "Supply Network Cities" },
];

const whyUs = [
  { icon: Award, title: "Premium Quality", desc: "ISO 9001:2015 certified materials sourced from leading manufacturers." },
  { icon: Shield, title: "Trusted Supplier", desc: "Long-term partnerships with India's top FRP & stone industries." },
  { icon: Truck, title: "Fast Delivery", desc: "Reliable pan-India supply network with on-time dispatch." },
  { icon: Sparkles, title: "Reliable Performance", desc: "Consistent batch quality with full technical support." },
  { icon: Factory, title: "Industrial Expertise", desc: "Deep know-how of marble, granite, FRP and composite workflows." },
  { icon: CheckCircle2, title: "Customer First", desc: "Premium pre & post-sales service backed by domain experts." },
];

const testimonials = [
  { name: "Rakesh Patel", company: "Granite Works, Rajasthan", text: "Shravan Enterprises has been our trusted supplier for over 4 years. Their stone care products are unmatched in quality." },
  { name: "Suresh Mehta", company: "Composite India Pvt Ltd", text: "Their FRP raw materials and resins are consistently premium grade. Delivery is always on time. Highly recommended." },
  { name: "Anil Sharma", company: "Marvel Marbles", text: "We rely on Shravan for our vacuum bonding consumables. The team's technical support is exceptional." },
];

function Home() {
  const { data: catalog } = useQuery({ queryKey: ["public-catalog"], queryFn: fetchPublicCatalog, staleTime: 5 * 60 * 1000 });
  const activeCatalog = catalog ?? getFallbackCatalog();
  const categories = activeCatalog.categories;

  const stats = [
    { value: "16+", label: "Years of Experience" },
    { value: "200+", label: "Product Categories" },
    { value: `${activeCatalog.counts.products}+`, label: "Published Products" },
    { value: "20+", label: "Supply Network Cities" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-20 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Premium industrial materials" className="w-full h-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.14 0.04 155 / 0.92) 0%, oklch(0.18 0.05 155 / 0.78) 50%, oklch(0.36 0.09 155 / 0.55) 100%)" }} />
        </div>
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 animate-pulse-glow" style={{ background: "oklch(0.65 0.18 152)" }} />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-25" style={{ background: "oklch(0.55 0.17 152)" }} />

        <div className="relative container mx-auto px-6 pt-24 pb-16 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase mb-8">
              <Award className="w-3.5 h-3.5 text-accent" />
              ISO 9001:2015 Certified Company
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.02] tracking-tight">
              Leading Supplier of
              <span className="block mt-2" style={{ background: "linear-gradient(135deg, #fff 0%, oklch(0.85 0.15 152) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                Premium FRP & Industrial Solutions
              </span>
            </h1>
            <p className="mt-7 text-lg md:text-2xl text-white/80 max-w-2xl leading-relaxed">
              Trusted partner for Italian Marble, Granite, Fiberglass & Vacuum Bonding industries since 2018.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/products" className="group inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-105 transition-smooth">
                Explore Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/30 bg-white/5 backdrop-blur font-semibold hover:bg-white/10 transition-smooth">
                Contact Us
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="glass border-white/15 rounded-2xl p-6 text-center transition-smooth hover:bg-white/10">
                <div className="text-3xl md:text-4xl font-bold" style={{ background: "linear-gradient(135deg, #fff, oklch(0.85 0.15 152))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{s.value}</div>
                <div className="mt-2 text-xs md:text-sm text-white/70 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="relative py-28">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              About Shravan
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
              A premium supply partner for India's industrial leaders.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Established in 2018, Shravan Enterprises has grown into a trusted name for FRP raw materials, fiberglass, Italian marble & granite consumables, vacuum bonding solutions, and industrial spare parts — backed by uncompromising quality and a passion for service.
            </p>
            <ul className="mt-7 space-y-3">
              {["ISO 9001:2015 certified processes", "Pan-India delivery network", "Dedicated technical support"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              Discover our story <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute -inset-6 rounded-3xl gradient-primary opacity-20 blur-2xl" />
            <img src={heroImg} alt="Industrial showcase" className="relative rounded-3xl shadow-elegant w-full h-[520px] object-cover" loading="lazy" width={1920} height={1280} />
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-5 shadow-card hidden md:block">
              <div className="text-3xl font-bold text-primary">2018</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Established</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="relative py-28 bg-secondary/30">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Product Range" title="Engineered for industrial excellence." description="A complete portfolio of premium raw materials, consumables and tooling — curated for marble, granite, FRP & composite professionals." />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link to="/products/$slug" params={{ slug: cat.slug }} className="group block h-full">
                  <div className="relative h-full rounded-3xl overflow-hidden bg-card shadow-card hover:shadow-elegant transition-smooth border border-border hover:border-primary/40">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={cat.image || undefined} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700" loading="lazy" width={1280} height={896} />
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth" style={{ background: "linear-gradient(180deg, transparent 40%, oklch(0.18 0.05 155 / 0.7))" }} />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth">{cat.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{cat.tagline}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="relative py-28">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Why Choose Us" title="Built on trust. Delivered with precision." />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative rounded-2xl p-7 bg-card border border-border hover:border-primary/40 shadow-card hover:shadow-elegant transition-smooth"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary grid place-items-center shadow-glow group-hover:scale-110 transition-smooth">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-28 bg-secondary/30">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Testimonials" title="What our clients say." />
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative rounded-3xl p-8 bg-card border border-border shadow-card hover:shadow-elegant transition-smooth"
              >
                <Quote className="w-8 h-8 text-primary/30" />
                <p className="mt-4 text-foreground/90 leading-relaxed">"{t.text}"</p>
                <div className="mt-6 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-20 text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-40" style={{ background: "oklch(0.65 0.18 152)" }} />
            <div className="relative max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to source with confidence?</h2>
              <p className="mt-5 text-lg text-white/80">Get a custom quote on our complete catalog of FRP raw materials, marble & granite consumables.</p>
              <Link to="/contact" className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-primary font-semibold shadow-elegant hover:scale-105 transition-smooth">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
