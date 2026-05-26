import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
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
      { title: "Gallery — Shravan Enterprises" },
      { name: "description", content: "Premium industrial gallery of our products, facilities and supply operations." },
      { property: "og:title", content: "Gallery — Shravan Enterprises" },
      { property: "og:description", content: "A visual tour of our products and workshop." },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

const images = [
  { src: hero, alt: "Marble & Granite Showcase", span: "row-span-2" },
  { src: fiber, alt: "Fiberglass Rolls" },
  { src: resin, alt: "Resin Drums" },
  { src: vacuum, alt: "Vacuum Bagging Film", span: "col-span-2" },
  { src: marble, alt: "Marble Texture" },
  { src: stone, alt: "Stone Care Products", span: "row-span-2" },
  { src: acc, alt: "FRP Accessories" },
];

function Gallery() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <PageHero eyebrow="Gallery" title="A glimpse into our operation." description="Premium products, professional workshop, and the people behind our service." />

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] gap-4">
            {images.map((img, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onClick={() => setActive(img.src)}
                className={`group relative overflow-hidden rounded-2xl shadow-card hover:shadow-elegant transition-smooth ${img.span ?? ""}`}
              >
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth" style={{ background: "linear-gradient(180deg, transparent 50%, oklch(0.18 0.05 155 / 0.8))" }} />
                <div className="absolute bottom-3 left-4 right-4 text-left text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-smooth">{img.alt}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur grid place-items-center p-6" onClick={() => setActive(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setActive(null)}>
            <X />
          </button>
          <img src={active} alt="" className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-elegant" />
        </div>
      )}
    </>
  );
}