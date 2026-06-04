import brandLogo from "@/assets/brand-logo.png";

export function BrandLogo({
  className = "",
  logoWrapClassName = "",
  imageClassName = "",
  copyClassName = "",
  textClassName = "",
  subtitleClassName = "",
  alt = "Shravan Enterprises logo",
}: {
  className?: string;
  logoWrapClassName?: string;
  imageClassName?: string;
  copyClassName?: string;
  textClassName?: string;
  subtitleClassName?: string;
  alt?: string;
}) {
  return (
    <div className={`inline-flex min-w-0 items-center gap-2 ${className}`.trim()}>
      <div
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-black/6 bg-white/96 p-0.5 shadow-[0_14px_34px_-24px_rgba(0,0,0,0.32)] backdrop-blur-sm ${logoWrapClassName}`.trim()}
      >
        <img
          src={brandLogo}
          alt={alt}
          className={`block h-9 w-auto max-w-none origin-center scale-[1.08] object-contain ${imageClassName}`.trim()}
          loading="eager"
        />
      </div>
      <div className={`min-w-0 leading-[1.02] ${copyClassName}`.trim()}>
        <div className={`text-sm font-bold tracking-tight ${textClassName}`.trim()}>
          Shravan Enterprises
        </div>
        <div
          className={`mt-1 text-[10px] font-medium tracking-[0.18em] uppercase ${subtitleClassName}`.trim()}
        >
          A Promise for Commitment
        </div>
      </div>
    </div>
  );
}
