import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Factory,
  Handshake,
  Layers3,
  Map,
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

const SITE_URL = "https://shravanenterprises.pavitrasoft.in";
const SITE_NAME = "Shravan Enterprises";

const SEO_TITLE =
  "Shravan Enterprises | FRP Raw Materials, Resin, Stone Pro & Industrial Supplier in India";

const SEO_DESCRIPTION =
  "Shravan Enterprises is an ISO 9001:2015 certified industrial supplier in India offering FRP raw materials, resin and chemicals, fiberglass products, vacuum infusion materials, FRP accessories, stone pro systems, marble and granite solutions, packaging materials and industrial consumables.";

const SEO_KEYWORDS = [
  "Shravan Enterprises",
  "Shravan Enterprises Vapi",
  "FRP raw materials supplier",
  "FRP materials supplier India",
  "resin and chemicals supplier",
  "fiberglass supplier India",
  "vacuum infusion materials",
  "FRP accessories supplier",
  "stone Pro products",
  "marble granite solutions",
  "industrial consumables supplier",
  "industrial supplier Gujarat",
  "industrial supply India",
  "packaging materials supplier",
  "process supply solutions",
].join(", ");

const SEO_IMAGE = new URL(heroImg, SITE_URL).toString();
const LOGO_URL = `${SITE_URL}/logo.png`;

const PRODUCT_CATEGORIES = [
  "FRP Raw Materials",
  "Resin & Chemicals",
  "Fiberglass Products",
  "Vacuum Infusion Materials",
  "FRP Accessories",
  "Stone Pro Products",
  "Marble & Granite Solutions",
  "Industrial Consumables",
  "Packaging Materials",
];

const safeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: LOGO_URL,
      image: SEO_IMAGE,
      description: SEO_DESCRIPTION,
      slogan: "Premium FRP, resin, stone pro and industrial supply solutions.",
      email: "shravanenterprises1312@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vapi",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      areaServed: [
        {
          "@type": "Country",
          name: "India",
        },
      ],
      knowsAbout: PRODUCT_CATEGORIES,
      makesOffer: PRODUCT_CATEGORIES.map((category) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: category,
        },
      })),
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: SITE_NAME,
      url: SITE_URL,
      image: SEO_IMAGE,
      priceRange: "₹₹",
      description: SEO_DESCRIPTION,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vapi",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SEO_DESCRIPTION,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/products?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: SEO_TITLE,
      headline: "Shravan Enterprises - FRP, Resin, Stone Pro and Industrial Supply Solutions",
      description: SEO_DESCRIPTION,
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#organization`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: SEO_IMAGE,
      },
      breadcrumb: {
        "@id": `${SITE_URL}/#breadcrumb`,
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#product-categories`,
      name: "Shravan Enterprises Product Categories",
      itemListElement: PRODUCT_CATEGORIES.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
      })),
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      {
        name: "description",
        content: SEO_DESCRIPTION,
      },
      {
        name: "keywords",
        content: SEO_KEYWORDS,
      },
      {
        name: "author",
        content: SITE_NAME,
      },
      {
        name: "publisher",
        content: SITE_NAME,
      },
      {
        name: "robots",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      {
        name: "googlebot",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      {
        name: "bingbot",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      {
        name: "language",
        content: "English",
      },
      {
        name: "geo.region",
        content: "IN-GJ",
      },
      {
        name: "geo.placename",
        content: "Vapi, Gujarat, India",
      },
      {
        name: "theme-color",
        content: "#0f3d2e",
      },
      {
        name: "application-name",
        content: SITE_NAME,
      },
      {
        name: "apple-mobile-web-app-title",
        content: SITE_NAME,
      },

      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:locale",
        content: "en_IN",
      },
      {
        property: "og:site_name",
        content: SITE_NAME,
      },
      {
        property: "og:title",
        content: SEO_TITLE,
      },
      {
        property: "og:description",
        content: SEO_DESCRIPTION,
      },
      {
        property: "og:url",
        content: SITE_URL,
      },
      {
        property: "og:image",
        content: SEO_IMAGE,
      },
      {
        property: "og:image:secure_url",
        content: SEO_IMAGE,
      },
      {
        property: "og:image:alt",
        content:
          "Shravan Enterprises industrial supplier for FRP raw materials, resin, fiberglass, stone pro and industrial consumables",
      },
      {
        property: "og:image:width",
        content: "1200",
      },
      {
        property: "og:image:height",
        content: "630",
      },

      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: SEO_TITLE,
      },
      {
        name: "twitter:description",
        content: SEO_DESCRIPTION,
      },
      {
        name: "twitter:image",
        content: SEO_IMAGE,
      },
      {
        name: "twitter:image:alt",
        content:
          "Shravan Enterprises industrial supply solutions for FRP, resin, stone pro and consumables",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: SITE_URL,
      },
      {
        rel: "alternate",
        hrefLang: "en-IN",
        href: SITE_URL,
      },
      {
        rel: "preload",
        as: "image",
        href: heroImg,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: safeJsonLd(homeStructuredData),
      },
    ],
  }),
  component: Home,
});

