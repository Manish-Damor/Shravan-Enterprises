import brandLogo from "@/assets/brand-logo.png";

export function BrandLogo({
  className = "",
  logoWrapClassName = "",
  imageClassName = "",
  textClassName = "",
  subtitleClassName = "",
  alt = "Shravan Enterprises logo",
}: {
  className?: string;
  logoWrapClassName?: string;
  imageClassName?: string;
  textClassName?: string;
  subtitleClassName?: string;
  alt?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`.trim()}>
      <div
        className={`inline-flex items-center rounded-[0.95rem] border border-black/6 bg-white/96 px-1.5 py-1 shadow-[0_14px_34px_-24px_rgba(0,0,0,0.32)] backdrop-blur-sm ${logoWrapClassName}`.trim()}
      >
        <img
          src={brandLogo}
          alt={alt}
          className={`block h-9 w-auto object-contain ${imageClassName}`.trim()}
          loading="eager"
        />
      </div>
      <div className="leading-tight">
        <div className={`text-sm font-bold tracking-tight ${textClassName}`.trim()}>
          Shravan Enterprises
        </div>
        <div
          className={`text-[10px] font-medium tracking-[0.22em] uppercase ${subtitleClassName}`.trim()}
        >
          A Promise for Commitment
        </div>
      </div>
    </div>
  );
}
