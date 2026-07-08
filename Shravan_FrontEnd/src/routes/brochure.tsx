import { createFileRoute } from "@/lib/tanstack-router-compat";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import heroImage from "@/assets/hero-industrial.jpg";
import brochurePdf from "@/assets/Pdf/SHRAVANENTERPRISES.pdf";
import { submitBrochureEnquiry } from "@/lib/catalog";

const BROCHURE_PATH = brochurePdf;
const BROCHURE_FILE_NAME = "Shravan-Enterprises-Brochure.pdf";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Route = createFileRoute("/brochure")({
  head: () => ({
    meta: [
      { title: "Brochure - Shravan Enterprises" },
      {
        name: "description",
        content:
          "Request and download the Shravan Enterprises brochure with company profile, product categories, and industrial supply capabilities.",
      },
    ],
    links: [{ rel: "canonical", href: "/brochure" }],
  }),
  component: BrochurePage,
});

function clearBrochureFormStorage() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("brochure_name");
  window.localStorage.removeItem("brochure_email");
  window.sessionStorage.removeItem("brochure_name");
  window.sessionStorage.removeItem("brochure_email");
}

async function downloadBrochureFile() {
  const anchor = document.createElement("a");
  anchor.href = BROCHURE_PATH;
  anchor.download = BROCHURE_FILE_NAME;
  anchor.rel = "noreferrer";
  anchor.target = "_blank";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function BrochurePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    clearBrochureFormStorage();
    setName("");
    setEmail("");
  }, []);

  const validate = () => {
    const nextErrors: { name?: string; email?: string } = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      nextErrors.name = "Name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setFieldErrors(nextErrors);

    return {
      valid: Object.keys(nextErrors).length === 0,
      trimmedName,
      trimmedEmail,
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const validation = validate();
    if (!validation.valid) return;

    setLoading(true);

    try {
      await submitBrochureEnquiry({
        name: validation.trimmedName,
        email: validation.trimmedEmail,
      });

      await downloadBrochureFile();
      setName("");
      setEmail("");
      setFieldErrors({});
      clearBrochureFormStorage();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to process your brochure request right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,_oklch(0.16_0.05_160),_oklch(0.28_0.08_155)_52%,_oklch(0.22_0.05_152))] text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.14]">
          <img
            src={heroImage || undefined}
            alt="Shravan Enterprises brochure"
            className="h-full w-full object-cover mix-blend-screen"
            width={1920}
            height={1280}
          />
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute -right-16 top-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative container mx-auto px-6 py-18 md:py-24 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Company Brochure
              </div>

              <h1 className="mt-6 max-w-[10ch] text-5xl font-bold leading-[0.95] md:max-w-[11ch] md:text-7xl">
                Download Our Brochure
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
                Get a polished overview of Shravan Enterprises, our industrial
                product categories, and the supply capabilities we bring to
                composite, stone-Pro, packaging, and process industries.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <HeroMetric value="12+" label="Core categories" />
                <HeroMetric value="99+" label="Listed products" />
                <HeroMetric value="PDF" label="Instant download" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="relative"
            >
              <div className="absolute inset-8 rounded-[2.2rem] border border-white/10 bg-white/6 backdrop-blur-xl" />
              <div className="relative rounded-[2.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] p-5 shadow-2xl backdrop-blur-xl md:p-6">
                <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.12))] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                        Download pack
                      </div>
                      <div className="mt-2 text-2xl font-bold text-white">
                        Shravan Enterprises
                      </div>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/14 bg-white/10">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
                    <img
                      src={heroImage || undefined}
                      alt="Brochure cover preview"
                      className="h-64 w-full object-cover md:h-72"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <GlassFact
                      icon={<ShieldCheck className="h-4 w-4" />}
                      title="Professional overview"
                      text="Clean company introduction and industrial positioning."
                    />
                    <GlassFact
                      icon={<FileCheck2 className="h-4 w-4" />}
                      title="Product snapshot"
                      text="Quick understanding of major categories and supply scope."
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MiniStrip title="Format" value="PDF brochure" />
                  <MiniStrip title="Access" value="After submission" />
                  <MiniStrip title="Use case" value="Sales & procurement" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-18 md:py-22">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_oklch(0.65_0.18_152_/_0.08),_transparent_28%),linear-gradient(180deg,_transparent,_oklch(0.975_0.008_150))]" />
        <div className="container relative mx-auto px-6">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="rounded-[2.2rem] border border-border/80 bg-card p-7 shadow-card md:p-8"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                Why request it
              </div>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-foreground">
                A brochure that feels boardroom-ready, not generic.
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                This brochure is structured for serious buyers, channel partners,
                and project teams who need a concise introduction to our
                categories, credibility, and industrial supply breadth.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "Company profile",
                    text: "A clear snapshot of Shravan Enterprises and our operating focus.",
                  },
                  {
                    title: "Category coverage",
                    text: "A professional overview of product families across multiple industrial needs.",
                  },
                  {
                    title: "Sales-ready format",
                    text: "Easy to share internally with procurement teams, customers, and site engineers.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-border bg-secondary/35 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-foreground">{item.title}</div>
                        <div className="mt-1 text-sm leading-6 text-muted-foreground">
                          {item.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.7rem] border border-primary/12 bg-[linear-gradient(135deg,_oklch(0.97_0.01_150),_oklch(0.94_0.02_150))] p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">
                      Fast access, clean follow-up
                    </div>
                    <div className="mt-1 text-sm leading-6 text-muted-foreground">
                      Submit once, download instantly, and keep a properly branded company profile ready for future conversations.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="overflow-hidden rounded-[2.2rem] border border-border/80 bg-card shadow-card"
            >
              <div className="border-b border-border bg-[linear-gradient(135deg,_oklch(0.985_0.008_150),_oklch(0.96_0.012_150))] p-7 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-[1.4rem] bg-primary text-primary-foreground shadow-glow">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                      Brochure Access
                    </div>
                    <h3 className="mt-2 text-3xl font-bold leading-tight text-foreground">
                      Request your download
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                      Enter your professional details below. We’ll save the request and unlock the brochure instantly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-7 md:p-8">
                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                  <TrustPill icon={<LockKeyhole className="h-4 w-4" />} label="Secure form" />
                  <TrustPill icon={<FileText className="h-4 w-4" />} label="Instant PDF" />
                  <TrustPill icon={<ArrowDownRight className="h-4 w-4" />} label="One-step access" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="brochure-name" className="text-sm font-medium text-foreground">
                      Name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="brochure-name"
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your full name"
                        maxLength={100}
                        aria-invalid={Boolean(fieldErrors.name)}
                        className="w-full rounded-[1.35rem] border border-border bg-secondary/35 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    {fieldErrors.name ? (
                      <p className="text-sm text-rose-600">{fieldErrors.name}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="brochure-email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="brochure-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Your email address"
                        maxLength={255}
                        aria-invalid={Boolean(fieldErrors.email)}
                        className="w-full rounded-[1.35rem] border border-border bg-secondary/35 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    {fieldErrors.email ? (
                      <p className="text-sm text-rose-600">{fieldErrors.email}</p>
                    ) : null}
                  </div>

                  {formError ? (
                    <div className="rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {formError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[1.35rem] gradient-primary px-5 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Download className="h-4 w-4" />
                    {loading ? "Submitting..." : "Submit & Download Brochure"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/65">{label}</div>
    </div>
  );
}

function GlassFact({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
      <div className="flex items-center gap-2 text-white/78">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
    </div>
  );
}

function MiniStrip({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/8 px-4 py-3 text-white/85">
      <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">{title}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function TrustPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/35 px-4 py-2 text-sm font-medium text-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
  );
}