const whyUs = [
  {
    icon: Award,
    title: "Assured Industrial Quality",
    desc: "Industrial-grade FRP, resin, stone pro and process materials backed by careful product selection and dependable quality standards.",
  },
  {
    icon: Shield,
    title: "Trusted Supply Partner",
    desc: "Preferred by buyers, fabricators, marble units, granite processors and production teams who value consistency and long-term reliability.",
  },
  {
    icon: Truck,
    title: "Reliable Pan-India Supply",
    desc: "Fast material movement across key regions with responsive support for urgent industrial, FRP and stone pro requirements.",
  },
  {
    icon: Sparkles,
    title: "Deep Product Range",
    desc: "From FRP raw materials and resin chemicals to vacuum infusion, stone pro, packaging and industrial consumables.",
  },
  {
    icon: Factory,
    title: "Industrial Understanding",
    desc: "Products aligned with shop-floor usage, fabrication needs, finishing work, maintenance realities and production workflows.",
  },
  {
    icon: CheckCircle2,
    title: "Professional Service",
    desc: "Clear communication, cleaner follow-through and purchase support that respects project timelines and bulk material needs.",
  },
];

const testimonials = [
  {
    name: "Krishna Global Marbles Stone LLP",
    company: "",
    text: "Shravan Enterprises has been a reliable supplier for our marble and stone pro material requirements. Their product quality, timely response, and professional service make them a trusted business partner.",
  },
  {
    name: "Center Stone Pvt Ltd",
    company: "",
    text: "Shravan Enterprises is a dependable partner for our material and finishing product needs. Their service response and product range are both highly satisfactory.",
  },
  {
    name: "Millennium Marble",
    company: "",
    text: "Shravan Enterprises provides quality products with a good understanding of stone pro and marble industry needs. Their reliable service and support make them a preferred supplier.",
  },
];

