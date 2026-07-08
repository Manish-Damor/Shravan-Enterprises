import { createFileRoute } from "@/lib/tanstack-router-compat";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Expand, Images, Layers3, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { fetchPublicCatalog, getFallbackCatalog, type PublicProduct } from "@/lib/catalog";
import hero from "@/assets/hero-industrial.jpg";
import marble from "@/assets/marble-granite.jpg";
import fiber from "@/assets/fiberglass.jpg";
import resin from "@/assets/resin.jpg";
import vacuum from "@/assets/vacuum.jpg";
import acc from "@/assets/accessories.jpg";
import stone from "@/assets/stonecare.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery - Shravan Enterprises" },
      {
        name: "description",
        content: "Premium industrial gallery of our products, facilities and supply operations.",
      },
      { property: "og:title", content: "Gallery - Shravan Enterprises" },
      { property: "og:description", content: "A visual tour of our products and workshop." },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

type GalleryImage = {
  src: string;
  alt: string;
  key: string;
  productName?: string;
  span?: string;
};

const fallbackImages: GalleryImage[] = [
  {
    src: hero,
    alt: "Marble and granite showcase",
    key: "fallback-hero",
    productName: "Shravan Enterprises",
    span: "md:col-span-2 md:row-span-2",
  },
  { src: fiber, alt: "Fiberglass rolls", key: "fallback-fiber", productName: "Fiberglass" },
  { src: resin, alt: "Resin drums", key: "fallback-resin", productName: "Resin" },
  {
    src: vacuum,
    alt: "Vacuum bagging film",
    key: "fallback-vacuum",
    productName: "Vacuum Process",
    span: "md:col-span-2",
  },
  { src: marble, alt: "Marble texture", key: "fallback-marble", productName: "Marble" },
  {
    src: stone,
    alt: "Stone care products",
    key: "fallback-stone",
    productName: "Stone Care",
    span: "md:row-span-2",
  },
  { src: acc, alt: "FRP accessories", key: "fallback-accessories", productName: "Accessories" },
];

const gallerySpans = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "",
  "md:row-span-2",
  "",
  "md:col-span-2",
] as const;

function formatGalleryAlt(product: PublicProduct, index: number) {
  if (index === 0) {
    return product.name;
  }

  return `${product.name} gallery image ${index}`;
}

function buildGalleryImages(products: PublicProduct[]) {
  const seen = new Set<string>();
  const images: GalleryImage[] = [];

  for (const product of products) {
    const productImages = [product.image, ...(product.gallery_images ?? [])].filter(
      Boolean,
    ) as string[];

    for (const [index, src] of productImages.entries()) {
      const normalizedSrc = src.trim();
      if (!normalizedSrc || seen.has(normalizedSrc)) continue;
      seen.add(normalizedSrc);

      images.push({
        src: normalizedSrc,
        alt: formatGalleryAlt(product, index),
        key: `${product.slug}-${index}-${normalizedSrc}`,
        productName: product.name,
        span: gallerySpans[images.length % gallerySpans.length] || undefined,
      });
    }
  }

  return images;
}

