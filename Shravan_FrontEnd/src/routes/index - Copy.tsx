import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle2,
  Factory,
  Quote,
  Shield,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-industrial.jpg";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getFallbackCatalog, getPublicCatalogQueryOptions } from "@/lib/catalog";

export const Route = createFileRoute("/index - Copy")({
  head: () => ({
    meta: [
      { title: "Shravan Enterprises - Premium FRP, Marble & Granite Solutions" },
      {
        name: "description",
        content:
          "ISO 9001:2015 certified supplier of FRP raw materials, fiberglass, industrial consumables, stone-care systems and process supply solutions.",
      },
      { property: "og:title", content: "Shravan Enterprises - Premium Industrial Solutions" },
      {
        property: "og:description",
        content:
          "Trusted partner for FRP, stone, packaging and industrial process supply requirements.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const whyUs = [
  {
    icon: Award,
    title: "Assured Quality",
    desc: "Industrial-grade materials backed by process discipline and careful product selection.",
  },
  {
    icon: Shield,
    title: "Trusted Partnership",
    desc: "Preferred by buyers, fabricators, and production teams who value consistency over noise.",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    desc: "Fast movement across key regions with responsive support on urgent material requirements.",
  },
  {
    icon: Sparkles,
    title: "Category Depth",
    desc: "From FRP and stone care to packaging and process consumables, the range is built for real operations.",
  },
  {
    icon: Factory,
    title: "Industrial Understanding",
    desc: "Products aligned to shop-floor usage, maintenance realities, and production workflows.",
  },
  {
    icon: CheckCircle2,
    title: "Professional Service",
    desc: "Clear communication, cleaner follow-through, and support that respects purchasing timelines.",
  },
];

const testimonials = [
  {
    name: "Krishna Global Marbles Stone LLP",
    company: "",
    text: "“Shravan Enterprises has been a reliable supplier for our marble and stone material requirements. Their product quality, timely response, and professional service make them a trusted business partner.”",
  },
  {  
    name: "Center Stone Pvt Ltd",
    company: "",
    text: "“Shravan Enterprises is a dependable partner for our material and finishing product needs. Their service response and product range are both highly satisfactory.”",
  },
  {
    name: "Millennium Marble",
    company: "",
    text: "“Shravan Enterprises provides quality products with a good understanding of stone and marble industry needs. Their reliable service and support make them a preferred supplier.”",
  },
];

function Home() {
  const { data: catalog } = useQuery(getPublicCatalogQueryOptions());
  const activeCatalog = catalog ?? getFallbackCatalog();
  const categories = activeCatalog.categories;
  const featuredCategories = categories.slice(0, 5);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (featuredCategories.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % featuredCategories.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [featuredCategories.length]);

  const currentCategory = featuredCategories[activeSlide] ?? categories[0];

  const stats = [
    { value: "16+", label: "Years in trade" },
    { value: `${activeCatalog.counts.categories}+`, label: "Active categories" },
    { value: `${activeCatalog.counts.products}+`, label: "Published products" },
    { value: "Pan-India", label: "Industrial support" },
  ];

  return (
    <>
      <section className="relative -mt-20 overflow-hidden bg-[linear-gradient(135deg,_oklch(0.14_0.04_155),_oklch(0.2_0.05_157)_48%,_oklch(0.31_0.08_154))] text-primary-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Premium industrial materials"
            className="h-full w-full object-cover opacity-20 mix-blend-screen"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_oklch(0.64_0.18_152_/_0.26),_transparent_28%),radial-gradient(circle_at_bottom_right,_oklch(1_0_0_/_0.08),_transparent_24%)]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "58px 58px",
          }}
        />
        <div className="absolute -left-24 top-28 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative container mx-auto px-6 pb-18 pt-30 md:pb-22 md:pt-34 lg:pb-26">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 38 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] backdrop-blur-sm">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
                ISO 9001:2015 Certified Supply Partner
              </div>
              <h1 className="mt-7 max-w-[11ch] text-5xl font-bold leading-[0.94] md:max-w-[12ch] md:text-7xl xl:text-8xl">
                Industrial materials with a cleaner premium standard.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">
                Shravan Enterprises delivers FRP raw materials, industrial consumables,
                stone-care systems, vacuum-process products, and allied supply solutions
                with sharper quality control and a more dependable service experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["FRP Materials", "Stone Care", "Vacuum Process", "Industrial Supply"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/84"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-primary shadow-elegant transition hover:scale-[1.02]"
                >
                  Explore Product Range
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/brochure"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/14"
                >
                  Download Brochure
                </Link>
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.6rem] border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="mt-1 text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute inset-6 rounded-[2.2rem] border border-white/10 bg-white/6 backdrop-blur-xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-5 shadow-2xl backdrop-blur-xl md:p-6">
                <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.16))] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.24em] text-white/50">
                        Featured category slider
                      </div>
                      <div className="mt-2 text-2xl font-bold text-white">
                        {currentCategory?.title ?? "Premium Solutions"}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
                      0{activeSlide + 1}
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-white/10">
                    <img
                      src={currentCategory?.image || heroImg}
                      alt={currentCategory?.title ?? "Category"}
                      className="h-72 w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                      <p className="text-sm leading-7 text-white/74">
                        {currentCategory?.tagline ??
                          "A curated category built for industrial performance and cleaner buying decisions."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(currentCategory?.items ?? []).slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/76"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    {currentCategory ? (
                      <Link
                        to="/products/$slug"
                        params={{ slug: currentCategory.slug }}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:scale-[1.02]"
                      >
                        View category
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {featuredCategories.map((category, index) => {
                    const isActive = index === activeSlide;

                    return (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`rounded-[1.35rem] border px-4 py-4 text-left transition ${
                          isActive
                            ? "border-white/15 bg-white text-primary shadow-elegant"
                            : "border-white/10 bg-white/8 text-white hover:bg-white/12"
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-[0.22em] opacity-60">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="mt-2 text-sm font-semibold leading-5">
                          {category.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                About Shravan
              </div>
              <h2 className="mt-5 text-4xl font-bold leading-tight text-foreground md:text-5xl">
                A modern industrial supplier with a more polished client experience.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                We supply materials that support day-to-day production, finishing,
                reinforcement, protection, and maintenance needs across multiple industrial environments.
                The focus is simple: better quality decisions, better service behavior, and better long-term trust.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Premium category curation instead of random listing",
                  "Faster movement from enquiry to requirement matching",
                  "Industrial understanding across FRP, stone, process and packaging needs",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                    <div className="text-foreground">{item}</div>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="mt-9 inline-flex items-center gap-2 font-semibold text-primary transition hover:gap-3"
              >
                Discover our story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[2.4rem] bg-[radial-gradient(circle_at_top_left,_oklch(0.64_0.18_152_/_0.18),_transparent_35%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.4rem] border border-border bg-card shadow-elegant">
                <img
                  src={heroImg}
                  alt="Industrial showcase"
                  className="h-[520px] w-full object-cover"
                  loading="lazy"
                  width={1920}
                  height={1280}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,oklch(0.17_0.04_155_/_0.78)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 grid gap-4 p-6 md:grid-cols-2 md:p-8">
                  <OverlayStat value="2018" label="Established" />
                  <OverlayStat value="Multi-sector" label="Industrial focus" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative bg-secondary/30 py-24 md:py-28">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Product Range"
            title="A sharper category-led experience."
            description="Designed to help buyers move quickly from category understanding to product-level action."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
              >
                <Link
                  to="/products/$slug"
                  params={{ slug: category.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image || undefined}
                      alt={category.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                      width={1280}
                      height={896}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,oklch(0.17_0.04_155_/_0.8)_100%)] opacity-80" />
                    <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      Category {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl font-bold text-foreground transition group-hover:text-primary">
                      {category.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                      {category.tagline}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {category.items.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Explore category
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-28">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Professional supply support, not just product availability."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {whyUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group rounded-[1.9rem] border border-border bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary shadow-glow transition group-hover:scale-110">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-secondary/30 py-24 md:py-28">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Client Voice" title="Confidence built through repeat business." />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="rounded-[2rem] border border-border bg-card p-8 shadow-card transition-smooth hover:shadow-elegant"
              >
                <Quote className="h-8 w-8 text-primary/28" />
                <p className="mt-5 text-base leading-8 text-foreground/90">
                  "{testimonial.text}"
                </p>
                <div className="mt-6 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="mt-6 border-t border-border pt-5">
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-[2.8rem] border border-border/70 px-8 py-14 text-primary-foreground shadow-elegant md:px-14 md:py-18">
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-white/12 blur-3xl" />
            <div className="absolute -left-12 bottom-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em]">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                Premium Industrial Supply
              </div>
              <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                Ready to source with more confidence and less friction?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
                Talk to us about your material requirements, target categories,
                project timelines, and bulk supply needs. We’ll help you move from enquiry to the right product path faster.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-primary shadow-elegant transition hover:scale-[1.02]"
                >
                  Request a Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/brochure"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white transition hover:bg-white/16"
                >
                  Download Brochure
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function OverlayStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur-sm">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/65">{label}</div>
    </div>
  );
}
