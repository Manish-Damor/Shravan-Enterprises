import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (images.length === 0) return;
      const normalized = (nextIndex + images.length) % images.length;
      setIndex(normalized);
    },
    [images.length],
  );

  const openAt = useCallback((i: number) => {
    goTo(i);
    setOpen(true);
  }, [goTo]);

  const showPrevious = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  const showNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrevious();
    }
    window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [open, showNext, showPrevious]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the close button when the modal opens.
    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (index > images.length - 1) {
      setIndex(0);
    }
  }, [images.length, index]);

  if (!images || images.length === 0) return null;

  const fullscreenViewer =
    open && isMounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[120] bg-black/92 p-3 backdrop-blur-sm sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Product image viewer ${index + 1} of ${images.length}`}
            onClick={() => setOpen(false)}
          >
            <div
              ref={dialogRef}
              className="relative mx-auto flex h-full max-h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[1.6rem] border border-white/15 bg-[linear-gradient(180deg,_rgba(20,24,20,0.98),_rgba(8,10,8,0.99))] shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:max-h-[calc(100vh-2rem)] md:rounded-[2rem] md:max-h-[calc(100vh-3rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 text-white/90 md:px-6 md:py-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                    Product Gallery
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    Image {index + 1} of {images.length}
                  </div>
                </div>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close gallery"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:bg-white/14"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-3 sm:px-3 sm:py-4 md:px-6 md:py-6">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white shadow-lg transition hover:bg-black/60 sm:left-4 sm:h-12 sm:w-12"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_rgba(255,255,255,0.02)_45%,_rgba(255,255,255,0.01)_100%)] p-3 sm:p-4 md:rounded-[1.5rem] md:p-8">
                  <img
                    src={images[index] || undefined}
                    alt={`Image ${index + 1} of ${images.length}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white shadow-lg transition hover:bg-black/60 sm:right-4 sm:h-12 sm:w-12"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              <div className="shrink-0 border-t border-white/10 px-4 py-3 md:px-6 md:py-4">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border p-2 transition ${
                        index === i
                          ? "border-white/80 bg-white/12 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
                          : "border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]"
                      }`}
                      aria-label={`Open image ${i + 1}`}
                      aria-pressed={index === i}
                    >
                      <img
                        src={src || undefined}
                        alt={`Gallery thumbnail ${i + 1}`}
                        className="max-h-16 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-lg font-semibold text-foreground">Product Images</h4>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {images.length} image{images.length === 1 ? "" : "s"}
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-border/80 bg-[linear-gradient(160deg,_oklch(0.99_0.006_150),_oklch(0.955_0.012_150))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-[1.1rem] border border-white/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(236,242,236,0.75)_45%,_rgba(226,234,226,0.9)_100%)] px-12 py-4">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous product image"
            className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-foreground shadow-sm transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => openAt(index)}
            className="flex h-full w-full cursor-zoom-in items-center justify-center"
            aria-label={`Open product image ${index + 1} in fullscreen`}
          >
            <img
              src={images[index] || undefined}
              alt={`Product image ${index + 1} of ${images.length}`}
              className="max-h-full max-w-full object-contain"
            />
          </button>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next product image"
            className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-foreground shadow-sm transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 px-1">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Viewer
          </div>
          <div className="rounded-full border border-border/70 bg-white/75 px-3 py-1 text-xs font-medium text-foreground/80">
            {index + 1} / {images.length}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`flex h-20 w-20 items-center justify-center rounded-xl border p-2 transition ${
              index === i
                ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_rgba(91,141,85,0.18)]"
                : "border-border bg-secondary/35 hover:border-primary/30 hover:bg-secondary/55"
            }`}
            aria-label={`Show product image ${i + 1}`}
            aria-pressed={index === i}
          >
            <img
              src={src || undefined}
              alt={`Product thumbnail ${i + 1}`}
              className="max-h-16 object-contain"
            />
          </button>
        ))}
      </div>

      {fullscreenViewer}
    </div>
  );
}