function Gallery() {
  const [active, setActive] = useState<GalleryImage | null>(null);
  const { data: catalog } = useQuery({
    queryKey: ["public-catalog"],
    queryFn: fetchPublicCatalog,
    staleTime: 5 * 60 * 1000,
  });

  const activeCatalog = catalog ?? getFallbackCatalog();
  const liveImages = buildGalleryImages(activeCatalog.products ?? []);
  const galleryImages = liveImages.length > 0 ? liveImages : fallbackImages;
  const previewImages = galleryImages.slice(0, 4);
  const liveCategoryNames = activeCatalog.categories.slice(0, 5).map((category) => category.title);

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,_oklch(0.15_0.04_156),_oklch(0.25_0.06_156)_46%,_oklch(0.5_0.16_153)_100%)] text-primary-foreground">
        <div className="absolute inset-0">
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-300/18 blur-3xl" />
          <div className="absolute right-0 top-16 h-[28rem] w-[28rem] rounded-full bg-white/8 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
        </div>

        <div className="relative container mx-auto px-6 pb-18 pt-24 md:pb-22 md:pt-28 lg:pb-26 lg:pt-32">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_31rem] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                Live Gallery
              </div>

              <h1 className="mt-7 max-w-[11ch] text-5xl font-bold leading-[0.94] md:max-w-[12ch] md:text-7xl xl:text-8xl">
                A richer view of your live product catalog.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
                Every new product upload can appear here automatically. The gallery now feels more
                premium, more visual, and more aligned with a professional industrial website.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {liveCategoryNames.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/84"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <GalleryStat
                  icon={Images}
                  value={String(galleryImages.length)}
                  label="Live gallery images"
                />
                <GalleryStat
                  icon={Layers3}
                  value={String(activeCatalog.counts.categories)}
                  label="Active categories"
                />
                <GalleryStat
                  icon={Sparkles}
                  value={String(activeCatalog.counts.products)}
                  label="Published products"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute inset-6 rounded-[2.3rem] border border-white/10 bg-white/6 backdrop-blur-xl" />
              <div className="relative overflow-hidden rounded-[2.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05))] p-5 shadow-2xl backdrop-blur-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {previewImages.map((image, index) => (
                    <motion.button
                      key={image.key}
                      type="button"
                      onClick={() => setActive(image)}
                      animate={{ y: index % 2 === 0 ? [0, -6, 0] : [0, 6, 0] }}
                      transition={{
                        duration: 7 + index,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`group relative overflow-hidden rounded-[1.8rem] border border-white/12 bg-black/10 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)] ${
                        index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"
                      }`}
                    >
                      <img
                        src={image.src || undefined}
                        alt={image.alt}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,oklch(0.14_0.04_156_/_0.88)_100%)]" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                          {index === 0 ? "Featured frame" : "Catalog image"}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white sm:text-base">
                          {image.productName ?? image.alt}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-[1.6rem] border border-white/10 bg-white/8 px-4 py-4 text-white/82 backdrop-blur-sm">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                      Gallery behavior
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      New uploaded product images are surfaced automatically.
                    </div>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/10">
                    <Expand className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative bg-[linear-gradient(180deg,oklch(0.99_0.005_150),oklch(0.965_0.01_150))] py-20 md:py-24">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,oklch(0.64_0.18_152_/_0.12),transparent_65%)]" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Live Product Frames
              </div>
              <h2 className="mt-5 text-4xl font-bold leading-[1.02] text-foreground md:text-5xl lg:text-6xl">
                A sharper, more editorial gallery layout.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                This section is driven by your current database images, but presented with a more
                premium, design-led feel.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-border/70 bg-card px-5 py-4 shadow-card">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/70">
                Total visible frames
              </div>
              <div className="mt-2 text-3xl font-bold text-foreground">{galleryImages.length}</div>
            </div>
          </motion.div>

          <div className="mt-14 grid auto-rows-[210px] grid-cols-1 gap-5 sm:grid-cols-2 md:auto-rows-[230px] lg:grid-cols-4 lg:auto-rows-[250px]">
            {galleryImages.map((img, i) => (
              <motion.button
                key={img.key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 8) * 0.04 }}
                onClick={() => setActive(img)}
                className={`group relative overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant ${img.span ?? ""}`}
              >
                <img
                  src={img.src || undefined}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_36%,oklch(0.16_0.04_155_/_0.9)_100%)] opacity-90" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                  <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-white/10 text-white/88 opacity-0 transition group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/58">
                    {img.productName ?? "Gallery frame"}
                  </div>
                  <div className="mt-2 line-clamp-2 text-lg font-bold leading-tight text-white">
                    {img.alt}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {active ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-[linear-gradient(180deg,rgba(5,18,12,0.96),rgba(0,0,0,0.94))] p-6 backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/16"
            onClick={() => setActive(null)}
          >
            <X />
          </button>

          <div className="max-w-6xl">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 shadow-2xl backdrop-blur-sm">
              <img
                src={active.src || undefined}
                alt={active.alt}
                className="max-h-[78vh] w-full object-contain bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]"
              />
            </div>
            <div className="mt-5 flex flex-col gap-2 text-center text-white sm:text-left">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                {active.productName ?? "Gallery frame"}
              </div>
              <div className="text-xl font-bold sm:text-2xl">{active.alt}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function GalleryStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Images;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.7rem] border border-white/12 bg-white/8 px-5 py-5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/10">
          <Icon className="h-5 w-5 text-emerald-200" />
        </div>
        <div className="text-3xl font-bold text-white">{value}</div>
      </div>
      <div className="mt-4 text-sm text-white/64">{label}</div>
    </div>
  );
}
