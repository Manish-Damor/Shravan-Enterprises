import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Shravan Enterprises" },
      { name: "description", content: "Get in touch with Shravan Enterprises in Silvassa. Phone, email, address and inquiry form." },
      { property: "og:title", content: "Contact — Shravan Enterprises" },
      { property: "og:description", content: "Reach our team for product inquiries, quotes and technical support." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const details = [
  { icon: Phone, title: "Phone", lines: ["+91 98241 24043", "+91 98241 24073"], href: "tel:+919824124043" },
  { icon: Mail, title: "Email", lines: ["shravanenterprieses1312@gmail.com"], href: "mailto:shravanenterprieses1312@gmail.com" },
  { icon: MapPin, title: "Address", lines: ["Sri Residency E-Tower, Shop No. 1 & 2,", "Village Borkud Faliya, Silvassa – 396230,", "Dadra & Nagar Haveli"] },
  { icon: Clock, title: "Business Hours", lines: ["Mon – Sat: 9:30 AM – 7:30 PM", "Sunday: Closed"] },
];

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero eyebrow="Contact Us" title="Let's build something premium together." description="Speak to our team for custom quotes, bulk orders or technical assistance." />

      <section className="py-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="lg:col-span-3 rounded-3xl p-8 md:p-10 bg-card border border-border shadow-card">
            <h2 className="text-3xl font-bold text-foreground">Send an inquiry</h2>
            <p className="mt-2 text-muted-foreground">We typically respond within a few business hours.</p>
            {sent ? (
              <div className="mt-8 rounded-2xl p-8 bg-primary/10 border border-primary/30 text-primary text-center font-semibold">
                Thank you! Your inquiry has been noted. We'll get in touch shortly.
              </div>
            ) : (
              <form className="mt-7 grid sm:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <input required maxLength={100} placeholder="Full Name" className="px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                <input required maxLength={150} placeholder="Company" className="px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                <input required type="tel" maxLength={20} placeholder="Phone" className="px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                <input required type="email" maxLength={255} placeholder="Email" className="px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                <input maxLength={200} placeholder="Subject" className="sm:col-span-2 px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                <textarea required rows={5} maxLength={1500} placeholder="Tell us about your requirement..." className="sm:col-span-2 px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                <button type="submit" className="sm:col-span-2 py-4 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.01] transition-smooth">
                  Send Inquiry
                </button>
              </form>
            )}
          </motion.div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-4">
            {details.map((d, i) => (
              <motion.div key={d.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="rounded-2xl p-6 bg-card border border-border shadow-card flex gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary grid place-items-center shrink-0 shadow-glow">
                  <d.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground">{d.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground space-y-0.5">
                    {d.lines.map((l) => (
                      d.href ? <a key={l} href={d.href} className="block hover:text-primary break-all">{l}</a> : <div key={l}>{l}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            <a href="https://wa.me/919824124043" className="flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold shadow-glow hover:scale-[1.02] transition-smooth" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl overflow-hidden shadow-elegant border border-border">
            <iframe
              title="Shravan Enterprises Location"
              src="https://www.google.com/maps?q=Silvassa+396230&output=embed"
              width="100%"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>
    </>
  );
}