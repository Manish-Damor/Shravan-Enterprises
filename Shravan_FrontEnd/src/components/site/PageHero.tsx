import { motion } from "framer-motion";
import {
  BadgeCheck,
  Boxes,
  Clock3,
  Factory,
  FileCheck2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  description,
  variant = "default",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  variant?: "default" | "certifications" | "contact" | "about";
}) {
  const isCertifications = variant === "certifications";
  const isContact = variant === "contact";
  const isAbout = variant === "about";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top, oklch(0.65 0.18 152 / 0.5), transparent 60%)",
        }}
      />
      {(isCertifications || isContact || isAbout) && (
        <>
          <div
            className="absolute inset-0 opacity-[0.1] md:opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "linear-gradient(to right, rgba(0,0,0,1) 35%, rgba(0,0,0,0.15) 75%, transparent 100%)",
            }}
          />
          <div
            className="absolute right-[12%] top-16 hidden h-72 w-72 rounded-full border border-white/10 lg:block"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset" }}
          />
          <div
            className="absolute right-[15%] top-24 hidden h-56 w-56 rounded-full border border-white/10 lg:block"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset" }}
          />
        </>
      )}
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: "oklch(0.65 0.18 152)" }}
      />
      {(isContact || isAbout) && (
        <>
          <div className="absolute left-[8%] top-28 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="absolute right-[14%] top-14 h-64 w-64 rounded-full bg-white/6 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage:
                "radial-gradient(circle at 30% 30%, rgba(0,0,0,1), rgba(0,0,0,0.55) 45%, transparent 90%)",
            }}
          />
        </>
      )}
      <div
        className={`relative container mx-auto px-5 py-16 text-primary-foreground sm:px-6 sm:py-20 md:py-24 lg:py-32 ${
          isCertifications || isContact || isAbout
            ? "lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-12"
            : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-10 ${isContact || isAbout ? "max-w-4xl" : "max-w-3xl"}`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur sm:mb-6 sm:px-4 sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {eyebrow}
          </div>
          <h1
              className={`text-4xl font-bold leading-[0.98] text-balance sm:text-5xl md:text-6xl lg:text-7xl ${
              isContact || isAbout ? "max-w-[13ch] lg:max-w-[12ch]" : "max-w-[11ch] md:max-w-[12ch] lg:max-w-none"
            }`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`mt-5 text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg md:text-xl ${
                isContact || isAbout ? "max-w-3xl" : "max-w-xl sm:max-w-2xl"
              }`}
            >
              {description}
            </p>
          )}
          {isCertifications && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3"
            >
              {["ISO 9001:2015", "Verified Records", "Trusted Compliance"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/88 backdrop-blur sm:px-4 sm:py-2 sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          )}
          {isContact && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {[
                { label: "Call Direct", value: "+91 98241 24043", icon: Phone },
                { label: "Call Direct", value: "+91 8000641312", icon: Phone },
                { label: "WhatsApp", value: "Fast response", icon: MessageCircle },
                { label: "Business Hours", value: "Mon - Sat, 9:30 - 7:30", icon: Clock3 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
                    <item.icon className="h-3.5 w-3.5 text-emerald-200" />
                    {item.label}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white sm:text-base">
                    {item.value}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {isAbout && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {[
                { label: "Founded", value: "2018", icon: BadgeCheck },
                { label: "Coverage", value: "Pan-India supply", icon: Boxes },
                { label: "Focus", value: "Marble, FRP, composites", icon: Factory },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
                    <item.icon className="h-3.5 w-3.5 text-emerald-200" />
                    {item.label}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white sm:text-base">
                    {item.value}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
        {isCertifications && <CertificationHeroVisual />}
        {isContact && <ContactHeroVisual />}
        {isAbout && <AboutHeroVisual />}
      </div>
    </section>
  );
}

function CertificationHeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-10 h-[250px] max-w-[420px] sm:mt-12 sm:h-[290px] md:h-[320px] lg:mt-0 lg:h-[380px] lg:max-w-none"
    >
      <div className="absolute inset-4 rounded-[2rem] border border-white/10 bg-white/6 backdrop-blur-xl sm:inset-8 sm:rounded-[2.4rem] lg:inset-10 lg:rounded-[2.75rem]" />
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-7, -5, -7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 top-2 w-[min(76vw,260px)] rounded-[1.6rem] border border-white/14 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:left-2 sm:top-6 sm:w-[260px] sm:rounded-[1.85rem] sm:p-5 lg:top-8 lg:w-[280px] lg:rounded-[2rem]"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/10 sm:h-12 sm:w-12">
            <BadgeCheck className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/60">
              Certified Standard
            </div>
            <div className="mt-1 text-lg font-bold text-white sm:text-xl lg:text-2xl">
              ISO 9001:2015
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-2 rounded-full bg-white/20" />
          <div className="h-2 w-11/12 rounded-full bg-white/12" />
          <div className="h-2 w-8/12 rounded-full bg-white/12" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [5, 7, 5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[min(80vw,280px)] rounded-[1.6rem] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] p-4 shadow-2xl backdrop-blur-xl sm:bottom-4 sm:right-2 sm:w-[280px] sm:rounded-[1.85rem] sm:p-5 lg:bottom-10 lg:right-6 lg:w-[300px] lg:rounded-[2rem] lg:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
              Audit Snapshot
            </div>
            <div className="mt-2 text-lg font-bold leading-tight text-white sm:text-xl">
              Recognition that feels official
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/10 sm:h-11 sm:w-11">
            <FileCheck2 className="h-4 w-4 text-white sm:h-5 sm:w-5" strokeWidth={1.8} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs text-white/78 sm:mt-5 sm:gap-3 sm:text-sm">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">Status</div>
            <div className="mt-2 font-semibold text-white">Active</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">Review</div>
            <div className="mt-2 font-semibold text-white">Monitored</div>
          </div>
        </div>
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.05, 1], y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-2 top-1/2 grid h-16 w-16 -translate-y-1/2 place-items-center rounded-full border border-white/14 bg-white/10 shadow-glow backdrop-blur-xl sm:right-4 sm:h-20 sm:w-20 lg:right-8 lg:h-24 lg:w-24"
      >
        <ShieldCheck
          className="h-7 w-7 text-white sm:h-9 sm:w-9 lg:h-11 lg:w-11"
          strokeWidth={1.7}
        />
      </motion.div>
    </motion.div>
  );
}

function ContactHeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-10 h-[300px] max-w-[430px] sm:mt-12 sm:h-[340px] md:h-[380px] lg:mt-0 lg:h-[430px] lg:max-w-none"
    >
      <div className="absolute inset-0 rounded-[2.3rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] shadow-2xl backdrop-blur-2xl" />
      <div className="absolute inset-5 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.2),transparent_30%),linear-gradient(180deg,rgba(3,25,14,0.5),rgba(4,42,23,0.25))]" />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-6 top-6 right-6 rounded-[1.6rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
              Dedicated Support
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              Reach sales without delay
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-emerald-300/14">
            <MessageCircle className="h-5 w-5 text-emerald-100" />
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/12 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
              Primary Contact
            </div>
            <div className="mt-2 whitespace-nowrap font-semibold text-white">
              +91 98241 24043
            </div>
            <div className="mt-2 whitespace-nowrap font-semibold text-white">
              +91 8000641312
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/12 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
              Service Window
            </div>
            <div className="mt-2 font-semibold text-white">
              Quotes, bulk orders, technical help
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [2, 4, 2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-6 w-[220px] rounded-[1.6rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/10">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">
              Silvassa Base
            </div>
            <div className="mt-1 text-sm font-semibold leading-6 text-white">
              Dadra & Nagar Haveli
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0], rotate: [-3, -1, -3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-6 w-[180px] rounded-[1.6rem] border border-white/12 bg-emerald-300/12 p-5 backdrop-blur-xl"
      >
        <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-100/70">
          Response Style
        </div>
        <div className="mt-2 text-lg font-bold text-white">
          Fast, direct, practical
        </div>
      </motion.div>
    </motion.div>
  );
}

function AboutHeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-10 h-[320px] max-w-[440px] sm:mt-12 sm:h-[360px] md:h-[400px] lg:mt-0 lg:h-[440px] lg:max-w-none"
    >
      <div className="absolute inset-0 rounded-[2.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] shadow-2xl backdrop-blur-2xl" />
      <div className="absolute inset-5 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_38%),linear-gradient(180deg,rgba(4,30,17,0.55),rgba(6,56,31,0.22))]" />

      <motion.div
        animate={{ y: [0, -8, 0], rotate: [-2, 0, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-6 top-6 right-10 rounded-[1.7rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
              Company Snapshot
            </div>
            <div className="mt-2 text-2xl font-bold leading-tight text-white">
              Built for dependable industrial supply
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-emerald-300/14">
            <ShieldCheck className="h-5 w-5 text-emerald-100" />
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/12 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
              Positioning
            </div>
            <div className="mt-2 font-semibold text-white">
              Premium materials with practical service
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/12 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
              Trust Signal
            </div>
            <div className="mt-2 font-semibold text-white">
              ISO 9001:2015 certified
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [2, 4, 2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-7 left-6 w-[190px] rounded-[1.6rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl"
      >
        <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">
          Core Markets
        </div>
        <div className="mt-3 space-y-2 text-sm font-semibold text-white">
          <div>Marble & Granite</div>
          <div>FRP Materials</div>
          <div>Composite Supplies</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-3, -1, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-9 right-6 w-[200px] rounded-[1.6rem] border border-white/12 bg-emerald-300/12 p-5 backdrop-blur-xl"
      >
        <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-100/70">
          Since
        </div>
        <div className="mt-2 text-4xl font-bold text-white">
          2018
        </div>
        <div className="mt-2 text-sm text-white/78">
          Growing with long-term industrial relationships.
        </div>
      </motion.div>
    </motion.div>
  );
}
