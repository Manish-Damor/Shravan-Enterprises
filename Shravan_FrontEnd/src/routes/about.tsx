import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Eye, Award, Users, TrendingUp, Heart } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Shravan Enterprises" },
      { name: "description", content: "Established 2018. ISO 9001:2015 certified supplier of FRP, marble, granite & composite consumables across India." },
      { property: "og:title", content: "About — Shravan Enterprises" },
      { property: "og:description", content: "Our story, mission and the team behind India's trusted industrial supplier." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const timeline = [
  { year: "2018", title: "Company Founded", desc: "Shravan Enterprises established in Silvassa with a vision to deliver premium industrial materials." },
  { year: "2020", title: "Expanded Product Range", desc: "Added complete FRP raw materials and vacuum bonding consumables." },
  { year: "2022", title: "ISO 9001:2015 Certified", desc: "Achieved international quality certification reinforcing our commitment to excellence." },
  { year: "2024", title: "Pan-India Network", desc: "Established a robust supply network across 20+ cities serving 500+ clients." },
];

const values = [
  { icon: Award, title: "Quality First", desc: "Premium grade materials, every single batch." },
  { icon: Heart, title: "Customer Care", desc: "Long-term relationships built on service." },
  { icon: TrendingUp, title: "Continuous Growth", desc: "Always expanding our catalog and reach." },
  { icon: Users, title: "Expert Team", desc: "Industrial veterans with deep know-how." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Shravan"
        title="Premium materials. Industrial trust. Since 2018."
        description="We are an ISO 9001:2015 certified company supplying the building blocks of India's marble, granite, FRP and composite industries."
        variant="about"
      />

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Our Story</div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">From a single shop in Silvassa to a national supply partner.</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>Founded in 2018 by a team of industrial supply veterans, Shravan Enterprises set out with a simple mission — bring premium, ISO-grade raw materials to India's marble, granite and FRP industries at a price that empowers craftsmanship.</p>
            <p>Today, we serve over 500 clients across 20+ cities — from small artisanal stone workshops to large composite manufacturers — backed by a curated catalog of fiberglass, resins, vacuum bonding consumables and stone-care chemistries.</p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Our Mission", text: "To be India's most trusted source of premium industrial raw materials — combining unmatched quality, fair pricing and exceptional service." },
            { icon: Eye, title: "Our Vision", text: "To empower every marble, granite, FRP and composite professional with materials that elevate their craft to international standards." },
          ].map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="rounded-3xl p-10 bg-card border border-border shadow-card">
              <div className="w-14 h-14 rounded-2xl gradient-primary grid place-items-center shadow-glow">
                <b.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-foreground">{b.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Our Journey" title="Milestones that shaped us." />
          <div className="mt-16 relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary to-primary/40 -translate-x-1/2" />
            <div className="space-y-12">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative grid md:grid-cols-2 gap-8 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
                >
                  <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12 md:[direction:ltr]"}`}>
                    <div className="inline-block text-5xl font-bold text-gradient">{t.year}</div>
                    <h3 className="mt-2 text-xl font-bold text-foreground">{t.title}</h3>
                    <p className="mt-2 text-muted-foreground">{t.desc}</p>
                  </div>
                  <div className="hidden md:block" />
                  <div className="absolute left-4 md:left-1/2 top-2 w-4 h-4 rounded-full gradient-primary shadow-glow -translate-x-1/2 ring-4 ring-background" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Our Values" title="What we stand for." />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="rounded-2xl p-7 bg-card border border-border shadow-card hover:shadow-elegant hover:border-primary/40 transition-smooth text-center">
                <div className="w-14 h-14 rounded-2xl gradient-primary mx-auto grid place-items-center shadow-glow">
                  <v.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
