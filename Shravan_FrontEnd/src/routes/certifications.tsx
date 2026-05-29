import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";
import isoCertificate from "@/assets/certifications/iso-certificate.jpg";
import gstCertificate from "@/assets/certifications/gst-certificate.jpg";
import udyamRegistrationCertificate from "@/assets/certifications/udyam-registration-certificate.jpg";
import qualityPolicy from "@/assets/certifications/quality-policy.jpeg";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications - ISO 9001:2015 | Shravan Enterprises" },
      {
        name: "description",
        content:
          "ISO 9001:2015 certified company. Premium quality, internationally recognized standards.",
      },
      { property: "og:title", content: "Certifications - Shravan Enterprises" },
      {
        property: "og:description",
        content: "Quality and compliance at the heart of every batch we ship.",
      },
    ],
    links: [{ rel: "canonical", href: "/certifications" }],
  }),
  component: Certifications,
});

const certs = [
  {
    image: isoCertificate,
    badge: "ISO",
    title: "ISO 9001:2015 Certificate",
    desc: "Quality management system certification covering supply of consumables and spare parts for the Italian marble and granite industries.",
  },
  {
    image: gstCertificate,
    badge: "GST",
    title: "GST Registration Certificate",
    desc: "Official GST registration certificate issued for Shravan Enterprises.",
  },
  {
    image: udyamRegistrationCertificate,
    badge: "MSME",
    title: "Udyam Registration Certificate",
    desc: "Government-issued MSME registration confirming enterprise status.",
  },
  {
    image: qualityPolicy,
    badge: "Quality",
    title: "Quality Policy Document",
    desc: "Documented quality policy outlining our commitment to excellence and compliance.",
  },
];

function Certifications() {
  return (
    <>
      <PageHero
        eyebrow="Certifications"
        title="Quality is non-negotiable."
        description="Internationally recognized certifications and processes that ensure every product meets the highest standards."
        variant="certifications"
      />

      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-5 sm:px-6">
          <SectionHeader
            eyebrow="Certificate Gallery"
            title="Recognition that backs our promise."
          />
          <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {certs.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="overflow-hidden rounded-[1.5rem] bg-card border border-border shadow-card transition-smooth hover:border-primary/40 hover:shadow-elegant sm:rounded-[2rem]"
              >
                <a href={c.image} target="_blank" rel="noreferrer" className="block">
                  <div className="aspect-[3/4] overflow-hidden bg-secondary/30 sm:aspect-[4/5]">
                    <img
                      src={c.image || undefined}
                      alt={c.title}
                      className="h-full w-full object-cover object-top transition-smooth duration-500 hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                </a>
                <div className="p-5 sm:p-6">
                  <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {c.badge}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground sm:text-xl">{c.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{c.desc}</p>
                  <a
                    href={c.image}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center text-sm font-semibold text-primary transition hover:opacity-80"
                  >
                    View full certificate
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
