import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((s) => Math.min(images.length - 1, s + 1));
      if (e.key === "ArrowLeft") setIndex((s) => Math.max(0, s - 1));
    }
    window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [open, images.length]);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      // focus close button for keyboard users
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    }
  }, [open]);

  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white/6 rounded-lg p-3">
      <div className="w-full h-48 overflow-hidden bg-white/3 rounded-md flex items-center justify-center cursor-zoom-in" onClick={() => openAt(0)}>
        <img src={images[0] || undefined} alt="product" className="max-h-44 object-contain" />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button key={i} onClick={() => openAt(i)} className="w-20 h-20 p-2 rounded-md bg-white/2 flex items-center justify-center">
            <img src={src || undefined} className="max-h-16 object-contain" />
          </button>
        ))}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/80 grid place-items-center" role="dialog" aria-modal="true" aria-label={`Image gallery for ${images[index]}`}>
          <div className="absolute top-6 right-6">
            <button ref={closeBtnRef} onClick={() => setOpen(false)} aria-label="Close gallery" className="p-2 rounded-full bg-white/10">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center">
            <button onClick={() => setIndex((s) => Math.max(0, s - 1))} aria-label="Previous image" className="absolute left-0 p-3">
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            <img src={images[index] || undefined} alt={`Image ${index + 1} of ${images.length}`} className="max-h-[80vh] max-w-[82vw] object-contain mx-auto" />

            <button onClick={() => setIndex((s) => Math.min(images.length - 1, s + 1))} aria-label="Next image" className="absolute right-0 p-3">
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