function Home() {
  const { data: catalog } = useQuery(getPublicCatalogQueryOptions());
  const activeCatalog = catalog ?? getFallbackCatalog();
  const categories = activeCatalog.categories;
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(4);

  useEffect(() => {
    if (categories.length <= 1) return;

    setActiveSlide((current) => (current >= categories.length ? 0 : current));
  }, [categories.length]);

  useEffect(() => {
    if (categories.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % categories.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [categories.length]);

  useEffect(() => {
    const syncVisibleCategoryCount = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCategoryCount(1);
        return;
      }

      if (width < 1280) {
        setVisibleCategoryCount(3);
        return;
      }

      setVisibleCategoryCount(4);
    };

    syncVisibleCategoryCount();
    window.addEventListener("resize", syncVisibleCategoryCount);

    return () => window.removeEventListener("resize", syncVisibleCategoryCount);
  }, []);

  const currentCategory = categories[activeSlide] ?? categories[0];
  const currentCategoryProducts = activeCatalog.products.filter(
    (product) => product.category_slug === currentCategory?.slug,
  );
  const categorySlideCount = String(activeSlide + 1).padStart(2, "0");
  const visibleCategoryCards = Array.from(
    { length: Math.min(visibleCategoryCount, categories.length) },
    (_, offset) => categories[(activeSlide + offset) % categories.length],
  ).filter(Boolean);

  const goToPreviousCategory = () => {
    if (categories.length === 0) return;
    setActiveSlide((current) => (current - 1 + categories.length) % categories.length);
  };

  const goToNextCategory = () => {
    if (categories.length === 0) return;
    setActiveSlide((current) => (current + 1) % categories.length);
  };

  const stats = [
    { value: "16+", label: "Years in trade", icon: Handshake },
    { value: `${activeCatalog.counts.categories}+`, label: "Active categories", icon: Layers3 },
    { value: `${activeCatalog.counts.products}+`, label: "Published products", icon: Boxes },
    { value: "Pan-India", label: "Industrial support", icon: Map },
  ];

  return (
    <>
      <section className="relative -mt-[var(--navbar-height)] overflow-hidden bg-[linear-gradient(135deg,_oklch(0.14_0.04_155),_oklch(0.2_0.05_157)_48%,_oklch(0.31_0.08_154))] text-primary-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Shravan Enterprises premium industrial materials including FRP raw materials, resin, fiberglass and stone pro products"
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

        <div className="relative site-container flex min-h-[calc(100svh-var(--navbar-height))] items-center px-1 pb-10 pt-[calc(var(--navbar-height)+24px)] md:pb-12 md:pt-[calc(var(--navbar-height)+32px)] lg:pt-[calc(var(--navbar-height)+20px)]">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(620px,0.92fr)] lg:items-start lg:gap-10 xl:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 38 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[49rem] pt-1 lg:pt-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] backdrop-blur-sm">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
                ISO 9001:2015 Certified Industrial Supply Partner
              </div>
              <h1 className="mt-6 max-w-[11ch] text-[clamp(4rem,4.8vw,5.8rem)] font-bold leading-[0.92] tracking-[-0.03em]">
                FRP, Resin, Stone Pro & Industrial Materials Supplier.
              </h1>
              <p className="mt-6 max-w-[650px] text-[1.05rem] font-normal leading-[1.75] text-white/80 md:text-[1.12rem] xl:text-[1.18rem] xl:leading-[1.8]">
                Shravan Enterprises is a trusted industrial supplier in India for FRP raw materials,
                resin and chemicals, fiberglass products, stone-Pro systems, vacuum-process
                materials, FRP accessories, packaging products and allied industrial consumables
                with dependable quality and responsive service.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  "FRP Raw Materials",
                  "Resin & Chemicals",
                  "stone pro Products",
                  "Vacuum Infusion",
                  "Industrial Consumables",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/84"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-primary shadow-elegant transition hover:scale-[1.02]"
                  aria-label="Explore Shravan Enterprises product range"
                >
                  Explore Product Range
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/brochure"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/14"
                  aria-label="Download Shravan Enterprises brochure"
                >
                  Download Brochure
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-panel flex min-h-[164px] flex-col justify-between rounded-[1.35rem] px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/6 text-emerald-200">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="mt-5 text-[1.7rem] font-bold leading-none text-white">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-[0.82rem] text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:pt-10"
            >
              <div className="absolute inset-6 rounded-[2.2rem] border border-white/10 bg-white/6 backdrop-blur-xl" />
              <div className="relative overflow-hidden rounded-[2.35rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-4 shadow-2xl backdrop-blur-xl md:p-5">
                <div className="glass-panel grid min-h-[642px] grid-rows-[auto_auto_1fr_auto] rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.16))] p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.24em] text-white/50">
                        Category spotlight
                      </div>
                      <div className="mt-2 text-[1.8rem] font-bold leading-tight text-white">
                        {currentCategory?.title ?? "Premium Industrial Solutions"}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
                      {categorySlideCount} / {String(categories.length).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="relative mt-4">
                    {currentCategory ? (
                      <Link
                        to="/products/$slug"
                        params={{ slug: currentCategory.slug }}
                        className="block overflow-hidden rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,247,242,0.94))]"
                        aria-label={`Open ${currentCategory.title} category page`}
                      >
                        <img
                          src={currentCategory.image || heroImg}
                          alt={`${currentCategory.title} supplied by Shravan Enterprises`}
                          className="h-60 w-full object-contain object-center p-4 transition duration-500 md:h-64 lg:h-[270px]"
                          loading="lazy"
                        />
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={goToPreviousCategory}
                      className="glass-panel absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white shadow-[0_0_30px_-10px_rgba(92,230,153,0.65)] transition hover:scale-105 hover:bg-white/14"
                      aria-label="Show previous category"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextCategory}
                      className="glass-panel absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white shadow-[0_0_30px_-10px_rgba(92,230,153,0.65)] transition hover:scale-105 hover:bg-white/14"
                      aria-label="Show next category"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid content-start gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                      <p className="min-h-[84px] text-sm leading-6 text-white/74 md:text-[0.95rem]">
                        {currentCategory?.tagline ??
                          "A curated industrial category built for FRP, resin, stone pro, process supply and cleaner buying decisions."}
                      </p>
                      <div className="mt-3 flex min-h-[76px] flex-wrap content-start gap-2">
                        {(currentCategory?.items ?? []).slice(0, 4).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[0.72rem] text-white/76"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2.5 text-sm text-white/70">
                        <span className="rounded-full border border-white/10 bg-black/12 px-3 py-1.5">
                          {currentCategoryProducts.length} products
                        </span>
                        <span className="rounded-full border border-white/10 bg-black/12 px-3 py-1.5">
                          {(currentCategory?.items ?? []).length} item groups
                        </span>
                      </div>
                    </div>
                    {currentCategory ? (
                      <Link
                        to="/products/$slug"
                        params={{ slug: currentCategory.slug }}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:scale-[1.02]"
                        aria-label={`View ${currentCategory.title} products`}
                      >
                        View category
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <button
                      type="button"
                      onClick={goToPreviousCategory}
                      className="glass-panel hidden h-11 w-11 shrink-0 place-items-center rounded-full text-white transition hover:scale-105 hover:bg-white/14 md:grid"
                      aria-label="Scroll category cards left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/54">
                      Browse all categories
                    </div>
                    <button
                      type="button"
                      onClick={goToNextCategory}
                      className="glass-panel hidden h-11 w-11 shrink-0 place-items-center rounded-full text-white transition hover:scale-105 hover:bg-white/14 md:grid"
                      aria-label="Scroll category cards right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
                    {visibleCategoryCards.map((category) => {
                      const categoryIndex = categories.findIndex(
                        (item) => item.slug === category.slug,
                      );
                      const isActive = categoryIndex === activeSlide;
                      const productCount = activeCatalog.products.filter(
                        (product) => product.category_slug === category.slug,
                      ).length;

                      return (
                        <button
                          key={category.slug}
                          type="button"
                          onClick={() => setActiveSlide(categoryIndex)}
                          className={`min-h-[108px] rounded-[1.35rem] border px-4 py-4 text-left transition ${
                            isActive
                              ? "border-white/15 bg-white text-primary shadow-elegant"
                              : "border-white/10 bg-white/8 text-white hover:bg-white/12"
                          }`}
                          aria-label={`Show ${category.title} category`}
                        >
                          <div className="text-[10px] uppercase tracking-[0.22em] opacity-60">
                            {String(categoryIndex + 1).padStart(2, "0")}
                          </div>
                          <div className="mt-2 text-sm font-semibold leading-5">
                            {category.title}
                          </div>
                          <div className="mt-2 text-xs leading-5 opacity-70">
                            {productCount} products
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-center">
                    <Link
                      to="/products"
                      className="text-sm font-semibold text-white/78 transition hover:text-white"
                    >
                      View full catalog
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-28">
        <div className="site-container px-1">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                About Shravan Enterprises
              </div>
              <h2 className="mt-5 text-4xl font-bold leading-tight text-foreground md:text-5xl">
                A modern industrial supplier for FRP, resin, stone Pro and process materials.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Shravan Enterprises supplies materials that support day-to-day production,
                reinforcement, finishing, protection, vacuum processing, packaging and industrial
                maintenance needs across multiple sectors. Our focus is simple: better material
                selection, better service response, better quality control and stronger long-term
                business trust.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Premium category curation for FRP raw materials, resin, stone pro and industrial consumables",
                  "Faster movement from enquiry to requirement matching for buyers and production teams",
                  "Industrial understanding across FRP fabrication, marble, granite, process and packaging needs",
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
                aria-label="Learn more about Shravan Enterprises"
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
                  alt="Shravan Enterprises industrial supply showcase for FRP materials resin chemicals and stone pro products"
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
        <div className="site-container px-1">
          <SectionHeader
            eyebrow="Product Range"
            title="Category-led industrial supply for faster buying decisions."
            description="Explore FRP raw materials, resin and chemicals, vacuum infusion products, fiberglass materials, FRP accessories, stone pro systems, packaging solutions and industrial consumables from Shravan Enterprises."
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
                  aria-label={`Explore ${category.title} products from Shravan Enterprises`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image || undefined}
                      alt={`${category.title} category from Shravan Enterprises industrial product range`}
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
        <div className="site-container px-1">
          <SectionHeader
            eyebrow="Why Choose Shravan Enterprises"
            title="Professional industrial supply support, not just product availability."
            description="We help buyers source reliable FRP materials, resin chemicals, stone-Pro products, vacuum-process materials and industrial consumables with better clarity, consistency and service."
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
        <div className="site-container px-1">
          <SectionHeader
            eyebrow="Client Voice"
            title="Confidence built through repeat business."
            description="Shravan Enterprises is trusted by marble, stone pro, industrial and fabrication businesses for product quality, timely response and reliable material support."
          />
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
                <p className="mt-5 text-base leading-8 text-foreground/90">“{testimonial.text}”</p>
                <div className="mt-6 flex gap-1" aria-label="5 star client rating">
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
        <div className="site-container px-1">
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
                Source FRP, resin, stone pro and industrial materials with more confidence.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
                Talk to Shravan Enterprises about your material requirements, target categories,
                project timelines and bulk supply needs. We help you move from enquiry to the right
                product path faster.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-primary shadow-elegant transition hover:scale-[1.02]"
                  aria-label="Request a quote from Shravan Enterprises"
                >
                  Request a Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/brochure"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white transition hover:bg-white/16"
                  aria-label="Download Shravan Enterprises product brochure"
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
