import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, ShieldCheck, BadgeCheck, Trophy } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — ISO 9001:2015 | Shravan Enterprises" },
      { name: "description", content: "ISO 9001:2015 certified company. Premium quality, internationally recognized standards." },
      { property: "og:title", content: "Certifications — Shravan Enterprises" },
      { property: "og:description", content: "Quality and compliance at the heart of every batch we ship." },
    ],
    links: [{ rel: "canonical", href: "/certifications" }],
  }),
  component: Certifications,
});

const certs = [
  { icon: ShieldCheck, title: "ISO 9001:2015 Certified", desc: "International quality management system certification covering all our processes." },
  { icon: BadgeCheck, title: "MSME Registered", desc: "Officially registered with the Government of India as a Micro, Small & Medium Enterprise." },
  { icon: Trophy, title: "Trusted Supplier Award", desc: "Recognized by leading clients for consistent quality and on-time delivery." },
  { icon: Award, title: "Quality Commitment", desc: "Every batch undergoes strict QC before dispatch to ensure premium grade." },
];

function Certifications() {
  return (
    <>
      <PageHero eyebrow="Certifications" title="Quality is non-negotiable." description="Internationally recognized certifications and processes that ensure every product meets the highest standards." />

      <section className="py-24">
        <div className="container mx-auto px-6">
          {/* Featured ISO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-20 text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 animate-pulse-glow" style={{ background: "oklch(0.65 0.18 152)" }} />
            <div className="relative grid md:grid-cols-[auto_1fr] gap-10 items-center">
              <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur grid place-items-center border border-white/20 mx-auto animate-float">
                <Award className="w-20 h-20 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs font-semibold tracking-[0.25em] uppercase text-white/70">Flagship Certification</div>
                <h2 className="mt-3 text-4xl md:text-6xl font-bold">ISO 9001:2015</h2>
                <p className="mt-4 text-lg text-white/85 max-w-2xl">Our quality management system is certified to the latest international standard — covering procurement, storage, dispatch and customer service across our entire operation.</p>
              </div>
            </div>
          </motion.div>

          {/* Cards */}
          <div className="mt-12">
            <SectionHeader eyebrow="More Credentials" title="Recognition that backs our promise." />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {certs.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl p-7 bg-card border border-border shadow-card hover:shadow-elegant hover:border-primary/40 transition-smooth text-center"
                >
                  <div className="w-14 h-14 rounded-2xl gradient-primary mx-auto grid place-items-center shadow-glow">
                    <c.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="mt-5 font-bold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}