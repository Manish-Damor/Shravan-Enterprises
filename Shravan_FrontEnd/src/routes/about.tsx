import { createFileRoute } from "@/lib/tanstack-router-compat";
import { motion } from "framer-motion";
import { Target, Eye, Award, Users, TrendingUp, Heart } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Shravan Enterprises | Vacuum Infusion Consumables & FRP Raw Materials Supplier" },
      {
        name: "description",
        content:
          "Shravan Enterprises, established in 2018, is an ISO 9001:2015 certified supplier of vacuum infusion consumables, FRP raw materials, resin, fiberglass products, stone care materials and industrial consumables in India.",
      },
      { property: "og:title", content: "About Shravan Enterprises — Industrial Material Supplier Since 2018" },
      {
        property: "og:description",
        content:
          "Trusted supplier of vacuum infusion consumables, FRP raw materials, resin, fiberglass products, stone care materials and industrial consumables for composite and manufacturing industries.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const timeline = [
  {
    year: "2018",
    title: "Company Established",
    desc: "Shravan Enterprises started with a vision to supply quality industrial materials, FRP raw materials and composite consumables with dependable service.",
  },
  {
    year: "2020",
    title: "Product Range Expanded",
    desc: "Expanded into vacuum infusion consumables, resin, fiberglass products, stone care materials and FRP accessories for industrial applications.",
  },
  {
    year: "2022",
    title: "Quality Commitment Strengthened",
    desc: "Focused on consistent product quality, reliable sourcing and improved service standards for manufacturers, fabricators and industrial buyers.",
  },
  {
    year: "2024",
    title: "Growing Industrial Supply Network",
    desc: "Built a stronger supply network to serve customers across FRP, resin, composite, stone care and industrial manufacturing sectors in India.",
  },
];

const values = [
  {
    icon: Award,
    title: "Quality Products",
    desc: "Reliable industrial materials selected for performance and consistency.",
  },
  {
    icon: Heart,
    title: "Customer Support",
    desc: "Professional service with long-term business relationships.",
  },
  {
    icon: TrendingUp,
    title: "Reliable Supply",
    desc: "Consistent product availability for growing industrial needs.",
  },
  {
    icon: Users,
    title: "Industry Knowledge",
    desc: "Practical understanding of FRP, resin and composite applications.",
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Shravan Enterprises"
        title="Trusted industrial material supplier since 2018."
        description="Shravan Enterprises is an ISO 9001:2015 certified supplier of vacuum infusion consumables, FRP raw materials, resin, fiberglass products, stone care materials and industrial consumables in India."
        variant="about"
      />

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">
              Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
              Reliable supply partner for FRP, resin, stone care and composite industries.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-5 text-lg text-muted-foreground leading-relaxed"
          >
            <p>
              Established in 2018, Shravan Enterprises started with a clear goal to provide quality
              industrial materials, dependable product supply and professional service to customers
              in the composite, FRP, resin, stone care and manufacturing industries.
            </p>

            <p>
              We supply a wide range of products including vacuum bagging film, breather fabric,
              vacuum infusion mesh, spiral tube, feed hose, spring hose, sealant tape, paint rollers,
              resin, chemicals, fiberglass materials, FRP accessories and allied industrial
              consumables.
            </p>

            <p>
              Today, Shravan Enterprises is known as a trusted sourcing partner for manufacturers,
              fabricators, contractors and industrial buyers looking for vacuum infusion consumables,
              FRP raw materials, resin and composite industry materials in India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text:
                "To provide quality vacuum infusion consumables, FRP raw materials, resin, fiberglass products, stone care materials and industrial consumables with reliable service, fair pricing and timely supply.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              text:
                "To become one of India’s most trusted sourcing partners for composite, FRP, resin, stone care and industrial material requirements by delivering consistent quality and long-term customer support.",
            },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-3xl p-10 bg-card border border-border shadow-card"
            >
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
          <SectionHeader eyebrow="Our Journey" title="Milestones that shaped Shravan Enterprises." />

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
                  className={`relative grid md:grid-cols-2 gap-8 ${
                    i % 2 === 1 ? "md:[direction:rtl]" : ""
                  }`}
                >
                  <div
                    className={`pl-12 md:pl-0 ${
                      i % 2 === 0
                        ? "md:text-right md:pr-12"
                        : "md:pl-12 md:[direction:ltr]"
                    }`}
                  >
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
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-7 bg-card border border-border shadow-card hover:shadow-elegant hover:border-primary/40 transition-smooth text-center"
              >
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
