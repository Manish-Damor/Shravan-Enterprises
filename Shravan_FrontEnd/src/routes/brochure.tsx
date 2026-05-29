import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Download, FileText, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";

import heroImage from "@/assets/hero-industrial.jpg";
import { PageHero } from "@/components/site/PageHero";
import { submitBrochureEnquiry } from "@/lib/catalog";

const BROCHURE_PATH = "/SHRAVANENTERPRISES.pdf";
const BROCHURE_FILE_NAME = "Shravan-Enterprises-Brochure.pdf";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Route = createFileRoute("/brochure")({
  head: () => ({
    meta: [
      { title: "Brochure — Shravan Enterprises" },
      { name: "description", content: "Download our company brochure after sharing your details." },
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
    if (!validation.valid) {
      return;
    }

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
      <PageHero
        eyebrow="Company Brochure"
        title="Download Our Brochure"
        description="Share your name and email to unlock the brochure, then download the PDF instantly."
      />

      <section className="relative py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_28%)]" />
        <div className="container relative mx-auto px-6">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={heroImage || undefined}
                  alt="Shravan Enterprises brochure preview"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={1920}
                  height={1280}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.7)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground sm:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] backdrop-blur">
                    <FileText className="h-3.5 w-3.5" />
                    PDF Brochure
                  </div>
                  <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
                    A polished company profile for customers, partners, and project teams.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                    The brochure includes our industrial product range, service approach, and the
                    key categories we support across FRP, stone care, and composite applications.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                <div className="rounded-3xl border border-border bg-secondary/30 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    What you get
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      Company overview and positioning
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      Product families and capabilities
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      Premium support and service promise
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-border bg-secondary/30 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Download details
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div>File name: {BROCHURE_FILE_NAME}</div>
                    <div>Format: PDF</div>
                    <div>Access: after form submission</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-[2rem] border border-border bg-card p-6 shadow-card sm:p-8"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Brochure access
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    Request your download
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Enter your details once and the brochure will download automatically after we
                    save your request.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                      className="w-full rounded-2xl border border-border bg-secondary/40 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
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
                      className="w-full rounded-2xl border border-border bg-secondary/40 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  {fieldErrors.email ? (
                    <p className="text-sm text-rose-600">{fieldErrors.email}</p>
                  ) : null}
                </div>

                {formError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {formError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Download className="h-4 w-4" />
                  {loading ? "Submitting..." : "Submit & Download Brochure"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
