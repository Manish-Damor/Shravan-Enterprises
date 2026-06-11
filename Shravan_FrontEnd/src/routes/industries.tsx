import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Gem, Mountain, Factory, Layers, Wrench } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve — Shravan Enterprises" },
      { name: "description", content: "Trusted supplier for marble, granite, FRP manufacturing, composite manufacturing and industrial solutions." },
      { property: "og:title", content: "Industries — Shravan Enterprises" },
      { property: "og:description", content: "Materials and consumables for India's marble, granite, FRP and composite industries." },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
  component: Industries,
});

const industries = [
  { icon: Gem, title: "Marble Industry", desc: "Premium consumables for Italian marble processing, polishing and bonding." },
  { icon: Mountain, title: "Granite Industry", desc: "Stone care, sealers and vacuum bonding solutions for granite fabricators." },
  { icon: Factory, title: "FRP Manufacturing", desc: "Complete raw material supply for fiberglass reinforced plastic products." },
  { icon: Layers, title: "Composite Manufacturing", desc: "Resin systems, vacuum infusion and tooling for advanced composites." },
  { icon: Wrench, title: "Industrial Solutions", desc: "Spare parts and consumables for general industrial maintenance & production." },
];

function Industries() {
  return (
    <>
      <PageHero eyebrow="Industries We Serve" title="Powering India's industrial backbone." description="From artisanal stone pro workshops to large-scale composite manufacturers — we supply the materials that make industry move." />
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Sectors" title="Where our materials make the difference." />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl p-8 bg-card border border-border hover:border-primary/40 shadow-card hover:shadow-elegant transition-smooth"
              >
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-smooth" style={{ background: "oklch(0.55 0.17 152)" }} />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl gradient-primary grid place-items-center shadow-glow group-hover:scale-110 transition-smooth">
                    <ind.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-foreground">{ind.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{ind.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}