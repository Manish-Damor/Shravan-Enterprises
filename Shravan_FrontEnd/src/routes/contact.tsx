import { createFileRoute } from "@/lib/tanstack-router-compat";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { submitPublicEnquiry } from "@/lib/catalog";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Shravan Enterprises" },
      {
        name: "description",
        content:
          "Get in touch with Shravan Enterprises in Silvassa. Phone, email, address and inquiry form.",
      },
      { property: "og:title", content: "Contact — Shravan Enterprises" },
      {
        property: "og:description",
        content: "Reach our team for product inquiries, quotes and technical support.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const details = [
  {
    icon: Phone,
    title: "Phone",
    lines: ["+91 98241 24043", "+91  8000641312 "],
    href: "tel:+919824124043",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["shravanenterprises1312@gmail.com"],
    href: "mailto:shravanenterprises1312@gmail.com",
  },
  {
    icon: MapPin,
    title: "Address",
    lines: [
      "Sri Residency E-Tower, Shop No. 1 & 2,",
      "Village Borkud Faliya, Silvassa – 396230,",
      "Dadra & Nagar Haveli",
    ],
  },
  {
    icon: Clock,
    title: "Business Hours",
    lines: ["Mon – Sat: 9:30 AM – 7:30 PM", "Sunday: Closed"],
  },
];

const WHATSAPP_NUMBER = "919824124043";

function buildWhatsAppInquiryUrl(values: {
  customer_name: string;
  company: string;
  mobile: string;
  email: string;
  subject: string;
  message: string;
}) {
  const text = [
    "Hello Shravan Enterprises,",
    "",
    "I want to send an inquiry:",
    `Name: ${values.customer_name}`,
    `Company: ${values.company}`,
    `Phone: ${values.mobile}`,
    `Email: ${values.email}`,
    `Subject: ${values.subject || "General Inquiry"}`,
    `Message: ${values.message}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const customer_name = String(formData.get("name") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const mobile = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const whatsappUrl = buildWhatsAppInquiryUrl({
      customer_name,
      company,
      mobile,
      email,
      subject,
      message,
    });

    try {
      if (typeof window !== "undefined") {
        const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        if (!popup) {
          window.location.href = whatsappUrl;
        }
      }

      try {
        await submitPublicEnquiry({
          customer_name,
          company,
          mobile,
          email,
          subject,
          message: [
            company ? `Company: ${company}` : null,
            subject ? `Subject: ${subject}` : null,
            message,
          ]
            .filter(Boolean)
            .join("\n\n"),
        });
      } catch {
        // WhatsApp is the primary submit path here, so do not block the user on API issues.
      }

      setSent(true);
      event.currentTarget.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send inquiry right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's build something premium together."
        description="Speak to our team for custom quotes, bulk orders or technical assistance."
        variant="contact"
      />

      <section className="py-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 rounded-3xl p-8 md:p-10 bg-card border border-border shadow-card"
          >
            <h2 className="text-3xl font-bold text-foreground">Send an inquiry</h2>
            <p className="mt-2 text-muted-foreground">
              We typically respond within a few business hours.
            </p>
            {sent ? (
              <div className="mt-8 rounded-2xl p-8 bg-primary/10 border border-primary/30 text-primary text-center font-semibold">
                Thank you! Your inquiry has been noted. We'll get in touch shortly.
              </div>
            ) : (
              <form className="mt-7 grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <input
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Full Name"
                  className="px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  name="company"
                  required
                  maxLength={150}
                  placeholder="Company"
                  className="px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  name="phone"
                  required
                  type="tel"
                  maxLength={20}
                  placeholder="Phone"
                  className="px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  name="email"
                  required
                  type="email"
                  maxLength={255}
                  placeholder="Email"
                  className="px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  name="subject"
                  maxLength={200}
                  placeholder="Subject"
                  className="sm:col-span-2 px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  name="message"
                  required
                  rows={5}
                  maxLength={1500}
                  placeholder="Tell us about your requirement..."
                  className="sm:col-span-2 px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                {errorMessage ? (
                  <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="sm:col-span-2 py-4 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.01] transition-smooth disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-4">
            {details.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-6 bg-card border border-border shadow-card flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary grid place-items-center shrink-0 shadow-glow">
                  <d.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground">{d.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground space-y-0.5">
                    {d.lines.map((l) =>
                      d.href ? (
                        <a key={l} href={d.href} className="block hover:text-primary break-all">
                          {l}
                        </a>
                      ) : (
                        <div key={l}>{l}</div>
                      ),
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <a
              href="https://wa.me/919824124043"
              className="flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold shadow-glow hover:scale-[1.02] transition-smooth"
              style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
            >
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3567.4633053205193!2d72.9944168750222!3d20.26247078120192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cb5909684093%3A0xbf24fd4a2da57dcd!2sSRI%20RESIDENCY!5e1!3m2!1sen!2sin!4v1779965185176!5m2!1sen!2sin"
              width="100%"
              height="450"
              allowFullScreen
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
